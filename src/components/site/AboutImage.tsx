'use client'

import { useState } from 'react'
import { useSiteLanguage } from './SiteLanguage'
import { SiteLogo } from './SiteLogo'
import type { SiteAboutData } from '@/lib/site-about'

export function AboutImage({ image }: { image: SiteAboutData['image'] }) {
  const { locale } = useSiteLanguage()
  const [failedSource, setFailedSource] = useState<string>()
  if (!image || failedSource === image.src) return <SiteLogo />
  return <img className="about-custom-image" src={image.src}
    alt={locale === 'en' ? image.altEn : image.alt}
    width={image.width} height={image.height} loading="lazy"
    onError={() => setFailedSource(image.src)} />
}
