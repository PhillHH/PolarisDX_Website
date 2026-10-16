# Betriebshandbuch PolarisDX-Website (AP33)

Einstieg für alle, die an der Website arbeiten: Entwicklung, Redaktion mit Repository-Zugang,
Betrieb. Stand 2026-10-16, Branch-Linie des Relaunchs (`console/24-25-…`), Arbeitsbaum
`/home/phillip/01polaris-preview`.

Dieses Handbuch **beschreibt bestehende Verträge, es erfindet keine neuen** (CONTEXT-INDEX §4,
Zeile AP33). Wo es von Code oder Contract abweicht, gilt die Reihenfolge unten — und das Handbuch
wird korrigiert.

## 1. Was das Projekt ist

| Baustein | Technik                                                                                | Ort                                     |
| -------- | -------------------------------------------------------------------------------------- | --------------------------------------- |
| Website  | React 19 + Vite 7, serverseitig gerendert (SSR) durch Express 5 in `server.ts` (`tsx`) | `server.ts`, `src/`                     |
| Sprachen | genau 10: `de en pl fr it es pt da nl cs`, Default/`x-default` = `de`                  | `src/i18n.ts`, `public/locales/<lang>/` |
| Styling  | Tailwind 3, Design-System „Sales-Machine“ / AP34 „Editorial“                           | `tailwind.config.js`, `src/index.css`   |
| Backend  | Express 4 (CommonJS), SQLite-Lead-Foundation, Outbox/Retry, SendGrid                   | `server/` (eigenes `package.json`)      |
| Tests    | Vitest (unit/component/server), Playwright (E2E, Visual, A11y, Perf), Guard-Skripte    | `src/**/*.test.*`, `server/`, `e2e/`    |
| Betrieb  | Docker Compose, `deploy.sh` (Release = Git-SHA, Health-Gate, Rollback, Backup)         | `docker-compose*.yml`, `docs/deploy.md` |

Öffentliche Domain: `https://polarisdx.net` (einzige Canonical-Herkunft), Vorschau:
`preview.polarisdx.net` (nie indexierbar, nie Live-Zustellung).

## 2. Wo die Wahrheit steht

**Code vor Prosa, Contract vor Altdoku.** Verbindliche Reihenfolge laut
`building-docs/CONTEXT-INDEX.md` §3:

1. `building-docs/AGENT-CONTRACT.md` — Sicherheits- und Ausführungsregeln
2. `building-docs/PROJECT-CONSTRAINTS.md` — Decision Locks (`DEC-RL-001`–`015`, `REST-01`–`03`), nie wieder öffnen
3. `building-docs/scope/MASTER-SCOPE.md` — Scope je AP
4. `building-docs/work-packages/APxx.md` — operatives Arbeitspaket
5. `building-docs/*-CONTRACT.md` — technische Invarianten
6. `building-docs/state/AP-STATE.md` — aktueller Stand (Zustand, keine Autorität)
7. Repository-Evidenz — bestimmt den Ist-Zustand

| Frage                                      | Ausführbare Wahrheit (Code)                                                                   | Vertrag                                                                         |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Welche URLs gibt es, indexierbar, Sitemap? | `src/routing/routeRegistry.ts`, `src/routing/legacyRedirects.ts`                              | `ROUTING-CONTRACT.md`                                                           |
| Welche Sprachen/Namespaces?                | `src/i18n.ts`, `public/locales/**`                                                            | `I18N-CONTRACT.md`                                                              |
| Meta, Canonical, hreflang, Sitemap, Schema | `src/components/seo/*`                                                                        | `SEO-CONTRACT.md`                                                               |
| Farben, Tokens                             | `tailwind.config.js`, `PALETTE_HEX` in `scripts/check-color-tokens.mjs`                       | `DESIGN-SYSTEM-CONTRACT.md` (+ `-CHANGELOG`)                                    |
| Services / Artikel / Events / Befunde      | `src/data/services.tsx`, `src/data/articles.ts`, `src/data/events.ts`, `src/content/befunde/` | `SERVICE-DETAIL-`, `ARTICLES-`, `EVENTS-`, `BEFUNDE-CONTRACT.md`                |
| Downloads                                  | `src/content/resources/resourceInventory.ts`                                                  | `RESOURCES-CONTRACT.md`                                                         |
| Tracking / Consent                         | `src/lib/tracking.ts`, `src/lib/consentState.ts`, `src/lib/googleConsent.ts`                  | `TRACKING-`, `CONSENT-`, `CONSENT-TRACKING-CONTRACT.md`                         |
| Formulare, Leads, Zustellung               | `server/server.js`, `server/lead-foundation/`                                                 | `BACKEND-API-`, `LEAD-DATA-`, `LEAD-DELIVERY-CONTRACT.md`, `CRM-INTEGRATION.md` |
| Gates, Tests, Budgets                      | `package.json`, `.github/workflows/ci.yml`, `scripts/perf/budgets.json`                       | `QUALITY-GATES.md`, `TESTING-CONTRACT.md`, `PERFORMANCE-CONTRACT.md`            |
| Deployment, Backup, Rollback               | `deploy.sh`, `docker-compose.yml`, `docker-compose.preview.yml`                               | `DEPLOYMENT-CONTRACT.md`, Runbook `docs/deploy.md`                              |

**Nicht kanonisch** (nur historische Evidenz): `README.md`/`README.de.md` im Root (tragen Banner),
die `README.de.md` in `src/`, `src/data/`, `src/components/**` (beschreiben `main.tsx`, `routes/`,
`products.ts` — existieren nicht mehr), `docs/design-system.md`, `docs/ci.md`, `DOCS.md`,
`_project-knowledge/` (archivierter Schnappschuss mit zweiter `package.json`/`Dockerfile`).

## 3. Kontext lesen, bevor man ändert

Pflicht aus `AGENT-CONTRACT.md` §5–§7 — gilt für Menschen genauso wie für Agenten:

1. `building-docs/CONTEXT-INDEX.md` öffnen: welches AP/welcher Contract betrifft die Änderung?
2. Den Guard-Level der Datei prüfen (Matrix `IMPLEMENTATION-HOTSPOTS.md` §10):

| Level | Bedeutung                                        | Beispiele                                                                                                                                                                |
| ----- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| G3    | architekturkritisch: Contract + Regressionssuite | `server.ts`, `src/App.tsx`, `public/locales/**`, `src/pages/consumer/**`, `SEOHead.tsx`, `src/lib/tracking.ts`, `server/server.js`, `index.html`                         |
| G2    | erneut lesen + gezielte Tests                    | `Header.tsx`, `Footer.tsx`, `structuredData.ts`, `tailwind.config.js`, `src/i18n.ts`, `src/data/**`, `src/hooks/useSearch.ts`, `ci.yml`, `package.json`, Compose-Dateien |
| G1    | vor Änderung erneut lesen                        | `ChapterNav.tsx`, `SearchModal.tsx`, `robots.txt`, `vite.config.ts`, `lefthook.yml`, `src/components/befund/**`                                                          |
| G0    | gewöhnlich                                       | einzelne `src/components/ui/**`, Blatt-Sektionen, Assets                                                                                                                 |

3. Vor jeder Änderung `git status` und `git diff -- <datei>` lesen; fremde Änderungen bleiben
   unangetastet (Shared-Worktree-Umgebung, kein `stash`/`reset`/`clean`, AGENT-CONTRACT §3).
4. Kein Secret-Wert in Ausgaben, Logs, Commits oder Doku; keine Kundendaten im Repo (§4).
5. Preview/Staging erzeugen **nie** produktive Side Effects (CRM, Queue, Mail).
6. Nach Abschluss eines Arbeitspakets `building-docs/state/AP-STATE.md` fortschreiben (§6).

## 4. Lokal starten

Voraussetzung: **Node 22** (CI und Docker-Images nutzen 22; `unit`/`component` brauchen ≥ 20),
npm 10, Docker für Visual-Baselines und Secret-Scan.

```bash
npm ci                          # Root; installiert auch lefthook (pre-commit-Guards)
npm ci --prefix server          # Backend-Abhängigkeiten (Root-`npm ci` installiert sie nicht)

# Backend IMMER im Trockenlauf (sonst sendet ein SendGrid-Schlüssel aus server/.env echte Mails)
DRY_RUN=1 LEAD_DB_PATH="$PWD/node_modules/.cache/dev-leads.sqlite3" npm --prefix server start   # :5000

# Frontend: SSR mit Vite-Middleware und HMR
npm run dev                     # http://localhost:3000, Port über PORT=…, Backend über BACKEND_URL=…
```

- `npm run server` macht `npm install && npm start` in `server/` **ohne** `DRY_RUN` — lokal meiden.
- `npm run start`/`npm run preview` laufen mit `NODE_ENV=production` und lesen `dist/client` und
  `dist/server`. Das braucht vorher `npm run build`. **Achtung:** Im Preview-Arbeitsbaum
  dient `dist/` dem Host-Prozess-Rückfallweg der Preview (`docs/deploy-preview.md`). Für eigene
  Prüfungen in ein Cache-Verzeichnis bauen und per `POLARIS_CLIENT_DIST_DIR`/`POLARIS_SERVER_DIST_DIR`
  starten — so machen es alle `e2e/pt27.*.config.ts`.
- `TSX_TSCONFIG_PATH=tsconfig.app.json` ist Pflicht für jeden `tsx`-Start (JSX in
  `src/data/services.tsx`); die npm-Skripte setzen es bereits.
- `server.ts` lädt **kein** `.env`; Variablen beim Start setzen. Frontend-Variablen (`VITE_*`) werden
  zur Bauzeit eingebacken, Vorlage `.env.example`. Backend: `server/.env` (nicht versioniert).
- Belegter Port? Playwright-Configs verweigern einen belegten Port (`reuseExistingServer: false`),
  Ausweichen über `E2E_PORT=…`. `vite`-Cache nicht beschreibbar? `POLARIS_VITE_CACHE_DIR=…` setzen.

Schnellprüfung vor einem Commit (dasselbe läuft teilweise automatisch über `lefthook.yml`):

```bash
npm run typecheck && npm run lint && npm run format:check
npm run test:guards && npm test
```

## 5. Die Handbuch-Dateien

| Datei                            | Zielgruppe                | Inhalt (AP33-Bezug)                                                                                   |
| -------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------- |
| [entwicklung.md](entwicklung.md) | Entwicklung               | PT33.1: Architektur, Routing, i18n, SEO, Datenmodelle, Komponenten, Leads, Consent, Tests, Deployment |
| [redaktion.md](redaktion.md)     | Redaktion mit Repo-Zugang | PT33.2: Service, Artikel, Event, Download, Übersetzung, Musterbefund, Meta, Bilder                    |
| [wartung.md](wartung.md)         | Entwicklung / Review      | PT33.3: Checklisten je Änderungstyp — Dateien, Guards, Contract                                       |
| [uebergabe.md](uebergabe.md)     | Übergabe an neues Team    | PT33.4: sechs Walkthroughs, Voraussetzungen, offene Owner-Punkte                                      |

Weitere Betriebsdokumente: `docs/deploy.md` (Runbook, einziger produktiver Zielpfad),
`docs/deploy-preview.md` (Rückfallweg der Preview), `building-docs/CI-CONTRACT.md` (CI-Regeln).

## 6. Grundregeln in einem Satz je Thema

- **Eine Route entsteht nur in der Route Registry**; Server, Sitemap, Suche und Tests leiten ab.
- **Jeder sichtbare Text in allen 10 Sprachen im selben Change**; Englisch-Fallback ist kein Zielzustand.
- **Budgets, Kontraste, Claim-Register werden nie gelockert**; rote Gates werden behoben, nicht umgangen.
- **Keine erfundenen Zahlen, Bilder, Claims**; Aussagen stehen im Claim-Register oder entfallen.
- **Visual-Baselines nur im gepinnten Docker-Image** und nur mit Eintrag im Design-System-Changelog.
- **Tracking nur über `track()`** und nur nach Einwilligung; nie `dataLayer`/`gtag` im Feature-Code.
- **Produktion nur über `./deploy.sh`** mit Owner-Go; Rollback tauscht Images, nie Quellcode.
