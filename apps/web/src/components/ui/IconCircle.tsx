import { cn } from '@/lib/utils'

import type { Icon } from './icons'

type IconCircleProps = {
  icon: Icon
  className?: string
}

export function IconCircle({ icon: IconComponent, className }: IconCircleProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600',
        className,
      )}
    >
      <IconComponent size={24} />
    </span>
  )
}
