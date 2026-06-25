# Analytics- & Metrik-Audit — Phase 0

> GTM/GA4-Events listen, Vanity- vs. Outcome-Metriken markieren, Aggregat-Score-Nutzung prüfen.
> Quelle: `components/analytics/GtmPageview.tsx`, `pages/consumer/tracking.ts`,
> `pages/consumer/{OrderModal,OrderForm}.tsx`, `index.html`. Stand **2026-06-24**.
> Outcome-Event-Verdrahtung in `lib/metrics/definitions.ts` folgt in Phase 5.

## Setup

- GTM-Container `GTM-TW6JFX7K` (in `index.html`), GA4 via GTM (`G-PLZNWGKW0P`).
- Consent Mode v2 (DSGVO-Defaults: analytics/ad storage zunächst denied), Consent in `localStorage` (`cookie-consent`).
- Alle Pushes SSR-sicher (`typeof window === 'undefined'`-Guards), über `window.dataLayer`.

## Event-Inventar

| Event                        | Quelle                                        | Misst                                 | Klassifikation                                                |
| ---------------------------- | --------------------------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| `page_view`                  | `analytics/GtmPageview.tsx` (Route-Wechsel)   | Navigation (path/lang/title/referrer) | **Vanity** (roh) — nur segmentiert (lang/path) aussagekräftig |
| `virtual_pageview`           | `analytics/GtmPageview.tsx` (sekundärer Push) | dito                                  | **Vanity** — aktuell im Container inert                       |
| `consumer_page_view`         | `consumer/tracking.ts` (Mount)                | Funnel-Eintritt (spray/masks/duo)     | **Outcome (proxy)** — Funnel-Start                            |
| `consumer_cta_click`         | `consumer/tracking.ts` + `data-gtm-*`         | Intent (cta_label/location)           | **Outcome (proxy)** — Intent                                  |
| `consumer_order_modal_open`  | `consumer/OrderModal.tsx`                     | Funnel-Engagement                     | **Outcome (proxy)**                                           |
| `consumer_order_modal_close` | `consumer/OrderModal.tsx` (ohne Submit)       | Funnel-Abbruch                        | **Outcome (proxy)**                                           |
| `consumer_order_submit`      | `consumer/OrderForm.tsx` (Erfolg)             | **Conversion**                        | **Outcome (echt)**                                            |

## Vanity-Markierung

- `page_view` / `virtual_pageview` = **Vanity**, solange nicht nach Intent/Aufgabe segmentiert.
  → Phase 5: in **Outcome-Events** überführen (`lib/metrics/definitions.ts` mit
  `{name, hypothesis, whatItProxies, validityCaveat, scaleType, story}`).
- Consumer-`*`-Events sind brauchbare Proxy-/Outcome-Signale (Funnel) — bleiben (Bereich Tabu §5).

## Aggregat-Score-Prüfung

- **Kein** nutzersichtbarer Aggregat-/Composite-Score in der UI gefunden (gut — entspricht §Phase 5.7).
- `lib/metrics/aggregate.ts` ist Stub mit **qualitativer** Band-Logik (good/watch/poor + needsAttention),
  **kein** einzelner Score — beizubehalten; ordinal→Median-Anforderung in Phase 5 testen.

## Empfehlungen (Backlog → Phase 5)

1. Outcome-Events für Main-Site definieren (z. B. „Service-Detail erreicht", „Kontaktanfrage gesendet").
2. ≥1 subjektive Qualitätsmetrik ergänzen (z. B. Self-Report/Mini-Survey).
3. Median statt Mittelwert für ordinale Skalen (`aggregate.ts` + Test).
4. Kein Aggregat-Score in nutzersichtbaren Status-UIs (qualitativer Überblick + Drilldown).
