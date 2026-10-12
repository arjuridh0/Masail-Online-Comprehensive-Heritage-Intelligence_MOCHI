"use client"

import React from 'react'
import { Download } from 'lucide-react'

interface TombolEksporCsvProps {
  data: Array<{
    nama: string
    nspp: string
    kota: string
    provinsi: string
    totalForum: number
    totalMasalah: number
    skorKeaktifan: number
    status: string
  }>
}

export function TombolEksporCsv({ data }: TombolEksporCsvProps) {
  function handleDownload() {
    const headers = [
      'Nama Lembaga / Pesantren',
      'NSPP Kemenag',
      'Kota/Kabupaten',
      'Provinsi',
      'Total Forum Terbit',
      'Total Keputusan Masail',
      'Skor Keaktifan',
      'Status Verifikasi',
    ]

    const rows = data.map((d) => [
      `"${d.nama.replace(/"/g, '""')}"`,
      `"${d.nspp || '-'}"`,
      `"${d.kota || '-'}"`,
      `"${d.provinsi || '-'}"`,
      d.totalForum,
      d.totalMasalah,
      d.skorKeaktifan,
      `"${d.status}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `rekapitulasi_mochi_ditjen_pesantren_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-xl bg-[#1E3F30] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#152e23] transition-all"
    >
      <Download className="h-4 w-4 text-[#C9A96E]" />
      <span>Unduh Rekapitulasi Nasional (CSV)</span>
    </button>
  )
}
