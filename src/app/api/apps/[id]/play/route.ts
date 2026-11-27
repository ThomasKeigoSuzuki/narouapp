import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

// 「アプリを開く」が押されたときに、店のページから送られてくる合図を受けて、遊ばれた回数を1つ増やす
// ・同じ人が同じ日（日本時間）に何度押しても1回と数える（この店の合図にだけ届くクッキーで見分ける）
// ・店主が自分の店で押した分は数えない（DBの関数 record_app_play が見分ける）
// ・ほかのサイトから送られた合図は数えない

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const PLAYED_COOKIE = 'yk_played'
const TOKYO_OFFSET_MS = 9 * 60 * 60 * 1000

// 次の日本時間0時までの秒数
function secondsUntilTokyoMidnight(now: Date): number {
  const tokyo = new Date(now.getTime() + TOKYO_OFFSET_MS)
  const nextMidnight =
    Date.UTC(tokyo.getUTCFullYear(), tokyo.getUTCMonth(), tokyo.getUTCDate() + 1) - TOKYO_OFFSET_MS
  return Math.max(60, Math.round((nextMidnight - now.getTime()) / 1000))
}

// 同じサイトのページから送られてきた合図か
function isSameOrigin(request: NextRequest): boolean {
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite) return fetchSite === 'same-origin'

  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).host === request.nextUrl.host
  } catch {
    return false
  }
}

function noContent() {
  return new NextResponse(null, { status: 204 })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (request.cookies.has(PLAYED_COOKIE)) {
    return noContent()
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    return noContent()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: { persistSession: false },
  })
  const { error } = await admin.rpc('record_app_play', {
    target_app_id: id,
    viewer_id: user?.id ?? null,
  })

  if (error) {
    // マイグレーションの適用前は関数がない（PGRST202）。押した人の操作には影響させない
    if (error.code !== 'PGRST202') {
      console.error('record_app_play failed:', error.message)
    }
    return noContent()
  }

  const response = noContent()
  response.cookies.set(PLAYED_COOKIE, '1', {
    path: `/api/apps/${id}/play`,
    maxAge: secondsUntilTokyoMidnight(new Date()),
    httpOnly: true,
    sameSite: 'strict',
    secure: request.nextUrl.protocol === 'https:',
  })
  return response
}
