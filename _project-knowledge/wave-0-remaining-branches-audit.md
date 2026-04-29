# Wave 0 — Verbleibende Branches Audit

> Audit der 13 nach DSGVO-Cleanup verbleibenden Remote-Branches.
> Pro Branch wird klassifiziert: GEMERGT / EVTL UNIQUE / ZU PRUEFEN.
> Audit erfolgt in 3 Batches a 4-5 Branches.

## Methodik
Pro Branch wird ermittelt:
- Letzte Aktivitaet (relative + absolut)
- Anzahl Nicht-Merge-Commits gegen origin/main
- Klassifizierung in einen der drei Buckets

Klassifizierungs-Regeln:
- **GEMERGT** = 0 Nicht-Merge-Commits gegen main
- **EVTL UNIQUE** = 1+ Nicht-Merge-Commits mit feat/fix/refactor-Praefix
- **ZU PRUEFEN** = unklar oder grenzwertig

## Batch 1

| Branch | Letzte Aktivitaet | Nicht-Merge-Commits | Klassifizierung |
|---|---|---|---|
| claude/add-robots-sitemap-PB7sT | 3 months ago (2026-01-30) | 118 | EVTL UNIQUE |
| claude/create-email-template-QJvYj | 3 months ago (2026-02-03) | 5 | EVTL UNIQUE |
| claude/seo-setup-post-deployment-sb54P | 3 months ago (2026-02-02) | 2 | EVTL UNIQUE |
| update-igloo-widget-and-header | 5 months ago (2025-12-04) | 37 | EVTL UNIQUE |

### Detail: claude/add-robots-sitemap-PB7sT

Top 5 Nicht-Merge-Commits:
- a78ac96 Add Playwright-based pre-rendering script for SEO
- cd05f35 Add GTM + GA4 with DSGVO-compliant Consent Mode v2
- 2b8f932 Add 404 NotFoundPage with catch-all route
- 5704035 Integrate SEOHead component into all page components
- 7e07c53 Add SEOHead component with react-helmet-async for dynamic meta tags

### Detail: claude/create-email-template-QJvYj

Top 5 Nicht-Merge-Commits:
- 9cbf66c Add Vitamin D3+K2 Spray email template
- 871d695 GTM
- 45be849 gsc verify
- a5a8fa0 GSC Verify
- 0f1a97f bots allowed

### Detail: claude/seo-setup-post-deployment-sb54P

Top 5 Nicht-Merge-Commits:
- d366edd Fix prerender routes and add SEO setup report
- 0f1a97f bots allowed

### Detail: update-igloo-widget-and-header

Top 5 Nicht-Merge-Commits:
- 6f14a33 Update IglooWidgetSection layout and Header text color logic
- fe0777c Button umbenannt
- 7263e1d Refactor homepage with Igloo widgets and move diagnostic services to dedicated page
- d67ef5f Igloo hinzugefügt
- 0a7bbed Update About page, Footer layout, and Localization
