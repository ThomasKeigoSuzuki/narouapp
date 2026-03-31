import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/site-url'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'
import FollowButton from '@/components/FollowButton'
import ShareButton from '@/components/ShareButton'
import type { Comment } from '@/types'

type Props = { params: Promise<{ id: string }> }

async function getApp(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('apps')
    .select('*, author:profiles(id, username, avatar_url)')
    .eq('id', id)
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const app = await getApp(id)
  if (!app) return {}

  const siteUrl = getSiteUrl()
  const pageUrl = `${siteUrl}/apps/${id}`

  return {
    title: `${app.title} | なろうApp`,
    description: app.description,
    openGraph: {
      title: app.title,
      description: app.description,
      url: pageUrl,
      siteName: 'なろうApp',
      ...(app.thumbnail_url && {
        images: [{ url: app.thumbnail_url, width: 1200, height: 630 }],
      }),
      type: 'website',
    },
    twitter: {
      card: app.thumbnail_url ? 'summary_large_image' : 'summary',
      title: app.title,
      description: app.description,
      ...(app.thumbnail_url && { images: [app.thumbnail_url] }),
    },
  }
}

export default async function AppDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const app = await getApp(id)
  if (!app) notFound()

  // いいね済みか
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

  // コメント取得
  const { data: comments } = await supabase
    .from('comments')
    .select('*, author:profiles(id, username, avatar_url)')
    .eq('app_id', id)
    .order('created_at', { ascending: true })

  // フォロワー数・フォロー済みか
  const { count: followerCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', app.author?.id)

  let isFollowing = false
  const isOwnApp = user?.id === app.user_id
  if (user && !isOwnApp && app.author?.id) {
    const { data: followData } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('follower_id', user.id)
      .eq('following_id', app.author.id)
      .maybeSingle()
    isFollowing = !!followData
  }

  const createdAt = new Date(app.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const siteUrl = getSiteUrl()
  const shareUrl = `${siteUrl}/apps/${id}`

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        一覧に戻る
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* サムネイル */}
        <div className="aspect-video bg-gray-100 relative flex items-center justify-center text-gray-400">
          {app.thumbnail_url ? (
            <Image src={app.thumbnail_url} alt={app.title} fill className="object-cover" />
          ) : (
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* タイトル・いいね・シェア */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{app.title}</h1>
            <div className="flex items-center gap-2 flex-shrink-0">
              <ShareButton title={app.title} shareUrl={shareUrl} />
              <LikeButton
                appId={app.id}
                initialCount={app.likes_count}
                initialLiked={liked}
                currentUserId={user?.id}
              />
            </div>
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

          {/* 投稿者・フォローボタン・日時 */}
          <div className="border-t border-gray-100 pt-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                {app.author?.username?.[0]?.toUpperCase() ?? '?'}
              </div>
              <span className="text-sm font-medium text-gray-800">{app.author?.username ?? '匿名'}</span>
              {user && !isOwnApp && app.author?.id && (
                <FollowButton
                  targetUserId={app.author.id}
                  currentUserId={user.id}
                  initialFollowing={isFollowing}
                  initialFollowerCount={followerCount ?? 0}
                />
              )}
            </div>
            <span className="text-sm text-gray-400">{createdAt}</span>
          </div>

          {/* コメントセクション */}
          <div className="border-t border-gray-100 pt-6">
            <CommentSection
              appId={app.id}
              initialComments={(comments ?? []) as Comment[]}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
