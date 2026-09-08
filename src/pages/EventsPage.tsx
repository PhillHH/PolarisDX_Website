import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import {
  events,
  pastEvents,
  HIGHLIGHT_EVENT_ID,
  getExternalEventLink,
  getEventPageProjection,
  getEventStatus,
  humanizeEventId,
  parseIsoDate,
  toIsoDay,
} from '../data/events'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import FinalCtaSection from '../components/sections/FinalCtaSection'

/** Monats-Kurzformen je Sprache — sonst stünde in allen Sprachen "Mär"/"Okt"/"Dez". */
const monthNames: Record<string, string[]> = {
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  fr: [
    'janv.',
    'févr.',
    'mars',
    'avr.',
    'mai',
    'juin',
    'juil.',
    'août',
    'sept.',
    'oct.',
    'nov.',
    'déc.',
  ],
  it: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  pl: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
  nl: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  da: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  cs: ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'],
}

/** Sprachen, die hinter die Tageszahl einen Punkt setzen (12.–13. Jun 2026). */
const DAY_DOT_LANGUAGES = new Set(['de', 'cs', 'da'])

interface PastCard {
  id: string
  source: 'automatic' | 'static'
  dateTime: string
  dateLabel: string
  title: string
  location: string
  detail: string
}

export interface EventsPageProps {
  /** Testbare Clock-Injection; Produktion verwendet den aktuellen Zeitpunkt. */
  now?: Date
}

export function EventsPage({ now = new Date() }: EventsPageProps = {}) {
  const { t, i18n } = useTranslation(['common', 'events'])
  const lang = i18n.language?.substring(0, 2) || 'de'
  const months = monthNames[lang] || monthNames.de

  // Datum beim Rendern bestimmen, nicht beim Laden des Moduls — sonst friert ein
  // lange laufender SSR-Prozess den "heute"-Stand auf seinen Start ein.
  const today = toIsoDay(now)
  const { upcoming, highlight, listEvents, archive } = useMemo(
    () => getEventPageProjection(events, pastEvents, today, HIGHLIGHT_EVENT_ID),
    [today],
  )
  const partners = Array.from(
    new Set(upcoming.map((e) => e.partner).filter((p): p is string => Boolean(p))),
  )

  const highlightTitle = highlight
    ? t(`events:items.${highlight.id}.title`, humanizeEventId(highlight.id))
    : ''
  const highlightTag = highlight ? t(`events:items.${highlight.id}.tag`, '') : ''
  const highlightDescription = highlight ? t(`events:items.${highlight.id}.description`, '') : ''

  const rangeLabel = (date: string, endDate?: string) => {
    const s = parseIsoDate(date)
    const e = endDate ? parseIsoDate(endDate) : s
    const sameMonth = s.year === e.year && s.month === e.month

    if (lang === 'en') {
      if (sameMonth) {
        const days = s.day === e.day ? `${s.day}` : `${s.day}–${e.day}`
        return `${months[s.month]} ${days}, ${s.year}`
      }
      return `${months[s.month]} ${s.day} – ${months[e.month]} ${e.day}, ${e.year}`
    }

    const dot = DAY_DOT_LANGUAGES.has(lang) ? '.' : ''
    if (sameMonth) {
      const days = s.day === e.day ? `${s.day}${dot}` : `${s.day}${dot}–${e.day}${dot}`
      return `${days} ${months[s.month]} ${s.year}`
    }
    return `${s.day}${dot} ${months[s.month]} – ${e.day}${dot} ${months[e.month]} ${e.year}`
  }

  /** Ein einzelner Tag ohne Jahr — für den "bis …"-Hinweis laufender Termine. */
  const dayLabel = (date: string) => {
    const d = parseIsoDate(date)
    if (lang === 'en') return `${months[d.month]} ${d.day}`
    const dot = DAY_DOT_LANGUAGES.has(lang) ? '.' : ''
    return `${d.day}${dot} ${months[d.month]}`
  }

  /** Läuft der Termin heute bereits, ist aber noch nicht vorbei? */
  const isRunning = (event: (typeof events)[number]) => getEventStatus(event, today) === 'ongoing'

  /** Rückblick: automatisch abgelaufene Termine plus der kuratierte Bestand. */
  const pastCards: PastCard[] = archive.map((entry) => {
    if (entry.source === 'automatic') {
      const event = entry.event
      return {
        id: entry.id,
        source: entry.source,
        dateTime: event.endDate ?? event.date,
        dateLabel: rangeLabel(event.date, event.endDate),
        title: t(`events:items.${event.id}.title`, humanizeEventId(event.id)),
        location: event.location,
        detail: [event.partner, t(`events:items.${event.id}.tag`, '')].filter(Boolean).join(' · '),
      }
    }

    const event = entry.event
    return {
      id: entry.id,
      source: entry.source,
      dateTime: `${event.year}-${String(event.month + 1).padStart(2, '0')}`,
      dateLabel: `${months[event.month]} ${event.year}`,
      title: t(`events:past_items.${event.id}.title`, humanizeEventId(event.id)),
      location: event.location,
      detail: t(`events:past_items.${event.id}.detail`, ''),
    }
  })

  // Der Bestand belegt Teilnahme/Partnerbezug, aber weder Veranstalterrolle,
  // genaue Anschrift noch Attendance Mode oder eine kanonische Eventdetail-URL.
  // Deshalb bleibt Event-Schema bewusst aus; Breadcrumb ist vollständig belegt.
  const structuredData = useMemo(
    () =>
      createBreadcrumbSchema(
        [
          { name: t('common:nav.home', 'Home'), url: '/' },
          { name: t('common:nav.events', 'Events'), url: '/events' },
        ],
        i18n.language,
      ),
    [i18n.language, t],
  )

  return (
    <PageTransition>
      <SEOHead
        title={t('events:seo_title', 'Events & Trade Shows 2026: POC Diagnostics Live')}
        description={t(
          'events:seo_description',
          'Meet PolarisDX at the 2026 trade shows and congresses — point-of-care diagnostics live.',
        )}
        keywords={t('events:seo_keywords', 'PolarisDX events, Nobel Biocare, IglooPro')
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)}
        structuredData={structuredData}
      />

      {/* ===================== HERO (Navy, zentriert) ===================== */}
      <section className="relative overflow-hidden bg-brand-deep text-white">
        <div className="mx-auto max-w-container px-4 lg:px-0 pt-24 pb-20 lg:pt-28 text-center">
          <Reveal width="100%">
            <div className="mb-5 flex justify-center">
              <Breadcrumbs
                variant="dark"
                items={[
                  { label: t('common:nav.home', 'Home'), href: '/' },
                  { label: t('events:hero.crumb', 'Events 2026') },
                ]}
              />
            </div>
            <h1 className="mx-auto max-w-3xl t-h1">{t('events:hero.title', 'Meet us in 2026')}</h1>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/80">
              {t('events:hero.subtitle')}
            </p>
            {upcoming.length > 0 && (
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {[
                  t('events:hero.chip_events', {
                    count: upcoming.length,
                    defaultValue: `${upcoming.length} events`,
                  }),
                  t('events:hero.chip_demos', 'Live demos'),
                  ...(partners.length > 0
                    ? [
                        t('events:hero.chip_partner', {
                          partner: partners.join(', '),
                          defaultValue: `Partner: ${partners.join(', ')}`,
                        }),
                      ]
                    : []),
                ].map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 ring-1 ring-white/15"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ================ UPCOMING: Highlight + Kalender-Liste ================ */}
      <section data-events-upcoming className="bg-slate-50">
        <div className="mx-auto max-w-container px-4 lg:px-0 py-24">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
              {t('events:upcoming.eyebrow', 'Upcoming · 2026')}
            </span>
            <h2 className="mt-4 text-3xl font-medium tracking-tight text-heading lg:text-[38px]">
              {t('events:upcoming.title', 'The season highlight — and the full calendar')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-700">
              {t('events:upcoming.subtitle', 'One flagship event featured, the rest one tap away.')}
            </p>
          </div>

          {upcoming.length === 0 ? (
            /* Kein Termin mehr im Kalender — lieber ehrlich leer als abgelaufene Termine. */
            <Reveal width="100%">
              <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <h3 className="text-xl font-medium text-heading">
                  {t('events:empty_title', 'No upcoming events')}
                </h3>
                <p className="mt-3 leading-relaxed text-gray-700">{t('events:empty_text', '')}</p>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center justify-center rounded-md bg-accent-strong px-6 py-3 text-sm font-medium text-white transition hover:brightness-110"
                >
                  {t('common:nav.contact', 'Contact')}
                </Link>
              </div>
            </Reveal>
          ) : (
            <div
              className={`grid items-stretch gap-6 ${
                highlight && listEvents.length > 0 ? 'lg:grid-cols-2' : 'mx-auto max-w-3xl'
              }`}
            >
              {/* HIGHLIGHT-Karte — nur die konfigurierte, weiterhin eligible ID. */}
              {highlight && (
                <Reveal width="100%">
                  <article
                    data-event-id={highlight.id}
                    data-event-status={getEventStatus(highlight, today)}
                    data-event-highlight
                    className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-brand-deep p-7 text-white"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className="rounded-full border border-white/30 px-2.5 py-1 text-white">
                        {t('events:highlight.label', 'Highlight')}
                      </span>
                      {getEventStatus(highlight, today) === 'ongoing' && (
                        <span className="rounded-full bg-white px-2.5 py-1 text-brand-deep">
                          {t('events:list.running_until', {
                            date: dayLabel(highlight.endDate ?? highlight.date),
                            defaultValue: 'Running now · until {{date}}',
                          })}
                        </span>
                      )}
                      {highlightTag && <span className="text-white">{highlightTag}</span>}
                    </div>
                    <h3 className="mt-6 text-3xl font-medium tracking-tight">{highlightTitle}</h3>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
                      <time dateTime={highlight.date} className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-accent-line" aria-hidden />
                        {rangeLabel(highlight.date, highlight.endDate)}
                      </time>
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent-line" aria-hidden />
                        {highlight.location}
                      </span>
                    </div>
                    {highlight.partner && (
                      <p className="mt-3 text-sm font-medium text-white/80">{highlight.partner}</p>
                    )}
                    <p className="mt-4 max-w-md leading-relaxed text-white/80">
                      {highlightDescription}
                    </p>
                    {getExternalEventLink(highlight) && (
                      <a
                        {...getExternalEventLink(highlight)}
                        data-event-external
                        className="mt-8 inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-accent-strong px-6 py-3 text-sm font-medium text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {t('events:details', 'View details')}
                      </a>
                    )}
                  </article>
                </Reveal>
              )}

              {/* KALENDER-LISTE */}
              {listEvents.length > 0 && (
                <Reveal width="100%" delay={0.1}>
                  <ul className="h-full divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {listEvents.map((event) => {
                      const d = parseIsoDate(event.date)
                      const tag = t(`events:items.${event.id}.tag`, '')
                      const description = t(`events:items.${event.id}.description`, '')
                      const running = isRunning(event)
                      const externalLink = getExternalEventLink(event)
                      return (
                        <li
                          key={event.id}
                          data-event-id={event.id}
                          data-event-status={getEventStatus(event, today)}
                          className="group p-4 transition hover:bg-slate-50 sm:p-5"
                        >
                          <article className="flex min-w-0 items-start gap-3 sm:gap-4">
                            <div className="w-12 shrink-0 rounded-lg bg-slate-100 py-2 text-center">
                              <div className="text-xs font-medium text-brand-deep">
                                {months[d.month]}
                              </div>
                              <div className="text-xl font-semibold leading-none text-heading">
                                {d.day}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-brand-deep">
                                {t(`events:items.${event.id}.title`, humanizeEventId(event.id))}
                              </h3>
                              <p className="mt-1 text-sm text-brand-deep">
                                {[event.location, event.partner, tag].filter(Boolean).join(' · ')}
                              </p>
                              {description && (
                                <p className="mt-2 text-sm leading-relaxed text-brand-deep">
                                  {description}
                                </p>
                              )}
                              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-brand-deep">
                                <time dateTime={event.date}>
                                  {rangeLabel(event.date, event.endDate)}
                                </time>
                                {running && (
                                  <span className="rounded-full bg-brand-deep px-2 py-0.5 font-semibold text-white">
                                    {t('events:list.running_until', {
                                      date: dayLabel(event.endDate ?? event.date),
                                      defaultValue: 'Running now · until {{date}}',
                                    })}
                                  </span>
                                )}
                              </div>
                              {externalLink && (
                                <a
                                  {...externalLink}
                                  data-event-external
                                  className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-accent transition hover:text-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                >
                                  {t('events:details', 'View details')}
                                  <ArrowRight className="h-4 w-4" aria-hidden />
                                </a>
                              )}
                            </div>
                          </article>
                        </li>
                      )
                    })}
                  </ul>
                </Reveal>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ==================== WHERE WE'VE BEEN ==================== */}
      {pastCards.length > 0 && (
        <section data-events-past className="bg-white">
          <div className="mx-auto max-w-container px-4 lg:px-0 pb-20 lg:pb-28">
            <div className="mb-12 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                {t('events:past.eyebrow', "Where we've been")}
              </span>
              <h2 className="mt-4 text-3xl font-medium tracking-tight text-heading lg:text-[38px]">
                {t('events:past.title', "You've probably seen us before")}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-gray-700">{t('events:past.subtitle')}</p>
            </div>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pastCards.map((p) => (
                <li key={p.id} data-past-event-id={p.id} data-past-event-source={p.source}>
                  <article className="flex h-full min-h-56 flex-col justify-end rounded-2xl bg-brand-deep p-7 text-white">
                    <time dateTime={p.dateTime} className="text-xs font-medium text-white/80">
                      {p.dateLabel}
                    </time>
                    <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                    <p className="mt-0.5 text-sm text-white/80">
                      {p.detail ? `${p.location} · ${p.detail}` : p.location}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <FinalCtaSection roiHref="/#roi-rechner" />
    </PageTransition>
  )
}

export default React.memo(EventsPage)
