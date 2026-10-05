import type { CollectionConfig } from 'payload'

import { cacheTags } from '@/lib/data/tags'

import { anyone, authenticated } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Partner', plural: 'Partners' },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'url', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateCollection(cacheTags.partners),
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Transparent PNG or SVG works best.' },
    },
    {
      name: 'url',
      type: 'text',
      validate: (value: string | null | undefined) =>
        !value || /^https?:\/\/\S+$/.test(value) || 'Enter a full URL starting with https://',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
  ],
}
