import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  /** i18n namespace to load FAQ items from (default: 'home') */
  namespace?: string
  /** i18n key path for the items array (default: 'faq.items') */
  faqKey?: string
  /** Override caption text (falls back to i18n) */
  caption?: string
  /** Override title text (falls back to i18n) */
  title?: string
  /** Show the footer with links to services/contact (default: true) */
  showFooter?: boolean
  /** Pass FAQ items directly, bypassing i18n lookup */
  items?: FAQItem[]
}

const FAQSection = ({
  namespace = 'home',
  faqKey = 'faq.items',
  caption,
  title,
  showFooter = true,
  items,
}: FAQSectionProps) => {
  const { t } = useTranslation(namespace)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Use direct items when provided, otherwise load from i18n
  const faqItems: FAQItem[] = items ?? (t(faqKey, { returnObjects: true }) as FAQItem[])

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="space-y-10">
      <SectionHeader
        caption={caption ?? t('faq.caption', 'FAQ')}
        title={title ?? t('faq.title', 'Häufige Fragen zu PolarisDX und Point-of-Care Diagnostik')}
      />

      <div className="mx-auto max-w-3xl">
        <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {Array.isArray(faqItems) && faqItems.map((item, index) => (
            <div key={index} className="group">
              <button
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-gray-50"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-base font-medium text-gray-900 sm:text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-300 ease-out ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`grid transition-all duration-300 ease-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showFooter && (
          <p className="mt-6 text-center text-sm text-gray-500">
            {t('faq.more', 'Noch Fragen?')}{' '}
            <Link to="/diagnostics" className="font-semibold text-brand-primary hover:underline">
              {t('faq.link_services', 'Diagnostik-Services ansehen')}
            </Link>
            {' '}{t('faq.or', 'oder')}{' '}
            <Link to="/contact" className="font-semibold text-brand-primary hover:underline">
              {t('faq.link_contact', 'direkt Kontakt aufnehmen')}
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}

export default FAQSection
