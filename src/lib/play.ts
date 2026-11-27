// 遊ばれた回数を数えるための合図を送る。ページを離れても届くように sendBeacon を使う
export function recordPlay(appId: string) {
  const endpoint = `/api/apps/${appId}/play`
  try {
    if (navigator.sendBeacon?.(endpoint)) return
  } catch {
    // 送れなかったときは下の fetch で送る
  }
  fetch(endpoint, { method: 'POST', keepalive: true, credentials: 'same-origin' }).catch(() => {})
}
