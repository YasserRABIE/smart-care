/** `tel:` link from a display number like "+20 123 456 789". */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

/** WhatsApp click-to-chat link. `number` is digits only, with the country code. */
export const whatsappHref = (number: string, text?: string) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`

/** Google Maps search for an address, place name, or "lat,lng". */
export const mapsSearchHref = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

/** Keyless Google Maps embed URL for an iframe. */
export const mapsEmbedSrc = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`

type LocationSettings = {
  mapLocation?: string | null
  address: { street: string; city: string; country: string }
}

/** What to show on the map: the explicit map location, else the postal address. */
export const mapQuery = ({ mapLocation, address }: LocationSettings) =>
  mapLocation?.trim() || [address.street, address.city, address.country].join(', ')
