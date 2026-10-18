import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { env } from './lib/env'
import { migrations } from './migrations'
import { Categories } from './payload/collections/Categories'
import { Faqs } from './payload/collections/Faqs'
import { Media } from './payload/collections/Media'
import { Partners } from './payload/collections/Partners'
import { ProductLines } from './payload/collections/ProductLines'
import { Products } from './payload/collections/Products'
import { Users } from './payload/collections/Users'
import { ContactPage } from './payload/globals/ContactPage'
import { HomePage } from './payload/globals/HomePage'
import { SiteSettings } from './payload/globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  serverURL: env.NEXT_PUBLIC_SITE_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Smart Care Admin',
    },
  },
  collections: [ProductLines, Categories, Products, Partners, Faqs, Media, Users],
  globals: [HomePage, ContactPage, SiteSettings],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URI,
    },
    // The standalone image has no Payload CLI, so pending migrations run when the server starts.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
})
