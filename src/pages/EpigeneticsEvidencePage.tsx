/**
 * EpigeneticsEvidencePage — /epigenetics/studienlage
 *
 * Belegfuehrung und Grenzen an einer Stelle. Auf der Programmseite lagen die
 * Bestandteile an drei verschiedenen Orten: die Studienlage als Kapitel 7, die
 * methodischen Grenzen und der GenDG-Hinweis als Kaesten unter der
 * Vergleichstabelle, der rechtliche Hinweis ganz am Seitenende zwischen den
 * Anfrageknoepfen.
 *
 * Die Vergleichsanbieter fuehren Wissenschaft als eigenen Menuepunkt
 * ("Our Science"). Genau das ist diese Seite.
 *
 * FACHLICH/RECHTLICH ABGESTIMMT — bitte nicht ohne Ruecksprache aendern:
 * - Die Trennung "gut belegt" gegen "vorlaeufig" ist Absicht. Vor Fachpublikum
 *   traegt die Strecke nur mit offengelegten Grenzen.
 * - Der Hinweistext (contact.note) steht zusaetzlich hier, nicht statt auf der
 *   Programmseite: dort wird das Angebot gemacht, dort muss er stehen.
 *
 * Anker `#studienlage` bleibt erhalten — er ist extern verlinkt.
 * Kein neuer Text — alle Schluessel bestehen bereits in zehn Sprachen.
 */

import { useTranslation } from 'react-i18next'
import { Check, Download, Minus } from 'lucide-react'
import EpiSubpage from '../components/epigenetics/EpiSubpage'
import type { Chapter } from '../components/ui/ChapterNav'
import { ASSET_BASE, asArray, BODY, STRETCH } from '../components/epigenetics/tokens'
import Reveal from '../components/ui/Reveal'

interface TitledText {
  title: string
  text: string
}

const EpigeneticsEvidencePage = () => {
  const { t } = useTranslation('epigenetics')

  const established = asArray<TitledText>(t('evidence.established', { returnObjects: true }))
  const preliminary = asArray<TitledText>(t('evidence.preliminary', { returnObjects: true }))
  const caveats = asArray<TitledText>(t('compare.caveats', { returnObjects: true }))

  // Zwei Kapitel. Der zweite Abschnitt traegt als Ueberschrift
  // `compare.caveatTitle` — 48 Zeichen und damit als Chip unbrauchbar. Als
  // Beschriftung steht deshalb `befund.noticeTitle` ("Pflichthinweise") dort,
  // derselbe Begriff, den die Musterbefunde fuer genau diesen Inhalt benutzen
  // (methodische Grenzen, GenDG, Rechtshinweis). Ein eigener, treffenderer
  // Kurztitel waere neuer Text in zehn Sprachen und gehoert in die
  // Redaktionsrunde, nicht hierher.
  const chapters: Chapter[] = [
    { id: 'studienlage', label: t('evidence.caption') },
    { id: 'grenzen', label: t('befund.noticeTitle') },
  ]

  return (
    <EpiSubpage
      path="/epigenetics/studienlage"
      caption="evidence.caption"
      title="evidence.title"
      lead="evidence.lead"
      chapters={chapters}
      source="studienlage"
    >
      {/* ================================================================
          GESICHERT GEGEN VORLAEUFIG
      ================================================================ */}
      <section
        id="studienlage"
        className="scroll-mt-[var(--chapterbar-offset,148px)] mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-20"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal width="100%" className={STRETCH}>
            <div className="h-full rounded-3xl border border-accent-border bg-accent-soft p-7 lg:p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
                <Check className="h-4 w-4" aria-hidden="true" />
                {t('evidence.establishedTitle')}
              </h2>
              <ul className="mt-6 space-y-6">
                {established.map((item) => (
                  <li key={item.title}>
                    <p className="text-lg font-semibold text-heading">{item.title}</p>
                    <p className={`mt-1.5 text-gray-700 ${BODY}`}>{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal width="100%" delay={0.08} className={STRETCH}>
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-7 lg:p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                <Minus className="h-4 w-4" aria-hidden="true" />
                {t('evidence.preliminaryTitle')}
              </h2>
              <ul className="mt-6 space-y-6">
                {preliminary.map((item) => (
                  <li key={item.title}>
                    <p className="text-lg font-semibold text-heading">{item.title}</p>
                    <p className={`mt-1.5 text-gray-600 ${BODY}`}>{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Die vollstaendige Studienlage als PDF. Sie steht auch im
            Unterlagen-Abschnitt als Blatt 08 — hier steht sie da, wo jemand
            sie tatsaechlich sucht. */}
        <Reveal width="100%">
          <a
            href={`${ASSET_BASE}${t('evidence.file')}`}
            download
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t('evidence.cta')}
          </a>
        </Reveal>
      </section>

      {/* ================================================================
          METHODISCHE GRENZEN — die zwei Panels, bei denen es ins Gespraech
          gehoert
      ================================================================ */}
      <section
        id="grenzen"
        className="scroll-mt-[var(--chapterbar-offset,148px)] border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-20">
          <Reveal width="100%">
            <div className="rounded-3xl border border-accent-border bg-accent-soft p-7">
              <h2 className="text-sm font-semibold text-accent-strong">
                {t('compare.caveatTitle')}
              </h2>
              <div className="mt-4 grid gap-5 lg:grid-cols-2">
                {caveats.map((item) => (
                  <div key={item.title}>
                    <p className="text-base font-semibold text-heading">{item.title}</p>
                    <p className={`mt-1.5 text-gray-700 ${BODY}`}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* GenDG und der abgestimmte Rechtshinweis. Beide gehoeren zur
              Belegfuehrung, nicht ans Ende einer Verkaufsseite. Wortlaut
              unveraendert. */}
          <Reveal width="100%">
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <p className={`text-gray-700 ${BODY}`}>{t('compare.gendg')}</p>
              <p className="mt-6 max-w-[80ch] border-t border-slate-200 pt-6 text-sm leading-relaxed text-gray-600">
                {t('contact.note')}
              </p>
              <p className="mt-3 text-sm text-gray-600">{t('contact.lab')}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </EpiSubpage>
  )
}

export default EpigeneticsEvidencePage
