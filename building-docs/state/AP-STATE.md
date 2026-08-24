# AP Execution State

**Globaler serieller Handoff für alle Arbeitspakete AP00–AP33. Es gibt genau diese eine State-Datei.**
Keine zweite State-Struktur anlegen (kein `execution/APxx/STATE.md`, kein `state/APxx.md`,
kein `work-packages/APxx-STATE.md`).

---

## Current

- Work package: AP01 — Repository-Baseline, Branch-Reconciliation und Import-Hygiene
- Primary task: PT01.4 abgeschlossen; PT01.5 noch nicht gestartet
- Status: IN_PROGRESS <!-- NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE -->
- AP00: COMPLETE · AP00 closure: PASS (unverändert erhalten)
- Baseline: `feat/home-leadmagnet@961f65d` — Ancestor des aktuellen HEAD, empirisch bestätigt
- Baseline evidence: recorded · `main` Import Ledger: recorded · redesign patterns: recorded ·
  legacy classification: recorded
  (`building-docs/AP01-RECONCILIATION-RESULT.md` §1–§6)
- Current branch: `console/ap01-2026-08-24T10-46-05`
- Current HEAD: `1f1f236ce2b19c4778a38b7c30b53cd1381c239a` (PT01.3-Commit; PT01.4 folgt)
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

## Open Blockers

<!-- Jeweils: ID/Kurztitel · was blockiert ist · was zur Auflösung gebraucht wird. -->

- Keine AP01-Ausführungsblocker. PT01.1 bis PT01.4 sind `PASS`.
- **Hinweis, kein Blocker:** `RISK-007` ist `MITIGATING` — die AP00-Nachfolgerlinie ist über
  `origin/console/ap00-2026-08-24T09-32-23` gesichert (inhaltsgleich mit HEAD `4f70801`), aber weder
  `feat/home-leadmagnet` noch der aktive Arbeitsbranch hat ein Upstream. Auflösung liegt beim Owner.
- **Hinweis, kein Blocker:** 28 dokumentierte Schulden (D-01 bis D-28 in
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
  `Required context`-Menge; `Optional context` nur bei konkretem Anlass.
- PT01.1–PT01.4 haben zusätzlich `SEO-CONTRACT.md` geladen (in `AP01.md` §1.2 für AP01 gelistet, in der
  Matrix nicht); PT01.4 zusätzlich `NETWORK-ALLOWLIST.md` für die Chat-/Consent-Befunde.
- **Für PT01.5 (Toolchain-/Dependency-Audit) relevant:** `AP01.md` §PT01.5 (ST01.5.1–ST01.5.8),
  `RUNTIME-CONTRACT.md` RT-10/RT-11/RD-4 (Node-/Paketmanager-Pinning ist **AP01 PT01.5.3**),
  `QUALITY-GATES.md` QG-03 und QD-10, `REPO-BASELINE.md` §5 (gemessene Toolchain, Scripts,
  Paketgrenzen). Laut `CONTEXT-INDEX.md` bei PT01.5 ggf. `DEPLOYMENT-CONTRACT.md`, **nur** wenn
  tatsächlich betroffen.
- Konkrete Dateien für PT01.5: `package.json` (kein `engines`, kein `packageManager`),
  `package-lock.json`, `server/package.json`, `server/package-lock.json`, `.npmrc`
  (`legacy-peer-deps=true`), `Dockerfile` (Node 22), `server/Dockerfile` (**Node 20**),
  `.github/workflows/ci.yml` (Node 22), `tsconfig*.json`, `vite.config.ts`.
- **Offene Toolchain-Befunde aus PT01.1, die PT01.5 gehören:** `D-11` (dreifacher Node-Drift),
  `D-12` (Root-`npm ci` allein macht `npm test` rot — `server/**` steht im vitest-Include, dessen
  Dependencies das Root-`npm ci` nicht installiert), `D-13` (Root-`prepare` = `lefthook install`
  schreibt geteilte Git-Hooks und bricht ohne installiertes `lefthook` mit Exit 127 ab).
  `npm audit` meldete beim Install 21 Verwundbarkeiten — in PT01.1 **nicht** bewertet (ST01.5.2).
- **Baseline Guards `BG-01`–`BG-12`** in `AP01-RECONCILIATION-RESULT.md` §2 sind nach jedem Eingriff
  erneut auszuführen; Nachweismethodik in §3.4 (PT01.2) und §4.5 (PT01.3).
- Reproduzierbare SSR-Regression: gebauten Stand auf isoliertem freien Port starten
  (`NODE_ENV=production PORT=<frei> BACKEND_URL=http://127.0.0.1:39999 npx tsx server.ts`),
  **nicht** an einen vorhandenen Prozess auf Port 3000 hängen (`QD-4`).
- QA-Werkzeuge aus PT01.3 gegen denselben Port: `URL=http://127.0.0.1:<port> npm run audit:a11y`
  und `... npm run screenshots:baseline`.
- Toolchain-Hinweis: `NODE_ENV` muss für `npm ci` **ungesetzt** sein, sonst werden devDependencies
  ausgelassen; Node 20.19.6 über `nvm`; `tsc -b` braucht in diesem Worktree
  `--max-old-space-size=3072`.

## Handoff

- Last completed PT: **PT01.4** — Legacy-Klassifikation · `PASS`
- Next PT: **PT01.5** — Toolchain-/Dependency-Audit und integrierte Build-Baseline (**nicht gestartet**)
- Work package: AP01 · Status `IN_PROGRESS`
- AP00: `COMPLETE`, Closure `PASS` (unverändert) · AP02: **nicht gestartet**

Ergebnis PT01.1–PT01.3 (`AP01-RECONCILIATION-RESULT.md` §1–§5):

- Baseline `feat/home-leadmagnet@961f65d` verifiziert, `BG-01`–`BG-12` festgeschrieben.
- `main@d0fdf29`: M1 3/3 · M2 2/2 · M3 IMPORTED · M4 6/6 · M5 4 Dateien/7 Hunks; neun Routen aktiv,
  Sitemap 365 `<loc>`.
- `redesign/preview@5673b61`: P1–P5 alle entschieden; Fehlergrenzen, providerneutrales
  Monitoring-Gerüst und zwei QA-Skripte übernommen; kein Design-System, kein Dark Theme.

Ergebnis PT01.4 (`§6`):

- **40 Artefakte klassifiziert**, jedes mit genau einer Hauptklasse:
  `ACTIVE` 7 · `LEGACY_BACKLOG` 11 · `HISTORICAL_DOC` 15 · `NEEDS_OWNER_AP` 6 ·
  `FORBIDDEN_IMPORT` 3 (jeweils **Negativ-Nachweis**: nichts vorhanden) · **`LEGACY_LAUNCH_BLOCKING` 0**.
- **Aktiver Deploy-Pfad eindeutig:** `Dockerfile` + `docker-compose.yml` + `server/Dockerfile` →
  SSR über `npx tsx server.ts` hinter externem Reverse Proxy. **Tot und als tot ausgewiesen:**
  `vercel.json` (null Referenzen), `nginx.conf` (null Referenzen, statisches SPA-Setup),
  `Dockerfile.dev`, `server/docker-compose.yml` (zweite, offenere Exposition),
  `scripts/prerender.mjs` (zweiter Build-Weg mit 29 veralteten Routen), `email/**`.
- **Chat: `CLASSIFIED / LAUNCH-RELEVANT`, nicht entfernt.** Laufzeitmessung (frischer Browser,
  `cookie-consent` = `null`) belegt **vier externe Hosts vor jeder Einwilligung**:
  `widget.hihuman.co.uk`, `reception.hihuman.co.uk`, `www.googletagmanager.com`,
  `region1.google-analytics.com`. Pre-existing, nicht von AP01 eingebracht; Owner mit PT-Granularität:
  **AP06 PT06.4.6** (Widget), **AP22 PT22.7** (`/api/chat`), **AP23 PT23.1** (Ladeverzicht),
  **AP26 PT26.2** (CSP-Origins). → `D-25`.
- **Deal/Voucher/Case Studies/Shop: BACKLOG, nicht reaktiviert.** `DealPopup`, `DealHint`, Voucher,
  `src/data/products.ts` und `.bak*`/`.bak-nopopup` sind repositoryweit **nicht vorhanden**.
  Vorhanden und tot: `FeaturedCaseStudy.tsx` (nirgends importiert), `casestudies`-Locales
  (Namespace nicht registriert), `shop`-Locales (registriert, nie gelesen → `D-28`).
  `products`-Namespace ist trotz des Namens **ACTIVE** (IglooPro-Strecke).
- **`projektverzeichnis/` ist getrackt** — 11 Dateien seit `f8692c0` (AP00 PT00.1). `AGENT-CONTRACT.md`
  §3 Regel 15 behauptete „untracked" und wurde korrigiert. `REPO-BASELINE.md` und
  `BRANCH-RECONCILIATION-MAP.md` bleiben unverändert: sie sind auf den 2026-08-21 datierte
  Evidenzdokumente und waren zu diesem Zeitpunkt richtig.
- **Kanonische Einstiegskette abgesichert:** `DOCS.md`, `README.md` und `README.de.md` beschrieben
  einen nginx-SPA-Build und ein `backend/`-Payload-CMS, das es nicht gibt, und verwiesen auf
  `building-docs/` gar nicht. Alle drei tragen jetzt einen Non-Canonical-Banner mit Zeiger auf
  `building-docs/README.md`; der Originaltext bleibt vollständig erhalten.
- **`FORBIDDEN_IMPORT` durch AP01: NONE.** Der Import-Hygiene-Nachtest über alle 31 von AP01
  berührten Code-/Config-Dateien fand keinen der verbotenen Marker. Die zwei Treffer bei `hihuman`
  (`server.ts`) und `trackEvent` (`EpiSubpage.tsx`) sind pre-existing CSP bzw. ein erklärender
  Kommentar aus PT01.2 AD-2.
- **Entfernt: NONE.** Kein Artefakt erreichte die Entfernungsschwelle; historische Evidenz ist
  vollständig erhalten. Decision Locks 18/18, Baseline Guards unverändert.
- **Kein Regressionslauf nötig:** PT01.4 hat ausschließlich Dokumentation geändert — kein
  Anwendungscode, keine Config, keine Scripts, keine Runtime, keine CI.

Rahmen für PT01.5 (unverändert gültig, hier nur referenziert):

- Baseline `feat/home-leadmagnet@961f65d` bleibt gesperrt; Decision Locks 18/18 `LOCKED`.
- **AP01 PT01.5.3 besitzt die endgültige Node-/Paketmanager-Festlegung** (`RUNTIME-CONTRACT.md` RT-10/RT-11).
- Keine Broad-Upgrades; Lockfile-Änderungen kontrolliert und im Ledger begründet.

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
