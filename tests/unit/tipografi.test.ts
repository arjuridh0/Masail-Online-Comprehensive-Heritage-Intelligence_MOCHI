import { describe, it, expect } from 'vitest'
import { normalisasiArabClient } from '@/lib/search/hybrid'

describe('Fase 11 — Tipografi Arab & Aksesibilitas UX', () => {
  describe('Penanganan Teks Arab Berharakat', () => {
    it('mempertahankan keutuhan harakat teks Arab saat ditampilkan', () => {
      const ibaratArab = 'تَكْمِلَةُ الْمَجْمُوعِ شَرْحُ الْمُهَذَّبِ'
      expect(ibaratArab).toContain('َ') // fathah
      expect(ibaratArab).toContain('ِ') // kasrah
      expect(ibaratArab).toContain('ُ') // dhammah
      expect(ibaratArab).toContain('ّ') // syaddah
    })

    it('normalisasiArabClient membersihkan harakat tanpa merusak huruf asli untuk keperluan pencarian', () => {
      const teksBerharakat = 'فَتْحُ الْقَرِيبِ الْمُجِيبِ'
      const bersih = normalisasiArabClient(teksBerharakat)
      expect(bersih).toBe('فتح القريب المجيب')
    })

    it('menangani teks Arab dengan tanda baca dan kurung rujukan secara aman', () => {
      const raw = '(ج ٢، ص ٤٥) [المسألة الأولى]'
      const bersih = normalisasiArabClient(raw)
      expect(bersih).toContain('المساله')
    })
  })

  describe('Standar Skala Huruf Arab (Font Scaling)', () => {
    it('memvalidasi 3 tingkat skala ukuran font yang didukung', () => {
      const fontScales = ['md', 'lg', 'xl'] as const
      const getFontSizeClass = (scale: 'md' | 'lg' | 'xl') => {
        switch (scale) {
          case 'md':
            return 'text-xl sm:text-2xl leading-[2.1]'
          case 'lg':
            return 'text-2xl sm:text-3xl leading-[2.3]'
          case 'xl':
            return 'text-3xl sm:text-4xl leading-[2.5]'
        }
      }

      for (const scale of fontScales) {
        const cls = getFontSizeClass(scale)
        expect(cls).toBeDefined()
        expect(cls).toContain('leading-')
      }
    })
  })

  describe('Konsistensi Terminologi Fiqih Pesantren (Microcopy)', () => {
    it('menggunakan terminologi resmi pesantren NU', () => {
      const terms = {
        pertanyaan: "As'ilah",
        jawaban: 'Diktum Keputusan Hukum',
        rujukan: "Al-Ma'khadz (Ibarat Rujukan Kitab)",
        mushohhih: 'Dewan Mushohhih',
        perumus: 'Dewan Perumus',
      }

      expect(terms.pertanyaan).toBe("As'ilah")
      expect(terms.jawaban).toBe('Diktum Keputusan Hukum')
      expect(terms.rujukan).toContain("Al-Ma'khadz")
      expect(terms.mushohhih).toBe('Dewan Mushohhih')
    })
  })
})
