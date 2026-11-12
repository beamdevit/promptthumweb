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
  hooks: {
    // Fill the name from the uploaded file name when the editor leaves it empty.
    beforeValidate: [
      ({ data, req }) => {
        if (!data || (typeof data.alt === 'string' && data.alt.trim())) return data
        const file = (req as { file?: { name?: string } }).file?.name || data.filename
        if (typeof file !== 'string' || !file) return data
        const name = file
          .replace(/\.[^.]+$/, '')
          .replace(/[_-]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        return { ...data, alt: name || file }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'ชื่อ / คำอธิบายไฟล์',
      admin: {
        description:
          'เว้นว่างไว้ได้ ระบบจะใช้ชื่อไฟล์ให้อัตโนมัติ หรือพิมพ์เองเพื่อใช้ค้นหาและอธิบายภาพ เช่น “QR เพิ่มเพื่อน LINE Promptthum”',
      },
    },
    { name: 'caption', type: 'text', label: 'คำบรรยาย' },
  ],
}
