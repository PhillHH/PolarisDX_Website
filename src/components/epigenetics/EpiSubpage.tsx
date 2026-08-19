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
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema } from '../seo'
import { Breadcrumbs } from '../ui/Breadcrumbs'
import ChapterNav, { type Chapter } from '../ui/ChapterNav'
import PageTransition from '../ui/PageTransition'
import Reveal from '../ui/Reveal'
import { LABEL, metaDescription, VERTIEFUNGEN } from './tokens'
import { trackEvent } from '../../lib/tracking'
import { isEnglishFallback } from '../../lib/translationStatus'
import { useScrollDepth } from '../../lib/useScrollDepth'

interface EpiSubpageProps {
  /** Pfad ohne Sprachpraefix, z.B. '/epigenetics/grundlagen'. */
  path: string
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
  source: string
  children: ReactNode
}

const EpiSubpage = ({
  path,
  title,
  caption,
  lead,
  leadExtra,
  chapters,
  source,
  children,
}: EpiSubpageProps) => {
  const { t } = useTranslation('epigenetics')
  // Der Weiterlesen-Titel ist Bedienoberflaeche und liegt im Namensraum
  // `common` — dort ist er in allen zehn Sprachen echt uebersetzt, waehrend
  // `epigenetics` in acht davon auf Englisch laeuft.
  const { t: tCommon } = useTranslation('common')
  useScrollDepth('epigenetics')
  // Acht Sprachen zeigen diesen Namensraum auf Englisch. Ohne Auszeichnung
  // liest ein tschechischer Screenreader den englischen Text mit tschechischer
  // Phonetik vor — WCAG 3.1.2, Level AA.
  const englishFallback = isEnglishFallback(t('_translationStatus', { defaultValue: '' }))

  const seoTitle = t(title)
  // Der Einleitungssatz ist der beste vorhandene Beschreibungstext; auf der
  // Seite steht er unveraendert. Fuer die Suchmaschine kuerzt bzw. ergaenzt
  // ihn metaDescription aus bereits freigegebenen Saetzen — siehe tokens.ts.
  const rawDescription = t(lead)
  const seoDescription = metaDescription(rawDescription, leadExtra ? t(leadExtra) : undefined)

  return (
    <PageTransition>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        ogImage="/og-epigenetics.jpg"
        structuredData={[
          createBreadcrumbSchema([
            { name: t('breadcrumb.home'), url: '/' },
            { name: t('breadcrumb.current'), url: '/epigenetics' },
            { name: seoTitle, url: path },
          ]),
        ]}
      />

      <div className="bg-slate-50 text-gray-900" lang={englishFallback ? 'en' : undefined}>
        {/* Kopf der Vertiefungsseiten. Deutlich flacher als der Hero der
            Programmseite: hier ist nichts auszuwaehlen, hier wird gelesen.
            Derselbe Verlauf haelt die Strecke optisch zusammen. */}
        <section className="bg-gradient-to-br from-brand-primary via-brand-deep to-[#203864] text-white">
          <div className="mx-auto max-w-container px-4 pb-14 pt-28 lg:px-0 lg:pb-16 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <Breadcrumbs
                variant="dark"
                className="mb-4"
                items={[
                  { label: t('breadcrumb.home'), href: '/' },
                  { label: t('breadcrumb.current'), href: '/epigenetics' },
                  { label: seoTitle },
                ]}
              />
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
                {t(caption)}
              </p>
              <h1 className="max-w-[26ch] text-3xl font-medium tracking-tight sm:text-4xl lg:text-[44px] lg:leading-[1.15]">
                {seoTitle}
              </h1>
              <p className="mt-5 max-w-[68ch] text-lg leading-relaxed text-white/85 lg:text-xl lg:leading-relaxed">
                {rawDescription}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Dieselbe Kapitelleiste wie auf der Programmseite und den
            Musterbefunden. Sie loest zwei Dinge auf einmal:

            - Der Rueckweg steht jetzt DURCHGEHEND im Bild, nicht erst nach
              1.000 Woertern am Seitenende. Die eigenstaendige Zurueck-Pille
              dort ist deshalb entfallen und nicht verdoppelt worden.
            - Die Leiste schreibt beim Scrollen `--chapterbar-offset` ans
              Wurzelelement (ChapterNav.tsx:184). Erst dadurch stimmen die
              Sprungziele: ScrollToHash in App.tsx liest dieselbe Variable.
              Ohne Leiste war sie auf diesen Seiten nie gesetzt.

            Auf dem Aktionsplatz steht der Anfrageweg. Die drei Seiten endeten
            zuvor ausschliesslich in einem Weg zurueck: wer sich auf der
            Studienlage ueberzeugt hatte — also am weitesten gelesen hatte —
            musste zurueck auf die Programmseite und dort bis zum Abschluss
            scrollen. Mit genau einem Eintrag in `actions` bleibt es eine
            einzige Schaltflaeche in Akzentfarbe, durchgehend im Bild. */}
        <ChapterNav
          chapters={chapters}
          chaptersLabel={t('befund.navChapters')}
          back={{ to: '/epigenetics', label: t('befund.navBack') }}
          actions={[
            {
              to: '/contact?intent=quote&source=epigenetics#kontaktformular',
              label: t('hero.ctaQuote'),
              onClick: () => trackEvent('epigenetics_request', { method: 'form', source }),
            },
          ]}
        />

        {children}

        {/* Weiterlesen: die beiden jeweils ANDEREN Vertiefungsseiten.
            Ohne diesen Block war jede der drei Seiten von den beiden anderen
            nur ueber den Umweg Programmseite erreichbar — gemessen fuehrten
            alle internen Verweise in <main> ausschliesslich dorthin zurueck.
            Die Liste kommt aus VERTIEFUNGEN und laesst die aktuelle Seite
            ueber ihren `source`-Schluessel weg; eine Seite kann sich damit
            nicht selbst verlinken. */}
        <section className="mx-auto max-w-container px-4 py-14 lg:px-0 lg:py-16">
          <h2 className={LABEL}>{tCommon('read_more')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {VERTIEFUNGEN.filter((v) => v.key !== source).map((v) => (
              <Link
                key={v.key}
                to={v.to}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-primary hover:shadow-card"
              >
                <span className={LABEL}>{t(v.captionKey)}</span>
                <span className="mt-2 inline-flex items-start gap-1.5 text-lg font-semibold tracking-tight text-text-heading">
                  {t(v.titleKey)}
                  <ArrowRight
                    className="mt-1.5 h-4 w-4 shrink-0 text-brand-primary transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default EpiSubpage
