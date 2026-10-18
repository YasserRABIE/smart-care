import { describe, expect, it } from 'vitest'

import { inquiryMessage, inquiryWhatsappHref } from './whatsapp-message'

const input = {
  name: 'Ahmed Hassan',
  email: 'ahmed@hospital.com',
  subject: 'Needing help with Surgical Scissors',
  message: 'We need 20 units.\nCan you share availability?',
}

describe('inquiryMessage', () => {
  it('formats every field, with the product and its line', () => {
    expect(
      inquiryMessage(input, {
        slug: 'surgical-scissors',
        title: 'Surgical Scissors',
        lineTitle: 'Surgical Instruments',
      }),
    ).toBe(
      [
        'Hello Smart Care Medical,',
        '',
        '*Subject:* Needing help with Surgical Scissors',
        '*Product:* Surgical Scissors (Surgical Instruments)',
        '*Name:* Ahmed Hassan',
        '*Email:* ahmed@hospital.com',
        '',
        'We need 20 units.\nCan you share availability?',
      ].join('\n'),
    )
  })

  it('leaves out the product and email lines when absent', () => {
    const message = inquiryMessage({ ...input, email: undefined })
    expect(message).not.toContain('*Product:*')
    expect(message).not.toContain('*Email:*')
    expect(message).toContain('*Name:* Ahmed Hassan')
  })
})

describe('inquiryWhatsappHref', () => {
  it('builds a wa.me link with the encoded message', () => {
    const href = inquiryWhatsappHref('20123456789', input)
    expect(href.startsWith('https://wa.me/20123456789?text=')).toBe(true)
    expect(decodeURIComponent(href.split('?text=')[1] ?? '')).toBe(inquiryMessage(input))
  })
})
