'use server'

import { revalidatePath } from 'next/cache'
import { getSesiPengguna } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifikasiSchema, kitabSchema } from '@/lib/validation/auth'

export async function verifikasiAction(formData: FormData): Promise<void> {
  const sesi = await getSesiPengguna()
  if (!sesi || sesi.peran !== 'admin') {
    return
  }

  const raw = {
    lembaga_id: formData.get('lembaga_id') as string,
    status: formData.get('status') as string,
    alasan: (formData.get('alasan') as string) || '',
  }

  const parsed = verifikasiSchema.safeParse(raw)
  if (!parsed.success) {
    return
  }

  const { lembaga_id, status, alasan } = parsed.data
  const adminDb = createAdminClient()

  // 1. Ambil dokumen bukti untuk auto-delete dari storage demi hemat ruang & privasi
  const { data: dataLembaga } = await adminDb
    .from('lembaga')
    .select('dokumen_bukti_url')
    .eq('id', lembaga_id)
    .single()

  if (dataLembaga?.dokumen_bukti_url) {
    try {
      await adminDb.storage.from('bukti-lembaga').remove([dataLembaga.dokumen_bukti_url])
    } catch (err) {
      console.error('Gagal hapus berkas SK storage:', err)
    }
  }

  const updatePayload: {
    status: 'terverifikasi' | 'ditolak' | 'ditangguhkan'
    alasan_status: string | null
    diverifikasi_pada?: string | null
    dokumen_bukti_url: null
  } = {
    status,
    alasan_status: status === 'ditolak' ? (alasan || null) : null,
    dokumen_bukti_url: null, // Hapus referensi berkas setelah diproses
  }

  if (status === 'terverifikasi') {
    updatePayload.diverifikasi_pada = new Date().toISOString()
  }

  const { error: updateError } = await adminDb
    .from('lembaga')
    .update(updatePayload)
    .eq('id', lembaga_id)

  if (updateError) {
    console.error('Error verifikasi lembaga:', updateError)
    return
  }

  // Audit log
  await adminDb.from('log_audit').insert({
    user_id: sesi.id,
    aksi: `verifikasi_lembaga_${status}`,
    entitas: 'lembaga',
    entitas_id: lembaga_id,
    meta: { status, alasan },
  })

  revalidatePath('/admin/verifikasi')
  revalidatePath('/admin/lembaga')
  revalidatePath('/lembaga')
}

export async function tangguhkanLembagaAction(formData: FormData): Promise<void> {
  const sesi = await getSesiPengguna()
  if (!sesi || sesi.peran !== 'admin') return

  const lembaga_id = formData.get('lembaga_id') as string
  const alasan = (formData.get('alasan') as string) || 'Pelanggaran ketentuan publikasi atau ketidaksesuaian data'

  if (!lembaga_id) return
  const adminDb = createAdminClient()

  await adminDb
    .from('lembaga')
    .update({
      status: 'ditangguhkan',
      alasan_status: alasan,
    })
    .eq('id', lembaga_id)

  await adminDb.from('log_audit').insert({
    user_id: sesi.id,
    aksi: 'tangguhkan_lembaga',
    entitas: 'lembaga',
    entitas_id: lembaga_id,
    meta: { alasan },
  })

  revalidatePath('/admin/lembaga')
  revalidatePath('/admin/verifikasi')
  revalidatePath('/dasbor')
}

export async function reaktivasiLembagaAction(formData: FormData): Promise<void> {
  const sesi = await getSesiPengguna()
  if (!sesi || sesi.peran !== 'admin') return

  const lembaga_id = formData.get('lembaga_id') as string
  if (!lembaga_id) return
  const adminDb = createAdminClient()

  await adminDb
    .from('lembaga')
    .update({
      status: 'terverifikasi',
      alasan_status: null,
    })
    .eq('id', lembaga_id)

  await adminDb.from('log_audit').insert({
    user_id: sesi.id,
    aksi: 'reaktivasi_lembaga',
    entitas: 'lembaga',
    entitas_id: lembaga_id,
  })

  revalidatePath('/admin/lembaga')
  revalidatePath('/dasbor')
}

export async function editLembagaAdminAction(formData: FormData): Promise<void> {
  const sesi = await getSesiPengguna()
  if (!sesi || sesi.peran !== 'admin') return

  const lembaga_id = formData.get('lembaga_id') as string
  const nama = formData.get('nama') as string
  const kota = formData.get('kota') as string
  const provinsi = formData.get('provinsi') as string
  const nspp = (formData.get('nspp') as string) || null
  const kontak_email = (formData.get('kontak_email') as string) || null
  const kontak_telepon = (formData.get('kontak_telepon') as string) || null

  if (!lembaga_id || !nama) return
  const adminDb = createAdminClient()

  await adminDb
    .from('lembaga')
    .update({
      nama,
      kota,
      provinsi,
      nspp,
      kontak_email,
      kontak_telepon,
      diperbarui_pada: new Date().toISOString(),
    })
    .eq('id', lembaga_id)

  await adminDb.from('log_audit').insert({
    user_id: sesi.id,
    aksi: 'edit_lembaga_oleh_admin',
    entitas: 'lembaga',
    entitas_id: lembaga_id,
    meta: { nama, kota, provinsi, nspp },
  })

  revalidatePath('/admin/lembaga')
  revalidatePath('/lembaga')
}

export async function ubahProfilAdminAction(prevState: unknown, formData: FormData) {
  const sesi = await getSesiPengguna()
  if (!sesi || sesi.peran !== 'admin') {
    return { error: 'Akses ditolak.' }
  }

  const nama = formData.get('nama') as string
  if (!nama || nama.trim().length < 3) {
    return { error: 'Nama admin minimal 3 karakter.' }
  }

  const adminDb = createAdminClient()
  const { error } = await adminDb
    .from('profil')
    .update({ nama: nama.trim() })
    .eq('id', sesi.id)

  if (error) {
    return { error: 'Gagal memperbarui profil: ' + error.message }
  }

  revalidatePath('/admin')
  return { success: true, message: 'Nama profil admin berhasil diperbarui.' }
}

export async function ubahKataSandiAdminAction(prevState: unknown, formData: FormData) {
  const sesi = await getSesiPengguna()
  if (!sesi || sesi.peran !== 'admin') {
    return { error: 'Akses ditolak.' }
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
    return { error: 'Gagal memperbarui kata sandi: ' + error.message }
  }

  await adminDb.from('log_audit').insert({
    user_id: sesi.id,
    aksi: 'ubah_kata_sandi_admin',
    entitas: 'profil',
    entitas_id: sesi.id,
  })

  return { success: true, message: 'Kata sandi admin berhasil diubah.' }
}

export async function tambahKitabAction(formData: FormData): Promise<void> {
  const sesi = await getSesiPengguna()
  if (!sesi || sesi.peran !== 'admin') {
    return
  }

  const raw = {
    nama_latin: formData.get('nama_latin') as string,
    nama_arab: (formData.get('nama_arab') as string) || '',
    pengarang: (formData.get('pengarang') as string) || '',
    pengarang_arab: (formData.get('pengarang_arab') as string) || '',
    wafat_h: formData.get('wafat_h') ? Number(formData.get('wafat_h')) : null,
    bidang: formData.get('bidang') as string,
    alias: [],
  }

  const parsed = kitabSchema.safeParse(raw)
  if (!parsed.success) {
    return
  }

  const data = parsed.data
  const adminDb = createAdminClient()

  const { data: existing } = await adminDb
    .from('kitab')
    .select('id, nama_latin')
    .ilike('nama_latin', data.nama_latin.trim())
    .maybeSingle()

  if (existing) {
    return
  }

  const baseSlug = data.nama_latin
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`

  const { error: insertError } = await adminDb.from('kitab').insert({
    nama_latin: data.nama_latin,
    nama_arab: data.nama_arab || null,
    pengarang: data.pengarang || null,
    pengarang_arab: data.pengarang_arab || null,
    wafat_h: data.wafat_h || null,
    bidang: data.bidang,
    slug,
    alias: [],
    disetujui: true,
  })

  if (insertError) {
    return
  }

  await adminDb.from('log_audit').insert({
    user_id: sesi.id,
    aksi: 'tambah_master_kitab',
    entitas: 'kitab',
    meta: { nama_latin: data.nama_latin },
  })

  revalidatePath('/admin/kitab')
  revalidatePath('/kitab')
}

export async function hapusKitabAction(formData: FormData): Promise<void> {
  const sesi = await getSesiPengguna()
  if (!sesi || sesi.peran !== 'admin') {
    return
  }

  const id = formData.get('id') as string
  if (!id) return

  const adminDb = createAdminClient()
  await adminDb.from('kitab').delete().eq('id', id)

  revalidatePath('/admin/kitab')
  revalidatePath('/kitab')
}

export async function prosesLaporanAction(formData: FormData): Promise<void> {
  const sesi = await getSesiPengguna()
  if (!sesi || sesi.peran !== 'admin') {
    return
  }

  const id = formData.get('id') as string
  const status = formData.get('status') as 'diproses' | 'selesai' | 'ditolak'
  const catatan_admin = (formData.get('catatan_admin') as string) || null

  if (!id || !status) return

  const adminDb = createAdminClient()
  await adminDb
    .from('laporan')
    .update({
      status,
      catatan_admin,
    })
    .eq('id', id)

  await adminDb.from('log_audit').insert({
    user_id: sesi.id,
    aksi: `proses_laporan_${status}`,
    entitas: 'laporan',
    entitas_id: id,
    meta: { status, catatan_admin },
  })

  revalidatePath('/admin/laporan')
}