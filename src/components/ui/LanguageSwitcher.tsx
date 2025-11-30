import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import 'flag-icons/css/flag-icons.min.css';

// Liste der unterstützten Sprachen mit Code, Name und Ländercode für die Flagge
const languages = [
  { code: 'de', name: 'Deutsch', country_code: 'de' },
  { code: 'en', name: 'English', country_code: 'gb' },
  { code: 'pl', name: 'Polski', country_code: 'pl' },
  { code: 'fr', name: 'Français', country_code: 'fr' },
  { code: 'it', name: 'Italiano', country_code: 'it' },
  { code: 'es', name: 'Español', country_code: 'es' },
  { code: 'pt', name: 'Português', country_code: 'pt' },
  { code: 'da', name: 'Dansk', country_code: 'dk' },
  { code: 'nl', name: 'Nederlands', country_code: 'nl' },
  { code: 'cs', name: 'Čeština', country_code: 'cz' },
];

interface LanguageSwitcherProps {
    className?: string; // Zusätzliche CSS-Klassen für den Wrapper
    isMobile?: boolean; // Flag, ob die Komponente im mobilen Menü angezeigt wird
}

/**
 * LanguageSwitcher Komponente.
 * Zeigt ein Dropdown-Menü zur Auswahl der Anwendungssprache an.
 * Zeigt die aktuelle Sprache mit Flagge und Code an.
 */
const LanguageSwitcher = ({ className = '', isMobile = false }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Bestimmt das aktuelle Sprachobjekt basierend auf i18n.language
  const currentLanguage = languages.find((l) => l.code === i18n.language) || languages[0];

  // Wechselt die Sprache via i18next und schließt das Menü
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  // Schließt das Dropdown, wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger-Button: Zeigt aktuelle Auswahl */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-white/10 ${isMobile ? 'text-current' : 'text-current'}`}
        aria-label="Select language"
      >
        <span className={`fi fi-${currentLanguage.country_code} rounded-sm`} />
        <span className="uppercase text-sm font-medium">{currentLanguage.code}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown-Menü */}
      {isOpen && (
        <div className={`absolute right-0 top-full mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden`}>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                i18n.language === language.code ? 'bg-gray-50 font-medium text-primary' : ''
              }`}
            >
              <span className={`fi fi-${language.country_code} rounded-sm`} />
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
