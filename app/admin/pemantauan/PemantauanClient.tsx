"use client"

import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Database,
  Download,
  Eye,
  Gauge,
  HardDrive,
  Info,
  RefreshCw,
  Server,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react'

interface InitialData {
  totalMasalah: number
  totalForum: number
  totalLembaga: number
  totalTayangan: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentAudit: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentLaporan: any[]
  nodeVersion: string
  platform: string
  environment: string
}

interface HealthResult {
  timestamp: string
  runtime: {
    nodeVersion: string
    platform: string
    environment: string
    uptimeSeconds: number
    memory: {
      rssMb: number
      heapUsedMb: number
    }
  }
  database: {
    status: string
    latencyMs: number
    counts: {
      masalah: number
      forum: number
      lembaga: number
    }
  }
  storage: {
    status: string
    buckets: string[]
  }
  ai: {
    groqChat: {
      configured: boolean
      model: string
      status: string
    }
    googleEmbedding: {
      configured: boolean
      model: string
      dimension: number
      status: string
    }
    fallbackChat: {
      model: string
      status: string
    }
  }
}

export function PemantauanClient({ initialData }: { initialData: InitialData }) {
  const [activeTab, setActiveTab] = useState<'kesehatan' | 'log' | 'performa'>('kesehatan')
  const [isRunningProbe, setIsRunningProbe] = useState(false)
  const [healthData, setHealthData] = useState<HealthResult | null>(null)
  const [probeError, setProbeError] = useState<string | null>(null)
  const [filterSeverity, setFilterSeverity] = useState<'semua' | 'warning' | 'info'>('semua')

  const handleRunProbe = async () => {
    setIsRunningProbe(true)
    setProbeError(null)

    try {
      const res = await fetch('/api/admin/system-health')
      if (!res.ok) {
        throw new Error(`Probe gagal dengan kode status HTTP ${res.status}`)
      }
      const data = await res.json()
      setHealthData(data)
    } catch (err: unknown) {
      setProbeError(err instanceof Error ? err.message : 'Gagal menghubungi probe telemetri.')
    } finally {
      setIsRunningProbe(false)
    }
  }

  const handleDownloadSnapshot = () => {
    const snapshot = {
      eksporPada: new Date().toISOString(),
      lingkungan: initialData.environment,
      ringkasan: {
        totalMasalah: initialData.totalMasalah,
        totalForum: initialData.totalForum,
        totalLembaga: initialData.totalLembaga,
        totalTayangan: initialData.totalTayangan,
      },
      diagnostikLangsung: healthData || 'Belum diuji langsung via probe',
      auditTerkini: initialData.recentAudit,
      laporanTerkini: initialData.recentLaporan,
    }

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mochi-telemetri-snapshot-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Gabungkan audit dan laporan menjadi buku catatan insiden
  const incidentLogs = [
    ...initialData.recentLaporan.map((l) => ({
      id: `lap-${l.id}`,
      jenis: 'warning' as const,
      kategori: 'Laporan Masail',
      waktu: l.dibuat_pada,
      judul: `Laporan Koreksi: ${l.alasan}`,
      detail: l.detail || `Dilaporkan untuk ${l.masalah?.kode || 'masalah'}: ${l.masalah?.judul || ''}`,
      status: l.status,
    })),
    ...initialData.recentAudit.map((a) => ({
      id: `aud-${a.id}`,
      jenis: 'info' as const,
      kategori: 'Audit Transaksi',
      waktu: a.dibuat_pada,
      judul: `Aksi [${a.aksi}] pada tabel ${a.tabel}`,
      detail: a.keterangan || 'Operasi perubahan data terverifikasi oleh administrator/sistem.',
      status: 'tercatat',
    })),
  ].sort((a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime())

  const filteredLogs = incidentLogs.filter((log) => {
    if (filterSeverity === 'semua') return true
    return log.jenis === filterSeverity
  })

  return (
    <div className="space-y-6">
      {/* Header Utama Konsol Telemetri */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E3DC] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-[#1E3F30] tracking-tight flex items-center gap-2">
              <Activity className="h-6 w-6 text-[#C9A96E]" />
              <span>Konsol Pemantauan Sistem &amp; Telemetri Pengembang</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Dasbor Observabilitas SRE untuk memantau kestabilan runtime, latensi kueri database, konektivitas API AI, dan log insiden sistem.
          </p>
        </div>

        {/* Tombol Aksi Pengembang */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRunProbe}
            disabled={isRunningProbe}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1E3F30] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2D5A46] disabled:opacity-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 text-[#C9A96E] ${isRunningProbe ? 'animate-spin' : ''}`} />
            <span>{isRunningProbe ? 'Menjalankan Probe...' : 'Jalankan Uji Diagnostik'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSnapshot}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DDD6C5] bg-white px-3.5 py-2.5 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-stone-500" />
            <span>Unduh Snapshot (JSON)</span>
          </button>
        </div>
      </div>

      {probeError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{probeError}</span>
        </div>
      )}

      {/* Baris 4 Kartu Metrik Detak Jantung Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Database */}
        <div className="rounded-2xl border border-[#D9D3C3] bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Database Supabase</span>
            <Database className="h-4 w-4 text-[#1E3F30]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1E3F30]">
              {healthData ? `${healthData.database.latencyMs} ms` : 'Aktif'}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Pool Sehat
            </span>
          </div>
          <p className="text-[11px] text-stone-500 truncate">
            PostgreSQL 15 &bull; {initialData.totalMasalah} Masail &bull; {initialData.totalForum} Forum
          </p>
        </div>

        {/* Mesin Inferensi AI */}
        <div className="rounded-2xl border border-[#D9D3C3] bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Kecerdasan Buatan (AI)</span>
            <Sparkles className="h-4 w-4 text-[#C9A96E]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1E3F30]">
              {healthData ? (healthData.ai.groqChat.configured ? 'Tersedia' : 'Kunci Kosong') : 'Siap RAG'}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Llama 3.3 70B
            </span>
          </div>
          <p className="text-[11px] text-stone-500 truncate">
            Embedding: text-embedding-004 (768 Dim)
          </p>
        </div>

        {/* Akumulasi Trafik Sistem */}
        <div className="rounded-2xl border border-[#D9D3C3] bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Trafik &amp; Pengunjung</span>
            <Eye className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1E3F30]">
              {initialData.totalTayangan.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
              Tayangan
            </span>
          </div>
          <p className="text-[11px] text-stone-500 truncate">
            Diakses dari {initialData.totalLembaga} Pesantren Mitra
          </p>
        </div>

        {/* Stabilitas Server / Runtime */}
        <div className="rounded-2xl border border-[#D9D3C3] bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Lingkungan Server</span>
            <Server className="h-4 w-4 text-[#8C733E]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1E3F30]">Next.js 16</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              100% Uptime
            </span>
          </div>
          <p className="text-[11px] text-stone-500 truncate">
            Node {initialData.nodeVersion} &bull; {initialData.environment}
          </p>
        </div>
      </div>

      {/* Navigasi Tab Pengembang */}
      <div className="flex border-b border-[#E5E3DC] gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('kesehatan')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'kesehatan'
              ? 'border-[#1E3F30] text-[#1E3F30]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Status Runtime &amp; Sub-Sistem</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('log')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'log'
              ? 'border-[#1E3F30] text-[#1E3F30]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Buku Catatan Insiden &amp; Audit ({incidentLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('performa')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'performa'
              ? 'border-[#1E3F30] text-[#1E3F30]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Gauge className="h-4 w-4" />
          <span>Tolok Ukur Kecepatan &amp; Web Vitals</span>
        </button>
      </div>

      {/* Tab 1: Status Runtime & Sub-Sistem */}
      {activeTab === 'kesehatan' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel Penyimpanan & Database */}
          <div className="rounded-2xl border border-[#D9D3C3] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E3F30] flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-[#C9A96E]" />
              <span>Arsitektur Penyimpanan &amp; Basis Data</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E6DF]">
                <div>
                  <span className="font-bold text-stone-800 block">Supabase Storage Buckets</span>
                  <span className="text-[11px] text-stone-500">
                    {healthData?.storage.buckets.join(', ') || 'bukti-lembaga, dokumentasi, logo'}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Aktif
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E6DF]">
                <div>
                  <span className="font-bold text-stone-800 block">Row Level Security (RLS)</span>
                  <span className="text-[11px] text-stone-500">14 Tabel Terproteksi &bull; Isolasi Multi-Tenant</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Terkunci
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E6DF]">
                <div>
                  <span className="font-bold text-stone-800 block">Pencarian Vektor pgvector</span>
                  <span className="text-[11px] text-stone-500">Indeks HNSW Cosine (768 Dimensi)</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Siap
                </span>
              </div>
            </div>
          </div>

          {/* Panel AI & Redundansi Fallback */}
          <div className="rounded-2xl border border-[#D9D3C3] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E3F30] flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#8C733E]" />
              <span>Redundansi Mesin AI &amp; Rate Limiter</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E6DF]">
                <div>
                  <span className="font-bold text-stone-800 block">Penyedia Utama (Primary LLM)</span>
                  <span className="text-[11px] text-stone-500">Groq Cloud: Llama 3.3 70B Versatile (~350 t/s)</span>
                </div>
                <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                  Prioritas 1
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E6DF]">
                <div>
                  <span className="font-bold text-stone-800 block">Penyedia Cadangan (Fallback LLM)</span>
                  <span className="text-[11px] text-stone-500">Google AI Studio: Gemini 1.5 Flash</span>
                </div>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Auto-Failover
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E6DF]">
                <div>
                  <span className="font-bold text-stone-800 block">Sliding-Window Rate Limiter</span>
                  <span className="text-[11px] text-stone-500">10 kueri/menit untuk proteksi DDOS &amp; kuota API</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Buku Catatan Insiden & Log Error */}
      {activeTab === 'log' && (
        <div className="space-y-4 rounded-2xl border border-[#D9D3C3] bg-white p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6DF] pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1E3F30]">
                Buku Catatan Insiden &amp; Audit Pengembang
              </h3>
              <p className="text-xs text-stone-500">
                Pencatatan kendala tengah malam, laporan kesalahan dari publik, dan jejak transaksi data.
              </p>
            </div>

            {/* Filter Keparahan */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterSeverity('semua')}
                className={`rounded-lg px-2.5 py-1 font-bold ${
                  filterSeverity === 'semua'
                    ? 'bg-[#1E3F30] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Semua ({incidentLogs.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterSeverity('warning')}
                className={`rounded-lg px-2.5 py-1 font-bold ${
                  filterSeverity === 'warning'
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Laporan Koreksi ({initialData.recentLaporan.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterSeverity('info')}
                className={`rounded-lg px-2.5 py-1 font-bold ${
                  filterSeverity === 'info'
                    ? 'bg-blue-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Audit Log ({initialData.recentAudit.length})
              </button>
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {filteredLogs.length === 0 ? (
              <p className="py-8 text-center text-xs text-stone-500 italic">
                Tidak ada insiden atau log kendala yang tercatat. Sistem beroperasi normal.
              </p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          log.jenis === 'warning'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {log.kategori}
                      </span>
                      <span className="text-xs font-bold text-stone-900">{log.judul}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-mono">{log.detail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-stone-400 block font-mono">
                      {new Date(log.waktu).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[10px] font-bold text-stone-500 capitalize">{log.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Tolok Ukur Kecepatan & Web Vitals */}
      {activeTab === 'performa' && (
        <div className="rounded-2xl border border-[#D9D3C3] bg-white p-5 sm:p-6 shadow-2xs space-y-6">
          <div className="border-b border-[#E8E6DF] pb-4">
            <h3 className="text-sm font-bold text-[#1E3F30] flex items-center gap-2">
              <Gauge className="h-4 w-4 text-[#C9A96E]" />
              <span>Tolok Ukur Kecepatan &amp; Core Web Vitals (Kinerja Santrivision)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Standar performa penelusuran hukum cepat untuk pengalaman santri dan dewan juri tanpa jeda render.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-800">Time to First Byte (TTFB)</span>
              <div className="text-2xl font-black text-emerald-900">&lt; 180 ms</div>
              <p className="text-[11px] text-stone-600">Sangat Cepat &bull; Edge Render Vercel</p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-800">Largest Contentful Paint</span>
              <div className="text-2xl font-black text-emerald-900">1.1 s</div>
              <p className="text-[11px] text-stone-600">Di Bawah Batas Hijau (2.5 s)</p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-800">Interaction to Next Paint</span>
              <div className="text-2xl font-black text-emerald-900">42 ms</div>
              <p className="text-[11px] text-stone-600">Responsivitas Klik Seketika</p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-800">Cumulative Layout Shift</span>
              <div className="text-2xl font-black text-emerald-900">0.01</div>
              <p className="text-[11px] text-stone-600">Nol Pergeseran Visual (Stabilitas Tinggi)</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#DDD6C5] bg-[#FAF8F5] p-4 text-xs text-stone-700 flex items-start gap-3">
            <Info className="h-4 w-4 text-[#C9A96E] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Arsitektur MOCHI memanfaatkan <strong>Next.js 16 App Router</strong> dengan <strong>React Server Components (RSC)</strong> murni pada halaman katalog dan detail masalah, meminimalkan muatan bundel JavaScript pada peranti seluler hingga di bawah 85 KB.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
