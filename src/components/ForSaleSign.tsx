import { formatYen, saleContactLink } from '@/lib/sale'

type Props = {
  askingPrice: number | null | undefined
  contact: string | null | undefined
}

// 店のページに出す「ゆずります」の札。値段は店主が付けたもので、横丁は計算も仲介もしない
export default function ForSaleSign({ askingPrice, contact }: Props) {
  const link = contact ? saleContactLink(contact) : null

  return (
    <section
      aria-labelledby="sale-heading"
      className="rounded-[3px] border-[1.5px] border-dashed border-shu bg-[#fff8ec] px-4 sm:px-5 py-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex-none px-2.5 py-1 rounded-[2px] bg-shu text-kinari text-xs font-bold tracking-[0.2em]">ゆずります</span>
        <h2 id="sale-heading" className="font-display text-base tracking-[0.08em]">この店は、次の店主を探しています</h2>
      </div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-sm leading-[1.8]">
        <dt className="text-sumi-soft">希望の値段</dt>
        <dd className="font-bold">{askingPrice ? formatYen(askingPrice) : '相談'}</dd>
        <dt className="text-sumi-soft">連絡先</dt>
        <dd className="min-w-0">
          {link ? (
            <a
              href={link.href}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="text-shu underline underline-offset-4 break-all"
            >
              {link.label}
            </a>
          ) : (
            '店主にお問い合わせください'
          )}
        </dd>
      </dl>
      <p className="mt-3 text-xs leading-[1.8] text-sumi-soft">
        値段は店主が付けたものです。引き継ぐ前に、アプリの中身や権利をよく確かめ、やりとりは店主と直接行ってください。アプリ横丁は売り買いの仲介をしていません。
      </p>
    </section>
  )
}
