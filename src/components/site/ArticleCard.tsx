import type { Article } from '@/payload-types'
import { articleCover, articleDate } from '@/lib/articles'

export function ArticleCard({ article }: { article: Article }) {
  const cover = articleCover(article)
  const date = article.publishedAt || article.createdAt
  return <a className="article-card" href={`/articles/${encodeURIComponent(article.slug)}`}>
    <div className="article-thumb">
      {cover?.url && <img className="article-cover-image" src={cover.sizes?.card?.url || cover.url} alt={cover.alt || article.title} loading="lazy" />}
      <span className="article-thumb-logo">promptthum</span>
      <div className="article-thumb-overlay"><span className="article-thumb-tag">{article.category || 'บทความ'}</span><div className="article-thumb-title">{article.title}</div></div>
    </div>
    <div className="article-body">
      <time dateTime={date}>{articleDate(date)}</time><h3>{article.title}</h3>
      {article.summary && <p className="article-summary">{article.summary}</p>}
      <div className="article-tags">{article.tags?.map(row => <span className="tag" key={row.id || row.tag}>{row.tag}</span>)}</div>
      <span className="read-more">อ่านต่อ →</span>
    </div>
  </a>
}
