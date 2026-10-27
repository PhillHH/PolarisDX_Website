/**
 * StandPlan — vereinfachter Lageplan eines Gemeinschaftsstands.
 *
 * SC-019 (Owner 2026-10-27): „Vereinfache auch den Lageplan …, ist zu technisch" und „klare
 * Wege und klar gekennzeichnete Fixpunkte mit Pfeilen von Eingängen". Der Messebauer-
 * Grundriss (LÜCO, Planung 058-26, M 1:75) nennt Maße, Möbel, Elektro und alle Mitaussteller.
 * Hier bleibt: Eingang → Halle (Geländeplan aus dem Ausstellerheft), die Gänge als Wege mit
 * Pfeilen zum Counter und nummerierte Fixpunkte, deren Legende aus der Locale kommt.
 *
 * Die Grafik liegt sprachneutral als Datei unter `public/events/` (nur Gangnummern, Ziffern und
 * das Wort „PolarisDX") und wird als <img> geladen — so kostet sie das htmlBytes-Budget der
 * Terminseite nur wenige Zeilen und lässt sich auch verschicken. Kein Map-SDK (EVENTS-CONTRACT).
 */
export interface StandPlanLabels {
  title: string
  hall: string
  alt: string
  /** Nummerierte Fixpunkte in der Reihenfolge der Ziffern in der Grafik. */
  legend: string[]
}

const StandPlan = ({ src, labels }: { src: string; labels: StandPlanLabels }) => (
  <figure className="mt-8 rounded-card border border-white/15 bg-white/5 p-4">
    <figcaption className="text-sm font-semibold text-white">{labels.title}</figcaption>
    <img
      src={src}
      alt={labels.alt}
      width={560}
      height={360}
      loading="lazy"
      className="mt-3 h-auto w-full"
    />
    {/* Browser-Nummerierung statt eigener Kreise: dieselben Ziffern wie in der Grafik, wenig HTML. */}
    <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-white/85">
      {labels.legend.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  </figure>
)

export default StandPlan
