/* eslint-disable @next/next/no-img-element -- next/og の画像生成では <img> を使う */
import type { ReactElement } from 'react'

// OGP画像（Xなどでシェアされたときのカード）のデザイン。
// next/og の ImageResponse で描画するため、使えるのは flexbox と一部のCSSだけ。
// 子要素が2つ以上ある要素には必ず display: 'flex' を付ける。

export const OG_SIZE = { width: 1200, height: 630 }

const COLOR = {
  ink: '#111827',
  sub: '#6b7280',
  orange: '#f97316',
  orangeDeep: '#c2410c',
  orangeSoft: '#ffedd5',
  red: '#dc2626',
}

const BACKGROUND = 'linear-gradient(135deg, #fff7ed 0%, #ffffff 55%, #fef2f2 100%)'
const BRAND_GRADIENT = 'linear-gradient(90deg, #f97316 0%, #ef4444 50%, #dc2626 100%)'

// ヘッダーのロゴと同じ、ドットのひし形
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#dc2626"/></linearGradient></defs><circle cx="16" cy="2.5" r="2.4" fill="url(#g)" opacity="0.55"/><circle cx="9" cy="9" r="2.4" fill="url(#g)" opacity="0.70"/><circle cx="16" cy="9" r="2.4" fill="url(#g)" opacity="0.82"/><circle cx="23" cy="9" r="2.4" fill="url(#g)" opacity="0.70"/><circle cx="5.5" cy="16" r="2.4" fill="url(#g)" opacity="0.85"/><circle cx="12.5" cy="16" r="2.4" fill="url(#g)" opacity="0.95"/><circle cx="19.5" cy="16" r="2.4" fill="url(#g)" opacity="0.95"/><circle cx="26.5" cy="16" r="2.4" fill="url(#g)" opacity="0.85"/><circle cx="9" cy="23" r="2.4" fill="url(#g)"/><circle cx="16" cy="23" r="2.4" fill="url(#g)"/><circle cx="23" cy="23" r="2.4" fill="url(#g)"/><circle cx="16" cy="29.5" r="2.4" fill="url(#g)" opacity="0.80"/></svg>`
const LOGO_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(LOGO_SVG)}`

const SITE_NAME = 'なろうApp'
const TAGLINE = 'AIと一緒に作ったアプリが集まる場所'
const CATCHCOPY = 'アプリ開発者になろう。'
const CATCHCOPY_EN = 'Build it. Share it.'

export type AppOgInput = {
  title: string
  author: string | null
  tags: string[]
  aiTools: string[]
  /** スクリーンショット（data URL）。取得できなかったときは null */
  image: string | null
  siteHost: string
}

type OgCard = {
  element: ReactElement
  /** カードに描かれる全文字。フォントをこの文字だけに絞って読み込むために使う */
  text: string
}

function chars(s: string): string[] {
  return Array.from(s)
}

function truncate(s: string, max: number): string {
  const c = chars(s.replace(/\s+/g, ' ').trim())
  return c.length > max ? `${c.slice(0, max - 1).join('')}…` : c.join('')
}

// タイトルの長さに応じて文字サイズを変え、カードに収める
function titleFontSize(title: string, hasImage: boolean): number {
  const n = chars(title).length
  if (hasImage) {
    if (n <= 12) return 64
    if (n <= 24) return 54
    if (n <= 36) return 46
    return 40
  }
  if (n <= 16) return 76
  if (n <= 32) return 62
  return 50
}

function Brand({ size }: { size: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={LOGO_SRC} width={size} height={size} alt="" />
      <span
        style={{
          marginLeft: Math.round(size * 0.3),
          fontSize: Math.round(size * 0.78),
          fontWeight: 800,
          color: COLOR.ink,
          letterSpacing: '-0.02em',
        }}
      >
        {SITE_NAME}
      </span>
    </div>
  )
}

function Frame({
  siteHost,
  footerRight,
  children,
}: {
  siteHost: string
  footerRight: string | null
  children: ReactElement
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: BACKGROUND,
        fontFamily: 'Noto Sans JP',
      }}
    >
      <div style={{ display: 'flex', height: 14, backgroundImage: BRAND_GRADIENT }} />
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', padding: '44px 64px 36px' }}>
        {children}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            color: COLOR.sub,
          }}
        >
          <span>{siteHost}</span>
          {footerRight && <span style={{ fontWeight: 800, color: COLOR.orangeDeep }}>{footerRight}</span>}
        </div>
      </div>
    </div>
  )
}

export function appOgCard(input: AppOgInput): OgCard {
  const hasImage = input.image !== null
  const title = truncate(input.title, hasImage ? 52 : 64)
  const author = input.author ? truncate(input.author, 24) : null
  const tools = input.aiTools.filter((t) => t && t !== 'その他').slice(0, 2).map((t) => truncate(t, 12))
  const tags = input.tags.filter(Boolean).slice(0, 5 - tools.length).map((t) => `#${truncate(t, 12)}`)
  const byline = author ? `by ${author}` : null

  const element = (
    <Frame siteHost={input.siteHost} footerRight={CATCHCOPY}>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Brand size={44} />
          <span style={{ fontSize: 24, color: COLOR.sub }}>{TAGLINE}</span>
        </div>

        <div style={{ display: 'flex', flex: 1, alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <div
              style={{
                display: 'flex',
                fontSize: titleFontSize(title, hasImage),
                fontWeight: 800,
                color: COLOR.ink,
                lineHeight: 1.3,
              }}
            >
              {title}
            </div>
            {byline && (
              <div style={{ display: 'flex', marginTop: 20, fontSize: 28, color: COLOR.sub }}>{byline}</div>
            )}
            {(tools.length > 0 || tags.length > 0) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 24 }}>
                {tools.map((t) => (
                  <div
                    key={`tool-${t}`}
                    style={{
                      display: 'flex',
                      marginRight: 12,
                      marginBottom: 12,
                      padding: '6px 18px',
                      borderRadius: 999,
                      background: COLOR.ink,
                      color: '#ffffff',
                      fontSize: 22,
                    }}
                  >
                    {t}
                  </div>
                ))}
                {tags.map((t) => (
                  <div
                    key={`tag-${t}`}
                    style={{
                      display: 'flex',
                      marginRight: 12,
                      marginBottom: 12,
                      padding: '6px 18px',
                      borderRadius: 999,
                      background: COLOR.orangeSoft,
                      color: COLOR.orangeDeep,
                      fontSize: 22,
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>

          {input.image ? (
            <div
              style={{
                display: 'flex',
                marginLeft: 48,
                padding: 3,
                borderRadius: 23,
                background: '#fed7aa',
                boxShadow: '0 24px 48px rgba(124, 45, 18, 0.18)',
              }}
            >
              <img
                src={input.image}
                width={480}
                height={300}
                alt=""
                style={{ objectFit: 'cover', borderRadius: 20, background: '#ffffff' }}
              />
            </div>
          ) : (
            // スクリーンショットがないときは、ロゴを薄く敷いて余白を埋める
            <div style={{ display: 'flex', position: 'absolute', right: 0, opacity: 0.1 }}>
              <img src={LOGO_SRC} width={300} height={300} alt="" />
            </div>
          )}
        </div>
      </div>
    </Frame>
  )

  const text = [SITE_NAME, TAGLINE, CATCHCOPY, input.siteHost, title, byline ?? '', ...tools, ...tags].join('')
  return { element, text }
}

export function siteOgCard(siteHost: string): OgCard {
  const element = (
    <Frame siteHost={siteHost} footerRight={null}>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            padding: '8px 24px',
            borderRadius: 999,
            background: COLOR.orangeSoft,
            color: COLOR.orangeDeep,
            fontSize: 26,
            fontWeight: 800,
          }}
        >
          {TAGLINE}
        </div>
        <div style={{ display: 'flex', marginTop: 36 }}>
          <Brand size={112} />
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 32,
            fontSize: 52,
            fontWeight: 800,
            color: COLOR.ink,
            letterSpacing: '-0.01em',
          }}
        >
          {CATCHCOPY}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 12,
            fontSize: 34,
            fontWeight: 800,
            color: COLOR.orange,
          }}
        >
          {CATCHCOPY_EN}
        </div>
      </div>
    </Frame>
  )

  const text = [SITE_NAME, TAGLINE, CATCHCOPY, CATCHCOPY_EN, siteHost].join('')
  return { element, text }
}
