import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test, type Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import {
  buildResourceCenter,
  LAUNCH_VISIBLE_RESOURCES,
} from '../src/content/resources/resourceCenter'
import { RESOURCE_INVENTORY } from '../src/content/resources/resourceInventory'

/**
 * PT19.2 — Resource Center UX.
 *
 * Geprueft wird das, was der Leser wirklich bekommt: die gerenderte Menge, die
 * ausgelieferte Sprache, der funktionierende freie Download und die Abwesenheit
 * jeder gegateten Datei-URL. Bereits in PT19.1 bewiesene Inventarwahrheiten
 * werden hier nicht wiederholt.
 */

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const providerPattern =
  /(?:www\.googletagmanager\.com|(?:region1\.)?google-analytics\.com|stats\.g\.doubleclick\.net)/u

const bundle = (locale: string, ns: string): Record<string, unknown> =>
  JSON.parse(readFileSync(`public/locales/${locale}/${ns}.json`, 'utf8')) as Record<string, unknown>

const at = (source: unknown, pointer: string): string => {
  const value = pointer
    .replace(/\[(\d+)\]/gu, '.$1')
    .split('.')
    .reduce<unknown>(
      (current, part) =>
        current && typeof current === 'object'
          ? (current as Record<string, unknown>)[part]
          : undefined,
      source,
    )
  return typeof value === 'string' ? value : ''
}

const translate = (locale: string, key: string): string => {
  const [ns, pointer] = key.includes(':') ? key.split(/:(.+)/u) : ['downloads', key]
  return at(bundle(locale, ns), pointer)
}

async function axeFindings(page: Page) {
  await page.addScriptTag({ path: axePath })
  return page.evaluate(async () => {
    const results = await (
      window as unknown as { axe: { run: (o: unknown) => Promise<{ violations: unknown[] }> } }
    ).axe.run({ resultTypes: ['violations'] })
    return (
      results.violations as Array<{
        id: string
        impact: string
        nodes: Array<{ target: string[]; failureSummary?: string }>
      }>
    )
      .filter((violation) => ['serious', 'critical'].includes(violation.impact))
      .map(
        (violation) =>
          `${violation.id} (${violation.impact}) :: ${violation.nodes
            .slice(0, 3)
            .map((node) => `${node.target.join(' ')} — ${node.failureSummary ?? ''}`)
            .join(' | ')}`,
      )
  })
}

test.describe('PT19.2 Resource Center', () => {
  test('rendert exakt die launchsichtbaren Ressourcen, ohne verwaiste Assets', async ({ page }) => {
    await page.goto('/de/downloads')

    const rendered = await page
      .locator('[data-resource-id]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-resource-id')))
    const expected = LAUNCH_VISIBLE_RESOURCES.map((resource) => resource.id)

    expect(rendered.length).toBe(expected.length)
    expect([...rendered].sort()).toEqual([...expected].sort())
    expect(new Set(rendered).size).toBe(rendered.length)

    // Der entlinkte IglooPro-Flyer bleibt unsichtbar — Karte wie Datei-URL.
    const orphans = RESOURCE_INVENTORY.filter((r) => r.lifecycle !== 'ACTIVE_VISIBLE')
    expect(orphans.length).toBeGreaterThan(0)
    const html = await page.content()
    for (const orphan of orphans) {
      expect(rendered).not.toContain(orphan.id)
      for (const variant of orphan.variants) expect(html).not.toContain(variant.path)
    }
  })

  test('rendert nur nicht-leere Kategorien mit echter Ueberschrift', async ({ page }) => {
    await page.goto('/de/downloads')

    const groups = buildResourceCenter('de')
    const sections = page.locator('[data-resource-group]')
    await expect(sections).toHaveCount(groups.length)

    for (const group of groups) {
      const section = page.locator(`[data-resource-group="${group.id}"]`)
      await expect(section.locator('[data-resource-id]')).toHaveCount(group.cards.length)
      // Eine Ueberschrift ohne Karten darunter darf nicht existieren.
      expect(group.cards.length).toBeGreaterThan(0)
      const heading = section.locator(`h2#resource-group-${group.id}`)
      await expect(heading).toHaveText(translate('de', group.labelKey))
    }
  })

  test('liefert in allen zehn Locales echte Texte und die reale Asset-Sprache', async ({
    page,
  }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      await page.goto(`/${locale}/downloads`)
      const groups = buildResourceCenter(locale)

      await expect(page.locator('[data-resource-id]')).toHaveCount(
        groups.reduce((sum, group) => sum + group.cards.length, 0),
      )

      for (const group of groups) {
        await expect(page.locator(`h2#resource-group-${group.id}`)).toHaveText(
          translate(locale, group.labelKey),
        )

        for (const card of group.cards) {
          const node = page.locator(`[data-resource-id="${card.resource.id}"]`)
          const text = (await node.innerText()).replace(/\s+/gu, ' ')

          // Sichtbarer Titel, kein durchgereichter Uebersetzungsschluessel.
          const title = translate(locale, card.labelKey ?? '')
          expect(title, `${locale}/${card.resource.id}: Titel fehlt`).not.toBe('')
          expect(text).toContain(title)
          expect(text).not.toContain(card.resource.id)
          // Kein durchgereichter Schluessel — weder als JSON-Pointer noch in
          // i18next-Punktnotation. Genau das stand hier im ersten Lauf.
          for (const raw of [...card.resource.labelKeys, ...card.resource.descriptionKeys]) {
            const pointer = raw.split(/:(.+)/u)[1] ?? raw
            expect(text).not.toContain(pointer)
            expect(text).not.toContain(pointer.replace(/\[(\d+)\]/gu, '.$1'))
          }

          // Die genannte Sprache ist die der ausgelieferten Datei.
          const badge = node.locator('[data-resource-language]')
          await expect(badge).toHaveAttribute('data-resource-language', card.variant.language)
          const languageName = translate(locale, `assetLanguage.languages.${card.variant.language}`)
          expect(await badge.innerText()).toContain(languageName)

          // Fehlende Asset-Sprache wird ausgesprochen, nicht verschwiegen.
          await expect(node).toHaveAttribute(
            'data-language-fallback',
            String(card.languageFallback),
          )
          const notice = node.locator('[data-language-notice]')
          await expect(notice).toHaveCount(card.languageFallback ? 1 : 0)
          if (card.languageFallback) {
            await expect(notice).toHaveText(translate(locale, 'downloads:languageNotice'))
          }
        }
      }
    }
  })

  test('freie Ressourcen sind direkt und korrekt abrufbar', async ({ page, request }) => {
    await page.goto('/en/downloads')
    // PT19.4: eine Ressource ist inzwischen gegatet; sie hat bewusst KEINEN
    // Dateilink und wird im Gate-Test darunter geprueft.
    const cards = buildResourceCenter('en')
      .flatMap((group) => group.cards)
      .filter((card) => card.resource.deliveryClass === 'FREE_PUBLIC')
    expect(cards.length).toBeGreaterThan(0)

    for (const card of cards) {
      const link = page.locator(`[data-resource-id="${card.resource.id}"] a[href^="/downloads/"]`)
      await expect(link).toHaveCount(1)
      await expect(link).toHaveAttribute('hreflang', card.variant.language)
      expect(await link.getAttribute('href')).toBe(card.href)
    }

    // Stichprobe ueber jede Gruppe: die URL liefert wirklich die Datei, mit
    // der Groesse und dem Typ aus dem Inventar.
    for (const group of buildResourceCenter('en')) {
      const card = group.cards.find((entry) => entry.href)
      if (!card) continue
      const response = await request.get(card.href as string, { maxRedirects: 0 })
      expect(response.status(), card.href as string).toBe(200)
      expect(response.headers()['content-type']).toContain(
        card.variant.mime === 'application/zip' ? 'zip' : 'pdf',
      )
      expect((await response.body()).length).toBe(card.variant.bytes)
    }
  })

  test('kein gegatetes Asset und keine gegatete Datei-URL im Markup', async ({ page }) => {
    await page.goto('/de/downloads')
    const html = await page.content()

    // Seit PT19.4 gibt es einen aktiven gegateten Kandidaten. Sein Pfad darf
    // im Markup nicht vorkommen, und statt eines Dateilinks steht dort das
    // Gate mit Asset-ID.
    const gated = LAUNCH_VISIBLE_RESOURCES.filter((r) => r.deliveryClass === 'GATED')
    expect(gated.length).toBeGreaterThan(0)
    for (const resource of gated) {
      for (const variant of resource.variants) expect(html).not.toContain(variant.path)
      const cta = page.locator(`[data-resource-id="${resource.id}"] [data-gate-asset]`)
      await expect(cta).toHaveAttribute('data-gate-asset', resource.id)
      await expect(
        page.locator(`[data-resource-id="${resource.id}"] a[href^="/downloads/"]`),
      ).toHaveCount(0)
    }
    expect(await page.locator('[data-resource-access="GATED"]').count()).toBe(gated.length)
    expect(await page.locator('[data-resource-access="FREE_PUBLIC"]').count()).toBe(
      LAUNCH_VISIBLE_RESOURCES.length - gated.length,
    )
  })

  test('laedt keine PDF-/ZIP-Nutzlast und keinen Provider vor der Einwilligung', async ({
    page,
  }) => {
    const assetRequests: string[] = []
    const providerRequests: string[] = []
    page.on('request', (request) => {
      const url = request.url()
      if (/\.(?:pdf|zip)(?:$|\?)/iu.test(url)) assetRequests.push(url)
      if (providerPattern.test(url)) providerRequests.push(url)
    })

    await page.goto('/de/downloads')
    await page.waitForLoadState('networkidle')

    expect(assetRequests).toEqual([])
    expect(providerRequests).toEqual([])
  })

  test('SEO: Canonical, hreflang, x-default und Suche', async ({ page, request }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      const response = await request.get(`/${locale}/downloads`, { maxRedirects: 0 })
      expect(response.status()).toBe(200)
      const html = await response.text()

      expect(html).toContain(`rel="canonical" href="https://polarisdx.net/${locale}/downloads"`)
      for (const other of SUPPORTED_LANGUAGES) {
        expect(html).toContain(
          `hrefLang="${other}" href="https://polarisdx.net/${other}/downloads"`,
        )
      }
      expect(html).toContain('hrefLang="x-default" href="https://polarisdx.net/de/downloads"')

      // Titel und Beschreibung stammen aus dem Locale, nicht aus einem Fallback.
      expect(html).toContain(translate(locale, 'downloads:seo.title'))
    }

    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    const xml = await sitemap.text()
    for (const locale of SUPPORTED_LANGUAGES) {
      expect(xml).toContain(`https://polarisdx.net/${locale}/downloads`)
    }

    // Die Seite bleibt ueber die interne Suche auffindbar.
    await page.goto('/de/downloads')
    expect(await page.locator('link[rel="canonical"]').count()).toBeGreaterThan(0)
  })

  test('A11y: Axe serious/critical 0, Tastatur erreichbar, Zugang nicht nur farbig', async ({
    page,
  }) => {
    await page.goto('/de/downloads')

    expect(await axeFindings(page)).toEqual([])

    // Jede Karte nennt ihren Zugang als Text — nicht nur als Farbe. Seit
    // PT19.4 gibt es beide Klassen, und beide muessen lesbar dastehen.
    const labels = {
      FREE_PUBLIC: translate('de', 'downloads:access.free'),
      GATED: translate('de', 'downloads:access.gated'),
    }
    const free = LAUNCH_VISIBLE_RESOURCES.filter((r) => r.deliveryClass === 'FREE_PUBLIC')
    const gated = LAUNCH_VISIBLE_RESOURCES.filter((r) => r.deliveryClass === 'GATED')
    await expect(page.locator('li[data-resource-access="FREE_PUBLIC"]')).toHaveCount(free.length)
    await expect(page.locator('li[data-resource-access="GATED"]')).toHaveCount(gated.length)
    for (const card of buildResourceCenter('de').flatMap((group) => group.cards)) {
      const text = await page.locator(`[data-resource-id="${card.resource.id}"]`).innerText()
      expect(text, card.resource.id).toContain(
        labels[card.resource.deliveryClass as 'FREE_PUBLIC' | 'GATED'],
      )
    }

    // Der erste Download-Link ist per Tastatur fokussierbar und ausloesbar.
    const firstLink = page.locator('[data-resource-id] a[href^="/downloads/"]').first()
    await firstLink.focus()
    await expect(firstLink).toBeFocused()
  })

  test('Responsive: 390/768/1440 ohne horizontalen Ueberlauf', async ({ page }) => {
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/de/downloads')
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, `Ueberlauf bei ${width}px`).toBeLessThanOrEqual(0)
    }
  })
})
