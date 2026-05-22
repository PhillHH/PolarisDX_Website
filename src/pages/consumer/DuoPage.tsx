/**
 * Consumer landing page 3 — Inside-Out Care Duo (1 spray + 5 masks)
 *
 * Built from the PolarisDX Consumer Page Wireframe Brief (2026-05-22).
 * Section order follows the brief's section-by-section copy map exactly.
 * Unlisted: no nav/sitemap entry, noindex, password-gated at the server.
 */

import { SEOHead } from '../../components/seo'
import {
  Card,
  ConsumerFooter,
  ConsumerHeader,
  CTA,
  DraftBar,
  FactStrip,
  FAQ,
  FinalCTA,
  Hero,
  ImageArea,
  Section,
} from './shell'

const NAV = [
  { label: "What's included", href: '#included' },
  { label: 'Routine', href: '#routine' },
  { label: 'FAQ', href: '#faq' },
]

const FAQ_ITEMS = [
  {
    q: 'What is included?',
    a: '1 Vitamin D3+K2 Spray + 1 box with 5 Hydrating Masks.',
  },
  {
    q: 'Is the spray a medicine?',
    a: 'No. It is a food supplement, not a medicine.',
  },
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
    q: 'Can I buy the products separately?',
    a: 'Yes, where individual product pages and pricing are available. The final checkout structure is to be confirmed.',
  },
]

export default function DuoPage() {
  return (
    <div className="bg-white">
      <SEOHead
        title="Inside-Out Care Duo"
        description="Support from within, hydrating care from outside — one Vitamin D3+K2 Spray plus one box of five Hydrating Masks as a simple two-part routine."
        noindex
      />

      <DraftBar />
      <ConsumerHeader nav={NAV} cta={{ label: 'Shop Duo', href: '#order' }} />

      {/* 2 · HERO */}
      <Hero
        eyebrow="Inside-Out Care Duo"
        title="Support from within. Hydrating care from outside."
        sub="A simple two-part care routine: one Vitamin D3+K2 Spray plus one box of five Hydrating Masks."
        primary={{ label: 'Shop the Duo', href: '#order' }}
        secondary={{ label: "What's included", href: '#included' }}
        imageLabel="Spray bottle + mask box together"
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
          <Card>
            <h3 className="text-lg font-semibold text-[#0a2f55]">1 × Vitamin D3+K2 Spray</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              An orange-flavoured sublingual spray for daily Vitamin D3+K2 support — the inside step
              of the routine.
            </p>
            <a
              href="/consumer/vitamin-d3-spray"
              className="mt-4 inline-block text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              See the spray page →
            </a>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-[#0a2f55]">1 × box of 5 Hydrating Masks</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Five individually packed serum-soaked sheet masks — the outside step, for when skin
              needs visible hydration care.
            </p>
            <a
              href="/consumer/hydrating-masks"
              className="mt-4 inline-block text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              See the mask page →
            </a>
          </Card>
        </div>
      </Section>

      {/* 5 + 6 · INSIDE STEP / OUTSIDE STEP */}
      <Section id="routine" tone="tint" eyebrow="The routine" title="Two simple steps">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="text-sm font-semibold uppercase tracking-wide text-teal-600">
              Step 1 · Inside
            </div>
            <h3 className="mt-2 text-xl font-semibold text-[#0a2f55]">Daily support from within</h3>
            <p className="mt-2 leading-relaxed text-slate-600">
              Take the Vitamin D3+K2 Spray as part of a daily routine — one sublingual spray for
              daily Vitamin D3+K2 support.
            </p>
          </Card>
          <Card>
            <div className="text-sm font-semibold uppercase tracking-wide text-teal-600">
              Step 2 · Outside
            </div>
            <h3 className="mt-2 text-xl font-semibold text-[#0a2f55]">
              Hydrating care from outside
            </h3>
            <p className="mt-2 leading-relaxed text-slate-600">
              Use a Hydrating Mask for 15–30 minutes when your skin needs care — a calm, occasional
              hydration step.
            </p>
          </Card>
        </div>
      </Section>

      {/* 7 · ROUTINE VISUAL */}
      <Section eyebrow="The routine in a day" title="Daily spray, occasional mask ritual">
        <div className="grid gap-6 md:grid-cols-2">
          <ImageArea label="Morning / day — daily spray moment" className="aspect-[4/3]" />
          <ImageArea label="Evening / self-care — weekly mask ritual" className="aspect-[4/3]" />
        </div>
      </Section>

      {/* 8 · BUNDLE VALUE */}
      <Section tone="navy">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Why buy them together</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Bought together, the Duo is one simple routine instead of two separate products: daily
            support from within and visible hydration from outside.
          </p>
        </div>
      </Section>

      {/* 9 · FAQ */}
      <Section id="faq" eyebrow="FAQ" title="Practical questions, answered">
        <FAQ items={FAQ_ITEMS} />
      </Section>

      {/* 10 · FINAL CTA */}
      <FinalCTA
        id="order"
        title="Start with a simple inside-out routine."
        body="The Inside-Out Care Duo includes 1 spray + 1 box of 5 masks."
        primary={{ label: 'Shop the Duo', href: '#' }}
        note="Includes 1 spray + 5 masks. Pricing and checkout to be confirmed before launch."
      />

      {/* 11 · FOOTER */}
      <ConsumerFooter disclaimer="The Inside-Out Care Duo combines a food supplement (Vitamin D3+K2 Spray) and a cosmetic product (Hydrating Mask). The spray is not a medicine and should not replace a varied, balanced diet; do not exceed the recommended daily intake. The mask is for external use only and is not intended to diagnose, treat or prevent any skin disease." />
      <div className="bg-[#072442] pb-2 text-center">
        <CTA href="/consumer/vitamin-d3-spray" variant="light" internal>
          Back to the Spray page
        </CTA>
      </div>
    </div>
  )
}
