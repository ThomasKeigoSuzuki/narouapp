'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { App } from '@/types'

type Props = {
  app: App
  currentUserId?: string
  initialLiked?: boolean
  rank?: number
  priority?: boolean
}

const RANK_STYLES: Record<number, string> = {
  1: 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white',
  2: 'bg-gradient-to-br from-gray-300 to-gray-400 text-white',
  3: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white',
}

export default function AppCard({ app, currentUserId, initialLiked = false, rank, priority = false }: Props) {
  const [likes, setLikes] = useState(app.likes_count)
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  return (
    <Link href={`/apps/${app.id}`} className="block group">
      <div className="card-lift bg-white rounded-2xl border border-white/80 overflow-hidden shadow-sm">
        {/* サムネイル */}
        <div className="aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 relative">
          {app.thumbnail_url ? (
            <Image src={app.thumbnail_url} alt={app.title} fill className="object-cover" priority={priority} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}
          {rank && rank <= 3 && (
            <div className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${RANK_STYLES[rank]}`}>
              {rank}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
            {app.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{app.description}</p>

          {(app.ai_tools?.length > 0 || app.tags?.length > 0) && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {app.ai_tools?.slice(0, 3).map((tool) => (
                <span key={tool} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                  {tool}
                </span>
              ))}
              {app.tags?.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">
              {app.author?.username ?? '匿名'}
            </span>

            <button
              onClick={handleLike}
              disabled={!currentUserId || loading}
              className={`flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full transition-all ${
                liked
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-gray-400 hover:text-pink-600 hover:bg-pink-50'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={liked ? 0 : 2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium">{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
