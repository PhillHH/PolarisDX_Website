import Eyebrow from './Eyebrow'

type SectionHeaderProps = {
  id?: string
  caption: string
  title: string
  align?: 'left' | 'center'
  titleClassName?: string
  className?: string
}

const SectionHeader = ({
  id,
  caption,
  title,
  align = 'center',
  titleClassName,
  className = '',
}: SectionHeaderProps) => {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  // `t-h2-section` ist die kanonische Sektionstitel-Rolle (src/index.css,
  // AP05 PT05.2) und enthaelt denselben Ueberlaufschutz, der hier frueher
  // separat vor titleClasses stand.
  const titleClasses = titleClassName || 't-h2-section'

  return (
    <div id={id} className={`flex flex-col gap-3 ${alignment} ${className}`}>
      <Eyebrow>{caption}</Eyebrow>
      {/* Der Ueberlaufschutz gilt in BEIDEN Faellen: im Standardfall steckt er
          in `.t-h2-section`, bei eigenem titleClassName wird er davor
          gesetzt — sonst verloere eine Seite mit eigenem titleClassName ihn.
          Ohne ihn nimmt die H2 im Flex-Container ihre min-content-Breite an (das
          laengste Wort) und ragt zentriert links UND rechts aus dem
          Viewport - gemessen 430px bei 390px Sichtfeld. hyphens-auto trennt
          lange Komposita sauber ("Entzuendungsdia-gnostik") statt hart
          mitten im Wort; break-words bleibt der Rueckfall fuer Sprachen
          ohne Trennmuster. Gemessene Wirkung auf andere Seiten: nur zwei
          Ueberschriften (de/epigenetics, nl) werden dadurch KUERZER,
          Desktop bleibt unveraendert. */}
      <h2
        className={
          titleClassName
            ? `min-w-0 max-w-full hyphens-auto break-words ${titleClasses}`
            : titleClasses
        }
      >
        {title}
      </h2>
    </div>
  )
}

export default SectionHeader
