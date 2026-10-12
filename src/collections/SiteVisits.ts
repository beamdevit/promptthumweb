import type { CollectionConfig } from 'payload'

export const SiteVisits: CollectionConfig = {
  slug: 'site-visits',
  admin: { hidden: true },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'sessionHash', type: 'text', required: true, unique: true },
    { name: 'visitorHash', type: 'text', required: true, index: true },
    { name: 'source', type: 'text', required: true },
    { name: 'device', type: 'select', required: true, options: ['mobile', 'tablet', 'desktop', 'other'] },
    { name: 'landingPath', type: 'text', required: true },
    { name: 'createdAt', type: 'date', index: true, admin: { readOnly: true } },
  ],
}
