'use client'

import { useState } from 'react'

type GachaResult = {
  rarity: number
  job: string
  birthplace: string
  era: string
  comment: string
}

const RARITY_CONFIG: Record<number, { label: string; bg: string; text: string; glow: string }> = {
  1: { label: 'N', bg: 'from-gray-200 to-gray-300', text: 'text-gray-700', glow: '' },
  2: { label: 'R', bg: 'from-green-300 to-emerald-400', text: 'text-white', glow: '' },
  3: { label: 'SR', bg: 'from-blue-400 to-indigo-500', text: 'text-white', glow: 'shadow-lg shadow-blue-300/50' },
  4: { label: 'SSR', bg: 'from-pink-400 to-rose-500', text: 'text-white', glow: 'shadow-xl shadow-pink-400/50' },
  5: { label: 'UR', bg: 'from-yellow-300 via-amber-400 to-orange-500', text: 'text-gray-900', glow: 'shadow-2xl shadow-yellow-400/60' },
}

export default function GachaPage() {
  const [result, setResult] = useState<GachaResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)

  const pull = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/gacha', { method: 'POST' })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      setCount(c => c + 1)
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const config = result ? RARITY_CONFIG[result.rarity] ?? RARITY_CONFIG[1] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* 背景の装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-pulse"
            style={{
              width: 8 + Math.random() * 40,
              height: 8 + Math.random() * 40,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 drop-shadow-lg relative z-10">
        人生ガチャ
      </h1>
      <p className="text-white/80 mb-8 text-sm relative z-10">
        AIが「もし別の人生に生まれていたら」を生成します
      </p>

      {/* ガチャボタン */}
      {!result && (
        <button
          onClick={pull}
          disabled={loading}
          className={`relative z-10 w-48 h-48 rounded-full border-4 border-white font-black text-xl text-white transition-all
            ${loading
              ? 'bg-gradient-to-br from-gray-400 to-gray-500 animate-spin cursor-not-allowed'
              : 'bg-gradient-to-br from-red-400 to-red-600 hover:scale-105 active:scale-95 shadow-lg shadow-red-500/40 hover:shadow-xl hover:shadow-red-500/50'
            }`}
        >
          {loading ? '' : 'ガチャを\n引く！'.split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
        </button>
      )}

      {/* 結果カード */}
      {result && config && (
        <div className="relative z-10 w-full max-w-sm animate-[cardIn_0.5s_ease-out]">
          {/* UR演出: キラキラ */}
          {result.rarity >= 5 && (
            <div className="absolute -inset-4 z-0">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                  style={{
                    top: `${10 + Math.random() * 80}%`,
                    left: `${10 + Math.random() * 80}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div className={`relative bg-gradient-to-br ${config.bg} ${config.glow} rounded-3xl p-6 ${config.text}`}>
            {/* レアリティ */}
            <div className="text-center mb-4">
              <div className="text-3xl tracking-widest mb-1">
                {'★'.repeat(result.rarity)}{'☆'.repeat(5 - result.rarity)}
              </div>
              <div className="text-sm font-bold opacity-80">{config.label}</div>
            </div>

            {/* 結果 */}
            <div className="space-y-3 bg-black/10 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">💼</span>
                <div>
                  <div className="text-xs font-bold opacity-70">職業</div>
                  <div className="font-bold text-lg">{result.job}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📍</span>
                <div>
                  <div className="text-xs font-bold opacity-70">出身地</div>
                  <div className="font-bold">{result.birthplace}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🕐</span>
                <div>
                  <div className="text-xs font-bold opacity-70">時代</div>
                  <div className="font-bold">{result.era}</div>
                </div>
              </div>
            </div>

            {/* コメント */}
            <p className="mt-4 text-center text-sm italic opacity-90 leading-relaxed">
              「{result.comment}」
            </p>
          </div>

          {/* もう一回ボタン */}
          <button
            onClick={() => { setResult(null); setTimeout(pull, 100); }}
            className="mt-6 w-full py-3 rounded-full bg-white/20 border-2 border-white/60 text-white font-bold hover:bg-white/30 transition-colors"
          >
            もう一回引く
          </button>
        </div>
      )}

      <div className="fixed bottom-4 right-4 text-white/40 text-xs z-10">
        引いた回数: {count}
      </div>

      <style jsx>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
