/**
 * TeamEventSection — „Unser Hamburger Team beim DGI Jahreskongress" (SC-021 Nachtrag 5, Owner
 * 2026-11-03, Entwurf T3): links Eyebrow, Titel und drei Fakten (Wann · Wo · Was) mit Knöpfen,
 * rechts das echte Teamfoto leicht gekippt auf einer Navy-Rückkarte mit Punktring.
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
import { TEAM_PHOTO } from '../../assets/home/homeImages'
import { events, getEventStatus, toEventDay } from '../../data/events'
import { formatEventRange } from '../../lib/eventDates'
import { Button } from '../ui/Button'
import { STAGE } from './heroStage'

export const TEAM_EVENT_ID = 'dgi_jahreskongress'

const TeamEventSection = () => {
  const { t, i18n } = useTranslation('home')
  const event = events.find((entry) => entry.id === TEAM_EVENT_ID)
  if (!event || getEventStatus(event, toEventDay(new Date())) === 'past') return null

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
        <ul className="mt-6 grid gap-4">
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
          <Button to="/events" variant="ghost" className={STAGE.ghost}>
            {t('team.cta_secondary')}
          </Button>
        </div>
      </div>

      <div className="rv relative aspect-[4/3] w-full">
        <span
          aria-hidden="true"
          className="brand-ring absolute -right-2 -top-3 bottom-4 left-6 rotate-3 rounded-card bg-brand-deep"
        />
        <picture>
          <source type="image/avif" srcSet={TEAM_PHOTO.avif} sizes={TEAM_PHOTO.sizes} />
          <img
            src={TEAM_PHOTO.src}
            srcSet={TEAM_PHOTO.webp}
            sizes={TEAM_PHOTO.sizes}
            alt={t('team.alt')}
            width={TEAM_PHOTO.width}
            height={TEAM_PHOTO.height}
            loading="lazy"
            className="absolute inset-0 h-full w-full -rotate-2 rounded-card object-cover shadow-card"
          />
        </picture>
        <span className="absolute bottom-5 left-5 inline-flex -rotate-2 items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-[13px] font-semibold text-heading shadow-card">
          {t('team.caption')}
        </span>
      </div>
    </section>
  )
}

export default TeamEventSection
