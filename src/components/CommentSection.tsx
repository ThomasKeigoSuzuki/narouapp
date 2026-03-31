'use client'

import { useActionState, useRef, useEffect } from 'react'
import { createComment, type CommentFormState } from '@/app/apps/[id]/actions'
import type { Comment } from '@/types'

type Props = {
  appId: string
  initialComments: Comment[]
  currentUserId?: string
}

const initialState: CommentFormState = {}

export default function CommentSection({ appId, initialComments, currentUserId }: Props) {
  const createCommentWithId = createComment.bind(null, appId)
  const [state, formAction, pending] = useActionState(createCommentWithId, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state.error && !pending) {
      formRef.current?.reset()
    }
  }, [state, pending])

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        コメント（{initialComments.length}）
      </h2>

      {/* コメント一覧 */}
      <div className="space-y-4 mb-6">
        {initialComments.length === 0 && (
          <p className="text-sm text-gray-400">まだコメントがありません</p>
        )}
        {initialComments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xs flex-shrink-0">
              {comment.author?.username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-800">
                  {comment.author?.username ?? '匿名'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* コメント投稿フォーム */}
      {currentUserId ? (
        <form ref={formRef} action={formAction} className="space-y-2">
          {state.error && (
            <p className="text-xs text-red-600">{state.error}</p>
          )}
          <textarea
            name="body"
            rows={3}
            required
            placeholder="コメントを入力…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {pending ? '送信中...' : 'コメントする'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-400">コメントするには<a href="/auth/login" className="text-blue-600 hover:underline">ログイン</a>してください</p>
      )}
    </div>
  )
}
