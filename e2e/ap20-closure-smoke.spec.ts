import { expect, test } from '@playwright/test'

const PAGES = [
  { route: '/de/about', name: 'About' },
  { route: '/de/contact', name: 'Contact' },
  { route: '/de/support', name: 'Support' },
  { route: '/de/privacy', name: 'Privacy' },
  { route: '/de/terms', name: 'Terms' },
  { route: '/de/imprint', name: 'Imprint' },
] as const

async function waitHydrated(page: import('@playwright/test').Page) {
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(800)
}

test.describe('AP20-CLOSURE — keyboard (C20-45)', () => {
  for (const { route, name } of PAGES) {
    test(`${name}: erster Tab-Fokus = Skip-Link, Fokus sichtbar`, async ({ page }) => {
      await page.goto(route)
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      await expect(focused).toHaveAttribute('href', '#main-content')
      const outline = await focused.evaluate((el) => getComputedStyle(el).outlineStyle)
      expect(outline).not.toBe('none')
    })
  }

  test('Contact: Formular komplett per Tastatur absendbar', async ({ page }) => {
    await page.goto('/de/contact')
    await waitHydrated(page)
    const form = page.locator('form').first()
    await form.locator('#consent').focus()
    await page.keyboard.press('Space')
    await expect(form.locator('#consent')).toBeChecked()
    await form.getByRole('button', { name: 'Angebot anfragen' }).last().focus()
    await page.keyboard.press('Enter')
    // Client-Validierung greift: kein nativer GET-Submit (URL unveraendert),
    // Fokus landet per Validierungslogik auf dem ersten Pflichtfeld (#name).
    expect(page.url()).not.toContain('?_hp=')
    await expect(page.locator('#name')).toBeFocused({ timeout: 10_000 })
  })

  test('Support: Consent-Checkbox per Tastatur, Upload per Tastatur oeffnenbar', async ({
    page,
  }) => {
    await page.goto('/de/support')
    await waitHydrated(page)
    const form = page.locator('form').first()
    await form.locator('#consent').focus()
    await page.keyboard.press('Space')
    await expect(form.locator('#consent')).toBeChecked()
    // Upload: der sichtbare Button oeffnet den Datei-Dialog (Enter/Space nativ).
    // Nachweis per Click-Listener am versteckten File-Input (Enter → ref.click()).
    const uploadButton = form.getByRole('button', { name: /Datei|Anhang|Durchsuchen|Upload/i })
    await uploadButton.focus()
    const inputClicked = page.evaluate(
      () =>
        new Promise<boolean>((resolve) => {
          const input = document.querySelector('form input#attachment')
          if (!input) return resolve(false)
          input.addEventListener('click', () => resolve(true), { once: true })
          setTimeout(() => resolve(false), 3_000)
        }),
    )
    await page.keyboard.press('Space')
    expect(await inputClicked).toBe(true)
  })

  test('Legal Longform: TOC-Anker per Tastatur erreichbar und sprungfaehig', async ({ page }) => {
    await page.goto('/de/terms')
    const toc = page.locator('main nav a[href^="#"]').first()
    await expect(toc).toBeAttached()
    const target = await toc.getAttribute('href')
    expect(target).toMatch(/^#/)
    await toc.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(400)
    const yOffset = await page.evaluate(() => window.scrollY)
    expect(yOffset).toBeGreaterThan(0)
  })
})

test.describe('AP20-CLOSURE — responsive (C20-46)', () => {
  const VIEWPORTS = [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
  ] as const
  for (const locale of ['de', 'cs'] as const) {
    for (const vp of VIEWPORTS) {
      test(`${locale} @${vp.width}px: kein horizontaler Overflow (About/Contact/Support/Legal)`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        for (const route of ['about', 'contact', 'support', 'privacy', 'terms', 'imprint']) {
          await page.goto(`/${locale}/${route}`)
          await page.waitForLoadState('networkidle')
          const metrics = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
          }))
          expect(
            metrics.scrollWidth,
            `${locale}/${route} @${vp.width}px overflow`,
          ).toBeLessThanOrEqual(metrics.innerWidth)
        }
      })
    }
  }
})

test.describe('AP20-CLOSURE — performance smoke (C20-47)', () => {
  for (const { route, name } of PAGES) {
    test(`${name}: keine Third-Party-Hosts, HTML+Assets same-origin`, async ({ page }) => {
      const foreign: string[] = []
      page.on('request', (req) => {
        const url = new URL(req.url())
        if (url.host !== new URL(page.url()).host && !url.host.startsWith('127.0.0.1'))
          foreign.push(req.url())
      })
      const response = await page.goto(route)
      await page.waitForLoadState('networkidle')
      expect(response?.status()).toBe(200)
      expect(foreign).toEqual([])
    })
  }

  test('Support: kein Upload-Code eager — Upload-Eingabewechsel zeigt keine Extra-SDK-Requests', async ({
    page,
  }) => {
    const requestsBefore: string[] = []
    page.on('request', (req) => requestsBefore.push(req.url()))
    await page.goto('/de/support')
    await page.waitForLoadState('networkidle')
    const baseline = requestsBefore.length
    // Datei-Auswahl-Interaktion ohne Netzwerk-Delta (Client-seitige Validierung zuerst).
    const fileInput = page.locator('form input[type="file"]')
    await fileInput.setInputFiles({
      name: 'probe.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('closure-probe'),
    })
    await page.waitForTimeout(500)
    expect(requestsBefore.length).toBe(baseline)
  })
})
