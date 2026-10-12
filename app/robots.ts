import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mochi.pesantren.id'
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