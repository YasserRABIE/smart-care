import Image from 'next/image'

import { Button } from '@/components/ui/Button'
import { ArrowRightIcon, ArrowUpRightIcon } from '@/components/ui/icons'
import { toImage } from '@/lib/media'
import type { HomePage } from '@/payload-types'

/** Static for now; the springy entrance animation is added in Phase 6. */
export function Hero({ hero }: { hero: HomePage['hero'] }) {
  const image = toImage(hero.image)

  return (
    <section className="relative isolate flex min-h-140 flex-col justify-center overflow-hidden rounded-xl px-6 py-16 md:h-160 md:px-8 lg:h-192">
      {image && (
        <Image
          src={image.src}
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 1248px, 100vw"
          className="-z-20 object-cover"
        />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/30" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-black/70 via-black/35 via-73% to-black/0"
      />
      <div className="flex flex-col gap-10 md:gap-12">
        <div className="flex flex-col gap-6">
          <h1 className="max-w-182 font-display text-display-md text-balance text-white md:text-display-lg lg:text-display-xl">
            {hero.title}
          </h1>
          <p className="max-w-112 text-md text-fg-subtle md:text-lg">{hero.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button href="/products" variant="pill" size="lg" trailingIcon={ArrowRightIcon}>
            {hero.primaryCtaLabel}
          </Button>
          <Button href="/contact" variant="ghost" size="lg" trailingIcon={ArrowUpRightIcon}>
            {hero.secondaryCtaLabel}
          </Button>
        </div>
      </div>
    </section>
  )
}
