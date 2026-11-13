import EventBand from '../components/events/EventBand'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import { ArrowRight, Download, FileArchive, FileText, Lock, Unlock } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import SubPage from '../components/sub/SubPage'
import SubStage from '../components/sub/SubStage'
import ResourceLanguageBadge from '../components/ui/ResourceLanguageBadge'
import { formatDate } from '../lib/localeFormat'
import ResourceGateForm from '../components/resources/ResourceGateForm'
import {
  buildResourceCenter,
  formatResourceSize,
  LAUNCH_VISIBLE_RESOURCES,
  resourceFormatLabel,
  type ResourceCard,
} from '../content/resources/resourceCenter'

/**
 * Resource Center (AP19 PT19.2).
 *
 * Die Seite fuehrt KEINE eigene Dokumentliste mehr. Bis PT19.1 stand hier ein
 * separater Katalog (`src/content/downloads.json`) mit genau zwei Eintraegen —
 * waehrend zwanzig reale, freigegebene Unterlagen nur ueber die
 * Epigenetik-Strecke erreichbar waren. Beides sind jetzt Ansichten auf
 * dieselbe Wahrheit: `resourceInventory.ts`.
 *
 * Was daraus folgt und bewusst so ist:
 *  - Der entlinkte IglooPro-Flyer erscheint nicht. Er ist `NOT_LAUNCH_VISIBLE`
 *    und bleibt es, bis AP14 einen freigegebenen Ersatz hat.
 *  - Titel und Beschreibungen kommen aus bereits freigegebenen x10-Schluesseln
 *    der Epigenetik-Strecke. Es wurde kein Dokumenttext neu erfunden.
 *  - Groesse, Typ, Seitenzahl und Datum stammen aus dem gemessenen Inventar.
 *    Wo eine Datei kein Datum traegt, steht keines — die drei bildbasierten
 *    Flyer bekommen keine erfundene Jahreszahl.
 *  - Ein gegatetes Asset rendert niemals seine `/downloads/...`-URL. Die CTA
 *    traegt die Asset-ID in den Gate-Flow. Heute existiert kein gegatetes
 *    Asset; der Zweig ist vorbereitet und wird von PT19.3 angeschlossen.
 */

const ResourceCardView = ({ card }: { card: ResourceCard }) => {
  const { t, i18n } = useTranslation(['downloads', 'epigenetics'])
  const location = useLocation()
  const [gateOpen, setGateOpen] = useState(false)
  const { resource, variant } = card
  const format = resourceFormatLabel(variant)
  const gated = resource.deliveryClass === 'GATED'

  return (
    <li
      data-resource-id={resource.id}
      data-resource-access={resource.deliveryClass}
      data-language-fallback={card.languageFallback ? 'true' : 'false'}
      className="group relative flex h-full flex-col justify-between rounded-xl border border-paper-line bg-white p-7 transition-all hover:-translate-y-1 hover:border-accent/40"
    >
      <div>
        <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-white">
          {format === 'ZIP' ? (
            <FileArchive className="h-5 w-5" aria-hidden />
          ) : (
            <FileText className="h-5 w-5" aria-hidden />
          )}
        </span>

        <h3 className="mb-3 text-lg font-medium leading-snug text-heading">
          {card.labelKey ? t(card.labelKey) : resource.id}
        </h3>
        {card.descriptionKey && (
          <p className="mb-4 text-sm leading-6 text-gray-600">{t(card.descriptionKey)}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Frei vs. gegated wird benannt, nicht nur eingefaerbt — sonst
              haengt die Aussage an der Farbwahrnehmung. */}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium ${
              // Gemessen mit axe: `text-accent` auf `bg-accent/10` liegt bei
              // 3,32:1 und faellt bei 12px durch. `accent-strong` erreicht
              // 4,86:1 auf derselben Flaeche.
              gated ? 'bg-paper-line text-heading' : 'bg-accent-soft text-accent-strong'
            }`}
          >
            {gated ? (
              <Lock className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Unlock className="h-3.5 w-3.5" aria-hidden />
            )}
            {t(gated ? 'downloads:access.gated' : 'downloads:access.free')}
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 font-medium text-gray-600">
            {format}
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 font-medium text-gray-600">
            {formatResourceSize(variant.bytes, i18n.language)}
          </span>
          <ResourceLanguageBadge
            language={variant.language}
            format={format === 'ZIP' ? 'zip' : 'pdf'}
            className="rounded-full bg-gray-100 px-2.5 py-0.5 font-medium text-gray-600"
          />
          {/* Datum nur, wenn die Datei eines traegt. */}
          {variant.date && (
            <span className="text-gray-600">{formatDate(variant.date, i18n.language)}</span>
          )}
        </div>

        {card.languageFallback && (
          <p className="mt-3 text-xs leading-5 text-gray-600" data-language-notice>
            {t('downloads:languageNotice')}
          </p>
        )}
      </div>

      {/* `hover:text-accent` misst auf `accent-soft` 3,59:1 und faellt bei
          14px durch — im Hover-Zustand pruefte axe genau das. */}
      <div className="mt-6">
        {card.href ? (
          <a
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            hrefLang={variant.language}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-paper-line py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <Download className="h-4 w-4" aria-hidden />
            {t('downloads:downloadBtn')}
            <span className="sr-only"> — {card.labelKey ? t(card.labelKey) : resource.id}</span>
          </a>
        ) : card.gate ? (
          // Kein `href` auf die Datei: die physische Adresse darf nicht ins
          // Markup, sonst waere das Gate per Rechtsklick umgehbar. Das
          // Formular bekommt die Asset-ID, nie den Pfad; den Link liefert
          // erst der Server nach erfolgreicher Einreichung.
          <button
            type="button"
            onClick={() => setGateOpen((open) => !open)}
            aria-expanded={gateOpen}
            data-gate-asset={card.gate.assetId}
            data-gate-locale={card.gate.requestedLocale}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-paper-line py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <Lock className="h-4 w-4" aria-hidden />
            {t('downloads:gate.submit')}
            <span className="sr-only"> — {card.labelKey ? t(card.labelKey) : resource.id}</span>
          </button>
        ) : null}
        {gated && gateOpen && card.gate && (
          <div className="mt-4">
            <ResourceGateForm
              assetId={card.gate.assetId}
              assetLanguage={card.gate.assetLanguage}
              resourceLabel={card.labelKey ? t(card.labelKey) : resource.id}
              originRoute={location.pathname}
              onClose={() => setGateOpen(false)}
            />
          </div>
        )}
      </div>
    </li>
  )
}

const DownloadsPage = () => {
  const { t, i18n } = useTranslation(['downloads', 'common', 'epigenetics', 'vitd3spray'])
  const groups = buildResourceCenter(i18n.language)

  return (
    <PageTransition>
      <SEOHead
        title={t('downloads:seo.title')}
        description={t('downloads:seo.description')}
        structuredData={[
          createBreadcrumbSchema(
            [
              { name: t('common:nav.home'), url: '/' },
              { name: t('downloads:title'), url: '/downloads' },
            ],
            i18n.language,
          ),
        ]}
      />

      <SubPage>
        <SubStage
          breadcrumbs={[
            { label: t('downloads:home', 'Home'), href: '/' },
            { label: t('downloads:title') },
          ]}
          eyebrow={t('downloads:subtitle')}
          title={t('downloads:title')}
          lead={<p>{t('downloads:introText')}</p>}
          fold
          chips={[
            t('downloads:chip_free', 'Kostenlos & ohne Anmeldung'),
            t('downloads:chip_pdf', 'PDF-Format'),
            t('downloads:chip_updated', 'Sofort verfügbar'),
          ]}
          actions={
            <Link
              to="/contact"
              className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-dark focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
            >
              {t('downloads:hero_cta', 'Beratung anfragen')}
              <ArrowRight aria-hidden="true" />
            </Link>
          }
          facts={[
            {
              label: t('downloads:vc_docs_label', 'Dokumente'),
              value: String(LAUNCH_VISIBLE_RESOURCES.length),
            },
            { label: t('downloads:vc_groups_label'), value: String(groups.length) },
            {
              label: t('downloads:vc_free_label', 'Download'),
              value: t('downloads:vc_free_value', 'Kostenlos'),
            },
          ]}
        />
        <div className="sc025-s sc025-tint" data-sub-section>
          <div className="sc025-inner sc028-body">
            <div className="space-y-14">
              {/* `buildResourceCenter` liefert ausschliesslich nicht-leere
                  Gruppen — eine leere Ueberschrift kann hier nicht entstehen. */}
              {groups.map((group) => (
                <section
                  key={group.id}
                  data-resource-group={group.id}
                  aria-labelledby={`resource-group-${group.id}`}
                  className="mb-0"
                >
                  <h2 id={`resource-group-${group.id}`} className="sc025-mid sc028-group-title">
                    {t(group.labelKey)}
                  </h2>
                  <Reveal width="100%">
                    <ul className="grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
                      {group.cards.map((card) => (
                        <ResourceCardView key={card.resource.id} card={card} />
                      ))}
                    </ul>
                  </Reveal>
                </section>
              ))}
            </div>

            {/* Schluss: eine Aufforderung auf Nacht-Navy */}
            <div className="sc028-sales">
              <div>
                <b>{t('downloads:cta_title', 'Unterlage nicht gefunden?')}</b>
                <p>
                  {t(
                    'downloads:cta_text',
                    'Unser Team stellt Ihnen weitere Datenblätter, Zertifikate oder eine individuelle Produktberatung bereit.',
                  )}
                </p>
              </div>
              <Link
                to="/contact"
                className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-dark focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
              >
                {t('downloads:cta_button', 'Beratung anfragen')}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className="sc028-links">
              <Link to="/igloo-pro" className="sc025-underlink">
                <span>{t('downloads:link_igloo', 'Zum IglooPro System')}</span>
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/diagnostics" className="sc025-underlink">
                <span>{t('downloads:link_services', 'Diagnostik-Services')}</span>
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/epigenetics" className="sc025-underlink">
                <span>{t('downloads:link_epigenetics', 'Epigenetik und Genetik')}</span>
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/vitamin-d3-spray" className="sc025-underlink">
                <span>{t('vitd3spray:hero.title', 'Vitamin D3+K2 Spray')}</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
        {/* SC-021 Nachtrag: am Seitenende — direkt unter der Buehne wurde das Band-Foto zum LCP-Bild. */}
        <EventBand />
      </SubPage>
    </PageTransition>
  )
}

export default DownloadsPage
