// Isolated PostgreSQL + real Payload integration. No production connection.
// PGLITE_MODULE may point to a local @electric-sql/pglite installation.
// node --import tsx --experimental-vm-modules tests/site-about.integration.mjs
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import { SourceTextModule, SyntheticModule } from 'node:vm'
import { sql } from '@payloadcms/db-postgres'
import { PgDialect } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/node-postgres'
import { BasePayload } from 'payload'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { RichText } from '@payloadcms/richtext-lexical/react'

async function load(file, imports = {}) {
  const module = new SourceTextModule(stripTypeScriptTypes(await readFile(new URL('../' + file, import.meta.url), 'utf8')))
  await module.link(async name => {
    assert.ok(name in imports, `Unexpected import ${name}`)
    const values = imports[name]
    return new SyntheticModule(Object.keys(values), function () {
      for (const [key, value] of Object.entries(values)) this.setExport(key, value)
    })
  })
  await module.evaluate()
  return module.namespace
}

const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite')
const pg = new PGlite()
const dialect = new PgDialect()
const db = { execute: async statement => {
  const { sql: text, params } = dialect.sqlToQuery(statement)
  return params.length ? pg.query(text, params) : (await pg.exec(text)).at(-1)
} }
const { contentSlug } = await load('src/lib/content-slug.ts')
const defaults = await load('src/lib/site-about-defaults.ts')
const { aboutParagraphs, DEFAULT_SITE_ABOUT } = defaults
const imports = { '@payloadcms/db-postgres': { sql, MigrateUpArgs: undefined, MigrateDownArgs: undefined }, '../lib/content-slug': { contentSlug } }
try {
  for (const file of (await readdir(new URL('../src/migrations/', import.meta.url))).filter(file => file.endsWith('.ts') && file !== 'index.ts').sort()) {
    await (await load('src/migrations/' + file, imports)).up({ db })
  }
  process.env.PAYLOAD_SECRET = 'isolated-about-integration-test-only'
  process.env.DATABASE_URI = 'postgresql://unreachable.invalid/about-test-only'
  const { default: config } = await import('../src/payload.config.ts')
  const payload = await new BasePayload().init({ config, disableDBConnect: true, disableOnInit: true })
  const client = { query: async (query, params = []) => pg.query(typeof query === 'string' ? query : query.text, params, {
    rowMode: query.rowMode, parsers: { 1184: value => value, 1114: value => value, 1082: value => value },
  }) }
  payload.db.drizzle = drizzle({ client, schema: payload.db.schema })
  payload.db.initializing = Promise.resolve()
  const { getSiteAbout } = await load('src/lib/site-about.ts', {
    '@payload-config': { default: {} }, payload: { getPayload: async () => payload },
    react: { cache: fn => fn }, './site-about-defaults': defaults,
  })
  const original = await getSiteAbout()
  assert.deepEqual(original.content, DEFAULT_SITE_ABOUT.content)
  assert.deepEqual(original.contentEn, DEFAULT_SITE_ABOUT.contentEn)
  assert.equal(original.heading, 'ประวัติบริษัท')
  assert.equal(original.headingEn, 'Our story')
  assert.equal(original.image, null)
  assert.equal((await pg.query('SELECT COUNT(*)::int total FROM site_about')).rows[0].total, 1)
  await assert.rejects(() => payload.updateGlobal({ slug: 'site-about', data: { heading: 'Unauthorized' }, overrideAccess: false }), error => error.status === 403)
  assert.equal((await getSiteAbout()).heading, original.heading)

  const user = await payload.create({ collection: 'users', data: { email: 'about-test@example.invalid', password: 'Local-only-About-98765', name: 'Local Editor', role: 'editor' } })
  const update = data => payload.updateGlobal({ slug: 'site-about', data, overrideAccess: false, req: { user } })
  const content = aboutParagraphs(['เรื่องราวใหม่ของเรา', 'รายละเอียดเพิ่มเติม'])
  content.root.children[0].children[0].format = 1
  content.root.children[1].children = [{
    type: 'link', version: 3, direction: null, format: '', indent: 0,
    fields: { linkType: 'custom', url: 'https://example.com/contact', newTab: true },
    children: [{ type: 'text', version: 1, text: 'ติดต่อเรา', detail: 0, format: 0, mode: 'normal', style: '' }],
  }]
  await update({ heading: 'รู้จักทีมเรา', content, headingEn: 'Meet our team', contentEn: aboutParagraphs(['Our updated story']), eyebrow: 'OUR TEAM' })
  const changed = await getSiteAbout()
  assert.equal(changed.heading, 'รู้จักทีมเรา')
  assert.equal(changed.headingEn, 'Meet our team')
  assert.equal(changed.contentEn.root.children[0].children[0].text, 'Our updated story')
  const html = renderToStaticMarkup(createElement(RichText, { data: changed.content }))
  assert.match(html, /<strong>เรื่องราวใหม่ของเรา<\/strong>/)
  assert.match(html, /href="https:\/\/example.com\/contact"/)
  assert.match(html, /rel="noopener noreferrer"/)
  await assert.rejects(() => update({ content: aboutParagraphs(['   ']) }), error => error.status === 400)
  assert.equal((await getSiteAbout()).heading, changed.heading)

  const media = await pg.query("INSERT INTO media (alt, filename, mime_type, width, height) VALUES ('Team picture', 'about-test.png', 'image/png', 1200, 800) RETURNING id")
  await update({ image: media.rows[0].id, imageAlt: 'ภาพทีมงาน', imageAltEn: 'Our team' })
  const withImage = await getSiteAbout()
  assert.ok(withImage.image.src.endsWith('/api/media/file/about-test.png'))
  assert.equal(withImage.image.alt, 'ภาพทีมงาน')
  assert.equal(withImage.image.altEn, 'Our team')
  assert.equal(withImage.image.width, 1200)
  await update({ headingEn: '', contentEn: aboutParagraphs([]), eyebrow: '', image: null })
  const cleared = await getSiteAbout()
  assert.equal(cleared.headingEn, cleared.heading)
  assert.deepEqual(cleared.contentEn, cleared.content)
  assert.equal(cleared.eyebrow, '')
  assert.equal(cleared.image, null)
  await update({ eyebrow: null })
  assert.equal((await getSiteAbout()).eyebrow, '')
  console.log('PASS: original bilingual content seeded, staff-only updates, rich text and links, empty-text validation, image selection, language fallback, cleared image and eyebrow')
} finally {
  await pg.close()
}
