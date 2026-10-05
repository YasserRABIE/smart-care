import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { Catalog } from '@/features/catalog/Catalog'
import { CatalogSkeleton } from '@/features/catalog/CatalogSkeleton'
import { parseCatalogParams } from '@/features/catalog/params'
import { getProductLine } from '@/lib/data/catalog'

export async function generateMetadata({
  params,
}: PageProps<'/products/[line]'>): Promise<Metadata> {
  const { line: slug } = await params
  const line = await getProductLine(slug)
  if (!line) return {}
  return {
    title: line.seo?.title || line.title,
    description: line.seo?.description || line.description,
  }
}

/**
 * Catalog state lives in the URL (`?category=&q=&page=`), so everything below the shell renders
 * per request. Data comes from cached `lib/data` functions.
 */
export default function ProductLinePage(props: PageProps<'/products/[line]'>) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <ProductLineContent {...props} />
    </Suspense>
  )
}

async function ProductLineContent({ params, searchParams }: PageProps<'/products/[line]'>) {
  const [{ line: slug }, rawSearchParams] = await Promise.all([params, searchParams])
  const line = await getProductLine(slug)
  // Inside the streamed boundary, so this is a soft 404 (200 + noindex). See Phase 4 notes.
  if (!line) notFound()

  return <Catalog line={line} params={parseCatalogParams(rawSearchParams)} />
}
