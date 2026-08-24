# AP Execution State

**Globaler serieller Handoff für alle Arbeitspakete AP00–AP33. Es gibt genau diese eine State-Datei.**
Keine zweite State-Struktur anlegen (kein `execution/APxx/STATE.md`, kein `state/APxx.md`,
kein `work-packages/APxx-STATE.md`).

---

## Current

- Work package: AP00 — Programmsteuerung, Scope Lock und Delivery Governance
- Primary task: PT00.4 — Release-Abnahme und Launch-Gate-Verantwortung (noch nicht begonnen)
- Status: IN_PROGRESS <!-- NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE -->
- Baseline: `feat/home-leadmagnet@961f65d`
- Current HEAD: `bf125d218b998f24e002357afe2ea7e9a5965419`
- Started: 2026-08-24
- Last updated: 2026-08-24

<!-- HEAD-Historie: f8692c0 = Commit der PT00.1-Ergebnisse (inkl. der zuvor uncommitteten
     Änderung an src/pages/EpigeneticsPage.tsx), bf125d2 = Commit der PT00.2-Ergebnisse.
     Baseline-Entscheidung unverändert: feat/home-leadmagnet@961f65d. -->

## Completed Work

<!-- Eine Zeile pro abgeschlossenem Primärtask: `PTxx.y — Ergebnis in einem Satz`. Keine Reports. -->

- PT00.1 — Kanonische Decision-/Scope-Baseline hergestellt: `DECISIONS.md` (18/18 Locks `LOCKED`) und
  `SCOPE-CHANGELOG.md` (Change Control) erzeugt, Baseline und Branch-Rollen festgeschrieben.
- PT00.2 — Prioritäts- und Delivery-Modell erzeugt: `RELAUNCH-BACKLOG.md` mit AP-Abdeckung 34/34,
  Prioritätsmodell P0-P3, Wellenlogik W0-W6 und Hard Barriers HB-01 bis HB-08.
- PT00.3 — Risiko- und Annahmenregister erzeugt: `RISK-REGISTER.md` mit 15 aktiven Risiken
  (RISK-001 bis RISK-015), Gate-Bindung 15/15 und 1 akzeptiertem Product Risk.

## Current Invariants

<!-- Nur technische Invarianten, die dieser AP verbindlich gemacht hat und an denen spätere APs hängen.
     Product Decisions NICHT duplizieren — sie stehen in PROJECT-CONSTRAINTS.md.
     Contract-Inhalte NICHT duplizieren — nur die Contract-Datei referenzieren. -->

- Kanonischer Scope: genau ein Dokument — `building-docs/scope/MASTER-SCOPE.md`. Kein zweiter Master-Scope.
- Kanonisches Decision Record: `building-docs/DECISIONS.md` (deckungsgleich mit `PROJECT-CONSTRAINTS.md`).
  Product Decisions werden dort gelesen, nicht hier dupliziert.
- Änderungen an Scope oder bestätigten Entscheidungen laufen ausschließlich über
  `building-docs/SCOPE-CHANGELOG.md`; Repository-Evidenz allein ändert keinen Lock.
- Baseline `feat/home-leadmagnet@961f65d` ist gesperrt; `main@d0fdf29`, `redesign/preview@5673b61`
  und optional `feat/contact-joyful@ab373a3` sind ausschließlich selektive Quellen (Details:
  `DECISIONS.md` §2, `BRANCH-RECONCILIATION-MAP.md`).
- Kanonischer Delivery-/Prioritätsindex: `building-docs/RELAUNCH-BACKLOG.md`. Keine zweite Backlog-Datei.
- Gearbeitet wird nach **Welle -> Hard Barrier -> Priorität**, nicht nach aufsteigender AP-Nummer.
  Die AP-Nummer ist Scope-Struktur, keine Ausführungsreihenfolge.
- Hard Barriers `HB-01`-`HB-08` sind verbindlich serialisierend (Producer/Consumer siehe
  `RELAUNCH-BACKLOG.md` §4). Parallelisierung nur gemäß §5 dort.
- Backlog-Grenze aus `DEC-RL-010` / `DEC-RL-015` ist als P3 geschützt; Hochstufung nur über
  einen `ACCEPTED`-Eintrag in `SCOPE-CHANGELOG.md`.
- Kanonisches Risikoregister: `building-docs/RISK-REGISTER.md`. Keine zweite Risk-Datei.
  Risiko-IDs sind stabil; ein geschlossenes Risiko wird auf `CLOSED` gesetzt, nicht gelöscht.
- Kein Risiko darf eine bestätigte Product Decision als offen darstellen. `ACCEPTED` bedeutet
  bewusst getragen — nicht validiert, behoben oder technisch geschlossen.
- Owner-Rollen im Risikoregister sind fachliche Zuständigkeiten, **nicht** die formale
  Launch-Gate-Verantwortung. Letztere wird erst in PT00.4 verbindlich zugewiesen.

## Files Changed by Current AP

- `building-docs/DECISIONS.md` (neu, PT00.1)
- `building-docs/SCOPE-CHANGELOG.md` (neu, PT00.1)
- `building-docs/RELAUNCH-BACKLOG.md` (neu, PT00.2)
- `building-docs/RISK-REGISTER.md` (neu, PT00.3)
- `building-docs/state/AP-STATE.md` (fortgeschrieben, PT00.1 + PT00.2 + PT00.3)

Quellcode-, Runtime-, Config- und Dependency-Dateien: **keine**.

## Open Blockers

<!-- Jeweils: ID/Kurztitel · was blockiert ist · was zur Auflösung gebraucht wird. -->

- Keine AP00-Ausführungsblocker.
- **Hinweis, kein Blocker für AP00:** `RISK-007` — der Baseline-Commit `961f65d` liegt auf keinem
  Remote-Branch (`git branch -r --contains 961f65d` ist leer), und weder `feat/home-leadmagnet` noch
  der Arbeitsbranch hat ein Upstream. Baseline und gesamte AP00-Arbeit existieren nur lokal.
  Auflösung liegt beim Owner (Remote-Sicherung); AP00 führt keine Git-Remote-Operation aus.

## Explicit Non-Decisions

<!-- Was bewusst NICHT entschieden wurde, damit ein späterer Lauf es nicht als entschieden behandelt. -->

- Launch-Gate-Owner, Abnahmeregeln und PASS/FAIL/BLOCKED-Evidenzregeln sind noch **nicht**
  festgelegt — das ist PT00.4.
- Die Prioritäten in `RELAUNCH-BACKLOG.md` und `RISK-REGISTER.md` sind Delivery-Risiko-Einstufungen,
  **keine** Product Decisions. Sie ändern keinen Lock und ersetzen keine Release-Entscheidung.
- Kein Risiko wurde formal akzeptiert außer `RISK-001` (Product Risk, `DEC-RL-008`). Alle übrigen
  sind `OPEN` bzw. `MITIGATING` und noch nicht abgenommen.
- Die Remote-Sicherung der Baseline-Linie (`RISK-007`) ist **nicht** entschieden und **nicht**
  durchgeführt — sie ist als Owner-Maßnahme vermerkt.
- Ist-/Soll-Prüfung des IglooPro-Claims ist teilweise erfolgt (Locales und Code führen `CV < 2 %`);
  die Prüfung von PDFs und die Vereinheitlichung der Schreibweise stehen aus und gehören zu AP14 / Gate 7.
- Es wurde **keine** Repository-Ist-Analyse im Sinne von AP01 und **kein** selektiver Import vorgenommen.

## Required Context for Next PT

<!-- Nur Abweichungen/Ergänzungen zu CONTEXT-INDEX.md, plus konkrete Repo-Dateien, die der nächste PT braucht. -->

- Keine Abweichung von `CONTEXT-INDEX.md`: AP00 benötigt nur `ALWAYS_READ`.
- Für PT00.4 zusätzlich lesen: `building-docs/RISK-REGISTER.md` (Owner-Rollen §2, Gate-Abdeckung §1.1)
  und `building-docs/RELAUNCH-BACKLOG.md` (Gate-Zuordnung je AP, §3).
- Optionale Evidenz bei Bedarf: `building-docs/QUALITY-GATES.md` — enthält bereits eine Gate-Tabelle
  mit Ist-Status (mehrere Gates auf `⚠ ungeprüft`); in AP00 als Optional context zulässig.
- PT00.4 erzeugt `building-docs/RELEASE-ACCEPTANCE.md` mit 12/12 Launch-Gates und Owner-Rolle je Gate.

## Handoff

- Last completed PT: PT00.3
- Next PT: PT00.4
- Next work package: AP00 (unverändert; AP01 erst nach AP00 Closure Gate `PASS`)

Stand für PT00.4:

- `RISK-REGISTER.md` erstellt — 15 aktive Risiken, davon **P0: 11**, **P1: 4**, P2/P3: 0.
- Accepted product risks: **1** (`RISK-001`, `CV < 2 %`, `DEC-RL-008`).
- Launch-Gate-Zuordnung vorhanden: **15/15** Risiken an mindestens ein Gate gebunden; alle 12 Gates abgedeckt.
- Owner-Rollen je Risiko vergeben — die **verbindliche** Gate-Verantwortung ist offen und Aufgabe von PT00.4.
- Decision Locks 18/18 unverändert `LOCKED`; keine offenen Product Decisions.

---

## Status dieses Dokuments

**Dies ist operativer Zustand, keine Projektautorität.**

Diese Datei darf `building-docs/scope/MASTER-SCOPE.md` oder `building-docs/PROJECT-CONSTRAINTS.md`
**niemals** überschreiben, einschränken oder umdeuten. Sie hält ausschließlich fest, wo die Arbeit
gerade steht — nicht, was gilt.

Bei jedem Widerspruch zwischen diesem Dokument und dem Master-Scope oder den Project Constraints
gewinnen Master-Scope und Project Constraints; dieser Zustand ist dann falsch und wird korrigiert.

## Benutzung

- Zu Beginn eines AP: `Current` neu setzen, `Baseline` und `Current HEAD` aus `git rev-parse HEAD` eintragen,
  `Files Changed by Current AP` leeren.
- Nach jedem abgeschlossenen Primärtask: `Completed Work`, `Files Changed by Current AP`, `Open Blockers`,
  `Required Context for Next PT`, `Handoff` und `Last updated` fortschreiben.
- `Current Invariants` hält fest, welche architektonischen Verträge verbindlich geworden sind — daran hängen spätere APs.
- **Kompakt halten.** Keine vollständigen Abschlussreports, keine Endloschronik. Nur was ein späterer
  Agent-Lauf wirklich benötigt; alles andere gehört in das jeweilige kanonische Dokument.
- Weicht `Current HEAD` unerwartet vom hier vermerkten Stand ab: vollständigen Context Bootstrap neu laden
  (siehe `building-docs/CONTEXT-INDEX.md`), bevor weitergearbeitet wird.
