/**
 * i18n Client Configuration
 *
 * Diese Datei initialisiert i18next für den Browser (Client-Side).
 * Sie verwendet den LanguageDetector für automatische Spracherkennung
 * und das HTTP Backend zum Laden der Übersetzungen.
 *
 * VERWENDUNG:
 * In entry-client.tsx oder main.tsx:
 *   import './i18n.client'
 *
 * Dieser Import hat einen Side-Effect: Er initialisiert i18next.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

import { i18nConfig } from './i18n';

// =============================================================================
// CLIENT-SPECIFIC CONFIGURATION
// =============================================================================

/**
 * Initialisiere i18next für den Client
 *
 * Features:
 * - Automatische Spracherkennung via querystring, cookie, localStorage, navigator
 * - HTTP Backend lädt Übersetzungen von /locales/{lng}/{ns}.json
 * - Caching in localStorage und Cookie
 * - Debug-Modus in Development
 */
i18n
  // HTTP Backend zum Laden der Übersetzungen
  .use(HttpBackend)
  // Automatische Spracherkennung
  .use(LanguageDetector)
  // React-Integration
  .use(initReactI18next)
  // Initialisierung
  .init({
    // Shared configuration
    ...i18nConfig,

    // Client-spezifische Einstellungen
    debug: import.meta.env.DEV,

    // HTTP Backend Konfiguration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Retry bei Fehlern
      requestOptions: {
        cache: 'default',
      },
    },

    // Spracherkennung Konfiguration
    detection: {
      // Reihenfolge der Erkennung
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      // Wo die Sprache gespeichert wird
      caches: ['localStorage', 'cookie'],
      // Querystring Parameter
      lookupQuerystring: 'lng',
      // Cookie Name
      lookupCookie: 'i18next',
      // localStorage Key
      lookupLocalStorage: 'i18nextLng',
      // HTML lang Attribut
      htmlTag: document.documentElement,
    },

    // Suspense für React 18+ Concurrent Mode
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
