-- Googleログイン時に full_name / name をユーザー名として使う
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
    set
      username = coalesce(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'username',
        split_part(new.email, '@', 1)
      ),
      avatar_url = new.raw_user_meta_data->>'avatar_url';
  return new;
end;
$$ language plpgsql security definer;

-- 既存ユーザーのユーザー名を auth.users のメタデータで一括更新
update public.profiles p
set
  username = coalesce(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    u.raw_user_meta_data->>'username',
    split_part(u.email, '@', 1)
  ),
  avatar_url = u.raw_user_meta_data->>'avatar_url'
from auth.users u
where p.id = u.id
  and (
    u.raw_user_meta_data->>'full_name' is not null
    or u.raw_user_meta_data->>'name' is not null
  );
