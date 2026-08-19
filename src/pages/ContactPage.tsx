import { Link, useSearchParams } from 'react-router-dom'
import SectionHeader from '../components/ui/SectionHeader'
import { useTranslation } from 'react-i18next'
import { VERTIEFUNGEN } from '../components/epigenetics/tokens'
import { SEOHead, localBusinessSchema, createBreadcrumbSchema } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import { ContactForm } from '../components/sections/ContactForm'

const ContactPage = () => {
  const { t } = useTranslation('contact')
  // Die abgestimmten Saetze der Epigenetik-Strecke liegen in ihrem eigenen
  // Namensraum und in allen zehn Sprachen vor.
  const { t: tEpi } = useTranslation('epigenetics')
  const [params] = useSearchParams()

  /**
   * Derselbe Herkunftsvertrag, den ContactForm.tsx auswertet — bewusst
   * dieselbe Bedingung, damit Seitenkopf und Formular nie auseinanderlaufen.
   *
   * Wer aus der Epigenetik-Strecke kommt, las bis hierher eine Seite, die im
   * Tab, im Suchergebnis und in der Seitenspalte die IglooPro-Erzaehlung
   * fuehrt: "Kontakt & Angebot zum IglooPro anfordern", POC-Reader,
   * Fachartikel. Der Aufruf OHNE Parameter bleibt unveraendert — das
   * indexierte Suchergebnis fuer /contact aendert sich dadurch nicht, und
   * SEOHead baut canonical ohnehin nur aus dem Pfad.
   */
  const istEpigenetik =
    params.get('topic') === 'epigenetik' || params.get('source') === 'epigenetics'

  return (
    <PageTransition>
      <SEOHead
        title={
          istEpigenetik
            ? tEpi('contact.title')
            : t('contact:seo.title', 'IglooPro Demo anfragen: Kostenlose Beratung | PolarisDX')
        }
        description={
          istEpigenetik
            ? tEpi('contact.sub')
            : t(
                'contact:seo.description',
                'Vereinbaren Sie eine kostenlose IglooPro Demo. POC-Diagnostik live erleben — Beratung zu Integration, Abrechnung & Praxislabor. Schnelle Antwort.',
              )
        }
        keywords={
          istEpigenetik
            ? ['Epigenetik Analyse', 'Genetik Analyse Praxis', 'Konditionen anfragen', 'PolarisDX']
            : ['PolarisDX Kontakt', 'IglooPro Demo', 'POC Beratung', 'Medizintechnik Anfrage']
        }
        structuredData={[
          localBusinessSchema,
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Kontakt', url: '/contact' },
          ]),
        ]}
      />
      <div className="bg-slate-50 text-gray-900">
        {/* Hero / Top */}
        <section className="relative overflow-hidden bg-brand-primary text-white">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex min-h-[340px] max-w-page flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-container">
                <Breadcrumbs
                  variant="dark"
                  className="mb-4"
                  items={[{ label: 'Home', href: '/' }, { label: t('contact.hero.title') }]}
                />
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
                  {t('contact.hero.kicker')}
                </p>
                <h1 className="mb-3 text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
                  {t('contact.hero.title')}
                </h1>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Form + Info */}
        <div className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] lg:items-start">
            {/* Form-Card */}
            <Reveal width="100%">
              {/* Ankerziel des Deckblatt-CTA der Musterbefund-Seiten
                  (/contact?...#kontaktformular). scroll-mt-28 haelt den
                  Abstand zum fixierten Header, falls der Browser nativ
                  springt; im Regelfall rechnet <ScrollToHash> in App.tsx
                  die gemessene Headerhoehe heraus. */}
              <section
                id="kontaktformular"
                aria-label={t('contact.hero.title')}
                className="scroll-mt-28 space-y-6 rounded-2xl bg-white p-6 shadow-sm lg:p-8"
              >
                <SectionHeader
                  caption={t('contact.hero.kicker')}
                  title={t('contact.hero.title')}
                  align="left"
                />

                {/* Kontakt-Kanäle */}
                <div className="mt-2 flex flex-col gap-4 text-sm text-gray-600 sm:flex-row sm:gap-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-secondary/20 text-brand-secondary">
                      ✉
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                        {t('contact.info.email_label')}
                      </p>
                      <p>contact@polarisdx.net</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-secondary/20 text-brand-secondary">
                      ☎
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                        {t('contact.info.phone_label')}
                      </p>
                      <p>+49 151 75011699</p>
                    </div>
                  </div>
                </div>

                {/* Extracted Form Component */}
                <ContactForm />
              </section>
            </Reveal>

            {/* Info-Spalte / Desktop-Sidebar */}
            <aside className="space-y-6">
              <Reveal width="100%" delay={0.2}>
                <section className="rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                    {t('contact.info.title')}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {t('contact.info.text')}
                  </p>
                  <div className="mt-4 space-y-1 text-sm text-gray-800">
                    <p>contact@polarisdx.net</p>
                    <p>+49 151 75011699</p>
                  </div>
                </section>

                <section className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 mb-3">
                    {t('contact.sidebar_links.title', 'Entdecken')}
                  </h3>
                  {/* Im Epigenetik-Modus fuehren die Verweise dorthin zurueck,
                      wo der Leser herkommt — statt zu IglooPro und Fachartikeln,
                      die mit seiner Anfrage nichts zu tun haben. Beschriftungen
                      aus VERTIEFUNGEN, also bestehende Schluessel in zehn
                      Sprachen. */}
                  <nav className="space-y-2">
                    {istEpigenetik ? (
                      <>
                        <Link
                          to="/epigenetics"
                          className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                        >
                          {tEpi('breadcrumb.current')} →
                        </Link>
                        {VERTIEFUNGEN.map((v) => (
                          <Link
                            key={v.key}
                            to={v.to}
                            className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                          >
                            {tEpi(v.titleKey)} →
                          </Link>
                        ))}
                      </>
                    ) : (
                      <>
                        <Link
                          to="/diagnostics"
                          className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                        >
                          {t('contact.sidebar_links.services', 'Unsere Diagnostik-Services')} →
                        </Link>
                        <Link
                          to="/igloo-pro"
                          className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                        >
                          {t('contact.sidebar_links.igloo', 'IglooPro System kennenlernen')} →
                        </Link>
                        <Link
                          to="/articles"
                          className="block text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                        >
                          {t('contact.sidebar_links.articles', 'Fachartikel lesen')} →
                        </Link>
                      </>
                    )}
                  </nav>
                </section>
              </Reveal>
            </aside>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default ContactPage
