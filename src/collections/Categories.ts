import { APIError, type CollectionConfig } from 'payload'
import { contentSlug } from '../lib/content-slug'

function categoryCollection(
  slug: 'article-categories' | 'portfolio-categories',
  content: 'articles' | 'portfolio',
  label: string,
): CollectionConfig {
  return {
    slug,
    labels: { singular: label, plural: label },
    admin: {
      group: 'หมวดหมู่เว็บไซต์',
      useAsTitle: 'name',
      defaultColumns: ['name', 'slug', 'order', 'updatedAt'],
      description: 'เพิ่มหรือแก้ไขชื่อหมวดหมู่ แล้วเลือกใช้ในหน้าแก้ไขเนื้อหา เลขลำดับน้อยแสดงก่อน',
    },
    defaultSort: ['order', 'name'],
    access: {
      read: () => true,
      create: ({ req }) => Boolean(req.user),
      update: ({ req }) => Boolean(req.user),
      delete: ({ req }) => Boolean(req.user),
    },
    hooks: {
      beforeDelete: [async ({ id, req }) => {
        const { totalDocs } = await req.payload.count({
          collection: content,
          where: { category: { equals: id } },
          overrideAccess: false,
          req,
        })
        if (totalDocs > 0) {
          throw new APIError('หมวดหมู่นี้ยังมีเนื้อหาอยู่ กรุณาย้ายเนื้อหาไปหมวดอื่นก่อนลบ', 400)
        }
        // Drafts and historical versions must retain their category when restored.
        if (content === 'articles') {
          const versions = await req.payload.findVersions({
            collection: 'articles',
            where: { 'version.category': { equals: id } },
            limit: 1,
            depth: 0,
            overrideAccess: false,
            req,
          })
          if (versions.totalDocs > 0) {
            throw new APIError('หมวดหมู่นี้อยู่ในฉบับร่างหรือประวัติบทความ สามารถแก้ไขชื่อได้ แต่ยังลบไม่ได้', 400)
          }
        }
      }],
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        unique: true,
        label: 'ชื่อหมวดหมู่',
        hooks: { beforeValidate: [({ value }) => typeof value === 'string' ? value.trim() : value] },
      },
      {
        name: 'slug',
        type: 'text',
        required: true,
        unique: true,
        index: true,
        label: 'ชื่อใน URL',
        admin: { description: 'เว้นว่างเพื่อสร้างจากชื่อหมวดหมู่ ควรคง URL เดิมเมื่อเปลี่ยนชื่อ' },
        hooks: {
          beforeValidate: [({ value, data, originalDoc }) =>
            contentSlug(value || originalDoc?.slug || data?.name)],
        },
        validate: (value: unknown, { data, originalDoc }: { data?: { name?: string }; originalDoc?: { slug?: string } }) =>
          contentSlug(value || originalDoc?.slug || data?.name)
            ? true : 'ใส่ชื่อหมวดหมู่หรือ URL ที่มีตัวอักษรหรือตัวเลข',
      },
      {
        name: 'order',
        type: 'number',
        defaultValue: 0,
        label: 'ลำดับการแสดง',
        admin: { description: 'เลขน้อยแสดงก่อน เช่น 0, 1, 2' },
      },
    ],
  }
}

export const ArticleCategories = categoryCollection('article-categories', 'articles', 'หมวดหมู่บทความ')
export const PortfolioCategories = categoryCollection('portfolio-categories', 'portfolio', 'หมวดหมู่ผลงาน')
