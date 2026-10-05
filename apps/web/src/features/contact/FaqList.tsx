import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import type { Faq } from '@/payload-types'

export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null
  return (
    <Accordion className="mx-auto w-full max-w-200">
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.id} name="faq" title={faq.question} defaultOpen={index === 0}>
          {faq.answer}
        </AccordionItem>
      ))}
    </Accordion>
  )
}
