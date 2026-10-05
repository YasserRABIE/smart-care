import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-2xs font-semibold tracking-wider uppercase',
  {
    variants: {
      tone: {
        brand: 'bg-brand-50/95 text-brand-600',
        neutral: 'bg-surface-muted text-fg-secondary',
      },
    },
    defaultVariants: { tone: 'brand' },
  },
)

type BadgeProps = ComponentPropsWithoutRef<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ tone, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
