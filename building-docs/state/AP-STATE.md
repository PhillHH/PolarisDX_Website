# AP Execution State

**Globaler serieller Handoff für alle Arbeitspakete AP00–AP33. Es gibt genau diese eine State-Datei.**
Keine zweite State-Struktur anlegen (kein `execution/APxx/STATE.md`, kein `state/APxx.md`,
kein `work-packages/APxx-STATE.md`).

---

## Current

- Work package: AP01 — Repository-Baseline, Branch-Reconciliation und Import-Hygiene
- Primary task: PT01.1 abgeschlossen; PT01.2 noch nicht gestartet
- Status: IN_PROGRESS <!-- NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE -->
- AP00: COMPLETE · AP00 closure: PASS (unverändert erhalten)
- Baseline: `feat/home-leadmagnet@961f65d` — Ancestor des aktuellen HEAD, empirisch bestätigt
- Baseline evidence: recorded (`building-docs/AP01-RECONCILIATION-RESULT.md` §1)
- Current branch: `console/ap01-2026-08-24T10-46-05`
- Current HEAD: `4f70801d4a3166c1caccc69bb3b7b7f254ac044c`
- Started: 2026-08-24 (AP01)
- Last updated: 2026-08-24

<!-- AP00-HEAD-Historie: f8692c0 = PT00.1, bf125d2 = PT00.2, cad9b6c = PT00.3, 0c58d44 = PT00.4,
     a0fac9c = Closure. Danach Pre-AP01-Hygiene: 9ee8199, d98a6b7, 5f6fc3b, Merge 4f70801.
     Der vor PT01.1 hier vermerkte HEAD 0c58d44 war veraltet; PT01.1 hat ihn empirisch
     nachgezogen und den AP01-Bootstrap-Kontext neu geladen (AGENT-CONTRACT §7).
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
- AP00-CLOSURE — Closure Gate `PASS`: C00-01 bis C00-20 geprüft; Decision Locks 18/18, AP coverage
  34/34, Launch Gates 12/12, Owner-Rollen 12/12, Context Mappings 34/34, Duplicate Canon NONE,
  Source/Config NONE.
- PT01.1 — Baseline `feat/home-leadmagnet@961f65d` empirisch verifiziert: isolierter Clean Checkout,
  `npm ci` ohne Lockfile-Mutation, Build/Typecheck/Unit (18/18)/Farb-Guard grün, SSR-Smoke
  (200 · echte 301 für `/agb`, `/s3-leitlinie`, Locale-Präfix, je ein Hop · echte 404 statisch und
  dynamisch), `no-store` runtime-geprüft, SEOHead-/notFound-Handshake bestätigt, 12 Baseline Guards
  (BG-01–BG-12) und 15 reproduzierte Baseline-Schulden festgeschrieben.

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

<!-- AP01. Die AP00-Dateiliste wurde beim AP-Wechsel geleert (siehe `Benutzung`);
     sie steht in `Completed Work` und in der Git-Historie. -->

- `building-docs/AP01-RECONCILIATION-RESULT.md` (neu, PT01.1)
- `building-docs/state/AP-STATE.md` (fortgeschrieben, PT01.1)

Quellcode-, Runtime-, Config-, Dependency- und Lockfile-Dateien: **keine**.
Kein Import aus `main` oder `redesign/preview` (gehört zu PT01.2/PT01.3).

## Open Blockers

<!-- Jeweils: ID/Kurztitel · was blockiert ist · was zur Auflösung gebraucht wird. -->

- Keine AP01-Ausführungsblocker. PT01.1 ist `PASS`.
- **Hinweis, kein Blocker:** `RISK-007` ist `MITIGATING` — die AP00-Nachfolgerlinie ist über
  `origin/console/ap00-2026-08-24T09-32-23` gesichert (inhaltsgleich mit HEAD `4f70801`), aber weder
  `feat/home-leadmagnet` noch der aktive Arbeitsbranch hat ein Upstream. Auflösung liegt beim Owner.
- **Hinweis, kein Blocker:** 15 reproduzierte Baseline-Schulden (D-01 bis D-15 in
  `AP01-RECONCILIATION-RESULT.md` §8), jeweils einem Owner-AP zugeordnet; keine davon ist
  AP01-blockierend. `BG-10` (Consent/Tracking) steht bereits an der Baseline auf `BASELINE_DEBT`.

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
- Die Remote-Sicherung der Baseline-Linie (`RISK-007`) ist über den AP00-Branch **mitigiert**, aber
  nicht abgeschlossen: `feat/home-leadmagnet` und der aktive Arbeitsbranch haben weiterhin kein Upstream.
- **Es wurde kein selektiver Import vorgenommen.** PT01.1 hat `main@d0fdf29` und
  `redesign/preview@5673b61` ausschließlich auf Erreichbarkeit geprüft; PT01.2/PT01.3 sind nicht gestartet.
- **PT01.1 hat keine Baseline-Schuld repariert.** Die 15 Befunde in `AP01-RECONCILIATION-RESULT.md` §8
  sind Evidenz mit Owner-AP, keine AP01-Zusage und keine Freigabe.
- **Keine Toolchain-Festlegung.** Node-/Paketmanager-Pinning ist offen und gehört zu PT01.5.3.

## Required Context for Next PT

<!-- Nur Abweichungen/Ergänzungen zu CONTEXT-INDEX.md, plus konkrete Repo-Dateien, die der nächste PT braucht. -->

- Keine Abweichung von `CONTEXT-INDEX.md`. AP01 verwendet die dort für AP01 definierte
  `Required context`-Menge (`REPO-BASELINE`, `BRANCH-RECONCILIATION-MAP`, `QUALITY-GATES`,
  `ROUTING-CONTRACT`, `RUNTIME-CONTRACT`); `Optional context` nur bei konkretem Anlass.
- PT01.1 hat zusätzlich `SEO-CONTRACT.md` geladen — in `AP01.md` §1.2 ausdrücklich für AP01 gelistet,
  in der `CONTEXT-INDEX.md`-Matrix nicht. Für PT01.2/PT01.3 bleibt es relevant (SEOHead-/404-Handshake).
- Für PT01.2 zusätzlich Pflicht: `BRANCH-RECONCILIATION-MAP.md` — Positivliste (Gruppen M1–M5),
  Negativliste `DO_NOT_IMPORT`, Commit-Sicherheitsmatrix, insbesondere **N1**, **N2**, **N12**.
- Weiter relevant: `DECISIONS.md` §2 (Baseline und Branch-Rollen), `RELAUNCH-BACKLOG.md` §4 `HB-02`,
  `RISK-REGISTER.md` `RISK-002` / `RISK-003` / `RISK-007` / `RISK-008`.
- Konkrete Repo-Dateien für PT01.2 (Hotspots, nur Hunks, nie als Datei ersetzen):
  `src/App.tsx`, `server.ts`, `src/components/seo/SEOHead.tsx`, `src/pages/EpigeneticsPage.tsx`,
  `src/pages/MusterbefundPage.tsx`, `src/content/befunde/`, `src/components/layout/Footer.tsx`.
- **Baseline Guards `BG-01`–`BG-12`** in `AP01-RECONCILIATION-RESULT.md` §2 sind nach jedem Import
  erneut auszuführen.

## Handoff

- Last completed PT: **PT01.1** — Baseline verifizieren · `PASS`
- Next PT: **PT01.2** — Gezielte `main`-Imports (**noch nicht gestartet**)
- Work package: AP01 · Status `IN_PROGRESS`
- AP00: `COMPLETE`, Closure `PASS` (unverändert)
- AP02: **nicht gestartet**

Ergebnis PT01.1 (Details ausschließlich in `building-docs/AP01-RECONCILIATION-RESULT.md`):

- **Baseline evidence: recorded.** `feat/home-leadmagnet@961f65d` existiert, ist Ancestor von HEAD
  `4f70801`; Delta Baseline→HEAD sind 46 reine `.md`-Additionen, **kein** Anwendungscode-/Runtime-/
  Dependency-Delta; `src/pages/EpigeneticsPage.tsx` ohne Delta.
- **Baseline build: PASS** aus isoliertem Clean Checkout (`npm ci` ohne Lockfile-Mutation, Node 20.19.6 /
  npm 10.8.2; Typecheck PASS, Unit 18/18 PASS, `check:colors` PASS, Build PASS; Lint und Prettier rot als
  bekannte Baseline Debt; E2E bewusst nicht ausgeführt, siehe D-09).
- **Baseline SSR smoke: PASS** auf isoliertem Port 39017 — 200, echte 301 (`/agb` → `/de/terms`,
  `/s3-leitlinie` → `/de/s3_leitlinie`, `/about` → `/de/about`, je genau ein Hop), echte 404 statisch und
  für unbekannte dynamische Slugs, HTML `no-store, no-cache, must-revalidate`, gehashte Assets
  `immutable`, SEOHead-/notFound-Handshake intakt (404 ohne Canonical/hreflang, `noindex, follow`,
  `prerender-status-code`-Marker), reale Seite mit einem Canonical und 10 hreflang + `x-default`.
- **Baseline guards recorded: `BG-01`–`BG-12`** als *must survive PT01.2/PT01.3 imports*.
  11 × `PASS`, `BG-10` (Consent/Tracking) × `BASELINE_DEBT`.
- **Known baseline debt: 15 Befunde** (`D-01`–`D-15`), jeder mit Evidenz und Owner-AP; **keiner**
  AP01-blockierend. Keine als Baseline-Härtung geltende Eigenschaft war nicht reproduzierbar.
- **Kein Anwendungscode, keine Runtime-/Config-Datei, keine Dependency und kein Lockfile geändert.**
  Der temporäre Baseline-Worktree wurde kontrolliert entfernt; aktiver Branch und Working Tree
  unverändert.

Rahmen für PT01.2 (unverändert gültig, hier nur referenziert):

- Baseline `feat/home-leadmagnet@961f65d` bleibt gesperrt; `main@d0fdf29`,
  `redesign/preview@5673b61`, `feat/contact-joyful@ab373a3` sind **ausschließlich selektive Quellen**.
- Decision Locks 18/18 `LOCKED` — `DECISIONS.md` / `PROJECT-CONSTRAINTS.md`.
- `HB-02` erfüllt: PT01.1 liegt vor, branch-abgeleitete Schritte sind ab jetzt zulässig —
  `BRANCH-RECONCILIATION-MAP.md` ist bei **jedem** Import Pflicht.
- Kein Branch-Merge, kein branchweiter Cherry-Pick, kein Datei-Checkout aus einem Quellbranch für eine
  Datei, die auf der Baseline ebenfalls existiert (`AGENT-CONTRACT.md` §2).

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
