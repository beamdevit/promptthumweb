import config from '@payload-config'
import { getPayload } from 'payload'

const statusLabels: Record<string, string> = {
  new: 'ใหม่',
  contacting: 'กำลังติดต่อ',
  quoted: 'เสนอราคาแล้ว',
  won: 'ปิดการขาย',
  lost: 'ไม่สนใจ',
}

export async function DashboardStats() {
  const payload = await getPayload({ config })

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [totalLeads, newLeads, recentWeek, portfolioCount, mediaCount, recent] = await Promise.all([
    payload.count({ collection: 'leads' }),
    payload.count({ collection: 'leads', where: { status: { equals: 'new' } } }),
    payload.count({ collection: 'leads', where: { createdAt: { greater_than: sevenDaysAgo } } }),
    payload.count({ collection: 'portfolio', where: { published: { equals: true } } }),
    payload.count({ collection: 'media' }),
    payload.find({
      collection: 'leads',
      limit: 5,
      sort: '-createdAt',
      depth: 0,
    }),
  ])

  const metrics = [
    { label: 'ข้อความติดต่อทั้งหมด', value: totalLeads.totalDocs, hint: 'ข้อมูลลูกค้าจากหน้าเว็บไซต์', icon: '↗', href: '/admin/collections/leads' },
    { label: 'รอการติดต่อกลับ', value: newLeads.totalDocs, hint: 'ข้อความที่มีสถานะใหม่', icon: '◎', href: '/admin/collections/leads?where[status][equals]=new' },
    { label: 'ผู้ติดต่อใน 7 วัน', value: recentWeek.totalDocs, hint: 'นับจากวันที่ส่งข้อความ', icon: '◷', href: '/admin/collections/leads' },
    { label: 'ผลงานที่เผยแพร่', value: portfolioCount.totalDocs, hint: 'ผลงานที่แสดงบนเว็บไซต์', icon: '▦', href: '/admin/collections/portfolio' },
  ]
  const contacted = Math.max(0, totalLeads.totalDocs - newLeads.totalDocs)
  const percent = totalLeads.totalDocs ? Math.round(contacted / totalLeads.totalDocs * 100) : 0
  return (
    <div className="pt-dashboard">
      <header className="pt-dashboard-heading">
        <div><p className="pt-eyebrow">PROMPTTHUM / WORKSPACE</p><h1>ภาพรวมระบบ</h1><p>ยินดีต้อนรับ จัดการเว็บไซต์และติดตามผู้ติดต่อได้จากที่นี่</p></div>
        <a className="pt-button" href="/" target="_blank" rel="noopener noreferrer">เปิดเว็บไซต์ ↗</a>
      </header>
      <div className="pt-metrics">{metrics.map(m => <a className="pt-card pt-metric" key={m.label} href={m.href}><div className="pt-metric-top"><span className="pt-icon" aria-hidden="true">{m.icon}</span><span aria-hidden="true">↗</span></div><span className="pt-metric-label">{m.label}</span><strong>{m.value.toLocaleString('th-TH')}</strong><span className="pt-hint">{m.hint}</span></a>)}</div>
      <div className="pt-dashboard-grid">
        <section className="pt-card pt-activity"><div className="pt-card-heading"><h2>ข้อความติดต่อล่าสุด</h2><a href="/admin/collections/leads">ดูทั้งหมด →</a></div>
          {recent.docs.length ? <ul className="pt-activity-list">{recent.docs.map(lead => <li key={lead.id}><a href={`/admin/collections/leads/${lead.id}`}><span className="pt-icon" aria-hidden="true">{(lead.name || 'P').slice(0,1)}</span><div className="pt-activity-copy"><strong>{lead.name}</strong><span>{lead.contact}</span><span className={'pt-status pt-status--'+lead.status}>{statusLabels[lead.status] ?? lead.status}</span></div><time dateTime={lead.createdAt}>{new Date(lead.createdAt).toLocaleDateString('th-TH',{day:'numeric',month:'short',timeZone:'Asia/Bangkok'})}</time></a></li>)}</ul> : <div className="pt-empty"><span className="pt-icon" aria-hidden="true">◎</span><h3>ยังไม่มีข้อความติดต่อ</h3><p>ข้อความจากแบบฟอร์มบนเว็บไซต์จะแสดงที่นี่</p></div>}
        </section>
        <aside className="pt-side-cards"><section className="pt-card"><h2>สถานะการติดตาม</h2><div className="pt-progress-label"><span>เปลี่ยนจากสถานะใหม่แล้ว</span><strong>{percent}%</strong></div><progress max="100" value={percent} aria-label="สัดส่วนผู้ติดต่อที่เปลี่ยนจากสถานะใหม่แล้ว"/><p className="pt-hint">{contacted} จาก {totalLeads.totalDocs} รายการ</p><div className="pt-stat-row"><span>รอติดต่อกลับ</span><strong>{newLeads.totalDocs}</strong></div><div className="pt-stat-row"><span>ไฟล์ในคลังสื่อ</span><strong>{mediaCount.totalDocs}</strong></div></section>
        <section className="pt-card"><h2>จัดการด่วน</h2><div className="pt-quick-links"><a href="/admin/collections/portfolio/create"><span>เพิ่มผลงานใหม่</span><span aria-hidden="true">＋</span></a><a href="/admin/collections/media/create"><span>อัปโหลดรูปและไฟล์</span><span aria-hidden="true">↑</span></a><a href="/admin/account"><span>บัญชีของฉัน</span><span aria-hidden="true">→</span></a></div></section></aside>
      </div>
    </div>
  )
}
