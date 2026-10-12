import { z } from 'zod'

export const TOPIK_OPTIONS = ['ibadah', 'muamalah', 'munakahat'] as const
export const CORAK_OPTIONS = ['waqi_iyyah', 'maudhu_iyyah', 'qanuniyyah'] as const

export const rujukanInputSchema = z.object({
  id: z.string().optional(),
  kitab_id: z.string().uuid().nullable().optional(),
  kitab_teks: z.string().min(2, 'Nama kitab rujukan minimal 2 karakter'),
  juz: z.string().optional().default(''),
  halaman: z.string().optional().default(''),
  teks_arab: z.string().min(3, 'Teks Arab ibarat minimal 3 karakter'),
  terjemah: z.string().optional().default(''),
  urutan: z.number().int().default(1),
})

export const pertanyaanInputSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, 'Label pertanyaan wajib diisi (misal: a, b)').default('a'),
  teks: z.string().min(5, 'Teks pertanyaan (as-ilah) minimal 5 karakter'),
  jawaban: z.string().min(10, 'Diktum jawaban hukum minimal 10 karakter'),
  urutan: z.number().int().default(1),
  rujukan: z.array(rujukanInputSchema).default([]),
})

export const masalahInputSchema = z.object({
  id: z.string().optional(),
  kode: z.string().optional(),
  judul: z.string().min(5, 'Judul masalah minimal 5 karakter'),
  deskripsi: z.string().optional().default(''),
  topik: z.array(z.enum(TOPIK_OPTIONS)).min(1, 'Pilih minimal 1 topik masail'),
  corak: z.enum(CORAK_OPTIONS).default('waqi_iyyah'),
  kata_kunci: z.array(z.string()).default([]),
  urutan: z.number().int().default(1),
  pertanyaan: z.array(pertanyaanInputSchema).min(1, 'Setiap masalah wajib memiliki minimal 1 pertanyaan & jawaban'),
})

export const infoForumInputSchema = z.object({
  nama: z.string().optional().default(''),
  tuan_rumah: z.string().min(3, 'Tuan rumah atau penyelenggara minimal 3 karakter'),
  tanggal_mulai: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  tanggal_selesai: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD').optional().or(z.literal('')),
  tanggal_hijriah: z.string().optional().default(''),
  lokasi: z.string().optional().default(''),
  moderator: z.array(z.string()).default([]),
  pentashih: z.array(z.string()).default([]),
  perumus: z.array(z.string()).default([]),
})

export const wizardForumSchema = infoForumInputSchema.extend({
  id: z.string().optional(),
  status: z.enum(['draf', 'terbit']).default('draf'),
  masalah: z.array(masalahInputSchema).min(1, 'Forum wajib memiliki minimal 1 masalah masail'),
  dokumentasi: z.array(z.string().url('URL dokumentasi tidak valid')).default([]),
})

export type RujukanInput = z.infer<typeof rujukanInputSchema>
export type PertanyaanInput = z.infer<typeof pertanyaanInputSchema>
export type MasalahInput = z.infer<typeof masalahInputSchema>
export type InfoForumInput = z.infer<typeof infoForumInputSchema>
export type WizardForumInput = z.infer<typeof wizardForumSchema>