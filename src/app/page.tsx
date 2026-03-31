import { createClient } from '@/lib/supabase/server'
import AppCard from '@/components/AppCard'
import RankingTabs from '@/components/RankingTabs'
import TagCloud from '@/components/TagCloud'
import type { App } from '@/types'

export const revalidate = 60

type Period = 'daily' | 'weekly' | 'monthly' | 'all'
const VALID_PERIODS: Period[] = ['daily', 'weekly', 'monthly', 'all']

function getPeriodStart(period: Period): string | null {
  const now = new Date()
  if (period === 'daily') { now.setDate(now.getDate() - 1); return now.toISOString() }
  if (period === 'weekly') { now.setDate(now.getDate() - 7); return now.toISOString() }
  if (period === 'monthly') { now.setMonth(now.getMonth() - 1); return now.toISOString() }
  return null
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; q?: string; tag?: string }>
}) {
  const { period: rawPeriod, q, tag } = await searchParams
  const period: Period = VALID_PERIODS.includes(rawPeriod as Period) ? (rawPeriod as Period) : 'all'
  const searchQuery = q?.trim() ?? ''

  const supabase = await createClient()

  // アプリ一覧クエリを構築
  let appsQuery = supabase
    .from('apps')
    .select('*, author:profiles(id, username, avatar_url)')
    .order('likes_count', { ascending: false })
    .limit(30)

  const periodStart = getPeriodStart(period)
  if (periodStart) appsQuery = appsQuery.gte('created_at', periodStart)
  if (searchQuery) appsQuery = appsQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  if (tag) appsQuery = appsQuery.contains('tags', [tag])

  // getUser と appsクエリを並列実行
  const [{ data: { user } }, { data: apps }] = await Promise.all([
    supabase.auth.getUser(),
    appsQuery,
  ])

  // いいね済みセット（userが確定してから実行）
  let likedAppIds = new Set<string>()
  if (user) {
    const { data: likes } = await supabase
      .from('likes')
      .select('app_id')
      .eq('user_id', user.id)
    if (likes) likedAppIds = new Set(likes.map((l: { app_id: string }) => l.app_id))
  }

  // 人気タグ集計（appsクエリの結果を再利用、別クエリ廃止）
  const tagCounts: Record<string, number> = {}
  for (const app of apps ?? []) {
    for (const t of app.tags ?? []) {
      if (t) tagCounts[t] = (tagCounts[t] ?? 0) + 1
    }
  }
  const popularTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([t, count]) => ({ tag: t, count }))

  const isFiltered = searchQuery || tag

  return (
    <div>
      {/* ヒーローセクション */}
      {!isFiltered && period === 'all' && (
        <div className="mb-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              AIと一緒に作ったアプリが集まる場所
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="gradient-text">バイブコーディング</span>
              <br />
              <span className="text-gray-800">アプリを発見しよう</span>
            </h1>
            <p className="text-gray-500 mt-3 text-sm max-w-md mx-auto">
              Claude・Cursor・LovableなどのAIツールで作ったアプリを投稿・共有できるプラットフォームです
            </p>
          </div>

          {/* バイブコーディングとは */}
          <div className="grid grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto">
            {[
              { step: '1', icon: '💬', title: 'AIに話しかける', desc: '作りたいものを自然言語で伝えるだけ' },
              { step: '2', icon: '⚡', title: 'コードが生成される', desc: 'AIが自動でコードを書いてくれる' },
              { step: '3', icon: '🚀', title: 'デプロイ完了', desc: 'そのままVercelなどに公開できる' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/80 text-center">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-xs font-bold text-indigo-600 mb-1">STEP {step}</div>
                <div className="text-xs font-semibold text-gray-800 mb-1">{title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>

          {/* 件数バッジ */}
          {apps && apps.length > 0 && (
            <div className="text-center">
              <span className="text-xs text-gray-400">
                現在 <span className="font-bold text-indigo-600">{apps.length}</span> 件のアプリが投稿されています
              </span>
            </div>
          )}
        </div>
      )}

      {/* 検索結果 / タグフィルタ のヘッダー */}
      {isFiltered && (
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {searchQuery && <span>「<span className="font-semibold text-gray-800">{searchQuery}</span>」の検索結果</span>}
            {tag && <span>#<span className="font-semibold text-gray-800">{tag}</span> のアプリ</span>}
            <span className="ml-2 text-gray-400">({apps?.length ?? 0}件)</span>
          </p>
        </div>
      )}

      <div className="flex gap-6 items-start">
        {/* メインコンテンツ */}
        <div className="flex-1 min-w-0">
          {!isFiltered && (
            <div className="mb-5">
              <RankingTabs current={period} />
            </div>
          )}

          {apps && apps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {apps.map((app: App, i) => (
                <AppCard
                  key={app.id}
                  app={app}
                  currentUserId={user?.id}
                  initialLiked={likedAppIds.has(app.id)}
                  rank={!isFiltered ? i + 1 : undefined}
                  priority={i < 4}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 bg-white/60 rounded-2xl">
              <p className="text-lg font-medium">該当するアプリが見つかりません</p>
              <p className="mt-1 text-sm">別のキーワードやタグで試してみてください</p>
            </div>
          )}
        </div>

        {/* サイドバー */}
        <aside className="w-56 flex-shrink-0 hidden lg:block space-y-4">
          <TagCloud tags={popularTags} currentTag={tag} />

          {/* 投稿CTA */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-sm">
            <p className="font-bold text-sm mb-1">あなたのアプリを</p>
            <p className="font-bold text-sm mb-3">シェアしよう！</p>
            <a
              href="/apps/new"
              className="block text-center bg-white text-indigo-700 text-xs font-bold px-3 py-2 rounded-full hover:bg-indigo-50 transition-colors"
            >
              + 投稿する
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}
