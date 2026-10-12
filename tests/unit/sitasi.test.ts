import { describe, it, expect } from 'vitest'
import { formatSitasiMochi, formatRentangTanggal } from '@/lib/sitasi'

describe('Utilitas Sitasi MOCHI', () => {
  it('memformat rentang tanggal satu hari dengan benar', () => {
    const hasil = formatRentangTanggal('2024-10-14T00:00:00Z', '2024-10-14T00:00:00Z')
    expect(hasil).toBe('14 Oktober 2024')
  })

  it('memformat rentang tanggal multi-hari dalam bulan yang sama', () => {
    const hasil = formatRentangTanggal('2024-10-10T00:00:00Z', '2024-10-12T00:00:00Z')
    expect(hasil).toBe('10–12 Oktober 2024')
  })

  it('memformat rentang tanggal beda bulan dalam tahun yang sama', () => {
    const hasil = formatRentangTanggal('2004-08-31T00:00:00Z', '2004-09-02T00:00:00Z')
    expect(hasil).toBe('31 Agustus – 2 September 2004')
  })

  it('memformat sitasi lengkap sesuai PRD §7.5', () => {
    const sitasi = formatSitasiMochi({
      lembagaNama: 'LBM PWNU Jawa Timur',
      masalahJudul: 'Hukum Test Deoxyribo Nucleic Acid (DNA)',
      forumNama: "Hasil Rumusan Masail Waqi'iyyah",
      tempat: 'Banyuwangi',
      tanggalMulai: '2004-08-31T00:00:00Z',
      tanggalSelesai: '2004-09-02T00:00:00Z',
      kode: 'MCH-2004-0001',
      slug: 'hukum-tes-dna-banyuwangi-2004',
      baseUrl: 'https://mochi.pesantren.id',
    })

    expect(sitasi).toContain('LBM PWNU Jawa Timur, "Hukum Test Deoxyribo Nucleic Acid (DNA)"')
    expect(sitasi).toContain("Hasil Bahtsul Masail Hasil Rumusan Masail Waqi'iyyah, Banyuwangi")
    expect(sitasi).toContain('31 Agustus – 2 September 2004')
    expect(sitasi).toContain('MCH-2004-0001')
    expect(sitasi).toContain('https://mochi.pesantren.id/masalah/hukum-tes-dna-banyuwangi-2004')
  })
})
