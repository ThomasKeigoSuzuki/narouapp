/**
 * Vercel環境では VERCEL_URL が自動設定される（プロトコルなし）。
 * NEXT_PUBLIC_SITE_URL が設定されていればそれを優先。
 * ローカルは localhost:3000。
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}
