'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import SearchBar from './SearchBar'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="glass sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          {/* PwC風ドットグリッド（炎配置・オレンジ〜レッド） */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="dot-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            {/* 炎型ドット配置（4×4グリッド、一部省略で炎シルエット） */}
            {/* 最上段: 中央1つ */}
            <circle cx="14" cy="2"  r="2.2" fill="url(#dot-grad)" opacity="0.55" />
            {/* 2段目: 3つ */}
            <circle cx="8"  cy="8"  r="2.2" fill="url(#dot-grad)" opacity="0.70" />
            <circle cx="14" cy="8"  r="2.2" fill="url(#dot-grad)" opacity="0.80" />
            <circle cx="20" cy="8"  r="2.2" fill="url(#dot-grad)" opacity="0.70" />
            {/* 3段目: 4つ */}
            <circle cx="5"  cy="14" r="2.2" fill="url(#dot-grad)" opacity="0.85" />
            <circle cx="11" cy="14" r="2.2" fill="url(#dot-grad)" opacity="0.95" />
            <circle cx="17" cy="14" r="2.2" fill="url(#dot-grad)" opacity="0.95" />
            <circle cx="23" cy="14" r="2.2" fill="url(#dot-grad)" opacity="0.85" />
            {/* 最下段: 3つ（根元） */}
            <circle cx="8"  cy="20" r="2.2" fill="url(#dot-grad)" />
            <circle cx="14" cy="20" r="2.2" fill="url(#dot-grad)" />
            <circle cx="20" cy="20" r="2.2" fill="url(#dot-grad)" />
            {/* 底: 中央1つ */}
            <circle cx="14" cy="26" r="2.2" fill="url(#dot-grad)" opacity="0.80" />
          </svg>
          <span className="text-lg font-black text-gray-900 tracking-tight hidden sm:block">なろうApp</span>
        </Link>

        {/* 検索バー */}
        <div className="flex-1 max-w-md">
          <Suspense fallback={
            <div className="w-full h-9 bg-gray-100 rounded-full animate-pulse" />
          }>
            <SearchBar />
          </Suspense>
        </div>

        {/* ナビ */}
        <nav className="flex items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              <Link
                href="/apps/new"
                className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:block">投稿</span>
              </Link>
              <Link
                href="/mypage"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm hover:bg-orange-200 transition-colors"
                title={user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email}
              >
                {(user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? 'U')[0].toUpperCase()}
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                title="ログアウト"
              >
                <svg className="w-4 h-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:block">ログアウト</span>
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
