import { useRef, useState } from 'react'

import {
  sendConsumerOrder,
  type ConsumerOrderPayload,
  type ConsumerOrderProduct,
  type ConsumerOrderQuantity,
  type ConsumerOrderVariant,
} from '../api/consumerOrder'
import type { SupportedLanguage } from '../i18n'

/**
 * Consumer Ordering (AP21 PT21.5) — die Statusmaschine der Bestellanfrage.
 *
 * Wie bei Contact und Support gilt: Erfolg wird erst gemeldet, wenn der
 * Server die Anfrage dauerhaft persistiert hat (202). Ein Provider-Fehler
 * ist KEIN Fehler der Bestellung — die Anfrage liegt dann bereits in der
 * Outbox und wird erneut zugestellt.
 *
 * Idempotency: ein Key pro Formular-Instanz. Double-Click, Browser-Retry
 * und ein manueller zweiter Versuch treffen damit denselben Lead. Der
 * In-Flight-Guard liegt bewusst in einem Ref und nicht im State: ein
 * synchroner Doppelaufruf vor dem Re-Render laeuft sonst in die Stale
 * Closure und setzt zwei Requests ab.
 */
export type ConsumerOrderStatus =
  | 'idle'
  | 'submitting'
  | 'success'
  | 'validation-error'
  | 'retryable-error'
  | 'terminal-error'

export interface ConsumerOrderSubmission {
  product: ConsumerOrderProduct
  variant: ConsumerOrderVariant
  quantity: ConsumerOrderQuantity
  name: string
  email: string
  phone?: string
  company?: string
  street?: string
  postcode?: string
  city?: string
  country?: string
  message?: string
  /** Verarbeitungs-Consent — Pflicht. */
  consent: boolean
  /** Marketing-Consent — optional; eine Ablehnung blockiert nichts. */
  marketingConsent?: boolean
  locale: SupportedLanguage
  /** Honeypot — unveraendert weitergereicht, damit der Server verwerfen kann. */
  _hp: string
}

interface UseConsumerOrderFormReturn {
  isSubmitting: boolean
  status: ConsumerOrderStatus
  /** Serverseitig gemeldete Validierungsfelder (400). */
  serverFields: string[]
  /** Fachliche Vorgangsnummer — erst nach erfolgreicher Persistenz gesetzt. */
  orderReference: string | null
  submit: (
    submission: ConsumerOrderSubmission,
  ) => Promise<{ ok: boolean; retryable: boolean; fields: string[] }>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const newIdempotencyKey = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `consumer-order-${Date.now()}-${Math.random().toString(36).slice(2)}`

export const useConsumerOrderForm = (): UseConsumerOrderFormReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<ConsumerOrderStatus>('idle')
  const [serverFields, setServerFields] = useState<string[]>([])
  const [orderReference, setOrderReference] = useState<string | null>(null)
  const idempotencyKeyRef = useRef(newIdempotencyKey())
  const inFlightRef = useRef(false)

  const submit = async (
    s: ConsumerOrderSubmission,
  ): Promise<{ ok: boolean; retryable: boolean; fields: string[] }> => {
    if (inFlightRef.current) return { ok: false, retryable: false, fields: [] }
    inFlightRef.current = true
    setIsSubmitting(true)
    setStatus('submitting')
    setServerFields([])

    try {
      // Client-Gate: Name, gueltige E-Mail und ausdruecklicher
      // Verarbeitungs-Consent. Die Servervalidierung bleibt autoritativ.
      const gateFields = [
        s.name.trim().length < 2 ? 'name' : '',
        !EMAIL_RE.test(s.email.trim()) ? 'email' : '',
        !s.consent ? 'processingConsent' : '',
      ].filter(Boolean)
      if (gateFields.length) {
        setServerFields(gateFields)
        setStatus('validation-error')
        return { ok: false, retryable: false, fields: gateFields }
      }

      const payload: ConsumerOrderPayload = {
        product: s.product,
        variant: s.variant,
        quantity: s.quantity,
        name: s.name.trim(),
        email: s.email.trim(),
        phone: s.phone?.trim() || undefined,
        company: s.company?.trim() || undefined,
        street: s.street?.trim() || undefined,
        postcode: s.postcode?.trim() || undefined,
        city: s.city?.trim() || undefined,
        country: s.country?.trim() || undefined,
        message: s.message?.trim() || undefined,
        processingConsent: true,
        marketingConsent: s.marketingConsent === true,
        consentAcceptedAt: new Date().toISOString(),
        _hp: s._hp,
        locale: s.locale,
      }

      const result = await sendConsumerOrder(payload, idempotencyKeyRef.current)
      if (result.ok) {
        // 202 = dauerhaft persistiert. Erst jetzt darf die UI Erfolg zeigen —
        // und auch dann nur als Eingang der ANFRAGE, nicht als Kauf.
        setOrderReference(result.orderReference ?? null)
        setStatus('success')
        return { ok: true, retryable: false, fields: [] }
      }
      if (!result.retryable) {
        const fields = result.fields ?? []
        setServerFields(fields)
        // Ein Idempotency-Konflikt ist kein Eingabefehler: derselbe Key steht
        // bereits fuer eine andere Anfrage. Ein neuer Key macht den naechsten
        // Versuch wieder moeglich.
        if (result.code === 'IDEMPOTENCY_CONFLICT') {
          idempotencyKeyRef.current = newIdempotencyKey()
          setStatus('terminal-error')
        } else {
          setStatus('validation-error')
        }
        return { ok: false, retryable: false, fields }
      }
      setStatus('retryable-error')
      return { ok: false, retryable: true, fields: [] }
    } finally {
      inFlightRef.current = false
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, status, serverFields, orderReference, submit }
}
