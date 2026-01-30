#!/usr/bin/env node
/**
 * Pre-Rendering Script for Vite React SPA
 *
 * Uses Playwright to render all routes after build and saves static HTML.
 * This enables Google to see fully rendered content instead of empty <div id="root"></div>
 *
 * PREREQUISITES:
 * 1. Run: npx playwright install chromium
 * 2. Build the project first: npm run build
 *
 * USAGE:
 * - Standalone: node scripts/prerender.mjs
 * - With build: npm run build:prerender
 *
 * CI/CD USAGE (GitHub Actions):
 * ```yaml
 * - uses: actions/setup-node@v4
 * - run: npm ci
 * - run: npx playwright install chromium
 * - run: npm run build:prerender
 * ```
 *
 * ALTERNATIVE (No local Playwright):
 * Use Prerender.io or similar cloud service for production pre-rendering.
 */

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

// =============================================================================
// ALL ROUTES TO PRE-RENDER
// =============================================================================

const ROUTES = [
  // Static routes
  '/',
  '/about',
  '/articles',
  '/services',
  '/contact',
  '/privacy',
  '/imprint',
  '/terms',
  '/events',
  '/igloo-pro',
  '/casestudys/32reasons',
  '/downloads',

  // Article routes (from articles.json)
  '/articles/green_practice',
  '/articles/invisible_patient',
  '/articles/five_minute_diagnosis',
  '/articles/ecosystem_of_rapid_tests',
  '/articles/rapid_setup_formula',
  '/articles/precision_point_of_care',
  '/articles/first_checkup',
  '/articles/managing_diabetes',
  '/articles/home_care',

  // Service routes (from services.json)
  '/services/dental',
  '/services/beauty',
  '/services/longevity',
  '/services/poc_systemloesungen',
  '/services/praeventions_checks',
  '/services/infektion_entzuendung',
  '/services/stoffwechsel_herz',
  '/services/hormon_tests',
  '/services/kompatibilitaet_integration',
];

// =============================================================================
// HELPERS
// =============================================================================

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

function log(message, type = 'info') {
  const prefix = {
    info: `${colors.cyan}[INFO]${colors.reset}`,
    success: `${colors.green}[OK]${colors.reset}`,
    error: `${colors.red}[ERROR]${colors.reset}`,
    warn: `${colors.yellow}[WARN]${colors.reset}`,
  };
  console.log(`${prefix[type]} ${message}`);
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getOutputPath(route) {
  if (route === '/') {
    return path.join(DIST_DIR, 'index.html');
  }
  return path.join(DIST_DIR, route, 'index.html');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch {
      // Server not ready yet
    }
    await sleep(500);
  }
  return false;
}

// =============================================================================
// MAIN PRERENDER LOGIC
// =============================================================================

async function prerender() {
  console.log('\n' + '='.repeat(50));
  console.log('  PRE-RENDERING VITE REACT SPA');
  console.log('='.repeat(50) + '\n');

  // Check dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    log('dist/ directory not found. Run "npm run build" first.', 'error');
    process.exit(1);
  }

  log(`Found ${ROUTES.length} routes to pre-render`);

  // Start vite preview server
  log('Starting Vite preview server...');
  const serverProcess = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--host'], {
    cwd: ROOT_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  // Wait for server to be ready
  const serverReady = await waitForServer(BASE_URL);
  if (!serverReady) {
    log('Failed to start preview server', 'error');
    serverProcess.kill();
    process.exit(1);
  }
  log('Preview server started on ' + BASE_URL);

  // Launch browser
  log('Launching Playwright browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  });

  let successCount = 0;
  let errorCount = 0;

  console.log('\n' + '-'.repeat(50) + '\n');

  for (const route of ROUTES) {
    const page = await context.newPage();
    const url = BASE_URL + route;
    const outputPath = getOutputPath(route);

    try {
      // Navigate and wait for content
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for React to render content in #root
      await page.waitForSelector('#root > *', { timeout: 10000 });

      // Wait for react-helmet-async to update <head>
      await sleep(800);

      // Get rendered HTML
      let html = await page.content();

      // Ensure output directory exists
      ensureDir(outputPath);

      // Write HTML file
      fs.writeFileSync(outputPath, html, 'utf-8');

      const relativePath = path.relative(ROOT_DIR, outputPath);
      log(`${route} -> ${relativePath}`, 'success');
      successCount++;

    } catch (error) {
      log(`${route}: ${error.message}`, 'error');
      errorCount++;
    } finally {
      await page.close();
    }
  }

  // Cleanup
  await browser.close();
  serverProcess.kill('SIGTERM');

  // Summary
  console.log('\n' + '='.repeat(50));
  log(`Pre-rendering complete!`, 'success');
  log(`Success: ${successCount}/${ROUTES.length}`);
  if (errorCount > 0) {
    log(`Errors: ${errorCount}`, 'warn');
  }
  console.log('='.repeat(50) + '\n');

  // Verification
  const indexPath = path.join(DIST_DIR, 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');

  // Check if index.html has actual content (not just empty root)
  const hasContent = !indexHtml.includes('<div id="root"></div>') &&
                     indexHtml.includes('<div id="root">');
  const hasTitle = indexHtml.includes('<title>') &&
                   !indexHtml.includes('<title></title>');

  if (hasContent && hasTitle) {
    log('Verification: HTML contains pre-rendered content', 'success');
  } else {
    log('Warning: HTML may not be properly pre-rendered', 'warn');
  }

  process.exit(errorCount > 0 ? 1 : 0);
}

// Run
prerender().catch(error => {
  log(`Fatal error: ${error.message}`, 'error');
  process.exit(1);
});
