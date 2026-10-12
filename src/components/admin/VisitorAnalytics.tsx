'use client'

import { useEffect, useRef, useState } from 'react'
import { defaultVisitorRange, sourceLabel, thaiDay, type VisitorDevice, type VisitorReport } from '@/lib/visitor-analytics'

const devices: Record<VisitorDevice, string> = { mobile: 'โทรศัพท์', tablet: 'แท็บเล็ต', desktop: 'คอมพิวเตอร์', other: 'อุปกรณ์อื่น ๆ' }
const count = (value: number) => value.toLocaleString('th-TH')
const dayLabel = (value: string) => new Date(value + 'T12:00:00+07:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })

function DailyChart({ data }: { data: VisitorReport }) {
  if (!data.visits) return <div className="pt-chart-empty">ยังไม่มีผู้เข้าชมในช่วงวันที่เลือก</div>
  const max = Math.max(1, ...data.daily.map(day => day.visits))
  const points = data.daily.map((day, i) => ({
    ...day,
    x: data.daily.length === 1 ? 500 : 20 + (i / (data.daily.length - 1)) * 960,
    y: 165 - (day.visits / max) * 145,
  }))
  const line = points.map(p => `${p.x},${p.y}`).join(' ')
  return (
    <div className="pt-daily-chart">
      <div className="pt-chart-scale"><span>{count(max)} ครั้ง</span><span>0</span></div>
      <svg viewBox="0 0 1000 180" role="img" aria-label={`กราฟการเข้าชมรายวัน ${dayLabel(data.start)} ถึง ${dayLabel(data.end)} รวม ${count(data.visits)} ครั้ง`}>
        <line x1="20" x2="980" y1="20" y2="20" stroke="#e1e7ef" />
        <line x1="20" x2="980" y1="92" y2="92" stroke="#e1e7ef" />
        <line x1="20" x2="980" y1="165" y2="165" stroke="#e1e7ef" />
        <polygon points={`${points[0].x},165 ${line} ${points[points.length - 1].x},165`} fill="#016ac612" />
        <polyline points={line} fill="none" stroke="#016ac6" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        {points.map(p => <circle key={p.date} cx={p.x} cy={p.y} r={data.daily.length > 90 ? 2 : 5} fill="#016ac6"><title>{`${dayLabel(p.date)}: ${count(p.visits)} ครั้ง`}</title></circle>)}
      </svg>
      <div className="pt-chart-dates"><span>{dayLabel(data.start)}</span><span>{dayLabel(data.end)}</span></div>
      <details className="pt-daily-details">
        <summary>ดูตัวเลขรายวัน</summary>
        <div className="pt-daily-table"><table><thead><tr><th>วันที่</th><th>การเข้าชม</th></tr></thead><tbody>{data.daily.map(day => <tr key={day.date}><td>{dayLabel(day.date)}</td><td>{count(day.visits)}</td></tr>)}</tbody></table></div>
      </details>
    </div>
  )
}

function Distribution({ items, total }: { items: { label: string; visits: number }[]; total: number }) {
  if (!items.length) return <p className="pt-distribution-empty">ยังไม่มีข้อมูลในช่วงนี้</p>
  return <ul className="pt-distribution">{items.map(item => (
    <li key={item.label}>
      <div><span>{item.label}</span><strong>{count(item.visits)} <small>({total ? Math.round(item.visits / total * 100) : 0}%)</small></strong></div>
      <div className="pt-distribution-bar"><span style={{ width: `${total ? item.visits / total * 100 : 0}%` }} /></div>
    </li>
  ))}</ul>
}

export function VisitorAnalytics({ initialData, initialRange }: { initialData: VisitorReport | null; initialRange: { start: string; end: string } }) {
  const [data, setData] = useState(initialData)
  const [range, setRange] = useState(initialRange)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(initialData ? '' : 'โหลดสถิติไม่สำเร็จ กรุณาลองอีกครั้ง')
  const pending = useRef<AbortController | null>(null)
  useEffect(() => () => pending.current?.abort(), [])

  async function load(next = range) {
    pending.current?.abort()
    const controller = new AbortController()
    pending.current = controller
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/analytics/report?' + new URLSearchParams(next), { signal: controller.signal, cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'โหลดสถิติไม่สำเร็จ')
      if (!controller.signal.aborted) setData(result)
    } catch (error) {
      if (!controller.signal.aborted) setError((error as Error).message)
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  const sourceCounts = new Map<string, number>()
  for (const source of data?.sources || []) {
    const label = sourceLabel(source.label)
    sourceCounts.set(label, (sourceCounts.get(label) || 0) + source.visits)
  }
  const sources = Array.from(sourceCounts, ([label, visits]) => ({ label, visits })).sort((a, b) => b.visits - a.visits)

  return (
    <section className="pt-analytics" aria-labelledby="pt-visitors" aria-busy={loading}>
      <div className="pt-section-heading pt-analytics-heading"><div><h2 id="pt-visitors">ผู้เข้าชมเว็บไซต์</h2><p>สถิติการเข้าชมจริง • เวลาไทย (UTC+7)</p></div><span className="pt-analytics-badge">{data ? `สะสม ${count(data.allTime)} ครั้ง` : 'สถิติเข้าชม'}</span></div>
      <div className="pt-card pt-analytics-filter">
        <form onSubmit={event => {
          event.preventDefault()
          // Read the native controls at submission, including calendar edits.
          const form = new FormData(event.currentTarget)
          const next = { start: String(form.get('start') || ''), end: String(form.get('end') || '') }
          setRange(next)
          void load(next)
        }}>
          <label>ตั้งแต่วันที่<input name="start" aria-label="ตั้งแต่วันที่" type="date" required value={range.start} max={thaiDay()} onInput={e => setRange({ ...range, start: e.currentTarget.value })} onChange={e => setRange({ ...range, start: e.target.value })} /></label>
          <span className="pt-date-separator" aria-hidden="true">→</span>
          <label>ถึงวันที่<input name="end" aria-label="ถึงวันที่" type="date" required value={range.end} max={thaiDay()} onInput={e => setRange({ ...range, end: e.currentTarget.value })} onChange={e => setRange({ ...range, end: e.target.value })} /></label>
          <button type="submit" className="pt-button pt-button--small" disabled={loading}>{loading ? 'กำลังโหลด…' : 'ดูสถิติ'}</button>
        </form>
        <div className="pt-analytics-presets">{[{ days: 1, label: 'วันนี้' }, { days: 7, label: '7 วัน' }, { days: 30, label: '30 วัน' }].map(preset => (
          <button key={preset.days} type="button" disabled={loading} onClick={() => { const next = defaultVisitorRange(new Date(), preset.days); setRange(next); void load(next) }}>{preset.label}</button>
        ))}</div>
      </div>
      {error && <div className="pt-analytics-error" role="alert">{error}<button type="button" onClick={() => void load()} disabled={loading}>ลองอีกครั้ง</button></div>}
      {data && <>
        <p className="pt-analytics-period" role="status">แสดงข้อมูล {dayLabel(data.start)} – {dayLabel(data.end)} {new Date(data.end + 'T12:00:00+07:00').getFullYear() + 543}</p>
        <div className="pt-visitor-metrics">
          {[
            { label: 'ผู้เข้าชมทั้งหมด', value: data.visits, detail: 'รอบการเข้าชมในช่วงวันที่เลือก', icon: '↗' },
            { label: 'ผู้เข้าชมวันนี้', value: data.today, detail: 'วันนี้ตามเวลาไทย', icon: '◷' },
            { label: 'ผู้เข้าชมไม่ซ้ำ', value: data.uniqueVisitors, detail: 'เบราว์เซอร์ไม่ซ้ำในช่วงวันที่เลือก', icon: '◎' },
          ].map(metric => <article className="pt-card pt-visitor-metric" key={metric.label}><div><span className="pt-icon" aria-hidden="true">{metric.icon}</span><h3>{metric.label}</h3></div><strong>{count(metric.value)}</strong><p>{metric.detail}</p></article>)}
        </div>
        <div className="pt-card pt-chart-card"><div className="pt-card-heading"><h3>การเข้าชมรายวัน</h3><span className="pt-hint">เลื่อนเมาส์บนจุดเพื่อดูจำนวน</span></div><DailyChart data={data} /></div>
        <div className="pt-visitor-breakdown"><section className="pt-card"><h3>แหล่งที่มาของผู้เข้าชม</h3><Distribution items={sources} total={data.visits} /></section><section className="pt-card"><h3>อุปกรณ์ที่ใช้เข้าชม</h3><Distribution items={data.devices.map(item => ({ label: devices[item.label], visits: item.visits }))} total={data.visits} /></section></div>
      </>}
      <p className="pt-analytics-note">เริ่มนับเมื่อเปิดระบบนี้และผู้ชมยอมรับคุกกี้ • หนึ่งรอบการเข้าชมหมดอายุเมื่อไม่ใช้งาน 30 นาที • ไม่นับบอตและผู้ที่ล็อกอินหลังบ้าน{data?.startedAt ? ` • ข้อมูลแรก ${new Date(data.startedAt).toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })}` : ''}</p>
    </section>
  )
}
