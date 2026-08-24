# 07 — Komponenten, Hooks und Design-Tokens

## 1. Verzeichnisaufbau `src/`

```
src/
├── api/          3 Formular-Clients
├── components/   analytics · befund · layout · sections · seo · ui
├── content/      befunde/ (12 JSON + Logik) · downloads.json
├── data/         articles · blogPosts · events · services · testimonials
├── hooks/        8 Hooks
├── lib/          6 Hilfsmodule
├── pages/        21 Seiten + consumer/
├── test/         Test-Setup
├── types/        index.ts · models.ts
├── App.tsx       Routing
├── entry-client.tsx / entry-server.tsx
├── i18n.ts / i18n.client.ts / i18n.server.ts
└── index.css / App.css
```

Mehrere Verzeichnisse tragen eine `README.de.md` (`src/`, `src/pages/`, `src/data/`,
`src/components/layout/`) mit lokalen Konventionen.

## 2. Layout (`components/layout/`)

| Komponente    | Aufgabe                                                          |
| ------------- | ---------------------------------------------------------------- |
| `Layout`      | B2B-Shell: Header + Footer + `ScrollToTop`                       |
| `Header`      | Hauptnavigation, Mega-Menü, Suche, Sprachumschalter, Mobile-Menü |
| `Footer`      | 4 Spalten, Social, Rechtszeile                                   |
| `LegalLayout` | schmale Spalte für Impressum/Datenschutz/AGB                     |
| `ScrollToTop` | Sprung nach oben bei Pfadwechsel                                 |

Getestet: `Header.test.tsx`, `Footer.test.tsx`.

## 3. Sections (`components/sections/`) — 27 Stück

**Startseite:** `HeroSection` · `TrustBar` · `ServicesSection` · `WhyPocSection` ·
`StepsSection` · `TestimonialsSection` · `DoctorsSection` · `BlogSection` ·
`FeaturedCaseStudy` · `RoiCalculatorSection` · `FinalCtaSection` · `FAQSection`

**IglooPro:** `IglooProHero` · `IglooFeaturesSection` · `IglooParametersSection` ·
`IglooSpecsSection` · `IglooWidgetSection` · `IglooProductFinalCta`

**Diagnostik:** `DiagnosticsHero` · `DiagnosticsFocusSection` · `DiagnosticsSpecialtySection`

**Epigenetik:** `EpigeneticsTeaserSection` · `EpigeneticsPanels`

**Formulare:** `ContactForm` · `SupportForm` · `PraxisOrderForm`

**Gerüst:** `SubpageHero` · `AboutSection` · `PageSidebar`

## 4. Befund-Komponenten (`components/befund/`)

| Komponente        | Aufgabe                                                |
| ----------------- | ------------------------------------------------------ |
| `BefundBlocks`    | Rendert die `blocks[]` eines Musterbefunds nach `type` |
| `BefundCharts`    | Netzdiagramm / Lebensstil-Radar (11 Achsen)            |
| `BefundMiniature` | Vorschaukachel                                         |
| `BefundOverview`  | Übersicht der sechs Panels                             |
| `ConsultSteps`    | Beratungsablauf                                        |
| `Merkliste`       | Auswahlliste, Zustand in `src/lib/merkliste.ts`        |

## 5. UI-Bausteine (`components/ui/`) — 24 Stück

`Alert` · `BlogCard` · `Breadcrumbs` · `Button` · `ChapterNav` · `ChatWidget` ·
`CookieBanner` · `Eyebrow` · `FlagIcon` · `ImagePlaceholder` · `Input` ·
`LanguageFallbackNotice` · `LanguageSwitcher` · `LoadingSpinner` · `MobileCallButton` ·
`PageTransition` · `Reveal` · `SearchModal` · `SectionHeader` · `ServiceCard` ·
`StatItem` · `Textarea` · `icons/Tooth`

`Button` nutzt `class-variance-authority` für Varianten; `cn()` aus `src/lib/utils.ts`
kombiniert `clsx` + `tailwind-merge`.
`Reveal` und `ChapterNav`/`ScrollToHash` respektieren `prefers-reduced-motion`.

## 6. Hooks (`src/hooks/`)

| Hook                | Aufgabe                               |
| ------------------- | ------------------------------------- |
| `useArticles`       | Artikelliste + Lokalisierung          |
| `useContactForm`    | Zustand/Validierung Kontaktformular   |
| `useSupportForm`    | dito Support                          |
| `useDisclosure`     | Auf/Zu-Zustand (Menüs, Modals)        |
| `useHeroSlider`     | Hero-Slider, motion-bewusst           |
| `useScrollLock`     | Body-Scroll sperren bei offenem Modal |
| `useScrollPosition` | Scrollposition (Header-Schrumpfen)    |
| `useSearch`         | Suchindex und Trefferlogik            |

## 7. Lib (`src/lib/`)

| Modul                  | Aufgabe                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| `utils.ts`             | `cn()` — clsx + tailwind-merge                                         |
| `tracking.ts`          | Anbieterunabhängige Event-Fassade (siehe [08](08-tracking-consent.md)) |
| `useScrollDepth.ts`    | Scrolltiefen-Messung, speist `scroll_depth`                            |
| `merkliste.ts`         | Merkliste der Musterbefunde                                            |
| `articleMeta.ts`       | Artikel-Metadaten für Head und Schema                                  |
| `translationStatus.ts` | Pflegestand einer Sprache je Bereich                                   |

## 8. API-Clients (`src/api/`)

`contact.ts` → `POST /api/contact` · `support.ts` → `POST /api/support` ·
`consumerOrder.ts` → `POST /api/consumer-order`.
Alle mit relativem Pfad — im Dev vom Vite-Proxy, in Prod vom Express-Proxy bzw. nginx aufgelöst.

## 9. Design-Tokens (`tailwind.config.js`)

Durchgesetzt von `npm run check:colors` (`scripts/check-color-tokens.mjs`):
Hex-Werte außerhalb der Token-Datei sind unerwünscht.

### 9.1 Marke

| Token                                         | Hex       | Anmerkung                                  |
| --------------------------------------------- | --------- | ------------------------------------------ |
| `brand.navy` / `brand.deep` / `heading`       | `#083358` | **die eine** Navy — Headline- und Body-Ink |
| `brand.navy-hover` / `brand.navy-mid`         | `#0a3f63` | CTA-Hover, theme-color, OG-Bild            |
| `brand.blue` / `brand.primary` / `accentBlue` | `#0d527f` |                                            |
| `brand.blue-bright` / `brand.secondary`       | `#2f6fa0` |                                            |
| `social.linkedin`                             | `#0077b5` |                                            |

`brand.primary/deep/secondary` sind Legacy-Aliase auf identischen Hex-Werten;
die Migration der Aufrufstellen ist als „Wave 2" offen.
Der frühere Alias `gray-900` (`#203864`) wurde entfernt.

### 9.2 Akzent (Teal)

| Token            | Hex       | Verwendung                |
| ---------------- | --------- | ------------------------- |
| `accent.DEFAULT` | `#0d9488` | teal-600, kanonisch       |
| `accent.strong`  | `#0f766e` | Eyebrow, Hover            |
| `accent.line`    | `#14b8a6` | Unterstriche, Linien      |
| `accent.soft`    | `#f0fdfa` | Pill-Flächen              |
| `accent.border`  | `#99f6e4` | Pill-Rahmen               |
| `accent.on-dark` | `#2dd4bf` | Akzent auf Navy, AA 6,9:1 |

### 9.3 Semantik

`success` (`#10b981` / soft `#ecfdf5` / strong `#047857`) — bewusst **getrennt** vom
Akzent: die Emerald-Töne auf `/s3_leitlinie` und `/vitamin-d3-implantologie` bedeuten
„Erfolg/Gesundheit", nicht „Markenakzent".

**Befund-Ampel** (nur auf den Musterbefundseiten, aus den Quell-PDFs gemessen, damit
Web- und PDF-Fassung dieselbe Bildsprache haben):

| Farbe          | DEFAULT   | soft      | ink       |
| -------------- | --------- | --------- | --------- |
| `befund.red`   | `#c8553d` | `#fcf5f4` | `#bb4c35` |
| `befund.amber` | `#d69b2e` | `#fcf9f2` | `#946a1d` |
| `befund.green` | `#3e8e6b` | `#f1f9f5` | `#377d5e` |

`ink` trägt alle bedeutungstragenden Grafiken und Beschriftungen (AA auf `soft`),
`soft` die Flächen, `DEFAULT` große dekorative Füllungen wie das Netzdiagramm.

### 9.4 UI-Neutralfarben

`ui.border` `#e2e8f0` · `ui.border-hover` `#cbd5e1` · `ui.text-muted` `#94a3b8` ·
`ui.field` `#6b7280`.
`ui.field` existiert wegen WCAG 1.4.11: Bedienelement-Begrenzungen brauchen 3:1,
Platzhalter- und Hilfstext als Text 4,5:1. `border` und `text-muted` bleiben, wo sie
sind — sie tragen Trennlinien und Beiwerk, nichts Bedienbares.

Legacy: `gray-100` `#F5F5F5`, `gray-500` `#868C98`.

### 9.5 Weitere Skalen

- **Schrift:** `Inter Variable` → `Inter` → `Inter Fallback` → `system-ui` → `sans-serif`
- **Größen:** `xxs` 10px, `hero-sm` 40px, `hero-md` 48px, `hero-lg` 58px
- **Breiten:** `max-w-container` 1200px, `max-w-page` 1440px
- **Höhen:** `min-h-hero` 300px, `min-h-hero-lg`/`h-hero-lg` 420px
- **Radius:** `rounded-section` 24px
- **Schatten:** `card` (Navy-getönt), `glow-secondary`, `glass`
- **Keyframes:** `fade-in-scale`, `slide-in-up`, `slide-out-up`, `slide-in-right`, `slide-out-left`

Vertiefung: [docs/design-system.md](../docs/design-system.md),
`_project-knowledge/wave-2-analyse/farb-tokens.md`.
