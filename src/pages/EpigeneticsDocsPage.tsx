/**
 * EpigeneticsDocsPage — /epigenetics/unterlagen
 *
 * Alle Unterlagen der Strecke an einem Ort: neun Infoblaetter je Sprache, die
 * Parameteruebersicht, "Werte verstehen", beide ZIP-Pakete und der Weg zu den
 * sechs Musterbefunden.
 *
 * Auf der Programmseite standen dreizehn Downloadwege in einem Abschnitt, dazu
 * ein zweites ZIP im Panel-Raster. Die Vergleichsanbieter fuehren dafuer ein
 * eigenes Download-Center — die Programmseite verweist nur noch darauf.
 *
 * Anker `#downloads` bleibt erhalten, er ist extern verlinkt und steht in den
 * PDFs. Kein neuer Text — alle Schluessel bestehen bereits in zehn Sprachen.
 */

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Download, FileText } from 'lucide-react'
import EpiSubpage from '../components/epigenetics/EpiSubpage'
import type { Chapter } from '../components/ui/ChapterNav'
import { ASSET_BASE, asArray, BODY } from '../components/epigenetics/tokens'
import Reveal from '../components/ui/Reveal'

interface Sheet {
  num: string
  title: string
  desc: string
  file: string
  meta: string
  featured?: boolean
}

const EpigeneticsDocsPage = () => {
  const { t } = useTranslation('epigenetics')
  const sheets = asArray<Sheet>(t('sheets', { returnObjects: true }))

  /** Die beiden Blaetter ausserhalb der Neuner-Reihe. */
  const extras = [
    { label: t('compare.cta'), file: t('compare.file'), doc: 'compare' },
    { label: t('basics.cta'), file: t('basics.file'), doc: 'basics' },
  ]

  // Die Seite fuehrt zwei Bestaende: die Infoblaetter und den Verweis auf die
  // sechs Musterbefunde. `samples.caption` beschriftet den zweiten — der
  // Schluessel liegt in allen zehn Sprachen vor und wurde seit dem Umbau
  // nirgends mehr gerendert.
  const chapters: Chapter[] = [
    { id: 'downloads', label: t('downloads.caption') },
    { id: 'musterbefunde', label: t('samples.caption') },
  ]

  return (
    <EpiSubpage
      path="/epigenetics/unterlagen"
      caption="downloads.caption"
      title="downloads.title"
      lead="downloads.sub"
      // downloads.sub ist mit 75-81 Zeichen nur die halbe Snippet-Breite.
      // docsBand.text ist in allen zehn Sprachen freigegeben und wurde seit
      // dem Umbau nirgends mehr gerendert — er beschreibt genau diese Seite.
      leadExtra="docsBand.text"
      chapters={chapters}
      source="unterlagen"
    >
      <section
        id="downloads"
        className="scroll-mt-[var(--chapterbar-offset,148px)] mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-20"
      >
        {/* Die beiden Pakete zuerst: wer alles will, ist damit in einem Klick
            fertig und muss nicht neun Karten durchgehen. */}
        <Reveal width="100%">
          <div className="flex flex-wrap gap-3">
            <a
              href={`${ASSET_BASE}${t('downloads.zipFile')}`}
              download
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t('downloads.zipLabel')}
            </a>
            <a
              href={`${ASSET_BASE}${t('samples.zipFile')}`}
              download
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t('samples.zipLabel')}
            </a>
          </div>
        </Reveal>

        {/* Die neun Infoblaetter einzeln. */}
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sheets.map((sheet, index) => (
            <Reveal key={sheet.num} width="100%" delay={0.04 * (index % 3)} className="h-full">
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
                    <FileText
                      className="h-5 w-5 text-slate-300 transition-colors group-hover:text-brand-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight text-heading">
                    {sheet.title}
                  </h2>
                  <p className="mt-2 text-base leading-7 text-gray-600">{sheet.desc}</p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="text-sm text-gray-500">{sheet.meta}</span>
                  <a
                    href={`${ASSET_BASE}${sheet.file}`}
                    download
                    // Ohne dies tragen alle neun Knoepfe denselben
                    // zugaenglichen Namen ("PDF laden"). Wer sich die
                    // Linkliste vorlesen laesst oder per Sprachsteuerung
                    // arbeitet, bekommt neunmal dieselbe Ansage. Zwei bereits
                    // uebersetzte Schluessel zusammengesetzt — kein neuer Text.
                    aria-label={`${t('downloads.btn')}: ${sheet.title}`}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-hover"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    {t('downloads.btn')}
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Parameteruebersicht und "Werte verstehen" — die zwei Blaetter, die
            nicht in der Neuner-Reihe stehen. */}
        <Reveal width="100%">
          <div className="mt-4 flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-6">
            {extras.map((extra) => (
              <a
                key={extra.doc}
                href={`${ASSET_BASE}${extra.file}`}
                download
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {extra.label}
              </a>
            ))}
          </div>
        </Reveal>

        {/* Die sechs Musterbefunde stehen als Seiten auf der Programmseite —
            von hier fuehrt genau ein Weg dorthin. */}
        <Reveal width="100%">
          <div
            id="musterbefunde"
            className="mt-8 flex scroll-mt-[var(--chapterbar-offset,148px)] flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-7 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="max-w-[62ch]">
              <h2 className="text-lg font-semibold text-heading">{t('downloads.samplesTitle')}</h2>
              <p className={`mt-1.5 text-gray-700 ${BODY}`}>{t('downloads.samplesText')}</p>
            </div>
            <Link
              to="/epigenetics#analysen"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
            >
              {t('downloads.samplesCta')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>
    </EpiSubpage>
  )
}

export default EpigeneticsDocsPage
