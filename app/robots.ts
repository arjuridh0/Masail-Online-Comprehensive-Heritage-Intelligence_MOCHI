import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://mochi.pesantren.id'
  const baseUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl.replace(/\/+$/, '') : `https://${rawUrl.replace(/\/+$/, '')}`
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  if (isDemo) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dasbor/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}