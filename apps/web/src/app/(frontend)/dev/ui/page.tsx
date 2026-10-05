import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Container } from '@/components/layout/Container'
import { PageBanner } from '@/components/layout/PageBanner'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Field } from '@/components/ui/Field'
import { IconCircle } from '@/components/ui/IconCircle'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  PhoneIcon,
} from '@/components/ui/icons'
import { Input, Textarea } from '@/components/ui/Input'
import { Pagination } from '@/components/ui/Pagination'
import { SearchInput } from '@/components/ui/SearchInput'

export const metadata: Metadata = {
  title: 'UI kit',
  robots: { index: false, follow: false },
}

/** Dev-only showcase of every primitive and state. Not available in production. */
export default async function UiKitPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; chip?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()

  const { page, chip = 'all' } = await searchParams
  const currentPage = Math.max(1, Number(page) || 1)

  return (
    <>
      <PageBanner
        variant="gradient"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'UI kit' }]}
        title="UI kit"
        description="Every primitive and state from the design system. Development only."
      />

      <Container className="flex flex-col gap-16 py-16">
        <Demo title="Typography">
          <div className="flex flex-col gap-4">
            <p className="font-display text-display-xl">Display xl 60/72</p>
            <p className="font-display text-display-lg">Display lg 48/60</p>
            <p className="font-display text-display-md">Display md 36/44</p>
            <p className="font-display text-display-sm">Display sm 30/38</p>
            <p className="font-display text-display-xs">Display xs 24/32</p>
            <p className="text-xl font-bold">Text xl bold 20/30</p>
            <p className="text-lg">Text lg 18/28</p>
            <p className="text-md text-fg-secondary">Text md 16/24, secondary</p>
            <p className="text-sm text-fg-tertiary">Text sm 14/20, tertiary</p>
            <p className="text-xs text-fg-quaternary">Text xs 12/18, quaternary</p>
            <Eyebrow>Eyebrow label</Eyebrow>
          </div>
        </Demo>

        <Demo title="Colors">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {[
              ['brand-50', 'bg-brand-50'],
              ['brand-500', 'bg-brand-500'],
              ['brand-600', 'bg-brand-600'],
              ['brand-700', 'bg-brand-700'],
              ['brand-900', 'bg-brand-900'],
              ['surface-muted', 'bg-surface-muted'],
              ['fg-primary', 'bg-fg-primary'],
              ['fg-secondary', 'bg-fg-secondary'],
              ['fg-tertiary', 'bg-fg-tertiary'],
              ['fg-quaternary', 'bg-fg-quaternary'],
              ['line', 'bg-line'],
              ['line-subtle', 'bg-line-subtle'],
              ['error-600', 'bg-error-600'],
              ['success-600', 'bg-success-600'],
            ].map(([name, className]) => (
              <div key={name} className="flex flex-col gap-2">
                <div className={`h-14 rounded-md border border-line-subtle ${className}`} />
                <span className="text-xs text-fg-tertiary">{name}</span>
              </div>
            ))}
          </div>
        </Demo>

        <Demo title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button trailingIcon={ArrowUpRightIcon}>Send Inquiry</Button>
            <Button href="/products" variant="pill" size="lg" trailingIcon={ArrowRightIcon}>
              Explore Products
            </Button>
            <Button href="/products" variant="link" trailingIcon={ArrowUpRightIcon}>
              Browse Instruments
            </Button>
            <Button variant="outline" size="sm">
              Outline sm
            </Button>
            <Button disabled trailingIcon={ArrowUpRightIcon}>
              Disabled
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl bg-brand-900 p-6">
            <Button href="/products" variant="pill" size="lg" trailingIcon={ArrowRightIcon}>
              Explore Products
            </Button>
            <Button href="/contact" variant="ghost" size="lg" trailingIcon={ArrowUpRightIcon}>
              Request Information
            </Button>
          </div>
          <div className="mt-4 max-w-xl">
            <Button fullWidth trailingIcon={ArrowUpRightIcon}>
              Send Inquiry (full width)
            </Button>
          </div>
        </Demo>

        <Demo title="Chips, search, badges">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                ['all', 'All Surgical Tools', 48],
                ['urology', 'Urology', 18],
                ['plastic', 'Plastic Surgery', 16],
                ['general', 'General & Innovation', 14],
              ].map(([value, label, count]) => (
                <Chip
                  key={value}
                  href={`/dev/ui?chip=${value}`}
                  label={String(label)}
                  count={Number(count)}
                  active={chip === value}
                />
              ))}
            </div>
            <SearchInput
              aria-label="Search instruments"
              placeholder="Search instruments..."
              wrapperClassName="w-full md:w-56"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Badge>Urology</Badge>
            <Badge>General &amp; Innovation</Badge>
            <Badge tone="neutral">Neutral</Badge>
          </div>
        </Demo>

        <Demo title="Form fields">
          <Card variant="muted" className="flex max-w-3xl flex-col gap-4 p-6 md:p-10">
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="demo-name" label="Full Name" required>
                {(p) => <Input {...p} placeholder="Ahmed Ali" />}
              </Field>
              <Field
                id="demo-email"
                label="Email Address"
                required
                error="Please enter a valid email address"
              >
                {(p) => <Input {...p} type="email" defaultValue="ahmed@" />}
              </Field>
            </div>
            <Field
              id="demo-subject"
              label="Subject"
              required
              hint="Mention the product if you have one in mind."
            >
              {(p) => <Input {...p} placeholder="How can we help you?" />}
            </Field>
            <Field id="demo-message" label="Message" required>
              {(p) => <Textarea {...p} placeholder="Type your message here..." />}
            </Field>
            <Field id="demo-disabled" label="Disabled">
              {(p) => <Input {...p} disabled placeholder="Not editable" />}
            </Field>
            <Button fullWidth trailingIcon={ArrowUpRightIcon}>
              Send Inquiry
            </Button>
          </Card>
        </Demo>

        <Demo title="Cards">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-5">
              <Badge>Urology</Badge>
              <p className="mt-4 text-xl font-bold">Outline card</p>
              <p className="mt-3 text-md text-fg-secondary">Product cards.</p>
            </Card>
            <Card variant="muted" className="flex min-h-48 flex-col justify-between px-6 py-5">
              <p className="flex items-end gap-3">
                <span className="font-display text-display-lg">12+</span>
                <span className="text-display-xs text-fg-tertiary">Years</span>
              </p>
              <p className="text-lg text-fg-tertiary">Muted card (stats).</p>
            </Card>
            <Card variant="plain" className="flex flex-col gap-6 border border-line-subtle p-8">
              <IconCircle icon={PhoneIcon} />
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Call Procurement</p>
                <p className="text-sm text-fg-secondary">+20 123 456 789</p>
                <p className="text-sm text-fg-tertiary">Sun–Thu 8:00 AM – 5:00 PM</p>
              </div>
            </Card>
          </div>
          <div className="mt-4 flex gap-3">
            <IconCircle icon={EnvelopeSimpleIcon} />
            <IconCircle icon={MapPinIcon} />
            <span className="inline-flex items-center gap-3 text-sm text-fg-secondary">
              <CheckIcon aria-hidden size={18} className="text-brand-600" />
              Check list item
            </span>
          </div>
        </Demo>

        <Demo title="Pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={3}
            getHref={(p) => `/dev/ui?page=${p}`}
          />
          <Pagination
            className="mt-8"
            currentPage={currentPage}
            totalPages={20}
            getHref={(p) => `/dev/ui?page=${p}`}
          />
        </Demo>

        <Demo title="Accordion">
          <Accordion className="mx-auto max-w-200">
            <AccordionItem
              name="faq"
              defaultOpen
              title="What medical & surgical products do you distribute?"
            >
              We supply a wide range of specialized surgical tools, urology instruments, sterile
              plastic surgery solutions, and advanced MedTech software across the MENA region.
            </AccordionItem>
            <AccordionItem name="faq" title="How can I request a physical sample or custom demo?">
              Specialists and procurement managers can request on-site clinical demonstrations via
              the contact form or by calling support.
            </AccordionItem>
          </Accordion>
        </Demo>
      </Container>

      <Section tone="tint">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Other Ways To Reach Us"
            title="Connect Directly with our Medical Units"
          />
        </Container>
      </Section>

      <PageBanner variant="image" title="Let's Talk About Your Surgical Needs" />
    </>
  )
}

function Demo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="border-b border-line-subtle pb-2 text-sm font-semibold tracking-wider text-fg-quaternary uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}
