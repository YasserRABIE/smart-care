import type { CollectionConfig } from 'payload'

import { hiddenFromEditors, isAdmin, nobody } from '../access'
import { sendInquiryEmail } from '../hooks/sendInquiryEmail'

/**
 * Created only by the contact form server action (Local API, `overrideAccess: true`).
 * Admins can read them and update the status; everything else is read-only.
 */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: {
    group: 'Inbox',
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'name', 'email', 'productLine', 'status', 'createdAt'],
    hidden: hiddenFromEditors,
  },
  defaultSort: '-createdAt',
  hooks: {
    afterChange: [sendInquiryEmail],
  },
  access: {
    create: nobody,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { readOnly: true } },
        { name: 'email', type: 'email', required: true, admin: { readOnly: true } },
      ],
    },
    { name: 'subject', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'message', type: 'textarea', required: true, admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          admin: { readOnly: true },
        },
        {
          name: 'productLine',
          type: 'relationship',
          relationTo: 'product-lines',
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'sourcePage',
      type: 'text',
      admin: { readOnly: true, description: 'The page the form was sent from.' },
    },
  ],
}
