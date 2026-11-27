'use client'

import type { ReactNode } from 'react'
import { recordPlay } from '@/lib/play'

type Props = {
  appId: string
  href: string
  className?: string
  children: ReactNode
}

// 新しいタブでアプリを開き、遊ばれた回数の合図を送るリンク
export default function PlayLink({ appId, href, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => recordPlay(appId)}
      onAuxClick={(e) => {
        // ホイールボタンで新しいタブに開いたときも数える
        if (e.button === 1) recordPlay(appId)
      }}
    >
      {children}
    </a>
  )
}
