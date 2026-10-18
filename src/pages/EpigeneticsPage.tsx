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

import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Download,
  Droplet,
  FileText,
  FlaskConical,
  Layers,
  Minus,
  Tag,
} from 'lucide-react'
import { SEOHead, createBreadcrumbSchema, createFAQSchema } from '../components/seo'
import type { FAQItem } from '../components/seo'
import SectionHeader from '../components/ui/SectionHeader'
import EpigeneticsPanels from '../components/sections/EpigeneticsPanels'
import PageTransition from '../components/ui/PageTransition'
import Reveal, { REVEAL_STAGGER } from '../components/ui/Reveal'
import ResourceLanguageBadge from '../components/ui/ResourceLanguageBadge'
import { Button } from '../components/ui/Button'
import { resourceLanguageFromPath } from '../lib/resourceLanguage'
import ConsultSteps from '../components/befund/ConsultSteps'
import { ScaleRamp } from '../components/befund/ScaleRamp'
import { useScrollDepth } from '../lib/useScrollDepth'
// Die Schnittstelle beschrieb `quote_request` als "der Weg Angebot anfragen
// wurde begonnen" und wurde nirgends ausgeloest. Ohne dieses Ereignis laesst
// sich nicht sagen, ob der umgebaute Anfrageweg traegt.
import { track } from '../lib/tracking'
import { panelsUrl } from '../lib/shop'
import { useMerkliste } from '../lib/merkliste'
import EpigeneticsInquiryForm from '../components/epigenetics/EpigeneticsInquiryForm'
import AreaStage from '../components/area/AreaStage'
import StageFacts from '../components/area/StageFacts'
import { useAreaShell } from '../components/area/areaShell'
import JourneySteps from '../components/area/JourneySteps'
import MobileActionBar from '../components/area/MobileActionBar'
import { epigeneticsAreaItems, epigeneticsJourney } from '../components/area/epigeneticsArea'
import {
  EPIGENETICS_FOCUS_KEYS,
  epigeneticsHubHref,
  epigeneticsInquiryHref,
  readEpigeneticsContext,
} from '../lib/epigeneticsContext'

// public/ wird nach dist/client kopiert — die oeffentliche URL ist /downloads/...
const ASSET_BASE = '/downloads/epigenetics/'

// Die drei Eintraege in basics.scales stehen in allen Sprachen in derselben
// Reihenfolge — Ampel, Prozent, Jahre. Sie tragen keinen eigenen Typschluessel,
// deshalb haengt die Rampe positionell daran. Kommt eine vierte Ergebnisform
// dazu, faellt sie auf die neutrale Rampe zurueck statt auf eine falsche.
const SCALE_KINDS = ['traffic', 'percent', 'deviation']

// Reveal rendert zwei verschachtelte divs; damit Grid-Karten auf Reihenhoehe
// wachsen, muss h-full auf beide.
const STRETCH = 'h-full [&>div]:h-full'

// Fliesstext, Lead und Kleinlabel — an einer Stelle definiert, damit die
// Lesegroesse ueber alle Sektionen identisch bleibt.
const BODY = 'text-base leading-7 lg:text-[17px] lg:leading-8'
const LEAD = 'text-lg leading-relaxed text-gray-600 lg:text-xl lg:leading-relaxed'
const LABEL = 'text-xs font-medium text-gray-600'

interface Fact {
  k: string
  v: string
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

// Ablauf: positionell gruppiert nach Ort. Schritte 1–3 (Beratung, Probenahme,
// Versand) und 6 (Besprechung) liegen in der Einrichtung, 4–5 (Analyse,
// Befund) beim Kooperationspartner — so steht es in workflow.lead.
const WORKFLOW_GROUPS = [
  { key: 'atPractice', from: 0, to: 3, lab: false },
  { key: 'atLab', from: 3, to: 5, lab: true },
  { key: 'backAtPractice', from: 5, to: 6, lab: false },
] as const

// Die drei Blaetter, die im Hub stehen: Programm, Konditionen, Grenzen. Alle
// neun (plus Parameteruebersicht und "Werte verstehen") fuehrt die
// Unterlagen-Seite.
const HUB_SHEETS = ['00', '07', '08']

const chip = (on: boolean) =>
  `inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${
    on
      ? 'border-brand-deep bg-brand-deep text-white'
      : 'border-slate-300 bg-white text-heading hover:border-accent'
  }`

const EpigeneticsPage = () => {
  const { t, i18n } = useTranslation(['epigenetics', 'common', 'downloads'])
  // Array-Form: der i18n-Guard bindet `t` sonst an `common` (scripts/check-i18n.ts).
  const { t: tCommon } = useTranslation(['common'])
  const { AreaNav, NextSteps } = useAreaShell()
  useScrollDepth('epigenetics')
  // Die vorgemerkten Panels reisen im Ereignis mit: eine Anfrage nach drei
  // vorgemerkten Panels ist etwas anderes als eine aus dem Vorbeigehen.
  const { slugs: gemerkt } = useMerkliste()

  const principleCards = asArray<TitledText>(t('principle.cards', { returnObjects: true }))
  const practiceItems = asArray<string>(t('principle.practice.items', { returnObjects: true }))
  const steps = asArray<string>(t('workflow.steps', { returnObjects: true }))
  const established = asArray<TitledText>(t('evidence.established', { returnObjects: true }))
  const preliminary = asArray<TitledText>(t('evidence.preliminary', { returnObjects: true }))
  const faq = asArray<QA>(t('faq.items', { returnObjects: true }))
  const sheets = asArray<Sheet>(t('sheets', { returnObjects: true }))
  const compareCols = asArray<string>(t('compare.cols', { returnObjects: true }))
  const compareRows = asArray<string[]>(t('compare.rows', { returnObjects: true }))
  // Einstiegsfilter. Die Kopplung Zeile -> Zielgruppe laeuft POSITIONELL ueber
  // den Index: compare.groups[i] gehoert zu compare.rows[i]. Wer in einer
  // Locale eine Zeile einfuegt, muss die Gruppe an derselben Stelle einfuegen.
  const compareGroups = asArray<string[]>(t('compare.groups', { returnObjects: true }))
  const [searchParams] = useSearchParams()
  const context = readEpigeneticsContext(searchParams)
  const panelGroup = context.focus
  const visibleRows = panelGroup
    ? compareRows.filter((_, i) => compareGroups[i]?.includes(panelGroup))
    : compareRows
  const compareShared = asArray<TitledText>(t('compare.shared', { returnObjects: true }))
  const compareCaveats = asArray<TitledText>(t('compare.caveats', { returnObjects: true }))
  const concepts = asArray<Concept>(t('basics.concepts', { returnObjects: true }))
  const scales = asArray<Fact>(t('basics.scales', { returnObjects: true }))
  const chips = asArray<{ label: string; value: string }>(t('hero.chips', { returnObjects: true }))

  const faqSchemaItems: FAQItem[] = faq.map((item) => ({ question: item.q, answer: item.a }))
  const zipHref = `${ASSET_BASE}${t('downloads.zipFile')}`
  const hubSheets = sheets.filter((sheet) => HUB_SHEETS.includes(sheet.num))
  const portfolio = sheets.find((sheet) => sheet.num === '00')
  const groupCount = (key: string) => compareGroups.filter((groups) => groups.includes(key)).length

  // Der Vergleich ist aufgeklappt, sobald jemand gezielt dorthin kommt: mit
  // einem Filter in der URL oder ueber den (extern verlinkten) Anker.
  const vergleichRef = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    if (window.location.hash === '#vergleich' && vergleichRef.current) {
      vergleichRef.current.open = true
    }
  }, [])

  const factIcons = [Droplet, FlaskConical, Layers, Tag]
  const inquiryHref = epigeneticsInquiryHref(context.panel, panelGroup)

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
          ...(faqSchemaItems.length > 0 ? [createFAQSchema(faqSchemaItems, i18n.language)] : []),
        ]}
      />

      <div
        className="bg-paper text-heading"
        data-epigenetics-hub="true"
        data-route-id="epigenetics"
      >
        {/* ================================================================
            BUEHNE (AP34 PT34.2b, SC-003)
            Genau eine Aufgabe: zu den sechs Analysen. Der Anfrageweg steht
            daneben, als zweite, leisere Schaltflaeche — er ist der einzige
            `source=epigenetics`-Link der Seite (e2e PT15.1); alle uebrigen
            Anfrage-Verweise springen per #inquiry in denselben Abschnitt.
        ================================================================ */}
        <AreaStage
          overlap
          breadcrumbs={[
            { label: t('breadcrumb.home'), href: '/' },
            { label: t('breadcrumb.current') },
          ]}
          eyebrow={t('hero.eyebrow')}
          title={t('hero.title')}
          lead={<p>{t('hero.claim')}</p>}
          actions={
            <>
              <Button
                href="#analysen"
                variant="light"
                className="w-full justify-between !py-2.5 !pl-7 !pr-2.5 shadow-card sm:w-auto"
              >
                {t('hero.ctaDocs')}
                <span
                  aria-hidden="true"
                  className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
              <Button
                to={inquiryHref}
                variant="ghost"
                onClick={() => track({ name: 'quote_request', panels: gemerkt, quelle: 'landing' })}
                className="w-full justify-center !text-white ring-1 ring-inset ring-white/25 hover:!bg-white/10 focus-visible:!ring-white focus-visible:!ring-offset-brand-deep sm:w-auto"
              >
                {t('hero.ctaQuote')}
              </Button>
              {/* SC-008: Panel-Shop (panels.polarisdx.net) fuer Endkunden;
                  Klickzaehlung ueber OUTBOUND_DOMAINS wie in der Kopfzeile. */}
              <Button
                href={panelsUrl(i18n.language)}
                variant="ghost"
                data-shop="panels"
                className="w-full justify-center gap-1.5 !text-white ring-1 ring-inset ring-white/25 hover:!bg-white/10 focus-visible:!ring-white focus-visible:!ring-offset-brand-deep sm:w-auto"
              >
                {t('hero.ctaShop')}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </>
          }
        />

        {/* Die vier Eckdaten des Programms aus hero.chips — dieselben Angaben,
            die bisher als Chips im Kopf standen. */}
        <StageFacts
          label={tCommon('area.factsLabel')}
          items={chips.slice(0, 4).map((chip, index) => ({
            icon: factIcons[index] ?? Layers,
            label: chip.label,
            value: chip.value,
          }))}
        />

        <div className="mt-8 lg:mt-10">
          <AreaNav
            label={tCommon('nav.epigenetics')}
            items={epigeneticsAreaItems(tCommon)}
            currentKey="overview"
            actions={
              <>
                {gemerkt.length > 0 ? (
                  <a
                    href="#merkliste"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-heading hover:border-accent"
                  >
                    {tCommon('area.saved', { count: gemerkt.length })}
                  </a>
                ) : null}
                <a
                  href="#inquiry"
                  data-cta-role="EPIGENETICS_INQUIRY"
                  data-cta-source="epigenetics"
                  data-cta-section="area-nav"
                  className="inline-flex h-10 items-center rounded-full bg-accent-strong px-5 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  {t('hero.ctaQuote')}
                </a>
              </>
            }
          />
        </div>

        {/* ================================================================
            WEGWEISER — vier Schritte zur Entscheidung
        ================================================================ */}
        <section className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-0 lg:py-20">
          <Reveal width="100%">
            <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-14">
              <SectionHeader
                caption={t('journey.caption')}
                title={t('journey.title')}
                align="left"
              />
              <p className={LEAD}>{t('journey.lead')}</p>
            </div>
          </Reveal>
          <div className="mt-10">
            <JourneySteps
              label={tCommon('area.journeyLabel')}
              steps={epigeneticsJourney(t)}
              currentKey="choose"
            />
          </div>
        </section>

        {/* ================================================================
            DIE SECHS ANALYSEN — mit Filter (Schritt 2)
            #analysen liegt auf dem Abschnitt, #musterbefunde als Sprungmarke
            davor — beide sind extern verlinkt und stehen in den PDFs.
        ================================================================ */}
        <section
          id="analysen"
          className="scroll-mt-[var(--chapterbar-offset,148px)] border-y border-paper-line bg-white"
        >
          <span id="musterbefunde" className="block scroll-mt-[var(--chapterbar-offset,148px)]" />
          <EpigeneticsPanels
            activePanel={context.panel}
            focus={panelGroup}
            groups={compareGroups}
            title={t('hero.chooseTitle')}
            filter={
              <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
                <p className="shrink-0 text-base font-semibold text-heading">
                  {t('compare.filter.label')}
                </p>
                <ul className="flex flex-wrap gap-2">
                  <li>
                    <Link
                      to={epigeneticsHubHref({ panel: context.panel }, 'analysen')}
                      aria-current={panelGroup === null ? 'true' : undefined}
                      className={chip(panelGroup === null)}
                    >
                      {t('compare.filter.all')}
                      <span className="text-xs font-medium opacity-70">{compareRows.length}</span>
                    </Link>
                  </li>
                  {EPIGENETICS_FOCUS_KEYS.map((key) => (
                    <li key={key}>
                      <Link
                        to={epigeneticsHubHref({ panel: context.panel, focus: key }, 'analysen')}
                        aria-current={panelGroup === key ? 'true' : undefined}
                        className={chip(panelGroup === key)}
                      >
                        {t(`compare.filter.options.${key}`)}
                        <span className="text-xs font-medium opacity-70">{groupCount(key)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
        </section>

        {/* ================================================================
            VERGLEICH — aufklappbar (progressive disclosure, SC-003)
            Die Karten oben tragen dieselben Achsen; die Tabelle ist die
            Nebeneinander-Ansicht fuer alle, die gezielt vergleichen. Die
            methodischen Grenzen und der GenDG-Hinweis stehen AUSSERHALB des
            Aufklappers und bleiben immer sichtbar.
        ================================================================ */}
        <section id="vergleich" className="scroll-mt-[var(--chapterbar-offset,148px)] bg-white">
          <div className="mx-auto max-w-container px-4 pb-16 sm:px-6 lg:px-0 lg:pb-24">
            <details
              ref={vergleichRef}
              open={panelGroup !== null || undefined}
              className="group rounded-card border border-paper-line bg-paper"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 lg:p-7 [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="block t-eyebrow">{t('compare.caption')}</span>
                  <span className="mt-1 block text-xl font-semibold tracking-tight text-heading">
                    {t('compare.title')}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-deep text-white"
                >
                  <ChevronDown className="h-5 w-5 motion-safe:transition-transform group-open:rotate-180" />
                </span>
              </summary>
              <div className="border-t border-paper-line p-4 sm:p-6 lg:p-7">
                <p className={`max-w-[68ch] ${LEAD}`}>{t('compare.lead')}</p>
                {panelGroup ? (
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <p className="text-base text-gray-600">
                      {t('compare.filter.label')}{' '}
                      <span className="font-semibold text-brand-deep">
                        {t(`compare.filter.options.${panelGroup}`)}
                      </span>
                    </p>
                    <Link
                      to={epigeneticsHubHref({ panel: context.panel }, 'vergleich')}
                      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-brand-deep transition-colors hover:border-brand-primary"
                    >
                      {t('compare.filter.all')}
                    </Link>
                  </div>
                ) : null}
                {/* Die Tabelle ist auf schmalen Viewports breiter als der
                    Bildschirm: overflow-x-auto plus min-w haelt sie scrollbar. */}
                <div
                  role="region"
                  aria-label={t('compare.title')}
                  // A horizontally scrollable data table must itself receive
                  // keyboard focus; the generic lint rule cannot infer that.
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                  tabIndex={0}
                  className="mt-6 overflow-x-auto rounded-2xl border border-paper-line bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                  <table className="w-full min-w-[54rem] border-collapse text-left">
                    <caption className="sr-only">{t('compare.title')}</caption>
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
                      {visibleRows.map((row, rowIndex) => (
                        <tr key={row[0]} className={rowIndex % 2 === 1 ? 'bg-paper' : 'bg-white'}>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={`${row[0]}-${cellIndex}`}
                              className={
                                cellIndex === 0
                                  ? 'px-5 py-4 text-base font-semibold text-heading'
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
                {visibleRows.length === 0 ? (
                  <p className="mt-4 text-base text-gray-600">{t('compare.filter.empty')}</p>
                ) : null}
                <p className="mt-3 text-sm text-gray-600 lg:hidden">{t('compare.scrollHint')}</p>

                <div className="mt-6 rounded-2xl border border-paper-line bg-white p-6">
                  <p className={LABEL}>{t('basics.scaleTitle')}</p>
                  <dl className="mt-4 grid gap-5 lg:grid-cols-3">
                    {scales.map((scale, scaleIndex) => (
                      <div key={`vergleich-${scale.k}`}>
                        <dt className="text-base font-semibold text-heading">{scale.k}</dt>
                        <dd className="mt-2">
                          <ScaleRamp kind={SCALE_KINDS[scaleIndex] ?? 'deviation'} />
                          <p className={`mt-2 text-gray-700 ${BODY}`}>{scale.v}</p>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-3">
                  {compareShared.map((item) => (
                    <div
                      key={item.title}
                      className="h-full rounded-2xl border border-paper-line bg-white p-6"
                    >
                      <p className="text-lg font-semibold text-heading">{item.title}</p>
                      <p className={`mt-2 text-gray-700 ${BODY}`}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* Methodische Grenzen und GenDG: immer sichtbar, nie im
                Kleingedruckten — vor Fachpublikum ein Vertrauensargument. */}
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-card border border-accent-border bg-accent-soft p-7">
                <p className="text-sm font-semibold text-accent-strong">
                  {t('compare.caveatTitle')}
                </p>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  {compareCaveats.map((item) => (
                    <div key={item.title}>
                      <p className="text-base font-semibold text-heading">{item.title}</p>
                      <p className={`mt-1.5 text-gray-700 ${BODY}`}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-card border border-paper-line bg-paper p-7">
                <p className={`text-gray-700 ${BODY}`}>{t('compare.gendg')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            DAS PRINZIP — kurz, mit dem Kernsatz als Zitat
        ================================================================ */}
        <section
          id="prinzip"
          className="scroll-mt-[var(--chapterbar-offset,148px)] mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-0 lg:py-24"
        >
          <Reveal width="100%">
            <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-14">
              <SectionHeader
                caption={t('principle.caption')}
                title={t('principle.title')}
                align="left"
              />
              <p className={LEAD}>{t('principle.lead')}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {principleCards.map((card, index) => (
              <Reveal
                key={card.title}
                width="100%"
                delay={index * REVEAL_STAGGER}
                className={STRETCH}
              >
                <div className="h-full rounded-card border border-paper-line bg-white p-7">
                  <h3 className="text-xl font-semibold tracking-tight text-heading">
                    {card.title}
                  </h3>
                  <p className={`mt-3 text-gray-600 ${BODY}`}>{card.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-5 rounded-card border border-paper-line bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-600">
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
          {/* Der Kernsatz aus dem Beratungsabschnitt — bewusst OHNE Monatszahl:
              die Untergrenze ist nur fuer die Methylierungspanels belegt. */}
          <figure className="mt-5 flex flex-col gap-5 rounded-card border border-accent-border bg-accent-soft p-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <blockquote className="text-lg font-semibold leading-relaxed tracking-tight text-heading lg:text-xl">
              {t('hero.consultLine')}
            </blockquote>
            <Link
              to="/epigenetics/grundlagen"
              className="inline-flex items-center gap-1.5 text-base font-semibold text-accent-strong"
            >
              {t('journey.basicsLink')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </figure>
        </section>

        {/* ================================================================
            WERTE VERSTEHEN — Kurzfassung; vollstaendig auf /grundlagen.
            Die id bleibt: #werte-verstehen ist extern verlinkt.
        ================================================================ */}
        <section
          id="werte-verstehen"
          className="scroll-mt-[var(--chapterbar-offset,148px)] border-y border-paper-line bg-white"
        >
          <div className="mx-auto grid max-w-container gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-0 lg:py-16">
            <div>
              <SectionHeader caption={t('basics.caption')} title={t('basics.title')} align="left" />
              <p className={`mt-4 ${LEAD}`}>{t('basics.lead')}</p>
              <Link
                to="/epigenetics/grundlagen#werte-verstehen"
                className="mt-6 inline-flex items-center gap-1.5 text-base font-semibold text-accent-strong"
              >
                {t('journey.basicsLink')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {concepts.map((item) => (
                <li
                  key={item.num}
                  className="flex items-start gap-4 rounded-2xl border border-paper-line bg-paper p-5"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-semibold text-accent-strong ring-1 ring-inset ring-accent-border">
                    {item.num}
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-heading">{item.title}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-gray-600">
                      {item.key}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================================================================
            ABLAUF — nach Ort gruppiert
        ================================================================ */}
        <section
          id="ablauf"
          className="scroll-mt-[var(--chapterbar-offset,148px)] mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-0 lg:py-24"
        >
          <Reveal width="100%">
            <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-14">
              <SectionHeader
                caption={t('workflow.caption')}
                title={t('workflow.title')}
                align="left"
              />
              <p className={LEAD}>{t('workflow.lead')}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-[3fr_2fr_1fr] lg:gap-4">
            {WORKFLOW_GROUPS.map((group) => (
              <div key={group.key}>
                <p
                  className={`border-t-2 pt-3 text-xs font-semibold uppercase tracking-[0.16em] ${
                    group.lab
                      ? 'border-accent text-accent-strong'
                      : 'border-accent text-accent-strong'
                  }`}
                >
                  {t(`journey.${group.key}`)}
                </p>
                <ol
                  start={group.from + 1}
                  className={`mt-4 grid gap-3 ${
                    group.to - group.from === 3
                      ? 'lg:grid-cols-3'
                      : group.to - group.from === 2
                        ? 'lg:grid-cols-2'
                        : ''
                  }`}
                >
                  {steps.slice(group.from, group.to).map((step, index) => (
                    <li
                      key={group.from + index}
                      className={`flex gap-4 rounded-2xl border p-5 lg:block ${
                        group.lab
                          ? 'border-accent-border bg-accent-soft'
                          : 'border-paper-line bg-white'
                      }`}
                    >
                      <span className="text-2xl font-semibold tracking-tight text-accent-strong">
                        {String(group.from + index + 1).padStart(2, '0')}
                      </span>
                      <p className="text-[15px] leading-relaxed text-gray-700 lg:mt-2">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* SO WIRD DARAUS EINE BERATUNG — allgemeine Fassung ohne Monatszahl. */}
        <ConsultSteps />

        {/* ================================================================
            STUDIENLAGE — Kurzfassung; Texte und Quellen auf /studienlage
        ================================================================ */}
        <section
          id="studienlage"
          className="scroll-mt-[var(--chapterbar-offset,148px)] mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-0 lg:py-24"
        >
          <Reveal width="100%">
            <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-14">
              <SectionHeader
                caption={t('evidence.caption')}
                title={t('evidence.title')}
                align="left"
              />
              <p className={LEAD}>{t('evidence.lead')}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {[
              { title: t('evidence.establishedTitle'), items: established, Icon: Check, ok: true },
              { title: t('evidence.preliminaryTitle'), items: preliminary, Icon: Minus, ok: false },
            ].map(({ title, items, Icon, ok }) => (
              <div
                key={title}
                className={`rounded-card border p-7 ${
                  ok ? 'border-accent-border bg-white' : 'border-paper-line bg-white'
                }`}
              >
                <h3 className="flex items-center gap-3 text-lg font-semibold text-heading">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      ok ? 'bg-accent-soft text-accent-strong' : 'bg-paper-deep text-gray-700'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {items.length}
                  </span>
                  {title}
                </h3>
                <ul className="mt-4 divide-y divide-paper-line border-t border-paper-line">
                  {items.map((item) => (
                    <li key={item.title} className="py-3.5 text-base font-semibold text-heading">
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button
              to="/epigenetics/studienlage"
              variant="secondary"
              className="!py-2.5 !pl-7 !pr-2.5"
            >
              {t('journey.evidenceLink')}
              <span
                aria-hidden="true"
                className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-line text-white"
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
            <p className="text-sm text-gray-600">
              {t('hero.trustEvidence', {
                established: established.length,
                preliminary: preliminary.length,
              })}
            </p>
          </div>
        </section>

        {/* ================================================================
            FAQ — natives <details>, kein JavaScript noetig
        ================================================================ */}
        <section
          id="fragen"
          className="scroll-mt-[var(--chapterbar-offset,148px)] border-y border-paper-line bg-white"
        >
          <div className="mx-auto grid max-w-container gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-0 lg:py-24">
            <Reveal width="100%">
              <SectionHeader caption={t('faq.caption')} title={t('faq.title')} align="left" />
              <p className={`mt-4 ${LEAD}`}>{t('faq.lead')}</p>
              <div className="brand-ring relative mt-8 hidden rounded-card bg-brand-deep p-7 text-white lg:block">
                <p className="text-lg font-semibold tracking-tight">{t('journey.askTitle')}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-white/80">
                  {t('journey.askText')}
                </p>
                <Button href="#inquiry" variant="light" size="sm" className="mt-5">
                  {t('journey.askCta')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </Reveal>
            <div className="divide-y divide-paper-line border-y border-paper-line">
              {faq.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-heading [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 text-accent-strong">
                      <ChevronDown
                        className="h-4 w-4 motion-safe:transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </span>
                  </summary>
                  <div className={`max-w-[68ch] pb-6 text-gray-600 ${BODY}`}>{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            UNTERLAGEN — Kurzfassung; alle Blaetter auf /unterlagen
        ================================================================ */}
        <section
          id="downloads"
          className="scroll-mt-[var(--chapterbar-offset,148px)] mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-0 lg:py-20"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionHeader
                caption={t('downloads.caption')}
                title={t('downloads.title')}
                align="left"
              />
              <p className={`mt-3 max-w-[60ch] ${LEAD}`}>{t('downloads.sub')}</p>
            </div>
            <a
              href={zipHref}
              download
              hrefLang={resourceLanguageFromPath(t('downloads.zipFile'))}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-deep px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-deep/90"
            >
              <Download className="h-4 w-4" />
              {t('downloads.zipLabel')}
              <ResourceLanguageBadge
                language={resourceLanguageFromPath(t('downloads.zipFile'))}
                format="zip"
                className="text-white/80"
              />
            </a>
          </div>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {hubSheets.map((sheet) => (
              <li key={sheet.num}>
                <a
                  href={`${ASSET_BASE}${sheet.file}`}
                  download
                  hrefLang={resourceLanguageFromPath(sheet.file)}
                  className="group flex h-full items-center gap-4 rounded-2xl border border-paper-line bg-white p-5 transition-colors hover:border-accent"
                >
                  <span className="inline-flex h-12 w-10 shrink-0 items-center justify-center rounded-lg border border-paper-line bg-paper text-accent-strong">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-heading">
                      {sheet.title}
                    </span>
                    <span className="block text-sm text-gray-600">
                      {sheet.meta} ·{' '}
                      <ResourceLanguageBadge language={resourceLanguageFromPath(sheet.file)} />
                    </span>
                  </span>
                  <Download
                    className="h-5 w-5 shrink-0 text-accent-strong"
                    aria-label={t('downloads.btn')}
                  />
                </a>
              </li>
            ))}
          </ul>
          <Link
            to="/epigenetics/unterlagen"
            className="mt-6 inline-flex items-center gap-1.5 text-base font-semibold text-accent-strong"
          >
            {t('journey.docsLink')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>

        {/* ================================================================
            KONDITIONEN ANFRAGEN + RECHTLICHER HINWEIS (Schritt 4)
        ================================================================ */}
        <section
          id="inquiry"
          className="scroll-mt-[var(--chapterbar-offset,148px)] border-t border-paper-line bg-white"
        >
          <div className="mx-auto grid max-w-container gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-0 lg:py-24">
            <div>
              <SectionHeader
                caption={t('contact.caption')}
                title={t('contact.title')}
                align="left"
              />
              <p className={`mt-4 ${LEAD}`}>{t('contact.sub')}</p>
              {/* Die beiden direkten Kontaktwege; eine Nummer fuer die ganze
                  Website (Owner-Entscheidung 2026-10-16, wie main@475fefd). */}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="mailto:contact@polarisdx.net"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
                >
                  contact@polarisdx.net
                </a>
                <a
                  href="tel:+4915175011699"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
                >
                  +49 151 75011699
                </a>
              </div>
              {/* Bezugsweg fuer Einzelpersonen (main@41e158b, Owner-Entscheidung
                  2026-10-16). Umrissknopf statt primaer: die Angebotsanfrage
                  bleibt die lauteste Aufforderung des Kapitels. Klicks zaehlt
                  useOutboundTracking ueber OUTBOUND_DOMAINS. */}
              <div className="mt-8 rounded-card border border-accent-border bg-accent-soft p-6 sm:p-7">
                <p className={LABEL}>{t('contact.partnerCaption')}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-text-heading">
                  {t('contact.partnerTitle')}
                </h3>
                <p className={`mt-3 text-gray-700 ${BODY}`}>{t('contact.partnerText')}</p>
                <p className="mt-3 text-sm text-gray-600">{t('contact.partnerMeta')}</p>
                <a
                  href="https://www.nduclinic.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-brand-primary bg-white px-5 py-3 text-base font-semibold text-brand-deep transition-colors hover:border-brand-deep hover:text-brand-primary"
                >
                  {t('contact.partnerCta')}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{t('contact.partnerNewTab')}</span>
                </a>
              </div>
              <p className="mt-8 t-small">{t('contact.note')}</p>
              <p className="mt-3 text-sm text-gray-600">{t('contact.lab')}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
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
              </div>
            </div>
            <div className="rounded-card border border-paper-line bg-white p-6 shadow-card sm:p-8">
              <EpigeneticsInquiryForm />
            </div>
          </div>
        </section>

        <NextSteps
          label={tCommon('area.nextLabel')}
          previous={{
            to: '/',
            kicker: tCommon('area.back'),
            title: t('breadcrumb.home'),
          }}
          next={{
            to: '/epigenetics/grundlagen',
            kicker: tCommon('area.stepOf', { n: 1, total: 4 }),
            title: t('journey.understand.title'),
            text: t('journey.understand.text'),
          }}
          cta={
            portfolio
              ? {
                  title: portfolio.title,
                  text: t('principle.pdfHint'),
                  action: (
                    <a
                      href={`${ASSET_BASE}${portfolio.file}`}
                      download
                      hrefLang={resourceLanguageFromPath(portfolio.file)}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-brand-deep transition hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      {t('downloads.btn')}
                      <ResourceLanguageBadge
                        language={resourceLanguageFromPath(portfolio.file)}
                        className="font-normal text-gray-600"
                      />
                    </a>
                  ),
                }
              : undefined
          }
        />

        <MobileActionBar
          label={
            gemerkt.length > 0
              ? tCommon('area.saved', { count: gemerkt.length })
              : (chips[2]?.value ?? t('hero.ctaDocs'))
          }
          action={
            <a
              href="#inquiry"
              data-cta-role="EPIGENETICS_INQUIRY"
              data-cta-source="epigenetics"
              data-cta-section="mobile-bar"
              className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-brand-deep"
            >
              {t('hero.ctaQuote')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          }
        />
      </div>
    </PageTransition>
  )
}

export default EpigeneticsPage
