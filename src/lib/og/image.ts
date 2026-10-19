// 作品のスクリーンショットを取得し、OGP画像に埋め込める data URL にする。
// 取得できない・形式が合わない・大きすぎる場合は null を返し、画像なしのカードにする。

const ALLOWED_TYPES = ['image/png', 'image/jpeg']
const MAX_BYTES = 4 * 1024 * 1024
const TIMEOUT_MS = 4000

// 投稿者が入力したURLをサーバーから取りに行くため、明らかに内部向けの宛先は除外する
function isFetchableUrl(url: URL): boolean {
  if (url.protocol !== 'https:') return false
  const host = url.hostname
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal')) return false
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':') || host.startsWith('[')) return false
  return true
}

export async function fetchImageAsDataUrl(rawUrl: string | null | undefined): Promise<string | null> {
  if (!rawUrl) return null

  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return null
  }
  if (!isFetchableUrl(url)) return null

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
    if (!response.ok) return null

    const type = (response.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
    if (!ALLOWED_TYPES.includes(type)) return null

    const declaredLength = Number(response.headers.get('content-length') ?? 0)
    if (declaredLength > MAX_BYTES) return null

    const buffer = await response.arrayBuffer()
    if (buffer.byteLength > MAX_BYTES) return null

    return `data:${type};base64,${Buffer.from(buffer).toString('base64')}`
  } catch {
    return null
  }
}
