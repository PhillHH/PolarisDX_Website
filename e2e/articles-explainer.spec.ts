import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import { articles } from '../src/data/articles'
import { events } from '../src/data/events'
import { calculateArticleReadMinutes } from '../src/lib/articleMeta'

/**
 * SC-031 (Owner 2026-11-18): der interaktive Artikel „Was ist Epigenetik?" — eigener Seitenaufbau
 * (Zoom-Bühne, Textbänder, Labor-Bänder mit Bausteinen). Geprüft wird dasselbe wie bei der
 * gemeinsamen Artikelvorlage (e2e/articles-template.spec.ts): wahre Kopfdaten, eine Überschrift,
 * Verweise, Schema — dazu die Bühne und die Bausteine.
 */
const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const
type Locale = (typeof locales)[number]

const found = articles.find(({ id }) => id === 'what_is_epigenetics')
if (!found) throw new Error('what_is_epigenetics: published article inventory entry missing')
const article = found

type ExplainerDocument = {
  stage: { steps: { tick: string; word: string; text: string }[]; skip: string }
  intro: { title: string }
  chapters: { question: string; answer: string }[]
  closing: { quote: string }
  widgets: {
    pult: { sayIdle: string; sayActive: string }
    methyl: { site: string; saySetLower: string }
    exer: { sources: string[]; saySent: string }
    sort: { useful: string; right: string; wrong: string }
    trend: { sayOne: string; sayMany: string; countAria: string }
  }
}
const documentFor = (locale: Locale) =>
  JSON.parse(
    readFileSync(`src/content/articles/${article.slug}/${locale}.json`, 'utf8'),
  ) as ExplainerDocument
const metadataFor = (locale: Locale) =>
  (
    JSON.parse(readFileSync(`public/locales/${locale}/articles.json`, 'utf8')) as Record<
      string,
      { title: string; excerpt: string }
    >
  )[article.id]
const commonFor = (locale: Locale) =>
  JSON.parse(readFileSync(`public/locales/${locale}/common.json`, 'utf8')) as {
    nav: { cta_quote: string }
    a11y: { breadcrumb: string }
  }

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/{{(\w+)}}/g, (match, key: string) => (key in values ? String(values[key]) : match))
/** Muster aus einem Text mit Platzhaltern: bekannte Werte eingesetzt, der Rest als Zahl. */
const pattern = (text: string, values: Record<string, string | number>) =>
  new RegExp(
    fill(text, values)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\{\\\{\w+\\\}\\\}/g, '\\d+'),
    'u',
  )

test('SC-031 renders the interactive article truth-safe in all ten locales', async ({
  page,
  request,
}) => {
  test.setTimeout(150_000)

  for (const locale of locales) {
    const content = documentFor(locale)
    const metadata = metadataFor(locale)
    const url = `/${locale}/articles/${article.slug}`
    const response = await page.goto(url)
    expect(response?.status(), url).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('lang', locale)

    const template = page.locator(`article[data-article-template="${article.slug}"]`)
    await expect(template).toHaveCount(1)
    await expect(template.locator('h1')).toHaveCount(1)
    await expect(template.locator('h1')).toHaveText(metadata.title)
    await expect(template.locator('h1')).toBeVisible()
    await expect(template.locator('time')).toHaveAttribute('datetime', article.datePublished)
    await expect(template).toContainText(article.author)
    await expect(template.locator('[data-reading-minutes]')).toHaveAttribute(
      'data-reading-minutes',
      String(calculateArticleReadMinutes(content.intro, content.chapters, content.closing)),
    )

    const headingLevels = await template
      .locator('h1, h2, h3')
      .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName.slice(1))))
    expect(headingLevels[0]).toBe(1)
    for (let heading = 1; heading < headingLevels.length; heading += 1) {
      expect(headingLevels[heading] - headingLevels[heading - 1]).toBeLessThanOrEqual(1)
    }

    const common = commonFor(locale)
    const breadcrumb = template.locator(`nav[aria-label="${common.a11y.breadcrumb}"]`)
    await expect(breadcrumb.locator(`a[href="/${locale}"]`)).toHaveCount(1)
    await expect(breadcrumb.locator(`a[href="/${locale}/articles"]`)).toHaveCount(1)
    await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText(metadata.title)

    // Bühne: alle sechs Schritte stehen als Text im HTML, nicht erst nach dem Scrollen.
    const steps = template.locator('[data-explainer-step]')
    await expect(steps).toHaveCount(content.stage.steps.length)
    for (const [index, step] of content.stage.steps.entries()) {
      await expect(steps.nth(index)).toContainText(step.word)
      await expect(steps.nth(index)).toContainText(step.text)
    }

    // Acht Kapitel, je ein Textband mit Frage und Antwort und ein Labor mit Baustein.
    const chapters = template.locator('[data-explainer-chapter]')
    await expect(chapters).toHaveCount(content.chapters.length)
    for (const [index, chapter] of content.chapters.entries()) {
      await expect(chapters.nth(index).locator('h2')).toHaveText(chapter.question)
      await expect(chapters.nth(index)).toContainText(chapter.answer)
      expect(
        await chapters.nth(index).locator('[data-explainer-widget]').count(),
        `${locale}: chapter ${index + 1} widget`,
      ).toBeGreaterThan(0)
    }
    await expect(template).toContainText(content.closing.quote)

    await expect(template.locator('[data-article-sources] li')).toHaveCount(
      article.sources?.length ?? 0,
    )
    for (const source of article.sources ?? []) {
      await expect(template.locator('[data-article-sources]')).toContainText(source.title)
    }

    const serviceTargets = await template
      .locator('a[href*="/diagnostics/"]')
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!),
      )
    expect(serviceTargets.length).toBe(article.relatedServiceIds?.length)
    await expect(template.locator(`a[href="/${locale}/epigenetics"]`)).toHaveCount(1)
    const quote = template.locator(`a[href="/${locale}/contact?intent=quote#kontaktformular"]`)
    await expect(quote).toHaveText(common.nav.cta_quote)

    const internalTargets = await template
      .locator('a[href^="/"]')
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!).filter(Boolean),
      )
    expect(internalTargets.some((target) => target.includes('/articles/'))).toBe(true)
    for (const target of new Set(internalTargets)) {
      const internal = await request.get(target, { maxRedirects: 0 })
      expect(internal.status(), target).toBe(200)
      expect(internal.headers().location).toBeUndefined()
    }

    const articleSchemas = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts
          .flatMap((script) => {
            const parsed = JSON.parse(script.textContent || '{}')
            return Array.isArray(parsed) ? parsed : [parsed]
          })
          .filter((schema) => schema['@type'] === 'Article'),
      )
    expect(articleSchemas).toHaveLength(1)
    expect(articleSchemas[0]).toMatchObject({
      headline: metadata.title,
      description: metadata.excerpt,
      author: { name: article.author },
      inLanguage: locale,
    })
    expect(articleSchemas[0].datePublished).toBe(article.datePublished)
    expect(articleSchemas[0]).not.toHaveProperty('dateModified')
    expect(articleSchemas[0]).not.toHaveProperty('reviewedBy')
    expect(articleSchemas[0]).not.toHaveProperty('image')
    await expect(template.locator('img')).toHaveCount(0)
  }
})

test('SC-031 stage zooms through six steps and hands over to the article', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const content = documentFor('de')
  await page.goto(`/de/articles/${article.slug}`)
  const stage = page.locator('[data-explainer-stage]')
  await expect(stage).toHaveAttribute('data-state', '0')
  await expect(stage.locator('.xp-st.is-on h1')).toBeVisible()

  // Die Zeichnung wird nachgeladen und malt auf die Leinwand.
  await expect
    .poll(() =>
      stage.locator('canvas').evaluate((node) => {
        const canvas = node as HTMLCanvasElement
        const context = canvas.getContext('2d')
        if (!context || !canvas.width) return 0
        const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
        let painted = 0
        for (let index = 3; index < data.length; index += 4 * 97) if (data[index] > 0) painted += 1
        return painted
      }),
    )
    .toBeGreaterThan(50)

  const ticks = stage.locator('.xp-ticks button')
  await expect(ticks).toHaveCount(content.stage.steps.length)
  for (const [index, step] of content.stage.steps.entries()) {
    await ticks.nth(index).click()
    await expect(stage).toHaveAttribute('data-state', String(index + 1))
    await expect(stage.locator('.xp-st.is-on')).toHaveCount(1)
    await expect(stage.locator('.xp-st.is-on')).toContainText(step.word)
    await expect(ticks.nth(index)).toHaveAttribute('aria-current', 'step')
  }

  await stage.getByRole('link', { name: content.stage.skip }).click()
  await expect(page.locator('#xp-body h2').first()).toBeInViewport()
  await expect(page.locator('#xp-body h2').first()).toHaveText(content.intro.title)
})

test('SC-031 widgets answer every input with one explaining sentence', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  const { widgets } = documentFor('de')
  await page.goto(`/de/articles/${article.slug}`)

  // Mischpult: ein Reiz bewegt Regler, die Sequenz bleibt stehen.
  const pult = page.locator('[data-explainer-widget="pult"]')
  await pult.scrollIntoViewIfNeeded()
  await expect(pult.locator('.xp-say')).toHaveText(widgets.pult.sayIdle)
  const sequence = await pult.locator('.xp-seq').textContent()
  await pult.getByRole('switch').first().click()
  await expect(pult.locator('.xp-say')).toHaveText(pattern(widgets.pult.sayActive, { n: 1 }))
  expect(await pult.locator('.xp-faders .is-moved').count()).toBeGreaterThan(0)
  expect(await pult.locator('.xp-seq').textContent()).toBe(sequence)

  // Methylierung: Stelle 1 markieren.
  const methyl = page.locator('[data-explainer-widget="methyl"]')
  await methyl.getByRole('button', { name: fill(widgets.methyl.site, { n: 1 }) }).click()
  await expect(methyl.locator('.xp-say')).toHaveText(fill(widgets.methyl.saySetLower, { n: 1 }))

  // Die drei Mechanismen sind Reiter: Histone und RNA lassen sich öffnen.
  const mechanisms = page.locator('[data-explainer-widget="mechanisms"]')
  await mechanisms.getByRole('tab').nth(1).click()
  await expect(page.locator('[data-explainer-widget="histone"]')).toBeVisible()
  await mechanisms.getByRole('tab').nth(2).click()
  await expect(page.locator('[data-explainer-widget="rna"]')).toBeVisible()

  // Verlauf: mit dem Regler kommen Messungen dazu.
  const trend = page.locator('[data-explainer-widget="trend"]')
  await expect(trend.locator('.xp-say')).toHaveText(widgets.trend.sayOne)
  await trend.getByRole('slider', { name: widgets.trend.countAria }).focus()
  await page.keyboard.press('End')
  await expect(trend.locator('.xp-say')).toHaveText(fill(widgets.trend.sayMany, { n: 5 }))
  await expect(trend.locator('g.is-on')).toHaveCount(5)

  // Exerkine: ein Organ sendet, die Ziele leuchten auf.
  const exer = page.locator('[data-explainer-widget="exer"]')
  await exer.getByRole('button', { name: widgets.exer.sources[0], exact: true }).click()
  await expect(exer.locator('.xp-say')).toContainText(
    fill(widgets.exer.saySent, { name: widgets.exer.sources[0] }),
  )

  // Einordnen: sechs Aussagen, danach die Übersicht.
  const sort = page.locator('[data-explainer-widget="sort"]')
  for (let statement = 0; statement < 6; statement += 1) {
    const useful = sort.getByRole('button', { name: widgets.sort.useful, exact: true })
    await expect(useful).toBeEnabled()
    await useful.click()
  }
  await expect(sort.locator('.xp-sort-res')).toBeVisible()
})

/** Einwilligung entschieden und Messe-Hinweis schon gesehen: Nichts liegt über der Seite. */
const EVENT_IDS = events.map(({ id }) => id)
const CLEAR_PAGE = (ids: string[]) => {
  for (const id of ids) sessionStorage.setItem(`polaris-event-popup:${id}`, '1')
  localStorage.setItem(
    'cookie-consent',
    JSON.stringify({
      version: 2,
      decidedAt: '2026-10-16T00:00:00.000Z',
      analytics: false,
      marketing: false,
    }),
  )
}

test('SC-033 a widget leads step by step and ends with the take-away', async ({ page }) => {
  await page.addInitScript(CLEAR_PAGE, EVENT_IDS)
  await page.setViewportSize({ width: 1280, height: 900 })
  const { ui, widgets } = JSON.parse(
    readFileSync(`src/content/articles/${article.slug}/de.json`, 'utf8'),
  ) as {
    ui: { guide: Record<string, string> }
    widgets: {
      influences: { short: string[] }
      pult: { guide: { shows: string; steps: string[]; learn: string } }
    }
  }
  await page.goto(`/de/articles/${article.slug}`)
  const pult = page.locator('[data-explainer-widget="pult"]')
  await pult.scrollIntoViewIfNeeded()
  const coach = pult.locator('.xp-coach')
  const switches = pult.getByRole('switch')

  await expect(pult.locator('.xp-shows')).toContainText(widgets.pult.guide.shows)
  await expect(pult).toHaveAttribute('data-phase', 'do')
  await expect(coach).toContainText(
    fill(widgets.pult.guide.steps[0], { label: widgets.influences.short[0] }),
  )
  await expect(switches.first()).toHaveClass(/is-coach/)
  await expect(pult.locator('.xp-tag')).toHaveText(ui.guide.tap)
  // Das Schildchen sitzt am markierten Bedienelement und bleibt im Baustein.
  const tag = (await pult.locator('.xp-tag').boundingBox())!
  const frame = (await pult.boundingBox())!
  const target = (await switches.first().boundingBox())!
  expect(tag.x).toBeGreaterThanOrEqual(frame.x)
  expect(tag.x + tag.width).toBeLessThanOrEqual(frame.x + frame.width)
  expect(Math.abs(tag.y + tag.height - target.y)).toBeLessThan(30)

  await switches.first().click()
  await expect(pult).toHaveAttribute('data-phase', 'see')
  await expect(coach).toContainText(ui.guide.look)
  await expect(pult.locator('.xp-coach-next')).toBeHidden()
  await pult.locator('.xp-res-next').click()

  await expect(pult).toHaveAttribute('data-phase', 'do')
  await expect(switches.nth(3)).toBeFocused()
  await page.keyboard.press('Space')
  await expect(pult).toHaveAttribute('data-phase', 'see')
  await pult.locator('.xp-res-next').click()
  await expect(pult).toHaveAttribute('data-phase', 'learn')
  await expect(coach).toContainText(widgets.pult.guide.learn)
  await expect(pult.getByRole('button', { name: ui.guide.again })).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(pult).toHaveAttribute('data-phase', 'do')
  await expect(pult.locator('[role="switch"][aria-checked="true"]')).toHaveCount(0)
})

test('SC-033 on a phone the result and the next button sit in the hint bar', async ({ page }) => {
  await page.addInitScript(CLEAR_PAGE, EVENT_IDS)
  await page.setViewportSize({ width: 390, height: 780 })
  await page.goto(`/de/articles/${article.slug}`)
  const pult = page.locator('[data-explainer-widget="pult"]')
  await pult.scrollIntoViewIfNeeded()
  await pult.getByRole('switch').first().click()
  await expect(pult).toHaveAttribute('data-phase', 'see')
  await expect(pult.locator('.xp-coach-say')).toBeVisible()
  await expect(pult.locator('.xp-coach-look')).toBeHidden()
  await expect(pult.locator('.xp-coach-next')).toBeVisible()
  await expect(pult.locator('.xp-res-next')).toBeHidden()
  await pult.locator('.xp-coach-next').click()
  await expect(pult).toHaveAttribute('data-phase', 'do')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('SC-033 the journey runs by itself, waits for the cookie notice and yields to input', async ({
  page,
}) => {
  test.setTimeout(60_000)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 1280, height: 800 })

  // Cookie-Hinweis offen: kein Selbststart.
  await page.goto(`/de/articles/${article.slug}`)
  const stage = page.locator('[data-explainer-stage]')
  await expect(stage).toHaveAttribute('data-state', '0')
  await page.waitForTimeout(4500)
  await expect(stage).not.toHaveAttribute('data-playing', 'true')
  await expect(stage).toHaveAttribute('data-state', '0')

  // Seite frei: Nach kurzer Ruhe läuft die Reise los und erreicht den ersten Schritt.
  await page.addInitScript(CLEAR_PAGE, EVENT_IDS)
  await page.reload()
  await expect(stage).toHaveAttribute('data-playing', 'true', { timeout: 8000 })
  await expect(stage).toHaveAttribute('data-state', '1', { timeout: 8000 })
  const content = documentFor('de')
  const pauseName = (
    JSON.parse(readFileSync(`src/content/articles/${article.slug}/de.json`, 'utf8')) as {
      stage: { play: string; pause: string }
    }
  ).stage
  await expect(stage.getByRole('button', { name: pauseName.pause })).toBeVisible()

  // Eine Eingabe übernimmt.
  await page.mouse.move(640, 400)
  await page.mouse.wheel(0, 10)
  await expect(stage).not.toHaveAttribute('data-playing', 'true')
  const y = await page.evaluate(() => scrollY)
  await page.waitForTimeout(1500)
  expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(40)

  // Der Knopf setzt fort und hält an.
  await stage.getByRole('button', { name: pauseName.play }).click()
  await expect(stage).toHaveAttribute('data-playing', 'true')
  await stage.getByRole('button', { name: pauseName.pause }).click()
  await expect(stage).not.toHaveAttribute('data-playing', 'true')
  expect(content.stage.steps.length).toBe(6)
})

test('SC-033 with reduced motion nothing starts by itself; the button steps through', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(CLEAR_PAGE, EVENT_IDS)
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(`/de/articles/${article.slug}`)
  const stage = page.locator('[data-explainer-stage]')
  await page.waitForTimeout(4000)
  await expect(stage).toHaveAttribute('data-state', '0')
  await expect(stage).not.toHaveAttribute('data-playing', 'true')
  await stage.locator('.xp-play').click()
  await expect(stage).toHaveAttribute('data-state', '1')
  await expect(stage).toHaveAttribute('data-playing', 'true')
  await stage.locator('.xp-play').click()
  await expect(stage).not.toHaveAttribute('data-playing', 'true')
})

for (const [width, locale] of [
  [390, 'cs'],
  [768, 'pl'],
  [1440, 'fr'],
] as const) {
  test(`SC-031 interactive article is responsive and Axe-clean at ${width}px in ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(`/${locale}/articles/${article.slug}`)
    await expect(page.locator('article[data-article-template]')).toBeVisible()
    const overflow = await page.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)

    // Kein Baustein und kein Textblock der Bühne ragt seitlich aus dem Bild.
    const outside = await page.evaluate(
      () =>
        [...document.querySelectorAll('[data-explainer-widget], .xp-st')]
          .map((node) => node.getBoundingClientRect())
          .filter((box) => box.left < -1 || box.right > innerWidth + 1).length,
    )
    expect(outside).toBe(0)

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

test('SC-031 loads only its own article chunk and stays pre-consent clean', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto(`/de/articles/${article.slug}`)
  await expect(page.locator('article[data-article-template]')).toBeVisible()

  expect(requests.filter((url) => /google-analytics|googletagmanager/u.test(url))).toEqual([])
  expect(requests.filter((url) => /\/locales\/(?!de\/|en\/)/u.test(url))).toEqual([])
  expect(requests.some((url) => url.includes(article.slug))).toBe(true)
  for (const sibling of articles.filter(({ id }) => id !== article.id)) {
    expect(
      requests.some((url) => url.includes(sibling.slug)),
      sibling.slug,
    ).toBe(false)
  }
})
