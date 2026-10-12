'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { DEFAULT_SITE_LOGO, type SiteLogoData } from '@/lib/site-logo'

const LogoContext = createContext<SiteLogoData>(DEFAULT_SITE_LOGO)

export function SiteBranding({ logo, children }: { logo: SiteLogoData; children: ReactNode }) {
  return <LogoContext.Provider value={logo}>{children}</LogoContext.Provider>
}

export function SiteLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  const logo = useContext(LogoContext)
  const [failedSource, setFailedSource] = useState<string>()
  const image = failedSource === logo.src ? DEFAULT_SITE_LOGO : logo

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      fetchPriority={priority ? 'high' : undefined}
      onError={() => {
        if (image.src !== DEFAULT_SITE_LOGO.src) setFailedSource(logo.src)
      }}
    />
  )
}
