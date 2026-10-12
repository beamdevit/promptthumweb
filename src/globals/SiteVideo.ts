import type { GlobalConfig } from 'payload'
import { DEFAULT_YOUTUBE_URL, youtubeId } from '../lib/youtube'
export const SiteVideo: GlobalConfig = {
  slug: 'site-video',
  label: 'วิดีโอเว็บไซต์',
  admin: {
    group: 'ตั้งค่าเว็บไซต์',
    description:
      'เปลี่ยนวิดีโอหน้าแรกและหน้า Welcome วางลิงก์แล้วกดบันทึก หากใส่ไฟล์ MP4 / WebM ระบบจะใช้ไฟล์นั้นแทน YouTube',
  },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'ลิงก์วิดีโอ YouTube',
      defaultValue: DEFAULT_YOUTUBE_URL,
      admin: {
        description:
          'รองรับ YouTube, Shorts และ youtu.be หากใช้ไฟล์วิดีโอด้านล่าง สามารถเว้นช่องนี้ว่างได้',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => (typeof value === 'string' ? value.trim() : value),
        ],
      },
      validate: (value: unknown, { data }: { data?: { videoUrl?: string } }) =>
        !value && data?.videoUrl
          ? true
          : typeof value === 'string' && youtubeId(value.trim())
            ? true
            : 'กรุณาใส่ลิงก์ YouTube หรือไฟล์วิดีโอด้านล่าง',
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'ไฟล์วิดีโอ HTML5 (MP4 / WebM)',
      hooks: {
        beforeValidate: [
          ({ value }) => (typeof value === 'string' ? value.trim() : value),
        ],
      },
      admin: {
        description:
          'ใส่ URL ไฟล์วิดีโอโดยตรงเพื่อใช้ตัวเล่น HTML5 ถ้าเว้นว่างจะใช้ YouTube ด้านบน',
      },
      validate: (value: unknown) => {
        if (!value) return true
        try {
          const url = new URL(String(value).trim())
          return url.protocol === 'https:' &&
            !url.username &&
            !url.password &&
            !youtubeId(String(value)) &&
            /\.(mp4|webm)$/i.test(url.pathname)
            ? true
            : 'ใช้ลิงก์ HTTPS ของไฟล์ MP4 หรือ WebM โดยตรง'
        } catch {
          return 'ลิงก์วิดีโอไม่ถูกต้อง'
        }
      },
    },
    {
      name: 'posterUrl',
      type: 'text',
      label: 'ภาพโปสเตอร์ (สำหรับ HTML5)',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData.videoUrl),
        description:
          'ภาพที่แสดงระหว่างโหลดไฟล์วิดีโอ ใส่ลิงก์รูปภาพ HTTPS หรือเว้นว่างได้',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => (typeof value === 'string' ? value.trim() : value),
        ],
      },
      validate: (value: unknown) => {
        if (!value) return true
        try {
          return new URL(String(value)).protocol === 'https:'
            ? true
            : 'ใช้ลิงก์รูปภาพ HTTPS'
        } catch {
          return 'ลิงก์รูปภาพไม่ถูกต้อง'
        }
      },
    },
  ],
}
