'use client'

type Props = {
  title: string
  shareUrl: string
}

export default function ShareButton({ title, shareUrl }: Props) {
  const text = `${title} | なろうApp`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`

  return (
    <a
      href={twitterUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      Xでシェア
    </a>
  )
}
