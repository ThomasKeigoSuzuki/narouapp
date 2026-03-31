import { createClient } from '@/lib/supabase/server'
import AppCard from '@/components/AppCard'
import RankingTabs from '@/components/RankingTabs'
import TagCloud from '@/components/TagCloud'
import type { App } from '@/types'

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
  const { data: { user } } = await supabase.auth.getUser()

  // アプリ一覧クエリ
  let query = supabase
    .from('apps')
    .select('*, author:profiles(id, username, avatar_url)')
    .order('likes_count', { ascending: false })
    .limit(30)

  const periodStart = getPeriodStart(period)
  if (periodStart) query = query.gte('created_at', periodStart)
  if (searchQuery) query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  if (tag) query = query.contains('tags', [tag])

  const { data: apps } = await query

  // いいね済みセット
  let likedAppIds = new Set<string>()
  if (user) {
    const { data: likes } = await supabase.from('likes').select('app_id').eq('user_id', user.id)
    if (likes) likedAppIds = new Set(likes.map((l: { app_id: string }) => l.app_id))
  }

  // 人気タグ集計（最新200件のアプリから）
  const { data: tagSource } = await supabase.from('apps').select('tags').limit(200)
  const tagCounts: Record<string, number> = {}
  for (const row of tagSource ?? []) {
    for (const t of row.tags ?? []) {
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
      {/* ヒーローヘッダー */}
      {!isFiltered && period === 'all' && (
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="gradient-text">バイブコーディング</span>
            <span className="text-gray-800">アプリを発見</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">AIと一緒に作ったアプリをシェアしよう</p>
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
