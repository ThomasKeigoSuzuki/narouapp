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
      <h2 className="font-display text-base tracking-[0.12em] mb-4">
        コメント（{initialComments.length}）
      </h2>

      {/* コメント一覧 */}
      <div className="space-y-4 mb-6">
        {initialComments.length === 0 && (
          <p className="text-sm text-sumi-soft">まだコメントがありません。最初のひとことをどうぞ。</p>
        )}
        {initialComments.map((comment) => (
          <div key={comment.id} className="flex gap-3 p-4 rounded-[3px] bg-white/70 border border-[#ead8b8]">
            <div aria-hidden="true" className="w-8 h-8 rounded-full bg-yoru flex items-center justify-center text-kinari font-bold text-xs flex-shrink-0">
              {comment.author?.username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-sumi">
                  {comment.author?.username ?? '匿名'}
                </span>
                <span className="text-xs text-sumi-soft">
                  {new Date(comment.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
              <p className="text-sm leading-[1.8] whitespace-pre-wrap break-words">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* コメント投稿フォーム */}
      {currentUserId ? (
        <form ref={formRef} action={formAction} className="space-y-2">
          {state.error && (
            <p className="text-xs text-shu">{state.error}</p>
          )}
          <label htmlFor="comment-body" className="sr-only">コメント</label>
          <textarea
            id="comment-body"
            name="body"
            rows={3}
            required
            placeholder="コメントを入力…"
            className="w-full rounded-[3px] border border-[#d9c3a0] bg-white px-3 py-2.5 text-sm text-sumi placeholder:text-[#8a786b] focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center min-h-11 px-5 rounded-full bg-yoru text-kinari text-sm font-bold hover:bg-[#2b2350] disabled:opacity-60 transition-colors"
          >
            {pending ? '送信中...' : 'コメントする'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-sumi-soft">コメントするには<a href="/auth/login" className="text-shu underline underline-offset-4">ログイン</a>してください</p>
      )}
    </div>
  )
}
