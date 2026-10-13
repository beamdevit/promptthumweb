import { T, SiteDate } from '@/components/site/SiteLanguage'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { articleCategoryLabel, articleCover, getArticleBySlug } from '@/lib/articles'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug((await params).slug)
  if (!article) return { title: 'ไม่พบบทความ · Promptthum' }
  const cover = articleCover(article)
  return { title: `${article.title} · Promptthum`, description: article.summary || undefined,
    openGraph: { type: 'article', title: article.title, description: article.summary || undefined, images: cover?.url ? [cover.url] : undefined } }
}
export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug((await params).slug)
  if (!article) notFound()
  const cover = articleCover(article)
  const date = article.publishedAt || article.createdAt
  return <><SiteHeader /><main>
    <section className="page-hero"><div className="wrap"><a className="work-back" href="/articles"><T>← บทความทั้งหมด</T></a><span className="page-hero-eyebrow"><T>{articleCategoryLabel(article.category)}</T></span><h1>{article.title}</h1>{article.summary && <p>{article.summary}</p>}<time dateTime={date}><SiteDate value={date} /></time></div></section>
    <article className="article-detail wrap">
      {cover?.url && <figure className="article-detail-cover"><img src={cover.sizes?.hero?.url || cover.url} alt={cover.alt || article.title} />{cover.caption && <figcaption>{cover.caption}</figcaption>}</figure>}
      <div className="work-prose article-prose"><RichText data={article.content} /></div>
      <div className="article-tags">{article.tags?.map(row => <span className="tag" key={row.id || row.tag}>{row.tag}</span>)}</div>
      <a className="article-back" href="/articles"><T>← กลับไปหน้าบทความ</T></a>
    </article>
  </main><SiteFooter /></>
}
