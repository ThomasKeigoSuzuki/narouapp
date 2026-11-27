-- 番付を公正に保つ：店主が自分の店の「灯の数」と「出店日」をAPIから書きかえられないようにする
--
-- apps の更新ポリシーは「自分の店ならどの列でも更新できる」ため、これまでは
-- ログインした店主が Supabase のAPIを直接呼べば、次のことができた
-- ・likes_count（灯の数）を好きな数にする → 繁盛番付やマイページの「週間1位」に載れてしまう
-- ・created_at（出店日）を新しくする → 週間・月間の番付にずっと残れてしまう
--
-- このトリガーは、anon・authenticated（アプリのブラウザ側から使う役割）による
-- この2列の変更だけを取り消す。灯をともす・消すときの数の増減は、今までどおり
-- update_likes_count（security definer）が行うので影響しない。
-- 店名・説明・URLなど、ほかの列の編集も今までどおりできる

create or replace function public.keep_shop_records()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user in ('anon', 'authenticated') then
    new.likes_count := old.likes_count;
    new.created_at := old.created_at;
  end if;
  return new;
end;
$$;

revoke execute on function public.keep_shop_records() from public, anon, authenticated;

drop trigger if exists keep_shop_records on public.apps;
create trigger keep_shop_records
  before update of likes_count, created_at on public.apps
  for each row execute function public.keep_shop_records();
