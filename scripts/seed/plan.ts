/**
 * Decides what the seed may write, so content edited in the Studio is never
 * clobbered. Pure functions: no Sanity client, easy to test.
 */

/** Tag stored on assets the seed uploads (asset.source.name) */
export const SEED_SOURCE = 'scootorama-seed'

export type SeedMode = 'create' | 'update' | 'force'

export type SeedDoc = { _id: string; _type: string; [key: string]: unknown }

export interface AssetInfo {
  _id: string
  originalFilename?: string | null
  source?: string | null
}

export interface SeedPlan {
  /** Documents that don't exist yet */
  create: SeedDoc[]
  /** Existing documents the seed will overwrite (update/force modes) */
  replace: SeedDoc[]
  /** Existing documents left alone because the mode doesn't touch them */
  kept: string[]
  /** Existing documents left alone because they hold Studio-uploaded images */
  protectedDocs: { id: string; images: string[] }[]
}

/** Every image asset id referenced anywhere in a document */
export function collectImageRefs(value: unknown, out = new Set<string>()) {
  if (Array.isArray(value)) {
    for (const v of value) collectImageRefs(v, out)
  } else if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const asset = obj.asset as { _ref?: unknown } | undefined
    if (typeof asset?._ref === 'string' && asset._ref.startsWith('image-')) {
      out.add(asset._ref)
    }
    for (const v of Object.values(obj)) collectImageRefs(v, out)
  }
  return out
}

/**
 * Whether an asset came from the seed: tagged on upload, or (for uploads
 * from before tagging) named after one of the seed's image files.
 */
export function isSeedAsset(asset: AssetInfo, seedFileNames: Set<string>) {
  return (
    asset.source === SEED_SOURCE ||
    (!!asset.originalFilename && seedFileNames.has(asset.originalFilename))
  )
}

export function planSeed({
  docs,
  existing,
  assets,
  seedFileNames,
  mode,
}: {
  docs: SeedDoc[]
  /** Existing documents with the same ids, as stored in the dataset */
  existing: SeedDoc[]
  /** Asset info for every image referenced by `existing` */
  assets: AssetInfo[]
  seedFileNames: Set<string>
  mode: SeedMode
}): SeedPlan {
  const existingById = new Map(existing.map(d => [d._id, d]))
  const assetById = new Map(assets.map(a => [a._id, a]))
  const plan: SeedPlan = {
    create: [],
    replace: [],
    kept: [],
    protectedDocs: [],
  }

  for (const doc of docs) {
    const current = existingById.get(doc._id)
    if (!current) {
      plan.create.push(doc)
      continue
    }
    if (mode === 'create') {
      plan.kept.push(doc._id)
      continue
    }
    if (mode === 'update') {
      // Anything we can't prove came from the seed counts as the user's
      const studioImages = [...collectImageRefs(current)].filter(ref => {
        const asset = assetById.get(ref)
        return !asset || !isSeedAsset(asset, seedFileNames)
      })
      if (studioImages.length) {
        plan.protectedDocs.push({
          id: doc._id,
          images: studioImages.map(
            ref => assetById.get(ref)?.originalFilename || ref
          ),
        })
        continue
      }
    }
    plan.replace.push(doc)
  }
  return plan
}

/** Seed image names referenced by documents built with placeholderIds() */
export const PLACEHOLDER_PREFIX = 'seed-placeholder-'

export function placeholderIds(names: readonly string[]) {
  return Object.fromEntries(names.map(n => [n, `${PLACEHOLDER_PREFIX}${n}`]))
}

export function imagesUsedBy(docs: SeedDoc[], names: readonly string[]) {
  const json = JSON.stringify(docs)
  return names.filter(n => json.includes(`"${PLACEHOLDER_PREFIX}${n}"`))
}
