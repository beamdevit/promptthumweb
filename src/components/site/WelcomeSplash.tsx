import { T } from '@/components/site/SiteLanguage'
import { SiteShowreel } from './SiteShowreel'

export function WelcomeSplash(props: { videoId: string; videoUrl?: string; poster?: string }) {
  return (
    <main className="splash splash--video">
      <img className="splash-brand" src="/assets/logo.png" alt="Promptthum" fetchPriority="high" />
      <SiteShowreel {...props} />
      <div className="splash-enter">
        <p><T>ยินดีต้อนรับเข้าสู่เว็บไซต์</T></p>
        <a className="splash-enter-btn" href="/"><T>เข้าสู่เว็บไซต์</T></a>
      </div>
    </main>
  )
}
