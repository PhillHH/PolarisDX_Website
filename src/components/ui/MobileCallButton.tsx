import { useState } from 'react'
import { Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const MobileCallButton = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation('contact')
  const phoneNumber = '+49 151 75011699'
  const phoneNumberClean = phoneNumber.replace(/\s/g, '')

  const handleClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault()
      setIsExpanded(true)
    }
  }

  return (
    <div className="fixed right-4 top-24 z-50 flex flex-col items-end lg:hidden">
      <div
        className={`flex items-center rounded-full shadow-lg transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'bg-white pr-4 pl-2 py-2'
            : 'h-12 w-12 justify-center bg-blue-600'
        }`}
      >
        <button
          onClick={handleClick}
          className={`flex items-center justify-center rounded-full transition-colors ${
            isExpanded ? 'h-10 w-10 text-primary bg-gray-50' : 'h-full w-full text-white'
          }`}
          aria-label={t('contact.call_us_button', 'Rufen Sie uns an')}
        >
          <Phone className={isExpanded ? 'h-5 w-5' : 'h-6 w-6'} />
        </button>

        {isExpanded && (
          <a
            href={`tel:${phoneNumberClean}`}
            className="ml-2 whitespace-nowrap text-sm font-semibold text-gray-900"
          >
            {t('contact.call_us_text', 'Rufen Sie uns an')}
          </a>
        )}
      </div>
    </div>
  )
}

export default MobileCallButton
