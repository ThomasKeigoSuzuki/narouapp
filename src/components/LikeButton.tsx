'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  appId: string
  initialCount: number
  initialLiked: boolean
  currentUserId?: string
}

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
      onClick={handleLike}
      disabled={!currentUserId || loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${
        liked
          ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
          : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <svg
        className="w-5 h-5"
        fill={liked ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{count}</span>
    </button>
  )
}
