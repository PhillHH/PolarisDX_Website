import { expect, test, type APIRequestContext } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { CONSUMER_PRODUCTS, type ConsumerProductKey } from '../src/content/consumer/products'
import { STATIC_ROUTE_DEFINITIONS } from '../src/routing/routeRegistry'

/**
 * AP21 PT21.6 — der breite Consumer-SEO-Gate.
 *
 * Gemessen wird die ROHE Serverantwort, nicht der hydrierte DOM: was
 * Suchmaschinen und Social-Crawler sehen, muss im ersten Byte stehen. Jede
 * der 30 Routen (3 Produktfamilien x 10 Locales) wird einzeln geprueft —
 * kein Stichprobenschluss von einer Locale auf die anderen.
 *
 * Die Produktinhalts-Wahrheit (Preise, Claims, Bundle) ist in PT21.2–PT21.4
 * bewiesen und wird hier NICHT erneut breit geprueft; hier zaehlt allein die
 * SEO-/Indexierungsebene und dass sie nicht mehr verspricht, als die Seite
 * wirklich hergibt.
 */

const ORIGIN = 'https://polarisdx.net'
const PRODUCTS: ConsumerProductKey[] = ['spray', 'masks', 'duo']
const SLUGS = PRODUCTS.map((key) => CONSUMER_PRODUCTS[key].slug)
const DEFAULT_LOCALE = 'de'

/** Die 30 kanonischen Routen — eine Liste, aus der alles Weitere abgeleitet wird. */
const ROUTES = SLUGS.flatMap((slug) =>
  SUPPORTED_LANGUAGES.map((locale) => ({
    locale,
    slug,
    path: `/${locale}/consumer/${slug}`,
    canonical: `${ORIGIN}/${locale}/consumer/${slug}`,
  })),
)

const meta = (html: string, attr: 'name' | 'property', key: string): string[] =>
  [
    ...html.matchAll(
      new RegExp(`<meta[^>]+${attr}="${key.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}"[^>]*>`, 'giu'),
    ),
  ].map((match) => /content="([^"]*)"/iu.exec(match[0])?.[1] ?? '')

const linkHrefs = (html: string, rel: string): string[] =>
  [...html.matchAll(new RegExp(`<link[^>]+rel="${rel}"[^>]*>`, 'giu'))].map(
    (match) => /href="([^"]*)"/iu.exec(match[0])?.[1] ?? '',
  )

const hreflangs = (html: string): Record<string, string> =>
  Object.fromEntries(
    [...html.matchAll(/<link[^>]+rel="alternate"[^>]*>/giu)]
      .map((match) => [
        /hreflang="([^"]*)"/iu.exec(match[0])?.[1] ?? '',
        /href="([^"]*)"/iu.exec(match[0])?.[1] ?? '',
      ])
      .filter(([lang]) => lang),
  )

const jsonLd = (html: string): Record<string, unknown>[] =>
  [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>(.*?)<\/script>/gsu)].flatMap(
    (match) => {
      const parsed = JSON.parse(match[1].replace(/&quot;/gu, '"')) as unknown
      return Array.isArray(parsed)
        ? (parsed as Record<string, unknown>[])
        : [parsed as Record<string, unknown>]
    },
  )

/** Roher GET ohne Redirect-Folgen — der Statuscode selbst ist Teil der Messung. */
const raw = (request: APIRequestContext, path: string) =>
  request.get(path, { maxRedirects: 0, failOnStatusCode: false })

test.describe('PT21.6 Consumer-SEO — 30-Routen-Matrix', () => {
  test('30/30 antworten direkt mit HTTP 200 — keine Weiterleitung, kein Basic Auth', async ({
    request,
  }) => {
    const failures: string[] = []
    for (const route of ROUTES) {
      const response = await raw(request, route.path)
      if (response.status() !== 200) {
        failures.push(
          `${route.path} → ${response.status()} ${response.headers()['location'] ?? ''}`,
        )
        continue
      }
      const headers = response.headers()
      // Kein Preview-Schutz, kein Auth-Gate, kein Header-noindex.
      if (headers['www-authenticate']) failures.push(`${route.path}: Basic Auth`)
      if (/noindex/iu.test(headers['x-robots-tag'] ?? '')) {
        failures.push(`${route.path}: X-Robots-Tag ${headers['x-robots-tag']}`)
      }
    }
    expect(failures, '30 Routen mit 200 und ohne Zugangsschutz').toEqual([])
    expect(ROUTES).toHaveLength(30)
  })

  test('keine gueltige Locale wird weggeleitet; nur der praefixlose Pfad geht 301 auf DE', async ({
    request,
  }) => {
    const findings: string[] = []
    for (const slug of SLUGS) {
      // Ohne Sprachpraefix: genau ein 301 auf die DE-Fassung, nicht auf EN.
      const bare = await raw(request, `/consumer/${slug}`)
      if (bare.status() !== 301) findings.push(`/consumer/${slug} → ${bare.status()} statt 301`)
      const target = bare.headers()['location'] ?? ''
      if (target !== `/${DEFAULT_LOCALE}/consumer/${slug}`) {
        findings.push(`/consumer/${slug} → ${target} statt /de/...`)
      }
      // Und keine der zehn gueltigen Locales wird umgeleitet — auch nicht nach EN.
      for (const locale of SUPPORTED_LANGUAGES) {
        const response = await raw(request, `/${locale}/consumer/${slug}`)
        if (response.status() >= 300 && response.status() < 400) {
          findings.push(
            `/${locale}/consumer/${slug} → ${response.status()} ${response.headers()['location']}`,
          )
        }
      }
    }
    expect(findings, 'Redirect-Matrix').toEqual([])
  })

  test('30/30 sind index/follow — kein noindex, kein nofollow', async ({ request }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      const html = await (await raw(request, route.path)).text()
      for (const name of ['robots', 'googlebot']) {
        const values = meta(html, 'name', name)
        if (values.length !== 1) {
          findings.push(`${route.path}: ${values.length}x meta ${name}`)
          continue
        }
        if (!/index/iu.test(values[0]) || /noindex/iu.test(values[0])) {
          findings.push(`${route.path}: ${name}="${values[0]}"`)
        }
        if (/nofollow/iu.test(values[0])) findings.push(`${route.path}: ${name} nofollow`)
      }
    }
    expect(findings, 'Indexierbarkeit').toEqual([])
  })

  test('die ausgelieferte robots-Direktive deckt sich mit der Registry-Deklaration', async ({
    request,
  }) => {
    // Registry und gerenderter Head sind ZWEI Quellen. Beim Mutationstest fiel
    // auf, dass eine Registry-Umstellung auf NOINDEX das Canonical kollabieren
    // liess, waehrend die Seite weiterhin "index, follow" behauptete — genau
    // diese Divergenz waere im Betrieb unsichtbar. Deshalb hier explizit.
    const findings: string[] = []
    for (const route of ROUTES) {
      const definition = STATIC_ROUTE_DEFINITIONS.find(
        (entry) => entry.pathPattern === `/consumer/${route.slug}`,
      )
      expect(definition, `Registry-Eintrag fuer ${route.slug}`).toBeTruthy()

      const html = await (await raw(request, route.path)).text()
      const rendered = meta(html, 'name', 'robots')[0] ?? ''
      const declaredIndexable = definition!.indexability === 'INDEX_FOLLOW'
      const renderedIndexable = !/noindex/iu.test(rendered)

      if (declaredIndexable !== renderedIndexable) {
        findings.push(
          `${route.path}: Registry ${definition!.indexability}, ausgeliefert "${rendered}"`,
        )
      }
      // Und die Registry selbst muss fuer alle drei Familien indexierbar sein.
      if (!declaredIndexable) findings.push(`${route.slug}: Registry nicht INDEX_FOLLOW`)
    }
    expect(findings, 'Registry ↔ ausgelieferte Indexierbarkeit').toEqual([])
  })

  test('30/30 tragen genau ein Self-Canonical auf die eigene Locale', async ({ request }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      const html = await (await raw(request, route.path)).text()
      const canonicals = linkHrefs(html, 'canonical')
      if (canonicals.length !== 1) {
        findings.push(`${route.path}: ${canonicals.length} Canonicals`)
        continue
      }
      if (canonicals[0] !== route.canonical) {
        findings.push(`${route.path}: canonical ${canonicals[0]} statt ${route.canonical}`)
      }
      // og:url und twitter:url muessen dasselbe sagen.
      if (meta(html, 'property', 'og:url')[0] !== route.canonical) {
        findings.push(`${route.path}: og:url weicht ab`)
      }
    }
    expect(findings, 'Canonical').toEqual([])
  })

  test('30/30 tragen zehn hreflang-Alternativen plus x-default auf DE — reziprok', async ({
    request,
  }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      const html = await (await raw(request, route.path)).text()
      const alternates = hreflangs(html)
      const languages = Object.keys(alternates).filter((lang) => lang !== 'x-default')

      if (languages.length !== SUPPORTED_LANGUAGES.length) {
        findings.push(`${route.path}: ${languages.length} hreflang statt 10`)
      }
      for (const locale of SUPPORTED_LANGUAGES) {
        const expected = `${ORIGIN}/${locale}/consumer/${route.slug}`
        if (alternates[locale] !== expected) {
          findings.push(`${route.path}: hreflang ${locale} = ${alternates[locale]}`)
        }
      }
      if (alternates['x-default'] !== `${ORIGIN}/${DEFAULT_LOCALE}/consumer/${route.slug}`) {
        findings.push(`${route.path}: x-default = ${alternates['x-default']}`)
      }
      // Reziprozitaet: die eigene Locale steht in der eigenen Liste.
      if (alternates[route.locale] !== route.canonical) {
        findings.push(`${route.path}: nicht reziprok`)
      }
    }
    expect(findings, 'hreflang + x-default').toEqual([])
  })

  test('der SSR-Head steht in der ERSTEN Antwort, nicht erst nach der Hydrierung', async ({
    request,
  }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      const html = await (await raw(request, route.path)).text()
      // Alles, was ein Crawler ohne JavaScript sehen muss.
      const head = html.slice(0, html.indexOf('</head>'))
      for (const [label, present] of [
        // react-helmet setzt das Attribut data-rh am Title — der Head muss
        // gegen die reale Ausgabe geprueft werden, nicht gegen eine Idealform.
        ['title', /<title[^>]*>[^<]{10,}<\/title>/u.test(head)],
        ['description', meta(head, 'name', 'description')[0]?.length > 20],
        ['canonical', linkHrefs(head, 'canonical').length === 1],
        ['hreflang', Object.keys(hreflangs(head)).length === 11],
        ['og:image', meta(head, 'property', 'og:image')[0]?.startsWith('https://')],
        ['json-ld', /application\/ld\+json/u.test(head) || /application\/ld\+json/u.test(html)],
      ] as const) {
        if (!present) findings.push(`${route.path}: ${label} fehlt im ersten Response-Head`)
      }
      // Und der sichtbare Produktinhalt ist ebenfalls schon da (kein leeres Gerüst).
      if (!/<h1[^>]*>[^<]{5,}/u.test(html)) findings.push(`${route.path}: keine gerenderte H1`)
    }
    expect(findings, 'SSR-Head').toEqual([])
  })
})

test.describe('PT21.6 Consumer-SEO — Sitemap, Social, Schema, Verlinkung', () => {
  test('die Sitemap fuehrt exakt die 30 kanonischen URLs — keine fehlt, keine ist fremd', async ({
    request,
  }) => {
    const response = await raw(request, '/sitemap.xml')
    expect(response.status()).toBe(200)
    const xml = await response.text()
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1])

    const consumerUrls = urls.filter((url) => url.includes('/consumer/'))
    expect(new Set(consumerUrls).size, 'keine Dubletten').toBe(consumerUrls.length)
    expect(consumerUrls.sort()).toEqual(ROUTES.map((route) => route.canonical).sort())

    // Jede Sitemap-URL ist die Canonical-Fassung, keine Redirect-Quelle.
    for (const url of consumerUrls) {
      const path = url.replace(ORIGIN, '')
      expect((await raw(request, path)).status(), `${path} in der Sitemap`).toBe(200)
    }
  })

  test('Social-Karten sind produktspezifisch, lokalisiert und behaupten kein fremdes Asset', async ({
    request,
  }) => {
    const findings: string[] = []
    const imagesByProduct = new Map<string, Set<string>>()

    for (const route of ROUTES) {
      const html = await (await raw(request, route.path)).text()
      const get = (key: string) => meta(html, 'property', key)[0] ?? ''
      const twitter = (key: string) => meta(html, 'name', key)[0] ?? ''

      if (get('og:type') !== 'product') findings.push(`${route.path}: og:type ${get('og:type')}`)
      // OpenGraph verlangt `sprache_TERRITORIUM` (de_DE, en_GB) — nicht den
      // blossen Sprachcode. Geprueft wird die Sprache plus ein Territorium.
      if (!new RegExp(`^${route.locale}_[A-Z]{2}$`, 'u').test(get('og:locale'))) {
        findings.push(`${route.path}: og:locale ${get('og:locale')}`)
      }
      for (const key of ['og:title', 'og:description', 'og:image:alt']) {
        if (get(key).length < 10) findings.push(`${route.path}: ${key} zu kurz/leer`)
      }
      if (twitter('twitter:card') !== 'summary_large_image') {
        findings.push(`${route.path}: twitter:card ${twitter('twitter:card')}`)
      }
      if (twitter('twitter:title') !== get('og:title')) {
        findings.push(`${route.path}: twitter:title weicht von og:title ab`)
      }
      // Bildmasse muessen gesetzt sein, sonst rendern Crawler blind.
      if (!/^\d+$/u.test(get('og:image:width')) || !/^\d+$/u.test(get('og:image:height'))) {
        findings.push(`${route.path}: og:image Masse fehlen`)
      }

      const image = get('og:image')
      if (!image.startsWith(`${ORIGIN}/`)) findings.push(`${route.path}: og:image nicht absolut`)
      // Kein Sprach-Segment im Bildpfad: das Bild ist sprachneutral und darf
      // keine locale-spezifische Fassung behaupten, die es nicht gibt.
      if (new RegExp(`/(${SUPPORTED_LANGUAGES.join('|')})/`, 'u').test(image)) {
        findings.push(`${route.path}: og:image behauptet eine Locale-Fassung (${image})`)
      }
      if (!imagesByProduct.has(route.slug)) imagesByProduct.set(route.slug, new Set())
      imagesByProduct.get(route.slug)!.add(image)
    }

    // Jede Produktfamilie hat GENAU EIN eigenes Bild, und die drei sind verschieden.
    const perProduct = [...imagesByProduct.entries()]
    for (const [slug, images] of perProduct) {
      if (images.size !== 1) findings.push(`${slug}: ${images.size} verschiedene og:image`)
    }
    const distinct = new Set(perProduct.map(([, images]) => [...images][0]))
    if (distinct.size !== SLUGS.length) findings.push('Produkte teilen sich ein og:image')

    expect(findings, 'Social').toEqual([])

    // Und die Bilder existieren wirklich.
    for (const [, images] of perProduct) {
      const path = [...images][0].replace(ORIGIN, '')
      expect((await raw(request, path)).status(), `og:image ${path}`).toBe(200)
    }
  })

  test('strukturierte Daten bleiben wahrheitssicher — kein erfundenes Angebot', async ({
    request,
  }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      const html = await (await raw(request, route.path)).text()
      const entries = jsonLd(html)
      const product = entries.find((entry) => entry['@type'] === 'Product')
      const crumbs = entries.find((entry) => entry['@type'] === 'BreadcrumbList')
      const faq = entries.find((entry) => entry['@type'] === 'FAQPage')

      if (!product) {
        findings.push(`${route.path}: kein Product-Schema`)
        continue
      }
      if (!crumbs) findings.push(`${route.path}: kein BreadcrumbList`)
      if (!faq) findings.push(`${route.path}: kein FAQPage`)
      if (product.url !== route.canonical)
        findings.push(`${route.path}: Product.url ${product.url}`)

      // Nichts behaupten, wofuer es keine belegte Quelle gibt.
      for (const forbidden of [
        'offers',
        'price',
        'priceCurrency',
        'availability',
        'aggregateRating',
        'review',
        'gtin',
        'gtin13',
        'sku',
        'mpn',
      ]) {
        if (forbidden in product) findings.push(`${route.path}: Product.${forbidden}`)
      }
      // Auch nicht verschachtelt.
      const serialized = JSON.stringify(product)
      for (const forbidden of ['"offers"', '"aggregateRating"', '"review"', '"sku"']) {
        if (serialized.includes(forbidden))
          findings.push(`${route.path}: ${forbidden} verschachtelt`)
      }
    }
    expect(findings, 'Structured Data').toEqual([])
  })

  test('jede Produktseite hat eingehende, locale-korrekte Links ohne Redirect-Umweg', async ({
    request,
  }) => {
    const findings: string[] = []
    // Fuer jede Locale: welche Consumer-Seite verlinkt auf welche?
    for (const locale of SUPPORTED_LANGUAGES) {
      const inbound = new Map<string, string[]>(SLUGS.map((slug) => [slug, []]))
      for (const source of SLUGS) {
        const html = await (await raw(request, `/${locale}/consumer/${source}`)).text()
        const hrefs = [...html.matchAll(/href="(\/[^"]*\/consumer\/[^"#?]+)"/gu)].map(
          (match) => match[1],
        )
        for (const href of hrefs) {
          // Interne Links muessen das Sprachpraefix tragen — sonst waeren sie
          // Redirect-Quellen (301 auf /de/) und verschenken Linkkraft.
          if (!href.startsWith(`/${locale}/consumer/`)) {
            findings.push(`${locale}/${source}: Link ohne korrektes Praefix → ${href}`)
            continue
          }
          const target = href.replace(`/${locale}/consumer/`, '')
          if (target !== source) inbound.get(target)?.push(source)
        }
      }
      for (const [slug, sources] of inbound) {
        if (sources.length === 0) findings.push(`${locale}: ${slug} ohne eingehenden Link`)
      }
    }
    expect(findings, 'Interne Verlinkung').toEqual([])
  })

  test('kein interner Consumer-Link zeigt ins Leere', async ({ request }) => {
    const checked = new Set<string>()
    const findings: string[] = []
    for (const locale of SUPPORTED_LANGUAGES) {
      for (const slug of SLUGS) {
        const html = await (await raw(request, `/${locale}/consumer/${slug}`)).text()
        for (const match of html.matchAll(/href="(\/[a-z]{2}\/[^"#?]*)"/gu)) {
          const href = match[1]
          if (checked.has(href)) continue
          checked.add(href)
          const status = (await raw(request, href)).status()
          if (status !== 200) findings.push(`${locale}/${slug} → ${href} = ${status}`)
        }
      }
    }
    expect(findings, `tote oder umgeleitete interne Links (${checked.size} geprueft)`).toEqual([])
    expect(checked.size).toBeGreaterThan(10)
  })
})
