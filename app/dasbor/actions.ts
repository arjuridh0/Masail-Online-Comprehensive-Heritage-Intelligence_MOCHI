'use server'

import { revalidatePath } from 'next/cache'
import { getSesiPengguna } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { profilLembagaSchema } from '@/lib/validation/auth'

import { validasiBerkasUpload } from '@/lib/validation/upload'
import { randomUUID } from 'crypto'

export async function updateProfilLembagaAction(formData: FormData): Promise<void> {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    return
  }

  const raw = {
    nama_penanggung_jawab: (formData.get('nama_penanggung_jawab') as string) || undefined,
    deskripsi: formData.get('deskripsi') as string,
    alamat: formData.get('alamat') as string,
    kota: formData.get('kota') as string,
    provinsi: formData.get('provinsi') as string,
    kontak_telepon: formData.get('kontak_telepon') as string,
    kontak_email: formData.get('kontak_email') as string,
    situs_web: formData.get('situs_web') as string,
    logo_url: (formData.get('logo_url') as string) || '',
  }

  const parsed = profilLembagaSchema.safeParse(raw)
  if (!parsed.success) {
    return
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
    return
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