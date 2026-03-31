-- プロフィールテーブル (auth.users と連携)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- アプリ投稿テーブル
create table public.apps (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  title text not null,
  description text not null,
  url text not null,
  thumbnail_url text,
  user_id uuid references public.profiles(id) on delete cascade not null,
  likes_count integer default 0 not null
);

-- いいねテーブル
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  app_id uuid references public.apps(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  unique(app_id, user_id)
);

-- RLS (Row Level Security) 有効化
alter table public.profiles enable row level security;
alter table public.apps enable row level security;
alter table public.likes enable row level security;

-- Profiles ポリシー
create policy "プロフィールは誰でも閲覧可能" on public.profiles
  for select using (true);

create policy "自分のプロフィールは更新可能" on public.profiles
  for update using (auth.uid() = id);

create policy "サインアップ時にプロフィール作成" on public.profiles
  for insert with check (auth.uid() = id);

-- Apps ポリシー
create policy "アプリは誰でも閲覧可能" on public.apps
  for select using (true);

create policy "認証済みユーザーはアプリを投稿可能" on public.apps
  for insert with check (auth.uid() = user_id);

create policy "自分のアプリは更新可能" on public.apps
  for update using (auth.uid() = user_id);

create policy "自分のアプリは削除可能" on public.apps
  for delete using (auth.uid() = user_id);

-- Likes ポリシー
create policy "いいねは誰でも閲覧可能" on public.likes
  for select using (true);

create policy "認証済みユーザーはいいね可能" on public.likes
  for insert with check (auth.uid() = user_id);

create policy "自分のいいねは削除可能" on public.likes
  for delete using (auth.uid() = user_id);

-- いいね数を自動更新するトリガー
create or replace function update_likes_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.apps set likes_count = likes_count + 1 where id = NEW.app_id;
  elsif TG_OP = 'DELETE' then
    update public.apps set likes_count = likes_count - 1 where id = OLD.app_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_like_change
  after insert or delete on public.likes
  for each row execute function update_likes_count();

-- 新規ユーザー登録時にプロフィールを自動作成
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
