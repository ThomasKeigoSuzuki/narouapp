import { createClient } from '@/lib/supabase/server'
import AppCard from '@/components/AppCard'
import RankingTabs from '@/components/RankingTabs'
import type { App } from '@/types'

type Period = 'daily' | 'weekly' | 'monthly' | 'all'

const VALID_PERIODS: Period[] = ['daily', 'weekly', 'monthly', 'all']

function getPeriodStart(period: Period): string | null {
  const now = new Date()
  if (period === 'daily') {
    now.setDate(now.getDate() - 1)
    return now.toISOString()
  }
  if (period === 'weekly') {
    now.setDate(now.getDate() - 7)
    return now.toISOString()
  }
  if (period === 'monthly') {
    now.setMonth(now.getMonth() - 1)
    return now.toISOString()
  }
  return null
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const { period: rawPeriod } = await searchParams
  const period: Period = VALID_PERIODS.includes(rawPeriod as Period)
    ? (rawPeriod as Period)
    : 'all'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('apps')
    .select('*, author:profiles(id, username, avatar_url)')
    .order('likes_count', { ascending: false })
    .limit(20)

  const periodStart = getPeriodStart(period)
  if (periodStart) {
    query = query.gte('created_at', periodStart)
  }

  const { data: apps } = await query

  let likedAppIds = new Set<string>()
  if (user) {
    const { data: likes } = await supabase
      .from('likes')
      .select('app_id')
      .eq('user_id', user.id)
    if (likes) {
      likedAppIds = new Set(likes.map((l: { app_id: string }) => l.app_id))
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">みんなのアプリ</h1>
        <p className="text-gray-500 mt-1">バイブコーディングで作られたアプリを発見しよう</p>
      </div>

      <div className="mb-6">
        <RankingTabs current={period} />
      </div>

      {apps && apps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app: App) => (
            <AppCard
              key={app.id}
              app={app}
              currentUserId={user?.id}
              initialLiked={likedAppIds.has(app.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">この期間にアプリが投稿されていません</p>
          <p className="mt-2 text-sm">別の期間を選ぶか、最初の投稿者になりましょう！</p>
        </div>
      )}
    </div>
  )
}
