import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { MagnifyingGlassIcon } from './icons'

type SearchInputProps = Omit<ComponentProps<'input'>, 'type'> & {
  /** Accessible name; the placeholder is not a label. */
  'aria-label': string
  wrapperClassName?: string
}

export function SearchInput({ className, wrapperClassName, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <MagnifyingGlassIcon
        aria-hidden
        size={16}
        className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2 text-fg-quaternary"
      />
      <input
        type="search"
        className={cn(
          'h-12 w-full rounded-full border border-line bg-white ps-11 pe-5 text-md text-fg-primary focus-ring transition-colors placeholder:text-fg-quaternary hover:border-fg-quaternary focus-visible:border-brand-600 [&::-webkit-search-cancel-button]:hidden',
          className,
        )}
        {...props}
      />
    </div>
  )
}
