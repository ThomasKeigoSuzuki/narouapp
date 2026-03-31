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

  // スクリーンショットアップロード
  let thumbnailUrl: string | null = null
  const screenshot = formData.get('screenshot') as File | null
  if (screenshot && screenshot.size > 0) {
    if (screenshot.size > 5 * 1024 * 1024) {
      return { error: '画像サイズは5MB以下にしてください' }
    }
    const ext = screenshot.name.split('.').pop() ?? 'png'
    const filename = `${user.id}/${Date.now()}.${ext}`
    const buffer = await screenshot.arrayBuffer()

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(filename, buffer, { contentType: screenshot.type, upsert: false })

    if (uploadError) {
      return { error: `画像アップロード失敗: ${uploadError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(uploadData.path)
    thumbnailUrl = publicUrl
  }

  const { error } = await supabase.from('apps').insert({
    title,
    description,
    url,
    user_id: user.id,
    ai_tools: aiTools,
    tags,
    thumbnail_url: thumbnailUrl,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  redirect('/')
}
