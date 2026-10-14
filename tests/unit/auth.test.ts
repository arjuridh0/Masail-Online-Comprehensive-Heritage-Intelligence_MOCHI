import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  daftarLembagaSchema,
  verifikasiSchema,
  profilLembagaSchema,
} from '@/lib/validation/auth'

describe('Validasi Auth & Registrasi Lembaga MOCHI', () => {
  it('menolak kata sandi login kurang dari 10 karakter', () => {
    const res = loginSchema.safeParse({
      email: 'santri@pesantren.id',
      password: 'pendek',
    })
    expect(res.success).toBe(false)
  })

  it('menerima login dengan format email valid dan sandi >= 10 karakter', () => {
    const res = loginSchema.safeParse({
      email: 'admin@mochi.pesantren.id',
      password: 'MochiAdmin2026!',
    })
    expect(res.success).toBe(true)
  })

  it('mewajibkan NSPP 12 digit jika jenis lembaga adalah pesantren', () => {
    // Tanpa NSPP -> gagal
    const tanpaNspp = daftarLembagaSchema.safeParse({
      nama_lembaga: 'Pesantren Al-Falah',
      jenis: 'pesantren',
      kota: 'Kediri',
      provinsi: 'Jawa Timur',
      nama_penanggung_jawab: 'Gus Ahmad',
      email: 'alfalah@pesantren.id',
      password: 'SandiAman12345!',
      telepon: '081234567890',
    })
    expect(tanpaNspp.success).toBe(false)

    // NSPP kurang dari 12 digit -> gagal
    const nsppPendek = daftarLembagaSchema.safeParse({
      nama_lembaga: 'Pesantren Al-Falah',
      jenis: 'pesantren',
      kota: 'Kediri',
      provinsi: 'Jawa Timur',
      nspp: '12345',
      nama_penanggung_jawab: 'Gus Ahmad',
      email: 'alfalah@pesantren.id',
      password: 'SandiAman12345!',
      telepon: '081234567890',
    })
    expect(nsppPendek.success).toBe(false)

    // NSPP 12 digit tepat -> berhasil
    const valid = daftarLembagaSchema.safeParse({
      nama_lembaga: 'Pesantren Al-Falah',
      jenis: 'pesantren',
      kota: 'Kediri',
      provinsi: 'Jawa Timur',
      nspp: '510035710001',
      nama_penanggung_jawab: 'Gus Ahmad',
      email: 'alfalah@pesantren.id',
      password: 'SandiAman12345!',
      telepon: '081234567890',
    })
    expect(valid.success).toBe(true)
  })

  it('mengizinkan lembaga non-pesantren tanpa NSPP', () => {
    const lbm = daftarLembagaSchema.safeParse({
      nama_lembaga: 'LBM PCNU Surabaya',
      jenis: 'lbm_pcnu',
      kota: 'Surabaya',
      provinsi: 'Jawa Timur',
      nama_penanggung_jawab: 'Kiai Mahrus',
      email: 'lbm.surabaya@nu.or.id',
      password: 'SandiKuat2026!',
      telepon: '081234567890',
    })
    expect(lbm.success).toBe(true)
  })

  it('mengizinkan pendaftaran PTKI dan Mahad Aly tanpa NSPP', () => {
    const ptki = daftarLembagaSchema.safeParse({
      nama_lembaga: 'UIN Sunan Ampel',
      jenis: 'ptki',
      kota: 'Surabaya',
      provinsi: 'Jawa Timur',
      nama_penanggung_jawab: 'Prof. Ahmad',
      email: 'ahmad@uinsa.ac.id',
      password: 'SandiKuat2026!',
      telepon: '081234567890',
    })
    expect(ptki.success).toBe(true)

    const mahadAly = daftarLembagaSchema.safeParse({
      nama_lembaga: "Ma'had Aly Hasyim Asy'ari",
      jenis: 'mahad_aly',
      kota: 'Jombang',
      provinsi: 'Jawa Timur',
      nama_penanggung_jawab: 'Ustadz Syamsul',
      email: 'mahadaly@tebuireng.ac.id',
      password: 'SandiKuat2026!',
      telepon: '081234567890',
    })
    expect(mahadAly.success).toBe(true)
  })

  it('mewajibkan alasan penolakan saat admin menolak verifikasi', () => {
    const tolakTanpaAlasan = verifikasiSchema.safeParse({
      lembaga_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      status: 'ditolak',
      alasan: '',
    })
    expect(tolakTanpaAlasan.success).toBe(false)

    const tolakValid = verifikasiSchema.safeParse({
      lembaga_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      status: 'ditolak',
      alasan: 'Nomor NSPP tidak terdaftar dalam pangkalan data EMIS Kemenag.',
    })
    expect(tolakValid.success).toBe(true)
  })

  it('memvalidasi profilLembagaSchema dengan isian lengkap dan opsional', () => {
    const dataLengkap = profilLembagaSchema.safeParse({
      nama_penanggung_jawab: 'Kiai Mahrus',
      kota: 'Kabupaten Sumenep',
      provinsi: 'Jawa Timur',
      alamat: 'Jl. Raya Lenteng, Lenteng Timur, Kec. Lenteng, Kabupaten Sumenep',
      kontak_email: 'konsultasiok7@gmail.com',
      kontak_telepon: '085232399067',
      situs_web: 'https://jelajahkeislaman.com',
      deskripsi: "Lembaga Bahtsul Masail MWC NU Kecamatan Lenteng.",
      logo_url: '',
    })
    expect(dataLengkap.success).toBe(true)
  })
})