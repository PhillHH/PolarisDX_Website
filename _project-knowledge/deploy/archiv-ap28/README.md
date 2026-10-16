# Archiv AP28 PT28.7 — stillgelegte Betriebskonfiguration

Diese Dateien lagen bis 2026-10-16 im Repository-Wurzelverzeichnis bzw. unter `server/` und sahen
aus wie aktive Betriebswahrheit (`DEPLOYMENT-CONTRACT.md` DD-10, DEP-02, DEP-54). Keine von ihnen
wurde von Produktion oder Preview benutzt. Sie sind nur noch als Referenz hier.

| Datei                       | Früher                     | Warum stillgelegt                                                                                                                                      |
| --------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `nginx.conf`                | Repo-Wurzel                | statisches SPA-Setup (`try_files … /index.html`) — ersetzt SSR, verletzt DEP-45; aktiv ist der Host-nginx (`/etc/nginx/sites-enabled/polarisdx.net`) |
| `Dockerfile.dev`            | Repo-Wurzel                | von nichts referenziert                                                                                                                                |
| `server-docker-compose.yml` | `server/docker-compose.yml` | zweite Compose-Wahrheit, veröffentlichte das Backend auf `0.0.0.0:5000` (AP01 D-27)                                                                  |
| `../vercel.json`            | Repo-Wurzel                | SPA-Rewrite aus der Vercel-Zeit; identische Kopie liegt bereits in `_project-knowledge/deploy/vercel.json`                                           |

Der einzige produktive Zielpfad ist `docker-compose.yml` (+ `docker-compose.preview.yml`) über
`deploy.sh`, beschrieben in `docs/deploy.md`.

`scripts/prerender.mjs` bleibt im Repository: Es ist als `LEGACY_NON_AUTHORITATIVE` markiert, führt
keine Routenliste und wird von `scripts/check-route-registry.ts` und `src/routing/legacyRedirects.test.ts`
als stillgelegt bewacht.
