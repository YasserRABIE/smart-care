import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'

import { Container } from '@/components/layout/Container'
import { PageBanner } from '@/components/layout/PageBanner'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProductLinesGrid } from '@/features/home/ProductLinesGrid'
import { getProductLines } from '@/lib/data/catalog'
import { getHomePage } from '@/lib/data/content'
import { messages } from '@/messages/en'

export async function generateMetadata(): Promise<Metadata> {
  await connection()
  const home = await getHomePage()
  return {
    title: home.sections.productLinesTitle,
    description: home.sections.productsIntro,
    alternates: { canonical: '/products' },
    openGraph: {
      title: home.sections.productLinesTitle,
      description: home.sections.productsIntro,
      url: '/products',
    },
  }
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsContent />
    </Suspense>
  )
}

async function ProductsContent() {
  await connection()
  const [home, lines] = await Promise.all([getHomePage(), getProductLines()])

  return (
    <>
      <PageBanner
        variant="gradient"
        breadcrumbs={[
          { label: messages.common.home, href: '/' },
          { label: messages.common.products },
        ]}
        title={home.sections.productLinesTitle}
        description={home.sections.productsIntro}
      />
      <Container size="wide" className="pt-10 pb-20 lg:pb-40">
        <ProductLinesGrid lines={lines} headingLevel="h2" priority />
      </Container>
    </>
  )
}

function ProductsSkeleton() {
  return (
    <Container size="wide" className="py-10" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-12 w-80 max-w-full" />
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="aspect-400/523 rounded-xl" />
        ))}
      </div>
    </Container>
  )
}
