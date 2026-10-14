export interface PendaftaranAdminParams {
  namaLembaga: string
  jenis: string
  kota: string
  provinsi: string
  namaPj: string
  emailPj: string
  teleponPj: string
  adminUrl?: string
}

export interface LembagaDisetujuiParams {
  namaLembaga: string
  namaPj: string
  loginUrl?: string
}

export interface LembagaDitolakParams {
  namaLembaga: string
  namaPj: string
  alasan: string
  daftarUrl?: string
}

export function templatePendaftaranBaruAdmin(p: PendaftaranAdminParams) {
  const adminUrl =
    p.adminUrl ||
    `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://mochi.pesantren.id').replace(/\/$/, '')}/admin/verifikasi`

  return {
    subject: `[MOCHI] Pendaftaran Lembaga Baru: ${p.namaLembaga}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #E5E3DC; border-radius: 16px; background-color: #FAF8F2;">
        <h2 style="color: #1E3F30; margin-top: 0;">Pendaftaran Lembaga Baru</h2>
        <p style="color: #57534E; font-size: 14px; line-height: 1.6;">
          Terdapat permohonan pendaftaran lembaga baru yang menunggu verifikasi admin MOCHI:
        </p>
        <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #E5E3DC; margin: 16px 0; font-size: 13px; color: #292524; line-height: 1.8;">
          <strong>Nama Lembaga:</strong> ${p.namaLembaga}<br/>
          <strong>Jenis:</strong> ${p.jenis}<br/>
          <strong>Wilayah:</strong> ${p.kota}, ${p.provinsi}<br/>
          <strong>Penanggung Jawab:</strong> ${p.namaPj} (${p.emailPj})<br/>
          <strong>Kontak:</strong> ${p.teleponPj}
        </div>
        <a href="${adminUrl}" style="display: inline-block; background-color: #1E3F30; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 24px; font-weight: bold; font-size: 13px;">
          Buka Antrean Verifikasi &rarr;
        </a>
      </div>
    `.trim(),
  }
}

export function templateLembagaDisetujui(p: LembagaDisetujuiParams) {
  const loginUrl =
    p.loginUrl ||
    `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://mochi.pesantren.id').replace(/\/$/, '')}/masuk`

  return {
    subject: `[MOCHI] Akun Lembaga Anda Telah Diverifikasi ✓`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #D1FAE5; border-radius: 16px; background-color: #F0FDF4;">
        <h2 style="color: #065F46; margin-top: 0;">Selamat, Akun Anda Telah Diverifikasi!</h2>
        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
          Assalamu'alaikum Wr. Wb. Yth. <strong>${p.namaPj}</strong> (${p.namaLembaga}),
        </p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
          Permohonan pendaftaran lembaga Anda di platform <strong>MOCHI (Masail Online & Comprehensive Heritage Intelligence)</strong> telah disetujui oleh Administrator Pusat.
        </p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
          Lembaga Anda kini memiliki hak resmi untuk mencatat, mengelola, dan menerbitkan hasil keputusan Bahtsul Masail ke repositori digital nasional.
        </p>
        <div style="margin: 24px 0;">
          <a href="${loginUrl}" style="display: inline-block; background-color: #047857; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 24px; font-weight: bold; font-size: 14px;">
            Masuk ke Dasbor Lembaga &rarr;
          </a>
        </div>
        <p style="color: #6B7280; font-size: 12px;">
          Gunakan alamat email dan kata sandi yang Anda daftarkan sebelumnya.
        </p>
      </div>
    `.trim(),
  }
}

export function templateLembagaDitolak(p: LembagaDitolakParams) {
  const daftarUrl =
    p.daftarUrl ||
    `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://mochi.pesantren.id').replace(/\/$/, '')}/daftar`

  return {
    subject: `[MOCHI] Informasi Status Pendaftaran Lembaga`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #FEE2E2; border-radius: 16px; background-color: #FEF2F2;">
        <h2 style="color: #991B1B; margin-top: 0;">Pemberitahuan Status Pendaftaran</h2>
        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
          Yth. <strong>${p.namaPj}</strong> (${p.namaLembaga}),
        </p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
          Mohon maaf, permohonan pendaftaran lembaga Anda di MOCHI belum dapat disetujui dengan catatan verifikasi berikut:
        </p>
        <div style="background-color: #ffffff; padding: 14px 16px; border-radius: 10px; border-left: 4px solid #DC2626; margin: 16px 0; font-size: 13px; color: #7F1D1D; font-style: italic;">
          "${p.alasan}"
        </div>
        <p style="color: #374151; font-size: 13px; line-height: 1.6;">
          Anda dapat melengkapi persyaratan dan mengajukan pendaftaran ulang melalui tautan berikut:
        </p>
        <a href="${daftarUrl}" style="display: inline-block; background-color: #B91C1C; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 24px; font-weight: bold; font-size: 13px;">
          Daftar Ulang &rarr;
        </a>
      </div>
    `.trim(),
  }
}
