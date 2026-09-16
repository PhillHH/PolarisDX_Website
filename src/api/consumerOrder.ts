/**
 * Consumer-Order-Journey (AP21 PT21.5): `POST /api/consumer-order` ist ein
 * persistenter Lead-Endpunkt, kein Mail-Relais mehr. Der Idempotency-Key
 * wird als Header gesendet und bleibt ueber Wiederholungen gleich — ein
 * zweiter Absendeversuch erzeugt keine zweite Bestellanfrage.
 *
 * 202 = dauerhaft angenommen (persistiert), 409 = Konflikt (terminal),
 * 400 = Validierung (terminal), 429/5xx/Netzwerk = retrybar.
 *
 * Der Client schickt ausschliesslich allowlistete IDs — Produkt, Variante
 * und Menge werden serverseitig geprueft; Produktnamen, Preise und
 * Mengenlabels sind Anzeige und nie Quelle der Wahrheit.
 */

import type { SupportedLanguage } from '../i18n'

export type ConsumerOrderProduct = 'spray' | 'masks' | 'duo'

/** Reale Gebinde aus dem Produktmodell; der Server allowlistet sie erneut. */
export type ConsumerOrderVariant = 'pack-12' | 'box-5' | 'set'

/** Menge: kleine ganze Zahl oder der explizite Beratungsfall. */
export type ConsumerOrderQuantity = 1 | 2 | 3 | 'MORE'

export interface ConsumerOrderPayload {
  product: ConsumerOrderProduct
  variant: ConsumerOrderVariant
  quantity: ConsumerOrderQuantity
  // Kontakt
  name: string
  email: string
  phone?: string
  // Firma (optional, fuer Geschaeftsbestellungen)
  company?: string
  // Lieferadresse (optional; der Vertrieb klaert sie sonst nach)
  street?: string
  postcode?: string
  city?: string
  country?: string
  // Freitextkontext
  message?: string
  /** Verarbeitungs-Consent — Pflicht, strikt getrennt vom Marketing-Consent. */
  processingConsent: boolean
  /** Marketing-Consent — optional; eine Ablehnung blockiert die Bestellung nicht. */
  marketingConsent?: boolean
  /** ISO-Zeitstempel des Consent-Klicks — wird als Nachweis persistiert. */
  consentAcceptedAt: string
  /** Honeypot — muss leer bleiben (Menschen sehen ihn nicht). */
  _hp?: string
  locale: SupportedLanguage
}

export type ConsumerOrderResult =
  | { ok: true; orderReference?: string; status?: string }
  | { ok: false; retryable: boolean; code?: string; fields?: string[] }

export async function sendConsumerOrder(
  payload: ConsumerOrderPayload,
  idempotencyKey: string,
): Promise<ConsumerOrderResult> {
  try {
    const response = await fetch('/api/consumer-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    })

    if (response.status === 202 || response.status === 200) {
      // AP27 PT27.3 (PT273-F1): seit AP22 PT22.5 liefert der Server das Journey-Envelope
      // `{ success, state, reference, … }`. Gelesen wurde weiter `orderReference`/`status` — die
      // Vorgangsnummer erschien deshalb nie. Das Altformat bleibt lesbar.
      let body: { reference?: string; state?: string; orderReference?: string; status?: string } =
        {}
      try {
        body = (await response.json()) as typeof body
      } catch {
        // Nicht-JSON-Erfolg — der Statuscode bleibt massgeblich.
      }
      return {
        ok: true,
        orderReference: body.reference ?? body.orderReference,
        status: body.state ?? body.status,
      }
    }

    let payloadBody: { code?: string; fields?: string[] } = {}
    try {
      payloadBody = (await response.json()) as { code?: string; fields?: string[] }
    } catch {
      // Nicht-JSON-Ablehnung — unten ueber den Statuscode klassifiziert.
    }

    if (response.status === 400) {
      return { ok: false, retryable: false, code: payloadBody.code, fields: payloadBody.fields }
    }
    if (response.status === 409) {
      return { ok: false, retryable: false, code: payloadBody.code || 'IDEMPOTENCY_CONFLICT' }
    }
    // 429 (Rate Limit) und 5xx sind retrybar — die Anfrage ist ggf. schon
    // persistiert; dieselbe Anfrage mit demselben Key erneut zu senden ist sicher.
    return { ok: false, retryable: true, code: payloadBody.code }
  } catch {
    return { ok: false, retryable: true, code: 'NETWORK_ERROR' }
  }
}
