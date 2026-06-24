import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import boundaries from 'eslint-plugin-boundaries'
import prettierConfig from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // `_project-knowledge/` ist ein eingefrorener Pre-Refactor-Referenz-Snapshot
  // (Audit-Material, nicht gebaut, nicht von `src` referenziert) — nicht linten.
  globalIgnores(['dist', '_project-knowledge']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
      importPlugin.flatConfigs.recommended,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      // TypeScript-Pfad-/Extension-aware Resolver: loest `~/*`-Alias
      // (tsconfig `paths`) UND `.ts/.tsx`-Relativimporte auf. Ohne ihn scheitert
      // jeder Import an `import/no-unresolved` (Phase-1-Altlast) und entzieht
      // zugleich `boundaries` die Ziel-Klassifikation (§2.4).
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.app.json', 'tsconfig.server.json', 'tsconfig.node.json'],
        },
      },
    },
    rules: {
      // Bewusst ungenutzte Argumente/Variablen mit `_`-Praefix erlauben (z. B.
      // Express-Error-Handler `(_err, _req, _res, _next)` in der Infra-tabu
      // `server.ts` braucht die 4-stellige Signatur). Standard-Konvention.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // react-hooks v7 hat die React-Compiler-Advisories (set-state-in-effect/
      // refs/immutability) in `recommended` zu Errors hochgestuft. Der Bestand
      // ist aelter; viele Treffer sind idiomatische SSR-Hydration-Mount-Guards
      // (`useEffect(() => setMounted(true), [])`) und liegen in Tabu-Bereichen
      // (Consumer-Checkout §5, nicht anfassbar). Als `warn` getrackt fuer
      // schrittweisen Abbau in den Hooks-naheren Phasen (5/6) — kein Build-Gate.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      // Fast-Refresh-DX-Hinweis (kein Korrektheits-Gate); betroffene Konstante
      // liegt in der Tabu-`OrderModal` — als Hinweis behalten, nicht als Error.
      'react-refresh/only-export-components': 'warn',
    },
  },
  // ── Atomic-Import-Richtung maschinell erzwingen (§2.2 / §2.4, [FRO][BUD]) ──
  // Erzwingt die Schichten-Hierarchie Page → Template → Organism → Molecule/
  // Feedback → Atom → Token HART als Build-Gate (nicht nur per Review). Die
  // Element-Typen sind auf die REALE Projektstruktur gemappt (Organismen leben
  // in components/sections, Templates in components/layout) — nicht auf das
  // generische §2.4-Beispiel (design-system/sections). `madge --circular`
  // ergaenzt die Zyklen-Pruefung.
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/include': ['src/**/*'],
      // Test-Dateien konsumieren bewusst die oeffentliche DS-API (Barrel) — sie
      // sind keine Schicht und von der Richtungs-Pruefung ausgenommen.
      'boundaries/ignore': ['**/*.test.{ts,tsx}'],
      'boundaries/elements': [
        { type: 'token', mode: 'full', pattern: 'src/design-system/tokens/**' },
        { type: 'atom', mode: 'full', pattern: 'src/design-system/core/**' },
        { type: 'atom', mode: 'full', pattern: 'src/design-system/primitives-layout/**' },
        { type: 'molecule', mode: 'full', pattern: 'src/design-system/compound/**' },
        { type: 'feedback', mode: 'full', pattern: 'src/design-system/feedback/**' },
        // Oeffentliche DS-API (Barrel) — aggregiert alle DS-Schichten.
        { type: 'ds-barrel', mode: 'full', pattern: 'src/design-system/index.ts' },
        { type: 'organism', mode: 'full', pattern: 'src/components/sections/**' },
        // App-Komposita (BlogCard/ServiceCard/SearchModal …) auf Organism-Ebene.
        { type: 'app-ui', mode: 'full', pattern: 'src/components/ui/**' },
        { type: 'template', mode: 'full', pattern: 'src/components/layout/**' },
        { type: 'page', mode: 'full', pattern: 'src/pages/**' },
      ],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'atom', allow: ['token'] },
            { from: 'molecule', allow: ['token', 'atom', 'molecule'] },
            { from: 'feedback', allow: ['token', 'atom'] },
            { from: 'ds-barrel', allow: ['token', 'atom', 'molecule', 'feedback'] },
            {
              from: 'app-ui',
              allow: ['token', 'atom', 'molecule', 'feedback', 'ds-barrel', 'app-ui'],
            },
            {
              from: 'organism',
              allow: ['token', 'atom', 'molecule', 'feedback', 'ds-barrel', 'app-ui', 'organism'],
            },
            {
              from: 'template',
              allow: [
                'token',
                'atom',
                'molecule',
                'feedback',
                'ds-barrel',
                'app-ui',
                'organism',
                'template',
              ],
            },
            {
              from: 'page',
              allow: [
                'token',
                'atom',
                'molecule',
                'feedback',
                'ds-barrel',
                'app-ui',
                'organism',
                'template',
                'page',
              ],
            },
          ],
        },
      ],
    },
  },
])
