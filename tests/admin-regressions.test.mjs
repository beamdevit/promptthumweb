// Run with Node 24: node --experimental-vm-modules --test tests/admin-regressions.test.mjs
import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import { SourceTextModule, SyntheticModule } from 'node:vm'

async function load(relative, imports = {}) {
  const source = await readFile(
    new URL('../' + relative, import.meta.url),
    'utf8',
  )
  const module = new SourceTextModule(stripTypeScriptTypes(source))
  await module.link(async (name) => {
    assert.ok(name in imports, `Unexpected dependency ${name}`)
    const values = imports[name]
    return new SyntheticModule(Object.keys(values), function () {
      for (const [key, value] of Object.entries(values))
        this.setExport(key, value)
    })
  })
  await module.evaluate()
  return module.namespace
}

const { contentSlug } = await load('src/lib/content-slug.ts')
const editorStub = {
  lexicalEditor: (value) => value,
  FixedToolbarFeature: () => ({}),
}
const slugImports = {
  '../lib/content-slug': { contentSlug },
  '@payloadcms/richtext-lexical': editorStub,
}
const { Portfolio } = await load(
  'src/collections/Portfolio.ts',
  slugImports,
)
const { Articles } = await load('src/collections/Articles.ts', slugImports)
const { Users } = await load('src/collections/Users.ts')
const { youtubeId, DEFAULT_YOUTUBE_URL } = await load('src/lib/youtube.ts')
const { SiteVideo } = await load('src/globals/SiteVideo.ts', {
  '../lib/youtube': { youtubeId, DEFAULT_YOUTUBE_URL },
})
const { DEFAULT_SITE_LOGO } = await load('src/lib/site-logo.ts')
let brandingSettings = {}
const { getSiteBranding } = await load('src/lib/site-branding.ts', {
  '@payload-config': { default: {} },
  payload: {
    getPayload: async () => ({
      findGlobal: async (options) => {
        assert.equal(options.slug, 'site-branding')
        assert.equal(options.depth, 1)
        assert.equal(options.overrideAccess, false)
        return brandingSettings
      },
    }),
  },
  react: { cache: (fn) => fn },
  './site-logo': { DEFAULT_SITE_LOGO },
})

test('website logos use the full image and safely restore the original for missing or cleared media', async () => {
  for (const logo of [undefined, null, 42, { url: '/missing', mimeType: 'video/mp4' }]) {
    brandingSettings = { logo }
    assert.deepEqual(await getSiteBranding(), DEFAULT_SITE_LOGO)
  }
  brandingSettings = {
    logo: {
      url: '/api/media/file/full-logo.webp',
      mimeType: 'image/webp',
      alt: 'Uploaded logo',
      width: 1200,
      height: 300,
      sizes: { thumbnail: { url: '/cropped-thumbnail.webp' } },
    },
    logoAlt: '  Promptthum new logo  ',
  }
  assert.deepEqual(await getSiteBranding(), {
    src: '/api/media/file/full-logo.webp',
    alt: 'Promptthum new logo',
    width: 1200,
    height: 300,
  })
  brandingSettings.logoAlt = ''
  assert.equal((await getSiteBranding()).alt, 'Uploaded logo')
  brandingSettings.logo = null
  assert.deepEqual(await getSiteBranding(), DEFAULT_SITE_LOGO)
})

function flatten(fields) {
  return fields.flatMap((field) =>
    field.type === 'tabs'
      ? field.tabs.flatMap((tab) => flatten(tab.fields))
      : field.name
        ? [field]
        : flatten(field.fields || []),
  )
}

test('blank slugs can be generated from Thai titles; empty or malformed URLs fail validation', () => {
  for (const config of [Articles, Portfolio]) {
    const field = flatten(config.fields).find((field) => field.name === 'slug')
    assert.notEqual(field.required, true)
    assert.equal(field.validate('', { data: { title: 'ทดสอบ บทความ' } }), true)
    const generate = field.hooks.beforeValidate[0]
    assert.equal(
      generate({ value: '', data: { title: 'ทดสอบ บทความ' } }),
      'ทดสอบ-บทความ',
    )
    assert.equal(
      generate({ value: 'existing-url', data: { title: 'Changed title' } }),
      'existing-url',
    )
    assert.equal(generate({ value: ' /A URL/ ', data: {} }), 'a-url')
    assert.notEqual(field.validate('---', { data: {} }), true)
    assert.notEqual(field.validate('', { data: { title: '🎉' } }), true)
  }
})

test('editor can update their own numeric or string ID, but cannot update others or promote themselves', () => {
  const req = { user: { id: 7, role: 'editor' } }
  assert.equal(Users.access.update({ req, id: '7' }), true)
  assert.equal(Users.access.update({ req, id: 8 }), false)
  assert.equal(Users.access.update({ req: {}, id: undefined }), false)
  assert.equal(
    Users.fields.find((field) => field.name === 'role').access.update({ req }),
    false,
  )
})

test('HTML5 video works without YouTube; invalid sources are rejected and pasted whitespace is trimmed', () => {
  const field = SiteVideo.fields.find((field) => field.name === 'youtubeUrl')
  assert.equal(
    field.validate('', { data: { videoUrl: 'https://example.com/video.mp4' } }),
    true,
  )
  assert.notEqual(field.validate('', { data: {} }), true)
  assert.equal(
    field.validate('  https://youtu.be/N7hJKEvta-U  ', { data: {} }),
    true,
  )
  assert.equal(
    field.hooks.beforeValidate[0]({ value: ' https://youtu.be/N7hJKEvta-U ' }),
    'https://youtu.be/N7hJKEvta-U',
  )
  const direct = SiteVideo.fields.find((field) => field.name === 'videoUrl')
  assert.notEqual(direct.validate('javascript:alert(1)'), true)
  assert.notEqual(direct.validate('https://example.com/page'), true)
})

test('public portfolio lists, featured fallback and detail pages never return unpublished work', async () => {
  const rows = [
    {
      id: 1,
      slug: 'visible',
      published: true,
      featured: false,
      category: { id: 1, name: 'เว็บไซต์', slug: 'website' },
    },
    {
      id: 2,
      slug: 'hidden',
      published: false,
      featured: true,
      category: { id: 1, name: 'เว็บไซต์', slug: 'website' },
    },
  ]
  function matches(row, where) {
    return (
      !where ||
      Object.entries(where).every(([key, value]) =>
        key === 'and'
          ? value.every((condition) => matches(row, condition))
          : key.split('.').reduce((item, field) => item?.[field], row) === value.equals,
      )
    )
  }
  const find = async (options) => {
    assert.equal(
      options.overrideAccess,
      false,
      'Public query must enforce collection access',
    )
    return { docs: rows.filter((row) => matches(row, options.where)) }
  }
  const api = await load('src/lib/portfolio.ts', {
    '@payload-config': { default: {} },
    payload: { getPayload: async () => ({ find }) },
    './category-label': await load('src/lib/category-label.ts'),
  })
  assert.deepEqual(
    (await api.getPortfolio()).map((row) => row.id),
    [1],
  )
  assert.deepEqual(
    (await api.getPortfolio({ category: 'website' })).map((row) => row.id),
    [1],
  )
  assert.deepEqual(
    (await api.getFeaturedPortfolio()).map((row) => row.id),
    [1],
  )
  assert.equal(await api.getPortfolioBySlug('hidden'), null)
  assert.equal((await api.getPortfolioBySlug('visible')).id, 1)
  rows[0].featured = true
  assert.deepEqual(
    (await api.getFeaturedPortfolio()).map((row) => row.id),
    [1],
  )
  rows[0].published = false
  assert.equal((await api.getPortfolio()).length, 0)
  assert.equal((await api.getFeaturedPortfolio()).length, 0)
})

test('unnamed form tabs keep the original data paths and publication fields remain in the sidebar', () => {
  for (const config of [Articles, Portfolio]) {
    const tabs = config.fields.find((field) => field.type === 'tabs')
    assert.ok(tabs.tabs.every((tab) => !tab.name))
    const names = flatten(config.fields).map((field) => field.name)
    assert.equal(new Set(names).size, names.length)
    assert.ok(
      config.fields.some(
        (field) => field.name === 'slug' && field.admin.position === 'sidebar',
      ),
    )
  }
  assert.ok(
    Portfolio.fields.some(
      (field) =>
        field.name === 'published' && field.admin.position === 'sidebar',
    ),
  )
})
