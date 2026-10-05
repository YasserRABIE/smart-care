import type { FAQPage, MedicalBusiness, WithContext } from 'schema-dts'

import { telHref } from '@/lib/contact-links'
import type { Faq, SiteSetting } from '@/payload-types'

/** Organization details for the home page (Google knowledge panel, contact info). */
export function organizationJsonLd(
  settings: SiteSetting,
  siteUrl: string,
): WithContext<MedicalBusiness> {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: settings.seo.siteName,
    url: siteUrl,
    logo: new URL('/brand/logo.svg', siteUrl).toString(),
    description: settings.seo.description,
    email: settings.email,
    telephone: telHref(settings.phone).replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address.street,
      addressLocality: settings.address.city,
      addressCountry: settings.address.country,
    },
    openingHours: settings.workingHours,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: settings.email,
      telephone: telHref(settings.phone).replace('tel:', ''),
    },
  }
}

/** FAQ rich results for the contact page. */
export function faqPageJsonLd(faqs: Pick<Faq, 'question' | 'answer'>[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}
