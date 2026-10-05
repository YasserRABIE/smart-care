import Image from 'next/image'
import type { ReactNode } from 'react'

import { Breadcrumbs, type BreadcrumbItem } from '@/components/ui/Breadcrumbs'
import { cn } from '@/lib/utils'

import { Container } from './Container'

type GradientBannerProps = {
  variant: 'gradient'
  title: ReactNode
  description?: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  className?: string
}

type ImageBannerProps = {
  variant: 'image'
  title: ReactNode
  /** Decorative background photo; a brand overlay keeps the title readable. */
  imageSrc?: string
  className?: string
}

export type PageBannerProps = GradientBannerProps | ImageBannerProps

export function PageBanner(props: PageBannerProps) {
  if (props.variant === 'image') {
    return (
      <section
        className={cn(
          'relative isolate flex min-h-60 items-center overflow-hidden bg-brand-900 py-20 lg:min-h-75 lg:py-30',
          props.className,
        )}
      >
        {props.imageSrc && (
          <Image
            src={props.imageSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-brand-900/90" />
        <Container>
          <h1 className="text-center font-display text-display-sm text-balance text-white md:text-display-md lg:text-display-lg">
            {props.title}
          </h1>
        </Container>
      </section>
    )
  }

  return (
    <section
      className={cn(
        'bg-linear-169 from-brand-50 from-65% to-brand-50/0 to-75% py-10',
        props.className,
      )}
    >
      <Container className="flex flex-col gap-3">
        {props.breadcrumbs && <Breadcrumbs items={props.breadcrumbs} />}
        <h1 className="font-display text-display-md text-fg-primary md:text-display-lg">
          {props.title}
        </h1>
        {props.description && (
          <p className="max-w-200 text-md text-fg-secondary md:text-lg">{props.description}</p>
        )}
      </Container>
    </section>
  )
}
