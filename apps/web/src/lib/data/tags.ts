/**
 * Cache tags shared by the data layer (`cacheTag`) and the Payload hooks (`revalidateTag`).
 * Anything that populates uploads should also tag `media`.
 */
export const cacheTags = {
  products: 'products',
  categories: 'categories',
  productLines: 'product-lines',
  partners: 'partners',
  faqs: 'faqs',
  media: 'media',
  siteSettings: 'site-settings',
  homePage: 'home-page',
  contactPage: 'contact-page',
} as const

export type CacheTag = (typeof cacheTags)[keyof typeof cacheTags]
