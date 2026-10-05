import Link from 'next/link'

import { cn } from '@/lib/utils'

import { CaretRightIcon } from './icons'

export type BreadcrumbItem = { label: string; href?: string }

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  className?: string
}

/** The last item is the current page. */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <CaretRightIcon
                  aria-hidden
                  size={14}
                  className="text-fg-quaternary rtl:-scale-x-100"
                />
              )}
              {isCurrent || !item.href ? (
                <span
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(isCurrent ? 'text-brand-600' : 'text-fg-quaternary')}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="rounded-xs text-fg-quaternary focus-ring transition-colors hover:text-fg-secondary"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
