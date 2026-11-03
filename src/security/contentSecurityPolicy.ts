/**
 * AP26 PT26.2 — Content Security Policy: die einzige Quelle der Policy.
 *
 * `server.ts` setzt den Header, dieses Modul bestimmt seinen Inhalt. Es ist
 * bewusst frei von Node- und DOM-APIs, damit der statische Guard
 * (`contentSecurityPolicy.test.ts`) exakt die Policy prueft, die ausgeliefert
 * wird — ohne den Server zu starten.
 *
 * Grundsaetze (NETWORK-ALLOWLIST N-07/N-08/N-13, SECURITY-CONTRACT §8):
 *  - jede fremde Origin steht namentlich in `CSP_THIRD_PARTY_SOURCES` mit
 *    Laufzeitgrund; keine Schema-Quelle (`https:`) und keine Wildcard
 *  - kein `'unsafe-eval'`, kein `'unsafe-inline'` fuer Skripte oder
 *    Stylesheet-Elemente; das inline ausgelieferte App-CSS (PT25.4) wird per
 *    SHA-256-Hash freigegeben
 *  - die CSP ERLAUBT Google technisch, sie LAEDT nichts: ob und wann GTM/GA4
 *    kontaktiert werden, entscheidet allein das AP23-Consent-Gate
 *    (`src/lib/googleConsent.ts`)
 *  - kein `report-uri`/`report-to`: es gibt keinen Report-Empfaenger, also
 *    wird auch keiner behauptet
 */

export type CspMode = 'enforce' | 'report-only'

export type CspDirective = 'script-src' | 'connect-src' | 'img-src'

export interface CspThirdPartySource {
  origin: string
  directives: readonly CspDirective[]
  /** Klasse nach NETWORK-ALLOWLIST §3. */
  classification: 'CONSENT_ANALYTICS' | 'CONSENT_MARKETING'
  /** Warum die Origin zur Laufzeit gebraucht wird — belegt, nicht vermutet. */
  reason: string
  /**
   * Nur fuer Erfassungs-Endpunkte: Google baut den Standort des Abrufers in das ausgelieferte
   * Google-Tag ein und waehlt danach den Endpunkt. Jede Auslieferung nutzt genau einen davon.
   */
  servedRegion?: 'EU' | 'OUTSIDE_EU'
}

/**
 * Alle fremden Origins der Policy. Gemessen in PT26.2 (`e2e/pt26.2.spec.ts`,
 * Test „nach Zustimmung"): der veroeffentlichte Container und das Google-Tag
 * laufen unter der durchgesetzten Policy, ihre Netzziele werden protokolliert
 * und abgebrochen. Nur was dort tatsaechlich angefragt wurde, steht hier.
 */
export const CSP_THIRD_PARTY_SOURCES: readonly CspThirdPartySource[] = [
  {
    origin: 'https://www.googletagmanager.com',
    directives: ['script-src'],
    classification: 'CONSENT_ANALYTICS',
    reason:
      'gtm.js (Loader src/lib/googleConsent.ts nach Zustimmung) und das vom Container nachgeladene Google-Tag gtag/js',
  },
  {
    origin: 'https://region1.google-analytics.com',
    directives: ['connect-src'],
    classification: 'CONSENT_ANALYTICS',
    reason:
      'GA4-Erfassung /g/collect fuer Besucher in der EU: Google liefert das Google-Tag dort mit dem Endpunkt "region1" aus',
    servedRegion: 'EU',
  },
  {
    origin: 'https://www.google-analytics.com',
    directives: ['connect-src'],
    classification: 'CONSENT_ANALYTICS',
    reason:
      'GA4-Erfassung /g/collect fuer Besucher ausserhalb der EU (in CI gemessen, Runner in den USA); Nutzerentscheidung 2026-10-15',
    servedRegion: 'OUTSIDE_EU',
  },
  /**
   * SC-022 (Owner 2026-11-03, „binde das hier ein“): Google-Ads-Tag `AW-…`, geladen von
   * `googleConsent.ts` NUR nach Marketing-Zustimmung. Gemessen am 2026-11-03 gegen einen lokalen
   * Produktionsbau mit Report-Only-Policy (Scratch-Skript `ads-measure.mjs`, Zustimmung „alle
   * akzeptieren“, drei Seiten, ein Reload): genau diese vier Origins, sonst nichts.
   */
  {
    origin: 'https://googleads.g.doubleclick.net',
    directives: ['script-src'],
    classification: 'CONSENT_MARKETING',
    reason:
      'Google-Ads-Tag laedt nach dem config-Befehl (AW-Konto) das Skript /pagead/viewthroughconversion/<Konto>/ (Conversion-/Remarketing-Linker)',
  },
  {
    origin: 'https://www.google.com',
    directives: ['connect-src', 'img-src'],
    classification: 'CONSENT_MARKETING',
    reason:
      'Google-Ads-Erfassung /rmkt/collect/<Konto>/ und /ccm/collect (fetch) sowie das Bild /pagead/1p-user-list/<Konto>/; bis SC-022 bewusst gesperrt (Nutzerentscheidung 2026-10-15, damals ohne Werbe-Tag)',
  },
  {
    origin: 'https://www.google.de',
    directives: ['img-src'],
    classification: 'CONSENT_MARKETING',
    reason:
      'Google-Ads-Bild /pagead/1p-user-list/<Konto>/ auf der Laender-Domain des Abrufers (gemessen aus Deutschland); andere Laender-Domains bleiben ohne Wildcard gesperrt (N-13), die Conversion-Messung haengt nicht daran',
  },
  {
    origin: 'https://ad.doubleclick.net',
    directives: ['connect-src'],
    classification: 'CONSENT_MARKETING',
    reason:
      'Google-Ads-Erfassung /ccm/s/collect (fetch) nach dem config-Befehl des Google-Ads-Tags',
  },
]

/**
 * Entfernte Origins. Der Guard prueft, dass keine davon in Policy, Code oder
 * Konfiguration zurueckkehrt. Die Chat-Domain (DEC-RL-007) steht bewusst nicht
 * hier: dieses Modul soll sie nicht einmal nennen, der Guard prueft sie getrennt.
 */
export const CSP_REMOVED_SOURCES = [
  'ssl.google-analytics.com', // Universal Analytics, von GA4 nicht genutzt
  'fonts.googleapis.com', // Schrift ist selbstgehostet (N-02)
  'fonts.gstatic.com', // dito
  'stats.g.doubleclick.net', // auch vom Google-Ads-Tag nicht angefragt (SC-022 gemessen)
  // `www.google.com` stand hier bis SC-022 (Werbe-Abgleich /g/collect, Nutzerentscheidung
  // 2026-10-15); seit dem Google-Ads-Tag (Owner 2026-11-03) ist die Origin nach Marketing-
  // Zustimmung freigegeben, siehe CSP_THIRD_PARTY_SOURCES.
] as const

export interface CspOptions {
  /** SHA-256-Hashes (Base64) der inline ausgelieferten `<style>`-Inhalte. */
  styleHashes?: readonly string[]
}

function sourcesFor(directive: CspDirective): string[] {
  return CSP_THIRD_PARTY_SOURCES.filter((source) => source.directives.includes(directive)).map(
    (source) => source.origin,
  )
}

/** Die Direktiven der Zielpolicy als geordnete Liste `[name, quellen]`. */
export function contentSecurityPolicyDirectives(
  options: CspOptions = {},
): Array<[string, string[]]> {
  const styleHashes = (options.styleHashes ?? []).map((hash) => `'sha256-${hash}'`)
  return [
    ['default-src', ["'self'"]],
    ['base-uri', ["'self'"]],
    ['object-src', ["'none'"]],
    ['frame-ancestors', ["'self'"]],
    ['form-action', ["'self'"]],
    ['script-src', ["'self'", ...sourcesFor('script-src')]],
    // Stylesheet-Elemente nur von der eigenen Origin oder per Hash (PT25.4-Inline-CSS).
    ['style-src', ["'self'", ...styleHashes]],
    ['style-src-elem', ["'self'", ...styleHashes]],
    // Rest-Risiko, gemessen in PT26.2: 16 Komponenten rendern `style`-Attribute serverseitig
    // (Honeypot-Verstecke der Formulare, Befund-Charts, Reveal, MobileCallButton). Die Hydration
    // stellt geblockte Attribute nicht wieder her. Attribute koennen kein Skript ausfuehren und
    // externe Ladevorgaenge bleiben an img-src/font-src gebunden. Abbau: AP27 (Klassen/CSSOM).
    ['style-src-attr', ["'unsafe-inline'"]],
    ['connect-src', ["'self'", ...sourcesFor('connect-src')]],
    ['img-src', ["'self'", 'data:', ...sourcesFor('img-src')]],
    ['font-src', ["'self'"]],
    ['frame-src', ["'none'"]],
  ]
}

export function buildContentSecurityPolicy(options: CspOptions = {}): string {
  return contentSecurityPolicyDirectives(options)
    .map(([name, sources]) => `${name} ${sources.join(' ')}`)
    .join('; ')
}

/**
 * Produktion setzt die Policy durch. `POLARIS_CSP_MODE=report-only` ist der
 * dokumentierte Rueckfallschalter (reines Browser-Diagnoseverhalten, kein
 * Monitoring). Entwicklung laeuft Report-Only, weil Vite Inline-Skripte und
 * Style-Elemente einspritzt. Ein unbekannter Wert faellt in Produktion auf
 * `enforce` zurueck — ein Tippfehler darf den Schutz nicht abschalten.
 */
export function resolveCspMode(env: Readonly<Record<string, string | undefined>>): CspMode {
  if (env.POLARIS_CSP_MODE === 'report-only') return 'report-only'
  if (env.POLARIS_CSP_MODE === 'enforce') return 'enforce'
  return env.NODE_ENV === 'production' ? 'enforce' : 'report-only'
}

export function cspHeaderName(mode: CspMode): string {
  return mode === 'enforce' ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only'
}
