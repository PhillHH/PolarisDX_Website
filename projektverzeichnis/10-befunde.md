# 10 — Abweichungen und Altlasten

Beim Erstellen dieses Verzeichnisses aufgefallen. **Nichts davon wurde geändert** —
die Liste ist Dokumentation, keine Reparatur. Sortiert nach Auswirkung.

## 1. `scripts/prerender.mjs` führt veraltete Routen

Die `ROUTES`-Liste des Prerender-Skripts steht auf einem älteren URL-Stand:

| Im Skript                                          | Tatsächlich                                                |
| -------------------------------------------------- | ---------------------------------------------------------- |
| `/diagnostics/poc_systemloesungen`                 | `/diagnostics/poc-systemloesungen`                         |
| `/diagnostics/praeventions_checks`                 | `/diagnostics/praeventions-checks`                         |
| `/diagnostics/infektion_entzuendung`               | `/diagnostics/infektion-entzuendung`                       |
| `/diagnostics/stoffwechsel_herz`                   | `/diagnostics/stoffwechsel-herz`                           |
| `/diagnostics/hormon_tests`                        | `/diagnostics/hormon-tests`                                |
| `/diagnostics/kompatibilitaet_integration`         | `/diagnostics/kompatibilitaet-integration`                 |
| `/articles/green_practice` u. a. (Artikel-**ids**) | die Artikel-**slugs**, z. B. `/articles/die-gruene-praxis` |

Es listet außerdem drei Artikel, die es in `articles.ts` nicht mehr gibt
(`first_checkup`, `managing_diabetes`, `home_care`), und kennt weder `/epigenetics`,
noch die Musterbefunde, noch `/support`, noch die Consumer-Seiten, noch Sprachpräfixe.

**Einordnung:** Das Skript stammt aus der Zeit vor SSR und läuft nur über
`npm run build:prerender` — der reguläre `npm run build` fasst es nicht an.
Praktisch also totes Gewicht, das aber wie ein gültiger Routenkatalog aussieht.

## 2. Kommentare in `src/App.tsx` beschreiben die Consumer-Seiten falsch

Der Dateikopf (`src/App.tsx:11-16`) sagt über `/consumer/*`:

> „Sie sind »unlisted«: nicht in der Navigation, nicht in der sitemap.xml, noindex und
> server-seitig per Passwort (Basic Auth) geschützt."

Tatsächlich gilt heute:

| Behauptung             | Realität                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| nicht in der Sitemap   | **doch** — `CONSUMER_SITEMAP_ROUTES`, Prio 0.8                                                                       |
| noindex                | **nein** — die Seiten selbst notieren „Indexable: in sitemap, no noindex — campaign landing page"                    |
| Basic Auth             | **nein** — in `server.ts` existiert keine Auth-Middleware                                                            |
| gesperrt in robots.txt | **nein** — der Kopf von `robots.txt` hält ausdrücklich fest, dass `/consumer/*` inzwischen site-weit indexierbar ist |

Zutreffend bleibt allein: nicht in der Navigation verlinkt.

## 3. `casestudies.json` ist ein Namespace ohne Registrierung

`public/locales/<lang>/casestudies.json` liegt in allen zehn Sprachen vor, steht aber
in keinem Eintrag von `NAMESPACES` (`src/i18n.ts`) und wird nie geladen.
Rest des abgeschalteten Case-Study-Bereichs (`/casestudys/32reasons`), dessen Route
in `App.tsx` entfernt und dessen Menüpunkt in `Header.tsx` auskommentiert ist —
`FeaturedCaseStudy.tsx` existiert weiterhin.

Gleiches Muster beim Shop: Namespace `shop` **ist** registriert, der Menüpunkt und
die Route sind aber deaktiviert.

## 4. `nginx.conf` beschreibt ein Setup, das es so nicht gibt

Die Datei konfiguriert eine **statische** Auslieferung (`root /usr/share/nginx/html`,
`try_files $uri /index.html`) und einen Proxy `/api/` → `backend:5000`.
Das passt weder zum SSR-Express aus `docker-compose.yml` (Node auf Port 3000)
noch zur Preview (Node auf 9100 hinter Host-nginx).

Ebenso `vercel.json`: Redirects plus SPA-Rewrite auf `/index.html` — Altbestand aus der
Vercel-Zeit, ohne Wirkung auf die aktuellen Deploys.

Beide Dateien lesen sich wie gültige Deploy-Konfiguration und sind es nicht.

## 5. CSP läuft nur im Report-Only-Modus

`server.ts:428` setzt `Content-Security-Policy-Report-Only` — bewusst, um die Live-Seite
nicht zu brechen. Eine Scharfschaltung steht aus; solange sie fehlt, schützt der Header nicht.

## 6. `POST /api/consumer-order` ohne Rate-Limit

`/api/contact`, `/api/support` und `/api/roi-report` hängen am `formLimiter`,
`/api/consumer-order` nicht — bei einem öffentlich erreichbaren Bestellendpunkt
auf einer bezahlten Kampagnenseite die exponierteste der vier Formularrouten.

## 7. Veralteter TODO im ROI-Rechner

`src/components/sections/RoiCalculatorSection.tsx:108`:
„TODO Backend POST /api/roi-report (Double-Opt-in + PDF) – Folge-Task, Endpoint noch
nicht live." Der Endpoint existiert inzwischen in `server/server.js:636` inklusive
`pdfkit`. Ob das Double-Opt-in umgesetzt ist, geht aus dem Code nicht hervor.

## 8. Englische Epigenetik-Unterlagen unvollständig

`public/downloads/epigenetics/de/` enthält 17 PDFs, `en/` nur 9.
Auf Englisch fehlen die sechs Musterbefund-PDFs (10–15), die Parameterübersicht (16),
„Werte verstehen" (17) und ein `PolarisDX_Musterbefunde_EN.zip`.
Die englischen Befund-JSONs existieren dagegen vollständig — die Web-Fassung ist
zweisprachig, die PDF-Fassung nicht.

## 9. Leere Download-Kategorie

`DownloadsPage` kennt die Kategorien `tech` und `info`; `downloads.json` enthält
ausschließlich `info`-Einträge. Der Abschnitt „Technische Broschüren" ist leer.

## 10. Chat-Widget ist ein Mock

`POST /api/chat` antwortet mit festen Strings und simulierter Verzögerung; das Widget
öffnet sich auf Desktop automatisch und kündigt an, der Chat werde „in den nächsten Tagen
aktiviert" (`CHAT_INTEGRATION.md`). Der Text ist zeitlich gefasst und altert.

## 11. Legacy-Farb-Aliase noch in Benutzung

`brand.primary` / `brand.deep` / `brand.secondary` liegen auf denselben Hex-Werten wie
`brand.blue` / `brand.navy` / `brand.blue-bright`. Die Migration der Aufrufstellen ist im
Token-Kommentar als „Wave 2 / 2-v" markiert und offen.

## 12. Wartungsfalle Routen ↔ `KNOWN_PATHS`

Eine neue `<Route>` in `src/App.tsx` ohne Eintrag in `SITEMAP_ROUTES` oder
`EXTRA_KNOWN_PATHS` (`server.ts`) rendert einwandfrei, antwortet aber **HTTP 404**.
Der Code weist selbst darauf hin („MIRRORS src/App.tsx"), erzwingt es aber nicht —
kein Test deckt diese Spiegelung ab.

## 13. Preview-Stand hinkt hinterher

`dist/client/index.html` datiert auf **2026-08-18 12:41**. Die vier Epigenetik-Commits
danach und die uncommitteten Änderungen in `src/pages/EpigeneticsPage.tsx` sind nicht
gebaut, also auf `preview.polarisdx.net` nicht sichtbar. Production-Mode serviert aus
`dist/`, nicht aus `src/`.
