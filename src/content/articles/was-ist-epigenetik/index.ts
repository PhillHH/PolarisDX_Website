import {
  SUPPORTED_LANGUAGES,
  extractLanguageFromPathname,
  type SupportedLanguage,
} from '../../../i18n'
import type de from './de.json'

/**
 * SC-031: Texte des interaktiven Artikels „Was ist Epigenetik?". Die deutsche Datei ist die Quelle
 * (inhaltlich aus dem Manuskript des Owners, in einfache Worte gefasst); ihre Form gibt den Typ vor,
 * dem jede Sprache genügen muss (geprüft in `components/explainer/explainer.test.tsx`).
 * Platzhalter stehen als `{{name}}` im Text (siehe `fill`).
 */
export type ExplainerContent = typeof de
export type ExplainerContentByLocale = Partial<Record<SupportedLanguage, ExplainerContent>>
type ExplainerLoader = () => Promise<{ default: ExplainerContent }>

/** Anker der acht Kapitel, in der Reihenfolge von `chapters`. */
export const EXPLAINER_CHAPTER_IDS = [
  'grundidee',
  'mechanismen',
  'umwelt',
  'psyche',
  'bewegung',
  'altern',
  'exerkine',
  'tests',
] as const

/**
 * Lädt die Texte mit einem Loader je Sprache — wie bei den Musterbefunden (AP25 PT25.2, PERF-B03):
 * Der Server lädt alle zehn Fassungen (er rendert jede Sprache aus demselben Modul), der Browser
 * nur die Sprache aus der URL. Ein Sprachwechsel ist immer ein voller Seitenaufruf.
 */
export const loadExplainerContent = async (
  loaders: Record<SupportedLanguage, ExplainerLoader>,
): Promise<ExplainerContentByLocale> => {
  const locales: readonly SupportedLanguage[] =
    typeof window === 'undefined'
      ? SUPPORTED_LANGUAGES
      : [extractLanguageFromPathname(window.location.pathname)]
  const entries = await Promise.all(
    locales.map(async (locale) => [locale, (await loaders[locale]()).default] as const),
  )
  return Object.fromEntries(entries)
}

/** Setzt `{{name}}`-Platzhalter ein. */
export const fill = (text: string, values: Record<string, string | number>): string =>
  text.replace(/{{(\w+)}}/g, (match, key: string) => (key in values ? String(values[key]) : match))
