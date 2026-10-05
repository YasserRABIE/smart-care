type RateLimitResult = { ok: true } | { ok: false; retryAfterMs: number }

/**
 * In-memory sliding-window rate limiter. Fine for a single server process (one VPS container);
 * counts reset on restart. Use a shared store (Redis/Postgres) if the app ever runs on more
 * than one instance.
 */
export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 10_000,
}: {
  limit: number
  windowMs: number
  /** Cap on tracked keys so a flood of unique IPs cannot grow memory without bound. */
  maxKeys?: number
}) {
  const hits = new Map<string, number[]>()

  return {
    check(key: string, now = Date.now()): RateLimitResult {
      const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs)

      if (recent.length >= limit) {
        hits.set(key, recent)
        return { ok: false, retryAfterMs: windowMs - (now - (recent[0] as number)) }
      }

      recent.push(now)
      hits.delete(key) // re-insert so Map order tracks recency
      hits.set(key, recent)
      if (hits.size > maxKeys) {
        const oldest = hits.keys().next().value
        if (oldest !== undefined) hits.delete(oldest)
      }
      return { ok: true }
    },
  }
}
