import type { Metadata } from "next";
import Link from "next/link";
import { Dela_Gothic_One, Zen_Kaku_Gothic_New, Zen_Old_Mincho } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { getSiteUrl } from "@/lib/site-url";

// 本文
const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// 看板の文字（ロゴ・見出し）
const dela = Dela_Gothic_One({
  variable: "--font-dela",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// キャッチコピーなどの明朝
const zenOldMincho = Zen_Old_Mincho({
  variable: "--font-zen-old-mincho",
  weight: ["700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: {
    default: "アプリ横丁 - バイブコーディングアプリ投稿プラットフォーム",
    template: "%s | アプリ横丁",
  },
  description: "バイブコーディングで作ったアプリを投稿・閲覧・いいねできるプラットフォーム",
  metadataBase: new URL(siteUrl),
  verification: {
    google: 'dzes4adp1jZTDiQurHeZtbT0XYb52WMsFUFXJkGDS7g',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "アプリ横丁",
    description: "バイブコーディングで作ったアプリを投稿・閲覧・いいねできるプラットフォーム",
    url: siteUrl,
    siteName: "アプリ横丁",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "アプリ横丁",
    description: "バイブコーディングで作ったアプリを投稿・閲覧・いいねできるプラットフォーム",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${zenKaku.variable} ${dela.variable} ${zenOldMincho.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {/* トップページ（.yk-full）は画面いっぱいに描くので、幅と余白の枠を外す */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-8 pb-20 has-[>.yk-full]:max-w-none has-[>.yk-full]:p-0">
          {children}
        </main>
        <footer className="bg-[#120e22] text-kinari">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
              <span className="font-display text-lg tracking-wide">アプリ横丁</span>
              <span className="text-[13px] text-yoru-muted">本日も営業中。またのお越しを。</span>
            </div>
            <nav aria-label="サイトについて" className="flex flex-wrap gap-x-6 text-[13px]">
              <Link href="/terms" className="inline-flex items-center min-h-11 text-yoru-muted underline underline-offset-4 hover:text-kinari">利用規約</Link>
              <Link href="/privacy" className="inline-flex items-center min-h-11 text-yoru-muted underline underline-offset-4 hover:text-kinari">プライバシーポリシー</Link>
            </nav>
            <p className="text-xs text-yoru-muted">&copy; 2025 Thomas Suzuki</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
