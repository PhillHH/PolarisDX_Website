// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  CONSENT_CHANGED_EVENT,
  CONSENT_REOPEN_EVENT,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  clearConsentDecision,
  currentConsent,
  hasCategoryConsent,
  hasConsentDecision,
  readConsentDecision,
  requestConsentReopen,
  writeConsentDecision,
} from './consentState'

/**
 * AP23 PT23.1 — der gespeicherte Einwilligungszustand.
 *
 * Der wichtigste Fall hier ist der KAPUTTE Eintrag. Vorher las der Banner
 * `localStorage` roh und rendert daraus eine Liste; alles, was kein Array
 * war, warf beim Rendern — auf jeder Seite, weil der Banner global haengt.
 */

describe('PT23.1 · Zustand lesen', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('meldet ohne Eintrag "nicht entschieden" und verweigert alles', () => {
    expect(readConsentDecision()).toBeNull()
    expect(hasConsentDecision()).toBe(false)
    expect(currentConsent()).toMatchObject({ analytics: false, marketing: false })
    expect(hasCategoryConsent('analytics')).toBe(false)
    expect(hasCategoryConsent('marketing')).toBe(false)
  })

  it.each([
    ['kaputtes JSON', '{nicht wirklich json'],
    ['leerer String', ''],
    ['eine Zahl', '5'],
    ['null', 'null'],
    ['ein String', '"granted"'],
    ['Objekt ohne Version', JSON.stringify({ analytics: true, marketing: true })],
    ['falsche Version', JSON.stringify({ version: 0, analytics: true, marketing: true })],
    ['Felder falschen Typs', JSON.stringify({ version: CONSENT_VERSION, analytics: 'ja' })],
  ])('behandelt %s als "nicht entschieden" statt zu werfen', (_label, raw) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, raw)
    expect(() => readConsentDecision()).not.toThrow()
    expect(readConsentDecision()).toBeNull()
    expect(hasCategoryConsent('analytics')).toBe(false)
  })

  it('uebernimmt das unversionierte Altformat NICHT als gueltige Zustimmung', () => {
    // Genau das Format, das bis PT23.1 gespeichert wurde. Es ist lesbar, aber
    // es belegt nicht, fuer welchen Umfang zugestimmt wurde — also gilt es
    // als nicht entschieden, und der Dialog fragt erneut.
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify([
        { id: 'necessary', enabled: true },
        { id: 'analytics', enabled: true },
        { id: 'marketing', enabled: true },
      ]),
    )
    expect(readConsentDecision()).toBeNull()
    expect(hasCategoryConsent('analytics')).toBe(false)
  })

  it('ueberlebt einen blockierten localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('access denied')
    })
    expect(() => readConsentDecision()).not.toThrow()
    expect(readConsentDecision()).toBeNull()
    spy.mockRestore()
  })
})

describe('PT23.1 · Zustand schreiben und widerrufen', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('speichert versioniert, mit Zeitpunkt und ohne Personenbezug', () => {
    const decision = writeConsentDecision(
      { analytics: true, marketing: false },
      () => new Date('2026-09-09T10:00:00.000Z'),
    )
    expect(decision).toEqual({
      version: CONSENT_VERSION,
      decidedAt: '2026-09-09T10:00:00.000Z',
      analytics: true,
      marketing: false,
    })
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY) ?? ''
    // Genau vier Felder — kein Name, keine Kennung, keine URL, kein Zaehler.
    expect(Object.keys(JSON.parse(raw)).sort()).toEqual([
      'analytics',
      'decidedAt',
      'marketing',
      'version',
    ])
    expect(hasCategoryConsent('analytics')).toBe(true)
    expect(hasCategoryConsent('marketing')).toBe(false)
  })

  it('meldet die Aenderung im laufenden Tab (storage feuert nur in fremden)', () => {
    const seen: unknown[] = []
    const listener = (event: Event) => seen.push((event as CustomEvent).detail)
    window.addEventListener(CONSENT_CHANGED_EVENT, listener)
    writeConsentDecision({ analytics: true, marketing: true })
    clearConsentDecision()
    window.removeEventListener(CONSENT_CHANGED_EVENT, listener)
    expect(seen).toHaveLength(2)
    expect(seen[0]).toMatchObject({ analytics: true })
    expect(seen[1]).toBeNull()
  })

  it('entfernt den Eintrag beim Widerruf, statt ihn auf false zu setzen', () => {
    writeConsentDecision({ analytics: true, marketing: true })
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).not.toBeNull()

    clearConsentDecision()
    // Nichts bleibt zurueck: kein Zeitpunkt, kein Zustand, keine Aussage.
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull()
    expect(hasConsentDecision()).toBe(false)
    expect(hasCategoryConsent('analytics')).toBe(false)
  })

  it('faellt bei nicht schreibbarem Speicher auf "keine Einwilligung" zurueck', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    expect(() => writeConsentDecision({ analytics: true, marketing: true })).not.toThrow()
    spy.mockRestore()
    // Nicht gespeichert heisst: beim naechsten Aufruf wird erneut gefragt.
    expect(hasCategoryConsent('analytics')).toBe(false)
  })

  it('oeffnet den Dialog ueber ein Ereignis, ohne den Zustand zu aendern', () => {
    writeConsentDecision({ analytics: true, marketing: false })
    let reopened = 0
    const listener = () => (reopened += 1)
    window.addEventListener(CONSENT_REOPEN_EVENT, listener)
    requestConsentReopen()
    window.removeEventListener(CONSENT_REOPEN_EVENT, listener)
    expect(reopened).toBe(1)
    expect(hasCategoryConsent('analytics')).toBe(true)
  })
})
