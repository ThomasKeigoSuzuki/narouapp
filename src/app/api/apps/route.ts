import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { getSiteUrl } from '@/lib/site-url'
import { hasValidApiKey } from '@/lib/api-auth'
import { validateAppInput } from '@/lib/app-input'

const ADMIN_USER_ID = '4e456d7c-9945-4397-8957-e63b807f2fed'

export async function GET() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('apps')
    .select('id, title, description, url, tags, ai_tools, likes_count, created_at, author:profiles(id, username)')
    .order('likes_count', { ascending: false })
    .limit(30)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  if (!hasValidApiKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const checked = validateAppInput({
    title: body.title,
    description: body.description,
    url: body.url,
    tags: body.tags,
    ai_tools: body.ai_tools,
  })
  if (!checked.ok) {
    return NextResponse.json({ error: checked.error }, { status: 400 })
  }
  const { title, description, url, tags, ai_tools } = checked.value

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data, error } = await supabase
    .from('apps')
    .insert({ title, description, url, tags, ai_tools, user_id: ADMIN_USER_ID })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const siteUrl = getSiteUrl()

  return NextResponse.json({ id: data.id, url: `${siteUrl}/apps/${data.id}` }, { status: 201 })
}
