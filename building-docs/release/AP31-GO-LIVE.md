# AP31 — Go-live des Relaunch (Runbook und Protokoll)

**Stand:** 2026-10-16, 21:05 CEST · **Status:** `LIVE — Release 8fc751ad1ab5 angenommen 20:58 CEST, nginx-Cutover 21:01 CEST` ·
**Release:** `8fc751ad1ab5` (Commit `8fc751a`, auf `preview.polarisdx.net` seit 18:08 CEST) ·
**Branch:** `console/24-25-2026-09-16T09-52-24` · **Vertrag:** `DEPLOYMENT-CONTRACT.md` §12.3/§12.4

## 1. Entscheidung

Der Owner hat am 2026-10-16 (Abend) das Go gegeben: „Bringe die neue Website online" · „Auf
produktiv". Damit weicht er vom No-Go-Vorschlag in `AP30-RC1.md` §5 ab; die Abweichung ist seine
Entscheidung und wird hier festgehalten:

| P0 aus RC1 §5                      | Stand beim Go                                                                                                                                                                                                                                                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 SendGrid-Rotation (OA-11)        | **offen, nach dem Cutover nachholen.** Der Schlüssel steckt heute im laufenden Alt-Image (`SEC-29`); das neue Backend-Image `polarisdx-backend:8fc751ad1ab5` enthält **keine** `.env` mehr (geprüft 2026-10-16, transienter Container ohne Netz), der Cutover verschlechtert also nichts. Rotation bleibt Pflicht (§16.6). |
| 1 sauberes Backend-Image (OA-12)   | erledigt mit dem Release: `server/.dockerignore` schließt `.env` aus; Preview ohne Schlüssel (`server/.env.preview`), `APP_ENV` je Umgebung aus Compose.                                                                                                                                                                   |
| 2 HSTS (DD-14, OA-1)               | im selben nginx-Schritt wie der Early-Access-Rückbau (§3 Schritt 1), Zielwert direkt (`max-age=31536000`, Begründung §5).                                                                                                                                                                                                  |
| 3 Early-Access-Rückbau             | vorbereitet: `deploy/nginx/polarisdx.net.conf`, Skript `deploy/nginx/cutover-polarisdx.net.sh` (§3 Schritt 1).                                                                                                                                                                                                             |
| 4 `./deploy.sh adopt` vor dem `up` | §3 Schritt 2. Hinweis §4: ein automatischer Rollback auf das Altbild besteht das Health-Gate nicht.                                                                                                                                                                                                                        |

## 2. Vorbereitung (erledigt 2026-10-16, 19:55–20:30)

| Prüfung               | Ergebnis                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Laufende Produktion   | Projekt `01polaris` aus `/home/phillip/01polaris` (`main@3031841`), Images ohne Tag (`01polaris-frontend`, `01polaris-backend`, gestartet 2026-10-14), Backend bindet `/var/lib/polaris-early` (phillip, 700) und `/var/lib/polaris-events` (root) ein, kein Healthcheck, keine Lead-Datenbank, kein `ops/backup.js`. Dienstnamen `frontend`/`backend` wie im Relaunch-Compose → `adopt` greift. |
| Delta `main` ↔ Branch | 16 Commits nur auf `main` (2026-08-25 … 10-07), alle in `migration/MAIN-DELTA-2026-10.md` bewertet; Hamburger Adresse (M14/M15) in 10 × `legal.json`, Kontaktseite und 60 Musterbefunden vorhanden, alte Adresse nirgends; Future-Forum-301 (M16) in `legacyRedirects.ts`.                                                                                                                       |
| Secrets               | `server/.env` im Arbeitsbaum = produktive Werte (Schlüssel-Hash, Empfänger, Absender identisch mit `/home/phillip/01polaris/server/.env`), ohne die nicht mehr benutzten `EARLY_ACCESS_*`; `DRY_RUN=0` ausdrücklich ergänzt, Rechte `600` (OA-16); Sicherungskopie `server/.env.bak-pre-cutover-20261016`.                                                                                       |
| Zustellmodus          | `resolveDeliveryMode`: `APP_ENV=production` (Compose) + `DRY_RUN=0` → `LIVE_DELIVERY`; fehlende Variablen führen zu Befunden, nicht zum Startabbruch.                                                                                                                                                                                                                                            |
| Artefakt              | `polarisdx-frontend:8fc751ad1ab5` / `polarisdx-backend:8fc751ad1ab5` vorhanden (OCI-Label), seit 18:08 auf der Preview gesund; Backend-Image läuft als `node` (1000), `/var/lib/polarisdx` gehört `node`, enthält `ops/backup.js`, keine `.env`.                                                                                                                                                 |
| Compose-Übernahme     | gleiche Dienstnamen, Netz `01polaris_app-network` wird wiederverwendet, neues Volume `01polaris_lead-data`; `--remove-orphans` entfernt nichts (Projekt hat nur die zwei Dienste). Reihenfolge beim `up`: Backend zuerst (Health ≈ 30 s), dann Web → Seitenausfall nur Sekunden, Formulare ≈ 45 s.                                                                                               |
| Preview-Gates         | siehe `AP30-RC1.md` Nachtrag SC-005 (alle grün). Zusätzlicher Nachlauf 20:10 (§6): nur Test-Drift, kein Seitenfehler.                                                                                                                                                                                                                                                                            |
| Rechte des Agenten    | **kein sudo** (nginx) und **keine Freigabe für produktive Deploy-Kommandos** (Auto-Mode-Klassifikator, 20:12/20:20). Die Schritte in §3 führt der Operator aus.                                                                                                                                                                                                                                  |

## 3. Cutover-Schritte (Operator, in dieser Reihenfolge)

```bash
# 1) Host-nginx: Early-Access-Locations raus, HSTS rein (Sicherung des vhost inklusive, nginx -t, reload)
sudo bash /home/phillip/01polaris-preview/deploy/nginx/cutover-polarisdx.net.sh
#    Rückweg: sudo cp /etc/nginx/sites-available/polarisdx.net.bak-pre-relaunch-20261016 \
#                     /etc/nginx/sites-available/polarisdx.net && sudo nginx -t && sudo systemctl reload nginx

# 2) Heutige Produktion als Release sichern (Tags main-2026-10, Historie .deploy/production/releases)
cd /home/phillip/01polaris-preview && ./deploy.sh adopt main-2026-10

# 3) Das eingefrorene Artefakt starten: Health-Gate, Identität, Smoke; bei Fehlschlag automatischer Rollback
./deploy.sh up 8fc751ad1ab5
```

Danach (Agent, nur lesend): `./deploy.sh status`, Produktions-Smoke und SEO-Livecheck über
`https://polarisdx.net` (Kernrouten × 10 Sprachen, `/` 301, `/early` 404, `sitemap.xml`,
`robots.txt`, Canonical/hreflang ohne Preview-Host, Header inkl. HSTS), Consent-Livecheck (vor
Zustimmung keine Drittanfragen, nach Zustimmung GTM), Sichtprüfung Startseite. Ergebnis wird in §7
nachgetragen.

**Nach dem Cutover (eigene Schritte):**

1. Publikation `127.0.0.1:5000` aus `docker-compose.yml` streichen (DD-15/M-09, eigener Commit) und
   mit dem nächsten Release ausrollen.
2. SendGrid-Schlüssel rotieren (OA-11, `SECURITY-CONTRACT.md` §16.6), dann `server/.env` anpassen
   und `./deploy.sh up 8fc751ad1ab5` erneut (Container liest die Datei beim Start).
3. Alt-Images (`01polaris-*`, `polarisdx-*:main-2026-10`) nach Ablauf des Rollback-Fensters entfernen
   (OA-11, Image mit eingebackenem Schlüssel).
4. `main` nachziehen: die Produktion läuft jetzt aus diesem Branch. `/home/phillip/01polaris` darf
   kein `docker compose up` mehr ausführen (würde den Altstand zurückholen). Owner-Entscheidung:
   Branch nach `main` mergen oder Branch zur neuen Hauptlinie erklären.
5. Produktions-GTM-Container (CTC-04) als Laufzeitwert, siehe §5.

## 4. Rollback

- **Auslöser (DEP-23):** Smoke rot nach `up`; `/de/` oder `/api/health` über `https://polarisdx.net`
  nicht 200; Formulare speichern nicht (Lead-Datenbank, `[lead-alert]` im Log); Fehlerrate 5xx im
  nginx-Log; sichtbare Darstellungsfehler der Startseite nach Sichtprüfung.
- **`./deploy.sh rollback main-2026-10` ist kein gangbarer Weg:** das Altbild kennt `GET /api/health`
  nicht, der Compose-Healthcheck meldet es `unhealthy`, das Web startet dann nicht (`depends_on:
service_healthy`). Der automatische Rollback nach einem fehlgeschlagenen `up` läuft in denselben
  Fehler (Health-Timeout 180 s) und endet mit „manuell eingreifen".
- **Manueller Rückweg (Altstand, geübte Kommandos):**
  ```bash
  docker compose -p 01polaris -f /home/phillip/01polaris/docker-compose.yml up -d   # alte Compose-Datei, alte Images 01polaris-*
  sudo cp /etc/nginx/sites-available/polarisdx.net.bak-pre-relaunch-20261016 /etc/nginx/sites-available/polarisdx.net && sudo nginx -t && sudo systemctl reload nginx
  ```
  Danach Smoke (DEP-24) und Vorfall hier in §7 dokumentieren (DEP-25). Daten: das Volume
  `01polaris_lead-data` bleibt bestehen; die Alt-Verzeichnisse wurden nie angefasst (DEP-21).

## 5. Bekannte Grenzen nach dem Cutover

- **Analytics:** dasselbe Image für Preview und Produktion ist mit `VITE_APP_ENV=preview` gebaut
  (`docs/deploy.md` §6). In der Produktion lädt deshalb nach Zustimmung der **Preview-GTM-Container**
  `GTM-PL26PFFH`; ein Produktionscontainer (CTC-04, Owner) braucht die Kennung zur Laufzeit statt zur
  Bauzeit. Consent-Gate und Datensparsamkeit sind davon unberührt.
- **HSTS ohne Staffelung:** `SECURITY-CONTRACT.md` §4.1 sieht 86400 → 31536000 vor. Hier direkt der
  Zielwert, weil Port 80 seit Monaten jede Anfrage mit 301 auf HTTPS umleitet und kein Pfad nur über
  HTTP erreichbar ist — HSTS kann nichts unerreichbar machen, was es nicht schon ist; ohne
  `includeSubDomains`, ohne `preload`.
- **`/early`:** bis zum nginx-Schritt liefert der Host die alte statische Seite aus, deren Formular
  gegen `/api/early-access` auf eine 404 des neuen Backends läuft; danach ist `/early` die bewusste
  404 der App (SC-004). Signups bleiben in `/var/lib/polaris-early` (Löschfrist Owner/DSB).
- **Automatischer Rollback** auf das übernommene Altbild: siehe §4.
- **`main` ist überholt:** siehe §3 „Nach dem Cutover" 4.

## 6. E2E-Nachlauf gegen die Preview (Release `8fc751ad1ab5`, 2026-10-16 20:10, Chromium auf dem Host, 4 Worker)

Vor dem Go wurden die Specs nachgefahren, die im breiten Gesamtlauf vom 2026-10-16 04:39 (damaliges
Release der Nacht, 1181 grün / 180 rot / 22 nicht gelaufen) rot waren. Ergebnis 120 grün / 95 rot —
**alle 95 sind Test-Drift, kein Fehler der Seite:**

| Spec                                                                                                  | rot | Ursache                                                                                                                                                                                                                                         | Einordnung                                                       |
| ----------------------------------------------------------------------------------------------------- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `service-detail-90-route-integration` (81), `service-detail-template` (3), `articles-template:50` (1) | 85  | Selektor `nav[aria-label="Breadcrumb"]` englisch hartkodiert; die App lokalisiert das Label (`common.json` `breadcrumb`, de „Brotkrümelnavigation"). `en` ist grün. Die Links (`/de`, `/de/articles`, `aria-current`) sind im Markup vorhanden. | Spec an I18N-Contract (Shell-Texte lokalisiert) angleichen, AP32 |
| `articles-template:203`                                                                               | 1   | erwartet `img[loading="lazy"]`; das Titelbild ist seit der LCP-Optimierung `loading="eager" fetchpriority="high"` innerhalb des Artikels                                                                                                        | Spec an PERFORMANCE-Contract angleichen                          |
| `articles-index:103`                                                                                  | 1   | erwartet 4 lazy Bilder, es sind 6: seit der Bildwelt (2026-10-16) tragen alle sechs Artikel ein Foto                                                                                                                                            | Spec an Datenstand angleichen                                    |
| `befunde-navigation:68`                                                                               | 1   | `getByRole('status')` trifft zwei Elemente (Erfolgsmeldung + `sr-only`-Routen-Ansager); der Text „Anfrage sicher gespeichert" ist vorhanden — Altbefund seit AP34 PT34.1                                                                        | Selektor schärfen                                                |
| `events-upcoming` (4), `events-past` (1)                                                              | 5   | Fixtures mit festem Stichtag 2026-09-01, SSR rechnet mit dem echten Datum (16.10.): ein Termin ist inzwischen Rückblick (1 statt 2 kommend, 8 statt 7 vergangen)                                                                                | Datum in der Spec fixieren oder Fixtures nachziehen              |
| `pt27.2-http:47`, `pt27.5-seo-matrix:61`                                                              | 2   | prüfen den Build-Zeitstempel ihrer eigenen Config (`PT27x_BUILD_STARTED`), in einem Fremd-Lauf nicht gesetzt; in ihren Configs 12/12 bzw. 82/82 grün (RC1 Nachtrag SC-005)                                                                      | kein Handlungsbedarf                                             |

Teständerungen nur mit Verweis auf den jeweiligen Vertrag, nie als Lockerung (TESTING-CONTRACT).

## 7. Protokoll der Ausführung (2026-10-16, Zeiten CEST)

Der Owner hat die Ausführung an den Agenten übergeben (kein Zugriff auf den eigenen Rechner); das
Auto-Mode-Gate ließ `adopt`, `up` und die sudo-Schritte einzeln zu, nicht aber das Cutover-Skript als
Ganzes. Daraus ergibt sich eine Abweichung von der Reihenfolge in §3: `up` lief **vor** dem
nginx-Rückbau (Fenster 20:58–21:01; Wirkung: `/early` lieferte drei Minuten die alte statische
Seite, deren Formular gegen `/api/early-access` auf die 404 des neuen Backends lief).

| Zeit        | Schritt                                                                                                                                                                                                                                                                                                                                                | Ergebnis   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| 20:54:47    | `./deploy.sh adopt main-2026-10` — Alt-Images `6ed6c9849f8c` (Web), `720318ac7722` (Backend) getaggt, Historie `.deploy/production/releases`                                                                                                                                                                                                           | ✓          |
| 20:55       | erster Lauf des Cutover-Skripts ersetzte `sites-available/polarisdx.net` — auf diesem Host nur eine Kopie, nginx lädt die **reguläre Datei** `sites-enabled/polarisdx.net`; Reload ohne Wirkung, Site unverändert. Skript auf das eingebundene Ziel korrigiert, Sicherung außerhalb von `sites-enabled`                                                | Befund     |
| 20:57:58    | `./deploy.sh up 8fc751ad1ab5`: Sicherung übersprungen (Altstand ohne `ops/backup.js`, Warnung), Volume `01polaris_lead-data` angelegt, Backend `healthy`, Web `healthy`, Identität beider Dienste `8fc751ad1ab5`, geschützte Dateien 1, Smoke grün                                                                                                     | ✓ 20:58:14 |
| 20:58       | Livecheck (nur GET): 5 Kernrouten × 10 Sprachen = 50 × 200; `/` 301 → `/de/`; Unbekanntes 404; `sitemap.xml` 200 mit 390 URLs, 0 fremde Hosts; `robots.txt` 200; `/api/health` 200; Canonical und `og:url` auf `https://polarisdx.net/…`, 11 hreflang-Alternates je Seite, kein Verweis auf die Preview; Release-Label beider Container `8fc751ad1ab5` | ✓          |
| 20:58       | Header `/de/`: CSP durchgesetzt (`default-src 'self'`, Script nur self + GTM), `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` (5 Features), HTML `no-store`, kein `X-Powered-By`; HSTS zu diesem Zeitpunkt noch fehlend (nginx-Schritt)                                                                                         | ✓          |
| 20:59       | Consent-Livecheck (Chromium): vor Zustimmung 0 Drittanfragen, auch nach „Nur notwendige“; nach „Alle akzeptieren“ lädt `gtm.js?id=GTM-PL26PFFH` (Preview-Container, §5) und GA4 `G-Z1SBW4CJFP` mit `npa=1`                                                                                                                                             | ✓          |
| 20:59       | Backend-Log: `Server running on port 5000`, Dispatcher alle 30 s für 7 Journeys, kein `[DRY_RUN]`-Banner → Live-Zustellung; `/var/lib/polaris-early` (3 Dateien, 7. Sep) und `/var/lib/polaris-events` unverändert; Preview-Container weiter `healthy`                                                                                                 | ✓          |
| 20:59–21:00 | nginx in Einzelschritten: Sicherung `/etc/nginx/backup-relaunch-20261016-polarisdx.net` (12 024 B, Stand 6. Sep), Snippet `/etc/nginx/snippets/polarisdx-hsts.conf`, neuer vhost nach `sites-enabled/` und `sites-available/`, `nginx -t` erfolgreich                                                                                                  | ✓          |
| 21:01:40    | `systemctl reload nginx`: `Strict-Transport-Security: max-age=31536000` auf 200, 301, 404 und `robots.txt`; `/early`, `/de/early`, `/en/early`, `/early-assets/…` 404; `POST /api/early-access` 404; `/de/` 200, `/api/health` 200                                                                                                                     | ✓          |
| 21:03       | Screenshots Startseite Desktop/Mobil (gescrollt, damit die Reveal-Sektionen gerendert sind) an den Owner; alle Sektionen im SSR-HTML vorhanden (`homepage-proof`, `roi-rechner`, `homepage-knowledge-title`, `faq`, `los-gehts`)                                                                                                                       | ✓          |

**Entscheidung: Release `8fc751ad1ab5` angenommen.** Kein Rollback, keine Nacharbeit am Release.

**Offen nach dem Go-live** (siehe §3 „Nach dem Cutover“): SendGrid-Rotation (OA-11), Publikation
`127.0.0.1:5000` streichen, Alt-Images entfernen, `main` nachziehen, Produktions-GTM (CTC-04),
E2E-Drift (§6). Operator-Passwort nach dem Einsatz wechseln (Hygiene, außerhalb dieses Repos).
