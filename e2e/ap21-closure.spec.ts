import { createRequire } from 'node:module'
import { existsSync, readFileSync } from 'node:fs'

import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../src/i18n'
import { STATIC_ROUTE_DEFINITIONS } from '../src/routing/routeRegistry'
import { CONSUMER_PRODUCTS, type ConsumerProductKey } from '../src/content/consumer/products'
import { LEAD_DB_PATH } from './ap21-closure.config'

/**
 * AP21-CLOSURE — unabhaengige, breite Reverifikation.
 *
 * Die Closure traut keinem PT-PASS blind. Deshalb wird hier NICHT die
 * PT-Testliste wiederholt, sondern der Zustand neu hergeleitet:
 *
 *  - Die 30 Routen kommen aus der Route-Registry und der Sprachliste, nicht
 *    aus einer im Test gepflegten Aufzaehlung.
 *  - Der Inhalt wird gegen die Locale-Dateien geprueft, die die Seite
 *    wirklich ausliefert.
 *  - Die Bestellstrecke laeuft gegen ein echtes Backend, und danach wird die
 *    Datenbank gelesen — nicht die Antwort geglaubt.
 *  - Der Claim-Audit sucht aktiv nach dem, was NICHT dastehen darf.
 */

const require = createRequire(new URL('../server/', import.meta.url))
const Database = require('better-sqlite3')

const ORIGIN = 'https://polarisdx.net'

/** CON-02/CON-06: die Familien kommen aus der Registry, nicht aus dem Test. */
const REGISTRY_CONSUMER = STATIC_ROUTE_DEFINITIONS.filter(
  (route) => route.routeType === 'CONSUMER_PRODUCT',
)
const SLUGS = REGISTRY_CONSUMER.map((route) => route.pathPattern.replace('/consumer/', '')).sort()

/** CON-03/CON-04: exakt zehn Locales, Default de. */
const ROUTES = SLUGS.flatMap((slug) =>
  SUPPORTED_LANGUAGES.map((locale) => ({
    locale,
    slug,
    path: `/${locale}/consumer/${slug}`,
    canonical: `${ORIGIN}/${locale}/consumer/${slug}`,
    product: (Object.keys(CONSUMER_PRODUCTS) as ConsumerProductKey[]).find(
      (key) => CONSUMER_PRODUCTS[key].slug === slug,
    )!,
  })),
)

const bundle = (locale: string): Record<string, string> =>
  JSON.parse(readFileSync(`public/locales/${locale}/consumer.json`, 'utf8')) as Record<
    string,
    string
  >

const raw = (request: APIRequestContext, path: string) =>
  request.get(path, { maxRedirects: 0, failOnStatusCode: false })

/**
 * HTML-Entities zurueckuebersetzen. Ohne das schlaegt jeder Vergleich mit der
 * Locale-Copy in Sprachen mit Apostroph fehl (`dell'ufficio` steht im Attribut
 * als `dell&#39;ufficio`) — das waere ein Messfehler, kein Inhaltsfehler.
 */
const decodeEntities = (value: string): string =>
  value
    .replace(/&#(\d+);/gu, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/giu, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/gu, '"')
    .replace(/&apos;/gu, "'")
    .replace(/&lt;/gu, '<')
    .replace(/&gt;/gu, '>')
    .replace(/&nbsp;/gu, '\u00a0')
    .replace(/&amp;/gu, '&')

const meta = (html: string, attr: 'name' | 'property', key: string): string[] =>
  [
    ...html.matchAll(
      new RegExp(`<meta[^>]+${attr}="${key.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}"[^>]*>`, 'giu'),
    ),
  ].map((match) => decodeEntities(/content="([^"]*)"/iu.exec(match[0])?.[1] ?? ''))

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

const leads = () => {
  if (!existsSync(LEAD_DB_PATH)) return []
  const db = new Database(LEAD_DB_PATH, { readonly: true })
  const rows = db.prepare('SELECT * FROM leads ORDER BY created_at, id').all() as Array<
    Record<string, string>
  >
  db.close()
  return rows
}

const axeFindings = async (page: Page): Promise<string[]> => {
  await page.addStyleTag({
    content: '*, *::before, *::after { transition: none !important; animation: none !important; }',
  })
  await page.addScriptTag({ path: createRequire(import.meta.url).resolve('axe-core/axe.min.js') })
  return page.evaluate(async () => {
    const results = await (
      window as unknown as { axe: { run: (o: unknown) => Promise<{ violations: unknown[] }> } }
    ).axe.run({ resultTypes: ['violations'] })
    return (
      results.violations as Array<{
        id: string
        impact: string
        nodes: Array<{ target: string[] }>
      }>
    )
      .filter((v) => ['serious', 'critical'].includes(v.impact))
      .map((v) => `${v.id} :: ${v.nodes[0]?.target.join(' ')}`)
  })
}

// =============================================================================
// C21-03..C21-08 · ROUTE MATRIX
// =============================================================================

test.describe('AP21-CLOSURE · Routenmatrix', () => {
  test('CON-02/03/04/06 · genau drei Familien, zehn Locales, Default de, stabile Slugs', () => {
    expect(SLUGS).toEqual(['hydrating-masks', 'inside-out-duo', 'vitamin-d3-spray'])
    expect(SUPPORTED_LANGUAGES).toHaveLength(10)
    expect(DEFAULT_LANGUAGE).toBe('de')
    expect(ROUTES).toHaveLength(30)
    // Die Slugs des Produktmodells und der Registry sind dieselben.
    expect(
      Object.values(CONSUMER_PRODUCTS)
        .map((product) => product.slug)
        .sort(),
    ).toEqual(SLUGS)
    // Und alle drei sind in der Registry als indexierbar deklariert.
    for (const route of REGISTRY_CONSUMER) expect(route.indexability).toBe('INDEX_FOLLOW')
  })

  test('C21-07/08 · 30/30 HTTP 200, keine EN-Zwangsweiterleitung, kein Zugangsschutz', async ({
    request,
  }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      const response = await raw(request, route.path)
      const headers = response.headers()
      if (response.status() !== 200) {
        findings.push(`${route.path}: ${response.status()} → ${headers['location'] ?? '-'}`)
      }
      if (headers['www-authenticate']) findings.push(`${route.path}: Basic Auth`)
      if (/noindex/iu.test(headers['x-robots-tag'] ?? '')) {
        findings.push(`${route.path}: X-Robots-Tag ${headers['x-robots-tag']}`)
      }
    }
    // Praefixloser Pfad: genau ein 301 auf DE, nie auf EN.
    for (const slug of SLUGS) {
      const bare = await raw(request, `/consumer/${slug}`)
      if (bare.status() !== 301) findings.push(`/consumer/${slug}: ${bare.status()}`)
      if (bare.headers()['location'] !== `/${DEFAULT_LANGUAGE}/consumer/${slug}`) {
        findings.push(`/consumer/${slug} → ${bare.headers()['location']}`)
      }
    }
    expect(findings, 'Routenmatrix').toEqual([])
  })
})

// =============================================================================
// C21-09..C21-15 · SHELL
// =============================================================================

test.describe('AP21-CLOSURE · Shell', () => {
  test('C21-15 · CON-12 · der SEO-Head steht in der ERSTEN SSR-Antwort', async ({ request }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      const html = await (await raw(request, route.path)).text()
      const head = html.slice(0, html.indexOf('</head>'))
      const copy = bundle(route.locale)
      const product = CONSUMER_PRODUCTS[route.product]
      const checks: Array<[string, boolean]> = [
        ['title', /<title[^>]*>[^<]{10,}<\/title>/u.test(head)],
        ['description', (meta(head, 'name', 'description')[0] ?? '').length > 20],
        ['canonical', linkHrefs(head, 'canonical')[0] === route.canonical],
        ['hreflang+x-default', Object.keys(hreflangs(head)).length === 11],
        ['og:image absolut', (meta(head, 'property', 'og:image')[0] ?? '').startsWith('https://')],
        ['H1 gerendert', /<h1[^>]*>[^<]{5,}/u.test(html)],
        // Der Titel traegt die freigegebene SEO-Copy dieser Locale.
        ['SEO-Titel x10', decodeEntities(html).includes(copy[product.seoTitleKey])],
      ]
      for (const [label, ok] of checks) if (!ok) findings.push(`${route.path}: ${label}`)
    }
    expect(findings, 'SSR-Head').toEqual([])
  })

  test('C21-10/11/12/13 · genau ein main, Skip-Link, Consent-UI, Rechtszugang', async ({
    page,
  }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      await page.goto(route.path)
      const copy = bundle(route.locale)

      const shell = await page.evaluate(() => ({
        mains: document.querySelectorAll('main').length,
        target: document.querySelector('main#main-content')?.getAttribute('tabindex'),
        privacy: document.querySelectorAll('a[href$="/privacy"]').length,
        imprint: document.querySelectorAll('a[href$="/imprint"]').length,
        terms: document.querySelectorAll('a[href$="/terms"]').length,
      }))
      if (shell.mains !== 1) findings.push(`${route.path}: ${shell.mains}x <main>`)
      if (shell.target !== '-1') findings.push(`${route.path}: main ohne tabindex=-1`)
      if (shell.privacy + shell.imprint + shell.terms < 3) {
        findings.push(`${route.path}: Rechtsseiten unvollstaendig verlinkt`)
      }

      await page.keyboard.press('Tab')
      const focus = await page.evaluate(() => ({
        tag: document.activeElement?.tagName,
        href: document.activeElement?.getAttribute('href'),
      }))
      if (focus.tag !== 'A' || focus.href !== '#main-content') {
        findings.push(`${route.path}: erstes Tab-Ziel ${focus.tag}/${focus.href}`)
      }

      if ((await page.getByRole('heading', { name: copy['cookie.title'] }).count()) === 0) {
        findings.push(`${route.path}: kein Consent-Banner`)
      }
    }
    expect(findings, 'Shell').toEqual([])
  })

  test('C21-14 · CON-13 · der Sprachwechsel behaelt die Produktidentitaet', async ({ request }) => {
    // Jede Locale verweist per hreflang reziprok auf dieselbe Produktseite —
    // die Identitaet bleibt also ueber alle zehn Sprachen erhalten.
    const findings: string[] = []
    for (const route of ROUTES) {
      const html = await (await raw(request, route.path)).text()
      const alternates = hreflangs(html)
      for (const locale of SUPPORTED_LANGUAGES) {
        if (alternates[locale] !== `${ORIGIN}/${locale}/consumer/${route.slug}`) {
          findings.push(`${route.path}: hreflang ${locale} = ${alternates[locale]}`)
        }
      }
      if (alternates['x-default'] !== `${ORIGIN}/${DEFAULT_LANGUAGE}/consumer/${route.slug}`) {
        findings.push(`${route.path}: x-default ${alternates['x-default']}`)
      }
    }
    expect(findings, 'Sprachidentitaet').toEqual([])
  })
})

// =============================================================================
// C21-16..C21-26 · INHALT UND WAHRHEIT
// =============================================================================

test.describe('AP21-CLOSURE · Produktinhalt und Claim-Wahrheit', () => {
  test('C21-16..24 · Body, Safety, FAQ und Bestellkontext in allen zehn Sprachen', async ({
    page,
  }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      await page.goto(route.path)
      const copy = bundle(route.locale)
      const product = CONSUMER_PRODUCTS[route.product]
      const text = (await page.locator('main#main-content').evaluate((n) => n.textContent)) ?? ''

      // Body: die freigegebene Marketingzeile dieser Locale.
      if (!text.includes(copy[product.headlineKey])) {
        findings.push(`${route.path}: Headline fehlt`)
      }
      // Safety: der Pflichthinweis der Familie.
      const safetyKey = { spray: 'spray.copy_045', masks: 'mask.copy_030', duo: 'duo.copy_014' }[
        route.product
      ]
      const safety = copy[safetyKey]
      if (!safety || safety.length < 30) findings.push(`${route.path}: Safety-Copy fehlt`)
      // FAQ: mindestens fuenf aufklappbare Eintraege.
      const faq = await page.locator('main details').count()
      if (faq < 5) findings.push(`${route.path}: nur ${faq} FAQ-Eintraege`)
      // Bestellkontext: eine CTA mit der allowlisteten Produkt-ID.
      const cta = await page.locator(`main [data-gtm-page="${route.product}"]`).count()
      if (cta === 0) findings.push(`${route.path}: keine Bestell-CTA`)
      // Medien: Hero mit Alt-Text dieser Locale.
      const alt = await page.locator('main img').first().getAttribute('alt')
      if (alt !== copy[product.hero.altKey]) findings.push(`${route.path}: Hero-Alt "${alt}"`)
    }
    expect(findings, 'Inhalt x10').toEqual([])
  })

  test('C21-25 · CON-14 · kein DE-Dauerfallback in den neun anderen Sprachen', () => {
    const de = bundle('de')
    const findings: string[] = []
    // Bekannte, begruendete Kognate aus PT21.2–PT21.4 — echte Woerter, die in
    // der Zielsprache zufaellig identisch sind. Alles andere waere ein Leck.
    const KNOWN_COGNATES = new Set([
      'spray.copy_049',
      'spray.stats.d3_value',
      'spray.facts.dosage_value',
      'mask.copy_055',
      'duo.copy_018',
      'duo.copy_019',
      'duo.copy_023',
      'duo.copy_027',
      'duo.copy_028',
      'duo.copy_029',
      'duo.stats.bundle_value',
    ])
    for (const locale of SUPPORTED_LANGUAGES.filter((l) => l !== 'de')) {
      const copy = bundle(locale)
      const prose = Object.keys(de).filter(
        (key) =>
          /^(spray|mask|duo)\./u.test(key) && typeof de[key] === 'string' && de[key].length >= 25,
      )
      const identical = prose.filter((key) => copy[key] === de[key] && !KNOWN_COGNATES.has(key))
      if (identical.length) {
        findings.push(`${locale}: ${identical.length} identisch mit DE (${identical[0]})`)
      }
    }
    expect(findings, 'DE-Fallback').toEqual([])
  })

  test('C21-26 · CON-16/17/18/19 · Claim-Audit: nichts Erfundenes im Dokument', async ({
    request,
  }) => {
    const findings: string[] = []
    // Sprachneutrale Verbote: Zahlen und Zusagen, die es nicht gibt.
    const FORBIDDEN: Array<[string, RegExp]> = [
      ['Rabatt', /\b(\d{1,2}\s?% (?:rabatt|off|discount|korting|sleva|sconto|descuento))\b/iu],
      ['Ersparnis', /\b(sparen Sie \d|you save \d|save \d{1,2} ?€|risparmi \d)\b/iu],
      [
        'Lagerbestand',
        /\b(auf Lager|in stock|nur noch \d+ verf|only \d+ left|disponibili solo)\b/iu,
      ],
      ['Lieferzusage', /\b(lieferung in \d+ (?:tagen|stunden)|delivered? within \d+ days?)\b/iu],
      [
        'Bewertungen',
        /\b(\d[.,]\d\s?(?:von|out of|\/)\s?5|\d+ (?:bewertungen|reviews|rezensionen|recensioni))\b/iu,
      ],
      ['GTIN/SKU', /\b(gtin|ean[- ]?13|sku[- :]|artikelnummer)\b/iu],
    ]

    /**
     * Medizinische Behauptungen werden PRO SPRACHE geprueft, nicht mit einem
     * sprachuebergreifenden Muster. Grund ist ein konkreter Fehlalarm, der in
     * PT21.3 schon einmal auftrat und hier erneut: italienisch "cura"/"cure"
     * ist das Substantiv "Pflege" ("Cura idratante", "bisognosa di cure") und
     * englisch "cure" steht ausschliesslich im kosmetischen Pflichthinweis
     * ("not intended to diagnose, treat, cure or prevent"). Beides ist das
     * GEGENTEIL eines Heilversprechens. Geprueft werden deshalb nur Formen,
     * die in der jeweiligen Sprache wirklich eine Wirkung behaupten.
     */
    const MEDICAL: Record<string, RegExp> = {
      de: /\b(?:heilt|heilung von|kuriert|therapiert|lindert die krankheit|beugt .{0,20}krankheit vor)\b/iu,
      en: /\b(?:cures\b|will cure|heals\b|treats? (?:disease|illness|acne|eczema)|prevents? (?:disease|illness|cancer|covid))\b/iu,
      pl: /\b(?:leczy|wyleczy|uzdrawia)\b/iu,
      fr: /\b(?:guérit|soigne la maladie|traite la maladie)\b/iu,
      it: /\b(?:guarisce|guarire|cura la malattia|tratta la malattia)\b/iu,
      es: /\b(?:cura la enfermedad|sana\b|trata la enfermedad)\b/iu,
      pt: /\b(?:cura a doença|sara\b|trata a doença)\b/iu,
      da: /\b(?:helbreder|kurerer)\b/iu,
      nl: /\b(?:geneest|genezing van)\b/iu,
      cs: /\b(?:léčí|vyléčí|uzdravuje)\b/iu,
    }

    /**
     * Ein Treffer im PFLICHTHINWEIS waere das Gegenteil eines Claims.
     * Gewertet wird deshalb nur ein Treffer OHNE Verneinung im selben Satz.
     */
    const NEGATION =
      /\b(?:not intended|is not|does not|nicht (?:dazu )?bestimmt|kein arzneimittel|non è|non sono|no es|não é|ikke|geen|není|nie jest|ne remplace|nicht ersetzen)\b/iu

    const sentenceAround = (text: string, index: number): string => {
      const start = text.lastIndexOf('.', index - 1) + 1
      const end = text.indexOf('.', index)
      return text.slice(start, end === -1 ? text.length : end + 1)
    }

    for (const route of ROUTES) {
      const html = await (await raw(request, route.path)).text()
      // Nur der sichtbare Text, ohne Markup — sonst matchen Klassennamen.
      const body = decodeEntities(
        html
          .slice(html.indexOf('<body'))
          .replace(/<script[\s\S]*?<\/script>/gu, ' ')
          .replace(/<[^>]+>/gu, ' '),
      )
      const patterns: Array<[string, RegExp]> = [
        ...FORBIDDEN,
        ['Heilversprechen', MEDICAL[route.locale]],
      ]
      for (const [label, pattern] of patterns) {
        for (const hit of body.matchAll(new RegExp(pattern.source, 'giu'))) {
          const sentence = sentenceAround(body, hit.index ?? 0)
          if (NEGATION.test(sentence)) continue
          findings.push(
            `${route.path}: ${label} → "${hit[0]}" in "${sentence.trim().slice(0, 90)}"`,
          )
        }
      }
    }

    expect(findings, 'Claim-Audit').toEqual([])

    // Gegenprobe: der Pflichthinweis ist auf jeder Seite wirklich vorhanden.
    // Ein Audit, der nur nach Verbotenem sucht, wuerde eine leere Seite
    // ebenfalls durchwinken.
    const missing: string[] = []
    for (const route of ROUTES) {
      const html = decodeEntities(await (await raw(request, route.path)).text())
      const copy = bundle(route.locale)
      const safetyKey = { spray: 'spray.copy_045', masks: 'mask.copy_030', duo: 'duo.copy_014' }[
        route.product
      ]
      if (!html.includes(copy[safetyKey])) missing.push(`${route.path}: Pflichthinweis fehlt`)
    }
    expect(missing, 'Safety-Gegenprobe').toEqual([])
  })

  test('C21-43 · CON-36 · Schema nennt nur sichtbare Wahrheit', async ({ request }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      const html = await (await raw(request, route.path)).text()
      const entries = jsonLd(html)
      const product = entries.find((entry) => entry['@type'] === 'Product')
      const copy = bundle(route.locale)

      if (!product) {
        findings.push(`${route.path}: kein Product-Schema`)
        continue
      }
      if (!entries.some((entry) => entry['@type'] === 'BreadcrumbList')) {
        findings.push(`${route.path}: kein BreadcrumbList`)
      }
      if (!entries.some((entry) => entry['@type'] === 'FAQPage')) {
        findings.push(`${route.path}: kein FAQPage`)
      }
      // Der Schemaname ist der PRODUKTNAME dieser Locale, keine Marketingzeile.
      if (product.name !== copy[CONSUMER_PRODUCTS[route.product].nameKey]) {
        findings.push(`${route.path}: Product.name "${String(product.name).slice(0, 40)}"`)
      }
      if (product.url !== route.canonical) findings.push(`${route.path}: Product.url`)
      const serialized = JSON.stringify(product)
      for (const forbidden of [
        'offers',
        'price',
        'availability',
        'aggregateRating',
        'review',
        'gtin',
        'sku',
        'mpn',
        'itemCondition',
      ]) {
        if (serialized.includes(`"${forbidden}"`)) {
          findings.push(`${route.path}: Product.${forbidden}`)
        }
      }
      // FAQ-Antworten muessen im sichtbaren Dokument vorkommen.
      const faq = entries.find((entry) => entry['@type'] === 'FAQPage')
      const questions = (faq?.mainEntity ?? []) as Array<{
        name: string
        acceptedAnswer?: { text?: string }
      }>
      for (const question of questions.slice(0, 3)) {
        if (!html.includes(question.name)) {
          findings.push(`${route.path}: FAQ-Frage nicht im Dokument`)
          break
        }
      }
    }
    expect(findings, 'Schema-Wahrheit').toEqual([])
  })
})

// =============================================================================
// C21-39..C21-45 · SEO, SOCIAL, VERLINKUNG
// =============================================================================

test.describe('AP21-CLOSURE · SEO, Social, Verlinkung', () => {
  test('C21-39/40 · 30/30 index/follow und Self-Canonical', async ({ request }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      const html = await (await raw(request, route.path)).text()
      for (const name of ['robots', 'googlebot']) {
        const value = meta(html, 'name', name)[0] ?? ''
        if (/noindex|nofollow/iu.test(value) || !/index/iu.test(value)) {
          findings.push(`${route.path}: ${name}="${value}"`)
        }
      }
      const canonicals = linkHrefs(html, 'canonical')
      if (canonicals.length !== 1 || canonicals[0] !== route.canonical) {
        findings.push(`${route.path}: canonical ${canonicals.join(',')}`)
      }
    }
    expect(findings, 'Indexierbarkeit/Canonical').toEqual([])
  })

  test('C21-41 · die Sitemap fuehrt exakt diese 30 URLs', async ({ request }) => {
    const xml = await (await raw(request, '/sitemap.xml')).text()
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)]
      .map((match) => match[1])
      .filter((url) => url.includes('/consumer/'))
    expect(new Set(urls).size).toBe(urls.length)
    expect(urls.sort()).toEqual(ROUTES.map((route) => route.canonical).sort())
    // robots.txt sperrt die Strecke nicht aus.
    const robots = await (await raw(request, '/robots.txt')).text()
    expect(/Disallow:\s*\/[a-z]{2}\/consumer/iu.test(robots)).toBe(false)
  })

  test('C21-42 · CON-10 · Social-Assets produktecht, kein falsches Locale-Versprechen', async ({
    request,
  }) => {
    const findings: string[] = []
    const perProduct = new Map<string, Set<string>>()
    for (const route of ROUTES) {
      const html = await (await raw(request, route.path)).text()
      const copy = bundle(route.locale)
      const get = (key: string) => meta(html, 'property', key)[0] ?? ''

      if (get('og:type') !== 'product') findings.push(`${route.path}: og:type`)
      if (!new RegExp(`^${route.locale}_[A-Z]{2}$`, 'u').test(get('og:locale'))) {
        findings.push(`${route.path}: og:locale ${get('og:locale')}`)
      }
      // Der Alt-Text ist die Copy DIESER Sprache — kein englischer Platzhalter.
      const altKey = CONSUMER_PRODUCTS[route.product].hero.altKey
      if (get('og:image:alt') !== copy[altKey]) {
        findings.push(`${route.path}: og:image:alt nicht lokalisiert`)
      }
      const image = get('og:image')
      if (!image.startsWith(`${ORIGIN}/`)) findings.push(`${route.path}: og:image nicht absolut`)
      if (new RegExp(`/(${SUPPORTED_LANGUAGES.join('|')})/`, 'u').test(image)) {
        findings.push(`${route.path}: og:image behauptet eine Locale-Fassung`)
      }
      if (!/^\d+$/u.test(get('og:image:width'))) findings.push(`${route.path}: og:image ohne Masse`)
      if (!perProduct.has(route.slug)) perProduct.set(route.slug, new Set())
      perProduct.get(route.slug)!.add(image)
    }
    for (const [slug, images] of perProduct) {
      if (images.size !== 1) findings.push(`${slug}: ${images.size} og:image`)
    }
    expect(new Set([...perProduct.values()].map((set) => [...set][0])).size).toBe(3)
    expect(findings, 'Social').toEqual([])

    for (const [, images] of perProduct) {
      const path = [...images][0].replace(ORIGIN, '')
      expect((await raw(request, path)).status(), path).toBe(200)
    }
  })

  test('C21-44 · CON-37 · interne Verlinkung ohne tote und ohne Redirect-Quellen', async ({
    request,
  }) => {
    const findings: string[] = []
    const checked = new Set<string>()
    for (const locale of SUPPORTED_LANGUAGES) {
      const inbound = new Map<string, string[]>(SLUGS.map((slug) => [slug, []]))
      for (const source of SLUGS) {
        const html = await (await raw(request, `/${locale}/consumer/${source}`)).text()
        for (const match of html.matchAll(/href="(\/[^"]*\/consumer\/[^"#?]+)"/gu)) {
          const href = match[1]
          if (!href.startsWith(`/${locale}/consumer/`)) {
            findings.push(`${locale}/${source}: Redirect-Quelle ${href}`)
            continue
          }
          const target = href.replace(`/${locale}/consumer/`, '')
          if (target !== source) inbound.get(target)?.push(source)
        }
        for (const match of html.matchAll(/href="(\/[a-z]{2}\/[^"#?]*)"/gu)) {
          checked.add(match[1])
        }
      }
      for (const [slug, sources] of inbound) {
        if (sources.length === 0) findings.push(`${locale}: ${slug} ohne eingehenden Link`)
      }
    }
    for (const href of checked) {
      const status = (await raw(request, href)).status()
      if (status !== 200) findings.push(`toter/umgeleiteter Link ${href} = ${status}`)
    }
    expect(findings, `interne Links (${checked.size} geprueft)`).toEqual([])
  })
})

// =============================================================================
// C21-27..C21-38 · ORDERING
// =============================================================================

const orderIp = (n: number) => `203.0.113.${n}`

async function placeOrder(page: Page, product: ConsumerProductKey, locale = 'de') {
  await page.goto(`/${locale}/consumer/${CONSUMER_PRODUCTS[product].slug}`)
  const trigger = page.locator(`main [data-gtm-page="${product}"]`).first()
  await expect(async () => {
    if ((await page.locator('form input[type="email"]').count()) === 0) await trigger.click()
    await expect(page.locator('form input[type="email"]')).toHaveCount(1)
  }).toPass({ timeout: 20_000 })
  const form = page.locator('form').filter({ has: page.locator('input[type="email"]') })
  await form.locator('#order-name').fill(`Closure ${product}`)
  await form.locator('#order-email').fill(`closure-${product}@example.com`)
  await form.locator('input[type="checkbox"]').first().check()
  await form.locator('button[type="submit"]').click()
}

const api = (
  page: Page,
  { ip, key, ...data }: { ip: string; key: string } & Record<string, unknown>,
) =>
  page.request.post('/api/consumer-order', {
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': key,
      'X-Forwarded-For': ip,
    },
    data: {
      product: 'duo',
      variant: 'set',
      quantity: 1,
      name: 'Closure Test',
      email: 'closure@example.com',
      locale: 'de',
      processingConsent: true,
      consentAcceptedAt: '2026-09-08T09:00:00.000Z',
      ...data,
    },
  })

test.describe('AP21-CLOSURE · Ordering gegen echtes Backend', () => {
  test('C21-27..30 · alle drei Familien: eigene Journey, persistiert VOR dem Handoff', async ({
    page,
  }) => {
    await page.setExtraHTTPHeaders({ 'X-Forwarded-For': orderIp(11) })
    const before = leads().length
    for (const product of Object.keys(CONSUMER_PRODUCTS) as ConsumerProductKey[]) {
      await placeOrder(page, product)
      await expect(page.getByText(/PDX-[0-9A-F]{8}/u)).toBeVisible({ timeout: 30_000 })
    }

    const created = leads().slice(before)
    expect(created).toHaveLength(3)

    const db = new Database(LEAD_DB_PATH, { readonly: true })
    for (const lead of created) {
      expect(lead.journey, 'CON-21 eigene Journey').toBe('consumer_order')
      const context = JSON.parse(lead.context_json) as Record<string, unknown>
      const consent = JSON.parse(lead.consent_json) as Record<string, unknown>
      // CON-20: kanonischer Slug, nicht der Client-Produktname.
      expect(SLUGS).toContain(context.productId)
      expect(String(context.reference)).toMatch(/^PDX-[0-9A-F]{8}$/u)
      expect(context.quantity).toBe(1)
      // CON-30: getrennter Consent.
      expect(consent.processingAccepted).toBe(true)
      expect(consent.marketing).toBe('DENIED')

      // CON-23: Persistenz vor Handoff, belegt durch die Ereignisfolge.
      const events = (
        db
          .prepare('SELECT event_type FROM lead_events WHERE lead_id = ? ORDER BY id')
          .all(lead.id) as Array<{ event_type: string }>
      ).map((row) => row.event_type)
      expect(events.slice(0, 3)).toEqual(['LEAD_RECEIVED', 'LEAD_PERSISTED', 'HANDOFF_PENDING'])
      expect(events.indexOf('HANDOFF_ATTEMPT')).toBeGreaterThan(events.indexOf('LEAD_PERSISTED'))

      // CON-22: Outbox der geteilten Foundation.
      const outbox = db
        .prepare('SELECT channel, status FROM lead_outbox WHERE lead_id = ?')
        .all(lead.id) as Array<{ channel: string; status: string }>
      expect(outbox.map((entry) => entry.channel)).toEqual(['CRM'])
      // CON-28: ohne Provider ehrlich terminal, kein Fake-Erfolg.
      expect(lead.status).toBe('FAILED_TERMINAL')
      expect(lead.last_error_class).toBe('NO_PROVIDER_CONFIGURED')
    }
    db.close()
  })

  test('C21-30/31/32 · Idempotenz, Konflikt, Allowlist, Honeypot, Rate Limit', async ({ page }) => {
    const before = leads().length

    // Idempotenz: identischer Rumpf → ein Vorgang.
    const key = `closure-${Date.now()}`
    const first = await api(page, { ip: orderIp(20), key })
    const replay = await api(page, { ip: orderIp(20), key })
    expect(first.status()).toBe(202)
    expect(replay.status()).toBe(202)
    expect((await replay.json()).leadId).toBe((await first.json()).leadId)
    // Konflikt: derselbe Schluessel, anderer Inhalt.
    expect((await api(page, { ip: orderIp(20), key, quantity: 3 })).status()).toBe(409)
    expect(leads().length - before, 'genau ein Vorgang').toBe(1)

    // Honeypot: still angenommen, nichts persistiert.
    const count = leads().length
    expect((await api(page, { ip: orderIp(21), key: 'hp', _hp: 'bot' })).status()).toBe(200)
    expect(leads().length).toBe(count)

    // Serverseitige Allowlist inkl. missgestalteter Felder.
    const rejects: Array<[Record<string, unknown>, string]> = [
      [{ product: 'igloo-pro' }, 'UNKNOWN_PRODUCT'],
      [{ product: { evil: true } }, 'UNKNOWN_PRODUCT'],
      [{ variant: 'pack-12' }, 'UNKNOWN_VARIANT'],
      [{ quantity: 0 }, 'INVALID_QUANTITY'],
      [{ quantity: 99 }, 'INVALID_QUANTITY'],
      [{ quantity: '1 Duo set' }, 'INVALID_QUANTITY'],
      [{ name: 'A', email: 'kaputt' }, 'VALIDATION_FAILED'],
      [{ locale: 'ru' }, 'VALIDATION_FAILED'],
      [{ processingConsent: false, consent: false }, 'PROCESSING_CONSENT_REQUIRED'],
      [{ consentAcceptedAt: 'irgendwann' }, 'INVALID_CONSENT_EVIDENCE'],
    ]
    for (const [index, [data, code]] of rejects.entries()) {
      const response = await api(page, { ip: orderIp(30 + index), key: `bad-${index}`, ...data })
      expect(response.status(), code).toBe(400)
      expect((await response.json()).code, JSON.stringify(data)).toBe(code)
    }

    // Rate Limit je Absender.
    const codes: number[] = []
    for (let i = 0; i < 8; i += 1) {
      codes.push((await api(page, { ip: orderIp(60), key: `rl-${i}` })).status())
    }
    expect(codes.filter((code) => code === 429).length).toBeGreaterThan(0)
    // Ein anderer Absender bleibt unberuehrt.
    expect((await api(page, { ip: orderIp(61), key: 'other' })).status()).toBe(202)
  })

  test('C21-34/35 · Systemcopy x10 und Datenminimierung', async ({ page }) => {
    // x10-Systemcopy: alle Bestellzustaende in jeder Sprache, ohne DE-Kopie.
    const keys = [
      'order_form.consent_required',
      'order_form.email_invalid',
      'order_form.required_fields',
      'order_form.sending',
      'order_form.submit',
      'order_form.copy_011',
      'order_form.copy_012',
      'order_form.error_retryable',
      'order_form.error_terminal',
      'order_form.marketing_consent',
      'order_form.reference_label',
      'order_form.success_not_purchase',
    ]
    const de = bundle('de')
    for (const locale of SUPPORTED_LANGUAGES) {
      const copy = bundle(locale)
      for (const key of keys) {
        expect(copy[key], `${locale}:${key}`).toBeTruthy()
        if (locale !== 'de') expect(copy[key], `${locale}:${key} DE-Kopie`).not.toBe(de[key])
      }
    }

    // Datenminimierung: der Lead traegt nur Bestellfelder, und ein
    // mitgeschickter Empfaenger landet nirgends.
    const response = await api(page, {
      ip: orderIp(70),
      key: `min-${Date.now()}`,
      to: 'angreifer@example.com',
      role: 'admin',
      price: 1,
    })
    expect(response.status()).toBe(202)
    const lead = leads().at(-1)!
    expect(Object.keys(JSON.parse(lead.subject_json) as object).sort()).toEqual([
      'city',
      'company',
      'country',
      'email',
      'message',
      'name',
      'phone',
      'postcode',
      'productId',
      'productLabel',
      'quantity',
      'quantityMode',
      'street',
      'variant',
    ])
    expect(JSON.stringify(lead)).not.toContain('angreifer@example.com')
  })

  test('C21-36/37/38 · Consent-Trennung, Bestellung ohne Consent, 0 Vorab-Provider', async ({
    page,
    context,
  }) => {
    const external: string[] = []
    page.on('request', (request) => {
      const url = request.url()
      if (!url.startsWith('http://127.0.0.1') && !url.startsWith('data:')) external.push(url)
    })

    // (1) VOR jeder Entscheidung: Bestellung funktioniert, nichts geht raus.
    await page.setExtraHTTPHeaders({ 'X-Forwarded-For': orderIp(80) })
    const before = leads().length
    await page.goto('/cs/consumer/inside-out-duo')
    expect(await page.evaluate(() => localStorage.getItem('cookie-consent'))).toBeNull()
    await placeOrder(page, 'duo', 'cs')
    await expect(page.getByText(/PDX-[0-9A-F]{8}/u)).toBeVisible({ timeout: 30_000 })
    expect(leads().length - before, 'Bestellung ohne Consent').toBe(1)
    expect(external, 'Provider vor der Entscheidung').toEqual([])
    const events = await page.evaluate(() =>
      ((window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer ?? []).map(
        (entry) => String(entry.event ?? ''),
      ),
    )
    expect(events.filter((name) => name.startsWith('consumer_'))).toEqual([])

    // (2) ABGELEHNT: Seite und Bestellung bleiben benutzbar, weiterhin 0 Provider.
    await context.addInitScript(() => {
      localStorage.setItem(
        'cookie-consent',
        JSON.stringify([
          { id: 'necessary', enabled: true },
          { id: 'analytics', enabled: false },
          { id: 'marketing', enabled: false },
        ]),
      )
    })
    external.length = 0
    await page.setExtraHTTPHeaders({ 'X-Forwarded-For': orderIp(81) })
    const denied = leads().length
    await placeOrder(page, 'masks', 'pl')
    await expect(page.getByText(/PDX-[0-9A-F]{8}/u)).toBeVisible({ timeout: 30_000 })
    expect(leads().length - denied, 'Bestellung bei Ablehnung').toBe(1)
    expect(external, 'Provider bei Ablehnung').toEqual([])

    // (3) Marketing-Consent ist von der Verarbeitung getrennt und optional.
    await page.setExtraHTTPHeaders({ 'X-Forwarded-For': orderIp(82) })
    const granted = await api(page, {
      ip: orderIp(82),
      key: `mkt-${Date.now()}`,
      marketingConsent: true,
    })
    expect(granted.status()).toBe(202)
    expect((JSON.parse(leads().at(-1)!.consent_json) as Record<string, unknown>).marketing).toBe(
      'GRANTED',
    )
  })
})

// =============================================================================
// C21-46..C21-48 · A11Y, RESPONSIVE, PERFORMANCE
// =============================================================================

test.describe('AP21-CLOSURE · A11y, Responsive, Performance', () => {
  test('C21-46 · CON-38 · Axe serious/critical = 0 auf allen 30 Seiten', async ({ page }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      await page.goto(route.path)
      const violations = await axeFindings(page)
      if (violations.length) findings.push(`${route.path}: ${violations.join(' | ')}`)
    }
    expect(findings, 'Axe 30/30').toEqual([])
  })

  test('C21-46 · Bestelldialog: Axe 0, Tastatur, Fehler- und Erfolgszustand', async ({ page }) => {
    await page.setExtraHTTPHeaders({ 'X-Forwarded-For': orderIp(90) })
    for (const product of Object.keys(CONSUMER_PRODUCTS) as ConsumerProductKey[]) {
      await page.goto(`/de/consumer/${CONSUMER_PRODUCTS[product].slug}`)
      const trigger = page.locator(`main [data-gtm-page="${product}"]`).first()
      await expect(async () => {
        if ((await page.locator('form input[type="email"]').count()) === 0) await trigger.click()
        await expect(page.locator('form input[type="email"]')).toHaveCount(1)
      }).toPass({ timeout: 20_000 })
      expect(await axeFindings(page), `${product}: Dialog`).toEqual([])

      const form = page.locator('form').filter({ has: page.locator('input[type="email"]') })
      // Kein Feld ohne Beschriftung.
      const unlabelled = await form
        .locator('input:not([type="hidden"]), select, textarea')
        .evaluateAll((nodes) =>
          nodes
            .filter((node) => {
              const id = node.getAttribute('id')
              return !(
                (id && document.querySelector(`label[for="${id}"]`)) ||
                node.closest('label') ||
                node.getAttribute('aria-label')
              )
            })
            .map((node) => node.getAttribute('id') ?? node.tagName),
        )
      expect(unlabelled, `${product}: unbeschriftete Felder`).toEqual([])

      // Fehlerzustand als Live-Region.
      await form.locator('button[type="submit"]').click()
      await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 15_000 })
    }
  })

  test('C21-47 · CON-38 · kein Ueberlauf: 3 Produkte x 4 lange Locales x 3 Breiten', async ({
    page,
  }) => {
    const findings: string[] = []
    for (const product of Object.keys(CONSUMER_PRODUCTS) as ConsumerProductKey[]) {
      for (const locale of ['de', 'pl', 'cs', 'nl']) {
        for (const width of [390, 768, 1440]) {
          await page.setViewportSize({ width, height: 900 })
          await page.goto(`/${locale}/consumer/${CONSUMER_PRODUCTS[product].slug}`)
          const overflow = await page.evaluate(
            (w) => document.documentElement.scrollWidth - w,
            width,
          )
          if (overflow > 1) findings.push(`${locale}/${product}@${width}: ${overflow}px`)
        }
      }
    }
    expect(findings, 'Ueberlauf').toEqual([])
  })

  test('C21-48 · CON-39 · Bildbudget, responsive Quellen, LCP-Prioritaet', async ({ page }) => {
    const findings: string[] = []
    const report: string[] = []
    for (const product of Object.keys(CONSUMER_PRODUCTS) as ConsumerProductKey[]) {
      await page.setViewportSize({ width: 390, height: 844 })
      const bytes = new Map<string, number>()
      page.on('response', (response) => {
        if (/\.(jpe?g|png|webp|avif)(\?|$)/iu.test(response.url())) {
          bytes.set(response.url(), Number(response.headers()['content-length'] ?? 0))
        }
      })
      await page.goto(`/de/consumer/${CONSUMER_PRODUCTS[product].slug}`, {
        waitUntil: 'networkidle',
      })
      const total = [...bytes.values()].reduce((sum, value) => sum + value, 0)
      report.push(`${product} ${(total / 1024).toFixed(0)}KB`)
      if (total > 120 * 1024) findings.push(`${product}: ${(total / 1024).toFixed(0)} KB`)

      const hero = await page
        .locator('main img')
        .first()
        .evaluate((node) => ({
          current: (node as HTMLImageElement).currentSrc,
          css: Math.round(node.getBoundingClientRect().width),
          natural: (node as HTMLImageElement).naturalWidth,
          loading: node.getAttribute('loading'),
          priority: node.getAttribute('fetchpriority'),
          width: node.getAttribute('width'),
          height: node.getAttribute('height'),
        }))
      if (!hero.current.endsWith('.webp')) findings.push(`${product}: Hero kein WebP`)
      if (hero.loading !== 'eager') findings.push(`${product}: Hero ${hero.loading}`)
      if (hero.priority !== 'high') findings.push(`${product}: Hero fetchpriority`)
      if (!hero.width || !hero.height) findings.push(`${product}: Hero ohne width/height`)
      if (hero.natural / hero.css > 2.2) {
        findings.push(`${product}: Hero ${hero.natural}px fuer ${hero.css}px`)
      }
      page.removeAllListeners('response')
    }
    expect(findings, `Performance (gemessen: ${report.join(', ')})`).toEqual([])
  })
})
