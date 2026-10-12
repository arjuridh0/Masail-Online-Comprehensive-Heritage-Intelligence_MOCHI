import { describe, it, expect } from 'vitest'
import { hitungSkorKeaktifan, tentukanLencana } from '@/lib/skor'

describe('Kalkulasi Skor Keaktifan & Lencana Pesantren (lib/skor.ts)', () => {
  describe('hitungSkorKeaktifan()', () => {
    it('menghitung skor nol untuk lembaga pasif', () => {
      const skor = hitungSkorKeaktifan({
        forum90Hari: 0,
        masalah90Hari: 0,
        bulanAktif6Bulan: 0,
      })
      expect(skor).toBe(0)
    })

    it('menghitung skor sesuai bobot: forum*3 + masalah*1 + bulan*2', () => {
      const skor = hitungSkorKeaktifan({
        forum90Hari: 2, // 2 * 3 = 6
        masalah90Hari: 5, // 5 * 1 = 5
        bulanAktif6Bulan: 3, // 3 * 2 = 6
      })
      expect(skor).toBe(17)
    })

    it('membatasi bulan aktif maksimal 6 bulan dan mengabaikan nilai negatif', () => {
      const skor = hitungSkorKeaktifan({
        forum90Hari: -1,
        masalah90Hari: 4,
        bulanAktif6Bulan: 10, // max 6 * 2 = 12
      })
      expect(skor).toBe(16) // 0 + 4 + 12
    })
  })

  describe('tentukanLencana()', () => {
    it('memberikan lencana Lembaga Baru jika terdaftar < 30 hari', () => {
      const semingguLalu = new Date(Date.now() - 7 * 24 * 3600 * 1000)
      const lencana = tentukanLencana({
        forum90Hari: 0,
        masalah90Hari: 0,
        bulanAktif6Bulan: 0,
        dibuatPada: semingguLalu,
      })
      expect(lencana.some((l) => l.tipe === 'lembaga_baru')).toBe(true)
    })

    it('memberikan lencana Aktif dan Konsisten untuk lembaga produktif', () => {
      const lencana = tentukanLencana({
        forum90Hari: 2,
        masalah90Hari: 4,
        bulanAktif6Bulan: 4,
      })
      expect(lencana.some((l) => l.tipe === 'aktif')).toBe(true)
      expect(lencana.some((l) => l.tipe === 'konsisten')).toBe(true)
    })

    it('memberikan lencana Rujukan Populer jika tayangan >= 500', () => {
      const lencana = tentukanLencana({
        forum90Hari: 0,
        masalah90Hari: 0,
        bulanAktif6Bulan: 0,
        totalTayangan: 650,
      })
      expect(lencana.some((l) => l.tipe === 'rujukan_populer')).toBe(true)
    })

    it('memberikan lencana Penjaga Arsip jika total forum >= 5 atau total masalah >= 15', () => {
      const lencana1 = tentukanLencana({
        forum90Hari: 0,
        masalah90Hari: 0,
        bulanAktif6Bulan: 0,
        totalForum: 5,
      })
      expect(lencana1.some((l) => l.tipe === 'penjaga_arsip')).toBe(true)

      const lencana2 = tentukanLencana({
        forum90Hari: 0,
        masalah90Hari: 0,
        bulanAktif6Bulan: 0,
        totalMasalah: 16,
      })
      expect(lencana2.some((l) => l.tipe === 'penjaga_arsip')).toBe(true)
    })
  })
})
