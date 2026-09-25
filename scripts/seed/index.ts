#!/usr/bin/env node
/**
 * Seeds a Sanity dataset with Scootorama starter content.
 *
 *   npm run seed              create missing documents only (safe default)
 *   npm run seed -- --update  also refresh existing documents, except any
 *                             that hold images uploaded in the Studio
 *   npm run seed -- --force   overwrite every seed document (a full reset)
 *
 * Reads NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_API_TOKEN (Editor) from .env.local. Every document has a fixed _id,
 * so re-running never duplicates content. By default a document that
 * already exists is never modified, so edits made in the Studio (copy,
 * images, anything) survive. Images are uploaded from scripts/seed/images,
 * only when a document being written needs them, and tagged as seed assets
 * so --update can tell them apart from Studio uploads.
 */
import { createClient } from '@sanity/client'
import { createReadStream, existsSync } from 'node:fs'
import { join } from 'node:path'
import dotenv from 'dotenv'
import { buildDocuments, IMAGE_NAMES } from './content'
import {
  SEED_SOURCE,
  collectImageRefs,
  imagesUsedBy,
  placeholderIds,
  planSeed,
  type AssetInfo,
  type SeedDoc,
  type SeedMode,
} from './plan'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error(
    '❌ Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN (an Editor token) in .env.local'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-12-12',
  useCdn: false,
})

const IMAGE_DIR = join(process.cwd(), 'scripts', 'seed', 'images')
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp']

const args = new Set(process.argv.slice(2))
const mode: SeedMode = args.has('--force')
  ? 'force'
  : args.has('--update')
    ? 'update'
    : 'create'

/**
 * Find the file for an image name in scripts/seed/images, whatever its
 * format, so artwork can be swapped (e.g. a transparent PNG replacing a
 * JPG) without code changes. PNG wins if several exist.
 */
function resolveImageFile(name: string): string {
  const file = IMAGE_EXTENSIONS.map(ext => `${name}${ext}`).find(f =>
    existsSync(join(IMAGE_DIR, f))
  )
  if (!file) {
    throw new Error(
      `No image for "${name}" in scripts/seed/images (tried ${IMAGE_EXTENSIONS.join(', ')})`
    )
  }
  return file
}

async function main() {
  console.log(`🛴 Seeding ${projectId}/${dataset} (mode: ${mode})`)

  // 1. Work out what to write before uploading anything
  const drafts = buildDocuments(placeholderIds(IMAGE_NAMES)) as SeedDoc[]
  const existing = await client.fetch<SeedDoc[]>('*[_id in $ids]', {
    ids: drafts.map(d => d._id),
  })
  const refs = [...collectImageRefs(existing)]
  const assets = refs.length
    ? await client.fetch<AssetInfo[]>(
        '*[_id in $refs]{_id, originalFilename, "source": source.name}',
        { refs }
      )
    : []
  const seedFileNames = new Set(
    IMAGE_NAMES.flatMap(n => IMAGE_EXTENSIONS.map(ext => `${n}${ext}`))
  )
  const plan = planSeed({ docs: drafts, existing, assets, seedFileNames, mode })
  const toWrite = [...plan.create, ...plan.replace]

  // 2. Upload only the images those documents use
  const needed = imagesUsedBy(toWrite, IMAGE_NAMES)
  if (needed.length) console.log('Uploading images…')
  const assetIds: Record<string, string> = placeholderIds(IMAGE_NAMES)
  for (const name of needed) {
    const file = resolveImageFile(name)
    const asset = await client.assets.upload(
      'image',
      createReadStream(join(IMAGE_DIR, file)),
      { filename: file, source: { name: SEED_SOURCE, id: name } }
    )
    assetIds[name] = asset._id
    console.log(`  🖼  ${file}`)
  }

  // 3. Rebuild with real asset ids and write
  const writeIds = new Set(toWrite.map(d => d._id))
  const createIds = new Set(plan.create.map(d => d._id))
  const docs = (buildDocuments(assetIds) as SeedDoc[]).filter(d =>
    writeIds.has(d._id)
  )
  if (docs.length) {
    const tx = client.transaction()
    for (const doc of docs) {
      if (createIds.has(doc._id)) tx.createIfNotExists(doc as never)
      else tx.createOrReplace(doc as never)
    }
    await tx.commit()
  }

  const byType = (list: SeedDoc[]) =>
    Object.entries(
      list.reduce<Record<string, number>>((acc, d) => {
        acc[d._type] = (acc[d._type] || 0) + 1
        return acc
      }, {})
    )
      .map(([t, n]) => `${t} ${n}`)
      .join(', ')

  console.log(`\n✅ Created ${plan.create.length} new documents`)
  if (plan.create.length) console.log(`   ${byType(plan.create)}`)
  if (plan.replace.length) {
    console.log(`🔄 Refreshed ${plan.replace.length} existing documents`)
    console.log(`   ${byType(plan.replace)}`)
  }
  if (plan.kept.length) {
    console.log(
      `🔒 Left ${plan.kept.length} existing documents untouched (run with --update to refresh them)`
    )
  }
  if (plan.protectedDocs.length) {
    console.log(
      `🔒 Skipped ${plan.protectedDocs.length} documents that use images uploaded in the Studio:`
    )
    for (const p of plan.protectedDocs) {
      console.log(`   ${p.id}  (${p.images.join(', ')})`)
    }
  }
  console.log('\nOpen http://localhost:3000/us/en to see the homepage.')
}

main().catch(err => {
  console.error('❌ Seed failed:', err.message || err)
  process.exit(1)
})
