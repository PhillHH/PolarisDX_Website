/**
 * Consumer landing page 1 — Vitamin D3+K2 Spray (12-pack)
 *
 * Built from the PolarisDX Consumer Page Wireframe Brief (2026-05-22).
 * Section order follows the brief's section-by-section copy map exactly.
 * Indexable: in sitemap, no noindex — campaign landing page.
 */

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { Building2, Dumbbell, Home, Package, Repeat, Share2, Users, Zap } from 'lucide-react'

import { SEOHead } from '../../components/seo'
import Footer from '../../components/layout/Footer'
import sprayHero from '../../assets/landingpages-consumer/spray-hero-12pack-office.jpeg'
import sprayStill from '../../assets/landingpages-consumer/spray-still-life.jpeg'
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

const getNAV = (t: TFunction) => [
  { label: t('spray.copy_001'), href: '#why' },
  { label: t('spray.copy_002'), href: '#audiences' },
  { label: t('spray.copy_003'), href: '#how' },
  { label: t('spray.copy_004'), href: '#faq' },
]

const ICON_CLASS = 'h-6 w-6'

const getBENEFITS = (t: TFunction): { title: string; body: string; icon: ReactNode }[] => [
  {
    title: t('spray.copy_005'),
    body: t('spray.copy_006'),
    icon: <Zap className={ICON_CLASS} strokeWidth={1.75} />,
  },
  {
    title: t('spray.copy_007'),
    body: t('spray.copy_008'),
    icon: <Share2 className={ICON_CLASS} strokeWidth={1.75} />,
  },
  {
    title: t('spray.copy_009'),
    body: t('spray.copy_010'),
    icon: <Package className={ICON_CLASS} strokeWidth={1.75} />,
  },
  {
    title: t('spray.copy_011'),
    body: t('spray.copy_012'),
    icon: <Repeat className={ICON_CLASS} strokeWidth={1.75} />,
  },
]

const getAUDIENCES = (
  t: TFunction,
): { title: string; body: string; cta: string; icon: ReactNode }[] => [
  {
    title: t('spray.copy_013'),
    body: t('spray.copy_014'),
    cta: t('spray.copy_015'),
    icon: <Building2 className={ICON_CLASS} strokeWidth={1.75} />,
  },
  {
    title: t('spray.copy_016'),
    body: t('spray.copy_017'),
    cta: t('spray.copy_018'),
    icon: <Home className={ICON_CLASS} strokeWidth={1.75} />,
  },
  {
    title: t('spray.copy_002'),
    body: t('spray.copy_019'),
    cta: t('spray.copy_020'),
    icon: <Users className={ICON_CLASS} strokeWidth={1.75} />,
  },
  {
    title: t('spray.copy_021'),
    body: t('spray.copy_022'),
    cta: t('spray.copy_023'),
    icon: <Dumbbell className={ICON_CLASS} strokeWidth={1.75} />,
  },
]

const getSUBLINGUAL = (t: TFunction) => [
  {
    title: t('spray.copy_024'),
    body: t('spray.copy_025'),
  },
  {
    title: t('spray.copy_026'),
    body: t('spray.copy_027'),
  },
  {
    title: t('spray.copy_028'),
    body: t('spray.copy_029'),
  },
]

const getFACTS = (t: TFunction): [string, string][] => [
  [t('spray.facts.pack_size'), t('spray.facts.pack_value')],
  [t('spray.facts.applications'), t('spray.copy_059')],
  [t('spray.facts.format'), t('spray.facts.format_value')],
  [t('spray.facts.dosage'), '1000 IU Vitamin D3 + 25 µg Vitamin K2'],
  [t('spray.facts.suitable_for'), t('spray.copy_060')],
  [t('spray.facts.origin'), t('spray.copy_055')],
]

const getFAQ_ITEMS = (t: TFunction) => [
  {
    q: t('spray.copy_030'),
    a: t('spray.copy_031'),
  },
  {
    q: t('spray.copy_032'),
    a: t('spray.copy_033'),
  },
  {
    q: t('spray.copy_034'),
    a: t('spray.copy_035'),
  },
  {
    q: t('spray.copy_036'),
    a: t('spray.copy_037'),
  },
  {
    q: t('spray.copy_038'),
    a: t('spray.copy_039'),
  },
  {
    q: t('spray.copy_040'),
    a: t('spray.copy_041'),
  },
  {
    q: t('spray.copy_042'),
    a: t('spray.copy_043'),
  },
  {
    q: t('spray.copy_044'),
    a: t('spray.copy_045'),
  },
]

export default function SprayPage() {
  return (
    <OrderModalProvider product="spray" page="spray">
      <SprayPageInner />
    </OrderModalProvider>
  )
}

function SprayPageInner() {
  const { t, i18n } = useTranslation('consumer')
  const NAV = getNAV(t)
  const BENEFITS = getBENEFITS(t)
  const AUDIENCES = getAUDIENCES(t)
  const SUBLINGUAL = getSUBLINGUAL(t)
  const FACTS = getFACTS(t)
  const FAQ_ITEMS = getFAQ_ITEMS(t)
  useConsumerPageView('spray')
  const orderModal = useOrderModal()
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-heading">
      <SEOHead title={t('spray.copy_046')} description={t('spray.copy_047')} />

      <ConsumerHeader nav={NAV} cta={{ label: t('spray.copy_048'), href: '#order' }} page="spray" />

      {/* 2 · HERO */}
      <Hero
        page="spray"
        eyebrow={t('spray.copy_049')}
        title={t('spray.copy_050')}
        sub={t('spray.copy_051')}
        primary={{ label: t('spray.copy_052'), href: '#order' }}
        secondary={{ label: t('spray.copy_003'), href: '#how' }}
        image={{
          src: sprayHero,
          alt: t('spray.copy_053'),
        }}
        price={{ amount: formatCurrency(169, i18n.resolvedLanguage), unit: t('spray.copy_054') }}
        priceBadge={<PriceBadge product="spray" />}
        highlights={[t('spray.copy_055'), t('spray.copy_056'), t('spray.copy_057')]}
        floatingStat={{ value: '71', label: t('spray.copy_058') }}
      />
      <FactStrip
        items={[
          t('spray.copy_054'),
          t('spray.copy_059'),
          t('spray.copy_060'),
          t('spray.copy_055'),
          t('spray.copy_061'),
        ]}
      />

      {/* 3 · WHY IT MATTERS */}
      <Section
        id="why"
        tone="tint"
        eyebrow={t('spray.copy_026')}
        title={t('spray.copy_062')}
        lead={t('spray.copy_063')}
      />

      {/* 4 · BENEFITS */}
      <Section eyebrow={t('spray.copy_064')} title={t('spray.copy_065')}>
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

      {/* 5 · WHO IT IS FOR */}
      <Section
        id="audiences"
        tone="tint"
        eyebrow={t('spray.copy_066')}
        title={t('spray.copy_067')}
        lead={t('spray.copy_068')}
      >
        <Grid cols={4}>
          {AUDIENCES.map((a) => (
            <Card key={a.title} hover className="flex h-full flex-col">
              <IconTile>{a.icon}</IconTile>
              <h3 className="mt-5 text-xl font-semibold text-heading">{a.title}</h3>
              <p className="mt-3 flex-grow leading-relaxed text-gray-600">{a.body}</p>
              <button
                type="button"
                onClick={() =>
                  orderModal?.open(`audience-${a.title.toLowerCase().replace(/[ &]+/g, '-')}`)
                }
                data-gtm-event="consumer_cta_click"
                data-gtm-cta={a.cta}
                data-gtm-page="spray"
                data-gtm-location={`audience-${a.title.toLowerCase().replace(/[ &]+/g, '-')}`}
                className="group mt-6 inline-flex items-center gap-1.5 self-start rounded text-sm font-semibold text-accent-strong transition-colors hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2"
              >
                {a.cta}
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* 6 · WHAT IS INSIDE */}
      <Section eyebrow={t('spray.copy_069')} title={t('spray.copy_070')}>
        <div className="mb-12 lg:mb-16">
          <Stats
            items={[
              { value: '12', label: t('spray.copy_071') },
              { value: '71', label: t('spray.copy_058') },
              { value: '1000 IU', label: t('spray.copy_072') },
              { value: '25 µg', label: t('spray.copy_073') },
            ]}
          />
        </div>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <Card className="p-0">
            <dl className="divide-y divide-slate-100">
              {FACTS.map(([label, value]) => (
                <div key={label} className="flex gap-6 px-8 py-5">
                  <dt className="w-40 flex-none text-sm font-semibold text-heading">{label}</dt>
                  <dd className="text-gray-600">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <div className="group mx-auto w-full max-w-sm overflow-hidden rounded-2xl lg:max-w-md">
            <img
              src={sprayStill}
              alt={t('spray.copy_074')}
              loading="lazy"
              decoding="async"
              className="w-full transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        </div>
      </Section>

      {/* 7 · HOW TO USE */}
      <Section id="how" tone="tint" eyebrow={t('spray.copy_028')} title={t('spray.copy_075')}>
        <Steps
          items={[
            { title: t('spray.copy_076'), body: t('spray.copy_077') },
            {
              title: t('spray.copy_078'),
              body: t('spray.copy_079'),
            },
            {
              title: t('spray.copy_080'),
              body: t('spray.copy_081'),
            },
          ]}
        />
        <p className="mt-8 text-center text-sm text-gray-500">{t('spray.copy_082')}</p>
      </Section>

      {/* 8 · WHY SPRAY */}
      <Section eyebrow={t('spray.copy_083')} title={t('spray.copy_084')}>
        <div className="flex justify-center">
          <Pills
            items={[
              t('spray.copy_085'),
              t('spray.copy_086'),
              t('spray.copy_087'),
              t('spray.copy_088'),
              t('spray.copy_089'),
            ]}
          />
        </div>
      </Section>

      {/* 9 · SUBLINGUAL BENEFITS */}
      <Section tone="tint" eyebrow={t('spray.copy_090')} title={t('spray.copy_091')}>
        <Grid cols={3}>
          {SUBLINGUAL.map((s) => (
            <Card key={s.title} hover className="flex h-full flex-col">
              <h3 className="text-xl font-semibold text-heading">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-gray-600">{s.body}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* 10 · BRIDGE TO DUO */}
      <Section
        tone="dark"
        eyebrow={t('spray.copy_092')}
        title={t('spray.copy_093')}
        align="left"
        lead={t('spray.copy_094')}
      >
        <CTA
          to="/consumer/inside-out-duo"
          variant="teal"
          track={{
            label: t('spray.copy_095'),
            page: 'spray',
            location: 'bridge-to-duo',
          }}
        >
          {t('spray.copy_095')}
        </CTA>
      </Section>

      {/* 11 · FAQ */}
      <Section id="faq" eyebrow={t('spray.copy_004')} title={t('spray.copy_096')}>
        <FAQ items={FAQ_ITEMS} />
      </Section>

      {/* 12 · FINAL CTA (opens the order modal) */}
      <FinalCTA
        page="spray"
        id="order"
        title={t('spray.copy_018')}
        body={t('spray.copy_097')}
        primary={{ label: t('spray.copy_052'), href: '#' }}
        secondary={{
          label: t('spray.copy_098'),
          href: 'mailto:contact@polarisdx.net',
        }}
        assurances={[t('spray.copy_055'), t('spray.copy_099'), t('spray.copy_057')]}
        note={t('spray.copy_100')}
      />

      <Disclaimer>{t('spray.copy_101')}</Disclaimer>

      <Footer />
    </div>
  )
}
