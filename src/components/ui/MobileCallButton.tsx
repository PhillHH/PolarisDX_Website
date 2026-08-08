import { useState } from 'react'
import { Phone, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const MobileCallButton = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation('contact')
  const phoneNumber = '+49 151 75011699'
  const phoneNumberClean = phoneNumber.replace(/\s/g, '')

  return (
    // --cookie-banner-height wird vom CookieBanner gesetzt, solange dieser sichtbar
    // ist (sonst 0px). Ohne das liegt der Anruf-Button beim Erstbesuch komplett
    // hinter dem Banner (Banner z-[70] > z-50) und ist nicht erreichbar.
    <div
      className="fixed bottom-6 right-0 z-50 flex flex-col items-end transition-[bottom] duration-300 lg:hidden"
      style={{ bottom: 'calc(1.5rem + var(--cookie-banner-height, 0px))' }}
    >
      <div
        className={`flex items-center overflow-hidden rounded-l-full shadow-lg ring-1 ring-white/25 transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'translate-x-0 bg-white pl-3 pr-2 py-2'
            : '-translate-x-2 bg-brand-primary pr-1 pl-3 py-3'
        }`}
      >
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`flex items-center justify-center rounded-full transition-colors ${
            isExpanded
              ? 'h-11 w-11 bg-gray-50 text-brand-primary'
              : 'h-11 w-11 bg-brand-deep text-white'
          }`}
          aria-label={t('contact.call_us_button', 'Rufen Sie uns an')}
        >
          <Phone className="h-5 w-5" />
        </button>

        {isExpanded && (
          <>
            <a
              href={`tel:${phoneNumberClean}`}
              onClick={() => setIsExpanded(false)}
              className="ml-3 mr-1 flex min-h-[44px] items-center whitespace-nowrap text-sm font-semibold text-heading"
            >
              {t('contact.call_us_text', 'Rufen Sie uns an')}
            </a>
            <button
              onClick={() => setIsExpanded(false)}
              aria-label={t('contact.collapse_button', 'Schließen')}
              className="ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default MobileCallButton
