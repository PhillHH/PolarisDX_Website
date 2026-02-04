## `src/data/` – Datenquellen (Content Layer)

Dieses Verzeichnis enthält alle **statischen Daten**, die von den React‑Komponenten gerendert werden.  
Die Idee ist, Inhalte (Produkte, Artikel, Testimonials, Services, Social Links) **zentral** und strukturiert abzulegen, damit UI‑Komponenten möglichst „dumm“ bleiben und nur darstellen.

---

### `products.ts`

- Definiert:
  - `TechSpec` – technischer Parameter mit `parameter` und `specification`.
  - `Product` – Produkttyp mit:
    - `id`, `slug`, `name`, `category`, `price`,
    - `shortDescription`, optional `detailedDescription: string[]`,
    - `features: string[]`,
    - optional `techSpecs`, `deliveryScope`, `note`, `badge`, `image`.
- `products: Product[]`:
  - Enthält reale/beispielhafte medizinische Produkte und Services,
  - u. a. „Igloo Reader Pro“ mit ausführlichen technischen Daten und Lieferumfang.
- `getProductBySlug(slug: string)`:
  - Helferfunktion, um ein Produkt anhand des URL‑Slugs zu finden (wird in `ProductPage` genutzt).

Verwendung:

- `ShopPage` rendert eine Übersicht aller Produkte.
- `ProductPage` zeigt Details eines Produkts.
- `HomePage` nutzt einen Ausschnitt (`products.slice(0, 3)`) als Shop‑Teaser.

---

### `articles.ts`

- Definiert:
  - `ArticleSection` – Abschnitt mit optionaler `heading`, Pflichtfeld `paragraphs` und optional `listItems` und `image`.
  - `Article` – vollständiger Artikel mit:
    - `id`, `slug`, `title`, `category`, `excerpt`,
    - `author`, `date`, `readTime`,
    - `sections: ArticleSection[]`.
- `articles: Article[]`:
  - Mehrere Fach- und Marketing‑Artikel, v. a. rund um:
    - Point‑of‑Care‑Diagnostik,
    - Validierung von Lateral‑Flow‑Tests,
    - 48‑Stunden‑Remote‑Setup,
    - Präzision und Patientensicherheit.
  - Einige allgemeinere Gesundheitsartikel (englisch) ergänzen das Content‑Spektrum.
- `getArticleBySlug(slug: string)`:
  - Liefert einen Artikel für die Detailseite (`ArticlePage`).

Verwendung:

- `ArticlePage` liest Artikel anhand des Slugs.
- `blogPosts.ts` generiert daraus Blog‑Teaser.

---

### `blogPosts.ts`

- Typ `BlogPost` mit `id`, `title`, `excerpt`, `slug`, optional `image`.
- `blogPosts` wird **automatisch** aus `articles` generiert:
  - `id`, `title`, `excerpt`, `slug` werden übernommen,
  - `image` kommt i. d. R. aus der ersten Section des Artikels, falls vorhanden.

Verwendung:

- `BlogSection` nutzt `blogPosts` für die Anzeige der Artikel‑Teaser.

---

### `services.ts`

- `Service`‑Typ mit `id`, `title`, `description`.
- `services: Service[]`:
  - Beschreibt diagnostische Schwerpunkte bzw. Leistungsbereiche:
    - POC‑Systemlösungen, Präventions‑Checks, Infektions‑/Entzündungsmarker,
    - Stoffwechsel & Herzgesundheit, Hormon‑Tests, Kompatibilitäts‑Services.

Verwendung:

- `ServicesSection` rendert diese Daten als `ServiceCard`‑Raster.

---

### `testimonials.ts`

- `Testimonial`‑Interface:
  - `role`, `name`, `title`, `focus`, `text`, optional `avatar`.
- `testimonials: Testimonial[]`:
  - Enthält echte/anmutende Kundenstimmen (Zahnarzt, Apotheke, Praxis, Klinik),
  - hebt konkrete Nutzungsszenarien und Mehrwerte des Igloo Pro hervor.

Verwendung:

- `TestimonialsSection` implementiert einen Slider über `testimonials`.

---

### `social.tsx`

- `SocialLink`‑Typ:
  - `label`, `href`, `icon: ReactNode`.
- `socialLinks: SocialLink[]`:
  - Platzhalter‑Social‑Links (LinkedIn, Twitter, Instagram, Facebook)
  - mit Text‑Icons (z. B. `in`, `tw`).

Verwendung:

- `Footer` zeigt diese Links als runde Social‑Buttons an.

---

### `democontent/`

- Enthält beispielhafte Dateien (`.docx`, `.csv`, `.xlsx`), u. a.:
  - Demo‑Artikel, Demo‑Rezensionen u. ä.
- Diese Dateien sind **nicht direkt** in den React‑Code eingebunden und dienen primär:
  - als Content‑Beispiele,
  - für spätere Erweiterungen (z. B. Import von externen Daten).

---

### Rolle im Gesamtkonzept

- Das Verzeichnis `src/data/` bildet den **Content‑Layer** der Anwendung:
  - UI‑Komponenten beziehen ihre Inhalte (Texte, Preise, Zitate, Bildpfade) hieraus.
  - Neue Inhalte werden primär durch Ergänzen/Ändern dieser Dateien hinzugefügt.
- Dadurch lassen sich:
  - Produktkatalog, Artikel‑Pool und Testimonials pflegen, ohne UI‑Code zu duplizieren,
  - Marketing‑/Fachinhalte relativ unabhängig vom Frontend‑Code weiterentwickeln.


