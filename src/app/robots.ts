import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/auth/', '/mypage', '/apps/new', '/apps/*/edit'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
