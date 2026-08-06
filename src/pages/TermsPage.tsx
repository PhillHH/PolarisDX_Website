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
  const sectionCount = Array.isArray(sections) ? sections.length : 0

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
        valueChips={[
          {
            value: sectionCount > 0 ? String(sectionCount) : '—',
            label: t('agb.hero.paragraphsLabel', 'Paragraphen'),
          },
          {
            value: t('agb.hero.scopeValue', 'B2B'),
            label: t('agb.hero.scopeLabel', 'Geschäftskunden'),
          },
        ]}
      >
        {sectionCount > 1 && (
          <nav
            aria-label={t('agb.tocLabel', 'Inhaltsübersicht')}
            className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-7"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
              {t('agb.tocLabel', 'Inhaltsübersicht')}
            </p>
            <ol className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex items-start gap-2 rounded text-sm leading-snug text-gray-700 transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    <span aria-hidden className="text-accent">
                      →
                    </span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
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
