# Design-Varianten (Preview) — fresh-1 · fresh-2 · fresh-3

Drei umschaltbare, **buchtreue** Auffrischungen des bestehenden Looks als reine
Token-Themes über `[data-theme="fresh-1|fresh-2|fresh-3"]` am `<html>`-Element.
**Default (kein `data-theme`) bleibt unverändert** — byte-identisch zum Ist-Zustand.

Alle drei folgen **STRENG** den `[FIL]`/`[BUD]`/`[NOR]`-Foundations
(8pt-Soft-Grid + non-lineare Spacing-Skala, handgebaute Typo um 16px, ROLLEN­basierte
Farbe, WCAG-2.2-AA-Kontrast, leichte Radien, palette-getönte Low-Opacity-Schatten
nur auf erhobenen Elementen, 12-Spalten-Grid). Sie unterscheiden sich **NUR** in
zulässigen Ausdrucks-Entscheidungen **innerhalb** dieser Regeln — nichts Buch-Widriges.

Der **Kern des Auffrischens** = mehr Weißraum durch **großzügigere Nutzung der
8pt-Skala** (größere Section-Paddings/Gaps/Hero-Luft) — buchtreu skaliert (nur
gerade 8pt-Vielfache), nicht beliebig.

## Mechanik (tokens-only, §1.7 / §3.0 A)

Geändert wurden **ausschließlich Token-Werte** in drei Dateien:

- `src/design-system/tokens/tokens.css` — die drei `[data-theme="fresh-*"]`-Blöcke
  binden Primitive-/Semantic-Kanäle, Spacing-, Radius-, Shadow- und Typo-Tokens neu.
  Es gibt **keine** Komponenten-Duplikate; die fertigen Farb-/Style-Tokens leiten
  automatisch ab.
- `tailwind.config.js` — zwei additive Brücken, damit Themes site-weit wirken:
  - `padding-*` und `gap-*` → `var(--space-*)` (nur Paddings/Gaps, **keine** Negative;
    `margin`/`inset` bleiben Tailwind-Default → keine `calc()`-Negation nötig).
    `width`/`height` bleiben auf der Tailwind-Spacing-Skala (**Soft Grid**: nur
    Abstände skalieren, nicht die Eigengrößen der Komponenten).
  - `rounded-*` → `var(--radius-tw-*)` (Eck-Rundung themebar).
  - **Default-Werte aller Brücken = Tailwind-Defaults → byte-identisch** (kein
    visueller Change am Ist-Look, §1.6).
- `src/design-system/tokens/tokens.ts` — keine Roh-Werte (spiegelt nur Logik),
  daher unverändert.

### Was theme­bar ist (und was bewusst nicht)

Farb-Rollen (über Primitive + Semantic-Kanäle), Schatten (`--shadow-1/2/3`),
Display-Typo (`--font-size-display*`, Leading, Tracking), Section-Paddings/Gaps
(`--space-12/16/20/24`) und Radien (`--radius-*`, `--radius-tw-*`) reagieren auf das
Theme. **Kleine** Spacing-Stufen (`--space-1…10`) bleiben pro Theme konstant, damit
Komponenten-Innengeometrie (Button-/Card-/Input-Padding) stabil bleibt — nur der
**Section-Rhythmus** atmet.

## Umschalter & teilbare Links

- **Preview-Umschalter** unten rechts (`ThemePreviewSwitcher.tsx`): Buttons
  `Aktuell · V1 · V2 · V3` setzen das aktive `[data-theme]` am `<html>` und
  persistieren in `localStorage` (`polaris-preview-theme`). Klein/unaufdringlich,
  a11y-ok (native `<button>`, `aria-pressed`, tastaturbedienbar, sichtbarer Fokus).
- **`?v=0|1|2|3`** (0 = aktueller Look) für teilbare Links. Ein FOUC-freies
  Inline-Script in `index.html` wertet `?v` bzw. `localStorage` **vor** dem
  Hydration-Bundle aus → kein Flash.

---

## fresh-1 „Klar & ruhig"

**Betonte Prinzipien:** strenge `[FIL]`-Minimal-Hierarchie — maximaler Weißraum,
Primary **nur** für Aktion/Focus (Navy bleibt kanonisch), kalte/entsättigte
Neutrals, sehr subtile Schatten, dezente (kleinere) Radien, ruhige Typo.

| Dimension | Default | fresh-1 |
| --- | --- | --- |
| Neutrals | Slate (kühl) | kühler & **entsättigt**: 50 `#f9fafb` · 100 `#f3f4f6` · 200 `#e2e4e8` · 500 `#636975` · 700 `#303642` · 900 `#10141d` |
| Primary | Navy `#083358` | **unverändert** (Primary bewusst reserviert für Aktion/Focus) |
| Spacing (Section) | 12=48 · 16=64 · 20=80 · 24=96 | **12=56 · 16=80 · 20=104 · 24=128** (max. Weißraum) |
| Radien | lg 16 · section 24 · 2xl 16 · 3xl 24 | **dezenter:** lg 10 · section 14 · 2xl 12 · 3xl 16 (+ rounded 3px / md 4 / lg 6 / xl 8) |
| Schatten | s1 .06/.08 · s2 .15 · s3 .12 | **sehr subtil:** s1 .04/.05 · s2 24px .08 · s3 48px .08 |
| Typo | display 32→64, tracking −0.02em | **ruhiger:** display 30→56 · display-sm 26→44 · tracking −0.015em |

## fresh-2 „Souverän & redaktionell"

**Betonte Prinzipien:** starke `[FIL]`-Typo-Hierarchie (große Display-Stufen +
größere Section-/Heading-Stufen → deutlicher Größen-/Gewichtskontrast, Reading-Width
für Fließtext bleibt aktiv), strukturiert-großzügige Abstände, edlere/tiefere
Primary-Shade, mittlere Radien, weiche geschichtete Schatten. (`[FIL]`+`[BUD]` premium)

| Dimension | Default | fresh-2 |
| --- | --- | --- |
| Primary (Navy) | `#083358` / Heading `#203864` | **tiefer/edler:** Navy `#052740` · hover `#08344f` · Heading `#1b3257` |
| Neutrals | Slate | unverändert (Differenzierung über Typo/Primary/Schatten) |
| Spacing (Section) | 12=48 · 16=64 · 20=80 · 24=96 | **12=56 · 16=72 · 20=96 · 24=112** (strukturiert großzügig) |
| Radien | lg 16 · section 24 · 2xl 16 · 3xl 24 | **mittel:** lg 14 · section 20 · 2xl 14 · 3xl 20 |
| Schatten | einlagig | **weich geschichtet (2 Lagen):** s1 .05+.08 · s2 12+32px · s3 24+64px |
| Typo | H2 32 · H1/Section 40 · display 32→64 · tracking −0.02em | **starke Hierarchie:** H2 36 · H1/Section 44 · display 36→72 · display-sm 30→52 · tracking −0.025em |

## fresh-3 „Zugänglich & freundlich"

**Betonte Prinzipien:** `[NOR]` humanity-centered — wärmere/hellere (AA-konforme)
Primary-/Accent-Rolle, freundlichere größere Radien (§3.1 „leichte Rundung statt 0,
freundlicher"), energetischerer Abstands-Rhythmus, etwas mehr Feedback-Farbpräsenz,
offeneres Body-Leading. Barrierearm & einladend; keine Dark Patterns.

| Dimension | Default | fresh-3 |
| --- | --- | --- |
| Neutrals | Slate (kühl) | **warm:** 50 `#fafaf8` · 100 `#f5f4f0` · 200 `#e9e6e0` · 500 `#746e64` · 700 `#403b32` · 900 `#1e1b16` |
| Primary | Navy `#083358` | **wärmer/heller, AA (~5.5:1 weiß):** Teal-Cyan `#0e6e68` · hover `#0a5f5a` · Heading `#134e49` |
| Spacing (Section) | 12=48 · 16=64 · 20=80 · 24=96 | **12=56 · 16=72 · 20=96 · 24=120** (energetischer Rhythmus) |
| Radien | sm 4 · md 8 · lg 16 · section 24 · 2xl 16 · 3xl 24 | **freundlicher/größer:** sm 6 · md 10 · lg 20 · section 28 · 2xl 20 · 3xl 28 (+ rounded 6 / md 8 / lg 12 / xl 16) |
| Schatten | Navy-getönt | Tönung erbt die wärmere Primary automatisch (Teal-Cyan-getönt) |
| Feedback | success = green-500 | **mehr Präsenz:** success = green-600 (kräftiger) |
| Typo | leading-body 1.6 · tracking −0.02em | **lesbarer:** leading-body 1.7 · tracking −0.015em · display 34→64 |

---

> Alle drei Varianten sind medizin-tauglich, ruhig und vertrauenswürdig; AA-Kontrast
> bleibt gewahrt, Feedback immer mit Icon/Text (nie Farbe allein), keine Dark
> Patterns (`[NOR]`). Default-Look unverändert.
