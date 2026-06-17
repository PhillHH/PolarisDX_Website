# PolarisDX / IglooPro — Wireframe-Set

Low-Fidelity-Wireframes (Graustufen) aller **18 Routen** der React-SPA, direkt aus
dem Repo-Quellcode extrahiert. Gedacht als Figma-Grundlage: Struktur, Hierarchie,
Sections und Content-Slots — bewusst ohne Farben/Bilder/finale Copy.

## Inhalt

| Datei                           | Route                       | Inhalt                                                                  |
| ------------------------------- | --------------------------- | ----------------------------------------------------------------------- |
| `index.html`                    | —                           | Übersicht / Galerie aller Wireframes                                    |
| `wireframe.css`                 | —                           | Gemeinsames Wireframe-Designsystem                                      |
| `chrome.js`                     | —                           | Injiziert identischen Header/Footer/CTA/Chat auf jeder Seite            |
| `home.html`                     | `/`                         | Startseite (Hero, About, IglooWidget, Doctors, Testimonials, Blog, FAQ) |
| `about.html`                    | `/about`                    | Über uns (TeamSection 4er-Grid, Partner, CTA)                           |
| `events.html`                   | `/events`                   | Events-Timeline (5 Events)                                              |
| `diagnostics.html`              | `/diagnostics`              | Diagnostik-Übersicht (ServicesSection, 9 Cards)                         |
| `service.html`                  | `/diagnostics/:slug`        | Service-Detail · Template (Content + Sticky-Sidebar)                    |
| `articles.html`                 | `/articles`                 | Magazin (Featured + 6er-Grid)                                           |
| `article.html`                  | `/articles/:slug`           | Artikel-Detail · Template (Content + Sticky-Sidebar)                    |
| `igloo-pro.html`                | `/igloo-pro`                | IglooPro System (Hero, Features, Specs, Parameter, CTA)                 |
| `vitamin-d3-implantologie.html` | `/vitamin-d3-implantologie` | Long-form + Bestellformular + Sidebar                                   |
| `s3-leitlinie.html`             | `/s3_leitlinie`             | Long-form Leitlinie (Tabellen, Callouts, Workflow)                      |
| `vitamin-d3-spray.html`         | `/vitamin-d3-spray`         | Produkt-Longform + Pricing + Bestellformular                            |
| `contact.html`                  | `/contact`                  | Kontaktformular + Sidebar (keine CTA-Karte)                             |
| `support.html`                  | `/support`                  | Support-Formular + Sidebar (keine CTA-Karte)                            |
| `downloads.html`                | `/downloads`                | Download-Gruppen                                                        |
| `imprint.html`                  | `/imprint`                  | Impressum (Legal-Prosa, 7 Abschnitte)                                   |
| `privacy.html`                  | `/privacy`                  | Datenschutz (Legal-Prosa, 5 Abschnitte)                                 |
| `terms.html`                    | `/terms`                    | AGB (25 §-Abschnitte + Sticky-TOC)                                      |
| `not-found.html`                | `*`                         | 404                                                                     |

## In Figma importieren (empfohlen: html.to.design)

`chrome.js` baut Header/Footer/CTA/Chat zur Laufzeit ein, damit die 18 Seiten
konsistent bleiben. Deshalb müssen die Dateien **geserved** werden (nicht per
`file://` öffnen), damit das Skript läuft und das Plugin das fertige DOM sieht.

1. Lokalen Server starten (Repo-Root):
   ```bash
   npx serve wireframes
   # oder:  python3 -m http.server 4000 --directory wireframes
   ```
2. In Figma das Plugin **html.to.design** öffnen → Tab **„URL"**.
3. Pro Seite die lokale URL importieren, z.&nbsp;B.
   `http://localhost:3000/home.html`, `…/igloo-pro.html` usw.
   (`index.html` zeigt alle Seiten samt Routen als Klickliste.)
4. Das Plugin legt jede Seite als editierbares Frame mit echten Layern an
   (Text bleibt Text, Boxen bleiben Vektoren).

### Alternative: ngrok / öffentliche URL

Falls das Plugin keinen `localhost` erreicht: `npx serve wireframes` +
`ngrok http 3000`, dann die ngrok-URL im Plugin nutzen.

### Alternative: ohne Server (HTML-Paste)

html.to.design hat auch einen **„Code"**-Tab. Da JS-Paste das Chrome nicht
ausführt, müsste Header/Footer dann manuell ergänzt werden — der URL-Weg ist
deutlich sauberer.

### Alternative: Builder.io

Funktioniert analog über die geservte URL (Builder „Import from URL").

## Designsystem / Konventionen

- **Graustufen-only.** Marken-Blau ist bewusst zu Neutralgrau abgeflacht.
- **Echte Überschriften & Labels** sind erhalten (als Figma-Content nutzbar);
  i18n-/dynamische Texte stehen als „Platzhalter".
- **Medien** = graue Box mit Diagonalkreuz + Label (`Bild`, `Foto`, `Produkt` …).
- **Fließtext** = graue Balken (`.wf-lines`), wenn die finale Copy noch offen ist.
- **`.wf-tag`** = gestricheltes Chip oben an jeder Section mit dem Section-Namen
  aus dem Code (z.&nbsp;B. „Section · TestimonialsSection") — erleichtert das
  Wiederfinden der Frames in Figma.
- **`.wf-frame-label`** = dunkle Kopfzeile pro Seite mit Titel + Route.
- **Dunkle Sections** (Hero, Testimonials-Band) sind als dunkelgraue Blöcke
  dargestellt, um den visuellen Kontrast der Live-Site anzudeuten.
- Container = 1200&nbsp;px (wie `max-w-container` im Tailwind-Setup).
- Responsives Stacking ab ≤960&nbsp;px ist enthalten, damit das erfasste DOM
  auch auf schmalen Boards lesbar bleibt.

## Bekannte Abstraktionen

- Slider/Karussells (Hero, Testimonials) sind als **eine** Slide + Dots
  dargestellt — kein Motion.
- Datengetriebene Listen mit i18n-Länge (Spray-FAQ/Benefits/Pricing) nutzen
  eine repräsentative Anzahl; der Hinweis steht jeweils als `.wf-muted`-Zeile.
- `service.html` / `article.html` sind **Templates** für die dynamischen
  Routen (eine repräsentative Instanz).
