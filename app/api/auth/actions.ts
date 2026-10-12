'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { loginSchema, daftarLembagaSchema } from '@/lib/validation/auth'
import { validasiBerkasUpload } from '@/lib/validation/upload'
import { checkRateLimit } from '@/lib/ratelimit'
import { randomUUID } from 'crypto'

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTarget = formData.get('redirect') as string

  // Rate limit: 5 percobaan per menit per email
  const rl = checkRateLimit(`login_${(email || '').toLowerCase().trim()}`, 5, 60_000)
  if (!rl.success) {
    return {
      error: `Terlalu banyak percobaan masuk. Mohon tunggu ${rl.reset} detik sebelum mencoba lagi.`,
    }
  }

  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || 'Input tidak valid',
    }
  }

  const supabase = await createClient()
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError || !authData.user) {
    return {
      error: 'Email atau kata sandi tidak cocok. Silakan periksa kembali.',
    }
  }

  // Cek peran pengguna
  const { data: profil } = await supabase
    .from('profil')
    .select('peran')
    .eq('id', authData.user.id)
    .maybeSingle()

  if (profil?.peran === 'admin') {
    redirect('/admin/verifikasi')
  }

  if (redirectTarget && redirectTarget.startsWith('/')) {
    redirect(redirectTarget)
  }

  redirect('/dasbor')
}

export async function daftarAction(prevState: unknown, formData: FormData) {
  const rawData = {
    nama_lembaga: formData.get('nama_lembaga') as string,
    jenis: formData.get('jenis') as string,
    kota: formData.get('kota') as string,
    provinsi: formData.get('provinsi') as string,
    alamat: formData.get('alamat') as string,
    nspp: formData.get('nspp') as string,
    situs_web: formData.get('situs_web') as string,
    deskripsi: formData.get('deskripsi') as string,
    nama_penanggung_jawab: formData.get('nama_penanggung_jawab') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    telepon: formData.get('telepon') as string,
  }

  // Rate limit pendaftaran: 3 per 5 menit per email
  const rlDaftar = checkRateLimit(`daftar_${(rawData.email || '').toLowerCase().trim()}`, 3, 300_000)
  if (!rlDaftar.success) {
    return {
      error: `Terlalu banyak permintaan pendaftaran. Mohon tunggu ${rlDaftar.reset} detik sebelum mencoba lagi.`,
    }
  }

  const parsed = daftarLembagaSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || 'Data pendaftaran tidak valid',
    }
  }

  const data = parsed.data
  const adminDb = createAdminClient()

  // 1. Cek keunikan NSPP bila jenis pesantren
  if (data.jenis === 'pesantren' && data.nspp) {
    const { data: existingNspp } = await adminDb
      .from('lembaga')
      .select('id')
      .eq('nspp', data.nspp.trim())
      .maybeSingle()

    if (existingNspp) {
      return {
        error: `Nomor Statistik Pesantren (NSPP) ${data.nspp} sudah terdaftar di MOCHI. Silakan hubungi admin jika ini lembaga Anda.`,
      }
    }
  }

  // 2. Buat akun Auth di Supabase
  const supabase = await createClient()
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        nama: data.nama_penanggung_jawab,
      },
    },
  })

  if (authError || !authData.user) {
    return {
      error: authError?.message || 'Gagal mendaftarkan akun. Silakan coba kembali.',
    }
  }

  const userId = authData.user.id

  // 3. Generate Slug Lembaga
  const baseSlug = data.nama_lembaga
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  const slug = `${baseSlug}-${randomSuffix}`

  // 4. Handle Upload Dokumen Bukti (wajib untuk non-pesantren / SK kepengurusan)
  let dokumenBuktiPath: string | null = null
  const file = formData.get('dokumen_bukti') as File | null

  if (data.jenis !== 'pesantren' && (!file || file.size === 0)) {
    return {
      error: 'Lembaga non-pesantren (LBM PCNU/PWNU) wajib mengunggah berkas SK Kepengurusan resmi (PDF/JPG/PNG maksimal 10 MB).',
    }
  }

  if (file && file.size > 0) {
    const validasi = validasiBerkasUpload(file, 'dokumen')
    if (!validasi.valid) {
      return { error: validasi.error || 'Dokumen bukti tidak valid' }
    }

    const fileName = validasi.namaAman || `${randomUUID()}.pdf`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await adminDb.storage
      .from('bukti-lembaga')
      .upload(fileName, buffer, {
        contentType: file.type || 'application/pdf',
        upsert: false,
      })

    if (!uploadError) {
      dokumenBuktiPath = fileName
    } else {
      console.error('Upload SK error:', uploadError)
    }
  }

  // Petakan ke enum basis data: 'pesantren' | 'lembaga_internal_pesantren' | 'organisasi' | 'lembaga_lain'
  const jenisDb =
    data.jenis === 'pesantren'
      ? 'pesantren'
      : data.jenis === 'lbm_pwnu' || data.jenis === 'lbm_pcnu' || data.jenis === 'asosiasi'
      ? 'organisasi'
      : 'lembaga_lain'

  // 5. Insert ke tabel lembaga
  const { data: lembagaBaru, error: lembagaError } = await adminDb
    .from('lembaga')
    .insert({
      nama: data.nama_lembaga,
      slug,
      jenis: jenisDb,
      kota: data.kota,
      provinsi: data.provinsi,
      alamat: data.alamat || null,
      nspp: data.nspp ? data.nspp.trim() : null,
      situs_web: data.situs_web || null,
      deskripsi: data.deskripsi || null,
      kontak_telepon: data.telepon,
      kontak_email: data.email,
      dokumen_bukti_url: dokumenBuktiPath,
      status: 'menunggu',
    })
    .select('id')
    .single()

  if (lembagaError || !lembagaBaru) {
    console.error('Error insert lembaga:', lembagaError)
    return { error: 'Gagal membuat profil lembaga di database' }
  }

  // 6. Hubungkan user sebagai pengelola lembaga
  await adminDb.from('pengelola').insert({
    lembaga_id: lembagaBaru.id,
    user_id: userId,
  })

  // 7. Catat ke tabel profil & log audit
  await adminDb.from('profil').upsert({
    id: userId,
    nama: data.nama_penanggung_jawab,
    peran: 'lembaga',
  })

  await adminDb.from('log_audit').insert({
    user_id: userId,
    aksi: 'pendaftaran_lembaga',
    entitas: 'lembaga',
    entitas_id: lembagaBaru.id,
    meta: {
      nama: data.nama_lembaga,
      jenis: data.jenis,
      nspp: data.nspp,
    },
  })

  return {
    success: true,
    message: 'Pendaftaran lembaga berhasil. Akun Anda sedang menunggu verifikasi oleh Admin Pusat MOCHI.',
  }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/masuk')
}

export async function lupaSandiAction(prevState: unknown, formData: FormData) {
  const rawEmail = formData.get('email') as string
  const email = (rawEmail || '').toLowerCase().trim()

  if (!email || !email.includes('@')) {
    return { error: 'Masukkan alamat email yang valid.' }
  }

  // Rate limit lupa sandi: 3 percobaan per menit per email
  const rl = checkRateLimit(`lupa_${email}`, 3, 60_000)
  if (!rl.success) {
    return {
      error: `Terlalu banyak permintaan reset kata sandi. Mohon tunggu ${rl.reset} detik sebelum mencoba lagi.`,
    }
  }

  const adminDb = createAdminClient()
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000'
  const siteUrl = /^https?:\/\//i.test(rawSiteUrl) ? rawSiteUrl.replace(/\/+$/, '') : `https://${rawSiteUrl.replace(/\/+$/, '')}`
  const redirectTo = `${siteUrl}/reset-sandi`

  // 1. Periksa apakah pengguna dengan email ini terdaftar di database Auth Supabase
  const { data: linkData, error: linkError } = await adminDb.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo,
    },
  })

  if (linkError || !linkData?.user) {
    // Jika tidak ditemukan di database
    if (linkError?.code === 'user_not_found' || linkError?.status === 404 || !linkData?.user) {
      return {
        error: `Maaf, alamat email "${email}" tidak terdaftar di sistem MOCHI sebagai pengelola lembaga maupun administrator. Silakan periksa kembali penulisan email Anda atau lakukan pendaftaran lembaga baru.`,
      }
    }
    return {
      error: linkError?.message || 'Gagal memproses permohonan reset sandi.',
    }
  }

  // 2. Coba kirim email resmi via Supabase Client
  const supabase = await createClient()
  let emailTerkirim = true
  let pesanTambahan = ''

  const { error: sendError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (sendError) {
    emailTerkirim = false
    if (
      sendError.status === 429 ||
      sendError.message.includes('rate_limit') ||
      sendError.message.includes('only request this after')
    ) {
      pesanTambahan = 'Catatan: Batas frekuensi pengiriman email bawaan Supabase sedang aktif.'
    }
  }

  // 3. Catat ke log audit
  try {
    await adminDb.from('log_audit').insert({
      user_id: linkData.user.id,
      aksi: 'minta_reset_sandi',
      entitas: 'profil',
      entitas_id: linkData.user.id,
      meta: { email },
    })
  } catch (e) {
    console.error('Error logging audit reset sandi:', e)
  }

  return {
    success: true,
    email,
    emailTerkirim,
    pesanTambahan,
  }
}