'use client'

import { useActionState, useState } from 'react'
import Image from 'next/image'
import { updateApp, type FormState } from '@/app/apps/[id]/edit/actions'

const AI_TOOLS = ['Claude', 'Cursor', 'Lovable', 'Bolt', 'v0', 'その他'] as const
const DESCRIPTION_MAX = 500

type Props = {
  appId: string
  initialTitle: string
  initialDescription: string
  initialUrl: string
  initialAiTools: string[]
  initialTags: string[]
  initialThumbnailUrl: string | null
}

const initialState: FormState = {}

export default function EditAppForm({
  appId,
  initialTitle,
  initialDescription,
  initialUrl,
  initialAiTools,
  initialTags,
  initialThumbnailUrl,
}: Props) {
  const updateAppWithId = updateApp.bind(null, appId)
  const [state, formAction, pending] = useActionState(updateAppWithId, initialState)

  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [selectedTools, setSelectedTools] = useState<string[]>(initialAiTools)
  const [tagsInput, setTagsInput] = useState(initialTags.join(', '))
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleToolChange = (tool: string, checked: boolean) => {
    setSelectedTools(prev => checked ? [...prev, tool] : prev.filter(t => t !== tool))
  }

  const previewTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
  const displayThumbnail = preview ?? initialThumbnailUrl

  return (
    <div className="flex gap-8 items-start">
      {/* フォーム */}
      <form action={formAction} className="flex-1 min-w-0 space-y-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-6">
        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {state.error}
          </div>
        )}

        {/* タイトル */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all"
          />
        </div>

        {/* 概要 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
              概要 <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs tabular-nums ${description.length > DESCRIPTION_MAX * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
              {description.length} / {DESCRIPTION_MAX}
            </span>
          </div>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            maxLength={DESCRIPTION_MAX}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* URL */}
        <div>
          <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-1.5">
            URL <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              id="url"
              name="url"
              type="url"
              required
              defaultValue={initialUrl}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* スクリーンショット */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            スクリーンショット
          </label>
          {displayThumbnail && (
            <div className="mb-2 relative aspect-video rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={displayThumbnail}
                alt="サムネイル"
                fill
                className="object-cover"
                unoptimized={!!preview}
              />
              {preview && (
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70"
                >
                  ✕
                </button>
              )}
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-400 px-4 py-5 justify-center text-sm text-gray-400 hover:text-orange-500 transition-colors bg-gray-50/50">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {displayThumbnail ? '画像を変更する' : '画像をアップロード（5MBまで）'}
            <input type="file" name="screenshot" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        {/* 使用AIツール */}
        <div>
          <p className="block text-sm font-semibold text-gray-700 mb-2">使用AIツール</p>
          <div className="flex flex-wrap gap-2">
            {AI_TOOLS.map((tool) => {
              const checked = selectedTools.includes(tool)
              return (
                <label
                  key={tool}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-all ${
                    checked
                      ? 'bg-orange-50 border-orange-300 text-orange-700 font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-orange-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="ai_tools"
                    value={tool}
                    checked={checked}
                    onChange={e => handleToolChange(tool, e.target.checked)}
                    className="sr-only"
                  />
                  {checked && <span className="text-orange-500 text-xs">✓</span>}
                  {tool}
                </label>
              )
            })}
          </div>
        </div>

        {/* タグ */}
        <div>
          <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-1.5">
            タグ
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            placeholder="React, 天気, API"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all"
          />
          <p className="text-xs text-gray-400 mt-1">カンマ（,）で区切って複数入力できます</p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-3 text-sm transition-opacity shadow-sm"
        >
          {pending ? '更新中...' : '更新する'}
        </button>
      </form>

      {/* プレビューパネル */}
      <div className="w-72 flex-shrink-0 hidden lg:block sticky top-24">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">プレビュー</p>
        <div className="bg-white rounded-2xl border border-white/80 shadow-sm overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-orange-50 to-red-50 relative flex items-center justify-center">
            {displayThumbnail ? (
              <Image src={displayThumbnail} alt="preview" fill className="object-cover" unoptimized={!!preview} />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="font-semibold text-gray-900 truncate text-sm">
              {title || <span className="text-gray-300">タイトルを入力...</span>}
            </p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {description || <span className="text-gray-300">概要を入力...</span>}
            </p>
            {(selectedTools.length > 0 || previewTags.length > 0) && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {selectedTools.map(t => (
                  <span key={t} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{t}</span>
                ))}
                {previewTags.map(t => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">入力内容がリアルタイムで反映されます</p>
      </div>
    </div>
  )
}
