export type App = {
  id: string
  created_at: string
  title: string
  description: string
  url: string
  thumbnail_url: string | null
  user_id: string
  likes_count: number
  ai_tools: string[]
  tags: string[]
  author?: Profile
}

export type Profile = {
  id: string
  username: string
  avatar_url: string | null
}

export type Like = {
  id: string
  app_id: string
  user_id: string
  created_at: string
}
