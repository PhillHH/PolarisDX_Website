import { useTranslation } from 'react-i18next'
import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SUPPORTED_LANGUAGES, normalizeLanguage, type SupportedLanguage } from '../../i18n'
import { buildLanguageSwitchUrl } from '../../lib/localeRoute'
import { useKeyboardDismiss } from '../../hooks/useKeyboardDismiss'
import FlagIcon from './FlagIcon'

const languageMetadata: Record<SupportedLanguage, { name: string; country_code: string }> = {
  de: { name: 'Deutsch', country_code: 'de' },
  en: { name: 'English', country_code: 'gb' },
  pl: { name: 'Polski', country_code: 'pl' },
  fr: { name: 'Français', country_code: 'fr' },
  it: { name: 'Italiano', country_code: 'it' },
  es: { name: 'Español', country_code: 'es' },
  pt: { name: 'Português', country_code: 'pt' },
  da: { name: 'Dansk', country_code: 'dk' },
  nl: { name: 'Nederlands', country_code: 'nl' },
  cs: { name: 'Čeština', country_code: 'cz' },
}

const languages = SUPPORTED_LANGUAGES.map((code) => ({ code, ...languageMetadata[code] }))

interface LanguageSwitcherProps {
  className?: string
  isMobile?: boolean
}

const LanguageSwitcher = ({ className = '', isMobile = false }: LanguageSwitcherProps) => {
  const { t, i18n } = useTranslation('common')
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setIsOpen(false), [])

  // Stelle sicher, dass auch Codes mit Regionssuffix (z. B. en-US) korrekt aufgelöst werden
  const normalizedCode = normalizeLanguage(i18n.language)
  const currentLanguage = languages.find((language) => language.code === normalizedCode)!

  /**
   * Sprachwechsel = Navigation zu neuer URL.
   *
   * /de/about → Klick auf EN → /en/about (full page navigation)
   *
   * Full page reload ist gewollt weil:
   * - BrowserRouter basename ändert sich (erfordert Remount)
   * - SSR liefert sofort die korrekte Sprache
   * - Kein Hydration Mismatch
   */
  const changeLanguage = (lng: SupportedLanguage) => {
    setIsOpen(false)

    const newUrl = buildLanguageSwitchUrl(location, lng)
    window.location.assign(newUrl)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // AP24 PT24.2 — Escape schliesst und gibt den Fokus zurueck; wer
  // heraustabbt, laesst keine offene Liste hinter sich. Gemessen war vorher:
  // Escape tat nichts, `aria-expanded` blieb "true", und der Fokus stand
  // irgendwo in einer Liste, aus der es keinen definierten Rueckweg gab.
  //
  // Bewusst kein `role="menu"`: die Eintraege sind echte Knoepfe in der
  // Dokumentreihenfolge, Tab und Shift+Tab fuehren bereits durch sie hindurch.
  // Ein Menue-Nachbau wuerde Pfeiltasten VERLANGEN und Tab abschalten — mehr
  // ARIA fuer weniger native Bedienbarkeit. Die Pfeiltasten unten kommen
  // zusaetzlich, nicht anstelle von Tab.
  useKeyboardDismiss({
    open: isOpen,
    onDismiss: close,
    containerRef: dropdownRef,
    triggerRef,
  })

  /**
   * Pfeiltasten als Bequemlichkeit. `preventDefault` nur hier, damit die
   * Seite nicht zusaetzlich scrollt, waehrend die Auswahl wandert.
   */
  const onListKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    )
      return
    const items = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])
    if (items.length === 0) return
    event.preventDefault()
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : event.key === 'ArrowDown'
            ? (index + 1 + items.length) % items.length
            : (index - 1 + items.length) % items.length
    items[next]?.focus()
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* AP24 PT24.1: `type="button"` — ohne Angabe ist ein Knopf ein
          Submit-Knopf, sobald er je in einem Formular landet. `aria-expanded`
          nennt den Zustand, den vorher nur der gedrehte Pfeil zeigte. */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(event) => {
          // Pfeil ab oeffnet und setzt den Fokus auf den ersten Eintrag — das
          // erwartete Verhalten eines Aufklappers, ohne dass Enter/Space
          // dadurch etwas verlieren.
          if (event.key !== 'ArrowDown') return
          event.preventDefault()
          setIsOpen(true)
          window.requestAnimationFrame(() =>
            listRef.current?.querySelector<HTMLButtonElement>('button')?.focus(),
          )
        }}
        aria-expanded={isOpen}
        className={`inline-flex items-center justify-center gap-2 rounded-full ${isMobile ? 'h-11 px-3 py-2' : 'min-h-[44px] px-3 py-2'} leading-none transition-colors hover:bg-white/10 text-current`}
        // War hartkodiertes Englisch und damit in neun von zehn Sprachen
        // sprachfremd. Der Sprachumschalter ist genau das Element, das ein
        // Nutzer sucht, der die Seitensprache NICHT versteht.
        aria-label={t('a11y.select_language', 'Sprache wählen')}
      >
        <FlagIcon
          countryCode={currentLanguage.country_code}
          className="h-5 w-8 rounded-sm align-middle shrink-0 ring-1 ring-brand-primary/40 bg-white"
        />
        <span className="uppercase text-sm font-medium leading-none">{currentLanguage.code}</span>
        {/* AP24 PT24.5: Der Pfeil zeigt den Zustand, den `aria-expanded`
            bereits meldet — doppelt gemoppelt und ohne Namen. Raus aus dem
            Accessibility-Tree. */}
        <svg
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={listRef}
          className={`absolute right-0 top-full mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden`}
        >
          {languages.map((language) => (
            /* AP24 PT24.1: Welche Sprache gerade aktiv ist, stand allein in
               Hintergrundfarbe, Schriftfarbe und Schriftschnitt. `aria-current`
               macht dieselbe Information programmatisch verfuegbar. */
            <button
              key={language.code}
              type="button"
              onClick={() => changeLanguage(language.code)}
              // Die Pfeiltasten haengen an den Knoepfen, nicht am umgebenden
              // `div`: dort waeren sie eine Interaktion auf einem Element ohne
              // Rolle — und genau das meldet `jsx-a11y` zu Recht. Die Knoepfe
              // SIND die Bedienelemente, also gehoert die Tastenbehandlung an
              // sie.
              onKeyDown={onListKeyDown}
              aria-current={normalizedCode === language.code ? 'true' : undefined}
              className={`flex min-h-[44px] w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                normalizedCode === language.code ? 'bg-gray-50 font-medium text-brand-primary' : ''
              }`}
            >
              <FlagIcon
                countryCode={language.country_code}
                className="h-5 w-8 rounded-sm bg-white ring-1 ring-brand-primary/40"
              />
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
