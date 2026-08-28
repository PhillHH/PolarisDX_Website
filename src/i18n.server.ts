/**
 * i18n Server Configuration
 *
 * Diese Datei enthält eine Factory-Funktion die eine NEUE i18next-Instanz
 * pro Server-Request erstellt. Dies ist wichtig um Race Conditions zu
 * vermeiden wenn mehrere Requests gleichzeitig verarbeitet werden.
 *
 * VERWENDUNG:
 * In entry-server.tsx oder server.ts:
 *   import { createI18nInstance } from './i18n.server'
 *   const i18n = await createI18nInstance('de')
 *
 * WICHTIG:
 * - Diese Datei ist NUR für Node.js/Server-Umgebungen gedacht
 * - Sie wird NICHT im Client-Bundle landen (Vite SSR Build)
 * - Jeder Request bekommt seine eigene i18n-Instanz
 */

import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as fs from 'node:fs'
import * as path from 'node:path'

import { i18nConfig, NAMESPACES, FALLBACK_LANGUAGE, normalizeLanguage } from './i18n'
import type { SupportedLanguage, Namespace } from './i18n'

// =============================================================================
// TYPES
// =============================================================================

export interface I18nServerInstance {
  instance: ReturnType<typeof createInstance>
  language: SupportedLanguage
  /** Namespaces, die für die Request-Locale technisch fehlten und auf EN fielen. */
  fallbackNamespaces: readonly Namespace[]
  /** Namespaces, die weder in der Request-Locale noch im EN-Fallback lesbar waren. */
  missingNamespaces: readonly Namespace[]
}

// =============================================================================
// LOCALE LOADING
// =============================================================================

/**
 * Cache für geladene Übersetzungen
 * Verhindert wiederholtes Laden derselben Dateien vom Filesystem
 */
const translationCache = new Map<string, Record<string, unknown>>()

/**
 * Bestimmt den Pfad zum public/locales Ordner
 *
 * In Entwicklung: Projektroot/public/locales
 * In Produktion: dist/client/locales (nach dem Build)
 */
function getLocalesBasePath(): string {
  // In Produktion liegt alles in dist/client
  if (process.env.NODE_ENV === 'production') {
    return path.resolve(process.cwd(), 'dist', 'client', 'locales')
  }
  // In Entwicklung direkt aus public/
  return path.resolve(process.cwd(), 'public', 'locales')
}

/**
 * Lädt eine Übersetzungsdatei vom Filesystem
 *
 * @param lng - Sprachcode (z.B. 'de')
 * @param ns - Namespace (z.B. 'common')
 * @returns Die geladenen Übersetzungen oder ein leeres Objekt bei Fehler
 */
function loadTranslation(lng: string, ns: string): Record<string, unknown> | null {
  const cacheKey = `${lng}:${ns}`

  // Aus Cache zurückgeben wenn vorhanden
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  const basePath = getLocalesBasePath()
  const filePath = path.join(basePath, lng, `${ns}.json`)

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(content) as Record<string, unknown>

    // Im Cache speichern
    translationCache.set(cacheKey, parsed)

    return parsed
  } catch (error) {
    console.error(`[i18n-server] Failed to load translation: ${filePath}`, error)
    return null
  }
}

/**
 * Lädt alle vorhandenen Namespaces für eine Sprache. Fehlende Dateien werden
 * bewusst nicht unter der angeforderten Sprache mit EN-Inhalt maskiert.
 */
function loadAllNamespaces(lng: string): Partial<Record<Namespace, Record<string, unknown>>> {
  const resources: Partial<Record<Namespace, Record<string, unknown>>> = {}

  for (const ns of NAMESPACES) {
    const resource = loadTranslation(lng, ns)
    if (resource) resources[ns] = resource
  }

  return resources
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Erstellt eine neue i18next-Instanz für einen Server-Request
 *
 * WICHTIG: Diese Funktion muss für JEDEN Request aufgerufen werden,
 * um eine eigene Instanz zu erhalten. Teilen von Instanzen führt zu
 * Race Conditions und falschen Sprachen.
 *
 * @param language - Die gewünschte Sprache für diesen Request
 * @returns Eine initialisierte i18next-Instanz
 *
 * @example
 * // In entry-server.tsx
 * export async function render(url: string, language: string) {
 *   const i18n = await createI18nInstance(language);
 *   const html = renderToString(
 *     <I18nextProvider i18n={i18n.instance}>
 *       <App />
 *     </I18nextProvider>
 *   );
 *   return html;
 * }
 */
export async function createI18nInstance(language: string): Promise<I18nServerInstance> {
  // Normalisiere die Sprache (z.B. 'de-DE' -> 'de')
  const normalizedLang = normalizeLanguage(language)

  // Die Request- und die defensive EN-Fallback-Sprache werden vor dem Rendern
  // synchron und vollständig geladen. So kann i18next bei einem fehlenden Key
  // wirklich in den EN-Bundle wechseln, statt EN-Inhalt fälschlich unter der
  // Request-Locale zu registrieren.
  const namespaceResources = loadAllNamespaces(normalizedLang)
  const fallbackResources =
    normalizedLang === FALLBACK_LANGUAGE ? namespaceResources : loadAllNamespaces(FALLBACK_LANGUAGE)
  const fallbackNamespaces = NAMESPACES.filter(
    (namespace) => !namespaceResources[namespace] && Boolean(fallbackResources[namespace]),
  )
  const missingNamespaces = NAMESPACES.filter(
    (namespace) => !namespaceResources[namespace] && !fallbackResources[namespace],
  )

  if (fallbackNamespaces.length > 0) {
    console.warn(
      `[i18n-server] ${normalizedLang} uses defensive ${FALLBACK_LANGUAGE} fallback for: ${fallbackNamespaces.join(', ')}`,
    )
  }

  // Erstelle eine NEUE Instanz (kein Singleton!)
  const instance = createInstance()

  // Initialisiere mit React-Integration
  await instance.use(initReactI18next).init({
    // Shared configuration
    ...i18nConfig,

    // Server-spezifische Einstellungen
    lng: normalizedLang,
    debug: false, // Kein Debug-Output auf dem Server

    // Ressourcen direkt einbinden (kein HTTP Backend)
    resources: {
      [normalizedLang]: namespaceResources,
      ...(normalizedLang === FALLBACK_LANGUAGE ? {} : { [FALLBACK_LANGUAGE]: fallbackResources }),
    },

    // Suspense auf Server deaktivieren
    react: {
      useSuspense: false,
    },

    // Kein Fallback-Loading nötig, da alles vorab geladen wird
    partialBundledLanguages: true,
  })

  return {
    instance,
    language: normalizedLang,
    fallbackNamespaces,
    missingNamespaces,
  }
}

/**
 * Leert den Übersetzungs-Cache
 *
 * Nützlich für Development Hot-Reload oder wenn Übersetzungen
 * zur Laufzeit aktualisiert werden.
 */
export function clearTranslationCache(): void {
  translationCache.clear()
}

/**
 * Vorlädt alle Übersetzungen für alle Sprachen
 *
 * Kann beim Server-Start aufgerufen werden um den Cache zu füllen.
 * Verbessert die Response-Zeit für den ersten Request jeder Sprache.
 */
export function preloadAllTranslations(): void {
  const languages = i18nConfig.supportedLngs

  for (const lng of languages) {
    for (const ns of NAMESPACES) {
      loadTranslation(lng as string, ns)
    }
  }

  console.log(
    `[i18n-server] Preloaded ${languages.length} languages × ${NAMESPACES.length} namespaces`,
  )
}
