import type { Metadata } from 'next'

import { CookieConsent } from '@/components/site/CookieConsent'
import { WelcomeSplash } from '@/components/site/WelcomeSplash'
import { getSiteVideo } from '@/lib/site-video'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ยินดีต้อนรับ · Promptthum',
  // A splash screen carries no content worth ranking, and indexing it would
  // compete with the homepage for the brand query.
  robots: { index: false, follow: true },
}

export default async function WelcomePage() {
  const video = await getSiteVideo()
  return (
    <>
      <WelcomeSplash {...video} />
      <CookieConsent />
    </>
  )
}
