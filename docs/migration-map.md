# PolarisDX Preview — Migrations-Inventar (Routen × Template × Status)

> Alle Routen aus `src/App.tsx`. Status je Seite: **MIGRIERT** (Sales-Machine fertig) /
> **TEILWEISE** (einzelne neue Bausteine, aber ALT-Hero/CTAs) / **ALT**. Template-Typen T1–T8.
> Pfade relativ zu `src/`. Zeilenangaben aus dem Analyse-Stand (Branch `feat/home-leadmagnet`).

## Erkennungs-Marker (aus den Referenz-Seiten)
- **NEU:** Hero-Container `bg-brand-deep` **solide** (kein `bg-gradient-to-br … to-gray-900`, kein
  `bg-noise`), 2-Spalten-Grid mit Reader-/Geräte-Visual, Teal (`stroke-accent`/`text-accent`/`bg-accent`),
  Kennzahl-Chips `bg-white/10 ring-white/15`, Primär-CTA teal (`Button variant="secondary" + !bg-accent`),
  `Breadcrumbs`, `Eyebrow`.
- **ALT:** `bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900` + `bg-noise`, rechte
  Widget-Sidebar, `Button` default `variant="primary"` (Gradient-Hack), `text-accentBlue`-Kicker statt
  `Eyebrow`, Inline-`<nav>`-Breadcrumb statt `Breadcrumbs`.

---

## Routen-Tabelle

| Route | Datei (`src/`) | Status | Template | Belege (neu vs. alt) | Fehlt für Migration |
|---|---|---|---|---|---|
| `/` | `pages/HomePage.tsx` | **MIGRIERT** (Referenz) | Home | `HeroSection`, `TrustBar`, `WhyPocSection`, `RoiCalculatorSection`, `FAQSection`, `FinalCtaSection` (teal) | — |
| `/igloo-pro` | `pages/IglooProPage.tsx` | **MIGRIERT** (Referenz) | Produkt | `IglooProHero`, `IglooFeaturesSection`, `IglooSpecsSection`, `IglooParametersSection`, `IglooProductFinalCta`; `bg-accent`-Hilfe-Kachel | — (nur CV-Wert klären → G5) |
| `/diagnostics` | `pages/ServicesOverviewPage.tsx` | **MIGRIERT** (Referenz) | Diagnostik-Übersicht | `DiagnosticsHero` (navy + `stroke-accent`-Gauge + Chips), `DiagnosticsFocusSection`, `FinalCtaSection` | — |
| `/diagnostics/:slug` (×9) | `pages/ServicePage.tsx` | **ALT** | **T1** | Hero `bg-gradient-to-br … to-gray-900` + `bg-noise` (`:165`); Widget-Sidebar (`:289–362`); `Button variant="primary"` (`:268`) | Navy-Flat-Hero, `Eyebrow`, Teal-CTA, Sidebar-Boxen entfernen/ersetzen |
| `/contact` | `pages/ContactPage.tsx` | **TEILWEISE** ⏳ (uncommitted) | Kontakt | Hero `bg-brand-primary` solide + Proof-Chips (`:37–64`), `fill-accent` Star (`:94`); **kein** `Eyebrow`, keine Stat-Zeile, kein Visual | Eyebrow, Stat-Row/Reader-Visual, `bg-brand-deep` statt `-primary`; Multi-Intent-Form fertigstellen |
| `/support` | `pages/SupportPage.tsx` | **ALT** | **T5** | Hero `bg-brand-primary` solide, `text-accentBlue`-Kicker (`:49`); Sidebar „Hilfreiche Links" (`:120–144`) | `Eyebrow`/`SubpageHero`, Teal-Akzente, Sidebar-Redesign |
| `/about` | `pages/AboutPage.tsx` | **TEILWEISE** | **T4** | `Eyebrow` (`:49`) ✅, **aber** ALT-Gradient-Hero + `bg-noise` (`:35`), alte `Button`-Gradient-CTAs (`:98–103`); `TeamSection` | Navy-Flat-Hero, Teal-CTAs; Tim-Ritson-Platzhalter (→ G6) |
| `/events` | `pages/EventsPage.tsx` | **TEILWEISE** | **T6** | `Eyebrow` (`:105`) ✅, **aber** ALT-Gradient-Hero + `bg-noise` (`:90`); Timeline mit Gradient-Dots/Accent-Bars (`:157–186`) | Navy-Flat-Hero; Timeline flach/teal |
| `/articles` | `pages/ArticlesIndexPage.tsx` | **ALT** | **T2** | ALT-Gradient-Hero + `bg-noise` (`:40`); `text-accentBlue`-Featured-Kicker; **kein** Eyebrow; `BlogCard` | Navy-Flat-Hero, `Eyebrow`, Karten mit teal-tint Icon-Tiles |
| `/articles/:slug` | `pages/ArticlePage.tsx` | **ALT** | **T2** | ALT-Gradient-Hero (`:243`); Widget-Sidebar (`:384–454`); datengetrieben via `hooks/useArticles` | Navy-Flat-Hero, Sidebar-Modul, Teal-CTA statt `Button` |
| `/vitamin-d3-implantologie` | `pages/VitaminD3ImplantologyPage.tsx` | **TEILWEISE/ALT** | **T3** | `Eyebrow` (`:136`) + flache Karten, **aber** ALT-Gradient-Hero + `bg-noise` (`:114`); Inline-`<nav>`-Breadcrumb (`:123`); Sidebar + Gradient-Quick-Order (`:673`); CTAs `bg-brand-primary` (navy, nicht teal) | Navy-Flat-Hero, `Breadcrumbs`, Teal-CTAs, Order-Form + Sidebar als Shared |
| `/vitamin-d3-spray` | `pages/VitaminD3SprayPage.tsx` | **TEILWEISE/ALT** | **T3** | `Eyebrow` (`:98`); ALT-Gradient-Hero (`:80`); Hero-CTA `bg-brand-secondary` (`:113`); Gradient-Quick-Order (`:577`); i18n-NS `vitd3spray` | wie T3; Teal-Vereinheitlichung der CTAs |
| `/s3_leitlinie` | `pages/S3LeitliniePage.tsx` | **TEILWEISE/ALT** | **T7/T3** | `Eyebrow` (`:184`); ALT-Gradient-Hero (`:162`); Inline-Breadcrumb (`:171`); Gradient-CTA-Box (`:802`) + Sidebar | Navy-Flat-Hero, `Breadcrumbs`, `FinalCtaSection` statt Gradient-CTA |
| `/downloads` | `pages/DownloadsPage.tsx` | **ALT** | **T7** | Hero `bg-brand-primary` solide, `text-accentBlue`-Kicker (`:133`); Karten mit `blue-600` statt teal (`:62–65`) | `Eyebrow`, teal Icon-Tiles, `bg-brand-deep` |
| `/imprint` | `pages/ImprintPage.tsx` | **ALT/neutral** | **T7** | **Kein Hero**: `pt-32 bg-slate-50` + weiße Card (`:43–50`); `text-brand-secondary`-Links | Salesmachine-Header/Breadcrumb-Rahmen (`LegalLayout`) |
| `/privacy` | `pages/PrivacyPage.tsx` | **ALT/neutral** | **T7** | wie Imprint: `pt-32 bg-slate-50` + Card (`:19–26`), kein Hero/Breadcrumb | `LegalLayout` |
| `/terms` | `pages/TermsPage.tsx` | **ALT/neutral** | **T7** | gleiche Legal-Vorlage (`legal`-NS, bare Card, kein Hero) | `LegalLayout` |
| `*` (404) | `pages/NotFoundPage.tsx` | **ALT** | **T7** | Vollflächen-Gradient `from-brand-primary via-brand-deep to-gray-900` + `bg-noise` (`:29`); Gradient-Text-„404" | Navy-Flat + Teal-Akzente |
| `/services`, `/services/:slug` | — | **Redirect** | — | `Navigate` → `/diagnostics(/:slug)` (`App.tsx:299–300`) | — |
| `/consumer/vitamin-d3-spray` | `pages/consumer/SprayPage.tsx` | **N/A — eigenes System** | **T8** | Eigenes helles Consumer-Designsystem (`consumer/shell.tsx`, `teal-600`-CTAs, `bg-brand-deep`-Header); bewusst NICHT B2B-Shell | **Kein** Teil des B2B-Salesmachine-Scopes — separater Track |
| `/consumer/hydrating-masks` | `pages/consumer/MaskPage.tsx` | **N/A — eigenes System** | **T8** | via `consumer/shell.tsx` | separater Track |
| `/consumer/inside-out-duo` | `pages/consumer/DuoPage.tsx` | **N/A — eigenes System** | **T8** | via `consumer/shell.tsx` | separater Track (Duo hat offenes Meta-TODO, `DuoPage.tsx:59`) |

**Zusammenfassung Status:** 3 MIGRIERT (Referenz) · 1 TEILWEISE in Arbeit (Contact) · 5 TEILWEISE
(About, Events, D3-Implantologie, D3-Spray, S3) · 8 ALT (ServicePage/×9, Articles-Index, Article-Detail,
Support, Downloads, Imprint, Privacy, Terms, 404) · 3 N/A Consumer.

---

## T1 im Detail — wie eine `ServicePage` die 9 Slugs rendert
- **Eine** Komponente für alle 9. `services.find(s => s.id === slug)` gegen `data/services.tsx`.
- Slug-IDs: `dental`, `beauty`, `longevity`, `poc-systemloesungen`, `praeventions-checks`,
  `infektion-entzuendung`, `stoffwechsel-herz`, `hormon-tests`, `kompatibilitaet-integration`.
- Textinhalte via i18n `services:{translationKey}.{title|headline|intro|sections|conclusion|cta|faq}`.
- **Sonderfall `dental`:** zusätzlich `richContent` (HTML-Pillar-Page via `dangerouslySetInnerHTML`,
  gestylt über `.rich-content`). Die übrigen 8 nutzen den strukturierten `intro/sections/conclusion`-Pfad.
- SEO-Overrides (`serviceSeoOverrides`, `ServicePage.tsx:68`) nur für 4 Slugs (dental/beauty/longevity/
  poc-systemloesungen); Rest → generierte Titel.
- **Konsequenz:** T1-Migration = **genau eine** `ServicePage` + `data/services.tsx` umbauen → alle 9
  Unterseiten migrieren gleichzeitig. Ideal für den Referenz-Slice.

---

## Fehlende / neu zu erstellende SHARED Components (nach Template)

- **Querschnitt — `SubpageHero` / `PageHero` (NEU, höchster Hebel):** generischer Navy-Flat-Hero
  (`bg-brand-deep` + `Eyebrow`/Breadcrumb + optionale Chips + optionales Visual). `DiagnosticsHero` ist
  auf die Übersicht hartcodiert und nicht wiederverwendbar. Deckt T1, T4, T5, T6, T7 ab.
- **T1 — `SubpageLayout` (NEU):** ersetzt die rechte Widget-Sidebar durch flache Content-Sektionen.
- **T2 — `ArticleLayout` (NEU, 2-Spalten) + EIN Sidebar-Modul:** `ServicePage`, `ArticlePage`,
  `ArticlesIndexPage` bauen dieselben Boxen jeweils von Hand. Extrahieren zu
  `RelatedServicesWidget` + `RelatedArticlesWidget` + `ContactCard` (→ G3). `Breadcrumbs.tsx` existiert —
  konsequent einsetzen (Pillar-Pages nutzen noch Inline-`<nav>`).
- **T3 — `PraxisOrderForm` (NEU):** Bestellformular ist dupliziert
  (`VitaminD3ImplantologyPage.tsx:449` ≈ `VitaminD3SprayPage.tsx:347`, inkl. `sendContactEmail`-Logik).
  Ggf. `StickyOrderCard`/`StickyBookingBar` (Designkey „Sticky-Buchungskarte") als Shared.
- **T4/T5/T6:** brauchen `SubpageHero`; About von alter `Button`-Gradient-Variante auf Teal-CTA
  (`FinalCtaSection`-Muster) umstellen; Support braucht überhaupt erst `Eyebrow`/Teal.
- **T7 — `LegalLayout` (NEU):** Imprint/Privacy/Terms haben **keinen** Hero/Breadcrumb (bare Card).
  Downloads/404 brauchen Navy-Flat-Hero + Teal statt `blue-600`/`accentBlue`.
- **Optional `Button`-`accent`-Variante (NEU, additiv):** kanonisiert das `!bg-accent`-Override (→ D2).
- **T8 Consumer:** eigenes System (`consumer/shell.tsx`) — **kein** Migrationsbedarf, nur zur Abgrenzung.

**Vorschlag Referenz-Slice-Reihenfolge (deckt die meisten Seiten mit den wenigsten neuen Bausteinen):**
`SubpageHero` + Sidebar-Modul zuerst bauen → dann **T1** (`ServicePage`, migriert 9 Seiten auf einmal) →
**T2** (`ArticleLayout`) → **T3** (`PraxisOrderForm`) → **T4/T5** → **T7** (`LegalLayout`).
