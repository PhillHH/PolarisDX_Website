# Wissensübergabe (PT33.4)

Agenda für die sechs Walkthroughs aus MASTER-SCOPE AP33/PT33.4. **DoD AP33:** Ein neues
Teammitglied kann Projekt, Inhalte, Tests und Deployment anhand der Dokumentation nachvollziehen.
Jeder Walkthrough arbeitet deshalb **an der Dokumentation entlang** (dieses Handbuch, Contracts,
`docs/deploy.md`) und endet mit einer Übung, die die Teilnehmenden selbst ausführen.

## 0. Rahmen

| #   | Walkthrough       | Dauer  | Zielgruppe                  | Leitdokument                                         |
| --- | ----------------- | ------ | --------------------------- | ---------------------------------------------------- |
| 1   | Tech              | 90 min | Entwicklung                 | `entwicklung.md` §1–§7, `README.md`                  |
| 2   | Content           | 60 min | Redaktion, Entwicklung      | `redaktion.md`, `wartung.md` §2–§4, §8               |
| 3   | SEO               | 60 min | Entwicklung, Marketing      | `entwicklung.md` §2, §4; `SEO-CONTRACT.md`           |
| 4   | Analytics         | 45 min | Marketing, Datenschutz, Dev | `entwicklung.md` §8; `CONSENT-TRACKING-CONTRACT.md`  |
| 5   | Deployment        | 60 min | Betrieb, Entwicklung        | `docs/deploy.md`, `entwicklung.md` §10               |
| 6   | Incident/Rollback | 60 min | Betrieb, Bereitschaft       | `docs/deploy.md` §3–§5, `DEPLOYMENT-CONTRACT.md` §12 |

Empfohlene Reihenfolge 1 → 2 → 3 → 4 → 5 → 6, Tech und Deployment nicht am selben Tag wie
Incident. Aufzeichnen; Fragen, die die Doku nicht beantwortet, als Lücke festhalten und im Handbuch
oder Contract nachtragen — nicht nur mündlich klären.

**Gemeinsame Voraussetzungen (vorab prüfen):**

- [ ] Lesezugriff auf das Repository und lauffähiger lokaler Stand nach `README.md` §4 (Node 22,
      `npm ci`, `npm ci --prefix server`, `npm run dev` zeigt `/de/`).
- [ ] Docker lokal, Image `mcr.microsoft.com/playwright:v1.57.0-noble` vorab gezogen.
- [ ] Für 5/6: SSH-Zugang zum Host, Mitglied der Docker-Gruppe, Leserecht auf `.deploy/`.
      Secret-Dateien (`server/.env`, `server/.env.preview`) werden **gezeigt, wo sie liegen — nie ihr
      Inhalt** (AGENT-CONTRACT §4).
- [ ] Für 3/4: Zugänge, die nicht im Repo liegen — Google Search Console, GTM-Container der Preview
      und (sobald vorhanden) der Produktion, GA4-Property. Fehlt ein Zugang, ist das ein Owner-Punkt.

## 1. Tech-Walkthrough (90 min)

| Min | Inhalt                                                                                                          | Zeigen                                                                                                      |
| --- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 10  | Wahrheitsquellen, Autoritätsreihenfolge, Guard-Level G0–G3                                                      | `README.md` §2–§3, `building-docs/CONTEXT-INDEX.md`, `IMPLEMENTATION-HOTSPOTS.md` §10                       |
| 20  | Request-Weg: Redirect-Middleware → SSR → Hydration                                                              | `server.ts` (Abschnitte „LANGUAGE REDIRECT“, „SSR HANDLER“), `src/entry-server.tsx`, `src/entry-client.tsx` |
| 15  | Route Registry und abgeleitete Konsumenten                                                                      | `src/routing/routeRegistry.ts`, `src/App.tsx` (`STATIC_ROUTE_ELEMENTS`), `npm run check:routes`             |
| 10  | i18n-Ladeweg und G4                                                                                             | `src/i18n.ts`, `src/i18n.server.ts`, `npm run check:i18n`                                                   |
| 15  | Lead-Plattform: Persistenz vor Zustellung, Outbox, DRY_RUN                                                      | `server/server.js`, `server/lead-foundation/constants.js` (`JOURNEY_REGISTRY`), `environment.js`            |
| 10  | Testpyramide, lefthook, CI-Jobs                                                                                 | `TESTING-CONTRACT.md` §1, `lefthook.yml`, `.github/workflows/ci.yml`                                        |
| 10  | **Übung:** eine Nav-Verlinkung auf `/gibt-es-nicht` setzen, `npm run check:nav-targets` rot sehen, zurücknehmen | lokal, nicht committen                                                                                      |

Abnahme: Teilnehmende erklären, warum eine neue Route nur in der Registry entsteht und welche
Guards sonst anschlagen (`wartung.md` §1).

## 2. Content-Walkthrough (60 min)

| Min | Inhalt                                                                                | Zeigen                                                                         |
| --- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 10  | Wo Inhalte liegen: Stammdaten vs. Übersetzung vs. Content-JSON                        | `entwicklung.md` §5, `CONTENT-ASSET-CONTRACT.md`                               |
| 10  | Claim-Disziplin: keine erfundenen Zahlen, Bilder, Garantien                           | `HOMEPAGE-CONTRACT.md` §9 (`HCL-*`), `npm run check:claims`, `redaktion.md` §8 |
| 15  | Service-Text ändern in 10 Sprachen                                                    | `public/locales/<lang>/services.json`, `redaktion.md` §1                       |
| 10  | Anatomie Artikel, Event, Download, Musterbefund                                       | `redaktion.md` §2–§4, §6                                                       |
| 5   | Bilder: AVIF/WebP, `assetsInlineLimit`, Budget                                        | `scripts/build-article-images.mjs`, `vite.config.ts`                           |
| 10  | **Übung:** in einer Sprache einen Key leeren, `npm run check:i18n` lesen, korrigieren | lokal                                                                          |

Abnahme: Teilnehmende benennen für Artikel und Download alle Dateien und den passenden Prüfbefehl.

## 3. SEO-Walkthrough (60 min)

| Min | Inhalt                                                                                      | Zeigen                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10  | Indexierbarkeit, Sitemap, Suche kommen aus der Registry                                     | `routeRegistry.ts` (`indexability`, `sitemap`, `searchEligible`)                                                                                  |
| 10  | `SEOHead`: Title-Suffix, Canonical auf `https://polarisdx.net`, 10 × hreflang + `x-default` | `src/components/seo/SEOHead.tsx`, Seitenquelltext von `/fr/igloo-pro`                                                                             |
| 10  | HTTP-Semantik live                                                                          | `curl -sI localhost:3000/agb` (301 → `/de/terms`), `curl -sI localhost:3000/de/gibt-es-nicht` (404), `curl -s localhost:3000/sitemap.xml \| head` |
| 10  | Structured Data und was bewusst fehlt                                                       | `structuredData.ts`, `SEO-CONTRACT.md` §14                                                                                                        |
| 10  | Migration und Cutover                                                                       | `building-docs/migration/AP29-PRELAUNCH-CRAWL.md`, `ROUTING-CONTRACT.md` §2.2                                                                     |
| 10  | Gates                                                                                       | `npm run check:seo`, `npm run test:seo:regression`; Search Console (extern)                                                                       |

Abnahme: Teilnehmende erklären, warum eine 404 keinen Canonical trägt und wie ein neuer Redirect
geprüft wird (`wartung.md` §9).

## 4. Analytics-Walkthrough (45 min)

| Min | Inhalt                                                                  | Zeigen                                                                                                |
| --- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 10  | Basic Mode: vor Einwilligung kein Google-Request                        | DevTools-Netzwerk auf `/de/` vor und nach Zustimmung; `CONSENT-TRACKING-CONTRACT.md` §1–§4            |
| 10  | Einwilligung speichern und widerrufen                                   | `CookieBanner.tsx`, `consentState.ts` (`cookie-consent`, Version 2), `googleConsent.ts`               |
| 10  | Eine Fassade, typisierte Ereignisse, Konversion = persistierter Zustand | `src/lib/tracking.ts`, `trackingProvider.ts`, Register `CONSENT-TRACKING-CONTRACT.md` §14.1           |
| 10  | GTM je Umgebung, Bauzeit-Variablen                                      | `src/lib/analyticsConfig.ts`, `.env.example`, Build-Args in `docker-compose.yml`, `docs/deploy.md` §6 |
| 5   | Gates                                                                   | `npm run test:e2e:consent`, `npm run security:test`                                                   |

Abnahme: Teilnehmende zeigen, wo ein neues Ereignis definiert wird und was im GTM-Container
außerhalb des Repos nachzuziehen ist (`wartung.md` §6).

## 5. Deployment-Walkthrough (60 min)

| Min | Inhalt                                                              | Zeigen                                                                                   |
| --- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 10  | Umgebungen, Ports, Projekte, Secrets-Ablage                         | `docs/deploy.md` §1, `docker-compose.yml`, `docker-compose.preview.yml`                  |
| 15  | Release-Ablauf: einmal bauen, Preview, dann Produktion              | `./deploy.sh build`, `./deploy.sh --env preview up <release>`, `deploy.sh`-Kopf          |
| 10  | Health-Gate, Identität, Smoke                                       | `./deploy.sh --env preview status`, `./deploy.sh --env preview smoke`, `GET /api/health` |
| 10  | Sicherung und Restore-Test                                          | `docs/deploy.md` §4, `.deploy/<env>/backups`, `.deploy/<env>/last-restore-test`          |
| 10  | Betriebssignale                                                     | `./deploy.sh logs`, `node scripts/lead-ops.mjs metrics`, `alerts`, `isolation`           |
| 5   | Grenzen: ein Image für zwei Umgebungen, keine Registry, kein Worker | `docs/deploy.md` §6                                                                      |

Übung nur auf der **Preview**: Release bauen und mit `--env preview up` ausrollen, `status` lesen.
Produktion wird im Walkthrough nicht verändert (Produktions-`up` nur mit Owner-Go).

## 6. Incident-/Rollback-Walkthrough (60 min)

| Min | Inhalt                                                                                      | Zeigen                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10  | Vorab festgelegte Rollback-Auslöser (DEP-23)                                                | `docs/deploy.md` §3: Health/Smoke rot, 5xx, Formulare nicht `accepted`, Neustartschleife, falsche Canonicals/Preview-Domain, Tracking vor Consent |
| 10  | Anwendungs-Rollback                                                                         | `./deploy.sh rollback`, `./deploy.sh rollback <release>`; Images behalten, kein `git checkout`                                                    |
| 10  | Daten: Restore nur, wenn Daten betroffen                                                    | `./deploy.sh restore-test`, `./deploy.sh restore <dir>`; additive Migrationen (DEP-13)                                                            |
| 10  | Lead-Störungen                                                                              | `node scripts/lead-ops.mjs dead-letters`, `reconciliation`, `requeue --lead=<id> --actor=<name> --reason="<grund>"`                               |
| 10  | Sicherheitsnetze                                                                            | `DRY_RUN`/`APP_ENV=preview`, `POLARIS_CSP_MODE=report-only` als dokumentierter CSP-Rückfall, `withdrawGoogleConsent`                              |
| 10  | **Tabletop:** Preview-Smoke rot → Entscheidung, Rollback auf Preview, Vorfall dokumentieren | Vorfallnotiz mit Zeit, Release, Auslöser, Wirkung in `building-docs/state/` (DEP-25)                                                              |

Abnahme: Teilnehmende führen `./deploy.sh --env preview rollback` und `./deploy.sh restore-test`
selbst aus und benennen, wann ein Restore **nicht** nötig ist (DEP-21).

## 7. Übergabe-Protokoll

Je Walkthrough festhalten: Datum, Teilnehmende, ausgeführte Übung (ja/nein), offene Fragen,
nachgetragene Doku-Stellen. Der AP33-Abschluss wird wie jedes AP in `building-docs/state/AP-STATE.md`
vermerkt.

- [ ] 1 Tech · [ ] 2 Content · [ ] 3 SEO · [ ] 4 Analytics · [ ] 5 Deployment · [ ] 6 Incident/Rollback
- [ ] Alle Lücken aus den Fragen im Handbuch oder im zuständigen Contract geschlossen
- [ ] Externe Zugänge (Search Console, GTM, GA4, SendGrid, Host) an benannte Personen übergeben

## 8. Offene Owner-Punkte

Die aktuelle Liste wird **nicht** hier geführt, sondern nur an einer Stelle gepflegt:

- `building-docs/state/AP-STATE.md` → Abschnitt **„## Current“** (Stand-Block mit „Offen (Owner)“ und
  „Weiter offene Owner-Entscheidungen“) und **„## Open Blockers“**.

Vertiefung je Thema: `DEPLOYMENT-CONTRACT.md` §6.2 (offene Betriebsschulden),
`QUALITY-GATES.md` §12.1 (Gates mit `OWNER_BOUND`), `building-docs/migration/MAIN-DELTA-2026-10.md`
(Cutover-Punkte), `CONSENT-TRACKING-CONTRACT.md` §15.6 und §16.6 (Operator-Aktionen GTM/GA4).
Vor jedem Walkthrough 5 und 6 den aktuellen Stand dort vorlesen.
