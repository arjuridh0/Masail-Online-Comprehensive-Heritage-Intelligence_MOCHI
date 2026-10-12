import type { AIEmbeddingProvider, AIChatProvider, ChatMessage } from '../types'

export class GoogleAIProvider implements AIEmbeddingProvider, AIChatProvider {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_AI_API_KEY || ''
    if (!this.apiKey) {
      console.warn('[GoogleAIProvider] GOOGLE_AI_API_KEY tidak terdefinisi di environment server.')
    }
  }

  async embedText(text: string): Promise<number[]> {
    if (!this.apiKey) {
      throw new Error('GOOGLE_AI_API_KEY tidak dikonfigurasi.')
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${this.apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: {
          parts: [{ text: text.slice(0, 2048) }],
        },
        outputDimensionality: 768,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Google Embedding Error (${res.status}): ${errText}`)
    }

    const data = await res.json()
    const values = data?.embedding?.values
    if (!values || !Array.isArray(values)) {
      throw new Error('Format respon Google Embedding tidak valid.')
    }

    return values
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (!this.apiKey) {
      throw new Error('GOOGLE_AI_API_KEY tidak dikonfigurasi.')
    }

    if (texts.length === 0) return []

    // Google API batchEmbedContents mendukung hingga 100 teks per request
    const chunks = []
    const chunkSize = 20
    for (let i = 0; i < texts.length; i += chunkSize) {
      chunks.push(texts.slice(i, i + chunkSize))
    }

    const allEmbeddings: number[][] = []

    for (const chunk of chunks) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents?key=${this.apiKey}`
      const requests = chunk.map((t) => ({
        model: 'models/gemini-embedding-001',
        content: { parts: [{ text: t.slice(0, 2048) }] },
        outputDimensionality: 768,
      }))

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Google Batch Embedding Error (${res.status}): ${errText}`)
      }

      const data = await res.json()
      const items = data?.embeddings || []
      for (const item of items) {
        if (item?.values && Array.isArray(item.values)) {
          allEmbeddings.push(item.values)
        }
      }
    }

    return allEmbeddings
  }

  async chatStream(
    messages: ChatMessage[],
    onToken: (token: string) => void
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GOOGLE_AI_API_KEY tidak dikonfigurasi untuk fallback chat.')
    }

    // Format pesan untuk Gemini API
    const systemMsg = messages.find((m) => m.role === 'system')?.content || ''
    const conversation = messages.filter((m) => m.role !== 'system')

    const contents = conversation.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const fallbackModel = process.env.AI_FALLBACK_CHAT_MODEL || 'gemini-3.5-flash-lite'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${fallbackModel}:generateContent?key=${this.apiKey}`
    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    }

    if (systemMsg) {
      body.systemInstruction = {
        parts: [{ text: systemMsg }],
      }
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Gemini Fallback Chat Error (${res.status}): ${errText}`)
    }

    const data = await res.json()
    const fullText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (fullText) {
      onToken(fullText)
    }

    return fullText
  }
}