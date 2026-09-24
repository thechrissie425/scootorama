#!/usr/bin/env node
/* global process, console */
/**
 * Fails if tracked files mention the brand this project was derived from,
 * its product names, game worlds, partners or account identifiers.
 *
 *   npm run check:brand
 *
 * Runs in the pre-commit hook and in CI. Scans every tracked file (text
 * only) via `git grep`, so it is fast and ignores node_modules and builds.
 */
import { execFileSync } from 'node:child_process'

const DENYLIST = [
  'zwift',
  'watopia',
  'makuri',
  'kickr',
  'wahoo',
  // Former Sanity project ID and Figma library keys
  'q2h7gbxx',
  'VK2gqINzb4AQKiVWcmAsK7',
  'kaLl77FrF2NMHnUwH7QEqM',
  'OFczbi3AlUUxoobuMJnzd3',
  'dev-dmz',
]

const SELF = 'scripts/check-brand-leaks.mjs'

let output = ''
try {
  output = execFileSync(
    'git',
    [
      'grep',
      '-n',
      '-I', // skip binary files
      '-i',
      '-E',
      DENYLIST.join('|'),
      '--',
      '.',
      `:!${SELF}`,
    ],
    { encoding: 'utf8' }
  )
} catch (err) {
  // git grep exits 1 when nothing matches
  if (err.status === 1) {
    console.log('✅ No brand leaks found.')
    process.exit(0)
  }
  throw err
}

const lines = output.trim().split('\n')
console.error(`❌ Found ${lines.length} brand leak(s):\n`)
for (const line of lines) console.error(`  ${line.slice(0, 200)}`)
console.error(
  '\nReplace these with Scootorama equivalents (see lib/brand.ts and lib/worlds.ts).'
)
process.exit(1)
