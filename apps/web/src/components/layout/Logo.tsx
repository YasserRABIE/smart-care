import Image from 'next/image'

import { cn } from '@/lib/utils'

const variants = {
  /** Two-tone logo for the header. */
  default: { src: '/brand/logo.svg', width: 149, height: 28 },
  /** Single-color logo for the footer. */
  mono: { src: '/brand/logo-footer.svg', width: 120, height: 23 },
} as const

type LogoProps = {
  variant?: keyof typeof variants
  priority?: boolean
  className?: string
}

export function Logo({ variant = 'default', priority, className }: LogoProps) {
  const { src, width, height } = variants[variant]
  return (
    <Image
      src={src}
      alt="Smart Care Medical"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      // CSS sets the width; keep the aspect ratio (and silence next/image's resize warning).
      style={{ height: 'auto' }}
      className={cn('h-auto', className)}
    />
  )
}
