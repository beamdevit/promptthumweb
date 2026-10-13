// PostgreSQL integration in an isolated WASM database; no production connection.
// Set PGLITE_MODULE to an installed @electric-sql/pglite module path if needed.
// node --experimental-vm-modules tests/category-migration.integration.mjs
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import { SourceTextModule, SyntheticModule } from 'node:vm'
import { sql } from '@payloadcms/db-postgres'
import { PgDialect } from 'drizzle-orm/pg-core'

const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite')
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
const { contentSlug } = await load('src/lib/content-slug.ts')
const pg = new PGlite()
const dialect = new PgDialect()
const db = { execute: async statement => {
  const { sql: text, params } = dialect.sqlToQuery(statement)
  return params.length ? pg.query(text, params) : (await pg.exec(text)).at(-1)
} }
const imports = { '@payloadcms/db-postgres': { sql, MigrateUpArgs: undefined, MigrateDownArgs: undefined }, '../lib/content-slug': { contentSlug } }
try {
  const allMigrations = (await readdir(new URL('../src/migrations/', import.meta.url))).filter(file => file.endsWith('.ts') && file !== 'index.ts').sort()
  const latest = '20261013_085856_categories.ts'
  const migrations = allMigrations.filter(file => file < latest)
  for (const file of migrations) await (await load('src/migrations/' + file, imports)).up({ db })

  const names = ['เทคนิค SEO', 'SEO', 'seo', '👋', "SEO'; DROP TABLE articles; --", 'บทความ']
  for (let i = 0; i < names.length; i++) {
    await pg.query('INSERT INTO articles (title, slug, category, _status) VALUES ($1, $2, $3, $4)', ['Article ' + i, 'article-' + i, names[i], i % 2 ? 'draft' : 'published'])
  }
  await pg.exec(`INSERT INTO _articles_v (parent_id, version_title, version_category, version__status)
    VALUES (1, 'Version-only category', 'หมวดเก่า', 'draft');
    INSERT INTO articles (title, slug, category) VALUES ('Empty', 'empty', ''), ('Null', 'null', NULL);
    INSERT INTO portfolio (title, slug, category, published)
      SELECT value, value, value::enum_portfolio_category, value <> 'video'
      FROM unnest(ARRAY['website', 'graphic', 'branding', 'ads', 'video', 'packaging']) value;`)
  const migration = await load('src/migrations/' + latest, imports)
  await pg.exec('BEGIN')
  await migration.up({ db })
  await pg.exec('COMMIT')

  const articleLabels = await pg.query('SELECT a.slug, c.name FROM articles a JOIN article_categories c ON c.id = a.category_id ORDER BY a.id')
  assert.deepEqual(articleLabels.rows.slice(0, names.length).map(row => row.name), names)
  assert.deepEqual(articleLabels.rows.slice(names.length).map(row => row.name), ['บทความ', 'บทความ'])
  assert.equal((await pg.query('SELECT c.name FROM _articles_v v JOIN article_categories c ON c.id = v.version_category_id')).rows[0].name, 'หมวดเก่า')
  const categorySlugs = (await pg.query('SELECT slug FROM article_categories')).rows.map(row => row.slug)
  assert.equal(new Set(categorySlugs).size, categorySlugs.length, 'normalized label collisions need unique slugs')
  assert.ok(categorySlugs.every(slug => contentSlug(slug) === slug))
  const works = (await pg.query('SELECT p.slug, c.slug category FROM portfolio p JOIN portfolio_categories c ON c.id = p.category_id ORDER BY p.id')).rows
  assert.deepEqual(works.map(row => row.category), ['website', 'graphic', 'branding', 'ads', 'video', 'packaging'])
  assert.equal((await pg.query("SELECT COUNT(*)::int total FROM portfolio WHERE category_id IS NULL")).rows[0].total, 0)

  // A rename must update all displayed labels through the relationship.
  await pg.exec("UPDATE portfolio_categories SET name = 'เว็บไซต์ใหม่' WHERE slug = 'website'")
  assert.equal((await pg.query("SELECT c.name FROM portfolio p JOIN portfolio_categories c ON p.category_id = c.id WHERE p.slug = 'website'")).rows[0].name, 'เว็บไซต์ใหม่')
  await pg.exec("UPDATE portfolio_categories SET name = 'เว็บไซต์' WHERE slug = 'website'")
  // A custom category can be assigned and filtered without changing application code.
  await pg.exec("INSERT INTO portfolio_categories (name, slug) VALUES ('งานใหม่', 'งานใหม่'); INSERT INTO portfolio (title, slug, category_id) SELECT 'New work', 'new-work', id FROM portfolio_categories WHERE slug = 'งานใหม่'")
  assert.equal((await pg.query('SELECT p.title FROM portfolio p JOIN portfolio_categories c ON p.category_id = c.id WHERE c.slug = $1', ['งานใหม่'])).rows[0].title, 'New work')

  await pg.exec('BEGIN')
  await assert.rejects(() => migration.down({ db }), /Move custom portfolio categories/)
  await pg.exec('ROLLBACK')
  assert.equal((await pg.query('SELECT COUNT(*)::int total FROM portfolio')).rows[0].total, 7, 'failed rollback must not remove content')
  await pg.exec("DELETE FROM portfolio WHERE slug = 'new-work'; DELETE FROM portfolio_categories WHERE slug = 'งานใหม่'")
  await pg.exec('BEGIN')
  await migration.down({ db })
  await pg.exec('COMMIT')
  assert.deepEqual((await pg.query("SELECT category FROM articles WHERE slug LIKE 'article-%' ORDER BY id")).rows.map(row => row.category), names)
  assert.equal((await pg.query('SELECT version_category FROM _articles_v')).rows[0].version_category, 'หมวดเก่า')
  assert.deepEqual((await pg.query('SELECT category::text FROM portfolio ORDER BY id')).rows.map(row => row.category), works.map(row => row.category))
  await pg.exec('BEGIN')
  await migration.up({ db })
  await pg.exec('COMMIT')
  console.log('PASS: all migrations, existing categories, drafts, versions, collisions, custom filters, rename, guarded rollback, down and re-up')

  if (process.env.PAYLOAD_CATEGORY_TEST === '1') {
    for (const file of allMigrations.filter(file => file > latest)) await (await load('src/migrations/' + file, imports)).up({ db })
    // Run with --import tsx. The real Payload adapter uses this local pg-compatible
    // client, so no actual PostgreSQL server or production credentials are used.
    process.env.PAYLOAD_SECRET = 'isolated-category-integration-test-only'
    process.env.DATABASE_URI = 'postgresql://unreachable.invalid/category-test-only'
    const { BasePayload } = await import('payload')
    const { drizzle } = await import('drizzle-orm/node-postgres')
    const { default: config } = await import('../src/payload.config.ts')
    const payload = await new BasePayload().init({ config, disableDBConnect: true, disableOnInit: true })
    const client = {
      query: async (query, params = []) => {
        const text = typeof query === 'string' ? query : query.text
        return pg.query(text, params, {
          rowMode: query.rowMode,
          parsers: { 1184: value => value, 1114: value => value, 1082: value => value },
        })
      },
    }
    payload.db.drizzle = drizzle({ client, schema: payload.db.schema })
    payload.db.initializing = Promise.resolve()
    const user = await payload.create({ collection: 'users', data: { email: 'local-test@example.invalid', password: 'Local-test-only-987654', name: 'Local Test', role: 'admin' } })
    const req = { user }
    const createCategory = (data, extra = {}) => payload.create({ collection: 'portfolio-categories', data, overrideAccess: false, req, ...extra })
    await assert.rejects(() => createCategory({ name: 'Forbidden' }, { req: {} }), error => error.status === 403)
    const category = await createCategory({ name: 'งานมือถือ', order: 20 })
    assert.equal(category.slug, 'งานมือถือ')
    await assert.rejects(() => createCategory({ name: 'Duplicate URL', slug: category.slug }), error => error.status === 400)
    const work = await payload.create({ collection: 'portfolio', req, overrideAccess: false, data: { title: 'Test work', category: category.id, published: true } })
    const publicOptions = { collection: 'portfolio', overrideAccess: false, depth: 1, where: { 'category.slug': { equals: category.slug } } }
    const publicWorks = await payload.find(publicOptions)
    assert.equal(publicWorks.docs.length, 1)
    assert.equal(publicWorks.docs[0].category.name, 'งานมือถือ')
    await payload.update({ collection: 'portfolio-categories', id: category.id, data: { name: 'ชื่อใหม่' }, req, overrideAccess: false })
    assert.equal((await payload.find(publicOptions)).docs[0].category.name, 'ชื่อใหม่')
    await assert.rejects(() => payload.delete({ collection: 'portfolio-categories', id: category.id, req, overrideAccess: false }), /ย้ายเนื้อหา/)
    await payload.update({ collection: 'portfolio', id: work.id, data: { published: false }, req, overrideAccess: false })
    assert.equal((await payload.find(publicOptions)).docs.length, 0)
    await assert.rejects(() => payload.delete({ collection: 'portfolio-categories', id: category.id, req, overrideAccess: false }), /ย้ายเนื้อหา/)

    const articleCategory = await payload.create({ collection: 'article-categories', req, overrideAccess: false, data: { name: 'ทดสอบฉบับร่าง' } })
    const article = await payload.create({ collection: 'articles', req, overrideAccess: false, draft: true, data: { title: 'Draft category test', category: articleCategory.id } })
    await assert.rejects(() => payload.delete({ collection: 'article-categories', id: articleCategory.id, req, overrideAccess: false }), /ย้ายเนื้อหา|ประวัติ/)
    const defaultCategory = (await payload.find({ collection: 'article-categories', where: { name: { equals: 'บทความ' } }, limit: 1, overrideAccess: false })).docs[0]
    const content = { root: { type: 'root', version: 1, direction: null, format: '', indent: 0, children: [
      { type: 'paragraph', version: 1, direction: null, format: '', indent: 0, children: [
        { type: 'text', version: 1, text: 'Local article test', detail: 0, format: 0, mode: 'normal', style: '' },
      ] },
    ] } }
    await payload.update({ collection: 'articles', id: article.id, draft: false, req, overrideAccess: false, data: { category: defaultCategory.id, _status: 'published', content } })
    assert.equal((await payload.findByID({ collection: 'articles', id: article.id, overrideAccess: false, depth: 1 })).category.name, 'บทความ')
    await assert.rejects(() => payload.delete({ collection: 'article-categories', id: articleCategory.id, req, overrideAccess: false }), /ประวัติ/)
    const unused = await createCategory({ name: 'Unused category' })
    await payload.delete({ collection: 'portfolio-categories', id: unused.id, req, overrideAccess: false })
    console.log('PASS: real Payload category CRUD, access, duplicate URLs, populated labels, relationship filters, unpublished work and draft/version deletion guards')
  }
} finally {
  await pg.close()
}
