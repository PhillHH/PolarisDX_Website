import { useTranslation } from 'react-i18next'
import SectionHeader from '../ui/SectionHeader'
import ServiceCard from '../ui/ServiceCard'
import { services } from '../../data/services'

/**
 * ServicesSection Komponente.
 * Zeigt ein Gitter (Grid) von Service-Karten an.
 * Iteriert über die `services` Daten und rendert für jeden Eintrag eine `ServiceCard`.
 */
const ServicesSection = () => {
  const { t } = useTranslation('home')

  return (
    <section id="services" className="space-y-10">
      <SectionHeader
        caption={t('services.caption', 'DIAGNOSTIK-FOKUS')}
        title={t('services.title', 'Schlüsselbereiche der Präventivdiagnostik')}
      />

      {/* Grid-Layout für die Service-Karten (Responsive: 1 Spalte Mobil -> 3 Spalten Desktop) */}
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            // Titel und Beschreibung werden dynamisch aus den Übersetzungsdateien geladen
            title={t(`services.${service.translationKey}.title`)}
            description={t(`services.${service.translationKey}.description`)}
            to={`/services/${service.id}`}
          />
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
