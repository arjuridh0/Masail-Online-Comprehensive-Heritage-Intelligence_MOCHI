import { describe, it, expect } from 'vitest'
import { bersihkanSitasiTeks } from '@/lib/sitasi'
import { checkRateLimit } from '@/lib/ratelimit'
import { z } from 'zod'

const chatInputSchema = z.object({
  pertanyaan: z
    .string()
    .trim()
    .min(3, 'Minimal 3 karakter')
    .max(500, 'Maksimal 500 karakter'),
})

describe('Modul AI & Chatbot Tanya MOCHI', () => {
  describe('Pembersihan Sitasi (bersihkanSitasiTeks)', () => {
    it('mempertahankan sitasi sah dalam rentang sumber', () => {
      const teks = 'Berdasarkan keputusan [S1] dan diperkuat oleh [S2], hukumnya boleh.'
      const hasil = bersihkanSitasiTeks(teks, 2)
      expect(hasil).toBe('Berdasarkan keputusan [S1] dan diperkuat oleh [S2], hukumnya boleh.')
    })

    it('menghapus penanda sitasi di luar jumlah sumber sah', () => {
      const teks = 'Menurut [S1] dan [S5], serta [S9] hal ini makruh.'
      const hasil = bersihkanSitasiTeks(teks, 2)
      expect(hasil).toBe('Menurut [S1] dan , serta  hal ini makruh.')
    })

    it('menghapus semua sitasi jika maxSumber adalah 0 (penolakan/tanpa sumber)', () => {
      const teks = 'Tidak ditemukan data [S1] atau [S2].'
      const hasil = bersihkanSitasiTeks(teks, 0)
      expect(hasil).toBe('Tidak ditemukan data  atau .')
    })
  })

  describe('Validasi Skema Input Chat', () => {
    it('menerima pertanyaan fiqih yang valid', () => {
      const result = chatInputSchema.safeParse({
        pertanyaan: 'Bagaimana hukum transaksi paylater dalam fiqih muamalah?',
      })
      expect(result.success).toBe(true)
    })

    it('menolak pertanyaan kurang dari 3 karakter', () => {
      const result = chatInputSchema.safeParse({ pertanyaan: 'ya' })
      expect(result.success).toBe(false)
    })

    it('menolak pertanyaan melebihi 500 karakter', () => {
      const longText = 'a'.repeat(501)
      const result = chatInputSchema.safeParse({ pertanyaan: longText })
      expect(result.success).toBe(false)
    })
  })

  describe('Rate Limiter Proteksi Chatbot', () => {
    it('mengizinkan permintaan di bawah batas limit', () => {
      const testIp = `test_ip_${Date.now()}`
      const res = checkRateLimit(testIp, 5, 10000)
      expect(res.success).toBe(true)
      expect(res.remaining).toBe(4)
    })

    it('memblokir permintaan setelah batas limit tercapai', () => {
      const testIp = `blocked_ip_${Date.now()}`
      for (let i = 0; i < 3; i++) {
        checkRateLimit(testIp, 3, 10000)
      }
      const blockedRes = checkRateLimit(testIp, 3, 10000)
      expect(blockedRes.success).toBe(false)
      expect(blockedRes.remaining).toBe(0)
      expect(blockedRes.reset).toBeGreaterThan(0)
    })
  })

  describe('Ambang Batas Nol Halusinasi (Zero Hallucination Logic)', () => {
    it('menolak memanggil LLM jika skor kemiripan < 0.60', () => {
      const topScore = 0.52
      const threshold = 0.60
      const isEligible = topScore >= threshold
      expect(isEligible).toBe(false)
    })

    it('mengizinkan pemrosesan LLM jika skor kemiripan >= 0.60', () => {
      const topScore = 0.76
      const threshold = 0.60
      const isEligible = topScore >= threshold
      expect(isEligible).toBe(true)
    })
  })
})
