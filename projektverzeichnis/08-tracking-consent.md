# 08 — Tracking, Consent und Datenschutz

Quellen: `index.html`, `src/components/ui/CookieBanner.tsx`,
`src/components/analytics/GtmPageview.tsx`, `src/lib/tracking.ts`, `src/lib/useScrollDepth.ts`.

## 1. Google Tag Manager

Container-ID **`GTM-TW6JFX7K`**, eingebunden in `index.html`:
Script im `<head>`, `<noscript>`-iframe (`googletagmanager.com/ns.html`) im `<body>`.

## 2. Consent Mode v2 — Standard: abgelehnt

Der Default-Consent wird gesetzt, **bevor** GTM lädt:

| Signal                    | Default   |
| ------------------------- | --------- |
| `analytics_storage`       | `denied`  |
| `ad_storage`              | `denied`  |
| `ad_user_data`            | `denied`  |
| `ad_personalization`      | `denied`  |
| `personalization_storage` | `denied`  |
| `functionality_storage`   | `granted` |
| `security_storage`        | `granted` |
| `wait_for_update`         | `500` ms  |

Direkt danach liest ein Inline-Skript `localStorage['cookie-consent']` und hebt die
Signale per `gtag('consent','update', …)` an, wenn dort bereits eine Zustimmung steht.
Fehler beim `localStorage`-Zugriff werden geschluckt (Privatmodus/blockierte Cookies).

### 2.1 Kategorien des Banners

| Kategorie-`id` | Hebt an                                            |
| -------------- | -------------------------------------------------- |
| `analytics`    | `analytics_storage`                                |
| `marketing`    | `ad_storage`, `ad_user_data`, `ad_personalization` |

Widerruf setzt dieselben Signale zurück auf `denied`.
Der Banner pusht zusätzlich ein Consent-Event in `window.dataLayer` als GTM-Trigger
und feuert bei erteilter Analytics-Zustimmung einen `page_view` nach.

Speicherort der Entscheidung: `localStorage['cookie-consent']` als JSON-Array von
`{ id, enabled }`.

`CookieBanner` ist **site-weit** gerendert — außerhalb der `MainLayout`-Route,
damit auch die Consumer-Landingpages ihn bekommen.

## 3. Seitenaufrufe

`GtmPageview` sendet bei **jedem clientseitigen Routenwechsel** einen GA4-`page_view`
(SPA-Tracking, alle Sprachen, gesamte Site). Ohne das zählte nur der erste Aufruf.

## 4. Eigene Ereignisse (`src/lib/tracking.ts`)

Anbieterunabhängige Fassade. Das Modul kennt **keine** Bibliothek: ein `TrackingProvider`
ist schlicht eine Funktion `(ereignis) => void`. Ohne registrierten Anbieter ist `track()`
ein No-Op — es baut keine Verbindung auf und schreibt nicht in `window.dataLayer`.

| Funktion                          | Wirkung                                                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `setTrackingProvider(fn \| null)` | Anbieter setzen; `null` entfernt ihn — der Weg für einen Widerruf, bei dem der Dienst nicht nur stumm, sondern weg sein soll |
| `setTrackingConsent(boolean)`     | Einwilligung schalten                                                                                                        |
| `trackingAktiv()`                 | Status abfragen                                                                                                              |
| `track(ereignis)`                 | Ereignis senden                                                                                                              |

### 4.1 Das vollständige Ereignis-Vokabular (`TRACKING_EREIGNISSE`)

| Ereignis         | Ausgelöst von                            |
| ---------------- | ---------------------------------------- |
| `chapter_toggle` | Kapitelleiste (`ChapterNav`)             |
| `scroll_depth`   | `src/lib/useScrollDepth.ts`              |
| `panel_select`   | Panel-Auswahl auf der Epigenetik-Strecke |
| `quote_request`  | Konditionen-/Angebotsanfrage             |

Mehr Ereignisse gibt es nicht — die Liste ist typgeprüft
(`as const satisfies readonly TrackingEreignisName[]`).

## 5. Datenschutz-Randbedingungen

- Rechtstexte: `/privacy`, `/imprint`, `/terms` (Namespace `legal`, `LegalLayout`)
- `/agb` leitet per 301 auf `/terms` (alte, weiterhin verlinkte URL)
- Die Epigenetik-Strecke trägt einen **GenDG-Hinweis**, auch auf den vier Panels ohne
  Genotypen (Commit `961f65d`), und einen Datenschutz-Link (`e792cd3`);
  Krankheitsaussagen wurden aus den Befundtexten entfernt (`40c743f`)
- `_project-knowledge/wave-0-dsgvo-incident.md` protokolliert einen früheren DSGVO-Vorfall
- Formulardaten gehen ausschließlich an das eigene Backend (SendGrid-Versand),
  nicht an Dritt-Tracker
