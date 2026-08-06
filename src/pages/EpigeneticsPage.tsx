/**
 * EpigeneticsPage — /epigenetics
 *
 * Unterlagen-Seite zum Epigenetik- und Genetik-Partnerprogramm.
 * Inhalt kommt vollstaendig aus dem Locale-Namespace `epigenetics`,
 * die PDFs liegen unter public/downloads/epigenetics/<lang>/.
 *
 * FACHLICH/RECHTLICH ABGESTIMMT — bitte nicht ohne Ruecksprache aendern:
 * - Der Laborpartner wird nirgends namentlich genannt ("Kooperationspartner").
 * - Kein CE-/IVDR-Zeichen: es sind Labordienstleistungen, keine IVD.
 * - Der Hinweistext (contact.note) gehoert auf die Seite.
 * - Keine Preise ("B2B nach Absprache") und keine Befundlaufzeit.
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Download, FileText } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import SectionHeader from '../components/ui/SectionHeader'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

// public/ wird nach dist/client kopiert — die oeffentliche URL ist /downloads/...
const ASSET_BASE = '/downloads/epigenetics/'

interface Sheet {
  num: string
  title: string
  desc: string
  file: string
  meta: string
  featured?: boolean
}

interface Chip {
  label: string
  value: string
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
  const sheets = asArray<Sheet>(t('sheets', { returnObjects: true }))
  const steps = asArray<string>(t('workflow.steps', { returnObjects: true }))

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
          'PolarisDX',
        ]}
        structuredData={[
          createBreadcrumbSchema([
            { name: t('breadcrumb.home'), url: '/' },
            { name: t('breadcrumb.current'), url: '/epigenetics' },
          ]),
        ]}
      />

      <div className="bg-slate-50 text-gray-900">
        {/* ================================================================
            HERO
        ================================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-[#203864] text-white">
          {/* Weiches Licht + Sparkle-Motiv, rein dekorativ */}
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
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 lg:text-lg">
                  {t('hero.claim')}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#downloads"
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

                <dl className="mt-10 grid gap-3 sm:grid-cols-3">
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
            DOWNLOADS
        ================================================================ */}
        <section id="downloads" className="mx-auto max-w-container px-4 py-14 lg:px-0 lg:py-20">
          <Reveal width="100%">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionHeader
                  caption={t('downloads.caption')}
                  title={t('downloads.title')}
                  align="left"
                />
                <p className="mt-3 max-w-2xl text-gray-600">{t('downloads.sub')}</p>
              </div>
              <a
                href={`${ASSET_BASE}${t('downloads.zipFile')}`}
                download
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:border-brand-primary hover:bg-white"
              >
                <Download className="h-4 w-4" />
                {t('downloads.zipLabel')}
              </a>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sheets.map((sheet, index) => (
              <Reveal key={sheet.num} width="100%" delay={0.05 * (index % 3)}>
                <article
                  className={`group flex h-full flex-col justify-between rounded-3xl border bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-card ${
                    sheet.featured
                      ? 'border-accent-border ring-1 ring-accent-border'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
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
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{sheet.desc}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <span className="text-xs text-gray-500">{sheet.meta}</span>
                    <a
                      href={`${ASSET_BASE}${sheet.file}`}
                      download
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-navy-hover"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t('downloads.btn')}
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================================================================
            ABLAUF IN DER PRAXIS
        ================================================================ */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-container px-4 py-14 lg:px-0 lg:py-20">
            <Reveal width="100%">
              <SectionHeader
                caption={t('workflow.caption')}
                title={t('workflow.title')}
                align="left"
              />
            </Reveal>
            <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => (
                <Reveal key={index} width="100%" delay={0.05 * (index % 3)}>
                  <li className="flex h-full gap-4 rounded-2xl bg-slate-50 p-6">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-deep text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-gray-700">{step}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ================================================================
            EVIDENZ
        ================================================================ */}
        <section className="mx-auto max-w-container px-4 py-14 lg:px-0 lg:py-20">
          <Reveal width="100%">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-deep to-[#203864] px-6 py-12 text-white lg:px-14 lg:py-16">
              <Sparkle className="pointer-events-none absolute -right-6 -top-6 hidden h-44 w-44 text-white/10 lg:block" />
              <div className="relative max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
                  {t('evidence.eyebrow')}
                </p>
                <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
                  {t('evidence.title')}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/80">{t('evidence.text')}</p>
                <a
                  href={`${ASSET_BASE}${t('evidence.file')}`}
                  download
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:bg-accent-soft"
                >
                  <Download className="h-4 w-4" />
                  {t('evidence.cta')}
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================================================================
            KONDITIONEN ANFRAGEN + RECHTLICHER HINWEIS
        ================================================================ */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-container px-4 py-14 text-center lg:px-0 lg:py-20">
            <Reveal width="100%">
              <SectionHeader
                caption={t('contact.caption')}
                title={t('contact.title')}
                align="center"
              />
              <p className="mx-auto mt-4 max-w-2xl text-gray-600">{t('contact.sub')}</p>

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
              <p className="mx-auto mt-10 max-w-3xl text-xs leading-relaxed text-gray-500">
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
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default EpigeneticsPage
