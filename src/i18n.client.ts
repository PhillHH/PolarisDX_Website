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

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

import { i18nConfig, extractLanguageFromPathname } from './i18n';

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
const urlLanguage = extractLanguageFromPathname(window.location.pathname);

// =============================================================================
// CLIENT-SPECIFIC CONFIGURATION
// =============================================================================

i18n
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
  });

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Die i18next-Instanz für direkten Zugriff
 *
 * Normalerweise sollte useTranslation() aus react-i18next verwendet werden.
 * Diese Instanz wird exportiert für Fälle wo kein React-Kontext verfügbar ist.
 */
export default i18n;
