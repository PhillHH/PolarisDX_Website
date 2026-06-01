/**
 * Consumer landing page 1 — Vitamin D3+K2 Spray (12-pack)
 *
 * Built from the PolarisDX Consumer Page Wireframe Brief (2026-05-22).
 * Section order follows the brief's section-by-section copy map exactly.
 * Unlisted: no nav/sitemap entry, noindex — reachable only via direct link.
 */

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
  Grid,
  Hero,
  Pills,
  Section,
  Steps,
} from './shell'
import { OrderSection } from './OrderForm'
import { useConsumerPageView } from './tracking'

const NAV = [
  { label: 'Daily wellbeing', href: '#why' },
  { label: 'Shared orders', href: '#audiences' },
  { label: 'How it works', href: '#how' },
  { label: 'FAQ', href: '#faq' },
]

const BENEFITS = [
  {
    title: 'Easy to use',
    body: 'One spray under the tongue. No water, no tablets — a simple step in any morning routine.',
  },
  {
    title: 'Easy to share',
    body: 'A 12-pack splits cleanly across a team, a family or a group of friends.',
  },
  {
    title: 'Easy to stock',
    body: 'Keep one practical box on hand so daily support never runs out.',
  },
  {
    title: 'Fits everyday routines',
    body: 'Compact bottles for the kitchen, bathroom, a bag or an office wellbeing area.',
  },
]

const AUDIENCES = [
  {
    title: 'Workplaces',
    body: 'For staff kitchens, HR wellbeing orders, office care packs and everyday employee support.',
    cta: 'Order for your team',
  },
  {
    title: 'Homes & families',
    body: 'For households, families or relatives who want to order together and stay stocked.',
    cta: 'Order the 12-pack',
  },
  {
    title: 'Shared orders',
    body: 'For friends, colleagues or small groups who want to split one practical wellbeing box.',
    cta: 'Start a shared order',
  },
  {
    title: 'Lifestyle spaces',
    body: 'For gyms, studios, retreats and wellness communities that want simple daily care products.',
    cta: 'Ask about group orders',
  },
]

const SUBLINGUAL = [
  {
    title: 'What it means',
    body: 'Sublingual means under the tongue. The spray is applied under the tongue, where it can stay in contact with the oral mucosa before being swallowed. Spray. Hold. Swallow. Done.',
  },
  {
    title: 'Why it matters',
    body: 'No tablet or capsule and no water needed — an easy daily routine in a kitchen, bathroom, bag or office wellbeing area.',
  },
  {
    title: 'How to use',
    body: 'Shake gently, spray once under the tongue, hold briefly, then swallow. Do not spray onto lips, teeth or the back of the throat, and do not rinse immediately after use.',
  },
]

const FACTS: [string, string][] = [
  ['Pack size', '12 bottles in one pack'],
  ['Applications', '71 applications per bottle'],
  ['Format', 'Orange-flavoured sublingual spray'],
  ['Dosage', '1000 IU Vitamin D3 + 25 µg Vitamin K2'],
  ['Suitable for', 'Vegan · GMO-free · gluten-free · alcohol-free'],
  ['Origin', 'Made in Germany'],
]

const FAQ_ITEMS = [
  {
    q: 'What is Vitamin D3+K2 Spray?',
    a: 'A daily food supplement designed to make Vitamin D3 and K2 easy to include in a regular wellbeing routine. It is taken as an oral spray instead of a tablet or capsule.',
  },
  {
    q: 'What does sublingual spray mean?',
    a: 'Sublingual means “under the tongue”. The spray is applied under the tongue, where it can stay in contact with the oral mucosa before being swallowed.',
  },
  {
    q: 'Why is sublingual spray useful?',
    a: 'It is simple and convenient for people who prefer not to take tablets or capsules.',
  },
  {
    q: 'How do I use it correctly?',
    a: 'Shake gently, spray once under the tongue, hold briefly, then swallow. Use once daily unless advised otherwise. Do not exceed the recommended daily intake.',
  },
  {
    q: 'Why is it sold as a 12-pack?',
    a: 'The 12-pack is designed for shared wellbeing orders: workplaces, staff kitchens, families, group orders and lifestyle spaces.',
  },
  {
    q: 'How long does one bottle last?',
    a: 'Each bottle contains 71 applications. At one spray per day, one bottle lasts 71 days. At office use Monday–Friday, one bottle lasts over 14 weeks per person.',
  },
  {
    q: 'What does D3+K2 support?',
    a: 'Vitamin D and Vitamin K contribute to the maintenance of normal bones. Vitamin D contributes to normal immune system function. Vitamin K contributes to normal blood clotting.',
  },
  {
    q: 'Is it vegan, is it a medicine, and how do I store it?',
    a: 'It is listed as vegan, GMO-free, gluten-free and alcohol-free. It is a food supplement, not a medicine. Store cool and dry, away from sunlight.',
  },
]

export default function SprayPage() {
  useConsumerPageView('spray')
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-gray-900">
      <SEOHead
        title="Vitamin D3+K2 Spray 12-Pack"
        description="Daily Vitamin D3+K2 support made simple — a convenient orange-flavoured sublingual spray, sold as a 12-pack for teams, homes and shared wellbeing orders."
        noindex
      />

      <ConsumerHeader nav={NAV} cta={{ label: 'Order 12-pack', href: '#order' }} page="spray" />

      {/* 2 · HERO */}
      <Hero
        page="spray"
        eyebrow="Vitamin D3+K2 Spray"
        title="Daily Vitamin D3+K2 support made simple."
        sub="A convenient orange-flavoured sublingual spray for an easy daily wellbeing routine at home, at work or in shared spaces."
        primary={{ label: 'Buy 12-pack', href: '#order' }}
        secondary={{ label: 'How it works', href: '#how' }}
        image={{
          src: sprayHero,
          alt: 'PolarisDX Vitamin D3+K2 Sublingual Spray — 12-pack in an office wellbeing setting',
        }}
      />
      <FactStrip
        items={[
          '12-pack',
          '71 applications per bottle',
          'Vegan · GMO-free · gluten-free · alcohol-free',
          'Made in Germany',
          'Dosage 1000 IU',
        ]}
      />

      {/* 3 · WHY IT MATTERS */}
      <Section
        id="why"
        tone="tint"
        eyebrow="Why it matters"
        title="Wellbeing works best when it is easy to repeat."
        lead="Busy routines make wellbeing inconsistent. The simplest way to keep daily support going is to make it easy where people already gather — the kitchen at home, the staff kitchen at work, the shared space everyone passes through."
      />

      {/* 4 · BENEFITS */}
      <Section eyebrow="Benefits" title="Built to fit everyday life">
        <Grid cols={4}>
          {BENEFITS.map((b) => (
            <Card key={b.title}>
              <h3 className="text-xl font-semibold text-gray-900">{b.title}</h3>
              <p className="mt-3 leading-relaxed text-gray-600">{b.body}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* 5 · WHO IT IS FOR */}
      <Section
        id="audiences"
        tone="tint"
        eyebrow="Who it is for"
        title="One pack, shared where it makes sense"
        lead="The 12-pack is built as a shared wellbeing order — practical to split across the places people already are."
      >
        <Grid cols={4}>
          {AUDIENCES.map((a) => (
            <Card key={a.title} className="flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900">{a.title}</h3>
              <p className="mt-3 flex-grow leading-relaxed text-gray-600">{a.body}</p>
              <a
                href="#order"
                data-gtm-event="consumer_cta_click"
                data-gtm-cta={a.cta}
                data-gtm-page="spray"
                data-gtm-location={`audience-${a.title.toLowerCase().replace(/[ &]+/g, '-')}`}
                className="mt-6 inline-block text-sm font-semibold text-teal-700 hover:text-teal-900"
              >
                {a.cta} →
              </a>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* 6 · WHAT IS INSIDE */}
      <Section eyebrow="What is inside" title="What you get in one pack">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Card className="p-0">
            <dl className="divide-y divide-slate-100">
              {FACTS.map(([label, value]) => (
                <div key={label} className="flex gap-6 px-8 py-5">
                  <dt className="w-40 flex-none text-sm font-semibold text-gray-900">{label}</dt>
                  <dd className="text-gray-600">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <div>
            <img
              src={sprayStill}
              alt="PolarisDX Vitamin D3+K2 Sublingual Spray — bottle + box detail"
              loading="lazy"
              decoding="async"
              className="mx-auto w-full max-w-sm rounded-2xl shadow-card lg:max-w-md"
            />
          </div>
        </div>
      </Section>

      {/* 7 · HOW TO USE */}
      <Section id="how" tone="tint" eyebrow="How to use" title="Spray. Hold. Swallow. Done.">
        <Steps
          items={[
            { title: 'Shake gently', body: 'Give the bottle a gentle shake before use.' },
            {
              title: 'Spray once under the tongue',
              body: 'One spray under the tongue — not onto lips, teeth or the back of the throat.',
            },
            {
              title: 'Hold briefly, then swallow',
              body: 'Hold briefly, then swallow. Do not rinse immediately after use.',
            },
          ]}
        />
        <p className="mt-8 text-center text-sm text-gray-500">
          Use once daily unless advised otherwise. Do not exceed the recommended daily intake.
        </p>
      </Section>

      {/* 8 · WHY SPRAY */}
      <Section eyebrow="Why spray" title="A format that fits anywhere">
        <div className="flex justify-center">
          <Pills
            items={[
              'No water',
              'No tablets',
              'Portable',
              'A visible daily routine',
              'Convenient sublingual format',
            ]}
          />
        </div>
      </Section>

      {/* 9 · SUBLINGUAL BENEFITS */}
      <Section
        tone="tint"
        eyebrow="Sublingual spray"
        title="The under-the-tongue format, explained"
      >
        <Grid cols={3}>
          {SUBLINGUAL.map((s) => (
            <Card key={s.title}>
              <h3 className="text-xl font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-gray-600">{s.body}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* 10 · BRIDGE TO DUO */}
      <Section
        tone="dark"
        eyebrow="The next step"
        title="Support from within, hydration from outside."
        align="left"
        lead="First step: daily support from within with the spray. Next step: outside-in hydration with the Hydrating Mask bundle — both together in the Inside-Out Care Duo."
      >
        <CTA
          to="/consumer/inside-out-duo"
          variant="teal"
          track={{
            label: 'Explore the Inside-Out Care Duo',
            page: 'spray',
            location: 'bridge-to-duo',
          }}
        >
          Explore the Inside-Out Care Duo
        </CTA>
      </Section>

      {/* 11 · FAQ */}
      <Section id="faq" eyebrow="FAQ" title="Practical questions, answered">
        <FAQ items={FAQ_ITEMS} />
      </Section>

      {/* 12 · FINAL CTA + ORDER FORM */}
      <OrderSection
        page="spray"
        product="spray"
        title="Order the 12-pack"
        body="Simple daily Vitamin D3+K2 support for teams, homes and shared wellbeing orders. Tell us how many packs you need and any context (shared workplace order, delivery wishes, etc.) — we'll come back with price and shipping."
      />

      <Disclaimer>
        Vitamin D3+K2 Spray is a food supplement and is not a medicine. Food supplements should not
        be used as a substitute for a varied, balanced diet and a healthy lifestyle. Do not exceed
        the recommended daily intake. Keep out of reach of young children.
      </Disclaimer>

      <Footer />
    </div>
  )
}
