'use client'

import { useEffect, useRef } from 'react'
import { PremiumVideo } from './PremiumVideo'
import { YouTubeShowreel } from './YouTubeShowreel'

export function SiteShowreel({ videoId, videoUrl, poster }: { videoId: string; videoUrl?: string; poster?: string }) {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = track.current
    if (!element) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      const mobile = window.matchMedia('(max-width:760px)').matches
      if (mobile || reducedMotion.matches) {
        element.style.setProperty('--showreel-scale', '1')
        return
      }
      const distance = window.innerHeight * 0.8
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.15 - element.getBoundingClientRect().top) / distance))
      element.style.setProperty('--showreel-scale', String(0.5 + progress * 0.5))
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    reducedMotion.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reducedMotion.removeEventListener('change', schedule)
    }
  }, [])

  return (
    <div className="site-showreel" ref={track}>
      <div className="site-showreel-stage">
      <div className="site-showreel-frame">
        {videoUrl ? <PremiumVideo videoUrl={videoUrl} poster={poster} scale={1} showreelText="PLAY SHOWREEL" /> : <YouTubeShowreel videoId={videoId} />}
      </div>
      </div>
    </div>
  )
}
