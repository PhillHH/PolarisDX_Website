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
 * SC-028 (Owner 2026-11-13): die Seite steht im Raster der Startseite (sub.css) — dunkle Bühne
 * mit Musterbefund-Fächer, Abschnittsköpfe mit Kennzeile, Spalten und Zeilen statt Karten.
 * Texte, Reihenfolge, Anker, Filter, Merkliste und Formular sind unverändert.
 */

import EventBand from '../components/events/EventBand'
import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowUpRight, ChevronDown, Download } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema, createFAQSchema } from '../components/seo'
import type { FAQItem } from '../components/seo'
import EpigeneticsPanels from '../components/sections/EpigeneticsPanels'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import ResourceLanguageBadge from '../components/ui/ResourceLanguageBadge'
import { resourceLanguageFromPath } from '../lib/resourceLanguage'
import { CONSULT_ID } from '../components/befund/ConsultSteps'
import { ScaleRamp } from '../components/befund/ScaleRamp'
import { useScrollDepth } from '../lib/useScrollDepth'
// Die Schnittstelle beschrieb `quote_request` als "der Weg Angebot anfragen
// wurde begonnen" und wurde nirgends ausgeloest. Ohne dieses Ereignis laesst
// sich nicht sagen, ob der umgebaute Anfrageweg traegt.
import { track } from '../lib/tracking'
import { panelsUrl } from '../lib/shop'
import { useMerkliste } from '../lib/merkliste'
import EpigeneticsInquiryForm from '../components/epigenetics/EpigeneticsInquiryForm'
import { BEFUND_IMAGES, BEFUND_IMAGE_SIZE } from '../assets/epigenetics/befundImages'
import SubHead from '../components/sub/SubHead'
import SubPage from '../components/sub/SubPage'
import SubStage from '../components/sub/SubStage'
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

// Die drei Deckblätter im Fächer der Bühne (Schmuck; alle sechs stehen bei den Analysen).
const STAGE_COVERS = ['healthy-aging', 'stress-monitor', 'metabolic-health']

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

  const inquiryHref = epigeneticsInquiryHref(context.panel, panelGroup)

  return (
    <PageTransition>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
        ogImage="/og-epigenetics.jpg"
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

      <SubPage page="epigenetics">
        <div data-epigenetics-hub="true" data-route-id="epigenetics">
          {/* ================================================================
            BUEHNE (AP34 PT34.2b, SC-003)
            Genau eine Aufgabe: zu den sechs Analysen. Der Anfrageweg steht
            daneben, als zweite, leisere Schaltflaeche — er ist der einzige
            `source=epigenetics`-Link der Seite (e2e PT15.1); alle uebrigen
            Anfrage-Verweise springen per #inquiry in denselben Abschnitt.
        ================================================================ */}
          <SubStage
            titleId="area-stage-title"
            breadcrumbs={[
              { label: t('breadcrumb.home'), href: '/' },
              { label: t('breadcrumb.current') },
            ]}
            eyebrow={t('hero.eyebrow')}
            title={t('hero.title')}
            lead={<p>{t('hero.claim')}</p>}
            actions={
              <>
                <a href="#analysen" className="sc025-button">
                  {t('hero.ctaDocs')}
                  <ArrowRight aria-hidden="true" />
                </a>
                <Link
                  to={inquiryHref}
                  onClick={() =>
                    track({ name: 'quote_request', panels: gemerkt, quelle: 'landing' })
                  }
                  className="sc025-underlink"
                >
                  <span>{t('hero.ctaQuote')}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
                {/* SC-008: Panel-Shop (panels.polarisdx.net) fuer Endkunden;
                  Klickzaehlung ueber OUTBOUND_DOMAINS wie in der Kopfzeile. */}
                <a
                  href={panelsUrl(i18n.language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-shop="panels"
                  className="sc025-underlink"
                >
                  <span>{t('hero.ctaShop')}</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </>
            }
            /* Drei Musterbefund-Deckblätter als Fächer — Schmuck, die Blätter stehen mit
               Alternativtext bei den sechs Analysen. Kleiner als die Überschrift, also nie LCP. */
            aside={
              <div className="sc028-fan" aria-hidden="true">
                {STAGE_COVERS.map((slug) =>
                  BEFUND_IMAGES[slug] ? (
                    <img
                      key={slug}
                      src={BEFUND_IMAGES[slug].src}
                      srcSet={`${BEFUND_IMAGES[slug].src} 640w, ${BEFUND_IMAGES[slug].src2x} 1200w`}
                      sizes="(min-width: 901px) 325px, 240px"
                      width={BEFUND_IMAGE_SIZE.width}
                      height={BEFUND_IMAGE_SIZE.height}
                      loading="lazy"
                      decoding="async"
                      alt=""
                    />
                  ) : null,
                )}
              </div>
            }
            fold
            /* Die vier Eckdaten des Programms aus hero.chips. */
            facts={chips.slice(0, 4).map((chip) => ({ label: chip.label, value: chip.value }))}
            factsLabel={tCommon('area.factsLabel')}
          />
          <EventBand />

          <div className="mt-8 lg:mt-10">
            <AreaNav
              label={tCommon('nav.epigenetics')}
              items={epigeneticsAreaItems(tCommon)}
              currentKey="overview"
              actions={
                <>
                  {gemerkt.length > 0 ? (
                    <a href="#merkliste" className="sc028-navbtn">
                      {tCommon('area.saved', { count: gemerkt.length })}
                    </a>
                  ) : null}
                  <a
                    href="#inquiry"
                    data-cta-role="EPIGENETICS_INQUIRY"
                    data-cta-source="epigenetics"
                    data-cta-section="area-nav"
                    className="sc028-navbtn sc028-navbtn-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
          <section data-sub-section className="sc025-s">
            <div className="sc025-inner">
              <Reveal width="100%">
                <SubHead
                  kicker={t('journey.caption')}
                  title={t('journey.title')}
                  lead={t('journey.lead')}
                />
              </Reveal>
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
            data-sub-section
            className="sc025-s sc025-tint sc028-s-top scroll-mt-[var(--chapterbar-offset,148px)]"
          >
            <span id="musterbefunde" className="block scroll-mt-[var(--chapterbar-offset,148px)]" />
            <EpigeneticsPanels
              activePanel={context.panel}
              focus={panelGroup}
              groups={compareGroups}
              title={t('hero.chooseTitle')}
              filter={
                <div className="sc028-filter">
                  <p>{t('compare.filter.label')}</p>
                  <ul>
                    <li>
                      <Link
                        to={epigeneticsHubHref({ panel: context.panel }, 'analysen')}
                        aria-current={panelGroup === null ? 'true' : undefined}
                      >
                        {t('compare.filter.all')}
                        <span>{compareRows.length}</span>
                      </Link>
                    </li>
                    {EPIGENETICS_FOCUS_KEYS.map((key) => (
                      <li key={key}>
                        <Link
                          to={epigeneticsHubHref({ panel: context.panel, focus: key }, 'analysen')}
                          aria-current={panelGroup === key ? 'true' : undefined}
                        >
                          {t(`compare.filter.options.${key}`)}
                          <span>{groupCount(key)}</span>
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
          <section
            id="vergleich"
            data-sub-section
            className="sc025-s sc025-tint sc028-s-bottom scroll-mt-[var(--chapterbar-offset,148px)]"
          >
            <div className="sc025-inner">
              <details
                ref={vergleichRef}
                open={panelGroup !== null || undefined}
                className="sc028-compare"
              >
                <summary className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
                  <span>
                    <span className="sc025-kicker">{t('compare.caption')}</span>
                    <span className="sc025-mid">{t('compare.title')}</span>
                  </span>
                  <ChevronDown aria-hidden="true" />
                </summary>
                <div className="sc028-compare-body">
                  <p className="sc028-lead">{t('compare.lead')}</p>
                  {panelGroup ? (
                    <div className="sc028-filter-state">
                      <p>
                        {t('compare.filter.label')}{' '}
                        <b>{t(`compare.filter.options.${panelGroup}`)}</b>
                      </p>
                      <Link
                        to={epigeneticsHubHref({ panel: context.panel }, 'vergleich')}
                        className="sc025-underlink"
                      >
                        <span>{t('compare.filter.all')}</span>
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
                    className="sc028-table-wrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    <table className="sc028-table">
                      <caption className="sr-only">{t('compare.title')}</caption>
                      <thead>
                        <tr>
                          {compareCols.map((col) => (
                            <th key={col} scope="col">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRows.map((row) => (
                          <tr key={row[0]}>
                            {row.map((cell, cellIndex) => (
                              <td key={`${row[0]}-${cellIndex}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {visibleRows.length === 0 ? (
                    <p className="sc028-lead">{t('compare.filter.empty')}</p>
                  ) : null}
                  <p className="sc028-hint lg:hidden">{t('compare.scrollHint')}</p>

                  <p className="sc028-label">{t('basics.scaleTitle')}</p>
                  <dl className="sc028-scales">
                    {scales.map((scale, scaleIndex) => (
                      <div key={`vergleich-${scale.k}`}>
                        <dt>{scale.k}</dt>
                        <dd>
                          <ScaleRamp kind={SCALE_KINDS[scaleIndex] ?? 'deviation'} />
                          <p className="sc025-text">{scale.v}</p>
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="sc025-cols3 sc028-shared">
                    {compareShared.map((item, index) => (
                      <div key={item.title}>
                        <span className="sc028-n" aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <p className="sc028-coltitle">{item.title}</p>
                        <p className="sc025-text">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </details>

              {/* Methodische Grenzen und GenDG: immer sichtbar, nie im
                Kleingedruckten — vor Fachpublikum ein Vertrauensargument. */}
              <p className="sc028-h3">{t('compare.caveatTitle')}</p>
              <div className="sc025-cols3 sc028-cols2">
                {compareCaveats.map((item) => (
                  <div key={item.title}>
                    <p className="sc028-coltitle">{item.title}</p>
                    <p className="sc025-text">{item.text}</p>
                  </div>
                ))}
              </div>
              <p className="sc025-note">{t('compare.gendg')}</p>
            </div>
          </section>

          {/* ================================================================
            DAS PRINZIP — kurz, mit dem Kernsatz als Zitat
        ================================================================ */}
          <section
            id="prinzip"
            data-sub-section
            className="sc025-s sc025-dark scroll-mt-[var(--chapterbar-offset,148px)]"
          >
            <div className="sc025-inner">
              <Reveal width="100%">
                <SubHead
                  kicker={t('principle.caption')}
                  title={t('principle.title')}
                  lead={t('principle.lead')}
                />
              </Reveal>
              <div className="sc025-cols3">
                {principleCards.map((card, index) => (
                  <div key={card.title} className="rv">
                    <span className="sc028-n" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3>{card.title}</h3>
                    <p className="sc025-text">{card.text}</p>
                  </div>
                ))}
              </div>
              <div className="sc028-practice">
                <p className="sc025-label">{t('principle.practice.title')}</p>
                <ul>
                  {practiceItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              {/* Der Kernsatz aus dem Beratungsabschnitt — bewusst OHNE Monatszahl:
              die Untergrenze ist nur fuer die Methylierungspanels belegt. */}
              <figure className="sc028-pull">
                <blockquote>{t('hero.consultLine')}</blockquote>
                <Link to="/epigenetics/grundlagen" className="sc025-underlink">
                  <span>{t('journey.basicsLink')}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </figure>
            </div>
          </section>

          {/* ================================================================
            WERTE VERSTEHEN — Kurzfassung; vollstaendig auf /grundlagen.
            Die id bleibt: #werte-verstehen ist extern verlinkt.
        ================================================================ */}
          <section
            id="werte-verstehen"
            data-sub-section
            className="sc025-s scroll-mt-[var(--chapterbar-offset,148px)]"
          >
            <div className="sc025-inner">
              <Reveal width="100%">
                <SubHead
                  kicker={t('basics.caption')}
                  title={t('basics.title')}
                  lead={t('basics.lead')}
                />
              </Reveal>
              <ol className="sc028-concepts">
                {concepts.map((item) => (
                  <li key={item.num} className="rv">
                    <span className="sc028-n">{item.num}</span>
                    <span className="sc028-concept-title">{item.title}</span>
                    <span className="sc025-text">{item.key}</span>
                  </li>
                ))}
              </ol>
              <div className="sc028-links">
                <Link to="/epigenetics/grundlagen#werte-verstehen" className="sc025-underlink">
                  <span>{t('journey.basicsLink')}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          {/* ================================================================
            ABLAUF — nach Ort gruppiert
        ================================================================ */}
          <section
            id="ablauf"
            data-sub-section
            className="sc025-s sc025-tint scroll-mt-[var(--chapterbar-offset,148px)]"
          >
            <div className="sc025-inner">
              <Reveal width="100%">
                <SubHead
                  kicker={t('workflow.caption')}
                  title={t('workflow.title')}
                  lead={t('workflow.lead')}
                />
              </Reveal>
              <div className="sc028-flow">
                {WORKFLOW_GROUPS.map((group) => (
                  <div key={group.key} className="rv" data-lab={group.lab ? 'true' : undefined}>
                    <p className="sc025-kicker">{t(`journey.${group.key}`)}</p>
                    <ol
                      start={group.from + 1}
                      style={{ ['--sc028-n' as string]: group.to - group.from }}
                    >
                      {steps.slice(group.from, group.to).map((step, index) => (
                        <li key={group.from + index}>
                          <span aria-hidden="true">
                            {String(group.from + index + 1).padStart(2, '0')}
                          </span>
                          <p>{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SO WIRD DARAUS EINE BERATUNG — allgemeine Fassung ohne Monatszahl; dieselben Texte
              wie ConsultSteps (Musterbefund-Seiten), hier im Raster der Seite. */}
          <section
            id={CONSULT_ID}
            data-sub-section
            className="sc025-s scroll-mt-[var(--chapterbar-offset,148px)]"
          >
            <div className="sc025-inner">
              <Reveal width="100%">
                <SubHead kicker={t('consult.caption')} title={t('consult.title')} />
              </Reveal>
              <ol className="sc025-cols3 sc028-consult">
                {[
                  { title: t('consult.before.title'), text: t('consult.before.text') },
                  { title: t('consult.during.title'), text: t('consult.during.general') },
                  { title: t('consult.after.title'), text: t('consult.after.general') },
                ].map((step, index) => (
                  <li key={step.title} className="rv">
                    <span className="sc028-n" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3>{step.title}</h3>
                    <p className="sc025-text">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ================================================================
            STUDIENLAGE — Kurzfassung; Texte und Quellen auf /studienlage
        ================================================================ */}
          <section
            id="studienlage"
            data-sub-section
            className="sc025-s sc025-dark scroll-mt-[var(--chapterbar-offset,148px)]"
          >
            <div className="sc025-inner">
              <Reveal width="100%">
                <SubHead
                  kicker={t('evidence.caption')}
                  title={t('evidence.title')}
                  lead={t('evidence.lead')}
                />
              </Reveal>
              <div className="sc028-evidence">
                {[
                  { title: t('evidence.establishedTitle'), items: established, ok: true },
                  { title: t('evidence.preliminaryTitle'), items: preliminary, ok: false },
                ].map(({ title, items, ok }) => (
                  <div key={title} className="rv" data-ok={ok ? 'true' : undefined}>
                    <h3>
                      <b>{items.length}</b>
                      {title}
                    </h3>
                    <ul>
                      {items.map((item) => (
                        <li key={item.title}>{item.title}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="sc025-note">
                {t('hero.trustEvidence', {
                  established: established.length,
                  preliminary: preliminary.length,
                })}
              </p>
              <div className="sc028-links">
                <Link to="/epigenetics/studienlage" className="sc025-underlink">
                  <span>{t('journey.evidenceLink')}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          {/* ================================================================
            FAQ — natives <details>, kein JavaScript noetig
        ================================================================ */}
          <section
            id="fragen"
            data-sub-section
            className="sc025-s scroll-mt-[var(--chapterbar-offset,148px)]"
          >
            <div className="sc025-inner sc028-two">
              <Reveal width="100%">
                <span className="sc025-kicker">{t('faq.caption')}</span>
                <h2 className="sc025-h2 sc028-side-h2">{t('faq.title')}</h2>
                <p className="sc028-lead">{t('faq.lead')}</p>
                <div className="sc028-card sc028-ask">
                  <h3>{t('journey.askTitle')}</h3>
                  <p className="sc025-text">{t('journey.askText')}</p>
                  <a href="#inquiry" className="sc025-underlink">
                    <span>{t('journey.askCta')}</span>
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
              <div className="sc028-details">
                {faq.map((item) => (
                  <details key={item.q}>
                    <summary className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
                      <span>{item.q}</span>
                      <ChevronDown aria-hidden="true" />
                    </summary>
                    <div>{item.a}</div>
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
            data-sub-section
            className="sc025-s sc025-dark scroll-mt-[var(--chapterbar-offset,148px)]"
          >
            <div className="sc025-inner">
              <Reveal width="100%">
                <SubHead
                  kicker={t('downloads.caption')}
                  title={t('downloads.title')}
                  lead={t('downloads.sub')}
                />
              </Reveal>
              <ul className="sc028-docs">
                {hubSheets.map((sheet) => (
                  <li key={sheet.num} className="rv">
                    <a
                      href={`${ASSET_BASE}${sheet.file}`}
                      download
                      hrefLang={resourceLanguageFromPath(sheet.file)}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-dark"
                    >
                      <span className="sc028-n" aria-hidden="true">
                        {sheet.num}
                      </span>
                      <b>{sheet.title}</b>
                      <span className="sc025-text">{sheet.desc}</span>
                      <span className="sc028-docs-meta">
                        {sheet.meta} ·{' '}
                        <ResourceLanguageBadge language={resourceLanguageFromPath(sheet.file)} />
                      </span>
                      <span className="sc028-docs-go">
                        {t('downloads.btn')}
                        <Download aria-hidden="true" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="sc028-links">
                <a
                  href={zipHref}
                  download
                  hrefLang={resourceLanguageFromPath(t('downloads.zipFile'))}
                  className="sc025-underlink"
                >
                  <span>{t('downloads.zipLabel')}</span>
                  <ResourceLanguageBadge
                    language={resourceLanguageFromPath(t('downloads.zipFile'))}
                    format="zip"
                  />
                  <Download aria-hidden="true" />
                </a>
                <Link to="/epigenetics/unterlagen" className="sc025-underlink">
                  <span>{t('journey.docsLink')}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          {/* ================================================================
            KONDITIONEN ANFRAGEN + RECHTLICHER HINWEIS (Schritt 4)
        ================================================================ */}
          <section
            id="inquiry"
            data-sub-section
            className="sc025-s scroll-mt-[var(--chapterbar-offset,148px)]"
          >
            <div className="sc025-inner">
              <SubHead
                kicker={t('contact.caption')}
                title={t('contact.title')}
                lead={t('contact.sub')}
              />
              <div className="sc028-form-grid">
                <div className="sc028-form">
                  <EpigeneticsInquiryForm />
                </div>
                <div>
                  {/* Die beiden direkten Kontaktwege; eine Nummer fuer die ganze
                  Website (Owner-Entscheidung 2026-10-16, wie main@475fefd). */}
                  <div className="sc028-direct">
                    <a href="mailto:contact@polarisdx.net">contact@polarisdx.net</a>
                    <a href="tel:+4915175011699">+49 151 75011699</a>
                  </div>
                  {/* Bezugsweg fuer Einzelpersonen (main@41e158b, Owner-Entscheidung
                  2026-10-16). Leiser als die Angebotsanfrage: die bleibt die lauteste
                  Aufforderung des Kapitels. Klicks zaehlt useOutboundTracking ueber
                  OUTBOUND_DOMAINS. */}
                  <div className="sc028-card">
                    <p className="sc025-label">{t('contact.partnerCaption')}</p>
                    <h3>{t('contact.partnerTitle')}</h3>
                    <p className="sc025-text">{t('contact.partnerText')}</p>
                    <p className="sc028-fine">{t('contact.partnerMeta')}</p>
                    <a
                      href="https://www.nduclinic.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sc025-underlink"
                    >
                      <span>{t('contact.partnerCta')}</span>
                      <ArrowUpRight aria-hidden="true" />
                      <span className="sr-only">{t('contact.partnerNewTab')}</span>
                    </a>
                  </div>
                  <p className="sc028-legal">{t('contact.note')}</p>
                  <p className="sc028-legal">{t('contact.lab')}</p>
                  <div className="sc028-links">
                    <Link to="/diagnostics/longevity" className="sc025-underlink">
                      <span>{t('links.longevity')}</span>
                      <ArrowRight aria-hidden="true" />
                    </Link>
                    <Link to="/downloads" className="sc025-underlink">
                      <span>{t('links.downloads')}</span>
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
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
                        className="inline-flex min-h-[44px] items-center gap-2 bg-white px-5 text-sm font-semibold text-brand-deep transition hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
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
                className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 bg-white px-4 text-sm font-semibold text-brand-deep"
              >
                {t('hero.ctaQuote')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            }
          />
        </div>
      </SubPage>
    </PageTransition>
  )
}

export default EpigeneticsPage
