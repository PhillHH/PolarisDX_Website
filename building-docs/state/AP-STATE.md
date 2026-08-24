# AP Execution State

**Globaler serieller Handoff für alle Arbeitspakete AP00–AP33. Es gibt genau diese eine State-Datei.**
Keine zweite State-Struktur anlegen (kein `execution/APxx/STATE.md`, kein `state/APxx.md`,
kein `work-packages/APxx-STATE.md`).

---

## Current

- Work package: AP01 — Repository-Baseline, Branch-Reconciliation und Import-Hygiene
- Primary task: PT01.2 abgeschlossen; PT01.3 noch nicht gestartet
- Status: IN_PROGRESS <!-- NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE -->
- AP00: COMPLETE · AP00 closure: PASS (unverändert erhalten)
- Baseline: `feat/home-leadmagnet@961f65d` — Ancestor des aktuellen HEAD, empirisch bestätigt
- Baseline evidence: recorded · `main` Import Ledger: recorded
  (`building-docs/AP01-RECONCILIATION-RESULT.md` §1–§3, §5)
- Current branch: `console/ap01-2026-08-24T10-46-05`
- Current HEAD: `9f8ed1e13dbd561d75807b97640d75cbcfa7e874` (PT01.1-Commit; PT01.2 folgt)
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
- PT01.2 — Auditierte Epigenetik-/Musterbefund-Struktur aus `main@d0fdf29` selektiv übernommen:
  3 Vertiefungsseiten, `EpiSubpage` + `tokens.ts`, `content/befunde/meta.ts` und 6/6
  Musterbefund-Routenmodule; 4 minimale Kompatibilitäts-Hunks (`App.tsx`, `server.ts`,
  `MusterbefundPage.tsx`, `befunde/index.ts`), keine Whole-File-Ersetzung, keine Dependency-Änderung.
  Alle 12 Baseline Guards nach dem Import erneut geprüft.

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

- `building-docs/AP01-RECONCILIATION-RESULT.md` (neu PT01.1, fortgeschrieben PT01.2)
- `building-docs/state/AP-STATE.md` (fortgeschrieben, PT01.1 + PT01.2)

PT01.2 — Anwendungscode (neu, aus `main@d0fdf29`):

- `src/components/epigenetics/tokens.ts`, `src/components/epigenetics/EpiSubpage.tsx`
- `src/pages/EpigeneticsBasicsPage.tsx`, `EpigeneticsEvidencePage.tsx`, `EpigeneticsDocsPage.tsx`
- `src/content/befunde/meta.ts`
- `src/pages/musterbefund/{metabolic-health,healthy-aging,biologische-altersuhr,telomer-analyse,stress-monitor,healthy-sport}.tsx`

PT01.2 — Anwendungscode (Hunks in bestehenden Dateien, kein Whole-File-Ersatz):

- `src/App.tsx` (2 additive Hunks: 9 `lazy()`-Importe, 9 Routen)
- `server.ts` (1 Hunk: 3 `SITEMAP_ROUTES`-Einträge)
- `src/pages/MusterbefundPage.tsx` (3 Hunks: optionale `slug`/`befunde`-Props)
- `src/content/befunde/index.ts` (Typen/Metadaten als Re-Export aus `./meta`)

Dependencies, Lockfiles, `tsconfig*`, `vite.config.ts`, `tailwind.config.js`, `index.html`,
`public/**`, Docker/nginx/CI: **unverändert**.
Kein Import aus `redesign/preview` (gehört zu PT01.3).

## Open Blockers

<!-- Jeweils: ID/Kurztitel · was blockiert ist · was zur Auflösung gebraucht wird. -->

- Keine AP01-Ausführungsblocker. PT01.1 und PT01.2 sind `PASS`.
- **Hinweis, kein Blocker:** `RISK-007` ist `MITIGATING` — die AP00-Nachfolgerlinie ist über
  `origin/console/ap00-2026-08-24T09-32-23` gesichert (inhaltsgleich mit HEAD `4f70801`), aber weder
  `feat/home-leadmagnet` noch der aktive Arbeitsbranch hat ein Upstream. Auflösung liegt beim Owner.
- **Hinweis, kein Blocker:** 19 dokumentierte Schulden (D-01 bis D-19 in
  `AP01-RECONCILIATION-RESULT.md` §8), jeweils einem Owner-AP zugeordnet; keine davon ist
  AP01-blockierend. `BG-10` (Consent/Tracking) steht bereits an der Baseline auf `BASELINE_DEBT`.
  Neu aus PT01.2: `D-16` (Spiegel-Lücke Suche/E2E), `D-17` (kein Navigationseinstieg),
  `D-18` (fehlende Messung der Vertiefungsseiten), `D-19` (Prettier auf PT01.1-Doku).

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
- **Aus `redesign/preview@5673b61` wurde nichts übernommen.** PT01.3 ist nicht gestartet.
- **PT01.2 hat keine Messplan-Entscheidung getroffen.** Die `epigenetics_request`-Instrumentierung aus
  `main` wurde bewusst nicht übernommen; ob die Baseline-Ereignis-Union erweitert oder ein Shim
  gebaut wird, entscheidet AP23/AP15 (`D-18`).
- **PT01.2 hat keine Route Registry gebaut.** Die neun Routen sind Hand-Einträge in den bestehenden
  Spiegeln; die Registry als Single Source of Truth bleibt AP10 PT10.3.
- **Die drei Vertiefungsseiten sind nicht in Navigation, Footer oder Suchindex eingebunden**
  (`D-16`, `D-17`) — das ist AP03/AP06/AP07/AP15.
- **PT01.1 hat keine Baseline-Schuld repariert.** Die 15 Befunde in `AP01-RECONCILIATION-RESULT.md` §8
  sind Evidenz mit Owner-AP, keine AP01-Zusage und keine Freigabe.
- **Keine Toolchain-Festlegung.** Node-/Paketmanager-Pinning ist offen und gehört zu PT01.5.3.

## Required Context for Next PT

<!-- Nur Abweichungen/Ergänzungen zu CONTEXT-INDEX.md, plus konkrete Repo-Dateien, die der nächste PT braucht. -->

- Keine Abweichung von `CONTEXT-INDEX.md`. AP01 verwendet die dort für AP01 definierte
  `Required context`-Menge (`REPO-BASELINE`, `BRANCH-RECONCILIATION-MAP`, `QUALITY-GATES`,
  `ROUTING-CONTRACT`, `RUNTIME-CONTRACT`); `Optional context` nur bei konkretem Anlass.
- PT01.1/PT01.2 haben zusätzlich `SEO-CONTRACT.md` geladen — in `AP01.md` §1.2 für AP01 gelistet,
  in der `CONTEXT-INDEX.md`-Matrix nicht.
- **Für PT01.3 Pflicht:** `BRANCH-RECONCILIATION-MAP.md` §7 (neutrale Engineering-Patterns aus
  `redesign/preview@5673b61`) und §8 (Art-Direction-/Legacy-Ausschlüsse). Laut `CONTEXT-INDEX.md`
  bei PT01.3 ggf. zusätzliche Quality-/A11y-/Performance-Contracts.
- **Baseline Guards `BG-01`–`BG-12`** in `AP01-RECONCILIATION-RESULT.md` §2 sind nach jedem weiteren
  Import erneut auszuführen; die PT01.2-Nachweismethodik steht in §3.4.
- Reproduzierbare SSR-Regression: gebauten Stand auf isoliertem freien Port starten
  (`NODE_ENV=production PORT=<frei> BACKEND_URL=http://127.0.0.1:39999 npx tsx server.ts`),
  **nicht** an einen vorhandenen Prozess auf Port 3000 hängen (`QD-4`).
- Toolchain-Hinweis: `NODE_ENV` muss für `npm ci` **ungesetzt** sein, sonst werden devDependencies
  ausgelassen; Node 20.19.6 über `nvm`; `tsc -b` braucht in diesem Worktree
  `--max-old-space-size=3072`.

## Handoff

- Last completed PT: **PT01.2** — Gezielte `main`-Imports · `PASS`
- Next PT: **PT01.3** — Gezielte `redesign/preview`-Imports (**noch nicht gestartet**)
- Work package: AP01 · Status `IN_PROGRESS`
- AP00: `COMPLETE`, Closure `PASS` (unverändert) · AP02: **nicht gestartet**

Ergebnis PT01.1 (Details in `AP01-RECONCILIATION-RESULT.md` §1–§2):

- Baseline `feat/home-leadmagnet@961f65d` empirisch verifiziert und Ancestor des aktuellen HEAD;
  Baseline-Build, SSR-Smoke (200/301/404), `no-store` und SEOHead-/notFound-Handshake reproduziert;
  `BG-01`–`BG-12` als *must survive imports* festgeschrieben.

Ergebnis PT01.2 (Details in `AP01-RECONCILIATION-RESULT.md` §3 und §5):

- **Quelle:** `main@d0fdf29`, verifiziert (`git cat-file -t` → commit; enthalten in `main`/`origin/main`).
  Kein Branch-Merge, kein Cherry-Pick, kein Tree-Checkout.
- **M1 — Vertiefungsseiten: 3/3** (`EpigeneticsBasicsPage`, `EpigeneticsEvidencePage`,
  `EpigeneticsDocsPage`) · `ADAPT`.
- **M2 — Gemeinsamer Rahmen: 2/2** (`EpiSubpage.tsx` `ADAPT`, `tokens.ts` byte-identisch) .
- **M3 — Musterbefund-Metadaten: IMPORTED** (`content/befunde/meta.ts`, byte-identisch, JSON-frei).
- **M4 — Routenmodule: 6/6**, alle byte-identisch zur Quelle.
- **M5 — Kompatibilitäts-Hunks: 4 Dateien** (`App.tsx` 2 Hunks, `server.ts` 1 Hunk,
  `MusterbefundPage.tsx` 3 Hunks, `befunde/index.ts`). **Whole-File-Ersetzungen: NONE.**
- **Vier dokumentierte Abweichungen von der Quelle** (`§3.2`): `AD-1` Ink-Token
  `text-text-heading`→`text-heading` statt `main`s `tailwind.config.js` (**N4**); `AD-2` `trackEvent`-
  Instrumentierung nicht übernommen (**N9**, Messplan gehört AP23/AP15); `AD-3` Hero auf
  `bg-brand-deep` statt Legacy-Navy-Verlauf (sonst wäre `check:colors` rot geworden);
  `AD-4` Prettier-Normalisierung als Folge von `AD-1`.
- **Baseline Guards nach dem Import: 11 × `PASS`, `BG-10` unverändert `BASELINE_DEBT`.**
  Keine Regression. Runtime geprüft: `/agb`→301 `/de/terms`, `/s3-leitlinie`→301 `/de/s3_leitlinie`,
  `/about`→301 `/de/about`, unbekannte statische Pfade und unbekannte dynamische Slugs → echte 404,
  HTML `no-store`, 404 ohne Canonical/hreflang mit `prerender-status-code`-Marker.
- **Neue Routen aktiv:** `/[lang]/epigenetics/{grundlagen,studienlage,unterlagen}` → 200 und die sechs
  expliziten Musterbefund-Pfade → 200; der `:slug`-Auffangpfad bleibt **letzter** Eintrag und liefert
  für unbekannte Slugs weiter 404. Sitemap 335 → **365 `<loc>`** (3 × 10).
  `IMPORTED_NOT_YET_ACTIVATED_BY_SCOPE` trifft **nicht** zu.
- **Build `PASS`** (je Slug ein eigener Chunk), **Typecheck `PASS`**, **Tests 18/18 `PASS`**,
  **`check:colors` `PASS`**, **ESLint unverändert 129**, **Prettier: 0 Verstöße in PT01.2-Dateien**.
- **Dependencies/Lockfiles: unverändert.**

Rahmen für PT01.3 (unverändert gültig, hier nur referenziert):

- Baseline `feat/home-leadmagnet@961f65d` bleibt gesperrt; `redesign/preview@5673b61` liefert
  **ausschließlich art-direction-neutrale Technik-/QA-Patterns** (`DEC-RL-002`, `DEC-RL-003`).
- Decision Locks 18/18 `LOCKED`. Kein Branch-Merge, kein branchweiter Cherry-Pick.
- `BRANCH-RECONCILIATION-MAP.md` ist bei **jedem** Import Pflicht.

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
