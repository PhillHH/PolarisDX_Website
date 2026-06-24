# Projekt-Entscheidungen (vor dem ersten Archon-Lauf ausfüllen)

Das Playbook stoppt an mehreren Stellen mit „**Nachfrage-Schwelle**" (Marke, Schrift, Tonalität,
Markt, Feature-Streichung). Ein autonomer Swarm kann dich nicht mitten im Lauf fragen — er würde
raten und thrashen. **Lege diese Punkte hier einmal verbindlich fest;** der Swarm liest sie als
gegebene Fakten. Felder mit `TODO` blockieren die betroffene Aufgabe, bis sie gefüllt sind.

## 1. Marke & Farbe `[FIL][BUD]`

- **Primärfarbe (Aktion/Brand):** `TODO` (Hex, z. B. `#2f6bff`)
- **Sekundär-/Akzentfarbe(n):** `TODO`
- **Neutral-Palette (Grau-Range):** `TODO` (oder „aus Primär ableiten")
- **Status-Farben:** success/danger/warning — `TODO` (oder Defaults beibehalten)
- **Light/Dark/Brand-Themes gewünscht?** `TODO` (welche?)

## 2. Typografie `[FIL]`

- **Schriftfamilie(n)** (max. 2): `TODO` (z. B. Heading + Body; oder eine Variable Font)
- **Bezug** (`next/font` Google/lokal?): `TODO`
- **Type-Scale-Ratio:** `TODO` (Default 1.25 „Major Third"; Alternative 1.618)
- **Body-Mindestgröße:** ≥16px (fix, nicht ändern)

## 3. Layout & Breakpoints `[FIL]`

- **Grid:** 12 Spalten (Default) — abweichend? `TODO`
- **Breakpoints:** Default sm/md/lg/xl = 640/768/1024/1280 — abweichend? `TODO`
- **Reading-/Form-Container-Breite:** `TODO` (Default ~65ch)

## 4. Sprache, Markt & Inhalt `[NOR][BEC]`

- **Ziel-Locales / Märkte:** `TODO` (z. B. de-DE, en-US) — bestimmt i18n-Aufbau
- **Tonalität / Voice:** `TODO` (z. B. „sachlich-vertrauensvoll, B2B"); Tone je Szenario
- **Quelle echter Inhalte/Texte:** `TODO` (CMS? `content/`? wer liefert reale Daten für Phase 6?)
- **Rechtliches/Pflichtseiten** (Impressum, Datenschutz, …): `TODO`

## 5. Scope & Feature-Entscheidungen `[BEC]` (Product Graveyard)

- **Features/Seiten, die DEFINITIV bleiben:** `TODO`
- **Kandidaten zum Streichen/Zusammenlegen:** `TODO` (Swarm darf vorschlagen, aber nicht ohne Freigabe entfernen)
- **Nicht anfassen / Tabu-Bereiche:** `TODO` (z. B. Checkout, Auth-Flows, Legacy-Module)

## 6. Technische Leitplanken `[§]`

- **Styling-Ansatz:** `TODO` (Tailwind / CSS Modules / …) — bestimmt §3.3-Mapping
- **Token-Setup:** `TODO` (CSS-first §3.0 A / JSON-first + Style Dictionary §3.0 B)
- **Performance-Budget je Route (First-Load-JS):** `TODO` (z. B. ≤ Baseline; harter Grenzwert?)
- **Audit-URL (lokal/staging):** `TODO` (gegen welche laufende Instanz prüfen axe/lighthouse?)
- **Darf der Swarm auf `main` pushen oder nur Feature-Branch + PR?** `TODO` (Empfehlung: Branch + PR)

> Solange ein für eine Aufgabe relevantes Feld `TODO` ist, **diese Aufgabe nicht raten** —
> als offene Frage queuen und an der Stelle pausieren (siehe `ARCHON-README.md` › Betriebs-Hinweise).
