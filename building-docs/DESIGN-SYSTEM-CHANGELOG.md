# DESIGN-SYSTEM-CHANGELOG

**Änderungsprotokoll der öffentlichen Design-System-Oberfläche.**
Angelegt in **AP05 / PT05.5** (`AP05.md` §10.8), weil kein Changelog-System kanonisch existierte.

**Verwandt:** `DESIGN-SYSTEM-CONTRACT.md` (der Vertrag) · `tailwind.config.js` (Token-Werte) ·
`scripts/check-design-system-changelog.mjs` (das Gate).

---

## 0. Wozu dieses Dokument

Eine Änderung an Farbtokens, Typografie-Rollen oder Komponenten-Exporten ist ein
**Vertragsereignis**: an ihr hängen Aufrufstellen, die niemand einzeln im Blick hat. Wird eine
Rolle stillschweigend umbenannt oder entfernt, fällt das erst irgendwann auf einer Seite auf.

Deshalb gilt: **kein stiller Bruch.** Jede Änderung an der unten dokumentierten Oberfläche
bekommt eine Change Note **und** eine Aktualisierung des passenden `SURFACE`-Blocks.

Das Gate `npm run check:ds-changelog` vergleicht die **tatsächliche** Oberfläche im Code mit
der hier dokumentierten und schlägt bei jeder Abweichung fehl — pre-commit und in CI.

**Bewusst nicht hier:** Release-Notes-Prozess, Testabdeckung und Visual-Regression-Verdrahtung.
Das ist **AP27** und wird nicht vorweggenommen.

---

## 1. Change Notes

### 2026-10-15 — AP27-CLOSURE · PT276-F9: PT05.5-Baselines auf den Relaunch-Stand (kein Vertragsbruch)

- **Ursache:** Die 22+6 Baselines aus `e2e/design-system.spec.ts` (PT05.5, Oberflaechen zuletzt neu in
  AP06 PT06.2) stammen aus `6596a90` (2026-08-28). Danach haben spaetere APs die Oberflaechen gewollt
  veraendert: AP24 PT24.4 Kontrast (`gray-500` #868C98 → #6b7280, dunklere Status-`ink`-Toene), AP25
  PT25.4 metrisch angepasster `Inter Fallback` (andere Laufweite, dadurch anderer Umbruch bei 390 px),
  AP13 Diagnostik-Hub, AP14 Service-Detail und AP17 Artikeluebersicht (Seiten neu gebaut). 19 von 28
  Vergleichen scheiterten deshalb (PT276-F9), in CI (Laeufe 35078488402, 38723003426) und lokal identisch.
- **Betroffene Screenshots (19):** Oberflaechen desktop `buttons`, `typography`, `typography-on-navy`,
  `section-navy`; mobil `buttons`, `typography`, `typography-on-navy`, `form-controls`, `status-alerts`,
  `cards`, `states`, `dialog`, `section-navy`; Seiten `hero-diagnostics`, `longform-service`,
  `final-cta-articles` (je desktop und mobil). Unveraendert und weiter bestaetigt: die uebrigen 9.
- **Produkt-/Design-Delta:** in diesem Schritt **keins**. Die Bilder halten fest, was AP13/14/17/24/25
  bereits umgesetzt und dort dokumentiert haben. Oberflaechen: gleiche Struktur, 2–8 % abweichende Pixel
  durch Schriftlaufweite und Kontrasttoene. Seiten: strukturell neu (z. B. Service-Detail desktop
  1440×19222 → 1440×4129, Diagnostik-Hub desktop 1440×4670 → 1440×7546).
- **Mitgeaendert:** Der Test „nimmt bei Bewegungsreduktion keine Funktion weg" suchte die Pause-Taste des
  Startseiten-Karussells, das AP12 entfernt hat (HOMEPAGE-CONTRACT, Hero). Er prueft jetzt den primaeren
  Anfrageweg (DEC-RL-013): „Angebot anfragen" ist sichtbar und fuehrt zu `/de/contact`. Keine Schwelle
  veraendert (`maxDiffPixelRatio` bleibt 0,01), kein Test entfernt.
- **Plattform:** aufgenommen im gepinnten Image `mcr.microsoft.com/playwright:v1.57.0-noble` mit
  `--update-snapshots=changed` (nur die abweichenden Bilder), danach ohne Update 35/35 bestaetigt.
- **Beim Review sichtbar (kein neuer Befund):** In den ganzseitigen Seitenbildern steht das fixierte
  Cookie-Banner mitten im Bild; das war in den alten Baselines genauso.
- **Reviewer:** Agent-Review aller 19 Alt/Neu-Paare (Claude Code, 2026-10-15); fachliche Abnahme durch
  den Design-Owner **offen**.

### 2026-09-15 — AP27 PT27.6 · Seiten-/Zustands-Baselines (kein Vertragsbruch, kein Design-Delta)

- **Ursache:** PT27.6 fuehrt `e2e/pt27.6-visual.spec.ts` ein — 21 **erstmalige** Baselines repraesentativer
  Seiten und Zustaende. Keine bestehende Baseline wurde neu aufgenommen; die 22+6 Baselines aus PT05.5
  bleiben unberuehrt.
- **Produkt-/Design-Delta:** **keins.** Die Bilder halten den aktuellen Light-/Sales-Machine-Stand fest; es
  wurde keine Art Direction eingefuehrt und keine Token-, Rollen- oder Komponentenaenderung vorgenommen.
- **Screenshots (Desktop 1280×800):** `home`, `diagnostics-hub`, `service-detail`, `igloo-pro`,
  `epigenetics-hub`, `musterbefund`, `article`, `resource-center`, `contact`, `support`, `legal-privacy`,
  `consumer-spray`, `not-found` (404), `epigenetics-panel`, `resource-gate-open`, `diagnostics-megamenu-open`,
  `search-dialog-open`, `cookie-banner`. **Mobil (390×844):** `home-mobile`, `navigation-open-mobile`,
  `consumer-spray-mobile`.
- **Plattform:** aufgenommen und zweimal ohne Update bestaetigt im gepinnten Image
  `mcr.microsoft.com/playwright:v1.57.0-noble` (`npm run test:visual:docker`), Pixel-Toleranz 0.
- **Beim Review sichtbare Ist-Befunde (festgehalten, nicht korrigiert — keine Aenderung ohne eigenen Auftrag):**
  PT276-F1 das geoeffnete Diagnostik-Mega-Menue ragt bei 1280 px links aus dem Viewport (erste Spalte
  abgeschnitten); PT276-F2 der fixierte Header ueberdeckt auf der Startseite die Eyebrow-Zeile des Hero;
  PT276-F3 der geoeffnete Download-Gate-Zustand laesst die rechte Rasterspalte leer. Wird einer davon
  behoben, ist die zugehoerige Baseline mit eigenem Eintrag hier neu aufzunehmen.
- **Reviewer:** Agent-Review der 21 Bilder im PT27.6-Lauf; fachliche Abnahme durch Design-Owner **offen**.

### 2026-08-25 — AP06 PT06.2 · Diagnostik-Mega-Menü (kein Vertragsbruch)

- **Keine** Änderung an Tokens, `.t-*`-Rollen oder Komponenten-Exporten — das Gate bleibt grün.
- **Nebenwirkung, dokumentiert:** die Rollen `t-h6`, `t-caption` und `t-link-cta` waren bis hierher
  _definiert, aber nicht im Build_ (Tailwind gibt `@layer components` nur bei Verwendung aus, siehe
  Eintrag PT05.5). Das Mega-Menü ist ihre erste Aufrufstelle; sie werden jetzt emittiert. Dadurch
  änderte sich die Darstellung der Galerie-Flächen (deren Überschriften `t-h6` nutzen), und **alle 22
  Oberflächen-Baselines wurden neu aufgenommen**. Das ist der erwartete Effekt einer Adoption, kein
  Regressionsfund.

### 2026-08-25 — AP05 PT05.5 · Motion, Visual Regression, Error States

- **Neu:** Visual-Regression-Galerie (`scripts/build-visual-gallery.tsx`, Ausgabe
  `dist/visual-gallery.html` — bewusst **ausserhalb** des ausgelieferten `dist/client/`) und
  `e2e/design-system.spec.ts` mit 22 Oberflächen-Baselines und 6 Seiten-Baselines.
- **Neu:** dieses Changelog samt Gate.
- **Geändert:** `RootErrorBoundary`/`SegmentErrorBoundary` rendern ihre Fehleroberfläche jetzt
  über `ErrorState` statt über eigenes Markup — **eine** Fehleroberfläche, nicht drei.
  Kein API-Bruch: beide Komponenten behalten Signatur und Verhalten.
- **Kein Token-Bruch, kein Komponenten-Bruch.**

### 2026-08-25 — AP05 PT05.4 · Layout-/Sales-Machine-Patterns

- **Neu:** `Section`, `Container`, `CardGrid` (`src/components/layout/Section.tsx`).
- **Geändert (nicht brechend):** `Card` verliert im interaktiven Zustand `hover:shadow-card`
  und folgt damit dem im Bestand dominanten reinen Hover-Lift.
- Karussell-Steuerungen: Pause/Play 16 → 44 px, Slider-Punkte 10 → 24 px Trefferhöhe.

### 2026-08-25 — AP05 PT05.3 · Core UI-Komponenten

- **Neu:** `Card`, `FormField`, `Checkbox`, `Radio`, `Select`, `Dialog`, `LoadingState`,
  `EmptyState`, `ErrorState`, `Skeleton`.
- **Neu:** Farbfamilie **`warning`** (`warning`, `warning.soft`, `warning.strong`).
- **Erweitert (additiv):** `Button` um `ghost`, `loading`, externe-Link-Semantik;
  `Alert` um `info`, `warning`, `error`.
- **Deprecated, nicht entfernt:** `Alert variant="destructive"` → gleichbedeutend mit `error`.
- **Geändert:** `Button size="icon"` 40 → 44 px (0 Aufrufstellen betroffen).
- **A11y-Korrektur:** `Textarea`-Fehlertext `red-500` → `red-600`.

### 2026-08-25 — AP05 PT05.2 · Typografie

- **Neu:** Typografie-Rollen `.t-*` in `src/index.css` (19 Rollen).
- **A11y-Korrektur:** Longform-Ink `.rich-content` `gray-500` → `gray-700`;
  Prosa-Links im Ruhezustand unterstrichen.
- **Entfernt (Bauzeit):** Google-Fonts-Bezug in `scripts/og-image-template.html`.

### 2026-08-25 — AP05 PT05.1 · Visuelle Baseline und Tokens

- **Neu:** Motion-Tokens (`transitionDuration`, `transitionTimingFunction`),
  `spacing.section`/`section-lg`, `boxShadow.dialog`.
- **Klassifiziert, nicht migriert:** Legacy-Aliase (`accentBlue`, `brand.navy-mid`,
  `brand.blue-bright`, `ui.border-hover` — je 0 Aufrufstellen).
- **A11y-Korrektur:** Bedienelement-Begrenzungen auf `ui.field`.
- Farb-Guard zusätzlich in CI verankert.

---

## 2. Dokumentierte Oberfläche

Diese Blöcke werden vom Gate gelesen. **Nicht von Hand kürzen** — sie sind der Soll-Zustand.

### 2.1 Farbtokens

<!-- SURFACE:colors -->

`accent` · `accent.border` · `accent.line` · `accent.on-dark` · `accent.soft` · `accent.strong` ·
`accentBlue` · `befund.amber` · `befund.amber.ink` · `befund.amber.soft` · `befund.green` ·
`befund.green.ink` · `befund.green.soft` · `befund.red` · `befund.red.ink` · `befund.red.soft` ·
`brand.blue` · `brand.blue-bright` · `brand.deep` · `brand.navy` · `brand.navy-hover` ·
`brand.navy-mid` · `brand.primary` · `brand.secondary` · `gray-100` · `gray-500` · `heading` ·
`social.linkedin` · `success` · `success.soft` · `success.strong` · `ui.border` ·
`ui.border-hover` · `ui.field` · `ui.text-muted` · `warning` · `warning.soft` · `warning.strong`

<!-- /SURFACE:colors -->

### 2.2 Typografie-Rollen

<!-- SURFACE:typography -->

`t-body` · `t-body-on-dark` · `t-caption` · `t-error` · `t-h1` · `t-h2` · `t-h2-section` ·
`t-h2-sub` · `t-h3` · `t-h4` · `t-h5` · `t-h6` · `t-helper` · `t-label` · `t-lead` ·
`t-lead-on-dark` · `t-link` · `t-link-cta` · `t-small`

<!-- /SURFACE:typography -->

### 2.3 Komponenten und öffentliche Konstanten

<!-- SURFACE:components -->

`Alert` · `Button` · `Card` · `CardGrid` · `Checkbox` · `Container` · `Dialog` · `EYEBROW_DARK` ·
`EYEBROW_LIGHT` · `EmptyState` · `ErrorState` · `Eyebrow` · `FormField` · `Input` ·
`LoadingSpinner` · `LoadingState` · `Radio` · `Section` · `SectionHeader` · `Select` ·
`Skeleton` · `Textarea` · `buttonVariants` · `textareaVariants`

<!-- /SURFACE:components -->

---

## 3. Regeln

| Regel       | Bedeutung                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------- |
| **DS-CL-1** | Jede Änderung an Tokens, `.t-*`-Rollen oder Komponenten-Exporten braucht eine Change Note.        |
| **DS-CL-2** | Der passende `SURFACE`-Block wird **im selben Commit** aktualisiert.                              |
| **DS-CL-3** | Entfernen oder Umbenennen ist ein **Bruch** und wird als solcher benannt — nicht als „Aufräumen“. |
| **DS-CL-4** | Ein Alias wird zuerst als `deprecated` geführt und erst danach entfernt.                          |
| **DS-CL-5** | Neue Farbe? Token **und** `PALETTE_HEX` in `scripts/check-color-tokens.mjs` im selben Commit.     |
