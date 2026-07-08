import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SEOHead, localBusinessSchema, createBreadcrumbSchema } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import { ContactForm } from '../components/sections/ContactForm'

const ContactPage = () => {
  const { t } = useTranslation('contact')

  const chips = [
    t('contact.hero.chips.free'),
    t('contact.hero.chips.fast'),
    t('contact.hero.chips.time'),
  ]

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
      <div className="bg-slate-50 text-gray-900">
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-primary text-white">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex max-w-container flex-col items-center px-4 pb-14 pt-28 text-center lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="flex flex-col items-center">
                <Breadcrumbs
                  variant="dark"
                  className="mb-5"
                  items={[{ label: 'Home', href: '/' }, { label: t('contact.hero.breadcrumb') }]}
                />
                <h1 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t('contact.hero.title')}
                </h1>
                <p className="mb-6 max-w-xl text-base text-white/80 sm:text-lg">
                  {t('contact.hero.subtitle')}
                </p>
                <ul className="flex flex-wrap items-center justify-center gap-2.5">
                  {chips.map((chip) => (
                    <li
                      key={chip}
                      className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 ring-1 ring-inset ring-white/15"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Form card */}
        <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
          <Reveal width="100%">
            <section className="rounded-2xl bg-white p-6 shadow-card sm:p-8 lg:p-10">
              <ContactForm />
            </section>
          </Reveal>

          {/* Trust row */}
          <div className="mt-6 flex flex-col gap-3 px-1 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {t('contact.trust.direct')}{' '}
              <a
                href="mailto:contact@polarisdx.net"
                className="font-semibold text-brand-primary hover:underline"
              >
                contact@polarisdx.net
              </a>{' '}
              ·{' '}
              <a href="tel:+4915175011699" className="font-semibold text-brand-primary hover:underline">
                +49 151 75011699
              </a>
            </p>
            <p className="flex items-center gap-1.5 text-gray-500">
              <Star className="h-4 w-4 fill-accent text-accent" aria-hidden />
              <span className="font-semibold text-text-heading">{t('contact.trust.rating')}</span>
              <span>· {t('contact.trust.reviews')}</span>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default ContactPage
