import { describe, expect, it } from 'vitest'

import { mailtoHref, telHref, whatsappHref } from './contact-links'

describe('contact links', () => {
  it('strips formatting from phone numbers', () => {
    expect(telHref('+20 123 456 789')).toBe('tel:+20123456789')
    expect(telHref('(02) 123-4567')).toBe('tel:021234567')
  })

  it('builds mailto and WhatsApp links', () => {
    expect(mailtoHref('a@b.com')).toBe('mailto:a@b.com')
    expect(whatsappHref('20123456789')).toBe('https://wa.me/20123456789')
    expect(whatsappHref('20123', 'Hi & hello')).toBe('https://wa.me/20123?text=Hi%20%26%20hello')
  })
})
