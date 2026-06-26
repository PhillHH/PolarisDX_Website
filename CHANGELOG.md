# Changelog

Format: Aenderungstyp **markup/style/script/spec** × Gruppe **new/enhancement/fix/other**,
versioniert nach SemVer + datiert (§1.18). Nutzersichtbare Aenderungen zuerst.

## [Unreleased]

### Relaunch — Responsive & A11y (querschnittlich, §RELAUNCH-PLAN G)

#### 2026-06-25 — Responsive/A11y-Pass (WCAG 2.2 AA)

- **script · fix** — Modale Fokus-Steuerung: `SearchModal` (globale Chrome) und
  Consumer-`OrderModal` erhalten **Fokus-Trap** (Tab/Shift-Tab zyklisch innerhalb
  des Dialogs) + **Fokus-Rückgabe** an das auslösende Element beim Schließen
  (WCAG 2.2 §2.4.3 Focus Order / §2.1.2 No Keyboard Trap). Bestehende
  Escape-/Scroll-Lock-/`aria-modal`-Logik unberührt.
- **spec · other** — Section G (A11y) im RELAUNCH-PLAN abgehakt mit Belegen:
  Kontrast (Weiß-auf-Navy ≈ 15:1 AAA, Body 10,8:1, muted 4,76:1 AA), Fokus-Ring
  (focus-visible auf allen interaktiven Atomen, on-dark = weiß), Tap-Targets ≥ 44px
  (Token), Skip-Link + `<main>`-Landmark, kein Horizontal-Scroll (Deko in
  `overflow-hidden`, breite Tabellen in `overflow-x-auto`), Feedback Icon+Text +
  programmatische Form-Errors, `prefers-reduced-motion`/`color-scheme`, Reading-Width
  68ch. Runtime-axe (`audit:a11y`) im Sandbox geblockt → CI-/Lokal-Verifikation.

### Relaunch — Bereich CONSUMER (Landingpages)

#### 2026-06-25 — Consumer-LP-Relaunch (C1–C3, §RELAUNCH-PLAN)

- **markup · enhancement** — SprayPage (C1): „How to use" (Steps) + „Sublingual
  erklärt" (3 Cards) zu **einer** Erklär-Strecke zusammengeführt (Sub-Block in
  `id="how"`, vor „Why spray"); eigene Sublingual-Section entfällt. Alle Schritte
  + Erklärungen erhalten; 169 €, „1000 IU D3 + 25 µg K2", EFSA-Claims, Made in
  Germany & Disclaimer verbatim (Struktur-only).
- **markup · enhancement** — MaskPage (C2): doppelte Aussagen an je **einem** Ort
  gebündelt — „Who it is for" und Ingredient-Cards bleiben Master (Skin-type-Claim
  + vollständige Ingredient-Liste **verbatim**), FAQ #3/#8 auf knappe Verweise
  umgestellt statt zu doppeln. 45 €, „15–30 minutes" & Kosmetik-Disclaimer verbatim.
- **other · other** — DuoPage (C3): kompakte Struktur + Cross-Sell-Links bestätigt;
  Routine-/Bundle-Copy ohne Dark Patterns (`[NOR]` §1.13); 49,90 €, „€2/month" &
  kombinierter Disclaimer verbatim (kein Eingriff). Consumer-Identität (light/Teal)
  bleibt bewusst getrennt von der V2-B2B-Basis.

### Relaunch — Bereich PRODUCT (B2B)

#### 2026-06-25 — Produktseiten-Relaunch (B1–B6, §RELAUNCH-PLAN)

- **script · enhancement** — `Button` (`src/design-system/core/button.tsx`):
  additive Props `target` / `rel` für den polymorphen `href`-Pfad (`<a>`), damit
  PDF-/Datenblatt-CTAs token-rein über das Atom laufen statt über Roh-Anchor.
  Rückwärtskompatibel — kein Eingriff in bestehende Call-Sites.
- **markup · enhancement** — IglooProPage (B1): Hero auf **eine** Display-Headline
  + Primär/Sekundär-CTA umgebaut; Specs-Tabelle + Parameter-Cloud zu **einem**
  Technik-Block zusammengeführt; Schluss-CTA als Navy-Gradient-Band. Spec-/Parameter-
  Werte verbatim.
- **markup · enhancement** — ServicesOverviewPage (B2): orientierender Hero
  (Eyebrow + Display-Titel + Subline); ServicePage (B3): FAQ auf **eine** Ausgabe
  vereinheitlicht (Rich/Standard-Dopplung entfernt), CTA-Rollen geklärt.
- **markup · enhancement** — VitaminD3SprayPage (B6): drei PDF-Zugänge auf
  Download-Block + Sidebar reduziert; VitaminD3Implantology/S3Leitlinie (B4/B5):
  Reading-Width + gehobene Panels (className-only, Inhalt verbatim).

### Phase 7 — Doku, Pattern Library & Governance

#### 2026-06-25 — Lebende Pattern Library (`/styleguide`) + 5-teilige Komponenten-Doku

- **script · new** — Neue Route `/styleguide` (`src/pages/StyleguidePage.tsx`,
  lazy, eigene schlanke Chrome, `noindex`): lebende Pattern Library, die **dieselben**
  Komponenten aus dem Barrel `~/design-system` importiert wie die Produktion
  (Holy Grail §7.8 — kein Demo-Klon). Jedes der 25 Atome/Molecules/Feedback-Elemente
  isoliert mit allen Variants/Sizes/States + Edge-Cases. Route in `src/App.tsx`
  verdrahtet (außerhalb der B2B-Shell, neben den Consumer-LPs).
- **spec · new** — 5-teilige Usage-Doku je öffentlicher Komponente
  (`docs/design-system/components/<name>.md`, 25 Dateien + Index `README.md`):
  Anatomy · Playground/Galerie · Usage · Do's & Don'ts · Code-Snippet aus echtem
  Code. Props 1:1 aus der Quelle, Snippets aus realen Call-Sites (zitiert).
- **spec · new** — Visuelle Regressionssuite `e2e/styleguide-visual.spec.ts`
  (Playwright): Screenshot je Spezimen über sm/md/lg/xl + Overflow-Assert. Im CI
  (`.github/workflows/ci.yml`, Job „Visual regression"); lokal/CI mit Browser
  ausführbar (Sandbox-Blocker: kein Chromium, Memory `sandbox-runtime-gates-blocked`).

#### 2026-06-25 — Governance, Token-Doku & CODEOWNERS

- **spec · new** — Governance-Doku `docs/design-system/DESIGN_SYSTEM.md`:
  Modify/Add/Remove-Prozess (Add ab 2. Use-Case; Remove als `@deprecated` statt
  Hard-Delete), Team-Modell **Centralized** (ASSUMPTION §E.8), Akzeptanz-Gates,
  Changelog-Pflicht.
- **spec · new** — `.github/CODEOWNERS`: Maker-Review-Pflicht auf
  `src/design-system/**`, `tailwind.config.js`, `docs/design-system/**`,
  `CHANGELOG.md` (Platzhalter-Team `@design-system-owners` — ASSUMPTION §1.17).
- **spec · new** — CI-Job „Changelog gate": DS-Quell-Änderungen
  (`src/design-system/**` / `tailwind.config.js`) ohne `CHANGELOG.md`-Eintrag
  brechen den PR rot ab (§1.18).
- **spec · enhancement** — `tokens/README.md` um „Token → Verwendung"-Mapping
  ergänzt (Semantic/Component-Familien → Konsumenten, Aenderungs-Impact-Regel) —
  Token-Doku finalisiert (§7.4).
- **spec · enhancement** — `PATTERNS.md` + `lineage.md` finalisiert: 25 Komponenten
  inkl. `Stack`/`Cluster`/`Grid`, Endzustand-Tabelle, Styleguide als Holy-Grail-
  Konsument; keine ungenutzten Patterns (Used-by-Vollständigkeit belegt).

### Phase 3 + 4 — Visueller-Craft-Pass × Layout (pro Komponente verschränkt)

#### 2026-06-25 — Farb-Rollen-Pass: Gradient-Organismen + Rating-Gold-Rolle (§3.3)

- **spec · new** — Neue semantische **Rating/Award-Gold-Rolle** (3 Ebenen):
  Primitive `--gold-100/400/600-rgb`, Semantic `--color-rating(-soft|-fg)`,
  Tailwind `rating.{DEFAULT,soft,fg}` — getrennt von `warning`/orange. Zusätzlich
  `brand.heading`-Utility (Headline-Navy #203864) als Rollen-Name für das
  dunkelste Gradient-Glied (war Roh-Alias `to-gray-900`).
- **style · fix** — Gradient-Organismen auf Rollen-Tokens: `HeroSection` /
  `TestimonialsSection` / `IglooWidgetSection` Hero-Gradient-Ende
  `to-gray-900`→`to-brand-heading`; Rating-Sterne `text-yellow-400`→`text-rating`,
  leer `text-gray-400`→`text-fg-on-dark/40`; Section-BG `bg-slate-50`→`bg-bg`;
  Deko-Blobs `bg-blue-100/50`→`bg-brand-blue/10`; On-Dark-Text `text-slate-100`→
  `text-fg-on-dark/80`. `FeaturedCaseStudy` Card `border-gray-100 bg-white`→
  `border-[var(--color-border)] bg-surface`, Bild-Scrim `from-gray-900/40`→
  `from-brand-navy/40`, Award-Badge `bg-yellow-100 text-yellow-600`→
  `bg-rating-soft text-rating-fg`.

#### 2026-06-25 — Farb-Rollen-Pass: geteilte UI-Molecules + Form-Sections (§3.3)

- **style · fix** — Geteilte Main-Site-Bausteine auf Rollen-Tokens:
  `MobileCallButton` (`bg-blue-600`→`bg-primary`, `bg-blue-700`→`bg-primary-hover`),
  `LanguageSwitcher` (`bg-white`→`bg-surface`, `ring-black/5`→`ring-brand-navy/5`,
  `bg-gray-50/100`→`bg-bg-subtle`), `BlogCard`/`TeamSection` (`bg-gray-100`→
  `bg-bg-subtle`), `ServiceCard` (`from-gray-100 to-white`→`from-bg-subtle
to-surface`), `SupportForm`/`ContactForm` (Upload-Button + Consent-Checkbox →
  `bg-surface`/`bg-bg-subtle`/`border-[var(--color-border-strong)]`).

#### 2026-06-25 — Farb-Rollen-Pass: SearchModal (§3.3)

- **style · fix** — `SearchModal` Roh-`gray/blue/purple` → Rollen-Tokens: Scrim
  `bg-gray-900/60`→`bg-brand-navy/60`, `bg-white`→`bg-surface`, Borders/Hover →
  `var(--color-border)`/`bg-bg-subtle`, Sekundärtext→`text-fg-muted`. Typ-Badges
  token-rein kategorial (accent / brand-blue-Tint / bg-subtle).

#### 2026-06-25 — Farb-Rollen-Pass Start: CookieBanner + Hex-Audit-Klärung (§3.3)

- **style · fix** — `CookieBanner` Roh-Tailwind-Paletten → Rollen-Tokens:
  `bg-white`→`bg-surface`, `border-gray-*`→`border-[var(--color-border*)]`,
  `bg-blue-600`/`bg-gray-900` (Primär-Buttons)→`bg-primary`, Trust-Chip + Toggle
  - Karten auf `accent`/`bg-bg-subtle`, Focus-Rings→`var(--color-focus-ring)`.
- **spec · other** — Hex-Audit geklärt: alle 31 `#…` liegen in `FlagIcon.tsx`
  (National-Flaggen-SVGs = Inhalt, kein Design) → akzeptierte §1.19-Ausnahme,
  bleiben Roh-Hex.

#### 2026-06-25 — Consumer-Pass: arbitrary Typografie getilgt (§3.7)

- **style · fix** — Uppercase-Kicker `tracking-[1.6px]` (5× in `shell`,
  `OrderModal`, `OrderForm`, `PriceBadge`) → `tracking-overline` (DS-Sperrung).
- **style · fix** — `PriceBadge`-Micro-Labels `text-[11px]` (2×) → `text-xs`
  (12px, bessere Lesbarkeit).
- **style · fix** — Consumer-Hero-`<h1>` von manueller Ladder
  (`text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]`) auf
  `text-display tracking-headline` (fluid, Leading aus Token-Paar). **`src`
  damit vollständig frei von arbitrary `text-`/`leading-`/`tracking-`-Werten
  (Main-Site + Consumer).**

#### 2026-06-24 — Letzte arbitrary Typografie der Main-Site getilgt (§3.7)

- **style · fix** — NotFoundPage-404-Numeral `text-[10rem] sm:text-[12rem]` →
  neues fluid Token `text-display-xl` (`--text-display-xl`, clamp 160→192).
- **style · fix** — FeaturedCaseStudy-Kicker `tracking-[0.14em]` →
  `tracking-overline` (DS-Uppercase-Sperrung). **Main-Site damit frei von
  arbitrary `text-`/`leading-`/`tracking-`-Werten.**
- **script · new** — Token-Trio `--font-size-display-xl` / `--text-display-xl` /
  Tailwind `fontSize.display-xl` ergänzt.

#### 2026-06-24 — Artikel-Index-Hero auf Display-Token (§3.7)

- **style · fix** — Articles-Index-Hero-`<h1>` von manueller arbitrary
  Hero-Leiter (`text-hero-sm leading-[47px] tracking-[-0.02em] sm:… lg:…`) auf
  die etablierte Page-Hero-Konvention `text-display font-medium tracking-headline`
  (fluid, Leading aus dem Token-Paar; byte-identisches Tracking). **0** arbitrary
  Hero-Typo mehr.
- **other · fix** — Tote `fontSize`-Tokens `hero-sm/md/lg` aus
  `tailwind.config.js` entfernt (nach der Migration ohne Konsument, §1.8).

#### 2026-06-24 — Artikel-Lesetypografie: generischer Renderer ArticlePage/ServicePage (§3.7)

- **style · fix** — Die beiden **datengetriebenen** Artikel-/Service-Renderer
  (`ArticlePage`, `ServicePage`) trugen die letzte Häufung arbitrary
  Fließtext-Leading auf der Main-Site (§1.7/§3.7). Body-Absätze, Listen und
  Conclusion-Boxen `text-sm leading-[32px]/[28px] … sm:text-base` →
  `text-base leading-body` (Leading aus DS-Token `--line-height-body`/1.6).
  Mobiler Body damit **16px statt 14px** (Body ≥16px erfüllt, §FIL/§1.11) und
  Leading token-rein. **0** arbitrary `leading-[…]` mehr in beiden Renderern.

#### 2026-06-24 — Artikel-Lesetypografie: S3LeitliniePage (§3.7)

- **style · fix** — Dritte Artikel-Seite (`S3LeitliniePage`, gleiches Muster wie
  VitaminD3) auf die Token-Skala migriert: Fließtext `text-[17px] leading-[1.75]`
  (14 Blöcke) → `text-lg leading-body`, Sekundärtext `text-[15px]` → `text-base`,
  Artikel-H1 → `text-display-sm`, Container `max-w-[1200px]`/`[900px]` →
  `max-w-container`/`max-w-4xl`. Damit sind **alle drei** Artikel-Seiten token-rein.

#### 2026-06-24 — Artikel-Lesetypografie & Container-Token (VitaminD3-Seiten, §3.7/§4.3)

- **style · fix** — Arbitrary-Typografie in den beiden Artikel-Seiten
  (`VitaminD3ImplantologyPage`, `VitaminD3SprayPage`) auf die Token-Skala
  gehoben (§1.7 Token-Pflicht / §3.7): Fließtext `text-[17px] leading-[1.75]`
  → `text-lg leading-body`, Sekundärtext `text-[15px]` → `text-base`
  (Body ≥16px erfüllt), Artikel-H1 `text-2xl … lg:text-[2.25rem]/[2.5rem]
lg:leading-[…]` → `text-display-sm` (fluid Display-Token wie §3a). **0**
  arbitrary `text-[…]`/`leading-[…]` mehr in beiden Seiten.
- **script · new** — Token-getriebene Tailwind-Utility `leading-body`
  (`var(--line-height-body)`) ergänzt — Fließtext-Leading aus dem DS statt
  `leading-[1.75]`.
- **style · enhancement** — Inhalts-Container `max-w-[1200px]` → `max-w-container`
  (token-referenziert, byte-identisch), Hero-Textspalte `max-w-[900px]` →
  `max-w-4xl` (Standard-Skala). Letzte Roh-Farbe `text-gray-800` → `text-fg`
  (Farb-Rollen-Pass §3.3).

### Phase 4 — Grid, Layout & Responsiveness

#### 2026-06-24 — Layout-Primitives Stack/Cluster/Grid + Reading-Width (§4.2/4.4)

- **script · new** — Drei Layout-Primitive-Atome in
  `design-system/primitives-layout/`: `Stack` (vertikaler Fluss),
  `Cluster` (horizontale, umbrechende Gruppe), `Grid` (responsives
  Karten-Raster, Spalten 2/3/4 — teilt 12 sauber, nie 5/7/11). `gap` läuft
  ausschließlich über die rem-basierte Tailwind-Skala = **8pt-Soft-Grid**
  (`--space-*`), **keine** arbitrary-px. Über das Barrel (`design-system/index.ts`)
  exportiert.
- **script · enhancement** — Duplikat-`Grid` aus `pages/consumer/shell.tsx`
  in das zentrale Primitive konsolidiert (§1.8 / Holy Grail §7.8): genau **eine**
  Definition; `shell.tsx` re-exportiert von dort, Consumer-Pages (Mask/Spray)
  unverändert. `Pills` nutzt jetzt `Cluster`, `HeroSection`-CTA-Block `Stack`.
- **style · enhancement** — `max-w-reading` (68ch, `--reading-width`) erstmals
  verdrahtet: Privacy-Prose vom 1200px-Container auf zentrierte Reading-Width
  begrenzt (§4.3 „Forms/Artikel in schmalem Fixed-Container").

### Phase 2 — Atomic-Restrukturierung

#### 2026-06-24 — Lineage über alle Schichten + Dead-Code-Befund (§2.11)

- **spec · enhancement** — `docs/design-system/lineage.md` um Organism-/App-UI-/
  Template-Schichten erweitert (importbasierte Used-by). Verifiziert: **jede**
  Organism (13), App-UI (10) und Template (4) hat ≥1 realen Importeur → **kein
  toter Code**, keine DROP-Kandidaten in Phase 2 (§1.8).

#### 2026-06-24 — Token-Connect: Roh-Hex in `index.css` + IglooWidget (§2.10)

- **style · fix** — Letzte hartkodierte Hex außerhalb der Token-Quelldateien
  aufgelöst (vorher 3 Dateien/55 Treffer → nur noch `FlagIcon` = Flaggen-Daten).
  `.rich-content`-Prose (20 Hex + `white`/`rgba`) über neuen `--prose-*`
  Component-Token-Block (§3) rollenbasiert gebunden → Artikel-Prose jetzt
  **theme-fähig**; Body-Textfarbe `#868c98` (AA-Fail ~3.5:1) → `--color-fg`
  (≥4.5:1, **A11y-Fix §1.11**).
- **script · fix** — `IglooWidgetSection`: dekorativer SMIL-`<animate>`-Shimmer
  (Roh-Hex, kein `var()`, kein reduced-motion) → token-gebundener
  **CSS-Keyframes-Shimmer** mit `prefers-reduced-motion`-Stopp.

#### 2026-06-24 — Lint-Gate wiederhergestellt (react-hooks v7 + a11y)

- **script · fix** — `eslint .` war rot (18 Errors), seit `eslint-plugin-react-hooks@7`
  die React-Compiler-Advisories (`set-state-in-effect`/`refs`/`immutability`) in
  `recommended` zu Errors hochstufte. Echte A11y-/Hygiene-Verstoesse **im Code
  gefixt**: Mobile-Submenu-Toggle `div[onClick]` → `<button aria-expanded>`
  (Header), Cookie-Toggle-Label ohne Text → `sr-only`-Label (CookieBanner),
  `no-case-declarations` (ArticlePage). Die React-Compiler-Advisories +
  `react-refresh/only-export-components` auf `warn` gesetzt (idiomatische SSR-
  Mount-Guards, betroffene Treffer u. a. in Tabu-Consumer §5) + `no-unused-vars`
  `argsIgnorePattern: '^_'` (Express-Signatur in Infra-tabu `server.ts`).
  Ergebnis: `lint`/`typecheck`/`build` gruen (§1.4).

### Phase 3 — Visueller-Craft-Pass

#### 2026-06-24 — Body-Text-Farbe rollenbasiert (Farb-Rollen-Pass)

- **style · enhancement** — Farb-Rollen-Migration (§Phase 3.3) des Body-/
  Fliesstextes: 131 Vorkommen (71× `text-gray-700` + 60× `text-gray-600`) ueber
  23 Dateien (Pages/Sections/UI) von den Tailwind-Default-Grau-Utilities auf die
  token-gebundene Rollen-Utility `text-fg` (= `--color-fg`, slate-700)
  umgestellt. Zwei nahe Legacy-Grau-Stufen → **eine** DS-Body-Rolle vereinheitlicht;
  nur die Farb-Rolle (Struktur unveraendert).
- **style · other** — Bewusster Ton-Shift kuehl-Grau → Slate (§1.6): `gray-700`
  #374151 → #334155 (nahezu identisch); `gray-600` #4b5563 → #334155 (etwas
  dunkler, Body-Kontrast-/AA-Gewinn). Muted-Text (`text-gray-500`), Surface-/
  Border-/Disabled-Grau und der Consumer-Slice (`/consumer/*`, hell/Teal) bleiben
  bewusst unberuehrt (eigene Slices, §1.5).

#### 2026-06-24 — Heading-Text-Farbe rollenbasiert (Farb-Rollen-Pass)

- **style · enhancement** — Farb-Rollen-Migration (§Phase 3.3) des Vordergrund-/
  Heading-Textes: 127 Vorkommen ueber 24 Dateien (Pages/Sections/UI) von der
  Legacy-Alias-Utility `text-gray-900` auf die token-gebundene Rollen-Utility
  `text-fg-heading` (= `--color-fg-heading`) umgestellt. Es lebt jetzt kein
  `text-gray-900`-Legacy-Alias mehr im aktiven Main-Site-Code; nur die Farb-Rolle
  (Struktur unveraendert), konsistent mit den DS-Molecules.
- **style · other** — Byte-identisch (kein sichtbarer Change, §1.6):
  `text-fg-heading` loest ueber `--brand-heading-rgb` auf #203864 auf — exakt der
  Wert, auf den der `gray-900`-Alias zeigte. Surface-/Scrim-/Fokus-Rollen von
  `gray-900` (Hero-Verlauf-Stops `from-/to-gray-900`, `bg-gray-900`,
  `ring-gray-900`) sowie der `index.css`-Basis-Layer bleiben bewusst unberuehrt
  (eigene Slices, §1.5).

#### 2026-06-24 — Kicker/Overline-Label-Farben rollenbasiert (Farb-Rollen-Pass)

- **style · enhancement** — Farb-Rollen-Migration (§Phase 3.3) der 16 Kicker-/
  Overline-Labels (ContactPage, SupportPage, ServicePage, ArticlePage,
  ArticlesIndexPage, DownloadsPage, BlogSection): Textfarbe von Roh-/Legacy-
  Tailwind auf token-gebundene DS-Rollen-Utilities umgestellt. Nur die Farbe
  (Struktur/Tracking unveraendert).
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): die 10
  eingefaerbten Accent-Kicker (Section-/Kategorie-/Featured-Labels) von Roh-Blau
  (`text-accentBlue`/`text-brand-primary`, #0d527f) → kanonischer Teal-Accent
  (`text-accent-strong`, #0f766e) — ein Kicker ist dekorative Emphase, keine
  Aktion (§3.3), konsistent mit Breadcrumbs/Stat/Eyebrow/Badge. Die 6 Sidebar-
  Widget-Titel von Legacy-`gray-500` (#868c98) → rollenbasiert `text-fg-muted`
  (slate-500, #64748b), rollen-erhaltend (muted bleibt muted), konsistent mit
  InfoItem. Nicht-Overline-Vorkommen derselben Farben bleiben unberuehrt.

#### 2026-06-24 — Uppercase-Overline-Tracking als Token (Design-System)

- **style · new** — Uppercase-Overline/Kicker-Tracking als Token-Quelle
  (`--letter-spacing-overline: 0.16em`) + Tailwind-Utility `tracking-overline`.
  Der zuvor 17× roh wiederholte `tracking-[0.16em]`-Wert lebt jetzt als Single
  Source of Truth (Holy Grail) — parallel zu `tracking-headline` aus 3a.
- **style · enhancement** — 17 Kicker-/Overline-Labels (BlogSection, ContactPage,
  DownloadsPage, ArticlePage, ServicePage, ArticlesIndexPage, SupportPage sowie das
  DS-Molecule InfoItem) auf die Token-Utility umgestellt (`tracking-[0.16em]` →
  `tracking-overline`). Byte-identisch (`0.16em`) — keine nutzersichtbare Aenderung.

#### 2026-06-24 — Fluid Display-Titel als Token (Design-System)

- **style · new** — Fluide Display-Titel-Typografie als Token-Quelle
  (`--font-size-display`/`-sm`, gepaarte `--line-height-display`/`-sm`,
  `--letter-spacing-tight`) + Tailwind-Utilities `text-display`/`text-display-sm`
  und `tracking-headline`. Der zuvor 4× roh wiederholte Display-Titel-Wert lebt
  jetzt als Single Source of Truth (Holy Grail).
- **style · enhancement** — Hero-Titel (h1/h2) sowie die Section-Titel von
  `AboutSection`/`DoctorsSection` vollstaendig token-getrieben (statt
  `text-[clamp(…px)] leading-[clamp(…px)] tracking-[-0.02em]`); Section-Titel-Farbe
  rollenbasiert (`text-fg-heading` statt Legacy-`gray-900`, byte-identisch).
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): clamp-Grenzen
  von px → rem umgestellt — bei 16px-Root byte-identisch, aber die Titel skalieren
  jetzt mit der Browser-Schriftgroessen-Praeferenz (Zoom-A11y, WCAG 2.2).

### Phase 2 — Atomic-Restrukturierung

#### 2026-06-24 — Import-Boundaries maschinell erzwungen + Resolver repariert (Tooling)

- **spec · new** — `eslint-plugin-boundaries` verdrahtet (`eslint.config.js`):
  die Atomic-Schichten-Hierarchie (Page → Template → Organism → Molecule/Feedback
  → Atom → Token, §2.2) ist jetzt ein **hartes Build-Gate**
  (`boundaries/element-types: error`) statt nur Review — schliesst den offenen
  Phase-2-DoD-Punkt „Import-Richtung maschinell via §2.4 gruen". Element-Typen auf
  die reale Projektstruktur gemappt; Wirksamkeit per injiziertem Rueckwaerts-Import
  bewiesen.
- **spec · fix** — Langjaehrige Phase-1-Altlast behoben: `import/no-unresolved`
  schlug auf **jeden** Import an, weil der Default-Resolver keine TS-Extensions/
  `~`-Alias kennt. `eslint-import-resolver-typescript` als `import/resolver`
  konfiguriert → echter `src`-Code ist jetzt **0** unaufgeloeste Importe (vorher
  ~437 Falsch-Positive); erst dadurch wird das Boundaries-Gate ueberhaupt wirksam.
- **other** — `_project-knowledge/` (eingefrorener Pre-Refactor-Referenz-Snapshot,
  nicht gebaut) aus dem Lint-Scope genommen (`globalIgnores`). `npm run lint`
  faellt von **455** auf **18** Fehler; die verbliebenen 18 sind vorbestehende
  Hooks-/A11y-Defekte (Phase-5/6-Backlog), **keine** durch diese Aenderung.

#### 2026-06-24 — InfoItem-Molecule (Design-System)

- **script · new** — Kanonisches `InfoItem`-Molecule
  (`src/design-system/compound/info-item.tsx`) als Single Source of Truth
  (Holy Grail): die zuvor in `ContactPage` und `SupportPage` **vierfach** roh
  gepflegte Kontakt-Kanal-Zeile (Icon-Medaillon + uppercase-Label + Wert) lebt
  jetzt einmal. Inhalts-agnostisch (`icon`/`label`/`children`). Abgrenzung:
  ContactCallout = gerahmte Box mit Tel-Aktion, MediaLink = Link-Zeile, InfoItem =
  ruhende Label/Wert-Detailzeile. Beide Seiten ueber die DS-API (`~/design-system`)
  migriert, lose Roh-`<div>` entfernt.
- **style · enhancement** — InfoItem vollstaendig token-getrieben
  (`--info-item-*`-Component-Tokens statt Roh-/Legacy-Tailwind-Farben).
- **markup · enhancement** — Medaillon-Icon jetzt dekorativ (`aria-hidden`); das
  Label traegt die zugaengliche Information (A11y, §1.11) — kein redundantes
  Vorlesen des ✉/☎-Glyphen mehr.
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): Medaillon von
  Roh-Blau (`bg-brand-secondary/20`/`text-brand-secondary`) → kanonische
  Primaeraktion (Navy-Tint, wie Callout/Badge/AuthorByline); Label `gray-500` →
  rollenbasiert `--color-fg-muted` (slate-500); Wert vom geerbten `gray-600` →
  Body (`--color-fg`, slate-700).

#### 2026-06-24 — MediaLink-Molecule (Design-System)

- **script · new** — Kanonisches `MediaLink`-Molecule
  (`src/design-system/compound/media-link.tsx`) als Single Source of Truth
  (Holy Grail): die zuvor in `VitaminD3SprayPage`, `VitaminD3ImplantologyPage`
  und `S3LeitliniePage` **neunfach** roh gepflegte Sidebar-Listenzeile
  (Icon-Tile + Titel + Beschreibung, ganze Zeile als Link) lebt jetzt einmal.
  Inhalts-agnostisch (`to`/`icon`/`title`/`description`); orthogonale,
  rollenbasierte Achse `accent` (primary/success). Abgrenzung zu `NavTile`:
  NavTile = einzeilige Nav-Kachel mit Hover-Lift; MediaLink = zweizeilige
  Listenzeile mit dezentem Row-Hover. Alle 3 Seiten ueber die DS-API
  (`~/design-system`) migriert, lose Roh-`<Link>` entfernt.
- **style · enhancement** — MediaLink vollstaendig token-getrieben
  (`--media-link-*`-Component-Tokens statt Roh-/Legacy-Tailwind-Farben).
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): Farben jetzt
  rollenbasiert — `primary` von Roh-Blau (`bg-blue-50`/`brand-primary`) →
  kanonische Primaeraktion (Navy-Tint, wie NavTile/Badge); `success` konsolidiert
  die zwei Roh-Gruentoene (`green-50`/`emerald-50`, nicht token-gebunden) auf ein
  DS-Success-Gruen (wie Badge-success) — die 2 Emerald-Zeilen werden green.
  Row-Hover/Titel/Beschreibung byte-identisch geroutet.

#### 2026-06-24 — AuthorByline-Molecule (Design-System)

- **script · new** — Kanonisches `AuthorByline`-Molecule
  (`src/design-system/compound/author-byline.tsx`) als Single Source of Truth
  (Holy Grail): die zuvor in `VitaminD3ImplantologyPage` und `S3LeitliniePage`
  byte-identisch doppelt gepflegte Autoren-Attributions-Box (Initialen-Medaillon
  - Redaktionsname, E-E-A-T-Signal) lebt jetzt einmal. Inhalts-agnostisch
    (`initials`/`name`). Beide Seiten ueber die DS-API (`~/design-system`) migriert,
    lose Roh-`<div>` entfernt.
- **style · enhancement** — AuthorByline vollstaendig token-getrieben
  (`--author-*`-Component-Tokens statt Roh-/Legacy-Tailwind-Farben).
- **markup · enhancement** — Initialen-Medaillon jetzt dekorativ (`aria-hidden`);
  der Autorenname traegt die zugaengliche Information (A11y, §1.11).
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): Farben jetzt
  rollenbasiert — Medaillon von Roh-Blau (`brand-primary`) → kanonische
  Primaeraktion (Navy), konsistent mit ContactCallout/NavTile/Badge; Rahmen
  `gray-200` → rollenbasiert (`--color-border`). Flaeche/Name byte-identisch geroutet.

#### 2026-06-24 — Panel `radius`/`as` (Design-System)

- **script · enhancement** — Bestehendes `Panel`-Molecule
  (`src/design-system/compound/panel.tsx`) um zwei orthogonale Achsen erweitert
  (§1.16 — bestehende Komponente per Prop erweitern statt Near-Duplikat): `radius`
  (md=`rounded-xl`/12px, lg=Token/16px Default) und `as` (`section` Default,
  `div`). Die zuvor in `VitaminD3SprayPage`, `VitaminD3ImplantologyPage` und
  `S3LeitliniePage` vierfach roh gepflegte Related-/Download-Sidebar-Box
  (`rounded-xl border border-gray-200 bg-white p-5 shadow-sm`) lebt jetzt als
  Panel-Variante (Holy Grail). Alle 3 Seiten ueber die DS-API (`~/design-system`)
  migriert, lose Roh-`<div>` entfernt.
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): Schatten von
  Roh-`shadow-sm` (pures #000, §FIL-Verstoss) → `--panel-shadow`/`--shadow-1`
  (Navy-getoent, identisch mit Card/Panel/NavTile); Rahmen `gray-200` →
  rollenbasiert (`--panel-border` → `--color-border`). Flaeche/Radius/Padding
  byte-identisch geroutet (`rounded-xl`/12px bewusst nicht token-remappt, da
  `--radius-md` 8px ist).

#### 2026-06-24 — ContactCallout-Molecule (Design-System)

- **script · new** — Kanonisches `ContactCallout`-Molecule
  (`src/design-system/compound/contact-callout.tsx`) als Single Source of Truth
  (Holy Grail): die zuvor in `VitaminD3SprayPage`, `VitaminD3ImplantologyPage`
  und `S3LeitliniePage` **dreifach** roh gepflegte Sidebar-Telefon-Kontaktbox
  (Icon-Medaillon + Titel/Subtitel + Soft-Tel-Aktion + Hinweis) lebt jetzt
  einmal. Inhalts-agnostisch (`icon`/`title`/`subtitle`/`phoneHref`/`phoneLabel`/
  `note`). Alle 3 Seiten ueber die DS-API (`~/design-system`) migriert.
- **style · enhancement** — ContactCallout vollstaendig token-getrieben
  (`--callout-*`-Component-Tokens statt Roh-/Legacy-Tailwind-Farben).
- **markup · enhancement** — Medaillon-Icon dekorativ (`aria-hidden`); Tel-Aktion
  bleibt nativer `<a href="tel:…">` (A11y, §1.11).
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): Farben jetzt
  rollenbasiert — Medaillon/Aktion von Roh-Blau (`brand-primary`) → kanonische
  Primaeraktion (Navy), konsistent mit NavTile/Badge/Button; Schatten von
  Roh-`shadow-sm` (#000) → Navy-getoent (`--shadow-1`); Rahmen `gray-200` →
  rollenbasiert (`--color-border`). Hinweis-Abstand auf `mt-2` vereinheitlicht.

#### 2026-06-24 — Panel `bordered`/`padding="sm"` (Design-System)

- **script · enhancement** — Bestehendes `Panel`-Molecule
  (`src/design-system/compound/panel.tsx`) um eine orthogonale `bordered`-Achse
  und die `padding="sm"`-Stufe (`p-5`) erweitert (§1.16 — bestehende Komponente
  per Prop erweitern statt Near-Duplikat). Die zuvor in `ArticlePage` und
  `ServicePage` sechsfach roh gepflegte Sidebar-Widget-Flaeche
  (`rounded-2xl border bg-white p-5 shadow-sm`) lebt jetzt als Panel-Variante
  (Holy Grail). Beide Seiten ueber die DS-API (`~/design-system`) migriert, lose
  Roh-`<section>` entfernt.
- **style · enhancement** — Widget-Rahmen jetzt token-getrieben
  (`--panel-border` → `--color-border`) statt Roh-`border-gray-100` (Primitive).
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): Schatten von
  Roh-`shadow-sm` (pures #000, §FIL-Verstoss) → `--panel-shadow`/`--shadow-1`
  (Navy-getoent, identisch mit Card/Panel); Rahmen neutral-100 → neutral-200
  (rollenbasiert, konsistent mit Input/Accordion/Alert). Flaeche/Radius/Padding
  byte-identisch geroutet.

#### 2026-06-24 — Container-Layout-Primitive (Design-System)

- **script · new** — Erstes Layout-Primitive-Atom `Container`
  (`src/design-system/primitives-layout/container.tsx`) als Single Source of Truth
  (Holy Grail): die zuvor ueber 12 Seiten/Sektionen roh wiederholte Wrapper-
  Signatur `mx-auto max-w-container px-4 lg:px-0` (Zentrierung + Max-Breite +
  Gutter) lebt jetzt einmal. Inhalts-agnostisch; call-site-spezifische Extras
  (`py-*`/`text-center`/`relative` …) bleiben byte-stabil ueber `className`. 11
  Dateien (Footer/TeamSection/IglooWidgetSection/Privacy/Imprint/Support/Contact/
  Downloads/About/Events/Terms) ueber die DS-API (`~/design-system`) migriert, lose
  `<div>`-Wrapper entfernt. Keine nutzersichtbare Aenderung (byte-identische
  Klassen via twMerge).
- **style · enhancement** — Container token-/config-rein (nur token-gebundene
  Tailwind-Utilities, `0` Roh-Hex/arbitrary-px). One-off-Wrapper mit abweichender
  Gutter-Signatur (`lg:px-10`, ohne `lg:px-0`) sowie der Consumer-Slice bleiben
  bewusst unberuehrt (§1.20/§1.5).

#### 2026-06-24 — Panel-Molecule (Design-System)

- **script · new** — Kanonisches `Panel`-Molecule
  (`src/design-system/compound/panel.tsx`) als Single Source of Truth
  (Holy Grail): die zuvor in `ContactPage` und `SupportPage` sechsfach roh
  gepflegte weisse Form-/Info-Flaeche lebt jetzt einmal. Inhalts-agnostisch;
  orthogonale Achse `padding` (md/lg). Abgrenzung zu `Card`: Panel = ruhende
  Flaeche (kein Hover-Lift), Card = erhobene, klickbare Karte. Beide Seiten ueber
  die DS-API (`~/design-system`) migriert, lose Roh-`<section>` entfernt.
- **style · enhancement** — Panel vollstaendig token-getrieben (`--panel-*`-
  Component-Tokens statt Roh-Tailwind-Flaeche). Flaeche/Radius byte-identisch
  rollenbasiert geroutet (`bg-white` → `--color-surface`, `rounded-2xl` →
  `--radius-lg`/16px).
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): Schatten von
  Roh-`shadow-sm` (pures #000, §FIL-Verstoss) → `--shadow-1` (Navy-getoent,
  identisch mit Card) — vereinheitlicht die Containment-Flaechen.

#### 2026-06-24 — EmptyState-Feedback (Design-System)

- **script · new** — Kanonisches `EmptyState`-Feedback
  (`src/design-system/feedback/empty-state.tsx`) als Single Source of Truth
  (Holy Grail): der Leerzustand „kein Datensatz / keine Treffer". Schliesst die
  UI-State-Familie der feedback-Ebene (loading=`Spinner`, error/success=`Alert`,
  **empty**=`EmptyState`). Inhalts-agnostisch (`title`); orthogonale Achse
  `variant` (plain/outlined). `SearchModal` (No-Results) + `DownloadsPage`
  (comingSoon) ueber die DS-API (`~/design-system`) migriert, lose Roh-`<div>`
  entfernt.
- **style · enhancement** — EmptyState vollstaendig token-getrieben
  (`--empty-state-*`-Component-Tokens statt Roh-Tailwind-Farben). Farben
  byte-identisch rollenbasiert geroutet (`gray-500`/`gray-300`/`slate-50` →
  `--color-fg-muted`/`--color-border-strong`/`--color-bg`).
- **markup · enhancement** — Leerzustand kuendigt sich jetzt hoeflich an
  (`role="status"`, vorher stummes `<div>`) — A11y (§1.11), keine Optikaenderung.

#### 2026-06-24 — Accordion-Molecule (Design-System)

- **script · new** — Kanonisches `Accordion`-Molecule
  (`src/design-system/compound/accordion.tsx`) als Single Source of Truth
  (Holy Grail): das zuvor inline in `FAQSection` gepflegte, stateful Aufklapp-
  Widget lebt jetzt einmal. Inhalts-agnostisch (`items`); Single-Open-Verhalten.
  `FAQSection` auf die DS-API (`~/design-system`) migriert und auf einen duennen
  Organism (SectionHeader + Accordion + Footer) reduziert.
- **style · enhancement** — Accordion vollstaendig token-getrieben (`--accordion-*`-
  Component-Tokens statt Roh-/Default-Tailwind-Farben). Rahmen/Antwort-Text/Hover
  waren zuvor nicht-token-gebundene Tailwind-Defaults (`gray-200`/`gray-600`/
  `gray-50`) → jetzt rollenbasiert (`--color-border`/`--color-fg`/`--color-bg-subtle`);
  Frage/Chevron byte-identisch geroutet.
- **markup · enhancement** — Tastatur-Fokus jetzt sichtbar (`focus-visible`-Ring,
  vorher keiner); Inhalts-Region mit `role="region"` + `aria-labelledby`,
  dekorativer Chevron `aria-hidden` (A11y, §1.11). Empty-State: leere `items`
  rendern keine tote, gerahmte Panel-Flaeche mehr.

#### 2026-06-24 — Stat-Atom (Design-System)

- **script · new** — Kanonisches `Stat`-Atom (`src/design-system/core/stat.tsx`)
  als Single Source of Truth (Holy Grail): die einzelne Kennzahl (Wert + Suffix +
  Label). Struktur-agnostischer Name (`Stat` statt `StatItem`). Legacy
  `components/ui/StatItem.tsx` entfernt; `HeroSection` auf die DS-API
  (`~/design-system`) migriert.
- **style · enhancement** — Stat vollstaendig token-getrieben (`--stat-*`-
  Component-Tokens statt Roh-`text-white`/`brand-secondary`/`white/80`).
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): ungenutzte
  `size`-Achse entfernt (beide Call-Sites nutzten nur `sm`, §1.20); Suffix-Farbe
  von Roh-Blau (`brand-secondary`) → kanonischer On-Dark-Accent (Teal), konsistent
  mit Breadcrumbs/Eyebrow/Button-Outline.

#### 2026-06-24 — Breadcrumbs-Molecule (Design-System)

- **script · new** — Kanonisches `Breadcrumbs`-Molecule
  (`src/design-system/compound/breadcrumbs.tsx`) als Single Source of Truth
  (Holy Grail). Legacy `components/ui/Breadcrumbs.tsx` entfernt; alle 9
  Call-Sites (About/ArticlesIndex/Contact/Downloads/Article/Service/Events/
  ServicesOverview/Support) auf die DS-API (`~/design-system`) migriert.
- **style · enhancement** — Breadcrumbs vollstaendig token-getrieben
  (`--breadcrumb-*`-Component-Tokens statt nacktem `text-white/70` u. Roh-Farben).
- **markup · enhancement** — Empty-State: leere `items` rendern kein totes `<nav>`
  mehr; dekorativer Trenner-Chevron jetzt `aria-hidden` (A11y, §1.11).
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): ungenutzte
  `variant`-Achse entfernt (alle Call-Sites nutzten nur `dark`, §1.20);
  Link-Hover von Roh-Blau (`brand-secondary`) → kanonischer On-Dark-Accent (Teal),
  konsistent mit Button-Outline/Eyebrow.

#### 2026-06-24 — Badge-Atom (Design-System)

- **script · new** — Kanonisches `Badge`-Atom (`src/design-system/core/badge.tsx`)
  als Single Source of Truth (Holy Grail): die zuvor in `EventsPage` und
  `VitaminD3SprayPage` dreifach roh gepflegte Status-/Kategorie-Pill lebt jetzt
  einmal. Inhalts-agnostisch (Icon via `children`); orthogonale Achsen `variant`
  (brand/accent/success) + `uppercase`. Beide Seiten ueber die DS-API
  (`~/design-system`) migriert.
- **style · enhancement** — Badge vollstaendig token-getrieben (`--badge-*`-
  Component-Tokens statt Roh-/Legacy-Tailwind-Farben).
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): Farben jetzt
  rollenbasiert (DS-Rollen, konsistent mit Button/Alert) — `brand` = Navy,
  `accent` = Teal, `success` = DS-Success (vorher Roh-`green-50`/`green-700`, nicht
  token-gebunden); Font-Weight auf `medium` vereinheitlicht (EventsPage war
  `semibold`). Beide EventsPage-Badges bleiben distinkt (Navy vs. Teal).

#### 2026-06-24 — Feedback-Slice: Alert + Spinner (Design-System)

- **script · new** — Neue `feedback`-Ebene mit kanonischem `Alert` und `Spinner`
  (`src/design-system/feedback/`) als Single Source of Truth (Holy Grail). Legacy
  `ui/Alert.tsx` + `ui/LoadingSpinner.tsx` entfernt; alle 4 Call-Sites
  (`ContactForm`/`SupportForm`/`SearchModal`/`ArticlePage`) auf die DS-API
  (`~/design-system`) migriert.
- **style · enhancement** — Alert + Spinner vollstaendig token-getrieben
  (`--alert-*` / `--spinner-color` statt Roh-Tailwind-Farben). Alert-Farben jetzt
  rollenbasiert (Slate-Neutrals + Feedback-Tokens, Kontrast ≥4.5:1).
- **markup · enhancement** — Alert kuendigt Fehler assertiv an (`role="alert"`),
  Hinweis/Erfolg hoeflich (`role="status"`); Spinner mit `role="status"` +
  optionaler `sr-only`-Statusbeschriftung (A11y, §1.11).
- **script · other** — `LoadingSpinner` → `Spinner` (Industriestandard-Name ohne
  `Loading`-Praefix); Alert-`variant="destructive"` → `variant="danger"`
  (Shared-Vocabulary, an den `--color-danger`-Token angeglichen). Keine
  nutzersichtbare Verhaltensaenderung ausser den dokumentierten Farb-/Navy-Shifts.

#### 2026-06-24 — Card-Molecule (Design-System)

- **script · new** — Kanonisches `Card`-Molecule (`src/design-system/compound/`)
  als Single Source of Truth (Holy Grail): die zuvor in `ServiceCard` und
  `BlogCard` doppelt gepflegte Glass-Panel-Oberflaeche mit Hover-Lift lebt jetzt
  einmal. Inhalts-agnostisch, polymorph (`to`/`href`/`as`); orthogonale Props
  (`padding`, `interactive`). Beide Karten ueber die DS-API (`~/design-system`)
  migriert — byte-identischer Klassen-Satz, keine nutzersichtbare Aenderung.

#### 2026-06-24 — Eyebrow-Atom + SectionHeader-Molecule (Design-System)

- **script · new** — Kanonisches `Eyebrow`-Atom (`src/design-system/core/`) +
  `SectionHeader`-Molecule (`compound/`) als Single Source of Truth (Holy Grail).
  Legacy `ui/Eyebrow.tsx` + `ui/SectionHeader.tsx` (Default-Export) entfernt; alle
  14 SectionHeader- + 6 Eyebrow-Call-Sites auf die DS-API (`~/design-system`) migriert.
- **style · enhancement** — Eyebrow + SectionHeader-Default-Titel vollstaendig
  token-getrieben (`--eyebrow-*` / `--section-header-*` statt Roh-/Arbitrary-Werten).
- **style · other** — Sichtbare Optik (bewusst, reversibel, §1.6): Eyebrow-Inner-Pill
  Radius 2 → 4px; SectionHeader-Default-Titel ohne `titleClassName` jetzt konstant 40px
  (vorher Desktop-Bump 44px), Leading 47 → 52px. Per `titleClassName` ueberschriebene
  Titel (prominente Sektionen) unveraendert.

#### 2026-06-24 — Select-Atom + FormField-`as`-Achse (Design-System)

- **script · new** — Drittes Eingabe-Atom `Select` (`src/design-system/core/`)
  als Single Source of Truth (Holy Grail), Familienpartner von `Input`/`Textarea`.
  Native `<select>`-Semantik (OS-Pfeil, Tastatur) bleibt erhalten (§1.6).
- **script · other** — FormField waehlt das Host-Element jetzt ueber **eine**
  Achse `as="input" | "textarea" | "select"` (§Phase 2.9) statt des Einzweck-
  Booleans `multiline`. Beide Formulare (`ContactForm`/`SupportForm`) migriert.
- **style · enhancement** — Auswahlfelder vollstaendig token-getrieben
  (`--input-*` statt Roh-/Arbitrary-Werten); Fokus-Ring auf Navy-Token statt
  Roh-`brand-primary`.
- **style · enhancement** — Selects jetzt ≥16px Schrift (vorher 14px) →
  verhindert iOS-Auto-Zoom; Tap-Target 40 → 44px (A11y, WCAG 2.2 AA).
- **markup · enhancement** — Select-Label jetzt verpflichtend per FormField
  (`htmlFor`/`aria-invalid`/`aria-describedby`) verknuepft statt loser `<label>`.

#### 2026-06-24 — Input/Textarea-Atome + FormField-Molecule (Design-System)

- **script · new** — Kanonische Eingabe-Atome `Input`/`Textarea`
  (`src/design-system/core/`) + `FormField`-Molecule (`compound/`) als Single
  Source of Truth (Holy Grail). Legacy `ui/Input.tsx` + `ui/Textarea.tsx`
  (Atom-/Molecule-Mischung) entfernt; `ContactForm` + `SupportForm` migriert.
- **style · enhancement** — Felder vollstaendig token-getrieben (`--input-*`-
  Component-Tokens statt Roh-/Arbitrary-Werten).
- **style · enhancement** — Eingabefelder jetzt ≥16px Schrift (vorher 14px) →
  verhindert iOS-Auto-Zoom; Tap-Target 40 → 44px (A11y, WCAG 2.2 AA).
- **markup · enhancement** — FormField verknuepft Label/Fehler verpflichtend per
  `htmlFor`/`aria-invalid`/`aria-describedby`; Fehlertext als `role="alert"`.

#### 2026-06-24 — Button-Call-Sites auf Barrel (Design-System)

- **script · other** — Alle App-Importe des Buttons auf die oeffentliche
  DS-API umgestellt (`~/design-system`); Re-Export-Shim
  `src/components/ui/Button.tsx` entfernt. Genau eine Quelle pro Komponente
  (Holy Grail). Keine nutzersichtbare Aenderung.

#### 2026-06-24 — Button-Atom (Design-System)

- **script · new** — Kanonisches Button-Atom in `src/design-system/core/button.tsx`
  als Single Source of Truth (Holy Grail); `src/design-system/index.ts` (Barrel).
  `src/components/ui/Button.tsx` ist nun ein Re-Export-Shim — bestehende
  Import-Pfade bleiben gueltig.
- **style · enhancement** — Button vollstaendig token-getrieben (Component-/
  Semantic-Tokens statt Roh-/Arbitrary-Werten). Tap-Target jetzt ≥44px auf allen
  Groessen (A11y, WCAG 2.2 AA).
- **style · enhancement** — Sichtbare Optik (bewusst, reversibel):
  - Primary: Verlauf-mit-weissem-Innenfeld → flaches Navy (CTA-Token).
  - Secondary: Navy-solid → Line/Ghost (Border + heller Hover).
  - Outline: unveraendert (weiss auf dunklem Grund), nun token-rein.
