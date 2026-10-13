import { T } from '@/components/site/SiteLanguage'
import type { Metadata } from 'next'

import { getPortfolioCategories } from '@/lib/categories'
import { PortfolioCard } from '@/components/site/PortfolioCard'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getPortfolio } from '@/lib/portfolio'

export const metadata: Metadata = {
  title: 'ผลงานของเรา · Promptthum',
  description:
    'ตัวอย่างผลงานออกแบบเว็บไซต์ กราฟิกดีไซน์ โลโก้ CI Ads Banner และงานสื่อโฆษณา โดยทีมงาน Promptthum',
}

// Rendered per request: Railway's private network (and so Postgres) is not
// reachable during the build, so these pages must not be prerendered.
export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ cat?: string }> }

export default async function PortfolioPage({ searchParams }: Props) {
  const { cat } = await searchParams
  const categories = await getPortfolioCategories()
  const active = categories.some((category) => category.slug === cat) ? cat : undefined
  const items = await getPortfolio({ category: active })

  return (
    <>
      <SiteHeader />

      <main>
        <section className="page-hero">
          <div className="wrap">
            <span className="page-hero-eyebrow">PORTFOLIO</span>
            <h1><T>ผลงานของเรา</T></h1>
            <p><T>รวมงานออกแบบเว็บไซต์ กราฟิกดีไซน์ แบรนด์ดิ้ง และสื่อโฆษณาที่เราทำให้ลูกค้าจริง เลือกดูตามหมวดที่สนใจได้เลย</T></p>
          </div>
        </section>

        <section className="work-section">
          <div className="wrap">
            <nav className="work-filters" aria-label="กรองตามหมวดหมู่">
              <a className={`work-filter${!active ? ' is-active' : ''}`} href="/portfolio"><T>ทั้งหมด</T></a>
              {categories.map((category) => (
                <a
                  key={category.id}
                  className={`work-filter${active === category.slug ? ' is-active' : ''}`}
                  href={`/portfolio?cat=${encodeURIComponent(category.slug)}`}
                >
                  <T>{category.name}</T>
                </a>
              ))}
            </nav>

            {items.length > 0 ? (
              <div className="work-grid">
                {items.map((item) => (
                  <PortfolioCard key={item.id} item={item} />
                ))}
              </div>
            ) : active ? (
              <p className="work-empty"><T>ยังไม่มีผลงานในหมวดนี้ —</T><a href="/portfolio"><T>ดูผลงานทั้งหมด</T></a>
              </p>
            ) : (
              <p className="work-empty">
                <T>กำลังจัดเตรียมผลงานเพื่อนำมาแสดง เร็ว ๆ นี้ —</T>{' '}
                <a href="/#contact"><T>สนใจงานแบบไหน คุยกับทีมได้เลย</T></a>
              </p>
            )}
          </div>
        </section>

        <section className="work-cta">
          <div className="wrap">
            <h2><T>มีงานในใจอยู่แล้ว?</T></h2>
            <p><T>บอกความต้องการและเป้าหมาย เพื่อให้เราช่วยวางแนวทางที่เหมาะกับธุรกิจ ทีมงานติดต่อกลับภายใน 24 ชม.</T></p>
            <div className="work-cta-actions">
              <a className="btn btn-cta" href="/#contact"><T>คุยกับทีม</T></a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
