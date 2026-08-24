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
