import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'

export default function HomePage() {
  return (
    <Section>
      <Container size="wide">
        <SectionHeading
          as="h1"
          size="lg"
          eyebrow="Coming soon"
          title="Smart Care Medical"
          description="The home page is built in Phase 4."
        />
      </Container>
    </Section>
  )
}
