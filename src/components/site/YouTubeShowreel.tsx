'use client'

import { useEffect, useRef, useState } from 'react'
import { GlassPlayButton, PremiumVideoShell } from './PremiumVideo'

type Player = { playVideo(): void; pauseVideo(): void; mute(): void; destroy(): void }
type YouTubeAPI = { Player: new (element: HTMLElement, options: Record<string, unknown>) => Player }
declare global { interface Window { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void } }
let apiPromise: Promise<YouTubeAPI> | undefined
function loadYouTube() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!apiPromise) apiPromise = new Promise<YouTubeAPI>((resolve, reject) => {
    const timeout = window.setTimeout(() => { apiPromise = undefined; reject(new Error('YouTube timed out')) }, 20000)
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { clearTimeout(timeout); previous?.(); if (window.YT) resolve(window.YT) }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.onerror = () => { clearTimeout(timeout); apiPromise = undefined; script.remove(); reject(new Error('YouTube unavailable')) }
    document.head.appendChild(script)
  })
  return apiPromise
}

export function YouTubeShowreel({ videoId }: { videoId: string }) {
  const mount = useRef<HTMLDivElement>(null)
  const player = useRef<Player | null>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  useEffect(() => {
    let disposed = false
    const readyTimeout = window.setTimeout(() => { if (!disposed) setError(true) }, 20000)
    setReady(false); setPlaying(false); setError(false)
    void loadYouTube().then(YT => {
      if (disposed || !mount.current) return
      const host = document.createElement('div')
      mount.current.replaceChildren(host)
      player.current = new YT.Player(host, {
        host: 'https://www.youtube-nocookie.com', videoId,
        width: '100%', height: '100%',
        playerVars: { autoplay: 1, mute: 1, loop: 1, playlist: videoId, playsinline: 1, controls: 0, rel: 0, origin: window.location.origin },
        events: {
          onReady: ({ target }: { target: Player }) => { if (!disposed) { clearTimeout(readyTimeout); setError(false); target.mute(); target.playVideo(); setReady(true) } },
          onStateChange: ({ data }: { data: number }) => { if (!disposed && [0, 1, 2, 5].includes(data)) setPlaying(data === 1) },
          onError: () => { if (!disposed) { setError(true); setPlaying(false) } },
        },
      })
    }).catch(() => { if (!disposed) setError(true) })
    return () => { disposed = true; clearTimeout(readyTimeout); player.current?.destroy(); player.current = null }
  }, [videoId])
  return <PremiumVideoShell>
    <div ref={mount} style={{ width: '100%', height: '100%' }} />
    <GlassPlayButton playing={playing} disabled={!ready || error} onToggle={() => playing ? player.current?.pauseVideo() : player.current?.playVideo()} />
    {error && <div className="premium-video-message" role="status">ไม่สามารถเล่นวิดีโอได้ <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>เปิดใน YouTube</a></div>}
  </PremiumVideoShell>
}
