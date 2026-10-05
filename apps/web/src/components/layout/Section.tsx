import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

const sectionVariants = cva('', {
  variants: {
    spacing: {
      none: '',
      /** Contact page rhythm (80–100px). */
      md: 'py-14 md:py-20 lg:py-25',
      /** Home page rhythm (160px between sections). */
      lg: 'py-12 md:py-16 lg:py-20',
    },
    tone: {
      default: '',
      tint: 'bg-brand-50',
    },
  },
  defaultVariants: { spacing: 'md', tone: 'default' },
})

type SectionProps = ComponentPropsWithoutRef<'section'> & VariantProps<typeof sectionVariants>

export function Section({ spacing, tone, className, ...props }: SectionProps) {
  return <section className={cn(sectionVariants({ spacing, tone }), className)} {...props} />
}
