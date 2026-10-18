import type { InquiryInput } from '@smart-care/shared'

import { whatsappHref } from '@/lib/contact-links'

export type InquiryProduct = { slug: string; title: string; lineTitle?: string }

/**
 * The prefilled WhatsApp message for an inquiry. Uses WhatsApp formatting (`*bold*`); the
 * visitor can still edit it in WhatsApp before sending.
 */
export function inquiryMessage(input: InquiryInput, product?: InquiryProduct | null) {
  const productLine = product
    ? `*Product:* ${product.title}${product.lineTitle ? ` (${product.lineTitle})` : ''}`
    : null

  return [
    'Hello Smart Care Medical,',
    '',
    `*Subject:* ${input.subject}`,
    productLine,
    `*Name:* ${input.name}`,
    input.email ? `*Email:* ${input.email}` : null,
    '',
    input.message,
  ]
    .filter((line) => line !== null)
    .join('\n')
}

/** Click-to-chat link that opens WhatsApp with the inquiry ready to send. */
export function inquiryWhatsappHref(
  whatsappNumber: string,
  input: InquiryInput,
  product?: InquiryProduct | null,
) {
  return whatsappHref(whatsappNumber, inquiryMessage(input, product))
}
