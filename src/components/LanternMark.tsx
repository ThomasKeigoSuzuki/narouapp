// アプリ横丁のロゴマーク。旧ロゴのドットを、提灯の形に並べ直したもの
const ROWS = [
  { y: 10.5, xs: [10, 15, 20], color: '#fb8a2e' },
  { y: 15.7, xs: [7, 12.3, 17.7, 23], color: '#f97316' },
  { y: 21, xs: [4.8, 9.9, 15, 20.1, 25.2], color: '#f2592a' },
  { y: 26.3, xs: [7, 12.3, 17.7, 23], color: '#e8432a' },
  { y: 31.5, xs: [10, 15, 20], color: '#dc2626' },
]

export default function LanternMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={Math.round(size * 0.75)} height={size} viewBox="0 0 30 40" aria-hidden="true">
      <path d="M15 0v3" stroke="#f6b450" strokeWidth="1.6" />
      <rect x="8" y="3" width="14" height="3.4" rx="1.2" fill="#f6b450" />
      {ROWS.map((row) =>
        row.xs.map((x) => <circle key={`${row.y}-${x}`} cx={x} cy={row.y} r="2.2" fill={row.color} />),
      )}
      <rect x="8" y="35.4" width="14" height="3.4" rx="1.2" fill="#f6b450" />
    </svg>
  )
}
