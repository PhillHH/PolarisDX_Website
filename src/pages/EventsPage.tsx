import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { events } from '../data/events';
import PageTransition from '../components/ui/PageTransition';
import Reveal from '../components/ui/Reveal';

const EventsPage: React.FC = () => {
  const { t } = useTranslation(['common', 'events']);

  return (
    <PageTransition>
      {/* Hero Section */}
      <div className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 bg-gradient-to-br from-primary via-primary-deep to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="mx-auto max-w-container px-4 text-center lg:px-0 relative z-10">
          <Reveal width="100%" yOffset={20}>
            <div className="flex justify-center">
              <div className="inline-block rounded p-[1px] bg-gradient-to-r from-secondary via-primary to-primary-deep shadow-lg shadow-primary/20 mb-2">
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
      <div className="min-h-screen bg-gray-900 pt-16 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {events.length > 0 ? (
              <div className="grid gap-6">
                {events.map((event, index) => (
                  <Reveal key={event.id || index} width="100%" delay={index * 0.1}>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white">{event.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span>
                                {new Date(event.date).toLocaleDateString()}
                                {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          {event.description && (
                            <p className="text-gray-300 mt-2">{event.description}</p>
                          )}
                        </div>

                        {event.link && (
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors shrink-0"
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
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">
                    {t('events:empty_title')}
                  </h3>
                  <p className="text-gray-400 max-w-md mx-auto">
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
