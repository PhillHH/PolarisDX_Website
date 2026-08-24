# Projektverzeichnis PolarisDX Website

Vollständige Struktur-, Technik- und SEO-Dokumentation des Projekts
`/home/phillip/01polaris-preview` (Repo `PhillHH/PolarisDX_Website`).

**Bewusste Abgrenzung:** Dieses Verzeichnis dokumentiert _Struktur_, nicht _Inhalt_.
Menüpunkte, Kategorien, Routen, Slugs, Anker und Links sind vollständig erfasst —
Fließtexte, Überschriftenformulierungen und Bildinhalte nicht.

Stand der Erhebung: 2026-08-20, Branch `feat/home-leadmagnet`.

## Inhalt

| Datei                                            | Inhalt                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| [01-seitenstruktur.md](01-seitenstruktur.md)     | Alle Routen, URLs, Slugs, Sprachpräfixe, Redirects, 404-Logik                        |
| [02-navigation.md](02-navigation.md)             | Header-Menü, Mega-Menü-Gruppen, Footer, Kapitelleisten, Anker, externe Links         |
| [03-technik.md](03-technik.md)                   | Stack, SSR-Architektur, Build, Server, Backend-API, Infrastruktur, Deploy            |
| [04-i18n.md](04-i18n.md)                         | 10 Sprachen, 15 Namespaces, Lade- und Fallback-Logik, Sprachweichen                  |
| [05-seo.md](05-seo.md)                           | Sitemap, hreflang, Canonicals, Meta, Structured Data, robots.txt, Indexierungsregeln |
| [06-inhaltsdaten.md](06-inhaltsdaten.md)         | Datenquellen: Services, Artikel, Events, Downloads, Musterbefunde, Testimonials      |
| [07-komponenten.md](07-komponenten.md)           | Komponentenbaum, Hooks, Lib, API-Clients, Design-Tokens                              |
| [08-tracking-consent.md](08-tracking-consent.md) | GTM, Consent Mode, Cookie-Banner, Event-Vokabular                                    |
| [09-qualitaet.md](09-qualitaet.md)               | Tests, Linting, Skripte, Hooks, CI                                                   |
| [10-befunde.md](10-befunde.md)                   | Beim Erstellen gefundene Abweichungen und Altlasten                                  |

## Kurzprofil

- **Art:** React-19-SSR-Website (kein CMS, Inhalte in Code + JSON + i18n-Dateien)
- **Zielgruppe:** B2B (Arzt-/Zahnarztpraxen) — plus drei „unlisted" Consumer-Landingpages
- **Domains:** `polarisdx.net` (Prod), `preview.polarisdx.net` (Preview), `relaunch.polarisdx.net` (Dev-HMR-Host)
- **Sprachen:** 10, Default Deutsch
- **Seitenzahl:** 27 sitemap-geführte Routen × 10 Sprachen + 3 Consumer + 2 Nur-Deutsch = 275 URLs
