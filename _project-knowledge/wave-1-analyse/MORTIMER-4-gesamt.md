## SAFE_DELETE Liste

- `src/routes/ShopPage.tsx` (63 LOC)
- `src/routes/ProductPage.tsx` (213 LOC)
- `src/components/ui/ProductCard.tsx` (80 LOC)
- `src/components/layout/PageContainer.tsx` (27 LOC)
- `src/hooks/useAnalytics.ts` (197 LOC, 0 Imports)
- `src/data/agbContent.ts` (272 LOC, 0 Imports)
- `src/data/social.tsx` (24 LOC, 0 Imports)
- `src/data/democontent/` (Ordner, 33 KB)
- 16 tote Asset-Files: alle `.png`/`.jpg`/`.jpeg`-Originale deren `.webp`-Variante verwendet wird, plus `Igloo Reader Pro.*`, `PolarisDX_Logo_main.*`, `hero_device.*`, `bg_images/Logo_Icon_background.*`, `react.svg`
- Auskommentierte Imports/Routen in `App.tsx` (Zeilen 8-9, 56-59)

## REVIEW_NEEDED Liste

- `src/routes/CaseStudy32Reasons.tsx` (237 LOC) — "temporarily disabled"
- `src/components/sections/FeaturedCaseStudy.tsx` (76 LOC) — "temporarily disabled"
- `src/data/products.ts` — nur von toten ShopPage/ProductPage importiert, aber Produkt-Daten könnten geplant sein
- Auskommentierter Code in `Header.tsx:38-39`, `useSearch.ts:42-47`, `HomePage.tsx:77-79`

## Geschätzte Repo-Verkleinerung

~2,5 MB (2.545 KB) bei vollständiger Bereinigung aller SAFE_DELETE-Files; davon ~2,4 MB tote Assets, ~53 KB toter Quellcode.

## Reihenfolge

1. **Zuerst:** 16 tote Asset-Dateien löschen (größter Effekt: 2,4 MB)
2. **Dann:** SAFE_DELETE-Quellcode entfernen (ShopPage, ProductPage, ProductCard, PageContainer, useAnalytics, agbContent, social, democontent)
3. **Dann:** Auskommentierte Imports/Routen in App.tsx, Header.tsx, useSearch.ts, HomePage.tsx bereinigen
4. **Zuletzt:** REVIEW_NEEDED-Files nach Stakeholder-Entscheidung (CaseStudy32Reasons, FeaturedCaseStudy, products.ts)
