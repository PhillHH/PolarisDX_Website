/**
 * ConsultSteps — "So wird daraus eine Beratung"
 *
 * Der Abschnitt beantwortet die Frage, die zwischen Befund und Termin steht:
 * was aus den Werten im Gespraech wird. Er steht auf allen sechs Musterbefunden
 * hinter dem Kapitel "So lesen Sie diesen Befund" und vor dem ersten Wert des
 * Beispielbefunds, und noch einmal im Hero der Uebersichtsseite.
 *
 * FACHLICH/RECHTLICH ABGESTIMMT — bitte nicht ohne Ruecksprache aendern:
 * - Die Untergrenze "fruehestens nach vier bis sechs Monaten" ist NUR fuer
 *   Metabolic Health und Healthy Aging belegt (Methylierung). Auf den vier
 *   uebrigen Panels steht dort keine Monatszahl, sondern nur der Satz, dass
 *   die betreuende Einrichtung den Abstand festlegt. Daher die zwei getrennten
 *   Schluessel consult.after.methylation und consult.after.general.
 * - Die Zahl der beeinflussbaren Werte ist je Panel eine andere und liegt
 *   deshalb je Slug in den Locales. Bei Healthy Sport sind die vier
 *   Sportmarker GENETISCH und unveraenderlich — dort niemals von vier
 *   beeinflussbaren Werten sprechen.
 * - Keine Aussage zu Therapieerfolg, Heilung oder Praevention.
 *
 * Die Texte liegen in den Locales und nicht in den Befund-JSONs: derselbe
 * Wortlaut auf sieben Seiten, an einer Stelle gepflegt — und die sechs
 * Inhalts-JSONs bleiben unberuehrt.
 */

import { useTranslation } from 'react-i18next'

/** Anker des Abschnitts. Die Kapitelleiste des Musterbefunds zeigt darauf. */
export const CONSULT_ID = 'beratung'

/**
 * Panels mit eigenem Text fuer "Im Gespraech" — er nennt die Zahl der Werte
 * auf der epigenetischen Ebene, und die ist je Panel eine andere. Ein Slug,
 * der hier fehlt, bekommt den allgemeinen Text statt einer leeren Stelle.
 */
const PANELS = new Set([
  'metabolic-health',
  'healthy-aging',
  'biologische-altersuhr',
  'telomer-analyse',
  'stress-monitor',
  'healthy-sport',
])

/** Nur auf diesen beiden Panels ist die Untergrenze in Monaten belegt. */
const METHYLATION = new Set(['metabolic-health', 'healthy-aging'])

export interface ConsultStepsProps {
  /**
   * Slug des Panels. Ohne Slug — im Hero der Uebersichtsseite — steht der
   * allgemeine Text ohne Zahlenangabe.
   */
  slug?: string
  /**
   * `section` bringt den eigenen dunklen Rahmen mit und ist die Fassung fuer
   * die Musterbefunde. `hero` gibt nur den Inhalt aus, weil der Hero der
   * Uebersichtsseite den Hintergrund schon stellt.
   */
  variant?: 'section' | 'hero'
}

const ConsultSteps = ({ slug, variant = 'section' }: ConsultStepsProps) => {
  const { t } = useTranslation('epigenetics')

  const during =
    slug && PANELS.has(slug) ? t(`consult.during.${slug}`) : t('consult.during.general')
  const after =
    slug && METHYLATION.has(slug) ? t('consult.after.methylation') : t('consult.after.general')

  const steps = [
    { num: '01', title: t('consult.before.title'), text: t('consult.before.text') },
    { num: '02', title: t('consult.during.title'), text: during },
    { num: '03', title: t('consult.after.title'), text: after },
  ]

  /*
   * Der Abschnitt bleibt offen. Er ist der Grund, warum jemand den Befund
   * ueberhaupt liest — hinter einem Aufklapper waere er verschenkt.
   */
  const body = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
        {t('consult.caption')}
      </p>
      <h2 className="mt-2 max-w-[34ch] text-2xl font-semibold tracking-tight text-white lg:text-3xl">
        {t('consult.title')}
      </h2>
      <ol className="mt-8 grid gap-4 lg:grid-cols-3">
        {steps.map((s) => (
          <li
            key={s.num}
            className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
          >
            <p className="text-xs font-semibold tracking-[0.16em] text-accent-on-dark">{s.num}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-white/85">{s.text}</p>
          </li>
        ))}
      </ol>
    </>
  )

  if (variant === 'hero') return body

  return (
    <section
      id={CONSULT_ID}
      className="scroll-mt-[var(--chapterbar-offset,148px)] bg-brand-deep text-white"
    >
      <div className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">{body}</div>
    </section>
  )
}

export default ConsultSteps
