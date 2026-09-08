import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n'
import { BEFUND_ORDER, BEFUND_PANEL_NAMES, RADAR_VALUES, type BefundSlug } from './meta'

export const BEFUND_BLOCK_TYPES = [
  'cover',
  'principle',
  'callout',
  'resultTable',
  'evaluations',
  'markers',
  'table',
  'summary',
  'contact',
  'ageDots',
  'radar',
  'bigResult',
  'trend',
  'science',
] as const

export type BefundBlockType = (typeof BEFUND_BLOCK_TYPES)[number]

interface BlockBase {
  id: string
  [key: string]: unknown
}

type BlockShape<T extends BefundBlockType, Required extends string> = BlockBase & {
  type: T
} & Record<Required, unknown>

export type BefundBlock =
  | BlockShape<'cover', 'badge' | 'panel' | 'subtitle' | 'claim' | 'meta' | 'benefit'>
  | BlockShape<'principle', 'caption' | 'title' | 'lead' | 'cards'>
  | BlockShape<'callout', 'title' | 'tone'>
  | BlockShape<'resultTable', 'caption' | 'title' | 'cols' | 'rows'>
  | BlockShape<'evaluations', 'caption' | 'title' | 'lead' | 'items'>
  | BlockShape<'markers', 'caption' | 'title' | 'items'>
  | BlockShape<'table', 'caption' | 'title' | 'cols' | 'rows'>
  | BlockShape<
      'summary',
      'caption' | 'title' | 'lead' | 'focuses' | 'controlTitle' | 'controlItems'
    >
  | BlockShape<'contact', 'title' | 'text' | 'columns' | 'legal' | 'copyright'>
  | BlockShape<'ageDots', 'caption' | 'title' | 'chronological' | 'min' | 'max' | 'unit' | 'items'>
  | BlockShape<'radar', 'caption' | 'title' | 'lead' | 'axes' | 'scores' | 'note'>
  | BlockShape<
      'bigResult',
      'caption' | 'title' | 'display' | 'sub' | 'kind' | 'value' | 'tone' | 'text'
    >
  | BlockShape<
      'trend',
      'caption' | 'title' | 'lead' | 'firstLabel' | 'secondLabel' | 'kind' | 'items'
    >
  | BlockShape<'science', 'caption' | 'title' | 'lead' | 'items' | 'note'>

export interface Befund {
  slug: BefundSlug
  panel: string
  /** Vom Cover abgeleitete, validierte Dokument-Metadaten. */
  title: string
  introduction: string
  blocks: BefundBlock[]
}

export type BefundSprachen = Record<SupportedLanguage, Befund>

export class BefundValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BefundValidationError'
  }
}

const REQUIRED_STRINGS: Readonly<Record<BefundBlockType, readonly string[]>> = {
  cover: ['id', 'badge', 'panel', 'subtitle', 'claim', 'benefit'],
  principle: ['id', 'caption', 'title', 'lead'],
  callout: ['id', 'title', 'tone'],
  resultTable: ['id', 'caption', 'title'],
  evaluations: ['id', 'caption', 'title', 'lead'],
  markers: ['id', 'caption', 'title'],
  table: ['id', 'caption', 'title'],
  summary: ['id', 'caption', 'title', 'lead', 'controlTitle'],
  contact: ['id', 'title', 'text', 'copyright'],
  ageDots: ['id', 'caption', 'title', 'unit'],
  radar: ['id', 'caption', 'title', 'lead', 'note'],
  bigResult: ['id', 'caption', 'title', 'display', 'sub', 'kind', 'tone', 'text'],
  trend: ['id', 'caption', 'title', 'lead', 'firstLabel', 'secondLabel', 'kind'],
  science: ['id', 'caption', 'title', 'lead', 'note'],
}

const REQUIRED_ARRAYS: Readonly<Partial<Record<BefundBlockType, readonly string[]>>> = {
  cover: ['meta'],
  principle: ['cards'],
  resultTable: ['cols', 'rows'],
  evaluations: ['items'],
  markers: ['items'],
  table: ['cols', 'rows'],
  summary: ['focuses', 'controlItems'],
  contact: ['columns', 'legal'],
  ageDots: ['items'],
  radar: ['axes', 'scores'],
  trend: ['items'],
  science: ['items'],
}

function fail(where: string, detail: string): never {
  throw new BefundValidationError(`${where}: ${detail}`)
}

const recordAt = (value: unknown, where: string): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(where, 'expected object')
  return value as Record<string, unknown>
}

const nonEmptyString = (value: unknown, where: string): string => {
  if (typeof value !== 'string' || value.trim() === '') fail(where, 'expected non-empty string')
  return value
}

const nonEmptyArray = (value: unknown, where: string): unknown[] => {
  if (!Array.isArray(value) || value.length === 0) fail(where, 'expected non-empty array')
  return value
}

const validateFiniteNumbers = (value: unknown, where: string): void => {
  if (typeof value === 'number' && !Number.isFinite(value)) fail(where, 'number must be finite')
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateFiniteNumbers(item, `${where}[${index}]`))
  } else if (value && typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([key, item]) =>
      validateFiniteNumbers(item, `${where}.${key}`),
    )
  }
}

const validateTableDimensions = (block: Record<string, unknown>, where: string): void => {
  if (!Array.isArray(block.cols) || !Array.isArray(block.rows)) return
  const width = block.cols.length
  block.rows.forEach((rawRow, index) => {
    const row = Array.isArray(rawRow) ? rawRow : recordAt(rawRow, `${where}.rows[${index}]`).cells
    if (!Array.isArray(row) || row.length !== width) {
      fail(`${where}.rows[${index}]`, `expected ${width} cells`)
    }
  })
}

const validateBlock = (raw: unknown, slug: BefundSlug, index: number): BefundBlock => {
  const where = `${slug}.blocks[${index}]`
  const block = recordAt(raw, where)
  const type = block.type
  if (typeof type !== 'string' || !BEFUND_BLOCK_TYPES.includes(type as BefundBlockType)) {
    fail(`${where}.type`, `unknown block type ${String(type)}`)
  }
  const blockType = type as BefundBlockType
  REQUIRED_STRINGS[blockType].forEach((field) => nonEmptyString(block[field], `${where}.${field}`))
  REQUIRED_ARRAYS[blockType]?.forEach((field) => nonEmptyArray(block[field], `${where}.${field}`))
  validateFiniteNumbers(block, where)
  validateTableDimensions(block, where)

  if (blockType === 'radar') {
    const axes = nonEmptyArray(block.axes, `${where}.axes`)
    const vectors = RADAR_VALUES[slug]
    if (!vectors) fail(where, 'radar block has no canonical vector source')
    if (axes.length !== vectors.profile.length) {
      fail(`${where}.axes`, `expected ${vectors.profile.length} labels, got ${axes.length}`)
    }
    if (vectors.reference && vectors.reference.length !== axes.length) {
      fail(`${where}.axes`, 'reference vector dimension differs from labels')
    }
  }

  return block as BefundBlock
}

export const validateBefund = (
  raw: unknown,
  expectedSlug: BefundSlug,
  locale: SupportedLanguage,
): Befund => {
  const where = `${expectedSlug}.${locale}`
  const document = recordAt(raw, where)
  if (document.slug !== expectedSlug) fail(`${where}.slug`, `expected ${expectedSlug}`)
  const panel = nonEmptyString(document.panel, `${where}.panel`)
  if (!BEFUND_PANEL_NAMES[expectedSlug].includes(panel)) {
    fail(`${where}.panel`, `unexpected panel name ${panel}`)
  }
  const rawBlocks = nonEmptyArray(document.blocks, `${where}.blocks`)
  const blocks = rawBlocks.map((block, index) => validateBlock(block, expectedSlug, index))
  const ids = blocks.map((block) => block.id)
  if (new Set(ids).size !== ids.length) fail(`${where}.blocks`, 'duplicate block id')
  const cover = blocks.find((block) => block.type === 'cover')
  const principle = blocks.find((block) => block.type === 'principle')
  if (!cover || !principle) fail(`${where}.blocks`, 'cover and principle are required')

  return {
    slug: expectedSlug,
    panel,
    title: nonEmptyString(cover.panel, `${where}.cover.panel`),
    introduction: nonEmptyString(cover.claim, `${where}.cover.claim`),
    blocks,
  }
}

export const defineBefundFamily = (
  slug: BefundSlug,
  rawLocales: Record<SupportedLanguage, unknown>,
): BefundSprachen => {
  const actualLocales = Object.keys(rawLocales).sort()
  const expectedLocales = [...SUPPORTED_LANGUAGES].sort()
  if (actualLocales.join(',') !== expectedLocales.join(',')) {
    fail(slug, `locale set must be exactly ${expectedLocales.join(',')}`)
  }
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((locale) => [locale, validateBefund(rawLocales[locale], slug, locale)]),
  ) as BefundSprachen
}

export const validateBefundInventory = (families: readonly { slug: string }[]): void => {
  const slugs = families.map((family) => family.slug)
  if (new Set(slugs).size !== slugs.length) fail('inventory', 'duplicate slug')
  if (slugs.join(',') !== BEFUND_ORDER.join(',')) {
    fail('inventory', `expected ordered families ${BEFUND_ORDER.join(',')}`)
  }
}
