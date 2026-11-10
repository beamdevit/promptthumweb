'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { HERO_ART } from './heroArt'
import { HERO_TILES, startOrbit } from './heroOrbit'

export type HeroCover = { src: string; alt: string }

export function HeroFloat({ covers }: { covers: HeroCover[] }) {
  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = layer.current
    return el ? startOrbit(el) : undefined
  }, [])

  let coverIndex = 0
  let artIndex = 0

  return (
    <div className="hero-float" ref={layer} aria-hidden="true">
      {HERO_TILES.map((tile, i) => {
        const cover = tile.size >= 100 && coverIndex < covers.length ? covers[coverIndex++] : null
        const src = cover ? cover.src : HERO_ART[artIndex++ % HERO_ART.length]
        const style = {
          '--r': `${tile.tilt}deg`,
          '--b': `${tile.blur}px`,
          '--i': i,
        } as CSSProperties
        return (
          <div className="fc" style={style} key={i}>
            <div className="fc-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="eager" decoding="async" draggable={false} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
