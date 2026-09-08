/**
 * Artikel-Metadaten fuer die Anzeige aufbereiten.
 *
 * Die Rohdaten in `src/data/articles.ts` tragen kanonische ISO-Kalendertage.
 * Dieser Helper veraendert ihre Wahrheit nicht, sondern formatiert sie nur
 * fuer die Anzeige in der aktiven Sprache.
 */

/** ISO calendar day -> Date (UTC midnight), or null for invalid input. */
export const parseArticleDate = (raw: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim())
  if (!match) return null
  const value = new Date(`${raw}T00:00:00Z`)
  if (Number.isNaN(value.valueOf()) || value.toISOString().slice(0, 10) !== raw) return null
  return value
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

/** ISO-8601 date for JSON-LD and og:article:published_time; no raw fallback. */
export const articleDateIso = (raw: string): string => {
  if (!parseArticleDate(raw)) throw new Error(`Invalid article ISO date: ${raw}`)
  return raw
}

/** "6 min read" → 6; null, wenn keine Zahl drinsteht. */
export const parseReadMinutes = (raw: string): number | null => {
  const match = /(\d+)/.exec(raw)
  return match ? Number(match[1]) : null
}

const STRUCTURAL_CONTENT_KEYS = new Set(['type', 'image', 'url'])
const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu

/** Visible prose only; discriminators, asset paths and URLs are not reading text. */
const collectReadableStrings = (value: unknown, key?: string): string[] => {
  if (typeof value === 'string') return key && STRUCTURAL_CONTENT_KEYS.has(key) ? [] : [value]
  if (Array.isArray(value)) return value.flatMap((entry) => collectReadableStrings(entry))
  if (!value || typeof value !== 'object') return []
  return Object.entries(value).flatMap(([entryKey, entry]) =>
    collectReadableStrings(entry, entryKey),
  )
}

export const countArticleWords = (...content: unknown[]): number =>
  collectReadableStrings(content).reduce(
    (count, text) => count + (text.match(WORD_PATTERN)?.length ?? 0),
    0,
  )

/** Deterministic display estimate: visible lead + body at 200 words/minute. */
export const calculateArticleReadMinutes = (...content: unknown[]): number =>
  Math.max(1, Math.ceil(countArticleWords(...content) / 200))
