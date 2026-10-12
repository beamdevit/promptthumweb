// Run inside the deployed app: node --experimental-vm-modules tests/visitor-analytics.integration.mjs
// All fixture inserts run in a transaction which is ALWAYS rolled back.
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import { SourceTextModule, SyntheticModule } from 'node:vm'
import { createHmac, randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server.js'
import { sql } from '@payloadcms/db-postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'

async function load(file, imports = {}) {
  const source = await readFile(new URL('../' + file, import.meta.url), 'utf8')
  const module = new SourceTextModule(stripTypeScriptTypes(source))
  await module.link(async name => {
    const values = imports[name]
    assert.ok(values, `Unexpected import ${name}`)
    return new SyntheticModule(Object.keys(values), function () { for (const [key, value] of Object.entries(values)) this.setExport(key, value) })
  })
  await module.evaluate()
  return module.namespace
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL })
const sessionHashes = []
try {
  await client.connect()
  await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ')
  const payload = { secret: process.env.PAYLOAD_SECRET, db: { drizzle: drizzle(client) }, auth: async () => ({ user: null }) }
  assert.ok(payload.secret, 'PAYLOAD_SECRET must be configured')
  const analytics = await load('src/lib/visitor-analytics.ts')
  const { getVisitorReport } = await load('src/lib/visitor-report.ts', { '@payloadcms/db-postgres': { sql }, './visitor-analytics': analytics })
  const { POST } = await load('src/app/api/analytics/visit/route.ts', {
    'node:crypto': { createHmac, randomUUID }, 'next/server': { NextRequest, NextResponse },
    payload: { getPayload: async () => payload }, '@payloadcms/db-postgres': { sql }, '@payload-config': { default: {} }, '@/lib/visitor-analytics': analytics,
  })
  const today = analytics.thaiDay()
  const yesterday = analytics.shiftDay(today, -1)
  const before = await getVisitorReport(payload, today, today)
  const beforeYesterday = await getVisitorReport(payload, yesterday, yesterday)
  const request = (cookie = '') => new NextRequest('https://analytics-test.local/api/analytics/visit', {
    method: 'POST', headers: { host: 'analytics-test.local', origin: 'https://analytics-test.local', 'content-type': 'application/json', 'user-agent': 'Mozilla Windows NT', cookie },
    body: JSON.stringify({ consent: true, path: '/', referrer: 'https://www.google.com/search?q=not-stored' }),
  })
  const first = await POST(request())
  assert.equal(first.status, 204)
  const visitor = first.cookies.get('pt-analytics-visitor').value
  const session = first.cookies.get('pt-analytics-session').value
  const hash = (kind, id) => createHmac('sha256', payload.secret).update(kind + ':' + id).digest('hex')
  const visitorHash = hash('visitor', visitor)
  sessionHashes.push(hash('session', session))
  const cookies = `pt-analytics-visitor=${visitor}; pt-analytics-session=${session}`
  assert.equal((await POST(request(cookies))).status, 204)
  const duplicate = await getVisitorReport(payload, today, today)
  assert.equal(duplicate.visits, before.visits + 1, 'same session must count only once')
  assert.equal(duplicate.uniqueVisitors, before.uniqueVisitors + 1)
  const second = await POST(request(`pt-analytics-visitor=${visitor}`))
  sessionHashes.push(hash('session', second.cookies.get('pt-analytics-session').value))
  const repeated = await getVisitorReport(payload, today, today)
  assert.equal(repeated.visits, before.visits + 2, 'new session must add a visit')
  assert.equal(repeated.uniqueVisitors, before.uniqueVisitors + 1, 'new session in the same browser must not add a unique visitor')
  const midnight = new Date(today + 'T00:00:00+07:00').getTime()
  for (const offset of [-1000, 1000]) {
    const key = hash('session', randomUUID())
    sessionHashes.push(key)
    await payload.db.drizzle.execute(sql`INSERT INTO site_visits (session_hash, visitor_hash, source, device, landing_path, created_at, updated_at)
      VALUES (${key}, ${visitorHash}, 'direct', 'mobile', '/', ${new Date(midnight + offset).toISOString()}, NOW())`)
  }
  const after = await getVisitorReport(payload, today, today)
  const afterYesterday = await getVisitorReport(payload, yesterday, yesterday)
  assert.equal(after.visits, before.visits + 3, 'Thai-day range must exclude the second before midnight')
  assert.equal(afterYesterday.visits, beforeYesterday.visits + 1)
  assert.equal(after.daily[0].visits, after.visits)
  assert.equal(after.sources.reduce((sum, item) => sum + item.visits, 0), after.visits)
  assert.equal(after.devices.reduce((sum, item) => sum + item.visits, 0), after.visits)
  console.log('PASS: real PostgreSQL session deduplication, unique visitors, Thai calendar boundaries, source/device totals')
} finally {
  if (client._connected) {
    await client.query('ROLLBACK')
    if (sessionHashes.length) {
      const { rows } = await client.query('SELECT COUNT(*) AS count FROM site_visits WHERE session_hash = ANY($1::text[])', [sessionHashes])
      assert.equal(Number(rows[0].count), 0, 'fixtures must not remain in the database')
    }
    console.log('PASS: transaction rolled back; no test visits remain')
  }
  await client.end()
}
