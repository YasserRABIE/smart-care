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

/** Seconds each logo spends crossing the strip; total duration scales with the count. */
const SECONDS_PER_LOGO = 8

/**
 * Infinite logo marquee in pure CSS: the list is rendered twice and the track slides by half
 * its width, so the second copy lands exactly where the first started. Pauses on hover and
 * keyboard focus. With reduced motion it becomes a static, wrapping row.
 */
export function PartnersStrip({
  partners,
  title,
  titleVariant = 'heading',
  className,
}: PartnersStripProps) {
  const logos = partners.flatMap((partner) => {
    const logo = toImage(partner.logo)
    return logo ? [{ partner, logo }] : []
  })
  if (logos.length === 0) return null

  const renderList = (copy: boolean) => (
    <ul
      // The copy exists only for the seamless loop: hidden from assistive tech and focus.
      aria-hidden={copy || undefined}
      inert={copy || undefined}
      className={cn(
        'flex shrink-0 items-center gap-12 pe-12 md:gap-20 md:pe-20',
        copy
          ? 'motion-reduce:hidden'
          : 'motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pe-0',
      )}
    >
      {logos.map(({ partner, logo }) => {
        const image = (
          <Image
            src={logo.src}
            alt={copy ? '' : partner.name}
            width={logo.width}
            height={logo.height}
            sizes="320px"
            className="h-14 w-auto max-w-56 object-contain md:h-24 md:max-w-80"
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
                {image}
              </a>
            ) : (
              image
            )}
          </li>
        )
      })}
    </ul>
  )

  return (
    <div
      className={cn('flex flex-col', titleVariant === 'heading' ? 'gap-12' : 'gap-8', className)}
    >
      {titleVariant === 'heading' ? (
        <h2 className="font-display text-display-md text-fg-primary md:text-display-lg">{title}</h2>
      ) : (
        <h2 className="text-center text-sm font-medium text-fg-secondary">{title}</h2>
      )}
      <Card
        variant="plain"
        className="group/marquee mask-x-from-90% mask-x-to-100% py-10 motion-reduce:mask-none md:py-16"
      >
        <div
          style={{ animationDuration: `${logos.length * SECONDS_PER_LOGO}s` }}
          className="flex w-max animate-marquee group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:px-6 rtl:[--marquee-direction:-1]"
        >
          {renderList(false)}
          {renderList(true)}
        </div>
      </Card>
    </div>
  )
}
