/**
 * The visitor's IP. In production Caddy sets `X-Forwarded-For`; the first entry is the client.
 * Falls back to a shared bucket so a missing header cannot bypass rate limiting entirely.
 */
export function clientIp(headers: Headers) {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headers.get('x-real-ip')?.trim() || 'unknown'
}
