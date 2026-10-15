import { toneClasses } from './tone'
import { domainFor, zonesFor } from './scaleDomain'

/**
 * Die Rampe ohne Wert — nur die Zonen einer Ergebnisform.
 *
 * Die Vergleichstabelle nennt drei Ergebnisformen nebeneinander und erklaert
 * sie in der Legende bisher nur in Worten. Damit blieb die wichtigste Spalte
 * der Auswahl abstrakt. Die Rampe zeigt jede Form in derselben Farbfolge und
 * derselben Leserichtung, in der sie spaeter im Befund wieder auftaucht.
 *
 * Wo das Quelldokument keine Schwellen ausweist — die Jahresskala —, bleibt
 * sie grau. Eine eingefaerbte Rampe waere dort eine Aussage ueber Grenzen,
 * die es nicht gibt.
 *
 * Rein schmueckend: die Legende danebendran sagt dasselbe in Worten, deshalb
 * aria-hidden statt einer zweiten Vorlesung fuer den Screenreader.
 */
export const ScaleRamp = ({ kind }: { kind: string }) => {
  const zones = zonesFor(kind)
  const dom = domainFor(kind, 0)
  const span = dom.max - dom.min || 1
  const W = 100
  const H = 8

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-2 w-full rounded-full"
    >
      {zones.length > 0 ? (
        zones.map((z) => (
          <rect
            key={z.tone}
            x={((z.from - dom.min) / span) * W}
            y={0}
            width={((z.to - z.from) / span) * W}
            height={H}
            className={toneClasses(z.tone).zone}
          />
        ))
      ) : (
        <rect x={0} y={0} width={W} height={H} className="fill-slate-100" />
      )}
    </svg>
  )
}
