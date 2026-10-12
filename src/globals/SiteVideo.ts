import type { GlobalConfig } from 'payload'
import { DEFAULT_YOUTUBE_URL, youtubeId } from '../lib/youtube'
export const SiteVideo: GlobalConfig = {
  slug: 'site-video', label: 'วิดีโอเว็บไซต์',
  admin: { group: 'จัดการเนื้อหา', description: 'เปลี่ยนวิดีโอหน้าแรกและหน้า Welcome ได้ที่นี่ วางลิงก์ใหม่แล้วกด Save เพื่อใช้กับทั้งสองหน้า หากต้องการใช้ YouTube ให้เว้นช่องไฟล์ MP4 / WebM ว่าง' },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [{
    name: 'youtubeUrl', type: 'text', required: true,
    label: 'ลิงก์วิดีโอ YouTube', defaultValue: DEFAULT_YOUTUBE_URL,
    admin: { description: 'รองรับ youtube.com/watch, YouTube Shorts และ youtu.be วางลิงก์แล้วกด Save จากนั้นรีเฟรชหน้าเว็บไซต์เพื่อดูผล' },
    validate: (value: unknown) => typeof value === 'string' && youtubeId(value) ? true : 'กรุณาใส่ลิงก์วิดีโอ YouTube ที่ถูกต้อง',
  }, {
    name: 'videoUrl', type: 'text', label: 'ไฟล์วิดีโอ HTML5 (MP4 / WebM)',
    admin: { description: 'ใส่ URL ไฟล์วิดีโอโดยตรงเพื่อใช้ตัวเล่น HTML5 ถ้าเว้นว่างจะใช้ YouTube ด้านบน' },
    validate: (value: unknown) => {
      if (!value) return true
      try { const url = new URL(String(value)); return url.protocol === 'https:' && !youtubeId(String(value)) && /\.(mp4|webm)$/i.test(url.pathname) ? true : 'ใช้ลิงก์ HTTPS ของไฟล์ MP4 หรือ WebM โดยตรง' } catch { return 'ลิงก์วิดีโอไม่ถูกต้อง' }
    },
  }, {
    name: 'posterUrl', type: 'text', label: 'ภาพโปสเตอร์ (สำหรับ HTML5)',
    validate: (value: unknown) => {
      if (!value) return true
      try { return new URL(String(value)).protocol === 'https:' ? true : 'ใช้ลิงก์รูปภาพ HTTPS' } catch { return 'ลิงก์รูปภาพไม่ถูกต้อง' }
    },
  }],
}
