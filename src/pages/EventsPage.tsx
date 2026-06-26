import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, MapPin, Award, Wind } from 'lucide-react'
import { events } from '../data/events'
import { SEOHead, createBreadcrumbSchema, createEventSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import { Badge, Breadcrumbs, Eyebrow, GradientHero } from '~/design-system'
// Locale-bewusste Datumsformatierung via Intl.* (§5.5) — ersetzt die frühere
// hand-gepflegte Monatsnamen-Tabelle (nur de/en, sonst stiller de-Fallback).
import { formatDateRange } from '../lib/i18n/format'

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
      <GradientHero minHeight="min-h-[340px]" innerClassName="text-center">
        <Reveal width="100%" yOffset={20}>
          <div className="flex justify-center mb-4">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: t('events:title') }]} />
          </div>
          <div className="flex justify-center">
            <Eyebrow size="sm" className="mb-2">
              2026
            </Eyebrow>
          </div>
          <h1 className="text-display-sm font-medium tracking-tight text-fg-on-dark">
            {t('events:title')}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-fg-on-dark/80">
            {t('events:intro')}
          </p>
        </Reveal>
      </GradientHero>

      {/* Timeline Section */}
      <div className="bg-bg py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4">
          {/* Nobel Biocare Partner Badge */}
          <Reveal width="100%" yOffset={15}>
            <div className="flex items-center justify-center gap-3 mb-16">
              <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-brand-secondary/40" />
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface border border-brand-secondary/20 shadow-1">
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
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2 ${
                          event.partner
                            ? 'bg-gradient-to-br from-brand-secondary to-brand-primary'
                            : 'bg-gradient-to-br from-brand-primary to-brand-deep'
                        }`}
                      >
                        <SeasonIcon className="w-5 h-5 text-fg-on-dark" />
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
                        className={`group relative bg-surface rounded-2xl border shadow-1 hover:shadow-2 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                          event.partner
                            ? 'border-brand-secondary/30'
                            : 'border-[var(--color-border)]'
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
                              <Badge variant="brand" uppercase>
                                {event.tag}
                              </Badge>
                            )}
                            {event.partner && (
                              <Badge variant="accent">
                                <Award className="w-3 h-3" />
                                {event.partner}
                              </Badge>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-fg-heading mb-3 group-hover:text-brand-primary transition-colors">
                            {event.title}
                          </h3>

                          {/* Date & Location */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-fg-muted mb-3">
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
                            <p className="text-fg text-sm leading-relaxed">{event.description}</p>
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
