import { test, expect, type Page } from '@playwright/test'

/**
 * PT24.1 — Semantik.
 *
 * Diese Datei sichert die semantische Grundstruktur der oeffentlichen Website:
 * Landmarks, Ueberschriftenhierarchie, Listen/Tabellen, Button-gegen-Link,
 * Formularbeschriftungen, Fehlerbeziehungen, Statusmeldungen und die Frage, ob
 * ARIA hier etwas Wahres behauptet.
 *
 * Bewusst KEIN breiter axe-Lauf — der ist PT24.6. Und bewusst keine
 * Tastatur-/Fokus-/Kontrastpruefung: PT24.2 bis PT24.4. Was hier steht, ist
 * Dokumentstruktur, und die ist im SSR-DOM vollstaendig sichtbar.
 */

/** Repraesentative Routenmatrix: jede Shell, jedes Seitentemplate, jede Formularfamilie. */
const ROUTES = [
  '/de/',
  '/de/about',
  '/de/articles',
  '/de/articles/der-unsichtbare-patient',
  '/de/diagnostics',
  '/de/diagnostics/dental',
  '/de/contact',
  '/de/support',
  '/de/privacy',
  '/de/imprint',
  '/de/terms',
  '/de/events',
  '/de/igloo-pro',
  '/de/vitamin-d3-implantologie',
  '/de/s3_leitlinie',
  '/de/vitamin-d3-spray',
  '/de/epigenetics',
  '/de/epigenetics/grundlagen',
  '/de/epigenetics/studienlage',
  '/de/epigenetics/unterlagen',
  '/de/epigenetics/musterbefund/metabolic-health',
  '/de/downloads',
  '/de/consumer/vitamin-d3-spray',
  '/de/consumer/hydrating-masks',
  '/de/consumer/inside-out-duo',
  '/de/gibt-es-nicht',
] as const

/**
 * Alles, was ein Test ueber die Dokumentstruktur wissen muss, in EINER
 * Auswertung im Browser. Ein zweiter Seitenaufruf je Zusicherung waere
 * 26 Routen x N Ladevorgaenge — die Messung bliebe dieselbe.
 */
async function structure(page: Page) {
  return page.evaluate(() => {
    const txt = (e: Element) => (e.textContent || '').replace(/\s+/g, ' ').trim()
    const sel = (s: string) => Array.from(document.querySelectorAll(s))
    const visible = (e: Element) => {
      const st = getComputedStyle(e)
      return st.display !== 'none' && st.visibility !== 'hidden' && e.getClientRects().length > 0
    }
    /**
     * Nur so viel Namensberechnung, wie die Zusicherungen hier brauchen:
     * aria-label, aria-labelledby, verknuepftes oder umschliessendes <label>,
     * eigener Textinhalt. Keine vollstaendige accname-Implementierung — die
     * Faelle, die daraus haetten entstehen koennen, sind unten explizit
     * ausgeschlossen (kein title-Fallback, keine verschachtelten Bilder ohne alt).
     */
    const accName = (e: Element): string => {
      const al = e.getAttribute('aria-label')
      if (al?.trim()) return al.trim()
      const ab = e.getAttribute('aria-labelledby')
      if (ab) {
        const t = ab
          .split(/\s+/)
          .map((id) => document.getElementById(id))
          .filter(Boolean)
          .map((n) => txt(n as Element))
          .join(' ')
          .trim()
        if (t) return t
      }
      if (e.id) {
        const lab = document.querySelector(`label[for="${CSS.escape(e.id)}"]`)
        if (lab) return txt(lab)
      }
      const wrap = e.closest('label')
      if (wrap) return txt(wrap)
      const own = txt(e)
      if (own) return own
      const img = e.querySelector('img[alt]')
      return img?.getAttribute('alt')?.trim() || ''
    }

    const IMPLICIT: Record<string, string> = {
      NAV: 'navigation',
      HEADER: 'banner',
      FOOTER: 'contentinfo',
      MAIN: 'main',
      BUTTON: 'button',
      UL: 'list',
      OL: 'list',
      LI: 'listitem',
      FORM: 'form',
      TABLE: 'table',
      ARTICLE: 'article',
      ASIDE: 'complementary',
      IMG: 'img',
      H1: 'heading',
      H2: 'heading',
      H3: 'heading',
      H4: 'heading',
    }

    return {
      mains: sel('main, [role="main"]').length,
      headings: sel('h1,h2,h3,h4,h5,h6').map((h) => ({
        level: Number(h.tagName[1]),
        text: txt(h),
        visible: visible(h),
      })),
      navs: sel('nav, [role="navigation"]').map((n) => ({ name: accName(n), visible: visible(n) })),
      banners: sel('header').filter((h) => !h.closest('main,article,aside,section,nav')).length,
      contentinfos: sel('footer').filter((f) => !f.closest('main,article,aside,section,nav'))
        .length,
      controls: sel('input, select, textarea')
        .filter((c) => (c as HTMLInputElement).type !== 'hidden')
        .filter((c) => !c.closest('[aria-hidden="true"], [aria-hidden]'))
        .map((c) => ({ tag: c.tagName.toLowerCase(), id: c.id, name: accName(c) })),
      namelessInteractive: sel('button, [role="button"], a[href]')
        .filter((e) => !e.closest('[aria-hidden="true"]'))
        .filter((e) => visible(e) && !accName(e))
        .map(
          (e) =>
            e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).slice(0, 40) : ''),
        ),
      clickableNonInteractive: sel(
        'div[onclick], span[onclick], div[role="link"], span[role="link"]',
      ).length,
      pseudoButtonLinks: sel('a[href="#"], a[href=""], a[role="button"]').length,
      redundantRoles: sel('[role]')
        .filter((e) => IMPLICIT[e.tagName] === e.getAttribute('role'))
        .map((e) => `${e.tagName.toLowerCase()}[role=${e.getAttribute('role')}]`),
      danglingRefs: ['aria-controls', 'aria-labelledby', 'aria-describedby'].flatMap((attr) =>
        sel(`[${attr}]`)
          .filter((e) =>
            (e.getAttribute(attr) || '')
              .split(/\s+/)
              .filter(Boolean)
              .some((id) => !document.getElementById(id)),
          )
          .map((e) => `${e.tagName.toLowerCase()}[${attr}=${e.getAttribute(attr)}]`),
      ),
      duplicateIds: (() => {
        const c: Record<string, number> = {}
        sel('[id]').forEach((e) => (c[e.id] = (c[e.id] || 0) + 1))
        return Object.entries(c)
          .filter(([, n]) => n > 1)
          .map(([id]) => id)
      })(),
      listsWithForeignChildren: sel('ul, ol').filter((l) =>
        Array.from(l.children).some((c) => !['LI', 'SCRIPT', 'TEMPLATE'].includes(c.tagName)),
      ).length,
      tables: sel('table').map((t) => ({
        headerCells: t.querySelectorAll('th').length,
        scopedHeaderCells: t.querySelectorAll('th[scope]').length,
        named: !!t.querySelector('caption') || !!accName(t),
        layoutRole: t.getAttribute('role') || '',
      })),
      imagesWithoutAlt: sel('img:not([alt])').length,
    }
  })
}

test.describe('PT24.1 — Landmarks', () => {
  for (const route of ROUTES) {
    test(`genau ein main, ein banner, ein contentinfo: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' })
      const s = await structure(page)
      expect(s.mains, 'genau ein <main> je Seite').toBe(1)
      expect(s.banners, 'genau ein Seiten-<header>').toBe(1)
      expect(s.contentinfos, 'genau ein Seiten-<footer>').toBe(1)
    })
  }

  test('jedes Navigations-Landmark traegt einen Namen', async ({ page }) => {
    const unnamed: string[] = []
    for (const route of ROUTES) {
      await page.goto(route, { waitUntil: 'networkidle' })
      const s = await structure(page)
      // Mehrere Navigationsbereiche pro Seite sind normal (Haupt-, Fuss-,
      // Brotkrumen-, Kapitelnavigation). Unterscheidbar sind sie nur ueber
      // ihren Namen — ohne ihn heissen im Screenreader alle "Navigation".
      s.navs.filter((n) => !n.name).forEach(() => unnamed.push(route))
      // Ein uebersetzter Name, kein durchgereichter i18n-Schluessel.
      for (const n of s.navs) {
        expect(n.name, `${route}: Navigationsname ist ein i18n-Schluessel`).not.toMatch(
          /^[a-z0-9_]+(\.[a-z0-9_]+)+$/,
        )
      }
    }
    expect(unnamed, 'Navigations-Landmarks ohne Namen').toEqual([])
  })

  test('mobiles Menue ist ein Navigations-Landmark', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /Navigation umschalten/i }).click()
    const nav = page.getByRole('navigation', { name: 'Hauptnavigation' })
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link', { name: /Diagnostik/i }).first()).toBeVisible()
  })
})

test.describe('PT24.1 — Ueberschriftenstruktur', () => {
  for (const route of ROUTES) {
    test(`genau eine h1, keine uebersprungene Ebene: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' })
      const { headings } = await structure(page)

      const h1 = headings.filter((h) => h.level === 1)
      expect(h1.length, 'genau eine h1 je Seite').toBe(1)
      expect(h1[0].text.length, 'h1 ist nicht leer').toBeGreaterThan(0)

      expect(
        headings.filter((h) => !h.text.trim()),
        'leere Ueberschriften',
      ).toEqual([])

      const skips: string[] = []
      let prev = 0
      for (const h of headings.filter((h) => h.visible)) {
        if (prev && h.level > prev + 1) skips.push(`h${prev} -> h${h.level} bei "${h.text}"`)
        prev = h.level
      }
      expect(skips, 'uebersprungene Ueberschriftenebenen').toEqual([])
    })
  }
})

test.describe('PT24.1 — Listen, Tabellen, Buttons gegen Links', () => {
  for (const route of ROUTES) {
    test(`native Strukturen: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' })
      const s = await structure(page)

      expect(s.listsWithForeignChildren, 'Listen mit Nicht-li-Kindern').toBe(0)
      expect(s.clickableNonInteractive, 'anklickbare div/span statt Button oder Link').toBe(0)
      expect(s.pseudoButtonLinks, 'Link als Pseudo-Button (href="#" / role=button)').toBe(0)
      expect(s.namelessInteractive, 'sichtbare Bedienelemente ohne Namen').toEqual([])
      expect(s.imagesWithoutAlt, 'Bilder ohne alt-Attribut').toBe(0)

      for (const t of s.tables) {
        expect(t.layoutRole, 'Tabelle mit ueberschriebener Rolle').not.toBe('presentation')
        expect(t.headerCells, 'Datentabelle ohne Kopfzellen').toBeGreaterThan(0)
        expect(t.scopedHeaderCells, 'Kopfzellen ohne scope').toBe(t.headerCells)
        expect(t.named, 'Tabelle ohne caption oder zugaenglichen Namen').toBe(true)
      }
    })
  }
})

test.describe('PT24.1 — ARIA behauptet nichts Falsches', () => {
  for (const route of ROUTES) {
    test(`keine redundanten Rollen, keine toten Verweise: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' })
      const s = await structure(page)
      expect(s.redundantRoles, 'Rolle wiederholt die native Semantik').toEqual([])
      expect(s.danglingRefs, 'aria-Verweis auf eine Id, die es nicht gibt').toEqual([])
      expect(s.duplicateIds, 'doppelte Ids im Dokument').toEqual([])
    })
  }

  test('aria-controls verschwindet, wenn das Ziel verschwindet', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await page.evaluate(() => localStorage.clear())
    await page.reload({ waitUntil: 'networkidle' })

    // Ueber den Zustand ausgewaehlt, nicht ueber die Beschriftung: die wechselt
    // beim Aufklappen und ist in zehn Sprachen ein anderer Text.
    const banner = page.locator('section[aria-labelledby="cookie-banner-title"]')
    const toggle = banner.locator('button[aria-expanded]')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(await toggle.getAttribute('aria-controls'), 'zugeklappt: kein Verweis').toBeNull()
    await expect(page.locator('#cookie-settings-panel')).toHaveCount(0)

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(toggle).toHaveAttribute('aria-controls', 'cookie-settings-panel')
    await expect(page.locator('#cookie-settings-panel')).toBeVisible()
  })
})

test.describe('PT24.1 — Formulare: Beschriftung, Pflicht, Fehler, Status', () => {
  const FORM_ROUTES = [
    '/de/contact',
    '/de/support',
    '/de/epigenetics',
    '/de/vitamin-d3-spray',
    '/de/vitamin-d3-implantologie',
    '/de/',
  ] as const

  for (const route of FORM_ROUTES) {
    test(`jedes Bedienelement hat einen Namen: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' })
      const { controls } = await structure(page)
      expect(controls.length, 'Route ohne Bedienelemente — Auswahl pruefen').toBeGreaterThan(0)
      expect(
        controls.filter((c) => !c.name),
        'Bedienelemente ohne Namen',
      ).toEqual([])
    })
  }

  test('Pflichtangabe steht im Attribut, nicht nur im Sternchen', async ({ page }) => {
    await page.goto('/de/vitamin-d3-spray', { waitUntil: 'networkidle' })
    const starred = await page.evaluate(() =>
      Array.from(document.querySelectorAll('label'))
        .filter((l) => /\*\s*$/.test((l.textContent || '').trim()))
        .map((l) => {
          const c = l.htmlFor
            ? document.getElementById(l.htmlFor)
            : l.querySelector('input,select,textarea')
          return {
            label: (l.textContent || '').trim(),
            required:
              !!c &&
              ((c as HTMLInputElement).required || c.getAttribute('aria-required') === 'true'),
          }
        }),
    )
    expect(starred.length, 'Seite ohne Sternchen-Labels — Auswahl pruefen').toBeGreaterThan(0)
    expect(
      starred.filter((s) => !s.required),
      'Sternchen ohne required/aria-required',
    ).toEqual([])
  })

  test('Feldfehler sind mit dem Feld verbunden und werden angesagt', async ({ page }) => {
    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    // Absenden ohne Eingaben: das Formular traegt noValidate, die Pruefung
    // gehoert der Anwendung. Genau deren Fehlerausgabe wird hier gemessen.
    // Ueber `type="submit"` ausgewaehlt statt ueber die Beschriftung: die ist
    // in zehn Sprachen ein anderer Text, die Rolle im Formular ist dieselbe.
    await page.locator('form button[type="submit"]').first().click()

    const fields = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[aria-invalid="true"]')).map((c) => {
        const ids = (c.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean)
        const nodes = ids.map((i) => document.getElementById(i)).filter(Boolean) as HTMLElement[]
        return {
          id: c.id,
          described: nodes.length > 0,
          announced: nodes.some((n) => n.getAttribute('role') === 'alert'),
          text: nodes.map((n) => (n.textContent || '').trim()).join(' '),
        }
      }),
    )
    expect(fields.length, 'kein Feld als invalid markiert').toBeGreaterThan(0)
    expect(
      fields.filter((f) => !f.described),
      'invalid ohne aria-describedby',
    ).toEqual([])
    expect(
      fields.filter((f) => !f.announced),
      'Fehlertext ohne role="alert"',
    ).toEqual([])
    expect(
      fields.filter((f) => !f.text.trim()),
      'leerer Fehlertext',
    ).toEqual([])
  })

  test('Bestellformular meldet Fehler und Erfolg an die Assistenztechnik', async ({ page }) => {
    await page.goto('/de/vitamin-d3-spray', { waitUntil: 'networkidle' })
    // Leer absenden: die Anwendung lehnt ab, ohne das Backend zu fragen.
    // Ueber `type="submit"` ausgewaehlt statt ueber die Beschriftung: die ist
    // in zehn Sprachen ein anderer Text, die Rolle im Formular ist dieselbe.
    await page.locator('form button[type="submit"]').first().click()
    const alert = page.locator('[role="alert"]').filter({ hasText: /.+/ }).first()
    await expect(alert, 'Fehlermeldung ohne Live-Region').toBeVisible()
  })

  test('Anhang-Bedienelement traegt seine Beschriftung und den Dateizustand', async ({ page }) => {
    await page.goto('/de/support', { waitUntil: 'networkidle' })
    const button = page.getByRole('button', { name: /Datei|ausw/i }).first()
    const described = await button.getAttribute('aria-describedby')
    expect(described, 'Anhang-Knopf ohne Beschreibung').toBeTruthy()
    for (const id of (described || '').split(/\s+/)) {
      await expect(page.locator(`#${id}`), `Beschreibung #${id} fehlt im Dokument`).toHaveCount(1)
    }
    await expect(page.locator('#attachment-filename')).toHaveAttribute('role', 'status')
  })
})

test.describe('PT24.1 — Statusmeldungen sind sparsam und wahr', () => {
  test('keine Seite startet mit einer belegten Live-Region', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route, { waitUntil: 'networkidle' })
      const noisy = await page.evaluate(() =>
        Array.from(document.querySelectorAll('[role="alert"]'))
          .filter((e) => (e.textContent || '').trim().length > 0)
          .map((e) => (e.textContent || '').trim().slice(0, 60)),
      )
      // `role="alert"` unterbricht. Steht beim Laden schon etwas darin, hat die
      // Seite eine Meldung behauptet, die niemand ausgeloest hat.
      expect(noisy, `${route}: role="alert" ist beim Laden bereits belegt`).toEqual([])
    }
  })
})
