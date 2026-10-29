'use server'

import { revalidatePath } from 'next/cache'
import { getSesiPengguna } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { profilLembagaSchema } from '@/lib/validation/auth'

import { validasiBerkasUpload } from '@/lib/validation/upload'
import { randomUUID } from 'crypto'

export async function updateProfilLembagaAction(
  prevState: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string; message?: string }> {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    return { error: 'Sesi tidak ditemukan. Silakan masuk kembali.' }
  }

  let rawSitus = (formData.get('situs_web') as string)?.trim() || ''
  if (rawSitus && !/^https?:\/\//i.test(rawSitus)) {
    rawSitus = `https://${rawSitus}`
  }

  const raw = {
    nama_penanggung_jawab: (formData.get('nama_penanggung_jawab') as string)?.trim() || undefined,
    deskripsi: (formData.get('deskripsi') as string)?.trim() || '',
    alamat: (formData.get('alamat') as string)?.trim() || '',
    kota: (formData.get('kota') as string)?.trim() || '',
    provinsi: (formData.get('provinsi') as string)?.trim() || '',
    kontak_telepon: (formData.get('kontak_telepon') as string)?.trim() || '',
    kontak_email: (formData.get('kontak_email') as string)?.trim() || '',
    situs_web: rawSitus,
    logo_url: (formData.get('logo_url') as string)?.trim() || '',
  }

  const parsed = profilLembagaSchema.safeParse(raw)
  if (!parsed.success) {
    const pesan = parsed.error.issues[0]?.message || 'Data profil tidak valid. Periksa kembali isian Anda.'
    return { error: pesan }
  }

  const data = parsed.data
  const adminDb = createAdminClient()

  // 1. Tangani Unggah Berkas Logo Langsung (jika ada file diunggah)
  let finalLogoUrl = data.logo_url || null
  const logoFile = formData.get('logo_file') as File | null

  if (logoFile && logoFile.size > 0) {
    const validasi = validasiBerkasUpload(logoFile, 'gambar')
    if (validasi.valid) {
      const fileName = validasi.namaAman || `${randomUUID()}.png`
      const buffer = Buffer.from(await logoFile.arrayBuffer())

      const { error: uploadError } = await adminDb.storage
        .from('logo')
        .upload(fileName, buffer, {
          contentType: logoFile.type || 'image/png',
          upsert: true,
        })

      if (!uploadError) {
        const { data: pubUrl } = adminDb.storage.from('logo').getPublicUrl(fileName)
        if (pubUrl?.publicUrl) {
          finalLogoUrl = pubUrl.publicUrl
        }
      }
    }
  }

  // 2. Update profil lembaga
  const { error: updateError } = await adminDb
    .from('lembaga')
    .update({
      deskripsi: data.deskripsi || null,
      alamat: data.alamat || null,
      kota: data.kota,
      provinsi: data.provinsi,
      kontak_telepon: data.kontak_telepon || null,
      kontak_email: data.kontak_email || null,
      situs_web: data.situs_web || null,
      logo_url: finalLogoUrl,
      diperbarui_pada: new Date().toISOString(),
    })
    .eq('id', sesi.lembaga.id)

  if (updateError) {
    console.error('Error update profil lembaga:', updateError)
    return { error: 'Gagal menyimpan profil. Coba lagi dalam beberapa saat.' }
  }

  // 3. Update nama penanggung jawab di tabel profil
  if (data.nama_penanggung_jawab && data.nama_penanggung_jawab.trim().length >= 3) {
    await adminDb
      .from('profil')
      .update({ nama: data.nama_penanggung_jawab.trim() })
      .eq('id', sesi.id)
  }

  // Audit log
  await adminDb.from('log_audit').insert({
    user_id: sesi.id,
    aksi: 'update_profil_lembaga',
    entitas: 'lembaga',
    entitas_id: sesi.lembaga.id,
    meta: { kota: data.kota, provinsi: data.provinsi },
  })

  revalidatePath('/dasbor/profil')
  revalidatePath('/dasbor')
  revalidatePath(`/lembaga/${sesi.lembaga.slug}`)
  revalidatePath('/lembaga')

  return { success: true, message: 'Profil lembaga berhasil diperbarui.' }
}

export async function ubahKataSandiLembagaAction(prevState: unknown, formData: FormData) {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    return { error: 'Sesi pengelola lembaga tidak ditemukan.' }
  }

  const sandi_baru = formData.get('sandi_baru') as string
  const konfirmasi_sandi = formData.get('konfirmasi_sandi') as string

  if (!sandi_baru || sandi_baru.length < 10) {
    return { error: 'Kata sandi baru minimal 10 karakter.' }
  }

  if (sandi_baru !== konfirmasi_sandi) {
    return { error: 'Konfirmasi kata sandi tidak cocok.' }
  }

  const adminDb = createAdminClient()
  const { error } = await adminDb.auth.admin.updateUserById(sesi.id, {
    password: sandi_baru,
  })

  if (error) {
    return { error: 'Gagal mengubah kata sandi: ' + error.message }
  }

  await adminDb.from('log_audit').insert({
    user_id: sesi.id,
    aksi: 'ubah_kata_sandi_lembaga',
    entitas: 'profil',
    entitas_id: sesi.id,
  })

  return { success: true, message: 'Kata sandi akun pengelola berhasil diubah.' }
}

export async function uploadFotoDokumentasiAction(formData: FormData): Promise<{
  success?: boolean
  url?: string
  error?: string
}> {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    return { error: 'Sesi pengelola lembaga tidak ditemukan.' }
  }

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) {
    return { error: 'Berkas foto tidak ditemukan.' }
  }

  const validasi = validasiBerkasUpload(file, 'dokumentasi')
  if (!validasi.valid) {
    return { error: validasi.error || 'Berkas foto tidak valid.' }
  }

  const adminDb = createAdminClient()
  const fileName = validasi.namaAman || `dok_${Date.now()}_${randomUUID().slice(0, 8)}.jpg`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await adminDb.storage
    .from('dokumentasi')
    .upload(fileName, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: true,
    })

  if (uploadError) {
    console.error('Error upload dokumentasi:', uploadError)
    return { error: 'Gagal mengunggah foto ke penyimpanan.' }
  }

  const { data: pubUrl } = adminDb.storage.from('dokumentasi').getPublicUrl(fileName)
  return { success: true, url: pubUrl?.publicUrl }
}

export async function tanggapiTashihLembagaAction(
  formData: FormData
): Promise<{ success?: boolean; error?: string; message?: string }> {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    return { error: 'Sesi pengelola lembaga tidak ditemukan.' }
  }

  const laporanId = formData.get('laporan_id') as string
  const status = formData.get('status') as 'selesai' | 'ditolak'
  const catatanLembaga = ((formData.get('catatan_lembaga') as string) || '').trim()

  if (!laporanId || !status) {
    return { error: 'Data tanggapan tidak lengkap.' }
  }

  const adminDb = createAdminClient()

  // 1. Verifikasi kepemilikan masalah/forum (Keamanan IDOR)
  const { data: lap } = await adminDb
    .from('laporan')
    .select(`
      id,
      masalah:masalah_id (
        id,
        slug,
        forum:forum_id (
          lembaga_id
        )
      )
    `)
    .eq('id', laporanId)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const m = lap?.masalah as any
  if (!lap || m?.forum?.lembaga_id !== sesi.lembaga.id) {
    return { error: 'Akses ditolak. Anda tidak memiliki otoritas atas keputusan ini.' }
  }

  const pesanRespon = catatanLembaga
    ? `[Dewan Pentashih Lembaga]: ${catatanLembaga}`
    : status === 'selesai'
    ? '[Dewan Pentashih Lembaga]: Usulan telah ditinjau dan diselesaikan.'
    : '[Dewan Pentashih Lembaga]: Usulan telah ditelaah namun belum dapat diterapkan pada naskah saat ini.'

  const { error: updateErr } = await adminDb
    .from('laporan')
    .update({
      status,
      catatan_admin: pesanRespon,
    })
    .eq('id', laporanId)

  if (updateErr) {
    return { error: 'Gagal memperbarui status masukan: ' + updateErr.message }
  }

  await adminDb.from('log_audit').insert({
    user_id: sesi.id,
    aksi: `tanggapi_tashih_${status}`,
    entitas: 'laporan',
    entitas_id: laporanId,
    meta: { status, catatan: catatanLembaga },
  })

  revalidatePath('/dasbor')
  if (m?.slug) {
    revalidatePath(`/masalah/${m.slug}`)
  }

  return {
    success: true,
    message: status === 'selesai'
      ? 'Catatan usulan berhasil ditandai selesai.'
      : 'Catatan usulan berhasil diarsipkan.',
  }
}

export async function terapkanKoreksiTashihAction(
  formData: FormData
): Promise<{ success?: boolean; error?: string; message?: string }> {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    return { error: 'Sesi pengelola lembaga tidak ditemukan.' }
  }

  const laporanId = formData.get('laporan_id') as string
  const masalahId = formData.get('masalah_id') as string
  const rujukanId = (formData.get('rujukan_id') as string) || null
  const targetKolom = (formData.get('target_kolom') as string) || 'teks_arab'
  const teksBaru = ((formData.get('teks_baru') as string) || '').trim()
  const ringkasanRevisi = ((formData.get('ringkasan_revisi') as string) || '').trim()

  if (!laporanId || !masalahId || !teksBaru) {
    return { error: 'Data koreksi tidak lengkap. Teks perbaikan wajib diisi.' }
  }

  const adminDb = createAdminClient()

  // 1. Verifikasi kepemilikan masalah (Keamanan IDOR)
  const { data: masalahData } = await adminDb
    .from('masalah')
    .select(`
      id,
      slug,
      judul,
      forum:forum_id (
        id,
        lembaga_id
      )
    `)
    .eq('id', masalahId)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mf = masalahData as any
  if (!masalahData || mf?.forum?.lembaga_id !== sesi.lembaga.id) {
    return { error: 'Akses ditolak. Anda tidak berwenang mengubah keputusan ini.' }
  }

  // 2. Terapkan pembaruan teks
  let snapshotSebelum: unknown = null

  if (rujukanId && (targetKolom === 'teks_arab' || targetKolom === 'terjemah')) {
    const { data: rujukanLama } = await adminDb
      .from('rujukan')
      .select('id, teks_arab, terjemah, kitab_teks')
      .eq('id', rujukanId)
      .single()

    snapshotSebelum = rujukanLama ? (rujukanLama as Record<string, unknown>)[targetKolom] : null

    const updateObj: Record<string, string> = {}
    updateObj[targetKolom] = teksBaru

    const { error: rujukanErr } = await adminDb
      .from('rujukan')
      .update(updateObj)
      .eq('id', rujukanId)

    if (rujukanErr) {
      return { error: 'Gagal memperbarui rujukan: ' + rujukanErr.message }
    }
  } else if (targetKolom === 'deskripsi') {
    snapshotSebelum = masalahData.judul
    await adminDb.from('masalah').update({ deskripsi: teksBaru }).eq('id', masalahId)
  }

  // 3. Catat ke tabel riwayat revisi (Audit Trail & Transparansi Publik)
  const ringkasanFinal =
    ringkasanRevisi ||
    `Penyempurnaan ${targetKolom.replace('_', ' ')} rujukan turats berdasarkan telaah tashih komunitas`

  await adminDb.from('revisi').insert({
    entitas: 'masalah',
    entitas_id: masalahId,
    snapshot: {
      rujukan_id: rujukanId,
      target_kolom: targetKolom,
      sebelum: snapshotSebelum,
      sesudah: teksBaru,
    },
    ringkasan: ringkasanFinal,
    oleh: sesi.id,
  })

  // 4. Update status laporan menjadi selesai
  await adminDb
    .from('laporan')
    .update({
      status: 'selesai',
      catatan_admin: `[Telah Ditashih] Teks disempurnakan oleh Dewan Pentashih pada ${new Date().toLocaleDateString(
        'id-ID'
      )}.`,
    })
    .eq('id', laporanId)

  // 5. Catat audit log
  await adminDb.from('log_audit').insert({
    user_id: sesi.id,
    aksi: 'terapkan_tashih_komunitas',
    entitas: 'masalah',
    entitas_id: masalahId,
    meta: {
      laporan_id: laporanId,
      rujukan_id: rujukanId,
      kolom: targetKolom,
    },
  })

  revalidatePath('/dasbor')
  revalidatePath(`/masalah/${masalahData.slug}`)
  revalidatePath('/perpustakaan')

  return {
    success: true,
    message: 'Tashih berhasil diterapkan! Teks telah diperbarui dan tercatat di riwayat revisi publik.',
  }
}
