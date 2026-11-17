import { T } from '@/components/site/SiteLanguage'
import type { Portfolio } from '@/payload-types'
import { categoryLabel, coverOf } from '@/lib/portfolio'
import { youtubeId } from '@/lib/youtube'
import { VideoCard } from '@/components/site/VideoCard'

export const videoIdOf = (item: Portfolio) => (item.youtubeUrl ? youtubeId(item.youtubeUrl.trim()) : null)

export function PortfolioCard({ item }: { item: Portfolio }) {
  const videoId = videoIdOf(item)
  const cover = coverOf(item)
  if (videoId) return <VideoCard videoId={videoId} title={item.title} cover={cover?.url || undefined} />
  if (!item.slug) return null

  return (
    <a className="work-card" href={`/portfolio/${encodeURIComponent(item.slug)}`}>
      <div className="work-thumb">
        {cover?.url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={cover.url} alt={cover.alt || item.title} loading="lazy" />
        ) : (
          <span className="work-thumb-fallback">{item.title}</span>
        )}
        <span className="work-cat"><T>{categoryLabel(item.category)}</T></span>
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
