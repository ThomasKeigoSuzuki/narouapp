@AGENTS.md

# アプリ横丁 運営マニュアル（Claude向け）

アプリ横丁（旧称：なろうApp。英語表記・URLは narouapp のまま）を開発・運営するClaudeのための前提とルールです。チャット、GitHub上の `@claude`、定期タスクのどこから動く場合も、このファイルに従ってください。

## サービス
- バイブコーディング（AIを使った開発）で作られたアプリを投稿・閲覧・評価するプラットフォーム
- 本番: https://narouapp.vercel.app （独自ドメインは準備中）
- 目標: 外部の作り手を増やし、将来はAI製アプリの売買マーケットへ広げる
- オーナー: Thomas Suzuki。承認・契約・課金・法務判断はオーナーが行う
- 改善計画: Claude Docs「なろうアプリ 成長戦略と運営体制プラン」 https://claude.ai/code/artifact/277a1153-5d3c-4e93-94e1-1de6c0ad6898

## 技術構成
- Next.js 16（App Router）、React 19、TypeScript、Tailwind CSS 4
- Supabase: Postgres、認証（Googleログイン）、画像ストレージ（`screenshots` バケット）
- Vercel: ホスティング。`main` へのマージで本番デプロイ、PRごとにプレビュー環境
- 主なテーブル: `profiles` `apps` `likes` `comments` `follows` `reports`（すべてRLS有効）

## ディレクトリ
- `src/app` … ページとAPI（`api/apps` 投稿API、`admin` 管理画面、`sitemap.ts`、`robots.ts`）
- `src/components` … UI部品
- `src/lib/supabase` … Supabaseクライアント（`server.ts` / `client.ts`）
- `src/proxy.ts` … セッション更新（Next.js 16 の proxy。旧 middleware）
- `supabase/` … スキーマとマイグレーション

## コマンド
- `npm run dev` / `npm run build` / `npm run lint`
- 型チェック: `npx tsc --noEmit`
- PRを出す前に lint と型チェックを通す（CIでも実行される）

## 開発ルール
- `main` に直接 push しない。ブランチ → PR → オーナーの承認でマージ
- 1つのPRは1つの目的に絞る。本文に「目的・変更点・確認方法・オーナーに見てほしい点」を書く
- Next.js 16 は破壊的変更が多い。APIを使う前に `node_modules/next/dist/docs/` を確認する
- UI文言は日本語。デザインは既存の暖色系（オレンジ〜レッド）に合わせる

## データベース
- スキーマ変更は新しいマイグレーションファイルで行う: `supabase/migrations/<YYYYMMDDHHMMSS>_<内容>.sql`
- `supabase/schema.sql` と日付なしのマイグレーション3本は、手動で適用済みの初期状態。再実行しない
- 本番DBへの適用は、PRがマージされた後にオーナーの承認を得てから行う
- 定期タスクなど無人で動くときは、DBを読み取りにしか使わない
- RLSを無効にしない。`SUPABASE_SERVICE_ROLE_KEY` はサーバー側（API Route）だけで使う

## 秘密情報
- APIキーやトークンを、コード・Issue・PR・チャットに書かない。置き場所は Vercel の環境変数と GitHub Secrets のみ
- 主な環境変数: `NEXT_PUBLIC_SUPABASE_URL` `NEXT_PUBLIC_SUPABASE_ANON_KEY` `NEXT_PUBLIC_SITE_URL` `SUPABASE_SERVICE_ROLE_KEY` `API_SECRET_KEY`
- このリポジトリは公開されている。コミット前に秘密情報が含まれていないか確認する

## 投稿API
- `GET /api/apps`（認証なし）、`POST /api/apps`、`PATCH /api/apps/[id]`（`Authorization: Bearer <API_SECRET_KEY>`）
- 現状、API経由の投稿はすべて管理者名義になる。ユーザー別キーへの移行を予定

## 定期運用
| 頻度 | 作業 |
| --- | --- |
| 毎日 | 新着投稿の確認（URLの生存、不適切な内容、スパム）と通報の一次仕分け。要対応のときだけ報告 |
| 毎週 | KPIレポート（外部投稿者数、新規作品数、いいね・コメント数）と「今週の新作」投稿の下書き |
| 毎週 | 依存パッケージの更新とセキュリティ確認。必要ならPR |
| 毎月 | 競合ウォッチ、検索流入と費用の点検、改善案をIssueに起票 |

## オーナーの承認が必要なこと
- `main` へのマージ、本番DBへのマイグレーション適用、データの削除
- X など外部への公開投稿、ユーザーへの返信の送信
- 利用規約・プライバシーポリシーの変更
- 課金・契約・ドメイン・アカウントに関わる操作（Claudeは行わない）
