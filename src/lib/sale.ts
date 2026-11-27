// 「ゆずります」の札の入力の確かめと、表示のための小さな道具

export const ASKING_PRICE_MAX = 100_000_000
export const SALE_CONTACT_MAX = 200

type Result<T> = { ok: true; value: T } | { ok: false; error: string }

// 希望の値段（円）。空なら null（「相談」と表示する）。全角の数字・カンマ・「円」も受け付ける
export function parseAskingPrice(raw: unknown): Result<number | null> {
  const text = String(raw ?? '').normalize('NFKC').replace(/[,\s円]/g, '')
  if (text === '') return { ok: true, value: null }
  if (!/^\d+$/.test(text)) return { ok: false, error: '希望の値段は、数字（円）で入れてください' }
  const price = Number(text)
  if (price < 1 || price > ASKING_PRICE_MAX) {
    return { ok: false, error: '希望の値段は、1円から1億円までで入れてください' }
  }
  return { ok: true, value: price }
}

// 連絡先は、XのID（@から）か、https から始まるURL
export function parseSaleContact(raw: unknown): Result<string> {
  const text = String(raw ?? '').normalize('NFKC').trim()
  if (text === '') return { ok: false, error: '「ゆずります」の札を出すときは、連絡先を入れてください' }
  if (text.length > SALE_CONTACT_MAX) return { ok: false, error: `連絡先は${SALE_CONTACT_MAX}文字までにしてください` }
  if (/^@[A-Za-z0-9_]{1,15}$/.test(text)) return { ok: true, value: text }
  try {
    const url = new URL(text)
    if (url.protocol === 'https:' && url.hostname.includes('.')) return { ok: true, value: url.toString() }
  } catch {
    // 下のエラーを返す
  }
  return { ok: false, error: '連絡先は、XのID（@から）か、https から始まるURLで入れてください' }
}

// 店のページに出す連絡先のリンク
export function saleContactLink(contact: string): { href: string; label: string } | null {
  if (/^@[A-Za-z0-9_]{1,15}$/.test(contact)) {
    return { href: `https://x.com/${contact.slice(1)}`, label: `${contact}（X）` }
  }
  try {
    const url = new URL(contact)
    if (url.protocol !== 'https:') return null
    return { href: url.toString(), label: `${url.host}${url.pathname === '/' ? '' : url.pathname}` }
  } catch {
    return null
  }
}

export function formatYen(price: number): string {
  return `${price.toLocaleString('ja-JP')}円`
}
