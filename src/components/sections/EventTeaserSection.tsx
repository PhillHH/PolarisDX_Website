/**
 * EventTeaserSection
 *
 * Schlanker Hinweis auf der Startseite fuer die naechste Veranstaltung mit
 * Anmeldung — aktuell das Future Forum Berlin (02.10.2026, NIO House).
 * Bewusst kein zweiter dunkler Block: die Epigenetik-Sektion darunter traegt
 * schon den Navy-Verlauf. Hier ein heller Rahmen mit Datumskachel, damit der
 * Termin auf einen Blick lesbar ist.
 *
 * Texte kommen aus `events:futureForum.teaser`; der Termin selbst steht in
 * src/data/events.ts (FUTURE_FORUM_BERLIN) und wird hier nicht dupliziert.
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, MapPin, Clock } from 'lucide-react'
import { FUTURE_FORUM_BERLIN } from '../../data/events'
import { isEnglishFallback } from '../../lib/translationStatus'

const EventTeaserSection = () => {
  const { t } = useTranslation('events')
  const englishFallback = isEnglishFallback(
    t('futureForum._translationStatus', { defaultValue: '' }),
  )

  return (
    <section aria-labelledby="event-teaser-title" lang={englishFallback ? 'en' : undefined}>
      <div className="rounded-3xl bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep p-px shadow-lg shadow-brand-primary/10">
        <div className="flex flex-col gap-6 rounded-[calc(1.5rem-1px)] bg-white px-6 py-6 lg:flex-row lg:items-center lg:gap-10 lg:px-10 lg:py-8">
          {/* Datumskachel */}
          <div className="flex shrink-0 items-center gap-4 lg:flex-col lg:items-center lg:gap-0">
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-brand-deep text-white lg:h-24 lg:w-24">
              <span className="text-3xl font-semibold leading-none lg:text-4xl">
                {t('futureForum.teaser.date_day')}
              </span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
                {t('futureForum.teaser.date_month')} {t('futureForum.teaser.date_year')}
              </span>
            </div>
            <span className="rounded-full border border-accent-border bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-strong lg:mt-3">
              {t('futureForum.teaser.badge')}
            </span>
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
              {t('futureForum.teaser.eyebrow')}
            </p>
            <h2
              id="event-teaser-title"
              className="mt-2 text-2xl font-medium tracking-tight text-gray-900 lg:text-3xl"
            >
              {t('futureForum.teaser.title')}
            </h2>
            <p className="mt-3 max-w-[62ch] text-base leading-7 text-gray-600">
              {t('futureForum.teaser.text')}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-primary" aria-hidden="true" />
                {t('futureForum.hero.time')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-brand-primary" aria-hidden="true" />
                {t('futureForum.hero.venue')} · {t('futureForum.hero.address')}
              </span>
            </div>
          </div>

          {/* Aktionen */}
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            <Link
              to={`${FUTURE_FORUM_BERLIN.link}#anmeldung`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-deep px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-deep/20 transition-colors hover:bg-brand-navy-hover"
            >
              {t('futureForum.teaser.cta')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to={FUTURE_FORUM_BERLIN.link ?? '/events'}
              className="inline-flex items-center justify-center rounded-full border border-brand-deep/20 px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-deep hover:bg-slate-50"
            >
              {t('futureForum.teaser.cta_secondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventTeaserSection
