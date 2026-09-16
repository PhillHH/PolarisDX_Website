// PT25.1 — Routenmatrix der Performance-Baseline (Single Source fuer alle Messskripte).
// Jede Messung nennt Route, Locale, Environment, Tool, Device-Profil und Build/HEAD.
// `expect` ist die HTTP-Wahrheit: 200 fuer echte Seiten, 404 fuer die Fehlerseite.
export const ROUTES = [
  { id: 'home', label: 'Homepage', path: '/de/', expect: 200 },
  { id: 'diagnostics-hub', label: 'Diagnostics Hub', path: '/de/diagnostics', expect: 200 },
  {
    id: 'service-detail',
    label: 'Service Detail (Dental)',
    path: '/de/diagnostics/dental',
    expect: 200,
  },
  { id: 'igloo-pro', label: 'IglooPro', path: '/de/igloo-pro', expect: 200 },
  { id: 'epigenetics-hub', label: 'Epigenetics Hub', path: '/de/epigenetics', expect: 200 },
  {
    id: 'epigenetics-deep',
    label: 'Epigenetics Vertiefung (Grundlagen)',
    path: '/de/epigenetics/grundlagen',
    expect: 200,
  },
  {
    id: 'musterbefund',
    label: 'Musterbefund metabolic-health (chart-heavy)',
    path: '/de/epigenetics/musterbefund/metabolic-health',
    expect: 200,
  },
  { id: 'articles-index', label: 'Articles Index', path: '/de/articles', expect: 200 },
  {
    id: 'article-detail',
    label: 'Article Detail (die-gruene-praxis)',
    path: '/de/articles/die-gruene-praxis',
    expect: 200,
  },
  { id: 'events', label: 'Events', path: '/de/events', expect: 200 },
  { id: 'downloads', label: 'Downloads', path: '/de/downloads', expect: 200 },
  { id: 'contact', label: 'Contact', path: '/de/contact', expect: 200 },
  {
    id: 'consumer-d3',
    label: 'Consumer Vitamin D3 Spray',
    path: '/de/consumer/vitamin-d3-spray',
    expect: 200,
  },
  {
    id: 'consumer-duo',
    label: 'Consumer Inside-Out Duo',
    path: '/de/consumer/inside-out-duo',
    expect: 200,
  },
  { id: 'not-found', label: '404', path: '/de/pt25-baseline-gibt-es-nicht', expect: 404 },
  { id: 'home-en', label: 'Homepage (en)', path: '/en/', expect: 200 },
  { id: 'home-pl', label: 'Homepage (pl, lange Locale)', path: '/pl/', expect: 200 },
  {
    id: 'musterbefund-pl',
    label: 'Musterbefund metabolic-health (pl)',
    path: '/pl/epigenetics/musterbefund/metabolic-health',
    expect: 200,
  },
]

export const byId = (id) => ROUTES.find((r) => r.id === id)
