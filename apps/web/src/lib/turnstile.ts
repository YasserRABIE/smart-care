const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/** Verify a Cloudflare Turnstile token on the server. Network failures count as "not verified". */
export async function verifyTurnstile({
  token,
  secret,
  ip,
}: {
  token: string | undefined
  secret: string
  ip?: string
}): Promise<boolean> {
  if (!token) return false
  const body = new URLSearchParams({ secret, response: token })
  if (ip && ip !== 'unknown') body.set('remoteip', ip)
  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return false
    const result = (await response.json()) as { success?: boolean }
    return result.success === true
  } catch {
    return false
  }
}
