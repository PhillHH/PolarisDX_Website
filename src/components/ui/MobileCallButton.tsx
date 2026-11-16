import { Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

/**
 * SC-029: feste Aktionsleiste am unteren Rand (unter lg) — die Hauptaktion der Seite und der
 * Anruf am Daumen. Sie ersetzt den schwebenden Telefonknopf. Auf der Kontaktseite steht nur der
 * Anruf, weil die Seite selbst das Formular ist.
 *
 * `--cookie-banner-height` setzt der CookieBanner, solange er sichtbar ist (sonst 0px): die Leiste
 * rückt dann über ihn. Den Platz am Seitenende hält `body:has([data-mobile-dock])` in index.css
 * frei; die Leiste steht schon im Server-HTML, es verschiebt sich nichts.
 */
const MobileCallButton = () => {
  const { t } = useTranslation(['contact', 'common'])
  const { pathname } = useLocation()
  const phoneNumber = '+49 151 75011699'
  const onContact = /\/contact\/?$/.test(pathname)

  return (
    <div
      data-mobile-dock
      className="fixed inset-x-0 z-50 flex gap-2 border-t border-ui-border bg-white px-3 py-2 transition-[bottom] duration-300 motion-reduce:transition-none lg:hidden"
      style={{ bottom: 'var(--cookie-banner-height, 0px)' }}
    >
      {!onContact && (
        <Link
          to="/contact"
          data-cta-section="mobile-dock"
          className="flex min-h-[48px] flex-1 items-center justify-center bg-brand-primary px-4 text-sm font-semibold text-white"
        >
          {t('common:nav.cta_quote')}
        </Link>
      )}
      <a
        href={`tel:${phoneNumber.replace(/\s/g, '')}`}
        aria-label={t('contact.call_us_button', 'Rufen Sie uns an')}
        className={`flex min-h-[48px] items-center justify-center gap-2 border border-brand-primary text-sm font-semibold text-brand-primary ${
          onContact ? 'flex-1 px-4' : 'w-12 shrink-0'
        }`}
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        {onContact && phoneNumber}
      </a>
    </div>
  )
}

export default MobileCallButton
