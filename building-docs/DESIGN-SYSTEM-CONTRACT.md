# DESIGN-SYSTEM-CONTRACT — Sales-Machine, Light Theme

**Kanonischer Design-System-Vertrag des PolarisDX Website Relaunch.**
Angelegt in **AP05 / PT05.1** (`work-packages/AP05.md` §5), weil kein kanonisches
Design-System-Artefakt existierte.

**Status:** aktiv · **Stand:** 2026-08-25 (PT05.5)
**Owner-AP:** AP05 · **A11y-Owner:** AP24 (umfassend)

---

## 0. Was dieses Dokument ist — und was nicht

Dieses Dokument hält **nur fest, was nicht bereits vollständig und ausführbar in Code
codiert ist**: Grenzen, Rollen, Semantik und Politik.

**Es ist keine zweite Token-Wahrheit.**

| Frage                                   | Autoritative Quelle                                      |
| --------------------------------------- | -------------------------------------------------------- |
| Welche Farbe hat ein Token?             | `tailwind.config.js`                                     |
| Welcher Hexwert ist überhaupt zulässig? | `scripts/check-color-tokens.mjs` (`PALETTE_HEX`)         |
| Welche Basis-/Komponentenschicht gilt?  | `src/index.css`                                          |
| Wird die Regel durchgesetzt?            | `lefthook.yml` (pre-commit) + `.github/workflows/ci.yml` |

Wo dieses Dokument von `tailwind.config.js` abweicht, **gewinnt der Code**. Wer einen
Widerspruch findet, korrigiert dieses Dokument — nicht den Code, es sei denn, der
zuständige AP verlangt genau das.

**Nicht kanonisch:** `docs/design-system.md` ist ein Phase-1-Ist-Schnappschuss mit
nachweislich veralteten Werten und trägt seit PT05.1 einen entsprechenden Banner.

---

## 1. Art-Direction-Grenze (`DEC-RL-002`, `LOCKED`)

- **Sales-Machine** aus `feat/home-leadmagnet` ist die **einzige** Art Direction des Relaunch.
- AP05 **konsolidiert** sie. AP05 ersetzt sie nicht und erweitert sie nicht um eine zweite Bildsprache.
- `redesign/preview` liefert **ausschließlich art-direction-neutrale** QA-, Test- und System-Patterns
  (Testaufbau, Visual Regression, Error Boundary, Interaction-/A11y-Patterns).

**Verboten — auch wenn ein Quell-Branch es nahelegt:**
alternative Farbwelten · Archon-Art-Direction · alternative Typografie · alternative
Branding-Sprache · alternative Radius-/Shadow-/Hero-Sprache, die Sales-Machine widerspricht.

## 2. Light Theme (`DEC-RL-003`, `LOCKED`)

Light ist der **einzige** Relaunch-Theme-Modus. Verbindlich und in PT05.1 empirisch bestätigt:

| Invariante                                         | Ist-Zustand (PT05.1 gemessen)                                              |
| -------------------------------------------------- | -------------------------------------------------------------------------- |
| keine `dark:`-Variante in Produktoberfläche        | **0 Treffer** in `src/**`                                                  |
| kein `darkMode` in `tailwind.config.js`            | **nicht gesetzt** (Default `media` bleibt ungenutzt, da 0 `dark:`-Klassen) |
| kein `prefers-color-scheme`                        | **0 Treffer**                                                              |
| kein Theme-Switcher / `data-theme` / ThemeProvider | **0 Treffer**                                                              |
| keine parallele Dark-Token-Familie                 | **keine**                                                                  |

**Dunkle Flächen sind kein Dark Theme.** Navy-Hero, Navy-Final-CTA, Navy-Header und
`glass-panel-dark` sind reguläre Light-Theme-Komponenten mit dunkler Fläche. Für sie gilt
die Akzentrolle `accent.on-dark`, nicht eine zweite Palette.

**DS-Regel:** Wer eine `dark:`-Klasse, einen Theme-Switch oder ein zweites Token-Set
einführen will, verletzt `DEC-RL-003`. Das ist kein Design-, sondern ein Scope-Verstoß.

---

## 3. Token-Semantik

### 3.1 Marke

| Token                    | Hex       | Rolle                                                                              |
| ------------------------ | --------- | ---------------------------------------------------------------------------------- |
| `brand.navy` / `heading` | `#083358` | **DIE Navy.** Überschriften-/Body-Ink, Hero- und Final-CTA-Flächen, dunkle Bänder. |
| `brand.navy-hover`       | `#0a3f63` | CTA-Hover auf Navy; `theme-color`, OG-Bild.                                        |
| `brand.blue`             | `#0d527f` | Sekundäres Markenblau: Footer-Fläche, Prosa-Links.                                 |
| `brand.secondary`        | `#2f6fa0` | Helles Blau: Gradient-Start, Link-Hover.                                           |

### 3.2 Akzent — genau einer

| Token            | Hex       | Rolle                                        | Kontrast                                                  |
| ---------------- | --------- | -------------------------------------------- | --------------------------------------------------------- |
| `accent.DEFAULT` | `#0d9488` | Primär-CTA-Fläche, Icon-Tiles, Akzentflächen | 3,74:1 auf Weiß → **Flächen/Große Typo, nicht Fließtext** |
| `accent.strong`  | `#0f766e` | Akzent-**Text** auf hell, Hover-Emphasis     | 5,47:1 → AA-Text                                          |
| `accent.line`    | `#14b8a6` | dekorative Linien, Unterstreichungen         | 2,49:1 → **nur Dekor**                                    |
| `accent.soft`    | `#f0fdfa` | Pill-/Tint-Flächen                           | Fläche                                                    |
| `accent.border`  | `#99f6e4` | Pill-Ränder                                  | Dekor                                                     |
| `accent.on-dark` | `#2dd4bf` | **DER** Akzent auf Navy                      | 6,94:1 auf `#083358` → AA-Text                            |

**Regel:** Akzent-**Text** auf Weiß ist `accent.strong`, nicht `accent.DEFAULT`.
Akzent-**Text** auf Navy ist `accent.on-dark`.

### 3.3 Status- und Befundfarben — vom Marken-Akzent getrennt

`success` ist bewusst **nicht** der Akzent: Emerald trägt in S3-Leitlinie und
Vitamin-D3-Implantologie eine Gesundheits-/Erfolgsbedeutung, nicht die Markenbedeutung.

| Familie                             | Rolle                       | Kontrast (gemessen, PT05.1)                      |
| ----------------------------------- | --------------------------- | ------------------------------------------------ |
| `success.DEFAULT` `#10b981`         | dekorative Fläche/Icon      | 2,54:1 → **nur Dekor**                           |
| `success.strong` `#047857`          | Erfolgs-**Text**            | 5,48:1 auf Weiß · 5,21:1 auf `success.soft` → AA |
| `success.soft` `#ecfdf5`            | Fläche                      | —                                                |
| `red-*` (Tailwind-Neutral-Ausnahme) | Fehler-/Validierungszustand | eigene Semantik, **kein** Akzent                 |

**Befund-Ampel** — ausschließlich auf den Musterbefund-Seiten, aus den Quell-PDFs gemessen,
damit Web- und PDF-Fassung dieselbe Bildsprache haben. Dreiteilige Rollentrennung:

| Rolle     | Verwendung                                               | Kontrast auf zugehörigem `soft`                          |
| --------- | -------------------------------------------------------- | -------------------------------------------------------- |
| `ink`     | **alle bedeutungstragenden** Grafiken und Beschriftungen | red 4,65:1 · amber 4,60:1 · green 4,61:1 → **AA**        |
| `soft`    | Flächen                                                  | —                                                        |
| `DEFAULT` | große dekorative Füllungen (z. B. Netzdiagramm)          | red 4,35:1 · amber 2,45:1 · green 3,97:1 → **nur Dekor** |

**Regel (WCAG 1.4.1):** Bedeutung darf **nie allein über Farbe** transportiert werden.
Befund- und Statusaussagen tragen zusätzlich Text, Label oder Icon. Die Ampel darf ihre
fachliche Befund-Semantik nicht verlieren und nicht in Marken-Teal umgedeutet werden.

### 3.4 Neutralfarben und Interaktionskontrast

Die entscheidende Trennung im System — **Dekor ≠ Bedienelement**:

| Token                 | Hex           | Kontrast auf Weiß | Zulässige Rolle                                           |
| --------------------- | ------------- | ----------------- | --------------------------------------------------------- |
| `ui.border`           | `#e2e8f0`     | 1,23:1            | Dekor/Trennlinien — **0 Call-Sites**                      |
| `ui.border-hover`     | `#cbd5e1`     | 1,48:1            | Dekor (0 Call-Sites)                                      |
| `ui.text-muted`       | `#94a3b8`     | 2,56:1            | Dekor — **0 Call-Sites**, nie für Text                    |
| **`ui.field`**        | **`#6b7280`** | **4,83:1**        | **Rahmen, Placeholder und Hilfstext von Bedienelementen** |
| `gray-500`            | `#868C98`     | 3,38:1            | `rich-content`-Body (Legacy)                              |
| `gray-700` (Tailwind) | `#374151`     | 10,31:1           | Standard-Fließtext                                        |

**Regel:** Jede Begrenzung eines **Bedienelements** (WCAG 1.4.11, 3:1) sowie
**Placeholder- und Hilfstext** (WCAG 1.4.3, 4,5:1) laufen über `ui.field`.
`ui.border` und `ui.text-muted` sind Dekor und dürfen diese Rollen nicht übernehmen.

Stand PT05.1 haben `ui.border`, `ui.border-hover` und `ui.text-muted` **0 Call-Sites** in
`src/`: die letzten Verwendungen an echten Bedienelementen sind in PT05.1 auf `ui.field`
umgestellt worden — `Textarea.tsx` (Rahmen, Placeholder, Hilfstext) sowie in
`SupportForm.tsx` der Pflicht-`<select>` und der Upload-Button. `Input.tsx` folgte der
Zuordnung bereits. Die drei Tokens bleiben als **Dekor**-Tokens verfügbar.
Fokus-Ring ist einheitlich `focus-visible:ring-2 ring-brand-primary ring-offset-2`
(`#0d527f`, 8,30:1). Disabled ist `opacity-50` + `cursor-not-allowed` — ein Zustand,
der zusätzlich über das `disabled`-Attribut assistiven Technologien gemeldet wird.

### 3.5 Legacy-Alias-Politik

Klassifikation nach **gemessenen Call-Sites in `src/`** (PT05.1):

| Alias                                             | Ziel                   | Call-Sites | Klasse           | Entscheidung                                   |
| ------------------------------------------------- | ---------------------- | ---------- | ---------------- | ---------------------------------------------- |
| `brand.deep`                                      | == `brand.navy`        | 149        | `LEGACY_ALIAS`   | **behalten**                                   |
| `brand.primary`                                   | == `brand.blue`        | 119        | `LEGACY_ALIAS`   | **behalten**                                   |
| `brand.secondary`                                 | == `brand.blue-bright` | 12         | `LEGACY_ALIAS`   | **behalten**                                   |
| `brand.navy-mid`                                  | == `brand.navy-hover`  | 0          | `DUPLICATE`      | behalten, nicht verwenden                      |
| `brand.blue-bright`                               | == `brand.secondary`   | 0          | `DUPLICATE`      | behalten, nicht verwenden                      |
| `ui.border` / `ui.border-hover` / `ui.text-muted` | —                      | 0          | Dekor, ungenutzt | behalten, nie an Bedienelementen               |
| `accentBlue`                                      | == `brand.blue`        | 0          | `DEPRECATED`     | behalten als Übergang, **nicht** neu verwenden |
| `gray-100` / `gray-500`                           | —                      | 16 / 90    | `LEGACY_ALIAS`   | behalten                                       |
| `gray-900` (`#203864`)                            | —                      | —          | **ENTFERNT**     | Guard-Regel erzwingt das Verbot                |

**Politik:** Aliase werden in PT05.1 **klassifiziert, nicht migriert.** Eine Umbenennung
von 280 Call-Sites wäre eine reine Namensmigration ohne visuelle Wirkung; `AP05.md`
ST05.1.4 schließt sie ausdrücklich aus („Keine großflächige unnötige Migration nur für
Namensästhetik"). **Neue** Call-Sites nutzen die kanonischen Namen
(`brand-navy`, `brand-blue`, `heading`, `accent-*`).

`gray-900`/`#203864` ist abgeschafft und wird vom Guard aktiv blockiert — Headline-/Body-Ink
ist `text-heading`. Das ist eine **Regel**, keine Empfehlung.

---

## 4. Typografie (AP05 / PT05.2)

**Quelle der Werte:** `src/index.css`, `@layer components`, Praefix `.t-*`.
Die Rollen sind aus dem Bestand **gemessen** (jeweils das dominante Rezept) und mit
den Aufrufstellen, die sie ersetzt haben, deckungsgleich — die Einfuehrung in PT05.2
war visuell neutral.

### 4.1 Schrift und Pipeline

Inter ist und bleibt **selbstgehostet**. Zielkette:

```
Inter Variable → Inter → Inter Fallback → system-ui → sans-serif
```

| Baustein          | Ort                                           | Zustand (PT05.2 gemessen)                                                                                          |
| ----------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Paket             | `@fontsource-variable/inter`                  | einzige Webfont-Quelle                                                                                             |
| Einbindung        | `src/entry-client.tsx`                        | genau ein Side-Effect-Import                                                                                       |
| Stack             | `tailwind.config.js` `fontFamily.sans`        | vollstaendige Kette                                                                                                |
| Fallback-Metriken | `src/index.css` `@font-face 'Inter Fallback'` | `local('Arial')`, `size-adjust: 107.12%`, `ascent 90.2%`, `descent 22.48%`, `line-gap 0%`                          |
| `font-display`    | Paket                                         | `swap` (7 Faces)                                                                                                   |
| Preload           | `server.ts` `getFontPreloadTag()`             | liest den gehashten Latin-Subset aus `dist/client/assets` und rendert `<link rel="preload" as="font" crossorigin>` |

**Verboten:** Google Fonts, `fonts.googleapis.com`, `fonts.gstatic.com`, jedes externe
Font-CDN, jede Remote-Font-Abhaengigkeit zur Laufzeit **und zur Bauzeit**.
`scripts/og-image-template.html` bezog Inter bis PT05.2 von Google Fonts und laedt es
seitdem lokal aus `@fontsource-variable/inter` (0 externe Requests gemessen).

**Bekannte Restposten (nicht AP05):** `server.ts` fuehrt `fonts.googleapis.com` und
`fonts.gstatic.com` weiterhin in `style-src`/`font-src` der CSP. Das ist eine
**Erlaubnis ohne Verwender** — sie ist in `NETWORK-ALLOWLIST.md` als `STALE_REMOVE`
(`ND-5`) registriert, Owner **AP26**. AP05 fasst die CSP nicht an.

### 4.2 Ueberschriften — Hierarchie ist semantisch, nicht optisch

Die Ebene (`h1`–`h6`) folgt der Dokumentstruktur. Die Klasse waehlt **nur die visuelle
Rolle**. Eine Ueberschriftsebene wird **nie** gewechselt, um eine Groesse zu bekommen.

| Rolle                      | Klasse                      | Werte                                                                | Typischer Traeger |
| -------------------------- | --------------------------- | -------------------------------------------------------------------- | ----------------- |
| Hero-/Seitentitel          | `.t-h1`                     | `text-4xl` → `lg:text-5xl`, 500, `tracking-tight`, **ohne Farbe**    | `h1`              |
| Sektionstitel (inline)     | `.t-h2`                     | `text-3xl` → `lg:text-[42px]`, 500, `tracking-tight`, `text-heading` | `h2`              |
| Sektionstitel (Komponente) | `.t-h2-section`             | `40px/47px` → `lg:44px/52px`, 500, plus Ueberlaufschutz              | `SectionHeader`   |
| Unterueberschrift          | `.t-h2-sub`                 | `text-xl` → `sm:text-2xl`, 600                                       | strukturell `h2`  |
| Kartentitel                | `.t-h3`                     | `text-lg`, 600                                                       | `h3`              |
| Kleintitel                 | `.t-h4` / `.t-h5` / `.t-h6` | `text-base` / `text-sm` / `text-xs uppercase`, 600                   | `h4`–`h6`         |

`.t-h1` traegt bewusst **keine** Farbe: Hero-Ueberschriften stehen sowohl auf Weiss als
auch auf Navy.

**Schriftschnitte:** 400 Fliesstext · 500 `font-medium` Ueberschriften · 600
`font-semibold` Labels, Kartentitel, Links. Mehr Schnitte gibt es nicht.

**Ueberlaufschutz** (`min-w-0 max-w-full hyphens-auto break-words`) traegt
`.t-h2-section`, weil eine zentrierte H2 im Flex-Container sonst ihre min-content-Breite
annimmt. Ebenfalls geschuetzt: `.legal-hero h1`. Die uebrigen Rollen bekommen ihn
**nicht vorsorglich** — er veraendert Zeilenumbrueche, und PT05.2 hat **0 horizontalen
Ueberlauf** ueber 10 Sprachen × 4 Seiten × 3 Viewports gemessen.

### 4.3 Textrollen

| Rolle         | Klasse                           | Werte                                           | Kontrast      |
| ------------- | -------------------------------- | ----------------------------------------------- | ------------- |
| Lead          | `.t-lead`                        | `text-lg leading-relaxed text-gray-700`         | 10,3:1        |
| Body          | `.t-body`                        | `text-base leading-relaxed text-gray-700`       | 10,3:1        |
| Small         | `.t-small`                       | `text-sm leading-relaxed text-gray-700`         | 10,3:1        |
| Lead auf Navy | `.t-lead-on-dark`                | `text-lg leading-relaxed text-white/80`         | 10,4:1        |
| Body auf Navy | `.t-body-on-dark`                | `text-base leading-relaxed text-white/80`       | 10,4:1        |
| Caption       | `.t-caption`                     | `text-xs text-ui-field`                         | 4,83:1        |
| Formularlabel | `.t-label`                       | `text-sm font-medium leading-none text-heading` | 12,9:1        |
| Hilfstext     | `.t-helper`                      | `text-sm text-ui-field`                         | 4,83:1        |
| Fehlertext    | `.t-error`                       | `text-sm font-medium text-red-600`              | 4,83:1        |
| Eyebrow       | `EYEBROW_LIGHT` / `EYEBROW_DARK` | `src/components/ui/Eyebrow.tsx`                 | 5,5:1 / 6,9:1 |

**Body-Ink ist `gray-700`.** Die im Bestand ebenfalls vorkommende `gray-600`-Variante ist
Drift und **nicht** kanonisch.

**Fehlertext ist `red-600`, nicht `red-500`.** `red-500` erreicht auf Weiss nur 3,76:1 und
ist als Textfarbe nicht AA-tauglich; `Textarea.tsx` wurde in PT05.2 entsprechend
korrigiert.

**Eyebrow wird hier nicht dupliziert** — `Eyebrow.tsx` exportiert `EYEBROW_LIGHT`/
`EYEBROW_DARK` und bleibt die einzige Quelle. Max. **eine** Eyebrow je Sektion.

### 4.4 Links

| Rolle                     | Klasse            | Regel                                                                           |
| ------------------------- | ----------------- | ------------------------------------------------------------------------------- |
| Inline-Link im Fliesstext | `.t-link`         | Farbe **und** Unterstreichung im Ruhezustand                                    |
| Longform-Prosa-Link       | `.rich-content a` | dito (seit PT05.2 im Ruhezustand unterstrichen)                                 |
| Handlungs-/Pfeil-Link     | `.t-link-cta`     | ohne Unterstreichung; zweites Signal sind Position, Gewicht 600 und Pfeil-Glyph |
| Navigationslink           | —                 | **AP06**, hier bewusst nicht definiert                                          |

**Regel (WCAG 1.4.1):** Ein Link im Fliesstext ist **nie allein durch Farbe** erkennbar.
Fokus ist einheitlich `focus-visible:ring-2 ring-brand-primary ring-offset-2` — derselbe
Ring wie an Bedienelementen.

Externe Links tragen ihre Semantik am Element (`rel="noopener noreferrer"`, ggf.
`target="_blank"`) und muessen als extern erkennbar sein, wenn das Ziel die Domain
verlaesst; die Kennzeichnung ist nicht farbcodiert.

### 4.5 Longform

| Aspekt               | Regel                                                                                   | Ort                                    |
| -------------------- | --------------------------------------------------------------------------------------- | -------------------------------------- |
| Lesebreite           | **61ch** fuer `p`, `li`, `blockquote`                                                   | `.rich-content`, `.article-col`        |
| Zeilenhoehe          | `2rem` bei `1rem` Schriftgrad                                                           | `.rich-content`                        |
| Body-Ink             | `gray-700` (bis PT05.2 `gray-500` = 3,38:1, **unter AA**)                               | `.rich-content`                        |
| Ueberschriftsabstand | `h2` `mt-2.5rem/mb-1rem`, `h3` `mt-1.5rem/mb-0.5rem`                                    | `.rich-content`                        |
| Listen               | `ol` mit gezaehlten Navy-Punkten, `ul` regulaer                                         | `.rich-content`                        |
| Tabellen             | eigener Scroll-Container mit Scroll-Andeutung; Lesebreitenregel gilt fuer sie **nicht** | `.rich-content table`, `.table-scroll` |
| Info-/CTA-Bloecke    | `.info-box` (accent-soft/border), `.cta-block` (Navy-Verlauf)                           | `.rich-content`                        |

Tabellen und CTA-Bloecke stehen bewusst ueber die volle Spaltenbreite — die 61ch-Regel
nennt ausschliesslich `p`, `li` und `blockquote`.

### 4.6 Responsive Typografie

Skalierung laeuft ueber die Breakpoints `sm`/`lg` der Rollen, **nicht** ueber
sprachabhaengige Sonderregeln. **Es gibt keine `font-size`-Ausnahme pro Sprache** und es
soll keine geben; lange Komposita werden ueber Trennstellen (`hyphens-auto`) geloest,
nicht ueber kleinere Schrift.

Gemessen in PT05.2 (10 Sprachen × 4 Seiten × 3 Viewports = 120 Kombinationen):
**0 horizontaler Ueberlauf**, H1 mobil 30–36px, 1–5 Zeilen, kein H1-Eigenueberlauf.

## 5. Core UI-Komponenten (AP05 / PT05.3)

**Ort:** `src/components/ui/**` · **Tests:** je Komponente eine `*.test.tsx` daneben.
Die Tests pruefen **Verhalten** (Rolle, Name, Fokus, Tastatur, ARIA-Verdrahtung), nicht
Tailwind-Klassen — eine Klassenzusicherung wuerde jedes Refactoring brechen und trotzdem
nichts ueber die Benutzbarkeit sagen.

### 5.1 Bestand

| Komponente  | Datei            | Rollen/Varianten                                                                                 |
| ----------- | ---------------- | ------------------------------------------------------------------------------------------------ |
| Button/Link | `Button.tsx`     | `primary` · `secondary` · `outline` · `ghost`; `default`/`sm`/`lg`/`icon`; `loading`, `disabled` |
| Input       | `Input.tsx`      | Label, Hilfstext, Fehler, disabled                                                               |
| Textarea    | `Textarea.tsx`   | wie Input                                                                                        |
| Choice      | `Choice.tsx`     | `Checkbox` · `Radio` · `Select`                                                                  |
| FormField   | `FormField.tsx`  | Feld und Gruppe (`as="group"`)                                                                   |
| Alert       | `Alert.tsx`      | `info` · `success` · `warning` · `error` (+ `default`, `destructive` als Bestand)                |
| Card        | `Card.tsx`       | interaktiv (mit `to`/`href`) vs. statisch                                                        |
| Dialog      | `Dialog.tsx`     | `modal` · `drawer`                                                                               |
| Zustaende   | `StateBlock.tsx` | `LoadingState` · `EmptyState` · `ErrorState` · `Skeleton`                                        |

### 5.2 Verbindliche Zusagen

**Element folgt der Absicht, nicht dem Aussehen.** `Button` rendert `<button>`, mit `to`
einen `<Link>`, mit `href` ein `<a>`. `Card` ist mit Ziel **genau ein** Link ueber die
ganze Flaeche, ohne Ziel eine reine Flaeche ohne Hover und ohne Tabstop. Es gibt keine
Flaeche, die wie ein Bedienelement aussieht, ohne eines zu sein.

**Externe Ziele** (`http(s)://`, `mailto:`, `tel:`) bekommen automatisch `target="_blank"`
und `rel="noopener noreferrer"`; interne Anker (`#…`) und relative Pfade **nicht**.

**Deaktiviert heisst deaktiviert.** Ein `<a>` kennt kein `disabled` — `Button` setzt
deshalb `aria-disabled`, `tabIndex={-1}` und unterbindet den Klick.

**Ladezustand** setzt `aria-busy`, deaktiviert und **behaelt die Beschriftung**: eine
Schaltflaeche, die beim Laden ihren Text verliert, verliert ihren zugaenglichen Namen.

**Touch Targets ≥ 44 px** (WCAG 2.5.5) bei allen Core-Bedienelementen: Button in jeder
Groesse (`min-h-[44px]`, `icon` 44×44), Select, Dialog-Schliesser und Retry-Knopf.
Checkbox und Radio bleiben optisch 16 px — das anfassbare Ziel ist das umschliessende
`<label>` mit `min-h-[44px]`. **Groesse des Glyphs ≠ Groesse des Ziels.**

**Fokus** ist durchgaengig `focus-visible:ring-2 ring-brand-primary ring-offset-2` —
derselbe Ring wie an Formularfeldern (PT05.1/PT05.2).

### 5.3 FormField — die Verdrahtung

`FormField` uebernimmt genau die Dinge, die man von Hand vergisst: `htmlFor`/`id`,
`aria-describedby` auf Hilfstext **und** Fehler gleichzeitig, `aria-invalid` bei Fehler,
`required` **plus** `aria-required`, und `role="alert"` an der Fehlermeldung. Das
Pflicht-Sternchen ist `aria-hidden` — die Pflichtangabe kommt aus dem Attribut, nicht aus
dem Glyph. Gruppen (`as="group"`) rendern `fieldset`/`legend`.

**Radio und `aria-invalid`:** die Rolle `radio` unterstuetzt das Attribut nicht. Ein
ungueltiger Zustand gehoert an die **Gruppe**, nicht an den einzelnen Knopf.

### 5.4 Alert — Status ohne Farbmonopol

Jede Variante traegt drei Signale: eigene Farbe, **eigenes Icon** und — ueber das von
aussen gesetzte `role` — eine Ansage. Textfarben sind die `strong`-Rollen, damit der Text
auf der jeweiligen `soft`-Flaeche AA erreicht (success 5,21:1 · warning 4,84:1 ·
error 7,7:1 · info 12,4:1).

`warning` nutzt die **eigene** `warning`-Familie (PT05.3, §3.3) — **nicht** die
Befund-Ampel, deren Amber eine fachliche Befundaussage traegt und nur auf den
Musterbefund-Seiten gilt.

### 5.5 Dialog — was einen Modal ausmacht

`role="dialog"` + `aria-modal` · `aria-labelledby`/`aria-describedby` · Fokus wandert beim
Oeffnen hinein · Fokusfalle fuer Tab und Shift+Tab · Escape schliesst · Backdrop-Klick
schliesst (abschaltbar) · Scroll Lock mit Breitenausgleich, damit das Layout nicht springt ·
**Fokus kehrt auf das ausloesende Element zurueck** · Listener und Scroll Lock werden beim
Schliessen zurueckgenommen. Geschlossen rendert der Dialog `null`.

Die Fokusfalle filtert **bewusst nicht** ueber `offsetParent`: der Wert haengt am Layout
und ist in jeder layoutlosen Umgebung `null` — die Falle waere dort auf ein einziges
Element zusammengeschrumpft.

### 5.6 Loading / Empty / Error

`LoadingState` ist `role="status"` + `aria-live="polite"` (ansagen, nicht unterbrechen).
`EmptyState` ist **keine** Live-Region — leer ist ein Inhalt, kein Ereignis.
`ErrorState` ist `role="alert"` und zeigt einen Wiederholen-Knopf **nur**, wenn ein
`onRetry` uebergeben wird; ohne ihn gilt der Fehler als nicht erholbar.

Welche Fehler erholbar sind, wann neu geladen wird und was ein harter 404 ist, entscheiden
**AP10** und **AP22** — `StateBlock.tsx` liefert nur Darstellung und Ansage.

### 5.7 Bekannte offene Punkte (nicht PT05.3)

Ausserhalb der Core-Komponenten liegen weiterhin Bedienelemente unter 44 px — die
Karussell-Punkte (10 px) auf Start- und Testimonial-Sektion, kleine Icon-Schalter (16 px)
und die Pfeil-Links der Sektionen (20 px hoch). Sie gehoeren zu **Sektionskomponenten**;
ihre Konsolidierung ist **PT05.4**, die umfassende Abnahme **AP24**. PT05.3 hat sie
bewusst nicht angefasst, weil das eine breite Seitenmigration waere (§13.2 AP05).

## 6. Layout- und Sektionsmuster (AP05 / PT05.4)

**Ziel:** AP11–AP21 bauen Seiten aus diesen Mustern, statt jedes Mal neue zu erfinden.
Alle Werte sind aus dem Bestand **gemessen**; PT05.4 hat die Art Direction nicht geaendert.

### 6.1 Container, Section, Grid

**Primitive:** `src/components/layout/Section.tsx` — `Section`, `Container`, `CardGrid`.

| Groesse            | Wert                         | Herkunft             |
| ------------------ | ---------------------------- | -------------------- |
| Seitenbreite       | `max-w-page` 1440px          | `tailwind.config.js` |
| Inhaltsbreite      | `max-w-container` **1200px** | 44 Dateien           |
| Gutter             | `px-4`, ab `lg` `px-0`       | dominant             |
| Rhythmus `default` | `py-16 lg:py-24`             | 12×                  |
| Rhythmus `lg`      | `py-24`                      | 7×                   |
| Rhythmus `compact` | `py-12 lg:py-16`             | 3×                   |

**Es gibt genau diese drei Rhythmusstufen.** Eine vierte wird nicht eingefuehrt.

**CONTAINED vs FULL-BLEED — die Trennung, die beide Bausteine rechtfertigt:**
`Section` traegt die **Flaeche** (Hintergrund, dunkle Baender) und geht immer ueber die
volle Breite; `Container` traegt den **Inhalt** und ist immer eingerueckt. Ein Hintergrund
gehoert nie an den Container — sonst endet die Flaeche bei 1200px und die Sektion
zerfaellt auf breiten Schirmen.

**Flaechen:** `white` (Standard) · `soft` = `bg-slate-50` (Absetzung zwischen zwei weissen
Sektionen) · `navy` = `bg-brand-deep text-white` (Hero, Final-CTA, Beweisstrecken).
`navy` ist eine dunkle Flaeche im **Light Theme**, kein Dark Mode (§2); dort gilt
`accent.on-dark`.

### 6.2 Card Grid

`CardGrid` kennt 2/3/4 Spalten, `gap-8` (Regel) bzw. `gap-6` (dicht), und
`equalHeight` (Default an).

**Mobil ist immer eine Spalte** — das ist keine Option, sondern die Grundlage dafuer, dass
Karten auf 360px lesbar bleiben. Spalten entstehen erst ab einem Breakpoint; eine
unpraefixierte `grid-cols-`-Angabe gibt es nicht.

Karten kommen aus dem `Card`-Primitive (§5). Mit `to`/`href` ist die **ganze Karte genau
ein Link** — nicht die Ueberschrift plus ein zweiter „Weiterlesen"-Link daneben, was
Screenreader-Nutzern dieselbe Karte zweimal vorlegt.

### 6.3 Hero / Split

| Muster                  | Quelle                            | Aufbau                                                                                                                 |
| ----------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Navy-Hero (Produkt/Hub) | `DiagnosticsHero`, `IglooProHero` | `Section surface="navy"`, `grid lg:grid-cols-2`, links Breadcrumb + H1 + Lead + Proof-Chips, rechts dekoratives Visual |
| Startseiten-Hero        | `HeroSection`                     | Navy-Flaeche, Slider mit Dots + Pause/Play, KPI-Leiste                                                                 |
| Subpage-Hero            | `SubpageHero`                     | schlanke Variante fuer Unterseiten                                                                                     |
| Rechts-Hero             | `.legal-hero`                     | mit Silbentrennung fuer lange Komposita                                                                                |

**Mobiles Stacking:** immer Text zuerst, Visual danach. Das Hero-Visual ist **dekorativ**
und traegt keine Information, die nicht auch im Text steht.

Keine alternative Hero-Art-Direction; kein zweites Hero-Vokabular.

### 6.4 Content + Sidebar

`PageSidebar` (`src/components/sections/PageSidebar.tsx`) ist die **eine** geteilte rechte
Sidebar fuer `ServicePage` und `ArticlePage`. Widgets: verwandte Services, verwandte
Artikel, CTA. Layout: `grid lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] lg:items-start`.

Die Sidebar ist **ergaenzend**, nicht tragend: alles fachlich Notwendige steht in der
Hauptspalte, denn auf Mobilgeraeten rutscht die Sidebar unter den Inhalt.

### 6.5 Sticky / Chapter Navigation

`ChapterNav` (`src/components/ui/ChapterNav.tsx`) hat einen **bestehenden Layout-Vertrag,
der einzuhalten und nicht neu zu erfinden ist**:

| Vertragsteil    | Wert                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| Sticky-Position | `top-[68px] lg:top-[88px]` — direkt unter dem Header                                                 |
| Offset-Variable | `--chapterbar-offset` auf `document.documentElement`, berechnet aus Headerhoehe + Leistenhoehe + 8px |
| Fortschritt     | `--nav-progress` als Breite des Fortschrittsbalkens                                                  |
| Anker-Offset    | `scroll-mt-28` an der Zielsektion (`Section anchorId=…` setzt es automatisch)                        |
| Aufraeumen      | die Offset-Variable wird beim Unmount **entfernt**                                                   |

Wer die Kapitelnavigation einsetzt, gibt Zielsektionen ueber `Section anchorId` an —
sonst verdeckt die Sticky-Leiste beim Sprung die Ueberschrift. AP24 bleibt A11y-Owner.

### 6.6 Longform

Regeln stehen in **§4.5** (Typografie) und gelten unveraendert: 61ch Lesebreite fuer
`p`/`li`/`blockquote`, Zeilenhoehe 2rem, `gray-700` als Ink, Tabellen mit eigenem
Scroll-Container, `.info-box` und `.cta-block` als Callouts.

Fuer Evidenz-/Disclaimer-Text gilt `.t-caption` (`ui-field`, 4,83:1) — er ist **kleiner,
aber nicht kontrastschwaecher**. Regulatorische Hinweise werden nie ueber Farbe allein
markiert.

### 6.7 Final CTA

**Muster:** `FinalCtaSection` — Navy-Flaeche, Eyebrow (`accent.on-dark`), grosse H2,
Untertitel, zwei CTAs, darunter Reassurance-Chips.

Verbindlich:

- Primaer-CTA des allgemeinen Anfragewegs ist **„Angebot anfragen"** (`DEC-RL-013`),
  lokalisiert in allen 10 Sprachen.
- Sekundaer-CTA nur, wenn fachlich passend (z. B. ROI-Rechner).
- **Kein** Band mit „garantierter Performance" und **kein Ersatzband** (`DEC-RL-012`) —
  in PT05.4 repo-weit geprueft: **0 Treffer** in Code und Locales.
- **Kein Chat** (`DEC-RL-007`).

### 6.8 Touch Targets in Sektionen

Die Karussell-Steuerungen von `HeroSection` und `TestimonialsSection` waren 10px bzw. 16px
gross. In PT05.4 korrigiert:

| Element       | vorher | nachher                |
| ------------- | ------ | ---------------------- |
| Pause/Play    | 16×16  | **44×44**              |
| Slider-Punkte | 10×10  | **24 hoch** × 10 breit |

Die Punkte sind jetzt ein transparenter Knopf mit innenliegendem `<span>` als sichtbarem
Punkt — **Groesse des Glyphs ≠ Groesse des Ziels**, dasselbe Prinzip wie bei
Checkbox/Radio (§5.2).

**Offen und bewusst nicht in AP05 geloest:** die **Breite** der Punkte bleibt 10px. Ein
24px breites Ziel je Punkt ist mit dem heutigen Punktabstand (Rasterweite 20–22px)
geometrisch unvereinbar — die Ziele wuerden einander ueberlappen. Die Punkte weiter
auseinanderzuziehen waere eine **Art-Direction-Entscheidung**, und AP05 konsolidiert die
Sales-Machine, es gestaltet sie nicht um. Owner: **AP24** gemeinsam mit der
Produktentscheidung.

### 6.9 Sektionskatalog

Bevorzugte Bausteine fuer AP11–AP21. „Typ" ist der Content-Typ aus `CONTENT-MATRIX.md`.

| Muster                 | Zweck                            | Komponente                                       | Geeignet fuer                     | Responsive                 | A11y-Notiz                                         |
| ---------------------- | -------------------------------- | ------------------------------------------------ | --------------------------------- | -------------------------- | -------------------------------------------------- |
| Navy-Hero              | Einstieg, Kernversprechen        | `DiagnosticsHero`, `IglooProHero`, `SubpageHero` | Hub, Produkt, Service, Unterseite | 2 Spalten → gestapelt      | genau **eine** H1; Visual dekorativ                |
| Trust-Bar              | Sofortvertrauen unter dem Hero   | `TrustBar`                                       | Startseite, Produkt               | Wrap                       | Logos brauchen `alt` oder `aria-hidden`            |
| Fokus-Karten           | Themen-/Servicewahl              | `DiagnosticsFocusSection` + `Card`               | Hub, Uebersicht                   | 3 → 2 → 1                  | ganze Karte = ein Link                             |
| Spezialgebiete         | alternierende Navy-/Teal-Kacheln | `DiagnosticsSpecialtySection`                    | Hub                               | 2 → 1                      | Kontrast je Flaeche pruefen                        |
| Feature-Raster         | Produkteigenschaften             | `IglooFeaturesSection`                           | Produkt                           | 3 → 2 → 1                  | Icons `aria-hidden`                                |
| Parameter/Specs        | Messwerte, technische Daten      | `IglooParametersSection`, `IglooSpecsSection`    | Produkt                           | Tabelle scrollt in sich    | Tabellen mit `th`/`scope`                          |
| Prozess in 3 Schritten | Ablauf erklaeren                 | `StepsSection`                                   | Start, Produkt, Service           | 3 → 1                      | Reihenfolge steht im Text, nicht nur in der Nummer |
| ROI-Rechner            | Sekundaere Conversion            | `RoiCalculatorSection`                           | Start, Produkt                    | 2 → 1                      | Eingaben ueber `FormField`                         |
| Testimonials           | Sozialer Beweis                  | `TestimonialsSection`                            | Start                             | Slider                     | Pause/Play Pflicht (WCAG 2.2.2)                    |
| Mid-Page-Teal-Band     | Zwischen-CTA                     | Inline (`bg-accent`)                             | lange Seiten                      | volle Breite               | Text auf Teal ist weiss, nie `accent`              |
| Epigenetik-Teaser      | Saeule sichtbar machen           | `EpigeneticsTeaserSection`, `EpigeneticsPanels`  | Start, Hub                        | 3 → 1                      | eigene Saeule (`DEC-RL-005`)                       |
| Artikel-/Blog-Teaser   | Wissen anteasern                 | `BlogSection` + `Card`                           | Start, Wissen                     | 3 → 2 → 1                  | Datum/Lesezeit als Text                            |
| FAQ                    | Einwaende ausraeumen             | `FAQSection`                                     | Service, Produkt                  | einspaltig                 | Aufklappen per Tastatur                            |
| Content + Sidebar      | Longform mit Kontext             | `PageSidebar`                                    | Service, Artikel                  | Sidebar rutscht nach unten | Sidebar ist ergaenzend                             |
| Kapitelnavigation      | Orientierung in Longform         | `ChapterNav`                                     | Leitlinie, Longform               | horizontal scrollend       | Offset-Vertrag §6.5                                |
| Formularpanel          | Conversion                       | `ContactForm`, `SupportForm` + `FormField`       | Kontakt, Support                  | einspaltig                 | Fehler als `role="alert"`                          |
| Final CTA              | Abschluss                        | `FinalCtaSection`, `IglooProductFinalCta`        | alle                              | zentriert                  | CTA-Wortlaut nach `DEC-RL-013`                     |

**Do:** vorhandenes Muster waehlen · `Section`/`Container`/`CardGrid` fuer das Geruest ·
`Card` fuer Karten · Typo-Rollen aus §4.

**Don't:** neues Sektionsvokabular erfinden · Hintergrund an den Container haengen ·
Ueberschriftsebene fuer eine Schriftgroesse wechseln · zweiter Link in einer Link-Karte ·
Karussell ohne Pause/Play.

### 6.10 Doppelte Kartenrezepte

Repo-weit gibt es **18** Aufrufstellen des Rezepts
`rounded-xl border border-slate-200 bg-white p-7`. Davon sind **3 interaktiv**
(Link-Karten mit Hover-Lift); sie sind in PT05.4 auf `Card` umgestellt und haben dadurch
den Fokusring des Design-Systems statt des UA-Standardrings.

Die uebrigen 15 sind **statische Flaechen** ohne Interaktion. Sie bleiben, wie sie sind:
ihre Umstellung waere eine reine Namensmigration ueber 12 Seitendateien ohne funktionalen
Gewinn — genau die breite Seitenmigration, die AP05 §13.2 ausschliesst. **Neue** Karten
nutzen `Card`.

**Nicht konsolidiert** (bewusst): `rounded-lg border border-gray-200 bg-white p-4` (8×) —
anderer Radius, andere Grauskala, andere Rolle (kompakte Listenkacheln). Es gibt keine
erzwungene Universal-Card.

## 7. Spacing, Radius, Shadow

### 7.1 Spacing

Sektionsrhythmus der Sales-Machine: `py-24 lg:py-28`, Container `max-w-container px-4 lg:px-0`.
Seit PT05.1 benannt und additiv verfügbar: `spacing.section` = `6rem` (== `py-24`),
`spacing.section-lg` = `7rem` (== `py-28`). Bestehende Call-Sites bleiben gültig — die Tokens
ergänzen die Skala, sie ersetzen sie nicht.

Breiten: `maxWidth.container` `1200px` (44 Dateien), `maxWidth.page` `1440px`.

### 7.2 Radius

Tailwind-Standardskala plus `borderRadius.section` = `24px`.
**Bekannte Dopplung:** `rounded-section` ist wertgleich mit `rounded-3xl` (beide 24px).
`rounded-section` bleibt als **semantischer** Name für Sektionsflächen erhalten; die
Dopplung ist bewusst und dokumentiert, nicht versehentlich.

### 7.3 Shadow

| Token                   | Wert                             | Rolle                                                 |
| ----------------------- | -------------------------------- | ----------------------------------------------------- |
| `shadow-card`           | `0 24px 60px rgba(8,51,88,.12)`  | Karten-Hover-Lift                                     |
| `shadow-glass`          | `0 8px 32px 0 rgba(8,51,88,.15)` | `glass-panel` / `glass-panel-dark`                    |
| `shadow-dialog`         | `0 20px 60px rgba(8,51,88,.35)`  | **Modal/Drawer/Dialog-Ruheschatten** (PT05.1 benannt) |
| `shadow-glow-secondary` | `0 0 15px rgba(47,111,160,.5)`   | ungenutzt (0 Call-Sites)                              |

Alle Schatten sind **Navy-getönt** (`rgba(8,51,88,…)`) — kein neutrales Schwarz. Das ist
Teil der Sales-Machine-Sprache. `shadow-dialog` ist die einzige Quelle für den Modal-Ruheschatten
und wird vom `modal-card-in`-Keyframe referenziert, damit Token und Animation nicht auseinanderlaufen.

**Glass/Glow** bleiben auf den bestehenden Sales-Machine-Einsatz begrenzt
(`glass-panel`, `glass-panel-dark`, `bg-noise`). Kein neuer Glass-/Glow-Layer als Stilmittel.

---

## 8. Motion-Tokens

PT05.1 legt **nur die Token-Grundlage**. Die vollständige Motion-Implementierung,
Reduced-Motion-Abnahme und Visual-Regression-Baseline sind **PT05.5**.

Alle Werte unten sind **Namen für bereits laufende Werte** — PT05.1 hat keine Dauer,
keine Kurve und keine Bewegung verändert.

### 8.1 Easing (`ease-*`)

| Token           | Wert                                | Rolle                               |
| --------------- | ----------------------------------- | ----------------------------------- |
| `ease-entrance` | `cubic-bezier(0.16, 1, 0.3, 1)`     | Modal-/Popover-Eintritt             |
| `ease-emphasis` | `cubic-bezier(0.22, 1, 0.36, 1)`    | Hero-Slides                         |
| `ease-back-out` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Icon-Wechsel (leichter Überschwung) |
| `ease-exit`     | `ease-in`                           | alle Austritte                      |
| `ease-reveal`   | `ease-out`                          | Scroll-Reveal                       |

### 8.2 Duration (`duration-*`)

| Token                 | Wert    | Rolle                                                            |
| --------------------- | ------- | ---------------------------------------------------------------- |
| `duration-hover`      | `200ms` | Hover-/Focus-Zustände                                            |
| `duration-menu`       | `300ms` | Navigations-/Menü-Übergänge                                      |
| `duration-popover`    | `180ms` | Popover                                                          |
| `duration-modal`      | `280ms` | Modal-/Drawer-Backdrop                                           |
| `duration-modal-card` | `520ms` | Modal-Karte (Eintritt)                                           |
| `duration-reveal`     | `500ms` | Scroll-Reveal — deckungsgleich mit `Reveal.tsx` `duration = 0.5` |

Stagger zwischen Geschwistern einer Gruppe: `REVEAL_STAGGER = 0.06` (`src/components/ui/Reveal.tsx`)
— dort bereits Single Source of Truth, wird hier nicht dupliziert.

### 8.3 Reduced Motion — nicht verhandelbar

`src/index.css` fängt am **Dateiende** (nach allen Utilities) hinter
`@media (prefers-reduced-motion: reduce)` jede Animation und Transition ab — inklusive
Inline-Styles, da `!important` gegen ein `style`-Attribut gewinnt. Bewusst `0.01ms` statt `0`,
damit `transitionend`/`animationend` weiterhin feuern.

`Reveal.tsx` prüft die Präferenz zusätzlich in JS und überspringt Beobachtung und Transition
vollständig. **Kein Motion-Token darf diesen Schutz umgehen.**

---

## 9. Motion, Visual Regression und Error States (AP05 / PT05.5)

### 9.1 Reduced Motion — die harte Zusage

`prefers-reduced-motion: reduce` wird auf **drei** Ebenen respektiert, damit keine Ebene
allein die Last traegt:

| Ebene                    | Ort                                | Wirkung                                                                          |
| ------------------------ | ---------------------------------- | -------------------------------------------------------------------------------- |
| Globales Sicherheitsnetz | `src/index.css`, Dateiende         | `*`, `*::before`, `*::after` auf `0.01ms !important` — faengt auch Inline-Styles |
| Komponentenklassen       | `motion-reduce:animate-none`       | Dialog, Spinner, Skeleton, Card-Hover                                            |
| JS-Guards                | `Reveal.tsx`, `PageTransition.tsx` | beobachten gar nicht erst, statt unsichtbar zu animieren                         |

**Gemessen (PT05.5, Playwright unter Emulation):** auf `/de/` hat **kein einziges** Element
eine Animations- oder Transition-Dauer > 1 ms. Der Wert ist bewusst `0.01ms` und nicht `0`,
damit `transitionend`/`animationend` weiterhin feuern.

**Reduced Motion nimmt keine Funktion weg** — ebenfalls getestet: Inhalte bleiben sichtbar,
das Karussell bleibt bedienbar, die Pause/Play-Steuerung funktioniert.

### 9.2 Transitions

Die Namen stehen in **§8**; hier gelten die Regeln ihrer Verwendung:

- **kurz** — nichts ueber 520 ms (Modal-Karte), der Regelfall liegt bei 180–300 ms;
- **vorhersehbar** — dieselbe Rolle bekommt ueberall dieselbe Dauer;
- **nicht blockierend** — keine Animation haelt eine Eingabe oder Navigation auf;
- **keine kuenstliche Orchestrierung** — der einzige Stagger ist `REVEAL_STAGGER` (60 ms)
  zwischen Geschwistern einer Gruppe;
- **keine Information nur durch Bewegung** — was eine Animation aussagt, steht auch im Text.

### 9.3 Keine Interaktionsblockade

Getestet in `e2e/design-system.spec.ts`:

| Zusicherung                                                     | Pruefung                                                      |
| --------------------------------------------------------------- | ------------------------------------------------------------- |
| kein unsichtbarer Layer faengt Klicks                           | `elementFromPoint` in der Viewport-Mitte trifft echten Inhalt |
| Scroll-Lock haengt nicht                                        | `body.overflow` ist nach Navigation nie `hidden`              |
| Navigation nach Transition moeglich                             | Klick → `waitForURL` → H1 sichtbar                            |
| Fokus kehrt zurueck, Escape schliesst, Listener werden entfernt | Dialog-Komponententests (§5.5)                                |

### 9.4 Visual Regression

**Galerie:** `scripts/build-visual-gallery.tsx` rendert die **echten** Komponenten per
`react-dom/server` nach `dist/client/visual-gallery.html`.

**Warum keine Route:** eine oeffentliche `/styleguide`-Route waere eine Testoberflaeche in der
Produktion — indexierbar, im Routing-Vertrag, im Bundle.

**Warum neben `dist/client/` und nicht darin:** `server.ts` haengt ein
`express.static(dist/client)` ein. Eine dort abgelegte HTML-Datei wird mit **HTTP 200**
ausgeliefert — die Galerie war in einem Zwischenstand von PT05.5 genau so oeffentlich
erreichbar, nachgemessen. Sie liegt deshalb in `dist/visual-gallery.html`, ein Verzeichnis
hoeher, und wird per `file://` geladen. Nachgewiesen: `/visual-gallery.html` endet ueber den
Server in einer **404**.

**Warum die echten Komponenten:** eine nachgebaute HTML-Attrappe waere eine zweite Wahrheit
und liefe mit der Zeit auseinander.

**Abgedeckte Oberflaechen (22 Baselines = 11 × 2 Viewports):** `tokens-color`, `typography`,
`typography-on-navy`, `buttons`, `form-controls`, `status-alerts`, `cards`, `states`,
`dialog`, `layout-grid`, `section-navy`.
**Plus 6 Seiten-Baselines** aus echten Routen: Hero (`/de/diagnostics`), Longform
(`/de/services/dental`), Final CTA (`/de/articles`).

**Determinismus** — ohne diese vier Vorkehrungen ist ein Screenshot-Vergleich wertlos:

1. feste Viewports (390×844 mobil, 1440×900 Desktop);
2. `prefers-reduced-motion: reduce`, **explizit pro Seite** gesetzt — die Config-Option
   `use: { reducedMotion }` griff in diesem Setup nachweislich nicht, deshalb steht im Test
   eine Zusicherung auf `matchMedia(...).matches`;
3. `document.fonts.ready` — sonst misst der Browser mit Fallback-Metriken;
4. `caret-color: transparent` — der blinkende Cursor waere sonst ein Zufallspixel.

Keine Zeitstempel, keine Netzdaten, keine Personendaten, keine Secrets.

**Port-Isolation:** die E2E-Suite laeuft auf `E2E_PORT` (Default **3311**) mit
`reuseExistingServer: false`. Auf gemeinsam genutzten Maschinen laeuft auf 3000 regelmaessig
ein anderes Projekt — in PT05.5 wurden dadurch zunaechst Screenshots einer **fremden**
Anwendung erzeugt. Das ist der Grund fuer beide Einstellungen.

### 9.5 Error States

| Fall                          | Verhalten                                                     | Ort                          |
| ----------------------------- | ------------------------------------------------------------- | ---------------------------- |
| Route existiert nicht         | echte **HTTP 404**, NotFound-Seite, **keine** Fehlergrenze    | `server.ts` / `NotFoundPage` |
| Renderfehler im Browser       | Fehlergrenze faengt, zeigt `ErrorState` mit Neuversuch        | `RootErrorBoundary`          |
| Renderfehler in einem Segment | nur das Segment degradiert, Kopf/Fuss bleiben bedienbar       | `SegmentErrorBoundary`       |
| Renderfehler beim SSR         | echter **HTTP 500** — die Grenze haengt bewusst nur im Client | `entry-client.tsx`           |

**Renderfehler ≠ 404.** Beides ist getestet: eine unbekannte Route liefert 404 **ohne**
`role="alert"`, eine Fehlergrenze liefert `role="alert"` **ohne** 404.

**Niemals ein Stacktrace in der Oberflaeche** — Details gehen ausschliesslich an
`reportError`; per Test zugesichert.

Seit PT05.5 rendern beide Grenzen ueber `ErrorState` (§5.6): **eine** Fehleroberflaeche statt
drei Markup-Varianten. Die Routing-Statussemantik selbst bleibt **AP10**.

### 9.6 Changelog-Gate

`building-docs/DESIGN-SYSTEM-CHANGELOG.md` + `scripts/check-design-system-changelog.mjs`
(`npm run check:ds-changelog`), verankert **pre-commit und in CI**.

Das Gate vergleicht die **tatsaechliche** Oberflaeche im Code — Farb-Token-Pfade,
`.t-*`-Rollen, Exporte der AP05-eigenen Komponenten — mit der im Changelog dokumentierten und
schlaegt bei jeder Abweichung fehl. Bewusst **kein** Diff-Gate: ein Vergleich gegen einen
Basis-Ref ist in dieser Worktree-Umgebung unzuverlaessig und sagt nichts ueber den Ist-Zustand.

Release-Notes-Prozess und Testabdeckung bleiben **AP27**.

### 9.7 Preview-Neutralitaet — nachgewiesen

Aus `redesign/preview` stammen ausschliesslich **Mechaniken**, in 9 Dateien jeweils im Kopf
deklariert: Error-Boundary-Mechanik, providerneutrales Monitoring, A11y-Audit-Skript,
Baseline-Screenshot-/Visual-Regression-Mechanik.

**Nicht uebernommen — in PT05.5 erneut geprueft:** 0 Treffer fuer die Token-Klassen jener Linie
(`bg-bg`, `text-fg`, `bg-action-primary`, `border-border-strong`, `max-w-reading`,
`--tap-target-min`) ausserhalb eines Kommentars, der genau diese Nicht-Uebernahme begruendet.
0 `dark:`-Klassen. Keine Farbe, kein Branding, keine alternative Typografie, keine alternative
Hero-/Card-Art-Direction.

## 10. Token-Guard — die Durchsetzung

Kanonisch und **einzig**: `scripts/check-color-tokens.mjs` (`npm run check:colors`).

Durchgesetzte Regeln:

1. kein Raw-Hex außerhalb `PALETTE_HEX` / `NEUTRAL_HEX`;
2. keine Arbitrary-Farbklassen (`bg-[#…]`, `text-[rgb(…)]`);
3. kein `gray-900` (Legacy-Navy `#203864` abgeschafft);
4. keine rohen chromatischen Tailwind-Skalen (`teal-600`, `blue-50`, …);
5. kein `rgb()`/`rgba()`-Literal außerhalb der Palette.

Geprüfte Flächen gehen bewusst über `src/**` hinaus und decken jede Fläche ab, die Marke
transportiert: `tailwind.config.js`, `server.ts` (SSR-Fehlerseite),
`server/server.js` (Kontakt-/ROI-Mails + PDF), `public/og-image.svg`,
`public/polarisdx-mark.svg`, `scripts/og-image-template.html`.

Begründete Ausnahmen: `FlagIcon.tsx` (Länderflaggen sind vorgegebene Fremdfarben),
`polarisdx-mark.svg` (eigener Markenverlauf), `red-*` (Fehlersemantik),
neutrale `gray/slate/zinc/neutral/stone`-Skalen.

**Verankerung — beide Wege, kein Ersatz des einen durch den anderen:**

| Ort        | Mechanismus                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| pre-commit | `lefthook.yml` → `colors: node scripts/check-color-tokens.mjs`                                       |
| CI         | `.github/workflows/ci.yml` → Step **„Color/token guard"** → `npm run check:colors` (**seit PT05.1**) |

**Kopplungsregel:** Wer die Palette erweitert, ändert `tailwind.config.js` **und**
`PALETTE_HEX` in `scripts/check-color-tokens.mjs` **im selben Commit**. Eine zweite
Color-Lint-Implementierung wird nicht angelegt.

---

## 11. Verbotene Regressionen

| ID       | Verboten                                                                            |
| -------- | ----------------------------------------------------------------------------------- |
| `DS-C1`  | zweite Art Direction / Archon-Palette / alternative Brand-Farbwelt                  |
| `DS-C2`  | Dark Theme, Theme-Switcher, `dark:`-Produktoberfläche, parallele Dark-Tokens        |
| `DS-C3`  | Raw-Hex oder Arbitrary-Farbklassen an den Tokens vorbei                             |
| `DS-C4`  | zweite Color-Lint-Implementierung neben `check-color-tokens.mjs`                    |
| `DS-C5`  | Guard aus pre-commit **oder** CI entfernen                                          |
| `DS-C6`  | Palette erweitern ohne `PALETTE_HEX` im selben Commit                               |
| `DS-C7`  | `gray-900` / `#203864` zurückholen                                                  |
| `DS-C8`  | Befund-Ampel in Marken-Teal umdeuten oder ihre Semantik verfälschen                 |
| `DS-C9`  | Bedeutung allein über Farbe transportieren                                          |
| `DS-C10` | `ui.border` / `ui.text-muted` als Bedienelement-Begrenzung oder Hilfstext verwenden |
| `DS-C11` | Reduced-Motion-Sicherheitsnetz in `src/index.css` schwächen oder umgehen            |
| `DS-C12` | zweite Token-Wahrheit neben `tailwind.config.js` etablieren                         |

---

## 12. Owner-Grenzen

| Thema                                                   | Owner                                  |
| ------------------------------------------------------- | -------------------------------------- |
| Typografie, Font-Pipeline                               | AP05 / **PT05.2**                      |
| Core-UI-Komponenten, Komponententests                   | AP05 / **PT05.3**                      |
| Layout-/Sektionsmuster                                  | AP05 / **PT05.4**                      |
| Motion-Implementierung, Visual Regression, Error States | AP05 / **PT05.5** — erledigt, siehe §9 |
| Header/Footer/globale Navigation                        | **AP06**                               |
| umfassende WCAG-Abnahme                                 | **AP24**                               |
| Performance-Budgets                                     | **AP25**                               |
| Teststrategie/Gates gesamt                              | **AP27**                               |

PT05.1 hat **keine** dieser späteren Zuständigkeiten vorgezogen.
