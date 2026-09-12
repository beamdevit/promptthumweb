import type { CollectionConfig } from 'payload'

export const PORTFOLIO_CATEGORIES = [
  { label: 'เว็บไซต์', value: 'website' },
  { label: 'กราฟิกดีไซน์', value: 'graphic' },
  { label: 'โลโก้ / CI', value: 'branding' },
  { label: 'Ads Banner', value: 'ads' },
  { label: 'วิดีโอ', value: 'video' },
  { label: 'Packaging', value: 'packaging' },
] as const

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^฀-๿a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  labels: { singular: 'ผลงาน', plural: 'ผลงาน' },
  admin: {
    group: 'Portfolio CMS',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'client', 'year', 'featured', 'updatedAt'],
  },
  access: {
    read: ({ req }) => {
      // Visitors see published work only; logged-in staff see drafts too.
      if (req.user) return true
      return { published: { equals: true } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: ['order', '-createdAt'],
  fields: [
    { name: 'title', type: 'text', required: true, label: 'ชื่อผลงาน' },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      label: 'Slug (URL)',
      admin: {
        position: 'sidebar',
        description: 'เว้นว่างไว้ได้ ระบบจะสร้างจากชื่อผลงานให้อัตโนมัติ',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || slugify(data?.title ?? '') || undefined,
        ],
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'เผยแพร่',
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'แสดงบนหน้าแรก',
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'ลำดับ',
      admin: { position: 'sidebar', description: 'เลขน้อยขึ้นก่อน' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          label: 'หมวดหมู่',
          options: [...PORTFOLIO_CATEGORIES],
        },
        { name: 'client', type: 'text', label: 'ลูกค้า' },
        { name: 'year', type: 'text', label: 'ปี' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'คำโปรยสั้น',
      admin: { description: 'แสดงบนการ์ดผลงานและใช้เป็น meta description' },
    },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'ภาพปก' },
    {
      name: 'gallery',
      type: 'array',
      label: 'แกลเลอรี',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'description', type: 'richText', label: 'รายละเอียดงาน' },
    {
      name: 'tags',
      type: 'array',
      label: 'แท็ก',
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
  ],
  timestamps: true,
}
