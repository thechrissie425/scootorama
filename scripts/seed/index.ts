#!/usr/bin/env node
/**
 * Seeds a Sanity dataset with Scootorama starter content.
 *
 *   npm run seed
 *
 * Reads NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_API_TOKEN (Editor) from .env.local. Every document has a fixed _id
 * and is written with createOrReplace, so re-running updates the content in
 * place instead of duplicating it. Images are uploaded from
 * scripts/seed/images (Sanity de-duplicates identical uploads).
 */
import { createClient } from '@sanity/client'
import { createReadStream } from 'node:fs'
import { join } from 'node:path'
import dotenv from 'dotenv'
import { buildDocuments, IMAGE_NAMES, imageFileName } from './content'

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

async function main() {
  console.log(`🛴 Seeding ${projectId}/${dataset}`)
  console.log('Uploading images…')
  const assetIds: Record<string, string> = {}
  for (const name of IMAGE_NAMES) {
    const asset = await client.assets.upload(
      'image',
      createReadStream(join(IMAGE_DIR, imageFileName(name))),
      { filename: imageFileName(name) }
    )
    assetIds[name] = asset._id
    console.log(`  🖼  ${name}`)
  }

  const docs = buildDocuments(assetIds)
  const tx = client.transaction()
  for (const doc of docs) tx.createOrReplace(doc as never)
  await tx.commit()

  const counts = docs.reduce<Record<string, number>>((acc, d) => {
    const t = d._type as string
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {})
  console.log(`✅ Wrote ${docs.length} documents:`)
  for (const [t, n] of Object.entries(counts)) console.log(`   ${t}: ${n}`)
  console.log('\nOpen http://localhost:3000/us/en to see the homepage.')
}

main().catch(err => {
  console.error('❌ Seed failed:', err.message || err)
  process.exit(1)
})
