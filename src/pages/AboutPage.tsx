import { useTranslation } from 'react-i18next'
import { SEOHead, organizationSchema, createBreadcrumbSchema } from '../components/seo'
import TeamSection from '../components/sections/TeamSection'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import SubpageHero from '../components/sections/SubpageHero'
import FinalCtaSection from '../components/sections/FinalCtaSection'

const AboutPage = () => {
  const { t } = useTranslation(['about', 'common', 'home'])

  return (
    <PageTransition>
      <SEOHead
        title={t('about:seo.title', 'Über uns: POC-Diagnostik Partner für Europa | PolarisDX')}
        description={t(
          'about:seo.description',
          'PolarisDX bringt patientennahe Labordiagnostik in Praxen und Kliniken. IVDR-konform, 100+ Geräte in 15+ Ländern. Lernen Sie unser Team kennen.',
        )}
        keywords={[
          'PolarisDX Team',
          'Über uns',
          'POC Diagnostik Unternehmen',
          'Medizintechnik Hamburg',
        ]}
        structuredData={[
          organizationSchema,
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Über uns', url: '/about' },
          ]),
        ]}
      />
      <SubpageHero
        breadcrumbs={[
          { label: t('common:nav.home', 'Home'), href: '/' },
          { label: t('about:hero.caption', 'Über uns') },
        ]}
        eyebrow={t('about:hero.caption', 'Über uns')}
        title={t('about:hero.title', 'Wir definieren Diagnostik neu')}
        subtitle={t(
          'about:hero.description',
          'PolarisDX steht für Innovation, Präzision und Verlässlichkeit in der Medizintechnik. Lernen Sie die Menschen hinter unserer Mission kennen.',
        )}
      />

      <TeamSection />

      <section className="bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 lg:px-0">
          <Reveal width="100%">
            <div className="mx-auto max-w-3xl text-center text-gray-700">
              <p className="text-lg leading-relaxed">
                Als europäischer Distributionspartner von{' '}
                <a
                  href="https://dx365.world"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent underline transition-colors hover:text-accent-strong"
                >
                  DX365
                </a>{' '}
                bringen wir den IglooPro POC-Reader in Praxen und Kliniken — inklusive Vertrieb,
                Integration, Schulung und laufendem Support.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCtaSection roiHref="/#roi-rechner" />
    </PageTransition>
  )
}

export default AboutPage
