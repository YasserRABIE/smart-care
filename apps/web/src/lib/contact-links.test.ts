import { describe, expect, it } from 'vitest'

import { mapQuery, mapsEmbedSrc, mapsSearchHref, telHref, whatsappHref } from './contact-links'

const address = { street: 'Cairo Medical Hub, Sector 4', city: 'Cairo', country: 'Egypt' }

describe('contact links', () => {
  it('strips formatting from phone numbers', () => {
    expect(telHref('+20 123 456 789')).toBe('tel:+20123456789')
    expect(telHref('(02) 123-4567')).toBe('tel:021234567')
  })

  it('builds WhatsApp links', () => {
    expect(whatsappHref('20123456789')).toBe('https://wa.me/20123456789')
    expect(whatsappHref('20123', 'Hi & hello')).toBe('https://wa.me/20123?text=Hi%20%26%20hello')
  })

  it('builds Google Maps search and embed URLs', () => {
    expect(mapsSearchHref('Cairo, Egypt')).toBe(
      'https://www.google.com/maps/search/?api=1&query=Cairo%2C%20Egypt',
    )
    expect(mapsEmbedSrc('30.04,31.23')).toBe(
      'https://www.google.com/maps?q=30.04%2C31.23&output=embed',
    )
  })

  it('uses the map location when set, else the full address', () => {
    expect(mapQuery({ mapLocation: ' 30.04,31.23 ', address })).toBe('30.04,31.23')
    expect(mapQuery({ mapLocation: '', address })).toBe('Cairo Medical Hub, Sector 4, Cairo, Egypt')
    expect(mapQuery({ address })).toBe('Cairo Medical Hub, Sector 4, Cairo, Egypt')
  })
})
