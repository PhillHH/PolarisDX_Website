import type { SupportedLanguage } from '../i18n'

/**
 * `roi_report` (AP22 PT22.5): `/api/roi-report` ist ein persistenter
 * Lead-Endpunkt, kein Mail-Relais mehr.
 *
 * Vorher wurde das PDF im Request erzeugt und synchron verschickt — ein
 * Providerfehler beantwortete die Anfrage mit 500 und verlor sie ersatzlos.
 * Jetzt wird zuerst gespeichert; die Zustellung samt PDF ist ein
 * wiederholbarer Side Effect.
 *
 * 202 = dauerhaft angenommen · 409 = Konflikt (terminal) · 400 = Validierung ·
 * 429/5xx/Netzwerk = retrybar.
 */

export interface RoiReportPayload {
  email: string
  /** Optionaler Praxis-/Firmenname. */
  practice?: string
  /** Allowlisteter Fachbereich; ein unbekannter Wert wird abgelehnt. */
  area?: string
  locale: SupportedLanguage
  /**
   * Die Rechenwerte des Rechners. Bewusst weit typisiert: die Formularfelder
   * halten Zeichenketten, und `payback` kann `null` sein. Der Server ist die
   * Autoritaet — er wandelt um und verwirft alles, was keine endliche Zahl
   * in vernuenftigen Grenzen ist.
   */
  inputs?: Record<string, number | string | null | undefined>
  outputs?: Record<string, number | string | null | undefined>
  /** Verarbeitungs-Consent — Pflicht, strikt getrennt vom Marketing-Consent. */
  processingConsent: boolean
  marketingConsent?: boolean
  /** ISO-Zeitstempel des Consent-Klicks — wird als Nachweis persistiert. */
  consentAcceptedAt: string
  /** Honeypot — muss leer bleiben. */
  _hp?: string
}

export type RoiReportResult =
  | { ok: true; reference?: string; state?: string }
  | { ok: false; retryable: boolean; code?: string; messageKey?: string }

export async function requestRoiReport(
  payload: RoiReportPayload,
  idempotencyKey: string,
): Promise<RoiReportResult> {
  try {
    const response = await fetch('/api/roi-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(payload),
    })

    let body: {
      reference?: string
      state?: string
      code?: string
      retryable?: boolean
      messageKey?: string
    } = {}
    try {
      body = (await response.json()) as typeof body
    } catch {
      // Nicht-JSON — der Statuscode bleibt massgeblich.
    }

    if (response.status === 202 || response.status === 200) {
      return { ok: true, reference: body.reference, state: body.state }
    }
    return {
      ok: false,
      // Der Server sagt jetzt selbst, ob eine Wiederholung sicher ist.
      retryable: body.retryable ?? response.status >= 500,
      code: body.code,
      messageKey: body.messageKey,
    }
  } catch {
    return { ok: false, retryable: true, code: 'NETWORK_ERROR' }
  }
}
