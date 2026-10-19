'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  appId: string
  initialCount: number
  initialLiked: boolean
  currentUserId?: string
}

// 作品ページの「灯をともす（いいね）」ボタン。トップページのカードと同じ提灯の形
export default function LikeButton({ appId, initialCount, initialLiked, currentUserId }: Props) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (!currentUserId || loading) return

    setLoading(true)
    const supabase = createClient()

    if (liked) {
      await supabase.from('likes').delete().match({ app_id: appId, user_id: currentUserId })
      setCount((c) => c - 1)
      setLiked(false)
    } else {
      await supabase.from('likes').insert({ app_id: appId, user_id: currentUserId })
      setCount((c) => c + 1)
      setLiked(true)
    }
    setLoading(false)
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={!currentUserId || loading}
      aria-pressed={liked}
      aria-label={`灯をともす（いいね）。いま ${count}`}
      title={currentUserId ? '灯をともす（いいね）' : 'ログインすると灯をともせます'}
      className={`inline-flex items-center gap-2 h-[52px] px-5 rounded-full border-[1.5px] font-bold transition-colors disabled:cursor-default ${
        liked
          ? 'border-orange-500 bg-orange-500 text-yoru shadow-[0_0_20px_rgba(249,115,22,.55)]'
          : 'border-[#e2c49c] bg-[#fff8ec] text-sumi enabled:hover:border-orange-400'
      }`}
    >
      <svg width="20" height="24" viewBox="0 0 18 22" fill="none" stroke={liked ? '#1a1530' : '#b8321c'} strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M9 1v2M5 3h8M5 19h8M9 19v2" />
        <ellipse cx="9" cy="11" rx="6.5" ry="7.5" fill={liked ? '#ffcf7a' : 'none'} />
        <path d="M3 8.5h12M3 13.5h12" />
      </svg>
      <span>{count}</span>
    </button>
  )
}
