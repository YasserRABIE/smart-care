import type { GlobalConfig } from 'payload'

import { cacheTags } from '@/lib/data/tags'

import { anyone, authenticated } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: authenticated },
  hooks: revalidateGlobal(cacheTags.siteSettings),
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact details',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', required: true },
                { name: 'email', type: 'email', required: true },
              ],
            },
            {
              name: 'whatsappNumber',
              label: 'WhatsApp number',
              type: 'text',
              required: true,
              admin: {
                description: 'Digits only, with the country code. For example 20123456789.',
              },
              validate: (value: string | null | undefined) =>
                (value && /^\d{8,15}$/.test(value)) ||
                'Use digits only, including the country code (8 to 15 digits).',
            },
            {
              name: 'workingHours',
              type: 'text',
              required: true,
              admin: { description: 'For example "Sun–Thu 8:00 AM – 5:00 PM".' },
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  required: true,
                  admin: { description: 'For example "Cairo Medical Hub, Sector 4".' },
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', required: true },
                    { name: 'country', type: 'text', required: true },
                  ],
                },
              ],
            },
            {
              name: 'mapLocation',
              label: 'Map location',
              type: 'text',
              admin: {
                description:
                  'What the map and "directions" links point to: an address, a place name, or coordinates like "30.0444,31.2357". Leave empty to use the address above.',
              },
            },
          ],
        },
        {
          name: 'seo',
          label: 'Default SEO',
          fields: [
            { name: 'siteName', type: 'text', required: true, defaultValue: 'Smart Care Medical' },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { description: 'Used on pages that do not set their own title.' },
            },
            { name: 'description', type: 'textarea', required: true },
            {
              name: 'image',
              label: 'Share image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Shown when the site is shared. 1200 × 630 works best.' },
            },
          ],
        },
      ],
    },
  ],
}
