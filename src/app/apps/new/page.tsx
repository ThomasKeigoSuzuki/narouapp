import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NewAppForm from '@/components/NewAppForm'

export default async function NewAppPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">アプリを投稿する</h1>
        <p className="text-gray-500 mt-2">バイブコーディングで作ったアプリをみんなに紹介しよう</p>
      </div>
      <NewAppForm />
    </div>
  )
}
