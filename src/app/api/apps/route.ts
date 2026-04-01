import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/site-url'

const ADMIN_USER_ID = '4e456d7c-9945-4397-8957-e63b807f2fed'

export async function GET() {
  const supabase = await createClient()

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
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token || token !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const title = (body.title as string)?.trim()
  const description = (body.description as string)?.trim()
  const url = (body.url as string)?.trim()
  const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === 'string') : []
  const ai_tools = Array.isArray(body.ai_tools) ? body.ai_tools.filter((t): t is string => typeof t === 'string') : []

  if (!title || !description || !url) {
    return NextResponse.json({ error: 'title, description, url are required' }, { status: 400 })
  }

  const supabase = await createClient()

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
