import { describe, expect, it } from 'vitest'

import { inquirySchema } from './inquiry'

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
    const result = inquirySchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects a missing message', () => {
    const result = inquirySchema.safeParse({ ...valid, message: '' })
    expect(result.success).toBe(false)
  })
})
