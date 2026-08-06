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
import { Check, ChevronDown, Download, FileText, Minus } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema, createFAQSchema } from '../components/seo'
import type { FAQItem } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import SectionHeader from '../components/ui/SectionHeader'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

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
  const { t } = useTranslation('epigenetics')

  const chips = asArray<Chip>(t('hero.chips', { returnObjects: true }))
  const principleCards = asArray<TitledText>(t('principle.cards', { returnObjects: true }))
  const practiceItems = asArray<string>(t('principle.practice.items', { returnObjects: true }))
  const analyses = asArray<Analysis>(t('analyses.items', { returnObjects: true }))
  const steps = asArray<string>(t('workflow.steps', { returnObjects: true }))
  const established = asArray<TitledText>(t('evidence.established', { returnObjects: true }))
  const preliminary = asArray<TitledText>(t('evidence.preliminary', { returnObjects: true }))
  const faq = asArray<QA>(t('faq.items', { returnObjects: true }))
  const sheets = asArray<Sheet>(t('sheets', { returnObjects: true }))

  const faqSchemaItems: FAQItem[] = faq.map((item) => ({ question: item.q, answer: item.a }))
  const overviewHref = `${ASSET_BASE}${t('contact.overviewFile')}`
  const zipHref = `${ASSET_BASE}${t('downloads.zipFile')}`

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
          createBreadcrumbSchema([
            { name: t('breadcrumb.home'), url: '/' },
            { name: t('breadcrumb.current'), url: '/epigenetics' },
          ]),
          ...(faqSchemaItems.length > 0 ? [createFAQSchema(faqSchemaItems)] : []),
        ]}
      />

      <div className="bg-slate-50 text-heading">
        {/* ================================================================
            HERO
        ================================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-brand-navy-mid text-white">
          <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-brand-secondary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-[320px] w-[320px] rounded-full bg-accent/20 blur-3xl" />
          <Sparkle className="pointer-events-none absolute right-8 top-24 hidden h-40 w-40 text-white/15 lg:block" />
          <Sparkle className="pointer-events-none absolute right-52 top-56 hidden h-16 w-16 text-accent-on-dark/30 lg:block" />

          <div className="relative mx-auto max-w-page px-4 pb-16 pt-28 lg:px-10 lg:pb-20 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
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
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:bg-accent-soft"
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
                    className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
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

        {/* ================================================================
            DAS PRINZIP
        ================================================================ */}
        <section className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          <Reveal width="100%">
            <SectionHeader
              caption={t('principle.caption')}
              title={t('principle.title')}
              align="left"
            />
            <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('principle.lead')}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {principleCards.map((card, index) => (
              <Reveal key={card.title} width="100%" delay={0.05 * index} className={STRETCH}>
                <div className="h-full rounded-3xl border border-slate-200 bg-white p-7">
                  <h3 className="text-xl font-semibold tracking-tight text-text-heading">
                    {card.title}
                  </h3>
                  <p className={`mt-3 text-gray-600 ${BODY}`}>{card.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal width="100%" delay={0.1}>
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
          <Reveal width="100%" delay={0.15}>
            <div className="mt-6 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-7 sm:flex-row sm:items-center sm:justify-between">
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
        <section id="analysen" className="scroll-mt-24 border-y border-slate-200 bg-white">
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
                <Reveal key={item.num} width="100%" delay={0.05 * (index % 2)} className={STRETCH}>
                  <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-7 transition-shadow hover:shadow-card lg:p-8">
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

                    <div className="mt-auto pt-7">
                      <a
                        href={`${ASSET_BASE}${item.file}`}
                        download
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary hover:bg-brand-primary hover:text-white sm:w-auto"
                      >
                        <Download className="h-4 w-4" />
                        {t('analyses.pdfBtn')}
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            DOKUMENTEN-BAND — zweiter, prominenter Weg zu den Unterlagen
        ================================================================ */}
        <section className="mx-auto max-w-container px-4 py-10 lg:px-0 lg:py-14">
          <Reveal width="100%">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-deep to-brand-navy-mid px-7 py-10 text-white lg:px-12 lg:py-12">
              <Sparkle className="pointer-events-none absolute -right-8 -top-8 hidden h-40 w-40 text-white/10 lg:block" />
              <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
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
        <section className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          <Reveal width="100%">
            <SectionHeader
              caption={t('workflow.caption')}
              title={t('workflow.title')}
              align="left"
            />
            <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('workflow.lead')}</p>
          </Reveal>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={index} width="100%" delay={0.05 * (index % 3)} className={STRETCH}>
                <li className="h-full rounded-3xl border border-slate-200 bg-white p-6">
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
            STUDIENLAGE — GESICHERT VS. VORLAEUFIG
        ================================================================ */}
        <section className="border-y border-slate-200 bg-white">
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
                <div className="h-full rounded-3xl border border-accent-border bg-accent-soft p-7 lg:p-8">
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

              <Reveal width="100%" delay={0.08} className={STRETCH}>
                <div className="h-full rounded-3xl border border-slate-200 bg-slate-50 p-7 lg:p-8">
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

            <Reveal width="100%" delay={0.1}>
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
        <section className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
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
        <section id="downloads" className="scroll-mt-24 border-y border-slate-200 bg-white">
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
                <Reveal key={sheet.num} width="100%" delay={0.04 * (index % 3)} className={STRETCH}>
                  <article
                    className={`group flex h-full flex-col justify-between rounded-2xl border bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-card ${
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
    </PageTransition>
  )
}

export default EpigeneticsPage
