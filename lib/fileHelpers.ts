import { client } from '@/sanity/lib/client'

/**
 * Generate file URL from Sanity file asset
 */
export function getFileUrl(
  asset: { _ref?: string; url?: string } | null | undefined
): string {
  if (!asset) return ''

  // If the URL is already provided, use it
  if (asset.url) return asset.url

  // If we only have a reference, construct the URL manually
  if (asset._ref) {
    const [, id, extension] = asset._ref.match(/^file-([a-f0-9]+)-(\w+)$/) || []
    if (id && extension) {
      return `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${id}.${extension}`
    }
  }

  return ''
}

/**
 * Get video URL specifically (alias for getFileUrl)
 */
export const getVideoUrl = getFileUrl
