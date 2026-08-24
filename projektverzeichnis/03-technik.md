# 03 — Technik

## 1. Stack

| Bereich           | Technologie                                                         |
| ----------------- | ------------------------------------------------------------------- |
| Framework         | React 19.2 (`react`, `react-dom`)                                   |
| Routing           | react-router-dom 7.9                                                |
| SSR-Server        | Express 5.1 via `tsx` (`server.ts`)                                 |
| Build             | Vite 7.2 + `@vitejs/plugin-react`                                   |
| Styling           | Tailwind CSS 3.4 + PostCSS + Autoprefixer                           |
| Head-Management   | react-helmet-async 2.0                                              |
| i18n              | i18next 25.6 + react-i18next 16.3 + i18next-http-backend            |
| Icons             | lucide-react                                                        |
| Klassen-Utilities | clsx, tailwind-merge, class-variance-authority                      |
| Schrift           | @fontsource-variable/inter                                          |
| Proxy             | http-proxy-middleware 3.0                                           |
| Sprache           | TypeScript 5.9                                                      |
| Tests             | Vitest 4.1 (+ Testing Library, jsdom), Playwright 1.57              |
| Lint/Format       | ESLint 9 (flat config), Prettier 3.8, jsx-a11y, import, react-hooks |
| Git-Hooks         | lefthook 2.1                                                        |
| Bilder            | sharp (Build-Skripte)                                               |

## 2. SSR-Architektur

```
Browser ──► nginx (Host) ──► Express (server.ts) ──┬─► dist/server/entry-server.js  (SSR-Render)
                                                    ├─► dist/client/*               (Assets)
                                                    └─► /api/* ──► Backend (server/server.js)
```

- `src/entry-server.tsx` — `renderToString` + Helmet-Sammlung, gibt `{ html, helmet }` zurück
- `src/entry-client.tsx` — `hydrateRoot`
- `server.ts` ersetzt im `index.html`-Template die Platzhalter `<!--helmet-head-->`
  und den App-Mountpunkt. Sonderbehandlung: hat Helmet einen echten `<title>`,
  wird der statische Titel aus `index.html` entfernt, sonst hätte die Seite **zwei** Titel
  (Scraper nehmen den ersten).
- **Production serviert aus `dist/`, nicht aus `src/`.** Änderungen an `src/` sind
  erst nach `npm run build` sichtbar. `dist/` ist gitignored.

### 2.1 Code-Splitting

`React.lazy()` für alle Seiten außer `HomePage` und den drei Consumer-Landingpages.
`<Suspense fallback={null}>` ist korrekt, weil SSR das Markup bereits geliefert hat
und React 19 es bis zum Chunk-Load stehen lässt — kein Flash.

Manuelle Vendor-Chunks (nur Client-Build, `vite.config.ts`):
`vendor-react` (react, react-dom, react-router-dom) · `vendor-i18n` (i18next, react-i18next, http-backend) · `vendor-seo` (react-helmet-async).

`ssr.external`: `express`, `http-proxy-middleware`.
`ssr.noExternal`: `react-helmet-async` (kein ESM-Export).

### 2.2 Bewusst nicht gemacht

`sourcemap: false` — spürbar schnellerer Build.
Async-CSS-Plugin wurde **entfernt**: FCP fiel von 4,5 s auf 1,7 s, aber CLS stieg
von 0 auf 0,996 (Lighthouse-Score 67 → 57). Bei 74 KB CSS (12 KB gzip) ist
blockierendes CSS die bessere Wahl. Dokumentiert im Kopf von `vite.config.ts`.

## 3. Scroll-Verhalten

- `ScrollToTop` (Layout) — springt bei jedem Pfadwechsel nach oben
- `ScrollToHash` (nach `<Routes>` gerendert, damit es gewinnt) — stellt Ankerziele her.
  React Router tut das bei clientseitiger Navigation nicht. Läuft in
  `requestAnimationFrame` über max. 60 Frames (~1 s), weil Zielabschnitte lazy rendern.
  Offset aus `--chapterbar-offset`, sonst Header-Höhe + 16 px (gemessen, nicht hartkodiert —
  der Header schrumpft beim Scrollen). Respektiert `prefers-reduced-motion`.

## 4. Server (`server.ts`)

- Bindet auf **`127.0.0.1:PORT`** (nie 0.0.0.0 — der Reverse Proxy steht davor)
- `X-Powered-By` entfernt
- Lädt **kein** `.env` (kein dotenv-Import) — Env muss beim Start gesetzt werden
- Reihenfolge der Middleware: `sitemap.xml` → statische Assets → Sprachweiche →
  Legacy-Redirects → API-Proxy → SSR-Catch-all

### 4.1 Security-Header (`server.ts:420 ff.`)

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy-Report-Only: <Richtlinie>
```

Die CSP läuft **im Report-Only-Modus** — sie bricht die Seite nicht, meldet nur.
Eine Scharfschaltung ist ein offener Punkt.

### 4.2 Caching

| Antwort                | Header                                |
| ---------------------- | ------------------------------------- |
| `sitemap.xml`          | `public, max-age=3600, s-maxage=3600` |
| SSR-HTML               | `no-store, no-cache, must-revalidate` |
| `dist/client/assets/*` | Langzeit-Cache (gehashte Dateinamen)  |

### 4.3 API-Proxy

`/api/*` → `BACKEND_URL` (`http-proxy-middleware`). Preview: `http://127.0.0.1:5001`,
Docker-Prod: `http://backend:5000`.

## 5. Backend (`server/server.js`)

Eigener Express-4-Dienst, eigenes `package.json`, eigenes Dockerfile.
Abhängigkeiten: `@sendgrid/mail`, `cors`, `dotenv`, `express-rate-limit`, `pdfkit`.
`express.json({ limit: '10mb' })`.

| Endpunkt                   | Rate-Limit    | Zweck                                                | Frontend-Client                |
| -------------------------- | ------------- | ---------------------------------------------------- | ------------------------------ |
| `POST /api/contact`        | `formLimiter` | Kontaktformular → Mail                               | `src/api/contact.ts`           |
| `POST /api/support`        | `formLimiter` | Supportformular → Mail                               | `src/api/support.ts`           |
| `POST /api/consumer-order` | —             | Bestellung Consumer-Landingpages                     | `src/api/consumerOrder.ts`     |
| `POST /api/chat`           | —             | Chat-Widget — **Mock**, antwortet mit festen Strings | `ChatWidget.tsx`               |
| `POST /api/roi-report`     | `formLimiter` | ROI-Report als PDF (`pdfkit`)                        | `RoiCalculatorSection.tsx:110` |

Konfiguration über `server/.env` (nicht im Repo).
`POST /api/consumer-order` hat als einziger Formular-Endpunkt **kein** Rate-Limit.

Der Chat ist ein Prototyp: das Widget öffnet sich auf Desktop automatisch, zeigt eine
Ankündigungsnachricht und bekommt vom Backend Mock-Antworten. Der geplante Weg über
Azure Bot Service / Direct Line nach Microsoft Teams steht in
[CHAT_INTEGRATION.md](../CHAT_INTEGRATION.md).

`RoiCalculatorSection.tsx:108` trägt noch einen TODO-Kommentar, der Endpoint sei „noch
nicht live" — im Backend existiert er inzwischen.

## 6. Umgebungsvariablen

| Variable      | Preview                 | Docker-Prod           |
| ------------- | ----------------------- | --------------------- |
| `PORT`        | `9100`                  | `3000`                |
| `NODE_ENV`    | `production`            | `production`          |
| `BACKEND_URL` | `http://127.0.0.1:5001` | `http://backend:5000` |

## 7. Skripte (`package.json`)

| Skript                                           | Wirkung                                                               |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| `dev`                                            | `tsx server.ts` (SSR-Dev mit Vite-Middleware)                         |
| `dev:vite`                                       | reiner Vite-Dev-Server                                                |
| `build`                                          | `build:client` + `build:server`                                       |
| `build:client`                                   | `vite build --outDir dist/client`                                     |
| `build:server`                                   | `vite build --ssr src/entry-server.tsx --outDir dist/server`          |
| `build:prerender`                                | `tsc -b` + `vite build` + `scripts/prerender.mjs`                     |
| `start` / `preview`                              | `NODE_ENV=production tsx server.ts`                                   |
| `lint` · `typecheck` · `format` · `format:check` | Qualität                                                              |
| `check:colors`                                   | `scripts/check-color-tokens.mjs` — verbietet Hex außerhalb der Tokens |
| `test` (Vitest) · `test:e2e` (Playwright)        | Tests                                                                 |
| `server`                                         | Backend installieren und starten                                      |

## 8. Infrastruktur

### 8.1 Preview (`preview.polarisdx.net`) — der Server dieses Arbeitsverzeichnisses

Kein Docker, kein systemd, kein pm2. Ein **detached Node-Prozess** (PPID 1),
gestartet als `npx tsx server.ts`, lauscht auf `127.0.0.1:9100`;
nginx auf dem Host mappt die Domain darauf. Vollständige Restart-Prozedur:
[docs/deploy-preview.md](../docs/deploy-preview.md).

Wichtig: Prod-`./deploy.sh` (Docker) auf diesem Server **nicht** verwenden.
Und **niemals** `pkill -f 'tsx server.ts'` — das trifft auch Container-Instanzen
aus `01polaris-frontend`. Stattdessen den Prozess über den `:9100`-Listener finden
und die Prozessgruppe beenden.

### 8.2 Produktion — Docker Compose

| Service    | Build                 | Port-Mapping            | Netz          |
| ---------- | --------------------- | ----------------------- | ------------- |
| `frontend` | `./Dockerfile`        | `127.0.0.1:2026 → 3000` | `app-network` |
| `backend`  | `./server/Dockerfile` | `127.0.0.1:5000 → 5000` | `app-network` |

`restart: unless-stopped`, `frontend` mit `depends_on: backend`.
Steuerung über `./deploy.sh` (`build` · `up` · `test` · `logs` · `down`).

### 8.3 nginx.conf (Container-Variante, statisches Setup)

gzip an · Security-Header · 1-Jahr-Cache für Assets · SPA-Fallback `try_files $uri /index.html` ·
`/api/` → `http://backend:5000/api/`.
Beschreibt eine **statische** Auslieferung — passt nicht zum SSR-Server aus
`docker-compose.yml`, siehe [10-befunde.md](10-befunde.md).

### 8.4 Weitere Ziele

- `vercel.json` — Redirects + SPA-Rewrite; Altbestand aus der Vercel-Zeit
- `relaunch.polarisdx.net` — als `allowedHosts`/HMR-Host in `vite.config.ts` eingetragen
- `email/` — eigener Python-Container (`send.py`, `requirements.txt`, `Dockerfile`)
  für Outreach-Mailings (`dental-outreach.html`, `s3-leitlinie.html`, `vitamin-d3-k2-spray.html`)

## 9. Aliase

`~` → `./src` (in `vite.config.ts` und den tsconfig-Dateien).
tsconfig ist als Projektverbund angelegt: `tsconfig.json` (Solution),
`tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.server.json`.
