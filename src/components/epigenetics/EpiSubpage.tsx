/**
 * EpiSubpage — gemeinsamer Rahmen der Vertiefungsseiten der Epigenetik-Strecke.
 *
 * Die Programmseite /epigenetics trug zehn Kapitel und rund 17.700px. Drei
 * davon beantworten keine Auswahlfrage, sondern eine Nachlesefrage:
 * Grundlagen, Studienlage, Unterlagen. Sie stehen jetzt als eigene Seiten —
 * so, wie es die Vergleichsanbieter halten (eigener Menuepunkt "Our Science",
 * eigenes Download-Center).
 *
 * WICHTIG — kein neuer Text: alle drei Seiten setzen sich ausschliesslich aus
 * Schluesseln zusammen, die im Namensraum `epigenetics` bereits in allen zehn
 * Sprachen stehen. Auch Seitentitel und Beschreibung fuer die Suchmaschine
 * kommen aus vorhandenen Schluesseln. Damit kostet der Umbau keine
 * Uebersetzungsrunde und keine erneute fachliche Freigabe.
 *
 * Die Vorgaben der Programmseite gelten unveraendert weiter: kein Partnername,
 * kein CE-Zeichen, keine Preise, keine Befundlaufzeit.
 */

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema } from '../seo'
import type { Chapter } from '../ui/ChapterNav'
import PageTransition from '../ui/PageTransition'
import { getVertiefung, metaDescription, type VertiefungKey } from './tokens'
import { useScrollDepth } from '../../lib/useScrollDepth'
import { useMerkliste } from '../../lib/merkliste'
import { epigeneticsInquiryHref } from '../../lib/epigeneticsContext'
import AreaStage from '../area/AreaStage'
import AreaNav from '../area/AreaNav'
import NextSteps, { type StepLink } from '../area/NextSteps'
import MobileActionBar from '../area/MobileActionBar'
import { PageToc, PageTocMobile } from '../area/PageToc'
import { epigeneticsAreaItems, epigeneticsJourney } from '../area/epigeneticsArea'

interface EpiSubpageProps {
  /** Bestehender Locale-Schluessel fuer den Seitentitel, z.B. 'basics.title'. */
  title: string
  /** Bestehender Locale-Schluessel fuer den Kicker ueber der Ueberschrift. */
  caption: string
  /** Bestehender Locale-Schluessel fuer den Einleitungssatz. */
  lead: string
  /**
   * Optionaler zweiter, bereits freigegebener Satz. Er wird NUR an die
   * Beschreibung fuer die Suchmaschine angehaengt, und nur wenn der
   * Einleitungssatz allein zu kurz waere — auf der Seite selbst steht er nicht.
   */
  leadExtra?: string
  /**
   * Kapitel dieser Seite. Die Beschriftungen kommen aus bereits uebersetzten
   * Schluesseln; die zugehoerigen Abschnitte muessen dieselbe id tragen UND
   * `scroll-mt-[var(--chapterbar-offset,148px)]`, sonst landet das Sprungziel
   * hinter Seitenkopf und Leiste.
   */
  chapters: Chapter[]
  /**
   * Kennung dieser Seite im Messereignis, z.B. 'grundlagen'.
   *
   * Sie steht bewusst NICHT in der URL. Der Anfragelink traegt unveraendert
   * `?intent=quote&source=epigenetics`, weil ContactForm.tsx die Herkunft mit
   * `params.get('source') === 'epigenetics'` exakt vergleicht — ein Wert wie
   * `epigenetics-grundlagen` haette den Epigenetik-Modus des Formulars still
   * abgeschaltet und den Leser wieder im IglooPro-Fragebogen abgesetzt.
   * Welche der drei Seiten die Anfrage ausgeloest hat, gehoert in die Messung,
   * nicht in den Herkunftsvertrag.
   */
  source: VertiefungKey
  children: ReactNode
}

const EpiSubpage = ({
  title,
  caption,
  lead,
  leadExtra,
  chapters,
  source,
  children,
}: EpiSubpageProps) => {
  const { t, i18n } = useTranslation('epigenetics')
  const { t: tCommon } = useTranslation('common')
  useScrollDepth('epigenetics')
  const { slugs: gemerkt } = useMerkliste()
  const vertiefung = getVertiefung(source)
  const path = vertiefung.to

  const seoTitle = t(title)
  const rawDescription = t(lead)
  const seoDescription = metaDescription(rawDescription, leadExtra ? t(leadExtra) : undefined)

  // Genau EIN Anfragelink je Seite traegt `campaign=<seite>` (Vertrag PT15.2:
  // sichtbar auf 390–1440 px, eindeutig in <main>). Er steht in der Buehne.
  // Bereichsleiste und Seitenende fuehren in denselben Abschnitt, mit einer
  // eigenen, lesbaren Kampagnenmarke — so bleibt messbar, welcher Platz traegt.
  const inquiryHref = epigeneticsInquiryHref(null, null, source)
  const inquiryFrom = (platz: string) => epigeneticsInquiryHref(null, null, `${source}-${platz}`)

  // „Naechster Schritt" folgt der Strecke: Grundlagen → Analysen (Schritt 2),
  // Studienlage → Unterlagen → Musterbefunde (Schritt 3).
  const journey = epigeneticsJourney(t)
  const stepKicker = (n: number) => tCommon('area.stepOf', { n, total: journey.length })
  // Nachbarn in der Strecke. Nur die aktuelle Seite wird aufgeloest.
  const back = (to: string, title: string): StepLink => ({
    to,
    kicker: tCommon('area.back'),
    title,
  })
  const step = (n: number): StepLink => ({
    to: journey[n - 1].to,
    kicker: stepKicker(n),
    title: journey[n - 1].title,
    text: journey[n - 1].text,
  })
  const neighbours =
    source === 'grundlagen'
      ? { previous: back('/epigenetics', tCommon('area.overview')), next: step(2) }
      : source === 'studienlage'
        ? {
            previous: back(getVertiefung('grundlagen').to, tCommon('footer.epi_basics')),
            next: {
              to: getVertiefung('unterlagen').to,
              kicker: tCommon('area.next'),
              title: tCommon('footer.epi_docs'),
              text: t('downloads.sub'),
            },
          }
        : {
            previous: back(getVertiefung('studienlage').to, tCommon('footer.epi_evidence')),
            next: step(3),
          }

  return (
    <PageTransition>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        ogImage="/og-epigenetics.jpg"
        structuredData={[
          createBreadcrumbSchema(
            [
              { name: t('breadcrumb.home'), url: '/' },
              { name: t('breadcrumb.current'), url: '/epigenetics' },
              { name: seoTitle, url: path },
            ],
            i18n.language,
          ),
        ]}
      />

      <div
        className="bg-paper text-heading"
        data-epigenetics-subpage={source}
        data-route-id={vertiefung.routeId}
      >
        {/* AP34 PT34.2c (SC-003): Lese-Buehne ohne Bild (LCP-Bildbudget der
            Vertiefungen ist 0 Byte), Bereichsleiste statt Kapitel-Chips,
            Inhaltsverzeichnis in der linken Spalte, am Ende „Naechster
            Schritt". Die Grundlagen sind Schritt 1 der Strecke und zeigen
            die Schrittanzeige. */}
        <AreaStage
          breadcrumbs={[
            { label: t('breadcrumb.home'), href: '/' },
            { label: t('breadcrumb.current'), href: '/epigenetics' },
            { label: seoTitle },
          ]}
          // Die Grundlagen sind Schritt 1 der Strecke; der Kicker sagt es, der
          // Weg zu Schritt 2 steht in „Naechster Schritt" am Seitenende.
          eyebrow={source === 'grundlagen' ? `${stepKicker(1)} · ${t(caption)}` : t(caption)}
          title={seoTitle}
          lead={<p>{rawDescription}</p>}
          actions={
            <Link
              to={inquiryHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full px-6 font-semibold ring-1 ring-inset ring-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {t('hero.ctaQuote')}
            </Link>
          }
        />

        <AreaNav
          label={tCommon('nav.epigenetics')}
          items={epigeneticsAreaItems(tCommon)}
          currentKey={source}
          actions={
            <>
              {gemerkt.length > 0 ? (
                <span className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-heading">
                  {tCommon('area.saved', { count: gemerkt.length })}
                </span>
              ) : null}
              <Link
                to={inquiryFrom('leiste')}
                data-cta-section="area-nav"
                data-cta-source="epigenetics"
                className="inline-flex h-10 items-center rounded-full bg-accent-strong px-5 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {t('hero.ctaQuote')}
              </Link>
            </>
          }
        />

        <div className="mx-auto max-w-container px-4 pt-10 sm:px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14 lg:px-0">
          <aside className="lg:pt-16">
            <PageToc chapters={chapters} label={tCommon('area.onThisPage')} />
          </aside>
          <div className="min-w-0">
            <PageTocMobile chapters={chapters} label={tCommon('area.onThisPage')} />
            {children}
          </div>
        </div>

        <NextSteps
          label={tCommon('area.nextLabel')}
          previous={neighbours.previous}
          next={neighbours.next}
          cta={{
            title: t('contact.title'),
            text: t('contact.sub'),
            action: (
              <Link
                to={inquiryFrom('ende')}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold text-brand-deep hover:bg-accent-soft"
              >
                {t('hero.ctaQuote')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ),
          }}
        />

        <MobileActionBar
          label={
            gemerkt.length > 0
              ? tCommon('area.saved', { count: gemerkt.length })
              : source === 'grundlagen'
                ? stepKicker(1)
                : seoTitle
          }
          action={
            <Link
              to={inquiryFrom('mobil')}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-brand-deep"
            >
              {t('hero.ctaQuote')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
      </div>
    </PageTransition>
  )
}

export default EpiSubpage
