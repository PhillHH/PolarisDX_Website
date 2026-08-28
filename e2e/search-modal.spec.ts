import { expect, test, type Page } from '@playwright/test'

const searchTrigger = (page: Page) => page.getByRole('button', { name: 'Suche öffnen' }).first()

const focusIsVisible = (page: Page) =>
  page.evaluate(() => {
    const element = document.activeElement
    if (!element || element === document.body) return false
    const style = getComputedStyle(element)
    const transparentOutline = /rgba\([^)]*,\s*0\s*\)/.test(style.outlineColor)
    const outline =
      style.outlineStyle !== 'none' &&
      Number.parseFloat(style.outlineWidth) > 0 &&
      !transparentOutline
    const ring =
      style.boxShadow !== 'none' &&
      !style.boxShadow.split(', ').every((part) => /rgba?\([^)]*,\s*0\)/.test(part))
    return outline || ring
  })

test.describe('SearchModal — Desktop-Tastatur', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('oeffnet per Tastatur, fokussiert die Suche und gibt Fokus nach Escape zurueck', async ({
    page,
  }) => {
    await page.goto('/de/')
    const trigger = searchTrigger(page)
    await trigger.focus()
    await page.keyboard.press('Enter')

    const dialog = page.getByRole('dialog', { name: 'Website durchsuchen' })
    await expect(dialog).toBeVisible()
    await expect(page.getByRole('searchbox', { name: 'Suchbegriff' })).toBeFocused()
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  })

  test('gruppiert Ergebnisse und aktiviert die locale-aware Route per Tastatur', async ({
    page,
  }) => {
    await page.goto('/de/')
    await searchTrigger(page).press('Enter')
    await page.getByRole('searchbox', { name: 'Suchbegriff' }).fill('Blutdiagnostik')

    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { name: 'Diagnostik', exact: true })).toBeVisible()
    const result = dialog.locator('a[href="/de/diagnostics/dental"]')
    await expect(result).toHaveCount(1)
    await result.focus()
    expect(await focusIsVisible(page)).toBe(true)
    await page.keyboard.press('Enter')

    await page.waitForURL('**/de/diagnostics/dental')
    await expect(page.getByRole('dialog')).toBeHidden()
  })

  test('zeigt einen lokalisierten Leerzustand mit Ergebnisansage', async ({ page }) => {
    await page.goto('/de/')
    await searchTrigger(page).click()
    await page.getByRole('searchbox', { name: 'Suchbegriff' }).fill('unauffindbar-xyz')

    await expect(page.getByRole('heading', { name: 'Keine Ergebnisse' })).toBeVisible()
    await expect(page.getByText(/unauffindbar-xyz/)).toBeVisible()
    await expect(page.getByRole('status')).toContainText('Keine Ergebnisse')
  })
})

test.describe('SearchModal — Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('bleibt ohne horizontalen Ueberlauf und mit grossen Trefferflaechen bedienbar', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/de/')
    const trigger = searchTrigger(page)
    await trigger.click()
    await page.getByRole('searchbox', { name: 'Suchbegriff' }).fill('Diagnostik')

    const measured = await page.getByRole('dialog').evaluate((dialog) => {
      const controls = [...dialog.querySelectorAll('button, input, a[href]')].filter(
        (element) => (element as HTMLElement).offsetParent !== null,
      )
      const resultLinks = [...dialog.querySelectorAll('[data-search-results] a[href]')]
      const bounds = dialog.getBoundingClientRect()
      return {
        documentOverflow:
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
        dialogOverflow: dialog.scrollWidth - dialog.clientWidth,
        tooSmallResults: resultLinks.filter(
          (element) => element.getBoundingClientRect().height < 44,
        ).length,
        tooSmallControls: controls
          .filter((element) => element.getBoundingClientRect().height < 44)
          .map((element) => ({
            tag: element.tagName,
            name: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 30),
            height: element.getBoundingClientRect().height,
          })),
        dialogTop: bounds.top,
        dialogBottom: bounds.bottom,
      }
    })

    expect(measured.documentOverflow).toBe(0)
    expect(measured.dialogOverflow).toBe(0)
    expect(measured.tooSmallResults).toBe(0)
    expect(measured.tooSmallControls, JSON.stringify(measured.tooSmallControls)).toEqual([])
    expect(measured.dialogTop).toBeGreaterThanOrEqual(0)
    expect(measured.dialogBottom).toBeLessThanOrEqual(844)
    await expect(page.getByRole('searchbox')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Suche schließen' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
  })

  test('respektiert Reduced Motion ohne Funktionsverlust', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/de/')
    await searchTrigger(page).click()

    const longestMotion = await page.getByRole('dialog').evaluate((dialog) => {
      const parse = (value: string) =>
        Math.max(
          ...value.split(',').map((part) => {
            const trimmed = part.trim()
            return trimmed.endsWith('ms')
              ? Number.parseFloat(trimmed)
              : Number.parseFloat(trimmed) * 1000
          }),
        )
      return Math.max(
        ...[dialog, ...dialog.querySelectorAll('*')].map((element) => {
          const style = getComputedStyle(element)
          return Math.max(parse(style.animationDuration), parse(style.transitionDuration))
        }),
      )
    })

    expect(longestMotion).toBeLessThanOrEqual(1)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
  })
})
