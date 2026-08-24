# CONSENT-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Kerndateien ändert, folgt zwingend der
Kontextpflicht in §7. Blindes Editieren ist untersagt.

> ## ⚠ Current-State-Warnung
>
> **Die aktuelle Baseline ist NON_COMPLIANT gegenüber `REST-02`.**
> Der Laufzeitbeweis in `CONSENT-TRACKING-NETWORK-BASELINE.md` §15 hat Anfragen **vor jeder
> Einwilligung** an `https://www.googletagmanager.com` und `https://widget.hihuman.co.uk` nachgewiesen —
> und zwar identisch im Zustand „keine Entscheidung" **und** „ausdrücklich abgelehnt".
>
> **Dieser Vertrag beschreibt SOLL-Verhalten.** Er darf niemals als Beleg gelesen werden, dass das
> Repository bereits konform ist.

---

## 1. Purpose

Dieser Vertrag legt fest, wann ein Drittanbieter überhaupt geladen werden darf, wie der Einwilligungs-
zustand entsteht, gespeichert und widerrufen wird — und welche Zusagen dabei niemals gebrochen werden
dürfen.

Er ist **kein Audit**. Die Messungen stehen in `CONSENT-TRACKING-NETWORK-BASELINE.md`.

**Er ist die oberste Schicht der Kette** `Consent → Tracking → Netzwerk` (§6 des Auftrags, hier §4 C-20).

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zielautorität:**

- **`DEC-RL-004`** — _„GTM/GA4 bleiben, aber ausschließlich nach wirksamem Consent; kein Tracking und kein Event-Puffern vor Consent."_
- **`REST-02`** — _„Consent-Modell: **Basic Consent Mode v2 / vollständiger Ladeverzicht**. GTM/GA4 und andere nicht notwendige Marketing-/Analytics-Tags laden erst nach Einwilligung."_
- **AP23** (Eigentümer), insbesondere PT23.1.

**Mitbetroffene APs:** AP06 PT06.4 (CookieBanner, Chat-Entfernung), AP11 PT11.5.7, AP15 PT15.5.4/PT15.6.10,
AP19 PT19.3.10, AP20 PT20.4.5–.7 (Datenschutzerklärung), AP21 PT21.1.4/PT21.5.9 (Consumer),
AP22 PT22.1.7–.8 (Formular- vs. Marketing-Consent), AP25 (Web Vitals getrennt), AP26 PT26.2 (CSP),
AP27 PT27.4 (Consent-E2E), AP30 PT30.4.5, AP33 PT33.1.8.

**Launch-Gate 2** hängt vollständig an diesem Vertrag; **Gate 5** (kein Chat) grenzt daran an.

**Baseline:** `feat/home-leadmagnet@961f65d`. Keine Decision-Lock-Änderung durch diesen Vertrag.

---

## 3. Current Participating Files

| Datei                                      | Rolle heute                                                                                                                                                                                    | Guard  |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `index.html`                               | Consent-Mode-v2-Defaults (`:19-35`), `localStorage`-Wiederherstellung (`:37-67`), **unbedingter GTM-Loader (`:71-81`)**, **unbedingter `noscript`-iframe (`:188-201`)**, zugleich SSR-Template | **G3** |
| `src/components/ui/CookieBanner.tsx`       | Kategoriemodell, Persistenz, `updateGTMConsent` (`:36-88`), einziger Schreiber des Consent-Zustands                                                                                            | **G3** |
| `src/lib/tracking.ts`                      | providerneutrale Fassade mit `setTrackingProvider`/`setTrackingConsent` — **nie registriert**                                                                                                  | **G3** |
| `src/App.tsx`                              | hängt `CookieBanner`, `GtmPageview` und `ChatWidget` ein; Consumer-Routen liegen **außerhalb** von `MainLayout`                                                                                | **G3** |
| `src/components/analytics/GtmPageview.tsx` | direkter `gtag('event','page_view')` (`:84`) + `dataLayer`-Push (`:88-89`), **ohne Consent-Prüfung**                                                                                           | G2     |
| `src/pages/consumer/tracking.ts`           | direkter `dataLayer`-Push (`:35-36`), **ohne Consent-Prüfung**                                                                                                                                 | G2     |
| `src/pages/consumer/OrderForm.tsx`         | inline `dataLayer`-Push (`:164-168`)                                                                                                                                                           | G2     |
| `src/pages/consumer/OrderModal.tsx`        | inline `dataLayer`-Push (`:84-85`)                                                                                                                                                             | G2     |
| `src/components/ui/ChatWidget.tsx`         | **unbedingte Injektion** eines Drittanbieter-Skripts                                                                                                                                           | **G3** |
| `server.ts`                                | CSP (`:432-444`, Report-Only) mit Chat- und Google-Domains                                                                                                                                     | **G3** |
| `src/lib/useScrollDepth.ts`                | Scrolltiefe über die Fassade (heute wirkungslos)                                                                                                                                               | G1     |

---

## 4. Target Invariants

### Ladeverzicht

**C-01 · Kein nicht-essenzieller Drittanbieter darf vor der zugehörigen Einwilligung eine Netzanfrage
auslösen.** Das gilt für Analytics, Marketing, Chat und jeden vergleichbaren Anbieter — unabhängig von
Signalzuständen. _(`REST-02`, `DEC-RL-004`, AP23 PT23.1.4)_

**C-02 · „Consent-Mode-Defaults auf `denied`" ist ausdrücklich NICHT ausreichend.** Zwei Zustände sind
zu unterscheiden: _„die Signale stehen auf denied"_ (heute erfüllt) und _„das Provider-Skript ist nicht
geladen"_ (die Anforderung). **Nur der zweite erfüllt `REST-02`.** _(AP23 PT23.1.1)_

**C-03 · GTM wird nicht initial geladen.** Kein Loader-Snippet im Dokument-Bootstrap. _(PT23.1.1)_

**C-04 · GA4 wird nicht vor Consent geladen und sendet nicht vor Consent.** _(PT23.1.1, Gate 2)_

**C-05 · Der GTM-`noscript`-iframe darf vor Consent nicht existieren.** Er greift genau dann, wenn
JavaScript deaktiviert ist — also wenn kein Consent-Dialog laufen kann. Entfernen oder serverseitig
unterbinden. _(PT23.1.2)_

**C-06 · Kein sonstiges nicht-essenzielles Drittanbieter-Skript vor Consent** — kein Chat, kein Pixel,
keine Schrift-CDN, kein Widget. Essenziell ist nur, was ohne Alternative für die Auslieferung der Seite
selbst nötig ist (siehe `NETWORK-ALLOWLIST.md`). _(PT23.1.4)_

**C-07 · Provider werden nach erteilter Einwilligung dynamisch nachgeladen**, kategoriegenau — Analytics
nur bei Analytics-Zustimmung, Marketing nur bei Marketing-Zustimmung. _(PT23.1.3)_

**C-08 · Kein Event-Puffern vor Consent.** Ereignisse, die vor der Einwilligung entstehen, werden
**verworfen**, nicht zwischengespeichert. Eine Warteschlange wäre bereits eine Vorratsdatenhaltung.
_(PT23.1.9, `DEC-RL-004`)_

### Consent-Zustand

**C-09 · Es gibt genau einen kanonischen Einwilligungszustand** im Browser. Jede Komponente, die
Provider lädt oder Ereignisse sendet, liest denselben Zustand — es gibt keine zweite Wahrheit.

**C-10 · Kategoriemodell: `necessary` · `analytics` · `marketing`.** `necessary` ist immer aktiv und
umfasst **keine** Analytics- oder Marketingzwecke. `analytics` und `marketing` sind **standardmäßig
aus** und werden getrennt entschieden. _(PT23.1.7)_

**C-11 · Der persistierte Zustand ist versioniert und selbstbeschreibend.** Er trägt mindestens:
die Kategorieentscheidungen, einen **Zeitstempel**, eine **Textversion** der Einwilligungserklärung und
den **Umfang**. Ein blankes Kategorien-Array ohne diese Felder erfüllt C-11 nicht. _(PT23.1.5, PT23.1.8)_

**C-12 · Consent-Evidence wird serverseitig nur dort gespeichert, wo ein Lead- oder Marketingzweck sie
erfordert** — nicht pauschal. Wo sie gespeichert wird, gilt dieselbe Struktur wie C-11.
_(PT23.1.8; Datenmodell siehe künftiges `LEAD-DATA-CONTRACT.md`)_

**C-13 · Formular-Datenschutzbestätigung ist NICHT Tracking-Consent.** Die Checkbox „ich stimme der
Verarbeitung meiner Angaben zu" begründet ausschließlich die Bearbeitung der Anfrage. Sie schaltet
**keinen** Analytics- oder Marketing-Provider frei. _(AP22 PT22.1.7–.8)_

**C-14 · Marketing-Consent wird niemals aus einer Formularabsendung abgeleitet.** Auch nicht aus einer
Bestellung, einem Download oder einer Terminanfrage. Marketing-Consent entsteht ausschließlich durch die
ausdrückliche Auswahl in C-10. _(AP22 PT22.1.8)_

### Nutzerpfade

**C-15 · Erster Seitenaufruf ohne gespeicherte Entscheidung:** **null** nicht-essenzielle
Provider-Requests, Dialog sichtbar, Betrieb der Seite vollständig möglich.

**C-16 · Wiederkehrender Besuch:** der gespeicherte Zustand wird gelesen und **genau so** angewendet —
gespeicherte Ablehnung führt zum selben Nullzustand wie C-15.

**C-17 · „Alle akzeptieren", „Nur notwendige", granulare Auswahl** sind gleichwertige, jederzeit
erreichbare Wege. Ablehnung darf nicht schwerer erreichbar sein als Zustimmung.

**C-18 · Widerruf ist jederzeit möglich** — über einen dauerhaft erreichbaren Einstieg, nicht nur im
Erstdialog. Der Widerruf gilt in beide Richtungen: erteilte Einwilligung zurücknehmen **und** abgelehnte
nachträglich erteilen. _(PT23.1.6)_

**C-19 · Widerruf hat definierte Wirkung.** Verbindlich festzulegen und umzusetzen:
künftige Ereignisse werden blockiert · der Provider wird deaktiviert bzw. abgemeldet ·
der persistierte Zustand wird aktualisiert · providerseitig gesetzte Cookies/Storage werden entfernt,
soweit technisch möglich · falls ein vollständiges Entladen nicht möglich ist, wird ein Reload erzwungen.
**Ein Widerruf, der nur Signale umstellt und den Provider geladen lässt, erfüllt C-19 nicht.**

### Struktur

**C-20 · Die Kette ist einseitig gerichtet:**
`CookieBanner → kanonischer Consent-Zustand → Tracking-Provider-Lebenszyklus → Netz-/Providerladen → Ereigniszustellung`.
**Keine untere Schicht darf die Entscheidung einer oberen umgehen.** Details der unteren Schichten in
`TRACKING-CONTRACT.md` und `NETWORK-ALLOWLIST.md`.

**C-21 · Consumer- und B2B-Bereich haben identische Consent-Semantik.** Beide Shells zeigen denselben
Dialog, lesen denselben Zustand und laden Provider nach denselben Regeln. Eine Landingpage ohne
Consent-Dialog ist unzulässig. _(AP21 PT21.1.4)_

**C-22 · SSR- und Hydrierungssicherheit.** Der Server kennt den `localStorage` nicht; der gespeicherte
Zustand darf erst nach der Hydrierung gelesen werden, sonst entsteht ein Hydration-Mismatch. Kein
Consent-abhängiges Markup im SSR-Output.

**C-23 · Technisches Performance-Monitoring ist kein Marketing-Tracking.** Web Vitals dürfen nicht über
den Marketing-Pfad laufen und brauchen eine eigene Rechts- und Betriebsgrundlage; sie enthalten keine
PII. _(PT23.5)_

**C-24 · Eine entfernte Funktion verliert ihre Consent- und Netzrechte.** Wer einen Provider abschaltet,
entfernt im selben Arbeitsschritt Kategorie, Ladepfad und CSP-Eintrag. _(AP26 PT26.2.1)_

---

## 5. Current Known Debt

Ist-Zustand, **kein zulässiges Zielverhalten**. Belege in `CONSENT-TRACKING-NETWORK-BASELINE.md`.

| ID        | Schuld                                                                                                                                                                       | Verletzt                                   |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **CD-1**  | **Unbedingter GTM-Loader** in `index.html:71-81` — lädt bei jedem Aufruf, ohne Bedingung                                                                                     | C-01, C-02, C-03                           |
| **CD-2**  | **Unbedingter `noscript`-iframe** in `index.html:188-201`                                                                                                                    | C-05                                       |
| **CD-3**  | **Unbedingter HiHuman-Loader** in `ChatWidget.tsx` — Drittanbieter-Skript auf jeder B2B-Seite, ohne jede Prüfung                                                             | C-01, C-06; zusätzlich `DEC-RL-007`/Gate 5 |
| **CD-4**  | **Direkte Consumer-`dataLayer`-Pfade** — `consumer/tracking.ts:35-36`, `OrderForm.tsx:164-168`, `OrderModal.tsx:84-85`, alle ohne Consent-Prüfung                            | C-09, C-20                                 |
| **CD-5**  | **`GtmPageview` umgeht den Consent** — einzige Prüfung ist `typeof gtag === 'function'` (`:83`), die immer wahr ist, weil `gtag` im Bootstrap definiert wird                 | C-09, C-20                                 |
| **CD-6**  | **Kein Widerrufsweg.** Nach gespeicherter Entscheidung rendert der Banner `null`; kein Wiederöffnen-Einstieg existiert                                                       | C-18, C-19                                 |
| **CD-7**  | **Ablehnung entlädt nichts** — kein Skript wird entfernt, keine Cookies gelöscht, kein Reload; nur Signale werden umgestellt                                                 | C-19                                       |
| **CD-8**  | **Die kanonische Fassade ist nicht registriert** — `setTrackingProvider`/`setTrackingConsent` werden nirgends aufgerufen; das einzig korrekt gegatete System ist wirkungslos | C-09, C-20                                 |
| **CD-9**  | **Consumer-Shell ohne `CookieBanner`** — Kampagnen-Traffic sieht keinen Dialog, während GTM lädt und Events geschrieben werden                                               | C-21                                       |
| **CD-10** | **Consent ohne Evidenz** — gespeichert wird ein Kategorien-Array ohne Zeitstempel, Textversion und Umfang; das Backend erhält ein blankes Boolean                            | C-11, C-12                                 |
| **CD-11** | **`necessary` ist ein Label ohne Wirkung** — die Kategorie wird nie ausgewertet und steuert keinen technischen Pfad                                                          | C-10                                       |
| **CD-12** | **Kein Consent-Test** — weder Unit noch E2E                                                                                                                                  | §8                                         |

**Positiv zu erhalten:** `src/lib/tracking.ts` erfüllt C-08 bereits vorbildlich — zwei Sperren, kein
Puffer, Slug-Allowlist gegen Fremdwerte. Diese Datei ist **Vorlage**, nicht Altlast.

---

## 6. Modification Rules

**M-01 — Consent-Logik lebt an genau einer Stelle.** Neue Provider, Kategorien oder Ladepfade werden im
kanonischen Consent-/Tracking-Pfad ergänzt, nie in einer Seite oder Sektion.

**M-02 — Reihenfolge im Bootstrap ist load-bearing.** Solange ein Consent-Mode-Block existiert, stehen
die Defaults **vor** jedem Provider-Bezug. Wer `index.html` anfasst, prüft zusätzlich die SSR-Platzhalter
`<!--ssr-outlet-->` und `<!--helmet-head-->`, die `server.ts` ersetzt.

**M-03 — `index.html`, `CookieBanner.tsx`, `tracking.ts` und `server.ts` nie als Datei aus `main`
übernehmen.** `BRANCH-RECONCILIATION-MAP.md` **N3**, **N9**, **N10**, **N1**. Nur Hunks.

**M-04 — Chat-Entfernung vor CSP-Finalisierung.** Master-Scope §7: _„Chat-Entfernung → CSP-Finalisierung."_
Drei unabhängige Reste sind zu entfernen: `ChatWidget.tsx` samt Einhängung, `POST /api/chat`, und die
Chat-Domains in der CSP. **Das Entfernen von `/api/chat` allein beseitigt die Exposition nicht** — es ist
der einzige der drei Reste ohne Netzwirkung.

**M-05 — Consent-Änderungen berühren immer auch die Datenschutzerklärung.** Wer Kategorien, Provider oder
Speicherformat ändert, meldet das an AP20 PT20.4.5–.7. Gate 2 verlangt konsistente Dokumentation.

**M-06 — Vor jeder Aktivierung eines Providers** ist zu prüfen, ob `NETWORK-ALLOWLIST.md` seine Origin
in der passenden Kategorie führt. Ohne Eintrag kein Ladepfad.

---

## 7. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an einer Datei aus §3:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt in `building-docs/scope/MASTER-SCOPE.md` (mindestens **AP23**)
4. **`building-docs/CONSENT-CONTRACT.md`** (dieses Dokument)
5. `building-docs/TRACKING-CONTRACT.md` — sobald Ereignisse oder Provider berührt sind
6. `building-docs/NETWORK-ALLOWLIST.md` — sobald externe Origins oder die CSP berührt sind
7. `building-docs/state/AP-STATE.md`
8. die aktuellen Quell- und Testdateien aus §3
9. `git diff -- <Datei>` **vor** der Änderung

Danach: die Prüfungen aus §8 ausführen.

---

## 8. Required Tests / Guards

Deterministischer Nachweis, nicht Behauptung. Methode bewährt: Playwright mit Request-Protokollierung und
`route.abort()` für externe Ziele (`CONSENT-TRACKING-NETWORK-BASELINE.md` §15).

| #       | Szenario                                        | Erwartung                                                                                                                                          | AP                 |
| ------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **G-1** | **Frischer Browserzustand, keine Entscheidung** | **kein** Request an GTM · **kein** GA4 · **kein** HiHuman · **kein** sonstiger nicht-essenzieller Provider                                         | PT23.1.4, PT27.4.1 |
| **G-2** | **Ausdrückliche Ablehnung**                     | identischer Nullzustand wie G-1                                                                                                                    | PT27.4.2           |
| **G-3** | **Analytics akzeptiert**                        | erlaubter Analytics-Provider **darf** laden; Pageview/Events werden korrekt zugestellt                                                             | PT27.4.3           |
| **G-4** | **Marketing akzeptiert**                        | **nur** die ausdrücklich erlaubten Marketing-Provider laden                                                                                        | PT23.4.3           |
| **G-5** | **Widerruf**                                    | künftige Ereignisse blockiert · Providerzustand gemäß C-19 zurückgesetzt · persistierter Zustand aktualisiert · **kein verstecktes Weitertracken** | PT27.4.4           |
| **G-6** | **Consumer-Seiten**                             | identische Consent-Semantik wie der übrige Auftritt (G-1 bis G-5 gelten dort gleichermaßen)                                                        | PT21.1.4           |
| **G-7** | **Kein Pre-Consent-Puffer**                     | nach nachträglicher Zustimmung werden **keine** vor der Entscheidung entstandenen Ereignisse nachgesendet                                          | PT23.1.9           |

**Statische Guards** (Node/Vitest — Vitest ist verfügbar, `QUALITY-BASELINE-LIVE.md` §9.2):

| #        | Guard                                                                                                                    | Fängt heute                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| **G-8**  | keine direkten `window.dataLayer`-Schreibzugriffe außerhalb der kanonischen Implementierung                              | 5 Fundstellen                      |
| **G-9**  | keine direkten `gtag(`-Aufrufe außerhalb der kanonischen Implementierung                                                 | 6 Fundstellen                      |
| **G-10** | **keine HiHuman-Referenz** in Quellcode oder CSP                                                                         | `ChatWidget.tsx`, 3 CSP-Direktiven |
| **G-11** | **kein unbedingter GTM-Loader in `index.html`** — schlägt an, sobald das Snippet ohne Consent-Bedingung wieder auftaucht | `index.html:71-81`                 |

G-8 bis G-11 sind so zu schreiben, dass sie **heute rot sind** und mit der Umsetzung grün werden.

---

## 9. Forbidden Regressions

- ❌ **Einen nicht-essenziellen Provider vor der Einwilligung laden** — in jeder Form
- ❌ **`denied`-Signale als Erfüllung von `REST-02` ausgeben**
- ❌ Den GTM-Loader oder den `noscript`-iframe unbedingt wieder einfügen
- ❌ Ereignisse vor Consent puffern, zwischenspeichern oder nachsenden
- ❌ Einen zweiten Consent-Zustand neben dem kanonischen einführen
- ❌ `analytics` oder `marketing` standardmäßig aktivieren
- ❌ **Formular-Datenschutzbestätigung als Tracking- oder Marketing-Consent verwerten**
- ❌ **Marketing-Consent aus einer Bestellung, Anfrage oder einem Download ableiten**
- ❌ Einen Widerruf implementieren, der nur Signale umstellt und den Provider geladen lässt
- ❌ Consumer-Seiten ohne Consent-Dialog ausliefern
- ❌ `index.html`, `CookieBanner.tsx`, `tracking.ts` oder `server.ts` als Datei aus `main` übernehmen
- ❌ Consent-abhängiges Markup im SSR-Output erzeugen
- ❌ Marketing-Tracking als technische Observability zweckentfremden
- ❌ Einen Provider entfernen und seine CSP-Rechte stehenlassen

---

## 10. AP Ownership / Lifecycle

| Phase                  | AP                                 | Ergebnis                                                                                         |
| ---------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Fundament/Eigentum** | **AP23 PT23.1**                    | Basic Consent Mode v2 mit vollständigem Ladeverzicht, Persistenz, Widerruf, Kategorien, Evidence |
| Fassade                | **AP23 PT23.2**                    | providerneutraler Kern, zentraler Consent-Guard → `TRACKING-CONTRACT.md`                         |
| Shell                  | **AP06 PT06.4**                    | CookieBanner site-weit; **ChatWidget entfernen**                                                 |
| Consumer               | **AP21 PT21.1.4**                  | Consent-Parität auf den Landingpages                                                             |
| Lead-Kopplung          | **AP22 PT22.1.7–.8**               | Formular-Consent von Marketing-Consent getrennt                                                  |
| Recht                  | **AP20 PT20.4.5–.7**               | Datenschutzerklärung spiegelt Kategorien, Provider und Speicherung                               |
| Netz/CSP               | **AP26 PT26.2**                    | Chat-Domains entfernen, GTM/GA4 nur consent-gesteuert, Enforce-Readiness                         |
| Performance            | **AP25 / AP23 PT23.5**             | Web Vitals getrennt vom Marketing-Pfad                                                           |
| Absicherung            | **AP27 PT27.4**                    | Consent-E2E — Voraussetzung für Gate 2                                                           |
| Abnahme                | **AP30 PT30.4.5**, **AP31 PT31.4** | Nonfunctional-QA und Consent-Livecheck                                                           |
| Betrieb                | **AP32 PT32.3.2**                  | Consent-Rate beobachten                                                                          |
| Dokumentation          | **AP33 PT33.1.8**                  | Consent/Tracking in der Entwicklerdoku                                                           |

**Änderungen an diesem Vertrag** verantwortet AP23. Decision Locks werden hier nie geändert.
