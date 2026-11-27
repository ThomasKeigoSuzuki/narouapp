'use client'

import { useState } from 'react'
import Link from 'next/link'
import LanternMark from '@/components/LanternMark'

type Props = {
  appId: string
  title: string
  shareUrl: string
}

// 出店した直後の店のページで、店主にだけ見せる「開店しました」のお知らせ
export default function OpeningNotice({ appId, title, shareUrl }: Props) {
  const [copy, setCopy] = useState<'idle' | 'done' | 'failed'>('idle')

  const text = `「${title}」を、アプリ横丁に出店しました。のぞいてみてください！`
  const xUrl =
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}` +
    `&url=${encodeURIComponent(shareUrl)}` +
    `&hashtags=${encodeURIComponent('アプリ横丁,バイブコーディング')}`

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopy('done')
    } catch {
      setCopy('failed')
    }
  }

  return (
    <section
      aria-labelledby="opened-heading"
      className="mb-6 rounded-[3px] bg-yoru text-kinari px-5 sm:px-7 py-6 shadow-[0_24px_50px_-28px_rgba(26,21,48,.9)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <LanternMark size={36} />
          <h2 id="opened-heading" className="font-display text-xl sm:text-2xl tracking-[0.08em]">開店しました！</h2>
        </div>
        <Link
          href={`/apps/${appId}`}
          replace
          scroll={false}
          className="flex-none inline-flex items-center min-h-11 px-2 text-sm text-yoru-muted underline underline-offset-4 hover:text-kinari"
        >
          とじる
        </Link>
      </div>

      <p className="mt-3 text-[15px] leading-[1.9]">
        あなたの店が、横丁に並びました。まずは友だちやフォロワーに知らせてみましょう。
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-orange-500 text-yoru text-sm font-bold hover:bg-orange-400 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Xで開店を知らせる
        </a>
        <button
          type="button"
          onClick={copyUrl}
          className="inline-flex items-center h-12 px-5 rounded-full border border-[#6b5d94] text-sm font-bold hover:bg-yoru-field transition-colors"
        >
          {copy === 'done' ? 'コピーしました' : '店のURLをコピー'}
        </button>
      </div>

      <span role="status" className="sr-only">
        {copy === 'done' ? '店のURLをコピーしました' : copy === 'failed' ? 'うまくコピーできませんでした' : ''}
      </span>
      {copy === 'failed' && (
        <p className="mt-3 text-sm leading-[1.8] break-all">
          うまくコピーできませんでした。こちらを選んでコピーしてください：
          <span className="select-all underline underline-offset-4">{shareUrl}</span>
        </p>
      )}

      <p className="mt-4 text-xs leading-[1.8] text-yoru-muted">
        説明やスクリーンショットは、あとから
        <Link href={`/apps/${appId}/edit`} className="mx-0.5 underline underline-offset-4 hover:text-kinari">編集</Link>
        で直せます。
      </p>
    </section>
  )
}
