# LEAD-DELIVERY-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Kerndateien ändert, folgt zwingend der
Kontextpflicht in §8. Blindes Editieren ist untersagt.

> ## ⚠ Ziel-, nicht Ist-Zustand
>
> **Heute gibt es keine Queue, keinen Retry, kein Dead-Letter.** Jede Zustellung läuft synchron im
> HTTP-Request; ein Providerfehler beantwortet die Anfrage mit `500` und die Daten sind verloren
> (`BACKEND-LEAD-CURRENT-STATE.md` §8). **Dieser Vertrag beschreibt das SOLL.**

---

## 1. Purpose

Dieser Vertrag besitzt **Warteschlange, Wiederholung, Mailversand und Fehlerbehebung**. Er definiert den
Lebenszyklus einer Zustellung, die Wiederholungsregeln, den manuellen Rettungspfad und die
Beobachtbarkeit.

Er ist die **Zustellschicht** der Kette
`Frontend-Journey → API → dauerhafter Lead-Datensatz → **Zustell-Job → CRM/Mail → Zustellstatus** → Monitoring`.

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zielautorität:** **`DEC-RL-009`**, **`DEC-RL-014`**, **`REST-01`** (Docker/Compose, persistente Daten
separat und backupfähig, Healthchecks, Monitoring), **AP22 PT22.4** (Eigentümer), AP02 PT02.4.4/.7.

**Mitbetroffene APs:** AP08 PT08.5 (lokalisierte Systemmails), AP14 PT14.6, AP15 PT15.6.8,
AP19 PT19.3.7–.9 (geschützte Asset-Auslieferung), AP20 PT20.3.5, AP21 PT21.5.6,
AP22 PT22.5–PT22.6, AP26 PT26.4 (Secrets, Redaction), AP27 PT27.2.5 (Retry/Dead-Letter-Tests),
**AP28 PT28.2/PT28.5/PT28.6** (Worker, Persistenz, Monitoring), AP31 PT31.5 (Rollback), AP32 (Betrieb).

**Launch-Gate 3** und **Gate 10** hängen an diesem Vertrag.
**Baseline:** `feat/home-leadmagnet@961f65d`. Keine Decision-Lock-Änderung durch diesen Vertrag.

---

## 3. Current Participating Files / Current State

| Datei                         | Rolle heute                                                                                                                                                                                      | Guard  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| `server/server.js`            | fünf Endpunkte mit **synchronem** `await sgMail.send(...)` vor jedem Erfolg; `Promise.all` bei zwei Endpunkten; `DRY_RUN`-Kill-Switch nur für Mail (`:51-63`); `buildRoiPdf` synchron im Handler | **G3** |
| **künftiger Worker**          | existiert nicht                                                                                                                                                                                  | **G3** |
| **künftige Queue/Persistenz** | existiert nicht                                                                                                                                                                                  | **G3** |
| `docker-compose.yml`          | zwei Services; **kein Worker, kein persistenter Speicher**                                                                                                                                       | G2     |

**Gemessener Ist-Zustand:** Grep nach `queue|worker|retry|backoff|dead-letter|cron|attempt|replay` in
`server/server.js` → **leer**.

---

## 4. Target Invariants

### Grundzusage

**LDV-01 · Ein Zustellfehler löscht oder verwaist niemals einen angenommenen Lead.** Der Datensatz
bleibt bestehen, sein Zustand bleibt fortschreibbar, die Zustellung bleibt wiederholbar.
_(`DEC-RL-009`, Gate 3)_

**LDV-02 · Persist-before-enqueue.** Ein Arbeitsauftrag entsteht erst, nachdem der Lead dauerhaft
gespeichert ist. _(AP22 PT22.4.1, `LEAD-DATA-CONTRACT.md` LD-01)_

**LDV-03 · Datensatz und Arbeitsauftrag sind konsistent.** Es darf weder ein Auftrag ohne Lead noch ein
Lead ohne geplanten Auftrag entstehen — über eine Transaktion oder ein gleichwertiges Verfahren
(z. B. Outbox). Die technische Umsetzung entscheidet AP22 PT22.4 zusammen mit der Speicherwahl.

**LDV-04 · Zustellung ist asynchron, wo sie externe Systeme berührt.** Die Antwort an den Nutzer hängt
nicht am Provider. _(`BACKEND-API-CONTRACT.md` API-01)_

### Wiederholung

**LDV-05 · Fehler werden klassifiziert.** **Transient** (Timeout, Ratenbegrenzung, vorübergehender
Serverfehler) ⇒ Wiederholung. **Permanent** (Validierungs-, Mapping-, Berechtigungs-, Adressfehler) ⇒
keine Wiederholung, sofort manuelle Prüfung. _(AP22 PT22.4.2, `CRM-INTEGRATION.md` CRM-07)_

**LDV-06 · Wiederholungen sind begrenzt und laufen mit wachsendem Abstand** (Backoff). Eine
Endlosschleife ist ausgeschlossen. **Maximalzahl und Abstände legt AP22 PT22.4.2–.3 fest** — dieser
Vertrag erfindet keine Zahlen. _(AP22 PT22.4.3)_

**LDV-07 · Nach Erschöpfung landet der Auftrag in einem Dead-Letter-/Manual-Review-Zustand**, der
sichtbar, auffindbar und wiederanstoßbar ist. _(AP22 PT22.4.4)_

**LDV-08 · Replay ist sicher und idempotent.** Ein manuell oder automatisch wiederangestoßener Auftrag
erzeugt keine zweite Wirkung. _(AP22 PT22.4.7)_

### Kanäle

**LDV-09 · CRM und Mail sind unabhängige Zustellkanäle** mit **eigenem** Status, eigenem Versuchszähler
und eigener Fehlerklasse. _(`CRM-INTEGRATION.md` CRM-10)_

**LDV-10 · Ein erfolgreicher Kanal wird bei der Wiederholung eines anderen nicht erneut ausgeführt.**
Das ist die Antwort auf das heutige Teilzustellungsproblem: scheitert die zweite von zwei Mails, darf ein
erneuter Versuch die erste nicht ein zweites Mal senden.

**LDV-11 · Idempotenz an der Zustellgrenze.** Jeder Kanal prüft vor dem Senden, ob er für diesen Lead
bereits erfolgreich war — Ebenen **C**, **D** und **E** aus `BACKEND-API-CONTRACT.md` §5.3.

**LDV-12 · Teilerfolg ist ein gültiger, sichtbarer Zustand.** „CRM zugestellt, Mail offen" ist kein
Fehler des Gesamtvorgangs, sondern ein Zwischenzustand mit eigener Weiterverarbeitung.

### Ausführung

**LDV-13 · Ein Worker-Absturz verliert keinen Auftrag.** Ein in Bearbeitung befindlicher Auftrag wird
nach Ablauf seiner Bearbeitungszusage (Lease/Sichtbarkeitsfenster) erneut ausgeliefert. Kombiniert mit
LDV-11 führt das nicht zu Doppelzustellung.

**LDV-14 · Nebenläufige Bearbeitung desselben Auftrags ist ausgeschlossen** — über Lease, Lock oder
Sichtbarkeitsfenster; die Technik entscheidet AP22 PT22.4 mit der Queue-Wahl.

**LDV-15 · Providertimeouts sind gesetzt und endlich.** Kein Aufruf darf einen Worker unbegrenzt binden.

**LDV-16 · Preview und Staging erzeugen keine echten Zustellungen.** Heute existiert `DRY_RUN`
**ausschließlich für den Mailversand**; die Ausweitung auf CRM und Queue ist AP22 PT22.8.4 zugewiesen.
**Keine Flags erfinden.** _(AP22 PT22.4.8, AGENT-CONTRACT Regel 18)_

### E-Mail

**LDV-17 · Der Mailprovider ist ein Transportadapter, nicht die Persistenz.** SendGrid darf bleiben; es
definiert weder Annahme noch Aufbewahrung. _(`DEC-RL-009`)_

**LDV-18 · Mailversand entscheidet im Regelfall nicht über die Annahme des Leads.** Ausnahmen müssten in
`BACKEND-API-CONTRACT.md` je Endpunkt ausdrücklich definiert sein.

**LDV-19 · Nutzergerichtete Mails sind lokalisiert.** Bestätigungen, Autoresponder und
Zustellnachrichten folgen der Sprache des Leads. Rein interne Team-Benachrichtigungen dürfen einsprachig
bleiben. _(AP08 PT08.5, `I18N-CONTRACT.md` I-12)_

**LDV-20 · Empfänger werden serverseitig bestimmt**, nie aus einem Client-Feld.
_(`BACKEND-API-CONTRACT.md` API-18)_

**LDV-21 · Providerfehler werden vor Speicherung und Protokollierung redigiert.** Keine Rohkörper,
keine Secrets, keine unnötige PII. _(AP26 PT26.4.4, `LEAD-DATA-CONTRACT.md` LD-17)_

**LDV-22 · Kein PII-schweres Payload-Logging.** Protokolliert werden `lead_id`, `request_id`, Kanal,
Fehlerklasse, Versuch und Zeitstempel.

### Dokumente und Assets

**LDV-23 · Die Erzeugung eines Dokuments darf den zugrundeliegenden Lead nicht gefährden.** Scheitert
sie, bleibt der Lead angenommen und die Erzeugung wiederholbar. Konkret für den ROI-Report:
**ob die PDF-Erzeugung synchron bleibt oder ein eigener Job wird, entscheidet AP19/AP22** — verbindlich
ist die **Zuverlässigkeitsanforderung**, nicht die Bauform. Wird sie synchron ausgeführt, darf ein
Fehlschlag weder die Annahme noch die Lead-Zustellung verhindern.

**LDV-24 · Gated Assets werden kontrolliert ausgeliefert.** Wo echtes Gating beabsichtigt ist, darf das
Asset nicht trivial über eine frei erratbare URL erreichbar sein; die Zustellung erfolgt über Mail oder
einen geeigneten, ggf. befristeten Zugangslink. _(AP19 PT19.3.7–.9, Gate 10)_

### Beobachtbarkeit

**LDV-25 · Der Zustellzustand lebt im Datensatz, nicht im Log.** Ein Log ist eine Spur, kein Zustand.
_(`LEAD-DATA-CONTRACT.md` LD-16)_

**LDV-26 · Kennzahlen sind messbar:** Warteschlangenlänge, Fehlerquote je Kanal, Wiederholungen,
Dead-Letter-Zugänge, Zustellverzögerung, Worker-Gesundheit. _(AP28 PT28.6.2–.4)_

**LDV-27 · Alarme sind definiert** — mindestens für wachsendes Dead-Letter, anhaltende Kanalfehler und
gestoppte Verarbeitung. _(AP22 PT22.4.6)_

**LDV-28 · Jeder Zustellversuch hinterlässt eine Prüfspur** mit Zeitpunkt, Kanal, Ergebnis und
Fehlerklasse — korrelierbar über `lead_id` und `request_id`.

---

## 5. Target Model / Lifecycle

### 5.1 Zustände

Namen sind konzeptionell; die endgültige Benennung entscheidet AP22 PT22.4.5 („Zustandsmaschine").

```
RECEIVED          Anfrage eingegangen
   ↓
VALIDATED         Schema erfüllt (BACKEND-API-CONTRACT API-03)
   ↓
PERSISTED         dauerhafter Lead-Datensatz existiert   ◄── ab hier kein Verlust mehr (LDV-01)
   ↓
QUEUED            Zustellauftrag eingereiht (je Kanal)
   ↓
PROCESSING        Worker hält eine Bearbeitungszusage
   ├──► DELIVERED          Kanal erfolgreich, Endzustand des Kanals
   ├──► RETRY_PENDING      transienter Fehler, nächster Versuch geplant  ──┐
   ├──► FAILED_PERMANENT   permanenter Fehler, keine Wiederholung          │
   └──► DEAD_LETTER        Versuche erschöpft → MANUAL_REVIEW              │
                                    ▲                                      │
                                    └──────────── Replay (LDV-08) ─────────┘
```

**Regeln:** Die Zustände gelten **je Kanal**, nicht global. Der Lead ist erst abgeschlossen, wenn jeder
geforderte Kanal einen Endzustand erreicht hat. `FAILED_PERMANENT` und `DEAD_LETTER` sind **sichtbare
Betriebszustände**, keine stillen Endpunkte.

### 5.2 Ablauf

```
API: validieren → persistieren → Aufträge einreihen → Annahme antworten
Worker: Auftrag übernehmen (Lease)
        → prüfen, ob Kanal bereits erfolgreich (LDV-11)   → ja: überspringen
        → Adapter mit Timeout aufrufen
        → Ergebnis klassifizieren (LDV-05)
        → Status im Datensatz fortschreiben (LDV-25)
        → bei transient: Backoff planen; bei permanent: manuelle Prüfung
```

### 5.3 Kanäle

| Kanal            | Adapter                                       | Zweck                                      | Idempotenzebene |
| ---------------- | --------------------------------------------- | ------------------------------------------ | --------------- |
| **CRM**          | anbieterneutraler Port (`CRM-INTEGRATION.md`) | Lead ins Zielsystem                        | **D**           |
| **Mail: intern** | Transportadapter (heute SendGrid)             | Team-Benachrichtigung                      | **E**           |
| **Mail: Nutzer** | derselbe Adapter                              | Bestätigung/Autoresponder, **lokalisiert** | **E**           |
| **Asset/Report** | Erzeugung + Zustellung                        | ROI-Report, gated Download                 | **C**           |

Jeder Kanal hat eigenen Status und eigene Wiederholungszählung (LDV-09).

### 5.4 Anforderungen an AP28 (`REST-01`)

Nur die Annahmen, die die Zustellschicht an den Betrieb stellt — der Deployment-Vertrag entsteht in AP28:

| Anforderung                                                       | Warum                    |
| ----------------------------------------------------------------- | ------------------------ |
| Persistenter Speicher **außerhalb** des flüchtigen App-Containers | LDV-01, AP28 PT28.5.5    |
| Backup- und Restore-Fähigkeit des Lead-Speichers                  | Gate 3, AP28 PT28.5.2    |
| Worker-Prozess bzw. -Service, falls getrennt                      | AP28 PT28.2.3            |
| Healthchecks und Restart Policies für Worker                      | LDV-13, AP28 PT28.2.7–.8 |
| Metriken/Alarme für Warteschlange, Dead-Letter, Kanalfehler       | LDV-26/-27, AP28 PT28.6  |
| Secret-Injektion außerhalb von Image und Repository               | LDV-21, AP28 PT28.3      |
| Migrations-/Rollback-Verträglichkeit von App und Schema           | AP28 PT28.4.3/.7         |
| Getrennte Umgebungen mit wirksamer Isolation                      | LDV-16, AP28 PT28.1      |

---

## 6. Current Known Debt

| ID         | Schuld                                                                                                                       | Verletzt                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **LVD-1**  | **Keine Queue, kein Retry, kein Dead-Letter**                                                                                | LDV-02 bis LDV-08                                              |
| **LVD-2**  | **Synchrone Zustellung im Request** — jedes `await sgMail.send` steht vor dem Erfolgscode                                    | LDV-04, LDV-18                                                 |
| **LVD-3**  | **Lead-Verlust bei Providerfehler** — `catch` → `500`, Daten verworfen                                                       | LDV-01                                                         |
| **LVD-4**  | **Teilzustellungs-Duplikate** — `Promise.all` mit zwei Mails: scheitert die zweite, sendet ein Nutzer-Retry die erste erneut | LDV-10, LDV-11                                                 |
| **LVD-5**  | **Keine Idempotenz an der Zustellgrenze**                                                                                    | LDV-11                                                         |
| **LVD-6**  | **Synchrone PDF-Erzeugung im Handler** — Antwortzeit umfasst PDF-Bau plus zwei Provider-Roundtrips                           | LDV-23                                                         |
| **LVD-7**  | **Systemmails hartkodiert deutsch** — Support-Bestätigung und ROI-Report inkl. `de-DE`-Zahlenformat                          | LDV-19                                                         |
| **LVD-8**  | **Rohe Providerfehler in Logs**, zwei Endpunkte loggen E-Mail-Adressen                                                       | LDV-21, LDV-22                                                 |
| **LVD-9**  | **Zwölf hartkodierte Empfänger** in vier Modulkonstanten                                                                     | LDV-20 _(erfüllt: serverseitig)_, aber ohne Konfigurierbarkeit |
| **LVD-10** | **Kein Zustellstatus, kein Monitoring, keine Alarme**                                                                        | LDV-25 bis LDV-28                                              |
| **LVD-11** | **`DRY_RUN` nur für Mail**, in keiner Konfigurationsdatei deklariert                                                         | LDV-16                                                         |
| **LVD-12** | **Gated Assets frei abrufbar** unter `public/downloads/`                                                                     | LDV-24                                                         |

---

## 7. Modification Rules

**M-01 — Nie zustellen, bevor persistiert ist.** Wer einen neuen Kanal ergänzt, ergänzt ihn hinter
LDV-02, nie davor.

**M-02 — Jeder neue Kanal bringt Status, Klassifikation, Wiederholung und Idempotenz mit.** Ein Kanal
ohne diese vier ist unvollständig.

**M-03 — Retry-Parameter sind zentral, nicht je Aufrufstelle.** Maximalzahl und Backoff gehören in die
Zustellschicht.

**M-04 — Vor der ersten echten CRM-Anbindung** müssen `DRY_RUN`-Verhalten und Staging-Isolation stehen
(Master-Scope §7).

**M-05 — `server/server.js` nie als Datei aus `main` übernehmen** (**N1**); Kandidat **A14** ist ein Hunk.

**M-06 — Zustandsänderungen laufen über den Datensatz.** Ein Kanal, der seinen Erfolg nur ins Log
schreibt, verletzt LDV-25.

**M-07 — Beim Entfernen einer Journey** werden auch ihre Aufträge, Zustände und Alarme entfernt.

---

## 8. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an `server/server.js`, am künftigen Worker, an der Queue,
an den Mail-/Asset-Adaptern oder an `docker-compose.yml` (sobald Worker/Storage hinzukommen):

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt (mindestens **AP22 PT22.4**, bei Betrieb **AP28**)
4. `building-docs/LEAD-DATA-CONTRACT.md`
5. `building-docs/BACKEND-API-CONTRACT.md`
6. `building-docs/CRM-INTEGRATION.md` — sobald CRM-Zustellung berührt ist
7. **`building-docs/LEAD-DELIVERY-CONTRACT.md`** (dieses Dokument)
8. `building-docs/CONSENT-CONTRACT.md` — wo Consent-Evidence mitgeführt wird
9. `building-docs/I18N-CONTRACT.md` — für Systemmails und nutzersichtbare Zustellungen
10. `building-docs/state/AP-STATE.md`
11. die aktuellen Quell- und Testdateien aus §3
12. `git diff -- <Datei>` **vor** der Änderung

---

## 9. Required Tests / Guards

**Kein Test darf eine echte Mail senden oder ein echtes CRM aufrufen.**

| #         | Prüfung                                       | Erwartung                                                            |
| --------- | --------------------------------------------- | -------------------------------------------------------------------- |
| **V-T1**  | Datensatz existiert vor dem Einreihen         | kein Auftrag ohne Lead, kein Lead ohne Auftrag                       |
| **V-T2**  | transienter Fehler                            | Wiederholung mit wachsendem Abstand, Lead unversehrt                 |
| **V-T3**  | permanenter Fehler                            | **keine** Endlosschleife, sofort manuelle Prüfung                    |
| **V-T4**  | Versuche erschöpft                            | Dead-Letter/Manual-Review **erreichbar und sichtbar**                |
| **V-T5**  | Worker-Neustart mitten in der Bearbeitung     | Auftrag wird erneut ausgeliefert, **keine** Doppelzustellung         |
| **V-T6**  | Replay eines erfolgreichen Auftrags           | keine zweite Wirkung                                                 |
| **V-T7**  | Teilerfolg                                    | erfolgreicher Kanal wird beim Retry des anderen **nicht** wiederholt |
| **V-T8**  | Providertimeout                               | endlich, als transient klassifiziert, Worker frei                    |
| **V-T9**  | Mail-Provider fällt aus                       | Lead bleibt angenommen und zustellbar                                |
| **V-T10** | Autoresponder scheitert, interne Mail gelingt | unabhängige Zustände, kein Duplikat beim Retry                       |
| **V-T11** | Dokument-/PDF-Erzeugung scheitert             | Lead bleibt angenommen; Erzeugung wiederholbar                       |
| **V-T12** | `DRY_RUN`/Staging                             | **keine** externe Zustellung; Zustand nachvollziehbar                |
| **V-T13** | Logredaktion                                  | **kein** roher Nutzlast-Body, keine Secrets, keine unnötige PII      |
| **V-T14** | Lokalisierung                                 | nutzergerichtete Mail in der Sprache des Leads                       |
| **V-T15** | Gated Asset                                   | Zustellung kontrolliert; nicht trivial am Gate vorbei abrufbar       |
| **V-T16** | je Journey ein Zustellpfad                    | sechs Journeys, jeweils mit Fake-Adaptern                            |

_(AP27 PT27.2.4–.6, PT27.3)_

---

## 10. Forbidden Regressions

- ❌ **Extern zustellen, bevor der Lead dauerhaft gespeichert ist**
- ❌ Einen Lead bei einem normalen Providerfehler verlieren
- ❌ Den Erfolg des Mailversands zur Bedingung der Lead-Annahme machen
- ❌ Einen Mailprovider als Persistenz behandeln
- ❌ Unbegrenzte oder abstandslose Wiederholungen
- ❌ Einen Auftrag ohne Dead-Letter-/Manual-Review-Ausgang bauen
- ❌ **Einen bereits erfolgreichen Kanal beim Retry eines anderen erneut ausführen**
- ❌ Replay ohne Idempotenzprüfung zulassen
- ❌ Zustellzustand nur ins Log schreiben statt in den Datensatz
- ❌ Rohe Provider-Antwortkörper oder Secrets speichern oder protokollieren
- ❌ Vollständige Nutzlasten mit PII protokollieren
- ❌ Nutzergerichtete Mails unlokalisiert versenden
- ❌ Aus Preview/Staging echte Zustellungen erzeugen
- ❌ Flags für neue Kanäle erfinden, statt sie in AP22/AP28 zu deklarieren
- ❌ Ein gated Asset frei erratbar ausliefern, wo echtes Gating beabsichtigt ist
- ❌ Empfänger aus einem Client-Feld ableiten
- ❌ `server/server.js` als Datei aus `main` übernehmen

---

## 11. AP Ownership / Lifecycle

| Phase                   | AP                                 | Ergebnis                                                                                                                    |
| ----------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Zielbild                | **AP02 PT02.4.4/.7**               | Queue/Retry/Dead-Letter, Mail vom Request-Lifecycle entkoppeln                                                              |
| Datenbasis              | **AP22 PT22.2**                    | Statusfelder je Kanal                                                                                                       |
| **Zustellung/Eigentum** | **AP22 PT22.4**                    | Persistenz vor Handoff, Retry-Policy, Backoff, Dead-Letter, Zustandsmaschine, Monitoring/Alarme, sicherer Replay, `DRY_RUN` |
| Migration               | **AP22 PT22.5.6**                  | bestehende SendGrid-Zustellung in einen retryfähigen Ablauf überführen                                                      |
| Lokalisierung           | **AP08 PT08.5**, **AP22 PT22.5.7** | Autoresponder und Zustelltexte × 10                                                                                         |
| Gated Asset             | **AP19 PT19.3.7–.9**               | geschützte Auslieferung, ggf. befristeter Zugangslink                                                                       |
| Dokument                | **AP14 PT14.6**, **AP19 PT19.4.1** | ROI-Report als Zustellgegenstand                                                                                            |
| Security                | **AP26 PT26.4**                    | Secrets, Redaction, Replay ohne Doppelwirkung                                                                               |
| **Betrieb**             | **AP28 PT28.2/PT28.5/PT28.6**      | Worker, persistenter Speicher, Backup/Restore, Healthchecks, Metriken                                                       |
| Absicherung             | **AP27 PT27.2.5**                  | Retry-/Dead-Letter-Tests — Voraussetzung für Gate 3                                                                         |
| Launch                  | **AP31 PT31.5.3**                  | Datenkompatibilität beim Rollback                                                                                           |
| Betrieb danach          | **AP32 PT32.1.3–.4**               | Queue-Tiefe, Fehlerquoten, Dead-Letter sichtbar                                                                             |
| Dokumentation           | **AP33 PT33.1.7**                  | Lead Platform / CRM / Queue in der Entwicklerdoku                                                                           |

**Änderungen an diesem Vertrag** verantwortet AP22, bei Betriebsbezug gemeinsam mit AP28.
Decision Locks werden hier nie geändert.
