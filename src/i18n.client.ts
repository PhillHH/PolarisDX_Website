/**
 * i18n Client Configuration
 *
 * Diese Datei initialisiert i18next für den Browser (Client-Side).
 * Die Sprache wird aus dem URL-Prefix extrahiert (Source of Truth).
 *
 * VERWENDUNG:
 * In entry-client.tsx:
 *   import './i18n.client'
 *
 * Dieser Import hat einen Side-Effect: Er initialisiert i18next.
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'

import {
  i18nConfig,
  extractLanguageFromPathname,
  FALLBACK_LANGUAGE,
  NAMESPACES,
  normalizeLanguage,
  SSR_I18N_STATE_ID,
  type Namespace,
  type SsrI18nState,
} from './i18n'

// =============================================================================
// LANGUAGE FROM URL (Source of Truth)
// =============================================================================

/**
 * Die Sprache wird ausschließlich aus dem URL-Prefix bestimmt.
 * /en/about → 'en', /de/ → 'de', /fr/contact → 'fr'
 *
 * Kein localStorage, kein Cookie, kein Accept-Language.
 * Die URL ist die einzige Wahrheit — konsistent mit dem SSR-Server.
 */
const urlLanguage = extractLanguageFromPathname(window.location.pathname)

// =============================================================================
// SSR-ZUSTAND (AP25 PT25.2, PERF-B01)
// =============================================================================

/**
 * Liest den vom Server gerenderten i18n-Zustand. Ohne gueltigen Block (oder bei
 * abweichender Sprache) bleibt es beim bisherigen Verhalten: alle Namespaces
 * vor der Hydration laden.
 */
function readSsrI18nState(): SsrI18nState | null {
  const element = document.getElementById(SSR_I18N_STATE_ID)
  if (!element?.textContent) return null
  try {
    const state = JSON.parse(element.textContent) as SsrI18nState
    if (normalizeLanguage(state.lng) !== urlLanguage || !Array.isArray(state.ns)) return null
    return state
  } catch {
    return null
  }
}

const ssrState = readSsrI18nState()

/** Vor der Hydration noetig: genau die Namespaces, die das SSR-HTML benutzt hat. */
const initialNamespaces: readonly Namespace[] = ssrState
  ? ssrState.ns.filter((ns) => (NAMESPACES as readonly string[]).includes(ns))
  : NAMESPACES

// =============================================================================
// CLIENT-SPECIFIC CONFIGURATION
// =============================================================================

/**
 * i18n.init() gibt ein Promise zurück das resolvet sobald alle
 * Translations geladen sind. entry-client.tsx wartet auf dieses
 * Promise bevor hydrateRoot() aufgerufen wird — so sind die
 * Translations beim Hydration-Zeitpunkt verfügbar und es gibt
 * keinen Suspense-Mismatch mit dem SSR-HTML.
 */
export const i18nReady = i18n
  // HTTP Backend zum Laden der Übersetzungen
  .use(HttpBackend)
  // React-Integration (kein LanguageDetector mehr — URL ist Source of Truth)
  .use(initReactI18next)
  // Initialisierung
  .init({
    // Shared configuration
    ...i18nConfig,

    // Sprache direkt aus URL setzen (kein LanguageDetector!)
    lng: urlLanguage,

    // PT25.2: nur die SSR-Namespaces blockieren die Hydration. Die Fallback-
    // Sprache kommt als Delta aus dem SSR-Zustand (fehlende Schluessel, meist
    // leer) — i18next haelt sie damit fuer geladen und faellt fuer genau die
    // fehlenden Schluessel weiter korrekt zurueck. `partialBundledLanguages`
    // laesst den HTTP-Backend alles uebrige wie bisher nachladen.
    ns: initialNamespaces,
    partialBundledLanguages: true,
    ...(ssrState?.fallback && urlLanguage !== FALLBACK_LANGUAGE
      ? { resources: { [FALLBACK_LANGUAGE]: ssrState.fallback } }
      : {}),

    // Client-spezifische Einstellungen
    debug: import.meta.env.DEV,

    // HTTP Backend Konfiguration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      requestOptions: {
        cache: 'default',
      },
    },

    // Suspense für React 19 Concurrent Mode
    react: {
      useSuspense: true,
    },
  })

// document.documentElement.lang clientseitig synchron halten.
// SSR setzt <html lang> korrekt pro Sprache; bei einem In-App-Sprachwechsel
// (z. B. /de/ → /en/ ohne Vollreload) würde es sonst veralten und
// GtmPageview meldet eine falsche page_language. Initial + bei jedem Wechsel setzen.
if (typeof document !== 'undefined') {
  const syncHtmlLang = (lng: string) => {
    document.documentElement.lang = normalizeLanguage(lng)
  }
  syncHtmlLang(i18n.resolvedLanguage || urlLanguage)
  i18n.on('languageChanged', syncHtmlLang)
}

/**
 * PT25.2: laedt nach der Hydration die restlichen Namespaces der aktuellen
 * Sprache. Clientseitige Navigation findet damit wie vor PT25.2 alle
 * Uebersetzungen bereits vor, ohne dass sie die erste Hydration blockieren.
 */
export function loadRemainingNamespaces(): void {
  const remaining = NAMESPACES.filter((ns) => !i18n.hasResourceBundle(i18n.language, ns))
  if (remaining.length > 0) void i18n.loadNamespaces(remaining)
}

// =============================================================================
// EXPORTS
// =============================================================================

export default i18n
