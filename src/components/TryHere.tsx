'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  appId: string
  url: string
  title: string
}

// 店のページの中で、そのままアプリを試せるようにする
// 店先の画像に「ここで遊ぶ」を出し、押すと大きな窓の中でアプリを開く
export default function TryHere({ appId, url, title }: Props) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function start() {
    setOpen(true)
    // 遊ばれた回数の合図（「アプリを開く」と同じ。数えるしくみが入るまでは何も起きない）
    try {
      navigator.sendBeacon?.(`/api/apps/${appId}/play`)
    } catch {
      // 数えられなくても、遊ぶことはできる
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={start}
        className="absolute right-4 bottom-4 z-10 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-orange-500 text-yoru text-sm font-bold shadow-[0_10px_24px_-8px_rgba(0,0,0,.7)] hover:bg-orange-400 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" />
        </svg>
        ここで遊ぶ
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label={`${title} を遊ぶ`}
        className="fixed inset-0 m-0 p-0 w-screen h-dvh max-w-none max-h-none bg-yoru text-kinari overflow-hidden sm:m-auto sm:w-[min(96vw,1200px)] sm:h-[92dvh] sm:rounded-[6px] backdrop:bg-black/70"
      >
        {open && (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 border-b border-yoru-line">
              <span className="min-w-0 truncate text-sm font-bold">{title}</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex-none inline-flex items-center min-h-11 px-2 text-sm text-yoru-muted underline underline-offset-4 hover:text-kinari"
              >
                新しいタブで開く
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-none inline-flex items-center min-h-11 px-4 rounded-full border border-[#6b5d94] text-sm font-bold hover:bg-yoru-field transition-colors"
              >
                とじる
              </button>
            </div>
            <iframe
              src={url}
              title={title}
              className="flex-1 w-full bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
              allow="fullscreen; autoplay; clipboard-write"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <p className="px-4 py-2 text-xs leading-[1.7] text-yoru-muted">
              ログインや位置情報を使うアプリは、ここではうまく動かないことがあります。そのときは「新しいタブで開く」から遊んでください。
            </p>
          </div>
        )}
      </dialog>
    </>
  )
}
