import Image from 'next/image'

import { Card } from '@/components/ui/Card'
import { toImage } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { Partner } from '@/payload-types'

type PartnersStripProps = {
  partners: Partner[]
  title: string
  /** `heading`: large section title (home). `caption`: small centered label (contact). */
  titleVariant?: 'heading' | 'caption'
  className?: string
}

/** Logo row. Scrolls sideways when it does not fit; the marquee animation comes in Phase 6. */
export function PartnersStrip({
  partners,
  title,
  titleVariant = 'heading',
  className,
}: PartnersStripProps) {
  if (partners.length === 0) return null

  return (
    <div
      className={cn('flex flex-col', titleVariant === 'heading' ? 'gap-12' : 'gap-8', className)}
    >
      {titleVariant === 'heading' ? (
        <h2 className="font-display text-display-md text-fg-primary md:text-display-lg">{title}</h2>
      ) : (
        <h2 className="text-center text-sm font-medium text-fg-secondary">{title}</h2>
      )}
      <Card variant="muted" className="overflow-x-auto">
        <ul className="flex w-max min-w-full items-center justify-around gap-10 px-6 py-10 md:px-10 md:py-16 lg:gap-16">
          {partners.map((partner) => {
            const logo = toImage(partner.logo)
            if (!logo) return null
            const img = (
              <Image
                src={logo.src}
                alt={partner.name}
                width={logo.width}
                height={logo.height}
                sizes="320px"
                className="h-12 w-auto max-w-48 object-contain md:h-20 md:max-w-64"
              />
            )
            return (
              <li key={partner.id} className="shrink-0">
                {partner.url ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md focus-ring"
                  >
                    {img}
                  </a>
                ) : (
                  img
                )}
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}
