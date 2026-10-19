'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { App } from '@/types'
import { norenColor, norenEmblem } from '@/lib/noren'

type Props = {
  app: App
  currentUserId?: string
  initialLiked?: boolean
  rank?: number
  priority?: boolean
}

const RANK_LABELS: Record<number, string> = { 1: '一番', 2: '二番', 3: '三番' }

function LanternIcon({ lit }: { lit: boolean }) {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none" stroke={lit ? '#1a1530' : '#b8321c'} strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M9 1v2M5 3h8M5 19h8M9 19v2" />
      <ellipse cx="9" cy="11" rx="6.5" ry="7.5" fill={lit ? '#ffcf7a' : 'none'} />
      <path d="M3 8.5h12M3 13.5h12" />
    </svg>
  )
}

export default function AppCard({ app, currentUserId, initialLiked = false, rank, priority = false }: Props) {
  const [likes, setLikes] = useState(app.likes_count)
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (!currentUserId || loading) return
    setLoading(true)
    const supabase = createClient()
    if (liked) {
      await supabase.from('likes').delete().match({ app_id: app.id, user_id: currentUserId })
      setLikes(l => l - 1)
      setLiked(false)
    } else {
      await supabase.from('likes').insert({ app_id: app.id, user_id: currentUserId })
      setLikes(l => l + 1)
      setLiked(true)
    }
    setLoading(false)
  }

  const color = norenColor(app.id)
  const emblem = norenEmblem(app.title)
  const tools = (app.ai_tools ?? []).filter(t => t && t !== 'その他').slice(0, 2)
  const tags = (app.tags ?? []).filter(Boolean).slice(0, 3)
  const owner = app.author?.username ?? '匿名'
  const rankLabel = rank ? RANK_LABELS[rank] : undefined

  return (
    <article className="yk-shop relative flex flex-col rounded-[3px] bg-kinari text-sumi shadow-[0_0_0_1px_rgba(255,207,122,.3),0_26px_50px_-22px_rgba(249,115,22,.6)]">
      {/* 軒 */}
      <div aria-hidden="true" className="yk-eave h-3.5 rounded-t-[3px] border-b-[3px] border-wood" />

      {/* 店先：スクリーンショットと暖簾 */}
      <div className="relative aspect-video overflow-hidden bg-[#2a2036]">
        {app.thumbnail_url ? (
          <Image
            src={app.thumbnail_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center pt-8 font-mincho font-black text-6xl text-kinari/80">
            {emblem}
          </span>
        )}
        <span aria-hidden="true" className="yk-noren absolute inset-x-4 top-0 grid grid-cols-3 gap-1">
          <span className="h-[46px] shadow-[0_8px_12px_-8px_rgba(0,0,0,.6)]" style={{ background: color }} />
          <span className="h-[46px] flex items-center justify-center font-mincho font-black text-[22px] text-kinari shadow-[0_8px_12px_-8px_rgba(0,0,0,.6)]" style={{ background: color }}>
            {emblem}
          </span>
          <span className="h-[46px] shadow-[0_8px_12px_-8px_rgba(0,0,0,.6)]" style={{ background: color }} />
        </span>
        {rankLabel && (
          <span
            className={`absolute left-3 bottom-3 [writing-mode:vertical-rl] px-1.5 py-2.5 font-display text-[15px] tracking-[0.12em] text-sumi shadow-[0_6px_14px_rgba(0,0,0,.35)] ${rank === 1 ? 'bg-akari' : 'bg-kinari'}`}
          >
            <span className="sr-only">繁盛番付 </span>
            {rankLabel}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-3 px-5 pt-[18px] pb-3.5">
        <h3 className="text-lg font-bold leading-normal">
          {/* カード全体を押せるように、リンクの当たり判定をカードいっぱいに広げる */}
          <Link href={`/apps/${app.id}`} className="hover:text-shu transition-colors after:absolute after:inset-0 after:content-['']">
            {app.title}
          </Link>
        </h3>
        <p className="text-sm leading-[1.75] text-sumi-soft line-clamp-2">{app.description}</p>
        {(tools.length > 0 || tags.length > 0) && (
          <ul aria-label="使ったAIとタグ" className="flex flex-wrap gap-1.5">
            {tools.map(tool => (
              <li key={`tool-${tool}`} className="px-2 border-[1.5px] border-shu rounded-[3px] text-shu text-xs font-bold leading-5">
                {tool}
              </li>
            ))}
            {tags.map(tag => (
              <li key={`tag-${tag}`} className="px-2.5 py-0.5 rounded-[2px] bg-kifuda text-kifuda-ink text-xs leading-5">
                #{tag}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2.5 border-t border-dashed border-[#d9c3a0]">
          <span className="flex items-center gap-2.5 min-h-11 text-[13px] text-sumi-soft min-w-0">
            <span aria-hidden="true" className="flex-none flex items-center justify-center w-[30px] h-[30px] rounded-full bg-yoru text-kinari text-[13px] font-bold">
              {Array.from(owner)[0]?.toUpperCase()}
            </span>
            <span className="truncate">店主 <strong className="text-sumi">{owner}</strong></span>
          </span>
          <button
            type="button"
            onClick={handleLike}
            disabled={!currentUserId || loading}
            aria-pressed={liked}
            aria-label={`灯をともす（いいね）。いま ${likes}`}
            title={currentUserId ? undefined : 'ログインすると灯をともせます'}
            className={`relative z-10 flex-none flex items-center gap-2 min-h-11 px-4 rounded-full border-[1.5px] text-[15px] font-bold transition-colors disabled:cursor-default ${
              liked
                ? 'border-orange-500 bg-orange-500 text-yoru shadow-[0_0_18px_rgba(249,115,22,.55)]'
                : 'border-[#e2c49c] bg-[#fff8ec] text-sumi enabled:hover:border-orange-400'
            }`}
          >
            <LanternIcon lit={liked} />
            <span>{likes}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
