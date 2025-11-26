## `src/routes/` – Seiten (Routen)

In diesem Verzeichnis liegen alle **Seiten-Komponenten**, die direkt an eine Route gebunden sind.  
Sie orchestrieren in der Regel mehrere Sections und UI‑Komponenten und binden Datenquellen aus `src/data/` ein.

---

### `HomePage.tsx`

- Startseite / Landingpage.
- Zusammensetzung:
  - `HeroSection` (Einstieg mit Claim und KPI‑Stats),
  - `AboutSection` (Erklärung des 48‑Stunden‑Setup‑Versprechens),
  - `ServicesSection` (diagnostische Schwerpunkte),
  - `DoctorsSection` (Vorstellung medizinischer Kompetenz, sofern eingebunden),
  - `TestimonialsSection` (Kundenstimmen),
  - `BlogSection` (Artikel‑Teaser),
  - Shop‑Teaser mit ausgewählten Produkten aus `data/products.ts`.

Ziel: **Schnelles Verständnis des Angebots** und Führen des Nutzers zu Shop, Artikeln oder Kontakt.

---

### `ShopPage.tsx`

- Listet alle Produkte aus `data/products.ts` als Raster von `ProductCard`‑Komponenten.
- Ein Hero‑Abschnitt erklärt kurz den MedHealth‑Shop.
- Jede Karte verlinkt auf die jeweilige Produktdetailseite (`/shop/:slug`).

---

### `ProductPage.tsx`

- Detaildarstellung eines Produkts basierend auf der URL (`:slug`).
- Verwendet `getProductBySlug` aus `data/products.ts`.
- Darstellung:
  - Produktname, Kategorie, Preis,
  - Bild (falls im Produkt hinterlegt),
  - ausführliche Beschreibung (`detailedDescription` oder `shortDescription`),
  - Features & Benefits,
  - Technische Spezifikationen (`techSpecs` als Tabelle),
  - Lieferumfang und Hinweis auf Demo‑Charakter des Shops.
- Sidebar mit:
  - Demo‑Bestellbox,
  - „You might also like“ – weitere Produkte als Empfehlungen.

---

### `ArticlePage.tsx`

- Detailseite für einen strukturierten Artikel aus `data/articles.ts`.
- Slug‑basiert (`/articles/:slug`), mit Fallback auf den ersten Artikel bei ungültigem Slug.
- Anzeige:
  - Hero mit Kategorie, Titel, Autor, Datum, Lesezeit,
  - optionales Titelbild aus der ersten Section,
  - inhaltliche Sections mit Überschriften, Absätzen und Aufzählungen.
- Unterhalb bzw. seitlich:
  - „Suggested articles“ / „More articles“ als Navigation zu weiteren Inhalten.

Ziel: **fachliche Tiefenkommunikation** rund um Point‑of‑Care‑Diagnostik und Igloo Pro.

---

### `ContactPage.tsx`

- Seite zur **Terminvereinbarung / Kontaktaufnahme**.
- Enthält:
  - Hero‑Bereich mit Titel „Make Appointment“,
  - Formular mit Auswahlfeldern (Fachrichtung, Arzt), Datum/Zeit, Personendaten, Nachricht,
  - statische Kontaktinfos und eine abschließende CTA‑Box.
- Das Formular ist aktuell eine **statische UI** ohne Backend‑Anbindung.

---

### Architekturgedanke

- Jede Route ist bewusst **schlank** gehalten:
  - Die Darstellung passiert überwiegend in Sections und UI‑Komponenten.
  - Daten kommen aus `src/data/`.
- Dadurch ist das Hinzufügen neuer Seiten (z. B. eine dedizierte Produkt‑Landingpage) einfach:
  - neue Datei in `routes/`,
  - Route in `App.tsx` ergänzen,
  - ggf. neue Sections/Komponenten nutzen oder hinzufügen.


