// @vitest-environment node
/**
 * PT20.1 — About x10/Truth/Contract task-owned test (Fast-Delta V2).
 *
 * Beweist:
 *  - about.json ist in allen zehn Locales vollstaendig (identische Schluesselmenge,
 *    keine leeren Blaetter) -> kein stiller DE/EN-Dauerfallback auf About.
 *  - DE-CTA exakt "Angebot anfragen" (CORP-06 / C20-08).
 *  - Epigenetik ist als eigenstaendige Saeule mit eigener Copy x10 vorhanden (CORP-05).
 *  - Die Pillar-Linkziele sind kanonische Registry-Routen, 200-tauglich und
 *    oeffentlich indexierbar (keine Redirect-Quellen).
 */
import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { SUPPORTED_LANGUAGES } from '../i18n'
import { getCanonicalRouteEntries } from '../routing/routeRegistry'

const LOCALES = SUPPORTED_LANGUAGES as readonly string[]

type JsonLeafMap = Record<string, string>

const flatten = (value: unknown, prefix: string, out: JsonLeafMap): JsonLeafMap => {
  if (typeof value === 'string') {
    out[prefix] = value
    return out
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out)
    }
  }
  return out
}

const loadAbout = (locale: string): JsonLeafMap =>
  flatten(JSON.parse(readFileSync(`public/locales/${locale}/about.json`, 'utf8')), '', {})

const aboutResources = Object.fromEntries(LOCALES.map((locale) => [locale, loadAbout(locale)]))

/** Statisch in AboutPage/AboutPillarsSection referenzierte about:-Schluessel. */
const STATIC_PAGE_KEYS = [
  'hero.caption',
  'hero.title',
  'hero.description',
  'hero.primary_cta',
  'hero.chips.ivdr',
  'hero.chips.partner',
  'hero.chips.reach',
  'hero.stats.locations.value',
  'hero.stats.locations.label',
  'hero.stats.countries.value',
  'hero.stats.countries.label',
  'hero.stats.devices.value',
  'hero.stats.devices.label',
  'hero.visual.c1.value',
  'hero.visual.c1.label',
  'hero.visual.c2.value',
  'hero.visual.c2.label',
  'hero.visual.c3.value',
  'hero.visual.c3.label',
  'mission.caption',
  'mission.title',
  'mission.lead',
  'mission.body',
  'mission.point1',
  'mission.point2',
  'mission.point3',
  'mission.highlight_label',
  'mission.highlight_title',
  'mission.highlight_text',
  'stats_strip.s1.value',
  'stats_strip.s1.label',
  'stats_strip.s2.value',
  'stats_strip.s2.label',
  'stats_strip.s3.value',
  'stats_strip.s3.label',
  'stats_strip.s4.value',
  'stats_strip.s4.label',
  'values.caption',
  'values.title',
  'values.items.precision.title',
  'values.items.precision.text',
  'values.items.proximity.title',
  'values.items.proximity.text',
  'values.items.reliability.title',
  'values.items.reliability.text',
  'dx365_partner.caption',
  'dx365_partner.title',
  'dx365_partner.body',
  'seo.title',
  'seo.description',
  'pillars.caption',
  'pillars.title',
  'pillars.intro',
  'pillars.items.diagnostics.title',
  'pillars.items.diagnostics.text',
  'pillars.items.diagnostics.cta',
  'pillars.items.igloo.title',
  'pillars.items.igloo.text',
  'pillars.items.igloo.cta',
  'pillars.items.epigenetics.title',
  'pillars.items.epigenetics.text',
  'pillars.items.epigenetics.cta',
] as const

describe('PT20.1 About x10 contract', () => {
  it('serves about.json for exactly the ten decision-locked locales', () => {
    expect(LOCALES).toEqual(['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'])
    for (const locale of LOCALES) {
      expect(aboutResources[locale], `about.json missing for ${locale}`).toBeDefined()
    }
  })

  it('provides every page key in every locale — no silent fallback', () => {
    for (const key of STATIC_PAGE_KEYS) {
      for (const locale of LOCALES) {
        const value = aboutResources[locale][key]
        expect(typeof value, `${locale}: about:${key}`).toBe('string')
        expect(value.trim().length, `${locale}: about:${key} empty`).toBeGreaterThan(0)
      }
    }
  })

  it('keeps identical key structure across all ten locales', () => {
    const [first, ...rest] = LOCALES
    const reference = Object.keys(aboutResources[first]).sort()
    for (const locale of rest) {
      expect(Object.keys(aboutResources[locale]).sort(), `key drift in ${locale}`).toEqual(
        reference,
      )
    }
  })

  it('uses the exact general German sales CTA "Angebot anfragen"', () => {
    expect(aboutResources.de['hero.primary_cta']).toBe('Angebot anfragen')
  })

  it('keeps every locale CTA non-empty and distinct from the old team CTA', () => {
    for (const locale of LOCALES) {
      const cta = aboutResources[locale]['hero.primary_cta']
      expect(cta.trim().length).toBeGreaterThan(0)
    }
    expect(aboutResources.de['hero.primary_cta']).not.toBe('Team kennenlernen')
  })

  it('positions Epigenetics as a standalone pillar with real copy in all locales', () => {
    for (const locale of LOCALES) {
      const title = aboutResources[locale]['pillars.items.epigenetics.title']
      const text = aboutResources[locale]['pillars.items.epigenetics.text']
      const cta = aboutResources[locale]['pillars.items.epigenetics.cta']
      expect(title.trim().length, `${locale} epigenetics title`).toBeGreaterThan(0)
      expect(text.trim().length, `${locale} epigenetics text`).toBeGreaterThan(0)
      expect(cta.trim().length, `${locale} epigenetics cta`).toBeGreaterThan(0)
    }
  })

  it('resolves pillar links to canonical registry routes (200/indexable, no redirect source)', () => {
    const routes = getCanonicalRouteEntries()
    for (const routeId of ['diagnostics', 'igloo-pro', 'epigenetics']) {
      const route = routes.find((entry) => entry.id === routeId)
      expect(route, `registry route ${routeId}`).toBeDefined()
      expect(route?.searchEligible).toBe(true)
      expect(route?.indexability).toBe('INDEX_FOLLOW')
      expect(route?.path.startsWith('/')).toBe(true)
    }
  })
})
