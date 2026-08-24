# PolarisDX Relaunch — Live Quality Baseline

> **Gemessener Ist-Zustand, 2026-08-21**, gegen die gesperrte Baseline `feat/home-leadmagnet@961f65d`.
> Jede Zahl unten stammt aus einem tatsächlich ausgeführten Kommando, nicht aus Dokumentation.
>
> Es wurde **nichts repariert**. Quellcode, Konfiguration, Dependencies, Lockfiles, Branches, Commits,
> Deployments und die kanonischen `building-docs/`-Dokumente sind unverändert; `git status` vor und nach
> dem Lauf ist byte-identisch (§3.3). Nichts wurde gestaged, committet oder gepusht. Kein Formular wurde
> abgesendet, kein Dienst neu gestartet. Keine Secret-Werte werden wiedergegeben.

---

## 1. Executive Summary

**Sieben Qualitätskommandos ausgeführt: 4 PASS · 2 FAIL · 1 BLOCKED_ENVIRONMENT.**

| Kommando               | Ergebnis                                          | Exit | Dauer  |
| ---------------------- | ------------------------------------------------- | ---- | ------ |
| `npm run typecheck`    | **PASS**                                          | 0    | ~4 s   |
| `npm test`             | **PASS** — 7 Dateien, **18/18 Tests grün**        | 0    | 3,0 s  |
| `npm run build`        | **PASS** — Client + SSR, keine Warnungen          | 0    | 7,8 s  |
| `npm run check:colors` | **PASS**                                          | 0    | 0,3 s  |
| `npm run lint`         | **FAIL** — 129 Probleme (125 Fehler, 4 Warnungen) | 1    | 15,5 s |
| `npm run format:check` | **FAIL** — 58 Dateien                             | 1    | 15,8 s |
| `npm run test:e2e`     | **BLOCKED_ENVIRONMENT** — Portkonflikt (§13)      | —    | —      |

**Die wichtigste Einzelkorrektur an einer früheren Feststellung dieser Analysekette:**
`npm test` **läuft und ist vollständig grün**. Die in `BACKEND-LEAD-CURRENT-STATE.md` §16 und in der
Repository-Memory `sandbox-runtime-gates-blocked` vermerkte Aussage „vitest ist in dieser Umgebung
blockiert" ist **falsch**. Der damalige Fehlschlag entstand durch meinen eigenen Aufrufparameter
`--reporter=basic` — diesen Reporter gibt es in Vitest 4 nicht. Beweis in §9.2:
`Failed to load url basic`. Ohne den Parameter laufen dieselben Tests in 649 ms durch.
**Es gibt keine Sandbox-Einschränkung für Vitest in diesem Repository.**

**Die beiden echten Fehlschläge sind fast vollständig Altlast außerhalb des Anwendungscodes:**

- **ESLint: 111 der 129 Probleme (86 %) liegen in `_project-knowledge/`** — dem archivierten
  Quellcode-Schnappschuss, den `eslint.config.js` nicht ignoriert (`globalIgnores(['dist'])`). Da
  `tsconfig.app.json` nur `["src"]` einschließt, kann der TypeScript-Resolver die Imports des Archivs
  nicht auflösen ⇒ 92 × `import/no-unresolved`. **Im echten Anwendungscode stehen nur 18 Probleme**
  (17 in `src/`, 1 in `server.ts`).
- **Prettier: 22 der 58 Dateien sind untracked** — 11 davon `projektverzeichnis/`, 6 die Dokumente
  dieser Analysekette selbst. Von den 36 getrackten Dateien sind **20 Wireframe-HTML** und nur **4**
  echter Quellcode.

**Weitere Kernbefunde:**

- **CI hat die gesperrte Baseline nie gegatet und konnte es nie.** `.github/workflows/ci.yml` triggert
  ausschließlich auf `main`; `feat/home-leadmagnet` existiert **nicht auf `origin`**. Die frühere
  Feststellung ist **bestätigt** (§14).
- **`npm run test:e2e` würde auf diesem Host gegen eine fremde Anwendung laufen.** `playwright.config.ts`
  setzt `reuseExistingServer: !process.env.CI`; auf Port 3000 läuft der Container
  `phoenix-assay-pro-web-1` („Phoenix Assay Pro | IVD Validation Platform"). Playwright würde ihn
  wiederverwenden statt die Site zu starten (§13.1).
- **Ersatzmessung ausgeführt** (§13.3): SSR-Server auf freiem Port 9310, 40 read-only HTTP-Prüfungen.
  Ergebnis: **alle 25 geprüften Routen 200**, **echte 404** für unbekannte Pfade _und_ unbekannte
  Artikel-Slugs, **echte 301** für `/agb` und `/s3-leitlinie` in einem Hop, **alle 10 Sprachen 200**,
  Sitemap mit **335 URLs und 3 630 hreflang-Einträgen**, `Cache-Control: no-store` gesetzt.
- **Drei Master-Scope-Altlasten sind jetzt gemessen statt gelesen:** `/de/services` antwortet **200**
  statt einer echten 301-Brücke (Altlast 1); die Sitemap trägt **genau einen** `lastmod`-Wert — das
  heutige Datum (Altlast 5); **30 Legal-Einträge** (3 Seiten × 10 Sprachen) stehen in der Sitemap und
  sind zugleich `noindex` (Altlast 4).
- **Der Build bestätigt die dokumentierte Chunk-Altlast:** `MusterbefundPage-*.js` = **287,29 kB roh /
  77,91 kB gzip** — exakt der Wert, den `BRANCH-RECONCILIATION-MAP.md` A5/A7 zu beheben vorsieht.

**Klassifikation: QUALITY_BASELINE_READY_WITH_WARNINGS** (§23). Die Messung ist vollständig und
aussagekräftig; die Warnungen betreffen den gemessenen Zustand, nicht die Messbarkeit.

---

## 2. Scope and Authority

Gelesen in der Reihenfolge aus `building-docs/PROJECT-CONSTRAINTS.md`:

1. `building-docs/AGENT-CONTRACT.md` — Regel 12/13 (Git-Sicherheit, keine destruktiven Operationen),
   Regel 14 (kein Commit/Push/Staging), Regel 15 (fremde Änderungen unangetastet), Regel 16 (keine
   Secret-Werte), Regel 18 (keine produktiven Side Effects).
2. `building-docs/PROJECT-CONSTRAINTS.md` — Autoritätsreihenfolge; Baseline `feat/home-leadmagnet@961f65d`.
3. `building-docs/scope/MASTER-SCOPE.md` — **AP01** (PT01.5 Toolchain-/Dependency-Audit), **AP05**
   (PT05.1.9 Token-Guard in CI), **AP08** (PT08.3.5 i18n-Guard in CI), **AP09** (PT09.1.8, PT09.2.8),
   **AP10** (PT10.3, PT10.4), **AP23** (PT23.1, PT23.4.3), **AP24** (PT24.6), **AP25** (PT25.5.7),
   **AP26** (PT26.5), **AP27** (PT27.1–PT27.6 vollständig), **AP28** (PT28.2.7), **AP30** (PT30.4, PT30.5).
4. Aktuelle Repository-Evidenz — Kommandoausgaben, hier zusammengefasst mit Exit-Codes und Zählungen.
5. `building-docs/REPO-BASELINE.md`, `IMPLEMENTATION-HOTSPOTS.md`,
   `BACKEND-LEAD-CURRENT-STATE.md`, `CONSENT-TRACKING-NETWORK-BASELINE.md`.

**Ist/Soll-Trennung:** §3–§16 und §18–§21 berichten ausschließlich Gemessenes. §17 stellt das Gemessene
den Master-Scope-Anforderungen gegenüber. **Keine Master-Scope-Zielanforderung wird als umgesetzt
berichtet.**

---

## 3. Repository State

### 3.1 Vor dem Lauf

```
$ git branch --show-current   →  feat/home-leadmagnet
$ git rev-parse HEAD          →  961f65d456e2790e7063d1a6575651dff724e4ca
```

| Prüfung                                                 | Ergebnis |
| ------------------------------------------------------- | -------- |
| HEAD == `961f65d456e2790e7063d1a6575651dff724e4ca`      | ✅       |
| `src/pages/EpigeneticsPage.tsx` dirty vorhanden (+5/−1) | ✅       |
| `building-docs/` vorhanden                              | ✅       |
| `projektverzeichnis/` vorhanden (11 Dateien)            | ✅       |

`git status --porcelain=v1 -uall` vor dem Lauf: **1 modifizierte getrackte Datei**
(`src/pages/EpigeneticsPage.tsx`), **24 untracked Einträge** (6 Analysedokumente, das Master-Scope-Quelldokument,
7 × `building-docs/`, 11 × `projektverzeichnis/`). Staging-Bereich leer.

### 3.2 Laufende Dienste — vor und nach dem Lauf identisch

| Port             | Was                                                                                     | Betroffen?         |
| ---------------- | --------------------------------------------------------------------------------------- | ------------------ |
| `127.0.0.1:2026` | Container `01polaris-frontend-1` (up 43 h, healthy) — serviert `/app/dist` **im Image** | **nein**           |
| `127.0.0.1:5000` | Container `01polaris-backend-1` (up 45 h)                                               | **nein**           |
| `127.0.0.1:3000` | Container `phoenix-assay-pro-web-1` — **fremdes Projekt**                               | nein (nur gelesen) |
| `127.0.0.1:9100` | Preview-SSR — **läuft derzeit nicht**                                                   | n/a                |

**Kein Host-Prozess serviert das `dist/` dieses Repositories.** Die laufende Produktion liest ihr `dist/`
aus dem Docker-Image, nicht vom Host — belegt durch die Prozesspfade `/app/node_modules/.bin/tsx`.
Der Build in §11 konnte deshalb keinen laufenden Dienst beeinflussen.

### 3.3 Nach dem Lauf

```
$ diff <pre-run status> <post-run status>
→ IDENTICAL — no file added, removed or modified by this audit
$ git rev-parse HEAD  →  961f65d456e2790e7063d1a6575651dff724e4ca
```

Einzelprüfung der Konfigurationsdateien — alle `unchanged`: `package.json`, `package-lock.json`,
`server/package.json`, `server/package-lock.json`, `vitest.config.ts`, `playwright.config.ts`,
`eslint.config.js`, `lefthook.yml`, `.github/workflows/ci.yml`, `tsconfig.app.json`.
`server/.env`: mtime unverändert 2026-06-30 12:04, 322 Bytes — **nicht gelesen**.

**Einzige Zustandsänderung im Dateisystem:** der gitignorierte Build-Ordner `dist/` (§11.3).

---

## 4. Runtime / Toolchain

| Element                                      | Wert                        |
| -------------------------------------------- | --------------------------- |
| Node (lokal, alle Läufe)                     | **v20.19.6**                |
| npm                                          | 10.8.2                      |
| `package.json` → `engines`                   | **null — nicht deklariert** |
| `package.json` → `packageManager`            | **null — nicht gepinnt**    |
| CI Node (`ci.yml`)                           | **22**                      |
| Docker Node (`Dockerfile`, `Dockerfile.dev`) | **22-alpine**               |
| Vite                                         | 7.2.4                       |
| Vitest                                       | 4.1.5                       |
| TypeScript                                   | 5.9.3                       |
| Playwright                                   | 1.57.0 (Chromium verfügbar) |

Alle Messungen dieses Dokuments liefen unter **Node 20.19.6**. Zur Bewertung der Drift siehe §18.

---

## 5. Active Quality Commands

Aus `package.json`, nicht aus Dokumentation abgeleitet:

| Script                          | Kommando                              | In CI?                           | In lefthook?                           |
| ------------------------------- | ------------------------------------- | -------------------------------- | -------------------------------------- |
| `typecheck`                     | `tsc -b`                              | ✅ (als `npx tsc -b --noEmit`)   | ✅                                     |
| `lint`                          | `eslint .`                            | ✅                               | ✅ (aber `--fix` auf staged files)     |
| `format:check`                  | `prettier --check .`                  | ✅                               | ✅ (aber `--write` auf staged files)   |
| `test`                          | `vitest run --reporter=default`       | ✅                               | ❌                                     |
| `build`                         | `build:client && build:server`        | ✅                               | ❌                                     |
| `check:colors`                  | `node scripts/check-color-tokens.mjs` | ❌ **nicht in CI**               | ✅                                     |
| `test:e2e`                      | `playwright test`                     | ✅ (nur `e2e/url-smoke.spec.ts`) | ❌                                     |
| `format`                        | `prettier --write .`                  | —                                | **nicht ausgeführt** (mutiert Dateien) |
| `prerender` / `build:prerender` | `scripts/prerender.mjs`               | ❌                               | ❌                                     |

**Backend:** `server/package.json` enthält **nur** `start` und `dev` — **kein Testkommando**. Der einzige
Backend-Test (`server/server.test.js`) wird von der Root-Suite mitgezogen (§10).

Weitere Konfiguration: `vitest.config.ts` (`environment: 'jsdom'`, `setupFiles: ./src/test/setup.ts`,
`include: ['src/**/*.{test,spec}.{ts,tsx}', 'server/**/*.{test,spec}.{js,ts}']`);
`eslint.config.js` (flat config, 7 extends, `globalIgnores(['dist'])`, TS-Resolver auf `tsconfig.app.json`).

---

## 6. TypeScript

```
$ npm run typecheck        # tsc -b
EXIT = 0
```

| Metrik               | Wert     |
| -------------------- | -------- |
| Ergebnis             | **PASS** |
| Exit-Code            | 0        |
| Dauer                | ~4 s     |
| Fehler (`error TS…`) | **0**    |
| Betroffene Dateien   | **0**    |

Keine Ausgabe außer dem npm-Banner. Das Projekt typisiert unter Node 20 sauber durch — **einschließlich
der uncommitteten Änderung** in `src/pages/EpigeneticsPage.tsx`.

`tsc -b` nutzt die Projekt-Referenzen aus `tsconfig.json`; `tsconfig.app.json` schließt ausschließlich
`["src"]` ein. **`_project-knowledge/` wird nicht typgeprüft** — der Grund, warum Typecheck grün ist,
während ESLint dort 111 Probleme meldet (§7).

---

## 7. ESLint

```
$ npm run lint             # eslint .
EXIT = 1
✖ 129 problems (125 errors, 4 warnings)
```

| Metrik               | Wert     |
| -------------------- | -------- |
| Ergebnis             | **FAIL** |
| Exit-Code            | 1        |
| Dauer                | 15,5 s   |
| **Fehler**           | **125**  |
| **Warnungen**        | **4**    |
| Dateien mit Befunden | 69       |

### 7.1 Verteilung — der entscheidende Befund

| Bereich                                           | Probleme | Anteil   |
| ------------------------------------------------- | -------- | -------- |
| **`_project-knowledge/`** (archivierter Snapshot) | **111**  | **86 %** |
| `src/` (echter Anwendungscode)                    | **17**   | 13 %     |
| `server.ts`                                       | **1**    | 1 %      |

### 7.2 Regelverteilung

| Regel                                  | Anzahl                   | Wo                                        |
| -------------------------------------- | ------------------------ | ----------------------------------------- |
| `import/no-unresolved`                 | **92**                   | fast ausschließlich `_project-knowledge/` |
| `react-hooks/set-state-in-effect`      | 11                       | gemischt                                  |
| `react-refresh/only-export-components` | 6                        | gemischt                                  |
| `react-hooks/refs`                     | 4                        | gemischt                                  |
| `react-hooks/exhaustive-deps`          | 4 (**alle 4 Warnungen**) | gemischt                                  |
| `jsx-a11y/no-redundant-roles`          | 2                        | `src/`                                    |
| `@typescript-eslint/no-unused-vars`    | 2                        | inkl. `server.ts`                         |
| `@typescript-eslint/no-explicit-any`   | 2                        | `src/`                                    |
| `jsx-a11y/anchor-has-content`          | 1                        | `src/pages/AboutPage.tsx:244`             |

### 7.3 Ursache der 92 `import/no-unresolved`

Nicht ein fehlender Resolver — der ist installiert und korrekt konfiguriert:
`eslint-import-resolver-typescript@^3.10.1` ist in `devDependencies` **und** in `node_modules` vorhanden,
und `eslint.config.js` setzt `'import/resolver': { typescript: { project: './tsconfig.app.json' } }`.
Der Kommentar dort hält fest, dass genau diese Einstellung frühere repo-weite Falschmeldungen behob.

Die Ursache ist die **Kombination zweier Konfigurationsentscheidungen**:
`eslint.config.js` ignoriert nur `dist` — `_project-knowledge/` wird also gelintet;
`tsconfig.app.json` schließt nur `src` ein — der Resolver kennt die Archivdateien also nicht.
Die Archivdateien importieren zudem Pfade, die es dort nie gab (`./routes/HomePage`, `../../lib/utils`, …).

**Das ist Konfigurations-Altlast, kein Anwendungsdefekt.** Sie deckt sich mit
`AGENT-CONTRACT.md` Regel 4 (`_project-knowledge/` ist ein Archiv, keine Live-Quelle) und mit
AP01 PT01.4.4 („Stale Tier-4-Dokumentation markieren").

### 7.4 Die 18 Probleme im echten Anwendungscode

| Datei:Zeile                                          | Regel                                         |
| ---------------------------------------------------- | --------------------------------------------- |
| `server.ts:749`                                      | `no-unused-vars` (`_next`)                    |
| `src/components/layout/Header.tsx:131`               | `exhaustive-deps` _(Warnung)_                 |
| `src/components/sections/HeroSection.tsx:71`         | `jsx-a11y/no-redundant-roles`                 |
| `src/components/sections/HeroSection.tsx:106`        | `react-hooks/refs` — Refs während des Renders |
| `src/components/sections/TestimonialsSection.tsx:42` | `set-state-in-effect`                         |
| `src/components/sections/TestimonialsSection.tsx:61` | `jsx-a11y/no-redundant-roles`                 |
| `src/components/ui/Button.tsx:53`                    | `no-explicit-any`                             |
| `src/components/ui/Button.tsx:85`                    | `only-export-components`                      |
| `src/components/ui/LanguageSwitcher.tsx:58`          | `react-hooks` — Wert nicht modifizierbar      |
| `src/components/ui/Reveal.tsx:47`                    | `set-state-in-effect`                         |
| `src/components/ui/SearchModal.tsx:37`               | `set-state-in-effect`                         |
| `src/components/ui/Textarea.tsx:77`                  | `only-export-components`                      |
| `src/hooks/useHeroSlider.ts:85`                      | `set-state-in-effect`                         |
| `src/hooks/useSearch.ts:97`                          | `set-state-in-effect`                         |
| `src/pages/AboutPage.tsx:244`                        | `jsx-a11y/anchor-has-content`                 |
| `src/pages/EventsPage.tsx:168`                       | `exhaustive-deps` _(Warnung)_                 |
| `src/pages/consumer/OrderModal.tsx:53`               | `only-export-components`                      |
| `src/pages/consumer/PriceBadge.tsx:157`              | `set-state-in-effect`                         |

Zwei davon (`jsx-a11y/no-redundant-roles` ×2, `anchor-has-content`) sind Accessibility-Befunde und
gehören fachlich zu AP24. **Nichts wurde behoben.**

---

## 8. Prettier

```
$ npm run format:check     # prettier --check .
EXIT = 1
Code style issues found in 58 files.
```

| Metrik    | Wert     |
| --------- | -------- |
| Ergebnis  | **FAIL** |
| Exit-Code | 1        |
| Dauer     | 15,8 s   |
| Dateien   | **58**   |

### 8.1 Getrackt vs. untracked — die notwendige Trennung

| Kategorie                                                               | Dateien |
| ----------------------------------------------------------------------- | ------- |
| **Getrackt** — echte Baseline-Altlast                                   | **36**  |
| **Untracked** — Artefakte dieser Analysekette und `projektverzeichnis/` | **22**  |

Die 22 untracked Dateien sind: 11 × `projektverzeichnis/` (2026-08-20 angelegt), 6 Analysedokumente
dieser Kette, 5 × `building-docs/` (die Kopien und abgeleiteten Dokumente).
**Sie sind kein Zustand der Baseline** und würden in CI auch nicht auftauchen, weil sie nicht
eingecheckt sind — sofern sie nicht später committet werden. _(Hinweis, keine Handlung: würde
`projektverzeichnis/` unverändert committet, färbte es das Format-Gate rot.)_

### 8.2 Die 36 getrackten Dateien nach Bereich

| Bereich                                   | Dateien |
| ----------------------------------------- | ------- |
| `wireframes/` (statische HTML-Prototypen) | **20**  |
| `docs/`                                   | 5       |
| `_project-knowledge/`                     | 3       |
| `scripts/`                                | 2       |
| `.archon/`                                | 2       |
| `src/`                                    | **1**   |
| `server/`                                 | **1**   |
| `email/`                                  | 1       |
| `lefthook.yml`                            | 1       |

**Echter Quellcode betroffen — vier Dateien:**
`src/components/sections/FinalCtaSection.tsx`, `server/server.js`,
`scripts/check-i18n-home.mjs`, `scripts/check-meta-descriptions.mjs`.

`npm run format` wurde **nicht** ausgeführt; keine Datei wurde umformatiert.

---

## 9. Root Test Suite

```
$ npm test                 # vitest run --reporter=default
EXIT = 0
 Test Files  7 passed (7)
      Tests  18 passed (18)
   Duration  2.39s
```

| Metrik                          | Wert      |
| ------------------------------- | --------- |
| Ergebnis                        | **PASS**  |
| Exit-Code                       | 0         |
| Dauer (Wanduhr)                 | 3,0 s     |
| Testdateien entdeckt / gelaufen | **7 / 7** |
| Tests bestanden                 | **18**    |
| Fehlgeschlagen                  | **0**     |
| Übersprungen                    | **0**     |

Aufschlüsselung:

| Datei                                      | Tests | Dauer  |
| ------------------------------------------ | ----- | ------ |
| `src/content/befunde/panelNames.test.ts`   | 7     | 7 ms   |
| `server/server.test.js`                    | 6     | 5 ms   |
| `src/components/ui/SectionHeader.test.tsx` | 1     | 192 ms |
| `src/components/ui/Alert.test.tsx`         | 1     | 51 ms  |
| `src/components/ui/Button.test.tsx`        | 1     | 161 ms |
| `src/components/layout/Footer.test.tsx`    | 1     | 300 ms |
| `src/components/layout/Header.test.tsx`    | 1     | 213 ms |

Eine nicht-blockierende Meldung: `[baseline-browser-mapping] The data in this module is over two months
old.` — ein Hinweis eines Transitivpakets, ohne Einfluss auf das Ergebnis.

### 9.2 Untersuchung des zuvor beobachteten `ERR_LOAD_URL`

**Ergebnis: kein Umgebungsproblem. Es war ein Aufrufparameterfehler meinerseits.**

```
$ npx vitest run server/server.test.js --reporter=basic
→ ERR_LOAD_URL
→ Failed to load url basic

$ npx vitest run server/server.test.js          # ohne den Parameter
→ Test Files 1 passed (1) · Tests 6 passed (6) · Duration 649ms
```

Der Reporter `basic` existiert in **Vitest 4** nicht mehr; Vitest versucht ihn als Modul zu laden und
scheitert beim Auflösen. Klassifikation: **kein `TEST_INFRA_FAILURE`, kein `ENVIRONMENT_FAILURE`** —
Bedienfehler, hier korrigiert.

Konsequenzen, die ausdrücklich festzuhalten sind:

1. **`BACKEND-LEAD-CURRENT-STATE.md` §16 und §21 (G5)** berichten „vitest lässt sich nicht starten".
   Das ist **überholt**. Die dortige Ersatzverifikation von `esc()` per Node bleibt gültig, war aber
   nicht nötig.
2. **`IMPLEMENTATION-HOTSPOTS.md`** empfiehlt an mehreren Stellen, Guards wegen der vermeintlichen
   Blockade bevorzugt als Playwright-Spec oder Node-Skript zu schreiben. Diese Begründung entfällt —
   **Vitest ist eine verfügbare Option**. Die Empfehlung bleibt für Guards sinnvoll, die einen echten
   Server brauchen (HTTP-Status, Sitemap, Consent), nicht aber aus Umgebungsgründen.
3. **Die Repository-Memory `sandbox-runtime-gates-blocked`** ist in diesem Punkt falsch und sollte
   korrigiert werden. _(Hinweis, keine Handlung im Rahmen dieser Aufgabe.)_
4. **CI unter Node 22 wäre davon nie betroffen gewesen** — `ci.yml` ruft `npm test` ohne Reporter-Flag auf.

---

## 10. Backend Test Suite

**`server/package.json` enthält kein Testkommando** — nur `start` (`node server.js`) und
`dev` (`node --watch server.js`). Ein eigenständiger Backend-Testlauf existiert nicht.

Der einzige Backend-Test wird von der **Root-Suite** ausgeführt, weil `vitest.config.ts` in `include`
auch `server/**/*.{test,spec}.{js,ts}` führt:

| Metrik     | Wert                                                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datei      | `server/server.test.js`                                                                                                                                                               |
| Ergebnis   | **PASS**                                                                                                                                                                              |
| Tests      | **6 / 6**                                                                                                                                                                             |
| Assertions | 10                                                                                                                                                                                    |
| Dauer      | 5 ms                                                                                                                                                                                  |
| Abgedeckt  | **ausschließlich `esc()`** — HTML-Escaping der fünf Zeichen, `&`-zuerst-Reihenfolge, Nullish-Sicherheit, Nicht-String-Coercion, Script-Neutralisierung, Escape-dann-`<br>`-Invariante |

**Kein Endpunkt wird getestet.** Weder `/api/contact`, `/api/support`, `/api/consumer-order`,
`/api/chat` noch `/api/roi-report` haben einen Test — weder Erfolgsfall, Validierung, Provider-Fehler,
Rate Limit noch fehlerhafte Payloads. Das bestätigt `BACKEND-LEAD-CURRENT-STATE.md` §16 unverändert.

**Kein E-Mail-Versand:** Der Test importiert `server/server.js` nur; der Guard
`if (require.main === module)` (`server/server.js:726`) verhindert das Starten eines Listeners, und
`esc()` löst keinen Netzverkehr aus. Die im Lauf sichtbare Meldung
`WARNING: Missing environment variables for email service: SENDGRID_API_KEY, CONTACT_RECEIVER, SENDER_EMAIL`
stammt aus der Startprüfung (`:38-45`) und belegt, dass **keine Zugangsdaten geladen waren**.
Es wurden **keine `DRY_RUN`-Flags erfunden** und keine echten SendGrid-Credentials verwendet.

---

## 11. Production Build

```
$ npm run build            # vite build --outDir dist/client && vite build --ssr … --outDir dist/server
EXIT = 0
```

| Metrik                    | Wert                                                             |
| ------------------------- | ---------------------------------------------------------------- |
| Ergebnis                  | **PASS**                                                         |
| Exit-Code                 | 0                                                                |
| Gesamtdauer               | **7,78 s**                                                       |
| Client                    | ✓ **1 908 Module** transformiert, gebaut in 5,37 s               |
| SSR                       | ✓ **164 Module** transformiert, gebaut in 1,30 s                 |
| **Warnungen**             | **0**                                                            |
| **Large-Chunk-Warnungen** | **keine** — Vites 500-kB-Schwelle wird von keinem Chunk erreicht |

### 11.1 Größte Client-Artefakte

| Artefakt                                     | Roh           | Gzip          |
| -------------------------------------------- | ------------- | ------------- |
| `assets/igloo-pro-flyer-*.pdf`               | 494,86 kB     | — (statisch)  |
| **`assets/index-*.js`**                      | **387,24 kB** | **118,30 kB** |
| `assets/spray-hero-12pack-office-*.jpeg`     | 333,31 kB     | —             |
| **`assets/MusterbefundPage-*.js`**           | **287,29 kB** | **77,91 kB**  |
| `assets/duo-hero-products-together-*.jpeg`   | 278,27 kB     | —             |
| `assets/index-*.css`                         | 86,81 kB      | —             |
| `assets/inter-latin-ext-wght-normal-*.woff2` | 85,07 kB      | —             |

45 JS-Chunks insgesamt; `dist/client` 24 MB, `dist/server` 19 MB.

**Bestätigte Altlast:** `MusterbefundPage-*.js` mit **287,29 kB** ist exakt der Chunk, den
`BRANCH-RECONCILIATION-MAP.md` (A5/A6/A7) beschreibt — _„287 KB Client-Chunk, um 24 KB anzuzeigen"_ —
und den AP16 PT16.1.2 und AP25 über sechs Routenmodule auflösen. Der Wert ist damit **gemessen**,
nicht nur zitiert.

### 11.2 Bemerkenswert

Der Build erzeugt **null Warnungen** — weder Circular Imports, noch „dynamic import will not move",
noch Chunk-Größenwarnungen. Das ist ein sauberes Ergebnis und der stärkste Einzelbefund dieses Audits.

### 11.3 Wirkung auf die ausgelieferte `dist`-Baseline — ausdrücklich

|                                | Vorher           | Nachher              |
| ------------------------------ | ---------------- | -------------------- |
| Dateien in `dist/`             | 510              | 510                  |
| `dist/client/index.html` mtime | 2026-08-18 12:41 | **2026-08-21 12:30** |
| `dist/client/index.html` md5   | `60a53e7d…`      | **`72386429…`**      |

**Der Host-`dist/`-Ordner wurde ersetzt.** Zwei Punkte dazu, beide relevant:

1. **Kein laufender Dienst ist betroffen.** Die Produktion läuft im Container `01polaris-frontend-1` und
   liest ihr `dist/` aus dem Image (Prozesspfade `/app/…`); der Preview-SSR auf `:9100` läuft derzeit
   nicht. Es wurde **kein Dienst neu gestartet**.
2. **Der neue Build enthält die uncommittete Änderung.** `grep` findet
   `chapterbar-offset,153px` in `dist/client/assets/EpigeneticsPage-*.js` — der Working-Tree-Stand von
   `src/pages/EpigeneticsPage.tsx` ist eingebaut. Das vorherige `dist/` entsprach dem reinen
   HEAD-Stand (gebaut 2026-08-18 12:41, eine Minute nach dem Commit). **Wer den Preview-Server jetzt
   startet, serviert nicht mehr die reine Baseline.** Die Quelldatei selbst wurde nicht angefasst.

---

## 12. Design Token Guard

```
$ npm run check:colors     # node scripts/check-color-tokens.mjs
EXIT = 0
✓ Farb-Guard: eine Navy (#083358), ein Akzent (Teal), kein Raw-Hex, keine Fremd-rgb().
```

| Metrik             | Wert     |
| ------------------ | -------- |
| Ergebnis           | **PASS** |
| Exit-Code          | 0        |
| Dauer              | 0,26 s   |
| Verstöße           | **0**    |
| Betroffene Dateien | **0**    |

Geprüft werden laut Skriptkopf `src/**/*.{ts,tsx,css}`, `tailwind.config.js`, `server.ts`,
`server/server.js`, `public/*.svg` und `scripts/og-image-template.html` gegen fünf Regeln
(kein Raw-Hex außerhalb der Palette, keine arbiträren Farbklassen, kein `gray-900`, keine rohen
chromatischen Tailwind-Skalen, keine fremden `rgb()`).

**Der schnellste und einzige vollständig grüne domänenspezifische Guard des Repositories — und er läuft
nicht in CI** (§14), sondern nur pre-commit (§15). AP05 PT05.1.9 und AP27 PT27.6.4 fordern ihn in CI.

---

## 13. Playwright E2E

### 13.1 Wie `playwright.config.ts` die Anwendung startet

```ts
use: { baseURL: 'http://localhost:3000', channel: 'chromium', trace: 'on-first-retry' },
webServer: {
  command: 'npm run build && npm run start',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120000,
}
```

### 13.2 Warum das Kommando hier **nicht** ausgeführt wurde

**Ergebnis: `BLOCKED_ENVIRONMENT`.**

Auf `127.0.0.1:3000` läuft der Container **`phoenix-assay-pro-web-1`** — ein anderes Projekt. Gemessen:

```
$ curl -s http://127.0.0.1:3000/ | grep -o '<title>[^<]*</title>'
<title>PolarisDX — Phoenix Assay Pro | IVD Validation Platform</title>
```

`CI` ist in dieser Shell nicht gesetzt, also gilt `reuseExistingServer: true`. Playwright hätte den
belegten Port als „läuft schon" gewertet und **alle 19 Routenprüfungen gegen die fremde Anwendung
ausgeführt**. Da diese auf `/` mit `200` antwortet, wären Teile der Suite sogar **fälschlich grün**
geworden — ein irreführendes Ergebnis wäre schlimmer als gar keines.

Mit `CI=1` hätte Playwright stattdessen `npm run build && npm run start` gestartet, was auf den
belegten Port 3000 gebunden hätte (`EADDRINUSE`). Beides führt zu keinem verwertbaren Ergebnis, ohne
`playwright.config.ts` zu ändern — was ausgeschlossen ist.

**Sekundärbefund, unabhängig von dieser Umgebung:** `reuseExistingServer: !process.env.CI` ist auf
**jeder** Entwicklermaschine mit einem beliebigen Dienst auf Port 3000 ein stiller Fehlleiter. Der Wert
`3000` ist zugleich der Default von `server.ts` und ein sehr verbreiteter Port.

### 13.3 Ersatzmessung — SSR-Server auf freiem Port, read-only

Damit trotzdem gemessen wird, was die Suite messen soll: `npm run start` mit `PORT=9310` und
`BACKEND_URL=http://127.0.0.1:5999` (bewusst ins Leere, damit kein `/api`-Aufruf ein echtes Backend
erreicht), 40 `curl`-Prüfungen, ausschließlich `GET`, **kein Formular**, danach Prozessgruppe beendet.
Port 9310 war vorher frei und ist danach wieder frei. **Das ist nicht `npm run test:e2e`** — es ist eine
Ersatzmessung derselben Sachverhalte.

**A · Routen, die die Suite abdeckt** — alle **200**:
`/de/`, `/de/about`, `/de/articles`, `/de/contact`, `/de/diagnostics`, `/de/downloads`, `/de/events`,
`/de/igloo-pro`, `/de/imprint`, `/de/privacy`, `/de/s3_leitlinie`, `/de/support`, `/de/terms`,
`/de/vitamin-d3-implantologie`, `/de/vitamin-d3-spray` (15/15).

**B · Routen, die die Suite auslässt** — ebenfalls alle **200**:
`/de/epigenetics`, die sechs `/de/epigenetics/musterbefund/*`, `/en/consumer/vitamin-d3-spray`,
`/en/consumer/hydrating-masks`, `/en/consumer/inside-out-duo` (10/10).

**C · Redirects:**

| Pfad               | Status  | Ziel                                         |
| ------------------ | ------- | -------------------------------------------- |
| `/agb`             | **301** | `/de/terms` — ein Hop ✅                     |
| `/s3-leitlinie`    | **301** | `/de/s3_leitlinie` — ein Hop ✅              |
| `/en/s3_leitlinie` | **301** | `/de/s3_leitlinie` — German-only-Kollaps ✅  |
| `/about`           | **301** | `/de/about` — Präfix-Einfügung ✅            |
| `/services`        | **301** | `/de/services` — **nicht** `/de/diagnostics` |
| `/de/services`     | **200** | — clientseitiges `<Navigate>` übernimmt      |

**Altlast 1 des Master-Scope („`/services*` liefert heute 200 statt dokumentierter 301-Brücke") ist
damit gemessen bestätigt.**

**D · Echte 404:** `/de/diese-seite-existiert-nicht` → **404**; `/de/articles/kein-slug` → **404**
(der Soft-404-Marker-Pfad über `SEOHead notFound` funktioniert); `/en/nope` → **404**.

**E · 10-Sprachen-Routing:** `de en pl fr it es pt da nl cs` → **alle 200**.

**F · Sitemap/robots:** `/sitemap.xml` → **200**, **335 `<loc>`-Einträge**, **3 630 `hreflang`-Attribute**,
38 distinkte Pfade ohne Sprachpräfix. `/robots.txt` → **200**.
Zwei gemessene Altlasten:

- **`lastmod`: genau ein distinkter Wert für alle 335 URLs — das heutige Datum** (Altlast 5).
- **30 Legal-Einträge** (`/privacy`, `/imprint`, `/terms` × 10 Sprachen) in der Sitemap, während dieselben
  Seiten `noindex={true}` setzen (Altlast 4).
- Der Codekommentar in `server.ts` spricht von _„27 routes × 10 languages = 270 URLs"_ — **gemessen sind
  es 335**. Der Kommentar ist veraltet.

**G · Header auf HTML:** `Cache-Control: no-store, no-cache, must-revalidate` ✅ ·
`Content-Security-Policy-Report-Only` gesetzt ✅ · `X-Frame-Options: SAMEORIGIN` ·
`Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
**Kein `Strict-Transport-Security`** — bestätigt Master-Scope Altlast 9.

### 13.4 Was die E2E-Suite tatsächlich prüft

`e2e/url-smoke.spec.ts` — 4 `test()`-Blöcke, die zu 19 Prüfungen expandieren, 5 `expect()`.

| Gegenstand             | Abgedeckt?                             | Beleg                                                                                                                                                          |
| ---------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Echter HTTP-Status** | **NEIN** für 404 · **teilweise** sonst | `expect(response?.status()).toBeLessThan(400)` — akzeptiert 200 **und** 301/302 gleichermaßen                                                                  |
| `/epigenetics`         | **NEIN**                               | nicht in `ROUTES`                                                                                                                                              |
| Musterbefunde (6)      | **NEIN**                               | nicht in `ROUTES`                                                                                                                                              |
| `/consumer/*` (3)      | **NEIN**                               | nicht in `ROUTES`                                                                                                                                              |
| 10-Sprachen-Routing    | **NEIN**                               | alle Pfade ohne Sprachpräfix; getestet wird nur der Default-Redirect-Pfad                                                                                      |
| `sitemap.xml`          | **NEIN**                               | keine Prüfung                                                                                                                                                  |
| Redirects              | **teilweise**                          | 2 Fälle (`/services`, `/services/dental`), geprüft über `waitForURL` — **der Statuscode wird nie inspiziert**, ein clientseitiger Hop bestünde den Test ebenso |
| **404**                | **NEIN (Status)**                      | prüft nur Text: `toContainText(/404\|nicht gefunden\|not found/i)` — **eine Soft-404 mit HTTP 200 bestünde diesen Test**                                       |
| Consent-Verhalten      | **NEIN**                               | keine Prüfung                                                                                                                                                  |
| Formulare              | **NEIN**                               | keine Prüfung                                                                                                                                                  |

**Die Suite deckt 15 von 38 Sitemap-Pfaden ab und prüft die beiden Eigenschaften nicht, für deren
Absicherung `server.ts` seine 404-/Redirect-Maschinerie überhaupt besitzt.**

---

## 14. CI Reality

Aus `.github/workflows/ci.yml` — der aktiven Workflow-Datei, nicht aus Dokumentation.

| Aspekt            | Ist                                                               |
| ----------------- | ----------------------------------------------------------------- |
| **Trigger**       | `pull_request: branches: [main]` **und** `push: branches: [main]` |
| **Branch-Filter** | **ausschließlich `main`**                                         |
| Node              | **22** (`actions/setup-node@v4`, `cache: 'npm'`)                  |
| Install           | `npm ci`                                                          |
| Jobs              | genau einer: `quality` auf `ubuntu-latest`                        |

**Schrittreihenfolge:** checkout → setup-node 22 → `npm ci` → `npx tsc -b --noEmit` → `npx eslint .` →
`npx prettier --check .` → `npm test` → `npm run build` → `npx playwright install chromium --with-deps`
→ `npx playwright test e2e/url-smoke.spec.ts` (mit `CI: true`).

| Prüfung                                        | In CI?                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| Typecheck · Lint · Format · Unit-Tests · Build | ✅                                                                  |
| Playwright                                     | ✅ — **aber nur `e2e/url-smoke.spec.ts`**, nicht `npm run test:e2e` |
| Backend-Tests                                  | ✅ implizit (`server/server.test.js` läuft in der Root-Suite)       |
| **Farb-Guard `check:colors`**                  | ❌                                                                  |
| **i18n-Guard**                                 | ❌                                                                  |
| **Accessibility / axe**                        | ❌                                                                  |
| **Visual Regression**                          | ❌                                                                  |
| **Lighthouse / CWV**                           | ❌                                                                  |
| **Security-/Dependency-Scan**                  | ❌                                                                  |
| **Docker-Build / Healthcheck**                 | ❌                                                                  |

### 14.1 Bestätigung des früheren Befunds

> **Frühere Feststellung: „CI triggert nur auf `main`." — BESTÄTIGT.**

Und weiter: **`feat/home-leadmagnet` hätte nie automatisch gegatet werden können.**
`git branch -r --list 'origin/feat/home-leadmagnet'` liefert **kein Ergebnis** — der Branch existiert
nicht auf `origin`. Damit konnte weder der `push`- noch der `pull_request`-Trigger je für ihn feuern.
**Die gesperrte Baseline ist nie durch typecheck, lint, prettier, vitest, build oder den Playwright-Smoke
gelaufen** — bis zu diesem Audit.

Zwei Konsequenzen, die das Ergebnis dieses Audits einordnen:

- Die 129 Lint- und 58 Format-Befunde konnten sich ansammeln, **weil kein Gate sie je gesehen hat**.
- Die vier grünen Kommandos (typecheck, test, build, colors) sind heute **zum ersten Mal nachweislich
  grün** — vorher gab es dafür keinen Beleg, nur die Annahme.

---

## 15. Lefthook Reality

`lefthook.yml`, `pre-commit`, `parallel: true`:

| Kommando    | Läuft auf                                                                   | Mutiert Dateien?                         |
| ----------- | --------------------------------------------------------------------------- | ---------------------------------------- |
| `format`    | `npx prettier --write {staged_files}`, Glob `*.{ts,tsx,js,jsx,json,md,css}` | **JA** — `--write` + `stage_fixed: true` |
| `lint`      | `npx eslint --fix {staged_files}`, Glob `*.{ts,tsx}`                        | **JA** — `--fix` + `stage_fixed: true`   |
| `typecheck` | `npx tsc -b --noEmit` — **gesamtes Projekt**                                | nein                                     |
| `colors`    | `node scripts/check-color-tokens.mjs` — **gesamtes Projekt**                | nein                                     |

Der Hook ist installiert: `/home/phillip/01polaris/.git/hooks/pre-commit` existiert (2 213 Bytes,
ausführbar, lefthook-Shim, 2026-08-18). Da Worktrees sich das gemeinsame `.git` teilen, greift er auch hier.

### 15.1 Lokale Hook-Abdeckung vs. CI-Abdeckung

| Prüfung        | Lefthook (lokal)                                | CI                            |
| -------------- | ----------------------------------------------- | ----------------------------- |
| Prettier       | ✅ **korrigiert automatisch**, nur staged files | ✅ **prüft nur**, ganzes Repo |
| ESLint         | ✅ **korrigiert automatisch**, nur staged files | ✅ **prüft nur**, ganzes Repo |
| Typecheck      | ✅ ganzes Projekt                               | ✅                            |
| **Farb-Guard** | ✅                                              | ❌                            |
| Unit-Tests     | ❌                                              | ✅                            |
| Build          | ❌                                              | ✅                            |
| E2E            | ❌                                              | ✅ (eine Datei)               |

**Drei Beobachtungen:**

1. **Die beiden Gates verhalten sich gegensätzlich.** Lokal wird repariert und nachgestaged, in CI wird
   nur geprüft. Eine Datei, die nie durch einen Commit auf dieser Maschine ging — etwa importiert oder
   per Skript erzeugt — erreicht CI ungeprüft.
2. **Der Farb-Guard existiert nur lokal.** Er ist der einzige domänenspezifische Guard des Repositories
   und die einzige Prüfung, die _ausschließlich_ an einer Stelle läuft, die man mit `--no-verify`
   überspringen kann.
3. **Die Umgehung ist belegt praktiziert worden:** die Commit-Message von `feat/contact-joyful@ab373a3`
   lautet _„commit --no-verify: repo-wide eslint import-resolver is pre-broken (fails on unmodified
   files too)"_. Das beschreibt exakt die in §7.3 gemessene Situation — mit dem Unterschied, dass die
   Ursache nicht ein fehlender Resolver ist, sondern das Linten des `_project-knowledge/`-Archivs.

---

## 16. Test Coverage Map

Aktive Testdateien (ohne `node_modules`): **7** — 5 Frontend-Komponententests, 1 Content-Test,
1 Backend-Helper-Test, plus 1 E2E-Spec.

| Datei                                      | Tests  | Assertions | Was tatsächlich geprüft wird                      |
| ------------------------------------------ | ------ | ---------- | ------------------------------------------------- |
| `src/content/befunde/panelNames.test.ts`   | 7      | 15         | Panelnamen gegen `BEFUNDE`                        |
| `server/server.test.js`                    | 6      | 10         | ausschließlich `esc()`                            |
| `src/components/ui/SectionHeader.test.tsx` | 1      | 2          | Caption + `heading level 2` gerendert             |
| `src/components/ui/Button.test.tsx`        | 1      | 1          | `getByRole('button')` im Dokument                 |
| `src/components/ui/Alert.test.tsx`         | 1      | 1          | Kindtext sichtbar                                 |
| `src/components/layout/Header.test.tsx`    | 1      | 1          | mindestens ein `role=navigation`                  |
| `src/components/layout/Footer.test.tsx`    | 1      | 1          | mindestens ein Link                               |
| `e2e/url-smoke.spec.ts`                    | 4 → 19 | 5          | 15 Routen `<400`, 2 Redirects per URL, 1 404-Text |

Fünf der sieben Frontend-/Backend-Testdateien sind **Ein-Assertion-Rendersmoke** („rendert überhaupt").

| Domäne               | Abdeckung   | Begründung                                                                    |
| -------------------- | ----------- | ----------------------------------------------------------------------------- |
| **ROUTING**          | **MINIMAL** | 15 von 38 Sitemap-Pfaden, ohne Statusprüfung; keine Registry-Parität          |
| **SEO**              | **NONE**    | kein Test für Canonical, hreflang, Sitemap, robots, Structured Data           |
| **I18N**             | **NONE**    | kein Sprachpräfix im Test; keine Key-/Namespace-Parität                       |
| **HEADER_NAV**       | **MINIMAL** | eine Assertion: `role=navigation` existiert                                   |
| **FOOTER**           | **MINIMAL** | eine Assertion: irgendein Link existiert                                      |
| **FORMS**            | **NONE**    | kein Formular-Test, weder Unit noch E2E                                       |
| **BACKEND**          | **MINIMAL** | 6 Tests für eine 7-zeilige Escaping-Funktion; **kein Endpunkt**               |
| **CONSUMER**         | **NONE**    | keine der drei Seiten in irgendeinem Test                                     |
| **EPIGENETICS**      | **NONE**    | `/epigenetics` in keinem Test                                                 |
| **MUSTERBEFUNDE**    | **PARTIAL** | `panelNames.test.ts` prüft Inhaltskonsistenz; **keine** Seiten-/Routenprüfung |
| **TRACKING_CONSENT** | **NONE**    | kein Test — bestätigt `CONSENT-TRACKING-NETWORK-BASELINE.md` §20 R16          |
| **ACCESSIBILITY**    | **MINIMAL** | kein axe-Lauf; nur `eslint-plugin-jsx-a11y` statisch (3 Befunde offen, §7.4)  |
| **PERFORMANCE**      | **NONE**    | kein Lighthouse, kein Budget, keine CWV-Messung                               |
| **SECURITY**         | **NONE**    | kein Header-Test, kein Rate-Limit-Test, kein Dependency-Scan in CI            |
| **DEPLOYMENT**       | **NONE**    | kein Docker-Build, kein Healthcheck-Test in CI                                |

**Keine Domäne erreicht STRONG. Eine erreicht PARTIAL. Vier erreichen MINIMAL. Zehn sind NONE.**

---

## 17. Master-Scope Quality-Gate Gap

Gemessene Automatisierung gegen die Anforderungen aus AP05, AP08–AP10, AP23–AP28.

| Gate                                                             | Status                                     | Evidenz                                                                                                                            |
| ---------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Route-Registry-Guard** (AP10 PT10.3)                           | **ABSENT**                                 | kein Test prüft `App.tsx` ↔ `SITEMAP_ROUTES` ↔ `useSearch`; vier Handspiegel ungesichert                                           |
| **HTTP 301/404-Tests** (AP10 PT10.4, AP27 PT27.5.1–.2)           | **PARTIAL**                                | Verhalten funktioniert (§13.3 C, D), **aber der Test prüft es nicht**: `<400` akzeptiert Redirects, 404 wird nur über Text geprüft |
| **Sitemap-Tests** (AP09 PT09.2.8)                                | **ABSENT**                                 | keine XML-Validierung, keine Abdeckungsprüfung, keine `lastmod`-Prüfung                                                            |
| **Canonical/hreflang-Tests** (AP09 PT09.1.8)                     | **ABSENT**                                 | kein Test                                                                                                                          |
| **i18n-Parität** (AP08 PT08.3.4–.5)                              | **ABSENT**                                 | kein Guard; `scripts/check-i18n-home.mjs` existiert, ist aber **in keinem npm-Script und in keinem CI-Schritt** verdrahtet         |
| **No-Chat-Guard** (AP06 PT06.4.6, AP22 PT22.7)                   | **ABSENT**                                 | kein Test; `ChatWidget.tsx` und `/api/chat` sind vorhanden                                                                         |
| **No-Garantie-Band-Guard** (AP06 PT06.3.8, Gate 8)               | **ABSENT**                                 | kein Test                                                                                                                          |
| **Kein Pre-Consent-Provider-Request** (AP23 PT23.1, AP27 PT27.4) | **ABSENT**                                 | kein Test — und der Zustand ist nachweislich verletzt (`CONSENT-TRACKING-NETWORK-BASELINE.md` §15/§16)                             |
| **WCAG / axe** (AP24 PT24.6.2)                                   | **PARTIAL**                                | statisches `eslint-plugin-jsx-a11y` läuft mit — aber im **roten** Lint-Gate, das niemand betrachtet. Kein Laufzeit-axe             |
| **Visual Regression** (AP27 PT27.6.1)                            | **ABSENT**                                 | kein Snapshot-Setup; Import-Kandidat B in der Reconciliation-Map                                                                   |
| **Lighthouse / CWV** (AP25 PT25.5.7)                             | **ABSENT**                                 | keine Budgets, kein Lauf                                                                                                           |
| **Security-/Dependency-Scan** (AP26 PT26.5.1–.2)                 | **ABSENT**                                 | kein `npm audit`, kein Secret-Scan, kein Image-Scan in CI                                                                          |
| **Docker-/Healthcheck-Verifikation** (AP28 PT28.2.7)             | **ABSENT**                                 | CI baut kein Image; der Healthcheck existiert im `Dockerfile`, wird aber nie in CI geprüft                                         |
| **Farb-/Token-Guard** (AP05 PT05.1.9, AP27 PT27.6.4)             | **PRESENT_NOT_GATED**                      | grün und schnell — läuft **nur pre-commit**, nicht in CI (§14)                                                                     |
| **Meta-Description-Guard** (AP27 PT27.6.6)                       | **PRESENT_NOT_GATED**                      | `scripts/check-meta-descriptions.mjs` existiert, ist nirgends verdrahtet                                                           |
| **Changelog-Gate** (AP27 PT27.6.8)                               | **ABSENT**                                 | kein `CHANGELOG.md`, kein Job                                                                                                      |
| **Typecheck / Lint / Format / Unit / Build**                     | **PRESENT_AND_RUNNING** _(nur auf `main`)_ | in `ci.yml` — aber die Baseline war nie erfasst (§14.1)                                                                            |

**Bilanz:** 1 × PRESENT_AND_RUNNING (fünffach, nur auf `main`) · 2 × PRESENT_NOT_GATED ·
2 × PARTIAL · **11 × ABSENT** · 0 × BROKEN.

Zwei fertige Guard-Skripte liegen ungenutzt im Repository (`check-i18n-home.mjs`,
`check-meta-descriptions.mjs`) — sie sind weder in `package.json` noch in `ci.yml` referenziert.

---

## 18. Node Version Drift

**Bestätigt:** lokal **Node 20.19.6**, CI und beide Dockerfiles **Node 22**.

| Frage                                               | Antwort                                                                                                                                                                                                                                                                                       |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Welche Kommandos liefen hier unter Node 20?         | **alle** — typecheck, lint, format:check, test, build, check:colors und die HTTP-Ersatzmessung                                                                                                                                                                                                |
| Beschränkt `package.json` die Node-Version?         | **nein** — `engines` ist nicht deklariert                                                                                                                                                                                                                                                     |
| Ist ein Paketmanager gepinnt?                       | **nein** — `packageManager` ist nicht gesetzt                                                                                                                                                                                                                                                 |
| Konnte das `ERR_LOAD_URL` umgebungsspezifisch sein? | **Nein — und zwar belegt.** Die Ursache war der nicht existierende Reporter `basic`; die Fehlermeldung lautet wörtlich `Failed to load url basic`. Derselbe Test läuft ohne den Parameter unter derselben Node-Version durch (§9.2). **Node 20 vs. 22 spielt hier nachweislich keine Rolle.** |

**Verbleibende Drift-Bewertung — ohne Kausalitätsbehauptung:** Da nichts die Node-Version festschreibt,
können lokale und CI-Läufe grundsätzlich auseinanderlaufen (unterschiedliche V8-/Undici-/npm-Versionen,
unterschiedliche Auflösung optionaler Abhängigkeiten). **Für die sieben hier gemessenen Kommandos gibt es
keinen Hinweis auf einen versionsabhängigen Unterschied** — alle vier grünen Kommandos sind
deterministisch, und die beiden roten scheitern an Dateiinhalten, nicht an Laufzeitverhalten.
Das Risiko ist damit real, aber nicht belegt eingetreten. AP01 PT01.5.3 fordert die Fixierung.

---

## 19. Failure Inventory

### F-01 · ESLint

| Feld                    | Wert                                                                                                                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Kommando**            | `npm run lint`                                                                                                                                                                                                                             |
| **Klassifikation**      | **LINT_FAILURE** (überwiegend Konfigurations-Altlast)                                                                                                                                                                                      |
| **Root-Evidenz**        | `✖ 129 problems (125 errors, 4 warnings)`; **111 in `_project-knowledge/`**, 17 in `src/`, 1 in `server.ts`. 92 × `import/no-unresolved`, weil `eslint.config.js` nur `dist` ignoriert, `tsconfig.app.json` aber nur `["src"]` einschließt |
| **Betroffener Bereich** | Konfiguration (`eslint.config.js` Ignore-Liste) + 18 echte Codebefunde                                                                                                                                                                     |
| **Baseline-bestehend?** | **Ja** — keine der Befunddateien wurde von diesem Audit angefasst                                                                                                                                                                          |
| **CI-Wirkung**          | Bricht den CI-Schritt `npx eslint .` — **hat aber auf der Baseline nie gefeuert** (§14.1). Auf `main` würde es sofort rot                                                                                                                  |
| **Launch-Relevanz**     | **Hoch als Gate-Blocker**, mittel inhaltlich: 3 der 18 echten Befunde sind a11y-relevant (AP24), der Rest sind React-Hook-/Fast-Refresh-Muster                                                                                             |

### F-02 · Prettier

| Feld                    | Wert                                                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kommando**            | `npm run format:check`                                                                                                                                                                              |
| **Klassifikation**      | **FORMAT_FAILURE**                                                                                                                                                                                  |
| **Root-Evidenz**        | `Code style issues found in 58 files` — **36 getrackt**, 22 untracked. Von den getrackten: 20 `wireframes/`, 5 `docs/`, 3 `_project-knowledge/`, 2 `scripts/`, 2 `.archon/`, **4 echter Quellcode** |
| **Betroffener Bereich** | überwiegend statische Prototypen und Dokumentation                                                                                                                                                  |
| **Baseline-bestehend?** | **Ja** für die 36 getrackten. Die 22 untracked stammen aus dieser Analysekette und aus `projektverzeichnis/` und sind **kein Baseline-Zustand**                                                     |
| **CI-Wirkung**          | Bricht `npx prettier --check .` — auf der Baseline nie gefeuert                                                                                                                                     |
| **Launch-Relevanz**     | **Niedrig** inhaltlich, **hoch als Gate-Blocker**                                                                                                                                                   |

### F-03 · Playwright E2E

| Feld                    | Wert                                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kommando**            | `npm run test:e2e`                                                                                                                                                              |
| **Klassifikation**      | **ENVIRONMENT_FAILURE**                                                                                                                                                         |
| **Root-Evidenz**        | Port 3000 belegt durch `phoenix-assay-pro-web-1`; `reuseExistingServer: !process.env.CI` mit unbesetztem `CI` ⇒ Playwright hätte die fremde Anwendung wiederverwendet           |
| **Betroffener Bereich** | Testinfrastruktur / Hostumgebung                                                                                                                                                |
| **Baseline-bestehend?** | **Teilweise.** Der Portkonflikt ist hostspezifisch; die Konfigurationsentscheidung `reuseExistingServer` ist Baseline und auf jeder Maschine mit Dienst auf 3000 ein Fehlleiter |
| **CI-Wirkung**          | **Keine** — CI setzt `CI: true`, damit `reuseExistingServer: false`, und ein GitHub-Runner hat Port 3000 frei                                                                   |
| **Launch-Relevanz**     | Mittel — die Suite selbst ist inhaltlich zu dünn (§13.4), unabhängig von der Ausführbarkeit                                                                                     |

### Nicht als Fehlschlag geführt

**`ERR_LOAD_URL` aus einem früheren Audit** — kein Repository-Fehler, sondern ein ungültiger
Reporter-Parameter in meinem eigenen Aufruf (§9.2). Klassifikation: **kein Failure.**

---

## 20. Final Quality Matrix

| Verification                   | Result                  | Exit | Evidence                                                                                      | CI today?                   | Launch Gate relevance          |
| ------------------------------ | ----------------------- | ---- | --------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------ |
| `npm run typecheck`            | **PASS**                | 0    | 0 Fehler, ~4 s                                                                                | ✅ (nur `main`)             | Gate-Voraussetzung             |
| `npm test`                     | **PASS**                | 0    | 7 Dateien / **18 Tests** grün, 2,39 s                                                         | ✅ (nur `main`)             | AP27 PT27.1 — Umfang zu gering |
| `npm run build`                | **PASS**                | 0    | Client 1 908 Module / SSR 164 Module, **0 Warnungen**, 7,78 s                                 | ✅ (nur `main`)             | Gate 12 / AP28                 |
| `npm run check:colors`         | **PASS**                | 0    | 0 Verstöße, 0,26 s                                                                            | ❌                          | AP05 PT05.1.9                  |
| `npm run lint`                 | **FAIL**                | 1    | 129 Probleme, davon 111 in `_project-knowledge/`                                              | ✅ (nur `main`)             | Gate-Blocker; 3 a11y-Befunde   |
| `npm run format:check`         | **FAIL**                | 1    | 58 Dateien (36 getrackt / 22 untracked)                                                       | ✅ (nur `main`)             | Gate-Blocker                   |
| `npm run test:e2e`             | **BLOCKED_ENVIRONMENT** | —    | Port 3000 durch fremde App belegt; `reuseExistingServer`                                      | ✅ (nur `main`, nur 1 Spec) | AP27 PT27.3/PT27.5             |
| **Ersatzmessung:** 25 Routen   | **PASS**                | —    | alle **200**                                                                                  | ❌                          | AP10 PT10.4                    |
| **Ersatzmessung:** Redirects   | **PASS mit Befund**     | —    | `/agb`, `/s3-leitlinie`, `/en/s3_leitlinie` je **301** in einem Hop; **`/de/services` = 200** | ❌                          | AP10 PT10.1.2, Altlast 1       |
| **Ersatzmessung:** echte 404   | **PASS**                | —    | statischer Pfad **404**, unbekannter Artikel-Slug **404**                                     | ❌                          | AP10 PT10.4.3                  |
| **Ersatzmessung:** 10 Sprachen | **PASS**                | —    | alle 10 → 200                                                                                 | ❌                          | Gate 1                         |
| **Ersatzmessung:** Sitemap     | **PASS mit Befund**     | —    | 335 URLs, 3 630 hreflang; **1 `lastmod`-Wert**; **30 Legal-Einträge trotz `noindex`**         | ❌                          | Gate 4, Altlasten 4 + 5        |
| **Ersatzmessung:** Header      | **PASS mit Befund**     | —    | `no-store` ✅, CSP-Report-Only ✅, **kein HSTS**                                              | ❌                          | Gate 12, Altlast 9             |
| Backend-Testkommando           | **N/A**                 | —    | `server/package.json` hat keines                                                              | —                           | AP27 PT27.2                    |
| i18n-Guard                     | **NOT WIRED**           | —    | `scripts/check-i18n-home.mjs` existiert, nirgends referenziert                                | ❌                          | Gate 1                         |
| Meta-Description-Guard         | **NOT WIRED**           | —    | `scripts/check-meta-descriptions.mjs`, nirgends referenziert                                  | ❌                          | Gate 4                         |

---

## 21. Risks

### CRITICAL

**Q1 — Die gesperrte Baseline war nie automatisiert geprüft, und konnte es nie sein.**
`ci.yml` triggert nur auf `main`; `feat/home-leadmagnet` existiert nicht auf `origin` (§14.1). Alle
zwölf Launch-Gates des Master-Scope sind heute dokumentarisch. Dieses Audit ist der **erste** Nachweis,
dass typecheck, test, build und check:colors auf der Baseline grün sind.

**Q2 — Zwei von sieben Gates sind rot und kein Mechanismus hat es je gemeldet.**
129 Lint-Probleme und 58 Format-Abweichungen konnten sich ansammeln, weil kein Gate sie sah und der
lokale Hook nur _staged_ Dateien anfasst (§15). Vor jedem AP-Merge auf eine gegatete Linie müssen beide
Gates zuerst grün werden — sonst blockiert F-01/F-02 jede spätere PR aus einem unbeteiligten Grund.

### HIGH

**Q3 — Der E2E-Guard prüft die beiden Eigenschaften nicht, für die die Maschinerie existiert.**
`toBeLessThan(400)` akzeptiert Redirects als Erfolg, und der 404-Test prüft **Text statt Status** — eine
Soft-404 mit HTTP 200 bestünde ihn (§13.4). Gleichzeitig fehlen `/epigenetics`, sechs Musterbefunde und
drei Consumer-Seiten: 15 von 38 Sitemap-Pfaden sind abgedeckt.

**Q4 — `reuseExistingServer: !process.env.CI` kann die Suite still gegen eine fremde Anwendung laufen
lassen.** Auf diesem Host nachgewiesen (§13.2). Das Ergebnis wäre nicht „rot", sondern _falsch_ — die
gefährlichere Fehlerart.

**Q5 — Der einzige domänenspezifische Guard läuft ausschließlich lokal.**
`check:colors` ist grün, schnell (0,26 s) und in CI **nicht vorhanden** (§14). Er ist damit die einzige
Prüfung, die sich mit `git commit --no-verify` vollständig überspringen lässt — was ausweislich der
Commit-Message von `feat/contact-joyful@ab373a3` bereits praktiziert wurde.

**Q6 — 86 % des Lint-Rauschens kommen aus einem Archivordner.**
`_project-knowledge/` wird gelintet, obwohl `AGENT-CONTRACT.md` Regel 4 es ausdrücklich als
Nicht-Live-Quelle führt. Das macht das Gate praktisch unlesbar: **die 18 echten Befunde verschwinden in
111 Archivmeldungen.**

### MEDIUM

**Q7 — Zwei fertige Guard-Skripte sind nicht verdrahtet.** `check-i18n-home.mjs` und
`check-meta-descriptions.mjs` existieren, laufen aber nirgends. Vorhandene Arbeit ohne Wirkung.

**Q8 — Node-Version nicht fixiert.** Weder `engines` noch `packageManager`; lokal 20, CI/Docker 22
(§18). Für die gemessenen Kommandos kein belegter Unterschied, aber unabgesichert.

**Q9 — Drei gemessene SEO-/Routing-Altlasten sind ungetestet und würden unbemerkt bleiben.**
`/de/services` = 200 statt 301-Brücke; ein einziger `lastmod`-Wert für 335 URLs; 30 Legal-Einträge in
der Sitemap trotz `noindex` (§13.3). Alle drei stehen im Master-Scope §5 — keine hat einen Test.

**Q10 — Der Build hat die `dist`-Baseline ersetzt.** Kein Dienst betroffen (§11.3), aber ein künftiger
Preview-Start serviert nun einen Build **inklusive** der uncommitteten `EpigeneticsPage`-Änderung statt
des reinen HEAD-Stands.

### LOW

**Q11 — Fünf der sieben Testdateien sind Ein-Assertion-Rendersmoke.** Sie belegen „stürzt nicht ab",
nicht Verhalten (§16).
**Q12 — `MusterbefundPage-*.js` = 287,29 kB** — bekannte, jetzt gemessene Chunk-Altlast; Vites
Warnschwelle liegt bei 500 kB, also ohne Buildwarnung.
**Q13 — Veralteter Codekommentar** in `server.ts`: „27 routes × 10 languages = 270 URLs" gegen
gemessene 335.

---

## 22. Recommended Stable Contracts for building-docs

**Nur Empfehlungen — hier wird nichts erstellt.**

| Dokument                  | Lohnt sich?                          | Frühestes AP       | Inhalt, begründet aus diesem Audit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------- | ------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`QUALITY-GATES.md`**    | **Ja — höchste Priorität**           | AP27 PT27.6        | Bereits in `IMPLEMENTATION-HOTSPOTS.md` §14 vorgeschlagen; dieses Audit liefert die Ist-Spalte. Muss je Launch-Gate (§8 des Master-Scope) festhalten: **welches Kommando es beweist, wo es läuft, und ob es heute grün ist.** Aufzulösen sind die zwei `PRESENT_NOT_GATED`-Fälle (`check:colors`, Meta-Guard) und die elf `ABSENT`. Sollte zusätzlich den **Unterschied lokal/CI** dokumentieren (§15.1) — die heutige Asymmetrie „lokal repariert, in CI geprüft" ist die Ursache dafür, dass zwei Gates unbemerkt rot wurden. |
| **`CI-CONTRACT.md`**      | **Ja**                               | AP27 / AP28        | Was CI garantiert und was nicht. Muss zwingend enthalten: **auf welchen Branches CI läuft** (heute nur `main` — die Ursache von Q1), die Node-Version und ihre Fixierung (Q8), die Reihenfolge und Abbruchsemantik der Schritte, und welche Prüfungen bewusst **nicht** in CI laufen. Sollte festlegen, dass jede Relaunch-Linie gegatet ist, bevor der erste AP darauf merged.                                                                                                                                                 |
| **`TESTING-CONTRACT.md`** | **Ja, aber nach den beiden anderen** | AP27 PT27.1–PT27.5 | Die Teststufen und ihr jeweiliger Zuständigkeitsbereich: was Unit prüft, was Integration, was E2E. Muss die heutigen Lücken der Coverage-Map (§16 — zehn Domänen auf NONE) in Zielzustände überführen und **die Testinfrastruktur-Entscheidungen festhalten**: den Port und die `reuseExistingServer`-Semantik (Q4), die Frage „Vitest oder Playwright je Guard" (nun ohne Umgebungszwang, §9.2), und den Umgang mit `_project-knowledge/` in Lint-/Test-Scopes (Q6).                                                           |

**Korrekturhinweis an bestehende Dokumente** _(kein Auftrag, nur Feststellung)_: die Aussage „vitest ist
blockiert" in `BACKEND-LEAD-CURRENT-STATE.md` §16/§21 und in der Repository-Memory
`sandbox-runtime-gates-blocked` ist durch §9.2 widerlegt und sollte bei nächster Gelegenheit richtiggestellt
werden, damit spätere APs ihre Guard-Technologie nicht aus einem falschen Grund wählen.

---

## 23. Final Classification

## QUALITY_BASELINE_READY_WITH_WARNINGS

**Warum READY.** Eine belastbare Messung liegt vor — keine Umgebungsbeschränkung hat einen sinnvollen
Baseline-Wert verhindert:

- **Sechs der sieben Qualitätskommandos wurden real ausgeführt**, mit Exit-Code, Dauer und Zählungen; das siebte ist mit belegter Ursache als `BLOCKED_ENVIRONMENT` klassifiziert und durch eine gleichwertige Ersatzmessung abgedeckt (§13.3).
- **Vier Kommandos sind grün** — typecheck (0 Fehler), Tests (18/18), Build (0 Warnungen), Farb-Guard (0 Verstöße). Für die Baseline war das bisher **unbewiesen**, weil CI sie nie erfasst hat.
- **Die beiden roten Kommandos sind vollständig diagnostiziert**, nicht nur gezählt: 86 % des Lint-Rauschens stammt aus einem Archivordner, 38 % der Format-Befunde aus untracked Dateien dieser Analysekette. Die 18 echten Codebefunde sind einzeln aufgeführt.
- **Eine frühere Fehlaussage dieser Analysekette wurde gefunden, belegt und korrigiert** (§9.2) — inklusive der Konsequenzen für zwei bestehende Dokumente und eine Repository-Memory.
- **Drei Master-Scope-Altlasten wurden von „gelesen" zu „gemessen" befördert** (`/de/services` = 200, ein einziger `lastmod`, 30 Legal-Sitemap-Einträge trotz `noindex`), ebenso die 287-kB-Chunk-Altlast.
- **Nichts wurde repariert**, und `git status` ist vor und nach dem Lauf byte-identisch (§3.3).

**Warum WITH WARNINGS.** Vier Bedingungen begleiten diese Baseline:

1. **Zwei von sieben Gates sind rot** (F-01, F-02). Inhaltlich sind sie überwiegend Altlast außerhalb des Anwendungscodes — als Gate-Blocker sind sie dennoch wirksam: solange sie rot sind, kann keine gegatete Linie grün werden, und jede spätere PR scheitert aus einem Grund, der nichts mit ihrem Inhalt zu tun hat.
2. **Die Baseline war nie gegatet und konnte es nie sein** (Q1). Das ist der Grund, warum §7 und §8 überhaupt Befunde zeigen — und es bedeutet, dass **jede** Aussage über „vorher grün" für diese Linie unbelegt war.
3. **Der einzige laufende E2E-Guard prüft nicht, was er zu prüfen scheint** (Q3) und kann auf Entwicklermaschinen gegen eine fremde Anwendung laufen (Q4). Von zwölf Launch-Gates sind elf ohne jede Automatisierung (§17).
4. **Der Build hat die `dist`-Baseline ersetzt** (Q10). Kein Dienst ist betroffen, aber ein künftiger Preview-Start serviert einen Build inklusive der uncommitteten Änderung. Wer den reinen Baseline-Stand braucht, muss aus einem sauberen Checkout neu bauen.

Keine dieser Warnungen macht die Messung unbrauchbar. Alle vier bestimmen mit, was AP01 und AP27
zuerst herstellen müssen, bevor die übrigen Arbeitspakete auf eine gegatete Linie merged werden können.

---

_Erstellt durch Ausführung und read-only Inspektion am 2026-08-21 gegen `feat/home-leadmagnet@961f65d`.
Geändert wurde ausschließlich diese Datei; zusätzlich wurde der gitignorierte Build-Ordner `dist/` durch
den ausdrücklich beauftragten `npm run build` neu erzeugt (§11.3). Kein Quellcode, keine Konfiguration,
keine Dependencies, keine Lockfiles, keine Branches, keine Commits, kein Deployment und kein kanonisches
`building-docs/`-Dokument wurde verändert. `git status` ist vor und nach dem Lauf identisch. Nichts wurde
gestaged, committet oder gepusht. Es wurde kein Dienst neu gestartet, kein Formular abgesendet und keine
Fehlfunktion behoben. Keine Secret-Werte werden wiedergegeben._
