-- 店（アプリ）に「休業中」の札を出せるようにする。
-- アプリが一時的に動かないときに、掲載は続けたまま、一覧と店のページで知らせるため。
-- 店主は編集画面で札を出したり外したりできる（既存の「自分のアプリは更新可能」のRLSの範囲内）。
alter table public.apps
  add column if not exists is_paused boolean not null default false;

comment on column public.apps.is_paused is
  '休業中の札を出している店なら true。掲載は続け、一覧と店のページで休業中と知らせる';
