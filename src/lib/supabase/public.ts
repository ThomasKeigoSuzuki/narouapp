import { createClient } from '@supabase/supabase-js'

// Cookieを使わない、公開データの読み取り用クライアント。
// ログイン状態に関係なく同じ結果になる場所（OGP画像など）で使い、結果をキャッシュできるようにする。
export function createPublicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
