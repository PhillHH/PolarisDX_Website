/**
 * Consumer landing pages — GTM dataLayer helpers
 *
 * GTM (GTM-TW6JFX7K) and Consent Mode v2 are already wired up in
 * index.html. This module just emits *structured events* into the
 * dataLayer so that:
 *   - GA4 / Meta Pixel / LinkedIn Insight (all managed inside GTM)
 *     can be attached to a stable event name with stable parameters,
 *   - the marketing team can set up Conversion tags in GTM without
 *     having to read React code or coordinate code deploys.
 *
 * Emitted events:
 *   - `consumer_page_view`   on mount, with { consumer_page }
 *   - `consumer_cta_click`   on CTA click, with { cta_label,
 *                                                  consumer_page,
 *                                                  cta_location }
 *
 * SSR safety: every push is guarded against `typeof window === 'undefined'`.
 */

import { useEffect } from 'react'

export type ConsumerPage = 'spray' | 'masks' | 'duo'

// The global `window.dataLayer` type is already declared in
// src/components/ui/CookieBanner.tsx as `Array<Record<string, unknown>>`.
// We reuse that — every event we push is structurally compatible.

interface DataLayerEvent extends Record<string, unknown> {
  event: string
}

function push(event: DataLayerEvent): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
}

export function trackConsumerCtaClick(
  cta_label: string,
  consumer_page: ConsumerPage,
  cta_location?: string,
): void {
  push({
    event: 'consumer_cta_click',
    cta_label,
    consumer_page,
    ...(cta_location ? { cta_location } : {}),
  })
}

/**
 * React hook — fires `consumer_page_view` once per mount.
 * Call near the top of each consumer page component.
 */
export function useConsumerPageView(consumer_page: ConsumerPage): void {
  useEffect(() => {
    push({ event: 'consumer_page_view', consumer_page })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
