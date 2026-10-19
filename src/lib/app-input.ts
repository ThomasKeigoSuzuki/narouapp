// 作品の投稿・編集で受け取る値のチェック。フォーム（Server Action）と投稿APIで共通に使う。

export const APP_INPUT_LIMITS = {
  title: 100,
  description: 3000,
  url: 2048,
  tags: 10,
  tagLength: 30,
  aiTools: 6,
  aiToolLength: 30,
} as const

export type AppInput = {
  title: string
  description: string
  url: string
  tags: string[]
  ai_tools: string[]
}

export type AppInputResult = { ok: true; value: AppInput } | { ok: false; error: string }

/** http:// か https:// で始まる、ホスト名のあるURLだけを受け付ける。問題なければ前後の空白を除いた文字列を返す */
export function validateHttpUrl(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed || trimmed.length > APP_INPUT_LIMITS.url) return null

  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  if (!url.hostname) return null
  // 「https://正規サイト@別サイト」のような、見た目と行き先が違うURLを防ぐ
  if (url.username || url.password) return null
  return trimmed
}

/** フォームのタグ入力（「,」「、」「，」区切り）を配列にする */
export function splitTagInput(raw: string): string[] {
  return raw.split(/[,、，]/)
}

function cleanList(values: unknown[], stripHash: boolean): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const value of values) {
    if (typeof value !== 'string') continue
    let item = value.trim()
    if (stripHash) item = item.replace(/^[#＃]+/, '').trim()
    if (!item || seen.has(item)) continue
    seen.add(item)
    result.push(item)
  }
  return result
}

export function validateAppInput(input: {
  title: unknown
  description: unknown
  url: unknown
  tags: unknown
  ai_tools: unknown
}): AppInputResult {
  const title = typeof input.title === 'string' ? input.title.trim() : ''
  const description = typeof input.description === 'string' ? input.description.trim() : ''
  const rawUrl = typeof input.url === 'string' ? input.url.trim() : ''

  if (!title || !description || !rawUrl) {
    return { ok: false, error: 'タイトル・概要・URLは必須です' }
  }
  if (Array.from(title).length > APP_INPUT_LIMITS.title) {
    return { ok: false, error: `タイトルは${APP_INPUT_LIMITS.title}文字以内にしてください` }
  }
  if (Array.from(description).length > APP_INPUT_LIMITS.description) {
    return { ok: false, error: `概要は${APP_INPUT_LIMITS.description}文字以内にしてください` }
  }

  const url = validateHttpUrl(rawUrl)
  if (!url) {
    return { ok: false, error: 'URLは http:// または https:// で始まる形で入力してください' }
  }

  const tags = cleanList(Array.isArray(input.tags) ? input.tags : [], true)
  if (tags.length > APP_INPUT_LIMITS.tags) {
    return { ok: false, error: `タグは${APP_INPUT_LIMITS.tags}個までにしてください` }
  }
  if (tags.some((tag) => Array.from(tag).length > APP_INPUT_LIMITS.tagLength)) {
    return { ok: false, error: `タグは1つ${APP_INPUT_LIMITS.tagLength}文字以内にしてください` }
  }

  const aiTools = cleanList(Array.isArray(input.ai_tools) ? input.ai_tools : [], false)
  if (
    aiTools.length > APP_INPUT_LIMITS.aiTools ||
    aiTools.some((tool) => Array.from(tool).length > APP_INPUT_LIMITS.aiToolLength)
  ) {
    return { ok: false, error: '使用したAIツールの指定が正しくありません' }
  }

  return { ok: true, value: { title, description, url, tags, ai_tools: aiTools } }
}

// スクリーンショットとして受け付ける画像の形式と、保存時の拡張子
const SCREENSHOT_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export const SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024

/** 画像として受け付けられる形式なら保存用の拡張子を、そうでなければ null を返す */
export function screenshotExtension(file: File): string | null {
  return SCREENSHOT_TYPES[file.type] ?? null
}
