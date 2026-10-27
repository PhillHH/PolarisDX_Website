import { parseIsoDate } from '../data/events'

/**
 * Datumsbeschriftung für Termine — je Sprache Monats-Kurzform und Tagespunkt.
 *
 * SC-019 (2026-10-27): aus `EventsPage` herausgelöst, weil das „Aktuell"-Band der
 * Startseite denselben Text braucht (ein Satz Regeln, nicht zwei).
 */

/** Monats-Kurzformen je Sprache — sonst stünde in allen Sprachen "Mär"/"Okt"/"Dez". */
export const monthNames: Record<string, string[]> = {
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  fr: [
    'janv.',
    'févr.',
    'mars',
    'avr.',
    'mai',
    'juin',
    'juil.',
    'août',
    'sept.',
    'oct.',
    'nov.',
    'déc.',
  ],
  it: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  pl: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
  nl: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  da: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  cs: ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'],
}

/** Sprachen, die hinter die Tageszahl einen Punkt setzen (12.–13. Jun 2026). */
export const DAY_DOT_LANGUAGES = new Set(['de', 'cs', 'da'])

export function eventLanguage(language: string | undefined): string {
  const lang = (language || 'de').split('-')[0]
  return lang in monthNames ? lang : 'de'
}

/** Zeitraum mit Jahr, z. B. „16.–19. Nov 2026" / „Nov 16–19, 2026". */
export function formatEventRange(language: string | undefined, date: string, endDate?: string) {
  const lang = eventLanguage(language)
  const months = monthNames[lang]
  const s = parseIsoDate(date)
  const e = endDate ? parseIsoDate(endDate) : s
  const sameMonth = s.year === e.year && s.month === e.month

  if (lang === 'en') {
    if (sameMonth) {
      const days = s.day === e.day ? `${s.day}` : `${s.day}–${e.day}`
      return `${months[s.month]} ${days}, ${s.year}`
    }
    return `${months[s.month]} ${s.day} – ${months[e.month]} ${e.day}, ${e.year}`
  }

  const dot = DAY_DOT_LANGUAGES.has(lang) ? '.' : ''
  if (sameMonth) {
    const days = s.day === e.day ? `${s.day}${dot}` : `${s.day}${dot}–${e.day}${dot}`
    return `${days} ${months[s.month]} ${s.year}`
  }
  return `${s.day}${dot} ${months[s.month]} – ${e.day}${dot} ${months[e.month]} ${e.year}`
}

/** Ein einzelner Tag ohne Jahr — für den "bis …"-Hinweis laufender Termine. */
export function formatEventDay(language: string | undefined, date: string) {
  const lang = eventLanguage(language)
  const d = parseIsoDate(date)
  if (lang === 'en') return `${monthNames[lang][d.month]} ${d.day}`
  const dot = DAY_DOT_LANGUAGES.has(lang) ? '.' : ''
  return `${d.day}${dot} ${monthNames[lang][d.month]}`
}
