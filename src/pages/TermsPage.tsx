import { useTranslation } from 'react-i18next'
import { SEOHead } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import LegalLayout from '../components/layout/LegalLayout'

interface AgbSection {
  id: string
  title: string
  content: string[]
}

const TermsPage = () => {
  const { t } = useTranslation(['legal', 'common'])
  const sections = t('agb.sections', { returnObjects: true }) as AgbSection[]

  return (
    <PageTransition>
      <SEOHead
        title={t('agb.seo.title', 'Allgemeine Geschäftsbedingungen (AGB)')}
        description={t(
          'agb.seo.description',
          'Allgemeine Geschäftsbedingungen der Polaris Diagnostics Europe GmbH für den Verkauf von POC-Diagnostik Produkten.',
        )}
        noindex={true}
      />
      <LegalLayout
        breadcrumbs={[
          { label: t('common:nav.home', 'Home'), href: '/' },
          { label: t('agb.title') },
        ]}
        eyebrow={t('eyebrow', 'Rechtliches')}
        title={t('agb.title')}
        subtitle={t('agb.subtitle')}
        meta={t('agb.date')}
      >
        {Array.isArray(sections) &&
          sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-32">
              <h2 className="mb-3 text-xl font-semibold tracking-tight text-heading">
                {section.title}
              </h2>
              <div className="space-y-3">
                {Array.isArray(section.content) &&
                  section.content.map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed text-gray-700">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </section>
          ))}
      </LegalLayout>
    </PageTransition>
  )
}

export default TermsPage
