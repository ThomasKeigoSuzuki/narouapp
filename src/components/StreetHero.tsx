import Link from 'next/link'
import type { App } from '@/types'

// トップページの最初の画面。夕暮れの空の下に、投稿されたアプリが店として並ぶ

// 空に吊るす提灯（2つのたるみに9個ずつ）
const STRING_LANTERNS = Array.from({ length: 18 }, (_, i) => {
  const t = ((i % 9) + 1) / 10
  return {
    x: Math.floor(i / 9) * 1000 + 1000 * t,
    y: 6 + 112 * t * (1 - t),
    color: ['#e0412a', '#f97316', '#e0412a', '#fcf3e3'][i % 4],
    delay: (((i + 1) * 0.7) % 5).toFixed(1),
  }
})

const STARS: [number, number, number, number][] = [
  [683, 108, 1.8, 0.45], [168, 207, 1, 0.75], [1213, 84, 1.2, 0.45], [196, 181, 1.8, 0.45], [512, 93, 1.8, 0.45],
  [1713, 214, 1, 0.6], [1311, 230, 1, 0.9], [121, 126, 1, 0.6], [613, 177, 1.2, 0.45], [1189, 148, 1.2, 0.45],
  [1211, 216, 1.2, 0.75], [219, 210, 1, 0.45], [1287, 122, 1.8, 0.9], [1611, 150, 1.8, 0.9], [760, 146, 1.2, 0.6],
  [1451, 132, 1, 0.75], [1095, 196, 1.5, 0.9], [609, 225, 1, 0.45], [1068, 177, 1.2, 0.75], [331, 195, 1.8, 0.45],
  [1388, 89, 1.5, 0.75], [1443, 159, 1.8, 0.9], [160, 93, 1.5, 0.9], [1447, 86, 1, 0.75], [1345, 217, 1.8, 0.75],
]

// 店構えの種類。並び順に使い回す
type Front = {
  width: number
  height: number
  upper: number
  wall: string
  noren: string
  window: 'shoji' | 'pair' | 'wide' | 'round'
  sign: 'band' | 'vertical-right' | 'vertical-left'
  lantern: { side: 'left' | 'right'; color: string } | null
}

const FRONTS: Front[] = [
  { width: 166, height: 232, upper: 60, wall: '#2b1c30', noren: '#4f6b2f', window: 'shoji', sign: 'band', lantern: { side: 'left', color: '#e0412a' } },
  { width: 170, height: 262, upper: 84, wall: '#311f2c', noren: '#2b3a67', window: 'shoji', sign: 'vertical-right', lantern: null },
  { width: 164, height: 244, upper: 62, wall: '#2a2036', noren: '#c8402b', window: 'pair', sign: 'band', lantern: { side: 'right', color: '#fcf3e3' } },
  { width: 170, height: 252, upper: 70, wall: '#2b1c30', noren: '#b5481f', window: 'wide', sign: 'band', lantern: { side: 'left', color: '#e0412a' } },
  { width: 166, height: 240, upper: 64, wall: '#2a2036', noren: '#5b3a6e', window: 'round', sign: 'band', lantern: { side: 'right', color: '#f97316' } },
  { width: 168, height: 266, upper: 88, wall: '#311f2c', noren: '#2b3a67', window: 'shoji', sign: 'vertical-left', lantern: null },
]

// 看板に書く屋号。タイトルの区切りより前を使い、長ければ詰める（全角1・半角0.55で数える）
function shopName(title: string): string {
  const head = title.trim().split(/\s+|[—–〜~|｜:：!！?？(（「【]/)[0] || title.trim()
  let width = 0
  let out = ''
  for (const ch of Array.from(head)) {
    const w = /[\x20-\x7e]/.test(ch) ? 0.55 : 1
    if (width + w > 9) return `${out}…`
    width += w
    out += ch
  }
  return out
}

function Lantern({ side, color }: { side: 'left' | 'right'; color: string }) {
  return (
    <span className={`yk-sway absolute top-1.5 flex flex-col items-center ${side === 'left' ? 'left-[7px]' : 'right-[7px]'}`}>
      <span className="w-0.5 h-1.5 bg-[#120c1d]" />
      <span className="w-3 h-[3px] bg-[#120c1d]" />
      <span className="w-5 h-[26px] rounded-full" style={{ background: color, boxShadow: '0 0 18px 6px rgba(255,120,50,.45)' }} />
      <span className="w-3 h-[3px] bg-[#120c1d]" />
    </span>
  )
}

function Window({ kind }: { kind: Front['window'] }) {
  if (kind === 'pair') {
    return (
      <span className="flex gap-4">
        <span className="yk-shoji block w-[30px] h-[30px]" />
        <span className="yk-shoji block w-[30px] h-[30px]" />
      </span>
    )
  }
  if (kind === 'round') return <span className="yk-shoji block w-11 h-11 rounded-full" />
  if (kind === 'wide') return <span className="yk-shoji block w-[84px] h-[34px]" />
  return <span className="yk-shoji block w-14 h-8" />
}

function ShopFront({ app, front }: { app: App; front: Front }) {
  const name = shopName(app.title)
  const emblem = Array.from(app.title.trim())[0] ?? '店'
  // 英字の屋号は縦書きにすると読みにくいので、横の看板にする
  const vertical = front.sign !== 'band' && !/[A-Za-z]/.test(name)
  const signSide = front.sign === 'vertical-left' ? 'left' : 'right'

  return (
    <Link
      href={`/apps/${app.id}`}
      aria-label={`${app.title} の店へ`}
      className="relative flex flex-col flex-none"
      style={{ width: front.width, height: front.height }}
    >
      <span aria-hidden="true" className="yk-roof block h-5 -mx-[9px] bg-[#130d1c]" />
      <span
        aria-hidden="true"
        className="flex items-center"
        style={{
          height: front.upper,
          background: front.wall,
          justifyContent: vertical ? (signSide === 'right' ? 'flex-start' : 'flex-end') : 'center',
          paddingInline: vertical ? 22 : 0,
        }}
      >
        <Window kind={front.window} />
      </span>
      {!vertical && (
        <span aria-hidden="true" className="flex items-center justify-center h-[30px] px-2 bg-wood border-y-2 border-[#3b2418] font-display text-sm tracking-wide text-kinari whitespace-nowrap overflow-hidden">
          {name}
        </span>
      )}
      <span
        aria-hidden="true"
        className="relative flex-1 flex"
        style={{
          background: front.wall,
          justifyContent: vertical ? (signSide === 'right' ? 'flex-start' : 'flex-end') : 'center',
          paddingInline: vertical ? 20 : 0,
          borderTop: vertical ? '3px solid #1f141c' : undefined,
        }}
      >
        <span className="relative block w-[100px]" style={{ background: '#ffcf7a', boxShadow: '0 0 34px rgba(255,170,70,.45)' }}>
          <span className="absolute inset-x-0 top-0 grid grid-cols-3 gap-[3px]">
            <span className="h-[46px]" style={{ background: front.noren }} />
            <span className="h-[46px] flex items-center justify-center font-mincho font-black text-lg text-kinari" style={{ background: front.noren }}>
              {emblem}
            </span>
            <span className="h-[46px]" style={{ background: front.noren }} />
          </span>
          <span className="absolute inset-x-0 bottom-0 h-5 bg-[#8a5a35]" />
        </span>
        {front.lantern && <Lantern side={front.lantern.side} color={front.lantern.color} />}
      </span>
      {vertical && (
        <span
          aria-hidden="true"
          className={`absolute top-[34px] ${signSide === 'right' ? 'right-[7px]' : 'left-[7px]'} [writing-mode:vertical-rl] px-[5px] py-2.5 border-2 border-wood bg-kinari text-sumi font-display text-[15px] tracking-wider shadow-[0_0_18px_rgba(255,200,120,.35)]`}
        >
          {name}
        </span>
      )}
    </Link>
  )
}

// 空き店舗。出店のしかたへ案内する
function VacantFront() {
  return (
    <Link href="#howto" aria-label="空き店舗あり。出店のしかたを見る" className="relative flex flex-col flex-none w-[170px] h-[222px] text-sumi">
      <span aria-hidden="true" className="yk-roof block h-5 -mx-[9px] bg-[#130d1c]" />
      <span aria-hidden="true" className="flex items-center justify-center h-[54px] bg-[#241d33]">
        <span className="block w-14 h-[30px] border-2 border-[#322a45] bg-[#171225]" />
      </span>
      <span aria-hidden="true" className="flex items-center justify-center h-[30px] bg-[#2f2842] border-y-2 border-[#1b1628] font-display text-sm tracking-[0.1em] text-yoru-muted">
        空き店舗
      </span>
      <span className="yk-shutter flex-1 flex items-center justify-center">
        <span className="flex flex-col items-center gap-1 px-3.5 pt-2.5 pb-2 bg-kinari -rotate-3 shadow-[0_8px_16px_rgba(0,0,0,.45)]">
          <span className="font-display text-base leading-tight text-center">出店者<br />募集中</span>
          <span className="text-xs font-bold text-[#8a3a1f]">出店のしかた →</span>
        </span>
      </span>
    </Link>
  )
}

// 通りの端に続く、看板のない家並み
function SideHouse({ width, height, lit }: { width: number; height: number; lit: boolean }) {
  return (
    <span aria-hidden="true" className="flex flex-col flex-none" style={{ width, height }}>
      <span className="yk-roof block h-[18px] -mx-[7px] bg-[#130d1c]" />
      <span className="flex-1 flex justify-center gap-3.5 pt-6 bg-[#241a2e]">
        <span className="block w-[30px] h-[30px] border-2 border-[#3b2418]" style={{ background: lit ? '#6b4a3c' : '#3a2a33' }} />
        <span className="block w-[30px] h-[30px] border-2 border-[#3b2418]" style={{ background: lit ? '#3a2a33' : '#6b4a3c' }} />
      </span>
    </span>
  )
}

export default function StreetHero({ apps, total }: { apps: App[]; total: number }) {
  const shops = apps.slice(0, FRONTS.length)
  const half = Math.ceil(shops.length / 2)

  return (
    <section aria-labelledby="hero-heading" className="yk-sky relative overflow-hidden">
      <svg aria-hidden="true" width="2000" height="240" viewBox="0 0 2000 240" className="absolute top-0 left-1/2 -ml-[1000px] max-w-none">
        <defs>
          <radialGradient id="yk-glow">
            <stop offset="0" stopColor="#ffb347" stopOpacity=".55" />
            <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
          </radialGradient>
        </defs>
        {STARS.map(([x, y, r, o]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#fcf3e3" opacity={o} />
        ))}
        <path d="M0 6Q500 62 1000 6Q1500 62 2000 6" fill="none" stroke="#120c1d" strokeWidth="1.6" />
        {STRING_LANTERNS.map(({ x, y, color, delay }) => (
          <g key={x} className="yk-sway" style={{ animationDelay: `-${delay}s` }}>
            <path d={`M${x} ${y}v6`} stroke="#2a1a14" strokeWidth="1.5" />
            <circle cx={x} cy={y + 19} r="22" fill="url(#yk-glow)" />
            <rect x={x - 5} y={y + 6} width="10" height="3" rx="1" fill="#2a1a14" />
            <ellipse cx={x} cy={y + 19} rx="8" ry="10.5" fill={color} />
            <path d={`M${x - 7.5} ${y + 15}h15M${x - 7.5} ${y + 23}h15`} stroke="#000" strokeOpacity=".16" />
            <rect x={x - 5} y={y + 29} width="10" height="3" rx="1" fill="#2a1a14" />
          </g>
        ))}
      </svg>
      <span aria-hidden="true" className="hidden sm:block absolute top-24 right-[9%] w-12 h-12 rounded-full bg-[#fde9c0] shadow-[0_0_44px_10px_rgba(253,233,192,.22)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-[88px] flex flex-col items-start gap-[18px] text-kinari">
        <p className="inline-flex items-center gap-2.5 px-4 py-1 rounded-full border border-kinari/40 text-[13px] tracking-[0.08em]">
          <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[#ffb347] shadow-[0_0_10px_3px_rgba(255,179,71,.7)]" />
          本日も営業中　いま {total} 軒
        </p>
        <h1 id="hero-heading" className="font-mincho font-black text-[clamp(34px,5vw,62px)] leading-[1.28] tracking-[0.02em] text-balance">
          <span className="inline-block">AIでつくった</span>
          <span className="inline-block">アプリが、</span>
          <br />
          <span className="inline-block">軒を連ねる。</span>
        </h1>
        <p className="max-w-[36em] text-[17px] leading-[1.9] text-[#f6e9d6] text-pretty [word-break:auto-phrase]">
          ぶらりと歩いて、気になる店ののれんをくぐってみてください。
          <br />
          AIと一緒につくったアプリなら、だれでも出店できます。
        </p>
        <div className="mt-2.5 flex flex-wrap gap-3">
          <Link
            href="/apps/new"
            className="inline-flex items-center gap-2.5 h-[52px] px-[26px] rounded-full bg-orange-500 text-yoru font-bold hover:bg-orange-400 transition-colors shadow-[0_12px_30px_-10px_rgba(249,115,22,.75)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            アプリを出店する
          </Link>
          <Link
            href="#banzuke"
            className="inline-flex items-center gap-2 h-[52px] px-[22px] rounded-full border-[1.5px] border-kinari/60 font-bold hover:bg-kinari/10 transition-colors"
          >
            横丁を歩く
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* 通り。スマホでは真ん中（空き店舗のあたり）だけが見える */}
      <div className="relative mt-11 flex justify-center items-end gap-[3px]">
        <SideHouse width={128} height={186} lit />
        <SideHouse width={136} height={204} lit={false} />
        {shops.slice(0, half).map((app, i) => (
          <ShopFront key={app.id} app={app} front={FRONTS[i]} />
        ))}
        <VacantFront />
        {shops.slice(half).map((app, i) => (
          <ShopFront key={app.id} app={app} front={FRONTS[half + i]} />
        ))}
        <SideHouse width={136} height={198} lit />
        <SideHouse width={128} height={180} lit={false} />
      </div>
      <div aria-hidden="true" className="relative h-[26px] bg-[#120d1d] border-t-[3px] border-[#0b0814]" />
    </section>
  )
}
