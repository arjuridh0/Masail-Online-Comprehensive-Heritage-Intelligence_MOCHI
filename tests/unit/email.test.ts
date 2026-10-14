import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  templatePendaftaranBaruAdmin,
  templateLembagaDisetujui,
  templateLembagaDitolak,
} from '@/lib/email/templates'
import { kirimEmailNotifikasi } from '@/lib/email'

describe('Email Notification Layer — Resend Integration & Templates', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    delete process.env.RESEND_API_KEY
  })

  it('menghasilkan template email notifikasi pendaftaran untuk admin dengan data lengkap', () => {
    const tpl = templatePendaftaranBaruAdmin({
      namaLembaga: 'Pesantren Al-Ikhlas',
      jenis: 'pesantren',
      kota: 'Jombang',
      provinsi: 'Jawa Timur',
      namaPj: 'Gus Zaid',
      emailPj: 'zaid@alikhlas.id',
      teleponPj: '08123456789',
    })

    expect(tpl.subject).toContain('Pesantren Al-Ikhlas')
    expect(tpl.html).toContain('Pesantren Al-Ikhlas')
    expect(tpl.html).toContain('Jombang')
    expect(tpl.html).toContain('Gus Zaid')
    expect(tpl.html).toContain('/admin/verifikasi')
  })

  it('menghasilkan template verifikasi disetujui dengan tautan ke dasbor lembaga', () => {
    const tpl = templateLembagaDisetujui({
      namaLembaga: 'LBM PCNU Surabaya',
      namaPj: 'Kiai Mahrus',
      loginUrl: 'https://mochi.pesantren.id/masuk',
    })

    expect(tpl.subject).toContain('Telah Diverifikasi')
    expect(tpl.html).toContain('LBM PCNU Surabaya')
    expect(tpl.html).toContain('https://mochi.pesantren.id/masuk')
    expect(tpl.html).toContain('Masuk ke Dasbor')
  })

  it('menghasilkan template penolakan dengan mencantumkan alasan resmi', () => {
    const tpl = templateLembagaDitolak({
      namaLembaga: 'Lembaga Fiktif',
      namaPj: 'Budi',
      alasan: 'Dokumen SK tidak valid atau tidak terbaca.',
      daftarUrl: 'https://mochi.pesantren.id/daftar',
    })

    expect(tpl.subject).toContain('Status Pendaftaran')
    expect(tpl.html).toContain('Lembaga Fiktif')
    expect(tpl.html).toContain('Dokumen SK tidak valid')
    expect(tpl.html).toContain('https://mochi.pesantren.id/daftar')
  })

  it('mensimulasikan pengiriman email tanpa error saat RESEND_API_KEY tidak dipasang', async () => {
    const res = await kirimEmailNotifikasi({
      to: 'santri@pesantren.id',
      subject: 'Uji Notifikasi',
      html: '<p>Halo Santri</p>',
    })

    expect(res.success).toBe(true)
    expect(res.simulated).toBe(true)
  })

  it('memanggil REST API Resend jika RESEND_API_KEY tersedia', async () => {
    process.env.RESEND_API_KEY = 're_test_12345'
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'email_resend_123' }),
    } as unknown as Response)

    const res = await kirimEmailNotifikasi({
      to: 'admin@pesantren.id',
      subject: 'Pemberitahuan Resmi',
      html: '<p>Teks pesan</p>',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer re_test_12345',
        }),
      })
    )
    expect(res.success).toBe(true)
    expect(res.id).toBe('email_resend_123')
  })
})
