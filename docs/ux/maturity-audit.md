# Maturity-Audit (bottom-up) — Phase 6.6

> Bewertung jeder Hauptseite entlang der UX-Reifegrade **usable → useful → desirable → delightful**
> (Aarron Walter / Maslow für UX). **Mindestziel: usable + useful.** Höhere Stufen werden erst
> angegangen, **nachdem** A11y (WCAG 2.2 AA) erfüllt ist — _Delight niemals vor Barrierefreiheit._
> Stand **2026-06-25**.

## Reifegrade

| Stufe          | Frage                                                              | Mindest?         |
| -------------- | ------------------------------------------------------------------ | ---------------- |
| **usable**     | Funktioniert es ohne Hürde? (States, Fehler, Tastatur, kein Crash) | **Ja (Pflicht)** |
| **useful**     | Löst es die zentrale Aufgabe der Persona?                          | **Ja (Pflicht)** |
| **desirable**  | Fühlt es sich vertrauenswürdig/markenstark an?                     | Ziel             |
| **delightful** | Überrascht es positiv (ohne A11y zu opfern)?                       | Optional         |

Skala je Stufe: **✓ erreicht · ◐ teilweise · ✗ offen**

---

## Seiten-Bewertung

| Seite                                  | usable | useful | desirable | delightful | Mindestziel erfüllt? |
| -------------------------------------- | ------ | ------ | --------- | ---------- | -------------------- |
| Home `/`                               | ✓      | ✓      | ✓         | ◐          | **Ja**               |
| Diagnostik-Übersicht `/diagnostics`    | ✓      | ✓      | ✓         | ◐          | **Ja**               |
| Diagnostik-Detail `/diagnostics/:slug` | ✓      | ✓      | ◐         | ✗          | **Ja**               |
| Artikel-Index `/articles`              | ✓      | ✓      | ✓         | ◐          | **Ja**               |
| Artikel `/articles/:slug`              | ✓      | ✓      | ✓         | ◐          | **Ja**               |
| Events `/events`                       | ✓      | ✓      | ✓         | ◐          | **Ja**               |
| Support `/support`                     | ✓      | ✓      | ◐         | ✗          | **Ja**               |
| Kontakt `/contact`                     | ✓      | ✓      | ◐         | ✗          | **Ja**               |
| Über uns `/about`                      | ✓      | ✓      | ✓         | ✗          | **Ja**               |
| Igloo Pro `/igloo-pro`                 | ✓      | ✓      | ✓         | ◐          | **Ja**               |
| Downloads `/downloads`                 | ✓      | ✓      | ◐         | ✗          | **Ja**               |
| Consumer-LP Spray/Masks/Duo            | ✓      | ✓      | ✓         | ◐          | **Ja**               |

**Ergebnis:** Alle Hauptseiten erreichen das Mindestziel **usable + useful**. Kein Blocker offen.

---

## Begründung je Stufe (Querschnitt)

### usable ✓ (Pflicht erfüllt)

- **States:** Jede datengetriebene Sicht hat loading/empty/error/success (Detail: `heuristics-audit.md`
  - Phase-6.1-Belege im `REFACTOR-LOG.md`). Kein Lorem/`placeholder.*`/Stacktrace ausgeliefert.
- **Resilienz:** Root- + Segment-`ErrorBoundary`, `Suspense`-Skelett, Catch-all-404 (`App.tsx`).
- **Tastatur/A11y:** Skip-Link, `<main>`-Landmark, `focus-visible` flächendeckend (Phase 3),
  Modale schließen mit Esc (UX-601/603/604 ✅), `prefers-reduced-motion` + `prefers-color-scheme`.
- **Fehlervermeidung:** Inline-Validierung im Bestell-/Kontaktformular, Consent nicht vorausgewählt,
  Bestätigung gegen Datenverlust beim Modal-Schließen.

### useful ✓ (Pflicht erfüllt)

- Jede Seite bedient die zentrale Aufgabe ihrer Persona (siehe `task-orientation` unten / Personas):
  - **Mara (B2B):** Home → Diagnostik → Detail → Kontakt ist als durchgehender Pfad mit klarem
    Primär-CTA vorhanden.
  - **Tomasz (Fachleser):** Artikel in Reading-Width, verwandte Ressourcen, Sprachtreue.
  - **Lena (Consumer):** LP → Preis sichtbar → Bestell-Modal in wenigen Feldern.

### desirable ◐ (Ziel, größtenteils erreicht)

- Konsistentes Token-/Typo-System (Phase 1–3), Marken-Navy/Teal, seriöse Bildsprache.
- **◐ offen** bei Support/Kontakt/Downloads/Detail: funktional sauber, aber visuell nüchtern;
  Vertrauenselemente (Testimonials, Logos, „Antwort in 2 Tagen") nur teilweise platziert.

### delightful ◐/✗ (optional — **nicht vor A11y**)

- Vorhandene Microinteractions: `Reveal`-Animationen, Modal-Enter-Halo, Hover-Unterstreichungen —
  alle `motion-reduce`-sicher.
- **Bewusst zurückgestellt:** Weitergehende Delight-Maßnahmen (z. B. animierte Datenvisualisierung
  auf Detailseiten) sind **nach** dem A11y-Backlog (UX-606 Focus-Trap) eingeplant, nicht davor.

---

## Findings → Backlog (Maturity-Tickets)

| ID     | Seite(n)                    | Lücke                                                     | Ziel-Stufe | Prio                    |
| ------ | --------------------------- | --------------------------------------------------------- | ---------- | ----------------------- |
| MAT-01 | Support, Kontakt, Downloads | Vertrauenselemente/Reassurance fehlen teilweise           | desirable  | mittel                  |
| MAT-02 | Diagnostik-Detail           | nüchterner Abschluss, schwacher Sekundär-Pfad             | desirable  | mittel                  |
| MAT-03 | global                      | Delight-Ausbau (Datenvisualisierung) erst **nach** UX-606 | delightful | niedrig (gated by A11y) |

> **Leitplanke:** MAT-03 ist explizit an den Abschluss des A11y-Tickets **UX-606** gekoppelt —
> festgehalten, damit Delight nicht versehentlich vor Barrierefreiheit gezogen wird.
