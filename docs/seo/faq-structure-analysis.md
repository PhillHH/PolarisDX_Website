# FAQ-Struktur Analyse — Ist-Zustand & Empfehlungen

> **Ziel:** Grundlage für die Implementierung von FAQ-Sektionen pro Service-Seite mit FAQPage-Schema.
> **Datum:** 2026-02-09

---

## 1. Wie viele FAQs existieren aktuell und wo?

### Homepage (`/`)
- **4 FAQ-Items** in `public/locales/de/home.json` unter `faq.items[]`
- Themen: Was macht PolarisDX, Branchen-Relevanz, Zusammenarbeit, Produkte/Lösungen
- Rendering durch `FAQSection` Komponente
- FAQPage-Schema wird korrekt generiert und in `<SEOHead>` eingebunden

### Vitamin-D3-Implantologie Artikel (`/vitamin-d3-implantologie`)
- **5 FAQ-Items** — aber **hardcoded** direkt in `src/pages/VitaminD3ImplantologyPage.tsx:30-86`
- Nicht in i18n-Dateien, nicht übersetzbar
- Eigenes FAQPage-Schema wird über `createFAQSchema()` generiert
- Kein Accordion-UI, sondern statische Darstellung (h3 + p)

### Service-Seiten (`/diagnostics/:slug`)
- **0 FAQs** — keine FAQ-Sektion vorhanden
- Kein FAQPage-Schema im structuredData-Array
- 9 Service-Seiten betroffen (dental, beauty, longevity, poc-systemloesungen, praeventions-checks, infektion-entzuendung, stoffwechsel-herz, hormon-tests, kompatibilitaet-integration)

### Zusammenfassung

| Seite | FAQ-Anzahl | Quelle | Schema | Übersetzbar |
|-------|-----------|--------|--------|-------------|
| Homepage | 4 | i18n (`home.json`) | Ja (FAQPage) | Ja |
| Vitamin-D3-Artikel | 5 | Hardcoded (TSX) | Ja (FAQPage) | Nein |
| Service-Seiten (x9) | 0 | — | Nein | — |

---

## 2. Wie sind FAQ-Texte strukturiert?

### i18n-basiert (Homepage)

Datei: `public/locales/de/home.json`

```json
"faq": {
  "caption": "FAQ",
  "title": "Häufige Fragen zu PolarisDX und Point-of-Care Diagnostik",
  "items": [
    {
      "question": "Was macht PolarisDX?",
      "answer": "PolarisDX ist Ihr Partner für..."
    }
  ],
  "more": "Noch Fragen?",
  "link_services": "Diagnostik-Services ansehen",
  "or": "oder",
  "link_contact": "direkt Kontakt aufnehmen"
}
```

- Key-Struktur: `faq.items[n].question` / `faq.items[n].answer`
- Zugriff via `t('faq.items', { returnObjects: true })`
- Typ: `FAQItem[] = { question: string, answer: string }`
- Übersetzung: **Nur in DE vorhanden** — `en/home.json` hat keinen `faq`-Block

### Hardcoded (Vitamin-D3 Artikel)

```tsx
const faqItems = [
  { question: "...", answer: "..." },
  // ...5 items
]
```

- Kein i18n, keine Übersetzbarkeit
- Direkt als TypeScript-Array in der Page-Komponente

### Service-Seiten (i18n-Dateien)

Die `services.json`-Dateien enthalten **keine FAQ-Keys**. Die aktuelle Struktur pro Service ist:
```
title, headline, intro[], sections[], conclusion{}, cta
```

---

## 3. Existiert ein FAQPage Schema Generator?

**Ja.** Vollständig implementiert in `src/components/seo/structuredData.ts:192-205`:

```typescript
export function createFAQSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
```

- Exportiert über `src/components/seo/index.ts`
- Interface `FAQItem { question: string; answer: string }` ebenfalls exportiert
- Bereits in Nutzung auf Homepage und Vitamin-D3-Artikel
- **Sofort wiederverwendbar** für Service-Seiten

---

## 4. Existiert eine wiederverwendbare FAQ-Komponente?

### `FAQSection` (`src/components/sections/FAQSection.tsx`)

**Aktuell Homepage-spezifisch** mit folgenden Einschränkungen:

| Aspekt | Ist-Zustand | Problem für Service-Seiten |
|--------|-------------|---------------------------|
| Translation Namespace | Hardcoded `'home'` | Kann nur `home.json` lesen |
| FAQ-Key-Pfad | Hardcoded `'faq.items'` | Nicht konfigurierbar |
| Section-Header | Hardcoded Caption/Title | Nicht pro Service anpassbar |
| Footer-Links | Hardcoded Links zu `/diagnostics` und `/contact` | Nicht kontextabhängig |
| Schema-Generation | **Nicht enthalten** — wird extern in `HomePage.tsx` gemacht | Doppelte Logik nötig |

### Wiederverwendbarkeitsbewertung: **Nicht direkt wiederverwendbar**

Die Komponente muss parametrisiert werden, um auf Service-Seiten nutzbar zu sein.

---

## 5. Wie sind FAQs aktuell an SEOHead/structuredData angebunden?

### Homepage-Flow

```
home.json → HomePage.tsx → createFAQSchema() → SEOHead.structuredData[]
                       ↓
              FAQSection (visuelle Darstellung)
```

1. `HomePage.tsx:31-37`: FAQ-Items werden aus i18n geladen
2. `createFAQSchema(faqItems)` erzeugt JSON-LD FAQPage-Objekt
3. Schema wird in `structuredData`-Array zusammen mit WebSite, MedicalBusiness, Product und Review-Schemas übergeben
4. `SEOHead` rendert das Array als `<script type="application/ld+json">`

### ServicePage-Flow (aktuell)

```
ServicePage.tsx → SEOHead.structuredData = [ServiceSchema, BreadcrumbSchema]
```

- **Kein FAQPage-Schema** — nur Service + Breadcrumb
- Kein FAQ-Rendering in der Seite

### Vitamin-D3-Artikel Flow

```
Hardcoded faqItems[] → createFAQSchema() → SEOHead.structuredData[]
                    ↓
          Inline-Rendering (nicht FAQSection-Komponente)
```

---

## 6. Empfehlung: Kann die bestehende Komponente wiederverwendet werden?

### Empfehlung: **Bestehende Komponente erweitern (nicht neu bauen)**

Die `FAQSection`-Komponente hat bereits gutes UI (Accordion mit Animation, Accessibility mit `aria-expanded`/`aria-controls`). Es braucht nur Parametrisierung:

### Vorgeschlagene Änderungen

#### A) FAQSection parametrisieren

```tsx
interface FAQSectionProps {
  namespace?: string          // i18n Namespace (default: 'home')
  faqKey?: string             // Key-Pfad für items (default: 'faq.items')
  caption?: string            // Override für Caption
  title?: string              // Override für Titel
  showFooter?: boolean        // Footer-Links anzeigen (default: true)
  items?: FAQItem[]           // Direkte Items (überspringt i18n)
}
```

#### B) FAQ-Texte in services.json ergänzen

Pro Service einen `faq`-Block in `public/locales/{lang}/services.json` hinzufügen:

```json
"dental": {
  "title": "Dental",
  "headline": "...",
  // ... bestehende Felder
  "faq": {
    "caption": "Häufige Fragen",
    "title": "FAQ zur Dental-Diagnostik mit dem IglooPro",
    "items": [
      {
        "question": "Welche Biomarker sind für die Zahnarztpraxis relevant?",
        "answer": "..."
      }
    ]
  }
}
```

#### C) ServicePage.tsx erweitern

1. FAQ-Items aus i18n laden: `t('services:{transKey}.faq.items', { returnObjects: true })`
2. FAQPage-Schema generieren: `createFAQSchema(faqItems)` zum `structuredData`-Array hinzufügen
3. `<FAQSection>` im Main-Content oder nach dem Conclusion-Block rendern

#### D) Fehlende EN-Übersetzung der Homepage-FAQs nachholen

`public/locales/en/home.json` hat keinen `faq`-Block — muss ergänzt werden.

### Aufwand-Schätzung (Implementierung)

| Schritt | Dateien |
|---------|---------|
| FAQSection parametrisieren | `src/components/sections/FAQSection.tsx` |
| 9x FAQ-Texte DE schreiben | `public/locales/de/services.json` |
| 9x FAQ-Texte EN schreiben | `public/locales/en/services.json` |
| ServicePage FAQ einbinden | `src/routes/ServicePage.tsx` |
| Homepage EN-FAQs ergänzen | `public/locales/en/home.json` |
| Weitere Sprachen (optional) | `public/locales/{cs,da,es,fr,it,pl,pt}/home.json` + `services.json` |

### Architektur-Diagramm (Ziel-Zustand)

```
public/locales/{lang}/services.json
  └── {service}.faq.items[]
        ↓
ServicePage.tsx
  ├── createFAQSchema(items) → SEOHead.structuredData[]
  └── <FAQSection items={items} caption="..." title="..." showFooter={false} />

public/locales/{lang}/home.json
  └── faq.items[]
        ↓
HomePage.tsx
  ├── createFAQSchema(items) → SEOHead.structuredData[]
  └── <FAQSection />  (default props, inkl. Footer)
```
