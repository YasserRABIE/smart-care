import { describe, expect, it } from 'vitest'

import { inquiryEmail } from './inquiry-email'

const base = {
  id: 7,
  name: 'Ahmed Ali',
  email: 'ahmed@example.com',
  subject: 'Needing help with Tungsten Needle Holder',
  message: 'Line one\nLine two',
  productTitle: 'Tungsten Needle Holder',
  productLineTitle: 'Surgical Specialties',
  sourcePage: '/contact',
  adminUrl: 'https://smartcare.test/admin/collections/inquiries/7',
}

describe('inquiryEmail', () => {
  it('prefixes the subject and lists the details', () => {
    const email = inquiryEmail(base)
    expect(email.subject).toBe('New inquiry: Needing help with Tungsten Needle Holder')
    expect(email.text).toContain('Product: Tungsten Needle Holder')
    expect(email.text).toContain('Product line: Surgical Specialties')
    expect(email.text).toContain(base.adminUrl)
  })

  it('leaves out empty rows', () => {
    const email = inquiryEmail({ ...base, productTitle: undefined, productLineTitle: undefined })
    expect(email.text).not.toContain('Product:')
    expect(email.html).not.toContain('Product line')
  })

  it('escapes user input in the HTML', () => {
    const email = inquiryEmail({
      ...base,
      name: '<script>x</script>',
      message: '"><img src=x onerror=alert(1)>',
    })
    expect(email.html).not.toContain('<script>')
    expect(email.html).not.toContain('<img')
    expect(email.html).toContain('&lt;script&gt;')
  })
})
