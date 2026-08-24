# 02 — Navigation, Menüs und Links

Quellen: `src/components/layout/Header.tsx`, `Footer.tsx`,
`src/components/ui/ChapterNav.tsx`, `Breadcrumbs.tsx`, `SearchModal.tsx`,
`LanguageSwitcher.tsx`.

## 1. Hauptnavigation (Header)

Konfiguriert als `navItems: NavItem[]` in `src/components/layout/Header.tsx:44`.
Alle Beschriftungen kommen aus i18n-Key `nav.<label>` (Namespace `common`).

| #   | Label-Key     | Ziel           | Typ                                |
| --- | ------------- | -------------- | ---------------------------------- |
| 1   | `nav.home`    | `/`            | Direktlink                         |
| 2   | `nav.events`  | `/events`      | Direktlink                         |
| 3   | `nav.about`   | `/about`       | Link **mit** Untermenü             |
| 3.1 | `nav.terms`   | `/terms`       | Kind                               |
| 4   | `nav.service` | `/diagnostics` | Link **mit** Mega-Menü (2 Gruppen) |
| 5   | `nav.blog`    | `/articles`    | Direktlink                         |
| 6   | `nav.support` | `/support`     | Direktlink                         |
| CTA | `nav.contact` | `/contact`     | Button, rechts neben der Leiste    |

### 1.1 Mega-Menü „Diagnostik" — Gruppe `nav.group_poc`

| Label-Key        | Ziel                               |
| ---------------- | ---------------------------------- |
| `nav.dental`     | `/diagnostics/dental`              |
| `nav.beauty`     | `/diagnostics/beauty`              |
| `nav.longevity`  | `/diagnostics/longevity`           |
| `nav.pocSystems` | `/diagnostics/poc-systemloesungen` |

### 1.2 Mega-Menü „Diagnostik" — Gruppe `nav.group_lab`

| Label-Key           | Ziel                         | Beschreibung             | Badge           |
| ------------------- | ---------------------------- | ------------------------ | --------------- |
| `nav.epigenetics`   | `/epigenetics`               | `nav.epigenetics_desc`   | `nav.badge_new` |
| `nav.musterbefunde` | `/epigenetics#musterbefunde` | `nav.musterbefunde_desc` | —               |

### 1.3 Deaktivierte Menüpunkte (im Code auskommentiert)

- `nav.casestudies` → `/casestudys/32reasons` — Route existiert nicht mehr
- `nav.shop` → `/shop` — Shop abgeschaltet (i18n-Namespace `shop` besteht noch)

### 1.4 Aktiv-Zustand

- `isPathActive` — Anker hinter der Route zählen nicht mit (`/epigenetics#musterbefunde`
  und `/epigenetics` sind dieselbe Seite)
- `isExactPage` — setzt `aria-current="page"` nur bei exakter, ankerfreier Übereinstimmung
- `isItemActive` — Elternpunkt ist aktiv, wenn ein Kind oder ein Gruppeneintrag aktiv ist

### 1.5 Weitere Header-Elemente

- Logo → `/` (`logo.alt`, Fallback „PolarisDX — POC-Diagnostik für Arztpraxen")
- Suche (`a11y.search`) → öffnet `SearchModal`, gespeist von `useSearch`
- Sprachumschalter (`LanguageSwitcher` + `FlagIcon`)
- Mobile: Burger (`a11y.toggle_nav`), aufklappbare Untermenüs, CTA `nav.contact` am Ende

## 2. Footer

Vier Spalten plus Rechtszeile.

### 2.1 Spalte „Links" (`footer.links`)

`/` · `/about` · `/igloo-pro` · `/articles` · `/events` · `/downloads` · `/contact`

### 2.2 Spalte „Diagnostik" (`footer.diagnostics`)

| Label-Key                 | Ziel                               |
| ------------------------- | ---------------------------------- |
| `footer.allServices`      | `/diagnostics`                     |
| —                         | `/diagnostics/dental`              |
| —                         | `/diagnostics/beauty`              |
| —                         | `/diagnostics/longevity`           |
| `footer.pocSystems`       | `/diagnostics/poc-systemloesungen` |
| `footer.preventionChecks` | `/diagnostics/praeventions-checks` |
| `footer.hormonTests`      | `/diagnostics/hormon-tests`        |

Nicht im Footer verlinkt: `infektion-entzuendung`, `stoffwechsel-herz`,
`kompatibilitaet-integration` — sie sind nur über `/diagnostics` erreichbar.

### 2.3 Standorte

`footer.london` und `footer.hamburg` — Adressblöcke, keine Links.

### 2.4 Rechtszeile

`footer.copyright` · `/imprint` (`footer.imprint`) · `/privacy` (`footer.privacy`) ·
`/terms` (`nav.terms`) · Hinweis `footer.product_note` („IglooPro ist ein Produkt der DX365 GmbH").

### 2.5 Externe Links (die einzigen der Site)

| Ziel                                            | Ort            |
| ----------------------------------------------- | -------------- |
| `https://www.linkedin.com/company/polarisdx/`   | Footer, Social |
| `https://www.instagram.com/polaris_diagnostix/` | Footer, Social |

## 3. Kapitelleisten (`ChapterNav`)

Sticky-Zeile unter dem Header auf den langen Strecken. Alles echte `<a href="#id">` —
funktioniert ohne JavaScript. Die Leiste schreibt ihre Gesamthöhe als CSS-Variable
`--chapterbar-offset` an `:root`; `ScrollToHash` in `src/App.tsx` liest sie beim
Ankersprung aus, sonst landen Kapitel hinter der Leiste.

Optionale Bestandteile: `switcher` (Panel-Umschalter mit `hrefFor(slug)`) und
`aktion` (Link oder Download-Button am rechten Rand).

### 3.1 Anker auf `/epigenetics`

| Anker              | Position                                                        |
| ------------------ | --------------------------------------------------------------- |
| `#vergleich`       | `src/pages/EpigeneticsPage.tsx:351`                             |
| `#prinzip`         | `:510`                                                          |
| `#werte-verstehen` | `:564`                                                          |
| `#analysen`        | `:614`                                                          |
| `#musterbefunde`   | `:617` (Sprungmarke innerhalb `#analysen`, Ziel des Mega-Menüs) |
| `#ablauf`          | `:634`                                                          |
| `#studienlage`     | `:678`                                                          |
| `#fragen`          | `:737`                                                          |
| `#downloads`       | `:767`                                                          |
| `#konditionen`     | `:893`                                                          |

Zusätzlich pflegt `src/content/befunde/legacyAnchors.ts` alte Ankernamen weiter.

## 4. Breadcrumbs

`src/components/ui/Breadcrumbs.tsx` — sichtbare Brotkrumen; das dazugehörige
`BreadcrumbList`-Schema erzeugt `createBreadcrumbSchema()` aus
`src/components/seo/structuredData.ts` (siehe [05-seo.md](05-seo.md)).

## 5. Suche

`SearchModal` + `useSearch` — clientseitige Suche über Seiten, Services und Artikel.
Der `WebSite`-Schema-Eintrag deklariert dazu eine `SearchAction`/`EntryPoint`.

## 6. Weitere Einstiegspunkte

- `MobileCallButton` — feste Telefon-CTA auf Mobilgeräten (site-weit, außer Consumer)
- `ChatWidget` — spricht `POST /api/chat`
- `PageSidebar` — seiteninterne Navigation auf Unterseiten
- `LanguageFallbackNotice` — Hinweis, wenn ein Namespace in der Zielsprache fehlt
