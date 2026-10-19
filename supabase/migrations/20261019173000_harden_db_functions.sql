-- DB関数の安全性を高める（Supabaseのセキュリティ診断の指摘への対応）
--
-- 1. handle_new_user と update_likes_count の検索パスを固定する
-- 2. どちらもトリガー専用なので、API（/rest/v1/rpc）から直接呼べないようにする
--    トリガーとしては今までどおり動く（トリガーの実行時には EXECUTE 権限を確認しない）
-- 3. 新規登録したときのユーザー名を「user_ + ユーザーIDの先頭12文字」にする
--    これまではメールアドレスの @ より前を使っていたため、次の問題があった
--    ・メールアドレスの一部が公開プロフィールに出てしまう
--    ・@ より前が同じ人がすでにいると、ユーザー名の重複で登録に失敗する
--    ユーザー名はマイページからいつでも変更できる

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    'user_' || substr(replace(new.id::text, '-', ''), 1, 12),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

alter function public.update_likes_count() set search_path = '';

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.update_likes_count() from public, anon, authenticated;
