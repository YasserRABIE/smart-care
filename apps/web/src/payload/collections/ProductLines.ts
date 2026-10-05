import { slugField, type CollectionConfig } from 'payload'

import { cacheTags } from '@/lib/data/tags'

import { anyone, authenticated } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const ProductLines: CollectionConfig = {
  slug: 'product-lines',
  labels: { singular: 'Product line', plural: 'Product lines' },
  admin: {
    group: 'Catalog',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'notifyEmail', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateCollection(cacheTags.productLines, cacheTags.categories, cacheTags.products),
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'Shown in the catalog banner under the title.' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'ctaLabel',
      type: 'text',
      required: true,
      defaultValue: 'Browse products',
      admin: { description: 'Link text on the home page card, e.g. "Browse Instruments".' },
    },
    {
      name: 'notifyEmail',
      type: 'email',
      admin: {
        description:
          'Inquiries about this line are emailed here. Leave empty to use the default inbox.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
    {
      name: 'catalog',
      label: 'Catalog page',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'allLabel',
              label: '"All" filter label',
              type: 'text',
              required: true,
              defaultValue: 'All products',
              admin: { description: 'For example "All Surgical Tools".' },
            },
            {
              name: 'searchPlaceholder',
              type: 'text',
              required: true,
              defaultValue: 'Search products...',
            },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
