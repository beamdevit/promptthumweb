import type { GlobalConfig } from 'payload'
import { FixedToolbarFeature, LinkFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { DEFAULT_SITE_ABOUT, hasAboutContent } from '../lib/site-about-defaults'

const aboutEditor = () => lexicalEditor({
  admin: { hideGutter: true, hideAddBlockButton: true, hideDraggableBlockElement: true, placeholder: 'เขียนเรื่องราวเกี่ยวกับเรา...' },
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter(feature => !['upload', 'relationship', 'link'].includes(feature.key)),
    LinkFeature({ enabledCollections: [] }),
    FixedToolbarFeature(),
  ],
})

export const SiteAbout: GlobalConfig = {
  slug: 'site-about',
  label: 'About Us / เกี่ยวกับเรา',
  admin: {
    group: 'ตั้งค่าเว็บไซต์',
    description: 'แก้ไขหัวข้อ เนื้อหา และรูปภาพในส่วน About Us ของหน้าแรก แล้วกดบันทึกเพื่อแสดงบนเว็บไซต์',
  },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    {
      type: 'tabs',
      admin: { className: 'pt-about-tabs' },
      tabs: [
        {
          label: 'ภาษาไทย',
          fields: [
            { name: 'heading', type: 'text', required: true, label: 'หัวข้อ', defaultValue: DEFAULT_SITE_ABOUT.heading },
            {
              name: 'content', type: 'richText', required: true, label: 'เนื้อหาเกี่ยวกับเรา',
              defaultValue: DEFAULT_SITE_ABOUT.content,
              admin: { className: 'pt-article-editor' }, editor: aboutEditor(),
              validate: (value: unknown) => hasAboutContent(value) || 'กรุณาใส่เนื้อหาเกี่ยวกับเรา',
            },
          ],
        },
        {
          label: 'English',
          description: 'แสดงเมื่อผู้ชมเปลี่ยนภาษาเป็น EN หากเว้นว่างจะใช้ข้อความภาษาไทย',
          fields: [
            { name: 'headingEn', type: 'text', label: 'หัวข้อภาษาอังกฤษ', defaultValue: DEFAULT_SITE_ABOUT.headingEn },
            {
              name: 'contentEn', type: 'richText', label: 'เนื้อหาภาษาอังกฤษ',
              defaultValue: DEFAULT_SITE_ABOUT.contentEn,
              admin: { className: 'pt-article-editor' }, editor: aboutEditor(),
            },
          ],
        },
        {
          label: 'รูปภาพและข้อความกำกับ',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'ข้อความเล็กเหนือหัวข้อ', defaultValue: DEFAULT_SITE_ABOUT.eyebrow, admin: { description: 'เช่น ABOUT US เว้นว่างเพื่อซ่อนข้อความนี้' } },
            {
              name: 'image', type: 'upload', relationTo: 'media', label: 'รูปภาพเกี่ยวกับเรา',
              filterOptions: { mimeType: { contains: 'image/' } },
              admin: { description: 'เลือกจากคลังสื่อหรืออัปโหลดรูปใหม่ หากไม่เลือกรูปจะใช้โลโก้เว็บไซต์ปัจจุบัน' },
            },
            { name: 'imageAlt', type: 'text', label: 'คำอธิบายรูปภาพ', admin: { description: 'อธิบายรูปสั้น ๆ สำหรับโปรแกรมอ่านหน้าจอ หากเว้นว่างจะใช้คำอธิบายในคลังสื่อ' } },
            { name: 'imageAltEn', type: 'text', label: 'คำอธิบายรูปภาพภาษาอังกฤษ' },
          ],
        },
      ],
    },
  ],
}
