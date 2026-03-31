import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: {
    default: "なろうApp - バイブコーディングアプリ投稿プラットフォーム",
    template: "%s | なろうApp",
  },
  description: "バイブコーディングで作ったアプリを投稿・閲覧・いいねできるプラットフォーム",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "なろうApp",
    description: "バイブコーディングで作ったアプリを投稿・閲覧・いいねできるプラットフォーム",
    url: siteUrl,
    siteName: "なろうApp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "なろうApp",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-100 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-center gap-4 text-xs text-gray-400">
            <a href="/terms" className="hover:text-gray-600 transition-colors">利用規約</a>
            <span>|</span>
            <a href="/privacy" className="hover:text-gray-600 transition-colors">プライバシーポリシー</a>
            <span>|</span>
            <span>&copy; 2025 Thomas Suzuki</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
