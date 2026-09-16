import { test, expect, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

/**
 * PT24.6 — der breite automatisierte Accessibility-Gate.
 *
 * PT24.1–PT24.5 haben repraesentativ und tief gemessen. Diese Reihe misst
 * BREIT: `axe-core` gegen **alle** oeffentlichen Routen im Ruhezustand, gegen
 * **17 dynamische Zustaende**, gegen **vier Sprachen** und gegen **mobil**.
 *
 * WARUM DER BREITE LAUF NOETIG WAR: er hat einen Befund gefunden, den fuenf
 * tiefe Durchgaenge uebersehen haben. Die weisse Hauptnavigation stand auf der
 * Startseite und auf `/diagnostics` ueber einem HELLEN Hero — gemessener
 * Kontrast **1,05:1**. PT24.3 hatte den Fokusring dieser Links geprueft (in
 * Ordnung), und die Kontrastmessung aus PT24.4 schliesst Elemente unter
 * fixierten Ueberlagerungen aus, also ausgerechnet die Kopfzeile. Tiefe ersetzt
 * keine Breite.
 *
 * Die axe-Quelle kommt aus `node_modules` — kein Netzzugriff.
 *
 * **Kein Zertifikat.** `axe` deckt automatisiert einen Teil der Kriterien ab.
 * Ein gruener Lauf heisst „keine der geprueften Regeln verletzt", nicht
 * „barrierefrei". Die manuelle Screenreader-Pruefung steht in
 * `building-docs/ACCESSIBILITY-CONTRACT.md` §14 und ist in dieser Umgebung
 * NICHT gelaufen.
 */

const require_ = createRequire('/home/phillip/01polaris-preview/package.json')
const AXE_SOURCE = readFileSync(require_.resolve('axe-core/axe.min.js'), 'utf8')

/** WCAG 2.0/2.1/2.2 auf Stufe A und AA — das Qualitaetsziel dieses Pakets. */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
/** Empfehlungen von axe, die KEIN WCAG-Kriterium sind — nur zur Triage. */
const BEST_PRACTICE_TAGS = ['best-practice']

type Verletzung = {
  id: string
  impact: string | null
  n: number
  help: string
  ziele: string[]
  daten: unknown
}

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
  await page.waitForTimeout(400)
}

async function axeLauf(page: Page, tags: string[] = WCAG_TAGS): Promise<Verletzung[]> {
  await page.addScriptTag({ content: AXE_SOURCE })
  return page.evaluate(async (t) => {
    // @ts-expect-error axe wird zur Laufzeit injiziert
    const ergebnis = await window.axe.run(document, { runOnly: { type: 'tag', values: t } })
    return ergebnis.violations.map((v: Record<string, unknown>) => ({
      id: v.id as string,
      impact: (v.impact as string) ?? null,
      n: (v.nodes as unknown[]).length,
      help: v.help as string,
      ziele: (v.nodes as { target: unknown }[])
        .slice(0, 3)
        .map((n) => String(n.target).slice(0, 90)),
      daten: (v.nodes as { any?: { data?: unknown }[] }[])[0]?.any?.[0]?.data ?? null,
    }))
  }, tags)
}

/** Nur diese beiden Stufen sind das harte Tor. */
const istBlocker = (v: Verletzung) => v.impact === 'serious' || v.impact === 'critical'

const alsText = (vs: Verletzung[]) =>
  vs.map(
    (v) =>
      `[${v.impact}] ${v.id} (${v.n} Knoten) ${v.ziele.join(' · ')} ${JSON.stringify(v.daten ?? {})}`,
  )

// ===========================================================================
// 1. Alle oeffentlichen Routen im Ruhezustand
// ===========================================================================

/**
 * Die Routenliste kommt aus der Sitemap der laufenden Anwendung, nicht aus
 * einer gepflegten Konstante: so kann keine neue Route still am Gate
 * vorbeilaufen. Die vier `NOINDEX`-Seiten und die 404 stehen nicht in der
 * Sitemap und werden ergaenzt.
 */
async function oeffentlicheRouten(page: Page): Promise<string[]> {
  const res = await page.request.get('/sitemap.xml')
  const xml = await res.text()
  const ausSitemap = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(/^https?:\/\/[^/]+/, ''))
    .filter((u) => u.startsWith('/de/'))
  return [
    ...new Set([
      ...ausSitemap,
      '/de/support',
      '/de/privacy',
      '/de/imprint',
      '/de/terms',
      '/de/gibt-es-nicht',
    ]),
  ].sort()
}

test('PT24.6 — axe ueber ALLE oeffentlichen Routen: serious/critical = 0', async ({ page }) => {
  const routen = await oeffentlicheRouten(page)
  expect(routen.length, 'zu wenige Routen gefunden — die Sitemap ist verdaechtig').toBeGreaterThan(
    35,
  )

  const blocker: string[] = []
  const rest: string[] = []
  for (const route of routen) {
    await seedConsent(page, route)
    const vs = await axeLauf(page)
    for (const v of vs) {
      const zeile = `${route}: ${alsText([v])[0]}`
      if (istBlocker(v)) blocker.push(zeile)
      else rest.push(zeile)
    }
  }
  // Das harte Tor.
  expect(blocker, 'axe serious/critical im Kernscope').toEqual([])
  // Moderate und minor sind kein Tor, gehoeren aber in die Triage.
  expect(rest, 'axe moderate/minor — Triage im Vertrag §13.2').toEqual([])
})

// ===========================================================================
// 2. Dynamische Zustaende
// ===========================================================================

/**
 * Ein Lauf nur gegen den Ruhezustand misst die Haelfte: Menues, Dialoge,
 * Fehlerzustaende und aufgeklappte Bereiche existieren im DOM erst, wenn
 * jemand sie ausloest.
 */
const ZUSTAENDE: {
  name: string
  viewport: { width: number; height: number }
  oeffnen: (page: Page) => Promise<void>
}[] = [
  {
    name: 'Mega-Menue offen',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/')
      await p.locator('[data-submenu-trigger]').first().click()
      await p.waitForTimeout(400)
    },
  },
  {
    name: 'Mobiles Menue offen',
    viewport: { width: 390, height: 844 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/')
      await p.getByRole('button', { name: /Navigation umschalten/i }).click()
      await p.waitForTimeout(400)
    },
  },
  {
    name: 'Suche offen, leer',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/')
      await p
        .getByRole('button', { name: /Suche öffnen/i })
        .first()
        .click()
      await p.waitForTimeout(500)
    },
  },
  {
    name: 'Suche mit Treffern',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/')
      await p
        .getByRole('button', { name: /Suche öffnen/i })
        .first()
        .click()
      await p.locator('#search-input').fill('epigenetik')
      await p.waitForTimeout(900)
    },
  },
  {
    name: 'Suche ohne Treffer',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/')
      await p
        .getByRole('button', { name: /Suche öffnen/i })
        .first()
        .click()
      await p.locator('#search-input').fill('zzzqqqxyz')
      await p.waitForTimeout(900)
    },
  },
  {
    name: 'Einwilligungsbanner',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await p.goto('/de/', { waitUntil: 'networkidle' })
      await p.waitForTimeout(700)
    },
  },
  {
    name: 'Einwilligungs-Einstellungen offen',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await p.goto('/de/', { waitUntil: 'networkidle' })
      await p.waitForTimeout(700)
      await p
        .locator('section[aria-labelledby="cookie-banner-title"] button[aria-expanded]')
        .click()
      await p.waitForTimeout(400)
    },
  },
  {
    name: 'Sprachdropdown offen',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/')
      await p
        .getByRole('button', { name: /Sprache wählen/i })
        .first()
        .click()
      await p.waitForTimeout(400)
    },
  },
  {
    name: 'FAQ aufgeklappt',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/')
      await p.locator('button[aria-controls*="faq-answer"]').first().click()
      await p.waitForTimeout(400)
    },
  },
  {
    name: 'Bestell-Modal offen',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/consumer/vitamin-d3-spray')
      await p
        .getByRole('button', { name: /Bestellen/i })
        .first()
        .click()
      await p.waitForTimeout(600)
    },
  },
  {
    name: 'Preis-Popover offen',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/consumer/vitamin-d3-spray')
      await p.evaluate(() => {
        const b = Array.from(document.querySelectorAll<HTMLElement>('button[aria-expanded]')).find(
          (x) => /€|pro /.test(x.textContent || ''),
        )
        b?.focus()
      })
      await p.waitForTimeout(600)
    },
  },
  {
    name: 'Kontaktformular im Fehlerzustand',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/contact')
      await p.locator('form button[type="submit"]').first().click()
      await p.waitForTimeout(600)
    },
  },
  {
    name: 'Bestellformular im Fehlerzustand',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/vitamin-d3-spray')
      await p.locator('form button[type="submit"]').first().click()
      await p.waitForTimeout(600)
    },
  },
  {
    name: 'Resource Gate offen',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/epigenetics/unterlagen')
      await p.locator('[data-gate-trigger] button[aria-expanded]').first().click()
      await p.waitForTimeout(500)
    },
  },
  {
    name: 'Kapitelsprung per Hash',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/epigenetics/musterbefund/metabolic-health')
      await p.locator('nav[aria-label="Kapitel"] a[data-chapter]').nth(2).click()
      await p.waitForTimeout(1800)
    },
  },
  {
    name: 'Kapitel-Aufklapper mobil',
    viewport: { width: 390, height: 844 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/epigenetics/musterbefund/metabolic-health')
      await p.locator('nav[aria-label="Kapitel"] summary').click()
      await p.waitForTimeout(500)
    },
  },
  {
    name: 'Musterbefund-Wechsler offen',
    viewport: { width: 1280, height: 900 },
    oeffnen: async (p) => {
      await seedConsent(p, '/de/epigenetics/musterbefund/metabolic-health')
      const s = p.locator('details summary').first()
      if (await s.count()) {
        await s.click()
        await p.waitForTimeout(400)
      }
    },
  },
]

for (const zustand of ZUSTAENDE) {
  test(`PT24.6 — axe im dynamischen Zustand: ${zustand.name}`, async ({ page }) => {
    await page.setViewportSize(zustand.viewport)
    await zustand.oeffnen(page)
    const vs = await axeLauf(page)
    expect(alsText(vs.filter(istBlocker)), `${zustand.name}: serious/critical`).toEqual([])
    expect(alsText(vs.filter((v) => !istBlocker(v))), `${zustand.name}: moderate/minor`).toEqual([])
  })
}

// ===========================================================================
// 3. Sprachen und Mobil
// ===========================================================================

const KERNROUTEN = [
  '/',
  '/diagnostics',
  '/epigenetics',
  '/downloads',
  '/contact',
  '/support',
  '/consumer/vitamin-d3-spray',
  '/privacy',
  '/imprint',
  '/terms',
  '/articles/die-gruene-praxis',
  '/events',
  '/igloo-pro',
  '/epigenetics/musterbefund/metabolic-health',
] as const

// `de` und `en` als kurze, `pl` und `fr` als lange Beschriftungen.
for (const locale of ['de', 'en', 'pl', 'fr'] as const) {
  test(`PT24.6 — axe ueber die Kernrouten in "${locale}"`, async ({ page }) => {
    const befunde: string[] = []
    for (const route of KERNROUTEN) {
      await seedConsent(page, `/${locale}${route}`)
      const vs = await axeLauf(page)
      vs.forEach((v) => befunde.push(`/${locale}${route}: ${alsText([v])[0]}`))
    }
    expect(befunde, `axe-Verletzungen in "${locale}"`).toEqual([])
  })
}

test('PT24.6 — axe ueber die Kernrouten bei 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const befunde: string[] = []
  for (const route of KERNROUTEN) {
    await seedConsent(page, `/de${route}`)
    const vs = await axeLauf(page)
    vs.forEach((v) => befunde.push(`/de${route}: ${alsText([v])[0]}`))
  }
  expect(befunde, 'axe-Verletzungen bei 390px').toEqual([])
})

// ===========================================================================
// 4. Triage: Empfehlungen ausserhalb von WCAG
// ===========================================================================

test('PT24.6 — Empfehlungen ausserhalb von WCAG sind bekannt und begruendet', async ({ page }) => {
  /**
   * `best-practice` ist KEIN WCAG-Kriterium und damit kein Tor. Der Test haelt
   * den Bestand fest: taucht etwas Neues auf, faellt er — und jemand muss
   * entscheiden, statt es unbemerkt mitlaufen zu lassen.
   *
   * Bekannt und BEWUSST nicht behoben:
   *
   * `landmark-complementary-is-top-level` auf `/de/diagnostics` — ein
   * `<aside aria-label="Verlässliche Orientierung">` liegt innerhalb der
   * Hero-`section`. axe empfiehlt, komplementaere Landmarks auf oberster Ebene
   * zu fuehren. Hier waere die Alternative, das Landmark ganz aufzugeben (also
   * ein `div` daraus zu machen) — und damit den benannten Sprungpunkt zu
   * verlieren, den eine Screenreader-Nutzerin heute ansteuern kann. Ein
   * benanntes, einmaliges `complementary` im Inhalt ist verstaendlicher als
   * gar keines. Begruendung im Vertrag §13.2.
   */
  const ERWARTET = ['de/diagnostics: landmark-complementary-is-top-level']

  const gefunden: string[] = []
  for (const route of KERNROUTEN) {
    await seedConsent(page, `/de${route}`)
    const vs = await axeLauf(page, BEST_PRACTICE_TAGS)
    vs.forEach((v) => gefunden.push(`de${route}: ${v.id}`))
  }
  expect(gefunden.sort(), 'Bestand der Nicht-WCAG-Empfehlungen hat sich geaendert').toEqual(
    [...ERWARTET].sort(),
  )
})

// ===========================================================================
// 5. Der Gate prueft sich selbst
// ===========================================================================

test('PT24.6 — der axe-Lauf findet einen eingebauten Fehler (Gegenprobe)', async ({ page }) => {
  await seedConsent(page, '/de/')
  // Ohne diese Gegenprobe koennte der ganze Gate gruen sein, weil axe gar
  // nicht laeuft — ein leeres Ergebnis sieht aus wie ein sauberes Ergebnis.
  await page.evaluate(() => {
    const p = document.createElement('p')
    p.textContent = 'Absichtlich unlesbar — Gegenprobe des Gates'
    p.style.color = '#fafafa'
    p.style.backgroundColor = '#ffffff'
    p.style.fontSize = '12px'
    p.id = 'pt246-gegenprobe'
    document.querySelector('main')?.appendChild(p)
  })
  const vs = await axeLauf(page)
  expect(
    vs.some((v) => v.id === 'color-contrast'),
    'axe meldet den eingebauten Kontrastfehler nicht — der Gate misst nichts',
  ).toBe(true)
})
