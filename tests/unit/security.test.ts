import { describe, it, expect } from 'vitest'
import { validasiBerkasUpload, buatNamaFileAman } from '@/lib/validation/upload'
import { checkRateLimit } from '@/lib/ratelimit'
import { bersihkanSitasiTeks } from '@/lib/sitasi'
import { escapeHtml, sanitasiXss } from '@/lib/validation/sanitasi'

describe('Fase 10 — Pengerasan Keamanan & Validasi Input', () => {
  describe('Validasi Unggahan Berkas (Anti-Malware & File Upload Guard)', () => {
    it('menerima berkas gambar sah (JPEG/PNG/WebP <= 3MB)', () => {
      const res = validasiBerkasUpload(
        { name: 'logo_pesantren.png', size: 1024 * 500, type: 'image/png' },
        'gambar'
      )
      expect(res.valid).toBe(true)
      expect(res.namaAman).toBeDefined()
      expect(res.namaAman).toMatch(/^gambar_\d+_[a-z0-9]+\.png$/)
    })

    it('menolak berkas gambar jika melebihi batas 3 MB', () => {
      const res = validasiBerkasUpload(
        { name: 'banner_raksasa.jpg', size: 4 * 1024 * 1024, type: 'image/jpeg' },
        'gambar'
      )
      expect(res.valid).toBe(false)
      expect(res.error).toContain('melebihi batas maksimal 3 MB')
    })

    it('menolak berkas kosong 0 bytes', () => {
      const res = validasiBerkasUpload(
        { name: 'kosong.pdf', size: 0, type: 'application/pdf' },
        'dokumen'
      )
      expect(res.valid).toBe(false)
      expect(res.error).toContain('Berkas kosong')
    })

    it('menolak berkas dokumen jika melebihi batas 10 MB', () => {
      const res = validasiBerkasUpload(
        { name: 'sk_kemenag.pdf', size: 11 * 1024 * 1024, type: 'application/pdf' },
        'dokumen'
      )
      expect(res.valid).toBe(false)
      expect(res.error).toContain('melebihi batas maksimal 10 MB')
    })

    it('menerima foto dokumentasi forum <= 5 MB dan menolak > 5 MB', () => {
      const ok = validasiBerkasUpload(
        { name: 'suasana_sidang_lbm.jpg', size: 4.5 * 1024 * 1024, type: 'image/jpeg' },
        'dokumentasi'
      )
      expect(ok.valid).toBe(true)
      expect(ok.namaAman).toMatch(/^dokumentasi_\d+_[a-z0-9]+\.jpg$/)

      const terlaluBesar = validasiBerkasUpload(
        { name: 'sidang_hd.png', size: 5.5 * 1024 * 1024, type: 'image/png' },
        'dokumentasi'
      )
      expect(terlaluBesar.valid).toBe(false)
      expect(terlaluBesar.error).toContain('melebihi batas maksimal 5 MB')

      const bukanGambar = validasiBerkasUpload(
        { name: 'catatan.pdf', size: 1024 * 500, type: 'application/pdf' },
        'dokumentasi'
      )
      expect(bukanGambar.valid).toBe(false)
    })

    it('menolak skrip berbahaya (.html, .svg berskrip, .php, .exe, .sh)', () => {
      const bahaya1 = validasiBerkasUpload(
        { name: 'exploit.html', size: 1024, type: 'text/html' },
        'gambar'
      )
      expect(bahaya1.valid).toBe(false)

      const bahaya2 = validasiBerkasUpload(
        { name: 'vector.svg', size: 1024, type: 'image/svg+xml' },
        'gambar'
      )
      expect(bahaya2.valid).toBe(false)

      const bahaya3 = validasiBerkasUpload(
        { name: 'backdoor.php.jpg', size: 1024, type: 'image/jpeg' },
        'gambar'
      )
      expect(bahaya3.valid).toBe(false)
      expect(bahaya3.error).toContain('ekstensi berisiko')

      const bahaya4 = validasiBerkasUpload(
        { name: 'trojan.exe', size: 2048, type: 'application/octet-stream' },
        'dokumen'
      )
      expect(bahaya4.valid).toBe(false)
    })

    it('menghasilkan nama aman unik dengan entropy timestamp', () => {
      const n1 = buatNamaFileAman('foto kegiatan pesantren.jpg', 'dok')
      const n2 = buatNamaFileAman('foto kegiatan pesantren.jpg', 'dok')
      expect(n1).not.toBe(n2)
      expect(n1).toMatch(/^dok_\d+_[a-z0-9]+\.jpg$/)
    })
  })

  describe('Rate Limiter (Perlindungan DoS / Brute-force)', () => {
    it('mengizinkan permintaan dalam batas limit dan menolak setelah melebihi batas', () => {
      const id = `test_ip_${Date.now()}`
      const limit = 3
      const windowMs = 5000

      const r1 = checkRateLimit(id, limit, windowMs)
      expect(r1.success).toBe(true)
      expect(r1.remaining).toBe(2)

      const r2 = checkRateLimit(id, limit, windowMs)
      expect(r2.success).toBe(true)
      expect(r2.remaining).toBe(1)

      const r3 = checkRateLimit(id, limit, windowMs)
      expect(r3.success).toBe(true)
      expect(r3.remaining).toBe(0)

      // Permintaan ke-4 harus ditolak
      const r4 = checkRateLimit(id, limit, windowMs)
      expect(r4.success).toBe(false)
      expect(r4.remaining).toBe(0)
      expect(r4.reset).toBeGreaterThan(0)
    })
  })

  describe('Sanitasi Output & Pencegahan XSS', () => {
    it('membersihkan tag HTML dan karakter berisiko saat memvalidasi sitasi', () => {
      const inputKotor = 'Hasil musyawarah [S1] <script>alert("xss")</script> <b>penting</b>.'
      const hasil = bersihkanSitasiTeks(inputKotor)
      expect(hasil).not.toContain('<script>')
      expect(hasil).not.toContain('</script>')
      expect(hasil).toContain('[S1]')
    })

    it('melakukan escapeHtml pada karakter khusus HTML', () => {
      const htmlRaw = '<div class="test">Fatwa & Hukum "Kripto" \'Halal\'</div>'
      const escaped = escapeHtml(htmlRaw)
      expect(escaped).toBe('&lt;div class=&quot;test&quot;&gt;Fatwa &amp; Hukum &quot;Kripto&quot; &#39;Halal&#39;&lt;/div&gt;')
    })

    it('sanitasiXss menghapus script injection, iframe, dan event handlers', () => {
      const payload = '<img src=x onerror="alert(1)"> <script>steal()</script> <iframe src="evil.com"></iframe>'
      const sanitized = sanitasiXss(payload)
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('<iframe>')
      expect(sanitized).not.toContain('onerror=')
    })
  })

  describe('Audit Kebocoran Rahasia (Secrets Leak Check)', () => {
    it('memastikan variabel publik NEXT_PUBLIC_ tidak memuat service role key atau AI key', () => {
      const envKeys = Object.keys(process.env).filter((k) => k.startsWith('NEXT_PUBLIC_'))

      for (const k of envKeys) {
        expect(k).not.toContain('SERVICE_ROLE')
        expect(k).not.toContain('SECRET')
        expect(k).not.toContain('AI_KEY')
        expect(k).not.toContain('GROQ')
        expect(k).not.toContain('PASSWORD')
      }
    })
  })
})
