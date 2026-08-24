# LEAD-DATA-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Kerndateien ändert, folgt zwingend der
Kontextpflicht in §8. Blindes Editieren ist untersagt.

> ## ⚠ Ziel-, nicht Ist-Zustand
>
> **Heute existiert keine Lead-Persistenz.** `BACKEND-LEAD-CURRENT-STATE.md` §7 belegt dreifach:
> keine Datenbank-, ORM- oder Queue-Abhängigkeit, kein Dateisystem-Schreibzugriff, kein Idempotenz-
> schlüssel. Ein Lead lebt heute genau so lange wie der HTTP-Request.
> **Dieser Vertrag beschreibt das SOLL** und ist kein Beleg dafür, dass etwas davon gebaut ist.

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

**Gemessener IST-Zustand, nicht das SOLL.** Erhebung durch Quelllesung ohne Änderung — kein Request
abgesetzt, keine Mail gesendet, kein CRM-Aufruf, kein Lead erzeugt.

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
