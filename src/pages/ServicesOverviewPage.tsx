import { useTranslation } from 'react-i18next'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import DiagnosticsHero from '../components/sections/DiagnosticsHero'
import DiagnosticsSpecialtySection from '../components/sections/DiagnosticsSpecialtySection'
import DiagnosticsFocusSection from '../components/sections/DiagnosticsFocusSection'
import FinalCtaSection from '../components/sections/FinalCtaSection'

const ServicesOverviewPage = () => {
  const { t, i18n } = useTranslation(['common', 'home', 'services'])

  return (
    <PageTransition>
      <SEOHead
        title={t(
          'services:seo.overview_title',
          'POC-Diagnostik für Praxen: Dental, Beauty, Longevity | PolarisDX',
        )}
        description={t(
          'services:seo.overview_description',
          'Chairside Schnelltests für Vitamin D, CRP, HbA1c & TSH. Patientennahe Sofortdiagnostik für Zahnarztpraxen, Ästhetik & Präventionsmedizin.',
        )}
        keywords={[
          'POCT Services',
          'POC Diagnostik Praxis',
          'Schnelltest Zahnarzt',
          'Beauty Diagnostik',
          'Longevity Tests',
        ]}
        structuredData={createBreadcrumbSchema(
          [
            { name: 'Home', url: '/' },
            { name: 'Diagnostik', url: '/diagnostics' },
          ],
          i18n.language,
        )}
      />
      <div>
        <DiagnosticsHero />
        <DiagnosticsSpecialtySection />
        <DiagnosticsFocusSection />
        <FinalCtaSection roiHref="/#roi-rechner" />
      </div>
    </PageTransition>
  )
}

export default ServicesOverviewPage
