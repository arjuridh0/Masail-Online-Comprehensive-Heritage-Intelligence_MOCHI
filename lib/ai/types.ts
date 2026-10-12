export interface ChatSource {
  nomor: number // S1 -> 1, S2 -> 2
  masalahId: string
  kode: string
  judul: string
  slug: string
  lembagaNama: string
  forumNama: string
  kitabRujukan?: string
  ringkasan: string
  skor: number
}

export interface ChatStreamChunk {
  type: 'thought' | 'token' | 'sources' | 'done' | 'error'
  content?: string
  sources?: ChatSource[]
  error?: string
}

export interface EmbeddingResult {
  embedding: number[] // 768 dimensi
  tokenCount?: number
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIEmbeddingProvider {
  embedText(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>
}

export interface AIChatProvider {
  chatStream(
    messages: ChatMessage[],
    onToken: (token: string) => void
  ): Promise<string>
}