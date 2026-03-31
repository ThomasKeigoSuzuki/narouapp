-- コメントテーブル
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  app_id uuid references public.apps(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  body text not null check (length(body) >= 1 and length(body) <= 1000)
);

alter table public.comments enable row level security;

create policy "コメントは誰でも閲覧可能" on public.comments
  for select using (true);

create policy "認証済みユーザーはコメント投稿可能" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "自分のコメントは削除可能" on public.comments
  for delete using (auth.uid() = user_id);

-- フォローテーブル
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

alter table public.follows enable row level security;

create policy "フォロー情報は誰でも閲覧可能" on public.follows
  for select using (true);

create policy "認証済みユーザーはフォロー可能" on public.follows
  for insert with check (auth.uid() = follower_id);

create policy "自分のフォローは削除可能" on public.follows
  for delete using (auth.uid() = follower_id);

-- Supabase Storage: screenshotsバケット作成と公開設定
insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', true)
on conflict (id) do nothing;

create policy "スクリーンショットは誰でも閲覧可能" on storage.objects
  for select using (bucket_id = 'screenshots');

create policy "認証済みユーザーはアップロード可能" on storage.objects
  for insert with check (
    bucket_id = 'screenshots' and auth.uid() is not null
  );

create policy "自分のファイルは削除可能" on storage.objects
  for delete using (
    bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text
  );
