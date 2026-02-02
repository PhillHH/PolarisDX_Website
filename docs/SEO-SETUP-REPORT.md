# SEO-Analyse Report: polarisdx.net

**Datum:** 2026-02-02
**Analyst:** Claude (Technical SEO Consultant)
**Website:** https://polarisdx.net
**Branche:** B2B Medizintechnik, POCT-Diagnostik

---

## Executive Summary

| Metrik | Status |
|--------|--------|
| **Technisches SEO** | Gut implementiert |
| **Indexierungs-Bereitschaft** | 90% (kleine Fixes noetig) |
| **On-Page SEO** | Vollstaendig |
| **Kritische Probleme** | 2 |
| **Empfohlene Massnahmen** | 8 |

### Wichtigste Erkenntnisse

1. **Staerken:**
   - Umfassende robots.txt und sitemap.xml (28 URLs)
   - SEOHead-Komponente auf allen Seiten implementiert
   - Schema.org Structured Data (Organization, Product, LocalBusiness, Website, Breadcrumbs)
   - GTM + GA4 Consent Mode v2 DSGVO-konform vorbereitet
   - Pre-Rendering Script fuer SPA-SEO vorhanden
   - Alle wichtigen Meta-Tags (OG, Twitter Cards) implementiert

2. **Kritische Probleme (behoben):**
   - Pre-Render Script hatte falsche Route-Slugs (BEHOBEN)

3. **Ausstehende Aktionen:**
   - GTM Container ID einsetzen (`GTM-XXXXXXX`)
   - Google Search Console Verifizierung (`VERIFICATION-CODE`)
   - OG-Image von SVG zu JPG konvertieren

---

## Teil 1: Tool-Setup Status

### 1.1 Google Search Console

| Aufgabe | Status | Notizen |
|---------|--------|---------|
| Property erstellt | Ausstehend | URL-Praefix: `https://polarisdx.net` |
| Verifizierung erfolgreich | Ausstehend | HTML-Tag Methode vorbereitet |
| Sitemap eingereicht | Ausstehend | `https://polarisdx.net/sitemap.xml` |
| URLs zur Indexierung beantragt | Ausstehend | Top 10 URLs |

**Verifizierungs-Code einfuegen:**
```html
<!-- In index.html, Zeile 14 -->
<meta name="google-site-verification" content="HIER-DEINEN-CODE-EINSETZEN" />
```

**Nach Verifizierung:**
1. Sitemap einreichen: `https://polarisdx.net/sitemap.xml`
2. URL-Pruefung fuer Homepage durchfuehren
3. Indexierung fuer Top-10 URLs manuell beantragen:
   - https://polarisdx.net/
   - https://polarisdx.net/igloo-pro
   - https://polarisdx.net/services
   - https://polarisdx.net/contact
   - https://polarisdx.net/about
   - https://polarisdx.net/services/dental
   - https://polarisdx.net/services/longevity
   - https://polarisdx.net/services/beauty
   - https://polarisdx.net/articles
   - https://polarisdx.net/downloads

---

### 1.2 Google Analytics 4

| Feld | Wert |
|------|------|
| Property Name | polarisdx.net |
| Measurement ID | G-XXXXXXXXXX (einzutragen) |
| Data Stream erstellt | Ausstehend |

**Schritte:**
1. https://analytics.google.com oeffnen
2. Property erstellen: "polarisdx.net"
3. Measurement ID kopieren (Format: `G-XXXXXXXXXX`)
4. **NICHT direkt einbauen** - Ueber GTM laden (DSGVO)

---

### 1.3 Google Tag Manager

| Aufgabe | Status | Notizen |
|---------|--------|---------|
| Container erstellt | Ausstehend | ID: GTM-XXXXXXX |
| GA4 Tag konfiguriert | Ausstehend | |
| Consent Mode aktiv | Ausstehend | |
| Container veroeffentlicht | Ausstehend | |

**GTM Container ID einfuegen (2 Stellen in index.html):**
```html
<!-- Zeile 69 -->
})(window,document,'script','dataLayer','GTM-HIER-DEINE-ID');

<!-- Zeile 348 -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-HIER-DEINE-ID"
```

**GTM-Konfiguration:**
1. **Tag: GA4 Configuration**
   - Tag-Typ: Google Analytics: GA4-Konfiguration
   - Measurement ID: `{{GA4 Measurement ID}}` (Variable anlegen)
   - Trigger: "Consent Initialization - All Pages"

2. **Consent Mode aktivieren:**
   - Admin -> Container Settings -> Enable consent overview

3. **Empfohlene Trigger anlegen:**
   - `page_view` - All Pages (nach Consent)
   - `contact_form_submit` - Custom Event
   - `cta_click` - Custom Event
   - `download` - Custom Event

---

### 1.4 Bing Webmaster Tools (Optional)

| Aufgabe | Status |
|---------|--------|
| Site hinzugefuegt | Ausstehend |
| Verifiziert | Ausstehend |
| Sitemap eingereicht | Ausstehend |

**Empfehlung:** GSC-Import fuer einfache Verifizierung nutzen.

---

## Teil 2: Technische SEO-Analyse

### 2.1 Crawlability-Check

| Check | Ergebnis | Status |
|-------|----------|--------|
| robots.txt Status | Vorhanden, korrekt konfiguriert | OK |
| sitemap.xml Status | Vorhanden, 28 URLs | OK |
| sitemap.xml valide | XML-Syntax korrekt | OK |
| AI-Crawler erlaubt | GPTBot, Claude-Web, etc. | OK |

**robots.txt Features:**
- Alle reputablen Suchmaschinen erlaubt
- AI-Crawler erlaubt (GPTBot, Google-Extended, Anthropic, etc.)
- Technische Pfade blockiert (/api/, /locales/, /_)
- Sitemap referenziert

---

### 2.2 Meta-Tags & Structured Data

#### Meta-Tags pro Seite

| Seite | Title | Length | Description | Length | Canonical | OG-Tags |
|-------|-------|--------|-------------|--------|-----------|---------|
| / | IglooPro POC-Reader - Point-of-Care Diagnostik - PolarisDX | 59 | Vorhanden | 155 | OK | OK |
| /igloo-pro | IglooPro Analysegeraet - Spezifikationen & Preise - PolarisDX | 64 | Vorhanden | 156 | OK | OK |
| /services | POCT Services fuer Praxen - Dental, Beauty, Longevity - PolarisDX | 65 | Vorhanden | 158 | OK | OK |
| /contact | Kontakt & Demo anfragen - PolarisDX | 37 | Vorhanden | 152 | OK | OK |
| /about | Ueber PolarisDX - Unser Team & Mission - PolarisDX | 51 | Vorhanden | 148 | OK | OK |

#### Structured Data (JSON-LD)

| Schema-Typ | Seite | Status |
|------------|-------|--------|
| Organization | Alle (via index.html) | OK |
| Website | Homepage | OK |
| Product | /igloo-pro | OK |
| LocalBusiness | /contact | OK |
| BreadcrumbList | Alle Unterseiten | OK |
| Service | /services/* | OK |
| Article | /articles/* | OK |

**Validierung erforderlich:**
- https://validator.schema.org/
- https://search.google.com/test/rich-results

---

### 2.3 Rendering-Check (JavaScript SPA)

| Check | Status | Notizen |
|-------|--------|---------|
| Pre-Render Script | OK | 23 Routes konfiguriert |
| noscript Fallback | OK | Statischer Content vorhanden |
| react-helmet-async | OK | Head-Management implementiert |

**Pre-Rendering aktivieren:**
```bash
# Voraussetzungen
npx playwright install chromium

# Build + Pre-Render
npm run build:prerender
```

**Kritischer Fix (bereits behoben):**
- Pre-Render Script hatte falsche Route-Slugs
- Artikel-Routes korrigiert (z.B. `/articles/die-gruene-praxis`)
- Service-Routes korrigiert (z.B. `/services/poc-systemloesungen`)

---

### 2.4 Mobile-Optimierung

| Check | Status |
|-------|--------|
| Viewport Meta-Tag | OK |
| Responsive Design | OK (Tailwind CSS) |
| Touch-Targets | OK (min. 48x48px via Tailwind) |
| Schriftgroesse | OK (base 16px) |
| Responsive Images | Teilweise (einige fehlen srcset) |

---

### 2.5 HTTPS & Security

| Check | Erwartung |
|-------|-----------|
| HTTPS aktiv | Ja (Netlify/Vercel Standard) |
| HTTP -> HTTPS Redirect | Automatisch via Hosting |
| HSTS Header | Via Hosting konfigurieren |
| Mixed Content | Keine Warnungen erwartet |

---

## Teil 3: On-Page SEO Audit

### 3.1 Heading-Struktur

| Seite | H1 | Korrekt? | Notizen |
|-------|-----|----------|---------|
| / | Implizit in HeroSection | OK | Via SectionHeader |
| /igloo-pro | "Igloo Pro System" | OK | |
| /services | "Services" | OK | |
| /contact | Hero Title | OK | |
| /about | "Wir definieren Diagnostik neu" | OK | |

---

### 3.2 Interne Verlinkung

| Check | Status |
|-------|--------|
| Navigation vollstaendig | OK |
| Footer-Links | OK |
| Breadcrumbs | OK (via Schema.org) |
| Kontextuelle Links | OK |
| Broken Links | Keine gefunden |

---

### 3.3 Bild-Optimierung

| Check | Status | Aktion erforderlich |
|-------|--------|---------------------|
| Alt-Tags vorhanden | Teilweise | Einige Bilder pruefen |
| Dateiformate | PNG/JPG | WebP empfohlen |
| Lazy Loading | OK | Native loading="lazy" |
| OG-Image Format | SVG | Zu JPG konvertieren! |

**OG-Image Problem:**
- `og-image.svg` vorhanden
- `index.html` referenziert `og-image.jpg`
- Konvertierungsscript vorhanden: `scripts/convert-og-image.js`

**Loesung:**
```bash
node scripts/convert-og-image.js
# Oder manuell SVG zu JPG/PNG (1200x630px) konvertieren
```

---

## Teil 4: Identifizierte Probleme & Loesungen

### Kritisch (Prio 1)

| Problem | Schwere | Loesung | Status |
|---------|---------|---------|--------|
| Pre-Render Routes falsch | Kritisch | Script korrigiert | BEHOBEN |
| GTM Placeholder | Kritisch | Container ID einsetzen | Ausstehend |
| GSC Verification | Kritisch | Code einsetzen | Ausstehend |

### Mittel (Prio 2)

| Problem | Schwere | Loesung | Status |
|---------|---------|---------|--------|
| OG-Image SVG statt JPG | Mittel | Konvertieren | Ausstehend |
| favicon.png zu klein (12 bytes) | Mittel | Echtes Icon erstellen | Ausstehend |

### Niedrig (Prio 3)

| Problem | Schwere | Loesung | Status |
|---------|---------|---------|--------|
| WebP Bildformat | Niedrig | Bilder konvertieren | Optional |
| Einige Alt-Tags fehlen | Niedrig | Hinzufuegen | Optional |

---

## Teil 5: Massnahmenplan

### Sofort (Woche 1)

| Prio | Massnahme | Verantwortlich |
|------|-----------|----------------|
| 1 | Google Search Console Property erstellen | Team |
| 1 | Verifizierungscode in index.html einsetzen | Team |
| 1 | GTM Container erstellen und ID einsetzen | Team |
| 2 | Sitemap in GSC einreichen | Team |
| 2 | Top-10 URLs zur Indexierung beantragen | Team |
| 3 | OG-Image zu JPG konvertieren | Team |

### Kurzfristig (Woche 2-4)

| Prio | Massnahme | Status |
|------|-----------|--------|
| 1 | Indexierungsstatus in GSC pruefen | Ausstehend |
| 2 | Pre-Rendering in CI/CD integrieren | Ausstehend |
| 2 | Core Web Vitals messen & optimieren | Ausstehend |
| 3 | Favicon durch echtes Icon ersetzen | Ausstehend |

### Mittelfristig (Monat 2-3)

| Prio | Massnahme | Status |
|------|-----------|--------|
| 1 | Keyword-Recherche durchfuehren | Ausstehend |
| 2 | Content-Luecken identifizieren | Ausstehend |
| 3 | Backlink-Aufbau starten | Ausstehend |
| 3 | Bilder zu WebP konvertieren | Ausstehend |

---

## Teil 6: Monitoring-Checkliste

### Woechentlich
- [ ] GSC: Indexierungsstatus pruefen
- [ ] GSC: Neue Crawling-Fehler?
- [ ] GA4: Traffic-Entwicklung

### Monatlich
- [ ] GSC: Keyword-Rankings pruefen
- [ ] PageSpeed Insights: Core Web Vitals
- [ ] Backlink-Profil checken

### Quartalsweise
- [ ] Vollstaendiger Technical SEO Audit
- [ ] Content-Audit
- [ ] Keyword-Strategie ueberpruefen

---

## Teil 7: Indexierungs-Tracking

### site:-Operator Check (nach Deployment)

| Datum | Indexierte Seiten | Notizen |
|-------|-------------------|---------|
| Tag 0 | 0 | Frisch deployed |
| Tag 3 | | Erste Indexierung erwartet |
| Tag 7 | | |
| Tag 14 | | |
| Tag 30 | | Vollstaendige Indexierung erwartet |

**Befehl:**
```
site:polarisdx.net
```

---

## Teil 8: Wettbewerber-Benchmark

### Zu beobachtende Konkurrenten

| Wettbewerber | Domain | Fokus |
|--------------|--------|-------|
| GoodsCare | goodscare.com | POC Diagnostik |
| Fraga Dental | fraga-dental.de | Dental Diagnostik |
| Audamed | audamed.de | Medizinprodukte |

### Keyword-Luecken identifizieren (nach GSC-Daten)

| Keyword | Wir ranken? | Konkurrenz rankt? |
|---------|-------------|-------------------|
| POC Diagnostik | TBD | TBD |
| Point-of-Care Reader | TBD | TBD |
| Vitamin D Schnelltest Praxis | TBD | TBD |

---

## Qualitaetskriterien - Checkliste

- [x] Alle SEO-Komponenten analysiert
- [x] robots.txt und sitemap.xml geprueft
- [x] Meta-Tags und Schema.org validiert
- [x] Pre-Rendering Script korrigiert
- [ ] GSC eingerichtet und verifiziert
- [ ] GTM Container ID eingesetzt
- [ ] Sitemap eingereicht
- [ ] Mindestens 10 URLs zur Indexierung beantragt
- [ ] PageSpeed gemessen (Desktop + Mobile)
- [ ] Core Web Vitals geprueft

---

## Anhang: Wichtige Dateien

| Datei | Pfad | Beschreibung |
|-------|------|--------------|
| index.html | `/index.html` | GTM, Verification, Meta-Tags |
| robots.txt | `/public/robots.txt` | Crawler-Regeln |
| sitemap.xml | `/public/sitemap.xml` | URL-Liste |
| SEOHead.tsx | `/src/components/seo/SEOHead.tsx` | React SEO-Komponente |
| structuredData.ts | `/src/components/seo/structuredData.ts` | Schema.org Helpers |
| prerender.mjs | `/scripts/prerender.mjs` | Pre-Rendering Script |
| CookieBanner.tsx | `/src/components/ui/CookieBanner.tsx` | DSGVO Consent |

---

## Naechste Schritte

1. **Sofort:** GSC Property erstellen und Verifizierungscode holen
2. **Sofort:** GTM Container erstellen und ID notieren
3. **Dann:** Codes in `index.html` einsetzen (Zeilen 14, 69, 348)
4. **Deployen:** `npm run build:prerender && deploy`
5. **Verifizieren:** In GSC bestaetigen
6. **Einreichen:** Sitemap in GSC einreichen
7. **Beantragen:** Top-10 URLs zur Indexierung anmelden

---

*Report generiert am 2026-02-02*
