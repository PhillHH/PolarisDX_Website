// @vitest-environment node
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

import {
  KONVERSIONEN,
  OUTBOUND_DOMAINS,
  TRACKING_EREIGNISSE,
  pruefeEreignis,
  type TrackingEreignis,
} from './tracking'
import { transportFuer } from './trackingProvider'

/**
 * AP23 PT23.3 — die Taxonomie an ihren Aufrufstellen.
 *
 * Die Fassade kann nicht wissen, OB ein Aufrufer sie zum richtigen Zeitpunkt
 * ruft. Genau das ist bei Konversionen die entscheidende Frage: ein Ereignis
 * am Klick behauptet einen Lead, den es vielleicht nie gab. Diese Datei liest
 * deshalb die Aufrufstellen und prueft ihre POSITION im Kontrollfluss.
 */

const ROOT = path.resolve(__dirname, '..', '..')
const lies = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8')

/**
 * Vokabular und Adapter DEFINIEREN die Namen, sie loesen sie nicht aus. Wer
 * sie mitzaehlt, misst die Typdeklaration als Aufrufstelle.
 */
const DEFINITIONSMODULE = ['src/lib/tracking.ts', 'src/lib/trackingProvider.ts']

/** Alle produktiven Aufrufstellen — ohne Tests, ohne Definitionsmodule. */
const aufrufstellen = (): string[] => {
  const treffer: string[] = []
  const lauf = (dir: string) => {
    for (const eintrag of fs.readdirSync(dir, { withFileTypes: true })) {
      const voll = path.join(dir, eintrag.name)
      if (eintrag.isDirectory()) lauf(voll)
      else if (/\.tsx?$/.test(eintrag.name) && !/\.test\.tsx?$/.test(eintrag.name)) {
        const rel = path.relative(ROOT, voll)
        if (!DEFINITIONSMODULE.includes(rel)) treffer.push(rel)
      }
    }
  }
  lauf(path.join(ROOT, 'src'))
  return treffer
}

/** Quelltext ohne Blockkommentare — begruendende Prosa zaehlt nicht mit. */
const ohneKommentare = (rel: string) =>
  fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

/** Steht `nadel` im Quelltext NACH `tor` und vor dem naechsten `else`? */
const stehtImErfolgszweig = (quelle: string, tor: string, nadel: string): boolean => {
  const torIndex = quelle.indexOf(tor)
  const nadelIndex = quelle.indexOf(nadel)
  return torIndex > -1 && nadelIndex > torIndex
}

describe('PT23.3 · sechs Konversionen, alle state-gated', () => {
  const stellen: Array<[string, string, string, string]> = [
    [
      'contact_submit',
      'src/hooks/useContactForm.ts',
      'if (result.ok)',
      "track({ name: 'contact_submit' })",
    ],
    [
      'support_submit',
      'src/hooks/useSupportForm.ts',
      'if (result.ok)',
      "track({ name: 'support_submit' })",
    ],
    [
      'roi_report_request',
      'src/components/sections/RoiCalculatorSection.tsx',
      'if (result.ok)',
      "track({ name: 'roi_report_request' })",
    ],
    [
      'epigenetics_inquiry_submit',
      'src/components/epigenetics/EpigeneticsInquiryForm.tsx',
      // AP26 PT26.3/PT26.5: der Erfolgszweig steht jetzt ausdruecklich vorn — die Konversion
      // feuert nur bei `accepted`, nie bei einer (retrybaren) Ablehnung.
      'if (response.accepted)',
      "track({ name: 'epigenetics_inquiry_submit'",
    ],
    [
      'lead_magnet_submit',
      'src/components/resources/ResourceGateForm.tsx',
      "setPhase('done')",
      "track({ name: 'lead_magnet_submit'",
    ],
  ]

  it('kennt genau diese fuenf als Konversionen', () => {
    expect([...KONVERSIONEN].sort()).toEqual(stellen.map(([name]) => name).sort())
  })

  it('fuehrt `consumer_order_submit` NICHT als Konversion — Shopify besitzt den Verkauf', () => {
    /**
     * AP23, Stand 2026-09-11. Der Produktverkauf laeuft ueber Shopify; die
     * Website baut keinen eigenen Bestell-Konversionsweg und dupliziert
     * Shopifys `view_item`/`add_to_cart`/`begin_checkout`/`purchase` nicht.
     *
     * Das Ereignis bleibt BESTEHEN und feuert unveraendert nach bestaetigter
     * Persistenz: es misst die Bestell-ANFRAGE der AP22-Journey
     * `consumer_order` — einen Lead, keinen Kauf. Es zaehlt nur nicht mehr
     * als Konversion und verlangt keinen Conversion-Tag im Container.
     */
    expect(KONVERSIONEN).not.toContain('consumer_order_submit' as never)
    expect(TRACKING_EREIGNISSE).toContain('consumer_order_submit')

    // Der Aufruf steht weiterhin hinter dem Persistenz-Tor.
    const quelle = lies('src/pages/consumer/OrderForm.tsx')
    expect(quelle).toContain('if (res.ok)')
    expect(quelle.indexOf('trackConsumerOrderSubmit(')).toBeGreaterThan(
      quelle.indexOf('if (res.ok)'),
    )
  })

  it('baut keine Shopify-Ecommerce-Ereignisse nach', () => {
    // Shopify besitzt diese vier. Die Website darf sie nicht spiegeln.
    for (const shopify of ['view_item', 'add_to_cart', 'begin_checkout', 'purchase']) {
      expect(TRACKING_EREIGNISSE, shopify).not.toContain(shopify)
    }
  })

  it.each(stellen)('%s feuert erst hinter dem Persistenz-Tor', (_name, datei, tor, aufruf) => {
    const quelle = lies(datei)
    expect(quelle, `${datei}: Tor fehlt`).toContain(tor)
    expect(quelle, `${datei}: Aufruf fehlt`).toContain(aufruf)
    expect(stehtImErfolgszweig(quelle, tor, aufruf), `${datei}: Aufruf steht vor dem Tor`).toBe(
      true,
    )
  })

  it('traegt in keiner Konversion eine Vorgangsnummer oder ein Kontaktdatum', () => {
    // Die drei kontextlosen Konversionen tragen ueberhaupt keine Parameter.
    for (const name of ['contact_submit', 'support_submit', 'roi_report_request'] as const) {
      const geprueft = pruefeEreignis({ name } as TrackingEreignis)
      expect(Object.keys(geprueft ?? {})).toEqual(['name'])
    }
    // Angehaengte Felder werden nicht durchgereicht.
    const mit = pruefeEreignis({
      name: 'contact_submit',
      leadId: 'a1b2',
      reference: 'PDX-1234ABCD',
      email: 'ada@praxis.example',
    } as unknown as TrackingEreignis)
    expect(Object.keys(mit ?? {})).toEqual(['name'])
  })

  it('nimmt beim Lead-Magneten nur die Asset-Kennung an', () => {
    expect(pruefeEreignis({ name: 'lead_magnet_submit', asset: 'poc-whitepaper' })).toEqual({
      name: 'lead_magnet_submit',
      asset: 'poc-whitepaper',
    })
    // Weder Anspruchs-ID noch Token noch Dateiname.
    expect(
      pruefeEreignis({ name: 'lead_magnet_submit', asset: 'Whitepaper POC 2026.pdf' } as never),
    ).toBeNull()
  })
})

describe('PT23.3 · download_delivered nur nach beobachtetem Zustellerfolg', () => {
  const quelle = lies('src/components/resources/ResourceGateForm.tsx')

  it('haengt nicht am Klick, sondern an der Antwort der geschuetzten Route', () => {
    // Der Aufruf steht hinter der Erfolgspruefung, nicht im Klick-Handler davor.
    const fetchIndex = quelle.indexOf('await fetch(url')
    const guardIndex = quelle.indexOf('if (!response.ok)')
    const eventIndex = quelle.indexOf("name: 'download_delivered'")
    expect(fetchIndex).toBeGreaterThan(-1)
    expect(guardIndex).toBeGreaterThan(fetchIndex)
    expect(eventIndex).toBeGreaterThan(guardIndex)
  })

  it('meldet bei einer Fehlerantwort NICHTS und laesst den Download zu', () => {
    const fehlerzweig = quelle.slice(
      quelle.indexOf('if (!response.ok)'),
      quelle.indexOf("name: 'download_delivered'"),
    )
    // Im Fehlerzweig steht der Rueckfall auf die native Navigation …
    expect(fehlerzweig).toContain('window.location.href = url')
    // … und kein Ereignis.
    expect(fehlerzweig).not.toContain('download_delivered')
  })

  it('holt den Anspruch genau EINMAL — kein Vorabtest verbrennt einen Versuch', () => {
    expect(quelle.match(/await fetch\(url/g) ?? []).toHaveLength(1)
    expect(quelle).not.toMatch(/method:\s*'HEAD'/)
  })

  it('ist ein anderes Ereignis als die Konversion', () => {
    expect(KONVERSIONEN).not.toContain('download_delivered' as never)
  })
})

describe('PT23.3 · Engagement bleibt datenschutzfreundlich', () => {
  it('meldet bei der Suche Trefferzahl und Laengenklasse, nie die Eingabe', () => {
    expect(pruefeEreignis({ name: 'search', treffer: 3, laenge: 'mittel' })).toEqual({
      name: 'search',
      treffer: 3,
      laenge: 'mittel',
    })
    // Eine mitgeschickte Eingabe wird nicht uebernommen.
    const mit = pruefeEreignis({
      name: 'search',
      treffer: 1,
      laenge: 'lang',
      query: 'diabetes typ 2 praxis mueller',
    } as unknown as TrackingEreignis)
    expect(Object.keys(mit ?? {}).sort()).toEqual(['laenge', 'name', 'treffer'])
  })

  it('nimmt die Suchmodal-Quelle die Eingabe gar nicht erst auf', () => {
    const modal = lies('src/components/ui/SearchModal.tsx')
    const aufruf = modal.slice(modal.indexOf("name: 'search'"), modal.indexOf('}, 900)'))
    expect(aufruf).not.toMatch(/\bquery\b/)
    expect(aufruf).not.toContain('normalizedQuery,')
    expect(aufruf).toContain('laengenklasse(')
  })

  it('meldet ausserhalb nur bekannte Domains, nie den vollen Link', () => {
    expect(pruefeEreignis({ name: 'outbound_click', domain: 'instagram.com' })).toEqual({
      name: 'outbound_click',
      domain: 'instagram.com',
    })
    expect(
      pruefeEreignis({ name: 'outbound_click', domain: 'irgendwo.example' } as never),
    ).toBeNull()
    expect(
      pruefeEreignis({
        name: 'outbound_click',
        domain: 'https://calendar.example/termin/ada-beispiel',
      } as never),
    ).toBeNull()
    expect(OUTBOUND_DOMAINS.length).toBeGreaterThan(0)
  })

  it('nimmt beim Panel nur allowlistete Slugs an', () => {
    expect(
      pruefeEreignis({ name: 'panel_select', panel: 'freitext' as never, weg: 'karte' }),
    ).toBeNull()
  })
})

describe('PT23.3 · keine Doppelzaehlung', () => {
  it('meldet ein Seitenaufruf-Ereignis nur bei geaendertem PFAD', () => {
    const quelle = lies('src/components/analytics/GtmPageview.tsx')
    // Der zuletzt gemeldete Pfad wird festgehalten …
    expect(quelle).toContain('lastPath')
    // … und ein unveraenderter Pfad uebersprungen. Ohne diese Schranke
    // erzeugte eine reine Parameteraenderung einen zweiten Seitenaufruf,
    // weil der Effekt an `search` haengt und die Fassade die Query verwirft.
    expect(quelle).toContain('if (pfad === lastPath.current) return')
  })

  it('ueberspringt den ersten Mount — den Initial-Load zaehlt der Container', () => {
    const quelle = lies('src/components/analytics/GtmPageview.tsx')
    expect(quelle).toContain('if (isFirst.current)')
    // Die Annahme ist benannt und als extern zu pruefen markiert.
    expect(quelle).toContain('CTC-10')
  })

  it('gibt es fuer den Seitenaufruf genau EINEN Ausloeser im Quellbaum', () => {
    const treffer = aufrufstellen().filter((rel) => /name:\s*'page_view'/.test(ohneKommentare(rel)))
    expect(treffer).toEqual(['src/components/analytics/GtmPageview.tsx'])
  })

  it('gibt es je Konversion genau EINE Aufrufstelle', () => {
    const zaehler = new Map<string, number>()
    for (const rel of aufrufstellen()) {
      const text = ohneKommentare(rel)
      for (const name of KONVERSIONEN) {
        const n = (text.match(new RegExp(`name:\\s*'${name}'`, 'g')) ?? []).length
        if (n) zaehler.set(name, (zaehler.get(name) ?? 0) + n)
      }
    }
    // `consumer_order_submit` laeuft ueber den Helfer in consumer/tracking.ts
    // und traegt dort seinen Namen genau einmal.
    for (const name of KONVERSIONEN) expect(zaehler.get(name) ?? 0, name).toBe(1)
  })

  it('schickt jedes Ereignis auf genau einem Transportweg', () => {
    for (const name of KONVERSIONEN) expect(transportFuer(name)).toBe('dataLayer')
    expect(transportFuer('download_delivered')).toBe('dataLayer')
    expect(transportFuer('page_view')).toBe('gtag')
  })
})

describe('PT23.3 · x10 Routensemantik', () => {
  it('normalisiert die Sprache auf zwei Kleinbuchstaben', () => {
    for (const roh of ['DE', 'de-DE', 'pl', 'CS']) {
      const e = pruefeEreignis({ name: 'page_view', pfad: '/de/', sprache: roh })
      expect(e, roh).toMatchObject({ sprache: roh.slice(0, 2).toLowerCase() })
    }
    expect(pruefeEreignis({ name: 'page_view', pfad: '/de/', sprache: '' })).not.toHaveProperty(
      'sprache',
    )
  })

  it('behaelt das Sprachpraefix im Pfad — sonst waere nicht segmentierbar', () => {
    for (const locale of ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']) {
      const e = pruefeEreignis({ name: 'page_view', pfad: `/${locale}/contact?x=1` })
      expect(e, locale).toMatchObject({ pfad: `/${locale}/contact` })
    }
  })
})
