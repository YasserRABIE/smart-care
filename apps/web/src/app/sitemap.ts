import type { MetadataRoute } from 'next'
import { connection } from 'next/server'

import { getProductLines } from '@/lib/data/catalog'
import { clientEnv } from '@/lib/env'

/** Built per request (from cached data) so it lists product lines without a DB at build time. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection()
  const base = clientEnv.NEXT_PUBLIC_SITE_URL
  const lines = await getProductLines()

  return [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/products`, changeFrequency: 'weekly', priority: 0.8 },
    ...lines.map((line) => ({
      url: `${base}/products/${line.slug}`,
      lastModified: new Date(line.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.6 },
  ]
}
