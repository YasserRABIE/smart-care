import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'

import { Container } from '@/components/layout/Container'
import { PageBanner } from '@/components/layout/PageBanner'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Skeleton } from '@/components/ui/Skeleton'
import { ContactChannels } from '@/features/contact/ContactChannels'
import { ContactSidebar } from '@/features/contact/ContactSidebar'
import { FaqList } from '@/features/contact/FaqList'
import { InquiryForm } from '@/features/contact/InquiryForm'
import { LocationMap } from '@/features/contact/LocationMap'
import { PartnersStrip } from '@/features/partners/PartnersStrip'
import { JsonLd } from '@/components/seo/JsonLd'
import { productSubject } from '@/features/contact/subject'
import type { InquiryProduct } from '@/features/contact/whatsapp-message'
import { getProductBySlug } from '@/lib/data/catalog'
import { getContactPage, getFaqs, getPartners, getSiteSettings } from '@/lib/data/content'
import { mapQuery } from '@/lib/contact-links'
import { faqPageJsonLd } from '@/lib/seo/structured-data'
import { messages } from '@/messages/en'
import { toImage } from '@/lib/media'

export async function generateMetadata(): Promise<Metadata> {
  await connection()
  const page = await getContactPage()
  return {
    title: 'Contact',
    description: page.intro.body,
    alternates: { canonical: '/contact' },
    openGraph: { title: page.hero.title, description: page.intro.body, url: '/contact' },
  }
}

export default function ContactPage({ searchParams }: PageProps<'/contact'>) {
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <ContactContent searchParams={searchParams} />
    </Suspense>
  )
}

const SLUG = /^[a-z0-9-]{1,200}$/

async function ContactContent({ searchParams }: Pick<PageProps<'/contact'>, 'searchParams'>) {
  await connection()
  const { product: rawSlug } = await searchParams
  const slug = typeof rawSlug === 'string' && SLUG.test(rawSlug) ? rawSlug : undefined

  const [page, settings, faqs, partners, product] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
    getFaqs(),
    getPartners(),
    // "Send Inquiry" on a product links here with ?product=<slug>. Unknown slugs are ignored.
    slug ? getProductBySlug(slug) : null,
  ])

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqPageJsonLd(faqs)} />}
      <PageBanner
        variant="image"
        title={page.hero.title}
        imageSrc={toImage(page.hero.image)?.src}
      />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[25rem_1fr] lg:gap-16">
          <ContactSidebar intro={page.intro} />
          {/* Product "Send Inquiry" links land here (#inquiry). */}
          <div id="inquiry">
            <InquiryForm
              id="contact-inquiry"
              sourcePage="/contact"
              whatsappNumber={settings.whatsappNumber}
              product={product && inquiryProduct(product)}
              defaultSubject={
                product
                  ? productSubject(page.intro.productSubjectTemplate, product.title)
                  : undefined
              }
            />
          </div>
        </Container>
      </Section>

      <Section tone="tint" spacing="lg">
        <Container>
          <ContactChannels channels={page.channels} settings={settings} />
        </Container>
      </Section>

      <LocationMap query={mapQuery(settings)} title={messages.contact.mapTitle} />

      <Section>
        <Container className="flex flex-col gap-12">
          <SectionHeading
            align="center"
            eyebrow={page.sections.faqEyebrow}
            title={page.sections.faqTitle}
          />
          <FaqList faqs={faqs} />
        </Container>
      </Section>

      <Section spacing="none" className="pt-10 pb-20">
        <Container size="wide">
          <PartnersStrip
            partners={partners}
            title={page.sections.partnersTitle}
            titleVariant="caption"
          />
        </Container>
      </Section>
    </>
  )
}

function ContactSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-60 rounded-none bg-brand-900 lg:h-75" />
      <Container className="grid gap-12 py-25 lg:grid-cols-[25rem_1fr]">
        <Skeleton className="h-96" />
        <Skeleton className="h-120" />
      </Container>
    </div>
  )
}

function inquiryProduct(
  product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>,
): InquiryProduct {
  const line = typeof product.productLine === 'object' ? product.productLine : null
  return { slug: product.slug, title: product.title, lineTitle: line?.title }
}
