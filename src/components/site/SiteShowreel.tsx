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
      const distance = window.innerHeight * 0.45
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.1 - element.getBoundingClientRect().top) / distance))
      element.style.setProperty('--showreel-scale', String(reducedMotion.matches ? 1 : 0.8 + progress * 0.2))
      element.style.setProperty('--showreel-radius', `${reducedMotion.matches ? 30 : 30 - progress * 18}px`)
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
        {videoUrl ? <PremiumVideo videoUrl={videoUrl} poster={poster} /> : <YouTubeShowreel videoId={videoId} />}
      </div>
      </div>
    </div>
  )
}
