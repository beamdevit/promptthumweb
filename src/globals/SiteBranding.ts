import type { GlobalConfig } from 'payload'

export const SiteBranding: GlobalConfig = {
  slug: 'site-branding',
  label: 'โลโก้เว็บไซต์',
  admin: {
    group: 'ตั้งค่าเว็บไซต์',
    description:
      'เปลี่ยนโลโก้ในเมนูด้านบน หน้า Welcome และส่วน About Us ที่ไม่ได้ตั้งรูปภาพแยก แล้วกดบันทึกเพื่อแสดงบนเว็บไซต์',
  },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'ภาพโลโก้',
      filterOptions: { mimeType: { contains: 'image/' } },
      admin: {
        description:
          'เลือกจากคลังสื่อหรืออัปโหลดใหม่ แนะนำ PNG หรือ WebP พื้นหลังโปร่งใสที่เห็นชัดบนพื้นสีน้ำเงิน ใช้ภาพเต็มโดยไม่ตัดขอบ หากล้างช่องนี้จะกลับไปใช้โลโก้เดิม',
      },
    },
    {
      name: 'logoAlt',
      type: 'text',
      label: 'ชื่อ / คำอธิบายโลโก้',
      defaultValue: 'Promptthum',
      admin: {
        description: 'ข้อความสำหรับผู้ใช้โปรแกรมอ่านหน้าจอ เช่น “โลโก้ Promptthum”',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => (typeof value === 'string' ? value.trim() : value),
        ],
      },
    },
  ],
}
