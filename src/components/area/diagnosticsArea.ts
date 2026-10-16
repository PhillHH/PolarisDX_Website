import type { TFunction } from 'i18next'
import type { AreaNavItem } from './AreaNav'
import type { StepLink } from './NextSteps'

/**
 * Owner-Entscheidung 2026-10-16 (AP34, offen aus PT34.2d/e): Bereichsleiste
 * und „Naechster Schritt" auch fuer Diagnostik, Service-Seiten und IglooPro.
 *
 * Fuenf echte Ziele wie in Epigenetik: die Uebersicht, die drei Praxisfelder
 * der Startseite und der Reader, mit dem alle Bereiche messen. Beschriftungen
 * sind die bestehenden Header-Schluessel — dieselben Woerter wie im Menue.
 * AreaNav und NextSteps liegen im Shell-Chunk (App.tsx), damit die Leiste das
 * Route-JS-Budget dieser Seiten nicht belastet.
 */
export const diagnosticsAreaItems = (tCommon: TFunction): AreaNavItem[] => [
  { key: 'overview', to: '/diagnostics', label: tCommon('area.overview') },
  { key: 'dental', to: '/diagnostics/dental', label: tCommon('nav.dental') },
  { key: 'beauty', to: '/diagnostics/beauty', label: tCommon('nav.beauty') },
  { key: 'longevity', to: '/diagnostics/longevity', label: tCommon('nav.longevity') },
  { key: 'igloo-pro', to: '/igloo-pro', label: tCommon('nav.iglooPro') },
]

/** Header-Schluessel je Service-ID (src/data/services.tsx). */
const SERVICE_NAV_KEY: Record<string, string> = {
  dental: 'dental',
  beauty: 'beauty',
  longevity: 'longevity',
  'poc-systemloesungen': 'pocSystems',
  'praeventions-checks': 'praeventionsChecks',
  'infektion-entzuendung': 'infektionEntzuendung',
  'stoffwechsel-herz': 'stoffwechselHerz',
  'hormon-tests': 'hormonTests',
  'kompatibilitaet-integration': 'kompatibilitaetIntegration',
}

/**
 * Zurueck/Weiter durch die neun Bereiche in kanonischer Reihenfolge; am
 * Anfang fuehrt Zurueck auf die Uebersicht, am Ende Weiter auf IglooPro.
 */
export function serviceNeighbours(
  tCommon: TFunction,
  order: ReadonlyArray<{ id: string; to: string }>,
  currentId: string,
): { previous?: StepLink; next?: StepLink } {
  const i = order.findIndex((s) => s.id === currentId)
  if (i < 0) return {}
  const step = (to: string, key: string, kicker: 'back' | 'next'): StepLink => ({
    to,
    kicker: tCommon(`area.${kicker}`),
    title: tCommon(key),
  })
  const prev = order[i - 1]
  const next = order[i + 1]
  return {
    previous: prev
      ? step(prev.to, `nav.${SERVICE_NAV_KEY[prev.id]}`, 'back')
      : step('/diagnostics', 'area.overview', 'back'),
    next: next
      ? step(next.to, `nav.${SERVICE_NAV_KEY[next.id]}`, 'next')
      : step('/igloo-pro', 'nav.iglooPro', 'next'),
  }
}
