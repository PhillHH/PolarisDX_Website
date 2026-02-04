// Importiert wiederverwendbare UI-Komponenten und Bild-Assets.
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PrimaryButton from '../ui/PrimaryButton' // Button-Komponente
import SectionHeader from '../ui/SectionHeader' // Kopfzeilen-Komponente für Abschnitte
import iglooExplode from '../../assets/igloo_explode.png' // Bild für diesen Abschnitt

// Definiert die 'AboutSection'-Komponente, die einen Abschnitt der Webseite darstellt.
const AboutSection = () => {
  const { t } = useTranslation('home')

  return (
    // Hauptcontainer des Abschnitts mit der ID 'about' für Anker-Links.
    // Verwendet ein Grid-Layout, das auf großen Bildschirmen zweispaltig wird.
    <section
      id="about"
      className="grid items-center gap-10 lg:grid-cols-2"
    >
      {/* Linke Spalte: Container für das Bild und das dekorative Hintergrund-Element. */}
      {/* Mobil ausgeblendet, nur auf Desktop (lg) sichtbar */}
      <div className="hidden lg:relative lg:mx-auto lg:block lg:h-[728px] lg:max-w-3xl">
        {/* Dunkelblauer Akzentbalken bleibt erhalten. */}
        <div className="absolute -left-8 top-12 h-full w-64 bg-brand-primary" />

        {/* Hauptbild ohne hellen Hintergrund/Verlauf. */}
        <div className="relative h-full w-full">
          <img
            src={iglooExplode}
            alt="IglooPro device sending data securely to the cloud"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Rechte Spalte: Container für den Textinhalt. */}
      <div className="space-y-8 lg:space-y-6 lg:max-w-none">
        {/* Kopfzeile des Abschnitts mit Untertitel und Haupttitel. */}
        <SectionHeader
          caption={t('about.caption', 'IHR PERFORMANCE-GARANT')}
          title={t('about.title', 'Exzellenz und Sicherheit: Der Standard, den wir setzen.')}
          align="left"
          titleClassName="text-[clamp(32px,7vw,64px)] leading-[clamp(38px,7.6vw,72px)] font-medium tracking-[-0.02em] text-gray-900 max-w-xl lg:max-w-full"
          className="gap-3 lg:max-w-full"
        />
        {/* Textabsätze mit Platzhaltertext. */}
        <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
          {t('about.text1', 'Das IglooPro ist ein Premium-Gerät...')}
        </p>
        <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
          {t('about.text2', 'Deshalb liefern wir exklusiv...')}
        </p>
        {/* Ein primärer Button, der als Link zum 'hero'-Abschnitt fungiert. */}
        <div className="flex justify-center pt-1 sm:pt-2 lg:justify-start">
          <PrimaryButton as={Link} to="/contact" size="lg">
            {t('about.cta', 'Exklusiven Vorteil sichern')}
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}

// Exportiert die Komponente, damit sie in anderen Teilen der Anwendung verwendet werden kann.
export default AboutSection
