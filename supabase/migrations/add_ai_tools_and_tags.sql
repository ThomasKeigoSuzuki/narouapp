-- ai_tools と tags カラムを apps テーブルに追加
alter table public.apps
  add column if not exists ai_tools text[] default '{}' not null,
  add column if not exists tags text[] default '{}' not null;
