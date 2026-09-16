# CI-CONTRACT

**Vertrag der CI-Gate-Plattform des Relaunchs.** Angelegt in **AP27 PT27.6** (2026-09-15).

**Verwandt:** `QUALITY-GATES.md` (Gates, Eigentum, Launch-Gate-Matrix §12) · `TESTING-CONTRACT.md`
(Kommandos, Stufen, Baseline-Protokoll §22) · `PERFORMANCE-CONTRACT.md` §29 (AP25) ·
`SECURITY-CONTRACT.md` §17/§18 (AP26) · `.github/workflows/ci.yml` (die Umsetzung).

Dieser Vertrag legt fest, **was** in CI laeuft, **wo**, **in welcher Reihenfolge** und **was hart blockiert**.
Er definiert keine neuen Schwellen: Budgets gehoeren AP25, Security-Policies AP26, Deploy-/Health-Gates AP28,
Release-Candidate-Freigabe AP30.

---

## 1. Trigger und Reichweite

| Aspekt       | Festlegung                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| Ereignisse   | `push` und `pull_request`                                                                                           |
| Branches     | `main`, `feat/home-leadmagnet`, `console/**`, `ci/**` — Relaunch-Linie ist `console/**`, Evidence-Linie ist `ci/**` |
| Wahrheit     | ein Gate gilt erst als CI-Nachweis, wenn es auf dem **gepruefeten SHA der Relaunch-Linie** auf GitHub gelaufen ist  |
| Pflichtcheck | **`AP27 Launch gate aggregate`** (`ap27-gate`) — ein einziger Status, der alle Jobs einschliesst                    |

**Gemessener Stand 2026-09-16 (erste echte CI-Evidence):**

- Evidence-Branch `ci/ap27-evidence-2026-09-16` auf `origin`, Evidence-SHA `e14e904`
  (Snapshot `7d34d09` des Arbeitsbaums von `console/24-25-2026-09-11T13-00-11` + ein
  `.gitleaksignore`-Eintrag). Lauf **35074608105** (`push`, 2026-09-16 08:35–08:42 UTC):
  <https://github.com/PhillHH/PolarisDX_Website/actions/runs/35074608105>
- **Gruen (9):** `routing`, `seo`, `performance` (AP25), `security` (AP26), `ap27-tests`,
  `ap27-guards`, `ap27-journeys`, `ap27-seo-regression`, `ap27-visual`.
- **Rot (3) + Aggregat:** `quality` (20 Alt-Baselines in `e2e/design-system.spec.ts`, PT276-F9),
  `security-runtime` (AP26 `pt26.2`, PT276-F10), `ap27-a11y` (`pt24.2`, PT276-F11) → `ap27-gate` rot.
- Die AP27-eigene Gate-Plattform ist damit **in CI bewiesen**; die roten Jobs gehoeren AP05/AP06
  (Baselines), AP26 (`pt26.2`) und einem Zeitproblem in AP24 (`pt24.2`).
- `origin/main` unveraendert `6596a90`; **keine Branch Protection** (`gh api …/branches/main/protection`
  → 404) — erforderliche Checks sind weiterhin nicht erzwungen (QG-11, Owner: Repository-Owner).

## 2. Toolchain

| Aspekt   | Festlegung                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------ |
| Node     | **22** in allen Jobs (`actions/setup-node@v4`); Visual-Job: Node aus dem gepinnten Playwright-Image          |
| npm      | `npm ci` gegen `package-lock.json`; Jobs mit Server-Tests zusaetzlich `npm ci --prefix server` (D-12)        |
| Browser  | `npx playwright install chromium --with-deps` (Playwright 1.57.0 aus dem Lockfile)                           |
| Visual   | Container `mcr.microsoft.com/playwright:v1.57.0-noble` — identisch mit `npm run test:visual:docker` lokal    |
| Repo-Pin | **kein** `.nvmrc`/`engines` (TB-02, offen); lokal existiert eine Node-18/22-Aufteilung (TESTING-CONTRACT §2) |

## 3. Jobs, Reihenfolge, Haerte

Kein Schritt ist `continue-on-error`. Keine AP27-Playwright-Config hat Retries (`retries: 0`).

| Job                   | Eigentum   | Inhalt (Kommandos)                                                                                                                                                                                                                                    | Haerte |
| --------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `quality`             | AP01/05/27 | `tsc -b --noEmit` → `eslint .` → `prettier --check .` → Token-/DS-Changelog-/Shell-i18n-/i18n-/Nav-/Such-/Findability-Guards → Server-Deps → `npm test` → `npm run build` → Alt-Specs url-smoke, design-system, navigation, search-modal, findability | hart   |
| `routing`             | AP10       | `check:routes`, Build, `check:http-status`                                                                                                                                                                                                            | hart   |
| `performance`         | AP25       | Budget-Build, statische und Laufzeit-Budgets (Schwellen: PERFORMANCE-CONTRACT §29)                                                                                                                                                                    | hart   |
| `security`            | AP26       | Dependency-Audit, Secret-Scan (gitleaks, gepinnt), Security-Vertragstests                                                                                                                                                                             | hart   |
| `security-runtime`    | AP26       | Header/HSTS, CSP, Browser-API-Grenze, Image-Build + Trivy-Scan, Image-Haertung                                                                                                                                                                        | hart   |
| `seo`                 | AP09       | `check:seo`, SEO-Unit-Tests, Build, seo-head/sitemap-Specs                                                                                                                                                                                            | hart   |
| `ap27-tests`          | AP27       | `test:unit`, `test:component`, `test:server`, `test:integration`                                                                                                                                                                                      | hart   |
| `ap27-guards`         | AP27       | `test:guards` (Token, DS, Shell-i18n, i18n-Self-Test, Nav, Suche, Findability, Routes, SEO/Meta), `check:befunde-seo`, `check:claims`, Visual-Changelog-Gate                                                                                          | hart   |
| `ap27-journeys`       | AP27       | `test:integration:http`, `test:e2e:core`, `test:e2e:consent`                                                                                                                                                                                          | hart   |
| `ap27-seo-regression` | AP27       | `test:seo:regression` (Guards + frischer Build + x10-Matrix)                                                                                                                                                                                          | hart   |
| `ap27-a11y`           | AP24/27    | `a11y:suite` (PT24.1–PT24.6, axe serious/critical 0)                                                                                                                                                                                                  | hart   |
| `ap27-visual`         | AP27       | `test:visual` im gepinnten Image, Pixel-Toleranz 0                                                                                                                                                                                                    | hart   |
| `ap27-gate`           | AP27       | `if: always()`, `needs` = alle Jobs oben; rot, sobald ein Job nicht `success` ist                                                                                                                                                                     | hart   |

**Fast Fail vs. unabhaengig (QUALITY-GATES §5.4):** Struktur-Gates (Typecheck, Lint, Format, Guards) laufen in
`quality` zuerst und brechen dort frueh ab. Die teuren Jobs haengen bewusst **nicht** per `needs` an `quality`:
ein roter Lint-Schritt darf die Test-, A11y-, Visual- und Security-Evidenz nicht verdecken. Die Aggregation
erzwingt trotzdem, dass nichts Rotes als gruen durchgeht.

**Informell (nicht blockierend):** keine. Warnungen (eslint `warning`, `check:seo`-Laengenwarnung) sind sichtbar,
aber nicht blockierend, und in TESTING-CONTRACT als Befund gefuehrt.

## 4. Changelog-Gate nur fuer betroffene Pfade

`scripts/check-visual-baseline-changelog.mjs --base <PR-Basis | push-Vorgaenger | origin/main>` verlangt einen Eintrag
in `DESIGN-SYSTEM-CHANGELOG.md` **nur**, wenn im Diff eine Screenshot-Baseline (`e2e/*-snapshots/*.png`) liegt.
Backend, Doku und Tests ohne Baseline sind `NOT_AFFECTED`. Die Token-/Rollen-/Export-Oberflaeche prueft
unabhaengig davon `check:ds-changelog` (voller Vergleich, keine Pfad-Heuristik). Beide Gates haben einen
Self-Test bzw. eine vollstaendige Oberflaechenpruefung.

## 5. Artefakte

| Job                | Artefakt                     | Bedingung      | Aufbewahrung |
| ------------------ | ---------------------------- | -------------- | ------------ |
| `quality`          | `playwright-report`          | bei Fehlschlag | 7 Tage       |
| `performance`      | `perf-budget-report`         | immer          | 14 Tage      |
| `security-runtime` | `security-playwright-report` | bei Fehlschlag | 7 Tage       |
| `ap27-journeys`    | `ap27-journeys-report`       | bei Fehlschlag | 7 Tage       |
| `ap27-a11y`        | `ap27-a11y-report`           | bei Fehlschlag | 7 Tage       |
| `ap27-visual`      | `ap27-visual-diffs`          | bei Fehlschlag | 7 Tage       |

AP27-Configs setzen `trace`/`video` nicht auf Dauer-Aufzeichnung; Testdaten sind synthetisch, Provider-Hosts sind
abgefangen — Artefakte enthalten weder Secrets noch echte Personendaten.

## 6. Provider-Isolation in CI

Kein Job sendet an CRM, Mail, Analytics oder Shop: Backend-Ziele zeigen auf tote Ports oder den In-Process-Harness
mit geskriptetem Transport; fremde Hosts werden im Browser abgefangen (TESTING-CONTRACT §9, §12, §15). CI hat
**keine** Produktions-Credentials und braucht keine; ein Job, der eines braucht, verletzt diesen Vertrag.

## 7. Lokale Reproduktion

```bash
npm ci && npm ci --prefix server
npx tsc -b --noEmit && npx eslint . && npx prettier --check .
npm run test:guards && npm run check:befunde-seo && npm run check:claims && npm run check:visual-changelog
npm run test:unit && npm run test:component && npm run test:server && npm run test:integration
npm run test:integration:http && npm run test:e2e:core && npm run test:e2e:consent
npm run test:seo:regression
npm run a11y:suite            # braucht Node >= 20 (Vite-Dev-Server)
npm run test:visual:docker    # gepinntes Image; nie --update-snapshots als Fehlerbehebung
```

Die Node-18-Maschine dieses Repos braucht fuer jsdom-/Dev-Server-Stufen Node 22 im `PATH`
(TESTING-CONTRACT §2); CI hat diese Aufteilung nicht.

## 8. Grenzen

- **AP28** besitzt Deploy-, Health-, Backup-/Restore- und Rollback-Gates; dieser Vertrag verdrahtet keine davon.
- **AP30** friert den Release-Candidate-SHA ein und prueft, dass `ap27-gate` auf genau diesem SHA gruen ist.
- **AP26-WAIVER-01** (OA-11, OA-12) bleibt aktiv: gruene Security-Jobs heben den Waiver nicht auf und behaupten
  SEC-04/SEC-06 nicht als behoben.

## 9. Aenderungsregeln

- `ci.yml` ist ein geteilter Hotspot (AP24/AP25/AP26/AP27): neue Gates **additiv** als eigener Job oder Schritt;
  bestehende Jobs anderer APs nur mit deren Vertragsreferenz aendern.
- Ein neuer harter Job muss in `ap27-gate.needs` aufgenommen werden, sonst ist er kein Launch-Gate.
- Verboten: `continue-on-error` auf harten Gates, Retries ≥ 2 zur Flake-Maskierung, `--update-snapshots` in CI,
  Tests/Jobs deaktivieren, um gruen zu werden.

## 10. Aenderungsprotokoll

| Datum      | PT     | Aenderung                                                                                                                                   |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-15 | PT27.6 | Vertrag angelegt: Trigger/Reichweite mit Git-Wahrheit, Toolchain, 13 Jobs + Aggregation, Changelog-Gate, Artefakte, Isolation, Reproduktion |
