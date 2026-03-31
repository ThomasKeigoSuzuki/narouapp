import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://narouapp.vercel.app'

export const metadata: Metadata = {
  title: {
    default: "なろうApp - バイブコーディングアプリ投稿プラットフォーム",
    template: "%s | なろうApp",
  },
  description: "バイブコーディングで作ったアプリを投稿・閲覧・いいねできるプラットフォーム",
  metadataBase: new URL(siteUrl),
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
      <body className="min-h-full flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
