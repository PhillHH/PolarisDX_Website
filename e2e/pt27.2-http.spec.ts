import { expect, test } from '@playwright/test'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { PUBLIC_SEO_ORIGIN, publicSeoUrl } from '../src/components/seo/seoRouteSource'
import { generateSitemapXml, getSitemapRouteFamilies } from '../src/components/seo/sitemap'
import { validateSitemapArtifact } from '../src/components/seo/sitemapGuard'
import {
  getCanonicalRouteEntries,
  getRedirectRegistryEntries,
  getSitemapEligibleRouteEntries,
  type CanonicalRouteEntry,
} from '../src/routing/routeRegistry'

/**
 * AP27 PT27.2 — SSR, HTTP-Status und SEO-Artefakte als Integrationsvertrag.
 *
 * Nur `request`: der erste HTTP-Response muss die SEO-Semantik tragen, ohne Hydration. Die
 * Erwartungen kommen aus Registry und SEO-Quelle desselben Arbeitsbaums, nicht aus Zahlen.
 * Repraesentativ statt vollstaendig — die breite Matrix ist PT27.5.
 */

const tags = (html: string, name: string) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => match[0])
const attr = (tag: string, name: string) =>
  tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1]?.replaceAll('&amp;', '&')
const headOf = (html: string) => html.slice(0, Math.max(0, html.indexOf('</head>')))
const localized = (locale: string, path: string) => `/${locale}${path === '/' ? '/' : path}`

const pick = (label: string, predicate: (route: CanonicalRouteEntry) => boolean) => {
  const route = getCanonicalRouteEntries().find(predicate)
  if (!route) throw new Error(`Registry liefert keine Route fuer ${label}`)
  return route
}

const REPRESENTATIVE = [
  pick('home', (route) => route.id === 'home'),
  pick('contact', (route) => route.id === 'contact'),
  pick('service', (route) => route.routeType === 'SERVICE'),
  pick('epigenetics hub', (route) => route.id === 'epigenetics'),
  pick('report', (route) => route.routeType === 'REPORT'),
  pick('article', (route) => route.routeType === 'ARTICLE'),
  pick('consumer', (route) => route.routeType === 'CONSUMER_PRODUCT'),
]

test('PT27.2 · der Server liefert den in diesem Lauf gebauten Stand aus', async ({ request }) => {
  const entry = fileURLToPath(
    new URL('../node_modules/.cache/pt27.2/server/entry-server.js', import.meta.url),
  )
  expect(fs.statSync(entry).mtimeMs).toBeGreaterThanOrEqual(Number(process.env.PT272_BUILD_STARTED))
  expect((await request.get('/de/', { maxRedirects: 0 })).status()).toBe(200)
})

for (const route of REPRESENTATIVE) {
  test(`PT27.2 · SSR-Head im ersten Response: ${route.path}`, async ({ request }) => {
    const copy: Record<string, string> = {}
    for (const locale of ['de', 'en', 'cs'] as const) {
      const pathname = localized(locale, route.path)
      const response = await request.get(pathname, { maxRedirects: 0 })
      expect(response.status(), pathname).toBe(200)
      expect(response.headers()['content-type'], pathname).toContain('text/html')

      const html = await response.text()
      const head = headOf(html)
      expect(attr(tags(html, 'html')[0] ?? '', 'lang'), `${pathname} lang`).toBe(locale)

      const titles = [...head.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map((m) => m[1].trim())
      const metas = tags(head, 'meta')
      const descriptions = metas.filter((tag) => attr(tag, 'name') === 'description')
      const robots = metas.filter((tag) => attr(tag, 'name') === 'robots')
      expect(titles, `${pathname} title`).toHaveLength(1)
      expect(titles[0], `${pathname} title`).toBeTruthy()
      expect(descriptions, `${pathname} description`).toHaveLength(1)
      expect(attr(descriptions[0], 'content'), `${pathname} description`).toBeTruthy()
      expect(
        robots.map((tag) => attr(tag, 'content')),
        `${pathname} robots`,
      ).toEqual([expect.stringMatching(/^index, follow/)])

      const links = tags(head, 'link')
      expect(
        links.filter((tag) => attr(tag, 'rel') === 'canonical').map((tag) => attr(tag, 'href')),
        `${pathname} canonical`,
      ).toEqual([publicSeoUrl(locale, route.path)])
      expect(
        links
          .filter((tag) => attr(tag, 'rel') === 'alternate' && attr(tag, 'hreflang'))
          .map((tag) => [attr(tag, 'hreflang'), attr(tag, 'href')]),
        `${pathname} hreflang`,
      ).toEqual([
        ...SUPPORTED_LANGUAGES.map((language) => [language, publicSeoUrl(language, route.path)]),
        ['x-default', publicSeoUrl('de', route.path)],
      ])

      expect(html, pathname).not.toMatch(/preview\.polarisdx\.net|localhost:|127\.0\.0\.1/)
      // Vor jeder Einwilligung: kein Provider-Script im ausgelieferten Dokument.
      expect(
        tags(html, 'script').filter((tag) => /google|doubleclick/i.test(attr(tag, 'src') ?? '')),
        pathname,
      ).toEqual([])
      expect(html, pathname).not.toContain('googletagmanager.com/gtm.js')

      copy[locale] = `${titles[0]}\n${attr(descriptions[0], 'content')}`
    }
    expect(copy.en, `${route.path} en lokalisiert`).not.toBe(copy.de)
    expect(copy.cs, `${route.path} cs lokalisiert`).not.toBe(copy.de)
  })
}

test('PT27.2 · 301 folgen der Registry: genau ein Hop auf ein 200-Ziel', async ({ request }) => {
  const cases: Array<[string, string]> = [
    ['/', '/de/'],
    ['/about?ref=pt272', '/de/about?ref=pt272'],
    ['/services', '/de/diagnostics'],
    ...getRedirectRegistryEntries().map(
      (redirect) => [`/pl${redirect.sourcePath}`, `/pl${redirect.targetPath}`] as [string, string],
    ),
  ]
  for (const [source, target] of cases) {
    const response = await request.get(source, { maxRedirects: 0 })
    expect(response.status(), source).toBe(301)
    expect(response.headers().location, source).toBe(target)
    const next = await request.get(target, { maxRedirects: 0 })
    expect(next.status(), `${source} → ${target}`).toBe(200)
    expect(next.headers().location, `${source} → ${target}`).toBeUndefined()
  }
})

test('PT27.2 · unbekannte Routen und Slugs sind echte 404 mit nicht indexierbarem Head', async ({
  request,
}) => {
  for (const pathname of [
    '/de/__pt272-unknown__',
    '/__pt272-unknown__',
    '/xx/about',
    '/en/diagnostics/__pt272__',
    '/fr/articles/__pt272__',
    '/pl/epigenetics/musterbefund/__pt272__',
    '/cs/consumer/__pt272__',
    '/de/services/__pt272__',
  ]) {
    const response = await request.get(pathname, { maxRedirects: 0 })
    expect(response.status(), pathname).toBe(404)
    expect(response.headers().location, pathname).toBeUndefined()
    expect(response.headers()['content-type'], pathname).toContain('text/html')
    const head = headOf(await response.text())
    const metas = tags(head, 'meta')
    expect(
      metas.filter((tag) => attr(tag, 'name') === 'robots').map((tag) => attr(tag, 'content')),
      pathname,
    ).toEqual(['noindex, follow'])
    expect(
      metas.some(
        (tag) => attr(tag, 'name') === 'prerender-status-code' && attr(tag, 'content') === '404',
      ),
      pathname,
    ).toBe(true)
    const links = tags(head, 'link')
    expect(
      links.filter((tag) => attr(tag, 'rel') === 'canonical'),
      pathname,
    ).toEqual([])
    expect(
      links.filter((tag) => attr(tag, 'hreflang')),
      pathname,
    ).toEqual([])
  }
})

test('PT27.2 · ausgelieferte Sitemap ist die Registry-Ausgabe dieses Stands', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml', { maxRedirects: 0 })
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/xml')
  const xml = await response.text()

  expect(xml).toBe(generateSitemapXml())
  const families = getSitemapRouteFamilies()
  expect(() => validateSitemapArtifact(xml, families)).not.toThrow()
  expect(xml).not.toMatch(/preview\.polarisdx\.net|localhost|127\.0\.0\.1/)

  const eligible = getSitemapEligibleRouteEntries()
  const expectedLocs = new Set(
    eligible.flatMap((route) =>
      SUPPORTED_LANGUAGES.map((locale) => publicSeoUrl(locale, route.path)),
    ),
  )
  const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1])
  expect(blocks).toHaveLength(expectedLocs.size)

  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? ''
    expect(expectedLocs.has(loc), loc).toBe(true)
    expect(new URL(loc).origin).toBe(PUBLIC_SEO_ORIGIN)
    const path = new URL(loc).pathname.slice(3) || '/'
    const alternates = Object.fromEntries(
      [...block.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((match) => [
        match[1],
        match[2],
      ]),
    )
    expect(Object.keys(alternates), loc).toEqual([...SUPPORTED_LANGUAGES, 'x-default'])
    expect(alternates['x-default'], loc).toBe(publicSeoUrl('de', path))
    const family = families.find((candidate) => candidate.path === path)
    expect(family, loc).toBeTruthy()
    // `lastmod` nur, wenn die Registry ein belastbares Datum kennt — und dann genau dieses.
    expect(block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1], loc).toBe(family?.lastmod)
  }

  for (const route of getCanonicalRouteEntries().filter((r) => r.indexability !== 'INDEX_FOLLOW')) {
    for (const locale of SUPPORTED_LANGUAGES) {
      expect(xml, route.path).not.toContain(`<loc>${publicSeoUrl(locale, route.path)}</loc>`)
    }
  }
})

test('PT27.2 · hreflang-Ziele der Sitemap sind erreichbar und selbstkanonisch', async ({
  request,
}) => {
  for (const family of getSitemapRouteFamilies()) {
    for (const locale of ['cs', 'de'] as const) {
      const pathname = localized(locale, family.path)
      const response = await request.get(pathname, { maxRedirects: 0 })
      expect(response.status(), pathname).toBe(200)
      const canonical = tags(headOf(await response.text()), 'link')
        .filter((tag) => attr(tag, 'rel') === 'canonical')
        .map((tag) => attr(tag, 'href'))
      expect(canonical, pathname).toEqual([publicSeoUrl(locale, family.path)])
    }
  }
})
