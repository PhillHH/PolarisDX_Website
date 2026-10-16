# AP30 — Release Candidate 1 (Entwurf, ownerfreier Teil)

**Stand:** 2026-10-16 · **Status:** `RC1_PREPARED — NICHT FREIGEGEBEN` · **Branch:**
`console/24-25-2026-09-16T09-52-24`

Diese Unterlage bündelt, was ohne Owner prüfbar war. Sie ist **keine** Freigabe. Ein RC wird erst
eingefroren, wenn alle zwölf Launch-Gates (`QUALITY-GATES.md` §12) grün oder ausdrücklich manuell
nachgewiesen sind und die Owner-Punkte in §5 entschieden sind (`RELEASE-ACCEPTANCE.md`).

**Fortschreibung 2026-10-16:** Der Owner hat alle Empfehlungen aus §5 (P1) und aus
`migration/MAIN-DELTA-2026-10.md` §5 angenommen („Alle ja", `SCOPE-CHANGELOG.md` SC-004). Der
Code-Teil steckt in `f7b5db3`; die Preview läuft mit diesem Release. Die Ergebnisse in §2–§4 stammen
vom Vorgänger-Kandidaten (`b8b7c32`); für den Stand nach SC-004 (`f7b5db3` + Folgecommit mit
Crawl-Fixes F4/F6/F7, Mega-Menü-Fix und neuen Baselines) neu gemessen:

| Prüfung                                    | Ergebnis                                                                                                                                                         |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vitest                                     | 1121 passed                                                                                                                                                      |
| Guards `check:*`, tsc, lint                | grün (1 alte Lint-Warnung)                                                                                                                                       |
| Budgets PT25.5 ci                          | 852/852, nicht gelockert                                                                                                                                         |
| Kernjourneys PT27.3 / Consent / HTTP       | 15/15 · 11/11 · 12/12                                                                                                                                            |
| SEO-Regression                             | 82/82 (inkl. F4/F6/F7)                                                                                                                                           |
| A11y PT24.1–24.6                           | 118 · 41 · 31 · 20 · 45 · 25                                                                                                                                     |
| Visual pt27.6 / Design-System              | 21/21 · 35/35 nach dokumentierten Baseline-Updates (DS-Changelog)                                                                                                |
| Browser-Matrix (Firefox/WebKit/iPad/mobil) | 84/84 in zwei Läufen (45 + 39); iPad und WebKit-Desktop jetzt mit gespeicherter Cookie-Entscheidung (Banner verdeckte das Absenden, `e2e/ap30-matrix.config.ts`) |

## 1. Kandidat

| Feld       | Wert                                                                                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Commit     | `f7b5db3` (Preview-Release `f7b5db3e2433`); vorher `b8b7c32`, der diese Unterlage einführte                                                                                |
| Artefakte  | `polarisdx-frontend:<sha12>`, `polarisdx-backend:<sha12>` aus `./deploy.sh build` (OCI-Label `revision`)                                                                   |
| Läuft auf  | `preview.polarisdx.net` als Compose-Projekt `polarisdx-preview` (Release-Historie `.deploy/preview/releases`)                                                              |
| Produktion | **unverändert** (`main`, Projekt `01polaris`) — Wechsel nur mit Owner-Go über AP31                                                                                         |
| Changelog  | Commits seit `780ca0f`: AP34 PT34.1–34.4, AP28, AP29 PT29.1–29.4, AP33, AP30-Funde, Owner-Entscheidungen SC-004 (`f7b5db3`); Design-Deltas in `DESIGN-SYSTEM-CHANGELOG.md` |

## 2. PT30.1 Functional QA

| Bereich                     | Ergebnis                                                                                                                                                       |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation, Suche, Sprachen | PT27.3-Kernjourneys grün (Chromium, Firefox, WebKit, iPad); Suchziele 35, Registry ohne Drift; HTTP-Integration 12/12, Integration 16/16                       |
| Formulare (Trockenlauf)     | Kontakt, Support, Epigenetik, Consumer, Lead-Magnet: gespeichert vor Zustellung, Erfolgsanzeige ehrlich; gegen die Container-Preview zusätzlich echt abgesetzt |
| Downloads                   | Crawl: Prod 33/33, Preview 30/30 erreichbar; geschützter Musterbefund-Download nur über Entitlement                                                            |
| Hash-Navigation, 404, 301   | SEO-Regression 80/80 (200 x10, 31 Redirects x10, 404-Familien, Alt-Dateien ein Hop bzw. direkt 404)                                                            |
| Consumer                    | 3 x 10 grün, Bestellanfrage als Inquiry, kein Kauf                                                                                                             |

**Gefunden und behoben während der QA:**

- Preview-Formulare antworteten mit **504** (Host-Prozess proxyte auf einen nicht existierenden
  Backend-Port) → Preview läuft jetzt im Container-Stack (AP28).
- Gegateter Lead-Magnet im Container **kaputt** (`storage/protected` fehlte im Backend-Image) →
  Datei ins Image, Smoke prüft jede GATED-Variante. Ohne diese Prüfung wäre der Fehler erst nach
  dem Cutover aufgefallen.

## 3. PT30.2 Browser-/Geräte-Matrix (`e2e/ap30-matrix.config.ts`)

| Profil                         | Ergebnis |
| ------------------------------ | -------- |
| Firefox Desktop                | 15/15    |
| WebKit Desktop (Safari-Engine) | 15/15    |
| iPad Mini                      | 15/15    |
| iPhone 15 (WebKit)             | 13/13 ¹  |
| Pixel 7 (Chromium)             | 13/13 ¹  |
| 320 px                         | 13/13 ¹  |

Chromium Desktop: PT27.3 15/15. ¹ Schmale Profile mit gespeicherter Cookie-Entscheidung („Nur
notwendige"); die Epigenetik- und Support-Journey starten über Desktop-Kopfzeilen-Links und laufen nur
auf den breiten Profilen. Ohne Entscheidung liegt der Banner mobil über dem Absenden-Knopf am
Seitenende — erwartetes Verhalten, ein Nutzer beantwortet ihn zuerst.

Echte Geräte (iOS Safari, Android Chrome) und Safari/Edge-Desktop sind **manuell offen** (Owner).

## 4. PT30.3/30.4 Visual und Nonfunctional

| Prüfung             | Ergebnis                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| Visual (pt27.6, DS) | 21/21, 35/35 nach begründeten Baseline-Updates (DS-Changelog PT34.4)                                    |
| Accessibility       | PT24.1–24.6 grün (118/41/31/20/45/25), axe serious/critical 0                                           |
| Performance         | Budgets ci 852/852, Lab-Stichprobe 216/216 (5 Routen), keine Lockerung                                  |
| Security            | npm-audit PASS (1 registrierte Ausnahme), Secret-Scan 0 (10 Commits seit AP34), Security-Tests 128      |
| SEO                 | SEO-Regression 80/80; Crawl-Report `building-docs/migration/AP29-PRELAUNCH-CRAWL.md`                    |
| Consent/Analytics   | PT27.4 11/11 (Pre-Consent 0, Reject 0, Widerruf, keine Produktions-Property)                            |
| Betrieb             | Health-Gate, Rollback (2 Übungen), Backup + Restore mit Daten nachgewiesen (`DEPLOYMENT-CONTRACT` §6.2) |

## 5. Restpunkte und Go/No-Go

Stand 2026-10-16 nach den Owner-Entscheidungen (SC-004). Erledigtes ist durchgestrichen und bleibt
zur Nachvollziehbarkeit stehen.

**P0 — vor Go-live zwingend (Operator):**

1. SendGrid-Schlüssel rotieren (OA-11), sauberes Produktions-Backend-Image (OA-12)
   (`SECURITY-CONTRACT.md` §12, AP26-WAIVER-01).
2. HSTS am produktiven vhost aktivieren (DD-14, OA-1).
3. Early-Access beim Cutover zurückbauen: nginx-Locations `/early*`, `/early-assets/` und
   `/api/early-access*` entfernen, danach Port 5000 streichen; `/var/lib/polaris-early` und
   `/var/lib/polaris-events` **nicht** löschen (Checkliste `docs/deploy.md` §3,
   `DEPLOYMENT-CONTRACT.md` §6.2/§12.3).
4. Erster Produktionswechsel: `./deploy.sh adopt <name>` vor dem ersten `up` (Rollback-Ziel).

~~Early-Access/Event-Daten: stilllegen oder portieren (MAIN-DELTA O2).~~ → **entschieden:
stilllegen** (Option A); im Relaunch ist `/early` `INTENTIONAL_404`. Offen bleibt nur der
Cutover-Schritt (P0 3).

**P1 — Owner-Entscheidungen: alle getroffen (2026-10-16).**

- ~~Shop-Menüpunkt (O1)~~ → behalten: Kopfzeilen-Eintrag + schmales Startseiten-Band, `HCL-015`,
  CTC-14 geschlossen.
- ~~ndu-Clinic-Karte (O3)~~ → umgesetzt, 10 Sprachen.
- ~~Adresse/Telefon in den 60 Musterbefunden (O4), Telefonnummer~~ → eine Nummer
  `+49 151 75011699`, Musterbefund-Adresse Willy-Brandt-Straße 49.
- ~~Share-Karten-Text (O5)~~ → erledigt mit `a7ff705`.
- ~~Bereichsleiste auf Diagnostik/Service/IglooPro~~ → umgesetzt als Shell-Bausteine, kein Budget
  gelockert (ci 852/852).
- ~~Impressum-Überschrift „§ 5 TMG"~~ → „Angaben gemäß § 5 DDG", 10 Sprachen.
- ~~AP34-Abnahme~~ → erteilt (`work-packages/AP34.md` AP34-CLOSURE).
- ~~RPO/RTO bestätigen~~ → RPO 24 h, RTO 30 min (`DEPLOYMENT-CONTRACT.md` DEP-19).

**Weiter offen, manuell (Owner/Operator):**

- Echte Geräte (iOS Safari, Android Chrome) und Safari/Edge-Desktop.
- Neue PDF-Fassungen der Epigenetik-Unterlagen und des Musterbefund-ZIPs (alte Adresse und alte
  Telefonnummer; extern erzeugt, keine Quelle im Repo).
- Titel/Description-Deltas gegen Search-Console-Daten (Crawl F3): angenommen, braucht GSC-Zugang →
  nach dem Go-live.
- Aufbewahrung/Löschung der Early-Access-Signups (Owner/DSB, Frist offen).
- Für `f7b5db3` nicht neu gemessen: Browser-Matrix, Visual-Baselines (Kopfzeile, Startseite,
  Epigenetik, Diagnostik, Service, IglooPro sehen anders aus), A11y PT24.x und E2E-Journeys. Im
  Code-Commit grün: Vitest 1118, alle `check:*`-Guards, tsc, Lint, Budgets ci 852/852.

**P2 — bekannt, nicht launchkritisch:**

- E2E-Altbefunde: Breadcrumb-Label „Breadcrumb" vs. „Brotkrümelnavigation" in den Service-Specs
  (84), doppeltes `role="status"` (Support/Befund/Epigenetik), Sprachwechsel-Klick unter Last,
  Termine mit festem Datum. Specs der Closure-/PT2x-Configs laufen nur mit ihrer eigenen Config.
- Lead-Alarm meldet in der Preview `LEADS_FAILED_TERMINAL` als kritisch, obwohl der Grund der
  gewollte Trockenlauf ist.
- Doku-Drift (AGENT-/ROUTING-/I18N-/TRACKING-Contract, `src/**/README.de.md`), gesammelt aus AP33.
- Kopfzeile: in fr/es brechen die acht Einträge bei 1280 px um (schon vor SC-004).

**Go/No-Go-Vorschlag:** **No-Go**, bis SendGrid-Rotation (P0 1) und HSTS (P0 2) erledigt sind;
der Early-Access-Rückbau (P0 3) und `adopt` (P0 4) gehören in den Cutover selbst. Technisch ist der
Kandidat sonst releasefähig; das Deploy-Verfahren ist geübt.
