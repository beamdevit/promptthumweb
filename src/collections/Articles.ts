import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { contentSlug } from '../lib/content-slug'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'บทความ', plural: 'บทความ' },
  admin: {
    group: 'เนื้อหาเว็บไซต์',
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'category',
      '_status',
      'publishedAt',
      'updatedAt',
    ],
    description: 'บันทึกร่างเพื่อทำงานต่อ หรือเผยแพร่เพื่อแสดงบนเว็บไซต์',
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    readVersions: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: '-publishedAt',
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (
          data._status === 'published' &&
          !data.publishedAt &&
          !originalDoc?.publishedAt
        )
          data.publishedAt = new Date().toISOString()
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'เนื้อหาบทความ',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'ชื่อบทความ',
            },
            {
              name: 'summary',
              type: 'textarea',
              label: 'คำโปรย',
              maxLength: 300,
              admin: {
                description:
                  'ข้อความสั้นใต้ชื่อบทความบนหน้าเว็บไซต์ ไม่เกิน 300 ตัวอักษร',
              },
            },
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
              label: 'ภาพปก',
              filterOptions: { mimeType: { contains: 'image/' } },
              admin: {
                description: 'เลือกภาพเดิมจากคลังสื่อ หรืออัปโหลดภาพใหม่',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              label: 'เนื้อหาบทความ',
              admin: { className: 'pt-article-editor' },
              editor: lexicalEditor({
                admin: {
                  hideGutter: true,
                  hideAddBlockButton: true,
                  hideDraggableBlockElement: true,
                  placeholder: 'เขียนเนื้อหาบทความ...',
                },
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  FixedToolbarFeature(),
                ],
              }),
            },
          ],
        },
        {
          label: 'แท็ก',
          description: 'เพิ่มคำสำคัญที่เกี่ยวข้องกับบทความ',
          fields: [
            {
              name: 'tags',
              type: 'array',
              label: 'แท็ก',
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  required: true,
                  label: 'ชื่อแท็ก',
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
      label: 'ลิงก์บทความ (ชื่อใน URL)',
      admin: {
        position: 'sidebar',
        description:
          'เว้นว่างเพื่อสร้างจากชื่อเรื่องอัตโนมัติ ควรคงชื่อ URL หลังเผยแพร่',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => contentSlug(value || data?.title),
        ],
      },
      validate: (value: unknown, { data }: { data?: { title?: string } }) =>
        contentSlug(value || data?.title)
          ? true
          : 'ใส่ชื่อบทความหรือลิงก์ที่มีตัวอักษรหรือตัวเลข',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'article-categories',
      label: 'หมวดหมู่',
      admin: {
        position: 'sidebar',
        description: 'เลือกหมวดหมู่ หรือกด + เพื่อเพิ่มหมวดใหม่',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'วันที่เผยแพร่',
      admin: {
        position: 'sidebar',
        description:
          'ระบบใส่วันที่ให้เมื่อเผยแพร่ครั้งแรก ช่องนี้เป็นวันที่แสดง ไม่ใช่การตั้งเวลาเผยแพร่',
      },
    },
  ],
}
