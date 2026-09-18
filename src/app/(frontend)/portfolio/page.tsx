import type { Metadata } from 'next'

import { PORTFOLIO_CATEGORIES } from '@/collections/Portfolio'
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
  const active = PORTFOLIO_CATEGORIES.some((category) => category.value === cat) ? cat : undefined
  const items = await getPortfolio({ category: active })

  return (
    <>
      <SiteHeader />

      <main>
        <section className="page-hero">
          <div className="wrap">
            <span className="page-hero-eyebrow">PORTFOLIO</span>
            <h1>ผลงานของเรา</h1>
            <p>
              รวมงานออกแบบเว็บไซต์ กราฟิกดีไซน์ แบรนด์ดิ้ง และสื่อโฆษณาที่เราทำให้ลูกค้าจริง
              เลือกดูตามหมวดที่สนใจได้เลย
            </p>
          </div>
        </section>

        <section className="work-section">
          <div className="wrap">
            <nav className="work-filters" aria-label="กรองตามหมวดหมู่">
              <a className={`work-filter${!active ? ' is-active' : ''}`} href="/portfolio">
                ทั้งหมด
              </a>
              {PORTFOLIO_CATEGORIES.map((category) => (
                <a
                  key={category.value}
                  className={`work-filter${active === category.value ? ' is-active' : ''}`}
                  href={`/portfolio?cat=${category.value}`}
                >
                  {category.label}
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
              <p className="work-empty">
                ยังไม่มีผลงานในหมวดนี้ — <a href="/portfolio">ดูผลงานทั้งหมด</a>
              </p>
            ) : (
              <p className="work-empty">
                กำลังจัดเตรียมผลงานเพื่อนำมาแสดง เร็ว ๆ นี้ —{' '}
                <a href="/#contact">สนใจงานแบบไหน คุยกับทีมได้เลย</a>
              </p>
            )}
          </div>
        </section>

        <section className="work-cta">
          <div className="wrap">
            <h2>มีงานในใจอยู่แล้ว?</h2>
            <p>บอกความต้องการและเป้าหมาย เพื่อให้เราช่วยวางแนวทางที่เหมาะกับธุรกิจ ทีมงานติดต่อกลับภายใน 24 ชม.</p>
            <div className="work-cta-actions">
              <a className="btn btn-cta" href="/#contact">คุยกับทีม</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
