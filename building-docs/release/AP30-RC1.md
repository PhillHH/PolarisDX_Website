# AP30 — Release Candidate 1 (Entwurf, ownerfreier Teil)

**Stand:** 2026-10-16 · **Status:** `RC1_PREPARED — NICHT FREIGEGEBEN` · **Branch:**
`console/24-25-2026-09-16T09-52-24`

Diese Unterlage bündelt, was ohne Owner prüfbar war. Sie ist **keine** Freigabe. Ein RC wird erst
eingefroren, wenn alle zwölf Launch-Gates (`QUALITY-GATES.md` §12) grün oder ausdrücklich manuell
nachgewiesen sind und die Owner-Punkte in §5 entschieden sind (`RELEASE-ACCEPTANCE.md`).

## 1. Kandidat

| Feld       | Wert                                                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Commit     | der Commit, der diese Unterlage einführt (Preview-Release = dessen `sha12`)                                                       |
| Artefakte  | `polarisdx-frontend:<sha12>`, `polarisdx-backend:<sha12>` aus `./deploy.sh build` (OCI-Label `revision`)                          |
| Läuft auf  | `preview.polarisdx.net` als Compose-Projekt `polarisdx-preview` (Release-Historie `.deploy/preview/releases`)                     |
| Produktion | **unverändert** (`main`, Projekt `01polaris`) — Wechsel nur mit Owner-Go über AP31                                                |
| Changelog  | Commits seit `780ca0f`: AP34 PT34.1–34.4, AP28, AP29 PT29.1–29.4, AP33, AP30-Funde; Design-Deltas in `DESIGN-SYSTEM-CHANGELOG.md` |

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

**P0 — vor Go-live zwingend (Owner/Operator):**

1. Early-Access/Event-Daten: Produktions-Backend nutzt `/var/lib/polaris-early`, `/var/lib/polaris-events`
   und `POST /api/early-access`; der Relaunch nicht (MAIN-DELTA O2). Entscheiden: stilllegen oder portieren.
2. SendGrid-Schlüssel rotieren (OA-11), sauberes Produktions-Backend-Image (OA-12).
3. HSTS am produktiven vhost aktivieren (DD-14).
4. Erster Produktionswechsel: `./deploy.sh adopt <name>` vor dem ersten `up` (Rollback-Ziel).

**P1 — Owner-Entscheidungen:**

- Shop-Menüpunkt (O1), ndu-Clinic-Karte (O3), Adresse/Telefon in den 60 Musterbefunden (O4),
  Share-Karten-Text (O5), Telefonnummer, Bereichsleiste auf Diagnostik/Service/IglooPro.
- Titel/Description-Deltas gegen Search-Console-Daten prüfen (Crawl F3).
- Impressum-Überschrift nennt „§ 5 TMG" (seit 2024 DDG; Meta-Beschreibung sagt bereits DDG) —
  Rechtstext, Legal-Freigabe.
- AP34-Abnahme (Bogen `wireframes/ap34-abnahme/`).

**P2 — bekannt, nicht launchkritisch:**

- E2E-Altbefunde: Breadcrumb-Label „Breadcrumb" vs. „Brotkrümelnavigation" in den Service-Specs
  (84), doppeltes `role="status"` (Support/Befund/Epigenetik), Sprachwechsel-Klick unter Last,
  Termine mit festem Datum. Specs der Closure-/PT2x-Configs laufen nur mit ihrer eigenen Config.
- Lead-Alarm meldet in der Preview `LEADS_FAILED_TERMINAL` als kritisch, obwohl der Grund der
  gewollte Trockenlauf ist.
- Doku-Drift (AGENT-/ROUTING-/I18N-/TRACKING-Contract, `src/**/README.de.md`), gesammelt aus AP33.

**Go/No-Go-Vorschlag:** **No-Go**, bis P0 1–3 erledigt sind. Technisch ist der Kandidat sonst
releasefähig; das Deploy-Verfahren ist geübt.
