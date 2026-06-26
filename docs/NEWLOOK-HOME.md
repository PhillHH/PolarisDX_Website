# NEWLOOK-HOME — PolarisDX Startseite & globale Chrome (Medtech-Relaunch)

> Verbindliches Design-Konzept für den kompletten Neuauftritt der **Startseite**
> plus **Header/Navigation/Footer**. Eine kohärente Vision — in **jeder** Iteration
> lesen und konsistent darauf hinarbeiten, nicht neu erfinden.

## 0. Auftrag & Leitplanken

- **Kompletter Neuauftritt**, keine Token-Politur, kein Recycling der bisherigen
  Section-Kompositionen. Layout, Hero und Bildaufteilung werden **neu erfunden**.
- **Referenz-Anmutung (verbindlich):** Philips Healthcare / Siemens Healthineers —
  sehr clean, viel Weißraum, große selbstbewusste Hero-Fläche (ruhig, produkt-/
  glaubwürdigkeitsstark), bold Sans mit **starker Hierarchie**, premium &
  vertrauenswürdig, **blauer Marken-Akzent auf viel Weiß**, klare einzelne CTAs,
  ruhige Iconografie, großer Section-Rhythmus. Modern, hochwertig, **nicht**
  verspielt, **nicht** generisch-SaaS, **nicht** der Ist-Look.
- **Hart behalten:** PolarisDX-**Logo** + **primäre Markenfarben** (Navy/Blau bleibt
  Marke, eingesetzt als **Akzent auf Weiß**). Alle **Inhalte/Texte/Claims/Preise**
  bleiben — Wording darf selbstbewusst-medtech nachgeschärft werden, **keine**
  Fakten/medizinischen Aussagen erfinden oder streichen.
- **Technik:** Stack bleibt (Vite/React-SSR, Tailwind, Tokens). WCAG 2.2 AA,
  responsive sm/md/lg/xl, alle UI-States. Nach jeder Einheit Gates grün
  (typecheck/lint/build:client).

## 1. Kern-Wechsel gegenüber Ist-Zustand

| | Ist (V2 „Souverän & redaktionell") | NEU („Clarity" / Medtech-White) |
|---|---|---|
| Grundton | Dunkler Navy-Gradient-Hero, dunkler Header über allem | **Weiß / hell**, ein einziger dunkler Navy-Moment (Schluss-CTA) |
| Header | transparent → Navy/85, **weißes** Logo, weiße Nav | **Hell** (Surface/Blur), **dunkles** Logo, Navy-Nav, Navy-CTA |
| Hero | Navy-Slider (3 Slides), Icon-Glows, animiert | **Eine** ruhige, selbstbewusste Aussage; Fotografie (Ärztin+Gerät) auf hellem Blau-Wash, **kein** Slider |
| Rhythmus | gap-20 Stack | **Großer** Section-Rhythmus (py-24/py-32), klare Bänder |
| Bildwelt | klein, dekorativ | **groß & selbstbewusst** (freigestellte Fotos/Produkt auf Weiß) |
| Akzent | Teal-Eyebrow-Pills, Gradient-Ränder | reduzierte **Blau/Navy**-Akzente, dünne Linien, ruhige Lucide-Icons |

Der dunkle Navy bleibt Markenanker — aber **dosiert**: genau **ein** dunkles Band
(Schluss-CTA) + dunkler Footer rahmen die helle Seite (Siemens-Healthineers-Logik).

## 2. Art-Direction

### Farbe (rollenbasiert, Tokens aus `tokens.css`)
- **Canvas:** `bg` (slate-50) als Seiten-Grund, `surface` (weiß) für Bänder/Cards.
  Wechsel hell/heller erzeugt Rhythmus ohne Linien.
- **Text:** `fg-heading` (Navy #1b3257) für Headlines, `fg` (slate-700) Body,
  `fg-muted` (slate-500) Sekundär.
- **Marken-Akzent:** `brand-navy` (CTA/Primäraktion), `brand-blue`/`brand-blue-bright`
  als Linien/Icon-/Hover-Akzent. **Teal** tritt zurück (nur dezent erlaubt).
- **Linien:** `border` (slate-200) für ruhige 1px-Trenner & Card-Ränder.
- Ein dunkler Moment: `GradientSurface` (Navy-Gradient) nur im Schluss-CTA + Footer.

### Typografie (Inter Variable, starke Hierarchie)
- **Display/H1:** `text-display` (clamp 36→72), `font-medium`/`font-semibold`,
  `tracking-headline` (−0.025em), `text-fg-heading`. Selbstbewusst groß.
- **H2/Section:** `text-display-sm` (clamp 30→52), `font-medium`, tracking-headline.
- **H3/Card:** `text-h3`/text-xl, `font-semibold`.
- **Eyebrow:** uppercase, `tracking-overline`, `text-xs/sm`, `font-semibold`,
  Farbe `brand-blue`/`accent-strong` — **als reiner Text mit kurzer Akzentlinie**,
  bewusst **ohne** die alte Gradient-Pill (cleaner, Philips-artig). Neue
  `SectionIntro`-Komposition pro Sektion.
- **Body:** `text-base`/`text-lg`, `leading-relaxed`, Lesebreite ≤ `max-w-reading`.

### Spacing & Grid
- **Section-Rhythmus:** vertikal `py-24` (112px) Standard, `py-32` für Key-Bänder.
- **Container:** `max-w-container` (1200px), `px-4` Gutter (lg:px-0 via Container).
- **Grid:** 12-spaltig gedacht; Inhalts-Split meist `lg:grid-cols-2` (Hero/Spotlight/
  Approach), Karten `md:grid-cols-2 lg:grid-cols-3`.
- **Reading-Width** für Fließtext, großzügiger Weißraum zwischen Eyebrow→Titel→Text.

### Form-Sprache
- **Radien:** Cards `rounded-3xl` (20px) / `rounded-2xl`; Buttons Token-Radius.
- **Schatten:** weich & geschichtet (`shadow-1/2`), Navy-getönt; **kein** Glow-Spam.
- **Icons:** Lucide, dünn (`strokeWidth 1.5`), `brand-blue`/`fg-heading`, in ruhigen
  quadratischen Tiles (`rounded-2xl`, `bg-brand-navy/5`).
- **Buttons:** Primär = Navy solid (`Button variant=primary`); Sekundär = Text-Link
  mit Pfeil (`→`) oder `secondary`-Outline auf Weiß. Genau **ein** primärer CTA je Band.

## 3. Hero-Konzept („Clarity Hero")

Ruhig, groß, glaubwürdig — **keine** Animation/Slider.

- **Layout:** zweispaltig (`lg:grid-cols-[1.05fr_0.95fr]`), volle Höhe ~min-h-[640px].
  Links Text, rechts Bild. Mobile: Text oben, Bild darunter.
- **Grund:** weiß/`bg`, rechts ein **weicher Blau-Wash** (radиaler `brand-blue/10`
  Verlauf + dezenter Raster/`bg-noise` ganz schwach) als Fläche hinter dem Foto —
   deutet „Klinik-Reinheit" an, ohne dunkel zu werden.
- **Inhalt links:** Eyebrow (`hero.caption`), **H1** (`hero.title`, sehr groß),
  Subline (`hero.description`), **ein** Primär-CTA (`hero.cta` → /contact) + ein
  Sekundär-Textlink (`hero.cta_downloads` → /downloads). Darunter eine schlanke
  **Trust-Zeile** (2 Stats: `hero.stat1`, `hero.stat2`) mit vertikalem Divider.
- **Bild rechts:** `hero_doctor.webp` (Ärztin mit IglooPro, freigestellt) groß,
  am Boden ausgerichtet, mit weichem Schatten; dahinter der Blau-Wash + ein
  feiner Ring/`brand-blue/15`. LCP: H1 sofort sichtbar, Bild `fetchPriority=high`.
- Die früheren Beauty/Longevity-Hero-Slides leben jetzt vollwertig in **Domains**
  (§4.4) — Inhalt erhalten, nur umkomponiert.

## 4. Sektionsplan & Reihenfolge

Neue, **atomare** Komponenten unter `src/components/sections/home/`. Reihenfolge =
Aufmerksamkeit → Glaubwürdigkeit → Produkt → Anwendung → Vorgehen → Tiefe → Stimmen →
Wissen → Fragen → Abschluss.

1. **HomeHero** — Clarity-Hero (§3). H1.
2. **HomeTrustBar** — schlanke Credibility-Leiste auf Weiß: 4 Kennzahlen
   (CV<2 %, 3–5 Werktage, 90 % Lateral-Flow-Kompatibilität, 250+ Rezensionen).
   Inhaltlich aus `hero.stat*`, `services.kompatibilitaet`, `testimonials.ratingLabel`.
3. **HomeProductSpotlight** — IglooPro als Held: großes freigestelltes Produktfoto
   (`Igloo-pro-frontal.webp`) auf Weiß + Eyebrow/Titel/Text (`doctors.*`) + 3
   Mini-Spezifikationen + CTA → /igloo-pro.
4. **HomeDomains** — Anwendungsbereiche Dental/Beauty/Longevity als drei große,
   ruhige Karten (Icon-Tile, `services.dental/beauty/longevity` Titel+Text,
   Link → /diagnostics/…). Abschluss-Link „Alle Diagnostik-Services" → /diagnostics.
5. **HomeApproach** — „Performance-Setup / Einsatzbereit ab Tag 1" (`about.*`):
   zweispaltig mit `igloo_explode.webp`; rechts Text + 3 nummerierte Schritte
   (Konfiguration → Validierung → erste Messung, aus `about.text*` abgeleitet) + CTA.
6. **HomeFocusGrid** — Diagnostik-Fokus: 6 Themenkarten (`services.*`:
   POC-Systemlösungen, Präventions-Checks, Infektion/Entzündung, Stoffwechsel/Herz,
   Hormon-Tests, Kompatibilität) als ruhige bordered Cards mit Lucide-Icons.
7. **HomeVoices** — Testimonials, **hell** neu: zentrierte Zitat-Karte auf Weiß,
   Avatar, 5-Sterne (a11y-Label), Slider mit Reduced-Motion-Respekt, darunter
   Rating-Stats (4.9 / 100 %). Inhalt = `testimonials.*` + `data/testimonials`.
8. **HomeMagazine** — Magazin: ein Featured-Artikel (Vitamin-D3-Implantologie) +
   3 `BlogCard` (aus `blogPosts`), Link → /articles.
9. **FAQSection** — bestehendes Bauteil (bereits hell, a11y-Accordion) wiederverwenden.
10. **FinalCtaSection** — der **eine** dunkle Navy-Abschluss (`CtaBand`/`GradientSurface`),
    Demo-CTA. Unverändert wiederverwendet (ein dunkles Band pro Seite).

## 5. Globale Chrome

### Header (hell, Medtech)
- **Immer hell:** `surface/80` + `backdrop-blur`, untere 1px-`border`; auf Scroll
  (`>24px`) leicht kräftiger (Opacity/`shadow-1`). Kein transparenter Zustand mehr.
- **Logo:** `polarisdx_logo.webp` (dunkel/farbig — passt auf Weiß).
- **Nav:** `text-fg`/`fg-heading`, Hover `brand-blue` + Underline-Sweep. Dropdown
  bereits hell (Surface). Fokus-Ring **Navy** (`--color-focus-ring`), AA-sichtbar.
- **Aktionen:** Suche (Icon, Hover `bg-fg/5`), `LanguageSwitcher` (auf hell
  getrimmt), **Primär-CTA Navy** (`Button primary`, immer).
- **Mobile:** helle Sheet (`surface`), dunkle Typo, gleiche Tokens, Tap ≥44px.

### Footer (premium dunkel)
- Bleibt dunkler Anker (`GradientSurface`/Navy), aber aufgeräumt: **weißes** Logo
  (`polaris_white.webp`) für Kontrast, klare Spalten (Links / Diagnostik / Standorte),
  Social, feine `fg-on-dark/10`-Divider, Legal-Zeile. Inhalte/Links unverändert.

## 6. A11y & States (WCAG 2.2 AA)
- Kontrast: Navy-Text auf Weiß und Weiß auf Navy ≥ 4.5:1; `fg-muted` nur für
  Sekundärtext ≥ 4.5:1. Akzent nie als alleiniger Bedeutungsträger.
- Fokus sichtbar überall: hell → Navy-Ring, dunkel (Hero-Foto-Wash/CTA/Footer) →
  weißer Ring (`--color-focus-ring-on-dark`).
- Tap-Targets ≥ 44px. Reduced-Motion respektiert (Slider/Transitions).
- Semantik: genau **eine** H1 (Hero), Sektionen mit H2; Landmarks via Layout.
- Bilder: sinnvolle Alt-Texte; rein dekorative Flächen `aria-hidden`.
- **ASSUMPTION — needs real photography:** wo echte Medtech-Fotografie fehlt
  (Spotlight/Approach-Flächen), sauberes Treatment auf Weiß als Platzhalter.

## 7. Definition of Done
- Startseite + Header/Navigation/Footer im neuen hellen Medtech-Look.
- Alle Inhalte/Claims/Preise erhalten; eine kohärente Vision umgesetzt.
- Responsive sm/md/lg/xl, alle UI-States, AA.
- `typecheck` + `lint` + `build:client` grün.
