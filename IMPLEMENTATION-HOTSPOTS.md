# PolarisDX Relaunch — Implementation Hotspots

> **Version 2 — repariert und vervollständigt am 2026-08-21** gegen den nunmehr verfügbaren kanonischen
> Master-Scope `building-docs/scope/MASTER-SCOPE.md` (34 Arbeitspakete AP00–AP33, 178 Primärtasks).
> Version 1 konnte nur 16 APs abbilden; siehe §15.
>
> Read-only Analyse gegen `feat/home-leadmagnet@961f65d`. Es wurde ausschließlich diese Datei geändert.
> Kein Quellcode, keine Konfiguration, keine Dependencies, keine Branches, keine Commits, keine Dienste,
> kein Deployment-Zustand und keine kanonische Datei unter `building-docs/` wurde angefasst.
> Keine Secrets und keine Environment-Werte werden wiedergegeben.

---

## 1. Executive Summary

**Scope-Abdeckung: 34/34 APs · 178/178 Primärtasks gelesen.** Keine `AP-UNMAPPED`-Markierung verbleibt.

**Hotspot-Zählung (Version 2)**

| Risiko    |  v1 | **v2** | Δ   |
| --------- | --: | -----: | --- |
| CRITICAL  |   6 |  **8** | +2  |
| HIGH      |  12 | **17** | +5  |
| MEDIUM    |  14 | **13** | −1  |
| **Summe** |  32 | **38** | +6  |

Guard-Level: **G3 = 8 · G2 = 17 · G1 = 13.**

**Warum die Zahlen steigen.** Nicht weil sich das Repository geändert hat — es ist unverändert — sondern
weil der vollständige Scope Arbeit sichtbar macht, die v1 nicht kannte: `REST-03` und AP21 verlangen drei
Consumer-Landingpages in zehn Sprachen, doch der gesamte Consumer-Baum (2 884 Zeilen) enthält **null**
`useTranslation`-Aufrufe; `AP23 PT23.1` verlangt, dass GTM **gar nicht** initial lädt, was `index.html`
von einer Konfigurationsdatei zu einem Gate-tragenden Artefakt macht. Beide werden zu CRITICAL befördert.

**Top 10 Hotspots**

| #   | Hotspot                                            | Risiko         | Guard    | APs | Warum                                                                                                                                                    |
| --- | -------------------------------------------------- | -------------- | -------- | --: | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `server.ts` (791 Z.)                               | CRITICAL       | G3       |  11 | Sieben Verträge in einer Datei: Locale-301s, Sitemap+hreflang, `KNOWN_PATHS`/echte 404, Legacy-301s, `/api`-Proxy, Security/CSP, `no-store`, SSR-Render. |
| 2   | `src/App.tsx` (437 Z.)                             | CRITICAL       | G3       |  14 | Einzige Route-Registry. Jeder Eintrag hat eine ungesicherte Pflicht in einer **anderen** Datei.                                                          |
| 3   | `public/locales/**` (150 Dateien, 2 305 Keys × 10) | CRITICAL       | G3       |  18 | `DEC-RL-001` + Gate 1. Parität bereits messbar gebrochen (`cs`/`pl` 2 295 vs `de`/`en` 2 305).                                                           |
| 4   | **`src/pages/consumer/**` (2 884 Z.)\*\*           | **CRITICAL ↑** | **G3 ↑** |   9 | `REST-03`/AP21: 3 Seiten × 10 Sprachen — aus **null** `useTranslation`. Zusätzlich Order-Lead, Consent, kein `<main>`, kein Skip-Link, CWV-Budget.       |
| 5   | `src/components/seo/SEOHead.tsx` (267 Z.)          | CRITICAL       | G3       |  10 | 24 Konsumenten; trägt eine Hälfte des SSR-Status-Handshakes über einen exakten String-Match.                                                             |
| 6   | `src/lib/tracking.ts` (192 Z.)                     | CRITICAL       | G3       |   7 | Einzige Implementierung des Consent-Locks; `AP23 PT23.2` schreibt genau diese Fassade fest.                                                              |
| 7   | `server/server.js` (733 Z.)                        | CRITICAL       | G3       |   9 | Alle fünf Endpunkte; AP22 (8 PTs) verlangt Persistenz, Queue, Idempotenz, CRM — **nichts davon existiert**.                                              |
| 8   | **`index.html` (204 Z.)**                          | **CRITICAL ↑** | **G3 ↑** |   6 | SSR-Template **und** Consent-Bootstrap **und** GTM-Loader. `AP23 PT23.1` verlangt hier den Umbau, der Gate 2 entscheidet.                                |
| 9   | `src/components/layout/Header.tsx` (443 Z.)        | HIGH           | G2       |   8 | IA-Registry `navItems`; `AP06 PT06.1.3` macht Epigenetik zum eigenen Hauptnavigationspunkt.                                                              |
| 10  | **`src/hooks/useSearch.ts`**                       | **HIGH (neu)** | **G2**   |   5 | **Vierter manueller Spiegel** der Route-Registry — in v1 nicht erfasst. Enthält 6 statische Pfade statt 27 und den toten Service `sports`.               |

**Wesentliche Serialisierungsbefunde**

- **Fünf HARD_BARRIERs**, alle durch Master-Scope §7 „Kritische Abhängigkeitslogik" gedeckt: AP01→branch-abgeleitete Arbeit · AP02+AP10→routenlastige Arbeit · AP23→jede Tracking-Arbeit · AP22→AP19-Gating · AP28→CRM-Betriebsarbeit.
- **Die AP-Nummer ist keine Reihenfolge.** Der Scope sagt das selbst (§6: _„Die AP-Nummerierung ist eine Scope-Struktur, **keine starre chronologische Reihenfolge**"_). Belege: AP28 gehört in Welle 2, nicht Welle 5; AP27 gehört mit frühen CI-Gates in Welle 1; AP22 startet in Welle 2 und schließt erst in Welle 4.
- **CI läuft weiterhin nur auf `main`** — die gesperrte Baseline war nie durch ein Gate gedeckt. Bis das behoben ist, greift **keine** der zwölf Launch-Gates automatisiert. Siehe §12 und §17.

**Wesentliche Parallelisierungschancen**

1. **AP17 ∥ AP18 ∥ AP13** — Editorial, Events und die neun Service-Detailseiten teilen kein Hotspot-File außer den Locale-Namespaces, die pro Namespace partitionierbar sind.
2. **AP24 ∥ AP25 ∥ AP26** — Accessibility, Performance und Security-Hardening treffen sich fast nur in `.github/workflows/ci.yml`, wo alle drei nur Schritte anhängen.
3. **AP33 ∥ alles** — reine Dokumentation, kein Quellcode-Fußabdruck; einziger Zwang ist, dass beschriebene Verträge stabil sein müssen.

**Klassifikation: HOTSPOT_MAP_READY_WITH_WARNINGS** — siehe §17. Der Scope-Gap aus v1 ist geschlossen;
die verbleibenden Warnungen sind Repository-Befunde, keine Wissenslücken.

---

## 2. Method and Authority

### 2.1 Autorität

Angewendet in dieser Reihenfolge (`building-docs/PROJECT-CONSTRAINTS.md`):

1. `building-docs/scope/MASTER-SCOPE.md` — **vollständig gelesen**: 34 AP-Abschnitte, 178 `## PTxx.x`-Blöcke, die globalen Abschnitte §0.2 Decision Lock, §1 Projektleitplanken, §2 Globale DoD, §3 Phasenmodell, §4 Querschnittsmatrix, §5 Altlasten, §6 Ausführungsreihenfolge/Wellen, §7 Kritische Abhängigkeitslogik, §8 die zwölf Launch-Gates.
2. `building-docs/PROJECT-CONSTRAINTS.md` — `DEC-RL-001`–`015`, `REST-01`–`03`.
3. Aktuelle Repository-Evidenz — jede Aussage unten ist gegen den ausgecheckten Baseline-Stand geprüft.
4. `building-docs/BRANCH-RECONCILIATION-MAP.md` — Kandidaten-IDs A1–A21, N1–N19, B1–B13, X1–X10.
5. `building-docs/REPO-BASELINE.md` — Evidenz; dessen §11 ist ausdrücklich nicht autoritativ.
6. Historische Repository-Dokumentation.

**Baseline unverändert: `feat/home-leadmagnet@961f65d`.** Keine Entscheidung wird wieder geöffnet.

### 2.2 Methode

- Alle 34 AP-Abschnitte und alle 178 PTs gelesen; je AP die konkret betroffenen Repository-Bereiche aus dem **PT-Text** abgeleitet, nicht aus dem AP-Titel.
- Die aus v1 belegten Hotspots wurden **nicht neu auditiert**, sondern gezielt gegen Gegenevidenz geprüft (§3 der Aufgabenstellung). Keiner wurde entkräftet.
- Neu verifiziert wurden ausschließlich Aussagen, die erst durch den vollständigen Scope relevant werden — insbesondere die 20 Launch-Scope-Altlasten aus Master-Scope §5.
- Kopplung weiterhin aus **Imports und handgespiegelten Konstanten** abgeleitet, nicht aus Dateinamen.

### 2.3 Re-Verifikation der Master-Scope-Altlasten (§5 Launch-Scope)

| #   | Altlast laut Scope                           | Repository-Befund                                                                                                                                                                                                | Status                               |
| --- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 1   | `/services*` liefert 200 statt 301           | `server.ts:285` führt `/services` in `EXTRA_KNOWN_PATHS`, `:306` matcht `/services/:slug` als bekannt ⇒ HTTP 200. Die Umleitung ist client-seitig: `src/App.tsx:414` `<Navigate>` und `:415` `ServicesRedirect`. | **BESTÄTIGT**                        |
| 2   | 404/Canonical/hreflang der Baseline erhalten | `isKnownPath` `server.ts:301`, `NOT_FOUND_MARKER` `:314`, `SEOHead.notFound` `:171` — intakt, ungetestet.                                                                                                        | **BESTÄTIGT**                        |
| 3   | Toter Such-Treffer `/diagnostics/sports`     | `src/hooks/useSearch.ts:87` `id: 'sports'`; `src/data/services.tsx` kennt neun IDs, `sports` ist keine davon.                                                                                                    | **BESTÄTIGT**                        |
| 4   | Legal-Sitemap vs. `noindex`                  | `server.ts:229-231` listet `/privacy`, `/imprint`, `/terms`; `PrivacyPage.tsx:26`, `TermsPage.tsx:30`, `ImprintPage.tsx:48` setzen alle `noindex={true}`.                                                        | **BESTÄTIGT**                        |
| 5   | `lastmod` pauschal „heute"                   | `server.ts:322` `const today = new Date()…`, verwendet in `:334` und `:357` für **jeden** Eintrag.                                                                                                               | **BESTÄTIGT**                        |
| 6   | `/api/consumer-order` ohne Rate Limit        | `server/server.js:338` — ohne `formLimiter`, im Gegensatz zu `:66`, `:143`, `:636`.                                                                                                                              | **BESTÄTIGT**                        |
| 7   | `/api/chat`, HiHuman, CSP-Chat-Domains       | `server/server.js:503`; `src/components/ui/ChatWidget.tsx`; `server.ts` CSP führt `widget.hihuman.co.uk` in `script-src`, `connect-src`, `frame-src`.                                                            | **BESTÄTIGT**                        |
| 9   | HSTS am produktiven Origin                   | Kein `Strict-Transport-Security` in `server.ts`. `X-Powered-By` ist bereits deaktiviert (`server.ts:375`) — dieser Teilpunkt ist **erfüllt**.                                                                    | **teilweise offen**                  |
| 11  | Hartcodierte Consumer-/Spezialseiten         | `src/pages/consumer/{SprayPage,shell,OrderForm}.tsx`: **0** `useTranslation`. `S3LeitliniePage.tsx` (1 010 Z.) und `VitaminD3ImplantologyPage.tsx` (611 Z.): ebenfalls **0**.                                    | **BESTÄTIGT**                        |
| 13  | Consumer `<main>` und Skip-Link              | `src/pages/consumer/shell.tsx`: kein `<main>`. Skip-Link existiert **site-weit nicht** (Grep über `src/components/layout/` und `src/pages/consumer/` leer). `Layout.tsx:19` hat `<main>` nur für die B2B-Shell.  | **BESTÄTIGT, schlimmer als notiert** |
| 19  | Persistenz/Retention/Backup für Leads        | Grep über `server/server.js` und `server/package.json` nach `queue\|database\|sqlite\|postgres\|prisma\|redis\|idempoten`: **leer**.                                                                             | **BESTÄTIGT — Greenfield**           |

### 2.4 Was aus v1 unverändert gilt

Alle sechs CRITICAL-Einstufungen aus v1 bleiben bestehen und wurden gegen Gegenevidenz geprüft, ohne
entkräftet zu werden. Die zehn architektonischen Verträge aus v1 bleiben gültig; §6 ergänzt sie um zwei
weitere, die erst der vollständige Scope sichtbar macht.

---

## 3. Complete AP00–AP33 × Hotspot Matrix

Alle 34 APs. Für jedes AP: betroffene Repository-Bereiche, berührte Verträge (Kürzel siehe §6),
Editier-Überlappung, und ob das AP einen später genutzten Vertrag **einführt (E)** oder **stabilisiert (S)**.

| AP       | Titel (Scope)                                               | Betroffene Repository-Bereiche                                                                                                                                                                                                                                                                                                                                                                                        | Verträge                                                     | Überlappung                                              | E/S                                    |
| -------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- | -------------------------------------- |
| **AP00** | Programmsteuerung, Scope Lock, Governance                   | **Kein Quellcode-Fußabdruck.** Erzeugt `DECISIONS.md`, `RISK-REGISTER.md` (Scope §10). Berührt `building-docs/` nur additiv.                                                                                                                                                                                                                                                                                          | —                                                            | keine                                                    | E (Decision-Referenz)                  |
| **AP01** | Repository-Baseline, Branch-Reconciliation, Import-Hygiene  | `src/App.tsx` · `server.ts` · `src/components/layout/{Header,Footer}.tsx` · `src/components/seo/structuredData.ts` · `src/pages/MusterbefundPage.tsx` · `src/components/sections/ContactForm.tsx` · `src/components/ui/ChapterNav.tsx` · `tailwind.config.js` · neu: `src/components/epigenetics/**`, `src/content/befunde/meta.ts`, `src/pages/musterbefund/**` · `package.json` · `scripts/**`                      | ROUTING · SEO · SSR_HTTP · DESIGN_TOKEN · QUALITY_GATE       | **maximal** — acht der höchstriskanten Dateien           | S (alle Baseline-Härtungen)            |
| **AP02** | Zielarchitektur SSR/Routing/Lead/Betrieb                    | **Überwiegend dokumentarisch** (PT02.1–02.5 sind Zielbilder). Legt fest, was AP10/AP22/AP28 bauen. Kein direkter Code-Edit gefordert.                                                                                                                                                                                                                                                                                 | ROUTING · SSR_HTTP · LEAD_DATA · DEPLOYMENT · CONTENT_ASSET  | keine (Definition)                                       | **E — alle Plattformverträge**         |
| **AP03** | Informationsarchitektur, Seiteninventar                     | **Überwiegend dokumentarisch.** Determiniert `navItems` (`Header.tsx:44`), Footer-Links, Route-Liste. PT03.4.1 fordert Epigenetik als eigenen Hauptnavigationspunkt.                                                                                                                                                                                                                                                  | ROUTING · CONTENT_ASSET                                      | keine (Definition)                                       | E (IA-Vertrag)                         |
| **AP04** | Content-Strategie, Launch-Content-Readiness                 | `public/locales/**` (alle 15 Namespaces) · `src/data/**` · `src/content/downloads.json` · `public/downloads/**` · `src/assets/**`                                                                                                                                                                                                                                                                                     | LOCALE · CONTENT_ASSET                                       | mit AP08, AP17–AP21 in denselben Namespaces              | E (Content-Modell)                     |
| **AP05** | Sales-Machine Design-System, Light                          | `tailwind.config.js` · `scripts/check-color-tokens.mjs` · `src/index.css` · `src/components/ui/**` · `src/components/sections/**` · `e2e/` (Visual Regression) · `.github/workflows/ci.yml` (PT05.1.9 Token-Guard in CI)                                                                                                                                                                                              | DESIGN_TOKEN · QUALITY_GATE                                  | mit AP24 (Kontrast), AP11–AP21 (Bausteine)               | **S — Token-Guard existiert bereits**  |
| **AP06** | App Shell, Header, Footer, Navigation                       | `src/components/layout/{Header,Footer,Layout}.tsx` · `src/App.tsx` (`MainLayout`) · `src/components/ui/{CookieBanner,MobileCallButton,SearchModal,LanguageSwitcher}.tsx` · **PT06.4.6: `ChatWidget` vollständig entfernen** · `public/locales/*/common.json` (`nav.*`)                                                                                                                                                | ROUTING · LOCALE · CONSENT (Banner)                          | mit AP03, AP07, AP15, AP24                               | S (Shell-Vertrag)                      |
| **AP07** | Suche und interne Findability                               | **`src/hooks/useSearch.ts`** (PT07.1: Index um Epigenetik-Hub, 3 Vertiefungen, 6 Musterbefunde, Downloads, Events erweitern; PT07.1.9: `sports` entfernen) · `src/components/ui/SearchModal.tsx` (PT07.2 Dialog/Fokus/Escape) · Querverlinkung in `src/pages/**`                                                                                                                                                      | ROUTING · LOCALE                                             | **mit AP10** — `useSearch` ist ein Route-Spiegel         | S                                      |
| **AP08** | i18n, vollständige 10-Sprachen-Lokalisierung                | `src/i18n.ts` (PT08.1.4 Namespace-Registrierung konsolidieren) · `src/i18n.{server,client}.ts` · `public/locales/**` · **`src/pages/consumer/**`(PT08.2.3–.7)** ·`src/pages/{S3LeitliniePage,VitaminD3ImplantologyPage}.tsx`(PT08.2.1–.2) ·`server/server.js`(PT08.5 Autoresponder × 10) ·`public/downloads/\*\*` (PT08.6) · CI-Guard (PT08.3.5)                                                                      | **LOCALE** · SEO (PT08.4.4) · ROUTING (PT08.4.3)             | mit AP04, AP15, AP16, AP17–AP21                          | **S — Gate 1**                         |
| **AP09** | SEO-Plattformgrundlagen                                     | `src/components/seo/SEOHead.tsx` (PT09.1) · `server.ts` `generateSitemap`/`SITEMAP_ROUTES` (PT09.2, inkl. PT09.2.5 Legal-Widerspruch, PT09.2.7 ehrliches `lastmod`) · `src/components/seo/structuredData.ts` (PT09.4) · `public/robots.txt` (PT09.5) · `index.html` (Meta-Fallbacks)                                                                                                                                  | **SEO** · ROUTING · SSR_HTTP                                 | mit AP10 (dieselbe `SITEMAP_ROUTES`)                     | **S — Gate 4**                         |
| **AP10** | Redirect-, URL-, HTTP-Semantik                              | `server.ts` (301-Kette, `KNOWN_PATHS`, `isKnownPath`, `LEGACY_PATH_REDIRECTS`) · `src/App.tsx` (`ServicesRedirect`, Catch-all) · **PT10.3: Route Registry als _eine_ Wahrheit für App-Routes, Known Paths, Sitemap, Search, Redirects, SEOHead, Tests** · `e2e/url-smoke.spec.ts`                                                                                                                                     | **ROUTING · SSR_HTTP**                                       | mit AP07, AP09, AP15, AP16, AP21                         | **S — löst alle vier Handspiegel auf** |
| **AP11** | Startseite                                                  | `src/pages/HomePage.tsx` · `src/components/sections/**` (Hero, TrustBar, Steps, WhyPoc, IglooWidget, Testimonials, RoiCalculator) · `public/locales/*/home.json` (291-Zeilen-Delta zu `main`) · PT11.5.7 Tracking nur nach Consent                                                                                                                                                                                    | DESIGN_TOKEN · LOCALE · SEO · CONSENT · LEAD_DATA            | mit AP05, AP15 (Epigenetik-Position), AP19 (Lead-Magnet) | —                                      |
| **AP12** | Diagnostik-Hub `/diagnostics`                               | `src/pages/ServicesOverviewPage.tsx` · `src/data/services.tsx` · `src/components/sections/Diagnostics*.tsx` · `public/locales/*/services.json`                                                                                                                                                                                                                                                                        | CONTENT_ASSET · SEO · LOCALE                                 | mit AP13 (dasselbe Datenmodell)                          | —                                      |
| **AP13** | Service-Detailseiten (9 Stück, **10 PTs**)                  | `src/pages/ServicePage.tsx` (ein Template) · `src/data/services.tsx` · `public/locales/*/services.json` · `structuredData.ts` (PT13.1.10)                                                                                                                                                                                                                                                                             | CONTENT_ASSET · SEO · LOCALE                                 | Template-Datei wird von neun PTs bearbeitet              | —                                      |
| **AP14** | IglooPro Produktstrecke                                     | `src/pages/IglooProPage.tsx` · `src/components/sections/Igloo*.tsx` (6 Dateien) · `structuredData.ts` `iglooProProductSchema` (PT14.5) · `public/locales/*/products.json` · **PT14.4: `CV < 2 %` in Code, 10 Locales, Structured Data und PDF konsistent** · `public/downloads/**`                                                                                                                                    | CONTENT_ASSET · SEO · LOCALE · LEAD_DATA                     | mit AP19 (ROI als Lead-Magnet)                           | —                                      |
| **AP15** | Epigenetik als eigene Säule (**7 PTs**)                     | `src/pages/EpigeneticsPage.tsx` (961 Z.) · neu `src/components/epigenetics/**`, `src/pages/Epigenetics{Basics,Evidence,Docs}Page.tsx` · `src/App.tsx` (Routen) · `server.ts` (3 Sitemap-Zeilen) · `Header.tsx`/`Footer.tsx` (PT15.1.2–.3) · `src/hooks/useSearch.ts` (PT15.2.5) · **PT15.6: eigene Inquiry mit eigenem Backend-Pfad/Lead-Typ** → `server/server.js`, `src/api/` · `public/locales/*/epigenetics.json` | ROUTING · SEO · LOCALE · LEAD_DATA · CONSENT · CONTENT_ASSET | mit AP01, AP06, AP07, AP16, AP22                         | **S — Gate 6**                         |
| **AP16** | Musterbefunde (6 × 10 Sprachen)                             | `src/pages/MusterbefundPage.tsx` · `src/content/befunde/**` (12 JSON + `index.ts`, neu `meta.ts`) · neu `src/pages/musterbefund/**` (6 Module) · `src/components/befund/**` (Blocks, Charts, Overview) · `src/App.tsx` (6 Routen + Catch-all zuletzt) · `panelNames.test.ts` · PT16.3.7 Legacy-Anker                                                                                                                  | ROUTING · CONTENT_ASSET · SEO · LOCALE                       | mit AP01, AP15, AP24 (Charts)                            | —                                      |
| **AP17** | Artikel-/Knowledge-Bereich                                  | `src/pages/{ArticlesIndexPage,ArticlePage}.tsx` · `src/data/articles.ts` · `src/lib/articleMeta.ts` · `public/locales/*/articles.json` · `structuredData.ts` `createArticleSchema` · `server.ts` (6 Artikel-Sitemap-Pfade)                                                                                                                                                                                            | CONTENT_ASSET · SEO · LOCALE                                 | gering — eigener Dateisatz                               | —                                      |
| **AP18** | Events                                                      | `src/pages/EventsPage.tsx` · `src/data/events.ts` · `public/locales/*/events.json` · `structuredData.ts` `createEventSchema` (PT18.4.3)                                                                                                                                                                                                                                                                               | CONTENT_ASSET · SEO · LOCALE                                 | gering — eigener Dateisatz                               | —                                      |
| **AP19** | Downloads, Resource Center, Lead-Magnet (**Greenfield**)    | `src/pages/DownloadsPage.tsx` · `src/content/downloads.json` · `public/downloads/**` · **PT19.3: wiederverwendbares Gate-Formular, Lead-Typ `content_download`, Persistenz+CRM+Queue, geschützte Asset-Auslieferung statt erratbarer `/downloads/`-URL, Entitlement-Link** → `server/server.js`, `server.ts` (Auslieferungspfad), `src/api/`                                                                          | **LEAD_DATA** · CONSENT · LOCALE · CONTENT_ASSET             | mit AP22 (baut darauf), AP14, AP15                       | **E — Gating-Vertrag**                 |
| **AP20** | About, Contact, Support, Legal                              | `src/pages/{AboutPage,ContactPage,SupportPage,PrivacyPage,ImprintPage,TermsPage}.tsx` · `src/components/sections/{ContactForm,SupportForm}.tsx` · `src/hooks/use{Contact,Support}Form.ts` · `src/api/{contact,support}.ts` · `server/server.js` · **PT20.4.8: Legal-Sitemap/`noindex`-Widerspruch auflösen** → `server.ts` + die drei Legal-Seiten                                                                    | LEAD_DATA · SEO · LOCALE · CONSENT                           | mit AP22 (dieselben Endpunkte), AP09                     | —                                      |
| **AP21** | Consumer-Landingpages × 10 (**7 PTs**)                      | **`src/pages/consumer/**`(2 884 Z., 0 ×`useTranslation`)** · `public/locales/**`(neuer/erweiterter Namespace) ·`server.ts` `CONSUMER_SITEMAP_ROUTES`(heute nur`/en/\*`) · `src/api/consumerOrder.ts`·`server/server.js:338` (PT21.5.2 Rate Limit) · **PT21.1.2–.3: `<main>` und Skip-Link ergänzen\*\* · `src/pages/consumer/tracking.ts`                                                                             | **LOCALE · SEO · LEAD_DATA · CONSENT · ROUTING**             | mit AP08, AP09, AP22, AP23, AP24, AP25                   | **S — Gate 4 + REST-03**               |
| **AP22** | Lead Platform, Formulare, CRM, APIs (**8 PTs, Greenfield**) | `server/server.js` (alle 5 Endpunkte) · neu: Persistenzschicht, Queue/Worker, CRM-Adapter · `src/api/**` · `src/components/sections/{ContactForm,SupportForm}.tsx` · `src/hooks/use*Form.ts` · **PT22.7: `/api/chat` entfernen** · `docker-compose.yml` (Worker/DB)                                                                                                                                                   | **LEAD_DATA** · CONSENT · DEPLOYMENT · LOCALE                | mit AP15, AP19, AP20, AP21, AP26, AP28                   | **E — Gate 3**                         |
| **AP23** | Consent, GTM/GA4, Analytics                                 | **`index.html` (PT23.1.1–.2: GTM nicht initial laden, `noscript`-iframe unterbinden)** · `src/components/ui/CookieBanner.tsx` · `src/lib/tracking.ts` (PT23.2: providerneutrale Fassade als Kern) · `src/components/analytics/GtmPageview.tsx` · `src/pages/consumer/tracking.ts` (PT23.2.3) · `src/lib/useScrollDepth.ts` · `server.ts` CSP · neu: Web-Vitals getrennt (PT23.5)                                      | **CONSENT** · SSR_HTTP · LEAD_DATA                           | mit AP06, AP11–AP21 (alle Events), AP25, AP26            | **E — Gate 2**                         |
| **AP24** | Accessibility / WCAG 2.2 AA                                 | `src/components/ui/**` · `src/components/layout/**` · `src/components/befund/**` (PT24.5.3 Chart-Textalternative) · `src/pages/consumer/**` · **PT24.3.4 Skip-Link — existiert site-weit nicht** · `tailwind.config.js` (PT24.4 Kontrast) · `.github/workflows/ci.yml` (PT24.6.2 axe/Playwright) · `eslint.config.js` (PT24.6.1)                                                                                      | DESIGN_TOKEN · QUALITY_GATE                                  | mit AP05 (Kontrast), AP06, AP07, AP16, AP21              | **S — Gate 11**                        |
| **AP25** | Performance und Core Web Vitals                             | `vite.config.ts` (PT25.2 Chunks) · `src/entry-client.tsx` (Fonts) · `src/assets/**`, `public/**` (PT25.3 Bilder) · `server.ts` (TTFB, Font-Preload) · `package.json` (`sharp`) · `.github/workflows/ci.yml` (PT25.5.7 Lighthouse-CI-Schwellen) · `src/pages/musterbefund/**` (Chunk-Split)                                                                                                                            | QUALITY_GATE · DEPLOYMENT                                    | mit AP16 (Chunk-Split), AP21, AP27                       | S                                      |
| **AP26** | Security Hardening                                          | `server.ts` (PT26.1 HSTS/Header, PT26.2 CSP ohne Chat-Domains) · `server/server.js` (PT26.3 Rate Limits inkl. Consumer Order, Schemas, Idempotenz) · `docker-compose.yml`/`Dockerfile`/`server/Dockerfile` (PT26.4 Secrets, PT26.5.5 Image-Scan) · `.github/workflows/ci.yml` (PT26.5.1–.2 Dependency Audit, Secret Scan)                                                                                             | SSR_HTTP · LEAD_DATA · DEPLOYMENT · QUALITY_GATE             | mit AP22, AP23 (CSP hängt an Chat-Entfernung), AP28      | S — Gate 12                            |
| **AP27** | Teststrategie, Regression, Quality Gates (**6 PTs**)        | `.github/workflows/ci.yml` · `vitest.config.ts` · `playwright.config.ts` · `e2e/**` · `src/**/*.test.tsx` · `scripts/check-color-tokens.mjs` (PT27.6.4) · neue Guards: i18n (PT27.6.5), Meta-Description (PT27.6.6), Changelog (PT27.6.8), Visual Regression (PT27.6.1), axe (PT27.6.2)                                                                                                                               | **QUALITY_GATE** — beweist alle übrigen                      | mit **jedem** AP, das ein Gate hat                       | **S — beweist alle 12 Gates**          |
| **AP28** | Docker/Compose, Environments, Deployment (**7 PTs**)        | `docker-compose.yml` (PT28.2: Web, API, Worker, **persistente DB/Storage**, nginx, Netze, Healthchecks) · `Dockerfile` · `server/Dockerfile` · `server.ts` (Port/Bind) · **PT28.7: widersprüchliche `nginx.conf`/`vercel.json`/alte Docker-Dateien entfernen oder archivieren** · `docs/deploy-preview.md`                                                                                                            | **DEPLOYMENT** · LEAD_DATA (Persistenz) · QUALITY_GATE       | mit AP22 (Worker/DB), AP26 (Secrets)                     | **E — Gate 12, REST-01**               |
| **AP29** | SEO-/Content-Migration vor Go-live                          | **Kein Anwendungscode.** Erzeugt Redirect Map, Crawl-Vergleiche, finale Sitemap-/Robots-Prüfung. Kann `server.ts` `LEGACY_PATH_REDIRECTS` ergänzen (PT29.2). `public/robots.txt` (PT29.3.4).                                                                                                                                                                                                                          | ROUTING · SEO                                                | punktuell mit AP10                                       | —                                      |
| **AP30** | Pre-Launch QA, Release Candidate                            | **Kein Anwendungscode** — Verifikation. PT30.5.1 hält Commit-SHA fest; PT30.5.2 erzeugt Build-Artefakte. Liest `e2e/**`.                                                                                                                                                                                                                                                                                              | QUALITY_GATE                                                 | keine                                                    | —                                      |
| **AP31** | Go-live, Cutover, Rollback                                  | **Kein Anwendungscode.** Betrifft `docker-compose.yml`-Betrieb, Images, DNS/Proxy. Erzeugt `LAUNCH-RUNBOOK.md`.                                                                                                                                                                                                                                                                                                       | DEPLOYMENT                                                   | keine                                                    | —                                      |
| **AP32** | Post-Launch Monitoring, Stabilisierung                      | **Kein Anwendungscode** im Regelfall. Beobachtet `server.ts` CSP-Reports, `server/server.js` Fehlerraten, Queue-Tiefe. Ergebnis sind Folge-Tickets.                                                                                                                                                                                                                                                                   | DEPLOYMENT · LEAD_DATA · SEO                                 | keine                                                    | —                                      |
| **AP33** | Dokumentation, Wartbarkeit, Betriebsübergabe                | **Kein Anwendungscode.** Erzeugt Entwickler-/Redaktionsdoku und Wartungsregeln (PT33.3: neue Route, neuer Key, neue API-Route, neuer Tracking-Event, neues Token, neue Redirect-Regel). Natürliche Heimat der §14-Dokumente.                                                                                                                                                                                          | alle (beschreibend)                                          | keine                                                    | S (macht Verträge lesbar)              |

**Zusammenfassung des Fußabdrucks:** **8 APs ohne direkten Quellcode-Fußabdruck** — AP00, AP02, AP03,
AP29, AP30, AP31, AP32, AP33. Vier davon (AP00, AP02, AP03, AP33) sind trotzdem sequenzierungsrelevant,
weil sie Verträge **definieren**, die andere APs implementieren.

---

## 4. Critical Hotspots

Acht Hotspots erfüllen das Kriterium: viele APs hängen davon ab, **oder** ein Fehler bricht große Teile
der Site, **oder** die Datei mischt mehrere Verträge.

### 4.1 `server.ts` — CRITICAL, G3 · 11 APs

**APs:** AP01, AP02, AP09, AP10, AP15, AP20, AP21, AP23, AP25, AP26, AP28.
Sieben Verträge in 791 Zeilen (Nachweis in v1 unverändert gültig): Locale-301s `:491`–`:573` · `SITEMAP_ROUTES` `:167` · `CONSUMER_SITEMAP_ROUTES` `:242` · `GERMAN_ONLY_SITEMAP_ROUTES` `:251` · `LEGACY_PATH_REDIRECTS` `:271` · `EXTRA_KNOWN_PATHS` `:282` (_„MIRRORS src/App.tsx"_ `:287`) · `KNOWN_PATHS` `:292` · `isKnownPath` `:301` · `NOT_FOUND_MARKER` `:314` · `generateSitemap` `:321` · Security/CSP `:419`/`:444` · SSR-Catch-all `:582` · `no-store` · `127.0.0.1`-Bind.
**Neu durch den vollständigen Scope:** AP09 PT09.2.7 ersetzt das pauschale `lastmod` (`:322`); AP20 PT20.4.8 löst den Legal-Widerspruch (`:229`–`:231` vs. `noindex`); AP21 erweitert `CONSUMER_SITEMAP_ROUTES` von 3 auf 30 Einträge; AP26 PT26.1.2 ergänzt HSTS, PT26.2.1 entfernt die Chat-Domains; AP10 PT10.3 löst die Route-Registry aus dieser Datei heraus.
**Handhabung:** ausschließlich Hunk-Edits. `main`s Version ist verboten (Reconciliation-Map **N1**).

### 4.2 `src/App.tsx` — CRITICAL, G3 · 14 APs (höchste AP-Zahl)

**APs:** AP01, AP02, AP03, AP06, AP07, AP10, AP11, AP15, AP16, AP17, AP20, AP21, AP23, AP24.
22 `<Route>`-Deklarationen, `MainLayout` `:205` (mit `ChatWidget`, den AP06 PT06.4.6 entfernt), drei Consumer-Routen **außerhalb** von `MainLayout` `:232`/`:240`/`:248`, `GermanOnlyPage` `:117` (dessen Abbau AP08 PT08.4.3 vorbehalten ist — **nicht** eigenmächtig), `ServicesRedirect` `:99`/`:415` (den AP10 PT10.1.2 durch eine echte 301 ersetzt), `ScrollToHash` `:146`, Catch-all `:419`.
**Warum CRITICAL:** jeder Eintrag hat eine ungesicherte Pflicht in `server.ts`. Der Code sagt es selbst (`server.ts:287`), erzwingt es aber nicht.
**Handhabung:** Hunk-Edits. `main`s Version ist verboten (**N12**).

### 4.3 `public/locales/**` — CRITICAL, G3 · 18 APs (breiteste Streuung)

**APs:** AP04, AP06, AP07, AP08, AP11–AP23 (Content/Systemtexte), AP24 (Labels).
150 Dateien. Gemessene Parität: `de` 2 305 · `en` 2 305 · `cs` 2 295 · `pl` 2 295 Leaf-Keys.
`src/i18n.ts:66` registriert **14** Namespaces bei **15** Dateien pro Sprache — `casestudies.json` liegt in allen zehn Sprachen und wird nie geladen; AP08 PT08.1.4 („Namespace-Registrierung konsolidieren") ist genau dieser Punkt.
SSR liest das Dateisystem mit Cache (`src/i18n.server.ts:77`–`:84`), in Produktion aus `dist/client/locales` (`:55`); der Client holt über HTTP (`src/i18n.client.ts:62`). **Eine Locale-Änderung ist erst nach `npm run build` sichtbar.**
**Gate 1** hängt vollständig an dieser Fläche.

### 4.4 `src/pages/consumer/**` — CRITICAL ↑ (v1: nicht als Hotspot geführt), G3 · 9 APs

**APs:** AP03, AP07, AP08, AP09, AP21, AP22, AP23, AP24, AP25.
**Gemessen:** 2 884 Zeilen über 8 Dateien (`shell.tsx` 789 · `OrderForm.tsx` 463 · `SprayPage.tsx` 398 · `MaskPage.tsx` 370 · `PriceBadge.tsx` 295 · `DuoPage.tsx` 275 · `OrderModal.tsx` 233 · `tracking.ts` 61). `useTranslation`-Vorkommen in `SprayPage.tsx`, `shell.tsx`, `OrderForm.tsx`: **0**.
**Warum jetzt CRITICAL:** `REST-03` und AP21 (7 PTs) verlangen alle drei Seiten in zehn Sprachen — aus vollständig hartcodiertem Zustand. Gleichzeitig mischt der Baum fünf Verträge: LOCALE (PT08.2/PT21.2–.4), SEO (PT21.6, heute nur `/en/*` in `CONSUMER_SITEMAP_ROUTES`), LEAD_DATA (PT21.5: Rate Limit, Idempotenz, Persistenz, CRM), CONSENT (`tracking.ts` pusht ungeprüft in `window.dataLayer:35`), A11y (PT21.1.2–.3: weder `<main>` noch Skip-Link vorhanden).
Das ist die größte einzelne Content-Umbaufläche des Relaunchs und war in v1 unsichtbar, weil der Consumer-Scope unbekannt war.

### 4.5 `src/components/seo/SEOHead.tsx` — CRITICAL, G3 · 10 APs

**APs:** AP01, AP08, AP09, AP10, AP15, AP16, AP17, AP20, AP21, AP29.
Von 24 Dateien importiert. `notFound` `:45`/`:171` emittiert `<meta name="prerender-status-code" content="404">` — exakt den String, den `server.ts:314` matcht. `GERMAN_ONLY_PATHS` `:103` ist ein **Handspiegel** von `server.ts:141`. hreflang-Logik `:140`, Canonical `:142`, `x-default` `:243`.
AP09 PT09.1 konsolidiert diese Datei als Ganzes; AP10 PT10.3.6 speist sie aus der Route Registry.
**N2** verbietet `main`s Version.

### 4.6 `src/lib/tracking.ts` — CRITICAL, G3 · 7 APs

**APs:** AP01, AP11, AP15, AP16, AP19, AP21, AP23.
13 Exporte; zwei Sperren, beide standardmäßig zu: kein Provider (`:132`), keine Einwilligung (`:142`, nicht persistiert — _„ein Puffer waere bereits eine Vorratsdatenhaltung"_). Typisierte Payloads `:51`–`:96` schließen PII strukturell aus.
**AP23 PT23.2 bestätigt genau diese Datei als Zielarchitektur** („providerneutrale Fassade als Kern", „`setTrackingProvider`/`setTrackingConsent` bewusst registrieren", „direkte `dataLayer`-Aufrufstellen aus `main` **nicht blind übernehmen**"). Damit ist die Reconciliation-Map-Entscheidung **N9** durch den Scope gedeckt.
Kollidiert weiterhin mit `src/pages/consumer/tracking.ts:35` (ungeprüfter dataLayer-Push) und `GtmPageview.tsx` (direkter `gtag('event', …)`) — beide sind AP23-Arbeit.

### 4.7 `server/server.js` — CRITICAL, G3 · 9 APs

**APs:** AP02, AP08, AP15, AP19, AP20, AP21, AP22, AP26, AP28.
`/api/contact` `:66` · `/api/support` `:143` · `/api/consumer-order` `:338` (**ohne** `formLimiter`) · `/api/chat` `:503` · `/api/roi-report` `:636`.
**Greenfield-Befund, verifiziert:** Grep nach `queue|database|sqlite|postgres|prisma|knex|redis|idempoten` über `server/server.js` und `server/package.json` liefert **nichts**. AP22 (8 PTs) und AP19 PT19.3 bauen Persistenz, Queue/Retry/Dead-Letter, Idempotenz, Dedup, Consent-Evidence, Retention und CRM-Handoff von null auf. Gate 3 hängt vollständig daran.

### 4.8 `index.html` — CRITICAL ↑ (v1: HIGH), G3 · 6 APs

**APs:** AP09, AP23, AP25, AP26, AP28, AP30.
Drei Jobs in einer Datei: SSR-Template (`<!--ssr-outlet-->`, `<!--helmet-head-->`, `<html lang="de">`, das `server.ts` pro Request umschreibt) · Consent-Mode-v2-Bootstrap `:27` mit `localStorage`-Re-Read `:41` · GTM-Loader `:81` und `noscript`-iframe `:191`.
**Warum jetzt CRITICAL:** `AP23 PT23.1.1–.2` verlangt, dass GTM **nicht initial lädt** und der `noscript`-iframe **vor Consent unterbunden** wird. Das ist kein Konfigurationstweak, sondern der Umbau, über den Gate 2 entscheidet — in derselben Datei, deren Platzhalter jede SSR-Antwort trägt. Ein Fehler bricht entweder das Gate oder jede Seite.
**N3** verbietet `main`s Version.

---

## 5. High Hotspots

17 Hotspots (v1: 12). Neu oder befördert sind mit ↑/**neu** markiert.

| Hotspot                                                                                     | APs                                                        | Kern                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/layout/Header.tsx` (443 Z.)                                                 | AP01, AP03, AP06, AP07, AP08, AP15, AP24, AP30             | `navItems:44` ist die IA-Registry. AP06 PT06.1.3 + AP15 PT15.1.2 machen Epigenetik zum eigenen Hauptnavigationspunkt; PT06.1.5 standardisiert „Angebot anfragen". WCAG-44-px-Ziele `:145` und übersetzte `aria-label` sind zu erhalten (**N11**).                                                                                                                                                             |
| `src/components/layout/Footer.tsx` (254 Z.)                                                 | AP03, AP06, AP08, AP15, AP20, AP24                         | **PT06.3.8 fordert ausdrücklich sicherzustellen, dass `CtaSection`/Garantie-Band aus `main` nicht zurückkehrt** — Gate 8. PT06.3.3 ergänzt den Epigenetik-Einstieg. Hardcodierte `<Link to=…>`-Liste `:63`–`:134`.                                                                                                                                                                                            |
| `src/components/seo/structuredData.ts` (550 Z.)                                             | AP01, AP08, AP09, AP11, AP13, AP14, AP16, AP17, AP18, AP21 | 18 Exporte. AP14 PT14.5 (Product-Schema + `CV < 2 %`), AP09 PT09.4, AP21 PT21.6.6. Enthält die NAP-Telefonnummer (A15). Datumsnormalisierung nicht verlieren (**N14**).                                                                                                                                                                                                                                       |
| `tailwind.config.js` + `scripts/check-color-tokens.mjs`                                     | AP01, AP05, AP24                                           | Token-Quelle; der Guard **läuft bereits pre-commit** (`lefthook.yml`) und bricht bei Roh-Hex, `gray-900`, arbiträren Farbklassen. AP05 PT05.1.9 hebt ihn zusätzlich in CI. Neue Tokens erfordern `PALETTE_HEX`-Pflege im selben Commit.                                                                                                                                                                       |
| `src/i18n.ts` (163 Z.)                                                                      | AP02, AP08, AP15, AP21                                     | `SUPPORTED_LANGUAGES:38` (Handspiegel zu `server.ts:57`), `NAMESPACES:66` (14 statt 15). AP08 PT08.1.4. Darf weder Browser- noch Node-APIs importieren.                                                                                                                                                                                                                                                       |
| `src/pages/EpigeneticsPage.tsx` (961 Z.)                                                    | AP15, AP16, AP24, AP25, AP30                               | Größte Seite. **Aktuell dirty im Working Tree** (partielle Wiederholung von `main@e21a6e5`) — vor jeder AP15-Arbeit zu klären.                                                                                                                                                                                                                                                                                |
| `src/pages/MusterbefundPage.tsx` + `src/content/befunde/**`                                 | AP01, AP08, AP16, AP24, AP25                               | `index.ts` importiert heute alle zwölf JSON (322 KB). AP16 PT16.1.2 + AP25 lösen das über sechs Routenmodule. `panelNames.test.ts` prüft gegen `BEFUNDE` und bricht beim Umbau. **N13**: `LanguageFallbackNotice` und `befund.toTop` erhalten.                                                                                                                                                                |
| `src/components/ui/CookieBanner.tsx` (371 Z.)                                               | AP06, AP08, AP23, AP24                                     | Einziger Schreiber des Consent-Zustands, den `index.html:41` wieder liest. Ruft heute **nie** `setTrackingConsent()` — AP23 PT23.1.5–.6 schließt das. **N10**.                                                                                                                                                                                                                                                |
| `.github/workflows/ci.yml`                                                                  | AP01, AP05, AP08, AP24, AP25, AP26, AP27, AP28             | **Acht APs hängen alle Schritte hier an.** Trigger nur auf `main` — siehe §12.                                                                                                                                                                                                                                                                                                                                |
| `package.json`                                                                              | AP01, AP02, AP19, AP22, AP25, AP27, AP28                   | Scripts + Dependencies. `npm pkg delete scripts.prepare` in beiden Docker-Stages muss erhalten bleiben. AP22/AP28 fügen DB-/Queue-Abhängigkeiten hinzu.                                                                                                                                                                                                                                                       |
| **`src/hooks/useSearch.ts`** **neu**                                                        | AP03, AP07, AP08, AP10, AP15                               | **Vierter Handspiegel der Route-Registry.** `staticPages` enthält 6 Pfade (`/`, `/about`, `/diagnostics`, `/epigenetics`, `/contact`, `/terms`) gegen 27 Sitemap-Routen; `services` enthält `id: 'sports'` `:87`, das in `src/data/services.tsx` nicht existiert (Altlast 3). AP07 PT07.1 erweitert den Index auf Vertiefungen, Musterbefunde, Downloads, Events; PT10.3.4 speist ihn aus der Route Registry. |
| **`src/pages/S3LeitliniePage.tsx` (1 010 Z.) + `VitaminD3ImplantologyPage.tsx` (611 Z.)** ↑ | AP08, AP09, AP10, AP13                                     | 1 621 Zeilen hartcodiertes Deutsch, **0** `useTranslation`. AP08 PT08.2.1–.2 lokalisiert beide; PT08.4.3 baut danach die DE-only-Sonderlogik ab — die heute in **drei** Dateien gespiegelt ist (`App.tsx:117` `GermanOnlyPage`, `server.ts:141`, `SEOHead.tsx:103`).                                                                                                                                          |
| **`docker-compose.yml` + `Dockerfile` + `server/Dockerfile`** ↑                             | AP02, AP22, AP26, AP28, AP31                               | `REST-01` + AP28 (7 PTs) erweitern den Stack um Worker, **persistente DB mit Volume**, nginx, Healthchecks, Restart Policies, image-basiertes Rollback. Heute: zwei Services, keine Persistenz. PT28.7 archiviert `nginx.conf`/`vercel.json`.                                                                                                                                                                 |
| **`src/data/**`+`src/content/downloads.json`\*\* ↑                                          | AP04, AP09, AP12, AP13, AP17, AP18, AP19                   | Content-Registries, deren `id`/`slug` **von Hand** in `SITEMAP_ROUTES` gespiegelt sind (verifiziert: 9 Service-IDs ↔ 9 `/diagnostics/*`; 6 Artikel-Slugs ↔ 6 `/articles/*`). AP18 PT18.1 stabilisiert Event-IDs, AP19 PT19.1 das Download-Inventar.                                                                                                                                                           |
| **`src/components/sections/ContactForm.tsx` + `src/hooks/use*Form.ts` + `src/api/**`\*\* ↑  | AP01, AP15, AP19, AP20, AP21, AP22, AP23, AP24             | Die Lead-Erfassungsfläche. AP22 PT22.1 vereinheitlicht Validierung, Fehlerformat, Idempotenz, Consent-Trennung; PT22.5.5 typisiert den PraxisOrder-Kontext heraus. Vorhandene a11y (`aria-invalid`, `role="alert"`, Fokusrückgabe) ist zu erhalten.                                                                                                                                                           |
| **`e2e/url-smoke.spec.ts`** ↑                                                               | AP01, AP10, AP27, AP29, AP30, AP31                         | Einziger Routen-Guard. Blinde Flecken gemessen: kein `/epigenetics`, keine sechs Musterbefunde, kein `/consumer/*`; der 404-Test prüft **Text**, nie `response.status()`. AP27 PT27.5 ersetzt das.                                                                                                                                                                                                            |
| `src/components/ui/ChapterNav.tsx` ↑                                                        | AP01, AP06, AP15, AP16, AP24                               | Schreibt `--chapterbar-offset`, das `ScrollToHash` liest. AP16 PT16.3 und AP15 nutzen es; AP24 PT24.2.6 prüft Tastaturbedienung.                                                                                                                                                                                                                                                                              |

---

## 6. Cross-File Architectural Contracts

Zehn Verträge aus v1 bleiben gültig; **zwei sind neu** (CONTENT_CLAIM, SEARCH_INDEX), beide erst durch
den vollständigen Scope sichtbar.

| Vertrag                   | Owning Files                                                                                                                                                                                       | APs                                            | Invarianten                                                                                                                                                                                                                             | Failure Mode                                                                                                                                                                                 | Guard (frühestes AP)                                                                                                 |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **ROUTING**               | `src/App.tsx` · `server.ts` (`SITEMAP_ROUTES`, `EXTRA_KNOWN_PATHS`, `KNOWN_PATHS`, `isKnownPath`, `LEGACY_PATH_REDIRECTS`) · `Header.tsx` `navItems` · `Footer.tsx` · **`src/hooks/useSearch.ts`** | AP02, AP03, AP06, AP07, AP10, AP11–AP21, AP29  | Jede `<Route>` hat einen Known-Path-Eintrag · explizite Slugs vor `:slug` · jeder Nav-/Footer-/Such-Eintrag zeigt auf eine deklarierte Route · Legacy-Pfade in genau einem Hop                                                          | Route rendert, Server antwortet **404**. Gegenrichtung: entfernte Route bleibt in Sitemap. Heute **vier** Handspiegel.                                                                       | **AP10 PT10.3** — _„Single Source of Truth für App-Routes, Known Paths, Sitemap, Search, Redirects, SEOHead, Tests"_ |
| **LOCALE**                | `src/i18n.ts` · `i18n.{server,client}.ts` · `server.ts:57` · `public/locales/**` · `src/lib/translationStatus.ts`                                                                                  | AP04, AP08, AP15, AP16, AP17–AP23              | Sprachliste identisch in `i18n.ts` und `server.ts` · jede Namespace-Datei registriert · Key-Parität über 10 Sprachen · EN-Fallback nur defensiv                                                                                         | Nicht registrierter Namespace lädt nie (heute: `casestudies`). Key-Lücke rendert den Key-String. Gemessen: 10 Keys Rückstand in `cs`/`pl`.                                                   | **AP08 PT08.3.4–.5** — Guard auf alle produktiven Namespaces, in CI                                                  |
| **SEO**                   | `SEOHead.tsx` · `structuredData.ts` · `server.ts` (`generateSitemap`, `GERMAN_ONLY_*`) · `public/robots.txt` · `index.html`                                                                        | AP09, AP10, AP13–AP21, AP29, AP31              | Genau ein Canonical je URL · hreflang-Menge = Sitemap-Sprachmenge · German-only genau eine URL, identisch in `SEOHead.tsx:103` und `server.ts:141` · Fehlerseiten ohne Canonical/hreflang · ehrliches `lastmod`                         | Zehn Beinahe-Duplikate; Fehlerseiten, die sich in zehn Sprachen als gültig anbieten; Legal gleichzeitig in Sitemap und `noindex`.                                                            | **AP09 PT09.1.8 + PT09.2.8** — Unit-/Regressionstests, XML-Validierung in CI                                         |
| **SSR_HTTP**              | `server.ts` (`isKnownPath`, `NOT_FOUND_MARKER`, Status, `Cache-Control`) · `SEOHead.tsx` (`notFound`) · `src/App.tsx` (Catch-all) · `index.html`                                                   | AP02, AP10, AP25, AP26, AP28, AP31             | Unbekannter Pfad ⇒ **404** · Marker-String beidseitig byte-gleich · HTML stets `no-store` · Marker nie auf gültiger Seite                                                                                                               | Ein umbenanntes Prop macht jede unbekannte URL zu einer indexierbaren 200. `no-store`-Verlust liefert veraltetes HTML mit toten Asset-Hashes.                                                | **AP10 PT10.4** — 200/301/404-Matrix über 10 Sprachen                                                                |
| **CONSENT**               | `index.html` · `CookieBanner.tsx` · `GtmPageview.tsx` · `src/lib/tracking.ts` · `src/pages/consumer/tracking.ts` · `useScrollDepth.ts` · `server.ts` CSP                                           | AP06, AP11–AP21, AP23, AP25, AP26              | **Kein Provider-Request vor Consent** (`REST-02`) · genau **eine** Event-Fassade · Consent-Defaults vor dem GTM-Snippet · keine PII · kein Pre-Consent-Puffer                                                                           | Heute drei Event-Wege: consent-gated `track()`, ungeprüfter `pushEvent()` (`consumer/tracking.ts:35`), direkter `gtag('event')` in `GtmPageview`. GTM lädt initial.                          | **AP23 PT23.1 + AP27 PT27.4** — vor Consent keine GTM-/GA4-Requests                                                  |
| **LEAD_DATA**             | `server/server.js` · `src/api/**` · `ContactForm.tsx` · `use*Form.ts` · `RoiCalculatorSection.tsx` · künftig Persistenz/Queue/CRM-Adapter                                                          | AP02, AP15, AP19, AP20, AP21, AP22, AP26, AP28 | Persistenz **vor** externem Handoff · Idempotenz · Retry/Dead-Letter · Consent-Evidence (Zeitpunkt, Version, Umfang) · jede öffentliche Form-Route rate-limited · Datenminimierung                                                      | Heute existiert **keine** Persistenz, **keine** Queue, **keine** Idempotenz. Ein SendGrid-Fehler verliert den Lead spurlos. `/api/consumer-order` ohne Limiter.                              | **AP22 PT22.4 + AP27 PT27.2.4–.5** — Formular → Persistenz → Queue → CRM-Testadapter                                 |
| **DESIGN_TOKEN**          | `tailwind.config.js` · `scripts/check-color-tokens.mjs` · `src/index.css` · `lefthook.yml`                                                                                                         | AP01, AP05, AP24, AP27                         | Ein Navy `#083358`, ein Teal `#0d9488` · kein Roh-Hex, kein `gray-900`, keine arbiträren Farbklassen · neue Tokens in Config **und** `PALETTE_HEX`                                                                                      | Kontrastregressionen (`main` senkt `accent.on-dark` und `success.strong` unter ihre dokumentierten AA-Werte); zweite Token-Quelle aus `redesign/preview` (**X1**).                           | **bereits aktiv** — `check:colors` pre-commit; AP05 PT05.1.9 hebt ihn in CI                                          |
| **CONTENT_ASSET**         | `src/data/**` · `src/content/**` · `public/downloads/**` · `server.ts:SITEMAP_ROUTES`                                                                                                              | AP04, AP09, AP12–AP21, AP29                    | Jede Content-ID mit URL steht in `SITEMAP_ROUTES` · referenzierte Assets existieren je beworbener Sprache                                                                                                                               | Handspiegel verifiziert: 9 Service-IDs ↔ 9 Sitemap-Pfade, 6 Artikel-Slugs ↔ 6 Pfade. Asset-Asymmetrie real (17 DE- vs. 9 EN-PDFs).                                                           | **AP09 PT09.2.6** + **AP08 PT08.6.4** — keine hreflang-Ziele auf nicht vorhandene Inhalte                            |
| **QUALITY_GATE**          | `.github/workflows/ci.yml` · `lefthook.yml` · `vitest.config.ts` · `playwright.config.ts` · `e2e/**` · `scripts/check-color-tokens.mjs` · `package.json`                                           | AP01, AP05, AP08, AP24–AP28, AP30              | Jeder Vertrag hat mindestens eine automatisierte Prüfung · Gates laufen auf der Relaunch-Linie, nicht nur auf `main` · pre-commit und CI stimmen überein                                                                                | CI triggert nur auf `main`; die gesperrte Baseline war nie gegated. `vitest` läuft im Sandbox nicht (Memory `sandbox-runtime-gates-blocked`).                                                | **AP27 PT27.6** — Welle 1, „frühe CI-/Regression-Gates"                                                              |
| **DEPLOYMENT**            | `docker-compose.yml` · `Dockerfile` · `server/Dockerfile` · `server.ts` (Port/Bind) · `vite.config.ts` · `docs/deploy-preview.md` · `package.json`                                                 | AP02, AP22, AP26, AP28, AP31, AP32             | Produktion serviert aus `dist/`, nie aus `src/` · beide Dienste binden `127.0.0.1` · `npm pkg delete scripts.prepare` in beiden Build-Stages · persistente Daten **außerhalb** des App-Containers (PT28.5.5) · Secrets außerhalb Images | Quelländerung unsichtbar bis `npm run build`. Entfernte `prepare`-Löschung bricht den Docker-Build. `nginx.conf`/`vercel.json` beschreiben eine Topologie, die es nicht gibt.                | **AP28 PT28.2.7 + PT28.4.4** — Healthchecks, Health-Gate nach Deploy                                                 |
| **CONTENT_CLAIM** **neu** | `src/pages/IglooProPage.tsx` · `src/components/sections/Igloo*.tsx` · `public/locales/*/products.json` (× 10) · `structuredData.ts` `iglooProProductSchema` · `public/downloads/**` (PDFs)         | AP00, AP04, AP11, AP13, AP14, AP30             | **`CV < 2 %` identisch in Code, 10 Locales, Structured Data und PDF** (`DEC-RL-008`, PT14.4.1) · keine `<5 %`-Rückmigration (PT14.4.2) · Risk-Register-Vermerk erhalten (PT14.4.4)                                                      | Vier unabhängige Ausgabekanäle für **eine** Zahl, ohne verbindenden Guard. Ein PDF-Austausch oder eine Übersetzungsrunde kann still divergieren. Gate 7.                                     | **AP27** — Claim-Konsistenz-Guard über Code, Locales, Schema (PDF-Prüfung ggf. manuell)                              |
| **SEARCH_INDEX** **neu**  | `src/hooks/useSearch.ts` · `src/components/ui/SearchModal.tsx` · `src/data/**` · `public/locales/*/common.json` (`search.*`)                                                                       | AP03, AP07, AP08, AP10, AP15, AP16, AP19       | Jedes Suchziel ist eine existierende Route · Index deckt die strategischen Seiten ab · Titel/Beschreibungen × 10                                                                                                                        | Heute 6 statische Pfade gegen 27 Sitemap-Routen; `sports` zeigt ins Leere (`useSearch.ts:87`). Strategische Seiten sind nur per Direkt-URL erreichbar — genau das, was AP07 DoD ausschließt. | **AP07 PT07.1** + **AP10 PT10.3.4** — Search aus der Route Registry ableiten                                         |

---

## 7. Serialization Barriers

Neu bewertet gegen alle 34 APs und gegen Master-Scope §7 („Kritische Abhängigkeitslogik") sowie §6 (Wellen).
**Die AP-Nummer ist ausdrücklich keine Reihenfolge** — der Scope sagt das selbst.

| ID      | Früheres AP                                               | Spätere Arbeit                                                                                                                                              | Barriere                                                  | Begründung                                                                                                                                                                                                                                                                                                                                                                                        |
| ------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S1**  | **AP01** Import-Hygiene                                   | Jede Arbeit an `App.tsx`, `server.ts`, `Header.tsx`, `structuredData.ts`, `MusterbefundPage.tsx`, `ContactForm.tsx`, `ChapterNav.tsx`, `tailwind.config.js` | **HARD**                                                  | Scope §7: _„Import-Hygiene → erster `main`-Import — verhindert Garantie-Band-/Footer-/404-Regressionsfehler."_ Die Reconciliation-Map platziert Hunks in genau diesen acht Dateien. Paralleles Editieren heißt zwei Agenten auf derselben Region aus verschiedenen Basen.                                                                                                                         |
| **S2**  | **AP02 + AP10** Route Registry                            | AP07, AP11–AP21, AP29 (jede routen-hinzufügende Arbeit)                                                                                                     | **HARD**                                                  | Scope §7: _„Route Registry/SEO-Fundament → Sitemap und main-Imports."_ Der Spiegel ist heute **vierfach** von Hand geführt (App/server/SEOHead/useSearch) und **ungesichert**: `e2e/url-smoke.spec.ts` deckt weder `/epigenetics` noch die Musterbefunde noch `/consumer/*` ab und prüft nie `response.status()`. Bis PT10.3 + PT27.5 stehen, ist jede neue Route ein unverifiziertes 404-Risiko. |
| **S3**  | **AP23** Consent-Fundament                                | AP11–AP21 (alle Conversion-Events), AP25 (Web Vitals), AP27 PT27.4                                                                                          | **HARD**                                                  | Scope §7: _„Consent-Fundament → Tracking. Vor Consent darf kein GTM/GA4 geladen werden."_ `REST-02` verlangt vollständigen Ladeverzicht. Heute existieren drei Event-Wege; jede vor der Entscheidung geschriebene Instrumentierung ist Nacharbeit.                                                                                                                                                |
| **S4**  | **AP22** Lead-Persistenz/CRM                              | AP19 gated Lead-Magnet, AP15 PT15.6 Epigenetik-Inquiry, AP20 PT20.2–.3, AP21 PT21.5                                                                         | **HARD**                                                  | Scope §7 gleich zweifach: _„CRM-Fundament → Formularmigration"_ und _„Lead-Magnet-Backend → gated Asset-Rollout — sonst ist das Gate durch direkte öffentliche URLs umgehbar."_ Verifiziert: es gibt keine Persistenz, keine Queue, keine Idempotenz. AP19 hätte nichts, woran es andocken kann.                                                                                                  |
| **S5**  | **AP28** Environment-Basis                                | AP22 Betriebsarbeit, AP26 Secrets, AP31, AP32                                                                                                               | **HARD**                                                  | Scope §7: _„Docker/Compose-Environment → CRM-Betriebsarbeit — Secrets, Monitoring, Backup, Rollback hängen daran"_ und _„`DRY_RUN`-Ausweitung → erste CRM-Anbindung — Preview darf keine echten Leads schreiben."_ Deshalb steht AP28 in **Welle 2**, nicht in Welle 5.                                                                                                                           |
| **S6**  | **AP08** i18n-Fundament (PT08.1–.2)                       | Die 10-Sprachen-Welle in AP15–AP21                                                                                                                          | **HARD** _(Fundament)_ / **SOFT** _(Übersetzungsvolumen)_ | Scope §7: _„i18n-Fundament → Übersetzungswelle. Erst Code lokalisierbar machen, dann 10 Sprachen vervollständigen."_ Für den Consumer-Baum ist das **hart**: 2 884 Zeilen mit 0 × `useTranslation` können nicht übersetzt werden, bevor PT08.2 sie lokalisierbar macht. Für bereits lokalisierte Bereiche ist es weich.                                                                           |
| **S7**  | **AP05** Design-Fundament                                 | AP11–AP21 breite Seitenarbeit                                                                                                                               | **SOFT**                                                  | Scope §7: _„Design-Fundament → Seitenmigration."_ Weich, weil `check-color-tokens.mjs` bereits pre-commit läuft und Drift nicht akkumulieren lässt. Wer ein neues Token braucht, pflegt Config **und** `PALETTE_HEX` im selben Commit.                                                                                                                                                            |
| **S8**  | **AP03** IA                                               | AP06 Shell, AP07 Suche, AP11–AP21 Einstiegspunkte                                                                                                           | **SOFT**                                                  | `navItems` und die Footer-Liste sind die einzigen Entdeckungswege. Eine ohne Nav-Eintrag gemergte Seite ist nur per URL erreichbar — der Zustand, in dem `/support` heute ist (`EXTRA_KNOWN_PATHS`: _„reachable from the header, intentionally unlisted"_). AP07 DoD schließt genau das aus.                                                                                                      |
| **S9**  | **AP15** Epigenetik-IA                                    | AP15 PT15.6 Inquiry, AP16                                                                                                                                   | **SOFT**                                                  | Scope §7: _„Epigenetik-IA → Epigenetik-Inquiry. Panel-/Source-Kontext hängt von der IA ab."_ Innerhalb desselben AP — deshalb PT-Reihenfolge, keine AP-Barriere.                                                                                                                                                                                                                                  |
| **S10** | **AP23** Chat-Entfernung (mit AP06 PT06.4.6, AP22 PT22.7) | AP26 PT26.2 CSP-Finalisierung                                                                                                                               | **SOFT**                                                  | Scope §7: _„Chat-Entfernung → CSP-Finalisierung — unnötige Third-Party-Domains zuerst entfernen."_ Die CSP kann vorbereitet, aber nicht abgeschlossen werden, solange HiHuman-Domains gebraucht werden.                                                                                                                                                                                           |
| **S11** | **AP27** frühe CI-Guards                                  | 10-Sprachen-Rollout (AP08, AP15, AP16, AP21)                                                                                                                | **HARD** _(für den Rollout-Nachweis)_                     | Scope §7: _„CI-Guards → 10-Sprachen-Rollout. Vollständigkeit muss maschinell messbar sein."_ Ohne Key-Parität-Guard ist Gate 1 nicht beweisbar — bei 2 305 Keys × 10 Sprachen nicht manuell prüfbar. Deshalb steht AP27 in **Welle 1**.                                                                                                                                                           |
| **S12** | **AP27** vollständige Gates                               | **AP30** RC, **AP31** Go-live                                                                                                                               | **HARD**                                                  | AP30 DoD verlangt _„erfüllt alle Launch-Gates"_. Ohne automatisierte Gates gibt es keinen RC — nur eine Behauptung. Verstärkt durch den CI-Trigger-Befund (§12).                                                                                                                                                                                                                                  |
| **S13** | **AP29** Migration/Redirect Map                           | **AP31** Go-live                                                                                                                                            | **HARD**                                                  | AP29 DoD: _„keine relevante Alt-URL bleibt ohne Entscheidung."_ Ein Cutover ohne finalisierte Redirect Map verliert Rankings irreversibel.                                                                                                                                                                                                                                                        |
| **S14** | **AP30** RC-Freeze                                        | **AP31** Go-live                                                                                                                                            | **HARD**                                                  | PT30.5.1 hält den Commit-SHA fest; PT31 deployt genau dieses Image. Ohne Freeze gibt es kein definiertes Rollback-Ziel (PT31.5.1).                                                                                                                                                                                                                                                                |
| **S15** | **AP31** Go-live                                          | **AP32** Stabilisierung                                                                                                                                     | **HARD** _(trivial)_                                      | Post-Launch-Monitoring setzt einen Launch voraus.                                                                                                                                                                                                                                                                                                                                                 |
| **S16** | AP00 Governance                                           | alles                                                                                                                                                       | **NO_BARRIER** _(technisch)_ / **SOFT** _(prozessual)_    | Kein Quellcode-Fußabdruck. Blockiert technisch nichts, liefert aber die Decision-Referenz, auf die alle Tickets zeigen (PT00.1).                                                                                                                                                                                                                                                                  |
| **S17** | AP04 Content-Readiness                                    | AP11–AP21                                                                                                                                                   | **SOFT**                                                  | Content kann parallel zu Seiten entstehen; PT04.3.1 („Platzhalter eliminieren") ist erst zum Freeze (AP29 PT29.4) bindend.                                                                                                                                                                                                                                                                        |
| **S18** | AP24 ↔ AP25 ↔ AP26                                        | untereinander                                                                                                                                               | **NO_BARRIER**                                            | Disjunkte Dateimengen bis auf `.github/workflows/ci.yml`, wo alle drei nur Schritte anhängen.                                                                                                                                                                                                                                                                                                     |
| **S19** | AP12 ↔ AP13 ↔ AP14 ↔ AP17 ↔ AP18                          | untereinander                                                                                                                                               | **NO_BARRIER**                                            | Jeweils eigene Seiten-, Daten- und Namespace-Dateien.                                                                                                                                                                                                                                                                                                                                             |
| **S20** | AP33 Dokumentation                                        | —                                                                                                                                                           | **NO_BARRIER**                                            | Kein Code. Umgekehrte Abhängigkeit: die beschriebenen Verträge sollten stabil sein, sonst veraltet die Doku sofort.                                                                                                                                                                                                                                                                               |

**Explizit widerlegte Reihenfolge-Annahmen.** AP28 (Nr. 28) gehört nach Scope §6 in **Welle 2** und ist
Vorbedingung für AP22-Betriebsarbeit — eine niedrigere Nummer wartet also auf eine höhere. AP27 (Nr. 27)
gehört mit frühen Gates in **Welle 1**. AP22 (Nr. 22) startet in Welle 2 und schließt erst in Welle 4.
AP07 (Nr. 7) ist trotz niedriger Nummer von AP10 und AP15/AP16 abhängig, weil sein Index deren Routen führt.

---

## 8. Parallelization Map

Klassifikation aus tatsächlicher Repository-Kopplung, nicht aus dem Wellenmodell.

### A. Nebenläufig auf getrennten Branches/Worktrees, geringes Merge-Risiko

| AP(s)                            | Klassifikation    | Geteilte Dateien                          | Geteilte Verträge                               | Begründung                                                                                                                                                                                | Vorbedingung                  | Koordinationsregel                      |
| -------------------------------- | ----------------- | ----------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | --------------------------------------- |
| **AP17 ∥ AP18**                  | **SAFE_PARALLEL** | keine                                     | CONTENT_ASSET, SEO (getrennte Schemabuilder)    | Artikel und Events haben je eigene Seiten, Datendatei und Namespace (`articles.json` / `events.json`). Berührungspunkt ist `structuredData.ts`, aber additiv in verschiedenen Funktionen. | AP04-Datenmodell              | keine                                   |
| **AP24 ∥ AP25 ∥ AP26**           | **SAFE_PARALLEL** | `.github/workflows/ci.yml` (nur Anhängen) | QUALITY_GATE                                    | AP24 → `src/components/**` + axe; AP25 → `vite.config.ts`, Assets, Budgets; AP26 → `server.ts`-Header, `server/server.js`-Limits, Docker-Scans. Disjunkte Editierflächen.                 | AP05-Tokens für AP24-Kontrast | Ein Owner für `ci.yml` je Merge-Fenster |
| **AP33 ∥ alles**                 | **SAFE_PARALLEL** | keine                                     | alle (beschreibend)                             | Reine Dokumentation, kein Quellcode.                                                                                                                                                      | beschriebene Verträge stabil  | keine                                   |
| **AP29 ∥ AP30** _(Vorbereitung)_ | **SAFE_PARALLEL** | keine                                     | ROUTING, SEO / QUALITY_GATE                     | Crawl-Vergleich und QA-Matrix sind Analyse; keine Code-Änderung.                                                                                                                          | AP10, AP09 stabil             | Ergebnisse vor AP31 zusammenführen      |
| **AP12 ∥ AP17 ∥ AP18**           | **SAFE_PARALLEL** | keine                                     | CONTENT_ASSET, SEO, LOCALE (Namespace-getrennt) | Diagnostik-Hub, Artikel, Events berühren einander nicht.                                                                                                                                  | AP03-IA, AP05-Tokens          | Namespace-Partitionierung               |

### B. Konzeptionell unabhängig, aber Kollision in denselben Hotspot-Dateien

| AP(s)                              | Klassifikation                 | Geteilte Dateien                                                           | Begründung                                                                                                                                                                                                                                                         | Koordinationsregel                                                                                                                                                                       |
| ---------------------------------- | ------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AP15 ∥ AP16**                    | **PARALLEL_WITH_COORDINATION** | `src/App.tsx`, `src/pages/EpigeneticsPage.tsx`, `useSearch.ts`             | AP16 braucht **keinen** `server.ts`-Edit — die sechs Musterbefund-Sitemap-Einträge existieren bereits auf der Baseline. AP15 braucht genau drei Zeilen. Aber PT15.3.3 („Musterbefunde als Einstiegstüren") macht AP15 inhaltlich von AP16-Entscheidungen abhängig. | Ein `App.tsx`-Owner je Merge-Fenster; Route-Reihenfolge (sechs explizite **vor** `:slug`) ist ein Review-Punkt                                                                           |
| **AP13 ∥ AP14**                    | **PARALLEL_WITH_COORDINATION** | `structuredData.ts`, `public/locales/*/products.json`                      | AP13 PT13.5 (POC-Systemlösungen) und AP13 PT13.2 (Dental) verweisen auf IglooPro; AP14 PT14.4 hält den `CV < 2 %`-Claim.                                                                                                                                           | **CONTENT_CLAIM ist single-owner** — nur AP14 ändert die Zahl                                                                                                                            |
| **AP09 ∥ AP10**                    | **PARALLEL_WITH_COORDINATION** | `server.ts` `SITEMAP_ROUTES` — gleichzeitig SEO-Fläche **und** 404-Tabelle | Eine Struktur, zwei Eigentümer.                                                                                                                                                                                                                                    | Route-Tabellen-Edits serialisieren, auch wenn die Absicht rein SEO ist                                                                                                                   |
| **AP08 ∥ AP15 ∥ AP16 ∥ AP17–AP21** | **PARALLEL_WITH_COORDINATION** | `public/locales/**` (150 Dateien)                                          | Content-Autorenschaft skaliert nur parallel.                                                                                                                                                                                                                       | **Nach Namespace partitionieren, nicht nach Sprache.** `epigenetics.json` → AP15/AP16; `home.json` → AP11; Consumer-Namespace → AP21; `src/i18n.ts` `NAMESPACES` ist single-owner (AP08) |
| **AP06 ∥ AP07**                    | **PARALLEL_WITH_COORDINATION** | `Header.tsx` (`navItems` ↔ `SearchModal`-Einbindung)                       | AP06 besitzt die Shell, AP07 den Index und den Dialog.                                                                                                                                                                                                             | AP07 ändert `navItems` nicht; AP06 ändert `useSearch.ts` nicht                                                                                                                           |
| **AP11 ∥ AP15**                    | **PARALLEL_WITH_COORDINATION** | `src/pages/HomePage.tsx`, `public/locales/*/home.json`                     | PT11.3.4 fordert Epigenetik als eigenständige Säule **auf der Startseite** — inhaltlich AP15, technisch AP11.                                                                                                                                                      | AP15 liefert Text/Ziel, AP11 platziert                                                                                                                                                   |
| **AP19 ∥ AP14**                    | **PARALLEL_WITH_COORDINATION** | `public/downloads/**`, `server/server.js`                                  | PT19.4.1 macht den ROI-Report zum Lead-Magnet-Kandidaten; PT14.6.2 verweist darauf.                                                                                                                                                                                | AP19 besitzt den Gate-Mechanismus, AP14 nur den Verweis                                                                                                                                  |

### C. Nicht beginnen, bevor ein früherer Architekturvertrag steht

| AP(s)                                     | Klassifikation                                 | Blockiert durch            | Begründung                                                                                                                                                                                                                                     |
| ----------------------------------------- | ---------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AP01 ∥ irgendetwas**                    | **SERIAL_RECOMMENDED**                         | —                          | Hunks in den acht höchstriskanten Dateien (S1). Allein laufen lassen.                                                                                                                                                                          |
| **AP11–AP21 Routenarbeit**                | **SERIAL_RECOMMENDED** _(bis PT10.3 + PT27.5)_ | AP02/AP10 (S2)             | Vier ungesicherte Handspiegel; der bestehende Smoke-Test würde eine Verletzung nicht sehen. **Nach dem Route-Registry-Guard entspannt sich das auf PARALLEL_WITH_COORDINATION — die wirkungsvollste einzelne Freischaltung der ganzen Karte.** |
| **Jede Tracking-Instrumentierung**        | **SERIAL_RECOMMENDED**                         | AP23 (S3)                  | Drei Event-Wege koexistieren; `REST-02` verlangt vollständigen Ladeverzicht.                                                                                                                                                                   |
| **AP19 gated Pfad**                       | **SERIAL_RECOMMENDED**                         | AP22 (S4)                  | Ohne Persistenz/Queue/Entitlement ist das Gate über die öffentliche `/downloads/`-URL umgehbar — Scope §7 nennt genau das.                                                                                                                     |
| **AP22 Betriebsarbeit**                   | **SERIAL_RECOMMENDED**                         | AP28 (S5)                  | Secrets, Monitoring, Backup, Rollback und `DRY_RUN`-Isolation hängen am Environment-Modell.                                                                                                                                                    |
| **Consumer-Übersetzung (AP21 PT21.2–.4)** | **SERIAL_RECOMMENDED**                         | AP08 PT08.2 (S6)           | 2 884 Zeilen mit 0 × `useTranslation` sind nicht übersetzbar, bevor sie lokalisierbar sind.                                                                                                                                                    |
| **AP26 PT26.2 CSP-Abschluss**             | **SERIAL_RECOMMENDED**                         | Chat-Entfernung (S10)      | Scope §7.                                                                                                                                                                                                                                      |
| **AP31 Go-live**                          | **SERIAL_RECOMMENDED**                         | AP27, AP29, AP30 (S12–S14) | Drei harte Vorbedingungen.                                                                                                                                                                                                                     |

### D. Parallel implementierbar, Integration/Validierung muss serialisiert werden

| AP(s)                                         | Klassifikation                                                     | Warum die Integration seriell ist                                                                                                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **AP15 + AP16 + AP21** _(alle × 10 Sprachen)_ | PARALLEL_WITH_COORDINATION → **serielle Validierung**              | Gate 1 prüft Sprachvollständigkeit **site-weit**. Jedes AP kann seine Namespaces unabhängig füllen, aber der Parität-Guard läuft über alle 150 Dateien und ist erst nach dem letzten Merge grün. |
| **AP11–AP21 Conversion-Events**               | parallele Implementierung → **serielle Consent-Validierung**       | Gate 2 prüft, dass **kein** Provider-Request vor Consent entsteht. Ein einziges AP, das direkt in `dataLayer` schreibt, kippt das Gate für alle.                                                 |
| **AP15 + AP19 + AP20 + AP21 Journeys**        | parallele Formular-Arbeit → **serielle CRM-Validierung**           | Gate 3 verlangt Persistenz, Retry, Idempotenz und Dedup für **jeden** Lead. Die Verträge müssen identisch sein (AP22 PT22.1), also gemeinsam abgenommen werden.                                  |
| **AP09 + AP10 + AP21 + AP29**                 | parallele SEO-Arbeit → **serielle Sitemap-/Canonical-Validierung** | Gate 4 prüft Canonical/hreflang/Sitemap über alle Routen × 10 Sprachen aus **einer** generierten Datei.                                                                                          |
| **AP05 + AP24**                               | parallele Token-/A11y-Arbeit → **serielle Kontrastabnahme**        | Gate 11 prüft Kontraste; Token-Änderungen und A11y-Nachweis müssen gegen denselben Stand laufen.                                                                                                 |

---

## 9. Complete AP00–AP33 Concurrency Summary

Jedes AP genau einmal. `BD` = Barriere-abhängig von.

| AP       | Main Hotspots                                                                                                                                              | Barrier Dependency                         | Parallelization                                          | Notes                                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **AP00** | keine (Dokumente)                                                                                                                                          | —                                          | SAFE_PARALLEL                                            | Kein Code-Fußabdruck. Liefert Decision-Referenz für alle Tickets.                      |
| **AP01** | `App.tsx`, `server.ts`, `Header.tsx`, `Footer.tsx`, `structuredData.ts`, `MusterbefundPage.tsx`, `ContactForm.tsx`, `ChapterNav.tsx`, `tailwind.config.js` | — (erstes Code-AP)                         | **SERIAL_RECOMMENDED**                                   | S1. Allein laufen lassen; acht G2/G3-Dateien.                                          |
| **AP02** | keine (Zielbilder)                                                                                                                                         | BD: AP01 (kennt die Baseline)              | SAFE_PARALLEL                                            | Kein Code-Fußabdruck. **Definiert ROUTING, LEAD_DATA, DEPLOYMENT** für AP10/AP22/AP28. |
| **AP03** | keine (IA-Definition)                                                                                                                                      | BD: AP02                                   | SAFE_PARALLEL                                            | Kein Code-Fußabdruck. Determiniert `navItems` und Route-Liste.                         |
| **AP04** | `public/locales/**`, `src/data/**`, `src/content/downloads.json`, `public/downloads/**`                                                                    | BD: AP03                                   | PARALLEL_WITH_COORDINATION                               | Namespace-Partitionierung mit AP08/AP17–AP21.                                          |
| **AP05** | `tailwind.config.js`, `check-color-tokens.mjs`, `src/index.css`, `src/components/ui/**`, `ci.yml`                                                          | BD: AP01                                   | PARALLEL_WITH_COORDINATION                               | S7 SOFT — Guard läuft bereits pre-commit. Kontrast mit AP24 abstimmen.                 |
| **AP06** | `Header.tsx`, `Footer.tsx`, `Layout.tsx`, `App.tsx` (`MainLayout`), `CookieBanner.tsx`                                                                     | BD: AP03, AP05                             | PARALLEL_WITH_COORDINATION                               | PT06.4.6 entfernt `ChatWidget` (Gate 5). PT06.3.8 schützt Gate 8.                      |
| **AP07** | **`useSearch.ts`**, `SearchModal.tsx`                                                                                                                      | BD: **AP10**, AP15, AP16                   | PARALLEL_WITH_COORDINATION                               | Trotz niedriger Nummer von höheren APs abhängig — Index führt deren Routen.            |
| **AP08** | `src/i18n.ts`, `public/locales/**`, **`consumer/**`**, `S3Leitlinie/VitaminD3Implantologie`, `server/server.js`                                            | BD: AP02, AP04                             | PARALLEL_WITH_COORDINATION                               | S6: Fundament HART, Übersetzungsvolumen weich. **Gate 1.**                             |
| **AP09** | `SEOHead.tsx`, `server.ts` (Sitemap), `structuredData.ts`, `robots.txt`                                                                                    | BD: AP02, **AP10**                         | PARALLEL_WITH_COORDINATION                               | Teilt `SITEMAP_ROUTES` mit AP10 — Edits serialisieren. **Gate 4.**                     |
| **AP10** | `server.ts`, `App.tsx`, `e2e/url-smoke.spec.ts`                                                                                                            | BD: AP01, AP02                             | **SERIAL_RECOMMENDED**                                   | S2. **PT10.3 löst alle vier Handspiegel auf — größte Freischaltung der Karte.**        |
| **AP11** | `HomePage.tsx`, `src/components/sections/**`, `home.json`                                                                                                  | BD: AP05, AP06, AP10; Events: AP23         | PARALLEL_WITH_COORDINATION                               | PT11.3.4 (Epigenetik-Säule) mit AP15 abstimmen.                                        |
| **AP12** | `ServicesOverviewPage.tsx`, `services.tsx`, `services.json`                                                                                                | BD: AP05, AP10                             | SAFE_PARALLEL                                            | Eigener Dateisatz. Teilt Datenmodell mit AP13.                                         |
| **AP13** | `ServicePage.tsx` (ein Template), `services.tsx`, `services.json`                                                                                          | BD: AP05, AP10, AP12                       | PARALLEL_WITH_COORDINATION                               | **10 PTs auf einer Template-Datei** — intern serialisieren.                            |
| **AP14** | `IglooProPage.tsx`, `Igloo*.tsx`, `structuredData.ts`, `products.json`, PDFs                                                                               | BD: AP05, AP10                             | PARALLEL_WITH_COORDINATION                               | **CONTENT_CLAIM single-owner** (`CV < 2 %`, Gate 7).                                   |
| **AP15** | `EpigeneticsPage.tsx`, `epigenetics/**`, `App.tsx`, `server.ts`, `Header/Footer`, `useSearch.ts`, `server/server.js`                                       | BD: AP01, AP10, **AP22** (Inquiry), AP23   | PARALLEL_WITH_COORDINATION                               | **Gate 6.** 7 PTs, breiteste Streuung aller Seiten-APs.                                |
| **AP16** | `MusterbefundPage.tsx`, `content/befunde/**`, `pages/musterbefund/**`, `components/befund/**`, `App.tsx`                                                   | BD: AP01, AP10                             | PARALLEL_WITH_COORDINATION                               | Braucht **keinen** `server.ts`-Edit. `panelNames.test.ts` bricht beim Umbau.           |
| **AP17** | `Article*.tsx`, `articles.ts`, `articleMeta.ts`, `articles.json`                                                                                           | BD: AP05, AP10                             | SAFE_PARALLEL                                            | Eigener Dateisatz.                                                                     |
| **AP18** | `EventsPage.tsx`, `events.ts`, `events.json`                                                                                                               | BD: AP05, AP10                             | SAFE_PARALLEL                                            | Eigener Dateisatz. Geringste Kopplung aller Seiten-APs.                                |
| **AP19** | `DownloadsPage.tsx`, `downloads.json`, `public/downloads/**`, `server/server.js`, `server.ts`                                                              | BD: **AP22** (S4), AP23                    | **SERIAL_RECOMMENDED** _(bis AP22 steht)_                | **Greenfield-Gating.** Gate 10.                                                        |
| **AP20** | `{About,Contact,Support,Privacy,Imprint,Terms}Page.tsx`, `ContactForm.tsx`, `server/server.js`, `server.ts` (Legal-Sitemap)                                | BD: **AP22**, AP09                         | PARALLEL_WITH_COORDINATION                               | PT20.4.8 löst den Legal-Widerspruch — berührt `SITEMAP_ROUTES`.                        |
| **AP21** | **`consumer/**`(2 884 Z.)**,`public/locales/\*\*`, `server.ts`, `server/server.js`, `consumerOrder.ts`                                                     | BD: **AP08 PT08.2** (S6), AP22, AP23, AP10 | **SERIAL_RECOMMENDED** _(Lokalisierung)_ → dann PARALLEL | **Größte Content-Umbaufläche.** `REST-03`, Gate 4. 7 PTs.                              |
| **AP22** | `server/server.js`, neu Persistenz/Queue/CRM, `src/api/**`, Formulare, `docker-compose.yml`                                                                | BD: AP02, **AP28** (S5)                    | **SERIAL_RECOMMENDED**                                   | **Greenfield.** Gate 3. 8 PTs. Blockiert AP15/AP19/AP20/AP21.                          |
| **AP23** | **`index.html`**, `CookieBanner.tsx`, `lib/tracking.ts`, `GtmPageview.tsx`, `consumer/tracking.ts`, `server.ts` CSP                                        | BD: AP06 (Chat-Entfernung)                 | **SERIAL_RECOMMENDED**                                   | S3. **Gate 2.** Blockiert alle Conversion-Events.                                      |
| **AP24** | `src/components/**`, `consumer/**`, `befund/**`, `tailwind.config.js`, `ci.yml`, `eslint.config.js`                                                        | BD: AP05 (Kontrast)                        | SAFE_PARALLEL _(zu AP25/AP26)_                           | **Gate 11.** Skip-Link existiert site-weit nicht.                                      |
| **AP25** | `vite.config.ts`, `entry-client.tsx`, Assets, `server.ts`, `ci.yml`, `pages/musterbefund/**`                                                               | BD: AP16 (Chunk-Split)                     | SAFE_PARALLEL _(zu AP24/AP26)_                           | Lighthouse-CI-Schwellen in `ci.yml`.                                                   |
| **AP26** | `server.ts` (HSTS/CSP), `server/server.js` (Limits), Docker-Dateien, `ci.yml`                                                                              | BD: AP23/AP06 (Chat, S10), AP22, AP28      | SAFE_PARALLEL _(zu AP24/AP25)_                           | **Gate 12.** `X-Powered-By` bereits erledigt; HSTS offen.                              |
| **AP27** | `ci.yml`, `vitest.config.ts`, `playwright.config.ts`, `e2e/**`, Guard-Skripte                                                                              | BD: AP02/AP10 (Verträge müssen existieren) | PARALLEL_WITH_COORDINATION                               | **Welle 1 trotz Nummer 27.** Beweist alle 12 Gates. S11, S12.                          |
| **AP28** | `docker-compose.yml`, `Dockerfile`, `server/Dockerfile`, `server.ts`, `docs/deploy-preview.md`                                                             | BD: AP02                                   | **SERIAL_RECOMMENDED** _(Basis)_ → dann parallel         | **Welle 2 trotz Nummer 28.** `REST-01`, Gate 12. Blockiert AP22-Betrieb (S5). 7 PTs.   |
| **AP29** | keine (ggf. `LEGACY_PATH_REDIRECTS`, `robots.txt`)                                                                                                         | BD: AP09, AP10, AP21                       | SAFE_PARALLEL _(Analyse)_                                | Fast kein Code-Fußabdruck. S13 vor AP31.                                               |
| **AP30** | keine (Verifikation)                                                                                                                                       | BD: **AP27** (S12)                         | SAFE_PARALLEL _(Vorbereitung)_                           | Kein Code-Fußabdruck. PT30.5.1 friert den SHA.                                         |
| **AP31** | keine (Betrieb)                                                                                                                                            | BD: AP27, AP29, AP30 (S12–S14)             | **SERIAL_RECOMMENDED**                                   | Kein Code-Fußabdruck. Cutover + Rollback.                                              |
| **AP32** | keine (Beobachtung)                                                                                                                                        | BD: AP31 (S15)                             | SAFE_PARALLEL _(nach Launch)_                            | Kein Code-Fußabdruck. Erzeugt Folge-Tickets.                                           |
| **AP33** | keine (Dokumentation)                                                                                                                                      | —                                          | SAFE_PARALLEL                                            | Kein Code-Fußabdruck. Natürliche Heimat der §14-Dokumente.                             |

**Verteilung:** SERIAL_RECOMMENDED 8 · PARALLEL_WITH_COORDINATION 14 · SAFE_PARALLEL 12.

---

## 10. Guard-Level Matrix

**G3 — architekturkritisch (8).** Vollständiger Vertragskontext + Regressionssuite vor jeder Änderung.

| Datei                            | Nachweis für G3                                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `server.ts`                      | Sieben Verträge in einer Datei; 11 APs; keine aktuelle Testabdeckung für `isKnownPath`/`NOT_FOUND_MARKER`/`no-store`. |
| `src/App.tsx`                    | 14 APs — die höchste Zahl im Repository; jeder Eintrag hat eine ungesicherte Pflicht in `server.ts`.                  |
| `public/locales/**`              | 18 APs — die breiteste Streuung; stilles Versagen (Key-String bzw. nie geladener Namespace); Gate 1.                  |
| **`src/pages/consumer/**`\*\* ↑  | 2 884 Zeilen, 0 × `useTranslation`, fünf Verträge gleichzeitig; `REST-03` macht es zum Launch-Gate.                   |
| `src/components/seo/SEOHead.tsx` | 24 Konsumenten; exakter String-Match mit `server.ts:314`; Gate 4.                                                     |
| `src/lib/tracking.ts`            | Einzige Consent-Lock-Implementierung; von AP23 PT23.2 ausdrücklich als Zielarchitektur bestätigt.                     |
| `server/server.js`               | Alle fünf Endpunkte; AP22 baut Persistenz/Queue/CRM von null; Gate 3 hängt vollständig daran.                         |
| **`index.html`** ↑               | SSR-Template **und** Consent-Bootstrap; AP23 PT23.1 verlangt hier den Gate-2-entscheidenden Umbau.                    |

**G2 — erneut lesen + gezielte Tests (17).** `Header.tsx` · `Footer.tsx` · `structuredData.ts` ·
`tailwind.config.js` · `scripts/check-color-tokens.mjs` · `src/i18n.ts` · `EpigeneticsPage.tsx` ·
`MusterbefundPage.tsx` + `src/content/befunde/**` · `CookieBanner.tsx` · `.github/workflows/ci.yml` ·
`package.json` · **`src/hooks/useSearch.ts`** · **`S3LeitliniePage.tsx` + `VitaminD3ImplantologyPage.tsx`** ·
**Docker/Compose-Trio** · **`src/data/**`+`downloads.json`** · **`ContactForm.tsx`+`use\*Form.ts`+`src/api/**`** ·
**`e2e/url-smoke.spec.ts`**.

**G1 — vor Änderung erneut lesen (13).** `ChapterNav.tsx` · `SearchModal.tsx` · `GtmPageview.tsx` ·
`src/pages/consumer/tracking.ts` · `i18n.server.ts` / `i18n.client.ts` · `robots.txt` · `vite.config.ts` ·
`vitest.config.ts` / `playwright.config.ts` · `lefthook.yml` · `useScrollDepth.ts` ·
`ChatWidget.tsx` + `/api/chat` · `src/components/befund/**` · `src/components/layout/Layout.tsx`.

**G0 — gewöhnlich.** Alles Übrige: einzelne präsentationale `src/components/ui/**`, Blatt-Sektionen, Assets.

---

## 11. Agent Context Requirements

Reale Pfade aus dem existierenden `building-docs/`-Baum. **Basis-Set für jede G2/G3-Änderung:**

```
building-docs/AGENT-CONTRACT.md
building-docs/PROJECT-CONSTRAINTS.md
building-docs/scope/MASTER-SCOPE.md   → den betreffenden AP-Abschnitt + §0.2 + §7 + §8
building-docs/state/AP-STATE.md
git status · git rev-parse HEAD
```

### G3 — zusätzlich pro Datei

**`server.ts`**

- `building-docs/BRANCH-RECONCILIATION-MAP.md` → **N1** (Verbot) und **A10** (die drei erlaubten Zeilen)
- Dieses Dokument §4.1 · §6 (ROUTING, SEO, SSR_HTTP, DEPLOYMENT) · §12
- `src/App.tsx` Routenliste — der zu erfüllende Spiegel
- `src/components/seo/SEOHead.tsx:171` — der exakte Marker-String
- `e2e/url-smoke.spec.ts` — was abgedeckt ist und was nicht
- `git diff -- server.ts` · `git log -5 -- server.ts`

**`src/App.tsx`**

- `building-docs/BRANCH-RECONCILIATION-MAP.md` → **A4, A5, A9, N12**
- Dieses Dokument §4.2 · §6 (ROUTING)
- `server.ts:167`–`:314` (`SITEMAP_ROUTES` → `isKnownPath`)
- `src/components/layout/Header.tsx:44` `navItems` · `Footer.tsx` Linkliste · **`src/hooks/useSearch.ts`** (vierter Spiegel)
- Regeln: Consumer-Routen außerhalb `MainLayout`; explizite Slugs vor `:slug`; `GermanOnlyPage` nur unter AP08 PT08.4.3 anfassen
- `git diff -- src/App.tsx`

**`public/locales/**`\*\*

- Dieses Dokument §4.3 · §6 (LOCALE) · Master-Scope **Gate 1**
- `src/i18n.ts:66` `NAMESPACES` · `src/lib/translationStatus.ts`
- Der eigene Namespace laut §8-Partitionierungsregel — **fremde Namespaces nicht anfassen**
- Aktueller Paritätsbericht (bis Guard G4 existiert: `de` 2 305 · `cs`/`pl` 2 295)

**`src/pages/consumer/**`\*\*

- Dieses Dokument §4.4 · §6 (LOCALE, SEO, LEAD_DATA, CONSENT) · `REST-03`
- Master-Scope **AP21 vollständig (7 PTs)** + **AP08 PT08.2**
- `server.ts:242` `CONSUMER_SITEMAP_ROUTES` (heute nur `/en/*`)
- `src/pages/consumer/tracking.ts` — die ungeprüfte zweite Fassade
- `server/server.js:338` — die unlimitierte Order-Route
- Regeln: `<main>` und Skip-Link fehlen; keine EN-Zwangsredirects (PT21.1.8)

**`src/components/seo/SEOHead.tsx`**

- **N2** · Dieses Dokument §4.5 · §6 (SEO, SSR_HTTP)
- `server.ts:141` `GERMAN_ONLY_PATHS` und `:314` `NOT_FOUND_MARKER`
- Die Liste der 24 konsumierenden Dateien

**`src/lib/tracking.ts`**

- **N9, A20** · Dieses Dokument §4.6 · §6 (CONSENT) · `REST-02`
- Master-Scope **AP23 PT23.2** (bestätigt diese Datei als Ziel)
- `src/pages/consumer/tracking.ts` · `GtmPageview.tsx` · `CookieBanner.tsx` · `index.html`-Consent-Block
- **Nicht ändern, bevor die AP23-Entscheidung dokumentiert ist**

**`server/server.js`**

- **A14** · Dieses Dokument §4.7 · §6 (LEAD_DATA)
- Master-Scope **AP22 vollständig (8 PTs)** + AP19 PT19.3 + AP26 PT26.3
- `src/api/**` Payload-Typen · `src/hooks/use*Form.ts`
- Rate-Limit-Inventar (welche Route keinen `formLimiter` hat)
- `docker-compose.yml` `env_file` — **nur Variablennamen, nie Werte**

**`index.html`**

- **N3** · Dieses Dokument §4.8 · §6 (CONSENT, SSR_HTTP)
- Master-Scope **AP23 PT23.1** + `REST-02` + **Gate 2**
- Regel: Consent-Defaults **vor** dem GTM-Snippet; `<!--ssr-outlet-->` / `<!--helmet-head-->` sind die Platzhalter, die `server.ts` ersetzt

### G2 — Gruppen

**Shell (`Header.tsx`, `Footer.tsx`, `Layout.tsx`):** + **N5, N6, N11, A13** · AP06 (5 PTs) + AP03 PT03.4 · §6 (ROUTING) · Regeln: 44-px-Ziele erhalten; **Footer rendert nie ein Garantie-Band** (Gate 8); `ChatWidget` entfernen (Gate 5).

**SEO-Daten (`structuredData.ts`, `robots.txt`, `src/data/**`, `downloads.json`):** + **A11, A15, N14** · AP09 + AP04 + das jeweilige Content-AP · §6 (SEO, CONTENT_ASSET, CONTENT_CLAIM) · Regel: Datumsnormalisierung nicht verlieren; `CV < 2 %` ist AP14-Eigentum.

**Design-Tokens (`tailwind.config.js`, `check-color-tokens.mjs`, `src/index.css`):** + **N4, X1** · AP05 PT05.1 + AP24 PT24.4 · Regel: neues Token ⇒ **beide** Dateien im selben Commit, sonst blockiert der pre-commit-Guard jeden weiteren Commit im Repository.

**i18n-Kern (`src/i18n.ts`, `i18n.server.ts`, `i18n.client.ts`):** + AP08 PT08.1 · §6 (LOCALE) · Regeln: keine Browser-/Node-APIs in `i18n.ts`; `SUPPORTED_LANGUAGES` ist ein Spiegel von `server.ts:57`; `casestudies` ist nicht registriert.

**Epigenetik (`EpigeneticsPage.tsx`, `MusterbefundPage.tsx`, `content/befunde/**`, `components/befund/**`):** + **A2–A7, A16, N13** · AP15 (7 PTs) + AP16 (5 PTs) · **`git diff -- src/pages/EpigeneticsPage.tsx` — die Datei ist dirty** · `panelNames.test.ts` bricht beim Chunk-Split.

**Lead-Erfassung (`ContactForm.tsx`, `use*Form.ts`, `src/api/**`):** + **A12** · AP22 PT22.1/PT22.5 + AP20 · §6 (LEAD_DATA, CONSENT) · Regel: vorhandene a11y (`aria-invalid`, `role="alert"`, Fokusrückgabe) erhalten.

**Suche (`useSearch.ts`, `SearchModal.tsx`):** + AP07 (3 PTs) + AP10 PT10.3.4 · §6 (SEARCH_INDEX) · Regel: **jedes** Suchziel muss eine existierende Route sein; `sports` entfernen.

**Quality Gates (`ci.yml`, `vitest.config.ts`, `playwright.config.ts`, `e2e/**`):** + AP27 (6 PTs) · §12 (CI-Trigger) · Sandbox-Fakt: `vitest` läuft hier nicht, Playwright/Chromium schon.

**Deployment (Docker-Trio, `docs/deploy-preview.md`):** + AP28 (7 PTs) + `REST-01` · §6 (DEPLOYMENT) · Regeln: `npm pkg delete scripts.prepare` in beiden Stages erhalten; persistente Daten nie im App-Container (PT28.5.5).

---

## 12. Early Regression Guards

Jeder Guard ist jetzt einem **realen PT** zugeordnet. Playwright oder Node bevorzugt, weil `vitest` im
Sandbox blockiert ist (Memory `sandbox-runtime-gates-blocked`).

| Guard/Test                                                                                                                                                                                                                                 | Frühestes AP (PT)                                       | Schützt                                | Spätere Nutznießer                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------- |
| **G0 — CI auf der Relaunch-Linie aktivieren.** Einzeilige Trigger-Änderung.                                                                                                                                                                | **AP27 PT27.6.7**, vorgezogen in Welle 1                | QUALITY_GATE — **alle anderen Guards** | Jedes AP. Ohne dies läuft nichts.                                      |
| **G1 — Route-Registry-Parität.** Jede `<Route>` ↔ Known-Path ↔ Sitemap ↔ **Search-Index**. Statisches Node-Skript.                                                                                                                         | **AP10 PT10.3**                                         | ROUTING, SEARCH_INDEX                  | AP07, AP11–AP21, AP29. **Entspannt Barriere S2.**                      |
| **G2 — Echte HTTP-404.** `response.status() === 404` für unbekannten statischen Pfad **und** unbekannten dynamischen Slug; 200 für jeden bekannten Pfad.                                                                                   | **AP10 PT10.4**                                         | SSR_HTTP                               | AP09, AP15, AP16, AP21, AP29, AP31                                     |
| **G3 — SEO-Artefaktabdeckung.** Sitemap × 10 Sprachen, hreflang-Alternates, German-only einmalig, Consumer × 10, genau ein Canonical, kein Canonical auf 404, **ehrliches `lastmod`**.                                                     | **AP09 PT09.2.8**                                       | SEO                                    | AP15, AP16, AP21, AP29, AP31                                           |
| **G4 — i18n-Namespace- und Key-Parität.** Jede Datei registriert (fängt `casestudies`), jede Sprache mit dem `de`-Keyset (fängt die 10-Key-Lücke in `cs`/`pl`).                                                                            | **AP08 PT08.3.4–.5**                                    | LOCALE — **Gate 1**                    | AP04, AP15–AP21, AP23, AP24                                            |
| **G5 — Kein Pre-Consent-Request.** Playwright: saubere Storage, alle Requests aufzeichnen, keiner erreicht einen Analytics-Host; nach Grant feuern sie.                                                                                    | **AP23 PT23.1** / **AP27 PT27.4.1–.2**                  | CONSENT — **Gate 2**                   | AP11–AP21, AP25, AP31                                                  |
| **G6 — Kein Garantie-CTA-Band.** `cta_section`-Keys, `CtaSection`, `CtaBand` im Build und im Locale-Baum. _Achtung:_ „garantierte Performance" existiert legitim in `services.json`-Fließtext — auf CTA-Keys und Komponenten einschränken. | **AP01 PT01.2.5** / **AP06 PT06.3.8**                   | **Gate 8**                             | AP05, AP11–AP21                                                        |
| **G7 — Kein Chat.** `ChatWidget` nicht im Baum, `POST /api/chat` liefert 404, CSP ohne HiHuman-Domains. **Schlägt heute fehl** (beides existiert) — gemeinsam mit der Entfernung landen.                                                   | **AP06 PT06.4.6** / **AP22 PT22.7** / **AP26 PT26.2.1** | **Gate 5**                             | AP26, AP31                                                             |
| **G8 — Design-Token-Guard.** **Existiert bereits** (`scripts/check-color-tokens.mjs`, pre-commit). Nur als expliziten CI-Schritt ergänzen.                                                                                                 | **AP05 PT05.1.9** / **AP27 PT27.6.4**                   | DESIGN_TOKEN                           | AP24, AP11–AP21                                                        |
| **G9 — Redirect-Status.** Echte `301` (nicht 302, nicht client-seitig) für `/services`, `/services/:slug`, `/agb`, `/s3-leitlinie`, Präfix-Einfügung. **Fängt Altlast 1.**                                                                 | **AP10 PT10.1** / **AP27 PT27.5.1**                     | ROUTING                                | AP09, AP29, AP31                                                       |
| **G10 — Backend-Endpunkt-Vertrag.** Payload akzeptiert/abgelehnt, Rate-Limit vorhanden (**fängt `/api/consumer-order` heute**); später Lead-Schema und Idempotenz.                                                                         | **AP22 PT22.1.10** / **AP26 PT26.3.2**                  | LEAD_DATA — **Gate 3**                 | AP15, AP19, AP20, AP21                                                 |
| **G11 — Smoke-Abdeckung erweitern.** `/epigenetics`, sechs Musterbefunde, drei `/consumer/*` in `ROUTES` aufnehmen. Kleinste sinnvolle Änderung.                                                                                           | **AP01 PT01.1.2**                                       | ROUTING                                | Alles Nachfolgende; Vorbedingung dafür, dass G1/G2 aussagekräftig sind |
| **G12 — Claim-Konsistenz `CV < 2 %`.** Code, 10 Locales und Structured Data gegen einen Wert prüfen. PDF-Abgleich bleibt ggf. manuell.                                                                                                     | **AP14 PT14.4**                                         | CONTENT_CLAIM — **Gate 7**             | AP11, AP13, AP30                                                       |
| **G13 — A11y-Basis.** `<main>` und Skip-Link auf **beiden** Shells, axe über die Kernrouten. **Schlägt heute fehl** (Skip-Link existiert site-weit nicht, Consumer ohne `<main>`).                                                         | **AP24 PT24.6.2** / **AP21 PT21.1.2–.3**                | **Gate 11**                            | AP21, AP30                                                             |

**Mindest-Kette:** **G0 → G11 → G1 → G2**. Ohne G0 läuft kein Guard; ohne G11 prüfen sie eine
unvollständige Routenmenge; G1 und G2 schließen dann den Routing-Vertrag und entspannen Barriere S2.

### CI-Warnung (re-verifiziert)

```yaml
# .github/workflows/ci.yml — Zeilen 3-7, unverändert
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
```

**Befund weiterhin gültig.** CI triggert ausschließlich auf `main`. Die gesperrte Baseline
`feat/home-leadmagnet@961f65d` existiert **nicht auf `origin`** und wurde folglich **nie** durch typecheck,
lint, prettier, vitest, build oder den Playwright-Smoke abgedeckt.

**Konsequenz für die Relaunch-Linie:** Der Master-Scope verlangt zwölf Launch-Gates (§8) und AP27 verlangt,
sie „in CI zu verankern". Solange der Trigger unverändert bleibt, ist **jedes** dieser Gates dokumentarisch
statt maschinell — einschließlich Gate 1, das über 2 305 Keys × 10 Sprachen manuell nicht prüfbar ist.
Ebenso wären die Guards G1–G13 oben wirkungslos.

**AP-Zuordnung:** Der Fix gehört zu **AP27 PT27.6.7** („Build/Lint/Format/Tests"), muss aber nach
Master-Scope §6 **Welle 1** („AP27 frühe CI-/Regression-Gates") vorgezogen werden — praktisch als erster
Schritt gemeinsam mit AP01, weil AP01 selbst die acht riskantesten Dateien anfasst und dabei ungegated wäre.
_(Korrektur gegenüber v1, die den Fix AP01 zuordnete; die Ausführung bleibt früh, die Zuständigkeit ist AP27.)_

---

## 13. Top 15 Files Agents Must Never Edit Blindly

1. **`server.ts`** — sieben Verträge, 11 APs; `NOT_FOUND_MARKER`, `KNOWN_PATHS` und `no-store` sind je eine Löschung von einer site-weiten Regression entfernt, die kein aktueller Test bemerkt.
2. **`src/App.tsx`** — 14 APs, die höchste Zahl im Repository; jeder Eintrag hat eine ungesicherte Pflicht in einer anderen Datei.
3. **`server/server.js`** — alle fünf Endpunkte ohne Persistenz; ein Defekt verliert Leads still, statt sichtbar zu scheitern. AP22 baut hier von null.
4. **`public/locales/**`\*\* — 18 APs, 2 305 Keys × 10 Sprachen; Fehler sind still, Parität ist bereits gebrochen.
5. **`src/pages/consumer/**`** — 2 884 Zeilen, null Lokalisierung, fünf Verträge gleichzeitig; `REST-03` macht daraus ein Launch-Gate.
6. **`src/components/seo/SEOHead.tsx`** — 24 Konsumenten; trägt eine Hälfte des SSR-Status-Handshakes über einen exakten String.
7. **`index.html`** — Consent-Defaults müssen vor dem GTM-Loader stehen, und dieselbe Datei ist das SSR-Template jeder Seite.
8. **`src/lib/tracking.ts`** — einzige Consent-Lock-Implementierung; zwei konkurrierende Fassaden liegen bereits im Baum.
9. **`tailwind.config.js`** — durch ein pre-commit-Skript bewacht, das bei einem nicht in `PALETTE_HEX` gepflegten Token **jeden weiteren Commit im Repository blockiert**.
10. **`src/components/layout/Footer.tsx`** — die einzige Datei, über die das verbotene Garantie-Band zurückkehren würde; PT06.3.8 macht das zur ausdrücklichen Pflicht.
11. **`src/components/layout/Header.tsx`** — IA-Registry plus die WCAG-44-px-Ziele und übersetzten `aria-label`, die `main`s Version entfernt.
12. **`src/hooks/useSearch.ts`** — vierter, in v1 unentdeckter Handspiegel der Route-Registry; enthält heute ein totes Ziel.
13. **`src/components/seo/structuredData.ts`** — 18 Exporte; `main`s Version verliert still die Datumsnormalisierung, von der `createArticleSchema` abhängt.
14. **`src/i18n.ts`** — eine Änderung an `NAMESPACES` oder `SUPPORTED_LANGUAGES` verändert das Ladeverhalten aller zehn Sprachen; die Sprachliste ist nach `server.ts` handgespiegelt.
15. **`.github/workflows/ci.yml`** — der einzige Ort, an dem alle zwölf Launch-Gates wirksam werden, und er läuft derzeit nicht auf der Relaunch-Linie.

_(`src/pages/EpigeneticsPage.tsx` steht knapp außerhalb der Top 15, ist aber zusätzlich **aktuell dirty** —
siehe §16.)_

---

## 14. Recommendations for building-docs

**Bereits vorhanden und kanonisch** — nicht duplizieren, nicht ersetzen:

```
building-docs/README.md
building-docs/AGENT-CONTRACT.md
building-docs/PROJECT-CONSTRAINTS.md
building-docs/REPO-BASELINE.md
building-docs/BRANCH-RECONCILIATION-MAP.md
building-docs/scope/MASTER-SCOPE.md     ← 34 APs / 178 PTs / Decision Locks
building-docs/state/AP-STATE.md
```

**Zusätzlich später anzulegen** (bewusst **nicht** jetzt). Bewertet gegen die Kandidatenliste; jedes hat
eine Heimat im Scope, meist AP33 PT33.1 oder das vertragsstiftende AP.

| Dokument                        | Lohnt sich?                | Frühestes AP   | Warum — und was hinein gehört                                                                                                                                                                                                                                                                                                                  |
| ------------------------------- | -------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`ROUTING-CONTRACT.md`**       | **Ja — höchste Priorität** | AP10 PT10.3    | Der Vertrag mit **vier** Handspiegeln (`App.tsx`, `server.ts`, `SEOHead.tsx`, `useSearch.ts`). PT10.3 verlangt ohnehin eine Single Source of Truth. **Besser generiert als gepflegt** — sobald Guard G1 existiert, ersetzt dessen Ausgabe die Handpflege. Deckt zugleich Scope §10 Nr. 3 (`ROUTE-MATRIX.md`) und Nr. 4 (`REDIRECT-MAP.md`) ab. |
| **`CONSENT-CONTRACT.md`**       | **Ja**                     | AP23 PT23.1–.2 | **Barriere S3 bleibt HART, bis dieses Dokument existiert.** Muss festhalten: welche Event-API gewinnt, was aus `consumer/tracking.ts` und `GtmPageview.tsx` wird, die Event-Taxonomie aus PT23.3 (9 Ereignisse) und die Payload-Regeln. Entspricht Scope §10 Nr. 7 (`TRACKING-PLAN.md`).                                                       |
| **`LEAD-DATA-CONTRACT.md`**     | **Ja**                     | AP22 PT22.2    | **Barriere S4 bleibt HART, bis dies existiert.** Lead-Typen, Consent-Evidence (Zeitpunkt/Version/Umfang), Idempotenzschlüssel, Statusmodell, Dedup, Retention. Der Scope fordert es wörtlich in §10 Nr. 8.                                                                                                                                     |
| **`I18N-CONTRACT.md`**          | **Ja, aber generiert**     | AP08 PT08.3    | Namespace-Registrierung, Paritätsbericht, Fallback-Konvention, Asset-Asymmetrien. **Besser als Guard-G4-Ausgabe** denn als gepflegtes Dokument — 2 305 Keys × 10 Sprachen veralten sofort.                                                                                                                                                     |
| **`QUALITY-GATES.md`**          | **Ja**                     | AP27 PT27.6    | Die zwölf Launch-Gates aus Scope §8 auf konkrete Tests, Skripte und CI-Schritte abgebildet, mit Ist-Status je Gate. Entspricht Scope §10 Nr. 11 (`QA-MATRIX.md`).                                                                                                                                                                              |
| **`DEPLOYMENT-CONTRACT.md`**    | **Ja**                     | AP28 PT28.2    | Compose-Zielstack, Secrets-Modell, Health-Gates, Backup/Restore, Rollback. Sollte `docs/deploy-preview.md` aufnehmen und `nginx.conf`/`vercel.json`/`Dockerfile.dev` als Legacy kennzeichnen (PT28.7). Entspricht Scope §10 Nr. 10 (`OPERATIONS-RUNBOOK.md`).                                                                                  |
| **`SEO-CONTRACT.md`**           | **Bedingt**                | AP09 PT09.1    | Inhaltlich weitgehend eine Ableitung des Routing-Vertrags. Nur eigenständig anlegen, wenn Structured-Data-Abdeckung je Seitentyp (PT09.4.6) und die Indexierungsregeln genug Eigenmasse haben. Sonst Abschnitt in `ROUTING-CONTRACT.md`. Scope §10 Nr. 6.                                                                                      |
| **`DESIGN-SYSTEM-CONTRACT.md`** | **Bedingt**                | AP05 PT05.1    | Der Token-Vertrag ist bereits **ausführbar** in `scripts/check-color-tokens.mjs` kodiert, samt Begründungskommentaren. Ein Dokument lohnt nur für das, was das Skript nicht prüfen kann: Komponentenrezepte, Motion-Tokens, Layoutmuster. Sonst Doppelpflege.                                                                                  |
| **`RUNTIME-CONTRACT.md`**       | **Nein — aufteilen**       | —              | Überschneidet sich vollständig mit SSR_HTTP (→ `ROUTING-CONTRACT.md`) und DEPLOYMENT (→ `DEPLOYMENT-CONTRACT.md`). Ein drittes Dokument über dieselben Dateien erzeugt eine dritte Wahrheit.                                                                                                                                                   |

**Zwei Hygiene-Punkte, unverändert aus v1 und weiterhin offen:** `projektverzeichnis/` (11 Dateien,
genaueste Beschreibung der Site) ist **untracked** und überlebt kein `git clean`; `DOCS.md` und
`_project-knowledge/AUDIT-REPORT.md` beschreiben eine Architektur, die es nicht mehr gibt, und sollten als
historisch markiert werden. Der Scope deckt beides über AP01 PT01.4.4 („Stale Tier-4-Dokumentation
markieren") und Altlast 17 ab.

---

## 15. Previous-Report Corrections

### 15.1 Warum v1 unvollständig war

`IMPLEMENTATION-HOTSPOTS.md` v1 wurde erstellt, **bevor** der Master-Scope im Repository lag. Ein `grep`
über alle `*.md` außerhalb `node_modules` fand AP-Bezeichner nur in den Analysedokumenten der Kette selbst;
`git log --all --diff-filter=A` enthielt kein Scope-Dokument. v1 rekonstruierte daher **16 von 34 APs** aus
den AP-Nummern des Auftrags und aus `BRANCH-RECONCILIATION-MAP.md` §13 und markierte 18 Slots — AP00, AP04,
AP07, AP11–AP14, AP17–AP21, AP26, AP29–AP33 — als unbelegt. Bereiche ohne rekonstruiertes AP trugen die
Markierung `AP-UNMAPPED`.

### 15.2 Was diese Version verwendet

**Alle 34 APs (AP00–AP33) und alle 178 Primärtasks** aus `building-docs/scope/MASTER-SCOPE.md`, gelesen
einschließlich der globalen Abschnitte §0.2 Decision Lock, §1 Projektleitplanken, §2 Globale DoD, §3
Phasenmodell, §4 Querschnittsmatrix, §5 die 20 Launch-Scope-Altlasten, §6 Wellenmodell, §7 Kritische
Abhängigkeitslogik, §8 die zwölf Launch-Gates. **Keine `AP-UNMAPPED`-Markierung verbleibt. Kein AP ist
rekonstruiert oder erfunden.**

### 15.3 Geänderte Schlussfolgerungen (12)

| #   | v1                                        | v2                                                                | Auslöser                                                                                                                                                              |
| --- | ----------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 16/34 APs, 18 unbelegt                    | **34/34 APs, 178/178 PTs**                                        | Scope verfügbar                                                                                                                                                       |
| 2   | CRITICAL = 6                              | **CRITICAL = 8**                                                  | `src/pages/consumer/**` und `index.html` befördert (15.4)                                                                                                             |
| 3   | HIGH = 12                                 | **HIGH = 17**                                                     | fünf Beförderungen/Neuaufnahmen (15.5)                                                                                                                                |
| 4   | Zehn Verträge                             | **Zwölf Verträge**                                                | CONTENT_CLAIM (AP14 PT14.4, Gate 7) und SEARCH_INDEX (AP07 PT07.1) neu                                                                                                |
| 5   | `useSearch.ts` nicht erfasst              | **HIGH, G2, vierter Route-Spiegel**                               | AP07 PT07.1 machte die Datei sichtbar; enthält 6 statt 27 Pfade und das tote Ziel `sports`                                                                            |
| 6   | Drei Handspiegel                          | **Vier Handspiegel**                                              | `useSearch.ts` kommt hinzu; PT10.3 nennt Search ausdrücklich als Teil der einen Wahrheit                                                                              |
| 7   | 11 Barrieren, teils vermutet              | **20 Barrieren, aus Scope §7 belegt**                             | Scope §7 „Kritische Abhängigkeitslogik" liefert 13 explizite Kanten                                                                                                   |
| 8   | CI-Fix „gehört in AP01"                   | **AP27 PT27.6.7, per Welle 1 vorgezogen**                         | Zuständigkeit liegt bei AP27; die frühe Ausführung bleibt richtig                                                                                                     |
| 9   | Zwölf Guards mit geschätzten APs          | **13 Guards, jeder einem realen PT zugeordnet**                   | vollständige PT-Liste verfügbar                                                                                                                                       |
| 10  | Barriere „AP02 → AP22"                    | **AP28 → AP22 zusätzlich HARD**                                   | Scope §7: _„Docker/Compose-Environment → CRM-Betriebsarbeit"_ — AP28 gehört in Welle 2                                                                                |
| 11  | AP-Reihenfolge implizit numerisch gedacht | **AP-Nummer ≠ Reihenfolge, mit vier Gegenbeispielen**             | Scope §6 sagt es selbst; AP28→Welle 2, AP27→Welle 1, AP22→Welle 2–4, AP07 hängt an AP10/AP15/AP16                                                                     |
| 12  | building-docs als Wunschliste             | **acht Kandidaten gegen reale Struktur bewertet, zwei abgelehnt** | `building-docs/` existiert jetzt; `RUNTIME-CONTRACT.md` abgelehnt (Überschneidung), `DESIGN-SYSTEM-CONTRACT.md` bedingt (Vertrag ist bereits im Guard-Skript kodiert) |

### 15.4 Warum zwei Hotspots zu CRITICAL befördert wurden

**`src/pages/consumer/**`(v1: nicht als Hotspot geführt → v2: CRITICAL, G3).** v1 kannte AP21 nicht und
sah in den Consumer-Seiten drei gewöhnliche Landingpages.`REST-03`und AP21 (7 PTs) verlangen alle drei in
zehn Sprachen. Gemessen: 2 884 Zeilen, **0**`useTranslation`, weder `<main>`noch Skip-Link,`tracking.ts`mit ungeprüftem dataLayer-Push,`/api/consumer-order`ohne Rate Limit, Sitemap nur`/en/\*`. Das erfüllt das
CRITICAL-Kriterium doppelt: 9 APs **und** fünf gleichzeitige Verträge.

**`index.html` (v1: HIGH → v2: CRITICAL, G3).** v1 stufte die Datei nach ihrer Rolle als
Konfigurations-/Templatedatei ein. `AP23 PT23.1.1–.2` verlangt, dass GTM **nicht initial lädt** und der
`noscript`-iframe vor Consent unterbunden wird — der Umbau, über den Gate 2 entscheidet, in derselben Datei,
deren Platzhalter jede SSR-Antwort trägt. Ein Fehler bricht entweder das Gate oder jede Seite.

### 15.5 Warum fünf Hotspots zu HIGH wurden

`useSearch.ts` (neu, AP07/AP10) · `S3LeitliniePage.tsx` + `VitaminD3ImplantologyPage.tsx` (1 621 Zeilen
hartcodiert, AP08 PT08.2) · Docker/Compose-Trio (AP28, 7 PTs, `REST-01` — Worker, DB, nginx, Healthchecks) ·
`src/data/**` + `downloads.json` (AP17/AP18/AP19/AP04) · `ContactForm.tsx` + `use*Form.ts` + `src/api/**`
(AP22, 8 PTs). `e2e/url-smoke.spec.ts` und `ChapterNav.tsx` wurden von „HIGH nach Hebelwirkung" bzw. MEDIUM
formal auf HIGH gehoben.

### 15.6 Was unverändert bleibt

Alle sechs CRITICAL-Einstufungen aus v1 bestehen fort und wurden gegen Gegenevidenz geprüft, ohne entkräftet
zu werden. Die zehn Verträge aus v1 bleiben gültig. Die drei Handspiegel aus v1 bleiben bestätigt. Die
Top-15-Liste behält 13 ihrer 15 Einträge. **Die Baseline bleibt `feat/home-leadmagnet@961f65d`; kein
Decision Lock wurde berührt.**

### 15.7 Neubewertung der drei v1-Parallelitätsbehauptungen

**Behauptung 1: „AP24 ∥ AP25 ∥ AP27" → CONFIRMED_WITH_CONDITIONS.**
Die Dateimengen sind tatsächlich disjunkt: AP24 → `src/components/**` + `eslint.config.js`; AP25 →
`vite.config.ts`, Assets, Budgets; AP27 → `e2e/**`, Guard-Skripte. **Aber v1 unterschätzte die Kollision in
`.github/workflows/ci.yml`:** AP24 PT24.6.2 (axe/Playwright), AP25 PT25.5.7 (Lighthouse-CI-Schwellen),
AP27 PT27.6.1–.8 (acht Gates), AP05 PT05.1.9 (Token-Guard), AP08 PT08.3.5 (i18n-Guard) und AP26 PT26.5.1–.2
(Dependency Audit, Secret Scan) hängen **alle** Schritte in dieselbe Datei. **Bedingung:** ein `ci.yml`-Owner
je Merge-Fenster; alle Änderungen rein anhängend. Zusätzlich hängt AP24 PT24.4 (Kontrast) an AP05-Tokens,
also SOFT-Barriere S7. AP26 gehört ergänzend in diese Gruppe (SAFE_PARALLEL, §8 A).

**Behauptung 2: „AP02 ∥ alle Frontend-Seitenarbeit" → REVISED.**
Die Aussage war falsch adressiert. **AP02 ist kein Backend-Implementierungs-AP** — PT02.1–PT02.5 sind
Zielbilder („SSR-Zielbild", „Routing-Zielbild", „Lead-/Backend-Zielbild", „Produktionsbetriebs-Zielbild") und
haben **keinen Quellcode-Fußabdruck**. Es ist damit trivial parallel zu allem, aber aus einem anderen Grund
als v1 annahm — und es ist zugleich eine **Vorbedingung**, weil es die Verträge definiert, die AP10, AP22
und AP28 implementieren.
Was v1 eigentlich meinte, ist **AP22**, und dafür gilt: das Backend ist ein eigenes npm-Paket (eigenes
Lockfile, eigene `node_modules`, eigenes Dockerfile, Express 4 gegen Express 5 im Frontend) ohne
Dateiüberschneidung mit Seitenarbeit. Die **korrigierte** Aussage lautet: _AP22 ∥ Seitenarbeit ist
PARALLEL_WITH_COORDINATION_ — geteilt werden die Payload-Verträge von vier Endpunkten und die
Formularkomponenten (`ContactForm.tsx`, `use*Form.ts`, `src/api/**`), die AP20/AP21/AP15/AP19 ebenfalls
anfassen. **Bedingung:** LEAD_DATA-Vertrag (PT22.1/PT22.2) zuerst einfrieren.

**Behauptung 3: „AP15 ∥ AP16 nach AP01" → CONFIRMED_WITH_CONDITIONS.**
Der technische Kern hält: AP16 benötigt **keinen** `server.ts`-Edit, weil die sechs Musterbefund-Einträge
bereits in `SITEMAP_ROUTES` stehen; AP15 benötigt exakt drei Zeilen. Beide teilen `src/App.tsx`.
**Drei Bedingungen, die v1 nicht kannte:** (a) **AP15 PT15.3.3** („Musterbefunde als Einstiegstüren")
und **PT15.7.1** (Hub + 3 Vertiefungen + 6 Musterbefunde × 10) machen AP15 inhaltlich von AP16-Ergebnissen
abhängig — technisch parallel, fachlich gekoppelt. (b) **AP15 PT15.6** verlangt eine eigene Inquiry mit
eigenem Backend-Pfad, wodurch AP15 zusätzlich an **AP22** hängt (Barriere S4) — AP16 nicht. (c) Beide
schreiben in `epigenetics.json`; die Namespace-Partitionierung aus §8 muss klären, wer welche Keys besitzt.

---

## 16. Remaining Evidence Gaps

Der Scope-Gap aus v1 ist **geschlossen**. Es verbleiben fünf faktische Lücken — alle Repository- oder
Umgebungsbefunde, keine Wissenslücken.

**E1 — `/api/monitoring/*` hat keine Serverseite.** `redesign/preview`s `src/lib/monitoring/report.ts`
(Reconciliation-Map **B2**, im Scope über AP23 PT23.5.1 und AP25 aufgegriffen) sendet Beacons an
`/api/monitoring/client-error` und `/api/monitoring/web-vitals`. Beide Pfade werden in `server.ts` und
`server/server.js` nirgends behandelt — sie fallen in den generischen `/api/`-Proxy. Der Kollektor liegt laut
Quellkommentar außerhalb dieses Repositories und ist von hier nicht auffindbar. AP25 muss die Senke
entscheiden, bevor B1/B2 landen.

**E2 — Kanonische Telefonnummer ungeklärt.** Die Baseline führt drei Nummern (`+49 152 2858 0999` 13×,
`+49 151 75011699` 10× + 5× ohne Leerzeichen, `+49 1515 9878599` 1×); `main@475fefd` vereinheitlichte auf
eine. Das Repository zeigt die Vereinheitlichung, nicht die Autorität dafür. Betrifft AP04 PT04.1 und
AP09 (NAP in `structuredData.ts`).

**E3 — CRM-Anbieter, Queue-Technik und Datenbankprodukt sind bewusst offen.** Master-Scope §13 hält
ausdrücklich fest, dass diese Detailentscheidungen „innerhalb der jeweiligen APs anhand der hier definierten
Verträge getroffen" werden. **Das ist kein Gap im Sinne einer Lücke**, sondern eine bewusst delegierte
Entscheidung — hier nur verzeichnet, damit ein Agent sie nicht als Blocker missdeutet. AP22 PT22.3.1
verlangt eine Adaptergrenze, gerade damit die Wahl später fallen kann.

**E4 — Sechs englische Epigenetik-PDFs fehlen.** `public/downloads/epigenetics/`: 17 deutsche gegen 9
englische Dateien. AP08 PT08.6.2 und AP15 PT15.5.2 verlangen Sprachparität für sichtbare Launch-Assets; ob
die Dateien außerhalb des Repositories existieren, ist von hier nicht feststellbar.

**E5 — `vitest` läuft in dieser Umgebung nicht.** Memory `sandbox-runtime-gates-blocked`: jsdom/`npm test`
sind blockiert, Playwright/Chromium laufen. AP27 PT27.1 (Unit/Component) ist lokal nicht verifizierbar;
Guards sollten, wo eine Wahl besteht, als Playwright-Spec oder Node-Skript geschrieben werden. Betrifft die
Verifikation, nicht die Gültigkeit der Tests.

---

## 17. Final Classification

## HOTSPOT_MAP_READY_WITH_WARNINGS

**Warum READY.** Der Scope-Gap, der v1 einschränkte, ist vollständig geschlossen:

- **34/34 APs und 178/178 Primärtasks gelesen**, jeweils aus dem PT-Text abgeleitet statt aus dem AP-Titel; keine `AP-UNMAPPED`-Markierung verbleibt, kein AP ist rekonstruiert.
- **Jedes AP erscheint genau einmal** in §3 (Hotspot-Matrix) und genau einmal in §9 (Concurrency Summary). Die acht APs ohne direkten Quellcode-Fußabdruck sind ausdrücklich als solche klassifiziert, nicht stillschweigend übergangen.
- **Die verifizierten technischen Befunde aus v1 sind erhalten**: alle sechs CRITICAL-Einstufungen bestehen fort, die zehn Verträge bleiben gültig, die drei Handspiegel bleiben bestätigt. Nichts wurde verworfen, weil die AP-Zuordnung damals unvollständig war.
- **Die Zählungen wurden nicht künstlich erhalten**: CRITICAL 6 → 8 und HIGH 12 → 17, jede Beförderung mit gemessener Evidenz begründet (§15.4/§15.5).
- **Alle 20 Launch-Scope-Altlasten des Master-Scope wurden gegen das Repository geprüft** (§2.3); jede geprüfte ist bestätigt, eine (X-Powered-By) ist bereits erfüllt.
- **Die drei v1-Parallelitätsbehauptungen wurden einzeln neu bewertet** — zwei CONFIRMED_WITH_CONDITIONS, eine REVISED, keine automatisch übernommen.
- **Die Kontextanforderungen nennen reale Pfade** aus dem existierenden `building-docs/`-Baum statt hypothetischer Dokumente; alle 13 Guards sind einem realen PT zugeordnet.

**Warum WITH WARNINGS.** Vier Bedingungen begleiten die Karte — alle Repository-Zustände, keine Wissenslücken:

1. **CI läuft weiterhin nur auf `main`** (§12, re-verifiziert). Die gesperrte Baseline ist nicht auf `origin` und war nie durch ein Gate gedeckt. Bis Guard G0 landet, sind alle zwölf Launch-Gates dokumentarisch — einschließlich Gate 1, das über 2 305 Keys × 10 Sprachen manuell nicht prüfbar ist.
2. **Der Routing-Vertrag hat vier ungesicherte Handspiegel** (`App.tsx`, `server.ts`, `SEOHead.tsx`, `useSearch.ts`) — einen mehr, als v1 kannte. Der bestehende Smoke-Test würde eine Verletzung nicht sehen: er lässt `/epigenetics`, alle sechs Musterbefunde und alle drei `/consumer/*` aus und prüft nie `response.status()`. Bis PT10.3 + PT27.5 stehen, bleibt Barriere S2 HART und blockiert AP07 sowie AP11–AP21.
3. **Zwei Gates stehen heute auf Greenfield.** Gate 3 (CRM) setzt Persistenz, Queue, Idempotenz und Dedup voraus — verifiziert existiert **nichts** davon in `server/server.js`. Gate 10 (Lead-Magnet) setzt eine geschützte Asset-Auslieferung voraus, die es ebenfalls nicht gibt. Das sind keine Refactorings, sondern Neubauten, und sie tragen die Barrieren S4 und S5.
4. **Ein G2-Hotspot ist aktuell dirty.** `src/pages/EpigeneticsPage.tsx` trägt die uncommittete Teilwiederholung von `main@e21a6e5`. Diese Analyse hat sie weder geändert noch aufgelöst. Jede AP15-Aufgabe muss sie klären, bevor sie diese Datei anfasst.

Keine dieser Warnungen blockiert die Planung. Alle vier verändern, in welcher Reihenfolge und mit welchen
Schutzmaßnahmen ausgeführt werden muss.

---

_Erstellt durch read-only Inspektion am 2026-08-21 gegen `feat/home-leadmagnet@961f65d`. Geändert wurde
ausschließlich diese Datei. Kein Quellcode, keine Konfiguration, keine Dependencies, keine Branches, keine
Commits, keine Dienste, kein Deployment-Zustand und keine kanonische Datei unter `building-docs/` wurde
angefasst. Nichts wurde gestaged, committet oder gepusht. Keine Secrets oder Environment-Werte werden
wiedergegeben._
