import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Accordion, SectionHeader } from '~/design-system'

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

  // Use direct items when provided, otherwise load from i18n
  const faqItems: FAQItem[] = items ?? (t(faqKey, { returnObjects: true }) as FAQItem[])
  const accordionItems = Array.isArray(faqItems)
    ? faqItems.map((item, index) => ({
        id: `faq-${index}`,
        trigger: item.question,
        content: item.answer,
      }))
    : []

  return (
    <section id="faq" className="space-y-10">
      <SectionHeader
        caption={caption ?? t('faq.caption', 'FAQ')}
        title={title ?? t('faq.title', 'Häufige Fragen zu PolarisDX und Point-of-Care Diagnostik')}
      />

      <div className="mx-auto max-w-3xl">
        <Accordion items={accordionItems} />

        {showFooter && (
          <p className="mt-6 text-center text-sm text-fg-muted">
            {t('faq.more', 'Noch Fragen?')}{' '}
            <Link to="/diagnostics" className="font-semibold text-brand-primary hover:underline">
              {t('faq.link_services', 'Diagnostik-Services ansehen')}
            </Link>{' '}
            {t('faq.or', 'oder')}{' '}
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
