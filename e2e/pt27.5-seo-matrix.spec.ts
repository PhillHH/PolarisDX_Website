import fs from 'node:fs'

import { expect, test, type APIRequestContext } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { articles } from '../src/data/articles'
import { PUBLIC_SEO_ORIGIN, publicSeoUrl } from '../src/components/seo/seoRouteSource'
import { getSitemapRouteFamilies } from '../src/components/seo/sitemap'
import {
  getArticleRouteEntries,
  getCanonicalRouteEntries,
  getSearchEligibleRouteEntries,
  getSitemapEligibleRouteEntries,
  isKnownCanonicalPath,
  type CanonicalRouteEntry,
} from '../src/routing/routeRegistry'
import { PT275_SERVER_ENTRY } from './pt27.5.config'

/**
 * AP27 PT27.5 — was die bestehenden Matrix-Specs nicht abdecken.
 *
 * `url-smoke`, `seo-head` und `sitemap` laufen im selben Lauf (Status x10, Redirects x10, Consumer
 * 3x10, 390 Sitemap-URLs). Diese Datei ergaenzt: den Head JEDER Registry-Route x10 — auch der, die
 * nicht in der Sitemap stehen (Support, Legal) —, 404 fuer die uebrigen Routenfamilien, die
 * Browser-Semantik von Query und Fragment bei `/services*`, die Wahrheit von `lastmod` und die
 * Drift zwischen Sitemap, Suche und Registry. Alle Erwartungen kommen aus Registry und SEO-Quelle
 * dieses Arbeitsbaums; keine Zahl ist hart kodiert.
 */

const tags = (html: string, name: string) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => match[0])
const attr = (tag: string, name: string) =>
  tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1]?.replaceAll('&amp;', '&')
const headOf = (html: string) => html.slice(0, Math.max(0, html.indexOf('</head>')))
const localized = (locale: string, path: string) => `/${locale}${path === '/' ? '/' : path}`
const metaContent = (head: string, key: 'name' | 'property', value: string) =>
  tags(head, 'meta')
    .filter((tag) => attr(tag, key) === value)
    .map((tag) => attr(tag, 'content'))

const TRANSLATION_KEY = /^[a-z][\w-]*(?::[\w-]+)?(?:\.[\w-]+)+$/i
const PLACEHOLDER =
  /\b(?:lorem ipsum|tbd|placeholder|preview copy|coming soon|undefined)\b|\{\{[^}]*\}\}/i
const FOREIGN_HOST = /preview\.polarisdx\.net|localhost|127\.0\.0\.1/

async function inBatches<T>(items: readonly T[], size: number, run: (item: T) => Promise<void>) {
  for (let offset = 0; offset < items.length; offset += size) {
    await Promise.all(items.slice(offset, offset + size).map(run))
  }
}

const fetchSitemap = async (request: APIRequestContext) => {
  const response = await request.get('/sitemap.xml', { maxRedirects: 0 })
  expect(response.status()).toBe(200)
  return response.text()
}

const CANONICAL: readonly CanonicalRouteEntry[] = getCanonicalRouteEntries()
const SITEMAP_PATHS = new Set(getSitemapEligibleRouteEntries().map((route) => route.path))

test('PT27.5 · der Server liefert den in diesem Lauf gebauten Stand aus', async ({ request }) => {
  expect(fs.statSync(PT275_SERVER_ENTRY).mtimeMs).toBeGreaterThanOrEqual(
    Number(process.env.PT275_BUILD_STARTED),
  )
  expect((await request.get('/de/', { maxRedirects: 0 })).status()).toBe(200)
})

test.describe('PT27.5 · Head jeder Registry-Route x10', () => {
  for (const locale of SUPPORTED_LANGUAGES) {
    test(`${locale}: Status, Sprache, Canonical, hreflang, Robots, Sitemap und Metatexte`, async ({
      request,
    }) => {
      const sitemap = await fetchSitemap(request)
      await inBatches(CANONICAL, 8, async (route) => {
        const pathname = localized(locale, route.path)
        const response = await request.get(pathname, { maxRedirects: 0 })
        expect(response.status(), pathname).toBe(200)
        expect(response.headers().location, pathname).toBeUndefined()

        const html = await response.text()
        const head = headOf(html)
        expect(attr(tags(html, 'html')[0] ?? '', 'lang'), `${pathname} lang`).toBe(locale)

        const titles = [...head.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map((m) =>
          m[1].trim(),
        )
        const descriptions = metaContent(head, 'name', 'description')
        expect(titles, `${pathname} title`).toHaveLength(1)
        expect(descriptions, `${pathname} description`).toHaveLength(1)
        for (const text of [titles[0], descriptions[0] ?? '']) {
          expect(text.trim(), `${pathname} leer`).not.toBe('')
          expect(TRANSLATION_KEY.test(text), `${pathname} Key-Leak: ${text}`).toBe(false)
          expect(PLACEHOLDER.test(text), `${pathname} Platzhalter: ${text}`).toBe(false)
        }

        const canonical = publicSeoUrl(locale, route.path)
        const links = tags(head, 'link')
        expect(
          links.filter((tag) => attr(tag, 'rel') === 'canonical').map((tag) => attr(tag, 'href')),
          `${pathname} canonical`,
        ).toEqual([canonical])
        expect(metaContent(head, 'property', 'og:url'), `${pathname} og:url`).toEqual([canonical])
        const ogImage = metaContent(head, 'property', 'og:image')
        expect(ogImage, `${pathname} og:image`).toEqual([expect.stringMatching(/^https:\/\//)])
        expect(new URL(String(ogImage[0])).origin, `${pathname} og:image host`).toBe(
          PUBLIC_SEO_ORIGIN,
        )
        expect(head, `${pathname} fremder Host`).not.toMatch(FOREIGN_HOST)

        const robots = metaContent(head, 'name', 'robots')
        const alternates = links
          .filter((tag) => attr(tag, 'rel') === 'alternate' && attr(tag, 'hreflang'))
          .map((tag) => [attr(tag, 'hreflang'), attr(tag, 'href')])
        const inSitemap = sitemap.includes(`<loc>${canonical}</loc>`)

        if (route.indexability === 'INDEX_FOLLOW') {
          expect(robots, `${pathname} robots`).toEqual([expect.stringMatching(/^index, follow/)])
          expect(alternates, `${pathname} hreflang`).toEqual([
            ...SUPPORTED_LANGUAGES.map((language) => [
              language,
              publicSeoUrl(language, route.path),
            ]),
            ['x-default', publicSeoUrl('de', route.path)],
          ])
          expect(inSitemap, `${pathname} Sitemap folgt der Registry`).toBe(
            SITEMAP_PATHS.has(route.path),
          )
        } else {
          // S-08: nicht indexierbar heisst weder Sitemap noch hreflang-Werbung.
          expect(robots, `${pathname} robots`).toEqual(['noindex, nofollow'])
          expect(alternates, `${pathname} hreflang`).toEqual([])
          expect(inSitemap, `${pathname} noindex in der Sitemap`).toBe(false)
        }
      })
    })
  }
})

test('PT27.5 · Legal: eine widerspruchsfreie Indexierungsentscheidung', async ({ request }) => {
  const legal = CANONICAL.filter((route) => route.routeType === 'LEGAL')
  expect(legal.length).toBeGreaterThan(0)
  for (const route of legal) {
    expect(route, route.path).toMatchObject({
      indexability: 'NOINDEX_NOFOLLOW',
      sitemap: false,
      searchEligible: false,
    })
  }
  // Keine Route ist zugleich noindex und sitemap- oder suchfaehig.
  for (const route of CANONICAL.filter((entry) => entry.indexability !== 'INDEX_FOLLOW')) {
    expect(SITEMAP_PATHS.has(route.path), route.path).toBe(false)
    expect(route.searchEligible, `${route.path} suchfaehig trotz noindex`).toBe(false)
  }
  const sitemap = await fetchSitemap(request)
  for (const route of legal) {
    for (const locale of SUPPORTED_LANGUAGES) {
      expect(sitemap, `${locale}${route.path}`).not.toContain(
        `<loc>${publicSeoUrl(locale, route.path)}</loc>`,
      )
    }
  }
})

test('PT27.5 · unbekannte Slugs aller uebrigen Familien sind echte 404 x10', async ({
  request,
}) => {
  const unknown = [
    '/__pt275-unbekannt__',
    '/events/__pt275__',
    '/consumer/__pt275__',
    '/epigenetics/__pt275__',
    '/epigenetics/musterbefund/__pt275__',
    '/diagnostics/__pt275__',
    '/articles/__pt275__',
    '/services/__pt275__',
  ]
  const cases = SUPPORTED_LANGUAGES.flatMap((locale) => unknown.map((path) => `/${locale}${path}`))
  await inBatches([...cases, '/__pt275-unbekannt__'], 8, async (pathname) => {
    const response = await request.get(`${pathname}?utm_source=pt275`, { maxRedirects: 0 })
    expect(response.status(), pathname).toBe(404)
    expect(response.headers().location, pathname).toBeUndefined()
    const head = headOf(await response.text())
    expect(metaContent(head, 'name', 'robots'), pathname).toEqual(['noindex, follow'])
    expect(metaContent(head, 'name', 'prerender-status-code'), pathname).toEqual(['404'])
    const links = tags(head, 'link')
    // Insbesondere kein Canonical auf die Startseite.
    expect(
      links.filter((tag) => attr(tag, 'rel') === 'canonical'),
      pathname,
    ).toEqual([])
    expect(
      links.filter((tag) => attr(tag, 'hreflang')),
      pathname,
    ).toEqual([])
    expect(metaContent(head, 'property', 'og:url'), pathname).toEqual([])
  })
})

test('PT27.5 · /services* im Browser: ein 301, Query bleibt, Fragment bleibt clientseitig', async ({
  page,
}) => {
  for (const [source, target] of [
    ['/de/services/dental?ref=pt275#ablauf', '/de/diagnostics/dental?ref=pt275#ablauf'],
    ['/services?ref=pt275#start', '/de/diagnostics?ref=pt275#start'],
    ['/pl/services?ref=pt275', '/pl/diagnostics?ref=pt275'],
  ] as const) {
    const response = await page.goto(source)
    expect(response?.status(), source).toBe(200)
    const first = response?.request().redirectedFrom()
    expect(first, `${source} ohne Redirect`).toBeTruthy()
    expect(first?.redirectedFrom(), `${source} Redirect-Kette`).toBeNull()
    expect((await first!.response())?.status(), source).toBe(301)
    const url = new URL(page.url())
    expect(`${url.pathname}${url.search}${url.hash}`, source).toBe(target)
  }
})

test('PT27.5 · lastmod ist syntaktisch gueltig, differenziert und aus Artikeldaten ableitbar', async ({
  request,
}) => {
  const xml = await fetchSitemap(request)
  const published = new Map(articles.map((article) => [article.id, article.datePublished]))
  const articleLastmod = new Map(
    getArticleRouteEntries().map((route) => [route.path, published.get(route.sourceId)]),
  )
  for (const [path, date] of articleLastmod) {
    expect(date, `${path} ohne Publikationsdatum`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  }

  const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1])
  const seen: string[] = []
  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? ''
    const path = new URL(loc).pathname.slice(3) || '/'
    const lastmods = [...block.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1])
    expect(lastmods.length, loc).toBeLessThanOrEqual(1)
    if (articleLastmod.has(path)) {
      expect(lastmods, loc).toEqual([articleLastmod.get(path)])
      const date = lastmods[0]
      expect(Number.isNaN(Date.parse(date)), loc).toBe(false)
      expect(Date.parse(date), `${loc} liegt in der Zukunft`).toBeLessThanOrEqual(Date.now())
      seen.push(date)
    } else {
      // Ohne belastbare Aenderungsmetadaten wird lastmod weggelassen, nicht erfunden.
      expect(lastmods, loc).toEqual([])
    }
  }
  expect(seen).toHaveLength(articleLastmod.size * SUPPORTED_LANGUAGES.length)
  expect(new Set(seen).size).toBe(new Set(articleLastmod.values()).size)
})

test('PT27.5 · Sitemap, Suche und Registry widersprechen sich nicht', async ({ request }) => {
  const xml = await fetchSitemap(request)
  const families = getSitemapRouteFamilies()
  expect(new Set(families.map((family) => family.path))).toEqual(SITEMAP_PATHS)

  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  expect(new Set(locs).size).toBe(locs.length)
  for (const loc of locs) {
    const url = new URL(loc)
    expect(url.origin, loc).toBe(PUBLIC_SEO_ORIGIN)
    const path = url.pathname.slice(3) || '/'
    expect(isKnownCanonicalPath(path), `${loc} ist keine Registry-Route`).toBe(true)
    expect(SITEMAP_PATHS.has(path), `${loc} nicht sitemap-faehig`).toBe(true)
  }
  expect(locs).toHaveLength(SITEMAP_PATHS.size * SUPPORTED_LANGUAGES.length)

  // Jedes Suchziel ist eine indexierbare, erreichbare Registry-Route — in jeder Sprache.
  const targets = getSearchEligibleRouteEntries()
  const cases = SUPPORTED_LANGUAGES.flatMap((locale) =>
    targets.map((route) => ({ route, pathname: localized(locale, route.path) })),
  )
  await inBatches(cases, 8, async ({ route, pathname }) => {
    expect(route.indexability, route.path).toBe('INDEX_FOLLOW')
    const response = await request.get(pathname, { maxRedirects: 0 })
    expect(response.status(), `${pathname} totes Suchziel`).toBe(200)
  })
})
