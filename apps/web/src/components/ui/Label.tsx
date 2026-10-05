import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

type LabelProps = ComponentPropsWithoutRef<'label'> & { required?: boolean }

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label className={cn('text-sm font-medium text-fg-tertiary', className)} {...props}>
      {children}
      {required && <span aria-hidden> *</span>}
    </label>
  )
}
