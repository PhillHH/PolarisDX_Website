import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { useTranslation } from 'react-i18next'
import {
  LifeBuoy,
  Mail,
  Phone,
  Download,
  Package,
  ArrowRight,
  Check,
  HelpCircle,
} from 'lucide-react'
import { SEOHead, localBusinessSchema, createBreadcrumbSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal, { REVEAL_STAGGER } from '../components/ui/Reveal'
import SubpageHero from '../components/sections/SubpageHero'
import TrustBar from '../components/sections/TrustBar'
import { SupportForm } from '../components/sections/SupportForm'
import FinalCtaSection from '../components/sections/FinalCtaSection'

const EMAIL = 'contact@polarisdx.net'
const PHONE_HREF = 'tel:+4915175011699'
const PHONE_LABEL = '+49 151 75011699'

type SupportChannel = {
  icon: ReactNode
  title: string
  desc: string
  action: string
  value?: string
  to?: string
  href?: string
}

const SupportPage = () => {
  const { t, i18n } = useTranslation(['support', 'common'])

  const channels: SupportChannel[] = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: t('support.channels.email.title'),
      desc: t('support.channels.email.desc'),
      action: t('support.channels.email.action'),
      value: EMAIL,
      href: `mailto:${EMAIL}`,
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: t('support.channels.phone.title'),
      desc: t('support.channels.phone.desc'),
      action: t('support.channels.phone.action'),
      value: PHONE_LABEL,
      href: PHONE_HREF,
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: t('support.channels.docs.title'),
      desc: t('support.channels.docs.desc'),
      action: t('support.channels.docs.action'),
      to: '/downloads',
    },
  ]

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

  const prepareItems = [
    t('support.prepare.items.udi'),
    t('support.prepare.items.sw'),
    t('support.prepare.items.photo'),
    t('support.prepare.items.desc'),
  ]

  const faqRaw = t('support.faq.items', { returnObjects: true })
  const faqItems: { q: string; a: string }[] = Array.isArray(faqRaw)
    ? (faqRaw as { q: string; a: string }[])
    : []

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
          createBreadcrumbSchema(
            [
              { name: 'Home', url: '/' },
              { name: 'Support', url: '/support' },
            ],
            i18n.language,
          ),
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
        primaryCta={{ label: t('support.hero.cta_primary'), href: '#support-form' }}
        secondaryCta={{ label: t('support.hero.cta_secondary'), href: PHONE_HREF }}
        chips={[
          t('support.hero.chips.response'),
          t('support.hero.chips.channels'),
          t('support.hero.chips.attach'),
        ]}
        valueChips={[
          {
            value: t('support.hero.value.response_value'),
            label: t('support.hero.value.response_label'),
          },
          {
            value: t('support.hero.value.channels_value'),
            label: t('support.hero.value.channels_label'),
          },
          {
            value: t('support.hero.value.attach_value'),
            label: t('support.hero.value.attach_label'),
          },
        ]}
        icon={<LifeBuoy />}
      />

      <TrustBar />

      {/* Support channels — three rich, teal-tint cards */}
      <section className="bg-white">
        <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          <Reveal width="100%">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                {t('support.channels.caption')}
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight text-heading lg:text-[38px]">
                {t('support.channels.title')}
              </h2>
              <p className="mt-4 t-body">{t('support.channels.subtitle')}</p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {channels.map((c, i) => {
              const body = (
                <>
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent"
                    aria-hidden
                  >
                    {c.icon}
                  </span>
                  <h3 className="mt-5 text-lg font-medium text-heading">{c.title}</h3>
                  <p className="mt-2 t-small">{c.desc}</p>
                  {c.value && (
                    <span className="mt-4 block text-sm font-medium text-heading">{c.value}</span>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-accent group-hover:text-accent-strong">
                    {c.action}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </>
              )
              return (
                <Reveal key={c.title} width="100%" delay={i * REVEAL_STAGGER}>
                  {/* `Card` waehlt selbst zwischen <Link> und <a>. */}
                  <Card to={c.to} href={c.href}>
                    {body}
                  </Card>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <div className="bg-slate-50">
        <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] lg:items-start lg:gap-8">
            {/* Form panel — the page's single, clear conversion */}
            <Reveal width="100%">
              <section
                id="support-form"
                className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-7 sm:p-7 lg:p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                  {t('support.form_panel.caption')}
                </p>
                <h2 className="mt-3 text-2xl font-medium tracking-tight text-heading">
                  {t('support.form_panel.title')}
                </h2>
                <p className="mt-3 t-body">{t('support.intro')}</p>

                <SupportForm />
              </section>
            </Reveal>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-32">
              <Reveal width="100%" delay={REVEAL_STAGGER}>
                {/* What to have ready — teal check-list */}
                <section className="rounded-xl border border-accent/20 bg-accent/5 p-7">
                  <h2 className="text-lg font-medium tracking-tight text-heading">
                    {t('support.prepare.title')}
                  </h2>
                  <p className="mt-2 t-small">{t('support.prepare.subtitle')}</p>
                  <ul className="mt-4 space-y-2.5">
                    {prepareItems.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-700">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Helpful links */}
                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-7">
                  <h2 className="text-xs font-medium text-gray-500">
                    {t('support.sidebar_links.title', 'Hilfreiche Links')}
                  </h2>
                  <nav className="mt-4 space-y-2.5">
                    {helpfulLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="group flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-accent/40 hover:bg-accent/5"
                      >
                        <span
                          className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"
                          aria-hidden
                        >
                          {link.icon}
                        </span>
                        <span className="flex-1 text-sm font-medium text-heading">
                          {link.label}
                        </span>
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
                  <p className="mt-2 t-small">{t('support.info.text')}</p>
                  <div className="mt-4 space-y-3">
                    <a
                      href={`mailto:${EMAIL}`}
                      className="flex items-center gap-3 text-sm font-medium text-heading hover:text-accent-strong"
                    >
                      <span
                        className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"
                        aria-hidden
                      >
                        <Mail className="h-4 w-4" />
                      </span>
                      {EMAIL}
                    </a>
                    <a
                      href={PHONE_HREF}
                      className="flex items-center gap-3 text-sm font-medium text-heading hover:text-accent-strong"
                    >
                      <span
                        className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"
                        aria-hidden
                      >
                        <Phone className="h-4 w-4" />
                      </span>
                      {PHONE_LABEL}
                    </a>
                  </div>
                </section>
              </Reveal>
            </aside>
          </div>
        </div>
      </div>

      {/* FAQ — quick answers before submitting */}
      {faqItems.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
            <Reveal width="100%">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                  {t('support.faq.caption')}
                </p>
                <h2 className="mt-3 text-3xl font-medium tracking-tight text-heading lg:text-[38px]">
                  {t('support.faq.title')}
                </h2>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {faqItems.map((item, i) => (
                <Reveal key={item.q} width="100%" delay={(i % 2) * REVEAL_STAGGER}>
                  <div className="flex h-full gap-4 rounded-xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1">
                    <span
                      className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"
                      aria-hidden
                    >
                      <HelpCircle className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-heading">{item.q}</h3>
                      <p className="mt-2 t-small">{item.a}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
      <FinalCtaSection roiHref="/#roi-rechner" />
    </PageTransition>
  )
}

export default SupportPage
