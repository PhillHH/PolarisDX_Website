import type { TFunction } from 'i18next'
import { getVertiefung } from '../epigenetics/tokens'
import type { AreaNavItem } from './AreaNav'
import type { JourneyStep } from './JourneySteps'

/**
 * AP34 PT34.2b (SC-003) — Ziele der Bereichsleiste und Schritte des
 * Wegweisers fuer Epigenetik, an einer Stelle. Pfade der Vertiefungen kommen
 * aus der Route-Registry (VERTIEFUNGEN), Beschriftungen aus bestehenden
 * Footer-Schluesseln — dieselben Woerter wie im Footer.
 */
export type EpigeneticsAreaKey =
  | 'overview'
  | 'grundlagen'
  | 'musterbefunde'
  | 'studienlage'
  | 'unterlagen'

export const epigeneticsAreaItems = (tCommon: TFunction): AreaNavItem[] => [
  { key: 'overview', to: '/epigenetics', label: tCommon('area.overview') },
  { key: 'grundlagen', to: getVertiefung('grundlagen').to, label: tCommon('footer.epi_basics') },
  {
    key: 'musterbefunde',
    to: '/epigenetics#musterbefunde',
    label: tCommon('footer.epi_samples'),
    count: 6,
  },
  {
    key: 'studienlage',
    to: getVertiefung('studienlage').to,
    label: tCommon('footer.epi_evidence'),
  },
  { key: 'unterlagen', to: getVertiefung('unterlagen').to, label: tCommon('footer.epi_docs') },
]

export type JourneyKey = 'understand' | 'choose' | 'view' | 'ask'

export const epigeneticsJourney = (t: TFunction): JourneyStep[] =>
  (
    [
      ['understand', getVertiefung('grundlagen').to],
      ['choose', '/epigenetics#analysen'],
      ['view', '/epigenetics#musterbefunde'],
      ['ask', '/epigenetics#inquiry'],
    ] as const
  ).map(([key, to]) => ({
    key,
    to,
    title: t(`journey.${key}.title`),
    text: t(`journey.${key}.text`),
    cta: t(`journey.${key}.cta`),
  }))
