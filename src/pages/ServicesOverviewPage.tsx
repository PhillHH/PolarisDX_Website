import { useTranslation } from 'react-i18next'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import DiagnosticsHero from '../components/sections/DiagnosticsHero'
import DiagnosticsLandscapeSection from '../components/sections/DiagnosticsLandscapeSection'
import DiagnosticsSpecialtySection from '../components/sections/DiagnosticsSpecialtySection'
import DiagnosticsFocusSection from '../components/sections/DiagnosticsFocusSection'
import DiagnosticsUseCasesSection from '../components/sections/DiagnosticsUseCasesSection'
import DiagnosticsRelatedArticlesSection from '../components/sections/DiagnosticsRelatedArticlesSection'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import IglooProImage from '../assets/Igloo-pro-frontal.webp'

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
          'Orientierung zu Point-of-Care-Diagnostik, diagnostischen Lösungen und Servicebereichen für Praxen.',
        )}
        ogImage={IglooProImage}
        ogImageAlt={t('services:seo.overview_image_alt')}
        ogImageWidth={650}
        ogImageHeight={650}
        structuredData={createBreadcrumbSchema(
          [
            { name: t('common:nav.home', 'Home'), url: '/' },
            { name: t('services:overview.hero.title', 'Diagnostik'), url: '/diagnostics' },
          ],
          i18n.language,
        )}
      />
      <div>
        <DiagnosticsHero />
        <DiagnosticsLandscapeSection />
        <DiagnosticsSpecialtySection />
        <DiagnosticsFocusSection />
        <DiagnosticsUseCasesSection />
        <DiagnosticsRelatedArticlesSection />
        <FinalCtaSection roiHref="/#roi-rechner" />
      </div>
    </PageTransition>
  )
}

export default ServicesOverviewPage
