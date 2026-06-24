import { useState } from 'react'
import { Phone, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const MobileCallButton = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation('contact')
  const phoneNumber = '+49 151 75011699'
  const phoneNumberClean = phoneNumber.replace(/\s/g, '')

  return (
    <div className="fixed right-0 top-24 z-50 flex flex-col items-end lg:hidden">
      <div
        className={`flex items-center overflow-hidden rounded-l-full shadow-lg transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'translate-x-0 bg-surface-overlay border border-line pl-3 pr-2 py-2'
            : '-translate-x-2 bg-blue-600 pr-1 pl-3 py-3'
        }`}
      >
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`flex items-center justify-center rounded-full transition-colors ${
            isExpanded
              ? 'h-10 w-10 bg-surface-raised text-brand-sky'
              : 'h-10 w-10 bg-blue-700 text-white'
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
              className="ml-3 mr-1 whitespace-nowrap text-sm font-semibold text-ink"
            >
              {t('contact.call_us_text', 'Rufen Sie uns an')}
            </a>
            <button
              onClick={() => setIsExpanded(false)}
              aria-label={t('contact.collapse_button', 'Schließen')}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface-raised text-ink-subtle transition-colors hover:bg-surface-overlay"
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
