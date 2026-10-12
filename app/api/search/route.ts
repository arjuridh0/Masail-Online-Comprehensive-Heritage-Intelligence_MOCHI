import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cariMasalahPublik } from '@/lib/search/hybrid'
import { cariKonteksSemantik } from '@/lib/ai/search'
import { checkRateLimit } from '@/lib/ratelimit'
import type { TopikEnum } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // Rate limit
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'

  const rateLimit = checkRateLimit(`search_${clientIp}`, 30, 60_000)
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan pencarian.' },
      { status: 429 }
    )
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const topik = (searchParams.get('topik') || 'semua') as TopikEnum | 'semua'
  const lembaga = searchParams.get('lembaga') || ''
  const tahun = searchParams.get('tahun') || ''
  const corak = searchParams.get('corak') || ''
  const urutan = (searchParams.get('urutan') || 'terbaru') as 'terbaru' | 'terlama' | 'populer'
  const isSemantic = searchParams.get('semantic') === 'true'
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  // Jika diminta mode semantik dan ada kueri teks
  if (isSemantic && q.trim()) {
    try {
      const semanticRes = await cariKonteksSemantik(q.trim(), 0.50, limit)
      return NextResponse.json({
        mode: 'semantic',
        total: semanticRes.sources.length,
        items: semanticRes.sources,
        topScore: semanticRes.topScore,
      })
    } catch (err: unknown) {
      console.error('[Semantic Search API Error]:', err)
      // Fallback ke hybrid search jika semantik gagal
    }
  }

  // Standar: Hybrid search
  const supabase = await createClient()
  const result = await cariMasalahPublik(supabase, {
    query: q,
    topik,
    lembaga,
    tahun,
    corak,
    urutan,
    page,
    limit,
  })

  return NextResponse.json({
    mode: 'hybrid',
    ...result,
  })
}
