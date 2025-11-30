import { useTranslation } from 'react-i18next'
import PrimaryButton from '../ui/PrimaryButton'
import SectionHeader from '../ui/SectionHeader'
import IglooProImage from '../../assets/Igloo-pro-frontal.png'

/**
 * DiagnosticsPitchSection (ehemals DoctorsSection).
 * Zeigt einen Bereich, der ein spezifisches Produkt (z.B. Igloo Pro) oder eine Kernkompetenz hervorhebt.
 * Layout: Text links, Bild rechts (Desktop).
 */
const DiagnosticsPitchSection = () => {
  const { t } = useTranslation('home')

  return (
    <section
      id="diagnostics-pitch"
      className="grid items-center gap-10 lg:grid-cols-5"
    >
      {/* Linke Spalte (3/5 Breite): Textinhalt */}
      <div className="relative order-2 space-y-8 lg:order-1 lg:col-span-3 lg:space-y-0">
        <SectionHeader
          caption={t('doctors.caption', 'DIAGNOSTIK-FOKUS')}
          title={t('doctors.title', 'Präzise Diagnostik. Sofortige Ergebnisse am Point-of-Care.')}
          align="left"
        />

        <p className="mt-6 text-sm leading-relaxed text-gray-500 sm:text-base lg:mt-6">
          {t('doctors.description', 'Entdecken Sie mit Systemen wie dem Igloo Pro von DX365...')}
        </p>

        <PrimaryButton as="a" href="/produkte/igloo-pro" className="mt-10 lg:mt-8">
          {t('doctors.cta', 'Zum Igloo Pro System')}
        </PrimaryButton>
      </div>

      {/* Rechte Spalte (2/5 Breite): Produktbild mit Hintergrund-Akzent */}
      {/* Nur Desktop */}
      <div className="hidden lg:relative lg:order-2 lg:col-span-2 lg:block">
        {/* Dekorativer Hintergrund */}
        <div className="absolute -right-4 bottom-5 top-10 w-60 rounded-3xl bg-primary" />
        {/* Bildcontainer */}
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={IglooProImage}
            alt="Igloo Pro device"
            className="object-cover w-full h-full scale-[1.375] translate-x-8 transform"
          />
        </div>
      </div>
    </section>
  )
}

export default DiagnosticsPitchSection
