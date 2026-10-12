'use client'

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'

export interface PremiumVideoProps {
  videoUrl?: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  videoFit?: 'cover' | 'contain'
  borderRadius?: number
  containerWidth?: string
  containerHeight?: string
  buttonSize?: number
  backgroundOpacity?: number
  buttonBlur?: number
  buttonRadius?: number
  buttonBorderColor?: string
  iconColor?: string
  showreelText?: string
  fontSize?: number
  fontWeight?: number
  animationDuration?: number
  perspective?: number
  scale?: number
  style?: CSSProperties
}

export const premiumVideoCSS = `
.premium-video{position:relative;container-type:inline-size;isolation:isolate;background:transparent}
.premium-video-surface{position:relative;width:100%;height:100%;overflow:hidden;border-radius:var(--pv-radius);transform:scale(var(--pv-scale));transition:transform var(--pv-duration) cubic-bezier(.22,1,.36,1);background:transparent}
.premium-video-surface video,.premium-video-surface iframe{display:block;width:100%;height:100%;border:0;background:transparent;object-position:50% 50%}
.premium-control-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:3}
.premium-control{--pv-size:var(--pv-button-size);box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:0;min-width:var(--pv-size);height:var(--pv-size);padding:0 calc((var(--pv-size) - 26px)/2);border:1px solid var(--pv-border);border-radius:var(--pv-button-radius);background:rgba(255,255,255,var(--pv-opacity));color:var(--pv-color);backdrop-filter:blur(var(--pv-blur));-webkit-backdrop-filter:blur(var(--pv-blur));cursor:pointer;transform:scale(1);font-family:Syne,Arial,sans-serif;font-size:var(--pv-font-size);font-weight:var(--pv-font-weight);transition:background var(--pv-duration),backdrop-filter var(--pv-duration),transform var(--pv-duration);transition-timing-function:cubic-bezier(.22,1,.36,1);white-space:nowrap}
.premium-control svg{width:26px;height:26px;flex:none}
.premium-control-label{display:grid;grid-template-columns:0fr;opacity:0;transition:grid-template-columns var(--pv-duration) cubic-bezier(.22,1,.36,1),opacity var(--pv-duration),margin var(--pv-duration);margin-left:0}
.premium-control-label>span{overflow:hidden;min-width:0}
.premium-control:focus-visible{outline:2px solid white;outline-offset:6px}
.premium-control:disabled{cursor:wait;opacity:.65}
@media(hover:hover) and (pointer:fine){
.premium-control:hover{background:rgba(255,255,255,calc(var(--pv-opacity) + .09));backdrop-filter:blur(calc(var(--pv-blur) + 3px));-webkit-backdrop-filter:blur(calc(var(--pv-blur) + 3px));transform:scale(1.05)}
.premium-control:hover .premium-control-label{grid-template-columns:1fr;opacity:1;margin-left:12px}
}
.premium-control:focus-visible .premium-control-label{grid-template-columns:1fr;opacity:1;margin-left:12px}
@container(max-width:700px){.premium-control{--pv-size:calc(var(--pv-button-size)*.9)}}
@container(max-width:480px){.premium-control{--pv-size:max(44px,calc(var(--pv-button-size)*.8))}}
.premium-video-message{position:absolute;bottom:12px;left:12px;right:12px;color:white;text-align:center;font:13px/1.5 Arial,sans-serif;background:rgba(0,0,0,.65);padding:8px;border-radius:8px;z-index:4}
@media(prefers-reduced-motion:reduce){.premium-video-surface,.premium-control,.premium-control-label{transition:none!important}}
`

export function PremiumVideoShell({ children, soundMuted, onToggleSound, soundDisabled, ...props }: PremiumVideoProps & { children: ReactNode; soundMuted?: boolean; onToggleSound?: () => void; soundDisabled?: boolean }) {
  const shell = useRef<HTMLDivElement>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement === shell.current)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])
  useEffect(() => {
    if (!expanded) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setExpanded(false) }
    window.addEventListener('keydown', escape)
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', escape) }
  }, [expanded])
  const toggleFullscreen = async () => {
    if (expanded) { setExpanded(false); return }
    if (document.fullscreenElement === shell.current) { await document.exitFullscreen().catch(() => {}); return }
    try {
      if (!shell.current?.requestFullscreen) { setExpanded(true); return }
      await shell.current.requestFullscreen()
    } catch { setExpanded(true) }
  }
  const variables = {
    '--pv-radius': `${props.borderRadius ?? 30}px`, '--pv-scale': props.scale ?? .96,
    '--pv-button-size': `${props.buttonSize ?? 80}px`, '--pv-opacity': props.backgroundOpacity ?? .16,
    '--pv-blur': `${props.buttonBlur ?? 5}px`, '--pv-button-radius': `${props.buttonRadius ?? 999}px`,
    '--pv-border': props.buttonBorderColor ?? 'rgba(255,255,255,.25)', '--pv-color': props.iconColor ?? '#fff',
    '--pv-font-size': `${props.fontSize ?? 14}px`, '--pv-font-weight': props.fontWeight ?? 700,
    '--pv-duration': `${props.animationDuration ?? .4}s`,
    width: props.containerWidth ?? '100%', height: props.containerHeight ?? '100%',
    perspective: `${props.perspective ?? 1200}px`, ...props.style,
  } as CSSProperties
  return <div ref={shell} className={`premium-video${expanded ? ' is-expanded' : ''}`} style={variables}><style>{premiumVideoCSS}</style><div className="premium-video-surface">{children}
    <div className="premium-video-tools">
      {onToggleSound && <button type="button" disabled={soundDisabled} onClick={onToggleSound} aria-label={soundMuted ? 'Unmute video' : 'Mute video'} title={soundMuted ? 'เปิดเสียง / Unmute' : 'ปิดเสียง / Mute'}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" />{soundMuted ? <path d="m16 9 5 6m0-6-5 6" /> : <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></>}</svg>
      </button>}
      <button type="button" onClick={() => void toggleFullscreen()} aria-label={fullscreen || expanded ? 'Exit fullscreen' : 'Enter fullscreen'} title={fullscreen || expanded ? 'ออกจากเต็มหน้าจอ / Exit fullscreen' : 'เต็มหน้าจอ / Fullscreen'}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={fullscreen || expanded ? 'M9 3v6H3m12-6v6h6M9 21v-6H3m12 6v-6h6' : 'M9 3H3v6m12-6h6v6M3 15v6h6m6 0h6v-6'} /></svg>
      </button>
    </div>
  </div></div>
}

export function GlassPlayButton({ playing, onToggle, label = 'PLAY', disabled = false, controls }: {
  playing: boolean; onToggle: () => void; label?: string; disabled?: boolean; controls?: string
}) {
  return <div className="premium-control-center"><button type="button" className="premium-control" onClick={onToggle}
    disabled={disabled} aria-controls={controls} aria-label={playing ? 'Pause showreel' : 'Play showreel'}>
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {playing ? <path d="M6 4h4v16H6zm8 0h4v16h-4z"/> : <path d="M8 4.5 20 12 8 19.5z"/>}
    </svg>
    <span className="premium-control-label" aria-hidden="true"><span>{playing ? 'PAUSE' : label}</span></span>
  </button></div>
}

export function PremiumVideo(props: PremiumVideoProps) {
  const { videoUrl, poster, autoplay = true, loop = true, muted = true, videoFit = 'cover', showreelText = 'PLAY' } = props
  const ref = useRef<HTMLVideoElement>(null)
  const id = useId()
  const [playing, setPlaying] = useState(false)
  const [soundMuted, setSoundMuted] = useState(muted)
  const [error, setError] = useState('')
  useEffect(() => {
    const video = ref.current
    if (!video) return
    setError('')
    setPlaying(false)
    video.muted = muted
    setSoundMuted(muted)
    if (autoplay && videoUrl) void video.play().catch(() => { /* A user gesture may be required. */ })
    else video.pause()
  }, [videoUrl, autoplay, muted])
  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (!video.paused) video.pause()
    else { setError(''); void video.play().catch(() => setError('Unable to play this video. Please check the video URL.')) }
  }
  return <PremiumVideoShell {...props} soundMuted={soundMuted} soundDisabled={!videoUrl || !!error} onToggleSound={() => { if (ref.current) { ref.current.muted = !ref.current.muted; setSoundMuted(ref.current.muted) } }}>
    <video ref={ref} id={id} src={videoUrl || undefined} poster={poster || undefined} autoPlay={autoplay} muted={muted}
      loop={loop} playsInline preload="auto" controls={false} style={{ objectFit: videoFit }}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
      onVolumeChange={() => { if (ref.current) setSoundMuted(ref.current.muted) }}
      onError={() => { setPlaying(false); setError('Unable to load this video. Please check the video URL.') }} />
    <GlassPlayButton playing={playing} onToggle={toggle} label={showreelText} disabled={!videoUrl} controls={id}/>
    {error && <div className="premium-video-message" role="status">{error}</div>}
  </PremiumVideoShell>
}
