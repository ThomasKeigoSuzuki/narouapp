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
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-bold gradient-text hidden sm:block">なろうApp</span>
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
                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:block">投稿</span>
              </Link>
              <Link
                href="/mypage"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm hover:bg-indigo-200 transition-colors"
                title={user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email}
              >
                {(user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? 'U')[0].toUpperCase()}
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
