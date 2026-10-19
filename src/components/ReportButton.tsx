'use client'

import { useState, useTransition } from 'react'
import { createReport } from '@/app/apps/[id]/actions'

const REASONS = ['スパム', '不適切なコンテンツ', '著作権侵害', '虚偽情報', 'その他'] as const

type Props = {
  appId: string
  initialReported: boolean
}

export default function ReportButton({ appId, initialReported }: Props) {
  const [open, setOpen] = useState(false)
  const [reported, setReported] = useState(initialReported)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (reported) {
    return (
      <span className="text-xs text-sumi-soft flex items-center gap-1 min-h-11">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        通報済み
      </span>
    )
  }

  const handleSubmit = (reason: string) => {
    setError(null)
    startTransition(async () => {
      const result = await createReport(appId, reason)
      if (result.error) {
        setError(result.error)
      } else {
        setReported(true)
        setOpen(false)
      }
    })
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-sumi-soft hover:text-shu flex items-center gap-1 min-h-11 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z" />
        </svg>
        通報
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-yoru/60 px-4" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="report-heading" className="bg-kinari text-sumi rounded-[3px] border-t-[6px] border-wood shadow-lg p-5 w-80 max-w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 id="report-heading" className="font-display text-base tracking-wider">通報理由を選択</h3>
            {error && <p className="text-xs text-shu">{error}</p>}
            <div className="space-y-2">
              {REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSubmit(reason)}
                  className="w-full text-left text-sm px-3 min-h-11 rounded-[2px] hover:bg-[#f3e2c2] hover:text-shu transition-colors disabled:opacity-50"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full text-center text-xs text-sumi-soft hover:text-sumi min-h-11"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
