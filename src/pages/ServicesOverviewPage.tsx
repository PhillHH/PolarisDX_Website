import { useTranslation } from 'react-i18next'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import { Breadcrumbs, Eyebrow, GradientHero } from '~/design-system'
import ServicesSection from '../components/sections/ServicesSection'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const ServicesOverviewPage = () => {
  const { t } = useTranslation(['common', 'home', 'services'])

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
        structuredData={createBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Diagnostik', url: '/diagnostics' },
        ])}
      />
      <div className="bg-bg">
        {/* Reusing a simplified Hero/Header style for consistency with subpages */}
        <GradientHero>
          <Reveal width="100%" yOffset={20}>
            <Breadcrumbs
              className="mb-4"
              items={[
                { label: t('common:nav.home', 'Home'), href: '/' },
                { label: t('common:nav.service', 'Services') },
              ]}
            />
            <Eyebrow size="sm" className="mb-4">
              {t('services:overview.eyebrow', 'Diagnostik')}
            </Eyebrow>
            <h1 className="mb-4 max-w-2xl text-display-sm font-medium tracking-headline">
              {t('services:overview.title', 'Diagnostik für Ihre Praxis')}
            </h1>
            <p className="max-w-reading text-base leading-relaxed text-fg-on-dark/80 sm:text-lg">
              {t(
                'services:overview.subtitle',
                'Patientennahe Schnelltests für Dental, Beauty und Longevity – ausgewertet direkt am Behandlungsplatz mit dem Igloo Pro. Wählen Sie Ihren Bereich.',
              )}
            </p>
          </Reveal>
        </GradientHero>

        <div className="mx-auto flex max-w-container flex-col gap-32 px-4 pt-20 pb-40 lg:px-0 lg:pt-24 lg:pb-32">
          {/* Render the existing ServicesSection component which displays the grid */}
          <Reveal width="100%">
            <ServicesSection />
          </Reveal>
        </div>
      </div>
    </PageTransition>
  )
}

export default ServicesOverviewPage
