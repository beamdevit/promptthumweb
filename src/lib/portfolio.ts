import config from '@payload-config'
import { getPayload } from 'payload'

import { categoryName } from './category-label'
import type { Media, Portfolio } from '@/payload-types'

export const categoryLabel = (value: Portfolio['category']) => categoryName(value, 'ผลงาน')

export const coverOf = (item: Portfolio) =>
  typeof item.cover === 'object' && item.cover ? (item.cover as Media) : null

export async function getPortfolio({
  category,
  limit,
}: { category?: string; limit?: number } = {}) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'portfolio',
    overrideAccess: false,
    depth: 1,
    limit: limit ?? 100,
    sort: ['order', '-createdAt'],
    where: {
      and: [
        { published: { equals: true } },
        ...(category ? [{ 'category.slug': { equals: category } }] : []),
      ],
    },
  })

  return docs
}

export async function getFeaturedPortfolio(limit = 3) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'portfolio',
    overrideAccess: false,
    depth: 1,
    limit,
    sort: ['order', '-createdAt'],
    where: {
      and: [{ featured: { equals: true } }, { published: { equals: true } }],
    },
  })

  if (docs.length > 0) return docs

  // No item flagged for the homepage yet — show the newest work instead of an empty row.
  const { docs: latest } = await payload.find({
    collection: 'portfolio',
    overrideAccess: false,
    depth: 1,
    limit,
    sort: ['order', '-createdAt'],
    where: { published: { equals: true } },
  })

  return latest
}

export async function getPortfolioBySlug(slug: string) {
  const payload = await getPayload({ config })

  // Route params arrive percent-encoded, and Thai slugs are all non-ASCII.
  let decoded = slug
  try {
    decoded = decodeURIComponent(slug)
  } catch {
    // Malformed escape sequence — fall back to matching the raw value.
  }

  const { docs } = await payload.find({
    collection: 'portfolio',
    overrideAccess: false,
    depth: 1,
    limit: 1,
    where: {
      and: [{ slug: { equals: decoded } }, { published: { equals: true } }],
    },
  })

  return docs[0] ?? null
}
