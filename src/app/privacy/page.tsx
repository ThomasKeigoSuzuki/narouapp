import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        トップに戻る
      </Link>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-8 space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">プライバシーポリシー</h1>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">1. 収集する情報</h2>
          <p className="text-sm text-gray-600 leading-relaxed">本サービスでは、以下の情報を収集します。</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
            <li>Googleアカウント情報（名前・メールアドレス）</li>
            <li>投稿コンテンツ（アプリ情報、コメントなど）</li>
            <li>利用履歴（いいね、フォローなどの操作履歴）</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">2. 利用目的</h2>
          <p className="text-sm text-gray-600 leading-relaxed">収集した情報は、以下の目的で利用します。</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
            <li>本サービスの提供・運営</li>
            <li>サービスの改善・新機能の開発</li>
            <li>不正利用の防止</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">3. 第三者への提供</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            法令に基づく場合を除き、利用者の個人情報を第三者に提供することはありません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">4. データの保管</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            本サービスではデータの保管にSupabaseを使用しています。データは適切なセキュリティ対策のもとで管理されています。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">5. お問い合わせ</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            プライバシーポリシーに関するお問い合わせは以下までご連絡ください。
          </p>
          <p className="text-sm text-gray-600">
            運営者: Thomas Suzuki<br />
            メール: <a href="mailto:narouapp.contact@gmail.com" className="text-indigo-600 hover:underline">narouapp.contact@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  )
}
