# AP Execution State

**Globaler serieller Handoff für alle Arbeitspakete AP00–AP33. Es gibt genau diese eine State-Datei.**
Keine zweite State-Struktur anlegen (kein `execution/APxx/STATE.md`, kein `state/APxx.md`,
kein `work-packages/APxx-STATE.md`).

---

## Current

- Work package: AP00 — Programmsteuerung, Scope Lock und Delivery Governance
- Primary task: AP00 Closure Gate (Validator, kein fünfter Primärtask) — noch nicht begonnen
- Status: IN_PROGRESS <!-- NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE -->
- Baseline: `feat/home-leadmagnet@961f65d`
- Current HEAD: `cad9b6cc2dad92e638e7b11db98b792207ed30fb`
- Started: 2026-08-24
- Last updated: 2026-08-24

<!-- HEAD-Historie: f8692c0 = PT00.1-Ergebnisse (inkl. der zuvor uncommitteten Änderung an
     src/pages/EpigeneticsPage.tsx), bf125d2 = PT00.2, cad9b6c = PT00.3.
     Baseline-Entscheidung unverändert: feat/home-leadmagnet@961f65d. -->

## Completed Work

<!-- Eine Zeile pro abgeschlossenem Primärtask: `PTxx.y — Ergebnis in einem Satz`. Keine Reports. -->

- PT00.1 — Kanonische Decision-/Scope-Baseline hergestellt: `DECISIONS.md` (18/18 Locks `LOCKED`) und
  `SCOPE-CHANGELOG.md` (Change Control) erzeugt, Baseline und Branch-Rollen festgeschrieben.
- PT00.2 — Prioritäts- und Delivery-Modell erzeugt: `RELAUNCH-BACKLOG.md` mit AP-Abdeckung 34/34,
  Prioritätsmodell P0-P3, Wellenlogik W0-W6 und Hard Barriers HB-01 bis HB-08.
- PT00.3 — Risiko- und Annahmenregister erzeugt: `RISK-REGISTER.md` mit 15 aktiven Risiken
  (RISK-001 bis RISK-015), Gate-Bindung 15/15 und 1 akzeptiertem Product Risk.
- PT00.4 — Release-Abnahmevertrag erzeugt: `RELEASE-ACCEPTANCE.md` mit 7 Abnahmedomänen,
  12/12 Launch-Gates, je einer accountable Owner-Rolle, Evidence Contract und Waiver-Politik.

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
- Kanonischer Abnahmevertrag: `building-docs/RELEASE-ACCEPTANCE.md`. Keine zweite Release-/Gate-Datei.
- **Eigentümer-AP (liefert) ≠ Accountable Owner Role (nimmt ab).** Wer liefert, nimmt nicht ab.
- Technische Gate-Kriterien stehen in `MASTER-SCOPE.md` §8 und `QUALITY-GATES.md` §12 und werden in
  `RELEASE-ACCEPTANCE.md` nur referenziert, nicht dupliziert.
- Ergebnissemantik verbindlich: `NOT_RUN` (Standard) · `PASS` · `FAIL` · `BLOCKED`. Ein Gate ohne
  Nachweis gilt als nicht erfüllt (`QUALITY-GATES.md` QG-15); ein `BLOCKED` wird nie zu `PASS` umgedeutet.
- Waiver verschiebt die Erfüllung einer gültigen Anforderung; ein Scope Change ändert die Anforderung
  und läuft ausschließlich über `SCOPE-CHANGELOG.md`.

## Files Changed by Current AP

- `building-docs/DECISIONS.md` (neu, PT00.1)
- `building-docs/SCOPE-CHANGELOG.md` (neu, PT00.1)
- `building-docs/RELAUNCH-BACKLOG.md` (neu, PT00.2)
- `building-docs/RISK-REGISTER.md` (neu, PT00.3)
- `building-docs/RELEASE-ACCEPTANCE.md` (neu, PT00.4)
- `building-docs/state/AP-STATE.md` (fortgeschrieben, PT00.1–PT00.4)

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

- **Kein Launch-Gate ist abgenommen.** Alle 12 stehen auf `NOT_RUN`; kein Sign-off ist erfolgt.
  `RELEASE-ACCEPTANCE.md` definiert den Abnahmeweg, stellt aber keine Abnahme fest.
- **Keine Gate-Implementierung ist erfolgt.** AP00 definiert nur den Governance-/Evidence-Vertrag;
  die Umsetzung liegt bei den jeweiligen APs, die Gate-Integration bei AP27 `PT27.6`.
- Die Rollen sind als **Rollen** definiert; es wurde keine Person benannt und keine Besetzung entschieden.
- **Keine juristische Freigabe wurde erteilt oder angenommen.** Wo Legal-Abnahme nötig ist (Gates 3, 10,
  zuliefernd 2/4/6/12), bleibt das Gate `BLOCKED`, bis sie vorliegt.
- Es existiert **kein** wirksamer Waiver.
- Die Prioritäten in `RELAUNCH-BACKLOG.md` und `RISK-REGISTER.md` sind Delivery-Risiko-Einstufungen,
  **keine** Product Decisions.
- Die Remote-Sicherung der Baseline-Linie (`RISK-007`) ist **nicht** entschieden und **nicht** durchgeführt.
- Es wurde **keine** Repository-Ist-Analyse im Sinne von AP01 und **kein** selektiver Import vorgenommen.

## Required Context for Next PT

<!-- Nur Abweichungen/Ergänzungen zu CONTEXT-INDEX.md, plus konkrete Repo-Dateien, die der nächste PT braucht. -->

- Keine Abweichung von `CONTEXT-INDEX.md`: AP00 benötigt nur `ALWAYS_READ`.
- Der AP00 Closure Gate ist ein **Validator**, kein Primärtask. Er prüft `C00-01` bis `C00-15`
  (`work-packages/AP00.md` §6) gegen die sechs Artefakte: `DECISIONS.md` · `SCOPE-CHANGELOG.md` ·
  `RELAUNCH-BACKLOG.md` · `RISK-REGISTER.md` · `RELEASE-ACCEPTANCE.md` · `state/AP-STATE.md`.
- Erwartete Sollwerte für die Closure-Prüfung: Decision Coverage 18/18 · AP coverage 34/34 ·
  Launch Gates 12/12 · Owner-Rollen 12/12 · Hard Barriers HB-01–HB-08 · Risiken 15 · Waiver 0 ·
  Source/config modified NONE.
- Optionale Evidenz bei Bedarf: `QUALITY-GATES.md` §12 (technischer Gate-Ist-Zustand).

## Handoff

- Last completed PT: PT00.4
- Next PT: AP00-CLOSURE (Closure Gate — Validator)
- Next work package: AP01 — **erst nach AP00 Closure Gate `PASS`**

Stand für AP00-CLOSURE:

- Alle vier Primärtasks abgeschlossen: PT00.1–PT00.4 (**4/4**).
- Alle fünf Governance-Artefakte erzeugt; keine parallele Kanon-Datei angelegt.
- `RELEASE-ACCEPTANCE.md`: 12/12 Gates, 12/12 accountable Owner-Rollen, 7 Abnahmedomänen,
  maschinelle und manuelle Evidenz getrennt, PASS/FAIL/BLOCKED definiert, Waiver-Politik vorhanden.
- Alle Gate-Ergebnisse `NOT_RUN`; 0/12 abgenommen; 0 Waiver.
- Decision Locks 18/18 unverändert `LOCKED`; keine offenen Product Decisions.
- Keine Source-/Runtime-/Dependency-Datei durch AP00 verändert.

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
