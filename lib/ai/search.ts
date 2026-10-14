import { createAdminClient } from '@/lib/supabase/admin'
import { getEmbeddingProvider } from './index'
import { deteksiSaranTypo } from '@/lib/search/typo'
import type { ChatSource } from './types'

export interface SemanticSearchResult {
  sources: ChatSource[]
  topScore: number
  contextText: string
}

export async function cariKonteksSemantik(
  query: string,
  threshold = 0.60,
  maxResults = 5
): Promise<SemanticSearchResult> {
  const provider = getEmbeddingProvider()
  const adminDb = createAdminClient()

  // 0. Deteksi typo leksikon fiqih untuk meningkatkan akurasi retrieval
  const saranTypo = deteksiSaranTypo(query)
  const kueriUtama = saranTypo || query

  // 1. Dapatkan embedding dari kueri pengguna dengan proteksi rate limit fallback
  interface SemanticMatchRow {
    masalah_id: string
    isi: string
    kemiripan: number
  }

  let matches: SemanticMatchRow[] = []
  try {
    const queryEmbedding = await provider.embedText(kueriUtama)
    const { data, error } = await adminDb.rpc('cari_masalah_semantik', {
      query_embedding: queryEmbedding as unknown as string,
      match_threshold: threshold,
      match_count: maxResults,
    })
    if (!error && data) {
      matches = data as SemanticMatchRow[]
    }
  } catch (err: unknown) {
    console.warn('[Semantic Search]: Embedding API limit/error, beralih ke fallback teks:', err)
  }

  // Fallback ke pencarian teks kaya jika embedding gagal atau hasil semantik kosong
  if (matches.length === 0) {
    const kataKunci = [
      ...query.split(/\s+/),
      ...(saranTypo ? saranTypo.split(/\s+/) : []),
    ]
      .map((w) => w.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '').trim())
      .filter((w) => w.length >= 3)

    const orConditions = kataKunci
      .slice(0, 4)
      .flatMap((w) => [`judul.ilike.%${w}%`, `deskripsi.ilike.%${w}%`])
      .join(',')

    const { data: textMatches } = orConditions
      ? await adminDb
          .from('v_masalah_publik')
          .select('id, kode, slug, judul, forum_nama, lembaga_nama, tahun, deskripsi')
          .or(orConditions)
          .limit(maxResults)
      : { data: null }

    if (textMatches && textMatches.length > 0) {
      const matchIds = textMatches.map((m) => m.id)

      // Ambil pertanyaan & rujukan ibarat lengkap agar jawaban tetap kaya dan bersanad
      const { data: detailKeputusan } = await adminDb
        .from('masalah')
        .select(`
          id,
          pertanyaan (
            label,
            teks,
            jawaban,
            rujukan (
              kitab_teks,
              teks_arab,
              terjemah,
              juz,
              halaman
            )
          )
        `)
        .in('id', matchIds)

      const detailMap = new Map(detailKeputusan?.map((d) => [d.id, d.pertanyaan]) || [])

      let fIdx = 1
      const fallbackSources: ChatSource[] = textMatches.map((m) => ({
        nomor: fIdx++,
        masalahId: m.id,
        kode: m.kode || 'MCH',
        slug: m.slug || '',
        judul: m.judul || 'Keputusan Bahtsul Masail',
        forumNama: m.forum_nama || 'Forum Bahtsul Masail',
        lembagaNama: m.lembaga_nama || 'Pesantren Mitra',
        ringkasan: (m.deskripsi || m.judul).slice(0, 280) + '...',
        skor: 0.72,
      }))

      interface PertanyaanFallbackRow {
        label?: string
        teks: string
        jawaban: string
        rujukan?: Array<{
          kitab_teks?: string
          teks_arab?: string
          terjemah?: string
          juz?: string
          halaman?: string
        }>
      }

      const contextParts: string[] = []
      fallbackSources.forEach((src) => {
        const rawPertanyaan = (detailMap.get(src.masalahId) as PertanyaanFallbackRow[] | undefined) || []
        const kontenAsilah = rawPertanyaan
          .map((p) => {
            const ibaratList = (p.rujukan || [])
              .map(
                (r) =>
                  `Kitab: ${r.kitab_teks || 'Turats'}${r.juz ? `, Juz ${r.juz}` : ''}${r.halaman ? `, Hal ${r.halaman}` : ''}\nArab: ${r.teks_arab || '-'}\nTerjemah: ${r.terjemah || '-'}`
              )
              .join('\n\n')

            return `PERTANYAAN [${p.label || 'a'}]: ${p.teks}\nJAWABAN: ${p.jawaban}\n\nIBARAT KITAB:\n${ibaratList}`
          })
          .join('\n---\n')

        contextParts.push(`--- SUMBER [S${src.nomor}] ---
LEMBAGA: ${src.lembagaNama}
FORUM: ${src.forumNama}
KODE: ${src.kode} - ${src.judul}
SKOR RELEVANSI: 0.72
ISI KEPUTUSAN & IBARAT:
${kontenAsilah || src.ringkasan}`)
      })

      return {
        sources: fallbackSources,
        topScore: 0.72,
        contextText: contextParts.join('\n\n'),
      }
    }

    return {
      sources: [],
      topScore: 0,
      contextText: '',
    }
  }

  // 3. Ambil detail metadata lengkap untuk tiap masalah
  const masalahIds = Array.from(new Set(matches.map((m: { masalah_id: string }) => m.masalah_id)))

  const { data: daftarMasalah } = await adminDb
    .from('masalah')
    .select(`
      id,
      kode,
      slug,
      judul,
      forum:forum_id (
        nama,
        tuan_rumah,
        tanggal_mulai,
        lembaga:lembaga_id ( nama )
      )
    `)
    .in('id', masalahIds)

  const masalahMap = new Map<string, {
    kode: string
    slug: string
    judul: string
    forumNama: string
    lembagaNama: string
  }>()

  interface ForumJoinRow {
    nama?: string | null
    tuan_rumah?: string | null
    lembaga?: { nama?: string | null } | null
  }

  if (daftarMasalah) {
    for (const dm of daftarMasalah) {
      const f = dm.forum as unknown as ForumJoinRow | null
      masalahMap.set(dm.id, {
        kode: dm.kode,
        slug: dm.slug,
        judul: dm.judul,
        forumNama: f?.nama || f?.tuan_rumah || 'Forum Bahtsul Masail',
        lembagaNama: f?.lembaga?.nama || f?.tuan_rumah || 'Pesantren',
      })
    }
  }

  // 4. Susun daftar ChatSource dan teks konteks untuk prompt LLM
  const sources: ChatSource[] = []
  const contextParts: string[] = []

  let idx = 1
  for (const m of matches) {
    const meta = masalahMap.get(m.masalah_id)
    const sourceNumber = idx++

    const chatSource: ChatSource = {
      nomor: sourceNumber,
      masalahId: m.masalah_id,
      kode: meta?.kode || 'MCH',
      judul: meta?.judul || 'Masalah Fiqih',
      slug: meta?.slug || '',
      lembagaNama: meta?.lembagaNama || 'Pesantren',
      forumNama: meta?.forumNama || 'Forum',
      ringkasan: m.isi.slice(0, 280) + '...',
      skor: Math.round(m.kemiripan * 100) / 100,
    }

    sources.push(chatSource)

    contextParts.push(`--- SUMBER [S${sourceNumber}] ---
LEMBAGA: ${chatSource.lembagaNama}
FORUM: ${chatSource.forumNama}
KODE: ${chatSource.kode} - ${chatSource.judul}
SKOR RELEVANSI: ${chatSource.skor}
ISI KEPUTUSAN & IBARAT:
${m.isi}`)
  }

  return {
    sources,
    topScore: matches[0]?.kemiripan || 0,
    contextText: contextParts.join('\n\n'),
  }
}