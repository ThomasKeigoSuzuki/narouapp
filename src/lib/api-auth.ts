import { timingSafeEqual } from 'node:crypto'

// 投稿APIの認証。Authorization: Bearer <API_SECRET_KEY> を、比較時間から推測されない方法で照合する
export function hasValidApiKey(request: Request): boolean {
  const expected = process.env.API_SECRET_KEY
  if (!expected) return false

  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''

  const given = Buffer.from(token)
  const wanted = Buffer.from(expected)
  return given.length === wanted.length && timingSafeEqual(given, wanted)
}
