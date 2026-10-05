import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

/** Loading placeholder block. Decorative: wrap groups in an element with `aria-busy`. */
export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse rounded-md bg-surface-muted motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  )
}
