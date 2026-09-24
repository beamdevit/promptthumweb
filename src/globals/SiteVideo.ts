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
  }],
}
