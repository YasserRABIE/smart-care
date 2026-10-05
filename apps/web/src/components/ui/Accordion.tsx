import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { PlusIcon } from './icons'

export function Accordion({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('flex flex-col', className)} {...props} />
}

type AccordionItemProps = {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  /** Items sharing a name behave as an exclusive group (one open at a time). */
  name?: string
  className?: string
}

/** Native <details>/<summary>: works without JavaScript and is keyboard accessible. */
export function AccordionItem({
  title,
  children,
  defaultOpen,
  name,
  className,
}: AccordionItemProps) {
  return (
    <details
      name={name}
      open={defaultOpen}
      className={cn('group border-b border-line-subtle bg-white', className)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-md font-semibold text-fg-primary focus-ring [&::-webkit-details-marker]:hidden">
        {title}
        <PlusIcon
          aria-hidden
          size={20}
          className="shrink-0 text-fg-tertiary transition-transform duration-200 group-open:rotate-45"
        />
      </summary>
      <div className="-mt-3 px-6 pb-6 text-sm text-fg-secondary">{children}</div>
    </details>
  )
}
