/**
 * Seeds the database with the design's content.
 *
 *   pnpm seed           create or update everything (safe to re-run)
 *   pnpm seed --reset   delete catalog and content first (users are kept)
 *
 * Runs outside Next.js, so cache revalidation is disabled; restart `pnpm dev` afterwards.
 */
import type { PostgresAdapter } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres/drizzle'
import path from 'path'
import { getPayload, type CollectionSlug, type Payload, type Where } from 'payload'
import { fileURLToPath } from 'url'

import config from '@payload-config'

import { env } from '@/lib/env'

import * as data from './data'

const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')
const context = { disableRevalidate: true }

type Id = number

async function findOne(payload: Payload, collection: CollectionSlug, where: Where) {
  const { docs } = await payload.find({
    collection,
    where,
    limit: 1,
    depth: 0,
    draft: true,
    context,
  })
  return docs[0] as { id: Id } | undefined
}

/** Update the document matching `where`, or create it. */
async function upsert(
  payload: Payload,
  collection: CollectionSlug,
  where: Where,
  doc: Record<string, unknown>,
): Promise<Id> {
  const existing = await findOne(payload, collection, where)
  if (existing) {
    await payload.update({ collection, id: existing.id, data: doc as never, depth: 0, context })
    return existing.id
  }
  const created = await payload.create({ collection, data: doc as never, depth: 0, context })
  return created.id as Id
}

async function seedMedia(payload: Payload) {
  const ids = {} as Record<data.MediaKey, Id>
  for (const [key, { file, alt }] of Object.entries(data.media) as [
    data.MediaKey,
    data.SeedMedia,
  ][]) {
    const existing = await findOne(payload, 'media', { filename: { equals: file } })
    if (existing) {
      await payload.update({ collection: 'media', id: existing.id, data: { alt }, context })
      ids[key] = existing.id
    } else {
      const created = await payload.create({
        collection: 'media',
        data: { alt },
        filePath: path.join(assetsDir, file),
        context,
      })
      ids[key] = created.id
    }
  }
  return ids
}

async function reset(payload: Payload) {
  // The page globals have required (NOT NULL) image columns, so media cannot be deleted while
  // they point at it. Clear them first; the seed recreates them below.
  const db = (payload.db as unknown as PostgresAdapter).drizzle
  await db.execute(sql`delete from home_page; delete from contact_page;`)

  // Children before parents, media last (other documents reference it).
  const order: CollectionSlug[] = [
    'products',
    'categories',
    'product-lines',
    'partners',
    'faqs',
    'media',
  ]
  for (const collection of order) {
    const { docs } = await payload.delete({ collection, where: { id: { exists: true } }, context })
    payload.logger.info(`Reset: deleted ${docs.length} ${collection}`)
  }
}

async function seedAdmin(payload: Payload) {
  const { SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: password } = env
  if (!email || !password) {
    payload.logger.warn('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set; skipping admin user')
    return
  }
  if (await findOne(payload, 'users', { email: { equals: email } })) return
  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Admin', role: 'admin' },
    context,
  })
  payload.logger.info(`Created admin user ${email}`)
}

async function seed() {
  const payload = await getPayload({ config })
  const log = (message: string) => payload.logger.info(`Seed: ${message}`)

  if (process.argv.includes('--reset')) await reset(payload)

  await seedAdmin(payload)

  const mediaIds = await seedMedia(payload)
  log(`${Object.keys(mediaIds).length} media`)

  const lineIds = {} as Record<data.LineSlug, Id>
  for (const line of data.productLines) {
    lineIds[line.slug] = await upsert(
      payload,
      'product-lines',
      { slug: { equals: line.slug } },
      {
        title: line.title,
        slug: line.slug,
        description: line.description,
        coverImage: mediaIds[line.coverImage],
        ctaLabel: line.ctaLabel,
        catalog: line.catalog,
        order: line.order,
      },
    )
  }
  log(`${data.productLines.length} product lines`)

  const categoryIds: Record<string, Id> = {}
  for (const category of data.categories) {
    categoryIds[category.slug] = await upsert(
      payload,
      'categories',
      { slug: { equals: category.slug } },
      {
        title: category.title,
        slug: category.slug,
        productLine: lineIds[category.line],
        order: category.order,
      },
    )
  }
  log(`${data.categories.length} categories`)

  for (const [index, product] of data.products.entries()) {
    await upsert(
      payload,
      'products',
      { slug: { equals: product.slug } },
      {
        title: product.title,
        slug: product.slug,
        description: product.description,
        image: mediaIds[product.image],
        productLine: lineIds[product.line],
        category: categoryIds[product.category],
        order: index + 1,
        _status: 'published',
      },
    )
  }
  log(`${data.products.length} products`)

  for (const partner of data.partners) {
    await upsert(
      payload,
      'partners',
      { name: { equals: partner.name } },
      {
        name: partner.name,
        logo: mediaIds[partner.logo],
        order: partner.order,
      },
    )
  }
  log(`${data.partners.length} partners`)

  for (const [index, faq] of data.faqs.entries()) {
    await upsert(
      payload,
      'faqs',
      { question: { equals: faq.question } },
      { ...faq, order: index + 1 },
    )
  }
  log(`${data.faqs.length} FAQs`)

  await payload.updateGlobal({
    slug: 'site-settings',
    data: data.siteSettings,
    context,
  })
  await payload.updateGlobal({
    slug: 'home-page',
    data: { ...data.homePage, hero: { ...data.homePage.hero, image: mediaIds.homeHero } },
    context,
  })
  await payload.updateGlobal({
    slug: 'contact-page',
    data: {
      ...data.contactPage,
      hero: { ...data.contactPage.hero, image: mediaIds.contactHero },
    },
    context,
  })
  log('globals')

  log('done. Restart `pnpm dev` if it is running, so cached pages pick up the new content.')
}

await seed()
process.exit(0)
