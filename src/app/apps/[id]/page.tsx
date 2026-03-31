import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LikeButton from '@/components/LikeButton'

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: app } = await supabase
    .from('apps')
    .select('*, author:profiles(id, username, avatar_url)')
    .eq('id', id)
    .single()

  if (!app) notFound()

  let liked = false
  if (user) {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('app_id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    liked = !!data
  }

  const createdAt = new Date(app.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto">
      {/* 戻るリンク */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        一覧に戻る
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* サムネイル */}
        <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <div className="p-6 space-y-6">
          {/* タイトル・いいね */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{app.title}</h1>
            <LikeButton
              appId={app.id}
              initialCount={app.likes_count}
              initialLiked={liked}
              currentUserId={user?.id}
            />
          </div>

          {/* アプリURLリンク */}
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            アプリを開く
          </a>

          {/* 概要 */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">概要</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{app.description}</p>
          </div>

          {/* 使用AIツール */}
          {app.ai_tools?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">使用AIツール</h2>
              <div className="flex flex-wrap gap-2">
                {app.ai_tools.map((tool: string) => (
                  <span key={tool} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* タグ */}
          {app.tags?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">タグ</h2>
              <div className="flex flex-wrap gap-2">
                {app.tags.map((tag: string) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 投稿者・日時 */}
          <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xs">
                {app.author?.username?.[0]?.toUpperCase() ?? '?'}
              </div>
              <span>{app.author?.username ?? '匿名'}</span>
            </div>
            <span>{createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
