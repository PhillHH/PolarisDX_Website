# AP Execution State

**Globaler serieller Handoff für alle Arbeitspakete AP00–AP33. Es gibt genau diese eine State-Datei.**
Keine zweite State-Struktur anlegen (kein `execution/APxx/STATE.md`, kein `state/APxx.md`,
kein `work-packages/APxx-STATE.md`).

---

## Current

- Work package: AP00 — Programmsteuerung, Scope Lock und Delivery Governance
- Primary task: PT00.3 — Risiko- und Annahmenregister (noch nicht begonnen)
- Status: IN_PROGRESS <!-- NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE -->
- Baseline: `feat/home-leadmagnet@961f65d`
- Current HEAD: `f8692c0f6ec2ce4b32eb2a9c478db014f163529b`
- Started: 2026-08-24
- Last updated: 2026-08-24

<!-- HEAD-Abweichung geklärt: f8692c0 ist der Commit, mit dem die PT00.1-Ergebnisse
     (building-docs/**) und die zuvor uncommittete Änderung an src/pages/EpigeneticsPage.tsx
     festgeschrieben wurden. Baseline-Entscheidung unverändert: feat/home-leadmagnet@961f65d. -->

## Completed Work

<!-- Eine Zeile pro abgeschlossenem Primärtask: `PTxx.y — Ergebnis in einem Satz`. Keine Reports. -->

- PT00.1 — Kanonische Decision-/Scope-Baseline hergestellt: `DECISIONS.md` (18/18 Locks `LOCKED`) und
  `SCOPE-CHANGELOG.md` (Change Control) erzeugt, Baseline und Branch-Rollen festgeschrieben.
- PT00.2 — Prioritäts- und Delivery-Modell erzeugt: `RELAUNCH-BACKLOG.md` mit AP-Abdeckung 34/34,
  Prioritätsmodell P0-P3, Wellenlogik W0-W6 und Hard Barriers HB-01 bis HB-08.

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

## Files Changed by Current AP

- `building-docs/DECISIONS.md` (neu, PT00.1)
- `building-docs/SCOPE-CHANGELOG.md` (neu, PT00.1)
- `building-docs/RELAUNCH-BACKLOG.md` (neu, PT00.2)
- `building-docs/state/AP-STATE.md` (fortgeschrieben, PT00.1 + PT00.2)

Quellcode-, Runtime-, Config- und Dependency-Dateien: **keine**.

## Open Blockers

<!-- Jeweils: ID/Kurztitel · was blockiert ist · was zur Auflösung gebraucht wird. -->

- NONE

## Explicit Non-Decisions

<!-- Was bewusst NICHT entschieden wurde, damit ein späterer Lauf es nicht als entschieden behandelt. -->

- Risiko-/Annahmenregister ist noch **nicht** erstellt — das ist PT00.3.
- Launch-Gate-Owner und Abnahmeregeln sind noch **nicht** festgelegt — das ist PT00.4.
- Die Prioritäten in `RELAUNCH-BACKLOG.md` sind Delivery-Risiko-Einstufungen, **keine** Product
  Decisions. Sie ändern keinen Lock und ersetzen keine Release-Entscheidung.
- Innerhalb eines AP sind die einzelnen PTs **nicht** einzeln priorisiert; sie erben die AP-Priorität,
  soweit `RELAUNCH-BACKLOG.md` §3.2 nichts anderes ausweist.
- Kein Termin-, Aufwands- oder Kapazitätsmodell entschieden — PT00.2 priorisiert nach Launch-Risiko,
  nicht nach Aufwand.
- Ist-/Soll-Prüfung des IglooPro-Claims im Repository ist **nicht** erfolgt und gehört zu AP14 / Gate 7.
  Die Product Decision selbst (`DEC-RL-008`, `CV < 2 %`) ist geschlossen und wird davon nicht berührt.
- Es wurde **keine** Repository-Ist-Analyse und **kein** selektiver Import vorgenommen — das ist AP01.

## Required Context for Next PT

<!-- Nur Abweichungen/Ergänzungen zu CONTEXT-INDEX.md, plus konkrete Repo-Dateien, die der nächste PT braucht. -->

- Keine Abweichung von `CONTEXT-INDEX.md`: AP00 benötigt nur `ALWAYS_READ`.
- Für PT00.3 zusätzlich lesen: `building-docs/DECISIONS.md` und `building-docs/RELAUNCH-BACKLOG.md`
  (Hard Barriers §4, Backlog-Grenze §6 — Risiken werden an AP/PT und Launch Gates gekoppelt).
- PT00.3 erzeugt `building-docs/RISK-REGISTER.md` mit mindestens `RISK-001`-`RISK-006`
  (siehe `work-packages/AP00.md`, Abschnitt PT00.3).

## Handoff

- Last completed PT: PT00.2
- Next PT: PT00.3
- Next work package: AP00 (unverändert; AP01 erst nach AP00 Closure Gate `PASS`)

Stand für PT00.3:

- `RELAUNCH-BACKLOG.md` erstellt — AP coverage 34/34, Prioritätsmodell P0-P3, HB-01 bis HB-08 dokumentiert.
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
