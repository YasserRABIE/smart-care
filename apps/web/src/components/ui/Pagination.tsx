import Link from 'next/link'

import { cn } from '@/lib/utils'

import { buttonVariants } from './Button'
import { CaretLeftIcon, CaretRightIcon } from './icons'
import { getPageRange } from './page-range'

type PaginationProps = {
  currentPage: number
  totalPages: number
  /** Builds the URL for a page, so pagination state stays in the URL. */
  getHref: (page: number) => string
  className?: string
}

const stepClasses = cn(buttonVariants({ variant: 'outline', size: 'sm' }))

export function Pagination({ currentPage, totalPages, getHref, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages
  const prevContent = (
    <>
      <CaretLeftIcon aria-hidden size={16} className="rtl:-scale-x-100" />
      Previous
    </>
  )
  const nextContent = (
    <>
      Next
      <CaretRightIcon aria-hidden size={16} className="rtl:-scale-x-100" />
    </>
  )

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex items-center justify-between gap-3 sm:justify-center sm:gap-12',
        className,
      )}
    >
      {hasPrev ? (
        <Link href={getHref(currentPage - 1)} rel="prev" className={stepClasses}>
          {prevContent}
        </Link>
      ) : (
        <span aria-disabled="true" className={stepClasses}>
          {prevContent}
        </span>
      )}

      <p className="text-sm text-fg-secondary sm:hidden">
        Page {currentPage} of {totalPages}
      </p>

      <ul className="hidden items-center gap-1 sm:flex">
        {getPageRange(currentPage, totalPages).map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} aria-hidden className="px-2 text-sm text-fg-quaternary">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={getHref(item)}
                aria-label={`Page ${item}`}
                aria-current={item === currentPage ? 'page' : undefined}
                className={cn(
                  'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-3.5 text-sm focus-ring transition-colors',
                  item === currentPage
                    ? 'bg-brand-50 font-semibold text-brand-600'
                    : 'text-fg-secondary hover:bg-surface-muted',
                )}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>

      {hasNext ? (
        <Link href={getHref(currentPage + 1)} rel="next" className={stepClasses}>
          {nextContent}
        </Link>
      ) : (
        <span aria-disabled="true" className={stepClasses}>
          {nextContent}
        </span>
      )}
    </nav>
  )
}
