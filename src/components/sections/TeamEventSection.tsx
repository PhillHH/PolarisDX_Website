/**
 * TeamEventSection — „Unser Hamburger Team beim DGI Jahreskongress" (SC-021 Nachtrag 5, Owner
 * 2026-11-03, Entwurf T3): links Eyebrow, Titel und drei Fakten (Wann · Wo · Was) mit Knöpfen,
 * rechts (Nachtrag 7, Owner 2026-11-04 „Nimm das Bild raus, ersetze das durch irgendwas Cooles"):
 * statt des Teamfotos eine rein grafische Kongress-Karte — weißes Ticket mit Live-Countdown,
 * Datum, Ort · Partner und „IglooPro live", leicht gekippt auf einer Navy-Rückkarte mit Punktring.
 * Kein Bild, keine KI-Grafik; alles aus Tokens und Termindaten.
 *
 * Ohne Icons (nur der Pfeil, der schon im Hauptbündel liegt): jedes Inline-SVG kostet ~300 B HTML und
 * jede neue lucide-Ikone ~250 B JS — die Startseite liegt an `htmlBytes`/`jsBytes` (PERFORMANCE-CONTRACT).
 *
 * Gebunden an den Termin `dgi_jahreskongress` (SC-019-Daten): Datum, Ort und Partner kommen aus
 * `src/data/events.ts`; nach dem letzten Kongresstag rendert die Sektion nichts mehr. Serverseitig,
 * Foto lazy (nie LCP). Texte `home.team.*` in zehn Sprachen; keine neuen Claims.
 */
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { events, getEventStatus, toEventDay } from '../../data/events'
import { daysUntil, formatEventRange } from '../../lib/eventDates'
import { Button } from '../ui/Button'
import { STAGE } from './heroStage'

export const TEAM_EVENT_ID = 'dgi_jahreskongress'

const TeamEventSection = () => {
  const { t, i18n } = useTranslation('home')
  const event = events.find((entry) => entry.id === TEAM_EVENT_ID)
  const today = toEventDay(new Date())
  if (!event || getEventStatus(event, today) === 'past') return null
  const remaining = daysUntil(event.date, today)

  const facts = [
    {
      title: formatEventRange(i18n.language, event.date, event.endDate),
      text: t('team.when_text'),
    },
    {
      title: event.partner ? `${event.location} · ${event.partner}` : event.location,
      text: t('team.where_text'),
    },
    { title: t('team.what'), text: t('team.what_text') },
  ]

  return (
    <div className="overflow-x-clip">
      <section
        aria-labelledby="team-title"
        data-home-team
        className="mx-auto grid w-full max-w-container gap-10 px-4 pb-6 pt-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14 lg:px-0 lg:pt-20"
      >
        <div className="rv min-w-0">
          <p className="t-eyebrow">{t('team.eyebrow')}</p>
          <h2 id="team-title" className="t-display mt-3">
            {t('team.title')}
            <span className="block text-accent">{t('team.accent')}</span>
          </h2>
          <ul className="mt-6 hidden gap-4 md:grid">
            {facts.map(({ title, text }) => (
              <li key={title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-line"
                />
                <span className="min-w-0">
                  <span className="block font-semibold text-heading">{title}</span>
                  <span className="text-gray-700">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button to="/contact" variant="secondary" className="group">
              {t('team.cta')}
              <ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Button>
            {/* Outline-Pille wie in der Bühne (STAGE.ghost, DESIGN-SYSTEM-CONTRACT §3.4). */}
            <span className="hidden md:block">
              <Button to="/events" variant="ghost" className={STAGE.ghost}>
                {t('team.cta_secondary')}
              </Button>
            </span>
          </div>
        </div>

        <div className="rv relative mx-auto w-full max-w-[560px] py-6 lg:max-w-none">
          <span
            aria-hidden="true"
            className="brand-ring absolute -top-1 bottom-1 left-6 right-0 rotate-2 rounded-card bg-brand-deep"
          />
          {/* Kongress-Ticket: Kopfzeile navy, Countdown gross, Perforation, Fusszeile. */}
          <div
            data-home-team-ticket
            className="relative -rotate-2 overflow-hidden rounded-card bg-white shadow-card"
          >
            <div className="flex items-center justify-between gap-3 bg-brand-deep px-6 py-4 text-white">
              <span className="t-eyebrow-dark">{t('events:items.dgi_jahreskongress.tag')}</span>
              <span className="text-sm font-semibold">
                {t('events:items.dgi_jahreskongress.title')}
              </span>
            </div>
            <div className="px-6 pb-5 pt-6 sm:px-8">
              {remaining <= 0 ? (
                <p className="t-display text-accent">{t('common:event_band.now')}</p>
              ) : (
                <p className="flex items-baseline gap-3">
                  <span className="text-[clamp(64px,10vw,104px)] font-semibold leading-none tracking-[-0.05em] text-heading">
                    {remaining}
                  </span>
                  <span className="max-w-[10rem] text-base font-semibold leading-tight text-accent">
                    {t(remaining === 1 ? 'team.countdown_day' : 'team.countdown_days')}
                  </span>
                </p>
              )}
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="t-eyebrow">{t('team.ticket_when')}</dt>
                  <dd className="mt-1 font-semibold text-heading">
                    {formatEventRange(i18n.language, event.date, event.endDate)}
                  </dd>
                </div>
                <div>
                  <dt className="t-eyebrow">{t('team.ticket_where')}</dt>
                  <dd className="mt-1 font-semibold text-heading">
                    {event.location}
                    {event.partner ? ` · ${event.partner}` : ''}
                  </dd>
                </div>
              </dl>
            </div>
            {/* Perforation: zwei Halbkreise in Papier plus gestrichelte Linie. */}
            <div
              aria-hidden="true"
              className="relative mx-6 border-t-2 border-dashed border-ui-border sm:mx-8"
            >
              <span className="absolute -left-9 -top-3 h-6 w-6 rounded-full bg-paper sm:-left-11" />
              <span className="absolute -right-9 -top-3 h-6 w-6 rounded-full bg-paper sm:-right-11" />
            </div>
            <div className="flex items-center justify-between gap-3 px-6 py-4 sm:px-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-semibold text-heading">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent-line" />
                {t('team.what')}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                {t('team.caption')}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TeamEventSection
