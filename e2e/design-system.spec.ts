import { test, expect, type Page } from '@playwright/test'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

/**
 * Visual Regression und Interaktionszusicherungen des Design-Systems (AP05 PT05.5).
 *
 * Die Galerie wird per `file://` aus `dist/visual-gallery.html` geladen und von
 * `scripts/build-visual-gallery.tsx` aus den ECHTEN Komponenten erzeugt. Sie
 * liegt bewusst NEBEN `dist/client/` statt darin: der SSR-Server liefert
 * `dist/client` per `express.static` aus und wuerde die Datei dort mit HTTP 200
 * oeffentlich zugaenglich machen (nachgemessen). Sie ist damit keine Route der
 * Anwendung und taucht in keinem Routing-Vertrag auf.
 *
 * DETERMINISMUS — ohne diese vier Vorkehrungen sind Screenshot-Vergleiche
 * wertlos, weil sie bei jedem Lauf anders ausfallen:
 *   1. feste Viewports (unten `VIEWPORTS`);
 *   2. `prefers-reduced-motion: reduce` — jede Animation steht still, es wird
 *      nie ein Zwischenbild aufgenommen;
 *   3. `document.fonts.ready` — ohne geladene Schrift misst der Browser mit den
 *      Fallback-Metriken und der Umbruch springt;
 *   4. `caret-color: transparent` — der blinkende Cursor in Formularfeldern ist
 *      sonst ein zufaellig sichtbarer Pixelunterschied.
 *
 * Keine Zeitstempel, keine Netzdaten, keine echten Personendaten.
 */

const GALLERY_URL = pathToFileURL(resolve('dist/visual-gallery.html')).href

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
] as const

const SURFACES = [
  'tokens-color',
  'typography',
  'typography-on-navy',
  'buttons',
  'form-controls',
  'status-alerts',
  'cards',
  'states',
  'dialog',
  'layout-grid',
  'section-navy',
] as const

/** Repraesentative echte Seiten — Hero, Longform/Chapter und Final CTA. */
const ROUTES = [
  { name: 'hero-diagnostics', path: '/de/diagnostics' },
  { name: 'longform-service', path: '/de/services/dental' },
  { name: 'final-cta-articles', path: '/de/articles' },
] as const

/**
 * Bewegungsreduktion EXPLIZIT pro Seite setzen.
 *
 * `use: { reducedMotion: 'reduce' }` aus der Config griff in diesem Setup
 * nachweislich nicht (`matchMedia(...).matches` war `false`). Ein Test, der
 * sich darauf verlaesst, prueft am Ende nur, dass OHNE Bewegungsreduktion
 * animiert wird — deshalb steht die Zusicherung unten im Test selbst.
 */
async function reduceMotion(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
}

async function prepare(page: Page) {
  await reduceMotion(page)
  await page.addStyleTag({
    content: `*,*::before,*::after{animation:none!important;transition:none!important}
              input,textarea{caret-color:transparent!important}`,
  })
  await page.evaluate(() => document.fonts.ready)
}

test.use({ reducedMotion: 'reduce' })

test.describe('Visual regression — Design-System-Oberflaechen', () => {
  for (const vp of VIEWPORTS) {
    for (const surface of SURFACES) {
      test(`${surface} @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await reduceMotion(page)
        await page.goto(GALLERY_URL, { waitUntil: 'networkidle' })
        await prepare(page)
        const el = page.locator(`[data-surface="${surface}"]`)
        await expect(el).toHaveScreenshot(`${surface}-${vp.name}.png`, {
          maxDiffPixelRatio: 0.01,
        })
      })
    }
  }
})

test.describe('Visual regression — repraesentative Seiten', () => {
  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      test(`${route.name} @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await reduceMotion(page)
        await page.goto(route.path, { waitUntil: 'networkidle' })
        await prepare(page)
        await expect(page).toHaveScreenshot(`${route.name}-${vp.name}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.01,
        })
      })
    }
  }
})

test.describe('Reduced Motion', () => {
  test('haelt Animationen und Transitions an', async ({ page }) => {
    await reduceMotion(page)
    await page.goto('/de/', { waitUntil: 'networkidle' })
    // Zuerst beweisen, dass die Emulation ueberhaupt greift — sonst prueft der
    // Test nur, dass ohne Bewegungsreduktion animiert wird.
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
      true,
    )
    const moving = await page.evaluate(() => {
      const offenders: string[] = []
      for (const el of document.querySelectorAll<HTMLElement>('*')) {
        const cs = getComputedStyle(el)
        // Einheiten MUESSEN normalisiert werden: der Browser gibt je nach Wert
        // "0.5s" ODER "0.01ms" zurueck. Ein blosses parseFloat haelt 0.01ms
        // faelschlich fuer groesser als 0.001s.
        const seconds = (v: string) =>
          v
            .split(',')
            .map((part) => {
              const n = parseFloat(part) || 0
              return part.trim().endsWith('ms') ? n / 1000 : n
            })
            .reduce((a, b) => Math.max(a, b), 0)
        // Das Sicherheitsnetz setzt 0.01ms (= 0.00001s) — bewusst nicht 0,
        // damit transitionend/animationend weiterhin feuern. Alles ab 1ms
        // waere echte, sichtbare Bewegung.
        if (seconds(cs.animationDuration) > 0.001 || seconds(cs.transitionDuration) > 0.001) {
          offenders.push(`${el.tagName}.${el.className}`.slice(0, 80))
        }
      }
      return offenders.slice(0, 10)
    })
    expect(moving).toEqual([])
  })

  test('nimmt bei Bewegungsreduktion keine Funktion weg', async ({ page }) => {
    await reduceMotion(page)
    await page.goto('/de/', { waitUntil: 'networkidle' })
    // Reveal-Inhalte sind auch ohne Animation vorhanden und sichtbar.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    // Die Karussellsteuerung bleibt bedienbar.
    const pause = page.getByRole('button', { name: /pausieren|fortsetzen/i }).first()
    await expect(pause).toBeVisible()
    await pause.click()
    await expect(pause).toBeVisible()
  })
})

test.describe('Keine Interaktionsblockade', () => {
  test('kein unsichtbarer Layer faengt Klicks ab', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    // Der Punkt in der Mitte des Viewports muss zu einem echten Inhaltselement
    // gehoeren, nicht zu einem vergessenen Overlay.
    const tag = await page.evaluate(() => {
      const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
      if (!el) return 'NONE'
      const cs = getComputedStyle(el)
      const suspicious =
        cs.position === 'fixed' && cs.pointerEvents !== 'none' && parseFloat(cs.opacity) < 0.05
      return suspicious ? `HIDDEN-OVERLAY:${el.tagName}` : 'ok'
    })
    expect(tag).toBe('ok')
  })

  test('Navigation bleibt nach einer Route-Transition klickbar', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    // Bewusst ueber den href und nicht ueber den sichtbaren Namen: der erste
    // Treffer auf "Diagnostik" ist der Aufklapper der Hauptnavigation, der
    // gar nicht navigiert.
    await page.locator('a[href="/de/diagnostics"]').first().click()
    await page.waitForURL(/diagnostics/)
    // Nach der Seitentransition ist die naechste Navigation sofort moeglich.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden')
  })

  test('der Scroll-Lock bleibt nach einer Navigation nicht haengen', async ({ page }) => {
    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    const overflow = await page.evaluate(() => getComputedStyle(document.body).overflow)
    expect(overflow).not.toBe('hidden')
  })
})

test.describe('Error-State-Muster', () => {
  test('ein Renderfehler ist kein 404 — die 404-Seite bleibt eine echte 404', async ({ page }) => {
    const response = await page.goto('/de/diese-route-gibt-es-nicht')
    expect(response?.status()).toBe(404)
    // Eine fehlende Route ist NotFound, keine Fehlergrenze.
    await expect(page.getByRole('alert')).toHaveCount(0)
  })

  test('bestehende Route liefert 200 und keine Fehleroberflaeche', async ({ page }) => {
    const response = await page.goto('/de/diagnostics')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
