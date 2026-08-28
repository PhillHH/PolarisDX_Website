import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import {
  events,
  pastEvents,
  HIGHLIGHT_EVENT_ID,
  humanizeEventId,
  parseIsoDate,
  splitEventsByDate,
  toIsoDay,
} from '../data/events'
import { SEOHead, createBreadcrumbSchema, createEventSchema } from '../components/seo'
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
  key: string
  month: number
  year: number
  title: string
  location: string
  detail: string
  watermark: string
}

function EventsPage() {
  const { t, i18n } = useTranslation(['common', 'events'])
  const lang = i18n.language?.substring(0, 2) || 'de'
  const months = monthNames[lang] || monthNames.de

  // Datum beim Rendern bestimmen, nicht beim Laden des Moduls — sonst friert ein
  // lange laufender SSR-Prozess den "heute"-Stand auf seinen Start ein.
  const today = toIsoDay(new Date())
  const { upcoming, past: expiredEvents } = useMemo(() => splitEventsByDate(events, today), [today])

  const highlight = upcoming.find((e) => e.id === HIGHLIGHT_EVENT_ID) ?? upcoming[0]
  const listEvents = upcoming.filter((e) => e !== highlight)
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
  const isRunning = (event: { date: string; endDate?: string }) =>
    event.date <= today && today <= (event.endDate ?? event.date)

  /** Rückblick: automatisch abgelaufene Termine plus der kuratierte Bestand. */
  const pastCards = useMemo<PastCard[]>(() => {
    const fromExpired: PastCard[] = expiredEvents.map((event) => {
      const d = parseIsoDate(event.date)
      return {
        key: `event-${event.id}`,
        month: d.month,
        year: d.year,
        title: t(`events:items.${event.id}.title`, humanizeEventId(event.id)),
        location: event.location,
        detail: t(`events:items.${event.id}.tag`, ''),
        watermark: `${event.location} ${d.year}`,
      }
    })
    const curated: PastCard[] = pastEvents.map((p) => ({
      key: `past-${p.id}`,
      month: p.month,
      year: p.year,
      title: t(`events:past_items.${p.id}.title`, humanizeEventId(p.id)),
      location: p.location,
      detail: t(`events:past_items.${p.id}.detail`, ''),
      watermark: t(`events:past_items.${p.id}.watermark`, `${p.location} ${p.year}`),
    }))
    return [...fromExpired, ...curated]
      .sort((a, b) => b.year - a.year || b.month - a.month)
      .slice(0, 8)
  }, [expiredEvents, t])

  const structuredData = useMemo(
    () => [
      createBreadcrumbSchema(
        [
          { name: t('common:nav.home', 'Home'), url: '/' },
          { name: t('common:nav.events', 'Events'), url: '/events' },
        ],
        i18n.language,
      ),
      // Nur kommende Termine — abgelaufene als BusinessEvent auszuzeichnen wäre
      // gegenüber Suchmaschinen schlicht falsch.
      ...upcoming.map((event) =>
        createEventSchema({
          name: t(`events:items.${event.id}.title`, humanizeEventId(event.id)),
          description: t(
            `events:items.${event.id}.description`,
            t(`events:items.${event.id}.title`, humanizeEventId(event.id)),
          ),
          startDate: event.date,
          endDate: event.endDate,
          location: event.location,
          url: event.link,
        }),
      ),
    ],
    [upcoming, t],
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
      <section className="bg-slate-50">
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

          {!highlight ? (
            /* Kein Termin mehr im Kalender — lieber ehrlich leer als abgelaufene
               Termine mit aktivem Buchen-Button. */
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
                listEvents.length > 0 ? 'lg:grid-cols-2' : 'mx-auto max-w-3xl'
              }`}
            >
              {/* HIGHLIGHT-Karte */}
              <Reveal width="100%">
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-brand-deep p-7 text-white">
                  <span className="text-xs font-medium text-white/60">
                    {highlightTag ? `${highlightTag} · ` : ''}
                    {t('events:highlight.label', 'Highlight')}
                  </span>
                  <h3 className="mt-6 text-3xl font-medium tracking-tight">{highlightTitle}</h3>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent-line" aria-hidden />
                      {rangeLabel(highlight.date, highlight.endDate)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent-line" aria-hidden />
                      {highlight.location}
                    </span>
                  </div>
                  <p className="mt-4 max-w-md leading-relaxed text-white/80">
                    {highlightDescription}
                  </p>
                  <div className="mt-8">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center rounded-md bg-accent-strong px-6 py-3 text-sm font-medium text-white transition hover:brightness-110"
                    >
                      {t('events:highlight.book_cta', {
                        event: highlightTitle,
                        defaultValue: 'Book a slot',
                      })}
                    </Link>
                  </div>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-2 left-6 select-none text-5xl font-semibold text-white/5"
                  >
                    {highlight.location}
                  </span>
                </div>
              </Reveal>

              {/* KALENDER-LISTE */}
              {listEvents.length > 0 && (
                <Reveal width="100%" delay={0.1}>
                  <div className="h-full divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {listEvents.map((event) => {
                      const d = parseIsoDate(event.date)
                      const tag = t(`events:items.${event.id}.tag`, '')
                      const multiDay = Boolean(event.endDate && event.endDate !== event.date)
                      const running = isRunning(event)
                      return (
                        <div
                          key={event.id}
                          className="group flex items-center gap-4 p-4 transition hover:bg-slate-50"
                        >
                          {/* Ortskürzel als Monogramm — lesbare Größe statt 9px-Fußnote. */}
                          <div
                            aria-hidden
                            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-deep text-sm font-semibold text-white/70 sm:flex"
                          >
                            {event.location.charAt(0).toUpperCase()}
                          </div>
                          <div className="w-12 shrink-0 text-center">
                            <div className="text-xs font-medium text-gray-500">
                              {months[d.month]}
                            </div>
                            <div className="text-xl font-semibold leading-none text-heading">
                              {d.day}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium text-heading">
                              {t(`events:items.${event.id}.title`, humanizeEventId(event.id))}
                            </div>
                            <div className="truncate text-sm text-gray-500">
                              {tag ? `${event.location} · ${tag}` : event.location}
                            </div>
                            {/* Die große Tageszahl links zeigt nur den Beginn. Bei mehrtägigen
                                Terminen steht der volle Zeitraum darunter, laufende Termine
                                bekommen zusätzlich einen "läuft gerade"-Hinweis — sonst liest
                                sich ein noch laufender Termin wie ein abgelaufener. */}
                            {(multiDay || running) && (
                              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                                <span>{rangeLabel(event.date, event.endDate)}</span>
                                {running && (
                                  <span className="rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-accent-strong ring-1 ring-accent-border">
                                    {t('events:list.running_until', {
                                      date: dayLabel(event.endDate ?? event.date),
                                      defaultValue: 'Running now · until {{date}}',
                                    })}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <Link
                            to="/contact"
                            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent transition group-hover:gap-1.5 group-hover:text-accent-strong"
                          >
                            {t('events:list.book', 'Book')}
                            <ArrowRight className="h-4 w-4" aria-hidden />
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </Reveal>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ==================== WHERE WE'VE BEEN ==================== */}
      {pastCards.length > 0 && (
        <section className="bg-white">
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pastCards.map((p, i) => (
                <Reveal key={p.key} width="100%" delay={i * 0.05}>
                  <div className="relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl bg-brand-deep p-7 text-white">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute bottom-3 left-5 select-none text-2xl font-semibold text-white/10"
                    >
                      {p.watermark}
                    </span>
                    <div className="relative">
                      <div className="text-xs font-medium text-white/60">
                        {months[p.month]} {p.year}
                      </div>
                      <div className="mt-1 text-lg font-semibold">{p.title}</div>
                      <div className="mt-0.5 text-sm text-white/70">
                        {p.detail ? `${p.location} · ${p.detail}` : p.location}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent-strong"
              >
                {t('events:past.recaps_cta', 'See event recaps & photos')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}
      <FinalCtaSection roiHref="/#roi-rechner" />
    </PageTransition>
  )
}

export default React.memo(EventsPage)
