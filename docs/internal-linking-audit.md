# Internes Verlinkungsaudit — PolarisDX Website

**Datum:** 2026-02-09
**Scope:** Alle aktiven Seiten, Sektionen, Datenstrukturen
**Ausgenommen:** Header, Footer, Breadcrumbs (Sprint 0 — bereits vorhanden)

---

## 1. Homepage → Ausgehende interne Links (nach Sektion)

| Sektion | Ziel-URL | Link-Art |
|---------|----------|----------|
| **HeroSection** | `/contact` | Button "Termin buchen" |
| **HeroSection** | `/downloads` | Button "Infomaterialien herunterladen" |
| **AboutSection** | `/contact` | PrimaryButton "Exklusiven Vorteil sichern" |
| **IglooWidgetSection** | `/diagnostics/dental` | Widget-Karte |
| **IglooWidgetSection** | `/diagnostics/beauty` | Widget-Karte |
| **IglooWidgetSection** | `/diagnostics/longevity` | Widget-Karte |
| **DoctorsSection** | `/igloo-pro` | PrimaryButton "Zum Igloo Pro System" |
| **TestimonialsSection** | — | **Keine internen Links** |
| **BlogSection** | `/vitamin-d3-implantologie` | Featured-Artikel Link |
| **BlogSection** | `/articles/die-gruene-praxis` | BlogCard |
| **BlogSection** | `/articles/der-unsichtbare-patient` | BlogCard |
| **BlogSection** | `/articles/die-5-minuten-diagnose` | BlogCard |
| **FAQSection** | — | **Keine internen Links** |

### Bewertung Homepage
- **Gut:** Homepage verlinkt auf /contact (3x), /downloads, /igloo-pro, 3 Hauptbereiche (Dental/Beauty/Longevity), Featured-Artikel, 3 Blog-Artikel
- **Lücke:** Kein Link zu `/diagnostics` (Übersichtsseite)
- **Lücke:** Kein Link zu `/about`
- **Lücke:** Kein Link zu `/events`
- **Lücke:** Kein Link zu `/articles` (Artikelübersicht)
- **Lücke:** 6 von 9 Service-Seiten werden NICHT verlinkt (nur Dental, Beauty, Longevity)
- **Lücke:** 3 von 6 Artikeln werden NICHT verlinkt (Artikel 4-6)

---

## 2. ServicePage → Ausgehende interne Links

| Element | Ziel-URL | Logik |
|---------|----------|-------|
| Breadcrumbs | `/`, `/diagnostics` | Statisch |
| CTA-Button (Content) | `/contact` | Statisch |
| **Sidebar: Andere Services** | `/diagnostics/{id}` für alle anderen Services | Dynamisch: `services.filter(s => s.id !== service.id)` |
| **Sidebar: Verwandte Artikel** | `/articles/{slug}` | **HARDCODED: `articles.slice(0, 3)`** — immer die gleichen 3 Artikel! |
| Sidebar: Kontakt-Widget | `/contact` | Statisch |
| `renderTextWithLinks()` | Variable `[[text\|/path]]` | Inline-Links in Übersetzungstexten (Listenpunkte) |

### Bewertung ServicePage
- **Gut:** Cross-Linking zu allen anderen Services vorhanden (Sidebar)
- **Gut:** Link zu /contact vorhanden
- **KRITISCH:** "Verwandte Artikel" sind NICHT verwandt — es sind IMMER die ersten 3 Artikel (`articles.slice(0, 3)`), unabhängig vom Service-Kontext
- **Lücke:** Kein Link zu `/igloo-pro`
- **Lücke:** Kein Link zu `/diagnostics` (Übersichtsseite, außer Breadcrumbs)

---

## 3. ArticlePage → Ausgehende interne Links

| Element | Ziel-URL | Logik |
|---------|----------|-------|
| Breadcrumbs | `/`, `/articles` | Statisch |
| "Zurück zur Übersicht" | `/articles` | Statisch |
| **Sidebar (Desktop): Weitere Artikel** | `/articles/{slug}` | Dynamisch: `otherArticles.slice(0, 4)` |
| **Mobile: Empfohlene Artikel** | `/articles/{slug}` | Dynamisch: `otherArticles.slice(0, 3)` |
| Sidebar: Kontakt-Widget | — | **NUR Telefonnummer, KEIN Link zu `/contact`!** |

### Bewertung ArticlePage
- **KRITISCH: KEINE Links zu Service-Seiten** — kein "Verwandte Services", kein "Passender Diagnose-Service"
- **KRITISCH:** Kontakt-Widget hat NUR eine Telefonnummer, keinen Button/Link zu `/contact`
- **Lücke:** Kein Link zu `/igloo-pro`
- **Lücke:** Kein Link zu `/diagnostics` (Übersichtsseite)
- **Gut:** Empfohlene Artikel vorhanden (Artikel ↔ Artikel Cross-Linking funktioniert)

---

## 4. Verwandte-Inhalte-Sektionen — Status

| Seite | Verwandte Artikel? | Verwandte Services? | Bewertung |
|-------|--------------------|---------------------|-----------|
| ServicePage | Ja, aber FAKE (hardcoded slice) | Ja (alle anderen Services) | Artikel-Mapping fehlt |
| ArticlePage | Ja (andere Artikel) | **NEIN** | Service-Mapping fehlt komplett |
| ServicesOverviewPage | Nein | Ja (ServiceCards) | Artikel fehlen |
| ArticlesIndexPage | Ja (alle Artikel + Featured) | Nein | Service-Links fehlen |
| IglooProPage | Nein | Nein | Isolierte Seite |
| VitaminD3Page | Ja (1 Artikel in Sidebar) | Ja (dental, igloo-pro in Sidebar) | Am besten verlinkte Spezialseite |
| AboutPage | Nein | Nein | **Isolierte Seite** |
| EventsPage | Nein | Nein | **Isolierte Seite** |
| ContactPage | Nein | Nein | **Isolierte Seite** |
| DownloadsPage | Nein | Nein | **Isolierte Seite** |

---

## 5. Datenstruktur: Artikel ↔ Services Mapping

### Aktueller Stand: **NICHT VORHANDEN**

```typescript
// types/models.ts — Article Interface
interface Article {
  id: string
  slug: string
  category: ArticleCategory  // 'Sustainability' | 'Telemedicine' | 'Economics' | 'Health Article'
  author: string
  date: string
  readTime: string
  sections: ArticleSection[]
  // ❌ KEIN relatedServices / relatedServiceIds Feld
}

// types/models.ts — Service Interface
interface Service {
  id: ServiceId
  title: string
  description: string
  translationKey: string
  icon?: ReactNode
  // ❌ KEIN relatedArticles / relatedArticleIds Feld
}
```

### ServicePage Zeile 103 — Pseudo-Relation
```typescript
const relatedArticles = articles.slice(0, 3) // ← IMMER die gleichen 3 Artikel!
```

Es gibt **keine semantische Zuordnung** zwischen Artikeln und Services. Die "verwandten Artikel" auf der ServicePage sind immer: `green_practice`, `invisible_patient`, `five_minute_diagnosis` — egal welcher Service angezeigt wird.

---

## 6. Eingehende Links pro Seite (ohne Header/Footer/Breadcrumbs)

### Legende: ✅ Gut (3+ Quellen) | ⚠️ Schwach (1-2 Quellen) | ❌ Kritisch (0 Quellen)

| Seite | Eingehende Links (Body-Content) | Status |
|-------|--------------------------------|--------|
| `/` | Überall verlinkt | ✅ |
| `/contact` | Homepage (3x), ServicePage (2x), VitaminD3, DoctorsSection, CtaSection | ✅ |
| `/diagnostics` | — (nur Breadcrumbs auf ServicePages) | ❌ |
| `/diagnostics/dental` | Homepage (IglooWidget), ServicePage Sidebar, VitaminD3Page | ✅ |
| `/diagnostics/beauty` | Homepage (IglooWidget), ServicePage Sidebar | ⚠️ |
| `/diagnostics/longevity` | Homepage (IglooWidget), ServicePage Sidebar | ⚠️ |
| `/diagnostics/poc-systemloesungen` | ServicePage Sidebar | ❌ |
| `/diagnostics/praeventions-checks` | ServicePage Sidebar | ❌ |
| `/diagnostics/infektion-entzuendung` | ServicePage Sidebar | ❌ |
| `/diagnostics/stoffwechsel-herz` | ServicePage Sidebar | ❌ |
| `/diagnostics/hormon-tests` | ServicePage Sidebar | ❌ |
| `/diagnostics/kompatibilitaet-integration` | ServicePage Sidebar | ❌ |
| `/articles` | ArticlePage "Zurück" Button | ⚠️ |
| `/articles/die-gruene-praxis` | Homepage (BlogSection), ServicePage Sidebar, VitaminD3Page | ✅ |
| `/articles/der-unsichtbare-patient` | Homepage (BlogSection), ServicePage Sidebar | ⚠️ |
| `/articles/die-5-minuten-diagnose` | Homepage (BlogSection), ServicePage Sidebar | ⚠️ |
| `/articles/the-ecosystem-of-rapid-tests...` | ArticlesIndex nur | ❌ |
| `/articles/die-performance-formel...` | ArticlesIndex nur | ❌ |
| `/articles/precision-in-point-of-care...` | ArticlesIndex nur | ❌ |
| `/igloo-pro` | Homepage (DoctorsSection), VitaminD3Page, NotFoundPage | ✅ |
| `/vitamin-d3-implantologie` | Homepage (BlogSection Featured), ArticlesIndex Featured | ⚠️ |
| `/about` | — | ❌ |
| `/events` | — | ❌ |
| `/downloads` | Homepage (HeroSection) | ⚠️ |

### Kritischste Lücken (❌ — keine Body-Content-Links)
1. **6 Service-Seiten** (poc-systemloesungen, praeventions-checks, infektion-entzuendung, stoffwechsel-herz, hormon-tests, kompatibilitaet-integration) — nur über ServicePage-Sidebar erreichbar
2. **3 Artikel** (ecosystem, performance-formel, precision) — nur über ArticlesIndex erreichbar
3. **`/diagnostics` Übersichtsseite** — kein einziger Body-Content-Link
4. **`/about`** — kein einziger Body-Content-Link
5. **`/events`** — kein einziger Body-Content-Link

---

## 7. Empfehlungen — Priorisiert nach SEO-Impact

### PRIO 1 — Datenstruktur schaffen (Voraussetzung für alles Weitere)

**Artikel ↔ Services Mapping einführen:**
```typescript
// In Article Interface hinzufügen:
relatedServiceIds?: ServiceId[]

// In Service Interface hinzufügen:
relatedArticleIds?: string[]  // Article IDs
```

Beispiel-Mapping:
| Artikel | Passende Services |
|---------|-------------------|
| green_practice | dental, longevity |
| invisible_patient | poc-systemloesungen |
| five_minute_diagnosis | poc-systemloesungen, praeventions-checks |
| ecosystem_of_rapid_tests | kompatibilitaet-integration |
| rapid_setup_formula | poc-systemloesungen |
| precision_point_of_care | praeventions-checks, infektion-entzuendung |

### PRIO 2 — ArticlePage: "Verwandte Services" Sektion hinzufügen

- Sidebar-Widget analog zum ServicePage "Andere Services" Widget
- Nutzt `article.relatedServiceIds` aus der neuen Datenstruktur
- Jeder Artikel verlinkt auf 2-3 passende Services

### PRIO 3 — ServicePage: Echte "Verwandte Artikel" statt `slice(0,3)`

- `articles.slice(0, 3)` ersetzen durch Filter auf `relatedArticleIds`
- Fallback: Wenn keine Related IDs definiert, alle Artikel anzeigen

### PRIO 4 — ArticlePage: Contact-Widget reparieren

- Telefonnummer durch PrimaryButton mit Link zu `/contact` ergänzen
- Analog zum ServicePage Contact-Widget

### PRIO 5 — Homepage: Fehlende Links ergänzen

- **ServicesSection** auf Homepage einbinden (oder Link "Alle Services" im IglooWidgetSection-Bereich)
- Link zu `/diagnostics` (Übersichtsseite) hinzufügen
- Link zu `/articles` (Artikelübersicht) im BlogSection hinzufügen (z.B. "Alle Artikel anzeigen")
- Link zu `/about` im TestimonialsSection oder einem neuen About-Teaser

### PRIO 6 — Unterseiten: Ausgehende Links hinzufügen

- **AboutPage:** CTA zu `/contact`, Links zu Services oder `/diagnostics`
- **EventsPage:** Link zu `/contact` oder relevanten Services
- **ContactPage:** Links zu `/diagnostics`, `/articles`, `/about`
- **DownloadsPage:** Links zu `/igloo-pro`, `/diagnostics`
- **IglooProPage:** Links zu `/diagnostics/dental`, `/diagnostics/beauty`, `/diagnostics/longevity`, `/articles`

### PRIO 7 — FAQSection & TestimonialsSection: Inline-Links

- FAQ-Antworten mit internen Links versehen (z.B. "Mehr zu unseren Services" → `/diagnostics`)
- TestimonialsSection: CTA-Button "Jetzt selbst überzeugen" → `/contact`

---

## Zusammenfassung

| Kategorie | Status | Handlungsbedarf |
|-----------|--------|-----------------|
| Header/Footer | ✅ Gut | — |
| Breadcrumbs | ✅ Gut | — |
| Homepage → Hauptseiten | ⚠️ Teilweise | 6/9 Services fehlen, /about fehlt, /diagnostics fehlt |
| Service → Artikel | ❌ Fake | Hardcoded slice statt echtem Mapping |
| Artikel → Services | ❌ Nicht vorhanden | Komplett fehlend |
| Datenstruktur Mapping | ❌ Nicht vorhanden | Muss neu erstellt werden |
| Unterseiten-Verlinkung | ❌ Isoliert | About, Events, Contact, Downloads ohne ausgehende Links |
| "Verwandte Inhalte" | ⚠️ Oberflächlich | Nur Article↔Article funktioniert echt |

**Geschätzter Aufwand für vollständige Umsetzung:** 7 Arbeitspakete (Prio 1-7)
**Größter SEO-Hebel:** Prio 1-3 (Datenstruktur + bidirektionale Artikel↔Services-Verlinkung)
