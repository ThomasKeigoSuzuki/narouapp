'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import SearchBar from './SearchBar'
import LanternMark from './LanternMark'

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

  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? ''

  return (
    <header className="sticky top-0 z-50 border-b border-yoru-line bg-yoru text-kinari">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link href="/" aria-label="アプリ横丁 トップへ" className="flex items-center gap-3 min-h-11 flex-shrink-0">
          <LanternMark size={36} />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[22px] tracking-wide">アプリ横丁</span>
            <span className="mt-1.5 text-[10px] tracking-[0.34em] text-yoru-muted">APP YOKOCHO</span>
          </span>
        </Link>

        {/* スマホでは2段目に回る */}
        <div className="order-last basis-full sm:order-none sm:basis-auto sm:flex-1 sm:max-w-md">
          <Suspense fallback={<div className="w-full h-11 rounded-full bg-yoru-field" />}>
            <SearchBar />
          </Suspense>
        </div>

        <nav aria-label="メニュー" className="ml-auto flex items-center gap-2">
          <Link
            href="/apps/new"
            className="inline-flex items-center gap-1.5 h-11 px-5 rounded-full bg-orange-500 text-yoru text-sm font-bold hover:bg-orange-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            出店する
          </Link>
          {user ? (
            <>
              <Link
                href="/mypage"
                aria-label="マイページ"
                title={displayName}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-kinari text-sumi font-bold text-sm hover:bg-white transition-colors"
              >
                {(displayName || 'U')[0].toUpperCase()}
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center h-11 px-3 rounded-full text-xs text-yoru-muted hover:text-kinari hover:bg-yoru-field transition-colors"
                title="ログアウト"
                aria-label="ログアウト"
              >
                <svg className="w-4 h-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:block">ログアウト</span>
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center h-11 px-5 rounded-full border border-[#6b5d94] text-sm hover:bg-yoru-field transition-colors"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
