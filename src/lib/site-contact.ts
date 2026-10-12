import config from '@payload-config'
import { getPayload } from 'payload'

export async function getSiteContact() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-contact', depth: 1, overrideAccess: false })
  return { lineUrl: settings.lineUrl || undefined, qr: typeof settings.lineQr === 'object' && settings.lineQr ? settings.lineQr : null }
}
