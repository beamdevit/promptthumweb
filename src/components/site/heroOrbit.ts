type Ring = { k: number; n: number; size: [number, number]; o: number; blur: number; speed: number; depth: number; hideOnPhone?: boolean }

// k scales the orbit relative to the hero (1 = reaches the edges); speed is radians per second.
const RINGS: Ring[] = [
  { k: 0.4, n: 5, size: [54, 70], o: 0.5, blur: 1.5, speed: 0.07, depth: 0.5, hideOnPhone: true },
  { k: 0.66, n: 6, size: [76, 96], o: 0.8, blur: 0, speed: 0.055, depth: 0.8 },
  { k: 0.92, n: 7, size: [100, 126], o: 1, blur: 0, speed: 0.045, depth: 1.1 },
  { k: 1.18, n: 6, size: [120, 150], o: 1, blur: 0, speed: 0.035, depth: 1.3 },
]

const ASPECTS = [1, 1.25, 0.8]

export type HeroTile = { ring: number; angle: number; size: number; tilt: number; ar: number; o: number; blur: number; depth: number }

export const HERO_TILES: HeroTile[] = RINGS.flatMap((ring, r) =>
  Array.from({ length: ring.n }, (_, i) => {
    const jitter = (((i * 37 + r * 11) % 10) / 10 - 0.5) * 0.3
    return {
      ring: r,
      angle: (i / ring.n) * Math.PI * 2 + r * 0.7 + jitter,
      size: ring.size[0] + (ring.size[1] - ring.size[0]) * (((i * 37 + r * 5) % 10) / 10),
      tilt: ((i * 53 + r * 17) % 41) - 20,
      ar: ASPECTS[(i + r) % ASPECTS.length],
      o: ring.o,
      blur: ring.blur,
      depth: ring.depth,
    }
  }),
)

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function startOrbit(layer: HTMLElement): () => void {
  const nodes = Array.from(layer.querySelectorAll<HTMLElement>('.fc'))
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  let w = 0
  let h = 0
  let phone = false
  let px = 0
  let py = 0
  let frame = 0
  let visible = true
  const startedAt = performance.now()
  let pausedAt = 0
  let pausedTotal = 0

  const measure = () => {
    const rect = layer.getBoundingClientRect()
    w = rect.width
    h = rect.height
    phone = w < 761
    const scale = phone ? 0.62 : clamp(w / 1440, 0.7, 1)
    nodes.forEach((node, i) => {
      const tile = HERO_TILES[i]
      const tw = tile.size * scale
      node.style.width = `${tw}px`
      node.style.height = `${tw / tile.ar}px`
    })
  }

  const place = (t: number) => {
    // Tiles drifting over the headline fade out, like the reference site.
    const ax = phone ? w * 0.52 : Math.min(w * 0.32, 470)
    const ay = h * 0.27
    nodes.forEach((node, i) => {
      const tile = HERO_TILES[i]
      const ring = RINGS[tile.ring]
      if (phone && ring.hideOnPhone) {
        node.style.display = 'none'
        return
      }
      node.style.display = ''
      const a = tile.angle + ring.speed * t
      const tw = node.offsetWidth
      const th = node.offsetHeight
      const cx = w / 2 + ring.k * w * 0.5 * Math.cos(a) + px * tile.depth * 18
      const cy = h / 2 + ring.k * h * 0.5 * Math.sin(a) + py * tile.depth * 14
      const d = Math.hypot((cx - w / 2) / ax, (cy - h / 2) / ay)
      const fade = clamp(0.2 + (0.8 * (d - 0.8)) / 0.5, 0.2, 1)
      node.style.translate = `${cx - tw / 2}px ${cy - th / 2}px`
      node.style.opacity = String(tile.o * fade)
    })
  }

  const loop = (now: number) => {
    frame = 0
    if (!visible || document.hidden) return
    place((now - startedAt - pausedTotal) / 1000)
    frame = requestAnimationFrame(loop)
  }

  const start = () => {
    if (reduced || frame) return
    if (pausedAt) {
      pausedTotal += performance.now() - pausedAt
      pausedAt = 0
    }
    frame = requestAnimationFrame(loop)
  }

  const onVisibility = () => {
    if (document.hidden) {
      if (!pausedAt) pausedAt = performance.now()
    } else start()
  }

  measure()
  place(0)
  layer.classList.add('is-ready')
  start()

  const resize = new ResizeObserver(() => {
    measure()
    if (reduced) place(0)
  })
  resize.observe(layer)

  const watch = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? true
    if (visible) start()
    else if (!pausedAt) pausedAt = performance.now()
  })
  watch.observe(layer)

  const onPointer = (e: PointerEvent) => {
    px = (e.clientX / window.innerWidth - 0.5) * 2
    py = (e.clientY / window.innerHeight - 0.5) * 2
  }
  if (hoverable && !reduced) window.addEventListener('pointermove', onPointer, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)

  return () => {
    if (frame) cancelAnimationFrame(frame)
    resize.disconnect()
    watch.disconnect()
    window.removeEventListener('pointermove', onPointer)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}
