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

  it('treats email as optional', () => {
    expect(inquirySchema.parse({ ...valid, email: '' }).email).toBeUndefined()
    expect(inquirySchema.parse({ ...valid, email: undefined }).email).toBeUndefined()
  })

  it('rejects an invalid email when one is given', () => {
    expect(inquirySchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false)
  })

  it('rejects a too-short message', () => {
    expect(inquirySchema.safeParse({ ...valid, message: 'hi' }).success).toBe(false)
  })
})

describe('inquiryFieldErrors', () => {
  it('maps the first issue per visible field', () => {
    const result = inquirySchema.safeParse({ ...valid, name: '', message: 'hi' })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(inquiryFieldErrors(result.error)).toEqual({
      name: 'Please enter your full name',
      message: 'Please write a little more (at least 10 characters)',
    })
  })
})
