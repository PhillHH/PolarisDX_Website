# CRM-INTEGRATION

**Guard-Level: G3.** Wer eine der in §3 genannten Kerndateien ändert, folgt zwingend der
Kontextpflicht in §8. Blindes Editieren ist untersagt.

> ## ⚠ Ziel-, nicht Ist-Zustand
>
> **Heute existiert keine CRM-Anbindung** — keine Bibliothek, kein Adapter, kein ausgehender Aufruf außer
> SendGrid (`BACKEND-LEAD-CURRENT-STATE.md` §7). **Dieser Vertrag beschreibt das SOLL.**
>
> ## CRM_PROVIDER = **UNDECIDED / ADAPTER_BOUNDARY_REQUIRED**
>
> Der Master-Scope legt **keinen** Anbieter fest. §13 hält ausdrücklich fest, dass der _„konkrete
> CRM-Anbieter"_ innerhalb der jeweiligen APs **anhand der hier definierten Verträge** entschieden wird,
> ohne die Decision Locks neu zu öffnen. **Kein Agent wählt einen Anbieter, solange AP22 PT22.3 das
> nicht getan hat.** Das ist **kein Blocker** — §5.4 listet, was vorher gebaut werden kann.

---

## 1. Purpose

Dieser Vertrag definiert die **anbieterneutrale CRM-Anbindung**: wo die Grenze zwischen Domäne und
Anbieter liegt, wie Journeys auf CRM-Objekte abgebildet werden, wie Idempotenz, Fehlerklassifikation und
Beobachtbarkeit funktionieren — und was ohne Anbieterentscheidung bereits umsetzbar ist.

Er ist die **Ziel-Schicht** der Kette
`Frontend-Journey → API → dauerhafter Lead-Datensatz → Zustell-Job → **CRM**/Mail → Zustellstatus → Monitoring`.

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zielautorität:** **`DEC-RL-009`** (_„Leads werden persistent verarbeitet und an ein CRM übergeben"_),
**`DEC-RL-011`** (_„Epigenetik erhält eine eigene Inquiry-/Lead-Strecke mit eigener Backend-/CRM-Zuordnung"_),
**`DEC-RL-014`**, **AP22 PT22.3** (Eigentümer), AP02 PT02.4.3.

**Mitbetroffene APs:** AP08 (mehrsprachige Felder), AP15 PT15.6.7 (eigenes Epigenetik-Routing),
AP19 PT19.3.5, AP20 PT20.2.3/PT20.3.3, AP21 PT21.5.5, AP22 PT22.4/PT22.6/PT22.8,
AP26 PT26.4 (Secrets, Least Privilege, PII-Redaction), AP27 PT27.1.5/PT27.2.4 (Testadapter),
AP28 (Betrieb, Secrets), AP32 PT32.1.3 (Monitoring), AP33 (Doku).

**Launch-Gate 3** hängt an diesem Vertrag. Scope §10 Nr. 9 fordert genau dieses Dokument.
**Stand AP02 PT02.4 (2026-08-24):** Die CRM-Adaptergrenze des Lead-/Backend-Zielbilds ist bestätigt und
um die Abgrenzung zu LD-28 (Deduplication ≠ Idempotenz) ergänzt. Ist-Erhebung und **Vertragslandkarte**
stehen in `LEAD-DATA-CONTRACT.md` §2.1/§3.1. **Keine CRM-Anbieterentscheidung** und keine Integration
durch PT02.4.

**Baseline:** `feat/home-leadmagnet@961f65d`. Keine Decision-Lock-Änderung durch diesen Vertrag.

---

## 3. Current Participating Files / Current State

| Datei                          | Rolle heute                                                                         | Guard  |
| ------------------------------ | ----------------------------------------------------------------------------------- | ------ |
| `server/server.js`             | einziger ausgehender Integrationspunkt — **ausschließlich SendGrid**; kein CRM      | **G3** |
| **künftiger CRM-Adapter**      | existiert nicht                                                                     | **G3** |
| **künftige Persistenzschicht** | existiert nicht; heute gibt es keinen Zustand, den ein Handoff fortschreiben könnte | **G3** |
| `docker-compose.yml`           | Secrets über `env_file`; kein Worker, kein Speicher                                 | G2     |

**Gemessener Ist-Zustand:** Grep über `server/package.json` und `server/server.js` nach
`queue|database|prisma|knex|redis|idempoten` → **leer**. Zwölf hartkodierte Mail-Empfänger ersetzen
heute faktisch das Routing, das ein CRM übernehmen soll.

---

## 4. Target Invariants

### Grenze

**CRM-01 · Der eigene dauerhafte Lead-Datensatz ist die Quelle des Zustellzustands.** Das CRM ist ein
**externes Ziel**, nicht die einzige Kopie des Leads und nicht das System of Record.
_(`LEAD-DATA-CONTRACT.md` LD-03)_

**CRM-02 · Es gibt genau eine Adaptergrenze.** Anwendungs- und Domänencode kennen **keinen** konkreten
Anbieter. Ein Anbieterwechsel berührt ausschließlich die Adapterimplementierung.
_(AP22 PT22.3.1)_

**CRM-03 · Das Domänenmodell ist CRM-unabhängig.** Es folgt `LEAD-DATA-CONTRACT.md`, nicht dem
Objektmodell eines Anbieters. Anbieterbegriffe (Contact, Deal, Ticket, Company …) erscheinen nur
**innerhalb** des Adapters.

**CRM-04 · Das Mapping Journey → CRM-Objekt hat genau einen Eigentümer: AP22 PT22.3.3.** Kein
Seiten-AP definiert eigene CRM-Felder oder eigenes Routing.

### Zustellung

**CRM-05 · Der Handoff ist idempotent.** Ein wiederholter Versuch mit demselben Lead erzeugt im CRM
**keinen zweiten** Datensatz. Umsetzung über eine stabile externe Referenz — der Idempotenzschlüssel bzw.
`lead_id` aus `BACKEND-API-CONTRACT.md` §5.3 Ebene D. _(AP22 PT22.3.2)_

**CRM-06 · Die anbieterseitige Kennung wird zurückgeschrieben.** Nach erfolgreichem Handoff hält der
eigene Datensatz die CRM-Kennung, damit spätere Aktualisierungen ein Upsert statt eines Create sind.

**CRM-07 · Fehler werden klassifiziert, nicht durchgereicht.** Mindestens **transient** (Timeout,
Ratenbegrenzung, vorübergehende Serverfehler → Wiederholung) und **permanent** (Schema-/Mapping-/
Berechtigungsfehler → keine Wiederholung, manuelle Prüfung). Gespeichert wird die Klassifikation, nicht
der Rohkörper. _(AP22 PT22.3.7, `LEAD-DATA-CONTRACT.md` LD-17)_

**CRM-08 · Timeouts sind gesetzt und endlich.** Ein hängender Anbieteraufruf darf weder einen Worker
blockieren noch einen Job unbegrenzt offen halten. _(AP22 PT22.3.6)_

**CRM-09 · Deduplizierung ist ausdrücklich geregelt.** Ob und wie ein bestehender CRM-Kontakt erkannt und
aktualisiert statt neu angelegt wird, entscheidet AP22 PT22.2.7/PT22.3 je Journey.
**Deduplizierung ist nicht Idempotenz** (CRM-05) und das CRM ist **nicht** die einzige Stelle, an der
Duplikate erkannt werden — die Abgrenzung und die Regeln dafür stehen in `LEAD-DATA-CONTRACT.md` LD-28.
_(AP02 PT02.4)_

**CRM-10 · CRM und Mail sind unabhängige Kanäle.** Der Erfolg des einen ist keine Vorbedingung des
anderen, und ein Wiederholungslauf des einen wiederholt nie den bereits erfolgreichen anderen.
_(`LEAD-DELIVERY-CONTRACT.md`)_

### Inhalt

**CRM-11 · Sprache, Herkunft und Kampagnenkontext werden mitgegeben**, strukturiert und aus dem
Lead-Datensatz — nicht als Prosa. _(AP22 PT22.3.4, `LEAD-DATA-CONTRACT.md` LD-10/LD-11)_

**CRM-12 · Datenminimierung gilt auch gegenüber dem CRM.** Übertragen wird, was die Journey fachlich
braucht — nicht der gesamte Datensatz „weil er da ist".

**CRM-13 · Consent-Zustand wird als Datum übertragen, nicht interpretiert.** Marketing-Consent geht als
eigenes Feld mit seiner Evidence; das CRM leitet ihn nicht aus dem Vorhandensein eines Leads ab.
_(`CONSENT-CONTRACT.md` C-13/C-14)_

**CRM-14 · Freitext wird für das Zielsystem sicher kodiert** und unterliegt denselben Längen- und
Sensibilitätsregeln wie überall. _(`LEAD-DATA-CONTRACT.md` LD-25)_

### Betrieb

**CRM-15 · Zugangsdaten liegen außerhalb von Repository und Image** und werden zur Laufzeit injiziert;
Least Privilege. **Keine Secrets in Logs, keine Secrets im Lead-Datensatz.**
_(AP22 PT22.3.5, AP26 PT26.4, `REST-01`)_

**CRM-16 · Keine PII und keine Secrets in Logs.** Protokolliert werden `lead_id`, `request_id`,
Journey-Typ, Fehlerklasse und Zeitstempel — nicht der Payload. _(AP22 PT22.3.8)_

**CRM-17 · Der Handoff ist beobachtbar.** Erfolgsquote, Fehlerklassen, Wartezeit, Dead-Letter-Zugänge
sind messbar und alarmierbar. _(AP22 PT22.4.6, AP28 PT28.6.3)_

**CRM-18 · Preview und Staging erzeugen keine echten CRM-Datensätze.** Entweder ist kein Adapter
registriert, oder er zeigt auf eine isolierte Instanz, oder ein ausdrücklich deklarierter Schalter
unterbindet den Aufruf. Heute existiert `DRY_RUN` **nur für Mail**; die Ausweitung ist
AP22 PT22.8.4 zugewiesen. **Keine Flags erfinden.** _(AGENT-CONTRACT Regel 18)_

**CRM-19 · Schema- und Versionsänderungen des Anbieters sind eine Adapterangelegenheit.** Sie dürfen das
Domänenmodell nicht verändern; nicht abbildbare Änderungen werden als permanenter Fehler klassifiziert
und gemeldet.

**CRM-20 · Ein Testadapter ist verpflichtender Bestandteil.** Alle Tests laufen gegen einen
deterministischen Fake — **niemals gegen ein echtes CRM.** _(AP27 PT27.1.5)_

**CRM-21 · Rückkanäle sind zu prüfen, bevor sie genutzt werden.** Werden Webhooks eingesetzt, sind
Signaturprüfung und Wiederholungsverhalten Pflicht. Bis dahin gilt: kein eingehender Kanal.
_(AP26 PT26.4.3)_

---

## 5. Target Model / Lifecycle

### 5.1 Adaptergrenze

```
Domäne (anbieterneutral)
  Lead-Datensatz  ─────────────►  CRM-Port  ─────────────►  Adapterimplementierung  ──►  CRM
  (LEAD-DATA-CONTRACT)             (Interface)                 (kennt den Anbieter)
        ▲                                                              │
        └──────────  CRM-Kennung + Zustellstatus zurückschreiben  ─────┘
```

Der **Port** ist anbieterfrei und beschreibt fachlich: „diesen Lead im CRM anlegen oder aktualisieren".
Die **Implementierung** kennt Authentifizierung, Objektmodell, Feldnamen und Fehlercodes des Anbieters.
Nur sie wird bei einem Anbieterwechsel ersetzt.

### 5.2 Journey → CRM-Zuordnung

Zuordnung und Zielobjekte entscheidet **AP22 PT22.3.3**; die Tabelle hält die **Anforderung** fest, nicht
die Lösung.

| Lead-Typ                  | CRM-Anforderung                                                                      | Besonderheit                                |
| ------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------- |
| `general_inquiry`         | Standard-Handoff mit Herkunft und Fachbereich                                        | Basisfall                                   |
| `support`                 | **offen:** eigenes Case-/Ticket-Objekt **oder** Lead — AP20 PT20.3.3 lässt beides zu | Anhänge als Referenz, nicht als Inhalt      |
| `consumer_order`          | Bestell-/Order-Zuordnung mit Produkt, Menge, Lieferadresse                           | eigene Adresse; strengste Datenminimierung  |
| `roi_report`              | Lead mit Praxis-/Fachkontext und Referenz auf das Dokument                           | Eingabewerte sind Client-Angaben            |
| **`epigenetics_inquiry`** | **eigenes CRM-Routing** — `DEC-RL-011` fordert eine eigene Zuordnung                 | Panel-/Einrichtungskontext als Felder       |
| `content_download`        | Lead mit **Asset-ID**, Sprache, Source                                               | Marketing-Consent gesondert (AP19 PT19.3.3) |

### 5.3 Handoff-Ablauf

```
1. Job übernimmt Lead (persistiert, LD-01)
2. Domäne → Port-Aufruf (idempotent, mit stabiler Referenz)
3. Adapter: Authentifizierung, Mapping, Aufruf mit Timeout
4. Ergebnis:
   ├── Erfolg    → CRM-Kennung zurückschreiben, Status „zugestellt"
   ├── transient → Wiederholung nach Backoff (LEAD-DELIVERY-CONTRACT)
   └── permanent → keine Wiederholung, manuelle Prüfung, Alarm
5. In jedem Fall: Statusfortschreibung im eigenen Datensatz, nie nur im Log
```

### 5.4 Was **vor** der Anbieterentscheidung gebaut werden kann

Damit `CRM_PROVIDER = UNDECIDED` kein Blocker ist:

| Baustein                                          | Vorab umsetzbar?                                         |
| ------------------------------------------------- | -------------------------------------------------------- |
| Lead-Datenmodell inkl. CRM-Statusfeldern          | **ja** — `LEAD-DATA-CONTRACT.md`                         |
| Persistenz vor Zustellung                         | **ja**                                                   |
| CRM-**Port** (anbieterneutrales Interface)        | **ja** — CRM-02                                          |
| Testadapter / Fake-Provider                       | **ja** — CRM-20                                          |
| Queue, Retry, Backoff, Dead-Letter                | **ja** — `LEAD-DELIVERY-CONTRACT.md`                     |
| Idempotenz-Schlüsselmodell                        | **ja** — `BACKEND-API-CONTRACT.md` §5.3                  |
| Fehlerklassifikation transient/permanent          | **ja** — CRM-07                                          |
| Monitoring, Alarme, Dead-Letter-Sicht             | **ja**                                                   |
| Journey → Zielobjekt-Mapping                      | **teilweise** — fachliche Anforderung ja, Feldnamen nein |
| Authentifizierung, Feldnamen, Rate Limits, Schema | **nein** — anbieterabhängig                              |

**Folge:** Gate 3 lässt sich bis auf die reale Anbieteranbindung vollständig vorbereiten und mit dem
Testadapter nachweisen.

---

## 6. Current Known Debt

| ID       | Schuld                                                                                                                        | Verletzt             |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| **CD-1** | **Keine CRM-Anbindung** — kein Adapter, kein Port, keine Bibliothek                                                           | CRM-01 bis CRM-06    |
| **CD-2** | **Kein Zustellzustand** — Erfolg existiert nur als HTTP-Antwort                                                               | CRM-01               |
| **CD-3** | **Routing über zwölf hartkodierte Mail-Empfänger** in vier Modulkonstanten; personelle Änderungen erfordern einen Code-Deploy | CRM-04               |
| **CD-4** | **Keine Idempotenz** — ein Wiederholungsversuch erzeugte heute unweigerlich Duplikate                                         | CRM-05               |
| **CD-5** | **Rohe Providerfehler in Logs**, teils mit E-Mail-Adressen                                                                    | CRM-16               |
| **CD-6** | **Kein eigenes Epigenetik-Routing** — die Strecke multiplext über `/api/contact`                                              | CRM-04, `DEC-RL-011` |
| **CD-7** | **`DRY_RUN` nur für Mail**, in keiner Konfigurationsdatei deklariert                                                          | CRM-18               |
| **CD-8** | **Kein Testadapter, keine Integrationstests**                                                                                 | CRM-20               |

---

## 7. Modification Rules

**M-01 — Anbieterwissen bleibt im Adapter.** Ein Anbieter-Feldname außerhalb des Adapters ist ein
Vertragsbruch.

**M-02 — Kein Anbieter wird ohne AP22 PT22.3 gewählt.** Wer eine Anbieterbibliothek hinzufügt, ohne dass
die Entscheidung dokumentiert ist, verletzt diesen Vertrag und `AGENT-CONTRACT` Regel 6.

**M-03 — Mapping-Änderungen laufen über AP22.** Ein Seiten-AP meldet einen Bedarf; es definiert kein
Feld.

**M-04 — Vor der ersten echten Anbindung** müssen `DRY_RUN`-Verhalten und Staging-Isolation stehen.
Master-Scope §7: _„`DRY_RUN`-Ausweitung → erste CRM-Anbindung — Preview darf keine echten Leads
schreiben."_

**M-05 — Vor der Betriebsarbeit** muss das Environment-Modell stehen. Master-Scope §7:
_„Docker/Compose-Environment → CRM-Betriebsarbeit."_ _(AP28)_

**M-06 — Zugangsdaten werden nie im Repository, im Image oder in einem Lead-Datensatz abgelegt.**
Rotation ist zu dokumentieren. _(AP28 PT28.3)_

---

## 8. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung am CRM-Adapter, am Port, am Mapping oder an der
Zustellkette:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt (mindestens **AP22 PT22.3**)
4. `building-docs/LEAD-DATA-CONTRACT.md`
5. `building-docs/BACKEND-API-CONTRACT.md`
6. **`building-docs/CRM-INTEGRATION.md`** (dieses Dokument)
7. `building-docs/LEAD-DELIVERY-CONTRACT.md` — sobald Queue, Retry oder Mail berührt sind
8. `building-docs/CONSENT-CONTRACT.md` — wo Consent-Evidence übertragen wird
9. `building-docs/I18N-CONTRACT.md` — für mehrsprachige Felder
10. `building-docs/state/AP-STATE.md`
11. die aktuellen Quell- und Testdateien aus §3
12. `git diff -- <Datei>` **vor** der Änderung

---

## 9. Required Tests / Guards

**Alle Tests laufen gegen den Fake-Adapter. Kein Test spricht ein echtes CRM an.**

| #         | Prüfung                           | Erwartung                                                                                 |
| --------- | --------------------------------- | ----------------------------------------------------------------------------------------- |
| **C-T1**  | Erfolgsfall                       | Lead wird übergeben, CRM-Kennung zurückgeschrieben, Status „zugestellt"                   |
| **C-T2**  | transienter Fehler                | als transient klassifiziert, Wiederholung eingeplant, Lead unversehrt                     |
| **C-T3**  | permanenter Mapping-/Schemafehler | **keine** Wiederholung, manuelle Prüfung, Alarm                                           |
| **C-T4**  | Timeout                           | endlich, Worker nicht blockiert, als transient behandelt                                  |
| **C-T5**  | Wiederholung/Replay               | **kein zweiter CRM-Datensatz** (Idempotenz Ebene D)                                       |
| **C-T6**  | Dedup                             | bestehender Kontakt wird gemäß Regel aktualisiert statt dupliziert                        |
| **C-T7**  | `DRY_RUN`/Staging                 | **kein** ausgehender Aufruf; Zustand nachvollziehbar                                      |
| **C-T8**  | Logredaktion                      | keine PII, keine Secrets, keine Rohkörper — nur `lead_id`, `request_id`, Klasse           |
| **C-T9**  | Journey-Routing                   | jede der sechs Journeys landet an ihrem definierten Ziel, Epigenetik an ihrem **eigenen** |
| **C-T10** | Kanalunabhängigkeit               | CRM-Ausfall verhindert keinen Mailversand und umgekehrt                                   |
| **C-T11** | Anbieterneutralität               | statischer Guard: kein Anbieter-Symbol außerhalb des Adaptermoduls                        |

_(AP27 PT27.1.5, PT27.2.4)_

---

## 10. Forbidden Regressions

- ❌ **Das CRM als einzige Kopie eines Leads behandeln**
- ❌ Anbieterspezifische Typen, Feldnamen oder Fehlercodes außerhalb des Adapters verwenden
- ❌ **Einen CRM-Anbieter wählen, bevor AP22 PT22.3 ihn entschieden hat**
- ❌ Einen nicht-idempotenten Handoff ausliefern
- ❌ Rohe Anbieter-Antwortkörper speichern oder loggen
- ❌ PII oder Secrets in Handoff-Logs schreiben
- ❌ Zugangsdaten im Repository, im Image oder im Lead-Datensatz ablegen
- ❌ Aus Preview/Staging echte CRM-Datensätze erzeugen
- ❌ Gegen ein echtes CRM testen
- ❌ Marketing-Consent im CRM aus der Existenz eines Leads ableiten
- ❌ Den gesamten Lead-Datensatz übertragen, wo die Journey weniger braucht
- ❌ CRM-Erfolg zur Vorbedingung des Mailversands machen (oder umgekehrt)
- ❌ Einen Webhook-Rückkanal ohne Signaturprüfung betreiben

---

## 11. AP Ownership / Lifecycle

| Phase                | AP                                                                | Ergebnis                                                                                                                                   |
| -------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Zielbild             | **AP02 PT02.4.3**                                                 | CRM-Handoff mit Idempotenz als Architekturentscheidung                                                                                     |
| Datenbasis           | **AP22 PT22.2**                                                   | Lead-Modell inkl. CRM-Statusfeldern                                                                                                        |
| **Handoff/Eigentum** | **AP22 PT22.3**                                                   | Adaptergrenze, **Anbieterwahl**, idempotenter Handoff, Routing, mehrsprachige Felder, Secret-Handling, Timeout/Retry, Fehlerklassifikation |
| Zustellrahmen        | **AP22 PT22.4**                                                   | Queue, Retry, Dead-Letter → `LEAD-DELIVERY-CONTRACT.md`                                                                                    |
| Journey-Zuordnung    | **AP15 PT15.6.7**, **AP19 PT19.3.5**, **AP20**, **AP21 PT21.5.5** | fachliche Anforderungen je Strecke                                                                                                         |
| Security             | **AP26 PT26.4**                                                   | Secrets, Least Privilege, PII-Redaction, Webhook-Signaturen                                                                                |
| Betrieb              | **AP28 PT28.3/PT28.6**                                            | Secret-Injektion, Monitoring der Handoff-Fehler                                                                                            |
| Absicherung          | **AP27 PT27.1.5/PT27.2.4**                                        | Testadapter, Integrationstests — Voraussetzung für Gate 3                                                                                  |
| Post-Launch          | **AP32 PT32.1.3**                                                 | CRM-Fehler sichtbar                                                                                                                        |
| Dokumentation        | **AP33 PT33.1.7**                                                 | Lead Platform / CRM / Queue in der Entwicklerdoku                                                                                          |

**Änderungen an diesem Vertrag** verantwortet AP22. Decision Locks werden hier nie geändert.
