# RELAUNCH-CONCEPT — Art-Direction „Souverän & redaktionell" (V2)

> **Stand:** 2026-06-25 · **Status:** finalisierte Richtung, jetzt **Default**.
> Diese Datei ist die verbindliche Art-Direction- und Copy-Referenz für den
> Relaunch. Die frühere Preview-Variante **fresh-2** ist zum **Default-Look**
> erhoben; die Token-Werte leben jetzt direkt in der Default-Ebene
> (`src/design-system/tokens/tokens.css`, `:root`). Der Preview-Umschalter
> (`ThemePreviewSwitcher`) und die Varianten **fresh-1/fresh-3** sind entfernt.
>
> Fundament unverändert: `[FIL]` Wahrnehmung/Craft · `[BUD]` Tokens/System ·
> `[FRO]` Atomic/IA · `[NOR]` humanity-centered · `[BEC]` UX-Prozess/Nielsen.
> Single Source = `tokens.css` (§3.0 A). Diese Doku **setzt keine** Rohwerte als
> Quelle — sie beschreibt die Token-Ebene.

---

## 0. Leitidee

**„Souverän & redaktionell."** PolarisDX ist ein medizintechnischer Anbieter
(Point-of-Care-Diagnostik) für Praxen in Dental, Longevity & Beauty — plus
bewusst getrennte Consumer-Landingpages. Der Look muss **Vertrauen, Präzision
und Ruhe** ausstrahlen, nicht Lautstärke. Die Richtung erreicht das über:

- **starke Typo-Hierarchie** statt Farb-Effekten (großer Größen-/Gewichts­kontrast),
- **strukturierten Weißraum** (großzügigerer Section-Rhythmus auf 8pt-Soft-Grid),
- eine **edlere, tiefere Navy-Primäraktion** als ruhigen Anker,
- **weich geschichtete, palette-getönte Schatten** (nie reines Schwarz),
- **mittlere, präzise Radien** (freundlich, nicht verspielt).

Buchtreu: kein Buch-widriger Effekt. Differenzierung läuft über Typo / Primary /
Schatten / Rhythmus — **innerhalb** der `[FIL]`/`[BUD]`-Regeln, nicht daneben.

---

## 1. Typo-System

Basis **16px**, handgebaute Skala (kein starres Ratio), self-hosted Inter Variable
(DSGVO). Min-Body 16px (`--font-size-300`). Fließtext auf **Reading-Width 68ch**
(Korridor 50–75ch).

| Rolle | Token | Wert (V2) | Einsatz |
| --- | --- | --- | --- |
| Display (Hero) | `--font-size-display` | `clamp(2.25rem, 8vw, 4.5rem)` → 36–72px | Hero-/Section-Headline |
| Display klein | `--font-size-display-sm` | `clamp(1.875rem, 6.6vw, 3.25rem)` → 30–52px | sekundäre Display-Titel |
| H1 / Section-Titel | `--font-size-900` | `2.75rem` (44px) | Seiten-/Section-Titel |
| H2 | `--font-size-800` | `2.25rem` (36px) | Untertitel |
| H3 | `--font-size-600` | `1.5rem` (24px) | Block-Überschrift |
| Body | `--font-size-300` | `1rem` (16px, MIN) | Fließtext |
| Klein/Label | `--font-size-200` / `100` | 14 / 12px | Captions, Meta |

**Leading:** tight `1.1`, heading `1.3`, body `1.6`, Display via
`--line-height-display` (clamp 42–80px). **Tracking:** Display
`--letter-spacing-tight: -0.025em` (tighter/premium), Overline/Kicker
`+0.16em` (Sperrung, Uppercase nur per CSS, nie ALL-CAPS im Text-Source).
**Gewichte:** 400/500/600/700.

**Hierarchie-Prinzip (`[FIL]`):** Kontrast entsteht über **Größe + Gewicht**,
nicht über Farbe. Ein Hero trägt genau **eine** Display-Headline; darunter Eyebrow
(Overline) + Subline (Body groß). Keine zwei konkurrierenden Großtitel pro Section.

---

## 2. Farb-Rollen

Rollenbasiert (`[FIL]`/`[BUD]`): Komponenten nutzen **Rollen**, nie Primitive.
Neutrals bleiben Slate (kühl, ruhig). Primary nur für **Aktion/Fokus**.

| Rolle | Token | Wert (V2) | Regel |
| --- | --- | --- | --- |
| Primäraktion (Navy) | `--color-action-primary` | `#052740` | CTA-Fläche, nur Aktion |
| Primary Hover | `--color-action-primary-hover` | `#08344f` | Hover/aktiv |
| Heading-Navy | `--color-fg-heading` | `#1b3257` | Überschriften |
| Body | `--color-fg` | slate-700 | Fließtext (≥4.5:1) |
| Muted | `--color-fg-muted` | slate-500 | Sekundärtext |
| Background | `--color-bg` | slate-50 | Seitengrund |
| Surface | `--color-surface` | weiß | Cards/Panels |
| Border | `--color-border` | slate-200 | Standard-Rahmen |
| Accent (Teal) | `--color-accent` | teal-600 `#0d9488` | Eyebrow, Linien, Akzent |
| Fokus-Ring | `--color-focus-ring` | Navy / on-dark = weiß | sichtbarer Fokus |

**Feedback** (Success/Warning/Danger/Rating) immer **mit Icon + Text**, nie Farbe
allein (`[FIL]`/`[NOR]`). Kontrast durchgängig **WCAG 2.2 AA**. Auf dunklem
Hero-Grund: Fokus-Ring weiß (`--color-focus-ring-on-dark`), Akzent = teal-300.

**60-30-10 bewusst nicht** als Regel: hellster Grund, dunkelster Text, Primary
sparsam für Aktion. Die tiefere Navy verstärkt diesen Anker, ohne mehr Farbfläche.

---

## 3. Spacing-Rhythmus (8pt-Soft-Grid)

Base 4px, non-lineare 8pt-Skala. **Kleine** Stufen (`--space-1…10`) **konstant**
(Button-/Card-/Input-Innengeometrie stabil). **Section-Rhythmus atmet** (V2):

| Token | V2 | vorher |
| --- | --- | --- |
| `--space-12` | **56px** | 48 |
| `--space-16` | **72px** | 64 |
| `--space-20` | **96px** | 80 |
| `--space-24` | **112px** | 96 |

Nur gerade 8pt-Vielfache (buchtreu). Section-Default-Gap = `--space-20` (96px).
**Soft Grid:** nur Abstände (padding/gap) skalieren über Tokens — Eigengrößen der
Komponenten (width/height) bleiben auf der Tailwind-Skala. 12-Spalten-Grid,
Gutter 16px, Content-Max 1200px, Page-Max 1440px.

---

## 4. Schatten & Radius

**Schatten** — weich geschichtet, **zwei Lagen**, Navy-getönt, niedrige Opacity,
nur auf **erhobenen** Elementen (`[FIL]`):

| Token | V2 |
| --- | --- |
| `--shadow-1` (raised) | `0 1px 2px /.05` + `0 2px 6px /.08` |
| `--shadow-2` | `0 4px 12px /.08` + `0 12px 32px /.12` |
| `--shadow-3` (overlay) | `0 8px 24px /.10` + `0 32px 64px /.14` |
| `--shadow-inset` | `inset 0 2px 4px /.06` (recessed Well) |

Tint = `var(--brand-navy-rgb)` → erbt automatisch die tiefere V2-Navy.

**Radius** — mittel, präzise-redaktionell:

| Token | V2 | vorher |
| --- | --- | --- |
| `--radius-sm` / `md` | 4 / 8px | unverändert |
| `--radius-lg` | **14px** | 16 |
| `--radius-section` | **20px** | 24 |
| `--radius-tw-2xl` | **14px** | 16 |
| `--radius-tw-3xl` | **20px** | 24 |
| `--radius-full` | 9999px | Pills/Avatare |

Leichte Rundung statt 0 (`[FIL]` §3.1 „freundlicher"), aber nicht verspielt.

---

## 5. Bild- & Section-Patterns

- **Hero (B2B Standard):** Split — Display-Headline + Eyebrow + Subline + **eine**
  Primäraktion links, Produkt-/Kontextbild rechts. Auf Detailseiten ohne Bild:
  Gradient-Hero (Navy → Heading-Navy) mit Breadcrumb + Display-Titel.
- **Hero (Consumer):** eigene helle/Teal-Identität (bewusst getrennt, light-Theme),
  Preis **sofort sichtbar**, frühe Order-Affordanz.
- **Section-Header:** Eyebrow (Overline, Teal) + Display-/H1-Titel, Gap 8px.
- **Stat-Band:** Kennzahlen auf Navy-Grund, on-dark-Tonalitäten (Value weiß,
  Suffix teal-300, Label 80%).
- **Feature-/Card-Grid:** Surface-Cards, `--shadow-1`, Radius `lg` (14px),
  Hover-Lift auf `--shadow-2`. Panels (statische Blöcke) ohne Hover-Lift.
- **CTA-Band:** ein dunkles Schluss-Band pro Seite (Navy-Gradient), Primär- +
  Sekundär-Aktion. Mehrfach-CTAs werden konsolidiert (siehe RELAUNCH-PLAN).
- **Bilder:** ruhig, sachlich, medizin-tauglich; Radius `lg`/`section`; kein
  Schmuck-Stock. Immer `alt`-Text; keine Information allein im Bild.

---

## 6. Komponenten-Treatments

Alle Komponenten erben **nur** Semantic-/Component-Tokens (kein Rohwert, §1.7).
Durch V2 ändern sich Werte automatisch — **keine** Komponenten-Duplikate.

- **Button (primary):** Navy `#052740`, Hover `#08344f`, Radius `md` (8px),
  Min-Höhe 44px (Tap-Target), Padding-X 32px. Sekundär = Outline/Ghost.
- **Card / Panel:** Surface, Radius `lg` (14px), `--shadow-1`. Card mit Hover-Lift,
  Panel ohne.
- **Input/Select/Textarea:** Surface, Border slate-200, Fokus = Navy-Ring,
  Min-Höhe 44px, Font ≥16px. Error: Rahmen + Ring + Texthinweis (nie Farbe allein).
- **Badge/Eyebrow/Pill:** Soft-Tints (Brand-Navy/Accent/Success), Radius `full`/`sm`.
- **Alert:** Icon + Text, rollenbasierte Tonalität (default/success/danger).
- **Accordion (FAQ):** Surface-Panel, Trigger = Heading-Navy, Chevron = muted.
- **Breadcrumbs/Stat (on-dark):** weiße/teal-on-dark-Tonalitäten mit Alpha-Abfall.
- **Prose / Rich-Content:** Body slate-700 (AA), Heading/Link/Quote = Navy-Rollen,
  Reading-Width-begrenzt.

---

## 7. Copy-Tonalitäts-Guide

### 7.1 Marken-Stimme (konstant)
**Kompetent, klar, vertrauenswürdig.** Substanz vor Superlativen. Keine
„revolutionär/beste/einzigartig"-Behauptungen ohne Beleg. Fakten- statt
Effekt-getrieben. `[NOR]`-**Klartext**: sagen, was ist und was als Nächstes zu
tun ist — nie Stacktrace, nie Fachjargon-Nebel, nie Schuldzuweisung.

### 7.2 Tonalität nach Kontext

| Kontext | Ton | Beispiel |
| --- | --- | --- |
| Hero/Marketing | souverän, einladend | „Laborergebnisse in 3 Minuten — direkt in Ihrer Praxis." |
| Experten-Content | präzise, belegt | „Die S3-Leitlinie 083-055 empfiehlt … (Quelle)." |
| Formular/Hilfe | ruhig, unterstützend | „Wir melden uns innerhalb eines Werktags." |
| Fehler | ruhig, lösungsorientiert, schuldfrei | „Diese Seite ließ sich nicht laden. Bitte neu laden." |
| Erfolg | bestätigend, knapp | „Danke — Ihre Anfrage ist eingegangen." |
| Leerzustand | orientierend, mit nächstem Schritt | „Noch keine Einträge. Legen Sie den ersten an." |

### 7.3 Copy-Regeln (bindend)
- **Anrede:** Hauptsite + B2B = **Sie** (formell), pro Sprache/Namespace konsistent.
- **Aktiv vor Passiv;** kurze Sätze; **eine Aussage pro Satz.**
- **Kein ALL-CAPS** als Schrei-Mittel (Uppercase nur per CSS `uppercase`).
- **Kein unerklärter Jargon** in Consumer-Flows; B2B-Fachbegriffe ok, wenn die
  Zielgruppe sie aktiv nutzt.
- **Zahlen/Einheiten** via `Intl.*` mit Request-Locale (nie hartkodiert en-US).
- **Jeder Fehler** nennt *was* passiert ist **und** *was die Person jetzt tut*.
- **Keine Dark Patterns** (`[NOR]` §1.13): Opt-out so leicht wie Opt-in, keine
  Fake-Knappheit/Countdowns, keine Köder-Preise, kein Confirm-Shaming.

### 7.4 Stimme nach Zielgruppe
- **B2B (Praxisinhaber:in, z. B. „Dr. Mara Keller"):** ROI, Workflow-Fit,
  Evidenz, Klarheit in ≤30s. Eine Primäraktion pro Seite.
- **Content-Researcher (z. B. „Tomasz Nowak"):** Evidenz-basiert, Quellen sichtbar,
  Reading-Width, weiterführende Ressourcen statt Sackgassen.
- **Consumer (z. B. „Lena Fischer"):** Nutzen sofort, Preis sichtbar, reibungsarm,
  emotional-klar — ohne Manipulation.

---

## 8. Schutzregel (verbindlich für alle Rewrites)

**Wörtlich erhalten — nie verändern, kürzen oder umformulieren:**

- **Medizinische Aussagen & Claims** (z. B. Osseointegration, Mangel-Prävalenz,
  Risikofaktoren, EFSA-Health-Claims auf Consumer-Produkten).
- **Studien-Zitate** (z. B. Miron et al. 2025; Javed et al. 2016; Mangano et al.
  2018; Tseneva & Perić Kačarević 2023 DOI 10.56939/DBR23136t; RKI DEGS1).
- **Regulatorik/Recht** (S3-Leitlinie 083-055 V1.0 Aug. 2025; AWMF; CE & IVDR;
  DEQAS-Klasse-A; §6 GOÄ; Impressum/Datenschutz/AGB-Texte).
- **Preise & Zahlenwerte** (z. B. ca. 50 €/Test; Spray 169 €; Maske 45 €;
  Duo 49,90 €; Dosierungen 5.000–10.000 IE D3 / 200 µg K2; Zielwerte ng/ml;
  Spec-Werte CV/VK, Maße, Gewicht).
- **Produkt-Disclaimer** (Nahrungsergänzung ≠ Arzneimittel; Kosmetik nur äußerlich).

**Erlaubt:** Umstellen/Gruppieren von Sections, Überschriften/Übergänge/Eyebrows
neu schreiben, Marketing-Verbindungstexte schärfen — solange **kein** geschützter
Fakt berührt wird. **Nichts inhaltlich streichen** (siehe RELAUNCH-PLAN).

---

## 9. Mechanik (wie V2 Default wurde)

- `tokens.css :root` trägt jetzt die V2-Werte (Navy, Section-Spacing, Typo-Skala,
  Display-Clamps, Radien, geschichtete Schatten, Tracking). Kommentare markieren
  Vorher-Werte (`RELAUNCH V2`).
- `[data-theme="fresh-1|2|3"]`-Blöcke **entfernt**; `ThemePreviewSwitcher.tsx`
  gelöscht; FOUC-Inline-Script aus `index.html` entfernt; `theme-color`-Meta auf
  `#052740` aktualisiert.
- `tailwind.config.js` referenziert weiterhin **nur** `var(--token)` → keine
  Doppelpflege; V2 wirkt site-weit über die Default-Token-Ebene.
- Dark-Theme (`[data-theme="dark"]` + `prefers-color-scheme`) und das bewusste
  Consumer-`[data-theme="light"]` bleiben aktiv und komponieren mit der V2-Basis.

**Gates grün gehalten:** `build` ✓ · `typecheck` ✓ · `lint` (0 Errors) ✓.
