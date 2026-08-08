/**
 * Artikel-Metadaten fuer die Anzeige aufbereiten.
 *
 * Die Rohdaten in `src/data/articles.ts` tragen englische Strings
 * ("28 Nov 2025", "6 min read"). Sie bleiben unangetastet — hier wird nur
 * fuer die Anzeige in der aktiven Sprache umgeformt.
 */

const MONTHS = 'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ')

/** "28 Nov 2025" → Date (UTC-Mitternacht) oder null, wenn das Format abweicht. */
export const parseArticleDate = (raw: string): Date | null => {
  const match = /^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/.exec(raw.trim())
  if (!match) return null
  const month = MONTHS.indexOf(match[2].slice(0, 3).toLowerCase())
  if (month < 0) return null
  // Date.UTC statt lokaler Zeit: sonst kippt das Datum je nach Zeitzone des
  // Besuchers um einen Tag und weicht vom serverseitig gerenderten Markup ab.
  return new Date(Date.UTC(Number(match[3]), month, Number(match[1])))
}

/** Sichtbares Datum in der aktiven Locale; unbekannte Formate bleiben roh. */
export const formatArticleDate = (raw: string, locale: string): string => {
  const date = parseArticleDate(raw)
  if (!date) return raw
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date)
  } catch {
    return raw
  }
}

/** ISO-8601-Datum fuer JSON-LD und og:article:published_time. */
export const articleDateIso = (raw: string): string =>
  parseArticleDate(raw)?.toISOString().slice(0, 10) ?? raw

/** "6 min read" → 6; null, wenn keine Zahl drinsteht. */
export const parseReadMinutes = (raw: string): number | null => {
  const match = /(\d+)/.exec(raw)
  return match ? Number(match[1]) : null
}
