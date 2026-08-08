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
  const titleClasses =
    titleClassName ||
    'text-hero-sm leading-[47px] font-medium tracking-tight text-heading lg:text-[44px] lg:leading-[52px]'

  return (
    <div id={id} className={`flex flex-col gap-3 ${alignment} ${className}`}>
      <Eyebrow>{caption}</Eyebrow>
      {/* min-w-0/max-w-full/break-words stehen bewusst VOR titleClasses und
          ausserhalb der titleClassName-Ueberschreibung: sonst verliert eine
          Seite mit eigenem titleClassName den Ueberlaufschutz. Ohne sie
          nimmt die H2 im Flex-Container ihre min-content-Breite an (das
          laengste Wort) und ragt zentriert links UND rechts aus dem
          Viewport - gemessen 430px bei 390px Sichtfeld. hyphens-auto trennt
          lange Komposita sauber ("Entzuendungsdia-gnostik") statt hart
          mitten im Wort; break-words bleibt der Rueckfall fuer Sprachen
          ohne Trennmuster. Gemessene Wirkung auf andere Seiten: nur zwei
          Ueberschriften (de/epigenetics, nl) werden dadurch KUERZER,
          Desktop bleibt unveraendert. */}
      <h2 className={`min-w-0 max-w-full hyphens-auto break-words ${titleClasses}`}>{title}</h2>
    </div>
  )
}

export default SectionHeader
