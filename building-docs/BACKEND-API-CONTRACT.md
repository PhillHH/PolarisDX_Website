# BACKEND-API-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Kerndateien ändert, folgt zwingend der
Kontextpflicht in §8. Blindes Editieren ist untersagt.

> ## ⚠ Ziel-, nicht Ist-Zustand
>
> Heute existieren fünf Endpunkte ohne Schema-Validierung, ohne Idempotenz, ohne Persistenz; der
> Erfolg einer Anfrage bedeutet ausschließlich „SendGrid hat angenommen"
> (`BACKEND-LEAD-CURRENT-STATE.md` §5/§6). **Dieser Vertrag beschreibt das SOLL.**

---

## 1. Purpose

Dieser Vertrag definiert das **Verhalten der Backend-Schnittstelle**: Validierung, Statuscodes,
Fehlerformat, Idempotenz, Grenzen, Missbrauchsschutz — und vor allem, **was eine erfolgreiche Antwort
bedeutet**.

Er ist die **Schnittstellenschicht** der Kette
`Frontend-Journey → API-Validierung → dauerhafter Lead-Datensatz → Zustell-Job → CRM/Mail → Zustellstatus → Monitoring`.

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zielautorität:** **`DEC-RL-009`** (Persistenz + CRM statt Mail-only), **`DEC-RL-007`** (kein Chat),
**`DEC-RL-011`**, **`DEC-RL-014`**, **AP22 PT22.1** (Eigentümer des API-Standards),
AP02 PT02.4.1 (einheitliches Fehlerformat und Validierung), AP26 PT26.3 (API-Security).

**Mitbetroffene APs:** AP08 PT08.5 (lokalisierte Systemtexte), AP15 PT15.6.6, AP19 PT19.3,
AP20 PT20.2–PT20.3, AP21 PT21.5, AP22 PT22.5–PT22.7, AP23 (Consent-Abgrenzung),
AP27 PT27.2 (Integrationstests), AP28 (Betrieb), AP30/AP31 (Abnahme).

**Stand AP02 PT02.4 (2026-08-24):** Der API-Teil des Lead-/Backend-Zielbilds ist bestätigt und um
**API-21 bis API-23** ergänzt. Die Ist-Erhebung und die **Vertragslandkarte** des gesamten Zielbilds
stehen in `LEAD-DATA-CONTRACT.md` §2.1/§3.1 — dort steht auch, welcher der vier Verträge welches Thema
besitzt. PT02.4 ist ein reiner **Dokumentationsschritt**: keine Quell-, Backend-, Runtime-,
Konfigurations- oder Abhängigkeitsdatei geändert, **kein Endpunkt, keine Persistenz, keine Queue, kein
CRM, kein Gating implementiert**.

**Baseline:** `feat/home-leadmagnet@961f65d`. Keine Decision-Lock-Änderung durch diesen Vertrag.

---

## 3. Current Participating Files / Current State

| Datei                                              | Rolle heute                                                                                                                                                                | Guard  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `server/server.js`                                 | `/api/contact`, `/api/support`, `/api/consumer-order`, `/api/chat`, `/api/roi-report`; `formLimiter` an drei von vier Formularrouten; `express.json({limit:'10mb'})`; CORS | **G3** |
| `src/api/{contact,support,consumerOrder}.ts`       | typisierte Clients; **verwerfen die `error`-Strings der 4xx-Antworten** (Ausnahme: `consumerOrder.ts`)                                                                     | G2     |
| `src/components/sections/RoiCalculatorSection.tsx` | ruft `/api/roi-report` **inline** auf, ohne `src/api/`-Client                                                                                                              | G2     |
| `server.ts`                                        | `/api/*`-Proxy auf `BACKEND_URL`, vor dem SSR-Catch-all                                                                                                                    | **G3** |
| `src/hooks/use{Contact,Support}Form.ts`            | Payload-Zusammenbau, Client-Validierung                                                                                                                                    | G2     |

---

## 4. Target Invariants

### Bedeutung einer Antwort

**API-01 · Eine erfolgreiche Antwort bestätigt die dauerhafte Annahme, nicht die externe Zustellung.**
Der Server antwortet erfolgreich, wenn der Lead persistiert ist (`LEAD-DATA-CONTRACT.md` LD-01).
CRM- und Mailzustellung laufen danach. **Kein Endpunkt darf Erfolg von einem externen Provider abhängig
machen, es sei denn, dieser Vertrag definiert ihn ausdrücklich synchron.**

**API-02 · E-Mail-Transport ist niemals die Definition von Erfolg.** _(`DEC-RL-009`)_

### Eingang

**API-03 · Schema-Validierung an der Serviceschwelle.** Jeder Endpunkt hat ein explizites Eingabeschema:
erlaubte Felder, Typen, Pflicht/Optional, Längen- und Wertebereiche. Die Policy für unbekannte Felder ist
**explizit festzulegen** — entweder konsequent verwerfen oder konsequent ablehnen; nicht je Endpunkt
verschieden. _(AP22 PT22.1.1, AP26 PT26.3.1)_

**API-04 · Serverseitige Validierung ist eigenständig.** Client-Validierung ist Bedienkomfort, nie eine
Vorbedingung. Was der Client prüft, prüft der Server erneut.

**API-05 · Feldlängen und Payloadgrößen sind begrenzt** — je Feld und je Anfrage, mit Anhängen als
eigener Grenze. Ein globales Bodylimit allein genügt nicht. _(AP26 PT26.3.3)_

**API-06 · Freitext wird als potenziell sensibel und potenziell feindlich behandelt** — Längenbegrenzung,
Kontextescaping an jeder Senke (Mail-HTML, PDF, CRM-Feld), keine Interpretation als Markup.
_(`LEAD-DATA-CONTRACT.md` LD-25)_

**API-07 · Consent ist ein Pflichtfeld dort, wo eine Journey ihn braucht**, und wird serverseitig
geprüft. Datenschutzbestätigung und Marketing-Consent sind **getrennte Felder**; keins wird aus dem
anderen abgeleitet. _(AP22 PT22.1.7–.8)_

### Antwort

**API-08 · Statuscodes sind deterministisch und journeyunabhängig gleich bedeutend.**

| Situation                                                     | Status                                     |
| ------------------------------------------------------------- | ------------------------------------------ |
| angenommen und persistiert                                    | `2xx` — Erfolgscode je Endpunkt festgelegt |
| Schema-/Feldfehler                                            | `400`                                      |
| Idempotenzkonflikt (gleicher Schlüssel, abweichende Nutzlast) | `409`                                      |
| Ratenbegrenzung                                               | `429`                                      |
| unerwarteter Serverfehler                                     | `5xx`                                      |

**API-09 · Einheitliches Fehler-Envelope** über alle Endpunkte. Konzeptionell mindestens:

| Feld           | Zweck                                                             |
| -------------- | ----------------------------------------------------------------- |
| `code`         | stabiler maschinenlesbarer Fehlercode, versionierter Wertebereich |
| `message_key`  | Übersetzungsschlüssel für die Anzeige — **keine fertige Prosa**   |
| `request_id`   | Korrelationskennung, auch in Logs und Monitoring                  |
| `field_errors` | feldbezogene Fehler, jeweils mit `code`/`message_key`             |

Die konkrete Serialisierung entscheidet AP22 PT22.1.2; verbindlich ist die **Form**, nicht die
Feldschreibweise. _(AP02 PT02.4.1)_

**API-10 · Das Backend liefert keine fertige Nutzerprosa in einer festen Sprache.** Es liefert stabile
Codes bzw. Übersetzungsschlüssel; die Anzeige lokalisiert der Client nach `I18N-CONTRACT.md`.
Ausnahme sind rein interne Texte (z. B. Benachrichtigungen ans eigene Team).

**API-11 · Fehlerantworten enthalten keine Interna** — keine Stacktraces, keine Provider-Antwortkörper,
keine internen Adressen, Hostnamen, Pfade oder Secrets. _(AP26 PT26.3.5)_

**API-12 · Jede Antwort trägt eine `request_id`**, die zum `lead_id` und zu den Zustell-Jobs korreliert.

**API-13 · Konsistenter `Content-Type`** in Anfrage und Antwort. Endpunkte akzeptieren, was ihr Schema
vorsieht, und antworten einheitlich.

### Idempotenz

**API-14 · Idempotenz ist serverseitig und explizit.** Sie ist Teil des gemeinsamen Idempotenzmodells
(§5.3) und gilt für jede Journey, die einen Lead erzeugt. _(AP22 PT22.1.5)_

**API-15 · Ein deaktivierter Absendeknopf ist keine Idempotenz.** Client-Doppelklickschutz ist
Bedienkomfort und ersetzt nie die serverseitige Prüfung.

### Schutz

**API-16 · Jede öffentliche schreibende Route ist ratenbegrenzt** — ohne Ausnahme, insbesondere
Bestellstrecken. _(AP26 PT26.3.2)_

**API-17 · Missbrauchsschutz gehört zum Standard**: Honeypot bzw. gleichwertiges Verfahren,
Größen- und Längengrenzen, Anhangsprüfung nach Typ und Größe. _(AP26 PT26.3.4)_

**API-18 · Empfänger und Ziele werden serverseitig bestimmt.** Kein Client-Feld entscheidet, wohin etwas
zugestellt wird. Ein Routingmerkmal ist ein validiertes Enum, kein Substring in einem Freitext.

**API-19 · Preview/Staging erzeugen keine produktiven externen Wirkungen.** Ein ausdrücklich deklarierter
Schalter unterbindet sie. Heute existiert `DRY_RUN` **ausschließlich für den Mailversand**
(`server/server.js:51-63`); die Ausweitung auf CRM und Queue ist AP22 PT22.8.4 zugewiesen.
**Keine Flags erfinden.** _(AGENT-CONTRACT Regel 18)_

### Transport und Exposition (AP02 PT02.4)

**API-21 · Personenbezogene und sensible Daten stehen nie in der URL.** Kontaktangaben, Freitext,
Bestelldaten, Tokens und Entitlement-Nachweise gehören in den Request-Body oder in einen Header — nicht
in Query-String oder Pfad. URLs landen in Proxy-, Server- und Browserverläufen sowie in Referrern.

**API-22 · Origin-, CORS- und CSRF-Bedarf wird je Endpunkt bewusst entschieden**, nicht global geerbt.
Für jede schreibende Route ist festgelegt, welche Ursprünge zulässig sind und ob ein
Cross-Site-Request-Schutz erforderlich ist. Eine pauschal offene CORS-Konfiguration ist keine
Entscheidung, sondern deren Abwesenheit. _(AP26 PT26.3)_

**API-23 · Kein offener Relay und keine freie Provider-Proxynutzung.** Kein Endpunkt leitet
clientbestimmte Inhalte ungeprüft an einen externen Provider weiter, und kein Endpunkt versendet an
clientbestimmte Empfänger (API-18). Ziel, Absender und Vorlage bestimmt der Server; der Client liefert
ausschließlich validierte Nutzlast.

### Bestand

**API-20 · `POST /api/chat` hat in der Zielarchitektur keinen Platz.** Der Endpunkt wird entfernt, samt
Mock-Antworten und Integrations-Roadmap-Kommentaren. _(`DEC-RL-007`, AP22 PT22.7, Gate 5)_

---

## 5. Target Model / Lifecycle

### 5.1 Ziel-Endpunkte je Journey

Pfadbenennung entscheidet AP22 PT22.1; verbindlich ist die **Zuständigkeit**.

| Journey                 | Zweck                                   | Auth-Annahme                                       | Rate-Limit-Klasse                     | Idempotenz       | Persistenz              | Queue-Wirkung                             | Frontend-Verantwortung                               |
| ----------------------- | --------------------------------------- | -------------------------------------------------- | ------------------------------------- | ---------------- | ----------------------- | ----------------------------------------- | ---------------------------------------------------- |
| **Allgemeine Anfrage**  | „Angebot anfragen"                      | öffentlich, unauthentifiziert                      | Formular (streng)                     | **erforderlich** | **Pflicht vor Antwort** | CRM- + Mail-Job                           | Erfolgs-/Fehleranzeige lokalisiert aus `message_key` |
| **Support**             | Supportfall inkl. optionalem Anhang     | öffentlich                                         | Formular (streng)                     | **erforderlich** | **Pflicht**             | CRM/Case- + Team-Mail- + Bestätigungs-Job | wie oben; Anhangsfehler feldbezogen                  |
| **Consumer-Bestellung** | Bestellanfrage der Landingpages         | öffentlich                                         | Formular (streng) — **heute fehlend** | **erforderlich** | **Pflicht**             | CRM-/Order- + Mail-Job                    | Fehlercodes lokalisiert × 10                         |
| **ROI-Report**          | Report anfordern (Lead-Magnet-Kandidat) | öffentlich                                         | Formular (streng)                     | **erforderlich** | **Pflicht**             | Report-Erzeugung + Zustell-Job + Lead-Job | Wartezustand ohne Zustellzusage                      |
| **Epigenetik-Inquiry**  | eigene Strecke (`DEC-RL-011`)           | öffentlich                                         | Formular (streng)                     | **erforderlich** | **Pflicht**             | CRM mit eigenem Routing + Mail-Job        | Panel-/Herkunftskontext als Felder                   |
| **Gated Content**       | Lead-Magnet, `content_download`         | öffentlich am Gate; **Asset-Zugriff kontrolliert** | Formular (streng)                     | **erforderlich** | **Pflicht**             | CRM- + Zustell-/Entitlement-Job           | Gate-UX, kein direkter Assetlink                     |
| ~~Chat~~                | —                                       | —                                                  | —                                     | —                | —                       | —                                         | **entfällt (API-20)**                                |

**Asset-Auslieferung (Gated Content):** Das Asset darf nicht allein über eine frei erratbare
`/downloads/`-URL erreichbar sein, wenn echtes Gating beabsichtigt ist. Ob ein zeitlich begrenzter
Entitlement-Link nötig ist, entscheidet AP19 PT19.3.7–.8. _(Gate 10)_

### 5.2 Verarbeitungsablauf

```
1. Rate-Limit / Missbrauchsschutz
2. Schema-Validierung + Normalisierung        → 400 bei Verstoß
3. Idempotenzprüfung                          → 409 bei Konflikt, Replay bei Wiederholung
4. Dauerhafte Speicherung des Leads           → LD-01
5. Zustell-Jobs einreihen (CRM, Mail, ggf. Asset)
6. Antwort: Annahme bestätigt (+ request_id)
7. Zustellung asynchron; Status im Datensatz  → LEAD-DELIVERY-CONTRACT.md
```

Schritt 6 folgt auf Schritt 4, **nicht** auf Schritt 5s Ergebnis.

### 5.3 Gemeinsames Idempotenzmodell

Für alle vier Verträge identisch. **Fünf getrennte Ebenen — keine ersetzt eine andere:**

| Ebene                            | Wo                 | Zweck                                                    |
| -------------------------------- | ------------------ | -------------------------------------------------------- |
| **A · Client-Doppelklickschutz** | Formularkomponente | Bedienkomfort. **Keine Idempotenz** (API-15)             |
| **B · API-Idempotenz**           | Endpunkt           | gleicher Schlüssel ⇒ genau ein Lead                      |
| **C · Job-/Queue-Idempotenz**    | Worker             | erneuter Lauf erzeugt keine zweite Wirkung               |
| **D · CRM-Zustell-Idempotenz**   | CRM-Adapter        | Wiederholung erzeugt keinen Duplikatdatensatz            |
| **E · Mail-Duplikatschutz**      | Mail-Adapter       | bereits zugestellte Nachricht wird nicht erneut gesendet |

**Regeln:**

- **Schlüsselstrategie:** Der Schlüssel wird pro Absendeversuch erzeugt — client-generiert und
  serverseitig validiert **oder** serverseitig ausgegeben. **AP22 PT22.1.5 entscheidet, welche Variante gilt.**
- **Geltungsbereich:** je Endpunkt/Journey, nicht global.
- **Gleicher Schlüssel + gleiche Nutzlast:** dasselbe logische Ergebnis, dieselbe `lead_id`, kein zweiter
  Lead, keine zweite Zustellung (**Replay-Semantik**).
- **Gleicher Schlüssel + abweichende Nutzlast:** Ablehnung mit `409` — nie stilles Überschreiben.
- **Aufbewahrungsfenster:** Schlüssel werden begrenzt vorgehalten. **Die konkrete Dauer legt AP22 fest**;
  dieser Vertrag erfindet keine Zeitspanne.
- **Korrelation:** Der Schlüssel ist im Lead-Datensatz hinterlegt (`LEAD-DATA-CONTRACT.md` LD-20) und
  verbindet A–E über `lead_id` und `request_id`.

---

## 6. Current Known Debt

| ID        | Schuld                                                                                                           | Verletzt       |
| --------- | ---------------------------------------------------------------------------------------------------------------- | -------------- |
| **AD-1**  | **Erfolg bedeutet „SendGrid hat angenommen"** — synchroner Versand vor jedem `res.status(200)`                   | API-01, API-02 |
| **AD-2**  | **Keine Schema-Validierung** — nur Einzelprüfungen; unbekannte Felder werden still verworfen (`intent`, `field`) | API-03         |
| **AD-3**  | **Keine Idempotenz** — kein Schlüssel, kein Dedupe; vier von fünf Journeys ohne Client-Guard                     | API-14         |
| **AD-4**  | **`/api/consumer-order` ohne Rate Limit** — einziger öffentlicher Bestellendpunkt ohne `formLimiter`             | API-16         |
| **AD-5**  | **Fehlerprosa statt Codes** — feste englische Strings; drei von vier Clients verwerfen sie ohnehin               | API-09, API-10 |
| **AD-6**  | **Keine `request_id`** in Antwort oder Logs                                                                      | API-12         |
| **AD-7**  | **Empfängerwahl über Client-Freitext** — ein Substring in `area` bestimmt die Zieladresse                        | API-18         |
| **AD-8**  | **Keine Feldlängenbegrenzung**; einzige Schranke ist ein 10-MB-Bodylimit                                         | API-05         |
| **AD-9**  | **`/api/chat` existiert** — verwaist, ohne Frontend-Aufrufer                                                     | API-20         |
| **AD-10** | **`DRY_RUN` nur für Mail** und in keiner Konfigurationsdatei deklariert                                          | API-19         |
| **AD-11** | **Kein Endpunkt-Test** — die gesamte Backend-Abdeckung sind sechs Fälle für `esc()`                              | §9             |

---

## 7. Modification Rules

**M-01 — Schema zuerst.** Endpunktänderungen beginnen beim Eingabeschema und beim Fehler-Envelope,
nicht bei der Implementierung.

**M-02 — Kein Endpunkt ohne Rate Limit, Idempotenz und Persistenz** — die drei sind Standard, nicht
Kür.

**M-03 — Journeys werden nicht über Freitextparameter gemultiplext.** Wo eine eigene Journey existiert,
bekommt sie einen eigenen Pfad oder einen validierten Typ. _(AP20 PT20.2.8, `DEC-RL-011`)_

**M-04 — `server/server.js` und `server.ts` nie als Datei aus `main` übernehmen** (**N1** in
`BRANCH-RECONCILIATION-MAP.md`); Kandidat **A14** ist ein Hunk.

**M-05 — Neue Fehlercodes sind additiv und stabil.** Ein Code ändert nie seine Bedeutung; Clients und
Übersetzungen hängen daran.

**M-06 — Anhänge bleiben nach Typ und Größe begrenzt**, client- und serverseitig gespiegelt.

---

## 8. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an `server/server.js`, `src/api/**`, den Formular-Hooks
und -Komponenten, der künftigen Persistenz-/Queue-/CRM-Schicht oder an `docker-compose.yml`
(sobald Worker/Storage hinzukommen):

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt (mindestens **AP22**, bei Security **AP26 PT26.3**)
4. `building-docs/LEAD-DATA-CONTRACT.md`
5. **`building-docs/BACKEND-API-CONTRACT.md`** (dieses Dokument)
6. `building-docs/CRM-INTEGRATION.md` — bei CRM-Mapping/-Zustellung
7. `building-docs/LEAD-DELIVERY-CONTRACT.md` — bei Queue, Mail, Retry
8. `building-docs/CONSENT-CONTRACT.md` — wo Consent-Evidence berührt ist
9. `building-docs/I18N-CONTRACT.md` — für Systemmails und nutzersichtbare Abläufe
10. `building-docs/state/AP-STATE.md`
11. die aktuellen Quell- und Testdateien aus §3
12. `git diff -- <Datei>` **vor** der Änderung

---

## 9. Required Tests / Guards

Kein Test darf ein echtes CRM oder einen echten Mailversand auslösen.

| #         | Prüfung                                               | Erwartung                                                           |
| --------- | ----------------------------------------------------- | ------------------------------------------------------------------- |
| **A-T1**  | gültige Absendung                                     | `2xx`, Lead persistiert, `request_id` vorhanden                     |
| **A-T2**  | ungültiger Feldwert                                   | `400` mit feldbezogenem Fehler im Envelope                          |
| **A-T3**  | Pflichtfeld fehlt                                     | `400`, kein Teildatensatz                                           |
| **A-T4**  | fehlerhafte Nutzlast (kein JSON, falscher Typ)        | `400`, **kein `5xx`**                                               |
| **A-T5**  | übergroße Nutzlast / Anhang                           | Ablehnung an der definierten Grenze                                 |
| **A-T6**  | stabiles Fehlerschema                                 | jede Fehlerantwort trägt dieselbe Envelope-Form                     |
| **A-T7**  | Ratenbegrenzung                                       | `429` nach Überschreitung — **auf jeder** öffentlichen Schreibroute |
| **A-T8**  | Idempotenz: gleicher Schlüssel + gleiche Nutzlast     | dasselbe logische Ergebnis, **ein** Lead                            |
| **A-T9**  | Idempotenz: gleicher Schlüssel + abweichende Nutzlast | `409`                                                               |
| **A-T10** | Doppelabsendung                                       | kein zweiter Lead                                                   |
| **A-T11** | Providerausfall                                       | Lead bleibt bestehen, Antwort bleibt Annahme                        |
| **A-T12** | keine Interna in Fehlern                              | kein Stacktrace, kein Providerkörper, keine internen Adressen       |
| **A-T13** | Consent-Trennung                                      | Absendung ohne Marketing-Häkchen erzeugt keinen Marketing-Consent   |
| **A-T14** | `/api/chat`                                           | im Zielzustand **404**                                              |
| **A-T15** | je Journey ein Ende-zu-Ende-Fall                      | sechs Journeys aus §5.1                                             |

_(AP27 PT27.2, PT27.3)_

---

## 10. Forbidden Regressions

- ❌ **Erfolg von einer externen Zustellung abhängig machen**, ohne dass dieser Vertrag den Endpunkt so definiert
- ❌ Einen Lead extern zustellen, bevor er persistiert ist
- ❌ Einen öffentlichen Schreibendpunkt ohne Rate Limit betreiben
- ❌ Einen Endpunkt ohne Eingabeschema betreiben
- ❌ Unbekannte Felder je Endpunkt unterschiedlich behandeln
- ❌ **Fertige Nutzerprosa in einer festen Sprache zurückgeben**
- ❌ Stacktraces, Provider-Antwortkörper, interne Adressen oder Secrets in Antworten ausgeben
- ❌ Empfänger oder Routing an einem Client-Freitext festmachen
- ❌ Einen deaktivierten Absendeknopf als Idempotenz werten
- ❌ Bei Idempotenzkonflikt still überschreiben statt `409`
- ❌ **`POST /api/chat` behalten oder wieder einführen** (`DEC-RL-007`)
- ❌ In Preview/Staging produktive externe Wirkungen erzeugen
- ❌ Flags wie `DRY_RUN` für neue Kanäle erfinden, statt sie in AP22/AP28 zu deklarieren
- ❌ `server/server.js` oder `server.ts` als Datei aus `main` übernehmen

---

## 11. AP Ownership / Lifecycle

| Phase                 | AP                                                | Ergebnis                                                                                                             |
| --------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Zielbild              | **AP02 PT02.4.1**                                 | einheitliches Fehlerformat und Validierung                                                                           |
| **Standard/Eigentum** | **AP22 PT22.1**                                   | Formular-/API-Standard: Validierung, Fehlerformat, Idempotenz, Honeypot, Rate Limit, Consent-Trennung, Kontextfelder |
| Migration             | **AP22 PT22.5**                                   | vier bestehende Endpunkte überführen; PraxisOrder sauber typisieren                                                  |
| Neue Journeys         | **AP22 PT22.6**, **AP15 PT15.6**, **AP19 PT19.3** | Epigenetik-Inquiry, Gated Content                                                                                    |
| Chat-Entfernung       | **AP22 PT22.7**                                   | `/api/chat` entfernen — Gate 5                                                                                       |
| Security              | **AP26 PT26.3**                                   | Schemas, Rate Limits inkl. Consumer Order, Grenzen, Idempotenz, Fehler ohne Interna                                  |
| Consumer              | **AP21 PT21.5**                                   | Bestellstrecke nach diesem Standard                                                                                  |
| Absicherung           | **AP27 PT27.2**                                   | Integrationstests — Voraussetzung für Gate 3                                                                         |
| Betrieb               | **AP28**, **AP32 PT32.1.3**                       | API-Fehlerraten sichtbar                                                                                             |
| Dokumentation         | **AP33 PT33.3.5**                                 | Wartungsregel „neue API-Route"                                                                                       |

**Änderungen an diesem Vertrag** verantwortet AP22, bei Security-Bezug gemeinsam mit AP26.
Decision Locks werden hier nie geändert.
