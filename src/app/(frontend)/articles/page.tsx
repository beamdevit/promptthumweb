import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/site/ArticleCard'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { getArticles } from '@/lib/articles'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'บทความ · Promptthum', description: 'ความรู้ด้านเว็บไซต์ การตลาดออนไลน์ และงานออกแบบจาก Promptthum' }

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: input } = await searchParams
  const page = input === undefined ? 1 : Number(input)
  if (!Number.isSafeInteger(page) || page < 1) notFound()
  const result = await getArticles(page)
  if (page > Math.max(1, result.totalPages)) notFound()
  return <><SiteHeader /><main>
    <section className="page-hero"><div className="wrap"><span className="page-hero-eyebrow">PROMPTTHUM / JOURNAL</span><h1>บทความ</h1><p>อัปเดตความรู้ด้านการตลาดออนไลน์และงานออกแบบเว็บไซต์</p></div></section>
    <section className="articles"><div className="wrap">
      {result.docs.length ? <div className="articles-grid">{result.docs.map(article => <ArticleCard key={article.id} article={article} />)}</div> : <div className="articles-empty"><h2>เตรียมพบกับบทความจาก Promptthum</h2><p>เรากำลังเตรียมความรู้และไอเดียใหม่ ๆ มาแบ่งปัน</p><a href="/">กลับหน้าแรก →</a></div>}
      {result.totalPages > 1 && <nav className="articles-pagination" aria-label="หน้าบทความ">{result.hasPrevPage && <a href={`/articles?page=${page - 1}`}>← ก่อนหน้า</a>}<span>หน้า {page} / {result.totalPages}</span>{result.hasNextPage && <a href={`/articles?page=${page + 1}`}>ถัดไป →</a>}</nav>}
    </div></section>
  </main><SiteFooter /></>
}
