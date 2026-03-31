'use client'

import { useRouter } from 'next/navigation'

type TagItem = { tag: string; count: number }

type Props = {
  tags: TagItem[]
  currentTag?: string
}

export default function TagCloud({ tags, currentTag }: Props) {
  const router = useRouter()

  if (tags.length === 0) return null

  const maxCount = tags[0]?.count ?? 1

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        人気タグ
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => {
          const active = currentTag === tag
          const weight = count / maxCount
          const size = weight > 0.8 ? 'text-sm' : weight > 0.4 ? 'text-xs' : 'text-xs'

          return (
            <button
              key={tag}
              onClick={() => router.push(active ? '/' : `/?tag=${encodeURIComponent(tag)}`)}
              className={`${size} px-2.5 py-1 rounded-full transition-all font-medium ${
                active
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              #{tag}
              <span className={`ml-1 ${active ? 'opacity-80' : 'opacity-50'} text-xs`}>{count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
