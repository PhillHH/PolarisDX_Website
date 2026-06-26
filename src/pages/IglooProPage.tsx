import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Wifi, Battery, ShieldCheck, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SEOHead, iglooProProductSchema, createBreadcrumbSchema } from '../components/seo'
import { Button, Eyebrow, GradientSurface } from '~/design-system'
import CtaBand from '../components/sections/CtaBand'
import iglooImage from '../assets/igloo_front.webp' // Using existing asset
import IglooProFlyer from '../assets/downloads/igloo-pro-flyer.pdf'

// Hook for intersection observer animation trigger
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, ...options },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}

const IglooProPage: React.FC = () => {
  const { t } = useTranslation(['products'])
  const featuresSection = useInView()

  // SCHUTZREGEL: Spec-Werte (Immunfluoreszenz, 600 g, 3–15 min, CV, USB/LAN/WLAN …)
  // sind geschützte Fakten und bleiben wörtlich aus dem Locale erhalten.
  const specs = [
    { label: t('products:specs.methods'), value: t('products:specs.methods_value') },
    { label: t('products:specs.samples'), value: t('products:specs.samples_value') },
    { label: t('products:specs.weight'), value: t('products:specs.weight_value') },
    { label: t('products:specs.dimensions'), value: t('products:specs.dimensions_value') },
    { label: t('products:specs.speed'), value: t('products:specs.speed_value') },
    { label: t('products:specs.accuracy'), value: t('products:specs.accuracy_value') },
    { label: t('products:specs.storage'), value: t('products:specs.storage_value') },
    { label: t('products:specs.battery'), value: t('products:specs.battery_value') },
    { label: t('products:specs.communication'), value: t('products:specs.communication_value') },
  ]

  const features = [
    {
      icon: Layers,
      title: t('products:features.methods.title'),
      description: t('products:features.methods.description'),
    },
    {
      icon: Battery,
      title: t('products:features.battery.title'),
      description: t('products:features.battery.description'),
    },
    {
      icon: Wifi,
      title: t('products:features.connectivity.title'),
      description: t('products:features.connectivity.description'),
    },
    {
      icon: ShieldCheck,
      title: t('products:features.precision.title'),
      description: t('products:features.precision.description'),
    },
  ]

  // SCHUTZREGEL: alle Biomarker/Parameter wörtlich erhalten.
  const parameters = [
    t('products:parameters.list.vitd3'),
    t('products:parameters.list.crp'),
    t('products:parameters.list.hba1c'),
    t('products:parameters.list.ferritin'),
    t('products:parameters.list.cortisol'),
    t('products:parameters.list.tsh'),
    t('products:parameters.list.ddimer'),
    t('products:parameters.list.troponin'),
    t('products:parameters.list.flu'),
    t('products:parameters.list.rsv'),
    t('products:parameters.list.strep'),
  ]

  return (
    <div className="min-h-screen bg-bg">
      <SEOHead
        title={t('seo.title', 'IglooPro POC-Reader: Spezifikationen & Technik | PolarisDX')}
        description={t(
          'seo.description',
          'Immunfluoreszenz-Messgerät für 10+ Biomarker. 600g, CV <2%, USB/LAN/WLAN. IVDR-konform, Ergebnis in 3-15 Min. Angebot anfordern.',
        )}
        ogType="product"
        keywords={[
          'IglooPro',
          'POC Reader kaufen',
          'Point-of-Care Analysegerät',
          'Immunfluoreszenz',
          'Vitamin D Schnelltest Gerät',
        ]}
        structuredData={[
          iglooProProductSchema,
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'IglooPro', url: '/igloo-pro' },
          ]),
        ]}
      />

      {/* Hero — Split, Navy-Gradient (§Konzept 5). Genau eine Display-Headline,
          eine Primäraktion (Angebot anfordern) + Sekundär (Datenblatt). */}
      <GradientSurface>
        <div className="relative z-10 mx-auto max-w-container px-4 pb-16 pt-28 lg:px-0 lg:pb-24 lg:pt-36">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div>
              <Eyebrow size="sm" className="mb-5">
                {t('products:hero.caption', 'Point-of-Care-Diagnostik')}
              </Eyebrow>
              <h1 className="max-w-xl font-medium tracking-headline text-display-sm">
                {t('products:hero.title', 'Igloo Pro System')}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-on-dark/80 sm:text-lg">
                {t('products:hero.description')}
              </p>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  to="/contact"
                  variant="primary"
                  size="lg"
                  onDark
                  className="w-full text-center sm:w-auto sm:whitespace-nowrap"
                >
                  {t('products:hero.cta_order', 'Angebot anfordern')}
                </Button>
                <Button
                  href={IglooProFlyer}
                  variant="outline"
                  size="lg"
                  onDark
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center sm:w-auto sm:whitespace-nowrap"
                >
                  {t('products:hero.cta_datasheet', 'Datenblatt')}
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative animate-fade-in-scale">
                <div className="absolute inset-0 bg-brand-primary/30 blur-3xl rounded-full" />
                <img
                  src={iglooImage}
                  alt="IglooPro POC-Analysegerät für Point-of-Care Schnelltests in Arztpraxen"
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 w-full max-w-md drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </GradientSurface>

      {/* Intro */}
      <section className="bg-surface py-20 lg:py-24">
        <div className="mx-auto max-w-container px-4 lg:px-0">
          <div className="mx-auto flex max-w-reading flex-col items-center gap-6 text-center">
            <Eyebrow size="sm">{t('products:intro.caption', 'Das System')}</Eyebrow>
            <h2 className="text-display-sm font-medium tracking-headline text-fg-heading">
              {t('products:intro.title')}
            </h2>
            <p className="text-lg leading-relaxed text-fg">{t('products:intro.text1')}</p>
            <p className="text-lg leading-relaxed text-fg">{t('products:intro.text2')}</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-bg py-20 lg:py-24" ref={featuresSection.ref}>
        <div className="mx-auto max-w-container px-4 lg:px-0">
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <Eyebrow size="sm">{t('products:features.caption', 'Eigenschaften')}</Eyebrow>
            <h2 className="text-display-sm font-medium tracking-headline text-fg-heading">
              {t('products:features.title', 'Für den Praxisalltag gebaut')}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-surface p-6 shadow-1 transition-all duration-500 hover:shadow-2 ${
                  featuresSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <feature.icon className="mb-4 h-10 w-10 text-brand-primary" />
                <h3 className="mb-2 text-xl font-semibold text-fg-heading">{feature.title}</h3>
                <p className="text-fg-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technik-Block — Specs-Tabelle + Parameter zusammengeführt (§RELAUNCH-PLAN B1).
          Ein zusammenhängender Technik-Block statt zwei getrennter Wiederholungen. */}
      <section className="bg-surface py-20 lg:py-24">
        <div className="mx-auto max-w-container px-4 lg:px-0">
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <Eyebrow size="sm">{t('products:specs.caption', 'Technik')}</Eyebrow>
            <h2 className="text-display-sm font-medium tracking-headline text-fg-heading">
              {t('products:specs.title')}
            </h2>
          </div>

          {/* Specs-Tabelle (Werte wörtlich) */}
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[var(--radius-section)] border border-[var(--color-border)] shadow-1">
            <div className="grid gap-px bg-[var(--color-border)]">
              {specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="grid bg-surface p-4 transition-colors hover:bg-bg-subtle md:grid-cols-3"
                >
                  <div className="font-semibold text-fg-heading">{spec.label}</div>
                  <div className="text-fg md:col-span-2">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-fg-muted">
            Hergestellt von{' '}
            <a
              href="https://dx365.world"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-fg transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
            >
              DX365 GmbH
            </a>
            , Berlin · Europäischer Vertrieb: PolarisDX
          </p>

          {/* Parameter (Biomarker) direkt im Technik-Block (Werte wörtlich) */}
          <div className="mx-auto mt-16 max-w-4xl border-t border-[var(--color-border)] pt-12">
            <h3 className="mb-8 text-center text-xl font-semibold text-fg-heading">
              {t('products:parameters.title')}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {parameters.map((param, idx) => (
                <span
                  key={idx}
                  className="rounded-[var(--radius-full)] border border-[var(--color-border)] bg-bg px-5 py-2.5 font-medium text-fg transition-colors hover:border-brand-primary hover:text-brand-primary"
                >
                  {param}
                </span>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-fg-muted">
              {t('products:parameters.disclaimer')}
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases / Related Services */}
      <section className="bg-bg py-20 lg:py-24">
        <div className="mx-auto max-w-container px-4 text-center lg:px-0">
          <h2 className="mb-8 text-2xl font-semibold text-fg-heading">
            {t('products:use_cases.title', 'Einsatzbereiche')}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/diagnostics/dental"
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-surface px-6 py-4 text-sm font-medium text-fg shadow-1 transition-all hover:border-brand-primary hover:text-brand-primary hover:shadow-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus-ring)]"
            >
              {t('products:use_cases.dental', 'Dental-Diagnostik')}
            </Link>
            <Link
              to="/diagnostics/beauty"
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-surface px-6 py-4 text-sm font-medium text-fg shadow-1 transition-all hover:border-brand-primary hover:text-brand-primary hover:shadow-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus-ring)]"
            >
              {t('products:use_cases.beauty', 'Beauty & Ästhetik')}
            </Link>
            <Link
              to="/diagnostics/longevity"
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-surface px-6 py-4 text-sm font-medium text-fg shadow-1 transition-all hover:border-brand-primary hover:text-brand-primary hover:shadow-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus-ring)]"
            >
              {t('products:use_cases.longevity', 'Longevity & Prävention')}
            </Link>
          </div>
          <div className="mt-6">
            <Link
              to="/articles"
              className="text-sm font-semibold text-brand-primary transition-colors hover:text-brand-deep rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
            >
              {t('products:use_cases.articles', 'Fachartikel lesen')} →
            </Link>
          </div>
        </div>
      </section>

      {/* Schluss-CTA-Band — geteiltes CtaBand (§Konzept 5, [FRO] keine Duplikate).
          Eine Primär- (Angebot anfordern) + eine Sekundäraktion (Datenblatt). */}
      <CtaBand
        caption={t('products:cta_bottom.caption', 'Jetzt starten')}
        title={t('products:cta_bottom.title')}
        text={t('products:cta_bottom.description')}
        primary={{ label: t('products:cta_bottom.button'), to: '/contact' }}
        secondary={{
          label: t('products:cta_bottom.button_secondary', 'Datenblatt'),
          href: IglooProFlyer,
          target: '_blank',
          rel: 'noopener noreferrer',
        }}
      />
    </div>
  )
}

export default IglooProPage
