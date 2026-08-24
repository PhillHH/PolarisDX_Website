# PolarisDX Website Relaunch — FINALER Master-Scope

**Dokumenttyp:** Umsetzungs-Scope / Master Backlog / Delivery Blueprint  
**Projekt:** PolarisDX Website Relaunch  
**Stand:** 2026-08-21  
**Status:** FINAL / Decision-Locked / ausführungsbereit  
**Repository-Baseline:** `feat/home-leadmagnet@961f65d`  
**Gezielte Teilquellen:** `main@d0fdf29`, `redesign/preview@5673b61`, optional `feat/contact-joyful@ab373a3`  
**Dokumentbasis:** Repo-Audits, Decision-Reconciliation-Audit sowie Projektdokumentation (`01`–`10` + `README`)  
**Arbeitsmodell:** Arbeitspaket → Primärtask → Subtasks  
**Umfang:** 34 Arbeitspakete (AP00–AP33) · 178 Primärtasks  
**Ziel:** Der Relaunch soll vollständig planbar, ausführbar, prüfbar, deploybar und nach dem Go-live wartbar sein.

---

## 0. Zweck dieses Dokuments

Dieses Dokument ist die verbindliche finale Scope-Baseline für den PolarisDX-Website-Relaunch. Es übersetzt den auditierten Repository-Ist-Zustand und die bestätigten Product-Owner-Entscheidungen in einen vollständigen Relaunch-Scope. Es ist bewusst breiter als ein klassisches Frontend-Backlog: Neben Seiten und Komponenten umfasst es Architektur, Content, Internationalisierung, SEO, Accessibility, Datenschutz, Tracking, Backend, Security, Performance, Tests, Migration, Deployment, Launch und Betriebsübergabe.

Die Struktur ist so angelegt, dass jedes Arbeitspaket grundsätzlich unabhängig geplant und in Tickets überführt werden kann. Primärtasks bilden die operative Ebene. Subtasks werden nur dort verwendet, wo sie einen echten Ausführungs- oder Prüfschritt darstellen; die Anzahl ist bewusst auf maximal zehn pro Primärtask begrenzt.

## 0.1 Herkunft und Einordnung der Anforderungen

- **Ist-Fakten** wie Stack, Routen, Sprachen, Sitemap-Umfang, vorhandene Komponenten, APIs, Tracking-Events, Deploy-Wege und bekannte Altlasten stammen aus der bereitgestellten Projektdokumentation.
- **Soll-Anforderungen** wie WCAG-2.2-AA-Ziel, Route Registry, Performance Budgets, Launch Gates, Monitoring, CRM-/Lead-Persistenz und zusätzliche Teststufen ergeben sich aus Repository-Evidenz und den bestätigten Product-Owner-Entscheidungen. Formale Content-Governance ist ausdrücklich Backlog.
- Wo eine fachliche, juristische, medizinische oder geschäftliche Entscheidung fehlt, definiert der Scope einen Prüf- oder Entscheidungs-Task statt eine unbelegte Festlegung.

---

## 0.2 Verbindlicher Decision Lock

Die folgenden Entscheidungen gelten als **fixe Constraints** des Relaunchs. Sie werden in den Arbeitspaketen nicht erneut als offene Optionen behandelt.

| ID         | Verbindliche Entscheidung                                                                                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DEC-RL-001 | Alle 10 Sprachen (`de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`) werden vollständig unterstützt; kein dauerhafter EN-Fallback für relevante Inhalte.                                         |
| DEC-RL-002 | **Sales-Machine** aus `feat/home-leadmagnet` ist die Art Direction. `redesign/preview` liefert nur art-direction-neutrale Technik/QA-Patterns.                                                            |
| DEC-RL-003 | Main-Site bleibt **Light**; keine Dark-Theme-Arbeit.                                                                                                                                                      |
| DEC-RL-004 | GTM/GA4 bleiben, aber ausschließlich nach wirksamem Consent; kein Tracking und kein Event-Puffern vor Consent.                                                                                            |
| DEC-RL-005 | Epigenetik ist eine **eigenständige Geschäftssäule** mit eigener IA, Navigation, Homepage-Rolle und Lead Journey.                                                                                         |
| DEC-RL-006 | Consumer-Landingpages bleiben öffentlich **indexierbar** und werden als vollwertige SEO-Seiten betrieben.                                                                                                 |
| DEC-RL-007 | **Kein Chat** im Relaunch; HiHuman, Chat-Loader, `/api/chat`-Mock und zugehörige produktive Reste werden entfernt.                                                                                        |
| DEC-RL-008 | IglooPro-Claim **`CV < 2 %`** bleibt bestehen; Produkt-/Content-Entscheidung, keine unabhängige wissenschaftliche Validierung durch das Repo.                                                             |
| DEC-RL-009 | Leads werden **persistent verarbeitet und an ein CRM übergeben**; Mail-only ist nicht das Zielmodell.                                                                                                     |
| DEC-RL-010 | Formale Content-Governance ist **Backlog**, nicht Launch-Scope.                                                                                                                                           |
| DEC-RL-011 | Epigenetik erhält eine **eigene Inquiry-/Lead-Strecke** mit eigener Backend-/CRM-Zuordnung.                                                                                                               |
| DEC-RL-012 | Das site-weite Band mit „garantierte Performance“ wird **nicht** in den Relaunch übernommen und nicht ersetzt.                                                                                            |
| DEC-RL-013 | Standard-CTA des allgemeinen Anfragewegs: **„Angebot anfragen“**, lokalisiert in allen 10 Sprachen.                                                                                                       |
| DEC-RL-014 | Zusätzlich zur direkten Anfrage gibt es mindestens einen **gated Lead-Magnet-/Secondary-Conversion-Pfad**.                                                                                                |
| DEC-RL-015 | Deal/Voucher/Case Studies/Shop sind bewusst vertagt und gehören in den Backlog.                                                                                                                           |
| REST-01    | Produktionsbetrieb: **Docker/Compose**, Reverse Proxy/nginx davor; persistente Daten separat/backupfähig; Secrets außerhalb Images; Healthchecks, Restart Policies, Monitoring, image-basiertes Rollback. |
| REST-02    | Consent-Modell: **Basic Consent Mode v2 / vollständiger Ladeverzicht**. GTM/GA4 und andere nicht notwendige Marketing-/Analytics-Tags laden erst nach Einwilligung.                                       |
| REST-03    | **Alle Consumer-Landingpages in allen 10 Sprachen**.                                                                                                                                                      |

### 0.2.1 Explizit nicht wieder öffnen

- Sprachreduzierung auf DE/EN oder Consumer-EN-only.
- Alternative Art Direction oder Dark Theme.
- Chat-Anbieterwahl.
- Consumer `noindex`/Basic-Auth.
- Epigenetik nur als Diagnostik-Unterpunkt.
- Mail-only als finales Lead-Modell.
- Rückmigration des IglooPro-Claims auf `<5 %`.
- Ersatzformulierung für das entfernte Garantie-CTA-Band.

### 0.2.2 Backlog, nicht Launch-Blocker

- formale Content-Owner-/Review-/Freshness-/medizinische Freigabe-Governance;
- CMS-Pipeline-Governance;
- Deal/Voucher/Case Studies/Shop;
- tote/unschädliche Legacy-Artefakte, sofern sie Launch, Security, Build oder Imports nicht beeinflussen.

---

# 1. Projektleitplanken

## 1.1 Verifizierte technische Leitplanken

- React 19.2 mit React Router 7.9.
- SSR über Express + Vite; Produktionsauslieferung aus einem reproduzierbaren Build.
- TypeScript, Tailwind CSS, i18next, `react-helmet-async`.
- Zehn Sprachen: `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`.
- URL ist die einzige Sprachquelle; kein Browser-Language-Detector als Routing-Entscheider.
- Baseline enthält funktionierende 404-/SEO-/Cache-Härtung, die bei gezielten Imports aus `main` erhalten bleiben muss.
- `main` liefert gezielt Epigenetik-Unterseiten, `EpiSubpage`, Tokens/Metadaten und Musterbefund-Routenmodule.
- `redesign/preview` liefert gezielt Visual Regression, Error Boundaries, a11y-Audit, Metrics/Web-Vitals und CI-/Changelog-Patterns.
- Bestehende Formulare sind heute überwiegend Mail-zentriert; der Relaunch erweitert sie auf Persistenz + CRM + Retry/Monitoring.
- Consumer-Seiten sind indexierbar und werden auf 10 Sprachen ausgebaut.
- Marketing-/Analytics-Tracking wird erst nach Consent geladen.
- Produktionsbetrieb wird als Docker/Compose-Stack hinter nginx/Reverse Proxy standardisiert.

## 1.2 Verbindliche Relaunch-Prinzipien

1. **Baseline ist `feat/home-leadmagnet@961f65d`.** Andere Branches sind selektive Quellen, keine Gegenentwürfe.
2. **Alle relevanten Routen werden in zehn Sprachen vollständig unterstützt.** Englischer Fallback ist nur defensiv.
3. **Sales-Machine + Light** sind die visuelle Grundlage.
4. **Kein Marketing-/Analytics-Skript lädt vor Consent.** Kein Puffern vor Consent.
5. **Performance-/Web-Vitals-Monitoring wird von Marketing-Tracking getrennt.**
6. **Kein Lead geht bei normalen Fehlerfällen verloren.** Persistenz, Retry, Idempotenz und Auditierbarkeit sind Pflicht.
7. **Epigenetik ist eine eigene Geschäftssäule** mit eigenem Anfragepfad.
8. **Musterbefunde sind Einstiegspunkte** und werden in die Epigenetik-IA eingebettet.
9. **Consumer-Landingpages sind vollwertige 10-sprachige SEO-Seiten.**
10. **Der allgemeine Anfrageweg heißt „Angebot anfragen“.**
11. **Mindestens ein Secondary-Conversion-Pfad ist gegated** und CRM-/Consent-fähig.
12. **Kein Chat im Relaunch.**
13. **Regulatorische Pflichthinweise bleiben sichtbar und dürfen nicht durch Conversion-Optimierung verdrängt werden.**
14. **Das Garantie-CTA-Band kehrt nicht zurück.**
15. **HTTP-Semantik ist Produktqualität:** echte 301, echte 404, korrekte Canonicals, ehrliches `lastmod`.
16. **Route-, Status-, SEO-, i18n- und Design-Guards laufen in CI.**
17. **Datenminimierung:** jede Journey erhebt nur notwendige Felder.
18. **Kundendaten gehören nie ins Repository.**
19. **Preview/Staging dürfen keine produktiven Side Effects erzeugen:** `DRY_RUN`/Isolation gilt auch für CRM und Queue.
20. **WCAG 2.2 AA wird nachgewiesen, nicht nur behauptet.**

---

# 2. Globale Definition of Done

Ein Arbeitspaket gilt erst als abgeschlossen, wenn — soweit für das Paket relevant — alle folgenden Punkte erfüllt sind:

- Fachliche Anforderungen umgesetzt.
- UX/UI gegen freigegebenes Design geprüft.
- Responsive-Verhalten auf definierten Breakpoints geprüft.
- Tastaturbedienung und Screenreader-Basis geprüft.
- Übersetzungs- und Fallback-Verhalten geprüft.
- SEO-Head, Canonical, hreflang und Indexierungslogik geprüft.
- Analytics/Consent korrekt berücksichtigt.
- Keine neuen TypeScript-, ESLint- oder Prettier-Fehler.
- Relevante Unit-/Integration-/E2E-Tests ergänzt.
- Build erfolgreich.
- Visuelle Regression oder manuelle Visual-QA abgeschlossen.
- Dokumentation angepasst.
- Keine offenen Blocker der Priorität P0/P1.
- Abhängige Altlasten entweder behoben oder bewusst dokumentiert.

---

# 3. Phasenmodell

| Phase                        | Ziel                                                   | Typische Arbeitspakete |
| ---------------------------- | ------------------------------------------------------ | ---------------------- |
| Phase 0 — Fundament          | Scope, Zielbild, Risiken, Architektur, Datenbasis      | AP00–AP04              |
| Phase 1 — System             | Design-System, Shell, Navigation, SEO-/i18n-Grundlagen | AP05–AP10              |
| Phase 2 — Seiten             | Kernseiten, Produkt-/Diagnostik-/Content-Bereiche      | AP11–AP20              |
| Phase 3 — Plattformqualität  | Backend, Consent, A11y, Performance, Security, Tests   | AP21–AP27              |
| Phase 4 — Migration & Launch | Redirects, Content-Freeze, Deploy, Go-live             | AP28–AP31              |
| Phase 5 — Betrieb            | Monitoring, Nacharbeiten, Dokumentation, Optimierung   | AP32–AP33              |

---

# AP00 — Programmsteuerung, Scope Lock und Delivery Governance

**Ziel:** Die finale Scope-Baseline, Decision Locks, Abhängigkeiten, Risiken und Abnahmen so führen, dass keine bereits entschiedene Produktfrage während der Umsetzung wieder aufspringt.

## PT00.1 — Scope- und Decision-Baseline festschreiben

1. Dieses Dokument als kanonischen Relaunch-Scope referenzieren.
2. Repository-Baseline `feat/home-leadmagnet@961f65d` festschreiben.
3. `DEC-RL-001` bis `DEC-RL-015` sowie `REST-01` bis `REST-03` in `DECISIONS.md` spiegeln.
4. Teilquellen aus `main`, `redesign/preview` und optional `feat/contact-joyful` als selektive Imports dokumentieren.
5. Scope Changes nur über explizites Decision-/Change-Log zulassen.
6. Backlog vs. Launch-Scope sichtbar trennen.

## PT00.2 — Priorisierungssystem

1. P0 = Launch-Blocker.
2. P1 = Launch-kritisch.
3. P2 = wichtig, aber notfalls post-launch.
4. P3 = Backlog/Optimierung.
5. Kritische Pfade aus i18n, CRM, Consent, SEO, Epigenetik und Deployment kennzeichnen.

## PT00.3 — Risiko- und Annahmenregister

1. IglooPro `CV < 2 %` als Produktentscheidung ohne repo-seitige wissenschaftliche Validierung festhalten.
2. main-Import-Risiko für 404/Redirect/Cache dokumentieren.
3. Regression des entfernten Garantie-CTA-Bands verhindern.
4. CRM-/Queue-/Mail-Ausfallpfade als Betriebsrisiken aufnehmen.
5. Sprach-/Asset-Parität als Release-Risiko führen.

## PT00.4 — Release-Abnahme

1. Product-/Business-Abnahme definieren.
2. technische Abnahme definieren.
3. SEO-/Tracking-/Consent-Abnahme definieren.
4. Legal/Privacy-Abnahme für geänderte Datenflüsse definieren.
5. Launch-Gate-Owner benennen.

**Out of Scope:** formale dauerhafte Content-Governance nach DEC-RL-010.

**DoD AP00:** Scope, Decision Lock, Risiko-Register, Prioritäten und Release-Abnahme sind versioniert und referenzierbar.

# AP01 — Repository-Baseline, Branch-Reconciliation und Import-Hygiene

**Ziel:** Die auditierten Branch-Unterschiede kontrolliert in eine einzige Relaunch-Linie überführen, ohne Baseline-Härtungen zu verlieren.

## PT01.1 — Baseline verifizieren

1. Clean Checkout von `feat/home-leadmagnet@961f65d`.
2. Build, SSR, 404, Redirects, no-store und SEOHead als Baseline-Smoke festhalten.
3. Baseline-spezifische Guards dokumentieren.
4. Untracked/temporäre Artefakte ausschließen.

## PT01.2 — Gezielte `main`-Imports

1. `/epigenetics/grundlagen`, `/studienlage`, `/unterlagen` übernehmen.
2. `EpiSubpage` und `epigenetics/tokens.ts` selektiv übernehmen.
3. `content/befunde/meta.ts` und sechs Musterbefund-Routenmodule übernehmen.
4. Keine main-404-/Footer-/Tracking-Regressionsbestandteile blind mitziehen.
5. `CtaSection`/Garantie-Band explizit nicht importieren.
6. Deal-Komponenten und `.bak-nopopup`-Dateien nicht importieren.

## PT01.3 — Gezielte `redesign/preview`-Imports

1. Visual-Regression-Setup.
2. Error-Boundary-Pattern.
3. Web-Vitals/Metrics-Pattern.
4. a11y-Audit-/Baseline-Screenshot-Skripte.
5. Changelog-/CI-Gate-Pattern.
6. Keine alternative Art Direction oder Dark-Theme-Tokens übernehmen.

## PT01.4 — Legacy-Konfiguration klassifizieren

1. `prerender.mjs`, `vercel.json`, alte nginx-/Docker-Dateien kennzeichnen.
2. Chat-/HiHuman-Reste klassifizieren.
3. tote Search-/Case-Study-/Deal-Artefakte dokumentieren.
4. Stale Tier-4-Dokumentation markieren.
5. Launch-störende Artefakte entfernen, harmlose Altlasten in Backlog verschieben.

## PT01.5 — Toolchain-/Dependency-Audit

1. Runtime-/Dev-Dependencies prüfen.
2. Security Advisories prüfen.
3. Node-/Package-Manager-Version fixieren.
4. Lockfile-Konsistenz prüfen.
5. Clean Build + Test-Baseline messen.

**DoD AP01:** Die Relaunch-Linie baut reproduzierbar; gezielte Imports sind nachvollziehbar; 404/Redirect/Cache- und CTA-Regressionen sind geschützt.

# AP02 — Zielarchitektur: SSR, Routing, Lead Platform und Betrieb

**Ziel:** Die technische Zielarchitektur vor der breiten Seitenarbeit verbindlich machen.

## PT02.1 — SSR- und Rendering-Zielbild

1. SSR als SEO-kritischen Standard beibehalten.
2. Client-Hydration- und Lazy-Loading-Regeln definieren.
3. 404-/Error-SSR-Verhalten festschreiben.
4. Head-Rendering zentral über die SEO-Plattform absichern.
5. Consumer und Epigenetik vollständig SSR-fähig halten.

## PT02.2 — Routing-Zielbild / Route Registry

1. Sprachpräfix als verbindliches URL-Schema.
2. Unpräfixierte URLs ausschließlich als Redirect.
3. Alle 10 Sprachen für B2B, Epigenetik, Consumer und relevante Content-Routen.
4. `/services*` als echte 301-Brücke abbilden.
5. Single Source of Truth für App-Routes, Known Paths, Sitemap, Search und Tests definieren.
6. 404, Canonical und hreflang aus derselben Routing-Wahrheit ableiten.

## PT02.3 — Content-/Asset-Architektur

1. Grenzen zwischen Code, i18n, Content-JSON und Assets festlegen.
2. Musterbefund-, Artikel-, Event- und Download-Datenmodelle stabilisieren.
3. Sprachabhängige Assets explizit modellieren.
4. Gated vs. frei zugängliche Downloads technisch unterscheidbar machen.
5. CMS-Governance nicht in den Launch-Scope ziehen.

## PT02.4 — Lead-/Backend-Zielbild

1. Einheitliches API-Fehlerformat und Validierung.
2. Persistentes Lead-Datenmodell mit Journey-/Source-/Language-Kontext.
3. CRM-Handoff mit Idempotenz.
4. Queue/Retry + Dead-Letter-/Fehlerpfad.
5. Deduplication-Strategie.
6. Retention/Löschung/Auskunft berücksichtigen.
7. Mailzustellung vom Request-Lifecycle entkoppeln, wo sinnvoll.
8. Auditierbarkeit von Consent und Zustellung.
9. Kein Chat-Backend im Zielbild.

## PT02.5 — Produktionsbetriebs-Zielbild

1. Docker/Compose als Produktionsstandard.
2. nginx/Reverse Proxy davor.
3. Web/SSR und Backend/API containerisiert.
4. Persistente Daten separat und backupfähig.
5. Secrets außerhalb Images und Repo.
6. Healthchecks + Restart Policies.
7. Monitoring/Logging.
8. Image-basiertes Rollback.
9. `DRY_RUN`/Staging-Isolation für Mail, CRM und Queue.

**DoD AP02:** SSR, Routing, Content, Lead Platform und Docker/Compose-Betrieb sind als Zielarchitektur eindeutig dokumentiert.

# AP03 — Informationsarchitektur und vollständiges Seiteninventar

**Ziel:** Jede Seite besitzt einen klaren Zweck, Nutzerpfad, CTA, Sprachumfang und Navigationskontext.

## PT03.1 — Vollständiges Inventar

1. Hauptseiten.
2. neun Diagnostik-Services.
3. IglooPro.
4. Epigenetik-Hub + drei Vertiefungsseiten + sechs Musterbefunde.
5. Artikel, Events, Downloads.
6. drei Consumer-Landingpages × 10 Sprachen.
7. About, Contact, Support, Legal.
8. Spezial-/Legacy-/Redirect-/404-Pfade.

## PT03.2 — Seitentypen und Rollen

1. Homepage.
2. Hub/Übersicht.
3. Service-Detail.
4. Produktseite.
5. Epigenetik-Entscheidungs-/Panel-/Evidence-Seite.
6. Editorial/Article/Event.
7. Consumer-SEO-Landingpage.
8. Formular-/Lead-Seite.
9. Download/Lead-Magnet.
10. Legal/Support.

## PT03.3 — Kernjourneys

1. B2B → Diagnostik → Service → „Angebot anfragen“.
2. IglooPro → Nutzen/Specs → Anfrage/ROI/Download.
3. Epigenetik → Hub → Panel/Musterbefund → eigene Inquiry-Strecke.
4. Content → relevante Lösung → CTA.
5. Resource/Lead Magnet → Gate → CRM → Asset-Zustellung.
6. Consumer → SEO-Landingpage → Bestellung.
7. Bestandskunde → Support/Downloads.

## PT03.4 — Navigation und interne Findability

1. Epigenetik als eigener Hauptnavigationspunkt.
2. Diagnostik klar davon abgrenzen.
3. Footer-Einstieg für Epigenetik.
4. Consumer interne Verlinkung definieren, ohne automatisch Hauptmenü-Pflicht anzunehmen.
5. Suche in IA integrieren.
6. Breadcrumb-/ChapterNav-Regeln definieren.
7. „Angebot anfragen“ als allgemeinen CTA standardisieren.

**DoD AP03:** Alle Relaunch-Routen sind IA-seitig klassifiziert; Epigenetik ist eigenständig; Consumer ist als 10-sprachiger SEO-Bereich eingeordnet.

# AP04 — Content-Strategie, Content-Modell und Launch-Content-Readiness

**Ziel:** Relaunch-Inhalte vollständig, konsistent, lokalisierbar und launchfähig machen, ohne eine dauerhafte Content-Governance einzuführen.

## PT04.1 — Content-Audit

1. Überschriften und Kernbotschaften erfassen.
2. CTA-Bezeichnungen erfassen und auf „Angebot anfragen“ normalisieren.
3. Formulare/Hilfetexte erfassen.
4. Downloads/Assets erfassen.
5. Artikel/Events/Testimonials erfassen.
6. redundante/veraltete Aussagen markieren.
7. sensible medizinische/regulatorische Aussagen markieren.
8. Garantie-CTA-Band und Chat-Copy explizit als nicht zu übernehmend markieren.

## PT04.2 — Content-Typen standardisieren

1. Hero.
2. Nutzen/Proof.
3. Feature/Leistung.
4. Prozess/Steps.
5. FAQ.
6. CTA.
7. Download/Resource.
8. Disclaimer/Regulatory Notice.
9. Lead-Magnet-Gate.
10. Formular-/Success-/Error-Copy.

## PT04.3 — Launch-Content-Readiness

1. Platzhalter/Mocktexte eliminieren.
2. IglooPro `CV < 2 %` konsistent halten.
3. regulatorische Pflichttexte sichtbar halten.
4. alle relevanten Inhalte in 10 Sprachen bereitstellen.
5. sprachabhängige PDF-/Download-Lücken als Launch-Items behandeln, wo sichtbar/benötigt.
6. lokalisierte CTA-Entsprechungen finalisieren.
7. Autoresponder-/Systemmail-Texte in allen benötigten Sprachen bereitstellen.

## PT04.4 — Asset-Readiness

1. Bildinventar und Alt-Texte.
2. responsive Bildgrößen/Optimierung.
3. Consumer-OG-/Produktbilder.
4. Download-Dateien versionieren.
5. sprachabhängige Asset-Parität.
6. verwaiste/launch-störende Assets entfernen.

**Backlog:** Owner, Review-Zyklen, Freshness, medizinische Freigabeprozesse, Übersetzungsworkflow-Governance und CMS-Pipeline-Governance.

**DoD AP04:** Launch-Content und Assets sind vollständig, 10-sprachig und technisch nutzbar; formale Content-Governance bleibt bewusst außerhalb des Launch-Scope.

# AP05 — Sales-Machine Design-System und Light-Theme-Grundlage

**Ziel:** Die bestehende Sales-Machine-Art-Direction im Light Theme als verbindliches UI-System konsolidieren und mit art-direction-neutralen QA-/System-Patterns absichern.

## PT05.1 — Visuelle Baseline und Tokens

1. Sales-Machine-Farben/Tokens als verbindliche Basis inventarisieren.
2. Light Theme als alleinigen Relaunch-Default festschreiben.
3. Legacy-Aliase klassifizieren.
4. keine Dark-Theme-/Archon-Art-Direction-Tokens übernehmen.
5. Befund-/Statusfarben auf Kontrast prüfen.
6. Neutralfarben auf WCAG prüfen.
7. Spacing-/Radius-/Shadow-Skalen konsolidieren.
8. Motion-Tokens definieren.
9. Token-Guard in CI.

## PT05.2 — Typografie

1. selbstgehostete Inter-Font-Pipeline beibehalten.
2. H1–H6 Regeln.
3. Body/Lead/Caption/Label.
4. Links.
5. Lesebreite Longform.
6. Responsive Typografie.
7. Fallback-Metriken.
8. keine Google-Fonts-CDN-Abhängigkeit.

## PT05.3 — Core UI-Komponenten

1. Button/Link.
2. Input/Textarea/Choice Controls.
3. Alert/Status.
4. Card.
5. Modal/Drawer/Dialog.
6. Loading/Empty/Error.
7. FormField-Pattern.
8. Fokus-/Touch-Targets ≥ 44 px, wo anwendbar.
9. Komponententests als Pattern aus `redesign/preview` übernehmen.

## PT05.4 — Layout-/Sales-Machine-Patterns

1. Container/Section/Grid.
2. Hero/Split Layout.
3. Card Grid.
4. Content + Sidebar.
5. Sticky/Chapter Navigation.
6. Longform.
7. Final CTA ohne „garantierte Performance“-Band.
8. bestehende Sales-Machine-Sektionen als bevorzugte Bausteine katalogisieren.
9. doppelte Kartenrezepte konsolidieren, ohne Art Direction zu ändern.

## PT05.5 — Motion, Visual Regression und Error States

1. Reduced Motion.
2. Reveal-/Menu-/Modal-Transitions.
3. keine Interaktionsblockade durch Animation.
4. Visual-Regression-Baseline aus `redesign/preview` adaptieren.
5. Baseline Screenshots.
6. Route Error Boundaries als technisches Pattern übernehmen.
7. Changelog-Gate für relevante Design-System-Änderungen.

**DoD AP05:** Sales-Machine + Light sind technisch und visuell eindeutig; Core Patterns sind getestet; Dark-Theme-/alternative Art-Direction-Arbeit ist ausgeschlossen.

# AP06 — App Shell, Header, Footer und globale Navigation

**Ziel:** Eine stabile, 10-sprachige globale Shell mit eigenständiger Epigenetik-Säule und konsistentem Anfrage-CTA schaffen.

## PT06.1 — Header

1. Logo/Startlink.
2. Hauptnavigation.
3. **Epigenetik als eigener Hauptnavigationspunkt.**
4. Diagnostik-Mega-Menü ohne Epigenetik als bloßen Unterpunkt.
5. Standard-CTA „Angebot anfragen“.
6. Suche.
7. Sprachumschalter.
8. Mobile Navigation.
9. aktive Zustände.
10. Scroll-/Shrink-Verhalten.

## PT06.2 — Diagnostik-Mega-Menü

1. POC-/Service-Gruppen.
2. klare visuelle Hierarchie.
3. Keyboard Navigation.
4. Fokusmanagement.
5. Mobile Adaption.
6. Links gegen Route Registry prüfen.
7. Epigenetik nur über sinnvolle Crosslinks, nicht als primäre Untergruppe.

## PT06.3 — Footer

1. Hauptlinks.
2. Diagnostik.
3. **Epigenetik-Einstieg.**
4. Standorte/Social.
5. Legal.
6. sprachabhängige Labels.
7. mobile Reihenfolge.
8. Sicherstellen, dass `CtaSection`/Garantie-Band aus `main` nicht zurückkehrt.

## PT06.4 — Globale Hilfselemente

1. MobileCallButton.
2. CookieBanner.
3. LanguageFallbackNotice nur als defensives Netz.
4. ScrollToTop/ScrollToHash.
5. Skip Link.
6. **ChatWidget/HiHuman vollständig entfernen.**

## PT06.5 — Navigationstests

1. Desktop/Mobile Keyboard.
2. Screenreader Labels.
3. Fokusreihenfolge.
4. aktive Pfade.
5. Hash-Navigation.
6. Sprachwechsel.
7. Epigenetik-Navigation.
8. Regression: kein Garantie-Band, kein Chat.

**DoD AP06:** Shell funktioniert in 10 Sprachen, Epigenetik ist eigenständig sichtbar, CTA-Naming ist konsistent und kein Chat-/Garantie-Band-Rest lädt produktiv.

# AP07 — Suche und interne Findability

**Ziel:** Strategische Inhalte über Navigation, Suche und Querverlinkung erreichbar machen.

## PT07.1 — Suchindex

1. statische Seiten.
2. Services.
3. Artikel.
4. Epigenetik-Hub + drei Vertiefungsseiten + sechs Musterbefunde.
5. Downloads/Resources.
6. Events.
7. Consumer-Seiten, sofern als interne Suchziele sinnvoll.
8. sprachabhängige Titel/Beschreibungen × 10.
9. toten Treffer `/diagnostics/sports` entfernen.

## PT07.2 — SearchModal Accessibility/UX

1. Dialog-Semantik.
2. Fokus-Trap und initialer Fokus.
3. Escape/Close.
4. Ergebnisgruppen.
5. Empty State.
6. `aria-label`/Statusansagen.
7. Mobile Darstellung.
8. Tastaturbedienung.

## PT07.3 — Interne Verlinkung

1. Artikel ↔ Services.
2. Diagnostik-Hub → Services.
3. Epigenetik Hub ↔ Panels/Musterbefunde/Vertiefungen/Inquiry.
4. Downloads → relevanter Produkt-/Servicekontext.
5. Consumer SEO-Seiten sinnvoll intern verankern, ohne automatische Hauptmenü-Pflicht.
6. Events → Anfrage.
7. Lead-Magnet-CTAs kontextuell platzieren.

**DoD AP07:** Keine strategisch wichtige Relaunch-Seite ist ungewollt nur per Direkt-URL erreichbar; Suche ist a11y-tauglich und 10-sprachig.

# AP08 — Internationalisierung und vollständige 10-Sprachen-Lokalisierung

**Ziel:** Alle relevanten Relaunch-Inhalte in `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs` vollständig ausliefern.

## PT08.1 — i18n-Core

1. gemeinsame Server-/Client-Konfiguration.
2. URL als einzige Sprachquelle.
3. SSR-Fallback defensiv korrekt laden.
4. Namespace-Registrierung konsolidieren.
5. `lang`-Attribut korrekt setzen.
6. FallbackNotice nur für echte Fehlerfälle.

## PT08.2 — Hartcodierten Content i18n-fähig machen

1. S3-Leitlinie.
2. Vitamin-D3-Implantologie.
3. Consumer Spray.
4. Consumer Masks.
5. Consumer Duo.
6. Consumer Shell.
7. Consumer Order Form/Modal/Price UI.
8. hartcodierte Zahl-/Datum-/Locale-Formate entfernen.

## PT08.3 — Namespace- und Key-Parität

1. `epigenetics` vollständig × 10.
2. Befund-Inhalte vollständig × 10.
3. fehlende `befund.*`-/`services.*.seo.*`-Keys schließen.
4. Guard auf alle produktiven Namespaces erweitern.
5. Guard in CI aufnehmen.
6. keine stillen Sprachmischungen.

## PT08.4 — Sprachwechsel und Routen

1. gleiche logische Seite in Zielsprache halten.
2. Consumer nicht mehr auf EN zurückredirecten.
3. bisherige DE-only-Sonderlogik nach vollständiger Lokalisierung abbauen, soweit inhaltlich beschlossen.
4. Canonical/hreflang mit Routing-Wahrheit synchronisieren.
5. `x-default` konsistent.

## PT08.5 — Systemtexte, Formulare und Mails

1. Formlabels/Fehler/Success × 10.
2. Support-Autoresponder × 10.
3. ROI-/Lead-Magnet-Zustellung × 10.
4. Epigenetik-Inquiry × 10.
5. Consumer Order × 10.
6. CTA „Angebot anfragen“ fachlich lokalisiert.

## PT08.6 — Sprachabhängige Assets

1. Epigenetik-PDFs/Musterbefunde inventarisieren.
2. sichtbare Asset-Lücken für 10 Sprachen schließen oder sprachneutral neu lösen.
3. Download-Metadaten nach Sprache.
4. keine hreflang-Ziele auf nicht vorhandene Inhalte.

**DoD AP08:** Die zehn Sprachen sind vollständiger Betriebszustand; Fallbacks sind nur defensiv; Consumer, Epigenetik, Formulare und Systemmails sind eingeschlossen.

# AP09 — SEO-Plattformgrundlagen

**Ziel:** Routing, Indexierung, Canonical, hreflang, Sitemap und Structured Data aus einer konsistenten technischen Quelle ableiten.

## PT09.1 — SEOHead konsolidieren

1. Title/Description.
2. robots.
3. Canonical.
4. hreflang × 10 + x-default.
5. Open Graph/Twitter.
6. 404-Verhalten.
7. explizite Overrides.
8. Unit-/Regressionstests.

## PT09.2 — Sitemap

1. aus Route Registry erzeugen.
2. alle 10 Sprachen korrekt expandieren.
3. Consumer × 10.
4. Epigenetik-Hub, Vertiefungen und Musterbefunde × 10.
5. Legal-Sitemap/noindex-Widerspruch auflösen.
6. dynamische Slugs integrieren.
7. ehrliches `lastmod` statt „heute“ für alles.
8. XML-Validierung + CI-Test.

## PT09.3 — Consumer SEO

1. Canonical/hreflang korrekt.
2. produktspezifische OG-/Twitter-Bilder.
3. Product-Schema, sofern fachlich passend.
4. interne Verlinkung.
5. keine `noindex`-/Basic-Auth-Regressionslogik.
6. `/consumer`-Hub nur umsetzen, wenn innerhalb der Umsetzung sinnvoll beschlossen.

## PT09.4 — Structured Data

1. Organization/WebSite.
2. BreadcrumbList.
3. Product/FAQ/Article/Event selektiv.
4. medizinische Typen nur fachlich korrekt.
5. keine nicht freigegebenen Claims durch Schema verstärken.
6. Seitentyp-Abdeckung dokumentieren.

## PT09.5 — Robots/Bot-Policy und Meta-Qualität

1. APIs sperren.
2. Assets erlauben.
3. Consumer indexierbar.
4. Meta-Descriptions über alle Namespaces prüfen.
5. OG-Alts.
6. keine Preview-Domain.

**DoD AP09:** SEOHead, Sitemap, robots und Structured Data sind 10-sprachig, route-registry-getrieben und regressionsgetestet.

# AP10 — Redirect-, URL- und HTTP-Semantik-System

**Ziel:** Historische URLs sauber migrieren und korrekte HTTP-Semantik systematisch absichern.

## PT10.1 — Redirects absichern

1. unpräfixiert → Default-Locale per 301.
2. `/services` und `/services/:slug` als echte 301-Brücke.
3. Legacy `/agb` und weitere bekannte Altpfade.
4. keine Redirect-Chains/Loops.
5. Consumer nicht auf EN zwangsumleiten.

## PT10.2 — Alt-URL-Migration

1. vollständige Redirect Map.
2. alte Epigenetik-/Befund-Anker erhalten, wo relevant.
3. Content-/Slug-Wechsel testen.
4. externe Backlink-Ziele priorisieren.

## PT10.3 — Route Registry / Known Paths

1. App-Routes.
2. Known Paths.
3. Sitemap.
4. Search.
5. Redirects.
6. SEOHead.
7. Tests aus derselben Wahrheit ableiten.

## PT10.4 — HTTP-Status-Regression

1. 200 für reale Seiten.
2. 301 für Migration.
3. 404 für unbekannt.
4. 404 `noindex` ohne falschen Canonical.
5. keine Soft-404.
6. 10-Sprachen-Matrix testen.

**DoD AP10:** Statuscodes, Redirects, Canonicals und Known Paths sind deterministisch und automatisiert getestet.

# AP11 — Startseite

**Ziel:** Die Startseite als primären B2B-Einstieg mit klarer PolarisDX-Positionierung, Diagnostik, IglooPro, eigenständiger Epigenetik-Säule und messbaren Conversion-Pfaden aufbauen.

## PT11.1 — Hero

1. klare Positionierung.
2. primäre Zielgruppe.
3. primärer CTA „Angebot anfragen“.
4. sinnvoller sekundärer CTA.
5. visuelle Produkt-/Diagnostikreferenz.
6. mobile Hierarchie.
7. LCP-freundliche Medienstrategie.

## PT11.2 — Trust & Proof

1. TrustBar.
2. Kunden-/Praxisreferenzen, sofern freigegeben.
3. Testimonials/Expertise.
4. Partnerbezug nur belastbar.
5. regulatorisch zulässige Aussagen.
6. IglooPro `CV < 2 %` nur in der beschlossenen konsistenten Form.

## PT11.3 — Leistungsarchitektur auf der Homepage

1. Diagnostik als zentrale Säule anteasern.
2. Kernservices priorisieren.
3. IglooPro sichtbar einbinden.
4. **Epigenetik als eigenständige Geschäftssäule** sichtbar positionieren, nicht nur innerhalb Diagnostik.
5. relevante Präventions-/Use-Case-Einstiege.
6. klare Deep Links.

## PT11.4 — Prozess und Nutzen

1. Why POC.
2. Steps/Praxisablauf.
3. Effizienzargumentation.
4. Patienten-/Praxisnutzen sauber trennen.
5. keine unbelegten Umsatz-/Gewinnversprechen.

## PT11.5 — Conversion und Secondary Conversion

1. allgemeiner CTA „Angebot anfragen“.
2. ROI-Rechner als möglicher Lead-Magnet-/Conversion-Baustein.
3. mindestens ein kontextueller Lead-Magnet-/Download-Einstieg.
4. Event-/Content-Teaser.
5. Final CTA.
6. Lead Source/Journey Attribution.
7. Tracking ausschließlich nach Consent.

## PT11.6 — FAQ und SEO

1. relevante sichtbare FAQs.
2. FAQ-Schema nur passend zum sichtbaren Content.
3. Title/Description/OG.
4. interne Links zu Diagnostik, IglooPro und Epigenetik.
5. saubere H1–H2-Hierarchie.
6. 10-Sprachen-Parität.

**DoD AP11:** Die Homepage führt klar in Diagnostik, IglooPro und Epigenetik, verwendet das standardisierte CTA-Naming, bietet Secondary Conversion und erfüllt SEO/i18n/a11y/performance-Gates.

# AP12 — Diagnostik-Hub `/diagnostics`

**Ziel:** Alle neun diagnostischen Leistungsbereiche verständlich ordnen und in relevante Detailseiten führen.

## PT12.1 — Informationshierarchie

1. POC vs. Labor-/erweiterte Diagnostik verständlich machen.
2. neun Services vollständig abbilden.
3. Top-Prioritäten hervorheben.
4. medizinische Fachbegriffe erklären.
5. Anwendungsfälle statt reiner Testlisten verwenden.

## PT12.2 — Hero und Einstiegslogik

1. Nutzenversprechen.
2. Zielgruppenbezug.
3. Haupt-CTA.
4. Trust-Element.
5. Breadcrumb.

## PT12.3 — Service-Karten

1. einheitliches Datenmodell.
2. Icon-Regeln.
3. Titel/Teaser.
4. Linkziel.
5. Hover/Focus.
6. responsive Grid.

## PT12.4 — Fokus-/Specialty-Bereiche

1. Dental.
2. Beauty.
3. Longevity.
4. Prävention.
5. Systemlösungen.
6. Integration.

## PT12.5 — SEO & interne Links

1. Suchintentionen abdecken.
2. Deep Links zu allen neun Services.
3. passende Artikel einbinden.
4. CTA zu Kontakt/IglooPro.
5. Canonical/hreflang.

**DoD AP12:** Alle neun Services sind vollständig erreichbar, logisch gruppiert und SEO-/UX-seitig klar differenziert.

---

# AP13 — Service-Detailseiten (9 Stück)

**Ziel:** Ein skalierbares Detailseiten-Template für alle Services schaffen.

## PT13.1 — Gemeinsames Service-Template

1. Breadcrumb.
2. Hero.
3. Problem/Nutzen.
4. Einsatzgebiete.
5. Test-/Parameterübersicht.
6. Workflow.
7. Proof/FAQ.
8. verwandte Inhalte.
9. CTA.
10. Structured Data, sofern passend.

## PT13.2 — Dental

1. Fachzielgruppe.
2. diagnostische Anwendungsfälle.
3. IglooPro-Bezug.
4. Vitamin-D-/Implantologie-Bezug prüfen.
5. passende Artikel.

## PT13.3 — Beauty

1. Positionierung.
2. relevante Tests.
3. Nutzenargumentation.
4. Compliance medizinischer Claims.
5. CTA.

## PT13.4 — Longevity

1. präventive Diagnostik.
2. relevante Marker.
3. Epigenetik-Verknüpfung.
4. langfristige Monitoring-Logik.
5. CTA.

## PT13.5 — POC-Systemlösungen

1. Hardware/Software/Systemgedanke.
2. Integration.
3. Praxisworkflow.
4. IglooPro-Verknüpfung.
5. Demo-/Kontakt-CTA.

## PT13.6 — Präventions-Checks

1. Zielgruppen.
2. Check-Struktur.
3. Nutzen.
4. Abgrenzung zu Diagnoseversprechen.
5. CTA.

## PT13.7 — Infektion & Entzündung

1. Markerstruktur.
2. Anwendungsfälle.
3. Fachsprache.
4. CTA.
5. interne Links.

## PT13.8 — Stoffwechsel & Herz

1. Markerstruktur.
2. Präventionskontext.
3. Risikoformulierungen prüfen.
4. CTA.
5. interne Links.

## PT13.9 — Hormon-Tests

1. Anwendungsfälle.
2. Zielgruppen.
3. sensible Claims prüfen.
4. CTA.
5. interne Links.

## PT13.10 — Kompatibilität & Integration

1. technische Kompatibilität.
2. Schnittstellen-/Workflow-Thema.
3. Sicherheitsnutzen.
4. Artikelverknüpfung.
5. CTA.

**DoD AP13:** Alle neun Detailseiten folgen einem konsistenten System, besitzen aber differenzierte Inhalte und klare Conversion-Pfade.

---

# AP14 — IglooPro Produktstrecke

**Ziel:** IglooPro als eigenständiges Produkt mit konsistenten Claims, belastbaren Spezifikationen und klarer Anfrage-/Lead-Strecke präsentieren.

## PT14.1 — Produktpositionierung

1. Zielgruppe/Kernproblem.
2. Produktversprechen/Differenzierung.
3. Standard-CTA „Angebot anfragen“.
4. ROI-/Lead-Magnet-Bezug.
5. regulatorische Aussagen nicht überziehen.

## PT14.2 — Produkt-Hero und Proof

1. Produktvisual.
2. Kernbenefit.
3. CTA.
4. Proof.
5. mobile Darstellung.

## PT14.3 — Features/Workflow/Kompatibilität

1. Funktionsumfang.
2. Workflow.
3. Parameter.
4. Kompatibilität.
5. Nutzerfreundlichkeit.
6. Wartung/Support.

## PT14.4 — Spezifikationen und CV-Claim

1. `CV < 2 %` in Code, 10 Locales, Structured Data und PDF konsistent halten.
2. keine `<5 %`-Rückmigration.
3. zusätzliche Inter-/Intra-Reader-Formulierungen auf Widerspruch prüfen.
4. Risk-Register-Vermerk erhalten: Produktentscheidung, repo-seitig nicht unabhängig validiert.
5. Einheiten/Tabellen zugänglich machen.
6. PDF-/Download-Versionen dokumentieren.

## PT14.5 — Product Structured Data

1. Product-Schema.
2. Brand/Organization.
3. QuantitativeValue nur korrekt.
4. Bilder.
5. URL/Canonical.
6. Claim-Konsistenz.

## PT14.6 — Conversion

1. „Angebot anfragen“.
2. ROI/Lead Magnet.
3. Downloads.
4. Support-Verweis.
5. Conversion-Tracking erst nach Consent.
6. CRM-/Source-Attribution.

**DoD AP14:** IglooPro ist konsistent, 10-sprachig, SEO-/a11y-fähig und der `<2 %`-Claim ist über alle Ausgabekanäle konsistent dokumentiert.

# AP15 — Epigenetik als eigenständige Geschäftssäule

**Ziel:** Epigenetik als eigene navigative, inhaltliche, SEO- und Conversion-Säule mit eigenem Inquiry-Flow etablieren.

## PT15.1 — Hub-IA und Hauptnavigation

1. `/epigenetics` als eigenständigen Hub.
2. eigener Header-Navigationspunkt.
3. Footer-Einstieg.
4. eigene Homepage-Position.
5. Hub-Struktur: Auswahl → Panels → Ablauf → FAQ → Vertiefung → Anfrage.
6. Diagnostik-Crosslinks erhalten, ohne Säulenrolle zu verwässern.

## PT15.2 — `main`-Vertiefungsseiten importieren

1. `/epigenetics/grundlagen`.
2. `/epigenetics/studienlage`.
3. `/epigenetics/unterlagen`.
4. `EpiSubpage`/Tokens/Metadaten selektiv übernehmen.
5. Search, Sitemap, hreflang, Canonical integrieren.
6. 404-/Cache-/CTA-Baseline nicht überschreiben.

## PT15.3 — Panels und Musterbefunde

1. sechs Panels.
2. klare Unterschiede/Nutzen.
3. Musterbefunde als Einstiegstüren.
4. Verweis auf andere Panels.
5. Anfrageweg im ersten relevanten Screen.
6. URL-getragenen Panel-/Fokus-Kontext nutzen.

## PT15.4 — Claims und regulatorische Leitplanken

1. Quellen/Studien nachvollziehbar.
2. GenDG-/Beispieldaten-/Keine-Diagnose-Hinweise sichtbar.
3. keine CE/IVDR-Kennzeichnung für Labordienstleistungen.
4. kein nicht freigegebener Lab-Partnername.
5. keine ungeklärten Preise/Befundlaufzeiten.
6. 10-sprachige Pflichttexte.

## PT15.5 — Ressourcen/Downloads

1. vorhandene Blätter/ZIPs inventarisieren.
2. Sprachparität für sichtbare Launch-Assets herstellen.
3. frei vs. gated klassifizieren.
4. Tracking nach Consent.
5. Lead-Magnet-Kandidaten technisch integrierbar machen.

## PT15.6 — Eigene Epigenetik-Inquiry

1. separates Formular/Flow.
2. Einrichtungstyp.
3. Panel-Interesse, aus Kontext vorbelegbar.
4. Fälle/Monat bzw. fachlich nötige Qualifizierungsfelder.
5. Source/Campaign/Panel/Language-Kontext.
6. eigener Backend-Pfad oder klar typisierter eigener Lead-Typ.
7. eigenes CRM-Routing.
8. Persistenz + Retry + Audit.
9. Consent-/Datenschutztexte.
10. Conversion-Events nur nach Consent.

## PT15.7 — 10-Sprachen- und E2E-Abdeckung

1. Hub + 3 Vertiefungen + 6 Musterbefunde × 10.
2. Search-Index.
3. Navigation.
4. CTA/Inquiry.
5. E2E Golden Path.

**DoD AP15:** Epigenetik funktioniert als vollständige eigene Säule mit 10-sprachiger IA, SEO-Hub, Ressourcen und eigener CRM-gebundener Inquiry Journey.

# AP16 — Musterbefunde (6 × 10 Sprachen)

**Ziel:** Die sechs Musterbefunde als robuste, erklärende und 10-sprachige Eingangstüren der Epigenetik-Säule etablieren.

## PT16.1 — Datenmodell und Routing

1. Slug/Panel/Blocks/Diagrammdaten.
2. sechs explizite Routenmodule übernehmen.
3. Catch-all nur für unbekannte Slugs.
4. Validierungsschema.
5. Build-Fehler bei ungültigen Daten.
6. 10-sprachige Contentstruktur.

## PT16.2 — Blocks/Charts

1. Blocktypen katalogisieren.
2. semantische HTML-Struktur.
3. Tabellen/Listen zugänglich.
4. Radar-/Netzdiagramme kontrastreich.
5. textliche Chart-Alternative.
6. responsive/print-fähig.
7. regulatorische Hinweise.

## PT16.3 — Navigation und Einordnung

1. Übersicht.
2. Previous/Next.
3. Verweise auf die anderen fünf Befunde.
4. Breadcrumb.
5. Rückweg zum Epigenetik-Hub.
6. „Angebot anfragen“/Inquiry sichtbar.
7. Legacy-Anker-Aliase erhalten.

## PT16.4 — SEO

1. individuelle Titles/Descriptions.
2. Canonical/hreflang × 10.
3. Sitemap × 10.
4. passende Structured Data.
5. Suchintention statt generischem „Musterbefund“-Prefix prüfen.

## PT16.5 — QA je Befund

1. Werte/Charts gegen freigegebene Quelle.
2. 10 Sprachen vollständig.
3. Disclaimer/Regulatory Notice.
4. PDF-/Web-Konsistenz, falls PDF sichtbar.
5. a11y.
6. Route-/SEO-Regression.

**DoD AP16:** Alle sechs Befundtypen sind in 10 Sprachen valide, auffindbar, zugänglich und als Epigenetik-Einstiege konversionsfähig.

# AP17 — Artikel-/Knowledge-Bereich

**Ziel:** Editorial Content als 10-sprachigen SEO-, Vertrauens- und Conversion-Kanal professionalisieren.

## PT17.1 — Artikelindex

1. Teaserstruktur.
2. Bilder.
3. Datum/Autor/Reviewer-Felder anzeigen, sofern vorhanden.
4. Pagination/Filter nur bei Bedarf.
5. keine Empty States aufgrund geplanter Übersetzungs-Fallbacks — Inhalte für Launch vollständig lokalisieren.

## PT17.2 — Article Template

1. H1/Lead.
2. Metadaten.
3. Inhaltsabschnitte.
4. Bilder/Captions.
5. interne Links.
6. verwandte Artikel/Services/Epigenetik.
7. CTA „Angebot anfragen“ oder fachlich passender CTA.
8. Breadcrumb.
9. Article Schema.
10. 10-sprachige Datums-/Lesezeitdarstellung.

## PT17.3 — Slug-/ID-/SEO-Konsistenz

1. bestehende Slugs sichern.
2. IDs intern halten.
3. Redirect bei Slugänderungen.
4. tote prerender-IDs entfernen/backloggen.
5. Route-/SEOHead-Tests.
6. interne Links aktualisieren.

## PT17.4 — Launch-Content-Metadaten

1. Publikationsdatum.
2. Aktualisierungsdatum, wo verfügbar.
3. Quellenfeld.
4. Reviewer-Feld, wo fachlich nötig.
5. 10-sprachige Content-Parität.

**Backlog:** dauerhafte Editorial-/Content-Governance nach DEC-RL-010.

**DoD AP17:** Artikelbereich ist 10-sprachig, SEO-fähig, intern verlinkt und conversion-fähig; Governance bleibt Backlog.

# AP18 — Events

**Ziel:** Eventdaten automatisch, aktuell, 10-sprachig und konversionsfähig darstellen.

## PT18.1 — Event-Datenmodell

1. ID-Stabilität sichern.
2. Start-/Enddatum.
3. Ort.
4. Partner.
5. Link.
6. Status/Highlight.
7. UTC-/Zeitzonenlogik prüfen.

## PT18.2 — Kommende Events

1. chronologische Sortierung.
2. Highlight-Event.
3. Partnerdarstellung.
4. CTA/Externer Link.
5. Kalenderlink optional.

## PT18.3 — Rückblick

1. automatische Verschiebung abgelaufener Events.
2. korrekte Lokalisierung.
3. Archivdarstellung.
4. keine doppelten Einträge.

## PT18.4 — SEO/Tracking

1. Meta.
2. interne Links.
3. Event-Schema optional nach inhaltlicher Prüfung.
4. Outbound Tracking.

**DoD AP18:** Events wechseln automatisch korrekt zwischen aktuell und vergangen; Highlight und Lokalisierung sind stabil.

---

# AP19 — Downloads, Resource Center und Lead-Magnet-Auslieferung

**Ziel:** Ressourcen vollständig, sprachlich korrekt und je nach Use Case frei oder gegated bereitstellen.

## PT19.1 — Download-Inventar und Metadaten

1. bestehende Download-Kataloge.
2. Epigenetik-Blätter/ZIPs/Musterbefunde.
3. Dateigröße/Version/Sprache/Datum.
4. verwaiste Assets.
5. Asset-Parität über 10 Sprachen für Launch-relevante Ressourcen.

## PT19.2 — Resource Center UX

1. Kategorien.
2. Sprache/Typ.
3. Titel/Beschreibung/Version.
4. frei vs. gated sichtbar korrekt behandeln.
5. leere Kategorien entfernen.
6. a11y/Keyboard.

## PT19.3 — Lead-Magnet-Plattform

1. wiederverwendbares Gate-Formular.
2. Minimalfelder.
3. Formular-Consent getrennt von Marketing-Consent.
4. Lead-Typ `content_download`/Asset-ID/Language/Source.
5. Persistenz + CRM + Queue/Retry.
6. Rate Limit/Honeypot/Abuse-Schutz.
7. geschützte Asset-Auslieferung statt nur frei erratbarer `/downloads/`-URL.
8. zeitlich begrenzter/geeigneter Entitlement-Link, falls erforderlich.
9. Zustellung per Mail/Link.
10. Gate-/Submit-/Delivery-Tracking erst nach Consent.

## PT19.4 — Lead-Magnet-Kandidaten integrierbar machen

1. ROI-Report.
2. Epigenetik-Unterlagen.
3. Musterbefund-/Fach-PDFs.
4. andere Fachleitfäden.
5. zunächst mindestens einen Pfad vollständig produktiv schalten.

## PT19.5 — 10-Sprachen-Auslieferung

1. Gate-Copy × 10.
2. Mail-/Success-/Error-Copy × 10.
3. sprachpassendes Asset.
4. keine Sprache auf falsches Asset fallen lassen.

**DoD AP19:** Mindestens ein vollständiger gated Lead-Magnet-Pfad und ein konsistentes 10-sprachiges Resource Center sind launchfähig.

# AP20 — About, Contact, Support und Legal

**Ziel:** Unternehmens-, Anfrage-, Support- und Rechtsstrecken konsistent mit CRM, Consent und 10-Sprachen-Betrieb ausrichten.

## PT20.1 — About

1. Positionierung.
2. Unternehmen/Standorte/Trust.
3. CTA „Angebot anfragen“.
4. Epigenetik als eigenständige Säule korrekt einordnen.
5. 10 Sprachen.

## PT20.2 — Contact

1. allgemeines Anfrageformular.
2. Standard-CTA „Angebot anfragen“.
3. persistenter Lead + CRM-Handoff.
4. Source/Language-Attribution.
5. Datenschutz/Consent.
6. Success/Error UX.
7. Tracking nach Consent.
8. keine Consumer-/Epigenetik-Sonderfälle heimlich über Textparameter multiplexen, wenn eigene Journeys existieren.

## PT20.3 — Support

1. Supportformular.
2. Themen-/Produktkontext.
3. Persistenz/Case- oder Lead-Typ.
4. Anhänge sicher behandeln.
5. Team- und Bestätigungsmail entkoppelt/retryfähig.
6. Retention.
7. 10-sprachige Bestätigung.

## PT20.4 — Legal/Privacy

1. Impressum.
2. Datenschutz.
3. Terms/AGB.
4. Legacy `/agb` Redirect.
5. GTM/GA4 Basic Consent Mode korrekt dokumentieren.
6. CRM-/Lead-Persistenz und Datenflüsse abbilden.
7. Lead-Magnet-/Marketing-Consent getrennt beschreiben.
8. Legal-Sitemap/noindex-Widerspruch auflösen.
9. Legal-Seiten bewusst ohne Conversion-CTA belassen.
10. 10 Sprachversionen rechtlich/inhaltlich prüfen.

**DoD AP20:** Contact/Support sind CRM-gebunden und robust; Legal/Privacy spiegeln Consent, Persistenz und Datenflüsse korrekt wider.

# AP21 — Consumer-Landingpages als 10-sprachiger SEO-Bereich

**Ziel:** Die drei Consumer-Landingpages in allen zehn Sprachen als performante, indexierbare und conversion-starke SEO-Seiten betreiben.

## PT21.1 — Gemeinsame Consumer-Shell

1. eigenständige Shell, wo sinnvoll.
2. `<main>`-Landmark.
3. Skip-Link.
4. CookieBanner/Consent site-weit.
5. Legal-Zugang.
6. SSR-Head im ersten Response.
7. Language Switch × 10.
8. keine EN-Zwangsredirects.

## PT21.2 — Vitamin D3 Spray × 10

1. Inhalt aus Code in i18n/Contentmodell überführen.
2. Produktinformationen.
3. Bestellung.
4. Sicherheitshinweise.
5. FAQ.
6. Meta/OG/Schema.

## PT21.3 — Hydrating Masks × 10

1. Inhalt lokalisierbar machen.
2. Produktinformationen.
3. Bestellung.
4. Sicherheitshinweise.
5. FAQ.
6. Meta/OG/Schema.

## PT21.4 — Inside-Out Duo × 10

1. Inhalt lokalisierbar machen.
2. Bundle-Erklärung.
3. Bestellung.
4. Sicherheitshinweise.
5. FAQ.
6. Meta/OG/Schema.

## PT21.5 — Consumer Ordering

1. Client-/Servervalidierung.
2. Rate Limit ergänzen.
3. Spam-/Abuse-Schutz.
4. Idempotenz/Order-ID.
5. Persistenz + CRM/Order-Routing.
6. Retryfähige interne Zustellung.
7. Datenminimierung.
8. 10-sprachige Success/Error-/Mailtexte.
9. Tracking nur nach Consent.

## PT21.6 — SEO/Indexierung

1. alle 10 Sprachversionen indexierbar.
2. Canonical pro Locale.
3. hreflang × 10 + x-default.
4. Sitemap.
5. produktspezifische OG-/Twitter-Bilder.
6. Product Structured Data, sofern passend.
7. interne Verlinkung.
8. keine `noindex`-/Basic-Auth-Regressionslogik.
9. Hauptmenü-Aufnahme ist **nicht** automatisch erforderlich.

## PT21.7 — Consumer Performance/A11y

1. responsive Bilder/WebP/srcset.
2. nicht verwendete Originale bereinigen/backloggen.
3. CWV-Budgets.
4. Form-/Modal-A11y.
5. SSR-/SEO-/Route-E2E.

**DoD AP21:** Alle drei Consumer-Produkte sind in 10 Sprachen indexierbar, korrekt verlinkt, zugänglich, performant und CRM-gebunden bestellbar.

# AP22 — Lead Platform, Formulare, CRM und Backend-APIs

**Ziel:** Alle Anfrage-, Support-, Bestell-, Report- und Lead-Magnet-Journeys persistent, retryfähig, auditierbar und sicher verarbeiten.

## PT22.1 — Gemeinsamer Formular-/API-Standard

1. Client- und Servervalidierung.
2. einheitliches Fehlerformat.
3. Loading/Success/Error.
4. Double-Submit Prevention.
5. Idempotency Key, wo relevant.
6. Honeypot/Rate Limit.
7. Datenschutz-/Formular-Consent.
8. Marketing-Consent separat.
9. Language/Source/Campaign/Journey-Kontext.
10. E2E.

## PT22.2 — Persistentes Lead-Datenmodell

1. Lead-/Journey-Typen.
2. Kontakt-/Organisationsfelder nach Datenminimierung.
3. Sprache.
4. Source/Campaign/Panel/Asset/Product.
5. Consent Evidence: Zeitpunkt, Version, Umfang.
6. Status-/Delivery-/CRM-State.
7. Deduplication-Merkmale.
8. Retention/Löschung/Auskunft.
9. Audit-Zeitstempel.

## PT22.3 — CRM-Handoff

1. Adapter-/Integrationsgrenze definieren.
2. idempotenter Handoff.
3. Journey-spezifisches Routing.
4. mehrsprachige Felder.
5. Secret-Handling.
6. Timeout/Retry.
7. Fehlerklassifikation.
8. keine Secrets/PII in Logs.

## PT22.4 — Queue/Retry/Dead-Letter

1. Lead-Persistenz vor externem Handoff.
2. Retry-Policy.
3. Backoff.
4. Dead-Letter-/manueller Recovery-Pfad.
5. Zustandsmaschine.
6. Monitoring/Alerts.
7. Replay sicher/idempotent.
8. `DRY_RUN`-Verhalten.

## PT22.5 — Bestehende Journeys migrieren

1. `/api/contact`.
2. `/api/support`.
3. `/api/consumer-order`.
4. `/api/roi-report`.
5. PraxisOrder-Kontext aus `/api/contact` sauber typisieren.
6. bestehende SendGrid-Zustellung in retryfähigen Ablauf integrieren.
7. hartcodierte deutsche Autoresponder lokalisieren.

## PT22.6 — Neue Journeys

1. Epigenetik-Inquiry.
2. Lead-Magnet/Gated Download.
3. Source-/Panel-/Asset-Kontext.
4. CRM-Routing.
5. Success/Error/Recovery.
6. Analytics-Event nur nach Consent.

## PT22.7 — Chat-Entfernung

1. `/api/chat` entfernen.
2. Mock-/Roadmap-Kommentare bereinigen.
3. keine Chat-Secrets/Provider-Abhängigkeiten.
4. Chat-Dokumentation archivieren/entfernen.

## PT22.8 — Datenschutz-/Betriebsfunktionen

1. Retention-Job/Prozess.
2. Auskunft/Löschung technisch unterstützbar.
3. anonymisierte Testleads.
4. Preview/Staging isolieren.
5. Backup/Recovery-Integration.
6. Audit-/Operational-Dashboard-Anforderungen.

**DoD AP22:** Kein normaler Provider-/Mail-/CRM-Fehler führt zu unbemerktem Lead-Verlust; alle sieben Journeys sind persistent, retryfähig, datenschutzbewusst und getestet.

# AP23 — Consent, GTM/GA4 und Analytics

**Ziel:** Marketing-/Conversion-Messung ermöglichen, ohne vor Einwilligung Tracking-Code oder Analytics-Datenübertragung zu aktivieren.

## PT23.1 — Basic Consent Mode v2

1. GTM/GA4 **nicht** initial laden.
2. `noscript`-GTM-iframe vor Consent entfernen/unterbinden.
3. erst nach Analytics-/Marketing-Einwilligung relevante Provider dynamisch laden.
4. Default-Zustand ohne Provider-Request.
5. Consent persistieren.
6. Widerruf.
7. Kategorien sauber modellieren.
8. Consent-Evidence serverseitig nur dort speichern, wo ein Lead/Marketing-Zweck dies erfordert.
9. keine Event-Queue vor Consent.

## PT23.2 — Tracking-Fassade und Provider

1. providerneutrale Fassade als Kern.
2. `setTrackingProvider`/`setTrackingConsent` bewusst registrieren.
3. direkte `dataLayer`-Aufrufstellen aus `main` nicht blind übernehmen.
4. typisierte Events.
5. keine PII.
6. Consent-Guard zentral.

## PT23.3 — Pageviews und Conversion Taxonomy

1. `page_view`/SPA Navigation.
2. `contact_submit`.
3. `support_submit`.
4. `consumer_order_submit`.
5. `roi_report_request`.
6. `epigenetics_inquiry_submit`.
7. `lead_magnet_submit`.
8. `download_delivered`.
9. relevante CTA-/Panel-/Search-/Outbound-Events.
10. keine Doppelzählung.

## PT23.4 — GTM/GA4-Konfiguration

1. Events im Container abbilden.
2. Kern-Conversions definieren.
3. Consent-Szenarien testen.
4. GA4 Realtime/DebugView.
5. keine personenbezogenen Eventparameter.
6. Sprach-/Journey-/Source-Parameter nur datenschutzkonform.

## PT23.5 — Performance-Monitoring getrennt

1. Web Vitals/Metrics-Pattern aus `redesign/preview` evaluieren/importieren.
2. kein Marketing-Tracking als technische Observability missbrauchen.
3. eigene Rechts-/Betriebsgrundlage.
4. technische Metriken ohne PII.

**DoD AP23:** Vor Consent entstehen keine GTM-/GA4-Marketing-/Analytics-Requests; nach Consent funktionieren Pageviews und Conversions kontrolliert und testbar.

# AP24 — Accessibility / WCAG

**Ziel:** Mindestens WCAG 2.2 AA als Qualitätsziel für die öffentliche Website etablieren.

## PT24.1 — Semantik

1. Landmark Roles.
2. Heading-Hierarchie.
3. Listen/Tabellen.
4. Buttons vs. Links.
5. Form Labels.
6. Statusmeldungen.

## PT24.2 — Tastatur

1. Header/Mega-Menü.
2. Mobile Menü.
3. Suche.
4. CookieBanner.
5. Modals/Drawers.
6. ChapterNav.
7. Formulare.
8. Slider.

## PT24.3 — Fokus

1. sichtbarer Fokus.
2. Focus Trap nur wo korrekt.
3. Focus Return.
4. Skip Link.
5. Fokus nach Route Change bewerten.
6. Hash-Ziel Fokus/Scroll.

## PT24.4 — Kontrast

1. Text.
2. Buttons.
3. Links.
4. Inputs.
5. Icons.
6. Befundfarben.
7. Charts.
8. Text-/Akzentkombinationen auf dunkleren Markenflächen, sofern im Light Theme verwendet.

## PT24.5 — Medien

1. Alt-Texte.
2. dekorative Bilder leer markieren.
3. Charts mit Textalternative.
4. keine Information nur über Farbe.
5. Reduced Motion.

## PT24.6 — Automatisierte Checks

1. `eslint-plugin-jsx-a11y` beibehalten.
2. axe/Playwright integrieren.
3. Kernseiten automatisiert prüfen.
4. manuelle Screenreader-Checkliste ergänzen.

**DoD AP24:** Kernpfade sind per Tastatur vollständig nutzbar; keine bekannten WCAG-AA-Blocker.

---

# AP25 — Performance und Core Web Vitals

**Ziel:** Schnelle SSR-Auslieferung und stabile Interaktion auf mobilen Geräten sicherstellen.

## PT25.1 — Performance-Baseline

1. Lighthouse Mobile.
2. Lighthouse Desktop.
3. LCP.
4. CLS.
5. INP.
6. TTFB.
7. JS Bundle.
8. CSS Bundle.
9. Bildgewicht.
10. Fonts.

## PT25.2 — Rendering

1. SSR TTFB messen.
2. Hydration-Kosten.
3. Lazy-Page Chunks.
4. Suspense-Verhalten.
5. Client-only Widgets minimieren.

## PT25.3 — Bilder

1. `sharp`-Pipeline prüfen.
2. WebP/AVIF erwägen.
3. responsive `srcset`.
4. width/height gegen CLS.
5. lazy loading unterhalb Fold.
6. Hero/LCP Bild priorisieren.
7. OG-Bilder separat behandeln.

## PT25.4 — Fonts/CSS

1. Inter Variable Laden prüfen.
2. Font Display.
3. Fallback-Metriken.
4. CSS-Größe beobachten.
5. Async-CSS nicht erneut ohne CLS-Test einführen.
6. kritische Styles nur datenbasiert optimieren.

## PT25.5 — Budget

1. JS-Budget.
2. CSS-Budget.
3. Bildbudget.
4. LCP-Ziel.
5. CLS-Ziel.
6. INP-Ziel.
7. CI- oder Lighthouse-CI Schwellenwerte.

**DoD AP25:** Messbare Performance-Budgets sind definiert und Kernseiten erreichen die vereinbarten Grenzwerte.

---

# AP26 — Security Hardening

**Ziel:** Website, APIs, Lead-Persistenz und neue Integrationen produktionsreif absichern.

## PT26.1 — Security Headers

1. X-Powered-By entfernt halten.
2. HSTS am produktiven Origin/Proxy aktivieren.
3. Referrer-/Permissions-/Frame-Policies prüfen.
4. HTTPS-only.
5. Header-E2E.

## PT26.2 — CSP

1. Chat-/HiHuman-Domains entfernen.
2. GTM/GA4 nur für consent-gesteuerten Load zulassen.
3. Report-Only nur mit funktionierendem Report-Empfänger betreiben.
4. schrittweise Enforce-Readiness.
5. keine unnötigen Wildcards.

## PT26.3 — API-/Form-Security

1. Input-Schema je Endpoint.
2. Rate Limits inkl. Consumer Order.
3. Payload-/Attachment-Limits.
4. Honeypot/Abuse Protection.
5. Fehlerantworten ohne Interna.
6. CSRF-/Origin-Risiko passend zur Architektur bewerten.
7. Idempotenz.

## PT26.4 — CRM/Queue/Secrets

1. Secrets außerhalb Repo/Images.
2. Least Privilege.
3. Webhook-Signaturprüfung, falls Rückrufe genutzt werden.
4. PII-Redaction in Logs.
5. Queue-Replay ohne Doppelwirkungen.
6. Backup-Zugriff absichern.
7. Staging-Credentials von Produktion trennen.

## PT26.5 — Security QA

1. Dependency Audit.
2. Secret Scan.
3. Header/CSP Tests.
4. Rate-Limit-/Abuse Tests.
5. Container-/Image-Scan.
6. keine produktiven Side Effects in Preview.

**DoD AP26:** Web, APIs, CRM/Queue und Deployment erfüllen die definierten Security-Gates und enthalten keine Chat-/Legacy-Provider-Reste.

# AP27 — Teststrategie, Regression und Quality Gates

**Ziel:** Alle kritischen Relaunch-Verträge automatisiert beweisen und in CI verankern.

## PT27.1 — Unit/Component Tests

1. Route Registry.
2. SEOHead.
3. i18n-Key-/Locale-Helper.
4. Lead-/Consent-Domainlogik.
5. CRM-/Queue-Adapter mit Test-Doubles.
6. zentrale UI-Patterns.

## PT27.2 — Integration Tests

1. SSR + Head.
2. 200/301/404.
3. Sitemap/hreflang.
4. Formular → Persistenz → Queue → CRM-Testadapter.
5. Retry/Dead-Letter.
6. gated Asset-Entitlement.
7. `DRY_RUN`.

## PT27.3 — E2E Kernjourneys

1. B2B Anfrage.
2. Epigenetik Hub → Panel → Inquiry.
3. Consumer Landingpage → Bestellung.
4. Lead Magnet → Gate → Zustellung.
5. Support.
6. Sprachwechsel × repräsentative Routen.
7. Search.

## PT27.4 — Consent-/Tracking-E2E

1. vor Consent keine GTM-/GA4-Requests.
2. Reject bleibt request-frei.
3. Grant lädt Provider.
4. Widerruf.
5. Conversion nur nach Consent.
6. kein Pre-Consent Buffer.

## PT27.5 — SEO-/Route-Regression

1. `/services*` 301.
2. echte 404.
3. Canonical/hreflang.
4. Legal Indexierung.
5. Consumer × 10.
6. Epigenetik × 10.
7. `lastmod`.

## PT27.6 — Visual/A11y/CI Gates

1. Visual Regression aus `redesign/preview` adaptieren.
2. axe/a11y Audit.
3. Skip-Link/Main/Dialog/Fokus.
4. `check-color-tokens`.
5. i18n-Guard alle Namespaces.
6. Meta-Description-Guard.
7. Build/Lint/Format/Tests.
8. Changelog-Gate für Design-System-Änderungen.

**DoD AP27:** Die zwölf Launch-Gates besitzen automatisierte oder eindeutig dokumentierte Nachweise; CI verhindert Route-, SEO-, i18n-, Consent- und Design-Regressionsfehler.

# AP28 — Docker/Compose-Infrastruktur, Environments und Deployment

**Ziel:** Einen stabilen, reproduzierbaren und rollbackfähigen Produktionsbetrieb auf Docker/Compose hinter nginx/Reverse Proxy herstellen.

## PT28.1 — Environment-Modell

1. local/dev.
2. preview/staging.
3. production.
4. getrennte Secrets/Endpoints.
5. `DRY_RUN`/Sandbox-Verhalten.
6. keine echten CRM-/Mail-Side-Effects in Preview.

## PT28.2 — Compose-Zielstack

1. Web/SSR-Container.
2. Backend/API-Container.
3. Queue/Worker, falls getrennt.
4. persistente Datenbank/Storage separat und mit Volume/Managed-Strategie.
5. nginx/Reverse Proxy.
6. interne Netzwerke.
7. Healthchecks.
8. Restart Policies.

## PT28.3 — Secrets und Konfiguration

1. keine Secrets in Images.
2. keine Secrets im Repo.
3. Environment-/Secret-Injection.
4. Least Privilege.
5. Rotation dokumentieren.
6. sichere CRM-/Mail-/DB-Konfiguration.

## PT28.4 — Deployment/Rollback

1. immutable/versionierte Images.
2. Build einmal, Promote zwischen Environments.
3. Migrations-/Compatibility-Step.
4. Health-Gate nach Deploy.
5. image-basiertes Rollback.
6. vorherige Version schnell startbar.
7. Rollback von App und Schema kompatibel planen.

## PT28.5 — Persistenz, Backup, Recovery

1. DB/Lead-Persistenz backupfähig.
2. Restore-Test.
3. Retention.
4. RPO/RTO pragmatisch definieren.
5. keine persistenten Daten im vergänglichen App-Container.

## PT28.6 — Monitoring/Operations

1. Web/API/Worker Health.
2. Queue Depth/Failures/Dead Letter.
3. CRM-Handoff-Fehler.
4. Mailzustellungsfehler.
5. Logs/Alerting.
6. Disk/CPU/RAM/Container-Restarts.

## PT28.7 — Legacy-Konfigurationsbereinigung

1. widersprüchliche alte Docker-/Compose-/nginx-/Vercel-Dateien entfernen oder archivieren.
2. loopback-Binding/Proxy-Modell dokumentieren.
3. README/Runbook aktualisieren.

**DoD AP28:** Produktions- und Preview-Betrieb sind reproduzierbar, getrennt, health-geprüft, backupfähig und per Image rollbackbar.

# AP29 — SEO-/Content-Migration vor Go-live

**Ziel:** Relaunch ohne vermeidbare Ranking-, Indexierungs- oder Content-Verluste umstellen.

## PT29.1 — Pre-Launch Crawl

1. aktuelle Prod crawlen.
2. Relaunch Preview crawlen.
3. Statuscodes vergleichen.
4. Titles vergleichen.
5. Descriptions vergleichen.
6. Canonicals vergleichen.
7. hreflang vergleichen.
8. interne Links vergleichen.
9. Bilder/Alts prüfen.
10. PDFs/Downloads prüfen.

## PT29.2 — Redirect Map finalisieren

1. Top Landingpages.
2. Backlinks.
3. historische URLs.
4. alte Services.
5. alte Artikelpfade.
6. Spezialseiten.
7. keine Ketten.
8. keine Massenredirects auf Homepage.

## PT29.3 — Sitemap & Robots final

1. Produktionsdomain.
2. vollständige dynamisch ermittelte Einträge entsprechend finaler Route Registry und 10-Sprachen-Scope; keine veraltete fixe URL-Zahl als Vertrag.
3. keine Preview-Domain.
4. Robots erlaubt produktive Assets.
5. keine versehentlichen Noindex.
6. Search Console Einreichung vorbereiten.

## PT29.4 — Launch Content Freeze

1. Freeze-Zeitpunkt.
2. letzte Content-Deltas.
3. Übersetzungs-Freeze.
4. Legal-Freigabe.
5. Asset-Freeze.
6. finale Checksums/Versionen wichtiger PDFs.

**DoD AP29:** Relaunch und Bestand sind vollständig gemappt; keine relevante Alt-URL bleibt ohne Entscheidung.

---

# AP30 — Pre-Launch QA und Release Candidate

**Ziel:** Einen klar identifizierbaren, vollständig geprüften Release Candidate erzeugen.

## PT30.1 — Functional QA

1. Navigation.
2. Suche.
3. Sprachwechsel.
4. alle Formulare.
5. Downloads.
6. externe Links.
7. Hash Navigation.
8. 404.
9. Redirects.
10. Consumer Flows.

## PT30.2 — Browser-/Device-Matrix

1. Chrome Desktop.
2. Safari Desktop.
3. Firefox Desktop.
4. Edge Desktop.
5. iOS Safari.
6. Android Chrome.
7. gängige Tablet-Größe.
8. kleine Mobile-Breite.

## PT30.3 — Visual QA

1. Startseite.
2. Diagnostik-Hub.
3. Service Template.
4. IglooPro.
5. Epigenetik.
6. Befund.
7. Artikel.
8. Formseiten.
9. Legal.
10. Consumer.

## PT30.4 — Nonfunctional QA

1. Accessibility.
2. Performance.
3. Security.
4. SEO.
5. Consent.
6. Analytics.
7. Caching.
8. Server Logs.

## PT30.5 — Release Candidate Freeze

1. Commit SHA festhalten.
2. Build-Artefakte erzeugen.
3. Changelog.
4. bekannte Restpunkte.
5. Go/No-Go-Unterlagen.

**DoD AP30:** Ein definierter RC erfüllt alle Launch-Gates und besitzt keine unbekannten P0/P1-Probleme.

---

# AP31 — Go-live, Cutover und Rollback

**Ziel:** Kontrollierter Produktionswechsel mit minimalem Risiko.

## PT31.1 — Go-live Runbook

1. Verantwortliche.
2. Startzeit.
3. Backup/aktueller Produktionsstand.
4. Deploy-Schritte.
5. DNS/Proxy falls betroffen.
6. Smoke Checks.
7. Search Console Checks.
8. Analytics Checks.
9. Rollback Trigger.
10. Kommunikationskanal.

## PT31.2 — Produktions-Smoke-Test

1. Homepage in repräsentativen Locales manuell plus automatisierte 10-Sprachen-Route-Matrix.
2. Diagnostik.
3. Service Detail.
4. IglooPro.
5. Epigenetik.
6. Artikel.
7. Kontakt.
8. Consumer.
9. Sitemap/robots.
10. API Form Test.

## PT31.3 — SEO-Livecheck

1. Canonical production URL.
2. hreflang.
3. 301s.
4. 404s.
5. Sitemap erreichbar.
6. robots erreichbar.
7. keine Preview Canonicals.
8. Server Statuscodes.

## PT31.4 — Consent-/Analytics-Livecheck

1. Consent denied.
2. Consent analytics granted.
3. Page View.
4. CTA Event.
5. Form Event.
6. keine PII.

## PT31.5 — Rollback

1. Rollback Image/Version.
2. Entscheidungskriterien.
3. Datenkompatibilität prüfen.
4. Smoke nach Rollback.
5. Incident-Dokumentation.

**DoD AP31:** Go-live ist verifiziert oder sauber zurückgerollt; alle kritischen Systeme wurden in Produktion geprüft.

---

# AP32 — Post-Launch Monitoring und Stabilisierung

**Ziel:** Probleme nach Go-live schnell erkennen und datenbasiert priorisieren.

## PT32.1 — Technisches Monitoring

1. HTTP 5xx.
2. 404-Spikes.
3. API Fehler.
4. Form Failure Rate.
5. Prozess-/Container Health.
6. TTFB.
7. CSP Reports.

## PT32.2 — SEO Monitoring

1. Search Console Coverage.
2. Sitemap Processing.
3. Redirect Errors.
4. Soft 404.
5. Canonical Conflicts.
6. hreflang Errors.
7. Rankings/Clicks der wichtigsten Landingpages.

## PT32.3 — Analytics Monitoring

1. Pageviews plausibel.
2. Consent Rate.
3. Form Conversions.
4. Consumer Orders.
5. Downloads.
6. Suchnutzung.
7. Null-/Doppel-Events.

## PT32.4 — UX Monitoring

1. Suchbegriffe ohne Treffer.
2. häufige 404-Ziele.
3. Abbruch in Formularen.
4. Mobil vs Desktop Conversion.
5. Page Performance nach echtem Traffic.

## PT32.5 — Stabilisierungssprint

1. P0 sofort.
2. P1 innerhalb Release-Fenster.
3. P2 bündeln.
4. Learnings dokumentieren.
5. Scope für nächste Iteration ableiten.

**DoD AP32:** Die Website besitzt definierte Betriebsmetriken und einen klaren Prozess für Incidents und Verbesserungen.

---

# AP33 — Dokumentation, Wartbarkeit und Betriebsübergabe

**Ziel:** Relaunch nicht nur launchen, sondern dauerhaft wartbar machen.

## PT33.1 — Entwicklerdokumentation

1. Architektur.
2. Routing.
3. i18n.
4. SEO.
5. Content-Datenmodelle.
6. Komponenten.
7. Lead Platform / CRM / Queue.
8. Consent / Tracking.
9. Tests / Launch Gates.
10. Docker/Compose Deployment / Backup / Rollback.

## PT33.2 — Redaktionsdokumentation

1. Service ändern.
2. Artikel anlegen.
3. Event anlegen.
4. Download ergänzen.
5. Übersetzung ergänzen.
6. Musterbefund pflegen.
7. Meta-Daten pflegen.
8. Bilder optimieren.

## PT33.3 — Wartungsregeln

1. neue Route.
2. neuer Sprach-Key.
3. neuer Service.
4. neuer Artikel.
5. neue API Route.
6. neuer Tracking Event.
7. neue Farbe/Token.
8. neue Download-Datei.
9. neue Redirect-Regel.
10. Deprecation-Prozess.

## PT33.4 — Wissensübergabe

1. Tech Walkthrough.
2. Content Walkthrough.
3. SEO Walkthrough.
4. Analytics Walkthrough.
5. Deployment Walkthrough.
6. Incident/Rollback Walkthrough.

**DoD AP33:** Ein neues Teammitglied kann Projekt, Inhalte, Tests und Deployment anhand der Dokumentation nachvollziehen.

---

# 4. Querschnittsmatrix: Qualitätsverträge je Seitentyp

| Qualitätsbereich   |  B2B/Service | Epigenetik/Musterbefund |     Consumer |   Editorial/Events | Contact/Support |                     Legal |
| ------------------ | -----------: | ----------------------: | -----------: | -----------------: | --------------: | ------------------------: |
| SSR                |      Pflicht |                 Pflicht |      Pflicht |            Pflicht |         Pflicht |                   Pflicht |
| Sprachen           |           10 |                      10 |           10 |                 10 |              10 |                        10 |
| Canonical/hreflang |      Pflicht |                 Pflicht |      Pflicht |            Pflicht |         Pflicht | Pflicht/Indexierungsregel |
| Structured Data    |     selektiv |                selektiv | Product ggf. | Article/Event ggf. |      meist nein |                meist nein |
| CRM/Persistenz     |  CTA/Anfrage |          eigene Inquiry |        Order |    CTA/Lead Magnet |         Pflicht |                      nein |
| Consent/Tracking   | nach Consent |            nach Consent | nach Consent |       nach Consent |    nach Consent |  minimal/keine Conversion |
| Lead Magnet        |  kontextuell |          stark relevant |     optional |           relevant |            nein |                      nein |
| A11y               |  WCAG 2.2 AA |             AA + Charts |   AA + Forms |                 AA |      AA + Forms |                        AA |
| Performance        |         hoch |                    hoch |    sehr hoch |               hoch |            hoch |                    normal |
| SEO                |         hoch |               sehr hoch |    sehr hoch |               hoch |      funktional |       korrekt/konservativ |

---

# 5. Kritische bekannte Altlasten und verbindliche Behandlung

## Launch-Scope

1. `/services*` liefert heute 200 statt dokumentierter 301-Brücke.
2. 404-/Canonical-/hreflang-Semantik der Baseline muss erhalten und getestet werden.
3. Toter Search-Treffer `/diagnostics/sports`.
4. Legal-Sitemap vs. `noindex`-Widerspruch.
5. Sitemap-`lastmod` darf nicht pauschal „heute“ sein.
6. `/api/consumer-order` braucht Rate Limit/Abuse Protection.
7. `/api/chat`, HiHuman, CSP-Chat-Domains und produktive Chat-Reste entfernen.
8. CSP-Reporting nur mit funktionierendem Empfänger; produktive CSP-Strategie abschließen.
9. HSTS am produktiven Origin/Proxy.
10. SSR-i18n-Fallback defensiv korrekt.
11. fehlende i18n-Keys/Namespaces und hartcodierte Consumer-/Spezialseiten schließen.
12. `SearchModal` Dialog/Fokus/Escape/a11y.
13. Consumer `<main>` und Skip-Link.
14. Route-/Statuscode- und SEOHead-Regressionstests.
15. i18n-/Meta-/Design-Guards in CI.
16. Consumer-Bild-/OG-Optimierung.
17. Tier-4-Dokumentation, soweit sie aktive Architektur falsch beschreibt.
18. `DRY_RUN` auf CRM/Queue/Mail ausweiten.
19. Persistenz/Retention/Backup/Recovery für Leads.
20. CRM-/Queue-Failure-Handling und Monitoring.

## Backlog / nicht launch-blockierend

- `prerender.mjs`, `vercel.json` und sonstige tote Config, sofern nicht im produktiven Pfad.
- Search-Console-Datei, wenn Meta-Verifikation ausreicht.
- tote Case-Study-/Shop-/Deal-Komponenten, sofern sie nicht importiert/geladen werden.
- formale Content-Governance.
- CMS-Pipeline-Governance.
- Deal/Voucher/Case Studies/Shop als Produktentscheidung.

---

# 6. Empfohlene Ausführungsreihenfolge

Die AP-Nummerierung ist eine Scope-Struktur, **keine starre chronologische Reihenfolge**. Für eine stabile Umsetzung gilt folgende Wellenlogik:

## Welle 0 — Decision Lock und Repo-Kontrolle

- AP00 Scope/Decisions
- AP01 Baseline/Imports
- AP02 Zielarchitektur
- AP03 IA
- AP04 Content-Readiness

## Welle 1 — Plattformfundament

- AP05 Design-System
- AP10 Route Registry/HTTP-Semantik
- AP08 i18n-Fundament
- AP09 SEO-Fundament
- AP27 frühe CI-/Regression-Gates
- AP06 Shell/Navigation
- AP07 Suche

## Welle 2 — Betriebs- und Lead-Fundament

- AP28 Docker/Compose-Environment-Basis früh aufsetzen
- AP22 Lead-Datenmodell/Persistenz/CRM/Queue-Grundlage
- AP23 Consent-Fundament vor jeglicher Tracking-Aktivierung
- AP26 Secrets/API-/Integration-Security

## Welle 3 — Kernseiten und Geschäftssäulen

- AP11 Homepage
- AP12 Diagnostik-Hub
- AP13 Service-Detailseiten
- AP14 IglooPro
- AP15 Epigenetik-Säule
- AP16 Musterbefunde

## Welle 4 — Content-, Consumer- und Conversion-Strecken

- AP17 Artikel
- AP18 Events
- AP19 Resource Center/Lead Magnet
- AP20 About/Contact/Support/Legal
- AP21 Consumer × 10
- AP22 Journey-Migration abschließen

## Welle 5 — Nonfunctional Hardening

- AP24 Accessibility
- AP25 Performance
- AP26 Security abschließen
- AP27 vollständige Gates/Visual Regression
- AP28 Produktionsbetrieb finalisieren

## Welle 6 — Migration, RC und Launch

- AP29 SEO-/Content-Migration
- AP30 Release Candidate
- AP31 Go-live
- AP32 Stabilisierung
- AP33 Betriebsübergabe

---

# 7. Kritische Abhängigkeitslogik

| Abhängigkeit                                            | Begründung                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| Design-Fundament → Seitenmigration                      | Sales-Machine/Light und Komponentenrezepte zuerst stabilisieren.   |
| Route Registry/SEO-Fundament → Sitemap und main-Imports | Baseline-404/Redirect/Cache-Semantik darf nicht verloren gehen.    |
| i18n-Fundament → Übersetzungswelle                      | Erst Code lokalisierbar machen, dann 10 Sprachen vervollständigen. |
| Epigenetik-IA → Epigenetik-Inquiry                      | Panel-/Source-Kontext hängt von der IA ab.                         |
| Consent-Fundament → Tracking                            | Vor Consent darf kein GTM/GA4 geladen werden.                      |
| CRM-Fundament → Formularmigration                       | Alle Journeys sollen dieselben Persistenz-/Retry-Verträge nutzen.  |
| CRM + Consent → Conversion-Messung                      | Conversion muss rechtlich und operativ sauber sein.                |
| Lead-Magnet-Backend → gated Asset-Rollout               | Sonst ist das Gate durch direkte öffentliche URLs umgehbar.        |
| Chat-Entfernung → CSP-Finalisierung                     | unnötige Third-Party-Domains zuerst entfernen.                     |
| Docker/Compose-Environment → CRM-Betriebsarbeit         | Secrets, Monitoring, Backup, Rollback hängen daran.                |
| `DRY_RUN`-Ausweitung → erste CRM-Anbindung              | Preview darf keine echten Leads schreiben.                         |
| CI-Guards → 10-Sprachen-Rollout                         | Vollständigkeit muss maschinell messbar sein.                      |
| Import-Hygiene → erster `main`-Import                   | verhindert Garantie-Band-/Footer-/404-Regressionsfehler.           |

---

# 8. Verbindliche Launch-Gates

## Gate 1 — Language Gate

- alle relevanten Seiten in 10 Sprachen vollständig;
- Consumer × 10; Epigenetik × 10; Musterbefunde × 10;
- keine produktive Dauer-FallbackNotice;
- Key-/Namespace-Guard in CI grün;
- sprachabhängige Systemmails/Assets korrekt.

## Gate 2 — Consent Gate

- GTM/GA4 und andere nicht notwendige Marketing-/Analytics-Tags laden **erst nach Consent**;
- Reject erzeugt keine Analytics-/Marketing-Requests;
- kein Event-Puffern vor Consent;
- Widerruf funktioniert;
- Consent-/Privacy-Dokumentation konsistent.

## Gate 3 — CRM Gate

- jeder relevante Lead wird vor/innerhalb des Handoffs persistent erfasst;
- Retry/Dead-Letter/Recovery getestet;
- Idempotenz und Dedup getestet;
- `DRY_RUN` verhindert echte Preview-Side-Effects;
- Monitoring/Alerts aktiv;
- Backup/Recovery definiert.

## Gate 4 — SEO Gate

- Consumer × 10 korrekt indexierbar;
- Canonical/hreflang/Sitemap korrekt;
- `/services*` echte 301;
- echte 404 ohne falsche Canonicals;
- Legal-Indexierungswiderspruch gelöst;
- `lastmod` ehrlich;
- keine Preview-Domains.

## Gate 5 — Chat Gate

- kein ChatWidget/HiHuman lädt;
- `/api/chat` entfernt;
- CSP ohne Chat-Domains;
- keine produktive Chat-Abhängigkeit.

## Gate 6 — Epigenetics Gate

- eigenständige Hauptnavigation/Homepage-Rolle;
- Hub + drei Vertiefungen + sechs Musterbefunde × 10;
- eigene Inquiry Journey;
- CRM/Source/Panel-Kontext;
- E2E Golden Path.

## Gate 7 — Content Claim Gate

- `CV < 2 %` über Code, 10 Locales, Structured Data und relevante PDFs konsistent;
- Risk-Register-Vermerk vorhanden;
- kein versehentlicher `<5 %`-Rollback.

## Gate 8 — CTA Gate

- das alte site-weite „garantierte Performance“-Band wird nicht ausgeliefert;
- `main`-Import bringt es nicht zurück;
- kein Ersatzband nur zur Layout-Erhaltung.

## Gate 9 — Naming Gate

- allgemeiner Anfrage-CTA heißt „Angebot anfragen“;
- lokalisierte Entsprechungen × 10;
- fachliche Ausnahmen wie Support/Consumer Order sind bewusst.

## Gate 10 — Lead-Magnet Gate

- mindestens ein gated Pfad produktiv vollständig;
- Gate, Consent, Persistenz, CRM, Zustellung, Abuse Protection, Tracking, i18n, a11y getestet;
- Asset nicht trivial am Gate vorbei öffentlich abrufbar, sofern echtes Gating beabsichtigt ist.

## Gate 11 — Accessibility Gate

- WCAG 2.2 AA für Kernpfade nachgewiesen;
- Skip-Link und `<main>`;
- Dialog/Fokus/Keyboard korrekt;
- Charts mit textlicher Alternative;
- automatisierte a11y-Prüfung grün;
- keine bekannten kritischen A11y-Blocker.

## Gate 12 — Operations/Security Gate

- Docker/Compose-Produktionsstack health-geprüft;
- Secrets außerhalb Images/Repo;
- HSTS/Security Headers/CSP produktionsreif;
- Backup-Restore nachgewiesen;
- image-basiertes Rollback getestet;
- CRM/Queue/Mail-Fehler sichtbar.

---

# 9. Ticket-Template für operative AP-Prompts/Tickets

```md
## [APxx / PTxx.x] Titel

### Ziel

...

### Decision Locks

- DEC-RL-...
- REST-...

### Repository-Kontext

- Baseline: feat/home-leadmagnet@961f65d
- ggf. selektive Quelle: ...

### Scope

- ...

### Out of Scope

- ...

### Subtasks

1. ...

### Abhängigkeiten

- ...

### Akzeptanzkriterien

- [ ] ...

### Tests / Gates

- Unit:
- Integration:
- E2E:
- SEO/i18n/a11y/Consent/CRM:

### Repo-Sicherheitsregeln

- keine fremden Änderungen entfernen
- keine Secrets ausgeben
- keine produktiven Side Effects ohne expliziten Scope
- main/redesign nur selektiv importieren

### Definition of Done

- [ ] Scope vollständig
- [ ] Tests grün
- [ ] relevante Launch-Gates grün
- [ ] Doku aktualisiert
```

---

# 10. Verbindliche Projektartefakte

1. `DECISIONS.md` — alle Decision Locks.
2. `RELAUNCH-BACKLOG.md` — AP/PT priorisiert.
3. `ROUTE-MATRIX.md` — Route × Sprache × Status × Sitemap × Canonical × hreflang.
4. `REDIRECT-MAP.md`.
5. `CONTENT-MATRIX.md` — Launch-Content-Status, **nicht** dauerhafte Governance.
6. `SEO-MATRIX.md`.
7. `TRACKING-PLAN.md` — Events/Conversions/Consent.
8. `LEAD-DATA-CONTRACT.md` — Lead-Typen, Consent Evidence, Statusmodell.
9. `CRM-INTEGRATION.md` — Handoff/Retry/Idempotenz/Fehlerpfade.
10. `OPERATIONS-RUNBOOK.md` — Docker/Compose, Secrets, Health, Backup, Restore, Rollback.
11. `QA-MATRIX.md`.
12. `LAUNCH-RUNBOOK.md`.
13. `POST-LAUNCH-CHECKLIST.md`.
14. `RISK-REGISTER.md`.

---

# 11. Quellen- und Evidenzbasis

Der finale Scope basiert auf:

- auditiertem Repository-Stand `feat/home-leadmagnet@961f65d`;
- gezielten Evidenzen aus `main@d0fdf29` und `redesign/preview@5673b61`;
- Repository-Reality-, Branch-Reconciliation-, Candidate-Baseline- und Decision-Archaeology-Audits;
- Decision Lock & Master-Scope Reconciliation Audit;
- den bestätigten Product-Owner-Entscheidungen `DEC-RL-001` bis `DEC-RL-015`;
- den geschlossenen Restentscheidungen `REST-01` bis `REST-03`;
- Projektdokumentation `README.md`, `01-seitenstruktur.md`, `02-navigation.md`, `03-technik.md`, `04-i18n.md`, `05-seo.md`, `06-inhaltsdaten.md`, `07-komponenten.md`, `08-tracking-consent.md`, `09-qualitaet.md`, `10-befunde.md`.

Repository-Evidenz beschreibt den technischen Ist-Zustand. Product-Owner-Entscheidungen überschreiben historische Annahmen, wenn beide kollidieren.

---

# 12. Expliziter Backlog außerhalb des initialen Relaunch-Scope

## 12.1 Content Governance

- Content Owner je Bereich;
- Review-Zyklen/Freshness;
- formaler Übersetzungsworkflow;
- medizinisch-fachlicher Freigabeprozess als dauerhaftes Governance-System;
- CMS-Pipeline-Governance.

## 12.2 Vertagte Produktbereiche

- Deal/Voucher;
- Case Studies;
- Shop;
- Reaktivierung/Entfernung erst nach eigener Product-Decision.

## 12.3 Technische Altlasten ohne Launch-Wirkung

- tote Prerender-/Vercel-/alte Docker-Dateien, soweit nicht aktiv;
- tote Komponenten/Assets;
- Search-Console-Datei, sofern Meta-Verifikation genügt;
- sonstige Graveyard-Bereinigung.

---

# 13. Finaler Scope-Status

**Scope Rewrite Readiness:** **READY**

Die zuvor launch-blockierenden Restentscheidungen sind geschlossen:

- `REST-01`: Docker/Compose als produktiver Zielbetrieb;
- `REST-02`: Basic Consent Mode v2 mit vollständigem Ladeverzicht vor Consent;
- `REST-03`: Consumer-Landingpages vollständig in allen 10 Sprachen.

Damit enthält dieser Master-Scope **keine bekannte offene Produktentscheidung, die den Relaunch-Architekturrahmen blockiert**. Umsetzungsnahe Detailentscheidungen — etwa konkreter CRM-Anbieter, Queue-Technik, Datenbankprodukt, erstes gegatetes Asset, Consumer-Hub oder genaue Structured-Data-Ausprägung — werden innerhalb der jeweiligen APs anhand der hier definierten Verträge getroffen, ohne die Decision Locks neu zu öffnen.

Die 34 Arbeitspakete AP00–AP33 bilden zusammen den verbindlichen vollständigen Relaunch-Rahmen.
