import { useTranslation } from 'react-i18next'
import { SEOHead, organizationSchema, createBreadcrumbSchema } from '../components/seo'
import { Breadcrumbs, Button, Container, Eyebrow } from '~/design-system'
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
      <div className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 bg-gradient-to-br from-brand-primary via-brand-deep to-brand-heading text-fg-on-dark overflow-hidden">
        <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
        <Container className="text-center relative z-10">
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
                {t('about:hero.caption', 'ÜBER UNS')}
              </Eyebrow>
            </div>
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl text-fg-on-dark">
              {t('about:hero.title', 'Wir definieren Diagnostik neu')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-fg-on-dark/80">
              {t(
                'about:hero.description',
                'PolarisDX steht für Innovation, Präzision und Verlässlichkeit in der Medizintechnik. Lernen Sie die Menschen hinter unserer Mission kennen.',
              )}
            </p>
          </Reveal>
        </Container>
      </div>

      <div className="mx-auto flex max-w-container flex-col gap-32 px-4 py-24 lg:px-0 lg:gap-32 lg:py-32">
        <Reveal width="100%">
          <TeamSection />
        </Reveal>

        <Reveal width="100%">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-fg">
              Als europäischer Distributionspartner von{' '}
              <a
                href="https://dx365.world"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:text-brand-deep underline transition-colors"
              >
                DX365
              </a>{' '}
              bringen wir den IglooPro POC-Reader in Praxen und Kliniken — inklusive Vertrieb,
              Integration, Schulung und laufendem Support.
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
