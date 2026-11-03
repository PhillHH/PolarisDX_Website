import type { TFunction } from 'i18next'

export type HeroStep = { title: string; text: string }

/**
 * Die drei Schritte der Diashow in Folie 1 (SC-021 Nachtrag): Probe · Messung · Ergebnis aus
 * `home.hero.steps`. Faellt ohne Objekt-Rueckgabe (Test-Mock gibt den Key zurueck) auf die
 * Einzelkeys zurueck, damit Markup und Tests dieselbe Form sehen.
 */
export const heroSteps = (t: TFunction): HeroStep[] => {
  const raw = t('hero.steps', { returnObjects: true }) as unknown
  if (Array.isArray(raw) && raw.length) return raw as HeroStep[]
  return [0, 1, 2].map((i) => ({
    title: String(t(`hero.steps.${i}.title`)),
    text: String(t(`hero.steps.${i}.text`)),
  }))
}
