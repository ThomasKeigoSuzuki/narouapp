import { canEmbed } from '@/lib/embed'
import TryHere from '@/components/TryHere'

type Props = {
  appId: string
  url: string
  title: string
}

// アプリが埋め込みを許しているときだけ「ここで遊ぶ」を出す
// 調べ終わるまで店のページの表示を待たせないよう、Suspense の中で使う
export default async function TryHereSlot({ appId, url, title }: Props) {
  if (!(await canEmbed(url))) return null
  return <TryHere appId={appId} url={url} title={title} />
}
