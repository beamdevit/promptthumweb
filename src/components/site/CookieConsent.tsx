'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'promptthum:cookie-consent'

export function CookieConsent() {
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
    } catch {
      // Ignore — the banner still closes for this visit.
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="การเก็บคุกกี้">
      <h2>เว็บไซต์ของเรามีการเก็บ cookies</h2>
      <p>
        เราใช้คุกกี้เพื่อเพิ่มประสิทธิภาพ และประสบการณ์ที่ดีในการใช้งานเว็บไซต์ กด &ldquo;ACCEPT&rdquo;
        เพื่อยอมรับข้อตกลงในการเก็บข้อมูล
      </p>
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
