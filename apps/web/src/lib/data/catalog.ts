import { cacheLife, cacheTag } from 'next/cache'
import type { Where } from 'payload'

import { getPayloadClient } from './payload'
import { cacheTags } from './tags'

export const PRODUCTS_PER_PAGE = 6

/** The Local API bypasses access control, so every product query must apply this itself. */
const published: Where = { _status: { equals: 'published' } }

export async function getProductLines() {
  'use cache'
  cacheTag(cacheTags.productLines, cacheTags.media)
  cacheLife('days')
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'product-lines',
    sort: 'order',
    depth: 1,
    limit: 20,
    pagination: false,
  })
  return docs
}

export async function getProductLine(slug: string) {
  'use cache'
  cacheTag(cacheTags.productLines, cacheTags.media)
  cacheLife('days')
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'product-lines',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

export type CategoryWithCount = { id: number; title: string; slug: string; count: number }

/** Categories of a line with their published product counts, plus the line total. */
export async function getCategoriesWithCounts(productLineId: number) {
  'use cache'
  cacheTag(cacheTags.categories, cacheTags.products)
  cacheLife('days')
  const payload = await getPayloadClient()

  const [{ docs: categories }, { totalDocs: total }] = await Promise.all([
    payload.find({
      collection: 'categories',
      where: { productLine: { equals: productLineId } },
      sort: 'order',
      depth: 0,
      limit: 100,
      pagination: false,
    }),
    payload.count({
      collection: 'products',
      where: { and: [published, { productLine: { equals: productLineId } }] },
    }),
  ])

  const withCounts: CategoryWithCount[] = await Promise.all(
    categories.map(async (category) => {
      const { totalDocs } = await payload.count({
        collection: 'products',
        where: { and: [published, { category: { equals: category.id } }] },
      })
      return { id: category.id, title: category.title, slug: category.slug, count: totalDocs }
    }),
  )

  return { total, categories: withCounts }
}

type ProductQuery = {
  productLineId: number
  categoryId?: number
  query?: string
  page: number
}

/** One page of published products for a line, optionally filtered by category and search. */
export async function getProducts({ productLineId, categoryId, query, page }: ProductQuery) {
  'use cache'
  cacheTag(cacheTags.products, cacheTags.categories, cacheTags.media)
  cacheLife('days')
  const payload = await getPayloadClient()

  const where: Where[] = [published, { productLine: { equals: productLineId } }]
  if (categoryId) where.push({ category: { equals: categoryId } })
  if (query) {
    where.push({ or: [{ title: { like: query } }, { description: { like: query } }] })
  }

  const result = await payload.find({
    collection: 'products',
    where: { and: where },
    sort: 'order',
    page,
    limit: PRODUCTS_PER_PAGE,
    depth: 1,
    select: { title: true, slug: true, description: true, image: true, category: true },
    populate: { categories: { title: true, slug: true } },
  })

  return {
    products: result.docs,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? page,
  }
}

/** A published product by slug, with its line (for the inquiry prefill). */
export async function getProductBySlug(slug: string) {
  'use cache'
  cacheTag(cacheTags.products, cacheTags.productLines)
  cacheLife('days')
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { and: [published, { slug: { equals: slug } }] },
    depth: 1,
    limit: 1,
    select: { title: true, slug: true, productLine: true },
    populate: { 'product-lines': { title: true, slug: true } },
  })
  return docs[0] ?? null
}
