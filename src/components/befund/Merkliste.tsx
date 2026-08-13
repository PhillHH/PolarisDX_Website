/**
 * Panel vormerken — Knopf und Liste.
 *
 * Die fehlende Zwischenstufe zwischen Lesen und Anfragen: der Nutzer merkt
 * Panels vor, die Liste steht am Ende der Panelauswahl und am Ende jedes
 * Musterbefunds, und von dort fuehrt genau ein Weg weiter — "Angebot
 * anfragen", mit den vorgemerkten Panels als Kontext.
 *
 * Der Anfrageweg ist der bestehende: /contact?intent=quote&source=epigenetics
 * &panel=<Namen>#kontaktformular. Das Formular kennt diesen Vertrag bereits und
 * schreibt die Namen in den Freitext, wo sie vor dem Absenden sichtbar und
 * aenderbar sind.
 *
 * DATENSCHUTZ: die Liste liegt ausschliesslich im localStorage dieses Browsers,
 * es gibt kein Backend und keine Uebertragung ohne Nutzerhandlung. Die Regeln
 * stehen ausfuehrlich in src/lib/merkliste.ts — bitte dort nachlesen, bevor
 * hier etwas dazukommt.
 *
 * Die Panelnamen kommen aus samples.items der Locales, nicht aus einer eigenen
 * Liste: gespeichert wird der Slug, angezeigt der uebersetzte Name.
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bookmark, BookmarkCheck, X } from 'lucide-react'
import { useMerkliste, type MerkSlug } from '../../lib/merkliste'

interface SampleItem {
  slug: string
  panel: string
}

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : [])

/** Panelname zum Slug — in der Sprache der Seite. */
function usePanelNames(): Record<string, string> {
  const { t } = useTranslation('epigenetics')
  const samples = asArray<SampleItem>(t('samples.items', { returnObjects: true }))
  return Object.fromEntries(samples.map((s) => [s.slug, s.panel]))
}

/**
 * Der Knopf. Waehrend der Hydration steht er im Grundzustand, weil der Store
 * dort die leere Liste liefert; unmittelbar danach zieht er nach.
 */
export const MerkButton = ({
  slug,
  panel,
  className = '',
}: {
  slug: string
  panel: string
  className?: string
}) => {
  const { t } = useTranslation('epigenetics')
  const { has, toggle } = useMerkliste()
  const gemerkt = has(slug)

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={gemerkt}
      aria-label={t(gemerkt ? 'merk.removeAria' : 'merk.addAria', { panel })}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-base font-semibold transition-colors ${
        gemerkt
          ? 'border-accent-strong bg-accent-soft text-accent-strong'
          : 'border-slate-300 text-brand-deep hover:border-brand-primary'
      } ${className}`}
    >
      {gemerkt ? (
        <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Bookmark className="h-4 w-4" aria-hidden="true" />
      )}
      {t(gemerkt ? 'merk.added' : 'merk.add')}
    </button>
  )
}

/** Anker der Liste — beide Seiten benutzen denselben. */
export const MERK_ID = 'merkliste'

/**
 * Die Liste. Sie erscheint erst, wenn etwas darin steht: eine dauerhaft leere
 * Box waere auf beiden Seiten nur ein weiterer Kasten.
 */
export const Merkliste = ({ className = '' }: { className?: string }) => {
  const { t } = useTranslation('epigenetics')
  const { slugs, remove, clear } = useMerkliste()
  const names = usePanelNames()

  if (slugs.length === 0) return null

  const namen = slugs.map((s: MerkSlug) => names[s] ?? s)
  // Der Kontext wandert als Klartext in den Freitext des Formulars — deshalb
  // die Namen und nicht die Slugs.
  const anfrage = `/contact?intent=quote&source=epigenetics&panel=${encodeURIComponent(
    namen.join(', '),
  )}#kontaktformular`

  return (
    <section
      id={MERK_ID}
      className={`scroll-mt-[var(--chapterbar-offset,148px)] rounded-3xl border border-accent-border bg-accent-soft p-7 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
        {t('merk.caption')}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-heading">
        {t('merk.title')}
      </h2>
      <p className="mt-3 max-w-[72ch] text-base leading-7 text-gray-700">{t('merk.lead')}</p>

      <ul className="mt-6 flex flex-wrap gap-3">
        {slugs.map((slug) => (
          <li key={slug}>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white py-1.5 pl-4 pr-1.5 text-base font-medium text-text-heading">
              {names[slug] ?? slug}
              <button
                type="button"
                onClick={() => remove(slug)}
                aria-label={t('merk.removeAria', { panel: names[slug] ?? slug })}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-slate-100 hover:text-brand-deep"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          to={anfrage}
          className="inline-flex items-center justify-center rounded-full bg-accent-strong px-6 py-3.5 text-base font-semibold text-white transition-colors hover:brightness-110"
        >
          {t('hero.ctaQuote')}
        </Link>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
        >
          {t('merk.clear')}
        </button>
      </div>

      <p className="mt-5 max-w-[80ch] text-sm leading-relaxed text-gray-600">{t('merk.note')}</p>
    </section>
  )
}

export default Merkliste
