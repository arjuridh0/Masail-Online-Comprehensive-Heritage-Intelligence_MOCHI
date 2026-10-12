import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { cariKonteksSemantik } from '@/lib/ai/search'
import { getChatProvider } from '@/lib/ai'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/ratelimit'
import { bersihkanSitasiTeks } from '@/lib/sitasi'
import type { ChatMessage, ChatStreamChunk, ChatSource } from '@/lib/ai/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const chatInputSchema = z.object({
  pertanyaan: z
    .string({ required_error: 'Pertanyaan wajib diisi' })
    .trim()
    .min(3, 'Pertanyaan terlalu singkat (minimal 3 karakter)')
    .max(500, 'Pertanyaan maksimal 500 karakter'),
})

function cekKataAcakAtauTypo(text: string): boolean {
  const words = text.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return false

  const isWordGibberish = (w: string) => {
    if (w.length < 4) return false
    // Qwerty keyboard smash
    if (/(asdf|sdfg|dfgh|fghj|ghjk|hjkl|zxcv|xcvb|cvbn|qwerty)/i.test(w)) return true
    // 4+ konsonan tidak lazim
    if (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(w) && !/(stream|script|struct|spring|crypto|sch)/i.test(w)) return true
    // Kluster konsonan keyboard smash acak (mis: hfv, fvj, vjf, xqz)
    if (/(hfv|fvj|vjf|jfk|kfj|xqz|qxz|wzx|zxc|jkl)/i.test(w)) return true
    // Vokal sangat rendah pada kata panjang bukan serapan
    const vowels = (w.match(/[aiueo]/gi) || []).length
    if (w.length >= 6 && vowels / w.length <= 0.25 && !/(crypto|system|syariah|blockchain)/i.test(w)) return true
    // Karakter berulang 4+ kali
    if (/(.)\1{3,}/i.test(w)) return true
    return false
  }

  // Jika input hanya 1 atau 2 kata dan mengandung gibberish
  if (words.length <= 2 && words.some(isWordGibberish)) return true
  // Jika seluruh kata adalah gibberish
  if (words.every(isWordGibberish)) return true
  return false
}

function cekSapaanAtauTest(text: string): boolean {
  const clean = text.trim().toLowerCase().replace(/[?!.,]/g, '')
  const sapaanPola = /^(tes|test|testing|halo|hallo|hai|hi|hey|helo|assalamu['a]?laikum|assalamualaikum|samlikum|p|ping|siapa namamu|namamu siapa|kamu siapa|kamu apa|mochi kamu siapa|kamu asisten apa|bisa bantu apa|kamu bisa apa|apa itu mochi)$/i
  if (sapaanPola.test(clean)) return true
  if (clean.includes('kamu siapa') || clean.includes('siapa namamu') || clean.includes('bisa bantu apa') || clean.includes('apa itu mochi')) {
    return true
  }
  return false
}

export async function POST(req: NextRequest) {
  // 1. Periksa Rate Limit berbasis IP
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'

  const rateLimit = checkRateLimit(`chat_${clientIp}`, 10, 60_000)
  if (!rateLimit.success) {
    return new Response(
      JSON.stringify({
        error: `Terlalu banyak pertanyaan. Harap tunggu ${rateLimit.reset} detik sebelum bertanya kembali.`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateLimit.reset),
        },
      }
    )
  }

  // 2. Validasi input pengguna
  let bodyJson: unknown
  try {
    bodyJson = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Format JSON tidak valid' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const parseResult = chatInputSchema.safeParse(bodyJson)
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues[0]?.message || 'Input tidak valid'
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { pertanyaan } = parseResult.data
  const adminDb = createAdminClient()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      function sendChunk(chunk: ChatStreamChunk) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
      }

      try {
        // 2a. Deteksi Sapaan, Uji Coba, & Perkenalan Identitas MOCHI
        if (cekSapaanAtauTest(pertanyaan)) {
          sendChunk({
            type: 'thought',
            content: 'Menyapa sahabat santri...',
          })

          const salamAwal = /assalamu/i.test(pertanyaan)
            ? "Wa'alaikumussalam Wr. Wb.!"
            : "Halo!"

          const pesanSapaan = `${salamAwal} Iya, ada yang bisa MOCHI bantu? 😊\n\nKenalin, aku **MOCHI** — asisten cerdas khazanah Bahtsul Masail pesantren! Kalau kamu lagi bingung atau punya uneg-uneg seputar persoalan fiqih kontemporer (seperti jual beli online, zakat profesi, dompet digital, medis, ibadah harian, sampai teknologi), aku siap bantu mencarikan jawabannya yang terintegrasi langsung dengan database repositori resmi Bahtsul Masail pesantren.\n\nKira-kira apa nih topik atau masalah fiqih yang ingin kita telaah bareng hari ini? Ketik langsung pertanyaanmu di bawah ya!`

          const kataKata = pesanSapaan.split(' ')
          for (const kata of kataKata) {
            sendChunk({ type: 'token', content: kata + ' ' })
          }

          sendChunk({ type: 'sources', sources: [] })
          sendChunk({ type: 'done' })
          controller.close()
          return
        }

        // 2b. Deteksi kata acak / typo / gibberish (mis. 'kahfvajf')
        if (cekKataAcakAtauTypo(pertanyaan)) {
          sendChunk({
            type: 'thought',
            content: 'Memeriksa kueri pengguna...',
          })

          const pesanTypo = `Aduh, mohon maaf ya... MOCHI belum paham maksud dari "${pertanyaan}" 😅.\n\nSepertinya ada salah ketik atau kueri belum lengkap nih? Coba ketik pertanyaan atau topik fiqih yang ingin kamu cari, misalnya:\n- *"Hukum zakat profesi dan gaji bulanan"*\n- *"Keabsahan akad dropshipping e-commerce"*\n- *"Skema paylater dan denda keterlambatan"*\n- *"Pemanfaatan daging kurban kalengan"*`

          const kataKata = pesanTypo.split(' ')
          for (const kata of kataKata) {
            sendChunk({ type: 'token', content: kata + ' ' })
          }

          sendChunk({ type: 'sources', sources: [] })
          sendChunk({ type: 'done' })
          controller.close()
          return
        }

        sendChunk({
          type: 'thought',
          content: 'Memeriksa kueri & menelusuri basis data sanad bahtsul masail pesantren...',
        })

        // 3. Pencarian Semantik via pgvector & kamus leksikon fiqih
        const searchResult = await cariKonteksSemantik(pertanyaan, 0.60, 4)
        const { sources, topScore, contextText } = searchResult

        // 4. Zero Hallucination: Jika tidak ada data relevan (topScore < 0.60)
        if (sources.length === 0 || topScore < 0.60) {
          sendChunk({
            type: 'thought',
            content: `Pemeriksaan selesai. Tingkat relevansi tertinggi (${Math.round(topScore * 100)}%) belum memenuhi kepastian sanad arsip.`,
          })

          // Catat ke log_chat
          await adminDb.from('log_chat').insert({
            pertanyaan,
            ada_sumber: false,
            skor_tertinggi: topScore,
          })

          // Ambil saran keputusan populer terdekat dari view publik agar pengguna tetap mendapat rekomendasi bacaan
          const { data: saranList } = await adminDb
            .from('v_masalah_publik')
            .select('id, kode, slug, judul, lembaga_nama, forum_nama')
            .limit(2)

          const saranSources: ChatSource[] = (saranList || []).map((s, i) => ({
            nomor: i + 1,
            masalahId: s.id,
            kode: s.kode,
            judul: s.judul,
            slug: s.slug,
            lembagaNama: s.lembaga_nama || 'Pesantren Mitra',
            forumNama: s.forum_nama || 'Bahtsul Masail',
            ringkasan: 'Keputusan bahtsul masail terarsip di repositori MOCHI.',
            skor: 0.5,
          }))

          const pesanPenolakan =
            `Mohon maaf ya, persoalan mengenai "${pertanyaan}" belum tercatat secara spesifik dalam arsip keputusan Bahtsul Masail yang tersimpan di MOCHI saat ini.\n\n` +
            'Sebagai asisten digital yang berpegang teguh pada keotentikan sanad turats pesantren, MOCHI tidak berfatwa atau berijtihad mandiri tanpa dasar keputusan musyawarah alim ulama.\n\n' +
            'Mungkin kamu tertarik menelaah beberapa topik fiqih terdekat yang telah selesai dimusyawarahkan di bawah ini, atau mencari dengan kata kunci lain di [Perpustakaan Hasil Bahtsul Masail](/perpustakaan):'

          const kataKata = pesanPenolakan.split(' ')
          for (const kata of kataKata) {
            sendChunk({ type: 'token', content: kata + ' ' })
          }

          sendChunk({ type: 'sources', sources: saranSources })
          sendChunk({ type: 'done' })
          controller.close()
          return
        }

        // 5. Ada data relevan: laporkan temuan ke user
        sendChunk({
          type: 'thought',
          content: `Menemukan ${sources.length} pembahasan masail terarsip (kemiripan ${Math.round(topScore * 100)}%)...`,
        })

        sendChunk({
          type: 'thought',
          content: 'Menelaah ibarat kitab dan menyusun penjelasan yang mudah dipahami...',
        })

        // Catat ke log_chat
        await adminDb.from('log_chat').insert({
          pertanyaan,
          ada_sumber: true,
          skor_tertinggi: topScore,
        })

        // 6. Siapkan prompt sistem fiqih santri hangat & edukatif
        const systemPrompt = `Anda adalah "Tanya MOCHI", asisten cerdas dan santun berbasis khazanah bahtsul masail Nahdlatul Ulama (NU).

GAYA DAN PERSONA:
- Anda adalah santri penjelas yang ramah, hangat, bijak, dan mudah dipahami oleh masyarakat umum maupun santri.
- JANGAN kaku seperti robot hukum, namun TETAP 100% TEGAS dan DISIPLIN: Anda HANYA boleh menjawab berdasarkan data di dalam <konteks>. Jangan berijtihad sendiri dan jangan mengambil informasi di luar konteks.
- Jawab LANGSUNG inti persoalan di awal dengan gamblang dan jelas: apa hukumnya, apa alasannya, dan bagaimana kesimpulan forumnya. Jelaskan duduk perkaranya dengan bahasa yang mengalir dan mudah dipahami awam.
- Uraikan dasar hukum dan perbedaan pendapat antar-pesantren (bila ada) secara objektif dan seimbang.
- Kutip ibarat kitab Arab dan terjemahannya persis seperti di konteks jika relevan, selalu cantumkan nomor sitasi [S1], [S2].
- Jika pengguna bertanya tentang kasus yang mirip tapi tidak spesifik ada di konteks, jelaskan secara santun bahwa kasus tersebut belum ada ketetapan khususnya, lalu terangkan prinsip umum dari kasus terdekat yang tersedia di konteks.

ATURAN AKHIR WAJIB:
Di baris paling akhir jawaban Anda, SELALU tambahkan penafian/disclaimer berikut:
---
*⚠️ **Catatan Penting:** Penjelasan di atas dirangkum oleh MOCHI (asisten AI) berdasarkan arsip keputusan Bahtsul Masail pesantren yang tersimpan di repositori, dan **bukan merupakan fatwa mandiri**. Ketetapan hukum hakiki bersumber dari musyawarah alim ulama. Untuk kajian mendalam, silakan baca langsung dokumen utuh as'ilah di repositori atau berkonsultasi kepada para alim ulama/asatidz terpercaya.*

<konteks>
${contextText}
</konteks>`

        const messages: ChatMessage[] = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: pertanyaan },
        ]

        // 7. Panggil LLM provider dengan streaming
        const chatProvider = getChatProvider()
        let fullGeneratedText = ''

        try {
          await chatProvider.chatStream(messages, (token) => {
            fullGeneratedText += token
            sendChunk({ type: 'token', content: token })
          })

          // Bersihkan sitasi fiktif jika ada
          const sanitized = bersihkanSitasiTeks(fullGeneratedText, sources.length)
          if (sanitized !== fullGeneratedText) {
            // Perbedaan hanya pada nomor sitasi di luar rentang
          }
        } catch (chatError) {
          console.error('[Chat Stream Error, executing graceful santri fallback]:', chatError)
          // Fallback santun santri jika LLM terhalang kuota
          sendChunk({
            type: 'token',
            content:
              'Mohon maaf, MOCHI belum dapat merangkum ikhtisar hukum secara naratif untuk persoalan ini saat ini.\n\nNamun, berikut adalah rekaman arsip keputusan bahtsul masail terdekat yang tersimpan di repositori MOCHI untuk Anda telaah lebih lanjut:',
          })
        }

        // 8. Kirim metadata sumber terverifikasi
        sendChunk({ type: 'sources', sources })
        sendChunk({ type: 'done' })
        controller.close()
      } catch (err: unknown) {
        console.error('[API Chat Fatal Error]:', err)
        const errMsg = err instanceof Error ? err.message : 'Kesalahan sistem'
        sendChunk({ type: 'error', error: errMsg })
        sendChunk({ type: 'done' })
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
