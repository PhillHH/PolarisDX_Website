/**
 * Die bekannten Panelnamen — und die einzige Stelle, an der ein von aussen
 * gelieferter `panel`-Parameter in einen anzeigbaren Namen uebersetzt wird.
 *
 * HINTERGRUND: `?panel=` kommt aus der URL, also von jedem, der einen Link
 * schreibt. Der Wert stand bisher ungeprueft im Kontexthinweis ueber dem
 * Formular, im vorbelegten Freitext und in der Benachrichtigung — und damit
 * eine beliebige Behauptung als Aussage von PolarisDX im servergerenderten
 * HTML. Deshalb gilt: nur was hier steht, wird angezeigt; alles andere faellt
 * still weg.
 *
 * WARUM EINE EIGENE LISTE UND NICHT `BEFUNDE` AUS ./index.ts: an jedem Befund
 * dort haengen zwei JSON-Inhalte, zusammen rund 350 KB. Sie gehoeren in den
 * lazy geladenen Musterbefund-Chunk; das Kontaktformular liegt auf einer
 * anderen Route und wuerde sie sonst komplett mitziehen. Die Liste bleibt
 * trotzdem an der Quelle: panelNames.test.ts prueft sie Zeile fuer Zeile gegen
 * BEFUNDE und BEFUND_ORDER. Kommt ein Panel dazu oder aendert sich ein Name,
 * faellt der Test — nicht erst der Hinweis auf der Seite.
 *
 * DE UND EN: die Musterbefund-Seiten und die Merkliste verlinken den Namen in
 * der Sprache der Seite, beide Fassungen sind also gueltige Eingaben. Die
 * uebrigen Locales fuehren dieselben Namen wie EN, eine dritte Fassung gibt es
 * nicht.
 */

export interface PanelEntry {
  slug: string
  /** Gueltige Schreibweisen, Reihenfolge [de, en]; identische entfallen. */
  names: readonly string[]
}

export const PANELS: readonly PanelEntry[] = [
  { slug: 'metabolic-health', names: ['Metabolic Health'] },
  { slug: 'healthy-aging', names: ['Healthy Aging'] },
  { slug: 'biologische-altersuhr', names: ['Biologische Altersuhr', 'Biological Age Clock'] },
  { slug: 'telomer-analyse', names: ['Telomer-Analyse', 'Telomere Analysis'] },
  { slug: 'stress-monitor', names: ['Stress Monitor'] },
  { slug: 'healthy-sport', names: ['Healthy Sport'] },
] as const

/**
 * Vergleichsform: Gross-/Kleinschreibung und Leerzeichen sollen einen Link
 * nicht scheitern lassen, der aus einer Mail oder einer Handeingabe kommt.
 * Ausgegeben wird trotzdem immer die Schreibweise aus PANELS.
 */
const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase()

const BY_NAME = new Map<string, { slug: string; name: string }>(
  PANELS.flatMap((panel) =>
    panel.names.map((name) => [normalize(name), { slug: panel.slug, name }]),
  ),
)

/** Obergrenze gegen einen aufgeblasenen Fremdparameter. Sie ersetzt die
 *  Pruefung nicht, sie begrenzt nur, wie viel ueberhaupt geprueft wird: aus
 *  der Merkliste kommen bis zu sechs Namen in einem `panel`, zusammen rund
 *  100 Zeichen. */
const MAX_LENGTH = 200

/**
 * Die kommaseparierte Merkliste aus `?panel=` in kanonische Panelnamen
 * uebersetzen. Jeder Eintrag wird einzeln geprueft; unbekannte werden
 * verworfen, ein Panel erscheint hoechstens einmal (auch wenn es einmal
 * deutsch und einmal englisch geschickt wird). Ist nichts uebrig, kommt ein
 * leeres Feld zurueck — der Aufrufer zeigt dann keinen Hinweis.
 */
export const resolvePanelNames = (raw: string | null | undefined): string[] => {
  if (!raw) return []
  const seen = new Set<string>()
  const resolved: string[] = []
  for (const part of raw.slice(0, MAX_LENGTH).split(',')) {
    const hit = BY_NAME.get(normalize(part))
    if (!hit || seen.has(hit.slug)) continue
    seen.add(hit.slug)
    resolved.push(hit.name)
  }
  return resolved
}
