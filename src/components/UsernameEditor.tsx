'use client'

import { useActionState, useState, useEffect } from 'react'
import { updateUsername, type UsernameFormState } from '@/app/mypage/actions'

const initialState: UsernameFormState = {}

export default function UsernameEditor({ currentUsername }: { currentUsername: string }) {
  const [editing, setEditing] = useState(false)
  const [state, formAction, pending] = useActionState(updateUsername, initialState)

  useEffect(() => {
    if (state.success) setEditing(false)
  }, [state.success])

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-xl font-bold text-gray-900">{currentUsername}</p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="ユーザー名を編集"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input
        name="username"
        type="text"
        defaultValue={currentUsername}
        autoFocus
        maxLength={20}
        className="text-xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white w-40"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-7 h-7 rounded-full flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
        title="保存"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
        title="キャンセル"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {state.error && (
        <span className="text-xs text-red-500">{state.error}</span>
      )}
    </form>
  )
}
