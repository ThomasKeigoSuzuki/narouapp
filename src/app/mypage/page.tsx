import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppCard from '@/components/AppCard'
import type { App } from '@/types'

export default async function MyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: apps } = await supabase
    .from('apps')
    .select('*, author:profiles(id, username, avatar_url)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      {/* プロフィールヘッダー */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
          {profile?.username?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{profile?.username ?? '匿名'}</p>
          <p className="text-sm text-gray-500 mt-0.5">{apps?.length ?? 0} 件のアプリを投稿</p>
        </div>
      </div>

      {/* 投稿したアプリ */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">投稿したアプリ</h2>
        <Link
          href="/apps/new"
          className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + アプリを投稿
        </Link>
      </div>

      {apps && apps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
          <p className="text-lg">まだアプリを投稿していません</p>
          <Link
            href="/apps/new"
            className="mt-4 inline-block text-sm bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            最初のアプリを投稿する
          </Link>
        </div>
      )}
    </div>
  )
}
