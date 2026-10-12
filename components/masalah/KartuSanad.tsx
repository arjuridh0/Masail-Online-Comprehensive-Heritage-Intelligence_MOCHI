import Link from 'next/link'
import {
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  MapPin,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react'
import { formatRentangTanggal } from '@/lib/sitasi'

export interface SanadMasalahData {
  lembaga: {
    nama: string
    slug: string
    kota?: string | null
    provinsi?: string | null
    nspp?: string | null
    status?: string | null
  }
  forum: {
    nama?: string | null
    slug: string
    tuan_rumah?: string | null
    tanggal_mulai: string
    tanggal_selesai?: string | null
    tanggal_hijriah?: string | null
    lokasi: string
    kota?: string | null
    provinsi?: string | null
    sumber_materi?: string | null
    moderator: string[]
    pentashih: string[]
    perumus: string[]
  }
}

interface KartuSanadProps {
  data: SanadMasalahData
  className?: string
}

export function KartuSanad({ data, className = '' }: KartuSanadProps) {
  const { lembaga, forum } = data

  return (
    <div
      className={`rounded-2xl border-l-4 border-l-[#C9A96E] border border-[#D9D3C3] bg-[#F7F5EE] p-5 shadow-sm ${className}`}
    >
      {/* Header Sanad */}
      <div className="flex items-center justify-between border-b border-[#E3DCB] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#C9A96E]" />
          <span className="text-xs font-bold tracking-widest text-[#1E3F30] uppercase">
            Sanad Masalah
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          Terverifikasi
        </span>
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Lembaga Penyelenggara */}
        <div>
          <span className="flex items-center gap-1.5 font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
            <Building2 className="h-3.5 w-3.5 text-[#1E3F30]" /> Lembaga Penyelenggara
          </span>
          <Link
            href={`/lembaga/${lembaga.slug}`}
            className="mt-1 block font-bold text-sm text-[#1E3F30] hover:underline"
          >
            {lembaga.nama}
          </Link>
          {lembaga.nspp && (
            <p className="text-[11px] text-stone-500 font-mono mt-0.5">
              NSPP: {lembaga.nspp}
            </p>
          )}
        </div>

        {/* Forum & Tuan Rumah */}
        <div className="border-t border-[#E8E2D2] pt-2.5">
          <span className="flex items-center gap-1.5 font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
            <FileText className="h-3.5 w-3.5 text-[#1E3F30]" /> Forum Bahtsul Masail
          </span>
          <Link
            href={`/forum/${forum.slug}`}
            className="mt-0.5 block font-semibold text-stone-900 hover:text-[#1E3F30] hover:underline"
          >
            {forum.nama || 'Forum Bahtsul Masail'}
          </Link>
          {forum.tuan_rumah && (
            <p className="text-stone-600 mt-0.5">
              Tuan Rumah: <span className="font-medium">{forum.tuan_rumah}</span>
            </p>
          )}
        </div>

        {/* Waktu & Lokasi */}
        <div className="border-t border-[#E8E2D2] pt-2.5 grid grid-cols-1 gap-2">
          <div>
            <span className="flex items-center gap-1.5 font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              <Calendar className="h-3.5 w-3.5 text-[#1E3F30]" /> Waktu Pelaksanaan
            </span>
            <p className="mt-0.5 font-medium text-stone-800">
              {formatRentangTanggal(forum.tanggal_mulai, forum.tanggal_selesai)}
            </p>
            {forum.tanggal_hijriah && (
              <p className="text-stone-600 font-medium">
                Hijriah: <span className="text-[#8C733E]">{forum.tanggal_hijriah}</span>
              </p>
            )}
          </div>

          <div>
            <span className="flex items-center gap-1.5 font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              <MapPin className="h-3.5 w-3.5 text-[#1E3F30]" /> Lokasi Sidang
            </span>
            <p className="mt-0.5 text-stone-800 font-medium">{forum.lokasi}</p>
          </div>
        </div>

        {/* Dewan Mushohhih / Pentashih */}
        {forum.pentashih && forum.pentashih.length > 0 && (
          <div className="border-t border-[#E8E2D2] pt-2.5">
            <span className="flex items-center gap-1.5 font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              <UserCheck className="h-3.5 w-3.5 text-emerald-700" /> Dewan Mushohhih / Pentashih
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {forum.pentashih.map((nama, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-[#ECE5D2] px-2 py-0.5 text-[11px] font-medium text-stone-800"
                >
                  {nama}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Perumus */}
        {forum.perumus && forum.perumus.length > 0 && (
          <div className="border-t border-[#E8E2D2] pt-2.5">
            <span className="flex items-center gap-1.5 font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              <Users className="h-3.5 w-3.5 text-[#1E3F30]" /> Perumus Masail
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {forum.perumus.map((nama, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-[#ECE5D2] px-2 py-0.5 text-[11px] font-medium text-stone-800"
                >
                  {nama}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Moderator */}
        {forum.moderator && forum.moderator.length > 0 && (
          <div className="border-t border-[#E8E2D2] pt-2.5">
            <span className="flex items-center gap-1.5 font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              Moderator Sidang
            </span>
            <p className="mt-0.5 text-stone-800 font-medium">
              {forum.moderator.join(', ')}
            </p>
          </div>
        )}

        {/* Sumber Materi */}
        {forum.sumber_materi && (
          <div className="border-t border-[#E8E2D2] pt-2.5">
            <span className="flex items-center gap-1.5 font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              Sumber As'ilah
            </span>
            <p className="mt-0.5 text-stone-700 italic">
              {forum.sumber_materi}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
