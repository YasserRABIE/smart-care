import { cacheLife, cacheTag } from 'next/cache'

import { getPayloadClient } from './payload'
import { cacheTags } from './tags'

/*
 * Cached reads for globals and simple collections. Pages call these inside a <Suspense> boundary
 * after `await connection()`, so nothing is queried at build time. The Payload hooks expire the
 * tags on change; `cacheLife('days')` is only a safety net.
 */

export async function getSiteSettings() {
  'use cache'
  cacheTag(cacheTags.siteSettings, cacheTags.media)
  cacheLife('days')
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}

export async function getHomePage() {
  'use cache'
  cacheTag(cacheTags.homePage, cacheTags.media)
  cacheLife('days')
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'home-page', depth: 1 })
}

export async function getContactPage() {
  'use cache'
  cacheTag(cacheTags.contactPage, cacheTags.media)
  cacheLife('days')
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'contact-page', depth: 1 })
}

export async function getPartners() {
  'use cache'
  cacheTag(cacheTags.partners, cacheTags.media)
  cacheLife('days')
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'partners',
    sort: 'order',
    depth: 1,
    limit: 50,
    pagination: false,
  })
  return docs
}

export async function getFaqs() {
  'use cache'
  cacheTag(cacheTags.faqs)
  cacheLife('days')
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'faqs',
    sort: 'order',
    depth: 0,
    limit: 50,
    pagination: false,
  })
  return docs
}
