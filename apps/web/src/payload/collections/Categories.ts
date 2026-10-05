import { slugField, type CollectionConfig } from 'payload'

import { cacheTags } from '@/lib/data/tags'

import { anyone, authenticated } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  admin: {
    group: 'Catalog',
    useAsTitle: 'title',
    defaultColumns: ['title', 'productLine', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  // Products show their category badge and the chips count products per category.
  hooks: revalidateCollection(cacheTags.categories, cacheTags.products),
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'productLine',
      type: 'relationship',
      relationTo: 'product-lines',
      required: true,
      index: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
  ],
}
