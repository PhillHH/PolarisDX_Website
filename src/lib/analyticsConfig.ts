/**
 * AP23 PT23.1 — woher die Provider-Kennungen kommen.
 *
 * Vorher standen zwei Kennungen fest im Quelltext: der GTM-Container
 * `GTM-TW6JFX7K` in `googleConsent.ts` und das GA4-Ziel `G-PLZNWGKW0P` in
 * `GtmPageview.tsx`. Beide stammen aus dem Altbestand, und beide wurden im
 * laufenden Code so behandelt, als waeren sie geprueft. Sie sind es nicht:
 * ob dieser Container existiert, wem er gehoert, welche Tags er enthaelt und
 * ob GA4 dort ueberhaupt haengt, ist bis heute nicht extern verifiziert —
 * das ist ausdruecklich AP23 PT23.4.
 *
 * Deshalb hier die einzige Regel dieses Moduls: **eine Kennung wird gelesen,
 * nie erfunden und nie aus dem Altbestand als Wahrheit uebernommen.** Ohne
 * Konfiguration gibt es keinen Container, also laedt kein Provider. Das ist
 * die sichere Richtung: eine Seite ohne Messung ist ein Nachteil, eine Seite,
 * die Daten an einen unbekannten Container schickt, ist ein Vorfall.
 *
 * Gesetzt wird ueber die Build-Umgebung (`.env`, CI, Container):
 *
 *   VITE_APP_ENV=production|preview|staging
 *   VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
 *   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
 *
 * AP23 PT23.4 — zweite Regel, aus einer gemessenen Gefahr: **eine Vorschau
 * darf nicht in die Produktionsauswertung schreiben.** Der Container wird zur
 * BAUZEIT eingebacken; wer einen Preview-Build mit derselben Kennung
 * ausliefert, schickt Testklicks in dieselbe GA4-Property wie echte
 * Besucherinnen — und niemand sieht der Auswertung hinterher an, welche Zeile
 * aus einer Vorschau kam. `resolveAnalyticsConfig` verweigert deshalb in
 * `preview`/`staging` jeden Container, den nicht ausdruecklich diese Umgebung
 * bekommen hat.
 */

/**
 * Der Container aus dem Altbestand. Steht hier als BELEG, nicht als Vorgabe:
 * er wird nirgends als Standardwert verwendet. `AUDIT-Referenz` fuer PT23.4,
 * damit dort nachvollziehbar ist, welche Kennung die Seite historisch trug.
 */
export const HISTORICAL_BASELINE_GTM_CONTAINER = 'GTM-TW6JFX7K'
/** Ebenso historisch, ebenso ungeprueft. Kein Standardwert. */
export const HISTORICAL_BASELINE_GA4_MEASUREMENT = 'G-PLZNWGKW0P'

/** GTM-Container: `GTM-` plus mindestens vier Grossbuchstaben/Ziffern. */
const GTM_PATTERN = /^GTM-[A-Z0-9]{4,}$/
/** GA4-Messkennung: `G-` plus mindestens acht Grossbuchstaben/Ziffern. */
const GA4_PATTERN = /^G-[A-Z0-9]{8,}$/

export interface AnalyticsConfig {
  /** Der GTM-Container oder `null`, wenn keiner konfiguriert ist. */
  gtmContainerId: string | null
  /** Das GA4-Ziel oder `null`. Nur relevant, wenn GTM ein Google-Tag laedt. */
  ga4MeasurementId: string | null
  /** `true`, sobald ueberhaupt ein Provider geladen werden darf. */
  providerConfigured: boolean
  /** Wie sich die Umgebung benennt: `production`, `preview`, … */
  environment: string
  /** Eine Vorschau hat den Produktionscontainer unterdrueckt. */
  productionContainerSuppressed: boolean
}

type EnvLike = Record<string, string | boolean | undefined>

function readEnv(): EnvLike {
  try {
    return (import.meta.env ?? {}) as EnvLike
  } catch {
    return {}
  }
}

function normalize(value: unknown, pattern: RegExp): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  // Eine syntaktisch falsche Kennung wird VERWORFEN und nicht durchgereicht:
  // ein Tippfehler in der Umgebung wuerde sonst eine Anfrage an einen
  // fremden oder nicht existierenden Container ausloesen.
  return pattern.test(trimmed) ? trimmed : null
}

/** Umgebungen, in denen keine Produktionsauswertung entstehen darf. */
const NON_PRODUCTION = ['preview', 'staging'] as const

function runtimeEnvironment(env: EnvLike): string {
  return String(env.VITE_APP_ENV ?? env.APP_ENV ?? '')
    .trim()
    .toLowerCase()
}

export function resolveAnalyticsConfig(env: EnvLike = readEnv()): AnalyticsConfig {
  const declared = normalize(env.VITE_GTM_CONTAINER_ID, GTM_PATTERN)
  const previewContainer = normalize(env.VITE_GTM_CONTAINER_ID_PREVIEW, GTM_PATTERN)
  const ga4MeasurementId = normalize(env.VITE_GA4_MEASUREMENT_ID, GA4_PATTERN)
  const environment = runtimeEnvironment(env)

  /**
   * In einer Vorschau gilt AUSSCHLIESSLICH ein eigens dafuer gesetzter
   * Container. Fehlt er, wird gar keiner geladen — lieber keine Messung als
   * Testverkehr in der Produktionsauswertung. Der Produktionscontainer wird
   * hier bewusst NICHT durchgereicht, auch wenn er gesetzt ist.
   */
  const isolated = NON_PRODUCTION.includes(environment as (typeof NON_PRODUCTION)[number])
  const gtmContainerId = isolated ? previewContainer : declared

  return {
    gtmContainerId,
    ga4MeasurementId: isolated && !previewContainer ? null : ga4MeasurementId,
    providerConfigured: gtmContainerId !== null,
    environment: environment || 'undeclared',
    /** `true`, wenn die Umgebung einen Produktionscontainer unterdrueckt hat. */
    productionContainerSuppressed: isolated && declared !== null && previewContainer === null,
  }
}

/**
 * Ehrlicher Bericht ueber den Konfigurationsstand — fuer die Betriebssicht
 * und fuer PT23.4. Gibt KEINE Kennung aus, nur ob eine gueltige vorliegt.
 */
export function describeAnalyticsConfig(env: EnvLike = readEnv()): {
  gtm: 'CONFIGURED' | 'UNCONFIGURED'
  ga4: 'CONFIGURED' | 'UNCONFIGURED'
  environment: string
  productionContainerSuppressed: boolean
  externallyVerified: boolean
} {
  const config = resolveAnalyticsConfig(env)
  return {
    gtm: config.gtmContainerId ? 'CONFIGURED' : 'UNCONFIGURED',
    ga4: config.ga4MeasurementId ? 'CONFIGURED' : 'UNCONFIGURED',
    environment: config.environment,
    productionContainerSuppressed: config.productionContainerSuppressed,
    /**
     * AP23 PT23.4 — der VEROEFFENTLICHTE Container ist gelesen und
     * ausgewertet (`CONSENT-TRACKING-CONTRACT.md` §15). Was dort NICHT zu
     * sehen ist, bleibt ungeprueft: die GA4-Property, ihr Datenstream, die
     * Enhanced-Measurement-Einstellungen und die Conversion-Markierungen
     * liegen hinter einem Zugang, den dieses Repository nicht hat. Deshalb
     * bleibt der Wert `false`, bis eine Betreiberin ihn belegt.
     */
    externallyVerified: false,
  }
}
