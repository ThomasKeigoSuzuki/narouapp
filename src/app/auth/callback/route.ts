import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// ログイン後の移動先は、このサイト内のページに限る。
// 「next」に外部サイトを指定されても、そこへは転送しない（ログイン画面を使った誘導を防ぐ）
function safeRedirectUrl(origin: string, next: string | null): string {
  if (next) {
    try {
      const url = new URL(next, origin)
      if (url.origin === origin) return url.toString()
    } catch {
      // 不正な値は無視してトップへ
    }
  }
  return `${origin}/`
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(safeRedirectUrl(origin, next))
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`)
}
