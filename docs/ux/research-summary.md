# Research Summary — Phase 0

> Executive Summary + Quote-Cluster der Phase-0-Erkenntnisse. Begleitet
> `problem-statements.md`, `insights.md`, `../personas/*`. Stand **2026-06-24**.

## Executive Summary

Die App ist funktional und inhaltsreich (10 Locales, 14 i18next-Namespaces, gepflegter statischer
Content), hat aber drei wiederkehrende Erfahrungs-Lücken: (1) **fehlende Fokussierung** pro View
(kein eindeutiges dominantes Element/CTA), (2) **inkonsistente Struktur/Duplikate**
(Card-/Form-/Section-Varianten) und (3) **unvollständige Resilienz & States**
(keine Route-Error-Boundary, kein Skeleton-Fallback, Reading-Width fehlt). Das design-system ist
bereits solide angelegt (tokenisierte Atome/Molecules in `core/compound/feedback/primitives-layout`),
aber Organisms/Templates und die flächendeckende Migration der Legacy-`components/*` fehlen noch.

Das Refactoring adressiert diese Lücken phasenweise (Tokens → Atomic → Visual/Layout → A11y →
UX-Validierung → Governance). Tabu bleiben Consumer-Checkout, Chat und die gesamte Infra/Deployment (§5).

## Quote-Cluster (synthetisiert, lösungsfrei — aus Heuristik-Review; reale Zitate folgen Phase 6)

**Cluster „Orientierung"**

- „Ich sehe viel, aber weiß nicht, wo ich klicken soll." → fehlendes dominantes CTA.

**Cluster „Lesbarkeit"**

- „Der Text läuft mir zu breit über den Bildschirm." → Reading-Width fehlt.

**Cluster „Vertrauen/Konsistenz"**

- „Die Service-Kacheln sehen aus wie die Blog-Kacheln." → unklare Differenzierung/Duplikate.

**Cluster „Resilienz"**

- „Nach einem falschen Link hänge ich fest." → kein hilfreicher Error/404-Ausweg.

## Wichtigste Baseline-Kennzahlen (Details: `REFACTOR-LOG.md` › Phase-0-Baseline)

- Hartkodierte Werte (Allowlist): **60** Hex-Matches (3 Dateien), **128** px-Matches (32 Dateien).
- Architektur: **0** Zirkular-Abhängigkeiten (`madge`, 151 Dateien), **0** ungenutzte Exports (`ts-prune`).
- Qualität: typecheck **grün**; lint **18 Fehler / 2 Warnungen** (Legacy + Tabu-Consumer; Abbau in Phase 2/5).
- First-Load-JS: Shared `index` 359 kB (gzip **110.66 kB**) + react/i18n-Vendor-Chunks; schwerste Route-Chunks S3Leitlinie/VitaminD3Implantology.

## Nächste Schritte

Siehe `docs/REFACTOR_BACKLOG.md` (KEEP/MERGE/DROP, Impact/Feasibility) und den Phasenplan
`EXECUTION-PLAN.md`.
