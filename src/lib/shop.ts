/**
 * Verweise auf den Online-Shop (Shopify, shop.polarisdx.net).
 *
 * Uebernommen aus `main@e66a562` (Owner-Entscheidung O1 vom 2026-10-16, hebt
 * DEC-RL-015 auf). Der Shop spricht Deutsch (Wurzel) und Englisch (/en); alle
 * anderen Sprachen der Website fuehren auf die englische Fassung, damit
 * niemand auf einer deutschen Seite landet, die er nicht lesen kann.
 *
 * `/shop` auf dieser Website bleibt INTENTIONAL_404 — der Shop ist eine
 * fremde Domain, kein Teil der Route Registry.
 */
export const SHOP_ORIGIN = 'https://shop.polarisdx.net'

export function shopUrl(language: string | undefined, path = ''): string {
  const lang = (language || 'de').split('-')[0]
  const prefix = lang === 'de' ? '' : '/en'
  return `${SHOP_ORIGIN}${prefix}${path}`
}
