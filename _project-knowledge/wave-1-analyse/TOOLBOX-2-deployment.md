# TOOLBOX – Deployment-Optionen

## Aktiver Pfad
Docker-Compose mit Node-SSR (Express `server.ts` auf Port 3000, Container-Mapping 2026) hinter externem Reverse-Proxy, plus Backend-Container auf 5000; `nginx.conf` und `vercel.json` sind im Repo, aber aktuell nicht auf dem Laufpfad.

## Option A: Docker + Nginx
- Aufwand saubere Aufstellung: **2–3 Tage** (Reverse-Proxy + TLS/Let's Encrypt vor Compose schalten, `nginx.conf` entweder als Edge-Cache umfunktionieren oder entfernen, Healthcheck/Log-Rotation/Backups einrichten)
- Vorteil: SSR läuft nativ mit Express, keine Code-Anpassung, volle Kontrolle über Runtime und Backend-Proxy.
- Nachteil: keine Preview-URLs pro PR, manuelles Patchen/Monitoring/TLS, Wartungslast bleibt beim Team.

## Option B: Vercel
- Aufwand Migration: **3–5 Tage** (Express-SSR auf Vercel-Function oder Edge-Adapter portieren, `vercel.json` rewrites/redirects verifizieren, `/api`-Proxy auf Backend-URL umstellen, sitemap/prerender in Build-Step integrieren)
- Vorteil: Automatische Preview-Deployments pro PR, Edge-CDN, Git-Integration ohne eigene CI-Runner.
- Nachteil: SSR-Entry (`server.ts`) passt nicht 1:1, Vendor-Lock bei Build-Cache/Images/Edge-Functions, Node-Backend muss separat gehostet bleiben.

## Option C: Cloudflare Pages
- Aufwand Migration: **5–8 Tage** (Express → Workers-API portieren, Node-APIs durch Web-Fetch ersetzen, SSR-Bundle auf Workers-Laufzeit anpassen, Backend-Proxy über Worker-Route)
- Vorteil: Günstig, weltweites Edge-Netz, Preview-Deployments inklusive.
- Nachteil: Höchster Port-Aufwand (kein vollwertiges Node-Runtime), Express muss ersetzt werden, Debugging-Oberfläche schwächer.

## Empfehlung
**Option B (Vercel)** für das Frontend-Repo, das Backend (`server/`, Port 5000) bleibt in Docker auf eigenem Host. Der einmalige Portierungsaufwand (3–5 Tage) zahlt sich durch Preview-URLs, automatische TLS-/CDN-Verwaltung und reduzierte Ops-Last gegenüber Option A schnell aus; Option C kostet zu viel Umbau ohne proportionalen Gewinn.
