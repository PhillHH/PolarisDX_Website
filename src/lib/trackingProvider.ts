import { resolveAnalyticsConfig } from './analyticsConfig'
import type { TrackingEreignis, TrackingProvider } from './tracking'

/**
 * AP23 PT23.2 — der EINZIGE Ort, der Google kennt.
 *
 * Vorher wussten drei Module, wie man Google erreicht: `GtmPageview` rief
 * `gtag` auf, `pages/consumer/tracking.ts` schrieb in `window.dataLayer`, und
 * die Fassade kannte gar keinen Anbieter. Jetzt steht `dataLayer` und `gtag`
 * ausschliesslich hier; ein Test prueft genau das gegen den Quellbaum.
 *
 * **Ein Ereignis, ein Transport.** Das ist die Auflösung von `CTC-02`: bisher
 * schickte ein einzelner Seitenwechsel BEIDES — `gtag('event','page_view')`
 * und zusaetzlich `dataLayer.push({event:'virtual_pageview'})`. Solange kein
 * Container-Trigger auf `virtual_pageview` steht, faellt das nicht auf; sobald
 * einer eingerichtet wird, zaehlt GA4 jeden Seitenwechsel doppelt, und zwar
 * rueckwirkend unbemerkt. Die Zuordnung unten ist deshalb eine Tabelle mit
 * genau einem Weg je Ereignis.
 *
 * `page_view` behaelt bewusst den gtag-Weg: er misst heute nachweislich, ohne
 * dass im Container etwas eingerichtet sein muss. Ihn auf den dataLayer
 * umzustellen haette die Messung von einem Trigger abhaengig gemacht, dessen
 * Existenz niemand belegt hat — das ist PT23.4, nicht PT23.2.
 */

type TransportArt = 'gtag' | 'dataLayer'

interface GoogleWindow extends Window {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

/** Ein Ereignis, ein Weg. Die Tabelle ist der Vertrag. */
const TRANSPORT: Record<TrackingEreignis['name'], TransportArt> = {
  // Misst heute direkt gegen GA4, ohne Container-Trigger.
  page_view: 'gtag',
  // Alles Uebrige vom Container verwaltet (GA4, Meta, LinkedIn) — genau
  // dafuer gibt es GTM. AP23 PT23.3: die sechs Konversionen und die
  // Zustellung gehen ueber den dataLayer, damit Marketing sie im Container
  // als Conversion-Tags verdrahten kann, ohne einen Code-Deploy zu brauchen.
  contact_submit: 'dataLayer',
  support_submit: 'dataLayer',
  consumer_order_submit: 'dataLayer',
  roi_report_request: 'dataLayer',
  epigenetics_inquiry_submit: 'dataLayer',
  lead_magnet_submit: 'dataLayer',
  download_delivered: 'dataLayer',
  cta_click: 'dataLayer',
  panel_select: 'dataLayer',
  search: 'dataLayer',
  outbound_click: 'dataLayer',
  consumer_order_modal_open: 'dataLayer',
  consumer_order_modal_close: 'dataLayer',
  chapter_toggle: 'dataLayer',
  scroll_depth: 'dataLayer',
  quote_request: 'dataLayer',
}

/**
 * Deutsche Feldnamen der Fassade auf die Parameternamen abbilden, die eine
 * Auswertung erwartet. Die Uebersetzung gehoert hierher und nicht in den
 * Geschaeftscode: der soll das Vokabular der Website sprechen, nicht das von
 * Google.
 */
function parameter(ereignis: TrackingEreignis): Record<string, unknown> {
  switch (ereignis.name) {
    case 'page_view': {
      const params: Record<string, unknown> = { page_path: ereignis.pfad }
      if (ereignis.sprache) params.page_language = ereignis.sprache
      if (ereignis.titel) params.page_title = ereignis.titel
      const { ga4MeasurementId } = resolveAnalyticsConfig()
      // Deterministisches Routing, falls je ein zweites Ziel im Container
      // haengt. Ohne konfigurierte Kennung bleibt es beim Broadcast.
      if (ga4MeasurementId) params.send_to = ga4MeasurementId
      return params
    }
    case 'cta_click':
      return {
        cta_location: ereignis.ort,
        ...(ereignis.seite ? { consumer_page: ereignis.seite } : {}),
      }
    // Die drei kontextlosen Konversionen tragen keinen einzigen Parameter.
    case 'contact_submit':
    case 'support_submit':
    case 'roi_report_request':
      return {}
    case 'epigenetics_inquiry_submit':
      return ereignis.panel ? { panel: ereignis.panel } : {}
    case 'lead_magnet_submit':
      return { asset_id: ereignis.asset }
    case 'download_delivered':
      return {
        asset_id: ereignis.asset,
        ...(ereignis.sprache ? { asset_language: ereignis.sprache } : {}),
      }
    case 'search':
      return { result_count: ereignis.treffer, query_length: ereignis.laenge }
    case 'outbound_click':
      return { outbound_domain: ereignis.domain }
    case 'consumer_order_modal_open':
    case 'consumer_order_modal_close':
      return {
        consumer_page: ereignis.seite,
        product: ereignis.produkt,
        ...(ereignis.ort ? { cta_location: ereignis.ort } : {}),
      }
    case 'consumer_order_submit':
      return {
        consumer_page: ereignis.seite,
        product: ereignis.produkt,
        quantity: ereignis.menge,
      }
    case 'chapter_toggle':
      return { panel: ereignis.panel, block: ereignis.block, opened: ereignis.offen }
    case 'scroll_depth':
      return { page_group: ereignis.seite, depth: ereignis.stufe }
    case 'panel_select':
      return { panel: ereignis.panel, path: ereignis.weg }
    case 'quote_request':
      return { panels: ereignis.panels.join(','), source: ereignis.quelle }
  }
}

/**
 * Der Google-Anbieter.
 *
 * Er legt **nichts** an: weder `dataLayer` noch `gtag` werden hier erzeugt.
 * Beide entstehen ausschliesslich in `googleConsent.ts`, und zwar erst nach
 * einer Zustimmung. Findet dieser Anbieter sie nicht vor, sendet er nichts —
 * damit kann ein versehentlich zu frueh registrierter Anbieter kein Gefaess
 * anlegen, in dem sich etwas ansammelt.
 */
export function createGoogleTrackingProvider(): TrackingProvider {
  return (ereignis: TrackingEreignis) => {
    if (typeof window === 'undefined') return
    const target = window as GoogleWindow
    const params = parameter(ereignis)

    if (TRANSPORT[ereignis.name] === 'gtag') {
      if (typeof target.gtag !== 'function') return
      target.gtag('event', ereignis.name, params)
      return
    }

    if (!Array.isArray(target.dataLayer)) return
    target.dataLayer.push({ event: ereignis.name, ...params })
  }
}

/** Fuer Tests und den Vertrag: welcher Weg gilt fuer welches Ereignis. */
export function transportFuer(name: TrackingEreignis['name']): TransportArt {
  return TRANSPORT[name]
}
