import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { events, pastEvents, HIGHLIGHT_EVENT_TITLE } from '../data/events'
import { SEOHead, createBreadcrumbSchema, createEventSchema } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const monthNames: Record<string, string[]> = {
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

function EventsPage() {
  const { t, i18n } = useTranslation(['common', 'events'])
  const lang = i18n.language?.substring(0, 2) || 'de'
  const months = monthNames[lang] || monthNames.de

  const highlight =
    events.find((e) => e.title.includes(HIGHLIGHT_EVENT_TITLE)) ?? events[events.length - 1]
  const listEvents = events.filter((e) => e !== highlight)

  const rangeLabel = (date: string, endDate?: string) => {
    const s = new Date(date)
    const sd = s.getDate()
    const sm = months[s.getMonth()]
    if (!endDate) return `${sd}. ${sm} ${s.getFullYear()}`
    const e = new Date(endDate)
    if (s.getMonth() === e.getMonth()) return `${sd}.–${e.getDate()}. ${sm} ${s.getFullYear()}`
    return `${sd}. ${sm} – ${e.getDate()}. ${months[e.getMonth()]} ${e.getFullYear()}`
  }

  const structuredData = useMemo(
    () => [
      createBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Events', url: '/events' },
      ]),
      ...events.map((event) =>
        createEventSchema({
          name: event.title,
          description: event.description || event.title,
          startDate: event.date,
          endDate: event.endDate,
          location: event.location,
          url: event.link,
        }),
      ),
    ],
    [],
  )

  const gradients = [
    'from-brand-deep to-accent',
    'from-brand-deep to-brand-primary',
    'from-accent-strong to-accent',
    'from-brand-deep to-accent',
  ]

  return (
    <PageTransition>
      <SEOHead
        title={t('events:seo_title', 'Events & Messen 2026: POC-Diagnostik live | PolarisDX')}
        description={t(
          'events:seo_description',
          'PolarisDX auf 5 Events 2026 – von Stuttgart bis Hamburg, gemeinsam mit Nobel Biocare.',
        )}
        keywords={['PolarisDX Events', 'Nobel Biocare', 'DGI Kongress', 'POC Diagnostik Messe']}
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
            <h1 className="mx-auto max-w-3xl text-4xl font-medium tracking-tight lg:text-5xl">
              {t('events:hero.title', 'Meet us in 2026')}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/80">
              {t('events:hero.subtitle')}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {[
                t('events:hero.chip_events', '5 events'),
                t('events:hero.chip_demos', 'Live demos'),
                t('events:hero.chip_partner', 'Partner: Nobel Biocare'),
              ].map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 ring-1 ring-white/15"
                >
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================ UPCOMING: Highlight + Kalender-Liste ================ */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-container px-4 lg:px-0 py-20 lg:py-28">
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

          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            {/* HIGHLIGHT-Karte */}
            <Reveal width="100%">
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-brand-deep p-8 text-white">
                <span className="text-xs font-medium text-white/60">
                  {highlight.tag} · {t('events:highlight.label', 'Highlight')}
                </span>
                <h3 className="mt-6 text-3xl font-medium tracking-tight">{highlight.title}</h3>
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
                  {t('events:highlight.description')}
                </p>
                <div className="mt-8">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accent/20 transition hover:bg-accent-strong"
                  >
                    {t('events:highlight.book_cta', 'Book a slot at DGI 2026')}
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
            <Reveal width="100%" delay={0.1}>
              <div className="h-full divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {listEvents.map((event, i) => {
                  const d = new Date(event.date)
                  return (
                    <div
                      key={event.id}
                      className="group flex items-center gap-4 p-4 transition hover:bg-slate-50"
                    >
                      <div
                        className={`relative hidden h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br sm:block ${gradients[i % gradients.length]}`}
                      >
                        <span className="pointer-events-none absolute bottom-0 left-1 select-none text-[9px] font-semibold text-white/40">
                          {event.location}
                        </span>
                      </div>
                      <div className="w-12 shrink-0 text-center">
                        <div className="text-xs font-medium text-gray-500">
                          {months[d.getMonth()]}
                        </div>
                        <div className="text-xl font-semibold leading-none text-heading">
                          {d.getDate()}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-heading">{event.title}</div>
                        <div className="truncate text-sm text-gray-500">
                          {event.location} · {event.tag}
                        </div>
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
          </div>
        </div>
      </section>

      {/* ==================== WHERE WE'VE BEEN (2025) ==================== */}
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
            {pastEvents.map((p, i) => (
              <Reveal key={p.id} width="100%" delay={i * 0.05}>
                <div
                  className={`relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white ${gradients[i % gradients.length]}`}
                >
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
                      {p.location} · {p.detail}
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
    </PageTransition>
  )
}

export default React.memo(EventsPage)
