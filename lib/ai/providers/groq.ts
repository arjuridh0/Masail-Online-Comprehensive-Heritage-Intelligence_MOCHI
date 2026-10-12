import type { AIChatProvider, ChatMessage } from '../types'

export class GroqAIProvider implements AIChatProvider {
  private apiKey: string
  private model: string

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || ''
    this.model = model || process.env.AI_CHAT_MODEL || 'qwen/qwen3.8-27b'
    if (!this.apiKey) {
      console.warn('[GroqAIProvider] GROQ_API_KEY tidak terdefinisi di environment server.')
    }
  }

  async chatStream(
    messages: ChatMessage[],
    onToken: (token: string) => void
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY tidak dikonfigurasi.')
    }

    const url = 'https://api.groq.com/openai/v1/chat/completions'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.2, // Rendah untuk kepatuhan fakta fiqih
        max_tokens: 1024,
        stream: true,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Groq API Error (${res.status}): ${errText}`)
    }

    if (!res.body) {
      throw new Error('Respon body Groq kosong.')
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let fullResponse = ''
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const dataStr = trimmed.slice(6)
        if (dataStr === '[DONE]') break

        try {
          const parsed = JSON.parse(dataStr)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) {
            fullResponse += content
            onToken(content)
          }
        } catch {
          // Abaikan partial json chunk
        }
      }
    }

    return fullResponse
  }
}