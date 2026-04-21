# JANITOR – Klassifizierung & Empfehlung

## Klassifizierung Root-Dateien
| Typ | Anzahl | Aktion |
|---|---|---|
| Config-Files (.json, .ts, .js, .yml, .conf, .sh, .html) | 17 | KEEP |
| README.md, README.de.md | 2 | KEEP |
| PNGs (Screenshots) | 18 | DELETE (5,7 MB) |
| Python-Skripte (i18n-Updater, AGB, Resize) | 9 | MOVE → scripts/i18n/ |
| CJS-Skripte (i18n) | 3 | MOVE → scripts/i18n/ |
| Verify/Find-Skripte (.py, .spec.ts, .cjs) | 5 | MOVE → scripts/debug/ |
| Markdown-Doku (kein README) | 5 | MOVE → docs/ |

## Klassifizierung Root-Ordner
| Ordner | Aktion | Begründung (1 Satz) |
|---|---|---|
| translations/ | DELETE | Nicht importiert, vollständig durch public/locales/ ersetzt. |
| test-results/ | GITIGNORE + DELETE | Playwright-Output, gehört nicht ins Repo. |
| Vitd3_Mail/ | MOVE → eigenes Repo oder GITIGNORE | Enthält kontakte.xlsx (DSGVO-Risiko), ist separates Tool. |

## Geschätzte Repo-Verkleinerung
~6 MB sofort (5,7 MB PNGs + 91 KB translations/ + 16 KB test-results/ + ~130 KB Skripte), plus sauberes Root von 60 auf ~19 Dateien.
