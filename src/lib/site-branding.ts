import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import { DEFAULT_SITE_LOGO, type SiteLogoData } from './site-logo'

export const getSiteBranding = cache(async (): Promise<SiteLogoData> => {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({
    slug: 'site-branding',
    depth: 1,
    overrideAccess: false,
  })
  const logo = typeof settings.logo === 'object' ? settings.logo : null
  if (!logo?.url || !logo.mimeType?.startsWith('image/')) return DEFAULT_SITE_LOGO

  return {
    src: logo.url,
    alt: settings.logoAlt?.trim() || logo.alt || DEFAULT_SITE_LOGO.alt,
    width: logo.width || undefined,
    height: logo.height || undefined,
  }
})
