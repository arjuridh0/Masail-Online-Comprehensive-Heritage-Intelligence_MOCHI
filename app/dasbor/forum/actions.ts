"use server"

import { revalidatePath } from 'next/cache'
import { getSesiPengguna } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  wizardForumSchema,
  type WizardForumInput,
} from '@/lib/validation/wizard'
import { simpanPotonganMasalah } from '@/lib/ai/embedding'

export async function simpanDrafForumAction(rawInput: WizardForumInput) {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    return { success: false, error: 'Sesi pengelola lembaga tidak ditemukan. Silakan masuk kembali.' }
  }

  const parseResult = wizardForumSchema.safeParse(rawInput)
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues[0]?.message || 'Data draf tidak valid'
    return { success: false, error: errorMsg }
  }

  const data = parseResult.data
  const adminDb = createAdminClient()
  const lembagaId = sesi.lembaga.id

  try {
    let forumId = data.id

    // Siapkan slug forum jika ada nama
    const rawNama = data.nama || `Forum ${data.tuan_rumah} ${data.tanggal_mulai}`
    const baseSlug = rawNama
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
    const forumSlug = forumId ? undefined : `${baseSlug}-${Date.now().toString(36)}`

    if (forumId) {
      // Verifikasi kepemilikan forum
      const { data: existingForum } = await adminDb
        .from('forum')
        .select('id, lembaga_id')
        .eq('id', forumId)
        .single()

      if (!existingForum || existingForum.lembaga_id !== lembagaId) {
        return { success: false, error: 'Anda tidak berwenang mengubah forum ini.' }
      }

      await adminDb
        .from('forum')
        .update({
          nama: data.nama || null,
          tuan_rumah: data.tuan_rumah,
          tanggal_mulai: data.tanggal_mulai,
          tanggal_selesai: data.tanggal_selesai || null,
          tanggal_hijriah: data.tanggal_hijriah || null,
          lokasi: data.lokasi || null,
          moderator: data.moderator,
          pentashih: data.pentashih,
          perumus: data.perumus,
          status: 'draf',
          diperbarui_pada: new Date().toISOString(),
        })
        .eq('id', forumId)
    } else {
      const { data: newForum, error: forumError } = await adminDb
        .from('forum')
        .insert({
          lembaga_id: lembagaId,
          slug: forumSlug!,
          nama: data.nama || null,
          tuan_rumah: data.tuan_rumah,
          tanggal_mulai: data.tanggal_mulai,
          tanggal_selesai: data.tanggal_selesai || null,
          tanggal_hijriah: data.tanggal_hijriah || null,
          lokasi: data.lokasi || null,
          moderator: data.moderator,
          pentashih: data.pentashih,
          perumus: data.perumus,
          status: 'draf',
        })
        .select('id')
        .single()

      if (forumError || !newForum) {
        return { success: false, error: `Gagal membuat forum: ${forumError?.message}` }
      }
      forumId = newForum.id
    }

    // Simpan tiap masalah
    for (let i = 0; i < data.masalah.length; i++) {
      const m = data.masalah[i]
      const masalahSlug = m.judul
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString(36).slice(-4)}`

      let masalahId = m.id

      if (masalahId) {
        await adminDb
          .from('masalah')
          .update({
            judul: m.judul,
            deskripsi: m.deskripsi || m.judul,
            topik: m.topik,
            corak: m.corak,
            kata_kunci: m.kata_kunci,
            urutan: i + 1,
          })
          .eq('id', masalahId)
      } else {
        const tahunForum = new Date(data.tanggal_mulai).getFullYear() || new Date().getFullYear()
        const { data: kodeBaru } = await adminDb.rpc('buat_kode_masalah', { tahun: tahunForum })
        const generatedKode = kodeBaru || `MCH-${tahunForum}-${Date.now().toString().slice(-4)}`

        const { data: newMasalah } = await adminDb
          .from('masalah')
          .insert({
            forum_id: forumId,
            kode: m.kode || generatedKode,
            slug: masalahSlug,
            judul: m.judul,
            deskripsi: m.deskripsi || m.judul,
            topik: m.topik,
            corak: m.corak,
            kata_kunci: m.kata_kunci,
            urutan: i + 1,
          })
          .select('id')
          .single()

        masalahId = newMasalah?.id
      }

      if (!masalahId) continue

      // Simpan pertanyaan
      for (let j = 0; j < m.pertanyaan.length; j++) {
        const p = m.pertanyaan[j]
        let pertanyaanId = p.id

        if (pertanyaanId) {
          await adminDb
            .from('pertanyaan')
            .update({
              label: p.label,
              teks: p.teks,
              jawaban: p.jawaban,
              urutan: j + 1,
            })
            .eq('id', pertanyaanId)
        } else {
          const { data: newP } = await adminDb
            .from('pertanyaan')
            .insert({
              masalah_id: masalahId,
              label: p.label,
              teks: p.teks,
              jawaban: p.jawaban,
              urutan: j + 1,
            })
            .select('id')
            .single()

          pertanyaanId = newP?.id
        }

        if (!pertanyaanId) continue

        // Simpan rujukan
        for (let k = 0; k < p.rujukan.length; k++) {
          const r = p.rujukan[k]
          if (r.id) {
            await adminDb
              .from('rujukan')
              .update({
                kitab_id: r.kitab_id || null,
                kitab_teks: r.kitab_teks,
                juz: r.juz || null,
                halaman: r.halaman || null,
                teks_arab: r.teks_arab,
                terjemah: r.terjemah || null,
                urutan: k + 1,
              })
              .eq('id', r.id)
          } else {
            await adminDb.from('rujukan').insert({
              pertanyaan_id: pertanyaanId,
              kitab_id: r.kitab_id || null,
              kitab_teks: r.kitab_teks,
              juz: r.juz || null,
              halaman: r.halaman || null,
              teks_arab: r.teks_arab,
              terjemah: r.terjemah || null,
              urutan: k + 1,
            })
          }
        }
      }
    }

    revalidatePath('/dasbor')
    revalidatePath('/dasbor/forum')

    return {
      success: true,
      forumId,
      message: 'Draf forum berhasil disimpan.',
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Kesalahan server'
    return { success: false, error: `Gagal menyimpan draf: ${msg}` }
  }
}

export async function terbitkanForumAction(rawInput: WizardForumInput) {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    return { success: false, error: 'Sesi pengelola lembaga tidak ditemukan.' }
  }

  if (sesi.lembaga.status !== 'terverifikasi') {
    return {
      success: false,
      error: 'Lembaga Anda belum terverifikasi oleh Admin MOCHI. Hanya lembaga terverifikasi yang berhak menerbitkan forum.',
    }
  }

  // Simpan draf terlebih dahulu
  const drafResult = await simpanDrafForumAction(rawInput)
  if (!drafResult.success || !drafResult.forumId) {
    return { success: false, error: drafResult.error || 'Gagal menyimpan data forum sebelum penerbitan.' }
  }

  const forumId = drafResult.forumId
  const adminDb = createAdminClient()
  const tahunForum = new Date(rawInput.tanggal_mulai).getFullYear() || new Date().getFullYear()

  try {
    // Ambil semua masalah di bawah forum ini
    const { data: daftarMasalah } = await adminDb
      .from('masalah')
      .select('id, kode')
      .eq('forum_id', forumId)

    if (daftarMasalah) {
      for (const m of daftarMasalah) {
        let kode = m.kode
        if (!kode) {
          // Generate kode MCH-YYYY-NNNN via SQL function
          const { data: kodeBaru } = await adminDb.rpc('buat_kode_masalah', { tahun: tahunForum })
          kode = kodeBaru || `MCH-${tahunForum}-0001`
        }

        if (!m.kode) {
          await adminDb
            .from('masalah')
            .update({ kode })
            .eq('id', m.id)
        }
      }
    }

    // Update status forum menjadi terbit
    const { data: updatedForum } = await adminDb
      .from('forum')
      .update({
        status: 'terbit',
        diterbitkan_pada: new Date().toISOString(),
        diperbarui_pada: new Date().toISOString(),
      })
      .eq('id', forumId)
      .select('slug')
      .single()

    // Catat log audit
    await adminDb.from('log_audit').insert({
      aksi: 'terbitkan_forum',
      entitas: 'forum',
      entitas_id: forumId,
      pengguna_id: sesi.id,
      meta: {
        tuan_rumah: rawInput.tuan_rumah,
        jumlah_masalah: rawInput.masalah.length,
      },
    })

    revalidatePath('/')
    revalidatePath('/perpustakaan')
    revalidatePath('/dasbor')
    revalidatePath('/dasbor/forum')

    // Trigger pipeline embedding latar belakang tanpa memblokir respon publikasi
    if (daftarMasalah && daftarMasalah.length > 0) {
      for (const m of daftarMasalah) {
        simpanPotonganMasalah(m.id).catch((err) =>
          console.error(`[Background Embedding] Gagal simpan potongan ${m.id}:`, err)
        )
      }
    }

    return {
      success: true,
      forumId,
      slug: updatedForum?.slug,
      message: 'Forum Bahtsul Masail berhasil diterbitkan secara resmi!',
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Kesalahan server'
    return { success: false, error: `Gagal menerbitkan forum: ${msg}` }
  }
}

export async function tarikForumAction(forumId: string) {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    return { success: false, error: 'Sesi tidak valid.' }
  }

  const adminDb = createAdminClient()

  // Verifikasi kepemilikan
  const { data: forum } = await adminDb
    .from('forum')
    .select('id, lembaga_id')
    .eq('id', forumId)
    .single()

  if (!forum || forum.lembaga_id !== sesi.lembaga.id) {
    return { success: false, error: 'Anda tidak memiliki hak akses ke forum ini.' }
  }

  // Tarik forum dan masalahnya ke status 'draf'
  await adminDb
    .from('forum')
    .update({ status: 'draf', diperbarui_pada: new Date().toISOString() })
    .eq('id', forumId)

  await adminDb
    .from('masalah')
    .update({ status: 'draf' })
    .eq('forum_id', forumId)

  await adminDb.from('log_audit').insert({
    aksi: 'tarik_forum',
    entitas: 'forum',
    entitas_id: forumId,
    pengguna_id: sesi.id,
  })

  revalidatePath('/dasbor')
  revalidatePath('/dasbor/forum')
  revalidatePath('/perpustakaan')

  return { success: true, message: 'Forum berhasil ditarik kembali ke draf privat.' }
}

export async function hapusForumAction(forumId: string) {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    return { success: false, error: 'Sesi tidak valid.' }
  }

  const adminDb = createAdminClient()

  // Verifikasi kepemilikan
  const { data: forum } = await adminDb
    .from('forum')
    .select('id, lembaga_id')
    .eq('id', forumId)
    .single()

  if (!forum || forum.lembaga_id !== sesi.lembaga.id) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus forum ini.' }
  }

  const { error } = await adminDb
    .from('forum')
    .delete()
    .eq('id', forumId)

  if (error) {
    return { success: false, error: `Gagal menghapus forum: ${error.message}` }
  }

  await adminDb.from('log_audit').insert({
    aksi: 'hapus_forum',
    entitas: 'forum',
    entitas_id: forumId,
    pengguna_id: sesi.id,
  })

  revalidatePath('/dasbor')
  revalidatePath('/dasbor/forum')

  return { success: true, message: 'Forum dan seluruh hasil keputusan berhasil dihapus.' }
}