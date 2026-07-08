# PolarisDX Preview — Design-System (Ist-Zustand)

> **Zweck:** Das ECHTE, bereits im Preview-Repo implementierte „Sales-Machine"-Design-System —
> extrahiert aus den migrierten Seiten (Home `/`, IglooPro `/igloo-pro`, Diagnostik-Übersicht
> `/diagnostics`, Kontakt `/contact` [in Arbeit], Events `/events`). Dies ist die **autoritative
> Bau-Referenz** für Phase 2. Wo die vorgegebenen Designkeys von diesem Ist-Zustand abweichen,
> **gewinnt das Repo** (siehe Abschnitt „Divergenzen").
>
> **Repo / Umgebung (verifiziert):**
> - Verzeichnis: `/home/phillip/01polaris-preview` (phillip-server) — **NICHT** `/home/phillip/01polaris`.
> - Branch: **`feat/home-leadmagnet`** (= der `<PREVIEW-BRANCH>` aus den Guardrails).
> - Stack: **Vite + React 19 + react-router-dom, SSR via `tsx server.ts`**. Kein Next.js.
> - Preview läuft als **bare Node-Prozess auf `127.0.0.1:9100`** (nvm node v20, `tsx server.ts`),
>   nginx `preview.polarisdx.net` → 9100. **Nicht** der Container `01polaris-frontend-1` (Port 2026).
> - i18n: `react-i18next`, 10 Locales unter `public/locales/<lng>/<ns>.json`.
> - Uncommitted (Stand Analyse): `ContactPage.tsx`, `ContactForm.tsx`, `useContactForm.ts`,
>   `src/api/contact.ts`, `server.ts`, `locales/{de,en}/contact.json` — Kontakt-Slice läuft gerade.

---

## 1. Farbtokens — real (aus `tailwind.config.js`)

Tailwind-`theme.extend.colors`. **Exakte Klassennamen** in der linken Spalte.

| Token / Klasse | Hex | Verwendung im Repo |
|---|---|---|
| `brand-deep` / `brand-navy` | `#083358` | **Kanonisches Navy.** Hero-Flächen, Final-CTA, dunkle Bänder (`bg-brand-deep`). Beide Klassen identischer Hex. |
| `brand-primary` / `blue` / `accentBlue` | `#0d527f` | Mittelblau. **Footer-Fläche** (`bg-brand-primary`), Links in `rich-content`, Header-Submenu-Hover. |
| `brand-secondary` / `blue-bright` | `#2f6fa0` | Helles Blau. Gradient-Start (Button-Primary, Eyebrow-Rand), Footer-Link-Hover (`hover:text-brand-secondary`). |
| `brand-navy-hover` / `brand-navy-mid` | `#0a3f63` | CTA-Hover-Navy / theme-color + OG. |
| `text-heading` | `#083358` | **Überschriften-Ink.** Klasse `text-heading` = brand-deep (siehe Divergenz D1). |
| `gray-900` (Legacy) | `#203864` | Legacy-„Navy". `:root`-Textfarbe, `Eyebrow`-Caption, `SectionHeader`-H2, globaler `a`. **NICHT** identisch mit `text-heading`. |
| `accent` (DEFAULT) | `#0d9488` (teal-600) | **Akzent / Primär-CTA / Icon-Tiles / Links auf hell.** `bg-accent`, `text-accent`. |
| `accent-strong` | `#0f766e` (teal-700) | Eyebrow-Text-Emphasis, CTA-Hover (`hover:bg-accent-strong`, `hover:text-accent-strong`). |
| `accent-line` | `#14b8a6` (teal-500) | Deko-Linien, Check-Icons in Chips (`text-accent-line`). |
| `accent-soft` | `#f0fdfa` (teal-50) | weiche Tints / Pill-BG. |
| `accent-border` | `#99f6e4` (teal-200) | Pill-Ränder. |
| `accent-on-dark` | `#5eead4` (teal-300) | Akzent-Hover auf dem dunklen Header. |
| `success` / `success-soft` / `success-strong` | `#10b981` / `#ecfdf5` / `#059669` | **Separater** Health/Erfolg-Scale (S3-Leitlinie, D3-Implantologie) — bewusst getrennt vom Akzent. |
| `ui-border` / `ui-border-hover` / `ui-text-muted` | `#e2e8f0` / `#cbd5e1` / `#94a3b8` | slate-200/300/400 als UI-Grau. |
| `gray-100` / `gray-500` | `#F5F5F5` / `#868C98` | Legacy-Flat-Grau; `gray-500`/`#868c98` ist `rich-content`-Body. |
| `social-linkedin` | `#0077b5` | Social-Icon. |

**Nicht-Token-Grautöne, die in migrierten Seiten real genutzt werden:** Body-Text läuft überwiegend
über **Tailwind-Default `text-gray-700` (#374151)** und `text-white/80` auf Navy — **nicht** über einen
Brand-Body-Token. Section-Hintergründe: `bg-slate-50` (section-soft), `bg-white`, `bg-brand-deep`.

### Weitere Design-Tokens (`tailwind.config.js`)
- `fontFamily.sans`: `Inter Variable, Inter, system-ui, sans-serif`.
- `maxWidth.container = 1200px` (Haupt-Containerbreite: `max-w-container`), `maxWidth.page = 1440px`.
- `fontSize`: `xxs 10px`, `hero-sm 40px`, `hero-md 48px`, `hero-lg 58px`.
- `boxShadow.card = 0 24px 60px rgba(8,51,88,.12)` (Karten-Hover: `hover:shadow-card`), `.glass`, `.glow-secondary`.
- `borderRadius.section = 24px`.
- Keyframes/Animationen: `fade-in-scale`, `slide-in-up/-out-up`, `slide-in-right/-out-left`,
  `icon-in/-out`, `modal-backdrop-in`, `modal-card-in`, `popover-in` (Modal/Order-Motion).
- `@layer components` in `src/index.css`: `.glass-panel`, `.glass-panel-dark`, `.bg-noise`, **`.rich-content`**
  (kompletter Prosa-Stil für Pillar-Pages: h2/h3 `#083358`, Links `#0d527f`, Tabellen, Info-Box, `.cta-block`
  mit `linear-gradient(135deg,#0d527f,#083358)`).

---

## 2. Typografie (real)
- **Font:** Inter (Variable), gewichte 400/500/600 (`font-medium`/`font-semibold`).
- **H1** (Navy-Heroes): `text-4xl lg:text-5xl font-medium tracking-tight` (~36–48px).
- **H2** (Sektionen): `SectionHeader` → `text-hero-sm (40px) leading-[47px] lg:text-[44px] lg:leading-[52px]`;
  migrierte Sektionen oft `text-3xl lg:text-[42px] font-medium tracking-tight text-heading`;
  Final-CTA `text-[clamp(28px,5vw,48px)]`.
- **Body:** `text-sm`/`text-base` `leading-relaxed`, Farbe `text-gray-700` bzw. `text-white/80` auf Navy.
- **Eyebrow:** `text-xs`/`text-sm` `font-semibold uppercase tracking-wide` (auf Navy inline:
  `uppercase tracking-[0.18em] text-accent`).

---

## 3. Wiederverwendbare Komponenten (mit Dateipfaden)

### Layout / Shell — `src/components/layout/`
- **`Header.tsx`** — Navy sticky Header, `fixed inset-x-0 top-0 z-30`; transparent oben →
  `bg-brand-navy/85 backdrop-blur-xl` beim Scrollen. Weißes Logo, weiße Nav, Desktop-Dropdown
  (`service` → 4 von 9 Diagnostik-Slugs), Mobile-Menü, `LanguageSwitcher`, `SearchModal`-Trigger.
  ⚠️ CTA nutzt `Button variant={isScrolled ? 'primary' : 'outline'}` → **Gradient/Outline, kein Teal** (siehe D2).
- **`Footer.tsx`** — `bg-brand-primary` (#0d527f) `text-white`, 4 Spalten **Links / Diagnostik / London /
  Hamburg** + Logo/Social + Copyright + Legal-Links + „IglooPro ist ein Produkt der DX365 GmbH".
  ⚠️ Fläche ist `brand-primary`, nicht Navy `brand-deep` (siehe D3).
- **`Layout.tsx`** — Shell-Wrapper (Header + `<main>` + Footer + ScrollToTop). `MainLayout` (in `App.tsx`)
  ergänzt `MobileCallButton`, `ChatWidget`, `<Outlet/>`. Consumer-Seiten (`/consumer/*`) nutzen `Layout` **nicht**.
- **`ScrollToTop.tsx`**, **`analytics/GtmPageview.tsx`** (GA4 SPA page_view).

### UI-Primitive — `src/components/ui/`
- **`Button.tsx`** — CVA, Varianten: `primary` (Gradient brand-secondary→primary→deep, weißer Innen-Layer),
  `secondary` (`bg-brand-deep text-white`), `outline` (weißer Rand, transparent). Größen `default/sm/lg/icon`.
  **Es gibt KEINE gefüllt-Teal-Variante** — migrierte Primär-CTAs entstehen durch
  `variant="secondary"` **+ `!bg-accent !shadow-accent/20 hover:!bg-accent-strong focus-visible:!ring-accent`**
  (siehe D2 — Kandidat für neue `accent`-Variante).
- **`Eyebrow.tsx`** — kanonische Pill: **Gradient-Rand** (`from-brand-secondary via-brand-primary to-brand-deep`)
  + `bg-slate-50` + **`text-gray-900`** (navy) uppercase. Größen `default`/`sm`. **Keine on-dark/weiße Variante**
  (Kommentar im Code bestätigt das) → auf Navy wird Eyebrow als reiner Teal-Text nachgebaut (siehe D4).
- **`SectionHeader.tsx`** — `Eyebrow` + `<h2>` (default `text-gray-900`), `align left|center`.
- **`Breadcrumbs.tsx`** — ✅ existiert, `variant 'light'|'dark'`, `ChevronRight`, klickbare `<Link>`. In
  `DiagnosticsHero` bereits (`variant="dark"`) genutzt. **Wiederverwenden, nicht neu bauen.**
- **`ImagePlaceholder.tsx`** — ✅ intentionaler, sprach-neutraler Platzhalter (`border-dashed bg-slate-100
  border-slate-300 text-slate-400`, `role="img"`, optionales `label`). Für „Anwendungsbild"/„Kundenbild".
- **`Reveal.tsx`** — SSR-sichere Scroll-Reveal (Content immer im DOM, animiert erst nach Hydration via
  IntersectionObserver, Opacity+translateY). ⚠️ **prüft KEIN `prefers-reduced-motion`** (siehe D5).
- **`CookieBanner.tsx`** — `fixed bottom-0 left-0 right-0 z-[70]` (korrekt über Header z-30), GTM-Consent-Mode.
  ⚠️ generische `blue-600/blue-50/gray-900`-Farben statt Brand-Navy/Teal (siehe global-fixes G1).
- Weitere: `ServiceCard.tsx`, `BlogCard.tsx`, `StatItem.tsx`, `Input.tsx`, `Textarea.tsx`, `Alert.tsx`,
  `LanguageSwitcher.tsx`, `FlagIcon.tsx`, `SearchModal.tsx`, `MobileCallButton.tsx`, `ChatWidget.tsx`,
  `LoadingSpinner.tsx`, `PageTransition.tsx`, `icons/Tooth.tsx`.

### Sektions-Bausteine — `src/components/sections/`
Migriert / Sales-Machine (Referenzmuster): `HeroSection`, `DiagnosticsHero`, `DiagnosticsFocusSection`,
`DiagnosticsSpecialtySection`, `FinalCtaSection`, `IglooProHero`, `IglooFeaturesSection`,
`IglooSpecsSection`, `IglooParametersSection`, `IglooProductFinalCta`, `IglooWidgetSection`, `TrustBar`,
`RoiCalculatorSection`, `StepsSection`, `TestimonialsSection`, `ContactForm`, `SupportForm`.
Ältere/gemischte: `AboutSection`, `BlogSection`, `CtaSection`, `DoctorsSection`, `FAQSection`,
`FeaturedCaseStudy`, `ServicesSection`, `TeamSection`, `WhyPocSection` (→ Einordnung: migration-map.md).

---

## 4. Reale Sales-Machine-Muster (Copy-Paste-Referenz)

**Navy-Hero** (`DiagnosticsHero.tsx`, `IglooProHero.tsx`):
```
<section class="relative overflow-hidden bg-brand-deep text-white">
  <div class="mx-auto max-w-container px-4 lg:px-0 pt-24 pb-16 lg:pt-28 grid lg:grid-cols-2 gap-10 items-center">
    <Breadcrumbs variant="dark" .../>
    <h1 class="text-4xl lg:text-5xl font-medium tracking-tight">…</h1>
    <p class="mt-4 max-w-xl text-white/80 leading-relaxed">…</p>
    <!-- Proof-Chips --> <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 ring-1 ring-white/15">…</span>
    <!-- rechts: dekoratives Reader-Visual: SVG-Gauge stroke-accent + schwebende weiße Karten (text-brand-deep, Check text-accent) -->
```

**Content-Karten-Grid** (`DiagnosticsFocusSection.tsx`):
```
<Link class="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-card">
  <span class="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">…icon…</span>
  <h3 class="mt-5 text-lg font-medium text-heading">…</h3>
  <p class="mt-2 text-sm leading-relaxed text-gray-700">…</p>
  <span class="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">…tag…</span>
  <span class="mt-auto pt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:text-accent-strong">… →</span>
```

**Mid-Page-Teal-Band** (`DiagnosticsFocusSection.tsx`):
```
<div class="rounded-2xl bg-accent p-6 lg:p-8 text-white flex ... justify-between">
  … <Link class="rounded-md bg-white px-5 py-3 font-medium text-brand-deep">CTA</Link>
```

**Final-CTA (Navy, einzeln)** (`FinalCtaSection.tsx`):
```
<section class="bg-brand-deep text-white"><div class="… px-4 py-24 lg:py-28 text-center">
  <p class="text-sm font-semibold uppercase tracking-[0.18em] text-accent">EYEBROW</p>
  <h2 class="… text-[clamp(28px,5vw,48px)]">…</h2><p class="… text-white/80">…</p>
  <Button to="/contact" variant="secondary" className="!bg-accent hover:!bg-accent-strong …">Beratung buchen</Button>
  <Button href="#roi-rechner" variant="outline">ROI-Rechner</Button>
  <!-- Friction-Killer-Chips --> <span class="… bg-white/10 … ring-1 ring-white/15"><Check text-accent-line/> Kostenlos & unverbindlich</span>
```
Sektions-Rhythmus: `py-24 lg:py-28`, Container `max-w-container px-4 lg:px-0`, section-soft `bg-slate-50`.

---

## 5. Designkeys — real vorhanden vs. fehlend

| Designkey | Status im Repo |
|---|---|
| EIN Navy (`brand-deep`) für Hero/CTA/dunkle Bänder | ✅ vorhanden (aber Footer nutzt brand-primary → D3) |
| EIN Akzent Teal (`accent`) | ✅ vorhanden, konsistent |
| Eyebrow-Pill | ✅ `Eyebrow.tsx` — aber gradient/slate, nicht teal-tint (D1/D4) |
| Buttons `btn--teal / btn--outline / btn--white` als Klassen | ❌ existieren nicht als CSS-Klassen; via `Button`-Varianten + `!bg-accent`-Override (D2) |
| Navy-Hero + Stat-/Proof-Chips + Geräte-Visual + Live-Wert-Chips | ✅ `DiagnosticsHero`/`IglooProHero` (Puls-Ring nur teilweise) |
| Trust-Bar | ✅ `TrustBar.tsx` |
| Bold-Kacheln (Navy/Teal alternierend) | ✅ teilweise (`DiagnosticsSpecialtySection`) |
| Content-Karten mit Teal-Tint-Icon-Tiles + Chips + „… → " | ✅ `DiagnosticsFocusSection` |
| Performance-Panel (Navy + Geräte-Puck + CV-Chip + 3 Säulen) | ✅ (IglooPro) — CV-Wert prüfen (global-fixes G5) |
| Testimonial (kompakte Navy-Karte, Kundenfoto, Pfeil-/Punkt-Nav) | ✅ `TestimonialsSection.tsx` (Inhalt prüfen — i18n-Leck G4) |
| ROI-Rechner (Eingaben links / Navy-Ergebnis-Karte / Report-Capture) | ✅ `RoiCalculatorSection.tsx` |
| Mid-Page-Teal-CTA-Band | ✅ |
| 3-Schritte-Prozess | ✅ `StepsSection.tsx` |
| Final-CTA (Navy, einzeln, Reassurance-Chips) | ✅ `FinalCtaSection.tsx` |
| Breadcrumbs (klickbar) | ✅ `Breadcrumbs.tsx` |
| Sticky-Buchungskarte/-leiste | ⚠️ nicht als shared Component gefunden (T3-Kandidat) |
| Multi-Intent-Kontakt-Form (Intent-Selektor, Fortschritt, Feld-Häkchen, adaptiver Submit) | ⏳ in Arbeit (`ContactForm.tsx` uncommitted) |
| Motion-Layer (gestaffelte Reveals, Float-Chips, Puls-Ring, Count-up, Hover-Lift) | ⚠️ `Reveal` + Hover-Lift ✅; **kein `prefers-reduced-motion`-Guard** (D5) |
| Farb-Tokens `navy-lift #0f3a61`, `teal-tint #e1f5ee`, `teal-ink #0f6e56`, `on-navy(-muted)`, `body`, `muted`, `placeholder` als benannte Tokens | ❌ existieren nicht (D1) |

---

## 6. DIVERGENZEN — Designkey-Spec ≠ Repo (⚠️ **Repo gewinnt**)

- **D1 — Farb-Token-Namen/Hex weichen ab.** Spec nennt `navy-lift #0f3a61`, `heading-ink #203864`,
  `teal-on-navy #2fd4bf`, `teal-tint #e1f5ee`, `teal-ink #0f6e56`, `body #41506a`, `muted #7a8699`,
  `border #e4e9ef`, `on-navy #eaf1f8`, `on-navy-muted #9db4cc`. **Repo hat statt dessen:**
  `text-heading = #083358` (nicht #203864!), `accent-strong #0f766e`, `accent-on-dark #5eead4`,
  `accent-soft #f0fdfa`, `ui-border #e2e8f0`, on-navy = `text-white/80..90`. → **Keine neuen Hex/Tokens
  erfinden**; vorhandene Klassen verwenden. `heading-ink #203864` ≠ `text-heading` — im Repo ist die
  #203864-Rolle die Legacy-Klasse `gray-900`.
- **D2 — Kein gefüllt-Teal-Button.** Spec: „Primär-CTAs GEFÜLLT (Teal)", Klassen `btn--teal` etc.
  Repo: `Button` hat `primary`(Gradient)/`secondary`(navy)/`outline`; Teal nur via `!bg-accent`-Override.
  → Muster übernehmen **wie es ist**; optionaler Bau-Vorschlag für Phase 2: `accent`-Variante zu `Button`
  hinzufügen (additiv, bestehende Call-Sites unberührt).
- **D3 — Footer ist `brand-primary` (#0d527f), nicht Navy.** Spec: Footer = brand-deep. → Repo-Ist behalten;
  als bewusste Inkonsistenz notiert (Vereinheitlichung nur nach Freigabe).
- **D4 — Eyebrow: Gradient-Rand + `bg-slate-50` + navy Text**, keine teal-tint-/on-dark-Variante.
  Spec: teal-tint bg + teal-ink text. → Auf hell `Eyebrow` verwenden; auf Navy Teal-Text-Muster
  (`uppercase tracking-[0.18em] text-accent`) wie in `FinalCtaSection`.
- **D5 — `Reveal` ohne `prefers-reduced-motion`.** Spec fordert Motion nur hinter reduce. → Guard fehlt;
  in Phase 2 nachrüsten (Reveal + Float/Puls-Keyframes).
- **D6 — Stack ist Vite/React-SSR (`tsx server.ts`)**, kein Next.js; „eager routes" = Consumer-Seiten +
  HomePage eager importiert, Rest `React.lazy` mit SSR-Prerender. „structured data im ersten HTML" via
  `SEOHead`/`structuredData.ts` (nicht anfassen laut Guardrail).
