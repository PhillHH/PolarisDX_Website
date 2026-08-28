#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateSitemapArtifact } from '../src/components/seo/sitemapGuard'
import { generateSitemapXml, getSitemapRouteFamilies } from '../src/components/seo/sitemap'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const families = getSitemapRouteFamilies()
const xml = generateSitemapXml()

function assertSourceEvidence(): void {
  const appSource = fs.readFileSync(path.join(repositoryRoot, 'src/App.tsx'), 'utf8')
  for (const family of families.filter(
    (candidate) => candidate.kind !== 'service' && candidate.kind !== 'article',
  )) {
    if (!appSource.includes(`path="${family.path}"`)) {
      throw new Error(`App route evidence missing for ${family.path}`)
    }
  }
  if (!appSource.includes('path="/diagnostics/:slug"')) {
    throw new Error('Dynamic service route evidence missing')
  }
  if (!appSource.includes('path="/articles/:slug"')) {
    throw new Error('Dynamic article route evidence missing')
  }

  const legalFiles = ['PrivacyPage.tsx', 'ImprintPage.tsx', 'TermsPage.tsx']
  for (const filename of legalFiles) {
    const source = fs.readFileSync(path.join(repositoryRoot, 'src/pages', filename), 'utf8')
    if (!source.includes('noindex={true}')) {
      throw new Error(`Legal noindex evidence missing in ${filename}`)
    }
  }
  const supportSource = fs.readFileSync(
    path.join(repositoryRoot, 'src/pages/SupportPage.tsx'),
    'utf8',
  )
  if (!appSource.includes('path="/support"') || supportSource.includes('noindex={true}')) {
    throw new Error('Support classification drifted from INDEXABLE_EXCLUDED_INTENTIONAL')
  }
}

function expectHardFailure(name: string, mutatedXml: string): void {
  try {
    validateSitemapArtifact(mutatedXml, families)
  } catch {
    return
  }
  throw new Error(`G3 hard-failure self-test did not reject: ${name}`)
}

function runHardFailureSelfTests(): void {
  const firstBlock = xml.match(/[ ]{2}<url>[^]*?[ ]{2}<\/url>\n/)?.[0]
  if (!firstBlock) throw new Error('Cannot construct G3 self-test fixtures')

  expectHardFailure('duplicate URL', xml.replace('</urlset>', `${firstBlock}</urlset>`))
  expectHardFailure(
    'missing locale / consumer locale',
    xml.replace(
      /[ ]{2}<url>\n[ ]{4}<loc>https:\/\/polarisdx\.net\/cs\/consumer\/vitamin-d3-spray<\/loc>[^]*?[ ]{2}<\/url>\n/,
      '',
    ),
  )
  expectHardFailure('404 URL', xml.replaceAll('/about', '/definitely-not-a-route'))
  expectHardFailure('noindex URL', xml.replaceAll('/about', '/privacy'))
  expectHardFailure('preview host', xml.replace(PUBLIC_ORIGIN, 'https://preview.polarisdx.net'))
  expectHardFailure('invalid XML', xml.replace('</urlset>', ''))

  const withoutLastmod = xml.replace(/[ ]{4}<lastmod>[^<]+<\/lastmod>\n/g, '')
  const fakeToday = withoutLastmod.replace(
    /[ ]{4}<changefreq>/g,
    '    <lastmod>2099-01-01</lastmod>\n    <changefreq>',
  )
  expectHardFailure('fake global lastmod', fakeToday)
}

const PUBLIC_ORIGIN = 'https://polarisdx.net'

assertSourceEvidence()
const result = validateSitemapArtifact(xml, families)
runHardFailureSelfTests()

console.log(
  `G3 SEO artifact coverage PASS: ${result.routeFamilyCount} families, ${result.urlCount} URLs, ${result.uniqueUrlCount} unique, ${result.lastmodCount} truthful lastmod entries; hard-failure self-tests PASS`,
)
