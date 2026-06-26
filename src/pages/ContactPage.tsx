import { Link } from 'react-router-dom'
import { Breadcrumbs, Container, Eyebrow, GradientHero, Panel, SectionHeader } from '~/design-system'
import { useTranslation } from 'react-i18next'
import { SEOHead, localBusinessSchema, createBreadcrumbSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import { ContactForm } from '../components/sections/ContactForm'
import { ContactChannels } from '../components/sections/ContactChannels'

const ContactPage = () => {
  const { t } = useTranslation('contact')

  return (
    <PageTransition>
      <SEOHead
        title={t('contact:seo.title', 'IglooPro Demo anfragen: Kostenlose Beratung | PolarisDX')}
        description={t(
          'contact:seo.description',
          'Vereinbaren Sie eine kostenlose IglooPro Demo. POC-Diagnostik live erleben — Beratung zu Integration, Abrechnung & Praxislabor. Schnelle Antwort.',
        )}
        keywords={['PolarisDX Kontakt', 'IglooPro Demo', 'POC Beratung', 'Medizintechnik Anfrage']}
        structuredData={[
          localBusinessSchema,
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Kontakt', url: '/contact' },
          ]),
        ]}
      />
      <div className="bg-bg text-fg-heading">
        {/* Hero / Top */}
        <GradientHero minHeight="min-h-[340px]">
          <Reveal width="100%" yOffset={20}>
            <Breadcrumbs
              className="mb-4"
              items={[{ label: 'Home', href: '/' }, { label: t('contact.hero.title') }]}
            />
            <Eyebrow size="sm" className="mb-3">
              {t('contact.hero.kicker')}
            </Eyebrow>
            <h1 className="text-display-sm font-medium tracking-tight">
              {t('contact.hero.title')}
            </h1>
          </Reveal>
        </GradientHero>

        {/* Form + Info */}
        <Container className="py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] lg:items-start">
            {/* Form-Card */}
            <Reveal width="100%">
              <Panel padding="lg" className="space-y-6">
                <SectionHeader title={t('contact.form.title')} align="left" />

                {/* Kontakt-Kanäle (E-Mail/Telefon) leben konsolidiert in der
                    persistenten Sidebar-Box — siehe ContactChannels (Plan E2). */}

                {/* Extracted Form Component */}
                <ContactForm />
              </Panel>
            </Reveal>

            {/* Info-Spalte / Desktop-Sidebar */}
            <aside className="space-y-6">
              <Reveal width="100%" delay={0.2}>
                <Panel>
                  <h2 className="text-lg font-semibold tracking-tight text-fg-heading">
                    {t('contact.info.title')}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-fg">{t('contact.info.text')}</p>
                  <ContactChannels
                    className="mt-5 text-sm text-fg"
                    emailLabel={t('contact.info.email_label')}
                    phoneLabel={t('contact.info.phone_label')}
                  />
                </Panel>

                <Panel>
                  <h3 className="text-sm font-semibold uppercase tracking-overline text-fg-muted mb-3">
                    {t('contact.sidebar_links.title', 'Entdecken')}
                  </h3>
                  <nav className="space-y-2">
                    <Link
                      to="/diagnostics"
                      className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
                    >
                      {t('contact.sidebar_links.services', 'Unsere Diagnostik-Services')} →
                    </Link>
                    <Link
                      to="/igloo-pro"
                      className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
                    >
                      {t('contact.sidebar_links.igloo', 'IglooPro System kennenlernen')} →
                    </Link>
                    <Link
                      to="/articles"
                      className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
                    >
                      {t('contact.sidebar_links.articles', 'Fachartikel lesen')} →
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

export default ContactPage
