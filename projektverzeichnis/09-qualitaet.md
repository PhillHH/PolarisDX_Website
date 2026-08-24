# 09 — Qualitätssicherung

## 1. CI-Gates (`docs/ci.md`)

Jeder Pull Request durchläuft fünf Gates, alle müssen grün sein:

1. `tsc -b --noEmit` (Typecheck)
2. `eslint .`
3. `prettier --check .`
4. `npm test` (Vitest)
5. `npm run build`

Playwright und Lighthouse sind laut `docs/ci.md` für „Wave 5" vorgesehen —
die Playwright-Suite existiert bereits lokal, hängt aber nicht im PR-Gate.

## 2. Pre-Commit-Hooks (`lefthook.yml`)

Parallel ausgeführt:

| Schritt     | Umfang                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------- |
| `format`    | `prettier --write` auf gestagete `.ts .tsx .js .jsx .json .md .css`, Ergebnis wird nachgestaget |
| `lint`      | `eslint --fix` auf gestagete `.ts .tsx`, Ergebnis wird nachgestaget                             |
| `typecheck` | `tsc -b --noEmit` über das ganze Projekt                                                        |
| `colors`    | `node scripts/check-color-tokens.mjs` — verhindert Hex-Werte außerhalb der Tailwind-Tokens      |

Installation über `npm run prepare` (`lefthook install`).

## 3. Unit-Tests (Vitest + Testing Library + jsdom)

| Datei                                      | Prüft                               |
| ------------------------------------------ | ----------------------------------- |
| `src/components/layout/Header.test.tsx`    | Navigationsstruktur, Aktiv-Zustände |
| `src/components/layout/Footer.test.tsx`    | Footer-Links                        |
| `src/components/ui/Button.test.tsx`        | Varianten                           |
| `src/components/ui/Alert.test.tsx`         | Darstellung                         |
| `src/components/ui/SectionHeader.test.tsx` | Darstellung                         |
| `src/content/befunde/panelNames.test.ts`   | Panel-Namen der Musterbefunde       |
| `server/server.test.js`                    | Backend-Endpunkte                   |

Konfiguration: `vitest.config.ts`, Setup in `src/test/`.

Die Abdeckung ist dünn: sechs Frontend-Testdateien bei ~90 Komponenten.
`knowledge/COVERAGE.md` hält den Stand fest.

## 4. E2E (Playwright, `e2e/url-smoke.spec.ts`)

`testDir: ./e2e`, `baseURL: http://localhost:3000`, eigener `webServer`-Start.

**Drei Gruppen:**

- _URL Smoke Tests_ — 15 statische Routen laden ohne Fehler:
  `/` `/about` `/articles` `/contact` `/diagnostics` `/downloads` `/events` `/igloo-pro`
  `/imprint` `/privacy` `/s3_leitlinie` `/support` `/terms` `/vitamin-d3-implantologie`
  `/vitamin-d3-spray`
- _Dynamic_ — 2 dynamische Routen:
  `/articles/the-ecosystem-of-rapid-tests-why-compatibility-creates-safety`, `/diagnostics/dental`
- _301 Redirects_ — `/services` → `/diagnostics`, `/services/dental` → `/diagnostics/dental`
- _404 Page_ — `/diese-seite-existiert-nicht` zeigt die `NotFoundPage`

Nicht abgedeckt: `/epigenetics` samt Musterbefunden, `/consumer/*`,
die Sprachweiche, `sitemap.xml`.

## 5. Prüfskripte (`scripts/`)

| Skript                                            | Prüft / erzeugt                                     |
| ------------------------------------------------- | --------------------------------------------------- |
| `check-color-tokens.mjs`                          | Hex außerhalb der Tokens (Pre-Commit-Gate)          |
| `check-i18n-home.mjs`                             | `home`-Keys über alle zehn Sprachen                 |
| `check-meta-descriptions.mjs`                     | Meta-Descriptions                                   |
| `prerender.mjs`                                   | Statisches Prerendering per Playwright (Altbestand) |
| `optimize-images.mjs`                             | Bildoptimierung (sharp)                             |
| `convert-og-image.mjs` + `og-image-template.html` | OG-Bilder erzeugen                                  |
| `i18n/`, `debug/`                                 | Wartungs- und Debug-Werkzeuge                       |

## 6. Linting

ESLint 9 Flat Config (`eslint.config.js`) mit `typescript-eslint`,
`eslint-plugin-react-hooks`, `react-refresh`, `jsx-a11y`, `import`
(+ `eslint-import-resolver-typescript`), `eslint-config-prettier`.

## 7. Dokumentation im Repo

| Ort                         | Inhalt                                                                                                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `README.md`, `README.de.md` | Einstieg                                                                                                                                                                                                                       |
| `DOCS.md`                   | Dokumentationsübersicht                                                                                                                                                                                                        |
| `docs/`                     | `ci.md`, `deploy-preview.md`, `design-system.md`, `backlog.md`, `global-fixes.md`, `migration-map.md`, `internal-linking-audit.md`, `seo/`, `content/`                                                                         |
| `knowledge/`                | `PROJECT-DECISIONS.md`, `COVERAGE.md`, `ARCHON-README.md`, `REFACTORING-ANWEISUNG.md`, `design-references/`                                                                                                                    |
| `_project-knowledge/`       | Wave-Audits: `AUDIT-REPORT.md`, `wave-0-*` (Branch-Audit, DSGVO-Vorfall, live-vs-main), `wave-1-analyse/`, `wave-2-analyse/`, plus `app-shell/`, `components/`, `config/`, `deploy/`, `i18n/`, `locales/`, `pages/`, `server/` |
| `wireframes/`               | HTML-Wireframes je Seite (`home`, `about`, `articles`, `article`, `contact`, `diagnostics`, `downloads`, `events`, `consumer/`, `chrome.js`)                                                                                   |
| Root                        | `AUDIT_I18N_ROUTING.md`, `CHAT_INTEGRATION.md`, `MISSING_TRANSLATIONS.md`, `SEO_STRATEGY.md`                                                                                                                                   |
