# Heuristik-Audit (Nielsen 10) — Phase 6.5

> Bewertung jeder Hauptseite gegen Nielsens 10 Usability-Heuristiken. Findings werden als
> **Tickets** (UX-6xx) erfasst; behobene Punkte sind als ✅ markiert, offene als ⬜.
> Skala je Heuristik: **OK** · **minor** (kosmetisch) · **major** (Aufgabe behindert).
> Quelle: Code-Review + statische Heuristik-Analyse. Stand **2026-06-25**.

## Die 10 Heuristiken (Kürzel)

| #   | Heuristik                           | Kürzel      |
| --- | ----------------------------------- | ----------- |
| H1  | Sichtbarkeit des Systemstatus       | Status      |
| H2  | Übereinstimmung System ↔ reale Welt | RealWorld   |
| H3  | Nutzerkontrolle & Freiheit          | Control     |
| H4  | Konsistenz & Standards              | Konsistenz  |
| H5  | Fehlervermeidung                    | Prävention  |
| H6  | Wiedererkennen statt Erinnern       | Recognition |
| H7  | Flexibilität & Effizienz            | Effizienz   |
| H8  | Ästhetik & minimalistisches Design  | Minimal     |
| H9  | Fehler erkennen, verstehen, beheben | Recovery    |
| H10 | Hilfe & Dokumentation               | Hilfe       |

---

## Seiten-Matrix

Legende: ✓ OK · ▴ minor · ▾ major

| Seite / Route                          | H1  | H2  | H3  | H4  | H5  | H6  | H7  | H8  | H9  | H10 | Tickets             |
| -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------- |
| Home `/`                               | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ▴   | ✓   | ✓   | UX-608              |
| Diagnostik-Übersicht `/diagnostics`    | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | —                   |
| Diagnostik-Detail `/diagnostics/:slug` | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ▴   | ✓   | ✓   | ✓   | UX-605              |
| Artikel-Index `/articles`              | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | —                   |
| Artikel `/articles/:slug`              | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | —                   |
| Events `/events`                       | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | —                   |
| Support `/support`                     | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | —                   |
| Kontakt `/contact`                     | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | —                   |
| Über uns `/about`                      | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | —                   |
| Igloo Pro `/igloo-pro`                 | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ▴   | UX-607              |
| Downloads `/downloads`                 | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | —                   |
| Globale Suche (Modal)                  | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | UX-601 ✅           |
| Consumer-LP Spray/Masks/Duo            | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | UX-602 ✅ UX-603 ✅ |
| 404 `*`                                | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | —                   |

---

## Per-Seite-Notizen (Begründung der Bewertung)

### Home `/`

- **H1 Status:** Lazy-Sektionen über `Reveal`, Route-Wechsel mit `Suspense`-Skelett (`RouteFallback`). ✓
- **H3 Control:** Skip-Link + `<main>`-Landmark, kein Auto-Redirect, kein Modal-Zwang. ✓
- **H8 Minimal (▴):** Sehr viele Sektionen — Risiko konkurrierender Aufmerksamkeit. Ein dominanter
  Primär-CTA ist gesetzt (Hero), aber mehrere sekundäre CTAs buhlen um Klicks → **UX-608**.
- **H9 Recovery:** Segment-Error-Boundary fängt Sektionsfehler, Header/Footer bleiben bedienbar. ✓

### Diagnostik-Detail `/diagnostics/:slug`

- **H5 Prävention:** Unbekannter Slug → expliziter „Service not found"-Fallback (kein Crash). ✓
- **H7 Effizienz (▴):** „Service not found" nutzt einen schlichten `<div>` statt der `EmptyState`-
  Komponente mit Zurück-CTA → Wiedereinstieg dauert einen Gedanken länger → **UX-605**.
- **H2 RealWorld:** Inhalte über Rich-HTML + FAQ in Fachsprache mit Erklärungen. ✓

### Artikel `/articles/:slug`

- **H1 Status:** Ladezustand mit zentriertem `Spinner` (artikulierter 300 ms-Lookup). ✓
- **H9 Recovery:** `error`/`!article` → `Alert` + „Back to Overview"-Button (Ausweg garantiert). ✓
- **H10 Hilfe:** Disclaimer + verwandte Artikel/Services als Kontexthilfe. ✓

### Igloo Pro `/igloo-pro`

- **H10 Hilfe (▴):** Spezifikations-/Parametertabellen ohne Glossar/Tooltip für Fachbegriffe →
  Erstnutzer:innen ohne Vorwissen müssen extern nachschlagen → **UX-607** (Tooltip/Legende, low-prio).

### Globale Suche (Modal)

- **H3 Control / H9 Recovery:** **Behoben (UX-601 ✅):** Esc-to-close jetzt implementiert (Footer
  versprach „Esc to close" ohne Handler), `role="dialog"`/`aria-modal`/`aria-label` ergänzt,
  Backdrop-Klick schließt. Loading/Empty/Error-States vorhanden (`Spinner`/`EmptyState`/`Alert`).

### Consumer-LP (Spray / Masks / Duo) + Bestell-Modal

- **H5 Prävention (UX-602 ✅):** Inline-Validierung für Name/E-Mail im `OrderForm` ergänzt
  (Klartext-Fehler unter dem Feld, `aria-invalid`/`aria-describedby`, Fokus auf erstes Fehlerfeld);
  Consent bleibt Pflicht (nicht vorausgewählt, GDPR Art. 6(1)(b)).
- **H3 Control / Datenverlust (UX-603 ✅):** Schließen des Bestell-Modals mit ausgefülltem Formular
  fragt jetzt per Bestätigung nach („Discard your order request?") → kein stiller Datenverlust.
  Esc/Backdrop/Close-Button laufen über denselben Guard.
- **H4 Konsistenz:** Modal-Muster (role/aria/Esc/Scroll-Lock) konsistent mit `OrderModal`. ✓

### 404 `*`

- **H9 Recovery:** Klartext-Seite mit Zurück-zur-Startseite-CTA, kein Stacktrace. ✓

---

## Tickets

| ID         | Titel                                                             | Heuristik | Schwere | Status                    |
| ---------- | ----------------------------------------------------------------- | --------- | ------- | ------------------------- |
| **UX-601** | Suche: Esc-to-close + `role=dialog`/aria + Backdrop-Klick         | H3/H9     | major   | ✅ behoben                |
| **UX-602** | Bestellformular: Inline-Validierung Name/E-Mail (Klartext)        | H5/H9     | major   | ✅ behoben                |
| **UX-603** | Bestell-Modal: Bestätigung gegen Datenverlust beim Schließen      | H3/H5     | major   | ✅ behoben                |
| **UX-604** | Mobile-Menüs (Main + Consumer-Shell): Esc-to-close                | H3        | minor   | ✅ behoben                |
| **UX-605** | Diagnostik-Detail 404 → `EmptyState` mit Zurück-CTA statt `<div>` | H7        | minor   | ⬜ offen                  |
| **UX-606** | Modale: vollständiger Focus-Trap (nicht nur Initial-Fokus)        | H3        | minor   | ⬜ offen (A11y-Backlog)   |
| **UX-607** | Igloo Pro: Glossar/Tooltip für Fachbegriffe                       | H10       | minor   | ⬜ offen (nice-to-have)   |
| **UX-608** | Home: sekundäre CTAs reduzieren / Hierarchie schärfen             | H8        | minor   | ⬜ offen (Content-Review) |

> **Hinweis Delight ≠ vor A11y:** Offene Tickets UX-606 (Focus-Trap) priorisieren A11y über die
> Delight-orientierten Punkte (UX-607/608). Reihenfolge der Abarbeitung: A11y → Effizienz → Delight.
