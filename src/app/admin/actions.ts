'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const ADMIN_USER_ID = '4e456d7c-9945-4397-8957-e63b807f2fed'

export async function deleteApp(appId: string): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== ADMIN_USER_ID) {
    throw new Error('権限がありません')
  }

  await supabase.from('apps').delete().eq('id', appId)

  revalidatePath('/admin')
  redirect('/admin')
}
