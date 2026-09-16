/**
 * AP23 PT23.1 — der gespeicherte Einwilligungszustand.
 *
 * Bis hierhin war der Zustand das rohe Kategorien-Array der Bannerkomponente,
 * unversioniert in `localStorage` unter `cookie-consent`. Das hatte zwei
 * konkrete Folgen:
 *
 *  1. **Ein kaputter Eintrag riss die Seite mit.** Der Banner las den Wert,
 *     setzte ihn ungeprueft in den State und rendert daraus eine Liste. Stand
 *     dort etwas anderes als ein Array — eine Zahl, ein Objekt, ein
 *     abgeschnittener String aus einem vollen Speicher — warf das Rendern,
 *     und zwar auf JEDER Seite, weil der Banner global haengt. Deshalb liest
 *     dieses Modul defensiv und liefert im Zweifel „keine Entscheidung".
 *  2. **Eine neue Kategorie haette eine alte Zustimmung geerbt.** Ohne
 *     Version ist eine Einwilligung von gestern nicht von einer Einwilligung
 *     zu einem anderen Umfang zu unterscheiden. `version` macht genau das
 *     unterscheidbar: passt sie nicht, gilt die Entscheidung als NICHT
 *     getroffen, und der Banner fragt erneut.
 *
 * Was hier NICHT passiert: es wird nichts gepuffert. Der Zustand ist eine
 * Entscheidung, keine Ereigniswarteschlange. Es liegt kein Personenbezug im
 * Speicher — nur `version`, `decidedAt` und drei Boolesche.
 */

/** Die Kategorien. `necessary` ist nicht abwaehlbar und traegt kein Tracking. */
export const CONSENT_CATEGORIES = ['necessary', 'analytics', 'marketing'] as const
export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number]

/** Frei waehlbare Kategorien — die einzigen, ueber die der Dialog entscheidet. */
export const OPTIONAL_CONSENT_CATEGORIES = ['analytics', 'marketing'] as const
export type OptionalConsentCategory = (typeof OPTIONAL_CONSENT_CATEGORIES)[number]

export const CONSENT_STORAGE_KEY = 'cookie-consent'

/**
 * Erhoehen, sobald sich Umfang oder Bedeutung der Kategorien aendert. Eine
 * gespeicherte Entscheidung mit einer anderen Version zaehlt als „nicht
 * getroffen" — sie wird nicht stillschweigend uebernommen.
 */
export const CONSENT_VERSION = 2

export interface ConsentDecision {
  version: number
  /** ISO-Zeitpunkt der Entscheidung. Kein Personenbezug, nur Nachweis. */
  decidedAt: string
  analytics: boolean
  marketing: boolean
}

/** Kein Provider, keine Speicherung — der Zustand vor jeder Entscheidung. */
export const NO_CONSENT: Readonly<ConsentDecision> = Object.freeze({
  version: CONSENT_VERSION,
  decidedAt: '',
  analytics: false,
  marketing: false,
})

/** Ereignis, mit dem der Einwilligungsdialog erneut geoeffnet wird. */
export const CONSENT_REOPEN_EVENT = 'polaris:consent-reopen'
/** Ereignis, das eine geaenderte Entscheidung im selben Tab bekanntgibt. */
export const CONSENT_CHANGED_EVENT = 'polaris:consent-changed'

const isBrowser = () => typeof window !== 'undefined'

function safeGetItem(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY)
  } catch {
    // Privater Modus, blockierter Speicher, volles Kontingent: kein Grund,
    // die Seite anzuhalten. Ohne lesbaren Zustand gibt es keine Einwilligung.
    return null
  }
}

/**
 * Das Altformat: ein Array `[{ id, enabled }]` ohne Version.
 *
 * Es wird GELESEN, aber nicht als gueltige Entscheidung uebernommen —
 * `version` fehlt, also ist der Umfang der damaligen Zustimmung nicht
 * belegbar. Uebernommen wuerde eine Zustimmung, die vielleicht nie fuer die
 * heutigen Kategorien erteilt wurde.
 */
function isLegacyArray(value: unknown): boolean {
  return Array.isArray(value)
}

function parseDecision(raw: string | null): ConsentDecision | null {
  if (!raw) return null
  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    return null
  }
  if (isLegacyArray(value)) return null
  if (typeof value !== 'object' || value === null) return null

  const candidate = value as Partial<ConsentDecision>
  if (candidate.version !== CONSENT_VERSION) return null
  if (typeof candidate.analytics !== 'boolean' || typeof candidate.marketing !== 'boolean') {
    return null
  }
  return {
    version: CONSENT_VERSION,
    decidedAt: typeof candidate.decidedAt === 'string' ? candidate.decidedAt : '',
    analytics: candidate.analytics,
    marketing: candidate.marketing,
  }
}

/** Die gespeicherte Entscheidung — oder `null`, wenn es keine gueltige gibt. */
export function readConsentDecision(): ConsentDecision | null {
  if (!isBrowser()) return null
  return parseDecision(safeGetItem())
}

/** Wurde ueberhaupt schon entschieden? Steuert die Sichtbarkeit des Dialogs. */
export function hasConsentDecision(): boolean {
  return readConsentDecision() !== null
}

/** Der geltende Zustand. Ohne Entscheidung: alles verweigert. */
export function currentConsent(): ConsentDecision {
  return readConsentDecision() ?? NO_CONSENT
}

export function hasCategoryConsent(category: OptionalConsentCategory): boolean {
  return currentConsent()[category] === true
}

/**
 * Entscheidung speichern und im laufenden Tab bekanntgeben.
 *
 * Das Ereignis ist noetig, weil `storage` nur in ANDEREN Tabs feuert. Ohne
 * es wuesste eine bereits gemountete Komponente nichts von einem Widerruf,
 * der eine Sekunde vorher im selben Tab passiert ist.
 */
export function writeConsentDecision(
  next: Pick<ConsentDecision, 'analytics' | 'marketing'>,
  now: () => Date = () => new Date(),
): ConsentDecision {
  const decision: ConsentDecision = {
    version: CONSENT_VERSION,
    decidedAt: now().toISOString(),
    analytics: next.analytics === true,
    marketing: next.marketing === true,
  }
  if (!isBrowser()) return decision
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(decision))
  } catch {
    // Nicht speicherbar heisst: die Entscheidung gilt fuer diesen Seitenaufruf,
    // aber sie wird beim naechsten erneut erfragt. Das ist die richtige
    // Richtung — sie faellt zurueck auf „keine Einwilligung".
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: decision }))
  return decision
}

/**
 * Vollstaendiger Widerruf.
 *
 * Der Eintrag wird ENTFERNT statt auf `false` gesetzt: damit ist der Zustand
 * wieder „keine Entscheidung", der Dialog erscheint erneut, und es bleibt
 * kein Datum im Speicher, das eine Aussage ueber die Person trifft.
 */
export function clearConsentDecision(): void {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY)
  } catch {
    // s. o. — ohne lesbaren Eintrag gilt ohnehin keine Einwilligung.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: null }))
}

/** Den Dialog von aussen oeffnen (Fusszeile, Datenschutzerklaerung). */
export function requestConsentReopen(): void {
  if (!isBrowser()) return
  window.dispatchEvent(new CustomEvent(CONSENT_REOPEN_EVENT))
}
