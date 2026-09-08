#!/usr/bin/env node
/**
 * LEGACY_NON_AUTHORITATIVE
 *
 * PolarisDX now serves production pages through the Express SSR runtime. The
 * former Playwright prerender catalogue duplicated application routes, omitted
 * locales and contained retired slugs, so it is deliberately disabled.
 *
 * Canonical route metadata lives in src/routing/routeRegistry.ts. Do not add a
 * path list here. If static export becomes a real deployment requirement, its
 * future implementation must consume the registry artifact rather than create
 * another route source.
 */

console.error(
  'Legacy prerender is disabled: production uses Express SSR and the central Route Registry.',
)
process.exit(1)
