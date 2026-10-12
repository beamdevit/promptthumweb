import { createHmac, randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import config from '@payload-config'
import { ANALYTICS_SESSION_SECONDS, deviceFromUserAgent, isBot, trackedPath, trafficSource } from '@/lib/visitor-analytics'

export const runtime = 'nodejs'
const VISITOR_COOKIE = 'pt-analytics-visitor'
const SESSION_COOKIE = 'pt-analytics-session'
const validID = (value: string | undefined) => value && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

async function readBody(request: Request) {
  const reader = request.body?.getReader()
  if (!reader) throw new Error('Missing body')
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.length
    if (size > 2048) { await reader.cancel(); throw new Error('Body too large') }
    chunks.push(value)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>
}

export async function POST(request: NextRequest) {
  const host = request.headers.get('host') || new URL(request.url).host
  try {
    if (new URL(request.headers.get('origin') || '').host !== host)
      return new NextResponse(null, { status: 403 })
  } catch { return new NextResponse(null, { status: 403 }) }

  let data: Record<string, unknown>
  try { data = await readBody(request) } catch { return new NextResponse(null, { status: 400 }) }
  if (!data || typeof data !== 'object') return new NextResponse(null, { status: 400 })
  const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' }
  if (data.consent === false) {
    const response = new NextResponse(null, { status: 204 })
    response.cookies.set(VISITOR_COOKIE, '', { ...cookieOptions, maxAge: 0 })
    response.cookies.set(SESSION_COOKIE, '', { ...cookieOptions, maxAge: 0 })
    return response
  }
  const agent = request.headers.get('user-agent') || ''
  const path = trackedPath(data.path)
  if (data.consent !== true || request.headers.get('dnt') === '1' || isBot(agent) || !path)
    return new NextResponse(null, { status: 204 })

  const existingVisitor = request.cookies.get(VISITOR_COOKIE)?.value
  const existingSession = request.cookies.get(SESSION_COOKIE)?.value
  const visitor = validID(existingVisitor) ? existingVisitor! : randomUUID()
  // A session is only reusable while the visitor identity is also present.
  const session = validID(existingSession) && validID(existingVisitor) ? existingSession! : randomUUID()
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (user) return new NextResponse(null, { status: 204 })
    const hash = (kind: string, value: string) => createHmac('sha256', payload.secret).update(kind + ':' + value).digest('hex')
    const source = trafficSource(data.referrer, data.campaign, host)
    const device = deviceFromUserAgent(agent)
    await payload.db.drizzle.execute(sql`INSERT INTO site_visits (session_hash, visitor_hash, source, device, landing_path, created_at, updated_at)
      VALUES (${hash('session', session)}, ${hash('visitor', visitor)}, ${source}, ${device}, ${path}, NOW(), NOW())
      ON CONFLICT (session_hash) DO NOTHING`)
    const response = new NextResponse(null, { status: 204 })
    response.cookies.set(VISITOR_COOKIE, visitor, { ...cookieOptions, maxAge: 365 * 86400 })
    response.cookies.set(SESSION_COOKIE, session, { ...cookieOptions, maxAge: ANALYTICS_SESSION_SECONDS })
    return response
  } catch (error) {
    console.error('[visitor analytics] Recording unavailable', error)
    return new NextResponse(null, { status: 503 })
  }
}
