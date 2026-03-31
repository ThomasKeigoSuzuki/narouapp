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
      <span className="text-xs text-gray-500">フォロワー {followerCount}</span>
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
          following
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        } disabled:opacity-50`}
      >
        {following ? 'フォロー中' : 'フォローする'}
      </button>
    </div>
  )
}
