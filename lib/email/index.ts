export interface KirimEmailParams {
  to: string
  subject: string
  html: string
}

export interface KirimEmailResult {
  success: boolean
  id?: string
  error?: string
  simulated?: boolean
}

/**
 * Pengirim email notifikasi resmi MOCHI.
 * Menggunakan Resend REST API via native fetch (tanpa package tambahan).
 * Jika RESEND_API_KEY tidak dikonfigurasi, beralih ke simulasi log tanpa melempar error.
 */
export async function kirimEmailNotifikasi({
  to,
  subject,
  html,
}: KirimEmailParams): Promise<KirimEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.EMAIL_FROM || 'MOCHI <onboarding@resend.dev>'

  if (!apiKey) {
    console.info(`[Email Simulasi] Kepada: ${to} | Subjek: "${subject}"`)
    return { success: true, simulated: true }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error('[Resend Error]:', res.status, errBody)
      return { success: false, error: `Resend HTTP ${res.status}: ${errBody}` }
    }

    const data = (await res.json()) as { id?: string }
    return { success: true, id: data.id }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[Kirim Email Exception]:', msg)
    return { success: false, error: msg }
  }
}
