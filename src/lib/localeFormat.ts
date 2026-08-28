import { normalizeLanguage, type SupportedLanguage } from '../i18n'

const INTL_LOCALES: Record<SupportedLanguage, string> = {
  de: 'de-DE',
  en: 'en-GB',
  pl: 'pl-PL',
  fr: 'fr-FR',
  it: 'it-IT',
  es: 'es-ES',
  pt: 'pt-PT',
  da: 'da-DK',
  nl: 'nl-NL',
  cs: 'cs-CZ',
}

export function getIntlLocale(language: string | null | undefined): string {
  return INTL_LOCALES[normalizeLanguage(language)]
}

export function formatNumber(
  value: number,
  language: string | null | undefined,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(getIntlLocale(language), options).format(value)
}

export function formatCurrency(
  value: number,
  language: string | null | undefined,
  currency = 'EUR',
): string {
  return formatNumber(value, language, {
    style: 'currency',
    currency,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

export function formatDate(
  value: Date | number | string,
  language: string | null | undefined,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string {
  return new Intl.DateTimeFormat(getIntlLocale(language), options).format(new Date(value))
}
