import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';
import de from './locales/de/translation.json';
import pl from './locales/pl/translation.json';
import fr from './locales/fr/translation.json';
import it from './locales/it/translation.json';
import es from './locales/es/translation.json';
import pt from './locales/pt/translation.json';
import da from './locales/da/translation.json';
import nl from './locales/nl/translation.json';
import cs from './locales/cs/translation.json';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    supportedLngs: ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'],
    resources: {
      en: { translation: en },
      de: { translation: de },
      pl: { translation: pl },
      fr: { translation: fr },
      it: { translation: it },
      es: { translation: es },
      pt: { translation: pt },
      da: { translation: da },
      nl: { translation: nl },
      cs: { translation: cs },
    },
    detection: {
        order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage', 'cookie'],
    }
  });

export default i18n;
