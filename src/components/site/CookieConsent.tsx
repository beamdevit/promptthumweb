'use client'

import { T, useSiteLanguage } from '@/components/site/SiteLanguage'
import { ANALYTICS_CONSENT_EVENT, ANALYTICS_CONSENT_KEY } from '@/lib/visitor-analytics'


import { useEffect, useState } from 'react'

const STORAGE_KEY = ANALYTICS_CONSENT_KEY

export function CookieConsent() {
  const { t } = useSiteLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      // Private mode or blocked storage: stay hidden rather than nag on every view.
    }
  }, [])

  const decide = (choice: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, at: new Date().toISOString() }))
      window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT))
    } catch {
      // Ignore — the banner still closes for this visit.
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label={t('การเก็บคุกกี้')}>
      <h2><T>เว็บไซต์ของเรามีการเก็บ cookies</T></h2>
      <p><T>เราใช้คุกกี้เพื่อเพิ่มประสิทธิภาพ และประสบการณ์ที่ดีในการใช้งานเว็บไซต์ กด “ACCEPT” เพื่อยอมรับข้อตกลงในการเก็บข้อมูล</T></p>
      <div className="cookie-consent-actions">
        <button type="button" className="cookie-btn cookie-btn--ghost" onClick={() => decide('rejected')}>
          Reject All
        </button>
        <button type="button" className="cookie-btn cookie-btn--solid" onClick={() => decide('accepted')}>
          Accept All
        </button>
      </div>
    </div>
  )
}
