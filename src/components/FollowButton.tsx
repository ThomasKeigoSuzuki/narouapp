'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  targetUserId: string
  currentUserId: string
  initialFollowing: boolean
  initialFollowerCount: number
}

export default function FollowButton({
  targetUserId,
  currentUserId,
  initialFollowing,
  initialFollowerCount,
}: Props) {
  const [following, setFollowing] = useState(initialFollowing)
  const [followerCount, setFollowerCount] = useState(initialFollowerCount)
  const [loading, setLoading] = useState(false)

  const handleFollow = async () => {
    if (loading) return
    setLoading(true)
    const supabase = createClient()

    if (following) {
      await supabase
        .from('follows')
        .delete()
        .match({ follower_id: currentUserId, following_id: targetUserId })
      setFollowing(false)
      setFollowerCount((c) => c - 1)
    } else {
      await supabase
        .from('follows')
        .insert({ follower_id: currentUserId, following_id: targetUserId })
      setFollowing(true)
      setFollowerCount((c) => c + 1)
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleFollow}
        disabled={loading}
        aria-pressed={following}
        className={`inline-flex items-center min-h-11 px-4 rounded-full text-sm font-bold transition-colors disabled:opacity-60 ${
          following
            ? 'border-[1.5px] border-[#d9c3a0] text-sumi hover:bg-[#f3e2c2]'
            : 'bg-yoru text-kinari hover:bg-[#2b2350]'
        }`}
      >
        {following ? 'フォロー中' : 'フォローする'}
      </button>
      <span className="text-xs text-sumi-soft">フォロワー {followerCount}</span>
    </div>
  )
}
