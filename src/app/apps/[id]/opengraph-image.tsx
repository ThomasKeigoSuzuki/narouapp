import { ImageResponse } from 'next/og'
import { appOgCard, siteOgCard } from '@/lib/og/card'
import { loadOgFonts } from '@/lib/og/fonts'
import { fetchImageAsDataUrl } from '@/lib/og/image'
import { createPublicClient } from '@/lib/supabase/public'
import { getSiteUrl } from '@/lib/site-url'

// 作品ごとのOGP画像。タイトル・作者・タグとスクリーンショットを1枚のカードにする
export const alt = 'なろうアプリに投稿されたアプリ'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
// 作品情報の変更を1時間以内に反映する
export const revalidate = 3600

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type OgApp = {
  title: string
  tags: string[] | null
  ai_tools: string[] | null
  thumbnail_url: string | null
  author: { username: string } | null
}

async function getOgApp(id: string): Promise<OgApp | null> {
  if (!UUID_PATTERN.test(id)) return null
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('apps')
    .select('title, tags, ai_tools, thumbnail_url, author:profiles(username)')
    .eq('id', id)
    .maybeSingle()
  return (data as OgApp | null) ?? null
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const siteHost = new URL(getSiteUrl()).host
  const app = await getOgApp(id)

  // 作品が見つからないときは、サイト共通の画像を返す
  const { element, text } = app
    ? appOgCard({
        title: app.title,
        author: app.author?.username ?? null,
        tags: app.tags ?? [],
        aiTools: app.ai_tools ?? [],
        image: await fetchImageAsDataUrl(app.thumbnail_url),
        siteHost,
      })
    : siteOgCard(siteHost)

  return new ImageResponse(element, { ...size, fonts: await loadOgFonts(text), emoji: 'twemoji' })
}
