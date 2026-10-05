import Image from 'next/image'
import Link from 'next/link'

import { ArrowUpRightIcon } from '@/components/ui/icons'
import { toImage } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { ProductLine } from '@/payload-types'

type ProductLineCardProps = {
  line: Pick<ProductLine, 'title' | 'slug' | 'ctaLabel' | 'coverImage'>
  headingLevel?: 'h2' | 'h3'
  priority?: boolean
  className?: string
}

/** Image, title, and CTA. The whole card is one link (the CTA stretches over it). */
export function ProductLineCard({
  line,
  headingLevel: Heading = 'h3',
  priority,
  className,
}: ProductLineCardProps) {
  const image = toImage(line.coverImage)

  return (
    <article className={cn('group relative flex flex-col gap-4', className)}>
      <div className="relative aspect-400/523 overflow-hidden rounded-xl bg-surface-muted">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        )}
      </div>
      <Heading className="font-display text-display-xs text-fg-primary">{line.title}</Heading>
      <Link
        href={`/products/${line.slug}`}
        className="inline-flex w-fit items-center gap-2.5 rounded-xs py-1 text-md font-semibold text-brand-600 underline-offset-4 focus-ring group-hover:underline after:absolute after:inset-0"
      >
        {line.ctaLabel}
        <span className="sr-only">: {line.title}</span>
        <ArrowUpRightIcon
          aria-hidden
          size={24}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
        />
      </Link>
    </article>
  )
}
