import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://mochi.pesantren.id'
  const baseUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl.replace(/\/+$/, '') : `https://${rawUrl.replace(/\/+$/, '')}`

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/perpustakaan`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lembaga`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kitab`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  try {
    const supabase = createAdminClient()

    // 1. Ambil masalah terbit
    const { data: masalahList } = await supabase
      .from('masalah')
      .select('slug, diperbarui_pada')
      .limit(500)

    masalahList?.forEach((m) => {
      routes.push({
        url: `${baseUrl}/masalah/${m.slug}`,
        lastModified: new Date(m.diperbarui_pada || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    })

    // 2. Ambil forum terbit
    const { data: forumList } = await supabase
      .from('forum')
      .select('slug, diperbarui_pada')
      .eq('status', 'terbit')
      .limit(200)

    forumList?.forEach((f) => {
      routes.push({
        url: `${baseUrl}/forum/${f.slug}`,
        lastModified: new Date(f.diperbarui_pada || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    })

    // 3. Ambil lembaga terverifikasi
    const { data: lembagaList } = await supabase
      .from('lembaga')
      .select('slug, diperbarui_pada')
      .eq('status', 'terverifikasi')
      .limit(200)

    lembagaList?.forEach((l) => {
      routes.push({
        url: `${baseUrl}/lembaga/${l.slug}`,
        lastModified: new Date(l.diperbarui_pada || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    })
  } catch {
    // Return static routes jika database belum siap
  }

  return routes
}