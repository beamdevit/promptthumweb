import type { Lead } from '@/payload-types'
import type { ReactNode } from 'react'

export type DashboardData = {
  leads: number
  newLeads: number
  articles: number
  drafts: number
  portfolio: number
  unpublished: number
  media: number
  recent: Pick<Lead, 'id' | 'name' | 'contact' | 'status' | 'createdAt'>[]
  videoReady: boolean
  lineReady: boolean
  qrReady: boolean
  customLogo: boolean
}

const tasks = [
  {
    title: 'บทความ',
    description: 'เขียน แก้ไข และเผยแพร่บทความ',
    icon: '✎',
    href: '/admin/collections/articles',
    create: '/admin/collections/articles/create',
    action: 'เขียนบทความ',
  },
  {
    title: 'ผลงาน',
    description: 'จัดการผลงานและภาพแกลเลอรี',
    icon: '▦',
    href: '/admin/collections/portfolio',
    create: '/admin/collections/portfolio/create',
    action: 'เพิ่มผลงาน',
  },
  {
    title: 'หมวดหมู่บทความ',
    description: 'เพิ่ม เปลี่ยนชื่อ และจัดลำดับหมวดหมู่บทความ',
    icon: '≡',
    href: '/admin/collections/article-categories',
    create: '/admin/collections/article-categories/create',
    action: 'เพิ่มหมวดหมู่',
  },
  {
    title: 'หมวดหมู่ผลงาน',
    description: 'จัดหมวดหมู่และตัวกรองผลงานบนเว็บไซต์',
    icon: '≡',
    href: '/admin/collections/portfolio-categories',
    create: '/admin/collections/portfolio-categories/create',
    action: 'เพิ่มหมวดหมู่',
  },
  {
    title: 'คลังรูปและวิดีโอ',
    description: 'ค้นหาและอัปโหลดไฟล์สำหรับเว็บไซต์',
    icon: '▧',
    href: '/admin/collections/media',
    create: '/admin/collections/media/create',
    action: 'อัปโหลดไฟล์',
  },
  {
    title: 'About Us / เกี่ยวกับเรา',
    description: 'แก้ไขเรื่องราว หัวข้อ และรูปภาพ ทั้งภาษาไทยและอังกฤษ',
    icon: '✎',
    href: '/admin/globals/site-about',
    action: 'แก้ไข About Us',
  },
  {
    title: 'โลโก้เว็บไซต์',
    description: 'เปลี่ยนโลโก้หลักของเว็บไซต์และหน้า Welcome',
    icon: 'P',
    href: '/admin/globals/site-branding',
    action: 'เปลี่ยนโลโก้',
  },
  {
    title: 'วิดีโอเว็บไซต์',
    description: 'เปลี่ยนวิดีโอหน้าแรกและ Welcome',
    icon: '▷',
    href: '/admin/globals/site-video',
    action: 'แก้ไขวิดีโอ',
  },
  {
    title: 'LINE และ QR',
    description: 'ตั้งค่าปุ่มแอด LINE และภาพ QR',
    icon: '◎',
    href: '/admin/globals/site-contact',
    action: 'แก้ไขข้อมูลติดต่อ',
  },
  {
    title: 'ข้อความลูกค้า',
    description: 'อ่านและติดตามผู้ที่ส่งฟอร์มติดต่อ',
    icon: '✉',
    href: '/admin/collections/leads',
    action: 'ดูข้อความ',
  },
]

const statusLabels: Record<string, string> = {
  new: 'รอติดต่อกลับ',
  contacting: 'กำลังติดต่อ',
  quoted: 'เสนอราคาแล้ว',
  won: 'ปิดการขาย',
  lost: 'ไม่สนใจ',
}
const number = (value: number) => value.toLocaleString('th-TH')

export function DashboardOverview({ data, analytics }: { data: DashboardData; analytics?: ReactNode }) {
  const metrics = [
    {
      title: 'บทความเผยแพร่',
      value: data.articles,
      detail: `ฉบับร่าง ${number(data.drafts)} รายการ`,
      href: '/admin/collections/articles',
    },
    {
      title: 'ผลงานเผยแพร่',
      value: data.portfolio,
      detail: `ยังไม่เผยแพร่ ${number(data.unpublished)} รายการ`,
      href: '/admin/collections/portfolio',
    },
    {
      title: 'รอติดต่อกลับ',
      value: data.newLeads,
      detail: `ข้อความทั้งหมด ${number(data.leads)} รายการ`,
      href: '/admin/collections/leads?where[status][equals]=new',
    },
    {
      title: 'ไฟล์ในคลังสื่อ',
      value: data.media,
      detail: 'รูปภาพและวิดีโอทั้งหมด',
      href: '/admin/collections/media',
    },
  ]
  return (
    <div className="pt-dashboard">
      <header className="pt-dashboard-heading">
        <div>
          <p className="pt-eyebrow">PROMPTTHUM / WORKSPACE</p>
          <h1>จัดการเว็บไซต์</h1>
          <p>เลือกงานที่ต้องการทำ หรือดูสถานะเนื้อหาและข้อความล่าสุด</p>
        </div>
        <a
          className="pt-button pt-button--outline"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          เปิดเว็บไซต์ ↗
        </a>
      </header>
      {analytics}
      <section className="pt-task-section" aria-labelledby="pt-tasks">
        <div className="pt-section-heading">
          <h2 id="pt-tasks">วันนี้ต้องการทำอะไร?</h2>
          <p>เข้าถึงงานประจำได้จากที่นี่</p>
        </div>
        <div className="pt-task-grid">
          {tasks.map((task) => (
            <article className="pt-card pt-task" key={task.title}>
              <div className="pt-task-title">
                <span className="pt-icon" aria-hidden="true">
                  {task.icon}
                </span>
                <h3>{task.title}</h3>
              </div>
              <p>{task.description}</p>
              <div className="pt-task-actions">
                <a
                  className="pt-button pt-button--small"
                  href={task.create || task.href}
                >
                  {task.action}
                </a>
                {task.create && (
                  <a className="pt-text-link" href={task.href}>
                    ดูทั้งหมด →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="pt-summary" aria-labelledby="pt-summary">
        <div className="pt-section-heading">
          <h2 id="pt-summary">สถานะเว็บไซต์</h2>
        </div>
        <div className="pt-metrics">
          {metrics.map((metric) => (
            <a
              className="pt-card pt-metric"
              key={metric.title}
              href={metric.href}
            >
              <span className="pt-metric-label">{metric.title}</span>
              <strong>{number(metric.value)}</strong>
              <span className="pt-hint">{metric.detail}</span>
            </a>
          ))}
        </div>
      </section>
      <div className="pt-dashboard-grid">
        <section className="pt-card pt-activity">
          <div className="pt-card-heading">
            <h2>ข้อความลูกค้าล่าสุด</h2>
            <a href="/admin/collections/leads">ดูทั้งหมด →</a>
          </div>
          {data.recent.length ? (
            <ul className="pt-activity-list">
              {data.recent.map((lead) => (
                <li key={lead.id}>
                  <a href={`/admin/collections/leads/${lead.id}`}>
                    <span className="pt-icon" aria-hidden="true">
                      {(lead.name || 'P').slice(0, 1)}
                    </span>
                    <div className="pt-activity-copy">
                      <strong>{lead.name}</strong>
                      <span>{lead.contact}</span>
                      <span className={'pt-status pt-status--' + lead.status}>
                        {statusLabels[lead.status] ?? lead.status}
                      </span>
                    </div>
                    <time dateTime={lead.createdAt}>
                      {new Date(lead.createdAt).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        timeZone: 'Asia/Bangkok',
                      })}
                    </time>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="pt-empty">
              <h3>ยังไม่มีข้อความลูกค้า</h3>
              <p>ข้อความจากฟอร์มติดต่อบนเว็บไซต์จะแสดงที่นี่</p>
              <a
                className="pt-text-link"
                href="/#contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                ดูฟอร์มติดต่อ ↗
              </a>
            </div>
          )}
        </section>
        <aside className="pt-side-cards">
          <section className="pt-card">
            <h2>ตั้งค่าเว็บไซต์</h2>
            <ul className="pt-settings-list">
              <li>
                <a href="/admin/globals/site-branding">
                  <span>โลโก้เว็บไซต์</span>
                  <span className="pt-status">
                    {data.customLogo ? 'กำหนดเอง' : 'ใช้โลโก้เดิม'}
                  </span>
                </a>
              </li>
              <li>
                <a href="/admin/globals/site-video">
                  <span>วิดีโอเว็บไซต์</span>
                  <span
                    className={`pt-status${data.videoReady ? '' : ' pt-status--missing'}`}
                  >
                    {data.videoReady ? 'ตั้งค่าแล้ว' : 'ยังไม่ตั้งค่า'}
                  </span>
                </a>
              </li>
              <li>
                <a href="/admin/globals/site-contact">
                  <span>ลิงก์ LINE</span>
                  <span
                    className={`pt-status${data.lineReady ? '' : ' pt-status--missing'}`}
                  >
                    {data.lineReady ? 'ตั้งค่าแล้ว' : 'ยังไม่ตั้งค่า'}
                  </span>
                </a>
              </li>
              <li>
                <a href="/admin/globals/site-contact">
                  <span>ภาพ QR LINE</span>
                  <span
                    className={`pt-status${data.qrReady ? '' : ' pt-status--missing'}`}
                  >
                    {data.qrReady ? 'ตั้งค่าแล้ว' : 'ยังไม่ตั้งค่า'}
                  </span>
                </a>
              </li>
            </ul>
          </section>
          <section className="pt-card pt-help">
            <h2>ก่อนเผยแพร่</h2>
            <ol>
              <li>ใส่ชื่อและเนื้อหาให้ครบ</li>
              <li>เลือกภาพปกจากคลังสื่อ</li>
              <li>
                บทความ: กดบันทึกร่างหรือเผยแพร่
                <br />
                ผลงาน: เปิด “เผยแพร่” แล้วบันทึก
              </li>
            </ol>
            <a className="pt-text-link" href="/admin/account">
              จัดการบัญชีของฉัน →
            </a>
          </section>
        </aside>
      </div>
    </div>
  )
}
