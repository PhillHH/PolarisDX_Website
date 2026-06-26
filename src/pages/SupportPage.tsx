import { Link } from 'react-router-dom'
import { Breadcrumbs, Container, Eyebrow, GradientHero, Panel } from '~/design-system'
import { useTranslation } from 'react-i18next'
import { SEOHead, localBusinessSchema, createBreadcrumbSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import { SupportForm } from '../components/sections/SupportForm'
import { ContactChannels } from '../components/sections/ContactChannels'

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
        <GradientHero minHeight="min-h-[340px]">
          <Reveal width="100%" yOffset={20}>
            <Breadcrumbs
              className="mb-4"
              items={[{ label: 'Home', href: '/' }, { label: t('support.hero.title') }]}
            />
            <Eyebrow size="sm" className="mb-3">
              {t('support.hero.kicker')}
            </Eyebrow>
            <h1 className="text-display-sm font-medium tracking-tight">
              {t('support.hero.title')}
            </h1>
          </Reveal>
        </GradientHero>

        {/* Form + Info */}
        <Container className="py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] lg:items-start">
            {/* Form Card */}
            <Reveal width="100%">
              <Panel padding="lg" className="space-y-6">
                {/* Kein zweiter Großtitel: der Hero trägt bereits H1
                    `support.hero.title`; das Formular-Panel führt direkt mit der
                    Intro (§1 [FIL] — keine konkurrierenden Titel pro Section). */}
                <p className="text-sm leading-relaxed text-fg">{t('support.intro')}</p>

                {/* Kontakt-Kanäle (E-Mail/Telefon) leben konsolidiert in der
                    persistenten Sidebar-Box — siehe ContactChannels (Plan E3). */}

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
                  <ContactChannels
                    className="mt-5 text-sm text-fg"
                    emailLabel={t('support.info.email_label')}
                    phoneLabel={t('support.info.phone_label')}
                  />
                </Panel>

                <Panel>
                  <h3 className="text-sm font-semibold uppercase tracking-overline text-fg-muted mb-3">
                    {t('support.sidebar_links.title', 'Hilfreiche Links')}
                  </h3>
                  <nav className="space-y-2">
                    <Link
                      to="/downloads"
                      className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
                    >
                      {t('support.sidebar_links.downloads', 'Downloads & Dokumentation')} →
                    </Link>
                    <Link
                      to="/contact"
                      className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
                    >
                      {t('support.sidebar_links.contact', 'Allgemeine Kontaktanfrage')} →
                    </Link>
                    <Link
                      to="/igloo-pro"
                      className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
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
