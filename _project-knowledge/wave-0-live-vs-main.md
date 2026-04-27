# Live-Site vs. main — Drift-Analyse

> Erstellt: 2026-04-27
> Lokales main HEAD: `9073319` — `docs: add DSGVO incident report for kontakte.xlsx removal`

---

## Lokales main HEAD

- **SHA:** `907331985908efe9bf1929b4df3aa76239b00b3c`
- **Commit-Message:** `docs: add DSGVO incident report for kontakte.xlsx removal`

## Live-Site Build-Indikatoren

- **Kein Build-Hash exponiert** — kein `data-build-id`, kein `window.__BUILD__`, kein Build-Kommentar im HTML
- **HTTP-Header:** `server: nginx/1.22.1`, kein `etag`, kein `x-version`, kein `last-modified`
- **Fazit:** Es gibt keine Möglichkeit, den exakten Commit der Live-Site remote zu bestimmen

## Routen-Status

### Aktive Routen (alle 15)

| Route | HTTP-Status (direkt) | HTTP-Status (nach Redirect) | Ziel-URL |
|---|---|---|---|
| `/` | 301 | 200 | `/de/` |
| `/about` | 301 | 200 | `/de/about` |
| `/articles` | 301 | 200 | `/de/articles` |
| `/contact` | 301 | 200 | `/de/contact` |
| `/diagnostics` | 301 | 200 | `/de/diagnostics` |
| `/downloads` | 301 | 200 | `/de/downloads` |
| `/events` | 301 | 200 | `/de/events` |
| `/igloo-pro` | 301 | 200 | `/de/igloo-pro` |
| `/imprint` | 301 | 200 | `/de/imprint` |
| `/privacy` | 301 | 200 | `/de/privacy` |
| `/s3_leitlinie` | 301 | 200 | `/de/s3_leitlinie` |
| `/support` | 301 | 200 | `/de/support` |
| `/terms` | 301 | 200 | `/de/terms` |
| `/vitamin-d3-implantologie` | 301 | 200 | `/de/vitamin-d3-implantologie` |
| `/vitamin-d3-spray` | 301 | 200 | `/de/vitamin-d3-spray` |

**Auffällig:** Alle Routen werden per 301 auf `/de/`-Prefix umgeleitet. Im Repo (`nginx.conf` und `App.tsx`) gibt es keinen `/de/`-Locale-Prefix — dies ist ein **Server-seitiger Drift**.

### Entfernte Routen (sollten 404 sein)

| Route | HTTP-Status | Erwartung | Ergebnis |
|---|---|---|---|
| `/casestudys/32reasons` | 200 (via `/de/casestudys/32reasons`) | 404 | **FAIL** — Route ist noch erreichbar |
| `/shop` | 200 (via `/de/shop`) | 404 | **FAIL** — Route ist noch erreichbar |
| `/shop/test` | 200 (via `/de/shop/test`) | 404 | **FAIL** — Route ist noch erreichbar |

**Ursache:** Die SPA-Konfiguration (`try_files $uri /index.html`) liefert für *jede* unbekannte Route `index.html` mit Status 200 aus. React Router zeigt dann die Catch-All-`NotFoundPage`, aber der HTTP-Status bleibt 200 statt 404. Dies ist ein bekanntes SPA-Problem und muss serverseitig gelöst werden.

### Redirects

| Von | Erwartet | Tatsächlich | Ergebnis |
|---|---|---|---|
| `/services` | → `/diagnostics` | → `/de/services` (200) | **FAIL** — Redirect nicht aktiv |
| `/services/dental` | → `/diagnostics/dental` | → `/de/services/dental` (200) | **FAIL** — Redirect nicht aktiv |

**Ursache:** Die `/de/`-Locale-Umleitung greift *vor* dem React-Router-Redirect. Da der Browser zuerst zu `/de/services` geschickt wird, sieht React Router nie `/services` und kann den Redirect zu `/diagnostics` nicht ausführen. Die Route `/de/services` existiert im Router nicht als Redirect.

## Asset-Drift

- **PNGs/JPGs in HTML referenziert:** Keine — alle 0 Treffer
- **WebP auf Homepage:** 14 WebP-Bilder gefunden (z.B. `polaris_white-y_x3LF6o.webp`, `hero_doctor-DsqKm2Tl.webp`)
- **WebP-Migration:** ✅ **Vollständig** — keine Legacy-Formate mehr auf der Homepage

## ChatWidget auf Live

- **Nicht vorhanden** — kein `ChatWidget`, `chat-widget` oder `/api/chat` im HTML
- Status: Bereits entfernt (oder war nie deployed)

## translations/ Referenzen

- **Keine Referenzen** — `/translations/` wird nicht mehr im HTML referenziert
- Status: ✅ Cleanup offenbar bereits erfolgt

## Security-Header IST-Stand

| Header | Vorhanden | Wert |
|---|---|---|
| `x-frame-options` | ✅ | `SAMEORIGIN` |
| `x-content-type-options` | ✅ | `nosniff` |
| `referrer-policy` | ✅ | `strict-origin-when-cross-origin` |
| `strict-transport-security` | ❌ | fehlt |
| `content-security-policy` | ❌ | fehlt |
| `permissions-policy` | ❌ | fehlt |
| `x-xss-protection` | ❌ | fehlt (im Repo-nginx.conf vorhanden, live nicht) |

**Diff zum Repo:** Die `nginx.conf` im Repo setzt `X-XSS-Protection`, die Live-Site liefert diesen Header nicht. Zusätzlich liefert die Live-Site `referrer-policy`, der im Repo *nicht* konfiguriert ist. → **Klar unterschiedliche nginx-Konfiguration auf dem Server.**

## Sitemap und robots.txt

- **Sitemap:** ✅ HTTP 200 erreichbar unter `/sitemap.xml`
- **robots.txt:** ✅ Vorhanden, aktualisiert `2026-01-30`, korrekte Crawler-Regeln

## Drift-Diagnose

1. **Live ≠ main.** Die Live-Site hat eine Locale-basierte URL-Struktur (`/de/`-Prefix mit 301-Redirect), die weder in `nginx.conf` noch in `App.tsx` des Repos existiert. Zusätzlich unterscheiden sich die Security-Header zwischen Repo und Live. Die Live-nginx-Konfiguration wurde manuell am Server angepasst.

2. **Wave-1-Cleanups:** WebP-Migration ist live vollständig. ChatWidget und `/translations/`-Referenzen sind bereits entfernt. Die Routen-Struktur (alle 15 aktiven Seiten) funktioniert. **Nicht live** sind: korrektes 404-Handling für entfernte Routen (`/shop`, `/casestudys/32reasons`) und die `/services` → `/diagnostics`-Redirects (werden vom Locale-Redirect überschrieben).

3. **Wave-0-Hardenings fehlen komplett:** `strict-transport-security` (HSTS), `content-security-policy` (CSP), und `permissions-policy` sind nicht gesetzt. Außerdem fehlt ein Build-Hash-Mechanismus, um zukünftig den Deployment-Stand remote verifizieren zu können. Die SPA liefert für unbekannte Routen HTTP 200 statt 404 — ein SEO- und Security-Problem.
