import type { GlobalConfig } from 'payload'

export const SiteContact: GlobalConfig = {
  slug: 'site-contact',
  label: 'LINE และ QR ติดต่อเรา',
  admin: {
    group: 'ตั้งค่าเว็บไซต์',
    description:
      'ตั้งค่าปุ่มแอด LINE และภาพ QR ในส่วนติดต่อเราของหน้าแรก แล้วกดบันทึกเพื่อแสดงบนเว็บไซต์',
  },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    {
      name: 'lineUrl',
      type: 'text',
      label: 'ลิงก์เพิ่มเพื่อน LINE',
      admin: {
        description:
          'ตัวอย่าง https://lin.ee/xxxx หรือ https://line.me/R/ti/p/@ชื่อบัญชี',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => (typeof value === 'string' ? value.trim() : value),
        ],
      },
      validate: (value: unknown) => {
        if (!value) return true
        try {
          const url = new URL(String(value))
          return url.protocol === 'https:' &&
            !url.username &&
            !url.password &&
            ['lin.ee', 'line.me', 'www.line.me', 'page.line.me'].includes(
              url.hostname,
            )
            ? true
            : 'กรุณาใส่ลิงก์ HTTPS ของ lin.ee หรือ line.me'
        } catch {
          return 'กรุณาใส่ลิงก์ LINE ที่ถูกต้อง'
        }
      },
    },
    {
      name: 'lineQr',
      type: 'upload',
      relationTo: 'media',
      label: 'ภาพ QR Code LINE',
      filterOptions: { mimeType: { contains: 'image/' } },
      admin: {
        description:
          'อัปโหลดภาพ QR จากบัญชี LINE ของคุณ แนะนำภาพสี่เหลี่ยมจัตุรัสที่มีขอบขาวครบ เพื่อให้สแกนได้ชัดเจน',
      },
    },
  ],
}
