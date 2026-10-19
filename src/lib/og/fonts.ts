// OGP画像用の日本語フォント（Noto Sans JP）を Google Fonts から読み込む。
// フォント全体は数MBあるため、カードに描く文字だけに絞ったサブセットを取得する。
// 読み込みに失敗しても画像は作る（next/og が標準の太さの日本語フォントで代わりに描く）。

type OgFont = {
  name: string
  data: ArrayBuffer
  weight: 400 | 800
  style: 'normal'
}

const FAMILY = 'Noto Sans JP'

// TrueType形式で返してもらうためのUser-Agent（next/og が内部で使っているものと同じ）
const TTF_USER_AGENT =
  'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1'

const FACE_PATTERN = /font-weight:\s*(\d+);[^}]*?src:\s*url\(([^)]+)\)\s*format\('(?:opentype|truetype)'\)/g

export async function loadOgFonts(text: string): Promise<OgFont[]> {
  const subset = Array.from(new Set(Array.from(text))).join('')
  if (!subset) return []

  const cssUrl =
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;800&text=' + encodeURIComponent(subset)

  try {
    const cssResponse = await fetch(cssUrl, { headers: { 'User-Agent': TTF_USER_AGENT } })
    if (!cssResponse.ok) throw new Error(`css ${cssResponse.status}`)
    const css = await cssResponse.text()

    const faces = Array.from(css.matchAll(FACE_PATTERN))
    const fonts = await Promise.all(
      faces.map(async ([, weight, src]): Promise<OgFont | null> => {
        if (weight !== '400' && weight !== '800') return null
        const fontResponse = await fetch(src)
        if (!fontResponse.ok) return null
        return {
          name: FAMILY,
          data: await fontResponse.arrayBuffer(),
          weight: weight === '400' ? 400 : 800,
          style: 'normal',
        }
      })
    )
    return fonts.filter((font): font is OgFont => font !== null)
  } catch (error) {
    console.error('[og] フォントの読み込みに失敗しました', error)
    return []
  }
}
