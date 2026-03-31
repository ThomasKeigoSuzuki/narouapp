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
}

export default function AppCard({ app, currentUserId, initialLiked = false }: Props) {
  const [likes, setLikes] = useState(app.likes_count)
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
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
    <Link href={`/apps/${app.id}`} className="block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-video bg-gray-100 relative">
          {app.thumbnail_url ? (
            <Image
              src={app.thumbnail_url}
              alt={app.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">{app.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{app.description}</p>

          {(app.ai_tools?.length > 0 || app.tags?.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-1">
              {app.ai_tools?.map((tool) => (
                <span key={tool} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                  {tool}
                </span>
              ))}
              {app.tags?.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {app.author?.username ?? '匿名'}
            </span>

            <button
              onClick={handleLike}
              disabled={!currentUserId || loading}
              className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full transition-colors ${
                liked
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-gray-500 hover:text-pink-600 hover:bg-pink-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likes}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
