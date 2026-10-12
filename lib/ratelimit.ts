/**
 * MOCHI — In-memory Sliding Window Rate Limiter
 * Digunakan untuk proteksi endpoint publik (/api/chat, /api/search, /api/report)
 */

interface RateLimitRecord {
  timestamps: number[]
}

const cache = new Map<string, RateLimitRecord>()

// Bersihkan rekaman kedaluwarsa secara berkala
if (typeof setInterval !== 'undefined') {
  const interval = setInterval(() => {
    const now = Date.now()
    for (const [key, record] of cache.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 60_000)
      if (record.timestamps.length === 0) {
        cache.delete(key)
      }
    }
  }, 300_000)
  if (interval.unref) interval.unref()
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Periksa rate limit berdasarkan identifier (mis. IP atau hash)
 * @param identifier String unik pengakses (IP address atau session)
 * @param limit Batas maksimal permintaan (default 10)
 * @param windowMs Jendela waktu dalam milidetik (default 60_000 = 1 menit)
 */
export function checkRateLimit(
  identifier: string,
  limit = 10,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now()
  let record = cache.get(identifier)

  if (!record) {
    record = { timestamps: [] }
    cache.set(identifier, record)
  }

  // Saring hanya timestamp dalam window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs)

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0] || now
    const reset = Math.ceil((oldest + windowMs - now) / 1000)
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.max(1, reset),
    }
  }

  record.timestamps.push(now)
  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
    reset: Math.ceil(windowMs / 1000),
  }
}
