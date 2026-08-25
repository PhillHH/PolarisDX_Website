/**
 * Consumer landing page 3 — Inside-Out Care Duo (1 spray + 5 masks)
 *
 * Built from the PolarisDX Consumer Page Wireframe Brief (2026-05-22).
 * Section order follows the brief's section-by-section copy map exactly.
 * Indexable: in sitemap, no noindex — campaign landing page.
 */

import { Link } from 'react-router-dom'
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

const NAV = [
  { label: "What's included", href: '#included' },
  { label: 'Routine', href: '#routine' },
  { label: 'FAQ', href: '#faq' },
]

const FAQ_ITEMS = [
  { q: 'What is included?', a: '1 Vitamin D3+K2 Spray + 1 box with 5 Hydrating Masks.' },
  { q: 'Is the spray a medicine?', a: 'No. It is a food supplement, not a medicine.' },
  {
    q: 'How often do I use the spray?',
    a: 'Use 1 spray daily unless advised otherwise. Do not exceed the recommended intake.',
  },
  {
    q: 'How often do I use the masks?',
    a: 'Use when your skin needs hydration or visible care. Leave on for 15–30 minutes.',
  },
  {
    q: 'Who is the Duo for?',
    a: 'Adults who want a simple inside-out routine: daily supplement support plus visible hydration care.',
  },
  {
    q: 'Can I buy separately?',
    a: 'Yes. The spray as a 12-pack and masks as a 5-pack can be ordered separately, with the Duo designed as the complete inside-out routine to unlock preferred pricing.',
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
  useConsumerPageView('duo')
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-heading">
      <SEOHead
        title="Inside-Out Care Duo: D3+K2 Spray + Masks"
        description="Inside-Out Care Duo pairs a daily Vitamin D3+K2 spray with 5 hydrating sheet masks: one simple inside-and-outside routine at preferred bundle value of 49,90 €."
      />

      <ConsumerHeader nav={NAV} cta={{ label: 'Shop Duo', href: '#order' }} page="duo" />

      {/* 2 · HERO */}
      <Hero
        page="duo"
        eyebrow="Inside-Out Care Duo"
        title="Support from within. Hydrating care from outside."
        sub={
          <>
            A simple two-part care routine: one Vitamin D3+K2 Spray plus one box of five Hydrating
            Masks.
            <span className="mt-3 block font-semibold text-heading">
              More care in the routine. More value in the set.
            </span>
          </>
        }
        primary={{ label: 'Shop the Duo', href: '#order' }}
        secondary={{ label: "What's included", href: '#included' }}
        image={{
          src: duoHero,
          alt: 'PolarisDX Inside-Out Care Duo — Vitamin D3+K2 spray and Hydrating Mask box together',
        }}
        price={{ amount: '49,90 €', unit: 'Duo set' }}
        priceBadge={<PriceBadge product="duo" />}
        highlights={['1 spray + 5 masks', 'Inside + outside routine', 'No payment on this page']}
        floatingStat={{ value: '1 + 5', label: 'spray plus masks in the set' }}
      />
      <FactStrip
        items={[
          '1 × Vitamin D3+K2 Spray',
          '1 × Hydrating Mask box with 5 sachets',
          'Simple inside + outside care routine',
        ]}
      />

      {/* 3 · THE IDEA */}
      <Section
        tone="tint"
        eyebrow="The idea"
        title="You do not need a complicated routine."
        lead="You need one that is easy to repeat. The Inside-Out Care Duo pairs a daily step from within with a hydration step from outside — two products, one simple routine."
      />

      {/* 4 · WHAT'S INCLUDED */}
      <Section id="included" eyebrow="What's included" title="Two products, one bundle">
        <div className="grid gap-6 md:grid-cols-2">
          <Card hover className="flex h-full flex-col">
            <IconTile>
              <Sun className="h-6 w-6" strokeWidth={1.75} />
            </IconTile>
            <h3 className="mt-5 text-xl font-semibold text-heading">1 × Vitamin D3+K2 Spray</h3>
            <p className="mt-3 flex-grow leading-relaxed text-gray-600">
              An orange-flavoured sublingual spray for daily Vitamin D3+K2 support — the inside step
              of the routine.
            </p>
            <Link
              to="/consumer/vitamin-d3-spray"
              data-gtm-event="consumer_cta_click"
              data-gtm-cta="See the spray page"
              data-gtm-page="duo"
              data-gtm-location="included-card"
              className="group mt-6 inline-flex items-center gap-1.5 self-start rounded text-sm font-semibold text-accent-strong transition-colors hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2"
            >
              See the spray page
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </Card>
          <Card hover className="flex h-full flex-col">
            <IconTile>
              <Droplets className="h-6 w-6" strokeWidth={1.75} />
            </IconTile>
            <h3 className="mt-5 text-xl font-semibold text-heading">
              1 × box of 5 Hydrating Masks
            </h3>
            <p className="mt-3 flex-grow leading-relaxed text-gray-600">
              Five individually packed serum-soaked sheet masks — the outside step, for when skin
              needs visible hydration care.
            </p>
            <Link
              to="/consumer/hydrating-masks"
              data-gtm-event="consumer_cta_click"
              data-gtm-cta="See the mask page"
              data-gtm-page="duo"
              data-gtm-location="included-card"
              className="group mt-6 inline-flex items-center gap-1.5 self-start rounded text-sm font-semibold text-accent-strong transition-colors hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2"
            >
              See the mask page
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </Card>
        </div>
      </Section>

      {/* 5 + 6 · INSIDE STEP / OUTSIDE STEP */}
      <Section id="routine" tone="tint" eyebrow="The routine" title="Two simple steps">
        <div className="grid gap-6 md:grid-cols-2">
          <Card hover accent="teal" className="h-full">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
              Step 1 · Inside
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-heading">Daily support from within</h3>
            <p className="mt-3 leading-relaxed text-gray-600">
              Take the Vitamin D3+K2 Spray as part of a daily routine — one sublingual spray for
              daily Vitamin D3+K2 support.
            </p>
          </Card>
          <Card hover accent="navy" className="h-full">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
              Step 2 · Outside
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-heading">
              Hydrating care from outside
            </h3>
            <p className="mt-3 leading-relaxed text-gray-600">
              Use a Hydrating Mask for 15–30 minutes when your skin needs care — a calm, occasional
              hydration step.
            </p>
          </Card>
        </div>
      </Section>

      {/* 7 · ROUTINE VISUAL */}
      <Section eyebrow="The routine in a day" title="Daily spray, occasional mask ritual">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="group overflow-hidden rounded-section">
            <img
              src={sprayStill}
              alt="Morning routine — Vitamin D3+K2 sublingual spray"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
          <div className="group overflow-hidden rounded-section">
            <img
              src={maskBotanical}
              alt="Evening self-care — Hydrating Hyaluronic Mask"
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
        eyebrow="Why buy them together"
        title="Two products, one simple routine."
        lead="A smarter way to build the full Inside-Out Care routine: unlock the Duo value. Complete your masks order with the addition of daily D3+K2 support for just €2/month."
      >
        <div className="flex justify-center">
          <Pills
            onDark
            items={[
              'Daily support from within',
              'Hydrating care from outside',
              'One simple routine',
              'Preferred bundle value',
            ]}
          />
        </div>
      </Section>

      {/* 9 · FAQ */}
      <Section id="faq" eyebrow="FAQ" title="Practical questions, answered">
        <FAQ items={FAQ_ITEMS} />
      </Section>

      {/* 10 · FINAL CTA — opens the order modal */}
      <FinalCTA
        page="duo"
        id="order"
        title="Start with a simple inside-out routine."
        body="Includes 1 Vitamin D3+K2 Spray + 1 box of 5 Hydrating Masks."
        primary={{ label: 'Shop the Duo', href: '#' }}
        assurances={['1 spray + 5 masks', 'Preferred bundle value', 'No payment on this page']}
        note="No payment is taken on this page — sales confirms price and shipping."
      />

      {/* 11 · FOOTER */}
      <Disclaimer>
        The Inside-Out Care Duo combines a food supplement (Vitamin D3+K2 Spray) and a cosmetic
        product (Hydrating Mask). The spray is not a medicine and should not replace a varied,
        balanced diet; do not exceed the recommended daily intake. The mask is for external use only
        and is not intended to diagnose, treat or prevent any skin disease.
      </Disclaimer>

      <Footer />
    </div>
  )
}
