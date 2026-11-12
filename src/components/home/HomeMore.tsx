import { useTranslation } from 'react-i18next'
import BlogSection from '../sections/BlogSection'
import FAQSection from '../sections/FAQSection'

type FaqEntry = { question: string; answer: string }

const HomeMore = ({ items }: { items?: FaqEntry[] }) => {
  const { t } = useTranslation('home')
  const rawFaqItems = t('faq.items', { returnObjects: true }) as unknown
  const faqItems = items ?? ((Array.isArray(rawFaqItems) ? rawFaqItems : []) as FaqEntry[])

  return (
    <section
      aria-label={t('sc025.more.label')}
      data-home-more
      data-home-section
      className="sc025-s sc025-more"
    >
      <div className="sc025-inner sc025-more-columns">
        <FAQSection
          items={faqItems}
          title={t('faq.title')}
          showFooter={false}
          initialOpenIndex={0}
        />
        <BlogSection variant="list" />
      </div>
    </section>
  )
}

export default HomeMore
