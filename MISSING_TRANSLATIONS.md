# Fehlende Übersetzungen - PolarisDX Website

**Datum:** 2026-02-19
**Referenzsprache:** DE (Deutsch)
**Unterstützte Sprachen:** DE, EN, PL, FR, IT, ES, PT, DA, NL, CS (10 Sprachen)
**Namespaces:** common, home, about, articles, contact, services, events, downloads, legal, products, shop, casestudies (12 Namespaces)

---

## Zusammenfassung

| Kategorie | Anzahl |
|---|---|
| Fehlende Keys (gesamt) | **792** |
| Komplett fehlende Dateien | **8** (casestudies.json in 8 Sprachen) |
| Datei mit BOM-Encoding-Problem | **1** (de/services.json) |

### Übersicht nach Namespace

| Namespace | EN | PL | FR | IT | ES | PT | DA | NL | CS |
|---|---|---|---|---|---|---|---|---|---|
| common | OK | -24 | -24 | -24 | -24 | -24 | -24 | -24 | -24 |
| home | -5 | -9 | -9 | -9 | -9 | -9 | -9 | -9 | -9 |
| about | OK | OK | OK | OK | OK | OK | OK | OK | OK |
| articles | OK | OK | OK | OK | OK | OK | OK | OK | OK |
| contact | OK | OK | OK | OK | OK | OK | OK | OK | OK |
| services | -28 | -28 | -28 | -28 | -28 | -28 | -28 | -28 | -28 |
| events | OK | -2 | -2 | -2 | -2 | -2 | -2 | -2 | -2 |
| downloads | OK | OK | OK | OK | OK | OK | OK | OK | OK |
| legal | OK | OK | OK | OK | OK | OK | OK | OK | OK |
| products | OK | OK | OK | OK | OK | OK | OK | OK | OK |
| shop | OK | OK | OK | OK | OK | OK | OK | OK | OK |
| casestudies | OK | FEHLT | FEHLT | FEHLT | FEHLT | FEHLT | FEHLT | FEHLT | FEHLT |

---

## 1. Encoding-Problem

### `de/services.json` - UTF-8 BOM

Die Datei `public/locales/de/services.json` enthält einen UTF-8 Byte Order Mark (BOM: `EF BB BF`), der zu JSON-Parsing-Fehlern führen kann. Die Datei muss ohne BOM neu gespeichert werden.

---

## 2. Fehlende Dateien

### `casestudies.json` - fehlt in 8 Sprachen

Die Datei `casestudies.json` existiert nur für **DE** und **EN**, fehlt aber komplett für:
**PL, FR, IT, ES, PT, DA, NL, CS**

Fehlende Keys (24 pro Sprache):
- `reasons32.title`, `reasons32.subtitle`
- `reasons32.intro.title`, `reasons32.intro.text`
- `reasons32.philosophy.title`, `reasons32.philosophy.points`
- `reasons32.role.title`, `reasons32.role.text`, `reasons32.role.points`
- `reasons32.quote`
- `reasons32.about.title`, `reasons32.about.location_label`, `reasons32.about.location`
- `reasons32.about.award_label`, `reasons32.about.award`
- `reasons32.about.focus_label`, `reasons32.about.focus`
- `reasons32.about.web_label`
- `reasons32.cta.title`, `reasons32.cta.button`
- `teaser.title`, `teaser.subtitle`, `teaser.text`, `teaser.cta`

---

## 3. Fehlende Keys nach Namespace

### 3.1 `common.json` - 24 fehlende Keys in 8 Sprachen

Betrifft: **PL, FR, IT, ES, PT, DA, NL, CS** (identische Lücken)

**Navigation (6 Keys):**
- `nav.casestudies`
- `nav.downloads`
- `nav.dental`
- `nav.beauty`
- `nav.longevity`
- `nav.pocSystems`

**Footer (5 Keys):**
- `footer.diagnostics`
- `footer.allServices`
- `footer.pocSystems`
- `footer.preventionChecks`
- `footer.hormonTests`

**Suche (1 Key):**
- `search.keywords.casestudies`

**Cookie-Banner (1 Key):**
- `cookie.reject_all`

**404-Seite (11 Keys):**
- `notFound.seo.title`
- `notFound.seo.description`
- `notFound.badge`
- `notFound.title`
- `notFound.description`
- `notFound.backHome`
- `notFound.popularPages`
- `notFound.links.home`
- `notFound.links.iglooPro`
- `notFound.links.services`
- `notFound.links.contact`

### 3.2 `home.json` - fehlende Keys

**Alle 9 Sprachen (PL, FR, IT, ES, PT, DA, NL, CS + EN teilweise):**

| Key | EN | PL-CS |
|---|---|---|
| `seo.title` | FEHLT | FEHLT |
| `seo.description` | FEHLT | FEHLT |
| `faq.caption` | FEHLT | FEHLT |
| `faq.title` | FEHLT | FEHLT |
| `faq.items` | FEHLT | FEHLT |
| `testimonials.kristian_grimm.role` | OK | FEHLT |
| `testimonials.kristian_grimm.title` | OK | FEHLT |
| `testimonials.kristian_grimm.focus` | OK | FEHLT |
| `testimonials.kristian_grimm.text` | OK | FEHLT |

### 3.3 `services.json` - 28 fehlende FAQ-Keys in allen 9 Sprachen

Betrifft: **EN, PL, FR, IT, ES, PT, DA, NL, CS** (identische Lücken)

Alle FAQ-Sektionen fehlen für jede Service-Kategorie (je 3 Keys: `caption`, `title`, `items`):

| Service-Kategorie | Fehlende Keys |
|---|---|
| `dental.faq` | caption, title, items |
| `beauty.faq` | caption, title, items |
| `longevity.faq` | caption, title, items |
| `poc_systemloesungen.faq` | caption, title, items |
| `praeventions_checks.faq` | caption, title, items |
| `infektion_entzuendung.faq` | caption, title, items |
| `stoffwechsel_herz.faq` | caption, title, items |
| `hormon_tests.faq` | caption, title, items |
| `kompatibilitaet_integration.faq` | caption, title, items |

Zusätzlich fehlt in allen 9 Sprachen:
- `dental.richContent`

### 3.4 `events.json` - 2 fehlende Keys in 8 Sprachen

Betrifft: **PL, FR, IT, ES, PT, DA, NL, CS**

- `location_label`
- `date_label`

---

## 4. Strukturelle Abweichungen (Zusätzliche Keys)

Diese Keys existieren in anderen Sprachen, aber **nicht in der DE-Referenz**:

### 4.1 `home.json` - 11 zusätzliche Keys in PL-CS

Betrifft: **PL, FR, IT, ES, PT, DA, NL, CS**

- `igloo_widget.dental`, `igloo_widget.beauty`, `igloo_widget.longevity`
- `testimonials.eva_schmidt.role/title/focus/text` (4 Keys)
- `testimonials.julia_bergmann.role/title/focus/text` (4 Keys)

> Diese Testimonials existieren in den Übersetzungen, aber nicht mehr in DE. Entweder muss DE ergänzt oder diese Keys aus den Übersetzungen entfernt werden.

### 4.2 `articles.json` - 3 zusätzliche Keys in allen 9 Sprachen

- `48_hour_formula.title`
- `48_hour_formula.excerpt`
- `48_hour_formula.sections`

> Artikel-Keys, die in allen Übersetzungen vorhanden sind, aber nicht in DE.

### 4.3 `events.json` - `location` Key

In PL, FR, IT, ES, DA, NL, CS existiert ein `location` Key, der in DE nicht vorhanden ist (DE verwendet stattdessen `location_label`).

### 4.4 `services.json` - 4 zusätzliche Keys in allen 9 Sprachen

- `dental.intro`
- `dental.sections`
- `dental.conclusion.heading`
- `dental.conclusion.text`

> Diese Keys verwenden eine andere Struktur als DE (das `dental.richContent` nutzt).

---

## 5. Prioritäten-Empfehlung

### Hohe Priorität
1. **BOM aus `de/services.json` entfernen** - Verhindert korrektes Laden der deutschen Service-Seiten
2. **`common.json` auffüllen** (8 Sprachen x 24 Keys) - Betrifft Navigation, Footer und 404-Seite auf allen Seiten
3. **`services.json` FAQ-Keys** (9 Sprachen x 28 Keys) - FAQ-Sektionen auf allen Service-Seiten

### Mittlere Priorität
4. **`home.json` SEO + FAQ** (9 Sprachen x 5-9 Keys) - SEO-Metadaten und FAQ auf der Startseite
5. **`casestudies.json`** (8 Sprachen x 24 Keys) - Komplette Case-Studies-Seite

### Niedrige Priorität
6. **`events.json`** (8 Sprachen x 2 Keys) - Labels auf der Events-Seite
7. **Strukturelle Bereinigung** - Veraltete/überschüssige Keys in den Übersetzungen entfernen oder nach DE übernehmen
