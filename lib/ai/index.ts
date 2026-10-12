import type { AIEmbeddingProvider, AIChatProvider, ChatMessage } from './types'
import { GoogleAIProvider } from './providers/google'
import { GroqAIProvider } from './providers/groq'

export * from './types'

export function getEmbeddingProvider(): AIEmbeddingProvider {
  return new GoogleAIProvider()
}

class ResilientChatProvider implements AIChatProvider {
  constructor(
    private primary: AIChatProvider,
    private fallback: AIChatProvider
  ) {}

  async chatStream(
    messages: ChatMessage[],
    onToken: (token: string) => void
  ): Promise<string> {
    try {
      return await this.primary.chatStream(messages, onToken)
    } catch (primaryErr) {
      console.warn('[ResilientChatProvider] Provider utama gagal, beralih ke fallback Gemini:', primaryErr)
      return await this.fallback.chatStream(messages, onToken)
    }
  }
}

export function getChatProvider(): AIChatProvider {
  const hasGroq = Boolean(process.env.GROQ_API_KEY)
  const hasGoogle = Boolean(process.env.GOOGLE_AI_API_KEY)

  if (hasGroq && hasGoogle) {
    return new ResilientChatProvider(new GroqAIProvider(), new GoogleAIProvider())
  }
  if (hasGroq) {
    return new GroqAIProvider()
  }
  return new GoogleAIProvider()
}