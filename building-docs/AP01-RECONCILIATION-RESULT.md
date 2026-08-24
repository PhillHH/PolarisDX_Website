# AP01 Reconciliation Result

**Arbeitspaket:** AP01 — Repository-Baseline, Branch-Reconciliation und Import-Hygiene
**Kanonische Baseline:** `feat/home-leadmagnet@961f65d`
**Selektive Quellstände (in PT01.1 nur auf Existenz geprüft, nichts übernommen):**
`main@d0fdf29`, `redesign/preview@5673b61`
**Zweck:** protokolliert ausschließlich das **tatsächlich ausgeführte** Ergebnis von AP01.
Kein Ersatz für `BRANCH-RECONCILIATION-MAP.md`, `REPO-BASELINE.md`, `QUALITY-GATES.md`,
`RISK-REGISTER.md` oder `scope/MASTER-SCOPE.md`.

**Ausführungsstand:** PT01.1 `PASS` · PT01.2 `PASS` · PT01.3 `PASS` · PT01.4–PT01.5 `NOT_RUN` · AP01 Closure `NOT_RUN`.

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

**Ausgeführt:** PT01.3, 2026-08-24.
**Quelle — verifiziert:** `redesign/preview@5673b611de5225c52fd304c874389c58dee85a14`
(2026-06-26 13:27:35 +0200, „preview snapshot (incl. uncommitted WIP)").
`git cat-file -t` → `commit`; `git branch -a --contains 5673b61` → `redesign/preview`,
`origin/redesign/preview`. Jeder Kandidat wurde mit `git show 5673b61:<pfad>` gegen **genau diesen**
Commit analysiert. Kein `git merge`, kein Cherry-Pick, kein Tree-Checkout.

**Grundsatz:** `redesign/preview` ist **keine Designquelle** (`DEC-RL-002`, `DEC-RL-003`). Übernommen
wurde ausschließlich der art-direction-neutrale Engineering-/QA-Anteil.

### 4.1 Pattern-Matrix

| Gr. | Audit | Source (`5673b61`) | Target | Type | Dependencies | Decision | Reason | Guards |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **P1** | B4 | `scripts/baseline-screenshots.mjs` | identisch | FILE | `playwright` (vorhanden, jetzt deklariert) | **ADAPT** | Deterministische Viewports (sm/md/lg/xl), ganzseitige Aufnahmen, Overflow-Zusicherung. Einziges art-direction-neutrales Visual-Scaffold des Branches. Routenliste auf Pfade **dieser** Linie umgestellt (inkl. der PT01.2-Epigenetik-Routen); Kopfkommentar stellt klar, dass die Aufnahmen Ist-Stand sind und **keine** visuelle Soll-Vorgabe. | BG-06, BG-07, BG-12 |
| **P1** | X2 | `e2e/styleguide-visual.spec.ts` + CI-Schritt „Visual regression (Pattern Library)" | — | FILE | `src/design-system/**` | **REJECT** | Die Spec fotografiert 20+ Specimens, die ausschließlich im alternativen Design-System (**X1**) existieren. Ohne X1 nicht lauffähig, mit X1 gebrochene Locks. | DN-01, DN-05 |
| **P1** | — | `playwright.config.ts` | — | FILE | — | **ALREADY_PRESENT** | `git diff HEAD 5673b61 -- playwright.config.ts` ist **leer** — identisch. Nichts zu übernehmen. (`reuseExistingServer`-Schwäche bleibt `D-09`/`QD-4`, Owner AP27.) | BG-12 |
| **P2** | B1 | `src/routing/ErrorBoundary.tsx` | identisch | FILE | `react`, `../lib/monitoring` | **IMPORT** (byte-identisch) | Reiner Mechanismus: Klassen-Boundary, `getDerivedStateFromError`, `componentDidCatch` → `reportError`, `reset()`. Null Gestaltung, null Token-Bindung. | BG-01, BG-02 |
| **P2** | B1 | `src/routing/RootErrorBoundary.tsx` | identisch | FILE | `react-i18next`, `./ErrorBoundary` | **ADAPT** | Verhalten übernommen, Darstellung neu geschrieben — siehe §4.2 **PD-1**. Eingehängt **nur im Client**, siehe **PD-2**. | BG-01, BG-02, BG-06, BG-07 |
| **P2** | B1 | `src/routing/SegmentErrorBoundary.tsx` | identisch | FILE | `react-i18next`, `./ErrorBoundary` | **ADAPT** | Wie oben; **noch nicht eingehängt** — wo Segmentgrenzen sitzen, entscheidet die App-Shell-Arbeit von AP06. Bauteil steht bereit. | BG-06, BG-07 |
| **P2** | B1 | `src/routing/index.ts` | identisch | FILE | — | **ADAPT** | Barrel ohne `RouteFallback`. | — |
| **P2** | B1 | `src/routing/RouteFallback.tsx` | — | FILE | — | **REJECT** | Lade-Skelett mit `animate-pulse`, vollständig an die Token-Schicht von **X1** gebunden (`bg-bg-subtle`, `max-w-container`+`var(--tap-target-min)`). Reine Darstellungs-/A11y-Politur → AP06/AP24. Der `Suspense`-Fallback dieser Linie ist bewusst `null` (SSR-HTML bleibt stehen, React 19). | DN-01, DN-03 |
| **P2** | B1 | `public/locales/{de,en}/common.json` → `errors.*` | identisch | HUNK | — | **ADAPT** | 7 Schlüssel je Datei, wortgleich aus der Quelle. **Nur `de` und `en`** — siehe §4.2 **PD-3**. | — |
| **P2** | — | `src/entry-client.tsx` (**G3-Hotspot**) | identisch | HUNK (2 Stück) | `./routing` | **ADAPT** | Import + `<RootErrorBoundary>` um den bestehenden `<Suspense>`. `entry-server.tsx` und `App.tsx` bleiben unangetastet. Siehe **PD-2**. | **BG-01**, **BG-02** |
| **P3** | B2 | `src/lib/monitoring/web-vitals.ts` | identisch | FILE | **keine** | **IMPORT** (byte-identisch) | Nativer Sammler auf `PerformanceObserver` (LCP/CLS/INP/FCP/TTFB) — die Quelle verzichtet bewusst auf die `web-vitals`-Bibliothek. Null Bundle-Kosten, null neue Dependency. | BG-10 |
| **P3** | B2 | `src/lib/monitoring/report.ts` | identisch | FILE | keine | **ADAPT** | **Pflicht-Adaption.** Die Quelle feuert per `sendBeacon` an `/api/monitoring/client-error` und `/api/monitoring/web-vitals` — beide Endpunkte existieren nirgends (`RUNTIME-CONTRACT.md` RD-10). Ersetzt durch eine providerneutrale Senke mit Standard **No-Op**, nach dem Vorbild von `src/lib/tracking.ts`. Siehe §4.2 **PD-4**. | **BG-10**, BG-11 |
| **P3** | B2 | `src/lib/monitoring/index.ts` | identisch | FILE | — | **ADAPT** | Barrel plus `setMonitoringSink`/`monitoringAktiv`. | BG-10 |
| **P3** | B10 | `src/lib/metrics/{definitions,thresholds,aggregate,aggregate.test}.ts` | — | FILE | — | **REJECT** | Im Audit `REFERENCE_ONLY`. Kennzahlen-Definitionen und Aggregation sind CWV-Budget-Arbeit → **AP25**. | — |
| **P4** | B3 | `scripts/a11y-audit.mjs` | identisch | FILE | `playwright`, `axe-core` (beide jetzt deklariert) | **ADAPT** | axe-core WCAG 2.0/2.1/2.2 A+AA gegen den laufenden Server, Quelle aus `node_modules` injiziert — **kein Netzzugriff**. Routenliste auf diese Linie umgestellt; Kopfkommentar stellt ausdrücklich klar, dass ein Lauf **kein** WCAG-Nachweis ist. | BG-12 |
| **P4** | B4 | `scripts/baseline-screenshots.mjs` | identisch | FILE | `playwright` | **ADAPT** | Derselbe Import wie P1 — das Skript bedient beide Gruppen (Screenshots + Overflow-Zusicherung). | BG-12 |
| **P4** | B3 | `package.json` (**geschützt**) | identisch | HUNK (2 Stück) | — | **ADAPT** | (1) zwei Scripts `audit:a11y`, `screenshots:baseline`; (2) `axe-core@^4.11.3` und `playwright@^1.57.0` als devDependencies **deklariert**. Beide waren bereits im Lockfile — aber nur **transitiv** über `@playwright/test`; die Skripte importieren sie direkt. Siehe §4.2 **PD-5**. | BG-12 |
| **P5** | B7 | `.github/workflows/ci.yml` → Job `changelog-gate` | — | HUNK | — | **ADAPT → `PATTERN_RECORDED_NOT_ACTIVATED`** | Der Mechanismus ist neutral und wertvoll (siehe §4.3), aber: sein Pfad-Grep zielt auf `src/design-system/**` (**X1**, existiert hier nicht), und die CI dieser Linie triggert ausschließlich auf `main` (`QD-3`/`D-06`) — der Job könnte gar nicht feuern. Ein hart fehlschlagendes PR-Gate zu verdrahten ist **AP27 PT27.6**. `.github/workflows/ci.yml` bleibt unverändert. | BG-12 |
| **P5** | X2 | CI-Schritt „Visual regression (Pattern Library)" | — | HUNK | — | **REJECT** | Siehe P1/X2. | DN-01 |
| **P5** | B9 | `.github/CODEOWNERS` | — | FILE | — | **REJECT** | Jeder geschützte Pfad ist redesign-only (`src/design-system/**`, `StyleguidePage.tsx`, `e2e/styleguide-visual.spec.ts`, `docs/design-system/**`), und die genannte Team-Kennung `@design-system-owners` ist laut eigenem Kopfkommentar eine unbestätigte Annahme. | — |
| **P5** | B8 | `CHANGELOG.md` | — | FILE | — | **REJECT** (`REFERENCE_ONLY`) | Formale Content-/Release-Governance ist per `DEC-RL-010` Backlog, nicht Launch-Scope. Ohne aktives Gate wäre die Datei totes Dokument. | — |
| **P5** | B13 | `.madgerc` | — | FILE | `madge` | **REJECT** (`DEFER`) | `madge` ist auf keinem Branch Dependency, kein Script ruft es auf. Nur zusammen mit einem echten Zyklus-Gate sinnvoll → AP27. | — |

**Nicht Teil der fünf Pflichtgruppen, bewusst nicht übernommen:** `src/hooks/usePrefersReducedMotion.ts`
(B5, `IMPORT`-Kandidat, WCAG 2.2.2/2.3.3 → **AP24**) und `src/lib/i18n/format.ts` (B6,
`IMPORT`-Kandidat, ersetzt langfristig die `MONTH_NUMBERS`-Tabelle in `structuredData.ts` → **AP08/AP09**).
Beides ist Produktcode, kein QA-/Engineering-Pattern; ihre Übernahme wäre eine Scope-Ausweitung von
PT01.3. → **D-24**.

### 4.2 Dokumentierte Abweichungen von der Quelle

| ID | Abweichung | Betroffen | Warum |
| --- | --- | --- | --- |
| **PD-1** | Darstellung der beiden Fehlergrenzen neu geschrieben | `RootErrorBoundary`, `SegmentErrorBoundary` | Die Quellfassungen hängen über `bg-bg`, `text-fg`, `text-fg-heading`, `bg-action-primary`, `action-primary-hover`, `text-fg-on-dark`, `border-border-strong`, `bg-bg-subtle`, `max-w-reading` und `var(--tap-target-min)` an der Token-Schicht des alternativen Design-Systems (**X1**). Unverändert übernommen hätten sie entweder X1 nachgezogen (verboten, `DEC-RL-002`/`DEC-RL-003`) oder farblos gerendert. Umgeschrieben auf die Tokens dieser Linie (`text-heading`, `brand-primary`, `brand-navy-hover`, `brand-deep`, slate-Skala) — **Verhalten unverändert**, `check:colors` grün. Die 44-px-Trefferfläche der Quelle ist als `min-h-[44px]` erhalten. |
| **PD-2** | `RootErrorBoundary` wird in `src/entry-client.tsx` eingehängt, **nicht** in `src/App.tsx` | `entry-client.tsx` | `App.tsx` wird von `entry-server.tsx` **und** `entry-client.tsx` gerendert. Eine Grenze dort hätte auch beim SSR gegriffen und einen Renderfehler abgefangen, den `server.ts:741–747` heute über `next(error)` als echten **HTTP 500** beantwortet — das Ergebnis wäre HTTP 200 mit Fehlerseite gewesen. Genau das verbietet der PT01.3-Auftrag („Server-Error-Semantik"). Client-only wahrt beides: kein weißer Bildschirm im Browser, unveränderte Statussemantik auf dem Server. `entry-server.tsx` und `App.tsx` sind **unverändert**. |
| **PD-3** | `errors.*` nur in `de` und `en` ergänzt, nicht in allen zehn Locales | `public/locales/{de,en}/common.json` | Auf `5673b61` tragen zwar alle zehn `common.json` einen `errors`-Block, aber **nur `de` und `en` sind übersetzt** — `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs` enthalten dort den **deutschen** Text unverändert. Diese acht zu importieren hätte deutschen Text als polnisch/tschechisch/dänisch/niederländisch/portugiesisch ausgeliefert und der Key-Paritätsprüfung von AP08 eine Vollständigkeit vorgetäuscht, die nicht besteht. Mit `fallbackLng: 'en'` (`src/i18n.ts:61`) laufen die acht stattdessen auf Englisch — das dokumentierte, beabsichtigte Fallback-Verhalten dieser Linie. Nachziehen: **AP08** → **D-22**. |
| **PD-4** | Beacon-Transport durch providerneutrale Senke ersetzt | `src/lib/monitoring/report.ts` | Die Quelle sendet unbedingt an `/api/monitoring/client-error` und `/api/monitoring/web-vitals`. Beide Endpunkte existieren weder auf `5673b61` noch auf der Baseline noch auf `main`; über den `/api`-Proxy in `server.ts` wären das reale, ins Leere laufende POSTs — also **neue Laufzeit-Datenübertragung**, die PT01.3 ausdrücklich nicht aktivieren darf. Ersetzt durch `setMonitoringSink()` mit Standard-No-Op, exakt nach dem Vorbild von `setTrackingProvider()` in `src/lib/tracking.ts`. Kein `sendBeacon`, kein `fetch`, kein Endpunkt im gebauten Client-Bundle. Wer die Senke einhängt, entscheiden **AP25** (CWV) und **AP26/AP28** (Betrieb), Consent-Frage **AP23** → **D-21**. |
| **PD-5** | `axe-core` und `playwright` explizit als devDependencies deklariert | `package.json`, `package-lock.json` | Beide waren bereits im Lockfile aufgelöst (`axe-core@4.11.3`, `playwright@1.57.0`), aber nur **transitiv** über `@playwright/test`; auf `5673b61` fehlt `axe-core` in der `package.json` ganz, obwohl das Skript es per `require.resolve` lädt. Ein Verlass auf eine transitive Kopie bricht still, sobald `@playwright/test` sie nicht mehr mitbringt. Deklariert wurden **exakt die bereits aufgelösten Versionen** — der Lockfile-Diff umfasst genau die zwei neuen Deklarationszeilen, **kein einziger `"version"`-Eintrag ändert sich**, kein Paket kommt hinzu. |
| **PD-6** | Routenlisten beider Skripte auf diese Linie umgestellt | `a11y-audit.mjs`, `baseline-screenshots.mjs` | Die Quelllisten stammen aus dem Redesign-Programm. Ergänzt um `/de/epigenetics`, `/de/epigenetics/grundlagen` und `/de/epigenetics/musterbefund/metabolic-health`, damit die in PT01.2 aktivierten Routen mit abgedeckt sind. |
| **PD-7** | `docs/baseline-screenshots/` in `.gitignore` | `.gitignore` | Die Ausgabe ist ein Werkzeug-Artefakt. Ein eingecheckter Screenshot-Satz würde als visuelle Soll-Vorgabe missverstanden; die Art Direction ist Sales-Machine (`DEC-RL-002`), nicht ein Bilderordner. |

### 4.3 P5 — aufgezeichnetes, nicht aktiviertes Pattern

`PATTERN_RECORDED_NOT_ACTIVATED`. Der Mechanismus aus `5673b61:.github/workflows/ci.yml`, für eine
spätere Aktivierung durch **AP27 PT27.6** festgehalten:

> Eigener Job, nur bei `pull_request`. `actions/checkout@v4` mit `fetch-depth: 0`, dann
> `git diff --name-only "origin/<base_ref>"...HEAD`. Trifft die Änderungsliste einen geschützten
> Pfad (Quelle: `^(src/design-system/|tailwind\.config\.js)`), muss `CHANGELOG.md` in derselben
> Änderungsliste stehen, sonst `exit 1`. Trifft sie keinen, meldet der Job „nicht anwendbar" und
> ist grün.

Für diese Linie zu klären, bevor er verdrahtet wird: die geschützte Pfadmenge (`src/design-system/**`
existiert hier nicht — Kandidaten wären `tailwind.config.js`, `src/components/ui/**`), ob
`CHANGELOG.md` überhaupt eingeführt wird (`DEC-RL-010` stellt formale Governance in den Backlog), und
die Auflösung von `QD-3`/`D-06` — solange CI nur auf `main` triggert, feuert kein PR-Gate dieser Linie.

### 4.4 QA-Pattern-Smoke

Beide Skripte wurden gegen den **gebauten** PT01.3-Stand auf isoliertem Port 39031 ausgeführt.
Chromium ist in dieser Umgebung verfügbar; `ENVIRONMENT_NOT_VERIFIED` trifft **nicht** zu.

| Pattern | Smoke | Ergebnis |
| --- | --- | --- |
| P1 `screenshots:baseline` | **PASS** (rc 0) | 32 Aufnahmen (8 Routen × 4 Breakpoints) erzeugt. Overflow-Zusicherung meldet **8 Befunde bei `lg` (1024 px): `scrollWidth` 1037 > 1024 auf allen acht Routen** — auch auf `home`, `diagnostics`, `articles`, `contact`, `notfound`, die PT01.2/PT01.3 nicht berührt haben. Bestandsbefund, kein Import-Schaden → **D-20**. |
| P4 `audit:a11y` | **PASS als Werkzeug** (rc 1 = Befunde, kein Werkzeugfehler) | 9 Routen × axe (WCAG 2.0/2.1/2.2 A+AA) plus Overflow bei sm/xl. **8 kritische/schwerwiegende Befunde**: `contact` `aria-progressbar-name` (1); `imprint` `color-contrast` (1); `epigenetics` `list` (1) + `listitem` (6). Alle drei Seiten stammen aus der Baseline. Die beiden in PT01.2 importierten Seiten (`epigenetics/grundlagen`, `musterbefund/metabolic-health`) und die 404-Seite: **keine** kritischen/schwerwiegenden Befunde. → **D-23**. **Dies ist kein WCAG-Nachweis** (siehe §4.5). |
| P2 Error Boundary | **PASS** | Typecheck grün; `RootErrorBoundary` im Client-Bundle; SSR-Statussemantik unverändert (Smoke §4.5). |
| P3 Web Vitals / Monitoring | **PASS** | Modul baut und typisiert; **keine** Netzaktivität: im gebauten Client-Bundle kein `api/monitoring`, kein `sendBeacon`, keine Analytics-Domain. `initWebVitals()` wird nirgends aufgerufen, `setMonitoringSink()` nirgends registriert. |
| P5 CI | **n. a.** | Keine CI-Datei geändert; Mechanismus nur dokumentiert (§4.3). |

### 4.5 Validierung

| Prüfung | Ergebnis |
| --- | --- |
| Typecheck (`tsc -b`) | **PASS** |
| Unit Tests (`vitest run`) | **PASS — 7 Dateien, 18/18** (unverändert) |
| Design-/Token-Guard (`check:colors`) | **PASS** |
| Build (`npm run build`) | **PASS** |
| ESLint | **129 — unverändert** (`_project-knowledge` 111 · `src` 17 · `server.ts` 1); **0 Befunde in PT01.3-Dateien** |
| Prettier | **0 Verstöße** in PT01.3-Dateien; getrackte Gesamtzahl **39 — unverändert** gegenüber PT01.2 |
| Lockfile | **konsistent** — Diff = 2 Zeilen (die beiden Deklarationen), keine Versionsänderung; `npm ls axe-core playwright` → `4.11.3` / `1.57.0` |
| SSR 200 | `/de/`, `/de/about`, `/de/epigenetics` → **200** |
| SSR — PT01.2-Routen weiter aktiv | `/de/epigenetics/{grundlagen,studienlage,unterlagen}` und `/de/epigenetics/musterbefund/metabolic-health` → **200** |
| SSR 301 | `/agb` → `/de/terms`, `/s3-leitlinie` → `/de/s3_leitlinie`, `/about` → `/de/about` |
| SSR 404 | unbekannter statischer Pfad, unbekannter Musterbefund-Slug, unbekannter Artikel-Slug → **404** |
| `no-store` | HTML 200 **und** 404: `no-store, no-cache, must-revalidate` |
| SEOHead/notFound | 404: `prerender-status-code`-Marker, robots `noindex, follow`, **0** Canonical, **0** hreflang |
| Canonical/hreflang | reale Seite: 1 Canonical + 11 `rel="alternate"` (10 + `x-default`) |
| Sitemap | **365 `<loc>`** — unverändert gegenüber PT01.2 |
| Netz-/Consent-Negativprüfung | **keine** neue externe Anfrage: kein `api/monitoring`, kein `sendBeacon`, keine GA/GTM-Domain im Client-Bundle; `index.html`, `src/lib/tracking.ts`, `CookieBanner.tsx` **unverändert** |

**Ausdrücklich nicht behauptet:** WCAG 2.2 AA ist **nicht** erfüllt, das Accessibility-Gate ist **nicht**
abgenommen, AP24 ist **nicht** abgeschlossen. PT01.3 hat ein Werkzeug bereitgestellt und damit
Bestandsbefunde sichtbar gemacht — mehr nicht.

## 4a. `redesign/preview` Explicitly Rejected

| Abgelehnt | Audit-ID | Nachweis nach dem Import |
| --- | --- | --- |
| **Alternatives Design-System** (`src/design-system/**`, 29 Dateien, eigene `tokens.ts`/`tokens.css`) | X1 | `src/design-system` existiert nicht; keine Referenz in `src/**`. |
| **Dark Theme / Dark Tokens** | — | Auf `5673b61` ist kein Dark-Theme-Code vorhanden; unabhängig geprüft: `darkMode` in `tailwind.config.js` = 0, `dark:`-Klassen in `src/**` = 0, `tailwind.config.js` und `src/index.css` **unverändert**. |
| **Theme Switcher** | — | Keine Fundstelle für `themeSwitch`/`toggleTheme`/`useTheme`/`setTheme` in `src/**`. |
| **Pattern-Library-Seite + Visual-Suite + CI-Schritt** | X2 | `StyleguidePage.tsx`, `e2e/styleguide-visual.spec.ts` nicht vorhanden; `.github/workflows/ci.yml` **unverändert**. |
| **Redesign-Homepage-Komposition** (`sections/home/*`, 9 Dateien) | X3 | Nicht vorhanden — würde die Sales-Machine-Startseite ersetzen. |
| **Alternative CTA-Bänder** (`CtaBand.tsx`, `CtaSection.tsx`, `ContactChannels.tsx`) | X4 | Keine Datei vorhanden; `cta_section`-Schlüssel in `public/locales/**`: **0**. Dies ist dasselbe verbotene Band wie `N5` (`DEC-RL-012`). |
| **Statische `public/sitemap.xml`** | X5 | Nicht vorhanden — die Sitemap wird weiter in `server.ts` erzeugt (365 `<loc>`); eine statische Datei würde sie beschatten. |
| **Shop-Katalog `src/data/products.ts`** | X6 | Nicht vorhanden (`DEC-RL-015`). |
| **Feature-Flag-Stub `src/lib/flags.ts`** | X7 | Nicht vorhanden. |
| **Redesign-Bildmaterial** (`public/images/{clinic-consultation,doctor-igloopro,igloopro-device,igloopro-frontal}.webp`) | X8 | Nicht importiert. |
| **Archon-Orchestrierung + Phasenpläne** (`.archon/**`, `EXECUTION-PLAN.md`, `REFACTOR-LOG.md`, `docs/RELAUNCH-*.md`, `docs/NEWLOOK-HOME.md`) | X9 | Nicht importiert — würde einen zweiten, widersprüchlichen Relaunch-Plan ins Repository stellen. |
| **Doppeltes og-image-Skript `scripts/convert-og-image.js`** | X10 | Nicht importiert; `scripts/convert-og-image.mjs` bleibt die einzige Fassung. |
| **Vollständige fremde `.github/workflows/ci.yml`** | B7/X2 | **Unverändert** — kein Workflow-Ersatz. Nur der Changelog-Mechanismus ist dokumentiert (§4.3). |
| **Vollständige fremde `package.json`** | — | Nur zwei Hunks: zwei Scripts, zwei devDependency-Deklarationen (§4.2 **PD-5**). |
| **Externe Telemetry-/Analytics-Aktivierung** (`/api/monitoring/*`-Beacons) | B2 | Durch **PD-4** ersetzt; kein Endpunkt und kein `sendBeacon` im gebauten Client-Bundle. |
| **`RouteFallback.tsx`** | B1 | Nicht importiert (X1-Token-Bindung; AP06/AP24). |
| **`src/lib/metrics/**`** | B10 | Nicht importiert (`REFERENCE_ONLY` → AP25). |
| **`.github/CODEOWNERS`** | B9 | Nicht importiert (redesign-only Pfade, unbestätigte Team-Kennung). |
| **`CHANGELOG.md`** | B8 | Nicht importiert (`DEC-RL-010`). |
| **`.madgerc`** | B13 | Nicht importiert (`madge` ist nirgends Dependency). |
| **UX-/Persona-/Design-System-Dokumentation** (`docs/ux/*`, `docs/personas/*`, `docs/design-system/**`, `docs/interface-inventory.md`, `docs/REFACTOR_BACKLOG.md`, `docs/GRAVEYARD.md`) | B11, B12 | Nicht importiert (`REFERENCE_ONLY`). |

## 5. Rejected / Explicitly Not Imported (`main`)

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

| D-20 | **Horizontaler Überlauf bei 1024 px** — `scrollWidth` 1037 > 1024 auf allen acht geprüften Routen, einschließlich unberührter Baseline-Seiten (`home`, `diagnostics`, `articles`, `contact`, `notfound`) | PT01.3 §4.4, `npm run screenshots:baseline` | neu (durch das PT01.3-Werkzeug sichtbar gemacht) | **AP24 / AP25** | NO |
| D-21 | **Monitoring-Senke nicht eingehängt** — `setMonitoringSink()` ist nirgends registriert, `initWebVitals()` wird nicht aufgerufen; das Gerüst ist bewusst inert | PT01.3 §4.2 PD-4 | `RUNTIME-CONTRACT.md` RD-10 | **AP25** (CWV) · **AP26/AP28** (Betrieb) · **AP23** (Consent) | NO |
| D-22 | **`errors.*` nur in `de`/`en`** — die acht übrigen Sprachen laufen über `fallbackLng: 'en'`; auf `5673b61` sind die anderen acht Blöcke unübersetzt (deutscher Text) und deshalb nicht importierbar | PT01.3 §4.2 PD-3 | `DEC-RL-001` | **AP08** | NO |
| D-23 | **8 kritische/schwerwiegende axe-Befunde** auf Baseline-Seiten: `contact` `aria-progressbar-name`, `imprint` `color-contrast`, `epigenetics` `list` + `listitem` (6 Knoten) | PT01.3 §4.4, `npm run audit:a11y` | neu (durch das PT01.3-Werkzeug sichtbar gemacht) | **AP24** | NO |
| D-24 | **`usePrefersReducedMotion` und `lib/i18n/format.ts` nicht übernommen** — beide auf `5673b61` als `IMPORT` auditiert, aber Produktcode außerhalb der fünf PT01.3-Pflichtgruppen | PT01.3 §4.1 | `BRANCH-RECONCILIATION-MAP.md` B5, B6 | **AP24** bzw. **AP08/AP09** | NO |

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
| PT01.3 | 2026-08-24 | **PASS** | **neu:** `src/routing/*` (4) · `src/lib/monitoring/*` (3) · `scripts/{a11y-audit,baseline-screenshots}.mjs` · **Hunks:** `src/entry-client.tsx`, `package.json`, `package-lock.json`, `public/locales/{de,en}/common.json`, `.gitignore` · **Doku:** `AP01-RECONCILIATION-RESULT.md`, `state/AP-STATE.md` |
| PT01.2 | 2026-08-24 | **PASS** | **neu:** `src/components/epigenetics/{tokens.ts,EpiSubpage.tsx}`, `src/pages/Epigenetics{Basics,Evidence,Docs}Page.tsx`, `src/content/befunde/meta.ts`, `src/pages/musterbefund/*.tsx` (6) · **Hunks:** `src/App.tsx`, `server.ts`, `src/pages/MusterbefundPage.tsx`, `src/content/befunde/index.ts` · **Doku:** `AP01-RECONCILIATION-RESULT.md`, `state/AP-STATE.md` |

**PT01.1** hat weder Anwendungscode noch Runtime-/Config-Dateien, Dependencies oder Lockfiles verändert.

**PT01.2** hat ausschließlich Anwendungscode im auditierten Import-Umfang verändert. Unverändert
blieben: `package.json`, beide Lockfiles, `tsconfig*`, `vite.config.ts`, `tailwind.config.js`,
`index.html`, Docker-/nginx-/CI-Dateien, `public/**`, `src/lib/tracking.ts`,
`src/components/seo/**`, `src/components/layout/**` und `src/hooks/useSearch.ts`.

**PT01.3** hat `package.json`/`package-lock.json` um zwei devDependency-Deklarationen und zwei
Scripts ergänzt und `public/locales/{de,en}/common.json` um einen `errors`-Block. Unverändert blieben:
`server.ts`, `src/App.tsx`, `src/entry-server.tsx`, `src/components/seo/**`, `src/lib/tracking.ts`,
`index.html`, `tailwind.config.js`, `src/index.css`, `.github/workflows/ci.yml`, `tsconfig*`,
`vite.config.ts`, Docker-/nginx-Dateien und die acht übrigen `public/locales/*/common.json`.
