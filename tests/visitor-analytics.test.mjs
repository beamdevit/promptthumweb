// Node 24: node --experimental-vm-modules --test --test-isolation=none tests/visitor-analytics.test.mjs
import assert from 'node:assert/strict'
import test from 'node:test'
import { createHmac, randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import { SourceTextModule, SyntheticModule } from 'node:vm'

async function load(file, imports = {}) {
  const source = await readFile(new URL('../' + file, import.meta.url), 'utf8')
  const module = new SourceTextModule(stripTypeScriptTypes(source))
  await module.link(async name => {
    assert.ok(name in imports, `Unexpected dependency ${name}`)
    const values = imports[name]
    return new SyntheticModule(Object.keys(values), function () {
      for (const [key, value] of Object.entries(values)) this.setExport(key, value)
    })
  })
  await module.evaluate()
  return module.namespace
}
const analytics = await load('src/lib/visitor-analytics.ts')
const now = new Date('2026-10-12T17:01:00Z')
const sql = (parts, ...values) => ({ text: parts.join('?'), values })

test('calendar boundaries use Thai midnight, validate real dates, and include the whole end date', () => {
  assert.equal(analytics.thaiDay(now), '2026-10-13')
  assert.deepEqual(analytics.defaultVisitorRange(now, 7), { start: '2026-10-07', end: '2026-10-13' })
  const range = analytics.visitorRange('2026-10-10', '2026-10-12', now)
  assert.equal(range.from, '2026-10-09T17:00:00.000Z')
  assert.equal(range.until, '2026-10-12T17:00:00.000Z')
  assert.equal(range.todayFrom, '2026-10-12T17:00:00.000Z')
  assert.throws(() => analytics.visitorRange('2026-02-30', '2026-03-01', now))
  assert.throws(() => analytics.visitorRange('2026-10-12', '2026-10-11', now))
  assert.throws(() => analytics.visitorRange('2026-10-13', '2026-10-14', now))
  assert.throws(() => analytics.visitorRange('2024-01-01', '2026-10-13', now))
})

test('sources keep only referrer hosts and valid campaign names; devices and excluded paths are classified', () => {
  assert.equal(analytics.trafficSource('https://www.google.com/search?q=private', null, 'example.com'), 'google.com')
  assert.equal(analytics.trafficSource('https://example.com/welcome', null, 'example.com'), 'direct')
  assert.equal(analytics.trafficSource(null, 'summer-sale', 'example.com'), 'utm:summer-sale')
  assert.equal(analytics.trafficSource('javascript:alert(1)', 'someone@example.com', 'example.com'), 'direct')
  assert.equal(analytics.sourceLabel('l.facebook.com'), 'Facebook')
  assert.equal(analytics.deviceFromUserAgent('Mozilla Android Mobile'), 'mobile')
  assert.equal(analytics.deviceFromUserAgent('Mozilla Android'), 'tablet')
  assert.equal(analytics.deviceFromUserAgent('Mozilla iPad'), 'tablet')
  assert.equal(analytics.deviceFromUserAgent('Mozilla Windows NT'), 'desktop')
  assert.equal(analytics.isBot('Googlebot/2.1'), true)
  for (const path of ['/admin', '/admin/account', '/api/analytics', '//external.test', '/_next/image']) assert.equal(analytics.trackedPath(path), null)
  assert.equal(analytics.trackedPath('/articles/example?email=private#anchor'), '/articles/example')
})

const { getVisitorReport } = await load('src/lib/visitor-report.ts', {
  '@payloadcms/db-postgres': { sql }, './visitor-analytics': analytics,
})
test('report uses bound date parameters, distinct visitor counts, and fills missing calendar days with zero', async () => {
  const queries = []
  const rows = [
    [{ visits: '3', unique_visitors: '2' }],
    [{ all_time: '8', today: '1', started_at: '2026-10-01T02:00:00Z' }],
    [{ day: '2026-10-10', visits: '2' }, { day: '2026-10-12', visits: '1' }],
    [{ label: 'direct', visits: '3' }],
    [{ label: 'desktop', visits: '2' }, { label: 'mobile', visits: '1' }],
  ]
  const payload = { db: { drizzle: { execute: async q => { queries.push(q); return { rows: rows.shift() } } } } }
  const report = await getVisitorReport(payload, '2026-10-10', '2026-10-12')
  assert.equal(report.visits, 3)
  assert.equal(report.uniqueVisitors, 2)
  assert.equal(report.allTime, 8)
  assert.deepEqual(report.daily, [{ date: '2026-10-10', visits: 2 }, { date: '2026-10-11', visits: 0 }, { date: '2026-10-12', visits: 1 }])
  assert.match(queries[0].text, /COUNT\(DISTINCT visitor_hash\)/)
  assert.deepEqual(queries[0].values, ['2026-10-09T17:00:00.000Z', '2026-10-12T17:00:00.000Z'])
})

let signedIn = false
let inserts = []
const payload = { secret: 'local-test-only', auth: async () => ({ user: signedIn ? { id: 1 } : null }), db: { drizzle: { execute: async q => { inserts.push(q); return { rows: [] } } } } }
class MockRequest extends Request {
  cookies = { get: name => { const value = (this.headers.get('cookie') || '').split(';').map(s => s.trim()).find(s => s.startsWith(name + '=')); return value ? { value: value.slice(name.length + 1) } : undefined } }
}
class MockResponse extends Response {
  savedCookies = []
  cookies = { set: (name, value, options) => this.savedCookies.push({ name, value, ...options }) }
}
const { POST } = await load('src/app/api/analytics/visit/route.ts', {
  'node:crypto': { createHmac, randomUUID },
  'next/server': { NextRequest: MockRequest, NextResponse: MockResponse },
  payload: { getPayload: async () => payload },
  '@payloadcms/db-postgres': { sql },
  '@payload-config': { default: {} },
  '@/lib/visitor-analytics': analytics,
})
function request(data, extra = {}) {
  return new MockRequest('https://example.com/api/analytics/visit', { method: 'POST', headers: { origin: 'https://example.com', host: 'example.com', 'content-type': 'application/json', 'user-agent': 'Mozilla Windows NT', ...extra }, body: JSON.stringify(data) })
}

test('tracking rejects cross-origin requests, oversized bodies, bots, opted-out visitors and logged-in staff', async () => {
  inserts = []
  assert.equal((await POST(request({ consent: true, path: '/' }, { origin: 'https://evil.test' }))).status, 403)
  assert.equal((await POST(request({ consent: true, path: '/', padding: 'x'.repeat(2500) }))).status, 400)
  for (const [data, headers] of [[{ consent: false }, {}], [{ consent: true, path: '/' }, { dnt: '1' }], [{ consent: true, path: '/' }, { 'user-agent': 'Googlebot' }], [{ consent: true, path: '/admin' }, {}], [{ path: '/' }, {}]]) {
    assert.equal((await POST(request(data, headers))).status, 204)
  }
  signedIn = true
  assert.equal((await POST(request({ consent: true, path: '/' }))).status, 204)
  signedIn = false
  assert.equal(inserts.length, 0)
})

test('consenting visits get opaque cookies; repeat page loads reuse the same session with an idempotent insert', async () => {
  inserts = []
  const first = await POST(request({ consent: true, path: '/?private=query', referrer: 'https://google.com/search?q=secret' }))
  assert.equal(first.status, 204)
  assert.equal(first.savedCookies.length, 2)
  assert.ok(first.savedCookies.every(c => c.httpOnly && c.sameSite === 'lax'))
  assert.equal(first.savedCookies.find(c => c.name === 'pt-analytics-session').maxAge, 1800)
  const cookies = first.savedCookies.map(c => c.name + '=' + c.value).join('; ')
  await POST(request({ consent: true, path: '/articles', referrer: 'https://example.com/' }, { cookie: cookies }))
  assert.equal(inserts.length, 2)
  assert.equal(inserts[0].values[0], inserts[1].values[0])
  assert.equal(inserts[0].values[1], inserts[1].values[1])
  assert.match(inserts[0].text, /ON CONFLICT \(session_hash\) DO NOTHING/)
  assert.equal(inserts[0].values[2], 'google.com')
  assert.equal(inserts[0].values[4], '/')
  const logout = await POST(request({ consent: false }, { cookie: cookies }))
  assert.ok(logout.savedCookies.every(c => c.maxAge === 0))
})

let reports = 0
const { GET } = await load('src/app/api/analytics/report/route.ts', {
  payload: { getPayload: async () => payload }, '@payload-config': { default: {} },
  '@/lib/visitor-report': { getVisitorReport: async () => { reports++; return { visits: 1 } } },
  '@/lib/visitor-analytics': analytics,
})
test('private report API requires login, validates dates, and prevents shared-cache disclosure', async () => {
  const req = new Request('https://example.com/api/analytics/report?start=2026-10-10&end=2026-10-12')
  signedIn = false
  assert.equal((await GET(req)).status, 401)
  assert.equal(reports, 0)
  signedIn = true
  assert.equal((await GET(new Request('https://example.com/api/analytics/report?start=bad&end=bad'))).status, 400)
  const response = await GET(req)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
  signedIn = false
})
