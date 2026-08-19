/**
 * Gemeinsame Schriftgroessen, Pfade und Helfer der Epigenetik-Strecke.
 *
 * Eigene Datei und nicht in EpiSubpage.tsx: eine Komponentendatei, die auch
 * Konstanten exportiert, nimmt dem Fast Refresh die Zuordnung
 * (react-refresh/only-export-components).
 */

/**
 * Fliesstext, Lead und Kleinlabel — identisch zur Programmseite, damit die
 * Lesegroesse beim Wechsel auf eine Vertiefungsseite nicht springt.
 */
export const BODY = 'text-base leading-7 lg:text-[17px] lg:leading-8'
export const LEAD = 'text-lg leading-relaxed text-gray-600 lg:text-xl lg:leading-relaxed'
export const LABEL = 'text-xs font-semibold uppercase tracking-[0.16em] text-gray-600'

/** Reveal rendert zwei verschachtelte divs; h-full muss auf beide. */
export const STRETCH = 'h-full [&>div]:h-full'

/** public/ wird nach dist/client kopiert — die oeffentliche URL ist /downloads/... */
export const ASSET_BASE = '/downloads/epigenetics/'

/**
 * i18next liefert bei fehlendem Key den Key-String zurueck statt eines Arrays.
 * Der Guard haelt SSR am Leben, falls ein Locale-File unvollstaendig ist.
 */
export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

/**
 * Die drei Vertiefungsseiten der Strecke, an einer Stelle.
 *
 * EpiSubpage baut daraus den Weiterlesen-Block und laesst dabei die Seite
 * weg, auf der der Leser gerade steht — deshalb traegt jede Seite ihren
 * `source`-Schluessel auch hier. Beschriftungen sind bestehende Schluessel
 * aus dem Namensraum `epigenetics`, in allen zehn Sprachen vorhanden.
 */
export interface Vertiefung {
  /** Muss dem `source`-Prop der jeweiligen Seite entsprechen. */
  key: string
  to: string
  captionKey: string
  titleKey: string
}

export const VERTIEFUNGEN: Vertiefung[] = [
  {
    key: 'grundlagen',
    to: '/epigenetics/grundlagen',
    captionKey: 'principle.caption',
    titleKey: 'principle.title',
  },
  {
    key: 'studienlage',
    to: '/epigenetics/studienlage',
    captionKey: 'evidence.caption',
    titleKey: 'evidence.title',
  },
  {
    key: 'unterlagen',
    to: '/epigenetics/unterlagen',
    captionKey: 'downloads.caption',
    titleKey: 'downloads.title',
  },
]

/**
 * Beschreibungstext fuer die Suchmaschine aus vorhandenen Saetzen bauen.
 *
 * Google schneidet bei rund 160 Zeichen ab. Die vorige Fassung kappte hart bei
 * 155 und haengte drei Punkte an — gemessen brach das 12 von 30
 * Sprache-Seite-Kombinationen mitten im Satz nach einem Komma ab
 * ("...Veranlagung und Regulationsprozesse,…"). Weitere 9 lagen bei 75-81
 * Zeichen, also bei rund der Haelfte des nutzbaren Platzes.
 *
 * Deshalb zwei Regeln, beide ohne neuen Text:
 * 1. Ist der Einleitungssatz zu kurz, darf ein zweiter, bereits freigegebener
 *    Satz angehaengt werden (`extra`).
 * 2. Gekuerzt wird an der letzten Satzgrenze; gibt es keine im nutzbaren
 *    Bereich, am letzten Wort. Nie mitten im Wort.
 */
export const META_MIN = 120
export const META_MAX = 158

export function metaDescription(lead: string, extra?: string): string {
  const voll = extra && lead.length < META_MIN ? `${lead} ${extra}`.trim() : lead
  if (voll.length <= META_MAX) return voll

  // Erst versuchen, mit GANZEN Saetzen in die Reichweite zu kommen.
  let aus = ''
  for (const satz of voll.split(/(?<=[.!?])\s+/)) {
    const kandidat = `${aus} ${satz}`.trim()
    if (kandidat.length > META_MAX) break
    aus = kandidat
  }
  if (aus.length >= META_MIN) return aus

  // Sonst am letzten Wort kappen — nie mitten im Wort, und ohne das
  // Satzzeichen davor: "...Regulationsprozesse,…" sah nach einem Fehler aus.
  //
  // GRENZE, bewusst so belassen: mehrere Leads sind EIN Satz von 188 Zeichen.
  // Eine vollstaendige Aussage passt dort nicht in 158 Zeichen, ohne einen
  // neuen Satz zu schreiben — und der kostet zehn Sprachen plus Freigabe.
  // Das gehoert in die Redaktionsrunde, nicht in eine Struktur-Aufgabe.
  const bereich = voll.slice(0, META_MAX)
  const wort = bereich.lastIndexOf(' ')
  return `${(wort > 0 ? voll.slice(0, wort) : bereich).replace(/[\s,;:–—-]+$/, '')}…`
}
