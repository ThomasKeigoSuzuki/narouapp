'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SearchBar() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [q, setQ] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    setQ(searchParams.get('q') ?? '')
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = q.trim()
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/')
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="アプリを検索..."
        className="w-full bg-white/70 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition-all"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </form>
  )
}
