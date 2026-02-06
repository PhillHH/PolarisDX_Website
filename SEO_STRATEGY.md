# SEO-Strategie: PolarisDX - Weg zur Brancheninstitution

## Ziel
PolarisDX soll die #1 Authority-Website im DACH-Raum für Point-of-Care Diagnostik werden, mit Top-Rankings für alle relevanten Keywords rund um POCT, Schnelltests, IglooPro und medizinische Sofortdiagnostik.

---

## TEIL 1: IST-ANALYSE

### Was bereits gut funktioniert
- SSR (Server-Side Rendering) mit Express + Vite
- React-Helmet-Async fuer dynamische Meta-Tags
- 9 JSON-LD Schema-Typen (Organization, MedicalBusiness, Product, etc.)
- Canonical Tags auf allen Seiten
- robots.txt + sitemap.xml vorhanden
- OG/Twitter Meta-Tags korrekt
- GTM mit Consent Mode v2 (DSGVO-konform)
- Google Search Console verifiziert
- 10 Sprachen unterstuetzt (i18n)

### Kritische Luecken (bereits in diesem PR gefixt)
- [x] robots.txt blockierte JS/CSS (Google Rendering-Validierung)
- [x] Kein SearchAction Schema (Sitelinks-Searchbox)
- [x] Kein Event-Schema auf der Events-Seite
- [x] Zu wenige interne Links im Footer (4 -> 14+ Links)
- [x] Keine Services im Header-Dropdown
- [x] Copyright-Jahr veraltet (2025 -> dynamisch)
- [x] Review/Event Schema-Generatoren fehlten
- [x] Breadcrumb UI-Komponente fehlte

---

## TEIL 2: ON-PAGE SEO MASSNAHMEN

### P0 - Kritisch (sofort umsetzen)

#### 2.1 Sprachspezifische URLs einfuehren
**Problem:** Aktuell nutzt i18n nur Client-Side Switching. Google sieht fuer alle 10 Sprachen dieselbe URL.
**Loesung:**
- URL-Praefixe einfuehren: `/de/about`, `/en/about`, `/fr/about`
- Default-Sprache (DE) ohne Praefix: `/about` -> Deutsch
- Server-seitiges Routing in `server.ts` anpassen
- Sitemap mit hreflang-Alternates generieren
- **Impact:** 10x mehr indexierbare Seiten, internationale Sichtbarkeit

#### 2.2 Dynamische Sitemap-Generierung
**Problem:** Statische sitemap.xml, keine `lastmod`, keine hreflang
**Loesung:**
- Sitemap-Generierung als Build-Script oder Server-Endpoint (`/sitemap.xml`)
- Automatisch alle Artikel, Services, Sprachen einbeziehen
- `lastmod` aus Git-Commits oder Content-Aenderungen
- hreflang-Alternates pro URL
- Sitemap-Index fuer grosse Sitemaps (wenn >500 URLs)
- Bei Google Search Console einreichen

#### 2.3 Content-Cluster / Topic-Hub Strategie
**Problem:** Nur 6 Artikel, keine thematische Struktur
**Loesung - 5 Pillar-Pages mit je 5-10 Cluster-Artikeln:**

**Pillar 1: "Point-of-Care Diagnostik" (Hauptthema)**
- Was ist POC-Diagnostik?
- POCT vs. Labor: Vergleich
- Qualitaetssicherung bei POCT
- POC-Diagnostik in der Zahnmedizin
- Regulatorik: IVDR und POC-Tests

**Pillar 2: "IglooPro POC-Reader" (Produkt)**
- Technische Spezifikationen
- Anwendungsbeispiele nach Fachrichtung
- Vergleich mit anderen POC-Readern
- Integration in Praxissoftware (LIS/HIS)
- ROI-Kalkulator fuer Praxen

**Pillar 3: "Dental-Diagnostik" (Zielmarkt 1)**
- Vitamin D und Implantologie
- CRP vor Implantation
- HbA1c bei Parodontitis
- Praeoperative Schnelltests
- Patientensicherheit in der Zahnmedizin

**Pillar 4: "Beauty & Aesthetik" (Zielmarkt 2)**
- Biomarker fuer Anti-Aging
- Hormondiagnostik in der Aesthetik
- Vitamin D fuer Haut und Haar
- Schilddruesenfunktion und Beauty
- Blutbild vor aesthetischen Eingriffen

**Pillar 5: "Longevity & Praevention" (Zielmarkt 3)**
- Praeventive Gesundheitschecks
- Biomarker fuer Langlebigkeit
- Hormonstatus und Alterung
- Entzuendungsmarker (CRP, Ferritin)
- Cardiovaskulaere Risikomarker

### P1 - Hoch (innerhalb 1-2 Wochen)

#### 2.4 FAQ-Seiten pro Service
**Problem:** FAQ nur auf Homepage
**Loesung:**
- Eigener FAQ-Bereich pro Service-Seite
- FAQPage Schema auf jeder Service-Seite
- Keywords aus "People Also Ask" von Google recherchieren
- FAQ-Texte in Uebersetzungen pflegen

#### 2.5 Keyword-Optimierung der Titles
**Aktuelle Titles und Optimierungsvorschlaege:**

| Seite | Aktuell | Optimiert |
|-------|---------|-----------|
| Home | IglooPro POC-Reader \| Point-of-Care Diagnostik | IglooPro POC-Reader: Laborergebnisse in 3 Min \| PolarisDX |
| Dental | Dental - POC Diagnostik | POC-Diagnostik fuer Zahnaerzte: Vitamin D & CRP Schnelltest |
| Beauty | Beauty - POC Diagnostik | Beauty-Diagnostik: Biomarker-Analyse fuer Aesthetik-Praxen |
| Longevity | Longevity - POC Diagnostik | Longevity-Diagnostik: Praeventive Gesundheitschecks in 3 Min |
| Artikel Index | Fachartikel zu POC-Diagnostik | Fachartikel & Ratgeber: Point-of-Care Diagnostik Wissen |
| Kontakt | Kontakt & Demo anfragen | IglooPro Demo anfragen: Kostenlose Beratung \| PolarisDX |

#### 2.6 Meta-Descriptions optimieren
- Jede Description sollte einen CTA enthalten ("Jetzt testen", "Demo anfragen")
- Exakt 150-160 Zeichen
- Hauptkeyword in den ersten 70 Zeichen
- Unique pro Seite

#### 2.7 Interne Verlinkung systematisieren
- **Artikel -> Service:** Jeder Artikel verlinkt auf 1-2 relevante Service-Seiten
- **Service -> Artikel:** Jede Service-Seite verlinkt auf 2-3 relevante Artikel
- **Service -> Service:** "Verwandte Diagnostik"-Sektion am Ende jeder Service-Seite
- **Homepage -> Alle:** Sicherstellen, dass Homepage auf alle wichtigen Seiten verlinkt
- **Breadcrumbs:** Sichtbare Breadcrumbs auf allen Unterseiten (Komponente bereits erstellt)

#### 2.8 Bild-SEO verbessern
- Alt-Tags mit Keywords anreichern (nicht nur "PolarisDX logo")
- WebP-Format beibehalten (bereits vorhanden)
- `width` und `height` Attribute ueberall setzen (CLS vermeiden)
- Aussagekraeftige Dateinamen: `igloo-pro-poc-reader.webp` statt `og-image.jpg`
- Jedes Artikelbild mit beschreibendem Alt-Tag

### P2 - Mittel (innerhalb 1 Monat)

#### 2.9 Glossar / Wissensdatenbank
- `/glossar` Seite mit POC-Fachbegriffen (Biomarker, POCT, IVD, etc.)
- Jeder Begriff mit eigener Unterseite fuer Longtail-Rankings
- Interne Verlinkung aus Artikeln und Service-Seiten
- DefinedTerm Schema pro Glossareintrag

#### 2.10 Video-Content + Schema
- Erklaervideos zum IglooPro (Anwendung, Ergebnisse)
- VideoObject Schema implementieren
- YouTube-Kanal mit Backlinks zur Website
- Videos auf Service-Seiten einbetten

#### 2.11 Case Studies aktivieren
- Die deaktivierte Case-Study-Sektion wieder aktivieren
- Mindestens 3 Case Studies:
  - 32reasons (Dr. Grimm) - Dental
  - Beauty-Center Case Study
  - Longevity-Klinik Case Study
- Case Study Schema implementieren

---

## TEIL 3: TECHNISCHES SEO

### P0 - Kritisch

#### 3.1 Core Web Vitals optimieren
- **LCP:** Hero-Image-Preloading ist vorhanden (gut). OG-Image von SVG auf JPG/WebP umstellen.
- **CLS:** `width` und `height` auf alle Bilder setzen
- **INP:** Event Handler optimieren, keine schweren Berechnungen im Main Thread

#### 3.2 Crawl-Budget optimieren
- `lastmod` in Sitemap hinzufuegen
- Redirect-Ketten pruefen (/services/* -> /diagnostics/* ist vorhanden)
- 404-Seite liefert korrekten HTTP 404 Status (pruefen!)

### P1 - Hoch

#### 3.3 Prerendering / Static Generation erweitern
- `scripts/prerender.mjs` existiert - fuer alle Seiten nutzen
- Kritische Seiten (Home, Services, Artikel) als statisches HTML ausliefern
- Schnellere TTFB = besseres Ranking

#### 3.4 Security Headers erweitern
- Content-Security-Policy (CSP) Header hinzufuegen
- HSTS Header fuer HTTPS-Erzwingung
- Permissions-Policy Header

#### 3.5 Structured Data erweitern
Neue Schema-Typen fuer maximale Rich-Snippet-Abdeckung:
- **HowTo Schema** auf Service-Seiten ("So funktioniert IglooPro")
- **VideoObject** fuer eingebettete Videos
- **DefinedTerm** fuer Glossar
- **ItemList** fuer Service-Uebersicht und Artikel-Index
- **SpeakableSpecification** fuer Voice-Search-Optimierung

---

## TEIL 4: OFF-PAGE SEO

### 4.1 Linkbuilding-Strategie

#### Tier 1: Branchenverzeichnisse & Portale
- **Medizinische Verzeichnisse:** Aerzteverzeichnisse, Medizintechnik-Portale
- **B2B-Verzeichnisse:** WLW, Europages, Kompass, Yellow Pages
- **Branchenspezifisch:** VDDI (Verband Deutscher Dental-Industrie), BVMed
- **Google Business Profile:** Fuer Hamburg und London Standorte

#### Tier 2: Content-basiertes Linkbuilding
- **Gastartikel** in Dental-Fachzeitschriften (ZWP, DZW)
- **Gastartikel** in Longevity/Anti-Aging Magazinen
- **Pressemitteilungen** bei Productlaunch/Messe-Teilnahmen
- **Studien & Whitepaper** mit zitierfaehigen Daten veroeffentlichen
- **Infografiken** zu POC-Diagnostik-Themen erstellen

#### Tier 3: PR & Partnerschaften
- **Kooperationen** mit Zahnarztpraxen (Dr. Grimm, Dr. Pollock) fuer gegenseitige Verlinkung
- **Universitaets-Partnerschaften:** Forschungskooperationen mit Uni Hamburg, Charite Berlin
- **Messe-Backlinks:** Aussteller-Profile auf Medica, IDS, AACD
- **Podcast-Auftritte** in Dental- und Medtech-Podcasts

#### Tier 4: Digital PR
- **HARO/Qwoted/SourceBottle:** Als Experte fuer POC-Diagnostik registrieren
- **LinkedIn Thought Leadership:** CEO/CTO regelmaessig Fachartikel posten
- **Social Signals:** LinkedIn-Unternehmensseite aktiv bespielen (bereits vorhanden)

### 4.2 Social Media SEO
- **LinkedIn:** Hauptkanal fuer B2B (bereits vorhanden)
- **Instagram:** Bereits vorhanden - fuer Visual Content optimieren
- **YouTube:** Kanal erstellen fuer Produktvideos und Tutorials
- **Twitter/X:** Fuer schnelle Branchennews und Studien-Teilungen

### 4.3 Local SEO
- **Google Business Profile** fuer Hamburg optimieren
- **Google Business Profile** fuer London erstellen
- **NAP-Konsistenz:** Name, Adresse, Telefonnummer ueberall identisch
- **Bewertungen sammeln:** Systematisch Google Reviews von Kunden einholen
- **Lokale Keywords:** "POC Diagnostik Hamburg", "Schnelltest Geraet Hamburg"

---

## TEIL 5: CONTENT-STRATEGIE

### 5.1 Redaktionsplan (Vorschlag)

**Woche 1-4:**
- 2 Pillar-Artikel ("Was ist POC-Diagnostik?", "IglooPro im Detail")
- 4 Cluster-Artikel (je 1 pro Zielgruppe + 1 technischer)
- 1 Case Study (32reasons reaktivieren)

**Woche 5-8:**
- 2 Pillar-Artikel ("Dental-Diagnostik", "Longevity-Diagnostik")
- 4 Cluster-Artikel
- 1 Case Study
- Glossar mit 20 Begriffen starten

**Woche 9-12:**
- 1 Pillar-Artikel ("Beauty-Diagnostik")
- 6 Cluster-Artikel
- 2 Case Studies
- Glossar auf 50 Begriffe erweitern

### 5.2 Content-Formate
- **Fachartikel** (1500-3000 Woerter, SEO-optimiert)
- **Quick Reads** (500-800 Woerter, fuer spezifische Fragen)
- **Vergleichsartikel** ("IglooPro vs. Labortest: Was ist besser?")
- **How-To Guides** ("So integrieren Sie POC-Tests in Ihren Praxisalltag")
- **Datengetriebene Studien** (eigene Daten + Quellen)
- **Infografiken** (teilbar, backlink-faehig)

### 5.3 Keyword-Targets

#### Head-Keywords (hohes Volumen, hohe Konkurrenz):
- "Point-of-Care Diagnostik" / "POCT"
- "Schnelltest Praxis"
- "POC Reader"
- "Vitamin D Schnelltest"
- "CRP Schnelltest"

#### Long-Tail Keywords (niedriges Volumen, niedrige Konkurrenz):
- "POC Diagnostik Zahnarztpraxis"
- "Vitamin D Test vor Implantation"
- "HbA1c Schnelltest Parodontitis"
- "POC Reader Praxisintegration"
- "Biomarker Longevity Praxis"
- "Beauty Klinik Bluttest"
- "IglooPro Erfahrungen"
- "POC Test Geraet kaufen"

#### Informational Keywords (fuer Artikel):
- "Was ist ein POC Test?"
- "Wie funktioniert ein Schnelltest?"
- "Vitamin D Werte verstehen"
- "CRP Wert erhoht Zahnarzt"
- "Praeoperative Diagnostik Zahnarzt"

---

## TEIL 6: TRACKING & KPIs

### Zu trackende Metriken
1. **Organischer Traffic** (Google Analytics via GTM)
2. **Keyword-Rankings** (Google Search Console + Tool wie Ahrefs/Semrush)
3. **Click-Through-Rate** (Search Console)
4. **Impressions** pro Keyword (Search Console)
5. **Domain Authority / Domain Rating** (Ahrefs/Moz)
6. **Backlink-Profil** (Ahrefs)
7. **Core Web Vitals** (PageSpeed Insights, CrUX)
8. **Indexierte Seiten** (Search Console)
9. **Conversion Rate** (Demo-Anfragen, Kontaktformular)
10. **Rich Snippet Impressions** (Search Console)

### Ziel-KPIs (6 Monate)
- Organischer Traffic: +300% gegenueber Baseline
- Indexierte Seiten: von 29 auf 150+
- Keywords in Top 10: 50+
- Domain Rating: 30+
- Backlinks: 200+
- Demo-Anfragen via organisch: +200%

---

## TEIL 7: IMPLEMENTIERUNGS-REIHENFOLGE

### Phase 1 (Woche 1-2): Technische Grundlagen
1. [x] robots.txt fixen
2. [x] SearchAction Schema
3. [x] Footer-Links erweitern
4. [x] Header-Navigation erweitern
5. [ ] Sprachspezifische URLs implementieren
6. [ ] Dynamische Sitemap
7. [ ] Core Web Vitals Audit

### Phase 2 (Woche 3-4): Content-Grundlagen
8. [ ] Keyword-Recherche mit Ahrefs/Semrush
9. [ ] Title/Description Optimierung aller Seiten
10. [ ] 2 Pillar-Artikel schreiben
11. [ ] Case Studies reaktivieren
12. [ ] FAQ pro Service-Seite

### Phase 3 (Woche 5-8): Content-Skalierung
13. [ ] Redaktionsplan umsetzen (8 Artikel)
14. [ ] Glossar aufbauen
15. [ ] Interne Verlinkung systematisieren
16. [ ] Video-Content erstellen

### Phase 4 (Woche 9-12): Off-Page & Authority
17. [ ] Google Business Profile optimieren
18. [ ] Branchenverzeichnisse eintragen
19. [ ] Gastartikel-Outreach starten
20. [ ] PR-Partnerschaften aufbauen

### Phase 5 (laufend): Optimierung & Skalierung
21. [ ] Monatliches SEO-Reporting
22. [ ] A/B-Tests fuer Titles/Descriptions
23. [ ] Neue Keyword-Opportunities identifizieren
24. [ ] Content-Updates und -Refreshes
25. [ ] Backlink-Monitoring und Disavow

---

## Zusammenfassung: Die 5 groessten Hebel

1. **Sprachspezifische URLs** -> 10x mehr indexierbare Seiten
2. **Content-Cluster-Strategie** -> Authority fuer POC-Diagnostik aufbauen
3. **Interne Verlinkung** -> Link-Equity besser verteilen (bereits verbessert)
4. **Dynamische Sitemap** -> Google findet alle Inhalte schneller
5. **Backlink-Aufbau** -> Domain Authority steigern durch PR + Gastartikel
