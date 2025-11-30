// Importiert wiederverwendbare UI-Komponenten und Bild-Assets.
import { useTranslation } from 'react-i18next'
import PrimaryButton from '../ui/PrimaryButton' // Button-Komponente
import SectionHeader from '../ui/SectionHeader' // Kopfzeilen-Komponente für Abschnitte
import aboveTheFold from '../../assets/above_the_fold.png' // Bild für diesen Abschnitt

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
      <div className="hidden lg:relative lg:mx-auto lg:block lg:h-[380px] lg:max-w-md">
        {/* Dekoratives Hintergrund-Element, das absolut positioniert ist. */}
        {/* Die Position wird durch Tailwind-Klassen ('-left-8', 'top-8') gesteuert. */}
        <div className="absolute -left-8 top-12 h-full w-64 bg-primary" />

        {/* Container für das Hauptbild. */}
        <div className="relative h-full w-full bg-secondary shadow-2xl">
          <img
            src={aboveTheFold}
            alt="IglooPro device sending data securely to the cloud"
            className="h-full w-full object-cover"
          />
          {/* Ein transparenter Farbverlauf, der über dem Bild liegt, um einen leichten visuellen Effekt zu erzeugen. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/35 via-secondary/25 to-transparent" />
        </div>
      </div>

      {/* Rechte Spalte: Container für den Textinhalt. */}
      <div className="space-y-10 lg:space-y-6">
        {/* Kopfzeile des Abschnitts mit Untertitel und Haupttitel. */}
        <SectionHeader
          caption={t('about.caption', 'IHR PERFORMANCE-GARANT')}
          title={t('about.title', 'Exzellenz und Sicherheit: Der Standard, den wir setzen.')}
          align="left"
        />
        {/* Textabsätze mit Platzhaltertext. */}
        <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
          {t('about.text1', 'Das IglooPro ist ein Premium-Gerät...')}
        </p>
        <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
          {t('about.text2', 'Deshalb liefern wir exklusiv...')}
        </p>
        {/* Ein primärer Button, der als Link zum 'hero'-Abschnitt fungiert. */}
        <PrimaryButton as="a" href="#hero">
          {t('about.cta', 'Exklusiven Vorteil sichern')}
        </PrimaryButton>
      </div>
    </section>
  )
}

// Exportiert die Komponente, damit sie in anderen Teilen der Anwendung verwendet werden kann.
export default AboutSection
