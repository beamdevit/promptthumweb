type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/**
 * Per-instance limiter. A single Railway replica serves all traffic today; if the
 * service is ever scaled out, move this to Postgres or Redis so the window is shared.
 */
export function checkRateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now }
  }

  bucket.count += 1
  return { allowed: true }
}

// Drop expired buckets so the map cannot grow without bound.
setInterval(
  () => {
    const now = Date.now()
    for (const [key, bucket] of buckets) {
      if (now > bucket.resetAt) buckets.delete(key)
    }
  },
  10 * 60 * 1000,
).unref?.()
