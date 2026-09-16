# PERFORMANCE-CONTRACT — PolarisDX Website Relaunch

> **AP25 — Performance und Core Web Vitals.** Angelegt in **PT25.1 — Performance-Baseline**
> (2026-09-14). Dieser Vertrag haelt die **gemessene Ausgangslage** fest, bevor irgendetwas optimiert wird.
> PT25.1 hat **keinen Produktcode** geaendert. Alle Zahlen sind **LAB- bzw. PREVIEW-Messungen** —
> **keine Field-/RUM-Werte, kein p75 realer Nutzer, kein INP**.
>
> **Aktueller Stand (2026-09-15): AP25 COMPLETE, AP25-CLOSURE PASS — der konsolidierte, gueltige Stand steht in §30.**
> §1–§29 dokumentieren Baseline und Verlauf; bei Abweichungen gilt §30 (u. a. Korrektur der Node-Versionen, §30.3).

---

## 0. Scope und Autoritaet

| Punkt              | Festlegung                                                                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Autoritaet         | `building-docs/work-packages/AP25.md` §3 (Grundregeln, Messprinzip), §4 (harte Regeln), §8 (Umgebungen), §9 (PT25.1)                                                              |
| Besitz             | AP25 besitzt Performance-Baseline, Budgets, CWV-Wahrheit. AP23 besitzt weiterhin Consent und die Metrics-API, AP24 die Accessibility-Vertraege, AP26/AP27/AP28 bleiben unberuehrt |
| Messprinzip        | Jede Zahl traegt Route, Locale (aus dem Pfad), Environment, Tool, Device-Profil und Build. Ein Lighthouse-Score ohne diesen Kontext ist hier **keine** Evidence                   |
| Nicht-Ziele PT25.1 | keine Optimierung, kein SSR-/Consent-/A11y-Eingriff, kein Metrics-Transport, kein Shopify-Scope                                                                                   |
| Nachfolger         | PT25.2 (Rendering/SSR/Hydration) → PT25.3 (Bilder/LCP/CLS) → PT25.4 (Fonts/CSS) → PT25.5 (Budgets/Gate) → AP25-CLOSURE                                                            |

## 1. Git / HEAD / Messdatum

| Punkt         | Wert                                                                                                                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch        | `console/24-25-2026-09-11T13-00-11`                                                                                                                                                                                                                                          |
| HEAD          | `48ca775ac70f6bab0869ac8a37ad035494ff4a64` (2026-09-08)                                                                                                                                                                                                                      |
| Arbeitsbaum   | **nicht sauber**: die unkommitteten AP21–AP24-Aenderungen (233 `git status --porcelain`-Zeilen vor PT25.1) sind Teil des LAB-Builds. „HEAD 48ca775" allein beschreibt den gemessenen Code also **nicht** vollstaendig — gemessen wurde **HEAD + Arbeitsbaum vom 2026-09-14** |
| LAB-Build     | Client-Entry `assets/index-ConcUUwH.js`, CSS `assets/index-CAt_BnsO.css` (Vite-Manifest `node_modules/.cache/pt25.1/client/.vite/manifest.json`)                                                                                                                             |
| PREVIEW-Build | Container-Image `polaris-preview-frontend:ap23-preview-20260911`, Client-Entry `assets/index-B7KJqexA.js` — **AP23-Stand ohne AP24** (siehe §22 Drift)                                                                                                                       |
| Messdatum     | 2026-09-14, 08:55–09:55 UTC (HTTP-Matrix 09:37, Lighthouse LAB bis 09:14, PREVIEW bis 09:21, Collector LAB 09:43/09:44, PREVIEW 09:47/09:48)                                                                                                                                 |

## 2. Toolchain / Browser

| Werkzeug                          | Version                                                                                           | Verwendung                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Lighthouse                        | **13.4.1** (`npx lighthouse@13.4.1`, verlangt Node ≥ 22.19)                                       | Mobile/Desktop-Baseline                     |
| Node (Lighthouse)                 | 22.23.2 (nvm)                                                                                     | nur Lighthouse-Runner                       |
| Node (Build, Server, Playwright)  | 20.19.6 (nvm)                                                                                     | `vite build`, `npm run start`, Collector    |
| Chrome (Lighthouse)               | Chrome for Testing **151.0.7922.34**, `--headless=new`                                            |                                             |
| Chromium (Collector)              | Playwright-Chromium **143.0.7499.4** (`@playwright/test` 1.57.0)                                  | Hydration, Long Tasks, Wasserfall, Inventar |
| Vite / React / Router             | 7.2.4 / 19.2.0 / react-router-dom 7.9.6                                                           |                                             |
| Tailwind / i18next / http-backend | 3.4.18 / 25.6.3 / 3.0.2                                                                           |                                             |
| Font                              | `@fontsource-variable/inter` 5.2.8                                                                |                                             |
| Maschine                          | AMD EPYC 9634, 8 vCPU, 15 GB RAM; Lighthouse-BenchmarkIndex 2317 (LAB-Lauf) / 2598 (PREVIEW-Lauf) |                                             |

## 3. Messumgebungen

### 3.1 LAB

- **Build:** `npm run perf:build` → Client + SSR nach `node_modules/.cache/pt25.1/{client,server}` (nicht `dist/`, damit kein fremder Stand ueberschrieben wird).
- **Origin:** `NODE_ENV=production PORT=3960 POLARIS_CLIENT_DIST_DIR=… POLARIS_SERVER_DIST_DIR=… npm run start` → `http://127.0.0.1:3960`. Isoliert, kein Proxy.
- **Wichtig:** der Node-Origin liefert **unkomprimiert** (`server.ts` hat keine Kompression). Das macht LAB-Mobile unter simulierter Drosselung deutlich langsamer als PREVIEW (§5). LAB ist damit die **Wahrheit fuer Bundle, Chunks, Hydration und den aktuellen Code**, aber **nicht** fuer Transfergroessen hinter dem Reverse Proxy.
- **Lighthouse mobile:** Standardprofil (Moto-G-Power-Emulation 412×823, DPR 1.75), `throttlingMethod=simulate`, RTT 150 ms, 1.638,4 kbit/s, CPU 4×. **3 Laeufe je Route**, repraesentativer Lauf = Lauf mit medianem LCP.
- **Lighthouse desktop:** `--preset=desktop` (1350×940, RTT 40 ms, 10.240 kbit/s, CPU 1×). 3 Laeufe je Route.
- **Collector (Playwright):** mobil 412×823 DPR 1.75 mit **angewandter** CDP-Drosselung (150 ms Latenz, 1,6 Mbit/s, CPU 4×); desktop 1350×940 ohne Drosselung. Je Route **kalt** (neuer Browser-Kontext) und **warm** (zweite Navigation im selben Tab, HTTP-Cache gefuellt). Erfassung bis Hydration-Ende + 2 s.

### 3.2 PREVIEW

- `https://preview.polarisdx.net` (152.53.252.39), Host-nginx 1.22.1 davor, **gzip**, **kein brotli**. HTML `no-store`, gehashte Assets `public, max-age=31536000, immutable`, Locale-JSON `public, max-age=3600` + ETag.
- Lighthouse mobile + desktop **je 1 Lauf** (kalt, Lighthouse setzt den Speicher zurueck). Warm-Verhalten ueber den Collector (kalt/warm) — ein zweiter Lighthouse-Aufruf ist **kein** Warm-Lauf, weil jeder Aufruf ein frisches Chrome-Profil startet; dieser Weg wurde deshalb bewusst verworfen.
- Der Messrechner und die Preview liegen im selben Netz — PREVIEW misst **nginx + gzip + echten Preview-Stack**, **nicht** das Weitverkehrsnetz. RTT kommt nur aus der Drosselung.
- **Keine Analytics-Kontamination:** es wird nie Consent erteilt. Gemessen: **0 Analytics-/Marketing-Provider-Requests** in allen 34 auswertbaren Lighthouse-Laeufen (36 inkl. 2 Abbrueche auf dem 404-Pfad) und allen 72 Collector-Navigationen auf PREVIEW (Host-Regex: googletagmanager, google-analytics, doubleclick, hihuman, facebook, hotjar, clarity, linkedin/px, analytics.google).

### 3.3 FIELD / RUM

```text
FIELD_METRICS = NOT_AVAILABLE
```

Begruendung: `initWebVitals()` wird von **keinem** Produktmodul aufgerufen, `setMonitoringSink()` ebenso wenig
(`src/lib/monitoring/separation.test.ts` erzwingt genau das), `VITE_TELEMETRY_SCOPE=NONE` → Gate
`NO_TRANSPORT_CONFIGURED`. Es existiert kein Sample. **Kein Wert in diesem Vertrag darf als Field-/p75-Wert gelesen werden.**

### 3.4 Reproduktion

| Schritt                 | Befehl                                                                                                                        | Ergebnis                                                                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build                   | `npm run perf:build`                                                                                                          | Client + SSR + Manifest unter `node_modules/.cache/pt25.1/`                                                                                             |
| Bundle-Report           | `npm run perf:bundle`                                                                                                         | Initial-JS/CSS, Chunk-Map, Route-JS, Font-/Bildinventar; **Exit 1 bei unvollstaendigem Inventar**                                                       |
| Modul-Attribution       | `vite build --sourcemap --outDir node_modules/.cache/pt25.1/client-sm` + `node scripts/perf/chunk-attribution.mjs <chunk.js>` | Bytes je Quellmodul                                                                                                                                     |
| HTTP-Matrix             | `npm run perf:http -- <origin> 6 <label>`                                                                                     | HTTP-Wahrheit, TTFB kalt/warm, HTML-Groesse, SSR-Root; **Exit 1 bei falschem Status**                                                                   |
| Lighthouse              | `CHROME_PATH=… npm run perf:lighthouse -- --origin <o> --env LAB\|PREVIEW --runs 3 --profiles mobile,desktop` (Node ≥ 22.19)  | Rohdaten + `summary-*.json`; vorhandene Rohdateien werden nur neu ausgewertet                                                                           |
| Collector + Integritaet | `npm run perf:collect` (LAB) bzw. `PERF_ORIGIN=https://preview.polarisdx.net PERF_ENV=PREVIEW npm run perf:collect`           | `results/pw-<ENV>-<profil>.json`; **Test schlaegt fehl** bei falschem HTTP-Status, leerem SSR-Root, Provider-Request ohne Consent oder Hydration-Fehler |
| Tabellen                | `node scripts/perf/baseline-tables.mjs`                                                                                       | Markdown aus den Rohdaten                                                                                                                               |
| CLS-Repro               | `node scripts/perf/cls-warm-repro.mjs [origin…]`                                                                              | Befund PERF-B05                                                                                                                                         |

Routenmatrix fuer alle Skripte: `scripts/perf/routes.mjs` (Single Source).

## 4. Route Matrix

| ID               | Seitentyp                       | Pfad                                            | Locale | HTTP erwartet |
| ---------------- | ------------------------------- | ----------------------------------------------- | ------ | ------------- |
| home             | Homepage                        | `/de/`                                          | de     | 200           |
| diagnostics-hub  | Diagnostics Hub                 | `/de/diagnostics`                               | de     | 200           |
| service-detail   | Service Detail (Dental)         | `/de/diagnostics/dental`                        | de     | 200           |
| igloo-pro        | IglooPro                        | `/de/igloo-pro`                                 | de     | 200           |
| epigenetics-hub  | Epigenetics Hub                 | `/de/epigenetics`                               | de     | 200           |
| epigenetics-deep | Epigenetics Vertiefung          | `/de/epigenetics/grundlagen`                    | de     | 200           |
| musterbefund     | Musterbefund, chart-/datenreich | `/de/epigenetics/musterbefund/metabolic-health` | de     | 200           |
| articles-index   | Articles Index                  | `/de/articles`                                  | de     | 200           |
| article-detail   | Article Detail                  | `/de/articles/die-gruene-praxis`                | de     | 200           |
| events           | Events                          | `/de/events`                                    | de     | 200           |
| downloads        | Downloads / Resource Center     | `/de/downloads`                                 | de     | 200           |
| contact          | Contact                         | `/de/contact`                                   | de     | 200           |
| consumer-d3      | Consumer Vitamin D3             | `/de/consumer/vitamin-d3-spray`                 | de     | 200           |
| consumer-duo     | Consumer Duo (Masks + D3)       | `/de/consumer/inside-out-duo`                   | de     | 200           |
| not-found        | 404-Kontrollpfad (SSR)          | `/de/pt25-baseline-gibt-es-nicht`               | de     | **404**       |
| home-en          | Homepage                        | `/en/`                                          | en     | 200           |
| home-pl          | Homepage, lange Locale          | `/pl/`                                          | pl     | 200           |
| musterbefund-pl  | Musterbefund, lange Locale      | `/pl/epigenetics/musterbefund/metabolic-health` | pl     | 200           |

`en` ist bewusst dabei: `en` ist die i18n-Fallback-Sprache und laedt dadurch **halb so viele** Locale-Dateien (PERF-B01).

### 4.1 HTTP-Wahrheit, SSR und Server-TTFB (node:http, ohne Browser, 6 Abrufe je Route)

**18/18 LAB und 18/18 PREVIEW** mit erwartetem Status; SSR-Root auf allen Routen gefuellt (inkl. 404).

| Route                                         | erwartet | LAB HTTP | LAB TTFB kalt / warm-Median ms | LAB HTML Bytes (identity) | PREVIEW HTTP | PREVIEW TTFB kalt / warm-Median ms | PREVIEW Transfer Bytes (gzip) / HTML | SSR-Root gefüllt LAB/PREVIEW | modulepreload / preload |
| --------------------------------------------- | -------- | -------- | ------------------------------ | ------------------------- | ------------ | ---------------------------------- | ------------------------------------ | ---------------------------- | ----------------------- |
| /de/                                          | 200      | 200      | 21 / 19                        | 83.835                    | 200          | 93 / 13                            | 14.712 / 83.819                      | ja / ja                      | 3 / 3                   |
| /de/diagnostics                               | 200      | 200      | 17 / 15                        | 89.876                    | 200          | 10 / 11                            | 12.892 / 89.578                      | ja / ja                      | 3 / 3                   |
| /de/diagnostics/dental                        | 200      | 200      | 12 / 15                        | 71.271                    | 200          | 9 / 14                             | 11.550 / 70.962                      | ja / ja                      | 3 / 2                   |
| /de/igloo-pro                                 | 200      | 200      | 8 / 11                         | 64.535                    | 200          | 10 / 9                             | 10.609 / 64.226                      | ja / ja                      | 3 / 3                   |
| /de/epigenetics                               | 200      | 200      | 19 / 16                        | 151.481                   | 200          | 19 / 19                            | 22.999 / 151.103                     | ja / ja                      | 3 / 2                   |
| /de/epigenetics/grundlagen                    | 200      | 200      | 8 / 8                          | 54.147                    | 200          | 7 / 7                              | 9.890 / 53.833                       | ja / ja                      | 3 / 2                   |
| /de/epigenetics/musterbefund/metabolic-health | 200      | 200      | 19 / 17                        | 210.728                   | 200          | 18 / 19                            | 26.698 / 210.414                     | ja / ja                      | 3 / 2                   |
| /de/articles                                  | 200      | 200      | 9 / 9                          | 56.130                    | 200          | 12 / 9                             | 8.916 / 55.821                       | ja / ja                      | 3 / 2                   |
| /de/articles/die-gruene-praxis                | 200      | 200      | 10 / 8                         | 54.133                    | 200          | 8 / 8                              | 10.950 / 53.824                      | ja / ja                      | 3 / 2                   |
| /de/events                                    | 200      | 200      | 9 / 8                          | 47.494                    | 200          | 9 / 10                             | 8.084 / 47.185                       | ja / ja                      | 3 / 2                   |
| /de/downloads                                 | 200      | 200      | 18 / 19                        | 103.407                   | 200          | 22 / 22                            | 10.520 / 103.098                     | ja / ja                      | 3 / 2                   |
| /de/contact                                   | 200      | 200      | 11 / 12                        | 69.179                    | 200          | 9 / 10                             | 10.808 / 68.888                      | ja / ja                      | 3 / 2                   |
| /de/consumer/vitamin-d3-spray                 | 200      | 200      | 11 / 7                         | 72.501                    | 200          | 12 / 9                             | 12.257 / 72.328                      | ja / ja                      | 3 / 2                   |
| /de/consumer/inside-out-duo                   | 200      | 200      | 7 / 6                          | 53.958                    | 200          | 7 / 10                             | 9.504 / 53.793                       | ja / ja                      | 3 / 2                   |
| /de/pt25-baseline-gibt-es-nicht               | 404      | 404      | 9 / 7                          | 37.180                    | 404          | 7 / 7                              | 6.124 / 36.882                       | ja / ja                      | 3 / 2                   |
| /en/                                          | 200      | 200      | 10 / 12                        | 83.970                    | 200          | 14 / 14                            | 14.435 / 83.920                      | ja / ja                      | 3 / 3                   |
| /pl/                                          | 200      | 200      | 11 / 13                        | 83.625                    | 200          | 10 / 11                            | 14.982 / 83.598                      | ja / ja                      | 3 / 3                   |
| /pl/epigenetics/musterbefund/metabolic-health | 200      | 200      | 19 / 20                        | 205.718                   | 200          | 16 / 16                            | 27.375 / 205.415                     | ja / ja                      | 3 / 2                   |

## 5. Mobile Baseline (Lighthouse 13.4.1, kalt)

LAB = Median aus 3 Laeufen (Streuung in Klammern), PREVIEW = 1 Lauf. Zeiten in ms, Transfer in KB.

| Route                                         | LAB Score (min–max)                                                                                                                                   | LAB FCP | LAB LCP median (min–max) | LAB TBT | LAB CLS | LAB TTFB | LAB Transfer KB | PREVIEW Score | PREVIEW FCP | PREVIEW LCP | PREVIEW TBT | PREVIEW CLS | PREVIEW TTFB | PREVIEW Transfer KB | LCP-Element (LAB)                              |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------ | ------- | ------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | ----------- | ------------ | ------------------- | ---------------------------------------------- |
| /de/                                          | 0.7 (0.7–0.7)                                                                                                                                         | 4.565   | 5.090 (5.085–5.100)      | 4       | 0.003   | 22       | 1.563           | 0.97          | 1.860       | 2.260       | 0           | 0.003       | 17           | 567                 | `img.relative` IglooPro Point-of-Care-Reade    |
| /de/diagnostics                               | 0.7 (0.69–0.7)                                                                                                                                        | 4.589   | 5.114 (5.078–5.261)      | 0       | 0.003   | 25       | 1.589           | 0.98          | 1.806       | 2.181       | 0           | 0.003       | 13           | 572                 | `p.mt-6` PolarisDX bündelt Point-of-C          |
| /de/diagnostics/dental                        | 0.71 (0.7–0.72)                                                                                                                                       | 4.402   | 4.852 (4.846–5.037)      | 0       | 0.003   | 24       | 1.558           | 0.98          | 1.808       | 2.033       | 5           | 0.003       | 12           | 557                 | `p.mt-4` Point-of-Care-Messungen könn          |
| /de/igloo-pro                                 | 0.71 (0.7–0.71)                                                                                                                                       | 4.409   | 4.934 (4.932–5.110)      | 2       | 0.003   | 24       | 1.561           | 0.98          | 1.806       | 2.181       | 7           | 0.003       | 9            | 569                 | `img.relative` IglooPro Point-of-Care-Reade    |
| /de/epigenetics                               | 0.68 (0.67–0.68)                                                                                                                                      | 4.863   | 5.313 (5.312–5.484)      | 0       | 0.003   | 37       | 1.711           | 0.98          | 1.855       | 2.106       | 3           | 0.004       | 24           | 590                 | `p.mt-5` Sechs Analysen aus Kapillarb          |
| /de/epigenetics/grundlagen                    | 0.7 (0.65–0.7)                                                                                                                                        | 4.508   | 5.033 (5.032–6.541)      | 0       | 0.003   | 19       | 1.546           | 0.98          | 1.808       | 2.108       | 0           | 0.003       | 9            | 557                 | `p.mt-5` Die sechs Analysen ergänzen           |
| /de/epigenetics/musterbefund/metabolic-health | 0.66 (0.66–0.66)                                                                                                                                      | 5.300   | 5.750 (5.747–5.755)      | 3       | 0.003   | 31       | 2.087           | 0.96          | 2.108       | 2.483       | 7           | 0.003       | 18           | 699                 | `p.mt-4` Was Ihr Klient isst, verwert          |
| /de/articles                                  | 0.68 (0.68–0.7)                                                                                                                                       | 4.509   | 5.557 (5.035–5.709)      | 0       | 0.003   | 17       | 1.713           | 0.98          | 1.808       | 2.108       | 0           | 0.003       | 14           | 732                 | `h2.t-h2-section` Entdecken Sie unsere Artikel |
| /de/articles/die-gruene-praxis                | 0.71 (0.69–0.71)                                                                                                                                      | 4.401   | 5.001 (4.998–5.183)      | 1       | 0.003   | 17       | 1.641           | 0.94          | 1.885       | 2.933       | 27          | 0.003       | 11           | 621                 | `img.h-auto` div > div > figure.mt-10 > i      |
| /de/events                                    | 0.7 (0.7–0.7)                                                                                                                                         | 4.508   | 5.033 (5.033–5.037)      | 0       | 0.003   | 16       | 1.527           | 0.98          | 1.810       | 2.110       | 0           | 0.003       | 22           | 550                 | `p.mx-auto` Von Stuttgart bis Hamburg —        |
| /de/downloads                                 | 0.7 (0.69–0.7)                                                                                                                                        | 4.565   | 5.015 (4.995–5.182)      | 0       | 0.003   | 26       | 1.608           | 0.98          | 1.810       | 2.035       | 0           | 0.003       | 22           | 560                 | `p.mt-4` Infoblätter, Musterbefunde,           |
| /de/contact                                   | 0.7 (0.7–0.71)                                                                                                                                        | 4.507   | 5.032 (4.889–5.033)      | 0       | 0.003   | 19       | 1.562           | 0.98          | 1.806       | 2.031       | 4           | 0.003       | 11           | 558                 | `p.mt-4` Beratung, Angebot oder Suppo          |
| /de/consumer/vitamin-d3-spray                 | 0.69 (0.69–0.7)                                                                                                                                       | 4.503   | 5.411 (5.306–5.414)      | 0       | 0.000   | 14       | 1.603           | 0.96          | 1.811       | 2.486       | 0           | 0.000       | 11           | 616                 | `h1.text-4xl` Tägliche Unterstützung mit V     |
| /de/consumer/inside-out-duo                   | 0.69 (0.69–0.7)                                                                                                                                       | 4.505   | 5.405 (5.159–5.415)      | 0       | 0.000   | 17       | 1.564           | 0.97          | 1.813       | 2.338       | 0           | 0.000       | 9            | 593                 | `h1.text-4xl` Unterstützung von innen. Feu     |
| /en/                                          | 0.69 (0.69–0.69)                                                                                                                                      | 4.658   | 5.258 (5.258–5.258)      | 1       | 0.003   | 21       | 1.200           | 0.95          | 1.944       | 2.710       | 43          | 0.003       | 21           | 452                 | `img.relative` IglooPro point-of-care reade    |
| /pl/                                          | 0.65 (0.65–0.66)                                                                                                                                      | 5.257   | 5.782 (5.705–5.784)      | 0       | 0.003   | 21       | 1.648           | 0.94          | 2.256       | 2.631       | 18          | 0.003       | 13           | 654                 | `img.relative` Czytnik point-of-care IglooP    |
| /pl/epigenetics/musterbefund/metabolic-health | 0.63 (0.63–0.63)                                                                                                                                      | 5.748   | 6.273 (6.271–6.291)      | 10      | 0.003   | 32       | 2.168           | 0.91          | 2.555       | 2.930       | 4           | 0.003       | 18           | 786                 | `p.mt-4` Co Twój klient je, jak to pr          |
| /de/pt25-baseline-gibt-es-nicht (404)         | nicht messbar: Lighthouse bricht Dokumente mit HTTP 404 ab (`ERRORED_DOCUMENT_REQUEST`, 3/3 Läufe) — 404 ist über HTTP-Matrix und Collector abgedeckt |         |                          |         |         |          |                 |               |             |             |             |             |              |                     |                                                |

**Lesart:** LAB mobil liegt bei LCP 4.852–6.273 ms (Score 0,63–0,71), PREVIEW mobil bei **2.031–2.933 ms** (Score 0,91–0,98).
Der Abstand ist **ueberwiegend Kompression**: LAB ueberträgt 1.200–2.168 KB, PREVIEW 452–786 KB fuer denselben Seitenaufbau
(Lighthouse simuliert 1,6 Mbit/s; unkomprimierte 405 KB Entry + 92 KB CSS + ~700 KB Locale-JSON dominieren FCP).
Weil PREVIEW den AP23-Build ohne AP24 ausliefert, ist **keine** der beiden Spalten allein „der" Stand — siehe §22.

## 6. Desktop Baseline (Lighthouse 13.4.1, kalt)

| Route                                         | LAB Score (min–max)                                                                                                                                   | LAB FCP | LAB LCP median (min–max) | LAB TBT | LAB CLS | LAB TTFB | LAB Transfer KB | PREVIEW Score | PREVIEW FCP | PREVIEW LCP | PREVIEW TBT | PREVIEW CLS | PREVIEW TTFB | PREVIEW Transfer KB | LCP-Element (LAB)                               |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------ | ------- | ------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | ----------- | ------------ | ------------------- | ----------------------------------------------- |
| /de/                                          | 0.98 (0.94–0.98)                                                                                                                                      | 888     | 990 (956–1.451)          | 0       | 0.000   | 21       | 1.567           | 1             | 419         | 469         | 0           | 0.000       | 18           | 572                 | `img.relative` IglooPro Point-of-Care-Reade     |
| /de/diagnostics                               | 0.98 (0.98–0.98)                                                                                                                                      | 856     | 936 (933–988)            | 0       | 0.000   | 24       | 1.589           | 1             | 405         | 465         | 0           | 0.000       | 18           | 572                 | `img.relative` IglooPro Reader als Beispiel     |
| /de/diagnostics/dental                        | 0.98 (0.98–0.98)                                                                                                                                      | 861     | 941 (937–971)            | 0       | 0.000   | 28       | 1.558           | 1             | 405         | 445         | 0           | 0.000       | 12           | 557                 | `h1.mt-5` Chairside-Diagnostik für Zah          |
| /de/igloo-pro                                 | 0.98 (0.98–0.98)                                                                                                                                      | 890     | 990 (985–991)            | 0       | 0.000   | 19       | 1.561           | 1             | 407         | 467         | 0           | 0.000       | 11           | 569                 | `img.relative` IglooPro Point-of-Care-Reade     |
| /de/epigenetics                               | 0.97 (0.97–0.97)                                                                                                                                      | 940     | 1.024 (1.024–1.051)      | 0       | 0.000   | 32       | 1.711           | 1             | 420         | 451         | 0           | 0.000       | 25           | 590                 | `h1.max-w-3xl` Epigenetik und Genetik aus e     |
| /de/epigenetics/grundlagen                    | 0.98 (0.98–0.98)                                                                                                                                      | 886     | 966 (939–980)            | 0       | 0.000   | 21       | 1.546           | 1             | 412         | 452         | 0           | 0.000       | 14           | 557                 | `p.mt-3` Die Auswertung erfolgt bei u           |
| /de/epigenetics/musterbefund/metabolic-health | 0.96 (0.96–0.96)                                                                                                                                      | 1.030   | 1.110 (1.099–1.117)      | 0       | 0.000   | 39       | 2.087           | 1             | 449         | 509         | 0           | 0.000       | 31           | 699                 | `h1.mt-4` Metabolic Health                      |
| /de/articles                                  | 0.97 (0.96–0.97)                                                                                                                                      | 891     | 1.072 (1.071–1.323)      | 0       | 0.000   | 19       | 1.713           | 1             | 408         | 448         | 0           | 0.000       | 13           | 732                 | `img.aspect-video` div#article-list > article > |
| /de/articles/die-gruene-praxis                | 0.98 (0.98–0.98)                                                                                                                                      | 868     | 968 (957–982)            | 0       | 0.000   | 16       | 1.641           | 1             | 409         | 449         | 0           | 0.000       | 17           | 621                 | `img.h-auto` div > div > figure.mt-10 > i       |
| /de/events                                    | 0.98 (0.98–0.98)                                                                                                                                      | 888     | 968 (945–979)            | 0       | 0.000   | 34       | 1.527           | 1             | 406         | 446         | 0           | 0.000       | 11           | 550                 | `h2.mt-4` Das Saison-Highlight — und d          |
| /de/downloads                                 | 0.98 (0.97–0.98)                                                                                                                                      | 918     | 998 (984–1.015)          | 0       | 0.000   | 49       | 1.608           | 1             | 406         | 446         | 0           | 0.000       | 25           | 560                 | `p.mt-4` Infoblätter, Musterbefunde,            |
| /de/contact                                   | 0.98 (0.98–0.98)                                                                                                                                      | 881     | 961 (943–964)            | 0       | 0.000   | 29       | 1.562           | 1             | 408         | 448         | 0           | 0.000       | 11           | 558                 | `p.mt-4` Ein Formular für Beratung, A           |
| /de/consumer/vitamin-d3-spray                 | 0.98 (0.97–0.98)                                                                                                                                      | 869     | 1.012 (1.002–1.084)      | 0       | 0.000   | 20       | 1.625           | 1             | 409         | 509         | 0           | 0.000       | 10           | 638                 | `img.block` PolarisDX Vitamin D3+K2 Subl        |
| /de/consumer/inside-out-duo                   | 0.98 (0.97–0.98)                                                                                                                                      | 868     | 1.044 (1.042–1.063)      | 0       | 0.000   | 18       | 1.648           | 1             | 409         | 489         | 0           | 0.000       | 11           | 677                 | `img.block` PolarisDX Inside-Out Care Du        |
| /en/                                          | 0.98 (0.98–0.98)                                                                                                                                      | 888     | 988 (953–997)            | 0       | 0.000   | 21       | 1.204           | 1             | 415         | 464         | 0           | 0.000       | 18           | 457                 | `img.relative` IglooPro point-of-care reade     |
| /pl/                                          | 0.97 (0.97–0.97)                                                                                                                                      | 965     | 1.065 (1.055–1.076)      | 0       | 0.000   | 26       | 1.653           | 1             | 445         | 525         | 0           | 0.000       | 15           | 659                 | `img.relative` Czytnik point-of-care IglooP     |
| /pl/epigenetics/musterbefund/metabolic-health | 0.95 (0.92–0.95)                                                                                                                                      | 1.065   | 1.191 (1.182–1.593)      | 0       | 0.000   | 33       | 2.168           | 1             | 530         | 570         | 0           | 0.000       | 22           | 786                 | `h1.mt-4` Metabolic Health                      |
| /de/pt25-baseline-gibt-es-nicht (404)         | nicht messbar: Lighthouse bricht Dokumente mit HTTP 404 ab (`ERRORED_DOCUMENT_REQUEST`, 3/3 Läufe) — 404 ist über HTTP-Matrix und Collector abgedeckt |         |                          |         |         |          |                 |               |             |             |             |             |              |                     |                                                 |

Desktop ist in beiden Umgebungen unkritisch (LAB LCP 936–1.191 ms, PREVIEW 445–570 ms, TBT 0, CLS 0,000).

### 6.1 Lighthouse-Breakdown: Unused JS/CSS, Render-Blocking, LCP-Phasen

Unused JS/CSS nach Lighthouse auf **Transferbasis** — deshalb LAB (unkomprimiert) 193–230 KB JS / 68–80 KB CSS,
PREVIEW (gzip) 46–56 KB JS / 12–14 KB CSS. Render-Blocking = von Lighthouse geschaetzte FCP-Ersparnis (einzige
render-blockierende Ressource: `assets/index-*.css`).

| Route                                         | Unused JS KB (LAB mobil) | Unused CSS KB (LAB mobil) | Render-blocking FCP-Ersparnis ms LAB mobil / PREVIEW mobil | LCP-Phasen LAB desktop TTFB / Load Delay / Load / Render Delay ms |
| --------------------------------------------- | ------------------------ | ------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| /de/                                          | 197                      | 74                        | 300 / 0                                                    | 25 / 9 / 16 / 72                                                  |
| /de/diagnostics                               | 219                      | 76                        | 450 / 100                                                  | 22 / 9 / 15 / 81                                                  |
| /de/diagnostics/dental                        | 213                      | 78                        | 300 / 100                                                  | 32 / – / – / 105                                                  |
| /de/igloo-pro                                 | 222                      | 78                        | 300 / 100                                                  | 22 / 10 / 19 / 75                                                 |
| /de/epigenetics                               | 193                      | 73                        | 300 / 0                                                    | 38 / – / – / 140                                                  |
| /de/epigenetics/grundlagen                    | 216                      | 78                        | 450 / 100                                                  | 19 / – / – / 99                                                   |
| /de/epigenetics/musterbefund/metabolic-health | 215                      | 75                        | 450 / 250                                                  | 47 / – / – / 155                                                  |
| /de/articles                                  | 214                      | 79                        | 450 / 100                                                  | 24 / 105 / 13 / 22                                                |
| /de/articles/die-gruene-praxis                | 216                      | 78                        | 300 / 150                                                  | 25 / 142 / 4 / 23                                                 |
| /de/events                                    | 214                      | 79                        | 450 / 50                                                   | 50 / – / – / 204                                                  |
| /de/downloads                                 | 218                      | 80                        | 300 / 100                                                  | 68 / – / – / 154                                                  |
| /de/contact                                   | 195                      | 77                        | 450 / 150                                                  | 33 / – / – / 160                                                  |
| /de/consumer/vitamin-d3-spray                 | 215                      | 77                        | 450 / 100                                                  | 27 / 12 / 38 / 70                                                 |
| /de/consumer/inside-out-duo                   | 217                      | 76                        | 450 / 100                                                  | 25 / 14 / 25 / 74                                                 |
| /en/                                          | 197                      | 74                        | 600 / 0                                                    | 25 / 9 / 22 / 89                                                  |
| /pl/                                          | 197                      | 74                        | 1.050 / 0                                                  | 32 / 8 / 26 / 154                                                 |
| /pl/epigenetics/musterbefund/metabolic-health | 215                      | 75                        | 900 / 700                                                  | 54 / – / – / 153                                                  |

## 7. LCP

- **LCP-Elemente** (Lighthouse und Collector uebereinstimmend): Bild-LCP auf `/de/`, `/en/`, `/pl/` (`Igloo-pro-frontal.webp`, `eager` + `fetchpriority=high`, per React-Float `<link rel=preload as=image fetchPriority=high>` im `<head>`), `/de/igloo-pro`, `/de/diagnostics` (desktop), Consumer desktop (`picture > img` 768w-WebP, `eager/high`), **Artikel** (`green.webp`, **`loading="lazy"`**). Alle anderen Routen haben **Text-LCP** (Hero-Lead `p`/`h1`/`h2`), bei Consumer mobil das `h1`.
- **LCP-Phasen** (§6.1): TTFB LAB 17–74 ms (PREVIEW mobil Einzellauf bis 143 ms), Render Delay 16–204 ms. **Ausreisser Load Delay** nur bei den Artikel-Bildern: **105 ms** (Index, desktop) und **142 ms** (Detail, desktop), 71 ms (Detail, mobil) — Folge von `loading="lazy"` am LCP-Bild (PERF-B04).
- **Collector PREVIEW mobil:** LCP 1.092–1.652 ms kalt; der einzige Fall mit LCP ≫ FCP ist `/de/articles/die-gruene-praxis` (FCP 1.104 → LCP 1.652 ms), wieder das lazy Artikelbild.
- **Kein** LCP-Kandidat wird per JavaScript nachgerendert: alle LCP-Elemente stehen im SSR-HTML.

## 8. CLS

- **Lighthouse (kalt):** 0,000–0,004 auf allen Routen, beide Umgebungen, beide Profile.
- **Collector kalt:** 0–0,0047.
- **Collector warm, LAB mobil (aktueller Code): 0,127–0,292** auf `/de/` (0,178), `/de/igloo-pro` (0,127), `/de/epigenetics` (0,292), `/de/consumer/vitamin-d3-spray` (0,264), `/de/consumer/inside-out-duo` (0,292), `/pl/` (0,190). **PREVIEW (AP23-Build) warm: 0,000–0,004.** Desktop: 0 in beiden.
- **Reproduziert** mit `scripts/perf/cls-warm-repro.mjs`: `/de/` **3/3** (0,175 / 0,208 / 0,208), `/de/epigenetics` **1/3** (0,292); PREVIEW **0/6**; alle Kaltlaeufe 0.
  Shift-Quelle ist jeweils ein **dekorativer Hintergrundkreis** — `HeroSection.tsx:25` (`-right-24 bottom-0 h-80 w-80 … blur-3xl`, previousRect y 121/h 320 → currentRect y 681/h 142) bzw. `EpigeneticsPage.tsx:229` (`-bottom-32 left-1/4 …`). Der Kreis haengt am unteren Rand seiner `overflow-hidden`-Section — **die Section selbst aendert kurz nach dem ersten Paint ihre Hoehe**.
- **Ursache NICHT bestimmt.** Der Unterschied LAB ↔ PREVIEW umfasst den gesamten AP24-Diff (u. a. Kopfzeilen-Schleier, Fokusnetz) und alles andere seit dem AP23-Image. PT25.1 stellt **keine** Vermutung als Ursache hin: PT25.3 bisektiert zuerst (PERF-B05).

## 9. INP / Field Status

```text
FIELD_METRICS = NOT_AVAILABLE
INP           = NOT_MEASURED (kein Field-Sample; Lab kann INP nicht messen)
```

Verfuegbare Lab-Surrogate, **ausdruecklich kein INP**:

| Surrogat                                                                            | LAB                                                                                                                                                         | PREVIEW                                |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Lighthouse TBT mobil (simuliert, Median je Route)                                   | 0–10 ms                                                                                                                                                     | 0–43 ms                                |
| Lighthouse TBT desktop                                                              | 0 ms                                                                                                                                                        | 0 ms                                   |
| Long Tasks Collector mobil kalt (n / Σ / max)                                       | bis 7 / 1.131 / 712 ms (Musterbefund)                                                                                                                       | bis 6 / 898 / 296 ms (Musterbefund pl) |
| Event-Timing eines Klicks (Header „Diagnostik — Untermenü", desktop, 1 Interaktion) | 48 ms                                                                                                                                                       | 40 ms                                  |
| Mobiles Klick-Surrogat                                                              | **nicht erhoben** — der Collector hat im mobilen Header kein sichtbares `button[aria-expanded]` getroffen; bewusst nicht nachgebessert und nicht geschaetzt | —                                      |

**Interaktionsluecke statt INP:** Auf mobil liegt zwischen sichtbarem Inhalt und Hydration-Ende eine messbare Spanne, in der
Klicks nicht von React bedient werden — PREVIEW mobil FCP 1.092–1.348 ms vs. Hydration-Ende 3.425–4.180 ms (§11). Das ist
ein belastbares Lab-Signal fuer Interaktionsbereitschaft, **kein** INP-Wert.

## 10. TTFB und SSR

- **Server-TTFB (HTTP-Matrix, §4.1):** LAB kalt 7–21 ms, warm-Median 6–20 ms; PREVIEW kalt 7–93 ms (erster Abruf `/de/` 93 ms), warm-Median 7–22 ms. Lighthouse-`server-response-time` 9–49 ms. **Kein TTFB-Engpass.**
- Groesste SSR-Dokumente: Musterbefund **210.728 B** (de) / 205.718 B (pl) roh, 26,7 KB gzip; Epigenetics Hub 151.481 B; Downloads 103.407 B; Home 83.835 B.
- Jede Route liefert 3 `modulepreload` (vendor-react, vendor-seo, vendor-i18n), 1 Stylesheet, 1 Font-Preload (`inter-latin`) und — bei Bild-LCP — die React-Float-`preload as=image`-Hinweise (Home: Logo + Igloo mit `fetchPriority=high`). **Kein** Route-Chunk wird vorgeladen; **kein** `preconnect` (keine Fremd-Origins vor Consent).
- SSR bleibt vollstaendig: alle 18 Routen inkl. 404 mit gefuelltem `#root`, echte 404 (Status aus `server.ts` ueber `isKnownCanonicalPath` + Soft-404-Marker).
- `server.ts` komprimiert nicht; HTML `Cache-Control: no-store, no-cache, must-revalidate`; `/assets` 1 Jahr `immutable`; nicht gehashte Dateien 1 h.

## 11. Hydration

Ablauf (`src/entry-client.tsx`): `import '@fontsource-variable/inter'` + `index.css` → `i18nReady` (i18next-http-backend laedt **alle** 15 produktiven Namespaces fuer die URL-Sprache **und** fuer die Fallback-Sprache `en`) → erst dann `hydrateRoot(<StrictMode><HelmetProvider><BrowserRouter><RootErrorBoundary><Suspense>…)`.

Messung (Collector; Start = Container von `hydrateRoot` markiert, Ende = Props-Schluessel am `<footer>`):

| Umgebung / Profil (kalt) | Locale-JSON fertig | Hydration Start → Ende       | FCP            |
| ------------------------ | ------------------ | ---------------------------- | -------------- |
| LAB mobil, de-Routen     | 7.814–9.195 ms     | 7.824–9.223 → 8.007–9.409 ms | 2.292–3.496 ms |
| LAB mobil, `/en/`        | 6.350 ms           | 6.343 → 6.712 ms             | 2.716 ms       |
| PREVIEW mobil, de-Routen | 3.225–3.941 ms     | 3.233–3.949 → 3.425–4.180 ms | 1.092–1.348 ms |
| PREVIEW mobil, `/en/`    | 2.728 ms           | 2.742 → 3.087 ms             | 1.340 ms       |
| LAB/PREVIEW desktop      | 154–369 ms         | 161–365 → 179–429 ms         | 96–276 ms      |

- **Hydration startet in jeder Messung wenige Millisekunden nach der letzten Locale-Datei** — der i18n-Wasserfall ist der Taktgeber, nicht die JS-Ausfuehrung (Hydration selbst: 150–380 ms mobil).
- **Hydration-Fehler: 0** (Konsole, 72 Navigationen je Umgebung, 144 gesamt). `observedWithin30s` in allen Zeilen `true`.
- Suspense-/lazy-Grenzen: `App.tsx` laedt alle Seiten per `lazy()` mit `<Suspense fallback={null}>` — **ausser** `HomePage` und den Consumer-Seiten `SprayPage`, `MaskPage`, `DuoPage` (statisch importiert). Aeussere Grenze in `entry-client.tsx` mit `min-h-screen`-Platzhalter.
- Client-only/nach-Hydration-Widgets: `CookieBanner`, `MobileCallButton`, `SearchModal`, `RouteAnnouncer`, `GtmPageview` (feuert erst nach Consent), `Reveal` (Animation erst nach Hydration, `prefers-reduced-motion` respektiert).

## 12. Chunk Map

Vite-Chunking-Regel (`vite.config.ts`, nur Client): `manualChunks: { 'vendor-react': ['react','react-dom','react-router-dom'], 'vendor-i18n': ['i18next','react-i18next','i18next-http-backend'], 'vendor-seo': ['react-helmet-async'] }`, `chunkSizeWarningLimit: 600`, `sourcemap: false`.

| Chunk                              | raw KB    | gzip KB   | brotli KB | Inhalt                                                  |
| ---------------------------------- | --------- | --------- | --------- | ------------------------------------------------------- |
| `assets/index-ConcUUwH.js` (Entry) | 404,8     | 122,5     | 103,6     | App-Shell, **react-dom-client**, Home, Consumer-Seiten  |
| `assets/vendor-i18n-*.js`          | 65,6      | 21,8      | 19,7      | i18next, react-i18next, http-backend                    |
| `assets/vendor-react-*.js`         | 43,6      | 15,7      | 14,1      | react, react-router(-dom) — **ohne** `react-dom/client` |
| `assets/vendor-seo-*.js`           | 14,0      | 5,4       | 4,8       | react-helmet-async                                      |
| **Initial JS gesamt (4 Dateien)**  | **528,1** | **165,5** | **142,3** | statischer Abschluss des Entry                          |
| 65 dynamische Chunks               | 1.950,9   | 596,8     | –         | Seiten, Inhalte, Befunde                                |

Groesste dynamische Chunks: `metabolic-health` 323,2 / 93,1 · `healthy-sport` 238,0 / 67,7 · `healthy-aging` 187,8 / 52,8 · `biologische-altersuhr` 175,4 / 52,8 · `stress-monitor` 174,8 / 46,6 · `telomer-analyse` 149,5 / 45,4 · `die-gruene-praxis` 66,7 / 27,2 · `der-unsichtbare-patient` 56,6 / 23,9 · `precision-in-point-of-care…` 53,1 / 20,4 · `the-ecosystem-of-rapid-tests…` 46,9 / 18,6 · `die-5-minuten-diagnose` 45,8 / 18,9 · `MusterbefundPage` 44,6 / 12,0 · `die-performance-formel…` 37,4 / 14,7 · `EpigeneticsPage` 34,5 / 8,2 (KB raw / gzip).

### 12.1 Groesste Module im Entry-Chunk (Sourcemap-Attribution, 401,3 von 404,9 KB zugeordnet)

| Modul / Gruppe                                                                                                                       | KB raw          | Anteil |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------------- | ------ |
| `react-dom/cjs/react-dom-client.production.js`                                                                                       | 172,8           | 42,7 % |
| `src/pages/consumer/*` (shell 13,6 · OrderForm 8,5 · SprayPage 7,1 · MaskPage 6,2 · DuoPage 6,1 · PriceBadge 5,3 · OrderModal 2,6 …) | 49,7            | 12,3 % |
| `src/components/ui/*` (CookieBanner 6,7 · FlagIcon 3,0 · SearchModal 2,9 · LanguageSwitcher 2,8 …)                                   | 27,5            | 6,8 %  |
| `src/components/sections/*` (Home-Sektionen, RoiCalculator 8,1)                                                                      | 26,6            | 6,6 %  |
| `tailwind-merge`                                                                                                                     | 24,7            | 6,1 %  |
| `src/components/layout/*` (Header 12,0 · Footer 4,6)                                                                                 | 17,9            | 4,4 %  |
| `lucide-react` (Icons)                                                                                                               | 12,3            | 3,0 %  |
| `src/components/seo/*` · `src/App.tsx` · `src/routing/routeRegistry.ts`                                                              | 9,9 · 7,4 · 5,6 |        |
| `src/assets/Testimonials/Dr. Kristian Grimm.webp` (als data-URI inlined)                                                             | 5,0             | 1,2 %  |

Befund: `manualChunks` nennt `react-dom`, die App importiert aber `react-dom/client` — der **groesste Einzelblock landet deshalb im Entry** statt im langfristig cachebaren Vendor-Chunk (PERF-B02).

## 13. Initial JS / Route JS

Route-JS = Seitenmodul + dessen **nicht initiale** statische Imports (ohne weitere dynamische Imports).

| Route                              | Route-JS raw KB                                                          | gzip KB   | brotli KB | Chunks |
| ---------------------------------- | ------------------------------------------------------------------------ | --------- | --------- | ------ |
| Home, Consumer D3, Consumer Duo    | **0 zusaetzlich — im Entry-Chunk** (laden damit auf **jeder** Route mit) |           |           |        |
| Diagnostics Hub                    | 19,4                                                                     | 5,4       | 4,7       | 3      |
| Service Detail                     | 24,5                                                                     | 8,5       | 7,6       | 6      |
| IglooPro                           | 16,7                                                                     | 4,8       | 4,3       | 3      |
| Epigenetics Hub                    | 95,2                                                                     | 27,9      | 24,4      | 18     |
| Epigenetics Vertiefung             | 28,5                                                                     | 10,5      | 9,4       | 7      |
| **Musterbefund metabolic-health**  | **397,5**                                                                | **115,9** | **96,2**  | 9      |
| Articles Index                     | 12,3                                                                     | 5,7       | 5,1       | 7      |
| Article Detail (die-gruene-praxis) | 84,2                                                                     | 33,9      | 30,0      | 9      |
| Events                             | 16,9                                                                     | 6,1       | 5,5       | 4      |
| Downloads                          | 41,9                                                                     | 12,3      | 10,6      | 9      |
| Contact                            | 29,5                                                                     | 10,7      | 9,4       | 9      |
| 404                                | 3,5                                                                      | 1,7       | 1,5       | 3      |

Musterbefund-Route = **Initial 165,5 + Route 115,9 = 281,4 KB gzip JS**; das ist das schwerste Kernrouten-Paket. Ursache: jedes Routenmodul in `src/pages/musterbefund/` importiert **alle zehn** `src/content/befunde/<slug>.<locale>.json` (je 21–33 KB roh), obwohl nur eine Sprache gerendert wird. Die Artikel-Routenmodule importieren je **eine** JSON-Datei, die **alle Locales** enthaelt — gleiches Muster, kleiner (37–67 KB roh). (PERF-B03, `D-29` bestaetigt: Splitting je Slug wirkt, Splitting je Locale fehlt.)

## 14. CSS

- Ein Stylesheet fuer alle Routen: `assets/index-CAt_BnsO.css` **92,1 KB raw / 16,5 KB gzip / 13,2 KB brotli**, render-blockierend (einzige render-blockierende Ressource).
- Lighthouse „unused CSS" je Route: LAB 68–80 KB (Transferbasis unkomprimiert), PREVIEW 12–14 KB (gzip) — also rund **80 %** der Regeln pro Route ungenutzt.
- Enthalten: Tailwind-JIT-Ausgabe, 7 `@font-face` (Inter Variable) + `Inter Fallback` (`local("Arial")`, `size-adjust 107.12%`, `ascent 90.2%`, `descent 22.48%`), AP24-Fokus-Sicherheitsnetz (`:where(…):focus-visible`), `prefers-reduced-motion`-Block.
- Kein Critical-CSS, kein Async-CSS. FOUC wurde nicht beobachtet (CSS blockiert per Design).

## 15. Images

### 15.1 Emittiertes Inventar (Build)

42 Dateien, **2.333,8 KB** gesamt (KB = 1.024 Bytes, wie im ganzen Vertrag): WebP 1.173,1 KB · JPEG 5 Dateien 1.160,7 KB (4 Consumer-Originale `*.jpeg` 1.067,7 KB + `VITAMIND_D3_SPRAY.jpg` 93,0 KB) · dazu 5 Testimonial-Portraets mit Leerzeichen im Dateinamen (zusammen ~30 KB). Groesste: `spray-hero-12pack-office.jpeg` 325,5 KB · `duo-hero-products-together.jpeg` 271,7 KB · `spray-still-life.jpeg` 271,1 KB · `mask-hero-botanical.jpeg` 199,4 KB · `spray-hero-12pack-office-1122w.webp` 118,9 KB. Die Consumer-JPEGs sind `<picture>`-Fallback (AP21 PT21.7) und wurden in **keiner** Chromium-Messung geladen.
`public/` (unverarbeitet): `og-image.jpg` 82,1 KB, `og-vitd3-spray.jpg` 77,1 KB, `og-epigenetics.jpg` 76,6 KB (**OG/Social, kein Renderpfad**), `favicon.ico` 56,0 KB, `favicon.png` 54,5 KB, `maskable-512.png` 34,5 KB, `favicon-192.png` 18,6 KB.

### 15.2 Laufzeit (Collector, kalt)

- `width`/`height` an **allen** `<img>` aller Matrix-Routen gesetzt (`noWH = 0`).
- Bild-Transfer je Route: 0–70 KB mobil (Consumer D3 70, Duo 49, Artikel-Detail 39), Articles Index **150 KB mobil / 181 KB desktop**.
- `srcset`/`<picture>` nur in `src/pages/consumer/shell.tsx` (`ConsumerPicture`) und `EpigeneticsPanels.tsx`. Alle anderen Bilder: eine Datei fuer alle Viewports.
- **Uebergroesse** (natuerliche Breite / (gerenderte Breite × DPR)): Articles Index desktop `green.webp` **3,19×**, `homeclinic.webp` 2,72×; Artikel-Detail `green.webp` 1,8×; Igloo auf Diagnostics desktop 1,67×; Logo `polaris_white.webp` 1,69–2,95× (7 KB).
- **Lazy im sichtbaren Bereich:** Artikel-Detail (mobil + desktop, jeweils das LCP-Bild) und Articles Index (desktop: 3 Kartenbilder inklusive LCP-Bild; mobil: 1 Kartenbild, LCP dort das `h2`).
- **Eager unterhalb des Falzes (mobil 412×823):** `Igloo-pro-frontal.webp` auf `/de/diagnostics` (`eager` + `fetchpriority=high`), Consumer-Hero `spray-hero-12pack-office-768w.webp` / `duo-hero-products-together-768w.webp` (`ConsumerPicture priority` → `eager` + `high` + `decoding=sync`), Footer-Logo (ohne `loading`).

## 16. LCP Media

| Route                            | LCP-Medium                                | Attribute                                          | Preload                                           | Bewertung                                            |
| -------------------------------- | ----------------------------------------- | -------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| `/de/`, `/en/`, `/pl/`           | `Igloo-pro-frontal.webp` 18,1 KB, 650×650 | `eager`, `fetchpriority=high`, `decoding=async`    | React-Float `preload as=image fetchPriority=high` | korrekt                                              |
| `/de/igloo-pro`                  | `Igloo-pro-frontal.webp`                  | `eager`, `high` (`IglooProHero.tsx`)               | Float-Preload                                     | korrekt                                              |
| `/de/diagnostics` desktop        | `Igloo-pro-frontal.webp`                  | `eager`, `high` (`DiagnosticsHero.tsx`)            | Float-Preload                                     | desktop korrekt, **mobil unter dem Falz** (Text-LCP) |
| Consumer D3/Duo desktop          | `*-768w.webp` in `<picture>`              | `eager`, `high`, `decoding=sync`                   | keiner                                            | desktop korrekt, **mobil unter dem Falz** (h1-LCP)   |
| `/de/articles/die-gruene-praxis` | `green.webp` 38,5 KB                      | **`loading="lazy"`** (`ArticlePage.tsx:366`)       | keiner                                            | **verletzt „Hero/LCP nicht lazy"**                   |
| `/de/articles` desktop           | `green.webp` (Karte)                      | **`loading="lazy"`** (`ArticlesIndexPage.tsx:145`) | keiner                                            | **verletzt „Hero/LCP nicht lazy"**                   |

## 17. Fonts

- Emittiert 7 × Inter Variable (`woff2-variations`, `font-weight 100 900`, **alle `font-display: swap`**): latin **47,1 KB** · latin-ext **83,1 KB** · cyrillic-ext 25,4 KB · greek 18,6 KB · cyrillic 18,3 KB · greek-ext 11,0 KB · vietnamese 10,0 KB = **213,4 KB**. Alle 7 `@font-face`-URLs zeigen auf emittierte Dateien (Bundle-Report prueft das).
- Preload: **nur** `inter-latin` (`server.ts` `getFontPreloadTag()`, `crossorigin`), unabhaengig von der Sprache.
- Tatsaechlich geladen (Collector): de/en-Routen **1 Datei** (latin, 47 KB); `/pl/` **2** (+ latin-ext 83 KB, **nicht vorgeladen**); Musterbefund de **2** (+ greek 18,6 KB — griechische Glyphen im Befundinhalt); Musterbefund pl **3** (latin + latin-ext + greek, 102 KB ueber CSS).
- Lighthouse PREVIEW mobil Font-Transfer: `/de/` 47 KB, **`/pl/` 131 KB**; Render-Blocking-Schaetzung `/pl/` LAB 1.050 ms, Musterbefund pl PREVIEW 700 ms (hoechste Werte der Matrix).
- Fallback-Metriken vorhanden (`Inter Fallback`), CLS durch Font-Swap in keiner Messung sichtbar (kalt ≤ 0,005).

## 18. Request Waterfalls

Kalte Ladung `/de/`, Lighthouse PREVIEW mobil, **567 KB / 44 Requests**:

| Stufe                                | Requests                                                                  | Transfer                                        |
| ------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------- |
| Dokument                             | 1                                                                         | 14,7 KB gzip                                    |
| aus dem HTML entdeckt, parallel      | Entry-JS, 3 × modulepreload, CSS, Font-Preload latin, Igloo-Preload, Logo | JS 166 KB · CSS 17 KB · Font 47 KB · Bild 25 KB |
| **nach Ausfuehrung des Entry: i18n** | **30 × `/locales/{de,en}/<ns>.json`** (15 Namespaces × 2 Sprachen)        | **220 KB gzip** (roh 359 + 339 KB)              |
| danach                               | `hydrateRoot`; Route-Chunks (bei lazy Routen)                             | Route-JS §13                                    |
| Browser-Nebenlast                    | `favicon.ico` 56 KB, `favicon-192.png` 19 KB, `site.webmanifest`          | „Other" 76 KB                                   |

- **Die Locale-JSONs sind groesser als das gesamte initiale JS** (220 vs. 166 KB gzip) und stehen zwingend **vor** der Hydration. `/en/` laedt nur 15 Dateien (105 KB) — Home-Transfer 452 statt 567 KB, Hydration-Start PREVIEW mobil 2.742 statt 3.444 ms.
- Die groessten Namespaces: `services` 130 KB (de) / 123 KB (en) roh, `epigenetics` 44/43, `legal` 37/35, `specialty` 34/34, `consumer` 30/26 — `legal` und `consumer` werden auch auf `/de/` geladen.
- Lazy-Routen: der Route-Chunk wird erst nach Ausfuehrung des Entry angefordert (kein `modulepreload` fuer Seitenchunks). Die zeitliche Lage der Route-Chunks relativ zur i18n-Stufe wurde in PT25.1 **nicht einzeln ausgewertet** (Rohdaten: `requestList` in den Lighthouse-Summaries, `requests` im Collector) — PT25.2 wertet das vor jeder Aenderung an Splitting oder i18n aus.
- LAB unterscheidet sich nur in den Bytes (identity statt gzip): 1.558–2.168 KB.

## 19. AP23 Technical Metrics Boundary

| Punkt               | Zustand (verifiziert)                                                                                                                                                                                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Collector           | `src/lib/monitoring/web-vitals.ts` (`initWebVitals`, native `PerformanceObserver` fuer TTFB/FCP/LCP/CLS/„INP-Proxy") — **nirgends aufgerufen**                                                                                                                                           |
| Sink                | `src/lib/monitoring/report.ts` `setMonitoringSink` — **nicht registriert**, Standard-Sink tut nichts                                                                                                                                                                                     |
| Policy              | `src/lib/monitoring/policy.ts` — `VITE_TELEMETRY_SCOPE=NONE` → `NO_TRANSPORT_CONFIGURED`; Freigabe erst mit `purposeDocumented`, `processorAgreed`, `retentionDefined`, `privacyNoticeUpdated`                                                                                           |
| Trennung            | `separation.test.ts` verbietet `initWebVitals(`/`setMonitoringSink(` in Produktmodulen und jede Kopplung an `dataLayer`/GTM                                                                                                                                                              |
| Baseline-Verhalten  | PT25.1 hat **keinen** Transport aktiviert, keinen Sink gesetzt, nichts an GTM/GA4 geschickt. Provider-Requests vor Consent: **0** (136 auswertbare Lighthouse-Laeufe — 144 inkl. 8 Abbrueche auf dem 404-Pfad —, 144 Collector-Navigationen)                                             |
| Uebergabe an PT25.5 | Falls ein technischer Transport je freigegeben wird: der vorhandene Collector summiert CLS **ohne Session-Windows** und meldet als „INP" die **maximale Event-Dauer** — beides weicht von der CWV-Definition ab und darf so nicht als CWV berichtet werden. PT25.1 aendert das **nicht** |

## 20. AP24 Accessibility Handoff

Aus `ACCESSIBILITY-CONTRACT.md` §12.1, jetzt mit Messbezug:

1. **Kopfzeilen-Schleier** (`bg-brand-deep/75 backdrop-blur-sm` im unverscrollten Zustand): Lighthouse TBT 0–43 ms, keine Long Tasks > 50 ms, die dem Header zuzuordnen waeren. Compositing-Kosten sind damit **nicht isoliert gemessen** — ohne Signal kein Befund. Regel bleibt: falls teuer, Deckkraft erhoehen und Filter weglassen, **nicht** den Schleier entfernen.
2. **Fokus-Sicherheitsnetz** in `@layer base` ist Teil der 92,1 KB CSS; Kosten nicht separat messbar, bleibt.
3. **`prefers-reduced-motion`** unveraendert verdrahtet (`Reveal`, CSS-Block) — PT25.x darf Animationen reduzieren, **nicht** diesen Block.
4. **Neu aus PT25.1:** Der Warm-Navigations-CLS (PERF-B05) tritt nur im Build **mit** AP24 auf. Das beweist **keine** AP24-Ursache (das PREVIEW-Image unterscheidet sich auch sonst), macht den AP24-Diff aber zum ersten Bisektionskandidaten. Jede Korrektur muss die AP24-Vertraege erhalten (der Schleier sichert den AA-Kontrast der Navigation — ohne ihn gemessen 1,05:1 —, Fokus, Reduced Motion).
5. `D-20` (horizontaler Ueberlauf bei 1024 px) wurde in PT25.1 nicht gemessen und bleibt offen.

## 21. Priorisierte Bottlenecks

Klassen: **P0** Performance-/Funktionsblocker · **P1** klarer CWV-/Payload-Impact auf Kernpfade · **P2** messbare Verbesserung mit begrenztem Launch-Impact · **P3** ohne Launch-Relevanz.

**P0 — keiner.** Belegt: 18/18 Routen HTTP-korrekt in beiden Umgebungen, SSR-Root ueberall gefuellt, 0 Hydration-Fehler, 0 Provider-Requests vor Consent, PREVIEW mobil LCP ≤ 2.933 ms und CLS ≤ 0,004 (Lighthouse, kalt).

| ID           | Prio   | Befund (Evidenz)                                                                                                                                                                                                                                                 | Wirkung                                                                                                          | Owner                                              |
| ------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **PERF-B01** | **P1** | i18n-Wasserfall vor Hydration: 15 Namespaces × (URL-Sprache + Fallback `en`) = **30 Requests, 220 KB gzip** auf jeder de/pl-Route (§18); Hydration startet erst danach (PREVIEW mobil 3,2–3,9 s, LAB mobil 7,8–9,2 s; `/en/` mit 15 Dateien 0,7 s frueher)       | groesster Einzelposten im Transfer, verzoegert Interaktionsbereitschaft auf allen Kernrouten                     | PT25.2                                             |
| **PERF-B02** | **P1** | Entry-Chunk 404,8 KB raw / 122,5 gzip: `react-dom-client` 172,8 KB faellt an `manualChunks` vorbei; Consumer-Seiten (~50 KB) + Home statisch in `App.tsx` → auf jeder Route; Lighthouse unused JS 46–56 KB gzip je Route                                         | Initial-JS 165,5 KB gzip fuer jede Route, schlechteres Caching bei jedem App-Deploy                              | PT25.2                                             |
| **PERF-B03** | **P1** | Musterbefund-Routenchunks enthalten alle 10 Locales (`metabolic-health` 323,2 KB raw / 93,1 gzip; Route 115,9 KB gzip); Long Tasks LAB mobil bis 7 / 1.131 / 712 ms; Transfer PREVIEW mobil 699 KB vs. 557 KB Vertiefung. Artikel gleiches Muster (37–67 KB raw) | schwerste Kernroute, „keine 322-KB-artige globale Datenlast" (AP25 §10)                                          | PT25.2                                             |
| **PERF-B04** | **P1** | LCP-Bild `loading="lazy"`: Artikel-Detail (mobil+desktop), Articles Index (desktop); Load Delay 71–142 ms, Collector PREVIEW mobil FCP 1.104 → LCP 1.652 ms                                                                                                      | verletzt harte Regel „Hero/LCP nicht lazy"                                                                       | PT25.3                                             |
| **PERF-B05** | **P1** | Warm-Navigations-CLS nur im aktuellen Build, mobil: `/de/` 3/3 reproduziert (0,175–0,208), weitere Routen bis 0,292; Quelle Hoehenaenderung der Hero-Section (`HeroSection.tsx`, `EpigeneticsPage.tsx`); PREVIEW 0/6; Ursache offen                              | CLS > 0,1 auf der Homepage im Lab; muss vor jeder Korrektur bisektiert werden                                    | PT25.3                                             |
| **PERF-B06** | **P2** | Node-Origin ohne Kompression (LAB 3× Transfer, Lighthouse mobil LCP ~5 s statt ~2,2 s); Host-nginx nur gzip, kein brotli (Initial-JS 165,5 → 142,3 KB, Locale-JSON ≈ 220 → 181 KB)                                                                               | nur relevant, wenn der Origin ohne Proxy erreichbar waere (DEP-41 verneint das); brotli ist Betriebsentscheidung | **AP28** (Host-nginx), kein AP25-Write             |
| **PERF-B07** | **P2** | Ein render-blockierendes CSS 92,1 KB raw / 16,5 gzip, ~80 % pro Route ungenutzt; Render-Blocking-Schaetzung PREVIEW mobil 0–250 ms (de), 700 ms (pl-Musterbefund)                                                                                                | FCP auf Mobil                                                                                                    | PT25.4                                             |
| **PERF-B08** | **P2** | Lange Locales laden latin-ext (83,1 KB) ohne Preload; Musterbefund laedt greek (18,6 KB); Font-Transfer `/pl/` 131 KB vs. `/de/` 47 KB                                                                                                                           | Swap-Phase/Render-Blocking fuer pl/cs/…; kein CLS gemessen                                                       | PT25.4                                             |
| **PERF-B09** | **P2** | Mobil unter dem Falz mit `eager`+`fetchpriority=high`: Igloo auf Diagnostics Hub, Consumer-Hero-Bilder (`decoding=sync`), waehrend LCP dort Text ist                                                                                                             | Prioritaetskonkurrenz mit CSS/JS auf Mobil                                                                       | PT25.3                                             |
| **PERF-B10** | **P2** | Uebergrosse Bilder ohne `srcset`: Articles Index desktop 3,19× / 2,72×, Artikel 1,8×, Igloo 1,67×; Articles Index 150–181 KB Bildtransfer                                                                                                                        | Bytes auf Articles Index/Detail                                                                                  | PT25.3                                             |
| **PERF-B11** | P3     | Logo `polaris_white.webp` 1,69–2,95× uebergross (7 KB); Footer-Logo ohne `loading`                                                                                                                                                                               | vernachlaessigbar                                                                                                | PT25.3 (optional)                                  |
| **PERF-B12** | P3     | `favicon.ico` 56 KB + `favicon-192.png` 19 KB auf jeder Kaltladung                                                                                                                                                                                               | 76 KB Nebenlast, nicht render-relevant                                                                           | PT25.5 entscheidet (Budget)                        |
| **PERF-B13** | P3     | `tailwind-merge` 24,7 KB im Entry (`src/lib/utils.ts`, 15 Importeure); Testimonial-Bild 5 KB als data-URI im Entry                                                                                                                                               | kleiner Initial-JS-Anteil                                                                                        | PT25.2 nur bei ohnehin beruehrtem Pfad             |
| **PERF-B14** | P3     | Consumer-JPEG-Originale 1.067,7 KB emittiert, nur `<picture>`-Fallback                                                                                                                                                                                           | keine Laufzeitkosten in Chromium                                                                                 | keine Aktion                                       |
| **PERF-B15** | P3     | Header-Schleier `backdrop-filter` (AP24): kein TBT-/Long-Task-Signal                                                                                                                                                                                             | unbelegt                                                                                                         | PT25.4 misst per Trace, bevor etwas geaendert wird |

## 22. Drift Signals

1. **PREVIEW ≠ aktueller Code:** `polaris-preview-frontend:ap23-preview-20260911` enthaelt AP24 nicht (Entry `index-B7KJqexA.js` vs. LAB `index-ConcUUwH.js`). Jeder Vorher/Nachher-Vergleich auf PREVIEW braucht zuerst ein Preview-Image vom selben Stand.
2. **`DEPLOYMENT-CONTRACT.md` Zeile „Preview"** beschreibt einen detachten Host-Prozess (`npx tsx server.ts` auf `:9100`); beobachtet laufen `polaris-preview-frontend-1` und `polaris-preview-ap23-smoke` als Container. Nicht AP25-Scope — Hinweis an AP28.
3. **Node-Versionen:** Projektlaufzeit Node 20.19.6, Lighthouse 13.4.1 verlangt ≥ 22.19 → Lighthouse laeuft mit separatem Node 22. Fuer CI (PT25.5) festhalten.
4. `nginx.conf` im Repository (gzip ab 10 KB) ist Altlast (`DD-10`) und **nicht** die aktive Host-Konfiguration; PREVIEW-Header zeigen gzip auch fuer 14,7-KB-HTML.
5. `baseline-browser-mapping` meldet veraltete Daten (eslint-Lauf) — nur Warnung.
6. Lighthouse kann Dokumente mit HTTP 404 nicht messen (`ERRORED_DOCUMENT_REQUEST`) — die 404-Route ist deshalb nur im Collector und in der HTTP-Matrix.

## 23. Write Sets fuer PT25.2 / PT25.3 / PT25.4

Serielle Reihenfolge. Dateien, die in zwei Sets stehen, gehoeren dem **frueheren** PT; der spaetere PT beruehrt sie nur in der genannten Hinsicht.
In jedem Set zusaetzlich: `building-docs/PERFORMANCE-CONTRACT.md`, `building-docs/state/AP-STATE.md`, eigene Tests `e2e/pt25.N.config.ts` + `e2e/pt25.N.spec.ts`, bei Bedarf `scripts/perf/*` (Messwerkzeug).

### 23.1 PT25.2 — Rendering, SSR, Hydration (PERF-B01, B02, B03, optional B13)

| Datei                                                                                                                                                                                                                                                                                                                                                                | Zweck                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/i18n.client.ts`                                                                                                                                                                                                                                                                                                                                                 | Namespaces/Fallback-Laden vor Hydration (B01)                                                                     |
| `src/i18n.ts`                                                                                                                                                                                                                                                                                                                                                        | Namespace-/Fallback-Konfiguration (B01)                                                                           |
| `src/i18n.server.ts`                                                                                                                                                                                                                                                                                                                                                 | nur falls SSR die benoetigten Ressourcen ins HTML uebergibt (B01)                                                 |
| `src/entry-client.tsx`                                                                                                                                                                                                                                                                                                                                               | Hydration-Reihenfolge (B01)                                                                                       |
| `src/entry-server.tsx`                                                                                                                                                                                                                                                                                                                                               | nur fuer Ressourcen-Uebergabe an den Client (B01)                                                                 |
| `server.ts`                                                                                                                                                                                                                                                                                                                                                          | nur Template-Injektion der Hydration-Daten; **keine** Kompression ohne AP28-Entscheid, Font-Preload bleibt PT25.4 |
| `vite.config.ts`                                                                                                                                                                                                                                                                                                                                                     | `manualChunks` (`react-dom/client`) (B02)                                                                         |
| `src/App.tsx`                                                                                                                                                                                                                                                                                                                                                        | statische Imports Consumer/Home (B02)                                                                             |
| `src/pages/musterbefund/` `biologische-altersuhr.tsx`, `healthy-aging.tsx`, `healthy-sport.tsx`, `metabolic-health.tsx`, `stress-monitor.tsx`, `telomer-analyse.tsx`                                                                                                                                                                                                 | Locale-genaues Laden der Befundinhalte (B03)                                                                      |
| `src/pages/MusterbefundPage.tsx`, `src/content/befunde/model.ts`                                                                                                                                                                                                                                                                                                     | Schnittstelle fuer das Laden (B03)                                                                                |
| `src/pages/articles/` `createArticleRoute.tsx`, `der-unsichtbare-patient.tsx`, `die-5-minuten-diagnose.tsx`, `die-gruene-praxis.tsx`, `die-performance-formel-effizienz-in-der-poc-diagnostik.tsx`, `precision-in-point-of-care-the-key-to-patient-safety.tsx`, `the-ecosystem-of-rapid-tests-why-compatibility-creates-safety.tsx`, `src/content/articles/model.ts` | gleiches Muster fuer Artikel (B03)                                                                                |
| `src/lib/utils.ts`                                                                                                                                                                                                                                                                                                                                                   | nur falls B13 im selben Zug guenstig ist                                                                          |

Nicht anfassen: Consent (`CookieBanner`, `googleConsent`, `trackingProvider`), `src/lib/monitoring/**`, 404-/Error-Boundaries (`src/routing/*ErrorBoundary.tsx`) ausser Tests belegen, dass sie unveraendert funktionieren.

### 23.2 PT25.3 — Bilder, LCP, CLS (PERF-B04, B05, B09, B10, optional B11)

| Datei                                                            | Zweck                                                                                                                  |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `src/pages/ArticlePage.tsx`                                      | LCP-Bild nicht lazy, `srcset`/`sizes` (B04, B10)                                                                       |
| `src/pages/ArticlesIndexPage.tsx`                                | erste sichtbare Kartenbilder nicht lazy, Groessen (B04, B10)                                                           |
| `src/assets/articleImages.ts`, `scripts/optimize-images.mjs`     | responsive Varianten fuer Artikelbilder (B10)                                                                          |
| `src/components/sections/HeroSection.tsx`                        | Warm-CLS der Hero-Section, **nach** Bisektion (B05)                                                                    |
| `src/pages/EpigeneticsPage.tsx`                                  | nur die Hero-Section mit dem Shift (B05)                                                                               |
| `src/components/layout/Header.tsx`                               | nur falls die Bisektion den Schleier/Header als Ursache belegt (B05) bzw. Logo-Dimension (B11); AP24-Vertraege bleiben |
| `src/components/sections/DiagnosticsHero.tsx`                    | Mobil-Prioritaet Igloo (B09)                                                                                           |
| `src/pages/consumer/shell.tsx`, `src/content/consumer/images.ts` | `ConsumerPicture`-Prioritaet mobil/desktop (B09)                                                                       |
| `src/components/layout/Footer.tsx`                               | Footer-Logo `loading` (B11, optional)                                                                                  |
| `src/components/ui/BlogCard.tsx`                                 | nur verifizieren (auf Home unter dem Falz korrekt lazy)                                                                |

### 23.3 PT25.4 — Fonts, CSS (PERF-B07, B08, B15)

| Datei                                                         | Zweck                                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `server.ts` — **nur** `getFontPreloadTag()`                   | sprachabhaengiger Subset-Preload (B08)                                                            |
| `src/entry-client.tsx` — **nur** der Font-Import              | Subset-Auswahl (B08)                                                                              |
| `src/index.css`                                               | `@font-face`/Fallback-Metriken, CSS-Anteil (B07, B08); Fokusnetz und Reduced-Motion-Block bleiben |
| `tailwind.config.js`, `postcss.config.js`                     | CSS-Ausgabe (B07)                                                                                 |
| `index.html`                                                  | nur Preload-/Stylesheet-Reihenfolge (B07)                                                         |
| `package.json`                                                | nur falls ein anderes Font-Paket noetig ist                                                       |
| `src/components/layout/Header.tsx` — **nur** Schleier-Klassen | nur mit Trace-Beleg (B15), Kontrast des Schleiers bleibt AA                                       |

## 24. Proven — Do Not Rediscover

- Routenmatrix, HTTP-Wahrheit (18/18 beide Umgebungen), SSR-Root gefuellt, echte 404.
- 0 Provider-Requests vor Consent in allen PT25.1-Messungen; `FIELD_METRICS = NOT_AVAILABLE`; `initWebVitals` nicht verdrahtet.
- Chunk-Map, Entry-Attribution, Route-JS, Font- und Bildinventar (Zahlen §12–§17, Werkzeug `npm run perf:bundle`).
- i18n laedt 30 Dateien vor Hydration; `/en/` 15.
- LAB-/PREVIEW-Unterschied ist Kompression + AP24-Stand; kein TTFB-Engpass.
- Lighthouse 13.4.1 misst 404-Dokumente nicht.
- LCP-Elemente je Route und die zwei lazy LCP-Bilder.
- Warm-CLS-Repro und Shift-Quellen (Ursache offen, nicht erneut suchen, sondern bisektieren).

## 25. Aenderungsprotokoll

| Datum      | PT           | Aenderung                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-14 | PT25.1       | Vertrag angelegt: Baseline LAB + PREVIEW, mobile + desktop, Routenmatrix 18, Bottlenecks PERF-B01..B15, Write Sets PT25.2–PT25.4. Kein Produktcode geaendert                                                                                                                                                                              |
| 2026-09-14 | PT25.2       | §26 ergaenzt: i18n-Uebergabe SSR → Client, Consumer lazy, Musterbefund je Sprache, SSR-Warm-up; verworfen (gemessen): Namespace-Preloads, `react-dom/client` im Vendor-Chunk. PERF-B01/B03 umgesetzt, B02 teilweise, `D-29` geschlossen                                                                                                   |
| 2026-09-14 | PT25.3       | §27 ergaenzt: gemessenes Bildinventar, AVIF/WebP-Pipeline mit Guard, `ResponsivePicture`, LCP-Bilder Artikel/Artikelliste nicht mehr lazy, Produktbild-Reservierung korrigiert; PERF-B04/B10 umgesetzt, B09 gemessen ohne Aenderung, B05 als Nicht-Bild-Befund an PT25.4                                                                  |
| 2026-09-15 | PT25.4       | §28 ergaenzt: Font-Inventar, gemessene Fallback-Metriken (Arial-metrische `local()`-Quellen, Normal/Fett getrennt), App-CSS inline im SSR-Kopf, Render-Marke `rel="expect"`; verworfen (gemessen): `latin-ext`-Preload, Inline ohne Fallback-Fix. B05 aufgeloest                                                                          |
| 2026-09-15 | PT25.5       | §29 ergaenzt: Budgets aus 5×3 Kalibrierlaeufen + PT25.1-Baseline + CWV-Grenzen abgeleitet (`scripts/perf/budgets.json`), Budget-Gate `scripts/perf/check-budgets.mjs` (statisch + Laufzeit, Profile ci/lab), CI-Job `performance`, Lighthouse LAB identity + gzip neu, breiter Integrationsgate `e2e/pt25.5*`. Kein Produktcode geaendert |
| 2026-09-15 | AP25-CLOSURE | §30 konsolidierter Endstand: unabhaengige Neuvermessung (Build byte-identisch, Gate ci 852/852 · lab 888/888, Lighthouse gzip + identity, Collector, Inventare, Varianten kalt/warm, Suiten, AP24-Gate), Node-Versionen korrigiert, Consumer-Hero-Ablation, AP26/AP27-Handoff. Kein Produktcode, kein Budget geaendert                    |

---

## 26. PT25.2 — Rendering, SSR und Hydration (Delta)

> **Stand 2026-09-14.** Vorher = PT25.1-Build (`node_modules/.cache/pt25.1`, Produktcode unveraendert seit PT25.1),
> nachher = PT25.2-Build (`node_modules/.cache/pt25.2`). Beide unter derselben Toolchain wie §2, derselben Maschine,
> am selben Tag. Alles LAB bzw. LAB hinter gzip-Proxy — **kein Field, kein INP**.

### 26.1 Umgesetzt

| Bottleneck                      | Aenderung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Dateien                                                                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **PERF-B01** i18n vor Hydration | Der Server meldet die beim Render per `useTranslation` benutzten Namespaces (+ Default-/Fallback-NS) und das Fallback-Delta (fehlende `en`-Schluessel je Namespace, gemessen **0** in allen 9 Sprachen) als JSON-Datenblock am Ende von `<head>`. Der Client initialisiert i18next nur mit diesen Namespaces, bekommt `en` als Delta (keine `en`-Requests mehr) und hydratisiert, sobald sie da sind. Die restlichen Namespaces der Sprache laden nach `load` im Leerlauf, damit clientseitige Navigation wie vorher alles vorfindet. | `src/i18n.ts`, `src/i18n.server.ts`, `src/i18n.client.ts`, `src/entry-server.tsx`, `src/entry-client.tsx`, `server.ts`                                       |
| **PERF-B02** Entry-Chunk        | Consumer-Seiten `SprayPage`/`MaskPage`/`DuoPage` per `lazy()` (Kopf beim ersten Request ueber die bestehende head-gated Retry-Schleife, geprueft gegen frischen Server). `HomePage` bleibt bewusst statisch: Root-Route, ein Lazy-Chunk waere dort ein zusaetzlicher serieller Schritt vor der Hydration. **`react-dom/client` bleibt im Entry** — die Verlagerung in `vendor-react` wurde umgesetzt, gemessen (§26.2, Runde 3) und **zurueckgenommen**.                                                                              | `src/App.tsx`, `vite.config.ts` (nur Kommentar mit Messbegruendung)                                                                                          |
| **PERF-B03** Musterbefund       | Jedes Routenmodul gibt seine zehn Sprachfassungen als **explizite dynamische Loader** an `loadBefundFamily`; der Server laedt und validiert alle zehn, der Browser nur die URL-Sprache. `React.lazy` nutzt `loadRoute()` als Fabrik — das Promise loest erst mit dem Inhalt auf, die Hydration sieht exakt den SSR-Inhalt. AP16-Vertrag (Panel-Namen, Validierung, Fallback-Hinweis ueber `_translationStatus`, Back-to-top/ChapterNav) unveraendert.                                                                                 | `src/content/befunde/model.ts`, `src/pages/musterbefund/*.tsx` (6), `src/pages/MusterbefundPage.tsx` (nur Prop-Typ `Partial<BefundSprachen>`), `src/App.tsx` |
| SSR-Kaltstart                   | `server.ts` rendert nach `listen` jede kanonische Route einmal (Default-Sprache, nicht blockierend, Fehler nur geloggt). Hebt die Kaltstart-Kosten des ersten Requests je Route auf, die die lazy Routen seit jeher hatten.                                                                                                                                                                                                                                                                                                           | `server.ts`                                                                                                                                                  |

**Nicht umgesetzt, evidenzbasiert:** Artikel-Chunks (alle Locales je Artikel-JSON, 37–67 KB raw / bis 27 KB gzip) — der Umbau braeuchte eine Aenderung der Inhaltsdateien `src/content/articles/*.json` und ihrer Guards bei rund einem Viertel des Musterbefund-Effekts; bleibt P2 fuer PT25.5-Budgetentscheidung. `tailwind-merge` (B13, 24,7 KB) nicht angefasst. Client-only Widgets (`CookieBanner`, `MobileCallButton`, `SearchModal`, `RouteAnnouncer`) nicht veraendert: kein eigener Long Task > 50 ms zuordenbar, Hydration-Dauer selbst 150–380 ms mobil.

### 26.2 Verworfene Varianten (gemessen, nicht ausgeliefert)

**a) Namespace-Preloads.** Der erste Stand legte fuer die SSR-Namespaces `<link rel="preload" as="fetch">` in den Kopf. Gemessen verschlechterte das auf Mobil FCP/LCP
(Collector FCP +300 bis +1.000 ms) und liess die Inter-Schrift nach dem ersten Paint tauschen: `/de/contact` **CLS 0,161**. Kontrolliert verglichen mit
`scripts/perf/variant-compare.mjs` (mobil, CDP-Drosselung) und `scripts/perf/gzip-proxy.mjs` als Stellvertreter fuer den Host-nginx:

**Runde 1 — Preload-Varianten, unkomprimiert und gzip** (mobil 412×823, CDP 4× CPU / 150 ms / 1,6 Mbit/s, kalt, Median aus 3 Laeufen)

| Variante              | Route                                         | FCP ms | LCP ms | Hydration Start → Ende ms | CLS Median (max) | Long Tasks Σ ms | Transfer KB |
| --------------------- | --------------------------------------------- | ------ | ------ | ------------------------- | ---------------- | --------------- | ----------- |
| before-identity       | /de/                                          | 2.716  | 2.716  | 7.889 → 8.249             | 0.004 (0.004)    | 380             | 1.484       |
| before-identity       | /de/contact                                   | 2.468  | 2.468  | 7.721 → 7.941             | 0.003 (0.004)    | 311             | 1.484       |
| before-identity       | /de/epigenetics/musterbefund/metabolic-health | 2.964  | 2.964  | 8.548 → 8.747             | 0.004 (0.004)    | 508             | 2.009       |
| before-identity       | /pl/                                          | 2.724  | 2.724  | 8.373 → 8.673             | 0.003 (0.004)    | 439             | 1.569       |
| before-identity       | /de/consumer/vitamin-d3-spray                 | 2.920  | 2.920  | 8.055 → 8.414             | 0.000 (0.000)    | 378             | 1.524       |
| before-identity       | /de/pt25-baseline-gibt-es-nicht               | 2.280  | 2.280  | 7.572 → 7.765             | 0.003 (0.003)    | 278             | 1.424       |
| preload-high-identity | /de/                                          | 3.136  | 3.136  | 5.290 → 5.571             | 0.018 (0.018)    | 380             | 1.084       |
| preload-high-identity | /de/contact                                   | 3.164  | 3.164  | 5.111 → 5.336             | 0.161 (0.161)    | 310             | 1.084       |
| preload-high-identity | /de/epigenetics/musterbefund/metabolic-health | 3.360  | 3.360  | 5.902 → 6.143             | 0.016 (0.017)    | 619             | 1.318       |
| preload-high-identity | /pl/                                          | 3.148  | 3.148  | 5.678 → 5.983             | 0.003 (0.003)    | 513             | 1.169       |
| preload-high-identity | /de/consumer/vitamin-d3-spray                 | 3.460  | 3.460  | 4.426 → 5.462             | 0.000 (0.000)    | 369             | 1.172       |
| preload-high-identity | /de/pt25-baseline-gibt-es-nicht               | 2.880  | 2.880  | 4.912 → 5.091             | 0.008 (0.008)    | 244             | 1.025       |
| preload-low-identity  | /de/                                          | 3.424  | 3.424  | 5.263 → 5.498             | 0.003 (0.004)    | 356             | 1.084       |
| preload-low-identity  | /de/contact                                   | 3.392  | 3.392  | 5.068 → 5.259             | 0.003 (0.003)    | 263             | 1.084       |
| preload-low-identity  | /de/epigenetics/musterbefund/metabolic-health | 3.520  | 3.520  | 5.911 → 6.148             | 0.003 (0.003)    | 499             | 1.319       |
| preload-low-identity  | /pl/                                          | 3.240  | 3.240  | 5.686 → 5.952             | 0.003 (0.003)    | 403             | 1.169       |
| preload-low-identity  | /de/consumer/vitamin-d3-spray                 | 3.456  | 3.456  | 4.442 → 5.423             | 0.000 (0.000)    | 356             | 1.172       |
| preload-low-identity  | /de/pt25-baseline-gibt-es-nicht               | 3.148  | 3.148  | 4.941 → 5.136             | 0.003 (0.003)    | 271             | 1.025       |
| preload-off-identity  | /de/                                          | 2.904  | 2.904  | 5.300 → 5.609             | 0.003 (0.004)    | 318             | 1.083       |
| preload-off-identity  | /de/contact                                   | 2.728  | 2.728  | 5.147 → 5.338             | 0.003 (0.003)    | 311             | 1.083       |
| preload-off-identity  | /de/epigenetics/musterbefund/metabolic-health | 3.280  | 3.280  | 5.902 → 6.146             | 0.003 (0.003)    | 470             | 1.317       |
| preload-off-identity  | /pl/                                          | 2.924  | 2.924  | 5.761 → 6.031             | 0.003 (0.004)    | 361             | 1.168       |
| preload-off-identity  | /de/consumer/vitamin-d3-spray                 | 3.224  | 3.224  | 4.498 → 5.493             | 0.000 (0.000)    | 347             | 1.172       |
| preload-off-identity  | /de/pt25-baseline-gibt-es-nicht               | 2.576  | 2.576  | 4.994 → 5.192             | 0.003 (0.003)    | 234             | 1.024       |
| before-gzip           | /de/                                          | 1.168  | 1.168  | 3.258 → 3.570             | 0.003 (0.003)    | 474             | 494         |
| before-gzip           | /de/contact                                   | 1.072  | 1.072  | 3.168 → 3.363             | 0.003 (0.003)    | 338             | 486         |
| before-gzip           | /de/epigenetics/musterbefund/metabolic-health | 1.212  | 1.212  | 3.278 → 3.523             | 0.003 (0.004)    | 607             | 626         |
| before-gzip           | /pl/                                          | 1.188  | 1.188  | 3.608 → 3.997             | 0.003 (0.004)    | 515             | 581         |
| before-gzip           | /de/consumer/vitamin-d3-spray                 | 1.132  | 1.132  | 3.519 → 3.907             | 0.000 (0.000)    | 455             | 543         |
| before-gzip           | /de/pt25-baseline-gibt-es-nicht               | 1.052  | 1.052  | 3.132 → 3.345             | 0.003 (0.003)    | 325             | 470         |
| preload-high-gzip     | /de/                                          | 1.128  | 1.128  | 2.266 → 2.587             | 0.018 (0.019)    | 446             | 375         |
| preload-high-gzip     | /de/contact                                   | 944    | 944    | 2.158 → 2.327             | 0.161 (0.161)    | 314             | 367         |
| preload-high-gzip     | /de/epigenetics/musterbefund/metabolic-health | 1.128  | 1.128  | 2.322 → 2.617             | 0.016 (0.016)    | 788             | 425         |
| preload-high-gzip     | /pl/                                          | 1.128  | 1.128  | 2.626 → 2.908             | 0.003 (0.003)    | 444             | 462         |
| preload-high-gzip     | /de/consumer/vitamin-d3-spray                 | 1.060  | 1.060  | 2.040 → 2.793             | 0.028 (0.028)    | 534             | 440         |
| preload-high-gzip     | /de/pt25-baseline-gibt-es-nicht               | 1.040  | 1.040  | 2.145 → 2.311             | 0.008 (0.008)    | 235             | 352         |
| preload-low-gzip      | /de/                                          | 1.164  | 1.164  | 2.134 → 2.476             | 0.018 (0.018)    | 369             | 375         |
| preload-low-gzip      | /de/contact                                   | 1.024  | 1.024  | 2.066 → 2.220             | 0.161 (0.161)    | 286             | 367         |
| preload-low-gzip      | /de/epigenetics/musterbefund/metabolic-health | 1.180  | 1.180  | 2.261 → 2.455             | 0.016 (0.017)    | 648             | 425         |
| preload-low-gzip      | /pl/                                          | 1.164  | 1.164  | 2.355 → 2.797             | 0.003 (0.004)    | 521             | 462         |
| preload-low-gzip      | /de/consumer/vitamin-d3-spray                 | 1.084  | 1.084  | 2.000 → 2.774             | 0.028 (0.028)    | 416             | 440         |
| preload-low-gzip      | /de/pt25-baseline-gibt-es-nicht               | 1.004  | 1.004  | 2.151 → 2.398             | 0.008 (0.008)    | 288             | 352         |
| preload-off-gzip      | /de/                                          | 1.384  | 1.384  | 2.383 → 2.716             | 0.003 (0.004)    | 647             | 375         |
| preload-off-gzip      | /de/contact                                   | 1.256  | 1.256  | 2.212 → 2.402             | 0.004 (0.004)    | 479             | 367         |
| preload-off-gzip      | /de/epigenetics/musterbefund/metabolic-health | 1.664  | 1.664  | 2.611 → 2.893             | 0.004 (0.004)    | 1.212           | 425         |
| preload-off-gzip      | /pl/                                          | 1.300  | 1.300  | 2.481 → 2.827             | 0.004 (0.004)    | 640             | 462         |
| preload-off-gzip      | /de/consumer/vitamin-d3-spray                 | 1.320  | 1.320  | 2.131 → 2.909             | 0.000 (0.028)    | 563             | 440         |
| preload-off-gzip      | /de/pt25-baseline-gibt-es-nicht               | 1.076  | 1.076  | 2.223 → 2.429             | 0.003 (0.003)    | 264             | 352         |

**Runde 2 — Tags hinter dem Font-Preload, nur gzip** (mobil 412×823, CDP 4× CPU / 150 ms / 1,6 Mbit/s, kalt, Median aus 5 Laeufen)

| Variante       | Route                                         | FCP ms | LCP ms | Hydration Start → Ende ms | CLS Median (max) | Long Tasks Σ ms | Transfer KB |
| -------------- | --------------------------------------------- | ------ | ------ | ------------------------- | ---------------- | --------------- | ----------- |
| before-gzip    | /de/                                          | 1.212  | 1.212  | 3.242 → 3.642             | 0.004 (0.004)    | 477             | 494         |
| before-gzip    | /de/contact                                   | 1.184  | 1.184  | 3.173 → 3.392             | 0.003 (0.004)    | 449             | 486         |
| before-gzip    | /de/epigenetics/musterbefund/metabolic-health | 1.336  | 1.336  | 3.288 → 3.554             | 0.004 (0.004)    | 871             | 626         |
| before-gzip    | /pl/                                          | 1.332  | 1.332  | 3.508 → 3.931             | 0.004 (0.004)    | 742             | 581         |
| tail-high-gzip | /de/                                          | 1.164  | 1.164  | 2.174 → 2.505             | 0.018 (0.018)    | 436             | 375         |
| tail-high-gzip | /de/contact                                   | 1.072  | 1.072  | 2.092 → 2.290             | 0.161 (0.161)    | 288             | 367         |
| tail-high-gzip | /de/epigenetics/musterbefund/metabolic-health | 1.232  | 1.232  | 2.254 → 2.502             | 0.017 (0.017)    | 772             | 425         |
| tail-high-gzip | /pl/                                          | 1.204  | 1.204  | 2.346 → 2.777             | 0.004 (0.004)    | 484             | 462         |
| tail-low-gzip  | /de/                                          | 1.280  | 1.280  | 2.162 → 2.488             | 0.003 (0.018)    | 549             | 375         |
| tail-low-gzip  | /de/contact                                   | 1.192  | 1.192  | 2.108 → 2.294             | 0.003 (0.161)    | 393             | 367         |
| tail-low-gzip  | /de/epigenetics/musterbefund/metabolic-health | 1.236  | 1.236  | 2.231 → 2.471             | 0.004 (0.017)    | 698             | 425         |
| tail-low-gzip  | /pl/                                          | 1.168  | 1.168  | 2.361 → 2.831             | 0.004 (0.004)    | 701             | 462         |
| off-gzip       | /de/                                          | 1.296  | 1.296  | 2.424 → 2.725             | 0.004 (0.004)    | 664             | 375         |
| off-gzip       | /de/contact                                   | 1.272  | 1.272  | 2.224 → 2.466             | 0.004 (0.004)    | 482             | 367         |
| off-gzip       | /de/epigenetics/musterbefund/metabolic-health | 1.452  | 1.452  | 2.357 → 2.603             | 0.004 (0.004)    | 897             | 425         |
| off-gzip       | /pl/                                          | 1.272  | 1.272  | 2.528 → 2.827             | 0.004 (0.004)    | 568             | 462         |

Ergebnis: `high` → CLS-Regression immer (auch hinter dem Font-Preload); `low` → beste Hydration, aber CLS 0,161 sporadisch; **ohne Preload → kein CLS** → ausgeliefert.
Der eigentliche Mangel ist ein **latenter Schrift-Swap-Shift auf `/de/contact`**, sobald Inter nach dem ersten Paint eintrifft — Owner **PT25.4** (Fallback-Metriken). Erst danach ist `fetchpriority="low"` fuer die Namespaces wieder eine Option.

**b) `react-dom/client` in `vendor-react`.** Nach den Runden 1–2 blieb unkomprimiert eine FCP-Verschiebung von +250 bis +400 ms. Runde 3 hat sie verschraenkt isoliert:

**Runde 3 — verschraenkte Ablation** (alle Varianten gleichzeitig, Wiederholungen abwechselnd, Median aus 5; Load1 je Wiederholung: 2.54 / 1.63 / 1.98 / 3.98 / 11.64 auf 8 Kernen)

| Variante               | Route                                         | FCP ms | LCP ms | Hydration Start → Ende ms | CLS Median (max) | Long Tasks Σ ms | Transfer KB |
| ---------------------- | --------------------------------------------- | ------ | ------ | ------------------------- | ---------------- | --------------- | ----------- |
| before-identity        | /de/                                          | 2.768  | 2.768  | 7.878 → 8.222             | 0.003 (0.003)    | 376             | 1.484       |
| before-identity        | /de/contact                                   | 2.540  | 2.540  | 7.704 → 7.881             | 0.003 (0.003)    | 296             | 1.484       |
| before-identity        | /de/epigenetics/musterbefund/metabolic-health | 2.940  | 2.940  | 8.517 → 8.748             | 0.004 (0.004)    | 554             | 2.009       |
| after-identity         | /de/                                          | 3.068  | 3.068  | 5.321 → 5.671             | 0.003 (0.004)    | 400             | 1.083       |
| after-identity         | /de/contact                                   | 2.824  | 2.824  | 5.167 → 5.413             | 0.003 (0.004)    | 287             | 1.083       |
| after-identity         | /de/epigenetics/musterbefund/metabolic-health | 3.292  | 3.292  | 5.904 → 6.177             | 0.004 (0.004)    | 538             | 1.317       |
| abl-no-vendor-identity | /de/                                          | 2.784  | 2.784  | 5.359 → 5.685             | 0.003 (0.003)    | 390             | 1.083       |
| abl-no-vendor-identity | /de/contact                                   | 2.536  | 2.536  | 5.189 → 5.458             | 0.003 (0.004)    | 399             | 1.083       |
| abl-no-vendor-identity | /de/epigenetics/musterbefund/metabolic-health | 2.996  | 2.996  | 5.953 → 6.213             | 0.003 (0.004)    | 599             | 1.318       |
| before-gzip            | /de/                                          | 1.204  | 1.204  | 3.277 → 3.576             | 0.003 (0.003)    | 508             | 494         |
| before-gzip            | /de/contact                                   | 1.112  | 1.112  | 3.194 → 3.420             | 0.003 (0.004)    | 431             | 486         |
| before-gzip            | /de/epigenetics/musterbefund/metabolic-health | 1.208  | 1.208  | 3.276 → 3.531             | 0.004 (0.004)    | 783             | 626         |
| after-gzip             | /de/                                          | 1.236  | 1.236  | 2.337 → 2.694             | 0.003 (0.003)    | 454             | 375         |
| after-gzip             | /de/contact                                   | 1.060  | 1.060  | 2.198 → 2.411             | 0.003 (0.004)    | 376             | 367         |
| after-gzip             | /de/epigenetics/musterbefund/metabolic-health | 1.148  | 1.148  | 2.362 → 2.603             | 0.004 (0.004)    | 683             | 425         |
| abl-no-vendor-gzip     | /de/                                          | 1.140  | 1.140  | 2.366 → 2.659             | 0.004 (0.004)    | 498             | 375         |
| abl-no-vendor-gzip     | /de/contact                                   | 1.096  | 1.096  | 2.253 → 2.423             | 0.003 (0.004)    | 384             | 368         |
| abl-no-vendor-gzip     | /de/epigenetics/musterbefund/metabolic-health | 1.216  | 1.216  | 2.349 → 2.600             | 0.003 (0.004)    | 754             | 425         |

`after` = PT25.2 mit `react-dom/client` im Vendor-Chunk, `abl-no-vendor` = PT25.2 ohne diese Chunk-Aenderung (= ausgelieferter Endstand).

Ohne Kompression kostet allein die Chunk-Verlagerung +284 bis +352 ms FCP; mit gzip sind alle drei Varianten innerhalb ±65 ms. Der erhoffte Vorteil (Vendor-Cache ueber Deploys) ist nicht gemessen → **zurueckgenommen**. Der ausgelieferte Endstand ist bytegleich mit der Ablationsvariante (`assets/index-BUvcPMFb.js`).

**Messhygiene:** Waehrend der Messungen lief auf derselben Maschine fremde Last (ein anderes Projekt mit `npm ci` und Vitest-Workern, Load1 bis 11,6 auf 8 Kernen). Ein sequenzieller Variantenlauf (gzip nachher: FCP 1.948 ms, Long Tasks 1.331 ms) wurde deshalb **verworfen**; ab Runde 3 laufen Varianten verschraenkt, die Last je Wiederholung steht in den Daten, und die Endmessung wartet vor jedem Schritt auf Load1 < 3.

### 26.3 Laufzeitbefund `tsx` + Modul-`await`

Der erste Musterbefund-Stand nutzte `await` auf Modulebene. Unter `tsx server.ts` (Produktionsstart, `npm run start`) loeste ein Modul-`await` in einem dynamisch importierten SSR-Chunk **nie** auf: Kopf leer, Retry-Schleife erschoepft (2,6 s), statischer IglooPro-Titel doppelt. In reinem Node derselbe Chunk: Titel nach 2 Retries. Deshalb `loadRoute()` als Lazy-Fabrik ohne Modul-`await`; gilt fuer jeden kuenftigen SSR-Chunk (Hinweis an AP28, Laufzeit `tsx`).

### 26.4 Guards und Vertraege

- `scripts/check-befunde.ts`: akzeptiert `loadBefundFamily('<slug>'` neben `defineBefundFamily` — die x10-Literalpfade im Routenmodul bleiben Pflicht, der Inhalt wird weiterhin vollstaendig per `defineBefundFamily` geprueft. `npm run check:befunde` PASS (60/60), `check:befunde-seo` PASS (60/60 SSR-Heads), `check:i18n` PASS.
- `building-docs/BEFUNDE-CONTRACT.md` Zeile „runtime/build validation" um `loadBefundFamily` ergaenzt.
- Write-Set-Erweiterung gegenueber §23.1: `scripts/check-befunde.ts` und `BEFUNDE-CONTRACT.md` (direkt vom Delta betroffen), `server.ts` ueber „nur Template-Injektion" hinaus um den Warm-up (Kaltstart-TTFB), Messwerkzeuge `scripts/perf/{ssr-render-cost,cold-start-ttfb,ttfb-interleaved,gzip-proxy,variant-compare}.mjs`, `scripts/perf/bundle-report.mjs` (Home/Consumer aus dem Manifest statt fest verdrahtet), `e2e/pt25.1.*` nur parametrisiert (`PERF_OUT`, `PERF_BUILD_DIR`). `src/i18n.server.ts` stand in §23.1 nur bedingt — genutzt fuer das Fallback-Delta.

### 26.5 Messumgebung Vorher/Nachher

Toolchain wie §2 (Lighthouse 13.4.1 mit Chrome for Testing 151, Collector mit Playwright-Chromium 143, Node 20.19.6 fuer Build/Server, 22.23.2 fuer Lighthouse).
Routenmatrix §4. LAB-Origin unkomprimiert wie PT25.1; zusaetzlich `scripts/perf/gzip-proxy.mjs` (gzip -6 ab 1 KB) als Stellvertreter fuer den Host-nginx.
PREVIEW wurde **nicht** neu gemessen: das Preview-Image ist weiterhin `ap23-preview-20260911` (kein Deploy in PT25.2) — PREVIEW-Zahlen in §5/§6 bleiben Stand PT25.1.
Fremdlast auf der Maschine ist protokolliert (§26.2 „Messhygiene“); die Endmessung wartete vor jedem Schritt auf Load1 < 3.

### 26.6 Chunks vorher → nachher

| Kennzahl                           | vorher (PT25.1-Build)    | nachher (PT25.2-Endstand)                                      |
| ---------------------------------- | ------------------------ | -------------------------------------------------------------- |
| **Initial JS** raw / gzip / brotli | 528,1 / 165,5 / 142,3 KB | **470,1 / 152,4 / 132,1 KB**                                   |
| `assets/index` raw / gzip          | 404,8 / 122,5            | 346,9 / 109,5                                                  |
| `assets/vendor-i18n` raw / gzip    | 65,6 / 21,8              | 65,6 / 21,8                                                    |
| `assets/vendor-react` raw / gzip   | 43,6 / 15,7              | 43,6 / 15,7                                                    |
| `assets/vendor-seo` raw / gzip     | 14,0 / 5,4               | 14,0 / 5,4                                                     |
| CSS raw / gzip                     | 92,1 / 16,5              | 92,1 / 16,5 (unveraendert)                                     |
| Dynamische Chunks                  | 65 (1950,9 KB raw)       | 135 (2020,0 KB raw; +60 Befund-Sprachchunks, +Consumer-Seiten) |

| Route-JS zusaetzlich zum Initial-JS | vorher raw / gzip (Chunks) | nachher raw / gzip (Chunks) |
| ----------------------------------- | -------------------------- | --------------------------- |
| diagnostics-hub                     | 19,4 / 5,4 (3)             | 19,4 / 5,4 (3)              |
| service-detail                      | 24,5 / 8,5 (6)             | 24,5 / 8,5 (6)              |
| igloo-pro                           | 16,7 / 4,8 (3)             | 16,7 / 4,8 (3)              |
| epigenetics-hub                     | 95,2 / 27,9 (18)           | 95,4 / 28,1 (19)            |
| epigenetics-deep                    | 28,5 / 10,5 (7)            | 28,5 / 10,5 (7)             |
| musterbefund                        | 397,5 / 115,9 (9)          | 75,6 / 23,4 (9)             |
| articles-index                      | 12,3 / 5,7 (7)             | 12,3 / 5,8 (7)              |
| article-detail                      | 84,2 / 33,9 (9)            | 84,4 / 34,2 (10)            |
| events                              | 16,9 / 6,1 (4)             | 16,9 / 6,1 (4)              |
| downloads                           | 41,9 / 12,3 (9)            | 41,9 / 12,3 (9)             |
| contact                             | 29,5 / 10,7 (9)            | 29,8 / 10,9 (10)            |
| not-found                           | 3,5 / 1,7 (3)              | 3,8 / 1,9 (4)               |
| home                                | im Entry-Chunk             | im Entry-Chunk              |
| consumer-d3                         | im Entry-Chunk             | 47,1 / 14,1 (7)             |
| consumer-duo                        | im Entry-Chunk             | 44,6 / 12,9 (5)             |

Musterbefund-Sprachchunks (zusaetzlich genau einer je Aufruf, raw / gzip KB): metabolic-health.cs.json 31,7 / 10,8 · metabolic-health.de.json 31,4 / 10,3 · metabolic-health.en.json 30,6 / 9,8 · metabolic-health.pl.json 33,1 / 10,8.

**Schwere Module:** Musterbefund-Route 397,5 → 75,6 KB raw (115,9 → 23,4 KB gzip) plus genau ein Sprachchunk (9,8–10,8 KB gzip) statt aller zehn. Consumer-Seiten nicht mehr im Entry
(Spray 47,1 / 14,1 KB, Duo 44,6 / 12,9 KB gzip als eigene Chunks). Entry 404,8 → 346,9 KB raw. Epigenetics Hub, Artikel, Downloads, Kontakt unveraendert (±0,3 KB durch geteilte Kleinchunks).
`D-29` (Musterbefund-Splitting wirkungslos) ist damit **geschlossen**.

### 26.7 SSR, TTFB, Server-Renderkosten

| Route                                         | HTTP vorher / nachher | Server-TTFB Median (p90) ms vorher → nachher, verschraenkt n=30 | Kaltstart 1. Request ms vorher → nachher (nach Warm-up) | Render isoliert kalt ms (Retries) vorher → nachher | Render warm-Median ms vorher → nachher | HTML Bytes vorher → nachher |
| --------------------------------------------- | --------------------- | --------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------- | -------------------------------------- | --------------------------- |
| /de/                                          | 200 / 200             | 16,2 (29,0) → 14,5 (23,0)                                       | 198 → 23                                                | 79 (0) → 75 (0)                                    | 14,1 → 12,4                            | 83.835 → 84.258             |
| /de/diagnostics                               | 200 / 200             | 15,9 (20,8) → 14,9 (19,4)                                       | 64 → 18                                                 | 49 (1) → 49 (1)                                    | 9,3 → 10,6                             | 89.876 → 90.299             |
| /de/diagnostics/dental                        | 200 / 200             | 14,9 (20,8) → 14,2 (18,9)                                       | 64 → 15                                                 | 64 (1) → 47 (1)                                    | 10,9 → 9,1                             | 71.271 → 71.694             |
| /de/igloo-pro                                 | 200 / 200             | 12,2 (16,4) → 12,5 (18,9)                                       | 51 → 12                                                 | 42 (1) → 42 (1)                                    | 9,5 → 7,4                              | 64.535 → 64.958             |
| /de/epigenetics                               | 200 / 200             | 23,9 (27,9) → 22,8 (30,4)                                       | 70 → 26                                                 | 61 (1) → 55 (1)                                    | 19,2 → 20,7                            | 151.481 → 151.904           |
| /de/epigenetics/grundlagen                    | 200 / 200             | 10,5 (15,0) → 10,0 (14,7)                                       | 63 → 11                                                 | 36 (1) → 41 (1)                                    | 8,9 → 6,5                              | 54.147 → 54.570             |
| /de/epigenetics/musterbefund/metabolic-health | 200 / 200             | 19,6 (26,7) → 18,7 (28,1)                                       | 82 → 29                                                 | 62 (1) → 52 (1)                                    | 14,7 → 12,0                            | 210.728 → 211.151           |
| /de/articles                                  | 200 / 200             | 12,5 (16,7) → 11,6 (15,1)                                       | 49 → 13                                                 | 44 (1) → 41 (1)                                    | 7,4 → 6,8                              | 56.130 → 56.553             |
| /de/articles/die-gruene-praxis                | 200 / 200             | 9,9 (13,4) → 11,3 (14,5)                                        | 46 → 15                                                 | 40 (1) → 40 (1)                                    | 7,8 → 5,9                              | 54.133 → 54.556             |
| /de/events                                    | 200 / 200             | 9,9 (11,8) → 10,0 (13,8)                                        | 47 → 17                                                 | 41 (1) → 41 (1)                                    | 8,1 → 6,9                              | 47.494 → 47.917             |
| /de/downloads                                 | 200 / 200             | 18,5 (24,2) → 19,5 (25,4)                                       | 56 → 29                                                 | 51 (1) → 50 (1)                                    | 18,8 → 13,5                            | 103.407 → 103.830           |
| /de/contact                                   | 200 / 200             | 11,3 (14,2) → 11,5 (16,1)                                       | 46 → 41                                                 | 42 (1) → 41 (1)                                    | 8,4 → 7,4                              | 69.179 → 69.602             |
| /de/consumer/vitamin-d3-spray                 | 200 / 200             | 8,4 (10,8) → 8,9 (11,2)                                         | 15 → 14                                                 | 10 (0) → 37 (1)                                    | 5,7 → 4,3                              | 72.501 → 72.826             |
| /de/consumer/inside-out-duo                   | 200 / 200             | 7,5 (11,7) → 7,7 (10,1)                                         | 10 → 9                                                  | 4 (0) → 34 (1)                                     | 4,1 → 5,1                              | 53.958 → 54.283             |
| /de/pt25-baseline-gibt-es-nicht               | 404 / 404             | 9,0 (14,6) → 9,5 (12,5)                                         | 44 → 46                                                 | 36 (1) → 37 (1)                                    | 5,2 → 5,1                              | 37.180 → 37.603             |
| /en/                                          | 200 / 200             | 14,5 (22,0) → 14,5 (19,7)                                       | 17 → 18                                                 | 10 (0) → 12 (0)                                    | 9,8 → 7,6                              | 83.970 → 84.195             |
| /pl/                                          | 200 / 200             | 14,3 (16,9) → 15,7 (21,1)                                       | 17 → 20                                                 | 10 (0) → 14 (0)                                    | 10,5 → 8,1                             | 83.625 → 84.048             |
| /pl/epigenetics/musterbefund/metabolic-health | 200 / 200             | 18,9 (24,6) → 20,1 (25,5)                                       | 21 → 19                                                 | 11 (0) → 10 (0)                                    | 14,5 → 11,5                            | 205.718 → 206.141           |

Load1 waehrend des TTFB-Vergleichs: 4.27 → 3.84. Warm-up: `[ssr-warmup] 43/43 Routen in 679 ms vorgewaermt`. Kaltstart „vorher" = Messung vom PT25.1-Build mit dem server.ts-Stand VOR dem Warm-up (`before/cold-start.json`); ein spaeterer Lauf des Vorher-Builds unter dem neuen server.ts ohne Warten auf den Warm-up ist als ungueltig verworfen (Requests konkurrierten mit dem laufenden Warm-up).

- **Server-TTFB:** verschraenkt keine Regression (Median-Differenz −1,7 bis +1,4 ms je Route).
- **Kaltstart:** mit Warm-up auf allen Routen gleich oder besser (Startseite 198 → 23 ms, Musterbefund 82 → 29 ms, Epigenetics Hub 70 → 26 ms); schlechteste Abweichung +3 ms (`/pl/` 17 → 20 ms, Rauschbereich). Warm-up 43/43 Routen in ~700 ms nach `listen`. Requests **waehrend** des Warm-ups sahen in einem Lauf 45–73 ms.
- **Isolierte Renderkosten** (ohne HTTP) unveraendert bis leicht besser; SSR-HTML +423 Bytes (i18n-Zustandsblock).
- SSR bleibt vollstaendig: 18/18 Routen mit gefuelltem Root, echte 404, Kopf beim ersten Request auch fuer lazy Consumer- und Befundseiten (Test 1).

### 26.8 Hydration und Long Tasks

**Collector LAB mobile, kalt** (vorher = PT25.1-Build, nachher = PT25.2-Endstand, je 1 Lauf; CDP 4× CPU / 150 ms / 1,6 Mbit/s, unkomprimiert)

| Route                                         | FCP ms vorher → nachher | LCP ms        | Hydration Start ms | Hydration Ende ms | Long Tasks n / Σ ms | Locale-JSON gesamt | CLS kalt        |
| --------------------------------------------- | ----------------------- | ------------- | ------------------ | ----------------- | ------------------- | ------------------ | --------------- |
| /de/                                          | 2.752 → 2.796           | 2.752 → 2.796 | 8.163 → 5.639      | 8.479 → 5.960     | 2 / 336 → 2 / 408   | 30 → 15            | 0.0039 → 0.0036 |
| /de/diagnostics                               | 2.684 → 2.768           | 2.684 → 2.768 | 8.214 → 5.672      | 8.335 → 5.866     | 2 / 305 → 3 / 421   | 30 → 15            | 0.0034 → 0.0036 |
| /de/diagnostics/dental                        | 2.540 → 2.512           | 2.540 → 2.512 | 8.032 → 5.495      | 8.221 → 5.673     | 2 / 353 → 3 / 404   | 30 → 15            | 0.0036 → 0.0033 |
| /de/igloo-pro                                 | 2.524 → 2.628           | 2.524 → 2.628 | 8.091 → 5.501      | 8.298 → 5.669     | 2 / 269 → 2 / 295   | 30 → 15            | 0.004 → 0.0033  |
| /de/epigenetics                               | 2.964 → 3.072           | 2.964 → 3.072 | 8.439 → 5.872      | 8.646 → 6.134     | 4 / 579 → 6 / 754   | 30 → 15            | 0.0042 → 0.004  |
| /de/epigenetics/grundlagen                    | 2.492 → 2.408           | 2.492 → 2.408 | 7.935 → 5.385      | 8.189 → 5.652     | 2 / 313 → 3 / 386   | 30 → 15            | 0.0033 → 0.0036 |
| /de/epigenetics/musterbefund/metabolic-health | 3.000 → 3.016           | 3.000 → 3.016 | 8.818 → 6.266      | 9.040 → 6.520     | 3 / 459 → 4 / 534   | 30 → 15            | 0.0036 → 0.0037 |
| /de/articles                                  | 2.392 → 2.504           | 2.392 → 2.504 | 8.670 → 6.142      | 8.859 → 6.292     | 2 / 269 → 2 / 326   | 30 → 15            | 0.0033 → 0.0035 |
| /de/articles/die-gruene-praxis                | 2.488 → 2.440           | 3.036 → 2.988 | 8.100 → 5.612      | 8.275 → 5.850     | 2 / 284 → 2 / 338   | 30 → 15            | 0.0033 → 0.0036 |
| /de/events                                    | 2.428 → 2.392           | 2.428 → 2.392 | 7.902 → 5.336      | 8.052 → 5.529     | 2 / 266 → 2 / 254   | 30 → 15            | 0.0033 → 0.0034 |
| /de/downloads                                 | 2.648 → 2.712           | 2.648 → 2.712 | 8.149 → 5.634      | 8.301 → 5.825     | 2 / 299 → 4 / 512   | 30 → 15            | 0.0036 → 0.0044 |
| /de/contact                                   | 2.568 → 2.516           | 2.568 → 2.516 | 7.993 → 5.479      | 8.197 → 5.740     | 2 / 312 → 4 / 441   | 30 → 15            | 0.0036 → 0.0043 |
| /de/consumer/vitamin-d3-spray                 | 3.000 → 3.056           | 3.000 → 3.056 | 8.382 → 4.638      | 8.758 → 5.806     | 2 / 364 → 5 / 679   | 30 → 15            | 0 → 0           |
| /de/consumer/inside-out-duo                   | 2.652 → 2.784           | 2.652 → 2.784 | 8.161 → 4.449      | 8.493 → 5.485     | 3 / 340 → 3 / 477   | 30 → 15            | 0 → 0           |
| /de/pt25-baseline-gibt-es-nicht               | 2.264 → 2.368           | 2.264 → 2.368 | 7.830 → 5.328      | 7.987 → 5.551     | 2 / 199 → 3 / 378   | 30 → 15            | 0.0034 → 0.0035 |
| /en/                                          | 2.808 → 2.688           | 2.808 → 2.688 | 6.373 → 5.622      | 6.734 → 5.872     | 3 / 482 → 2 / 334   | 15 → 15            | 0.0036 → 0.0033 |
| /pl/                                          | 2.936 → 2.856           | 2.936 → 2.856 | 8.631 → 6.039      | 8.964 → 6.359     | 4 / 639 → 3 / 529   | 30 → 15            | 0.0035 → 0.0033 |
| /pl/epigenetics/musterbefund/metabolic-health | 2.924 → 3.032           | 2.924 → 3.032 | 9.214 → 6.630      | 9.432 → 6.879     | 6 / 746 → 6 / 809   | 30 → 15            | 0.0044 → 0.004  |

mobile: Median Delta FCP 56 ms (Spanne -120 bis 132), Hydration-Ende -2520 ms (-3008 bis -862), Long-Task-Summe 73 ms.

**Collector LAB desktop, kalt** (vorher = PT25.1-Build, nachher = PT25.2-Endstand, je 1 Lauf; ohne Drosselung, unkomprimiert)

| Route                                         | FCP ms vorher → nachher | LCP ms    | Hydration Start ms | Hydration Ende ms | Long Tasks n / Σ ms | Locale-JSON gesamt | CLS kalt   |
| --------------------------------------------- | ----------------------- | --------- | ------------------ | ----------------- | ------------------- | ------------------ | ---------- |
| /de/                                          | 276 → 280               | 276 → 280 | 417 → 368          | 496 → 435         | 1 / 67 → 2 / 203    | 30 → 15            | 0 → 0      |
| /de/diagnostics                               | 208 → 244               | 208 → 244 | 332 → 293          | 377 → 344         | 1 / 73 → 1 / 83     | 30 → 15            | 0 → 0      |
| /de/diagnostics/dental                        | 584 → 416               | 584 → 416 | 840 → 424          | 876 → 460         | 4 / 524 → 2 / 342   | 30 → 15            | 0.0483 → 0 |
| /de/igloo-pro                                 | 276 → 180               | 276 → 180 | 448 → 236          | 521 → 294         | 2 / 151 → 0 / 0     | 30 → 15            | 0 → 0      |
| /de/epigenetics                               | 364 → 312               | 364 → 312 | 460 → 329          | 520 → 409         | 3 / 256 → 3 / 304   | 30 → 15            | 0 → 0      |
| /de/epigenetics/grundlagen                    | 204 → 140               | 204 → 140 | 311 → 201          | 346 → 233         | 1 / 57 → 0 / 0      | 30 → 15            | 0 → 0      |
| /de/epigenetics/musterbefund/metabolic-health | 476 → 192               | 476 → 192 | 474 → 299          | 529 → 335         | 1 / 183 → 2 / 114   | 30 → 15            | 0 → 0      |
| /de/articles                                  | 288 → 116               | 308 → 148 | 396 → 175          | 438 → 220         | 2 / 180 → 1 / 96    | 30 → 15            | 0 → 0      |
| /de/articles/die-gruene-praxis                | 260 → 136               | 276 → 196 | 360 → 236          | 409 → 274         | 1 / 54 → 1 / 50     | 30 → 15            | 0 → 0      |
| /de/events                                    | 212 → 152               | 212 → 152 | 347 → 205          | 378 → 259         | 2 / 117 → 0 / 0     | 30 → 15            | 0 → 0      |
| /de/downloads                                 | 392 → 152               | 392 → 152 | 435 → 183          | 489 → 245         | 2 / 189 → 1 / 109   | 30 → 15            | 0 → 0      |
| /de/contact                                   | 244 → 220               | 244 → 220 | 352 → 269          | 384 → 316         | 3 / 243 → 2 / 195   | 30 → 15            | 0 → 0      |
| /de/consumer/vitamin-d3-spray                 | 284 → 196               | 284 → 196 | 377 → 195          | 540 → 317         | 3 / 201 → 1 / 74    | 30 → 15            | 0 → 0      |
| /de/consumer/inside-out-duo                   | 232 → 188               | 232 → 188 | 357 → 225          | 467 → 353         | 2 / 130 → 2 / 110   | 30 → 15            | 0 → 0      |
| /de/pt25-baseline-gibt-es-nicht               | 224 → 96                | 224 → 96  | 287 → 142          | 337 → 180         | 0 / 0 → 0 / 0       | 30 → 15            | 0 → 0      |
| /en/                                          | 296 → 220               | 296 → 220 | 393 → 294          | 457 → 362         | 2 / 199 → 1 / 80    | 15 → 15            | 0 → 0      |
| /pl/                                          | 424 → 228               | 424 → 228 | 603 → 338          | 718 → 405         | 3 / 312 → 2 / 154   | 30 → 15            | 0 → 0      |
| /pl/epigenetics/musterbefund/metabolic-health | 256 → 180               | 256 → 180 | 421 → 254          | 467 → 285         | 2 / 122 → 1 / 58    | 30 → 15            | 0 → 0      |

desktop: Median Delta FCP -76 ms (Spanne -284 bis 36), Hydration-Ende -135 ms (-416 bis -33), Long-Task-Summe -64 ms.

Verschraenkte Messung (§26.2 Runde 3, Endstand = `abl-no-vendor`): Hydration-Ende mobil unkomprimiert **8.222 → 5.685 ms** (Startseite), **7.881 → 5.458 ms** (Kontakt), **8.748 → 6.213 ms** (Musterbefund); mit gzip **3.576 → 2.659 / 3.420 → 2.423 / 3.531 → 2.600 ms**. FCP dabei unkomprimiert +16 / −4 / +56 ms, gzip −64 / −16 / +8 ms (Rauschbereich). Long-Task-Summen ohne systematische Aenderung; Musterbefund mit gzip 783 → 754 ms. Hydration-Fehler 0, Root-Suspense-Fallback nie sichtbar.

**Warum nicht mehr:** Das SSR der Startseite benutzt bereits 12 von 15 Namespaces, weil `useSearch` (in `SearchModal`, auf jeder Seite gemountet) zwoelf Namespaces per `useTranslation([...])` anfordert. Der Gewinn kommt deshalb vor allem aus dem Wegfall der 15 `en`-Dateien. Weitere Reduktion (Suchindex erst beim Oeffnen) ist P2 und nicht Teil von PT25.2.

### 26.9 Lighthouse LAB vorher (PT25.1) → nachher (Endstand)

3 Laeufe je Route/Profil, simulierte Drosselung, unkomprimierter LAB-Origin, 11 Routen der Matrix.

| Profil  | Route                                         | Score vorher → nachher | FCP ms        | LCP ms Median (Spanne nachher) | TBT ms | CLS           | TTFB ms | Transfer KB   | Requests | Provider |
| ------- | --------------------------------------------- | ---------------------- | ------------- | ------------------------------ | ------ | ------------- | ------- | ------------- | -------- | -------- |
| mobile  | /de/                                          | 0.7 → 0.72             | 4.565 → 4.261 | 5.090 → 4.786 (4.780–4.794)    | 4 → 20 | 0.003 → 0.003 | 22 → 32 | 1.563 → 1.162 | 44 → 29  | 0        |
| mobile  | /de/diagnostics                               | 0.7 → 0.72             | 4.589 → 4.275 | 5.114 → 4.800 (4.786–4.968)    | 0 → 18 | 0.003 → 0.003 | 25 → 28 | 1.589 → 1.188 | 47 → 32  | 0        |
| mobile  | /de/epigenetics                               | 0.68 → 0.69            | 4.863 → 4.664 | 5.313 → 5.189 (5.030–5.218)    | 0 → 2  | 0.003 → 0.003 | 37 → 41 | 1.711 → 1.311 | 61 → 47  | 0        |
| mobile  | /de/epigenetics/musterbefund/metabolic-health | 0.66 → 0.66            | 5.300 → 5.111 | 5.750 → 5.635 (5.457–5.636)    | 3 → 7  | 0.003 → 0.003 | 31 → 41 | 2.087 → 1.396 | 53 → 39  | 0        |
| mobile  | /de/articles/die-gruene-praxis                | 0.71 → 0.68            | 4.401 → 4.212 | 5.001 → 6.160 (4.887–6.349)    | 1 → 52 | 0.003 → 0.003 | 17 → 25 | 1.641 → 1.241 | 53 → 39  | 0        |
| mobile  | /de/contact                                   | 0.7 → 0.73             | 4.507 → 4.119 | 5.032 → 4.569 (4.569–4.577)    | 0 → 82 | 0.003 → 0.003 | 19 → 27 | 1.562 → 1.162 | 52 → 38  | 0        |
| mobile  | /de/consumer/vitamin-d3-spray                 | 0.69 → 0.72            | 4.503 → 4.115 | 5.411 → 5.020 (5.015–5.051)    | 0 → 0  | 0.000 → 0.000 | 14 → 20 | 1.603 → 1.251 | 44 → 36  | 0        |
| mobile  | /de/consumer/inside-out-duo                   | 0.69 → 0.72            | 4.505 → 4.120 | 5.405 → 4.887 (4.148–5.107)    | 0 → 2  | 0.000 → 0.000 | 17 → 27 | 1.564 → 1.209 | 44 → 34  | 0        |
| mobile  | /en/                                          | 0.69 → 0.71            | 4.658 → 4.359 | 5.258 → 4.959 (4.808–4.964)    | 1 → 14 | 0.003 → 0.003 | 21 → 23 | 1.200 → 1.142 | 29 → 29  | 0        |
| mobile  | /pl/                                          | 0.65 → 0.67            | 5.257 → 4.860 | 5.782 → 5.480 (5.373–6.890)    | 0 → 0  | 0.003 → 0.003 | 21 → 22 | 1.648 → 1.247 | 45 → 30  | 0        |
| mobile  | /pl/epigenetics/musterbefund/metabolic-health | 0.63 → 0.64            | 5.748 → 5.468 | 6.273 → 5.993 (5.977–6.077)    | 10 → 0 | 0.003 → 0.003 | 32 → 41 | 2.168 → 1.478 | 54 → 40  | 0        |
| desktop | /de/                                          | 0.98 → 0.98            | 888 → 820     | 990 → 938 (918–1.186)          | 0 → 0  | 0.000 → 0.000 | 21 → 22 | 1.567 → 1.166 | 45 → 30  | 0        |
| desktop | /de/diagnostics                               | 0.98 → 0.98            | 856 → 858     | 936 → 920 (905–938)            | 0 → 0  | 0.000 → 0.000 | 24 → 41 | 1.589 → 1.188 | 47 → 32  | 0        |
| desktop | /de/epigenetics                               | 0.97 → 0.98            | 940 → 912     | 1.024 → 973 (972–977)          | 0 → 0  | 0.000 → 0.000 | 32 → 49 | 1.711 → 1.311 | 61 → 47  | 0        |
| desktop | /de/epigenetics/musterbefund/metabolic-health | 0.96 → 0.96            | 1.030 → 988   | 1.110 → 1.087 (1.080–1.137)    | 0 → 0  | 0.000 → 0.000 | 39 → 57 | 2.087 → 1.396 | 53 → 39  | 0        |
| desktop | /de/articles/die-gruene-praxis                | 0.98 → 0.96            | 868 → 851     | 968 → 1.227 (1.217–1.267)      | 0 → 0  | 0.000 → 0.000 | 16 → 37 | 1.641 → 1.241 | 53 → 39  | 0        |
| desktop | /de/contact                                   | 0.98 → 0.98            | 881 → 837     | 961 → 917 (889–1.007)          | 0 → 0  | 0.000 → 0.000 | 29 → 28 | 1.562 → 1.162 | 52 → 38  | 0        |
| desktop | /de/consumer/vitamin-d3-spray                 | 0.98 → 0.98            | 869 → 851     | 1.012 → 1.026 (1.025–1.030)    | 0 → 0  | 0.000 → 0.000 | 20 → 26 | 1.625 → 1.273 | 45 → 37  | 0        |
| desktop | /de/consumer/inside-out-duo                   | 0.98 → 0.98            | 868 → 842     | 1.044 → 1.025 (997–1.027)      | 0 → 0  | 0.000 → 0.000 | 18 → 26 | 1.648 → 1.293 | 46 → 36  | 0        |
| desktop | /en/                                          | 0.98 → 0.98            | 888 → 847     | 988 → 948 (918–950)            | 0 → 0  | 0.000 → 0.000 | 21 → 29 | 1.204 → 1.147 | 30 → 30  | 0        |
| desktop | /pl/                                          | 0.97 → 0.95            | 965 → 907     | 1.065 → 1.350 (1.010–1.365)    | 0 → 0  | 0.000 → 0.000 | 26 → 28 | 1.653 → 1.252 | 46 → 31  | 0        |
| desktop | /pl/epigenetics/musterbefund/metabolic-health | 0.95 → 0.96            | 1.065 → 1.033 | 1.191 → 1.133 (1.131–1.168)    | 0 → 0  | 0.000 → 0.000 | 33 → 48 | 2.168 → 1.478 | 54 → 40  | 0        |

- **Mobil:** FCP auf **allen 11 Routen besser** (−124 bis −397 ms), LCP auf 10/11 besser (bis −518 ms), Transfer −352 bis −691 KB; Artikel-Detail siehe unten.
- **Desktop:** FCP auf 10/11 besser, 1 gleich (+2 ms); LCP bei 9/11 gleich oder besser; Artikel-Detail +259 ms und `/pl/` +285 ms siehe unten.
- **Lantern-Empfindlichkeit (belegt):** Im beobachteten Trace ist LCP = FCP bzw. dasselbe Element; springt die simulierte LCP, liegt in diesen Laeufen beobachtetes DCL vor dem ersten Paint (kleinerer, frueher ausgefuehrter Entry) oder der beobachtete Lauf war insgesamt langsamer (Load). Einzelne Lighthouse-LCP-Werte sind deshalb fuer PT25.3–PT25.5 nur mit Spanne und Gegenmessung in echtem Chrome zu bewerten.

**Gegenmessung Artikel-Detail und `/pl/` in echtem Chrome** (verschraenkt, Median aus 7, unkomprimiert; Load1 desktop 1.76 / 1.72 / 1.45 / 1.23 / 1.33 / 1.2 / 1.02, mobil 1.46 / 1.1 / 1.51 / 1.48 / 1.38 / 1.54 / 1.97):

| Profil  | Variante        | Route                          | FCP ms | LCP ms | Hydration Start → Ende ms | CLS   | Long Tasks Σ ms | Transfer KB |
| ------- | --------------- | ------------------------------ | ------ | ------ | ------------------------- | ----- | --------------- | ----------- |
| desktop | before-identity | /de/articles/die-gruene-praxis | 112    | 144    | 189 → 233                 | 0.000 | 96              | 1562        |
| desktop | before-identity | /pl/                           | 164    | 164    | 257 → 332                 | 0.000 | 55              | 1574        |
| desktop | after-identity  | /de/articles/die-gruene-praxis | 100    | 128    | 160 → 191                 | 0.000 | 114             | 1162        |
| desktop | after-identity  | /pl/                           | 168    | 168    | 213 → 276                 | 0.000 | 62              | 1173        |
| mobil   | before-identity | /de/articles/die-gruene-praxis | 2.424  | 2.980  | 7.820 → 8.021             | 0.003 | 317             | 1562        |
| mobil   | before-identity | /pl/                           | 2.776  | 2.776  | 8.297 → 8.637             | 0.003 | 401             | 1569        |
| mobil   | after-identity  | /de/articles/die-gruene-praxis | 2.456  | 2.996  | 5.274 → 5.498             | 0.003 | 311             | 1162        |
| mobil   | after-identity  | /pl/                           | 2.768  | 2.768  | 5.762 → 6.083             | 0.003 | 407             | 1168        |

Ergebnis: **keine LCP-Regression** — Artikel desktop LCP 144 → 128 ms, mobil 2.980 → 2.996 ms (+16, Rauschbereich); `/pl/` desktop 164 → 168 ms, mobil 2.776 → 2.768 ms. Die Lighthouse-Ausreisser (§26.9) sind damit Lantern-Empfindlichkeit plus Last im beobachteten Lauf, keine Codefolge. Das lazy LCP-Bild (PERF-B04) bleibt der Grund fuer die hohe Empfindlichkeit dieser Route.

### 26.10 Suspense und Client-only

- Keine neue Suspense-Grenze. `LazyRoute` (`fallback={null}`) umschliesst jetzt auch die Consumer-Seiten, wie alle anderen lazy Seiten; die Wurzelgrenze in `entry-client.tsx` bleibt. Test 4 und 5 pruefen, dass der Root-Fallback bei Hydration **und** bei clientseitiger Navigation (Startseite → Epigenetik → Musterbefund, direkt nach der Hydration) nie sichtbar wird.
- Client-only Widgets unveraendert (keine gemessene Einzelkosten > 50 ms).

### 26.11 Tests (fokussiert, kein Closure-Lauf)

| Pruefung                                                                           | Ergebnis                                                                                                                                                       |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `e2e/pt25.2.spec.ts` (8 Tests) gegen frisch gestarteten Endstand-Produktionsserver | **8/8 PASS** (zweimal: vor und nach der Vendor-Ruecknahme)                                                                                                     |
| 1 Kaltstart-Kopf lazy Consumer (de/pl/cs) + Befund (de/cs)                         | PASS — genau ein `<title>`, kein IglooPro-Default, ein Canonical, `og:title`, `h1` im SSR                                                                      |
| 2 SSR-Routen-Smoke 18 Routen                                                       | PASS — Status, SSR-Root, ein Titel, i18n-Zustand im Kopf, Fallback-Delta `{}` × 15, keine Namespace-Preloads, 404 `noindex`                                    |
| 3 404/Redirect                                                                     | PASS — `/` 301 → `/de/`, `/diagnostics` 301, `/de/agb` → `/de/terms`, drei unbekannte Pfade 404                                                                |
| 4 Hydration-Smoke 9 Routen mobil                                                   | PASS — 0 Hydration-/Konsolenfehler, Root-Fallback nie sichtbar, `h1` = SSR-Text, 0 `en`-Requests, keine Doppel-Requests, danach alle 15 Namespaces der Sprache |
| 4b Namespaces vor der Hydration (Seitenuhr)                                        | PASS — genau die SSR-Namespaces (de, Musterbefund, pl desktop + mobil)                                                                                         |
| 5 Kern-Interaktionen                                                               | PASS — Suche (Treffer), clientseitige Navigation, Sprachumschalter → `/pl/`, Mobilmenue Escape + Fokus zurueck, Bestell-Modal                                  |
| 6 AP23 ohne Consent                                                                | PASS — 0 Provider-Requests ueber 6 Routen, Cookie-Banner sichtbar                                                                                              |
| 7 AP24 axe + Fokus (Startseite, Consumer D3/Duo, Musterbefund de/pl)               | PASS — serious/critical 0, erster Tabstopp mit sichtbarem Fokus                                                                                                |
| Gegenprobe: dieselbe Suite gegen den PT25.1-Build                                  | **rot** in Test 2 (Zustandsblock fehlt) — die Suite erkennt den alten Stand                                                                                    |
| Collector `e2e/pt25.1.spec.ts` gegen Endstand (Integritaet)                        | PASS mobil + desktop (HTTP-Wahrheit, SSR, 0 Provider, 0 Hydration-Fehler)                                                                                      |
| `npm run check:i18n` / `check:befunde` / `check:befunde-seo`                       | PASS / PASS (60/60) / PASS (60/60 SSR-Heads)                                                                                                                   |
| `tsc -p tsconfig.app.json` / `tsconfig.server.json`, eslint, Prettier              | sauber                                                                                                                                                         |

### 26.12 Uebergaben

**PT25.3 (Bilder, LCP, CLS)** — Write Set **unveraendert §23.2**. Zusaetzliche Evidenz aus PT25.2:

- PERF-B04 bestaetigt: das lazy LCP-Bild auf `/de/articles/die-gruene-praxis` ist der Grund, warum Lighthouse dort am empfindlichsten reagiert (Request-Prioritaet Low, Load Delay 71–245 ms im beobachteten Trace).
- PERF-B05 (Warm-Navigations-CLS) unveraendert vorhanden (Collector warm mobil: `igloo-pro` 0,176, `epigenetics-hub` 0,117, `consumer-duo` 0,290); PT25.2 hat ihn weder verursacht noch behoben.
- Kalt-CLS nach PT25.2 auf keiner Route > 0,05.

**PT25.4 (Fonts, CSS)** — neu: **latenter Schrift-Swap-Shift auf `/de/contact`** (CLS 0,161), sobald Inter nach dem ersten Paint eintrifft (reproduziert mit Namespace-Preloads, Runden 1–2). Voraussetzung, bevor Namespace-Preloads (`fetchpriority="low"`, ~−0,2 s Hydration zusaetzlich) erneut versucht werden.

**PT25.5 (Budgets)** — Artikel-Locale-Split (P2), `useSearch`-Namespaces (P2), `tailwind-merge` (P3), Vendor-Cache ueber Deploys (nur mit Messung), Lantern-Spannen statt Einzelwerte in Budgets.

**AP28** — Laufzeit `tsx server.ts`: kein Modul-`await` in dynamischen SSR-Chunks (§26.3).

### 26.13 Proven — Do Not Rediscover (PT25.2)

- Namespace-Preloads verschlechtern FCP/CLS unter den gemessenen Bedingungen; `react-dom/client` im Vendor-Chunk kostet unkomprimiert +284 bis +352 ms FCP.
- Fallback-Delta aller 9 Sprachen gegen `en` ist leer (0 fehlende Schluessel); `useSearch` erzwingt 12 Namespaces im SSR.
- Modul-`await` in SSR-Chunks unter `tsx` haengt.
- Server-TTFB verschraenkt unveraendert; Warm-up hebt die Kaltstart-Kosten der lazy Routen auf.
- Lighthouse-LCP ist fuer diese App ab kleinerem Entry bimodal; Gegenmessung in echtem Chrome noetig.

---

## 27. PT25.3 — Bilder und LCP-Medien (Delta)

> **Stand 2026-09-14.** Vorher = PT25.2-Endstand (`node_modules/.cache/pt25.2`), nachher = PT25.3 (`node_modules/.cache/pt25.3`).
> Inventar mit `scripts/perf/image-inventory.mjs` (17 Routen × 390 / 768 / 1440 px, ungedrosselt, ohne Scrollen), LCP/Bytes verschraenkt mit
> `scripts/perf/variant-compare.mjs` (gzip-Proxy, mobil gedrosselt und desktop). Alles LAB — kein Field, kein INP.

### 27.1 Gemessenes Bildinventar vorher

| Viewport | Route                                         | LCP-Element vorher (PT25.2)           | loading/fetchpriority vorher | Bilder geladen KB vorher | Befunde vorher                                                                                                                                                                                     |
| -------- | --------------------------------------------- | ------------------------------------- | ---------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 390      | /de/                                          | Igloo-pro-frontal.webp                | eager/high                   | 32                       | –                                                                                                                                                                                                  |
| 390      | /de/diagnostics                               | p (Text)                              | –                            | 32                       | eager unter Falz: Igloo-pro-frontal.webp (top 917)                                                                                                                                                 |
| 390      | /de/diagnostics/dental                        | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 390      | /de/igloo-pro                                 | Igloo-pro-frontal.webp                | eager/high                   | 32                       | –                                                                                                                                                                                                  |
| 390      | /de/epigenetics                               | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 390      | /de/epigenetics/grundlagen                    | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 390      | /de/epigenetics/musterbefund/metabolic-health | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 390      | /de/articles                                  | h2 (Text)                             | –                            | 194                      | –                                                                                                                                                                                                  |
| 390      | /de/articles/die-gruene-praxis                | green.webp                            | lazy/–                       | 52                       | lazy im Sichtbereich: green.webp                                                                                                                                                                   |
| 390      | /de/events                                    | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 390      | /de/downloads                                 | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 390      | /de/contact                                   | h2 (Text)                             | –                            | 14                       | –                                                                                                                                                                                                  |
| 390      | /de/about                                     | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 390      | /de/vitamin-d3-spray                          | p (Text)                              | –                            | 107                      | eager unter Falz: VITAMIND_D3_SPRAY.jpg (top 1414)                                                                                                                                                 |
| 390      | /de/consumer/vitamin-d3-spray                 | h1 (Text)                             | –                            | 133                      | eager unter Falz: spray-hero-12pack-office-1122w.webp (top 892)                                                                                                                                    |
| 390      | /de/consumer/inside-out-duo                   | h1 (Text)                             | –                            | 99                       | eager unter Falz: duo-hero-products-together-1122w.webp (top 847)                                                                                                                                  |
| 390      | /de/consumer/hydrating-masks                  | h1 (Text)                             | –                            | 71                       | –                                                                                                                                                                                                  |
| 768      | /de/                                          | Igloo-pro-frontal.webp                | eager/high                   | 32                       | –                                                                                                                                                                                                  |
| 768      | /de/diagnostics                               | Igloo-pro-frontal.webp                | eager/high                   | 32                       | –                                                                                                                                                                                                  |
| 768      | /de/diagnostics/dental                        | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 768      | /de/igloo-pro                                 | Igloo-pro-frontal.webp                | eager/high                   | 32                       | –                                                                                                                                                                                                  |
| 768      | /de/epigenetics                               | h1 (Text)                             | –                            | 14                       | –                                                                                                                                                                                                  |
| 768      | /de/epigenetics/grundlagen                    | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 768      | /de/epigenetics/musterbefund/metabolic-health | h1 (Text)                             | –                            | 14                       | –                                                                                                                                                                                                  |
| 768      | /de/articles                                  | green.webp                            | lazy/–                       | 194                      | lazy im Sichtbereich: green.webp; green.webp ×1,71; lazy im Sichtbereich: homeclinic.webp                                                                                                          |
| 768      | /de/articles/die-gruene-praxis                | green.webp                            | lazy/–                       | 52                       | lazy im Sichtbereich: green.webp                                                                                                                                                                   |
| 768      | /de/events                                    | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 768      | /de/downloads                                 | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 768      | /de/contact                                   | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 768      | /de/about                                     | h2 (Text)                             | –                            | 18                       | –                                                                                                                                                                                                  |
| 768      | /de/vitamin-d3-spray                          | p (Text)                              | –                            | 107                      | –                                                                                                                                                                                                  |
| 768      | /de/consumer/vitamin-d3-spray                 | spray-hero-12pack-office-1122w.webp   | eager/high                   | 133                      | –                                                                                                                                                                                                  |
| 768      | /de/consumer/inside-out-duo                   | duo-hero-products-together-1122w.webp | eager/high                   | 182                      | –                                                                                                                                                                                                  |
| 768      | /de/consumer/hydrating-masks                  | h1 (Text)                             | –                            | 71                       | –                                                                                                                                                                                                  |
| 1440     | /de/                                          | Igloo-pro-frontal.webp                | eager/high                   | 36                       | Bastian%20Foto.webp ×1,67                                                                                                                                                                          |
| 1440     | /de/diagnostics                               | Igloo-pro-frontal.webp                | eager/high                   | 32                       | Igloo-pro-frontal.webp ×1,67                                                                                                                                                                       |
| 1440     | /de/diagnostics/dental                        | h1 (Text)                             | –                            | 14                       | –                                                                                                                                                                                                  |
| 1440     | /de/igloo-pro                                 | Igloo-pro-frontal.webp                | eager/high                   | 32                       | –                                                                                                                                                                                                  |
| 1440     | /de/epigenetics                               | h1 (Text)                             | –                            | 14                       | –                                                                                                                                                                                                  |
| 1440     | /de/epigenetics/grundlagen                    | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 1440     | /de/epigenetics/musterbefund/metabolic-health | h1 (Text)                             | –                            | 14                       | –                                                                                                                                                                                                  |
| 1440     | /de/articles                                  | green.webp                            | lazy/–                       | 194                      | lazy im Sichtbereich: green.webp; green.webp ×3,19; lazy im Sichtbereich: homeclinic.webp; homeclinic.webp ×2,72; lazy im Sichtbereich: makemoney.webp; makemoney.webp ×2,72; Testbild1.webp ×2,72 |
| 1440     | /de/articles/die-gruene-praxis                | green.webp                            | lazy/–                       | 52                       | lazy im Sichtbereich: green.webp; green.webp ×1,85                                                                                                                                                 |
| 1440     | /de/events                                    | h2 (Text)                             | –                            | 14                       | –                                                                                                                                                                                                  |
| 1440     | /de/downloads                                 | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 1440     | /de/contact                                   | p (Text)                              | –                            | 14                       | –                                                                                                                                                                                                  |
| 1440     | /de/about                                     | h1 (Text)                             | –                            | 32                       | –                                                                                                                                                                                                  |
| 1440     | /de/vitamin-d3-spray                          | h1 (Text)                             | –                            | 107                      | VITAMIND_D3_SPRAY.jpg ×2,91                                                                                                                                                                        |
| 1440     | /de/consumer/vitamin-d3-spray                 | spray-hero-12pack-office-768w.webp    | eager/high                   | 105                      | –                                                                                                                                                                                                  |
| 1440     | /de/consumer/inside-out-duo                   | duo-hero-products-together-768w.webp  | eager/high                   | 146                      | –                                                                                                                                                                                                  |
| 1440     | /de/consumer/hydrating-masks                  | mask-hero-botanical-768w.webp         | eager/high                   | 49                       | –                                                                                                                                                                                                  |

**Quellbilder** (`sharp`): Artikelbilder `green` 1248×832 PNG → ausgeliefert 1200×800 WebP 38 KB; `homeclinic`/`makemoney`/`Testbild1` 1024×1024 PNG → WebP 45 / 66 / 31 KB;
Produktbild `VITAMIND_D3_SPRAY.jpg` 618×931 JPEG 93 KB; Igloo-Hero 650×650 WebP 18 KB; Consumer-Heros bereits responsiv (448/768/1122w WebP, AP21 PT21.7);
Epigenetik-Panels bereits `srcset` 640/1200w + lazy; Logo `polaris_white.webp` 400×118, 7 KB.

**Befunde vorher:**

- **PERF-B04 bestaetigt:** `green.webp` ist LCP auf `/de/articles/die-gruene-praxis` bei 390 / 768 / 1440 px und auf `/de/articles` bei 768 / 1440 px — jeweils **`loading="lazy"`**, ohne Vorrang.
- **PERF-B10 bestaetigt:** keine `srcset` fuer Artikelbilder; Uebergroesse bis ×3,19 (Artikelliste 1440 px), ×1,85 (Artikel 1440 px). Produktbild ×2,91 bei 1440 px.
- `VITAMIND_D3_SPRAY.jpg` bei 390 px eager unter dem Falz (top 1.414 px), 93 KB JPEG fuer 212 × 320 px.
- **PERF-B09 gemessen:** Diagnostics-Hero bei 390 px 117 px unter dem Falz mit `eager` + `fetchpriority="high"`, ab 768 px LCP; Consumer-Heros bei 390 px 48 px unter dem Falz, ab 768 px LCP.
- Footer-Logo ist „eager unter dem Falz", laedt aber dieselbe URL wie das Header-Logo (0 zusaetzliche Requests).
- Alle `<img>` mit `width`/`height`; CLS kalt 0,000 auf allen 51 Messungen.

### 27.2 Formate — datenbasiert

PSNR gegen die gleich skalierte Quelle (hoeher = naeher am Original), Bytes:

| Bild              | Breite | WebP q80        | AVIF q50        | AVIF q60        |
| ----------------- | ------ | --------------- | --------------- | --------------- |
| green             | 400w   | 11 KB / 36,5 dB | 7 KB / 36,6 dB  | 10 KB / 39,1 dB |
| green             | 800w   | 26 KB / 38,6 dB | 14 KB / 38,6 dB | 20 KB / 40,6 dB |
| green             | 1200w  | 42 KB / 39,8 dB | 20 KB / 39,6 dB | 30 KB / 41,2 dB |
| homeclinic        | 800w   | 35 KB / 39,3 dB | 18 KB / 39,0 dB | 26 KB / 40,9 dB |
| makemoney         | 800w   | 50 KB / 39,1 dB | 27 KB / 38,3 dB | 39 KB / 40,6 dB |
| Testbild1         | 800w   | 25 KB / 40,9 dB | 12 KB / 41,2 dB | 17 KB / 43,0 dB |
| VITAMIND_D3_SPRAY | 640w   | 30 KB / 41,2 dB | 14 KB / 40,0 dB | 21 KB / 42,1 dB |

**Entscheidung:** AVIF **q60** (20–30 % kleiner als WebP q80 **und** +1,5–2 dB PSNR), WebP als zweite `<source>`, das bisherige Einzelbild als `<img src>`.
Groesste WebP-Stufe = **unveraenderte Originaldatei** (eine Neukodierung war 5–6 % groesser; der Guard verbietet groessere Varianten). Browserpfad: AVIF → WebP → Original.
Build-/Deploykosten: 24 neue Dateien, einmalig generiert (`npm run build:article-images`), kein Laufzeit-Encoding.

### 27.3 Umgesetzt

| Delta        | Aenderung                                                                                                                                                                                                                                                     | Dateien                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pipeline     | Generator fuer AVIF q60 + WebP q80 in gemessenen Breiten (Artikel 400/800/1200 bzw. 1024, Produkt 320/618) und Guard (Existenz, Format, Breite, nicht groesser als bisher, AVIF ≤ WebP, Aktualitaet, Import, keine rohen `<img>` in den beruehrten Bauteilen) | `scripts/build-article-images.mjs`, `scripts/check-article-images.mjs`, `package.json`, 24 Bilddateien in `src/assets/`                                  |
| Komponente   | `ResponsivePicture`: `<picture class="contents">` mit AVIF/WebP-`srcset`+`sizes`, native `width`/`height`, `lazy` als Standard, `priority` = eager + `fetchpriority="high"` nur fuer das gemessene LCP-Bild                                                   | `src/components/ui/ResponsivePicture.tsx`, `src/assets/articleImages.ts`                                                                                 |
| **PERF-B04** | Artikel-Hero `priority` (LCP bei allen Viewports); Artikelliste: **nur** die erste Karte `priority`, alle weiteren lazy                                                                                                                                       | `src/pages/ArticlePage.tsx`, `src/pages/ArticlesIndexPage.tsx`                                                                                           |
| **PERF-B10** | responsive Quellen fuer Artikelbilder in Artikel, Artikelliste, Startseiten-Blog (`BlogCard`) und Diagnostics „verwandte Artikel"                                                                                                                             | zusaetzlich `src/components/ui/BlogCard.tsx`, `src/components/sections/BlogSection.tsx`, `src/components/sections/DiagnosticsRelatedArticlesSection.tsx` |
| Produktbild  | responsive AVIF/WebP, lazy, native Abmessungen 618×931 (vorher 380×500 im Markup), `h-80` statt `max-h-80` (feste Dimension → Reservierung; Darstellung unveraendert 212 × 320 px)                                                                            | `src/pages/VitaminD3SprayPage.tsx`                                                                                                                       |

**Nicht geaendert (gemessen begruendet):**

- **Diagnostics-Hero (B09):** verschraenkte Ablation mit/ohne `fetchpriority` (gzip, je 9 Laeufe) ohne messbaren Unterschied — mobil FCP/LCP 1.092 vs. 1.104 ms, desktop LCP 144 vs. 140 ms; React emittiert den Bild-Preload fuer das eager Bild in beiden Faellen. `eager` bleibt fuer das Desktop-LCP noetig.
- **Consumer-Heros (B09):** bereits responsiv; 48 px unter dem Falz bei 390 px, ab 768 px LCP → unveraendert.
- **Igloo-Startseiten-Hero:** 650 px Quelle wird bei 390 px × DPR 3 auf 1.026 Geraetepixel skaliert (×0,63). Hoeher aufgeloeste Varianten wuerden das LCP-Bild auf Mobil vergroessern — Qualitaetsdelta dokumentiert, nicht geaendert.
- **Logo (B11):** 7 KB, eine URL fuer Header und Footer — keine Aenderung.
- **OG/Social:** `public/og-*.jpg`, Befund-`src2x`, Igloo-OG und Artikel-Structured-Data verwenden unveraenderte Dateien und URLs (Test 7).

### 27.4 PERF-B05 aufgeloest: kein Bildproblem

Der Warm-Navigations-CLS (PT25.1 §8) wurde isoliert:

1. „Alle Bilder blockiert → 0/6" war ein **Messartefakt**: jede Request-Interception (`page.route`) verschiebt das Timing; ein Kontrolllauf mit Interception ohne Treffer ergab ebenfalls 0/6.
2. Ohne Interception zeigt die Frame-Zeitachse (`node_modules/.cache/pt25.3/b05-parse.mjs`): der erste Paint erfolgt bei `readyState: loading`, die Hero-Sektion ist dann 0 / 234 / 361 px hoch und `[data-home-hero-visual]` sowie der zweite Button sind **noch nicht geparst**; einen Frame spaeter 1.001 bzw. 1.187 px. Der unten verankerte Deko-Kreis (`-bottom-32` bzw. `bottom-0`) wandert mit → Shift 0,117–0,292.
3. Viewport-Hypothese widerlegt: `innerWidth` 412 und Media Queries in jedem Frame unveraendert.

Ursache: **Paint waehrend des HTML-Parsens bei warmem Cache** (CSS sofort verfuegbar) + **am unteren Sektionsrand verankerte Dekoration**. Owner **PT25.4** (CSS/Hero-Dekoration), nicht Bild.

### 27.5 Ergebnis nachher

**Inventar** (geaenderte Messungen; 17 Routen × 3 Viewports):

| Viewport | Route                          | LCP vorher → nachher                                | Bilder geladen KB vorher → nachher | CLS (bildbedingt) nachher |
| -------- | ------------------------------ | --------------------------------------------------- | ---------------------------------- | ------------------------- |
| 390      | /de/articles                   | h2 (Text) → h2 (Text)                               | 194 → 151                          | 0.000 (0.000)             |
| 390      | /de/articles/die-gruene-praxis | green.webp (lazy/–) → green-1200w.avif (eager/high) | 52 → 44                            | 0.000 (0.000)             |
| 390      | /de/vitamin-d3-spray           | p (Text) → p (Text)                                 | 107 → 36                           | 0.000 (0.000)             |
| 768      | /de/articles                   | green.webp (lazy/–) → green-800w.avif (eager/high)  | 194 → 116                          | 0.000 (0.000)             |
| 768      | /de/articles/die-gruene-praxis | green.webp (lazy/–) → green-1200w.avif (eager/high) | 52 → 44                            | 0.000 (0.000)             |
| 768      | /de/vitamin-d3-spray           | p (Text) → p (Text)                                 | 107 → 36                           | 0.000 (0.000)             |
| 1440     | /de/articles                   | green.webp (lazy/–) → green-400w.avif (eager/high)  | 194 → 64                           | 0.000 (0.000)             |
| 1440     | /de/articles/die-gruene-praxis | green.webp (lazy/–) → green-800w.avif (eager/high)  | 52 → 34                            | 0.000 (0.000)             |
| 1440     | /de/vitamin-d3-spray           | h1 (Text) → h1 (Text)                               | 107 → 23                           | 0.000 (0.000)             |

Unveraendert (LCP und Bildbytes gleich): 42 von 51 Messungen. Summe geladener Bildbytes ohne Scrollen: 2.698 → 2.187 KB. CLS kalt auf allen 51 Messungen: max 0.000.

**LCP und Bytes vorher → nachher** (echtes Chrome):

**Mobil 412×823, CDP 4× CPU / 150 ms / 1,6 Mbit/s** (verschraenkt, Median aus 7, gzip-Proxy; Load1 je Wiederholung 1.08 / 1.35 / 1.31 / 1.46 / 1.79 / 2.58 / 2.83)

| Variante       | Route                          | FCP ms | LCP ms | CLS   | Long Tasks Σ ms | Transfer KB |
| -------------- | ------------------------------ | ------ | ------ | ----- | --------------- | ----------- |
| vorher-pt25.2  | /de/articles/die-gruene-praxis | 1.056  | 1.620  | 0.003 | 371             | 431         |
| vorher-pt25.2  | /de/articles                   | 1.044  | 1.044  | 0.003 | 328             | 510         |
| vorher-pt25.2  | /de/vitamin-d3-spray           | 1.128  | 1.128  | 0.003 | 414             | 467         |
| vorher-pt25.2  | /de/                           | 1.128  | 1.128  | 0.003 | 390             | 375         |
| nachher-pt25.3 | /de/articles/die-gruene-praxis | 1.076  | 1.076  | 0.003 | 316             | 413         |
| nachher-pt25.3 | /de/articles                   | 1.088  | 1.088  | 0.003 | 318             | 447         |
| nachher-pt25.3 | /de/vitamin-d3-spray           | 1.116  | 1.116  | 0.003 | 455             | 397         |
| nachher-pt25.3 | /de/                           | 1.144  | 1.144  | 0.003 | 493             | 376         |

**Desktop 1350×940, ohne Drosselung** (verschraenkt, Median aus 7, gzip-Proxy; Load1 je Wiederholung 3.06 / 3.81 / 3.07 / 2.99 / 2.49 / 1.93 / 2.02)

| Variante       | Route                          | FCP ms | LCP ms | CLS   | Long Tasks Σ ms | Transfer KB |
| -------------- | ------------------------------ | ------ | ------ | ----- | --------------- | ----------- |
| vorher-pt25.2  | /de/articles/die-gruene-praxis | 136    | 160    | 0.000 | 123             | 431         |
| vorher-pt25.2  | /de/articles                   | 148    | 176    | 0.000 | 139             | 541         |
| vorher-pt25.2  | /de/vitamin-d3-spray           | 160    | 160    | 0.012 | 152             | 467         |
| vorher-pt25.2  | /de/                           | 192    | 192    | 0.000 | 50              | 380         |
| nachher-pt25.3 | /de/articles/die-gruene-praxis | 108    | 112    | 0.000 | 113             | 413         |
| nachher-pt25.3 | /de/articles                   | 132    | 132    | 0.000 | 114             | 412         |
| nachher-pt25.3 | /de/vitamin-d3-spray           | 160    | 160    | 0.012 | 141             | 384         |
| nachher-pt25.3 | /de/                           | 184    | 184    | 0.000 | 58              | 381         |

**Diagnostics-Hero mit/ohne fetchpriority — mobil** (verschraenkt, Median aus 9, gzip-Proxy; Load1 je Wiederholung 1.25 / 1.87 / 1.67 / 1.64 / 1.62 / 1.45 / 1.45 / 2.72 / 2.7)

| Variante                  | Route           | FCP ms | LCP ms | CLS   | Long Tasks Σ ms | Transfer KB |
| ------------------------- | --------------- | ------ | ------ | ----- | --------------- | ----------- |
| pt25.3-mit-fetchpriority  | /de/diagnostics | 1.092  | 1.092  | 0.003 | 344             | 381         |
| pt25.3-ohne-fetchpriority | /de/diagnostics | 1.104  | 1.104  | 0.003 | 354             | 381         |

**Diagnostics-Hero mit/ohne fetchpriority — desktop** (verschraenkt, Median aus 9, gzip-Proxy; Load1 je Wiederholung 2.36 / 2.17 / 2.14 / 1.96 / 1.81 / 1.66 / 2.01 / 1.93 / 1.77)

| Variante                  | Route           | FCP ms | LCP ms | CLS   | Long Tasks Σ ms | Transfer KB |
| ------------------------- | --------------- | ------ | ------ | ----- | --------------- | ----------- |
| pt25.3-mit-fetchpriority  | /de/diagnostics | 144    | 144    | 0.000 | 0               | 381         |
| pt25.3-ohne-fetchpriority | /de/diagnostics | 136    | 140    | 0.000 | 0               | 381         |

**Spray-Seite nach `h-80`-Korrektur — mobil gedrosselt, gzip** (verschraenkt, Median aus 7; Load1 je Wiederholung 2.81 / 2.62 / 2.45 / 2.46 / 2.46 / 2.62 / 2.52)

| Variante       | Route                | FCP ms | LCP ms | CLS Median (max) | Transfer KB |
| -------------- | -------------------- | ------ | ------ | ---------------- | ----------- |
| vorher-pt25.2  | /de/vitamin-d3-spray | 1.156  | 1.156  | 0.003 (0.004)    | 467         |
| nachher-pt25.3 | /de/vitamin-d3-spray | 1.100  | 1.100  | 0.003 (0.003)    | 397         |

**Spray-Seite nach `h-80`-Korrektur — desktop, gzip** (verschraenkt, Median aus 7; Load1 je Wiederholung 3.1 / 3.01 / 2.77 / 2.54 / 2.74 / 2.6 / 2.47)

| Variante       | Route                | FCP ms | LCP ms | CLS Median (max) | Transfer KB |
| -------------- | -------------------- | ------ | ------ | ---------------- | ----------- |
| vorher-pt25.2  | /de/vitamin-d3-spray | 180    | 180    | 0.000 (0.012)    | 467         |
| nachher-pt25.3 | /de/vitamin-d3-spray | 152    | 152    | 0.000 (0.000)    | 384         |

Zusammengefasst:

- **Artikel-Detail:** LCP mobil gedrosselt **1.620 → 1.076 ms** (jetzt = FCP), desktop **160 → 112 ms**; LCP-Bild ist AVIF, eager, `fetchpriority="high"`, genau ein Request.
- **Artikelliste:** desktop LCP **176 → 132 ms**; mobil ist LCP Text (1.044 → 1.088 ms, Rauschbereich).
- **Spray-Seite:** desktop CLS max **0,012 → 0,000**, LCP 180 → 152 ms; mobil LCP 1.156 → 1.100 ms.
- **Startseite:** LCP unveraendert (Igloo-Hero), Blog-Kartenbilder nach Scrollen 178 → 70–146 KB.
- **Bildbytes nach vollstaendigem Scrollen** (Test 9): Artikelliste 187 → 144 / 109 / 57 KB (390 / 768 / 1440), Artikel 45 → 37 / 37 / 27 KB, Spray 100 → 29 / 29 / 16 KB, Startseite 178 → 146 / 115 / 70 KB, Diagnostics 139 → 110 / 88 / 57 KB.
- **Ohne Scrollen**, alle 51 Messungen: 2.698 → 2.187 KB; kalter CLS max 0,000.

### 27.6 Visuelle Pruefung

- Test 6 vergleicht jedes geaenderte Bild (Artikelliste, Artikel, Spray; 390 und 1440 px) pixelweise vorher/nachher: **37,5–47,6 dB PSNR**, Groessenabweichung ≤ 1 px (natuerliches Seitenverhaeltnis der 800w-Variante).
- Screenshots unter `test-results/pt25.3-visual/`. Manuell gesichtet: Artikel-Hero 1440 px, Produktbild 390 px (Kleinschrift auf der Verpackung lesbar wie zuvor), Artikelkarte 390 px — **kein sichtbarer Qualitaetsverlust**.
- Keine diagnostischen Visuals komprimiert: Befund-Panels, Musterbefund-Charts und Consumer-Produktbilder sind unveraendert.

### 27.7 Tests (fokussiert, kein Closure-Lauf)

| Pruefung                                                                                                                                                     | Ergebnis                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `npm run check:article-images` (Existenz, Format, Breite, ≤ bisher ausgeliefert, AVIF ≤ WebP, Aktualitaet, Import, keine rohen `<img>` in 5 Bauteilen)       | **PASS** (28 Kandidaten)                         |
| `npm run check:consumer-images`                                                                                                                              | PASS (unveraendert)                              |
| `e2e/pt25.3.spec.ts` gegen PT25.2 (vorher) und PT25.3 (nachher) gleichzeitig                                                                                 | **9/9 PASS**                                     |
| 1 DOM: AVIF/WebP-Quellen, ≥ 2 Kandidaten, `sizes`, `width`/`height`, `alt`                                                                                   | PASS                                             |
| 2 LCP Artikel (390/768/1440) + Artikelliste (768/1440): Bild, AVIF, eager, `high`, genau ein Request, startet vor anderen Bildern, genau ein `high` je Seite | PASS                                             |
| 3 kein eager unter dem Falz (Ausnahmen nur: gleiche URL bereits sichtbar, gemessene LCP-Kandidaten groesserer Viewports)                                     | PASS                                             |
| 4 Responsive-Kandidat passend zu CSS-Breite × DPR bei 390/768/1440                                                                                           | PASS                                             |
| 5 bildbedingter CLS kalt + nach Scrollen = 0                                                                                                                 | PASS (fand zuvor den 0-×-0-Fall der Spray-Seite) |
| 6 visuell PSNR ≥ 30 dB                                                                                                                                       | PASS (37,5–47,6 dB)                              |
| 7 OG/Twitter/JSON-LD-Bilder vorher = nachher, Ziele 200 (inkl. Consumer D3, Musterbefund)                                                                    | PASS                                             |
| 8 axe serious/critical = 0, `alt`-Texte vorher = nachher                                                                                                     | PASS                                             |
| 9 Bildbytes nachher ≤ vorher (390/768/1440, 5 Seiten)                                                                                                        | PASS                                             |
| `e2e/pt25.2.spec.ts` gegen den PT25.3-Build (SSR, 404/Redirects, Hydration, Interaktionen, AP23 ohne Consent, AP24 axe/Fokus)                                | **8/8 PASS**                                     |
| `tsc` app/server, eslint, Prettier                                                                                                                           | sauber                                           |

### 27.8 Uebergaben

**PT25.4 (Fonts, CSS) — Primary Write Set** (§23.3, erweitert um die zwei gemessenen CLS-Befunde):

| Datei                                                                                                                  | Zweck                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `server.ts` — nur `getFontPreloadTag()`                                                                                | sprachabhaengiger Subset-Preload (PERF-B08)                                                                                                            |
| `src/entry-client.tsx` — nur Font-Import                                                                               | Subset-Auswahl (B08)                                                                                                                                   |
| `src/index.css`                                                                                                        | `@font-face`/Fallback-Metriken — **Schrift-Swap-Shift `/de/contact` (CLS 0,161, §26.2)**, CSS-Anteil (B07); Fokusnetz und Reduced-Motion-Block bleiben |
| `tailwind.config.js`, `postcss.config.js`                                                                              | CSS-Ausgabe (B07)                                                                                                                                      |
| `index.html`                                                                                                           | nur Preload-/Stylesheet-Reihenfolge (B07)                                                                                                              |
| `src/components/sections/HeroSection.tsx`, `src/pages/EpigeneticsPage.tsx` — **nur** die dekorativen Hintergrundkreise | **PERF-B05**: Verankerung am unteren Sektionsrand verschiebt sich beim Paint waehrend des Parsens (§27.4); visuelle Aenderung → AP27-Hinweis           |
| `package.json`                                                                                                         | nur falls ein anderes Font-Paket noetig ist                                                                                                            |
| `src/components/layout/Header.tsx` — nur Schleier-Klassen                                                              | nur mit Trace-Beleg (B15)                                                                                                                              |

**OPEN FONT/CSS DELTA:** B07 (92 KB CSS render-blockierend), B08 (latin-ext ohne Preload fuer pl/cs …), B15 (Schleier-`backdrop-filter` ungemessen), Schrift-Swap-Shift `/de/contact`, B05 Hero-Dekoration, Option Namespace-Preload `low` erst nach Schrift-Fix.

**AP27:** keine sichtbare Aenderung aus PT25.3 (PSNR ≥ 37,5 dB, Groessen ±1 px).

### 27.9 Proven — Do Not Rediscover (PT25.3)

- LCP-Bilder je Route/Viewport (Tabellen 27.1/27.5); nur Artikel-Hero und erste Artikelkarte sind neue Vorrang-Bilder.
- AVIF q60 < WebP q80 bei hoeherer PSNR fuer diese Motive; groesste WebP-Stufe = Original.
- `fetchpriority` am Diagnostics-Hero messbar wirkungslos (React preloadet das eager Bild ohnehin).
- B05 ist kein Bild-, sondern ein Parse-Paint-/Dekorationsproblem; `page.route`-Interception verfaelscht Timing-Diagnosen.
- `w-auto` + `height: auto` reserviert trotz `width`/`height` nichts → feste Dimension noetig.

## 28. PT25.4 — Fonts und CSS (Delta)

> **Stand 2026-09-14.** Vorher = PT25.3-Build (`node_modules/.cache/pt25.3`), nachher = PT25.4 (`node_modules/.cache/pt25.4`).
> Werkzeuge: `scripts/perf/font-css-inventory.mjs` (Font-Requests, Fallback-Status, CLS normal und mit 2 s verzoegerter Schrift, CSS-Coverage),
> `node_modules/.cache/pt25.4/metrics-probe.mjs` (Canvas-Metriken), `scripts/perf/variant-compare.mjs` (verschraenkt, jetzt mit `serverScript` und
> Wiederholungsansicht `PERF_REPEAT=1`), `scripts/perf/cls-warm-repro.mjs`. Alles LAB bzw. LAB hinter gzip-Proxy — kein Field, kein INP.
>
> **Messhygiene:** `server.ts` ist Laufzeitcode und gilt fuer jeden Build. Ein erster Endlauf verglich deshalb faelschlich „PT25.3-Build mit
> neuem server.ts" (CSS bereits inline) mit PT25.4 — Test 3 hat das aufgedeckt, der Lauf wurde verworfen. Alle Vorher-Werte in diesem
> Abschnitt stammen vom PT25.3-Build mit der Messkopie `node_modules/.cache/pt25.4/server-vorher.ts` (server.ts ohne CSS-Inlining).

### 28.1 Font-Pfad vorher (gemessen)

| Viewport | Route                                         | Modus        | FCP ms | Fonts fertig ms | CLS    | Font-Requests (Start–Ende ms)                             | Fallback-Face | CSS genutzt / gesamt KB |
| -------- | --------------------------------------------- | ------------ | ------ | --------------- | ------ | --------------------------------------------------------- | ------------- | ----------------------- |
| 390      | /de/                                          | normal       | 208    | 201             | 0.0000 | latin-wght-normal 50–147                                  | error         | 18 / 92                 |
| 390      | /de/                                          | Schrift +2 s | 220    | 2.081           | 0.0000 | latin-wght-normal 47–2059                                 | error         | –                       |
| 390      | /de/contact                                   | normal       | 140    | 143             | 0.0000 | latin-wght-normal 32–48                                   | unloaded      | 15 / 92                 |
| 390      | /de/contact                                   | Schrift +2 s | 180    | 2.060           | 0.0005 | latin-wght-normal 26–2035                                 | error         | –                       |
| 390      | /de/diagnostics                               | normal       | 152    | 146             | 0.0000 | latin-wght-normal 52–69                                   | unloaded      | 16 / 92                 |
| 390      | /de/diagnostics                               | Schrift +2 s | 212    | 2.081           | 0.0390 | latin-wght-normal 44–2054                                 | error         | –                       |
| 390      | /de/epigenetics                               | normal       | 184    | 175             | 0.0000 | latin-wght-normal 68–81                                   | error         | 19 / 92                 |
| 390      | /de/epigenetics                               | Schrift +2 s | 228    | 2.134           | 0.0000 | latin-wght-normal 71–2085                                 | error         | –                       |
| 390      | /de/epigenetics/musterbefund/metabolic-health | normal       | 144    | 235             | 0.0000 | latin-wght-normal 54–68, greek-wght-normal 141–200        | error         | 17 / 92                 |
| 390      | /de/epigenetics/musterbefund/metabolic-health | Schrift +2 s | 248    | 2.271           | 0.0129 | latin-wght-normal 57–2066, greek-wght-normal 234–2242     | error         | –                       |
| 390      | /de/articles/die-gruene-praxis                | normal       | 104    | 105             | 0.0000 | latin-wght-normal 40–57                                   | error         | 14 / 92                 |
| 390      | /de/articles/die-gruene-praxis                | Schrift +2 s | 212    | 2.074           | 0.1021 | latin-wght-normal 43–2054                                 | error         | –                       |
| 390      | /pl/                                          | normal       | 168    | 248             | 0.0000 | latin-wght-normal 53–73, latin-ext-wght-normal 145–160    | error         | 18 / 92                 |
| 390      | /pl/                                          | Schrift +2 s | 228    | 2.257           | 0.0000 | latin-wght-normal 44–2052, latin-ext-wght-normal 211–2222 | error         | –                       |
| 390      | /cs/consumer/inside-out-duo                   | normal       | 168    | 201             | 0.0000 | latin-wght-normal 50–65, latin-ext-wght-normal 131–181    | error         | 16 / 92                 |
| 390      | /cs/consumer/inside-out-duo                   | Schrift +2 s | 220    | 2.178           | 0.0571 | latin-wght-normal 30–2039, latin-ext-wght-normal 149–2159 | error         | –                       |
| 1440     | /de/                                          | normal       | 168    | 147             | 0.0000 | latin-wght-normal 40–64                                   | error         | 21 / 92                 |
| 1440     | /de/                                          | Schrift +2 s | 252    | 2.074           | 0.0591 | latin-wght-normal 41–2055                                 | error         | –                       |
| 1440     | /de/contact                                   | normal       | 156    | 140             | 0.0000 | latin-wght-normal 34–45                                   | unloaded      | 18 / 92                 |
| 1440     | /de/contact                                   | Schrift +2 s | 212    | 2.062           | 0.0818 | latin-wght-normal 29–2040                                 | error         | –                       |
| 1440     | /de/diagnostics                               | normal       | 132    | 122             | 0.0000 | latin-wght-normal 41–56                                   | unloaded      | 19 / 92                 |
| 1440     | /de/diagnostics                               | Schrift +2 s | 400    | 2.069           | 0.2123 | latin-wght-normal 41–2050                                 | error         | –                       |
| 1440     | /de/epigenetics                               | normal       | 236    | 175             | 0.0000 | latin-wght-normal 51–68                                   | error         | 23 / 92                 |
| 1440     | /de/epigenetics                               | Schrift +2 s | 272    | 2.097           | 0.0587 | latin-wght-normal 50–2059                                 | error         | –                       |
| 1440     | /de/epigenetics/musterbefund/metabolic-health | normal       | 184    | 270             | 0.0000 | latin-wght-normal 52–68, greek-wght-normal 162–240        | error         | 21 / 92                 |
| 1440     | /de/epigenetics/musterbefund/metabolic-health | Schrift +2 s | 268    | 2.265           | 0.0667 | latin-wght-normal 39–2049, greek-wght-normal 207–2216     | error         | –                       |
| 1440     | /de/articles/die-gruene-praxis                | normal       | 124    | 115             | 0.0000 | latin-wght-normal 31–55                                   | error         | 16 / 92                 |
| 1440     | /de/articles/die-gruene-praxis                | Schrift +2 s | 228    | 2.064           | 0.1752 | latin-wght-normal 25–2034                                 | error         | –                       |
| 1440     | /pl/                                          | normal       | 164    | 209             | 0.0000 | latin-wght-normal 36–50, latin-ext-wght-normal 131–185    | error         | 21 / 92                 |
| 1440     | /pl/                                          | Schrift +2 s | 256    | 2.246           | 0.0006 | latin-wght-normal 48–2057, latin-ext-wght-normal 220–2230 | error         | –                       |
| 1440     | /cs/consumer/inside-out-duo                   | normal       | 184    | 167             | 0.0000 | latin-wght-normal 30–41, latin-ext-wght-normal 126–139    | error         | 17 / 92                 |
| 1440     | /cs/consumer/inside-out-duo                   | Schrift +2 s | 356    | 2.172           | 0.0822 | latin-wght-normal 37–2046, latin-ext-wght-normal 148–2163 | error         | –                       |

- **Dateien:** `@fontsource-variable/inter` 5.2.8, eine Familie `Inter Variable`, Achse `wght 100–900`, nur `normal` (keine Italic), 7 Unicode-Subsets. Alle mit `font-display: swap`.
- **Tatsaechlich geladen:** de/en-Routen **1 Datei** (`latin`, 47 KB); `/pl/` und `/cs/…` zusaetzlich `latin-ext` (83 KB); Musterbefund zusaetzlich `greek` (18,6 KB) — ausgeloest von „α" und „κ" (TNF-α, NF-κB) in allen zehn Sprachfassungen.
- **Keine externen Fontquellen**, keine doppelten Requests, **ein** Preload (`latin`, von `server.ts`), der genutzt wird.
- **Fallback-Face defekt:** `@font-face 'Inter Fallback'` nannte nur `local('Arial')` → auf dem Messrechner (Linux, Liberation Sans) Status **`error`**; Chromium loest `local()` nicht ueber fontconfig-Aliase auf. Die Metrik-Overrides waren wirkungslos, der Text fiel auf `system-ui` (hier DejaVu Sans, auf Android Roboto).
- **Swap-Zeitpunkt real:** mobil gedrosselt hinter gzip endet `latin` **165–308 ms nach FCP** auf jeder gemessenen Route — der Swap nach dem ersten Paint ist der Normalfall, nicht der Ausnahmefall.
- **Font-Swap-CLS** (Schrift um 2 s verzoegert, ungedrosselt): bis **0,212** (Diagnostics 1440), 0,175 (Artikel 1440), 0,102 (Artikel 390), 0,082 (Kontakt 1440); Summe ueber 16 Messungen **0,948**. Ohne Verzoegerung 0.

### 28.2 Fallback-Metriken — gemessen, nicht geschaetzt

Canvas-Messung in Chromium, `measureText` bei 100 px, Inter Variable (geladen) gegen **Liberation Sans** (metrisch identisch zu Arial):

| Gewicht | Laufweite Inter / Liberation Sans (de, en, pl, cs, Versalien, Ziffern → Mittel)         |
| ------- | --------------------------------------------------------------------------------------- |
| 400     | 106,72 / 107,73 / 107,20 / 106,36 / 99,29 / 104,37 → **105,28 %**                       |
| 500     | 108,24 / 109,27 / 108,74 / 107,83 / 99,98 / 105,35 → **106,57 %**                       |
| 600     | 101,55 / 101,23 / 101,26 / 100,94 / 98,85 / 104,33 → **101,36 %** (echter Bold-Schnitt) |

Inter: ascent 0,97 em, descent 0,24 em, line-gap 0. Overrides = Inter-Wert / size-adjust.

Kandidaten, jeweils per Build-Plugin gebaut (ausgelieferte Quelle unberuehrt).

**Runde 1–3 (Headless-Shell, `font-css-inventory.mjs`, Schrift +2 s, 8 Routen × 390/1440):** A = ein Face 105,28 %, B = Normal 105,92 % + Fett 101,36 %, B2 = Normal 106,57 % + Fett 101,36 %.

| Viewport  | Route                                         | Basis (Arial-Face, Status error) | A      | B      | B2     |
| --------- | --------------------------------------------- | -------------------------------- | ------ | ------ | ------ |
| 390       | /de/                                          | 0.0000                           | 0.0001 | 0.0001 | 0.0001 |
| 390       | /de/contact                                   | 0.0005                           | 0.0003 | 0.0003 | 0.0003 |
| 390       | /de/diagnostics                               | 0.0390                           | 0.0136 | 0.0001 | 0.0001 |
| 390       | /de/epigenetics                               | 0.0000                           | 0.0001 | 0.0001 | 0.0001 |
| 390       | /de/epigenetics/musterbefund/metabolic-health | 0.0129                           | 0.0123 | 0.0001 | 0.0001 |
| 390       | /de/articles/die-gruene-praxis                | 0.1021                           | 0.0002 | 0.0002 | 0.0002 |
| 390       | /pl/                                          | 0.0000                           | 0.0285 | 0.0000 | 0.0000 |
| 390       | /cs/consumer/inside-out-duo                   | 0.0571                           | 0.0136 | 0.0137 | 0.0137 |
| 1440      | /de/                                          | 0.0591                           | 0.0007 | 0.0007 | 0.0007 |
| 1440      | /de/contact                                   | 0.0818                           | 0.0006 | 0.0006 | 0.0006 |
| 1440      | /de/diagnostics                               | 0.2123                           | 0.0006 | 0.0006 | 0.0006 |
| 1440      | /de/epigenetics                               | 0.0587                           | 0.0009 | 0.0009 | 0.0009 |
| 1440      | /de/epigenetics/musterbefund/metabolic-health | 0.0667                           | 0.0054 | 0.0049 | 0.0049 |
| 1440      | /de/articles/die-gruene-praxis                | 0.1752                           | 0.0102 | 0.0102 | 0.0068 |
| 1440      | /pl/                                          | 0.0006                           | 0.0546 | 0.0546 | 0.0546 |
| 1440      | /cs/consumer/inside-out-duo                   | 0.0822                           | 0.0003 | 0.0003 | 0.0003 |
| **Summe** | 16 Messungen                                  | **0.9482**                       | 0.1420 | 0.0874 | 0.0840 |

**Runde 5 (Browsermodus der Suite, `channel: 'chromium'`, Schrift +2 s, Test-5-Matrix 7 Routen × 390/1440)** — mit dem fairen Vorher-Zustand fuer
Arial-Plattformen (Windows/macOS/iOS): OLDEXACT = exakt das bisherige Face (107,12 / 90,2 / 22,48 %, ein Face, Fett synthetisch), nur mit auf dem
Messrechner aufloesbaren Arial-metrischen Quellen.

| Viewport  | Route                                         | vorher-Labor | vorher-Arial-Plattform (OLDEXACT) | B2 (106,57 %) | B3 (107,12 % + Fett gemessen) |
| --------- | --------------------------------------------- | ------------ | --------------------------------- | ------------- | ----------------------------- |
| 390       | /de/                                          | 0.0000       | 0.0000                            | 0.0000        | 0.0000                        |
| 390       | /de/contact                                   | 0.0004       | 0.0000                            | 0.0000        | 0.0000                        |
| 390       | /de/diagnostics                               | 0.0000       | 0.0000                            | 0.0119        | 0.0000                        |
| 390       | /de/articles/die-gruene-praxis                | 0.1015       | 0.0000                            | 0.0000        | 0.0000                        |
| 390       | /de/epigenetics/musterbefund/metabolic-health | 0.0127       | 0.0118                            | 0.0000        | 0.0000                        |
| 390       | /pl/                                          | 0.0000       | 0.0000                            | 0.0000        | 0.0000                        |
| 390       | /cs/consumer/inside-out-duo                   | 0.0705       | 0.0001                            | 0.0001        | 0.0002                        |
| 1440      | /de/                                          | 0.0591       | 0.0001                            | 0.0001        | 0.0001                        |
| 1440      | /de/contact                                   | 0.0817       | 0.0001                            | 0.0001        | 0.0001                        |
| 1440      | /de/diagnostics                               | 0.2121       | 0.0000                            | 0.0001        | 0.0000                        |
| 1440      | /de/articles/die-gruene-praxis                | 0.1288       | 0.0059                            | 0.0059        | 0.0059                        |
| 1440      | /de/epigenetics/musterbefund/metabolic-health | 0.0658       | 0.0043                            | 0.0004        | 0.0003                        |
| 1440      | /pl/                                          | 0.0006       | 0.0000                            | 0.0001        | 0.0000                        |
| 1440      | /cs/consumer/inside-out-duo                   | 0.0819       | 0.0000                            | 0.0000        | 0.0000                        |
| **Summe** | 14 Messungen                                  | **0.8152**   | **0.0224**                        | **0.0187**    | **0.0067**                    |

**Erkenntnis:** Die Canvas-Mittelwerte minimieren nicht den Layout-CLS; etwas breitere Normal-Laufweite (107,12 %) trifft die Zeilenumbrueche realer
Texte besser (z. B. Diagnostics-Lead bei 390 px: B2 bricht nach dem Swap eine Zeile mehr um, CTA-Gruppe +28 px). Das Fett-Face ist der messbare Gewinn
gegenueber dem bisherigen Zustand (Musterbefund 390: synthetisches Fett 0,0118 → 0).

**Ausgeliefert: B3** — Normal-Face `font-weight 100 549`, size-adjust **107,12 %** (bisheriger Wert, per Layout-CLS bestaetigt), ascent **90,55 %** /
descent **22,4 %** (aus gemessenen Inter-Metriken 0,97 / 0,24 em abgeleitet); Fett-Face `550 900`, **101,36 %** / 95,7 % / 23,68 % (gemessen);
Quellen `local()` Arial / ArialMT / Liberation Sans / Arimo bzw. deren Bold-Schnitte.

| Font-Swap-CLS (Schrift +2 s), Summe ueber die Test-Matrix                  | vorher | nachher (B3)       |
| -------------------------------------------------------------------------- | ------ | ------------------ |
| Linux/ChromeOS und Laborrechner (Arial fehlt, Fallback bisher wirkungslos) | 0,8152 | **0,0067** (−99 %) |
| Arial-Plattformen (Windows/macOS/iOS, bisheriges Face griff)               | 0,0224 | **0,0067** (−70 %) |

B3 liegt auf **jeder** Route auf oder unter beiden Vorher-Zustaenden. Ohne Verzoegerung bleibt CLS ueberall 0.

**Messmodus-Hinweis:** Headless-Shell und `channel: 'chromium'` loesen System-/`local()`-Schriften unterschiedlich auf (gleiche Route, andere
Fallback-Umbrueche). Der Suite-Modus ist naeher an echtem Chrome und massgeblich; die Headless-Shell-Runden 1–3 dienten der Vorauswahl. Der dort
beobachtete `/pl/`-Desktop-Shift (Hauptnavigation bricht mit Inter auf drei Zeilen um, 44 → 120 px) tritt im Suite-Modus mit B3 nicht auf (0,0000),
zeigt aber, dass die polnische Navigation an der Umbruchgrenze liegt → Hinweis AP27 (Header-Layout lange Locales, Bezug `D-20`).

**Android:** keine der `local()`-Quellen vorhanden → dort weiter `system-ui` (Roboto) ohne Metrik-Anpassung; Roboto ist auf dem Messrechner nicht
installiert und wurde **nicht** geschaetzt. Offen fuer PT25.5/AP27 mit Geraetemessung.

### 28.3 Verworfen: `latin-ext`-Preload fuer pl/cs (PERF-B08)

| Viewport | Route                                         | Modus        | B CLS  | B + latin-ext-Preload CLS | latin-ext Start ohne → mit Preload (ms) |
| -------- | --------------------------------------------- | ------------ | ------ | ------------------------- | --------------------------------------- |
| 390      | /pl/                                          | normal       | 0.0000 | 0.0000                    | 162 → 57                                |
| 390      | /pl/                                          | Schrift +2 s | 0.0000 | 0.0000                    | 234 → 34                                |
| 390      | /cs/consumer/inside-out-duo                   | normal       | 0.0000 | 0.0000                    | 120 → 37                                |
| 390      | /cs/consumer/inside-out-duo                   | Schrift +2 s | 0.0137 | 0.0137                    | 140 → 30                                |
| 390      | /pl/epigenetics/musterbefund/metabolic-health | normal       | 0.0000 | 0.0000                    | 169 → 57                                |
| 390      | /pl/epigenetics/musterbefund/metabolic-health | Schrift +2 s | 0.0086 | 0.0086                    | 236 → 57                                |
| 1440     | /pl/                                          | normal       | 0.0000 | 0.0000                    | 155 → 42                                |
| 1440     | /pl/                                          | Schrift +2 s | 0.0546 | 0.0546                    | 244 → 47                                |
| 1440     | /cs/consumer/inside-out-duo                   | normal       | 0.0000 | 0.0000                    | 138 → 30                                |
| 1440     | /cs/consumer/inside-out-duo                   | Schrift +2 s | 0.0003 | 0.0003                    | 177 → 38                                |
| 1440     | /pl/epigenetics/musterbefund/metabolic-health | normal       | 0.0000 | 0.0000                    | 186 → 55                                |
| 1440     | /pl/epigenetics/musterbefund/metabolic-health | Schrift +2 s | 0.0640 | 0.0640                    | 239 → 53                                |

Der Preload startet `latin-ext` zeitgleich mit `latin`, der Swap-CLS bleibt **identisch** (z. B. `/pl/` 1440: 0,0546 / 0,0546); dazu kaeme ein 83-KB-Download in Konkurrenz zum kritischen Pfad. → **kein Preload**, genau ein Font-Preload (`latin`) bleibt.

### 28.4 CSS — gemessen

- **Groesse:** ein Stylesheet, **92,2 KB roh / 16,5 KB gzip / 13,2 KB brotli** (PT25.4: +380 B roh durch das zweite Fallback-Face).
- **Zusammensetzung** (Build-Ausgabe, Top-Level-Regeln): Utilities 46,5 KB (743 Regeln) · Zustands-/Responsive-Varianten 13,6 KB · Arbitrary Values 6,8 KB · Preflight/Basis 5,1 KB · `@media (min-width:1024px)` 5,0 KB · Komponenten (`@apply`) 3,5 KB · `@font-face` 2,1 KB · Reduced-Motion-Block 2,0 KB · Print 1,5 KB · Fokus-Sicherheitsnetz 0,7 KB.
- **Coverage je Route** (Chromium CSS-Coverage beim Laden): **14–23 KB genutzt von 92 KB**. Tailwind purged bereits gegen `index.html` + `src/**/*.{js,ts,jsx,tsx}`; die „ungenutzten" Regeln sind Klassen anderer Routen und Zustaende (Hover, Menues, Dialoge) — Coverage beim Laden ist fuer Loeschentscheidungen nicht belastbar.
- **Handgeschriebene Klassen ohne Verwendung:** `cta-block`, `glass-panel-dark`, `info-box` (Legacy, zusammen < 1 KB gzip) sowie `t-h4`, `t-h5`, `t-link` (Typografie-Rollen des Designsystems). **Nicht entfernt:** Byte-Impact vernachlaessigbar, Designsystem-Semantik bleibt (harte Regel).
- **Kritischer Pfad** (mobil gedrosselt, gzip): HTML fertig ~220 ms, CSS **185 → 770–814 ms** (eigene Rundreise), FCP 1.028–1.144 ms, also 279–357 ms nach CSS-Ende (Style/Layout auf 4× CPU).

### 28.5 B05 geloest: Render-Marke (`rel="expect"`)

PT25.3 §27.4 hatte den Warm-Navigations-CLS als Paint waehrend des HTML-Parsens + unten verankerte Hero-Dekoration identifiziert.
`index.html` haelt jetzt mit `<link rel="expect" href="#polaris-render-ready" blocking="render">` den ersten Paint zurueck, bis der Parser die
Marke `<div id="polaris-render-ready" hidden>` hinter `#root` erreicht. Keine Designaenderung, keine Hydrationsauswirkung (Marke ausserhalb von
`#root`), nicht im Accessibility-Baum; Browser ohne `rel="expect"` ignorieren beides.

**Wiederholungsaufruf** (`scripts/perf/cls-warm-repro.mjs`, mobil gedrosselt, je Route 3 Laeufe; vorher = PT25.3-Build mit Vorher-Server):

| Stand            | Route           | Lauf | CLS kalt | CLS Wiederholungsaufruf |
| ---------------- | --------------- | ---- | -------- | ----------------------- |
| vorher (PT25.3)  | /de/            | #1   | 0.000    | 0.231                   |
| vorher (PT25.3)  | /de/            | #2   | 0.000    | 0.231                   |
| vorher (PT25.3)  | /de/            | #3   | 0.000    | 0.231                   |
| vorher (PT25.3)  | /de/epigenetics | #1   | 0.000    | 0.292                   |
| vorher (PT25.3)  | /de/epigenetics | #2   | 0.000    | 0.292                   |
| vorher (PT25.3)  | /de/epigenetics | #3   | 0.000    | 0.420                   |
| nachher (PT25.4) | /de/            | #1   | 0.000    | 0.000                   |
| nachher (PT25.4) | /de/            | #2   | 0.000    | 0.000                   |
| nachher (PT25.4) | /de/            | #3   | 0.000    | 0.000                   |
| nachher (PT25.4) | /de/epigenetics | #1   | 0.000    | 0.000                   |
| nachher (PT25.4) | /de/epigenetics | #2   | 0.000    | 0.000                   |
| nachher (PT25.4) | /de/epigenetics | #3   | 0.000    | 0.000                   |

Vorher springt der Hero bei **6/6** Wiederholungsaufrufen (CLS 0,231–0,420), nachher bei **0/6**. PT25.4-Test 7 bestaetigt im Suite-Modus
0,0033–0,0045 (Schwelle 0,05).

### 28.6 CSS inline im Kopf — gemessen entschieden

**Varianten** (verschraenkt, gzip-Proxy, echte Chromium-Paints):

**Runde 1 — mobil gedrosselt, gzip: Basis, Fallback A/B, render-expect, CSS inline (ohne Fallback-Fix)** (verschraenkt, Median aus 7; Load1 je Wiederholung 2.65 / 2.76 / 1.72 / 2.82 / 1.95 / 1.46 / 1.55)

| Variante      | Route                          | FCP ms | LCP ms | CLS Median (max) | Long Tasks Σ ms | Transfer KB |
| ------------- | ------------------------------ | ------ | ------ | ---------------- | --------------- | ----------- |
| basis-pt25.3  | /de/                           | 1.140  | 1.140  | 0.003 (0.003)    | 414             | 376         |
| basis-pt25.3  | /de/contact                    | 1.060  | 1.060  | 0.003 (0.004)    | 340             | 368         |
| basis-pt25.3  | /de/articles/die-gruene-praxis | 1.076  | 1.076  | 0.003 (0.003)    | 408             | 413         |
| basis-pt25.3  | /pl/                           | 1.188  | 1.188  | 0.003 (0.003)    | 526             | 463         |
| fallback-A    | /de/                           | 1.124  | 1.124  | 0.003 (0.004)    | 417             | 376         |
| fallback-A    | /de/contact                    | 1.112  | 1.112  | 0.003 (0.004)    | 398             | 369         |
| fallback-A    | /de/articles/die-gruene-praxis | 1.068  | 1.108  | 0.003 (0.004)    | 365             | 414         |
| fallback-A    | /pl/                           | 1.140  | 1.140  | 0.003 (0.004)    | 480             | 463         |
| fallback-B    | /de/                           | 1.184  | 1.184  | 0.003 (0.004)    | 477             | 376         |
| fallback-B    | /de/contact                    | 1.064  | 1.064  | 0.003 (0.004)    | 331             | 369         |
| fallback-B    | /de/articles/die-gruene-praxis | 1.060  | 1.116  | 0.003 (0.003)    | 392             | 414         |
| fallback-B    | /pl/                           | 1.200  | 1.200  | 0.003 (0.004)    | 509             | 463         |
| render-expect | /de/                           | 1.148  | 1.148  | 0.003 (0.004)    | 425             | 376         |
| render-expect | /de/contact                    | 1.060  | 1.060  | 0.003 (0.004)    | 357             | 369         |
| render-expect | /de/articles/die-gruene-praxis | 1.088  | 1.088  | 0.003 (0.003)    | 348             | 414         |
| render-expect | /pl/                           | 1.184  | 1.184  | 0.003 (0.004)    | 545             | 463         |
| css-inline    | /de/                           | 652    | 776    | 0.018 (0.018)    | 479             | 376         |
| css-inline    | /de/contact                    | 552    | 552    | 0.161 (0.161)    | 327             | 368         |
| css-inline    | /de/articles/die-gruene-praxis | 556    | 556    | 0.043 (0.043)    | 345             | 413         |
| css-inline    | /pl/                           | 656    | 780    | 0.003 (0.003)    | 527             | 463         |

**Runde 2 — mobil gedrosselt, gzip: Kombinationen** (verschraenkt, Median aus 5; Load1 je Wiederholung 1.72 / 1.58 / 1.07 / 1.58 / 1.76)

| Variante                 | Route                          | FCP ms | LCP ms | CLS Median (max) | Long Tasks Σ ms | Transfer KB |
| ------------------------ | ------------------------------ | ------ | ------ | ---------------- | --------------- | ----------- |
| basis-pt25.3             | /de/                           | 1.180  | 1.180  | 0.003 (0.004)    | 463             | 376         |
| basis-pt25.3             | /de/contact                    | 1.096  | 1.096  | 0.003 (0.003)    | 356             | 368         |
| basis-pt25.3             | /de/articles/die-gruene-praxis | 1.080  | 1.080  | 0.003 (0.003)    | 446             | 413         |
| basis-pt25.3             | /pl/                           | 1.136  | 1.136  | 0.003 (0.004)    | 491             | 463         |
| basis-pt25.3             | /cs/consumer/inside-out-duo    | 1.092  | 1.092  | 0.000 (0.000)    | 474             | 502         |
| B                        | /de/                           | 1.184  | 1.184  | 0.004 (0.004)    | 452             | 376         |
| B                        | /de/contact                    | 1.076  | 1.076  | 0.003 (0.003)    | 402             | 369         |
| B                        | /de/articles/die-gruene-praxis | 1.108  | 1.120  | 0.003 (0.003)    | 461             | 414         |
| B                        | /pl/                           | 1.196  | 1.196  | 0.003 (0.004)    | 511             | 463         |
| B                        | /cs/consumer/inside-out-duo    | 1.136  | 1.136  | 0.000 (0.000)    | 566             | 502         |
| B+inline                 | /de/                           | 692    | 784    | 0.003 (0.004)    | 481             | 376         |
| B+inline                 | /de/contact                    | 544    | 544    | 0.004 (0.004)    | 389             | 368         |
| B+inline                 | /de/articles/die-gruene-praxis | 588    | 1.044  | 0.003 (0.004)    | 481             | 413         |
| B+inline                 | /pl/                           | 660    | 780    | 0.004 (0.004)    | 522             | 463         |
| B+inline                 | /cs/consumer/inside-out-duo    | 584    | 584    | 0.000 (0.000)    | 489             | 502         |
| B+inline+expect          | /de/                           | 712    | 796    | 0.004 (0.004)    | 472             | 376         |
| B+inline+expect          | /de/contact                    | 604    | 604    | 0.004 (0.004)    | 396             | 368         |
| B+inline+expect          | /de/articles/die-gruene-praxis | 616    | 1.048  | 0.003 (0.004)    | 416             | 413         |
| B+inline+expect          | /pl/                           | 720    | 796    | 0.003 (0.004)    | 500             | 463         |
| B+inline+expect          | /cs/consumer/inside-out-duo    | 636    | 636    | 0.000 (0.000)    | 499             | 502         |
| B+inline+expect+latinExt | /de/                           | 720    | 792    | 0.003 (0.004)    | 477             | 376         |
| B+inline+expect+latinExt | /de/contact                    | 592    | 592    | 0.004 (0.004)    | 390             | 368         |
| B+inline+expect+latinExt | /de/articles/die-gruene-praxis | 604    | 1.056  | 0.004 (0.004)    | 468             | 413         |
| B+inline+expect+latinExt | /pl/                           | 696    | 796    | 0.004 (0.004)    | 575             | 463         |
| B+inline+expect+latinExt | /cs/consumer/inside-out-duo    | 616    | 616    | 0.000 (0.000)    | 492             | 502         |

**Runde 2 — desktop, gzip: Kombinationen** (verschraenkt, Median aus 5; Load1 je Wiederholung 1.59 / 1.42 / 1.79 / 2 / 2.42)

| Variante                 | Route                          | FCP ms | LCP ms | CLS Median (max) | Long Tasks Σ ms | Transfer KB |
| ------------------------ | ------------------------------ | ------ | ------ | ---------------- | --------------- | ----------- |
| basis-pt25.3             | /de/                           | 192    | 192    | 0.000 (0.000)    | 66              | 381         |
| basis-pt25.3             | /de/contact                    | 140    | 140    | 0.000 (0.000)    | 127             | 368         |
| basis-pt25.3             | /de/articles/die-gruene-praxis | 148    | 148    | 0.000 (0.000)    | 103             | 413         |
| basis-pt25.3             | /pl/                           | 176    | 176    | 0.000 (0.000)    | 55              | 468         |
| basis-pt25.3             | /cs/consumer/inside-out-duo    | 184    | 184    | 0.000 (0.000)    | 158             | 586         |
| B                        | /de/                           | 160    | 160    | 0.000 (0.000)    | 0               | 381         |
| B                        | /de/contact                    | 144    | 144    | 0.000 (0.000)    | 110             | 369         |
| B                        | /de/articles/die-gruene-praxis | 124    | 124    | 0.000 (0.000)    | 103             | 414         |
| B                        | /pl/                           | 164    | 164    | 0.000 (0.000)    | 52              | 468         |
| B                        | /cs/consumer/inside-out-duo    | 160    | 172    | 0.000 (0.000)    | 103             | 586         |
| B+inline                 | /de/                           | 176    | 176    | 0.000 (0.000)    | 50              | 381         |
| B+inline                 | /de/contact                    | 140    | 140    | 0.000 (0.000)    | 97              | 368         |
| B+inline                 | /de/articles/die-gruene-praxis | 152    | 152    | 0.000 (0.000)    | 105             | 413         |
| B+inline                 | /pl/                           | 192    | 192    | 0.000 (0.000)    | 65              | 468         |
| B+inline                 | /cs/consumer/inside-out-duo    | 164    | 192    | 0.000 (0.000)    | 87              | 586         |
| B+inline+expect          | /de/                           | 192    | 192    | 0.000 (0.000)    | 0               | 381         |
| B+inline+expect          | /de/contact                    | 124    | 124    | 0.000 (0.000)    | 98              | 368         |
| B+inline+expect          | /de/articles/die-gruene-praxis | 132    | 132    | 0.000 (0.000)    | 113             | 413         |
| B+inline+expect          | /pl/                           | 176    | 176    | 0.000 (0.000)    | 57              | 468         |
| B+inline+expect          | /cs/consumer/inside-out-duo    | 164    | 188    | 0.000 (0.000)    | 147             | 586         |
| B+inline+expect+latinExt | /de/                           | 172    | 172    | 0.000 (0.000)    | 0               | 381         |
| B+inline+expect+latinExt | /de/contact                    | 116    | 116    | 0.000 (0.000)    | 107             | 368         |
| B+inline+expect+latinExt | /de/articles/die-gruene-praxis | 132    | 132    | 0.000 (0.000)    | 85              | 413         |
| B+inline+expect+latinExt | /pl/                           | 184    | 184    | 0.000 (0.000)    | 0               | 468         |
| B+inline+expect+latinExt | /cs/consumer/inside-out-duo    | 164    | 168    | 0.000 (0.000)    | 109             | 586         |

Runde 1 zeigt die Abhaengigkeit: **inline ohne Fallback-Fix** bringt FCP −490 bis −520 ms, aber den Font-Swap-CLS zurueck (Kontakt **0,161**,
Artikel 0,043) — der erste Paint liegt dann deutlich vor der Schrift. **Mit** gemessenem Fallback bleibt CLS 0,003–0,004 (Runde 2).

**Zerlegung Kosten/Nutzen** (Runde 4, je 5 Laeufe; B2-Build — die Fallback-Werte beeinflussen FCP/LCP nachweislich nicht, Runden 1–2):

**Zerlegung kalt — mobil gedrosselt, gzip** (verschraenkt, Median aus 5; Load1 je Wiederholung 1.6 / 2.37 / 1.93 / 2.24 / 3.53)

| Variante         | Route       | FCP ms | LCP ms | CLS Median (max) | Transfer KB |
| ---------------- | ----------- | ------ | ------ | ---------------- | ----------- |
| vorher-pt25.3    | /de/        | 1.144  | 1.144  | 0.003 (0.004)    | 376         |
| vorher-pt25.3    | /de/contact | 1.056  | 1.056  | 0.003 (0.003)    | 368         |
| vorher-pt25.3    | /pl/        | 1.172  | 1.172  | 0.003 (0.003)    | 463         |
| B2-extern        | /de/        | 1.140  | 1.140  | 0.003 (0.003)    | 376         |
| B2-extern        | /de/contact | 1.048  | 1.048  | 0.003 (0.003)    | 369         |
| B2-extern        | /pl/        | 1.156  | 1.156  | 0.003 (0.004)    | 463         |
| B2-extern+expect | /de/        | 1.188  | 1.188  | 0.003 (0.003)    | 377         |
| B2-extern+expect | /de/contact | 1.072  | 1.072  | 0.003 (0.004)    | 369         |
| B2-extern+expect | /pl/        | 1.176  | 1.176  | 0.003 (0.004)    | 464         |
| B2-inline        | /de/        | 624    | 788    | 0.004 (0.004)    | 376         |
| B2-inline        | /de/contact | 608    | 608    | 0.004 (0.004)    | 368         |
| B2-inline        | /pl/        | 628    | 788    | 0.003 (0.004)    | 463         |
| B2-inline+expect | /de/        | 688    | 776    | 0.004 (0.004)    | 377         |
| B2-inline+expect | /de/contact | 588    | 588    | 0.004 (0.004)    | 369         |
| B2-inline+expect | /pl/        | 672    | 792    | 0.003 (0.004)    | 464         |

**Zerlegung Wiederholungsansicht — mobil gedrosselt, gzip** (verschraenkt, Median aus 5; Load1 je Wiederholung 3.43 / 4.87 / 1.97 / 1.41 / 1.53)

| Variante         | Route       | FCP ms | LCP ms | CLS Median (max) | Transfer KB |
| ---------------- | ----------- | ------ | ------ | ---------------- | ----------- |
| vorher-pt25.3    | /de/        | 352    | 352    | 0.003 (0.019)    | 392         |
| vorher-pt25.3    | /de/contact | 264    | 264    | 0.003 (0.003)    | 380         |
| vorher-pt25.3    | /pl/        | 320    | 320    | 0.003 (0.249)    | 480         |
| B2-extern        | /de/        | 264    | 392    | 0.003 (0.221)    | 392         |
| B2-extern        | /de/contact | 276    | 276    | 0.003 (0.003)    | 380         |
| B2-extern        | /pl/        | 304    | 304    | 0.003 (0.003)    | 480         |
| B2-extern+expect | /de/        | 444    | 444    | 0.003 (0.003)    | 393         |
| B2-extern+expect | /de/contact | 380    | 380    | 0.003 (0.004)    | 381         |
| B2-extern+expect | /pl/        | 460    | 460    | 0.003 (0.003)    | 481         |
| B2-inline        | /de/        | 300    | 408    | 0.003 (0.003)    | 409         |
| B2-inline        | /de/contact | 344    | 344    | 0.003 (0.003)    | 397         |
| B2-inline        | /pl/        | 324    | 324    | 0.003 (0.003)    | 496         |
| B2-inline+expect | /de/        | 528    | 528    | 0.003 (0.004)    | 410         |
| B2-inline+expect | /de/contact | 452    | 452    | 0.003 (0.003)    | 398         |
| B2-inline+expect | /pl/        | 548    | 548    | 0.003 (0.003)    | 497         |

| Baustein                      | kalt FCP mobil       | Wiederholungsansicht FCP mobil                         |
| ----------------------------- | -------------------- | ------------------------------------------------------ |
| Fallback-Faces                | ≈ 0                  | ≈ 0                                                    |
| CSS inline                    | **−480 bis −544 ms** | +20 bis +80 ms (≈ 17 KB mehr HTML statt gecachtem CSS) |
| Render-Marke (`rel="expect"`) | +16 bis +64 ms       | +90 bis +156 ms (wartet auf das ganze HTML)            |
| **Endstand zusammen**         | **−456 bis −500 ms** | **+176 bis +228 ms**                                   |

**Entscheidung — beides uebernommen, Trade-off ausdruecklich:**

- Erstaufruf mobil (Landingpages, Kampagnen, erste Session): FCP −0,46 bis −0,51 s, LCP z. B. Kontakt 1.056 → 576 ms, `/pl/` 1.200 → 780 ms.
- Wiederholungsansicht mobil (Voll-Navigation mit warmem Cache): FCP/LCP +0,18 bis +0,23 s, absolut **450–550 ms** — weit unter 2,5 s. Dafuer
  entfallen die Wiederholungs-CLS-Spitzen (0,22–0,42, „poor") vollstaendig. Clientseitige Navigation laedt kein HTML und ist nicht betroffen.
- HTML gzip je Voll-Navigation ≈ **+17 KB**:

| Route                                         | HTML gzip vorher → nachher  | HTML roh vorher → nachher |
| --------------------------------------------- | --------------------------- | ------------------------- |
| /de/                                          | 15.267 → 32.788 B (+17.521) | 86.093 → 181.598 B        |
| /de/contact                                   | 11.031 → 28.385 B (+17.354) | 69.602 → 165.107 B        |
| /pl/                                          | 15.527 → 33.085 B (+17.558) | 85.883 → 181.388 B        |
| /de/epigenetics/musterbefund/metabolic-health | 26.717 → 44.331 B (+17.614) | 211.151 → 306.656 B       |

- Kein Async-CSS: das Stylesheet ist unveraendert, synchron und vor dem Inhalt verfuegbar — FOUC = 0, Fokus-Stile ab dem ersten Frame (Tests 4 und 6).
- `server.ts` faellt auf den `<link>` zurueck, falls die CSS-Datei nicht lesbar ist. Der Dev-Server bleibt unveraendert.

### 28.7 Endstand vorher → nachher

**Endstand kalt — mobil gedrosselt, gzip (vorher = PT25.3-Build mit Vorher-Server)** (verschraenkt, Median aus 7; Load1 je Wiederholung 1.61 / 2.51 / 2.75 / 3.24 / 3.1 / 3.18 / 3.87)

| Variante       | Route                                         | FCP ms | LCP ms | CLS Median (max) | Transfer KB |
| -------------- | --------------------------------------------- | ------ | ------ | ---------------- | ----------- |
| vorher-pt25.3  | /de/                                          | 1.152  | 1.152  | 0.003 (0.004)    | 376         |
| vorher-pt25.3  | /de/contact                                   | 1.056  | 1.056  | 0.003 (0.003)    | 368         |
| vorher-pt25.3  | /de/articles/die-gruene-praxis                | 1.068  | 1.068  | 0.003 (0.003)    | 413         |
| vorher-pt25.3  | /pl/                                          | 1.200  | 1.200  | 0.003 (0.003)    | 463         |
| vorher-pt25.3  | /cs/consumer/inside-out-duo                   | 1.104  | 1.104  | 0.000 (0.085)    | 502         |
| vorher-pt25.3  | /de/epigenetics/musterbefund/metabolic-health | 1.160  | 1.160  | 0.003 (0.004)    | 426         |
| nachher-pt25.4 | /de/                                          | 692    | 784    | 0.004 (0.004)    | 377         |
| nachher-pt25.4 | /de/contact                                   | 576    | 576    | 0.004 (0.004)    | 369         |
| nachher-pt25.4 | /de/articles/die-gruene-praxis                | 596    | 1.040  | 0.003 (0.004)    | 414         |
| nachher-pt25.4 | /pl/                                          | 704    | 780    | 0.003 (0.004)    | 464         |
| nachher-pt25.4 | /cs/consumer/inside-out-duo                   | 608    | 608    | 0.000 (0.000)    | 503         |
| nachher-pt25.4 | /de/epigenetics/musterbefund/metabolic-health | 908    | 908    | 0.003 (0.004)    | 426         |

**Endstand kalt — desktop, gzip** (verschraenkt, Median aus 5; Load1 je Wiederholung 1.95 / 1.75 / 1.53 / 2.12 / 2.13)

| Variante       | Route                                         | FCP ms | LCP ms | CLS Median (max) | Transfer KB |
| -------------- | --------------------------------------------- | ------ | ------ | ---------------- | ----------- |
| vorher-pt25.3  | /de/                                          | 188    | 188    | 0.000 (0.000)    | 381         |
| vorher-pt25.3  | /de/contact                                   | 144    | 144    | 0.000 (0.000)    | 368         |
| vorher-pt25.3  | /de/articles/die-gruene-praxis                | 124    | 124    | 0.000 (0.000)    | 413         |
| vorher-pt25.3  | /pl/                                          | 184    | 184    | 0.000 (0.000)    | 468         |
| vorher-pt25.3  | /cs/consumer/inside-out-duo                   | 156    | 156    | 0.000 (0.000)    | 586         |
| vorher-pt25.3  | /de/epigenetics/musterbefund/metabolic-health | 208    | 208    | 0.000 (0.000)    | 426         |
| nachher-pt25.4 | /de/                                          | 184    | 184    | 0.000 (0.000)    | 382         |
| nachher-pt25.4 | /de/contact                                   | 144    | 144    | 0.000 (0.000)    | 369         |
| nachher-pt25.4 | /de/articles/die-gruene-praxis                | 112    | 112    | 0.000 (0.000)    | 414         |
| nachher-pt25.4 | /pl/                                          | 180    | 180    | 0.000 (0.000)    | 469         |
| nachher-pt25.4 | /cs/consumer/inside-out-duo                   | 172    | 172    | 0.000 (0.000)    | 586         |
| nachher-pt25.4 | /de/epigenetics/musterbefund/metabolic-health | 184    | 184    | 0.000 (0.000)    | 426         |

**Endstand Wiederholungsansicht — mobil gedrosselt, gzip (zweiter Aufruf im selben Kontext)** (verschraenkt, Median aus 5; Load1 je Wiederholung 2.73 / 2.61 / 2.38 / 3.02 / 9.84)

| Variante       | Route       | FCP ms | LCP ms | CLS Median (max) | Transfer KB |
| -------------- | ----------- | ------ | ------ | ---------------- | ----------- |
| vorher-pt25.3  | /de/        | 312    | 364    | 0.003 (0.221)    | 392         |
| vorher-pt25.3  | /de/contact | 312    | 312    | 0.003 (0.004)    | 380         |
| vorher-pt25.3  | /pl/        | 340    | 340    | 0.003 (0.003)    | 480         |
| nachher-pt25.4 | /de/        | 564    | 564    | 0.003 (0.003)    | 410         |
| nachher-pt25.4 | /de/contact | 480    | 480    | 0.003 (0.004)    | 398         |
| nachher-pt25.4 | /pl/        | 516    | 516    | 0.003 (0.003)    | 497         |

**Endstand B3 kalt — mobil gedrosselt, gzip (finaler Build, vorher = PT25.3-Build mit Vorher-Server)** (verschraenkt, Median aus 5; Load1 je Wiederholung 1.29 / 1.52 / 1.76 / 1.55 / 1.33)

| Variante       | Route       | FCP ms | LCP ms | CLS Median (max) | Transfer KB |
| -------------- | ----------- | ------ | ------ | ---------------- | ----------- |
| vorher-pt25.3  | /de/        | 1.184  | 1.184  | 0.003 (0.004)    | 376         |
| vorher-pt25.3  | /de/contact | 1.076  | 1.076  | 0.003 (0.004)    | 368         |
| vorher-pt25.3  | /pl/        | 1.140  | 1.140  | 0.003 (0.004)    | 463         |
| nachher-pt25.4 | /de/        | 672    | 780    | 0.004 (0.004)    | 377         |
| nachher-pt25.4 | /de/contact | 580    | 580    | 0.004 (0.004)    | 369         |
| nachher-pt25.4 | /pl/        | 692    | 792    | 0.003 (0.004)    | 464         |

Delta FCP B3: /de/ −512 ms, /de/contact −496 ms, /pl/ −448 ms — bestaetigt die Tabellen oben (B2-Build) mit dem finalen B3-CSS.

**Font-Inventar nachher (Endstand B3, `scripts/perf/font-css-inventory.mjs`, Headless-Shell, Schrift +2 s)** — vorher `node_modules/.cache/pt25.3`, nachher finaler Build:

| Viewport | Route                                         | Font-Requests v → n | Preloads v → n | Fallback-Status v → n | CLS Schrift +2 s v → n |
| -------- | --------------------------------------------- | ------------------- | -------------- | --------------------- | ---------------------- |
| 390      | /de/                                          | 1 → 1               | 1 → 1          | error → loaded        | 0.0000 → 0.0001        |
| 390      | /de/contact                                   | 1 → 1               | 1 → 1          | error → loaded        | 0.0005 → 0.0003        |
| 390      | /de/diagnostics                               | 1 → 1               | 1 → 1          | error → loaded        | 0.0390 → 0.0001        |
| 390      | /de/epigenetics                               | 1 → 1               | 1 → 1          | error → loaded        | 0.0000 → 0.0001        |
| 390      | /de/epigenetics/musterbefund/metabolic-health | 2 → 2               | 1 → 1          | error → loaded        | 0.0129 → 0.0001        |
| 390      | /de/articles/die-gruene-praxis                | 1 → 1               | 1 → 1          | error → loaded        | 0.1021 → 0.0002        |
| 390      | /pl/                                          | 2 → 2               | 1 → 1          | error → loaded        | 0.0000 → 0.0000        |
| 390      | /cs/consumer/inside-out-duo                   | 2 → 2               | 1 → 1          | error → loaded        | 0.0571 → 0.0137        |
| 1440     | /de/                                          | 1 → 1               | 1 → 1          | error → loaded        | 0.0591 → 0.0007        |
| 1440     | /de/contact                                   | 1 → 1               | 1 → 1          | error → loaded        | 0.0818 → 0.0006        |
| 1440     | /de/diagnostics                               | 1 → 1               | 1 → 1          | error → loaded        | 0.2123 → 0.0006        |
| 1440     | /de/epigenetics                               | 1 → 1               | 1 → 1          | error → loaded        | 0.0587 → 0.0009        |
| 1440     | /de/epigenetics/musterbefund/metabolic-health | 2 → 2               | 1 → 1          | error → loaded        | 0.0667 → 0.0049        |
| 1440     | /de/articles/die-gruene-praxis                | 1 → 1               | 1 → 1          | error → loaded        | 0.1752 → 0.0068        |
| 1440     | /pl/                                          | 2 → 2               | 1 → 1          | error → loaded        | 0.0006 → 0.0546        |
| 1440     | /cs/consumer/inside-out-duo                   | 2 → 2               | 1 → 1          | error → loaded        | 0.0822 → 0.0003        |

Summe CLS (Headless-Shell, Schrift +2 s): **0.9482 → 0.0840**. Externe Font-Requests vorher/nachher: 0 / 0. Suite-Modus (`channel: 'chromium'`, Test 5) siehe §28.8.

`/pl/` 1440 steigt nur in der Headless-Shell (0,0006 → 0,0546, dieselbe Umbruchgrenze der polnischen Navigation wie in Runde 1–3, Messmodus-Hinweis oben); im massgeblichen Suite-Modus sinkt dieselbe Route (0,0006 → 0,0000, Test 5). Keine Route ist im Suite-Modus schlechter.

### 28.8 Tests (fokussiert, kein Closure-Lauf)

| Pruefung                                                                                                                                                                                                                                                      | Ergebnis                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `e2e/pt25.4.spec.ts` gegen PT25.3 (Vorher-Server-Messkopie) und PT25.4, gleichzeitig                                                                                                                                                                          | **8/8 PASS** (Endstand B3) |
| 1 Font-Requests (7 Routen × 390/1440): nur eigene `inter-*-wght-normal`-Subsets, keine Duplikate, keine externe Quelle in HTML/Requests, genau ein Preload (`latin`) und genutzt; Subsets je Locale erwartet (latin / +latin-ext pl,cs / +greek Musterbefund) | PASS                       |
| 2 Fallback: zwei Faces `100 549` + `550 900` geladen, Werte exakt wie dokumentiert, `font-display: swap` fuer alle 7 Subsets                                                                                                                                  | PASS                       |
| 3 CSS inline: genau ein `<style data-inline-stylesheet>` im Kopf, bytegleich zur Build-Datei, kein `<link rel=stylesheet>`, vorher vorhanden; kein CSS-Request auch nach clientseitiger Navigation; Groesse 94.373 → 94.752 B                                 | PASS                       |
| 4 Erster Frame: Header `position: fixed`, Preflight aktiv, SSR-`h1` sichtbar (390/1440, de/contact/pl); nach dem Laden vorher = nachher (Screenshot-PSNR 99 dB)                                                                                               | PASS                       |
| 5 Font-Swap-CLS (Schrift +2 s, 7 Routen × 2 Viewports × 3 Laeufe, Median): keine Route schlechter (Toleranz 0,001), Summe **0,8152 → 0,0067**                                                                                                                 | PASS                       |
| 6 Tastaturfokus sofort sichtbar bei um 3 s verzoegerter Schrift; Reduced Motion: `animation-/transition-duration` ≤ 0,01 s                                                                                                                                    | PASS                       |
| 7 Render-Marke im Kopf + hinter `#root` (auch 404); Wiederholungsaufruf mobil gedrosselt CLS 0,0033–0,0042                                                                                                                                                    | PASS                       |
| 8 AP24 axe serious/critical = 0 (de, contact, pl), SSR-Root gefuellt, i18n-Zustand vorhanden, 0 Hydration-Fehler, echte 404                                                                                                                                   | PASS                       |
| `e2e/pt25.2.spec.ts` gegen PT25.4 (SSR, 404/Redirects, Hydration, Interaktionen, AP23 ohne Consent, AP24)                                                                                                                                                     | **8/8 PASS**               |
| `e2e/pt25.3.spec.ts` PT25.3 → PT25.4 (Bilder, LCP-Reihenfolge, CLS, OG, axe, Bytes)                                                                                                                                                                           | **9/9 PASS**               |
| `tsc` app/server, eslint, Prettier, `check:colors`                                                                                                                                                                                                            | sauber                     |

**Fehlerhafte Zwischenlaeufe (offen dokumentiert):** Test 3 scheiterte zuerst am geteilten `server.ts` (Vorher inline) und dann an einem verborgenen
Mobilmenue-Link (Testfehler); Test 5 zeigte mit B2 eine echte kleine Verschlechterung auf `/de/diagnostics` 390 (0 → 0,0119) — Anlass fuer Runde 5 und
den Wechsel zu B3; die zuvor eingetragene `/pl/`-Ausnahme ist entfernt. Ein Kettenabschnitt wurde verworfen, weil die Zerlegungsrunde parallel zu
Regressionssuiten lief.

### 28.9 Uebergaben

**PT25.5 — Budget-Input (gemessen, LAB/gzip-Proxy):**

| Kennzahl                       | Endstand PT25.4                                       | Messkontext            |
| ------------------------------ | ----------------------------------------------------- | ---------------------- |
| Initial-JS                     | 470,1 KB roh / 152,4 KB gzip (PT25.2)                 | Bundle-Report          |
| CSS                            | 94,8 KB roh / ~16,5 KB gzip, inline im HTML           | Build + Test 3         |
| HTML je Voll-Navigation        | 28–44 KB gzip (vorher 11–27)                          | html-sizes             |
| Font-Requests                  | 1 (de/en), 2 (pl/cs), 2 (Musterbefund)                | Test 1                 |
| Font-Preloads                  | 1                                                     | Test 1                 |
| FCP kalt mobil gedrosselt      | 576–908 ms (6 Routen, B2) / 580–692 ms (3 Routen, B3) | verschraenkt, 7 Laeufe |
| FCP Wiederholungsansicht mobil | 480–564 ms                                            | verschraenkt, 5 Laeufe |
| Font-Swap-CLS Schrift +2 s     | Summe 0,0067, max. je Route 0,0059                    | Suite-Modus            |
| Wiederholungsaufruf-CLS        | ≤ 0,005                                               | Test 7                 |

Budget-Hinweise: Lighthouse-LCP nur mit Spanne (§26.9); Wiederholungsansicht separat budgetieren (Inline-CSS + Render-Marke kosten dort ~0,2 s);
HTML-gzip-Budget muss das Inline-CSS einrechnen.

**OPEN BUDGET DELTA / offen:**

- Render-Marke wartet auf das gesamte HTML; eine fruehere, seitenbezogene Marke (direkt hinter dem Hero) koennte die Wiederholungskosten senken — nur mit Messung.
- Android: Fallback-Metriken fuer Roboto nicht gemessen (kein Geraet/Font).
- `/pl/`-Hauptnavigation liegt bei 1440 px an der Umbruchgrenze (Headless-Shell-Befund) → AP27.
- CSS 92 KB fuer alle Routen; Coverage 14–23 KB je Route — Route-Splitting von CSS nicht untersucht (Tailwind-Einzeldatei).
- Namespace-Preloads `fetchpriority="low"` (§26.2) jetzt nach Fallback-Fix erneut messbar — nicht Teil von PT25.4.
- AP26 (nicht Scope): CSP erlaubt `style-src 'unsafe-inline'` (Report-Only) — fuer Inline-CSS noetig, bei CSP-Verschaerfung per Hash/Nonce behandeln.

**AP27:** keine sichtbare Aenderung nach dem Laden (PSNR 99 dB); die Fallback-Phase sieht auf Linux/ChromeOS jetzt Inter-aehnlicher aus als vorher.

### 28.10 Proven — Do Not Rediscover (PT25.4)

- Font-Pfad: eine selbst gehostete Familie, keine externen Quellen, ein Preload; `latin-ext` nur pl/cs, `greek` nur Musterbefund (α, κ).
- `local('Arial')` allein ist auf Linux/ChromeOS wirkungslos; Liberation Sans/Arimo sind Arial-metrisch.
- Canvas-Metriken sind Vorauswahl, entschieden wird per Layout-CLS; 107,12 % Normal + 101,36 % Fett ist das gemessene Optimum der Kandidaten.
- `latin-ext`-Preload bringt keinen CLS-Gewinn.
- Inline-CSS: −~0,5 s FCP kalt mobil, +~17 KB HTML; nur zusammen mit Fallback-Metriken CLS-neutral.
- `rel="expect"` beseitigt den Parse-Paint-Shift (B05), kostet ~0,1–0,15 s in der Wiederholungsansicht.
- Headless-Shell und `channel: 'chromium'` unterscheiden sich bei System-Fonts; Font-CLS im Suite-Modus messen.
- `server.ts` ist geteilt: Vorher-Messungen brauchen die Messkopie `node_modules/.cache/pt25.4/server-vorher.ts`.

## 29. PT25.5 — Performance-Budgets und CI-Gate

> **Stand 2026-09-15.** Gemessener Build `node_modules/.cache/pt25.5` (Arbeitsbaum = PT25.4-Endstand; Asset-Hashes identisch:
> CSS `index-BxztliHj.css`, gleiche JS-Dateiliste). **Kein Produktcode geaendert.** Neu: Budget-Gate
> `scripts/perf/check-budgets.mjs`, Budgets `scripts/perf/budgets.json`, CI-Job `performance`, Suiten `e2e/pt25.5*.`.
> Alle Werte LAB — kein Field, kein p75, kein INP.

### 29.1 Messumgebung und Baseline

| Punkt               | Wert                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Maschine            | AMD EPYC 9634, 8 vCPU, 15 GB; Fremdlast protokolliert (Load1 je Lauf, Kalibrierung 1.81/1.63/1.73 · 2.13/1.43/1.33 · 1.66/1.78/1.42 · 1.17/1.59/1.66 · 2.45/1.5/2.21)                                                                                                                                                                                                                                    |
| Gate / Kalibrierung | Playwright 1.57 `channel: 'chromium'` (Chromium 143), Node 18.20.8 (korrigiert in §30.3; urspruenglich faelschlich 20.19.6); mobil 412×823 DPR 1,75 + CDP 4× CPU / 150 ms / 1,6 Mbit/s (wie PT25.1-Collector und PT25.2–PT25.4); desktop 1350×940 ungedrosselt; gzip-Proxy `scripts/perf/gzip-proxy.mjs` (-6) als Stellvertreter des Host-nginx (§3.2); kalt, neuer Kontext je Lauf; Laeufe verschraenkt |
| Lighthouse          | 13.4.1 mit Chrome for Testing 151.0.7922.34 (`chromium-1234`), Node 22.23.2; BenchmarkIndex 2715 (identity) / 2682 (gzip); 3 Laeufe je Route/Profil, 17 Routen (404 nicht messbar, §22.6)                                                                                                                                                                                                                |
| Baseline            | PT25.1-Build `node_modules/.cache/pt25.1` (statisch neu vermessen mit dem Gate) und PT25.1-Lighthouse-Rohdaten (§5/§6); PT25.2–PT25.4-Deltas §26–§28                                                                                                                                                                                                                                                     |
| PREVIEW             | **nicht** neu gemessen: das Preview-Image ist weiterhin `ap23-preview-20260911` (kein Deploy in AP25)                                                                                                                                                                                                                                                                                                    |
| Routenmatrix        | unveraendert §4 — alle 18 Routen inkl. 404, keine Route entfernt                                                                                                                                                                                                                                                                                                                                         |

### 29.2 CWV-Wahrheit

```text
LCP_LAB   = MEASURED            (Playwright-Chromium, mobil gedrosselt + desktop, gzip-Proxy; Lighthouse 13.4.1 simuliert)
CLS_LAB   = MEASURED            (groesstes Session-Fenster nach CWV-Definition)
TTFB_LAB  = MEASURED            (Navigation Timing `responseStart`, lokal; mobil inkl. 150 ms emulierter Latenz)
INP_FIELD = NOT_AVAILABLE       (kein Transport, kein Sample — §3.3, §19)
INP_LAB   = NOT_CLAIMED_AS_FIELD (Event-Timing-Surrogat der Kerninteraktionen, §29.9 Test 4 — kein INP, kein p75)
FIELD_METRICS = NOT_AVAILABLE
```

Kein Wert in §29 ist ein Feldwert. Die CI-Zeitgrenzen sind die „gut"-Schwellen aus
`src/lib/monitoring/web-vitals.ts` (`WEB_VITAL_THRESHOLDS`: LCP 2.500 ms, CLS 0,1, TTFB 800 ms); sie werden hier als
**Lab-Qualitaetsziel** verwendet, nicht als Aussage ueber reale Nutzer. Test 1 der PT25.5-Suite prueft, dass
`budgets.json` und das Modul dieselben Zahlen tragen.

### 29.3 Budget-Ableitung (Regeln)

Kalibrierung: **5 Gate-Aufrufe × 3 verschraenkte Laeufe** (Profil `lab`, Report-Modus) auf dem PT25.5-Build, je Aufruf Median je Route/Geraet.
Gemessene Streuung der Aufruf-Mediane (max − min je Route/Geraet, 36 Paare): LCP min 12 / Median 40 / **p90 72** / max 76 ms · FCP 12 / 44 / **68** / 80 ms · TTFB 2 / 6 / **12** / 15 ms.
Bytes, Anzahlen und Strukturwerte: **0 Streuung** ueber alle 15 Laeufe (deterministischer Build, kalter Cache).

| Budgetart                                                            | Regel                                                                                                                                                                                                                                                                                                                                                                            | Begruendung / Puffer                                                                                                                                                                                                                                                                                |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bytes (Initial-JS/CSS, Route-JS, HTML, JS, Bilder, LCP-Bild, Fonts)  | gemessenes Maximum **+ 5 %**                                                                                                                                                                                                                                                                                                                                                     | Build-Streuung ist 0; 5 % decken kleines Inhaltswachstum ohne Architekturwechsel (z. B. ein Abschnitt ≈ 2–4 KB gzip im Entry). Jede Rueckkehr zu einem nachgewiesenen PT25.2–PT25.4-Gewinn faellt durch: Initial-JS-Budget 160,9 KB < PT25.1 165,5 KB, Musterbefund-Route 24,6 KB ≪ PT25.1 115,9 KB |
| Anzahlen (Font-Requests, Inter-Faces, Fallback-Faces, Font-Preloads) | **exakt** wie gemessen                                                                                                                                                                                                                                                                                                                                                           | diskrete Werte, Streuung 0                                                                                                                                                                                                                                                                          |
| Zeiten LAB (LCP, FCP, TTFB)                                          | schlechtester Aufruf-Median **+ gemessene Streuung dieser Route**, mindestens p90 aller Routen (LCP 72, FCP 68, TTFB 12 ms), auf 10 ms aufgerundet                                                                                                                                                                                                                               | Puffer = eine gemessene Lauf-zu-Lauf-Streuung, kein Prozentpuffer; kein Budget liegt ueber der CWV-Grenze „gut" (geprueft, 0 Treffer)                                                                                                                                                               |
| CLS LAB                                                              | groesster Einzellauf **+ 0,006**                                                                                                                                                                                                                                                                                                                                                 | 0,006 = gemessener Font-Swap-Rest bei spaet eintreffender Schrift (§28.8, max 0,0059 je Route)                                                                                                                                                                                                      |
| Zeiten CI                                                            | CWV-Grenzen „gut" (`WEB_VITAL_THRESHOLDS`): LCP 2.500 ms, CLS 0,1, TTFB 800 ms                                                                                                                                                                                                                                                                                                   | Runner-Hardware ≠ Kalibrierumgebung; die kalibrierten Budgets waeren dort Hardware-, nicht Code-Messung                                                                                                                                                                                             |
| Struktur (beide Profile)                                             | 0 Fremd-Requests, 0 Nicht-GET, 0 Beacons, 0 Hydration-/Laufzeitfehler, genau 1 Font-Preload, 0 Stylesheet-Links + genau 1 Inline-Stylesheet, ≤ 1 `fetchpriority=high`, 0 Bilder ohne `width`/`height`, 0 lazy LCP-Bild, 0 eager unter dem Falz (Ausnahmen unten), 0 Bilder > 2× benoetigte Breite und > 10 KB, 0 horizontaler Ueberlauf, HTTP-Status = Matrix, SSR-Root gefuellt | harte Regeln AP25 §4 und False-Ready-Liste                                                                                                                                                                                                                                                          |

**Ausnahmen „eager unter dem Falz" (mit Beleg, in `budgets.json`):**

| Route           | Geraet | Bild                           | Beleg                                                                                                                            |
| --------------- | ------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| diagnostics-hub | mobile | `Igloo-pro-frontal…`           | PT25.3 §27.3/§27.5: LCP ab 768 px; verschraenkte Ablation ohne fetchpriority mobil 1.092 vs. 1.104 ms (Rauschen)                 |
| consumer-d3     | mobile | `spray-hero-12pack-office-…`   | PT25.3 §27.1 PERF-B09: 48 px unter dem Falz bei 390 px, LCP ab 768 px, bewusst unveraendert; Ablation mobil offen (AP25-CLOSURE) |
| consumer-duo    | mobile | `duo-hero-products-together-…` | PT25.3 §27.1 PERF-B09: wie Spray; Ablation mobil offen (AP25-CLOSURE)                                                            |

### 29.4 Budgets

**Statisch** (Vite-Manifest, gzip -9 wie Bundle-Report):

| Kennzahl                                         | PT25.1-Baseline                      | gemessen PT25.5                                                                                                                                                                                                                                                                                                 | Budget                                                                                                                           |
| ------------------------------------------------ | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Initial-JS gzip                                  | 169.433 B (165,5 KB)                 | 156.931 B (153,3 KB)                                                                                                                                                                                                                                                                                            | **164.778 B (160,9 KB)**                                                                                                         |
| Initial-CSS roh / gzip                           | 94.346 / 16.907 B                    | 94.752 / 17.007 B                                                                                                                                                                                                                                                                                               | **99.490 / 17.858 B** (ueber PT25.1: +379 B gemessene Fallback-Face PT25.4 §28.2; CSS wurde nicht verkleinert, nur ausgeliefert) |
| Groesstes Route-JS gzip                          | 118.721 B (Musterbefund)             | 34.962 B (Artikel-Detail)                                                                                                                                                                                                                                                                                       | **36.711 B**                                                                                                                     |
| Route-JS Musterbefund gzip                       | 118.721 B                            | 23.996 B                                                                                                                                                                                                                                                                                                        | **25.196 B**                                                                                                                     |
| Route-JS je Matrix-Route                         | §13                                  | home 0 · diagnostics-hub 5.627 · service-detail 8.747 · igloo-pro 4.968 · epigenetics-hub 28.782 · epigenetics-deep 10.776 · musterbefund 23.996 · articles-index 5.935 · article-detail 34.962 · events 6.300 · downloads 12.601 · contact 11.153 · consumer-d3 14.443 · consumer-duo 13.222 · not-found 1.999 | je +5 % (`budgets.json`)                                                                                                         |
| Seitenmodule ohne eigenen Chunk                  | consumer-d3, consumer-duo (im Entry) | keine                                                                                                                                                                                                                                                                                                           | **keine** (sonst Fehler)                                                                                                         |
| Inter-Faces / davon ohne `swap` / Fallback-Faces | 7 / 0 / 1                            | 7 / 0 / 2                                                                                                                                                                                                                                                                                                       | **genau 7 / 0 / genau 2**                                                                                                        |
| Externe Fontquellen (CSS + Template)             | 0                                    | 0                                                                                                                                                                                                                                                                                                               | **0**                                                                                                                            |
| Fontdateien gesamt                               | 218.512 B                            | 218.512 B                                                                                                                                                                                                                                                                                                       | **229.438 B**                                                                                                                    |

**Laufzeit je Route und Geraet** (Kalibrierung: Spanne der 5 Aufruf-Mediane → Budget; KB = 1.024 B; Bytes = Transfer hinter gzip):

| Route            | Geraet  | LCP ms gemessen → Budget | FCP ms → Budget | TTFB ms → Budget | CLS max → Budget | HTML KB → Budget | JS KB → Budget | Bild KB → Budget | LCP-Bild KB → Budget | Fonts n / KB → Budget | LCP-Element                              |
| ---------------- | ------- | ------------------------ | --------------- | ---------------- | ---------------- | ---------------- | -------------- | ---------------- | -------------------- | --------------------- | ---------------------------------------- |
| home             | mobile  | 772–844 → 920            | 660–708 → 780   | 22–30 → 50       | 0.0037 → 0.01    | 32,3 → 33,9      | 153,5 → 161,2  | 83,0 → 87,2      | 18,1 → 19,0          | 1 / 47,1 → 1 / 49,5   | img Igloo-pro-frontal.webp               |
| home             | desktop | 164–184 → 260            | 164–184 → 260   | 23–37 → 60       | 0.0000 → 0.006   | 32,3 → 33,9      | 153,5 → 161,2  | 83,0 → 87,2      | 18,1 → 19,0          | 1 / 47,1 → 1 / 49,5   | img Igloo-pro-frontal.webp               |
| diagnostics-hub  | mobile  | 592–648 → 720            | 592–648 → 720   | 22–27 → 40       | 0.0040 → 0.01    | 30,4 → 31,9      | 159,3 → 167,2  | 83,0 → 87,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | p                                        |
| diagnostics-hub  | desktop | 132–148 → 220            | 132–148 → 220   | 21–26 → 40       | 0.0000 → 0.006   | 30,4 → 31,9      | 159,3 → 167,2  | 83,0 → 87,2      | 18,1 → 19,0          | 1 / 47,1 → 1 / 49,5   | img Igloo-pro-frontal.webp               |
| service-detail   | mobile  | 580–612 → 690            | 580–612 → 680   | 21–29 → 50       | 0.0037 → 0.01    | 28,9 → 30,3      | 163,1 → 171,3  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | p                                        |
| service-detail   | desktop | 120–148 → 220            | 120–148 → 220   | 22–36 → 60       | 0.0000 → 0.006   | 28,9 → 30,3      | 163,1 → 171,3  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | h1                                       |
| igloo-pro        | mobile  | 788–804 → 880            | 568–620 → 690   | 20–27 → 40       | 0.0041 → 0.011   | 27,9 → 29,3      | 158,5 → 166,4  | 83,0 → 87,2      | 18,1 → 19,0          | 1 / 47,1 → 1 / 49,5   | img Igloo-pro-frontal.webp               |
| igloo-pro        | desktop | 136–152 → 230            | 136–152 → 220   | 22–26 → 40       | 0.0000 → 0.006   | 27,9 → 29,3      | 158,5 → 166,4  | 83,0 → 87,2      | 18,1 → 19,0          | 1 / 47,1 → 1 / 49,5   | img Igloo-pro-frontal.webp               |
| epigenetics-hub  | mobile  | 828–892 → 970            | 828–892 → 960   | 33–46 → 60       | 0.0044 → 0.011   | 40,1 → 42,1      | 182,2 → 191,3  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | p                                        |
| epigenetics-hub  | desktop | 200–256 → 330            | 200–256 → 330   | 31–42 → 60       | 0.0000 → 0.006   | 40,1 → 42,1      | 182,2 → 191,3  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | h1                                       |
| epigenetics-deep | mobile  | 592–660 → 740            | 592–660 → 730   | 20–26 → 40       | 0.0037 → 0.01    | 27,1 → 28,5      | 164,3 → 172,5  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | p                                        |
| epigenetics-deep | desktop | 124–164 → 240            | 124–164 → 240   | 18–22 → 40       | 0.0000 → 0.006   | 27,1 → 28,5      | 164,3 → 172,5  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | p                                        |
| musterbefund     | mobile  | 856–932 → 1010           | 856–932 → 1010  | 30–42 → 60       | 0.0043 → 0.011   | 43,3 → 45,5      | 187,6 → 197,0  | 64,9 → 68,2      | 0,0 → 0,0            | 2 / 65,7 → 2 / 69,0   | p                                        |
| musterbefund     | desktop | 140–200 → 280            | 140–200 → 270   | 29–37 → 50       | 0.0000 → 0.006   | 43,3 → 45,5      | 187,6 → 197,0  | 64,9 → 68,2      | 0,0 → 0,0            | 2 / 65,7 → 2 / 69,0   | h1                                       |
| articles-index   | mobile  | 552–584 → 660            | 552–584 → 660   | 21–24 → 40       | 0.0040 → 0.01    | 26,6 → 27,9      | 160,0 → 168,0  | 150,2 → 157,7    | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | h2                                       |
| articles-index   | desktop | 136–156 → 230            | 120–152 → 220   | 20–26 → 40       | 0.0000 → 0.006   | 26,6 → 27,9      | 160,0 → 168,0  | 114,9 → 120,6    | 10,4 → 10,9          | 1 / 47,1 → 1 / 49,5   | img green-400w.avif                      |
| article-detail   | mobile  | 1040–1056 → 1130         | 576–616 → 690   | 18–26 → 40       | 0.0037 → 0.01    | 28,3 → 29,7      | 189,0 → 198,4  | 85,3 → 89,6      | 20,4 → 21,4          | 1 / 47,1 → 1 / 49,5   | img green-800w.avif                      |
| article-detail   | desktop | 116–180 → 260            | 116–180 → 250   | 17–22 → 40       | 0.0000 → 0.006   | 28,3 → 29,7      | 189,0 → 198,4  | 85,3 → 89,6      | 20,4 → 21,4          | 1 / 47,1 → 1 / 49,5   | img green-800w.avif                      |
| events           | mobile  | 560–596 → 670            | 560–596 → 670   | 20–26 → 40       | 0.0040 → 0.01    | 25,4 → 26,6      | 160,1 → 168,1  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | p                                        |
| events           | desktop | 100–128 → 200            | 100–128 → 200   | 18–26 → 40       | 0.0000 → 0.006   | 25,4 → 26,6      | 160,1 → 168,1  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | h2                                       |
| downloads        | mobile  | 572–632 → 710            | 572–632 → 700   | 29–35 → 50       | 0.0041 → 0.011   | 27,7 → 29,1      | 166,4 → 174,7  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | p                                        |
| downloads        | desktop | 136–176 → 250            | 136–176 → 250   | 29–44 → 60       | 0.0000 → 0.006   | 27,7 → 29,1      | 166,4 → 174,7  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | p                                        |
| contact          | mobile  | 568–632 → 710            | 568–632 → 700   | 22–29 → 50       | 0.0040 → 0.01    | 28,0 → 29,4      | 164,9 → 173,1  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | p                                        |
| contact          | desktop | 124–156 → 230            | 124–156 → 230   | 21–24 → 40       | 0.0000 → 0.006   | 28,0 → 29,4      | 164,9 → 173,1  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | p                                        |
| consumer-d3      | mobile  | 608–664 → 740            | 608–664 → 740   | 19–24 → 40       | 0.0000 → 0.006   | 29,6 → 31,1      | 168,1 → 176,5  | 134,2 → 140,9    | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | h1                                       |
| consumer-d3      | desktop | 152–188 → 260            | 144–188 → 260   | 17–24 → 40       | 0.0000 → 0.006   | 29,6 → 31,1      | 168,1 → 176,5  | 134,2 → 140,9    | 69,2 → 72,7          | 1 / 47,1 → 1 / 49,5   | img spray-hero-12pack-office-768w.webp   |
| consumer-duo     | mobile  | 592–640 → 720            | 592–640 → 710   | 17–21 → 40       | 0.0003 → 0.007   | 27,1 → 28,5      | 166,8 → 175,1  | 113,8 → 119,5    | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | h1                                       |
| consumer-duo     | desktop | 144–168 → 240            | 128–168 → 240   | 16–20 → 40       | 0.0000 → 0.006   | 27,1 → 28,5      | 166,8 → 175,1  | 113,8 → 119,5    | 48,8 → 51,3          | 1 / 47,1 → 1 / 49,5   | img duo-hero-products-together-768w.webp |
| not-found        | mobile  | 492–528 → 600            | 492–528 → 600   | 19–20 → 40       | 0.0039 → 0.01    | 23,5 → 24,6      | 155,8 → 163,6  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | span                                     |
| not-found        | desktop | 100–136 → 210            | 100–136 → 210   | 15–20 → 40       | 0.0000 → 0.006   | 23,5 → 24,6      | 155,8 → 163,6  | 64,9 → 68,2      | 0,0 → 0,0            | 1 / 47,1 → 1 / 49,5   | h1                                       |
| home-en          | mobile  | 780–792 → 870            | 648–728 → 810   | 23–29 → 50       | 0.0036 → 0.01    | 31,9 → 33,5      | 153,5 → 161,2  | 83,0 → 87,2      | 18,1 → 19,0          | 1 / 47,1 → 1 / 49,5   | img Igloo-pro-frontal.webp               |
| home-en          | desktop | 144–188 → 260            | 144–188 → 260   | 21–27 → 40       | 0.0000 → 0.006   | 31,9 → 33,5      | 153,5 → 161,2  | 83,0 → 87,2      | 18,1 → 19,0          | 1 / 47,1 → 1 / 49,5   | img Igloo-pro-frontal.webp               |
| home-pl          | mobile  | 776–848 → 920            | 688–700 → 770   | 23–29 → 50       | 0.0037 → 0.01    | 32,6 → 34,2      | 153,5 → 161,2  | 83,0 → 87,2      | 18,1 → 19,0          | 2 / 130,2 → 2 / 136,7 | img Igloo-pro-frontal.webp               |
| home-pl          | desktop | 152–200 → 280            | 152–200 → 270   | 22–26 → 40       | 0.0000 → 0.006   | 32,6 → 34,2      | 153,5 → 161,2  | 83,0 → 87,2      | 18,1 → 19,0          | 2 / 130,2 → 2 / 136,7 | img Igloo-pro-frontal.webp               |
| musterbefund-pl  | mobile  | 832–908 → 990            | 832–908 → 990   | 28–34 → 50       | 0.0040 → 0.011   | 44,0 → 46,2      | 188,1 → 197,5  | 64,9 → 68,2      | 0,0 → 0,0            | 3 / 148,8 → 3 / 156,2 | p                                        |
| musterbefund-pl  | desktop | 180–196 → 270            | 180–196 → 270   | 30–35 → 50       | 0.0000 → 0.006   | 44,0 → 46,2      | 188,1 → 197,5  | 64,9 → 68,2      | 0,0 → 0,0            | 3 / 148,8 → 3 / 156,2 | h1                                       |

**CI-Profil:** Zeiten gegen LCP ≤ 2.500 ms, CLS ≤ 0,1, TTFB ≤ 800 ms je Route und Geraet; Bytes, Anzahlen und Struktur wie oben.

### 29.5 Gate-Ergebnis (Endstand)

Verifikationslauf **nach** der Kalibrierung (eigener Aufruf, 3 verschraenkte Laeufe, gleicher Build):

| Profil                       | Pruefungen | Verletzt | Load1 je Lauf      | Ergebnis                     |
| ---------------------------- | ---------- | -------- | ------------------ | ---------------------------- |
| `lab` (kalibrierte Budgets)  | 888        | 0        | 1,47 / 1,2 / 1,79  | **BUDGETS GEHALTEN**, Exit 0 |
| `ci` (CWV-Grenzen, ohne FCP) | 852        | 0        | 2,39 / 1,73 / 1,85 | **BUDGETS GEHALTEN**, Exit 0 |

Gemessen im `lab`-Lauf: mobil LCP 524–1.060 ms, FCP 524–944 ms, TTFB 19–34 ms, CLS 0–0,0045; desktop LCP 120–264 ms, FCP 120–264 ms, TTFB 17–37 ms, CLS 0. Struktur ueber alle 108 Messungen: 0 Fremd-Requests, 0 Nicht-GET, 0 Beacons, 0 Hydration-/Laufzeitfehler, `fetchpriority=high` ≤ 1, 0 Bilder ohne Dimensionen, 0 lazy LCP-Bilder, 0 eager unter dem Falz (ausser den 3 belegten Ausnahmen), 0 uebergrosse Bilder, 0 horizontaler Ueberlauf, genau 1 Font-Preload, 0 Stylesheet-Links, genau 1 Inline-Stylesheet.

**Engste Stellen (gemessen / Budget):** desktop `/pl/` LCP 264 / 280 ms (94 %), FCP 264 / 270 ms (98 %), TTFB 31 / 40 ms; CLS mobil Epigenetics Hub 0,0045 / 0,011 (41 %); alle Byte-Budgets 95 % (Regel +5 %).

**Befund zur Regressionstoleranz:** Die desktop-Zeitbudgets haben wenig Luft — desktop `/pl/` lag im Verifikationslauf mit 264 ms ueber der Kalibrierspanne (152–200 ms). Die Budgets werden **nicht** nachtraeglich geweitet. Schlaegt das Profil `lab` ohne Codeaenderung fehl, ist zuerst die Kalibrierung zu verbreitern (mehr Aufrufe, dokumentiert), nicht das Budget zu erhoehen. Das CI-Profil ist davon nicht betroffen (CWV-Grenzen). → offen fuer AP25-CLOSURE (unabhaengige Neuvermessung).

### 29.6 Lighthouse LAB mobile + desktop

**Unkomprimierter LAB-Origin (vergleichbar mit PT25.1 §5/§6)** — Median aus 3, Spanne in Klammern:

| Profil  | Route                                         | Score PT25.1 → PT25.5 | FCP ms        | LCP ms Median (Spanne PT25.5) | TBT ms | CLS           | TTFB ms | Transfer KB   | Provider |
| ------- | --------------------------------------------- | --------------------- | ------------- | ----------------------------- | ------ | ------------- | ------- | ------------- | -------- |
| mobile  | /de/                                          | 0.7 → 0.72            | 4.565 → 4.401 | 5.090 → 4.701 (4.700–4.723)   | 4 → 15 | 0.003 → 0.003 | 22 → 33 | 1.563 → 1.166 | 0        |
| mobile  | /de/diagnostics                               | 0.7 → 0.67            | 4.589 → 4.402 | 5.114 → 6.202 (4.702–6.212)   | 0 → 0  | 0.003 → 0.003 | 25 → 39 | 1.589 → 1.192 | 0        |
| mobile  | /de/diagnostics/dental                        | 0.71 → 0.73           | 4.402 → 4.412 | 4.852 → 4.643 (4.637–4.812)   | 0 → 10 | 0.003 → 0.003 | 24 → 35 | 1.558 → 1.160 | 0        |
| mobile  | /de/igloo-pro                                 | 0.71 → 0.73           | 4.409 → 4.212 | 4.934 → 4.729 (4.556–4.737)   | 2 → 9  | 0.003 → 0.003 | 24 → 36 | 1.561 → 1.163 | 0        |
| mobile  | /de/epigenetics                               | 0.68 → 0.7            | 4.863 → 4.716 | 5.313 → 4.945 (4.939–4.963)   | 0 → 1  | 0.003 → 0.003 | 37 → 49 | 1.711 → 1.313 | 0        |
| mobile  | /de/epigenetics/grundlagen                    | 0.7 → 0.73            | 4.508 → 4.214 | 5.033 → 4.664 (4.493–4.674)   | 0 → 0  | 0.003 → 0.003 | 19 → 26 | 1.546 → 1.148 | 0        |
| mobile  | /de/epigenetics/musterbefund/metabolic-health | 0.66 → 0.68           | 5.300 → 4.999 | 5.750 → 5.374 (5.372–5.383)   | 3 → 0  | 0.003 → 0.003 | 31 → 50 | 2.087 → 1.399 | 0        |
| mobile  | /de/articles                                  | 0.68 → 0.71           | 4.509 → 4.213 | 5.557 → 4.921 (4.813–5.111)   | 0 → 2  | 0.003 → 0.003 | 17 → 28 | 1.713 → 1.239 | 0        |
| mobile  | /de/articles/die-gruene-praxis                | 0.71 → 0.73           | 4.401 → 4.264 | 5.001 → 4.639 (4.639–4.640)   | 1 → 11 | 0.003 → 0.003 | 17 → 28 | 1.641 → 1.226 | 0        |
| mobile  | /de/events                                    | 0.7 → 0.74            | 4.508 → 4.272 | 5.033 → 4.509 (4.497–4.522)   | 0 → 7  | 0.003 → 0.003 | 16 → 40 | 1.527 → 1.129 | 0        |
| mobile  | /de/downloads                                 | 0.7 → 0.71            | 4.565 → 4.563 | 5.015 → 4.788 (4.777–4.790)   | 0 → 6  | 0.003 → 0.003 | 26 → 39 | 1.608 → 1.210 | 0        |
| mobile  | /de/contact                                   | 0.7 → 0.74            | 4.507 → 4.257 | 5.032 → 4.482 (4.478–4.483)   | 0 → 9  | 0.003 → 0.003 | 19 → 27 | 1.562 → 1.165 | 0        |
| mobile  | /de/consumer/vitamin-d3-spray                 | 0.69 → 0.71           | 4.503 → 4.399 | 5.411 → 5.012 (5.011–5.261)   | 0 → 0  | 0.000 → 0.000 | 14 → 26 | 1.603 → 1.254 | 0        |
| mobile  | /de/consumer/inside-out-duo                   | 0.69 → 0.72           | 4.505 → 4.208 | 5.405 → 4.836 (4.808–4.970)   | 0 → 0  | 0.000 → 0.000 | 17 → 21 | 1.564 → 1.212 | 0        |
| mobile  | /en/                                          | 0.69 → 0.72           | 4.658 → 4.419 | 5.258 → 4.719 (4.702–6.555)   | 1 → 9  | 0.003 → 0.003 | 21 → 33 | 1.200 → 1.146 | 0        |
| mobile  | /pl/                                          | 0.65 → 0.69           | 5.257 → 4.709 | 5.782 → 5.234 (5.228–5.241)   | 0 → 0  | 0.003 → 0.003 | 21 → 39 | 1.648 → 1.251 | 0        |
| mobile  | /pl/epigenetics/musterbefund/metabolic-health | 0.63 → 0.65           | 5.748 → 5.458 | 6.273 → 5.833 (5.825–5.841)   | 10 → 0 | 0.003 → 0.003 | 32 → 41 | 2.168 → 1.481 | 0        |
| desktop | /de/                                          | 0.98 → 0.98           | 888 → 857     | 990 → 906 (901–953)           | 0 → 0  | 0.000 → 0.000 | 21 → 28 | 1.567 → 1.171 | 0        |
| desktop | /de/diagnostics                               | 0.98 → 0.98           | 856 → 853     | 936 → 927 (899–933)           | 0 → 0  | 0.000 → 0.000 | 24 → 30 | 1.589 → 1.192 | 0        |
| desktop | /de/diagnostics/dental                        | 0.98 → 0.98           | 861 → 849     | 941 → 906 (901–909)           | 0 → 0  | 0.000 → 0.000 | 28 → 28 | 1.558 → 1.160 | 0        |
| desktop | /de/igloo-pro                                 | 0.98 → 0.98           | 890 → 859     | 990 → 899 (896–904)           | 0 → 0  | 0.000 → 0.000 | 19 → 27 | 1.561 → 1.163 | 0        |
| desktop | /de/epigenetics                               | 0.97 → 0.97           | 940 → 940     | 1.024 → 989 (987–1.001)       | 0 → 0  | 0.000 → 0.000 | 32 → 53 | 1.711 → 1.313 | 0        |
| desktop | /de/epigenetics/grundlagen                    | 0.98 → 0.98           | 886 → 860     | 966 → 901 (900–908)           | 0 → 0  | 0.000 → 0.000 | 21 → 30 | 1.546 → 1.148 | 0        |
| desktop | /de/epigenetics/musterbefund/metabolic-health | 0.96 → 0.97           | 1.030 → 980   | 1.110 → 1.025 (1.020–1.051)   | 0 → 0  | 0.000 → 0.000 | 39 → 40 | 2.087 → 1.399 | 0        |
| desktop | /de/articles                                  | 0.97 → 0.96           | 891 → 857     | 1.072 → 1.278 (1.247–1.317)   | 0 → 0  | 0.000 → 0.000 | 19 → 33 | 1.713 → 1.187 | 0        |
| desktop | /de/articles/die-gruene-praxis                | 0.98 → 0.98           | 868 → 863     | 968 → 926 (923–935)           | 0 → 0  | 0.000 → 0.000 | 16 → 33 | 1.641 → 1.226 | 0        |
| desktop | /de/events                                    | 0.98 → 0.99           | 888 → 821     | 968 → 861 (859–872)           | 0 → 0  | 0.000 → 0.000 | 34 → 27 | 1.527 → 1.129 | 0        |
| desktop | /de/downloads                                 | 0.98 → 0.98           | 918 → 891     | 998 → 948 (939–951)           | 0 → 0  | 0.000 → 0.000 | 49 → 42 | 1.608 → 1.210 | 0        |
| desktop | /de/contact                                   | 0.98 → 0.98           | 881 → 868     | 961 → 910 (908–912)           | 0 → 0  | 0.000 → 0.000 | 29 → 31 | 1.562 → 1.165 | 0        |
| desktop | /de/consumer/vitamin-d3-spray                 | 0.98 → 0.98           | 869 → 849     | 1.012 → 969 (961–992)         | 0 → 0  | 0.000 → 0.000 | 20 → 24 | 1.625 → 1.276 | 0        |
| desktop | /de/consumer/inside-out-duo                   | 0.98 → 0.98           | 868 → 860     | 1.044 → 995 (977–995)         | 0 → 0  | 0.000 → 0.000 | 18 → 18 | 1.648 → 1.296 | 0        |
| desktop | /en/                                          | 0.98 → 0.98           | 888 → 859     | 988 → 902 (899–903)           | 0 → 0  | 0.000 → 0.000 | 21 → 33 | 1.204 → 1.151 | 0        |
| desktop | /pl/                                          | 0.97 → 0.98           | 965 → 900     | 1.065 → 994 (989–997)         | 0 → 0  | 0.000 → 0.000 | 26 → 32 | 1.653 → 1.256 | 0        |
| desktop | /pl/epigenetics/musterbefund/metabolic-health | 0.95 → 0.96           | 1.065 → 1.061 | 1.191 → 1.101 (1.097–1.102)   | 0 → 0  | 0.000 → 0.000 | 33 → 40 | 2.168 → 1.481 | 0        |

**Hinter dem gzip-Proxy (produktionsnaeher, keine PT25.1-Entsprechung)**:

| Profil  | Route                                         | Score (min–max)  | FCP ms | LCP ms Median (Spanne) | TBT ms | CLS   | TTFB ms | Transfer KB | Provider |
| ------- | --------------------------------------------- | ---------------- | ------ | ---------------------- | ------ | ----- | ------- | ----------- | -------- |
| mobile  | /de/                                          | 0.96 (0.96–0.96) | 2.014  | 2.389 (2.382–2.405)    | 17     | 0.003 | 36      | 455         | 0        |
| mobile  | /de/diagnostics                               | 0.96 (0.96–0.96) | 2.020  | 2.395 (2.394–2.397)    | 7      | 0.003 | 41      | 460         | 0        |
| mobile  | /de/diagnostics/dental                        | 0.96 (0.96–0.97) | 2.040  | 2.340 (2.327–2.355)    | 12     | 0.003 | 31      | 445         | 0        |
| mobile  | /de/igloo-pro                                 | 0.96 (0.96–0.96) | 2.038  | 2.413 (2.396–2.416)    | 8      | 0.003 | 35      | 457         | 0        |
| mobile  | /de/epigenetics                               | 0.97 (0.96–0.97) | 2.009  | 2.318 (2.307–2.336)    | 4      | 0.003 | 48      | 480         | 0        |
| mobile  | /de/epigenetics/grundlagen                    | 0.97 (0.96–0.97) | 2.017  | 2.318 (2.316–2.334)    | 0      | 0.003 | 27      | 445         | 0        |
| mobile  | /de/epigenetics/musterbefund/metabolic-health | 0.94 (0.94–0.95) | 2.325  | 2.550 (2.536–2.565)    | 15     | 0.003 | 40      | 504         | 0        |
| mobile  | /de/articles                                  | 0.94 (0.94–0.95) | 1.972  | 2.742 (2.740–2.797)    | 5      | 0.003 | 27      | 543         | 0        |
| mobile  | /de/articles/die-gruene-praxis                | 0.96 (0.96–0.96) | 2.006  | 2.473 (2.456–2.486)    | 12     | 0.003 | 26      | 492         | 0        |
| mobile  | /de/events                                    | 0.96 (0.96–0.97) | 1.964  | 2.414 (2.316–2.414)    | 12     | 0.003 | 26      | 438         | 0        |
| mobile  | /de/downloads                                 | 0.96 (0.96–0.96) | 1.964  | 2.414 (2.414–2.418)    | 36     | 0.003 | 38      | 448         | 0        |
| mobile  | /de/contact                                   | 0.97 (0.96–0.97) | 2.011  | 2.313 (2.311–2.415)    | 30     | 0.003 | 28      | 447         | 0        |
| mobile  | /de/consumer/vitamin-d3-spray                 | 0.95 (0.95–0.95) | 1.965  | 2.702 (2.640–2.720)    | 0      | 0.000 | 25      | 521         | 0        |
| mobile  | /de/consumer/inside-out-duo                   | 0.96 (0.96–0.96) | 2.007  | 2.542 (2.537–2.543)    | 0      | 0.000 | 24      | 496         | 0        |
| mobile  | /en/                                          | 0.96 (0.96–0.97) | 1.963  | 2.402 (2.390–2.488)    | 1      | 0.003 | 36      | 445         | 0        |
| mobile  | /pl/                                          | 0.93 (0.92–0.93) | 2.309  | 2.834 (2.834–2.940)    | 0      | 0.003 | 36      | 542         | 0        |
| mobile  | /pl/epigenetics/musterbefund/metabolic-health | 0.9 (0.9–0.95)   | 2.761  | 2.986 (2.461–2.989)    | 14     | 0.003 | 43      | 592         | 0        |
| desktop | /de/                                          | 1 (1–1)          | 466    | 512 (510–517)          | 0      | 0.000 | 42      | 460         | 0        |
| desktop | /de/diagnostics                               | 1 (1–1)          | 467    | 530 (527–548)          | 0      | 0.000 | 31      | 460         | 0        |
| desktop | /de/diagnostics/dental                        | 1 (1–1)          | 462    | 503 (502–508)          | 0      | 0.000 | 30      | 445         | 0        |
| desktop | /de/igloo-pro                                 | 1 (1–1)          | 460    | 531 (520–554)          | 0      | 0.000 | 28      | 457         | 0        |
| desktop | /de/epigenetics                               | 1 (1–1)          | 469    | 511 (509–516)          | 0      | 0.000 | 44      | 480         | 0        |
| desktop | /de/epigenetics/grundlagen                    | 1 (1–1)          | 426    | 506 (506–533)          | 0      | 0.000 | 26      | 445         | 0        |
| desktop | /de/epigenetics/musterbefund/metabolic-health | 1 (1–1)          | 546    | 566 (562–576)          | 0      | 0.000 | 38      | 504         | 0        |
| desktop | /de/articles                                  | 1 (1–1)          | 468    | 724 (574–815)          | 0      | 0.000 | 27      | 491         | 0        |
| desktop | /de/articles/die-gruene-praxis                | 1 (1–1)          | 470    | 550 (547–555)          | 0      | 0.000 | 26      | 492         | 0        |
| desktop | /de/events                                    | 1 (1–1)          | 454    | 534 (504–537)          | 0      | 0.000 | 34      | 438         | 0        |
| desktop | /de/downloads                                 | 1 (1–1)          | 464    | 505 (504–512)          | 0      | 0.000 | 45      | 448         | 0        |
| desktop | /de/contact                                   | 1 (1–1)          | 430    | 514 (510–515)          | 0      | 0.000 | 31      | 447         | 0        |
| desktop | /de/consumer/vitamin-d3-spray                 | 1 (1–1)          | 452    | 591 (590–612)          | 0      | 0.000 | 26      | 543         | 0        |
| desktop | /de/consumer/inside-out-duo                   | 1 (1–1)          | 461    | 599 (598–611)          | 0      | 0.000 | 23      | 580         | 0        |
| desktop | /en/                                          | 1 (1–1)          | 433    | 513 (507–554)          | 0      | 0.000 | 34      | 450         | 0        |
| desktop | /pl/                                          | 1 (1–1)          | 511    | 629 (621–631)          | 0      | 0.000 | 35      | 547         | 0        |
| desktop | /pl/epigenetics/musterbefund/metabolic-health | 1 (1–1)          | 587    | 667 (662–670)          | 0      | 0.000 | 43      | 592         | 0        |

- **Provider-Requests:** 0 in allen 204 Lighthouse-Laeufen.
- **Unkomprimiert gegenueber PT25.1:** mobil FCP auf 16/17 Routen besser (−3 bis −548 ms; Dental +10 ms), LCP 15/17 besser; Transfer −53 bis −688 KB; Score 0,63–0,71 → 0,65–0,74. Desktop LCP 16/17 besser.
- **Zwei Ausreisser, belegt als Lantern-Effekte:** `/de/diagnostics` mobil 6.202 ms (Laeufe 4.702 / 6.202 / 6.212): gleiches Element, beobachtet LCP = FCP 144–163 ms, in Lauf 2/3 beobachtetes DCL vor dem ersten Paint → simulierte LCP +1,5 s (Mechanismus §26.9; derselbe Sprung auf `/en/` Lauf 1: 6.555 ms). `/de/articles` desktop 1.072 → 1.278 ms: LCP ist seit PT25.3 das eager AVIF-Kartenbild (beobachtet 154–244 ms), Lantern rechnet den Bildrequest mit; echtes Chrome im Gate: 136–156 ms.
- **Mobil hinter gzip liegt die simulierte LCP bei 2.313–2.986 ms — auf 6/17 Routen ueber 2.500 ms** (`/de/articles` 2.742, Spray 2.702, Duo 2.542, Musterbefund 2.550, `/pl/` 2.834, Musterbefund pl 2.986). Dieselbe nominelle Drosselung in echtem Chrome (Gate) ergibt 552–1.056 ms. Das ist LAB-Simulation, keine Nutzeraussage; PT25.1-PREVIEW (nginx, AP23-Stand) lag bei 2.031–2.933 ms. **Nicht als Gate verwendet**, offen fuer AP25-CLOSURE: Lighthouse auf PREVIEW nach Deploy dieses Stands.

### 29.7 CI-Gate

| Punkt                                | Festlegung                                                                                                                                                                                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Job                                  | `.github/workflows/ci.yml` → `performance` („AP25 Performance budget gate"), **neu und getrennt**; `quality`, `routing`, `seo` unveraendert (Diff: nur Zeilen hinzugefuegt)                                                                        |
| Build                                | `npm run perf:budget:build` → `node_modules/.cache/perf-budget/{client,server}` mit Vite-Manifest (nicht `dist/`)                                                                                                                                  |
| Schritt 1                            | `npm run check:perf-budget -- --static-only` — ohne Browser, schnelle Rueckmeldung zu Bundle/CSS/Route-JS/Fonts                                                                                                                                    |
| Schritt 2                            | `npm run check:perf-budget -- --json perf-budget-report.json` — 18 Routen × mobil/desktop × 3 Laeufe, Profil `ci`; Bericht als Artefakt                                                                                                            |
| Lokal (Kalibrierumgebung)            | `npm run check:perf-budget:lab -- --runs 3` — dieselben Pruefungen, Zeiten gegen die kalibrierten Regressionsbudgets                                                                                                                               |
| Exit-Codes                           | `0` gehalten · `1` Budget verletzt (jede Verletzung als Zeile mit Route, Geraet, Messwert, Budget) · `2` Messung unvollstaendig (Server, Browser, Manifest, fehlendes Budget)                                                                      |
| Reproduzierbar                       | fester Build aus dem Lockfile, gzip-Proxy im Repository, Laeufe verschraenkt, Median; Bytes/Anzahlen/Struktur haengen nicht von der Hardware ab                                                                                                    |
| Keine Kontamination                  | kein Consent, kein Absenden, keine Formulare; Chromium mit `--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1` — kein Request verlaesst die Maschine, jeder Versuch wird gezaehlt und ist ein Budgetfehler; kein Preview-/Production-Origin |
| Keine Internet-Abhaengigkeit im Gate | ausser `npm ci` und der Playwright-Browserinstallation (ohnehin Voraussetzung aller E2E-Jobs)                                                                                                                                                      |
| Nicht im CI-Gate                     | **Lighthouse** — Lantern-LCP ist fuer diese App nachweislich bimodal (§26.9: Spruenge von 1,2 s bei unveraendertem Code) und braeuchte Node ≥ 22.19 plus separaten Chrome-Download. Lighthouse bleibt lokale Breitenmessung mit Spannen (§29.6)    |

### 29.8 Technical Metrics Boundary (AP23)

| Punkt                    | Zustand PT25.5                                                                                                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Transport                | **nicht aktiviert.** `initWebVitals()` und `setMonitoringSink()` weiterhin von keinem Produktmodul aufgerufen (`separation.test.ts`); `VITE_TELEMETRY_SCOPE=NONE` → `NO_TRANSPORT_CONFIGURED` (`policy.ts`)    |
| Trennung Marketing       | kein GTM-/GA4-/dataLayer-Pfad fuer technische Metriken; Test 7 prueft 0 Metrik-Eintraege im `dataLayer` und 0 Beacons auf 18 Routen                                                                            |
| PII / Rohdaten           | das Gate speichert nur Origin + Pfad (keine Query, keine Eingaben); nichts wird gesendet                                                                                                                       |
| Provider-neutral         | Budgets und Gate kennen keinen Anbieter; `WEB_VITAL_THRESHOLDS` bleibt einzige Schwellenquelle                                                                                                                 |
| Preview → Production     | Gate und Suiten laufen ausschliesslich gegen `127.0.0.1`; fremde Hosts sind im Browser nicht aufloesbar                                                                                                        |
| Offen (unveraendert §19) | falls je ein Transport freigegeben wird: CLS ohne Session-Fenster und „INP" als maximale Event-Dauer im Sammler weichen von der CWV-Definition ab — Betriebs-/Policy-Entscheidung AP26/AP28 + AP23, nicht AP25 |

### 29.9 Tests (breiter Integrationsgate)

| Pruefung                                                                                                                                                           | Ergebnis                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Produktionsbuild `vite build --manifest` + SSR (`node_modules/.cache/pt25.5`)                                                                                      | Exit 0; Asset-Hashes = PT25.4-Endstand                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Budget-Gate `lab` (18 Routen × 2 Geraete × 3 Laeufe)                                                                                                               | **888/888**, Exit 0 (§29.5)                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Budget-Gate `ci`                                                                                                                                                   | **852/852**, Exit 0                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Kalibrierung (5 × 3 Laeufe, Report-Modus)                                                                                                                          | 5/5 Exit 0                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `e2e/pt25.5.spec.ts`                                                                                                                                               | **8/8 PASS** (Endlauf). Vorlaeufe 1–4 rot durch **Testfehler**, nicht durch das Produkt: `hrefLang`-Regex case-sensitiv (SSR rendert React-camelCase), axe vor dem Einblenden der `Reveal`-Abschnitte (Diagnose unten). Test 4 Event-Dauer ueber alle Laeufe: Mobilmenue 56–72 ms, Escape 24 ms, Consent ablehnen 48–56 ms, Bestelldialog 104–136 ms (≤ 200 ms; LAB-Surrogat, kein INP). Test 6 zusaetzlich 1.024 px: kein Ueberlauf auf den Matrix-Routen |
| `e2e/pt25.5-broad.config.ts`: `url-smoke` (G2 404/Soft-404, G9 301, alle Locales), `search-modal`, `navigation`, `i18n-core`, `resource-center` gegen PT25.5-Build | **107 passed, 1 failed** — `search-modal` „Leerzustand mit Ergebnisansage": `getByRole('status')` trifft zwei Live-Regionen (Suchdialog + `RouteAnnouncer`). **Vorbestehend:** identischer Fehler gegen den PT25.1- und den PT25.3-Build; Testlocator-Konflikt AP24 ↔ Suchsuite, keine AP25-Aenderung beteiligt, nicht in AP25 behoben                                                                                                                     |
| `e2e/pt25.2.spec.ts` gegen PT25.5-Build (Kaltstart-Kopf, SSR 18 Routen, 404/Redirects, Hydration, Kerninteraktionen, AP23 ohne Consent, AP24 axe/Fokus)            | **8/8 PASS**                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `vitest run src/lib/monitoring src/components/seo` (Node 22.23.2 wie CI)                                                                                           | **6 Dateien / 70 Tests PASS** (unter Node 20.19.6 starten die jsdom-Dateien nicht: `ERR_REQUIRE_ESM` in `html-encoding-sniffer` — Werkzeug, bekannt aus AP20)                                                                                                                                                                                                                                                                                              |
| Lighthouse 13.4.1 LAB identity + gzip, mobil + desktop, 17 Routen × 3                                                                                              | 204 Laeufe, 0 Abbrueche, 0 Provider (§29.6)                                                                                                                                                                                                                                                                                                                                                                                                                |
| tsc app/server, eslint, Prettier, `check:colors`, YAML                                                                                                             | tsc app/server Exit 0, eslint 0, Prettier sauber (inkl. `budgets.json`, `ci.yml`, `package.json`), `check:colors` PASS, YAML gueltig (Jobs quality/routing/performance/seo; Diff nur hinzugefuegte Zeilen)                                                                                                                                                                                                                                                 |

**Diagnose axe `color-contrast` (Test 5, erster Entwurf rot):** 24 Faelle (18 Routen desktop + 6 Kernrouten mobil) × 3 Methoden auf dem PT25.5-Build, Befunde gegen den PT25.3-Build gegengeprueft:

| Methode                                                         | Faelle mit serious/critical                                                                                                                                       | Befundknoten                                                                                                                                     |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| nach Hydration + endliche Animationen fertig, **ohne Scrollen** | 7 (`/de/diagnostics/dental` 13, `/de/epigenetics` 347, `/de/epigenetics/grundlagen` 30, `/de/downloads` 82, `/de/contact` 20, `/en/` desktop 26, `/de/` mobil 25) | ausschliesslich Text unter dem Falz mit effektiver Deckkraft 0–0,01 (`Reveal` noch nicht eingeblendet), Kontrast 1,0–2,4 im unsichtbaren Zustand |
| durchgescrollt + endliche Animationen fertig                    | **0**                                                                                                                                                             | —                                                                                                                                                |
| `prefers-reduced-motion: reduce`                                | **0**                                                                                                                                                             | —                                                                                                                                                |
| PT25.3-Build, ohne Scrollen                                     | dieselben Routen und Knotenzahlen (ausser `/en/` desktop 0 statt 26: Zeitpunkt des Einblendens)                                                                   | vorbestehend, kein AP25-Effekt                                                                                                                   |

Folge: Test 5 prueft den sichtbaren Endzustand (durchscrollen, dann axe). Kein Kontrastmangel im sichtbaren Zustand; AP24 bleibt PASS.

Nicht erneut ausgefuehrt (unveraenderter Build, Hashes identisch; Evidenz PT25.3/PT25.4): `e2e/pt25.3.spec.ts` 9/9, `e2e/pt25.4.spec.ts` 8/8 (Font-CLS, FOUC, Fokus vor Schrift, Reduced Motion).
Nicht Teil dieses Gates: Suiten, die echte Leads absenden oder Consent **erteilen** (Kontakt/Support/Lead-Magnet-Submit, `consent-basic-remediation` Test 3 mit echtem GTM-Loader, Live-Shopify) — AP23/AP19/AP20-Evidenz bleibt massgeblich.

### 29.10 False-Ready-Schutz

| Risiko                                                   | Nachweis                                                                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Lighthouse-Score ohne Kontext                            | jede Zahl mit Route, Profil, Origin, Laeufen, Spanne, Chrome-Version (§29.6)                                 |
| Dev-Build                                                | nur Produktionsbuilds mit Manifest; Server `NODE_ENV=production`                                             |
| Mobil nur als Desktop-Viewport                           | mobil 412×823, DPR 1,75, `isMobile`, Touch, CDP-Drosselung                                                   |
| Fake-INP / Field-p75                                     | §29.2; Event-Timing nur als LAB-Surrogat benannt                                                             |
| Matrix verkleinert                                       | 18/18 Routen im Gate, Suiten und a11y; Lighthouse 17 (404 technisch nicht messbar, §22.6)                    |
| LCP-Inhalt entfernt / Hero lazy                          | `lazyLcpImage = 0` je Lauf; LCP-Elemente je Route in §29.4 dokumentiert und unveraendert gegenueber §27      |
| `fetchpriority=high` gestreut                            | Budget ≤ 1 je Seite, gemessen 0–1                                                                            |
| Bilder ohne Dimensionen / Desktop-Bilder mobil           | 0 Bilder ohne `width`/`height`; 0 Bilder > 2× benoetigter Breite (> 10 KB)                                   |
| Externe Fonts / unnoetige Preloads                       | 0 externe Quellen, genau 1 Font-Preload, Font-Requests exakt                                                 |
| Async-CSS ohne FOUC-Test                                 | kein Async-CSS; Inline-CSS mit FOUC/CLS-Tests PT25.4 §28.8, Gate prueft 1 Inline-Stylesheet / 0 Links        |
| Serielle Waterfalls / schwere Daten global               | Route-JS-Budgets; Test 8: keine fremden Seiten- oder Befund-Chunks auf `/de/`, genau ein Befund-Sprachinhalt |
| GTM/GA4 als Metrics-Transport, PII, Preview → Production | §29.8                                                                                                        |
| Fokus-CSS fuer Bytes entfernt                            | CSS-Budget ueber PT25.1 statt Zerlegung; Test 5 sichtbarer Fokus 24 Seiten                                   |
| Consent verzoegert/umgangen                              | Consent-Banner sichtbar, Ablehnung bleibt nach Reload; 0 Anbieter-Requests (Test 3, 7, Gate)                 |
| Budget ohne Evidence erhoeht                             | jede Zahl aus Kalibrierung + Regel §29.3; einzige Erhoehung ueber PT25.1 (CSS +379 B) mit Beleg §28.2        |
| CI-Gate nur Kommentar                                    | Job `performance` fuehrt das Gate aus; Gegenproben in Test 1 zeigen Exit 1 mit Meldung                       |

### 29.11 Uebergaben

**PRE-CLOSURE STATUS:** Budgets dokumentiert und aus Messung abgeleitet; Gate lokal in beiden Profilen gruen; CI-Job angelegt (auf GitHub **noch nicht gelaufen** — kein Push in PT25.5); Kernrouten halten alle Budgets; AP23-Consent-Netz und AP24-A11y ohne Regression.

**OPEN CLOSURE ITEMS (AP25-CLOSURE, unabhaengig neu messen):**

1. CI-Job `performance` auf einem echten GitHub-Runner ausfuehren (Laufzeit, Chromium-Kanal, Zeitgrenzen gegen Runner-Hardware).
2. Profil `lab`: desktop-Zeitbudgets mit wenig Luft (desktop `/pl/` 264 / 280 ms) — bei Fehlschlag ohne Codeaenderung Kalibrierung verbreitern, Budget nicht heben.
3. Lighthouse mobil hinter gzip: simulierte LCP 2,3–3,0 s, auf 6/17 Routen > 2,5 s (Lantern); Gegenmessung in echtem Chrome 0,5–1,1 s. PREVIEW nach Deploy dieses Stands neu messen (PREVIEW-Image ist AP23-Stand).
4. Consumer-Heros mobil eager unter dem Falz (Ausnahme mit Beleg): Ablation mit/ohne `priority` mobil noch nicht gemessen.
5. Wiederholungsansicht (PT25.4: +0,17–0,25 s FCP durch Inline-CSS + Render-Marke) ist **nicht** budgetiert — das Gate misst kalt; Warm-Profil fehlt.
6. `INP_FIELD = NOT_AVAILABLE` bleibt, bis AP26/AP28 + AP23 einen Transport freigeben.
7. Vorbestehend, nicht AP25: `search-modal`-Locator-Konflikt mit `RouteAnnouncer`; `D-20` (1024 px) AP27.

**AP26/AP27:** nichts vorgezogen. CSP `style-src 'unsafe-inline'` fuer das Inline-CSS bleibt AP26-Hinweis aus §28.9.

### 29.12 Proven — Do Not Rediscover (PT25.5)

- Bytes, Anzahlen und Strukturwerte streuen zwischen Laeufen **nicht**; Zeiten streuen je Route/Geraet bis 76 ms (p90 72 ms LCP).
- Das Gate erkennt den PT25.1-Stand (Initial-JS, Musterbefund-Route, Consumer im Entry) und den PT25.3-Stand (Fallback-Face) statisch; ein zu knappes Zeitbudget faellt mit Route/Geraet/Wert/Budget durch.
- Lighthouse-LCP ist fuer diese App Lantern-bimodal (DCL vor erstem Paint) und rechnet bei Bild-LCP den Bildrequest deutlich schwerer als echtes Chrome — nicht als hartes Gate geeignet.
- `hrefLang` wird von React camelCase gerendert (Regex case-insensitiv pruefen).
- jsdom-Unit-Tests brauchen Node ≥ 22 (CI-Version).

## 30. AP25-CLOSURE — konsolidierter Endstand

> **Stand 2026-09-15, AP25-CLOSURE.** Unabhaengige Neuvermessung auf einem frisch gebauten Produktionsbuild
> (`npm run perf:budget:build` → `node_modules/.cache/perf-budget`). Kein PT-PASS uebernommen. **§30 ist der gueltige,
> konsolidierte AP25-Stand**; §1–§29 sind Verlauf und Evidenz. Alle Werte LAB — kein Field, kein p75, kein INP.

### 30.1 Scope und Autoritaet

| Punkt                      | Festlegung                                                                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Autoritaet                 | `building-docs/work-packages/AP25.md`, AP25-CLOSURE-Auftrag (PERF-01..40, C25-01..50)                                                                       |
| Geltung                    | **§30 ist der konsolidierte, gueltige Stand von AP25.** §1–§29 bleiben als Verlauf und Evidenz stehen; bei Abweichung gilt §30                              |
| Besitz                     | AP25: Baseline, Budgets, Budget-Gate, CWV-Wahrheit. AP23: Consent und Metrics-API. AP24: Accessibility-Vertraege. AP26/AP27/AP28: unberuehrt                |
| Closure-Prinzip            | kein PT-PASS uebernommen: frischer Produktionsbuild, alle Messungen und Suiten neu ausgefuehrt (§30.28)                                                     |
| Produktcode in der Closure | **keiner** — die Closure hat nur Messwerkzeuge (unter `node_modules/.cache/ap25-closure/tools`, nicht ausgeliefert), diesen Vertrag und den State geaendert |

### 30.2 Git / HEAD / Build

| Punkt         | Wert                                                                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch        | `console/24-25-2026-09-11T13-00-11`                                                                                                                                                                                       |
| HEAD          | `48ca775ac70f6bab0869ac8a37ad035494ff4a64` (unveraendert seit PT25.1); 0 Commits in AP25                                                                                                                                  |
| Arbeitsbaum   | alle AP21–AP25-Aenderungen liegen im Index (`git diff --cached`: 307 Dateien, +49.752 / −2.188 Zeilen); der gemessene Code ist **HEAD + Index vom 2026-09-15**. Das Staging erfolgte ausserhalb der AP25-Sitzungen        |
| Closure-Build | `node_modules/.cache/perf-budget/{client,server}` mit Vite-Manifest, gebaut unter Node 22.23.2 ueber das CI-Script; **byte-identisch** zum PT25.5-Build (client 432/432, server 338/338 Dateien, 0 Abweichungen, SHA-256) |
| Asset-Kennung | Entry `assets/index-BPUSGtJH.js`, CSS `assets/index-BxztliHj.css` (inline ausgeliefert)                                                                                                                                   |

### 30.3 Toolchain (Closure, korrigiert)

| Werkzeug                                                    | Version                                                               | Verwendung                                                                         |
| ----------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Node (LAB-Server, Gate `lab`, Collector, Inventare, Suiten) | **18.20.8** (`/usr/bin/node`, Standard der nicht-interaktiven Shell)  | siehe Korrektur unten                                                              |
| Node (CI-gleiche Schritte, Lighthouse, vitest, AP24-Gate)   | 22.23.2 (nvm)                                                         | `perf:budget:build`, `check:perf-budget`, Lighthouse, jsdom-Tests, Vite-Dev-Server |
| Node (Produktion / CI)                                      | `node:22-alpine` (Dockerfile) · `actions/setup-node` 22 (CI)          |                                                                                    |
| Lighthouse                                                  | 13.4.1, Chrome for Testing 151.0.7922.34 (`chromium-1234`)            |                                                                                    |
| Playwright / Chromium                                       | 1.57.0 / `channel: 'chromium'` 143.0.7499.4                           | Gate, Collector, Suiten                                                            |
| Vite / React / Tailwind                                     | 7.2.4 / 19.2.0 / 3.4.18                                               |                                                                                    |
| Maschine                                                    | AMD EPYC 9634, 8 vCPU, 15 GB; Load1 je Schritt protokolliert (§30.28) |                                                                                    |

**Korrektur (Closure-Befund):** §2, §22.3, §26.5 und §29.1 nennen „Node 20.19.6" fuer Build, Server und Gate. Die
Rohdaten belegen fuer PT25.5 und die Closure **Node 18.20.8** (`"node"` in `results/calib-*.json`, `gate-lab.json`):
nvm wird in der nicht-interaktiven Shell nicht geladen. Fuer PT25.1–PT25.4 enthalten die Rohdaten kein Versionsfeld —
die Angabe 20.19.6 ist dort nicht belegbar. Wirkung: Die kalibrierten `lab`-Budgets stammen aus Node 18.20.8; das
CI-Profil wurde in der Closure unter Node 22.23.2 (CI/Produktionsversion) ausgefuehrt und haelt ebenfalls (§30.24).
Die Aussage in §29.9, jsdom-Tests starteten „unter Node 20.19.6" nicht, betrifft tatsaechlich Node 18.20.8.

### 30.4 Messumgebungen

| Umgebung          | Definition                                                                                                                                           | Rolle                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| LAB identity      | Produktionsserver `NODE_ENV=production` auf 127.0.0.1, unkomprimiert                                                                                 | Vergleichbarkeit mit PT25.1 (§5/§6), Collector                         |
| LAB gzip          | derselbe Server hinter `scripts/perf/gzip-proxy.mjs` (gzip -6)                                                                                       | Stellvertreter des Host-nginx (§3.2); Gate, Lighthouse gzip, Varianten |
| Gate-Profil `ci`  | LAB gzip, Zeiten gegen CWV-Grenzen                                                                                                                   | CI und Closure (Node 22)                                               |
| Gate-Profil `lab` | LAB gzip, kalibrierte Regressionsbudgets                                                                                                             | lokale Kalibrierumgebung                                               |
| Mobil             | 412×823, DPR 1,75, `isMobile`, Touch, CDP 4× CPU / 150 ms / 1,6 Mbit/s (Gate, Collector, Varianten); Lighthouse-Standardprofil mobil (simuliert)     |                                                                        |
| Desktop           | 1350×940 ungedrosselt; Lighthouse `--preset=desktop`                                                                                                 |                                                                        |
| PREVIEW           | `https://preview.polarisdx.net`, nginx gzip; **Image `ap23-preview-20260911` (Entry `index-B7KJqexA.js`) — nicht der gemessene Code**; nur HTTP/TTFB | Drift §22.1                                                            |
| FIELD             | `NOT_AVAILABLE`                                                                                                                                      | §30.10                                                                 |

### 30.5 Route Matrix

Unveraendert §4: **18 Routen** (15 de, `/en/`, `/pl/`, Musterbefund pl) inkl. echter 404. Alle Closure-Messungen nutzen alle
18 Routen; Lighthouse 17 (404 nicht messbar, §22.6); Bild-Inventar zusaetzlich About, Vitamin-D3-Landing und Masken (17 Routen × 390/768/1440).

### 30.6 Mobile Baseline (Closure) und 30.7 Desktop Baseline (Closure)

**Budget-Gate, echtes Chrome, gzip, kalt** (Closure; `lab` = Node 18.20.8, Median aus 3; `ci` = Node 22.23.2, Median aus 3):

| Route                                         | Geraet  | LCP ms lab / ci (Budget lab) | FCP ms (Budget) | TTFB ms (Budget) | CLS (Budget)   | HTML KB | JS KB | Bild KB | LCP-Bild KB | Fonts n/KB | LCP-Element                              |
| --------------------------------------------- | ------- | ---------------------------- | --------------- | ---------------- | -------------- | ------- | ----- | ------- | ----------- | ---------- | ---------------------------------------- |
| /de/                                          | mobile  | 792 / 796 (920)              | 704 (780)       | 23 (50)          | 0.0035 (0.01)  | 32,3    | 153,5 | 83,0    | 18,1        | 1/47,1     | img Igloo-pro-frontal.webp               |
| /de/                                          | desktop | 196 / 148 (260)              | 196 (260)       | 25 (60)          | 0.0000 (0.006) | 32,3    | 153,5 | 83,0    | 18,1        | 1/47,1     | img Igloo-pro-frontal.webp               |
| /de/diagnostics                               | mobile  | 624 / 608 (720)              | 624 (720)       | 21 (40)          | 0.0035 (0.01)  | 30,4    | 159,3 | 83,0    | 0,0         | 1/47,1     | p                                        |
| /de/diagnostics                               | desktop | 144 / 124 (220)              | 144 (220)       | 22 (40)          | 0.0000 (0.006) | 30,4    | 159,3 | 83,0    | 18,1        | 1/47,1     | img Igloo-pro-frontal.webp               |
| /de/diagnostics/dental                        | mobile  | 596 / 580 (690)              | 596 (680)       | 32 (50)          | 0.0033 (0.01)  | 28,9    | 163,1 | 64,9    | 0,0         | 1/47,1     | p                                        |
| /de/diagnostics/dental                        | desktop | 140 / 156 (220)              | 140 (220)       | 31 (60)          | 0.0000 (0.006) | 28,9    | 163,1 | 64,9    | 0,0         | 1/47,1     | h1                                       |
| /de/igloo-pro                                 | mobile  | 792 / 796 (880)              | 600 (690)       | 23 (40)          | 0.0037 (0.011) | 27,9    | 158,5 | 83,0    | 18,1        | 1/47,1     | img Igloo-pro-frontal.webp               |
| /de/igloo-pro                                 | desktop | 128 / 144 (230)              | 128 (220)       | 23 (40)          | 0.0000 (0.006) | 27,9    | 158,5 | 83,0    | 18,1        | 1/47,1     | img Igloo-pro-frontal.webp               |
| /de/epigenetics                               | mobile  | 876 / 868 (970)              | 876 (960)       | 39 (60)          | 0.0042 (0.011) | 40,1    | 182,2 | 64,9    | 0,0         | 1/47,1     | p                                        |
| /de/epigenetics                               | desktop | 216 / 200 (330)              | 216 (330)       | 38 (60)          | 0.0000 (0.006) | 40,1    | 182,2 | 64,9    | 0,0         | 1/47,1     | h1                                       |
| /de/epigenetics/grundlagen                    | mobile  | 600 / 592 (740)              | 600 (730)       | 21 (40)          | 0.0033 (0.01)  | 27,1    | 164,3 | 64,9    | 0,0         | 1/47,1     | p                                        |
| /de/epigenetics/grundlagen                    | desktop | 152 / 152 (240)              | 152 (240)       | 22 (40)          | 0.0000 (0.006) | 27,1    | 164,3 | 64,9    | 0,0         | 1/47,1     | p                                        |
| /de/epigenetics/musterbefund/metabolic-health | mobile  | 864 / 876 (1.010)            | 864 (1.010)     | 29 (60)          | 0.0041 (0.011) | 43,3    | 187,6 | 64,9    | 0,0         | 2/65,7     | p                                        |
| /de/epigenetics/musterbefund/metabolic-health | desktop | 172 / 184 (280)              | 172 (270)       | 35 (50)          | 0.0000 (0.006) | 43,3    | 187,6 | 64,9    | 0,0         | 2/65,7     | h1                                       |
| /de/articles                                  | mobile  | 572 / 552 (660)              | 572 (660)       | 22 (40)          | 0.0034 (0.01)  | 26,6    | 160,0 | 150,2   | 0,0         | 1/47,1     | h2                                       |
| /de/articles                                  | desktop | 152 / 160 (230)              | 152 (220)       | 23 (40)          | 0.0000 (0.006) | 26,6    | 160,0 | 114,9   | 10,4        | 1/47,1     | img green-400w.avif                      |
| /de/articles/die-gruene-praxis                | mobile  | 1.048 / 1.044 (1.130)        | 592 (690)       | 20 (40)          | 0.0033 (0.01)  | 28,3    | 189,0 | 85,3    | 20,4        | 1/47,1     | img green-800w.avif                      |
| /de/articles/die-gruene-praxis                | desktop | 148 / 128 (260)              | 116 (250)       | 18 (40)          | 0.0000 (0.006) | 28,3    | 189,0 | 85,3    | 20,4        | 1/47,1     | img green-800w.avif                      |
| /de/events                                    | mobile  | 540 / 548 (670)              | 540 (670)       | 21 (40)          | 0.0033 (0.01)  | 25,4    | 160,1 | 64,9    | 0,0         | 1/47,1     | p                                        |
| /de/events                                    | desktop | 120 / 116 (200)              | 120 (200)       | 23 (40)          | 0.0000 (0.006) | 25,4    | 160,1 | 64,9    | 0,0         | 1/47,1     | h2                                       |
| /de/downloads                                 | mobile  | 580 / 588 (710)              | 580 (700)       | 36 (50)          | 0.0036 (0.011) | 27,7    | 166,4 | 64,9    | 0,0         | 1/47,1     | p                                        |
| /de/downloads                                 | desktop | 156 / 144 (250)              | 156 (250)       | 34 (60)          | 0.0000 (0.006) | 27,7    | 166,4 | 64,9    | 0,0         | 1/47,1     | p                                        |
| /de/contact                                   | mobile  | 568 / 572 (710)              | 568 (700)       | 22 (50)          | 0.0035 (0.01)  | 28,0    | 164,9 | 64,9    | 0,0         | 1/47,1     | p                                        |
| /de/contact                                   | desktop | 124 / 128 (230)              | 124 (230)       | 18 (40)          | 0.0000 (0.006) | 28,0    | 164,9 | 64,9    | 0,0         | 1/47,1     | p                                        |
| /de/consumer/vitamin-d3-spray                 | mobile  | 628 / 620 (740)              | 628 (740)       | 21 (40)          | 0.0000 (0.006) | 29,6    | 168,1 | 134,2   | 0,0         | 1/47,1     | h1                                       |
| /de/consumer/vitamin-d3-spray                 | desktop | 160 / 184 (260)              | 160 (260)       | 19 (40)          | 0.0000 (0.006) | 29,6    | 168,1 | 134,2   | 69,2        | 1/47,1     | img spray-hero-12pack-office-768w.webp   |
| /de/consumer/inside-out-duo                   | mobile  | 592 / 592 (720)              | 592 (710)       | 18 (40)          | 0.0003 (0.007) | 27,1    | 166,8 | 113,8   | 0,0         | 1/47,1     | h1                                       |
| /de/consumer/inside-out-duo                   | desktop | 164 / 176 (240)              | 164 (240)       | 18 (40)          | 0.0000 (0.006) | 27,1    | 166,8 | 113,8   | 48,8        | 1/47,1     | img duo-hero-products-together-768w.webp |
| /de/pt25-baseline-gibt-es-nicht               | mobile  | 520 / 504 (600)              | 520 (600)       | 19 (40)          | 0.0033 (0.01)  | 23,5    | 155,8 | 64,9    | 0,0         | 1/47,1     | span                                     |
| /de/pt25-baseline-gibt-es-nicht               | desktop | 100 / 120 (210)              | 100 (210)       | 17 (40)          | 0.0000 (0.006) | 23,5    | 155,8 | 64,9    | 0,0         | 1/47,1     | h1                                       |
| /en/                                          | mobile  | 788 / 796 (870)              | 676 (810)       | 27 (50)          | 0.0033 (0.01)  | 31,9    | 153,5 | 83,0    | 18,1        | 1/47,1     | img Igloo-pro-frontal.webp               |
| /en/                                          | desktop | 192 / 172 (260)              | 192 (260)       | 25 (40)          | 0.0000 (0.006) | 31,9    | 153,5 | 83,0    | 18,1        | 1/47,1     | img Igloo-pro-frontal.webp               |
| /pl/                                          | mobile  | 840 / 836 (920)              | 684 (770)       | 24 (50)          | 0.0036 (0.01)  | 32,6    | 153,5 | 83,0    | 18,1        | 2/130,2    | img Igloo-pro-frontal.webp               |
| /pl/                                          | desktop | 208 / 188 (280)              | 208 (270)       | 23 (40)          | 0.0000 (0.006) | 32,6    | 153,5 | 83,0    | 18,1        | 2/130,2    | img Igloo-pro-frontal.webp               |
| /pl/epigenetics/musterbefund/metabolic-health | mobile  | 888 / 860 (990)              | 888 (990)       | 30 (50)          | 0.0037 (0.011) | 44,0    | 188,1 | 64,9    | 0,0         | 3/148,8    | p                                        |
| /pl/epigenetics/musterbefund/metabolic-health | desktop | 224 / 208 (270)              | 224 (270)       | 33 (50)          | 0.0000 (0.006) | 44,0    | 188,1 | 64,9    | 0,0         | 3/148,8    | h1                                       |

**Lighthouse 13.4.1** (Median aus 3, Spanne):

**Unkomprimierter LAB-Origin (vergleichbar mit PT25.1 §5/§6; Spalte PT25.5 aus §29.6):**

| Profil  | Route                                         | Score PT25.1 → Closure | FCP ms PT25.1 → Closure | LCP ms Median PT25.1 → PT25.5 → Closure (Spanne Closure) | TBT ms | CLS   | TTFB ms | Transfer KB PT25.1 → Closure | Provider |
| ------- | --------------------------------------------- | ---------------------- | ----------------------- | -------------------------------------------------------- | ------ | ----- | ------- | ---------------------------- | -------- |
| mobile  | /de/                                          | 0.7 → 0.72             | 4.565 → 4.400           | 5.090 → 4.701 → 4.706 (4.700–4.883)                      | 19     | 0.003 | 30      | 1.563 → 1.166                | 0        |
| mobile  | /de/diagnostics                               | 0.7 → 0.72             | 4.589 → 4.405           | 5.114 → 6.202 → 4.725 (4.705–4.882)                      | 16     | 0.003 | 29      | 1.589 → 1.192                | 0        |
| mobile  | /de/diagnostics/dental                        | 0.71 → 0.73            | 4.402 → 4.398           | 4.852 → 4.643 → 4.640 (4.623–4.809)                      | 6      | 0.003 | 33      | 1.558 → 1.160                | 0        |
| mobile  | /de/igloo-pro                                 | 0.71 → 0.73            | 4.409 → 4.257           | 4.934 → 4.729 → 4.564 (4.557–4.731)                      | 11     | 0.003 | 28      | 1.561 → 1.163                | 0        |
| mobile  | /de/epigenetics                               | 0.68 → 0.69            | 4.863 → 4.659           | 5.313 → 4.945 → 5.108 (4.943–5.127)                      | 6      | 0.003 | 36      | 1.711 → 1.313                | 0        |
| mobile  | /de/epigenetics/grundlagen                    | 0.7 → 0.73             | 4.508 → 4.206           | 5.033 → 4.664 → 4.656 (4.655–4.674)                      | 0      | 0.003 | 26      | 1.546 → 1.148                | 0        |
| mobile  | /de/epigenetics/musterbefund/metabolic-health | 0.66 → 0.67            | 5.300 → 5.007           | 5.750 → 5.374 → 5.382 (5.370–5.394)                      | 0      | 0.003 | 33      | 2.087 → 1.399                | 0        |
| mobile  | /de/articles                                  | 0.68 → 0.72            | 4.509 → 4.213           | 5.557 → 4.921 → 4.905 (4.813–5.107)                      | 5      | 0.003 | 25      | 1.713 → 1.239                | 0        |
| mobile  | /de/articles/die-gruene-praxis                | 0.71 → 0.72            | 4.401 → 4.210           | 5.001 → 4.639 → 4.809 (4.626–4.810)                      | 6      | 0.003 | 25      | 1.641 → 1.226                | 0        |
| mobile  | /de/events                                    | 0.7 → 0.74             | 4.508 → 4.258           | 5.033 → 4.509 → 4.483 (4.477–4.485)                      | 20     | 0.003 | 25      | 1.527 → 1.129                | 0        |
| mobile  | /de/downloads                                 | 0.7 → 0.71             | 4.565 → 4.546           | 5.015 → 4.788 → 4.781 (4.771–4.960)                      | 16     | 0.003 | 45      | 1.608 → 1.210                | 0        |
| mobile  | /de/contact                                   | 0.7 → 0.74             | 4.507 → 4.254           | 5.032 → 4.482 → 4.486 (4.479–4.504)                      | 17     | 0.003 | 29      | 1.562 → 1.165                | 0        |
| mobile  | /de/consumer/vitamin-d3-spray                 | 0.69 → 0.71            | 4.503 → 4.419           | 5.411 → 5.012 → 5.034 (5.015–5.075)                      | 0      | 0.000 | 24      | 1.603 → 1.254                | 0        |
| mobile  | /de/consumer/inside-out-duo                   | 0.69 → 0.71            | 4.505 → 4.209           | 5.405 → 4.836 → 4.958 (4.776–4.959)                      | 0      | 0.000 | 19      | 1.564 → 1.212                | 0        |
| mobile  | /en/                                          | 0.69 → 0.72            | 4.658 → 4.417           | 5.258 → 4.719 → 4.717 (4.699–6.392)                      | 1      | 0.003 | 29      | 1.200 → 1.146                | 0        |
| mobile  | /pl/                                          | 0.65 → 0.69            | 5.257 → 4.712           | 5.782 → 5.234 → 5.237 (5.234–5.238)                      | 0      | 0.003 | 32      | 1.648 → 1.251                | 0        |
| mobile  | /pl/epigenetics/musterbefund/metabolic-health | 0.63 → 0.65            | 5.748 → 5.468           | 6.273 → 5.833 → 5.843 (5.835–5.844)                      | 0      | 0.003 | 42      | 2.168 → 1.481                | 0        |
| desktop | /de/                                          | 0.98 → 0.98            | 888 → 856               | 990 → 906 → 901 (895–1.230)                              | 0      | 0.000 | 31      | 1.567 → 1.171                | 0        |
| desktop | /de/diagnostics                               | 0.98 → 0.98            | 856 → 858               | 936 → 927 → 901 (898–927)                                | 0      | 0.000 | 38      | 1.589 → 1.192                | 0        |
| desktop | /de/diagnostics/dental                        | 0.98 → 0.98            | 861 → 865               | 941 → 906 → 905 (899–920)                                | 0      | 0.000 | 34      | 1.558 → 1.160                | 0        |
| desktop | /de/igloo-pro                                 | 0.98 → 0.98            | 890 → 847               | 990 → 899 → 927 (897–927)                                | 0      | 0.000 | 23      | 1.561 → 1.163                | 0        |
| desktop | /de/epigenetics                               | 0.97 → 0.98            | 940 → 927               | 1.024 → 989 → 993 (988–997)                              | 0      | 0.000 | 50      | 1.711 → 1.313                | 0        |
| desktop | /de/epigenetics/grundlagen                    | 0.98 → 0.98            | 886 → 858               | 966 → 901 → 901 (898–908)                                | 0      | 0.000 | 26      | 1.546 → 1.148                | 0        |
| desktop | /de/epigenetics/musterbefund/metabolic-health | 0.96 → 0.97            | 1.030 → 981             | 1.110 → 1.025 → 1.021 (1.018–1.034)                      | 0      | 0.000 | 44      | 2.087 → 1.399                | 0        |
| desktop | /de/articles                                  | 0.97 → 0.96            | 891 → 846               | 1.072 → 1.278 → 1.273 (946–1.306)                        | 0      | 0.000 | 26      | 1.713 → 1.187                | 0        |
| desktop | /de/articles/die-gruene-praxis                | 0.98 → 0.98            | 868 → 859               | 968 → 926 → 927 (919–1.185)                              | 0      | 0.000 | 26      | 1.641 → 1.226                | 0        |
| desktop | /de/events                                    | 0.98 → 0.99            | 888 → 808               | 968 → 861 → 865 (857–868)                                | 0      | 0.000 | 24      | 1.527 → 1.129                | 0        |
| desktop | /de/downloads                                 | 0.98 → 0.98            | 918 → 890               | 998 → 948 → 946 (938–950)                                | 0      | 0.000 | 37      | 1.608 → 1.210                | 0        |
| desktop | /de/contact                                   | 0.98 → 0.98            | 881 → 855               | 961 → 910 → 901 (895–907)                                | 0      | 0.000 | 29      | 1.562 → 1.165                | 0        |
| desktop | /de/consumer/vitamin-d3-spray                 | 0.98 → 0.98            | 869 → 861               | 1.012 → 969 → 961 (954–964)                              | 0      | 0.000 | 23      | 1.625 → 1.276                | 0        |
| desktop | /de/consumer/inside-out-duo                   | 0.98 → 0.98            | 868 → 848               | 1.044 → 995 → 1.008 (1.005–1.013)                        | 0      | 0.000 | 27      | 1.648 → 1.296                | 0        |
| desktop | /en/                                          | 0.98 → 0.98            | 888 → 858               | 988 → 902 → 898 (898–951)                                | 0      | 0.000 | 26      | 1.204 → 1.151                | 0        |
| desktop | /pl/                                          | 0.97 → 0.98            | 965 → 897               | 1.065 → 994 → 993 (992–995)                              | 0      | 0.000 | 28      | 1.653 → 1.256                | 0        |
| desktop | /pl/epigenetics/musterbefund/metabolic-health | 0.95 → 0.96            | 1.065 → 1.057           | 1.191 → 1.101 → 1.104 (1.100–1.164)                      | 0      | 0.000 | 37      | 2.168 → 1.481                | 0        |

**Hinter dem gzip-Proxy (produktionsnaeher; Vergleich PT25.5 §29.6):**

| Profil  | Route                                         | Score (min–max)  | FCP ms | LCP ms Median (Spanne) | PT25.5 LCP | TBT ms | CLS   | TTFB ms | Transfer KB | Provider |
| ------- | --------------------------------------------- | ---------------- | ------ | ---------------------- | ---------- | ------ | ----- | ------- | ----------- | -------- |
| mobile  | /de/                                          | 0.96 (0.96–0.96) | 2.030  | 2.405 (2.392–2.407)    | 2.389      | 9      | 0.003 | 40      | 455         | 0        |
| mobile  | /de/diagnostics                               | 0.96 (0.96–0.96) | 2.045  | 2.420 (2.383–2.424)    | 2.395      | 21     | 0.003 | 41      | 460         | 0        |
| mobile  | /de/diagnostics/dental                        | 0.96 (0.96–0.97) | 2.020  | 2.320 (2.309–2.322)    | 2.340      | 13     | 0.003 | 40      | 445         | 0        |
| mobile  | /de/igloo-pro                                 | 0.96 (0.96–0.96) | 2.017  | 2.392 (2.388–2.409)    | 2.413      | 11     | 0.003 | 35      | 457         | 0        |
| mobile  | /de/epigenetics                               | 0.96 (0.96–0.96) | 2.020  | 2.320 (2.319–2.358)    | 2.318      | 0      | 0.003 | 70      | 480         | 0        |
| mobile  | /de/epigenetics/grundlagen                    | 0.97 (0.96–0.97) | 2.018  | 2.318 (2.313–2.387)    | 2.318      | 1      | 0.003 | 32      | 445         | 0        |
| mobile  | /de/epigenetics/musterbefund/metabolic-health | 0.94 (0.94–0.94) | 2.317  | 2.542 (2.542–2.559)    | 2.550      | 15     | 0.003 | 49      | 504         | 0        |
| mobile  | /de/articles                                  | 0.96 (0.94–0.96) | 2.018  | 2.468 (2.409–2.748)    | 2.742      | 10     | 0.003 | 30      | 543         | 0        |
| mobile  | /de/articles/die-gruene-praxis                | 0.96 (0.96–0.96) | 2.022  | 2.472 (2.464–2.473)    | 2.473      | 19     | 0.003 | 28      | 492         | 0        |
| mobile  | /de/events                                    | 0.97 (0.96–0.97) | 2.015  | 2.315 (2.308–2.320)    | 2.414      | 13     | 0.003 | 31      | 438         | 0        |
| mobile  | /de/downloads                                 | 0.96 (0.96–0.97) | 2.021  | 2.321 (2.313–2.330)    | 2.414      | 23     | 0.003 | 47      | 448         | 0        |
| mobile  | /de/contact                                   | 0.96 (0.96–0.96) | 2.031  | 2.334 (2.331–2.422)    | 2.313      | 46     | 0.003 | 34      | 447         | 0        |
| mobile  | /de/consumer/vitamin-d3-spray                 | 0.95 (0.94–0.95) | 2.013  | 2.688 (2.678–2.710)    | 2.702      | 0      | 0.000 | 31      | 521         | 0        |
| mobile  | /de/consumer/inside-out-duo                   | 0.95 (0.95–0.96) | 2.011  | 2.559 (2.549–2.639)    | 2.542      | 0      | 0.000 | 23      | 496         | 0        |
| mobile  | /en/                                          | 0.96 (0.96–0.96) | 2.010  | 2.385 (2.385–2.386)    | 2.402      | 0      | 0.003 | 33      | 445         | 0        |
| mobile  | /pl/                                          | 0.93 (0.93–0.93) | 2.310  | 2.835 (2.830–2.837)    | 2.834      | 7      | 0.003 | 41      | 542         | 0        |
| mobile  | /pl/epigenetics/musterbefund/metabolic-health | 0.9 (0.9–0.9)    | 2.771  | 2.996 (2.988–3.003)    | 2.986      | 15     | 0.003 | 57      | 592         | 0        |
| desktop | /de/                                          | 1 (1–1)          | 466    | 511 (508–516)          | 512        | 0      | 0.000 | 39      | 460         | 0        |
| desktop | /de/diagnostics                               | 1 (1–1)          | 463    | 527 (523–529)          | 530        | 0      | 0.000 | 40      | 460         | 0        |
| desktop | /de/diagnostics/dental                        | 1 (1–1)          | 430    | 510 (509–516)          | 503        | 0      | 0.000 | 31      | 445         | 0        |
| desktop | /de/igloo-pro                                 | 1 (1–1)          | 467    | 527 (525–540)          | 531        | 0      | 0.000 | 31      | 457         | 0        |
| desktop | /de/epigenetics                               | 1 (1–1)          | 471    | 515 (511–517)          | 511        | 0      | 0.000 | 47      | 480         | 0        |
| desktop | /de/epigenetics/grundlagen                    | 1 (1–1)          | 473    | 521 (513–535)          | 506        | 0      | 0.000 | 28      | 445         | 0        |
| desktop | /de/epigenetics/musterbefund/metabolic-health | 1 (1–1)          | 545    | 565 (565–567)          | 566        | 0      | 0.000 | 47      | 504         | 0        |
| desktop | /de/articles                                  | 1 (0.99–1)       | 466    | 787 (541–834)          | 724        | 0      | 0.000 | 33      | 491         | 0        |
| desktop | /de/articles/die-gruene-praxis                | 1 (1–1)          | 441    | 575 (561–615)          | 550        | 0      | 0.000 | 30      | 492         | 0        |
| desktop | /de/events                                    | 1 (1–1)          | 458    | 508 (504–538)          | 534        | 0      | 0.000 | 29      | 438         | 0        |
| desktop | /de/downloads                                 | 1 (1–1)          | 467    | 511 (507–539)          | 505        | 0      | 0.000 | 44      | 448         | 0        |
| desktop | /de/contact                                   | 1 (1–1)          | 464    | 508 (504–519)          | 514        | 0      | 0.000 | 36      | 447         | 0        |
| desktop | /de/consumer/vitamin-d3-spray                 | 1 (1–1)          | 465    | 594 (589–615)          | 591        | 0      | 0.000 | 26      | 543         | 0        |
| desktop | /de/consumer/inside-out-duo                   | 1 (1–1)          | 457    | 617 (599–618)          | 599        | 0      | 0.000 | 28      | 580         | 0        |
| desktop | /en/                                          | 1 (1–1)          | 466    | 515 (506–553)          | 513        | 0      | 0.000 | 39      | 450         | 0        |
| desktop | /pl/                                          | 1 (1–1)          | 507    | 620 (604–627)          | 629        | 0      | 0.000 | 32      | 547         | 0        |
| desktop | /pl/epigenetics/musterbefund/metabolic-health | 1 (1–1)          | 586    | 646 (646–662)          | 667        | 0      | 0.000 | 44      | 592         | 0        |

- **Unkomprimiert gegenueber PT25.1:** mobil FCP **und** LCP auf **17/17** Routen besser (LCP 4.852–6.273 → 4.483–5.843 ms, Score 0,63–0,71 → 0,65–0,74, Transfer 1.200–2.168 → 1.129–1.481 KB); desktop LCP 16/17 besser (865–1.273 ms). Einzige Ausnahme desktop `/de/articles` 1.072 → 1.273 ms: LCP ist seit PT25.3 das eager AVIF-Kartenbild, Lantern rechnet dessen Request mit — echtes Chrome (Gate) 100–224 ms desktop.
- **gzip mobil:** simulierte LCP 2.315–2.996 ms, **5/17 Routen ueber 2.500 ms** (Musterbefund de 2.542, Spray 2.688, Duo 2.559, `/pl/` 2.835, Musterbefund pl 2.996; PT25.5: 6/17). Echtes Chrome mit derselben nominellen Drosselung (Gate): 504–1.048 ms. Lighthouse-Lantern simuliert aus dem beobachteten Abhaengigkeitsgraphen und bildet die tatsaechliche Ladereihenfolge dieser App nachweislich nicht ab (§26.9, §29.6). **Kein Budget stuetzt sich auf Lighthouse**; die Werte bleiben LAB-Simulation mit Spanne, keine Nutzeraussage.
- **Desktop gzip:** LCP 508–787 ms, Score 1,0; **Provider-Requests 0** in allen 204 Closure-Laeufen (BenchmarkIndex 2.604–2.628).

### 30.8 LCP

- **LCP-Elemente je Kernroute** (Gate, echtes Chrome, identisch in `lab` und `ci`; Bild-Inventar 390/768/1440 bestaetigt): Bild-LCP `Igloo-pro-frontal.webp` auf `/de/`, `/en/`, `/pl/`, `/de/igloo-pro` (mobil + desktop) und `/de/diagnostics` desktop; AVIF-Artikelbild auf `/de/articles/die-gruene-praxis` (mobil + desktop) und erste Artikelkarte `/de/articles` desktop; Consumer-Hero-WebP (768w) desktop auf Spray/Duo. Alle anderen Routen Text-LCP (`p`/`h1`/`h2`, 404 `span`/`h1`) — kein LCP-Element per JavaScript nachgerendert, alle im SSR-HTML.
- **Gate, gzip, kalt:** mobil **504–1.048 ms** (`lab` 520–1.048, `ci` 504–1.044), desktop **100–224 ms**. Budgets `lab` je Route (mobil bis 1.130 ms), `ci` 2.500 ms — **alle gehalten**. Engste Stelle mobil Artikel-Detail 1.048 / 1.130 ms (93 %).
- **Lighthouse:** Lighthouse unkomprimiert mobil 4.483–5.843 ms (17/17 besser als PT25.1), desktop 865–1.273 ms; gzip mobil 2.315–2.996 ms (5/17 > 2.500 ms, Lantern-Simulation), desktop 508–787 ms — Tabellen §30.6.
- **Unkomprimierter LAB-Origin (Collector, PT25.1-Methode):** siehe §30.13 — schwere HTML-Routen dort langsamer als PT25.1 (Inline-CSS ohne Kompression); der Produktionspfad laeuft ueber gzip (§3.2).

### 30.9 CLS

- **Gate kalt:** mobil ≤ 0,0043, desktop 0,0000 auf 18/18 Routen (Budget `lab` ≤ 0,011 je Route, `ci` 0,1).
- **Bildbedingt:** 0,000 in allen 51 Bild-Inventar-Messungen (17 Routen × 390/768/1440).
- **Schrift-Swap** (Schrift +2 s verzoegert, Suite-Modus, PT25.4-Test 5 in der Closure neu): Summe **0,8152 → 0,0067**, keine Route schlechter; Headless-Shell-Inventar 0,9482 → 0,0840 (`/pl/` 1440 px 0,0546 nur Headless-Shell, §28.1).
- **Wiederholungsaufruf** (PERF-B05, `cls-warm-repro.mjs`, gzip, mobil gedrosselt): **0 von 6** Laeufen mit Shift (PT25.1: 3/3 bzw. 1/3 mit 0,175–0,292); PT25.4-Test 7 CLS ≤ 0,005.
- **Collector unkomprimiert:** kalt ≤ 0,0046, warm ≤ 0,0042.

### 30.10 INP / Field Status

```text
FIELD_METRICS = NOT_AVAILABLE
LCP_LAB       = MEASURED
CLS_LAB       = MEASURED
TTFB_LAB      = MEASURED
INP_FIELD     = NOT_AVAILABLE        (kein Transport, kein Sample, kein p75)
INP_LAB       = NOT_CLAIMED_AS_FIELD (Event-Timing-Surrogat der Kerninteraktionen, §30.13)
```

Begruendung unveraendert gegenueber §3.3/§19, in der Closure neu geprueft: `initWebVitals()` und `setMonitoringSink()`
werden von keinem Produktmodul aufgerufen (`src/lib/monitoring/separation.test.ts`, Closure-Lauf §30.28), `VITE_TELEMETRY_SCOPE`
ist nicht gesetzt → `NO_TRANSPORT_CONFIGURED`. Kein Wert dieses Vertrags ist ein Feld- oder p75-Wert.

### 30.11 TTFB

| Route                                         | HTTP LAB / PREVIEW | LAB TTFB kalt / warm-Median ms | LAB HTML roh / gzip B | PREVIEW TTFB kalt / warm-Median ms | PREVIEW Transfer gzip B (AP23-Image) | SSR-Root LAB / PREVIEW |
| --------------------------------------------- | ------------------ | ------------------------------ | --------------------- | ---------------------------------- | ------------------------------------ | ---------------------- |
| /de/                                          | 200 / 200          | 36 / 23                        | 181.597 / 33.059      | 96 / 55                            | 14.712                               | ja / ja                |
| /de/diagnostics                               | 200 / 200          | 25 / 20                        | 187.587 / 31.147      | 56 / 41                            | 12.892                               | ja / ja                |
| /de/diagnostics/dental                        | 200 / 200          | 15 / 23                        | 167.198 / 29.547      | 60 / 23                            | 11.550                               | ja / ja                |
| /de/igloo-pro                                 | 200 / 200          | 25 / 20                        | 160.462 / 28.603      | 44 / 21                            | 10.609                               | ja / ja                |
| /de/epigenetics                               | 200 / 200          | 44 / 33                        | 247.408 / 41.043      | 63 / 87                            | 22.999                               | ja / ja                |
| /de/epigenetics/grundlagen                    | 200 / 200          | 20 / 19                        | 150.074 / 27.781      | 26 / 16                            | 9.890                                | ja / ja                |
| /de/epigenetics/musterbefund/metabolic-health | 200 / 200          | 48 / 35                        | 306.655 / 44.372      | 28 / 30                            | 26.698                               | ja / ja                |
| /de/articles                                  | 200 / 200          | 20 / 19                        | 154.464 / 27.214      | 24 / 21                            | 8.916                                | ja / ja                |
| /de/articles/die-gruene-praxis                | 200 / 200          | 19 / 14                        | 150.524 / 29.008      | 19 / 17                            | 10.950                               | ja / ja                |
| /de/events                                    | 200 / 200          | 16 / 20                        | 143.421 / 25.981      | 22 / 37                            | 8.084                                | ja / ja                |
| /de/downloads                                 | 200 / 200          | 25 / 22                        | 199.334 / 28.411      | 35 / 31                            | 10.520                               | ja / ja                |
| /de/contact                                   | 200 / 200          | 18 / 13                        | 165.106 / 28.657      | 23 / 20                            | 10.808                               | ja / ja                |
| /de/consumer/vitamin-d3-spray                 | 200 / 200          | 15 / 12                        | 168.330 / 30.308      | 19 / 18                            | 12.257                               | ja / ja                |
| /de/consumer/inside-out-duo                   | 200 / 200          | 14 / 11                        | 149.787 / 27.774      | 21 / 16                            | 9.504                                | ja / ja                |
| /de/pt25-baseline-gibt-es-nicht               | 404 / 404          | 44 / 12                        | 133.107 / 24.023      | 15 / 14                            | 6.124                                | ja / ja                |
| /en/                                          | 200 / 200          | 16 / 17                        | 181.534 / 32.625      | 23 / 21                            | 14.435                               | ja / ja                |
| /pl/                                          | 200 / 200          | 22 / 21                        | 181.387 / 33.345      | 35 / 21                            | 14.982                               | ja / ja                |
| /pl/epigenetics/musterbefund/metabolic-health | 200 / 200          | 23 / 23                        | 301.645 / 45.051      | 27 / 28                            | 27.375                               | ja / ja                |

- **LAB-Origin (node:http, ohne Browser, 6 Abrufe):** kalt 14–48 ms, warm-Median 11–35 ms auf 18/18 Routen; groesste Werte Musterbefund/Epigenetics (SSR-HTML 247–307 KB roh inkl. Inline-CSS).
- **Browser (Gate, gzip):** mobil 14–39 ms (inkl. Proxy; die CDP-Latenz wirkt erst nach `responseStart`), desktop 14–38 ms; Budgets `lab` 40–60 ms je Route, `ci` 800 ms — gehalten.
- **PREVIEW** (AP23-Image, nginx gzip, oeffentliches Netz): kalt 15–96 ms, warm-Median 14–87 ms, 18/18 Status korrekt. Kein TTFB-Engpass; PREVIEW misst **nicht** den AP25-Code.

### 30.12 SSR

- **HTTP-Wahrheit:** LAB 18/18 und PREVIEW 18/18 (200/404) mit gefuelltem SSR-Root; `url-smoke` (G2 404/Soft-404 in allen Locales, G9 einstufige 301) gegen den Closure-Build gruen (§30.28).
- **Kopf:** PT25.5-Test 2 (18 Routen): genau ein `<title>`, `html lang` = Locale, Description, Canonical absolut + `x-default` auf 200, `noindex, follow` + kein Canonical auf 404, Inline-Stylesheet, genau ein Font-Preload, Render-Marke, i18n-Zustand, kein Anbieter im SSR; Redirects `/`, `/contact`, `/epigenetics?…` → 301.
- **Kaltstart-Kopf lazy Seiten** (PT25.2-Test 1) und `check:seo` (390 URLs, 39 Familien) gruen.

### 30.13 Hydration, Long Tasks, Interaktion

**Collector LAB mobile, kalt** (PT25.1-Build → Closure-Build, je 1 Lauf, unkomprimierter Origin wie PT25.1, CDP 4× CPU / 150 ms / 1,6 Mbit/s)

| Route                                         | FCP ms        | LCP ms        | Hydration Ende ms | Long Tasks n / Σ / max ms      | Locale-JSON gesamt (vor Hydration-Start) | Requests | TTFB | CLS    | Provider / Hydration-Fehler |
| --------------------------------------------- | ------------- | ------------- | ----------------- | ------------------------------ | ---------------------------------------- | -------- | ---- | ------ | --------------------------- |
| /de/                                          | 3.004 → 2.940 | 3.004 → 2.940 | 8.414 → 6.023     | 2 / 513 / 419 → 2 / 386 / 246  | 30 (30) → 15 (12)                        | 40 → 24  | 18   | 0.0035 | 0 / 0                       |
| /de/diagnostics                               | 2.852 → 2.936 | 2.852 → 2.936 | 8.368 → 5.913     | 2 / 373 / 252 → 2 / 362 / 189  | 30 (30) → 15 (12)                        | 43 → 27  | 22   | 0.0036 | 0 / 0                       |
| /de/diagnostics/dental                        | 2.660 → 2.628 | 2.660 → 2.628 | 8.229 → 5.718     | 2 / 356 / 231 → 4 / 434 / 175  | 30 (30) → 15 (12)                        | 45 → 29  | 23   | 0.0035 | 0 / 0                       |
| /de/igloo-pro                                 | 2.580 → 2.596 | 2.580 → 2.596 | 8.311 → 5.755     | 2 / 274 / 168 → 2 / 309 / 179  | 30 (30) → 15 (12)                        | 43 → 27  | 28   | 0.0035 | 0 / 0                       |
| /de/epigenetics                               | 3.176 → 3.524 | 3.176 → 3.524 | 8.680 → 6.111     | 7 / 912 / 463 → 5 / 708 / 300  | 30 (30) → 15 (12)                        | 57 → 42  | 57   | 0.0046 | 0 / 0                       |
| /de/epigenetics/grundlagen                    | 2.516 → 2.372 | 2.516 → 2.372 | 8.192 → 5.562     | 2 / 390 / 241 → 3 / 380 / 174  | 30 (30) → 15 (12)                        | 46 → 30  | 19   | 0.0033 | 0 / 0                       |
| /de/epigenetics/musterbefund/metabolic-health | 3.496 → 4.036 | 3.496 → 4.036 | 9.037 → 6.495     | 7 / 1131 / 712 → 4 / 526 / 245 | 30 (30) → 15 (12)                        | 48 → 34  | 55   | 0.0033 | 0 / 0                       |
| /de/articles                                  | 2.456 → 2.524 | 2.456 → 2.524 | 8.903 → 6.055     | 3 / 312 / 138 → 3 / 368 / 167  | 30 (30) → 15 (12)                        | 49 → 33  | 23   | 0.0033 | 0 / 0                       |
| /de/articles/die-gruene-praxis                | 2.452 → 2.488 | 3.000 → 2.500 | 8.309 → 5.689     | 2 / 252 / 151 → 2 / 305 / 175  | 30 (30) → 15 (12)                        | 49 → 34  | 29   | 0.0033 | 0 / 0                       |
| /de/events                                    | 2.408 → 2.320 | 2.408 → 2.320 | 8.034 → 5.593     | 2 / 236 / 133 → 3 / 409 / 189  | 30 (30) → 15 (12)                        | 43 → 27  | 24   | 0.0033 | 0 / 0                       |
| /de/downloads                                 | 2.660 → 2.976 | 2.660 → 2.976 | 8.356 → 5.873     | 2 / 299 / 179 → 2 / 365 / 207  | 30 (30) → 15 (12)                        | 48 → 32  | 39   | 0.0037 | 0 / 0                       |
| /de/contact                                   | 2.472 → 2.620 | 2.472 → 2.620 | 8.150 → 5.641     | 2 / 282 / 168 → 3 / 421 / 204  | 30 (30) → 15 (12)                        | 48 → 33  | 28   | 0.0040 | 0 / 0                       |
| /de/consumer/vitamin-d3-spray                 | 2.820 → 2.784 | 2.820 → 2.784 | 8.684 → 5.556     | 3 / 361 / 177 → 4 / 446 / 163  | 30 (30) → 15 (3)                         | 40 → 31  | 27   | 0.0000 | 0 / 0                       |
| /de/consumer/inside-out-duo                   | 2.644 → 2.452 | 2.644 → 2.452 | 8.499 → 5.387     | 3 / 343 / 152 → 4 / 439 / 162  | 30 (30) → 15 (3)                         | 40 → 29  | 23   | 0.0000 | 0 / 0                       |
| /de/pt25-baseline-gibt-es-nicht               | 2.292 → 2.080 | 2.292 → 2.080 | 8.007 → 5.509     | 2 / 203 / 108 → 2 / 216 / 125  | 30 (30) → 15 (12)                        | 42 → 27  | 60   | 0.0033 | 0 / 0                       |
| /en/                                          | 2.716 → 2.880 | 2.716 → 2.880 | 6.712 → 5.911     | 3 / 380 / 178 → 2 / 317 / 192  | 15 (14) → 15 (12)                        | 25 → 24  | 30   | 0.0033 | 0 / 0                       |
| /pl/                                          | 2.784 → 2.980 | 2.784 → 2.980 | 8.927 → 6.352     | 2 / 449 / 292 → 2 / 465 / 290  | 30 (30) → 15 (12)                        | 41 → 25  | 34   | 0.0033 | 0 / 0                       |
| /pl/epigenetics/musterbefund/metabolic-health | 2.856 → 3.996 | 2.856 → 3.996 | 9.409 → 6.548     | 5 / 586 / 206 → 5 / 618 / 260  | 30 (30) → 15 (12)                        | 49 → 35  | 36   | 0.0034 | 0 / 0                       |

Warm (zweite Navigation im selben Tab, unkomprimiert): FCP 232–300 → 864–1.928 ms, Hydration-Ende 688–1.692 → 1.086–2.216 ms, CLS max 0.0042.

**Collector LAB desktop, kalt** (PT25.1-Build → Closure-Build, je 1 Lauf, unkomprimierter Origin wie PT25.1)

| Route                                         | FCP ms    | LCP ms    | Hydration Ende ms | Long Tasks n / Σ / max ms     | Locale-JSON gesamt (vor Hydration-Start) | Requests | TTFB | CLS    | Provider / Hydration-Fehler |
| --------------------------------------------- | --------- | --------- | ----------------- | ----------------------------- | ---------------------------------------- | -------- | ---- | ------ | --------------------------- |
| /de/                                          | 144 → 148 | 144 → 148 | 258 → 262         | 1 / 53 / 53 → 1 / 53 / 53     | 30 (30) → 15 (10)                        | 40 → 24  | 24   | 0.0000 | 0 / 0                       |
| /de/diagnostics                               | 140 → 160 | 140 → 160 | 238 → 247         | 1 / 55 / 55 → 0 / 0 / 0       | 30 (30) → 15 (10)                        | 43 → 27  | 26   | 0.0000 | 0 / 0                       |
| /de/diagnostics/dental                        | 132 → 116 | 132 → 116 | 249 → 209         | 1 / 123 / 123 → 1 / 73 / 73   | 30 (20) → 15 (10)                        | 45 → 29  | 29   | 0.0000 | 0 / 0                       |
| /de/igloo-pro                                 | 136 → 156 | 136 → 156 | 248 → 212         | 0 / 0 / 0 → 1 / 57 / 57       | 30 (29) → 15 (12)                        | 43 → 27  | 20   | 0.0000 | 0 / 0                       |
| /de/epigenetics                               | 236 → 200 | 236 → 200 | 274 → 271         | 1 / 91 / 91 → 2 / 118 / 67    | 30 (30) → 15 (12)                        | 57 → 42  | 37   | 0.0000 | 0 / 0                       |
| /de/epigenetics/grundlagen                    | 96 → 144  | 96 → 144  | 194 → 205         | 0 / 0 / 0 → 0 / 0 / 0         | 30 (30) → 15 (12)                        | 46 → 30  | 28   | 0.0000 | 0 / 0                       |
| /de/epigenetics/musterbefund/metabolic-health | 156 → 184 | 156 → 184 | 291 → 305         | 1 / 52 / 52 → 1 / 59 / 59     | 30 (21) → 15 (12)                        | 49 → 34  | 38   | 0.0000 | 0 / 0                       |
| /de/articles                                  | 108 → 204 | 136 → 204 | 208 → 259         | 1 / 109 / 109 → 2 / 194 / 108 | 30 (30) → 15 (12)                        | 50 → 34  | 28   | 0.0000 | 0 / 0                       |
| /de/articles/die-gruene-praxis                | 112 → 132 | 140 → 132 | 239 → 227         | 0 / 0 / 0 → 1 / 50 / 50       | 30 (30) → 15 (12)                        | 49 → 34  | 28   | 0.0000 | 0 / 0                       |
| /de/events                                    | 144 → 168 | 144 → 168 | 204 → 203         | 0 / 0 / 0 → 1 / 61 / 61       | 30 (23) → 15 (12)                        | 43 → 27  | 24   | 0.0000 | 0 / 0                       |
| /de/downloads                                 | 124 → 168 | 124 → 168 | 232 → 224         | 1 / 109 / 109 → 2 / 158 / 101 | 30 (30) → 15 (4)                         | 48 → 32  | 28   | 0.0000 | 0 / 0                       |
| /de/contact                                   | 148 → 140 | 148 → 140 | 224 → 223         | 2 / 157 / 105 → 1 / 105 / 105 | 30 (30) → 15 (12)                        | 48 → 33  | 18   | 0.0000 | 0 / 0                       |
| /de/consumer/vitamin-d3-spray                 | 136 → 188 | 136 → 188 | 284 → 309         | 0 / 0 / 0 → 1 / 72 / 72       | 30 (25) → 15 (3)                         | 40 → 31  | 18   | 0.0000 | 0 / 0                       |
| /de/consumer/inside-out-duo                   | 128 → 148 | 128 → 148 | 253 → 225         | 0 / 0 / 0 → 1 / 57 / 57       | 30 (23) → 15 (3)                         | 40 → 29  | 13   | 0.0000 | 0 / 0                       |
| /de/pt25-baseline-gibt-es-nicht               | 96 → 136  | 96 → 136  | 179 → 180         | 0 / 0 / 0 → 1 / 52 / 52       | 30 (30) → 15 (12)                        | 42 → 27  | 15   | 0.0000 | 0 / 0                       |
| /en/                                          | 220 → 168 | 220 → 168 | 303 → 252         | 1 / 79 / 79 → 1 / 60 / 60     | 15 (15) → 15 (12)                        | 25 → 24  | 24   | 0.0000 | 0 / 0                       |
| /pl/                                          | 208 → 276 | 208 → 276 | 336 → 366         | 1 / 71 / 71 → 1 / 114 / 114   | 30 (21) → 15 (12)                        | 41 → 25  | 26   | 0.0000 | 0 / 0                       |
| /pl/epigenetics/musterbefund/metabolic-health | 168 → 192 | 168 → 192 | 311 → 255         | 1 / 73 / 73 → 1 / 86 / 86     | 30 (30) → 15 (12)                        | 50 → 35  | 24   | 0.0000 | 0 / 0                       |

Warm (zweite Navigation im selben Tab, unkomprimiert): FCP 56–200 → 80–196 ms, Hydration-Ende 112–210 → 122–200 ms, CLS max 0.0000.

- **Hydration gesund:** 0 Hydration-Fehler und 0 Laufzeitfehler in Collector (73 Navigationen), Gate (216 Messungen) und Suiten; Root-Suspense-Fallback nie sichtbar (PT25.2-Test 4).
- **Hydration-Ende mobil kalt:** PT25.1 6.712–9.409 ms → Closure **5.387–6.548 ms** (unkomprimiert). Schwere Pfade: Musterbefund de 9.037 → 6.495 ms, Long Tasks Σ 1.131 → 526 ms, max 712 → 245 ms; Epigenetics Hub 8.680 → 6.111 ms, Σ 912 → 708 ms; Musterbefund pl 9.409 → 6.548 ms (Σ 586 → 618 ms, max 206 → 260 ms — gleichwertig, bewertet: kein Long Task > 300 ms mobil).
- **Desktop:** Hydration-Ende 180–366 ms, Long Tasks max 114 ms.
- **Interaktion (LAB-Surrogat, kein INP):** Event-Timing mobil 412 px, CPU 4× (PT25.5-Test 4, Closure-Lauf): Mobilmenue oeffnen 72 ms, schliessen 24 ms, Consent ablehnen 64 ms, Bestelldialog oeffnen 112 ms — alle ≤ 200 ms (Qualitaetsziel, **kein INP**)
- **Unkomprimierter Origin — Befund:** FCP mobil kalt 2.080–4.036 ms (PT25.1 2.292–3.496); HTML-schwere Routen sind dort langsamer (Musterbefund de 3.496 → 4.036, pl 2.856 → 3.996, Epigenetics Hub 3.176 → 3.524 ms), weil das Inline-CSS das unkomprimierte HTML um ~95 KB vergroessert. Warm (zweiter Aufruf, HTML `no-store`) FCP 232–300 → 864–1.928 ms. **Produktionspfad gzip:** gemessen in der Closure auf 7 Routen (Tabellen unten): **kalt** FCP 1.048–1.204 ms → **584–904 ms** (−240 bis −528 ms), **Wiederholungsansicht** (zweiter Aufruf, warmer Cache) FCP 248–292 ms → **448–628 ms** (+200 bis +352 ms; schwere HTML-Routen Epigenetics Hub +352, Musterbefund pl +332 ms), dabei verschwinden die Warm-CLS-Spitzen (max 0,183 / 0,249 → 0,003). **Bewertung:** gemessener Trade-off aus PT25.4 (§28.6), in der Closure auf mehr Routen bestaetigt und fuer schwere Routen hoeher als dort angegeben (+0,17–0,25 s auf 3 leichten Routen). Absolut bleibt die Wiederholungsansicht ≤ 628 ms; nicht budgetiert → AP27-Handoff.

**Kalt — gzip, mobil gedrosselt** (verschraenkt, Median aus 5, mobil 412×823 CDP 4× CPU / 150 ms / 1,6 Mbit/s, gzip-Proxy; vorher = PT25.3-Build mit Vorher-Server ohne Inline-CSS; Load1 je Wiederholung 1.41 / 1.29 / 1.6 / 1.49 / 1.64)

| Route                                         | FCP ms vorher → Closure | LCP ms vorher → Closure | Δ FCP | Hydration-Ende ms | CLS max vorher → Closure | Transfer KB |
| --------------------------------------------- | ----------------------- | ----------------------- | ----- | ----------------- | ------------------------ | ----------- |
| /de/                                          | 1.172 → 672             | 1.172 → 772             | −500  | 2.622 → 2.529     | 0.004 → 0.004            | 376 → 377   |
| /de/contact                                   | 1.048 → 592             | 1.048 → 592             | −456  | 2.397 → 2.323     | 0.003 → 0.004            | 368 → 369   |
| /de/epigenetics                               | 1.192 → 856             | 1.192 → 856             | −336  | 2.433 → 2.429     | 0.004 → 0.004            | 401 → 401   |
| /de/epigenetics/musterbefund/metabolic-health | 1.204 → 904             | 1.204 → 904             | −300  | 2.575 → 2.468     | 0.003 → 0.004            | 426 → 426   |
| /pl/epigenetics/musterbefund/metabolic-health | 1.132 → 892             | 1.132 → 892             | −240  | 2.723 → 2.852     | 0.003 → 0.004            | 514 → 514   |
| /pl/                                          | 1.152 → 680             | 1.152 → 792             | −472  | 2.884 → 3.020     | 0.003 → 0.003            | 463 → 464   |
| /de/consumer/vitamin-d3-spray                 | 1.112 → 584             | 1.112 → 584             | −528  | 2.933 → 2.783     | 0.000 → 0.000            | 442 → 442   |

**Wiederholungsansicht — gzip, mobil gedrosselt** (verschraenkt, Median aus 5, mobil 412×823 CDP 4× CPU / 150 ms / 1,6 Mbit/s, gzip-Proxy; vorher = PT25.3-Build mit Vorher-Server ohne Inline-CSS; Load1 je Wiederholung 1.46 / 1.86 / 1.52 / 1.87 / 1.72)

| Route                                         | FCP ms vorher → Closure | LCP ms vorher → Closure | Δ FCP | Hydration-Ende ms | CLS max vorher → Closure | Transfer KB |
| --------------------------------------------- | ----------------------- | ----------------------- | ----- | ----------------- | ------------------------ | ----------- |
| /de/                                          | 292 → 496               | 312 → 496               | +204  | 720 → 777         | 0.183 → 0.003            | 392 → 410   |
| /de/contact                                   | 248 → 448               | 248 → 448               | +200  | 602 → 693         | 0.003 → 0.003            | 380 → 398   |
| /de/epigenetics                               | 276 → 628               | 276 → 628               | +352  | 786 → 936         | 0.004 → 0.004            | 425 → 442   |
| /de/epigenetics/musterbefund/metabolic-health | 268 → 572               | 268 → 572               | +304  | 795 → 863         | 0.004 → 0.004            | 453 → 470   |
| /pl/epigenetics/musterbefund/metabolic-health | 284 → 616               | 284 → 616               | +332  | 715 → 878         | 0.004 → 0.004            | 541 → 559   |
| /pl/                                          | 260 → 500               | 316 → 500               | +240  | 715 → 787         | 0.249 → 0.003            | 480 → 497   |
| /de/consumer/vitamin-d3-spray                 | 280 → 472               | 292 → 472               | +192  | 649 → 744         | 0.061 → 0.000            | 455 → 473   |

### 30.14 Chunk Map, 30.15 JS und 30.16 CSS

| Kennzahl                   | PT25.1 (raw / gzip / brotli KB) | Closure (raw / gzip / brotli KB)    |
| -------------------------- | ------------------------------- | ----------------------------------- |
| **Initial-JS** (4 Dateien) | 528,1 / 165,5 / 142,3           | **472,0 / 153,3 / 132,7**           |
| `assets/index`             | 404,8 / 122,5 / 103,6           | 348,8 / 110,3 / 94,1                |
| `assets/vendor-i18n`       | 65,6 / 21,8 / 19,7              | 65,6 / 21,8 / 19,7                  |
| `assets/vendor-react`      | 43,6 / 15,7 / 14,1              | 43,6 / 15,7 / 14,1                  |
| `assets/vendor-seo`        | 14,0 / 5,4 / 4,8                | 14,0 / 5,4 / 4,8                    |
| **Initial-CSS**            | 92,1 / 16,5 / 13,2              | 92,5 / 16,6 / 13,3 (inline im HTML) |
| Dynamische Chunks          | 65 (1950,9 KB raw)              | 135 (2019,9 KB raw)                 |

**Route-JS zusaetzlich zum Initial-JS (gzip KB, Chunks):**

| Route            | PT25.1         | Closure        |
| ---------------- | -------------- | -------------- |
| diagnostics-hub  | 5,4 (3)        | 5,5 (3)        |
| service-detail   | 8,5 (6)        | 8,5 (6)        |
| igloo-pro        | 4,8 (3)        | 4,9 (3)        |
| epigenetics-hub  | 27,9 (18)      | 28,1 (19)      |
| epigenetics-deep | 10,5 (7)       | 10,5 (7)       |
| musterbefund     | 115,9 (9)      | 23,4 (9)       |
| articles-index   | 5,7 (7)        | 5,8 (7)        |
| article-detail   | 33,9 (9)       | 34,1 (10)      |
| events           | 6,1 (4)        | 6,2 (4)        |
| downloads        | 12,3 (9)       | 12,3 (9)       |
| contact          | 10,7 (9)       | 10,9 (10)      |
| not-found        | 1,7 (3)        | 2,0 (4)        |
| home             | im Entry-Chunk | im Entry-Chunk |
| consumer-d3      | im Entry-Chunk | 14,1 (7)       |
| consumer-duo     | im Entry-Chunk | 12,9 (5)       |

**Groesste dynamische Chunks Closure (raw / gzip KB):** `die-gruene-praxis` 66,8 / 27,2 · `der-unsichtbare-patient` 56,6 / 23,9 · `precision-in-point-of-care-the-key-to-patient-safety` 53,1 / 20,4 · `the-ecosystem-of-rapid-tests-why-compatibility-creates-safety` 46,9 / 18,6 · `die-5-minuten-diagnose` 45,8 / 19,0 · `MusterbefundPage` 44,6 / 12,0 · `die-performance-formel-effizienz-in-der-poc-diagnostik` 37,4 / 14,7 · `PriceBadge` 36,5 / 10,0 · `EpigeneticsPage` 34,5 / 8,2 · `metabolic-health.fr` 34,4 / 10,6

**Fonts emittiert:** cyrillic-ext 25,4 · cyrillic 18,3 · greek-ext 11,0 · greek 18,6 · latin-ext 83,1 · latin 47,1 · vietnamese 10,0 = 213,4 KB; @font-face: 9 (davon swap 7).

**Bilder emittiert:** 66 Dateien, 2890,7 KB (jpeg 1067,7 · webp 1409,0 · jpg 93,0 · avif 321,0); PT25.1: 42 Dateien, 2333,8 KB.

- **Initial-JS** 528,1 / 165,5 KB (PT25.1) → **472,0 / 153,3 KB** raw/gzip (Budget 164.778 B gzip). Entry 404,8 → 348,8 KB raw: Consumer-Seiten nicht mehr im Entry, i18n-Zustand im SSR.
- **Heavy-Initial-Imports:** Musterbefund-Route 115,9 → **23,4 KB gzip** plus genau ein Sprachinhalt (PT25.2; Closure-Test 8: auf `/de/` kein fremder Seiten- oder Befund-Chunk, Musterbefund laedt genau `metabolic-health.de.json`). `react-dom/client` bleibt bewusst im Entry (gemessen §26.2: Vendor-Split kostet unkomprimiert +284 bis +352 ms FCP). `tailwind-merge` 24,7 KB (P3) begruendet akzeptiert.
- **Groesstes Route-JS:** Artikel-Detail 34,1 KB gzip (Budget 36.711 B); Epigenetics Hub 28,1 KB.
- **CSS:** 94.752 B roh / 17.007 B gzip-9 (16,6 KB), ein Stylesheet, **inline im SSR-Kopf**, pro Route 14–23 KB genutzt (Font-/CSS-Inventar: `/de/articles/die-gruene-praxis` 16 von 93 KB). Kein Async-CSS, kein `<link rel=stylesheet>`; FOUC = 0 (PT25.4-Test 4), Fokus sofort (Test 6). Budget 99.490 B roh / 17.858 B gzip.

### 30.17 Images und 30.18 LCP Media

- **Inventar (Closure, 17 Routen × 390/768/1440 = 51 Messungen, ohne Scrollen):** 2.173 KB geladen — identisch zum PT25.3-Endstand (PT25.3-Vorher 2.698 KB); je Viewport 737 / 790 / 647 KB.
- **Layout-Reservierung:** 0 sichtbare Bilder ohne `width`/`height`; bildbedingter CLS 0,000 in 51/51.
- **LCP-Medien:** 0 LCP-Bilder `lazy`; hoechstens 1 `fetchpriority="high"` je Seite; Artikel-Hero AVIF eager/high, genau ein Request (PT25.3-Test 2 in der Closure gruen).
- **Unter dem Falz:** 0 eager Bilder ohne Ausnahme; 4 belegte Ausnahmen bei 390 px (LCP-Bild groesserer Viewports, §30.25). Gate mobil 412 px: 0 Verstoesse ausser den 3 Budget-Ausnahmen.
- **Responsive:** 0 sichtbare Bilder > 20 KB ohne `srcset`; 0 Bilder mit > 2× benoetigter Breite und > 10 KB (Gate + Inventar); Kandidatenwahl je Viewport PT25.3-Test 4 gruen.
- **Formate/Qualitaet:** AVIF nur mit Byte- und PSNR-Gewinn (§27.2); visueller Vergleich PT25.3-Test 6 (PSNR ≥ 30 dB) und PT25.4-Test 4 (≥ 35 dB) in der Closure gruen.
- **OG/Social:** getrennt vom Renderpfad, OG/Twitter/JSON-LD-Bilder unveraendert und erreichbar (PT25.3-Test 7 gruen).
- **Bytes je Route (Gate, gzip, mobil):** Bilder 64,9–150,2 KB, LCP-Bild 0–70,9 KB (Spray desktop) — alle Budgets gehalten.
- **Consumer-Hero-Ablation (Closure, schliesst offenen Punkt §29.11-4):** mobil gedrosselt, 7 verschraenkte Laeufe: `lazy` statt eager/high laedt dasselbe Bild trotzdem ohne Scrollen (1 Request, 70.904 bzw. 50.020 B), nur spaeter (Start 453 statt 84 ms bzw. 408 statt 76 ms); FCP/LCP (Text-`h1`) 456 → 468 bzw. 408 → 428 ms. **Kein Byte-Gewinn** → Gegenbeweis, Ausnahme bleibt.

### 30.19 Fonts

- **Inventar:** eine selbst gehostete Familie `@fontsource-variable/inter` 5.2.8, 7 Subsets emittiert (213,4 KB), 7 `@font-face` mit `font-display: swap`, 2 `Inter Fallback`-Faces (Arial-metrische `local()`-Quellen, Normal/Fett, Werte §28.2).
- **Requests (Closure-Inventar, 32 Messungen):** de/en 1 (`latin` 47,1 KB), pl/cs 2 (+ `latin-ext`), Musterbefund de 2 (+ `greek`), Musterbefund pl 3 (Gate); **0 extern, 0 doppelt, genau 1 Preload** (`latin`).
- **Bytes je Route (Gate):** 47,1 / 65,7 / 130,2 / 148,7 KB (de / Musterbefund / pl / Musterbefund pl); Budgets exakt je Anzahl, Bytes +5 %.
- **Fallback/FOIT:** kein FOIT (`swap`); Fallback-Faces geladen, sobald benoetigt.
- **Font-CLS:** §30.9 — Suite-Modus 0,8152 → 0,0067.

### 30.20 Request Waterfalls

- **i18n-Stufe:** PT25.1 30 Locale-Dateien vor der Hydration (15 bei `/en/`) → Closure **15** je Route, davon nur **3–12 vor dem Hydration-Start** (SSR-Namespaces im i18n-Zustand; restliche Namespaces laden nach der Hydration, ohne sie zu blockieren). Keine Namespace-Preloads.
- **Requests je kalter Ladung:** 25–57 → **24–42**.
- **JS-Stufe:** Startseite 4 Initial-Dateien vor dem Hydration-Start, danach 0 JS-Requests; Route-Chunks lazy Seiten nur fuer die Zielroute; kein serieller Chunk-Wasserfall ueber den Entry hinaus (Route-JS-Budgets, Test 8).
- **CSS/Fonts:** CSS kein Request (inline); `latin` per Preload parallel zum Dokument; `latin-ext`-Preload gemessen verworfen (§28.3).
- **Keine Waterfall-Regression:** Hydration-Ende auf allen 18 Routen mobil frueher als PT25.1 (−164 bis −3.128 ms, unkomprimiert).

### 30.21 AP23 Technical Metrics Boundary

| Punkt                             | Zustand (Closure)                                                                                                                                                            |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Transport                         | nicht aktiviert; keine Senke registriert; Policy-Gate `NO_TRANSPORT_CONFIGURED`                                                                                              |
| Trennung von Marketing            | kein GTM-/GA4-/`dataLayer`-Pfad fuer technische Metriken; Closure: 0 Metrik-Eintraege im `dataLayer`, 0 Beacons, 0 metrikartige Requests auf 18 Routen (PT25.5-Suite Test 7) |
| PII / Rohdaten                    | Sammler meldet Pfad ohne Query (AP23 `separation.test.ts`); Budget-Gate speichert nur Origin + Pfad                                                                          |
| Provider-neutral                  | `report.ts`-Senke ohne Anbieter; Schwellen einzig in `WEB_VITAL_THRESHOLDS`                                                                                                  |
| Kein falsch behaupteter Transport | State und Vertrag fuehren `FIELD_METRICS = NOT_AVAILABLE`, `INP_FIELD = NOT_AVAILABLE`                                                                                       |
| Offen fuer spaetere Freigabe      | Sammler summiert CLS ohne Session-Fenster und meldet max. Event-Dauer als „INP" — vor jeder Aktivierung an die CWV-Definition anpassen (AP26/AP28 + AP23)                    |

### 30.22 AP24 Accessibility Handoff

| Vertrag (ACCESSIBILITY-CONTRACT §12.1, §20) | Closure-Nachweis                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fokus-Sicherheitsnetz im CSS                | unveraendert im Inline-Stylesheet; sichtbarer Fokus vor dem Laden der Schrift (PT25.4-Test 6) und erster Tabstopp auf 24 Seiten (PT25.5-Test 5)                                                                                                                                                                    |
| `prefers-reduced-motion`                    | Dauern ≤ 0,01 s (PT25.4-Test 6); axe unter Reduced Motion 0 Befunde in 24 Faellen (Diagnose §29.9)                                                                                                                                                                                                                 |
| Kopfzeilen-Schleier (Kontrast Navigation)   | unveraendert; kein Long-Task-Signal (§20.1)                                                                                                                                                                                                                                                                        |
| axe serious/critical                        | **0**: AP24-Gate `e2e/pt24.6.spec.ts` **25/25** (alle oeffentlichen Routen, 17 dynamische Zustaende, Kernrouten de/en/pl/fr, 390 px, Gegenprobe; Dev-SSR wie AP24, Node 22.23.2); PT25.5-Test 5 (18 Routen desktop + 6 mobil, Produktionsbuild, sichtbarer Endzustand nach Scrollen), PT25.2-Test 7, PT25.3-Test 8 |
| Responsive                                  | 390/768/1024/1440 px ohne horizontalen Ueberlauf auf 18 Routen (PT25.5-Test 6); Gate 0 Ueberlauf mobil/desktop                                                                                                                                                                                                     |

Hinweise: Der erste AP24-Gate-Lauf der Closure startete unter Node 18.20.8 nicht (Vite-Dev-Server `crypto.hash is not a function`) — Werkzeugfehler, kein Testergebnis; massgeblich ist der Lauf unter Node 22.23.2 (CI-/Produktionsversion). Die Meldung `getaddrinfo ENOTFOUND relaunch.polarisdx.net` stammt vom HMR-WebSocket des Dev-Servers (Host-Konfiguration), nicht aus der Anwendung. `D-20` (1024 px) bleibt AP27; auf den Matrix-Routen kein Ueberlauf gemessen.

### 30.23 Budgets

Budgets, Regeln und Kalibrierung: **§29.3 / §29.4, `scripts/perf/budgets.json`** (unveraendert in der Closure — kein Wert angepasst).

| Pflichtbudget       | Budget                                                               | Closure gemessen                     | Status                         |
| ------------------- | -------------------------------------------------------------------- | ------------------------------------ | ------------------------------ |
| LCP                 | `lab` je Route (mobil 590–1.130, desktop 190–280 ms) · `ci` 2.500 ms | mobil 504–1.048 · desktop 100–224 ms | gehalten                       |
| CLS                 | `lab` 0,006–0,011 je Route · `ci` 0,1                                | ≤ 0,0043                             | gehalten                       |
| INP                 | Field-only: `INP_FIELD = NOT_AVAILABLE`; LAB-Surrogat ≤ 200 ms       | Surrogat 24–112 ms                   | wahrheitsgemaess klassifiziert |
| TTFB                | `lab` 40–60 ms · `ci` 800 ms                                         | 14–39 ms                             | gehalten                       |
| Initial-JS          | 164.778 B gzip                                                       | 156.931 B                            | gehalten                       |
| Initial-CSS         | 99.490 B roh / 17.858 B gzip                                         | 94.752 / 17.007 B                    | gehalten                       |
| Groesstes Route-JS  | 36.711 B gzip                                                        | 34.962 B                             | gehalten                       |
| Hero/LCP-Bild       | je Route/Geraet +5 % (z. B. Igloo 19.438 B, Spray 74.450 B)          | 18.512 / 70.904 B                    | gehalten                       |
| Bilder je Kernroute | je Route/Geraet +5 %                                                 | 64,9–150,2 KB                        | gehalten                       |
| Fonts               | Requests exakt, Bytes +5 %, 1 Preload, 0 extern                      | 1–3 Requests, 47,1–148,7 KB          | gehalten                       |

Closure-Pruefung: `ci` **852/852** (Node 22.23.2), `lab` **888/888** (Node 18.20.8), statisch **24/24** — 0 Verletzungen, 0 fehlende Budgets.

### 30.24 CI Enforcement

| Punkt               | Zustand                                                                                                                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Integration         | Job `performance` in `.github/workflows/ci.yml` (Build mit Manifest → statische Budgets → Chromium → Laufzeit-Budgets → Bericht als Artefakt)                                                                                         |
| Closure-Ausfuehrung | dieselben Schritte lokal unter **Node 22.23.2**: `npm run perf:budget:build` Exit 0 → `check:perf-budget -- --static-only` 24/24 → `check:perf-budget -- --json` 852/852, Exit 0                                                      |
| Gegenprobe          | PT25.5-Test 1 in der Closure: PT25.1-Build und PT25.3-Build → Exit 1 mit Meldung; zu knappes LCP-Budget → Exit 1 mit Route/Geraet/Wert/Budget                                                                                         |
| GitHub-Runner       | **nicht gelaufen** (kein Push in AP25) → AP27-Handoff §30.30                                                                                                                                                                          |
| Nicht AP25          | Der bestehende CI-Schritt `npx prettier --check .` (Job `quality`) meldet 34 Dateien ausserhalb AP25 (`wireframes/`, `_project-knowledge/`, `.archon/`, alte Docs, `docker-compose.yml`, `email/`); alle AP25-Dateien sind formatiert |

### 30.25 Known Exceptions

| Ausnahme                                                                                                                        | Beleg                                                                                                                                   | Umgang                                       |
| ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Eager unter dem Falz mobil: Diagnostics-Hero, Consumer-Heros Spray/Duo (Gate 412 px) sowie erste Artikelkarte (Inventar 390 px) | LCP ab 768 px; Diagnostics-Ablation §27.5; Consumer-Ablation Closure §30.17 (kein Byte-Gewinn); Artikelkarte 29 px unter dem Falz §27.1 | in `budgets.json` bzw. PT25.3-Test 3 benannt |
| Lighthouse mobil gzip simuliert LCP > 2,5 s auf einzelnen Routen                                                                | Lantern-Simulation; echtes Chrome gleiche Drosselung ≤ 1.048 ms; §29.6, §30.6                                                           | kein Gate auf Lighthouse                     |
| Unkomprimierter Origin: schwere HTML-Routen langsamer als PT25.1, Warm-FCP deutlich hoeher                                      | Inline-CSS vergroessert unkomprimiertes HTML; Produktion immer hinter gzip (Host-nginx §3.2, DEP-41)                                    | Produktionspfad gzip gemessen §30.13         |
| Wiederholungsansicht nicht budgetiert                                                                                           | Gate misst kalt                                                                                                                         | AP27-Handoff                                 |
| `/pl/` 1440 px Font-Swap-CLS 0,0546                                                                                             | nur Headless-Shell; Suite-Modus 0,0000                                                                                                  | §28.1                                        |
| `search-modal`-Test „Leerzustand" rot                                                                                           | Locator-Konflikt mit `RouteAnnouncer`, identisch auf PT25.1-/PT25.3-Build                                                               | vorbestehend, AP27-Testpflege                |
| `navigation`-Test „alle neun Services mobil" gelegentlich rot                                                                   | Klick vor der Hydration ohne Warten; Closure 20/20 gruen, PT25.3-Build 19/20                                                            | vorbestehend (flaky), AP27-Testpflege        |
| Repositoryweites Prettier 34 Dateien                                                                                            | ausserhalb AP25                                                                                                                         | nicht AP25                                   |
| Node-Versionen falsch dokumentiert                                                                                              | §30.3                                                                                                                                   | korrigiert                                   |

### 30.26 Preview Isolation

| Punkt                | Zustand (Closure)                                                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Messziele            | Gate, Collector, Suiten und Lighthouse ausschliesslich gegen `127.0.0.1`                                                                                       |
| Fremde Hosts         | Budget-Gate und PT25.5-Suite starten Chromium mit `--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1`; jeder Versuch wird gezaehlt und ist ein Fehler   |
| PREVIEW              | nur lesende HTTP-Abrufe ohne Browser/JS fuer TTFB (§30.11); kein Consent, kein Formular, keine Analytics-Ausfuehrung                                           |
| Preview → Production | kein Metrics-Transport aktiv; PREVIEW-Image weiterhin `ap23-preview-20260911` (Drift §22.1) — kein Deploy in AP25                                              |
| Leads                | keine Suite der Closure sendet Formulare ab; Suiten mit echtem Absenden oder Consent-Erteilung sind bewusst nicht Teil des AP25-Gates (AP19/AP20/AP23-Evidenz) |

### 30.27 Before/After Evidence (PT25.1 → Closure)

| Kennzahl                                   | PT25.1 (Baseline)             | Closure                        | Quelle                      |
| ------------------------------------------ | ----------------------------- | ------------------------------ | --------------------------- |
| Initial-JS gzip                            | 165,5 KB                      | **153,3 KB**                   | Manifest                    |
| Musterbefund-Route gzip                    | 115,9 KB                      | **23,4 KB**                    | Manifest                    |
| Consumer-Seiten                            | im Entry                      | eigene Chunks (14,1 / 12,9 KB) | Manifest                    |
| Locale-JSON vor Hydration-Start (mobil)    | 14–30                         | **3–12**                       | Collector                   |
| Hydration-Ende mobil kalt (unkomprimiert)  | 6.712–9.409 ms                | **5.387–6.548 ms**             | Collector                   |
| Long Tasks max mobil kalt                  | 108–712 ms                    | **125–300 ms**                 | Collector                   |
| Lighthouse mobil unkomprimiert LCP / Score | 4.852–6.273 ms / 0,63–0,71    | **4.483–5.843 ms / 0,65–0,74** | Lighthouse 13.4.1           |
| Lighthouse desktop unkomprimiert LCP       | 936–1.191 ms                  | 865–1.273 ms                   | Lighthouse 13.4.1           |
| LCP-Bild Artikel                           | `lazy`, WebP                  | eager/high, AVIF               | Inventar                    |
| Bildbytes ohne Scrollen (51 Messungen)     | 2.698 KB (PT25.2-Stand)       | **2.173 KB**                   | Inventar                    |
| CSS                                        | render-blockierender Link     | inline im SSR-Kopf, 0 Requests | Gate                        |
| Font-Fallback                              | Status `error`                | beide Faces `loaded`           | Font-Inventar               |
| Font-Swap-CLS Summe (Schrift +2 s, Suite)  | 0,8152 (PT25.3-Stand)         | **0,0067**                     | PT25.4-Test 5               |
| Wiederholungsaufruf-CLS mobil              | 0,175–0,292                   | **0** (0/6)                    | cls-warm-repro              |
| Warm-FCP mobil gzip                        | 248–292 ms (PT25.3-Stand)     | 448–628 ms (Trade-off)         | Variantenvergleich          |
| Kalt-FCP mobil gzip                        | 1.048–1.204 ms (PT25.3-Stand) | **584–904 ms**                 | Variantenvergleich          |
| Budget-Gate                                | keiner                        | `ci` 852/852 · `lab` 888/888   | check-budgets               |
| Anbieter-Requests ohne Consent             | 0                             | 0                              | Gate, Collector, Lighthouse |
| axe serious/critical                       | 0                             | 0                              | Suiten                      |

### 30.28 Closure Evidence

**Closure-Laeufe** (serielle Kette, Load1 vor jedem Schritt < 3 abgewartet und protokolliert in `node_modules/.cache/ap25-closure/logs/load.log`):

| #     | Schritt                                                                                   | Ergebnis                                                                                                                                                                                                                                                                                                                       |
| ----- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 01    | `npm run perf:budget:build` (Node 22.23.2)                                                | Exit 0                                                                                                                                                                                                                                                                                                                         |
| 02    | Byte-Identitaet gegen PT25.5-Build (SHA-256)                                              | client 432/432, server 338/338, **0 Abweichungen**                                                                                                                                                                                                                                                                             |
| 03    | `bundle-report.mjs`                                                                       | Exit 0, Inventar vollstaendig                                                                                                                                                                                                                                                                                                  |
| 04    | `check:perf-budget -- --static-only` (Node 22)                                            | **24/24**                                                                                                                                                                                                                                                                                                                      |
| 05    | `check:perf-budget -- --json`, Profil `ci` (Node 22)                                      | **852/852**, Exit 0                                                                                                                                                                                                                                                                                                            |
| 06    | `check:perf-budget:lab -- --runs 3` (Node 18.20.8)                                        | **888/888**, Exit 0                                                                                                                                                                                                                                                                                                            |
| 08    | `http-matrix.mjs` LAB                                                                     | **18/18** Status, SSR-Root 18/18                                                                                                                                                                                                                                                                                               |
| 09    | `http-matrix.mjs` PREVIEW (nur lesend)                                                    | **18/18** Status, SSR-Root 18/18                                                                                                                                                                                                                                                                                               |
| 10    | `cls-warm-repro.mjs` gzip                                                                 | 0/6 Laeufe mit Shift                                                                                                                                                                                                                                                                                                           |
| 11    | Consumer-Hero-Ablation (7 Laeufe × 2 Routen × 2 Varianten)                                | lazy ohne Byte-Gewinn                                                                                                                                                                                                                                                                                                          |
| 12    | `image-inventory.mjs` (17 Routen × 3 Viewports)                                           | Exit 0, 51 Messungen                                                                                                                                                                                                                                                                                                           |
| 13    | `font-css-inventory.mjs`                                                                  | Exit 0, 32 Messungen                                                                                                                                                                                                                                                                                                           |
| 14    | Collector `e2e/pt25.1.spec.ts` mobil + desktop                                            | **2/2** (73 Navigationen; Integritaet: Status, SSR, 0 Provider, 0 Hydration-Fehler)                                                                                                                                                                                                                                            |
| 15    | `e2e/pt25.5.spec.ts`                                                                      | **8/8**                                                                                                                                                                                                                                                                                                                        |
| 16    | Breitensuiten (`url-smoke`, `search-modal`, `navigation`, `i18n-core`, `resource-center`) | **106 passed, 2 failed** — beide vorbestehend und klassifiziert: `search-modal` „Leerzustand" (Locator-Konflikt mit `RouteAnnouncer`, identisch auf PT25.1/PT25.3); `navigation` „alle neun Services mobil" (Klick vor der Hydration; Wiederholung ×10: Closure-Build 20/20 gruen, PT25.3-Build 19/20 mit identischem Timeout) |
| 17    | `e2e/pt25.2.spec.ts`                                                                      | **8/8**                                                                                                                                                                                                                                                                                                                        |
| 18    | `e2e/pt25.3.spec.ts` (vorher PT25.2 → nachher Closure-Build)                              | **9/9**                                                                                                                                                                                                                                                                                                                        |
| 19    | `e2e/pt25.4.spec.ts` (vorher PT25.3 → nachher Closure-Build)                              | **8/8**, Font-Swap-CLS 0,8152 → 0,0067                                                                                                                                                                                                                                                                                         |
| 20/28 | AP24-Gate `e2e/pt24.6.spec.ts`                                                            | Node 18: Serverstart fehlgeschlagen (Werkzeug) · **Node 22: 25/25**                                                                                                                                                                                                                                                            |
| 21    | `vitest run src/lib/monitoring src/components/seo` (Node 22)                              | **70/70**                                                                                                                                                                                                                                                                                                                      |
| 22    | `npm run check:seo`                                                                       | PASS (380 Locale-Records, 390 URLs)                                                                                                                                                                                                                                                                                            |
| 23    | `tsc` app/server, eslint (AP25-Dateien), Prettier, `check:colors`                         | tsc 0 Fehler, eslint 0 Fehler, AP25-Dateien formatiert (repositoryweit 34 Fremddateien), Farb-Guard PASS                                                                                                                                                                                                                       |
| 25/26 | Lighthouse 13.4.1 gzip + identity, 17 Routen × 2 Profile × 3                              | 204 Laeufe, 0 Abbrueche, 0 Provider                                                                                                                                                                                                                                                                                            |
| 27    | Variantenvergleich kalt + Wiederholungsansicht, gzip, 7 Routen × 5                        | Exit 0                                                                                                                                                                                                                                                                                                                         |

**False-Ready-Audit (Closure): 0 Befunde.**

| Pruefpunkt                                                            | Ergebnis                                                                                                                              |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Lighthouse-Score ohne Route/Environment                               | 0 — jede Zahl mit Route, Profil, Origin, Laeufen, Spanne                                                                              |
| Dev-Build statt Production Build                                      | 0 — Messbasis nur `vite build`; einzige Dev-SSR-Pruefung ist das AP24-Gate (dessen Methode), zusaetzlich axe auf dem Produktionsbuild |
| Mobile nur als Desktop-Viewport                                       | 0 — 412×823, DPR 1,75, `isMobile`, Drosselung                                                                                         |
| INP aus Lab-Metrik / Field-p75 ohne Sample                            | 0 — §30.10                                                                                                                            |
| grosse Route aus der Matrix entfernt                                  | 0 — 18/18                                                                                                                             |
| LCP-Element ausgeblendet/entfernt                                     | 0 — LCP-Elemente unveraendert gegenueber §7/§27                                                                                       |
| Hero lazy / `fetchpriority=high` gestreut                             | 0 / 0                                                                                                                                 |
| Bilder ohne Dimensionen / Desktop-Bild auf Mobil                      | 0 / 0                                                                                                                                 |
| externe Fontquelle / unnoetige Font-Preloads                          | 0 / 0 (genau 1)                                                                                                                       |
| CSS async ohne FOUC-/CLS-Test                                         | 0 — kein Async-CSS; Inline-CSS mit Tests                                                                                              |
| Chunk-Split mit seriellen Waterfalls / schwere Daten global           | 0 / 0                                                                                                                                 |
| GTM/GA4 als Metrics-Transport / PII in Metrics / Preview → Production | 0 / 0 / 0                                                                                                                             |
| A11y-/Fokus-CSS fuer Bytes entfernt                                   | 0                                                                                                                                     |
| Consent verzoegert/umgangen                                           | 0                                                                                                                                     |
| Budget ohne Evidence erhoeht                                          | 0 — die Closure hat keinen Budgetwert geaendert                                                                                       |
| Netzwerkrequests herausgefiltert                                      | 0 — Fremd-Hosts werden nicht gefiltert, sondern gezaehlt und sind Fehler                                                              |
| CI-Gate nur als Kommentar                                             | 0 — Job integriert, CI-Schritte lokal ausgefuehrt                                                                                     |
| AP26 als complete markiert                                            | 0                                                                                                                                     |

**PERF-Invarianten (Closure-Bewertung):**

| ID      | Status | Evidenz (Closure)                                                                                                                                                 |
| ------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PERF-01 | PASS   | AP-STATE: AP24 COMPLETE, AP24-CLOSURE PASS (2026-09-11)                                                                                                           |
| PERF-02 | PASS   | Build, Tool, Umgebung, Route je Messung (§30.2–§30.5); Closure-Build byte-identisch zum PT25.5-Build; alle Skripte/Konfigurationen im Repository                  |
| PERF-03 | PASS   | Gate mobil 18 Routen × 3 (lab + ci), Collector mobil, Lighthouse mobil gzip + identity (unkomprimiert LCP 17/17 besser als PT25.1; gzip simuliert 2.315–2.996 ms) |
| PERF-04 | PASS   | Gate desktop, Collector desktop, Lighthouse desktop (unkomprimiert 865–1.273 ms, gzip 508–787 ms)                                                                 |
| PERF-05 | PASS   | §30.10: alle Werte LAB, FIELD_METRICS NOT_AVAILABLE                                                                                                               |
| PERF-06 | PASS   | INP_FIELD NOT_AVAILABLE, INP_LAB NOT_CLAIMED_AS_FIELD; Event-Timing nur als Surrogat benannt                                                                      |
| PERF-07 | PASS   | SSR 18/18 LAB + PREVIEW, PT25.2-Test 1/2, PT25.5-Test 2                                                                                                           |
| PERF-08 | PASS   | LAB-Origin kalt 14–48 / warm 11–35 ms, Browser 14–39 ms, PREVIEW 15–96 ms (§30.11)                                                                                |
| PERF-09 | PASS   | Musterbefund/Epigenetics Hydration + Long Tasks bewertet (§30.13)                                                                                                 |
| PERF-10 | PASS   | Musterbefund-Route 115,9 → 23,4 KB gzip; Test 8: keine fremden Seiten-/Befund-Chunks auf `/de/`                                                                   |
| PERF-11 | PASS   | Chunk-Werte aus Vite-Manifest des Closure-Produktionsbuilds (§30.14)                                                                                              |
| PERF-12 | PASS   | Hydration-Ende auf 18/18 Routen frueher; keine seriellen Chunk-Stufen (§30.20)                                                                                    |
| PERF-13 | PASS   | LCP-Element je Route/Geraet (Gate) und Viewport (Inventar)                                                                                                        |
| PERF-14 | PASS   | 0 LCP-Bilder lazy, ≤ 1 `fetchpriority=high`, Artikel-Hero AVIF eager/high                                                                                         |
| PERF-15 | PASS   | 0 eager unter dem Falz ohne belegte Ausnahme; Consumer-Ablation: lazy ohne Byte-Gewinn                                                                            |
| PERF-16 | PASS   | 0 Bilder ohne `width`/`height`, bildbedingter CLS 0 in 51/51                                                                                                      |
| PERF-17 | PASS   | 0 Bilder > 2× benoetigte Breite (> 10 KB), 0 grosse Bilder ohne `srcset`, PT25.3-Test 4                                                                           |
| PERF-18 | PASS   | AVIF nur mit Byte-/PSNR-Gewinn (§27.2), Guard `check:article-images`                                                                                              |
| PERF-19 | PASS   | PT25.3-Test 7: OG/Twitter/JSON-LD unveraendert                                                                                                                    |
| PERF-20 | PASS   | PT25.3-Test 6 (PSNR ≥ 30 dB), PT25.4-Test 4 (≥ 35 dB)                                                                                                             |
| PERF-21 | PASS   | Font-Inventar: 7 Subsets, Requests je Locale (§30.19)                                                                                                             |
| PERF-22 | PASS   | 7× `swap`, 2 Fallback-Faces, kein FOIT                                                                                                                            |
| PERF-23 | PASS   | Font-Swap-CLS 0,8152 → 0,0067 (Suite), keine Route schlechter                                                                                                     |
| PERF-24 | PASS   | 0 externe, 0 doppelte Font-Requests, 1 Preload                                                                                                                    |
| PERF-25 | PASS   | CSS-Budget aus dem Build (94.752 B), Gate statisch                                                                                                                |
| PERF-26 | PASS   | PT25.4-Test 4: erster Frame gestylt, h1 sichtbar                                                                                                                  |
| PERF-27 | PASS   | PT25.4-Test 6 (Fokus vor Schriftladung), PT25.5-Test 5 (erster Tabstopp sichtbar, 24 Seiten)                                                                      |
| PERF-28 | PASS   | PT25.4-Test 6: Reduced-Motion-Dauern ≤ 0,01 s; axe mit `prefers-reduced-motion` 0 Befunde (Diagnose)                                                              |
| PERF-29 | PASS   | 0 Anbieter-Requests ohne Consent (Gate 216 Messungen, Collector 73, PT25.2-Test 6, PT25.5-Test 3/7), Ablehnung bleibt nach Reload                                 |
| PERF-30 | PASS   | kein GTM/GA4-Pfad fuer Metriken, 0 Metrik-Eintraege im dataLayer, `separation.test.ts`                                                                            |
| PERF-31 | PASS   | AP23-Tests (Pfad ohne Query, keine Props/Kennungen) 70/70 unter Node 22; Gate speichert nur Origin + Pfad                                                         |
| PERF-32 | PASS   | Messungen nur 127.0.0.1, fremde Hosts nicht aufloesbar, PREVIEW nur lesende HTTP-Abrufe                                                                           |
| PERF-33 | PASS   | Transport nicht aktiv und nirgends als aktiv behauptet                                                                                                            |
| PERF-34 | PASS   | Navigation, Suche, Sprache, Consent, Formular-Validierung, Resource-Gate, Consumer-Dialog, Mobilmenue (PT25.5-Test 3, PT25.2-Test 5, Breitensuiten)               |
| PERF-35 | PASS   | PT25.5-Test 2, `check:seo`, `url-smoke`, `resource-center`-SEO                                                                                                    |
| PERF-36 | PASS   | PT25.5-Test 5 (axe 24 Seiten, sichtbarer Endzustand), PT25.2-Test 7, PT25.3-Test 8, AP24-Gate `pt24.6` 25/25                                                      |
| PERF-37 | PASS   | §30.23 Pflichtbudgets vollstaendig                                                                                                                                |
| PERF-38 | PASS   | `check-budgets.mjs` + CI-Job, Closure lokal CI-gleich gruen                                                                                                       |
| PERF-39 | PASS   | False-Ready-Audit §30.28: 0                                                                                                                                       |
| PERF-40 | PASS   | AP26 NOT STARTED                                                                                                                                                  |

**Closure-Gate-Matrix C25:**

| ID     | Status | Evidenz (Closure)                                                                                                                        |
| ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| C25-01 | PASS   | AP24 COMPLETE / AP24-CLOSURE PASS                                                                                                        |
| C25-02 | PASS   | `DECISIONS.md` Coverage 18/18 `LOCKED`; AP-STATE „Decision Locks 18/18"; AP25 beruehrt keinen Lock (DEC-RL-004/REST-02 Consent erhalten) |
| C25-03 | PASS   | reproduzierbare Befehle §3.4/§30.24; Closure-Build byte-identisch; Gate/Lighthouse neu ausgefuehrt                                       |
| C25-04 | PASS   | Matrix 18 Routen §30.5, unveraendert                                                                                                     |
| C25-05 | PASS   | alle Werte auf `vite build` Produktionsbuild, Server `NODE_ENV=production`                                                               |
| C25-06 | PASS   | mobil: Gate 18 × 3 (2 Profile), Collector, Lighthouse gzip + identity                                                                    |
| C25-07 | PASS   | desktop: dasselbe                                                                                                                        |
| C25-08 | PASS   | LCP je Route/Geraet §30.6/§30.8                                                                                                          |
| C25-09 | PASS   | CLS je Route/Geraet, bild-/schrift-/warm-bedingt §30.9                                                                                   |
| C25-10 | PASS   | §30.10                                                                                                                                   |
| C25-11 | PASS   | Origin + PREVIEW-TTFB §30.11                                                                                                             |
| C25-12 | PASS   | Initial-JS 472,0 / 153,3 KB aus Manifest                                                                                                 |
| C25-13 | PASS   | Route-JS je Matrix-Route, groesste Chunks §30.14                                                                                         |
| C25-14 | PASS   | CSS 94.752 B roh aus Build, inline, Nutzung je Route                                                                                     |
| C25-15 | PASS   | Bild-Inventar 51 Messungen, emittierte Dateien, Bytes je Route                                                                           |
| C25-16 | PASS   | Font-Dateien 213,4 KB, Requests/Bytes je Route                                                                                           |
| C25-17 | PASS   | SSR 18/18                                                                                                                                |
| C25-18 | PASS   | echte 404 (LAB + PREVIEW, `url-smoke` alle Locales)                                                                                      |
| C25-19 | PASS   | einstufige 301 (`url-smoke` G9, PT25.2-Test 3, PT25.5-Test 2)                                                                            |
| C25-20 | PASS   | 0 Hydration-Fehler, Hydration-Ende 5,4–6,5 s mobil unkomprimiert (PT25.1 6,7–9,4 s)                                                      |
| C25-21 | PASS   | Musterbefund-Sprachsplit, Consumer aus dem Entry; `react-dom/client` und `tailwind-merge` begruendet akzeptiert                          |
| C25-22 | PASS   | keine Waterfall-Regression §30.20                                                                                                        |
| C25-23 | PASS   | LCP-Kandidat je Kernroute §30.8                                                                                                          |
| C25-24 | PASS   | 0 lazy LCP, ≤ 1 high                                                                                                                     |
| C25-25 | PASS   | 0 eager unter dem Falz ohne belegte Ausnahme                                                                                             |
| C25-26 | PASS   | 0 Bilder ohne Dimensionen, Bild-CLS 0                                                                                                    |
| C25-27 | PASS   | `srcset`/`sizes`, Kandidatenwahl (PT25.3-Test 1/4), 0 uebergrosse                                                                        |
| C25-28 | PASS   | PSNR-Tests gruen                                                                                                                         |
| C25-29 | PASS   | OG/Social PT25.3-Test 7                                                                                                                  |
| C25-30 | PASS   | 0 externe Font-Requests, Quellen vollstaendig                                                                                            |
| C25-31 | PASS   | `swap` + Fallback-Metriken dokumentiert §28.2                                                                                            |
| C25-32 | PASS   | Font-CLS 0,0067 (Suite)                                                                                                                  |
| C25-33 | PASS   | kein FOUC                                                                                                                                |
| C25-34 | PASS   | Fokus sofort + sichtbarer erster Tabstopp                                                                                                |
| C25-35 | PASS   | Reduced Motion ≤ 0,01 s                                                                                                                  |
| C25-36 | PASS   | 0 Anbieter-Requests ohne Consent                                                                                                         |
| C25-37 | PASS   | keine Marketing-Kennungen/-Vokabeln im Metrikpfad (`separation.test.ts`)                                                                 |
| C25-38 | PASS   | keine PII/Query/Nutzereingaben (AP23-Tests, Gate nur Pfad)                                                                               |
| C25-39 | PASS   | §30.26                                                                                                                                   |
| C25-40 | PASS   | Kerninteraktionen gruen; vorbestehende Testfehler `search-modal`/`navigation` klassifiziert (§30.25)                                     |
| C25-41 | PASS   | Kopf/Canonical/hreflang/x-default 18 Routen, `resource-center`-SEO, `check:seo`                                                          |
| C25-42 | PASS   | PT25.5-Test 5, PT25.2-Test 7, PT25.3-Test 8, AP24-Gate `pt24.6` 25/25                                                                    |
| C25-43 | PASS   | 390/768/1440 (+1024) ohne Ueberlauf, Gate 0 Ueberlauf                                                                                    |
| C25-44 | PASS   | §30.23                                                                                                                                   |
| C25-45 | PASS   | §29.3 Regeln + Kalibrierung; Closure: 0 Werte geaendert                                                                                  |
| C25-46 | PASS   | Gate lokal `ci` 852/852, `lab` 888/888, Gegenproben Exit 1                                                                               |
| C25-47 | PASS   | CI-Job integriert, CI-gleich lokal unter Node 22 gruen; erster GitHub-Lauf als AP27-Handoff                                              |
| C25-48 | PASS   | §30 konsolidiert, Kopfnotiz, State                                                                                                       |
| C25-49 | PASS   | False-Ready-Audit 0                                                                                                                      |
| C25-50 | PASS   | AP26 NOT STARTED, State korrekt                                                                                                          |

### 30.29 AP26 Handoff

- **CSP:** Inline-App-CSS im SSR-Kopf (PT25.4 §28.6) braucht `style-src 'unsafe-inline'` (derzeit Report-Only); bei Verschaerfung per Hash/Nonce loesen, nicht durch Rueckbau des Inline-CSS (FCP-Gewinn gemessen −0,45 bis −0,51 s).
- **Technische Metriken:** Transport bleibt aus; eine Aktivierung braucht Policy-Belege (`policy.ts`), CWV-konforme Sammlung (§30.21) und AP23-Consent-Entscheidung.
- **Consent-Netz:** Budget-Gate zaehlt Fremd-Requests auf 18 Routen × 2 Geraeten — AP26-Aenderungen an CSP/Allowlist koennen es als Regressionstest nutzen.
- **Preview:** PREVIEW-Image vor AP26-Messungen auf den aktuellen Stand bringen (Drift §22.1).
- AP26 ist **nicht gestartet**.

### 30.30 AP27 Handoff

- **CI-Lauf:** Job `performance` ist in `.github/workflows/ci.yml` integriert und lokal CI-gleich ausgefuehrt (§30.24); der erste Lauf auf einem GitHub-Runner steht aus (kein Push in AP25) — Laufzeit und Zeitgrenzen dort beobachten.
- **Budgets pflegen:** nur ueber die Regeln §29.3 mit neuer Kalibrierung; kein Anheben ohne Messung.
- **Layout:** `/pl/`-Hauptnavigation bei 1440 px an der Umbruchgrenze (§28.9); `D-20` (1024 px) — auf den Matrix-Routen kein Ueberlauf gemessen, Befund bleibt AP27.
- **Testpflege:** `e2e/search-modal.spec.ts` „Leerzustand" kollidiert mit der `RouteAnnouncer`-Live-Region (strict mode, vorbestehend seit PT25.1-Build).
- **Wiederholungsansicht:** Inline-CSS + Render-Marke kosten mobil +0,17–0,25 s FCP bei warmem Cache (§28.7); nicht budgetiert (Gate misst kalt).
- **Visuell:** keine sichtbare Aenderung aus AP25 (PSNR-Nachweise §27.6, §28.8).
