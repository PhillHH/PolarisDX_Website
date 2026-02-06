import { useTranslation } from 'react-i18next'
import { SEOHead, organizationSchema, createBreadcrumbSchema } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import TeamSection from '../components/sections/TeamSection'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const AboutPage = () => {
  const { t } = useTranslation(['about', 'home'])

  return (
    <PageTransition>
      <SEOHead
        title={t('about:seo.title', 'Über PolarisDX - Unser Team & Mission')}
        description={t('about:seo.description', 'PolarisDX steht für Innovation in der Point-of-Care Diagnostik. Lernen Sie unser Team kennen und erfahren Sie mehr über unsere Mission.')}
        keywords={['PolarisDX Team', 'Über uns', 'POC Diagnostik Unternehmen', 'Medizintechnik Hamburg']}
        structuredData={[
          organizationSchema,
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Über uns', url: '/about' },
          ]),
        ]}
      />
      <div className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="mx-auto max-w-container px-4 text-center lg:px-0 relative z-10">
            <Reveal width="100%" yOffset={20}>
              <div className="flex justify-center mb-4">
                <Breadcrumbs
                  variant="dark"
                  items={[
                    { label: 'Home', href: '/' },
                    { label: t('about:hero.caption', 'Über uns') },
                  ]}
                />
              </div>
              <div className="flex justify-center">
                <div className="inline-block rounded p-px bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep shadow-lg shadow-brand-primary/20 mb-2">
                    <div className="rounded-sm bg-slate-50 px-3 py-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-900">
                        {t('about:hero.caption', 'ÜBER UNS')}
                    </span>
                    </div>
                </div>
              </div>
              <h1 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl text-white">
                  {t('about:hero.title', 'Wir definieren Diagnostik neu')}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
                  {t('about:hero.description', 'PolarisDX steht für Innovation, Präzision und Verlässlichkeit in der Medizintechnik. Lernen Sie die Menschen hinter unserer Mission kennen.')}
              </p>
            </Reveal>
        </div>
      </div>

      <div className="mx-auto flex max-w-container flex-col gap-32 px-4 py-24 lg:px-0 lg:gap-32 lg:py-32">
        <Reveal width="100%">
          <TeamSection />
        </Reveal>
      </div>
    </PageTransition>
  )
}

export default AboutPage
