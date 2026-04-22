import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, MapPin, Award, Wind } from 'lucide-react'
import { events } from '../data/events'
import { SEOHead, createBreadcrumbSchema, createEventSchema } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const monthNames: Record<string, string[]> = {
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

function formatDateRange(date: string, endDate?: string, lang = 'de') {
  const months = monthNames[lang] || monthNames.de
  const start = new Date(date)
  const startDay = start.getDate()
  const startMonth = months[start.getMonth()]

  if (!endDate) return `${startDay}. ${startMonth} ${start.getFullYear()}`

  const end = new Date(endDate)
  const endDay = end.getDate()
  const endMonth = months[end.getMonth()]

  if (start.getMonth() === end.getMonth()) {
    return `${startDay}.–${endDay}. ${startMonth} ${start.getFullYear()}`
  }
  return `${startMonth} – ${endDay}. ${endMonth} ${end.getFullYear()}`
}

function getSeasonIcon(date: string) {
  const month = new Date(date).getMonth()
  if (month >= 5 && month <= 8) return Wind
  return Calendar
}

const EventsPage: React.FC = () => {
  const { t, i18n } = useTranslation(['common', 'events'])
  const lang = i18n.language?.substring(0, 2) || 'de'

  const eventSchemas = useMemo(() => {
    return events.map((event) =>
      createEventSchema({
        name: event.title,
        description: event.description || event.title,
        startDate: event.date,
        endDate: event.endDate,
        location: event.location,
        url: event.link,
      }),
    )
  }, [])

  const structuredData = useMemo(
    () => [
      createBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Events', url: '/events' },
      ]),
      ...eventSchemas,
    ],
    [eventSchemas],
  )

  return (
    <PageTransition>
      <SEOHead
        title={t(
          'events:seo_title',
          'Events & Messen 2026: POC-Diagnostik live erleben | PolarisDX',
        )}
        description={t(
          'events:seo_description',
          'Polaris Diagnostics auf 5 Events in 2026 — von Stuttgart bis Hamburg. Point-of-Care-Diagnostik live mit Nobel Biocare.',
        )}
        keywords={[
          'PolarisDX Events',
          'Nobel Biocare',
          'POC Diagnostik Messe',
          'DGI Kongress',
          'Kite Education Sylt',
        ]}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-36 bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
        {/* Decorative circles */}
        <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-brand-secondary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-32 w-80 h-80 rounded-full bg-brand-primary/20 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-container px-4 text-center lg:px-0 relative z-10">
          <Reveal width="100%" yOffset={20}>
            <div className="flex justify-center mb-4">
              <Breadcrumbs
                variant="dark"
                items={[{ label: 'Home', href: '/' }, { label: t('events:title') }]}
              />
            </div>
            <div className="flex justify-center">
              <div className="inline-block rounded p-px bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep shadow-lg shadow-brand-primary/20 mb-2">
                <div className="rounded-sm bg-slate-50 px-3 py-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-900">
                    2026
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl text-white">
              {t('events:title')}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/80">
              {t('events:intro')}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4">
          {/* Nobel Biocare Partner Badge */}
          <Reveal width="100%" yOffset={15}>
            <div className="flex items-center justify-center gap-3 mb-16">
              <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-brand-secondary/40" />
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-brand-secondary/20 shadow-sm">
                <Award className="w-4 h-4 text-brand-secondary" />
                <span className="text-sm font-medium text-brand-deep">
                  {t('events:premium_partner', 'Premium Partner: Nobel Biocare')}
                </span>
              </div>
              <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-brand-secondary/40" />
            </div>
          </Reveal>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-secondary via-brand-primary to-brand-deep lg:-translate-x-px" />

            {events.map((event, index) => {
              const isLeft = index % 2 === 0
              const SeasonIcon = getSeasonIcon(event.date)

              return (
                <Reveal key={event.id} width="100%" delay={index * 0.12} yOffset={25}>
                  <div
                    className={`relative flex items-start gap-6 lg:gap-0 mb-12 last:mb-0 ${
                      isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 z-10">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          event.partner
                            ? 'bg-gradient-to-br from-brand-secondary to-brand-primary'
                            : 'bg-gradient-to-br from-brand-primary to-brand-deep'
                        }`}
                      >
                        <SeasonIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Spacer for mobile (left side of timeline) */}
                    <div className="w-12 shrink-0 lg:hidden" />

                    {/* Card */}
                    <div
                      className={`flex-1 lg:w-[calc(50%-3rem)] ${
                        isLeft ? 'lg:pr-12' : 'lg:pl-12'
                      } ${isLeft ? '' : 'lg:ml-auto'}`}
                    >
                      <div
                        className={`group relative bg-white rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                          event.partner ? 'border-brand-secondary/30' : 'border-gray-100'
                        }`}
                      >
                        {/* Top accent bar */}
                        <div
                          className={`h-1 ${
                            event.partner
                              ? 'bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-secondary'
                              : 'bg-gradient-to-r from-brand-primary to-brand-deep'
                          }`}
                        />

                        <div className="p-6">
                          {/* Tags row */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {event.tag && (
                              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-brand-primary/10 text-brand-primary">
                                {event.tag}
                              </span>
                            )}
                            {event.partner && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-brand-secondary/10 text-brand-secondary">
                                <Award className="w-3 h-3" />
                                {event.partner}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">
                            {event.title}
                          </h3>

                          {/* Date & Location */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-brand-primary shrink-0" />
                              <span className="font-medium">
                                {formatDateRange(event.date, event.endDate, lang)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          {/* Description */}
                          {event.description && (
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Empty space for the other side on desktop */}
                    <div className="hidden lg:block lg:w-[calc(50%-3rem)]" />
                  </div>
                </Reveal>
              )
            })}
          </div>

          {/* Bottom flourish */}
          <Reveal width="100%">
            <div className="flex justify-center mt-16">
              <div className="w-3 h-3 rounded-full bg-brand-deep" />
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  )
}

export default EventsPage
