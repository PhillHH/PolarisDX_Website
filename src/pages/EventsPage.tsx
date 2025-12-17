import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import { events } from '../data/events';

const EventsPage: React.FC = () => {
  const { t } = useTranslation(['common']);

  return (
    <div className="min-h-screen bg-gray-900 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <SectionHeader
          caption={t('events.subtitle', 'Messen & Veranstaltungen')}
          title={t('events.title', 'Treffen Sie uns persönlich')}
          align="center"
          className="mb-16"
        />

        <div className="max-w-4xl mx-auto">
          {events.length > 0 ? (
            <div className="grid gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                >
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
                        <span>Details</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/5 rounded-3xl border border-white/10"
            >
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">
                {t('events.empty_title', 'Aktuell keine Termine')}
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {t('events.empty_text', 'Derzeit stehen keine Messetermine oder Veranstaltungen an. Schauen Sie später wieder vorbei oder abonnieren Sie unseren Newsletter.')}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
