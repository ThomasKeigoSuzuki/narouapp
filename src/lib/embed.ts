import { unstable_cache } from 'next/cache'
import { getSiteUrl } from '@/lib/site-url'

// 横丁のページの中（iframe）にアプリを表示できるかを調べる
// アプリ側が X-Frame-Options や CSP の frame-ancestors で埋め込みを断っていれば、表示しない

const CHECK_TIMEOUT_MS = 3000
const ONE_DAY_SECONDS = 60 * 60 * 24

export async function canEmbed(url: string): Promise<boolean> {
  let target: URL
  try {
    target = new URL(url)
  } catch {
    return false
  }
  if (!isPublicHttpsUrl(target)) return false

  const site = new URL(getSiteUrl())
  // 横丁の中に横丁は入れない
  if (target.hostname === site.hostname) return false

  return checkFraming(target.toString(), site.origin)
}

// 結果は1日おぼえておく。店のページを開くたびにアプリへ問い合わせないため
const checkFraming = unstable_cache(
  async (url: string, siteOrigin: string): Promise<boolean> => {
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
        headers: { 'user-agent': 'AppYokochoBot/1.0 (+https://appyokocho.com)' },
        cache: 'no-store',
      })
      // 見るのはヘッダーだけなので、本文は読まずに捨てる
      await res.body?.cancel()
      if (!res.ok) return false
      if (new URL(res.url).protocol !== 'https:') return false
      return framingAllowedByHeaders(res.headers, siteOrigin)
    } catch {
      return false
    }
  },
  ['can-embed-v1'],
  { revalidate: ONE_DAY_SECONDS },
)

// 外から見える https のURLだけを調べる（社内のアドレスなどへ問い合わせないため）
function isPublicHttpsUrl(url: URL): boolean {
  if (url.protocol !== 'https:' || url.port !== '') return false
  const host = url.hostname.toLowerCase()
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    return false
  }
  // IPアドレスを直接書いたURLは調べない
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':') || host.startsWith('[')) return false
  return host.includes('.')
}

// アプリが返したヘッダーで、横丁（siteOrigin）からの埋め込みが許されているか
export function framingAllowedByHeaders(headers: Headers, siteOrigin: string): boolean {
  const site = new URL(siteOrigin)

  // CSP の frame-ancestors があれば、X-Frame-Options より優先される
  const csp = headers.get('content-security-policy')
  if (csp) {
    const frameAncestors = csp
      .split(',')
      .flatMap((policy) => policy.split(';'))
      .map((directive) => directive.trim())
      .filter((directive) => /^frame-ancestors(\s|$)/i.test(directive))
    if (frameAncestors.length > 0) {
      return frameAncestors.every((directive) =>
        directive.split(/\s+/).slice(1).some((source) => sourceAllows(source, site)),
      )
    }
  }

  const xfo = headers.get('x-frame-options')
  if (xfo) {
    const values = xfo.split(',').map((value) => value.trim().toLowerCase())
    if (values.includes('deny') || values.includes('sameorigin')) return false
  }
  return true
}

function sourceAllows(source: string, site: URL): boolean {
  const s = source.toLowerCase()
  if (s === '*' || s === 'https:') return true
  // 'self' や 'none' は、アプリ自身か、どこからも埋め込ませない指定
  if (s.startsWith("'")) return false

  const match = s.match(/^(?:(https?):\/\/)?(\*\.)?([a-z0-9.-]+)(?::(\d+|\*))?(?:\/.*)?$/)
  if (!match) return false
  const [, , wildcard, host, port] = match
  if (port && port !== '*' && port !== '443') return false
  return wildcard ? site.hostname.endsWith(`.${host}`) : site.hostname === host
}
