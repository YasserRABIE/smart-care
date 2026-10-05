import type { ReactNode } from 'react'

import { Eyebrow } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  title: ReactNode
  eyebrow?: string
  description?: ReactNode
  align?: 'start' | 'center'
  size?: 'md' | 'lg'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  titleClassName?: string
}

const titleSizes = {
  md: 'text-display-sm md:text-display-md',
  lg: 'text-display-md md:text-display-lg',
}

export function SectionHeading({
  title,
  eyebrow,
  description,
  align = 'start',
  size = 'md',
  as: Heading = 'h2',
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading
        className={cn(
          'font-display text-balance text-fg-primary',
          titleSizes[size],
          titleClassName,
        )}
      >
        {title}
      </Heading>
      {description && <p className="max-w-xl text-md text-fg-secondary">{description}</p>}
    </div>
  )
}
