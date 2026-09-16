import { test, expect, type Page } from '@playwright/test'

/**
 * PT24.4 — Kontrast.
 *
 * Gemessen wird an ECHTEN PIXELN, nicht an `getComputedStyle`. Der Grund steht
 * im Vertrag (§7.2) und ist in PT24.3 teuer gelernt worden: wer den Hintergrund
 * ueber die Elternkette bis zur ersten nicht-transparenten `background-color`
 * sucht, sieht keine `background-image` — weisser Text ueber einem Navy-Verlauf
 * landet dann rechnerisch auf der hellen Rumpf-Flaeche und erzeugt Befunde, die
 * es nicht gibt.
 *
 * Das Verfahren: Text unsichtbar schalten, Bildschirmfoto machen, die Flaeche
 * unter jedem Textknoten abtasten. Was bleibt, ist der Untergrund — samt
 * Verlauf, Bild und Ueberlagerung.
 *
 * ZWEI MESSFALLEN, beide in PT24.4 zugeschlagen und deshalb hier als Regel:
 *
 *  1. **Rechtecke und Foto muessen zum selben Zustand gehoeren.** Der erste
 *     Anlauf verglich Rechtecke mit einem Bild aus einem anderen Scrollstand
 *     und meldete 199 Befunde, von denen die Mehrheit Fliesstext auf einer
 *     navyblauen Flaeche behauptete, die es dort nie gab.
 *  2. **Nur vollstaendig freiliegende Elemente messen.** Ein Absatz, der halb
 *     unter der fixierten Kopfzeile liegt, wird sonst mitsamt der blau
 *     verwaschenen Kopfzeile abgetastet.
 *
 * Nicht hier: Semantik (PT24.1), Tastatur (PT24.2), Fokusverwaltung (PT24.3),
 * Medien (PT24.5), der breite axe-Lauf (PT24.6).
 */

// ===========================================================================
// Farbrechnung
// ===========================================================================

type Farbe = { r: number; g: number; b: number; a: number }

const parseFarbe = (c: string): Farbe | null => {
  const m = String(c).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/)
  return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null
}
const leuchtdichte = ({ r, g, b }: Farbe) => {
  const f = (v: number) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ueber = (vorn: Farbe, hinten: Farbe): Farbe => ({
  r: vorn.r * vorn.a + hinten.r * (1 - vorn.a),
  g: vorn.g * vorn.a + hinten.g * (1 - vorn.a),
  b: vorn.b * vorn.a + hinten.b * (1 - vorn.a),
  a: 1,
})
const verhaeltnis = (x: Farbe, y: Farbe) => {
  const [l1, l2] = [leuchtdichte(x), leuchtdichte(y)].sort((a, b) => b - a)
  return +((l1 + 0.05) / (l2 + 0.05)).toFixed(2)
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
  await expect(page.locator('section[aria-labelledby="cookie-banner-title"]')).toHaveCount(0)
  await page.waitForTimeout(300)
}

// ===========================================================================
// Pixelabtastung: Textknoten gegen den wirklich sichtbaren Untergrund
// ===========================================================================

/** Im Browser: Kandidaten einsammeln (Farbe, Groesse, Rechteck). */
const sammleKandidaten = () => {
  const out: {
    id: string
    text: string
    color: string
    size: number
    weight: number
    cls: string
    tag: string
    ariaHidden: boolean
    rect: { x: number; y: number; w: number; h: number }
  }[] = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
  let el = walker.currentNode as HTMLElement | null
  let i = 0

  // Unterkante aller fixierten/klebenden Flaechen: darunter faengt der
  // messbare Bereich an. `sticky` MUSS mit hinein — der erste Entwurf fragte
  // nur nach `fixed` und liess damit die klebende Kapitelleiste des
  // Musterbefunds aus. Eine Einordnungs-Plakette, die halb darunter lag,
  // wurde dann samt Navy abgetastet und als 2,58:1 gemeldet, obwohl sie in
  // Wahrheit auf ihrer eigenen hellen Flaeche bei 4,65:1 liegt.
  const sperre = Array.from(
    document.querySelectorAll<HTMLElement>('header, [class*="fixed"], [class*="sticky"]'),
  )
    .filter((e) => {
      const p = getComputedStyle(e)
      return (
        (p.position === 'fixed' || p.position === 'sticky') && e.getBoundingClientRect().height > 0
      )
    })
    .reduce((max, e) => Math.max(max, e.getBoundingClientRect().bottom), 0)

  while (el) {
    const eigenerText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => (n.textContent || '').trim())
      .join(' ')
      .trim()
    if (eigenerText) {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      // Inhalt eines ZUGEKLAPPTEN <details> hat in Chromium weiterhin ein
      // Rechteck, ist aber nicht dargestellt.
      const d = el.closest('details')
      const imZugeklapptenDetails = !!d && !d.open && !el.closest('summary')
      const sichtbar =
        cs.visibility !== 'hidden' &&
        cs.display !== 'none' &&
        parseFloat(cs.opacity) > 0.05 &&
        !imZugeklapptenDetails &&
        cs.clip !== 'rect(0px, 0px, 0px, 0px)' &&
        r.width > 8 &&
        r.height > 8 &&
        r.top >= sperre + 2 &&
        r.bottom <= window.innerHeight - 2 &&
        r.left >= 0 &&
        r.right <= window.innerWidth
      if (sichtbar) {
        const id = `pt244-${i++}`
        el.setAttribute('data-pt244', id)
        out.push({
          id,
          text: eigenerText.slice(0, 40),
          color: cs.color,
          size: parseFloat(cs.fontSize),
          weight: Number(cs.fontWeight) || 400,
          cls: String(el.className).slice(0, 60),
          tag: el.tagName,
          ariaHidden: !!el.closest('[aria-hidden="true"], [aria-hidden]'),
          rect: { x: r.left, y: r.top, w: r.width, h: r.height },
        })
      }
    }
    el = walker.nextNode() as HTMLElement | null
  }
  return out
}

/**
 * Reines Satzzeichen ohne Buchstaben und Ziffern. Ein `aria-hidden`-Trenner wie
 * „●" traegt keine Information — er ist die optische Entsprechung eines
 * Leerraums. WCAG 1.4.3 gilt fuer Text, 1.4.11 fuer Grafik, die zum Verstehen
 * noetig ist; beides trifft hier nicht zu. Bewusst benannt und begruendet,
 * nicht stillschweigend weggefiltert.
 */
const istDekorativesZeichen = (text: string, ariaHidden: boolean) =>
  ariaHidden && !/[\p{L}\p{N}]/u.test(text)

async function messeTextkontrast(page: Page, route: string) {
  await seedConsent(page, route)
  const hoehe = await page.evaluate(() => document.body.scrollHeight)
  // Die ganze Seite abfahren, nicht nur die ersten Bildschirme: die
  // Hilfstexte, an denen sich Kontrast entscheidet, stehen selten oben.
  const schritte = Math.min(12, Math.max(1, Math.ceil(hoehe / 800)))
  const befunde: {
    cr: number
    soll: number
    fg: string
    bg: string
    text: string
    cls: string
    px: number
  }[] = []

  for (let s = 0; s < schritte; s++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), s * 800)
    await page.waitForTimeout(600)

    const vorher = await page.evaluate(() => Math.round(window.scrollY))
    const kandidaten = await page.evaluate(sammleKandidaten)
    if (kandidaten.length === 0) {
      await page.reload({ waitUntil: 'networkidle' })
      await page.waitForTimeout(300)
      continue
    }

    await page.addStyleTag({
      content: `*,*::before,*::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}`,
    })
    await page.waitForTimeout(250)
    const png = await page.screenshot({ type: 'png' })
    const nachher = await page.evaluate(() => Math.round(window.scrollY))
    // Rechtecke und Foto MUESSEN zum selben Zustand gehoeren.
    expect(nachher, `${route}: die Seite ist waehrend der Messung gescrollt`).toBe(vorher)

    const proben: { id: string; bg: string | null }[] = await page.evaluate(
      async ({ dataUrl, kandidaten }) => {
        const img = new Image()
        await new Promise((res, rej) => {
          img.onload = res
          img.onerror = rej
          img.src = dataUrl
        })
        const dpr = img.width / window.innerWidth
        const c = document.createElement('canvas')
        c.width = img.width
        c.height = img.height
        const ctx = c.getContext('2d', { willReadFrequently: true })!
        ctx.drawImage(img, 0, 0)
        return kandidaten.map((k) => {
          const x = Math.round(k.rect.x * dpr)
          const y = Math.round(k.rect.y * dpr)
          const w = Math.max(1, Math.round(k.rect.w * dpr))
          const h = Math.max(1, Math.round(k.rect.h * dpr))
          let data: Uint8ClampedArray
          try {
            data = ctx.getImageData(x, y, w, h).data
          } catch {
            return { id: k.id, bg: null }
          }
          // Haeufigste Farbe der Flaeche = der Untergrund.
          const zaehler = new Map<string, number>()
          const schritt = Math.max(1, Math.floor(Math.sqrt((w * h) / 900)))
          for (let py = 0; py < h; py += schritt) {
            for (let px = 0; px < w; px += schritt) {
              const o = (py * w + px) * 4
              const key = `${data[o]},${data[o + 1]},${data[o + 2]}`
              zaehler.set(key, (zaehler.get(key) || 0) + 1)
            }
          }
          let best: string | null = null
          let bestN = 0
          for (const [key, n] of zaehler)
            if (n > bestN) {
              bestN = n
              best = key
            }
          return { id: k.id, bg: best }
        })
      },
      { dataUrl: `data:image/png;base64,${png.toString('base64')}`, kandidaten },
    )

    const nachId = new Map(proben.map((p) => [p.id, p]))
    for (const k of kandidaten) {
      const p = nachId.get(k.id)
      if (!p?.bg) continue
      if (istDekorativesZeichen(k.text, k.ariaHidden)) continue
      const [r, g, b] = p.bg.split(',').map(Number)
      const bg: Farbe = { r, g, b, a: 1 }
      const fg = parseFarbe(k.color)
      if (!fg || fg.a < 0.05) continue
      const gross = k.size >= 24 || (k.size >= 18.66 && k.weight >= 700)
      const cr = verhaeltnis(ueber(fg, bg), bg)
      const soll = gross ? 3 : 4.5
      if (cr < soll) {
        befunde.push({ cr, soll, fg: k.color, bg: p.bg, text: k.text, cls: k.cls, px: k.size })
      }
    }

    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
  }
  return befunde
}

// ===========================================================================
// 1. Textkontrast auf repraesentativen Flaechen
// ===========================================================================

const TEXT_ROUTEN = [
  '/de/',
  '/de/support',
  '/de/contact',
  '/de/epigenetics',
  '/de/epigenetics/musterbefund/metabolic-health',
  '/de/consumer/vitamin-d3-spray',
] as const

for (const route of TEXT_ROUTEN) {
  test(`PT24.4 — Text erfuellt AA: ${route}`, async ({ page }) => {
    const befunde = await messeTextkontrast(page, route)
    expect(
      befunde.map((b) => `${b.cr}:1 (soll ${b.soll}) ${b.fg} auf ${b.bg} — "${b.text}" [${b.cls}]`),
      'Text unter dem AA-Zielwert',
    ).toEqual([])
  })
}

// ===========================================================================
// 1b. Token-Matrix — der Vertrag der Farbwerte selbst
// ===========================================================================

/**
 * Die Seitenmessung oben findet nur, was auf einer der geprueften Routen auch
 * wirklich gerendert wird. Ein Token, das heute nur an drei Stellen haengt,
 * rutscht dabei durch — und genau so ein Token (`gray-500`) war der groesste
 * Einzelbefund dieser Aufgabe. Diese Matrix prueft die Werte direkt: sie
 * faellt, sobald jemand einen Token unter seinen Zielwert zurueckdreht, egal
 * wo er benutzt wird.
 */
const TOKEN_MATRIX = [
  { token: 'text-gray-500', zweck: 'Hilfstext, Bildunterschrift', auf: 'bg-white', soll: 4.5 },
  { token: 'text-gray-500', zweck: 'Hilfstext auf Seitenflaeche', auf: 'bg-slate-50', soll: 4.5 },
  { token: 'text-ui-field', zweck: 'Platzhalter, Hilfstext, Rand', auf: 'bg-white', soll: 4.5 },
  { token: 'text-accent-strong', zweck: 'Handlungslink Consumer', auf: 'bg-white', soll: 4.5 },
  { token: 'text-heading', zweck: 'Ueberschrift, Fliesstext', auf: 'bg-white', soll: 4.5 },
  { token: 'text-befund-red-ink', zweck: 'Einordnung rot', auf: 'bg-befund-red-soft', soll: 4.5 },
  {
    token: 'text-befund-amber-ink',
    zweck: 'Einordnung amber',
    auf: 'bg-befund-amber-soft',
    soll: 4.5,
  },
  {
    token: 'text-befund-green-ink',
    zweck: 'Einordnung gruen',
    auf: 'bg-befund-green-soft',
    soll: 4.5,
  },
  // Nicht-Text: die Begrenzung eines Bedienelements braucht 3:1.
  { token: 'text-ui-field', zweck: 'Begrenzung Bedienelement', auf: 'bg-white', soll: 3 },
] as const

test('PT24.4 — die Farbtoken erfuellen ihre Zielwerte', async ({ page }) => {
  await seedConsent(page, '/de/')
  const gemessen = await page.evaluate(
    (matrix) => {
      const sonde = document.createElement('div')
      sonde.style.position = 'fixed'
      sonde.style.left = '-9999px'
      document.body.appendChild(sonde)
      const out = matrix.map((m) => {
        const flaeche = document.createElement('div')
        flaeche.className = m.auf
        const text = document.createElement('span')
        text.className = m.token
        text.textContent = 'Ag'
        flaeche.appendChild(text)
        sonde.appendChild(flaeche)
        const fg = getComputedStyle(text).color
        const bg = getComputedStyle(flaeche).backgroundColor
        sonde.removeChild(flaeche)
        return { ...m, fg, bg }
      })
      document.body.removeChild(sonde)
      return out
    },
    TOKEN_MATRIX as unknown as { token: string; zweck: string; auf: string; soll: number }[],
  )

  const befunde = gemessen
    .map((m) => {
      const fg = parseFarbe(m.fg)!
      const bg = parseFarbe(m.bg) ?? { r: 255, g: 255, b: 255, a: 1 }
      return { ...m, cr: verhaeltnis(ueber(fg, bg), bg) }
    })
    .filter((m) => m.cr < m.soll)
    .map((m) => `${m.token} auf ${m.auf} (${m.zweck}): ${m.cr} < ${m.soll}`)

  expect(befunde, 'Farbtoken unter seinem Zielwert').toEqual([])
})

// ===========================================================================
// 2. Bedienelemente: Text und Begrenzung in jedem Zustand
// ===========================================================================

/** Ein Bedienelement in einem Zustand ausmessen. */
const messeControl = (sel: string, nth: number) => {
  const el = document.querySelectorAll<HTMLElement>(sel)[nth]
  if (!el) return null
  const cs = getComputedStyle(el)
  const bgHinter = (n: HTMLElement | null): string => {
    let x = n
    while (x && x !== document.documentElement) {
      const c = getComputedStyle(x).backgroundColor
      if (c && !/rgba?\(0,\s*0,\s*0,\s*0\)|transparent/.test(c)) return c
      x = x.parentElement
    }
    return 'rgb(255, 255, 255)'
  }
  return {
    color: cs.color,
    flaeche: cs.backgroundColor,
    umfeld: bgHinter(el.parentElement),
    rand: cs.borderTopColor,
    randBreite: parseFloat(cs.borderTopWidth),
    opacity: parseFloat(cs.opacity),
    size: parseFloat(cs.fontSize),
    weight: Number(cs.fontWeight) || 400,
  }
}

type ControlMessung = NonNullable<ReturnType<typeof messeControl>>

const bewerteControl = (m: ControlMessung) => {
  const fg = parseFarbe(m.color)!
  const umfeld = parseFarbe(m.umfeld) ?? { r: 255, g: 255, b: 255, a: 1 }
  const eigen = parseFarbe(m.flaeche)
  const flaeche = eigen && eigen.a > 0.05 ? ueber(eigen, umfeld) : umfeld
  const op = m.opacity
  const gross = m.size >= 24 || (m.size >= 18.66 && m.weight >= 700)
  const rand = parseFarbe(m.rand)
  return {
    textCr: verhaeltnis(ueber({ ...fg, a: fg.a * op }, flaeche), flaeche),
    textSoll: gross ? 3 : 4.5,
    randCr:
      rand && rand.a > 0.05 && m.randBreite > 0
        ? verhaeltnis(ueber({ ...rand, a: rand.a * op }, umfeld), umfeld)
        : null,
  }
}

const CONTROLS = [
  { name: 'B2B-Eingabefeld', route: '/de/contact', sel: 'input#name', nth: 0 },
  { name: 'B2B-Freitextfeld', route: '/de/contact', sel: 'textarea', nth: 0 },
  {
    name: 'Bereichs-Pill (nicht gewaehlt)',
    route: '/de/contact',
    sel: 'fieldset button[aria-pressed="false"]',
    nth: 0,
  },
  {
    name: 'Bereichs-Pill (gewaehlt)',
    route: '/de/contact',
    sel: 'fieldset button[aria-pressed="true"]',
    nth: 0,
  },
  { name: 'Support-Auswahlfeld', route: '/de/support', sel: 'select#issueType', nth: 0 },
  { name: 'Support-Absenden', route: '/de/support', sel: 'form button[type="submit"]', nth: 0 },
  { name: 'ROI-Zahlenfeld', route: '/de/', sel: 'input#roi-tests', nth: 0 },
] as const

for (const ziel of CONTROLS) {
  test(`PT24.4 — Bedienelement in Ruhe, Hover und Fokus: ${ziel.name}`, async ({ page }) => {
    await seedConsent(page, ziel.route)
    const el = page.locator(ziel.sel).nth(ziel.nth)
    await expect(el, 'Bedienelement nicht gefunden').toHaveCount(1)
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(250)

    const befunde: string[] = []
    for (const zustand of ['normal', 'hover', 'focus'] as const) {
      if (zustand === 'hover') await el.hover({ force: true })
      if (zustand === 'focus') await el.focus()
      await page.waitForTimeout(400)
      const m = await page.evaluate(
        ({ sel, nth, src }) => new Function('sel', 'nth', `return (${src})(sel,nth)`)(sel, nth),
        { sel: ziel.sel, nth: ziel.nth, src: messeControl.toString() },
      )
      expect(m, `${ziel.name}: keine Messung im Zustand ${zustand}`).not.toBeNull()
      const b = bewerteControl(m as ControlMessung)
      if (b.textCr < b.textSoll) befunde.push(`${zustand}: Text ${b.textCr} < ${b.textSoll}`)
      // WCAG 1.4.11: die Begrenzung eines Bedienelements braucht 3:1, wenn sie
      // das Element ueberhaupt erst erkennbar macht.
      if (b.randCr !== null && b.randCr < 3) befunde.push(`${zustand}: Rand ${b.randCr} < 3`)
    }
    expect(befunde, `${ziel.name}: Kontrast unter dem Zielwert`).toEqual([])
  })
}

test('PT24.4 — die Knoepfe im Einwilligungsbanner sind als Bedienelemente erkennbar', async ({
  page,
}) => {
  // Ohne gesetzte Entscheidung, damit der Banner steht. Die drei Knoepfe sind
  // die folgenreichste Entscheidung der Seite — und „Nur notwendige" ist ein
  // weisser Knopf auf weisser Flaeche: ohne ausreichenden Rand ist er als
  // Bedienelement gar nicht zu erkennen (WCAG 1.4.11).
  await page.goto('/de/', { waitUntil: 'networkidle' })
  const banner = page.locator('section[aria-labelledby="cookie-banner-title"]')
  await expect(banner).toBeVisible()

  const anzahl = await banner.getByRole('button').count()
  expect(anzahl, 'zu wenige Knoepfe im Banner').toBeGreaterThanOrEqual(3)

  const befunde: string[] = []
  for (let i = 0; i < anzahl; i++) {
    const m = await page.evaluate(
      ({ nth, src }) =>
        new Function('sel', 'nth', `return (${src})(sel,nth)`)(
          'section[aria-labelledby="cookie-banner-title"] button',
          nth,
        ),
      { nth: i, src: messeControl.toString() },
    )
    if (!m) continue
    const b = bewerteControl(m as ControlMessung)
    const name = await banner.getByRole('button').nth(i).textContent()
    if (b.textCr < b.textSoll) befunde.push(`"${name?.trim()}": Text ${b.textCr} < ${b.textSoll}`)
    if (b.randCr !== null && b.randCr < 3) befunde.push(`"${name?.trim()}": Rand ${b.randCr} < 3`)
  }
  expect(befunde, 'Einwilligungsknopf unter dem Zielwert').toEqual([])
})

test('PT24.4 — der deaktivierte Zustand ist ausgenommen und wird nur festgehalten', async ({
  page,
}) => {
  await seedConsent(page, '/de/contact')
  const werte = await page.evaluate(
    ({ src }) => {
      const el = document.querySelector<HTMLInputElement>('input#name')!
      el.disabled = true
      const m = new Function('sel', 'nth', `return (${src})(sel,nth)`)('input#name', 0)
      el.disabled = false
      return m
    },
    { src: messeControl.toString() },
  )
  // WCAG nimmt inaktive Bedienelemente ausdruecklich aus (1.4.3 und 1.4.11).
  // Der Test haelt nur fest, DASS der Zustand gedaempft ist — und stellt
  // sicher, dass er nicht versehentlich zum Normalzustand wird.
  const b = bewerteControl(werte as ControlMessung)
  expect(b.textCr, 'deaktiviert sieht aus wie aktiv — dann fehlt die Unterscheidung').toBeLessThan(
    4.5,
  )
})

// ===========================================================================
// 3. Dunkle Markenflaechen
// ===========================================================================

test('PT24.4 — Text auf dunklen Markenflaechen erfuellt AA', async ({ page }) => {
  const befunde: string[] = []
  for (const route of [
    '/de/',
    '/de/s3_leitlinie',
    '/de/about',
    '/de/consumer/vitamin-d3-spray',
  ] as const) {
    await seedConsent(page, route)
    befunde.push(
      ...(await page.evaluate(() => {
        const parse = (c: string) => {
          const m = String(c).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/)
          return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null
        }
        const lum = ({ r, g, b }: { r: number; g: number; b: number }) => {
          const f = (v: number) => {
            v /= 255
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
          }
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
        }
        const cr = (
          x: { r: number; g: number; b: number },
          y: { r: number; g: number; b: number },
        ) => {
          const [a, b] = [lum(x), lum(y)].sort((p, q) => q - p)
          return +((a + 0.05) / (b + 0.05)).toFixed(2)
        }
        // Gegen den TATSAECHLICHEN Untergrund messen, nicht gegen beide
        // Markenflaechen pauschal: `white/60` erfuellt AA auf Navy (5,63:1)
        // und faellt auf `brand-blue` durch (4,08:1). Wer beide Faelle auf
        // jedes Element anwendet, meldet Befunde an Stellen, die es nicht gibt.
        // Diese Panels haben solide `background-color` — kein Verlauf, keine
        // Grafik; die Elternkette genuegt hier also.
        const untergrund = (el: HTMLElement) => {
          let n: HTMLElement | null = el
          while (n && n !== document.documentElement) {
            const c = parse(getComputedStyle(n).backgroundColor)
            if (c && c.a > 0.95) return c
            n = n.parentElement
          }
          return null
        }
        const treffer: string[] = []
        for (const el of Array.from(
          document.querySelectorAll<HTMLElement>('[class*="text-white/"]'),
        )) {
          const eigenerText = Array.from(el.childNodes)
            .filter((n) => n.nodeType === 3)
            .map((n) => (n.textContent || '').trim())
            .join('')
            .trim()
          // Nur Elemente mit eigenem Text; reine Icon-Traeger sind Dekor.
          if (!eigenerText || !/[\p{L}\p{N}]/u.test(eigenerText)) continue
          const cs = getComputedStyle(el)
          const r = el.getBoundingClientRect()
          if (cs.visibility === 'hidden' || cs.display === 'none' || r.width < 4) continue
          const fg = parse(cs.color)
          const bg = untergrund(el)
          if (!fg || !bg) continue
          if (lum(bg) > 0.2) continue // helle Flaeche — nicht Gegenstand dieses Tests
          const px = parseFloat(cs.fontSize)
          const gross = px >= 24 || (px >= 18.66 && (Number(cs.fontWeight) || 400) >= 700)
          const soll = gross ? 3 : 4.5
          const vorn = {
            r: fg.r * fg.a + bg.r * (1 - fg.a),
            g: fg.g * fg.a + bg.g * (1 - fg.a),
            b: fg.b * fg.a + bg.b * (1 - fg.a),
          }
          const wert = cr(vorn, bg)
          if (wert < soll) {
            treffer.push(
              `${location.pathname}: ${cs.color} auf rgb(${bg.r},${bg.g},${bg.b}) = ${wert} < ${soll} (${px}px) — "${eigenerText.slice(0, 30)}"`,
            )
          }
        }
        return [...new Set(treffer)]
      })),
    )
  }
  expect(befunde, 'Text auf dunkler Markenflaeche unter AA').toEqual([])
})

// ===========================================================================
// 4. Befund-Ampel: Kontrast UND keine Aussage allein ueber Farbe
// ===========================================================================

test('PT24.4 — die Befund-Ampel traegt ihre Aussage im Text, nicht in der Farbe', async ({
  page,
}) => {
  await seedConsent(page, '/de/epigenetics/musterbefund/metabolic-health')

  const plaketten = await page.evaluate(() => {
    const out: { text: string; color: string; bg: string; px: number; weight: number }[] = []
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('span'))) {
      const cls = String(el.className)
      // NUR die Plaketten: ein Element mit `bg-befund-*-soft` UND
      // `text-befund-*-ink` ist eine Einordnung. Ein blosser `text-befund-*`
      // kann auch eine Zahl im Diagrammkopf sein, die ihre Bedeutung aus dem
      // Umfeld bezieht — und ein leerer Wrapper ist gar keine Aussage.
      if (!/bg-befund-/.test(cls) || !/text-befund-/.test(cls)) continue
      const cs = getComputedStyle(el)
      out.push({
        text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
        color: cs.color,
        bg: cs.backgroundColor,
        px: parseFloat(cs.fontSize),
        weight: Number(cs.fontWeight) || 400,
      })
    }
    return out
  })

  expect(plaketten.length, 'keine Einordnungs-Plaketten gefunden').toBeGreaterThan(0)

  const ohneText = plaketten.filter((p) => !/[\p{L}\p{N}]/u.test(p.text))
  // Die drei Ampeltoene unterscheiden sich in der Helligkeit nur um rund
  // 1,02:1 — wer Farbtoene nicht trennen kann, sieht drei gleich helle
  // Flaechen. Die Aussage MUSS im Text stehen.
  expect(ohneText, 'Einordnung ohne Text — Aussage haengt allein an der Farbe').toEqual([])

  const zuSchwach = plaketten
    .map((p) => {
      const fg = parseFarbe(p.color)!
      const bg = parseFarbe(p.bg) ?? { r: 255, g: 255, b: 255, a: 1 }
      const gross = p.px >= 24 || (p.px >= 18.66 && p.weight >= 700)
      return { ...p, cr: verhaeltnis(ueber(fg, bg), bg), soll: gross ? 3 : 4.5 }
    })
    .filter((p) => p.cr < p.soll)
    .map((p) => `"${p.text}" ${p.cr} < ${p.soll}`)
  expect(zuSchwach, 'Plakettentext unter AA').toEqual([])
})

test('PT24.4 — die Balkengrafik ist dekorativ, der Wert steht als Text daneben', async ({
  page,
}) => {
  await seedConsent(page, '/de/epigenetics/musterbefund/metabolic-health')
  const befund = await page.evaluate(() => {
    const svgs = Array.from(document.querySelectorAll('svg')).filter((s) =>
      /fill-befund-/.test(s.innerHTML),
    )
    return {
      anzahl: svgs.length,
      // Entweder aus dem Accessibility-Tree genommen ODER benannt. Die
      // Befund-Miniatur ist bewusst `role="img"` mit `aria-label` — sie zu
      // verstecken waere schlechter, nicht besser.
      wederVerstecktNochBenannt: svgs.filter(
        (s) =>
          s.getAttribute('aria-hidden') !== 'true' &&
          !(s.getAttribute('aria-label') || s.querySelector('title')),
      ).length,
      // Neben jeder Balkengrafik muss eine Zahl oder ein Status stehen.
      ohneTextNachbarn: svgs.filter((s) => {
        const zeile = s.closest('li, tr, div')
        const text = (zeile?.textContent || '').replace(/\s+/g, ' ').trim()
        return !/[\p{L}\p{N}]/u.test(text)
      }).length,
    }
  })
  expect(befund.anzahl, 'keine Balkengrafik gefunden').toBeGreaterThan(0)
  expect(
    befund.wederVerstecktNochBenannt,
    'Befund-Grafik ist weder als dekorativ ausgezeichnet noch benannt',
  ).toBe(0)
  expect(befund.ohneTextNachbarn, 'Balkengrafik ohne Zahl oder Status daneben').toBe(0)
})

// ===========================================================================
// 5. Keine Regression an der Fokussichtbarkeit (Invariante aus PT24.3)
// ===========================================================================

test('PT24.4 — der Fokusring bleibt auf heller und dunkler Flaeche sichtbar', async ({ page }) => {
  for (const [route, sel] of [
    ['/de/', 'header nav a'],
    ['/de/contact', 'input#name'],
  ] as const) {
    await seedConsent(page, route)
    await page.locator(sel).first().focus()
    // Die Bausteine blenden den Ring ueber 300ms ein.
    await page.waitForTimeout(400)
    const r = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement
      const cs = getComputedStyle(a)
      return {
        hatRing: cs.boxShadow !== 'none',
        hatOutline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
      }
    })
    expect(r.hatRing || r.hatOutline, `${route}: kein Fokusindikator mehr`).toBe(true)
  }
})
