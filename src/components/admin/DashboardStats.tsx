import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { DashboardOverview } from './DashboardOverview'
import { VisitorDashboard } from './VisitorDashboard'

export async function DashboardStats({ initPageResult }: AdminViewServerProps) {
  const req = initPageResult.req
  if (!req.user) redirect('/admin/login')
  const payload = req.payload
  const access = { req, overrideAccess: false }
  try {
    const [
      leads,
      newLeads,
      articles,
      drafts,
      portfolio,
      unpublished,
      media,
      recent,
      video,
      contact,
      branding,
    ] = await Promise.all([
      payload.count({ ...access, collection: 'leads' }),
      payload.count({
        ...access,
        collection: 'leads',
        where: { status: { equals: 'new' } },
      }),
      payload.count({
        ...access,
        collection: 'articles',
        where: { _status: { equals: 'published' } },
      }),
      payload.count({
        ...access,
        collection: 'articles',
        where: { _status: { equals: 'draft' } },
      }),
      payload.count({
        ...access,
        collection: 'portfolio',
        where: { published: { equals: true } },
      }),
      payload.count({
        ...access,
        collection: 'portfolio',
        where: { published: { equals: false } },
      }),
      payload.count({ ...access, collection: 'media' }),
      payload.find({
        ...access,
        collection: 'leads',
        limit: 5,
        sort: '-createdAt',
        depth: 0,
      }),
      payload.findGlobal({ ...access, slug: 'site-video', depth: 0 }),
      payload.findGlobal({ ...access, slug: 'site-contact', depth: 0 }),
      payload.findGlobal({ ...access, slug: 'site-branding', depth: 0 }),
    ])
    return (
      <DashboardOverview
        analytics={<VisitorDashboard req={req} />}
        data={{
          leads: leads.totalDocs,
          newLeads: newLeads.totalDocs,
          articles: articles.totalDocs,
          drafts: drafts.totalDocs,
          portfolio: portfolio.totalDocs,
          unpublished: unpublished.totalDocs,
          media: media.totalDocs,
          recent: recent.docs,
          videoReady: Boolean(video.youtubeUrl || video.videoUrl),
          lineReady: Boolean(contact.lineUrl),
          qrReady: Boolean(contact.lineQr),
          customLogo: Boolean(branding.logo),
        }}
      />
    )
  } catch (error) {
    console.error('[admin dashboard] Unable to load overview', error)
    return (
      <div className="pt-dashboard">
        <div className="pt-card pt-load-error" role="alert">
          <h1>โหลดภาพรวมไม่สำเร็จ</h1>
          <p>ลองโหลดหน้าอีกครั้ง หรือเปิดเมนูด้านข้างเพื่อจัดการข้อมูล</p>
          <a className="pt-button" href="/admin">
            โหลดใหม่
          </a>
        </div>
      </div>
    )
  }
}
