'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ANALYTICS_CONSENT_EVENT, ANALYTICS_CONSENT_KEY } from '@/lib/visitor-analytics'

export function VisitorTracker() {
  const pathname = usePathname()
  const lastRequest = useRef('')
  useEffect(() => {
    function track() {
      try {
        const choice = JSON.parse(localStorage.getItem(ANALYTICS_CONSENT_KEY) || 'null')?.choice
        if (choice !== 'accepted' && choice !== 'rejected') return
        if (choice === 'accepted' && navigator.doNotTrack === '1') return
        const key = pathname + ':' + choice
        if (lastRequest.current === key) return
        lastRequest.current = key
        void fetch('/api/analytics/visit', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            consent: choice === 'accepted',
            path: pathname,
            referrer: document.referrer,
            campaign: new URLSearchParams(location.search).get('utm_source'),
          }),
        }).catch(() => { lastRequest.current = '' })
      } catch { /* Blocked storage must never prevent browsing the website. */ }
    }
    track()
    window.addEventListener(ANALYTICS_CONSENT_EVENT, track)
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, track)
  }, [pathname])
  return null
}
