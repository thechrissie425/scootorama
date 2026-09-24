#!/usr/bin/env tsx
/**
 * Syncs Figma Variables into design tokens.
 *
 * Requires FIGMA_ACCESS_TOKEN. The Variables REST API is Figma Enterprise only;
 * see docs/DESIGN_SYSTEM_WORKFLOW.md for the fallback path if it returns 403.
 *
 * Usage:
 *   npm run tokens:sync    Fetch Figma variables -> design-tokens/generated/figma.json
 *   npm run tokens:check   Report drift between Figma and tokens.json (exit 1 if drift)
 *
 * Add `-- --input <file>` to read a saved payload instead of calling Figma.
 * Two shapes are accepted:
 *   1. A Variables REST API response (`{ meta: { variables, variableCollections } }`)
 *   2. A flat `{ "Collection/Name": "value" }` map, as returned by the Figma
 *      Dev Mode MCP `get_variable_defs` tool. Use this when the REST API is
 *      unavailable; see docs/DESIGN_SYSTEM_WORKFLOW.md.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const MAPPING_PATH = resolve(ROOT, 'design-tokens/figma-mapping.json')
const TOKENS_PATH = resolve(ROOT, 'design-tokens/tokens.json')
const GENERATED_PATH = resolve(ROOT, 'design-tokens/generated/figma.json')

type FigmaValue =
  | { type: 'VARIABLE_ALIAS'; id: string }
  | { r: number; g: number; b: number; a: number }
  | number
  | string
  | boolean

interface FigmaVariable {
  id: string
  name: string
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'
  variableCollectionId: string
  valuesByMode: Record<string, FigmaValue>
}

interface FigmaCollection {
  id: string
  name: string
  defaultModeId: string
  modes: { modeId: string; name: string }[]
}

interface Mapping {
  fileKey: string
  collections: Record<string, { group: string; unit?: string }>
  prefixes: Record<string, { group?: string; unit?: string; ignore?: boolean }>
  aliases: Record<string, string>
  ignoreCollections: string[]
  ignoreVariables: string[]
}

type TokenTree = { [key: string]: TokenTree | { value: string } }

const DIMENSIONAL_GROUPS = new Set(['spacing', 'radius', 'stroke', 'size'])
const NON_DIMENSIONAL_LEAVES = new Set(['fontWeight', 'fontFamily'])

/** `0` and `0px` are the same value; don't report them as drift. */
function normalize(value: string): string {
  const v = value.trim().toUpperCase()
  return v === '0PX' ? '0' : v
}

const mapping: Mapping = JSON.parse(readFileSync(MAPPING_PATH, 'utf8'))

function camel(segment: string): string {
  const words = segment
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+|(?<=[a-z])(?=[A-Z])/)
    .filter(Boolean)
  if (words.length === 0) return segment
  return words
    .map((w, i) =>
      i === 0
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join('')
}

function toHex({
  r,
  g,
  b,
  a,
}: {
  r: number
  g: number
  b: number
  a: number
}): string {
  const c = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()
  const alpha = a < 1 ? c(a) : ''
  return `#${c(r)}${c(g)}${c(b)}${alpha}`
}

function setPath(tree: TokenTree, path: string[], value: string): void {
  let node = tree
  for (const key of path.slice(0, -1)) {
    if (!node[key] || 'value' in node[key]) node[key] = {} as TokenTree
    node = node[key] as TokenTree
  }
  node[path[path.length - 1]] = { value }
}

function flatten(tree: unknown, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  if (!tree || typeof tree !== 'object') return out
  for (const [key, child] of Object.entries(tree as Record<string, unknown>)) {
    if (key.startsWith('$')) continue
    const path = prefix ? `${prefix}.${key}` : key
    if (child && typeof child === 'object' && 'value' in child) {
      out[path] = String((child as { value: unknown }).value)
    } else {
      Object.assign(out, flatten(child, path))
    }
  }
  return out
}

interface FigmaMeta {
  variables: Record<string, FigmaVariable>
  variableCollections: Record<string, FigmaCollection>
}

/**
 * Converts the flat `{ "Name/Path": "value" }` map from Dev Mode into a token
 * tree. Values here are already resolved, so group and unit come from name
 * prefixes rather than collection metadata.
 */
function buildFromVarDefs(flat: Record<string, string>) {
  const tree: TokenTree = {}
  const unmapped = new Set<string>()

  for (const [name, raw] of Object.entries(flat)) {
    if (mapping.ignoreVariables.includes(name)) continue
    if (String(raw).startsWith('Font(')) continue // composite descriptor, not a value

    const override = mapping.aliases?.[name]
    let path: string[] | undefined
    let unit: string | undefined

    if (override) {
      path = override.split('.')
      unit = DIMENSIONAL_GROUPS.has(path[0]) ? 'px' : undefined
    } else {
      const prefix = Object.keys(mapping.prefixes ?? {})
        .filter(p => name.startsWith(p))
        .sort((a, b) => b.length - a.length)[0]

      if (prefix) {
        const config = mapping.prefixes[prefix]
        if (config.ignore) continue
        unit = config.unit
        const remainder = name.slice(prefix.length) || name
        // group may be a dotted path, e.g. "typography.fontFamily"
        path = [...config.group!.split('.'), ...remainder.split('/').map(camel)]
      } else if (String(raw).startsWith('#')) {
        path = ['color', ...name.split('/').map(camel)]
      } else {
        unmapped.add(name)
        continue
      }
    }

    const value = String(raw)
    const isNumeric = /^-?\d+(\.\d+)?$/.test(value)
    const leaf = path[path.length - 1]
    const dimensional = !NON_DIMENSIONAL_LEAVES.has(leaf)
    setPath(
      tree,
      path,
      value.startsWith('#')
        ? value.toUpperCase()
        : isNumeric && unit && dimensional
          ? `${value}${unit}`
          : value
    )
  }

  return { tree, unmapped: [...unmapped], multiMode: [] as string[] }
}

function isVarDefsShape(body: unknown): body is Record<string, string> {
  return (
    !!body &&
    typeof body === 'object' &&
    !('meta' in body) &&
    !('variables' in body) &&
    Object.values(body as object).every(v => typeof v === 'string')
  )
}

async function fetchFigmaVariables(): Promise<
  FigmaMeta | Record<string, string>
> {
  const inputFlag = process.argv.indexOf('--input')
  if (inputFlag !== -1) {
    const path = process.argv[inputFlag + 1]
    if (!path) throw new Error('--input requires a file path')
    const body = JSON.parse(readFileSync(resolve(path), 'utf8'))
    if (isVarDefsShape(body)) return body
    return (body.meta ?? body) as FigmaMeta
  }

  const token = process.env.FIGMA_ACCESS_TOKEN
  const fileKey = process.env.FIGMA_FILE_KEY || mapping.fileKey

  if (!token) {
    throw new Error(
      'FIGMA_ACCESS_TOKEN is not set. Create a personal access token with ' +
        '"file_variables:read" scope at figma.com/developers/api#access-tokens ' +
        'and add it to .env.local.'
    )
  }

  const res = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/variables/local`,
    { headers: { 'X-Figma-Token': token } }
  )

  if (res.status === 403) {
    throw new Error(
      'Figma returned 403. The Variables REST API requires a Figma Enterprise ' +
        'plan, or the token is missing the file_variables:read scope. ' +
        'See docs/DESIGN_SYSTEM_WORKFLOW.md for the fallback path.'
    )
  }
  if (!res.ok) {
    throw new Error(`Figma API ${res.status}: ${await res.text()}`)
  }

  const body = (await res.json()) as { meta: FigmaMeta }
  return body.meta
}

function buildTokenTree(meta: FigmaMeta) {
  const tree: TokenTree = {}
  const unmapped = new Set<string>()
  const multiMode: string[] = []
  const paths = new Map<string, string[]>()

  // First pass resolves every variable's token path so aliases can reference them.
  for (const variable of Object.values(meta.variables)) {
    const collection = meta.variableCollections[variable.variableCollectionId]
    if (!collection) continue
    const config = mapping.collections[collection.name]
    if (!config) continue
    const override = mapping.aliases?.[variable.name]
    paths.set(
      variable.id,
      override
        ? override.split('.')
        : [config.group, ...variable.name.split('/').map(camel)]
    )
  }

  for (const variable of Object.values(meta.variables)) {
    const collection = meta.variableCollections[variable.variableCollectionId]
    if (!collection) continue
    if (mapping.ignoreCollections.includes(collection.name)) continue
    if (mapping.ignoreVariables.includes(variable.name)) continue

    const config = mapping.collections[collection.name]
    if (!config) {
      unmapped.add(collection.name)
      continue
    }

    if (collection.modes.length > 1) {
      multiMode.push(`${collection.name} (${collection.modes.length} modes)`)
    }

    const raw = variable.valuesByMode[collection.defaultModeId]
    if (raw === undefined) continue

    let value: string
    if (typeof raw === 'object' && 'type' in raw) {
      const target = paths.get(raw.id)
      if (!target) continue
      value = `{${target.join('.')}}`
    } else if (variable.resolvedType === 'COLOR') {
      value = toHex(raw as { r: number; g: number; b: number; a: number })
    } else if (variable.resolvedType === 'FLOAT') {
      value = config.unit ? `${raw}${config.unit}` : String(raw)
    } else {
      value = String(raw)
    }

    setPath(tree, paths.get(variable.id)!, value)
  }

  return { tree, unmapped: [...unmapped], multiMode: [...new Set(multiMode)] }
}

function reportDrift(figma: TokenTree): number {
  const local = JSON.parse(readFileSync(TOKENS_PATH, 'utf8'))
  const figmaFlat = flatten(figma)
  const localFlat = flatten(local)

  const changed: string[] = []
  const missing: string[] = []

  for (const [path, value] of Object.entries(figmaFlat)) {
    if (!(path in localFlat)) {
      missing.push(`  + ${path} = ${value}`)
    } else if (normalize(localFlat[path]) !== normalize(value)) {
      changed.push(
        `  ~ ${path}: ${localFlat[path]} (local) -> ${value} (Figma)`
      )
    }
  }

  const orphaned = Object.keys(localFlat).filter(p => !(p in figmaFlat))

  console.log(`\nFigma variables mapped: ${Object.keys(figmaFlat).length}`)
  console.log(`Local tokens:           ${Object.keys(localFlat).length}`)

  if (changed.length) {
    console.log(`\n⚠️  ${changed.length} value(s) differ from Figma:`)
    console.log(changed.slice(0, 40).join('\n'))
    if (changed.length > 40) console.log(`  ...and ${changed.length - 40} more`)
  }
  if (missing.length) {
    console.log(`\n➕ ${missing.length} Figma variable(s) not in tokens.json:`)
    console.log(missing.slice(0, 40).join('\n'))
    if (missing.length > 40) console.log(`  ...and ${missing.length - 40} more`)
  }
  if (orphaned.length) {
    // Semantic tokens are authored locally by design, so these are informational.
    console.log(
      `\nℹ️  ${orphaned.length} local token(s) have no Figma counterpart (expected for semantic tokens).`
    )
  }
  if (!changed.length && !missing.length) {
    console.log('\n✅ No drift. tokens.json matches Figma.')
  }

  return changed.length + missing.length
}

async function main() {
  const mode = process.argv.includes('--check') ? 'check' : 'sync'
  const source = await fetchFigmaVariables()

  const isVarDefs = isVarDefsShape(source)
  const { tree, unmapped, multiMode } = isVarDefs
    ? buildFromVarDefs(source)
    : buildTokenTree(source)

  if (isVarDefs) {
    console.log('Source: flat variable definitions (Dev Mode export)')
  } else {
    console.log(
      `Collections found: ${Object.values(source.variableCollections)
        .map(c => c.name)
        .join(', ')}`
    )
  }
  if (unmapped.length) {
    const what = isVarDefs ? 'variables' : 'collections'
    console.log(
      `\n⚠️  Unmapped ${what} (add to design-tokens/figma-mapping.json): ${unmapped.join(', ')}`
    )
  }
  if (multiMode.length) {
    console.log(
      `\n⚠️  Multi-mode collections use the default mode only: ${multiMode.join(', ')}`
    )
  }

  if (mode === 'sync') {
    mkdirSync(dirname(GENERATED_PATH), { recursive: true })
    writeFileSync(GENERATED_PATH, JSON.stringify(tree, null, 2) + '\n')
    console.log(`\n✅ Wrote ${GENERATED_PATH}`)
    console.log('Review the diff, then promote values into tokens.json.')
  }

  const drift = reportDrift(tree)
  if (mode === 'check' && drift > 0) process.exit(1)
}

main().catch(err => {
  console.error(`\n❌ ${err.message}`)
  process.exit(1)
})
