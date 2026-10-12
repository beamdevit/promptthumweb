import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'บทความ', plural: 'บทความ' },
  admin: {
    group: 'จัดการเนื้อหา', useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedAt', 'updatedAt'],
    description: 'บันทึกร่างเพื่อทำงานต่อ หรือเผยแพร่เพื่อแสดงบนเว็บไซต์',
  },
  access: {
    read: ({ req }) => req.user ? true : { _status: { equals: 'published' } },
    readVersions: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: '-publishedAt',
  hooks: {
    beforeChange: [({ data, originalDoc }) => {
      if (data._status === 'published' && !data.publishedAt && !originalDoc?.publishedAt) data.publishedAt = new Date().toISOString()
      return data
    }],
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'ชื่อบทความ' },
    {
      name: 'slug', type: 'text', required: true, unique: true, index: true, label: 'ชื่อใน URL (Slug)',
      admin: { position: 'sidebar', description: 'เว้นว่างเพื่อสร้างจากชื่อเรื่องอัตโนมัติ ควรคงชื่อ URL หลังเผยแพร่' },
      hooks: { beforeValidate: [({ value, data }) => (value || data?.title || '').trim().toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s-]/gu, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 120)] },
    },
    { name: 'summary', type: 'textarea', label: 'คำโปรย', maxLength: 300 },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'ภาพปก', filterOptions: { mimeType: { contains: 'image/' } } },
    { name: 'category', type: 'text', label: 'หมวดหมู่', defaultValue: 'บทความ', admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', label: 'วันที่เผยแพร่', admin: { position: 'sidebar', description: 'ระบบใส่วันที่ให้เมื่อเผยแพร่ครั้งแรก ช่องนี้เป็นวันที่แสดง ไม่ใช่การตั้งเวลาเผยแพร่' } },
    { name: 'content', type: 'richText', required: true, label: 'เนื้อหาบทความ' },
    { name: 'tags', type: 'array', label: 'แท็ก', fields: [{ name: 'tag', type: 'text', required: true, label: 'ชื่อแท็ก' }] },
  ],
}
