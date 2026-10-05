import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon } from '@/components/ui/icons'
import { messages } from '@/messages/en'

export default function NotFound() {
  const t = messages.notFound
  return (
    <Section className="py-24 lg:py-40">
      <Container className="flex flex-col items-center gap-8">
        <SectionHeading
          as="h1"
          align="center"
          size="lg"
          eyebrow="404"
          title={t.title}
          description={t.description}
        />
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">{t.backHome}</Button>
          <Button href="/products" variant="pill" trailingIcon={ArrowRightIcon}>
            {t.browseProducts}
          </Button>
        </div>
      </Container>
    </Section>
  )
}
