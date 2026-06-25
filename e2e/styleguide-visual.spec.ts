import { test, expect } from '@playwright/test'

/**
 * Visuelle Regressionssuite der Pattern Library (§Phase 7.3).
 *
 * Screenshottet die `/styleguide`-Galerie — die dieselben DS-Komponenten
 * importiert wie die Produktion (Holy Grail §7.8) — pro Komponenten-Spezimen
 * und über die Token-Breakpoints sm/md/lg/xl. Eine Pixel-Abweichung gegenüber
 * dem eingecheckten Baseline-Snapshot lässt den Lauf rot werden → fängt
 * unbeabsichtigte visuelle Regressionen an Atomen/Molecules früh ab.
 *
 * Baselines erzeugen/aktualisieren (bewusst, reviewter Schritt):
 *   npx playwright test e2e/styleguide-visual.spec.ts --update-snapshots
 *
 * SANDBOX-HINWEIS (Memory `sandbox-runtime-gates-blocked`): Chromium/libgbm ist
 * in dieser Umgebung nicht verfügbar → die Suite läuft hier NICHT, sondern im CI
 * (`.github/workflows/ci.yml`, Job „Visual regression"). Lokal/CI mit Browser
 * ausführbar.
 */

// Anker-IDs der Spezimen — identisch zu docs/design-system/components/<id>.md.
const SPECIMENS = [
  'container',
  'stack',
  'cluster',
  'grid',
  'button',
  'input',
  'textarea',
  'select',
  'eyebrow',
  'badge',
  'stat',
  'section-header',
  'form-field',
  'card',
  'panel',
  'accordion',
  'breadcrumbs',
  'author-byline',
  'nav-tile',
  'info-item',
  'media-link',
  'contact-callout',
  'alert',
  'empty-state',
  'spinner',
] as const

const BREAKPOINTS = [
  { name: 'sm', width: 375, height: 800 },
  { name: 'md', width: 768, height: 1000 },
  { name: 'lg', width: 1024, height: 1200 },
  { name: 'xl', width: 1440, height: 1200 },
] as const

test.describe('Styleguide — Pattern Library lädt', () => {
  test('/styleguide rendert alle Spezimen-Anker', async ({ page }) => {
    const response = await page.goto('/styleguide')
    expect(response?.status()).toBeLessThan(400)
    for (const id of SPECIMENS) {
      await expect(page.locator(`#${id}`)).toBeVisible()
    }
  })
})

test.describe('Styleguide — visuelle Regression je Spezimen', () => {
  for (const bp of BREAKPOINTS) {
    test.describe(`@${bp.name} (${bp.width}px)`, () => {
      test.use({ viewport: { width: bp.width, height: bp.height } })

      for (const id of SPECIMENS) {
        test(`${id} @${bp.name}`, async ({ page }) => {
          await page.goto('/styleguide')
          const specimen = page.locator(`#${id}`)
          await specimen.scrollIntoViewIfNeeded()
          await expect(specimen).toHaveScreenshot(`${id}-${bp.name}.png`, {
            // Animationen (Spinner, Accordion-Transition) deterministisch stoppen.
            animations: 'disabled',
            maxDiffPixelRatio: 0.01,
          })
        })
      }
    })
  }

  test('Gesamtseite ohne Horizontal-Scroll @sm', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/styleguide')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(overflow).toBe(false)
  })
})
