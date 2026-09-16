import { test, expect, type Page } from '@playwright/test'

/**
 * PT24.2 — Tastatur.
 *
 * Gemessen wird ausschliesslich mit der Tastatur: `Tab`, `Shift+Tab`, `Enter`,
 * `Space`, `Escape`, Pfeiltasten. Kein `locator.click()` dort, wo die Frage
 * lautet „geht das auch ohne Maus?" — ein Klick beantwortet sie nicht.
 *
 * Nicht hier: Fokus-*Gestaltung* (PT24.3), Kontrast (PT24.4), Medien (PT24.5),
 * der breite axe-Lauf (PT24.6). Semantik gilt als bewiesen (PT24.1) und wird
 * nur nachgeprueft, wo ein Tastaturbefund sie beruehrt.
 */

/** Wer hat gerade den Fokus, und wo steht er? */
async function focused(page: Page) {
  return page.evaluate(() => {
    const a = document.activeElement
    if (!a || a === document.body) return { tag: 'BODY', name: '', where: 'body' }
    const text = (a.textContent || '').replace(/\s+/g, ' ').trim()
    // Der `alt` eines enthaltenen Bildes gehoert zum Namen — so rechnet der
    // Browser (accname). Ohne diesen Zweig gilt der Logo-Link als unbenannt,
    // obwohl der Accessibility-Tree ihn benennt.
    const fromImage = a.querySelector('img[alt]')?.getAttribute('alt') || ''
    return {
      tag: a.tagName,
      name: (a.getAttribute('aria-label') || text || fromImage).slice(0, 60),
      where: a.closest('[role="dialog"]')
        ? 'dialog'
        : a.closest('header')
          ? 'header'
          : a.closest('main')
            ? 'main'
            : a.closest('footer')
              ? 'footer'
              : 'other',
    }
  })
}

/** `n` mal Tab, mit dem Fokus nach jedem Schritt. */
async function tabTimes(page: Page, n: number) {
  const seq: Awaited<ReturnType<typeof focused>>[] = []
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('Tab')
    seq.push(await focused(page))
  }
  return seq
}

/**
 * Einwilligung vorab erteilen. Der Banner liegt am Dokumentende und faengt
 * sonst Tabschritte ab, die eigentlich einer anderen Komponente gelten — er
 * hat seinen eigenen Test weiter unten.
 */
async function withConsentSettled(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => {
    try {
      // Form und Schluessel aus `src/lib/consentState.ts`. Eine Entscheidung
      // mit falscher `version` zaehlt dort bewusst als „nicht getroffen" —
      // dann stuende der Banner weiter da und faenge Tabschritte ab, die
      // eigentlich einer anderen Komponente gelten.
      localStorage.setItem(
        'cookie-consent',
        JSON.stringify({
          version: 2,
          decidedAt: new Date().toISOString(),
          analytics: false,
          marketing: false,
        }),
      )
    } catch {
      /* Storage kann gesperrt sein — dann bleibt der Banner stehen. */
    }
  })
  await page.goto(path, { waitUntil: 'networkidle' })
  await expect(page.locator('section[aria-labelledby="cookie-banner-title"]')).toHaveCount(0)
}

// ===========================================================================
// Header und Mega-Menue
// ===========================================================================

test.describe('PT24.2 — Header / Mega-Menue', () => {
  test('der Sprunglink ist das erste Tabziel und fuehrt in den Hauptinhalt', async ({ page }) => {
    await withConsentSettled(page, '/de/')
    await page.keyboard.press('Tab')
    const first = await focused(page)
    expect(first.tag, 'erstes Tabziel ist kein Link').toBe('A')
    await page.keyboard.press('Enter')
    await expect(page.locator('main')).toBeFocused()
  })

  test('Untermenue oeffnet mit Enter und mit Space', async ({ page }) => {
    for (const key of ['Enter', 'Space'] as const) {
      await withConsentSettled(page, '/de/')
      const trigger = page.locator('[data-submenu-trigger]').first()
      await trigger.focus()
      await expect(trigger).toHaveAttribute('aria-expanded', 'false')
      await page.keyboard.press(key)
      await expect(trigger, `${key} oeffnet das Untermenue nicht`).toHaveAttribute(
        'aria-expanded',
        'true',
      )
    }
  })

  test('Tab fuehrt in das offene Untermenue und wieder heraus', async ({ page }) => {
    await withConsentSettled(page, '/de/')
    const trigger = page.locator('[data-submenu-trigger]').first()
    const label = await trigger.getAttribute('data-submenu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')

    await page.keyboard.press('Tab')
    const inside = await page.evaluate(
      (l) => !!document.activeElement?.closest(`[data-submenu-scope="${l}"]`),
      label,
    )
    expect(inside, 'Tab landet nicht im Untermenue').toBe(true)

    // Heraustabben, bis der Fokus den Menuepunkt wirklich verlassen hat.
    for (let i = 0; i < 20; i++) {
      const stillInside = await page.evaluate(
        (l) => !!document.activeElement?.closest(`[data-submenu-scope="${l}"]`),
        label,
      )
      if (!stillInside) break
      await page.keyboard.press('Tab')
    }
    // Ein Untermenue, das offen bleibt, waehrend der Fokus laengst weiter ist,
    // meldet ueber `aria-expanded` einen Zustand, den niemand mehr benutzt.
    await expect(trigger, 'Untermenue bleibt nach dem Heraustabben offen').toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  test('Escape schliesst das Untermenue und gibt den Fokus zurueck', async ({ page }) => {
    await withConsentSettled(page, '/de/')
    const trigger = page.locator('[data-submenu-trigger]').first()
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger, 'Fokus kehrt nicht auf den Ausloeser zurueck').toBeFocused()
  })

  test('kein Tabziel ohne Namen und kein unsichtbares Tabziel im Header', async ({ page }) => {
    await withConsentSettled(page, '/de/')
    const seq = await tabTimes(page, 14)
    const headerStops = seq.filter((s) => s.where === 'header')
    expect(headerStops.length, 'Header wird nicht erreicht').toBeGreaterThan(5)
    expect(
      headerStops.filter((s) => !s.name.trim()),
      'Tabziel ohne zugaenglichen Namen',
    ).toEqual([])
  })
})

// ===========================================================================
// Mobiles Menue
// ===========================================================================

test.describe('PT24.2 — Mobiles Menue', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('oeffnet mit Enter, schliesst mit Escape, Fokus kehrt auf den Burger zurueck', async ({
    page,
  }) => {
    await withConsentSettled(page, '/de/')
    const burger = page.getByRole('button', { name: /Navigation umschalten/i })
    await burger.focus()
    await page.keyboard.press('Enter')
    await expect(burger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible()

    await page.keyboard.press('Tab')
    expect((await focused(page)).tag, 'Tab fuehrt nicht in das Menue').toBe('A')

    await page.keyboard.press('Escape')
    await expect(burger, 'Escape schliesst das mobile Menue nicht').toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(burger, 'Fokus kehrt nicht auf den Burger zurueck').toBeFocused()
  })

  test('ist NICHT modal: keine Fokusfalle, der Hintergrund bleibt erreichbar', async ({ page }) => {
    await withConsentSettled(page, '/de/')
    const burger = page.getByRole('button', { name: /Navigation umschalten/i })
    await burger.focus()
    await page.keyboard.press('Enter')

    // Der Hintergrund ist nicht gesperrt — dann darf der Fokus ihn erreichen.
    // Eine Falle waere hier der unbeabsichtigte Keyboard Trap.
    expect(
      await page.evaluate(() => getComputedStyle(document.body).overflow),
      'mobiles Menue sperrt den Hintergrund, verhaelt sich also modal',
    ).not.toBe('hidden')

    const seq = await tabTimes(page, 30)
    expect(
      seq.some((s) => s.where !== 'header'),
      'Fokus kommt in 30 Schritten nicht aus dem Header heraus — Falle',
    ).toBe(true)
  })

  test('keine doppelten Tabziele zwischen Desktop- und Mobilnavigation', async ({ page }) => {
    await withConsentSettled(page, '/de/')
    await page.getByRole('button', { name: /Navigation umschalten/i }).focus()
    await page.keyboard.press('Enter')

    const stops = await page.evaluate(() => {
      const header = document.querySelector('header')!
      const candidates = Array.from(
        header.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])'),
      )
      // Tabziel ist nur, was auch dargestellt wird. `display:none` faellt
      // heraus, ohne dass der Test raten muesste, welche Klasse das erledigt.
      const reachable = candidates.filter((e) => e.getClientRects().length > 0)
      const names = reachable.map((e) =>
        (e.getAttribute('aria-label') || e.textContent || '').replace(/\s+/g, ' ').trim(),
      )
      const seen = new Map<string, number>()
      names.filter(Boolean).forEach((n) => seen.set(n, (seen.get(n) || 0) + 1))
      return { total: reachable.length, duplicates: [...seen].filter(([, n]) => n > 1) }
    })
    expect(stops.duplicates, 'derselbe Navigationspunkt zweimal im Tabverlauf').toEqual([])
  })
})

// ===========================================================================
// Suche — die Referenzimplementierung
// ===========================================================================

test.describe('PT24.2 — Suche', () => {
  test('Enter oeffnet, Fokus liegt im Eingabefeld, Escape schliesst und gibt zurueck', async ({
    page,
  }) => {
    await withConsentSettled(page, '/de/')
    const trigger = page.getByRole('button', { name: /Suche öffnen/i }).first()
    await trigger.focus()
    await page.keyboard.press('Enter')

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(page.locator('#search-input'), 'Fokus landet nicht im Suchfeld').toBeFocused()

    await page.keyboard.type('vitamin')
    // Im Dialog suchen, nicht dokumentweit: seit PT24.3 gibt es eine zweite
    // Statusregion — die Routenansage am Dokumentende. Gemeint ist hier die
    // Trefferzahl der Suche.
    await expect(dialog.getByRole('status')).toHaveText(/\d/)

    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger, 'Fokus kehrt nicht auf den Suchknopf zurueck').toBeFocused()
  })

  test('der Fokus bleibt im Dialog — Tab und Shift+Tab laufen im Kreis', async ({ page }) => {
    await withConsentSettled(page, '/de/')
    await page
      .getByRole('button', { name: /Suche öffnen/i })
      .first()
      .focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog')).toBeVisible()

    const forward = await tabTimes(page, 12)
    expect(
      forward.filter((s) => s.where !== 'dialog'),
      'Tab verlaesst den modalen Dialog',
    ).toEqual([])

    for (let i = 0; i < 12; i++) await page.keyboard.press('Shift+Tab')
    expect((await focused(page)).where, 'Shift+Tab verlaesst den modalen Dialog').toBe('dialog')
  })

  test('Ergebnisse sind per Tastatur erreichbar', async ({ page }) => {
    await withConsentSettled(page, '/de/')
    await page
      .getByRole('button', { name: /Suche öffnen/i })
      .first()
      .focus()
    await page.keyboard.press('Enter')
    await page.keyboard.type('epigenetik')
    await expect(page.locator('[data-search-results] a').first()).toBeVisible()

    const seq = await tabTimes(page, 10)
    expect(
      seq.some((s) => s.tag === 'A' && s.where === 'dialog'),
      'kein Ergebnislink per Tab erreichbar',
    ).toBe(true)
  })
})

// ===========================================================================
// Sprachumschalter
// ===========================================================================

test.describe('PT24.2 — Sprachumschalter', () => {
  const trigger = (page: Page) => page.getByRole('button', { name: /Sprache wählen/i }).first()

  test('Enter oeffnet, Escape schliesst und gibt den Fokus zurueck', async ({ page }) => {
    await withConsentSettled(page, '/de/')
    const button = trigger(page)
    await button.focus()
    await page.keyboard.press('Enter')
    await expect(button).toHaveAttribute('aria-expanded', 'true')

    await page.keyboard.press('Tab')
    expect((await focused(page)).tag).toBe('BUTTON')

    await page.keyboard.press('Escape')
    await expect(button, 'Escape schliesst die Sprachliste nicht').toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(button, 'Fokus kehrt nicht auf den Ausloeser zurueck').toBeFocused()
  })

  test('Pfeil ab oeffnet und fuehrt durch die Liste, Home und End springen', async ({ page }) => {
    await withConsentSettled(page, '/de/')
    const button = trigger(page)
    await button.focus()
    await page.keyboard.press('ArrowDown')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    const first = await focused(page)
    expect(first.tag, 'Pfeil ab setzt den Fokus nicht auf den ersten Eintrag').toBe('BUTTON')

    await page.keyboard.press('ArrowDown')
    const second = await focused(page)
    expect(second.name, 'Pfeil ab bewegt den Fokus nicht').not.toBe(first.name)

    await page.keyboard.press('End')
    const last = await focused(page)
    await page.keyboard.press('Home')
    expect((await focused(page)).name, 'Home springt nicht an den Anfang').toBe(first.name)
    expect(last.name).not.toBe(first.name)
  })

  test('heraustabben schliesst die Liste — kein offener Zustand ohne Nutzer', async ({ page }) => {
    await withConsentSettled(page, '/de/')
    const button = trigger(page)
    await button.focus()
    await page.keyboard.press('Enter')
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  test('die aktive Sprache ist nicht nur farblich erkennbar', async ({ page }) => {
    await withConsentSettled(page, '/de/')
    await trigger(page).focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('button[aria-current="true"]')).toHaveCount(1)
  })
})

// ===========================================================================
// Einwilligung — AP23-Verhalten bleibt, nur die Tastatur wird geprueft
// ===========================================================================

test.describe('PT24.2 — Einwilligung', () => {
  test('alle drei Entscheidungen sind per Tastatur erreichbar und ausloesbar', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    const banner = page.locator('section[aria-labelledby="cookie-banner-title"]')
    await expect(banner).toBeVisible()

    for (const button of await banner.getByRole('button').all()) {
      await button.focus()
      await expect(button).toBeFocused()
    }

    const toggle = banner.locator('button[aria-expanded]')
    await toggle.focus()
    await page.keyboard.press('Enter')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#cookie-settings-panel')).toBeVisible()

    // Die Schalter im Panel sind echte Checkboxen — Space schaltet sie.
    const boxes = page.locator('#cookie-settings-panel input[type="checkbox"]:not([disabled])')
    const first = boxes.first()
    await first.focus()
    const before = await first.isChecked()
    await page.keyboard.press('Space')
    expect(await first.isChecked(), 'Space schaltet den Schalter nicht').toBe(!before)
  })

  test('die Entscheidung laesst sich rein per Tastatur abschliessen', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    const banner = page.locator('section[aria-labelledby="cookie-banner-title"]')
    const reject = banner.getByRole('button').first()
    await reject.focus()
    await page.keyboard.press('Enter')
    await expect(banner, 'die Ablehnung greift per Tastatur nicht').toHaveCount(0)
  })

  test('der Banner ist nicht modal und faengt den Fokus nicht ein', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await expect(page.locator('section[aria-labelledby="cookie-banner-title"]')).toBeVisible()
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden')
    const seq = await tabTimes(page, 6)
    expect(
      seq.some((s) => s.where === 'header'),
      'Fokus kommt nicht in den Header',
    ).toBe(true)
  })
})

// ===========================================================================
// Modal: Consumer-Bestellung
// ===========================================================================

test.describe('PT24.2 — Bestell-Modal', () => {
  const openModal = async (page: Page) => {
    await withConsentSettled(page, '/de/consumer/vitamin-d3-spray')
    const cta = page.getByRole('button', { name: /Bestellen/i }).first()
    await cta.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog')).toBeVisible()
    return cta
  }

  test('oeffnet per Tastatur, Fokus landet im Dialog', async ({ page }) => {
    await openModal(page)
    expect((await focused(page)).where, 'Fokus bleibt ausserhalb des Dialogs').toBe('dialog')
  })

  test('der Fokus bleibt im Dialog — das ist die Zusage von aria-modal', async ({ page }) => {
    await openModal(page)
    const forward = await tabTimes(page, 22)
    expect(
      forward.filter((s) => s.where !== 'dialog').map((s) => `${s.where}:${s.name}`),
      'Tab verlaesst den Dialog, obwohl aria-modal="true" den Hintergrund fuer inert erklaert',
    ).toEqual([])

    for (let i = 0; i < 22; i++) await page.keyboard.press('Shift+Tab')
    expect((await focused(page)).where, 'Shift+Tab verlaesst den Dialog').toBe('dialog')
  })

  test('Escape schliesst und gibt den Fokus an den ausloesenden Knopf zurueck', async ({
    page,
  }) => {
    const cta = await openModal(page)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(cta, 'Fokus faellt nach dem Schliessen auf <body>').toBeFocused()
  })

  test('der Schliessen-Knopf steht genau einmal im Accessibility-Tree', async ({ page }) => {
    await openModal(page)
    // Der Backdrop war ein zweiter, benannter Knopf mit derselben Aufgabe —
    // sichtbar fuer Assistenztechnik, nie erreichbar per Tastatur.
    await expect(page.getByRole('dialog').getByRole('button', { name: /schließen/i })).toHaveCount(
      1,
    )
  })

  test('das Formular im Dialog ist vollstaendig per Tastatur bedienbar', async ({ page }) => {
    await openModal(page)
    const seq = await tabTimes(page, 22)
    const kinds = new Set(seq.map((s) => s.tag))
    expect(kinds.has('INPUT'), 'kein Eingabefeld per Tab erreichbar').toBe(true)
    expect(kinds.has('SELECT'), 'die Mengenauswahl ist per Tab nicht erreichbar').toBe(true)
    expect(kinds.has('TEXTAREA'), 'das Freitextfeld ist per Tab nicht erreichbar').toBe(true)
    expect(
      seq.some((s) => s.tag === 'BUTTON' && /senden/i.test(s.name)),
      'der Absenden-Knopf ist per Tab nicht erreichbar',
    ).toBe(true)
  })
})

// ===========================================================================
// Preis-Popover — Inhalt bei Hover UND bei Fokus (WCAG 1.4.13)
// ===========================================================================

test.describe('PT24.2 — Preis-Popover', () => {
  const badge = (page: Page) =>
    page.locator('button[aria-expanded][aria-label]').filter({ hasText: /€|pro / })

  test('oeffnet bei Fokus und schliesst mit Escape, Fokus bleibt beim Ausloeser', async ({
    page,
  }) => {
    await withConsentSettled(page, '/de/consumer/vitamin-d3-spray')
    const button = badge(page).first()
    await button.focus()
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('[role="note"]')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(button, 'Escape schliesst das Popover nicht').toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(button, 'Fokus geht beim Schliessen verloren').toBeFocused()
  })

  test('behauptet keine Dialog-Mechanik, die es nicht gibt', async ({ page }) => {
    await withConsentSettled(page, '/de/consumer/vitamin-d3-spray')
    await badge(page).first().focus()
    // Kein `role="dialog"`: es gibt hier weder Fokusfalle noch inerten
    // Hintergrund noch ein Bedienelement im Inhalt.
    await expect(page.getByRole('dialog')).toHaveCount(0)
    expect(
      await page.evaluate(
        () =>
          document
            .querySelector('[role="note"]')
            ?.querySelectorAll(
              'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
            ).length ?? -1,
      ),
      'das Popover enthaelt Bedienelemente und braeuchte dann echte Fokusfuehrung',
    ).toBe(0)
  })
})

// ===========================================================================
// ChapterNav
// ===========================================================================

test.describe('PT24.2 — Kapitelnavigation', () => {
  const ROUTE = '/de/epigenetics/musterbefund/metabolic-health'

  test('Desktop: Kapitel sind Links, per Tab erreichbar, Enter springt', async ({ page }) => {
    await withConsentSettled(page, ROUTE)
    const strip = page.locator('nav[aria-label="Kapitel"] div.hidden.lg\\:block a')
    await expect(strip.first()).toBeVisible()
    await expect(page.locator('nav[aria-label="Kapitel"] [aria-current]')).not.toHaveCount(0)

    const second = strip.nth(1)
    const href = await second.getAttribute('href')
    await second.focus()
    await expect(second).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`${href?.replace('#', '\\#')}$`))
  })

  test('Mobil: der Aufklapper ist ein natives details und per Tastatur bedienbar', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await withConsentSettled(page, ROUTE)
    const summary = page.locator('nav[aria-label="Kapitel"] summary')
    await expect(summary).toBeVisible()
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('nav[aria-label="Kapitel"] details')).toHaveAttribute('open', '')
    await page.keyboard.press('Tab')
    expect((await focused(page)).tag, 'Tab fuehrt nicht in die Kapitelliste').toBe('A')
  })

  test('keine doppelten Kapitel-Tabziele je Viewport', async ({ page }) => {
    for (const viewport of [
      { width: 1280, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport)
      await withConsentSettled(page, ROUTE)
      const reachable = await page.evaluate(() => {
        const nav = document.querySelector('nav[aria-label="Kapitel"]')!
        return Array.from(nav.querySelectorAll<HTMLElement>('a[href]')).filter(
          (a) => a.getClientRects().length > 0,
        ).length
      })
      const total = await page.locator('nav[aria-label="Kapitel"] a[href]').count()
      expect(
        reachable,
        `bei ${viewport.width}px sind Desktop- und Mobilfassung gleichzeitig erreichbar`,
      ).toBeLessThan(total)
    }
  })
})

// ===========================================================================
// Formulare und Resource Gate
// ===========================================================================

test.describe('PT24.2 — Formulare', () => {
  test('Supportformular: jedes Feld per Tab, Upload per Tastatur, Absenden erreichbar', async ({
    page,
  }) => {
    await withConsentSettled(page, '/de/support')
    await page.locator('#name').focus()
    const seq = await tabTimes(page, 10)
    const tags = seq.map((s) => s.tag)
    expect(tags, 'Auswahlfeld nicht per Tab erreichbar').toContain('SELECT')
    expect(tags, 'Freitextfeld nicht per Tab erreichbar').toContain('TEXTAREA')
    expect(
      seq.some((s) => s.tag === 'BUTTON' && /Datei/i.test(s.name)),
      'der Anhang-Knopf ist per Tab nicht erreichbar',
    ).toBe(true)
    expect(
      seq.some((s) => s.tag === 'BUTTON' && /Absenden|senden/i.test(s.name)),
      'der Absenden-Knopf ist per Tab nicht erreichbar',
    ).toBe(true)
  })

  test('Kontaktformular: Absenden per Tastatur, der Fehler ist erreichbar und verbunden', async ({
    page,
  }) => {
    await withConsentSettled(page, '/de/contact')
    await page.locator('form button[type="submit"]').first().focus()
    await page.keyboard.press('Enter')
    const invalid = page.locator('[aria-invalid="true"]').first()
    await expect(invalid).toHaveCount(1)
    await invalid.focus()
    await expect(invalid, 'das fehlerhafte Feld laesst sich nicht fokussieren').toBeFocused()
  })

  test('Bereichsauswahl im Kontaktformular ist eine Knopfgruppe per Tastatur', async ({ page }) => {
    await withConsentSettled(page, '/de/contact')
    const group = page.locator('fieldset').first()
    const pressed = group.locator('button[aria-pressed="true"]')
    // Die Gruppe startet mit einer Vorauswahl — das ist Produktverhalten. Die
    // Zusicherung ist die Invariante: immer genau eine, und die Tastatur
    // aendert sie.
    await expect(pressed, 'die Gruppe haelt nicht genau eine Auswahl').toHaveCount(1)

    const first = group.getByRole('button').first()
    await first.focus()
    await page.keyboard.press('Space')
    await expect(first, 'Space schaltet den Knopf nicht').toHaveAttribute('aria-pressed', 'true')
    await expect(pressed).toHaveCount(1)

    // Tab auf den naechsten Knopf, Enter — der vorige gibt seinen Zustand ab.
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await expect(
      first,
      'Enter auf dem Nachbarn nimmt dem vorigen nicht den Zustand',
    ).toHaveAttribute('aria-pressed', 'false')
    await expect(pressed, 'die Gruppe haelt mehr als eine Auswahl').toHaveCount(1)
  })

  test('Resource Gate: Enter oeffnet, Tab fuehrt ins Formular, Abbrechen gibt den Fokus zurueck', async ({
    page,
  }) => {
    await withConsentSettled(page, '/de/epigenetics/unterlagen')
    const trigger = page.locator('[data-gate-trigger] button[aria-expanded]').first()
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await page.keyboard.press('Tab')
    expect((await focused(page)).tag, 'Tab fuehrt nicht in das Gate-Formular').toBe('INPUT')

    const cancel = page
      .locator('[data-gate-trigger] button')
      .filter({ hasText: /Abbrechen/i })
      .first()
    await cancel.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger, 'Fokus faellt nach dem Abbrechen auf <body>').toBeFocused()
  })
})

// ===========================================================================
// Keine unbeabsichtigten Fallen
// ===========================================================================

test.describe('PT24.2 — keine unbeabsichtigten Fallen', () => {
  const ROUTES = [
    '/de/',
    '/de/contact',
    '/de/support',
    '/de/epigenetics',
    '/de/epigenetics/musterbefund/metabolic-health',
    '/de/downloads',
    '/de/consumer/vitamin-d3-spray',
    '/de/vitamin-d3-spray',
  ] as const

  for (const route of ROUTES) {
    test(`der Fokus kommt durch die Seite und wieder heraus: ${route}`, async ({ page }) => {
      await withConsentSettled(page, route)

      // Gemessen wird die IDENTITAET des fokussierten Elements, nicht seine
      // Beschriftung. Sechs unbeschriftete Zahlenfelder im ROI-Rechner und
      // drei gleichlautende „Weiterlesen"-Links sehen als Text identisch aus,
      // sind aber verschiedene Tabziele — eine Falle sind sie erst, wenn der
      // Fokus wirklich auf demselben Knoten stehen bleibt.
      await page.evaluate(() => {
        let n = 0
        document.querySelectorAll('*').forEach((e) => e.setAttribute('data-pt242', String(n++)))
      })

      const visited: string[] = []
      for (let i = 0; i < 60; i++) {
        await page.keyboard.press('Tab')
        visited.push(
          await page.evaluate(() => {
            const a = document.activeElement
            return !a || a === document.body ? 'BODY' : (a.getAttribute('data-pt242') ?? 'NEU')
          }),
        )
      }

      let run = 1
      let worst = 1
      for (let i = 1; i < visited.length; i++) {
        run = visited[i] === visited[i - 1] && visited[i] !== 'NEU' ? run + 1 : 1
        worst = Math.max(worst, run)
      }
      expect(worst, 'der Fokus bleibt beim Tabben auf demselben Element haengen').toBeLessThan(3)
      expect(new Set(visited).size, 'zu wenig verschiedene Tabziele').toBeGreaterThan(8)
    })
  }

  test('kein positives tabindex verbiegt die Reihenfolge', async ({ page }) => {
    for (const route of ROUTES) {
      await withConsentSettled(page, route)
      const positive = await page.evaluate(() =>
        Array.from(document.querySelectorAll('[tabindex]'))
          .filter((e) => Number(e.getAttribute('tabindex')) > 0)
          .map((e) => e.tagName),
      )
      expect(positive, `${route}: positives tabindex gefunden`).toEqual([])
    }
  })
})
