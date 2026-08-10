/**
 * EpigeneticsPage — /epigenetics
 *
 * Unterlagen- und Erklaerseite zum Epigenetik- und Genetik-Partnerprogramm.
 * Inhalt kommt vollstaendig aus dem Locale-Namespace `epigenetics`,
 * die PDFs liegen unter public/downloads/epigenetics/<lang>/.
 *
 * FACHLICH/RECHTLICH ABGESTIMMT — bitte nicht ohne Ruecksprache aendern:
 * - Der Laborpartner wird nirgends namentlich genannt ("Kooperationspartner").
 * - Kein CE-/IVDR-Zeichen: es sind Labordienstleistungen, keine IVD.
 * - Der Hinweistext (contact.note) gehoert auf die Seite.
 * - Keine Preise ("B2B nach Absprache") und keine Befundlaufzeit.
 * - Die Evidenz-Sektion trennt bewusst Gesichertes von Vorlaeufigem. Das ist
 *   Absicht: vor Fachpublikum traegt die Seite nur mit offengelegten Grenzen.
 *
 * TYPOGRAFIE: Fliesstext laeuft auf text-base und ab lg auf 17px/2rem. Das ist
 * bewusst groesser als der Rest der Site — die Seite ist eine Lesestrecke fuer
 * Fachpublikum, keine Uebersichtsseite.
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Check, ChevronDown, Download, FileText, Minus } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema, createFAQSchema } from '../components/seo'
import type { FAQItem } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import SectionHeader from '../components/ui/SectionHeader'
import PageTransition from '../components/ui/PageTransition'
import ChapterNav, { type Chapter } from '../components/ui/ChapterNav'
import Reveal, { REVEAL_STAGGER } from '../components/ui/Reveal'
import { BEFUND_IMAGES, BEFUND_IMAGE_SIZE } from '../assets/epigenetics/befundImages'
import FinalCtaSection from '../components/sections/FinalCtaSection'

// public/ wird nach dist/client kopiert — die oeffentliche URL ist /downloads/...
const ASSET_BASE = '/downloads/epigenetics/'

// Reveal rendert zwei verschachtelte divs; damit Grid-Karten auf Reihenhoehe
// wachsen, muss h-full auf beide.
const STRETCH = 'h-full [&>div]:h-full'

// Fliesstext, Lead und Kleinlabel — an einer Stelle definiert, damit die
// Lesegroesse ueber alle Sektionen identisch bleibt.
const BODY = 'text-base leading-7 lg:text-[17px] lg:leading-8'
const LEAD = 'text-lg leading-relaxed text-gray-600 lg:text-xl lg:leading-relaxed'
const LABEL = 'text-xs font-medium text-gray-500'

interface Chip {
  label: string
  value: string
}

interface Fact {
  k: string
  v: string
}

interface Analysis {
  num: string
  name: string
  subtitle: string
  facts: Fact[]
  what: string
  who: string[]
  file: string
}

interface Sheet {
  num: string
  title: string
  desc: string
  file: string
  meta: string
  featured?: boolean
}

interface TitledText {
  title: string
  text: string
}

interface Sample {
  slug: string
  panel: string
  subtitle: string
  pages: string
  what: string
  bullets: string[]
  file: string
}

interface Concept {
  num: string
  title: string
  text: string
  key: string
}

interface QA {
  q: string
  a: string
}

/**
 * i18next liefert bei fehlendem Key den Key-String zurueck statt eines Arrays.
 * Der Guard haelt SSR am Leben, falls ein Locale-File unvollstaendig ist.
 */
function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

/** Dekoratives Sparkle-Motiv des Programms — Inline-SVG, erbt currentColor. */
const Sparkle = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
    <path
      d="M50 2 C50 33 33 50 2 50 C33 50 50 67 50 98 C50 67 67 50 98 50 C67 50 50 33 50 2 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
)

const EpigeneticsPage = () => {
  const { t, i18n } = useTranslation('epigenetics')

  const chips = asArray<Chip>(t('hero.chips', { returnObjects: true }))
  const principleCards = asArray<TitledText>(t('principle.cards', { returnObjects: true }))
  const practiceItems = asArray<string>(t('principle.practice.items', { returnObjects: true }))
  const analyses = asArray<Analysis>(t('analyses.items', { returnObjects: true }))
  const steps = asArray<string>(t('workflow.steps', { returnObjects: true }))
  const established = asArray<TitledText>(t('evidence.established', { returnObjects: true }))
  const preliminary = asArray<TitledText>(t('evidence.preliminary', { returnObjects: true }))
  const faq = asArray<QA>(t('faq.items', { returnObjects: true }))
  const sheets = asArray<Sheet>(t('sheets', { returnObjects: true }))
  const samples = asArray<Sample>(t('samples.items', { returnObjects: true }))
  const compareCols = asArray<string>(t('compare.cols', { returnObjects: true }))
  const compareRows = asArray<string[]>(t('compare.rows', { returnObjects: true }))
  const compareShared = asArray<TitledText>(t('compare.shared', { returnObjects: true }))
  const compareCaveats = asArray<TitledText>(t('compare.caveats', { returnObjects: true }))
  const concepts = asArray<Concept>(t('basics.concepts', { returnObjects: true }))
  const scales = asArray<Fact>(t('basics.scales', { returnObjects: true }))

  const faqSchemaItems: FAQItem[] = faq.map((item) => ({ question: item.q, answer: item.a }))
  const overviewHref = `${ASSET_BASE}${t('contact.overviewFile')}`
  const zipHref = `${ASSET_BASE}${t('downloads.zipFile')}`

  // Kapitel der Seite. Die Kurzform aus dem jeweiligen Kicker ist als Chip
  // besser lesbar als die Ueberschrift — ausser bei den Analysen, wo der
  // Kicker nur "Portfolio" heisst.
  const chapters: Chapter[] = [
    { id: 'prinzip', label: t('principle.caption') },
    { id: 'analysen', label: t('analyses.title') },
    { id: 'vergleich', label: t('compare.caption') },
    { id: 'musterbefunde', label: t('samples.caption') },
    { id: 'ablauf', label: t('workflow.caption') },
    { id: 'werte-verstehen', label: t('basics.caption') },
    { id: 'studienlage', label: t('evidence.caption') },
    { id: 'fragen', label: t('faq.caption') },
    { id: 'downloads', label: t('downloads.caption') },
    { id: 'contact', label: t('contact.caption') },
  ]
  const samplesZipHref = `${ASSET_BASE}${t('samples.zipFile')}`

  return (
    <PageTransition>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
        ogImage="/og-epigenetics.jpg"
        keywords={[
          'Epigenetik Analyse',
          'Genetik Analyse Praxis',
          'biologisches Alter',
          'Telomerlänge',
          'Trockenblutkarte',
          'microRNA',
          'PolarisDX',
        ]}
        structuredData={[
          createBreadcrumbSchema(
            [
              { name: t('breadcrumb.home'), url: '/' },
              { name: t('breadcrumb.current'), url: '/epigenetics' },
            ],
            i18n.language,
          ),
          ...(faqSchemaItems.length > 0 ? [createFAQSchema(faqSchemaItems)] : []),
        ]}
      />

      <div className="bg-slate-50 text-heading">
        {/* ================================================================
            HERO
        ================================================================ */}
        <section className="relative overflow-hidden bg-brand-deep text-white">
          <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-brand-secondary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-[320px] w-[320px] rounded-full bg-accent/20 blur-3xl" />
          <Sparkle className="pointer-events-none absolute right-8 top-24 hidden h-40 w-40 text-white/15 lg:block" />
          <Sparkle className="pointer-events-none absolute right-52 top-56 hidden h-16 w-16 text-accent-on-dark/30 lg:block" />

          <div className="relative mx-auto max-w-page px-4 pb-16 pt-28 lg:px-10 lg:pb-20 lg:pt-32">
            <Reveal width="100%">
              <div className="max-w-container">
                <Breadcrumbs
                  variant="dark"
                  className="mb-4"
                  items={[
                    { label: t('breadcrumb.home'), href: '/' },
                    { label: t('breadcrumb.current') },
                  ]}
                />
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
                  {t('hero.eyebrow')}
                </p>
                <h1 className="max-w-3xl text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                  {t('hero.title')}
                </h1>
                <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-white/85 lg:text-xl lg:leading-relaxed">
                  {t('hero.claim')}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#analysen"
                    className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                  >
                    {t('hero.ctaDocs')}
                  </a>
                  <a
                    href="#downloads"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                  >
                    <Download className="h-4 w-4" />
                    {t('hero.ctaSheets')}
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-accent-strong px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white hover:text-brand-deep"
                  >
                    {t('hero.ctaQuote')}
                  </Link>
                </div>

                <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {chips.map((chip) => (
                    <div
                      key={chip.label}
                      className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm"
                    >
                      <dt className="text-xs font-medium text-white/60">{chip.label}</dt>
                      <dd className="mt-1 text-base font-semibold text-white">{chip.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </section>

        <ChapterNav
          chapters={chapters}
          chaptersLabel={t('befund.navChapters')}
          progressLabel={t('befund.navProgress')}
          action={{ to: '/contact', label: t('hero.ctaQuote') }}
        />

        {/* ================================================================
            DAS PRINZIP
        ================================================================ */}
        <section id="prinzip" className="scroll-mt-[124px] lg:scroll-mt-[148px] mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          <Reveal width="100%">
            <SectionHeader
              caption={t('principle.caption')}
              title={t('principle.title')}
              align="left"
            />
            <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('principle.lead')}</p>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {principleCards.map((card, index) => (
              <Reveal
                key={card.title}
                width="100%"
                delay={index * REVEAL_STAGGER}
                className={STRETCH}
              >
                <div className="h-full rounded-3xl border border-slate-200 bg-white p-7">
                  <h3 className="text-xl font-semibold tracking-tight text-text-heading">
                    {card.title}
                  </h3>
                  <p className={`mt-3 text-gray-600 ${BODY}`}>{card.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal width="100%">
            <div className="mt-6 rounded-3xl border border-accent-border bg-accent-soft p-7">
              <p className="text-xs font-medium text-gray-500">{t('principle.practice.title')}</p>
              <ul className="mt-4 grid gap-3 lg:grid-cols-3">
                {practiceItems.map((item) => (
                  <li key={item} className={`flex gap-3 text-gray-700 ${BODY}`}>
                    <Check className="mt-1.5 h-5 w-5 shrink-0 text-accent-strong" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Erster Dokument-Hinweis: das Programm kompakt auf drei Seiten */}
          <Reveal width="100%">
            <div className="mt-6 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <FileText className="mt-0.5 h-6 w-6 shrink-0 text-brand-primary" />
                <p className={`text-gray-700 ${BODY}`}>{t('principle.pdfHint')}</p>
              </div>
              <a
                href={overviewHref}
                download
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
              >
                <Download className="h-4 w-4" />
                {t('contact.overview')}
              </a>
            </div>
          </Reveal>
        </section>

        {/* ================================================================
            DIE SECHS ANALYSEN
        ================================================================ */}
        <section id="analysen" className="scroll-mt-[124px] lg:scroll-mt-[148px] border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
            <Reveal width="100%">
              <SectionHeader
                caption={t('analyses.caption')}
                title={t('analyses.title')}
                align="left"
              />
              <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('analyses.lead')}</p>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {analyses.map((item, index) => (
                <Reveal
                  key={item.num}
                  width="100%"
                  delay={(index % 2) * REVEAL_STAGGER}
                  className={STRETCH}
                >
                  <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-7 transition-shadow lg:p-7">
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-deep text-base font-semibold text-white">
                        {item.num}
                      </span>
                      <div>
                        <h3 className="text-2xl font-semibold tracking-tight text-text-heading">
                          {item.name}
                        </h3>
                        <p className={`mt-1.5 text-gray-600 ${BODY}`}>{item.subtitle}</p>
                      </div>
                    </div>

                    <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                      {item.facts?.map((fact) => (
                        <div
                          key={fact.k}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                        >
                          <dt className="text-xs font-medium text-gray-500">{fact.k}</dt>
                          <dd className="mt-1 text-base font-medium text-text-heading">{fact.v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-6">
                      <p className={LABEL}>{t('analyses.whatLabel')}</p>
                      <p className={`mt-2 text-gray-700 ${BODY}`}>{item.what}</p>
                    </div>

                    <div className="mt-5">
                      <p className={LABEL}>{t('analyses.whoLabel')}</p>
                      <ul className="mt-2 space-y-2">
                        {item.who?.map((who) => (
                          <li key={who} className={`flex gap-3 text-gray-700 ${BODY}`}>
                            <span className="mt-3.5 h-1 w-3 shrink-0 rounded-full bg-accent-line" />
                            <span>{who}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:flex-wrap sm:items-center">
                      <a
                        href={`${ASSET_BASE}${item.file}`}
                        download
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary hover:bg-brand-primary hover:text-white sm:w-auto"
                      >
                        <Download className="h-4 w-4" />
                        {t('analyses.pdfBtn')}
                      </a>
                      {samples[index] ? (
                        <Link
                          to={`/epigenetics/musterbefund/${samples[index].slug}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-semibold text-brand-primary underline-offset-4 transition-colors hover:text-brand-deep hover:underline sm:w-auto"
                        >
                          <FileText className="h-4 w-4" />
                          {t('analyses.sampleBtn')}
                        </Link>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            DIE SECHS PANELS IM VERGLEICH
        ================================================================ */}
        <section id="vergleich" className="scroll-mt-[124px] lg:scroll-mt-[148px] border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-20">
            <Reveal width="100%">
              <SectionHeader
                caption={t('compare.caption')}
                title={t('compare.title')}
                align="left"
              />
              <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('compare.lead')}</p>
            </Reveal>

            {/* Die Tabelle ist auf schmalen Viewports breiter als der Bildschirm.
                overflow-x-auto plus min-w haelt sie scrollbar statt sie zu
                quetschen; die Randlinie zeigt, dass rechts noch etwas kommt. */}
            <Reveal width="100%">
              <div className="mt-10 overflow-x-auto rounded-3xl border border-slate-200 bg-white">
                <table className="w-full min-w-[54rem] border-collapse text-left">
                  <thead>
                    <tr className="bg-brand-deep text-white">
                      {compareCols.map((col) => (
                        <th key={col} scope="col" className="px-5 py-4 text-sm font-semibold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.map((row, rowIndex) => (
                      <tr
                        key={row[0]}
                        className={rowIndex % 2 === 1 ? 'bg-slate-50' : 'bg-white'}
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`${row[0]}-${cellIndex}`}
                            className={
                              cellIndex === 0
                                ? 'px-5 py-4 text-base font-semibold text-text-heading'
                                : 'px-5 py-4 text-base text-gray-700'
                            }
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Die Tabelle ist breiter als schmale Viewports. Ohne Hinweis
                  bleibt die Spalte mit der Ergebnisform unentdeckt. */}
              <p className="mt-3 text-sm text-gray-500 lg:hidden">{t('compare.scrollHint')}</p>
            </Reveal>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {compareShared.map((item, index) => (
                <Reveal key={item.title} width="100%" delay={0.05 * index} className={STRETCH}>
                  <div className="h-full rounded-3xl border border-slate-200 bg-white p-6">
                    <p className="text-lg font-semibold text-text-heading">{item.title}</p>
                    <p className={`mt-2 text-gray-700 ${BODY}`}>{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Die methodischen Grenzen stehen bewusst neben der Tabelle und
                nicht im Kleingedruckten — vor Fachpublikum ist das ein
                Vertrauensargument. */}
            <Reveal width="100%">
              <div className="mt-6 rounded-3xl border border-accent-border bg-accent-soft p-7">
                <p className="text-sm font-semibold text-accent-strong">{t('compare.caveatTitle')}</p>
                <div className="mt-4 grid gap-5 lg:grid-cols-2">
                  {compareCaveats.map((item) => (
                    <div key={item.title}>
                      <p className="text-base font-semibold text-text-heading">{item.title}</p>
                      <p className={`mt-1.5 text-gray-700 ${BODY}`}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal width="100%">
              <div className="mt-6 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-7 sm:flex-row sm:items-center sm:justify-between">
                <p className={`text-gray-700 ${BODY}`}>{t('compare.gendg')}</p>
                <a
                  href={`${ASSET_BASE}${t('compare.file')}`}
                  download
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
                >
                  <Download className="h-4 w-4" />
                  {t('compare.cta')}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================
            MUSTERBEFUNDE — was am Ende in der Hand liegt
        ================================================================ */}
        <section id="musterbefunde" className="scroll-mt-[124px] lg:scroll-mt-[148px] border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
            <Reveal width="100%">
              <SectionHeader
                caption={t('samples.caption')}
                title={t('samples.title')}
                align="left"
              />
              <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('samples.lead')}</p>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {samples.map((item, index) => (
                <Reveal
                  key={item.slug}
                  width="100%"
                  delay={0.05 * (index % 3)}
                  className={STRETCH}
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    {BEFUND_IMAGES[item.slug] ? (
                      <img
                        src={BEFUND_IMAGES[item.slug].src}
                        srcSet={`${BEFUND_IMAGES[item.slug].src} 640w, ${BEFUND_IMAGES[item.slug].src2x} 1200w`}
                        sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
                        width={BEFUND_IMAGE_SIZE.width}
                        height={BEFUND_IMAGE_SIZE.height}
                        loading="lazy"
                        decoding="async"
                        alt={t('samples.imgAlt', { panel: item.panel })}
                        className="w-full border-b border-slate-200 object-cover"
                      />
                    ) : null}

                    <div className="flex flex-1 flex-col p-7">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
                          {t('samples.badge')}
                        </span>
                        {/* Bewusst nicht `count` als Variablenname: i18next wuerde
                            daraus einen Plural-Lookup machen und _other suchen. */}
                        <span className="text-sm text-gray-500">
                          {t('samples.pagesLabel', { pages: item.pages })}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-semibold tracking-tight text-text-heading">
                        {item.panel}
                      </h3>
                      <p className={`mt-2 text-gray-700 ${BODY}`}>{item.what}</p>

                      <ul className="mt-5 space-y-2">
                        {item.bullets?.map((bullet) => (
                          <li key={bullet} className="flex gap-3 text-base leading-7 text-gray-600">
                            <span className="mt-3 h-1 w-3 shrink-0 rounded-full bg-accent-line" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Der Befund liegt vollstaendig als Seite vor; das PDF
                          bleibt daneben als Mitnehm-Fassung. */}
                      <div className="mt-auto space-y-3 pt-6">
                        <Link
                          to={`/epigenetics/musterbefund/${item.slug}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
                        >
                          {t('samples.btn')}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <a
                          href={`${ASSET_BASE}${item.file}`}
                          download
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-base font-medium text-brand-deep transition-colors hover:border-brand-primary"
                        >
                          <Download className="h-4 w-4" />
                          {t('samples.pdfBtn')}
                        </a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal width="100%">
              <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-[62ch] text-sm leading-relaxed text-gray-500">
                  {t('samples.note')}
                </p>
                <a
                  href={samplesZipHref}
                  download
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
                >
                  <Download className="h-4 w-4" />
                  {t('samples.zipLabel')}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================
            DOKUMENTEN-BAND — zweiter, prominenter Weg zu den Unterlagen
        ================================================================ */}
        <section className="mx-auto max-w-container px-4 py-10 lg:px-0 lg:py-14">
          <Reveal width="100%">
            <div className="relative overflow-hidden rounded-3xl bg-brand-deep px-7 py-10 text-white lg:px-12 lg:py-12">
              <Sparkle className="pointer-events-none absolute -right-8 -top-8 hidden h-40 w-40 text-white/10 lg:block" />
              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-[52ch]">
                  <h2 className="text-2xl font-medium tracking-tight lg:text-3xl">
                    {t('docsBand.title')}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-white/80 lg:text-[17px] lg:leading-8">
                    {t('docsBand.text')}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <a
                    href={zipHref}
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:bg-accent-soft"
                  >
                    <Download className="h-4 w-4" />
                    {t('docsBand.ctaZip')}
                  </a>
                  <a
                    href="#downloads"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                  >
                    <FileText className="h-4 w-4" />
                    {t('docsBand.ctaAll')}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================================================================
            ABLAUF IN DER PRAXIS
        ================================================================ */}
        <section id="ablauf" className="scroll-mt-[124px] lg:scroll-mt-[148px] mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          <Reveal width="100%">
            <SectionHeader
              caption={t('workflow.caption')}
              title={t('workflow.title')}
              align="left"
            />
            <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('workflow.lead')}</p>
          </Reveal>
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal
                key={index}
                width="100%"
                delay={(index % 3) * REVEAL_STAGGER}
                className={STRETCH}
              >
                <li className="h-full rounded-3xl border border-slate-200 bg-white p-7">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-base font-semibold text-accent-strong">
                    {index + 1}
                  </span>
                  <p className={`mt-4 text-gray-700 ${BODY}`}>{step}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ================================================================
            WERTE VERSTEHEN — die vier Ebenen und die drei Zahlenformate
        ================================================================ */}
        <section id="werte-verstehen" className="scroll-mt-[124px] lg:scroll-mt-[148px] border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
            <Reveal width="100%">
              <SectionHeader
                caption={t('basics.caption')}
                title={t('basics.title')}
                align="left"
              />
              <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('basics.lead')}</p>
            </Reveal>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {concepts.map((item, index) => (
                <Reveal key={item.num} width="100%" delay={0.05 * (index % 2)} className={STRETCH}>
                  <div className="h-full rounded-3xl border border-slate-200 bg-slate-50 p-7">
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-deep text-sm font-semibold text-white">
                        {item.num}
                      </span>
                      <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-text-heading">
                        {item.title}
                      </h3>
                    </div>
                    <p className={`mt-4 text-gray-700 ${BODY}`}>{item.text}</p>
                    <p className="mt-4 border-t border-slate-200 pt-4 text-base font-medium text-accent-strong">
                      {item.key}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal width="100%">
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
                <p className={LABEL}>{t('basics.scaleTitle')}</p>
                <dl className="mt-4 grid gap-5 lg:grid-cols-3">
                  {scales.map((scale) => (
                    <div key={scale.k}>
                      <dt className="text-base font-semibold text-text-heading">{scale.k}</dt>
                      <dd className={`mt-1.5 text-gray-700 ${BODY}`}>{scale.v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 border-t border-slate-200 pt-6">
                  <a
                    href={`${ASSET_BASE}${t('basics.file')}`}
                    download
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
                  >
                    <Download className="h-4 w-4" />
                    {t('basics.cta')}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================
            STUDIENLAGE — GESICHERT VS. VORLAEUFIG
        ================================================================ */}
        <section id="studienlage" className="scroll-mt-[124px] lg:scroll-mt-[148px] border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
            <Reveal width="100%">
              <SectionHeader
                caption={t('evidence.caption')}
                title={t('evidence.title')}
                align="left"
              />
              <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('evidence.lead')}</p>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Reveal width="100%" className={STRETCH}>
                <div className="h-full rounded-3xl border border-accent-border bg-accent-soft p-7 lg:p-7">
                  <h3 className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <Check className="h-4 w-4" />
                    {t('evidence.establishedTitle')}
                  </h3>
                  <ul className="mt-6 space-y-6">
                    {established.map((item) => (
                      <li key={item.title}>
                        <p className="text-lg font-semibold text-text-heading">{item.title}</p>
                        <p className={`mt-1.5 text-gray-700 ${BODY}`}>{item.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal width="100%" delay={REVEAL_STAGGER} className={STRETCH}>
                <div className="h-full rounded-3xl border border-slate-200 bg-slate-50 p-7 lg:p-7">
                  <h3 className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <Minus className="h-4 w-4" />
                    {t('evidence.preliminaryTitle')}
                  </h3>
                  <ul className="mt-6 space-y-6">
                    {preliminary.map((item) => (
                      <li key={item.title}>
                        <p className="text-lg font-semibold text-text-heading">{item.title}</p>
                        <p className={`mt-1.5 text-gray-600 ${BODY}`}>{item.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal width="100%">
              <div className="mt-6">
                <a
                  href={`${ASSET_BASE}${t('evidence.file')}`}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
                >
                  <Download className="h-4 w-4" />
                  {t('evidence.cta')}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================
            FAQ — natives <details>, kein JavaScript noetig
        ================================================================ */}
        <section id="fragen" className="scroll-mt-[124px] lg:scroll-mt-[148px] mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          <Reveal width="100%">
            <div className="mx-auto max-w-[68ch]">
              <SectionHeader caption={t('faq.caption')} title={t('faq.title')} align="left" />
            </div>
          </Reveal>
          <div className="mx-auto mt-10 max-w-[68ch] divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {faq.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-6 text-left text-lg font-medium text-text-heading transition-colors hover:bg-slate-50 lg:px-8">
                  <span>{item.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-brand-primary transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className={`px-6 pb-7 text-gray-600 lg:px-8 ${BODY}`}>{item.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ================================================================
            ALLE UNTERLAGEN
        ================================================================ */}
        <section id="downloads" className="scroll-mt-[124px] lg:scroll-mt-[148px] border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
            <Reveal width="100%">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <SectionHeader
                    caption={t('downloads.caption')}
                    title={t('downloads.title')}
                    align="left"
                  />
                  <p className={`mt-3 max-w-[68ch] ${LEAD}`}>{t('downloads.sub')}</p>
                </div>
                <a
                  href={zipHref}
                  download
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
                >
                  <Download className="h-4 w-4" />
                  {t('downloads.zipLabel')}
                </a>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sheets.map((sheet, index) => (
                <Reveal
                  key={sheet.num}
                  width="100%"
                  delay={(index % 3) * REVEAL_STAGGER}
                  className={STRETCH}
                >
                  <article
                    className={`group flex h-full flex-col justify-between rounded-2xl border bg-white p-6 transition-all hover:-translate-y-0.5 ${
                      sheet.featured
                        ? 'border-accent-border ring-1 ring-accent-border'
                        : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <span
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                            sheet.featured
                              ? 'bg-accent-soft text-accent-strong'
                              : 'bg-slate-100 text-brand-primary'
                          }`}
                        >
                          {sheet.num}
                        </span>
                        <FileText className="h-5 w-5 text-slate-300 transition-colors group-hover:text-brand-primary" />
                      </div>
                      <h3 className="text-lg font-semibold tracking-tight text-text-heading">
                        {sheet.title}
                      </h3>
                      <p className="mt-2 text-base leading-7 text-gray-600">{sheet.desc}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className="text-sm text-gray-500">{sheet.meta}</span>
                      <a
                        href={`${ASSET_BASE}${sheet.file}`}
                        download
                        className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-hover"
                      >
                        <Download className="h-4 w-4" />
                        {t('downloads.btn')}
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal width="100%">
              <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-[62ch]">
                  <p className="text-lg font-semibold text-text-heading">
                    {t('downloads.samplesTitle')}
                  </p>
                  <p className={`mt-1.5 text-gray-700 ${BODY}`}>{t('downloads.samplesText')}</p>
                </div>
                <a
                  href="#musterbefunde"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
                >
                  <FileText className="h-4 w-4" />
                  {t('downloads.samplesCta')}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================
            KONDITIONEN ANFRAGEN + RECHTLICHER HINWEIS
        ================================================================ */}
        <section className="mx-auto max-w-container px-4 py-16 text-center lg:px-0 lg:py-24">
          <Reveal width="100%">
            <SectionHeader
              caption={t('contact.caption')}
              title={t('contact.title')}
              align="center"
            />
            <p className={`mx-auto mt-4 max-w-[62ch] ${LEAD}`}>{t('contact.sub')}</p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="mailto:contact@polarisdx.net"
                className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
              >
                contact@polarisdx.net
              </a>
              <a
                href="tel:+4915228580999"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
              >
                +49 152 2858 0999
              </a>
              <a
                href={overviewHref}
                download
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
              >
                <Download className="h-4 w-4" />
                {t('contact.overview')}
              </a>
            </div>

            {/* Rechtlicher Hinweis — abgestimmt, bitte unveraendert lassen. */}
            <p className="mx-auto mt-10 max-w-[68ch] text-sm leading-relaxed text-gray-500">
              {t('contact.note')}
            </p>
            <p className="mt-3 text-sm text-gray-400">{t('contact.lab')}</p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-base">
              <Link
                to="/diagnostics/longevity"
                className="font-semibold text-brand-primary transition-colors hover:text-brand-deep"
              >
                {t('links.longevity')} →
              </Link>
              <Link
                to="/downloads"
                className="font-semibold text-brand-primary transition-colors hover:text-brand-deep"
              >
                {t('links.downloads')} →
              </Link>
              <Link
                to="/contact"
                className="font-semibold text-brand-primary transition-colors hover:text-brand-deep"
              >
                {t('links.contact')} →
              </Link>
            </div>
          </Reveal>
        </section>
      </div>
      <FinalCtaSection roiHref="/#roi-rechner" />
    </PageTransition>
  )
}

export default EpigeneticsPage
