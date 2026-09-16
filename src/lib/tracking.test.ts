// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CONSUMER_MENGEN,
  TRACKING_EREIGNISSE,
  normalisierePfad,
  pruefeEreignis,
  resetTrackingForTests,
  setTrackingConsent,
  setTrackingProvider,
  track,
  trackingActive,
  type TrackingEreignis,
} from './tracking'
import { createGoogleTrackingProvider, transportFuer } from './trackingProvider'

/**
 * AP23 PT23.2 — die Fassade ist die einzige Grenze, die Geschaeftscode sieht.
 *
 * Zwei Sperren, beide standardmaessig zu: kein Anbieter, keine Einwilligung.
 */

const senden: TrackingEreignis[] = []
const sammler = (e: TrackingEreignis) => {
  senden.push(e)
}

beforeEach(() => {
  senden.length = 0
  resetTrackingForTests()
})

afterEach(() => {
  resetTrackingForTests()
})

describe('PT23.2 · Auslieferungszustand', () => {
  it('sendet ohne Anbieter nichts — auch mit Einwilligung', () => {
    setTrackingConsent(true)
    expect(trackingActive()).toBe(false)
    track({ name: 'page_view', pfad: '/de/' })
    expect(senden).toEqual([])
  })

  it('sendet ohne Einwilligung nichts — auch mit Anbieter', () => {
    setTrackingProvider(sammler)
    expect(trackingActive()).toBe(false)
    track({ name: 'page_view', pfad: '/de/' })
    track({ name: 'cta_click', ort: 'hero', seite: 'duo' })
    expect(senden).toEqual([])
  })

  it('puffert nichts: vor der Einwilligung verworfene Ereignisse kommen NICHT nach', () => {
    setTrackingProvider(sammler)
    track({ name: 'page_view', pfad: '/de/vorher' })
    track({ name: 'cta_click', ort: 'hero', seite: 'spray' })

    // Einwilligung kommt spaeter — die beiden oben sind endgueltig weg.
    setTrackingConsent(true)
    expect(senden).toEqual([])

    track({ name: 'page_view', pfad: '/de/nachher' })
    expect(senden).toHaveLength(1)
    expect(senden[0]).toMatchObject({ pfad: '/de/nachher' })
  })

  it('sendet mit Anbieter UND Einwilligung', () => {
    setTrackingProvider(sammler)
    setTrackingConsent(true)
    expect(trackingActive()).toBe(true)
    track({ name: 'cta_click', seite: 'duo', ort: 'hero' })
    expect(senden).toHaveLength(1)
  })
})

describe('PT23.2 · Widerruf', () => {
  it('macht track() wieder zur leeren Funktion', () => {
    setTrackingProvider(sammler)
    setTrackingConsent(true)
    track({ name: 'cta_click', ort: 'hero', seite: 'duo' })
    expect(senden).toHaveLength(1)

    // Genau das tut `withdrawGoogleConsent`: Sperre zu, Anbieter abmelden.
    setTrackingConsent(false)
    setTrackingProvider(null)

    track({ name: 'cta_click', ort: 'hero', seite: 'duo' })
    track({ name: 'page_view', pfad: '/de/' })
    expect(senden).toHaveLength(1)
    expect(trackingActive()).toBe(false)
  })

  it('fuehrt nie zwei Anbieter gleichzeitig', () => {
    const zweiter: TrackingEreignis[] = []
    setTrackingProvider(sammler)
    setTrackingProvider((e) => zweiter.push(e))
    setTrackingConsent(true)
    track({ name: 'cta_click', ort: 'hero', seite: 'masks' })
    // Der zweite ERSETZT den ersten — sonst entstuende jedes Ereignis doppelt.
    expect(senden).toHaveLength(0)
    expect(zweiter).toHaveLength(1)
  })

  it('laesst einen werfenden Anbieter die Seite nicht anhalten', () => {
    setTrackingProvider(() => {
      throw new Error('provider down')
    })
    setTrackingConsent(true)
    expect(() => track({ name: 'page_view', pfad: '/de/' })).not.toThrow()
  })
})

describe('PT23.2 · PII- und Freitext-Schranken', () => {
  beforeEach(() => {
    setTrackingProvider(sammler)
    setTrackingConsent(true)
  })

  it('entfernt Query und Fragment aus dem Pfad', () => {
    // Vorher ging `window.location.href` samt Parametern raus.
    expect(normalisierePfad('/de/contact?panel=healthy-aging&intent=quote')).toBe('/de/contact')
    expect(normalisierePfad('https://polarisdx.net/de/contact?source=x#top')).toBe('/de/contact')
    track({ name: 'page_view', pfad: '/de/contact?email=ada@praxis.example' })
    expect(senden[0]).toMatchObject({ pfad: '/de/contact' })
  })

  it.each([
    ['E-Mail im Pfad', '/de/kontakt/ada@praxis.example'],
    ['Token im Pfad', '/de/download/9f2b4c1d8e7a3f5b6c0d1e2f3a4b5c6d'],
    ['das Wort token', '/de/asset/token/abc'],
    ['Telefonnummer', '/de/ruf/+49 151 0000000'],
    ['Geburtsdatum', '/de/patient/1984-03-12'],
  ])('verwirft einen Seitenaufruf mit %s', (_label, pfad) => {
    track({ name: 'page_view', pfad })
    expect(senden).toEqual([])
  })

  it('verwirft einen nicht-absoluten oder uebermaessig langen Pfad', () => {
    expect(normalisierePfad('kein-slash')).toBeNull()
    expect(normalisierePfad('/' + 'a'.repeat(300))).toBeNull()
    expect(normalisierePfad('')).toBeNull()
  })

  it('laesst einen Seitentitel mit Personenbezug weg, statt ihn zu senden', () => {
    track({ name: 'page_view', pfad: '/de/', titel: 'Anfrage von ada@praxis.example' })
    expect(senden).toHaveLength(1)
    expect(senden[0]).not.toHaveProperty('titel')
  })

  it('nimmt nur aufgezaehlte CTA-Orte an — kein slugifizierter Freitext', () => {
    track({ name: 'cta_click', seite: 'spray', ort: 'audience' })
    expect(senden).toHaveLength(1)
    // Genau der Wert, der vorher aus der uebersetzten Ueberschrift entstand.
    track({
      name: 'cta_click',
      seite: 'spray',
      ort: 'audience-fuer-sportlerinnen' as never,
    })
    expect(senden).toHaveLength(1)
  })

  it('nimmt nur bekannte Consumer-Seiten und Produktkennungen an', () => {
    track({ name: 'cta_click', ort: 'nirgendwo' as never })
    track({
      name: 'consumer_order_submit',
      seite: 'duo',
      produkt: 'Inside Out Duo (Set)' as never,
      menge: 1,
    })
    expect(senden).toEqual([])
  })

  it('nimmt nur die Mengen an, die die Bestellstrecke kennt', () => {
    for (const menge of CONSUMER_MENGEN) {
      track({ name: 'consumer_order_submit', seite: 'duo', produkt: 'duo', menge })
    }
    expect(senden).toHaveLength(CONSUMER_MENGEN.length)
    senden.length = 0
    track({ name: 'consumer_order_submit', seite: 'duo', produkt: 'duo', menge: 7 as never })
    expect(senden).toEqual([])
  })

  it('reicht kein Feld durch, das nicht ausdruecklich uebernommen wurde', () => {
    const mit = {
      name: 'cta_click',
      ort: 'hero',
      seite: 'duo',
      email: 'ada@praxis.example',
      nachricht: 'Bitte um Rueckruf',
    } as unknown as TrackingEreignis
    track(mit)
    expect(senden).toHaveLength(1)
    // Aufbauend statt filternd: nur `name` und `seite` existieren ueberhaupt.
    expect(Object.keys(senden[0]).sort()).toEqual(['name', 'ort', 'seite'])
    expect(JSON.stringify(senden[0])).not.toContain('praxis.example')
  })

  it('verwirft ein unbekanntes Ereignis, statt es durchzureichen', () => {
    expect(
      pruefeEreignis({ name: 'lead_email_captured' } as unknown as TrackingEreignis),
    ).toBeNull()
  })
})

describe('PT23.2 · Provider-Adapter', () => {
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void }

  afterEach(() => {
    delete w.dataLayer
    delete w.gtag
  })

  it('legt WEDER dataLayer NOCH gtag an, wenn sie fehlen', () => {
    const provider = createGoogleTrackingProvider()
    provider({ name: 'cta_click', ort: 'hero', seite: 'duo' })
    provider({ name: 'page_view', pfad: '/de/' })
    // Ein zu frueh registrierter Anbieter darf kein Gefaess anlegen, in dem
    // sich etwas ansammelt.
    expect(w.dataLayer).toBeUndefined()
    expect(w.gtag).toBeUndefined()
  })

  it('sendet jedes Ereignis auf GENAU EINEM Weg', () => {
    const gtagCalls: unknown[][] = []
    w.dataLayer = []
    w.gtag = (...args: unknown[]) => gtagCalls.push(args)
    const provider = createGoogleTrackingProvider()

    provider({ name: 'page_view', pfad: '/de/kontakt', sprache: 'de' })
    // Vorher gingen hier ZWEI Ereignisse raus (gtag + virtual_pageview).
    expect(gtagCalls).toHaveLength(1)
    expect(w.dataLayer).toHaveLength(0)

    provider({ name: 'cta_click', seite: 'duo', ort: 'hero' })
    expect(gtagCalls).toHaveLength(1)
    expect(w.dataLayer).toHaveLength(1)
  })

  it('bildet die deutschen Feldnamen auf Auswertungsparameter ab', () => {
    w.dataLayer = []
    createGoogleTrackingProvider()({
      name: 'consumer_order_submit',
      seite: 'duo',
      produkt: 'inside-out-duo',
      menge: 2,
    })
    expect(w.dataLayer?.[0]).toEqual({
      event: 'consumer_order_submit',
      consumer_page: 'duo',
      product: 'inside-out-duo',
      quantity: 2,
    })
  })

  it('kennt fuer jedes Ereignis genau einen Transport', () => {
    for (const name of TRACKING_EREIGNISSE) {
      expect(['gtag', 'dataLayer'], name).toContain(transportFuer(name))
    }
  })

  it('haengt send_to nur an, wenn eine GA4-Kennung konfiguriert ist', () => {
    w.dataLayer = []
    const calls: unknown[][] = []
    w.gtag = (...args: unknown[]) => calls.push(args)

    createGoogleTrackingProvider()({ name: 'page_view', pfad: '/de/' })
    expect(calls[0][2]).not.toHaveProperty('send_to')

    vi.stubEnv('VITE_GA4_MEASUREMENT_ID', 'G-ABCDEFGH12')
    createGoogleTrackingProvider()({ name: 'page_view', pfad: '/de/' })
    expect(calls[1][2]).toMatchObject({ send_to: 'G-ABCDEFGH12' })
    vi.unstubAllEnvs()
  })
})
