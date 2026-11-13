import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import {
  events,
  pastEvents,
  HIGHLIGHT_EVENT_IDS,
  getExternalEventLink,
  getEventPageProjection,
  getEventStatus,
  humanizeEventId,
  parseIsoDate,
  toIsoDay,
} from '../data/events'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import StandPlan, { type StandPlanLabels } from '../components/events/StandPlan'
import SubHead from '../components/sub/SubHead'
import SubPage from '../components/sub/SubPage'
import SubStage from '../components/sub/SubStage'
import { formatEventDay, formatEventRange, monthNames } from '../lib/eventDates'

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
    () => getEventPageProjection(events, pastEvents, today, HIGHLIGHT_EVENT_IDS),
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
  // SC-019: optionale Detailzeilen und vereinfachter Lageplan je Termin (nur wo belegt).
  const highlightDetailsRaw = highlight
    ? t(`events:items.${highlight.id}.details`, { returnObjects: true, defaultValue: [] })
    : []
  const highlightDetails = Array.isArray(highlightDetailsRaw)
    ? (highlightDetailsRaw as { label: string; text: string }[])
    : []
  const highlightPlanRaw = highlight
    ? t(`events:items.${highlight.id}.plan`, { returnObjects: true, defaultValue: null })
    : null
  const highlightPlan =
    highlightPlanRaw && typeof highlightPlanRaw === 'object'
      ? (highlightPlanRaw as StandPlanLabels)
      : null

  const rangeLabel = (date: string, endDate?: string) => formatEventRange(lang, date, endDate)
  /** Ein einzelner Tag ohne Jahr — für den "bis …"-Hinweis laufender Termine. */
  const dayLabel = (date: string) => formatEventDay(lang, date)

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
        structuredData={structuredData}
      />

      <SubPage page="events">
        {/* Bühne: nächster Flaggschiff-Termin als Datumskarte, die anstehenden Termine als Eckdaten */}
        <SubStage
          breadcrumbs={[
            { label: t('common:nav.home', 'Home'), href: '/' },
            { label: t('events:hero.crumb', 'Events 2026') },
          ]}
          title={t('events:hero.title', 'Meet us in 2026')}
          lead={<p>{t('events:hero.subtitle')}</p>}
          fold
          chips={
            upcoming.length > 0
              ? [
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
                ]
              : undefined
          }
          aside={
            highlight ? (
              <div className="sc028-aside-card" aria-hidden="true">
                <span className="sc025-kicker">
                  {[t('events:highlight.label', 'Highlight'), highlightTag]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
                <b>{rangeLabel(highlight.date, highlight.endDate)}</b>
                <p>{[highlightTitle, highlight.location].join(' · ')}</p>
              </div>
            ) : undefined
          }
          facts={upcoming.slice(0, 3).map((event) => ({
            label: rangeLabel(event.date, event.endDate),
            value: [
              t(`events:items.${event.id}.title`, humanizeEventId(event.id)),
              event.location,
            ].join(' · '),
          }))}
        />

        {/* ================ UPCOMING: Highlight + Kalender-Liste ================ */}
        <section data-events-upcoming data-sub-section className="sc025-s">
          <div className="sc025-inner">
            <SubHead
              kicker={t('events:upcoming.eyebrow', 'Upcoming · 2026')}
              title={t('events:upcoming.title', 'The season highlight — and the full calendar')}
              lead={t(
                'events:upcoming.subtitle',
                'One flagship event featured, the rest one tap away.',
              )}
            />
            {upcoming.length === 0 ? (
              /* Kein Termin mehr im Kalender — lieber ehrlich leer als abgelaufene Termine. */
              <Reveal width="100%">
                <div className="sc028-empty">
                  <h3 className="sc025-mid">{t('events:empty_title', 'No upcoming events')}</h3>
                  <p className="sc025-text">{t('events:empty_text', '')}</p>
                  <Link to="/contact" className="sc025-button">
                    {t('common:nav.contact', 'Contact')}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ) : (
              <>
                {/* HIGHLIGHT — nur die konfigurierte, weiterhin eligible ID. */}
                {highlight && (
                  <Reveal width="100%">
                    <article
                      data-event-id={highlight.id}
                      data-event-status={getEventStatus(highlight, today)}
                      data-event-highlight
                      className="sc028-highlight"
                    >
                      <div>
                        <p className="sc025-kicker">
                          {[t('events:highlight.label', 'Highlight'), highlightTag]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                        {getEventStatus(highlight, today) === 'ongoing' && (
                          <p className="sc028-running">
                            {t('events:list.running_until', {
                              date: dayLabel(highlight.endDate ?? highlight.date),
                              defaultValue: 'Running now · until {{date}}',
                            })}
                          </p>
                        )}
                        <h3>{highlightTitle}</h3>
                        <p className="sc028-when">
                          <time dateTime={highlight.date}>
                            {rangeLabel(highlight.date, highlight.endDate)}
                          </time>
                          {' · '}
                          {highlight.location}
                        </p>
                        {highlight.partner && <p className="sc028-partner">{highlight.partner}</p>}
                        <p className="sc025-text">{highlightDescription}</p>
                        {highlightDetails.length > 0 && (
                          <dl>
                            {highlightDetails.map((row) => (
                              <div key={row.label}>
                                <dt>{row.label}</dt>
                                <dd>{row.text}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        {getExternalEventLink(highlight) && (
                          <a
                            {...getExternalEventLink(highlight)}
                            data-event-external
                            className="sc025-button sc028-external"
                          >
                            {t('events:details', 'View details')}
                          </a>
                        )}
                      </div>
                      {highlightPlan && (
                        <StandPlan
                          src={`/events/${highlight.id.replace(/_/g, '-')}-standplan.svg`}
                          labels={highlightPlan}
                        />
                      )}
                    </article>
                  </Reveal>
                )}

                {/* KALENDER-LISTE */}
                {listEvents.length > 0 && (
                  <Reveal width="100%" delay={0.1}>
                    <ul className="sc028-cal">
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
                          >
                            <div className="sc028-cal-day" aria-hidden="true">
                              <span>{months[d.month]}</span>
                              <b>{d.day}</b>
                            </div>
                            <article>
                              <h3>
                                {t(`events:items.${event.id}.title`, humanizeEventId(event.id))}
                              </h3>
                              <p className="sc028-meta">
                                {[event.location, event.partner, tag].filter(Boolean).join(' · ')}
                              </p>
                              {description && <p className="sc025-text">{description}</p>}
                              {running && (
                                <p className="sc028-running">
                                  {t('events:list.running_until', {
                                    date: dayLabel(event.endDate ?? event.date),
                                    defaultValue: 'Running now · until {{date}}',
                                  })}
                                </p>
                              )}
                              {externalLink && (
                                <a
                                  {...externalLink}
                                  data-event-external
                                  className="sc025-underlink"
                                >
                                  <span>{t('events:details', 'View details')}</span>
                                  <ArrowRight aria-hidden="true" />
                                </a>
                              )}
                            </article>
                            <p className="sc028-range">
                              <time dateTime={event.date}>
                                {rangeLabel(event.date, event.endDate)}
                              </time>
                            </p>
                          </li>
                        )
                      })}
                    </ul>
                  </Reveal>
                )}
              </>
            )}
          </div>
        </section>

        {/* ==================== WHERE WE'VE BEEN ==================== */}
        {pastCards.length > 0 && (
          <section data-events-past data-sub-section className="sc025-s sc025-dark">
            <div className="sc025-inner">
              <SubHead
                kicker={t('events:past.eyebrow', "Where we've been")}
                title={t('events:past.title', "You've probably seen us before")}
                lead={t('events:past.subtitle')}
              />
              <ul className="sc028-past">
                {pastCards.map((p) => (
                  <li key={p.id} data-past-event-id={p.id} data-past-event-source={p.source}>
                    <article>
                      <h3>{p.title}</h3>
                      <time dateTime={p.dateTime}>{p.dateLabel}</time>
                      <p>{p.detail ? `${p.location} · ${p.detail}` : p.location}</p>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <FinalCtaSection />
      </SubPage>
    </PageTransition>
  )
}

export default React.memo(EventsPage)
