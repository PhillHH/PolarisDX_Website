// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'

import { sendConsumerOrder } from './consumerOrder'
import { submitContentDownload } from './contentDownload'
import { submitEpigeneticsInquiry } from './epigeneticsInquiry'

/**
 * AP26 PT26.3 (SEC-20) — die Clients lesen das Journey-Envelope des Servers.
 *
 * Die Antworten unten sind in der Form von `server/lead-foundation/api-contract.js`
 * aufgebaut (`successEnvelope`/`errorEnvelope`). Vorher lasen beide Clients `accepted`
 * auf oberster Ebene: jeder persistierte Vorgang galt als Fehler.
 */

const respond = (status: number, body: unknown) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(body), { status })),
  )

afterEach(() => vi.unstubAllGlobals())

const gateRequest = {
  name: 'Dr. Probe',
  email: 'probe@praxis.example',
  organization: 'Praxis',
  locale: 'de',
  assetId: 'rsc-epi-019',
  source: 'resource-center' as const,
  originRoute: '/de/downloads',
  processingConsent: true,
  marketingConsent: false,
  consentAcceptedAt: '2026-09-15T09:00:00.000Z',
  _hp: '',
} as unknown as Parameters<typeof submitContentDownload>[0]

describe('submitContentDownload', () => {
  it('bildet 202 mit Envelope auf accepted + Downloadlink ab', async () => {
    respond(202, {
      success: true,
      requestId: 'req_1',
      journey: 'content_download',
      state: 'FAILED_TERMINAL',
      leadId: 'lead-1',
      deliveryPending: false,
      providerConfigured: false,
      data: {
        assetId: 'rsc-epi-019',
        deliveredLanguage: 'de',
        entitlementId: 'ent-1',
        expiresAt: '2026-09-22T00:00:00.000Z',
        downloadUrl: '/api/content-download/asset/rsc-epi-019?e=ent-1&t=opaque',
      },
    })
    const result = await submitContentDownload(gateRequest, 'key-1')
    expect(result).toMatchObject({
      accepted: true,
      leadId: 'lead-1',
      status: 'FAILED_TERMINAL',
      providerConfigured: false,
      assetId: 'rsc-epi-019',
      downloadUrl: '/api/content-download/asset/rsc-epi-019?e=ent-1&t=opaque',
    })
  })

  it('bildet Fehler-Envelope auf abgelehnt + Feldnamen + retryable ab', async () => {
    respond(400, {
      success: false,
      requestId: 'req_2',
      journey: 'content_download',
      state: 'REJECTED',
      code: 'VALIDATION_FAILED',
      retryable: false,
      messageKey: 'lead.error.validation_failed',
      fieldErrors: [{ field: 'email', code: 'VALIDATION_FAILED', messageKey: 'x' }],
    })
    expect(await submitContentDownload(gateRequest, 'key-2')).toEqual({
      accepted: false,
      code: 'VALIDATION_FAILED',
      fields: ['email'],
      retryable: false,
    })
  })

  it('behandelt Honeypot-200 ohne Link als nicht zugestellt und Nicht-JSON als retrybar', async () => {
    respond(200, { success: true, journey: 'content_download', state: 'IGNORED' })
    const ignored = await submitContentDownload(gateRequest, 'key-3')
    expect(ignored.accepted).toBe(true)
    expect(ignored.downloadUrl).toBeUndefined()

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<html>502</html>', { status: 502 })),
    )
    expect(await submitContentDownload(gateRequest, 'key-4')).toMatchObject({
      accepted: false,
      retryable: true,
    })
  })
})

describe('submitEpigeneticsInquiry', () => {
  const inquiry = {
    name: 'Dr. Probe',
    email: 'probe@praxis.example',
    organization: 'Praxis',
    facilityType: 'practice',
    casesPerMonth: 'unspecified',
    message: '',
    locale: 'de',
    source: 'epigenetics',
    campaign: '',
    panel: '',
    focus: '',
    originRoute: '/de/epigenetics',
    processingConsent: true,
    marketingConsent: false,
    consentAcceptedAt: '2026-09-15T09:00:00.000Z',
    _hp: '',
  } as unknown as Parameters<typeof submitEpigeneticsInquiry>[0]

  it('bildet 202 mit Envelope auf accepted + Zustand ab', async () => {
    respond(202, {
      success: true,
      journey: 'epigenetics_inquiry',
      state: 'DELIVERED',
      leadId: 'lead-9',
      deliveryPending: false,
      providerConfigured: true,
    })
    expect(await submitEpigeneticsInquiry(inquiry, 'key-5')).toEqual({
      accepted: true,
      leadId: 'lead-9',
      status: 'DELIVERED',
      deliveryPending: false,
      providerConfigured: true,
    })
  })

  it('meldet 429 als retrybar — das Formular behaelt dann seinen Schluessel', async () => {
    respond(429, {
      success: false,
      journey: 'epigenetics_inquiry',
      code: 'RATE_LIMITED',
      retryable: true,
    })
    expect(await submitEpigeneticsInquiry(inquiry, 'key-6')).toMatchObject({
      accepted: false,
      code: 'RATE_LIMITED',
      retryable: true,
    })
  })
})

describe('sendConsumerOrder', () => {
  // AP27 PT27.3 (PT273-F1): der Client las `orderReference`/`status`, der Server liefert seit
  // AP22 PT22.5 `reference`/`state` — die Vorgangsnummer erschien nie in der Erfolgsansicht.
  const order = {
    product: 'spray',
    variant: 'pack-12',
    quantity: 1,
    name: 'Probe Kundin',
    email: 'probe@example.com',
    processingConsent: true,
    consentAcceptedAt: '2026-09-15T09:00:00.000Z',
    locale: 'de',
  } as Parameters<typeof sendConsumerOrder>[0]

  it('liest Vorgangsnummer und Zustand aus dem Journey-Envelope', async () => {
    respond(202, {
      success: true,
      journey: 'consumer_order',
      state: 'FAILED_TERMINAL',
      leadId: 'lead-11',
      reference: 'PDX-0A1B2C3D',
      deliveryPending: false,
      providerConfigured: false,
    })
    expect(await sendConsumerOrder(order, 'key-7')).toEqual({
      ok: true,
      orderReference: 'PDX-0A1B2C3D',
      status: 'FAILED_TERMINAL',
    })
  })

  it('bleibt mit dem Altformat lesbar und behauptet ohne Nummer keine', async () => {
    respond(202, { orderReference: 'PDX-00000001', status: 'QUEUED' })
    expect(await sendConsumerOrder(order, 'key-8')).toEqual({
      ok: true,
      orderReference: 'PDX-00000001',
      status: 'QUEUED',
    })
    respond(202, { success: true, journey: 'consumer_order', state: 'QUEUED' })
    expect(await sendConsumerOrder(order, 'key-9')).toMatchObject({
      ok: true,
      orderReference: undefined,
    })
  })
})
