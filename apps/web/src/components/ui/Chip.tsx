import Link from 'next/link'

import { cn } from '@/lib/utils'

type ChipProps = {
  href: string
  label: string
  count?: number
  active?: boolean
  className?: string
}

/** Filter chip. A link, so filters live in the URL. */
export function Chip({ href, label, count, active = false, className }: ChipProps) {
  return (
    <Link
      href={href}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'inline-flex h-11 shrink-0 items-center gap-3 rounded-full border px-3 text-sm font-semibold focus-ring transition-colors',
        active
          ? 'border-transparent bg-brand-50 text-brand-600'
          : 'border-line text-fg-secondary hover:border-brand-600/40 hover:text-fg-primary',
        className,
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn('text-xs font-medium', active ? 'text-brand-600' : 'text-fg-quaternary')}
        >
          {count}
        </span>
      )}
    </Link>
  )
}
