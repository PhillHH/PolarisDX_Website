# PolarisDX Preview — Backlog (bekannte, dokumentierte Defizite)

> Aus der Phase-1-Analyse hervorgegangene, bewusst zurückgestellte Aufgaben. Ehrlich markiert:
> das sind **bekannte** Lücken, keine blinden Flecken. Jede wird als eigener Slice bearbeitet.

## G4b — DE-Inhalte in 8 Locales noch unübersetzt (eigener Übersetzungs-Slice)
**Status:** offen. **Aufgedeckt:** Slice 1 (G4). **Warum zurückgestellt:** gehört nicht in einen
CTA-/Refactor-Slice; medizinisch korrekte Übersetzung in 8 Sprachen ist eine eigene Qualitätsaufgabe,
kein Nebenbei-Diff.

Derselbe deutsche Artikel **`rapid_setup_formula`** (excerpt + title + sections) und die
**Testimonial-Rollen** (`testimonials.*.role`) stehen unübersetzt auf Deutsch in:
`fr, it, es, pt, da, nl, cs, pl` (je `public/locales/<lng>/articles.json` bzw. `home.json`).
→ Bis dahin steht auf `/fr`, `/it`, `/es`, `/pt`, `/da`, `/nl`, `/cs`, `/pl` deutscher Artikeltext
für diesen einen Artikel. **Bekanntes, dokumentiertes Defizit.** In Slice 1 wurde nur **EN** korrigiert.

**To-Do:** je Locale `rapid_setup_formula` (excerpt, title, sections inkl. listItems) + die 4–5
`role`-Felder medizinisch korrekt übersetzen. i18n-Keyset-Guard bleibt derweil grün (Keys vorhanden).

## G5 — Widerspruch CV < 2 % vs. CV < 5 % (offene Fachfrage, NICHT raten)
**Status:** blockiert auf Fachentscheidung DX365/Datenblatt. **Aufgedeckt:** Phase 1 (global-fixes G5).

`public/locales/de/products.json:60` `"accuracy_value": "CV < 5%"` + `:122` (Meta) widersprechen
`:16`/`:73` `"CV < 2 %"` (Highlights). Gleiches Muster in `fr/products.json`, `pl/products.json`.
Überall sonst (Home-Stats, Services, structuredData, useHeroSlider) durchgängig **CV < 2 %**.

**Vermutung** (zu bestätigen): Inter-Reader-Präzision < 2 % vs. Intra-/Gesamt < 5 %.
**To-Do:** korrekten dokumentierten Wert bei DX365 / im Datenblatt klären, dann konsistent setzen.
Bis dahin **wird die IglooPro-Zahl nicht angefasst**. `structuredData.ts` nur nach expliziter Freigabe.
