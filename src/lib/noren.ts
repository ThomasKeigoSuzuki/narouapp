// 店ごとの暖簾の色。作品IDから決めるので、トップページでも作品ページでも同じ色になる
const NOREN_COLORS = ['#2b3a67', '#c8402b', '#4f6b2f', '#b5481f', '#5b3a6e']

export function norenColor(id: string): string {
  let hash = 0
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return NOREN_COLORS[hash % NOREN_COLORS.length]
}

// 暖簾に染める一文字（タイトルの最初の文字）
export function norenEmblem(title: string): string {
  return Array.from(title.trim())[0] ?? '店'
}
