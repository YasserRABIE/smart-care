import type { CollectionAfterChangeHook } from 'payload'

import { inquiryEmail } from '@/lib/email/inquiry-email'
import { env } from '@/lib/env'
import { relationId } from './validateProductCategory'

/**
 * Email the team about a new inquiry: to the product line's notify address, else the fallback
 * inbox, with reply-to set to the customer. Failures are logged, never thrown: the inquiry is
 * already saved and visible in the admin, so no lead is lost.
 */
export const sendInquiryEmail: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  const { payload } = req

  try {
    const [product, productLine] = await Promise.all([
      relationId(doc.product)
        ? payload.findByID({ collection: 'products', id: relationId(doc.product)!, depth: 0, req })
        : null,
      relationId(doc.productLine)
        ? payload.findByID({
            collection: 'product-lines',
            id: relationId(doc.productLine)!,
            depth: 0,
            req,
          })
        : null,
    ])

    const to = productLine?.notifyEmail || env.CONTACT_FALLBACK_EMAIL
    if (!to) {
      payload.logger.warn(
        { inquiry: doc.id },
        'Inquiry email skipped: no notifyEmail or CONTACT_FALLBACK_EMAIL',
      )
      return doc
    }

    const email = inquiryEmail({
      id: doc.id,
      name: doc.name,
      email: doc.email,
      subject: doc.subject,
      message: doc.message,
      productTitle: product?.title,
      productLineTitle: productLine?.title,
      sourcePage: doc.sourcePage,
      adminUrl: `${env.NEXT_PUBLIC_SITE_URL}/admin/collections/inquiries/${doc.id}`,
    })

    await payload.sendEmail({ to, replyTo: doc.email, ...email })
  } catch (error) {
    payload.logger.error({ err: error, inquiry: doc.id }, 'Failed to send inquiry email')
  }

  return doc
}
