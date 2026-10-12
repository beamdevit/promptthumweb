import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'ไฟล์สื่อ', plural: 'คลังรูปและวิดีโอ' },
  admin: {
    group: 'เนื้อหาเว็บไซต์',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
    description:
      'อัปโหลดรูปหรือวิดีโอ แล้วนำไปเลือกใช้ในบทความ ผลงาน โลโก้ หรือ QR ติดต่อเรา',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    staticDir: process.env.MEDIA_DIR || 'public/media',
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1600, height: undefined },
    ],
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'ชื่อ / คำอธิบายไฟล์',
      admin: {
        description:
          'ใช้ค้นหาในคลังสื่อ และอธิบายภาพให้ผู้ใช้โปรแกรมอ่านหน้าจอ เช่น “QR เพิ่มเพื่อน LINE Promptthum”',
      },
    },
    { name: 'caption', type: 'text', label: 'คำบรรยาย' },
  ],
}
