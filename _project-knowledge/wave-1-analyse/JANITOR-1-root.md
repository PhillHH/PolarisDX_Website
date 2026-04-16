# JANITOR – Root-Inventar

## Root-Dateien
| Name | Größe (KB) | Vermutete Funktion (1-3 Worte) |
|---|---|---|
| .dockerignore | 1 | Docker-Ignore |
| .gitignore | 0.3 | Git-Ignore |
| .npmrc | 0.02 | npm-Config |
| AUDIT_I18N_ROUTING.md | 15 | i18n-Audit-Doku |
| CHAT_INTEGRATION.md | 3 | Chat-Doku |
| DOCS.md | 3 | Tech-Doku |
| Dockerfile | 2 | Docker-Build |
| Dockerfile.dev | 0.3 | Docker-Dev-Build |
| MISSING_TRANSLATIONS.md | 7 | i18n-Lückenliste |
| README.de.md | 7 | Readme-DE |
| README.md | 5 | Readme-EN |
| SEO_STRATEGY.md | 13 | SEO-Doku |
| about_desktop.png | 525 | Screenshot |
| deploy.sh | 3 | Deploy-Skript |
| docker-compose.yml | 1 | Compose-Config |
| downloads_page_de.png | 278 | Screenshot |
| error_screenshot.png | 436 | Screenshot |
| eslint.config.js | 0.6 | ESLint-Config |
| find_48.cjs | 0.6 | Debug-Skript |
| generate_agb.py | 26 | AGB-Generator |
| google0a5363efd12b6a30.html | 0.05 | Google-Verify |
| homepage_casestudy.png | 242 | Screenshot |
| igloo_desktop.png | 268 | Screenshot |
| image.png | 77 | Screenshot |
| index.html | 7 | Vite-Entry |
| mobile_testimonials.png | 83 | Screenshot |
| mobile_testimonials_de.png | 83 | Screenshot |
| mobile_top.png | 112 | Screenshot |
| mobile_top_de.png | 112 | Screenshot |
| nginx.conf | 1 | Nginx-Config |
| package-lock.json | 218 | npm-Lock |
| package.json | 2 | npm-Manifest |
| postcss.config.js | 0.08 | PostCSS-Config |
| resize_images.py | 1 | Bildgrößen-Skript |
| server.ts | 18 | SSR-Server |
| service_page_verification.png | 629 | Screenshot |
| stats_desktop.png | 980 | Screenshot |
| tailwind.config.js | 3 | Tailwind-Config |
| tsconfig.app.json | 0.9 | TS-Config |
| tsconfig.json | 0.2 | TS-Config |
| tsconfig.node.json | 0.6 | TS-Config |
| tsconfig.server.json | 0.9 | TS-Config |
| update_about.py | 16 | i18n-Updater |
| update_common.py | 18 | i18n-Updater |
| update_home.py | 53 | i18n-Updater |
| update_nav_translations.cjs | 1 | i18n-Updater |
| update_services_json.py | 2 | i18n-Updater |
| update_translations.cjs | 6 | i18n-Updater |
| vercel.json | 0.4 | Vercel-Config |
| verification_about_scrolled.png | 289 | Screenshot |
| verification_home_buttons.png | 770 | Screenshot |
| verification_igloo_hover.png | 208 | Screenshot |
| verification_igloo_overlap.png | 195 | Screenshot |
| verification_search_article.png | 234 | Screenshot |
| verification_search_frank.png | 216 | Screenshot |
| verify_casestudy.py | 1 | Playwright-Verify |
| verify_changes.spec.ts | 3 | Playwright-Spec |
| verify_footer_clean.py | 1 | Playwright-Verify |
| verify_visuals.py | 3 | Playwright-Verify |
| vite.config.ts | 4 | Vite-Config |

## Root-Ordner
| Name | Anzahl Files | Vermutete Funktion (1-3 Worte) |
|---|---|---|
| .claude | 1 | Claude-Config |
| .git | 37 | Git-Metadata |
| Vitd3_Mail | 10 | Mailversand-Tool |
| _project-knowledge | 100 | Projekt-Wissen |
| backend | 46 | Payload-CMS |
| docs | 8 | Doku-Files |
| email | 15 | Email-Templates |
| public | 130 | Static-Assets |
| scripts | 4 | Build-Skripte |
| server | 6 | Express-Mailer |
| src | 159 | Frontend-Source |
| test-results | 2 | Playwright-Output |
| translations | 10 | Legacy-i18n |

## Auffälligkeiten in einem Satz
18 PNG-Screenshots im Root (~5,3 MB), 7 Python-Skripte + 3 CJS-Skripte + 1 Playwright-Spec liegen lose im Root, 5 Markdown-Dokus im Root parallel zu `docs/`, der Ordner `translations/` existiert parallel zu `public/locales/`, und `test-results/` ist eingecheckt ohne .gitignore-Eintrag.
