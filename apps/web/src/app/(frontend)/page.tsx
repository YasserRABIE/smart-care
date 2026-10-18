import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Skeleton } from '@/components/ui/Skeleton'
import { AboutStats } from '@/features/home/AboutStats'
import { GetInTouch } from '@/features/home/GetInTouch'
import { Hero } from '@/features/home/Hero'
import { ProductLinesGrid } from '@/features/home/ProductLinesGrid'
import { PartnersStrip } from '@/features/partners/PartnersStrip'
import { getProductLines } from '@/lib/data/catalog'
import { JsonLd } from '@/components/seo/JsonLd'
import { getHomePage, getPartners, getSiteSettings } from '@/lib/data/content'
import { clientEnv } from '@/lib/env'
import { toImage } from '@/lib/media'
import { organizationJsonLd } from '@/lib/seo/structured-data'

export async function generateMetadata(): Promise<Metadata> {
  await connection()
  const settings = await getSiteSettings()
  const shareImage = toImage(settings.seo.image)
  return {
    title: { absolute: settings.seo.title },
    description: settings.seo.description,
    alternates: { canonical: '/' },
    openGraph: {
      title: settings.seo.title,
      description: settings.seo.description,
      url: '/',
      ...(shareImage && { images: [{ url: shareImage.src, alt: shareImage.alt }] }),
    },
  }
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  )
}

async function HomeContent() {
  await connection()
  const [home, lines, partners, settings] = await Promise.all([
    getHomePage(),
    getProductLines(),
    getPartners(),
    getSiteSettings(),
  ])

  return (
    <>
      <JsonLd data={organizationJsonLd(settings, clientEnv.NEXT_PUBLIC_SITE_URL)} />
      <div className="px-4">
        <Hero hero={home.hero} />
      </div>

      <Section spacing="lg" className="pt-16 md:pt-20 lg:pt-40">
        <Container size="wide">
          <AboutStats about={home.about} />
        </Container>
      </Section>

      <Section spacing="lg" id="product-lines">
        <Container size="wide" className="flex flex-col gap-12">
          <h2 className="font-display text-display-md text-fg-primary md:text-display-lg">
            {home.sections.productLinesTitle}
          </h2>
          <ProductLinesGrid lines={lines} />
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="wide">
          <PartnersStrip partners={partners} title={home.sections.partnersTitle} />
        </Container>
      </Section>

      <Section spacing="lg" className="pb-20 lg:pb-40">
        <Container size="wide">
          <GetInTouch sections={home.sections} settings={settings} />
        </Container>
      </Section>
    </>
  )
}

function HomeSkeleton() {
  return (
    <Container size="wide" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-140 rounded-xl md:h-160 lg:h-192" />
      <div className="mt-16 grid gap-3 lg:mt-40 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </Container>
  )
}
