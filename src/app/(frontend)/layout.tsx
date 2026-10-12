import type { Metadata } from 'next'
import React from 'react'
import { cookies } from 'next/headers'
import { SiteLanguage } from '@/components/site/SiteLanguage'
import { SiteBranding } from '@/components/site/SiteLogo'
import { getSiteBranding } from '@/lib/site-branding'
import { VisitorTracker } from '@/components/site/VisitorTracker'
import { CookieConsent } from '@/components/site/CookieConsent'

import './carousel-theme.css'
import './styles.css'

export const metadata: Metadata = {
  title: 'Promptthum — รับทำเว็บไซต์ ครบวงจร ',
  description:
    'Promptthum ที่นี่เรารับทำเว็บไซต์ที่มีคุณภาพ รองรับ SEO และทุกอุปกรณ์ รวมถึงให้คำปรึกษา ออกแบบ UX/UI ปรับแต่ง จนถึงช่วยทำการตลาด กราฟิกดีไซน์ สื่อโซเชียลมีเดียและสื่อสิ่งพิมพ์ เรียกได้ว่าครบจบในที่เดียว ราคาสบายกระเป๋า ด้วยทีมงานมืออาชีพ',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const locale = (await cookies()).get('site-language')?.value === 'en' ? 'en' : 'th'
  const logo = await getSiteBranding()
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800&family=Syne:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteBranding logo={logo}>
          <SiteLanguage initialLocale={locale}>
            <VisitorTracker />
            {children}
            <CookieConsent />
          </SiteLanguage>
        </SiteBranding>
      </body>
    </html>
  )
}
