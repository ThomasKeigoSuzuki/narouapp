-- 「アプリを開く」が押された回数（遊ばれた回数）を数える
--
-- 1. apps.play_count … 店のページに出す合計
-- 2. app_plays       … 押された日時の記録。月ごとの回数や、よく遊ばれている店を出すのに使う
--                      だれが押したかは残さない
-- 3. record_app_play … 1回分を数える関数。サーバー（API Route）から service_role でだけ呼ぶ
--                      店主が自分の店で押した分は数えない
-- 4. 店主が自分の店の play_count をAPIから書きかえられないようにする
--    （apps の更新ポリシーは、自分の店ならどの列でも更新できるため）
--
-- 同じ人が同じ日に何度押しても1回と数える仕組みは、API Route 側のクッキーで行う

alter table public.apps
  add column if not exists play_count integer not null default 0;

comment on column public.apps.play_count is
  '「アプリを開く」が押された回数の合計。同じ人の同じ日の重複と、店主自身の分は数えない';

create table if not exists public.app_plays (
  id bigint generated always as identity primary key,
  app_id uuid not null references public.apps (id) on delete cascade,
  played_at timestamptz not null default now()
);

comment on table public.app_plays is
  '「アプリを開く」が押された記録。だれが押したかは残さない';

create index if not exists app_plays_app_id_played_at_idx
  on public.app_plays (app_id, played_at);

-- ポリシーは作らない。anon・authenticated からは読み書きできず、service_role だけが使える
alter table public.app_plays enable row level security;
revoke all on table public.app_plays from anon, authenticated;

create or replace function public.record_app_play(target_app_id uuid, viewer_id uuid default null)
returns boolean
language plpgsql
set search_path = ''
as $$
begin
  update public.apps
     set play_count = play_count + 1
   where id = target_app_id
     and user_id is distinct from viewer_id;

  if not found then
    return false;
  end if;

  insert into public.app_plays (app_id) values (target_app_id);
  return true;
end;
$$;

revoke execute on function public.record_app_play(uuid, uuid) from public, anon, authenticated;
grant execute on function public.record_app_play(uuid, uuid) to service_role;

create or replace function public.keep_play_count()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user in ('anon', 'authenticated') then
    new.play_count := old.play_count;
  end if;
  return new;
end;
$$;

revoke execute on function public.keep_play_count() from public, anon, authenticated;

drop trigger if exists keep_play_count on public.apps;
create trigger keep_play_count
  before update of play_count on public.apps
  for each row execute function public.keep_play_count();
