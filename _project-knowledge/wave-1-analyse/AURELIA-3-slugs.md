## Aktive Slugs (nicht auskommentiert)
| Slug | Schreibweise | Konsistent? |
|---|---|---|
| `/` | root | — |
| `/about` | kebab | ja |
| `/articles` | kebab | ja |
| `/articles/:slug` | kebab (dynamisch) | ja |
| `/contact` | kebab | ja |
| `/diagnostics` | kebab | ja |
| `/diagnostics/:slug` | kebab (dynamisch) | ja |
| `/downloads` | kebab | ja |
| `/events` | kebab | ja |
| `/igloo-pro` | kebab | ja |
| `/imprint` | kebab | ja |
| `/privacy` | kebab | ja |
| `/s3_leitlinie` | **underscore** | **nein** |
| `/services` | kebab (redirect) | ja |
| `/services/:slug` | kebab (redirect) | ja |
| `/support` | kebab | ja |
| `/terms` | kebab | ja |
| `/vitamin-d3-implantologie` | kebab | ja |
| `/vitamin-d3-spray` | kebab | ja |
| `*` | catch-all | — |

## Auskommentierte Slugs
- `/casestudys/32reasons` — falscher Plural (casestudys statt casestudies), nur in App.tsx
- `/shop` — nur in App.tsx
- `/shop/:slug` — nur in App.tsx

## Global gemountete Komponenten
| Komponente | App.tsx | App.lazy.tsx | Identisch? |
|---|---|---|---|
| MobileCallButton | Z.37 (eager) | Z.92 (eager) | ja |
| ChatWidget | Z.38 (eager) | Z.93 (eager) | ja |
| CookieBanner | Z.69 (eager) | Z.242 (eager) | ja |

Reihenfolge im JSX-Tree ist in beiden Files identisch: MobileCallButton → ChatWidget → Routes → CookieBanner.
