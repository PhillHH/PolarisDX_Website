import { test, expect, type Page } from '@playwright/test'

/**
 * PT24.5 — Medien.
 *
 * Bilder, Icons, Diagramme und Bewegung. Gemessen im echten Browser gegen den
 * Dev-SSR-Server.
 *
 * EINE MESSFALLE, die in PT24.5 zugeschlagen hat und deshalb hier als Regel
 * steht: **`aria-hidden` wirkt auf den ganzen Teilbaum.** Ein erster Lauf
 * fragte das Attribut nur am `svg` selbst ab und meldete 19 namenlose
 * Grafiken, obwohl der umschliessende Span sie laengst aus dem
 * Accessibility-Tree genommen hatte. Geprueft wird deshalb mit
 * `closest('[aria-hidden="true"]')` — und stichprobenartig gegen den echten
 * Accessibility-Snapshot.
 *
 * Nicht hier: Semantik (PT24.1), Tastatur (PT24.2), Fokus (PT24.3), Kontrast
 * und Farbwerte (PT24.4), der breite axe-Lauf (PT24.6).
 */

const ROUTEN = [
  '/de/',
  '/de/about',
  '/de/articles',
  '/de/articles/die-gruene-praxis',
  '/de/diagnostics',
  '/de/epigenetics',
  '/de/epigenetics/musterbefund/metabolic-health',
  '/de/epigenetics/musterbefund/healthy-aging',
  '/de/consumer/vitamin-d3-spray',
  '/de/igloo-pro',
  '/de/downloads',
  '/de/events',
] as const

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
  await page.waitForTimeout(300)
}

// ===========================================================================
// 1. Bilder: informativ benannt, dekorativ leer
// ===========================================================================

const bildBefunde = () => {
  const txt = (e: Element | null) => (e?.textContent || '').replace(/\s+/g, ' ').trim()
  const out: { art: string; src: string; alt: string | null; wo: string }[] = []

  for (const img of Array.from(document.querySelectorAll('img'))) {
    const alt = img.getAttribute('alt')
    const src = (img.getAttribute('src') || '').split('/').pop() || ''
    const wo = String(img.className).slice(0, 40)

    // Jedes Bild MUSS ein alt-Attribut tragen — leer oder gefuellt, aber da.
    if (alt === null) {
      out.push({ art: 'ohne alt-Attribut', src, alt, wo })
      continue
    }
    if (!alt) continue // bewusst dekorativ

    const t = alt.trim()
    if (/\.(webp|png|jpe?g|svg|gif|avif)$/i.test(t))
      out.push({ art: 'Dateiname als alt', src, alt, wo })
    if (/^(bild|foto|grafik|image|photo|picture|abbildung)\s*(von|of|:)?\s/i.test(t))
      out.push({ art: 'mechanisches Praefix', src, alt, wo })
    if (t.length > 160) out.push({ art: 'alt laenger als 160 Zeichen', src, alt, wo })

    // Doppelt der alt-Text den Namen des umschliessenden Links?
    const link = img.closest('a[href]')
    if (link) {
      const linkName = (link.getAttribute('aria-label') || txt(link)).trim()
      if (linkName && linkName.toLowerCase() === t.toLowerCase() && txt(link).length > 0) {
        out.push({ art: 'alt doppelt den Linknamen', src, alt, wo })
      }
    }
    // Steht derselbe Text direkt daneben noch einmal sichtbar?
    //
    // ACHTUNG: der alt-Text ist NICHT Teil von `textContent`. Ein erster
    // Entwurf suchte ihn zweimal im Kartentext und fand ihn folglich nie —
    // die Probe mit `alt={title}` im Blog-Kachelbild lief durch. Verglichen
    // wird deshalb gegen die Ueberschrift der Karte, nicht gegen deren
    // Gesamttext.
    const karte = img.closest('article, figure, li')
    if (karte) {
      const ueberschrift = txt(karte.querySelector('h1,h2,h3,h4,h5,h6'))
      if (ueberschrift && ueberschrift.toLowerCase() === t.toLowerCase()) {
        out.push({ art: 'alt wiederholt die Ueberschrift der Karte', src, alt, wo })
      }
      const beschriftung = txt(karte.querySelector('figcaption'))
      if (beschriftung && beschriftung.toLowerCase() === t.toLowerCase()) {
        out.push({ art: 'alt wiederholt die Bildunterschrift', src, alt, wo })
      }
    }
  }
  return out
}

for (const route of ROUTEN) {
  test(`PT24.5 — Bilder sind benannt oder bewusst leer: ${route}`, async ({ page }) => {
    await seedConsent(page, route)
    const befunde = await page.evaluate(bildBefunde)
    expect(
      befunde.map((b) => `${b.art}: "${b.alt}" (${b.src})`),
      'Alt-Text-Befund',
    ).toEqual([])
  })
}

test('PT24.5 — dekorative Bilder sind bewusst leer, nicht vergessen', async ({ page }) => {
  await seedConsent(page, '/de/articles')
  // Die Artikelkarte traegt ihren Namen ueber den Link; ein alt am Bild waere
  // eine zweite Ansage desselben Titels.
  const karten = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-article-card]'))
      // Nicht jeder Artikel hat ein Bild — zwei der sechs Karten kommen ohne
      // aus. Ein fehlendes Bild ist kein Alt-Text-Befund.
      .filter((k) => k.querySelector('img'))
      .map((k) => {
        const img = k.querySelector('img')!
        const link = k.querySelector('a[href]')
        return {
          altLeer: img.getAttribute('alt') === '',
          linkName: (link?.getAttribute('aria-label') || link?.textContent || '')
            .trim()
            .slice(0, 40),
        }
      }),
  )
  expect(karten.length, 'keine Artikelkarten gefunden').toBeGreaterThan(0)
  expect(
    karten.filter((k) => !k.altLeer).length,
    'Artikelbild traegt ein alt — der Titel wuerde doppelt angesagt',
  ).toBe(0)
  expect(
    karten.filter((k) => !k.linkName).length,
    'Artikelkarte ohne zugaenglichen Namen — dann fehlt die Ansage ganz',
  ).toBe(0)
})

// ===========================================================================
// 2. Grafiken: entweder aus dem Baum genommen oder benannt
// ===========================================================================

for (const route of ROUTEN) {
  test(`PT24.5 — keine namenlose Grafik im Accessibility-Tree: ${route}`, async ({ page }) => {
    await seedConsent(page, route)
    const offen = await page.evaluate(() =>
      Array.from(document.querySelectorAll('svg'))
        // `aria-hidden` wirkt auf den ganzen Teilbaum — am Vorfahren suchen,
        // nicht nur am Element selbst.
        .filter((s) => !s.closest('[aria-hidden="true"]'))
        .filter((s) => !s.getAttribute('aria-label') && !s.querySelector('title'))
        .map((s) => ({
          cls: String(s.getAttribute('class') || '').slice(0, 45),
          eltern: s.parentElement
            ? `${s.parentElement.tagName}.${String(s.parentElement.className).slice(0, 30)}`
            : '',
        })),
    )
    expect(offen, 'Grafik ohne Namen und ohne aria-hidden').toEqual([])
  })
}

test('PT24.5 — der Sprachumschalter meldet nur seinen Knopf, keine Flaggengrafik', async ({
  page,
}) => {
  await seedConsent(page, '/de/')
  // Gegen den echten Accessibility-Snapshot, nicht gegen Attribute.
  const snapshot = await page
    .locator('header button[aria-label="Sprache wählen"]')
    .first()
    .ariaSnapshot()
  expect(snapshot, 'Flaggengrafik taucht im Accessibility-Tree auf').not.toMatch(/img|graphics/i)
  expect(snapshot).toMatch(/button "Sprache wählen"/)
})

// ===========================================================================
// 3. Icon-Bedienelemente
// ===========================================================================

for (const route of ROUTEN.slice(0, 6)) {
  test(`PT24.5 — jedes Icon-Bedienelement hat einen Namen: ${route}`, async ({ page }) => {
    await seedConsent(page, route)
    const namenlos = await page.evaluate(() => {
      const txt = (e: Element) => (e.textContent || '').replace(/\s+/g, ' ').trim()
      return Array.from(document.querySelectorAll<HTMLElement>('button, a[href], [role="button"]'))
        .filter((c) => c.getBoundingClientRect().width > 2)
        .filter((c) => !/[\p{L}\p{N}]/u.test(txt(c)) && c.querySelector('svg, img'))
        .filter(
          (c) =>
            !c.getAttribute('aria-label') &&
            !c.getAttribute('aria-labelledby') &&
            !c.querySelector('.sr-only') &&
            !c.querySelector('img[alt]:not([alt=""])') &&
            !c.getAttribute('title'),
        )
        .map((c) => `${c.tagName}.${String(c.className).slice(0, 40)}`)
    })
    expect(namenlos, 'Bedienelement besteht nur aus einer Grafik und hat keinen Namen').toEqual([])
  })
}

// ===========================================================================
// 4. Diagramme: die wesentlichen Werte stehen als Text
// ===========================================================================

/**
 * Nicht jeder Musterbefund enthaelt dieselben Darstellungsformen: auf
 * `metabolic-health` gibt es gar keine `figure`, auf `healthy-aging` zwei, auf
 * `biologische-altersuhr` drei. Geprueft werden die Befunde, die Diagramme
 * tatsaechlich tragen — sonst prueft der Test gegen null Elemente und meldet
 * gruen, ohne etwas gesehen zu haben.
 */
const BEFUNDE = [
  '/de/epigenetics/musterbefund/healthy-aging',
  '/de/epigenetics/musterbefund/biologische-altersuhr',
  '/de/epigenetics/musterbefund/telomer-analyse',
] as const

for (const route of BEFUNDE) {
  test(`PT24.5 — jedes Diagramm hat eine Textalternative: ${route}`, async ({ page }) => {
    await seedConsent(page, route)
    const befund = await page.evaluate(() => {
      const txt = (e: Element | null) => (e?.textContent || '').replace(/\s+/g, ' ').trim()
      const figuren = Array.from(document.querySelectorAll('figure'))
      return {
        anzahl: figuren.length,
        // Eine Figur ohne jeden lesbaren Text waere eine Grafik ohne
        // Alternative — Bedeutung nur im Bild.
        ohneText: figuren
          .filter((f) => !/[\p{L}\p{N}]/u.test(txt(f)))
          .map((f) => String(f.className).slice(0, 40)),
        // Werte muessen als Text existieren, nicht nur als Balkenlaenge.
        ohneZahl: figuren
          .filter((f) => f.querySelector('svg, [style*="left:"], [style*="width:"]'))
          .filter((f) => !/\d/.test(txt(f)))
          .map((f) => String(f.className).slice(0, 40)),
      }
    })
    expect(befund.anzahl, 'keine Diagramme gefunden').toBeGreaterThan(0)
    expect(befund.ohneText, 'Diagramm ohne jede Textalternative').toEqual([])
    expect(befund.ohneZahl, 'Diagramm ohne Zahlenwert im Text').toEqual([])
  })
}

test('PT24.5 — die Beschriftung der Altersskala steht genau einmal im Baum', async ({ page }) => {
  await seedConsent(page, '/de/epigenetics/musterbefund/healthy-aging')
  // Gemessen war „48 J.48 J.": die Zahl stand sr-only UND als Position auf der
  // Skala im Accessibility-Tree. Die optische Fassung ist Grafik.
  const doppelt = await page.evaluate(() =>
    Array.from(document.querySelectorAll('figcaption'))
      .map((c) => {
        const sichtbar: string[] = []
        for (const el of Array.from(c.querySelectorAll<HTMLElement>('*'))) {
          if (el.closest('[aria-hidden="true"]')) continue
          const t = (el.textContent || '').replace(/\s+/g, ' ').trim()
          if (t) sichtbar.push(t)
        }
        const zaehler = new Map<string, number>()
        sichtbar.forEach((t) => zaehler.set(t, (zaehler.get(t) || 0) + 1))
        return [...zaehler].filter(([, n]) => n > 1).map(([t]) => t)
      })
      .flat(),
  )
  expect(doppelt, 'Beschriftung steht doppelt im Accessibility-Tree').toEqual([])
})

test('PT24.5 — die Netzgrafik traegt einen uebersetzten Namen und eine Werteliste', async ({
  page,
}) => {
  await seedConsent(page, '/de/epigenetics/musterbefund/healthy-aging')
  // Gezielt das Netzdiagramm: auf derselben Seite steht auch die
  // Befund-Miniatur als `svg[role="img"]`, und die ist eine andere Grafik.
  const radar = page.locator('figure svg[role="img"][aria-label]').first()
  await expect(radar, 'keine Netzgrafik gefunden').toHaveCount(1)
  const label = await radar.getAttribute('aria-label')
  expect(label?.length ?? 0, 'Netzgrafik ohne Namen').toBeGreaterThan(10)
  // Kein durchgereichter i18n-Schluessel.
  expect(label).not.toMatch(/^[a-z0-9]+(\.[a-z0-9]+)+$/i)
  // Und die Achsenwerte stehen als Text daneben, nicht nur im Bild.
  const werte = await page.evaluate(() => {
    const fig = document.querySelector('figure svg[role="img"][aria-label]')?.closest('figure')
    return fig ? fig.querySelectorAll('dt').length : 0
  })
  expect(werte, 'Netzgrafik ohne Werteliste als Textalternative').toBeGreaterThan(2)
})

// ===========================================================================
// 5. Bewegung
// ===========================================================================

test.describe('PT24.5 — Bewegungsreduktion', () => {
  /**
   * `page.emulateMedia()` statt `test.use({ reducedMotion })`.
   *
   * Die Konfiguration dieser Reihe traegt `reducedMotion: 'reduce'` im
   * `use`-Block — gemessen kam es aber nie in der Seite an:
   * `matchMedia('(prefers-reduced-motion: reduce)').matches` blieb `false`,
   * und die Gegenprobe fand weiterhin ueber zehn laufende Animationen. Der
   * Aufruf am `page`-Objekt ist die Stelle, an der die Emulation nachweislich
   * greift; der Test prueft das unten ausdruecklich nach, statt es zu
   * unterstellen.
   */

  for (const route of [
    '/de/',
    '/de/epigenetics/musterbefund/metabolic-health',
    '/de/consumer/vitamin-d3-spray',
  ] as const) {
    test(`keine laufende Animation bei reduce: ${route}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await seedConsent(page, route)

      // Im Dev-Modus spritzt Vite das Stylesheet zur Laufzeit ein. Wer sofort
      // misst, erwischt einen Moment, in dem die Utility-Klassen schon
      // wirken, der `@media (prefers-reduced-motion: reduce)`-Block aber noch
      // nicht — und meldet dann Animationen, die eine Sekunde spaeter keine
      // mehr sind. Erst die Medienabfrage pruefen, dann warten, bis die Regel
      // tatsaechlich greift.
      expect(
        await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches),
        'die Medienabfrage greift gar nicht — der Test prueft nichts',
      ).toBe(true)
      await page.waitForFunction(
        () => {
          const d = (v: string) =>
            v
              .split(',')
              .map((x) => parseFloat(x) || 0)
              .reduce((a, b) => Math.max(a, b), 0)
          return !Array.from(document.querySelectorAll('*')).some((e) => {
            const cs = getComputedStyle(e)
            return d(cs.animationDuration) > 0.05 || d(cs.transitionDuration) > 0.05
          })
        },
        { timeout: 15_000 },
      )

      const bewegt = await page.evaluate(() => {
        const dauer = (v: string) =>
          v
            .split(',')
            .map((x) => parseFloat(x) || 0)
            .reduce((a, b) => Math.max(a, b), 0)
        return Array.from(document.querySelectorAll('*'))
          .filter((e) => {
            const cs = getComputedStyle(e)
            return dauer(cs.animationDuration) > 0.05 || dauer(cs.transitionDuration) > 0.05
          })
          .map((e) => `${e.tagName}.${String(e.className).slice(0, 30)}`)
      })
      expect(bewegt.slice(0, 5), 'Animation laeuft trotz prefers-reduced-motion').toEqual([])

      // Sanftes Scrollen ist ebenfalls Bewegung.
      const smooth = await page.evaluate(
        () =>
          Array.from(document.querySelectorAll('*')).filter(
            (e) => getComputedStyle(e).scrollBehavior === 'smooth',
          ).length,
      )
      expect(smooth, 'scroll-behavior bleibt smooth').toBe(0)
    })
  }

  test('Bewegungsreduktion versteckt keinen Inhalt', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await seedConsent(page, '/de/')
    // `Reveal` blendet Inhalt beim Scrollen ein. Wird die Animation
    // abgeschaltet, MUSS der Inhalt trotzdem da sein — sonst tauscht man
    // Bewegung gegen Unsichtbarkeit.
    const unsichtbar = await page.evaluate(() => {
      const out: string[] = []
      for (const el of Array.from(document.querySelectorAll<HTMLElement>('main *'))) {
        const t = (el.textContent || '').replace(/\s+/g, ' ').trim()
        if (!t || el.children.length > 0) continue
        const cs = getComputedStyle(el)
        if (parseFloat(cs.opacity) < 0.1 && cs.visibility !== 'hidden' && cs.display !== 'none') {
          out.push(t.slice(0, 40))
        }
      }
      return out
    })
    expect(unsichtbar, 'Inhalt bleibt bei Bewegungsreduktion unsichtbar').toEqual([])
  })
})

test('PT24.5 — ohne Bewegungsreduktion ist die Animation da (Gegenprobe)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await seedConsent(page, '/de/')
  expect(
    await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    'die Gegenprobe laeuft selbst mit Bewegungsreduktion',
  ).toBe(false)
  const bewegt = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll('*')).filter((e) => {
        const cs = getComputedStyle(e)
        const d = (v: string) =>
          v
            .split(',')
            .map((x) => parseFloat(x) || 0)
            .reduce((a, b) => Math.max(a, b), 0)
        return d(cs.animationDuration) > 0.05 || d(cs.transitionDuration) > 0.05
      }).length,
  )
  // Ohne diese Gegenprobe koennte der Test oben auch dann gruen sein, wenn es
  // ueberhaupt keine Animation mehr gaebe — und pruefte damit nichts.
  expect(bewegt, 'gar keine Animation vorhanden — der reduce-Test prueft nichts').toBeGreaterThan(
    10,
  )
})

// ===========================================================================
// 6. Karussell / Autoplay
// ===========================================================================

test('PT24.5 — es gibt kein selbstlaufendes Medium', async ({ page }) => {
  const funde: string[] = []
  for (const route of ROUTEN) {
    await seedConsent(page, route)
    funde.push(
      ...(await page.evaluate(() => {
        const out: string[] = []
        for (const v of Array.from(document.querySelectorAll('video, audio'))) {
          // Selbstlaufende Medien ueber drei Sekunden brauchen eine
          // Pausenmoeglichkeit (WCAG 2.2.2).
          if (v.hasAttribute('autoplay') && !v.hasAttribute('controls')) {
            out.push(`${location.pathname}: ${v.tagName} autoplay ohne controls`)
          }
        }
        if (document.querySelector('marquee')) out.push(`${location.pathname}: marquee`)
        for (const c of Array.from(
          document.querySelectorAll(
            '[aria-roledescription="carousel"], [class*="carousel"], [class*="swiper"]',
          ),
        )) {
          // Ein Karussell braucht benannte Bedienelemente. Existiert eines
          // ohne, ist das ein Befund — existiert keines, ist nichts zu tun.
          const knoepfe = c.querySelectorAll('button')
          const ohneNamen = Array.from(knoepfe).filter(
            (b) => !b.getAttribute('aria-label') && !(b.textContent || '').trim(),
          )
          if (ohneNamen.length)
            out.push(`${location.pathname}: Karussell mit ${ohneNamen.length} namenlosen Knoepfen`)
        }
        return out
      })),
    )
  }
  expect(funde, 'selbstlaufendes oder unbedienbares Medium').toEqual([])
})

// ===========================================================================
// 7. x10 — Alternativtexte sind uebersetzt, nicht durchgereicht
// ===========================================================================

test('PT24.5 — Alternativtexte sind in jeder Sprache echt uebersetzt', async ({ page }) => {
  const gesammelt: Record<string, string[]> = {}
  for (const locale of ['de', 'en', 'pl', 'cs'] as const) {
    await seedConsent(page, `/${locale}/consumer/vitamin-d3-spray`)
    gesammelt[locale] = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img'))
        .map((i) => (i.getAttribute('alt') || '').trim())
        .filter((a) => a.length > 12),
    )
  }
  for (const [locale, alts] of Object.entries(gesammelt)) {
    expect(alts.length, `${locale}: keine informativen Alt-Texte gefunden`).toBeGreaterThan(0)
    // Kein durchgereichter i18n-Schluessel.
    expect(
      alts.filter((a) => /^[a-z0-9_]+(\.[a-z0-9_]+)+$/i.test(a)),
      `${locale}: i18n-Schluessel statt Text im alt`,
    ).toEqual([])
  }
  // Und keine deutsche Fassung, die in eine andere Sprache durchgereicht wurde.
  for (const locale of ['en', 'pl', 'cs'] as const) {
    const gleich = gesammelt[locale].filter((a) => gesammelt.de.includes(a))
    expect(gleich, `${locale}: Alt-Text ist identisch mit der deutschen Fassung`).toEqual([])
  }
})

test('PT24.5 — der Name der Netzgrafik ist in jeder Sprache uebersetzt', async ({ page }) => {
  const namen: Record<string, string> = {}
  for (const locale of ['de', 'en', 'pl'] as const) {
    await seedConsent(page, `/${locale}/epigenetics/musterbefund/healthy-aging`)
    namen[locale] =
      (await page
        .locator('figure svg[role="img"][aria-label]')
        .first()
        .getAttribute('aria-label')) || ''
  }
  expect(namen.de.length, 'kein Name in der deutschen Fassung').toBeGreaterThan(10)
  expect(namen.en, 'englischer Name ist die deutsche Fassung').not.toBe(namen.de)
  expect(namen.pl, 'polnischer Name ist die deutsche Fassung').not.toBe(namen.de)
})
