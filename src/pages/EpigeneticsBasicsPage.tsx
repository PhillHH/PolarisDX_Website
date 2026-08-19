/**
 * EpigeneticsBasicsPage — /epigenetics/grundlagen
 *
 * Die beiden Erklaerkapitel der Programmseite, zusammengelegt: "Das Prinzip"
 * (zwei Ebenen, Genetik gegen Epigenetik) und "Werte verstehen" (die vier
 * Ebenen im Befund und die drei Zahlenformate). Auf der Programmseite standen
 * sie als Kapitel 2 und 3 zwischen der Auswahl und den Panels — rund 610
 * Woerter Theorie zwischen der Frage "welches Panel?" und ihrer Antwort.
 *
 * Die Anker `#prinzip` und `#werte-verstehen` bleiben erhalten: sie stehen in
 * den PDFs und sind extern verlinkt. Auf der Programmseite leitet ein Alias
 * dorthin weiter.
 *
 * Kein neuer Text — alle Schluessel bestehen bereits in zehn Sprachen.
 */

import { useTranslation } from 'react-i18next'
import EpiSubpage from '../components/epigenetics/EpiSubpage'
import { asArray, BODY, LABEL, LEAD, STRETCH } from '../components/epigenetics/tokens'
import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import { ScaleRamp } from '../components/befund/BefundCharts'
import { Check } from 'lucide-react'

interface TitledText {
  title: string
  text: string
}

interface Concept {
  num: string
  title: string
  text: string
  key: string
}

interface Fact {
  k: string
  v: string
}

/**
 * Die drei Eintraege in basics.scales stehen in allen Sprachen in derselben
 * Reihenfolge — Ampel, Prozent, Jahre. Wie auf der Programmseite haengt die
 * Rampe positionell daran; eine vierte Ergebnisform faellt auf die neutrale.
 */
const SCALE_KINDS = ['traffic', 'percent', 'deviation']

const EpigeneticsBasicsPage = () => {
  const { t } = useTranslation('epigenetics')

  const principleCards = asArray<TitledText>(t('principle.cards', { returnObjects: true }))
  const practiceItems = asArray<string>(t('principle.practice.items', { returnObjects: true }))
  const concepts = asArray<Concept>(t('basics.concepts', { returnObjects: true }))
  const scales = asArray<Fact>(t('basics.scales', { returnObjects: true }))
  const compareShared = asArray<TitledText>(t('compare.shared', { returnObjects: true }))

  return (
    <EpiSubpage
      path="/epigenetics/grundlagen"
      caption="principle.caption"
      title="principle.title"
      lead="principle.lead"
    >
      {/* ================================================================
          DAS PRINZIP — zwei Ebenen
      ================================================================ */}
      <section id="prinzip" className="scroll-mt-28 mx-auto max-w-container px-4 py-14 lg:px-0">
        <div className="grid gap-5 lg:grid-cols-3">
          {principleCards.map((card, index) => (
            <Reveal key={card.title} width="100%" delay={0.05 * index} className={STRETCH}>
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-7">
                <h2 className="text-xl font-semibold tracking-tight text-text-heading">
                  {card.title}
                </h2>
                <p className={`mt-3 text-gray-600 ${BODY}`}>{card.text}</p>
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
                <li key={item} className={`flex gap-3 text-gray-700 ${BODY}`}>
                  <Check className="mt-1.5 h-5 w-5 shrink-0 text-accent-strong" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* ================================================================
          WERTE VERSTEHEN — die vier Ebenen und die drei Zahlenformate
      ================================================================ */}
      <section id="werte-verstehen" className="scroll-mt-28 border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-20">
          <Reveal width="100%">
            <SectionHeader caption={t('basics.caption')} title={t('basics.title')} align="left" />
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

          {/* Die Skalenlegende steht doppelt: an der Vergleichstabelle, wo die
              Ergebnisformen zum ersten Mal auftauchen, und hier, wo sie
              hergeleitet werden. Dieselbe Quelle, kein zweiter Wortlaut. */}
          <Reveal width="100%">
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <p className={LABEL}>{t('basics.scaleTitle')}</p>
              <dl className="mt-4 grid gap-5 lg:grid-cols-3">
                {scales.map((scale, scaleIndex) => (
                  <div key={scale.k}>
                    <dt className="text-base font-semibold text-text-heading">{scale.k}</dt>
                    <dd className="mt-2">
                      <ScaleRamp kind={SCALE_KINDS[scaleIndex] ?? 'deviation'} />
                      <p className={`mt-2 text-gray-700 ${BODY}`}>{scale.v}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          WAS ALLE SECHS TEILEN — Probenweg, Ebene, Wiederholbarkeit

          Stand als drittes Kartenraster unter der Vergleichstabelle. Es
          beantwortet keine Auswahlfrage: alle sechs Panels teilen es.
      ================================================================ */}
      <section className="mx-auto max-w-container px-4 py-14 lg:px-0 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {compareShared.map((item, index) => (
            <Reveal key={item.title} width="100%" delay={0.05 * index} className={STRETCH}>
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-text-heading">{item.title}</h2>
                <p className={`mt-2 text-gray-700 ${BODY}`}>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </EpiSubpage>
  )
}

export default EpigeneticsBasicsPage
