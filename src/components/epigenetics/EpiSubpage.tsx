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
import { ArrowLeft } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema } from '../seo'
import { Breadcrumbs } from '../ui/Breadcrumbs'
import PageTransition from '../ui/PageTransition'
import Reveal from '../ui/Reveal'
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
  children: ReactNode
}

const EpiSubpage = ({ path, title, caption, lead, children }: EpiSubpageProps) => {
  const { t } = useTranslation('epigenetics')
  useScrollDepth('epigenetics')
  // Acht Sprachen zeigen diesen Namensraum auf Englisch. Ohne Auszeichnung
  // liest ein tschechischer Screenreader den englischen Text mit tschechischer
  // Phonetik vor — WCAG 3.1.2, Level AA.
  const englishFallback = isEnglishFallback(t('_translationStatus', { defaultValue: '' }))

  const seoTitle = t(title)
  // Der Einleitungssatz ist der beste vorhandene Beschreibungstext. Google
  // schneidet bei rund 160 Zeichen ab — kuerzen statt einen neuen Satz in zehn
  // Sprachen einzufuehren.
  const rawDescription = t(lead)
  const seoDescription =
    rawDescription.length > 158 ? `${rawDescription.slice(0, 155).trimEnd()}…` : rawDescription

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

        {children}

        {/* Jede Vertiefungsseite endet dort, wo sie herkommt. Ein einziger Weg
            zurueck — die Programmseite traegt die Anfrage, nicht diese Seite. */}
        <section className="mx-auto max-w-container px-4 py-14 lg:px-0 lg:py-16">
          <Link
            to="/epigenetics"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t('breadcrumb.current')}
          </Link>
        </section>
      </div>
    </PageTransition>
  )
}

export default EpiSubpage
