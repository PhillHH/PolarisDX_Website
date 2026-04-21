# NORA-3: Konventions-Empfehlung

## Empfehlung
**Option A: Alles nach `src/pages/` konsolidieren.** `routes/` enthält die Mehrheit (15 Files), aber `pages/` ist der React-Community-Standard und beschreibt den Inhalt (Seiten-Komponenten) treffender als `routes/` (das eher Routing-Config suggeriert). Die 6 `pages/`-Files bleiben, die 15 `routes/`-Files werden verschoben.

## Migration-Liste
| File | Von | Nach | Imports anzupassen |
|---|---|---|---|
| AboutPage.tsx | routes/ | pages/ | App.tsx, App.lazy.tsx |
| ArticlePage.tsx | routes/ | pages/ | App.tsx, App.lazy.tsx |
| ArticlesIndexPage.tsx | routes/ | pages/ | App.tsx, App.lazy.tsx |
| CaseStudy32Reasons.tsx | routes/ | pages/ | App.tsx (auskommentiert) |
| ContactPage.tsx | routes/ | pages/ | App.tsx, App.lazy.tsx |
| DownloadsPage.tsx | routes/ | pages/ | App.tsx, App.lazy.tsx |
| HomePage.tsx | routes/ | pages/ | App.tsx, App.lazy.tsx |
| ImprintPage.tsx | routes/ | pages/ | App.tsx, App.lazy.tsx |
| PrivacyPage.tsx | routes/ | pages/ | App.tsx, App.lazy.tsx |
| ProductPage.tsx | routes/ | pages/ | App.tsx (auskommentiert) |
| ServicePage.tsx | routes/ | pages/ | App.tsx, App.lazy.tsx |
| ServicesOverviewPage.tsx | routes/ | pages/ | App.tsx, App.lazy.tsx |
| ShopPage.tsx | routes/ | pages/ | App.tsx (auskommentiert) |
| SupportPage.tsx | routes/ | pages/ | App.tsx, App.lazy.tsx |
| TermsPage.tsx | routes/ | pages/ | App.tsx, App.lazy.tsx |

## URL-Bruch-Risiko
Nein — Route-Pfade (`/about`, `/contact`, etc.) sind in `App.tsx` als Strings definiert und unabhaengig vom Dateisystem-Pfad der Komponente.

## lib/ vs utils/ Klaerung
`src/lib/` beibehalten — entspricht der Vite/shadcn-Konvention und enthaelt nur `utils.ts`; ein zusaetzlicher `src/utils/`-Ordner waere redundant.
