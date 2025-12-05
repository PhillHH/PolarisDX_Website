import { useState } from 'react'
import { Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const MobileCallButton = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation('common')
  const phoneNumber = "+49 151 75011699"
  const phoneNumberClean = phoneNumber.replace(/\s/g, '')

  const handleClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault()
      setIsExpanded(true)
    }
  }

  // Close logic (optional, e.g. clicking outside) could be added,
  // but for simple mobile UX, clicking the number calls, clicking the X closes?
  // Or toggle on icon click.

  return (
    <div className="fixed right-4 top-24 z-50 flex flex-col items-end lg:hidden">
      <div
        className={`flex items-center rounded-full shadow-lg transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'bg-white pr-4'
            : 'h-12 w-12 justify-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600'
        }`}
      >
        <button
          onClick={handleClick}
          className={`flex items-center justify-center rounded-full transition-colors ${
            isExpanded ? 'h-10 w-10 text-primary' : 'h-full w-full text-white'
          }`}
          aria-label={t('contact.call_us', 'Call us')}
        >
          <Phone className={isExpanded ? 'h-5 w-5' : 'h-6 w-6'} />
        </button>

        {isExpanded && (
          <a
            href={`tel:${phoneNumberClean}`}
            className="ml-2 whitespace-nowrap text-sm font-semibold text-gray-900"
          >
            {phoneNumber}
          </a>
        )}
      </div>
    </div>
  )
}

export default MobileCallButton
