import Link from 'next/link'

const PERIODS = [
  { key: 'all', label: '全期間' },
  { key: 'monthly', label: '月間' },
  { key: 'weekly', label: '週間' },
  { key: 'daily', label: '日間' },
] as const

type Period = typeof PERIODS[number]['key']

export default function RankingTabs({ current }: { current: Period }) {
  return (
    <nav aria-label="番付の期間" className="flex flex-wrap gap-1.5">
      {PERIODS.map(({ key, label }) => {
        const active = current === key
        return (
          <Link
            key={key}
            href={key === 'all' ? '/#banzuke' : `/?period=${key}#banzuke`}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex items-center h-11 px-[18px] rounded text-sm transition-colors ${
              active
                ? 'bg-orange-500 text-yoru font-bold'
                : 'border border-[#4a3d6e] bg-yoru-field text-[#e6dcf5] hover:bg-[#2c2350]'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
