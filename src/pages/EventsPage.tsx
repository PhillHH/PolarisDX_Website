import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { events } from '../data/events';
import { SEOHead, createBreadcrumbSchema, createEventSchema } from '../components/seo';
import PageTransition from '../components/ui/PageTransition';
import Reveal from '../components/ui/Reveal';

const EventsPage: React.FC = () => {
  const { t } = useTranslation(['common', 'events']);

  const eventSchemas = useMemo(() => {
    return events.map((event) =>
      createEventSchema({
        name: event.title,
        description: event.description || event.title,
        startDate: event.date,
        endDate: event.endDate,
        location: event.location,
        url: event.link,
      })
    );
  }, []);

  const structuredData = useMemo(() => [
    createBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Events', url: '/events' },
    ]),
    ...eventSchemas,
  ], [eventSchemas]);

  return (
    <PageTransition>
      <SEOHead
        title={t('events:seo_title', 'Events & Messen - PolarisDX POC Diagnostik')}
        description={t('events:seo_description', 'Treffen Sie PolarisDX auf Messen und Events. Erleben Sie den IglooPro POC-Reader live und erfahren Sie mehr über Point-of-Care Diagnostik.')}
        canonical="https://polarisdx.net/events"
        keywords={['PolarisDX Events', 'Medica', 'POC Diagnostik Messe', 'IglooPro live']}
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <div className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="mx-auto max-w-container px-4 text-center lg:px-0 relative z-10">
          <Reveal width="100%" yOffset={20}>
            <div className="flex justify-center">
              <div className="inline-block rounded p-px bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep shadow-lg shadow-brand-primary/20 mb-2">
                <div className="rounded-sm bg-slate-50 px-3 py-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-900">
                    {t('events:subtitle')}
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl text-white">
              {t('events:title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              {t('events:intro')}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Events List */}
      <div className="min-h-screen bg-slate-50 pt-16 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {events.length > 0 ? (
              <div className="grid gap-6">
                {events.map((event, index) => (
                  <Reveal key={event.id || index} width="100%" delay={index * 0.1}>
                    <div className="bg-white shadow-lg border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-brand-primary" />
                              <span>
                                {new Date(event.date).toLocaleDateString()}
                                {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-brand-primary" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          {event.description && (
                            <p className="text-gray-600 mt-2">{event.description}</p>
                          )}
                        </div>

                        {event.link && (
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white hover:bg-brand-deep rounded-xl transition-colors shrink-0 font-medium"
                          >
                            <span>{t('events:details')}</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal width="100%">
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-md">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {t('events:empty_title')}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {t('events:empty_text')}
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EventsPage;
