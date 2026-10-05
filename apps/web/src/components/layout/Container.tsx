import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

const containerVariants = cva('mx-auto w-full max-w-page', {
  variants: {
    size: {
      /** 1248px content (home sections, header). */
      wide: 'px-4',
      /** 1120px content (banners, catalog, contact, footer). */
      content: 'px-4 md:px-8 lg:px-20',
    },
  },
  defaultVariants: { size: 'content' },
})

type ContainerProps = ComponentPropsWithoutRef<'div'> & VariantProps<typeof containerVariants>

export function Container({ size, className, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />
}
