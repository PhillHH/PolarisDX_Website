# Feature-Graveyard

> Tote / deaktivierte Features mit leerem „Used-by" oder 0 Sichtbarkeit (§Phase 6.8).
> **Regel (ASSUMPTION 4):** Code aus `main` wird **nur nach menschlicher Freigabe** entfernt.
> Bis dahin bleiben die Einträge hier dokumentiert und im Code als Kommentar markiert.
> Stand **2026-06-25**.

| Status-Legende |                                                                  |
| -------------- | ---------------------------------------------------------------- |
| 🪦 BEGRABEN    | bereits deaktiviert/auskommentiert — Entfernung vorgeschlagen    |
| ⏳ FREIGABE    | wartet auf menschliche Entscheidung (entfernen vs. reaktivieren) |
| ♻️ BEHALTEN    | technisch „tot" wirkend, aber bewusst aktiv (Begründung)         |

---

## Kandidaten

### 1. `FeaturedCaseStudy` — Case-Study-Sektion auf der Startseite 🪦 ⏳

- **Ort:** `src/components/sections/FeaturedCaseStudy.tsx`
- **Used-by:** **0 aktive Importe.** In `src/pages/HomePage.tsx` ist sowohl der Import (Zeile 18)
  als auch das Rendering (Block-Kommentar Zeile 87–89) auskommentiert („temporarily disabled").
- **Abhängigkeit:** verweist auf Route `/casestudys/32reasons`, die **nicht existiert**
  (kein `<Route>` in `App.tsx`) → der interne Link wäre ein 404.
- **i18n:** nutzt Namespace `casestudies` — ebenfalls nur noch von dieser toten Komponente referenziert.
- **Klick-/Sichtbarkeit:** 0 (nicht gerendert).
- **Empfehlung:** Komponente + `casestudies`-Namespace entfernen, **oder** Case-Study-Route
  bauen und reaktivieren. **Bedarf menschlicher Freigabe** — Marketing-Entscheidung.

### 2. Nav-Eintrag „Case Studies" (`/casestudys/32reasons`) 🪦 ⏳

- **Ort:** `src/components/layout/Header.tsx:36` (auskommentiert, „temporarily disabled").
- **Used-by:** nicht in der Navigation; Zielroute existiert nicht.
- **Empfehlung:** zusammen mit (1) entscheiden. Bei „raus" → Kommentarzeile löschen.

### 3. Nav-Eintrag „Shop" (`/shop`) 🪦 ⏳

- **Ort:** `src/components/layout/Header.tsx:37` (auskommentiert, „Shop disabled").
- **Used-by:** keine `/shop`-Route in `App.tsx`.
- **Hinweis:** Der i18n-**Namespace** `shop` ist **nicht** tot — er liefert weiterhin Strings für
  Artikel-/Breadcrumb-Texte (`ArticlePage`, `ArticlesIndexPage`). Nur der **Nav-/Routen-Teil**
  des Shops ist tot.
- **Empfehlung:** Kommentarzeile entfernen (Shop ist strategisch abgelöst durch Consumer-LPs).
  **Freigabe nötig**, falls Shop-Wiederbelebung geplant ist.

---

## Bewusst behalten (kein Graveyard)

### `/services`, `/services/:slug` → Redirect auf `/diagnostics` ♻️ BEHALTEN

- **Ort:** `App.tsx:304–305`. Sehen „ungenutzt" aus, sind aber **bewusste 301-Brücken** für alte
  SEO-URLs/Backlinks. **Nicht** entfernen (würde Linkjuice + Bestands-Bookmarks brechen).

### `ChatWidget` (Drittanbieter-Chat) ♻️ BEHALTEN

- **Ort:** `src/components/ui/ChatWidget.tsx`, global gemountet in `App.tsx:115`.
- Lädt ein externes Chat-Script. Aktiv und sichtbar → **kein** Graveyard-Kandidat.
  (A11y/Dark-Pattern-Bewertung des Widgets siehe `dark-patterns-checklist.md`.)

---

## Prozess

1. Eintrag hier anlegen (Ort · Used-by · Sichtbarkeit/Klicks · Empfehlung).
2. Im Code als Kommentar markiert lassen (kein Hard-Delete).
3. Menschliche Freigabe einholen (Nachfrage §1.17).
4. Erst nach Freigabe: Datei/Code aus `main` entfernen, Eintrag auf 🪦 BEGRABEN + Commit-Hash.
