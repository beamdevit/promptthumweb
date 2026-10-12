import type { PayloadRequest } from 'payload'
import { defaultVisitorRange } from '@/lib/visitor-analytics'
import { getVisitorReport } from '@/lib/visitor-report'
import { VisitorAnalytics } from './VisitorAnalytics'

export async function VisitorDashboard({ req }: { req: PayloadRequest }) {
  if (!req.user) return null
  const range = defaultVisitorRange()
  try {
    const data = await getVisitorReport(req.payload, range.start, range.end)
    return <VisitorAnalytics initialData={data} initialRange={range} />
  } catch (error) {
    console.error('[visitor analytics] Dashboard unavailable', error)
    return <VisitorAnalytics initialData={null} initialRange={range} />
  }
}
