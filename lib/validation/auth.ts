import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(10, 'Kata sandi minimal 10 karakter'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const daftarLembagaSchema = z.object({
  // Identitas Lembaga
  nama_lembaga: z.string().min(3, 'Nama lembaga minimal 3 karakter').max(150),
  jenis: z.enum(['pesantren', 'lbm_pwnu', 'lbm_pcnu', 'ptki', 'mahad_aly', 'asosiasi']),
  kota: z.string().min(2, 'Kota wajib diisi').max(100),
  provinsi: z.string().min(2, 'Provinsi wajib diisi').max(100),
  alamat: z.string().max(255).optional().or(z.literal('')),
  nspp: z.string().optional().or(z.literal('')),
  situs_web: z.string().url('URL tidak valid').optional().or(z.literal('')),
  deskripsi: z.string().max(1000).optional().or(z.literal('')),

  // Penanggung Jawab & Akun
  nama_penanggung_jawab: z.string().min(3, 'Nama penanggung jawab minimal 3 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(10, 'Kata sandi minimal 10 karakter'),
  telepon: z.string().min(8, 'Nomor telepon minimal 8 karakter').max(20),
}).refine(
  (data) => {
    if (data.jenis === 'pesantren') {
      return !!data.nspp && /^\d{12}$/.test(data.nspp.trim())
    }
    return true
  },
  {
    message: 'Lembaga jenis pesantren wajib mengisi NSPP 12 digit angka',
    path: ['nspp'],
  }
)

export type DaftarLembagaInput = z.infer<typeof daftarLembagaSchema>

export const ubahKataSandiSchema = z.object({
  sandi_baru: z.string().min(10, 'Kata sandi baru minimal 10 karakter'),
  konfirmasi_sandi: z.string().min(10, 'Konfirmasi kata sandi minimal 10 karakter'),
}).refine((data) => data.sandi_baru === data.konfirmasi_sandi, {
  message: 'Konfirmasi kata sandi baru tidak cocok',
  path: ['konfirmasi_sandi'],
})

export type UbahKataSandiInput = z.infer<typeof ubahKataSandiSchema>

export const profilAdminSchema = z.object({
  nama: z.string().min(3, 'Nama admin minimal 3 karakter').max(100),
})

export type ProfilAdminInput = z.infer<typeof profilAdminSchema>

export const moderasiLembagaSchema = z.object({
  lembaga_id: z.string().uuid('ID Lembaga tidak valid'),
  aksi: z.enum(['tangguhkan', 'reaktivasi']),
  alasan: z.string().optional().or(z.literal('')),
}).refine(
  (data) => {
    if (data.aksi === 'tangguhkan') {
      return !!data.alasan && data.alasan.trim().length >= 5
    }
    return true
  },
  {
    message: 'Alasan penangguhan minimal 5 karakter wajib disertakan',
    path: ['alasan'],
  }
)

export type ModerasiLembagaInput = z.infer<typeof moderasiLembagaSchema>

export const editLembagaAdminSchema = z.object({
  lembaga_id: z.string().uuid(),
  nama: z.string().min(3, 'Nama lembaga minimal 3 karakter').max(150),
  jenis: z.string(),
  nspp: z.string().optional().or(z.literal('')),
  kota: z.string().min(2).max(100),
  provinsi: z.string().min(2).max(100),
  kontak_email: z.string().email().optional().or(z.literal('')),
  kontak_telepon: z.string().optional().or(z.literal('')),
})

export type EditLembagaAdminInput = z.infer<typeof editLembagaAdminSchema>

export const profilLembagaSchema = z.object({
  nama_penanggung_jawab: z.string().min(3, 'Nama penanggung jawab minimal 3 karakter').max(100).optional(),
  deskripsi: z.string().max(1000).optional().or(z.literal('')),
  alamat: z.string().max(255).optional().or(z.literal('')),
  kota: z.string().min(2).max(100),
  provinsi: z.string().min(2).max(100),
  kontak_telepon: z.string().max(30).optional().or(z.literal('')),
  kontak_email: z.string().email().optional().or(z.literal('')),
  situs_web: z.string().url().optional().or(z.literal('')),
  logo_url: z.string().url().optional().or(z.literal('')),
})

export type ProfilLembagaInput = z.infer<typeof profilLembagaSchema>

export const kitabSchema = z.object({
  nama_latin: z.string().min(2, 'Nama Latin minimal 2 karakter').max(150),
  nama_arab: z.string().max(150).optional().or(z.literal('')),
  pengarang: z.string().max(150).optional().or(z.literal('')),
  pengarang_arab: z.string().max(150).optional().or(z.literal('')),
  wafat_h: z.number().int().positive().nullable().optional(),
  bidang: z.string().min(2, 'Bidang ilmu minimal 2 karakter').max(50),
  alias: z.array(z.string()).default([]),
})

export type KitabInput = z.infer<typeof kitabSchema>

export const verifikasiSchema = z.object({
  lembaga_id: z.string().uuid(),
  status: z.enum(['terverifikasi', 'ditolak', 'ditangguhkan']),
  alasan: z.string().optional().or(z.literal('')),
}).refine(
  (data) => {
    if (data.status === 'ditolak') {
      return !!data.alasan && data.alasan.trim().length >= 5
    }
    return true
  },
  {
    message: 'Alasan penolakan minimal 5 karakter wajib disertakan jika menolak permohonan',
    path: ['alasan'],
  }
)

export type VerifikasiInput = z.infer<typeof verifikasiSchema>