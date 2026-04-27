# Wave 0 — Branch Audit gegen main

**Stand:** 2026-04-27
**Main HEAD:** `febd871` (docs: live site vs main drift analysis)
**Methode:** Pro Branch `git diff main..origin/<branch>` plus `git log main..origin/<branch>` plus `git merge-base`. Filter fuer Noise: `Vitd3_Mail/`, `.gitignore`, `_project-knowledge/wave-0-dsgvo-incident.md`, `_project-knowledge/wave-0-live-vs-main.md` (alles bereits in main hinterlegt / DSGVO-bedingt entfernt).

> **Wichtig:** main wurde geforce-gepusht (`6a4a287...febd871`). Local main wurde auf `origin/main` zurueckgesetzt, um auf "current main" zu sein. Alle 12 Branches haben **keine merge-base** zu Teilen der alten History oder zur neuen — das ist erwartet, weil main durch Squash/Rewrite einen sauberen neuen Verlauf erhalten hat.

## Klassifikations-Tabelle

| Branch | Files diff (raw) | Files diff (ohne Noise) | Unique-NEW Files in Branch | Unique-DELETED (nur main) | Lines diff (Stat) | Klassifizierung |
|---|---:|---:|---:|---:|---|---|
| claude/add-playwright-smoke-test-5u4gd | 17 | 4 | **2** (`e2e/url-smoke.spec.ts`, `playwright.config.ts`) | 0 | +1366 / -257 | **ECHTE ARBEIT** |
| claude/add-smoke-tests-D4tD7 | 13 | 0 | 0 | 0 | +1273 / -257 | **NUR HISTORY-ARTEFAKT** |
| claude/setup-vitest-smoke-test-Ei5JX | 19 | 6 | 0 | 3 | n/a | **NUR HISTORY-ARTEFAKT** |
| claude/eslint-lefthook-setup-XsxTH | 24 | 11 | 0 | 9 | n/a | **NUR HISTORY-ARTEFAKT** |
| claude/github-actions-ci-7sLuw | 24 | 11 | 0 | 8 | n/a | **NUR HISTORY-ARTEFAKT** |
| claude/update-polarisdx-config-Gm3TJ | 26 | 13 | 0 | 10 | n/a | **NUR HISTORY-ARTEFAKT** |
| claude/setup-meta-tags-german-DPO8e | 478 | 465 | viele (alte `backend/cms/`, alte `*.png`) | viele (neue Struktur) | massiv | **NUR HISTORY-ARTEFAKT** |
| claude/fix-ssr-hidden-content-qiBhy | 479 | 466 | viele (alte `backend/cms/`, alte `*.png`) | viele (neue Struktur) | massiv | **NUR HISTORY-ARTEFAKT** |
| claude/docker-polarisdx-deployment-WwOqk | ~470 | ~460 | viele (alte Struktur) | viele (neue Struktur) | massiv | **NUR HISTORY-ARTEFAKT** |
| claude/react-ssr-migration-Druht | ~470 | ~460 | viele (alte Struktur) | viele (neue Struktur) | massiv | **NUR HISTORY-ARTEFAKT** |
| claude/add-vitamin-d3-guide-I2IgQ | ~470 | ~460 | viele (alte Struktur) | viele (neue Struktur) | massiv | **NUR HISTORY-ARTEFAKT** |
| claude/create-email-template-QJvYj | ~470 | ~460 | viele (alte Struktur) | viele (neue Struktur) | massiv | **NUR HISTORY-ARTEFAKT** |

---

## Detail-Begruendung pro Branch

### 1. claude/add-playwright-smoke-test-5u4gd  — **ECHTE ARBEIT**

- **Unique-NEW Files (nicht auf main):** `e2e/url-smoke.spec.ts`, `playwright.config.ts`
- Dazu erweitert `.github/workflows/ci.yml` um Playwright-Install und E2E-Step
- `package.json` bekommt `test:e2e: playwright test`
- main enthaelt bisher keine E2E-Tests, kein `e2e/`-Ordner, keine Playwright-Konfig.

Erste Commits, die NICHT in main sind:
```
9bb6c81 test: add URL smoke tests for all 19 active routes
7d8a7a1 Merge pull request #108 from PhillHH/claude/add-smoke-tests-D4tD7
20d85c3 chore: sync package-lock.json with package.json
4aa610b Merge branch 'claude/github-actions-ci-7sLuw'
93d1d67 Merge branch 'claude/eslint-lefthook-setup-XsxTH'
```
(die Merge-Commits sind nur Branch-Geschichte; das echte Plus ist `9bb6c81`.)

→ **Aktion:** Vor Loeschen Playwright-Setup nach main mergen oder cherry-picken (`9bb6c81`).

---

### 2. claude/add-smoke-tests-D4tD7 — NUR HISTORY-ARTEFAKT

- 0 unique-NEW, 0 unique-DELETED nach Noise-Filter.
- Alle 13 abweichenden Files sind ausschliesslich `Vitd3_Mail/*` und die zwei Wave-0-DSGVO-Doku-Files.
- main enthaelt bereits Merge-Commit `7d73012 Merge pull request #108 from PhillHH/claude/add-smoke-tests-D4tD7`.
- → Branch ist **bereits auf main**, sicher zu loeschen.

### 3. claude/setup-vitest-smoke-test-Ei5JX — NUR HISTORY-ARTEFAKT

- 0 unique-NEW Files. main hat **mehr** als der Branch (lefthook.yml, docs/ci.md, .github/workflows/ci.yml).
- main enthaelt die Vitest-Commits inhaltsgleich (`d42f3fb Merge branch 'claude/setup-vitest-smoke-test-Ei5JX'`, `3d84a5f`, `fb1f373`).
- Branch ist content-maessig ein Subset von main → sicher zu loeschen.

### 4. claude/eslint-lefthook-setup-XsxTH — NUR HISTORY-ARTEFAKT

- 0 unique-NEW Files. Branch ist hinter main (faehlt: ci.yml, docs/ci.md, alle Smoke-Tests).
- main enthaelt `b1f909f Merge branch 'claude/eslint-lefthook-setup-XsxTH'` und `0f0fe94 chore: extend eslint config, add lefthook pre-commit hooks`.
- → Sicher zu loeschen.

### 5. claude/github-actions-ci-7sLuw — NUR HISTORY-ARTEFAKT

- 0 unique-NEW Files.
- main enthaelt `c039939 Merge branch 'claude/github-actions-ci-7sLuw'` und `dba7e99 chore: add github actions CI workflow`.
- → Sicher zu loeschen.

### 6. claude/update-polarisdx-config-Gm3TJ — NUR HISTORY-ARTEFAKT

- 0 unique-NEW Files. Branch ist hinter main.
- main enthaelt `273f149 Merge pull request #107 from PhillHH/claude/update-polarisdx-config-Gm3TJ` und `583e991 chore: add prettier, format entire codebase`.
- → Sicher zu loeschen.

---

### 7. claude/setup-meta-tags-german-DPO8e — NUR HISTORY-ARTEFAKT

- **Keine merge-base** zu main — das ist eine **alte, vor-Restrukturierungs-History**.
- Unique-NEW Files in Branch sind ausschliesslich Reste der alten Repository-Struktur, die main bewusst entfernt hat:
  - `backend/cms/*` (alte Payload-CMS-Schicht — main hat sie geloescht, vgl. `37c658c Merge claude/review-payload-cms-wQbt0 into main`)
  - `about_desktop.png`, `homepage_casestudy.png`, `mobile_*.png`, `verification_*.png` etc. (alte Screenshot-Artefakte)
  - `update_*.py`, `verify_*.py`, `find_48.cjs`, `resize_images.py` (alte Skripte, in `scripts/` reorganisiert)
  - `translations/*.json` (alte Translation-Struktur, in `public/locales/` migriert)
  - `_project-knowledge/app-shell/`, `_project-knowledge/components/`, `_project-knowledge/pages/` (alte Snapshot-Verzeichnisse)
- Die **Feature-Inhalte** (SEO Meta-Tags, FAQ, Strukturierte Daten, deutsche H1/H2) sind auf main vorhanden:
  - `src/components/seo/SEOHead.tsx` ✓
  - `src/components/seo/structuredData.ts` ✓
  - `src/components/sections/FAQSection.tsx` ✓
- → **Sicher zu loeschen** (Feature ist auf main, Branch enthaelt nur ueberholte Struktur).

Erste Commits NICHT in main:
```
8d0bfff fix(types): Schema array type fuer FAQ-Schema Kompatibilitaet
f498665 seo(schema): JSON-LD Structured Data fuer Homepage
240b06a feat(faq): FAQ-Sektion mit Akkordeon auf Startseite
c9e30cd seo(de): H2-Ueberschriften mit SEO-Keywords optimiert
769c73d seo(de): Meta tags, H1 struktur und deutsche Sprachsignale
```

### 8. claude/fix-ssr-hidden-content-qiBhy — NUR HISTORY-ARTEFAKT

- Keine merge-base zu main, gleiches Muster wie #7.
- Unique-NEW = ueberholte alte Struktur. Unique-DELETED = neue Struktur, die main hat.
- SSR-Fixes sind auf main: `src/entry-server.tsx`, `src/entry-client.tsx`, `server.ts` ✓
- → Sicher zu loeschen.

Erste Commits NICHT in main:
```
d77e71b perf(js): Remove framer-motion completely - save 74KB bundle
0875bcd fix(cls): Revert async CSS loading to fix CLS 0.996 → 0
1d6f9f1 perf(js): Optimize framer-motion bundle from 113KB to 74KB (-34%)
5918865 perf(js): Implement route-based code-splitting with React.lazy
4a72a07 perf(css): Eliminate render-blocking CSS with async loading + Critical CSS
```

### 9. claude/docker-polarisdx-deployment-WwOqk — NUR HISTORY-ARTEFAKT

- Keine merge-base zu main.
- Unique-NEW = alte `backend/cms/`-Struktur etc.
- Docker-Deployment ist auf main: `Dockerfile`, `docker-compose.yml` ✓ (im Root, in saubererer Form).
- → Sicher zu loeschen.

Erste Commits NICHT in main:
```
1d76f4e feat(docker): Migrate from Nginx to Node.js SSR deployment
0d76742 Merge pull request #72 from PhillHH/claude/react-ssr-migration-Druht
c5b4ab8 chore(ssr): Remove redundant sitemap/robots routes
cbd56b6 fix(ssr): Add browser API guards for SSR compatibility
8955354 feat(ssr): Add Vite SSR with Express server
```

### 10. claude/react-ssr-migration-Druht — NUR HISTORY-ARTEFAKT

- Keine merge-base zu main.
- SSR-Setup ist auf main: `src/entry-server.tsx`, `src/entry-client.tsx`, `src/i18n.server.ts`, `server.ts` ✓
- → Sicher zu loeschen.

Erste Commits NICHT in main:
```
c5b4ab8 chore(ssr): Remove redundant sitemap/robots routes
cbd56b6 fix(ssr): Add browser API guards for SSR compatibility
8955354 feat(ssr): Add Vite SSR with Express server
a4826ef refactor(i18n): Split i18n config for SSR compatibility
60309f1 Artikel
```

### 11. claude/add-vitamin-d3-guide-I2IgQ — NUR HISTORY-ARTEFAKT

- Keine merge-base zu main.
- Vitamin-D3-Implantology-Guide ist auf main: `src/pages/VitaminD3ImplantologyPage.tsx` ✓
- → Sicher zu loeschen.

Erste Commits NICHT in main:
```
d683a7e Improve SEO and E-E-A-T signals for Vitamin D3 implantology article
7fbb992 Add Vitamin D3 implantology guide page
d4e25be Start
b3b4619 hello
2b0401e Merge pull request #69 from PhillHH/claude/create-email-template-QJvYj
```

### 12. claude/create-email-template-QJvYj — NUR HISTORY-ARTEFAKT

- Keine merge-base zu main.
- Email-Templates auf main: `email/dental-outreach.html`, `email/s3-leitlinie.html`, `email/send.py` ✓
- → Sicher zu loeschen.

Erste Commits NICHT in main:
```
9cbf66c Add Vitamin D3+K2 Spray email template
871d695 GTM
45be849 gsc verify
a5a8fa0 GSC Verify
0f1a97f bots allowed
```

---

## Zusammenfassung

### Sicher zu loeschen (11 Branches)

Alle haben **0 echte unique Files** gegenueber main, oder ihre Feature-Deliverables sind als saubere Implementierung auf main vorhanden:

- claude/add-smoke-tests-D4tD7 (offiziell ueber PR #108 gemergt)
- claude/setup-vitest-smoke-test-Ei5JX (Inhalt auf main via `d42f3fb`)
- claude/eslint-lefthook-setup-XsxTH (Inhalt auf main via `b1f909f`/`0f0fe94`)
- claude/github-actions-ci-7sLuw (Inhalt auf main via `c039939`/`dba7e99`)
- claude/update-polarisdx-config-Gm3TJ (Inhalt auf main via `273f149`/`583e991`)
- claude/setup-meta-tags-german-DPO8e (SEO/FAQ-Features auf main, Branch nur alte Struktur)
- claude/fix-ssr-hidden-content-qiBhy (SSR-Fixes auf main)
- claude/docker-polarisdx-deployment-WwOqk (Docker auf main)
- claude/react-ssr-migration-Druht (SSR auf main)
- claude/add-vitamin-d3-guide-I2IgQ (VitaminD3-Page auf main)
- claude/create-email-template-QJvYj (Email-Templates auf main)

### Brauchen noch Arbeit (1 Branch)

- **claude/add-playwright-smoke-test-5u4gd**
  - Unique: `e2e/url-smoke.spec.ts`, `playwright.config.ts`, Playwright-Step in `ci.yml`, `test:e2e`-Script in `package.json`.
  - Empfehlung: Commit `9bb6c81 test: add URL smoke tests for all 19 active routes` cherry-picken auf main, dann Branch loeschen.

### UNKLAR (0 Branches)

Keine.

---

## Anmerkung zur main-Reset-Aktion

`git pull origin main` war nicht moeglich (divergierende Histories nach Force-Push). Local main wurde mit `git reset --hard origin/main` auf `febd871` gebracht, damit der Vergleich gegen "current main" sauber laeuft. Der vorige local-main-Stand (`6a4a287`) ist ueberholt und wurde nicht weiter genutzt.
