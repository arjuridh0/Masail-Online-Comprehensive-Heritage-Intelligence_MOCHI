"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Ban,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  RotateCcw,
  ShieldAlert,
  X,
  XCircle,
} from "lucide-react";
import {
  tangguhkanLembagaAction,
  reaktivasiLembagaAction,
  editLembagaAdminAction,
} from "@/app/admin/actions";

export interface LembagaItem {
  id: string;
  nama: string;
  slug: string;
  jenis: string;
  nspp: string | null;
  kota: string | null;
  provinsi: string | null;
  kontak_email: string | null;
  kontak_telepon: string | null;
  status: "menunggu" | "terverifikasi" | "ditolak" | "ditangguhkan";
  alasan_status: string | null;
  dibuat_pada: string;
}

export default function TabelKelolaLembaga({
  daftarLembaga,
}: {
  daftarLembaga: LembagaItem[];
}) {
  const [suspendModal, setSuspendModal] = useState<LembagaItem | null>(null);
  const [editModal, setEditModal] = useState<LembagaItem | null>(null);

  return (
    <div className="rounded-2xl border border-[#D9D3C3] bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-[#FAF8F2] border-b border-[#E8E2D2] text-[11px] font-bold text-[#1E3F30] uppercase">
            <tr>
              <th className="px-4 py-3">Nama Lembaga</th>
              <th className="px-4 py-3">Jenis</th>
              <th className="px-4 py-3">NSPP</th>
              <th className="px-4 py-3">Wilayah</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi Moderasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {daftarLembaga.map((lem) => {
              const isVerified = lem.status === "terverifikasi";
              const isPending = lem.status === "menunggu";
              const isRejected = lem.status === "ditolak";
              const isSuspended = lem.status === "ditangguhkan";

              return (
                <tr key={lem.id} className="hover:bg-stone-50/50">
                  <td className="px-4 py-3">
                    <strong className="text-stone-900 block font-semibold">
                      {lem.nama}
                    </strong>
                    <span className="text-[10px] text-stone-400 font-mono block">
                      {lem.kontak_email || "-"} • {lem.kontak_telepon || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {lem.jenis.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-stone-700">
                    {lem.nspp || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {lem.kota ? `${lem.kota}, ` : ""}{lem.provinsi || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Terverifikasi
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                        <Clock className="h-3 w-3 text-amber-600" />
                        Menunggu
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-800 border border-rose-200" title={lem.alasan_status || ""}>
                        <XCircle className="h-3 w-3 text-rose-600" />
                        Ditolak
                      </span>
                    )}
                    {isSuspended && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-900 border border-purple-200" title={lem.alasan_status || ""}>
                        <ShieldAlert className="h-3 w-3 text-purple-700" />
                        Ditangguhkan
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Tombol Edit */}
                      <button
                        type="button"
                        onClick={() => setEditModal(lem)}
                        className="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                        title="Edit Data Lembaga"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Tombol Blokir / Buka Blokir */}
                      {isVerified && (
                        <button
                          type="button"
                          onClick={() => setSuspendModal(lem)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                        >
                          <Ban className="h-3 w-3" />
                          <span>Blokir</span>
                        </button>
                      )}

                      {isSuspended && (
                        <form action={reaktivasiLembagaAction}>
                          <input type="hidden" name="lembaga_id" value={lem.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Buka Blokir</span>
                          </button>
                        </form>
                      )}

                      {isPending && (
                        <Link
                          href="/admin/verifikasi"
                          className="font-bold text-amber-800 hover:underline text-[11px]"
                        >
                          Tinjau &rarr;
                        </Link>
                      )}

                      {/* Lihat Profil Publik */}
                      {isVerified && (
                        <Link
                          href={`/lembaga/${lem.slug}`}
                          target="_blank"
                          className="p-1 rounded-md text-stone-400 hover:text-[#1E3F30] transition-colors"
                          title="Lihat Profil Publik"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL SUSPEND / BLOKIR LEMBAGA */}
      {suspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <Ban className="h-4 w-4" />
                <span>Tangguhkan / Blokir Lembaga</span>
              </div>
              <button
                type="button"
                onClick={() => setSuspendModal(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-stone-600 leading-relaxed">
              Anda akan menangguhkan akun <strong>{suspendModal.nama}</strong>. Lembaga yang ditangguhkan tidak dapat menerbitkan keputusan bahtsul masail baru ke publik.
            </p>

            <form
              action={async (formData) => {
                await tangguhkanLembagaAction(formData);
                setSuspendModal(null);
              }}
              className="mt-4 space-y-3"
            >
              <input type="hidden" name="lembaga_id" value={suspendModal.id} />
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Alasan Penangguhan Akun *
                </label>
                <textarea
                  name="alasan"
                  required
                  rows={3}
                  placeholder="Misal: Pelanggaran etika publikasi, dokumen izin operasional dicabut, dll..."
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-rose-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSuspendModal(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-600 hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-700 text-xs font-bold text-white hover:bg-rose-800"
                >
                  Tangguhkan Lembaga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT DATA LEMBAGA */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 text-[#1E3F30] font-bold text-sm">
                <Edit2 className="h-4 w-4" />
                <span>Edit Identitas Lembaga (Admin Pusat)</span>
              </div>
              <button
                type="button"
                onClick={() => setEditModal(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              action={async (formData) => {
                await editLembagaAdminAction(formData);
                setEditModal(null);
              }}
              className="mt-4 space-y-3"
            >
              <input type="hidden" name="lembaga_id" value={editModal.id} />

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nama Resmi Lembaga *
                </label>
                <input
                  name="nama"
                  required
                  defaultValue={editModal.nama}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    NSPP (Nomor Statistik)
                  </label>
                  <input
                    name="nspp"
                    defaultValue={editModal.nspp || ""}
                    placeholder="12 digit angka"
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-900 font-mono focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Kabupaten / Kota *
                  </label>
                  <input
                    name="kota"
                    required
                    defaultValue={editModal.kota || ""}
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Provinsi *
                  </label>
                  <input
                    name="provinsi"
                    required
                    defaultValue={editModal.provinsi || ""}
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Kontak Telepon
                  </label>
                  <input
                    name="kontak_telepon"
                    defaultValue={editModal.kontak_telepon || ""}
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Email Kontak Resmi
                </label>
                <input
                  type="email"
                  name="kontak_email"
                  defaultValue={editModal.kontak_email || ""}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-600 hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#1E3F30] text-xs font-bold text-white hover:bg-[#2D5A46]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
