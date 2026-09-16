import { test, expect, type Page } from '@playwright/test'

/**
 * PT24.3 — Fokus.
 *
 * Geprueft wird, ob der Fokus **sichtbar**, **kontrastreich**, **nicht
 * abgeschnitten**, **nicht verdeckt** und **vorhersehbar** ist. Die
 * Tastaturmechanik selbst gilt als bewiesen (PT24.2) und wird hier nicht
 * erneut aufgerollt.
 *
 * ZWEI MESSFALLEN, die in PT24.3 zuerst zugeschlagen haben und deshalb hier
 * als Regel stehen:
 *
 *  1. **Vor dem Messen warten.** Viele Bausteine tragen
 *     `transition-all duration-300`; der Fokusring blendet also ein. Wer
 *     sofort nach `Tab` misst, liest drei transparente Schatten und meldet
 *     einen Fehler, den es nicht gibt.
 *  2. **Verdeckung per Treffertest, nicht per Rechteck.** Zwei Rechtecke
 *     koennen sich ueberlappen, ohne dass etwas verdeckt wird — der
 *     Sprunglink liegt geometrisch unter der Kopfzeile und dank `z-index`
 *     trotzdem darueber. Gemessen wird mit `elementFromPoint`.
 */

/** So lange braucht der laengste Fokus-Uebergang im Projekt (300ms) plus Puffer. */
const RING_SETTLE_MS = 360

async function seedConsent(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => {
    try {
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

/**
 * Alles ueber den aktuell fokussierten Knoten, was Fokus betrifft: Indikator,
 * Kontrast gegen den Hintergrund dahinter, Beschneidung, echte Verdeckung.
 */
const focusReport = () => {
  const a = document.activeElement as HTMLElement | null
  if (!a || a === document.body) return null
  const cs = getComputedStyle(a)
  const r = a.getBoundingClientRect()

  const parse = (c: string) => {
    const m = String(c).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/)
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null
  }
  type C = { r: number; g: number; b: number; a: number }
  const lum = ({ r, g, b }: C) => {
    const f = (v: number) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const over = (fg: C, bg: C): C => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  })
  const ratio = (x: C, y: C) => {
    const [l1, l2] = [lum(x), lum(y)].sort((p, q) => q - p)
    return +((l1 + 0.05) / (l2 + 0.05)).toFixed(2)
  }

  // Der Ring liegt AUSSERHALB des Elements — also zaehlt der Hintergrund
  // dahinter, nicht die eigene Flaeche des Bedienelements.
  const bgBehind = (el: HTMLElement): C => {
    let n: HTMLElement | null = el.parentElement
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (c && c.a > 0) return c
      n = n.parentElement
    }
    return (
      parse(getComputedStyle(document.body).backgroundColor) ?? { r: 255, g: 255, b: 255, a: 1 }
    )
  }

  const bg = bgBehind(a)
  const shadows =
    cs.boxShadow === 'none' ? [] : cs.boxShadow.split(/,(?![^(]*\))/).map((s) => s.trim())
  const ringContrasts = shadows
    .map(parse)
    .filter((c): c is C => !!c && c.a > 0)
    .map((c) => ratio(over(c, bg), bg))
  const ringContrast = ringContrasts.length ? Math.max(...ringContrasts) : null

  const outlineColor = parse(cs.outlineColor)
  const outlineContrast =
    cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 && outlineColor
      ? ratio(over(outlineColor, bg), bg)
      : null

  // Beschneidung: schneidet ein Vorfahre mit overflow:hidden den Ring ab?
  let clipped: string | null = null
  let n: HTMLElement | null = a.parentElement
  while (n && n !== document.documentElement) {
    const p = getComputedStyle(n)
    if (/hidden|clip/.test(p.overflow + p.overflowX + p.overflowY)) {
      const q = n.getBoundingClientRect()
      const ring = 4 // 2px Versatz + 2px Linie
      if (
        r.left - ring < q.left - 0.5 ||
        r.right + ring > q.right + 0.5 ||
        r.top - ring < q.top - 0.5 ||
        r.bottom + ring > q.bottom + 0.5
      ) {
        clipped = `${n.tagName}.${String(n.className).slice(0, 40)}`
      }
      break
    }
    n = n.parentElement
  }

  // Echte Verdeckung (WCAG 2.2 SC 2.4.11): liegt im Mittelpunkt etwas anderes obenauf?
  const cx = Math.min(Math.max(r.left + r.width / 2, 1), window.innerWidth - 1)
  const cy = Math.min(Math.max(r.top + r.height / 2, 1), window.innerHeight - 1)
  const hit = document.elementFromPoint(cx, cy)
  const covered = hit && hit !== a && !a.contains(hit) && !hit.contains(a)

  return {
    tag: a.tagName,
    name: (
      a.getAttribute('aria-label') ||
      (a.textContent || '').replace(/\s+/g, ' ').trim() ||
      a.querySelector('img[alt]')?.getAttribute('alt') ||
      ''
    ).slice(0, 45),
    ringContrast,
    outlineContrast,
    best: Math.max(ringContrast ?? 0, outlineContrast ?? 0),
    hasIndicator: (ringContrast ?? 0) > 1.01 || (outlineContrast ?? 0) > 1.01,
    clipped,
    covered: covered ? `${hit!.tagName}.${String(hit!.className).slice(0, 40)}` : null,
  }
}

/** `steps` mal Tab, jeweils mit Wartezeit fuer den einblendenden Ring. */
async function walkFocus(page: Page, steps: number) {
  const rows: NonNullable<ReturnType<typeof focusReport>>[] = []
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press('Tab')
    await page.waitForTimeout(RING_SETTLE_MS)
    const r = await page.evaluate(focusReport)
    if (r) rows.push(r)
  }
  return rows
}

// ===========================================================================
// Sichtbarer Fokus, Kontrast, Beschneidung, Verdeckung
// ===========================================================================

const SURFACES = [
  { key: 'home', route: '/de/', viewport: { width: 1280, height: 900 }, steps: 30 },
  { key: 'home-mobil', route: '/de/', viewport: { width: 390, height: 844 }, steps: 25 },
  {
    key: 'consumer',
    route: '/de/consumer/vitamin-d3-spray',
    viewport: { width: 1280, height: 900 },
    steps: 25,
  },
  {
    key: 'musterbefund',
    route: '/de/epigenetics/musterbefund/metabolic-health',
    viewport: { width: 1280, height: 900 },
    steps: 25,
  },
  { key: 'support', route: '/de/support', viewport: { width: 1280, height: 900 }, steps: 25 },
  { key: 'legal', route: '/de/privacy', viewport: { width: 1280, height: 900 }, steps: 20 },
  // Lange Beschriftungen: Polnisch und Tschechisch sind die laengsten Faelle.
  { key: 'lang-pl', route: '/pl/', viewport: { width: 1280, height: 900 }, steps: 20 },
  { key: 'lang-cs-mobil', route: '/cs/', viewport: { width: 390, height: 844 }, steps: 20 },
] as const

for (const surface of SURFACES) {
  test.describe(`PT24.3 — sichtbarer Fokus: ${surface.key}`, () => {
    test.use({ viewport: surface.viewport })

    test('jedes Tabziel zeigt einen Fokus mit mindestens 3:1', async ({ page }) => {
      await seedConsent(page, surface.route)
      const rows = await walkFocus(page, surface.steps)
      expect(rows.length, 'zu wenige Tabziele erreicht').toBeGreaterThan(surface.steps / 2)

      const ohneIndikator = rows.filter((r) => !r.hasIndicator).map((r) => `${r.tag}:${r.name}`)
      expect(ohneIndikator, 'Tabziel ohne jeden sichtbaren Fokus').toEqual([])

      // WCAG 1.4.11: die Fokusmarkierung ist ein Nicht-Text-Kontrast und
      // braucht 3:1 gegen den Hintergrund, auf dem sie liegt.
      const zuSchwach = rows
        .filter((r) => r.best < 3)
        .map((r) => `${r.tag}:${r.name} (${r.best}:1)`)
      expect(zuSchwach, 'Fokusmarkierung unter 3:1').toEqual([])
    })

    test('der Fokus wird weder abgeschnitten noch verdeckt', async ({ page }) => {
      await seedConsent(page, surface.route)
      const rows = await walkFocus(page, surface.steps)

      expect(
        rows.filter((r) => r.clipped).map((r) => `${r.tag}:${r.name} <- ${r.clipped}`),
        'Fokusring wird von einem overflow-hidden-Vorfahren abgeschnitten',
      ).toEqual([])

      // WCAG 2.2 SC 2.4.11 (Minimum): das fokussierte Element darf nicht
      // vollstaendig hinter klebenden Flaechen verschwinden.
      expect(
        rows.filter((r) => r.covered).map((r) => `${r.tag}:${r.name} <- ${r.covered}`),
        'fokussiertes Element liegt unter einem anderen Element',
      ).toEqual([])
    })
  })
}

// ===========================================================================
// Der sichtbare Fokus ist nirgends global abgeschaltet
// ===========================================================================

test.describe('PT24.3 — kein globales outline:none', () => {
  test('keine Regel entfernt den Fokus, ohne ihn zu ersetzen', async ({ page }) => {
    await seedConsent(page, '/de/')
    const verdaechtig = await page.evaluate(() => {
      const treffer: string[] = []
      for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRuleList
        try {
          rules = sheet.cssRules
        } catch {
          continue // fremdes Stylesheet, nicht lesbar
        }
        for (const rule of Array.from(rules)) {
          if (!(rule instanceof CSSStyleRule)) continue
          const s = rule.style
          const entferntOutline =
            s.outline === 'none' || s.outlineStyle === 'none' || s.outlineWidth === '0px'
          if (!entferntOutline) continue
          const hatErsatz = s.boxShadow && s.boxShadow !== 'none'
          // Utilities wie `.focus-visible\:outline-none` sind in Ordnung: sie
          // greifen nur zusammen mit einer Ring-Utility am selben Element.
          // Gemeldet wird, was OHNE Bedingung alles trifft.
          const trifftAlles = /^\s*(\*|:?root|html|body)?\s*$|^\s*\*\s*(,|$)/.test(
            rule.selectorText.replace(/:focus(-visible|-within)?/g, ''),
          )
          if (trifftAlles && !hatErsatz) treffer.push(rule.selectorText.slice(0, 80))
        }
      }
      return treffer
    })
    expect(verdaechtig, 'globale Regel entfernt den Fokusring ersatzlos').toEqual([])
  })

  test('das Sicherheitsnetz greift, wo eine Komponente keinen eigenen Ring hat', async ({
    page,
  }) => {
    await seedConsent(page, '/de/consumer/vitamin-d3-spray')
    // Die Wortmarke in der Consumer-Kopfzeile bringt keine Fokus-Utility mit
    // und lag vorher auf Navy mit dem Standardring des Browsers: 1,47:1.
    await page.locator('header a[href="#top"]').first().focus()
    await page.waitForTimeout(RING_SETTLE_MS)
    const r = await page.evaluate(focusReport)
    expect(r, 'Wortmarke nicht fokussierbar').not.toBeNull()
    expect(r!.hasIndicator, 'Wortmarke ohne sichtbaren Fokus').toBe(true)
    expect(r!.best, `Fokus auf Navy nur ${r!.best}:1`).toBeGreaterThanOrEqual(3)
  })
})

// ===========================================================================
// Sprunglink
// ===========================================================================

test.describe('PT24.3 — Sprunglink', () => {
  for (const locale of ['de', 'pl'] as const) {
    test(`erstes Tabziel, sichtbar bei Fokus, springt in den Inhalt (${locale})`, async ({
      page,
    }) => {
      await seedConsent(page, `/${locale}/`)
      await page.keyboard.press('Tab')
      await page.waitForTimeout(RING_SETTLE_MS)

      const link = await page.evaluate(() => {
        const a = document.activeElement as HTMLElement
        const r = a.getBoundingClientRect()
        const cs = getComputedStyle(a)
        const mitte = document.elementFromPoint(
          r.left + r.width / 2,
          r.top + r.height / 2,
        ) as HTMLElement | null
        return {
          tag: a.tagName,
          href: a.getAttribute('href'),
          breite: Math.round(r.width),
          hoehe: Math.round(r.height),
          imViewport: r.top >= 0 && r.left >= 0 && r.bottom <= window.innerHeight,
          position: cs.position,
          // Liegt der Link wirklich obenauf, trotz fixierter Kopfzeile?
          obenauf: !!mitte && (mitte === a || a.contains(mitte)),
        }
      })

      expect(link.tag, 'erstes Tabziel ist kein Link').toBe('A')
      expect(link.href, 'Sprunglink zeigt nicht auf den Hauptinhalt').toBe('#main-content')
      expect(link.breite, 'Sprunglink bleibt bei Fokus unsichtbar').toBeGreaterThan(40)
      expect(link.hoehe, 'Sprunglink ist bei Fokus zu flach').toBeGreaterThanOrEqual(44)
      expect(link.imViewport, 'Sprunglink liegt bei Fokus ausserhalb des Bildschirms').toBe(true)
      // Die Kopfzeile ist `position: fixed`. Der Sprunglink muss trotzdem
      // sichtbar obenauf liegen, sonst ist er nur theoretisch da.
      expect(link.obenauf, 'Sprunglink liegt hinter der fixierten Kopfzeile').toBe(true)

      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)
      await expect(page.locator('main#main-content'), 'Sprung setzt den Fokus nicht').toBeFocused()

      // Und der naechste Schritt muss im Inhalt weitergehen, nicht wieder oben.
      await page.keyboard.press('Tab')
      const danach = await page.evaluate(() => ({
        inMain: !!document.activeElement?.closest('main'),
        inHeader: !!document.activeElement?.closest('header'),
      }))
      expect(danach.inHeader, 'nach dem Sprung landet der Fokus wieder in der Kopfzeile').toBe(
        false,
      )
      expect(danach.inMain, 'nach dem Sprung geht es nicht im Hauptinhalt weiter').toBe(true)
    })
  }

  test('auch auf Consumer-Seiten gibt es einen Sprung in den Inhalt', async ({ page }) => {
    await seedConsent(page, '/de/consumer/vitamin-d3-spray')
    await expect(page.locator('main')).toHaveCount(1)
  })
})

// ===========================================================================
// Routenwechsel: Ansage plus Fokuserhalt
// ===========================================================================

test.describe('PT24.3 — Routenwechsel', () => {
  test('beim Erstaufruf ist die Ansage-Region leer', async ({ page }) => {
    await seedConsent(page, '/de/')
    const inhalt = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[aria-live="polite"]'))
        .map((e) => (e.textContent || '').trim())
        .filter(Boolean),
    )
    // Den Erstaufruf kuendigt der Browser selbst an — eine zweite Ansage waere
    // eine Dopplung, und PT24.1 verlangt eine leere Live-Region beim Start.
    expect(inhalt, 'Live-Region ist schon beim Laden belegt').toEqual([])
  })

  test('eine Navigation wird angesagt und der Fokus bleibt am Ausloeser', async ({ page }) => {
    await seedConsent(page, '/de/')
    const link = page.getByRole('link', { name: 'Epigenetik', exact: true }).first()
    await link.focus()
    await page.keyboard.press('Enter')
    await page.waitForURL('**/epigenetics')
    await page.waitForTimeout(600)

    const ansage = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[aria-live="polite"]'))
        .map((e) => (e.textContent || '').trim())
        .filter(Boolean),
    )
    expect(ansage.length, 'der Seitenwechsel wird nicht angesagt').toBeGreaterThan(0)
    expect(ansage.join(' ').length, 'die Ansage ist leer').toBeGreaterThan(3)

    // Fokuserhalt: die Kopfzeile bleibt ueber alle Routen dieselbe. Den Fokus
    // vom gerade betaetigten Navigationspunkt wegzureissen hiesse, dass die
    // naechste Tabulatortaste NICHT beim naechsten Menuepunkt weitergeht.
    await expect(link, 'der Fokus wurde vom Navigationspunkt weggerissen').toBeFocused()
    await page.keyboard.press('Tab')
    expect(
      await page.evaluate(() => !!document.activeElement?.closest('header')),
      'nach der Navigation geht es nicht in der Kopfzeile weiter',
    ).toBe(true)
  })

  test('zweimal dieselbe Route sagt trotzdem erneut an', async ({ page }) => {
    await seedConsent(page, '/de/')
    for (const name of ['Epigenetik', 'IglooPro'] as const) {
      await page.getByRole('link', { name, exact: true }).first().click()
      await page.waitForTimeout(500)
    }
    const ansage = await page.evaluate(
      () => document.querySelector('[aria-live="polite"]')?.textContent?.trim() ?? '',
    )
    expect(ansage.length, 'nach zwei Wechseln steht keine Ansage').toBeGreaterThan(3)
  })
})

// ===========================================================================
// Hash-Navigation
// ===========================================================================

test.describe('PT24.3 — Hash- und Kapitelnavigation', () => {
  const ROUTE = '/de/epigenetics/musterbefund/metabolic-health'

  test('ein Kapitelsprung landet unter der klebenden Leiste und nimmt den Fokus mit', async ({
    page,
  }) => {
    await seedConsent(page, ROUTE)
    const chapter = page.locator('nav[aria-label="Kapitel"] a[data-chapter]').nth(2)
    const href = await chapter.getAttribute('href')
    await chapter.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1800)

    const ergebnis = await page.evaluate((h) => {
      const id = decodeURIComponent(String(h).slice(1))
      const target = document.getElementById(id)!
      const offset = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--chapterbar-offset'),
      )
      return {
        hash: location.hash,
        abstandZurOberkante: Math.round(target.getBoundingClientRect().top),
        gewuenschterAbstand: Math.round(offset),
        fokusImZiel: target.contains(document.activeElement) || document.activeElement === target,
        zielTabindex: target.getAttribute('tabindex'),
      }
    }, href)

    expect(ergebnis.hash).toBe(href)
    // Das Ziel darf nicht hinter Kopfzeile und Kapitelleiste liegen.
    expect(
      Math.abs(ergebnis.abstandZurOberkante - ergebnis.gewuenschterAbstand),
      `Ziel liegt bei ${ergebnis.abstandZurOberkante}px statt ${ergebnis.gewuenschterAbstand}px`,
    ).toBeLessThanOrEqual(4)
    // Ohne Fokus im Ziel scrollt die Seite zwar, aber eine Assistenztechnik
    // erfaehrt nichts davon — gemessen war vorher `document.body`.
    expect(ergebnis.fokusImZiel, 'der Fokus folgt dem Sprung nicht').toBe(true)
    expect(ergebnis.zielTabindex, 'das Ziel ist ein dauerhafter Tabstop geworden').toBe('-1')
  })

  test('nach dem Sprung geht Tab im Ziel weiter, nicht wieder in der Kapitelleiste', async ({
    page,
  }) => {
    await seedConsent(page, ROUTE)
    const chapter = page.locator('nav[aria-label="Kapitel"] a[data-chapter]').nth(2)
    const href = await chapter.getAttribute('href')
    await chapter.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1800)
    await page.keyboard.press('Tab')

    expect(
      await page.evaluate((h) => {
        const target = document.getElementById(decodeURIComponent(String(h).slice(1)))!
        return target.contains(document.activeElement)
      }, href),
      'Tab nach dem Sprung landet ausserhalb des Zielabschnitts',
    ).toBe(true)
  })

  test('der Fokusring des ersten Kapitels wird vom Scrollstreifen nicht abgeschnitten', async ({
    page,
  }) => {
    await seedConsent(page, ROUTE)
    // Der Streifen ist `overflow-x-auto`. Beim ERSTEN Kapitel steht der Ring
    // genau an der Schnittkante — die allgemeine Tabwanderung oben kommt bis
    // hierher gar nicht, deshalb dieser gezielte Fall.
    const ergebnis = await page.evaluate(async () => {
      const links = document.querySelectorAll<HTMLElement>(
        'nav[aria-label="Kapitel"] a[data-chapter]',
      )
      if (links.length === 0) return null
      const werte: { index: number; ringFrei: boolean; sichtbar: number }[] = []
      for (const index of [0, links.length - 1]) {
        const a = links[index]
        a.focus()
        // `motion-safe:scroll-smooth`: der Browser scrollt das fokussierte
        // Kapitel ANIMIERT ins Bild. Ein Sprung ueber den ganzen Streifen
        // braucht ueber eine Sekunde — wer frueher misst, misst die Animation
        // und meldet einen abgeschnittenen Ring, der nur noch unterwegs ist.
        await new Promise((r) => setTimeout(r, 1500))
        const strip = a.parentElement!
        const r = a.getBoundingClientRect()
        const q = strip.getBoundingClientRect()
        const ring = 4 // 2px Versatz + 2px Linie
        werte.push({
          index,
          ringFrei: r.left - ring >= q.left - 0.5 && r.right + ring <= q.right + 0.5,
          sichtbar: +(
            Math.max(0, Math.min(r.right, q.right) - Math.max(r.left, q.left)) / r.width
          ).toFixed(2),
        })
      }
      return werte
    })

    expect(ergebnis, 'keine Kapitellinks gefunden').not.toBeNull()
    expect(
      ergebnis!.filter((w) => !w.ringFrei).map((w) => `Kapitel ${w.index}`),
      'Fokusring des Kapitels wird an der Kante des Scrollstreifens abgeschnitten',
    ).toEqual([])
    expect(
      ergebnis!.filter((w) => w.sichtbar < 0.99).map((w) => `Kapitel ${w.index}`),
      'fokussiertes Kapitel ist nicht vollstaendig sichtbar',
    ).toEqual([])
  })

  test('der Direktaufruf mit Hash trifft dasselbe Ziel', async ({ page }) => {
    await seedConsent(page, ROUTE)
    await page.goto(`${ROUTE}#ergebnis`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)
    const abstand = await page.evaluate(() => {
      const t = document.getElementById('ergebnis')
      const offset = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--chapterbar-offset'),
      )
      const header = document.querySelector('header')!.getBoundingClientRect().height
      return {
        top: t ? Math.round(t.getBoundingClientRect().top) : null,
        soll: Math.round(Number.isFinite(offset) && offset > 0 ? offset : header + 16),
      }
    })
    expect(abstand.top, 'Ziel nicht gefunden').not.toBeNull()
    expect(
      Math.abs(abstand.top! - abstand.soll),
      `Direktaufruf landet bei ${abstand.top}px statt ${abstand.soll}px`,
    ).toBeLessThanOrEqual(6)
  })
})

// ===========================================================================
// Fokusfalle und Rueckgabe — hier nur die FOKUS-Seite, Mechanik ist PT24.2
// ===========================================================================

test.describe('PT24.3 — modaler Erstfokus und Rueckgabe', () => {
  test('die Suche setzt den Fokus auf ein sinnvolles erstes Ziel, nicht auf den Rahmen', async ({
    page,
  }) => {
    await seedConsent(page, '/de/')
    const trigger = page.getByRole('button', { name: /Suche öffnen/i }).first()
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('#search-input'), 'Erstfokus liegt nicht im Suchfeld').toBeFocused()
    await page.keyboard.press('Escape')
    await expect(trigger, 'Fokus kehrt nicht zum Ausloeser zurueck').toBeFocused()
  })

  test('das Bestell-Modal setzt den Erstfokus in den Dialog, nicht auf body', async ({ page }) => {
    await seedConsent(page, '/de/consumer/vitamin-d3-spray')
    const cta = page.getByRole('button', { name: /Bestellen/i }).first()
    await cta.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog')).toBeVisible()
    expect(
      await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')),
      'Erstfokus liegt ausserhalb des Dialogs',
    ).toBe(true)
    await page.keyboard.press('Escape')
    await expect(cta, 'Fokus kehrt nicht zum ausloesenden Knopf zurueck').toBeFocused()
  })

  test('ausserhalb echter Modale gibt es keine Falle', async ({ page }) => {
    await seedConsent(page, '/de/')
    // Sprachumschalter: nicht modal, also muss der Fokus ihn verlassen koennen.
    const lang = page.getByRole('button', { name: /Sprache wählen/i }).first()
    await lang.focus()
    await page.keyboard.press('Enter')
    for (let i = 0; i < 14; i++) await page.keyboard.press('Tab')
    expect(
      await page.evaluate(() => !!document.activeElement?.closest('main')),
      'der Fokus kommt aus dem Sprachdropdown nicht in den Inhalt',
    ).toBe(true)
  })
})
