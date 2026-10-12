/**
 * MOCHI — Kalkulasi Skor Keaktifan & Lencana Pesantren
 * Rujukan: docs/02_SPESIFIKASI_TEKNIS.md & PRD §7.7
 */

export interface ParameterKeaktifan {
  forum90Hari: number
  masalah90Hari: number
  bulanAktif6Bulan: number // 0..6
  totalForum?: number
  totalMasalah?: number
  totalTayangan?: number
  dibuatPada?: string | Date
}

export type TipeLencana =
  | 'lembaga_baru'
  | 'aktif'
  | 'konsisten'
  | 'rujukan_populer'
  | 'penjaga_arsip'

export interface InfoLencana {
  tipe: TipeLencana
  label: string
  deskripsi: string
  warna: string // CSS class atau kode warna
  ikon: string
}

export const DAFTAR_LENCANA: Record<TipeLencana, InfoLencana> = {
  lembaga_baru: {
    tipe: 'lembaga_baru',
    label: 'Lembaga Baru',
    deskripsi: 'Terdaftar di repositori MOCHI dalam 30 hari terakhir',
    warna: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ikon: 'Sparkles',
  },
  aktif: {
    tipe: 'aktif',
    label: 'Aktif',
    deskripsi: 'Menyelenggarakan minimal 1 forum bahtsul masail dalam 90 hari terakhir',
    warna: 'bg-blue-50 text-blue-700 border-blue-200',
    ikon: 'Flame',
  },
  konsisten: {
    tipe: 'konsisten',
    label: 'Konsisten',
    deskripsi: 'Aktif mempublikasikan keputusan masail minimal 3 bulan dalam 6 bulan terakhir',
    warna: 'bg-amber-50 text-amber-700 border-amber-200',
    ikon: 'CalendarCheck',
  },
  rujukan_populer: {
    tipe: 'rujukan_populer',
    label: 'Rujukan Populer',
    deskripsi: 'Keputusan masail dibaca lebih dari 500 kali oleh masyarakat',
    warna: 'bg-purple-50 text-purple-700 border-purple-200',
    ikon: 'Eye',
  },
  penjaga_arsip: {
    tipe: 'penjaga_arsip',
    label: 'Penjaga Arsip Turats',
    deskripsi: 'Mendokumentasikan lebih dari 5 forum atau 15 keputusan masail resmi',
    warna: 'bg-stone-100 text-stone-800 border-stone-300',
    ikon: 'ShieldCheck',
  },
}

/**
 * Hitung skor keaktifan lembaga pesantren
 * Rumus baku: forum_90h * 3 + masalah_90h * 1 + bulan_aktif_6 * 2
 */
export function hitungSkorKeaktifan(param: ParameterKeaktifan): number {
  const f90 = Math.max(0, param.forum90Hari || 0)
  const m90 = Math.max(0, param.masalah90Hari || 0)
  const b6 = Math.min(6, Math.max(0, param.bulanAktif6Bulan || 0))

  return f90 * 3 + m90 * 1 + b6 * 2
}

/**
 * Tentukan lencana yang berhak disandang lembaga
 */
export function tentukanLencana(param: ParameterKeaktifan): InfoLencana[] {
  const hasil: InfoLencana[] = []

  // 1. Lembaga Baru: Terdaftar < 30 hari
  if (param.dibuatPada) {
    const tglDibuat = new Date(param.dibuatPada)
    const selisihHari = (Date.now() - tglDibuat.getTime()) / (1000 * 60 * 60 * 24)
    if (selisihHari <= 30 && selisihHari >= 0) {
      hasil.push(DAFTAR_LENCANA.lembaga_baru)
    }
  }

  // 2. Aktif: minimal 1 forum dalam 90 hari
  if ((param.forum90Hari || 0) >= 1) {
    hasil.push(DAFTAR_LENCANA.aktif)
  }

  // 3. Konsisten: aktif min 3 bulan dalam 6 bulan terakhir
  if ((param.bulanAktif6Bulan || 0) >= 3) {
    hasil.push(DAFTAR_LENCANA.konsisten)
  }

  // 4. Rujukan Populer: tayangan >= 500
  if ((param.totalTayangan || 0) >= 500) {
    hasil.push(DAFTAR_LENCANA.rujukan_populer)
  }

  // 5. Penjaga Arsip: >= 5 forum ATAU >= 15 masalah
  if ((param.totalForum || 0) >= 5 || (param.totalMasalah || 0) >= 15) {
    hasil.push(DAFTAR_LENCANA.penjaga_arsip)
  }

  return hasil
}
