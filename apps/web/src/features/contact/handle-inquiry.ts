import { inquiryFieldErrors, inquirySchema, type InquiryFieldErrors } from '@smart-care/shared'
import type { Payload } from 'payload'

import { relationId } from '@/payload/hooks/validateProductCategory'

export type InquiryFormValues = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>

export type InquiryFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | {
      status: 'error'
      message?: string
      fieldErrors?: InquiryFieldErrors
      /** Echoed back so fields keep their values after the form resets. */
      values?: InquiryFormValues
    }

export type InquiryDeps = {
  payload: Pick<Payload, 'find' | 'create' | 'logger'>
  ip: string
  rateLimit: (key: string) => { ok: boolean }
  /** Undefined when Turnstile is not configured (local development). */
  verifyTurnstile?: (token: string | undefined, ip: string) => Promise<boolean>
}

export const inquiryErrors = {
  rateLimited:
    'You have sent several messages in a short time. Please wait a few minutes and try again.',
  verification: 'We could not verify that you are human. Please try again.',
  server: 'Something went wrong while sending your message. Please try again, or call or email us.',
} as const

/** Raw form fields → inquiry. Order: honeypot, validation, rate limit, Turnstile, save. */
export async function handleInquiry(
  raw: Record<string, string | undefined>,
  deps: InquiryDeps,
): Promise<InquiryFormState> {
  const values: InquiryFormValues = {
    name: raw.name,
    email: raw.email,
    subject: raw.subject,
    message: raw.message,
  }

  // Bots fill the hidden field. Pretend it worked so they do not adapt.
  if (raw.website?.trim()) return { status: 'success' }

  const parsed = inquirySchema.safeParse(raw)
  if (!parsed.success) {
    return { status: 'error', fieldErrors: inquiryFieldErrors(parsed.error), values }
  }
  const input = parsed.data

  if (!deps.rateLimit(deps.ip).ok) {
    return { status: 'error', message: inquiryErrors.rateLimited, values }
  }

  if (deps.verifyTurnstile && !(await deps.verifyTurnstile(input.turnstileToken, deps.ip))) {
    return { status: 'error', message: inquiryErrors.verification, values }
  }

  try {
    // Resolve the product on the server; only published products can be attached.
    let product: number | undefined
    let productLine: number | undefined
    if (input.product) {
      const { docs } = await deps.payload.find({
        collection: 'products',
        where: { and: [{ slug: { equals: input.product } }, { _status: { equals: 'published' } }] },
        depth: 0,
        limit: 1,
      })
      const match = docs[0]
      if (match) {
        product = match.id
        productLine = relationId(match.productLine) as number | undefined
      }
    }

    await deps.payload.create({
      collection: 'inquiries',
      overrideAccess: true,
      data: {
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        product,
        productLine,
        sourcePage: input.sourcePage,
        status: 'new',
      },
    })
    return { status: 'success' }
  } catch (error) {
    deps.payload.logger.error({ err: error }, 'Failed to save inquiry')
    return { status: 'error', message: inquiryErrors.server, values }
  }
}
