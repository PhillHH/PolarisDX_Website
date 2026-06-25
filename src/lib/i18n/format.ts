/**
 * lib/i18n/format.ts — locale-bewusste Formatierung via `Intl.*` (Phase 5 §5.5).
 *
 * Kein WEIRD-Bias: KEINE hand-gepflegten Monatsnamen-Tabellen, KEIN festes
 * `en-US`. Datums-/Zahlenausgabe folgt der Request-Locale (`i18n.language`)
 * über die native `Intl`-API — korrekt für ALLE 10 unterstützten Sprachen,
 * nicht nur de/en.
 */

/** Normalisiert einen i18next-Sprachcode auf ein BCP-47-Tag für `Intl`. */
function toLocale(lang: string | undefined): string {
  // i18next liefert z. B. 'de', 'en'; Intl akzeptiert beides — leere Werte
  // fallen auf 'de' (Primärsprache der Site) zurück, nie auf 'en-US'.
  return (lang && lang.trim()) || 'de'
}

/** Einzelnes Datum, locale-bewusst (z. B. „14. März 2026" / „14 March 2026"). */
export function formatDate(
  input: string | Date,
  lang?: string,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
): string {
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(toLocale(lang), options).format(date)
}

/**
 * Datums-Bereich, locale-bewusst. Nutzt `formatRange`, wo verfügbar (kürzt
 * gemeinsame Bestandteile zusammen), mit defensivem Fallback auf zwei
 * Einzeldaten.
 */
export function formatDateRange(date: string, endDate?: string, lang?: string): string {
  const start = new Date(date)
  if (Number.isNaN(start.getTime())) return ''
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  const fmt = new Intl.DateTimeFormat(toLocale(lang), opts)

  if (!endDate) return fmt.format(start)
  const end = new Date(endDate)
  if (Number.isNaN(end.getTime())) return fmt.format(start)

  try {
    return fmt.formatRange(start, end)
  } catch {
    return `${fmt.format(start)} – ${fmt.format(end)}`
  }
}

/** Zahl, locale-bewusst (Tausender-/Dezimaltrennzeichen je Locale). */
export function formatNumber(
  value: number,
  lang?: string,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(toLocale(lang), options).format(value)
}
