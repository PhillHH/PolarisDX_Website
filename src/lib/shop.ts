/**
 * Verweise auf die beiden Online-Shops (Shopify).
 *
 * - `shop.polarisdx.net` — Praxis-Shop fuer Fachkreise (IglooPro-Reader,
 *   Testkits, Nahrungsergaenzung). Uebernommen aus `main@e66a562`
 *   (Owner-Entscheidung O1 vom 2026-10-16, aendert DEC-RL-015).
 * - `panels.polarisdx.net` — Panel-Shop (Epigenetik-Panels aus Kapillarblut,
 *   eigener Shopify-Store). Owner-Auftrag 2026-10-17 (SC-007): „muss
 *   unbedingt von der Hauptseite und von der Startseite aus erreichbar sein".
 *
 * Beide Shops sprechen Deutsch (Wurzel) und Englisch (/en); alle anderen
 * Sprachen der Website fuehren auf die englische Fassung, damit niemand auf
 * einer deutschen Seite landet, die er nicht lesen kann.
 *
 * `/shop` auf dieser Website bleibt INTENTIONAL_404 — beide Shops sind fremde
 * Domains, kein Teil der Route Registry.
 */
export const SHOP_ORIGIN = 'https://shop.polarisdx.net'
export const PANELS_ORIGIN = 'https://panels.polarisdx.net'

function externalShopUrl(origin: string, language: string | undefined, path: string): string {
  const lang = (language || 'de').split('-')[0]
  const prefix = lang === 'de' ? '' : '/en'
  return `${origin}${prefix}${path}`
}

/** Praxis-Shop (Fachkreise): Reader, Testkits, Nahrungsergaenzung. */
export function shopUrl(language: string | undefined, path = ''): string {
  return externalShopUrl(SHOP_ORIGIN, language, path)
}

/** Panel-Shop: Epigenetik-Panels. */
export function panelsUrl(language: string | undefined, path = ''): string {
  return externalShopUrl(PANELS_ORIGIN, language, path)
}
