import { Link } from 'react-router-dom'
import { Breadcrumbs, Container, InfoItem, Panel, SectionHeader } from '~/design-system'
import { useTranslation } from 'react-i18next'
import { SEOHead, localBusinessSchema, createBreadcrumbSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import { SupportForm } from '../components/sections/SupportForm'

const SupportPage = () => {
  const { t } = useTranslation('support')

  return (
    <PageTransition>
      <SEOHead
        title={t('support:seo.title', 'Support-Anfrage | PolarisDX')}
        description={t(
          'support:seo.description',
          'Haben Sie Probleme mit Ihrem Igloo Reader oder Testkits? Senden Sie uns eine Support-Anfrage.',
        )}
        keywords={[
          'PolarisDX Support',
          'Igloo Reader Support',
          'Testkit Support',
          'POC Diagnostik Hilfe',
        ]}
        structuredData={[
          localBusinessSchema,
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Support', url: '/support' },
          ]),
        ]}
      />
      <div className="bg-bg text-fg-heading">
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-primary text-white">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex min-h-[340px] max-w-page flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-container">
                <Breadcrumbs
                  className="mb-4"
                  items={[{ label: 'Home', href: '/' }, { label: t('support.hero.title') }]}
                />
                <p className="mb-2 text-xs font-semibold uppercase tracking-overline text-accent-strong">
                  {t('support.hero.kicker')}
                </p>
                <h1 className="mb-3 text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
                  {t('support.hero.title')}
                </h1>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Form + Info */}
        <Container className="py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] lg:items-start">
            {/* Form Card */}
            <Reveal width="100%">
              <Panel padding="lg" className="space-y-6">
                <SectionHeader
                  caption={t('support.hero.kicker')}
                  title={t('support.hero.title')}
                  align="left"
                />

                <p className="text-sm leading-relaxed text-fg">{t('support.intro')}</p>

                {/* Contact channels */}
                <div className="mt-2 flex flex-col gap-4 text-sm text-fg sm:flex-row sm:gap-8">
                  <InfoItem icon="✉" label={t('support.info.email_label')}>
                    contact@polarisdx.net
                  </InfoItem>
                  <InfoItem icon="☎" label={t('support.info.phone_label')}>
                    +49 151 75011699
                  </InfoItem>
                </div>

                <SupportForm />
              </Panel>
            </Reveal>

            {/* Sidebar */}
            <aside className="space-y-6">
              <Reveal width="100%" delay={0.2}>
                <Panel>
                  <h2 className="text-lg font-semibold tracking-tight text-fg-heading">
                    {t('support.info.title')}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-fg">{t('support.info.text')}</p>
                  <div className="mt-4 space-y-1 text-sm text-fg">
                    <p>contact@polarisdx.net</p>
                    <p>+49 151 75011699</p>
                  </div>
                </Panel>

                <Panel>
                  <h3 className="text-sm font-semibold uppercase tracking-overline text-fg-muted mb-3">
                    {t('support.sidebar_links.title', 'Hilfreiche Links')}
                  </h3>
                  <nav className="space-y-2">
                    <Link
                      to="/downloads"
                      className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                    >
                      {t('support.sidebar_links.downloads', 'Downloads & Dokumentation')} →
                    </Link>
                    <Link
                      to="/contact"
                      className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                    >
                      {t('support.sidebar_links.contact', 'Allgemeine Kontaktanfrage')} →
                    </Link>
                    <Link
                      to="/igloo-pro"
                      className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                    >
                      {t('support.sidebar_links.igloo', 'IglooPro System')} →
                    </Link>
                  </nav>
                </Panel>
              </Reveal>
            </aside>
          </div>
        </Container>
      </div>
    </PageTransition>
  )
}

export default SupportPage
