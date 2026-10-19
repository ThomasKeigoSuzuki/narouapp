import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/site-url'
import { norenColor, norenEmblem } from '@/lib/noren'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'
import FollowButton from '@/components/FollowButton'
import ShareButton from '@/components/ShareButton'
import ReportButton from '@/components/ReportButton'
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
  // 改行を詰め、検索結果やシェアカードに収まる長さにする
  const flattened = Array.from(app.description.replace(/\s+/g, ' ').trim())
  const description = flattened.length > 120 ? `${flattened.slice(0, 119).join('')}…` : flattened.join('')

  // シェア用の画像は、同じフォルダの opengraph-image.tsx が作品ごとに生成する
  return {
    // 「| アプリ横丁」はレイアウトのテンプレートが付ける
    title: app.title,
    description,
    openGraph: {
      title: app.title,
      description,
      url: pageUrl,
      siteName: 'アプリ横丁',
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: app.title,
      description,
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

  // 通報済みか
  let reported = false
  if (user) {
    const { data: reportData } = await supabase
      .from('reports')
      .select('id')
      .eq('app_id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    reported = !!reportData
  }

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

  const emblem = norenEmblem(app.title)
  const noren = norenColor(app.id)
  const tools: string[] = (app.ai_tools ?? []).filter((t: string) => t && t !== 'その他')
  const owner: string = app.author?.username ?? '匿名'

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1.5 min-h-11 mb-4 text-sm text-sumi-soft hover:text-shu transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        横丁に戻る
      </Link>

      <article className="rounded-[3px] bg-kinari text-sumi shadow-[0_0_0_1px_rgba(110,67,37,.18),0_30px_60px_-30px_rgba(124,45,18,.45)]">
        {/* 軒と店先 */}
        <div aria-hidden="true" className="yk-eave h-4 rounded-t-[3px] border-b-[3px] border-wood" />
        <div className="relative aspect-video overflow-hidden bg-[#2a2036]">
          {app.thumbnail_url ? (
            <Image src={app.thumbnail_url} alt={`${app.title} の画面`} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
          ) : (
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center pt-12 font-mincho font-black text-8xl text-kinari/80">
              {emblem}
            </span>
          )}
          <span aria-hidden="true" className="absolute inset-x-6 top-0 grid grid-cols-3 gap-1.5">
            <span className="h-16 shadow-[0_10px_16px_-10px_rgba(0,0,0,.6)]" style={{ background: noren }} />
            <span className="h-16 flex items-center justify-center font-mincho font-black text-3xl text-kinari shadow-[0_10px_16px_-10px_rgba(0,0,0,.6)]" style={{ background: noren }}>
              {emblem}
            </span>
            <span className="h-16 shadow-[0_10px_16px_-10px_rgba(0,0,0,.6)]" style={{ background: noren }} />
          </span>
        </div>

        <div className="px-5 sm:px-8 pt-7 pb-8 flex flex-col gap-7">
          {/* 屋号と、店に入る・灯をともす・シェア */}
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-2 min-w-0">
              <h1 className="font-mincho font-black text-[26px] sm:text-[32px] leading-snug break-words min-w-0">{app.title}</h1>
              {isOwnApp && (
                <Link
                  href={`/apps/${id}/edit`}
                  aria-label="この作品を編集"
                  title="編集"
                  className="flex-none flex items-center justify-center w-11 h-11 rounded-full text-sumi-soft hover:text-shu hover:bg-[#f3e2c2] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Link>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 h-[52px] px-7 rounded-full bg-orange-500 text-yoru font-bold hover:bg-orange-400 transition-colors shadow-[0_12px_30px_-12px_rgba(249,115,22,.8)]"
              >
                アプリを開く
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <LikeButton appId={app.id} initialCount={app.likes_count} initialLiked={liked} currentUserId={user?.id} />
              <ShareButton title={app.title} shareUrl={shareUrl} />
            </div>
          </div>

          <section aria-labelledby="gaiyo-heading">
            <h2 id="gaiyo-heading" className="mb-2.5 font-display text-base tracking-[0.12em]">概要</h2>
            <p className="text-[15px] leading-[1.95] whitespace-pre-wrap break-words">{app.description}</p>
          </section>

          {(tools.length > 0 || app.tags?.length > 0) && (
            <div className="flex flex-wrap gap-x-10 gap-y-6">
              {tools.length > 0 && (
                <section aria-labelledby="ai-heading">
                  <h2 id="ai-heading" className="mb-2.5 font-display text-base tracking-[0.12em]">使ったAI</h2>
                  <ul className="flex flex-wrap gap-2">
                    {tools.map((tool) => (
                      <li key={tool} className="px-2.5 py-0.5 border-[1.5px] border-shu rounded-[3px] text-shu text-sm font-bold">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {app.tags?.length > 0 && (
                <section aria-labelledby="tag-heading">
                  <h2 id="tag-heading" className="mb-2.5 font-display text-base tracking-[0.12em]">タグ</h2>
                  <ul className="flex flex-wrap gap-2">
                    {app.tags.map((tag: string) => (
                      <li key={tag}>
                        <Link
                          href={`/?tag=${encodeURIComponent(tag)}`}
                          className="inline-flex items-center min-h-9 px-3 rounded-[2px] bg-kifuda text-kifuda-ink text-sm hover:bg-[#e3c995] transition-colors"
                        >
                          #{tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {/* 店主・出店日・通報 */}
          <div className="pt-5 border-t border-dashed border-[#d9c3a0] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span aria-hidden="true" className="flex items-center justify-center w-10 h-10 rounded-full bg-yoru text-kinari font-bold">
                {Array.from(owner)[0]?.toUpperCase() ?? '?'}
              </span>
              <span className="text-sm text-sumi-soft">店主 <strong className="text-base text-sumi">{owner}</strong></span>
              {user && !isOwnApp && app.author?.id && (
                <FollowButton
                  targetUserId={app.author.id}
                  currentUserId={user.id}
                  initialFollowing={isFollowing}
                  initialFollowerCount={followerCount ?? 0}
                />
              )}
            </div>
            <div className="flex items-center gap-4">
              {user && !isOwnApp && (
                <ReportButton appId={app.id} initialReported={reported} />
              )}
              <span className="text-sm text-sumi-soft">{createdAt} 出店</span>
            </div>
          </div>

          <div className="pt-6 border-t border-dashed border-[#d9c3a0]">
            <CommentSection
              appId={app.id}
              initialComments={(comments ?? []) as Comment[]}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </article>
    </div>
  )
}
