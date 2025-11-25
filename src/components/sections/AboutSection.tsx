// Importiert wiederverwendbare UI-Komponenten und Bild-Assets.
import PrimaryButton from '../ui/PrimaryButton' // Button-Komponente
import SectionHeader from '../ui/SectionHeader' // Kopfzeilen-Komponente für Abschnitte
import aboveTheFold from '../../assets/above_the_fold.png' // Bild für diesen Abschnitt

// Definiert die 'AboutSection'-Komponente, die einen Abschnitt der Webseite darstellt.
const AboutSection = () => {
  return (
    // Hauptcontainer des Abschnitts mit der ID 'about' für Anker-Links.
    // Verwendet ein Grid-Layout, das auf großen Bildschirmen zweispaltig wird.
    <section
      id="about"
      className="grid items-center gap-10 lg:grid-cols-2"
    >
      {/* Linke Spalte: Container für das Bild und das dekorative Hintergrund-Element. */}
      <div className="relative mx-auto h-[380px] max-w-md">
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
      <div className="space-y-6">
        {/* Kopfzeile des Abschnitts mit Untertitel und Haupttitel. */}
        <SectionHeader
          caption="IHR PERFORMANCE-GARANT"
          title="Exzellenz und Sicherheit: Der Standard, den wir setzen."
          align="left"
        />
        {/* Textabsätze mit Platzhaltertext. */}
        <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
          Das IglooPro ist ein Premium-Gerät. Doch wahre Premium-Leistung entsteht erst durch eine perfektionierte, risikofreie Inbetriebnahme. Eine Standardlieferung überlässt Ihnen die Komplexität. Wir übernehmen die Verantwortung für das Ergebnis.
        </p>
        <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
          Deshalb liefern wir exklusiv das 48-Stunden-Setup-Versprechen. Unsere Performance-Säulen garantieren, dass Ihr POC-Workflow von der ersten Sekunde an optimiert ist und Sie die diagnostische Exzellenz sofort nutzen können.
        </p>
        {/* Ein primärer Button, der als Link zum 'hero'-Abschnitt fungiert. */}
        <PrimaryButton as="a" href="#hero">
          Exklusiven Vorteil sichern
        </PrimaryButton>
      </div>
    </section>
  )
}

// Exportiert die Komponente, damit sie in anderen Teilen der Anwendung verwendet werden kann.
export default AboutSection

