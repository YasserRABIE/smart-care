import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const controlClasses =
  'w-full rounded-t-xs border-b border-line bg-transparent px-2 text-sm text-fg-primary outline-none transition-colors placeholder:text-fg-quaternary hover:border-fg-quaternary focus-visible:border-brand-600 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error-600'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(controlClasses, 'h-13', className)} {...props} />
}

export function Textarea({ className, rows = 4, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      rows={rows}
      className={cn(controlClasses, 'min-h-32 resize-y py-4', className)}
      {...props}
    />
  )
}
