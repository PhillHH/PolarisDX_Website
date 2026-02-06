# SEO Infrastructure Analysis — Status Quo

**Datum:** 2026-02-06
**Zweck:** Grundlage für hreflang-Implementation und dynamische Sitemap-Generierung

---

## 1. Canonical URLs — hardcoded, nicht dynamisch

### Fallback-Logik in SEOHead.tsx

```tsx
// SEOHead.tsx:109
const canonicalUrl = canonical || `${BASE_URL}${location.pathname}`;
```

Der Fallback (`location.pathname`) würde den Sprach-Prefix enthalten (z.B. `/en/about`),
wird aber **nie genutzt**, weil alle Seiten `canonical` explizit setzen.

### Alle Seiten mit hardcoded Canonical

| Seite | Canonical |
|---|---|
| HomePage | `https://polarisdx.net/` |
| IglooProPage | `https://polarisdx.net/igloo-pro` |
| ServicePage | `https://polarisdx.net/diagnostics/${slug}` |
| ArticlePage | `https://polarisdx.net/articles/${slug}` |
| ContactPage | `https://polarisdx.net/contact` |
| AboutPage | `https://polarisdx.net/about` |
| EventsPage | `https://polarisdx.net/events` |
| DownloadsPage | `https://polarisdx.net/downloads` |
| PrivacyPage | `https://polarisdx.net/privacy` |
| ImprintPage | `https://polarisdx.net/imprint` |
| TermsPage | `https://polarisdx.net/terms` |
| ArticlesIndex | `https://polarisdx.net/articles` |
| ServicesOverview | `https://polarisdx.net/diagnostics` |
| VitaminD3Page | `https://polarisdx.net/vitamin-d3-implantologie` |
| CaseStudy | `https://polarisdx.net/case-studies/32reasons` |

**Problem:** Alle Canonicals zeigen auf URLs ohne Sprach-Prefix. Diese URLs
werden per 301 auf `/de/...` redirected (server.ts:211). Canonicals zeigen
damit auf Redirect-URLs statt auf finale URLs.

**NotFoundPage:** Einzige Seite ohne explizites `canonical` (nutzt Fallback + `noindex`).

---

## 2. alternateLanguages Prop — Interface vorhanden, nie genutzt

### Interface (SEOHead.tsx:38-41)

```tsx
alternateLanguages?: Array<{
  lang: string;   // z.B. "en", "de"
  url: string;    // z.B. "https://polarisdx.net/en/about"
}>;
```

### Rendering wenn gesetzt (SEOHead.tsx:209-217)

- Je ein `<link rel="alternate" hrefLang="{lang}" href="{url}" />` pro Sprache
- Ein `<link rel="alternate" hrefLang="x-default" href="{canonicalUrl}" />`

### Aktuelle Nutzung

**0 Seiten** übergeben `alternateLanguages`. Die Prop existiert nur in SEOHead.tsx
selbst (Interface, Destructuring, Render-Block).

**Bereits vorhanden:** OG-Locale-Alternates werden automatisch gerendert
(SEOHead.tsx:146-154) über `LOCALE_MAP` — aber als `og:locale:alternate`,
nicht als hreflang `<link>`.

---

## 3. Canonical-Setzung: 100% manuell

- **Statische Seiten (12):** Canonical als String-Literal
- **Dynamische Seiten (2):** ServicePage und ArticlePage mit Template Literals + `slug`
- **NotFoundPage:** Kein canonical (Fallback + `noindex`)

---

## 4. Aktuelle Sitemap

- **Datei:** `public/sitemap.xml` (statisch)
- **Format:** XML Sitemap (sitemaps.org/schemas/sitemap/0.9)
- **URLs:** 29 (+ 1 auskommentiert)
- **`<lastmod>`:** Nicht vorhanden
- **Sprach-Prefixe:** Keine
- **hreflang:** Nicht vorhanden (kein xhtml:link Namespace)
- **Veralteter Kommentar:** "No language-prefixed URLs as i18n uses client-side switching only"

### URL-Verteilung nach Priority

| Priority | Anzahl | Beispiele |
|---|---|---|
| 1.0 | 2 | Homepage, Igloo Pro |
| 0.9 | 1 | Diagnostics Overview |
| 0.8 | 10 | Services, About, Contact |
| 0.7 | 2 | Articles Index, Vitamin D3 |
| 0.6 | 8 | Articles, Events, Downloads |
| 0.4 | 3 | Privacy, Imprint, Terms |

### Diskrepanz: Sitemap vs. Prerender-Script

| Sitemap (kebab-case) | Prerender (snake_case) |
|---|---|
| `die-gruene-praxis` | `green_practice` |
| `der-unsichtbare-patient` | `invisible_patient` |
| `die-5-minuten-diagnose` | `five_minute_diagnosis` |

---

## 5. Sitemap-Generator: Keiner vorhanden

- `scripts/prerender.mjs` generiert nur vorgerenderte HTML, keine Sitemap
- Kein `generate-sitemap`-Script vorhanden
- Sitemap ist handgepflegte XML-Datei
- Bei 10 Sprachen × 29 Seiten = ~290 URLs nicht manuell wartbar

---

## 6. Server-Endpoint für /sitemap.xml: Keiner

- `isStaticAsset()` in server.ts erkennt `.xml` → verhindert Sprach-Redirect
- Production: `express.static('dist/client')` serviert statisch
- Development: Vite Middleware serviert aus `public/`
- Kein dynamischer Endpoint

---

## Handlungsfelder

| Thema | Ist | Soll |
|---|---|---|
| Canonicals | Hardcoded ohne Sprach-Prefix (→ 301-Redirect) | Dynamisch mit Sprach-Prefix |
| hreflang | Prop vorhanden, nie genutzt | Automatisch 10 Sprachen + x-default |
| Sitemap URLs | 29 URLs, keine Sprache, kein lastmod | ~290 URLs mit Sprache und lastmod |
| Sitemap Format | Statische XML in `public/` | Dynamischer Endpoint oder Build-Script |
| Slug-Diskrepanz | Sitemap vs. Prerender: unterschiedliche Formate | Vereinheitlichen |
