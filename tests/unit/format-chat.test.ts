import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { FormatJawabanMochi } from '@/components/chat/FormatJawabanMochi'

describe('Komponen FormatJawabanMochi (Rendering Markdown & Visual Santri)', () => {
  it('merender teks kesimpulan dengan card khusus dan meniadakan asterik mentah', () => {
    const rawInput =
      '**Kesimpulan:**\n' +
      'Meskipun tidak ada fatwa spesifik untuk pekerja kilang, prinsip hukum yang berlaku adalah: **Boleh** melakukan jamak (dan qashar jika memenuhi syarat jarak) bagi pekerja kilang jika terdapat **masyaqqah berat** atau **hajat mendesak** yang menghalangi shalat pada waktunya, dengan syarat **tidak dijadikan kebiasaan rutin**.'

    const html = renderToString(React.createElement(FormatJawabanMochi, { content: rawInput }))

    // Memastikan tidak ada tanda bintang ganda ** yang bocor ke output
    expect(html).not.toContain('**Kesimpulan:**')
    expect(html).not.toContain('**Boleh**')
    expect(html).not.toContain('**masyaqqah berat**')
    expect(html).not.toContain('**')

    // Memastikan header Kesimpulan Hukum muncul
    expect(html).toContain('KESIMPULAN HUKUM')
    expect(html).toContain('Boleh')
    expect(html).toContain('masyaqqah berat')
  })

  it('menyorot status hukum fiqih (Boleh, Haram, Wajib) dengan badge khusus', () => {
    const input = 'Hukum transaksi ini adalah **Boleh** jika syarat terpenuhi, dan **Haram** jika terdapat riba.'
    const html = renderToString(React.createElement(FormatJawabanMochi, { content: input }))

    expect(html).not.toContain('**')
    expect(html).toContain('bg-emerald-100') // Badge Boleh
    expect(html).toContain('bg-rose-100') // Badge Haram
  })

  it('merender daftar tidak berurutan (bullet list) dengan rapi', () => {
    const input =
      'Syarat jamak shalat:\n' +
      '- Berniat jamak saat takbiratul ihram\n' +
      '- Muwalah (berturut-turut)\n' +
      '- Adanya hajat atau uzur syar’i'

    const html = renderToString(React.createElement(FormatJawabanMochi, { content: input }))

    expect(html).toContain('<ul')
    expect(html).toContain('<li')
    expect(html).toContain('Berniat jamak')
  })

  it('merender daftar berurutan (numbered list) dengan nomor terstruktur', () => {
    const input =
      'Tahapan musyawarah:\n' +
      '1. Pengajuan masalah (as’ilah)\n' +
      '2. Pembahasan ibarat kitab\n' +
      '3. Pentashihan keputusan'

    const html = renderToString(React.createElement(FormatJawabanMochi, { content: input }))

    expect(html).toContain('<ol')
    expect(html).toContain('<li')
    expect(html).toContain('Pengajuan masalah')
  })

  it('merender teks ibarat turats Arab dengan arah RTL dan font Arab', () => {
    const input = 'قال الإمام النووي رحمه الله في المجموع: يجوز الجمع للحاجة لمن لا يتخذه عادة'
    const html = renderToString(React.createElement(FormatJawabanMochi, { content: input }))

    expect(html).toContain('dir="rtl"')
    expect(html).toContain('font-arabic')
  })

  it('merender sitasi [S1] sebagai badge rujukan sanad', () => {
    const input = 'Keputusan ini sejalan dengan musyawarah LBM PWNU [S1] dan rujukan [S2].'
    const html = renderToString(React.createElement(FormatJawabanMochi, { content: input }))

    expect(html).toContain('S1')
    expect(html).toContain('S2')
    expect(html).toContain('Rujukan Keputusan S1')
  })

  it('memisahkan dan membersihkan penafian catatan kaki LLM agar tidak ada asterik ganda bocor', () => {
    const input =
      'Penjelasan hukum umum di atas berlaku.\n\n' +
      '---\n' +
      '*⚠️ **Catatan Penting:** Penjelasan di atas dirangkum oleh MOCHI dan **bukan merupakan fatwa mandiri**.*'

    const html = renderToString(React.createElement(FormatJawabanMochi, { content: input }))

    expect(html).not.toContain('**')
    expect(html).not.toContain('---')
    expect(html).toContain('Catatan Rujukan:')
    expect(html).toContain('bukan merupakan fatwa mandiri')
  })

  it('menangani string kosong dan streaming aktif dengan aman', () => {
    const emptyHtml = renderToString(React.createElement(FormatJawabanMochi, { content: '' }))
    expect(emptyHtml).toBe('')

    const streamingHtml = renderToString(
      React.createElement(FormatJawabanMochi, { content: 'Sedang mengetik...', isStreaming: true })
    )
    expect(streamingHtml).toContain('animate-pulse')
  })
})
