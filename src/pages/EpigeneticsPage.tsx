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

  return (
    <PageTransition>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
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

      <div className="bg-slate-50 text-gray-900">
        {/* ================================================================
            HERO
        ================================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-[#203864] text-white">
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
                <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-white/80 lg:text-lg lg:leading-relaxed">
                  {t('hero.claim')}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#analysen"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:bg-accent-soft"
                  >
                    {t('hero.ctaDocs')}
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
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
                      <dt className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                        {chip.label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-white">{chip.value}</dd>
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
            <p className="mt-4 max-w-[68ch] text-lg leading-relaxed text-gray-600">
              {t('principle.lead')}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {principleCards.map((card, index) => (
              <Reveal
                key={card.title}
                width="100%"
                delay={0.05 * index}
                className="h-full [&>div]:h-full"
              >
                <div className="h-full rounded-3xl border border-slate-200 bg-white p-7">
                  <h3 className="text-lg font-semibold tracking-tight text-text-heading">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-7 text-gray-600">{card.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal width="100%" delay={0.1}>
            <div className="mt-6 rounded-3xl border border-accent-border bg-accent-soft p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                {t('principle.practice.title')}
              </p>
              <ul className="mt-4 grid gap-3 lg:grid-cols-3">
                {practiceItems.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-7 text-gray-700">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-accent-strong" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
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
              <p className="mt-4 max-w-[68ch] text-lg leading-relaxed text-gray-600">
                {t('analyses.lead')}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {analyses.map((item, index) => (
                <Reveal
                  key={item.num}
                  width="100%"
                  delay={0.05 * (index % 2)}
                  className="h-full [&>div]:h-full"
                >
                  <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-7 transition-shadow hover:shadow-card lg:p-8">
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-deep text-sm font-semibold text-white">
                        {item.num}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight text-text-heading">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-[15px] leading-7 text-gray-600">{item.subtitle}</p>
                      </div>
                    </div>

                    <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                      {item.facts?.map((fact) => (
                        <div
                          key={fact.k}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                        >
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                            {fact.k}
                          </dt>
                          <dd className="mt-0.5 text-sm font-medium text-text-heading">{fact.v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                        {t('analyses.whatLabel')}
                      </p>
                      <p className="mt-2 text-[15px] leading-7 text-gray-700">{item.what}</p>
                    </div>

                    <div className="mt-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                        {t('analyses.whoLabel')}
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {item.who?.map((who) => (
                          <li
                            key={who}
                            className="flex gap-2.5 text-[15px] leading-7 text-gray-700"
                          >
                            <span className="mt-3 h-1 w-3 shrink-0 rounded-full bg-accent-line" />
                            <span>{who}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-7 border-t border-slate-200 pt-5">
                      <a
                        href={`${ASSET_BASE}${item.file}`}
                        download
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-colors hover:text-brand-deep"
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
            ABLAUF IN DER PRAXIS
        ================================================================ */}
        <section className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          <Reveal width="100%">
            <SectionHeader
              caption={t('workflow.caption')}
              title={t('workflow.title')}
              align="left"
            />
            <p className="mt-4 max-w-[68ch] text-lg leading-relaxed text-gray-600">
              {t('workflow.lead')}
            </p>
          </Reveal>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal
                key={index}
                width="100%"
                delay={0.05 * (index % 3)}
                className="h-full [&>div]:h-full"
              >
                <li className="h-full rounded-3xl border border-slate-200 bg-white p-6">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-strong">
                    {index + 1}
                  </span>
                  <p className="mt-4 text-[15px] leading-7 text-gray-700">{step}</p>
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
              <p className="mt-4 max-w-[68ch] text-lg leading-relaxed text-gray-600">
                {t('evidence.lead')}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Reveal width="100%" className="h-full [&>div]:h-full">
                <div className="h-full rounded-3xl border border-accent-border bg-accent-soft p-7 lg:p-8">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
                    <Check className="h-4 w-4" />
                    {t('evidence.establishedTitle')}
                  </h3>
                  <ul className="mt-6 space-y-6">
                    {established.map((item) => (
                      <li key={item.title}>
                        <p className="font-semibold text-text-heading">{item.title}</p>
                        <p className="mt-1.5 text-[15px] leading-7 text-gray-700">{item.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal width="100%" delay={0.08} className="h-full [&>div]:h-full">
                <div className="h-full rounded-3xl border border-slate-200 bg-slate-50 p-7 lg:p-8">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                    <Minus className="h-4 w-4" />
                    {t('evidence.preliminaryTitle')}
                  </h3>
                  <ul className="mt-6 space-y-6">
                    {preliminary.map((item) => (
                      <li key={item.title}>
                        <p className="font-semibold text-text-heading">{item.title}</p>
                        <p className="mt-1.5 text-[15px] leading-7 text-gray-600">{item.text}</p>
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
                  className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-hover"
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
            <div className="mx-auto max-w-[80ch]">
              <SectionHeader caption={t('faq.caption')} title={t('faq.title')} align="left" />
            </div>
          </Reveal>
          <div className="mx-auto mt-10 max-w-[80ch] divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {faq.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-medium text-text-heading transition-colors hover:bg-slate-50 lg:px-8">
                  <span>{item.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-brand-primary transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-[15px] leading-7 text-gray-600 lg:px-8">
                  {item.a}
                </div>
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
                  <p className="mt-3 max-w-[68ch] text-gray-600">{t('downloads.sub')}</p>
                </div>
                <a
                  href={`${ASSET_BASE}${t('downloads.zipFile')}`}
                  download
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:border-brand-primary hover:bg-slate-50"
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
                  delay={0.04 * (index % 3)}
                  className="h-full [&>div]:h-full"
                >
                  <article
                    className={`group flex h-full flex-col justify-between rounded-2xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-card ${
                      sheet.featured
                        ? 'border-accent-border ring-1 ring-accent-border'
                        : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <span
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                            sheet.featured
                              ? 'bg-accent-soft text-accent-strong'
                              : 'bg-slate-100 text-brand-primary'
                          }`}
                        >
                          {sheet.num}
                        </span>
                        <FileText className="h-4 w-4 text-slate-300 transition-colors group-hover:text-brand-primary" />
                      </div>
                      <h3 className="font-semibold tracking-tight text-text-heading">
                        {sheet.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-gray-600">{sheet.desc}</p>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className="text-xs text-gray-500">{sheet.meta}</span>
                      <a
                        href={`${ASSET_BASE}${sheet.file}`}
                        download
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-navy-hover"
                      >
                        <Download className="h-3.5 w-3.5" />
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
            <p className="mx-auto mt-4 max-w-[62ch] text-lg leading-relaxed text-gray-600">
              {t('contact.sub')}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="mailto:contact@polarisdx.net"
                className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-hover"
              >
                contact@polarisdx.net
              </a>
              <a
                href="tel:+4915228580999"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:border-brand-primary"
              >
                +49 152 2858 0999
              </a>
              <a
                href={`${ASSET_BASE}${t('contact.overviewFile')}`}
                download
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:border-brand-primary"
              >
                <Download className="h-4 w-4" />
                {t('contact.overview')}
              </a>
            </div>

            {/* Rechtlicher Hinweis — abgestimmt, bitte unveraendert lassen. */}
            <p className="mx-auto mt-10 max-w-[80ch] text-xs leading-relaxed text-gray-500">
              {t('contact.note')}
            </p>
            <p className="mt-3 text-xs text-gray-400">{t('contact.lab')}</p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
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
