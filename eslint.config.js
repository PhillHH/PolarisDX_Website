import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // AP24 PT24.6 (`A11Y-11`): `_project-knowledge/` ist ein eingecheckter
  // Schnappschuss des Alt-Codes VOR dem Relaunch. Er wird nirgends importiert,
  // nirgends gebaut und nie ausgeliefert — `grep` ueber `src/`, `server.ts`
  // und `index.html` findet null Referenzen. Trotzdem lief `eslint .` darueber
  // und meldete 114 Fehler, davon 3 aus `jsx-a11y`. Ein Gate, das ueber
  // Archivcode rot ist, sagt nichts ueber die ausgelieferte Anwendung und
  // verdeckt echte Befunde.
  //
  // Das ist AUSDRUECKLICH keine abgeschaltete Regel: `jsx-a11y` bleibt fuer
  // jede Datei aktiv, die wirklich ausgeliefert wird. Eingegrenzt wird der
  // Geltungsbereich, nicht der Anspruch.
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
    rules: {
      // AP27 PT27.6: `buttonVariants` und `textareaVariants` sind dokumentierte oeffentliche API der
      // Design-System-Schicht (DESIGN-SYSTEM-CHANGELOG, `check:ds-changelog` zaehlt sie). Genau diese
      // zwei Namen duerfen neben der Komponente exportiert werden; die Regel bleibt fuer alles
      // andere ein Fehler.
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true, allowExportNames: ['buttonVariants', 'textareaVariants'] },
      ],
    },
    // eslint-plugin-import kennt ohne diesen Resolver keine .ts/.tsx-Endungen
    // und meldete repo-weit falsche `import/no-unresolved`-Fehler.
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: './tsconfig.app.json' },
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
    },
  },
])
