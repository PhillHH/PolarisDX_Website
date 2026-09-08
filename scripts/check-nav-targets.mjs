#!/usr/bin/env node
/**
 * Compatibility entrypoint only. The authoritative navigation-target check is
 * the --nav-only subset of G1 Route Registry Parity. package.json invokes G1
 * directly; this file intentionally contains no route parsing or path table.
 */

console.error('Use npm run check:nav-targets (G1 Route Registry navigation subset).')
process.exit(1)
