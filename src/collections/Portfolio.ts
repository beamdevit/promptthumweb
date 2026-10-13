import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { contentSlug } from '../lib/content-slug'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  labels: { singular: 'ผลงาน', plural: 'ผลงาน' },
  admin: {
    group: 'เนื้อหาเว็บไซต์',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'published', 'featured', 'updatedAt'],
    description:
      'เพิ่มชื่อ รายละเอียด และภาพปก เปิด “เผยแพร่” เพื่อแสดงบนเว็บไซต์ และเลือก “แสดงบนหน้าแรก” สำหรับผลงานเด่น',
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
    {
      type: 'tabs',
      tabs: [
        {
          label: 'ข้อมูลผลงาน',
          fields: [
            { name: 'title', type: 'text', required: true, label: 'ชื่อผลงาน' },
            {
              type: 'row',
              fields: [
                {
                  name: 'category',
                  type: 'relationship',
                  relationTo: 'portfolio-categories',
                  required: true,
                  label: 'หมวดหมู่',
                  admin: { description: 'เลือกหมวดหมู่ หรือกด + เพื่อเพิ่มหมวดใหม่' },
                },
                { name: 'client', type: 'text', label: 'ลูกค้า' },
                { name: 'year', type: 'text', label: 'ปี' },
              ],
            },
            {
              name: 'summary',
              type: 'textarea',
              label: 'คำโปรยสั้น',
              admin: {
                description: 'แสดงบนการ์ดผลงานและใช้เป็น meta description',
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'รายละเอียดงาน',
              admin: { className: 'pt-article-editor' },
              editor: lexicalEditor({
                admin: {
                  placeholder: 'เล่าแนวคิดและรายละเอียดผลงาน...',
                  hideAddBlockButton: true,
                },
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  FixedToolbarFeature(),
                ],
              }),
            },
            {
              name: 'tags',
              type: 'array',
              label: 'แท็ก',
              fields: [{ name: 'tag', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'รูปภาพ',
          description: 'เลือกภาพปกและรูปเพิ่มเติมสำหรับหน้ารายละเอียดผลงาน',
          fields: [
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
              label: 'ภาพปก',
              filterOptions: { mimeType: { contains: 'image/' } },
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'แกลเลอรี',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'รูปภาพ',
                  filterOptions: { mimeType: { contains: 'image/' } },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      label: 'ลิงก์ผลงาน (ชื่อใน URL)',
      admin: {
        position: 'sidebar',
        description: 'เว้นว่างไว้ได้ ระบบจะสร้างจากชื่อผลงานให้อัตโนมัติ',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => contentSlug(value || data?.title, 80),
        ],
      },
      validate: (value: unknown, { data }: { data?: { title?: string } }) =>
        contentSlug(value || data?.title, 80)
          ? true
          : 'ใส่ชื่อผลงานหรือลิงก์ที่มีตัวอักษรหรือตัวเลข',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'เผยแพร่',
      admin: {
        position: 'sidebar',
        description: 'เปิดเพื่อแสดงต่อผู้ชมเว็บไซต์ ปิดเพื่อเก็บไว้ในหลังบ้าน',
      },
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
  ],
  timestamps: true,
}
