# AP Execution State

**Globaler serieller Handoff für alle Arbeitspakete AP00–AP33. Es gibt genau diese eine State-Datei.**
Keine zweite State-Struktur anlegen (kein `execution/APxx/STATE.md`, kein `state/APxx.md`,
kein `work-packages/APxx-STATE.md`).

---

## Current

- Work package: AP02 — Zielarchitektur: SSR, Routing, Lead Platform und Betrieb
- Status: IN_PROGRESS <!-- NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE -->
- Last completed PT: PT02.2 — Routing-Zielbild / Route Registry (PASS)
- Next PT: PT02.3 — Content-/Asset-Architektur (nicht begonnen)
- SSR/rendering contract: recorded (`building-docs/RUNTIME-CONTRACT.md`)
- Routing/route-registry contract: recorded (`building-docs/ROUTING-CONTRACT.md`)
- AP01: COMPLETE · AP01 closure: PASS (43/43, `C01-01`–`C01-43`) — unverändert erhalten
- AP00: COMPLETE · AP00 closure: PASS (unverändert erhalten)
- AP03: NOT STARTED
- Baseline: `feat/home-leadmagnet@961f65d` — Ancestor des aktuellen HEAD, empirisch bestätigt
- Baseline evidence: recorded · `main` Import Ledger: recorded · redesign patterns: recorded ·
  legacy classification: recorded · final clean build evidence: recorded · **closure evidence: recorded**
  (`building-docs/AP01-RECONCILIATION-RESULT.md` §1–§9)
- Current branch: `console/ap02-2026-08-24T12-30-23`
- Current HEAD: `f7a7ff0ff42b9750db00e548adf17acdde24319a` — PT02.1-Commit; enthält den
  AP01-Final-HEAD `3736d1a` als Ancestor; Delta `3736d1a..HEAD` = **0 Nicht-Dokumentationsdateien**
- Started: 2026-08-24 (AP02); AP01 gestartet und abgeschlossen 2026-08-24
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
- AP01-CLOSURE — Closure Gate `PASS`: `C01-01` bis `C01-43` geprüft. 31 Nicht-Doku-Dateien seit der
  Baseline, alle genau einem AP01-Commit zuordenbar (Kategorie „sonstige" = NONE); 10 Importe
  byte-identisch zur Quelle, alle übrigen mit begründeter Abweichung; **keine** Whole-File-Ersetzung
  eines geschützten Hotspots; kein Quellbranch ist Ancestor. Build, Tests und SSR-Smoke auf dem
  Closure-HEAD erneut grün. Baseline Guards **12/12** ohne neue Regression, Decision Locks **18/18**.
- PT02.1 — SSR-/Rendering-Zielvertrag im kanonischen `RUNTIME-CONTRACT.md` festgeschrieben: Ist-Erhebung
  §3.1 (read-only, inkl. SSR-Smoke gegen das vorhandene Build-Artefakt), Zielinvarianten **RT-38–RT-70**
  (SSR-Standard, Hydration, Lazy Loading, 404 vs. Runtime Error, Head-/SEO-SSR, Consumer- und
  Epigenetik-SSR), Zielmodell §5.4/§5.5, Rendering-Schulden **RD-11–RD-16** mit Owner-AP, Regeln
  **M-08–M-11**, Nachweise **RT-T14–RT-T22**, Owner-Grenzen §11.1. **Kein** Quell-, Runtime-, Config-
  oder Dependency-Delta; keine AP09-/AP10-/AP21-/AP25-/AP27-Implementierung vorgezogen.
- PT02.2 — Routing-Zielbild im kanonischen `ROUTING-CONTRACT.md` festgeschrieben: Ist-Erhebung §3.1
  (acht handgeführte Routenspiegel A–H, read-only), Zielinvarianten **R-17–R-53** (URL-/Locale-Vertrag,
  13 Route-Klassen, Route Registry als Single Source of Truth mit 14 Metadatenfeldern, dynamische
  Ressourcen, Redirect-Klassen A–E, Statusmatrix, Canonical-/hreflang-Ableitung, Sitemap/Search/
  Navigation als Konsumenten, Consumer × 10, Epigenetik als eigene Säule), Schulden **RD-8–RD-14**,
  Regeln **M-06–M-08**, Nachweise **T-11–T-20** mit RTG-Zuordnung §8.2, Owner-Grenzen §10.1.
  **Keine Route Registry implementiert**, kein Quell-/Runtime-/Config-/Dependency-Delta.

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
- **Kanonischer SSR-/Rendering-Vertrag: `building-docs/RUNTIME-CONTRACT.md`** (AP02 PT02.1). Es gibt
  keinen zweiten SSR-/Rendering-Contract; spätere APs erweitern diesen oder gar keinen.
- **SSR ist der Standard für jede indexierbare Seite** (RT-38–RT-42); SSR ist nicht aufwärmabhängig
  (RT-40). Hydration ist deterministisch (RT-43–RT-48). Lazy Loading ist zulässig, verändert aber nie
  den semantischen Inhalt des initialen Response (RT-49–RT-53).
- **404 und Laufzeitfehler sind getrennte Antwortklassen** (RT-54–RT-60): fachlich nicht vorhanden → 404
  ohne Canonical/hreflang; technischer Fehler → 5xx, nie als 404 maskiert; eine Fehlergrenze ersetzt
  weder Route-NotFound noch Statuscode.
- **Genau ein kanonischer Head-/SEO-Pfad** (RT-61–RT-66); Consumer und Epigenetik laufen im normalen
  SSR-Vertrag, Consumer in allen 10 Sprachen (RT-67–RT-70).
- **Kanonischer Routing-/URL-/HTTP-Vertrag: `building-docs/ROUTING-CONTRACT.md`** (AP02 PT02.2). Es gibt
  keine zweite Routing-Wahrheit und keinen konkurrierenden Routing-Contract.
- **Es gibt genau eine kanonische Routing-Wahrheit** (R-24/R-25): App-Routen, Known Paths, Sitemap,
  Canonical/hreflang, Search, Redirects, Navigations-Linkziele und Route-Tests leiten daraus ab und
  pflegen keine eigene Liste existierender URLs. Ableitbarkeit ist verbindlich, ein bestimmtes
  Dateilayout nicht (R-26/R-29).
- **Route Registry ≠ Content-Datenbank** (R-28): gültige Slugs bleiben bei der fachlichen Datenquelle;
  jede dynamische Route benennt genau eine Slug-Quelle (R-33).
- **Existenz, Sitemap-Teilnahme, Search-Teilnahme und Navigationsplatzierung sind vier getrennte
  Eigenschaften** (R-40). „Nicht in der Sitemap = unbekannte Route" ist ausgeschlossen — heute ist genau
  das die Ist-Architektur (`RD-8`).
- **Route-Identität ist Locale + Pfadmuster + aufgelöste Parameter** (R-21); Query und Fragment gehören
  nicht dazu. Die Locale kommt ausschließlich aus der URL (R-18).
- **`/services*` ist im Ziel eine echte serverseitige 301-Brücke** in einem Hop (R-38); Redirect-Quellen
  sind keine kanonischen Seiten (R-37).
- **Eigentümer-AP (liefert) ≠ Accountable Owner Role (nimmt ab).** Wer liefert, nimmt nicht ab.
- Technische Gate-Kriterien stehen in `MASTER-SCOPE.md` §8 und `QUALITY-GATES.md` §12 und werden in
  `RELEASE-ACCEPTANCE.md` nur referenziert, nicht dupliziert.
- Ergebnissemantik verbindlich: `NOT_RUN` (Standard) · `PASS` · `FAIL` · `BLOCKED`. Ein Gate ohne
  Nachweis gilt als nicht erfüllt (`QUALITY-GATES.md` QG-15); ein `BLOCKED` wird nie zu `PASS` umgedeutet.
- Waiver verschiebt die Erfüllung einer gültigen Anforderung; ein Scope Change ändert die Anforderung
  und läuft ausschließlich über `SCOPE-CHANGELOG.md`.

## Files Changed by Current AP

<!-- AP02. Beim Start von AP03 leeren (siehe `Benutzung`). -->

**PT02.1 — ausschließlich Dokumentation** (committet als `f7a7ff0`):

- `building-docs/RUNTIME-CONTRACT.md` (§2 Stand, §3.1 Ist-Zustand, RT-38–RT-70, §5.4/§5.5,
  §6.1 RD-11–RD-16, M-08–M-11, §9.1 RT-T14–RT-T22, §10, §11/§11.1)

**PT02.2 — ausschließlich Dokumentation:**

- `building-docs/ROUTING-CONTRACT.md` (§2 Stand, §3.1 Ist-Zustand, R-17–R-53, §5.1 RD-8–RD-14,
  M-06–M-08, §8.1/§8.2, §9, §10/§10.1)
- `building-docs/state/AP-STATE.md`

**Anwendungscode / Runtime / Config / Dependencies / Lockfiles: NONE.** `SEO-CONTRACT.md`,
`QUALITY-GATES.md`, `CONTEXT-INDEX.md`, `MASTER-SCOPE.md` und `DECISIONS.md` sind **unverändert** — eine
referenzielle Korrektur war in beiden PTs nicht erforderlich. `CONTEXT-INDEX.md` weist
`ROUTING-CONTRACT.md` bereits als AP02-Pflichtkontext aus; ein neuer Routing-Contract wurde **nicht**
angelegt.

<details>
<summary>AP01 — Files Changed (abgeschlossen, zur Nachvollziehbarkeit)</summary>

**Anwendungscode / Config — ausschließlich aus PT01.2 (`4e8a774`) und PT01.3 (`1f1f236`):**

- neu aus `main@d0fdf29`: `src/components/epigenetics/{tokens.ts,EpiSubpage.tsx}` ·
  `src/pages/Epigenetics{Basics,Evidence,Docs}Page.tsx` · `src/content/befunde/meta.ts` ·
  `src/pages/musterbefund/*.tsx` (6)
- neu aus `redesign/preview@5673b61`: `src/routing/*` (4) · `src/lib/monitoring/*` (3) ·
  `scripts/{a11y-audit,baseline-screenshots}.mjs`
- per Hunk angepasst: `src/App.tsx` · `server.ts` · `src/pages/MusterbefundPage.tsx` ·
  `src/content/befunde/index.ts` · `src/entry-client.tsx` · `package.json` · `package-lock.json` ·
  `public/locales/{de,en}/common.json` · `.gitignore`

**Dokumentation:**

- `building-docs/AP01-RECONCILIATION-RESULT.md` (neu in PT01.1, fortgeschrieben bis Closure)
- `building-docs/state/AP-STATE.md` · `building-docs/RISK-REGISTER.md` ·
  `building-docs/AGENT-CONTRACT.md` (Tracking-Status `projektverzeichnis/`) ·
  `DOCS.md`, `README.md`, `README.de.md` (Non-Canonical-Banner, Originaltext erhalten)

**Nicht verändert:** `src/components/seo/**`, `src/pages/EpigeneticsPage.tsx`,
`src/components/layout/**`, `src/lib/tracking.ts`, `src/hooks/useSearch.ts`, `src/entry-server.tsx`,
`index.html`, `tailwind.config.js`, `src/index.css`, `.github/workflows/ci.yml`, `tsconfig*`,
`vite.config.ts`, Docker/nginx, `server/**`. **Keine Datei entfernt oder verschoben.**

</details>

## Open Blockers

<!-- Jeweils: ID/Kurztitel · was blockiert ist · was zur Auflösung gebraucht wird. -->

- **Keine offenen Blocker.** PT01.1–PT01.5 und das AP01-Closure Gate sind `PASS`; AP01 ist `COMPLETE`.
  PT02.1 und PT02.2 sind `PASS`; AP02 ist `IN_PROGRESS`.
- **Hinweis, kein Blocker — neu aus PT02.2:** sieben Routing-Schulden `RD-8`–`RD-14` in
  `ROUTING-CONTRACT.md` §5.1, jede mit Owner-AP, keine PT02.2-blockierend. Die schwerste ist **`RD-8`**:
  `KNOWN_PATHS` wird **aus der Sitemap abgeleitet**, „nicht in der Sitemap = unbekannte Route" ist damit
  die reale Architektur (geflickt durch acht Handausnahmen). Owner AP10 PT10.3. Dazu `RD-10`
  (**acht** statt vier Routenspiegel) und `RD-13` (der einzige Routen-Guard prüft keine Statuscodes).
- **Hinweis, kein Blocker — neu aus PT02.1:** sechs Rendering-Schulden `RD-11`–`RD-16` in
  `RUNTIME-CONTRACT.md` §6.1, jede mit Owner-AP, keine davon PT02.1-blockierend. Die schwerste ist
  **`RD-11`**: die erste SSR-Anfrage je Lazy-Route und Prozess liefert Layout ohne Seiteninhalt und mit
  leerem Head (statische `index.html`-Defaults bleiben stehen); ab der zweiten Anfrage ist dieselbe
  Route vollständig. Gemessen, **pre-existing**, vergeben an AP25 (mit AP09), Nachweis AP27. Direkt
  daran hängt **`RD-12`** (render-abhängige Soft-404-Erkennung, AP10).
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
- **AP02 ist nicht gestartet.** Kein `PT02.x` ist aktiv; das Zielarchitektur-Zielbild ist nicht begonnen.
- **Kein Launch-Gate ist durch AP01 abgenommen.** AP01 hat einen technischen Ausgangspunkt hergestellt,
  keine der 12 Launch-Gate-Abnahmen aus `RELEASE-ACCEPTANCE.md` berührt.
- **Kein Risiko wurde geschlossen.** `RISK-002` und `RISK-003` haben Closure-Evidenz erhalten und
  bleiben `OPEN` für ihre späteren Owner-APs.
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

- Nächster Primärtask ist **PT02.3 — Content-/Asset-Architektur** innerhalb von AP02. Er ist **nicht**
  gestartet.
- Gemäß `CONTEXT-INDEX.md` liest AP02 zusätzlich zu `ALWAYS_READ`: `RUNTIME-CONTRACT.md` ·
  `ROUTING-CONTRACT.md` · `BACKEND-API-CONTRACT.md` · `LEAD-DATA-CONTRACT.md` ·
  `DEPLOYMENT-CONTRACT.md`; optional bei Anlass `SEO-CONTRACT.md` · `CRM-INTEGRATION.md` ·
  `LEAD-DELIVERY-CONTRACT.md` · `REPO-BASELINE.md`. `work-packages/AP02.md` §1.3 nennt für PT02.3
  zusätzlich die content-/asset-relevanten kanonischen Contracts, die AP01-Evidenz zu Musterbefunden,
  Epigenetik und Legacy-Assets sowie die Repository-Datenmodelle **read-only**.
- **Offene Dokumententscheidung für PT02.3:** In `building-docs/` existiert **kein** Content-/Asset-
  Contract. `I18N-CONTRACT.md` ist der nächstliegende bestehende Kanon und zuerst zu prüfen.
  `work-packages/AP02.md` §5.2 erlaubt, genau **einen** neuen kanonischen Contract je fehlender Domäne
  anzulegen (Namensvorschlag dort: `CONTENT-ASSET-CONTRACT.md`) — mit anschließender Aktualisierung von
  `CONTEXT-INDEX.md`. PT02.2 hat diese Entscheidung **nicht** vorweggenommen.
- **Weiterhin Pflicht für AP02:** `building-docs/AP01-RECONCILIATION-RESULT.md` — §2 Baseline Guards
  (`BG-01`–`BG-12`, gelten weiter), §6 Legacy Classification, §7 Toolchain Contract, §8 Known Remaining
  Debt (`D-01`–`D-30` mit Owner-APs).
- **Neu aus PT02.2 für PT02.3 relevant:** `ROUTING-CONTRACT.md` **R-28** (Route Registry ist keine
  Content-Datenbank) und **R-33** (genau eine Slug-Quelle je dynamischer Route) ziehen die Grenze, an
  der PT02.3 ansetzt: die fachlichen Datenquellen `src/data/services.tsx` (9), `src/data/articles.ts`
  (6/7) und `src/content/befunde/` (6 Panels, **JSON nur `de`/`en`**, `RD-14`) bleiben Eigentümer ihrer
  Datensätze. Dazu **R-49** (Sitemap-Einträge dynamischer Routen entstehen aus realer Datenquelle) und
  **`RD-9`** (Slugs heute doppelt geführt).
- Für AP02 weiterhin offene Punkte aus AP01: `D-11` (Node-Vertrag ungepinnt, AP28 PT28.7) ·
  `D-16` (manuelle Routenspiegel, jetzt präzisiert als `RD-10`) · `D-25` (Pre-Consent-Netzaktivität,
  AP06/AP22/AP23/AP26) · `D-27` (zweite Betriebswahrheit in `server/docker-compose.yml`, AP28 PT28.7) ·
  `D-29` (Musterbefund-Bundle, AP25/AP16).
- Reproduzierbare Verifikation (unverändert): isolierter Worktree auf HEAD, `npm ci` **im Root und in
  `server/`**, `tsc -b` (mit `--max-old-space-size=3072`), `vitest run`, `npm run build`, dann SSR auf
  isoliertem freiem Port (`NODE_ENV=production PORT=<frei> BACKEND_URL=http://127.0.0.1:39999
npx tsx server.ts`). `NODE_ENV` muss für `npm ci` **ungesetzt** sein. Das Root-`prepare`-Script
  (`lefthook install`) schreibt in die **geteilten** Git-Hooks — vorher sichern, danach zurückspielen
  (`D-13`).
- **Cold-Render-Regel für jede spätere SSR-Messung** (`RUNTIME-CONTRACT.md` M-08): eine Route, die der
  Prozess schon einmal gerendert hat, beweist nichts über die erste Auslieferung. Immer gegen einen
  frisch gestarteten Dienst und eine bis dahin nicht angeforderte Route messen.

## Handoff

- **AP02: `IN_PROGRESS`** · Last completed PT: **PT02.2 (`PASS`)** · **Next PT: PT02.3 — nicht gestartet**
- **AP01: `COMPLETE`** · AP01 closure: `PASS` (43/43) · **AP00: `COMPLETE`**, Closure `PASS` — beide
  unverändert erhalten
- **AP03: NOT STARTED.** AP02 ist **nicht** `COMPLETE`; das AP02-Closure Gate ist nicht gelaufen.
- Decision Locks: **18/18 `LOCKED`**, durch PT02.1 und PT02.2 unverändert. Baseline
  `feat/home-leadmagnet@961f65d` bleibt gesperrt und ist Ancestor des HEAD.

Kanonische Ausführungsevidenz AP01: **`building-docs/AP01-RECONCILIATION-RESULT.md`** (§1–§9).
Kanonische Ausführungsevidenz PT02.1: **`building-docs/RUNTIME-CONTRACT.md`** · PT02.2:
**`building-docs/ROUTING-CONTRACT.md`** — der jeweilige Vertrag ist das Artefakt; ein zweiter Report
wird dafür nicht angelegt.

Was PT02.1 hergestellt hat:

- **Ist/Soll getrennt:** §3.1 hält den gemessenen Rendering-Ist-Zustand fest (SSR-Entry, Hydration,
  Express-SSR-Pfad, Head-Injektion, Code-Splitting, Cold-Render-Verhalten, 404-Handshake,
  Runtime-Error-Pfad, Consumer, Epigenetik) — als Evidenz, ausdrücklich **nicht** als Ziel.
- **Zielvertrag RT-38–RT-70:** SSR als Standard für jede indexierbare Seite, Hydration-Determinismus,
  Lazy-Loading-Grenzen, saubere Trennung 404 vs. Runtime Error, ein kanonischer Head-/SEO-Pfad,
  Consumer × 10 und Epigenetik im normalen SSR-Vertrag.
- **Testbarkeit:** Zielmodell §5.4/§5.5 (Rendering-Pfad und Antwortklassen-Tabelle), Nachweise
  `RT-T14`–`RT-T22`, Modifikationsregeln `M-08`–`M-11`, Owner-Grenzen §11.1.
- **Schulden statt Reparaturen:** `RD-11`–`RD-16`, jede mit Owner-AP. **Keine** wurde behoben.

Was PT02.2 hergestellt hat:

- **Ist/Soll getrennt:** §3.1 klassifiziert die reale Routing-Wahrheit in acht Handspiegel (React Router ·
  Known Paths/Status · drei Sitemap-Tabellen · Search · Redirects · Canonical/hreflang · Navigation ·
  Tests) — als Evidenz, ausdrücklich nicht als Ziel.
- **Zielvertrag R-17–R-53:** zehn Locales aus der URL, unpräfixierte URLs nur als Redirect-Einstieg,
  13 Route-Klassen, eine kanonische Routing-Wahrheit mit 14 konzeptionellen Metadatenfeldern, klare
  Grenze Registry ↔ Content-Datenquelle, dynamische Slug-Auflösung mit echter 404, Redirect-Klassen
  A–E, verbindliche Statusmatrix, Canonical-/hreflang-Ableitung, Sitemap/Search/Navigation als
  **Konsumenten**, Consumer × 10, Epigenetik als eigenständige Säule.
- **Testbarkeit:** Nachweise `T-11`–`T-20`, Zuordnung der geforderten `RTG-01`–`RTG-14` auf die
  bestehende `R-`/`T-`-Konvention (§8.2), Modifikationsregeln `M-06`–`M-08`, Owner-Grenzen §10.1.
- **Schulden statt Reparaturen:** `RD-8`–`RD-14`, jede mit Owner-AP. **Keine** wurde behoben; `RD-2`
  (`/services*`) und `RD-6` (Consumer-`/en/`-Zwang) sind nun ausdrücklich als Zielverletzung benannt.

Verbindlicher Rahmen für PT02.3:

- **`ROUTING-CONTRACT.md` ist die einzige kanonische Routing-Wahrheit.** PT02.3 legt keinen zweiten
  Routing-, URL- oder Status-Contract an und verschiebt keine Routing-Entscheidung in die
  Content-Ebene.
- **R-28/R-33 sind die Schnittstelle:** die Registry kennt Existenz und Policy, die fachliche
  Datenquelle besitzt die gültigen Slugs. PT02.3 modelliert diese Quellen, ohne die Routing-Wahrheit zu
  duplizieren.
- AP02 bleibt Zielbild-Arbeit: es beschreibt die Architektur, es implementiert sie nicht.

Weiterhin gültiger AP01-Rahmen (nicht dupliziert, nur gezeigt, wo er steht):

- Baseline `feat/home-leadmagnet@961f65d` gesperrt; `main@d0fdf29` und `redesign/preview@5673b61` bleiben
  **ausschließlich selektive Quellen**, keiner ist Ancestor der Linie
  (`AP01-RECONCILIATION-RESULT.md` §1, §3, §4).
- **`BG-01`–`BG-12` gelten weiter** und sind vor jedem Merge in die Relaunch-Linie erneut zu prüfen
  (§2; Nachweismethodik §3.4, §4.5, §7.6, §9.5).
- **Toolchain:** npm, ein `package-lock.json` je Paket, Clean Install `npm ci` **im Root und in
  `server/`**; der Node-Vertrag ist dokumentiert, aber **nicht gepinnt** (`D-11`, AP28 PT28.7) — §7.
- **30 dokumentierte Schulden `D-01`–`D-30`** mit Evidenz und Owner-AP, keine AP01-blockierend (§8);
  die schwerste bleibt `D-25` (vier externe Hosts vor jeder Einwilligung, AP06/AP22/AP23/AP26).

Durchgehend gültig: `BG-01`–`BG-12` gelten weiter; `REST-03`, `DEC-RL-005` und `DEC-RL-006` sind durch
PT02.1 und PT02.2 bestätigt und nicht aufgeweicht. Der SSR-Vertrag verlangt eine **renderunabhängige**
Routenwahrheit (`RUNTIME-CONTRACT.md` RT-52/RT-56); PT02.2 weist sie der Route Registry zu (R-32, R-40).

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
