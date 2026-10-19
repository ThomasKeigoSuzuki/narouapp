'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentQ = searchParams.get('q') ?? ''
  const [q, setQ] = useState(currentQ)

  // URLの検索語が変わったときだけ入力欄を合わせる（effect内でのsetStateを避ける）
  const [syncedQ, setSyncedQ] = useState(currentQ)
  if (syncedQ !== currentQ) {
    setSyncedQ(currentQ)
    setQ(currentQ)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = q.trim()
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/')
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative w-full">
      <label htmlFor="site-search" className="sr-only">店をさがす</label>
      <input
        id="site-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="店をさがす（アプリ名・キーワード）"
        className="w-full h-11 rounded-full border border-[#4a3d6e] bg-yoru-field pl-11 pr-4 text-sm text-kinari placeholder:text-[#b3a8c9] focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow"
      />
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-yoru-muted pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    </form>
  )
}
