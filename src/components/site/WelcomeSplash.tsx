'use client'

import { useCallback, useEffect, useState } from 'react'

type Slide =
  | { kind: 'logo' }
  | { kind: 'message'; heading: string; text: string }

const slides: Slide[] = [
  { kind: 'logo' },
  {
    kind: 'message',
    heading: 'อย่าให้ไอเดียของคุณอยู่แค่ในความคิด',
    text: 'รับทำเว็บไซต์ รองรับ SEO และทุกอุปกรณ์ · กราฟิกดีไซน์ · สื่อโซเชียลมีเดียและสื่อสิ่งพิมพ์ เริ่มต้น 3,000฿',
  },
]

export function WelcomeSplash() {
  const [index, setIndex] = useState(0)

  const go = useCallback((step: number) => {
    setIndex((current) => (current + step + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') go(-1)
      if (event.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [go])

  const slide = slides[index]

  return (
    <div className="splash">
      <button
        type="button"
        className="splash-arrow splash-arrow--prev"
        onClick={() => go(-1)}
        aria-label="สไลด์ก่อนหน้า"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      <div className="splash-stage" aria-live="polite">
        {slide.kind === 'logo' ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className="splash-logo" src="/assets/logo.png" alt="Promptthum — Ready to do" />
        ) : (
          <div className="splash-message">
            <h1>{slide.heading}</h1>
            <p>{slide.text}</p>
          </div>
        )}
      </div>

      <button
        type="button"
        className="splash-arrow splash-arrow--next"
        onClick={() => go(1)}
        aria-label="สไลด์ถัดไป"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      <div className="splash-enter">
        <p>ยินดีต้อนรับเข้าสู่เว็บไซต์</p>
        <a className="splash-enter-btn" href="/">เข้าสู่เว็บไซต์</a>
      </div>
    </div>
  )
}
