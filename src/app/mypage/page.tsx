import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppCard from '@/components/AppCard'
import BadgeList from '@/components/BadgeList'
import type { App } from '@/types'

export default async function MyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [
    { data: profile },
    { data: apps },
    { count: followerCount },
    { count: followingCount },
    { data: weeklyTop },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('apps')
      .select('*, author:profiles(id, username, avatar_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', user.id),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', user.id),
    supabase
      .from('apps')
      .select('user_id, likes_count')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('likes_count', { ascending: false })
      .limit(1),
  ])

  const totalLikes = apps?.reduce((sum, app) => sum + (app.likes_count ?? 0), 0) ?? 0
  const isWeeklyTop = weeklyTop?.[0]?.user_id === user.id && (weeklyTop[0]?.likes_count ?? 0) > 0

  const badges = [
    {
      id: 'first_post',
      icon: '🚀',
      label: '初投稿',
      description: '最初のアプリを投稿した',
      earned: (apps?.length ?? 0) >= 1,
    },
    {
      id: 'likes_10',
      icon: '❤️',
      label: 'いいね10',
      description: '合計いいね数10件達成',
      earned: totalLikes >= 10,
    },
    {
      id: 'likes_50',
      icon: '🔥',
      label: 'いいね50',
      description: '合計いいね数50件達成',
      earned: totalLikes >= 50,
    },
    {
      id: 'weekly_top',
      icon: '👑',
      label: '週間1位',
      description: '週間ランキング1位を獲得',
      earned: isWeeklyTop,
    },
  ]

  return (
    <div>
      {/* プロフィールカード */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-sm flex-shrink-0">
            {profile?.username?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-gray-900">{profile?.username ?? '匿名'}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span><span className="font-semibold text-gray-800">{apps?.length ?? 0}</span> 件投稿</span>
              <span><span className="font-semibold text-gray-800">{followerCount ?? 0}</span> フォロワー</span>
              <span><span className="font-semibold text-gray-800">{followingCount ?? 0}</span> フォロー中</span>
              <span><span className="font-semibold text-pink-600">{totalLikes}</span> いいね獲得</span>
            </div>
          </div>
        </div>

        {/* バッジ */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <BadgeList badges={badges} />
        </div>
      </div>

      {/* 投稿したアプリ */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">投稿したアプリ</h2>
        <Link
          href="/apps/new"
          className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
        >
          + アプリを投稿
        </Link>
      </div>

      {apps && apps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app: App) => (
            <AppCard
              key={app.id}
              app={app}
              currentUserId={user.id}
              initialLiked={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 bg-white/60 rounded-2xl">
          <p className="text-lg">まだアプリを投稿していません</p>
          <Link
            href="/apps/new"
            className="mt-4 inline-block text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            最初のアプリを投稿する
          </Link>
        </div>
      )}
    </div>
  )
}
