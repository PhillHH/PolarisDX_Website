# AP01 Reconciliation Result

**Arbeitspaket:** AP01 — Repository-Baseline, Branch-Reconciliation und Import-Hygiene
**Kanonische Baseline:** `feat/home-leadmagnet@961f65d`
**Selektive Quellstände (in PT01.1 nur auf Existenz geprüft, nichts übernommen):**
`main@d0fdf29`, `redesign/preview@5673b61`
**Zweck:** protokolliert ausschließlich das **tatsächlich ausgeführte** Ergebnis von AP01.
Kein Ersatz für `BRANCH-RECONCILIATION-MAP.md`, `REPO-BASELINE.md`, `QUALITY-GATES.md`,
`RISK-REGISTER.md` oder `scope/MASTER-SCOPE.md`.

**Ausführungsstand:** PT01.1 `PASS` · PT01.2 `PASS` · PT01.3–PT01.5 `NOT_RUN` · AP01 Closure `NOT_RUN`.

---

## 1. Baseline Evidence

**Erhoben:** 2026-08-24, PT01.1, empirisch gegen Git und einen isolierten Clean Checkout.

### 1.1 Git-Identität (ST01.1.1)

| Prüfung | Befund |
| --- | --- |
| Aktiver Branch | `console/ap01-2026-08-24T10-46-05` (kein `main`/`master`) |
| Aktueller HEAD | `4f70801d4a3166c1caccc69bb3b7b7f254ac044c` |
| HEAD-Betreff | `Merge console/ap00-2026-08-24T09-32-23 in feat/home-leadmagnet` |
| `feat/home-leadmagnet` | zeigt auf denselben Commit `4f70801` |
| Remote | `origin` → `git@github.com:PhillHH/PolarisDX_Website.git` |
| Upstream des aktiven Branch | **keiner** (`@{u}` nicht konfiguriert) |
| Working Tree vor PT01.1 | nur `?? building-docs/work-packages/AP01.md` (untracked AP01-Spezifikation, eindeutig identifiziertes pre-existing Artefakt) |
| Baseline-Commit `961f65d` | existiert (`961f65d456e2790e7063d1a6575651dff724e4ca`, 2026-08-18 12:40:10 +0200, „Epigenetik-Strecke: GenDG-Hinweis auch auf den vier Panels ohne Genotypen") |
| Baseline ist Ancestor von HEAD | **JA** (`git merge-base --is-ancestor 961f65d HEAD` → rc 0) |
| Lokale Branches mit `961f65d` | `console/ap00-…`, `console/ap01-…`, `feat/home-leadmagnet` |
| Remote-Sicherung | `origin/console/ap00-2026-08-24T09-32-23` enthält `961f65d`; `git diff origin/console/ap00-… HEAD` ist **leer** → der HEAD-Tree ist inhaltlich vollständig remote gesichert |
| `main@d0fdf29` | erreichbar (`d0fdf29cb1dbde78cc743b4d7a5077b79c6dafaf`) — **nicht importiert** |
| `redesign/preview@5673b61` | erreichbar (`5673b611de5225c52fd304c874389c58dee85a14`) — **nicht importiert** |

### 1.2 Delta Baseline → HEAD

`git diff --stat 961f65d HEAD`: **46 Dateien, 20 288 Zeilen, ausschließlich Additionen, ausschließlich `.md`.**

- `building-docs/**` (AP00-Governance-Kanon), `projektverzeichnis/**`, sieben Analyse-`.md` im Root.
- **Anwendungscode-Delta: NONE.** Kein `src/**`, kein `server.ts`, kein `public/**`, kein
  `package.json`, kein Lockfile, keine tsconfig/Vite-/Docker-/nginx-/CI-Datei.
- `src/pages/EpigeneticsPage.tsx`: `git diff 961f65d HEAD -- src/pages/EpigeneticsPage.tsx` ist **leer**
  — die Pre-AP01-Hygiene ist bestätigt.

### 1.3 Startvoraussetzungen AP00 → AP01

| Voraussetzung | Befund |
| --- | --- |
| AP00 `COMPLETE`, Closure `PASS` | bestätigt (`state/AP-STATE.md`) |
| Next work package `AP01` | bestätigt |
| AP01 noch nicht gestartet | bestätigt (`AP01-RECONCILIATION-RESULT.md` existierte vor PT01.1 nicht) |
| Decision Locks | **18/18 `LOCKED`** (`DECISIONS.md`, gezählt) |
| `RISK-007` | `MITIGATING` — AP00-Linie auf `origin` gesichert |
| Keine AP00-blockierenden Probleme | bestätigt |

**Abweichung, dokumentiert:** `AP-STATE.md` führte vor PT01.1 `Current HEAD: 0c58d44`, real ist
`4f70801`. Ursache: die Pre-AP01-Hygiene-Commits `9ee8199`, `d98a6b7`, `5f6fc3b` und der Merge `4f70801`
sind nach dem letzten State-Schreibvorgang entstanden. Gemäß Abweichungsregel (`AGENT-CONTRACT.md` §7)
wurde der vollständige AP01-Bootstrap-Kontext neu geladen. Der State wird mit PT01.1 nachgezogen.

### 1.4 Isolierter Clean Checkout (ST01.1.2)

- Temporärer, detachter Worktree `/home/phillip/01polaris-ap01-baseline` exakt auf `961f65d`,
  außerhalb des aktiven Arbeitsverzeichnisses. `git status` dort: sauber.
- Kein `git reset --hard`, kein `git clean`, kein Rebase, kein Merge, kein Force Push im aktiven
  Arbeitsverzeichnis. Aktiver Branch und HEAD sind unverändert `4f70801`.
- Nach Beweissicherung kontrolliert entfernt (`git worktree remove` + `prune`); Verzeichnis existiert
  nicht mehr, aktiver Branch weiterhin `4f70801` mit unverändertem Working Tree.
- Nebenwirkungsschutz: `npm ci` führt das Root-`prepare`-Script `lefthook install` aus, das die
  **geteilten** Hooks unter `/home/phillip/01polaris/.git/hooks` schreibt. Die Hooks wurden vorher
  gesichert und danach byte-identisch wiederhergestellt (`diff -r` ohne Unterschied).

### 1.5 Toolchain-Reproduktion (ST01.1.3)

Package Manager aus Repository-Evidenz: **npm**, ein `package-lock.json` (lockfileVersion 3), kein
`yarn.lock`/`pnpm-lock.yaml`/`bun.lockb`. `package.json` deklariert **weder `engines` noch
`packageManager`**. `.npmrc`: `legacy-peer-deps=true`.

Verwendete Laufzeit: **Node v20.19.6 / npm 10.8.2** (entspricht der in `REPO-BASELINE.md` §5.1
gemessenen lokalen Laufzeit; CI und Frontend-Image pinnen 22, `server/Dockerfile` 20 → `RD-4`/`QD-10`).

| Check | Kommando | Ergebnis | Klassifikation |
| --- | --- | --- | --- |
| Clean Install (Frontend) | `npm ci` | **PASS** (rc 0) | — |
| Clean Install (Backend-Paket) | `npm ci` in `server/` | **PASS** (rc 0) | — |
| Lockfile-Mutation | SHA-256 vor/nach für `package.json`, `package-lock.json`, `server/package-lock.json` | **unverändert** | — |
| Typecheck | `npm run typecheck` (`tsc -b`) | **PASS** | — |
| Unit Tests | `npm test` (vitest) | **PASS — 7 Dateien, 18/18 Tests** | — |
| Design-/Token-Guard | `npm run check:colors` | **PASS** | — |
| Build | `npm run build` (client + SSR) | **PASS**, `dist/client` 24 MB, `dist/server` 19 MB, ~8,6 s | — |
| Lint | `npm run lint` (`eslint .`) | **FAIL — 129 Probleme** (125 Fehler, 4 Warnungen); Verteilung: `_project-knowledge/` 111, `src/` 17, `server.ts` 1 | **A — bekannte Baseline Debt** (`QUALITY-GATES.md` QD-1, exakt reproduziert) |
| Format | `npm run format:check` (`prettier --check .`) | **FAIL — 36 getrackte Dateien** | **A — bekannte Baseline Debt** (QD-2; die dort genannten 22 untracked Dateien existieren im Clean Checkout nicht) |
| E2E | `npm run test:e2e` | **NICHT AUSGEFÜHRT** | **C — bewusst ausgelassen:** `playwright.config.ts` nutzt `reuseExistingServer: !CI` gegen Port 3000, auf dem ein fremder Prozess läuft (`QUALITY-GATES.md` QD-4/`RD-4`). Ein Lauf wäre nicht beweiskräftig (QG-01) und hätte fremde Prozesse berührt. |

**Zusätzlicher, in PT01.1 erstmals reproduzierter Befund (Klasse B):** ein Clean Checkout mit
**nur** Root-`npm ci` lässt `npm test` **rot** laufen — `server/server.test.js` bricht mit
`Cannot find module '@sendgrid/mail'` ab (12/12 statt 18/18), weil `vitest.config.ts` `server/**`
einschließt, das Root-`npm ci` aber die Dependencies des eigenständigen Pakets `server/` nicht
installiert. Erst nach `npm ci` **auch** in `server/` sind es 18/18. Kein Codefehler, sondern eine
fehlende Zusage im Toolchain-Vertrag. → Owner **AP01 PT01.5.3/PT01.5.4** (Node-/Paketmanager-Vertrag,
Lockfile-Konsistenz), Nachweis **AP27 PT27.6**.

### 1.6 SSR-Baseline-Smoke (ST01.1.4)

Gestartet aus dem **gebauten** Baseline-Stand im isolierten Checkout:
`NODE_ENV=production PORT=39017 BACKEND_URL=http://127.0.0.1:39999 npx tsx server.ts`
auf einem vorab als frei verifizierten, isolierten Port. **Kein vorhandener Dev-/Preview-Prozess wurde
übernommen oder getestet.** Server nach Abschluss beendet, Port wieder frei.

| Pfad | Erwartet | Gemessen |
| --- | --- | --- |
| `/de/` | 200 | **200** |
| `/de/about` | 200 | **200** |
| `/de/epigenetics` | 200 | **200** |
| `/en/consumer/vitamin-d3-spray` | 200 | **200** |
| `/agb` | 301 → kanonisch | **301 → `/de/terms`** |
| `/de/agb` | 301 → kanonisch | **301 → `/de/terms`** |
| `/s3-leitlinie` | 301 → kanonisch | **301 → `/de/s3_leitlinie`** |
| `/about` | 301 → Default-Locale | **301 → `/de/about`** |
| `/` | 301 → Default-Locale | **301 → `/de/`** |
| `/diagnostics/dental` | 301 → Default-Locale | **301 → `/de/diagnostics/dental`** |
| `/de/diese-seite-existiert-definitiv-nicht-ap01` | echte 404 | **404** |
| `/de/gibt-es-nicht/tiefer/pfad` | echte 404 | **404** |
| `/de/diagnostics/kein-service-ap01` (unbekannter Slug) | echte 404 | **404** |
| `/de/articles/kein-artikel-ap01` (unbekannter Slug) | echte 404 | **404** |
| `/de/epigenetics/musterbefund/kein-panel-ap01` (unbekannter Slug) | echte 404 | **404** |

**Ein-Hop-Nachweis** (`curl -L`, `num_redirects`): `/agb`, `/s3-leitlinie`, `/about`, `/` → jeweils
**genau 1 Hop**, Endstatus 200. Keine Kette, keine Schleife (`R-04`).

**Weitere Laufzeitinvarianten:**

- `/api/does-not-exist` → **504** (Proxy zum nicht laufenden Backend), **kein** SSR-Catch-all → `RT-20` erfüllt.
- `/locales/de/common.json` → **200**, keine Sprachumleitung → `RT-21` erfüllt.
- `/robots.txt` → **200**, keine Sprachumleitung.
- `/sitemap.xml` → **200**, **335 `<loc>`**.

### 1.7 Cache-/`no-store`-Vertrag (runtime-seitig)

Gemessen an echten Responses, nicht aus dem Quellcode abgeleitet.

- **HTML (200 und 404):** `Cache-Control: no-store, no-cache, must-revalidate` — auf `/de/`,
  `/de/about`, `/de/epigenetics`, `/en/consumer/vitamin-d3-spray` und auf beiden 404-Antworten.
  → `RT-18` erfüllt, Baseline-Härtung reproduziert.
- **Gehashtes Asset** (`/assets/index-Bt14jJZX.js`): `Cache-Control: public, max-age=31536000, immutable`
  → korrekte Asymmetrie HTML vs. Assets.
- **Security-Header** auf HTML: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`,
  `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy: camera=(), microphone=(), geolocation=()`,
  `Content-Security-Policy-**Report-Only**` (nicht enforcing; enthält u. a. `widget.hihuman.co.uk`).
  **Kein `Strict-Transport-Security`** — bekannte Debt, Owner AP26.

### 1.8 SEOHead-/notFound-Handshake

| Prüfung | Befund |
| --- | --- |
| Reale Seite `/de/about` — Canonical | `<link rel="canonical" href="https://polarisdx.net/de/about">` — genau eine |
| Reale Seite — hreflang | **11** `rel="alternate"`-Links: 10 Sprachen + `x-default` → `/de/about` |
| Reale Seite — robots | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` |
| Reale Seite — `og:locale` / `og:locale:alternate` | vorhanden (`de_DE` + Alternates) |
| Reale Seite — Title | SSR-gerendert via Helmet (`data-rh="true"`), nicht der `index.html`-Fallback |
| 404-Seite — HTTP-Status | **404** (echt, nicht 200 mit NotFound-Optik) |
| 404-Seite — Marker | `<meta name="prerender-status-code" content="404">` vorhanden |
| 404-Seite — Canonical | **0** |
| 404-Seite — hreflang | **0** |
| 404-Seite — `og:locale:alternate` | **0** |
| 404-Seite — robots | `noindex, follow` |
| 404-Seite — Title | `Seite nicht gefunden (404) | PolarisDX`, SSR-gerendert |

Der Handshake `SEOHead notFound` → `NOT_FOUND_MARKER` in `server.ts:314`/`:651` funktioniert
runtime-seitig. `S-04`, `S-05`, `R-05`, `R-06`, `RT-16` sind an der Baseline reproduziert.

### 1.9 Decision-Lock-Evidenz an der Baseline

| Lock | Gemessen im Clean Checkout |
| --- | --- |
| `DEC-RL-002` Sales-Machine | Art-Direction-Fingerprint in `tailwind.config.js`: eine Navy `#083358` (`brand.navy`/`brand.deep`), ein Blau `#0d527f`, `check:colors` **PASS** |
| `DEC-RL-003` Light Theme | `darkMode` in `tailwind.config.js`: **0 Vorkommen**; `dark:`-Klassen in `src/**`: **0** |
| `DEC-RL-008` `CV < 2 %` | 183 Fundstellen in `src/` + `public/locales/`; in **allen 10** Locales (`cs da de en es fr it nl pl pt`); Vorkommen von `CV < 5 %`: **0** |
| `DEC-RL-012` Garantie-Band | kein Garantie-/Guarantee-CTA-Band in `src/**`; **kein** `CtaSection`-Modul vorhanden |
| `DEC-RL-004` / `REST-02` Consent | `src/lib/tracking.ts` ist bewusst inaktiv (kein Provider, kein Puffer, kein Storage); `src/components/ui/CookieBanner.tsx` vorhanden. **Aber:** `index.html` lädt GTM `GTM-TW6JFX7K` **unbedingt** (Zeile 79) mit Consent-Mode-v2-Default `denied` — das ist Basic Consent Mode **ohne** vollständigen Ladeverzicht → Debt, Owner AP23 |
| `DEC-RL-007` Kein Chat | Chat-Reste vorhanden: `widget.hihuman.co.uk` in der CSP von `server.ts` → Klassifikation gehört zu **PT01.4** |

### 1.10 Bestehende Quality-Guards an der Baseline (Inventar)

- npm-Scripts: `typecheck`, `lint`, `format`/`format:check`, `test` (vitest), `test:e2e` (Playwright),
  `check:colors`, `build`, `build:client`, `build:server`, `start`/`preview` (identisch), `server`, `prepare`.
- `lefthook.yml` pre-commit: prettier `--write` + eslint `--fix` auf staged files, `tsc -b --noEmit`,
  `node scripts/check-color-tokens.mjs`.
- `.github/workflows/ci.yml`: ein Job `quality`, Node 22, Trigger **nur** `pull_request`/`push` auf
  `main`; Schritte: `npm ci`, Typecheck, Lint, Format check, Unit tests, Build, Playwright-Browser.
- `e2e/url-smoke.spec.ts` — einziger Routen-Guard.
- `scripts/`: `check-color-tokens.mjs` (verdrahtet, pre-commit), `check-i18n-home.mjs` und
  `check-meta-descriptions.mjs` (**vorhanden, nirgends verdrahtet**), dazu `prerender.mjs`,
  `convert-og-image.mjs`, `optimize-images.mjs`, `debug/`, `i18n/`.

---

## 2. Baseline Guards

**MUST SURVIVE PT01.2 / PT01.3 IMPORTS.**

Diese Invarianten sind an `961f65d` empirisch belegt (§1) bzw. als bindender Decision Lock gesetzt.
Ein Import aus `main@d0fdf29` oder `redesign/preview@5673b61` darf keine davon verschlechtern.
Nach jedem Import sind mindestens die runtime-geprüften Guards (BG-01 bis BG-05) erneut auszuführen.

| ID | Guard | Status an der Baseline | Verifikationsmethode nach jedem Import |
| --- | --- | --- | --- |
| **BG-01** | **Echte 404** — unbekannte statische Pfade und unbekannte dynamische Slugs dürfen nicht in HTTP 200 degradieren | **PASS** (§1.6) | HTTP-Status exakt `=== 404`, nicht sichtbarer Text (`QUALITY-GATES.md` §5.3) |
| **BG-02** | **SEOHead/notFound-Handshake** — `prerender-status-code`-Marker und `NOT_FOUND_MARKER` bleiben byte-identisch gekoppelt; 404 ohne Canonical/hreflang/`og:locale:alternate`, robots `noindex, follow` | **PASS** (§1.8) | HTML einer 404-URL prüfen; `SEOHead.tsx` und `server.ts` nie als Datei aus `main` übernehmen (**N1**, **N2**) |
| **BG-03** | **Legacy-/Locale-301s** — `/agb` → `/de/terms`, `/s3-leitlinie` → `/de/s3_leitlinie`, unpräfixierte Pfade → `/de/…`; echte 301, genau ein Hop | **PASS** (§1.6) | Statuscode **und** `Location` **und** Hop-Zahl; kein 302, kein clientseitiges `<Navigate>` als Ersatz |
| **BG-04** | **HTML-Cache** — HTML trägt `no-store, no-cache, must-revalidate`; gehashte Assets bleiben `max-age=31536000, immutable` | **PASS** (§1.7) | Response-Header messen, nicht Quellcode grepen |
| **BG-05** | **Canonical/hreflang** — genau ein Canonical je URL; 10 Sprachen + `x-default` auf `/de/…`; SSR-gerenderter Helmet-Title statt `index.html`-Fallback | **PASS** (§1.8) | HTML einer realen Seite prüfen |
| **BG-06** | **Sales-Machine bleibt Art Direction** (`DEC-RL-002`) — keine alternative Art Direction aus `redesign/preview` | **PASS** (§1.9) | `npm run check:colors`; Farb-Token-Fingerprint gegen `tailwind.config.js` der Baseline |
| **BG-07** | **Light Theme** (`DEC-RL-003`) — keine Dark-Theme-Tokens, kein `darkMode`, keine `dark:`-Varianten | **PASS** (§1.9) | `grep -c darkMode tailwind.config.js` = 0; `grep -rn 'dark:' src` = 0 |
| **BG-08** | **Garantie-CTA-Band bleibt entfernt** (`DEC-RL-012`) — kein Wiedereinzug, kein Ersatzband | **PASS** (§1.9) | kein `CtaSection`/Garantie-Band im Import-Diff (`main`-Negativimport, PT01.2 ST01.2.6) |
| **BG-09** | **IglooPro-Claim `CV < 2 %`** (`DEC-RL-008`) — kein Rollback auf `< 5 %` | **PASS** (§1.9) | Vorkommen `CV < 5` muss 0 bleiben; `CV < 2 %` in allen 10 Locales |
| **BG-10** | **Consent/Tracking — keine Verschlechterung** (`DEC-RL-004`, `REST-02`) — kein zusätzliches Pre-Consent-Tracking, kein Event-Puffer, kein Tracking-Bypass | **BASELINE_DEBT** (§1.9) — `src/lib/tracking.ts` ist korrekt gesperrt, aber `index.html` lädt GTM unbedingt | Import darf die Zahl der Pre-Consent-Provider-Requests nicht erhöhen; keine `dataLayer`-/GTM-Logik aus `main` blind übernehmen |
| **BG-11** | **Preview-/`DRY_RUN`-Sicherheit** — `DRY_RUN` als globaler Kill-Switch für ausgehende Mails in `server/server.js:55` bleibt wirksam; Preview erzeugt keine produktiven CRM-/Mail-/Queue-Wirkungen (`RT-29`) | **PASS** (§1.10, `server/server.js:51–62`, `:571`) | `DRY_RUN`-Zweig im Diff prüfen; `server/server.js` nie als Datei aus `main` übernehmen |
| **BG-12** | **Bestehende Quality-Guards** — `typecheck`, `test` (18/18), `check:colors`, `build`, `lefthook.yml`, `ci.yml`, `e2e/url-smoke.spec.ts`, `scripts/check-*.mjs` dürfen nicht entfernt oder durch Branch-Varianten ersetzt werden | **PASS** (§1.10) | Guard-Inventar aus §1.10 nach jedem Import gegenprüfen; Lint-/Prettier-Fehlerzahl darf **nicht wachsen** (`QUALITY-GATES.md` §6.1) |

**Zusätzliche verbindliche Guards aus den Contracts (gelten unverändert, hier referenziert statt dupliziert):**

- `ROUTING-CONTRACT.md` **M-04** / **§9**: `server.ts` und `src/App.tsx` **nie als Datei** aus `main`
  übernehmen (**N1**, **N12**) — nur Hunks. `isKnownPath`, `KNOWN_PATHS`, `NOT_FOUND_MARKER`,
  `Cache-Control: no-store` nicht entfernen/umbenennen. `GermanOnlyPage` nicht außerhalb AP08 PT08.4.3 entfernen.
- `SEO-CONTRACT.md` **M-02** / **S-17**: `SEOHead.tsx` nie als Datei aus `main` (**N2**);
  `GERMAN_ONLY_PATHS` in `SEOHead.tsx` und `server.ts` synchron halten.
- `RUNTIME-CONTRACT.md` **M-02**: `server.ts` und `server/server.js` nie als Datei aus `main`.
- `AGENT-CONTRACT.md` §2 Regel 9: kein Branch-Merge, kein branchweiter Cherry-Pick, kein
  `git checkout <ref> -- <pfad>` für eine Datei, die auf der Baseline ebenfalls existiert.

---

## 3. `main` Import Ledger

**Ausgeführt:** PT01.2, 2026-08-24.
**Quelle — verifiziert:** `main@d0fdf29cb1dbde78cc743b4d7a5077b79c6dafaf` (2026-08-19 17:02:08 +0200,
„Epigenetik-Strecke: AP4 — die laengste Seite der Site"). `git cat-file -t` → `commit`;
`git branch -a --contains d0fdf29` → `main`, `origin/main`. Jeder Kandidat wurde mit
`git show d0fdf29:<pfad>` gegen **genau diesen** Commit geprüft; kein `origin/main`-Tip, kein späterer
Commit, kein Branch-Merge, kein Whole-Tree-Checkout.
**Methode:** dateiweise bzw. hunkweise Übernahme. Kein `git merge`, kein `git cherry-pick`,
kein `git checkout d0fdf29 -- …`.

### 3.1 Importmatrix

Typ: `FILE` = ganze Datei · `HUNK` = einzelne Hunks in einer bestehenden Baseline-Datei.
Aktion: `IMPORT` = unverändert · `ADAPT` = übernommen mit dokumentierter Abweichung · `REJECT` = nicht übernommen.

| Gr. | Audit | Quelle (`d0fdf29`) | Ziel | Typ | Aktion | Abhängigkeiten | Guards | Begründung / Abweichung |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **M2** | A1 | `src/components/epigenetics/tokens.ts` | identisch | FILE | **IMPORT** (byte-identisch) | keine — reine Konstanten | BG-06, BG-07 | Auf der Baseline nicht vorhanden. Null Importe, keine Layout-/Art-Direction-Berührung. `diff` gegen `d0fdf29` = leer. |
| **M2** | A2 | `src/components/epigenetics/EpiSubpage.tsx` | identisch | FILE | **ADAPT** | `seo/index`, `ui/Breadcrumbs`, `ui/ChapterNav`, `ui/PageTransition`, `ui/Reveal`, `./tokens`, `lib/translationStatus`, `lib/useScrollDepth` — **alle auf der Baseline vorhanden** | BG-06, BG-07, BG-10, BG-12 | Drei dokumentierte Abweichungen, siehe §3.2 **AD-1**, **AD-2**, **AD-3**. |
| **M1** | A3 | `src/pages/EpigeneticsBasicsPage.tsx` | identisch | FILE | **ADAPT** | `EpiSubpage`, `tokens`, `ui/SectionHeader`, `ui/Reveal`, `befund/BefundCharts` (`ScaleRamp`), `lucide-react` | BG-06 | Abweichung **AD-1** + Prettier-Normalisierung (§3.2 **AD-4**). |
| **M1** | A3 | `src/pages/EpigeneticsEvidencePage.tsx` | identisch | FILE | **ADAPT** | `EpiSubpage`, `tokens`, `ui/Reveal`, `lucide-react` | BG-06, BG-10 | Abweichungen **AD-1**, **AD-2**. |
| **M1** | A3 | `src/pages/EpigeneticsDocsPage.tsx` | identisch | FILE | **ADAPT** | `EpiSubpage`, `tokens`, `ui/Reveal`, `react-router-dom`, `lucide-react` | BG-06, BG-10 | Abweichungen **AD-1**, **AD-2**, **AD-4**. |
| **M3** | A6 | `src/content/befunde/meta.ts` | identisch | FILE | **IMPORT** (byte-identisch) | keine — JSON-frei | BG-01 | Typen (`Befund`, `BefundSprachen`), `BEFUND_ORDER`, `RADAR_VALUES`. Enthält **keine** Inhalte; die zwölf Content-JSONs bleiben unangetastet in `index.ts`. `diff` gegen `d0fdf29` = leer. |
| **M4** | A5 | `src/pages/musterbefund/metabolic-health.tsx` | identisch | FILE | **IMPORT** (byte-identisch) | eigene zwei JSON, `befunde/meta`, `MusterbefundPage` | BG-01 | 20 Zeilen, je Slug ein eigener Vite-Chunk. |
| **M4** | A5 | `src/pages/musterbefund/healthy-aging.tsx` | identisch | FILE | **IMPORT** (byte-identisch) | s. o. | BG-01 | s. o. |
| **M4** | A5 | `src/pages/musterbefund/biologische-altersuhr.tsx` | identisch | FILE | **IMPORT** (byte-identisch) | s. o. | BG-01 | s. o. |
| **M4** | A5 | `src/pages/musterbefund/telomer-analyse.tsx` | identisch | FILE | **IMPORT** (byte-identisch) | s. o. | BG-01 | s. o. |
| **M4** | A5 | `src/pages/musterbefund/stress-monitor.tsx` | identisch | FILE | **IMPORT** (byte-identisch) | s. o. | BG-01 | s. o. |
| **M4** | A5 | `src/pages/musterbefund/healthy-sport.tsx` | identisch | FILE | **IMPORT** (byte-identisch) | s. o. | BG-01 | s. o. |
| **M5** | A7 | `src/content/befunde/index.ts` | identisch | HUNK | **ADAPT** | `./meta` | BG-01, BG-12 | Typ-/Metadaten-Definitionen durch Re-Export aus `./meta` ersetzt (`export type { Befund, BefundSprachen }`, `export { BEFUND_ORDER, RADAR_VALUES }`); `BEFUNDE` und die zwölf JSON-Importe bleiben unverändert. Alle bisherigen Exporte bleiben verfügbar — `panelNames.test.ts` läuft unverändert grün. |
| **M5** | A7 | `src/pages/MusterbefundPage.tsx` (**G3-Hotspot**) | identisch | HUNK (3 Stück) | **ADAPT** | `befunde/meta` | **BG-01**, **BG-02** | Nur die Prop-Schnittstelle: (1) Import-Zeile auf `meta` umgestellt, (2) optionale Props `slug?` / `befunde?` mit Rückfall auf `useParams` bzw. `BEFUNDE`, (3) Lookup `quelle = befunde ?? BEFUNDE[slug]`. **Nicht übernommen** aus `main`: der Wegfall von `LanguageFallbackNotice` und der `ArrowUp`/`befund.toTop`-Bedienung (**N13**) sowie `SampleMeta`, `useMerkliste`, `PANELS`, `trackEvent`. Der `notFound`-Zweig mit `SEOHead notFound` bleibt unverändert — unbekannte Slugs antworten weiter echt 404. |
| **M5** | A4 + A5 | `src/App.tsx` (**G3-Hotspot**) | identisch | HUNK (2 Stück) | **ADAPT** | die neun importierten Module | **BG-01** | (1) Neun `lazy()`-Importe; (2) neun `<Route>`-Blöcke. Die sechs expliziten Musterbefund-Routen stehen **vor** dem `:slug`-Auffangpfad, der Auffangpfad bleibt letzter Eintrag der Familie (`ROUTING-CONTRACT.md` **R-08**). Nicht übernommen: alles Übrige aus `main`s `App.tsx`, insbesondere der Wegfall von `GermanOnlyPage` (**N12**). |
| **M5** | A10 | `server.ts` (**G3-Hotspot**) | identisch | HUNK (1 Stück) | **ADAPT** | — | **BG-01**, **BG-03**, **BG-04** | Genau drei `SITEMAP_ROUTES`-Einträge für die Vertiefungsseiten (+2 Kommentarzeilen). `KNOWN_PATHS` wird aus `SITEMAP_ROUTES` abgeleitet — **das** ist der Grund, warum die Datei editiert und niemals ersetzt wird. `isKnownPath`, `KNOWN_PATHS`, `EXTRA_KNOWN_PATHS`, `NOT_FOUND_MARKER`, `LEGACY_PATH_REDIRECTS`, `no-store` und die Locale-301-Kette sind unverändert. Die sechs Musterbefund-Sitemap-Einträge existierten bereits auf der Baseline — kein Hunk nötig. |
| — | A8 | `src/components/ui/ChapterNav.tsx` | — | HUNK | **REJECT (DEFER)** | — | BG-10, BG-12 | `onClick?: () => void` auf `NavAction` war nur für die `trackEvent`-Instrumentierung nötig, die PT01.2 nicht übernimmt (**AD-2**). `data-chapterbar=""` und das `sr-only`-Switcher-Label sind für M1–M4 **nicht** erforderlich — sie gehören zu A9 (AP10/AP24) bzw. AP24. Der `text-heading`→Legacy-Umbenennungs-Hunk derselben Datei ist Teil von **N4** und bleibt abgelehnt. |
| — | A9, A11–A16, A17–A21 | diverse | — | — | **REJECT (DEFER)** | — | — | Außerhalb M1–M5: Anker-Guard (AP10/AP24), `createItemListSchema` (AP09), Funnel-Schluss A12–A14 (AP15), Telefonnummern-Vereinheitlichung (AP08/AP09), `bigResult`/`ZAEHLBAR` (AP16), Umbaukonzept (Referenz), Chat-Entfernung/CSP/Instrumentierung (AP23), `EpigeneticsPanels`/`EpigeneticsTeaserSection` (AP15). |

**Summe:** 9 Dateien neu (`FILE`), davon **6 byte-identisch** zur Quelle und 3 adaptiert;
2 weitere Dateien adaptiert übernommen (`tokens.ts` byte-identisch, `meta.ts` byte-identisch sind darin enthalten);
4 bestehende Dateien per Hunk angepasst; **0 Whole-File-Ersetzungen eines geschützten Hotspots**.

### 3.2 Dokumentierte Abweichungen von der Quelle

| ID | Abweichung | Betroffen | Warum |
| --- | --- | --- | --- |
| **AD-1** | `text-text-heading` → `text-heading` (9 Vorkommen) | `EpiSubpage`, alle drei Vertiefungsseiten | `main` benennt den Ink-Token in `tailwind.config.js` um. Diese Datei ist **N4** und wird nicht übernommen; die Baseline führt den identischen Hex `#083358` unter `heading`. Blueprint §6.1 Schritt 1, Variante B — die Variante, die `tailwind.config.js` **nicht** anfasst. |
| **AD-2** | `trackEvent`-Instrumentierung entfernt: 3 Import-Zeilen und 6 `onClick`-Handler (`epigenetics_request`) | `EpiSubpage`, `EpigeneticsEvidencePage`, `EpigeneticsDocsPage` | `main`s `trackEvent` schreibt direkt in `window.dataLayer` (**N9**). Die Baseline führt eine einwilligungsgebundene, providerneutrale Schnittstelle mit geschlossener Ereignis-Union. Ein fünftes Ereignis darin ist eine **Messplan-Entscheidung von AP23/AP15** (Blueprint §6.1 Schritt 2, ausdrücklich „AP23 gate for AP15"), nicht ein Kompatibilitäts-Hunk von AP01. `src/lib/tracking.ts` bleibt unangetastet. Die Download-Links und der Anfrage-Button funktionieren unverändert — nur die Messung fehlt und wird von AP23/AP15 nachgezogen. `useScrollDepth('epigenetics')` bleibt erhalten: die Baseline-Fassung ist bereits einwilligungsgebunden und signaturkompatibel. |
| **AD-3** | Hero der Vertiefungsseiten: `bg-gradient-to-br from-brand-primary via-brand-deep to-[#203864] text-white` → `bg-brand-deep text-white`; Rahmen `text-gray-900` → `text-heading` | `EpiSubpage` | Die Quellfassung nutzt das Legacy-Navy, das diese Linie abgeschafft hat. Unverändert übernommen **schlug `npm run check:colors` mit 3 Verstößen fehl** — an der Baseline war der Guard grün, das wäre eine neue PT01.2-Regression gewesen (BG-06, BG-12). Die Programmseite `/epigenetics` trägt auf dieser Linie `bg-brand-deep text-white`; die Vertiefungsseiten folgen ihr, statt eine zweite Art Direction aus `main` mitzubringen (`DEC-RL-002`). Guard danach wieder grün. |
| **AD-4** | Prettier-Normalisierung zweier JSX-Zeilen | `EpigeneticsBasicsPage`, `EpigeneticsDocsPage` | Rein mechanische Folge von **AD-1**: die kürzeren Klassennamen lassen zwei `<h2>` in eine Zeile passen. Ohne die Normalisierung wären zwei neue Prettier-Verstöße entstanden — verbotenes Wachstum bestehender Baseline Debt (`QUALITY-GATES.md` §6.1). |

### 3.3 Routing-Aktivierung und Spiegelpflicht

Die drei Vertiefungsseiten und die sechs Musterbefund-Routenmodule sind **aktiv integriert** —
`IMPORTED_NOT_YET_ACTIVATED_BY_SCOPE` trifft **nicht** zu. Grundlage ist `AP01.md` ST01.2.5
(„Route-/Sitemap-Hunks nur so weit wie AP01-Import tatsächlich benötigt") und Blueprint §6.1
Schritte 9–11.

`ROUTING-CONTRACT.md` **M-01** verlangt bei einer Routenänderung die koordinierte Prüfung von fünf
Spiegeln. Ergebnis dieser Prüfung:

| Spiegel | Behandlung in PT01.2 |
| --- | --- |
| `src/App.tsx` | **geändert** — neun Routen, Auffangpfad-Reihenfolge geprüft |
| `server.ts` (`SITEMAP_ROUTES` → `KNOWN_PATHS`) | **geändert** — drei Einträge; die sechs Musterbefund-Pfade waren bereits vorhanden |
| `src/components/seo/SEOHead.tsx` (`GERMAN_ONLY_PATHS`) | **nicht betroffen** — alle neun Routen sind zehnsprachig, keine German-only-Sonderfälle |
| `src/hooks/useSearch.ts` | **bewusst ausgelassen** — der Such-Index führt auf der Baseline auch `/epigenetics` selbst nicht; die Aufnahme ist AP07 PT07.1.9 (`RD-5`). Keine Verschlechterung, aber eine offene Spiegel-Lücke → **D-16**. |
| `e2e/url-smoke.spec.ts` | **bewusst ausgelassen** — der Guard deckt 15 von 38 Sitemap-Pfaden ab und ist laut `QD-5` ohnehin semantisch zu schwach; ein Eintrag dort ist AP10 PT10.4 / AP27 PT27.5. Keine Verschlechterung → **D-16**. |

Navigations-/Footer-Einstieg für die drei Vertiefungsseiten: **nicht gebaut** — `AP01.md` §4.2 führt die
Navigationseinbindung der Epigenetik-Säule ausdrücklich als Out of Scope (AP03/AP06/AP15). Die Seiten
sind heute über die `EpiSubpage`-Querverweise („Weiterlesen") und per Direkt-URL erreichbar.

### 3.4 Validierung

| Prüfung | Ergebnis |
| --- | --- |
| Typecheck (`tsc -b`) | **PASS** |
| Unit Tests (`vitest run`) | **PASS — 7 Dateien, 18/18** (unverändert zur Baseline) |
| Design-/Token-Guard (`check:colors`) | **PASS** (nach **AD-3**) |
| Build (`npm run build`) | **PASS** — je Slug ein eigener Chunk: `metabolic-health`, `healthy-aging`, `biologische-altersuhr`, `telomer-analyse`, `stress-monitor`, `healthy-sport`, dazu `EpigeneticsBasicsPage`, `EpigeneticsEvidencePage`, `EpigeneticsDocsPage`, `EpiSubpage` |
| ESLint | **129 Probleme — unverändert** (`_project-knowledge` 111 · `src` 17 · `server.ts` 1); **0 Befunde in den importierten Dateien** |
| Prettier | **0 Verstöße** in allen PT01.2-Dateien |
| SSR — neue Vertiefungsseiten | `/de/epigenetics/{grundlagen,studienlage,unterlagen}` → **200**, `/en/epigenetics/grundlagen` → **200** |
| SSR — sechs Musterbefunde | alle sechs `/de/epigenetics/musterbefund/<slug>` → **200** mit echtem Inhalt (103–197 KB SSR-HTML) |
| SSR — unbekannter Musterbefund-Slug | `/de/epigenetics/musterbefund/kein-panel-ap01` → **404** |
| SSR — unbekannter Unterpfad | `/de/epigenetics/kein-unterpfad-ap01` → **404** |
| Sitemap | 335 → **365 `<loc>`**; exakt **30** neue Einträge (3 Seiten × 10 Sprachen); die 60 Musterbefund-Einträge unverändert |
| Canonical/hreflang neue Seite | ein Canonical + **11** `rel="alternate"` (10 Sprachen + `x-default`), robots `index, follow` |
| Dependencies / Lockfiles | **keine Änderung** — alle Abhängigkeiten der importierten Dateien (`react-router-dom`, `react-i18next`, `lucide-react`) waren bereits vorhanden |

## 4. `redesign/preview` Import Ledger

**NOT_RUN — PT01.3.** In PT01.1 wurde ausschließlich die Erreichbarkeit von
`redesign/preview@5673b61` verifiziert. Es wurde **nichts** übernommen.

## 5. Rejected / Explicitly Not Imported

**Stand PT01.2.** Jede Zeile wurde nach dem Import repositoryweit gegen den Arbeitsbaum **und** gegen
das Laufzeitverhalten geprüft, nicht nur gegen Dateinamen.

| Abgelehnt | Audit-ID | Nachweis nach dem Import |
| --- | --- | --- |
| **Ganze `server.ts` aus `main`** | N1 | `git diff server.ts` = **genau ein Hunk**, 3 Sitemap-Zeilen + 2 Kommentarzeilen. `isKnownPath`, `KNOWN_PATHS`, `EXTRA_KNOWN_PATHS`, `NOT_FOUND_MARKER`, `LEGACY_PATH_REDIRECTS`, `no-store` alle unverändert vorhanden. |
| **Ganze `src/App.tsx` aus `main`** | N12 | `git diff src/App.tsx` = **zwei additive Hunks** (+89 / −0). `GermanOnlyPage`, `ScrollToHash`, Catch-all-Reihenfolge und Layout-Zuordnung unverändert. |
| **Ganze `SEOHead.tsx` aus `main`** | N2 | `git diff src/components/seo/SEOHead.tsx` = **leer**. `notFound`-Prop und `GERMAN_ONLY_PATHS` unangetastet; 404-Handshake runtime-geprüft. |
| **Ganze `EpigeneticsPage.tsx` aus `main`** | §6.2, A21 | `git diff src/pages/EpigeneticsPage.tsx` = **leer**. |
| **`MusterbefundPage`-Verluste aus `main`** | N13 | `LanguageFallbackNotice` und `befund.toTop`/`ArrowUp` weiterhin in der Datei (3 Treffer). Nur die Prop-Schnittstelle wurde portiert. |
| **`CtaSection` / site-weites Garantie-CTA-Band** | N5 | Kein `CtaSection`-Modul im Baum; kein `cta_section`-Schlüssel in `public/locales/**`. Die Treffer auf „garantierte Performance" liegen ausschließlich in `public/locales/{de,en}/services.json` als Fließtext einer Service-Seite — **identisch zu `961f65d`**, kein CTA-Band, von PT01.2 nicht berührt. |
| **Ersatzband für das Garantie-Band** | `DEC-RL-012` | Nicht gebaut. Keine neue site-weite CTA-Sektion. |
| **`Footer.tsx` aus `main`** | N6 | `git diff` = **leer** — `main`s Footer rendert `<CtaSection />` und hätte das Band zurückgebracht. |
| **`Header.tsx` aus `main`** | N11 | `git diff` = **leer** — `main` verliert die WCAG-2.5.5-Trefferflächen und übersetzte Aria-Labels. |
| **`DealPopup`, `DealHint`, Voucher-/Promo-UI** | N7 | Keine Datei mit `Deal`/`Voucher`/`Promo` im Namen; keine Referenz in `src/**`. |
| **Shop-Reaktivierung (`src/data/products.ts`)** | N15 | Datei existiert nicht. |
| **Case-Study-Reaktivierung** | `DEC-RL-015` | Nicht importiert. |
| **`.bak-nopopup`-Dateien** | N8 | `find . -name '*.bak-nopopup*'` (ohne `node_modules`) = **leer**. |
| **`<5 %`-IglooPro-Claim** | `DEC-RL-008` | `CV < 5` / `CV<5` in `src/**` und `public/locales/**`: **0 Treffer**. `CV < 2 %` in **30** Locale-Dateien. |
| **`main`s `src/lib/tracking.ts` / direktes `dataLayer`-Tracking** | N9 | `git diff src/lib/tracking.ts` = **leer**. Kein `trackEvent(` mehr im Baum (nur eine erklärende Kommentarzeile). Die verbleibenden `window.dataLayer`-Stellen (`src/pages/consumer/*`, `CookieBanner.tsx`) sind **byte-identisch zu `961f65d`** und wurden von PT01.2 nicht berührt. |
| **`CookieBanner.tsx` aus `main`** | N10 | `git diff` = **leer**. |
| **Pre-Consent-GTM/GA4-Verschärfung** | `DEC-RL-004`, `REST-02` | `git diff index.html` = **leer**. Der Ist-Zustand (GTM lädt unbedingt, Consent Mode v2 `default: denied`) ist unverändert — weder verbessert noch verschlechtert; Auflösung bleibt AP23 (`D-15`). |
| **`tailwind.config.js` aus `main` / Legacy-Navy / Dark Theme** | N4, `DEC-RL-003` | `git diff tailwind.config.js` = **leer**. `darkMode`: 0 Vorkommen. `dark:`-Klassen in `src/**`: **0**. `check:colors` **PASS**. |
| **Alternative Art Direction** | `DEC-RL-002` | Der einzige Art-Direction-Konflikt des Imports wurde zugunsten der Baseline aufgelöst (**AD-3**). |
| **`structuredData.ts` aus `main`** | N14 | `git diff` = **leer** — `main` verliert die ISO-8601-Datumsnormalisierung. |
| **`main`s Script-Set / `docs/`-Löschungen** | N18, N19 | Keine Datei entfernt; `scripts/` und `docs/` unverändert. `check-color-tokens.mjs` weiterhin verdrahtet. |
| **`ChapterNav`-Hunks A8 (`onClick`, `data-chapterbar`, `sr-only`)** | A8 | Für M1–M4 nicht erforderlich; `onClick` wäre nur für die abgelehnte Instrumentierung nötig gewesen. `git diff src/components/ui/ChapterNav.tsx` = **leer**. → AP23 / AP24 / AP10. |
| **`index.html` aus `main`** | N3 | `git diff` = **leer** — `main` bringt den globalen deutschen `meta keywords`-Block zurück. |

## 6. Legacy Classification

**NOT_RUN — PT01.4.** Beobachtungen aus PT01.1, die dort zu klassifizieren sind, stehen als Evidenz
in §7 dieses Dokuments; sie sind **keine** Klassifikation.

## 7. Toolchain / Dependency Baseline

**Teilweise erhoben (PT01.1 §1.5); die verbindliche Festlegung ist PT01.5.**

Bereits belegt: npm ist kanonisch (ein `package-lock.json`, lockfileVersion 3); kein `engines`,
kein `packageManager`; `npm ci` reproduziert ohne Lockfile-Mutation; Build, Typecheck, Unit-Tests
und Farb-Guard sind grün; Lint und Prettier sind rot (Baseline Debt).

**Offen für PT01.5:** Node-/Paketmanager-Pinning (`RT-10`/`RT-11`, `QD-10`), Security Advisories
(`npm audit` meldete beim Install 21 Verwundbarkeiten — in PT01.1 **nicht** bewertet), Lockfile-Konsistenz
über beide Pakete, Buildzeit-/Bundle-Baseline nach den Imports.

## 8. Known Remaining Debt

Ausschließlich in PT01.1 **tatsächlich reproduzierte** Defizite. Keines davon ist ein AP01-Fix
in PT01.1; keines setzt PT01.1 auf FAIL.

| # | Befund | Evidenz aus PT01.1 | Kanonische ID | Owner-AP | AP01-blockierend |
| --- | --- | --- | --- | --- | --- |
| D-01 | **`/services*` ist keine echte 301-Brücke** — `/services` → 301 `/de/services` → **200**; die Umleitung nach `/diagnostics` macht ein clientseitiges `<Navigate>` | §1.6, gemessen | `ROUTING-CONTRACT.md` RD-2, `R-13` | **AP10 PT10.1.2** | NO |
| D-02 | **Legal-Seiten in der Sitemap trotz `noindex`** — `/privacy`, `/imprint`, `/terms` × 10 stehen in `sitemap.xml` | §1.6, `sitemap.xml` geprüft | `SEO-CONTRACT.md` SD-2, `S-08` | **AP09 PT09.2.5 / AP20 PT20.4.8** | NO |
| D-03 | **Pauschales Sitemap-`lastmod`** — alle 335 `<loc>` tragen denselben Wert (Abrufdatum) | §1.6, ein einziger `<lastmod>`-Wert | `SEO-CONTRACT.md` SD-1, `S-07` | **AP09 PT09.2.7** | NO |
| D-04 | **Kein HSTS** — HTML-Responses tragen kein `Strict-Transport-Security`; CSP ist **Report-Only** | §1.7, Response-Header | `RT-24`, AP26 PT26.1.2 | **AP26** | NO |
| D-05 | **Consumer nur einsprachig** — `sitemap.xml` führt `/consumer/*` ausschließlich unter `en`; `REST-03` fordert 10 | §1.6, Sitemap-Locale-Auswertung | `SEO-CONTRACT.md` SD-3, `ROUTING-CONTRACT.md` RD-6 | **AP21 PT21.1.8 / AP08** | NO |
| D-06 | **CI deckt die Relaunch-Linie nicht ab** — `ci.yml` triggert nur auf `main`; der aktive Branch hat kein Upstream und war nie automatisch gegatet | §1.1, §1.10 | `QUALITY-GATES.md` QD-3 | **AP27 PT27.6** | NO |
| D-07 | **ESLint rot: 129 Probleme** — 111 in `_project-knowledge/` (Archiv), 17 in `src/`, 1 in `server.ts` | §1.5, exakt reproduziert | `QUALITY-GATES.md` QD-1 | **AP27 PT27.6.7**, a11y-Anteil AP24, Archiv-Ausschluss AP01 PT01.4.4 | NO |
| D-08 | **Prettier rot: 36 getrackte Dateien** | §1.5 | `QUALITY-GATES.md` QD-2 | **AP27 PT27.6.7** | NO |
| D-09 | **E2E nicht beweiskräftig ausführbar** — `reuseExistingServer: !CI` gegen Port 3000, auf dem ein fremder Prozess läuft; Suite wurde deshalb nicht ausgeführt | §1.5 | `QUALITY-GATES.md` QD-4 (+ QD-5 Semantik), `ROUTING-CONTRACT.md` RD-4 | **AP27 PT27.3/PT27.6** | NO |
| D-10 | **Zwei Guard-Skripte nicht verdrahtet** — `check-i18n-home.mjs`, `check-meta-descriptions.mjs`; `check:colors` nur pre-commit, nicht in CI | §1.10 | `QUALITY-GATES.md` QD-6, QD-7, `SEO-CONTRACT.md` SD-6 | **AP27 PT27.6** | NO |
| D-11 | **Toolchain-Drift** — lokal Node 20.19.6, CI 22, Frontend-Image 22, Backend-Image 20; kein `engines`, kein `packageManager` | §1.5 | `QUALITY-GATES.md` QD-10, `RUNTIME-CONTRACT.md` RD-4 | **AP01 PT01.5.3** | NO (eigener späterer PT) |
| D-12 | **Root-`npm ci` allein macht `npm test` rot** — `server/**` ist im vitest-Include, dessen Dependencies installiert das Root-`npm ci` nicht (`Cannot find module '@sendgrid/mail'`, 12/18) | §1.5, erstmals reproduziert | neu (Klasse B) | **AP01 PT01.5.3/PT01.5.4**, Nachweis AP27 PT27.6 | NO |
| D-13 | **Root-`prepare` = `lefthook install` schreibt geteilte Git-Hooks** — `npm ci` in einem beliebigen Worktree mutiert `/home/phillip/01polaris/.git/hooks`; ohne installiertes `lefthook` bricht `npm ci` mit Exit 127 ab | §1.4, beobachtet und durch Backup/Restore neutralisiert | neu (Klasse B) | **AP01 PT01.5.3**, Prozessregel AP33 | NO |
| D-14 | **Chat-Rest in der Laufzeit** — `widget.hihuman.co.uk` steht in der Report-Only-CSP von `server.ts` (`script-src`, `connect-src`, `frame-src`) | §1.7, Response-Header | `DEC-RL-007`, Master-Scope §5 | **AP01 PT01.4.2** (Klassifikation), AP26 (CSP-Finalisierung) | NO |
| D-15 | **GTM lädt vor Consent** — `index.html` lädt `GTM-TW6JFX7K` unbedingt; Consent Mode v2 setzt nur `default: denied`, es gibt keinen Ladeverzicht (`REST-02`) | §1.9, `index.html:79`, Response-HTML | `DEC-RL-004`, `REST-02` | **AP23** | NO |

| D-16 | **Spiegel-Lücke der neun neuen Routen** — `useSearch.ts` und `e2e/url-smoke.spec.ts` führen die drei Vertiefungsseiten nicht; `ROUTING-CONTRACT.md` M-01 nennt fünf Spiegel, PT01.2 hat zwei davon bewusst nicht angefasst | PT01.2 §3.3 | `ROUTING-CONTRACT.md` RD-1/RD-5, `QUALITY-GATES.md` QD-5 | **AP07 PT07.1.9** (Suche), **AP10 PT10.4 / AP27 PT27.5** (Guard) | NO |
| D-17 | **Kein Navigations-/Footer-Einstieg** für die drei Vertiefungsseiten — sie sind nur per Direkt-URL und über die `EpiSubpage`-Querverweise erreichbar (`ROUTING-CONTRACT.md` R-16) | PT01.2 §3.3 | `AP01.md` §4.2 Out of Scope | **AP03 / AP06 / AP15** | NO |
| D-18 | **Messung der Epigenetik-Vertiefungsseiten fehlt** — die aus `main` stammende `epigenetics_request`-Instrumentierung wurde bewusst nicht übernommen (§3.2 AD-2); die Baseline-Ereignis-Union kennt kein passendes Ereignis | PT01.2 §3.2 AD-2 | Blueprint §6.1 Schritt 2 („AP23 gate for AP15") | **AP23 / AP15** | NO |
| D-19 | **PT01.1-Dokumentationsartefakte verletzen Prettier** — `building-docs/AP01-RECONCILIATION-RESULT.md` und `state/AP-STATE.md` stehen in der Prettier-Liste; `QUALITY-GATES.md` QG-09 überlässt die Dokumentationspolitik ausdrücklich AP27 | `prettier --check` über getrackte Dateien | QG-09 | **AP27** | NO |

**Nicht reproduzierbare Baseline-Härtung: KEINE.** Jede in `AP01.md` §0 als zu schützend benannte
Eigenschaft (echte 404, Redirects, `no-store`, SEOHead/404, Canonical/hreflang, Sales-Machine,
Light Theme, kein Garantie-Band, `CV < 2 %`, `DRY_RUN`, vorhandene Guards) wurde an `961f65d`
empirisch bestätigt. Einzig `BG-10` steht an der Baseline bereits auf `BASELINE_DEBT` (D-15) — das ist
der dokumentierte Ist-Zustand, keine verlorene Härtung.

## 9. AP01 Closure Evidence

**NOT_RUN.** Das Closure Gate (`C01-01`–`C01-15`) läuft erst nach PT01.5.

---

## Änderungsprotokoll

| PT | Datum | Ergebnis | Geänderte Dateien |
| --- | --- | --- | --- |
| PT01.1 | 2026-08-24 | **PASS** | `building-docs/AP01-RECONCILIATION-RESULT.md` (neu), `building-docs/state/AP-STATE.md` |
| PT01.2 | 2026-08-24 | **PASS** | **neu:** `src/components/epigenetics/{tokens.ts,EpiSubpage.tsx}`, `src/pages/Epigenetics{Basics,Evidence,Docs}Page.tsx`, `src/content/befunde/meta.ts`, `src/pages/musterbefund/*.tsx` (6) · **Hunks:** `src/App.tsx`, `server.ts`, `src/pages/MusterbefundPage.tsx`, `src/content/befunde/index.ts` · **Doku:** `AP01-RECONCILIATION-RESULT.md`, `state/AP-STATE.md` |

**PT01.1** hat weder Anwendungscode noch Runtime-/Config-Dateien, Dependencies oder Lockfiles verändert.

**PT01.2** hat ausschließlich Anwendungscode im auditierten Import-Umfang verändert. Unverändert
blieben: `package.json`, beide Lockfiles, `tsconfig*`, `vite.config.ts`, `tailwind.config.js`,
`index.html`, Docker-/nginx-/CI-Dateien, `public/**`, `src/lib/tracking.ts`,
`src/components/seo/**`, `src/components/layout/**` und `src/hooks/useSearch.ts`.
