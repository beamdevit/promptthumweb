import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { th } from '@payloadcms/translations/languages/th'

import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Portfolio } from './collections/Portfolio'
import { Users } from './collections/Users'
import { SiteVideo } from './globals/SiteVideo'
import { Articles } from './collections/Articles'
import { SiteContact } from './globals/SiteContact'
import { SiteBranding } from './globals/SiteBranding'
import { SiteAbout } from './globals/SiteAbout'
import { SiteVisits } from './collections/SiteVisits'
import { ArticleCategories, PortfolioCategories } from './collections/Categories'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    meta: {
      titleSuffix: ' · Promptthum Admin',
    },
    components: {
      views: {
        dashboard: {
          Component: '@/components/admin/DashboardStats#DashboardStats',
        },
      },
      beforeNavLinks: ['@/components/admin/AdminBrand#AdminBrand'],
      graphics: {
        Logo: '@/components/admin/AdminLogo#AdminLogo',
        Icon: '@/components/admin/AdminLogo#AdminIcon',
      },
    },
  },
  i18n: { supportedLanguages: { th }, fallbackLanguage: 'th' },
  collections: [Leads, Articles, Portfolio, ArticleCategories, PortfolioCategories, Media, Users, SiteVisits],
  globals: [SiteBranding, SiteAbout, SiteVideo, SiteContact],
  editor: lexicalEditor(),
  db: postgresAdapter({
    // Railway's Postgres plugin injects DATABASE_URL; DATABASE_URI lets us override it.
    pool: {
      connectionString:
        process.env.DATABASE_URI || process.env.DATABASE_URL || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
})
