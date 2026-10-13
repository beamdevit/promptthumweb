import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import type { Article } from '@/payload-types'
import { categoryName } from './category-label'

export const articleCategoryLabel = (value: Article['category']) => categoryName(value, 'บทความ')

export const articleCover = (article: Article) => typeof article.cover === 'object' && article.cover ? article.cover : null
export const articleDate = (date: string) => new Date(date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Bangkok' })

export async function getArticles(page = 1, limit = 12) {
  const payload = await getPayload({ config })
  return payload.find({ collection: 'articles', overrideAccess: false, draft: false, depth: 1, limit, page,
    sort: ['-publishedAt', '-createdAt'], where: { _status: { equals: 'published' } } })
}

export const getArticleBySlug = cache(async (slug: string) => {
  let decoded = slug
  try { decoded = decodeURIComponent(slug) } catch { return null }
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'articles', overrideAccess: false, draft: false, depth: 1, limit: 1,
    where: { and: [{ slug: { equals: decoded } }, { _status: { equals: 'published' } }] } })
  return docs[0] ?? null
})
