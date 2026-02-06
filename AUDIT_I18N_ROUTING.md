# i18n & Routing Audit Report

**Projekt:** PolarisDX Website
**Datum:** 2026-02-06
**Zweck:** Bestandsaufnahme als Grundlage für sprachspezifische URL-Präfixe (`/de/`, `/en/`, `/fr/` etc.)

---

## 1. i18n-Library und Konfiguration

### Library-Stack

| Paket | Version | Zweck |
|-------|---------|-------|
| `i18next` | ^25.6.3 | Core i18n Framework |
| `react-i18next` | ^16.3.5 | React-Bindings (`useTranslation`, `I18nextProvider`) |
| `i18next-http-backend` | ^3.0.2 | Client: Lädt Translations via HTTP |
| `i18next-browser-languagedetector` | ^8.2.0 | Client: Automatische Spracherkennung |

### Konfigurationsarchitektur (3-Datei-Split)

```
src/i18n.ts          → Shared Config (Sprachen, Namespaces, Fallbacks)
src/i18n.client.ts   → Client-Setup (LanguageDetector, HttpBackend)
src/i18n.server.ts   → Server-Setup (Factory-Funktion, Filesystem-Loading, Cache)
```

### Unterstützte Sprachen (10)

| Code | Sprache | OG-Locale |
|------|---------|-----------|
| `de` | Deutsch | `de_DE` |
| `en` | English | `en_GB` |
| `pl` | Polski | `pl_PL` |
| `fr` | Français | `fr_FR` |
| `it` | Italiano | `it_IT` |
| `es` | Español | `es_ES` |
| `pt` | Português | `pt_PT` |
| `da` | Dansk | `da_DK` |
| `nl` | Nederlands | `nl_NL` |
| `cs` | Čeština | `cs_CZ` |

### Namespaces (11)

`common`, `home`, `about`, `articles`, `contact`, `services`, `events`, `downloads`, `legal`, `products`, `shop`

- **Default NS:** `home`
- **Fallback NS:** `common`
- **Default Language:** `de` (Deutsch)
- **Fallback Language:** `en` (English)

### Translation-Dateien

- **Speicherort:** `public/locales/{lng}/{ns}.json`
- **Anzahl:** 10 Sprachen × 11 Namespaces = **110 JSON-Dateien**
- **Server-Ladepfad:** Filesystem (`public/locales/` bzw. `dist/client/locales/`)
- **Client-Ladepfad:** HTTP GET `/locales/{{lng}}/{{ns}}.json`

---

## 2. Aktueller Sprachwechsel-Mechanismus

### Erkennungsreihenfolge (Client)

```
1. querystring (?lng=en)
2. cookie (i18next)
3. localStorage (i18nextLng)
4. navigator (Browser-Sprache)
5. htmlTag (<html lang="...">)
```

### Persistierung

- **localStorage:** Key `i18nextLng`
- **Cookie:** Name `i18next`
- Kein URL-basierter State (keine URL-Präfixe im Client)

### LanguageSwitcher-Komponente (`src/components/ui/LanguageSwitcher.tsx`)

- Dropdown mit Flaggen-Icons
- Ruft `i18n.changeLanguage(lng)` auf
- **Kein** `window.location`-Redirect, **kein** URL-Wechsel
- Sprache ändert sich rein client-seitig via i18next State

### Kritisches Problem für SEO

> Der LanguageSwitcher ändert die Sprache **ohne die URL zu ändern**. Google sieht für `/about` immer denselben Content (das SSR-HTML der erkannten Sprache), kann aber verschiedene Sprachversionen nicht über unterschiedliche URLs crawlen.

---

## 3. Vollständige Routen-Liste (Client-Side)

### Aktive Routen

| Pfad | Komponente | Datei | Lazy (Client) |
|------|-----------|-------|----------------|
| `/` | `HomePage` | `src/routes/HomePage.tsx` | Nein (eager) |
| `/about` | `AboutPage` | `src/routes/AboutPage.tsx` | Ja |
| `/articles` | `ArticlesIndexPage` | `src/routes/ArticlesIndexPage.tsx` | Ja |
| `/articles/:slug` | `ArticlePage` | `src/routes/ArticlePage.tsx` | Ja |
| `/diagnostics` | `ServicesOverviewPage` | `src/routes/ServicesOverviewPage.tsx` | Ja |
| `/diagnostics/:slug` | `ServicePage` | `src/routes/ServicePage.tsx` | Ja |
| `/contact` | `ContactPage` | `src/routes/ContactPage.tsx` | Ja |
| `/privacy` | `PrivacyPage` | `src/routes/PrivacyPage.tsx` | Ja |
| `/imprint` | `ImprintPage` | `src/routes/ImprintPage.tsx` | Ja |
| `/terms` | `TermsPage` | `src/routes/TermsPage.tsx` | Ja |
| `/events` | `EventsPage` | `src/pages/EventsPage.tsx` | Ja |
| `/igloo-pro` | `IglooProPage` | `src/pages/IglooProPage.tsx` | Ja |
| `/vitamin-d3-implantologie` | `VitaminD3ImplantologyPage` | `src/pages/VitaminD3ImplantologyPage.tsx` | Ja |
| `/downloads` | `DownloadsPage` | `src/routes/DownloadsPage.tsx` | Ja |
| `*` | `NotFoundPage` | `src/pages/NotFoundPage.tsx` | Ja |

### Redirects

| Von | Nach | Typ |
|-----|------|-----|
| `/services` | `/diagnostics` | 301 (React `Navigate replace`) |
| `/services/:slug` | `/diagnostics/:slug` | 301 (React `Navigate replace`) |

### Deaktivierte Routen (auskommentiert)

- `/shop` → `ShopPage`
- `/shop/:slug` → `ProductPage`
- `/casestudys/32reasons` → `CaseStudy32Reasons`

### Routing-Architektur (Dual-App-Pattern)

- **Server nutzt:** `src/App.tsx` (eager imports, `StaticRouter`)
- **Client nutzt:** `src/App.lazy.tsx` (lazy imports, `BrowserRouter`)
- Beide definieren **identische Routen**, aber mit unterschiedlicher Loading-Strategie
- Router-Version: **React Router v7** (`react-router-dom@^7.9.6`)

---

## 4. Express-Server Routing

### SSR-Handler (server.ts)

```typescript
// Express 5 Wildcard Syntax - fängt ALLE GET-Requests
app.get('/{*path}', async (req, res, next) => { ... })
```

### Spracherkennung auf dem Server

```typescript
function detectLanguage(req: Request): string {
  // 1. URL-Prefix prüfen (z.B. /en/about)
  const urlMatch = req.url.match(/^\/([a-z]{2})(\/|$)/)
  // 2. Accept-Language Header parsen
  // 3. Fallback: 'de'
}
```

**Wichtig:** Der Server erkennt bereits URL-Präfixe (`/en/about`), aber:
- Er **strippt das Präfix nicht** bevor er die URL an React Router weitergibt
- React Router kennt keine `/:lang/`-Routen
- Resultat: `/en/about` würde aktuell die **404-Seite** anzeigen

### Middleware-Stack (Reihenfolge)

1. Vite Middleware (nur Dev)
2. Static Assets (`/assets/` mit 1y Cache, `dist/client/` mit 1h Cache)
3. Security Headers
4. API Proxy (`/api` → Backend auf Port 5000)
5. SSR Catch-All Handler
6. Error Handler

### SSR-Rendering-Prozess

```
Request → detectLanguage(req) → render(url, lang) → Template-Injection
```

- `render()` erstellt eine **neue i18n-Instanz pro Request** (Race-Condition-safe)
- HTML-Template wird mit SSR-Output, Helmet-Tags und `<html lang="${lang}">` befüllt
- Translations werden serverseitig via Filesystem geladen (mit In-Memory-Cache)

---

## 5. Sprache → SSR Übergabe

### Aktueller Datenfluss

```
Browser Request
  ↓
server.ts: detectLanguage(req) → lang
  ↓
entry-server.tsx: render(url, lang)
  ↓
i18n.server.ts: createI18nInstance(lang) → neue i18next-Instanz
  ↓
React SSR: <I18nextProvider i18n={instance}> → <StaticRouter location={url}>
  ↓
Helmet: <html lang="${lang}"> + SEO Meta-Tags
```

### Schwachstellen

1. **URL bleibt unverändert** - die erkannte Sprache fließt in das HTML, aber die URL spiegelt sie nicht wider
2. **Kein URL-Stripping** - wenn `/en/about` kommt, wird genau `/en/about` an `StaticRouter` übergeben → 404
3. **Client-Hydration-Mismatch** - Server rendert mit erkannter Sprache, Client kann bei Hydration eine andere Sprache erkennen (localStorage vs. Accept-Language)

---

## 6. Aktuelle Sitemap-Struktur

### Datei: `public/sitemap.xml`

- **29 URLs** (alle ohne Sprach-Präfix)
- **Domain:** `https://polarisdx.net`
- **Kein `<xhtml:link rel="alternate" hreflang="...">`**
- **Keine Sprachversionen** enthalten

### SEO-Head-Komponente (`src/components/seo/SEOHead.tsx`)

Die Komponente **unterstützt** `alternateLanguages` und `hreflang`:

```tsx
interface SEOHeadProps {
  alternateLanguages?: Array<{ lang: string; url: string }>;
}

// Rendert:
// <link rel="alternate" hrefLang={lang} href={url} />
// <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
```

**ABER:** Die `alternateLanguages`-Prop wird auf **keiner einzigen Seite** verwendet.
→ Kein Hreflang-Output, Google sieht keine Sprachalternativen.

### Canonical-URLs

Alle Seiten setzen **hardcoded** Canonical-URLs ohne Sprach-Präfix:

```tsx
// Beispiel aus HomePage:
canonical="https://polarisdx.net/"

// Beispiel aus AboutPage:
canonical="https://polarisdx.net/about"
```

---

## 7. Geschätzte Komplexität der Migration

### Gesamtbewertung: **MITTEL** (mit einigen hohen Einzelrisiken)

### Aufschlüsselung nach Bereich

| Bereich | Komplexität | Begründung |
|---------|-------------|------------|
| **Express Server** | Niedrig | `detectLanguage()` existiert bereits, URL-Stripping hinzufügen |
| **React Router** | Mittel | Optional-Param `/:lang?/` Pattern oder verschachteltes Routing |
| **App.tsx + App.lazy.tsx** | Mittel | Beide Dateien müssen synchron angepasst werden |
| **LanguageSwitcher** | Niedrig | `changeLanguage()` → `navigate()` mit URL-Prefix |
| **SEOHead + Canonicals** | Mittel | 15 Seiten mit hardcoded Canonicals, alle brauchen dynamische URLs |
| **Hreflang-Tags** | Mittel | Pro Seite 10 Alternate-Links generieren, `alternateLanguages` befüllen |
| **Sitemap** | Hoch | Von 29 auf ~290 URLs (29 × 10), plus `xhtml:link` Alternates pro URL |
| **Client-Hydration** | Mittel | URL-Sprache muss i18n-Sprache bei Hydration matchen |
| **Interne Links** | Mittel-Hoch | Alle `<Link to="...">` und `navigate()` brauchen Sprach-Prefix |
| **301 Redirects** | Niedrig | `/services` → `/diagnostics` Redirects anpassen |
| **Testing** | Hoch | 10 Sprachen × 15+ Seiten = 150+ URL-Kombinationen |

---

## 8. Potenzielle Breaking Changes und Risiken

### Kritisch

1. **Bestehende Google-Rankings**
   - Alle aktuellen URLs (`/about`, `/diagnostics`, etc.) sind von Google indexiert
   - Migration erfordert 301-Redirects: `/about` → `/about` (Deutsch ohne Prefix) + hreflang
   - Ohne korrekte Redirects: **Ranking-Verlust**

2. **Hydration Mismatches**
   - Server rendert basierend auf URL-Prefix-Sprache
   - Client muss bei Hydration **exakt** dieselbe Sprache verwenden
   - `i18next-browser-languagedetector` darf die URL-Sprache nicht mit localStorage überschreiben
   - **Lösung:** URL-Detection muss höchste Priorität haben (`order: ['path', ...]`)

3. **Dual-App-Pattern (App.tsx + App.lazy.tsx)**
   - Jede Routen-Änderung muss in **beiden Dateien** synchron erfolgen
   - Vergessen einer Datei → Hydration Mismatch oder 404 auf Server/Client

### Hoch

4. **Hardcoded interne Links**
   - Alle `<Link to="/about">` in Navigations-Komponenten, Footer, etc. brauchen den Sprach-Prefix
   - `Footer.tsx`, `Header.tsx`, und Content-Komponenten durchsuchen
   - **Empfehlung:** Utility-Funktion `localizedPath(path, lang)` oder Custom `<LocalizedLink>`

5. **Hardcoded Canonical-URLs**
   - 15 Seiten haben `canonical="https://polarisdx.net/..."` als String
   - Müssen dynamisch werden: `canonical={buildCanonical(lang, path)}`

6. **Slug-basierte Routen und Sprachabhängigkeit**
   - `/articles/:slug` - Sind Slugs sprachabhängig? (z.B. "die-gruene-praxis" vs. "the-green-practice")
   - `/diagnostics/:slug` - Deutsche Slugs ("poc-systemloesungen") funktionieren in allen Sprachen?
   - **Entscheidung nötig:** Gleiche Slugs für alle Sprachen vs. übersetzte Slugs

### Mittel

7. **Default-Sprache (DE) ohne Prefix**
   - `/about` = Deutsch, `/en/about` = English
   - Server muss unterscheiden: `/about` (Deutsch) vs. `/en/about` (Englisch) vs. `/de/about` (Redirect zu `/about`?)
   - **Entscheidung nötig:** Soll `/de/about` existieren oder auf `/about` redirecten?

8. **API-Proxy-Konflikt**
   - `/api` ist als Proxy konfiguriert
   - URL-Pattern `/xx/...` darf nicht mit 2-Buchstaben-Pfaden kollidieren
   - Beispiel: `/it/contact` → `/it/` wird als Sprache erkannt, kein Konflikt mit `/api`

9. **Static Assets unter Sprach-Pfad**
   - Anfragen wie `/en/assets/logo.png` oder `/en/locales/en/common.json` müssen korrekt behandelt werden
   - Static-Middleware muss **vor** dem Sprach-Prefix-Stripping greifen

10. **Sitemap-Generierung**
    - Statische `sitemap.xml` muss durch dynamische Generierung ersetzt werden
    - Oder: Sitemap-Index mit sprach-spezifischen Sub-Sitemaps
    - Jede URL braucht `<xhtml:link>` Alternates für alle 10 Sprachen

### Niedrig

11. **Cookie/localStorage Sync**
    - Bei URL-basierter Sprache sollte `localStorage`/`cookie` synchronisiert werden
    - Sonst: User wechselt via URL zu `/en/about`, localStorage sagt noch `de`

12. **robots.txt**
    - Muss den Sitemap-Pfad referenzieren, keine sprachspezifischen Änderungen nötig

---

## Empfohlene Migrations-Strategie (Übersicht)

### Phase 1: Server-seitiges URL-Routing

1. URL-Prefix-Stripping im Express-Server (`/en/about` → render mit URL `/about`, lang `en`)
2. React Router erhält **immer** die URL ohne Prefix
3. Sprache wird ausschließlich aus URL abgeleitet (kein Accept-Language Fallback für indexierte Seiten)

### Phase 2: Client-seitiges Routing

1. `BrowserRouter` mit `basename` oder Custom Router Logic
2. `LanguageSwitcher` navigiert zu neuer URL statt nur `changeLanguage()`
3. Alle internen `<Link>`-Komponenten verwenden Sprach-Prefix

### Phase 3: SEO

1. Dynamische Canonical-URLs mit Sprach-Prefix
2. Hreflang-Tags auf allen Seiten (nutze bestehende `alternateLanguages`-Prop)
3. Neue Sitemap mit allen Sprachversionen + `xhtml:link` Alternates
4. 301-Redirects für Google Search Console (alte URLs → neue URLs)

### Phase 4: Testing & Rollout

1. SSR-Output für alle Sprachen × Routen testen
2. Hydration-Mismatches prüfen
3. Google Search Console überwachen nach Go-Live

---

## Anhang: Dateien die geändert werden müssen

| Datei | Änderungsart |
|-------|-------------|
| `server.ts` | URL-Prefix-Stripping, Language-from-URL Logic |
| `src/entry-server.tsx` | URL ohne Prefix an StaticRouter übergeben |
| `src/entry-client.tsx` | BrowserRouter mit Sprach-Awareness |
| `src/i18n.client.ts` | URL-Path als primäre Detection-Quelle |
| `src/App.tsx` | Routen ggf. unter `/:lang?/` verschachteln |
| `src/App.lazy.tsx` | Identische Routen-Änderungen |
| `src/components/ui/LanguageSwitcher.tsx` | Navigate statt nur changeLanguage |
| `src/components/seo/SEOHead.tsx` | Dynamische Canonicals + Hreflang auto-generation |
| `src/routes/HomePage.tsx` | Canonical dynamisch |
| `src/routes/AboutPage.tsx` | Canonical dynamisch |
| `src/routes/ArticlesIndexPage.tsx` | Canonical dynamisch |
| `src/routes/ArticlePage.tsx` | Canonical dynamisch |
| `src/routes/ServicesOverviewPage.tsx` | Canonical dynamisch |
| `src/routes/ServicePage.tsx` | Canonical dynamisch |
| `src/routes/ContactPage.tsx` | Canonical dynamisch |
| `src/routes/DownloadsPage.tsx` | Canonical dynamisch |
| `src/routes/PrivacyPage.tsx` | Canonical dynamisch |
| `src/routes/ImprintPage.tsx` | Canonical dynamisch |
| `src/routes/TermsPage.tsx` | Canonical dynamisch |
| `src/pages/EventsPage.tsx` | Canonical dynamisch |
| `src/pages/IglooProPage.tsx` | Canonical dynamisch |
| `src/pages/VitaminD3ImplantologyPage.tsx` | Canonical dynamisch |
| `src/components/layout/Header.tsx` | Links mit Sprach-Prefix |
| `src/components/layout/Footer.tsx` | Links mit Sprach-Prefix |
| `public/sitemap.xml` | Durch dynamische Generierung ersetzen |
| `vite.config.ts` | Ggf. SSR-Anpassungen |
