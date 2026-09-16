# CONSENT-TRACKING-CONTRACT

**Owner-AP:** AP23 — Consent, GTM/GA4 und Analytics
**Stand:** AP23 PT23.1 (2026-09-09)
**Zielautorität:** `DEC-RL-004` (GTM/GA4 nur nach wirksamem Consent), `REST-02`
(Basic Consent Mode v2 / vollständiger Ladeverzicht), Launch-Gate 2.

Dieser Vertrag hält fest, was gemessen wurde — nicht, was beabsichtigt ist.
Jede Aussage unten ist entweder im Browser oder im Test nachgestellt.

---

## 1. Was Basic Mode hier bedeutet

**Vor einer Einwilligung wird der Anbieter GAR NICHT geladen.** Nicht „geladen
und auf `denied` gestellt" — das wäre Advanced Mode und hätte bereits einen
Request an Google ausgelöst. Der Unterschied ist am Quelltext nicht ablesbar
(beide Varianten setzen `consent default denied`), nur am Netz. Deshalb liegt
die Beweislast in `e2e/pt23.1.spec.ts` und nicht in einem Unit-Test.

---

## 2. Provider-/Origin-Inventar

| Origin                     | Zweck                      | Vor Consent  | Nach Consent               |
| -------------------------- | -------------------------- | ------------ | -------------------------- |
| `www.googletagmanager.com` | GTM-Container (`gtm.js`)   | **0**        | genau ein Request          |
| `*.google-analytics.com`   | GA4, über GTM              | **0**        | nur GTM-vermittelt         |
| `stats.g.doubleclick.net`  | Marketing/Remarketing      | **0**        | nur bei Marketing-Consent  |
| `widget.hihuman.co.uk`     | Chat                       | **entfernt** | **entfernt** (AP22 PT22.7) |
| `fonts.gstatic.com`        | selbstgehostet, essenziell | erlaubt      | erlaubt                    |

`index.html` enthält **kein** GTM-Script, **kein** `noscript`-iframe und
**kein** `preconnect`/`dns-prefetch` auf eine Google-Origin. Gemessen am rohen
SSR-Dokument, nicht am hydrierten DOM.

---

## 3. Consent State Map

Speicher: `localStorage`, Schlüssel `cookie-consent`. Eine Quelle für Format
und Version: `src/lib/consentState.ts`.

```json
{ "version": 2, "decidedAt": "<ISO>", "analytics": false, "marketing": false }
```

| Eigenschaft        | Verhalten                                                                       |
| ------------------ | ------------------------------------------------------------------------------- |
| Versioniert        | `version` ≠ `CONSENT_VERSION` ⇒ **nicht entschieden**, der Dialog fragt erneut  |
| Korruptionsfest    | kaputtes JSON, Zahl, `null`, String, falscher Feldtyp ⇒ **nicht entschieden**   |
| Altformat          | das unversionierte Array `[{id,enabled}]` gilt **nicht** als gültige Zustimmung |
| Ohne Personenbezug | genau vier Felder; kein Name, keine Kennung, keine URL, kein Zähler             |
| Speicherfehler     | nicht schreibbar ⇒ Rückfall auf „keine Einwilligung", nicht auf „erteilt"       |
| Widerruf           | Eintrag wird **entfernt**, nicht auf `false` gesetzt                            |

**Kategorien:** `necessary` (nicht abwählbar, kein Tracking), `analytics`,
`marketing`. Nur die letzten beiden entscheiden über Provider.

**Warum Version 2:** das Altformat belegt nicht, für welchen Umfang zugestimmt
wurde. Eine alte Zustimmung stillschweigend auf die heutigen Kategorien zu
übertragen wäre eine Behauptung über eine Entscheidung, die so nie getroffen
wurde. Folge, bewusst in Kauf genommen: Bestandsnutzer werden **einmal** erneut
gefragt.

---

## 4. Provider-Loader

`src/lib/googleConsent.ts`, drei Ausgänge in dieser Reihenfolge:

1. **Keine Zustimmung, kein Provider** → sofort zurück. Es entsteht kein
   `dataLayer`, kein `gtag`, kein Script-Element.
2. **Keine Zustimmung, Provider läuft schon** (Widerruf im laufenden Dokument)
   → `consent update` auf `denied`, Script wird entfernt, `reloadRequired`
   gemeldet.
3. **Zustimmung** → Defaults einmal, `update`, Container **genau einmal**.

**Ohne konfigurierten Container wird nichts geladen** (§5). Der Loader ist ein
deterministisches Singleton: `__gtmBootstrapStarted` plus Element-ID.

---

## 5. GTM-/GA4-Konfigurations-Baseline

| Kennung         | Herkunft vor PT23.1                       | Jetzt                                           |
| --------------- | ----------------------------------------- | ----------------------------------------------- |
| GTM-Container   | `GTM-TW6JFX7K`, **fest im Quelltext**     | `VITE_GTM_CONTAINER_ID`, sonst **kein Load**    |
| GA4-Messkennung | `G-PLZNWGKW0P`, **fest in `GtmPageview`** | `VITE_GA4_MEASUREMENT_ID`, sonst kein `send_to` |

Beide Werte stammen aus dem Altbestand und wurden im laufenden Code so
behandelt, als wären sie geprüft. **Sie sind es nicht:** wem der Container
gehört, welche Tags er enthält und ob GA4 dort hängt, ist nicht extern
verifiziert. Sie stehen in `analyticsConfig.ts` als **Belege für PT23.4**, nicht
als Standardwerte.

Eine syntaktisch falsche Kennung wird **verworfen**, nicht durchgereicht: ein
Tippfehler in der Umgebung würde sonst eine Anfrage an einen fremden oder nicht
existierenden Container auslösen.

> **Betriebliche Folge, ausdrücklich benannt:** solange `VITE_GTM_CONTAINER_ID`
> im Deployment nicht gesetzt ist, lädt **kein** Container — auch nach
> Zustimmung nicht. Das ist die sichere Richtung (eine Seite ohne Messung ist
> ein Nachteil, eine Seite, die an einen unbekannten Container sendet, ist ein
> Vorfall), aber es ist eine Verhaltensänderung. Setzen **und** externe Prüfung
> sind **PT23.4**.

---

## 6. Event Source Map

Alle produktiven Stellen, an denen ein Analytics-Ereignis entstehen kann:

| Quelle                                 | Ereignisse                                                        | Consent-Gate               | Weg                           |
| -------------------------------------- | ----------------------------------------------------------------- | -------------------------- | ----------------------------- |
| `components/analytics/GtmPageview.tsx` | `page_view`, `virtual_pageview`                                   | `hasAnalyticsConsent()`    | **direkt** `gtag`/`dataLayer` |
| `pages/consumer/tracking.ts`           | `consumer_page_view`, `consumer_cta_click`, Order-Events          | `hasAnalyticsConsent()`    | **direkt** `dataLayer.push`   |
| `lib/tracking.ts`                      | `chapter_toggle`, `scroll_depth`, `panel_select`, `quote_request` | eigener In-Memory-Schalter | **Fassade**, ohne Anbieter    |

**Aufrufer:** `pages/consumer/{OrderForm,OrderModal}.tsx` und acht Consumer-CTAs
(über `tracking.ts`), `pages/EpigeneticsPage.tsx`, `components/befund/BefundBlocks.tsx`,
`lib/useScrollDepth.ts` (über `lib/tracking.ts`).

**Kein Puffer, an keiner der drei Stellen.** Ereignisse vor der Einwilligung
werden verworfen und nicht nachgesendet. `lib/tracking.ts` hat bis heute
**keinen registrierten Anbieter** — `setTrackingProvider` wird nirgends
aufgerufen, das Modul ist damit vollständig inert.

---

## 7. Direct Bypass Map — **aufgelöst mit PT23.2**

> **Erledigt (2026-09-09).** Alle drei Umgehungen sind entfernt; ein Test liest
> den Quellbaum und hält den Zustand. Der folgende Abschnitt beschreibt die
> Ausgangslage und bleibt als Beleg stehen. Ergebnis in §13.

Die harte AP23-Regel lautet: **Tracking nur über eine provider-neutrale
Fassade, keine direkten `dataLayer.push`/`gtag('event',…)` außerhalb des
zentralen Adapters.** Dieser Zustand ist **nicht** hergestellt. PT23.1 stellt
den Ladeverzicht her und **kartiert** die Umgehungen; sie aufzulösen ist
PT23.2/PT23.3 und wurde hier bewusst nicht vorgezogen.

| #   | Ort                                       | Umgehung                                        | Owner  |
| --- | ----------------------------------------- | ----------------------------------------------- | ------ |
| 1   | `components/analytics/GtmPageview.tsx:88` | `w.gtag('event','page_view', …)` direkt         | PT23.2 |
| 2   | `components/analytics/GtmPageview.tsx:92` | `w.dataLayer?.push({event:'virtual_pageview'})` | PT23.2 |
| 3   | `pages/consumer/tracking.ts:55`           | `window.dataLayer.push(event)` direkt           | PT23.2 |

**Drei parallele Ereigniswege statt einem.** Alle drei sind consent-gated —
keiner ist ein Datenschutzleck. Der Befund ist Architektur, nicht Sicherheit:
drei Vokabulare, drei Nutzlastformen, keine gemeinsame Typprüfung. Ein typisiertes
Ereignisvokabular über eine Fassade ist PT23.2.

**Ebenfalls offen für PT23.2:** `GtmPageview` sendet `page_view` **und**
`virtual_pageview`. Kommt im Container je ein Trigger auf `virtual_pageview`,
zählt GA4 doppelt — der Kommentar an Ort und Stelle hält das fest, gelöst ist
es nicht.

---

## 8. Widerruf

Vor PT23.1 gab es ihn **nicht**: der Banner rendert nur ohne gespeicherte
Entscheidung, und es existierte kein einziger Einstiegspunkt, ihn erneut zu
öffnen. Eine getroffene Entscheidung war endgültig — obwohl der Widerruf
genauso einfach sein muss wie die Zustimmung.

Jetzt: `footer.cookie_settings` (Fußzeile, alle 10 Sprachen) → `requestConsentReopen()`
→ Dialog öffnet mit Einstellungen → `cookie.withdraw`.

Wirkung: Entscheidung gelöscht, Signale auf `denied`, Script entfernt, und
**wenn im Dokument bereits ein Container lief, wird neu geladen**. Grund: ein
einmal ausgeführtes Providerskript lässt sich nicht zuverlässig zurückrufen —
Timer, offene Verbindungen und registrierte Listener überleben das Entfernen
des Elements. Ohne geladenen Provider bleibt der Nutzer, wo er ist.

---

## 9. Netz-Evidenz (PT23.1, gemessen)

| Messung                                               | Ergebnis                            |
| ----------------------------------------------------- | ----------------------------------- |
| Pre-Consent GTM-Requests (8 Seiten, 3 Sprachen)       | **0**                               |
| Pre-Consent GA4-Requests                              | **0**                               |
| Pre-Consent Marketing-Requests (DoubleClick u. a.)    | **0**                               |
| GTM-`noscript`-iframe im SSR-HTML                     | **0**                               |
| Provider-Requests **ohne JavaScript**                 | **0**                               |
| `dataLayer` vor Consent                               | **nicht vorhanden**                 |
| Analytics-Spuren in local-/sessionStorage vor Consent | **0**                               |
| Requests nach ABLEHNUNG (inkl. Reload)                | **0**                               |
| Container-Requests nach ZUSTIMMUNG                    | genau 1, mit konfigurierter Kennung |
| Requests nach WIDERRUF                                | **0**                               |
| Kontaktanfrage ohne Analytics-Consent                 | **202**                             |

---

## 10. Offen nach PT23.1

| ID       | Sachverhalt                                                                                                                                                                      | Owner       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `CTC-01` | Drei direkte Provider-Aufrufe außerhalb einer Fassade (§7)                                                                                                                       | PT23.2      |
| `CTC-02` | `page_view` **und** `virtual_pageview` — Doppelzählungsrisiko bei einem Container-Trigger                                                                                        | PT23.2      |
| `CTC-03` | `lib/tracking.ts` ist inert (kein Anbieter registriert); die vier Epigenetik-Ereignisse messen nichts                                                                            | PT23.2      |
| `CTC-04` | `VITE_GTM_CONTAINER_ID` ist im Deployment nicht gesetzt ⇒ kein Container, auch nach Zustimmung                                                                                   | PT23.4      |
| `CTC-05` | Container, Tags und GA4-Property extern **nicht verifiziert**                                                                                                                    | PT23.4      |
| `CTC-06` | CSP führt GTM-/GA4-/DoubleClick-Origins unverändert; Finalisierung (Enforce, Wildcards)                                                                                          | AP26 PT26.2 |
| `CTC-07` | Keine Consent-Evidence für Analytics serverseitig — bewusst: die Journey-Consent-Evidence (AP22) ist Verarbeitungs-Consent und darf nicht mit Marketing-Consent vermischt werden | PT23.3      |

---

## 11. PROVEN — DO NOT REDISCOVER

- **Chat ist vollständig entfernt** (AP22 §25.9): Endpunkt 404, UI, Provider,
  CSP, Env, Dependencies, Docs. Keine erneute Chat-Suche nötig.
- **Business Flows hängen an keiner Analytics-Einwilligung** (AP22-CLOSURE §27.2
  und PT23.1 §9): alle sieben Journeys laufen nach „Nur notwendige" vollständig.
- **Verarbeitungs-Consent ≠ Marketing-Consent** (AP22 LEAD-12/LEAD-13): getrennt
  modelliert, getrennt persistiert. PT23.x fasst das nicht an.
- **`index.html` trägt kein GTM** — der statische Loader ist bereits vor AP23
  entfernt worden; PT23.1 hat es nachgemessen, nicht erneut entfernt.

---

## 12. PT23.2 PRIMARY WRITE SET

| Datei                                                                                                  | Warum                                                 |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `src/lib/tracking.ts`                                                                                  | die vorhandene Fassade — erweitern statt zweite bauen |
| `src/components/analytics/GtmPageview.tsx`                                                             | Bypass 1 + 2, plus die Doppelzählungsfrage (`CTC-02`) |
| `src/pages/consumer/tracking.ts`                                                                       | Bypass 3                                              |
| `src/pages/consumer/{OrderForm,OrderModal}.tsx`                                                        | Aufrufer der Consumer-Events                          |
| `src/lib/useScrollDepth.ts`, `src/components/befund/BefundBlocks.tsx`, `src/pages/EpigeneticsPage.tsx` | Aufrufer der inerten Fassade                          |
| `building-docs/CONSENT-TRACKING-CONTRACT.md`                                                           | Vokabular und Bypass-Auflösung festhalten             |

**Drift-Signale für PT23.2:** Änderungen an `src/lib/{consentState,googleConsent,analyticsConfig}.ts`,
an `CookieBanner.tsx` oder an `e2e/pt23.1.spec.ts`.

---

## 13. Delta PT23.2 — eine Fassade, ein Adapter (2026-09-09)

### 13.1 Was aufgelöst wurde

| #   | Ort                                | Vorher                               | Jetzt                          |
| --- | ---------------------------------- | ------------------------------------ | ------------------------------ |
| 1   | `components/analytics/GtmPageview` | `gtag('event','page_view', …)`       | `track({name:'page_view', …})` |
| 2   | `components/analytics/GtmPageview` | `dataLayer.push({virtual_pageview})` | **entfallen** (Doppelzählung)  |
| 3   | `pages/consumer/tracking.ts`       | `window.dataLayer.push(event)`       | delegiert an die Fassade       |

`dataLayer` und `gtag` stehen jetzt ausschließlich in `lib/trackingProvider.ts`
(Adapter) und `lib/googleConsent.ts` (Loader). Ein Test in
`lib/trackingBypass.test.ts` liest den gesamten `src`-Baum ohne Kommentare und
schlägt bei jeder weiteren Nennung an.

### 13.2 Die Fassade

Geschäftscode sieht genau vier Funktionen — `setTrackingProvider`,
`setTrackingConsent`, `trackingActive`, `track` — und keinen Anbieter.

**Auslieferungszustand: kein Anbieter, keine Einwilligung, also No-Op.** Beide
Sperren sind unabhängig: mit Anbieter aber ohne Einwilligung passiert nichts,
mit Einwilligung aber ohne Anbieter ebenso. Vor der Einwilligung entstandene
Ereignisse werden **verworfen und nicht nachgesendet**.

`setTrackingConsent` und `setTrackingProvider` werden an **genau einer Stelle**
gerufen: in `applyGoogleConsent`/`withdrawGoogleConsent`. Der Geschäftscode ruft
sie nie — er wüsste sonst, dass es einen Einwilligungszustand gibt, und jede
Aufrufstelle wäre eine Gelegenheit, ihn zu vergessen.

### 13.3 Ein Ereignis, ein Transport (`CTC-02` gelöst)

| Ereignis                                                                                       | Transport   |
| ---------------------------------------------------------------------------------------------- | ----------- |
| `page_view`                                                                                    | `gtag`      |
| alle übrigen (`consumer_*`, `chapter_toggle`, `scroll_depth`, `panel_select`, `quote_request`) | `dataLayer` |

Vorher schickte ein einzelner Seitenwechsel **beides**. Solange kein
Container-Trigger auf `virtual_pageview` stand, fiel das nicht auf — sobald
einer eingerichtet würde, hätte GA4 jeden Seitenwechsel doppelt gezählt,
rückwirkend unbemerkt.

`page_view` behält bewusst den gtag-Weg: er misst heute nachweislich, ohne dass
im Container etwas eingerichtet sein muss. Ihn auf den dataLayer umzustellen
hätte die Messung von einem Trigger abhängig gemacht, dessen Existenz niemand
belegt hat — das ist PT23.4.

### 13.4 Typisiertes Vokabular

Zehn Ereignisse, eine Typgrenze: `page_view`, `consumer_page_view`,
`consumer_cta_click`, `consumer_order_modal_open`, `consumer_order_modal_close`,
`consumer_order_submit`, `chapter_toggle`, `scroll_depth`, `panel_select`,
`quote_request`.

Die Prüfung ist **aufbauend, nicht filternd**: `pruefeEreignis` baut das
Ereignis neu aus den erlaubten Feldern. Ein später ergänztes Feld fällt damit
nicht unbemerkt mit nach draußen — nachgemessen mit einem Ereignis, dem
`email` und `nachricht` angehängt wurden.

### 13.5 Parameter-Allowlists und PII-Schranken

| Feld           | Regel                                                                |
| -------------- | -------------------------------------------------------------------- |
| Pfad           | Query **und** Fragment fallen weg; absolut, ≤256 Zeichen             |
| Sprache        | genau zwei Kleinbuchstaben                                           |
| Seitentitel    | ≤120 Zeichen, gegen die PII-Muster geprüft                           |
| Consumer-Seite | `spray` \| `masks` \| `duo`                                          |
| CTA-Ort        | Aufzählung, aus den real vorkommenden Orten abgeleitet               |
| Produkt/Block  | `[a-z0-9][a-z0-9-]{0,63}`                                            |
| Menge          | `1 \| 2 \| 3 \| 'MORE'` — deckungsgleich mit `ConsumerOrderQuantity` |
| Panel/Slug     | nur bekannte `MERK_SLUGS`                                            |

**PII-Muster als letzte Schranke:** E-Mail, Telefonnummer, Token/Hash (≥32 Hex),
die Wörter `token|jwt|bearer|secret|password|passwort`, datumsartige Folgen.
Was hier anschlägt, ist bereits an einer falschen Stelle entstanden — die
Schranke greift trotzdem.

### 13.6 Drei Befunde, die die PT23.1-Karte nicht hatte

Die Karte suchte nach `dataLayer.push` und `gtag(`. Drei Freitext-Wege liefen
daran vorbei:

1. **`cta_label` — der übersetzte Knopftext** ging als Ereignisparameter mit.
   In zehn Sprachen ergab dieselbe Schaltfläche zehn Werte, und jede
   Textänderung erzeugte lautlos einen neuen. **Entfernt**; der Ort bleibt und
   beantwortet die Frage, die die Messung stellt.
2. **`audience-${a.title…}`** — auf `SprayPage` wurde der Modal-Ort aus der
   **übersetzten Kartenüberschrift** slugifiziert. Ein unbegrenzter,
   sprachabhängiger Wert direkt in der Auswertung. Ersetzt durch den festen
   Ort `audience`; die Unterscheidung je Karte braucht eine stabile Kennung im
   Content (`CTC-09`).
3. **`data-gtm-cta`** — Datenattribute im DOM trugen denselben übersetzten
   Text, ausdrücklich damit GTM-Click-Trigger **am JS-Ereignis vorbei**
   auslösen können. Der Freitext ist entfernt; `data-gtm-page` und
   `data-gtm-location` bleiben, weil beide Aufzählungen sind. Dass ein
   Click-Trigger diese Attribute überhaupt am Adapter vorbei lesen kann, ist
   als `CTC-08` festgehalten — das ist eine Entscheidung des Marketing-Owners,
   keine stille Löschung durch diesen Task.

### 13.7 Nachweise

- **28/28** task-eigene Tests (`lib/tracking.test.ts` 25, `lib/trackingBypass.test.ts` 3),
  `src/lib` gesamt **80/80**, Node-Suiten unverändert, tsc/eslint/prettier clean.
- **Eine Bestandszusicherung angepasst:** `server/new-journeys.test.js` (AP22
  PT22.6) prüfte die Einwilligungssperre über die Zeichenkette
  `hasAnalyticsConsent` **in** `GtmPageview.tsx`. Die Sperre liegt jetzt in der
  Fassade; der Test prüft deshalb das Stärkere — die Komponente nennt weder
  `gtag` noch `dataLayer` und führt nur über die Fassade nach draußen. Die
  erste Fassung dieser Zusicherung war zu schwach: sie suchte `gtag(`, und
  ein eingeschleustes `gtag?.('event', …)` ging daran vorbei. Jetzt wird auf
  den Bezeichner geprüft.
- **Fünf Mutationsproben greifen:** Consent-Sperre entfernen · Nutzlastprüfung
  umgehen (11 Tests rot) · Query im Pfad behalten · Doppelzählung wieder
  einbauen · einen direkten `dataLayer`-Aufruf wieder einführen.
- Die Typgrenze hat die Arbeit mitgemacht: `tsc` hat jede Aufrufstelle
  benannt, an der Freitext oder ein unbekannter Wert floss — die drei Befunde
  in §13.6 sind so gefunden worden, nicht durch Lesen.

### 13.8 Offen nach PT23.2

| ID       | Sachverhalt                                                                                               | Owner              |
| -------- | --------------------------------------------------------------------------------------------------------- | ------------------ |
| `CTC-01` | **geschlossen** — 0 direkte Bypässe, durch Quellbaum-Test gehalten                                        | —                  |
| `CTC-02` | **geschlossen** — ein Ereignis, ein Transport                                                             | —                  |
| `CTC-03` | **geschlossen** — die Fassade hat einen Anbieter, registriert am Consent-Zustand                          | —                  |
| `CTC-08` | GTM-Click-Trigger können `data-gtm-*` am Adapter vorbei lesen; Attribute tragen nur noch Aufzählungswerte | PT23.3 / Marketing |
| `CTC-09` | Audience-Karten haben keine stabile Kennung; Ort ist auf `audience` vereinheitlicht                       | PT23.3 / Content   |
| `CTC-04` | `VITE_GTM_CONTAINER_ID` im Deployment ungesetzt ⇒ kein Container                                          | PT23.4             |
| `CTC-05` | Container, Tags und GA4-Property extern **nicht verifiziert**                                             | PT23.4             |
| `CTC-06` | CSP-Finalisierung                                                                                         | AP26 PT26.2        |
| `CTC-07` | serverseitige Analytics-Consent-Evidence                                                                  | PT23.3             |

### 13.9 EVENT SOURCE MAP für PT23.3

Alle Ereignisse laufen jetzt durch **eine** Grenze. Wer sie auslöst:

| Ereignis                     | Auslöser                                                     | Bedingung                               |
| ---------------------------- | ------------------------------------------------------------ | --------------------------------------- |
| `page_view`                  | `components/analytics/GtmPageview.tsx`                       | jeder SPA-Routenwechsel                 |
| `consumer_page_view`         | `SprayPage`, `MaskPage`, `DuoPage` via `useConsumerPageView` | Mount                                   |
| `consumer_cta_click`         | `pages/consumer/shell.tsx` (CTA-Komponente)                  | Klick                                   |
| `consumer_order_modal_open`  | `pages/consumer/OrderModal.tsx`                              | Öffnen                                  |
| `consumer_order_modal_close` | `pages/consumer/OrderModal.tsx`                              | Schließen ohne Absenden                 |
| `consumer_order_submit`      | `pages/consumer/OrderForm.tsx`                               | **nach `res.ok`**, also nach Persistenz |
| `chapter_toggle`             | `components/befund/BefundBlocks.tsx`                         | Kapitel auf/zu                          |
| `scroll_depth`               | `lib/useScrollDepth.ts`                                      | 25/50/75/100 %                          |
| `panel_select`               | (noch kein Aufrufer)                                         | —                                       |
| `quote_request`              | `pages/EpigeneticsPage.tsx`                                  | Klick auf den Anfrageweg                |

**Für PT23.3 relevant:** `consumer_order_submit` ist heute die einzige
Konversion und feuert bereits nach bestätigter Persistenz. Ein
`download_delivered` gibt es **nicht** — es müsste an einen realen
Zustellerfolg gebunden werden, nicht an den Formularversand.

### 13.10 PT23.3 PRIMARY WRITE SET

| Datei                                                                         | Warum                                                        |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `src/lib/tracking.ts`                                                         | Konversionsereignisse ergänzen — die Typgrenze steht         |
| `src/lib/trackingProvider.ts`                                                 | Transportzuordnung für neue Ereignisse                       |
| `src/hooks/useContactForm.ts`, `useSupportForm.ts`, `useConsumerOrderForm.ts` | Konversion erst nach `result.ok`                             |
| `src/api/contentDownload.ts`                                                  | `download_delivered` nur bei realem Zustellerfolg (`CTC-07`) |
| `src/pages/consumer/shell.tsx`                                                | `CTC-08`/`CTC-09`, falls dort entschieden                    |
| `building-docs/CONSENT-TRACKING-CONTRACT.md`                                  | Konversionsvertrag festhalten                                |

**PROVEN — DO NOT REDISCOVER:** Ladeverzicht und Netz-Evidenz (§9), Consent
State Map (§3), Provider-Loader (§4), Konfigurationsbaseline (§5),
Bypass-Freiheit (§13.1, durch Test gehalten), Typgrenze und Allowlists (§13.4/§13.5).

**Drift-Signale für PT23.3:** Änderungen an `src/lib/{tracking,trackingProvider,googleConsent,consentState}.ts`
oder an `e2e/pt23.1.spec.ts`.

---

## 14. Delta PT23.3 — Ereignis- und Konversionstaxonomie (2026-09-09)

### 14.1 Das Ereignisregister

**Zwölf kanonische Ereignisse**, dazu fünf Bestandsereignisse aus AP15/AP19/AP21,
die Engagement messen und ausdrücklich **keine** Konversionen sind.

| Ereignis                                                                             | Klasse               | Auslöser                                            | Gate                                |
| ------------------------------------------------------------------------------------ | -------------------- | --------------------------------------------------- | ----------------------------------- |
| `page_view`                                                                          | Seitenaufruf         | `components/analytics/GtmPageview.tsx`              | Pfadwechsel, nicht Parameterwechsel |
| `contact_submit`                                                                     | Konversion           | `hooks/useContactForm.ts`                           | `result.ok` (202, persistiert)      |
| `support_submit`                                                                     | Konversion           | `hooks/useSupportForm.ts`                           | `result.ok`                         |
| `consumer_order_submit`                                                              | Konversion           | `pages/consumer/OrderForm.tsx`                      | `res.ok`                            |
| `roi_report_request`                                                                 | Konversion           | `components/sections/RoiCalculatorSection.tsx`      | `result.ok`                         |
| `epigenetics_inquiry_submit`                                                         | Konversion           | `components/epigenetics/EpigeneticsInquiryForm.tsx` | `response.accepted`                 |
| `lead_magnet_submit`                                                                 | Konversion           | `components/resources/ResourceGateForm.tsx`         | `accepted` **und** Downloadlink     |
| `download_delivered`                                                                 | Zustellung           | `components/resources/ResourceGateForm.tsx`         | **beobachtete HTTP-Erfolgsantwort** |
| `cta_click`                                                                          | Engagement           | `pages/consumer/shell.tsx`                          | Klick                               |
| `panel_select`                                                                       | Engagement           | (noch kein Aufrufer)                                | —                                   |
| `search`                                                                             | Engagement           | `components/ui/SearchModal.tsx`                     | Eingabe zur Ruhe gekommen (900 ms)  |
| `outbound_click`                                                                     | Engagement           | `lib/useOutboundTracking.ts`                        | Klick auf allowlistete Domain       |
| `consumer_order_modal_open/close`, `chapter_toggle`, `scroll_depth`, `quote_request` | Engagement (Bestand) | unverändert                                         | —                                   |

### 14.2 Konversionen hängen an persistiertem Zustand, nicht am Klick

**Alle sechs feuern im `ok`-Zweig**, also nachdem der Server den Vorgang mit
202 angenommen hat. Ein Ereignis am Klick hätte einen Lead behauptet, den es
nie gab — das Formular kann serverseitig scheitern (Validierung, Rate Limit,
Idempotenz-Konflikt). Ein Test liest die Quelltexte und prüft die **Position
im Kontrollfluss**: der Aufruf muss hinter dem Tor stehen, nicht davor.

**Keine Konversion trägt eine Vorgangsnummer, Lead-ID oder ein Kontaktdatum.**
Drei tragen überhaupt keinen Parameter; `epigenetics_inquiry_submit` trägt nur
den allowlisteten Panel-Slug, `lead_magnet_submit` nur die Asset-Kennung. Eine
Vorgangsnummer wäre ein personenbeziehbarer Schlüssel in einer fremden
Auswertung.

### 14.3 `download_delivered` — warum ein Klick nicht genügt

Das Formular abzuschicken heißt, einen **Anspruch** bekommen zu haben; nicht,
die Datei erhalten zu haben. Ein Anspruch kann abgelaufen, aufgebraucht oder
widerrufen sein, und die geschützte Route antwortet dann mit 403/410. Ein
Ereignis am Klick hätte eine Zustellung behauptet, die nie stattfand.

Der Download läuft deshalb über **einen** `fetch`, und das Ereignis entsteht
erst nach `response.ok`.

**Warum genau ein Abruf:** jede Anfrage an die geschützte Route löst den
Anspruch ein und zählt gegen das Downloadbudget (`max_downloads`, AP19). Ein
Vorabtest hätte einen Versuch verbrannt. Ein Test hält fest, dass es genau
einen `fetch` gibt und keinen `HEAD`-Probelauf.

**Was bei einem Fehler passiert:** Rückfall auf die native Navigation, **kein**
Ereignis. Der Download bleibt in jedem Fall möglich — der Leser sieht die echte
Serverantwort —, aber es wird nie ein Erfolg gemeldet, der nicht beobachtet
wurde.

**Bewusst in Kauf genommen:** der Download läuft jetzt über einen Blob statt
über eine native Navigation. Für die ausgelieferten PDFs ist das unkritisch;
bei sehr großen Dateien wäre die native Streaming-Auslieferung besser. Der
Rückfallpfad deckt jeden Fehlerfall ab.

### 14.4 Keine Doppelzählung

| Quelle möglicher Doppelzählung        | Behandlung                                                      |
| ------------------------------------- | --------------------------------------------------------------- |
| Klick **und** Erfolg                  | nur Erfolg zählt; `cta_click` ist ausdrücklich keine Konversion |
| GTM-Auto-Event **und** App-Ereignis   | ein Ereignis, ein Transport (§13.3)                             |
| SPA-Wechsel **und** History-Listener  | genau ein Auslöser für `page_view` im ganzen Quellbaum (Test)   |
| Parameterwechsel ohne Pfadwechsel     | **behoben** — s. u.                                             |
| Consent-Grant **und** Initial-Load    | App überspringt den ersten Mount; der Container zählt ihn       |
| React-Effekt-Duplikat                 | `lastPath`-Schranke greift auch bei doppeltem Effektlauf        |
| Zwei Seitenaufruf-Ereignisse je Seite | **behoben** — `consumer_page_view` entfällt                     |

**Zwei echte Befunde, beide behoben:**

1. **Parameterwechsel erzeugte einen zweiten Seitenaufruf.** Der Effekt hängt
   an `pathname` **und** `search`; da die Fassade die Query seit PT23.2
   verwirft, ergab `/de/contact?intent=quote` → `/de/contact?panel=x` **zwei
   identische** `page_view` für denselben Pfad. Der zuletzt gemeldete Pfad wird
   jetzt festgehalten.
2. **`consumer_page_view` zählte denselben Wechsel doppelt.** Es feuerte beim
   Mount einer Consumer-Seite, während `page_view` den Routenwechsel bereits
   meldete. Die Dimension „welche Consumer-Seite" steckt im Pfad — ein zweites
   Ereignis dafür war eine Doppelzählung mit anderem Namen. Entfernt.

### 14.5 Engagement bleibt datenschutzfreundlich

- **Suche:** die eingegebene Zeichenkette geht **nicht** mit. Eine Suche auf
  einer Diagnostikseite kann ein Krankheitsbild, einen Medikamentennamen oder
  den Namen einer Praxis enthalten. Gemeldet werden Trefferzahl und
  **Längenklasse** (kurz/mittel/lang). Das Ereignis entsteht erst, wenn die
  Eingabe zur Ruhe gekommen ist — sonst ergäbe „vitamin" sieben Ereignisse und
  eine Trefferstatistik, die nur das Tippen abbildet.
- **Outbound:** nur die **Domain**, und nur aus einer Allowlist. Kein Pfad,
  keine Parameter, kein vollständiger Link — ein externer Link kann einen
  Termin, ein geteiltes Dokument oder eine Kennung tragen, die eine Person
  beschreibt. Ein Listener am Dokument statt eines Handlers je Link, weil die
  externen Links verstreut und teils aus übersetztem HTML erzeugt sind.
- **CTA:** Aufzählung von Orten, kein übersetzter Text (seit PT23.2).
- **Panel:** nur allowlistete Slugs.

### 14.6 x10 Routensemantik

Der Pfad behält sein Sprachpräfix (`/de/…`, `/pl/…`), damit die Auswertung
nach Sprache segmentieren kann; Query und Fragment fallen weg. Die Sprache
wird auf zwei Kleinbuchstaben normalisiert (`de-DE` → `de`). Ein Test prüft
das für alle zehn Locales.

### 14.7 Nachweise

- **53/53** task-eigene Tests (`trackingTaxonomy` 24, `tracking` 26,
  `trackingBypass` 3), `src/lib` gesamt **105/105**, Node-Suiten **411/411**,
  tsc/eslint/prettier clean, G4 i18n und `check:routes` PASS.
- **Fünf Mutationsproben greifen:** Konversion vor das Persistenz-Tor ziehen ·
  Pfad-Schranke entfernen · `download_delivered` an den Klick hängen · die rohe
  Suchanfrage mitschicken · die Outbound-Allowlist aufheben.
- **Zwei meiner Prüfungen waren zunächst falsch gebaut** und haben das
  Vokabularmodul als Aufrufstelle mitgezählt — eine Typdeklaration ist keine
  Emission. Definitions- und Adaptermodul sind jetzt ausgenommen; die
  Zählung misst wirklich Aufrufer.

### 14.8 Offen nach PT23.3

| ID       | Sachverhalt                                                                                                                                                                                                                                                                                                                                                                 | Owner            |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `CTC-10` | **Der Initial-Load wird nicht von der App gezählt.** Die App überspringt den ersten Mount in der Annahme, das GA4-Konfigurationstag im Container sende beim Laden ein `page_view`. Trifft die Annahme nicht zu, fehlt der erste Seitenaufruf jeder Sitzung; sendet der Container zusätzlich bei SPA-Wechseln, wird doppelt gezählt. **In diesem Repository nicht prüfbar.** | **PT23.4**       |
| `CTC-11` | `panel_select` ist definiert, hat aber keinen Aufrufer — die Panel-Auswahl meldet nichts.                                                                                                                                                                                                                                                                                   | PT23.5 / Content |
| `CTC-08` | GTM-Click-Trigger können `data-gtm-*` am Adapter vorbei lesen                                                                                                                                                                                                                                                                                                               | Marketing        |
| `CTC-09` | Audience-Karten ohne stabile Kennung; Ort auf `audience` vereinheitlicht                                                                                                                                                                                                                                                                                                    | Content          |
| `CTC-04` | `VITE_GTM_CONTAINER_ID` im Deployment ungesetzt ⇒ kein Container                                                                                                                                                                                                                                                                                                            | PT23.4           |
| `CTC-05` | Container, Tags und GA4-Property extern **nicht verifiziert**                                                                                                                                                                                                                                                                                                               | PT23.4           |
| `CTC-06` | CSP-Finalisierung                                                                                                                                                                                                                                                                                                                                                           | AP26 PT26.2      |
| `CTC-07` | serverseitige Analytics-Consent-Evidence — bewusst **nicht** gebaut: der Journey-Consent (AP22) ist Verarbeitungs-Consent und darf nicht mit Marketing-Consent vermischt werden                                                                                                                                                                                             | AP23-CLOSURE     |

### 14.9 PT23.4 — EXTERNAL CONFIG REQUIREMENTS

Was **außerhalb** dieses Repositories gesetzt und geprüft werden muss. Ohne
Zugriff darauf ist PT23.4 `BLOCKED_EXTERNAL_PROVIDER_CONFIG` — hier wird
nichts davon erfunden oder angenommen.

| #   | Anforderung                                                                                                           | Warum                                                 |
| --- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | `VITE_GTM_CONTAINER_ID` im Build-/Deployment-Environment setzen                                                       | ohne Kennung lädt kein Container (`CTC-04`)           |
| 2   | Eigentümerschaft des Containers klären; `GTM-TW6JFX7K` ist ein **historischer Hinweis**, keine bestätigte Kennung     | `CTC-05`                                              |
| 3   | **Feststellen, ob das GA4-Konfigurationstag beim Laden ein `page_view` sendet** — und das Ergebnis hier eintragen     | `CTC-10`; entscheidet über exactly-once               |
| 4   | Falls es sendet: sicherstellen, dass es **keine** zusätzlichen SPA-`page_view` erzeugt                                | sonst Doppelzählung                                   |
| 5   | GA4-Messkennung als `VITE_GA4_MEASUREMENT_ID` setzen, falls mehr als ein Ziel im Container hängt                      | deterministisches `send_to`                           |
| 6   | Conversion-Tags im Container auf die sechs dataLayer-Ereignisse aus §14.1 verdrahten                                  | die App sendet sie bereits typisiert                  |
| 7   | Prüfen, dass **kein** Tag im Container eigene PII/Freitextfelder ergänzt (z. B. Formularfeld-Variablen)               | die App liefert keine — der Container könnte welche   |
| 8   | Preview-/Debug-Modus des Containers so konfigurieren, dass Preview-Daten **nicht** in die Produktions-Property laufen | Preview darf Production Analytics nicht kontaminieren |

### 14.10 PT23.4 REPO WRITE SET

| Datei                                        | Warum                                               |
| -------------------------------------------- | --------------------------------------------------- |
| `src/lib/analyticsConfig.ts`                 | Kennungen, Validierung, `describeAnalyticsConfig`   |
| `src/components/analytics/GtmPageview.tsx`   | nur falls `CTC-10` eine Verhaltensänderung verlangt |
| `e2e/pt23.1.config.ts`                       | Container-Kennung für die Netzmessung               |
| `building-docs/CONSENT-TRACKING-CONTRACT.md` | Verifikationsergebnis eintragen                     |
| `building-docs/DEPLOYMENT-CONTRACT.md`       | `VITE_GTM_CONTAINER_ID` als Deployment-Anforderung  |

**PROVEN — DO NOT REDISCOVER:** Ladeverzicht und Netz-Evidenz (§9), Consent
State Map (§3), Provider-Loader (§4), Bypass-Freiheit (§13.1, durch Test
gehalten), ein Ereignis/ein Transport (§13.3), Typgrenze und Allowlists
(§13.4/§13.5), Ereignisregister und Konversions-Gating (§14.1/§14.2).

**Drift-Signale für PT23.4:** Änderungen an
`src/lib/{tracking,trackingProvider,analyticsConfig,googleConsent,consentState}.ts`
oder an `e2e/pt23.1.spec.ts`.

---

## 15. Delta PT23.4 — Providerverifikation (2026-09-09) · ~~BLOCKED~~ **aufgelöst**

> **Stand 2026-09-11: der Blocker ist aufgelöst — siehe §16.** Die Betreiberin
> hat einen eigenen Preview-Container eingerichtet und die Consent-Szenarien
> im Browser nachgewiesen. Der folgende Abschnitt beschreibt den Zustand VOR
> dieser Einrichtung und bleibt als Beleg stehen; er ist **nicht mehr der
> geltende Stand**.

**Ergebnis: `BLOCKED_EXTERNAL_PROVIDER_CONFIG`.** Der veröffentlichte Container
konnte gelesen und ausgewertet werden; die GA4-Property, ihre Datenstreams und
die Conversion-Markierungen liegen hinter einem Zugang, den dieses Repository
nicht hat. Es wird nichts davon angenommen oder erfunden.

### 15.1 Was tatsächlich verifiziert werden konnte

Gelesen wurde der **öffentlich ausgelieferte** Container — dieselbe Datei, die
jeder Browser bekommt. Kein Zugang, keine Anmeldung, keine Änderung.

| Prüfung                                          | Ergebnis                                                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Container existiert und ist publiziert           | **ja** — `gtm.js?id=GTM-TW6JFX7K` → HTTP 200, 351 847 Bytes                                 |
| Beleg des ausgewerteten Stands                   | SHA-256 `2cad50e4646ad21ecfacb1d9d0af4f34…`, `resource.version` 2                           |
| Eigentümerschaft                                 | **belegt durch Nutzung**: die Live-Domain `polarisdx.net` bindet genau diesen Container ein |
| Tags im Container                                | **genau einer**: `__googtag` (Google-Tag) auf `G-PLZNWGKW0P`                                |
| Trigger                                          | **genau einer**: `gtm.init` (Initialisierung)                                               |
| Konfigurationsüberschreibungen                   | **keine** (`vtp_configSettingsTable` fehlt) ⇒ GA4-Standard gilt                             |
| Custom-HTML-Tags                                 | **keine**                                                                                   |
| Auto-Event-Listener                              | **keine** (kein `__cl`, `__fsl`, `__hl`, `__sdl`, `__tl`, `__ytl`)                          |
| Werbe-Tags                                       | **keine** — weder `AW-` noch `DC-`                                                          |
| Conversion-Tags für die sechs Journey-Ereignisse | **keine**                                                                                   |

### 15.2 Was daraus folgt — drei belastbare Aussagen

**1. `CTC-10`, erste Hälfte: gelöst.** Der Container lädt das Google-Tag bei
`gtm.init` mit Standardeinstellungen, und der GA4-Standard ist
`send_page_view: true`. Der Initial-Load wird also vom Container gezählt — das
Überspringen des ersten Mounts in `GtmPageview` ist **korrekt**, es gibt keine
Doppelzählung beim Laden und keine Lücke.

**2. `CTC-10`, zweite Hälfte: weiterhin offen und exakt lokalisiert.** Ob GA4
bei SPA-Navigationen **zusätzlich** eigene `page_view` erzeugt, hängt an
_Enhanced Measurement → „Seitenaufrufe basierend auf Browserverlaufsereignissen"_.
Das ist eine **Einstellung des GA4-Datenstreams**, nicht des Containers, und
sie ist in `gtm.js` nicht sichtbar. Ist sie aktiv, zählt jede SPA-Navigation
doppelt (App + GA4). Das ist die einzige verbliebene Doppelzählungsgefahr, und
sie ist von hier aus nicht entscheidbar.

**3. Duplicate-Trigger-Audit: containerseitig sauber.** Ein Trigger, keine
Auto-Event-Listener, kein Custom HTML. Aus dem Container heraus kann kein
zweites Ereignis für denselben Vorgang entstehen. Auch `CTC-08` entschärft
sich: es gibt **keine** Click-Trigger, die `data-gtm-*` lesen — die Attribute
sind heute wirkungslos.

### 15.3 Der Live-Zustand, der dabei sichtbar wurde

`https://polarisdx.net/de/` liefert **die Seite vor dem Relaunch**. Sie

- setzt `gtag('consent','default', …)` mit allem auf `denied` (Position 1206),
- lädt danach **trotzdem** `gtm.js` (Position 2968),
- und trägt ein **`noscript`-iframe** auf `ns.html` (Position 18306).

Das ist **Advanced Consent Mode** und verletzt zwei harte AP23-Regeln
(„`denied` setzen und GTM trotzdem laden ist FAIL", „kein GTM-`noscript`-iframe
vor Consent"). **Es ist keine Regression dieser Arbeit**, sondern der Zustand,
den der Relaunch ablöst: der Preview-Build (`preview.polarisdx.net`) enthält
**null** GTM-Referenzen im HTML. Festgehalten, damit beim Go-live niemand die
Altseite für den geprüften Stand hält.

### 15.4 Was NICHT verifiziert werden konnte

Kein Dienstkonto, keine OAuth-Anmeldung, kein Zugriff auf
`tagmanager.googleapis.com` oder `analyticsadmin.googleapis.com`.

| Scope-Punkt                                      | Status                                                                                                                                                                        |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4 · Kern-Conversions konfigurieren               | **nicht möglich** — erfordert Schreibzugriff auf den Container                                                                                                                |
| 7 · GA4 Property/Stream/Measurement verifizieren | **nicht möglich** — Property-Einstellungen sind nicht öffentlich                                                                                                              |
| 8 · Realtime/DebugView                           | **nicht möglich** — erfordert Anmeldung; ein Testlauf gegen den echten Container hätte zudem die **Produktionsauswertung kontaminiert** und wurde deshalb bewusst unterlassen |
| 11 · Preview-Isolation **im Container**          | **nicht möglich** — Repo-Hälfte ist erledigt (§15.5)                                                                                                                          |

### 15.5 Repo-Hälfte — erledigt

| Was                    | Wo                           | Wirkung                                                                                                                                                     |
| ---------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Konfigurationsschema   | `.env.example` (neu)         | vier Schaltstellen benannt, keine echte Kennung in der Vorlage                                                                                              |
| **Preview-Isolation**  | `src/lib/analyticsConfig.ts` | in `VITE_APP_ENV=preview\|staging` wird der Produktionscontainer **unterdrückt**, auch wenn gesetzt; es gilt ausschließlich `VITE_GTM_CONTAINER_ID_PREVIEW` |
| Provider-CSP minimiert | `server.ts`                  | `stats.g.doubleclick.net` entfernt — der Container hat **keinen** Werbe-Tag                                                                                 |
| Verifikationsbericht   | `describeAnalyticsConfig()`  | meldet Umgebung, Unterdrückung und `externallyVerified: false`                                                                                              |

**Warum die Preview-Isolation nötig war:** der Container wird zur **Bauzeit**
eingebacken. Ein Preview-Build mit der Produktionskennung schickt Testklicks in
dieselbe GA4-Property wie echte Besucherinnen, und der Auswertung sieht
hinterher niemand an, welche Zeile aus einer Vorschau kam. Eine undeklarierte
Umgebung gilt weiterhin als Produktion — sonst ließe sich die Isolation durch
Weglassen umgehen.

**Warum DoubleClick raus konnte:** gemessen, nicht vermutet — im Container ist
kein einziger Werbe-Tag. Ehrlich dazu: GA4 kann DoubleClick auch ohne Werbe-Tag
kontaktieren, wenn in der Property „Google-Signale" aktiv ist **und**
`ad_storage` erteilt wurde. Diese Einstellung ist von hier aus nicht einsehbar.
Der Modus ist Report-Only — tritt der Fall ein, erscheint er als Report-Eintrag
statt als Blockade, und genau das ist das Signal für AP26 PT26.2.

### 15.6 OPERATOR-AKTION — exakt

Auszuführen von einer Person mit **Bearbeitungsrecht am GTM-Container
`GTM-TW6JFX7K`** und **Administrationsrecht an der GA4-Property zu
`G-PLZNWGKW0P`**. Ergebnisse hier eintragen, dann PT23.4 erneut ausführen.

| #   | Aktion                                                                                                                                                                                                                                                                                   | Nachweis                                            |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 1   | Bestätigen, dass `GTM-TW6JFX7K` und `G-PLZNWGKW0P` die **beabsichtigten** Ziele des Relaunches sind (oder neue benennen)                                                                                                                                                                 | Screenshot Container-/Property-Übersicht            |
| 2   | **GA4-Datenstream → Enhanced Measurement → „Seitenaufrufe basierend auf Browserverlaufsereignissen" AUSSCHALTEN**                                                                                                                                                                        | Screenshot der Einstellung — löst `CTC-10`          |
| 3   | Bestätigen, dass das Google-Tag `send_page_view` **nicht** deaktiviert hat (Standard beibehalten)                                                                                                                                                                                        | Tag-Konfiguration                                   |
| 4   | **Sechs Conversion-Tags** anlegen, je ein Custom-Event-Trigger auf `contact_submit`, `support_submit`, `consumer_order_submit`, `roi_report_request`, `epigenetics_inquiry_submit`, `lead_magnet_submit`                                                                                 | Tag-/Trigger-Liste                                  |
| 5   | Genau diese sechs in GA4 als **Schlüsselereignis** markieren — `download_delivered`, `cta_click`, `search`, `outbound_click` **nicht**                                                                                                                                                   | GA4 Ereignisliste                                   |
| 6   | Prüfen, dass **kein** Tag eigene Formularfeld-/PII-Variablen ergänzt                                                                                                                                                                                                                     | Variablenliste                                      |
| 7   | **Eigenen Preview-Container** anlegen und als `VITE_GTM_CONTAINER_ID_PREVIEW` setzen; Produktionskennung als `VITE_GTM_CONTAINER_ID` ins Produktions-Deployment (`CTC-04`)                                                                                                               | Deployment-Konfiguration                            |
| 8   | Consent-Szenarien in **DebugView** durchspielen: unentschieden · Analytics abgelehnt · Analytics erteilt · Marketing abgelehnt/erteilt · Analytics erteilt + Marketing abgelehnt · Widerruf · gespeicherte Zustimmung nach Reload · gespeicherte Ablehnung nach Reload · ohne JavaScript | DebugView-Aufzeichnung, **mit synthetischen Daten** |
| 9   | In DebugView je Ereignis prüfen: Name, Parameter, `page_path` mit Sprachpräfix **ohne** Query, **keine** PII, **genau ein** Ereignis je Vorgang                                                                                                                                          | dieselbe Aufzeichnung                               |
| 10  | Nach Umstellung: Live-Seite darf **kein** statisches `gtm.js` und **kein** `noscript`-iframe mehr ausliefern (§15.3)                                                                                                                                                                     | HTML der Live-Seite                                 |

### 15.7 Offen nach PT23.4

| ID       | Sachverhalt                                                                                                        | Owner               |
| -------- | ------------------------------------------------------------------------------------------------------------------ | ------------------- |
| `CTC-10` | **halb gelöst** — Initial-Load verifiziert korrekt; SPA-Doppelzählung hängt an Enhanced Measurement                | Operator (§15.6 #2) |
| `CTC-04` | `VITE_GTM_CONTAINER_ID` im Deployment ungesetzt                                                                    | Operator (#7)       |
| `CTC-05` | Container gelesen und belegt; **GA4-Property/Stream weiterhin unverifiziert**                                      | Operator (#1)       |
| `CTC-12` | **Keine Conversion-Tags im Container** — die sechs Ereignisse landen im dataLayer und werden von nichts konsumiert | Operator (#4/#5)    |
| `CTC-13` | Live-Seite läuft im Advanced Consent Mode mit `noscript`-iframe (Altstand vor Relaunch)                            | Go-live / AP31      |
| `CTC-08` | **entschärft** — es gibt keine Click-Trigger; `data-gtm-*` ist heute wirkungslos                                   | Marketing           |
| `CTC-06` | CSP-Finalisierung (Enforce, verbleibende Wildcards)                                                                | AP26 PT26.2         |
| `CTC-11` | `panel_select` ohne Aufrufer                                                                                       | PT23.5 / Content    |
| `CTC-09` | Audience-Karten ohne stabile Kennung                                                                               | Content             |
| `CTC-07` | serverseitige Analytics-Consent-Evidence                                                                           | AP23-CLOSURE        |

### 15.8 PT23.5 PRIMARY WRITE SET

PT23.5 (technische Metriken, strikt getrennt von Marketing-Analytics) ist
**nicht freigegeben**, solange PT23.4 blockiert ist. Der Write Set steht hier
nur, damit die Betreiberin den Umfang kennt:

| Datei                                        | Warum                                                                |
| -------------------------------------------- | -------------------------------------------------------------------- |
| `src/lib/monitoring/report.ts`               | vorhandener technischer Meldeweg — trennen, nicht zusammenlegen      |
| `src/lib/tracking.ts`                        | Grenze: technische Metriken gehören **nicht** ins Marketingvokabular |
| `building-docs/CONSENT-TRACKING-CONTRACT.md` | Trennung festhalten                                                  |

**PROVEN — DO NOT REDISCOVER:** Ladeverzicht und Netz-Evidenz (§9), Consent
State Map (§3), Provider-Loader (§4), Bypass-Freiheit (§13.1), ein Ereignis/ein
Transport (§13.3), Typgrenze und Allowlists (§13.4/§13.5), Ereignisregister und
Konversions-Gating (§14.1/§14.2), Containerinhalt (§15.1).

---

## 16. Delta PT23.4 (Fortsetzung) — Preview-Provider eingerichtet (2026-09-11)

### 16.1 Was die Betreiberin geliefert hat — und was davon unabhängig nachgeprüft wurde

Die Betreiberin hat einen **eigenen Preview-Container** eingerichtet und die
Consent-Szenarien im Browser durchgespielt. Alles, was sich von hier aus
nachprüfen ließ, ist nachgeprüft worden; der Rest ist als Operator-Evidenz
gekennzeichnet und **nicht** als eigene Messung ausgegeben.

| Aussage                                             | Quelle   | Unabhängig nachgeprüft                                                       |
| --------------------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| Preview-Container `GTM-PL26PFFH` ist veröffentlicht | Operator | **ja** — `gtm.js?id=GTM-PL26PFFH` → HTTP 200, 364 331 B, SHA-256 `9d46f56a…` |
| Preview-GA4 `G-Z1SBW4CJFP`                          | Operator | **ja** — einziges GA4-Ziel im Container                                      |
| Fünf Conversion-Tags + Google-Tag                   | Operator | **ja** — 6 Tags: 1 × `__googtag`, 5 × `__gaawe`                              |
| Passende Custom-Event-Trigger                       | Operator | **ja** — 6 Prädikate: `gtm.init` + exakt die fünf Ereignisnamen              |
| Produktions-GTM nicht im Preview-Bundle             | Operator | **ja** — `GTM-TW6JFX7K`: **0 Treffer** in allen vier ausgelieferten Bundles  |
| Preview-Deployment baut mit `VITE_APP_ENV=preview`  | Operator | **ja** — steht als Build-Argument in `docker-compose.yml`                    |
| Pre-Consent: 0 Requests an GTM/GA4                  | Operator | **ja, unabhängig** — `e2e/pt23.1.spec.ts` misst das im Browser (11/11)       |
| Nach Consent lädt `gtm.js?id=GTM-PL26PFFH`          | Operator | nein — Browser-Beobachtung der Betreiberin                                   |
| `collect` mit `tid=G-Z1SBW4CJFP`                    | Operator | nein — ebenso                                                                |
| `page_view` nach Consent beobachtet                 | Operator | nein — ebenso                                                                |
| `contact_submit` **genau einmal** nach Absenden     | Operator | nein — ebenso                                                                |

**Container-Inventar (gemessen):** 6 Tags, 6 Trigger, 6 Makros · **keine**
Werbe-Tags (`AW-`/`DC-`) · **keine** Auto-Event-Listener · **kein** Custom
HTML. Der Duplicate-Trigger-Audit bleibt damit containerseitig sauber: jeder
Trigger ist ein Custom Event auf genau einen Ereignisnamen.

**Preview-Isolation am Artefakt gemessen** — nicht am Vorsatz. In den vier
ausgelieferten Bundles von `preview.polarisdx.net`:
`GTM-TW6JFX7K` **0×** · `G-PLZNWGKW0P` **0×** · `GTM-PL26PFFH` **1×**. Das
ausgelieferte HTML enthält **null** GTM-Referenzen — der Basic-Mode-Ladeverzicht
gilt also auch im deployten Preview.

### 16.2 Scope-Änderung: Verkauf liegt bei Shopify

**`consumer_order_submit` ist keine geforderte Website-Konversion mehr.** Der
Produktverkauf läuft über Shopify. Die Website baut dafür **keinen eigenen
Bestell-Konversionsweg** und spiegelt Shopifys Ecommerce-Ereignisse
(`view_item`, `add_to_cart`, `begin_checkout`, `purchase`) **nicht**.

Was das konkret heißt — und was ausdrücklich **nicht**:

- Die Website-Konversionen sind jetzt **fünf**: `contact_submit`,
  `support_submit`, `roi_report_request`, `epigenetics_inquiry_submit`,
  `lead_magnet_submit`. Genau diese fünf sind im Container verdrahtet.
- **Das Ereignis `consumer_order_submit` bleibt bestehen** und feuert
  unverändert nach bestätigter Persistenz. Es misst die Bestell-**Anfrage**
  der AP22-Journey `consumer_order` — einen **Lead**, keinen Kauf. Es zählt
  nur nicht mehr als Konversion und verlangt keinen Conversion-Tag.
- **Die Journey selbst bleibt unangetastet.** `consumer_order` ist eine der
  sieben launchrelevanten Journeys aus AP22 (Persistenz, Outbox, CRM). Der
  Shopify-Beschluss betrifft die **Messung**, nicht die Lead-Strecke. Sie hier
  abzuräumen wäre ein Eingriff in ein abgeschlossenes Arbeitspaket.
- Ein Test hält fest, dass die vier Shopify-Ereignisnamen im Vokabular der
  Website **nicht** vorkommen.

**Offen (`CTC-14`):** ein `outbound_click` auf den Shop ist erlaubt, aber es
gibt im Repository **keine Shopify-Domain** — weder im Quelltext noch in den
Übersetzungen. Sie wird deshalb **nicht erfunden**; sobald sie feststeht, kommt
sie in `OUTBOUND_DOMAINS` und der Klick wird gemessen.

### 16.3 Was weiterhin nicht verifiziert ist

| Punkt                                                                                                                                          | Status                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vier Konversionen manuell im Preview ausgelöst**: `support_submit`, `roi_report_request`, `epigenetics_inquiry_submit`, `lead_magnet_submit` | **ausstehend** — die Tags und Trigger existieren nachweislich, aber die Betreiberin hat sie noch nicht durchgespielt. Hier wird dafür **keine Evidenz erfunden**. |
| GA4-Property-Einstellungen der **Produktion** (`G-PLZNWGKW0P`)                                                                                 | unverifiziert — kein Zugang                                                                                                                                       |
| Enhanced Measurement „Browserverlaufsereignisse" (**Produktion**)                                                                              | unverifiziert (`CTC-10`)                                                                                                                                          |
| Produktions-Deployment mit `VITE_GTM_CONTAINER_ID`                                                                                             | nicht gesetzt (`CTC-04`)                                                                                                                                          |
| Live-Seite läuft noch im Advanced Consent Mode (Altstand)                                                                                      | unverändert (`CTC-13`)                                                                                                                                            |

**Zu `CTC-10` in der Vorschau:** der Preview-Container trägt dieselbe
Tag-Struktur wie die Produktion (Google-Tag ohne Konfigurationsüberschreibung,
Trigger `gtm.init`). Für die Vorschau gilt damit dieselbe Schlussfolgerung wie
in §15.2: der Initial-Load wird vom Container gezählt, das Überspringen des
ersten Mounts ist korrekt. Ob Enhanced Measurement im **Preview-Datenstream**
zusätzlich SPA-`page_view` erzeugt, ist von hier aus weiterhin nicht einsehbar
— die Betreiberin hat `page_view` nach Consent beobachtet, aber nicht
berichtet, ob es bei SPA-Navigationen doppelt auftritt. Für die Produktion
bleibt der Punkt unverändert offen.

### 16.4 Bewertung

Die Akzeptanzkriterien aus der Aufgabenstellung, Punkt für Punkt:

| Kriterium                    | Ergebnis                                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| real container verified      | **PASS** — Preview-Container gelesen und inventarisiert                                                                               |
| real GA4 stream verified     | **PASS für Preview** (`G-Z1SBW4CJFP` als einziges Ziel im Container, `collect`-Beobachtung der Betreiberin); **offen für Produktion** |
| mappings correct             | **PASS** — fünf Trigger, exakt die fünf Ereignisnamen der Fassade                                                                     |
| core conversions correct     | **PASS** — fünf Tags; `consumer_order_submit` entfällt per Scope-Änderung                                                             |
| consent scenarios correct    | **TEILWEISE** — Pre-Consent unabhängig gemessen (11/11), Grant/Widerruf/Reload ebenso; die vier Konversionen manuell ausstehend       |
| no duplicates                | **PASS** — containerseitig ein Trigger je Ereignis, keine Auto-Listener; `contact_submit` genau einmal beobachtet                     |
| Realtime/DebugView synthetic | **TEILWEISE** — `page_view` und `contact_submit` beobachtet; vier Konversionen ausstehend                                             |
| provider CSP minimal         | **PASS** — `stats.g.doubleclick.net` entfernt; auch der Preview-Container trägt keinen Werbe-Tag                                      |

### 16.5 Offen nach PT23.4

| ID       | Sachverhalt                                                                                                                                           | Owner             |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `CTC-15` | **Vier Konversionen im Preview nicht manuell ausgelöst** (`support_submit`, `roi_report_request`, `epigenetics_inquiry_submit`, `lead_magnet_submit`) | Operator          |
| `CTC-14` | Shopify-Domain unbekannt ⇒ kein `outbound_click` auf den Shop                                                                                         | Content/Marketing |
| `CTC-10` | Enhanced Measurement der **Produktions**-Property unverifiziert                                                                                       | Operator          |
| `CTC-04` | Produktions-Deployment ohne `VITE_GTM_CONTAINER_ID`                                                                                                   | Operator          |
| `CTC-05` | Produktions-GA4-Property/Stream unverifiziert                                                                                                         | Operator          |
| `CTC-13` | Live-Seite im Advanced Consent Mode (Altstand vor Relaunch)                                                                                           | Go-live / AP31    |
| `CTC-12` | **geschlossen für Preview** — fünf Conversion-Tags existieren; Produktion folgt mit `CTC-04`                                                          | —                 |
| `CTC-06` | CSP-Finalisierung                                                                                                                                     | AP26 PT26.2       |
| `CTC-11` | `panel_select` ohne Aufrufer                                                                                                                          | PT23.5 / Content  |
| `CTC-09` | Audience-Karten ohne stabile Kennung                                                                                                                  | Content           |
| `CTC-07` | serverseitige Analytics-Consent-Evidence                                                                                                              | AP23-CLOSURE      |

### 16.6 Restliche Operator-Aktion

Die Liste aus §15.6 ist bis auf drei Punkte erledigt. Offen bleiben:

1. **Die vier Konversionen im Preview auslösen** und in DebugView prüfen:
   Ereignisname, Parameter, `page_path` mit Sprachpräfix **ohne** Query, keine
   PII, **genau ein** Ereignis je Vorgang. Formulare: Support, ROI-Rechner,
   Epigenetik-Anfrage, Lead-Magnet-Gate.
2. **Produktion einrichten:** `VITE_GTM_CONTAINER_ID` setzen, Conversion-Tags
   im Produktionscontainer anlegen, die fünf Ereignisse als Schlüsselereignis
   markieren, Enhanced Measurement „Browserverlaufsereignisse" ausschalten.
3. **Beim Go-live:** die Live-Seite darf kein statisches `gtm.js` und kein
   `noscript`-iframe mehr ausliefern (`CTC-13`).

---

## 17. Delta PT23.5 — technische Metriken getrennt von Marketing (2026-09-11)

### 17.1 Der Ausgangszustand: Trennung vorhanden, aber ungeschrieben

`src/lib/monitoring/` gibt es seit AP01 PT01.3: eine provider-neutrale Senke
für Renderfehler und Web Vitals, standardmäßig `null`, ohne registrierten
Transport. Web Vitals werden nativ über `PerformanceObserver` erhoben, ohne
zusätzliche Abhängigkeit.

Gemessen, nicht vermutet: `monitoring/report.ts` und `monitoring/web-vitals.ts`
enthalten **null** Marketing-Begriffe (`dataLayer`, `gtag`, Container-Kennungen,
Ereignisnamen der Taxonomie), und `tracking.ts` enthält **null** technische
Metriknamen. Es gibt **keine** gegenseitige Abhängigkeit.

Die Trennung war also da — sie stand nur nirgends geschrieben, und damit hielt
sie genau bis zum nächsten schnellen Einbau. **Es hätte ein einziges
`setMonitoringSink(…)` genügt**, das die Web Vitals in den dataLayer schiebt:
aus technischer Selbstbeobachtung wäre Marketing-Telemetrie geworden, vorbei an
der Einwilligung, die für Marketing gilt. PT23.5 schreibt die Trennung fest und
misst sie.

### 17.2 Was die Trennung jetzt hält

| Schranke                      | Wie sie gemessen wird                                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kein Marketingprovider        | `monitoring/*` nennt weder `dataLayer` noch `gtag` noch eine Container-Kennung                                                                       |
| Kein gemeinsames Vokabular    | keiner der 17 Taxonomie-Namen kommt in `monitoring/*` vor — und umgekehrt                                                                            |
| Keine Abhängigkeit            | `monitoring/*` importiert nicht aus `tracking`/`trackingProvider`/`googleConsent`                                                                    |
| Typseitig nicht verwechselbar | `MonitoringSink` nimmt `MonitoringEreignis`, nicht `TrackingEreignis` — ein versehentlich registrierter Marketing-Provider fällt beim Übersetzen auf |
| Kein Pfad mit Query           | `window.location.pathname`, nie `href`, nie `search`                                                                                                 |
| Keine Personendaten           | keine Props, kein State, keine `userId`/`leadId`/`email`/`sessionId`                                                                                 |
| **Nichts läuft**              | im produktiven Baum ist **keine** Senke registriert und **kein** Sammler gestartet                                                                   |

Nachweis: `src/lib/monitoring/separation.test.ts` (12/12). Drei
Mutationsproben greifen: vollen `href` statt Pfad melden · das Monitoring in
den `dataLayer` umleiten · den Sammler produktiv starten.

### 17.3 Rechts- und Betriebsgrundlage (AP23 §28)

Hier wird **keine Rechtsgrundlage erfunden**. Dokumentiert wird der Zustand:

| Frage                        | Antwort                                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zweck**                    | Fehlersuche und Ladeleistung der eigenen Seite — keine Personenanalyse                                                                                    |
| **Daten**                    | Fehlermeldung, Fehlername, Boundary-Kennung, Komponenten-Stack; Web Vitals (LCP/CLS/INP/TTFB/FCP) mit Wert und Bewertung; Pfad **ohne** Query             |
| **Empfänger/Provider**       | **keiner.** Es ist kein Transport registriert; die Daten verlassen den Browser nicht                                                                      |
| **Retention**                | entfällt, solange nichts übertragen wird                                                                                                                  |
| **Technische Notwendigkeit** | für die reine Erhebung im Browser gegeben; für eine ÜBERTRAGUNG nicht entschieden                                                                         |
| **Entscheidungs-Owner**      | **AP25** (Performance/CWV) gemeinsam mit **AP26/AP28** (Betrieb) für den Transport; die Consent-Frage beantwortet AP23 erst, wenn ein Empfänger feststeht |

**Solange kein externer Empfänger registriert ist, gibt es keine
Übertragung, keinen Drittanbieter und damit keine offene Consent-Frage.** Der
Auslieferungszustand ist der datensparsamste mögliche.

> **`BLOCKED_POLICY_DECISION` — greift bei Aktivierung, nicht heute.** Wer
> einen **externen** Technical-Metrics-Provider einschalten will (RUM-Dienst,
> Sentry, eigener Endpunkt mit Drittanbieter dahinter), braucht vorher: Zweck,
> Datenkatalog, Empfänger, Auftragsverarbeitung, Speicherdauer, Eintrag in der
> Datenschutzerklärung und eine Consent-Entscheidung. Bis dahin darf
> `setMonitoringSink` nicht auf einen externen Transport zeigen. Ein
> **eigener** Endpunkt ohne Drittanbieter ist eine andere, leichtere Frage —
> aber auch die entscheidet nicht dieser Task.

### 17.4 Warum Performance-Telemetrie den Marketing-Consent nicht umgehen darf

Technische Metriken sind kein Schlupfloch. Würde man Web Vitals an einen
Marketing-Provider schicken — und sei es nur als „technisches" Ereignis im
dataLayer —, entstünde bei jedem Seitenaufruf ein Providerkontakt, den die
Nutzerin für Analytics gerade abgelehnt hat. Genau deshalb ist die Trennung
oben nicht kosmetisch: **die Senke darf nie auf den Marketingweg zeigen**, und
ein Versuch fällt seit PT23.5 im Test auf.

Umgekehrt gilt: solange die Erhebung den Browser nicht verlässt, ist sie keine
Datenübertragung an Dritte und hängt an keiner Einwilligung.

### 17.5 AP25-Handoff

| Thema               | Stand                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sammler             | vorhanden, nativ, ohne Abhängigkeit; **nicht gestartet** (`initWebVitals`)                                                                        |
| Metriken            | LCP, CLS, INP (Proxy über Event-Timing), TTFB, FCP — Schwellen nach web.dev                                                                       |
| INP                 | dokumentierter **Proxy** (größte beobachtete Interaktionslatenz), nicht die Perzentil-Rechnung der `web-vitals`-Bibliothek                        |
| Senke               | provider-neutral, Standard `null`                                                                                                                 |
| Offene Entscheidung | Transport **und** Rechtsgrundlage (§17.3) — der Gate dafür steht in `monitoring/policy.ts`                                                        |
| Aktivierungspfad    | `VITE_TELEMETRY_SCOPE`=`FIRST_PARTY`/`THIRD_PARTY`; bei `THIRD_PARTY` zusätzlich die vier Belegvariablen; Vorschau braucht einen eigenen Endpunkt |
| Zielwerte/Budgets   | **nicht** hier festgelegt — AP25 entscheidet, ab wann ein Wert „zu langsam" heißt                                                                 |
| Grenze zu AP23      | AP23 besitzt die Trennung und die Consent-Frage; **AP25 besitzt Messung und Zielwerte**                                                           |

### 17.6 Nachtrag (2026-09-11): die Entscheidung steht jetzt als Code

Der erste Durchgang von PT23.5 hat die Trennung gemessen und die
Rechts-/Betriebsentscheidung in §17.3 **beschrieben**. Beschrieben ist aber
nicht geprüft: eine Regel, die nur in einem Dokument steht, hält genau bis zu
dem Tag, an dem jemand unter Zeitdruck einen RUM-Dienst einhängt — und dann ist
die Entscheidung nicht getroffen, sondern übersprungen worden. Drei weitere
Lücken kamen dazu: der Sammler selbst war ungetestet, die Bewertungsschwellen
ebenso, und für technische Metriken gab es **keine** Umgebungsisolation.

**`src/lib/monitoring/policy.ts`** beantwortet jetzt genau eine Frage — _darf
hier ein Transport registriert werden, und wenn nein, warum nicht._ Es sendet
nichts und kennt keinen Anbieter.

| Reichweite    | Bedeutung                                              | Zusätzliche Bedingung                           |
| ------------- | ------------------------------------------------------ | ----------------------------------------------- |
| `NONE`        | nichts verlässt den Browser — **Auslieferungszustand** | —                                               |
| `FIRST_PARTY` | eigener Endpunkt derselben Herkunft                    | kein Dritter ⇒ keine Auftragsverarbeitung nötig |
| `THIRD_PARTY` | externer Dienst (RUM, Fehlerdienst)                    | **vier Belege** (s. u.), sonst blockiert        |

Vier Belege für einen externen Dienst: `purposeDocumented`,
`processorAgreed`, `retentionDefined`, `privacyNoticeUpdated`. Fehlt einer,
lautet die Antwort `BLOCKED_POLICY_DECISION` — **und sie benennt genau den
fehlenden**, nicht pauschal alle.

**Preview-Isolation, jetzt auch für Metriken** (`BLOCKED_PREVIEW_ISOLATION`):
dieselbe Regel wie bei den Marketingkennungen in PT23.4. Eine Vorschau braucht
einen eigenen Endpunkt; ohne ihn wird kein Transport freigegeben, denn Messwerte
aus einer Vorschau sind in derselben Auswertung hinterher nicht mehr von echten
Besuchen zu unterscheiden. Eine **undeklarierte** Umgebung gilt als Produktion,
damit die Isolation nicht durch Weglassen umgangen werden kann.

**Wichtig: das blockiert keinen sicheren Codepfad.** Ohne Transport läuft die
Erhebung im Browser weiter und meldet an eine Senke, die es nicht gibt. Der
Gate entscheidet ausschließlich über die **Aktivierung** einer Übertragung.

**Der Sammler ist jetzt nachgemessen** (`webVitals.test.ts`, 18 Tests):
TTFB aus der Navigation-Timing-Entry; LCP als **letzter** beobachteter Wert;
CLS als Summe **ohne** `hadRecentInput` (nutzerausgelöste Verschiebungen sind
kein Layout-Fehler); INP als größte Interaktionslatenz; alle drei erst beim
Verstecken der Seite. Jede Meldung trägt genau fünf Felder: `type`, `name`,
`value`, `rating`, `pathname`. Die Schwellen von web.dev stehen exportiert und
unter Test — inklusive der Grenzfälle, denn „good ≤ Schwelle" ist eine
Entscheidung, die sonst lautlos kippt.

Vier Mutationsproben greifen: Policy-Gate entfernen · Preview-Isolation
aufheben · Schwellengrenze von `<=` auf `<` verschieben · CLS auch
nutzerausgelöste Verschiebungen zählen lassen.

### 17.7 Offen nach PT23.5

| ID       | Sachverhalt                                                               | Owner       |
| -------- | ------------------------------------------------------------------------- | ----------- |
| `CTC-16` | Kein Transport für technische Metriken entschieden; Erhebung läuft nicht  | AP25 / AP26 |
| `CTC-11` | `panel_select` ohne Aufrufer — **kein** Performance-Thema, bleibt Content | Content     |

`CTC-11` wurde hier geprüft und bleibt offen: `panel_select` ist ein
Marketing-Engagement-Ereignis ohne Auslöser. Es gehört nicht in PT23.5 und
wird nicht künstlich verdrahtet, nur damit die Liste voll aussieht.

---

## 18. AP23-CLOSURE — unabhängige Nachmessung (2026-09-11)

Kein PT-PASS wurde übernommen. Gemessen wurde gegen einen frisch gebauten
Produktionsbuild und ein echtes Backend, mit einem **synthetischen** Container
(`GTM-AP23CLOS`) — ein Lauf gegen den Produktions- oder den echten
Preview-Container hätte dessen Auswertung verschmutzt, und genau das verbietet
AP23.

### 18.1 Ergebnis (`e2e/ap23-closure.spec.ts`, 12/12)

| Prüfung                                                           | Ergebnis                                                  |
| ----------------------------------------------------------------- | --------------------------------------------------------- |
| Pre-Consent-Provider-Requests, 8 Seiten × 3 Sprachen              | **0**                                                     |
| SSR-HTML: Loader, `noscript`-iframe, Chat-Domain                  | **0 / 0 / 0**                                             |
| Provider-Requests **ohne JavaScript**                             | **0**                                                     |
| Puffer vor Consent (`dataLayer`, `gtag`, Storage-Schlüssel)       | **nicht vorhanden**                                       |
| Nach Ablehnung, inkl. Reload                                      | **0**                                                     |
| Nach Zustimmung: Container                                        | genau der konfigurierte, nach Reload **genau ein** Script |
| Widerruf: erreichbar, Zustand zurückgesetzt, danach               | **0**                                                     |
| **SPA-Navigation → `page_view`**                                  | **genau 1**                                               |
| **Reiner Parameterwechsel auf demselben Pfad**                    | **kein zweiter** `page_view`                              |
| **`contact_submit` nach 202**                                     | **genau 1**                                               |
| PII in der dataLayer-Nutzlast (E-Mail, Firma, Freitext)           | **0**                                                     |
| Geschäftsvorgang nach „Nur notwendige"                            | **202**                                                   |
| Einwilligungsdialog in **allen zehn** Sprachen, benannt, 3 Knöpfe | **PASS**                                                  |
| Tastaturbedienung, `aria-expanded`/`aria-controls`                | **PASS**                                                  |

Damit ist die letzte offene Doppelzählungsfrage aus PT23.3 **im Browser**
beantwortet: eine SPA-Navigation erzeugt genau einen Seitenaufruf, ein reiner
Parameterwechsel keinen zweiten.

### 18.2 Quellseitig neu gemessen

- `index.html` und `server.ts`: **0** GTM-Referenzen, **0** `noscript`.
- Bypass-Sweep über den gesamten `src`-Baum ohne Kommentare: **0** Umgehungen
  außerhalb von `trackingProvider.ts` und `googleConsent.ts`.
- Konversionen: Ereignis steht in jedem Fall **hinter** dem Persistenz-Tor
  (Zeilenposition geprüft).
- Ereignisvokabular: kein einziger Feldname mit Personenbezug — nur
  `pfad`, `sprache`, `titel`, `ort`, `seite`, `produkt`, `menge`, `panel`,
  `asset`, `treffer`, `laenge`, `domain`, `block`, `offen`, `stufe`, `weg`,
  `panels`, `quelle`.
- Guards: `check:i18n`, `check:shell-i18n`, `check:routes`,
  `check:search-index`, `check:seo` — **5/5 PASS**.
- Unit: `src/lib` + `src/content` + `src/routing` **183/183**;
  Node-Suiten **411/411**; tsc/eslint/prettier clean.

### 18.3 Was die Closure ausdrücklich NICHT bewiesen hat

- **Die vier manuellen Konversionsprüfungen im Preview** (`support_submit`,
  `roi_report_request`, `epigenetics_inquiry_submit`, `lead_magnet_submit`)
  sind **nicht** durchgeführt. Tags und Trigger existieren nachweislich, und
  `contact_submit` hat den Weg dataLayer → Trigger → Tag → GA4 belegt; die vier
  übrigen sind Wiederholungen desselben Mechanismus, aber **nicht beobachtet**.
  Es wird dafür keine Evidenz erfunden (`CTC-15`).
- **Die Produktions-Property** (`G-PLZNWGKW0P`): Enhanced Measurement,
  Conversion-Markierungen, Datenstream — unverändert unverifiziert
  (`CTC-05`, `CTC-10`).
- **Das Produktions-Deployment** setzt `VITE_GTM_CONTAINER_ID` nicht; dort lädt
  kein Container (`CTC-04`).
- **Die Live-Seite** läuft weiterhin im Advanced Consent Mode mit
  `noscript`-iframe — Altstand vor dem Relaunch (`CTC-13`).
- **Vorbestehender Testinfrastruktur-Blocker**, PT-fremd: die
  React-Render-Tests (`ErrorBoundary.test.tsx`, unverändert seit HEAD) scheitern
  an `React.act is not a function` (React 19 + Testing Library). Kompensiert
  durch die Browser-Messung, nicht übergangen. Owner AP27.

### 18.4 Bewertung

Die Master-Scope-DoD lautet: _„Vor Consent entstehen keine GTM-/GA4-Marketing-/
Analytics-Requests; nach Consent funktionieren Pageviews und Conversions
kontrolliert und testbar."_

Beide Hälften sind gemessen: vor Consent **0** Requests über acht Seiten, drei
Sprachen, mit und ohne JavaScript; nach Consent genau ein Container, genau ein
Seitenaufruf je Navigation, genau eine Konversion nach der Serverannahme, ohne
PII. **Die DoD ist erfüllt.**

Offen bleiben ausschließlich Punkte, die **außerhalb dieses Repositories**
liegen (Produktions-Property, Produktions-Deployment, Go-live-Umstellung) sowie
die vier manuellen Preview-Prüfungen. Keiner davon macht eine Aussage dieser
Arbeit unwahr; alle sind benannt, mit Owner.
