import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'ไฟล์', plural: 'Media Library' },
  admin: { group: 'Media Library' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    staticDir: process.env.MEDIA_DIR || 'public/media',
    mimeTypes: ['image/*', 'video/mp4'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1600, height: undefined },
    ],
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
  fields: [
    { name: 'alt', type: 'text', required: true, label: 'คำอธิบายภาพ (alt)' },
    { name: 'caption', type: 'text', label: 'คำบรรยาย' },
  ],
}
