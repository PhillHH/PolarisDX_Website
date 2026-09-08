import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// `import.meta.dirname` gibt es erst ab Node 20.11; unter Node 18 war es
// `undefined` und dieses Skript brach beim Laden ab — es konnte hier also nie
// laufen. Die URL-Variante funktioniert auf beiden.
const root = fileURLToPath(new URL('..', import.meta.url))
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']
const canonicalClaim = 'CV < 2 %'
const staleClaimPattern = /(?:CV\s*)?<\s*5\s*%|CV\s*<\s*5(?:\b|\s)/giu

export function staleIglooClaimFindings(value) {
  return [...value.matchAll(staleClaimPattern)].map((match) => match[0])
}

function json(path) {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'))
}

function filesBelow(path) {
  const absolute = resolve(root, path)
  return readdirSync(absolute).flatMap((name) => {
    const child = resolve(absolute, name)
    return statSync(child).isDirectory() ? filesBelow(child) : [child]
  })
}

const errors = []
const localeRows = locales.map((locale) => {
  const products = json(`public/locales/${locale}/products.json`)
  const home = json(`public/locales/${locale}/home.json`)
  if (products.specification?.value !== canonicalClaim) {
    errors.push(`${locale}: product specification claim is not canonical`)
  }
  if (!products.specification?.context || !products.specification?.description) {
    errors.push(`${locale}: product specification context is incomplete`)
  }
  if (home.trustbar?.cv !== `IglooPro · ${canonicalClaim}`) {
    errors.push(`${locale}: Homepage claim lacks the locked product context`)
  }
  if (/CV\s*<|3[–-]15|600\s*g|HbA1c|TSH|CRP|immuno/iu.test(products.seo?.description ?? '')) {
    errors.push(`${locale}: active product SEO amplifies an unverified specification`)
  }
  return { locale, product: products.specification.value, homepage: home.trustbar.cv }
})

const productiveClaimOccurrences = localeRows.length * 2
const staleFiles = [...filesBelow('src'), ...filesBelow('public/locales')]
  .filter((path) => /\.(?:[cm]?[jt]sx?|json|html|md)$/u.test(path))
  .flatMap((path) => {
    const findings = staleIglooClaimFindings(readFileSync(path, 'utf8'))
    return findings.length ? [{ path: path.slice(root.length + 1), findings }] : []
  })
if (staleFiles.length)
  errors.push(`productive/source stale <5 findings: ${JSON.stringify(staleFiles)}`)

const selfTestFindings = staleIglooClaimFindings('IglooPro technical claim: CV < 5 %')
if (selfTestFindings.length !== 1)
  errors.push('stale-claim hard-failure self-test did not detect fixture')

// AP19 PT19.5: der Legacy-Katalog ist entfallen. Die AP14-Invariante bleibt
// dieselbe und wird jetzt an der kanonischen Wahrheit geprueft — der Flyer ist
// NOT_LAUNCH_VISIBLE und hat keinen produktiven Link.
const registry = json('server/resource-registry.json')
const iglooAssets = registry.assets.filter((asset) =>
  asset.variants.some((variant) => /igloo/i.test(variant.path)),
)
if (iglooAssets.length !== 1) errors.push('IglooPro flyer is not exactly one inventory asset')
if (iglooAssets.some((asset) => asset.deliveryClass !== 'NOT_LAUNCH_VISIBLE')) {
  errors.push('owner-bound IglooPro flyer remains productively linked')
}
if (iglooAssets.some((asset) => asset.lifecycle === 'ACTIVE_VISIBLE')) {
  errors.push('owner-bound IglooPro flyer is launch-visible')
}

const flyerPath = resolve(root, 'public/downloads/igloo-pro-flyer.pdf')
const flyerHash = existsSync(flyerPath)
  ? createHash('sha256').update(readFileSync(flyerPath)).digest('hex')
  : null
const expectedFlyerHash = 'ae726928cf750b21df3d409469df97c5f5e55cd11a0b25c938fda680b24a8f7b'
if (flyerHash !== expectedFlyerHash) errors.push('owner-bound flyer inventory hash changed')

const pageSource = readFileSync(resolve(root, 'src/pages/IglooProPage.tsx'), 'utf8')
if (!pageSource.includes('<IglooSpecsSection />'))
  errors.push('claim-safe specification is not composed')

const result = {
  locales: localeRows.length,
  productiveClaimOccurrences,
  staleProductiveFindings: staleFiles.length,
  linkedIglooDownloads: iglooAssets.filter((asset) => asset.deliveryClass !== 'NOT_LAUNCH_VISIBLE')
    .length,
  ownerBoundFlyer: { present: Boolean(flyerHash), sha256: flyerHash },
  hardFailureSelfTest: selfTestFindings.length === 1 ? 'PASS' : 'FAIL',
  errors,
}

console.log(JSON.stringify(result, null, 2))
if (errors.length) process.exitCode = 1
