import { useState } from 'react'
import { Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const MobileCallButton = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation('contact')
  const phoneNumber = "+49 151 75011699"
  const phoneNumberClean = phoneNumber.replace(/\s/g, '')

  const handleClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault()
      setIsExpanded(true)
    }
  }

  return (
    <div className="fixed right-0 top-28 z-50 flex flex-col items-end lg:hidden">
      <div
        className={`flex items-center shadow-lg transition-all duration-300 ease-in-out rounded-l-full rounded-r-none ${
          isExpanded
            ? 'bg-white pl-2 py-2 pr-4 h-16'
            : 'h-14 w-14 justify-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600'
        }`}
      >
        <button
          onClick={handleClick}
          className={`flex items-center justify-center rounded-full transition-colors ${
            isExpanded ? 'h-12 w-12 text-primary bg-gray-50' : 'h-full w-full text-white'
          }`}
          aria-label={t('contact.call_us_button', 'Call us')}
        >
          <Phone className={isExpanded ? 'h-6 w-6' : 'h-7 w-7'} />
        </button>

        {isExpanded && (
          <a
            href={`tel:${phoneNumberClean}`}
            className="ml-3 whitespace-nowrap text-base font-semibold text-gray-900"
          >
            {t('contact.call_us_button', 'Rufen Sie uns an')}
          </a>
        )}
      </div>
    </div>
  )
}

export default MobileCallButton
