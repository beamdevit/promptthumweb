import { addPropertyControls, ControlType } from 'framer'


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

export function PremiumVideoShell({ children, ...props }: PremiumVideoProps & { children: ReactNode }) {
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
  return <div className="premium-video" style={variables}><style>{premiumVideoCSS}</style><div className="premium-video-surface">{children}</div></div>
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
  const [error, setError] = useState('')
  useEffect(() => {
    const video = ref.current
    if (!video) return
    setError('')
    setPlaying(false)
    video.muted = muted
    if (autoplay && videoUrl) void video.play().catch(() => { /* A user gesture may be required. */ })
    else video.pause()
  }, [videoUrl, autoplay, muted])
  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (!video.paused) video.pause()
    else { setError(''); void video.play().catch(() => setError('Unable to play this video. Please check the video URL.')) }
  }
  return <PremiumVideoShell {...props}>
    <video ref={ref} id={id} src={videoUrl || undefined} poster={poster || undefined} autoPlay={autoplay} muted={muted}
      loop={loop} playsInline preload="auto" controls={false} style={{ objectFit: videoFit }}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
      onError={() => { setPlaying(false); setError('Unable to load this video. Please check the video URL.') }} />
    <GlassPlayButton playing={playing} onToggle={toggle} label={showreelText} disabled={!videoUrl} controls={id}/>
    {error && <div className="premium-video-message" role="status">{error}</div>}
  </PremiumVideoShell>
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 960
 * @framerIntrinsicHeight 540
 */
export default function FramerShowreel(props: PremiumVideoProps) {
  return <PremiumVideo {...props} style={{aspectRatio:'16 / 9', ...props.style}} />
}

addPropertyControls(FramerShowreel, {
  videoUrl: { type: ControlType.String, title: 'Video URL', placeholder: 'https://…/showreel.mp4', description: 'Direct MP4/WebM URL. YouTube page links cannot be used in HTML5 video.' },
  poster: { type: ControlType.Image, title: 'Poster Image' },
  autoplay: { type: ControlType.Boolean, title: 'Autoplay', defaultValue: true },
  loop: { type: ControlType.Boolean, title: 'Loop', defaultValue: true },
  muted: { type: ControlType.Boolean, title: 'Muted', defaultValue: true },
  videoFit: { type: ControlType.Enum, title: 'Video Fit', options: ['cover','contain'], defaultValue: 'cover' },
  containerWidth: { type: ControlType.String, title: 'Container Width', defaultValue: '100%' },
  containerHeight: { type: ControlType.String, title: 'Container Height', defaultValue: '100%' },
  buttonSize: { type: ControlType.Number, title: 'Button Size', defaultValue: 80, min: 56, max: 120, unit: 'px' },
  backgroundOpacity: { type: ControlType.Number, title: 'Button Opacity', defaultValue: .16, min: 0, max: .8, step: .01 },
  buttonBlur: { type: ControlType.Number, title: 'Button Blur', defaultValue: 5, min: 0, max: 30, unit: 'px' },
  buttonRadius: { type: ControlType.Number, title: 'Button Radius', defaultValue: 999, min: 0, max: 999, unit: 'px' },
  buttonBorderColor: { type: ControlType.Color, title: 'Button Border', defaultValue: 'rgba(255,255,255,0.25)' },
  iconColor: { type: ControlType.Color, title: 'Icon Color', defaultValue: '#ffffff' },
  showreelText: { type: ControlType.String, title: 'Showreel Text', defaultValue: 'PLAY' },
  fontSize: { type: ControlType.Number, title: 'Font Size', defaultValue: 14, min: 10, max: 32, unit: 'px' },
  fontWeight: { type: ControlType.Number, title: 'Font Weight', defaultValue: 700, min: 100, max: 900, step: 100 },
  animationDuration: { type: ControlType.Number, title: 'Duration', defaultValue: .4, min: .1, max: 1, step: .05, unit: 's' },
  borderRadius: { type: ControlType.Number, title: 'Video Radius', defaultValue: 30, min: 0, max: 100, unit: 'px' },
  perspective: { type: ControlType.Number, title: 'Perspective', defaultValue: 1200, min: 100, max: 3000, unit: 'px' },
  scale: { type: ControlType.Number, title: 'Scale', defaultValue: .96, min: .8, max: 1, step: .01 },
})
