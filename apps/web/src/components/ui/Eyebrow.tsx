import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

/** Small accent label above a heading. */
export function Eyebrow({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('text-sm font-semibold text-brand-600', className)} {...props} />
}
