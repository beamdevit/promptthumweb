'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { notifyNewLead } from '@/lib/notify'
import { checkRateLimit } from '@/lib/rateLimit'


export type LeadFormState = { ok: boolean; message: string }

const clip = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

function isValidContact(contact: string) {
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)
  const digits = contact.replace(/\D/g, '')
  return looksLikeEmail || digits.length >= 9
}

export async function submitLead(formData: FormData): Promise<LeadFormState> {
  // Bots fill every field they find, including one hidden from real users.
  if (clip(formData.get('company_website'), 100)) {
    return { ok: true, message: 'ขอบคุณค่ะ! ทีมงานจะติดต่อกลับภายใน 24 ชม.' }
  }

  const name = clip(formData.get('name'), 120)
  const contact = clip(formData.get('contact'), 160)
  const message = clip(formData.get('message'), 5000)

  if (name.length < 2) {
    return { ok: false, message: 'กรุณากรอกชื่อของคุณ' }
  }
  if (!isValidContact(contact)) {
    return { ok: false, message: 'กรุณากรอกอีเมลหรือเบอร์โทรให้ถูกต้อง' }
  }

  const headerList = await headers()
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerList.get('x-real-ip') ||
    'unknown'

  const { allowed } = checkRateLimit(`lead:${ip}`)
  if (!allowed) {
    return { ok: false, message: 'ส่งข้อมูลถี่เกินไป กรุณาลองใหม่ในอีกสักครู่' }
  }


  try {
    const payload = await getPayload({ config })

    await payload.create({
      collection: 'leads',
      // The visitor is not logged in; collection access denies public create.
      overrideAccess: true,
      data: {
        name,
        contact,
        message,
        status: 'new',
        sourcePage: clip(formData.get('sourcePage'), 300),
        referrer: clip(formData.get('referrer'), 300),
        utmSource: clip(formData.get('utmSource'), 100),
        utmMedium: clip(formData.get('utmMedium'), 100),
        utmCampaign: clip(formData.get('utmCampaign'), 100),
      },
    })

    await notifyNewLead({ name, contact, message })

    return { ok: true, message: 'ขอบคุณค่ะ! ทีมงานจะติดต่อกลับภายใน 24 ชม.' }
  } catch (error) {
    console.error('[submitLead]', error)
    return {
      ok: false,
      message: 'ขออภัย ระบบมีปัญหาชั่วคราว กรุณาติดต่อทาง LINE หรือโทรหาเราได้เลย',
    }
  }
}
