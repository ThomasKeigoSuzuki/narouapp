import Link from 'next/link'

type TagItem = { tag: string; count: number }

type Props = {
  tags: TagItem[]
  currentTag?: string
}

// タグを「通り」として並べる案内板
function streetName(tag: string): string {
  // 英数字で終わるタグは「React 通り」のように間をあける
  return /[A-Za-z0-9]$/.test(tag) ? `${tag} 通り` : `${tag}通り`
}

export default function TagCloud({ tags, currentTag }: Props) {
  if (tags.length === 0) return null

  return (
    <section aria-labelledby="tori-heading" className="px-[18px] pt-5 pb-[18px] border-2 border-[#5c3a21] rounded bg-[#2a1d17] shadow-[inset_0_0_0_3px_#3b2418]">
      <h2 id="tori-heading" className="font-display text-xl tracking-[0.08em] text-kinari">通りの案内</h2>
      <p className="mt-0.5 mb-3.5 text-[13px] text-[#e3cfb2]">タグごとに店が集まっています</p>
      <ul className="flex flex-col gap-1.5">
        {tags.slice(0, 8).map(({ tag, count }) => {
          const active = currentTag === tag
          return (
            <li key={tag}>
              <Link
                href={active ? '/' : `/?tag=${encodeURIComponent(tag)}`}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center justify-between gap-2 min-h-11 px-3.5 rounded-[2px] text-[15px] font-bold transition-colors ${
                  active ? 'bg-orange-500 text-yoru' : 'bg-kifuda text-[#3b2418] hover:bg-[#f3e2c2]'
                }`}
              >
                <span className="truncate">{streetName(tag)}</span>
                <span className="flex-none text-[13px] font-medium">{count}軒</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
