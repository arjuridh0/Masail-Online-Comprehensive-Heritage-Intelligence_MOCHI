import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  BookOpen,
  FileEdit,
  ArrowRight,
  Calendar,
  ExternalLink,
  ShieldAlert,
  XCircle,
} from 'lucide-react'
import { getSesiPengguna } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = {
  title: 'Dasbor Lembaga | MOCHI',
}

export default async function DasborIndexPage() {
  const sesi = await getSesiPengguna()
  const lembaga = sesi?.lembaga

  const isVerified = lembaga?.status === 'terverifikasi'
  const isPending = lembaga?.status === 'menunggu'
  const isSuspended = lembaga?.status === 'ditangguhkan'
  const isRejected = lembaga?.status === 'ditolak'

  const adminDb = createAdminClient()

  // Ambil statistik & draf aktif lembaga
  const { data: daftarForum } = lembaga
    ? await adminDb
        .from('forum')
        .select(`
          id,
          slug,
          nama,
          tuan_rumah,
          tanggal_mulai,
          tanggal_hijriah,
          status,
          dibuat_pada,
          masalah ( id )
        `)
        .eq('lembaga_id', lembaga.id)
        .order('dibuat_pada', { ascending: false })
    : { data: [] }

  const forumTerbit = (daftarForum || []).filter((f) => f.status === 'terbit')
  const forumDraf = (daftarForum || []).filter((f) => f.status === 'draf')

  const totalMasalahTerbit = forumTerbit.reduce(
    (acc, f) => acc + (f.masalah?.length || 0),
    0
  )

  // Ambil laporan koreksi masyarakat terkait masail lembaga ini
  const { data: daftarLaporanLembaga } = lembaga
    ? await adminDb
        .from('laporan')
        .select(`
          id,
          alasan,
          detail,
          kontak,
          status,
          catatan_admin,
          dibuat_pada,
          masalah:masalah_id!inner (
            id,
            kode,
            judul,
            slug,
            forum:forum_id!inner (
              id,
              nama,
              lembaga_id
            )
          )
        `)
        .eq('masalah.forum.lembaga_id', lembaga.id)
        .order('dibuat_pada', { ascending: false })
        .limit(10)
    : { data: [] }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Sapaan Header & Tombol Utama */}
      <div className="rounded-3xl border border-[#D9D3C3] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Selamat Datang di Dasbor,
            </span>
            <h1 className="text-2xl font-black text-[#1E3F30] mt-0.5">
              {sesi?.nama || 'Pengelola Lembaga'}
            </h1>
            <p className="mt-1 text-xs text-stone-600">
              Pusat penerbitan dan arsip digital bahtsul masail untuk <strong>{lembaga?.nama || 'Pesantren Mitra'}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isVerified && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Lembaga Terverifikasi
              </span>
            )}
            {isPending && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                <Clock className="h-4 w-4 text-amber-600" />
                Menunggu Verifikasi
              </span>
            )}
            {isSuspended && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-800 border border-rose-200">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                Akun Ditangguhkan
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-800 border border-rose-200">
                <XCircle className="h-4 w-4 text-rose-600" />
                Pengajuan Ditolak
              </span>
            )}

            {isSuspended ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-200 px-4 py-2.5 text-xs font-bold text-stone-500 cursor-not-allowed shadow-none"
                title="Penerbitan dibekukan karena akun sedang ditangguhkan"
              >
                <Plus className="h-4 w-4" />
                <span>+ Buat Forum (Dibekukan)</span>
              </button>
            ) : (
              <Link
                href="/dasbor/forum/baru"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#162f24] shadow-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>+ Buat Forum Baru</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Kartu Status Penjelasan Transparan */}
      {isVerified && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 flex items-start gap-4 shadow-xs">
          <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800 shrink-0 mt-0.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-emerald-950">
              Lembaga Terverifikasi Resmi di MOCHI
            </h2>
            <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
              Lembaga Anda telah terdaftar dan terverifikasi secara resmi dengan nomor identitas/NSPP yang tervalidasi. Seluruh hasil forum Bahtsul Masail yang Anda terbitkan langsung masuk ke katalog repositori publik MOCHI dan dapat ditanyakan lewat AI Tanya MOCHI.
            </p>
          </div>
        </div>
      )}

      {isPending && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 flex items-start gap-4 shadow-xs">
          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-800 shrink-0 mt-0.5">
            <Clock className="h-5 w-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-amber-950">
              Pengajuan Akun Sedang Ditinjau Admin Pusat (Maks. 1×24 Jam)
            </h2>
            <p className="mt-1 text-xs text-amber-800 leading-relaxed">
              Berkas legalitas dan NSPP/SK Kepengurusan lembaga Anda sedang diverifikasi oleh Tim Kurasi MOCHI Kemenag. Anda tetap dapat mulai menyusun keputusan Bahtsul Masail dalam bentuk <strong>draf privat</strong> selagi menunggu persetujuan.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href="/dasbor/forum/baru"
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-800 text-white px-3 py-1.5 text-xs font-semibold hover:bg-amber-900 transition-colors"
              >
                <FileEdit className="h-3.5 w-3.5" />
                <span>Mulai Susun Draf Sekarang</span>
              </Link>
              <Link
                href="/dasbor/profil"
                className="text-xs font-semibold text-amber-900 underline hover:text-amber-950"
              >
                Cek Kelengkapan Profil &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {isSuspended && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-5 flex items-start gap-4 shadow-xs">
          <div className="rounded-xl bg-rose-100 p-2.5 text-rose-800 shrink-0 mt-0.5">
            <ShieldAlert className="h-5 w-5 text-rose-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-rose-950">
              Hak Penerbitan Masail Sedang Dibekukan Sementara
            </h2>
            <p className="mt-1 text-xs text-rose-900 leading-relaxed">
              Akun lembaga Anda ditangguhkan oleh Admin Pusat dengan catatan:{' '}
              <strong className="underline decoration-rose-400">
                &ldquo;{lembaga?.alasan_status || 'Pelanggaran ketentuan konten atau penyesuaian administratif'}&rdquo;
              </strong>
              . Selama masa penangguhan, pembuatan forum baru dinonaktifkan.
            </p>
            <p className="mt-2 text-xs text-rose-800">
              Untuk mengaktifkan kembali akun lembaga Anda, silakan hubungi tim kami via surel ke{' '}
              <a
                href="mailto:admin@mochi.pesantren.id"
                className="font-bold underline text-rose-950 hover:text-rose-900"
              >
                admin@mochi.pesantren.id
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 flex items-start gap-4 shadow-xs">
          <div className="rounded-xl bg-rose-100 p-2.5 text-rose-800 shrink-0 mt-0.5">
            <XCircle className="h-5 w-5 text-rose-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-rose-950">
              Permohonan Pendaftaran Lembaga Belum Disetujui
            </h2>
            <p className="mt-1 text-xs text-rose-900 leading-relaxed">
              Alasan dari Admin Pusat:{' '}
              <strong>&ldquo;{lembaga?.alasan_status || 'Dokumen legalitas atau identitas tidak valid/tidak terbaca'}&rdquo;</strong>.
              Silakan perbaiki data lembaga dan unggah ulang dokumen legalitas yang sah.
            </p>
            <div className="mt-3">
              <Link
                href="/dasbor/profil"
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-800 text-white px-3 py-1.5 text-xs font-semibold hover:bg-rose-900 transition-colors"
              >
                <span>Perbaiki Profil &amp; Dokumen &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Kartu Ringkasan Statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#D9D3C3] bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
            Forum Masail Terbit
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E3F30]">
              {forumTerbit.length}
            </span>
            <span className="text-xs text-stone-500 font-semibold">Forum Publik</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            {totalMasalahTerbit} keputusan masalah fiqih aktif
          </p>
        </div>

        <div className="rounded-2xl border border-[#D9D3C3] bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
            Draf Belum Terbit
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#8C733E]">
              {forumDraf.length}
            </span>
            <span className="text-xs text-stone-500 font-semibold">Draf Aktif</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Tersimpan aman & siap dilanjutkan
          </p>
        </div>

        <div className="rounded-2xl border border-[#D9D3C3] bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Nomor Statistik (NSPP)
            </span>
            <span className="font-mono text-base font-black text-stone-900 block mt-1">
              {lembaga?.nspp || 'Non-Pesantren'}
            </span>
            <p className="text-[11px] text-stone-500 mt-1">
              {lembaga?.kota || 'Jawa Timur'}
            </p>
          </div>
          <Link
            href="/dasbor/profil"
            className="mt-3 inline-block font-bold text-xs text-[#1E3F30] hover:underline"
          >
            Kelola Profil Lembaga &rarr;
          </Link>
        </div>
      </div>

      {/* Draf Aktif yang Belum Selesai */}
      {forumDraf.length > 0 && (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <FileEdit className="h-4 w-4 text-[#8C733E]" />
              <h2 className="text-sm font-black text-[#1E3F30]">
                Draf Keputusan yang Sedang Disusun ({forumDraf.length})
              </h2>
            </div>
            <Link
              href="/dasbor/forum?tab=draf"
              className="text-xs font-bold text-[#8C733E] hover:underline"
            >
              Lihat Semua Draf &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {forumDraf.slice(0, 4).map((draf) => (
              <div
                key={draf.id}
                className="rounded-2xl border border-stone-200 bg-[#FAF8F2] p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">
                    Draf Privat
                  </span>
                  <h3 className="text-xs font-bold text-stone-900 leading-snug line-clamp-1">
                    {draf.nama || `Forum ${draf.tuan_rumah}`}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1">
                    <Calendar className="h-3 w-3 text-stone-400" />
                    <span>{draf.tanggal_mulai}</span>
                    <span>·</span>
                    <span>{draf.masalah?.length || 0} Masalah</span>
                  </div>
                </div>

                <Link
                  href={`/dasbor/forum/${draf.id}/edit`}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-white border border-stone-300 px-3 py-1.5 text-xs font-bold text-stone-800 hover:bg-stone-50 transition-colors shadow-xs"
                >
                  <span>Lanjutkan di Wizard</span>
                  <ArrowRight className="h-3 w-3 text-stone-500" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catatan Koreksi & Masukan Pembaca (Community Peer-Review) */}
      {daftarLaporanLembaga && daftarLaporanLembaga.length > 0 && (
        <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-amber-100 p-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[#1E3F30]">
                  Catatan Koreksi &amp; Uji Publik Masail ({daftarLaporanLembaga.length})
                </h2>
                <p className="text-[11px] text-stone-500">
                  Masukan dari pembaca dan masyarakat terkait teks ibarat atau rujukan fatwa lembaga Anda.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800 border border-amber-200 self-start sm:self-auto">
              Perlu Peninjauan Dewan Pentashih
            </span>
          </div>

          <div className="space-y-3">
            {daftarLaporanLembaga.map((lap: any) => {
              const m = lap.masalah
              const tgl = new Date(lap.dibuat_pada).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })

              return (
                <div
                  key={lap.id}
                  className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-4 flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/70 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          lap.status === 'baru'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : lap.status === 'diproses'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : lap.status === 'selesai'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {lap.status === 'baru' && <Clock className="h-3 w-3" />}
                        {lap.status === 'diproses' && <AlertTriangle className="h-3 w-3" />}
                        {lap.status === 'selesai' && <CheckCircle2 className="h-3 w-3" />}
                        <span>{lap.status === 'baru' ? 'Baru Masuk' : lap.status === 'diproses' ? 'Sedang Ditinjau' : lap.status}</span>
                      </span>
                      <span className="text-[11px] text-stone-500">• {tgl}</span>
                      <span className="text-[11px] font-bold text-stone-700">
                        • Alasan: {lap.alasan.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {m && (
                      <Link
                        href={`/masalah/${m.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3F30] hover:underline"
                      >
                        <span>{m.kode} — {m.judul}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
                    <p className="font-semibold text-stone-800 text-[11px] mb-1">Catatan Pembaca:</p>
                    {lap.detail}
                  </div>

                  {lap.catatan_admin && (
                    <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
                      <span className="font-bold">Arahan Admin Pusat Kemenag:</span> {lap.catatan_admin}
                    </div>
                  )}

                  {m?.forum && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Link
                        href={`/dasbor/forum/${m.forum.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-stone-300 px-3.5 py-1.5 text-xs font-bold text-stone-800 hover:bg-stone-50 transition-colors shadow-2xs"
                      >
                        <FileEdit className="h-3.5 w-3.5 text-[#8C733E]" />
                        <span>Buka Editor Masalah untuk Penyesuaian</span>
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Akses Cepat ke Seluruh Arsip Forum */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#1E3F30]">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-900">Arsip Seluruh Forum</h3>
            <p className="text-[11px] text-stone-500">
              Kelola, edit, tarik dari publikasi, atau tinjau seluruh hasil keputusan musyawarah.
            </p>
          </div>
        </div>

        <Link
          href="/dasbor/forum"
          className="inline-flex items-center gap-1 rounded-xl bg-stone-100 hover:bg-stone-200 px-3.5 py-2 text-xs font-bold text-stone-800 transition-colors"
        >
          <span>Buka Arsip Forum</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}