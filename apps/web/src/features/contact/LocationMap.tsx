import Image from 'next/image'

import { toImage } from '@/lib/media'
import type { Media } from '@/payload-types'
import { messages } from '@/messages/en'

type LocationMapProps = {
  image: number | Media
  mapUrl?: string | null
}

/** Static map image linking to Google Maps (no embedded third-party map). */
export function LocationMap({ image, mapUrl }: LocationMapProps) {
  const map = toImage(image)
  if (!map) return null

  const picture = (
    <>
      <Image src={map.src} alt={map.alt} fill sizes="100vw" className="object-cover" />
      <span
        aria-hidden
        className="absolute inset-0 bg-brand-900/10 transition-colors group-hover:bg-brand-900/0"
      />
    </>
  )

  return (
    <section className="relative h-72 md:h-100">
      {mapUrl ? (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group absolute inset-0 block focus-ring"
        >
          {picture}
          <span className="sr-only">
            {messages.contact.openMap} {messages.common.opensInNewTab}
          </span>
        </a>
      ) : (
        picture
      )}
    </section>
  )
}
