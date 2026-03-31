type Badge = {
  id: string
  icon: string
  label: string
  description: string
  earned: boolean
}

export default function BadgeList({ badges }: { badges: Badge[] }) {
  const earned = badges.filter((b) => b.earned)
  const unearned = badges.filter((b) => !b.earned)

  return (
    <div>
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">バッジ</h2>
      <div className="flex flex-wrap gap-2">
        {earned.map((badge) => (
          <div
            key={badge.id}
            title={badge.description}
            className="badge-earned flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yellow-300 shadow-sm cursor-default"
          >
            <span className="text-base">{badge.icon}</span>
            <span className="text-xs font-bold text-yellow-800">{badge.label}</span>
          </div>
        ))}
        {unearned.map((badge) => (
          <div
            key={badge.id}
            title={`未獲得: ${badge.description}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 opacity-40 cursor-default grayscale"
          >
            <span className="text-base">{badge.icon}</span>
            <span className="text-xs font-medium text-gray-500">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
