import type { ReactNode } from 'react'
import { Mail, Phone, MapPin, Calendar, Check, MessageSquare, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SEOHead, localBusinessSchema, createBreadcrumbSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal, { REVEAL_STAGGER } from '../components/ui/Reveal'
import SubpageHero from '../components/sections/SubpageHero'
import TrustBar from '../components/sections/TrustBar'
import { ContactForm } from '../components/sections/ContactForm'

const PHONE_HREF = 'tel:+4915175011699'
const EMAIL_HREF = 'mailto:contact@polarisdx.net'
const FORM_ANCHOR = '#kontaktformular'

type Channel = {
  key: string
  icon: ReactNode
  href: string
  external?: boolean
}

const ContactPage = () => {
  const { t } = useTranslation(['contact', 'common'])

  // (b) Sichtbare Breadcrumb und BreadcrumbList aus derselben Quelle speisen.
  const crumbHome = t('common:nav.home', 'Startseite')
  const crumbContact = t('contact.hero.breadcrumb')

  const channels: Channel[] = [
    { key: 'email', icon: <Mail />, href: EMAIL_HREF, external: true },
    { key: 'phone', icon: <Phone />, href: PHONE_HREF, external: true },
    { key: 'demo', icon: <Calendar />, href: FORM_ANCHOR },
  ]

  const offices = [
    {
      key: 'london',
      city: 'London',
      role: t('contact.locations.london_role'),
      lines: ['PolarisDX LTD', '262A Fulham Road', 'London SW10 9EL'],
      phone: '+44 7879 433019',
    },
    {
      key: 'hamburg',
      city: 'Hamburg',
      role: t('contact.locations.hamburg_role'),
      lines: ['PolarisDX Europe GmbH', 'Große Bleichen 1 – 3', '20354 Hamburg'],
      phone: '+49 151 75011699',
    },
  ]

  return (
    <PageTransition>
      <SEOHead
        title={t('contact:seo.title', 'Kontakt & Demo-Termin zum IglooPro vereinbaren')}
        description={t(
          'contact:seo.description',
          'Vereinbaren Sie eine kostenlose IglooPro Demo. POC-Diagnostik live erleben — Beratung zu Integration, Abrechnung & Praxislabor. Schnelle Antwort.',
        )}
        keywords={['PolarisDX Kontakt', 'IglooPro Demo', 'POC Beratung', 'Medizintechnik Anfrage']}
        structuredData={[
          localBusinessSchema,
          createBreadcrumbSchema([
            { name: crumbHome, url: '/' },
            { name: crumbContact, url: '/contact' },
          ]),
        ]}
      />

      <SubpageHero
        breadcrumbs={[{ label: crumbHome, href: '/' }, { label: crumbContact }]}
        eyebrow={t('contact.hero.kicker')}
        title={t('contact.hero.title')}
        subtitle={t('contact.hero.subtitle')}
        primaryCta={{ label: t('contact.hero.cta_primary'), href: FORM_ANCHOR }}
        secondaryCta={{ label: t('contact.hero.cta_secondary'), href: PHONE_HREF }}
        chips={[
          t('contact.hero.chips.free'),
          t('contact.hero.chips.fast'),
          t('contact.hero.chips.time'),
        ]}
        icon={<MessageSquare />}
        valueChips={[
          {
            value: t('contact.hero.value.answer_value'),
            label: t('contact.hero.value.answer_label'),
          },
          {
            value: t('contact.hero.value.conform_value'),
            label: t('contact.hero.value.conform_label'),
          },
          {
            value: t('contact.hero.value.locations_value'),
            label: t('contact.hero.value.locations_label'),
          },
        ]}
      />

      <TrustBar />

      {/* Form + aside */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-container px-4 lg:px-0 py-16 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] lg:items-start lg:gap-8">
            {/* Aside */}
            <Reveal width="100%">
              <div className="space-y-8 lg:sticky lg:top-28">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                    {t('contact.form_aside.caption')}
                  </p>
                  <h2 className="mt-3 text-3xl font-medium tracking-tight text-heading">
                    {t('contact.form_aside.title')}
                  </h2>
                  <p className="mt-4 leading-relaxed text-gray-700">
                    {t('contact.form_aside.subtitle')}
                  </p>
                </div>

                <ul className="space-y-3">
                  {['one', 'two', 'three'].map((p) => (
                    <li key={p} className="flex items-start gap-3 text-gray-700">
                      <Check className="mt-1 h-4 w-4 flex-shrink-0 text-accent" aria-hidden />
                      <span>{t(`contact.form_aside.points.${p}`)}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  {channels.map(({ key, icon, href, external }) => (
                    <a
                      key={key}
                      href={href}
                      className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                      {...(external ? {} : { 'aria-label': t(`contact.channels.${key}.label`) })}
                    >
                      <span
                        className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent [&>svg]:h-5 [&>svg]:w-5"
                        aria-hidden
                      >
                        {icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-heading">
                          {t(`contact.channels.${key}.label`)}
                        </span>
                        <span className="block truncate text-sm font-medium text-accent-strong group-hover:underline">
                          {t(`contact.channels.${key}.value`)}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-gray-500">
                          {t(`contact.channels.${key}.desc`)}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Form panel — the conversion */}
            <Reveal width="100%">
              <section
                id="kontaktformular"
                aria-label={t('contact.form_aside.title')}
                className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-1.5 w-full bg-accent" aria-hidden />
                <div className="p-6 sm:p-8 lg:p-10">
                  <ContactForm />
                </div>
              </section>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Response process — reassurance about what happens after submitting */}
      <section className="bg-white">
        <div className="mx-auto max-w-container px-4 lg:px-0 py-16 lg:py-24">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
              {t('contact.process.caption')}
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-heading lg:text-[38px]">
              {t('contact.process.title')}
            </h2>
            <p className="mt-4 leading-relaxed text-gray-700">{t('contact.process.subtitle')}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {['one', 'two', 'three'].map((step, i) => (
              <Reveal key={step} width="100%" delay={i * REVEAL_STAGGER}>
                <div className="relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-lg font-semibold text-accent"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-medium text-heading">
                    {t(`contact.process.steps.${step}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {t(`contact.process.steps.${step}.desc`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-container px-4 lg:px-0 py-16 lg:py-24">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
              {t('contact.locations.caption')}
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-heading lg:text-[38px]">
              {t('contact.locations.title')}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {offices.map((office) => (
              <Reveal key={office.key} width="100%">
                <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <span
                      className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"
                      aria-hidden
                    >
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-heading">{office.city}</h3>
                      <p className="text-sm text-accent-strong">{office.role}</p>
                    </div>
                  </div>
                  <address className="mt-5 space-y-1 text-sm not-italic leading-relaxed text-gray-700">
                    <span className="block font-semibold text-heading">{office.lines[0]}</span>
                    {office.lines.slice(1).map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <div className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-5 text-sm">
                    <a
                      href={`tel:${office.phone.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-2 font-medium text-accent-strong hover:underline"
                    >
                      <Phone className="h-4 w-4" aria-hidden />
                      {office.phone}
                    </a>
                    <a
                      href={EMAIL_HREF}
                      className="inline-flex items-center gap-2 font-medium text-accent-strong hover:underline"
                    >
                      <Mail className="h-4 w-4" aria-hidden />
                      contact@polarisdx.net
                    </a>
                  </div>
                  <a
                    href={FORM_ANCHOR}
                    className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-accent hover:text-accent-strong"
                  >
                    {t('contact.hero.cta_primary')}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

export default ContactPage
