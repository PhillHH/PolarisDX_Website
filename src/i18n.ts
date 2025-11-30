import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

/**
 * Konfiguration für i18next (Internationalisierung).
 *
 * Verwendete Plugins:
 * - Backend: Lädt Übersetzungen asynchron (lazy loading) vom Server/Dateisystem.
 * - LanguageDetector: Ermittelt die Nutzersprache automatisch.
 * - initReactI18next: Bindet i18n an React.
 */
i18n
  // Laden der Übersetzungen über HTTP -> siehe /public/locales
  .use(Backend)
  // Erkennen der Nutzersprache
  // Mehr Infos: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Weitergabe der i18n-Instanz an react-i18next
  .use(initReactI18next)
  // Initialisierung von i18next
  // Alle Optionen: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true, // Aktiviert Konsolen-Logs für Debugging
    fallbackLng: 'en', // Fallback-Sprache, falls die erkannte Sprache nicht verfügbar ist
    supportedLngs: ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'], // Liste der unterstützten Sprachen
    ns: ['common'], // Standard-Namespace
    defaultNS: 'common',

    backend: {
      // Pfad zum Laden der Übersetzungsdateien.
      // {{lng}} wird durch den Sprachcode ersetzt (z.B. 'de'), {{ns}} durch den Namespace.
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
        // Reihenfolge der Methoden zur Spracherkennung
        order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
        // Wo die erkannte Sprache gespeichert werden soll
        caches: ['localStorage', 'cookie'],
    }
  });

export default i18n;
