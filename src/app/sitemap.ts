import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const supabase = await createClient()

  const { data: apps } = await supabase
    .from('apps')
    .select('id, created_at')
    .order('created_at', { ascending: false })

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/terms`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const appPages: MetadataRoute.Sitemap = (apps ?? []).map((app) => ({
    url: `${siteUrl}/apps/${app.id}`,
    lastModified: app.created_at,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...appPages]
}
