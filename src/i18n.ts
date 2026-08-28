/**
 * i18n Shared Configuration
 *
 * Diese Datei enthält die gemeinsame Konfiguration für i18next,
 * die sowohl auf dem Client als auch auf dem Server verwendet wird.
 *
 * WICHTIG: Diese Datei darf KEINE Browser-APIs (window, document, localStorage)
 * und KEINE Node-APIs (fs, path) importieren oder verwenden.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface I18nConfig {
  fallbackLng: SupportedLanguage
  supportedLngs: readonly SupportedLanguage[]
  defaultNS: Namespace
  fallbackNS: Namespace
  ns: readonly Namespace[]
  load: 'languageOnly' | 'currentOnly' | 'all'
  nonExplicitSupportedLngs: boolean
  interpolation: {
    escapeValue: boolean
  }
  react: {
    useSuspense: boolean
  }
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Alle unterstützten Sprachen
 */
export const SUPPORTED_LANGUAGES = [
  'de',
  'en',
  'pl',
  'fr',
  'it',
  'es',
  'pt',
  'da',
  'nl',
  'cs',
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

/**
 * Reguläre Default-/x-default-Sprache.
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'de'

/**
 * Defensive Fallback-Sprache bei einem technischen Übersetzungsfehler.
 * Sie ist ausdrücklich kein Ersatz für die geplante x10-Lokalisierung.
 */
export const FALLBACK_LANGUAGE: SupportedLanguage = 'en'

/**
 * Produktiv geladene Namespaces.
 *
 * Die Liste bildet ausschließlich aktuell produktiv gerenderte Bereiche ab.
 * Historische Shop-/Case-Study-Dateien bleiben bewusst außerhalb dieses
 * Ladevertrags, damit Backlog-Features nicht versehentlich reaktiviert werden.
 */
export const PRODUCTIVE_NAMESPACES = [
  'common',
  'home',
  'about',
  'articles',
  'contact',
  'services',
  'events',
  'downloads',
  'epigenetics',
  'legal',
  'products',
  'support',
  'vitd3spray',
  'specialty',
  'consumer',
] as const

export type Namespace = (typeof PRODUCTIVE_NAMESPACES)[number]

/**
 * Nicht produktiv geladene Namespace-Klassifikation. Shop und Case Studies
 * bleiben gemäß DEC-RL-015 Backlog; sie sind keine Fallback-Quelle.
 */
export const LEGACY_NAMESPACES = [] as const
export const BACKLOG_NAMESPACES = ['casestudies', 'shop'] as const
export const DEFERRED_OWNER_NAMESPACES = [] as const

/** Rückwärtskompatibler Name für bestehende produktive Konsumenten. */
export const NAMESPACES = PRODUCTIVE_NAMESPACES

/**
 * Standard-Namespace
 */
export const DEFAULT_NS: Namespace = 'home'

/**
 * Fallback-Namespace
 */
export const FALLBACK_NS: Namespace = 'common'

// =============================================================================
// SHARED CONFIGURATION
// =============================================================================

/**
 * Gemeinsame i18next-Konfiguration für Client und Server
 *
 * Diese Konfiguration wird von i18n.client.ts und i18n.server.ts
 * verwendet, um konsistentes Verhalten zu gewährleisten.
 */
export const i18nConfig: I18nConfig = {
  fallbackLng: FALLBACK_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  defaultNS: DEFAULT_NS,
  fallbackNS: FALLBACK_NS,
  ns: NAMESPACES,
  load: 'languageOnly',
  nonExplicitSupportedLngs: true,

  interpolation: {
    escapeValue: false,
  },

  react: {
    useSuspense: true,
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Prüft ob eine Sprache unterstützt wird
 */
export function isValidLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
}

/**
 * Normalisiert einen Sprachcode (z.B. 'de-DE' -> 'de')
 */
export function normalizeLanguage(lang: string | null | undefined): SupportedLanguage {
  if (!lang) return DEFAULT_LANGUAGE
  const baseLang = lang.split('-')[0].toLowerCase()
  return isValidLanguage(baseLang) ? baseLang : DEFAULT_LANGUAGE
}

/**
 * Gibt den Pfad zu einer Locale-Datei zurück (relativ zu public/)
 */
export function getLocaleFilePath(lng: string, ns: string): string {
  return `/locales/${lng}/${ns}.json`
}

/**
 * Extrahiert die Sprache aus einem URL-Pathname.
 *
 * Wird von Client (entry-client, i18n.client) und Server genutzt.
 * Erwartet Pfade mit Sprach-Prefix: /en/about, /de/, /fr/contact
 *
 * @returns Die erkannte Sprache oder DEFAULT_LANGUAGE als Fallback.
 */
export function extractLanguageFromPathname(pathname: string): SupportedLanguage {
  return getLanguageFromPathname(pathname) ?? DEFAULT_LANGUAGE
}

/**
 * Liest ausschließlich ein kanonisches Locale-Präfix aus einem URL-Pfad.
 * Anders als `extractLanguageFromPathname` unterscheidet diese Variante einen
 * fehlenden/ungültigen Präfix vom regulären Default `de`; der Express-Server
 * benötigt diese Unterscheidung für seinen bestehenden Redirect-Vertrag.
 */
export function getLanguageFromPathname(pathname: string): SupportedLanguage | null {
  const match = pathname.match(/^\/([a-z]{2})(\/|$)/)
  if (match && isValidLanguage(match[1])) {
    return match[1]
  }
  return null
}
