import type { Payload } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import { shiftDay, visitorRange, type VisitorDevice, type VisitorReport } from './visitor-analytics'

export async function getVisitorReport(payload: Payload, start: string, end: string): Promise<VisitorReport> {
  const range = visitorRange(start, end)
  const execute = (query: ReturnType<typeof sql>) => payload.db.drizzle.execute(query)
  const [totals, lifetime, daily, sources, devices] = await Promise.all([
    execute(sql`SELECT COUNT(*) AS visits, COUNT(DISTINCT visitor_hash) AS unique_visitors
      FROM site_visits WHERE created_at >= ${range.from} AND created_at < ${range.until}`),
    execute(sql`SELECT COUNT(*) AS all_time, MIN(created_at) AS started_at,
      COUNT(*) FILTER (WHERE created_at >= ${range.todayFrom} AND created_at < ${range.todayUntil}) AS today
      FROM site_visits`),
    execute(sql`SELECT to_char(created_at AT TIME ZONE 'Asia/Bangkok', 'YYYY-MM-DD') AS day, COUNT(*) AS visits
      FROM site_visits WHERE created_at >= ${range.from} AND created_at < ${range.until}
      GROUP BY day ORDER BY day`),
    execute(sql`SELECT source AS label, COUNT(*) AS visits FROM site_visits
      WHERE created_at >= ${range.from} AND created_at < ${range.until}
      GROUP BY source ORDER BY visits DESC, source ASC`),
    execute(sql`SELECT device AS label, COUNT(*) AS visits FROM site_visits
      WHERE created_at >= ${range.from} AND created_at < ${range.until}
      GROUP BY device ORDER BY visits DESC, device ASC`),
  ])
  const days = new Map(daily.rows.map(row => [String(row.day), Number(row.visits)]))
  const series: VisitorReport['daily'] = []
  for (let day = start; day <= end; day = shiftDay(day, 1)) series.push({ date: day, visits: days.get(day) || 0 })
  return {
    start,
    end,
    visits: Number(totals.rows[0]?.visits || 0),
    uniqueVisitors: Number(totals.rows[0]?.unique_visitors || 0),
    allTime: Number(lifetime.rows[0]?.all_time || 0),
    today: Number(lifetime.rows[0]?.today || 0),
    startedAt: lifetime.rows[0]?.started_at ? new Date(String(lifetime.rows[0].started_at)).toISOString() : null,
    daily: series,
    sources: sources.rows.map(row => ({ label: String(row.label), visits: Number(row.visits) })),
    devices: devices.rows.map(row => ({ label: String(row.label) as VisitorDevice, visits: Number(row.visits) })),
  }
}
