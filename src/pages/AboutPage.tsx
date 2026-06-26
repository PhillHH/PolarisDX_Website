import { useTranslation } from 'react-i18next'
import { SEOHead, organizationSchema, createBreadcrumbSchema } from '../components/seo'
import { Breadcrumbs, Button, Eyebrow, GradientHero } from '~/design-system'
import TeamSection from '../components/sections/TeamSection'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const AboutPage = () => {
  const { t } = useTranslation(['about', 'home'])

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
      <GradientHero minHeight="min-h-[340px]" innerClassName="text-center">
        <Reveal width="100%" yOffset={20}>
          <div className="flex justify-center mb-4">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: t('about:hero.caption', 'Über uns') },
              ]}
            />
          </div>
          <div className="flex justify-center">
            <Eyebrow size="sm" className="mb-2">
              {t('about:hero.caption', 'Über uns')}
            </Eyebrow>
          </div>
          <h1 className="text-display-sm font-medium tracking-tight text-fg-on-dark">
            {t('about:hero.title', 'Wir definieren Diagnostik neu')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-fg-on-dark/80">
            {t(
              'about:hero.description',
              'PolarisDX steht für Innovation, Präzision und Verlässlichkeit in der Medizintechnik. Lernen Sie die Menschen hinter unserer Mission kennen.',
            )}
          </p>
        </Reveal>
      </GradientHero>

      <div className="mx-auto flex max-w-container flex-col gap-20 px-4 py-24 lg:px-0 lg:py-32">
        <Reveal width="100%">
          <TeamSection />
        </Reveal>

        <Reveal width="100%">
          <div className="mx-auto flex max-w-reading flex-col items-center gap-4 text-center">
            <Eyebrow size="sm">Partnerschaft</Eyebrow>
            <h2 className="text-display-sm font-medium tracking-tight text-fg-heading">
              Gemeinsam mit DX365
            </h2>
            <p className="text-lg leading-body text-fg">
              Als europäischer Distributionspartner von{' '}
              <a
                href="https://dx365.world"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:text-brand-deep underline transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
              >
                DX365
              </a>{' '}
              bringen wir den IglooPro POC-Reader in Praxen und Kliniken — von der Beratung über
              Integration und Schulung bis zum laufenden Support aus einer Hand.
            </p>
          </div>
        </Reveal>

        <Reveal width="100%">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg text-fg">
              {t(
                'about:cta.text',
                'Lernen Sie unsere Diagnostik-Lösungen kennen oder nehmen Sie direkt Kontakt auf.',
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button to="/diagnostics" size="sm">
                {t('about:cta.services', 'Unsere Diagnostik-Services')}
              </Button>
              <Button to="/contact" variant="secondary" size="sm">
                {t('about:cta.contact', 'Kontakt aufnehmen')}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  )
}

export default AboutPage
