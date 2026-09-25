import type { GlobalConfig } from 'payload'
import { DEFAULT_YOUTUBE_URL, youtubeId } from '../lib/youtube'
export const SiteVideo: GlobalConfig = {
  slug: 'site-video', label: 'วิดีโอเว็บไซต์',
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [{
    name: 'youtubeUrl', type: 'text', required: true,
    label: 'ลิงก์วิดีโอ YouTube', defaultValue: DEFAULT_YOUTUBE_URL,
    admin: { description: 'ใช้ร่วมกันในหน้า Welcome และหน้าแรก รองรับ YouTube, Shorts และ youtu.be บันทึกแล้วรีเฟรชหน้าเว็บไซต์เพื่อดูผล' },
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
