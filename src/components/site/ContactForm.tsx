'use client'

import { T, useSiteLanguage } from '@/components/site/SiteLanguage'


import { useRef, useState, useTransition } from 'react'

import { submitLead, type LeadFormState } from '@/app/(frontend)/actions'

export function ContactForm() {
  const { t } = useSiteLanguage()
  const formRef = useRef<HTMLFormElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<LeadFormState | null>(null)
  const [pending, startTransition] = useTransition()


  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.set('sourcePage', window.location.href)
    formData.set('referrer', document.referrer)

    const params = new URLSearchParams(window.location.search)
    formData.set('utmSource', params.get('utm_source') || '')
    formData.set('utmMedium', params.get('utm_medium') || '')
    formData.set('utmCampaign', params.get('utm_campaign') || '')

    startTransition(async () => {
      const result = await submitLead(formData)
      setStatus(result)
      if (result.ok) {
        formRef.current?.reset()
      }
    })
  }

  return (
    <form id="contact-form" ref={formRef} onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor="cf-name"><T>ชื่อ</T></label>
      <input id="cf-name" ref={nameRef} name="name" type="text" placeholder={t('ชื่อ')} required />

      <label className="sr-only" htmlFor="cf-contact"><T>อีเมล / เบอร์โทร</T></label>
      <input id="cf-contact" name="contact" type="text" placeholder={t('อีเมล / เบอร์โทร')} required />

<label className="sr-only" htmlFor="cf-detail"><T>รายละเอียดงาน</T></label>
      <textarea id="cf-detail" name="message" rows={3} placeholder={t('รายละเอียดงาน')} />


      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="cf-company-website">Company website</label>
        <input id="cf-company-website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button className="btn btn-ink" type="submit" disabled={pending}>
        {t(pending ? 'กำลังส่ง…' : 'ส่งข้อมูล')}
      </button>
      <p className="form-status" id="form-status" role="status" aria-live="polite">
        {t(status?.message ?? '')}
      </p>
    </form>
  )
}
