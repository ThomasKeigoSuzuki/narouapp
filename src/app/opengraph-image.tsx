import { ImageResponse } from 'next/og'
import { siteOgCard } from '@/lib/og/card'
import { loadOgFonts } from '@/lib/og/fonts'
import { getSiteUrl } from '@/lib/site-url'

// サイト全体の標準OGP画像（トップページなど、個別の画像を持たないページで使われる）
export const alt = 'なろうApp - AIと一緒に作ったアプリが集まる場所'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
// フォントの取得に一時的に失敗しても、1日で作り直されるようにする
export const revalidate = 86400

export default async function Image() {
  const { element, text } = siteOgCard(new URL(getSiteUrl()).host)
  return new ImageResponse(element, { ...size, fonts: await loadOgFonts(text) })
}
