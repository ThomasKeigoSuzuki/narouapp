import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppCard from '@/components/AppCard'
import RankingTabs from '@/components/RankingTabs'
import TagCloud from '@/components/TagCloud'
import StreetHero from '@/components/StreetHero'
import type { App } from '@/types'

export const revalidate = 60

type Period = 'daily' | 'weekly' | 'monthly' | 'all'
const VALID_PERIODS: Period[] = ['daily', 'weekly', 'monthly', 'all']

// 検索語から、Supabase（PostgREST）の絞り込み条件で区切りとして扱われる文字（, ( ) " \）を取り除く。
// 残った語で、タイトルか概要に含むものを部分一致で探す
function toSearchPattern(query: string): string | null {
  const cleaned = query.replace(/[,()"\\]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 50)
  return cleaned ? `%${cleaned}%` : null
}

function getPeriodStart(period: Period): string | null {
  const now = new Date()
  if (period === 'daily') { now.setDate(now.getDate() - 1); return now.toISOString() }
  if (period === 'weekly') { now.setDate(now.getDate() - 7); return now.toISOString() }
  if (period === 'monthly') { now.setMonth(now.getMonth() - 1); return now.toISOString() }
  return null
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; q?: string; tag?: string }>
}) {
  const { period: rawPeriod, q, tag } = await searchParams
  const period: Period = VALID_PERIODS.includes(rawPeriod as Period) ? (rawPeriod as Period) : 'all'
  const searchQuery = q?.trim() ?? ''

  const supabase = await createClient()

  // アプリ一覧クエリを構築
  let appsQuery = supabase
    .from('apps')
    .select('*, author:profiles(id, username, avatar_url)', { count: 'exact' })
    .order('likes_count', { ascending: false })
    .limit(30)

  const periodStart = getPeriodStart(period)
  if (periodStart) appsQuery = appsQuery.gte('created_at', periodStart)
  const searchPattern = toSearchPattern(searchQuery)
  if (searchPattern) appsQuery = appsQuery.or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
  if (tag) appsQuery = appsQuery.contains('tags', [tag])

  // getUser と appsクエリを並列実行
  const [{ data: { user } }, { data: apps, count: matchedCount }] = await Promise.all([
    supabase.auth.getUser(),
    appsQuery,
  ])

  // いいね済みセット（userが確定してから実行）
  let likedAppIds = new Set<string>()
  if (user) {
    const { data: likes } = await supabase
      .from('likes')
      .select('app_id')
      .eq('user_id', user.id)
    if (likes) likedAppIds = new Set(likes.map((l: { app_id: string }) => l.app_id))
  }

  // 人気タグ集計（appsクエリの結果を再利用、別クエリ廃止）
  const tagCounts: Record<string, number> = {}
  for (const app of apps ?? []) {
    for (const t of app.tags ?? []) {
      if (t) tagCounts[t] = (tagCounts[t] ?? 0) + 1
    }
  }
  const popularTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([t, count]) => ({ tag: t, count }))

  const isFiltered = searchQuery || tag
  // 表示は最大30件だが、件数は条件に合う全体の数を出す
  const totalCount = matchedCount ?? apps?.length ?? 0

  return (
    <div className="yk-full bg-yoru text-kinari">
      {!isFiltered && period === 'all' && <StreetHero apps={apps ?? []} total={totalCount} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-20 flex flex-wrap items-start gap-10">
        <section id="banzuke" aria-labelledby="banzuke-heading" className="flex-[999_1_560px] min-w-0 scroll-mt-24">
          {isFiltered ? (
            <div className="mb-7">
              <h2 id="banzuke-heading" className="font-display text-2xl tracking-wider break-words">
                {searchQuery ? `「${searchQuery}」の店` : `#${tag} の店`}
              </h2>
              <p className="mt-1.5 text-sm text-yoru-muted">
                {totalCount}軒 見つかりました・
                <Link href="/" className="underline underline-offset-4 hover:text-kinari">横丁の入口に戻る</Link>
              </p>
            </div>
          ) : (
            <div className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
              <div>
                <h2 id="banzuke-heading" className="font-display text-[30px] tracking-[0.08em]">繁盛番付</h2>
                <p className="mt-1 text-sm text-yoru-muted">灯（いいね）の多い店から並んでいます</p>
              </div>
              <RankingTabs current={period} />
            </div>
          )}

          {apps && apps.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-7 gap-y-8">
              {apps.map((app: App, i) => (
                <AppCard
                  key={app.id}
                  app={app}
                  currentUserId={user?.id}
                  initialLiked={likedAppIds.has(app.id)}
                  rank={!isFiltered ? i + 1 : undefined}
                  priority={i < 4}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 px-6 text-center rounded border border-yoru-line bg-yoru-band">
              <p className="font-display text-lg tracking-wide">
                {isFiltered ? 'この通りには、まだ店がありません' : 'この期間に出店した店はまだありません'}
              </p>
              <p className="mt-2 text-sm text-yoru-muted">
                {isFiltered ? '別のことばや通り（タグ）で探してみてください' : '「全期間」の番付も見てみてください'}
              </p>
            </div>
          )}
        </section>

        <aside aria-label="横丁の案内" className="flex-[1_1_260px] min-w-0 flex flex-col gap-8">
          <TagCloud tags={popularTags} currentTag={tag} />

          {/* 出店者募集の張り紙 */}
          <section aria-labelledby="bosyu-heading" className="relative px-6 pt-[34px] pb-6 bg-[#f7ecd6] text-sumi -rotate-[1.2deg] shadow-[0_20px_34px_-14px_rgba(0,0,0,.7)]">
            <span aria-hidden="true" className="absolute top-3 left-1/2 -ml-1.5 w-3 h-3 rounded-full bg-[#c8402b] shadow-[0_2px_3px_rgba(0,0,0,.4)]" />
            <p className="text-xs font-bold tracking-[0.3em] text-[#8a3a1f]">おしらせ</p>
            <h2 id="bosyu-heading" className="mt-2 mb-3 font-mincho font-black text-[32px] leading-[1.3]">空き店舗<br />あります</h2>
            <p className="mb-5 text-sm leading-[1.85] text-[#4d3d33]">AIと一緒につくったアプリなら、どなたでも出店できます。出店料はかかりません。</p>
            <Link href="/apps/new" className="flex items-center justify-center h-12 rounded-full bg-yoru text-kinari text-[15px] font-bold hover:bg-[#2b2350] transition-colors">
              アプリを出店する
            </Link>
          </section>
        </aside>
      </div>

      <HowToOpen />
    </div>
  )
}

// 出店のしかた（3つの手順）
const HOW_TO_STEPS = [
  {
    num: '一',
    title: '仕込む',
    body: 'Claude・Cursor・Lovable など、好きなAIと一緒にアプリをつくります。',
    icon: (
      <>
        <path d="M4 11h16v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
        <path d="M2 11h20" />
        <path d="M9 7c0-1 1-1.5 0-3M13 7c0-1 1-1.5 0-3M17 7c0-1 1-1.5 0-3" />
      </>
    ),
  },
  {
    num: '二',
    title: '出店する',
    body: 'アプリのURLと説明を書いて投稿します。スクリーンショットがあると店先が映えます。',
    icon: (
      <>
        <path d="M2 4h20" />
        <path d="M4 4v11h4.5V4M9.75 4v11h4.5V4M15.5 4v11H20V4" />
        <path d="M3 20h18" />
      </>
    ),
  },
  {
    num: '三',
    title: '灯がともる',
    body: '気に入った人が灯（いいね）をともし、ひとことを残してくれます。Xでの紹介もかんたんです。',
    icon: (
      <>
        <path d="M12 1.5v2M8 3.5h8M8 20.5h8M12 20.5v2" />
        <ellipse cx="12" cy="12" rx="6" ry="8.5" />
        <path d="M6.5 9h11M6.5 15h11" />
        <path d="M2 9l2 .8M22 9l-2 .8M2.5 15.5l2-.6M21.5 15.5l-2-.6" />
      </>
    ),
  },
]

function HowToOpen() {
  return (
    <section id="howto" aria-labelledby="howto-heading" className="scroll-mt-20 border-y border-yoru-line bg-yoru-band">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-[72px] flex flex-col gap-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="howto-heading" className="font-display text-[30px] tracking-[0.08em]">出店のしかた</h2>
          <p className="text-[15px] text-yoru-muted">Googleでログインして、3つの手順でのれんを出せます。</p>
        </div>
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-5">
          {HOW_TO_STEPS.map((step) => (
            <li key={step.num} className="flex flex-col gap-2.5 px-6 pt-[26px] pb-7 rounded-md border border-yoru-line bg-yoru">
              <div className="flex items-center justify-between">
                <span className="font-mincho font-black text-[46px] leading-none text-orange-500">{step.num}</span>
                <svg className="w-[34px] h-[34px]" fill="none" viewBox="0 0 24 24" stroke="#f6b450" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {step.icon}
                </svg>
              </div>
              <h3 className="mt-1.5 text-[21px] font-bold">{step.title}</h3>
              <p className="text-[15px] leading-[1.85] text-yoru-muted">{step.body}</p>
            </li>
          ))}
        </ol>
        <div>
          <Link
            href="/apps/new"
            className="inline-flex items-center gap-2.5 h-[52px] px-[26px] rounded-full bg-orange-500 text-yoru font-bold hover:bg-orange-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            アプリを出店する
          </Link>
        </div>
      </div>
    </section>
  )
}
