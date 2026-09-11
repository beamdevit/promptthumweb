'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import { submitLead, type LeadFormState } from '@/app/(frontend)/actions'
import { SELECT_PACKAGE_EVENT, type SelectPackageDetail } from '@/lib/selectPackage'

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const [budget, setBudget] = useState('')
  const [packageInterest, setPackageInterest] = useState('')
  const [status, setStatus] = useState<LeadFormState | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    const onSelectPackage = (event: Event) => {
      const detail = (event as CustomEvent<SelectPackageDetail>).detail
      setBudget(detail.budget)
      setPackageInterest(detail.label)
      nameRef.current?.focus({ preventScroll: true })
    }

    window.addEventListener(SELECT_PACKAGE_EVENT, onSelectPackage)
    return () => window.removeEventListener(SELECT_PACKAGE_EVENT, onSelectPackage)
  }, [])

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
        setBudget('')
        setPackageInterest('')
      }
    })
  }

  return (
    <form id="contact-form" ref={formRef} onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor="cf-name">ชื่อ</label>
      <input id="cf-name" ref={nameRef} name="name" type="text" placeholder="ชื่อ" required />

      <label className="sr-only" htmlFor="cf-contact">อีเมล / เบอร์โทร</label>
      <input id="cf-contact" name="contact" type="text" placeholder="อีเมล / เบอร์โทร" required />

      <label className="sr-only" htmlFor="cf-budget">งบประมาณ</label>
      <select
        id="cf-budget"
        name="budget"
        value={budget}
        onChange={(event) => setBudget(event.target.value)}
      >
        <option value="">งบประมาณ (3,000 / 10,000 / 20,000+)</option>
        <option value="3000">3,000</option>
        <option value="10000">10,000</option>
        <option value="20000+">20,000+</option>
      </select>

      <label className="sr-only" htmlFor="cf-detail">รายละเอียดงาน</label>
      <textarea id="cf-detail" name="message" rows={3} placeholder="รายละเอียดงาน" />

      <input type="hidden" name="packageInterest" value={packageInterest} />

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="cf-company-website">Company website</label>
        <input id="cf-company-website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button className="btn btn-ink" type="submit" disabled={pending}>
        {pending ? 'กำลังส่ง…' : 'ส่งข้อมูล'}
      </button>
      <p className="form-status" id="form-status" role="status" aria-live="polite">
        {status?.message ?? ''}
      </p>
    </form>
  )
}
