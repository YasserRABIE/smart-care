'use client'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Button } from '@/components/ui/Button'
import { messages } from '@/messages/en'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = messages.error
  return (
    <Section className="py-24 lg:py-40">
      <Container className="flex flex-col items-center gap-8">
        <SectionHeading as="h1" align="center" title={t.title} description={t.description} />
        <Button onClick={reset}>{t.retry}</Button>
      </Container>
    </Section>
  )
}
