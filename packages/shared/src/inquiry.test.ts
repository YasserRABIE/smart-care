import { describe, expect, it } from 'vitest'

import { inquiryFieldErrors, inquirySchema } from './inquiry'

const valid = {
  name: 'Ahmed Ali',
  email: 'ahmed@example.com',
  subject: 'Laparoscope quote',
  message: 'We would like a quote for 10 units.',
}

describe('inquirySchema', () => {
  it('accepts a valid inquiry and trims whitespace', () => {
    const result = inquirySchema.parse({ ...valid, name: '  Ahmed Ali  ' })
    expect(result.name).toBe('Ahmed Ali')
  })

  it('rejects an invalid email', () => {
    expect(inquirySchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false)
  })

  it('rejects a too-short message', () => {
    expect(inquirySchema.safeParse({ ...valid, message: 'hi' }).success).toBe(false)
  })

  it('drops malformed product slugs and source pages instead of failing', () => {
    const result = inquirySchema.parse({
      ...valid,
      product: '1 OR 1=1',
      sourcePage: 'https://evil.test',
    })
    expect(result.product).toBeUndefined()
    expect(result.sourcePage).toBeUndefined()
  })

  it('keeps a valid product slug and source page', () => {
    const result = inquirySchema.parse({
      ...valid,
      product: 'tungsten-needle-holder',
      sourcePage: '/contact',
    })
    expect(result.product).toBe('tungsten-needle-holder')
    expect(result.sourcePage).toBe('/contact')
  })

  it('treats an empty honeypot as unset', () => {
    expect(inquirySchema.parse({ ...valid, website: '' }).website).toBeUndefined()
  })
})

describe('inquiryFieldErrors', () => {
  it('returns the first message for each visible field only', () => {
    const result = inquirySchema.safeParse({ name: 'A', email: 'x', subject: '', message: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = inquiryFieldErrors(result.error)
      expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'subject'])
      expect(errors.name).toBe('Please enter your full name')
    }
  })
})
