/**
 * Consumer landing page 2 — Hydrating Masks (5-pack)
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
  FactStrip,
  FAQ,
  FinalCTA,
  Grid,
  Hero,
  ImageArea,
  Pills,
  Section,
  Steps,
} from './shell'

// Accent bars on the four ingredient cards — matches brief slide 13.
const INGREDIENT_ACCENTS = ['teal', 'navy', 'green', 'amber'] as const

const NAV = [
  { label: 'Mask benefits', href: '#benefits' },
  { label: 'Ingredients', href: '#ingredients' },
  { label: 'How to use', href: '#how' },
  { label: 'FAQ', href: '#faq' },
]

const BENEFITS = [
  {
    title: 'Hydration care',
    body: 'A serum-soaked step that helps skin feel hydrated and cared for.',
  },
  { title: 'Skin comfort', body: 'Soothing botanicals for a calm, comfortable feel after use.' },
  {
    title: 'Softer-feeling skin',
    body: 'Leaves skin feeling soft and supple once the serum is massaged in.',
  },
  {
    title: 'Refreshed appearance',
    body: 'A simple way to give tired-looking skin a refreshed appearance.',
  },
]

const INGREDIENTS = [
  {
    title: 'Hydration-focused',
    items: ['Sodium Hyaluronate', 'Glycerin', 'Betaine', 'Trehalose', 'Propylene Glycol'],
  },
  {
    title: 'Skin appearance',
    items: ['Niacinamide', 'Licorice Root Extract', 'Green Tea Extract', 'Soluble Collagen'],
  },
  {
    title: 'Comfort botanicals',
    items: ['Centella Asiatica', 'Chamomile', 'Scutellaria Baicalensis', 'Rosemary Extract'],
  },
  {
    title: 'Premium cosmetic',
    items: [
      'Palmitoyl Tripeptide-38',
      'Crithmum Maritimum Extract',
      'Hydroxypropyl Cyclodextrin',
      'Serum-soaked 15 ml mask',
    ],
  },
]

const FAQ_ITEMS = [
  {
    q: 'How long should I leave it on?',
    a: 'Apply to cleansed skin and leave for 15–30 minutes. Remove the mask and gently massage the remaining serum into the skin.',
  },
  {
    q: 'How often can I use it?',
    a: 'Use when your skin needs hydration or visible care. Frequency can be adjusted to your routine and skin tolerance.',
  },
  {
    q: 'Which skin type is it for?',
    a: 'The packaging states all skin types. It is positioned especially for dry, sensitive and mature skin. Patch test if your skin is very reactive.',
  },
  {
    q: 'Is it scented?',
    a: 'Current direction is that no perfume oil is incorporated, subject to final wording confirmation before launch.',
  },
  {
    q: 'What is in one box?',
    a: 'One box contains 5 individually packed sheet masks. Each mask contains 15 ml of serum.',
  },
  {
    q: 'Can I use it before an event?',
    a: 'Yes — as a visible hydration care step before a meeting, event or evening routine. Do not use on irritated or broken skin.',
  },
  {
    q: 'Is it cosmetic skincare?',
    a: 'Yes. It is a cosmetic product for external use only. It is not intended to diagnose, treat or prevent skin disease.',
  },
  {
    q: 'What is the key ingredient story?',
    a: 'A hydration-focused base with sodium hyaluronate, glycerin, betaine and trehalose, plus niacinamide, botanicals, collagen and Palmitoyl Tripeptide-38.',
  },
]

export default function MaskPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-gray-900">
      <SEOHead
        title="Hydrating Sheet Masks — 5-Pack"
        description="A calm hydration step for dry, sensitive and mature skin — five individually packed serum-soaked sheet masks in one box."
        noindex
      />

      <ConsumerHeader nav={NAV} cta={{ label: 'Buy 5-pack', href: '#order' }} />

      {/* 2 · HERO */}
      <Hero
        eyebrow="Hydrating Hyaluronic Mask"
        title="A calm hydration step for dry, sensitive and mature skin."
        sub="A serum-soaked sheet mask for a simple 15–30-minute skincare routine. Intensive + soothing care for all skin types."
        primary={{ label: 'Buy 5-pack', href: '#order' }}
        secondary={{ label: 'How to use', href: '#how' }}
        image={{
          alt: 'Hydrating Mask box',
          placeholder: 'Mask box + sachet + soft skincare texture',
        }}
      />
      <FactStrip
        items={[
          '5 masks per box',
          '15 ml per mask',
          '15–30 min use',
          'Niacinamide · hyaluronic acid · collagen · peptide · plant extracts',
        ]}
      />

      {/* 3 · SKIN NEED */}
      <Section
        id="skin-need"
        tone="tint"
        eyebrow="Skin need"
        title="For skin that is asking for a little more care."
        lead="For skin that feels dry, tired, sensitive or simply in need of visible care — a calm, repeatable step that fits before an event or into an evening routine."
      />

      {/* 4 · BENEFITS */}
      <Section id="benefits" eyebrow="Benefits" title="What the mask step gives you">
        <Grid cols={4}>
          {BENEFITS.map((b) => (
            <Card key={b.title}>
              <h3 className="text-xl font-semibold text-gray-900">{b.title}</h3>
              <p className="mt-3 leading-relaxed text-gray-600">{b.body}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* 5 · WHAT IS INSIDE */}
      <Section
        id="ingredients"
        tone="tint"
        eyebrow="What is inside"
        title="Ingredient architecture"
        lead="A hydration-focused base, supported by skin-appearance actives, comfort botanicals and premium cosmetic ingredients."
      >
        <Grid cols={4}>
          {INGREDIENTS.map((group, i) => (
            <Card key={group.title} accent={INGREDIENT_ACCENTS[i]}>
              <h3 className="text-base font-semibold tracking-tight text-gray-900">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                {group.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </Card>
          ))}
        </Grid>
        <p className="mt-8 text-center text-sm text-gray-500">
          Helps skin feel hydrated, refreshed and cared for.
        </p>
      </Section>

      {/* 6 · HOW TO USE */}
      <Section id="how" eyebrow="How to use" title="A simple 15–30-minute routine">
        <Steps
          items={[
            { title: 'Cleanse', body: 'Start with freshly cleansed skin.' },
            {
              title: 'Apply the mask',
              body: 'Unfold the sheet mask and smooth it onto the face.',
            },
            {
              title: 'Leave 15–30 minutes',
              body: 'Relax while the serum-soaked mask does its work.',
            },
            {
              title: 'Remove & massage',
              body: 'Remove the mask and gently massage the remaining serum into the skin.',
            },
          ]}
        />
      </Section>

      {/* 7 · WHO IT IS FOR */}
      <Section tone="tint" eyebrow="Who it is for" title="All skin types — and especially these">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Pills items={['All skin types', 'Dry skin', 'Sensitive skin', 'Mature skin']} />
            <p className="mt-6 leading-relaxed text-gray-600">
              The packaging states all skin types. It is positioned especially for dry, sensitive
              and mature skin. Patch test first if your skin is very reactive, and do not use on
              irritated or broken skin.
            </p>
          </div>
          <ImageArea label="Mask in use — calm skincare moment" className="aspect-[4/3]" />
        </div>
      </Section>

      {/* 8 · 5-PACK OFFER */}
      <Section id="order" eyebrow="The 5-pack" title="Five masks in one box">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ImageArea label="Folding box open with 5 sachets" className="aspect-[4/3]" />
          <div>
            <p className="text-lg leading-relaxed text-gray-600">
              One folding box contains 5 individually packed 15 ml sheet masks — easy to keep on
              hand and to reach for whenever skin needs a hydration step.
            </p>
            <div className="mt-8">
              <CTA href="#" variant="navy">
                Buy 5-pack
              </CTA>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Pricing and checkout to be confirmed before launch.
            </p>
          </div>
        </div>
      </Section>

      {/* 9 · PACKAGING MESSAGE */}
      <Section
        tone="dark"
        eyebrow="On the packaging"
        title="Multiple Hydrating Sheet Mask · Intensive + Soothing · All Skin Types"
      />

      {/* 10 · FAQ */}
      <Section id="faq" eyebrow="FAQ" title="Practical questions, answered">
        <FAQ items={FAQ_ITEMS} />
      </Section>

      <FinalCTA
        title="A calm hydration step, ready when you are"
        body="Five individually packed sheet masks for dry, sensitive and mature skin."
        primary={{ label: 'Buy 5-pack', href: '#' }}
        note="Pricing and checkout to be confirmed before launch."
      />

      {/* 11 · FOOTER */}
      <ConsumerFooter disclaimer="The Hydrating Mask is a cosmetic product for external use only. It is not intended to diagnose, treat, cure or prevent any skin disease. Avoid contact with the eyes and do not use on irritated or broken skin. Discontinue use if irritation occurs." />
    </div>
  )
}
