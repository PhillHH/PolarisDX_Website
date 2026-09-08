import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { inflateSync } from 'node:zlib'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']
const panels = [
  'metabolic-health',
  'healthy-aging',
  'biologische-altersuhr',
  'telomer-analyse',
  'stress-monitor',
  'healthy-sport',
]

const requiredTextPaths = ['contact.note', 'compare.gendg', 'samples.note', 'basics.lead']
const forbiddenSchemaTypes = ['Product', 'Offer', 'MedicalTest', 'MedicalCondition']
const commercialFieldPattern =
  /["'](?:price|priceCurrency|availability|offers|rating|review)["']\s*:/iu
const currencyValuePattern =
  /(?:€|\b(?:EUR|USD|CHF)\b)\s*\d|\d(?:[.,]\d{2})?\s*(?:€|\b(?:EUR|USD|CHF)\b)/iu
const turnaroundPattern =
  /(?:befundlaufzeit|turnaround(?:\s+time)?|report\s+within\s+\d|result(?:s)?\s+within\s+\d|temps\s+de\s+rendu|tempo\s+di\s+refertazione|tiempo\s+de\s+entrega|prazo\s+de\s+entrega|doorlooptijd|doba\s+zpracov[aá]n[ií])/iu
const guaranteePattern =
  /(?:garant(?:iert|ie|eed|ito|ita|izado|ida|owany|owana|uje|eret)|guarantee(?:d|s)?)[^.\n]{0,90}(?:diagnos|therap|treat|cure|heil|prevent|outcome)/iu
const positiveCePattern =
  /(?:CE[- ](?:marked|gekennzeichnet|marqu[eé]|marcato|marcado|mærket|gemarkeerd)|IVDR[- ](?:compliant|konform))/iu
const negationPattern =
  /\b(?:not|no|none|without|kein(?:e|en|er|es)?|nicht|nie|ne\s+sont\s+pas|n['’]est\s+pas|non|não|ikke|geen|niet|nejsou|nen[ií])\b/iu
const examplePattern =
  /(?:beispiel|musterbefund|example|sample report|erfund|fict[íi]|fikcy|fiktiv|fittiz|ukázkov|przykład|przykładow|wzorcow|échantillon|exemple|rapport type|esempio|facsimile|muestra|ejemplo|informe modelo|exemplo|relatório modelo|eksempl|prøverapport|voorbeeld|voorbeeldrapport|příklad|vzorov)[\p{L}-]*/iu
const diagnosisPattern = /diagn[oó][\p{L}-]*/iu
const geneticsPattern = /(?:GenDG|Gendiagnostikgesetz|g[eé]n[eé]t[\p{L}-]*)/iu
const previewPattern = /preview\.polarisdx\.net|localhost|127\.0\.0\.1/iu
const legalEntityPattern =
  /[\p{Lu}][\p{L}&'’-]+(?:[ \t]+[\p{Lu}][\p{L}&'’-]+){0,5}[ \t]+(?:GmbH|AG|Ltd\.?|Limited|Inc\.?|LLC|S\.A\.?|S\.r\.l\.?|B\.V\.?)/gu
const partnerContextPattern =
  /(?:labor|partner|kooperation|cooperation|coopération|cooperazione|cooperación|cooperação|samarbejd|samenwerk|spoluprac)/iu
const approvedVisibleOrganizations = new Set(['Polaris Diagnostics Europe GmbH'])

function json(path) {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'))
}

function valueAt(value, path) {
  return path.split('.').reduce((current, segment) => current?.[segment], value)
}

function flattenStrings(value, path = '') {
  if (typeof value === 'string') return [{ path, value }]
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenStrings(item, `${path}[${index}]`))
  }
  if (!value || typeof value !== 'object') return []
  return Object.entries(value).flatMap(([key, item]) =>
    flattenStrings(item, path ? `${path}.${key}` : key),
  )
}

function filesBelow(path) {
  const absolute = resolve(root, path)
  return readdirSync(absolute).flatMap((name) => {
    const child = resolve(absolute, name)
    return statSync(child).isDirectory() ? filesBelow(child) : [child]
  })
}

function ascii85Decode(value) {
  const input = value.replace(/\s/gu, '').replace(/~>$/u, '')
  const bytes = []
  for (let index = 0; index < input.length; ) {
    if (input[index] === 'z') {
      bytes.push(0, 0, 0, 0)
      index += 1
      continue
    }
    const partial = input.slice(index, index + 5)
    index += 5
    const group = partial.padEnd(5, 'u')
    let encoded = 0
    for (const character of group) encoded = encoded * 85 + character.charCodeAt(0) - 33
    const decoded = [
      Math.floor(encoded / 16_777_216) & 255,
      Math.floor(encoded / 65_536) & 255,
      Math.floor(encoded / 256) & 255,
      encoded & 255,
    ]
    bytes.push(...decoded.slice(0, partial.length - 1))
  }
  return Buffer.from(bytes)
}

/**
 * The linked PDFs are current ReportLab files. The information sheets use
 * ASCII85 + Flate while the sample reports and the two supplementary documents
 * use direct Flate streams. This extracts their text operators for safety-pattern
 * review without pretending to reproduce typography or to be a general-purpose
 * PDF parser.
 */
function extractReportLabText(path) {
  const source = readFileSync(path).toString('latin1')
  const textStreams = []
  for (const match of source.matchAll(/stream\r?\n([\s\S]*?)endstream/gu)) {
    const candidates = [ascii85Decode(match[1]), Buffer.from(match[1], 'latin1')]
    for (const candidate of candidates) {
      try {
        const inflated = inflateSync(candidate).toString('latin1')
        if (/\bBT\b/u.test(inflated)) textStreams.push(inflated)
        break
      } catch {
        // Images, fonts and other streams need not be decodable text streams.
      }
    }
  }
  return textStreams.join('\n')
}

function sentencesWith(pattern, value) {
  return value
    .split(/(?<=[.!?])\s+|\n/gu)
    .filter((sentence) => pattern.test(sentence))
    .map((sentence) => sentence.trim())
}

function unapprovedPartnerOrganizations(value) {
  const organizations = sentencesWith(partnerContextPattern, value).flatMap(
    (sentence) => sentence.match(legalEntityPattern) ?? [],
  )
  return [...new Set(organizations)].filter(
    (organization) => !approvedVisibleOrganizations.has(organization),
  )
}

const errors = []
const localeRows = []
const requiredTextMatrix = Object.fromEntries(requiredTextPaths.map((path) => [path, new Set()]))
const linkedFiles = new Set()

for (const locale of locales) {
  const resource = json(`public/locales/${locale}/epigenetics.json`)
  const flattened = flattenStrings(resource)
  const fullText = flattened.map(({ value }) => value).join('\n')

  for (const path of requiredTextPaths) {
    const value = valueAt(resource, path)
    if (typeof value !== 'string' || !value.trim()) errors.push(`${locale}: missing ${path}`)
    else requiredTextMatrix[path].add(value.trim())
  }
  if (!/\bCE\b/u.test(valueAt(resource, 'contact.note') ?? '')) {
    errors.push(`${locale}: contact.note lacks the CE/service boundary`)
  }
  if (!geneticsPattern.test(valueAt(resource, 'compare.gendg') ?? '')) {
    errors.push(`${locale}: compare.gendg lacks the genetic-law context`)
  }
  if (!examplePattern.test(valueAt(resource, 'samples.note') ?? '')) {
    errors.push(`${locale}: samples.note lacks an example-data marker`)
  }
  if (!diagnosisPattern.test(valueAt(resource, 'basics.lead') ?? '')) {
    errors.push(`${locale}: basics.lead lacks the no-diagnosis boundary`)
  }
  if (valueAt(resource, '_translationStatus')) {
    errors.push(`${locale}: broad fallback marker remains in the productive namespace`)
  }

  const evidence = JSON.stringify(resource.evidence ?? {})
  for (const reference of ['Fitzgerald', 'Olivieri', 'Food4Me', '539']) {
    if (!evidence.includes(reference))
      errors.push(`${locale}: missing real evidence reference ${reference}`)
  }

  const unsafeCe = sentencesWith(positiveCePattern, fullText).filter(
    (sentence) => !negationPattern.test(sentence),
  )
  if (unsafeCe.length)
    errors.push(`${locale}: positive CE/IVDR classification: ${unsafeCe.join(' | ')}`)
  if (currencyValuePattern.test(fullText))
    errors.push(`${locale}: unresolved visible currency value`)
  if (turnaroundPattern.test(fullText)) errors.push(`${locale}: unresolved turnaround claim`)
  if (guaranteePattern.test(fullText))
    errors.push(`${locale}: diagnosis/treatment guarantee pattern`)
  if (previewPattern.test(fullText))
    errors.push(`${locale}: preview/dev host in productive content`)
  const organizations = unapprovedPartnerOrganizations(fullText)
  if (organizations.length) {
    errors.push(`${locale}: unapproved visible organization: ${organizations.join(', ')}`)
  }

  for (const { path, value } of flattened) {
    if (/(?:^|\.)(?:file|zipFile)$/u.test(path) && /\.(?:pdf|zip)$/iu.test(value)) {
      linkedFiles.add(value)
    }
  }

  localeRows.push({
    locale,
    requiredTexts: requiredTextPaths.length,
    evidenceReferences: 4,
    linkedAssets: flattened.filter(
      ({ path, value }) =>
        /(?:^|\.)(?:file|zipFile)$/u.test(path) && /\.(?:pdf|zip)$/iu.test(value),
    ).length,
  })
}

for (const [path, values] of Object.entries(requiredTextMatrix)) {
  if (values.size !== locales.length) {
    errors.push(
      `${path}: expected ten independently localized required texts, found ${values.size}`,
    )
  }
}

let reportCount = 0
for (const panel of panels) {
  for (const locale of locales) {
    const path = `src/content/befunde/${panel}.${locale}.json`
    const report = json(path)
    const reportText = JSON.stringify(report)
    const contact = report.blocks?.find(({ type }) => type === 'contact')
    const legalText = Array.isArray(contact?.legal)
      ? contact.legal.map(({ title, text }) => `${title ?? ''}\n${text ?? ''}`).join('\n')
      : ''
    reportCount += 1
    if (contact?.legal?.length !== 4) errors.push(`${path}: expected four visible legal notices`)
    if (!examplePattern.test(legalText)) errors.push(`${path}: missing example-data notice`)
    if (!diagnosisPattern.test(legalText)) errors.push(`${path}: missing no-diagnosis notice`)
    if (!/\bCE\b/u.test(legalText)) errors.push(`${path}: missing service/CE boundary`)
    if (!geneticsPattern.test(legalText)) errors.push(`${path}: missing genetics-law boundary`)
    const unsafeCe = sentencesWith(positiveCePattern, legalText).filter(
      (sentence) => !negationPattern.test(sentence),
    )
    if (unsafeCe.length) errors.push(`${path}: positive CE/IVDR classification`)
    if (currencyValuePattern.test(reportText)) errors.push(`${path}: unresolved currency value`)
    if (turnaroundPattern.test(reportText)) errors.push(`${path}: unresolved turnaround claim`)
    if (guaranteePattern.test(reportText))
      errors.push(`${path}: diagnosis/treatment guarantee pattern`)
    const organizations = unapprovedPartnerOrganizations(reportText)
    if (organizations.length) {
      errors.push(`${path}: unapproved visible organization: ${organizations.join(', ')}`)
    }
  }
}

const linkedAssetRows = [...linkedFiles].sort().map((file) => {
  const path = resolve(root, 'public/downloads/epigenetics', file)
  if (!existsSync(path)) errors.push(`missing linked asset: ${file}`)
  const type = file.toLowerCase().endsWith('.pdf') ? 'PDF' : 'ZIP'
  if (type === 'PDF' && existsSync(path)) {
    const extracted = extractReportLabText(path)
    if (extracted.trim()) {
      if (previewPattern.test(extracted)) errors.push(`${file}: preview/dev host in linked PDF`)
      if (currencyValuePattern.test(extracted))
        errors.push(`${file}: unresolved visible currency value`)
      if (guaranteePattern.test(extracted))
        errors.push(`${file}: diagnosis/treatment guarantee pattern`)
      const organizations = unapprovedPartnerOrganizations(extracted)
      if (organizations.length) {
        errors.push(`${file}: unapproved visible organization: ${organizations.join(', ')}`)
      }
      const unsafeCe = sentencesWith(positiveCePattern, extracted).filter(
        (sentence) => !negationPattern.test(sentence),
      )
      if (unsafeCe.length) errors.push(`${file}: positive CE/IVDR classification`)
    }
    return { file, type, exists: existsSync(path), textInspectable: Boolean(extracted.trim()) }
  }
  return { file, type, exists: existsSync(path), textInspectable: false }
})

const productiveSources = [
  ...filesBelow('src/pages').filter((path) => /(?:Epigenetics|Musterbefund).*\.tsx$/u.test(path)),
  ...filesBelow('src/components/epigenetics').filter((path) => /\.tsx?$/u.test(path)),
  resolve(root, 'src/components/sections/EpigeneticsPanels.tsx'),
]
const sourceText = productiveSources.map((path) => readFileSync(path, 'utf8')).join('\n')
for (const type of forbiddenSchemaTypes) {
  if (
    new RegExp(`articleType=['\"]${type}|['\"]@type['\"]\\s*:\\s*['\"]${type}`, 'u').test(
      sourceText,
    )
  ) {
    errors.push(`unsupported Epigenetics structured-data type: ${type}`)
  }
}
if (commercialFieldPattern.test(sourceText))
  errors.push('commercial structured-data field in Epigenetics')
if (previewPattern.test(sourceText)) errors.push('preview/dev host in Epigenetics source')

const selfTests = {
  medicalGuarantee: guaranteePattern.test('guaranteed diagnosis and treatment outcome'),
  ceMisclassification: sentencesWith(
    positiveCePattern,
    'The laboratory service is CE-marked.',
  ).some((sentence) => !negationPattern.test(sentence)),
  price: currencyValuePattern.test('Price: EUR 199'),
  turnaround: turnaroundPattern.test('Turnaround time: 48 hours'),
}
for (const [name, passed] of Object.entries(selfTests)) {
  if (!passed) errors.push(`${name}: negative hard-failure self-test failed`)
}

const result = {
  locales: localeRows.length,
  requiredTextMatrix: `${requiredTextPaths.length * locales.length}/${requiredTextPaths.length * locales.length}`,
  reports: reportCount,
  linkedAssets: linkedAssetRows.length,
  linkedPdfs: linkedAssetRows.filter(({ type }) => type === 'PDF').length,
  linkedZips: linkedAssetRows.filter(({ type }) => type === 'ZIP').length,
  textInspectablePdfs: linkedAssetRows.filter(
    ({ type, textInspectable }) => type === 'PDF' && textInspectable,
  ).length,
  unsubstantiatedHardClaimFindings: errors.filter((error) =>
    /guarantee|positive CE|currency|turnaround/u.test(error),
  ).length,
  schemaAmplificationFindings: errors.filter((error) => /structured-data/u.test(error)).length,
  unapprovedOrganizationFindings: errors.filter((error) =>
    /unapproved visible organization/u.test(error),
  ).length,
  selfTests,
  errors,
}

console.log(JSON.stringify(result, null, 2))
if (errors.length) process.exitCode = 1
