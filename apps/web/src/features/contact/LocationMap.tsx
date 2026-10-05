import { ArrowUpRightIcon } from '@/components/ui/icons'
import { mapsEmbedSrc, mapsSearchHref } from '@/lib/contact-links'
import { messages } from '@/messages/en'

type LocationMapProps = {
  /** Address, place name, or "lat,lng". */
  query: string
  title: string
}

/** Embedded Google Map (keyless embed, loaded lazily) with a link to open it in Google Maps. */
export function LocationMap({ query, title }: LocationMapProps) {
  return (
    <section className="relative h-80 bg-surface-muted md:h-100">
      <iframe
        src={mapsEmbedSrc(query)}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="size-full border-0"
      />
      <a
        href={mapsSearchHref(query)}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute end-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-600 shadow-md focus-ring hover:bg-surface-muted"
      >
        {messages.contact.openMap}
        <span className="sr-only"> {messages.common.opensInNewTab}</span>
        <ArrowUpRightIcon aria-hidden size={16} className="rtl:-scale-x-100" />
      </a>
    </section>
  )
}
