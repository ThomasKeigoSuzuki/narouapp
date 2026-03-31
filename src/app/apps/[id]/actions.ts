'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type CommentFormState = {
  error?: string
}

export async function createComment(
  appId: string,
  prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const body = (formData.get('body') as string)?.trim()
  if (!body) return { error: 'コメントを入力してください' }
  if (body.length > 1000) return { error: 'コメントは1000文字以内で入力してください' }

  const { error } = await supabase.from('comments').insert({
    app_id: appId,
    user_id: user.id,
    body,
  })

  if (error) return { error: error.message }

  revalidatePath(`/apps/${appId}`)
  return {}
}
