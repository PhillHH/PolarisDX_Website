import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'
import FlagIcon from './FlagIcon'

const languages = [
  { code: 'de', name: 'Deutsch', country_code: 'de' },
  { code: 'en', name: 'English', country_code: 'us' },
  { code: 'pl', name: 'Polski', country_code: 'pl' },
  { code: 'fr', name: 'Français', country_code: 'fr' },
  { code: 'it', name: 'Italiano', country_code: 'it' },
  { code: 'es', name: 'Español', country_code: 'es' },
  { code: 'pt', name: 'Português', country_code: 'pt' },
  { code: 'da', name: 'Dansk', country_code: 'dk' },
  { code: 'nl', name: 'Nederlands', country_code: 'nl' },
  { code: 'cs', name: 'Čeština', country_code: 'cz' },
]

interface LanguageSwitcherProps {
    className?: string;
    isMobile?: boolean;
}

const LanguageSwitcher = ({ className = '', isMobile = false }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Stelle sicher, dass auch Codes mit Regionssuffix (z. B. en-US) korrekt aufgelöst werden
  const normalizedCode = (i18n.language || '').split('-')[0];
  const currentLanguage =
    languages.find((l) => l.code === normalizedCode) || languages.find((l) => l.code === i18n.language) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-center gap-2 rounded-full ${isMobile ? 'h-10 px-3 py-2' : 'px-3 py-2'} leading-none transition-colors hover:bg-white/10 text-current`}
        aria-label="Select language"
      >
        <FlagIcon
          countryCode={currentLanguage.country_code}
          className="h-5 w-8 rounded-sm align-middle shrink-0 ring-1 ring-brand-primary/40 bg-white shadow-sm"
        />
        <span className="uppercase text-sm font-medium leading-none">{currentLanguage.code}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden`}>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                i18n.language === language.code ? 'bg-gray-50 font-medium text-brand-primary' : ''
              }`}
            >
              <FlagIcon countryCode={language.country_code} className="h-5 w-8 rounded-sm bg-white ring-1 ring-brand-primary/40 shadow-sm" />
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
