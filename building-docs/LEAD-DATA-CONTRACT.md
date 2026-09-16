# LEAD-DATA-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Kerndateien ändert, folgt zwingend der
Kontextpflicht in §8. Blindes Editieren ist untersagt.

> ## ⚠ Stand 2026-09-09 — teils Ist, teils weiterhin Soll
>
> **Das ursprüngliche Banner dieses Dokuments ist überholt und wurde in AP22 PT22.1 korrigiert.**
> Es lautete: „Heute existiert keine Lead-Persistenz." Das galt bei der Niederschrift in AP02
> (2026-08-24) und gilt seit AP19 nicht mehr.
>
> **Gemessener Stand:** **5 von 7** Journeys laufen vollständig auf der Shared Lead Foundation —
> `contact`, `support`, `consumer_order`, `epigenetics_inquiry`, `content_download`. Sie sind
> persistent, idempotent, retryfähig, rate-limitiert und consent-getrennt.
>
> **Weiterhin Soll:** `roi_report` ist unverändert ein Mailendpunkt ohne jede Persistenz, und
> `practice_order` ist noch gar keine typisierte Journey. Beides ist in **§12** mit Messwert und
> Owner belegt. Die Abschnitte §4–§5 beschreiben weiterhin das Zielmodell; §12–§17 beschreiben den
> gemessenen Ist-Zustand.

---

## 1. Purpose

Dieser Vertrag definiert den **kanonischen dauerhaften Lead-Datensatz**: was gespeichert wird, welche
Felder je Journey gelten, wie Einwilligungsnachweise abgelegt werden und welche Regeln für
Datenminimierung, Aufbewahrung und Auskunft gelten.

Er ist die **Datenschicht** der Kette
`Frontend-Journey → API-Validierung → dauerhafter Lead-Datensatz → Zustell-Job → CRM/Mail → Zustellstatus → Monitoring`.
Die Schnittstelle regelt `BACKEND-API-CONTRACT.md`, die Zustellung `LEAD-DELIVERY-CONTRACT.md`,
das CRM-Ziel `CRM-INTEGRATION.md`.

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zielautorität:**

- **`DEC-RL-009`** — _„Leads werden **persistent verarbeitet und an ein CRM übergeben**; Mail-only ist nicht das Zielmodell."_
- **`DEC-RL-011`** — _„Epigenetik erhält eine **eigene Inquiry-/Lead-Strecke** mit eigener Backend-/CRM-Zuordnung."_
- **`DEC-RL-014`** — _„…mindestens einen **gated Lead-Magnet-/Secondary-Conversion-Pfad**."_
- **AP22 PT22.2** (Eigentümer des Datenmodells), AP02 PT02.4.2/.6.

**Mitbetroffene APs:** AP03 PT03.3 (Journeys), AP08 PT08.5 (Sprache in Systemtexten),
AP11 PT11.5.6, AP14 PT14.6.6, AP15 PT15.6 (Epigenetik-Inquiry), AP19 PT19.3 (Gated Download),
AP20 PT20.2–PT20.3, AP21 PT21.5, AP23 (Consent-Evidence-Abgrenzung), AP26 (Security),
AP27 PT27.2 (Integrationstests), AP28 PT28.5 (Persistenz/Backup), AP32 (Betrieb), AP33 (Doku).

**Launch-Gate 3** und **Gate 10** hängen an diesem Vertrag.
**Baseline:** `feat/home-leadmagnet@961f65d`. Keine Decision-Lock-Änderung durch diesen Vertrag.

### 2.1 Lead-/Backend-Zielbild — Vertragslandkarte (AP02 PT02.4)

**Stand AP02 PT02.4 (2026-08-24):** Das Lead-/Backend-Zielbild ist festgeschrieben. Es liegt **nicht** in
einem einzelnen neuen Dokument, sondern verteilt auf die **vier bereits kanonischen** Verträge dieser
Domäne. PT02.4 hat sie gegen den realen Repository-Zustand geprüft, die verbliebenen Lücken geschlossen
(**LD-27 bis LD-33**, **API-21 bis API-23**) und diese Landkarte ergänzt. **Es wurde kein konkurrierendes
Architektur-Dokument erzeugt.**

| Thema                                             | Kanonischer Ort                                                              |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| Lead-Domänenmodell, Journey-Typen, Feldkategorien | **dieser Vertrag** §4 „Modell", §5.1, §5.2                                   |
| Datenminimierung je Journey                       | **dieser Vertrag** LD-06/LD-07, §5.2                                         |
| Systemgrenzen (CRM/Mail/Browser ≠ Persistenz)     | **dieser Vertrag** LD-03, **LD-27**                                          |
| Deduplication ≠ Idempotenz                        | **dieser Vertrag** LD-19, **LD-28**                                          |
| Consent-/Legal-Kontext im Lead                    | **dieser Vertrag** LD-12–LD-15                                               |
| Retention, Löschung, Auskunft                     | **dieser Vertrag** LD-21/LD-22, **LD-29/LD-30**                              |
| API-Fehlervertrag, Validierung, Statuscodes       | `BACKEND-API-CONTRACT.md` API-03–API-13                                      |
| Persistenz-First und Transaktionsgrenze           | `BACKEND-API-CONTRACT.md` API-01, §5.2 · LD-01                               |
| Idempotenzmodell (fünf Ebenen A–E)                | `BACKEND-API-CONTRACT.md` §5.3                                               |
| Rate Limit, Abuse-Schutz, API-Security            | `BACKEND-API-CONTRACT.md` API-05/06/16/17, **API-21–API-23**                 |
| Lead-Statusmodell je Kanal                        | `LEAD-DELIVERY-CONTRACT.md` §5.1                                             |
| Queue, Retry, Backoff, Dead-Letter, Replay        | `LEAD-DELIVERY-CONTRACT.md` LDV-05–LDV-08                                    |
| Outbox-/Konsistenzprinzip                         | `LEAD-DELIVERY-CONTRACT.md` LDV-03                                           |
| Mailzustellung als nachgelagerter Kanal           | `LEAD-DELIVERY-CONTRACT.md` LDV-17–LDV-20                                    |
| Gated Asset Delivery / Entitlement                | `LEAD-DELIVERY-CONTRACT.md` LDV-24 · `CONTENT-ASSET-CONTRACT.md` CA-30–CA-34 |
| Logging-/PII-Minimierung                          | `LEAD-DELIVERY-CONTRACT.md` LDV-21/LDV-22 · LD-17/LD-18                      |
| CRM-Adaptergrenze, Mapping, Provider-Neutralität  | `CRM-INTEGRATION.md` CRM-01–CRM-06, §5.1, §5.4                               |
| Epigenetik-Inquiry als eigene Zuordnung           | §5.1 hier · `CRM-INTEGRATION.md` §5.2 (`DEC-RL-011`)                         |
| Consumer Order als eigener Vorgang                | §5.1/§5.2 hier · `BACKEND-API-CONTRACT.md` §5.1                              |
| Kein Chat im Zielmodell                           | `BACKEND-API-CONTRACT.md` API-20 · **LD-31**                                 |
| DRY_RUN-/Staging-Isolation                        | LD-24 · API-19 · LDV-16 · CRM-18 (`REST-01`)                                 |
| Betriebsanforderungen an die Lead-Plattform       | `LEAD-DELIVERY-CONTRACT.md` §5.4 → **AP28/PT02.5**                           |

---

## 3. Current Participating Files / Current State

| Datei                                                                                                           | Rolle heute                                                                                            | Guard  |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------ |
| `server/server.js`                                                                                              | fünf Endpunkte, **kein Speicher** — jeder Lead wird direkt per SendGrid versendet und danach verworfen | **G3** |
| `src/api/{contact,support,consumerOrder}.ts`                                                                    | typisierte Frontend-Clients für drei der Journeys                                                      | G2     |
| `src/hooks/{useContactForm,useSupportForm}.ts`                                                                  | Payload-Zusammenbau                                                                                    | G2     |
| `src/components/sections/ContactForm.tsx`, `SupportForm.tsx`, `PraxisOrderForm.tsx`, `RoiCalculatorSection.tsx` | Erhebungsflächen                                                                                       | G2     |
| `src/pages/consumer/{OrderForm,OrderModal}.tsx`                                                                 | Consumer-Bestellung                                                                                    | G2     |
| **künftige Persistenzschicht**                                                                                  | existiert nicht                                                                                        | **G3** |
| `docker-compose.yml`                                                                                            | heute zwei Services, **kein persistenter Speicher**                                                    | G2     |

### 3.1 Ist-Zustand Lead und Backend (AP02 PT02.4, read-only erhoben 2026-08-24)

> **HISTORISCH.** Diese Erhebung beschreibt den Stand vom 2026-08-24 und ist seit AP19/AP20/AP21
> in weiten Teilen überholt: Persistenz, Outbox, Retry, Idempotenz, Consent-Evidence und
> Endpunkt-Tests existieren inzwischen. Sie bleibt als Ausgangsmessung stehen, weil sie belegt,
> **wovon** ausgegangen wurde. Der gemessene aktuelle Stand steht in **§12**.

**Gemessener IST-Zustand vom 2026-08-24, nicht das SOLL.** Erhebung durch Quelllesung ohne Änderung
— kein Request abgesetzt, keine Mail gesendet, kein CRM-Aufruf, kein Lead erzeugt.

| Klasse                | Ist-Befund                                                                                                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** API-Endpunkte   | **fünf** in `server/server.js` (733 Zeilen): `/api/contact`, `/api/support`, `/api/consumer-order`, `/api/chat`, `/api/roi-report`                                                                                                                      |
| **B** Validierung     | Einzelprüfungen je Handler — Consent-Flag, Pflichtfeld-Existenz, ein E-Mail-Regex, Honeypot `_hp`. **Kein Schema**, keine Feldlängenbegrenzung; einzige Schranke ist `express.json({limit:'10mb'})`                                                     |
| **C** Mailverhalten   | **synchroner SendGrid-Versand vor jeder Erfolgsantwort**; Erfolg = „Provider hat angenommen". Providerfehler ⇒ `500`, der Vorgang ist verloren. Empfängerwahl teils aus **Client-Freitext** (`area.includes(...)` schaltet auf eine andere Zieladresse) |
| **D** Persistenz      | **keine.** Keine Datenbank, kein Dateispeicher, kein Lead-Datensatz. `server/package.json` führt genau sechs Laufzeitabhängigkeiten: `@sendgrid/mail`, `cors`, `dotenv`, `express`, `express-rate-limit`, `pdfkit`                                      |
| **E** CRM             | **keins.** Kein Adapter, kein Port, keine Anbieterbibliothek                                                                                                                                                                                            |
| **F** Queue / Retry   | **keine.** Kein Job-Store, kein Worker, kein Backoff, kein Dead-Letter                                                                                                                                                                                  |
| **G** Rate Limits     | `formLimiter` (per-IP) an `/api/contact`, `/api/support`, `/api/roi-report`. **`/api/consumer-order` und `/api/chat` ohne Limit**; `trust proxy` ist gesetzt, damit `req.ip` belastbar bleibt                                                           |
| **H** Consent / Audit | Consent wird als Boolean geprüft und in den Mailtext übernommen. **Keine Consent-Evidence** (Zeitpunkt, Version, Umfang), keine Korrelationskennung, kein Audit-Datensatz                                                                               |
| **I** Consumer Order  | eigener Endpunkt, aber **mail-only**, ohne Rate Limit, ohne Idempotenz, ohne Order-Zustand                                                                                                                                                              |
| **J** Chat-Rest       | `POST /api/chat` existiert weiterhin (Mock-Antwort), ohne Frontend-Aufrufer                                                                                                                                                                             |
| **K** Testabdeckung   | `server/server.test.js`, 41 Zeilen: ausschließlich Fälle für die Hilfsfunktion `esc()`. **Kein einziger Endpunkt-Test**                                                                                                                                 |

> **Nachtrag AP22 PT22.7 (2026-09-09):** Die Zeilen **A**, **G** und **J** halten den Ist-Befund zum
> Zeitpunkt der Aufnahme fest und bleiben deshalb unverändert stehen. `/api/chat` gibt es seither
> nicht mehr: Handler, Mock-Antworten und Roadmap-Kommentar sind entfernt, ein POST antwortet 404.
> Damit entfällt auch der ungebremste Endpunkt aus Zeile **G** — es gibt keinen POST-Endpunkt ohne
> `formLimiter` mehr. Siehe §25.9.

**Antwortform (gemessen):** Erfolg `200 {success:true}`, Fehler `400`/`500` mit `{error:"<feste
englische Prosa>"}` — **kein** stabiler Fehlercode, **keine** `request_id`, **keine** feldbezogenen
Fehler. `DRY_RUN` existiert als globaler Kill-Switch **ausschließlich für den Mailversand**
(`server/server.js`), nicht für CRM oder Queue.

**Bewertung:** Der heutige Stand ist **Mail-only** und damit die genaue Gegenposition zu `DEC-RL-009`.
Diese Messung hat **keine neue** Schuld ergeben — sie bestätigt die bereits dokumentierten Einträge in
`BACKEND-API-CONTRACT.md` §6 (`AD-1`–`AD-11`), §6 hier (`LDD-1`–`LDD-12`),
`LEAD-DELIVERY-CONTRACT.md` §6 (`LVD-1`–`LVD-12`) und `CRM-INTEGRATION.md` §6. **Keine davon wurde in
PT02.4 repariert.**

---

## 4. Target Invariants

### Dauerhaftigkeit

**LD-01 · Persist-before-deliver.** Ein angenommener Lead/Auftrag/Anfrage wird **zuerst** ein
dauerhafter, eindeutig identifizierbarer Datensatz. Erst danach gilt eine asynchrone externe Zustellung
überhaupt als betrachtbar. _(AP22 PT22.4.1, Gate 3)_

**LD-02 · Kein Lead geht bei einem normalen Providerfehler verloren.** Fällt CRM oder Mailversand aus,
bleibt der Datensatz bestehen und bleibt wiederholbar zustellbar. _(Master-Scope §1.2/6, `DEC-RL-009`)_

**LD-03 · Der eigene Datensatz ist das System of Record.** Weder CRM noch Postfach noch Mailprovider
sind die einzige Kopie eines Leads. _(`CRM-INTEGRATION.md` CRM-01)_

**LD-04 · Jeder Datensatz trägt eine stabile, eindeutige Kennung** (`lead_id`), die über alle Schichten
— API-Antwort, Job, CRM-Handoff, Mail, Logs, Monitoring — als Korrelationsschlüssel dient.

### Modell

**LD-05 · Jede Journey hat genau einen expliziten Lead-Typ.** Der Typ ist ein geschlossener
Wertebereich, kein Freitext, und wird serverseitig gesetzt bzw. validiert — nie allein aus einem
Client-Feld abgeleitet. _(AP22 PT22.2.1)_

**LD-06 · Gemeinsame Felder und journey-spezifische Felder sind getrennt.** Gemeinsame Felder gelten für
alle Typen; journey-spezifische Felder existieren nur dort, wo die Journey sie fachlich braucht.

**LD-07 · Datenminimierung.** Ein Feld wird erhoben und gespeichert, weil eine Journey es **braucht** —
nicht, weil ein Formular es anbietet. Lieferadressen z. B. nur bei Bestellstrecken.
_(AP22 PT22.2.2, AP02 PT02.4.6)_

**LD-08 · Keine stillschweigende Übernahme unbekannter Frontend-Felder.** Was nicht im Schema steht,
wird nicht gespeichert. Ein zusätzliches Feld im Client-Payload wird verworfen oder gemäß
`BACKEND-API-CONTRACT.md` API-03 abgelehnt — niemals „vorsichtshalber" persistiert.

**LD-09 · Normalisierung findet an der Serviceschwelle statt** und ist im Schema festgelegt:
Trimmen, Groß-/Kleinschreibung bei E-Mail, Längenbegrenzung, Whitespace-Normalisierung. Der gespeicherte
Wert ist der normalisierte Wert; der Rohwert wird nicht zusätzlich aufbewahrt.

**LD-10 · Sprache ist ein Pflichtfeld jedes Leads.** Sie stammt aus dem URL-Sprachpräfix
(`I18N-CONTRACT.md` I-04) und steuert Bestätigungsmails, CRM-Felder und Auswertung.
_(AP22 PT22.2.3)_

**LD-11 · Herkunftskontext wird strukturiert gespeichert, nie als Prosa.** `source`, `campaign`,
`panel`, `asset`, `product` und der Routenkontext sind eigene Felder — **nicht** in einen Nachrichtentext
einkomponiert. _(AP22 PT22.2.4, AP20 PT20.2.8)_

### Einwilligung

**LD-12 · Formular-Datenschutzbestätigung und Marketing-Consent sind zwei getrennte Felder.** Keins
folgt aus dem anderen. _(AP22 PT22.1.7–.8, `CONSENT-CONTRACT.md` C-13)_

**LD-13 · Tracking-Consent wird niemals aus einem Lead abgeleitet** und ist kein Feld dieses Modells.
Er lebt ausschließlich im Consent-Vertrag. _(`CONSENT-CONTRACT.md` C-14)_

**LD-14 · Consent-Evidence umfasst mindestens Zeitpunkt, Version und Umfang** — wörtlich nach
AP22 PT22.2.5 („Consent Evidence: Zeitpunkt, Version, Umfang"). Die _Version_ bezeichnet die Fassung des
zugestimmten Textes, sodass eine spätere Textänderung eine Alt-Zustimmung nicht überschreibt.
_(auch `CONSENT-CONTRACT.md` C-11/C-12)_

**LD-15 · Consent-Evidence wird nur dort gespeichert, wo ein Lead- oder Marketingzweck sie erfordert** —
nicht pauschal. _(AP23 PT23.1.8)_

### Zustand und Prüfbarkeit

**LD-16 · Zustellzustand ist Teil des Datensatzes**, getrennt je Kanal: CRM-Status, Mail-Status,
Job-/Queue-Status, Versuchszähler, Zeitpunkt des nächsten Versuchs, letzte **Fehlerklassifikation**
(transient/permanent, siehe `LEAD-DELIVERY-CONTRACT.md`) und ein Dead-Letter-/Manual-Review-Kennzeichen.
_(AP22 PT22.2.6)_

**LD-17 · Fehlerklassifikation statt Rohfehler.** Gespeichert wird eine **klassifizierte** Ursache und
eine Referenz, nicht der ungefilterte Antwortkörper eines Providers. Rohkörper können PII oder
Zugangsdaten enthalten. _(AP22 PT22.3.8)_

**LD-18 · Keine Secrets im Datensatz.** Keine API-Schlüssel, Tokens oder Zugangsdaten — auch nicht
transitiv über eingebettete Fehlerobjekte. _(AP26 PT26.4)_

**LD-19 · Deduplizierungsmerkmale sind ausgewiesen**, damit Mehrfachzustellungen erkennbar werden.
Welche Merkmale gelten, entscheidet AP22 PT22.2.7 je Journey; das Modell hält Platz dafür vor.

**LD-20 · Audit-Zeitstempel und Korrelationskennung sind Pflicht** — Erstellung, Änderung, relevante
Verarbeitungsschritte, Request-/Correlation-ID und der Idempotenzschlüssel. _(AP22 PT22.2.9)_

### Systemgrenzen und Abgrenzungen (AP02 PT02.4)

**LD-27 · Die Systemgrenzen sind eindeutig.** Keine dieser Rollen darf mit der Lead-Persistenz
verwechselt werden:

| System                                             | Rolle                                 | **Nicht**                                                                 |
| -------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| eigener Lead-Speicher                              | **System of Record** (LD-03)          | —                                                                         |
| CRM                                                | nachgelagertes Zielsystem             | primäre Website-Datenbank; **nicht** die Instanz, die Annahme entscheidet |
| Mailprovider / Postfach                            | Transport- und Benachrichtigungskanal | Persistenz, Archiv oder Beleg der Annahme                                 |
| Browser-Speicher (`localStorage`, Session, Cookie) | Bedienkomfort im Client               | **niemals** Lead-Persistenz, Zustands- oder Idempotenzquelle              |
| Log                                                | Spur                                  | Zustand (`LEAD-DELIVERY-CONTRACT.md` LDV-25)                              |

**LD-28 · Deduplication ist nicht Idempotenz — beide sind Pflicht, aber getrennt.**

| Begriff           | Frage                                                                      | Verbindlichkeit                                                               |
| ----------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Idempotenz**    | Derselbe **technische** Vorgang läuft mehrfach — wirkt er nur einmal?      | **technische Pflicht**; Modell in `BACKEND-API-CONTRACT.md` §5.3 (Ebenen A–E) |
| **Deduplication** | Zwei **fachlich** ähnliche, technisch verschiedene Leads — dieselbe Sache? | **fachliche Strategie**; Merkmale je Journey (LD-19, AP22 PT22.2.7)           |

Daraus folgt verbindlich:

- Deduplication darf **legitime getrennte Anfragen nicht zusammenwerfen**. Dieselbe Person darf
  zweimal etwas anderes anfragen; das sind zwei Vorgänge.
- Dedup-Regeln sind **journey-spezifisch** definierbar; eine globale Regel über alle Lead-Typen ist
  unzulässig.
- Das **CRM ist nicht die einzige Stelle**, an der Duplikate erkannt werden. Wer Dedup ausschließlich
  dem Zielsystem überlässt, hat im eigenen System of Record keine Wahrheit darüber (LD-03).
- Eine Dedup-Entscheidung wird **nachvollziehbar festgehalten**, nicht stillschweigend angewendet.

**LD-29 · Aufbewahrungsfristen sind eine Rechtsentscheidung, keine Architekturentscheidung.** Dieser
Vertrag verlangt, dass je Lead-Typ eine Frist **existiert und durchsetzbar ist** (LD-21) — er erfindet
**keine Dauer**. Solange keine kanonisch belegte Frist vorliegt, gilt sie als
**`TBD_OWNER_LEGAL`**; das ist ein ausgewiesener offener Punkt, kein stillschweigendes „unbegrenzt".
**Ewige Datenhaltung ist kein zulässiger Default.**

**LD-30 · Löschung und Anonymisierung dürfen die Verarbeitungskonsistenz nicht stillschweigend
zerstören.** Eine Lösch- oder Anonymisierungsmaßnahme bezieht offene Jobs, Dead-Letter-Einträge,
Audit-Spuren und Sicherungen ausdrücklich ein — entweder werden sie mit behandelt oder ihr Verbleib ist
begründet und dokumentiert. Ein Löschlauf, der einen Job mit personenbezogener Nutzlast zurücklässt,
erfüllt LD-22 nicht.

**LD-31 · Chat ist kein Bestandteil des Zielmodells.** Es gibt keinen Chat-Lead-Typ, keinen
Chat-Source-Kontext, keine Chat-CRM-Zuordnung und keinen Chat-Provider-Adapter. Die vorhandenen Reste
sind Baseline Debt der Owner-APs, kein Vertragsgegenstand. _(`DEC-RL-007`,
`BACKEND-API-CONTRACT.md` API-20, Gate 5)_

**LD-32 · Speicher- und Queue-Technologie sind offen und anbieterneutral zu halten.** Dieser Vertrag
formuliert **Anforderungen** — Dauerhaftigkeit, Statusübergänge, Auffindbarkeit, Backup-/Restore-Fähigkeit,
Transaktions- oder Outbox-Fähigkeit — und **keine Produktwahl**. Datenbank, Queue, Monitoring-Senke und
Secrets-Verwaltung entscheiden **AP22** und **AP28** auf kanonischer Grundlage.
_(vgl. `CRM-INTEGRATION.md` §5.4 für dieselbe Logik beim CRM)_

**LD-33 · Das Zielbild ist ohne Anbieterentscheidung baubar.** Lead-Modell, Persistenz-First,
Statusmodell, Idempotenz, Queue-Semantik, Fehlerklassifikation und Testadapter lassen sich vollständig
umsetzen, bevor CRM, Datenbank oder Queue-Produkt feststehen. Eine offene Anbieterfrage ist **kein**
Grund, Mail-only beizubehalten.

### Betroffenenrechte

**LD-21 · Aufbewahrung ist definiert und durchsetzbar.** Je Lead-Typ ist eine Aufbewahrungsdauer
festgelegt; ein Prozess setzt sie um. _(AP22 PT22.8.1)_

**LD-22 · Löschung und Auskunft sind technisch möglich.** Ein Lead ist über `lead_id` oder über die
Kontaktangabe auffindbar, ausgebbar und löschbar — einschließlich abgeleiteter Job-/Audit-Einträge.
_(AP22 PT22.8.2, AP02 PT02.4.6)_

**LD-23 · Kundendaten gehören nie ins Repository** — nicht als Fixture, nicht als Testdatensatz, nicht
als Beispieldump. Testleads sind anonymisiert. _(AGENT-CONTRACT Regel 17, AP22 PT22.8.3)_

**LD-24 · Preview und Staging erzeugen keine produktiven Datensätze** und schreiben nicht in
produktive Speicher. _(AP22 PT22.8.4, AP28 PT28.1.5–.6)_

**LD-25 · Freitext gilt als potenziell sensibel.** Nachrichten- und Beschreibungsfelder unterliegen
denselben Schutz-, Log- und Aufbewahrungsregeln wie Kontaktdaten, weil ihr Inhalt nicht vorhersagbar ist.

**LD-26 · Keine Gesundheitsdaten-Klassifizierung ohne Beleg.** Ein Feld wird erst dann als besondere
Kategorie behandelt, wenn seine tatsächliche Erhebung das erfordert. Die heutigen Journeys erheben
B2B-Betriebsdaten (Fachrichtung, Gerätestörung), keine Patientendaten — das ist zu **prüfen**, nicht zu
**vermuten**.

---

## 5. Target Model / Lifecycle

### 5.1 Lead-Typen

| Lead-Typ               | Journey                                  | Naming-Quelle                                                      |
| ---------------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| **`content_download`** | Gated Lead-Magnet / geschützter Download | **im Master-Scope wörtlich festgelegt** (AP19 PT19.3.4)            |
| `general_inquiry`      | allgemeine Anfrage („Angebot anfragen")  | konzeptionell — **Endgültige Benennung entscheidet AP22 PT22.2.1** |
| `support`              | Supportfall                              | konzeptionell; AP20 PT20.3.3 lässt „Case- **oder** Lead-Typ" offen |
| `consumer_order`       | Consumer-Bestellung                      | konzeptionell                                                      |
| `roi_report`           | ROI-Report-Anforderung                   | konzeptionell                                                      |
| `epigenetics_inquiry`  | eigene Epigenetik-Strecke                | konzeptionell; **eigener Typ ist durch `DEC-RL-011` gefordert**    |

> **Abgrenzung:** `consumer_order_submit`, `roi_report_request` und `epigenetics_inquiry_submit` sind in
> AP23 PT23.3 **Tracking-Ereignisnamen**, keine Lead-Typen. Namensgleichheit ist nicht vorauszusetzen.
> Über die endgültigen Lead-Typ-Bezeichner entscheidet **AP22**; kein anderes AP erfindet sie.

### 5.2 Feldkategorien

**Gemeinsam für alle Typen**

| Kategorie    | Felder (konzeptionell)                                                                     | Pflicht               |
| ------------ | ------------------------------------------------------------------------------------------ | --------------------- |
| Identität    | `lead_id`, `created_at`, `updated_at`                                                      | ja                    |
| Journey      | `lead_type`, `source`, `language`, Routen-/Seitenkontext                                   | ja                    |
| Kampagne     | `campaign` u. ä. — **nur wenn tatsächlich übermittelt**                                    | optional              |
| Person       | `name`, `email`                                                                            | ja (Ausnahmen unten)  |
| Person       | `phone`, `company`/`practice`                                                              | optional              |
| Einwilligung | Datenschutzbestätigung + Evidence (Zeitpunkt/Version/Umfang)                               | ja                    |
| Einwilligung | Marketing-Consent (**separat**)                                                            | optional, default aus |
| Zustellung   | CRM-State, Mail-State, Queue-State, Versuche, letzte Fehlerklasse, Dead-Letter-Kennzeichen | ja                    |
| Audit        | Correlation-ID, Idempotenzschlüssel, Verarbeitungszeitstempel                              | ja                    |

**Journey-spezifisch**

| Lead-Typ              | Zusätzliche Felder                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `general_inquiry`     | Anliegen/Intent, Fachbereich, Freitext                                                    |
| `support`             | Geräte-UDI, SW-Version, Problemtyp, Betreff, Beschreibung, Anhangsreferenz                |
| `consumer_order`      | Produkt, Menge, Lieferadresse (Straße/PLZ/Ort/Land), Freitext                             |
| `roi_report`          | Praxisname, Fachrichtung, Eingabewerte, Ergebniswerte, Referenz auf das erzeugte Dokument |
| `epigenetics_inquiry` | Einrichtungstyp, Panel-Interesse, fachliche Qualifizierungsfelder (AP15 PT15.6.2–.4)      |
| `content_download`    | Asset-ID, Entitlement-/Zustellreferenz (AP19 PT19.3.4/.8)                                 |

**Regeln:** `email` ist bei jedem Typ Pflicht, weil jede Journey eine Rückmeldung braucht.
Lieferadressfelder existieren **nur** bei `consumer_order`. Die ROI-Ergebniswerte sind
**Client-berechnete Angaben** und als solche zu kennzeichnen, nicht als Serverberechnung.

### 5.3 Lebenszyklus des Datensatzes

```
Annahme (API) → PERSISTIERT (LD-01)
     ├── Kanal CRM   : offen → zugestellt | wiederholung | permanent fehlgeschlagen | manuelle Prüfung
     └── Kanal Mail  : offen → zugestellt | wiederholung | permanent fehlgeschlagen | manuelle Prüfung
Aufbewahrungsfrist → Löschung (LD-21/LD-22)
```

Die Kanäle sind **unabhängig**: ein erfolgreicher Kanal darf den anderen nicht blockieren, und ein
erneuter Versuch eines Kanals darf den bereits erfolgreichen nicht wiederholen
(`LEAD-DELIVERY-CONTRACT.md`).

---

## 6. Current Known Debt

Ist-Zustand, **kein zulässiges Zielverhalten**. Belege in `BACKEND-LEAD-CURRENT-STATE.md`.

| ID         | Schuld                                                                                                                                                                       | Verletzt              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| **LDD-1**  | **Keine Persistenz** — keine DB-/ORM-/Queue-Abhängigkeit, kein Dateisystem-Schreibzugriff                                                                                    | LD-01, LD-02, LD-03   |
| **LDD-2**  | **Keine Lead-Kennung** — kein `lead_id`, keine Correlation-ID, kein Idempotenzschlüssel                                                                                      | LD-04, LD-20          |
| **LDD-3**  | **Kein Lead-Typ** — die Journey ergibt sich nur aus dem getroffenen Endpunkt                                                                                                 | LD-05                 |
| **LDD-4**  | **Herkunft und Bestelldaten reisen als Freitext** — `Herkunft: …` und `BESTELLUNG …` werden in `message` einkomponiert; die Empfängerwahl hängt an einem Substring in `area` | LD-11                 |
| **LDD-5**  | **Consent ist ein blankes Boolean** — ohne Zeitpunkt, Version, Umfang, und es wird nirgends gespeichert                                                                      | LD-14, LD-15          |
| **LDD-6**  | **Keine Sprache im Payload** — Systemmails sind hartkodiert deutsch                                                                                                          | LD-10                 |
| **LDD-7**  | **Kein Zustellzustand** — Erfolg oder Misserfolg existieren nur als HTTP-Antwort                                                                                             | LD-16                 |
| **LDD-8**  | **Rohe Providerfehler in Logs** — `console.error(error.response.body)` an vier Stellen; zwei Endpunkte loggen E-Mail-Adressen                                                | LD-17, LD-25          |
| **LDD-9**  | **Keine Aufbewahrung/Löschung/Auskunft möglich** — mangels Speicher gibt es kein Objekt dafür                                                                                | LD-21, LD-22          |
| **LDD-10** | **Kein eigener Epigenetik-Lead** — die Strecke multiplext über `/api/contact`                                                                                                | LD-05, `DEC-RL-011`   |
| **LDD-11** | **Kein Gated-Download-Lead** — weder Gate noch Asset-ID noch Entitlement                                                                                                     | `DEC-RL-014`, Gate 10 |
| **LDD-12** | **`consent: true` ohne Nutzer-Checkbox** in der Praxis-Bestellvariante                                                                                                       | LD-12                 |

---

## 7. Modification Rules

**M-01 — Das Schema ist die Wahrheit.** Ein Feld existiert im Datensatz, weil es im Schema steht.
Erweiterungen laufen über AP22, nicht über ein Formular.

**M-02 — Neue Journey ⇒ neuer Lead-Typ ⇒ Schemaentscheidung zuerst.** Erst Typ und Felder festlegen,
dann Endpunkt und Formular. Nicht umgekehrt.

**M-03 — Journey-Kontext niemals in Freitext einkomponieren.** Wer Herkunft, Panel, Produkt oder Menge
braucht, bekommt ein Feld — keine Prosa-Zeile in `message`.

**M-04 — Consent-Felder sind einzeln zu entscheiden.** Datenschutzbestätigung, Marketing-Consent und
Tracking-Consent werden nie zusammengelegt oder voneinander abgeleitet.

**M-05 — Vor jeder Erweiterung um ein personenbezogenes Feld** ist LD-07 zu beantworten: Welche Journey
braucht es, wofür, und wie lange? Ohne Antwort kein Feld.

**M-06 — Migrationen sind rückwärtskompatibel zu planen**, weil ein Rollback des Anwendungsimages nicht
zwingend das Schema zurücknimmt. _(AP28 PT28.4.3/.7)_

---

## 8. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an `server/server.js`, `src/api/**`, den Formular-Hooks
und -Komponenten, der künftigen Persistenzschicht, dem Worker, dem CRM-Adapter oder an
`docker-compose.yml` (sobald Worker/Storage hinzukommen):

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt (mindestens **AP22**)
4. **`building-docs/LEAD-DATA-CONTRACT.md`** (dieses Dokument)
5. `building-docs/BACKEND-API-CONTRACT.md`
6. `building-docs/CRM-INTEGRATION.md` — sobald CRM-Mapping oder -Zustellung berührt ist
7. `building-docs/LEAD-DELIVERY-CONTRACT.md` — sobald Queue, Mail oder Retry berührt ist
8. `building-docs/CONSENT-CONTRACT.md` — wo Consent-Evidence berührt ist
9. `building-docs/I18N-CONTRACT.md` — für Systemmails und nutzersichtbare Abläufe
10. `building-docs/state/AP-STATE.md`
11. die aktuellen Quell- und Testdateien aus §3
12. `git diff -- <Datei>` **vor** der Änderung

---

## 9. Required Tests / Guards

Kein Test darf ein echtes CRM oder einen echten Mailversand auslösen.

| #          | Prüfung                                        | Erwartung                                                                                               |
| ---------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **LD-T1**  | Datensatz existiert **vor** dem Zustellversuch | Providerausfall lässt den Datensatz unversehrt                                                          |
| **LD-T2**  | Providerfehler verliert keinen Lead            | nach simuliertem Ausfall ist der Datensatz auffindbar und wiederholbar                                  |
| **LD-T3**  | Unbekanntes Feld wird nicht gespeichert        | Schema-fremdes Feld verworfen oder abgelehnt (API-03)                                                   |
| **LD-T4**  | Pflichtfeld fehlt                              | Ablehnung, kein Teildatensatz                                                                           |
| **LD-T5**  | Normalisierung greift                          | getrimmte, normalisierte Werte gespeichert                                                              |
| **LD-T6**  | Lead-Typ ist gesetzt und geschlossen           | jeder Datensatz trägt genau einen gültigen Typ                                                          |
| **LD-T7**  | Consent-Evidence vollständig                   | Zeitpunkt, Version, Umfang vorhanden, wo gefordert                                                      |
| **LD-T8**  | Marketing-Consent unabhängig                   | Absendung ohne Marketing-Häkchen erzeugt keinen Marketing-Consent                                       |
| **LD-T9**  | Sprache gespeichert                            | aus dem URL-Präfix, nicht aus Browsereinstellungen                                                      |
| **LD-T10** | Kontext strukturiert                           | Herkunft/Panel/Produkt in Feldern, nicht im Freitext                                                    |
| **LD-T11** | Keine Secrets, keine Rohfehler                 | Fehlerklassifikation statt Providerkörper                                                               |
| **LD-T12** | Löschung/Auskunft                              | Datensatz per `lead_id` auffindbar, ausgebbar, löschbar inkl. Folgeeinträgen                            |
| **LD-T13** | Je Journey ein Ende-zu-Ende-Fall               | `general_inquiry`, `support`, `consumer_order`, `roi_report`, `epigenetics_inquiry`, `content_download` |

_(AP27 PT27.2.4, PT27.3)_

### 9.1 Zuordnung der PT02.4-Zielinvarianten

Die Aufgabenstellung von PT02.4 nennt Invarianten als `LEAD-xx`. Die Lead-/Backend-Domäne führt bereits
vier kanonische ID-Systematiken (`LD-`, `API-`, `LDV-`, `CRM-`); es wird **keine parallele** hinzugefügt.
Die Zuordnung ist:

| LEAD        | Inhalt                                                      | hier / Nachbarvertrag                           |
| ----------- | ----------------------------------------------------------- | ----------------------------------------------- |
| **LEAD-01** | stabile interne Lead-ID                                     | LD-04 · LD-T1                                   |
| **LEAD-02** | Persistenz vor endgültiger Erfolgsbestätigung               | LD-01 · API-01 · LDV-02 · LD-T1                 |
| **LEAD-03** | CRM-Ausfall verliert keinen Lead                            | LD-02, LD-03 · LDV-01 · LD-T2                   |
| **LEAD-04** | Mailausfall verliert keinen Lead                            | LD-02 · LDV-01, LDV-18 · LD-T2                  |
| **LEAD-05** | externe Side Effects sind retryfähig                        | `LEAD-DELIVERY-CONTRACT.md` LDV-05–LDV-07       |
| **LEAD-06** | Wiederholung erzeugt keine unkontrollierten Duplikate       | `BACKEND-API-CONTRACT.md` §5.3 · LDV-08/LDV-11  |
| **LEAD-07** | permanente Fehler sichtbar und wiederaufnehmbar             | LDV-07, LDV-12 · LD-16                          |
| **LEAD-08** | jeder Lead hat einen Journey-Typ                            | LD-05 · §5.1 · LD-T6                            |
| **LEAD-09** | Epigenetik mit eigenem Typ/CRM-Routing                      | §5.1 · `CRM-INTEGRATION.md` §5.2 (`DEC-RL-011`) |
| **LEAD-10** | Content Download als eigener gated Typ                      | §5.1 `content_download` · LDV-24 · CA-30–CA-34  |
| **LEAD-11** | Consumer Order unterscheidbar                               | §5.1, §5.2 · `BACKEND-API-CONTRACT.md` §5.1     |
| **LEAD-12** | Server validiert autoritativ                                | `BACKEND-API-CONTRACT.md` API-03/API-04         |
| **LEAD-13** | Rate-/Abuse-Schutz je öffentlicher Route                    | `BACKEND-API-CONTRACT.md` API-16/API-17         |
| **LEAD-14** | Analytics-Consent ≠ Marketing-/CRM-Consent                  | LD-12, LD-13 · CRM-13 · LD-T8                   |
| **LEAD-15** | Auffinden, Löschen, Anonymisieren möglich                   | LD-21, LD-22, **LD-29**, **LD-30** · LD-T12     |
| **LEAD-16** | keine unnötigen PII-Payloads in Logs                        | LD-17, LD-18 · LDV-21/LDV-22 · CRM-16           |
| **LEAD-17** | Preview/Staging ohne produktive Side Effects                | LD-24 · API-19 · LDV-16 · CRM-18                |
| **LEAD-18** | Chat ist kein Bestandteil des Zielmodells                   | **LD-31** · `BACKEND-API-CONTRACT.md` API-20    |
| **LEAD-19** | CRM ist nicht die primäre Persistenz                        | LD-03, **LD-27** · CRM-01                       |
| **LEAD-20** | Mail ist nicht die primäre Persistenz                       | LD-03, **LD-27** · LDV-17                       |
| **LEAD-21** | gated Asset Delivery ist idempotent                         | LDV-08, LDV-11, LDV-24 · §5.3 Ebene C           |
| **LEAD-22** | Lead und Downstream-Work fallen nicht dauerhaft auseinander | `LEAD-DELIVERY-CONTRACT.md` LDV-03 (Outbox)     |

Ergänzend aus PT02.4: **Deduplication ≠ Idempotenz** (LD-28), **Systemgrenzen inkl. Browser-Speicher**
(LD-27), **Retention als `TBD_OWNER_LEGAL`** (LD-29), **Anbieterneutralität von Speicher und Queue**
(LD-32/LD-33), **Transport-/Expositionsregeln** (`BACKEND-API-CONTRACT.md` API-21–API-23).

---

## 10. Forbidden Regressions

- ❌ **Einen Lead extern zustellen, bevor er dauerhaft gespeichert ist**
- ❌ CRM, Postfach oder Mailprovider als einzige Kopie eines Leads behandeln
- ❌ Journey-Kontext als Prosa in einem Nachrichtenfeld transportieren
- ❌ Empfänger- oder Routingentscheidungen an einem vom Client gelieferten Freitext festmachen
- ❌ Tracking-Consent aus einem Lead ableiten oder als Lead-Feld führen
- ❌ Marketing-Consent aus einer Absendung, Bestellung oder einem Download ableiten
- ❌ Consent ohne Zeitpunkt, Version und Umfang speichern, wo Evidence gefordert ist
- ❌ Unbekannte Frontend-Felder stillschweigend persistieren
- ❌ Rohe Provider-Antwortkörper oder Secrets im Datensatz oder in Logs ablegen
- ❌ Personenbezogene Daten ohne Aufbewahrungsregel speichern
- ❌ Kundendaten als Fixture ins Repository legen
- ❌ In Preview/Staging produktive Datensätze erzeugen
- ❌ Lead-Typ-Bezeichner außerhalb von AP22 festlegen
- ❌ Ein Feld als Gesundheitsdatum klassifizieren oder entklassifizieren ohne Beleg

**Aus AP02 PT02.4 zusätzlich:**

- ❌ **Mail-only als Zielmodell behandeln** oder eine Erfolgsantwort an einen Providererfolg binden (`DEC-RL-009`)
- ❌ CRM, Postfach oder Browser-Speicher als Lead-Persistenz verwenden (LD-27)
- ❌ Deduplication als Ersatz für technische Idempotenz behandeln — oder umgekehrt (LD-28)
- ❌ Fachlich getrennte Anfragen durch eine globale Dedup-Regel zusammenwerfen (LD-28)
- ❌ Duplikaterkennung ausschließlich dem CRM überlassen (LD-28)
- ❌ Eine Aufbewahrungsfrist erfinden, statt sie als `TBD_OWNER_LEGAL` auszuweisen (LD-29)
- ❌ Unbegrenzte Aufbewahrung als stillschweigenden Default akzeptieren (LD-29)
- ❌ Löschen, ohne offene Jobs, Dead-Letter-Einträge und Sicherungen zu betrachten (LD-30)
- ❌ **Einen Chat-Lead-Typ, Chat-Source-Kontext oder Chat-Adapter in das Zielmodell aufnehmen** (LD-31)
- ❌ Eine Datenbank-, Queue- oder Monitoring-Anbieterentscheidung ohne kanonische Grundlage treffen (LD-32)
- ❌ Eine offene Anbieterfrage als Begründung dafür verwenden, Mail-only beizubehalten (LD-33)

---

## 11. AP Ownership / Lifecycle

| Phase                    | AP                               | Ergebnis                                                               |
| ------------------------ | -------------------------------- | ---------------------------------------------------------------------- |
| Zielbild                 | **AP02 PT02.4**                  | Lead-Plattform als Architekturentscheidung                             |
| Journeys                 | **AP03 PT03.3**                  | welche Strecken es überhaupt gibt                                      |
| **Datenmodell/Eigentum** | **AP22 PT22.2**                  | Typen, Felder, Consent-Evidence, Statusmodell, Dedup, Retention, Audit |
| Standard                 | **AP22 PT22.1**                  | gemeinsamer Formular-/API-Standard                                     |
| Migration                | **AP22 PT22.5**                  | bestehende vier Journeys überführen                                    |
| Neue Journeys            | **AP15 PT15.6**, **AP19 PT19.3** | Epigenetik-Inquiry, `content_download`                                 |
| Consumer                 | **AP21 PT21.5**                  | Bestellstrecke mit Persistenz und Idempotenz                           |
| Datenschutzfunktionen    | **AP22 PT22.8**                  | Retention, Auskunft, Löschung, anonymisierte Testleads                 |
| Speicherbetrieb          | **AP28 PT28.5**                  | Persistenz separat, backupfähig, Restore geprüft                       |
| Absicherung              | **AP27 PT27.2**                  | Integrationstests — Voraussetzung für Gate 3                           |
| Betrieb                  | **AP32 PT32.1.4**                | Formularfehlerquote beobachten                                         |
| Dokumentation            | **AP33 PT33.1.7**                | Lead Platform in der Entwicklerdoku                                    |

**Änderungen an diesem Vertrag** verantwortet AP22. Decision Locks werden hier nie geändert.

---

# TEIL B — AP22 PT22.1: gemessener Ist-Zustand und gemeinsamer Standard

> Angelegt am 2026-09-09. **Teil A (§1–§11) bleibt unverändert** und beschreibt
> Zweck, Autorität, Zielmodell, Änderungsregeln und Ownership. Teil B ergänzt den
> **gemessenen** Zustand, die Journey-Registry und die konkrete Serialisierung des
> in `BACKEND-API-CONTRACT.md` **API-09** geforderten Envelopes.
>
> **Feldschreibweise:** API-09 nennt `message_key`, `request_id`, `field_errors` und
> hält ausdrücklich fest, dass die **Form** verbindlich ist, nicht die Schreibweise,
> und dass die Serialisierung AP22 PT22.1 entscheidet. Entschieden wurde
> camelCase (`messageKey`, `requestId`, `fieldErrors`) — passend zu den bereits
> ausgelieferten Antwortfeldern `leadId`, `deliveryPending`, `providerConfigured`.
> Eine zweite Schreibweise im selben Antwortkörper wäre die schlechtere Wahl gewesen.

## 12. Die sieben kanonischen Journeys (AP22 PT22.1, gemessen 2026-09-09)

`/api/chat` ist **keine** Journey und steht bewusst nicht in der Registry.

Quelle der Wahrheit: `JOURNEY_REGISTRY` in `server/lead-foundation/constants.js`.
`LEAD_JOURNEYS` und `DEFAULT_JOURNEY_ROUTES` werden daraus **abgeleitet** — vorher
lagen Journey-Liste und CRM-Ziele an zwei Stellen, und eine neue Journey ohne
Route hätte den `CrmRouter`-Konstruktor beim Start zerlegt.

| #   | Journey               | Endpunkt                   | CRM-Ziel         | Zustand                |
| --- | --------------------- | -------------------------- | ---------------- | ---------------------- |
| 1   | `contact`             | `/api/contact`             | `general-sales`  | `ON_FOUNDATION`        |
| 2   | `support`             | `/api/support`             | `support`        | `ON_FOUNDATION`        |
| 3   | `consumer_order`      | `/api/consumer-order`      | `consumer`       | `ON_FOUNDATION`        |
| 4   | `roi_report`          | `/api/roi-report`          | `reports`        | **`LEGACY_MAIL_ONLY`** |
| 5   | `practice_order`      | _(keiner)_                 | `practice-sales` | **`NOT_YET_TYPED`**    |
| 6   | `epigenetics_inquiry` | `/api/epigenetics-inquiry` | `epigenetics`    | `ON_FOUNDATION`        |
| 7   | `content_download`    | `/api/content-download`    | `resources`      | `ON_FOUNDATION`        |

### 12.1 Die beiden offenen Zustände — am Quelltext belegt

**`roi_report` — `LEGACY_MAIL_ONLY`.** `/api/roi-report` ist ein reiner
Mailendpunkt. Im gesamten Handler steht **kein einziger** `createLead`-Aufruf
(gemessen: 0 Treffer). Ein SendGrid-Fehler verliert die Anfrage ersatzlos —
derselbe Befund, den AP21 für `consumer_order` behoben hat. Die Antwortform ist
zusätzlich die alte: `{ success: true }` statt `{ accepted, code, fields }`.

**`practice_order` — `NOT_YET_TYPED`.** Es gibt keinen Endpunkt. Eine
Praxisbestellung läuft durch `/api/contact` und wird dort an einem **Magic
String** erkannt:

```js
// server/contact-lead.js
const SPRAY_ORDER_MARKER = 'Vitamin D3+K2 Spray BESTELLUNG'
const recipient = String(subject.area || '').includes(SPRAY_ORDER_MARKER)
  ? this.sprayRecipient
  : this.recipient
```

Gesetzt wird der Marker von zwei B2B-Seiten (`VitaminD3ImplantologyPage.tsx`,
`VitaminD3SprayPage.tsx`) als Formularfeld `area`. Der Empfänger einer echten
Bestellung hängt damit an einem deutschen Freitext im Client. Ändert jemand die
Zeichenkette oder übersetzt sie, geht die Bestellung stillschweigend an den
allgemeinen Vertrieb.

---

## 13. Capability-Matrix der Shared Lead Foundation

Gemessen an `server/lead-foundation/**`, nicht aus einer früheren Beschreibung
übernommen.

| Fähigkeit          | Ist-Zustand                                                                                           | Ort                |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------ |
| Persistenz         | SQLite via `better-sqlite3`, WAL, `foreign_keys=ON`                                                   | `database.js`      |
| Journey-Modell     | 7 Einträge mit Zustand, Endpunkt, CRM-Ziel                                                            | `constants.js`     |
| Status             | `RECEIVED → PERSISTED → PENDING_HANDOFF → PROCESSING → DELIVERED \| RETRY_PENDING \| FAILED_TERMINAL` | `constants.js`     |
| Outbox             | `lead_outbox` je Kanal, Claim mit Lease (30 s)                                                        | `repository.js`    |
| Retry              | `LeadHandoffWorker`, `maxAttempts` 3, Backoff über `available_at`                                     | `worker.js`        |
| Idempotenz         | `idempotency_key` UNIQUE + `request_hash`; abweichender Rumpf → `IdempotencyConflictError`            | `repository.js`    |
| Audit              | `lead_events` mit Typ, Status, Versuch, Fehlerklasse, Zeit                                            | `repository.js`    |
| Consent-Nachweis   | `processingAccepted`, `acceptedAt` (ISO), `version`, `marketing`                                      | `repository.js`    |
| Kontext            | allowlistete Felder, streng längenbegrenzt                                                            | `normalizeContext` |
| CRM-Adapter/Router | `CrmRouter` je Journey; ohne Adapter ehrlich `NO_PROVIDER_CONFIGURED`                                 | `crm.js`           |
| Worker             | `processNext()`, ausgelöst durch eingehende Requests                                                  | `worker.js`        |
| Runtime            | Node 18.20.8; `LEAD_DB_PATH` in Produktion Pflicht                                                    | `database.js`      |
| **API-Envelope**   | **neu in PT22.1**                                                                                     | `api-contract.js`  |

### 13.1 Fähigkeitslücken der Foundation

| ID       | Lücke                                                                                                                                                                                            | Owner       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `LDC-01` | **Kein Hintergrund-Worker.** Die Outbox dreht nur weiter, wenn ein neuer Request eintrifft. Ein `RETRY_PENDING` bleibt liegen, bis jemand ein Formular abschickt. Gilt für alle sieben Journeys. | PT22.4/AP22 |
| `LDC-02` | **Kein Dead-Letter-Blick.** `FAILED_TERMINAL` ist gespeichert und auditierbar, aber es gibt keine Abfrage, Liste oder Wiedervorlage.                                                             | PT22.4/AP22 |
| `LDC-03` | **Keine Retention.** Nur `support` trägt Retention-Metadaten (90 Tage) — und auch dort gibt es keinen Löschjob.                                                                                  | AP22        |
| `LDC-04` | **Kein echter CRM-Adapter.** Alle Ziele sind heute Team-Mails über SendGrid. Ehrlich als Route abgebildet, aber kein CRM.                                                                        | AP22        |

---

## 14. Die sieben Journeys im Detail

| Journey               | UI/Form                | API-Modul                   | Validierung                      | Persistenz     | Side Effects                        | Idempotenz     | Rate Limit    | Honeypot | Processing-Consent       | Marketing-Consent | Kontext                                               | x10-Systemcopy |
| --------------------- | ---------------------- | --------------------------- | -------------------------------- | -------------- | ----------------------------------- | -------------- | ------------- | -------- | ------------------------ | ----------------- | ----------------------------------------------------- | -------------- |
| `contact`             | `useContactForm`       | `api/contact.ts`            | `ContactValidationError`         | ja             | Team-Mail                           | Key Pflicht    | `formLimiter` | ja       | ja                       | ja                | locale/source/journey/section/campaign                | ja             |
| `support`             | `useSupportForm`       | `api/support.ts`            | `SupportValidationError`         | ja             | Team-+Bestätigungsmail, Attachments | Key Pflicht    | `formLimiter` | ja       | ja                       | **nein**          | + `caseDir`, `attachments`, `retention`               | ja             |
| `consumer_order`      | `useConsumerOrderForm` | `api/consumerOrder.ts`      | `ConsumerOrderValidationError`   | ja             | Team-+Bestätigungsmail              | Key Pflicht    | `formLimiter` | ja       | ja                       | ja                | + `reference`, `productId`, `variant`, `quantity`     | ja             |
| `roi_report`          | Inline im ROI-Rechner  | _(keins)_                   | inline, ad hoc                   | **nein**       | Mail + PDF                          | **keine**      | `formLimiter` | ja       | `consent !== true` → 400 | **nein**          | source/journey/section                                | Mail x10       |
| `practice_order`      | B2B-Produktseiten      | _(keins)_                   | über `contact`                   | über `contact` | Mail an Sonderempfänger             | über `contact` | `formLimiter` | ja       | über `contact`           | über `contact`    | **als Freitext in `area`**                            | über `contact` |
| `epigenetics_inquiry` | eigenes Formular       | `api/epigeneticsInquiry.ts` | `InquiryValidationError`         | ja             | Team-Mail                           | Key Pflicht    | `formLimiter` | ja       | ja                       | ja                | + `panel`, `focus`                                    | ja             |
| `content_download`    | Resource Center        | `api/contentDownload.ts`    | `ContentDownloadValidationError` | ja             | Mail + Entitlement                  | Key Pflicht    | `formLimiter` | ja       | ja                       | ja                | + `assetId`, `requestedLanguage`, `deliveredLanguage` | ja             |

### 14.1 Lücken je Journey

| ID       | Journey          | Lücke                                                                                                                                                                                 | Owner       |
| -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `LDC-05` | `roi_report`     | keine Persistenz, keine Idempotenz, keine Outbox, altes Antwortformat                                                                                                                 | **PT22.2**  |
| `LDC-06` | `practice_order` | keine eigene Journey, Empfänger hängt am Magic String im Client                                                                                                                       | **PT22.2**  |
| `LDC-07` | `support`        | kein Marketing-Consent-Feld. Bestand, kein Versehen — eine Supportanfrage fragt bewusst keine Werbeeinwilligung ab. Wird hier benannt statt stillschweigend zu gelten.                | Datenschutz |
| `LDC-08` | alle             | Die Zuordnung Fehlercode → Anzeigetext liegt in **fünf** Clients dupliziert. Der `messageKey` aus PT22.1 löst das erst, wenn die Clients ihn benutzen.                                | PT22.3      |
| `LDC-10` | alle             | `requestId` wird erzeugt und ausgeliefert, aber nicht am Lead persistiert — die von `BACKEND-API-CONTRACT.md` API-12 geforderte Korrelation zu `lead_id` und Zustell-Jobs fehlt noch. | PT22.2      |

---

## 15. Der gemeinsame API-Vertrag (Serialisierung zu API-09)

### 15.1 Anfrage

Jede Journey-Anfrage ist `POST <endpoint>` mit `Content-Type: application/json`.

| Bestandteil                                   | Regel                                                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Idempotency-Key` (Header)                    | Pflicht bei jeder schreibenden Journey. Stabil pro Formularinstanz, unverändert über Wiederholungen.         |
| `locale`                                      | eine der zehn unterstützten; sonst `VALIDATION_FAILED` mit Feld `locale`.                                    |
| `processingConsent`                           | `true` erforderlich. `consent: true` bleibt als Altfeld akzeptiert.                                          |
| `consentAcceptedAt`                           | ISO-Zeitstempel des Klicks. Fehlt oder unparsbar → `INVALID_CONSENT_EVIDENCE`.                               |
| `marketingConsent`                            | optional, `true`/`false`. Eine Ablehnung blockiert **nichts**.                                               |
| `source` / `campaign` / `journey` / `section` | Attribution, serverseitig **allowlistet**. Ein nicht erlaubter Wert wird auf leer gesetzt, nicht übernommen. |
| `_hp`                                         | Honeypot. Gefüllt → 200 ohne Persistenz und ohne Zustellung.                                                 |
| journeyspezifische Nutzlast                   | serverseitig allowlistet (Produkt, Variante, Menge, Asset-ID, Panel …).                                      |

**Die Servervalidierung ist autoritativ.** Clientseitige Prüfungen sind
Bedienkomfort. Kein Client-String wird als Wahrheit übernommen — insbesondere
kein Produktname, kein Empfänger und kein Preis.

### 15.2 Antwort

Aufgebaut von `successEnvelope()` / `errorEnvelope()` in
`server/lead-foundation/api-contract.js`.

```jsonc
// Erfolg — 202 Accepted
{
  "success": true,
  "requestId": "req_9f1c…", // je Anfrage neu, im Log wiederfindbar
  "journey": "consumer_order",
  "state": "PENDING_HANDOFF", // ECHTER Lead-Zustand, nicht "ok"
  "leadId": "…", // optional
  "reference": "PDX-1234ABCD", // optional, fachliche Vorgangsnummer
  "deliveryPending": true, // optional
  "providerConfigured": false, // optional — FEHLT, wenn unbekannt
}
```

```jsonc
// Fehler — Status aus dem Katalog
{
  "success": false,
  "requestId": "req_9f1c…",
  "journey": "consumer_order",
  "state": "REJECTED",
  "code": "VALIDATION_FAILED",
  "retryable": false,
  "messageKey": "lead.error.validation_failed",
  "fieldErrors": ["email"], // optional, NUR Feldnamen
}
```

**`success: true` heißt ausschließlich „dauerhaft gespeichert".** Es heißt nicht
„zugestellt" und nicht „gekauft". Ob ein Provider erreicht wurde, sagt
`providerConfigured` — und wenn das unbekannt ist, **fehlt das Feld**, statt
Erfolg zu suggerieren.

### 15.3 Fehlerkatalog

| Code                                                       | HTTP | `retryable` |
| ---------------------------------------------------------- | ---- | ----------- |
| `VALIDATION_FAILED`                                        | 400  | nein        |
| `PROCESSING_CONSENT_REQUIRED`                              | 400  | nein        |
| `INVALID_CONSENT_EVIDENCE`                                 | 400  | nein        |
| `IDEMPOTENCY_KEY_REQUIRED`                                 | 400  | nein        |
| `UNKNOWN_PRODUCT` / `UNKNOWN_VARIANT` / `INVALID_QUANTITY` | 400  | nein        |
| `UNKNOWN_ASSET` / `ATTACHMENT_INVALID`                     | 400  | nein        |
| `IDEMPOTENCY_CONFLICT`                                     | 409  | nein        |
| `RATE_LIMITED`                                             | 429  | **ja**      |
| `JOURNEY_UNAVAILABLE`                                      | 500  | **ja**      |

`retryable` ist eine **Sicherheitsaussage**, keine Höflichkeit: es sagt, ob
dieselbe Anfrage mit demselben Idempotency-Key erneut gesendet werden darf. Bei
`IDEMPOTENCY_CONFLICT` steht der Schlüssel dauerhaft für etwas anderes — ein
erneuter Versuch damit ist sinnlos, nicht bloß unhöflich.

### 15.4 Leckschutz

`errorEnvelope()` **filtert nicht, sondern baut nur auf.** Was nicht ausdrücklich
gesetzt wird, steht auch nicht in der Antwort. Ein unbekannter Code wird zu
`JOURNEY_UNAVAILABLE` — er wird nicht durchgereicht. Gemessen mit
`SENDGRID_401_Unauthorized`, `connect ECONNREFUSED 10.0.0.5:587`,
`SQLITE_CONSTRAINT` und `<script>alert(1)</script>`: keiner erscheint in der
Antwort.

`fieldErrors` folgt **API-09**: je Eintrag `field`, ein stabiler `code` aus dem
Katalog und ein `messageKey`. Ausdrücklich **keine fertige Prosa** (API-10) — die
Anzeige lokalisiert der Client. Feldnamen müssen einem engen Muster genügen
(`/^[a-zA-Z][a-zA-Z0-9_.[\]]{0,63}$/`), ein erfundener Code fällt auf
`VALIDATION_FAILED` zurück. Werte, Meldungstexte und Pfadangaben fallen heraus —
eine Fehlerantwort spiegelt nie die Eingabe zurück.

`logSafeError()` liefert genau drei Felder: `journey`, `errorClass`,
`requestId`. Kein Body, keine Header, keine Mailadresse, kein Token, kein
Stacktrace.

### 15.5 Zustands- und Anzeigesemantik

| Zustand                          | Bedeutung                                     | Anzeige                                          |
| -------------------------------- | --------------------------------------------- | ------------------------------------------------ |
| `submitting` (Client)            | Anfrage unterwegs                             | Ladezustand, Absenden gesperrt                   |
| `PENDING_HANDOFF` / `PROCESSING` | gespeichert, Zustellung läuft                 | Erfolg — „eingegangen"                           |
| `DELIVERED`                      | gespeichert **und** zugestellt                | Erfolg                                           |
| `RETRY_PENDING`                  | gespeichert, Zustellung wird wiederholt       | Erfolg — nie ein Fehler für die Absenderin       |
| `FAILED_TERMINAL`                | gespeichert, Zustellung endgültig gescheitert | Erfolg mit ehrlichem `providerConfigured: false` |
| `REJECTED`                       | **nichts** gespeichert                        | Fehler                                           |
| `IGNORED`                        | Honeypot, nichts gespeichert                  | Erfolg (still)                                   |

Ein Zustellfehler ist **kein** Fehler der Absenderin. Die Anfrage liegt bereits
in der Outbox; die Oberfläche darf deshalb keinen Fehler zeigen, aber auch
keinen Empfang behaupten, den es nicht gab.

---

## 16. Doppel-Absenden und Idempotenz

Vier Schichten, keine ersetzt eine andere:

1. **In-Flight-Guard im Ref** (nicht im State). Ein per State geführter Guard
   läuft beim synchronen Doppelklick in die Stale Closure und ließ nachweislich
   zwei Requests los.
2. **Gesperrter Absendeknopf** — reine Bedienhilfe, kein Schutz.
3. **`Idempotency-Key` je Formularinstanz**, stabil über Wiederholungen.
4. **Serverseitig `idempotency_key` UNIQUE + `request_hash`**: gleicher Rumpf →
   derselbe Lead; abweichender Rumpf → 409.

Dedup ist **journeyspezifisch**: der Schlüssel gilt je Journey, nicht global.

---

## 17. Consent

Verarbeitung und Marketing sind **getrennte** Einwilligungen mit getrennten
Feldern und getrenntem Nachweis. Jeder Foundation-Slice führt eine eigene
`CONSENT_VERSION` (`<journey>-JJJJ-MM`), damit ein Vertragstext nachträglich
zuordenbar bleibt.

**Analytics-/Marketing-Consent ist an keiner Stelle Voraussetzung für einen
Geschäftsvorgang.** Gemessen: in keinem der fünf Foundation-Slices kommt
`analytics_storage`, `dataLayer`, `gtag(` oder `hasAnalyticsConsent` vor.

**Vor-Einwilligungs-Providerrequests = 0.** Tracking läuft ausschließlich über
eine consent-prüfende, providerneutrale Fassade; ohne Einwilligung entsteht
weder ein dataLayer-Eintrag noch ein Netzwerkaufruf. Kein Buffering, kein
Nachsenden nach späterem Opt-in.

---

## 18. Missbrauchs-Grundlinie

| Maßnahme          | Ist-Zustand                                                                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rate Limit        | `formLimiter`: 5 Anfragen / 15 min / IP, `standardHeaders`, 429 mit `RATE_LIMITED`. **Alle** Journey-Endpunkte liegen dahinter (im Test gegen `server.js` geprüft). |
| Vertrauensgrenze  | `app.set('trust proxy', 1)` — genau ein Proxy-Hop. Ohne Proxy davor wäre `X-Forwarded-For` fälschbar; das steht als Warnung im Quelltext.                           |
| Honeypot          | `_hp` in jedem Slice: stilles 200, keine Persistenz, keine Zustellung.                                                                                              |
| Servervalidierung | autoritativ, mit Längengrenzen auf jedem Textfeld.                                                                                                                  |
| Allowlists        | Produkt/Variante/Menge, Asset-ID, Attachment-MIME + Magic Bytes, Attributionsquellen.                                                                               |
| Datenminimierung  | nur benannte Felder werden persistiert; ein mitgeschickter `to`-Wert landet nirgends.                                                                               |

**Bekannte Grenze:** der Rate Limit ist ein In-Memory-Zähler pro Prozess. Bei
mehreren Instanzen zählt jede für sich. Das ist heute korrekt (eine Instanz) und
wird zu einer echten Lücke, sobald skaliert wird — `LDC-09`, Owner AP28.

---

## 19. Was PT22.1 verändert hat

| Datei                                    | Änderung                                                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `server/lead-foundation/constants.js`    | `JOURNEY_REGISTRY` (7 Einträge mit Zustand), `JOURNEY_FOUNDATION_STATES`; `LEAD_JOURNEYS` daraus abgeleitet                                      |
| `server/lead-foundation/crm.js`          | `DEFAULT_JOURNEY_ROUTES` aus der Registry abgeleitet statt zweitgepflegt                                                                         |
| `server/lead-foundation/api-contract.js` | **neu** — Envelope, Fehlerkatalog, `messageKey`, Feldfehler-Normalisierung, `logSafeError`                                                       |
| `server/lead-foundation/index.js`        | exportiert den API-Vertrag mit                                                                                                                   |
| `server/lead-api-contract.test.js`       | **neu** — 20 task-eigene Tests                                                                                                                   |
| `server/ap21-closure.test.js`            | Journey-Anzahl-Assertion auf Zugehörigkeit zum kanonischen Satz umgestellt (AP22 ergänzt zwei kanonische Journeys; das ist keine AP21-Erfindung) |

| `building-docs/LEAD-DATA-CONTRACT.md` | **konsolidiert, nicht ersetzt**: Teil A (§1–§11) unverändert, überholtes Banner korrigiert, §3.1 als historisch gekennzeichnet, Teil B (§12–§20) ergänzt |

### 19.1 Ein Befund aus der Kontextpflicht (§8)

§8 dieses Vertrags verlangt vor jeder Änderung den Blick in
`BACKEND-API-CONTRACT.md`. Dabei kam **API-09** zum Vorschein: das Fehler-Envelope
ist dort bereits in seiner **Form** festgelegt, und `field_errors` trägt laut
Vertrag je Eintrag `code` **und** `message_key`.

Meine erste Fassung lieferte nur eine Liste von Feldnamen. Das war keine
Schreibweisenfrage, sondern eine echte Abweichung von der vorgeschriebenen Form —
und sie wäre unbemerkt geblieben, hätte ich die Kontextpflicht übergangen. Der
Feldfehler trägt jetzt `field`, `code` und `messageKey`; ein nicht katalogisierter
Code fällt auf `VALIDATION_FAILED` zurück, statt durchzurutschen.

**Offen aus derselben Lesung:** API-12 verlangt, dass die `request_id` zum
`lead_id` und zu den Zustell-Jobs **korreliert**. Heute wird sie erzeugt und
ausgeliefert, aber nicht am Lead persistiert — `LDC-10`, Owner PT22.2.

**Kein Endpunkt wurde umgestellt.** Die sechs bestehenden Handler antworten
unverändert im alten Format. Das ist Absicht: PT22.1 stellt den Vertrag auf,
PT22.2 migriert.

---

## 20. Handoff PT22.2

### PRIMARY WRITE SET

- `server/roi-report.js` **(neu)** — `roi_report` als Journey-Slice nach dem
  Muster von `consumer-order.js`: validieren → Consent → persistieren →
  Outbox → CRM. PDF-Erzeugung und -Versand als **eigener** Side Effect über die
  Outbox, nicht im Request-Pfad.
- `server/practice-order.js` **(neu)** — `practice_order` typisieren.
  `SPRAY_ORDER_MARKER` aus `contact-lead.js` entfernen, Praxis-/Org-Kontext,
  Bestellkontext und Routing-State persistieren.
- `server/server.js` — beide Endpunkte auf die Slices umhängen
  (`/api/roi-report`, neu `/api/practice-order`), Antworten auf das Envelope
  aus `api-contract.js` umstellen.
- `server/lead-foundation/repository.js` — `normalizeContext` um die
  journey-neutralen Felder für Report- und Praxiskontext erweitern (streng
  gebounded, wie `reference`/`productId` in AP21).
- `src/pages/VitaminD3SprayPage.tsx`, `src/pages/VitaminD3ImplantologyPage.tsx` —
  auf die typisierte Journey umstellen; **kein** Freitext-`area` mehr als
  Routing-Signal.
- `src/api/roiReport.ts`, `src/api/practiceOrder.ts` **(neu)**.
- `public/locales/<10>/…` — Systemcopy für beide Journeys x10.
- `server/roi-report.test.js`, `server/practice-order.test.js` **(neu)**.

### PROVEN — DO NOT REDISCOVER

- Die Foundation-Fähigkeiten aus §2 samt der vier Lücken `LDC-01`–`LDC-04`.
- Der Zustand der fünf `ON_FOUNDATION`-Journeys aus §3 — sie sind persistent,
  idempotent, retryfähig, rate-limitiert und consent-getrennt. AP19/AP20/AP21
  haben das je einzeln gemessen; PT22.1 hat es am Quelltext bestätigt.
- Der API-/Fehlervertrag aus §4 einschließlich Leckschutz.
- Die Consent- und Missbrauchsgrundlinie aus §6 und §7.
- Node 18.20.8, `import.meta.dirname` nicht verfügbar; jsdom-Tests scheitern mit
  `ERR_REQUIRE_ESM` (bekannte Baseline, ein Testfile).

### OPEN PT22.2 DELTA

1. `roi_report` persistieren (`LDC-05`).
2. `practice_order` typisieren und den Magic String entfernen (`LDC-06`).
3. Beide auf das gemeinsame Envelope bringen.
4. Systemcopy x10 für beide.
5. **Nicht** in PT22.2: Hintergrund-Worker (`LDC-01`), Dead-Letter-Sicht
   (`LDC-02`), Retention (`LDC-03`), echtes CRM (`LDC-04`), Client-Umstellung
   auf `messageKey` (`LDC-08`), verteilter Rate Limit (`LDC-09`).

### Drift-Signale

Änderungen an `server/lead-foundation/**`, an einem Journey-Slice, an
`server/server.js` oder an den beiden B2B-Produktseiten.

---

## 21. Delta PT22.2 — das konsolidierte Datenmodell (2026-09-09)

### 21.1 Abweichung vom PT22.1-Handoff — benannt, nicht stillschweigend

§20 dieses Vertrags hatte für PT22.2 die **Endpunkt-Migration** (`roi_report`,
`practice_order`) als Write Set vorgeschlagen. Die kanonische Aufgabenstellung
für PT22.2 definiert den Task jedoch als **persistentes Lead-Datenmodell**:
Schema, IDs, Kontext, Consent, Status, Idempotenz, Dedup, Retention, Audit,
Migrationen. Die Aufgabenstellung hat Vorrang.

**Folge:** PT22.2 hat das Modell konsolidiert und die beiden Journeys
schreibfähig gemacht — die Umstellung ihrer Endpunkte (`LDC-05`, `LDC-06`)
rückt nach PT22.3. Das ist eine Verschiebung, keine Erledigung.

### 21.2 Migration 003 — was fehlte und warum

| #   | Befund                                                                                                                                                                             | Behebung                                                                                                                                      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **`RECONCILIATION_REQUIRED` fehlte.** Ein Provider-Timeout landete in `FAILED_TERMINAL`. Das behauptet Wissen, das es nicht gibt: bei `ETIMEDOUT` ist offen, ob die Mail rausging. | Eigener Zustand mit `reconciliation_reason`. Die Outbox bleibt terminal — **kein** automatischer Nachversand, also keine doppelte Zustellung. |
| 2   | **Zwei Namen für einen Wartezustand.**                                                                                                                                             | `QUEUED` ist kanonisch; `PENDING_HANDOFF` bleibt im CHECK erlaubt, wird aber nicht mehr geschrieben. Bestehende Zeilen wurden gehoben.        |
| 3   | **`VALIDATED` fehlte** — der Prüfschritt verschwand zwischen Empfang und Speicherung.                                                                                              | Eigener Zustand plus Ereignis `LEAD_VALIDATED`.                                                                                               |
| 4   | **Vorgangsnummer nur im JSON** der Consumer-Bestellung.                                                                                                                            | Spalte `reference`, `UNIQUE` über alle sieben Journeys, aus dem Kontext gehoben.                                                              |
| 5   | **Kein fachliches Dedup** — es gab nur die Idempotenz über den Schlüssel.                                                                                                          | Spalte `dedup_key` (nur SHA-256, nie die E-Mail) plus journeyeigene Fenster.                                                                  |
| 6   | **Löschfrist nur im JSON** und nur bei Support.                                                                                                                                    | Spalte `retention_delete_after`, indiziert, abfragbar.                                                                                        |
| 7   | **Keine Lebenszyklus-Zeitstempel.**                                                                                                                                                | `validated_at`, `queued_at`, `delivered_at`, `terminal_at` neben dem Ereignisprotokoll.                                                       |

**Der gefährliche Teil der Migration:** SQLite kann eine `CHECK`-Bedingung nicht
per `ALTER TABLE` ändern, ein neuer Statuswert verlangt also einen
Tabellenumbau. Bliebe dabei `foreign_keys` aktiv, würde `DROP TABLE leads` die
Kindzeilen in `lead_outbox`, `lead_events` und `resource_entitlements` per
`ON DELETE CASCADE` **mitlöschen** — genau der Datenverlust, den eine Migration
verhindern soll. `applyMigrations` schaltet die Fremdschlüssel deshalb um den
Lauf herum ab und prüft danach mit `foreign_key_check`, dass keine Referenz
hängen blieb. Die Mutationsprobe belegt, dass dieser Schutz greift.

### 21.3 Datenminimierungs-Matrix — gemessen

Gespeicherte Subjektfelder je Journey, ausgelesen aus einem echten Schreibvorgang:

| Journey               | Felder | Was gespeichert wird                                                                                                            |
| --------------------- | -----: | ------------------------------------------------------------------------------------------------------------------------------- |
| `contact`             |      8 | name, email, company, phone, area, intent, field, message                                                                       |
| `support`             |      8 | name, email, udi, swVersion, issueType, issueTypeLabel, subject, description                                                    |
| `consumer_order`      |     14 | name, email, phone, company, street, postcode, city, country, message, productId, productLabel, variant, quantity, quantityMode |
| `roi_report`          |      3 | name, email, area                                                                                                               |
| `practice_order`      |      5 | name, email, organization, productId, quantity                                                                                  |
| `epigenetics_inquiry` |      4 | name, email, panel, message                                                                                                     |
| `content_download`    |      3 | name, email, assetId                                                                                                            |

Der **Kontext** ist journey-neutral und allowlistet — 20 Felder, alle
längenbegrenzt: `locale`, `source`, `campaign`, `journey`, `section`, `panel`,
`focus`, `originRoute`, `assetId`, `requestedLanguage`, `deliveredLanguage`,
`caseDir`, `attachments`, `retention`, `reference`, `productId`, `variant`,
`quantity`, `reportArea`, `orgType`.

Die beiden neuen Felder sind bewusst **kategorial**: `reportArea` ist der
Fachbereich der ROI-Rechnung, `orgType` die Art der Einrichtung. Weder die
Rechenwerte noch ein Praxisname stehen im Kontext — Zahlen gehören in den
Report-Side-Effect, ein Name ist Kontaktdatum und liegt im Subjekt.

### 21.4 Dedup — journeyspezifisch, ausdrücklich nicht global

| Journey               | Fenster | Felder                                 |
| --------------------- | ------: | -------------------------------------- |
| `contact`             |  10 min | email + message                        |
| `support`             |  10 min | email + udi + subject                  |
| `consumer_order`      |  30 min | email + productId + variant + quantity |
| `roi_report`          |  60 min | email + area                           |
| `practice_order`      |  30 min | email + organization + productId       |
| `epigenetics_inquiry` |  10 min | email + panel                          |
| `content_download`    |    24 h | email + assetId                        |

Der Journey-Name geht **immer** in den Hash ein. Ein globales E-Mail-Dedup wäre
falsch: dieselbe Person darf am selben Tag eine Supportanfrage stellen, ein
Whitepaper laden und eine Bestellung aufgeben. Der Test prüft genau das —
sieben Journeys derselben Adresse erzeugen sieben Vorgänge, und keiner gilt als
Dublette eines anderen.

Es ist eine **Erkennung, keine Sperre**: `findRecentDuplicate()` meldet den
Fund, die Journey entscheidet. Ein hartes `UNIQUE` wäre falsch, weil eine
Wiederholung nach dem Fenster eine legitime neue Anfrage ist.

### 21.5 Aufbewahrung — nur, was entschieden ist

`RETENTION_POLICY_DAYS` enthält genau eine Frist: **90 Tage für `support`**, aus
AP20. Für die übrigen sechs Journeys steht `null`. Das heißt weder „unbegrenzt"
noch „noch nicht implementiert", sondern: **die Entscheidung fehlt**. Eine Frist
zu erfinden wäre eine datenschutzrechtliche Aussage, die dieser Task nicht
treffen darf. Geführt als `LDC-11`, Owner Datenschutz. Die Mutationsprobe
(erfundene 365 Tage für `contact`) lässt den Test fallen.

### 21.6 Nachweise

`npx vitest run server/lead-model.test.js` → **16/16**:

- **Migration mit Altbestand:** Datenbank auf Schema 001+002 mit zwei Leads,
  einer Outbox-Zeile und einem Ereignis; nach dem Öffnen mit 003 sind alle
  Zeilen da, `PENDING_HANDOFF` ist zu `QUEUED` gehoben, die Support-Löschfrist
  aus dem JSON übernommen, die Vorgangsnummer in die Spalte gehoben,
  `foreign_key_check` leer.
- **Wiederholbar:** zweites Öffnen ändert weder Zeilen noch Migrationszähler.
- **Deterministisch:** zwei frische Datenbanken bekommen ein identisches Schema.
- **Laufzeit/Container:** der **echte** `server/server.js` startet als Prozess
  auf einer Altbestand-Datenbank, migriert beim Öffnen, nimmt eine neue Anfrage
  mit 202 an — und der Altbestand liegt unverändert daneben.
- 7/7 Journeys schreibbar, Kontext-Roundtrip, stabile und eindeutige IDs,
  Idempotenz-Replay und -Konflikt, Dedup je Journey samt Fensterablauf,
  Hash-statt-E-Mail, Zustand und Protokoll über einen Neustart.

Ohne Regression: Node-Suiten **226/226**, alle Guards, `typecheck`, ESLint,
Prettier.

**Mutationsproben:** Fremdschlüssel während der Migration nicht abschalten →
Datenverlust wird erkannt · unbekanntes Providerergebnis wieder als
`FAILED_TERMINAL` → 2 Tests fallen · globales E-Mail-Dedup → Test fällt ·
erfundene Retention → Test fällt.

**Acht Testzusicherungen wurden angepasst**, weil sie das _alte_ Verhalten
festhielten: vier Ereignisfolgen (jetzt mit `LEAD_VALIDATED`), drei
Timeout-Zustände (jetzt `RECONCILIATION_REQUIRED`) und zwei Wartezustände
(jetzt `QUEUED`). Die Substanz blieb in allen Fällen erhalten — insbesondere,
dass ein unbekanntes Ergebnis **nicht** automatisch nachgesendet wird.

### 21.7 Offen aus PT22.2

| ID       | Sachverhalt                                                                                                                                                                                     | Owner               |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `LDC-11` | Für sechs von sieben Journeys ist **keine** Aufbewahrungsfrist entschieden. Die Spalte ist da und abfragbar, der Wert fehlt.                                                                    | Datenschutz         |
| `LDC-12` | `RECONCILIATION_REQUIRED` ist jetzt sichtbar und über `findReconciliationRequired()` auffindbar — es gibt aber noch **keine Oberfläche und kein Werkzeug**, um einen solchen Vorgang zu klären. | AP22 (mit `LDC-02`) |
| `LDC-13` | `findRecentDuplicate()` existiert, wird aber von **keiner** Journey aufgerufen. Das Modell kann Dubletten erkennen; die Journeys nutzen es noch nicht.                                          | PT22.3              |

### 21.8 Handoff PT22.3

**PRIMARY WRITE SET**

- `server/roi-report.js` **(neu)** und `server/practice-order.js` **(neu)** —
  die beiden Journeys auf die Foundation heben (`LDC-05`, `LDC-06`). Das Modell
  trägt sie bereits: Registry-Eintrag, CRM-Ziel, Dedup-Regel, Kontextfelder
  (`reportArea`, `orgType`) und Subjektform sind vorhanden und getestet.
- `server/server.js` — beide Endpunkte auf die Slices umhängen, Antworten auf
  das Envelope aus `api-contract.js` (`LDC-08`), `requestId` am Lead
  persistieren (`LDC-10`).
- `SPRAY_ORDER_MARKER` aus `contact-lead.js` entfernen; die beiden B2B-Seiten
  auf die typisierte Journey umstellen.
- `findRecentDuplicate()` in den Journeys verdrahten (`LDC-13`).
- Systemcopy x10 für beide neuen Journeys.

**PROVEN — DO NOT REDISCOVER**

- Das Schema trägt 7/7: Migration 003 ist deterministisch, wiederholbar,
  verlustfrei und containerkompatibel (§21.6).
- Statusmodell, Dedup-Regeln, Retention-Politik und Kontextfelder (§21.2–§21.5).
- Die fünf `ON_FOUNDATION`-Journeys aus §14 — unverändert grün.
- Der API-/Fehlervertrag aus §15 einschließlich Leckschutz.

**Drift-Signale:** Änderungen an `server/lead-foundation/**`, an einem
Journey-Slice oder an `docker-compose.yml` (Volume/`LEAD_DB_PATH`).

---

## 22. Delta PT22.3 — die zentrale CRM-Zustellgrenze (2026-09-09)

### 22.1 Abweichung vom PT22.2-Handoff — wieder benannt

§21.8 hatte für PT22.3 die Endpunkt-Migration vorgeschlagen; die kanonische
Aufgabenstellung definiert PT22.3 als **CRM-Handoff**. Die Aufgabenstellung hat
Vorrang. `LDC-05`/`LDC-06` (roi_report, practice_order) rücken damit nach
PT22.4. Das ist zum zweiten Mal eine Verschiebung, keine Erledigung — und sie
steht hier, damit niemand die beiden Journeys für migriert hält.

### 22.2 Zwei Befunde, beide nachgemessen

**Befund 1 — der Trockenlauf galt als Zustellung.** Die Preview-Instanz ersetzte
`sgMail.send` durch einen Stub, der `202` zurückgab. Der Adapter sah damit
Erfolg, meldete `DELIVERED`, und der Lead bekam einen `delivered_at`-Zeitstempel.
Nachgestellt und protokolliert:

```
[DRY_RUN] email suppressed → to=team@x.de subject="[DE] Neue Kontaktanfrage von Dr. Ada Beispiel"
Lead-Status nach DRY_RUN: DELIVERED | errorClass: null | deliveredAt: 2026-09-09T…
```

Ein Datensatz, der behauptet, die Mail sei raus, obwohl nichts das Haus
verlassen hat. Das verletzt die harte Regel „`DRY_RUN` ist niemals echter
Delivery-Erfolg" unmittelbar.

Dieselbe Zeile schrieb außerdem **Empfänger und Betreff** ins Log. Ein Betreff
enthält hier regelmäßig den vollen Namen der Absenderin, ein Support-Betreff ihr
Anliegen — beides PII.

**Befund 2 — kein ausdrücklicher Timeout.** In keinem der fünf Slices und an
keiner Stelle der Foundation stand ein Wert. Ein nicht antwortender Provider
hält den Worker so lange, wie sein Client es zulässt.

### 22.3 Die Grenze

`server/lead-foundation/crm-delivery.js` (neu) ist der **einzige** Weg zu einem
Provider. Vorher lag dasselbe an drei Stellen: die Fehlerklassifikation im
Worker, die Adapter verstreut in drei Journey-Slices, der Preview-Schalter als
globaler Monkey-Patch in `server.js`.

| Bestandteil                      | Verhalten                                                                                                                                                                                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `withDeliveryGuards(adapter, …)` | Legt DRY_RUN, Timeout und Klassifikation um jeden Adapter. **DRY_RUN wird geprüft, bevor der Adapter aufgerufen wird** — in einer Preview-Umgebung darf kein Provider kontaktiert werden, auch nicht durch einen Adapter mit eigenem Transport. |
| `classifyProviderError()`        | Übersetzt einen geworfenen Fehler in genau eine Klasse.                                                                                                                                                                                         |
| `deliveryKeyFor()`               | `<leadId>:<channel>` — stabil über alle Wiederholungen desselben Vorgangs.                                                                                                                                                                      |
| `crmLogFields()`                 | Baut die Logfelder auf, statt zu filtern: nur `leadId`, `journey`, `target`, `attempt`, `status`, `errorClass`, `deliveryChannel` existieren in der Ausgabe.                                                                                    |
| `CrmRouter`                      | Wählt das Ziel **ausschließlich** aus der Journey des gespeicherten Leads und reicht jeden Adapter durch die Grenze.                                                                                                                            |

### 22.4 Die sechs Zustellklassen

| Klasse                   | Bedeutung                    | Lead-Zustand                                  | Automatischer Retry |
| ------------------------ | ---------------------------- | --------------------------------------------- | ------------------- |
| `DELIVERED`              | echter, bestätigter Erfolg   | `DELIVERED` + `delivered_at`                  | —                   |
| `RETRYABLE_ERROR`        | sicher **nicht** angekommen  | `RETRY_PENDING` → terminal nach `maxAttempts` | **ja**              |
| `TERMINAL_ERROR`         | endgültig gescheitert        | `FAILED_TERMINAL`                             | nein                |
| `NO_PROVIDER_CONFIGURED` | kein Adapter für dieses Ziel | `FAILED_TERMINAL`, `errorClass` sagt es       | nein                |
| `DRY_RUN`                | bewusst nicht zugestellt     | `FAILED_TERMINAL`, `errorClass = DRY_RUN`     | nein                |
| `UNKNOWN_RESULT`         | **vielleicht** angekommen    | `RECONCILIATION_REQUIRED` (PT22.2)            | **nein**            |

Die Unterscheidung zwischen `RETRYABLE_ERROR` und `UNKNOWN_RESULT` ist keine
Feinheit: beim ersten ist gesichert, dass nichts ankam, beim zweiten nicht. Ein
automatischer zweiter Versuch würde dort eine **zweite Mail** beim Empfänger
erzeugen. `ETIMEDOUT`, `ECONNRESET`, `EPIPE` und `ECONNABORTED` sind deshalb
`UNKNOWN_RESULT` — es sei denn, der Adapter markiert den Fehler ausdrücklich als
`retryable`.

Ein Adapter, der etwas Unbekanntes meldet, gilt **nicht** als erfolgreich,
sondern als `TERMINAL_ERROR` mit `UNCLASSIFIED_PROVIDER_RESULT`.

### 22.5 Routing 7/7 — ohne freie Zielwahl

Alle sieben Journeys lösen auf ein **eigenes** Ziel auf; die sieben Ziele sind
verschieden, es gibt also kein stilles Multiplexing. Das Ziel kommt
ausschließlich aus `lead.journey`. Ein mitgeschicktes `target`, `crmTarget` oder
`to` wird ignoriert — geprüft mit genau diesen Feldern. Ein Adapter für ein
Ziel, das keine Journey ansteuert, wird beim Konstruieren **abgelehnt**, statt
als stiller Nebenweg zu existieren.

**Der Gegensatz dazu steht noch im Repository:** der Praxisbestellpfad
entscheidet über den Mailempfänger anhand eines deutschen Freitextes im
Formularfeld `area` (`SPRAY_ORDER_MARKER`). Das ist genau die freie Zielwahl,
die der Router verbietet — und es ist der Grund, warum `LDC-06` in PT22.4
gehört.

### 22.6 Adapterabdeckung — der ehrliche Stand

`router.describeTargets()` gemessen:

| Journey               | Ziel             | Adapter zur Laufzeit                    |
| --------------------- | ---------------- | --------------------------------------- |
| `contact`             | `general-sales`  | ja (SendGrid-Team-Mail)                 |
| `support`             | `support`        | ja (Team + Bestätigung + Anhänge)       |
| `consumer_order`      | `consumer`       | ja (Team + Bestätigung)                 |
| `epigenetics_inquiry` | `epigenetics`    | **nein**                                |
| `content_download`    | `resources`      | **nein**                                |
| `roi_report`          | `reports`        | **nein** (Journey noch nicht migriert)  |
| `practice_order`      | `practice-sales` | **nein** (Journey noch nicht typisiert) |

**3 von 7 Zielen haben einen Adapter.** Die übrigen vier melden ehrlich
`NO_PROVIDER_CONFIGURED` — kein Fake-Erfolg, aber auch keine Zustellung.
`epigenetics_inquiry` und `content_download` konstruieren `new CrmRouter()`
ganz ohne Adapter; ihre Anfragen werden gespeichert und danach nie zugestellt.
Das ist `LDC-14` und war vorher nirgends benannt.

### 22.7 Geheimnisse und Protokoll

Der Quelltext der Grenze enthält **keinen** SendGrid-Schlüssel und **keine**
Mailadresse (im Test gegen alle drei Dateien geprüft). Schlüssel kommen
ausschließlich aus der Umgebung; ein Ziel ohne konfigurierte Variablen bekommt
keinen Adapter statt eines halben.

Ein echter Zustellversuch wurde protokolliert und der Logstrom durchsucht:
weder Mailadresse noch Name noch Nachrichtentext erscheinen. Eine unbekannte
Journey oder ein fremdes Ziel werden zu `unknown`, statt in den Log gespiegelt
zu werden.

### 22.8 Provider-Idempotenz

SendGrid bietet **keine** Idempotenz für `mail/send` — es gibt keinen
Idempotency-Key in dieser API. Der stabile `deliveryKey` ist deshalb heute
**kein** Provider-Idempotenzschlüssel, sondern zweierlei: die Handhabe für die
manuelle Klärung eines `UNKNOWN_RESULT` und die vorbereitete Übergabe für einen
Provider, der so etwas anbietet. Die Sicherheit gegen Doppelzustellung kommt
nicht vom Provider, sondern daraus, dass ein unbekanntes Ergebnis **nicht**
automatisch wiederholt wird.

### 22.9 Nachweise

`npx vitest run server/crm-handoff.test.js` → **21/21**: 7/7 Routing mit sieben
verschiedenen Zielen · Ziel niemals aus dem Request · Adapter für unbekanntes
Ziel abgelehnt · Erfolg nur bei echtem Erfolg · **DRY_RUN ruft den Provider
nicht auf und ist nie eine Zustellung** · DRY_RUN wird auch dann aus der
Umgebung gelesen, wenn niemand ihn durchreicht · `NO_PROVIDER_CONFIGURED`
ehrlich · unbekanntes Adapterergebnis terminal · Timeout bricht ab und wird
`UNKNOWN_RESULT` · Timeout landet in `RECONCILIATION_REQUIRED` **ohne** zweiten
Versuch · Klassifikation wiederholbar/terminal/unbekannt · echter Retry stellt
danach zu · stabiler Zustellschlüssel über Wiederholungen · Logfelder ohne PII,
ohne Schlüssel, ohne Body · keine Geheimnisse im Quelltext.

Ohne Regression: Node-Suiten **247/247**.

**Mutationsproben:** DRY_RUN ruft den Adapter trotzdem auf → Test fällt · DRY_RUN
als Erfolg werten → Test fällt · Timeout entfernen → 2 Tests laufen in die
Zeitüberschreitung · Log-Allowlist aushebeln → 2 Tests fallen · Router nimmt das
Ziel aus dem Lead-Objekt → Test fällt.

**Eine bestehende Zusicherung angepasst:** `ap21-closure.test.js` prüfte den
Klassennamen des aufgelösten Adapters. Da der Router jeden Adapter jetzt durch
die Grenze reicht, ist der Name der Hülle belanglos — geprüft wird nun das
Verhalten (`NO_PROVIDER_CONFIGURED`, niemals `DELIVERED`). Das ist die stärkere
Aussage.

### 22.10 Offen aus PT22.3

| ID       | Sachverhalt                                                                                                                                                                                                                                                                                             | Owner  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `LDC-14` | **4 von 7 Zielen haben keinen Adapter.** `epigenetics_inquiry` und `content_download` speichern ihre Anfragen und stellen sie nie zu; `roi_report` und `practice_order` sind noch nicht migriert. Ehrlich als `NO_PROVIDER_CONFIGURED` gemeldet, aber die Anfragen erreichen niemanden über diesen Weg. | AP22   |
| `LDC-15` | Der `deliveryKey` ist **kein** Provider-Idempotenzschlüssel — SendGrid bietet keinen. Der Schutz gegen Doppelzustellung beruht darauf, dass `UNKNOWN_RESULT` nicht wiederholt wird. Ein CRM mit echter Idempotenz würde das verbessern.                                                                 | AP22   |
| `LDC-16` | Der DRY_RUN-Stub auf `sgMail.send` bleibt als Netz für die Legacy-Mailpfade (`roi_report`), die noch nicht über die Outbox laufen. Er entfällt, sobald diese migriert sind.                                                                                                                             | PT22.4 |

### 22.11 Handoff PT22.4

**PRIMARY WRITE SET**

- `server/roi-report.js` **(neu)**, `server/practice-order.js` **(neu)** —
  `LDC-05`, `LDC-06`. Registry, CRM-Ziel, Dedup-Regel, Kontextfelder und
  Zustellgrenze stehen bereits; die Slices konsumieren sie.
- CRM-Adapter für `epigenetics` und `resources` (`LDC-14`) oder eine
  ausdrückliche Entscheidung, dass diese Journeys keinen CRM-Weg haben sollen.
- `SPRAY_ORDER_MARKER` aus `contact-lead.js` entfernen; die beiden B2B-Seiten
  auf die typisierte Journey umstellen — damit endet die freie Zielwahl.
- Hintergrund-Worker (`LDC-01`) und Dead-Letter-Sicht (`LDC-02`,
  `findReconciliationRequired()` ist da, ein Werkzeug fehlt).

**PROVEN — DO NOT REDISCOVER**

- Die Zustellgrenze aus §22.3–§22.5: eine Stelle, sechs Klassen, Timeout,
  DRY_RUN vor dem Adapter, Routing ohne freie Zielwahl, Logging-Allowlist.
- Das Datenmodell aus §21 — Migration 003 ist deterministisch, wiederholbar,
  verlustfrei und containerkompatibel.
- Der API-/Fehlervertrag aus §15.

**Drift-Signale:** Änderungen an `server/lead-foundation/crm*.js`,
`worker.js`, an einem Journey-Slice oder am DRY_RUN-Schalter in `server.js`.

---

## 23. Delta PT22.4 — Warteschlange, Wiederholung, Endzustand (2026-09-09)

### 23.1 Der schwerste Befund: ein Submit tötete fremde Vorgänge

Fünf Journey-Slices betreiben je einen eigenen Worker gegen **dieselbe**
Outbox, und `claimNext()` war journey-blind. Ein Worker griff sich also auch
fremde Aufträge — löste deren Journey auf, fand in **seinem** Router keinen
Adapter und legte den Vorgang als `FAILED_TERMINAL / NO_PROVIDER_CONFIGURED`
ab.

Nachgestellt:

```
Der Contact-Worker hat gegriffen: support → FAILED_TERMINAL / NO_PROVIDER_CONFIGURED
Support-Lead danach:              FAILED_TERMINAL / NO_PROVIDER_CONFIGURED
```

Ein wartender Support-Vorgang starb, sobald irgendwo eine **Kontaktanfrage**
abgeschickt wurde — obwohl die Support-Strecke einen funktionierenden Adapter
hat. Das ist kein theoretisches Rennen: es passiert bei jedem Formularversand,
solange ein anderer Vorgang in der Warteschlange steht.

**Behebung:** `claimNext({ journeys })` und `LeadHandoffWorker({ journeys })`.
Jeder Slice-Worker gibt seine eigene Journey an und übernimmt nur, was er
zustellen kann. Eine leere Zuständigkeit heißt „nichts übernehmen", eine
unbekannte Journey wird abgelehnt.

### 23.2 Der zweite Befund: die Wiederholung lief nie

Die Outbox drehte sich **nur** beim Absenden eines Formulars — jeder Slice ruft
`processNext()` genau einmal am Ende seines eigenen Submits. Ein Auftrag im
Zustand `RETRY_PENDING` mit einem Abstand in der Zukunft wurde erst beim
nächsten **fremden** Submit wieder angefasst. Nachts also gar nicht. Die
Wiederholung stand auf dem Papier und lief in der Praxis nicht.

**Behebung:** `LeadDispatcher` (`server/lead-foundation/dispatcher.js`), im
Serverstart verdrahtet. Er konsumiert die vorhandenen Services, statt einen
zweiten Zustellweg zu bauen: Router, Zustellgrenze, DRY_RUN, Timeout und
Journey-Zuständigkeit gelten unverändert weiter. Überlappungsfrei, ein
fehlerhaftes Handle reißt die übrigen Journeys nicht mit, der Zeitgeber ist
`unref`'d und hält den Prozess nicht offen. Abschaltbar über
`LEAD_DISPATCHER_DISABLED=1`, Intervall über `LEAD_DISPATCHER_INTERVAL_MS`.

### 23.3 Der dritte Befund: fester Abstand statt Backoff

`retryDelayMs = 1_000`, flach, dreimal dieselbe Sekunde. Bei einem länger
anhaltenden Ausfall wächst der Abstand nicht, und alle wartenden Aufträge
laufen im Gleichtakt auf den sich gerade erholenden Provider zu.

**Behebung:** `retry-policy.js` — exponentiell mit Deckel und Streuung.

| Versuch                 |   1 |   2 |   3 |   4 |    5 | …   | Deckel |
| ----------------------- | --: | --: | --: | --: | ---: | --- | -----: |
| Abstand (ohne Streuung) | 1 s | 2 s | 4 s | 8 s | 16 s | …   |  5 min |

Die Streuung zieht **nur nach unten** ab (bis 20 %), damit die Obergrenze eine
Obergrenze bleibt. Die Zufallsquelle ist einspeisbar, damit ein Test die
Politik ohne Zufall prüfen kann. Eine unsinnige Politik (`maxAttempts: 0`,
`maxDelayMs < baseDelayMs`, `jitterRatio: 1`) wird zurückgewiesen statt benutzt.

### 23.4 Dead Letter und manuelle Wiedervorlage

`findDeadLetters({ journey, limit })` liefert Vorgangsnummer, Journey, Zustand,
Versuche, Fehlerklasse, Klärungsgrund, Zustellschlüssel und Zeitpunkt —
**ohne** Kontaktdaten. Eine Betriebsliste braucht sie nicht, und im Test wird
geprüft, dass weder Adresse noch Name darin vorkommen.

`requeueForDelivery({ leadId, actor, reason })` ist die Wiedervorlage:

- **Person und Grund sind Pflicht.** Eine Wiedervorlage ohne Grund wäre im
  Nachhinein nicht zu beurteilen.
- **Nur aus einem Endzustand.** Einen wartenden oder laufenden Auftrag
  anzustoßen würde eine zweite gleichzeitige Zustellung riskieren.
- **Wiederholungssicher.** Die zweite Freigabe desselben, bereits wartenden
  Auftrags tut nichts und meldet das ehrlich.
- **Die Versuchszahl bleibt stehen.** Sie auf 0 zu setzen würde die Historie
  fälschen; der Vorgang bekommt damit genau einen weiteren Versuch — das ist
  die ehrliche Bedeutung von „manuell freigegeben".
- **Protokolliert** als `MANUAL_REQUEUE` mit `BY:<actor>`.

**Werkzeug:** `npm run lead:ops` (`scripts/lead-ops.mjs`) mit `metrics`,
`dead-letters`, `reconciliation` und `requeue`. Bewusst eine **CLI und kein
HTTP-Endpunkt**: eine Betriebssicht und ein Knopf „nochmal zustellen" brauchen
Autorisierung, und ein neuer ungeschützter Endpunkt wäre zusätzliche
Angriffsfläche für genau die Daten, die AP22 schützt. Wer die CLI ausführen
kann, hat bereits Serverzugriff. Eine autorisierte HTTP-Betriebssicht ist eine
eigene Entscheidung (`LDC-17`).

### 23.5 Kennzahlen

`collectQueueMetrics()` liefert Zählungen je Lead- und Outbox-Zustand,
Warteschlangentiefe, Alter des ältesten fälligen Auftrags, eine Aufschlüsselung
je Journey und die häufigsten Providerfehlerklassen. Reine Zahlen — im Test
wird geprüft, dass keine Kontaktdaten enthalten sind.

### 23.6 Nachweise

`npx vitest run server/lead-queue.test.js` → **27/27**:

- **Zuständigkeit:** ein Worker übernimmt keine fremde Journey · unbekannte
  Journey abgelehnt · leere Zuständigkeit greift nichts · der zuständige Worker
  arbeitet normal.
- **Claim:** derselbe Auftrag wird nicht zweimal ausgegeben · zwei parallele
  Worker arbeiten sechs Aufträge genau einmal ab · eine abgelaufene Lease wird
  zurückgeholt und die Versuchszählung läuft weiter.
- **Wiederholung:** exponentiell mit Deckel, Streuung nur nach unten · unsinnige
  Politik zurückgewiesen · transient → Wiederholung → Zustellung · Budget
  erschöpft → terminal, **Vorgang bleibt vollständig erhalten** · nicht
  wiederholbarer Fehler sofort terminal · unbekanntes Ergebnis → Klärung ohne
  zweiten Versuch.
- **Absturz/Neustart:** Zustand, Versuchszahl und Protokoll überleben; danach
  wird weitergearbeitet, nicht neu begonnen.
- **Dead Letter/Wiedervorlage:** sichtbar ohne Kontaktdaten · Journey-Filter ·
  Freigabe mit Person und Grund, danach echte Zustellung · Pflichtangaben ·
  nur aus Endzustand · wiederholungssicher.
- **Kennzahlen** ohne Inhalte.
- **Hintergrundlauf:** arbeitet ohne neuen Submit ab · keine Überlappung · ein
  kaputtes Handle reißt die übrigen nicht mit · startet/stoppt ohne den Prozess
  offenzuhalten · verlangt ein brauchbares Handle.
- **DRY_RUN im Dauerbetrieb:** kein Provideraufruf, kein Erfolg.
- **Alle sieben Journeys** einzeln zustellbar, ohne fremde anzufassen.

Ohne Regression: Node-Suiten **274/274**.

**Mutationsproben:** Zuständigkeit ausgehebelt → 2 Tests fallen (der
Ausgangsdefekt kehrt zurück) · Backoff auf festen Abstand → Test fällt ·
Streuung nach oben → Test fällt · Wiedervorlage aus wartendem Zustand erlaubt →
2 Tests fallen · überlappende Dispatcher-Läufe → Test fällt · Versuchszahl bei
Wiedervorlage zurückgesetzt → Test fällt.

### 23.7 Offen aus PT22.4

| ID       | Sachverhalt                                                                                                                                                                                                            | Owner     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `LDC-17` | Betriebssicht und Wiedervorlage gibt es nur als CLI. Eine autorisierte HTTP-Oberfläche ist eine eigene Entscheidung mit eigenem Sicherheitsbedarf.                                                                     | AP26/AP28 |
| `LDC-18` | Der Dispatcher läuft **pro Prozess**. Bei mehreren Instanzen arbeiten mehrere Dispatcher dieselbe Outbox ab. Der atomare Claim samt Lease macht das korrekt, aber es gibt keine Führungswahl und keine Lastverteilung. | AP28      |
| `LDC-19` | `RECONCILIATION_REQUIRED` ist sichtbar und per CLI freigebbar — es gibt aber keinen Weg, beim Provider **nachzusehen**, ob die Nachricht doch ankam. Die Entscheidung bleibt menschlich und unbelegt.                  | AP22/AP26 |

### 23.8 Handoff PT22.5

**PRIMARY WRITE SET** — die Journey-Dateien, die noch fehlen:

| Journey               | Datei                                | Zustand            | Was zu tun ist                                                                                                                                          |
| --------------------- | ------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `roi_report`          | `server/roi-report.js` **(neu)**     | `LEGACY_MAIL_ONLY` | Slice nach dem Muster von `consumer-order.js`; PDF als eigener Side Effect über die Outbox, nicht im Request-Pfad (`LDC-05`)                            |
| `practice_order`      | `server/practice-order.js` **(neu)** | `NOT_YET_TYPED`    | Typisieren, `SPRAY_ORDER_MARKER` aus `contact-lead.js` entfernen, die beiden B2B-Seiten umstellen (`LDC-06`)                                            |
| `epigenetics_inquiry` | `server/epigenetics-inquiry.js`      | `ON_FOUNDATION`    | CRM-Adapter für `epigenetics` — oder die ausdrückliche Entscheidung, dass diese Journey keinen CRM-Weg hat (`LDC-14`)                                   |
| `content_download`    | `server/content-download.js`         | `ON_FOUNDATION`    | dasselbe für `resources` (`LDC-14`)                                                                                                                     |
| alle                  | `server/server.js`, `src/api/*`      | —                  | Antworten auf das Envelope aus `api-contract.js` (`LDC-08`), `requestId` am Lead persistieren (`LDC-10`), `findRecentDuplicate()` verdrahten (`LDC-13`) |

**PROVEN — DO NOT REDISCOVER**

- Warteschlange, Claim, Lease, Backoff, Dead Letter, Wiedervorlage und
  Hintergrundlauf aus §23 — einschließlich Absturz-/Neustartverhalten.
- Die Zustellgrenze aus §22 (eine Stelle, sechs Klassen, Timeout, DRY_RUN vor
  dem Adapter, Routing ohne freie Zielwahl, Logging-Allowlist).
- Das Datenmodell aus §21 (Migration 003 deterministisch, verlustfrei,
  containerkompatibel).
- Der API-/Fehlervertrag aus §15.

**Drift-Signale:** Änderungen an `server/lead-foundation/{repository,worker,
dispatcher,retry-policy}.js`, an einem Journey-Slice oder am Dispatcher-Start
in `server.js`.

---

## 24. Delta PT22.5 — die fünf Journeys migriert (2026-09-09)

### 24.1 Was wirklich fehlte

Drei der fünf (`contact`, `support`, `consumer_order`) lagen bereits auf der
Foundation. Die beiden anderen nicht — und beide auf eine Art, die im Betrieb
zählt:

**`roi_report` war ein reiner Mailendpunkt.** Im gesamten Handler stand kein
`createLead`. Das PDF entstand **im Request** und wurde synchron verschickt;
ein Providerfehler beantwortete die Anfrage mit 500 und verlor sie ersatzlos.
Die Antwortform war zusätzlich die alte `{ success: true }`.

**`practice_order` existierte nicht.** Eine Praxisbestellung lief durch
`/api/contact` und wurde dort an einem Magic String im Formularfeld `area`
erkannt, der über den Mailempfänger entschied. Der Empfänger einer echten
Bestellung hing damit an einem deutschen Freitext aus dem Client: wer ihn
übersetzte, schickte die Bestellung an den allgemeinen Vertrieb; wer ihn
kannte, konnte ihn für jede beliebige Kontaktanfrage setzen.

### 24.2 Was gebaut wurde

| Datei                                            | Inhalt                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server/roi-report.js` **(neu)**                 | Journey-Slice: validieren → Consent → persistieren → Outbox → Zustellung. Die **PDF-Erzeugung liegt im Zustellversuch**, nicht im Request: scheitert sie, wird wiederholt, ohne dass die Anfrage weg ist. Fachbereich allowlistet, Rechenwerte normalisiert (nur endliche Zahlen in Grenzen). |
| `server/practice-order.js` **(neu)**             | Journey-Slice mit eigenem CRM-Ziel `practice-sales`, serverseitiger Produkt- und Mengen-Allowlist (12/24/36/48/100 aus der freigegebenen Auswahl) und Bestellnummer `PRX-…`.                                                                                                                  |
| `server/contact-lead.js`                         | Magic String und Sonderempfänger **entfernt**. `contact` hat wieder genau einen Empfänger.                                                                                                                                                                                                    |
| `server/server.js`                               | Ein gemeinsamer `handleJourney()` für **alle sieben** Endpunkte; beide neuen Endpunkte hinter `formLimiter`; der Dispatcher kennt jetzt sieben Journeys.                                                                                                                                      |
| `src/api/{roiReport,practiceOrder}.ts` **(neu)** | Typisierte Clients mit Idempotency-Key und `retryable` aus der Serverantwort.                                                                                                                                                                                                                 |
| `PraxisOrderForm`, `RoiCalculatorSection`        | auf die typisierten Journeys umgestellt; `area`-Prop durch `product`-ID ersetzt.                                                                                                                                                                                                              |

### 24.3 Ein gemeinsamer Antwortweg

Vorher hatte jeder Endpunkt seinen eigenen `try/catch` mit eigener Form.
Jetzt läuft alles über `handleJourney()` und das Envelope aus §15:
`success`, `requestId`, `journey`, `state`, `retryable`, `messageKey`,
`fieldErrors`.

**Zwei Dinge sind dabei aufgefallen und behoben worden:**

1. **Der Fehlerkatalog war lückenhaft.** Die sieben Anhangsgründe der
   Support-Journey (`ATTACHMENT_TRAVERSAL`, `ATTACHMENT_SPOOFED`, …) standen
   nicht darin. Ein nicht katalogisierter Code fällt korrekt auf
   `JOURNEY_UNAVAILABLE` zurück — eine abgelehnte Datei hätte damit aber **500
   statt 400** gemeldet. Der Katalog ist ergänzt, und ein Test prüft ihn jetzt
   gegen die Codes, die die Slices wirklich werfen.
2. **`content_download` liefert echte Nutzlast** (`downloadUrl`, `assetId`,
   `entitlementId`, `expiresAt`). Das Envelope hätte sie verworfen. Sie steht
   jetzt unter `data` — **aufgezählt, nicht durchgereicht**: das Ergebnis
   pauschal weiterzugeben wäre bequem und würde ein später ergänztes internes
   Feld unbemerkt mit nach draußen nehmen. Der Test prüft die exakte
   Feldliste.

### 24.4 Stand aller sieben

| Journey               | Endpunkt                   | Persistenz | Idempotenz | Rate Limit | Consent          | Retry      | x10 |
| --------------------- | -------------------------- | ---------- | ---------- | ---------- | ---------------- | ---------- | --- |
| `contact`             | `/api/contact`             | ja         | ja         | ja         | getrennt         | ja         | ja  |
| `support`             | `/api/support`             | ja         | ja         | ja         | Processing       | ja         | ja  |
| `consumer_order`      | `/api/consumer-order`      | ja         | ja         | ja         | getrennt         | ja         | ja  |
| `roi_report`          | `/api/roi-report`          | **neu ja** | **neu ja** | ja         | **neu getrennt** | **neu ja** | ja  |
| `practice_order`      | `/api/practice-order`      | **neu ja** | **neu ja** | **neu ja** | **neu getrennt** | **neu ja** | ja  |
| `epigenetics_inquiry` | `/api/epigenetics-inquiry` | ja         | ja         | ja         | getrennt         | ja         | ja  |
| `content_download`    | `/api/content-download`    | ja         | ja         | ja         | getrennt         | ja         | ja  |

Alle sieben stehen in der Registry auf `ON_FOUNDATION` — es gibt keinen
`LEGACY_MAIL_ONLY`- und keinen `NOT_YET_TYPED`-Eintrag mehr.

### 24.5 x10-Systemcopy

Beide neuen Journeys hatten bereits Erfolgs- und Fehlertexte in allen zehn
Sprachen. Ergänzt wurde je ein **eigener Text für den wiederholbaren Fall**
(`roi.form.error_retryable`, `order.error_retryable`, x10, ohne DE-Kopie): ein
Zustellproblem ist kein Eingabefehler der Nutzerin, und die Oberfläche sagt
das jetzt auch. Der Server liefert `retryable`, der Client entscheidet nicht
mehr selbst anhand des Statuscodes.

### 24.6 Nachweise

`npx vitest run server/journey-migration.test.js` → **20/20**: 5/5 als
`ON_FOUNDATION` mit echtem Slice, Consent-Nachweis, Idempotency-Key, Honeypot
und eigener Journey-Zuständigkeit · alle fünf hinter `formLimiter` · alle fünf
über denselben Handler · `practice_order` persistiert vor dem Handoff mit
Bestellnummer und Kontext, allowlistet Produkt und Menge (**neun**
Ablehnungsfälle), nimmt den Empfänger nie aus dem Formular, ist idempotent,
verwirft den Honeypot, wiederholt transiente Fehler, funktioniert ohne
Marketing-Consent · `roi_report` persistiert samt Rechenwerten, verwirft
unbrauchbare Zahlen und ein `<script>`, allowlistet den Fachbereich, **verliert
die Anfrage nicht, wenn die PDF-Erzeugung scheitert**, behauptet ohne Provider
keine Zustellung, ist idempotent · x10-Copy für beide ohne DE-Kopie · alle
geworfenen Codes im Katalog · Magic String weg, Client typisiert.

Ohne Regression: Node-Suiten **295/295**, `check:i18n`, `typecheck`.

**Mutationsproben:** Praxisbestellung ohne Persistenz → 6 Tests fallen ·
Mengen-Allowlist ausgehebelt → Test fällt · Fehlercodes aus dem Katalog
entfernt → 2 Tests fallen · Envelope-Nutzlast blind durchgereicht → Test fällt ·
PDF-Erzeugung zurück in den Request-Pfad → 5 Tests fallen.

Zwei meiner ersten Proben waren **wirkungslos** und haben nichts bewiesen. Die
Wiederholung mit einer echten Umkehrung hat dabei eine reale Lücke im Test
aufgedeckt: der Nutzlast-Test prüfte nur, dass `downloadUrl` **da** ist, nicht
dass sonst nichts dabei ist. Er prüft jetzt die exakte Feldliste.

**Ein echter Nebenbefund:** `Number.parseInt('24 Sprays')` ergibt 24 — mein
erster Mengenparser hätte eine Zahl mit angehängtem Text akzeptiert. Die
Zeichenkette muss die Zahl jetzt _sein_.

**Angepasste Bestandszusicherungen:** die Endpunkttests aller Journeys lesen
`success` statt `accepted`, `state` statt `status`, `fieldErrors` statt
`fields` und die Download-Nutzlast unter `data`. Ein Test hielt das alte
Spray-Routing fest; er prüft jetzt das Gegenteil — dass `contact` bei **vier**
verschiedenen `area`-Werten immer denselben Empfänger wählt.

### 24.7 Offen aus PT22.5

| ID       | Sachverhalt                                                                                                                                                                                                          | Owner       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `LDC-14` | Unverändert: `epigenetics` und `resources` haben **keinen** CRM-Adapter; `reports` und `practice-sales` bekommen einen, sobald die Umgebungsvariablen gesetzt sind. 3 von 7 Zielen sind heute wirklich konfiguriert. | AP22        |
| `LDC-20` | `PRACTICE_ORDER_RECEIVER` fällt auf `CONTACT_RECEIVER` zurück, wenn nicht gesetzt. Das ist bewusst (kein stiller Ausfall), aber eine eigene Adresse ist die Absicht.                                                 | Betrieb     |
| `LDC-21` | Die ROI-Rechenwerte werden mitgespeichert. Sie sind Zahlen, keine Personendaten — aber sie beschreiben eine Praxis. Eine Aufbewahrungsfrist dafür fehlt weiterhin (`LDC-11`).                                        | Datenschutz |

### 24.8 Handoff PT22.6

**PROVEN — DO NOT REDISCOVER**

- 7/7 auf der Foundation, alle hinter `formLimiter`, alle über `handleJourney`
  mit dem gemeinsamen Envelope (§24.3, §24.4).
- Warteschlange, Retry, Dead Letter, Wiedervorlage, Hintergrundlauf (§23).
- Zustellgrenze mit sechs Klassen, Timeout, DRY_RUN vor dem Adapter (§22).
- Datenmodell und Migration 003 (§21).

**Offen und benannt:** `LDC-03` (Retention), `LDC-04`/`LDC-14` (echtes CRM),
`LDC-10` (`requestId` nicht am Lead persistiert), `LDC-13`
(`findRecentDuplicate()` von keiner Journey aufgerufen), `LDC-17`–`LDC-21`.

**Drift-Signale:** Änderungen an `server/{roi-report,practice-order}.js`, an
`handleJourney` in `server/server.js` oder an den beiden B2B-Produktseiten.

---

## 25. Delta PT22.6 — die beiden neuen Journeys abgenommen (2026-09-09)

### 25.1 Der Befund: zwei Journeys ohne jeden Zustellweg

`epigenetics_inquiry` und `content_download` waren bereits persistent,
idempotent, rate-limitiert und consent-getrennt — daran war nichts zu bauen.
Was fehlte, war die Zustellung: **beide Slices konstruierten
`new CrmRouter()` ohne einen einzigen Adapter.** Jede Anfrage wurde sauber
gespeichert und danach terminal mit `NO_PROVIDER_CONFIGURED` abgelegt.

Ehrlich gemeldet — aber **niemand hat je eine Epigenetik-Anfrage oder einen
Lead-Magnet-Download gesehen.** Für eine Vertriebsanfrage ist ein Lead, den
niemand liest, wertlos; für einen Lead-Magneten ist es der ganze Zweck.

Das war `LDC-14`, seit PT22.3 benannt und hier geschlossen.

### 25.2 Was ergänzt wurde

| Journey               | Ziel          | Adapter                                                                                                                                                                     |
| --------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `epigenetics_inquiry` | `epigenetics` | `SendGridEpigeneticsInquiryAdapter` — Team-Mail mit Name, Organisation, Einrichtungsart, Fallzahl, **Panel**, **Fokus**, Quelle, Kampagne, Herkunftsroute und Nachricht.    |
| `content_download`    | `resources`   | `SendGridResourceLeadAdapter` — Team-Hinweis mit Kontakt, **Asset-ID** sowie **angefragter und gelieferter Sprache** getrennt, damit eine Sprachabweichung sichtbar bleibt. |

Beide beziehen den Empfänger aus der Umgebung
(`EPIGENETICS_RECEIVER` / `RESOURCE_LEAD_RECEIVER`, ersatzweise
`CONTACT_RECEIVER`). Ohne gesetzte Variablen wird **kein** Adapter registriert
— dann bleibt es beim ehrlichen `NO_PROVIDER_CONFIGURED` statt eines halben
Wegs.

### 25.3 Die AP19-Sicherheitsgrenze bleibt, wo sie war

Die Team-Mail zum Download enthält **niemals** das Token und **niemals** den
Downloadlink. Sie kann es strukturell nicht:

- Das Token wird nie gespeichert, nur `sha256(token)` (`token_hash TEXT NOT
NULL UNIQUE` in Migration 002).
- Der Adapter sieht ausschließlich den **Lead aus der Datenbank** — dort
  existiert das Token nicht.
- Der Adapter ruft `downloadUrl()` nicht auf.

Die Nutzerin bekommt den Link in der HTTP-Antwort; der Team-Hinweis nennt nur,
**wer welches Asset** angefordert hat. Ein Link in einer Team-Mail wäre ein
zweiter, unkontrollierter Weg an der Entitlement-Prüfung vorbei.

Alle drei Punkte sind als Test festgehalten, ebenso dass Asset-Auflösung über
die Registry läuft und `redeem()` weiterhin prüft.

### 25.4 Analytics erst nach Einwilligung — geprüft, nicht umgebaut

Beide Wege waren bereits richtig und wurden deshalb **nicht angefasst**:

- `src/lib/tracking.ts` ist eine vorbereitete, inerte Schnittstelle: ohne
  registrierten Anbieter **und** ohne `setTrackingConsent(true)` sendet sie
  nichts, puffert nichts und schreibt nicht in `window.dataLayer`.
- `GtmPageview` prüft `hasAnalyticsConsent()` **vor** dem `gtag`-Aufruf.

Keiner der beiden Journey-Slices und keiner der beiden Clients hängt an einer
Analytics-Einwilligung — im Test gegen `analytics_storage`, `dataLayer`,
`gtag(` und `hasAnalyticsConsent` geprüft.

### 25.5 Registry 7/7

Alle sieben Journeys stehen auf `ON_FOUNDATION`, haben einen Endpunkt, einen
Slice mit `createLead`, eine eigene Worker-Zuständigkeit — und ab jetzt auch
alle sieben einen Adapter, sobald die Umgebung ihn hergibt.

### 25.6 Nachweise

`npx vitest run server/new-journeys.test.js` → **19/19**: Panel/Fokus/Quelle/
Kampagne im Kontext · Persistenz vor Handoff · Marketing-Consent getrennt und
optional · Consent-Nachweis Pflicht · Idempotenz und 409-Konflikt · transienter
Fehler → Wiederholung → Zustellung · unbekanntes Ergebnis ohne Nachspielen ·
**echte Zustellung an einen fest verdrahteten Empfänger** · ohne Provider keine
Zustellungsbehauptung · Download-Team-Mail **ohne Token und ohne Link** · das
Token ist strukturell unsichtbar · AP19-Schutzmerkmale erhalten · Registry 7/7 ·
alle sieben mit Adapter · gemeinsamer Handler · kein Fake-Erfolg · Analytics
dreifach geprüft.

Ohne Regression: Node-Suiten **314/314**.

**Mutationsproben:** Adapter nicht mehr an den Router gereicht → 2 Tests
fallen · Empfänger aus dem Lead genommen → Test fällt · Downloadlink in die
Team-Mail → Test fällt · eine Journey zurück auf `NOT_YET_TYPED` → Test fällt ·
Analytics-Gate im Seitenaufruf entfernt → Test fällt.

**Zwei meiner Tests waren zunächst zu schwach** und haben bei der ersten Probe
nichts bewiesen:

1. Der Adaptertest suchte im Quelltext nur nach einem `adapters`-Objekt. Ein
   `adapters` zu bauen und dann `new CrmRouter()` **ohne Argument** aufzurufen
   sieht fast gleich aus und liefert nichts aus — genau das war der
   Ausgangszustand. Jetzt wird zusätzlich die Übergabe geprüft **und** die
   Zustellung einmal wirklich durch die Runtime-Fabrik gefahren.
2. Der Empfängertest übergab `to` im **Request-Body**, den die Validierung
   ohnehin verwirft. Er setzt das Feld jetzt direkt im Lead — dem einzigen Ort,
   an dem es dem Adapter je begegnen könnte.

**Nebenbefund:** `getRuntime*` nimmt ein `env`-Argument für die
Adapterkonfiguration, aber `openLeadDatabase()` liest den Datenbankpfad
weiterhin aus `process.env`. Kein Defekt, aber eine Inkonsistenz der Fabrik —
`LDC-22`.

### 25.7 Offen aus PT22.6

| ID       | Sachverhalt                                                                                                                                                                                    | Owner   |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `LDC-22` | `getRuntime*({ env })` steuert nur die Adapterkonfiguration; der Datenbankpfad kommt immer aus `process.env`. Testbarkeit und Klarheit litten.                                                 | AP22    |
| `LDC-23` | Die neuen Empfängervariablen (`EPIGENETICS_RECEIVER`, `RESOURCE_LEAD_RECEIVER`) fallen auf `CONTACT_RECEIVER` zurück. Bewusst, damit nichts still ausfällt — eigene Adressen sind die Absicht. | Betrieb |

### 25.8 Handoff PT22.7 — `/api/chat`

> **ERLEDIGT mit PT22.7 (2026-09-09) — der folgende Abschnitt beschreibt den Stand VOR der
> Entfernung und bleibt als Auftragslage stehen. Ergebnis in §25.9.**

**Der Stand:** `/api/chat` ist **keine** Journey und steht nicht in der
Registry. Der Endpunkt existiert weiterhin in `server/server.js` als Mock ohne
Frontend-Aufrufer (so schon in `BACKEND-LEAD-CURRENT-STATE.md` §3.1 Klasse J
erhoben). Er liegt als einziger POST-Endpunkt **nicht** hinter `formLimiter`.

**File Map für PT22.7:**

| Datei                                   | Was zu tun ist                                                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `server/server.js`                      | `app.post('/api/chat', …)` — entfernen oder ausdrücklich absichern. Er ist der einzige ungebremste POST-Endpunkt. |
| `src/**`                                | prüfen, dass wirklich kein Aufrufer existiert, bevor entfernt wird.                                               |
| `building-docs/BACKEND-API-CONTRACT.md` | die Entscheidung festhalten.                                                                                      |

**PROVEN — DO NOT REDISCOVER:** Registry 7/7 mit Adaptern (§25.5), die
AP19-Grenze (§25.3), Consent- und Analytics-Lage (§25.4), Warteschlange und
Zustellgrenze (§22, §23), Datenmodell (§21), API-/Fehlervertrag (§15).

**Drift-Signale:** Änderungen an `server/{epigenetics-inquiry,content-download}.js`,
an `server/protected-assets.js` oder an den Entitlement-Migrationen.

### 25.9 Ergebnis PT22.7 — Chat ist weg

**Entschieden wurde die härtere der beiden Optionen aus der File Map:** nicht
absichern, sondern **entfernen**. Ein Endpunkt, den kein Frontend aufruft, der
nichts persistiert, keinen Consent kennt und dessen Antwort ein fest verdrahteter
deutscher Echo-Text ist, gewinnt durch ein Rate Limit nichts — er bleibt
Angriffsfläche ohne Gegenwert. `DEC-RL-007` verlangt ohnehin die Entfernung.

| Fläche            | Vorher                                                                                                                                          | Nachher                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Endpunkt          | `app.post('/api/chat', …)` in `server/server.js`, ohne `formLimiter`                                                                            | entfernt — POST/GET/PUT/DELETE laufen in den 404 von Express    |
| Mock-Logik        | Echo-Agent mit 1 s künstlicher Verzögerung und vier festen deutschen Antworten                                                                  | entfernt                                                        |
| Provider          | Teams-Bot-Framework-/OpenAI-Roadmap als 23-zeiliger Kommentarblock                                                                              | entfernt — kein Provider, keine Abhängigkeit, kein `botbuilder` |
| CSP (`server.ts`) | `widget.hihuman.co.uk` in `script-src`, `connect-src` (+ Wildcard `*.hihuman.co.uk`), `frame-src`                                               | alle drei Direktiven ohne Chat-Domain                           |
| Frontend          | bereits mit AP06 PT06.4 entfernt (`ChatWidget.tsx` gelöscht)                                                                                    | unverändert — kein Aufrufer in `src/api/**`                     |
| Env / Secrets     | keine gefunden (`CHAT_*`, `HIHUMAN*`, `DIRECTLINE*` = 0 Treffer)                                                                                | unverändert — es gab nichts zu entfernen                        |
| Dependencies      | keine chat-spezifische in `package.json` oder `server/package.json`                                                                             | unverändert — es gab nichts zu entfernen                        |
| Dokumentation     | `CHAT_INTEGRATION.md` (aktive Anleitung), `README.md` („enthält einen Mock-Chat"), `docs/design-system.md` (`ChatWidget` in Shell und UI-Liste) | Datei gelöscht, beide Stellen korrigiert                        |

**Zwei Befunde, die über das reine Löschen hinausgingen:**

1. **Zwei Bestandstests hielten den Chat aktiv fest.** `shell.test.tsx` enthielt
   ein `describe('Ownership-Grenzen bleiben gewahrt')` mit den Zusicherungen
   „das Backend `/api/chat` ist unveraendert (Owner AP22)" und „die CSP fuehrt
   die HiHuman-Domains weiterhin (Owner AP26)". Beide waren zum Zeitpunkt von
   AP06 richtig — sie sollten verhindern, dass AP06 fremdes Eigentum anfasst.
   Nach PT22.7 sind sie **umgekehrt** worden: kein `/api/chat` in
   `server/server.js`, keine HiHuman-Referenz im CSP-**Code**. Wären sie
   stehengeblieben, hätte die Suite die Entfernung rot gemeldet.
2. **Die CSP-Frage war die eigentliche Substanz.** Der Endpunkt war ungenutzt;
   die drei CSP-Direktiven dagegen erlaubten einer produktiven Seite weiterhin,
   ein Drittanbieter-Bundle zu laden und einen Rückkanal über eine **Wildcard**
   (`*.hihuman.co.uk`) zu öffnen. Ein entfernter Handler beseitigt das nicht —
   genau das hält `CONSENT-CONTRACT.md` M-04 fest. Die Domains sind deshalb hier
   mitentfernt worden, obwohl die CSP-**Finalisierung** (Enforce, Report-URI,
   Wildcard-Abbau bei den übrigen Origins) weiterhin AP26 PT26.2 gehört.

**Bewusst NICHT entfernt:** die drei Guards, die die Rückkehr verhindern —
`scripts/check-search-index.ts` (`/api/chat` in `FORBIDDEN_PREFIXES`),
`scripts/check-route-registry.ts` (`/chat|hihuman/`-Prüfung auf Navigationsziele)
und die Chat-Regressionstests in `shell.test.tsx`, `Header.test.tsx`,
`Footer.test.tsx`, `e2e/navigation.spec.ts`. Sie nennen den Begriff, behaupten
aber keinen aktiven Chat; sie sind das Gegenteil davon.

**Ebenfalls nicht angefasst:** `_project-knowledge/` ist ein Schnappschuss-Archiv
der ALTEN Website (eigenes `README.md`, außerhalb `tsconfig`-`include`, von
keinem produktiven Modul importiert). Die dortige `components/ui/ChatWidget.tsx`
ist historisches Material, kein produktiver Rest. Ebenso bleiben die
Baseline-/Audit-Dokumente (`BACKEND-LEAD-CURRENT-STATE.md`,
`CONSENT-TRACKING-NETWORK-BASELINE.md`, `NETWORK-ALLOWLIST.md`,
`CONSENT-CONTRACT.md`, AP01/AP06-Werkpakete) inhaltlich stehen: sie erheben einen
damaligen Zustand oder verbieten den Chat — keines behauptet einen aktiven.

### 25.10 Handoff PT22.8 — Datenschutz-/Betriebsfunktionen

**PRIMARY WRITE SET für PT22.8:**

| Datei                                                | Warum                                                                              |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `server/lead-foundation/repository.js`               | Retention-Löschung und DSAR-Lookup/Export/Delete setzen hier auf                   |
| `server/lead-foundation/database.js` + `migrations/` | ggf. Index auf `delete_after`; Migration nur additiv                               |
| `server/lead-foundation/dispatcher.js`               | vorhandener Intervall-Träger — Retention-Job dort andocken statt zweitem Scheduler |
| `scripts/lead-ops.mjs`                               | bestehender operativer Einstieg (Queue/Dead-Letter) — DSAR/Retention hier ergänzen |
| `server/support-case.js`                             | die einzigen Leads mit Dateien auf Platte; Retention muss die Uploads mitlöschen   |
| `building-docs/LEAD-DATA-CONTRACT.md`                | Retention-/DSAR-Semantik festhalten                                                |

**Offene Punkte, die PT22.8 gehören:** `LDC-21` (keine Aufbewahrungsfrist für die
mitgespeicherten ROI-Rechenwerte), die aus AP20 PT20.3 bewusst vertagte
**Retention als Metadatum statt als Job** (90 Tage/`deleteAfter` stehen am
Support-Case, es löscht sie niemand), sowie Preview-/DRY_RUN-Isolation.

**PROVEN — DO NOT REDISCOVER:**

- Chat ist vollständig entfernt (§25.9) — Endpunkt 404, UI, Provider, CSP, Env,
  Dependencies, Docs. **Keine erneute Chat-Suche in PT22.8 oder AP22-CLOSURE
  nötig**; die Guards oben halten den Zustand.
- Registry 7/7 mit Adaptern (§25.5), AP19-Grenze (§25.3), Consent- und
  Analytics-Lage (§25.4), Warteschlange und Zustellgrenze (§22, §23),
  Datenmodell (§21), API-/Fehlervertrag (§15).

**Drift-Signale für PT22.8:** Änderungen an `server/lead-foundation/{repository,database,dispatcher}.js`,
an den Migrationen oder am Upload-Verzeichnis der Support-Journey.

---

## 26. Delta PT22.8 — Datenschutz und Betrieb (2026-09-09)

### 26.1 Der Befund: Aufbewahrung war ein Metadatum, kein Vorgang

AP20 PT20.3 hat für `support` 90 Tage festgelegt. PT22.2 hat daraus eine
indizierte Spalte gemacht und `findDueForDeletion()` dazugeschrieben. Danach
hat es niemand aufgerufen. **Eine Löschfrist, die nur in der Datenbank steht,
ist keine Löschung** — die Support-Anhänge einer Kundin lagen nach 90 Tagen
unverändert auf der Platte, und die Zeile sagte fällig.

Zweiter Befund derselben Art: Auskunft und Löschung waren technisch nicht
durchführbar. Es gab keinen Weg von einer E-Mail-Adresse zu den Vorgängen
einer Person — `subject_json` ist ein JSON-Feld ohne Suchschlüssel. Eine
DSAR-Anfrage hätte bedeutet, alle Zeilen zu parsen und von Hand zu
vergleichen.

### 26.2 Was gebaut wurde

| Fläche             | Datei                                   | Kern                                                                               |
| ------------------ | --------------------------------------- | ---------------------------------------------------------------------------------- |
| Schema             | `migrations/004_privacy_operations.sql` | **additiv**: `subject_email_hash`, `anonymized_at`, `legal_hold_until` + ein Index |
| Aufbewahrung       | `lead-foundation/privacy.js`            | Politik mit Herkunft, Lauf mit Bericht-Standard, Anhänge-Löschung                  |
| Betroffenenrechte  | `lead-foundation/privacy.js`            | `LeadPrivacyService`: Auskunft, Datenkopie, Löschung                               |
| Anonymisierung     | `lead-foundation/repository.js`         | `anonymizeLead`, `setLegalHold`, `exportLead`, `findLeadsBySubjectEmail`           |
| Umgebungsisolation | `lead-foundation/environment.js`        | `resolveDeliveryMode`, `describeRuntimeIsolation`                                  |
| Betrieb            | `lead-foundation/operations.js`         | Alarme, Alarmsenken, Sicherungsumfang, `createLeadBackup`, `verifyBackup`          |
| Takt               | `lead-foundation/dispatcher.js`         | `jobs` — Wartung auf dem vorhandenen Zeitgeber, **kein zweiter Scheduler**         |
| Bedienung          | `scripts/lead-ops.mjs`                  | neun weitere Kommandos im vorhandenen Werkzeug, **kein zweites Admin-Produkt**     |

### 26.3 Aufbewahrung: konfigurierbar, ohne eine Frist zu erfinden

Für sechs der sieben Journeys gibt es **keine** freigegebene Aufbewahrungsdauer
(`LDC-11`). Eine Zahl hier hineinzuschreiben wäre eine datenschutzrechtliche
Aussage, die dieser Task nicht treffen darf. Die Politik meldet deshalb drei
Herkünfte, und `UNDECIDED` heißt genau das — nicht „unbegrenzt":

| Herkunft               | Bedeutung                                                           |
| ---------------------- | ------------------------------------------------------------------- |
| `APPROVED_POLICY`      | in einem AP beschlossen. Heute nur `support` = 90 Tage.             |
| `OPERATIONAL_OVERRIDE` | vom Betrieb per `LEAD_RETENTION_DAYS_<JOURNEY>` gesetzt.            |
| `UNDECIDED`            | keine Entscheidung. Es wird nichts gelöscht — und das ist sichtbar. |

Eine Konfiguration kann eine beschlossene Frist **verkürzen, aber nicht
verlängern**: eine längere Aufbewahrung als beschlossen wäre eine rechtliche
Aussage, die eine Umgebungsvariable nicht treffen darf. Der Versuch wirft.

Der Lauf **berichtet standardmäßig und löscht nichts**. Erst
`LEAD_RETENTION_APPLY=1` (Dienst) bzw. `--apply` (CLI) anonymisiert. Ein
Löschjob, der sich mit dem Deployment selbst scharf schaltet, ist im Betrieb
nicht zu verantworten.

### 26.4 Anonymisieren statt löschen — und warum

Ein `DELETE` auf `leads` räumt über `ON DELETE CASCADE` auch `lead_events` ab,
also **genau den Nachweis, dass ordnungsgemäß gelöscht wurde**. Entfernt wird
deshalb der Personenbezug; die Zeile bleibt als Beleg mit Journey, Zustand,
Zeitpunkten und Protokoll.

Entfernt werden **alle drei** Verkettungen zur Person, nicht nur das Subject:
`dedup_key`, `subject_email_hash` und `request_hash` sind ungesalzene Hashes
über die Adresse — wer eine Adresse rät, könnte sonst prüfen, ob sie hier lag.
Bewusst in Kauf genommene Folge: ein Replay des alten Idempotency-Keys kann
nicht mehr gegen den ursprünglichen Request verglichen werden und meldet einen
Konflikt. Ein ausgestellter Downloadanspruch wird mitwiderrufen.

**Zwei Fälle, in denen NICHT anonymisiert wird**, beide sichtbar gemeldet statt
still übersprungen:

- `DELIVERY_PENDING` — der Vorgang wird gerade zugestellt. Den Personenbezug
  mitten in der Bearbeitung zu entfernen würde eine leere Nachricht
  verschicken.
- `LEGAL_HOLD` — eine eingetragene Aufbewahrungspflicht. Sie wird
  **ausschließlich von einer Person gesetzt**, mit Grund und im Protokoll. Hier
  wird keine gesetzliche Frist abgeleitet: ohne Eintrag gibt es keine Ausnahme.

### 26.5 Auskunft und Löschung treffen nur die eigene Person

Der Einstieg ist immer der Hash der normalisierten Adresse, nie eine
Textsuche. Ein `LIKE '%…%'` würde fremde Datensätze treffen, und **eine
Löschung, die fremde Datensätze trifft, ist schlimmer als gar keine.** Ein
Test stellt genau das nach: `mila@example.com`, `mila.k@example.com` und
`ada@example.com` liegen nebeneinander, und die Löschung fasst nur die erste an.

Zeilen aus der Zeit vor der Spalte bekommen ihren Suchschlüssel beim ersten
Aufruf des Dienstes nachgetragen — SQLite kann kein sha256, eine Backfill im
SQL der Migration ist unmöglich. Ohne diesen Nachlauf wäre eine Auskunft still
unvollständig gewesen.

### 26.6 Preview/Staging: was erzwungen ist und was nicht

`DRY_RUN` war ein reiner Startparameter (`DEPLOYMENT-CONTRACT.md` DD-11). Wer
ihn vergisst, betreibt eine Vorschau mit echtem Providerschlüssel und schickt
echte Mail an echte Menschen.

**Erzwungen:** `APP_ENV`/`DEPLOY_ENV` = `preview` oder `staging` schaltet den
Trockenlauf zwingend ein; `DRY_RUN=0` hebt das **nicht** auf. Der Adapter wird
dann gar nicht erst aufgerufen — kein Netzwerk, kein halber Weg.

**Nicht erzwungen, ehrlich benannt:** `NODE_ENV` kann das nicht leisten. Die
Preview-Instanz läuft laut Runbook selbst mit `NODE_ENV=production`, weil sie
einen Produktionsbuild bedient. **Eine Umgebung, die sich nicht benennt, ist
von der Produktion nicht unterscheidbar.** Deshalb ist `APP_ENV=preview` eine
Deployment-ANFORDERUNG (DEP-29), keine automatische Erkennung — und die
Kombination „undeklarierte Umgebung mit Providerschlüssel" ist ein gemeldeter
Befund. Verbleibendes Risiko: `LDC-24`.

### 26.7 Betriebssicht, Alarme, manuelle Wiedervorlage

Kennzahlen gab es seit PT22.4. Was fehlte, war der Schritt zur **Handlung**:
eine Zahl in einer JSON-Ausgabe alarmiert niemanden. `evaluateAlerts()` bewertet
gegen Schwellen und meldet die Zustände, in denen ein Lead verloren geht oder
ungelesen liegen bleibt:

| Alarm                           | Warum lead-kritisch                                                |
| ------------------------------- | ------------------------------------------------------------------ |
| `LEADS_FAILED_TERMINAL`         | gespeichert, aber nie zugestellt — niemand hat den Vorgang gesehen |
| `LEADS_RECONCILIATION_REQUIRED` | Providerergebnis unbekannt; kein blinder Replay                    |
| `NO_PROVIDER_CONFIGURED`        | für ein Ziel fehlt der Adapter; alles bleibt liegen                |
| `QUEUE_STALLED`                 | ältester fälliger Auftrag zu alt — läuft der Dispatcher?           |
| `QUEUE_DEPTH_HIGH`              | ungewöhnlich viele fällige Aufträge                                |
| `RETENTION_OVERDUE`             | fällige Löschungen, die kein Lauf ausführt                         |
| `PREVIEW_WITH_LIVE_DELIVERY`    | Vorschau ohne Trockenlauf                                          |
| `PRODUCTION_IN_DRY_RUN`         | Produktion stellt nichts zu                                        |

Eine Senke, die wirft, verhindert die übrigen nicht — ein kaputter Webhook wäre
sonst ein stiller Ausfall der gesamten Alarmierung. Die Standardsenke schreibt
strukturiert ins Log, ohne einen einzigen Personenbezug. `lead-ops alerts`
liefert zusätzlich einen Exitcode, den ein Cron auswerten kann.

Die manuelle Wiedervorlage bleibt, was PT22.4 gebaut hat: ausdrücklich
(Person + Grund Pflicht), nur aus einem Endzustand, wiederholungssicher und im
Protokoll. Sie ist der operative Weg zurück und wird hier nur nachgemessen.

### 26.8 Sicherung und Wiederherstellung — die AP22-Grenze

`describeBackupScope()` ist eine **Datenstruktur, keine Prosa**: ein
Backup-Umfang, der nur in einem Dokument steht, ist nicht prüfbar. Ein Test
vergleicht ihn mit den Tabellen, die es wirklich gibt — fällt künftig eine
Tabelle hinzu, ohne im Umfang zu stehen, wird der Test rot.

- **Wiederherstellungsreihenfolge:** `schema_migrations`, `leads`,
  `lead_outbox`, `lead_events`, `resource_entitlements`.
- **Dateisystem:** `SUPPORT_UPLOAD_DIR` gehört dazu — die Datenbank hält nur
  Metadaten der Anhänge. Es ist **nicht** Teil der Datenbanksicherung.
- **Ausgeschlossen:** Provider-Secrets (Secrets-Verwaltung, AP28) und
  Download-Token (werden nie gespeichert, nur sha256 — sie sind strukturell
  nicht sicherbar).
- **`VACUUM INTO` statt Dateikopie:** die Datenbank läuft im WAL-Modus; eine
  `cp`-Kopie wäre ohne Checkpoint ein Stand irgendwo zwischen zwei
  Transaktionen. Eine bestehende Zieldatei wird nie überschrieben.

**Der Restore-Smoke ist ausdrücklich begrenzt** (`scope: AP22_BOUNDED_SMOKE`):
geprüft wird, dass die Sicherung sich öffnen lässt, denselben Migrationsstand
und dieselben Zeilen trägt und die Warteschlange danach wieder bedienbar ist.
**Nicht** bewiesen: ein Produktionsrestore mit Volume, Downtime und Reihenfolge
über mehrere Dienste. Das ist AP28 PT28.5 und wird hier nicht behauptet.

### 26.9 Nachweise

- **40/40** task-eigene Tests (`server/privacy-operations.test.js`),
  **364/364** Node-Suiten (25 Dateien), tsc/eslint/prettier sauber.
- **Sechs Mutationsproben greifen:** anonymisierte Vorgänge wieder als fällig
  melden · `DRY_RUN=0` die Preview-Erzwingung aufheben lassen ·
  `request_hash` bei der Anonymisierung stehen lassen · die DSAR-Auswahl auf
  alle Zeilen öffnen (4 Tests rot, darunter die Löschung fremder Datensätze) ·
  die Pfadprüfung im Löschjob entfernen · `verifyBackup` immer `ok` melden.
- **Operativ nachgefahren**, nicht nur Unit-Test: `lead-ops isolation`,
  `retention-policy`, `dsar-lookup`, `retention`, `retention --apply`
  (Anhang wirklich von der Platte verschwunden, Adresse danach nicht mehr
  auffindbar), `alerts`, `backup` gegen eine echte Datenbank.
- **Der Server im Trockenlauf gemessen:** mit `APP_ENV=preview` und gesetztem
  Providerschlüssel meldet der Start `reason=NON_PRODUCTION_ENVIRONMENT,
forced=true`; mit `NODE_ENV=production DRY_RUN=1` erscheinen die Befunde
  `PRODUCTION_IN_DRY_RUN` und `UNDECLARED_ENVIRONMENT_WITH_PROVIDER`.

**Ein eigener Befund aus dem Testlauf:** die Prüfung auf synthetische
Testdaten hat drei echte Adressen in Bestands-Fixtures gefunden — darunter die
Arbeitsadresse einer Kollegin als Formularwert. Ersetzt durch reservierte
Domains (RFC 2606). Eine begründete Ausnahme bleibt: `contact@polarisdx.net`
in `consumer-order.test.js` ist keine Testidentität, sondern eine Zusicherung
über den produktiven Empfänger.

### 26.10 Offen aus PT22.8

| ID       | Sachverhalt                                                                                                                                                                                                              | Owner       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `LDC-24` | Eine Umgebung ohne `APP_ENV` ist von der Produktion technisch nicht unterscheidbar. Erzwungen ist der Trockenlauf nur, wo die Umgebung sich benennt; sonst bleibt es bei einem gemeldeten Befund.                        | AP28 PT28.4 |
| `LDC-25` | Der Aufbewahrungslauf hängt am Dispatcher-Takt und damit am Prozess. Steht der Dienst über den Fälligkeitstag, fällt der Lauf aus und holt erst beim nächsten Start nach. Kein Cron, keine Führungswahl (vgl. `LDC-18`). | AP28        |
| `LDC-26` | `dsar-export` gibt personenbezogene Daten auf stdout aus. Wer die CLI ausführen darf, hat ohnehin Datenbankzugriff — ein Terminalprotokoll ist trotzdem der falsche Ort. Eine Ausgabe in eine Datei mit Rechten fehlt.   | Betrieb     |
| `LDC-11` | **technisch geschlossen, rechtlich offen.** Fristen sind jetzt konfigurierbar und nachvollziehbar. Für sechs Journeys fehlt weiterhin die freigegebene Dauer — sie werden nicht gelöscht, und das ist sichtbar.          | Datenschutz |
| `LDC-21` | Die ROI-Rechenwerte fallen unter dieselbe Lücke: über `LEAD_RETENTION_DAYS_ROI_REPORT` konfigurierbar, ohne Entscheidung ohne Frist.                                                                                     | Datenschutz |
| `LDC-03` | **geschlossen mit PT22.8** — der Löschjob existiert, ist ausführbar, konfigurierbar und auditiert.                                                                                                                       | —           |

Unverändert offen: `LDC-04`, `LDC-10`, `LDC-13`, `LDC-17` bis `LDC-20`,
`LDC-22`, `LDC-23`.

### 26.11 Der exakte AP28-Rest

Was AP22 an Datenschutz und Betrieb liefern konnte, ist geliefert. Was
**ausdrücklich nicht** dazugehört und AP28 bleibt — vollständig, damit dort
niemand neu erheben muss:

| Thema                      | Was fehlt                                                                                                                            | AP28          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| Produktionstopologie       | Container/Volume/Reverse-Proxy als Zielmodell; Preview als Container statt detachtem Hostprozess; der Portkonflikt aus **DD-19**     | PT28.4        |
| Secrets-Betrieb            | Ablage, Rotation, Zugriffstrennung. AP22 liest Namen aus der Umgebung und gibt **nie** einen Wert aus — mehr kann es hier nicht tun. | PT28.3        |
| Stackweites Monitoring     | Metrik-Backend, Dashboard, Empfänger, Eskalation. AP22 liefert Kennzahlen und Alarm-Senken, kein Monitoringprodukt.                  | PT28.5        |
| Backup-Zeitplan            | Häufigkeit, Aufbewahrung der Sicherungen, Ablageort, Beobachtbarkeit eines **stillen Fehlschlags** (DEP-20).                         | PT28.5        |
| Vollständige Restore-Übung | Wiederherstellung mit Volume, Downtime, Dienstreihenfolge, gemessene RTO/RPO. AP22 hat nur den begrenzten Smoke (§26.8).             | PT28.5.2      |
| Rollback/Runbook           | image-basiertes Rollback, Migrations-Rollbackpfad, Runbook für Wiedervorlage und Löschlauf im Betrieb.                               | PT28.4/PT28.6 |
| Löschlauf-Zeitplan         | `LDC-25`: ein Takt, der nicht am Anwendungsprozess hängt.                                                                            | PT28.5        |

### 26.12 Handoff AP22-CLOSURE

**Stand der sieben Journeys vor der Closure:** 7/7 `ON_FOUNDATION`, alle mit
Endpunkt, eigenem Slice, eigener Worker-Zuständigkeit und Adapter (§25.5).
Persistenz vor Handoff, serverseitige Validierung, durable Idempotenz,
journey-spezifisches Dedup, getrennte Consents, Outbox mit Backoff, Dead
Letter und Reconciliation — alles gemessen in §21 bis §26.

**PROVEN — DO NOT REDISCOVER** (Closure prüft neu, aber sucht nicht neu):

- Chat vollständig entfernt (§25.9) — Endpunkt 404, UI, Provider, CSP, Env,
  Dependencies, Docs.
- Registry 7/7 mit Adaptern (§25.5), AP19-Grenze (§25.3), Consent-/Analytics-Lage
  (§25.4), Warteschlange und Zustellgrenze (§22, §23), Datenmodell (§21),
  API-/Fehlervertrag (§15), Datenschutz und Betrieb (§26).

**OPEN CLOSURE ITEMS** — was die Closure ausdrücklich als offen vorfindet und
**nicht** als erledigt bewerten darf:

1. `LDC-11`/`LDC-21`: sechs Journeys ohne freigegebene Aufbewahrungsfrist.
   **Technisch geschlossen, rechtlich offen** — kein False-Ready.
2. `LDC-24`: undeklarierte Umgebung ist von der Produktion nicht
   unterscheidbar.
3. `LDC-25`: der Löschlauf hängt am Anwendungsprozess.
4. `LDC-04`: kein echter CRM-Adapter — alle Ziele sind Team-Mails.
5. `LDC-13`: `findRecentDuplicate()` wird von keiner Journey aufgerufen.
6. `LDC-17`/`LDC-18`/`LDC-19`, `LDC-10`, `LDC-20`, `LDC-22`, `LDC-23`.
7. Der AP28-Rest aus §26.11 ist **nicht** AP22-Scope und darf in der Closure
   nicht als AP22-Lücke gezählt werden.
8. **Toolchain, PT-fremd:** die jsdom-Suiten laufen in dieser Umgebung nicht
   (`html-encoding-sniffer` require()t ein ES-Modul). Betrifft auch
   unveränderte Dateien. Die Node-Suiten sind davon unberührt.

**Drift-Signale für die Closure:** Änderungen an
`server/lead-foundation/{repository,privacy,operations,environment,dispatcher}.js`,
an den Migrationen, an `scripts/lead-ops.mjs` oder am Upload-Verzeichnis der
Support-Journey.

---

## 27. AP22-CLOSURE — unabhängige Nachmessung (2026-09-09)

Die Closure hat **keinen PT-PASS übernommen**. Gemessen wurde neu, gegen einen
echten Serverprozess mit echter Datenbank, gegen einen frischen
Produktionsbuild im Browser und gegen die Laufzeit-Registry — nicht gegen
Dokumentation.

### 27.1 Wie gemessen wurde

| Ebene            | Verfahren                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| 7-Journey-Matrix | `server/ap22-closure.test.js` — echter Serverprozess, echte DB, **leerer** Providerschlüssel, danach DB-Inspektion |
| Browser/Netz     | `e2e/ap22-closure.spec.ts` gegen Produktionsbuild (Client + SSR) und echtes Backend                                |
| Registry         | zur Laufzeit aus `JOURNEY_REGISTRY` gelesen, nicht aus einer Liste im Test                                         |
| Produktionsbuild | `vite build` Client **und** SSR in ein Scratch-Verzeichnis                                                         |

Der Providerschlüssel war absichtlich leer: ohne Adapter **muss** ein Vorgang
gespeichert und ehrlich als `NO_PROVIDER_CONFIGURED` abgelegt werden. Kein
einziger Lead trug nach dem Lauf einen `delivered_at`-Zeitstempel.

### 27.2 Ergebnis

- **7/7 Golden Path**: 202, gemeinsames Envelope, Zeile in der Datenbank vor
  jedem externen Effekt, Locale/Consent-Evidence/Audit-Protokoll vorhanden.
- **7/7 Idempotenz**: derselbe Schlüssel erzeugt genau eine Zeile; ein
  wiederverwendeter Schlüssel mit anderem Inhalt ergibt 409.
- **7/7 Validierung**: fehlende Pflichtangabe und fehlende Einwilligung → 400
  mit `code`/`messageKey`/`fieldErrors`, ohne Stacktrace, Providerdetail oder
  internen Pfad.
- **Rate Limit** greift serverseitig (429 gemessen), Honeypot legt keinen
  Vorgang an, alle sieben Routen hängen hinter `formLimiter`.
- **Outbox/Retry/Backoff/Unknown/Dead Letter/Recovery** am Repository
  nachgestellt: `RETRY_PENDING` mit wachsendem Abstand, `RECONCILIATION_REQUIRED`
  **ohne** zweiten Providerkontakt, `FAILED_TERMINAL` sichtbar und
  wiedervorlagefähig, manuelle Wiedervorlage nur mit Person **und** Grund,
  protokolliert und idempotent.
- **Datenschutz** an der echten Datenbank dieses Laufs: Auskunft, Datenkopie,
  Löschung; fremde Adressen blieben unberührt; ein noch laufender Vorgang wurde
  ehrlich als aufgeschoben gemeldet.
- **Netz vor Consent = 0** über sechs Journey-Seiten, und auch **nach
  Ablehnung** lädt kein Anbieter nach.
- **Geschäftsvorgang unabhängig von Analytics**: nach „Nur notwendige" nimmt
  `/api/contact` die Anfrage unverändert mit 202 an.
- **Chat**: 404 durch den Produktions-Proxy, kein Chat-Markup, kein Chat-Request
  im ausgelieferten Build, keine CSP-Referenz.

**Zahlen:** Closure-Suite 47/47 · Node-Suiten **411/411** (26 Dateien) ·
production-like E2E **5/5** · Produktionsbuild Client + SSR PASS · Guards
`check:routes`, `check:search-index`, `check:i18n`, `check:seo`,
`check:lead-foundation`, `check:content-download` **6/6 PASS** · `tsc` clean ·
`eslint server scripts` clean · prettier clean.

**Sechs Mutationsproben greifen** auf der Closure-Suite: DRY_RUN als DELIVERED
melden · unbekanntes Providerergebnis blind wiederholen · Idempotenz abschalten
(8 Tests rot) · `SUPPORT_UPLOAD_DIR` entfernen · Anhänge auf ein fremdes Volume
legen · (aus PT22.8 unverändert wirksam) die DSAR-Auswahl öffnen.

### 27.3 Der Befund der Closure — und seine Behebung

**Support-Anhänge lagen nicht auf einem persistenten Volume.**

`docker-compose.yml` legte die Datenbank auf das benannte Volume `lead-data`
(`/var/lib/polarisdx`), deklarierte aber **kein** `SUPPORT_UPLOAD_DIR`. Der
Support-Slice fällt ohne diese Variable auf `server/storage/support-uploads`
zurück — im Container also auf die **veränderliche Schicht**. Folgen, alle drei
real:

1. Ein Redeploy hätte jede hochgeladene Datei gelöscht.
2. Die Lead-Zeile hätte weiter `attachments` und `caseDir` behauptet — der
   Datensatz wäre unwahr geworden.
3. Der Zustelladapter liest die Anhänge **von der Platte**; ein nach dem
   Redeploy noch wartender Support-Vorgang hätte sie nicht mehr gefunden.

Das ist kein Topologie-Detail, sondern Lead-Datenhaltung: genau die Datei,
derentwegen jemand den Support kontaktiert, wäre weg gewesen — und der in §26.8
definierte Sicherungsumfang hätte kein Ziel gehabt. Als kleiner
AP22-Regressionsfix behoben: `SUPPORT_UPLOAD_DIR=/var/lib/polarisdx/support-uploads`,
auf **demselben** Mount wie die Datenbank, damit Sicherung und
Wiederherstellung einen Ort treffen. Ein Test prüft beides gegen die
Compose-Datei; zwei Mutationsproben greifen. Die weitere
Produktionstopologie bleibt unverändert AP28.

**Zweiter, kleinerer Befund — im Test, nicht im Produkt:** eine Dateikopie der
Datenbank (`cp`) lieferte einen leeren Stand. Die Datenbank läuft im
WAL-Modus; ohne Checkpoint ist eine Dateikopie unvollständig. Genau davor warnt
`describeBackupScope().database.note`, und genau deshalb sichert
`createLeadBackup` über `VACUUM INTO`. Der Closure-Test verwendet jetzt den
richtigen Weg — die Warnung im Vertrag ist damit an einem echten Fall belegt.

### 27.4 Was die Closure ausdrücklich NICHT bewiesen hat

- **Keine vollständige Produktions-Restore-Übung.** Der Smoke trägt
  `scope: AP22_BOUNDED_SMOKE`. Volume, Downtime, Dienstreihenfolge und
  gemessene RTO/RPO bleiben AP28 PT28.5.2.
- **Keine erzwungene Preview-Isolation ohne Deklaration.** Der Trockenlauf ist
  zwingend, wo `APP_ENV` gesetzt ist. Eine Umgebung ohne `APP_ENV` bleibt von
  der Produktion technisch ununterscheidbar (`LDC-24`).
- **Keine jsdom-Komponententests.** Sie laufen in dieser Umgebung nicht
  (`html-encoding-sniffer` require()t ein ES-Modul, `ERR_REQUIRE_ESM`); das
  trifft auch unveränderte Dateien und ist ein Toolchain-Blocker. Kompensiert,
  nicht übergangen: die UI-Wahrheit (Erfolg erst nach Serverantwort) ist im
  echten Browser gegen den Produktionsbuild gemessen worden.
- **Kein In-Place-`npm run build`.** `dist/client/assets` gehört im
  Arbeitsbaum `root` (aus einem Docker-Build als root); `vite` kann das
  Verzeichnis nicht leeren. `dist/` ist gitignoriert — ein
  Umgebungsartefakt, kein Repo-Defekt. Gebaut wurde in ein Scratch-Verzeichnis.
- **Fünf ESLint-Fehler außerhalb AP22** (`src/components/ui/{Button,Reveal,Textarea}.tsx`,
  `src/pages/consumer/{OrderModal,PriceBadge}.tsx`): `react-refresh/only-export-components`
  und `react-hooks/set-state-in-effect`. Alle Dateien sind gegenüber HEAD
  unverändert bzw. AP21-Bestand; `eslint server scripts` ist sauber. Owner
  AP24/AP27, hier nur festgehalten.

### 27.5 Offene Punkte nach der Closure

| ID       | Sachverhalt                                                                                      | Owner        |
| -------- | ------------------------------------------------------------------------------------------------ | ------------ |
| `LDC-24` | Umgebung ohne `APP_ENV` ist von der Produktion nicht unterscheidbar                              | AP28 PT28.4  |
| `LDC-25` | Aufbewahrungslauf hängt am Anwendungsprozess (kein Cron, keine Führungswahl)                     | AP28         |
| `LDC-26` | `dsar-export` schreibt personenbezogene Daten auf stdout                                         | Betrieb      |
| `LDC-11` | sechs Journeys ohne freigegebene Aufbewahrungsfrist — **technisch geschlossen, rechtlich offen** | Datenschutz  |
| `LDC-21` | ROI-Rechenwerte fallen unter dieselbe Lücke                                                      | Datenschutz  |
| `LDC-04` | kein echter CRM-Adapter — alle Ziele sind Team-Mails hinter der Adaptergrenze                    | AP28/Betrieb |
| `LDC-10` | `requestId` wird ausgeliefert, aber nicht am Lead persistiert                                    | AP26/AP27    |
| `LDC-13` | `findRecentDuplicate()` existiert, wird von keiner Journey aufgerufen                            | AP27         |
| `LDC-17` | Betriebssicht und Wiedervorlage nur als CLI                                                      | AP28         |
| `LDC-18` | Dispatcher läuft pro Prozess, keine Führungswahl                                                 | AP28         |
| `LDC-19` | kein Weg, beim Provider nachzusehen, ob eine Nachricht doch ankam                                | AP28/Betrieb |
| `LDC-20` | `PRACTICE_ORDER_RECEIVER` fällt auf `CONTACT_RECEIVER` zurück                                    | Betrieb      |
| `LDC-22` | `getRuntime*({ env })` steuert nur die Adapterkonfiguration                                      | AP27         |
| `LDC-23` | neue Empfängervariablen fallen auf `CONTACT_RECEIVER` zurück                                     | Betrieb      |

**Keiner davon ist launchkritisch für AP22**: keiner verliert einen Lead, keiner
behauptet einen nicht erreichten Erfolg, keiner öffnet einen Weg an Consent
oder Entitlement vorbei.

**Der AP28-Rest steht unverändert in §26.11.** AP28 ist **nicht** COMPLETE.
