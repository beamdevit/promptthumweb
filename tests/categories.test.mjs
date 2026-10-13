import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import { SourceTextModule, SyntheticModule } from 'node:vm'

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
class APIError extends Error {
  constructor(message, status) { super(message); this.status = status }
}
const { contentSlug } = await load('src/lib/content-slug.ts')
const { ArticleCategories, PortfolioCategories } = await load('src/collections/Categories.ts', {
  payload: { APIError }, '../lib/content-slug': { contentSlug },
})

test('visitors can read category names but cannot create, rename or delete categories', () => {
  for (const collection of [ArticleCategories, PortfolioCategories]) {
    assert.equal(collection.access.read({ req: {} }), true)
    for (const operation of ['create', 'update', 'delete']) {
      assert.equal(collection.access[operation]({ req: {} }), false)
      assert.equal(collection.access[operation]({ req: { user: { id: 1 } } }), true)
    }
  }
})

test('Thai category URLs normalize safely and renaming preserves the existing URL', () => {
  const field = ArticleCategories.fields.find(field => field.name === 'slug')
  const hook = field.hooks.beforeValidate[0]
  assert.equal(hook({ value: '', data: { name: 'เทคนิค SEO' } }), 'เทคนิค-seo')
  assert.equal(hook({ value: '', data: { name: 'ชื่อใหม่' }, originalDoc: { slug: 'website' } }), 'website')
  assert.equal(field.validate('', { data: { name: '🎉' } }), 'ใส่ชื่อหมวดหมู่หรือ URL ที่มีตัวอักษรหรือตัวเลข')
})

test('a used category cannot be deleted, including unpublished work and historical article versions', async () => {
  for (const [collection, content] of [[PortfolioCategories, 'portfolio'], [ArticleCategories, 'articles']]) {
    let current = 1
    let history = 0
    const req = { user: { id: 1 }, payload: {
      count: async options => {
        assert.equal(options.collection, content)
        assert.deepEqual(options.where, { category: { equals: 7 } })
        assert.equal(options.overrideAccess, false)
        assert.equal(options.req, req)
        return { totalDocs: current }
      },
      findVersions: async options => {
        assert.equal(options.collection, 'articles')
        assert.deepEqual(options.where, { 'version.category': { equals: 7 } })
        assert.equal(options.overrideAccess, false)
        assert.equal(options.req, req)
        return { totalDocs: history }
      },
    } }
    const remove = () => collection.hooks.beforeDelete[0]({ id: 7, req })
    await assert.rejects(remove, error => error.status === 400 && /ย้ายเนื้อหา/.test(error.message))
    current = 0
    if (content === 'articles') {
      history = 1
      await assert.rejects(remove, error => error.status === 400 && /ประวัติ/.test(error.message))
      history = 0
    }
    await assert.doesNotReject(remove)
  }
})

test('renamed category labels reach public content, and absent relationships never expose numeric IDs', async () => {
  const { categoryName } = await load('src/lib/category-label.ts')
  assert.equal(categoryName({ id: 5, name: 'ชื่อหมวดใหม่' }, 'บทความ'), 'ชื่อหมวดใหม่')
  for (const value of [null, undefined, 5, { name: '' }]) assert.equal(categoryName(value, 'บทความ'), 'บทความ')
})

test('portfolio filters load all editable categories in order and encode queries through relationship slugs', async () => {
  const categories = [{ id: 1, name: 'เว็บไซต์ใหม่', slug: 'website' }, { id: 2, name: 'งานใหม่', slug: 'งานใหม่' }]
  const { getPortfolioCategories } = await load('src/lib/categories.ts', {
    '@payload-config': { default: {} }, react: { cache: fn => fn },
    payload: { getPayload: async () => ({ find: async options => {
      assert.equal(options.collection, 'portfolio-categories')
      assert.equal(options.overrideAccess, false)
      assert.equal(options.pagination, false)
      assert.equal(options.limit, 0)
      assert.deepEqual(options.sort, ['order', 'name'])
      return { docs: categories }
    } }) },
  })
  assert.deepEqual(await getPortfolioCategories(), categories)
})
