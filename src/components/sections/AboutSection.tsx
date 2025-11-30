import { useTranslation } from 'react-i18next'
import PrimaryButton from '../ui/PrimaryButton'
import SectionHeader from '../ui/SectionHeader'
import aboveTheFold from '../../assets/above_the_fold.png'

/**
 * AboutSection Komponente.
 * Zeigt einen "Über uns"-Teaser-Bereich an, typischerweise auf der Startseite.
 * Besteht aus einem Bild links (Desktop) und Textinhalt rechts.
 */
const AboutSection = () => {
  const { t } = useTranslation('home')

  return (
    <section
      id="about"
      className="grid items-center gap-10 lg:grid-cols-2"
    >
      {/* Linke Spalte: Bild mit dekorativem Hintergrund */}
      {/* Nur auf Desktop-Größe (lg) sichtbar */}
      <div className="hidden lg:relative lg:mx-auto lg:block lg:h-[380px] lg:max-w-md">
        {/* Dekoratives Rechteck hinter dem Bild */}
        <div className="absolute -left-8 top-12 h-full w-64 bg-primary" />

        {/* Container für das Bild */}
        <div className="relative h-full w-full bg-secondary shadow-2xl">
          <img
            src={aboveTheFold}
            alt="IglooPro device sending data securely to the cloud"
            className="h-full w-full object-cover"
          />
          {/* Overlay-Gradient für visuellen Effekt */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/35 via-secondary/25 to-transparent" />
        </div>
      </div>

      {/* Rechte Spalte: Textinhalt */}
      <div className="space-y-10 lg:space-y-6">
        <SectionHeader
          caption={t('about.caption', 'IHR PERFORMANCE-GARANT')}
          title={t('about.title', 'Exzellenz und Sicherheit: Der Standard, den wir setzen.')}
          align="left"
        />

        <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
          {t('about.text1', 'Das IglooPro ist ein Premium-Gerät...')}
        </p>
        <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
          {t('about.text2', 'Deshalb liefern wir exklusiv...')}
        </p>

        <PrimaryButton as="a" href="#hero">
          {t('about.cta', 'Exklusiven Vorteil sichern')}
        </PrimaryButton>
      </div>
    </section>
  )
}

export default AboutSection
