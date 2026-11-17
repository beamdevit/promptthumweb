'use client'

import { useEffect, useState } from 'react'

type Props = {
  videoId: string
  title: string
  /** Editor-chosen cover; falls back to the YouTube thumbnail. */
  cover?: string
  /** Only portrait is styled today; landscape can reuse this later. */
  orientation?: 'portrait' | 'landscape'
}

const thumb = (id: string, quality: string) => `https://i.ytimg.com/vi/${id}/${quality}.jpg`

export function VideoCard({ videoId, title, cover, orientation = 'portrait' }: Props) {
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [poster, setPoster] = useState(cover || thumb(videoId, 'maxresdefault'))

  useEffect(() => {
    if (!expanded) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setExpanded(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', onKey) }
  }, [expanded])

  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${videoId}`

  return (
    <figure className={`vcard vcard--${orientation}${expanded ? ' is-expanded' : ''}`}>
      <div className="vcard-box">
        <div className="vcard-layer">
        <div className="vcard-backdrop" onClick={() => setExpanded(false)} />
        <div className="vcard-stage">
          {playing ? (
            <iframe
              src={src}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poster}
                alt=""
                loading="lazy"
                onLoad={(event) => {
                  // YouTube serves a 120px grey placeholder when maxres is missing.
                  if (event.currentTarget.naturalWidth <= 120) setPoster(thumb(videoId, 'hqdefault'))
                }}
                onError={() => setPoster(thumb(videoId, 'hqdefault'))}
              />
              <button type="button" className="vcard-play" onClick={() => setPlaying(true)} aria-label={`เล่นวิดีโอ ${title}`}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 4.5 20 12 8 19.5z" /></svg>
              </button>
            </>
          )}
          <button
            type="button"
            className="vcard-expand"
            onClick={() => setExpanded((value) => !value)}
            aria-label={expanded ? 'ปิดหน้าต่างใหญ่' : 'ขยายเป็นหน้าต่างใหญ่'}
            title={expanded ? 'ปิด' : 'ขยาย'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d={expanded ? 'M6 6l12 12M18 6 6 18' : 'M9 3H3v6m12-6h6v6M3 15v6h6m6 0h6v-6'} />
            </svg>
          </button>
        </div>
        </div>
      </div>
      <figcaption className="vcard-title">{title}</figcaption>
    </figure>
  )
}
