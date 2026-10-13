import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import { DEFAULT_SITE_ABOUT, hasAboutContent } from './site-about-defaults'

export const getSiteAbout = cache(async () => {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-about', depth: 1, overrideAccess: false })
  const heading = settings.heading?.trim() || DEFAULT_SITE_ABOUT.heading
  const content = hasAboutContent(settings.content) ? settings.content : DEFAULT_SITE_ABOUT.content
  const media = typeof settings.image === 'object' ? settings.image : null
  return {
    eyebrow: settings.eyebrow === undefined ? DEFAULT_SITE_ABOUT.eyebrow : settings.eyebrow?.trim() || '',
    heading,
    headingEn: settings.headingEn?.trim() || heading,
    content,
    contentEn: hasAboutContent(settings.contentEn) ? settings.contentEn! : content,
    image: media?.url && media.mimeType?.startsWith('image/') ? {
      src: media.url,
      alt: settings.imageAlt?.trim() || media.alt || heading,
      altEn: settings.imageAltEn?.trim() || settings.imageAlt?.trim() || media.alt || heading,
      width: media.width || undefined,
      height: media.height || undefined,
    } : null,
  }
})

export type SiteAboutData = Awaited<ReturnType<typeof getSiteAbout>>
