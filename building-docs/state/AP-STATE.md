# AP Execution State

**Globaler serieller Handoff für alle Arbeitspakete AP00–AP33. Es gibt genau diese eine State-Datei.**
Keine zweite State-Struktur anlegen (kein `execution/APxx/STATE.md`, kein `state/APxx.md`,
kein `work-packages/APxx-STATE.md`).

---

## Current

- Work package: AP01 — Repository-Baseline, Branch-Reconciliation und Import-Hygiene
- Primary task: PT01.5 abgeschlossen; **AP01-CLOSURE noch nicht gestartet**
- Status: IN_PROGRESS <!-- NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE -->
- AP00: COMPLETE · AP00 closure: PASS (unverändert erhalten)
- Baseline: `feat/home-leadmagnet@961f65d` — Ancestor des aktuellen HEAD, empirisch bestätigt
- Baseline evidence: recorded · `main` Import Ledger: recorded · redesign patterns: recorded ·
  legacy classification: recorded · **final clean build evidence: recorded**
  (`building-docs/AP01-RECONCILIATION-RESULT.md` §1–§8)
- AP01 ist **nicht** COMPLETE und AP01 closure ist **nicht** PASS — das Closure Gate ist ein eigener Lauf.
- Current branch: `console/ap01-2026-08-24T10-46-05`
- Current HEAD: `f36a763fc5a8c05a17c0548e1c5050ffb31d2e9b` (PT01.4-Commit; PT01.5 folgt)
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
- PT01.3 — Art-direction-neutrale QA-/Engineering-Patterns aus `redesign/preview@5673b61`:
  Fehlergrenzen-Mechanismus (`src/routing/`), providerneutrales Monitoring-/Web-Vitals-Gerüst
  (`src/lib/monitoring/`, Senke standardmäßig No-Op), a11y-Audit- und Baseline-Screenshot-Skripte
  (`npm run audit:a11y`, `npm run screenshots:baseline`). Changelog-/CI-Gate nur dokumentiert,
  nicht verdrahtet. Kein Design-System, kein Dark Theme, keine externe Telemetrie.
- PT01.4 — 40 Artefakte klassifiziert (ACTIVE 7 · LEGACY_BACKLOG 11 · HISTORICAL_DOC 15 ·
  NEEDS_OWNER_AP 6 · FORBIDDEN_IMPORT 3 als Negativ-Nachweis · LEGACY_LAUNCH_BLOCKING 0).
  **Keine Datei entfernt.** Zwei dokumentarische Korrekturen: Tracking-Status von
  `projektverzeichnis/` in `AGENT-CONTRACT.md` richtiggestellt, Non-Canonical-Banner mit Zeiger auf
  `building-docs/README.md` in `DOCS.md`, `README.md`, `README.de.md`.
- PT01.5 — Toolchain-/Dependency-Audit und integrierte Build-Baseline aus einem isolierten Clean
  Checkout der AP01-Linie: `npm ci` ohne Lockfile-Mutation, Typecheck/Tests 18-18/Farb-Guard/Build grün
  auf Node 20.19.6 **und** 22.23.2, SSR-Smoke vollständig, 21+7 Security-Advisories klassifiziert
  (keine durch AP01), Build- und Bundle-Baseline dokumentiert. **Keine neue AP01-Regression.**
  Node-Vertrag bewusst **nicht** gepinnt — Begründung und Empfehlung in §7.2.

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

PT01.3 — Anwendungscode/Werkzeuge (neu, aus `redesign/preview@5673b61`):

- `src/routing/{ErrorBoundary,RootErrorBoundary,SegmentErrorBoundary,index}.tsx|ts`
- `src/lib/monitoring/{report,web-vitals,index}.ts`
- `scripts/a11y-audit.mjs`, `scripts/baseline-screenshots.mjs`

PT01.3 — Hunks in bestehenden Dateien:

- `src/entry-client.tsx` (2 Hunks: `RootErrorBoundary` **nur clientseitig** eingehängt)
- `package.json` / `package-lock.json` (2 Scripts; `axe-core`/`playwright` als devDependencies
  deklariert — Lockfile-Diff = 2 Zeilen, keine Versionsänderung)
- `public/locales/{de,en}/common.json` (`errors`-Block)
- `.gitignore` (`docs/baseline-screenshots/`)

Unverändert durch PT01.2 **und** PT01.3: `server.ts` (außer dem PT01.2-Sitemap-Hunk), `src/App.tsx`
(außer den PT01.2-Routen-Hunks), `src/entry-server.tsx`, `src/components/seo/**`, `src/lib/tracking.ts`,
`index.html`, `tailwind.config.js`, `src/index.css`, `.github/workflows/ci.yml`, `tsconfig*`,
`vite.config.ts`, Docker/nginx.

PT01.4 — **ausschließlich Dokumentation**:

- `building-docs/AGENT-CONTRACT.md` (§3 Regel 15: Tracking-Status `projektverzeichnis/` korrigiert)
- `DOCS.md`, `README.md`, `README.de.md` (Non-Canonical-Banner + Zeiger, Originaltext erhalten)

PT01.4 hat **keine** Datei entfernt oder verschoben und **keinen** Anwendungscode, keine Runtime-/
Config-Datei, keine Dependency, kein Lockfile und kein CI-Artefakt verändert.

PT01.5 — **ausschließlich Dokumentation**:

- `building-docs/AP01-RECONCILIATION-RESULT.md` (§7 Toolchain, Dependency Audit, Security Advisory
  Baseline, Integrated Quality Baseline, SSR-Smoke, Build-/Bundle-Baseline)
- `building-docs/RISK-REGISTER.md` (`RISK-008`: eine Evidenzzeile aus PT01.5)
- `building-docs/state/AP-STATE.md`

PT01.5 hat **weder `package.json` noch ein Lockfile** angefasst — kein `engines`, kein
`packageManager`, kein Security-Fix, kein Dependency-Upgrade. Kein Anwendungscode, keine Runtime-/
Config-/CI-Datei.

## Open Blockers

<!-- Jeweils: ID/Kurztitel · was blockiert ist · was zur Auflösung gebraucht wird. -->

- Keine AP01-Ausführungsblocker. **PT01.1 bis PT01.5 sind alle `PASS`.** AP01 ist bereit für das Closure Gate.
- **Hinweis, kein Blocker:** `RISK-007` ist `MITIGATING` — die AP00-Nachfolgerlinie ist über
  `origin/console/ap00-2026-08-24T09-32-23` gesichert (inhaltsgleich mit HEAD `4f70801`), aber weder
  `feat/home-leadmagnet` noch der aktive Arbeitsbranch hat ein Upstream. Auflösung liegt beim Owner.
- **Hinweis, kein Blocker:** 30 dokumentierte Schulden (D-01 bis D-30 in
  `AP01-RECONCILIATION-RESULT.md` §8), jeweils einem Owner-AP zugeordnet; keine davon ist
  AP01-blockierend. `BG-10` (Consent/Tracking) steht bereits an der Baseline auf `BASELINE_DEBT`.
  Neu aus PT01.2: `D-16` (Spiegel-Lücke Suche/E2E), `D-17` (kein Navigationseinstieg),
  `D-18` (fehlende Messung der Vertiefungsseiten), `D-19` (Prettier auf PT01.1-Doku).
  Neu aus PT01.3 — **beide erstmals messbar, weil PT01.3 das Werkzeug gebracht hat**:
  `D-20` (horizontaler Überlauf bei 1024 px auf allen geprüften Routen, AP24/AP25),
  `D-23` (8 kritische/schwerwiegende axe-Befunde auf Baseline-Seiten, AP24).
  Dazu `D-21` (Monitoring-Senke bewusst nicht eingehängt), `D-22` (`errors.*` nur de/en),
  `D-24` (zwei auditierte Preview-Kandidaten außerhalb der PT01.3-Gruppen).
  Neu aus PT01.4: **`D-25`** — Laufzeitmessung belegt **vier externe Hosts vor jeder Einwilligung**
  (`widget.hihuman.co.uk`, `reception.hihuman.co.uk`, `www.googletagmanager.com`,
  `region1.google-analytics.com`); verletzt `REST-02`/`DEC-RL-004`/`DEC-RL-007`, ist **pre-existing**
  und bereits mit PT-Granularität an AP06 PT06.4.6 / AP22 PT22.7 / AP23 PT23.1 / AP26 PT26.2 vergeben.
  Dazu `D-26` (totes Suchziel `sports` → 404, AP07 PT07.1.9), `D-27` (zweite Betriebswahrheit in
  `server/docker-compose.yml` + tote Deploy-Config, AP28 PT28.7), `D-28` (`shop`-Namespace geladen,
  nie gelesen, AP08/AP25).
  Neu aus PT01.5: `D-29` (Musterbefund-Code-Splitting vorbereitet, aber nicht wirksam — 287,58 kB
  gegenüber 287 kB an der Baseline, also **unverändert**, AP25 mit AP16) und `D-30`
  (21 Root- + 7 `server/`-Security-Advisories, verifiziert, **keine durch AP01**, AP26 PT26.5).
  `D-11` ist präzisiert: der Node-Vertrag bleibt offen und geht an **AP28 PT28.7**.

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
- **Kein Accessibility-Nachweis.** `npm run audit:a11y` ist ein Werkzeug, kein Gate. WCAG 2.2 AA ist
  **nicht** erfüllt, AP24 ist **nicht** abgeschlossen; der Lauf meldet 8 offene Befunde (`D-23`).
- **Keine Monitoring-/Telemetrie-Entscheidung.** Die Senke in `src/lib/monitoring/report.ts` ist
  standardmäßig ein No-Op und nirgends registriert; `initWebVitals()` wird nicht aufgerufen. Welcher
  Transport eingehängt wird, entscheiden AP25/AP26/AP28 mit AP23 (`D-21`).
- **Kein CI-Gate verdrahtet.** Das Changelog-Gate aus `redesign/preview` ist als
  `PATTERN_RECORDED_NOT_ACTIVATED` dokumentiert (`AP01-RECONCILIATION-RESULT.md` §4.3);
  `.github/workflows/ci.yml` ist unverändert. Verdrahtung: AP27 PT27.6.
- **Keine visuelle Soll-Baseline festgelegt.** Die Screenshots von `npm run screenshots:baseline` sind
  Ist-Stand dieser Linie und bewusst nicht eingecheckt; Art Direction bleibt Sales-Machine.
- **Chat ist nicht entfernt.** PT01.4 hat ihn klassifiziert und als launch-relevant belegt, aber keine
  Zeile Code angefasst — Widget, `/api/chat`, CSP-Origins und Copy stehen unverändert. Die Entfernung
  gehört AP06 PT06.4.6, AP22 PT22.7, AP23 PT23.1 und AP26 PT26.2 (`D-25`).
- **Keine Legacy-Datei entfernt.** `vercel.json`, `nginx.conf`, `Dockerfile.dev`,
  `server/docker-compose.yml`, `scripts/prerender.mjs`, `email/**`, `FeaturedCaseStudy.tsx` und die
  `casestudies`-/`shop`-Locales sind als tot **klassifiziert**, nicht gelöscht.
- **Kein Lint-/Archiv-Ausschluss konfiguriert.** `_project-knowledge/**` bleibt als
  `HISTORICAL_DOC` klassifiziert; die formale Ausschluss-Konfiguration ist AP27 PT27.6 (`D-07`).
- **Node-/Paketmanager-Vertrag ist NICHT gepinnt.** PT01.5 hat ihn dokumentiert und Node 22 empfohlen,
  aber `engines`/`packageManager` bewusst nicht gesetzt: `server/Dockerfile` (Node 20) widerspricht der
  Frontend-Kette (Node 22), und der dafür nötige Container-Angleich ist in dieser Umgebung nicht
  validierbar. Entscheidung und Umsetzung: **AP28 PT28.7** (`D-11`).
- **Keine Security-Advisory ist behoben.** 21 Root- und 7 `server/`-Advisories sind klassifiziert, nicht
  gefixt; `npm audit fix` wurde bewusst nicht ausgeführt (`D-30`, AP26 PT26.5).
- **Keine Bundle-Optimierung.** Der 287-kB-`MusterbefundPage`-Chunk ist gemessen und unverändert;
  die Auflösung ist AP25 (`D-29`).
- **AP01 ist nicht abgenommen.** Das Closure Gate `C01-01`–`C01-15` ist **nicht** gelaufen.
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

- Nächster Lauf ist **AP01-CLOSURE**, kein Primärtask. Er validiert PT01.1–PT01.5 gemeinsam gegen
  `AP01.md` §7 (`C01-01` bis `C01-15`).
- Keine Abweichung von `CONTEXT-INDEX.md`. Für die Closure zusätzlich zu `ALWAYS_READ` erforderlich:
  `building-docs/AP01-RECONCILIATION-RESULT.md` (vollständig — es ist die Evidenzbasis der Closure),
  `BRANCH-RECONCILIATION-MAP.md` (für `C01-03`–`C01-05`, `C01-07`),
  `QUALITY-GATES.md`, `ROUTING-CONTRACT.md`, `RUNTIME-CONTRACT.md`, `SEO-CONTRACT.md`
  (für `C01-06` Baseline-Härtungen).
- Über PT01.1–PT01.5 zusätzlich geladen und weiterhin relevant: `SEO-CONTRACT.md` (in `AP01.md` §1.2
  gelistet, in der Matrix nicht) und `NETWORK-ALLOWLIST.md` (PT01.4, Chat-/Consent-Befunde).
- **Alle Closure-Nachweise liegen bereits vor** und müssen nicht neu erhoben werden:
  `§1` Baseline Evidence · `§2` Baseline Guards · `§3`/`§5` `main` Import Ledger · `§4`/`§4a`
  `redesign/preview` Import Ledger · `§6` Legacy Classification · `§7` Toolchain/Dependency/Security/
  Quality/Bundle · `§8` Known Remaining Debt (`D-01`–`D-30`).
- Reproduzierbare Verifikation, falls die Closure etwas nachmessen will: isolierter Worktree auf HEAD,
  `npm ci` **im Root und in `server/`**, dann `tsc -b` (mit `--max-old-space-size=3072`), `vitest run`,
  `npm run build`, danach SSR auf isoliertem freiem Port
  (`NODE_ENV=production PORT=<frei> BACKEND_URL=http://127.0.0.1:39999 npx tsx server.ts`).
  `NODE_ENV` muss für `npm ci` **ungesetzt** sein, sonst fehlen die devDependencies.
- Achtung bei `npm ci`: das Root-`prepare`-Script (`lefthook install`) schreibt in die **geteilten**
  Git-Hooks des Haupt-Checkouts — vorher sichern, danach zurückspielen (`D-13`).

## Handoff

- Last completed PT: **PT01.5** — Toolchain-/Dependency-Audit und integrierte Build-Baseline · `PASS`
- Next: **AP01-CLOSURE** (`AP01.md` §7, `C01-01`–`C01-15`) — **nicht gestartet**
- Work package: AP01 · Status `IN_PROGRESS` — **nicht** `COMPLETE`
- AP01 closure: **NOT_RUN** — **nicht** `PASS`
- AP00: `COMPLETE`, Closure `PASS` (unverändert) · AP02: **nicht gestartet**

Alle fünf Primärtasks sind `PASS`. Evidenz vollständig in `building-docs/AP01-RECONCILIATION-RESULT.md`:

- **PT01.1** Baseline `feat/home-leadmagnet@961f65d` verifiziert; `BG-01`–`BG-12` festgeschrieben (§1–§2).
- **PT01.2** `main@d0fdf29`: M1 3/3 · M2 2/2 · M3 IMPORTED · M4 6/6 · M5 4 Dateien/7 Hunks;
  neun Routen aktiv, Sitemap 365 `<loc>` (§3, §5).
- **PT01.3** `redesign/preview@5673b61`: P1–P5 entschieden; Fehlergrenzen, providerneutrales
  Monitoring-Gerüst, zwei QA-Skripte; kein Design-System, kein Dark Theme (§4, §4a).
- **PT01.4** 40 Artefakte klassifiziert, `LEGACY_LAUNCH_BLOCKING` 0, keine Datei entfernt (§6).
- **PT01.5** Toolchain-, Dependency-, Security-, Quality-, Build- und Bundle-Baseline (§7).

Ergebnis PT01.5 im Einzelnen:

- **Toolchain Contract (§7.1):** Package Manager **npm**, ein `package-lock.json` je Paket
  (`lockfileVersion` 3), `.npmrc` `legacy-peer-deps=true`. Clean Install ist `npm ci` **im Root und
  zusätzlich in `server/`** — nur so laufen die Tests 18/18 (`D-12`).
- **Node-Vertrag (§7.2): dokumentiert, bewusst NICHT gepinnt.** CI und `Dockerfile` führen **22**,
  `server/Dockerfile` führt **20**. Beide Stände sind vollständig grün verifiziert (20.19.6 und
  22.23.2). AP01 **empfiehlt Node 22**; das Pinning setzt den Container-Angleich voraus und geht an
  **AP28 PT28.7**, die Gate-Verankerung an **AP27 PT27.6** (`D-11`).
- **Dependency Audit (§7.3):** Runtime 14 (Root) + 6 (`server/`), Dev 32 + 0. **Durch AP01 addiert:
  genau 2 devDependencies** (`axe-core`, `playwright`, beide PT01.3, beide mit nachgewiesener
  Verwendung). **Entfernt: NONE. Runtime-Dependencies unverändert. Unerklärte Änderungen: NONE.**
  Lockfile-Delta seit Baseline: **+2/−0 Zeilen**, `server/package-lock.json` unverändert.
- **Security Advisories (§7.4): VERIFIED** (Service erreichbar). Root **21** (15 high · 4 moderate ·
  2 low · 0 critical): 3 production/direct, 6 production/transitive, 12 dev-only. `server/` **7**
  (1 direct `express`, 6 transitiv). **Keine durch AP01 eingeführt** — die Root-Zahl ist identisch mit
  der PT01.1-Messung. Kein Fix angewandt; `sharp` bräuchte ein Major-Upgrade (`D-30`, AP26 PT26.5).
- **Clean Checkout (§7.5):** isolierter Worktree auf `f36a763`, `npm ci` rc 0 in beiden Paketen,
  **keine Lockfile-Mutation** (SHA-256 vor/nach identisch), Worktree danach kontrolliert entfernt,
  aktiver Branch unverändert.
- **Quality:** Typecheck `PASS` · Tests **18/18** · `check:colors` `PASS` · Build `PASS` ·
  ESLint **129** (`BASELINE_DEBT`, 0 in AP01-Dateien) · Prettier **38** (`BASELINE_DEBT`, 0 in
  AP01-Quelldateien) · E2E `ENVIRONMENT_NOT_VERIFIED` (`D-09`).
- **SSR-Smoke (§7.6): PASS** — 200, echte 301 (`/agb`, `/s3-leitlinie`, `/about`, je ein Hop),
  echte 404 statisch und dynamisch, `no-store`, SEOHead-/notFound-Handshake, 1 Canonical + 11 hreflang,
  `/api/*` außerhalb des Catch-all, Sitemap 365 `<loc>`, Musterbefund-Module **6/6**.
- **Build-/Bundle-Baseline (§7.7):** Build **7,9 s** aus leerem `dist` (Node 22.23.2), 58 Client-JS-
  Dateien / 1,1 MB. Neue AP01-Chunks zusammen **< 25 kB** roh für neun Routen.
  **Musterbefund-Chunk 287,58 kB — gegenüber der Baseline unverändert**: die sechs Routenmodule sind
  je 0,50 kB, weil `MusterbefundPage.tsx` weiterhin alle zwölf JSONs für den `:slug`-Auffangpfad hält
  (trägt `BG-01`). Auflösung: **AP25** mit **AP16** (`D-29`).
- **Baseline Guards: 11 × `PASS`, `BG-10` unverändert `BASELINE_DEBT`.**
  **New regressions introduced by AP01: NONE.**

Rahmen für AP01-CLOSURE:

- Baseline `feat/home-leadmagnet@961f65d` bleibt gesperrt; Decision Locks 18/18 `LOCKED`.
- Die Closure prüft, sie implementiert nicht. `AP02` bleibt ungestartet.
- 30 dokumentierte Schulden (`D-01`–`D-30`), jede mit Owner-AP; **keine** AP01-blockierend.

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
