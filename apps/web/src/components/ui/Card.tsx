import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const cardVariants = cva('relative overflow-hidden', {
  variants: {
    variant: {
      outline: 'rounded-xl border border-line-subtle bg-white',
      muted: 'rounded-2xl bg-surface-muted',
      plain: 'rounded-3xl bg-white',
    },
  },
  defaultVariants: { variant: 'outline' },
})

type CardProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof cardVariants> & { as?: 'div' | 'article' | 'li' }

export function Card({ as: Component = 'div', variant, className, ...props }: CardProps) {
  return <Component className={cn(cardVariants({ variant }), className)} {...props} />
}
