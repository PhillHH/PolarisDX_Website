/**
 * Consumer landing page 2 — Hydrating Masks (5-pack)
 *
 * Built from the PolarisDX Consumer Page Wireframe Brief (2026-05-22).
 * Section order follows the brief's section-by-section copy map exactly.
 * Indexable: in sitemap, no noindex — campaign landing page.
 */

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { Droplets, Feather, Heart, Sparkles } from 'lucide-react'

import { SEOHead } from '../../components/seo'
import Footer from '../../components/layout/Footer'
import maskHero from '../../assets/landingpages-consumer/mask-hero-botanical.jpeg'
import {
  Card,
  ConsumerHeader,
  CTA,
  Disclaimer,
  FactStrip,
  FAQ,
  FinalCTA,
  Grid,
  Hero,
  IconTile,
  Pills,
  Section,
  Stats,
  Steps,
} from './shell'
import { OrderModalProvider, useOrderModal } from './OrderModal'
import { PriceBadge } from './PriceBadge'
import { useConsumerPageView } from './tracking'
import { formatCurrency } from '../../lib/localeFormat'

// Accent bars on the four ingredient cards — matches brief slide 13.
const INGREDIENT_ACCENTS = ['teal', 'navy', 'green', 'blue'] as const

const getNAV = (t: TFunction) => [
  { label: t('mask.copy_001'), href: '#benefits' },
  { label: t('mask.copy_002'), href: '#ingredients' },
  { label: t('spray.copy_028'), href: '#how' },
  { label: t('spray.copy_004'), href: '#faq' },
]

const ICON_CLASS = 'h-6 w-6'

const getBENEFITS = (t: TFunction): { title: string; body: string; icon: ReactNode }[] => [
  {
    title: t('mask.copy_003'),
    body: t('mask.copy_004'),
    icon: <Droplets className={ICON_CLASS} strokeWidth={1.75} />,
  },
  {
    title: t('mask.copy_005'),
    body: t('mask.copy_006'),
    icon: <Heart className={ICON_CLASS} strokeWidth={1.75} />,
  },
  {
    title: t('mask.copy_007'),
    body: t('mask.copy_008'),
    icon: <Feather className={ICON_CLASS} strokeWidth={1.75} />,
  },
  {
    title: t('mask.copy_009'),
    body: t('mask.copy_010'),
    icon: <Sparkles className={ICON_CLASS} strokeWidth={1.75} />,
  },
]

const getINGREDIENTS = (t: TFunction) => [
  {
    title: t('mask.copy_011'),
    items: ['Sodium Hyaluronate', 'Glycerin', 'Betaine', 'Trehalose', 'Propylene Glycol'],
  },
  {
    title: t('mask.copy_012'),
    items: ['Niacinamide', 'Licorice Root Extract', 'Green Tea Extract', 'Soluble Collagen'],
  },
  {
    title: t('mask.copy_013'),
    items: ['Centella Asiatica', 'Chamomile', 'Scutellaria Baicalensis', 'Rosemary Extract'],
  },
  {
    title: t('mask.copy_014'),
    items: [
      'Palmitoyl Tripeptide-38',
      'Crithmum Maritimum Extract',
      'Hydroxypropyl Cyclodextrin',
      t('mask.serum_mask'),
    ],
  },
]

const getFAQ_ITEMS = (t: TFunction) => [
  {
    q: t('mask.copy_015'),
    a: t('mask.copy_016'),
  },
  {
    q: t('mask.copy_017'),
    a: t('mask.copy_018'),
  },
  {
    q: t('mask.copy_019'),
    a: t('mask.copy_020'),
  },
  {
    q: t('mask.copy_021'),
    a: t('mask.copy_022'),
  },
  {
    q: t('mask.copy_023'),
    a: t('mask.copy_024'),
  },
  {
    q: t('mask.copy_025'),
    a: t('mask.copy_026'),
  },
  {
    q: t('mask.copy_027'),
    a: t('mask.copy_028'),
  },
  {
    q: t('mask.copy_029'),
    a: t('mask.copy_030'),
  },
]

export default function MaskPage() {
  return (
    <OrderModalProvider product="masks" page="masks">
      <MaskPageInner />
    </OrderModalProvider>
  )
}

function MaskPageInner() {
  const { t, i18n } = useTranslation('consumer')
  const NAV = getNAV(t)
  const BENEFITS = getBENEFITS(t)
  const INGREDIENTS = getINGREDIENTS(t)
  const FAQ_ITEMS = getFAQ_ITEMS(t)
  useConsumerPageView('masks')
  const orderModal = useOrderModal()
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-heading">
      <SEOHead title={t('mask.copy_031')} description={t('mask.copy_032')} />

      <ConsumerHeader nav={NAV} cta={{ label: t('mask.copy_033'), href: '#order' }} page="masks" />

      {/* 2 · HERO */}
      <Hero
        page="masks"
        eyebrow={t('mask.copy_034')}
        title={t('mask.copy_035')}
        sub={t('mask.copy_036')}
        primary={{ label: t('mask.copy_033'), href: '#order' }}
        secondary={{ label: t('spray.copy_028'), href: '#how' }}
        image={{
          src: maskHero,
          alt: t('mask.copy_037'),
        }}
        price={{ amount: formatCurrency(45, i18n.resolvedLanguage), unit: t('mask.copy_038') }}
        priceBadge={<PriceBadge product="masks" />}
        highlights={[t('mask.copy_039'), t('mask.copy_040'), t('mask.copy_041')]}
        floatingStat={{ value: '15 ml', label: t('mask.copy_042') }}
      />
      <FactStrip
        items={[t('mask.copy_043'), t('mask.copy_044'), t('mask.copy_045'), t('mask.copy_046')]}
      />

      {/* 3 · SKIN NEED */}
      <Section
        id="skin-need"
        tone="tint"
        eyebrow={t('mask.copy_047')}
        title={t('mask.copy_048')}
        lead={t('mask.copy_049')}
      />

      {/* 4 · BENEFITS */}
      <Section id="benefits" eyebrow={t('spray.copy_064')} title={t('mask.copy_050')}>
        <Grid cols={4}>
          {BENEFITS.map((b) => (
            <Card key={b.title} hover className="flex h-full flex-col">
              <IconTile>{b.icon}</IconTile>
              <h3 className="mt-5 text-xl font-semibold text-heading">{b.title}</h3>
              <p className="mt-3 leading-relaxed text-gray-600">{b.body}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* 5 · WHAT IS INSIDE */}
      <Section
        id="ingredients"
        tone="tint"
        eyebrow={t('spray.copy_069')}
        title={t('mask.copy_051')}
        lead={t('mask.copy_052')}
      >
        <Grid cols={4}>
          {INGREDIENTS.map((group, i) => (
            <Card key={group.title} hover accent={INGREDIENT_ACCENTS[i]} className="h-full">
              <h3 className="text-base font-semibold tracking-tight text-heading">{group.title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
                {group.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-accent-on-dark"
                    />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </Grid>
        <p className="mt-8 text-center text-sm text-gray-500">{t('mask.copy_053')}</p>
      </Section>

      {/* 6 · HOW TO USE */}
      <Section id="how" eyebrow={t('spray.copy_028')} title={t('mask.copy_054')}>
        <Steps
          items={[
            { title: t('mask.copy_055'), body: t('mask.copy_056') },
            {
              title: t('mask.copy_057'),
              body: t('mask.copy_058'),
            },
            {
              title: t('mask.copy_059'),
              body: t('mask.copy_060'),
            },
            {
              title: t('mask.copy_061'),
              body: t('mask.copy_062'),
            },
          ]}
        />
      </Section>

      {/* 7 · WHO IT IS FOR */}
      <Section tone="tint" eyebrow={t('spray.copy_066')} title={t('mask.copy_063')}>
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Pills
              items={[
                t('mask.copy_039'),
                t('mask.copy_064'),
                t('mask.copy_065'),
                t('mask.copy_066'),
              ]}
            />
          </div>
          <p className="mt-6 leading-relaxed text-gray-600">{t('mask.copy_067')}</p>
        </div>
      </Section>

      {/* 8 · 5-PACK OFFER */}
      <Section id="offer" eyebrow={t('mask.copy_068')} title={t('mask.copy_069')}>
        <Stats
          items={[
            { value: '5', label: t('mask.copy_070') },
            { value: '15 ml', label: t('mask.copy_071') },
            { value: '15–30', label: t('mask.copy_072') },
          ]}
        />
        <div className="mx-auto mt-12 max-w-2xl text-center lg:mt-16">
          <p className="text-lg leading-relaxed text-gray-600">{t('mask.copy_073')}</p>
          <div className="mt-8">
            <CTA
              onClick={() => orderModal?.open('5-pack-offer')}
              variant="navy"
              track={{ label: t('mask.copy_033'), page: 'masks', location: '5-pack-offer' }}
            >
              {t('mask.copy_033')}
            </CTA>
          </div>
        </div>
      </Section>

      {/* 9 · PACKAGING MESSAGE */}
      <Section
        tone="dark"
        eyebrow={t('mask.copy_074')}
        title={t('mask.copy_075')}
        lead={t('mask.copy_076')}
      >
        <div className="flex justify-center">
          <Pills
            onDark
            items={[
              t('mask.copy_077'),
              t('mask.copy_078'),
              t('mask.copy_039'),
              t('mask.copy_079'),
              t('mask.copy_080'),
            ]}
          />
        </div>
      </Section>

      {/* Bridge — outside hydration → inside support (mirrors the Spray page) */}
      <Section
        tone="tint"
        align="left"
        eyebrow={t('mask.copy_081')}
        title={t('mask.copy_082')}
        lead={t('mask.copy_083')}
      >
        <div className="flex flex-wrap gap-3">
          <CTA
            to="/consumer/inside-out-duo"
            variant="navy"
            track={{
              label: t('spray.copy_095'),
              page: 'masks',
              location: 'bridge',
            }}
          >
            {t('spray.copy_095')}
          </CTA>
          <CTA
            to="/consumer/vitamin-d3-spray"
            variant="outline-navy"
            track={{
              label: t('mask.copy_084'),
              page: 'masks',
              location: 'bridge',
            }}
          >
            {t('mask.copy_084')}
          </CTA>
        </div>
      </Section>

      {/* 10 · FAQ */}
      <Section id="faq" eyebrow={t('spray.copy_004')} title={t('spray.copy_096')}>
        <FAQ items={FAQ_ITEMS} />
      </Section>

      {/* Final CTA — opens the order modal */}
      <FinalCTA
        page="masks"
        id="order"
        title={t('mask.copy_085')}
        body={t('mask.copy_086')}
        primary={{ label: t('mask.copy_033'), href: '#' }}
        assurances={[t('mask.copy_039'), t('mask.copy_087'), t('spray.copy_057')]}
        note={t('spray.copy_100')}
      />

      {/* 11 · FOOTER */}
      <Disclaimer>{t('mask.copy_088')}</Disclaimer>

      <Footer />
    </div>
  )
}
