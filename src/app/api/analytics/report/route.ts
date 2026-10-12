import { getPayload } from 'payload'
import config from '@payload-config'
import { getVisitorReport } from '@/lib/visitor-report'
import { visitorRange } from '@/lib/visitor-analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return Response.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
  const params = new URL(request.url).searchParams
  const start = params.get('start') || ''
  const end = params.get('end') || ''
  try {
    visitorRange(start, end)
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 })
  }
  try {
    return Response.json(await getVisitorReport(payload, start, end), { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) {
    console.error('[visitor analytics] Report unavailable', error)
    return Response.json({ error: 'โหลดสถิติไม่สำเร็จ กรุณาลองอีกครั้ง' }, { status: 500 })
  }
}
