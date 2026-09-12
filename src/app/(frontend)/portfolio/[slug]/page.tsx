import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'

import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { categoryLabel, coverOf, getPortfolioBySlug } from '@/lib/portfolio'
import type { Media } from '@/payload-types'

// Rendered per request: Railway's private network (and so Postgres) is not
// reachable during the build, so these pages must not be prerendered.
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getPortfolioBySlug(slug)

  if (!item) return { title: 'ไม่พบผลงาน · Promptthum' }

  return {
    title: `${item.title} · ผลงาน Promptthum`,
    description: item.summary || undefined,
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params
  const item = await getPortfolioBySlug(slug)

  if (!item) notFound()

  const cover = coverOf(item)
  const gallery = (item.gallery ?? [])
    .map((row) => (typeof row.image === 'object' ? (row.image as Media) : null))
    .filter((image): image is Media => Boolean(image?.url))

  return (
    <>
      <SiteHeader />

      <main>
        <section className="page-hero">
          <div className="wrap">
            <a className="work-back" href="/portfolio">← กลับไปหน้าผลงาน</a>
            <span className="page-hero-eyebrow">{categoryLabel(item.category)}</span>
            <h1>{item.title}</h1>
            {item.summary && <p>{item.summary}</p>}
            <dl className="work-facts">
              {item.client && (
                <div>
                  <dt>ลูกค้า</dt>
                  <dd>{item.client}</dd>
                </div>
              )}
              {item.year && (
                <div>
                  <dt>ปี</dt>
                  <dd>{item.year}</dd>
                </div>
              )}
              <div>
                <dt>ประเภทงาน</dt>
                <dd>{categoryLabel(item.category)}</dd>
              </div>
            </dl>
          </div>
        </section>

        {(cover?.url || item.description || gallery.length > 0 || (item.tags?.length ?? 0) > 0) && (
        <section className="work-detail">
          <div className="wrap">
            {cover?.url && (
              <figure className="work-detail-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover.url} alt={cover.alt || item.title} />
              </figure>
            )}

            {item.description && (
              <div className="work-prose">
                <RichText data={item.description} />
              </div>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="article-tags work-detail-tags">
                {item.tags.map((row) => (
                  <span className="tag" key={row.id ?? row.tag}>{row.tag}</span>
                ))}
              </div>
            )}

            {gallery.length > 0 && (
              <div className="work-gallery">
                {gallery.map((image) => (
                  <figure key={image.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url!} alt={image.alt || item.title} loading="lazy" />
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
        )}

        <section className="work-cta">
          <div className="wrap">
            <h2>อยากได้งานแบบนี้ไหม?</h2>
            <p>เริ่มต้น 3,000฿ · บอกงบและเป้าหมาย เราเสนอแพ็กเกจที่เหมาะที่สุด</p>
            <div className="work-cta-actions">
              <a className="btn btn-cta" href="/#contact">คุยกับทีม</a>
              <a className="btn btn-outline" href="/portfolio">ดูผลงานอื่น</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
