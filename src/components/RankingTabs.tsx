'use client'

import { useRouter } from 'next/navigation'

const PERIODS = [
  { key: 'all', label: '全期間' },
  { key: 'monthly', label: '月間' },
  { key: 'weekly', label: '週間' },
  { key: 'daily', label: '日間' },
] as const

type Period = typeof PERIODS[number]['key']

export default function RankingTabs({ current }: { current: Period }) {
  const router = useRouter()

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
      {PERIODS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => router.push(key === 'all' ? '/' : `/?period=${key}`)}
          className={`text-sm py-1.5 px-4 rounded-md font-medium transition-colors ${
            current === key
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
