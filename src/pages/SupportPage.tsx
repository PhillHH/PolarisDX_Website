import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LifeBuoy, Mail, Phone, Download, Package, ArrowRight } from 'lucide-react'
import { SEOHead, localBusinessSchema, createBreadcrumbSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import SubpageHero from '../components/sections/SubpageHero'
import { SupportForm } from '../components/sections/SupportForm'

const SupportPage = () => {
  const { t } = useTranslation(['support', 'common'])

  const helpfulLinks = [
    {
      to: '/downloads',
      label: t('support.sidebar_links.downloads', 'Downloads & Dokumentation'),
      icon: <Download className="h-5 w-5" />,
    },
    {
      to: '/contact',
      label: t('support.sidebar_links.contact', 'Allgemeine Kontaktanfrage'),
      icon: <Mail className="h-5 w-5" />,
    },
    {
      to: '/igloo-pro',
      label: t('support.sidebar_links.igloo', 'IglooPro System'),
      icon: <Package className="h-5 w-5" />,
    },
  ]

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

      <SubpageHero
        breadcrumbs={[
          { label: t('common:nav.home', 'Home'), href: '/' },
          { label: t('support.hero.title') },
        ]}
        eyebrow={t('support.hero.kicker')}
        title={t('support.hero.title')}
        subtitle={t('support.hero.subtitle')}
        chips={[
          t('support.hero.chips.response'),
          t('support.hero.chips.channels'),
          t('support.hero.chips.attach'),
        ]}
        icon={<LifeBuoy />}
      />

      <div className="bg-slate-50">
        <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] lg:items-start lg:gap-12">
            {/* Form card — the page's single, clear conversion */}
            <Reveal width="100%">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8 lg:p-10">
                <p className="text-base leading-relaxed text-gray-700">{t('support.intro')}</p>

                {/* Contact channels */}
                <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:gap-8">
                  <a href="mailto:contact@polarisdx.net" className="group flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                        {t('support.info.email_label')}
                      </p>
                      <p className="text-sm text-gray-700 group-hover:text-accent-strong">
                        contact@polarisdx.net
                      </p>
                    </div>
                  </a>
                  <a href="tel:+4915175011699" className="group flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                        {t('support.info.phone_label')}
                      </p>
                      <p className="text-sm text-gray-700 group-hover:text-accent-strong">
                        +49 151 75011699
                      </p>
                    </div>
                  </a>
                </div>

                <SupportForm />
              </section>
            </Reveal>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-32">
              <Reveal width="100%" delay={0.2}>
                {/* Helpful links */}
                <section className="rounded-xl border border-slate-200 bg-white p-7">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                    {t('support.sidebar_links.title', 'Hilfreiche Links')}
                  </h2>
                  <nav className="mt-4 space-y-2.5">
                    {helpfulLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="group flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-accent/40 hover:bg-accent/5"
                      >
                        <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          {link.icon}
                        </span>
                        <span className="flex-1 text-sm font-medium text-heading">{link.label}</span>
                        <ArrowRight
                          className="h-4 w-4 flex-shrink-0 text-accent transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </Link>
                    ))}
                  </nav>
                </section>

                {/* Support info */}
                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-7">
                  <h3 className="text-lg font-medium tracking-tight text-heading">
                    {t('support.info.title')}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {t('support.info.text')}
                  </p>
                  <div className="mt-4 space-y-3">
                    <a
                      href="mailto:contact@polarisdx.net"
                      className="flex items-center gap-3 text-sm font-medium text-heading hover:text-accent-strong"
                    >
                      <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Mail className="h-4 w-4" />
                      </span>
                      contact@polarisdx.net
                    </a>
                    <a
                      href="tel:+4915175011699"
                      className="flex items-center gap-3 text-sm font-medium text-heading hover:text-accent-strong"
                    >
                      <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Phone className="h-4 w-4" />
                      </span>
                      +49 151 75011699
                    </a>
                  </div>
                </section>
              </Reveal>
            </aside>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default SupportPage
