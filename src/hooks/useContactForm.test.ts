import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendContactEmail } from '../api/contact'
import { useContactForm } from './useContactForm'

vi.mock('../api/contact', () => ({ sendContactEmail: vi.fn() }))

const baseSubmission = {
  intent: 'quote',
  intentLabel: 'Angebot anfragen',
  name: 'Ada Example',
  company: 'Praxis Example',
  email: 'ada@example.test',
  phone: '',
  field: 'dental',
  fieldLabel: 'Dental',
  requirements: 'Information',
  source: 'homepage',
  journey: 'general_sales',
  section: 'hero',
  consent: true,
  locale: 'de' as const,
  _hp: '',
}

describe('useContactForm (AP20 PT20.2 contact journey)', () => {
  beforeEach(() => vi.mocked(sendContactEmail).mockReset())

  it('transports attribution, consent evidence and an idempotency key to the endpoint', async () => {
    vi.mocked(sendContactEmail).mockResolvedValue({ ok: true })
    const { result } = renderHook(() => useContactForm())

    let ok = false
    await act(async () => {
      ok = (await result.current.submit(baseSubmission)).ok
    })

    expect(ok).toBe(true)
    expect(result.current.submitStatus).toBe('success')
    expect(sendContactEmail).toHaveBeenCalledTimes(1)
    const [payload, key] = vi.mocked(sendContactEmail).mock.calls[0]
    expect(payload.source).toBe('homepage')
    expect(payload.journey).toBe('general_sales')
    expect(payload.section).toBe('hero')
    expect(payload.locale).toBe('de')
    expect(payload.processingConsent).toBe(true)
    expect(payload.consentAcceptedAt).toBeTruthy()
    expect(typeof key).toBe('string')
    expect(key.length).toBeGreaterThan(0)
  })

  it('keeps marketing consent strictly separate and defaults it to denied', async () => {
    vi.mocked(sendContactEmail).mockResolvedValue({ ok: true })
    const { result } = renderHook(() => useContactForm())

    await act(async () => {
      await result.current.submit({ ...baseSubmission, marketingConsent: true })
    })

    const [payload] = vi.mocked(sendContactEmail).mock.calls[0]
    expect(payload.marketingConsent).toBe(true)
  })

  it('reuses the same idempotency key on retry — no duplicate lead', async () => {
    vi.mocked(sendContactEmail)
      .mockResolvedValueOnce({ ok: false, retryable: true, code: 'NETWORK_ERROR' })
      .mockResolvedValueOnce({ ok: true })
    const { result } = renderHook(() => useContactForm())

    await act(async () => {
      await result.current.submit(baseSubmission)
    })
    expect(result.current.submitStatus).toBe('retryable-error')

    await act(async () => {
      await result.current.submit(baseSubmission)
    })
    expect(result.current.submitStatus).toBe('success')
    expect(vi.mocked(sendContactEmail).mock.calls[0][1]).toBe(
      vi.mocked(sendContactEmail).mock.calls[1][1],
    )
  })

  it('blocks a double submit while a submission is in flight', async () => {
    let resolveFirst: (value: Awaited<ReturnType<typeof sendContactEmail>>) => void = () => {}
    vi.mocked(sendContactEmail).mockImplementationOnce(
      () => new Promise((resolve) => (resolveFirst = resolve)),
    )
    const { result } = renderHook(() => useContactForm())

    await act(async () => {
      const first = result.current.submit(baseSubmission)
      const second = await result.current.submit(baseSubmission)
      expect(second.ok).toBe(false)
      resolveFirst({ ok: true })
      await first
    })
    expect(sendContactEmail).toHaveBeenCalledTimes(1)
  })

  it('maps server field errors to validation-error with fields', async () => {
    vi.mocked(sendContactEmail).mockResolvedValue({
      ok: false,
      retryable: false,
      code: 'VALIDATION_FAILED',
      fields: ['email'],
    })
    const { result } = renderHook(() => useContactForm())

    const outcome = { ok: false, fields: [] as string[] }
    await act(async () => {
      Object.assign(outcome, await result.current.submit(baseSubmission))
    })
    expect(result.current.submitStatus).toBe('validation-error')
    expect(outcome.fields).toEqual(['email'])
  })

  it('client gate fails closed without processing consent', async () => {
    vi.mocked(sendContactEmail).mockResolvedValue({ ok: true })
    const { result } = renderHook(() => useContactForm())

    const outcome = { ok: true, fields: [] as string[] }
    await act(async () => {
      Object.assign(outcome, await result.current.submit({ ...baseSubmission, consent: false }))
    })
    expect(outcome.ok).toBe(false)
    expect(outcome.fields).toContain('consent')
    expect(result.current.submitStatus).toBe('validation-error')
    expect(sendContactEmail).not.toHaveBeenCalled()
  })
})
