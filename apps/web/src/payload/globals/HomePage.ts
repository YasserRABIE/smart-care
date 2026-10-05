import type { GlobalConfig } from 'payload'

import { cacheTags } from '@/lib/data/tags'

import { anyone, authenticated } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: { group: 'Pages' },
  access: { read: anyone, update: authenticated },
  hooks: revalidateGlobal(cacheTags.homePage),
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'Hero',
          fields: [
            { name: 'title', type: 'textarea', required: true },
            { name: 'subtitle', type: 'textarea', required: true },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryCtaLabel',
                  label: 'Products button',
                  type: 'text',
                  required: true,
                  defaultValue: 'Explore Products',
                },
                {
                  name: 'secondaryCtaLabel',
                  label: 'Contact button',
                  type: 'text',
                  required: true,
                  defaultValue: 'Request Information',
                },
              ],
            },
          ],
        },
        {
          name: 'about',
          label: 'About & stats',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'intro', type: 'textarea', required: true },
            {
              name: 'stats',
              type: 'array',
              minRows: 1,
              maxRows: 6,
              admin: {
                description: 'Up to six. The grid alternates wide and narrow cards.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                      admin: { description: 'For example "500+".' },
                    },
                    { name: 'label', type: 'text', required: true },
                  ],
                },
                { name: 'description', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          name: 'sections',
          label: 'Section headings',
          fields: [
            { name: 'productLinesTitle', type: 'text', required: true },
            { name: 'partnersTitle', type: 'text', required: true },
            { name: 'contactTitle', type: 'text', required: true },
            { name: 'contactIntro', type: 'textarea', required: true },
            {
              name: 'whatsappLabel',
              type: 'text',
              required: true,
              defaultValue: 'Chat on WhatsApp',
            },
          ],
        },
      ],
    },
  ],
}
