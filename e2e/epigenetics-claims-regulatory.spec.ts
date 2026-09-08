import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const reportSlug = 'metabolic-health'

type JsonObject = Record<string, unknown>

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/epigenetics.json`, 'utf8')) as JsonObject,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], JsonObject>

const reports = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(
      readFileSync(`src/content/befunde/${reportSlug}.${locale}.json`, 'utf8'),
    ) as JsonObject,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], JsonObject>

function valueAt(resource: JsonObject, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as JsonObject)[segment]
  }, resource)
}

function htmlText(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('>', '&gt;')
    .replaceAll('<', '&lt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;')
}

function schemaTypes(html: string): string[] {
  return [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/giu)]
    .flatMap(([, raw]) => {
      const parsed = JSON.parse(raw) as { '@type'?: string } | Array<{ '@type'?: string }>
      return (Array.isArray(parsed) ? parsed : [parsed]).map((item) => item['@type'] ?? '')
    })
    .filter(Boolean)
}

test('PT15.4 keeps the approved regulatory and example-data boundaries visible in all ten locales', async ({
  request,
}) => {
  test.setTimeout(180_000)

  for (const locale of SUPPORTED_LANGUAGES) {
    const resource = resources[locale]
    const hubResponse = await request.get(`/${locale}/epigenetics`)
    expect(hubResponse.status(), `${locale}: Hub HTTP`).toBe(200)
    const hub = await hubResponse.text()
    for (const path of ['contact.note', 'compare.gendg', 'samples.note']) {
      const text = valueAt(resource, path)
      expect(typeof text, `${locale}: ${path}`).toBe('string')
      expect(hub, `${locale}: visible ${path}`).toContain(htmlText(text as string))
    }

    const evidenceResponse = await request.get(`/${locale}/epigenetics/studienlage`)
    expect(evidenceResponse.status(), `${locale}: Evidence HTTP`).toBe(200)
    const evidence = await evidenceResponse.text()
    expect(evidence, `${locale}: GenDG on evidence page`).toContain(
      htmlText(valueAt(resource, 'compare.gendg') as string),
    )
    expect(evidence, `${locale}: service/CE boundary on evidence page`).toContain(
      htmlText(valueAt(resource, 'contact.note') as string),
    )

    const basicsResponse = await request.get(`/${locale}/epigenetics/grundlagen`)
    expect(basicsResponse.status(), `${locale}: Basics HTTP`).toBe(200)
    expect(await basicsResponse.text(), `${locale}: no-diagnosis basics boundary`).toContain(
      htmlText(valueAt(resource, 'basics.lead') as string),
    )

    const reportResponse = await request.get(`/${locale}/epigenetics/musterbefund/${reportSlug}`)
    expect(reportResponse.status(), `${locale}: report HTTP`).toBe(200)
    const reportHtml = await reportResponse.text()
    const contact = (reports[locale].blocks as Array<JsonObject>).find(
      (block) => block.type === 'contact',
    )
    const legal = contact?.legal as Array<{ title: string; text: string }>
    expect(legal, `${locale}: four approved report notices`).toHaveLength(4)
    for (const notice of legal) {
      expect(reportHtml, `${locale}: visible report notice title`).toContain(htmlText(notice.title))
      expect(reportHtml, `${locale}: visible report notice text`).toContain(htmlText(notice.text))
    }

    expect(schemaTypes(hub).sort(), `${locale}: Hub schema`).toEqual(['BreadcrumbList', 'FAQPage'])
    expect(schemaTypes(evidence), `${locale}: deep-page schema`).toEqual(['BreadcrumbList'])
    expect(schemaTypes(reportHtml).sort(), `${locale}: report schema`).toEqual([
      'Article',
      'BreadcrumbList',
    ])
    expect(`${hub}\n${evidence}\n${reportHtml}`, `${locale}: no schema amplification`).not.toMatch(
      /"@type":"(?:Product|Offer|MedicalTest|MedicalCondition)"|"(?:price|priceCurrency|availability|rating|review)":/u,
    )
    expect(`${hub}\n${evidence}\n${reportHtml}`, `${locale}: no preview host`).not.toMatch(
      /preview\.polarisdx\.net|localhost|127\.0\.0\.1/u,
    )
  }
})

for (const [path, width] of [
  ['/de/epigenetics/studienlage', 390],
  ['/cs/epigenetics/musterbefund/metabolic-health', 1280],
] as const) {
  test(`PT15.4 required notices remain responsive and Axe-clean on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(path)
    await page.waitForTimeout(1200)

    const overflow = await page.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)

    await page.addScriptTag({ path: axePath })
    const seriousOrCritical = await page.evaluate(async () => {
      const result = await (
        window as Window & {
          axe: {
            run: (
              context: string,
              options: Record<string, unknown>,
            ) => Promise<{ violations: Array<{ id: string; impact: string | null }> }>
          }
        }
      ).axe.run('main', {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      })
      return result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
    })
    expect(seriousOrCritical).toEqual([])
  })
}
