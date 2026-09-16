# ACCESSIBILITY-CONTRACT

**Projekt:** PolarisDX Website Relaunch
**Repository:** `/home/phillip/01polaris-preview`
**Angelegt:** AP24 PT24.1 (Semantik), 2026-09-11
**Branch:** `console/24-25-2026-09-11T13-00-11`
**HEAD bei Anlage:** `48ca775ac70f6bab0869ac8a37ad035494ff4a64`

---

## 0. Was dieses Dokument ist — und was nicht

Dieses Dokument ist der Accessibility-Vertrag des Relaunches. Es haelt fest,
was **gemessen** wurde, wo es gemessen wurde und was daraus folgt.

**Zielstandard: WCAG 2.2 AA als Qualitaetsziel.**

**Keine Zertifizierungsbehauptung.** Es gibt hier keine formale
Konformitaetspruefung, kein externes Audit und keine rechtliche Garantie.
Automatisierte Werkzeuge decken nur einen Teil der Erfolgskriterien ab; ein
gruener Lauf heisst „keine der geprueften Regeln verletzt", nicht „barrierefrei".
Aussagen wie „WCAG-zertifiziert" oder „rechtlich vollstaendig konform" sind ohne
separate externe Pruefung unzulaessig.

---

## 1. Messumgebung

Alle Zahlen unten stammen aus einem echten Browser (Chromium, Playwright) gegen
den **Dev-SSR-Server** (`npm run dev`, `NODE_ENV=development`), Viewport
1280x900 sofern nicht anders vermerkt.

Kein Produktionsbuild — Fast-Delta V2 verbietet ihn in PT24.1–PT24.5, und fuer
Dokumentstruktur ist er ohne Belang: dieselben Komponenten, dasselbe DOM.

Zwei Umgebungsvariablen sind dabei Messwerkzeug, nicht Anwendungskonfiguration:

| Variable                 | Grund                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POLARIS_VITE_CACHE_DIR` | Auf dieser Maschine laufen Preview-Container **als root** gegen denselben Repositoriumspfad und besitzen `node_modules/.vite/deps`. Ein Dev-Start als normale Nutzerin scheitert sonst mit `EACCES: permission denied, unlink .vite/deps/_metadata.json`. Der Lauf legt seinen eigenen Optimizer-Cache an, statt fremde — moeglicherweise gerade benutzte — Container-Artefakte anzufassen. |
| `NODE_ENV=development`   | Ohne sie liefert `server.ts` aus `dist/`, und `dist/` ist aelter als der Quellstand (Stand 2026-09-01). Gemessen wuerde ein Build von vor zehn Tagen.                                                                                                                                                                                                                                       |

Zusaetzlich schliesst `vite.config.ts` `email/**` aus dem Dev-Watcher aus: dort
liegt der eingecheckte Symlink `email/assets/assets` → `/home/phillip/01polaris/
email/assets`, ein Verweis auf sich selbst. Der Watcher lief darin in eine
Endlosschleife und beendete den Prozess mit `ELOOP`. `email/` ist der
Python-Mailversand, weder Teil des Builds noch der Anwendung.

---

## 2. Repraesentative Routenmatrix (26 Routen)

Jede Shell, jedes Seitentemplate, jede Formularfamilie ist genau einmal
vertreten. Nicht jede statische Inhaltsseite wird identisch tief geprueft, wenn
dieselben Komponenten hier bereits abgedeckt sind.

| Route                                                                    | Template / Besonderheit                                               |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `/de/`                                                                   | Home, B2B-Shell, ROI-Rechner (6 Zahlenfelder), FAQ-Akkordeon          |
| `/de/about`                                                              | Corporate                                                             |
| `/de/articles`                                                           | Index                                                                 |
| `/de/articles/der-unsichtbare-patient`                                   | Artikeldetail (Tabellen-Sections moeglich)                            |
| `/de/diagnostics`                                                        | Hub mit `aside`                                                       |
| `/de/diagnostics/dental`                                                 | Service-Detail, 2 `aside`, 3 `region`                                 |
| `/de/contact`                                                            | Kontaktformular, `fieldset`-Gruppe, Honeypot                          |
| `/de/support`                                                            | Supportformular, Select, Datei-Upload                                 |
| `/de/privacy` · `/de/imprint` · `/de/terms`                              | LegalLayout                                                           |
| `/de/events`                                                             | Events                                                                |
| `/de/igloo-pro`                                                          | Produkt, Spezifikationstabelle                                        |
| `/de/vitamin-d3-implantologie`                                           | Fachseite, Dosierungstabelle, Praxis-Bestellformular                  |
| `/de/s3_leitlinie`                                                       | Fachseite, Vergleichstabelle, handgebauter Brotkrumenpfad             |
| `/de/vitamin-d3-spray`                                                   | Produkt, Preistabelle, Praxis-Bestellformular                         |
| `/de/epigenetics`                                                        | Hub, Anfrageformular, Vergleichstabelle im Scrollbereich              |
| `/de/epigenetics/grundlagen` · `/studienlage` · `/unterlagen`            | Unterseiten                                                           |
| `/de/epigenetics/musterbefund/metabolic-health`                          | Musterbefund: 20 Tabellen, 6 Navigationen, Charts                     |
| `/de/downloads`                                                          | Ressourcenzentrum, Resource Gate                                      |
| `/de/consumer/vitamin-d3-spray` · `/hydrating-masks` · `/inside-out-duo` | Consumer-Shell (eigene Kopf-/Fusszeile), Bestell-Modal, Preis-Popover |
| `/de/gibt-es-nicht`                                                      | 404                                                                   |

---

## 3. Landmark Map

**Gemessen nach PT24.1 auf allen 26 Routen:**

| Landmark                  | Befund                                                                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`                    | **genau 1** auf 26/26 Routen. Traegt `id="main-content"` und `tabIndex={-1}` (Sprungziel).                                                    |
| `banner` (`header`)       | genau 1 auf 26/26.                                                                                                                            |
| `contentinfo` (`footer`)  | genau 1 auf 26/26.                                                                                                                            |
| `navigation`              | 2–6 je Route, **alle benannt** (0 namenlos).                                                                                                  |
| `search`                  | 0 — die Suche ist ein modaler Dialog, kein Suchbereich der Seite. Bewusst kein `role="search"`.                                               |
| `complementary` (`aside`) | 0–2, nur auf Hub- und Detailseiten.                                                                                                           |
| `region`                  | 0–20; ausschliesslich FAQ-Antworten (`aria-labelledby` auf die Frage) und fokussierbare Tabellen-Scrollbereiche (`aria-label`). Alle benannt. |
| redundante Rollen         | **0** — keine Rolle wiederholt die native Semantik.                                                                                           |

**Navigationsnamen (lokalisiert, x10):**

| Name                                                                                                                          | Routen                  | Quelle                                              |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------- |
| Hauptnavigation                                                                                                               | 23 (B2B) + 3 (Consumer) | `common:a11y.main_nav` / `consumer:shell.nav_label` |
| Fusszeilen-Navigation                                                                                                         | 26                      | `common:footer.nav_label`                           |
| Brotkruemelnavigation                                                                                                         | 21                      | `common:a11y.breadcrumb`                            |
| Kapitel                                                                                                                       | 5                       | Musterbefund `ChapterNav`                           |
| Inhaltsuebersicht · Im Detail · Musterbefunde · Die anderen Musterbefunde · Weiterfuehrende IglooPro-Links · Hilfreiche Links | je 1                    | seitenlokal                                         |

Das mobile Menue ist seit PT24.1 ein `nav` und traegt denselben Namen wie die
Desktop-Navigation. Beide schliessen einander per Breakpoint aus
(`hidden md:flex` gegen `md:hidden`) — es ist immer nur eine im
Accessibility-Tree.

---

## 4. Heading Map

**Gemessen nach PT24.1 auf allen 26 Routen:**

- **genau eine `h1`** je Route, nie leer;
- **0 uebersprungene Ebenen** unter den sichtbaren Ueberschriften;
- **0 leere Ueberschriften**;
- keine doppelten Desktop-/Mobil-Ueberschriften (die jeweils andere Fassung ist
  `display:none` und damit aus dem Tree).

Ebenenvergabe:

| Ort                               | Ebene                                                                                                                      |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Seitentitel (Hero / Seitenkopf)   | `h1`, genau einmal                                                                                                         |
| Abschnitte in `main`              | `h2`                                                                                                                       |
| Karten, FAQ-Fragen, Unterpunkte   | `h3`                                                                                                                       |
| Fusszeilenspalten (`contentinfo`) | `h2` — seit PT24.1. Vorher `h3` ohne jede `h2` darueber; auf der 404-Seite entstand daraus ein messbarer Sprung `h1 → h3`. |
| Consent-Banner                    | `h3` im benannten `section` — die Ebene ist dort ohne Gliederungsanspruch.                                                 |

Die Darstellung haengt an Utility-Klassen, nicht am Element: eine Ebenenaenderung
ist visuell folgenlos.

---

## 5. Form / Error / Status Map

**Formularfamilien:**

| Formular            | Route                                                  | Bausteine                                              | Fehlerbeziehung                                                  |
| ------------------- | ------------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------- |
| Kontakt             | `/de/contact`                                          | `Input`, `Textarea`, `fieldset`/`legend`, 2 Checkboxen | `aria-invalid` + `aria-describedby` + `role="alert"`             |
| Support             | `/de/support`                                          | `Input`, `Textarea`, natives `select`, Datei-Upload    | dito; Statusmeldungen ueber `Alert` (`role=status`/`role=alert`) |
| Epigenetik-Anfrage  | `/de/epigenetics`                                      | `Input`, `Textarea`, 3 `select`                        | dito                                                             |
| Praxis-Bestellung   | `/de/vitamin-d3-spray`, `/de/vitamin-d3-implantologie` | handgebaute Label/Controls                             | Formularfehler `role="alert"`, Erfolg `role="status"`            |
| ROI-Rechner         | `/de/`                                                 | 6 `input[type=number]` mit `label`                     | kein Fehlerzustand                                               |
| Consumer-Bestellung | Consumer-Modal                                         | `OrderForm`                                            | 2x `role="alert"`                                                |

**Zusicherungen, die gelten:**

- **jedes** sichtbare Bedienelement hat einen zugaenglichen Namen (0 Ausnahmen
  auf allen geprueften Routen);
- Placeholder ist nirgends der alleinige Name;
- Pflichtangabe steht im Attribut (`required` / `aria-required`), nicht nur im
  Sternchen — auf `/de/vitamin-d3-spray` gemessen, 0 Sternchen ohne Attribut;
- Fehlertexte haengen per `aria-describedby` am Feld **und** tragen
  `role="alert"`;
- Gruppen nutzen `fieldset`/`legend` (Kontakt: Bereichsauswahl);
- drei Honeypot-Felder (`contact-hp`, `support-hp`, `epigenetics-inquiry-hp`)
  sind korrekt entkoppelt: `aria-hidden` am Container **und** `tabIndex={-1}`
  am Feld.

**Live-Regionen (sparsam, zustandswahr):**

| Ort                                          | Rolle                                                           |
| -------------------------------------------- | --------------------------------------------------------------- |
| Feldfehler in `Input`/`Textarea`/`FormField` | `role="alert"`                                                  |
| Formularstatus (`Alert`)                     | `role="status"` bzw. `role="alert"`                             |
| Suchergebniszahl (`SearchModal`)             | `sr-only`, `role="status"`, `aria-live="polite"`, `aria-atomic` |
| Lade-/Fehlerzustaende (`StateBlock`)         | `role="status"` + polite bzw. `role="alert"`                    |
| Dateiname am Support-Upload                  | `role="status"`                                                 |
| Bestell-Erfolgsflaeche                       | `role="status"`                                                 |

Gemessen: **keine der 26 Routen startet mit einem belegten `role="alert"`.**

---

## 6. Interactive Component Map (Ist-Zustand nach PT24.2, im Browser gemessen)

Gemessen ausschliesslich per Tastatur (`Tab`, `Shift+Tab`, `Enter`, `Space`,
`Escape`, Pfeiltasten) — kein Klick dort, wo die Frage lautet „geht das auch
ohne Maus?".

| Komponente                                       | Oeffnen                                                    | Modalitaet                                             | Fokus beim Oeffnen                                  | Escape                     | Fokusrueckgabe                          | Fokusfalle                              |
| ------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------- | -------------------------- | --------------------------------------- | --------------------------------------- |
| **Header Mega-Menue**                            | `Enter` **und** `Space` auf `button[data-submenu-trigger]` | nicht modal                                            | bleibt auf dem Ausloeser, `Tab` fuehrt hinein       | schliesst                  | Ausloeser                               | keine (richtig)                         |
| **Mobiles Menue**                                | `Enter` auf dem Burger                                     | **nicht modal** — `body` nicht gesperrt, bewusst       | bleibt auf dem Burger, `Tab` fuehrt hinein          | **schliesst (PT24.2)**     | **Burger (PT24.2)**                     | keine (richtig)                         |
| **Suche**                                        | `Enter` auf dem Suchknopf                                  | modal, `aria-modal="true"`, `body` gesperrt            | **Suchfeld**                                        | schliesst                  | Suchknopf                               | **ja** — `Tab` und `Shift+Tab` im Kreis |
| **Consent-Banner**                               | erscheint selbst                                           | **nicht modal**, `section` mit Namen                   | kein Fokuswechsel (beabsichtigt)                    | —                          | —                                       | keine (richtig)                         |
| **Consent-Einstellungen**                        | `Enter` auf dem Aufklapper                                 | inline                                                 | Ausloeser                                           | — (Aufklapper, kein Popup) | —                                       | keine                                   |
| **Sprachumschalter**                             | `Enter`, `Space` **oder `ArrowDown`**                      | nicht modal                                            | `ArrowDown` setzt auf den ersten Eintrag            | **schliesst (PT24.2)**     | **Ausloeser (PT24.2)**                  | keine (richtig)                         |
| **Consumer-Bestell-Modal**                       | `Enter` auf jeder Bestell-CTA                              | modal, `aria-modal="true"`, `body` gesperrt            | Schliessen-Knopf                                    | schliesst                  | **ausloesende CTA (PT24.2)**            | **ja (PT24.2)**                         |
| **Preis-Popover** (`PriceBadge`)                 | Hover **und** Fokus (WCAG 1.4.13)                          | nicht modal, **`role="note"` statt `dialog` (PT24.2)** | kein Fokuswechsel — der Inhalt hat 0 Bedienelemente | schliesst                  | Ausloeser                               | keine (richtig)                         |
| **FAQ-Akkordeon**                                | `Enter`/`Space`, `aria-expanded` + `aria-controls`         | inline                                                 | —                                                   | —                          | —                                       | keine                                   |
| **ChapterNav ab `lg`**                           | native `a[href="#..."]`, `aria-current`                    | —                                                      | —                                                   | —                          | —                                       | keine                                   |
| **ChapterNav unter `lg`**                        | natives `<details>`/`<summary>`, `Enter` oeffnet           | —                                                      | `Tab` fuehrt in die Kapitelliste                    | UA-Standard                | —                                       | keine                                   |
| **Tabellen-Scrollbereiche**                      | `div[role=region][tabindex=0][aria-label]`                 | —                                                      | per `Tab` erreichbar, Pfeiltasten scrollen          | —                          | —                                       | keine                                   |
| **Resource Gate** (`/de/epigenetics/unterlagen`) | `Enter` auf `button[aria-expanded]`                        | inline                                                 | `Tab` fuehrt ins Formular                           | — (Aufklapper)             | **Ausloeser nach „Abbrechen" (PT24.2)** | keine                                   |
| **Slider/Carousel**                              | —                                                          | **existiert nicht** im geprueften Scope                | —                                                   | —                          | —                                       | —                                       |

**Keyboard Traps: 0.** Auf acht repraesentativen Routen wurde 60 Schritte weit
getabbt und die **Identitaet** des fokussierten Elements verglichen (nicht seine
Beschriftung — sechs unbeschriftete Zahlenfelder im ROI-Rechner und drei
gleichlautende „Weiterlesen"-Links sehen als Text identisch aus, sind aber
verschiedene Ziele). Laengste Wiederholung desselben Knotens: **1**.

**Positives `tabindex`: 0** auf allen geprueften Routen.

**Doppelte Tabziele Desktop/Mobil: 0** — Header und ChapterNav rendern beide
Fassungen ins DOM, die jeweils andere ist `display:none` und damit kein Tabziel.

---

## 7. Focus- und Contrast-Map (Stand nach PT24.4)

### 7.1 Fokus — gemessen, nicht geschaetzt

Alle Zahlen aus einem echten Browser, ueber die Tabkette von acht
Route-/Viewport-Kombinationen (Deutsch, Polnisch, Tschechisch; 1280x900 und
390x844).

| Befund                                                           | Stand nach PT24.3 |
| ---------------------------------------------------------------- | ----------------- |
| Tabziele ohne jeden sichtbaren Fokus                             | **0**             |
| Fokusmarkierung unter 3:1 (WCAG 1.4.11)                          | **0**             |
| Fokusring von `overflow:hidden` abgeschnitten                    | **0**             |
| fokussiertes Element von klebenden Flaechen verdeckt (SC 2.4.11) | **0**             |
| globale Regel, die den Fokus ersatzlos entfernt                  | **0**             |

**Die Fokus-Token:**

| Flaeche                               | Ring                                                         | Kontrast                                                                |
| ------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| hell, B2B                             | `ring-brand-primary` (`#0d527f`)                             | 8,3:1 auf Weiss · 7,93:1 auf slate-50                                   |
| hell, Consumer                        | `ring-accent-strong` (`#0f766e`)                             | 5,47:1 auf Weiss                                                        |
| dunkel (Navy)                         | `ring-white/80` + `ring-offset-brand-deep`                   | ~12,9:1                                                                 |
| **Sicherheitsnetz** (`src/index.css`) | 2px Weiss (`box-shadow`) + 2px Navy (`outline`, Versatz 2px) | auf Weiss 12,9:1 ueber die Navy-Linie, auf Navy 12,9:1 ueber die weisse |

Das Sicherheitsnetz steht in `@layer base` hinter `:where(...)` und hat damit
Spezifitaet null: jede Komponente mit eigenem Ring gewinnt weiterhin, die Regel
greift nur, wo sonst der Standardring des Browsers uebrig bliebe — auf Navy
gemessene **1,47:1**.

### 7.2 Kontrast — gemessen an echten Pixeln (PT24.4)

**Messverfahren.** Text unsichtbar schalten, Bildschirmfoto machen, die Flaeche
unter jedem Textknoten abtasten. Der `getComputedStyle`-Ansatz aus PT24.3 ist
ersetzt: er lief die Elternkette bis zur ersten nicht-transparenten
`background-color` hoch und sah keine `background-image` — weisser Text ueber
einem Verlauf landete rechnerisch auf der hellen Rumpf-Flaeche.

**Zwei Messfallen, beide in PT24.4 zugeschlagen und im Test als Regel notiert:**

1. **Rechtecke und Foto muessen zum selben Zustand gehoeren.** Ein Lauf mit
   verschobener Reihenfolge meldete 199 Befunde, von denen die Mehrheit
   Fliesstext auf einer navyblauen Flaeche behauptete, die es dort nie gab.
2. **Nur vollstaendig freiliegende Elemente messen — und `sticky` zaehlt mit.**
   Der erste Ausschluss fragte nur nach `fixed` und liess die klebende
   Kapitelleiste des Musterbefunds aus; eine Einordnungs-Plakette darunter
   wurde samt Navy abgetastet und als 2,58:1 gemeldet, obwohl sie auf ihrer
   eigenen hellen Flaeche bei 4,65:1 liegt.

**Ergebnis nach PT24.4, ueber sechs Routen und die ganze Seitenhoehe:**

| Pruefung                                                    | Stand |
| ----------------------------------------------------------- | ----- |
| Textknoten unter AA (4,5:1 bzw. 3:1 ab 24px / 18,66px fett) | **0** |
| Bedienelemente unter AA in Ruhe, Hover und Fokus (Text)     | **0** |
| Begrenzungen von Bedienelementen unter 3:1 (WCAG 1.4.11)    | **0** |
| Text auf dunklen Markenflaechen unter AA                    | **0** |
| Einordnungs-Plaketten unter AA                              | **0** |
| Aussage allein ueber Farbe                                  | **0** |

**Behobene Token und Aufrufstellen:**

| Was                                             | War                                                | Ist                           | Reichweite                                                                                |
| ----------------------------------------------- | -------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------- |
| `gray-500`                                      | `#868C98` — 3,38:1 auf Weiss                       | `#6b7280` — 4,83:1            | **47 Aufrufstellen** auf einen Schlag; derselbe Wert wie `ui.field`                       |
| Begrenzung von Bedienelementen                  | `border-gray-300`/`border-slate-300` — 1,47–1,48:1 | `border-ui-field` — 4,83:1    | **17 Bedienelemente**: Eingabefelder, Auswahlfelder, Kontrollkaestchen, umrandete Knoepfe |
| Support-Handlungslinks 14px/600                 | `text-accent` — 3,74:1                             | `text-accent-strong` — 5,47:1 | 3                                                                                         |
| Kontakt-Schrittziffern 18px/600 auf Akzent-Tint | `text-accent` — 3,32:1                             | `text-accent-strong` — 4,85:1 | 3                                                                                         |
| Mikrotext und Platzhalter                       | `gray-400` — 2,54:1                                | `ui-field` — 4,83:1           | 3                                                                                         |
| Gruppenueberschriften im mobilen Menue, 11px    | `text-white/50` auf Navy — 4,38:1                  | `text-white/70` — 7,10:1      | 2                                                                                         |
| Hinweis auf `brand-blue`, 12px                  | `text-white/60` — 4,08:1                           | `text-white/70` — 4,96:1      | 1                                                                                         |
| Kontakt-Pill im Hover                           | `border-accent/60` — 2,15:1                        | `border-accent` — 3,74:1      | 1                                                                                         |

**Deckkraftstufen von Weiss auf dunklen Markenflaechen — verbindlich:**

| Stufe      | auf `brand-navy` `#083358` | auf `brand-blue` `#0d527f`                                         |
| ---------- | -------------------------- | ------------------------------------------------------------------ |
| `white`    | 12,92                      | 8,30                                                               |
| `white/80` | 8,80                       | 5,95                                                               |
| `white/70` | 7,10                       | **4,96** — die unterste Stufe, die auf BEIDEN Flaechen AA erfuellt |
| `white/60` | 5,63                       | **4,08** — nur auf Navy zulaessig                                  |
| `white/50` | **4,38**                   | **3,32** — fuer Text nirgends zulaessig                            |

**Bewusst NICHT geaendert, mit Begruendung:**

- **Deaktivierte Bedienelemente.** Text 2,95:1, Rand 1,98:1. WCAG nimmt inaktive
  Bedienelemente in 1.4.3 und 1.4.11 ausdruecklich aus; sie sollen gedaempft
  aussehen. Ein Test haelt fest, dass der Zustand gedaempft BLEIBT.
- **Dekorative `aria-hidden`-Zeichen.** Der Trennpunkt „●" im Consumer-Faktband
  (`text-accent-line`, 2,49:1) ist die optische Entsprechung eines Leerraums:
  `aria-hidden`, ohne Buchstabe oder Ziffer, ohne Aussage. Der Test nimmt genau
  diese Klasse benannt und begruendet aus — nicht stillschweigend.
- **Dekorative Icons.** Acht `aria-hidden`-Symbole (Haken, Kalender, Ortsmarke)
  in `text-accent-line`. Sie stehen jeweils neben Text, der dasselbe sagt, und
  sind damit nicht „zum Verstehen noetig" im Sinne von 1.4.11.
- **`befund.*.DEFAULT`.** Amber liegt auf Weiss bei 2,45:1 — hat aber **0
  Aufrufstellen**. Statt den Wert zu aendern, ist die Einschraenkung jetzt im
  Token-Kommentar festgeschrieben: reines Dekor, nie Text, nie bedeutungstragende
  Grafik. Dafuer ist `ink` da.

### 7.2b Die Befund-Ampel traegt ihre Aussage nicht in der Farbe

| Ton             | `ink` auf eigenem `soft` | `ink` auf Weiss |
| --------------- | ------------------------ | --------------- |
| rot `#bb4c35`   | 4,65                     | 5,00            |
| amber `#946a1d` | 4,60                     | 4,84            |
| gruen `#377d5e` | 4,61                     | 4,93            |

Alle drei erfuellen AA. Entscheidend ist aber die zweite Zahl: die drei Toene
unterscheiden sich **untereinander nur um 1,01 bis 1,03:1**. Wer Farbtoene nicht
trennen kann, sieht drei identisch helle Flaechen. Die Aussage haengt deshalb
nicht an der Farbe:

- jede Einordnung traegt ihren **Text** (`ToneBadge` mit „Erhoehter Bedarf",
  „Moderat", …) — gemessen: 88 Plaketten, **0 ohne Text**;
- jeder Balken traegt seinen **Zahlenwert** (`2/9`) und den Status als Text;
- die SVG-Balken selbst sind `aria-hidden`; die eine Ausnahme
  (`BefundMiniature`) ist `role="img"` mit `aria-label` — benannt statt
  versteckt, und das ist hier das Bessere.

### 7.3 Bestandsangaben aus der Palette

`npm run check:colors` ist gruen: eine Navy (`#083358`), ein Akzent (Teal),
kein Raw-Hex, keine Fremd-`rgb()`.

| Flaeche                                      | Token                                                                      | Vermerk                                    |
| -------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------ |
| Akzent auf Navy                              | `accent.on-dark` `#2dd4bf`                                                 | 6,94:1 — auf Navy gut, auf Weiss 1,86:1    |
| Bedienelement-Rahmen, Placeholder, Hilfstext | `ui.field` `#6b7280`                                                       | 4,83:1 auf Weiss                           |
| **Nur Dekor, nie Text**                      | `ui.border` (1,23:1), `ui.border-hover` (1,48:1), `ui.text-muted` (2,56:1) | 0 Call-Sites                               |
| Befund-Ampel                                 | `befund.red/amber/green` je `DEFAULT`/`soft`/`ink`                         | `ink` traegt die bedeutungstragende Grafik |

Offene Altbefunde: `D-20` (horizontaler Ueberlauf bei 1024 px, AP24/AP25) und
ein `axe`-`moderate`-Landmarks-Befund auf den Legal-Seiten (AP20-CLOSURE,
Empfehlung: mit PT24.6 buendeln).

---

## 8. Media / Chart Map (Stand nach PT24.5, im Browser gemessen)

### 8.1 Bilder

| Pruefung                                             | Stand                          |
| ---------------------------------------------------- | ------------------------------ |
| `img` ohne `alt`-Attribut                            | **0** auf 12 Routen            |
| Dateiname als Alternativtext                         | **0**                          |
| mechanisches Praefix („Bild von …")                  | **0**                          |
| Alternativtext laenger als 160 Zeichen               | **0**                          |
| Alternativtext wiederholt den Linknamen              | **0**                          |
| Alternativtext wiederholt die Ueberschrift der Karte | **0** — vorher 3 (siehe unten) |

**Behoben:** `BlogCard` setzte `alt={title}` und rendert denselben Titel direkt
darunter als `h3`. Ein Screenreader las ihn damit **zweimal je Kachel**, drei
Kacheln auf der Startseite. Jetzt leeres `alt` — genau so, wie es die
Artikelliste seit jeher macht.

**Als dekorativ BESTAETIGT (leeres `alt` ist hier die richtige Wahl):**

| Bild                                  | Kontext                                           | Warum leer richtig ist                                      |
| ------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| Artikel-Kachelbilder (`/de/articles`) | im Link, der den Titel als Namen traegt           | ein Alternativtext waere die zweite Ansage desselben Titels |
| Artikel-Kachelbilder (Startseite)     | Kachel mit `h3` darunter                          | dito                                                        |
| Artikel-Leitbild auf der Detailseite  | Stimmungsbild zur Ueberschrift, die daneben steht | traegt keine Information, die nicht im Text steht           |
| Portraet im Kundenstimmen-Block       | `figure` mit `figcaption`, die den Namen nennt    | der Name steht als Text                                     |
| Wortmarke in der Fusszeile            | nicht verlinkt, Markenname steht im Fusstext      | Schmuck, kein Inhalt                                        |

Das leere `alt` ist an allen vier Renderstellen **als Entscheidung kommentiert**,
damit es nicht als Versaeumnis gelesen wird. Das Datenmodell haelt `imageAlt`
und `imageCaption` **x10 lokalisiert** bereit (`src/content/articles/model.ts`);
sobald ein Artikel ein Bild MIT eigener Aussage bekommt, gehoert der Text dorthin.

### 8.2 Grafiken und Icons

| Pruefung                                         | Stand             |
| ------------------------------------------------ | ----------------- |
| `svg` gesamt (12 Routen)                         | 441               |
| davon `aria-hidden` (auch ueber einen Vorfahren) | 440               |
| davon benannt (`role="img"` + `aria-label`)      | 1                 |
| **weder versteckt noch benannt**                 | **0** — vorher 38 |
| Icon-Bedienelemente ohne Namen                   | **0**             |

**Behoben:** die zehn Flaggengrafiken des Sprachumschalters und der
Aufklapp-Pfeil standen namenlos im Accessibility-Tree — 38 Stueck ueber zehn
Routen, und **alle** kamen aus `FlagIcon`. `aria-hidden` sitzt jetzt am
Wrapper der Komponente: eine Stelle, zehn Flaggen. Der Knopf traegt seinen
Namen weiterhin selbst; im Accessibility-Snapshot steht nur noch
`button "Sprache wählen": de`.

**Messhinweis für PT24.6 und die Closure:** `aria-hidden` wirkt auf den ganzen
Teilbaum. Wer das Attribut nur am `svg` selbst abfragt, meldet Grafiken als
namenlos, die laengst draussen sind — genau das ist hier im ersten Lauf
passiert. Zu pruefen ist `closest('[aria-hidden="true"]')`.

### 8.3 Diagramme — Textalternative

Die Musterbefunde tragen fuenf Darstellungsformen. Keine verlaesst sich auf das
Bild allein:

| Darstellung                          | Grafik                                           | Textalternative                                                                |
| ------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------ |
| `RadarChart` (Netzdiagramm)          | `role="img"` + **x10 uebersetztes** `aria-label` | `dl` mit allen 11 Achsen und ihren Werten                                      |
| `TrendChart` (Erst-/Kontrollmessung) | `aria-hidden`                                    | je Zeile: Bezeichnung, Ausgangswert, `→`, Kontrollwert, Delta, Status-Plakette |
| `AgeDots` (Altersskala)              | `aria-hidden`                                    | je Zeile: Bezeichnung und Wert („52 Jahre · −2")                               |
| `EvaluationBars` (Ampelliste)        | `aria-hidden`                                    | je Zeile: Bezeichnung, `Wert/9`, Status als Text                               |
| `ScaleBar` / `ScaleRamp`             | `aria-hidden`                                    | Wert als Text ueber der Skala                                                  |
| `BefundMiniature`                    | `role="img"` + **x10 uebersetztes** `aria-label` | benannt statt versteckt — hier ist das die bessere Wahl                        |

**Behoben:** in `AgeDots` stand die Beschriftung der Kalenderalter-Marke
**zweimal** im Accessibility-Tree — einmal `sr-only`, einmal als optische
Position auf der Skala. Gemessen als „48 J.48 J.". Die optische Fassung ist
Grafik und ist jetzt `aria-hidden`.

**Keine Aussage allein ueber Farbe** (PT24.4 gemessen, in PT24.5 bestaetigt):
88 Einordnungs-Plaketten, **0 ohne Text**; jeder Balken traegt seinen Zahlenwert.

### 8.4 Bewegung

| Pruefung                                                 | ohne Praeferenz | `prefers-reduced-motion: reduce` |
| -------------------------------------------------------- | --------------- | -------------------------------- |
| Elemente mit laufender Animation oder Uebergang (`/de/`) | 87              | **0**                            |
| dito (`musterbefund`)                                    | 145             | **0**                            |
| dito (`consumer`)                                        | 104             | **0**                            |
| Elemente mit `scroll-behavior: smooth`                   | 0–1             | **0**                            |
| Inhalt, der bei Reduktion unsichtbar bleibt              | —               | **0**                            |

Der globale Block in `src/index.css` greift; `Reveal` schaltet zusaetzlich sein
Beobachten ab und zeigt den Inhalt sofort. **Bewegung wird reduziert, nicht
gegen Unsichtbarkeit getauscht** — dafuer gibt es eine eigene Zusicherung.

Eine **Gegenprobe** stellt sicher, dass ohne Praeferenz ueberhaupt Animation da
ist: sonst waere der Reduktionstest auch dann gruen, wenn es gar nichts mehr zu
reduzieren gaebe.

### 8.5 Karussell, Autoplay, Video

**Existiert nicht.** Ueber alle zwoelf Routen gemessen: 0 `video`, 0 `audio`,
0 `iframe`, 0 `autoplay`, 0 `marquee`, 0 Karussell. Die Zusicherung bleibt als
Waechter stehen — sollte spaeter eines dazukommen, faellt sie, solange es ohne
benannte Bedienelemente oder ohne Pausenmoeglichkeit kommt.

### 8.6 x10

| Was                                                | Stand                          |
| -------------------------------------------------- | ------------------------------ |
| `samples.imgAlt` (Deckblatt der Musterbefunde)     | 10/10 echt uebersetzt          |
| `befund.mini.alt` (Befund-Miniatur)                | 10/10                          |
| `befund.a11y.radar` (Netzdiagramm)                 | 10/10                          |
| Produktbilder Consumer                             | 10/10 (Stichprobe de/en/pl/cs) |
| durchgereichte i18n-Schluessel im `alt`            | **0**                          |
| Alternativtext identisch mit der deutschen Fassung | **0**                          |

---

## 9. Tabellen

| Route                               | Kopfzellen | `scope`      | Name                               |
| ----------------------------------- | ---------- | ------------ | ---------------------------------- |
| `/de/igloo-pro`                     | ja         | 4/4          | `caption`                          |
| `/de/vitamin-d3-implantologie`      | ja         | 3/3          | `caption` (PT24.1)                 |
| `/de/s3_leitlinie`                  | ja         | 3/3          | `caption` (PT24.1)                 |
| `/de/vitamin-d3-spray`              | ja         | 2/2          | `caption` (PT24.1)                 |
| `/de/epigenetics`                   | ja         | 6/6          | `caption` (PT24.1) + `region`-Name |
| `/de/epigenetics/musterbefund/*`    | ja         | vollstaendig | `caption` je Tabelle               |
| `/de/articles/*` (Tabellen-Section) | ja         | vollstaendig | `caption`                          |

**0 Layouttabellen.** **0 Listen mit Nicht-`li`-Kindern.** **0 `a[href="#"]`,
0 `a[role=button]`, 0 anklickbare `div`/`span`.**

---

## 10. Der automatisierte Gate (Stand PT24.6)

### 10.1 Was laeuft

| Werkzeug                        | Umfang                                                                                    | Ergebnis                   |
| ------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------- |
| `eslint-plugin-jsx-a11y`        | jede ausgelieferte Datei, `flatConfigs.recommended`, **keine Regel abgeschaltet**         | **0 Befunde**              |
| `axe-core` Ruhezustand          | **44 oeffentliche Routen** (Sitemap + vier `NOINDEX`-Seiten + 404), WCAG 2.0/2.1/2.2 A+AA | **0 Verletzungen**         |
| `axe-core` dynamische Zustaende | **17 Zustaende** (siehe 10.3)                                                             | **0 Verletzungen**         |
| `axe-core` x10                  | Kernrouten in `de`, `en`, `pl`, `fr` — 14 Routen je Sprache                               | **0 Verletzungen**         |
| `axe-core` mobil                | Kernrouten bei 390x844                                                                    | **0 Verletzungen**         |
| `axe-core` `best-practice`      | Kernrouten, **kein WCAG-Tor**                                                             | 1 bekannter Eintrag (10.4) |
| Testreihen PT24.1–PT24.5        | 255 Zusicherungen                                                                         | alle gruen                 |
| `e2e/pt24.6.spec.ts`            | 25 Zusicherungen                                                                          | alle gruen                 |

**Aufruf:** `npm run a11y:gate` (nur PT24.6) · `npm run a11y:suite` (alle sechs
Reihen nacheinander).

**Der Gate prueft sich selbst.** Eine Zusicherung baut einen Kontrastfehler in
die Seite und verlangt, dass `axe` ihn meldet. Ohne sie waere ein Gate, das
gar nicht laeuft, von einem sauberen Ergebnis nicht zu unterscheiden.

**Die Routenliste kommt aus der laufenden Sitemap**, nicht aus einer gepflegten
Konstante — eine neue Route kann nicht still am Gate vorbeilaufen.

### 10.2 Was der breite Lauf gefunden hat, das fuenf tiefe Durchgaenge uebersahen

Die weisse Hauptnavigation stand auf `/de/` und `/de/diagnostics` ueber einem
**hellen** Hero. Per Pixelabtastung gemessener Untergrund: `rgb(248,250,252)`
— weisse Schrift darauf ergibt **1,05:1**. `axe` meldete dafuer 16 Knoten der
Stufe `serious`; im Bildschirmfoto ist die Navigation schlicht nicht zu lesen.

Warum es durchkam: PT24.3 hat den FOKUSRING dieser Links gemessen (weiss auf
Navy-Versatz, einwandfrei), und die Kontrastmessung aus PT24.4 schliesst
Elemente unter fixierten Ueberlagerungen aus — also ausgerechnet die Kopfzeile
selbst. **Tiefe ersetzt keine Breite.**

Behoben mit einem Schleier: der unverscrollte Zustand traegt jetzt
`bg-brand-deep/75 backdrop-blur-sm` statt `bg-transparent`. Auf hellem Hero
**6,15:1**, auf dem Mintton **6,31:1**, auf dunklem Hero optisch unauffaellig,
weil es dieselbe Navy ist. **Sichtbare Aenderung — siehe AP27-Uebergabe.**

Weitere Befunde desselben Laufs, alle behoben:

| Befund                                                          | War                  | Ist                                |
| --------------------------------------------------------------- | -------------------- | ---------------------------------- |
| Telefon-/Handlungslinks `text-accent` auf Akzent-Tint und Weiss | 3,32 / 3,57 / 3,74:1 | `text-accent-strong` — 4,85–5,47:1 |
| ODR-Link im Impressum                                           | 3,74:1               | `text-accent-strong` — 5,47:1      |
| Eyebrow `text-accent-strong` auf `bg-brand-deep`                | **2,36:1**           | `text-accent-on-dark` — 6,94:1     |
| Quellenhinweis `text-gray-500` auf getoenter Evidenzflaeche     | 4,28:1               | `text-gray-600` — 6,69:1           |
| Kategorietext im Einwilligungspanel `text-gray-500`             | **4,45:1**           | `text-gray-600` — 6,7:1            |

**Regel, die daraus folgt und im Vertrag steht:** `gray-500` gilt fuer Weiss und
`slate-50`; auf getoenten Flaechen `gray-600`. Der Token hat auf Weiss nur
0,33 Punkte Luft — jede Toenung schiebt ihn darunter.

### 10.3 Die 17 geprueften dynamischen Zustaende

Mega-Menue · Mobiles Menue · Suche leer · Suche mit Treffern · Suche ohne
Treffer · Einwilligungsbanner · Einwilligungs-Einstellungen · Sprachdropdown ·
FAQ aufgeklappt · Bestell-Modal · Preis-Popover · Kontaktformular im
Fehlerzustand · Bestellformular im Fehlerzustand · Resource Gate ·
Kapitelsprung per Hash · Kapitel-Aufklapper mobil · Musterbefund-Wechsler.

**Nicht geprueft und ehrlich benannt:** der Erfolgs- und Wiederholungszustand
der Formulare. Beide brauchen ein antwortendes Backend; in dieser Umgebung
laeuft keines. Der Fehlerzustand ist geprueft, weil ihn die Anwendung selbst
erzeugt. → offener Punkt fuer die Closure.

### 10.4 Triage: Empfehlungen ausserhalb von WCAG

`best-practice`-Regeln sind **kein** WCAG-Kriterium und damit kein Tor. Genau
ein Eintrag besteht, und er ist eine bewusste Entscheidung:

**`landmark-complementary-is-top-level` — `/de/diagnostics`, 1 Knoten, moderate.**
Ein `<aside aria-label="Verlässliche Orientierung">` liegt innerhalb der
Hero-`section`. axe empfiehlt komplementaere Landmarks auf oberster Ebene. Die
Alternative waere, das Landmark aufzugeben (ein `div` daraus zu machen) — und
damit den benannten Sprungpunkt zu verlieren, den eine Screenreader-Nutzerin
heute ansteuern kann. **Ein benanntes, einmaliges `complementary` im Inhalt ist
verstaendlicher als gar keines.** Bewusst belassen; eine Zusicherung haelt den
Bestand fest, damit ein NEUER Eintrag auffaellt statt mitzulaufen.

`A11Y-10` (der `axe`-`moderate`-Landmarks-Befund auf den Legal-Seiten aus
AP20-CLOSURE) **reproduziert nicht mehr**: `/de/privacy`, `/de/imprint` und
`/de/terms` sind unter WCAG- wie unter `best-practice`-Regeln sauber. Die
Landmark-Arbeit aus PT24.1 hat ihn abgeraeumt.

---

## 11. Offene Punkte mit Eigentuemer

| Id            | Befund                                                                                                                                                                                                                       | Eigentuemer                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| ~~`A11Y-01`~~ | Mobiles Menue ohne Escape/Fokusmodell — **erledigt PT24.2**: Escape schliesst, Fokus kehrt auf den Burger zurueck, bewusst ohne Falle                                                                                        | erledigt                   |
| ~~`A11Y-02`~~ | Sprachumschalter ohne Escape/Fokusrueckgabe — **erledigt PT24.2**: Escape, Fokusrueckgabe, `ArrowDown`/`ArrowUp`/`Home`/`End`, Heraustabben schliesst                                                                        | erledigt                   |
| ~~`A11Y-03`~~ | Bestell-Modal ohne Fokusfalle und ohne Rueckgabe — **erledigt PT24.2** ueber denselben Haken wie `Dialog`                                                                                                                    | erledigt                   |
| ~~`A11Y-04`~~ | `PriceBadge` `role="dialog"` ohne Dialog-Mechanik — **erledigt PT24.2**: jetzt `role="note"`, der Aufklapper bleibt ein Aufklapper                                                                                           | erledigt                   |
| ~~`A11Y-05`~~ | Resource Gate — **nachgemessen PT24.2** auf `/de/epigenetics/unterlagen` (auf `/de/downloads` gibt es kein gegatetes Asset, daher dort nichts zu finden); Tastaturweg vollstaendig, Fokusrueckgabe nach „Abbrechen" ergaenzt | erledigt                   |
| ~~`A11Y-06`~~ | Mega-Menue Hover auf `div` — **bewertet PT24.2**: Hover ist Zusatz, nicht der einzige Weg (`Enter`/`Space`/`Escape` gemessen). Ergaenzt: das Untermenue schliesst, wenn der Fokus es verlaesst                               | erledigt                   |
| `A11Y-07`     | 4 unbenannte `svg` im Sprachumschalter aus dem Tree nehmen                                                                                                                                                                   | PT24.5                     |
| `A11Y-08`     | Einstufung der 6 leer-`alt`-Bilder bestaetigen                                                                                                                                                                               | PT24.5                     |
| `A11Y-09`     | `white/50`, `white/60` auf Navy messen                                                                                                                                                                                       | PT24.4                     |
| ~~`A11Y-10`~~ | **Erledigt/erledigt befunden PT24.6**: reproduziert nicht mehr — Legal-Seiten sind unter WCAG UND `best-practice` sauber                                                                                                     | erledigt                   |
| ~~`A11Y-11`~~ | **Erledigt PT24.6**: `globalIgnores` in `eslint.config.js`. `npm run lint` faellt von 117 auf 6 Probleme, 0 davon `jsx-a11y`. Keine Regel abgeschaltet — nur der Geltungsbereich auf ausgelieferten Code eingegrenzt         | erledigt                   |
| ~~`A11Y-12`~~ | **Checkliste erstellt PT24.6** (§14). Die AUSFUEHRUNG ist `NOT_RUN_ENVIRONMENT` — kein Screenreader auf dieser Maschine                                                                                                      | AP24-CLOSURE / Betreiberin |
| ~~`A11Y-21`~~ | **Erledigt PT24.6**: die wirkungslose `reducedMotion`-Option ist aus allen sechs Konfigurationen entfernt und durch einen Hinweis ersetzt                                                                                    | erledigt                   |
| `A11Y-22`     | Erfolgs- und Wiederholungszustand der Formulare sind NICHT im axe-Lauf — beide brauchen ein antwortendes Backend, das hier nicht laeuft                                                                                      | AP24-CLOSURE               |
| `A11Y-23`     | **Manuelle Screenreader-Pruefung nach §14** — 12 Punkte, Umgebung mit NVDA/Chromium oder VoiceOver/Safari noetig                                                                                                             | AP24-CLOSURE / Betreiberin |

---

## 12. Uebergaben an AP25 und AP27

### 12.1 AP25 (Performance) — was aus AP24 mitkommt

AP24 hat **nichts** an Performance optimiert; das bleibt vollstaendig AP25.
Drei Dinge sind aber jetzt Randbedingungen, die AP25 kennen muss:

1. **Der Kopfzeilen-Schleier** (`bg-brand-deep/75 backdrop-blur-sm`) bringt ein
   `backdrop-filter` in den unverscrollten Zustand jeder Seite. Das war vorher
   nur im gescrollten Zustand da. `backdrop-filter` ist ein bekannter Kostenpunkt
   beim Compositing — **messen, nicht raten**, und falls es teuer ist: die
   Deckkraft erhoehen und den Filter weglassen, NICHT den Schleier entfernen.
   Der Schleier ist die Lesbarkeit der Hauptnavigation.
2. **Das Fokus-Sicherheitsnetz** in `@layer base` trifft ueber `:where()` jedes
   Bedienelement. Spezifitaet null, nur im `:focus-visible`-Zustand — der
   Selektor ist breit, die Wirkung schmal.
3. **`prefers-reduced-motion` ist vollstaendig verdrahtet** und gemessen: 87
   bzw. 145 bzw. 104 animierte Elemente werden zu 0. AP25 darf Animationen
   zusammenstreichen, muss diesen Block aber erhalten.

**Nicht vorgezogen:** `D-20` (horizontaler Ueberlauf bei 1024 px) bleibt
AP24/AP25 gemeinsam; AP24 hat ihn nicht angefasst.

### 12.2 AP27 (Visual Regression) — was sich SICHTBAR geaendert hat

Referenzbilder dieser Flaechen sind neu aufzunehmen:

| Aenderung                                                    | Wo                                   | Wirkung                                                                                                    |
| ------------------------------------------------------------ | ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Kopfzeilen-Schleier**                                      | jede Seite im unverscrollten Zustand | die deutlichste Aenderung des Pakets: die Kopfzeile ist oben nicht mehr durchsichtig                       |
| `gray-500` von `#868C98` auf `#6b7280`                       | **47 Aufrufstellen**                 | Hilfstexte, Bildunterschriften, Mikrocopy sind dunkler                                                     |
| `border-ui-field` statt `border-gray-300`/`border-slate-300` | **17 Bedienelemente**                | Eingabefelder, Auswahlfelder, Kontrollkaestchen und umrandete Knoepfe haben einen deutlich sichtbaren Rand |
| `text-accent-strong` statt `text-accent`                     | 8 Textstellen                        | Handlungslinks etwas dunkler                                                                               |
| `text-accent-on-dark` statt `text-accent-strong` auf Navy    | 1 Eyebrow                            | deutlich heller auf dunkler Flaeche                                                                        |
| `text-gray-600` statt `text-gray-500`                        | 3 Stellen auf getoenten Flaechen     | dunkler                                                                                                    |
| `text-white/70` statt `/50` bzw. `/60`                       | 3 Stellen                            | heller auf Navy                                                                                            |
| Fusszeilen-Ueberschriften `h2` statt `h3`                    | Fusszeile                            | **keine** optische Wirkung (Klasse traegt die Darstellung)                                                 |
| Fokus-Sicherheitsnetz                                        | Bedienelemente ohne eigenen Ring     | zwei Ringe (weiss innen, navy aussen) statt Browserstandard                                                |
| `px-1` am Kapitelstreifen                                    | Musterbefund                         | 4px Polsterung                                                                                             |
| Blog-Kachelbild ohne `alt`                                   | Startseite, Artikelliste             | **keine** optische Wirkung                                                                                 |

**AP27 braucht ausserdem:** die sechs AP24-Testreihen laufen gegen den
Dev-SSR-Server. Wer sie in eine CI haengt, braucht denselben Aufbau —
`POLARIS_VITE_CACHE_DIR` und `NODE_ENV=development`, beides in den
Konfigurationen begruendet.

---

## 13. Aenderungsprotokoll

### PT24.1 — Semantik (2026-09-11)

Siehe AP-STATE, Eintrag „PT24.1". 40 geaenderte, 3 neue Dateien.

### PT24.2 — Tastatur (2026-09-11)

Siehe AP-STATE, Eintrag „PT24.2". 7 geaenderte, 4 neue Dateien.

### PT24.3 — Fokus (2026-09-11)

Siehe AP-STATE, Eintrag „PT24.3". 8 geaenderte, 3 neue Dateien.

### PT24.4 — Kontrast (2026-09-11)

Siehe AP-STATE, Eintrag „PT24.4". 13 geaenderte, 2 neue Dateien.

### PT24.5 — Medien (2026-09-11)

Siehe AP-STATE, Eintrag „PT24.5". 6 geaenderte, 2 neue Dateien.

### PT24.6 — Automatisierte Checks (2026-09-11)

Siehe AP-STATE, Eintrag „PT24.6". 15 geaenderte, 2 neue Dateien.

---

## 14. Manuelle Screenreader-Checkliste

**Status: `NOT_RUN_ENVIRONMENT`.**

Auf dieser Maschine laeuft **kein Screenreader**: Debian 12 ohne
Grafiksitzung (`DISPLAY` und `WAYLAND_DISPLAY` nicht gesetzt), kein `orca`,
kein AT-SPI-Bus. Ein Ergebnis zu behaupten waere erfunden. Die Liste unten ist
so geschrieben, dass eine Betreiberin sie in einer echten Umgebung Punkt fuer
Punkt abarbeiten kann.

**Was STATTDESSEN maschinell belegt ist:** der Accessibility-Tree, den eine
Assistenztechnik liest, wurde fuer die zwoelf Punkte aufgenommen (§14.2). Das
ist **kein Screenreader-Test** — es zeigt, was die Technik vorfindet, nicht wie
sie es vorliest. Ansageverhalten, Lesereihenfolge im Browse-Modus, Umgang mit
Live-Regionen und Tastenkuerzel der jeweiligen Software bleiben offen.

### 14.1 Die zwoelf Punkte

Umgebung eintragen: Screenreader + Version, Browser + Version, Betriebssystem,
Datum, Pruefende.

| #   | Punkt                        | Route / Zustand                                                        | Erwartung                                                                                                                                                                                              |
| --- | ---------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Titel und Start              | `/de/` frisch laden                                                    | Der Seitentitel wird angesagt („Point-of-Care-Diagnostik für Praxen \| PolarisDX"). Erstes Element im Tab-Lauf ist „Zum Inhalt springen".                                                              |
| 2   | Landmarks                    | `/de/`                                                                 | Die Landmark-Liste enthaelt genau ein `main`, ein `banner`, ein `contentinfo` und benannte `navigation`-Bereiche. Keine namenlose Navigation.                                                          |
| 3   | Ueberschriften               | `/de/`, `/de/epigenetics`                                              | Die Ueberschriftenliste beginnt mit genau einer `h1` und springt keine Ebene.                                                                                                                          |
| 4   | Navigation                   | `/de/`, Mega-Menue und mobiles Menue                                   | Der Aufklapper meldet seinen Zustand. Nach `Escape` steht der Fokus wieder auf dem Ausloeser. Das mobile Menue faengt den Fokus NICHT ein.                                                             |
| 5   | Suche                        | `/de/`, Suche oeffnen, „epigenetik" eingeben                           | Beim Oeffnen landet der Fokus im Eingabefeld. Die Trefferzahl wird als Statusmeldung angesagt („5 Ergebnisse"). `Escape` schliesst, der Fokus kehrt auf den Suchknopf zurueck.                         |
| 6   | Formularbeschriftungen       | `/de/contact`                                                          | Jedes Feld wird mit seiner sichtbaren Beschriftung angesagt; Pflichtfelder als solche.                                                                                                                 |
| 7   | Fehler im Formular           | `/de/contact`, leer absenden                                           | Die Fehlermeldungen werden angesagt, sobald sie erscheinen, und sind beim Anspringen des Feldes erneut hoerbar.                                                                                        |
| 8   | Statusmeldungen              | `/de/support`, Datei waehlen · Routenwechsel ueber die Hauptnavigation | Der Dateiname wird angesagt. Nach einem Seitenwechsel wird der neue Seitentitel hoeflich angesagt, ohne dass der Fokus wegspringt.                                                                     |
| 9   | Einwilligung                 | `/de/` im frischen Profil                                              | Der Bereich ist als „Wir respektieren Ihre Privatsphäre" auffindbar. Alle drei Knoepfe sind erreichbar und ausloesbar. Die Seite bleibt waehrenddessen bedienbar (der Banner ist bewusst NICHT modal). |
| 10  | Bestell-Modal                | `/de/consumer/vitamin-d3-spray`, Bestellen                             | Der Dialog wird mit seinem Titel angesagt. Der Fokus bleibt im Dialog. `Escape` schliesst; der Fokus kehrt auf den ausloesenden Knopf zurueck.                                                         |
| 11  | Resource Gate                | `/de/epigenetics/unterlagen`, Anfordern                                | Der Aufklapper meldet seinen Zustand; das Formular ist unmittelbar danach erreichbar. Nach „Abbrechen" steht der Fokus wieder auf dem Ausloeser.                                                       |
| 12  | Kapitel- und Hash-Navigation | `/de/epigenetics/musterbefund/metabolic-health`                        | Ein Kapitellink springt zum Abschnitt, der Fokus folgt, und das Vorlesen setzt IM Zielabschnitt fort — nicht wieder am Seitenanfang.                                                                   |

**Bei jedem Punkt zu notieren:** PASS / FAIL / N/A, die verwendete Software und
im Fehlerfall der genaue Wortlaut der Ansage. Kein Punkt darf mit „sieht gut
aus" quittiert werden.

**Empfohlene Umgebungen:** NVDA (aktuell) mit Chromium und mit Firefox unter
Windows; VoiceOver mit Safari unter macOS. Mindestens **eine** Kombination
vollstaendig.

### 14.2 Maschinell aufgenommener Accessibility-Tree (Beleg, kein Ersatz)

Aufgenommen mit Playwright `ariaSnapshot()` gegen den Dev-SSR-Server,
2026-09-11. Auszuege:

```
## Landmarks (/de/)
- link "Zum Inhalt springen": /url: "#main-content"
- banner:
  - link "PolarisDX — POC-Diagnostik für Arztpraxen"
  - navigation "Hauptnavigation": link "Diagnostik" · button "Diagnostik — Untermenü" · …

## Suche mit Treffern
- dialog "Website durchsuchen":
  - heading "Website durchsuchen" [level=2]
  - button "Suche schließen"
  - searchbox "Suchbegriff": epigenetik
  - status: 5 Ergebnisse
  - region "Seiten": heading "Seiten" [level=3] → list → listitem → link …

## Kontaktformular im Fehlerzustand
- group "Worum geht es?": button "Beratung" [pressed] · button "Angebot" · …
- textbox "Ihr Name"
- alert: Bitte geben Sie Ihren Namen an — mindestens zwei Zeichen.
- textbox "E-Mail"
- alert: Bitte geben Sie eine gültige E-Mail-Adresse an, zum Beispiel name@praxis.de.

## Einwilligungsbanner
- region "Wir respektieren Ihre Privatsphäre":
  - heading "Wir respektieren Ihre Privatsphäre" [level=3]
  - button "Nur notwendige" · button "Alle akzeptieren" · button "Einstellungen"

## Bestell-Modal
- dialog "Vitamin D3+K2 Spray · 12er-Pack":
  - heading "Vitamin D3+K2 Spray · 12er-Pack" [level=2]
  - button "Bestellanfrage schließen"
  - textbox "Kontaktname*" · textbox "E-Mail*" · …

## Resource Gate
- button "Alle sechs als ZIP · 4,2 MB — Nach Anmeldung" [expanded]
- heading "Unterlage anfordern" [level=3]
- textbox "Name" · textbox "E-Mail" · textbox "Einrichtung"
- checkbox "Ich willige ein, dass meine Angaben zur Bearbeitung dieser Anfrage verarbeitet werden."
- button "Download anfordern" · button "Abbrechen"

## Kapitelnavigation
- navigation "Kapitel": link "So lesen Sie diesen Befund" → "#so-lesen" · …
```

Die Aufnahme zeigt: benannte Landmarks, `status` fuer die Trefferzahl, `alert`
fuer Feldfehler, benannte Dialoge, beschriftete Bedienelemente und
`[pressed]`/`[expanded]`-Zustaende. Was sie NICHT zeigt, steht oben.

---

## 15. Closure-Evidenz (AP24-CLOSURE, 2026-09-11)

**Die Closure hat keinen PT-PASS uebernommen.** Alles unten ist neu gemessen —
und zwar gegen einen **frisch gebauten Produktionsbuild** (Client + SSR,
`vite build` in `node_modules/.cache/ap24clo/`, ausgeliefert von `server.ts` mit
`NODE_ENV=production`). Die sechs PT-Reihen liefen bis dahin ausschliesslich
gegen den Dev-SSR-Server; die Closure prueft damit erstmals das, was wirklich
ausgeliefert wird.

### 15.1 Die sechs Reihen gegen den Produktionsbuild

| Reihe             | Umfang  | Ergebnis    |
| ----------------- | ------- | ----------- |
| `pt24.1` Semantik | 118     | **118/118** |
| `pt24.2` Tastatur | 41      | **41/41**   |
| `pt24.3` Fokus    | 31      | **31/31**   |
| `pt24.4` Kontrast | 20      | **20/20**   |
| `pt24.5` Medien   | 45      | **45/45**   |
| `pt24.6` axe-Gate | 25      | **25/25**   |
| **Summe**         | **280** | **280/280** |

### 15.2 Eigene, unabhaengige Messungen der Closure

Nicht die PT-Tests, sondern eigener Messcode gegen denselben Produktionsbuild.

**axe-core, 44 oeffentliche Routen, WCAG 2.0/2.1/2.2 A+AA:** **0 Verletzungen.**

**Strukturmessung, 27 Routen:**

| Pruefung                                                     | Ergebnis      |
| ------------------------------------------------------------ | ------------- |
| genau ein `main` / `banner` / `contentinfo` / `h1`           | **27/27** je  |
| namenlose Navigationen · Heading-Spruenge · leere Headings   | **0 · 0 · 0** |
| redundante Rollen · Listen mit Fremdkindern · Layouttabellen | **0 · 0 · 0** |
| Tabellen ohne `scope` · ohne Namen                           | **0 · 0**     |
| Click-Divs · Pseudo-Buttons · namenlose Bedienelemente       | **0 · 0 · 0** |
| Felder ohne Label · Placeholder als einziges Label           | **0 · 0**     |
| Bilder ohne `alt` · namenlose `svg` im Tree                  | **0 · 0**     |
| tote `aria`-Verweise · doppelte Ids · positives `tabindex`   | **0 · 0 · 0** |
| belegte `role="alert"` beim Laden                            | **0**         |

**Fokus- und Tastaturmessung, acht Flaechen** (Desktop, Mobil 390px, Tablet
834px, Deutsch/Polnisch/Franzoesisch), je 20–30 Tabschritte:

| Pruefung                                             | Ergebnis                      |
| ---------------------------------------------------- | ----------------------------- |
| Tabziele ohne sichtbaren Fokus                       | **0**                         |
| Fokusmarkierung unter 3:1                            | **0**                         |
| fokussiertes Element verdeckt                        | **0**                         |
| laengste Wiederholung desselben Knotens (Fallenmass) | **1** auf allen acht Flaechen |

**Bewegung, vier Routen, mit `page.emulateMedia`:** 87 / 145 / 114 / 104
animierte Elemente **ohne** Praeferenz → **0** mit `reduce`; sanftes Scrollen
aus; **0** unsichtbarer Inhalt.

**Medien, acht Routen:** 28 Bilder, **0 ohne `alt`**, 16 bewusst dekorativ,
**0** namenlose Grafiken im Tree, **0** Icon-Bedienelemente ohne Namen, **0**
Video/Audio/Autoplay/Marquee/Karussell.

**x10 strukturell, alle zehn Sprachen** (10 Startseiten + 4
Kontaktformulare): genau ein `main` und eine `h1` auf **14/14**, alle
Strukturzaehler **0**.

### 15.3 Zwei Befunde der eigenen Messung — beide geprueft, beide keine Defekte

Ehrlichkeit gehoert in beide Richtungen: die Closure-Heuristik hat zwei
`figure`-Elemente gemeldet, und beide sind **Fehlalarme meines Messcodes**,
nicht Maengel der Anwendung:

1. `/de/articles/die-gruene-praxis` — eine `figure` ohne Text. Sie enthaelt das
   Artikel-Leitbild mit bewusst leerem `alt` (in PT24.5 geprueft und
   dokumentiert). Meine Heuristik behandelt jede `figure` wie ein Diagramm.
2. `/de/` — eine `figure` ohne Ziffer. Es ist der Kundenstimmen-Block: Portraet
   mit Zitat und Namen. Reichlich Text, nur keine Zahl.

### 15.4 Bekannte, nicht behobene Punkte

| Punkt                                                                              | Bewertung                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `landmark-complementary-is-top-level` auf `/de/diagnostics`                        | `best-practice`, **kein** WCAG-Kriterium. Bewusst belassen (§10.4).                                                                                                                                                                                                                                                                                                                   |
| `e2e/navigation.spec.ts` ist gegen einen Produktionsbuild gelegentlich flatterhaft | Der Test greift unmittelbar nach `page.goto()` zu, ohne auf die Hydration zu warten. In drei vollen Laeufen einmal rot; der Einzeltest 5/5 gruen, und das Verhalten ist direkt nachgemessen korrekt (Menue oeffnet, `aria-expanded="true"`, ein sichtbarer Epigenetik-Eintrag). **Zeitproblem des Tests, kein Produktfehler.** Der Spec gehoert AP06, nicht AP24 → Uebergabe an AP27. |
| `consent-basic-remediation` „explicit grant"                                       | Braucht einen ECHTEN GTM-Container fuer die `collect`-Stufe. Seit AP23 dokumentiert.                                                                                                                                                                                                                                                                                                  |
| Erfolgs-/Wiederholungszustand der Formulare nicht im axe-Lauf                      | Braucht ein antwortendes Backend (`A11Y-22`).                                                                                                                                                                                                                                                                                                                                         |
| Manuelle Screenreader-Pruefung                                                     | **`NOT_RUN_ENVIRONMENT`** (§14, `A11Y-23`).                                                                                                                                                                                                                                                                                                                                           |

### 15.5 Produktionsqualitaet

`tsc -b` clean · `eslint .` 6 vorbestehende Probleme, **0 `jsx-a11y`** ·
Unit-/Server-Suiten **614/614** · Farb-Guard, G4 i18n, G1 Routen, Shell-i18n,
Design-System-Changelog, Meta-Quality und G3 SEO **alle PASS** · Prettier
sauber · Produktionsbuild Client **und** SSR erfolgreich.

### 15.6 Was diese Closure NICHT behauptet

Sie behauptet **keine** WCAG-Zertifizierung, keine externe Konformitaetspruefung
und keine rechtliche Garantie. `axe` deckt automatisiert einen Teil der
Erfolgskriterien ab; **280 gruene Zusicherungen und 0 axe-Verletzungen heissen
„keine der geprueften Regeln verletzt"**, nicht „barrierefrei". Die manuelle
Screenreader-Pruefung steht aus und ist als solche ausgewiesen.
