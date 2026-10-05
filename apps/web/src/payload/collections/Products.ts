import { slugField, type CollectionConfig } from 'payload'

import { cacheTags } from '@/lib/data/tags'

import { authenticated, publishedOrAuthenticated } from '../access'
import { revalidateCollection } from '../hooks/revalidate'
import { relationId, validateProductCategory } from '../hooks/validateProductCategory'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Product', plural: 'Products' },
  admin: {
    group: 'Catalog',
    useAsTitle: 'title',
    defaultColumns: ['title', 'productLine', 'category', '_status', 'order'],
    listSearchableFields: ['title', 'description'],
  },
  defaultSort: 'order',
  // Drafts: editors get Save draft / Publish, and the public API only returns published products.
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeValidate: [validateProductCategory],
    ...revalidateCollection(cacheTags.products),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: { description: 'One or two sentences shown on the product card.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'productLine',
          type: 'relationship',
          relationTo: 'product-lines',
          required: true,
          index: true,
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          index: true,
          // Only offer categories from the selected product line.
          filterOptions: ({ siblingData }) => {
            const productLine = relationId(
              (siblingData as { productLine?: number | { id: number } }).productLine,
            )
            return productLine ? { productLine: { equals: productLine } } : true
          },
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
  ],
}
