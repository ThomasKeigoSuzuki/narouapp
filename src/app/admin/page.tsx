import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { deleteApp } from './actions'

const ADMIN_USER_ID = '4e456d7c-9945-4397-8957-e63b807f2fed'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== ADMIN_USER_ID) notFound()

  const [{ data: apps }, { data: users }] = await Promise.all([
    supabase
      .from('apps')
      .select('id, title, created_at, likes_count, author:profiles(username)')
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('id, username, created_at')
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">管理者ページ</h1>

      {/* 投稿一覧 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">投稿一覧（{apps?.length ?? 0}件）</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-2 font-medium">タイトル</th>
                <th className="text-left px-4 py-2 font-medium">投稿者</th>
                <th className="text-left px-4 py-2 font-medium">作成日</th>
                <th className="text-right px-4 py-2 font-medium">いいね</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {apps?.map((app) => {
                const deleteWithId = deleteApp.bind(null, app.id)
                const author = app.author as unknown as { username: string } | null
                return (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-900 max-w-xs truncate">{app.title}</td>
                    <td className="px-4 py-2 text-gray-600">{author?.username ?? '匿名'}</td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(app.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums text-gray-700">{app.likes_count}</td>
                    <td className="px-4 py-2 text-right">
                      <form action={deleteWithId}>
                        <button
                          type="submit"
                          className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          削除
                        </button>
                      </form>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ユーザー一覧 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">ユーザー一覧（{users?.length ?? 0}件）</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-2 font-medium">ID</th>
                <th className="text-left px-4 py-2 font-medium">ユーザー名</th>
                <th className="text-left px-4 py-2 font-medium">作成日</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users?.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500 font-mono text-xs">{u.id}</td>
                  <td className="px-4 py-2 text-gray-900 font-medium">{u.username ?? '匿名'}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(u.created_at).toLocaleDateString('ja-JP')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
