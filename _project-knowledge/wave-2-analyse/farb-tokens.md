# Wave 2 / Fix 2-i — Farb-Token-Inventar + Konsolidierungs-Vorschlag

> **NORA · Inventar-Agent, reine Analyse — kein Code-/Config-Change.**
> Quelle: Live-Repo (gegreppt aus `tailwind.config.js`, `index.html`,
> `src/**`, `public/**`). Stand: 2026-06-03, Branch
> `feature/consumer-landing-pages`.

## Entscheidung (vorgegeben, hier umgesetzt)

- **`cta` → Navy** (alle Order-/Submit-/Primary-Buttons).
- **`accent` → Teal** als formales Token.

---

## 1) Navy-Cluster (alle Dunkelblau-Werte)

Sieben distinkte Dunkelblau-Hex im aktiven Code — viel zu viele.

| Wert      | Quelle / Token             | Fundstellen-Count                                                                                                                           | Anmerkung                                                                                                                                    |
| --------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `#083358` | `brand.deep` (TWconfig)    | 4 hex in CSS/JS + **3 arbitrary** in `Header.tsx` (`bg-[#083358]/85` ×3) + `rgba(8,51,88,…)` ×2 in TWconfig (`shadow-card`, `shadow-glass`) | **Kanonischer Navy.** Bereits Token, wird aber off-system auch hartcodiert.                                                                  |
| `#0a4170` | —                          | 2 (`bg-[#0a4170]` in `shell.tsx:82`, `OrderForm.tsx:409`)                                                                                   | CTA-Hover. **Kein Token**, sollte `navy-hover` werden.                                                                                       |
| `#0f5f95` | `brand.primary` (TWconfig) | 5 hex (`index.css` ×2, weitere) + **205 Tailwind-Klassen** (`brand-primary` ×205)                                                           | Footer-BG, Brand-Akzent. Tatsächlich mittelblau, nicht navy. **Beibehalten — aber semantischer umbenennen** (`brand.blue` oder `brand.mid`). |
| `#11457e` | —                          | 1 (NL-Flagge in `FlagIcon.tsx`)                                                                                                             | **Excluded** (Nationalflagge).                                                                                                               |
| `#1e3a5f` | —                          | 2 in `index.html` (`theme-color`, `msapplication-TileColor`) + 3 in `public/*.svg/png` (OG-Image)                                           | **Kein Token**, vierter Navy-Wert. Visuell zwischen `#083358` und `#203864`.                                                                 |
| `#203864` | `gray-900` (TWconfig)      | **6 hex direkt + 42 Files** mit `text-gray-900`/`bg-gray-900`                                                                               | **Bug:** ist NAVY, in TW als `gray-900` (Standard wäre `#111827`). Verwirrt jeden, der Tailwind-Defaults kennt. **Muss umbenannt werden.**   |
| `#21468b` | —                          | 1 (NL-Flagge)                                                                                                                               | **Excluded.**                                                                                                                                |

### Vorschlag: konsolidierte Navy-Skala (4 Stufen + 1 Heading-Alias)

```
brand.navy        #083358   ← war brand.deep (Token-Rename, Hex bleibt)
brand.navy-hover  #0a4170   ← NEU (heute hardcodiert in shell + OrderForm)
brand.navy-mid    #1e3a5f   ← NEU (heute theme-color, OG-Image)
brand.blue        #0f5f95   ← war brand.primary (umbenannt, semantisch klarer)
brand.blue-bright #2199ea   ← war brand.secondary (umbenannt)
text.heading      #203864   ← war gray-900 (semantisches Rename — fix dem Namens-Bug)
```

`brand.deep` / `brand.primary` / `brand.secondary` als **Alias** halten,
bis Migration durchgespielt — sonst 205 + 77 + 71 Class-Sites in einem Schwung.

---

## 2) Teal / Grün-Inventar

### Teal (vorwiegend `src/pages/consumer/**` + ein Anker in `OrderModal.tsx`)

| Tailwind-Class | Hex     | Count | Verwendung                                                   |
| -------------- | ------- | ----- | ------------------------------------------------------------ |
| `teal-700`     | #0f766e | 14    | Eyebrow-Text, Hover-States, Link-Emphasis                    |
| `teal-500`     | #14b8a6 | 11    | Unterstrich-Akzente (SectionHeader), Dekorlinien             |
| `teal-900`     | #134e4a | 5     | Strong-Emphasis im Price-Badge                               |
| `teal-300`     | #5eead4 | 5     | Hover-Farbe auf dunklem Header (Nav-Links, Footer-Social)    |
| `teal-200`     | #99f6e4 | 5     | Pill-Border, Card-Akzent-Bar (`before:bg-teal-500`-Variante) |
| `teal-600`     | #0d9488 | 4     | CTA-BG der Consumer-Header (`bg-teal-600 hover:bg-teal-700`) |
| `teal-50`      | #f0fdfa | 4     | Pill-Hintergrund, ImageArea-Tint                             |
| `teal-100`     | #ccfbf1 | 3     | Step-Number-Avatare im OrderForm-Erfolg                      |
| `teal-800`     | #115e59 | 2     | Pill-Text                                                    |
| `teal-400`     | #2dd4bf | 2     | Akzentstrich auf dunklem `FinalCTA`-Band                     |

### Grün / Emerald (off-system!)

| Class         | Hex     | Count | Datei / Stelle                                                                     |
| ------------- | ------- | ----- | ---------------------------------------------------------------------------------- |
| `emerald-600` | #059669 | 3     | `S3LeitliniePage.tsx:963`, `VitaminD3ImplantologyPage.tsx:729`, `shell.tsx:475`    |
| `emerald-50`  | #ecfdf5 | 3     | S3-Leitlinie (Info-Box), Vitamin-D3-Implantologie (Icon-Pill), Mask-Ingredient-Bar |
| `emerald-500` | #10b981 | 2     | `S3LeitliniePage.tsx:490` (Border-left), `shell.tsx:475` (Card-Akzent „green")     |
| `emerald-700` | #047857 | 1     | Hover-Text                                                                         |
| `#10b981`     | #10b981 | 2     | `public/*.svg` (OG-Image)                                                          |

**Inkonsistenz:** Mask-Ingredient-Card-Variante heißt `"green"` aber rendert
`emerald-500` — während ALLE anderen Akzente Teal sind. Sieht im Live-DOM
nebeneinander aus wie zwei verschiedene Akzentfamilien.

### Vorschlag: kanonischer Teal-Wert

> **`accent` = `teal-600` (#0d9488)** als Primitive für „same tones".

Begründung: existiert bereits als CTA-BG (4 Hits), liegt zwischen den zwei
am häufigsten genutzten Schattierungen (`teal-700` Text, `teal-500` Linie),
ergibt eine konsistente Skala.

```
accent           #0d9488   ← teal-600 (kanonisch)
accent-strong    #0f766e   ← teal-700 (Text, Hover-Emphasis)
accent-line      #14b8a6   ← teal-500 (Underline, Dekorlinien)
accent-soft      #f0fdfa   ← teal-50  (Tint, Pills)
accent-border    #99f6e4   ← teal-200 (Pill-Border)
accent-on-dark   #5eead4   ← teal-300 (Hover auf Navy-Header)
```

`emerald-*` **vollständig deprecaten** → durch Teal-Token ersetzen (oder,
falls sie semantisch was anderes meinen — z.B. „success/health" in S3-
Leitlinie — eigene Token-Gruppe `success.*` einführen statt ad-hoc).

---

## 3) Off-System-CTA-Inventar (Kandidaten → Navy-Migration)

Alles, was eine echte Button-/Klick-Fläche ist und **nicht** über
`components/ui/Button.tsx` läuft:

| Datei : Zeile                          | Klassen-Auszug                                                        | Migrationsziel                                                                                                                                             |
| -------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/consumer/shell.tsx:85`      | `teal: 'bg-teal-600 text-white hover:bg-teal-700'`                    | **`cta.navy`** (Entscheidung: CTA = Navy). Variante komplett auflösen, alle Callsites umbiegen.                                                            |
| `src/pages/consumer/shell.tsx:111`     | ConsumerHeader-CTA verwendet `variant="teal"`                         | → `variant="navy"`                                                                                                                                         |
| `src/pages/consumer/OrderForm.tsx:399` | Submit-Button mit `focus-visible:ring-teal-500`                       | Ring auf `accent` (teal) belassen (Fokus-Marker ≠ CTA-Fläche).                                                                                             |
| `src/pages/consumer/SprayPage.tsx:175` | `bg-teal-600 text-white` (Price-Badge €-Icon)                         | **Dekorativ, kein CTA** — als `accent-strong` belassen.                                                                                                    |
| `src/pages/consumer/shell.tsx:82`      | `bg-brand-deep ... hover:bg-[#0a4170]` (Navy-CTA)                     | Hover-Hex zu `cta.navy-hover` token.                                                                                                                       |
| `src/pages/consumer/OrderForm.tsx:409` | `bg-brand-deep ... hover:bg-[#0a4170]` (Submit)                       | Hover-Hex zu `cta.navy-hover` token.                                                                                                                       |
| `src/components/ui/Button.tsx`         | `primary` (Gradient-Border), `secondary` (`bg-brand-deep`), `outline` | **Source of Truth** der globalen B2B-Buttons. `secondary` ist bereits Navy. `primary` ist die Gradient-Sonderform — Entscheidung später, ob konsolidieren. |

Decken-CTA-Stand der Consumer-Pages **nach Migration**:

- Hero primary → navy (heute schon, brand-deep)
- Header → teal **→ wird navy**
- Modal-Trigger → navy (heute schon)
- FinalCTA primary → teal **→ wird navy** (variant="teal" auf shell.tsx:597)
- Audience-Anker → teal-Text (kein BG, bleibt accent)
- Submit → navy (heute schon)

---

## 4) Semantische Map (Kompakt)

| Semantisches Token | → Primitive (Hex / Tailwind)                                              |
| ------------------ | ------------------------------------------------------------------------- |
| `surface.body`     | `#f8fafc` (`bg-slate-50`)                                                 |
| `surface.card`     | `#ffffff`                                                                 |
| `surface.tint`     | `#f0fdfa` / `#f1f5f9` (slate-100)                                         |
| `surface.dark`     | **`brand.navy`** (#083358)                                                |
| `surface.brand`    | **`brand.blue`** (#0f5f95) — Footer                                       |
| `text.heading`     | **`text.heading`** (#203864 ← gray-900)                                   |
| `text.body`        | `slate-700` (#334155)                                                     |
| `text.muted`       | `slate-500` (#64748b)                                                     |
| `text.on-dark`     | `#ffffff`                                                                 |
| `text.accent`      | **`accent-strong`** (teal-700)                                            |
| `border.default`   | `slate-200` (#e2e8f0)                                                     |
| `border.strong`    | `slate-300` (#cbd5e1)                                                     |
| `border.accent`    | **`accent-border`** (teal-200)                                            |
| **`cta.bg`**       | **`brand.navy`** (#083358)                                                |
| **`cta.bg-hover`** | **`brand.navy-hover`** (#0a4170)                                          |
| **`cta.text`**     | `#ffffff`                                                                 |
| **`accent`**       | **`#0d9488`** (teal-600)                                                  |
| `accent-line`      | `teal-500` (#14b8a6)                                                      |
| `accent-soft`      | `teal-50` (#f0fdfa)                                                       |
| `accent-on-dark`   | `teal-300` (#5eead4)                                                      |
| `brand.linkedin`   | `#0077b5` (social.linkedin — belassen)                                    |
| `meta.theme-color` | **konsolidieren** auf `brand.navy` (#083358), heute `#1e3a5f` (off-token) |

---

## 5) Migrationsrisiko je Wert

| Aktion                                                                                     | Risk                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bg-[#083358]/85` → `bg-brand-navy/85` (Header.tsx ×3)                                     | **low** — identischer Hex.                                                                                                                                                            |
| `bg-[#0a4170]` als `cta.navy-hover` Token formalisieren                                    | **low** — 2 Call-Sites.                                                                                                                                                               |
| `gray-900` Token-Rename → `text.heading` / `navy.text`                                     | **med** — 42 Files, mechanisch (sed-fähig).                                                                                                                                           |
| `brand.deep` → `brand.navy` (Rename, Hex bleibt)                                           | **med** — 77 Klassen-Sites, Aliase einbauen.                                                                                                                                          |
| `brand.primary` → `brand.blue` (Rename)                                                    | **med-high** — 205 Sites. Schrittweise mit Alias.                                                                                                                                     |
| Theme-Color/`#1e3a5f` → `#083358`                                                          | **low** technisch, **visual** changes Chrome-Tab-Farbe auf Android (minor).                                                                                                           |
| `variant="teal"` Consumer-CTAs → `variant="navy"` (Header, FinalCTA-primary)               | **low** technisch, **deliberate visual** (Brief sagt CTA = Navy).                                                                                                                     |
| `emerald-*` Akzente konsolidieren auf Teal                                                 | **med** — 3 Dateien (S3-Leitlinie, Vitamin-D3-Implantologie, shell.tsx Ingredient-Bar). Bedeutung beachten: in S3-Leitlinie könnte „grün" Erfolgs-Semantik haben (Token `success.*`). |
| `teal-*` Skala auf 6 Stufen pinnen (accent / -strong / -line / -soft / -border / -on-dark) | **low** — Token-Aliase neu, Migration optional.                                                                                                                                       |
| `#1e3a5f` / `#0f1f33` in `public/` (OG-Image, Favicon) auf Brand-Navy bringen              | **low-med** — Asset-Regenerierung, nicht Code.                                                                                                                                        |

---

## 6) Bewusst NICHT konsolidiert

- **FlagIcon.tsx**: `#012169`, `#C8102E`, `#009246`, `#11457e`, `#21468b`, `#0077b5` etc. — Nationalflaggen, semantisch an Sprache gebunden.
- **`social.linkedin` (#0077b5)** — LinkedIn-Brand-Farbe, extern festgelegt.
- **Inline-`#ff0000`/`#d7141a` etc.** in FlagIcon — analog.

---

## 7) Bestätigung

- Kein `src/`-Edit. Kein `tailwind.config`-Edit. Kein `index.html`-Edit.
- Nur dieses Artefakt geschrieben (`_project-knowledge/wave-2-analyse/farb-tokens.md`).
- `tsc` / Docker-Build unberührt.

## 8) Offene Punkte für Freigabe (vor Migration)

1. Alias-Strategie: nur Tokens **renamen** und alte Namen für ein Release als Alias halten — oder direkt umstellen?
2. Emerald in S3-Leitlinie / VitaminD3-Implantologie: **Success-Semantik** behalten (eigene Token-Gruppe `success.*`) **oder** auf Teal vereinheitlichen?
3. Theme-Color `#1e3a5f` → `brand.navy` (#083358) — Android-Chrome-Tab-Farbe wird einen Tick dunkler. OK?
4. Globale Button-Komponente (`components/ui/Button.tsx`) bekommt einen neuen `cta.navy`-Variant, der die Consumer-CTA-Variante `navy:` ersetzt → ein Button-Component für alles, oder Consumer-CTA als slim wrapper darüber lassen?
