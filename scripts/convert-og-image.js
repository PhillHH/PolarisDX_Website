/**
 * OG Image Conversion Script
 *
 * This script converts the HTML template to a JPG image using Puppeteer.
 *
 * Prerequisites:
 *   npm install puppeteer
 *
 * Usage:
 *   node scripts/convert-og-image.js
 *
 * Output:
 *   public/og-image.jpg (1200x630, optimized)
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateOGImage() {
  const templatePath = path.join(__dirname, 'og-image-template.html');
  const outputPath = path.join(__dirname, '../public/og-image.jpg');

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport to exact OG image dimensions
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 1
  });

  console.log('Loading template...');
  await page.goto(`file://${templatePath}`, {
    waitUntil: 'networkidle0'
  });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');

  console.log('Capturing screenshot...');
  await page.screenshot({
    path: outputPath,
    type: 'jpeg',
    quality: 90,
    clip: {
      x: 0,
      y: 0,
      width: 1200,
      height: 630
    }
  });

  await browser.close();

  // Check file size
  const stats = fs.statSync(outputPath);
  const fileSizeKB = Math.round(stats.size / 1024);

  console.log(`\nOG Image generated successfully!`);
  console.log(`Output: ${outputPath}`);
  console.log(`Size: ${fileSizeKB} KB`);

  if (fileSizeKB > 300) {
    console.log(`\nWarning: File size exceeds 300KB. Consider reducing quality.`);
  } else {
    console.log(`File size is within optimal range (<300KB).`);
  }
}

generateOGImage().catch(console.error);
