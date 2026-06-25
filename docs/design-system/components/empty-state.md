# EmptyState

> Leerzustand fuer den „kein Datensatz / keine Treffer"-Fall — schliesst als `empty`-Mitglied die UI-State-Familie der feedback-Ebene (loading=`Spinner`, error/success=`Alert`, empty=`EmptyState`). Atomic-Ebene: feedback. Quelle (eine Definition, Holy Grail): `src/design-system/feedback/empty-state.tsx`. Live im Styleguide: `/styleguide#empty-state`.

## 1. Anatomy

`EmptyState` rendert ein zentriertes `<div role="status">` mit einem einzelnen `<p>{title}</p>`. Inhalts-/kontext-agnostisch: der Aufrufer reicht die Meldung als `title` (Pflicht-Prop). Optik laeuft ueber **eine** orthogonale Achse `variant` (`plain`/`outlined`), nicht ueber Kopien.

Styling ist **token-rein**: Text/Rahmen/Flaeche ausschliesslich ueber `--empty-state-*`-Component-Tokens in `[var(--token)]`-Form; Abstaende/Radius ueber die rem-basierte Tailwind-Skala (kein Roh-Hex, kein arbitrary-px). `plain` ist rahmenlos (`py-10`), `outlined` setzt einen gestrichelten Rahmen + Flaeche (`rounded-xl border border-dashed`, `p-8`).

**A11y:** `role="status"` kuendigt einen dynamisch eintretenden Leerzustand (z. B. „keine Suchergebnisse") hoeflich fuer Screenreader an. Das Interface uebernimmt `Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>` — das native `title`-Attribut wird bewusst durch den Text-Prop ersetzt; uebrige Div-Attribute werden durchgereicht.

| Prop        | Typ                                                   | Default     | Zweck                                                                                        |
| ----------- | ----------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| `variant`   | `'plain' \| 'outlined'`                               | `'plain'`   | Optik-Achse: `plain` rahmenlos (`py-10`), `outlined` gestrichelter Rahmen + Flaeche (`p-8`). |
| `title`     | `React.ReactNode`                                     | – (Pflicht) | Primaere Meldung, gerendert als `<p>`.                                                       |
| `className` | `string`                                              | –           | Zusatzklassen, via `cn()` an die CVA-Basis gemergt.                                          |
| `...props`  | `Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>` | –           | Durchgereichte Div-Attribute (ohne natives `title`).                                         |

## 2. Playground / Galerie

Spezimen unter `/styleguide#empty-state`:

- `variant="plain"` — rahmenloser Leerzustand (`py-10`), z. B. in Modals/Listen.
- `variant="outlined"` — gestrichelter Rahmen + Flaeche (`p-8`), z. B. fuer eigenstaendige Panel-Bloecke.
- Kurzer `title` (eine Zeile, „Keine Ergebnisse gefunden.").
- Edge Case: langer mehrzeiliger `title` (zentriert umbrechend).
- Edge Case: `title` als `ReactNode` (z. B. Text + Inline-Hinweis).

## 3. Usage

Einsetzen, wenn eine Liste/Sammlung **legitim leer** ist (keine Treffer, noch keine Daten) — **nicht** fuer Fehler (dafuer `Alert variant="danger"`) und nicht waehrend des Ladens (dafuer `Spinner`).

```tsx
import { EmptyState } from '~/design-system'
;<EmptyState variant="outlined" title="Bald verfuegbar." />
```

## 4. Do's & Don'ts

- ✅ Konkrete, kontextbezogene Meldung als `title` reichen (z. B. „Keine Suchergebnisse").
- ✅ `outlined` fuer eigenstaendige Flaechen, `plain` fuer eingebettete Listen/Modals.
- ✅ Layout-Feinschliff ueber `className` am Aufrufer.
- ❌ Nicht fuer Fehlerzustaende verwenden — dafuer existiert `Alert`.
- ❌ Kein natives `title`-Attribut erwarten — der Prop ist die sichtbare Meldung.
- ❌ Keine weiteren `variant`-Kopien erfinden — die Achse ist `plain`/`outlined`.

## 5. Code-Snippet (aus echtem Code)

```tsx
<EmptyState variant="outlined" title={t('downloads:comingSoon')} />
```

`Quelle: src/pages/DownloadsPage.tsx:92`
