# AP Execution State

**Globaler serieller Handoff für alle Arbeitspakete AP00–AP33. Es gibt genau diese eine State-Datei.**
Keine zweite State-Struktur anlegen (kein `execution/APxx/STATE.md`, kein `state/APxx.md`,
kein `work-packages/APxx-STATE.md`).

---

## Current

- Work package: AP04 — Content-Strategie, Content-Modell und Launch-Content-Readiness
- Status: COMPLETE <!-- NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE -->
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
- AP05: NOT STARTED
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
- Current branch: `console/4-2026-08-24T14-54-30`
- Current HEAD: `186bc414cd449159b4df0213e72c648f6dc40b1e` — Merge der AP03-Linie in
  `feat/home-leadmagnet`, remote gesichert als `origin/feat/home-leadmagnet`; enthält den
  AP01-Final-HEAD `3736d1a` als Ancestor. AP02-Delta `3736d1a..fffd712` = **0
  Nicht-Dokumentationsdateien**; AP03 setzt diese Linie fort und ändert ebenfalls nur `building-docs/`
- Started: 2026-08-24 (AP02); AP01 gestartet und abgeschlossen 2026-08-24
- Last updated: 2026-08-25 (AP04-CLOSURE, PASS)

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
- **Die drei Vertiefungsseiten sind nicht in Navigation, Footer oder Suchindex eingebunden**
  (`D-16`, `D-17`) — das ist AP03/AP06/AP07/AP15.
- **PT01.1 hat keine Baseline-Schuld repariert.** Die 15 Befunde in `AP01-RECONCILIATION-RESULT.md` §8
  sind Evidenz mit Owner-AP, keine AP01-Zusage und keine Freigabe.
- **Keine Toolchain-Festlegung.** Node-/Paketmanager-Pinning ist offen und gehört zu PT01.5.3.

## Required Context for Next Work Package

<!-- Nur Abweichungen/Ergänzungen zu CONTEXT-INDEX.md, plus konkrete Repo-Dateien, die der nächste Lauf braucht. -->

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

- **AP04: `COMPLETE`** · **AP04 closure: `PASS` (32/32, `C04-01`–`C04-32`)**. PT04.1–PT04.4 alle `PASS`,
  AP04-RECOVERY `PASS`. Content audit: recorded · Content types: standardized · Launch content: recorded ·
  Asset readiness: recorded · Content matrix: final (`CONTENT-MATRIX.md`) · Deferred gates: carried forward.
- **Next work package: AP05 — Sales-Machine Design-System und Light-Theme-Grundlage — NICHT gestartet.**
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
- **AP06: NOT STARTED.** Vorgänger AP05 ist nicht gelaufen.
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
