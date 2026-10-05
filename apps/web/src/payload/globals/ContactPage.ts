import type { GlobalConfig } from 'payload'

import { cacheTags } from '@/lib/data/tags'

import { anyone, authenticated } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

/** Phone, email, address and hours come from Site settings; this holds the page copy. */
export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact page',
  admin: { group: 'Pages' },
  access: { read: anyone, update: authenticated },
  hooks: revalidateGlobal(cacheTags.contactPage),
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'Hero',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
          ],
        },
        {
          name: 'intro',
          label: 'Form sidebar',
          fields: [
            { name: 'eyebrow', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
            { name: 'expectTitle', type: 'text', required: true, defaultValue: 'What to expect' },
            {
              name: 'productSubjectTemplate',
              label: 'Subject for product inquiries',
              type: 'text',
              required: true,
              defaultValue: 'Needing help with {product}',
              admin: {
                description:
                  'Prefilled when a visitor clicks "Send Inquiry" on a product. {product} is replaced with the product name.',
              },
            },
            {
              name: 'expectations',
              type: 'array',
              minRows: 1,
              maxRows: 6,
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          name: 'channels',
          label: 'Contact cards',
          fields: [
            { name: 'eyebrow', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                { name: 'phoneTitle', type: 'text', required: true },
                { name: 'emailTitle', type: 'text', required: true },
                { name: 'addressTitle', type: 'text', required: true },
              ],
            },
            {
              name: 'emailNote',
              type: 'text',
              admin: { description: 'Small line under the email address.' },
            },
          ],
        },
        {
          name: 'sections',
          label: 'Section headings',
          fields: [
            { name: 'faqEyebrow', type: 'text', required: true },
            { name: 'faqTitle', type: 'text', required: true },
            { name: 'partnersTitle', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
