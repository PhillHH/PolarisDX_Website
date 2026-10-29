/**
 * AktuellSection — das „Aktuell"-Band der Startseite: nächster Termin und die Online-Shops.
 *
 * SC-019 (Owner 2026-10-27, „Die Medica ist wichtig … mache ein Event-Teaser draus"):
 * Die Flaeche loest `PanelsPromoSection` (SC-009) ab. Links der naechste belegte Termin
 * aus `src/data/events.ts` (Highlight-Reihenfolge, sonst der naechste kommende), rechts die
 * zeitlich begrenzte Panel-Shop-Aktion (bis PANELS_PROMO_LAST_DAY). Beide Teile sind
 * SC-020 (Owner 2026-10-27, „Der Hinweis zu unserem Shop ist weg"): die Shop-Kachel steht
 * immer — Praxis-Shop (HCL-015) und Panel-Shop (HCL-016) mit dem Netto-Hinweis; waehrend der
 * Aktion traegt sie deren Eyebrow und Titel. Ohne Termin fuellt sie die ganze Breite.
 * Das fruehere Shop-Band (ShopTeaserSection) ist damit abgeloest.
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
import { isPanelsPromoActive, panelsUrl, shopUrl } from '../../lib/shop'

const CTA =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-brand-deep transition hover:-translate-y-0.5 motion-reduce:hover:translate-y-0'

const AktuellSection = () => {
  const { t, i18n } = useTranslation(['home', 'events'])
  const event = getNextHomeEvent()
  const promo = isPanelsPromoActive()

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
        <div className={`grid gap-5 ${event ? 'lg:grid-cols-5' : ''}`}>
          {event && (
            <article
              data-home-event={event.id}
              className="rounded-band bg-brand-deep p-7 text-white sm:p-10 lg:col-span-3 lg:p-12"
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
          <article
            data-home-shops
            className={`flex flex-col justify-between rounded-band border border-accent-border bg-white p-7 sm:p-10 lg:p-12 ${event ? 'lg:col-span-2' : ''}`}
          >
            <div>
              <p className="t-eyebrow">
                {promo ? t('shop_teaser.promo_eyebrow') : t('shop_teaser.eyebrow')}
              </p>
              <h3 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight text-heading">
                {promo ? t('shop_teaser.promo_title') : t('shop_teaser.title')}
              </h3>
              <p className="mt-3 text-sm text-gray-600">{t('shop_teaser.note_short')}</p>
            </div>
            {/* flex-wrap: eine Pille rutscht als Ganzes in die naechste Zeile, statt dass ihr Text umbricht. */}
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={panelsUrl(i18n.language)}
                data-shop="panels"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-deep px-6 py-3 font-semibold text-white hover:bg-brand-deep/90"
              >
                {t('shop_teaser.cta_panels')}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={shopUrl(i18n.language)}
                data-shop="practice"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-paper-line px-6 py-3 font-semibold text-brand-deep hover:bg-paper"
              >
                {t('shop_teaser.cta')}
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default AktuellSection
