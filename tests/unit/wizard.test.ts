import { describe, it, expect } from 'vitest'
import { konversiKeHijriah } from '@/lib/hijri'
import {
  wizardForumSchema,
  masalahInputSchema,
  pertanyaanInputSchema,
  rujukanInputSchema,
} from '@/lib/validation/wizard'

describe('Helper Hijriah (lib/hijri.ts)', () => {
  it('berhasil mengonversi tanggal Masehi ke Hijriah Indonesia', () => {
    const hasil = konversiKeHijriah('2024-05-18')
    expect(hasil).toBeTruthy()
    expect(hasil).toMatch(/1445/i)
  })

  it('mengembalikan string kosong jika format tanggal tidak valid', () => {
    expect(konversiKeHijriah('tanggal-salah')).toBe('')
    expect(konversiKeHijriah('')).toBe('')
  })
})

describe('Validasi Wizard Forum (lib/validation/wizard.ts)', () => {
  it('memvalidasi rujukan ibarat kitab dengan benar', () => {
    const valid = rujukanInputSchema.safeParse({
      kitab_teks: 'Fathul Qarib',
      juz: '1',
      halaman: '45',
      teks_arab: 'فصل في أحكام الصلاة',
      terjemah: 'Pasal menjelaskan hukum-hukum shalat',
    })
    expect(valid.success).toBe(true)

    const invalid = rujukanInputSchema.safeParse({
      kitab_teks: '',
      teks_arab: '',
    })
    expect(invalid.success).toBe(false)
  })

  it('memvalidasi asilah pertanyaan dan diktum jawaban', () => {
    const valid = pertanyaanInputSchema.safeParse({
      label: 'a',
      teks: 'Bagaimana hukum transaksi aset kripto?',
      jawaban: 'Haram karena mengandung unsur gharar dan maysir.',
      rujukan: [],
    })
    expect(valid.success).toBe(true)

    const invalid = pertanyaanInputSchema.safeParse({
      label: 'a',
      teks: 'pendek',
      jawaban: 'singkat',
    })
    expect(invalid.success).toBe(false)
  })

  it('memvalidasi masalah harus memiliki minimal 1 topik', () => {
    const valid = masalahInputSchema.safeParse({
      judul: 'Hukum Transaksi Kripto Menurut Syariat',
      deskripsi: 'Deskripsi pembahasan',
      topik: ['muamalah'],
      corak: 'waqi_iyyah',
      pertanyaan: [
        {
          label: 'a',
          teks: 'Apakah kripto sah sebagai alat tukar?',
          jawaban: 'Tidak sah sebagai mata uang resmi yang diakui syariat.',
          rujukan: [],
        },
      ],
    })
    expect(valid.success).toBe(true)

    const invalidTopik = masalahInputSchema.safeParse({
      judul: 'Hukum Kripto',
      topik: [], // Kosong
      pertanyaan: [],
    })
    expect(invalidTopik.success).toBe(false)
  })

  it('memvalidasi seluruh data wizard forum secara menyeluruh', () => {
    const valid = wizardForumSchema.safeParse({
      tuan_rumah: 'Pondok Pesantren Lirboyo',
      tanggal_mulai: '2024-05-18',
      tanggal_selesai: '2024-05-19',
      lokasi: 'Kediri',
      moderator: ['Ust. Fauzi'],
      pentashih: ['KH. Azizi Hasbullah'],
      perumus: ['Gus Aniq'],
      masalah: [
        {
          judul: 'Hukum Paylater dan Bunga Tersembunyi',
          topik: ['muamalah'],
          pertanyaan: [
            {
              label: 'a',
              teks: 'Apakah skema paylater termasuk riba nasiah?',
              jawaban: 'Ya, apabila terdapat denda keterlambatan yang dipersyaratkan.',
              rujukan: [],
            },
          ],
        },
      ],
    })
    expect(valid.success).toBe(true)
  })
})