'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type FormState = {
  error?: string
}

export async function createApp(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'ログインが必要です' }
  }

  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const url = (formData.get('url') as string)?.trim()
  const aiTools = formData.getAll('ai_tools') as string[]
  const tagsRaw = (formData.get('tags') as string)?.trim()
  const tags = tagsRaw
    ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  if (!title || !description || !url) {
    return { error: 'タイトル・概要・URLは必須です' }
  }

  const { error } = await supabase.from('apps').insert({
    title,
    description,
    url,
    user_id: user.id,
    ai_tools: aiTools,
    tags,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  redirect('/')
}
