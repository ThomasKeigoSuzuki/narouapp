'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type UsernameFormState = {
  error?: string
  success?: boolean
}

export async function updateUsername(
  prevState: UsernameFormState,
  formData: FormData,
): Promise<UsernameFormState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const username = (formData.get('username') as string)?.trim()

  if (!username) return { error: 'ユーザー名を入力してください' }
  if (username.length < 2) return { error: 'ユーザー名は2文字以上にしてください' }
  if (username.length > 20) return { error: 'ユーザー名は20文字以内にしてください' }
  if (/\s/.test(username)) return { error: 'ユーザー名に空白は使えません' }

  const { error } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/mypage')
  return { success: true }
}
