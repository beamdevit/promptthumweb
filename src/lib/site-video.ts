import config from '@payload-config'
import { getPayload } from 'payload'
import { DEFAULT_YOUTUBE_URL, youtubeId } from './youtube'
export async function getSiteVideoId() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-video', depth: 0 })
  return youtubeId(settings.youtubeUrl || '') || youtubeId(DEFAULT_YOUTUBE_URL)!
}
