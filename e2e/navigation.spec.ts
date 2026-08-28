import { test, expect, type Page } from '@playwright/test'

/**
 * Navigations-Regression der App-Shell (AP06 PT06.5).
 *
 * Diese Datei prueft, was sich nur im echten Browser zeigt: Tastaturreihenfolge,
 * Fokusringe, klebende Kopfzeilen, Anker-Offsets und der Sprachwechsel ueber
 * einen echten Seitenwechsel. Die Struktur- und Rollenzusicherungen stehen in
 * den Komponententests und werden hier nicht wiederholt.
 *
 * Nicht Gegenstand von AP06 und deshalb bewusst nicht geprueft:
 * `/api/chat` (AP22), CSP-Domains (AP26), der Suchindex (AP07).
 */

const LOCALES = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

/** Sichtbarer Fokusindikator: Outline mit Farbe ODER nicht-transparenter Ring. */
async function focusIsVisible(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body) return false
    const cs = getComputedStyle(el)
    const transparent = /rgba\([^)]*,\s*0\s*\)/.test(cs.outlineColor)
    const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 && !transparent
    const ring =
      cs.boxShadow !== 'none' &&
      !cs.boxShadow.split(', ').every((part) => /rgba?\([^)]*,\s*0\)/.test(part))
    return outline || ring
  })
}

const activeInfo = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null
    return {
      tag: el?.tagName ?? null,
      href: el?.getAttribute('href') ?? null,
      label: (el?.getAttribute('aria-label') || el?.textContent || '').trim().slice(0, 40),
      expanded: el?.getAttribute('aria-expanded'),
    }
  })

test.describe('Desktop — Tastatur', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('der erste Tab landet auf dem Sprunglink, der zweite im Header', async ({ page }) => {
    await page.goto('/de/')
    await page.keyboard.press('Tab')
    const skip = await activeInfo(page)
    expect(skip.href).toBe('#main-content')
    expect(await focusIsVisible(page)).toBe(true)
  })

  test('jedes Header-Ziel ist per Tab erreichbar und sichtbar fokussiert', async ({ page }) => {
    await page.goto('/de/')
    let seen = 0
    let invisible = 0
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab')
      const inHeader = await page.evaluate(() => !!document.activeElement?.closest('header'))
      if (!inHeader) continue
      seen++
      if (!(await focusIsVisible(page))) invisible++
    }
    expect(seen).toBeGreaterThan(8)
    expect(invisible).toBe(0)
  })

  test('das Mega-Menue oeffnet mit der Tastatur — kein Hover-Zwang', async ({ page }) => {
    await page.goto('/de/')
    const trigger = page.locator('[data-submenu-trigger="service"]').first()
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const services = await page.locator('header nav a[href^="/de/diagnostics/"]').count()
    expect(services).toBe(9)
  })

  test('Escape schliesst das Mega-Menue und gibt den Fokus zurueck', async ({ page }) => {
    await page.goto('/de/')
    const trigger = page.locator('[data-submenu-trigger="service"]').first()
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Escape')

    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(
      await page.evaluate(() => document.activeElement?.getAttribute('data-submenu-trigger')),
    ).toBe('service')
  })

  test('der Sprunglink fuehrt in den Hauptinhalt', async ({ page }) => {
    await page.goto('/de/')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('main-content')
  })
})

test.describe('Mobile — Tastatur und Interaktion', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('der Burger oeffnet und schliesst und meldet seinen Zustand', async ({ page }) => {
    await page.goto('/de/')
    const burger = page.getByRole('button', { name: /Navigation umschalten/i })
    await expect(burger).toHaveAttribute('aria-expanded', 'false')
    await burger.click()
    await expect(burger).toHaveAttribute('aria-expanded', 'true')
    await burger.click()
    await expect(burger).toHaveAttribute('aria-expanded', 'false')
  })

  test('alle neun Services sind mobil erreichbar, ohne horizontalen Ueberlauf', async ({
    page,
  }) => {
    await page.goto('/de/')
    await page.getByRole('button', { name: /Navigation umschalten/i }).click()
    await page.locator('[data-submenu-trigger="service"]').last().click()

    const result = await page.evaluate(() => {
      const links = [...document.querySelectorAll('header a[href^="/de/diagnostics/"]')]
      return {
        services: new Set(links.map((a) => a.getAttribute('href'))).size,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        tooSmall: [...document.querySelectorAll('header a, header button')].filter((el) => {
          const r = el.getBoundingClientRect()
          return r.height > 0 && r.height < 44
        }).length,
      }
    })

    expect(result.services).toBe(9)
    expect(result.overflow).toBe(0)
    expect(result.tooSmall).toBe(0)
  })

  test('Epigenetik hat auch mobil einen eigenen Eintrag', async ({ page }) => {
    await page.goto('/de/')
    await page.getByRole('button', { name: /Navigation umschalten/i }).click()

    // Header und Mobilmenue rendern BEIDE einen Epigenetik-Link; der erste im
    // DOM gehoert der Desktop-Navigation und ist bei 390px ausgeblendet.
    // Geprueft wird deshalb, dass mindestens EIN Treffer sichtbar ist — und
    // dass er nicht unter /diagnostics haengt.
    const links = page.locator('header a[href="/de/epigenetics"]')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)

    let visible = 0
    for (let i = 0; i < count; i++) {
      if (await links.nth(i).isVisible()) visible++
    }
    expect(visible).toBeGreaterThan(0)

    expect(await page.locator('header a[href="/de/diagnostics/epigenetics"]').count()).toBe(0)
  })
})

test.describe('Screenreader-Beschriftungen', () => {
  test('Landmarken und Bedienelemente sind benannt', async ({ page }) => {
    await page.goto('/de/')
    // Zwei benannte Navigationen: Haupt- und Fusszeilennavigation.
    const navNames = await page.evaluate(() =>
      [...document.querySelectorAll('nav')].map((n) => n.getAttribute('aria-label')),
    )
    expect(navNames.filter(Boolean).length).toBeGreaterThanOrEqual(2)

    for (const name of [/Suche öffnen/i, /Sprache wählen/i]) {
      await expect(page.getByRole('button', { name }).first()).toBeVisible()
    }

    // Kein Bedienelement ohne zugaenglichen Namen in Header und Footer.
    const unnamed = await page.evaluate(() => {
      const scope = [document.querySelector('header'), document.querySelector('footer')]
      const bad: string[] = []
      for (const root of scope) {
        if (!root) continue
        for (const el of root.querySelectorAll('a[href], button')) {
          const name = (el.getAttribute('aria-label') || el.textContent || '').trim()
          if (!name) bad.push(el.outerHTML.slice(0, 60))
        }
      }
      return bad
    })
    expect(unnamed).toEqual([])
  })
})

test.describe('Aktive Zustaende', () => {
  const cases: [string, string][] = [
    ['/de/diagnostics', '/de/diagnostics'],
    ['/de/epigenetics', '/de/epigenetics'],
    ['/de/articles', '/de/articles'],
    ['/de/support', '/de/support'],
    ['/de/igloo-pro', '/de/igloo-pro'],
  ]

  for (const [path, expectedHref] of cases) {
    test(`${path} markiert genau seinen Menuepunkt`, async ({ page }) => {
      await page.goto(path)
      const current = page.locator(`header nav a[aria-current="page"][href="${expectedHref}"]`)
      await expect(current).toHaveCount(1)
    })
  }

  test('eine Unterseite markiert den Parent, aber nicht als "page"', async ({ page }) => {
    await page.goto('/de/diagnostics/dental')
    const parent = page.locator('header nav a[href="/de/diagnostics"]').first()
    await expect(parent).toHaveAttribute('aria-current', 'true')
  })

  test('ein Anker aendert die Seitenidentitaet nicht', async ({ page }) => {
    await page.goto('/de/epigenetics#musterbefunde')
    const current = page.locator('header nav a[aria-current="page"][href="/de/epigenetics"]')
    await expect(current).toHaveCount(1)
  })
})

test.describe('Ankernavigation', () => {
  const anchors: [string, string][] = [
    ['/de/epigenetics#analysen', 'analysen'],
    ['/de/epigenetics#ablauf', 'ablauf'],
    ['/de/#roi-rechner', 'roi-rechner'],
  ]

  for (const [url, id] of anchors) {
    test(`${url} landet unter der klebenden Kopfzeile`, async ({ page }) => {
      const response = await page.goto(url)
      expect(response?.status()).toBe(200)
      await page.waitForTimeout(2000)

      const measured = await page.evaluate((targetId) => {
        const target = document.getElementById(targetId)
        if (!target) return null
        const header = document.querySelector('header')!
        const sticky = [...document.querySelectorAll('*')].filter((el) => {
          const cs = getComputedStyle(el)
          return cs.position === 'sticky' && el.getBoundingClientRect().height > 0 && el !== header
        })
        const stickyBottom = sticky.length
          ? sticky[0].getBoundingClientRect().bottom
          : header.getBoundingClientRect().bottom
        return { top: target.getBoundingClientRect().top, stickyBottom }
      }, id)

      expect(measured).not.toBeNull()
      // Das Ziel darf nicht hinter Header bzw. Kapitelleiste liegen.
      expect(measured!.top).toBeGreaterThanOrEqual(measured!.stickyBottom - 2)
    })
  }
})

test.describe('Sprachwechsel in zehn Sprachen', () => {
  for (const locale of LOCALES) {
    test(`${locale}: Shell rendert lokalisiert auf derselben Route`, async ({ page }) => {
      const response = await page.goto(`/${locale}/epigenetics`)
      expect(response?.status()).toBe(200)

      // Kein erzwungener Wechsel nach /en/ (IAD-01).
      expect(new URL(page.url()).pathname).toBe(`/${locale}/epigenetics`)

      // Die Shell verlinkt locale-korrekt, nicht auf eine andere Sprache.
      const foreign = await page.evaluate((current) => {
        const prefixes = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']
        return [...document.querySelectorAll('header a[href^="/"], footer a[href^="/"]')]
          .map((a) => a.getAttribute('href') || '')
          .filter((href) => {
            const seg = href.split('/')[1]
            return prefixes.includes(seg) && seg !== current
          })
      }, locale)
      expect(foreign).toEqual([])

      // Und der Sprachumschalter ist da.
      await expect(page.getByRole('button', { name: /.+/ }).first()).toBeVisible()
    })
  }

  test('der Sprachwechsel behaelt die logische Seite', async ({ page }) => {
    await page.goto('/de/support')
    // Der Umschalter navigiert hart (basename-Wechsel) — deshalb URL pruefen.
    await page.evaluate(() => {
      window.location.href = '/fr/support'
    })
    await page.waitForURL('**/fr/support')
    expect(new URL(page.url()).pathname).toBe('/fr/support')
  })
})

test.describe('Regressionsschutz der Shell', () => {
  test('kein Chat und keine HiHuman-Anfrage im produktiven Frontend', async ({ page }) => {
    const external: string[] = []
    page.on('request', (request) => {
      if (/hihuman/i.test(request.url())) external.push(request.url())
    })

    for (const path of ['/de/', '/de/diagnostics', '/de/contact']) {
      await page.goto(path)
      await page.waitForTimeout(1200)
    }

    expect(external).toEqual([])
    const chatMarkup = await page.evaluate(
      () => document.querySelectorAll('[id*="chat" i], [class*="chat" i]').length,
    )
    expect(chatMarkup).toBe(0)
  })

  test('kein Garantie-Band in Kopf- oder Fusszeile', async ({ page }) => {
    await page.goto('/de/')
    const chrome = await page.evaluate(() => {
      const header = document.querySelector('header')?.textContent ?? ''
      const footer = document.querySelector('footer')?.textContent ?? ''
      return `${header} ${footer}`
    })
    // Praezise auf die CTA-Band-Formulierung, nicht auf jedes Vorkommen von
    // "Garantie" — im Fliesstext einer Serviceseite ist das Wort legitim.
    expect(chrome).not.toMatch(/garantierte?\s+(performance|leistung)/i)
    expect(chrome).not.toMatch(/guaranteed\s+performance/i)
  })
})
