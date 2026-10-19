'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { SCREENSHOT_MAX_BYTES, screenshotExtension, splitTagInput, validateAppInput } from '@/lib/app-input'

export type FormState = {
  error?: string
}

export async function createApp(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'ログインが必要です' }
  }

  const checked = validateAppInput({
    title: formData.get('title'),
    description: formData.get('description'),
    url: formData.get('url'),
    tags: splitTagInput(String(formData.get('tags') ?? '')),
    ai_tools: formData.getAll('ai_tools'),
  })
  if (!checked.ok) {
    return { error: checked.error }
  }
  const { title, description, url, tags, ai_tools: aiTools } = checked.value

  // スクリーンショットアップロード
  let thumbnailUrl: string | null = null
  const screenshot = formData.get('screenshot')
  if (screenshot instanceof File && screenshot.size > 0) {
    if (screenshot.size > SCREENSHOT_MAX_BYTES) {
      return { error: '画像サイズは5MB以下にしてください' }
    }
    // 画像以外のファイルが公開ストレージに置かれないよう、形式を確かめる
    const ext = screenshotExtension(screenshot)
    if (!ext) {
      return { error: '画像はPNG・JPEG・WebP・GIFのいずれかにしてください' }
    }
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
