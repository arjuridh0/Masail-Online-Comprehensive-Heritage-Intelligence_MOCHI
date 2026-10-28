"use client"

import { useState, useMemo } from 'react'
import { Search, CheckCircle2, Clock, Building2, MapPin, Award } from 'lucide-react'

export interface RekapLembagaItem {
  nama: string
  nspp: string
  kota: string
  provinsi: string
  totalForum: number
  totalMasalah: number
  skorKeaktifan: number
  status: string
}

interface TabelRekapDitjenProps {
  data: RekapLembagaItem[]
}

export function TabelRekapDitjen({ data }: TabelRekapDitjenProps) {
  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'semua' | 'terverifikasi' | 'menunggu'>('semua')
  const [sortField, setSortField] = useState<'nama' | 'skor' | 'masalah'>('skor')

  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const cocokCari =
          item.nama.toLowerCase().includes(query.toLowerCase()) ||
          item.nspp.toLowerCase().includes(query.toLowerCase()) ||
          item.kota.toLowerCase().includes(query.toLowerCase()) ||
          item.provinsi.toLowerCase().includes(query.toLowerCase())

        const cocokStatus =
          filterStatus === 'semua' || item.status === filterStatus

        return cocokCari && cocokStatus
      })
      .sort((a, b) => {
        if (sortField === 'skor') return b.skorKeaktifan - a.skorKeaktifan
        if (sortField === 'masalah') return b.totalMasalah - a.totalMasalah
        return a.nama.localeCompare(b.nama)
      })
  }, [data, query, filterStatus, sortField])

  return (
    <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header Tabel & Kontrol Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E6DF]">
        <div>
          <h3 className="text-base font-bold text-[#1E3F30] flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#C9A96E]" />
            <span>Registri Lembaga Penyelenggara Bahtsul Masail</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Menampilkan {filteredData.length} dari total {data.length} lembaga pesantren tercatat ber-NSPP
          </p>
        </div>

        {/* Filter Tab & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-stone-200/60 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterStatus('semua')}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                filterStatus === 'semua'
                  ? 'bg-white text-[#1E3F30] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua ({data.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('terverifikasi')}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                filterStatus === 'terverifikasi'
                  ? 'bg-white text-[#1E3F30] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Terverifikasi ({data.filter((d) => d.status === 'terverifikasi').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('menunggu')}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                filterStatus === 'menunggu'
                  ? 'bg-white text-[#1E3F30] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Menunggu ({data.filter((d) => d.status === 'menunggu').length})
            </button>
          </div>
        </div>
      </div>

      {/* Input Pencarian & Pengurutan */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama pesantren, nomor NSPP, kota, atau provinsi..."
            className="w-full rounded-xl border border-[#D9D7CE] bg-white pl-10 pr-4 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:border-[#1E3F30] focus:ring-1 focus:ring-[#1E3F30] outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-stone-500">Urutkan:</span>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as 'nama' | 'skor' | 'masalah')}
            className="rounded-xl border border-[#D9D7CE] bg-white px-3 py-2 text-xs font-semibold text-stone-700 outline-hidden"
          >
            <option value="skor">Skor Keaktifan (Tertinggi)</option>
            <option value="masalah">Diktum Masail (Terbanyak)</option>
            <option value="nama">Nama Lembaga (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto rounded-xl border border-[#D9D7CE] bg-white">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-[#1E3F30] text-white">
            <tr>
              <th className="py-3 px-3.5 font-semibold">Nama Lembaga / Pesantren</th>
              <th className="py-3 px-3.5 font-semibold">NSPP Resmi</th>
              <th className="py-3 px-3.5 font-semibold">Domisili Wilayah</th>
              <th className="py-3 px-3 text-center font-semibold">Forum</th>
              <th className="py-3 px-3 text-center font-semibold">Masail</th>
              <th className="py-3 px-3.5 text-center font-semibold">Skor Aktivitas</th>
              <th className="py-3 px-3.5 text-center font-semibold">Status Kemenag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E6DF]">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-stone-500">
                  Tidak ditemukan data pesantren yang cocok dengan pencarian &ldquo;{query}&rdquo;.
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3 px-3.5">
                    <span className="font-bold text-[#1E3F30] block">{item.nama}</span>
                    <span className="text-[10px] text-stone-400">Penyelenggara Bahtsul Masail</span>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-[11px] text-stone-600">
                    {item.nspp !== '-' ? (
                      <span className="bg-stone-100 px-2 py-0.5 rounded font-medium border border-stone-200">
                        {item.nspp}
                      </span>
                    ) : (
                      <span className="text-stone-400 italic">Belum ada NSPP</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-1 text-stone-700">
                      <MapPin className="h-3 w-3 text-[#C9A96E] shrink-0" />
                      <span>{item.kota}, {item.provinsi}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-[#1E3F30]">
                    {item.totalForum}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-[#1E3F30]">
                    {item.totalMasalah}
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <span className="inline-flex items-center gap-1 font-black text-[#1E3F30] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#D9D7CE]">
                      <Award className="h-3 w-3 text-[#C9A96E]" />
                      <span>{item.skorKeaktifan}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'terverifikasi'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.status === 'terverifikasi' ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Clock className="h-3 w-3 text-amber-600" />
                      )}
                      <span className="capitalize">{item.status}</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TabelRekapDitjen
