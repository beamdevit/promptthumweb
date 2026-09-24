import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Portfolio } from './collections/Portfolio'
import { Users } from './collections/Users'
import { SiteVideo } from './globals/SiteVideo'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    meta: {
      titleSuffix: ' · Promptthum Admin',
    },
    components: {
      views: { dashboard: { Component: '@/components/admin/DashboardStats#DashboardStats' } },
      beforeNavLinks: ['@/components/admin/AdminBrand#AdminBrand'],
    },
  },
  collections: [Leads, Portfolio, Media, Users],
  globals: [SiteVideo],
  editor: lexicalEditor(),
  db: postgresAdapter({
    // Railway's Postgres plugin injects DATABASE_URL; DATABASE_URI lets us override it.
    pool: { connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
})
