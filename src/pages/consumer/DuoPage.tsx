/**
 * Consumer landing page 3 — Inside-Out Care Duo (1 spray + 5 masks)
 *
 * Built from the PolarisDX Consumer Page Wireframe Brief (2026-05-22).
 * Section order follows the brief's section-by-section copy map exactly.
 * Indexable: in sitemap, no noindex — campaign landing page.
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { Droplets, Sun } from 'lucide-react'

import { SEOHead } from '../../components/seo'
import Footer from '../../components/layout/Footer'
import duoHero from '../../assets/landingpages-consumer/duo-hero-products-together.jpeg'
import sprayStill from '../../assets/landingpages-consumer/spray-still-life.jpeg'
import maskBotanical from '../../assets/landingpages-consumer/mask-hero-botanical.jpeg'
import {
  Card,
  ConsumerHeader,
  Disclaimer,
  FactStrip,
  FAQ,
  FinalCTA,
  Hero,
  IconTile,
  Pills,
  Section,
} from './shell'
import { OrderModalProvider } from './OrderModal'
import { PriceBadge } from './PriceBadge'
import { useConsumerPageView } from './tracking'
import { formatCurrency } from '../../lib/localeFormat'

const getNAV = (t: TFunction) => [
  { label: t('duo.copy_001'), href: '#included' },
  { label: t('duo.copy_002'), href: '#routine' },
  { label: t('spray.copy_004'), href: '#faq' },
]

const getFAQ_ITEMS = (t: TFunction) => [
  { q: t('duo.copy_003'), a: t('duo.copy_004') },
  { q: t('duo.copy_005'), a: t('duo.copy_006') },
  {
    q: t('duo.copy_007'),
    a: t('duo.copy_008'),
  },
  {
    q: t('duo.copy_009'),
    a: t('duo.copy_010'),
  },
  {
    q: t('duo.copy_011'),
    a: t('duo.copy_012'),
  },
  {
    q: t('duo.copy_013'),
    a: t('duo.copy_014'),
  },
]

export default function DuoPage() {
  return (
    <OrderModalProvider product="duo" page="duo">
      <DuoPageInner />
    </OrderModalProvider>
  )
}

function DuoPageInner() {
  const { t, i18n } = useTranslation('consumer')
  const duoPrice = formatCurrency(49.9, i18n.resolvedLanguage)
  const monthlyAddOn = formatCurrency(2, i18n.resolvedLanguage)
  const NAV = getNAV(t)
  const FAQ_ITEMS = getFAQ_ITEMS(t)
  useConsumerPageView('duo')
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-heading">
      <SEOHead
        title={t('duo.copy_015')}
        description={t('duo.seo_description', { price: duoPrice })}
      />

      <ConsumerHeader nav={NAV} cta={{ label: t('duo.copy_017'), href: '#order' }} page="duo" />

      {/* 2 · HERO */}
      <Hero
        page="duo"
        eyebrow={t('duo.copy_018')}
        title={t('duo.copy_019')}
        sub={
          <>
            {t('duo.copy_020')}
            <span className="mt-3 block font-semibold text-heading">{t('duo.copy_021')}</span>
          </>
        }
        primary={{ label: t('duo.copy_022'), href: '#order' }}
        secondary={{ label: t('duo.copy_001'), href: '#included' }}
        image={{
          src: duoHero,
          alt: t('duo.copy_023'),
        }}
        price={{ amount: duoPrice, unit: t('duo.copy_024') }}
        priceBadge={<PriceBadge product="duo" />}
        highlights={[t('duo.copy_025'), t('duo.copy_026'), t('spray.copy_057')]}
        floatingStat={{ value: '1 + 5', label: t('duo.copy_027') }}
      />
      <FactStrip items={[t('duo.copy_028'), t('duo.copy_029'), t('duo.copy_030')]} />

      {/* 3 · THE IDEA */}
      <Section
        tone="tint"
        eyebrow={t('duo.copy_031')}
        title={t('duo.copy_032')}
        lead={t('duo.copy_033')}
      />

      {/* 4 · WHAT'S INCLUDED */}
      <Section id="included" eyebrow={t('duo.copy_001')} title={t('duo.copy_034')}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card hover className="flex h-full flex-col">
            <IconTile>
              <Sun className="h-6 w-6" strokeWidth={1.75} />
            </IconTile>
            <h3 className="mt-5 text-xl font-semibold text-heading">{t('duo.copy_028')}</h3>
            <p className="mt-3 flex-grow leading-relaxed text-gray-600">{t('duo.copy_035')}</p>
            <Link
              to="/consumer/vitamin-d3-spray"
              data-gtm-event="consumer_cta_click"
              data-gtm-cta="See the spray page"
              data-gtm-page="duo"
              data-gtm-location="included-card"
              className="group mt-6 inline-flex items-center gap-1.5 self-start rounded text-sm font-semibold text-accent-strong transition-colors hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2"
            >
              {t('duo.copy_036')}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </Card>
          <Card hover className="flex h-full flex-col">
            <IconTile>
              <Droplets className="h-6 w-6" strokeWidth={1.75} />
            </IconTile>
            <h3 className="mt-5 text-xl font-semibold text-heading">{t('duo.copy_037')}</h3>
            <p className="mt-3 flex-grow leading-relaxed text-gray-600">{t('duo.copy_038')}</p>
            <Link
              to="/consumer/hydrating-masks"
              data-gtm-event="consumer_cta_click"
              data-gtm-cta="See the mask page"
              data-gtm-page="duo"
              data-gtm-location="included-card"
              className="group mt-6 inline-flex items-center gap-1.5 self-start rounded text-sm font-semibold text-accent-strong transition-colors hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2"
            >
              {t('duo.copy_039')}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </Card>
        </div>
      </Section>

      {/* 5 + 6 · INSIDE STEP / OUTSIDE STEP */}
      <Section id="routine" tone="tint" eyebrow={t('duo.copy_040')} title={t('duo.copy_041')}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card hover accent="teal" className="h-full">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
              {t('duo.copy_042')}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-heading">{t('duo.copy_043')}</h3>
            <p className="mt-3 leading-relaxed text-gray-600">{t('duo.copy_044')}</p>
          </Card>
          <Card hover accent="navy" className="h-full">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
              {t('duo.copy_045')}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-heading">{t('duo.copy_046')}</h3>
            <p className="mt-3 leading-relaxed text-gray-600">{t('duo.copy_047')}</p>
          </Card>
        </div>
      </Section>

      {/* 7 · ROUTINE VISUAL */}
      <Section eyebrow={t('duo.copy_048')} title={t('duo.copy_049')}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="group overflow-hidden rounded-section">
            <img
              src={sprayStill}
              alt={t('duo.copy_050')}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
          <div className="group overflow-hidden rounded-section">
            <img
              src={maskBotanical}
              alt={t('duo.copy_051')}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        </div>
      </Section>

      {/* 8 · BUNDLE VALUE */}
      {/* CONFIRM: €2/month — is this number final, and what's the basis? */}
      <Section
        tone="dark"
        eyebrow={t('duo.copy_052')}
        title={t('duo.copy_053')}
        lead={t('duo.bundle_lead', { price: monthlyAddOn })}
      >
        <div className="flex justify-center">
          <Pills
            onDark
            items={[t('duo.copy_043'), t('duo.copy_046'), t('duo.copy_055'), t('duo.copy_056')]}
          />
        </div>
      </Section>

      {/* 9 · FAQ */}
      <Section id="faq" eyebrow={t('spray.copy_004')} title={t('spray.copy_096')}>
        <FAQ items={FAQ_ITEMS} />
      </Section>

      {/* 10 · FINAL CTA — opens the order modal */}
      <FinalCTA
        page="duo"
        id="order"
        title={t('duo.copy_057')}
        body={t('duo.copy_058')}
        primary={{ label: t('duo.copy_022'), href: '#' }}
        assurances={[t('duo.copy_025'), t('duo.copy_056'), t('spray.copy_057')]}
        note={t('spray.copy_100')}
      />

      {/* 11 · FOOTER */}
      <Disclaimer>{t('duo.copy_059')}</Disclaimer>

      <Footer />
    </div>
  )
}
