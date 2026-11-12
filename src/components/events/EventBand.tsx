/**
 * EventBand — Messe-Band unter der Bühne (SC-021 Nachtrag, Owner 2026-11-02, Idee 4).
 *
 * Navy-Karte (`rounded-band`) mit Foto aus dem Motiv-Pool, Einladung, Datum/Halle/Stand aus den
 * SC-019-Termindaten, Countdown und dem Weg zum Standtermin. Serverseitig gerendert, kein JS.
 * Zeigt den nächsten belegten Termin (`getNextHomeEvent`), nach der MEDICA also den DGI-Kongress;
 * ohne Termin rendert das Band nichts. Steht auf der Startseite und den Inhaltsseiten
 * (Diagnostik, Leistungen, Epigenetik, IglooPro, Blog, Downloads, Über uns, Support) — nicht auf
 * Termin- und Kontaktseite (dort ist es Ziel), nicht auf Rechtstexten und Consumer-Seiten.
 *
 * SC-021 Nachtrag 12 (Owner 2026-11-06, „können wir das reduzieren?“): `variant="strip"` für die
 * Startseite — eine schmale Navy-Zeile ohne Foto und Beschreibung: Eyebrow, Titel, Datum,
 * Countdown, Knopf. Die Inhaltsseiten behalten das volle Band.
 */
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { EVENT_BAND } from '../../assets/home/homeImages'
import { getEventStatus, getNextHomeEvent, toEventDay } from '../../data/events'
import { daysUntil, formatEventRange } from '../../lib/eventDates'
import { Button } from '../ui/Button'

const EventBand = ({ variant = 'full' }: { variant?: 'full' | 'strip' }) => {
  const { t, i18n } = useTranslation(['common', 'events'])
  const event = getNextHomeEvent()
  if (!event) return null
  const today = toEventDay(new Date())
  const ongoing = getEventStatus(event, today) === 'ongoing'
  const days = daysUntil(event.date, today)
  const short = t(`events:items.${event.id}.short`, '')

  if (variant === 'strip') {
    return (
      <section
        aria-labelledby="event-band-title"
        data-event-band={event.id}
        data-event-band-variant="strip"
        className="mx-auto w-full max-w-container px-4 pt-10 sm:px-6 lg:px-0 lg:pt-14"
      >
        <div className="flex flex-col gap-5 rounded-band bg-brand-deep px-6 py-6 text-white shadow-card lg:flex-row lg:items-center lg:gap-8 lg:px-8">
          <div className="min-w-0 flex-1">
            <p className="t-eyebrow-dark">
              {t('event_band.eyebrow')} · {t(`events:items.${event.id}.title`)}
            </p>
            <h2
              id="event-band-title"
              className="mt-1 text-balance text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {t('event_band.title', { location: event.location })}
            </h2>
            <p className="mt-2 text-sm text-white/85 sm:text-base">
              <time dateTime={event.date}>
                {formatEventRange(i18n.language, event.date, event.endDate)}
              </time>
              {short && ` · ${short}`}
            </p>
          </div>
          <p className="text-sm text-white/80 lg:text-right">
            {ongoing || days <= 0 ? (
              <span className="block text-3xl font-semibold tracking-tight text-white">
                {t('event_band.now')}
              </span>
            ) : (
              <>
                <span className="block text-4xl font-semibold tracking-tight text-white">
                  {days}
                </span>
                {days === 1 ? t('event_band.day_label') : t('event_band.days_label')}
              </>
            )}
          </p>
          <Button to="/contact" variant="light" size="sm" className="group whitespace-nowrap">
            {t('event_popup.meet')}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-1 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section
      aria-labelledby="event-band-title"
      data-event-band={event.id}
      className="mx-auto w-full max-w-container px-4 pt-10 sm:px-6 lg:px-0 lg:pt-14"
    >
      <div className="grid gap-6 overflow-hidden rounded-band bg-brand-deep p-5 text-white shadow-card sm:p-6 lg:grid-cols-[minmax(0,420px)_1fr_auto] lg:items-center lg:gap-9 lg:p-7">
        <picture>
          <source type="image/avif" srcSet={EVENT_BAND.avif} sizes={EVENT_BAND.sizes} />
          <img
            src={EVENT_BAND.src}
            srcSet={EVENT_BAND.webp}
            sizes={EVENT_BAND.sizes}
            alt=""
            width={EVENT_BAND.width}
            height={EVENT_BAND.height}
            loading="lazy"
            className="aspect-[12/5] w-full rounded-card object-cover"
          />
        </picture>
        <div className="min-w-0">
          <p className="t-eyebrow-dark">
            {t('event_band.eyebrow')} · {t(`events:items.${event.id}.title`)}
          </p>
          <h2
            id="event-band-title"
            className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {t('event_band.title', { location: event.location })}
          </h2>
          <p className="mt-3 hidden text-pretty leading-relaxed text-white/85 sm:block">
            <time dateTime={event.date}>
              {formatEventRange(i18n.language, event.date, event.endDate)}
            </time>
            {short && ` · ${short}`}
            {' — '}
            {t(`events:items.${event.id}.description`, '')}
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <p className="text-sm text-white/80 lg:text-right">
            {ongoing || days <= 0 ? (
              <span className="block text-3xl font-semibold tracking-tight text-white">
                {t('event_band.now')}
              </span>
            ) : (
              <>
                <span className="block text-4xl font-semibold tracking-tight text-white">
                  {days}
                </span>
                {days === 1 ? t('event_band.day_label') : t('event_band.days_label')}
              </>
            )}
          </p>
          <Button to="/contact" variant="light" size="sm" className="group whitespace-nowrap">
            {t('event_popup.meet')}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-1 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </Button>
          <Link
            to="/events"
            className="hidden rounded-sm text-sm font-semibold text-accent-on-dark hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:inline-block"
          >
            {t('event_band.all')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default EventBand

import type { EventEntry } from '../../data/events'
import { HOME_TARGETS } from '../home/homeTargets'

export const HomeEventTable = ({ upcoming }: { upcoming: readonly EventEntry[] }) => {
  const { t, i18n } = useTranslation(['home', 'common', 'events'])
  if (upcoming.length === 0) return null
  return (
    <div data-home-events>
      <h3 className="sc025-subheading">{t('common:nav.events')}</h3>
      <table className="sc025-table">
        <caption className="sr-only">{t('home:sc025.events.caption')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('home:sc025.events.event')}</th>
            <th scope="col">{t('home:sc025.events.date')}</th>
            <th scope="col" className="sc025-event-place">
              {t('home:sc025.events.place')}
            </th>
            <th scope="col">
              <span className="sr-only">{t('home:sc025.events.action')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {upcoming.map((event) => (
            <tr key={event.id} data-home-event={event.id}>
              <th scope="row">{t(`events:items.${event.id}.title`)}</th>
              <td>
                <time dateTime={event.date}>
                  {formatEventRange(i18n.language, event.date, event.endDate)}
                </time>
              </td>
              <td className="sc025-event-place">
                {event.location} · {t(`events:items.${event.id}.short`, '')}
              </td>
              <td>
                <Link to={HOME_TARGETS.contact} className="sc025-underlink">
                  <span>{t('common:event_popup.meet')}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
