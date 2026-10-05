'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/data/payload'
import { clientIp } from '@/lib/client-ip'
import { env } from '@/lib/env'
import { createRateLimiter } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'

import { handleInquiry, type InquiryFormState } from './handle-inquiry'

// 5 inquiries per IP per 10 minutes, shared by every request this server process handles.
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 })

const FIELDS = ['name', 'email', 'subject', 'message', 'product', 'sourcePage', 'website'] as const

/** Thin server action: collect the fields, wire real dependencies, delegate to handleInquiry. */
export async function submitInquiry(_previous: InquiryFormState, formData: FormData) {
  const raw: Record<string, string | undefined> = Object.fromEntries(
    FIELDS.map((field) => [field, formData.get(field)?.toString()]),
  )
  // The Turnstile widget adds this hidden input to the form.
  raw.turnstileToken = formData.get('cf-turnstile-response')?.toString()

  const secret = env.TURNSTILE_SECRET_KEY
  return handleInquiry(raw, {
    payload: await getPayloadClient(),
    ip: clientIp(await headers()),
    rateLimit: (key) => limiter.check(key),
    verifyTurnstile: secret ? (token, ip) => verifyTurnstile({ token, secret, ip }) : undefined,
  })
}
