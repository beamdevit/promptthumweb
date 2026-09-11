import config from '@payload-config'
import { getPayload } from 'payload'

const card: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 8,
  padding: '16px 18px',
  background: 'var(--theme-elevation-0)',
}

const label: React.CSSProperties = {
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '.04em',
  color: 'var(--theme-elevation-600)',
  marginBottom: 6,
}

const value: React.CSSProperties = { fontSize: 30, fontWeight: 700, lineHeight: 1.1 }

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

  const [totalLeads, newLeads, recentWeek, mediaCount, recent] = await Promise.all([
    payload.count({ collection: 'leads' }),
    payload.count({ collection: 'leads', where: { status: { equals: 'new' } } }),
    payload.count({ collection: 'leads', where: { createdAt: { greater_than: sevenDaysAgo } } }),
    payload.count({ collection: 'media' }),
    payload.find({
      collection: 'leads',
      limit: 5,
      sort: '-createdAt',
      depth: 0,
    }),
  ])

  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
        }}
      >
        <div style={card}>
          <div style={label}>ข้อความติดต่อทั้งหมด</div>
          <div style={value}>{totalLeads.totalDocs}</div>
        </div>
        <div style={{ ...card, borderColor: newLeads.totalDocs > 0 ? '#f5a623' : undefined }}>
          <div style={label}>ยังไม่ได้ติดต่อ</div>
          <div style={{ ...value, color: newLeads.totalDocs > 0 ? '#d98f12' : undefined }}>
            {newLeads.totalDocs}
          </div>
        </div>
        <div style={card}>
          <div style={label}>7 วันล่าสุด</div>
          <div style={value}>{recentWeek.totalDocs}</div>
        </div>
        <div style={card}>
          <div style={label}>ไฟล์ใน Media</div>
          <div style={value}>{mediaCount.totalDocs}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '18px 0 24px' }}>
        <a className="btn btn--style-primary btn--size-small" href="/admin/collections/leads">
          ดูข้อความติดต่อ
        </a>
        <a className="btn btn--style-secondary btn--size-small" href="/admin/collections/media">
          อัปโหลดไฟล์
        </a>
        <a className="btn btn--style-secondary btn--size-small" href="/" target="_blank" rel="noreferrer">
          เปิดเว็บไซต์
        </a>
      </div>

      {recent.docs.length > 0 && (
        <div style={card}>
          <div style={{ ...label, marginBottom: 12 }}>ข้อความติดต่อล่าสุด</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recent.docs.map((lead) => (
              <a
                key={lead.id}
                href={`/admin/collections/leads/${lead.id}`}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'baseline',
                  padding: '8px 0',
                  borderTop: '1px solid var(--theme-elevation-100)',
                  textDecoration: 'none',
                }}
              >
                <strong style={{ minWidth: 140 }}>{lead.name}</strong>
                <span style={{ color: 'var(--theme-elevation-600)', flex: 1 }}>{lead.contact}</span>
                <span style={{ fontSize: 12 }}>{statusLabels[lead.status] ?? lead.status}</span>
                <span style={{ fontSize: 12, color: 'var(--theme-elevation-500)' }}>
                  {new Date(lead.createdAt).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit',
                  })}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
