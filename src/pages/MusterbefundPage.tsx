/**
 * MusterbefundPage — /epigenetics/musterbefund/<slug>
 *
 * Der vollstaendige Musterbefund als Webseite. Das PDF bleibt als Download
 * erhalten, aber der Inhalt steht hier: alle Seiten, alle Tabellen, und die
 * Diagramme als SVG aus den Werten gerechnet statt als Bild.
 *
 * FACHLICH/RECHTLICH ABGESTIMMT — bitte nicht ohne Ruecksprache aendern:
 * - Saemtliche Werte sind frei erfundene Beispieldaten. Das steht im Deckblatt,
 *   im Hinweisband und noch einmal in den Rechtstexten am Ende. Alle drei
 *   Stellen gehoeren auf die Seite.
 * - Der Laborpartner wird nirgends namentlich genannt.
 * - Kein CE-/IVDR-Zeichen: es sind Labordienstleistungen, keine IVD.
 * - Keine Preise, keine Befundlaufzeit.
 *
 * Die Inhalte liegen als JSON in src/content/befunde/ und sind aus den
 * Quell-PDFs abgeleitet. Nach einem Neubau der PDFs dort nachziehen.
 */

import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Download } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import PageTransition from '../components/ui/PageTransition'
import { BefundBlock, type Block } from '../components/befund/BefundBlocks'
import { BEFUNDE, BEFUND_ORDER, RADAR_VALUES } from '../content/befunde'

const ASSET_BASE = '/downloads/epigenetics/'

const MusterbefundPage = () => {
  const { slug = '' } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation('epigenetics')
  const lang = i18n.language?.startsWith('de') ? 'de' : 'en'

  const befund = BEFUNDE[slug]?.[lang] ?? BEFUNDE[slug]?.de
  const samples = Array.isArray(t('samples.items', { returnObjects: true }))
    ? (t('samples.items', { returnObjects: true }) as { slug: string; panel: string; file: string }[])
    : []
  const meta = samples.find((s) => s.slug === slug)

  if (!befund) {
    return (
      <PageTransition>
        {/* notFound laesst den SSR-Server mit echtem HTTP 404 antworten.
            noindex steht bewusst daneben: der 404-Mechanismus existiert noch
            nicht in jedem Stand, und ohne ihn waere diese Seite sonst
            indexierbar. */}
        <SEOHead
          title={t('befund.notFoundTitle')}
          description={t('befund.notFoundText')}
          notFound
          noindex
        />
        <div className="mx-auto max-w-container px-4 py-24 lg:px-0 lg:py-32">
          <h1 className="text-3xl font-semibold tracking-tight text-text-heading">
            {t('befund.notFoundTitle')}
          </h1>
          <p className="mt-4 max-w-[62ch] text-lg text-gray-600">{t('befund.notFoundText')}</p>
          <Link
            to="/epigenetics#musterbefunde"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('befund.backToAll')}
          </Link>
        </div>
      </PageTransition>
    )
  }

  const blocks = (befund.blocks ?? []) as Block[]
  const others = BEFUND_ORDER.filter((s) => s !== slug)

  return (
    <PageTransition>
      <SEOHead
        title={t('befund.seoTitle', { panel: befund.panel })}
        description={t('befund.seoDescription', { panel: befund.panel })}
        ogImage="/og-epigenetics.jpg"
        structuredData={[
          createBreadcrumbSchema(
            [
              { name: t('breadcrumb.home'), url: '/' },
              { name: t('breadcrumb.current'), url: '/epigenetics' },
              { name: befund.panel, url: `/epigenetics/musterbefund/${slug}` },
            ],
            i18n.language,
          ),
        ]}
      />

      <div className="bg-white text-text-heading">
        <div className="bg-brand-deep">
          <div className="mx-auto max-w-container px-4 pt-28 lg:px-0 lg:pt-32">
            <Breadcrumbs
              variant="dark"
              items={[
                { label: t('breadcrumb.home'), href: '/' },
                { label: t('breadcrumb.current'), href: '/epigenetics' },
                { label: befund.panel },
              ]}
            />
          </div>
        </div>

        {blocks.map((block, index) => (
          <BefundBlock
            key={`${block.type}-${index}`}
            block={block}
            radarValues={RADAR_VALUES[slug]}
            scrollHint={t('compare.scrollHint')}
          />
        ))}

        {/* Hinweisband und Weg zurueck. Der Beispieldaten-Hinweis steht hier ein
            zweites Mal, weil die Seite lang ist und die Rechtstexte oben am
            Deckblatt beim Lesen laengst aus dem Blick sind. */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <p className="max-w-[80ch] text-sm leading-relaxed text-gray-500">
                {t('samples.note')}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {meta ? (
                  <a
                    href={`${ASSET_BASE}${meta.file}`}
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
                  >
                    <Download className="h-4 w-4" />
                    {t('befund.pdfCta')}
                  </a>
                ) : null}
                <Link
                  to="/epigenetics#musterbefunde"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('befund.backToAll')}
                </Link>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-xs font-medium text-gray-500">{t('befund.othersTitle')}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {others.map((other) => {
                  const label = BEFUNDE[other]?.[lang]?.panel ?? BEFUNDE[other]?.de?.panel ?? other
                  return (
                    <Link
                      key={other}
                      to={`/epigenetics/musterbefund/${other}`}
                      className="inline-flex items-center rounded-full border border-slate-300 px-5 py-2.5 text-base font-medium text-brand-deep transition-colors hover:border-brand-primary hover:bg-slate-50"
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default MusterbefundPage
