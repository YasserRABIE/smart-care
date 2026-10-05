import { z } from 'zod'

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined)

/**
 * The inquiry form payload. The client validates with it on submit for instant feedback; the
 * server action validates again and is the source of truth.
 */
export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(120, 'Name is too long'),
  email: z.email('Please enter a valid email address').max(254),
  subject: z.string().trim().min(3, 'Please add a subject').max(200, 'Subject is too long'),
  message: z
    .string()
    .trim()
    .min(10, 'Please write a little more (at least 10 characters)')
    .max(5000, 'Message is too long (5000 characters max)'),
  /** Product slug from `/contact?product=`. The server resolves it; ids are never trusted. */
  product: z
    .string()
    .regex(/^[a-z0-9-]{1,200}$/)
    .optional()
    .catch(undefined),
  /** Path of the page the form was sent from. */
  sourcePage: z
    .string()
    .regex(/^\/[\w\-/]*$/)
    .max(200)
    .optional()
    .catch(undefined),
  /** Honeypot: hidden from people, filled by bots. Checked by the server, never shown. */
  website: optionalText(500),
  /** Cloudflare Turnstile response token. */
  turnstileToken: optionalText(4096),
})

export type InquiryInput = z.infer<typeof inquirySchema>

/** Fields shown to the user, for mapping validation errors back onto inputs. */
export const inquiryFields = ['name', 'email', 'subject', 'message'] as const
export type InquiryField = (typeof inquiryFields)[number]
export type InquiryFieldErrors = Partial<Record<InquiryField, string>>

/** First error message per visible field. */
export function inquiryFieldErrors(error: z.ZodError): InquiryFieldErrors {
  const errors: InquiryFieldErrors = {}
  for (const issue of error.issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && (inquiryFields as readonly string[]).includes(field)) {
      errors[field as InquiryField] ??= issue.message
    }
  }
  return errors
}
