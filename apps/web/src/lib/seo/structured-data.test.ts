import { describe, expect, it } from 'vitest'

import type { SiteSetting } from '@/payload-types'

import { faqPageJsonLd, organizationJsonLd } from './structured-data'

const settings = {
  id: 1,
  phone: '+20 123 456 789',
  email: 'contact@smartcareco.com',
  whatsappNumber: '20123456789',
  workingHours: 'Sun–Thu 8:00 AM – 5:00 PM',
  address: { street: 'Cairo Medical Hub, Sector 4', city: 'Cairo', country: 'Egypt' },
  seo: { siteName: 'Smart Care Medical', title: 'Smart Care', description: 'Supplier' },
} as SiteSetting

describe('organizationJsonLd', () => {
  it('describes the business with absolute URLs and a dialable phone', () => {
    const data = organizationJsonLd(settings, 'https://smartcareco.com')
    expect(data).toMatchObject({
      '@type': 'MedicalBusiness',
      name: 'Smart Care Medical',
      url: 'https://smartcareco.com',
      logo: 'https://smartcareco.com/brand/logo.svg',
      telephone: '+20123456789',
      address: { addressLocality: 'Cairo', addressCountry: 'Egypt' },
    })
  })
})

describe('faqPageJsonLd', () => {
  it('maps FAQs to questions and answers', () => {
    const data = faqPageJsonLd([{ question: 'Q1?', answer: 'A1' }])
    expect(data.mainEntity).toEqual([
      { '@type': 'Question', name: 'Q1?', acceptedAnswer: { '@type': 'Answer', text: 'A1' } },
    ])
  })
})
