import { SiteShowreel } from './SiteShowreel'

export function WelcomeSplash({ videoId }: { videoId: string }) {
  return (
    <main className="splash splash--video">
      <SiteShowreel videoId={videoId} />
      <div className="splash-enter">
        <p>ยินดีต้อนรับเข้าสู่เว็บไซต์</p>
        <a className="splash-enter-btn" href="/">เข้าสู่เว็บไซต์</a>
      </div>
    </main>
  )
}
