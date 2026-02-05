import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import ServicesSection from '../components/sections/ServicesSection'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const ServicesOverviewPage = () => {
  const { t } = useTranslation(['common', 'home', 'services'])

  return (
    <PageTransition>
      <SEOHead
        title={t('services:seo.overview_title', 'POCT Services für Praxen - Dental, Beauty, Longevity')}
        description={t('services:seo.overview_description', 'Point-of-Care Diagnostik für Zahnarztpraxen, Beauty-Center und Longevity-Kliniken. Vitamin D, CRP, HbA1c Schnelltests für bessere Patientenversorgung.')}
        canonical="https://polarisdx.net/diagnostics"
        keywords={['POCT Services', 'POC Diagnostik Praxis', 'Schnelltest Zahnarzt', 'Beauty Diagnostik', 'Longevity Tests']}
        structuredData={createBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Diagnostik', url: '/diagnostics' },
        ])}
      />
      <div className="bg-slate-50">
        {/* Reusing a simplified Hero/Header style for consistency with subpages */}
        <section className="relative overflow-hidden bg-brand-primary text-white">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex min-h-[250px] max-w-page flex-col justify-end px-4 pb-10 pt-24 lg:px-10 lg:pb-12 lg:pt-28">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-container">
                <div className="mb-4 text-sm text-white/70">
                  <Link to="/" className="hover:text-brand-secondary">
                    {t('common:nav.home', 'Home')}
                  </Link>{' '}
                  / <span>{t('common:nav.service', 'Services')}</span>
                </div>
                <h1 className="mb-4 text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
                  {t('common:nav.service', 'Services')}
                </h1>
              </div>
            </Reveal>
          </div>
        </section>

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
