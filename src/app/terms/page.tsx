import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '利用規約',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        トップに戻る
      </Link>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-8 space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">利用規約</h1>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">第1条（サービス概要）</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            アプリ横丁（以下「本サービス」）は、Thomas Suzuki（以下「運営者」）が提供する、AIツールを活用して作成したアプリケーションを投稿・共有するためのプラットフォームです。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">第2条（禁止事項）</h2>
          <p className="text-sm text-gray-600 leading-relaxed">利用者は以下の行為を行ってはなりません。</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
            <li>他者を傷つける、または誹謗中傷にあたるコンテンツの投稿</li>
            <li>スパム行為や迷惑行為</li>
            <li>著作権・知的財産権を侵害するコンテンツの投稿</li>
            <li>虚偽の情報や誤解を招くコンテンツの投稿</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">第3条（免責事項）</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
            <li>運営者は、本サービスの中断・停止・終了により生じた損害について一切の責任を負いません。</li>
            <li>投稿されたコンテンツに関する責任は、投稿者本人に帰属します。</li>
            <li>運営者は投稿コンテンツの正確性・合法性を保証しません。</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">第4条（「ゆずります」の札による引き継ぎ）</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            アプリを投稿した利用者（以下「店主」）は、自分のアプリに「ゆずります」の札を出し、希望の値段と連絡先を表示できます。
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
            <li>札に入力した値段と連絡先は、アプリのページで、だれでも見られる形で表示されます。</li>
            <li>札を見た利用者と店主との間の連絡・交渉・契約・代金の支払い、アプリやデータ・権利の引き渡しは、当事者の間で直接行うものとし、運営者はこれに関与しません。運営者は、売買の仲介・あっせん、代金の預かり、取引の保証を行いません。</li>
            <li>店主は、表示した値段や内容が正確であること、および引き渡すアプリについて必要な権利を持っていることについて、自ら責任を負います。</li>
            <li>当事者の間で生じた紛争について、運営者は、運営者に故意または重大な過失がある場合を除き、責任を負いません。紛争は当事者の間で解決するものとします。</li>
            <li>運営者は、法令または本規約に反する、またはそのおそれがあると判断した札を、予告なく非表示にできるものとします。</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">第5条（規約の変更）</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            運営者は、必要に応じて本規約を予告なく変更する場合があります。変更後の規約は本ページに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">第6条（お問い合わせ）</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            本規約に関するお問い合わせは以下までご連絡ください。
          </p>
          <p className="text-sm text-gray-600">
            運営者: Thomas Suzuki<br />
            メール: <a href="mailto:narouapp.contact@gmail.com" className="text-indigo-600 hover:underline">narouapp.contact@gmail.com</a>
          </p>
        </section>

        <p className="text-xs text-gray-400">2026年11月27日 改定（第4条「「ゆずります」の札による引き継ぎ」を追加）</p>
      </div>
    </div>
  )
}
