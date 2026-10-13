import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const getPortfolioCategories = cache(async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'portfolio-categories',
    overrideAccess: false,
    depth: 0,
    pagination: false,
    limit: 0,
    sort: ['order', 'name'],
  })
  return docs
})
