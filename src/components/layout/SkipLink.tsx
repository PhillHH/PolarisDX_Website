import { useTranslation } from 'react-i18next'

/** Ziel-Id des Hauptinhalts. Muss zum `id` am <main> in `Layout.tsx` passen. */
export const MAIN_CONTENT_ID = 'main-content'

/**
 * SkipLink — der Sprung an der Navigation vorbei (WCAG 2.4.1).
 *
 * Ohne ihn muss sich jemand, der mit der Tastatur arbeitet, auf JEDER Seite
 * erst durch Logo, sieben Hauptnavigationspunkte, Untermenue-Trigger, Suche,
 * Sprachumschalter und CTA tabben, bevor der Inhalt beginnt. Gemessen sind das
 * ueber ein Dutzend Stationen pro Seitenaufruf.
 *
 * Er ist bewusst **das erste fokussierbare Element im Dokument** — ein
 * Sprunglink, der nach der Navigation kaeme, waere sinnlos.
 *
 * SICHTBAR ERST BEI FOKUS: `sr-only` blendet ihn optisch aus, ohne ihn aus dem
 * Tabfluss oder dem Accessibility-Tree zu nehmen; `focus:not-sr-only` holt ihn
 * zurueck, sobald er den Fokus hat. `display:none` oder `tabindex="-1"` waeren
 * an dieser Stelle falsch — dann gaebe es den Sprung faktisch nicht.
 *
 * Der Header ist `position: fixed`; der sichtbare Link liegt deshalb mit
 * `z-[100]` ueber ihm und traegt eine eigene Flaeche, damit er nicht im
 * Navy-Hintergrund verschwindet.
 */
export const SkipLink = () => {
  const { t } = useTranslation('common')

  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only rounded-md bg-white px-4 py-3 text-sm font-semibold text-heading shadow-dialog focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:min-h-[44px] focus:items-center focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
    >
      {t('a11y.skip_to_content', 'Zum Inhalt springen')}
    </a>
  )
}

export default SkipLink
