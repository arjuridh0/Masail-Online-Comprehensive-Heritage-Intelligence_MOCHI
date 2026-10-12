import { createAdminClient } from '@/lib/supabase/admin'
import { getEmbeddingProvider } from './index'

export interface ChunkItem {
  masalah_id: string
  pertanyaan_id: string
  isi: string
}

/**
 * Buat representasi teks potongan dari satu masalah masail
 */
export async function buatPotonganMasalah(masalahId: string): Promise<ChunkItem[]> {
  const adminDb = createAdminClient()

  const { data: masalah } = await adminDb
    .from('masalah')
    .select(`
      id,
      judul,
      deskripsi,
      topik,
      corak,
      forum:forum_id (
        nama,
        tuan_rumah,
        tanggal_mulai,
        lembaga:lembaga_id ( nama )
      ),
      pertanyaan (
        id,
        label,
        teks,
        jawaban,
        rujukan (
          kitab_teks,
          juz,
          halaman,
          teks_arab,
          terjemah
        )
      )
    `)
    .eq('id', masalahId)
    .single()

  if (!masalah) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const forum = masalah.forum as any
  const lembagaNama = forum?.lembaga?.nama || forum?.tuan_rumah || 'Pesantren'
  const forumNama = forum?.nama || forum?.tuan_rumah || 'Forum Bahtsul Masail'
  const tanggal = forum?.tanggal_mulai || ''

  const chunks: ChunkItem[] = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const daftarPertanyaan = (masalah.pertanyaan || []) as any[]

  for (const p of daftarPertanyaan) {
    const daftarRujukan = (p.rujukan || []) as Array<{
      kitab_teks: string
      juz?: string
      halaman?: string
      teks_arab?: string
      terjemah?: string
    }>

    const rujukanTeks = daftarRujukan
      .map((r) => {
        const refInfo = `${r.kitab_teks}${r.juz ? ` Juz ${r.juz}` : ''}${r.halaman ? ` Hal ${r.halaman}` : ''}`
        return `- ${refInfo}: ${r.teks_arab || ''} ${r.terjemah ? `(Terjemah: ${r.terjemah})` : ''}`
      })
      .join('\n')

    const isi = `[LEMBAGA]: ${lembagaNama}
[FORUM]: ${forumNama} (${tanggal})
[JUDUL]: ${masalah.judul}
[TOPIK]: ${(masalah.topik || []).join(', ')}
[CORAK]: ${masalah.corak || 'waqi_iyyah'}
[AS'ILAH/PERTANYAAN ${p.label?.toUpperCase()}]: ${p.teks}
[DIKTUM JAWABAN HUKUM]: ${p.jawaban}
${rujukanTeks ? `[RUJUKAN KITAB]:\n${rujukanTeks}` : ''}`

    chunks.push({
      masalah_id: masalah.id,
      pertanyaan_id: p.id,
      isi: isi.trim(),
    })
  }

  return chunks
}

/**
 * Generate embedding dan simpan ke tabel potongan Supabase
 */
export async function simpanPotonganMasalah(masalahId: string): Promise<number> {
  const chunks = await buatPotonganMasalah(masalahId)
  if (chunks.length === 0) return 0

  const provider = getEmbeddingProvider()
  const adminDb = createAdminClient()

  // Hapus potongan lama untuk masalah ini agar idempoten
  await adminDb.from('potongan').delete().eq('masalah_id', masalahId)

  let sukses = 0
  for (const c of chunks) {
    try {
      const embedding = await provider.embedText(c.isi)
      const { error } = await adminDb.from('potongan').insert({
        masalah_id: c.masalah_id,
        pertanyaan_id: c.pertanyaan_id,
        isi: c.isi,
        embedding: embedding as unknown as string, // pgvector format
      })
      if (!error) sukses++
    } catch (err) {
      console.error(`[simpanPotonganMasalah] Gagal embed potongan:`, err)
    }
  }

  return sukses
}