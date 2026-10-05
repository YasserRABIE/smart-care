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
import { getContactPage, getFaqs, getPartners, getSiteSettings } from '@/lib/data/content'
import { toImage } from '@/lib/media'

export async function generateMetadata(): Promise<Metadata> {
  await connection()
  const page = await getContactPage()
  return { title: 'Contact', description: page.intro.body }
}

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <ContactContent />
    </Suspense>
  )
}

async function ContactContent() {
  await connection()
  const [page, settings, faqs, partners] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
    getFaqs(),
    getPartners(),
  ])

  return (
    <>
      <PageBanner
        variant="image"
        title={page.hero.title}
        imageSrc={toImage(page.hero.image)?.src}
      />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[25rem_1fr] lg:gap-16">
          <ContactSidebar intro={page.intro} />
          <InquiryForm id="contact-inquiry" />
        </Container>
      </Section>

      <Section tone="tint" spacing="lg">
        <Container>
          <ContactChannels channels={page.channels} settings={settings} />
        </Container>
      </Section>

      <LocationMap image={page.map.image} mapUrl={settings.mapUrl} />

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
