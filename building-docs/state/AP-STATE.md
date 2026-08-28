# AP Execution State

**Globaler serieller Handoff für alle Arbeitspakete AP00–AP33. Es gibt genau diese eine State-Datei.**
Keine zweite State-Struktur anlegen (kein `execution/APxx/STATE.md`, kein `state/APxx.md`,
kein `work-packages/APxx-STATE.md`).

---

## Current

- Work package: **AP09 — SEO-Plattformgrundlagen**
- Status: **IN_PROGRESS** <!-- NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE -->
- Predecessor: **AP08 COMPLETE / Closure PASS (50/50, 2026-08-26)**
- Last completed PT: **PT09.2 — Sitemap (PASS, 2026-08-27)**
- PT09.1: **PASS** · PT09.2: **PASS** · PT09.3: **NOT STARTED** · PT09.4: **NOT STARTED** ·
  PT09.5: **NOT STARTED** · AP09 Closure: **NOT STARTED**
- Next primary task: **PT09.3 — Consumer SEO**
- SEOHead: **consolidated** — eindeutige Meta-Ausgabeschicht; Title/Description/Robots/Canonical,
  x10-hreflang, `x-default=de`, Open Graph und Twitter folgen dem aktuellen URL-/Locale-Vertrag
- Canonical host: **`https://polarisdx.net`** · Canonical Contract: **PASS** · hreflang Contract:
  **PASS** · OG/Twitter Contract: **PASS** · Preview Domain Leakage: **0**
- 404 SEO Contract: **PASS** — HTTP 404 und `prerender-status-code` synchron; robots
  `noindex, follow`; Canonical 0; hreflang/x-default 0; OG-Locale-Alternates/`og:url` 0
- Canonical overrides: **audited** — REQUIRED 0 · REDUNDANT 0 · STALE 0 · INVALID 0 · remaining 0;
  Override-API ist Public-Host-/Query-/Fragment-guarded und regressionsgetestet
- Sitemap: **x10 / validated** — 39 indexierbare Route Families · 390/390 eindeutige öffentliche URLs ·
  Consumer 3×10 · Epigenetics/Befunde x10 · Services/Articles aus realen Datenquellen · XML PASS ·
  noindex/404/Redirect-Widersprüche 0 · ehrliches `lastmod` PASS
- SEO route-source: **registry-ready** — pfadlistenfreier SEOHead-Adapter plus der bestehende, aus
  `server.ts` herausgelöste Sitemap-Spiegel; dynamische Slugs werden aus Content-Daten abgeleitet;
  keine zentrale oder fünfte Route Registry gebaut
- DG09-01 `ROUTE_REGISTRY_INTEGRATION`: **READY_FOR_OWNER** · Owner **AP10 PT10.3** · AP09 Closure
  blocker **NO** bei grünen AP09-Gates · Launch blocker **YES**
- SEO-CONTRACT: **current for PT09.2** · G3: **PASS / CI ACTIVE** · Decision Locks: **18/18 LOCKED** ·
  AP10: **NOT STARTED**
- Quality PT09.2: Typecheck PASS · taskbezogener Lint/Prettier PASS · Sitemap Unit **13/13** ·
  SEOHead/Sitemap kombiniert **20/20** · gesamte Unit-Suite unter `NODE_ENV=test`/Node 22 **277/277** ·
  G3 + Hard-Failure-Self-Test PASS · Production-SSR SEO/Sitemap **7/7** mit 390/390 Sitemap-Zielen HTTP
  200/self-canonical/indexierbar · Client/SSR Build PASS · CI-Konfiguration auf aktuellem
  `console/**`-Relaunch-Pfad aktiv · globale, taskfremde Baseline ESLint 120 Errors/4 Warnings und
  Prettier 35 Dateien; PT09.2-Dateisatz ohne Befund

### AP08 (abgeschlossen, unverändert als Vorgänger-Handoff erhalten)

- PT08.1: **PASS** · PT08.2: **PASS** · PT08.3: **PASS** · PT08.4: **PASS** · PT08.5: **PASS** ·
  PT08.6: **PASS** · AP08 Closure: **PASS (50/50, 2026-08-26)**
- i18n Core: **consolidated** — `src/i18n.ts` ist die browser-/node-neutrale gemeinsame Wahrheit für
  exakt `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`, Default `de`, defensiven
  Fallback `en`, 15 produktive Namespaces, Default-/Fallback-Namespace, Interpolation und React-Regeln
- Locale source: **URL primary / verified** — Express, SSR-Entry, Client-Hydration und LanguageSwitcher
  verwenden dieselbe gemeinsame Locale-Normalisierung; kein LanguageDetector, Locale-Cookie,
  Locale-localStorage oder `navigator.language` als konkurrierende Quelle
- SSR/client parity: **verified** — 10/10 Production-SSR-Antworten HTTP 200 mit passendem `<html lang>`;
  10/10 Playwright-Hydrationen ohne Locale-Mismatch; persistierte Fremdwerte überschreiben `/pl/...` nicht
- Namespace loading: **deterministic / G4 verified** — Request-Locale plus defensiver EN-Fallback vor
  SSR geladen; 15/15 produktive Namespaces × 10/10 Locales vorhanden, parsebar und key-paritätisch;
  `casestudies` und `shop` explizit Backlog und nicht registriert
- Fallback semantics: **defensive / honest** — `_translationStatus` wird nur beim kanonischen
  EN-Fallback-Marker anerkannt; produktiver Epigenetik-Webcontent und Befunde sind x10 lokalisiert und
  tragen keinen regulären Marker; der Asset-Gate bleibt ausdrücklich PT08.6-owned
- Quality PT08.1: Typecheck PASS · taskbezogener Lint/Prettier PASS · Unit/Component **204/204** ·
  i18n-Core **20/20** · i18n SSR/Hydration E2E **12/12** · Production Build PASS · SSR Smoke
  **10/10 HTTP 200**, `<html lang>` 10/10 · unbekannte Locale sicherer bestehender 301-Pfad
- PT08.2 content migration: **ready x10** — S3-Leitlinie, Vitamin-D3-Implantologie, Consumer Spray,
  Masks, Duo, gemeinsame Shell sowie bestehende Order-/Modal-/Price-UI konsumieren `specialty` bzw.
  `consumer`; beide produktiven Namespaces enthalten ihre PT08.2-Keys vollständig für 10/10 Locales
- Locale formatting: **locale-aware** — Preis, Zahl, Datum und Währung beziehen die kanonische
  Runtime-Locale; keine feste `de-DE`-/`en-US`-Darstellung bleibt in den PT08.2-Flächen
- Quality PT08.2: Typecheck PASS · PT08.2-Tests **15/15** · Unit/Component **219/219** · x10-Render
  **50/50** · SSR/Hydration E2E **12/12** · Production Build PASS · AP07-Regressionsguards PASS;
  zwei unveränderte Lint-Baselinebefunde in `OrderModal.tsx` und `PriceBadge.tsx`, keine neue Regression
- PT08.3 parity: **PASS** — 15 produktive Namespaces × 10/10, JSON-/Key-/Nested-Key-Parität PASS,
  0 Missing/Extra/Empty, `epigenetics` 10/10 echte Zielsprachen, sechs Befunde × 10/10,
  `befund.*` und 18 `services.*.seo.*`-Pflichtwerte x10; slug-lokale Lazy-Grenze erhalten
- Guard/CI: **G4 PASS / ACTIVE** — `npm run check:i18n` mit hartem Missing-Key-Self-Test,
  Duplikat-/Restsprachenprüfung und generierter `I18N-CONTRACT`-Evidenz; CI erfasst `main`,
  `feat/home-leadmagnet` und `console/**`
- Quality PT08.3: Typecheck PASS · taskbezogener Lint PASS · Unit/Component **219/219** · gezielte
  Namespace/Core/Befund/Search-Tests **32/32** · SSR-Locale/Hydration E2E **12/12** · Production Build
  PASS mit sechs getrennten Befund-Chunks · SSR Content Smoke **80/80** · AP07-Regressionsguards PASS
- PT08.4 locale routing: **PASS** — Sprachwechsel erhält dieselbe logische Seite sowie Query/Hash;
  Consumer-EN- und Spezialseiten-DE-Zwangsredirects entfernt; URL, SSR-/Client-Locale und
  `<html lang>` synchron; Canonical/hreflang minimal an reale x10-Routen angepasst; `x-default=de`
- Quality PT08.4: Typecheck PASS · taskbezogener Lint/Prettier PASS · gezielte Unit-/Guard-Tests
  **31/31** · Routing/Language-Switch E2E **35/35** mit **160** parametrischen SSR-Routenfällen ·
  Consumer **3 × 10** und Spezialseiten **2 × 10** · Redirect-Loops **0** · Production Build PASS ·
  AP07 Search-/Internal-Link-Regressionsguards PASS
- PT08.5 system i18n: **PASS** — Contact, Support, Consumer Order, Praxis-Bestellanfrage und ROI
  transportieren eine validierte x10-Journey-Locale; Form-Validation, Loading, Success, Error und
  Privacy-/Consent-Copy sind x10; Consent-/Tracking-Semantik blieb unverändert
- Current user mail propagation: **PASS where runtime exists** — Support-Autoresponder sowie
  ROI-Nutzermail und Runtime-PDF folgen Subject/Body/Formatting-seitig der Journey-Locale; interne
  Team-Mails bleiben gemäß LDV-19 zulässig mono-sprachig
- Consumer Order system copy: **PASS x10**; es existiert keine Nutzer-Bestätigungsmail und die UI
  verspricht weder automatische Rechnung noch Mailbestätigung
- GENERAL_SALES: **PASS x10** — `common.nav.cta_quote` erhält in allen zehn Sprachen den
  Angebots-/Sales-Intent
- Future mail contracts: **owner-bound / false-ready 0** — Lead-Magnet-Gating AP19/AP22,
  dedizierte Epigenetics Inquiry AP15/AP22 und persistente Consumer-Mailplattform AP21/AP22 sind nur
  `READY_FOR_OWNER`, nicht als Runtime gebaut oder behauptet
- Quality PT08.5: Typecheck PASS · Prettier PASS · taskbezogener Lint PASS mit einem gegen `HEAD`
  reproduzierten unveränderten Tracking-Baselinebefund in `OrderForm.tsx` · fokussierte Form-/Mail-/
  Locale-/PDF-Tests **49/49** · G4 PASS · SSR/Hydration E2E **12/12** · SSR Locale Smoke **10/10** ·
  Production Build PASS · AP07 Search-/Internal-Link-/Navigation-Regressionsguards PASS
- PT08.6 asset truth: **PASS** — 32/32 produktive PDF-/ZIP-Dateien inventarisiert und referenziert,
  tatsächliche DE-/EN-Sprache explizit; vorhandene Varianten deterministisch gewählt; Single-Language-
  Assets tragen x10 lokalisierten sichtbaren Hinweis plus `hrefLang`; Broken References **0** und
  stiller Asset-Sprachfallback **0**
- Resource UI metadata: **PASS x10** — `/downloads` bezieht Titel/Beschreibung aus dem produktiven
  `downloads`-Namespace, zeigt Typ, Größe, locale-aware Datum und reale Dokumentsprache; Musterbefund-
  Webcontent x10 bleibt ehrlich von den sechs nur deutschen PDFs getrennt
- Asset owners: **owner-bound / false-ready 0** — neue Epigenetics-/Befund-Fachvarianten bleiben
  AP15/AP16/AP19, Consumer-OG AP21/AP09 und finale locale-aware OG-Auswahl AP09; keine PDF-/Bilddatei
  erzeugt, blind übersetzt oder verändert; keine AP19-/AP09-Plattform vorgezogen
- Quality PT08.6: Typecheck PASS · taskbezogener Lint/Prettier PASS · Asset-Guard **32/32 / 0 broken** ·
  G4 PASS · gezielte Node-Tests **76/76** plus Resource-Mapping **5/5** · Search-/Findability-/Navigation-
  Guards PASS · Production Build PASS · repräsentative SSR Resource-Smokes **25/25** und Asset-HTTP
  **32/32**
- AP08 Closure: **PASS (50/50)** — `I18N-01`–`I18N-40` **40/40**, Risiken `R08-01`–`R08-12`
  mitigiert bzw. ownergebunden; G4 inklusive Hard-Failure-Self-Test PASS; Typecheck PASS; AP08-Prettier
  PASS; Unit/Component/Integration **257/257**; Production-E2E **143/143**; direkte PT08-Render-Smokes
  **50/50**; Production Build/SSR PASS; False-ready Claims **0**
- Closure-Baseline: repositoryweit **124** ESLint-Befunde und **35** Prettier-Dateien gegenüber der
  dokumentierten QD-1/QD-2-Baseline **129/58**; AP08-Dateisatz ohne neue Befunde, zwei direkt gegen
  `HEAD` reproduzierte Consumer-Lint-Baselines bleiben ownergebunden
- AP07 regression: Search-Index, SearchModal, Shell-i18n, Navigation und interne Findability Guards PASS
- Decision Locks: **18/18 LOCKED**
- AP09 handoff after AP08: **STARTED; PT09.1 PASS, AP09 remains IN_PROGRESS**

### AP07 (abgeschlossen, unverändert erhalten)

- Work package: **AP07 — Suche und interne Findability**
- Status: **COMPLETE** <!-- NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE -->
- Predecessor: **AP06 COMPLETE / Closure PASS (40/40)**
- Last completed PT: **PT07.3 — interne Findability / Crosslinks (PASS, 2026-08-26)**
- PT07.1: **PASS** · PT07.2: **PASS** · PT07.3: **PASS** · AP07 Closure: **PASS (43/43, 2026-08-26)**
- Next work package: **AP08 — Internationalisierung / 10 Sprachen**
- Search index: **ready — expanded and route-validated** — 35 aktive Ziele, 9/9 Services, 6/6 veröffentlichte
  Artikel (slug-basiert), Epigenetik 1+3+6, Downloads, Events und strategische Seiten
- Search metadata x10: **verified** — Title, Description und Result-Type-Label für 35/35 aktive
  Einträge in `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`
- Search route validation: **350/350 HTTP 200** (35 aktive Ziele × 10 Locales);
  `/diagnostics/sports` = **ABSENT / HTTP 404**; 0 aktive `/services*`, Future-, Backlog- oder Chat-Ziele
- Deferred Search Integrations: **4 OPEN, ownergebunden** (`DSI-01` Epigenetik-Body → AP15,
  `DSI-02` Befund-Body → AP16, `DSI-03` Artikel-Body → AP17, `DSI-04` Consumer-x10-Routing → AP21);
  **0 false READY**, keine AP04-Deferred-Gates geschlossen
- Search matching: case-insensitive · Whitespace normalisiert · Diakritika normalisiert ·
  Titel/Beschreibung · deterministische Priorität/Pfad-Reihenfolge
- SearchModal: **ready / accessible** — AP05-Dialog wiederverwendet; benannte Dialogsemantik, gelabeltes
  Search-Input, deterministischer Initialfokus, Fokusfalle/-rückgabe, Escape/Backdrop/Close,
  Scroll-Lock, acht lokalisierte Ergebnisgruppen, Initial-/Loading-/Empty-/Error-State und polite
  Ergebnisansage; Desktop und 390-px-Mobile keyboard-operable, Reduced Motion verifiziert
- Keyboard/Focus: **verified** · Result Groups / Empty State: **ready** · Mobile: **verified**
- SearchModal UI copy x10: **verified** — Dialogtitel, Input, Close, Zustände, pluralisierte Ansage,
  Gruppen und Escape-Hinweis in `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`
- Internal Findability: **ready / verified** — 43/43 strategische aktuelle Routen klassifiziert,
  40 `FINDABLE`, 3 Consumer `INTENTIONAL_LIMITED_FINDABILITY`, **0 `UNINTENDED_DIRECT_URL_ONLY`**
- Internal links: Diagnostics-Hub 9/9 · Artikel 6/6 mit reziproker Service-Zuordnung · Epigenetik-Hub
  → 3 Vertiefungen + 6 Befunde · Befunde/Vertiefungen → Hub · Downloads → vier reale Kontexte ·
  Events → Contact · 0 produktive `/services*` · reale Hashes `#vergleich`, `#musterbefunde`,
  `#roi-rechner`; Dental-Rich-Content x10 auf kanonisches `/<locale>/vitamin-d3-implantologie`
  korrigiert und nicht verfügbaren Backlog-Case-Study-Link entfernt
- Deferred Internal Link Integrations: **3 OPEN, ownergebunden** (`DLI-01` Consumer-B2B-Einstieg →
  AP21, `DLI-02` finale Epigenetik-Inquiry → AP15, `DLI-03` finaler Lead-Magnet-Gate → AP19);
  alle mit Owner, Required-before, Current Safe State und **0 false READY**
- Guard: `check:search-index` und `check:internal-findability` in pre-commit und CI; Matrix-, Ziel-,
  Relationship-, Hash-, x10- und Negativkontrollen grün
- Quality: Typecheck PASS · Unit/Component **184/184** unter Node 22 / `NODE_ENV=test` · PT07.3 +
  SearchModal E2E **9/9** · Production Build PASS · Search-SSR **350/350** aktive Ziele HTTP 200,
  `/de/diagnostics/sports` HTTP 404 · Internal-Link-Crawl **PASS** (43 Quellen, 2.538 Links,
  115 eindeutige Ziele, 112 Hash-Links, 0 Fehler) · voller Lint 126 Findings (Baseline vor PT07.2:
  127, 0 neue) · voller Prettier-Check 38 Dateien (identische Baseline)
- Decision Locks: **18/18 LOCKED**
- AP08 handoff at AP07 Closure: **NOT STARTED**

### AP06 (abgeschlossen, unverändert erhalten)

- Work package: AP06 — App Shell, Header, Footer und globale Navigation
- Status: COMPLETE
- **AP06 closure: PASS (40/40, `C06-01`-`C06-40`; Navigations-Invarianten `NAV-01`-`NAV-28`)**
- Last completed PT: **PT06.5 — Navigationstests (PASS, 2026-08-25)**
- PT06.1: PASS · PT06.2: PASS · PT06.3: PASS · PT06.4: PASS · **PT06.5: PASS**
- **Next work package: AP07 — Suche und interne Findability — NICHT gestartet**
- Header: **ready** · Diagnostics mega menu: **ready** · Footer: **ready** ·
  Global helpers: **ready**
- **Productive ChatWidget/HiHuman: absent** — 0 Treffer im ausgelieferten Client-Bundle,
  0 Treffer im SSR-HTML, 0 Netzwerk-Requests. `/api/chat` (AP22 PT22.7) und die
  HiHuman-CSP-Domains (AP26 PT26.2) bewusst **unveraendert** — beides in der Closure
  laufzeitgeprueft, nicht vorgezogen
- Navigation tests: **green** — 32 E2E-Navigationstests, 87/87 Playwright gesamt
- Shell x10: **verified** — 100/100 SSR-Antworten (10 Sprachen x 10 Shell-Routen) HTTP 200,
  50 Beschriftungen in 10 Sprachen maschinell gegated
- Route targets: **validated** — 26 Ziele gegen 33 definierte Routen, 9/9 Service-Routen
  HTTP 200, `/diagnostics/sports` und `/diagnostics/epigenetics` 404, 0 `/services*`-Ziele
- Epigenetics: **eigenstaendig** — eigener Hauptnavigationspunkt (Desktop + Mobil),
  eigene Footer-Spalte, nie unter `/diagnostics/`
- General CTA: **normalized** (`GENERAL_SALES`, `nav.cta_quote`, x10 uebersetzt)
- Guarantee band: **absent** · Light theme: **locked** (0 `dark:` in der Shell)
- **Closure-Befund 1 (offen, nicht behoben):** `e2e/navigation.spec.ts` -> "das Mega-Menue
  oeffnet mit der Tastatur" ist **flaky**. Im vollen Parallellauf einmal rot, im Retry
  gruen; isoliert mit `--repeat-each=3 --retries=0` **96/96 gruen**. Ursache ist ein
  Hydrations-Rennen des Tests, kein Produktdefekt: `entry-client.tsx` hydriert erst nach
  `i18nReady`, und unter Worker-Last kann der Tastendruck vor dem Anhaengen der
  React-Handler landen. Nicht in der Closure korrigiert (`AP06.md` §44 erlaubt keine
  Testarbeit) — Korrektur ist ein Einzeiler (Hydrations-Wartepunkt) und liegt beim
  naechsten Owner der Datei
- **Closure-Befund 2 (offen, Owner AP09/AP21):** der Kommentar ueber den Consumer-Routen
  in `src/App.tsx` behauptet "Nicht in Navigation/Sitemap, noindex, server-seitig
  passwortgeschuetzt". Laufzeitgemessen gilt: **3 Consumer-URLs stehen in der Sitemap,
  es gibt kein `noindex`, und `/en/consumer/vitamin-d3-spray` antwortet ohne Passwort mit 200.** Nur "nicht in der Navigation" stimmt. Reiner Kommentar, keine Laufzeitwirkung —
  in der Closure bewusst nicht editiert
- **Korrektur zum PT06.5-Report:** dort stand "echter 301 fuer `/services`". Praezise gilt:
  **`/services` (ohne Locale-Praefix) ist ein echter 301**; **`/de/services` antwortet
  dagegen mit 200** und leitet erst clientseitig ueber `<Navigate>` um (`App.tsx` §585).
  Fuer AP06 ist das folgenlos — 0 produktive Navigationsziele zeigen dorthin (`IAD-18`) —,
  die Server-301-Weiche gehoert **AP10**
- Lint/Format: rot, aber **vollstaendig vorbestehend** und bereits als `QD-1`/`QD-2`
  (BASELINE_DEBT, Owner AP27 PT27.6.7) in `QUALITY-GATES.md` registriert. 128 Lint-Findings
  (Baseline 129), 38 Prettier-Dateien — **0 davon in `src/`, 0 in einer von AP05/AP06
  angefassten Datei**. Die CI-Steps `Lint` und `Format check` sind vorbestehend, nicht von
  AP05/AP06 hinzugefuegt
- AP07: **NOT STARTED**
- **AP07-PLANNING-FIX (2026-08-26, Teilergebnis — reiner Dokumentfix, keine Implementierung):**
  `building-docs/AP07-FINDABILITY-MATRIX.md` **neu angelegt** und in `CONTEXT-INDEX.md` als
  **das eine** kanonische operative AP07-Artefakt registriert (Section A Search Coverage,
  Section B Internal Findability, Section C gemeinsames Deferred-Register `DSI-xx`/`DLI-xx`,
  Section D Closure Evidence). Sections A/B/C/D sind **schemadefiniert und bewusst leer** —
  befuellt werden sie erst von `PT07.1`/`PT07.3`/`AP07-CLOSURE`. Enthalten sind bereits
  verbindlich: die praezisierte x10-Linklabel-Regel, die AP08/AP21-Forward-Dependency-Ausnahme
  gegen einen AP07→AP08-Deadlock, die sieben PASS-Bedingungen fuer ein Consumer-`DLI`, die
  `C07-38`/`C07-39`-Haertung und die Owner-Grenzen AP08/AP10/AP15/AP21.
- **AP07-PACKAGE-CREATION (2026-08-26 — reiner Dokumentfix, keine Implementierung):** der im
  Planning-Fix als BLOCKED gemeldete Rest ist **aufgeloest**.
  `building-docs/work-packages/AP07.md` und `building-docs/work-packages/ap07-prompts.md` sind
  **neu angelegt**. AP07.md fuehrt 21 Abschnitte in der Tiefe von AP05/AP06: Master-Scope-Vertrag,
  Start-Gate, Ownership-Tabelle, gemessene Repository-Ausgangslage, Matrix- und Such-Vertrag,
  vollstaendige Spezifikationen `PT07.1`/`PT07.2`/`PT07.3`, die x10-/Forward-Dependency-Regel,
  **30 Findability-Invarianten `FIND-01`–`FIND-30`**, Hotspots, Qualitaetsstrategie, DoD,
  **43 Closure-Gates `C07-01`–`C07-43`**, 10 Risiken `R07-01`–`R07-10` und die Handoffs an
  AP08/AP10/AP15/AP16/AP19/AP22. `ap07-prompts.md` enthaelt **vier** eigenstaendige Prompt-Bloecke
  (`PT07.1`, `PT07.2`, `PT07.3`, `AP07-CLOSURE`), jeder mit Context Bootstrap, Start-Gate, Scope,
  Implementierung, Owner-Grenzen, Tests, PASS-Kriterien, State-Handoff und exaktem Reportformat.
  `CONTEXT-INDEX.md` **nicht geaendert**: `AP07.md` ist ueber `ALWAYS_READ` gedeckt,
  `AP07-FINDABILITY-MATRIX.md` seit dem Planning-Fix in der AP07-Zeile registriert, und
  Prompt-Ketten sind dort fuer **kein** Arbeitspaket gelistet.
- **Gemessene AP07-Ausgangslage (Evidenz in `AP07.md` §4, erhoben 2026-08-26):** der Suchindex
  `src/hooks/useSearch.ts` fuehrt 6 statische Seiten und **4** Services — davon ist einer,
  `id: 'sports'` → `/diagnostics/sports`, ein **toter Treffer** (HTTP 404); **5 von 9** Services
  fehlen; Service-Titel sind hartkodierte Literale und damit nicht x10; Epigenetik-Vertiefungen,
  Musterbefunde, Downloads, Events und weitere statische Seiten fehlen vollstaendig.
  `SearchModal.tsx` hat **keine** Dialogrolle, **keine** Fokusfalle, **keine** Fokusrueckgabe und
  **keinen** Escape-Handler — obwohl die Fusszeile hartkodiert „Esc to close" verspricht.
  Der AP05-`Dialog` deckt all das bereits ab; `PT07.2` ist Wiederverwendung, kein Neubau.
- **Gemessene Epigenetik-Inhaltsschuld:** `public/locales/*/epigenetics.json` existiert in allen
  zehn Sprachen, aber **172 von 172 Strings (100 %)** sind in den acht Nicht-DE/EN-Locales
  woertlich englisch; die Musterbefunde liegen als `*.de.json`/`*.en.json` vor, acht Sprachen
  fehlen. Das ist die reale **AP15/AP08**-Schuld und gehoert als `SEARCH_DEFERRED_CONTENT` ins
  Register — die **Routen** sind davon unberuehrt.
- **Sachliche Korrektur einer Planungsannahme:** `/epigenetics/grundlagen`, `/epigenetics/studienlage`
  und `/epigenetics/unterlagen` sind **nicht** „nicht existent". Sie sind in `src/App.tsx:496/504/512`
  definiert, antworten mit **HTTP 200** und sind seit `PT06.3` aus dem Footer verlinkt
  (`Footer.tsx:68–70`). Der reale AP15-Anteil ist ein **Inhalts-**, kein Routenthema
  (Epigenetik-Content nur DE+EN vollstaendig) und gehoert als `SEARCH_DEFERRED_CONTENT` ins
  Register — nicht als `SEARCH_DEFERRED_ROUTE_OWNER`. Details:
  `AP07-FINDABILITY-MATRIX.md` §6.1.

### AP05 (abgeschlossen, unveraendert erhalten)

- Work package: AP05 — Sales-Machine Design-System und Light-Theme-Grundlage
- Status: COMPLETE
- **AP05 closure: PASS (32/32, `C05-01`–`C05-32`)**
- Last completed PT: **PT05.5 — Motion, Visual Regression und Error States (PASS, 2026-08-25)**
- **Next work package: AP06 — App Shell, Header, Footer und globale Navigation — NICHT gestartet**
- PT05.1: PASS · PT05.2: PASS · PT05.3: PASS · PT05.4: PASS · **PT05.5: PASS**
- Sales-Machine design system: **ready** · Light theme: **locked** ·
  Core UI patterns: **tested** · Visual regression baseline: **recorded**
- **KORREKTUR zu PT05.3/PT05.4 (in der Closure gemessen):** die dort berichtete Aussage
  „Fokusring bei 14/14 per Tastatur angesteuerten Elementen sichtbar" beruhte auf einem zu
  weiten Pruefpraedikat — es zaehlte auch `outline: 2px solid transparent` (Tailwinds
  `outline-none`-Reset) und den UA-Standardring als Treffer. Mit korrektem Praedikat
  (Outline mit Breite > 0 UND nicht transparenter Farbe, oder ein nicht vollstaendig
  transparenter Box-Shadow) gilt: **AP05-eigene Komponenten 27/27 mit sichtbarem Fokus,
  0 ohne** (gemessen in der Galerie). Auf `/de/contact` haben dagegen **7 von 16**
  Tab-Zielen keinen sichtbaren Fokusring — ausschliesslich Header-Navigationslinks und der
  Suchknopf aus `src/components/layout/Header.tsx` sowie Seiten-CTAs. Diese Flaechen sind
  **vorbestehend** (AP05 hat `Header.tsx` nicht angefasst — 0 Aenderungen; die einzige
  AP05-Aenderung an `ContactPage.tsx` ist ein tokengleicher Typo-Rollen-Tausch) und gehoeren
  **AP06** (App Shell/Navigation) bzw. **AP24** (A11y-Abnahme). Als Later-Owner-Item
  registriert, nicht in der Closure nachgeholt.
- Motion/reduced motion: **standardized** (`DESIGN-SYSTEM-CONTRACT.md` §8/§9.1–9.2)
- Visual regression: **recorded** — `e2e/design-system.spec.ts`, 28 Baselines
  (22 Oberflaechen + 6 Seiten), 35/35 Tests gruen, zweimal in Folge deterministisch
- Error-state pattern: **recorded** (§9.5) — Renderfehler != 404, kein Stacktrace
- Design-system changelog: **recorded** (`building-docs/DESIGN-SYSTEM-CHANGELOG.md`),
  Gate `npm run check:ds-changelog` pre-commit **und** in CI
- Sales-Machine layout patterns: **standardized**
  (`src/components/layout/Section.tsx`; Sektionskatalog `DESIGN-SYSTEM-CONTRACT.md` §6)
- Core UI components: **standardized** (`src/components/ui/**`;
  `DESIGN-SYSTEM-CONTRACT.md` §5)
- Component tests: **recorded** — 11 Testdateien, **80 Tests, alle gruen**
  (vorher 7 Dateien / 18 Tests)
- **KORREKTUR zu PT05.1/PT05.2:** Die dort berichteten „5 jsdom-`ERR_REQUIRE_ESM`-Fehler,
  vorbestehende Baseline-Luecke, Owner AP27" waren **keine** Repo-Luecke, sondern zwei
  Artefakte der lokalen Shell: das Default-`node` ist hier **v18** (kein `require(ESM)`,
  daher `ERR_REQUIRE_ESM` in jsdom), und **`NODE_ENV=production`** ist gesetzt, wodurch
  React seinen Production-Build laedt, in dem `React.act` fehlt. Unter Node 22 mit
  `NODE_ENV=test` — also unter den CI-Bedingungen — lief die Suite **schon vor PT05.3
  vollstaendig gruen (7/7 Dateien, 18/18 Tests)**. Es gibt hier keinen Test-Blocker und
  keine offene AP27-Testschuld aus AP05.
- Typography: **standardized** (`src/index.css` `@layer components`, Praefix `.t-*`;
  `DESIGN-SYSTEM-CONTRACT.md` §4)
- Font pipeline: **self-hosted** — `@fontsource-variable/inter`, ein Import in
  `entry-client.tsx`, Fallback-Metriken + SSR-Preload; **0 externe Font-CDN-Abhaengigkeit**
  zur Laufzeit und zur Bauzeit
- Visual baseline/tokens: **recorded** (`building-docs/DESIGN-SYSTEM-CONTRACT.md`, `tailwind.config.js`)
- Light theme: **locked** — 0 `dark:`-Klassen, kein `darkMode`, kein `prefers-color-scheme`,
  kein Theme-Switcher, keine parallele Dark-Token-Familie (empirisch gemessen)
- Token guard: **active** — pre-commit (`lefthook.yml`) **und** CI
  (`.github/workflows/ci.yml`, Step „Color/token guard")
- Design-system contract: **recorded** (`building-docs/DESIGN-SYSTEM-CONTRACT.md`, neu angelegt;
  in `CONTEXT-INDEX.md` als AP05-Required-Context registriert). `docs/design-system.md` ist als
  **nicht kanonisch** gekennzeichnet — keine zweite Token-Wahrheit.
- AP06: IN_PROGRESS (PT06.1 PASS) — siehe oben
- **AP05 bleibt bis AP05-CLOSURE `IN_PROGRESS`.**

### AP04 (abgeschlossen, unverändert erhalten)

- Work package: AP04 — Content-Strategie, Content-Modell und Launch-Content-Readiness
- Status: COMPLETE
- **AP04 closure: PASS (32/32, `C04-01`–`C04-32`)**
- Last completed PT: **PT04.4 — Asset-Readiness (PASS, 2026-08-25)**
- **Next work package: AP05 — Sales-Machine Design-System und Light-Theme-Grundlage — NICHT gestartet**
- **AP04 Closure PASS bedeutet ausdrücklich NICHT, dass die Website x10-launchfertig ist.**
  Es bedeutet: die AP04-eigene Content- und Asset-Readiness ist abgeschlossen, und alle verbleibenden
  Content-, Runtime-, Approval- und Asset-Gates sind explizit, ownergebunden und gehen nicht verloren
  (`AP04.md` §16.3).
- **AP04-RECOVERY (2026-08-25): PASS** — Deadlock aufgelöst, Deferred-Gate-Modell eingeführt
- PT04.1: PASS · PT04.2: PASS · **PT04.3: PASS** · **PT04.4: PASS**
- Asset readiness: recorded (`CONTENT-MATRIX.md` §26) — 0 broken references, CD-7 aufgelöst,
  43 Sprachlabels ergänzt, 0 unsichere Löschungen
- Deferred gates: **10 registriert** (`DG-01`–`DG-09`, `CONTENT-MATRIX.md` §24/§26.8) —
  0 AP04-Closure-Blocker, 9 Launch-Blocker weitergetragen, `DG-06b` fachlich zu klären,
  0 als READY markiert
- Content audit: recorded (`building-docs/CONTENT-MATRIX.md` §4–§14)
- Content types: standardized (`building-docs/CONTENT-MATRIX.md` §19–§21, `CT-01`–`CT-10`,
  CTA-Taxonomie `CTA-01`–`CTA-10`)
- Launch content: **AP04-eigener Anteil vollständig** (`CONTENT-MATRIX.md` §25) — Key-Parität 0 Lücken,
  CTA-Standard 10/10, Chat-/Garantie-Copy 0 Treffer, Success-Semantik 10/10, `CV < 2 %` 184 × einheitlich,
  0 Placeholder/Mocks. Epigenetik-Webcontent, Musterbefund-Inhalte, Consumer, Systemmail und Artikel sind
  als **Deferred Gates mit späteren Owner-APs** registriert (§24) — offen, nicht erledigt, 0 False-Ready
- CTA/system-copy readiness: CTA recorded und hergestellt · System-Copy **deferred an AP22/AP08 PT08.5** (`DG-04`)
- Content matrix: updated (33 Content-Einheiten `C-01`–`C-33` mit Typ-, CTA-, Public/Gated-,
  Sensitive- und Standardisierungsstatus)
- AP05: IN_PROGRESS (PT05.1 PASS) — siehe oben
- AP03: COMPLETE · AP03 closure: PASS (24/24, `C03-01`–`C03-24`) — unverändert erhalten
- Last completed PT of AP03: PT03.4 — Navigation und interne Findability (PASS); PT03.1–PT03.4 alle PASS
- IA inventory: recorded (`building-docs/IA-INVENTORY.md` §4–§7)
- Page type taxonomy: recorded (`building-docs/IA-INVENTORY.md` §8)
- Core journeys: recorded (`building-docs/IA-INVENTORY.md` §9)
- Navigation/findability contract: recorded (`building-docs/IA-INVENTORY.md` §10)
- AP02: COMPLETE · AP02 closure: PASS (23/23, `C02-01`–`C02-23`) — unverändert erhalten
- SSR/rendering contract: recorded (`building-docs/RUNTIME-CONTRACT.md`)
- Routing/route-registry contract: recorded (`building-docs/ROUTING-CONTRACT.md`)
- Content/asset contract: recorded (`building-docs/CONTENT-ASSET-CONTRACT.md`)
- Lead/backend contract: recorded — verteilt auf `LEAD-DATA-CONTRACT.md` (Hub, §2.1 Vertragslandkarte),
  `BACKEND-API-CONTRACT.md`, `LEAD-DELIVERY-CONTRACT.md`, `CRM-INTEGRATION.md`
- Production/deployment contract: recorded (`building-docs/DEPLOYMENT-CONTRACT.md`)
- AP01: COMPLETE · AP01 closure: PASS (43/43, `C01-01`–`C01-43`) — unverändert erhalten
- AP00: COMPLETE · AP00 closure: PASS (unverändert erhalten)
- Baseline: `feat/home-leadmagnet@961f65d` — Ancestor des aktuellen HEAD, empirisch bestätigt
- Baseline evidence: recorded · `main` Import Ledger: recorded · redesign patterns: recorded ·
  legacy classification: recorded · final clean build evidence: recorded · **closure evidence: recorded**
  (`building-docs/AP01-RECONCILIATION-RESULT.md` §1–§9)
- Current branch: `console/ap09-2026-08-27T08-46-17`
- Current HEAD: `6b0ed1363f08fa241a7b21d226c3a7dd4a6493bb` — empirischer PT09.1-Start-/
  Verifikations-HEAD; bestehender umfangreicher gestagter AP05–AP08-Working-Tree als geschützte Basis
- Started: 2026-08-24 (AP02); AP01 gestartet und abgeschlossen 2026-08-24
- Last updated: 2026-08-27 (PT09.2 PASS; next PT09.3)

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
- PT02.3 — Content-/Asset-Zielarchitektur im **neuen** kanonischen `CONTENT-ASSET-CONTRACT.md`
  festgeschrieben (AP02.md §5.2: genau ein neuer Contract je fehlender Domäne): Ist-Erhebung §3.1
  (Klassen A–H, read-only), Zielinvarianten **CA-01–CA-40** (Vier-Schichten-Modell, fachliche Daten,
  i18n-Grenze, spezialisierte Content-Daten, Asset-Referenzen, sprachabhängige Assets, PUBLIC/GATED,
  Security/Privacy, CMS-Grenze), Domänenmodelle §5 (Musterbefund, Artikel, Service, Event, Resource)
  plus SEO-Grenze, Schulden **CD-1–CD-10**, Regeln **CM-01–CM-06**, Nachweise **CA-T1–CA-T14** mit
  `CONTENT-xx`-Zuordnung, Owner-Grenzen §11. `CONTEXT-INDEX.md` entsprechend ergänzt.
  **Kein Inhalt migriert, keine Übersetzung erzeugt, kein Asset geändert, kein Gating, kein CMS.**
- PT02.4 — Lead-/Backend-Zielbild in den **vier bestehenden** kanonischen Verträgen bestätigt und
  vervollständigt statt in einem neuen Dokument: `LEAD-DATA-CONTRACT.md` erhält §2.1 (Vertragslandkarte
  über alle 28 Themen), §3.1 (Ist-Erhebung A–K, read-only), **LD-27–LD-33** (Systemgrenzen inkl.
  Browser-Speicher, Deduplication ≠ Idempotenz, Retention als `TBD_OWNER_LEGAL`, Löschkonsistenz, kein
  Chat, Anbieterneutralität von Speicher/Queue), §9.1 (`LEAD-01`–`LEAD-22`-Zuordnung) und erweiterte
  Forbidden Regressions; `BACKEND-API-CONTRACT.md` erhält **API-21–API-23** (keine sensiblen Daten in
  der URL, Origin-/CORS-/CSRF-Entscheidung je Endpunkt, kein offener Relay); `CRM-INTEGRATION.md`
  präzisiert CRM-09 gegen LD-28; `LEAD-DELIVERY-CONTRACT.md` geprüft und **ohne Lücke** bestätigt.
  **Keine neue Ist-Schuld** — die Messung bestätigt `AD-1`–`AD-11`, `LDD-1`–`LDD-12`, `LVD-1`–`LVD-12`
  und die CRM-Schulden. Kein Endpunkt, keine Persistenz, keine Queue, kein CRM, kein Gating
  implementiert; **keine Anbieterentscheidung** getroffen.
- PT02.5 — Produktionsbetriebs-Zielbild im kanonischen `DEPLOYMENT-CONTRACT.md` präzisiert: §3.1
  Ist-Erhebung (read-only, ohne Dienststart, ohne Secret-Zugriff), **DEP-37–DEP-57** (privates Netz und
  Exposition, Reverse Proxy im Detail inkl. Forwarded-Header und Cache-Verträglichkeit, Gesundheit und
  Bereitschaft, Logs und Korrelation, Umfang/Abgrenzung inkl. Legacy, Docker/Compose-Grenze,
  Anbieterneutralität, Network-Allowlist), **§5.6 Ausfallmodi** (12 Fälle), **DD-15–DD-17**,
  **M-09/M-10**, **D-T16–D-T22** und §9.2 mit der Zuordnung der geforderten Betriebssemantik auf die
  bestehende `DEP-`-Systematik, Owner-Grenzen §11.1. **Kein Deployment, kein Dienststart, kein
  Image-Build, keine Docker-/Compose-/nginx-/Environment-Änderung.**
- AP03-CLOSURE — Closure Gate `PASS`: `C03-01` bis `C03-24` geprüft. Inventar 27/27 Seitenfamilien,
  Diagnostik 9/9, Epigenetik Hub + 3 Vertiefungen + 6 Musterbefunde, Consumer 3 × 10, Spezial-/
  Redirect-/404-Pfade getrennt, **0 unklassifizierte Seiten**, sieben Kernjourneys `J-01`–`J-07`,
  gated Secondary Conversion vorhanden, Epigenetik eigenständig mit eigenem Navigationspunkt und
  eigener Inquiry, Consumer indexierbar × 10, Navigation-/Findability-Modell vollständig, kein Chat,
  Backlog nicht reaktiviert, Route- und Lead-Contract-Konsistenz belegt, genau **ein** kanonisches
  IA-Artefakt, AP04 nicht gestartet. **AP03-Delta seit dem AP02-Closure-Commit: 3 Dateien, alle unter
  `building-docs/` — 0 Nicht-Dokumentationsdateien.** Decision Locks **18/18**.
- PT03.4 — Navigations- und Findability-Vertrag in `IA-INVENTORY.md` §10 festgeschrieben: Ist-Erhebung
  §10.2 (Header, Footer, Search, Breadcrumbs, ChapterNav, Consumer- und Legacy-Links, read-only),
  Header-IA §10.3, Diagnostik- und Mega-Menü-Rolle §10.4, **Epigenetik als eigener
  Hauptnavigationspunkt** §10.5, IglooPro-Findability §10.6, Footer-IA §10.7, Consumer-Findability
  §10.8 (Main Nav `INTENTIONALLY_NONE`, Footer `INDIRECT`, Search `SEARCHABLE`, organische Suche als
  primärer Kanal), Search-Policy §10.9, Breadcrumb §10.10, ChapterNav §10.11, Crosslinks §10.12,
  CTA-Findability §10.13, locale-sichere Verlinkung §10.14, **finale Klassifikationsmatrix §10.15 über
  alle 27 Familien** und Redirect-/404-Policy §10.16. Neue Schulden `IAD-15`–`IAD-19`; Invarianten
  `IA-09`, `IA-17`, `IA-18`, `IA-19`, `IA-20` abgedeckt — **alle 25 IA-Invarianten adressiert**.
  **Keine Navigation, Search, Breadcrumb, ChapterNav, Route, SEO- oder Content-Implementierung.**
- PT03.3 — Sieben Kernjourneys in `IA-INVENTORY.md` §9 modelliert: `J-01` Diagnostik → Service →
  Angebot · `J-02` IglooPro → Anfrage/ROI/Download · `J-03` Epigenetik → Panel/Musterbefund → eigene
  Inquiry · `J-04` Content → Lösung → CTA · `J-05` Resource → Gate → CRM → Asset · `J-06` Consumer →
  Landingpage → Bestellung · `J-07` Bestandskunde → Support/Downloads. Je Journey Zielgruppe,
  Startpunkte, Zwischenstationen, Seitenfamilien, primäre und sekundäre Conversion, AP02-Lead-Typ,
  Success-/Failure-State, Crosslinks, Sprachumfang und Owner-APs (§9.5); gemeinsame Regeln §9.1
  (Lead-Ziel Persistenz + CRM, Consent-Grenze, CTA-Naming), Übersicht §9.3, **Sackgassenanalyse §9.4**.
  Invarianten `IA-16`, `IA-21`, `IA-22` abgedeckt. **Keine Journey implementiert.**
- PT03.2 — Seitentyp-Taxonomie und Rollenmodell in `IA-INVENTORY.md` §8 festgeschrieben: 10 primäre
  Seitentypen (`T1`–`T10`) plus technische Klassifikation, Rollenmodell je Typ (§8.2), kontrollierte
  Vokabulare für Zielgruppen, Absichten, Aufgaben, CTA- und Conversion-Rollen (§8.3), **Rollenmatrix
  über alle 27 logischen Seiten** (§8.4, keine `UNCLASSIFIED`), vorläufige Findability- und
  Indexierungsrollen (§8.6). Neue Rollen-Schulden `IAD-12`–`IAD-14`; Invarianten `IA-03`–`IA-07`,
  `IA-12`, `IA-15`, `IA-20` abgedeckt. **Keine Seite, Route, Navigation, Suche, Breadcrumb,
  ChapterNav, SEO-, Content-, i18n- oder Lead-Implementierung; PT03.3/PT03.4 nicht vorgezogen.**
- PT03.1 — Kanonisches Seiten- und Routeninventar im **neuen** `IA-INVENTORY.md` erstellt
  (`AP03.md` §5.2: genau ein IA-Hauptartefakt, da keines existierte): 10 Hauptseiten, 9
  Diagnostik-Services, IglooPro, Epigenetik-Hub + 3 Vertiefungen, 6 Musterbefunde, 6 Artikel, Events,
  Downloads/Resources, 3 Consumer-Familien, About/Contact/Support/Legal, 3 Spezialseiten, 6 Redirect
  Sources, 404 und 6 technische Pfadklassen — insgesamt **27 Seitenfamilien/Rollen** (P-01–P-27) mit
  CURRENT-/TARGET-Trennung, Ziel-URL-Abdeckung **412**, IA-Schulden `IAD-01`–`IAD-11` mit Owner-AP,
  Owner-Mapping §10, Invarianten-Nachweis §11 (`IA-01`, `IA-02`, `IA-08`, `IA-10`, `IA-11`, `IA-13`,
  `IA-14`, `IA-23`, `IA-24`, `IA-25`). `CONTEXT-INDEX.md` ergänzt. **Keine Route, Navigation, Suche,
  SEO-, Content- oder i18n-Änderung; PT03.2–PT03.4 nicht vorgezogen.**
- AP02-CLOSURE — Closure Gate `PASS`: `C02-01` bis `C02-23` geprüft. PT02.1–PT02.5 vollständig gegen
  Master-Scope, `AP02.md` und den realen Contract-Zustand verifiziert; Cross-Contract-Konsistenz in
  13 Querbezügen belegt; Decision Locks **18/18**; **0 Nicht-Dokumentationsdateien** im AP02-Delta;
  keine konkurrierende Contract-Datei, keine ID-Duplikate; keine Implementierung aus AP03–AP33
  vorgezogen. Closure-Evidenz über Contract-Diffs + diesen State (`AP02.md` §5.3, Variante 2) —
  **kein separater Report angelegt**.

- PT04.1 — Content-Audit abgeschlossen: `building-docs/CONTENT-MATRIX.md` als kanonische
  Launch-Content-Matrix angelegt (33 Content-Einheiten `C-01`–`C-33` über alle 27 IA-Seitenfamilien
  plus Systemmail-, ROI-PDF-, Chat- und Backlog-Bestand). Gemessen: Key-Parität 10/10 bis auf **21
  fehlende Keys in 8 Sprachen** (`common` 7 × `errors.*`, `epigenetics` 9 × `befund.*`, `services`
  5 × `seo.title`); **196 englische Volltextsätze je Nicht-`de`/`en`-Sprache in `epigenetics.json`**
  und 94 in `articles.json` für `fr`/`pt`/`da`/`nl`; Consumer 3 Familien × **1** Sprache, 2 884 Zeilen
  mit **0 × `useTranslation`**; Musterbefund-Inhalte nur `de`/`en`. CTA-Audit: **15 ×** „Beratung
  buchen" in 6 `de`-Namespaces gegen **7 ×** „Angebot anfragen" in 3, dazu 10 hartkodierte
  `t()`-Defaults und 3 CTA-Buttons ohne `t()`; zusätzlich **CTA-Rollenbruch in 8 Sprachen** bei
  `products.hero.cta_order`/`cta_bottom.button` (`QUOTE_REQUEST` → `ORDER`) und ein **Sales-CTA auf
  der Support-Seite**. Assets: 32 Download-Dateien, **29/29 Locale-Referenzen auflösbar, 0 verwaist**,
  aber stiller EN-Fallback in 8 Sprachen **und** stiller DE-Fallback der 6 Musterbefund-PDFs in allen
  10 Sprachen; Consumer ohne produktspezifische OG-Bilder; 3 doppelte PDFs unter
  `src/assets/downloads/`. 14 sensible/regulatorische Aussagen `S-01`–`S-14` registriert — davon
  **fünf Pflichthinweise der Epigenetik-Säule nur in `de`/`en` verfügbar**. Chat-Copy, Chat-Mock und
  Case-Study-Bestand als `LEGACY_REMOVE`/`BACKLOG_NOT_LAUNCH` markiert, nicht entfernt und nicht
  reaktiviert. 19 AP04-eigene Launch-Blocker `LB-1`–`LB-19` plus Übergabe-Blocker anderer Owner
  benannt. **Keine Datei außerhalb von `building-docs/` geändert; keine Übersetzung, kein Asset, keine
  Copy-Korrektur, keine Content-Governance, keine spätere AP-Implementierung.**

- PT04.2 — Content-Typen standardisiert, rein dokumentarisch in `building-docs/CONTENT-MATRIX.md`
  §18–§21: zehn verbindliche Content-Typen **`CT-01`–`CT-10`** (Hero · Benefit/Proof · Feature ·
  Prozess · FAQ · CTA · Download/Resource · Disclaimer/Regulatory · Lead-Magnet-Gate ·
  Form/Success/Error) mit Pflichtslots, Schichtzuordnung nach `CA-01` und Ist-Abgleich je Typ; acht
  übergreifende Regeln `CT-R1`–`CT-R8`. **CTA-Taxonomie §20**: die acht geforderten CTA-Content-Typen
  sind ausdrücklich eine **Gruppierung der zwölf IA-Rollen** aus `IA-INVENTORY.md` §8.3 — kein zweites
  Vokabular; Regeln `CTA-01`–`CTA-10` mit `GENERAL_SALES` = „Angebot anfragen", getrenntem
  Consumer-`ORDER`, getrennter `EPIGENETICS_INQUIRY`, `SUPPORT` ohne Sales-CTA und Artikeln ohne
  Einheits-CTA; §20.3 enthält die **verbindliche Sollzuordnung für alle 27 bestehenden CTA-Keys** als
  Auftrag an PT04.3. **`PUBLIC`/`GATED` getrennt modelliert** (`CT-07`, 5 × PUBLIC, 1 × GATED geplant)
  **ohne Gate-Implementierung**. **Regulatory als eigener Typ** `CT-08` mit acht registrierten
  Pflichthinweisen `RN-01`–`RN-08`; `RN-05` (`vitd3spray.disclaimer`, 10/10 übersetzt) ist der
  Referenzfall, `RN-01`–`RN-04`, `RN-07`, `RN-08` sind offen. Success-Semantik über `CT-10-K1` an
  `DEC-RL-009`/`LD-01` gebunden (persistente Annahme statt „Mail gesendet"). §21 führt je Content-Einheit
  Content-Typ, Standardisierungsstatus, CTA-Typ, Public/Gated, Sensitive-Flag, verbleibende Lücke und
  Owner-AP: `STANDARDIZED` 7 · `MODEL_OK_CONTENT_GAP` 13 · `NOT_STANDARDIZED` 9 · `MISSING` 1 ·
  außerhalb der Taxonomie 3. §21.1 begründet die **bewusst unterlassenen** Schema-Mutationen mit dem
  jeweiligen Owner-AP (AP19, AP13/AP14, AP17, AP16, AP11, AP08). Verifikation: 163 JSON-Dateien
  geparst, **0 Fehler, 0 Duplicate Keys**; `git diff` ausschließlich `building-docs/`.
  **0 Änderungen an `src/**`, `public/**`, `server\*/**` und jeder Konfiguration; kein Design-System,
  kein Routing, kein SEO, kein Lead-Backend, kein Gate, kein CTA-Wortlaut geändert.\*\*

- PT04.3 — Launch-Content-Readiness **nicht abgeschlossen: `BLOCKED_CONTENT_APPROVAL`**. Der
  freigabefreie Teil wurde vollständig umgesetzt und verifiziert (`CONTENT-MATRIX.md` §23.1/§23.2):
  **Key-Parität auf 0 Lücken** (172 Keys in 8 Sprachen: `common.errors.*`, `epigenetics.befund.*`
  inkl. slawischer Pluralformen, `services.*.seo.title`) · **Chat-Copy `common.chat.*` in allen 10
  Sprachen entfernt** (`DEC-RL-007`; die Keys hatten **keinen** Konsumenten im Quelltext — Widget, CSP
  und `/api/chat` bleiben AP06/AP22/AP23/AP26) · **Garantie-Zusage entfernt** aus `home.hero` ×10 und
  der wörtlich gesperrte Begriff „garantierte Performance" aus `services.json` ×10 (`DEC-RL-012`) ·
  **Success-Semantik** von „gesendet" auf „erhalten und registriert" umgestellt (`DEC-RL-009`, `LD-01`,
  `R04-12`) · **GENERAL_SALES normalisiert**: 13 Locale-Keys × 10 Sprachen auf die lokalisierte
  Entsprechung von „Angebot anfragen" plus 17 hartkodierte Quelltext-Vorkommen in 11 Dateien
  (`DEC-RL-013`, `IAD-12` geschlossen) · **CTA-Rollenbruch behoben** (`products.hero.cta_order`,
  `cta_bottom.button` trugen in 8 Sprachen einen Bestell-CTA) · **Support-CTA** zurück auf
  `SUPPORT_REQUEST` · **Artikel-Einheits-CTA** auf `CONTENT_NEXT_STEP` (`IAD-13`) ·
  **Epigenetik-Inquiry-CTA ×10 lokalisiert** · **contact.json ×8 übersetzt** (80 Werte,
  `_translationStatus` entfernt) · **korrupte tschechische Copy repariert** („dnyodinového") ·
  **`CV < 2 %` in 184 Vorkommen einheitlich** (`DEC-RL-008`, keine `< 5 %`-Regression). Verifikation:
  JSON 151/151 ohne Duplicate Keys, Key-Parität 0, `tsc -b` grün, Unit-Tests 13/13 (5 jsdom-Fehler
  **auf `cd2524e` reproduziert = vorbestehend**), Production Build grün, SSR-Smoke 12 Routen × 10
  Sprachen 200 + echte 404, im SSR-HTML **0** alte CTA-Copy, **0** Garantie-Copy, **0** Chat-Copy,
  **0** Roh-Keys. **Offen und blockierend:** `B-1` Epigenetik-Webcontent (222 Werte × 8 Sprachen,
  ~240 000 Zeichen, enthält die Pflichthinweise `RN-01`–`RN-04`; die Eigentümer haben die Zurückstellung
  selbst über `_translationStatus` dokumentiert) · `B-2` Musterbefund-Inhalte (6 × 8 Dateien; zusätzlich
  strukturell durch `BefundSprachen{de,en}` = **AP16** gesperrt) · `B-3` Consumer ×10 (2 884 Zeilen,
  0 × `useTranslation`; `I18N-CONTRACT.md` **M-03** verlangt zuerst **AP08 PT08.2**, und `NAMESPACES`
  ist **M-01**-Einzeleigentum von AP08) · `B-4` Systemmail ×10 (kein Endpunkt empfängt `language`;
  dessen Einführung ist **AP22**) · `B-5` Artikel-Volltexte in `fr`/`pt`/`da`/`nl` (388 Werte) ·
  `B-6` Consumer-Pflichthinweis `RN-08`. **Keine medizinische oder regulatorische Aussage erzeugt,
  übersetzt oder umformuliert; kein Asset, keine Route, kein Design, kein Lead-Backend berührt.**

- **AP04-RECOVERY (2026-08-25) — reiner Dokument-/Vertrags-Recovery-Lauf, `PASS`.** Ursache des
  PT04.3-Deadlocks behoben: `AP04.md` führte den Scope von **AP08** (`PT08.2.3–.7` Consumer
  `t()`-fähig, `PT08.3.1/.2` Epigenetik und Befunde × 10, `PT08.5` Systemtexte × 10, `PT08.6`
  sprachabhängige Assets) sowie **AP16 PT16.1.6** und **AP22** als eigene Closure-Voraussetzung. Da
  diese APs in Welle 1/3/4 und damit **nach** AP04 (Welle 0) liegen, war die Kette zyklisch — AP05 und
  AP06 waren mitblockiert. Eingeführt: **Gate-Modell** `AP04.md` §11.0 mit vier Gate-Typen und
  `GM-01`–`GM-07`; **Deferred-Gate-Register** §11.1 und kanonisch `CONTENT-MATRIX.md` §24 mit
  **`DG-01`–`DG-07`** (je ID, Typ, Lücke, Owner-AP, Required-before, sicheres Ist-Verhalten, Evidenz);
  **Invarianten-Trennung** TARGET / AP04-OWN für `CNT-02`, `CNT-03`, `CNT-04`, `CNT-14`, `CNT-17` plus
  neue `CNT-26`–`CNT-28`; **DoD** §16 in AP04-eigene Bedingungen, Deferred-Gate-Bedingungen und eine
  ausdrückliche Bedeutungsklärung getrennt; **Closure-Matrix** `C04-13`/`C04-14`/`C04-15`/`C04-16`/`C04-21`
  von „Zielzustand erreicht" auf „AP04-Anteil erledigt **und** Rest sauber deferred" überführt, neu
  `C04-29`–`C04-32`; **Risiken** `R04-13`/`R04-14` ergänzt. In `ap04-prompts.md`: PT04.3 erhält die
  Klassentrennung A/B/C (§3.1) mit Klassifikationsregel, korrigierte PASS-Kriterien und ein erweitertes
  Reportformat; PT04.4 erhält `DEFERRED_ASSET_GATE` (§19.1); der Closure-Prompt erhält korrigierte
  Gates, `C04-29`–`C04-32`, korrigierte FAIL-Bedingungen und die Klarstellung, dass AP04 Closure `PASS`
  **keine** x10-Launch-Readiness behauptet. **`MASTER-SCOPE.md` unverändert** — §6, §7 und §8 stützen die
  Korrektur ausdrücklich. **Kein Quellcode, keine Locale-Datei, kein Asset berührt; kein Commit; keine
  bestehende PT04.3-Arbeit verworfen; kein PT-Ergebnis vorweggenommen.**

- PT04.3 — Launch-Content-Readiness **abgeschlossen: `PASS`** (Retry 2026-08-25 unter dem durch
  AP04-RECOVERY korrigierten Gate-Modell; **kein Neustart** — die 104 Dateien aus dem Lauf vom
  2026-08-24 sind unverändert erhalten und wurden neu gegen die Gate-Semantik verifiziert, nicht
  übernommen). **Bestandsverifikation:** JSON 163/163 ohne Duplicate Keys · Key-Parität gegen `de`
  **0 Lücken** · Namespaces 14/15 registriert (`casestudies` dokumentierte Ausnahme) · Chat-Copy in
  Locales **0** · Garantie-Copy **0**, keine Band-Komponente · GENERAL_SALES **einheitlich 10/10 über
  13 Keys**, alter Wortlaut **0 ×** in Locales und Quelltext · spezialisierte CTA-Rollen (`SUPPORT`,
  Artikel-`CONTENT_NEXT_STEP`, `EPIGENETICS_INQUIRY`) in 10/10 getrennt · `CV < 2 %` **184 × einheitlich**,
  0 × `< 5 %` · Placeholder/Mock **0** · Success-Semantik **0** Mail-only-Formulierungen · hartkodierte
  sichtbare Strings außerhalb der AP08-Flächen nur Firmennamen/Adressen. **Im Retry geschlossene
  Klasse-A-Lücken:** (A-1) der erste Lauf hatte 12 Keys im Namespace `epigenetics` in 8 Sprachen
  übersetzt, obwohl dessen `_translationStatus`-Marker **wurzel-skopiert** ist und die vier Konsumenten
  daraufhin `lang="en"` auf den **gesamten** Inhaltscontainer setzen — Verstoß gegen `I-08`/WCAG 3.1.2/`N13`;
  **100 Werte in 8 Sprachen** auf den englischen Namespace-Wert zurückgeführt, Keys bleiben vorhanden,
  `I-06` bleibt behoben, Marker-Umhängung auf Teilbäume bewusst **nicht** vorgezogen (AP08 PT08.1.5/.6).
  (A-2) `compare.cta`/`basics.cta` verlinken deutsche PDFs ohne Sprachhinweis in 8 Sprachen — **16 Werte**
  auf die Fassung mit „(German)" angeglichen (`CA-28`). **Gates:** `tsc -b` grün · Build grün · SSR-Smoke
  13 Routen × 10 Sprachen 200 + echte 404 · `/pl/epigenetics` liefert 1 `lang="en"`-Container, FallbackNotice
  und **0** lokalisierte Rest-Strings darin · Musterbefund **0** Roh-Keys · Unit-Tests 13/13, die 5
  jsdom-`ERR_REQUIRE_ESM`-Fehler erneut **auf `cd2524e` reproduziert** (vorbestehend, Owner AP27).
  **Deferred: 8 Gates `DG-01`–`DG-07`, 0 AP04-Closure-Blocker, 7 Launch-Blocker weitergetragen,
  0 False-Ready, 0 unklassifiziert. Keine spätere Owner-Arbeit vorgezogen, `NAMESPACES` unverändert,
  keine medizinische oder regulatorische Aussage erzeugt.**

- PT04.4 — Asset-Readiness **abgeschlossen: `PASS`** (2026-08-25). **Inventar:** 32 Downloads,
  3 OG-Bilder (je 1200 × 630), 51 gebündelte Bilder, 21 `<img>`-Elemente; geprüfte Referenzquellen:
  29 PDF/ZIP-Referenzen aus 150 Locale-Dateien, 3 Katalogeinträge, 3 `public/`-Pfade, 36 Bundler-Importe.
  **Broken references: 0 vorher, 0 nachher**; Download-Smoke gegen laufendes SSR: **16/16 gerenderte
  `href` liefern HTTP 200** mit realer Content-Length. **Zwei AP04-eigene Fixes:** (1) **`CD-7`
  aufgelöst** — der Befund war schwerer als dokumentiert: die drei PDFs unter `src/assets/downloads/`
  waren byte-identisch mit `public/downloads/`, aber **nicht verwaist**, sondern von fünf
  Produktionskomponenten importiert und unter einer zweiten bundle-gehashten URL ausgeliefert
  (Verstoß gegen `CA-19`/`CA-22`). Die vier Komponenten referenzieren jetzt die kanonische Katalog-URL
  `/downloads/<file>`; danach war das Verzeichnis nachweislich unreferenziert (0 Code-Treffer) und wurde
  entfernt — **3 bundle-gehashte PDF-Duplikate weniger im Artefakt, ~2,4 MB**; `LB-18`/`OR-8` geschlossen.
  (2) **`CA-28` Sprachtransparenz** — `/igloo-pro` lieferte das laut Katalog **deutsche**
  `igloo-pro-flyer.pdf` in **allen 10** Locales ohne Hinweis, `/vitamin-d3-spray` das **englische** PDF
  in 8 Locales ohne Hinweis; **43 CTA-Labels** tragen jetzt „(PDF, DE)" bzw. „(EN)" nach der Konvention
  des kanonischen Katalogs. **Verifiziert ohne Nacharbeit:** Musterbefund-PDFs sind über
  `samples.badge` = „PDF in German" in `en` und allen 8 Fallback-Locales korrekt offengelegt — die
  PT04.3-Aussage trifft zu. **Alt-Texte:** 0 fehlend; die 9 Literale sind kein Defekt (2 auf deklariert
  einsprachigen `de`-Seiten, 4 auf der AP08-eigenen Consumer-Fläche, 1 Produktname sprachneutral,
  2 in Komponenten mit **0 Render-Stellen**). **Orphans klassifiziert, nicht gelöscht:** 5 ungenutzte
  Bildvarianten und 6 PNG-Quellmaster (6,9 MB, werden **nicht** ausgeliefert — `articleImages.ts`
  importiert nur die `.webp`-Ableitungen; Owner AP25). **Public/Gated:** 0 Gating-Mechanismus im Repo,
  alle Ressourcen faktisch `PUBLIC` und auch so beworben — keine falsche Schutzzusage; Zugangsklasse und
  leere `tech`-Kategorie bleiben **AP19**. **Neue Deferred Asset Gates:** `DG-08` (Consumer-OG-Bilder,
  AP21 PT21.6.5 mit AP09) und `DG-09` (ROI-Report-PDF nur deutsch, AP22 mit AP08 PT08.5.3).
  **Gates:** JSON 163/163 ohne Duplicate Keys · Key-Parität 0 · Typecheck grün · Build grün ·
  SSR-Smoke 13/13 Routen 200 + echte 404 · Unit-Tests 13/13 (5 jsdom-Fehler vorbestehend, auf `cd2524e`
  reproduziert, Owner AP27). **0 unsichere Löschungen, 0 Backlog-Assets aktiviert, 0 False-Ready,
  keine spätere Owner-Arbeit vorgezogen.**

- AP04-CLOSURE — Closure Gate **`PASS`**: `C04-01` bis `C04-32` eigenständig und empirisch gegen den
  aktuellen Repository-State geprüft, keine früheren Reports übernommen. **Vorgänger:** AP00–AP03
  `COMPLETE`/Closure `PASS` unverändert; AP04-RECOVERY `PASS`; PT04.1–PT04.4 alle `PASS`.
  **Content:** genau **eine** kanonische Content-Matrix (1 862 Zeilen, 26 Abschnitte), 33 Content-Einheiten,
  10 Content-Typen `CT-01`–`CT-10`, 10 CTA-Regeln, 14 Sensitive-Claims `S-01`–`S-14`,
  8 Pflichthinweise `RN-01`–`RN-08`. **Gemessen:** Placeholder/Mock **0**, TODO/FIXME in `src` **0**,
  Chat-Copy in Locales **0**, Garantie-Band-Äquivalent **0** und **keine** Band-Komponente, alter
  GENERAL_SALES-Wortlaut **0**, `CV < 2 %` durchgehend **eine** Schreibweise, `< 5 %`-Regression **0**,
  Key-Parität **0** fehlende Keys, GENERAL_SALES einheitlich **10/10** über 13 Keys, `SUPPORT` und
  Artikel-CTA **0×** mit GENERAL_SALES vermischt, Mail-only-Success-Copy **0**, JSON **163/163** ohne
  Duplicate Keys, Namespaces 14/15 (`casestudies` dokumentierte Ausnahme `ID-5`). **Assets:**
  Referenzen geprüft (29 Locale + 3 Katalog + 6 `public`-Pfade + 33 Importe) → **0 broken references**;
  `src/assets/downloads/` existiert nicht mehr, **0** Code-Referenzen darauf, **0** Hash-Duplikate über
  die Asset-Bäume, `public/downloads` **32/32** Dateien unverändert, 6/6 PNG-Quellmaster erhalten,
  `<img>` ohne `alt` **0/21**, Sprachkennzeichnung **27/27** (`/igloo-pro`), **16/16**
  (`/vitamin-d3-spray`), **9/9** Locales (Epigenetik). **Deferred-Register: 10/10 Gates** `DG-01`–`DG-09`
  vollständig, ownergebunden, mit Required-before und Safe-current-behavior, **0 Closure-Blocker**,
  **0 False-Ready**, **9 Launch-Blocker weitergetragen**. **Quality:** Typecheck grün · Build grün ·
  SSR-Smoke **50/50** Routen (10 Sprachen × 5 Seiten) 200 plus 5 Sonderrouten 200 und **2× echte 404** ·
  Download-Smoke **26/26** HTTP 200 · gerenderte Content-Gates in allen 10 Sprachen sauber (0 alte CTA,
  0 Garantie, 0 Chat, 0 Roh-Keys). **Lint 129 Findings — Datei für Datei identisch zur Baseline
  `cd2524e`, 111 davon im archivierten `_project-knowledge/`; 0 durch AP04 verursacht.**
  **Tests 13/13 bestanden**, 5 jsdom-`ERR_REQUIRE_ESM`-Fehler auf `cd2524e` reproduziert →
  vorbestehende Baseline-Lücke, Owner **AP27**. **Scope:** kein Vorgriff auf AP05–AP26 — `src/i18n.ts`,
  `server.ts`, `server/**`, `src/App.tsx`, `src/routing/**`, `useSearch.ts`, `SEOHead.tsx`, Layout-,
  Build- und CI-Dateien unberührt; Decision-Lock-Dokumente unberührt; **0 Commits**. Closure-eigene
  Korrektur: **1** Feldbenennung im Deferred-Register vereinheitlicht (`Current safe behavior` →
  `Safe current behavior` in `DG-08`/`DG-09`). Decision Locks **18/18**.

- PT05.1 — Sales-Machine-Token-/Light-Theme-Basis konsolidiert und kanonisch verankert.
  **Inventar:** Farb-, Alias-, Neutral-, Status-/Befund-, Spacing-, Radius-, Shadow- und
  Motion-Tokens klassifiziert (CANONICAL/SEMANTIC/LEGACY_ALIAS/DUPLICATE/DEPRECATED).
  **Light Theme empirisch bestätigt:** 0 `dark:`-Klassen, kein `darkMode`, kein
  `prefers-color-scheme`, kein Theme-Switcher, keine parallele Dark-Tokenfamilie — keine
  Archon-/Dark-Art-Direction vorhanden oder übernommen. **Legacy-Aliase klassifiziert, nicht
  migriert** (`brand.deep` 149 · `brand.primary` 119 · `brand.secondary` 12 Call-Sites bleiben;
  `accentBlue`, `brand.navy-mid`, `brand.blue-bright`, `ui.border-hover` haben 0 Call-Sites und
  sind als DEPRECATED/DUPLICATE markiert, aber bewusst nicht entfernt).
  **Motion-Token-Grundlage** neu: `transitionDuration` (hover/menu/popover/modal/modal-card/reveal)
  und `transitionTimingFunction` (entrance/emphasis/back-out/exit/reveal) benennen ausschließlich
  bereits laufende Werte; Keyframe-/Animation-Strings referenzieren sie jetzt, Ergebniswerte
  **byte-identisch** verifiziert. Ergänzt: `spacing.section`/`section-lg` (== py-24/py-28) und
  `boxShadow.dialog` als einzige Quelle des Modal-Ruheschattens (vom `modal-card-in`-Keyframe
  referenziert). **Kontrastkorrektur (WCAG 1.4.11/1.4.3):** die letzten Bedienelement-Begrenzungen
  auf `ui.border` (1,23:1) bzw. Placeholder-/Hilfstext auf `ui.text-muted` (2,56:1) sind auf
  `ui.field` (4,83:1) umgestellt — `Textarea.tsx` sowie `SupportForm.tsx` (Pflicht-`<select>`,
  Upload-Button); `Input.tsx` folgte bereits. `ui.border`/`ui.border-hover`/`ui.text-muted` haben
  danach 0 Call-Sites und bleiben reine Dekor-Tokens. **Guard:** bestehender
  `scripts/check-color-tokens.mjs` unverändert erhalten, pre-commit weiter wirksam und **zusätzlich
  explizit in CI verankert** (`.github/workflows/ci.yml`, Step „Color/token guard"); keine zweite
  Color-Lint-Implementierung. **Contract:** `building-docs/DESIGN-SYSTEM-CONTRACT.md` neu angelegt
  (kein kanonisches Design-Artefakt existierte) und in `CONTEXT-INDEX.md`/`README.md` registriert;
  `docs/design-system.md` als **nicht kanonisch** gebannert samt Liste seiner nachweislich veralteten
  Werte → **keine zweite Token-Wahrheit**. **Verifikation:** Farb-Guard grün · Typecheck grün · Build
  grün · Prettier auf allen berührten Dateien grün (repo-weite Vorlast 40 Dateien unverändert) ·
  **Lint 129 Findings identisch zur Baseline, 0 neue** · **Tests 13/13, 5 jsdom-`ERR_REQUIRE_ESM`
  reproduziert (vorbestehend, Owner AP27)** · CI-YAML geparst, 11 Steps, Guard-Step vorhanden.
  **Emittiertes CSS gegen den Baseline-Build diffed: einzige Änderung ist der Wegfall der drei
  `ui-text-muted`-Regeln; 0 Regeln hinzugefügt** → Token-Layer nachweislich visuell neutral.
  **Kein Vorgriff** auf PT05.2–PT05.5 oder AP06; **0 Commits**. Decision Locks **18/18**.

- PT05.2 — Typografie der Sales-Machine als kanonisches Rollensystem verankert.
  **Font-Pipeline:** Inter bleibt selbstgehostet (`@fontsource-variable/inter`, genau ein
  Side-Effect-Import in `entry-client.tsx`); Kette `Inter Variable → Inter → Inter Fallback →
system-ui → sans-serif` vollstaendig, `font-display: swap` (7 Faces), SSR-Preload-Tag zeigt auf
  den tatsaechlich gebauten gehashten Latin-Subset. **Fallback-Metriken empirisch validiert:**
  H1- und Absatzhoehe mit und ohne Webfont **identisch (0 px)**; Restdelta der Gesamtseitenhoehe
  143 px von 8.907 px unterhalb des Viewports. **Externe Font-Abhaengigkeit beseitigt:**
  `scripts/og-image-template.html` bezog Inter von `fonts.googleapis.com` und laedt es jetzt lokal
  — gemessen **0 externe Requests** beim Rendern der Share-Karte. Verbleibend und
  **nicht** AP05: `server.ts` erlaubt `fonts.googleapis.com`/`fonts.gstatic.com` weiterhin in der
  CSP — Erlaubnis ohne Verwender, in `NETWORK-ALLOWLIST.md` als `ND-5`/`STALE_REMOVE` registriert,
  Owner **AP26**. **Rollensystem** in `src/index.css` (`@layer components`, Praefix `.t-*`):
  `.t-h1`, `.t-h2`, `.t-h2-section`, `.t-h2-sub`, `.t-h3`–`.t-h6`, `.t-lead`, `.t-body`, `.t-small`,
  `.t-lead-on-dark`, `.t-body-on-dark`, `.t-caption`, `.t-label`, `.t-helper`, `.t-error`, `.t-link`,
  `.t-link-cta`. Jeder Wert ist aus dem Bestand **gemessen**; die Ueberschriftsebene folgt der
  Dokumentstruktur, die Klasse waehlt nur die visuelle Rolle (`.t-h2-sub`/`.t-h2-section`).
  **52 Aufrufstellen konsolidiert** — 29 Ueberschriften, 23 Textstellen — jeweils
  **tokengleich**, plus `SectionHeader`, `Input` und `Textarea` auf die Rollen umgestellt.
  **Drei bewusste, dokumentierte Aenderungen (alle WCAG-Korrekturen):** Longform-Ink
  `.rich-content` `gray-500` → `gray-700` (3,38:1 → 10,3:1; betraf den gesamten Fliesstext der
  Service-Detailseiten), Prosa-Links im Ruhezustand unterstrichen statt nur bei Hover
  (WCAG 1.4.1 — vorher allein Farbe), Fehlertext `Textarea` `red-500` → `red-600`
  (3,76:1 → 4,83:1; `Input` war bereits korrekt). **Longform** live nachgemessen: Body
  `#374151`, Lesebreite 610 px (61ch), Link unterstrichen + Gewicht 600. **Responsive/x10:**
  10 Sprachen × 4 Seiten × 3 Viewports = **120 Kombinationen, 0 horizontaler Ueberlauf**,
  H1 mobil 30–36 px, 1–5 Zeilen, kein H1-Eigenueberlauf — **keine** sprachabhaengige
  font-size-Ausnahme noetig oder eingefuehrt. **Verifikation:** Typecheck gruen · Build gruen ·
  Farb-Guard gruen · Prettier auf allen beruehrten Dateien gruen · **Lint 129 Findings identisch
  zur Baseline, 0 neue** · **Tests 13/13**, 5 jsdom-`ERR_REQUIRE_ESM` vorbestehend (Owner AP27) ·
  **SSR-Smoke 60/60 HTTP 200** (10 Sprachen × 6 Routen) plus echte 404 und echter 301.
  CSS-Delta gegen den PT05.1-Build geprueft: nur die neuen Rollenklassen (regelweise als
  deckungsgleich nachgewiesen), der Wegfall dadurch ungenutzter Utilities und genau die drei
  genannten Korrekturen. **Kein Vorgriff** auf PT05.3–PT05.5 oder AP06; `server.ts`, `App.tsx`,
  `SEOHead.tsx`, i18n und Routing unberuehrt; **0 Commits**. Decision Locks **18/18**.

- PT05.3 — Core-UI-Komponenten konsolidiert und verhaltensgetestet.
  **Neu:** `Card.tsx` (interaktiv vs. statisch), `FormField.tsx` (Label/Control/Hilfstext/
  Fehler/Pflicht mit vollstaendiger ARIA-Verdrahtung, Feld **und** Gruppe), `Choice.tsx`
  (`Checkbox`/`Radio`/`Select`), `Dialog.tsx` (Modal **und** Drawer auf einer Mechanik),
  `StateBlock.tsx` (`LoadingState`/`EmptyState`/`ErrorState`/`Skeleton`).
  **Erweitert:** `Button.tsx` um `ghost`, `loading` (`aria-busy`, Beschriftung bleibt),
  externe-Link-Semantik (`target`/`rel` nur bei echten externen Zielen), echte
  Deaktivierung fuer Link-Buttons (`aria-disabled` + `tabIndex=-1` + Klicksperre) und
  Touch-Targets ≥ 44px (`icon` 40→44px, 0 Bestands-Call-Sites betroffen);
  `Alert.tsx` um `info`/`warning`/`error` mit **je eigenem Icon** (Bestandsvarianten
  `default`/`destructive` erhalten); `LoadingSpinner` prop-durchlaessig und
  bewegungsreduktions-fest. **Neues Token:** `warning` (`#f59e0b`/`#fffbeb`/`#b45309`) in
  `tailwind.config.js` **und** `PALETTE_HEX` im selben Schritt — bewusst NICHT die
  Befund-Ampel, deren Amber fachliche Befundsemantik traegt. Textrolle `warning.strong`
  4,84:1 auf `warning.soft`.
  **Zwei echte Defekte im neuen Dialog per Test gefunden und behoben:** der Fokus wanderte
  wegen des `mounted`-Gates nie in den Dialog (Effekt lief auf einem noch nicht
  existierenden Panel), und die Fokusfalle filterte ueber `offsetParent` — in jeder
  layoutlosen Umgebung `null`, wodurch die Falle auf ein einziges Element zusammenfiel.
  **Tests:** 11 Dateien / **80 Tests gruen** (Button 9 · FormField+Choice 13 · Dialog 14 ·
  Card 6 · Alert+States 12 · Input/Textarea 11 · Bestand 15). Geprueft wird Verhalten —
  Rolle, zugaenglicher Name, Fokusfuehrung, Escape, Scroll-Lock, Fokusrueckgabe,
  ARIA-Verdrahtung — **nicht** Tailwind-Klassen.
  **Live gemessen:** Fokusring bei **14/14** per Tastatur angesteuerten Elementen sichtbar;
  Touch-Target-Klassen im Build bestaetigt (`h-11` = 2,75rem = 44px, `min-h-[44px]`).
  **Keine breite Seitenmigration:** das emittierte CSS ist gegenueber PT05.2 rein additiv
  (**0 Regeln entfernt**, 34 hinzugefuegt) — kein Bestandsrendering veraendert; 0
  Call-Sites migriert. **Verifikation:** Typecheck gruen · Build gruen · Farb-Guard gruen ·
  Prettier gruen · **Lint 128 Findings (124 errors) — 1 unter der 129er-Baseline**, weil
  der `ref as any`-Cast im Button entfallen ist; 0 neue Findings.
  **Weitergetragen (nicht PT05.3):** ausserhalb der Core-Komponenten liegen Bedienelemente
  unter 44px — Karussell-Punkte (10px), kleine Icon-Schalter (16px), Sektions-Pfeil-Links
  (20px hoch). Owner: **PT05.4** (Sektionsmuster) bzw. **AP24** (Abnahme);
  siehe `DESIGN-SYSTEM-CONTRACT.md` §5.7. **Kein Vorgriff** auf PT05.4/PT05.5 oder AP06;
  `server.ts`, Routing, i18n, Header/Footer unberuehrt; **0 Commits**. Decision Locks **18/18**.

- PT05.4 — Layout- und Sektionsmuster der Sales-Machine katalogisiert und konsolidiert.
  **Neu:** `src/components/layout/Section.tsx` mit `Section` (Flaeche, full-bleed),
  `Container` (Inhalt, `max-w-container` 1200px, `px-4 lg:px-0`) und `CardGrid`
  (2/3/4 Spalten, mobil immer einspaltig). Der vertikale Rhythmus ist auf die drei im
  Bestand **gemessenen** Stufen festgeschrieben: `py-16 lg:py-24` (12x), `py-24` (7x),
  `py-12 lg:py-16` (3x) — eine vierte kommt nicht dazu. Kernregel: Hintergrund gehoert an
  die `Section`, Breitenbegrenzung an den `Container`.
  **Sektionskatalog** (`DESIGN-SYSTEM-CONTRACT.md` §6.9): 17 bevorzugte Muster mit Zweck,
  Komponente, geeigneten Seitentypen, Responsive-Verhalten und A11y-Notiz plus Do/Don't —
  Grundlage fuer AP11–AP21. Ergaenzt: Hero-/Split-Muster (§6.3), Content+Sidebar ueber das
  bestehende `PageSidebar` (§6.4), **ChapterNav-Layoutvertrag dokumentiert statt neu
  erfunden** (§6.5: `top-[68px] lg:top-[88px]`, `--chapterbar-offset`, `--nav-progress`,
  `scroll-mt-28`, Cleanup beim Unmount), Longform-Verweis auf §4.5, Final-CTA-Muster (§6.7).
  **Kartenrezepte:** 18 Aufrufstellen von `rounded-xl border border-slate-200 bg-white p-7`
  gefunden; die **3 interaktiven** (`DiagnosticsFocusSection`, `ArticlesIndexPage`,
  `SupportPage`) auf `Card` umgestellt und dadurch mit dem Fokusring des Design-Systems
  statt des UA-Standardrings versehen. Die 15 statischen bleiben bewusst unveraendert —
  eine reine Namensmigration ueber 12 Seitendateien waere die von AP05 §13.2
  ausgeschlossene Seitenmigrationswelle. Das 4er-Rezept mit `gray-200`/`rounded-lg`/`p-4`
  (8x) ist bewusst **nicht** konsolidiert: andere Rolle.
  **Korrektur an der eigenen Komponente:** `Card` trug `hover:shadow-card`; im Bestand
  kommt der reine Lift **16x** vor, die Schatten-Variante nur **2x**. `Card` folgt jetzt
  der gemessenen Mehrheit — die Adoption ist damit visuell neutral bis auf den Fokusring.
  **Touch Targets in Sektionen** (Uebergabe aus PT05.3): Pause/Play der Karussells
  16×16 → **44×44**; Slider-Punkte 10×10 → **24px hoch** (transparenter Knopf, sichtbarer
  Punkt als innerer `<span>`, Optik unveraendert). **Bewusst offen:** die Punkt*breite*
  bleibt 10px — 24px breite Ziele sind bei Rasterweite 20–22px geometrisch unvereinbar,
  ohne die Punkte auseinanderzuziehen, und das waere eine Art-Direction-Entscheidung.
  Owner **AP24** plus Produktentscheidung (§6.8).
  **Geprueft:** **0 Treffer** fuer ein „garantierte Performance"-Band in Code und Locales
  (`DEC-RL-012` gehalten); keine alternative Art Direction; Light Theme unveraendert.
  **Bestaetigt und weitergetragen:** der HiHuman-Chat-Loader laedt weiterhin unbedingt zur
  Laufzeit (gemessen: 2 Requests an `widget.hihuman.co.uk` bzw. `reception.hihuman.co.uk`
  auf `/de/`) — bereits registriert als `CONSENT-CONTRACT.md` `CD-3` / Gate `G-10`,
  Owner **AP06 PT06.4**. PT05.4 fasst ihn nicht an.
  **Verifikation:** Typecheck gruen · Build gruen · Farb-Guard gruen · Prettier gruen ·
  Lint ohne neue Findings · **Tests 91/91 gruen** (12 Dateien; +11 fuer die
  Layout-Primitive) · **Responsive Smoke 150 Kombinationen** (10 Sprachen × 5 Seiten ×
  3 Viewports): **0 horizontaler Ueberlauf, 0 non-200**.
  **Kein Vorgriff** auf PT05.5 oder AP06; Header/Footer, Routing, i18n und `server.ts`
  unberuehrt; **0 Commits**. Decision Locks **18/18**.

- PT05.5 — Motion, Visual Regression und Error States abgeschlossen; letzter Primaertask von AP05.
  **Reduced Motion** auf drei Ebenen nachgewiesen (globales Netz in `src/index.css`,
  `motion-reduce:`-Klassen, JS-Guards in `Reveal`/`PageTransition`): unter Emulation hat auf
  `/de/` **kein Element** eine Dauer > 1 ms — und die Funktion bleibt vollstaendig
  (Inhalte sichtbar, Karussell bedienbar). **Transitions** auf die PT05.1-Token-Namen
  festgeschrieben: nichts ueber 520 ms, einziger Stagger `REVEAL_STAGGER` 60 ms, keine
  Information nur durch Bewegung.
  **Visual Regression:** `scripts/build-visual-gallery.tsx` rendert die **echten** Komponenten
  per `react-dom/server` nach `dist/visual-gallery.html` — bewusst **keine
  `/styleguide`-Produktionsroute** und keine nachgebaute HTML-Attrappe (waere eine zweite
  Wahrheit). Geladen per `file://`. Die Datei liegt **neben** `dist/client/`, weil
  `server.ts` dieses Verzeichnis per `express.static` ausliefert: in einem Zwischenstand lag
  die Galerie darin und war mit HTTP 200 oeffentlich erreichbar — gemessen und korrigiert;
  jetzt endet `/visual-gallery.html` ueber den Server in einer 404.
  **28 Baselines**: 11 Oberflaechen × 2 Viewports plus Hero/Longform/Final-CTA aus echten
  Routen. Determinismus ueber feste Viewports, Reduced Motion, `document.fonts.ready` und
  transparenten Caret; **35/35 Tests zweimal in Folge gruen**.
  **Drei echte Fehler von den eigenen Tests gefunden:** (1) Playwright lief gegen Port 3000,
  auf dem in dieser Umgebung eine **fremde Anwendung** laeuft — die ersten Seiten-Screenshots
  stammten von ihr; behoben durch eigenen Port (`E2E_PORT`, Default 3311) und
  `reuseExistingServer: false`, die falschen Baselines wurden geloescht und neu erzeugt.
  (2) `use: { reducedMotion }` aus der Playwright-Config griff nicht (`matchMedia` meldete
  `false`); jetzt explizit per `page.emulateMedia` plus Zusicherung im Test, damit es nicht
  still zurueckfallen kann. (3) Eine eigene Testzusicherung parste `0.01ms` als 0,01 Sekunden —
  Einheiten werden jetzt normalisiert. Punkt 2 und 3 waren Testfehler, nicht Produktfehler;
  das Reduced-Motion-Netz selbst war die ganze Zeit korrekt.
  **Error States:** `RootErrorBoundary` und `SegmentErrorBoundary` rendern jetzt ueber
  `ErrorState` — **eine** Fehleroberflaeche statt drei Markup-Varianten; Signatur und
  Verhalten unveraendert. **8 neue Tests** sichern: Fallback statt weissem Bildschirm,
  Meldung ans Monitoring **statt** in die UI, **nie ein Stacktrace**, Erholung ueber `reset`,
  Segment degradiert isoliert. E2E belegt die Trennung: unbekannte Route = echte **404 ohne**
  `role="alert"`, Fehlergrenze = `role="alert"` **ohne** 404. Routing-Statussemantik bleibt AP10.
  **Changelog-Gate neu:** `building-docs/DESIGN-SYSTEM-CHANGELOG.md` plus
  `scripts/check-design-system-changelog.mjs` vergleichen die **tatsaechliche** Oberflaeche
  (38 Farb-Token, 19 Typo-Rollen, 24 Komponenten/Konstanten) mit der dokumentierten — bewusst
  kein Diff-Gate gegen einen Basis-Ref. Verankert pre-commit **und** in CI; Negativtest:
  ein undokumentiertes Token liefert Exit 1. CI hat jetzt **14 Steps** inkl. Visual-Regression
  und Artefakt-Upload bei Fehlschlag.
  **Preview-Neutralitaet nachgewiesen:** aus `redesign/preview` stammen ausschliesslich
  Mechaniken (Error Boundary, Monitoring, A11y-/Screenshot-Skripte), in 9 Dateien deklariert;
  **0 Treffer** fuer deren Token-Klassen ausserhalb eines erklaerenden Kommentars, **0**
  `dark:`-Klassen, keine Farbe/Typografie/Art-Direction uebernommen.
  **Verifikation:** Typecheck gruen · Build gruen · Farb-Guard gruen · Changelog-Gate gruen ·
  Prettier gruen · Lint ohne neue Findings · **Unit/Component 99/99 gruen** (13 Dateien) ·
  **Playwright 35/35 gruen** · SSR-Smoke gruen. **0 Commits.** Decision Locks **18/18**.
  **AP05-CLOSURE und AP06 wurden NICHT gestartet.**

- AP05-CLOSURE — Closure Gate `PASS`: `C05-01` bis `C05-32` geprueft, alle in dieser Closure
  **neu gemessen** statt aus den PT-Berichten uebernommen.
  **Vorgaenger** AP00–AP04 unveraendert `COMPLETE`/Closure `PASS`; Decision Locks **18/18**.
  **Art Direction/Theme:** Sales-Machine eindeutig, **0** `dark:`-Klassen, **0** Theme-Switcher/
  `darkMode`/`prefers-color-scheme`, **0** Archon-Token-Klassen ausserhalb erklaerender
  Kommentare. **Kanonizitaet:** genau **eine** `tailwind.config.js`, ein
  `DESIGN-SYSTEM-CONTRACT.md`, `docs/design-system.md` als nicht kanonisch gebannert.
  **Guards:** Farb-Guard und Changelog-Gate je pre-commit **und** in CI, beide gruen.
  **Fonts:** **0** externe Font-Referenzen in ausgeliefertem Code und in Build-Skripten; die
  zwei verbleibenden Nennungen in `server.ts` sind CSP-_Erlaubnisse_ ohne Verwender
  (`NETWORK-ALLOWLIST` `ND-5`, Owner AP26).
  **Substanz vorhanden:** 10 Komponenten-/Layout-Bausteine, 11 Testdateien, Motion-Tokens
  (6 Dauern, 5 Kurven), 19 Typo-Rollen, Spacing/Radius/Shadow-Skalen, 28 Visual-Baselines.
  **Qualitaet:** Typecheck gruen · Build gruen · Farb-Guard gruen · Changelog-Gate gruen ·
  **Unit/Component 99/99** · **Playwright 55/55** · **SSR-Smoke 50/50 HTTP 200** plus echte 404
  und echter 301 · **Responsive 60/60 Kombinationen ohne Ueberlauf** ·
  Lint **128 Findings, unveraendert zur Baseline, 0 durch AP05**.
  **Guarantee Band 0 Treffer** (`DEC-RL-012`), CTA-Lock in allen 10 Sprachen belegt,
  10 Locales unveraendert.
  **Scope:** 94 Dateien im AP05-Delta, **0** davon AP06+-eigen — `Header.tsx`, `Footer.tsx`,
  `App.tsx`, `server.ts`, `src/i18n*`, `SEOHead`, `structuredData`, `lib/tracking` und
  `public/locales/**` **unberuehrt**. **0 Commits.**
  **Closure-eigene Korrekturen (nur Doku):** die Fokus-Messaussage aus PT05.3/PT05.4
  richtiggestellt (siehe `## Current`) und die veraltete AP06-Zeile
  („Vorgaenger AP05 ist nicht gelaufen") nachgezogen. **Keine Fachsubstanz nachgeholt.**

- PT06.1 — Header auf die AP03-IA umgestellt und zehnsprachig verankert.
  **Epigenetik ist jetzt eine eigene Saeule** (`IA-09`, `DEC-RL-005`): vorher erschien sie
  ausschliesslich als Kind des Diagnostik-Menuepunkts in der Gruppe `group_lab` — eine
  eigenstaendige Geschaeftssaeule, die man nur ueber ein fremdes Aufklappmenue erreicht.
  Sie steht als eigener Hauptnavigationspunkt (`/epigenetics`), ist aus dem
  Diagnostik-Menue entfernt (`AP06.md` §6.5) und mobil ebenfalls eigenstaendig.
  **IglooPro sichtbar** (`/igloo-pro`) — vorher fuehrte kein Header-Weg zum Produkt
  (IA §10.3 „Produktstrecke sichtbar, nicht in Diagnostik versteckt").
  IA-konform entfernt: `home` (das Logo ist der Heimweg) und der `terms`-Unterpunkt unter
  About (Legal gehoert in den Footer). Header-Saeulen jetzt: Diagnostik · Epigenetik ·
  IglooPro · Artikel · Events · Ueber uns · Support.
  **GENERAL_SALES-CTA:** `nav.contact` („Kontakt") → `nav.cta_quote` („Angebot anfragen",
  `DEC-RL-013`), Ziel `/contact`, mit `data-cta-role="GENERAL_SALES"` ausgezeichnet. Die
  zehn Formulierungen sind aus der AP04-standardisierten `downloads.json:hero_cta`
  uebernommen, nicht neu erfunden. Support, Consumer-Bestellung und Epigenetik-Anfrage
  bleiben getrennt.
  **Fokusringe — Uebernahme aus der AP05-Closure erledigt:** die Header-Navigationslinks,
  der Such-Trigger, der Burger und der Logo-Link hatten **keinen** sichtbaren
  Fokusindikator (in der AP05-Closure mit 7/16 fehlenden Ringen auf `/de/contact` gemessen
  und als AP06-Item registriert). Jetzt live nachgemessen: **14/14 Tab-Ziele mit sichtbarem
  Ring, 0 ohne.**
  **Untermenue nicht mehr hover-only:** das Diagnostik-Aufklappmenue oeffnete
  ausschliesslich per `group-hover` — mit der Tastatur waren die Unterseiten aus dem Header
  nicht erreichbar. Es hat jetzt einen eigenen Knopf mit `aria-expanded`; Hover
  funktioniert weiter, ist aber nicht mehr der einzige Weg. Mobil ist der Elternpunkt
  zusaetzlich selbst ein Link (vorher nur Aufklapper).
  **x10:** neue `common.json`-Keys `nav.cta_quote`, `nav.iglooPro`, `a11y.select_language`,
  `a11y.main_nav`, `a11y.toggle_submenu` in **allen zehn** Locales. Der Sprachumschalter
  trug ein hartkodiertes englisches `aria-label` — genau das Element, das jemand sucht, der
  die Seitensprache nicht versteht; jetzt lokalisiert.
  **Unveraendert gelassen:** `useSearch.ts` (AP07), Search-Index, SearchModal-Semantik
  (AP07), keine Route Registry gebaut (AP10), `ChatWidget` in `App.tsx` (Entfernung ist
  PT06.4 — der **Header** enthaelt nachweislich keinen Chat-Trigger).
  **Verifikation:** Typecheck gruen · Build gruen · Farb-Guard gruen · DS-Changelog-Gate
  gruen · Lint **128 Findings, unveraendert, 0 neue** · **Tests 121/121** (Header 23 neu) ·
  **Playwright 55/55** · **SSR-Smoke 60/60** (10 Sprachen × 6 Routen) · aktive Zustaende
  live geprueft (`/epigenetics#musterbefunde` → `aria-current="page"`) ·
  `--chapterbar-offset` vor/nach Scroll stabil (151px) · Headerhoehe 88→89px, `fixed` ·
  mobil **0** Bedienelemente unter 44px · **0** `/services*`-Ziele im Header.
  **Visual-Baselines:** die 6 Seiten-Screenshots enthalten den Header und wurden neu
  aufgenommen. Sie waren zuvor trotz geaenderten Headers gruen — die
  `maxDiffPixelRatio: 0.01`-Toleranz aus PT05.5 hat die Aenderung verdeckt; als
  Later-Owner-Item notiert.
  **0 Commits.** Decision Locks **18/18**.

- PT06.2 — Diagnostik-Mega-Menue implementiert; alle neun kanonischen Services erreichbar.
  **Gruppierung fachlich begruendet** (IA §10.4 verlangt eine Begruendung, ueberlaesst die
  Spaltenform AP06). Trennlinie ist die Frage, die ein Interessent stellt:
  **Praxisfelder** (dental · beauty · longevity — "ich bin Zahnarzt/Aesthetik/Longevity"),
  **Analysebereiche** (praeventions-checks · infektion-entzuendung · stoffwechsel-herz ·
  hormon-tests — "ich will Marker X messen"), **System & Integration**
  (poc-systemloesungen · kompatibilitaet-integration — "passt das zu meinem Bestand?").
  3+4+2 = **9/9**, gegen `src/data/services.tsx` geprueft.
  **Die historische POC/Labor-Zweiteilung wurde bewusst NICHT uebernommen:** sie existierte
  nur, um Epigenetik als "Laborteil" der Diagnostik unterzubringen — genau die
  Fehlklassifikation, die IA §10.4 untersagt.
  **Epigenetik-Grenze:** kein `group_lab` mehr, kein `/diagnostics/epigenetics`. Epigenetik
  erscheint ausschliesslich als **abgesetzter Querverweis** unterhalb der Spalten, mit
  eigener Ueberschrift („Auch relevant"), ausserhalb jeder Servicegruppe — IA §10.5 erlaubt
  den Crosslink ausdruecklich. Zusaetzlich zaehlen Crosslinks bewusst **nicht** in
  `isItemActive`: sonst faerbte `/epigenetics` die Diagnostik aktiv und die eigene Saeule
  verloere ihre Kennzeichnung (per Test abgesichert).
  **Hub:** eigener Einstieg „Alle Diagnostik-Leistungen" → `/diagnostics`, im Fussbereich des
  Menues neben dem Querverweis.
  **Tastatur/Fokus live gemessen:** Enter am Trigger oeffnet (9 Services erreichbar),
  **12 Menuelinks per Tab erreicht, 0 ohne Fokusring**, Escape schliesst **und gibt den
  Fokus an den Trigger zurueck**; geschlossene Eintraege sind nicht im DOM und damit nicht
  fokussierbar.
  **Mobil:** dasselbe Gruppenmodell als Akkordeon statt Spalten — 9 eindeutige Service-Links,
  **0 Ziele unter 44px, 0px horizontaler Ueberlauf** bei 360px.
  **Routen live validiert:** 9/9 Service-Routen HTTP 200, `/diagnostics/sports` **404**
  (nicht verlinkt), Hub in 10/10 Sprachen 200, **0** `/services*`-Ziele.
  **x10:** 5 neue Service-Kurzlabels aus den freigegebenen `services.json`-Titeln abgeleitet
  (Teil vor dem Doppelpunkt), nicht neu uebersetzt; dazu 3 Gruppenueberschriften,
  Hub- und Querverweis-Label — alles in **allen zehn** Locales.
  **Nebenwirkung dokumentiert:** `t-h6`, `t-caption` und `t-link-cta` waren bis hierher
  definiert, aber nicht im Build (Tailwind emittiert `@layer components` nur bei
  Verwendung). Das Mega-Menue ist ihre erste Aufrufstelle — dadurch aenderte sich die
  Darstellung der Galerie-Ueberschriften und **alle 22 Oberflaechen-Baselines wurden neu
  aufgenommen**. Erwarteter Adoptionseffekt, kein Regressionsfund; im
  `DESIGN-SYSTEM-CHANGELOG.md` vermerkt.
  **Verifikation:** Typecheck gruen · Build gruen · Farb-Guard gruen · DS-Changelog-Gate
  gruen · Lint **128 Findings, unveraendert, 0 neue** · **Tests 131/131** (Header 33) ·
  **Playwright 55/55, zweimal in Folge** · `useSearch.ts` und Search-Index unberuehrt ·
  keine Route Registry gebaut. **0 Commits.** Decision Locks **18/18**.

- PT06.3 — Footer nach IA §10.7 neu aufgebaut; drei AP03-Findability-Schulden geschlossen.
  **`IAD-16` (Epigenetik + Support fehlten vollstaendig):** Epigenetik hat jetzt eine
  **eigene Spalte** mit Hub, den drei Vertiefungen (`/grundlagen`, `/studienlage`,
  `/unterlagen`) und den Musterbefunden — nicht als Zeile unter Diagnostik. Support steht
  bei den Unternehmenslinks und ist damit nicht mehr hinter Sales versteckt.
  **`IAD-17` (6 von 9 Services):** der Footer fuehrt jetzt **alle neun**. Eine
  unvollstaendige Liste, die wie eine vollstaendige aussieht, ist schlechter als beides;
  IA §10.7 ueberlaesst diese Umfangsentscheidung ausdruecklich AP06.
  **Spalten:** Unternehmen · Diagnostik · Epigenetik · Produkt & Wissen · Standorte, dazu
  Social, Legal und Copyright in der Fussleiste.
  **Consumer bewusst NICHT verlinkt — mit Grund:** IA §10.8 sieht `INDIRECT` vor, aber der
  Server beantwortet `/de/consumer/...` mit **301 auf `/en/consumer/...`** (in PT06.3
  gemessen, alle drei Seiten, alle Nicht-EN-Locales). Ein Footer-Link wuerde
  nicht-englische Nutzer nach Englisch zwingen — genau der von `IAD-01` ausgeschlossene und
  von `DEC-RL-006`/`REST-03` verbotene Fall — und waere zudem ein Link auf eine
  Redirect-Quelle. Die Auslassung ist im Code begruendet und **per Test festgehalten**,
  damit sie nicht versehentlich zurueckkommt. **Owner: AP10** (Locale-Weiche/Redirects)
  gemeinsam mit **AP21** (Consumer-Strecke). Damit bleibt `IAD-16` fuer den Consumer-Anteil
  offen; Epigenetik und Support sind geschlossen.
  **Social:** LinkedIn und Instagram als reine `<a>`-Links mit `target="_blank"` und
  `rel="noopener noreferrer"`, benannt — **kein** eingebettetes Widget, **kein**
  Drittanbieter-Skript, **kein** iframe (per Test abgesichert), also auch kein Tracker vor
  dem Consent.
  **x10:** neue `footer.*`-Keys (Spaltenueberschriften, Standorte, Legal, Nav-Label,
  vier Epigenetik-Labels) in **allen zehn** Locales; die neun Service-Labels stammen aus
  den in PT06.2 angelegten `nav.*`-Keys. Die vier Epigenetik-Labels wurden **nicht** aus
  `epigenetics.json` uebernommen: die Datei ist nur DE+EN gepflegt und traegt in acht
  Locales englischen Fallback (**vorbestehende Content-Schuld, Owner AP15/AP08**) — ein
  Uebernehmen haette Englisch in acht Footer geschrieben.
  **Live geprueft:** **240/240** Footer-Ziele HTTP 200 (24 Ziele × 10 Sprachen) · mobil und
  desktop **0 Links unter 44px**, **0px horizontaler Ueberlauf** · **14/14** Footer-Elemente
  per Tab mit sichtbarem Fokusring · Labels in de/cs/nl/pl stichprobenartig lokalisiert
  bestaetigt · **0** `/services*`-Ziele, **0** Chat-, **0** Garantie-, **0** Backlog-Ziele.
  **Verifikation:** Typecheck gruen · Build gruen · Farb-Guard gruen · DS-Changelog-Gate
  gruen · Lint **128 Findings, unveraendert, 0 neue** · **Tests 148/148** (Footer 18 neu) ·
  **Playwright 55/55, zweimal in Folge**; die 6 Seiten-Baselines enthalten den Footer und
  wurden neu aufgenommen. **0 Commits.** Decision Locks **18/18**.

- PT06.4 — Globale Hilfselemente geprueft, Chat-Frontend entfernt, zwei echte Defekte behoben.
  **Chat produktiv entfernt (`DEC-RL-007`, closure-kritisch):** `<ChatWidget />` und sein
  Import sind aus `App.tsx` raus, `src/components/ui/ChatWidget.tsx` **geloescht**. Das
  Widget lud auf **jeder** B2B-Seite unbedingt `https://widget.hihuman.co.uk/bundle.js` —
  ohne Bedingung, ohne Consent. **Live nachgemessen ueber drei Seiten: 0 HiHuman-Requests**;
  der einzige verbleibende externe Host ist `googletagmanager.com` (AP23). Damit ist
  `CONSENT-CONTRACT.md` `CD-3` / Gate `G-10` fuer den **Frontend**-Anteil geschlossen.
  **Ownership-Grenzen eingehalten und per Test festgehalten:** `POST /api/chat` im Backend
  **unveraendert** (Owner **AP22 PT22.7**), HiHuman-Domains in der CSP **unveraendert**
  (Owner **AP26 PT26.2**), Consent-Logik nicht angefasst (Owner **AP23**).
  **Skip Link neu** (`SkipLink.tsx`, WCAG 2.4.1): vorher gab es keinen. Wer mit der Tastatur
  arbeitet, musste sich auf jeder Seite durch Logo, sieben Navigationspunkte,
  Untermenue-Trigger, Suche, Sprachumschalter und CTA tabben. Jetzt **erstes fokussierbares
  Element**, sichtbar bei Fokus, 44px, x10 lokalisiert; Ziel ist `<main id="main-content"
tabIndex={-1}>` — ohne `tabIndex` scrollt der Browser nur, statt den Fokus zu setzen.
  Live: erstes Tab-Ziel, Enter fokussiert `MAIN`.
  **ScrollToHash-Defekt gefunden und behoben:** beim Direktaufruf von
  `/de/epigenetics#analysen` landete die Zielueberschrift **39px hinter der Kapitelleiste**.
  Ursache: im Moment des Scrollens ist die Leiste noch nicht montiert,
  `--chapterbar-offset` also nicht gesetzt — der Sprung nutzte den Header-Rueckfall
  (88+16=104px), und sobald die Leiste erschien, lag das Ziel darunter. Der Sprung fuehrt
  jetzt **nach**: sobald die Seite zur Ruhe gekommen ist, wird gegen den inzwischen
  gueltigen Offset geprueft und ohne Animation nachkorrigiert. Nachher gemessen:
  `#analysen` 151 vs. Leiste 143, `#ablauf` 151 vs. 143, `/#roi-rechner` 104 vs. Header 89 —
  **alle drei sichtbar**.
  **Geprueft, nicht umgebaut:** CookieBanner genau **einmal** global unter `<Routes>`
  (nicht im Layout), z-[70], setzt `--cookie-banner-height`; MobileCallButton nur in der
  B2B-Shell (Consumer-Ausnahme haelt), 44px, lokalisiert, hebt sich ueber den Banner;
  LanguageFallbackNotice bleibt defensiv (nur bei echtem `englishFallback` auf zwei Seiten);
  ScrollToTop setzt bei Navigation auf 0 (live bestaetigt).
  **Verifikation:** Typecheck gruen · Build gruen · Farb-Guard gruen · DS-Changelog-Gate
  gruen · Lint **128 Findings, unveraendert, 0 neue** · **Tests 165/165** (Shell 17 neu) ·
  **Playwright 55/55** — die Visual-Baselines blieben unveraendert, was bestaetigt, dass die
  Chat-Entfernung nichts Sichtbares beruehrt · **SSR-Smoke 40/40**. **0 Commits.**
  Decision Locks **18/18**.

- PT06.5 — Navigationstests: die AP06-Zusagen sind jetzt maschinell abgesichert statt
  einmalig gemessen. **Zwei neue Guards**, beide pre-commit **und** in CI verankert:
  `check:shell-i18n` liest die Beschriftungs-Keys aus den Shell-Quellen (keine gepflegte
  Liste, die driften koennte) und prueft **50 Beschriftungen x 10 Sprachen** auf
  Vollstaendigkeit und auf durchgereichten englischen Fallback; `check:nav-targets`
  validiert **26 Header-/Footer-/Mega-Menue-Ziele gegen die 33 real definierten Routen**
  aus `App.tsx` — kein `/services*`, kein Backlog, kein Chat, kein totes Ziel. Beides
  bewusst **keine zweite Route Registry**: die Guards lesen ab, was die Anwendung ohnehin
  definiert (AP10 bleibt Owner). Beide Guards negativ getestet (fehlender Key,
  Redirect-Quelle, erfundene Route -> Exit 1).
  **Fallback-Heuristik geschaerft:** der erste Entwurf meldete `nav.blog` als fehlende
  Uebersetzung. "Blog" heisst aber in allen zehn Sprachen "Blog" — ein Lehnwort, kein
  Fallback. Die Signatur eines echten Fallbacks ist eine andere: **Deutsch uebersetzt,
  die uebrigen tragen woertlich Englisch**. Genau darauf prueft der Guard jetzt; sonst
  waere er nach kurzer Zeit als Fehlalarm abgeschaltet worden.
  **Neu: `e2e/navigation.spec.ts` mit 32 Tests** — Desktop-Tastatur (Sprunglink zuerst,
  jedes Header-Ziel per Tab mit sichtbarem Ring, Mega-Menue per Enter, Escape mit
  Fokusrueckgabe), Mobil (Burger, 9 Services, 0 Ziele <44px, 0px Ueberlauf, eigener
  Epigenetik-Eintrag), Screenreader-Beschriftungen (**0 Bedienelemente ohne
  zugaenglichen Namen** in Kopf- und Fusszeile), aktive Zustaende auf fuenf Routen plus
  Parent- und Anker-Fall, Ankernavigation mit Offset-Messung, **Sprachwechsel in allen
  zehn Locales** (kein erzwungenes `/en/`, **0 fremdsprachige Links** in der Shell),
  sowie die beiden Regressionssperren (kein Chat/HiHuman-Request, kein Garantie-Band).
  **Garantie-Guard bewusst praezise:** geprueft wird auf die CTA-Band-Formulierung
  (`garantierte Performance/Leistung`, `guaranteed performance`) in Kopf- und Fusszeile —
  **nicht** auf jedes Vorkommen von "Garantie", das im Fliesstext einer Serviceseite
  fachlich legitim ist.
  **Zweiter Anlauf beim ScrollToHash-Defekt.** Die PT06.4-Korrektur war unvollstaendig:
  sie hoerte auf, sobald der AKTUELLE Offset erfuellt war. Montierte die Kapitelleiste
  erst danach, blieb das Ziel beim Header-Rueckfall stehen. Aufgefallen ist das erst
  durch einen **zweiten Viewport** — bei 1280x720 lief es, bei 1440x900 nicht; ein
  Timing-Fehler, der sich als "funktioniert" tarnt. Der Sprung laesst jetzt erst los,
  wenn der Offset ueber mehrere Frames konstant ist, bricht bei jeder Nutzereingabe ab
  und hat 3s statt 1s Budget. Nachgemessen ueber **3 Viewports x 3 Anker: 9/9 sichtbar**.
  **Verifikation:** Typecheck gruen · Build gruen · Farb-Guard, DS-Changelog-Gate,
  Shell-i18n-Gate und Nav-Target-Gate gruen · Lint **128 Findings, unveraendert, 0 neue** ·
  **Unit/Component 165/165** · **Playwright 87/87** (55 + 32 neu) ·
  **SSR-Smoke 70/70** (10 Sprachen x 7 Shell-Routen) plus echte 404 und echter 301.
  CI hat jetzt **17 Steps**. `useSearch.ts`, `/api/chat` und die CSP **unveraendert**.
  **0 Commits.** Decision Locks **18/18**. **AP06-CLOSURE und AP07 nicht gestartet.**
- AP06-CLOSURE — Closure Gate `PASS`: `C06-01` bis `C06-40` geprueft, dazu die
  Navigations-Invarianten `NAV-01` bis `NAV-28`. Auf dem Closure-HEAD neu gemessen statt
  aus den PT-Reports uebernommen: Typecheck gruen · Build gruen · Unit/Component
  **165/165** (14 Dateien) · Playwright **87/87** · vier Guards gruen (`check:colors`,
  `check:ds-changelog`, `check:shell-i18n` 50x10, `check:nav-targets` 26 Ziele/33 Routen) ·
  **SSR-Smoke 100/100** (10 Sprachen x 10 Shell-Routen) plus 9/9 Diagnostik-Services,
  3/3 Epigenetik-Vertiefungen, 3/3 Legal und den Negativkontrollen `404` fuer
  `/de/diagnostics/sports` und `/de/diagnostics/epigenetics`. Laufzeitgeprueft am
  ausgelieferten HTML: **0** HiHuman/ChatWidget-Treffer (auch im gesamten Client-Bundle),
  **0** Garantie-/Performance-Band, **0** `/services*`-Links, **0** Consumer-Links in der
  Shell, 3 Epigenetik-Links und 0 `/diagnostics/epigenetics`, beide Social-Links extern
  mit `rel="noopener noreferrer"`, Suche und Sprachwahl gelabelt. Grenzen unveraendert
  bestaetigt: `useSearch.ts`, `server.ts` und `server/server.js` **0 Aenderungen**,
  `POST /api/chat` weiterhin vorhanden, HiHuman-Domains weiterhin in der CSP.
  **Keine neue konkurrierende Registry, kein zweiter Suchindex, keine zweite
  Consent-/IA-/Design-System-Wahrheit.** Drei Befunde offen dokumentiert und bewusst
  **nicht** in der Closure repariert (`AP06.md` §44): ein flaky Tastatur-Test
  (Hydrations-Rennen, isoliert 96/96 gruen), ein sachlich falscher Consumer-Kommentar in
  `App.tsx`, und die Praezisierung, dass `/de/services` clientseitig statt per 301
  umleitet. **0 Commits.** Decision Locks **18/18**. **AP07 nicht gestartet.**
- PT07.1 — Suchindex auf 35 aktive, route-validierte Ziele erweitert: 9/9 Services aus der
  kanonischen Datenquelle, 6/6 veröffentlichte Artikel über reale Slugs, Epigenetik-Hub plus drei
  Vertiefungsrouten und sechs Musterbefunde, Downloads/Events/strategische Seiten; `sports`,
  `/services*` und Future-Ziele absent. Search-Metadata und Result-Type-Labels 10/10, Guard in
  pre-commit/CI, Matrix Section A vollständig und vier ownergebundene DSI unverändert OPEN.
- PT07.2 — SearchModal auf den AP05-Dialog umgestellt und als benannter, fokussicherer,
  keyboard-operabler und mobiler Suchdialog umgesetzt. Acht lokalisierte Ergebnisgruppen, vier
  AP05-Zustände, polite Ergebnisansage, x10 UI-Copy und locale-aware Ergebnisnavigation sind durch
  12 SearchModal-Komponententests, den erweiterten Dialogtest und 5 Browsertests abgesichert;
  PT07.1-Index und Findability-Matrix unverändert erhalten.

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
- **Kanonischer Content-/Asset-Vertrag: `building-docs/CONTENT-ASSET-CONTRACT.md`** (AP02 PT02.3).
  Er ergänzt `I18N-CONTRACT.md` (Sprachmenge, Parität) und `ROUTING-CONTRACT.md` (Route-Existenz) und
  ersetzt keinen von beiden.
- **Vier Content-Schichten mit getrennter Verantwortung** (CA-01): fachliche Identität · lokalisierte
  Texte · spezialisierte Content-Daten · statische Assets. Eine Information hat genau eine zuständige
  Schicht (CA-02).
- **Übersetzungsdateien führen keine fachliche Wahrheit** (CA-10): keine Slugs, Routen, Dateinamen, IDs
  oder Datumslogik. Strukturierte Werte bleiben strukturiert, die Darstellung entsteht aus
  Locale-Formatierung (CA-07).
- **Sprachabhängige Assets sind explizit modelliert** (CA-25–CA-29): stabile Asset-Identität, je Sprache
  eine deklarierte Datei oder ausdrückliche Sprachneutralität, Lücken maschinell erkennbar, **kein
  stiller Fremdsprach-Fallback**.
- **PUBLIC vs. GATED ist ein deklariertes Merkmal** (CA-30). **Eine unverlinkte Datei gilt nie als
  geschützt** (CA-31); ein Gate prüft eine Berechtigung, keine Herkunft (CA-32).
- **CMS ist keine Launch-Voraussetzung** (CA-39/CA-40, `DEC-RL-010`); die Architektur bleibt
  anschlussfähig, ohne ein CMS zu verlangen.
- **Kanonischer Lead-/Backend-Vertrag: vier Dokumente, ein Einstieg.** `LEAD-DATA-CONTRACT.md` §2.1 ist
  die Vertragslandkarte; sie sagt, welches der vier Dokumente welches Thema besitzt. Es gibt **kein**
  fünftes Lead-/Backend-Architekturdokument.
- **Persist-before-deliver ist verbindlich** (LD-01, API-01, LDV-02): eine Erfolgsantwort bestätigt die
  dauerhafte Annahme, nie den Erfolg eines externen Providers. **Mail-only ist ausgeschlossen**
  (`DEC-RL-009`).
- **Systemgrenzen** (LD-27): eigener Speicher ist System of Record; CRM und Mailprovider sind
  nachgelagert; **Browser-Speicher ist niemals Lead-Persistenz**; das Log ist Spur, nicht Zustand.
- **Idempotenz und Deduplication sind getrennt** (LD-28): technische Idempotenz ist Pflicht (fünf Ebenen
  A–E in `BACKEND-API-CONTRACT.md` §5.3), fachliche Deduplication ist eine journey-spezifische Strategie
  und darf legitime getrennte Anfragen nicht zusammenwerfen.
- **Aufbewahrungsfristen sind `TBD_OWNER_LEGAL`** (LD-29) — keine Frist wird architekturseitig erfunden,
  und unbegrenzte Haltung ist kein zulässiger Default.
- **Anbieterneutral** (LD-32/LD-33, CRM-02, DEP-56): Datenbank, Queue, CRM, Log-Senke, Monitoring und
  Secret-Manager sind offen; das Zielbild ist ohne diese Entscheidungen baubar.
- **Kanonischer Produktionsbetriebsvertrag: `building-docs/DEPLOYMENT-CONTRACT.md`** (AP02 PT02.5).
  Es gibt **genau einen** produktiven Deployment-Vertrag (DEP-02/DEP-54); kein zweiter Ops-Contract.
- **`REST-01` ist umgesetzt als Zielbild:** Docker/Compose, Reverse Proxy als öffentliche Grenze,
  Web/SSR und Backend/API containerisiert, privates Service-Netz (DEP-37), persistente Daten außerhalb
  des flüchtigen Layers (DEP-10), Backup **mit belegtem Restore** (DEP-17), Secrets außerhalb Repo und
  Image (DEP-31), anwendungsnahe Healthchecks je Dienst (DEP-46), Restart Policies (DEP-34),
  Monitoring (DEP-35), image-basiertes Rollback (DEP-22/DEP-26).
- **Startreihenfolge ist kein Bereitschaftsnachweis** (DEP-49); **Healthchecks erzeugen keine
  produktiven Nebenwirkungen und geben keine Secrets aus** (DEP-48).
- **Legacy ist keine produktive Wahrheit** (DEP-54): `vercel.json`, das statische SPA-`nginx.conf` und
  `scripts/prerender.mjs` überschreiben `REST-01` nicht; eine SPA-Proxy-Konfiguration darf die
  SSR-Laufzeit nie ersetzen (DEP-45). Bereinigung bleibt **AP28 PT28.7**.
- **Docker/Compose bleibt der Produktionsstandard** (DEP-55) — keine Cluster-, Blue-Green- oder
  Multi-Region-Pflicht wird erfunden.
- **Architecture baseline complete (AP02 Closure PASS).** Die fünf Zielarchitekturen sind kanonisch
  dokumentiert, untereinander konsistent und owner-fähig:
  SSR/rendering `RUNTIME-CONTRACT.md` (RT-38–RT-70) · routing/route-registry `ROUTING-CONTRACT.md`
  (R-17–R-53) · content/assets `CONTENT-ASSET-CONTRACT.md` (CA-01–CA-40) · lead/backend
  `LEAD-DATA-CONTRACT.md` §2.1 als Einstieg mit `BACKEND-API-CONTRACT.md` (API-21–API-23),
  `LEAD-DELIVERY-CONTRACT.md`, `CRM-INTEGRATION.md` und LD-27–LD-33 · production/deployment
  `DEPLOYMENT-CONTRACT.md` (DEP-37–DEP-57).
- **Kanonisches IA-Artefakt: `building-docs/IA-INVENTORY.md`** (AP03 PT03.1). Es gibt genau eines;
  es ist **IA-Wahrheit, keine zweite Routing-Wahrheit** (`AP03.md` §5.3). Pfade, Locale-Policy und
  Status bleiben `ROUTING-CONTRACT.md`.
- **Epigenetik ist im Inventar eine eigenständige Geschäftssäule** (IA-08); die heutige
  Navigationsunterordnung unter Diagnostik ist Debt `IAD-02`, nicht Ziel.
- **Consumer ist im Inventar dreimal 10 Locales und indexierbar** (IA-10/IA-11); der heutige
  `/en/`-Zwang ist Debt `IAD-01`.
- **Seitentyp-Taxonomie ist verbindlich** (`IA-INVENTORY.md` §8.1): zehn primäre Typen `T1`–`T10`;
  jede logische Inhaltsseite trägt **genau einen** (§8.4). Redirect Sources, 404 und technische Pfade
  erhalten **keinen** Inhalts-Seitentyp (§8.5).
- **CTA-Rollen sind kontrolliert** (§8.3): der allgemeine B2B-Sales-Weg ist `QUOTE_REQUEST` =
  **„Angebot anfragen"** (`DEC-RL-013`); Consumer ist `ORDER`, Support ist `SUPPORT_REQUEST` und
  **kein Sales-Lead**, Epigenetik ist `EPIGENETICS_INQUIRY`, das Gate ist `GATE_SUBMIT`, Legal ist
  `NONE`.
- **Public und gated Ressourcen sind getrennte Rollen** (`public-resource` vs. `gated-lead-magnet`,
  §8.1/§8.4); mindestens eine Secondary Conversion ist IA-seitig vorgesehen (`IA-15`, P-17).
- **Rollenquellen:** **§8.4** für Seitentyp, Zielgruppe, Aufgabe und CTA · **§10.15** für Main Nav,
  Footer, Search, Breadcrumb, ChapterNav, Direct/SEO-Entry und Crosslink · §4 bleibt die Inventarsicht.
- **Sieben Kernjourneys sind verbindlich** (`IA-INVENTORY.md` §9): jede Lead-Journey endet im
  persistenten Lead-Modell mit CRM-Handoff (`DEC-RL-009`), kein Journey-Schritt setzt Tracking vor
  Consent voraus, kein Chat ist Journey-Station.
- **Navigation ≠ Route Registry ≠ Sitemap ≠ Search** (§10.1): vier getrennte Mengen mit eigenen
  Wahrheitsquellen; aus einer folgt keine andere.
- **Epigenetik erhält einen eigenen Hauptnavigationspunkt** (`IA-09`, §10.5); Diagnostik bleibt davon
  getrennt und modelliert Epigenetik nicht als zehnten Service.
- **Consumer ist bewusst nicht in der B2B-Hauptnavigation** (`IA-12`), aber über Footer, Search,
  organische Suche und kontextuelle Crosslinks in **vier** benannten Kanälen auffindbar.
- **Breadcrumbs sind fachlich, nicht URL-abgeleitet** (`IA-18`, §10.10); Consumer trägt bewusst
  **keinen** sichtbaren Breadcrumb.
- **Alle 25 IA-Invarianten aus `AP03.md` §10 sind adressiert**; keine offene Klassifikation.
- **`ARCHITECTURE BASELINE COMPLETE` heißt nicht launch-ready.** AP02 hat nichts implementiert: kein
  Routing, keine Lead-Plattform, kein Docker-Zielstack, kein Consumer × 10, keine SEO-Umsetzung, keine
  Consent-Reparatur. Alle 12 Launch-Gates stehen unverändert auf `NOT_RUN`.
- **Eigentümer-AP (liefert) ≠ Accountable Owner Role (nimmt ab).** Wer liefert, nimmt nicht ab.
- Technische Gate-Kriterien stehen in `MASTER-SCOPE.md` §8 und `QUALITY-GATES.md` §12 und werden in
  `RELEASE-ACCEPTANCE.md` nur referenziert, nicht dupliziert.
- Ergebnissemantik verbindlich: `NOT_RUN` (Standard) · `PASS` · `FAIL` · `BLOCKED`. Ein Gate ohne
  Nachweis gilt als nicht erfüllt (`QUALITY-GATES.md` QG-15); ein `BLOCKED` wird nie zu `PASS` umgedeutet.
- Waiver verschiebt die Erfüllung einer gültigen Anforderung; ein Scope Change ändert die Anforderung
  und läuft ausschließlich über `SCOPE-CHANGELOG.md`.

## Files Changed by Current AP

<!-- AP04. Beim Start von AP05 leeren (siehe `Benutzung`). -->

**PT09.2 — Sitemap / G3 SEO Artifact Coverage:**

- `src/components/seo/sitemap.ts`, `server.ts` — bestehenden Sitemap-Spiegel in testbare AP09-
  Adaptergrenze überführt; 39 Families/390 x10-URLs; dynamische Services, Articles und Befunde aus
  ihren realen Datenquellen; Legal/noindex und Redirect Sources ausgeschlossen; Article-`lastmod`
  aus Publikationsdatum, sonst bewusst weggelassen
- `src/components/seo/sitemapGuard.ts`, `scripts/check-seo.ts`,
  `src/components/seo/sitemap.test.ts`, `e2e/sitemap.spec.ts` — kanonischer G3, Hard-Failure-
  Self-Test, XML-/Coverage-/Indexability-Unit-Regression und 390-Ziele-Production-SSR-Test
- `package.json`, `package-lock.json`, `.github/workflows/ci.yml` — `saxes` als direkter XML-Parser,
  stabiler `check:seo`-Befehl, TSX-Start mit Projekt-TSConfig und G3-Struktur-/Runtime-CI-Schritte
- `building-docs/SEO-CONTRACT.md`, `building-docs/state/AP-STATE.md` — PT09.2-Evidence, DG09-01
  unverändert ownergebunden, Next PT09.3

**PT09.1 — SEOHead-Konsolidierung / 404-Safety:**

- `src/components/seo/SEOHead.tsx` — explizite Indexability-Semantik, eindeutiger Brand-Suffix,
  Public-Host-guarded Canonical-/Image-Ausgabe, x10-/x-default-Ableitung, keine Alternate-Claims für
  nicht indexierbare States, keine valid-page URL-Claims auf 404
- `src/components/seo/seoRouteSource.ts`, `src/components/seo/index.ts` — pfadlistenfreie AP09-
  URL-/Locale-Adaptergrenze und Exporte; keine Route Registry
- `server.ts` — minimaler begrenzter Head-Render-Retry bei leerem erstem Lazy-Helmet-Title; bestehender
  `NOT_FOUND_MARKER`, Known-Path- und HTTP-Status-Vertrag unverändert
- `src/components/seo/SEOHead.test.tsx`, `e2e/seo-head.spec.ts` — Unit-/Production-SSR-Regression für
  Title/Description/Robots/Canonical, x10-hreflang, x-default, Self-Reference, OG/Twitter, Overrides,
  Consumer/S3/Implantology und echte 404
- `building-docs/SEO-CONTRACT.md` — kanonischer AP09-Regel-/Evidence-Stand inklusive DG09-01
- `building-docs/state/AP-STATE.md` — AP09 IN_PROGRESS, PT09.1 PASS, Next PT09.2

**PT07.1 — produktiver Suchindex, Route- und Metadaten-Guard:**

- `src/hooks/useSearch.ts` — manuellen Search-Spiegel auf 35 route-validierte Ziele erweitert;
  Services/Artikel aus ihren kanonischen Datenquellen; `sports` entfernt; Matching und Priorität
  konsolidiert; acht semantische Result Types vorbereitet
- `src/hooks/useSearch.test.ts` — 5 Unit-Tests für Service-/Artikel-/Epigenetik-Coverage,
  Slug-Integrität, No-Legacy/No-Sports und Matching
- `src/components/ui/SearchModal.tsx` — bestehende Rohtyp-Ausgabe auf das x10 `typeLabel` des Index
  umgestellt; keine PT07.2-Dialog-/UX-Arbeit
- `scripts/check-search-index.ts` — Ziel-, Source-, Matrix-, x10- und Negativkontroll-Guard
- `public/locales/{de,en,pl,fr,it,es,pt,da,nl,cs}/common.json` — ausschließlich AP07-eigene
  Search-Metadaten und Result-Type-Labels; keine Body-Lokalisierung
- `package.json`, `lefthook.yml`, `.github/workflows/ci.yml` — Search-Guard verankert
- `building-docs/AP07-FINDABILITY-MATRIX.md` — Section A vollständig; Section C `DSI-01`–`DSI-04`
- `building-docs/state/AP-STATE.md` — Handoff auf PT07.2

**PT07.2 — zugänglicher SearchModal:**

- `src/components/ui/SearchModal.tsx` — auf den AP05-Dialog umgestellt; zugängliches Suchfeld,
  gruppierte Treffer, vier Zustände, Live-Ansage, robuste Keyboard-/Mobile-Navigation
- `src/components/ui/SearchModal.test.tsx`, `e2e/search-modal.spec.ts` — Component- und Browser-
  Regressionen für Semantik, Fokus, Tastatur, Zustände, Navigation, 390 px und Reduced Motion
- `src/components/ui/Dialog.tsx`, `src/components/ui/Dialog.test.tsx` — kleine generische
  `initialFocusRef`-Erweiterung des bestehenden AP05-Patterns; keine zweite Dialog-SSOT
- `public/locales/{de,en,pl,fr,it,es,pt,da,nl,cs}/common.json` — ausschließlich SearchModal-eigene
  UI-Copy x10; keine Body-Lokalisierung und kein i18n-Core-Umbau
- `scripts/check-search-index.ts` — x10-Guard um SearchModal-UI-Keys erweitert
- `.github/workflows/ci.yml` — SearchModal-Browsertest als eigener CI-Schritt
- `building-docs/state/AP-STATE.md` — Handoff auf PT07.3; Findability-Matrix unverändert

**PT07.3 — interne Findability / Crosslinks:**

- `src/pages/ArticlePage.tsx`, `src/pages/ServicePage.tsx` — vorhandene reziproke
  Artikel-/Service-Zuordnung sichtbar gemacht; keine generischen irrelevanten Artikel mehr
- `src/pages/EpigeneticsPage.tsx` — Hub verlinkt die drei realen Vertiefungsrouten aus dem bestehenden
  `VERTIEFUNGEN`-Datensatz; sechs Befunde und reale Hash-Anker bleiben erhalten
- `src/pages/DownloadsPage.tsx`, `src/pages/VitaminD3ImplantologyPage.tsx` — Produkt-/Resource-Kontext
  ergänzt, `/services/dental` auf das kanonische `/diagnostics/dental` korrigiert
- `public/locales/{de,en,pl,fr,it,es,pt,da,nl,cs}/articles.json` — ausschließlich das neue
  AP07-Linkgruppenlabel `detail.related_services` x10; keine Body-Lokalisierung
- `src/pages/findability.test.ts`, `e2e/findability.spec.ts`,
  `scripts/check-internal-findability.ts` — Relationship-, Hub-, Hash-, DLI-, x10- und
  No-Legacy-Regressionsschutz; in Package, pre-commit und CI verankert
- `building-docs/AP07-FINDABILITY-MATRIX.md` — Section B mit 43/43 Routen; Section C um
  `DLI-01`–`DLI-03` ergänzt und `DSI-04` ohne False-Ready auf den realen Consumer-Safe-State präzisiert
- `building-docs/state/AP-STATE.md` — Handoff auf AP07-CLOSURE; AP07 bleibt `IN_PROGRESS`

**AP07-CLOSURE — Verifikation und Dead-Link-Remediation:**

- `public/locales/{de,en,pl,fr,it,es,pt,da,nl,cs}/services.json` — tote
  `/<locale>/blog/vitamin-d3-implantologie`-Ziele auf die reale kanonische Route korrigiert;
  nicht verfügbaren Backlog-Case-Study-Link entfernt, lokalisierten Text erhalten
- `scripts/check-internal-findability.ts` — x10-Regression für beide Altziele und das kanonische
  Implantologie-Ziel ergänzt
- `building-docs/AP07-FINDABILITY-MATRIX.md` — Section D mit Closure-Evidenz und 43/43 C07-Gates
- `building-docs/state/AP-STATE.md` — AP07 `COMPLETE / Closure PASS`, Handoff auf AP08

**PT08.1 — gemeinsamer i18n-Core:**

- `src/i18n.ts`, `src/i18n.client.ts`, `src/i18n.server.ts`, `src/entry-server.tsx`, `server.ts` —
  gemeinsame browser-/node-neutrale x10-Konfiguration, URL-primaere Locale und deterministisches SSR-Laden
- `src/lib/translationStatus.ts`, `src/components/ui/LanguageSwitcher.tsx` — defensiver
  Fallback-Vertrag und kanonische x10-Sprachliste
- `src/i18n.test.ts`, `server/i18n-core.test.ts`, `e2e/i18n-core.spec.ts` — Core-, SSR-,
  Hydration- und LanguageSwitcher-Evidenz
- `building-docs/I18N-CONTRACT.md`, `building-docs/state/AP-STATE.md` — technischer Vertrag und Handoff

**PT08.2 — hartcodierten Content i18n-faehig gemacht:**

- `src/pages/S3LeitliniePage.tsx`, `src/pages/VitaminD3ImplantologyPage.tsx` — sichtbare Fachcopy
  ohne Struktur-/Routingumbau auf den neuen Namespace `specialty` migriert
- `src/pages/consumer/{SprayPage,MaskPage,DuoPage,OrderForm,OrderModal,PriceBadge,shell}.tsx` —
  bestehende Consumer-, Shell-, Order-, Modal- und Price-Copy auf den Namespace `consumer` migriert;
  Tracking, Backend- und Routing-Semantik unveraendert
- `src/lib/localeFormat.ts` — kleiner Runtime-Locale-Helper fuer Zahl, Preis, Waehrung und Datum
- `public/locales/{de,en,pl,fr,it,es,pt,da,nl,cs}/{specialty,consumer}.json` — alle von PT08.2
  eingefuehrten produktiven Keys in zehn echten Zielsprachen
- `server/pt08-2-i18n.test.ts`, `src/lib/localeFormat.test.ts`,
  `scripts/check-pt08-2-render.ts`, `src/i18n.test.ts` — Hardcode-, x10-Key-, Formatting- und
  5-Routen-mal-10-Locales-Regressionsevidenz
- `building-docs/I18N-CONTRACT.md`, `building-docs/CONTENT-MATRIX.md`,
  `building-docs/state/AP-STATE.md` — Namespace-/Deferred-Gate-Evidenz und Handoff auf PT08.3

**PT08.3 — Namespace- und Key-Paritaet:**

- `src/i18n.ts` — 15 produktive Namespaces sowie explizite Backlog-Klassifikation fuer
  `casestudies`/`shop`; keine Backlog-Reaktivierung
- `public/locales/*/{epigenetics,articles,home}.json` — Epigenetik x10 ohne regulaeren Fallback,
  vier historische Artikel-Fallbacks geschlossen und drei zuvor fehlende sichtbare UI-/Alt-Keys x10
- `src/content/befunde/` und `src/pages/musterbefund/` — sechs Befunde mit 60 Sprachdateien;
  `BefundSprachen` x10, slug-lokale Lazy-Routen und unbekannter-Slug-404 erhalten
- `scripts/check-i18n.ts`, `package.json`, `.github/workflows/ci.yml` — ein kanonischer G4-Guard,
  stabiler Repository-Befehl, harter Self-Test, Duplikat-/Key-Referenzprüfung, Relaunch-CI aktiv
- `building-docs/I18N-CONTRACT.md`, `building-docs/CONTENT-MATRIX.md`,
  `building-docs/state/AP-STATE.md` — reproduzierbare Evidenz, aufgelöste `DG-01`/`DG-02`/`DG-05`
  und ehrlicher damaliger Handoff auf PT08.4; Systemmail-/Asset-Gates bleiben offen, das Routing-Gate
  wurde anschließend durch PT08.4 geschlossen

**PT08.4 — Sprachwechsel und Routen:**

- `src/lib/localeRoute.ts`, `src/components/ui/LanguageSwitcher.tsx` — kanonische x10-URL-Navigation
  auf derselben logischen Route unter Erhalt von Query und Hash; keine persistente zweite Locale-Wahrheit
- `server.ts`, `src/App.tsx` — historische Consumer-EN- und Spezialseiten-DE-Zwangsredirects entfernt;
  direkte SSR-/Client-Routen liefern die angeforderte unterstützte Locale
- `src/components/seo/SEOHead.tsx` — ausschließlich minimaler Compatibility-Fix für reale x10-Routen,
  bestehende Canonical-/hreflang-Ausgabe und `x-default=de`; keine AP09-Plattform
- `src/pages/consumer/shell.tsx`, `src/pages/VitaminD3ImplantologyPage.tsx` — Switcher-Anbindung und
  zwei verbliebene sichtbare Spezialseiten-Hardcodes auf bereits vorhandene x10-Keys umgestellt
- `src/lib/localeRoute.test.ts`, `e2e/pt08-4-routing.spec.ts` — Same-Page-, Query-/Hash-, dynamische
  Slug-, 10-Locale-SSR-, Consumer-/Spezialseiten-, Redirect- und SEO-Compatibility-Evidenz
- `building-docs/I18N-CONTRACT.md`, `building-docs/state/AP-STATE.md` — reproduzierbarer Handoff auf
  PT08.5; Systemmail-/Asset-, finale SEO- und umfassende Redirect-/Registry-Arbeit bleiben offen

**PT08.5 — Systemtexte, Formulare und Mails:**

- `server/system-i18n.js`, `server/server.js` — x10 Support-/ROI-Nutzer-Mailcopy, locale-aware
  Runtime-PDF, validierte Journey-Locale, strukturierte Fehlercodes und defensiver `en`-Fallback;
  keine neue Delivery-, Queue-, CRM- oder Persistenzplattform
- `src/api/{contact,support,consumerOrder}.ts`, `src/hooks/{useContactForm,useSupportForm}.ts` und
  produktive Contact-/Support-/Consumer-/Praxis-/ROI-Formflächen — Locale-Propagation, x10
  Validation-/Loading-/Success-/Error-Semantik und keine rohe Backend-Fehlerausgabe
- `public/locales/*/{consumer,specialty,vitd3spray}.json` — ausschließlich PT08.5-eigene
  System-/Validation-Copy und ehrliche Bestellanfrage-Texte x10; kein Nutzer-Mailversprechen ohne Runtime
- `server/system-i18n.test.ts`, `server/system-ui-i18n.test.ts` — x10 Mail-/Form-/GENERAL_SALES- und
  Locale-Propagation-Evidenz
- `building-docs/I18N-CONTRACT.md`, `building-docs/CONTENT-MATRIX.md`,
  `building-docs/state/AP-STATE.md` — aktuelle Runtime-Inventur, aufgelöste `DG-04`/`DG-09` und
  ownergebundene Future-Flows; Handoff ausschließlich auf PT08.6

**Von PT07.1 nicht verändert:** `src/App.tsx`, `server.ts`, Route-/Redirect-Logik, `src/i18n.ts`,
SEOHead/Sitemap/robots/Structured Data, Epigenetik-/Befund-/Artikel-Body, Consumer-Komponenten,
globale Shell sowie PT07.2-/PT07.3-Flächen (bis auf die notwendige Result-Type-Label-Ausgabe).

**PT04.1 — ausschließlich Dokumentation:**

- `building-docs/CONTENT-MATRIX.md` — **neu**, das kanonische Launch-Content-Statusartefakt
- `building-docs/CONTEXT-INDEX.md` — §4.1 Regelzeile: `CONTENT-MATRIX.md` als kanonisches Artefakt
- `building-docs/state/AP-STATE.md` — Handoff auf AP04 `IN_PROGRESS` / `PT04.2`

**PT04.2 — ausschließlich Dokumentation:**

- `building-docs/CONTENT-MATRIX.md` — §18 Scope-Grenze, §19 Content-Typen-Standard `CT-01`–`CT-10`,
  §20 CTA-Taxonomie, §21 Standardisierungsstatus je Content-Einheit
- `building-docs/state/AP-STATE.md` — Handoff auf `PT04.3`

**PT04.3 — Content-/i18n-Mutation (104 Dateien, nicht committet):**

- `public/locales/**` — **89 Dateien** über alle 10 Sprachen: `common`, `home`, `contact`, `support`,
  `services`, `products`, `downloads`, `articles`, `epigenetics`
- Quelltext, **ausschließlich Copy** nach `AP04.md` §13.3 — `HeroSection`, `FinalCtaSection`,
  `StepsSection`, `IglooWidgetSection`, `DiagnosticsFocusSection`, `RoiCalculatorSection`,
  `ArticlePage`, `ArticlesIndexPage`, `ServicePage`, `S3LeitliniePage`, `HomePage`,
  `consumer/DuoPage`, `seo/structuredData.ts`, `sections/README.de.md`
- `building-docs/CONTENT-MATRIX.md` — §23 Ausführung, Verifikation und Blocker
- `building-docs/state/AP-STATE.md`

**PT04.4 (2026-08-25) — Asset-Readiness:**

- `src/pages/VitaminD3SprayPage.tsx` · `src/components/sections/IglooProHero.tsx` ·
  `IglooSpecsSection.tsx` · `IglooProductFinalCta.tsx` — 4 Dateien: PDF-Referenzen auf die kanonische
  Katalog-URL umgestellt (CD-7)
- **entfernt:** `src/assets/downloads/` (3 byte-identische, nach der Umstellung unreferenzierte PDFs)
- `public/locales/{en,pl,fr,it,es,pt,da,nl,cs}/products.json` und
  `public/locales/{pl,fr,it,es,pt,da,nl,cs}/vitd3spray.json` — 43 Sprachlabels (CA-28)
- `building-docs/CONTENT-MATRIX.md` — §22 Status, **§26 Asset-Readiness inkl. `DG-08`/`DG-09`**
- `building-docs/state/AP-STATE.md`

**In PT04.4 NICHT verändert:** `public/downloads/**` (kein Asset erzeugt, umbenannt oder gelöscht),
`src/i18n.ts`, `server*/**`, `src/content/**`, `src/data/**`, alle übrigen Locale-Namespaces,
sämtliche Routen-, Layout- und Konfigurationsdateien.

**PT04.3-RETRY (2026-08-25) — Locale-Korrekturen und Dokumentation:**

- `public/locales/{pl,fr,it,es,pt,da,nl,cs}/epigenetics.json` — 8 Dateien: A-1 (100 Werte auf
  EN-Fallback zurückgeführt) und A-2 (16 Werte mit Sprachhinweis)
- `building-docs/CONTENT-MATRIX.md` — §22 Status, §24 Präzisierung `DG-01`/`DG-05`/`DG-07`,
  **§25 Retry-Ergebnis**
- `building-docs/state/AP-STATE.md`

**Im Retry NICHT verändert:** `src/**`, `server*/**`, `src/i18n.ts`, `src/content/**`, `src/data/**`,
`public/downloads/**`, `src/assets/**`, alle übrigen Locale-Namespaces.

**AP04-RECOVERY (2026-08-25) — ausschließlich Dokumentation:**

- `building-docs/work-packages/AP04.md` — §9 (PT04.3-Spezifikation), §11 (Gate-Modell, Deferred-Register,
  Invarianten), §12 (Handoff nach PT04.3), §15 (`R04-02`, `R04-13`, `R04-14`), §16 (DoD), §17
  (Closure-Matrix, `C04-29`–`C04-32`), §18 (PASS/FAIL/BLOCKED), §19 (Closure-Lauf und -Report), §21
  (Übergabe), §22 (Abschlussaussage)
- `building-docs/work-packages/ap04-prompts.md` — Prompt 3 (PT04.3), Prompt 4 (PT04.4), Prompt 5 (Closure)
- `building-docs/CONTENT-MATRIX.md` — §22 Status, §23 Nachtrag, **§24 Deferred-Gate-Register**
- `building-docs/CONTEXT-INDEX.md` — §4.1 Regelzeile zum Deferred-Gate-Modell
- `building-docs/state/AP-STATE.md`

**Von PT04.3 nicht verändert:** `src/i18n.ts` (`NAMESPACES` = AP08-Einzeleigentum), `server.ts`,
`server/**`, `src/data/**`, `src/content/**`, `public/downloads/**`, `src/assets/**`, `public/*.jpg|png|svg`,
alle Routen-, Layout-, Design- und Konfigurationsdateien. **Keine Datei entfernt oder verschoben.**

**Nicht verändert:** `src/**`, `public/**`, `server.ts`, `server/**`, `scripts/**`, `index.html`,
jede Konfigurationsdatei. **Keine Datei entfernt, umbenannt oder verschoben.** PT04.1 hat keinen
Quellcode, keine Locale-Datei und kein Asset angefasst — verifiziert über `git status --porcelain`.

<details><summary>AP01–AP03 — Dateiänderungen früherer Arbeitspakete (Archiv)</summary>

<!-- AP03. Beim Start von AP04 leeren (siehe `Benutzung`). -->

**PT03.1 — ausschließlich Dokumentation** (committet als `06d9e55`):

- `building-docs/IA-INVENTORY.md` — **neu**, das kanonische IA-Hauptartefakt
- `building-docs/CONTEXT-INDEX.md` — Matrixzeile AP03 (required) und AP04/AP06/AP07/AP19/AP21
  (optional) plus eine Regelzeile in §4.1

**PT03.2 — ausschließlich Dokumentation** (committet als `52dd143`):

- `building-docs/IA-INVENTORY.md` (§1 Stand, §2.4, §8 Seitentypen und Rollen, Debts, Invarianten)

**PT03.3 + PT03.4 — ausschließlich Dokumentation:**

- `building-docs/IA-INVENTORY.md` — **§9 Kernjourneys** (PT03.3) und **§10 Navigation und interne
  Findability** (PT03.4) neu; §1 Stand, §2.4 Entscheidungsstand, §8.6 durch §10.15 abgelöst, §8.7
  fortgeschrieben, §11 `IAD-15`–`IAD-19`, §12 Findability-Owner, §13.1/§13.2 Invarianten.
  Folgeabschnitte von §9 auf §11–§16 umnummeriert, interne Querverweise mitgezogen.
- `building-docs/state/AP-STATE.md`

**Anwendungscode / Locale-Dateien / Assets / Runtime / Config / Dependencies / Lockfiles: NONE.**
`MASTER-SCOPE.md`, `DECISIONS.md`, `PROJECT-CONSTRAINTS.md`, `CONTEXT-INDEX.md`, `ROUTING-CONTRACT.md`,
`SEO-CONTRACT.md`, `I18N-CONTRACT.md`, `CONTENT-ASSET-CONTRACT.md` und `LEAD-DATA-CONTRACT.md` sind
**unverändert**.

**Anwendungscode / Locale-Dateien / Assets / Runtime / Config / Dependencies / Lockfiles: NONE.**
`MASTER-SCOPE.md`, `DECISIONS.md`, `PROJECT-CONSTRAINTS.md`, `ROUTING-CONTRACT.md`,
`SEO-CONTRACT.md`, `I18N-CONTRACT.md`, `RUNTIME-CONTRACT.md` und `CONTENT-ASSET-CONTRACT.md` sind
**unverändert**.

<details>
<summary>AP02 — Files Changed (abgeschlossen, zur Nachvollziehbarkeit)</summary>

**PT02.1 — ausschließlich Dokumentation** (committet als `f7a7ff0`):

- `building-docs/RUNTIME-CONTRACT.md` (§2 Stand, §3.1 Ist-Zustand, RT-38–RT-70, §5.4/§5.5,
  §6.1 RD-11–RD-16, M-08–M-11, §9.1 RT-T14–RT-T22, §10, §11/§11.1)

**PT02.2 — ausschließlich Dokumentation** (committet als `0aaa092`):

- `building-docs/ROUTING-CONTRACT.md` (§2 Stand, §3.1 Ist-Zustand, R-17–R-53, §5.1 RD-8–RD-14,
  M-06–M-08, §8.1/§8.2, §9, §10/§10.1)

**PT02.3 — ausschließlich Dokumentation** (committet als `81be126`):

- `building-docs/CONTENT-ASSET-CONTRACT.md` — **neu**, der einzige neue Contract dieses AP
- `building-docs/CONTEXT-INDEX.md` — Matrixzeilen AP02/AP04/AP19 (required) und
  AP08/AP14/AP16/AP17/AP18/AP21 (optional) plus eine Regelzeile in §4.1

**PT02.4 — ausschließlich Dokumentation** (committet als `58f0504`):

- `building-docs/LEAD-DATA-CONTRACT.md` (§2 Stand, §2.1 Vertragslandkarte, §3.1 Ist-Zustand,
  LD-27–LD-33, §9.1, §10)
- `building-docs/BACKEND-API-CONTRACT.md` (§2 Stand, API-21–API-23)
- `building-docs/CRM-INTEGRATION.md` (§2 Stand, CRM-09 präzisiert)
- `building-docs/LEAD-DELIVERY-CONTRACT.md` (§2 Stand — inhaltlich unverändert bestätigt)

**PT02.5 — ausschließlich Dokumentation:**

- `building-docs/DEPLOYMENT-CONTRACT.md` (§2 Stand, §3.1 Ist-Zustand, DEP-37–DEP-57, §5.6 Ausfallmodi,
  §6 DD-15–DD-17, M-09/M-10, §9.1/§9.2, §10, §11.1)
- `building-docs/state/AP-STATE.md`

`RUNTIME-CONTRACT.md`, `NETWORK-ALLOWLIST.md` und `QUALITY-GATES.md` sind **unverändert** — eine
referenzielle Korrektur war nicht erforderlich.

</details>

**Anwendungscode / Locale-Dateien / Assets / Runtime / Config / Dependencies / Lockfiles: NONE.**
`MASTER-SCOPE.md`, `DECISIONS.md`, `PROJECT-CONSTRAINTS.md`, `I18N-CONTRACT.md`, `SEO-CONTRACT.md`,
`QUALITY-GATES.md`, `ROUTING-CONTRACT.md` und `RUNTIME-CONTRACT.md` sind **unverändert**. Es wurde genau
**ein** neuer kanonischer Contract angelegt (AP02.md §5.2); kein konkurrierendes Dokument.

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
</details>

## Open Blockers

<!-- Jeweils: ID/Kurztitel · was blockiert ist · was zur Auflösung gebraucht wird. -->

- **Keine offenen PT09.2-Blocker.** `DG09-01 — ROUTE_REGISTRY_INTEGRATION` ist bewusst
  `READY_FOR_OWNER`, Owner AP10 PT10.3, kein AP09-Closure-Blocker bei grünen AP09-eigenen Gates, aber
  Launch-Blocker. PT09.3–PT09.5 und AP09-CLOSURE sind nicht gestartet und keine PT09.2-Blocker.
- **Umgebungshinweis, keine PT09.2-Regression:** lokales Default-Node 18.20.8 startet Vitest/jsdom
  wegen der dokumentierten ESM/CJS-Toolchain-Asymmetrie nicht. Unter dem CI-/State-Vertrag Node 22
  sind die fokussierten SEOHead-/Sitemap-Tests 20/20 und Production-SSR-E2E 7/7 grün.

- **Keine offenen AP07-Closure-Blocker.** Der Dead-Link-Befund ist in allen zehn Locale-Daten behoben
  und im `check:internal-findability`-Guard regressionsgesichert. Vier Deferred Search Integrations
  und drei Deferred
  Internal Link Integrations bleiben `OPEN` und ownergebunden in Section C; sie sind spätere
  Content-/Runtime-/Journey-Gates und wurden weder als READY noch als AP07-eigene Blocker umgedeutet.
- **Umgebungshinweis, keine PT07.2-Regression:** lokales Default-Node 18.20.8 liegt unter Vites
  dokumentierter Mindestversion und startet jsdom wegen ESM/CJS-Interop nicht. Unter der in CI
  festgelegten Node-22-Laufzeit mit `NODE_ENV=test` sind alle 184 Unit-/Component-Tests grün.

- **Keine offenen Blocker.** PT01.1–PT01.5 und das AP01-Closure Gate sind `PASS`; AP01 ist `COMPLETE`.
  **AP02 und AP03 sind `COMPLETE` mit Closure `PASS`; PT03.1–PT03.4 sind alle `PASS`.**
  **PT04.1 und PT04.2 sind `PASS`** — keine task-eigenen Blocker.
- **Launch-Blocker aus PT04.1 — Arbeitsvorrat, kein Ausführungsblocker.** `CONTENT-MATRIX.md` §15
  führt **19 AP04-eigene Launch-Blocker `LB-1`–`LB-19`**. Sie sind der Auftrag von PT04.2–PT04.4 und
  hindern PT04.2 nicht am Start.
- **AP04-RECOVERY 2026-08-25 — Deadlock aufgelöst.** Der Lauf vom 2026-08-24 endete `BLOCKED`, weil
  `AP04.md` den AP08-Scope (`PT08.2`, `PT08.3`, `PT08.5`, `PT08.6`) sowie AP16- und AP22-Arbeit als
  eigene Closure-Voraussetzung führte — ein serieller Zyklus, da diese APs erst **nach** AP04 starten.
  Korrigiert über das Gate-Modell `AP04.md` §11.0 (`GM-01`–`GM-07`), das Register §11.1, die
  Invarianten-Trennung TARGET/AP04-OWN, die Closure-Gates `C04-29`–`C04-32` und `CONTENT-MATRIX.md` §24.
  **Keine Zielanforderung wurde abgeschwächt** — `MASTER-SCOPE.md` blieb unverändert und stützt die
  Korrektur (§6: AP-Nummerierung ist keine starre Reihenfolge; §7: erst i18n-Fundament, dann
  Übersetzungswelle; §8: `x10` ist Launch-Gate 1/6, nicht AP04-Closure).
- **Zwei Reihenfolge-Abhängigkeiten, die PT04.3 nicht selbst auflösen darf — seit der Recovery
  als `DG-03` bzw. `DG-02` registriert und damit kein Blocker mehr** (`CONTENT-MATRIX.md`
  §12/§13): (a) Consumer ist zu 100 % hartkodiert — `t()`-Fähigkeit ist **AP08 PT08.2** mit AP21
  (`I18N-CONTRACT.md` M-03); PT04.3 kann `LB-13` daher nicht allein über Locale-Dateien schließen.
  (b) `BefundSprachen` in `src/content/befunde/meta.ts` ist auf `de`/`en` typfixiert — die Erweiterung
  auf zehn Sprachen ist **AP16**, nicht AP04.
- **Externer Asset-Blocker für PT04.4** (`LB-15`): englische Musterbefund-PDFs existieren nicht und
  lassen sich nicht durch Umhängen einer Referenz erzeugen. **Seit der Recovery ist das ein
  `DEFERRED_ASSET_GATE` (`DG-07`)** mit Owner AP08 PT08.6 / AP19 / Fachfreigabe — kein
  PT04.4-Blocker, solange es registriert ist und keine falsche Sprachvariante still ausgeliefert wird
  (`ap04-prompts.md` PT04.4 §19.1). **Nicht** automatisch erzeugen und **nicht** fremdsprachig
  unterschieben. Ein von AP04 selbst reparierbarer toter Asset-Link bleibt ein echter Blocker.
- **Hinweis, kein Blocker — neu aus PT03.4:** fünf Findability-Schulden. **`IAD-16`** (Footer ohne
  Epigenetik- und Support-Einstieg, **Gate 6**, AP06) und **`IAD-19`** (Consumer intern nirgends
  verlinkt, **Gate 1/4**, AP06/AP07/AP21) sind die gewichtigsten; dazu `IAD-15` (Search-Index deckt
  Consumer, Epigenetik-Vertiefungen, Musterbefunde, Downloads, Events und Support nicht ab, AP07),
  `IAD-17` (Footer führt 6 von 9 Services, AP06) und `IAD-18` (interner Link auf die Redirect-Quelle
  `/services/dental`, **Gate 4**, AP10/AP20).
- **Hinweis, kein Blocker — aus PT03.3:** die Sackgassenanalyse §9.4 weist `J-05` (gated Resource) als
  **noch nicht existierende Journey** und `J-03` (Epigenetik-Inquiry) als unvollständig aus — beide
  bereits über `IAD-07` und `IAD-11` mit Owner-AP geführt.
- **Hinweis, kein Blocker — neu aus PT03.2:** drei Rollen-/Taxonomie-Schulden. **`IAD-12`** ist die
  gewichtigste: der gelockte Standard-CTA „Angebot anfragen" (`DEC-RL-013`) ist heute die Minderheit —
  „Beratung buchen" steht **15×** in sechs `de`-Namespaces gegen **7×** „Angebot anfragen" in dreien
  (**Gate 9**, Owner AP04/AP08 mit den Seiten-APs). Dazu `IAD-13` (pauschaler Einheits-CTA auf jedem
  Artikel, AP17) und `IAD-14` (Ressourcen ohne deklarierte Zugangsklasse, AP19, **Gate 10**).
- **Hinweis, kein Blocker — neu aus PT03.1:** elf IA-Schulden `IAD-01`–`IAD-11` in `IA-INVENTORY.md`
  §9, jede mit Owner-AP und Launch-Gate-Bezug, keine PT03.1-blockierend. Launch-Gate-relevant sind
  `IAD-01` (Consumer EN-only → Gate 1/4, AP21), `IAD-02` (Epigenetik unter Diagnostik → Gate 6,
  AP03 PT03.4/AP06), `IAD-05` (Legal `noindex` trotz Sitemap → Gate 4, AP20), `IAD-07` (kein gated
  Pfad → Gate 10, AP19), `IAD-08` (Chat-Reste → Gate 5), `IAD-10` (`/services*` clientseitig → Gate 4,
  AP10) und `IAD-11` (Epigenetik-Inquiry nicht eigenständig → Gate 6/3, AP15/AP22).
- **Hinweis, kein Blocker — neu aus PT02.5:** drei Betriebsschulden `DD-15`–`DD-17` in
  `DEPLOYMENT-CONTRACT.md` §6 — `DD-15` (Backend-Host-Port ohne Bedarf veröffentlicht, loopback-gebunden,
  AP28 mit AP26), `DD-16` (`depends_on` ohne Bedingung, also keine Readiness-Prüfung, AP28 PT28.2),
  `DD-17` (kein Deployment-/Image-/Scan-Schritt in CI, damit entsteht nirgends eine Release-Identität,
  AP27/AP28). Dazu bestätigt: `DD-1`–`DD-14` gelten unverändert — **keine Persistenz, kein Backup, kein
  Monitoring, kein image-basiertes Rollback**. Nichts davon wurde repariert.
- **Hinweis, kein Blocker — aus PT02.4 bestätigt (nicht neu):** der Backend-Ist-Zustand ist **Mail-only**
  und damit die Gegenposition zu `DEC-RL-009` — keine Persistenz, kein CRM, keine Queue, keine
  Idempotenz, `/api/consumer-order` ohne Rate Limit, `/api/chat` noch vorhanden, Backend-Tests decken
  nur `esc()` ab. Alles bereits als `AD-1`–`AD-11`, `LDD-1`–`LDD-12`, `LVD-1`–`LVD-12` und in
  `CRM-INTEGRATION.md` §6 dokumentiert; Owner ist überwiegend **AP22**. PT02.4 hat nichts davon
  repariert und **keine neue** Schuld gefunden.
- **Offener Punkt mit Legal-Bezug, kein Blocker:** Aufbewahrungsfristen je Lead-Typ sind
  `TBD_OWNER_LEGAL` (`LEAD-DATA-CONTRACT.md` LD-29). Die Architektur verlangt eine durchsetzbare Frist,
  legt aber keine fest.
- **Hinweis, kein Blocker — neu aus PT02.3:** zehn Content-/Asset-Schulden `CD-1`–`CD-10` in
  `CONTENT-ASSET-CONTRACT.md` §6, jede mit Owner-AP, keine PT02.3-blockierend. Die schwerste ist
  **`CD-2`**: die Sprachzuordnung der Epigenetik-Unterlagen steht als übersetzbarer String in den
  Locale-Dateien — `pl`, `fr` und `cs` tragen dort die **englischen** Dateinamen, also ein **stiller
  EN-Asset-Fallback**, der heute nicht als Lücke erkennbar ist (AP19 mit AP08). Dazu
  **`CONTENT-ASSET CD-8`** (kein Gating-Mechanismus vorhanden, während `DEC-RL-014` mindestens einen
  gated Pfad verlangt — AP19 PT19.3 mit AP22) und `CONTENT-ASSET CD-1` (zwei getrennte
  Download-Welten). _Hinweis: `CRM-INTEGRATION.md` führt eine eigene, gleichnamige `CD-`-Serie —
  Debt-IDs immer mit ihrem Vertrag nennen._
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
- **Historischer PT01.2-Befund `D-16`/`D-17`, inzwischen aufgelöst:** Die drei Vertiefungsseiten sind
  seit AP06 im Footer und seit AP07 im Search sowie vom Epigenetik-Hub verlinkt. Ihre Body-Lokalisierung
  bleibt als `DSI-01`/AP04 `DG-01` bei AP15/AP08 offen.
- **PT01.1 hat keine Baseline-Schuld repariert.** Die 15 Befunde in `AP01-RECONCILIATION-RESULT.md` §8
  sind Evidenz mit Owner-AP, keine AP01-Zusage und keine Freigabe.
- **Keine Toolchain-Festlegung.** Node-/Paketmanager-Pinning ist offen und gehört zu PT01.5.3.

## Required Context for Next Work Package

<!-- Nur Abweichungen/Ergänzungen zu CONTEXT-INDEX.md, plus konkrete Repo-Dateien, die der nächste Lauf braucht. -->

- **Nächster Primärtask ist PT09.3 — Consumer SEO.** AP09 bleibt `IN_PROGRESS`; PT09.1 und PT09.2
  sind `PASS`. Zusätzlich zum normalen AP09-Kontext sind unmittelbar relevant: `SEO-CONTRACT.md`
  §11–§12, die drei Consumer-Seiten, `SEOHead`, Sitemap/G3 und `DG09-01`. PT09.3 darf die zentrale
  AP10-Route-Registry nicht vorziehen. PT09.4, PT09.5,
  AP09-CLOSURE und AP10 bleiben bis zu ihrem jeweiligen seriellen Start unberührt.

- **Nächstes Arbeitspaket ist AP08.** AP07 ist `COMPLETE`, Closure `PASS (43/43)`; AP08 bleibt bis zu
  seinem eigenen Start `NOT STARTED`. PT07.1-Index, PT07.2-SearchModal, PT07.3-Findability sowie
  Section A–D und die offenen `DSI-01`–`DSI-04`/`DLI-01`–`DLI-03` sind der verbindliche Handoff.

- **Nächster Primärtask ist `PT04.3` — Launch-Content-Readiness.** AP04 ist `IN_PROGRESS`.
  Nächstes **Arbeitspaket** bleibt AP05 und ist **nicht** gestartet.
- **Nächster Lauf ist `AP04-CLOSURE`** (`ap04-prompts.md` Prompt 5, korrigierte Fassung mit
  `C04-01`–`C04-32`). Er braucht zusätzlich: `CONTENT-MATRIX.md` §24 (Deferred-Gate-Register),
  §25 (PT04.3) und §26 (PT04.4) · `AP04.md` §11.0/§11.1 (Gate-Modell), §16 (DoD), §17 (Closure-Matrix),
  §19 (Closure-Lauf). Die Closure prüft **AP04-eigene Vollständigkeit und Deferred-Gate-Integrität** —
  ausdrücklich **nicht**, ob AP08/AP15/AP16/AP17/AP19/AP21/AP22 bereits geliefert haben.
- **Historisch — PT04.4 brauchte:** `CONTENT-MATRIX.md` §8 (Downloads),
  §24 (`DG-07`), §25 · `CONTENT-ASSET-CONTRACT.md` §4.5/§4.6/§5.6 · `SEO-CONTRACT.md` für OG-Rollen ·
  `ap04-prompts.md` Prompt 4 inklusive **§19.1 `DEFERRED_ASSET_GATE`**. Echte AP04-Blocker bleiben:
  gebrochene aktive Asset-Referenz, auflösbares Duplikat (`CD-7`), verwaistes launch-störendes Asset,
  falsche READY-Aussage.
- **Historisch — PT04.3 brauchte zusätzlich zum AP04-Kontext:** `building-docs/CONTENT-MATRIX.md` — §15 Launch-Blocker
  `LB-1`–`LB-19` (der Arbeitsvorrat), **§20.3 CTA-Sollzuordnung je Key** (verbindlich), §19.8 `CT-08`
  mit `RN-01`–`RN-08`, §19.10 `CT-10-K1` (Success-Semantik), §10 Sensitive-Register, §12/§13
  Consumer- und Epigenetik-Gaps · `I18N-CONTRACT.md` §6 M-01/M-02/M-03/M-06 (Namespace-Eigentum,
  `de` als Quellsprache, erst lokalisierbar dann übersetzen, Build-Sichtbarkeit) ·
  `LEAD-DATA-CONTRACT.md` §5.1 (Lead-Typen, Benennung entscheidet AP22) · alle zehn Locale-Verzeichnisse ·
  `server/server.js` für Systemmail-Copy. **Kein Design-System-Vorgriff auf AP05.**
- **Abweichung vom `CONTEXT-INDEX.md`-Normalfall in PT04.1:** `IA-INVENTORY.md` ist dort für AP04 nur
  als _optional_ geführt, war aber Pflichtlektüre — ohne §4/§8.4 ist keine Seitenfamilien- und
  CTA-Rollenabdeckung prüfbar. Gleiches gilt für PT04.2–PT04.4.
- Gemäß `CONTEXT-INDEX.md` liest AP04 zusätzlich zu `ALWAYS_READ`: `I18N-CONTRACT.md` ·
  `SEO-CONTRACT.md` · **`CONTENT-ASSET-CONTRACT.md`**; optional bei Anlass `QUALITY-GATES.md` ·
  `ROUTING-CONTRACT.md` · **`IA-INVENTORY.md`**.
- **AP03 liefert AP04 die Arbeitsgrundlage, nicht den Content.** Direkt relevant:
  `IA-INVENTORY.md` §4 (27 Seitenfamilien mit Ziel-/Ist-Sprachumfang), §8.4 (Seitentyp, Zielgruppe,
  Aufgabe, CTA-Rolle je Seite), §9 (sieben Kernjourneys mit CTA- und Conversion-Logik) und §10.13
  (CTA-Findability). Dazu `CONTENT-ASSET-CONTRACT.md` §5 (Domänenmodelle) und CA-11/CA-14 (x10).
- **Für AP04 unmittelbar relevante Schulden aus AP03:** `IAD-12` (Standard-CTA „Angebot anfragen" ist
  heute die Minderheit — 15× „Beratung buchen" gegen 7×, **Gate 9**) · `IAD-13` (Einheits-CTA auf jedem
  Artikel) · `IAD-01`/`IAD-03` (Consumer EN-only, Musterbefunde nur `de`/`en`, **Gate 1**) ·
  `IAD-06`/`IAD-14` (Ressourcen ohne einheitliches Modell und ohne Zugangsklasse).
- **Weiterhin gültig:** `AP01-RECONCILIATION-RESULT.md` §2 Baseline Guards (`BG-01`–`BG-12`), §6 Legacy
  Classification, §7 Toolchain Contract, §8 Known Remaining Debt (`D-01`–`D-30`); die AP02-Verträge
  RT-38–RT-70, R-17–R-53, CA-01–CA-40, LD-27–LD-33, DEP-37–DEP-57; die AP03-IA-Wahrheit
  `IA-INVENTORY.md` mit `IA-01`–`IA-25` und `IAD-01`–`IAD-19`.
- **Nicht durch AP03 abgenommen:** kein Launch-Gate, kein Risiko geschlossen, keine Product Decision neu
  getroffen. Offene Fremdentscheidungen bleiben benannt (Legal-Indexierbarkeit `IAD-05`, AP20 PT20.4.8).
- **ID-Kollisionen beachten:** `CD-` in `CONTENT-ASSET-CONTRACT.md` **und** `CRM-INTEGRATION.md`;
  `RD-` in `RUNTIME-CONTRACT.md` **und** `ROUTING-CONTRACT.md`. IA-Serien: `P-`, `X-`, `N-`, `T-`,
  `J-`, `IAD-`, `IA-`.
- Reproduzierbare Verifikation (unverändert): isolierter Worktree auf HEAD, `npm ci` **im Root und in
  `server/`**, `tsc -b` (mit `--max-old-space-size=3072`), `vitest run`, `npm run build`, dann SSR auf
  isoliertem freiem Port (`NODE_ENV=production PORT=<frei> BACKEND_URL=http://127.0.0.1:39999
npx tsx server.ts`). `NODE_ENV` muss für `npm ci` **ungesetzt** sein. Das Root-`prepare`-Script
  (`lefthook install`) schreibt in die **geteilten** Git-Hooks — vorher sichern, danach zurückspielen
  (`D-13`). **Cold-Render-Regel** (`RUNTIME-CONTRACT.md` M-08) beachten.

## Handoff

- **AP09: `IN_PROGRESS` · PT09.1 und PT09.2 `PASS` (2026-08-27).** SEOHead ist konsolidiert;
  Canonical Host
  `https://polarisdx.net`; x10-hreflang und `x-default=de`; OG/Twitter und 404-SEO-Vertrag PASS;
  Sitemap 39 Families/390 eindeutige x10-URLs, Consumer 3×10, Epigenetics/Befunde x10, dynamische
  Slugs source-derived, honest `lastmod`, XML/G3/CI PASS und Sitemap/noindex-Widersprüche 0.
  Preview-/Dev-Host-Leakage 0. `SEO-CONTRACT.md` ist aktuell. `DG09-01` ist `READY_FOR_OWNER` für AP10
  PT10.3 (kein AP09-Closure-Blocker, Launch-Blocker). Keine zentrale Route Registry gebaut.
  **Next: PT09.3. AP10 bleibt NOT STARTED.**
- **AP07: `COMPLETE` · AP07 Closure: `PASS` (43/43, `C07-01`–`C07-43`)**. PT07.1–PT07.3 alle
  `PASS`; Search Index, SearchModal und Internal Findability sind ready. Die sieben offenen
  `DSI-01`–`DSI-04`/`DLI-01`–`DLI-03` bleiben ownergebunden und ohne False Ready erhalten.
- **Next work package: AP08 — Internationalisierung / 10 Sprachen — NOT STARTED.**
- **AP04: `COMPLETE`** · **AP04 closure: `PASS` (32/32, `C04-01`–`C04-32`)**. PT04.1–PT04.4 alle `PASS`,
  AP04-RECOVERY `PASS`. Content audit: recorded · Content types: standardized · Launch content: recorded ·
  Asset readiness: recorded · Content matrix: final (`CONTENT-MATRIX.md`) · Deferred gates: carried forward.
- **Next work package: AP05 — Sales-Machine Design-System und Light-Theme-Grundlage — NICHT gestartet.**
- **Branch-Zusammenführung 2026-08-25 — `main` trägt jetzt die Relaunch-Linie.** Merge `e9e32be`
  (`-s ours`, Baum unverändert = AP04-Stand) nimmt `main` als zweiten Elternteil auf; die vollständige
  `main`-Historie bleibt erreichbar und ist zusätzlich als Branch **`archive/main-pre-relaunch`**
  (auf `origin`) und Tag `backup/main-f2d5da4` gesichert. **Offener selektiver Import:** `f2d5da4`
  („Future Forum Berlin 2026") ist der einzige `main`-Commit nach `d0fdf29` und wurde **nicht**
  übernommen — Cherry-Pick konfliktiert auf 13 Dateien, weil die Event-Datenmodelle divergiert sind.
  Geführt als **`A26`** in `BRANCH-RECONCILIATION-MAP.md` §19, Owner **AP18**.
- **Betriebsbefund aus dem Preview-Deployment (2026-08-25) — gehört AP28, nicht AP05:**
  `server.ts:775` bindet hart auf `127.0.0.1`. Die Relaunch-Linie ist damit **nicht containerfähig** —
  der Container meldet `healthy` und liefert trotzdem `502`, weil der Prozess hinter dem Docker-Portmapping
  unerreichbar ist. `main` bindet `0.0.0.0`, das Backend nutzt bereits `LISTEN_HOST || '0.0.0.0'`.
  Zusätzlich kollidiert der fest verdrahtete Compose-Port `127.0.0.1:2026` mit dem produktiven
  `polarisdx.net`-vhost. Festgehalten als **`DD-18`/`DD-19`** mit Belegen in
  `DEPLOYMENT-CONTRACT.md` §6.1 und den Nachweisen **`D-T23`–`D-T25`**. Owner **AP28 PT28.2/PT28.4**.
  **`server.ts` ist G3** — nicht nebenbei ändern.
  Der Preview auf `preview.polarisdx.net` läuft als Zwischenlösung mit `network_mode: host` über einen
  Override außerhalb des Repositories; das ist ausdrücklich **kein** Zielzustand (verletzt `DEP-37`).
- **AP05-Handoff — verbindlich:** AP05 darf starten. Die **10 offenen Deferred Gates** `DG-01`–`DG-09`
  sind **nicht** AP05-Aufgaben und dürfen von AP05 weder übernommen noch geschlossen noch als erledigt
  behandelt werden. Ihre Owner sind AP08, AP15, AP16, AP17, AP19, AP20, AP21, AP22 sowie externe
  Fachfreigaben; sie werden vor den Launch-Gates 1, 3, 4 und 6 abgenommen. Das Design-System hängt an
  keinem dieser Gates (`C04-32`, `MASTER-SCOPE.md` §7 führt keine Abhängigkeit „Content x10 →
  Design-Fundament").
- **AP04 darf weiterhin nicht auf `COMPLETE` gesetzt werden**, solange PT04.3, PT04.4 und die Closure
  nicht gelaufen sind. Die Recovery hat **kein** PT-Ergebnis vorweggenommen.
- **AP05: NOT STARTED.** AP04-Closure ist nicht gelaufen und AP04 ist nicht `COMPLETE`.
- **AP06: NOT STARTED.** Vorgänger AP05 ist `COMPLETE`, Closure `PASS` — AP06 ist freigegeben, aber nicht begonnen.
- **AP03: `COMPLETE`** · **AP03 closure: `PASS` (24/24, `C03-01`–`C03-24`)** · Last completed PT of AP03:
  **PT03.4**. Alle vier Primärtasks PT03.1–PT03.4 sind `PASS`.
- **AP02: `COMPLETE`** · **AP02 closure: `PASS` (23/23, `C02-01`–`C02-23`)** — unverändert erhalten.
- **AP01: `COMPLETE`** · AP01 closure: `PASS` (43/43) · **AP00: `COMPLETE`**, Closure `PASS` — beide
  unverändert erhalten
- Decision Locks: **18/18 `LOCKED`**, durch PT02.1–PT02.5, den AP02-Closure-Lauf, PT03.1–PT03.4 und
  **PT04.1**, **PT04.2** und **PT04.3** unverändert;
  `MASTER-SCOPE.md`, `DECISIONS.md`, `PROJECT-CONSTRAINTS.md` und `SCOPE-CHANGELOG.md` sind im gesamten
  AP02-Delta **unberührt**. Baseline
  `feat/home-leadmagnet@961f65d` bleibt gesperrt und ist Ancestor des HEAD.

Kanonische Ausführungsevidenz AP01: **`building-docs/AP01-RECONCILIATION-RESULT.md`** (§1–§9).
Kanonische Ausführungsevidenz PT02.1: **`building-docs/RUNTIME-CONTRACT.md`** · PT02.2:
**`building-docs/ROUTING-CONTRACT.md`** · PT02.3: **`building-docs/CONTENT-ASSET-CONTRACT.md`** ·
PT02.4: **`LEAD-DATA-CONTRACT.md`** (Hub, §2.1/§3.1) mit `BACKEND-API-CONTRACT.md`,
`LEAD-DELIVERY-CONTRACT.md` und `CRM-INTEGRATION.md` · PT02.5: **`DEPLOYMENT-CONTRACT.md`** · PT03.1–PT03.4:
**`building-docs/IA-INVENTORY.md`** · **PT04.1: `building-docs/CONTENT-MATRIX.md`** — das jeweilige
Artefakt ist der Nachweis; ein zweiter Report wird dafür nicht angelegt.

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

Was PT02.3 hergestellt hat:

- **Ist/Soll getrennt:** §3.1 klassifiziert den realen Content-/Asset-Bestand (A–H) samt fünf
  strukturell entscheidenden Befunden — Asset-Identität in Übersetzungsdateien, kein Gating, zwei
  Download-Kataloge, lokalisierte Datums-Strings, fehlende Consumer-OG-Bilder.
- **Zielvertrag CA-01–CA-40:** vier Schichten mit getrennter Verantwortung, stabile fachliche Identität
  getrennt vom Slug, strukturierte Werte statt vorformatierter Texte, i18n-Grenze, route-spezifisch
  ladbare Spezialinhalte, prüfbare Asset-Referenzen, explizit modellierte Sprachvarianten,
  PUBLIC/GATED, Security-/Privacy-Grenzen und eine klare CMS-Abgrenzung.
- **Domänenmodelle §5:** Musterbefund, Artikel, Service, Event und Resource/Download, dazu die Grenze
  Content ↔ Route Registry (§5.1) und Content ↔ SEO (§5.7). `events.ts` ist als Vorbild benannt.
- **Testbarkeit:** `CA-T1`–`CA-T14`, Zuordnung der geforderten `CONTENT-01`–`CONTENT-16` auf die
  `CA-`-Konvention (§9.1), Regeln `CM-01`–`CM-06`, Owner-Grenzen §11.
- **Schulden statt Reparaturen:** `CD-1`–`CD-10`, jede mit Owner-AP. **Keine** wurde behoben; sprachliche
  Lücken bleiben in `I18N-CONTRACT.md` §5 geführt statt dupliziert.

Was PT02.4 hergestellt hat:

- **Kein fünftes Dokument.** Die Lead-/Backend-Domäne besaß bereits vier kanonische Verträge; PT02.4 hat
  sie gegen den realen Stand geprüft, die Lücken geschlossen und mit **§2.1 (Vertragslandkarte)** einen
  eindeutigen Einstieg geschaffen.
- **Ist/Soll getrennt:** §3.1 misst den Backend-Ist-Zustand (A–K) — fünf Endpunkte, keine Persistenz,
  kein CRM, keine Queue, Erfolg = „SendGrid hat angenommen". Die Messung bestätigt die dokumentierte
  Schuld und fand **keine neue**.
- **Geschlossene Lücken:** LD-27 (Systemgrenzen inkl. Browser-Speicher), LD-28 (Deduplication ≠
  Idempotenz), LD-29 (`TBD_OWNER_LEGAL` statt erfundener Frist), LD-30 (Löschkonsistenz über Jobs,
  Dead-Letter und Sicherungen), LD-31 (kein Chat im Zielmodell), LD-32/LD-33 (Anbieterneutralität),
  API-21–API-23 (keine sensiblen Daten in der URL, Origin-/CORS-/CSRF-Entscheidung je Endpunkt, kein
  offener Relay).
- **Testbarkeit:** §9.1 ordnet die geforderten `LEAD-01`–`LEAD-22` auf die vier bestehenden
  ID-Systematiken zu, ohne eine fünfte einzuführen.

Was PT03.3 hergestellt hat:

- **Sieben Kernjourneys `J-01`–`J-07`** (§9.2) mit Zielgruppe, Startpunkten, Zwischenstationen,
  Seitenfamilien, primärer und sekundärer Conversion, AP02-Lead-Typ, Success-/Failure-State,
  Crosslinks, Sprachumfang und Owner-APs.
- **Gemeinsame Journey-Regeln** (§9.1): Lead-Ziel Persistenz + CRM statt Mail-only, Consent-Grenze ohne
  Tracking-Vorgriff, zehn Locales, CTA-Naming, konzeptionelle Failure-Zustände.
- **Sackgassenanalyse** (§9.4): `J-05` existiert heute gar nicht (kein Gate), `J-03` ist im Einstieg
  verengt und ohne eigene Inquiry, `J-04` endet im Einheits-CTA, `J-06` ist sprachlich blockiert.
  Jede Lücke mit Debt-ID und Owner-AP, keine behoben.

Was PT03.4 hergestellt hat:

- **Header-IA** (§10.3) mit sieben Slots plus Sales-CTA, Search und Language Switcher; **Epigenetik als
  eigener Hauptnavigationspunkt** (§10.5), Diagnostik davon getrennt (§10.4).
- **Footer-IA** (§10.7) mit verbindlichem Epigenetik- und Support-Einstieg.
- **Consumer-Findability** (§10.8): bewusst kein B2B-Hauptmenüpunkt, dafür vier benannte Kanäle.
- **Search-, Breadcrumb-, ChapterNav- und Crosslink-Policy** (§10.9–§10.12) inklusive
  Ergebniskategorien, fachlicher Breadcrumb-Hierarchien, ChapterNav-Eignungskriterien und einer
  ausdrücklichen Absage an SEO-Linkfarmen.
- **Finale Klassifikationsmatrix §10.15** über alle 27 Seitenfamilien — sieben Spalten, keine offene
  Klassifikation; sie löst die vorläufigen Werte aus §8.6 ab.
- **Locale-sichere Verlinkung** (§10.14) und Redirect-/404-Findability (§10.16).

Was AP03 an AP04 und die späteren Owner übergibt (`AP03.md` §19):

- vollständiges kanonisches IA-Inventar · Seitentyp-Taxonomie · Zielgruppen-/Aufgaben-/CTA-Matrix ·
  Sprachumfang je Seitenfamilie · Navigations-/Findability-Matrix · sieben Kernjourneys · Epigenetik als
  eigene Säule · Consumer als 10-sprachigen SEO-Bereich · gated Secondary-Conversion-Journey ·
  allgemeines CTA-Naming · Breadcrumb-/ChapterNav-Regeln · Search-/Crosslink-Zielrollen ·
  `IAD-01`–`IAD-19` mit Owner-AP.
- **AP03 übergibt keine** implementierte Navigation, keine neuen Routen, keine Search-Änderung, keine
  Übersetzung und keine umgebaute Seite.
- Spätere Owner: AP04 (Content), AP06 (Navigation), AP07 (Search), AP08 (10 Sprachen), AP09 (SEO),
  AP10 (Routing), AP11–AP21 (Seiten), AP22 (Lead), AP27 (Guards).

Was PT03.2 hergestellt hat:

- **Zehn primäre Seitentypen** `T1`–`T10` aus `MASTER-SCOPE.md` AP03 PT03.2, plus eine getrennte
  technische Klassifikation für Redirect Sources, 404 und technische Pfade (§8.1/§8.5).
- **Rollenmodell je Typ** (§8.2): Zielgruppe, Absicht, Aufgabe, primärer und zulässige sekundäre CTAs,
  typische Einstiege und nächste Schritte, Conversion-Rolle, Owner-AP.
- **Rollenmatrix über alle 27 logischen Seiten** (§8.4): genau ein primärer Typ je Seite, keine
  `UNCLASSIFIED`; dazu Zielgruppe, Absicht, Aufgabe, primärer und sekundärer CTA sowie Conversion-Rolle
  mit AP02-Lead-Typ.
- **Kontrollierte Vokabulare** (§8.3) statt Ad-hoc-Begriffen: 5 Zielgruppen, 11 Absichten, 9 Aufgaben,
  12 CTA-Rollen, 4 Conversion-Rollen.
- **Bewusste Entscheidungen statt URL-Automatik:** S3-Leitlinie und Vitamin-D3-Implantologie sind
  `knowledge-landing` und **keine** Service-Details; der B2B-Vitamin-D3-Spray ist `T4` und **nicht**
  die Consumer-Familie; Support trägt **keinen** Sales-CTA; Legal trägt bewusst `NONE`.
- **Schulden statt Reparaturen:** `IAD-12`–`IAD-14`, jede mit Owner-AP und Gate-Bezug. **Keine**
  wurde behoben.

Was PT03.1 hergestellt hat:

- **Ein kanonisches IA-Artefakt**, weil keines existierte (`AP03.md` §5.1/§5.2): `IA-INVENTORY.md`.
  Es ersetzt die Route Registry **nicht** — Pfade, Locale-Policy und Status bleiben
  `ROUTING-CONTRACT.md` (§5.3 dort).
- **Vollständiges Inventar (§4–§7):** 27 Seitenfamilien und Rollen `P-01`–`P-27`, dazu 6 Redirect
  Sources `X-01`–`X-06`, der Not-Found-Zustand `N-01` und 6 technische Pfadklassen `T-01`–`T-06`.
  Pflichtabdeckung erfüllt: 10 Hauptseiten · 9 Diagnostik-Services · IglooPro · Epigenetik-Hub +
  3 Vertiefungen · 6 Musterbefunde · 6 Artikel · Events · Downloads/Resources · 3 Consumer-Familien ·
  About/Contact/Support/Legal · 3 Spezialseiten · Legacy/Redirects · 404 · technische Abgrenzung.
- **CURRENT und TARGET getrennt** über `PRESENT`/`PARTIAL`/`PLANNED`/`LEGACY`/`REDIRECT_SOURCE`/
  `TECHNICAL`/`NOT_FOUND`; aus keinem Ist-Mangel wurde eine Product Decision abgeleitet.
- **Route Pattern und Ressource getrennt** (§2.3): 9 Services, 6 Musterbefunde, 6 Artikel als
  Ressourcen ihrer fachlichen Quelle; Events sind Inhalt der Seite, keine eigene Route.
- **Schulden statt Reparaturen:** `IAD-01`–`IAD-11`, jede mit Owner-AP und Launch-Gate-Bezug. **Keine**
  wurde behoben.

Verbindlicher Rahmen für PT03.2:

- **PT03.2 erweitert `IA-INVENTORY.md` §8**, es legt kein zweites IA-Dokument an.
- Zu füllen sind `IA-03`–`IA-07`; die Arbeitsliste sind die Zeilen mit `TO_BE_FINALIZED_PT03.2`.
- Journeys (PT03.3) und Navigation/Findability (PT03.4) bleiben unberührt.

Was PT02.5 hergestellt hat:

- **Ist/Soll getrennt:** §3.1 misst den Betriebs-Ist-Zustand ohne Dienststart und ohne Secret-Zugriff.
  Von `REST-01` sind heute Docker/Compose, Reverse Proxy davor, Restart Policies und Secrets außerhalb
  des Images erfüllt — **nicht** Persistenz, Backupfähigkeit, vollständige Healthchecks, Monitoring und
  image-basiertes Rollback.
- **Geschlossene Lücken:** DEP-37–DEP-40 (privates Netz, keine unnötige Exposition), DEP-41–DEP-45
  (Proxy-Detailvertrag inkl. Forwarded-Header und `no-store`-Verträglichkeit, keine SPA-Konfiguration als
  Produktionswahrheit), DEP-46–DEP-49 (anwendungsnahe Gesundheit, Readiness ≠ Startreihenfolge, keine
  Nebenwirkungen), DEP-50–DEP-53 (strukturierte, datensparsame, korrelierbare Logs), DEP-54–DEP-57
  (Legacy ist keine Wahrheit, Docker/Compose-Grenze, Anbieterneutralität, Allowlist-Bezug).
- **Ausfallmodi §5.6:** zwölf Fälle vom Web-Ausfall bis zum überfälligen Restore-Test, jeweils mit
  Erkennung und erwarteter Antwort der Architektur.
- **Schulden statt Reparaturen:** `DD-15`–`DD-17` neu, `DD-1`–`DD-14` bestätigt. **Keine** behoben.

Verbindlicher Rahmen für `AP02-CLOSURE`:

- Die Closure ist **Validator, kein Primärtask**: sie prüft den realen Repository-Zustand, nicht die
  Reports — Vorbild ist `AP01-RECONCILIATION-RESULT.md` §9.
- **AP02 darf erst durch die Closure `COMPLETE` werden.** Bis dahin bleibt der Status `IN_PROGRESS`.
- **AP03 bleibt gesperrt**, bis die Closure `PASS` meldet.

- **Die Content-/Lead-Grenze aus PT02.3 ist eingelöst:** die Ressource kennt Zugangsklasse und
  Resource-ID (`CONTENT-ASSET-CONTRACT.md` CA-30/CA-33/CA-34), die Lead-Seite kennt Entitlement,
  Persistenz und Zustellung (`LEAD-DELIVERY-CONTRACT.md` LDV-24, `BACKEND-API-CONTRACT.md` §5.1).
  `DEC-RL-014` verlangt weiterhin mindestens einen gated Pfad; gebaut ist keiner.
- AP02 bleibt Zielbild-Arbeit: es beschreibt die Architektur, es implementiert sie nicht.

Durchgehend gültig: `BG-01`–`BG-12` gelten weiter; `REST-03`, `DEC-RL-005` und `DEC-RL-006` sind durch
PT02.1–PT02.3 bestätigt und nicht aufgeweicht. Der SSR-Vertrag verlangt eine **renderunabhängige**
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
