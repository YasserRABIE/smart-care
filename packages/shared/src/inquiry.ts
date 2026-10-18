import { z } from 'zod'

/**
 * The inquiry form. Validated in the browser before the visitor is handed off to WhatsApp with
 * the message prefilled; nothing is sent to our server.
 */
export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(120, 'Name is too long'),
  /** Optional: WhatsApp already shows the sender's phone number. */
  email: z
    .union([z.literal(''), z.email('Please enter a valid email address').max(254)])
    .optional()
    .transform((value) => value || undefined),
  subject: z.string().trim().min(3, 'Please add a subject').max(200, 'Subject is too long'),
  message: z
    .string()
    .trim()
    .min(10, 'Please write a little more (at least 10 characters)')
    .max(2000, 'Message is too long (2000 characters max)'),
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
