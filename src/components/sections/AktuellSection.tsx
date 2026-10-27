/**
 * AktuellSection — das „Aktuell"-Band der Startseite: nächster Termin und Panel-Shop.
 *
 * SC-019 (Owner 2026-10-27, „Die Medica ist wichtig … mache ein Event-Teaser draus"):
 * Die Flaeche loest `PanelsPromoSection` (SC-009) ab. Links der naechste belegte Termin
 * aus `src/data/events.ts` (Highlight-Reihenfolge, sonst der naechste kommende), rechts die
 * zeitlich begrenzte Panel-Shop-Aktion (bis PANELS_PROMO_LAST_DAY). Beide Teile sind
 * unabhaengig: ohne Termin bleibt die Panel-Kachel, ohne Aktion bleibt der Termin.
 * Rendert nichts, wenn beides fehlt (HomePage zeigt dann wieder das Shop-Band).
 *
 * Navy-Flaeche ohne Bild (Startseiten-HTML- und Bildbudget); kein Autoplay, kein Slider.
 * Der Praxis-Shop steht seit SC-015 in der Kopfzeile und braucht hier keine zweite Aktion.
 * Claims: Termin = belegte Stammdaten (EVENTS-CONTRACT), Panels = HCL-016.
 */
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { getNextHomeEvent } from '../../data/events'
import { formatEventRange } from '../../lib/eventDates'
import { isPanelsPromoActive, panelsUrl } from '../../lib/shop'

const CTA =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-brand-deep transition hover:-translate-y-0.5 motion-reduce:hover:translate-y-0'

const AktuellSection = () => {
  const { t, i18n } = useTranslation(['home', 'events'])
  const event = getNextHomeEvent()
  const promo = isPanelsPromoActive()

  if (!event && !promo) return null

  return (
    <section
      aria-labelledby="aktuell-title"
      data-home-aktuell
      className="bg-paper px-4 pb-16 pt-12 lg:px-0 lg:pb-20 lg:pt-16"
    >
      <div className="rv mx-auto max-w-container">
        <h2 id="aktuell-title" className="sr-only">
          {t('aktuell.title')}
        </h2>
        <div className={`grid gap-5 ${event && promo ? 'lg:grid-cols-5' : ''}`}>
          {event && (
            <article
              data-home-event={event.id}
              className="rounded-band bg-brand-deep px-6 py-9 text-white sm:px-10 lg:col-span-3 lg:py-12"
            >
              <p className="t-eyebrow-dark">
                {t('aktuell.event_eyebrow')} · {t(`events:items.${event.id}.tag`, '')}
              </p>
              <h3 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
                {t(`events:items.${event.id}.title`)}
              </h3>
              {/* Ohne Symbole: zwei Inline-SVGs kosteten gemessen ~150 B gzip im Startseiten-HTML. */}
              <p className="mt-4 text-white/85">
                <time dateTime={event.date}>
                  {formatEventRange(i18n.language, event.date, event.endDate)}
                </time>
                {' · '}
                {event.location}
                {t(`events:items.${event.id}.short`, '') &&
                  ` · ${t(`events:items.${event.id}.short`)}`}
              </p>
              <Link to="/events" className={`${CTA} mt-7`}>
                {t('aktuell.event_cta')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          )}
          {promo && (
            <article
              data-home-panels-promo
              className="flex flex-col justify-between rounded-band border border-accent-border bg-white px-6 py-9 sm:px-10 lg:col-span-2 lg:py-12"
            >
              <div>
                <p className="t-eyebrow">{t('shop_teaser.promo_eyebrow')}</p>
                <h3 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight text-heading">
                  {t('shop_teaser.promo_title')}
                </h3>
              </div>
              <a
                href={panelsUrl(i18n.language)}
                data-shop="panels"
                data-claim-id="HCL-016"
                className="mt-7 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-brand-deep px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
              >
                {t('shop_teaser.cta_panels')}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          )}
        </div>
      </div>
    </section>
  )
}

export default AktuellSection
