-- 「ゆずります」の札：店主が、店（アプリ）を次の店主に引き継ぎたいときに出す札
--
-- ・is_for_sale    … 札を出しているか
-- ・asking_price   … 店主が付けた希望の値段（円）。空なら「相談」。横丁は値段を計算しない
-- ・sale_contact   … 店主の連絡先（XのIDか、https のURL）。買いたい人は店主に直接連絡する
-- ・for_sale_since … 札を出した日時。トリガーが決める（札を外すと空に戻る）
--
-- 横丁は売り買いを仲介しない。店主は編集画面で札を出したり外したりできる
-- （既存の「自分のアプリは更新可能」のRLSの範囲内）

alter table public.apps
  add column if not exists is_for_sale boolean not null default false,
  add column if not exists asking_price integer,
  add column if not exists sale_contact text,
  add column if not exists for_sale_since timestamptz;

comment on column public.apps.is_for_sale is '「ゆずります」の札を出している店なら true';
comment on column public.apps.asking_price is '店主が付けた希望の値段（円）。null なら「相談」。横丁は計算しない';
comment on column public.apps.sale_contact is '「ゆずります」の札の連絡先（XのIDか https のURL）。札を出している間だけ店のページに出す';
comment on column public.apps.for_sale_since is '「ゆずります」の札を出した日時。トリガー stamp_for_sale_since が決める';

alter table public.apps drop constraint if exists apps_asking_price_range;
alter table public.apps add constraint apps_asking_price_range
  check (asking_price is null or asking_price between 1 and 100000000);

alter table public.apps drop constraint if exists apps_sale_contact_length;
alter table public.apps add constraint apps_sale_contact_length
  check (sale_contact is null or char_length(sale_contact) <= 200);

alter table public.apps drop constraint if exists apps_for_sale_needs_contact;
alter table public.apps add constraint apps_for_sale_needs_contact
  check (not is_for_sale or char_length(btrim(coalesce(sale_contact, ''))) > 0);

-- 札を出した日時は、店主が書きかえられないように、札の出し入れからだけ決める
create or replace function public.stamp_for_sale_since()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not new.is_for_sale then
    new.for_sale_since := null;
  elsif tg_op = 'INSERT' or not old.is_for_sale then
    new.for_sale_since := now();
  else
    new.for_sale_since := old.for_sale_since;
  end if;
  return new;
end;
$$;

revoke execute on function public.stamp_for_sale_since() from public, anon, authenticated;

drop trigger if exists stamp_for_sale_since on public.apps;
create trigger stamp_for_sale_since
  before insert or update of is_for_sale, for_sale_since on public.apps
  for each row execute function public.stamp_for_sale_since();
