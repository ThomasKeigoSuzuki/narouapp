import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import EditAppForm from '@/components/EditAppForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditAppPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: app } = await supabase
    .from('apps')
    .select('*')
    .eq('id', id)
    .single()

  if (!app || app.user_id !== user.id) notFound()

  return (
    <div className="max-w-4xl mx-auto">
      <Link href={`/apps/${id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        詳細に戻る
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">アプリを編集</h1>

      <EditAppForm
        appId={id}
        initialTitle={app.title}
        initialDescription={app.description}
        initialUrl={app.url}
        initialAiTools={app.ai_tools ?? []}
        initialTags={app.tags ?? []}
        initialThumbnailUrl={app.thumbnail_url}
      />
    </div>
  )
}
