// ============================================================
// MOCHI — Tipe TypeScript Database (generated from schema)
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ===== ENUM TYPES =====

export type PeranPengguna = 'lembaga' | 'admin'

export type StatusLembaga = 'menunggu' | 'terverifikasi' | 'ditolak' | 'ditangguhkan'

export type JenisLembaga =
  | 'pesantren'
  | 'lembaga_internal_pesantren'
  | 'organisasi'
  | 'lembaga_lain'

export type StatusKonten = 'draf' | 'terbit'

export type TopikEnum = 'ibadah' | 'muamalah' | 'munakahat'

export type JenisPembahasan = 'waqiiyyah' | 'maudhuiyyah' | 'qanuniyyah' | 'lainnya'

export type StatusLaporan = 'baru' | 'diproses' | 'selesai' | 'ditolak'

// ===== TABLE ROW TYPES =====

export interface Profil {
  id: string
  nama: string
  peran: PeranPengguna
  dibuat_pada: string
}

export interface Lembaga {
  id: string
  slug: string
  nama: string
  jenis: JenisLembaga
  induk_id: string | null
  deskripsi: string | null
  kota: string | null
  provinsi: string | null
  alamat: string | null
  situs_web: string | null
  kontak_email: string | null
  kontak_telepon: string | null
  nspp: string | null
  emis_id: string | null
  logo_url: string | null
  dokumen_bukti_url: string | null
  status: StatusLembaga
  alasan_status: string | null
  diverifikasi_pada: string | null
  dibuat_pada: string
  diperbarui_pada: string
}

export interface Pengelola {
  lembaga_id: string
  user_id: string
}

export interface Kitab {
  id: string
  slug: string
  nama_latin: string
  nama_arab: string | null
  pengarang: string | null
  pengarang_arab: string | null
  wafat_h: number | null
  bidang: string | null
  alias: string[]
  disetujui: boolean
  diusulkan_oleh: string | null
  dibuat_pada: string
}

export interface Forum {
  id: string
  slug: string
  lembaga_id: string
  nama: string | null
  tuan_rumah: string | null
  tanggal_mulai: string
  tanggal_selesai: string | null
  tanggal_hijriah: string | null
  lokasi: string
  kota: string | null
  provinsi: string | null
  sumber_materi: string | null
  jenis: JenisPembahasan | null
  moderator: string[]
  pentashih: string[]
  perumus: string[]
  catatan_arsip: string | null
  status: StatusKonten
  diterbitkan_pada: string | null
  tayangan: number
  dibuat_oleh: string | null
  dibuat_pada: string
  diperbarui_pada: string
  dihapus_pada: string | null
}

export interface Dokumentasi {
  id: string
  forum_id: string
  url: string
  keterangan: string | null
  urutan: number
}

export interface Masalah {
  id: string
  kode: string
  slug: string
  forum_id: string
  judul: string
  deskripsi: string
  topik: TopikEnum[]
  corak: JenisPembahasan | null
  kata_kunci: string[]
  urutan: number
  tayangan: number
  teks_cari: string | null
  dibuat_pada: string
  diperbarui_pada: string
}

export interface Pertanyaan {
  id: string
  masalah_id: string
  label: string
  teks: string
  jawaban: string
  urutan: number
}

export interface Rujukan {
  id: string
  pertanyaan_id: string
  kitab_id: string | null
  kitab_teks: string | null
  juz: string | null
  halaman: string | null
  teks_arab: string | null
  terjemah: string | null
  urutan: number
}

export interface Potongan {
  id: string
  pertanyaan_id: string
  masalah_id: string
  isi: string
  embedding: number[] | null  // vector(768)
  dibuat_pada: string
}

export interface Revisi {
  id: string
  entitas: string
  entitas_id: string
  snapshot: Json
  ringkasan: string | null
  oleh: string | null
  pada: string
}

export interface Laporan {
  id: string
  masalah_id: string | null
  alasan: string
  detail: string | null
  kontak: string | null
  status: StatusLaporan
  catatan_admin: string | null
  dibuat_pada: string
}

export interface LogAudit {
  id: number
  user_id: string | null
  aksi: string
  entitas: string | null
  entitas_id: string | null
  meta: Json | null
  pada: string
}

export interface LogChat {
  id: number
  pertanyaan: string
  ada_sumber: boolean
  jumlah_sumber: number | null
  skor_tertinggi: number | null
  umpan_balik: number | null
  pada: string
}

export interface TayanganHarian {
  tanggal: string
  jenis: string
  target_id: string
  sesi_hash: string
}

// ===== INSERT TYPES (tanpa generated fields) =====

export type LembagaInsert = Omit<
  Lembaga,
  'id' | 'dibuat_pada' | 'diperbarui_pada' | 'diverifikasi_pada'
>

export type ForumInsert = Omit<
  Forum,
  'id' | 'dibuat_pada' | 'diperbarui_pada' | 'diterbitkan_pada' | 'tayangan'
>

export type MasalahInsert = Omit<
  Masalah,
  'id' | 'dibuat_pada' | 'diperbarui_pada' | 'tayangan' | 'teks_cari'
>

export type PertanyaanInsert = Omit<Pertanyaan, 'id'>

export type RujukanInsert = Omit<Rujukan, 'id'>

export type KitabInsert = Omit<Kitab, 'id' | 'dibuat_pada'>

export type LaporanInsert = Pick<Laporan, 'masalah_id' | 'alasan' | 'detail' | 'kontak'>

// ===== VIEW TYPES =====

export interface VMasalahPublik extends Masalah {
  forum_id: string
  forum_slug: string
  forum_nama: string | null
  tanggal_mulai: string
  tanggal_selesai: string | null
  tanggal_hijriah: string | null
  lokasi: string
  forum_kota: string | null
  moderator: string[]
  pentashih: string[]
  perumus: string[]
  sumber_materi: string | null
  lembaga_id: string
  lembaga_slug: string
  lembaga_nama: string
  lembaga_logo_url: string | null
  lembaga_jenis: JenisLembaga
  lembaga_kota: string | null
  lembaga_provinsi: string | null
}

export interface MvLembagaStat {
  lembaga_id: string
  total_forum: number
  total_masalah: number
  forum_90h: number
  masalah_90h: number
  bulan_aktif_6: number
  tayangan_total: number
  // Skor = forum_90h*3 + masalah_90h*1 + bulan_aktif_6*2 (hitung di aplikasi)
}

// ===== DATABASE TYPE (dipakai di createClient<Database>()) =====

export interface Database {
  public: {
    Tables: {
      profil: {
        Row: Profil
        Insert: Omit<Profil, 'dibuat_pada'>
        Update: Partial<Omit<Profil, 'id'>>
      }
      lembaga: {
        Row: Lembaga
        Insert: LembagaInsert
        Update: Partial<LembagaInsert>
      }
      pengelola: {
        Row: Pengelola
        Insert: Pengelola
        Update: Partial<Pengelola>
      }
      kitab: {
        Row: Kitab
        Insert: KitabInsert
        Update: Partial<KitabInsert>
      }
      forum: {
        Row: Forum
        Insert: ForumInsert
        Update: Partial<ForumInsert>
      }
      dokumentasi: {
        Row: Dokumentasi
        Insert: Omit<Dokumentasi, 'id'>
        Update: Partial<Omit<Dokumentasi, 'id'>>
      }
      masalah: {
        Row: Masalah
        Insert: MasalahInsert
        Update: Partial<MasalahInsert>
      }
      pertanyaan: {
        Row: Pertanyaan
        Insert: PertanyaanInsert
        Update: Partial<PertanyaanInsert>
      }
      rujukan: {
        Row: Rujukan
        Insert: RujukanInsert
        Update: Partial<RujukanInsert>
      }
      potongan: {
        Row: Potongan
        Insert: Omit<Potongan, 'id' | 'dibuat_pada'>
        Update: Partial<Omit<Potongan, 'id'>>
      }
      revisi: {
        Row: Revisi
        Insert: Omit<Revisi, 'id' | 'pada'>
        Update: never
      }
      laporan: {
        Row: Laporan
        Insert: LaporanInsert
        Update: Partial<Pick<Laporan, 'status' | 'catatan_admin'>>
      }
      log_audit: {
        Row: LogAudit
        Insert: Omit<LogAudit, 'id' | 'pada'>
        Update: never
      }
      log_chat: {
        Row: LogChat
        Insert: Omit<LogChat, 'id' | 'pada'>
        Update: Pick<LogChat, 'umpan_balik'>
      }
      tayangan_harian: {
        Row: TayanganHarian
        Insert: TayanganHarian
        Update: never
      }
    }
    Views: {
      v_masalah_publik: {
        Row: VMasalahPublik
      }
      mv_lembaga_stat: {
        Row: MvLembagaStat
      }
    }
    Functions: {
      buat_kode_masalah: {
        Args: { tahun: number }
        Returns: string
      }
      normalisasi_arab: {
        Args: { t: string }
        Returns: string
      }
      adalah_admin: {
        Args: Record<never, never>
        Returns: boolean
      }
      mengelola_lembaga: {
        Args: { l_id: string }
        Returns: boolean
      }
      lembaga_terverifikasi: {
        Args: { l_id: string }
        Returns: boolean
      }
      cari_masalah_semantik: {
        Args: {
          query_embedding: number[]
          match_threshold?: number
          match_count?: number
        }
        Returns: Array<{
          masalah_id: string
          pertanyaan_id: string
          isi: string
          kemiripan: number
        }>
      }
    }
    Enums: {
      peran_pengguna: PeranPengguna
      status_lembaga: StatusLembaga
      jenis_lembaga: JenisLembaga
      status_konten: StatusKonten
      topik_enum: TopikEnum
      jenis_pembahasan: JenisPembahasan
      status_laporan: StatusLaporan
    }
  }
}
