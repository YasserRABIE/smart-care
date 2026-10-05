import { z } from 'zod'

/**
 * Contact / "Send Inquiry" form payload, validated on the client and in the server action.
 * Placeholder for Phase 1; spam fields (honeypot, Turnstile token) are added in Phase 5.
 */
export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(120),
  email: z.email('Please enter a valid email address').max(254),
  subject: z.string().trim().min(3, 'Please add a subject').max(200),
  message: z.string().trim().min(10, 'Please write a short message').max(5000),
  product: z.string().trim().max(200).optional(),
})

export type InquiryInput = z.infer<typeof inquirySchema>
