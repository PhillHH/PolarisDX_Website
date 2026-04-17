# JANITOR – Skripte-Inventar

## Python-Skripte im Root
| File | LOC | Erste Zeile (Zweck) |
|---|---|---|
| generate_agb.py | 251 | `import re` — AGB-Text → TS-Datei |
| resize_images.py | 32 | `from PIL import Image` — Bilder skalieren |
| update_about.py | 137 | `import json` — About-i18n in locales schreiben |
| update_common.py | 267 | `import json` — Common-i18n in locales schreiben |
| update_home.py | 209 | `import json` — Home-i18n in locales schreiben |
| update_services_json.py | 35 | `import json` — Services-i18n (unvollständig, endet mit `pass`) |
| verify_casestudy.py | 35 | `from playwright.sync_api` — Screenshot Casestudy |
| verify_footer_clean.py | 42 | `from playwright.async_api` — Screenshot Footer |
| verify_visuals.py | 76 | `from playwright.sync_api` — Screenshots diverse |

## CJS-Skripte im Root
| File | LOC | Erste Zeile (Zweck) |
|---|---|---|
| find_48.cjs | 21 | `const fs = require('fs')` — "48" in locales suchen |
| update_nav_translations.cjs | 35 | `const fs = require('fs')` — Nav-Events in locales patchen |
| update_translations.cjs | 137 | `const fs = require('fs')` — "48h"→"3-5 Werktage" ersetzen |

## Vitd3_Mail/ Inhalt
- Dockerfile
- config.py
- docker-compose.yml
- kontakte.xlsx
- requirements.txt
- send_emails.py
- vitamin-d3-k2-spray.html

## Verify-/Find-Skripte
| File | LOC |
|---|---|
| find_48.cjs | 21 |
| verify_casestudy.py | 35 |
| verify_changes.spec.ts | 61 |
| verify_footer_clean.py | 42 |
| verify_visuals.py | 76 |
