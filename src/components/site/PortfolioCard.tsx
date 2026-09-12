import type { Portfolio } from '@/payload-types'
import { categoryLabel, coverOf } from '@/lib/portfolio'

export function PortfolioCard({ item }: { item: Portfolio }) {
  const cover = coverOf(item)

  return (
    <a className="work-card" href={`/portfolio/${item.slug}`}>
      <div className="work-thumb">
        {cover?.url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={cover.url} alt={cover.alt || item.title} loading="lazy" />
        ) : (
          <span className="work-thumb-fallback">{item.title}</span>
        )}
        <span className="work-cat">{categoryLabel(item.category)}</span>
      </div>
      <div className="work-body">
        <h3>{item.title}</h3>
        {item.summary && <p>{item.summary}</p>}
        <div className="work-meta">
          {item.client && <span>{item.client}</span>}
          {item.year && <span>{item.year}</span>}
        </div>
      </div>
    </a>
  )
}
