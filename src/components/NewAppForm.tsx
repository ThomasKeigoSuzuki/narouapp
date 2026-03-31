'use client'

import { useActionState } from 'react'
import { createApp, type FormState } from '@/app/apps/new/actions'

const AI_TOOLS = ['Claude', 'Cursor', 'Lovable', 'Bolt', 'v0', 'その他'] as const

const initialState: FormState = {}

export default function NewAppForm() {
  const [state, formAction, pending] = useActionState(createApp, initialState)

  return (
    <form action={formAction} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {state.error}
        </div>
      )}

      {/* タイトル */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="例: AIで作った天気予報アプリ"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 概要 */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          概要 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="どんなアプリか、どう作ったか簡単に説明してください"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* URL */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          URL <span className="text-red-500">*</span>
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://your-app.vercel.app"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 使用AIツール */}
      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">使用AIツール</p>
        <div className="flex flex-wrap gap-3">
          {AI_TOOLS.map((tool) => (
            <label key={tool} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="ai_tools"
                value={tool}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{tool}</span>
            </label>
          ))}
        </div>
      </div>

      {/* タグ */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          タグ
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="例: React, 天気, API（カンマ区切り）"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">カンマ（,）で区切って複数入力できます</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors"
      >
        {pending ? '投稿中...' : '投稿する'}
      </button>
    </form>
  )
}
