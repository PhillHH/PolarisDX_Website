/**
 * Consumer-Landingpages — Ereignisse der Bestellstrecke.
 *
 * AP23 PT23.2 — dieses Modul schreibt NICHT mehr selbst in den dataLayer.
 * Vorher lag hier ein eigener Weg zum Provider (`window.dataLayer.push`), mit
 * eigenem Vokabular und eigener Nutzlastform; die Einwilligung wurde an
 * dieser Stelle ein zweites Mal geprueft. Beides ist jetzt eine Aufgabe der
 * Fassade (`lib/tracking.ts`): sie kennt die Typen, prueft die Nutzlast und
 * entscheidet, ob ueberhaupt ein Anbieter existiert.
 *
 * Was bleibt: die drei Hilfsfunktionen, die die Consumer-Seiten aufrufen.
 * Sie uebersetzen Seitenwissen in ein typisiertes Ereignis — mehr nicht.
 *
 * Die Bestellstrecke haengt an KEINER Stelle an der Messung: eine Bestellung
 * ohne Analytics-Einwilligung laeuft vollstaendig durch.
 */

import { track, type ConsumerMenge, type ConsumerPage, type CtaLocation } from '../../lib/tracking'

export type { ConsumerPage, CtaLocation } from '../../lib/tracking'

/**
 * Freitext-Beschriftungen gehen NICHT mit.
 *
 * Vorher floss `cta_label` mit — der uebersetzte Knopftext. In zehn Sprachen
 * ergab dasselbe Ereignis zehn verschiedene Werte, und der Text aendert sich
 * mit jeder Redaktion. Der ORT beantwortet die Frage ("traegt der Hero oder
 * der Abschluss-CTA?"), die Beschriftung nicht.
 */
export function trackConsumerCtaClick(seite: ConsumerPage, ort: CtaLocation): void {
  track({ name: 'cta_click', seite, ort })
}

export function trackConsumerOrderModalOpen(
  seite: ConsumerPage,
  produkt: string,
  ort?: CtaLocation,
): void {
  track({ name: 'consumer_order_modal_open', seite, produkt, ort })
}

export function trackConsumerOrderModalClose(seite: ConsumerPage, produkt: string): void {
  track({ name: 'consumer_order_modal_close', seite, produkt })
}

/** Nur nach bestaetigter Persistenz aufrufen — der Aufrufer prueft `res.ok`. */
export function trackConsumerOrderSubmit(
  seite: ConsumerPage,
  produkt: string,
  menge: ConsumerMenge,
): void {
  track({ name: 'consumer_order_submit', seite, produkt, menge })
}

/**
 * AP23 PT23.3 — `useConsumerPageView` ist ENTFALLEN.
 *
 * Es meldete beim Mount einer Consumer-Seite ein eigenes
 * `consumer_page_view`, waehrend `GtmPageview` denselben Routenwechsel
 * bereits als `page_view` meldete: ein Wechsel auf /de/consumer/… erzeugte
 * ZWEI Seitenaufruf-Ereignisse. Die Dimension „welche Consumer-Seite" steckt
 * im Pfad und laesst sich daraus ableiten — ein zweites Ereignis dafuer war
 * eine Doppelzaehlung mit anderem Namen.
 */
