import { urlFor } from '@/sanity/lib/image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Type definitions for Sanity image objects
interface SanityImageAsset {
  _id: string
  url: string
  metadata?: {
    lqip?: string
    dimensions?: {
      width: number
      height: number
    }
  }
  altText?: string
  alt?: string
}

interface SanityImageObject {
  asset: SanityImageAsset
  alt?: string
  hotspot?: {
    x: number
    y: number
  }
  crop?: {
    left: number
    top: number
    right: number
    bottom: number
  }
}

/**
 * Enhanced image URL generator with comprehensive source support
 * Supports all image field variations from schema audit:
 * - image, poster, thumbnail, avatar, heroImage, hero.image
 */
export function getImageUrl(
  source: SanityImageSource | null | undefined,
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png' | 'auto'
    fit?: 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'clip' | 'min'
  }
) {
  if (!source) return null

  // Handle string URLs (already processed)
  if (typeof source === 'string') {
    return source.startsWith('http') ? source : null
  }

  // Handle complex Sanity image objects (this is expected and valid)
  if (typeof source === 'object' && source && 'asset' in source) {
    // This is a normal Sanity image object with asset, crop, hotspot etc.
  }

  try {
    let builder = urlFor(source)

    if (options?.width) {
      builder = builder.width(options.width)
    }

    if (options?.height) {
      builder = builder.height(options.height)
    }

    // Use 85 quality by default for good performance vs quality balance
    const quality = options?.quality ?? 85
    builder = builder.quality(quality)

    if (options?.format && options.format !== 'auto') {
      builder = builder.format(options.format)
    } else {
      // Default to WebP for better compression
      builder = builder.format('webp')
    }

    if (options?.fit) {
      builder = builder.fit(options.fit)
    }

    return builder.url()
  } catch (error) {
    return null
  }
}

/**
 * Generate a blur data URL for placeholder while image loads
 * Uses Sanity's LQIP (Low Quality Image Placeholder) if available
 */
export function getBlurDataURL(
  source: SanityImageSource | null | undefined
): string | undefined {
  if (!source) return undefined

  // Check if source has LQIP in metadata
  if (typeof source === 'object' && source && 'asset' in source) {
    const asset = source.asset as SanityImageAsset
    if (asset?.metadata?.lqip) {
      return asset.metadata.lqip
    }
  }

  // Fallback: generate a tiny blurred version
  try {
    const tinyUrl = urlFor(source)
      .width(20)
      .height(20)
      .blur(50)
      .quality(20)
      .url()
    return tinyUrl
  } catch (error) {
    return undefined
  }
}

/**
 * Get optimized image props for Next.js Image component
 * Combines URL, blur placeholder, and appropriate sizes
 */
export function getOptimizedImageProps(
  source: SanityImageSource | null | undefined,
  options?: {
    width?: number
    height?: number
    quality?: number
    priority?: boolean
    sizes?: string
    alt?: string
  }
) {
  const src = getImageUrl(source, {
    width: options?.width,
    height: options?.height,
    quality: options?.quality,
  })

  if (!src) return null

  const blurDataURL = getBlurDataURL(source)

  return {
    src,
    alt: options?.alt || '',
    ...(blurDataURL && {
      placeholder: 'blur' as const,
      blurDataURL,
    }),
    ...(options?.priority && { priority: true }),
    ...(options?.sizes && { sizes: options.sizes }),
  }
}

/**
 * Comprehensive image field detection for all content types
 * Based on schema audit - supports all image field variations
 */
export function getAnyImageField(
  content: Record<string, unknown> | null | undefined
): SanityImageSource | null {
  if (!content || typeof content !== 'object') return null

  // Priority order based on schema audit:
  // 1. image (campaigns, features, products, authors)
  // 2. poster (campaigns)
  // 3. thumbnail (features, carousel items)
  // 4. avatar (social proof)
  // 5. heroImage (pricing tiers)
  // 6. hero.image (posts)
  return (
    (content.image as SanityImageSource) ||
    (content.poster as SanityImageSource) ||
    (content.thumbnail as SanityImageSource) ||
    (content.avatar as SanityImageSource) ||
    (content.heroImage as SanityImageSource) ||
    ((content.hero as Record<string, unknown>)?.image as SanityImageSource) ||
    null
  )
}

/**
 * Extract blur data URL from Sanity image metadata
 */
export function getBlurDataUrl(
  source: SanityImageSource | null | undefined
): string | undefined {
  if (!source || typeof source !== 'object' || !('asset' in source))
    return undefined

  const imageObject = source as SanityImageObject
  return imageObject.asset?.metadata?.lqip
}

/**
 * Get alt text from Sanity image with fallback
 */
export function getAltText(
  source: SanityImageSource | null | undefined,
  fallback: string = 'Image'
): string {
  if (!source) return fallback

  // Ensure fallback is a string
  if (fallback && typeof fallback !== 'string') {
    return 'Image' // Safe fallback
  }

  // Handle string sources (just URLs)
  if (typeof source === 'string') return fallback

  // Try to get alt from the image object
  const imageObject = source as SanityImageObject
  if (imageObject.alt) return imageObject.alt

  // Try to get it from asset metadata
  if (typeof source === 'object' && 'asset' in source) {
    const assetAlt = imageObject.asset?.altText || imageObject.asset?.alt
    if (assetAlt) return assetAlt
  }

  return fallback
}

/**
 * Generate responsive srcset for different screen sizes
 */
export function getResponsiveSrcSet(
  source: SanityImageSource | null | undefined,
  sizes: number[] = [400, 800, 1200, 1600]
): string | undefined {
  if (!source) return undefined

  const srcSet = sizes
    .map(
      size => `${getImageUrl(source, { width: size, quality: 85 })} ${size}w`
    )
    .join(', ')

  return srcSet
}

/**
 * Common image configurations for different use cases
 */
export const imageConfigs = {
  hero: {
    quality: 90, // Restored for better quality
    fit: 'fillmax' as const,
    sizes: '(max-width: 768px) 100vw, 100vw',
  },
  thumbnail: {
    width: 400,
    height: 300,
    quality: 85, // Restored for better quality
    fit: 'fillmax' as const,
    sizes: '(max-width: 768px) 50vw, 25vw',
  },
  feature: {
    width: 800, // Restored to original size
    height: 600, // Restored to original size
    quality: 85, // Restored for better quality
    fit: 'fillmax' as const,
    sizes: '(max-width: 768px) 100vw, 50vw',
  },
  profile: {
    width: 300,
    height: 300,
    quality: 85, // Restored for better quality
    fit: 'fillmax' as const,
    sizes: '(max-width: 768px) 25vw, 15vw',
  },
} as const

/**
 * Type-safe image props generator for Next.js Image component
 */
export function getImageProps(
  source: SanityImageSource | null | undefined,
  config:
    | keyof typeof imageConfigs
    | (typeof imageConfigs)[keyof typeof imageConfigs] = 'feature',
  altFallback?: string
) {
  if (!source) return null

  // Ensure altFallback is a string
  const safeAltFallback =
    typeof altFallback === 'string' ? altFallback : undefined

  const imageConfig = typeof config === 'string' ? imageConfigs[config] : config

  return {
    src: getImageUrl(source, imageConfig) || '',
    alt: getAltText(source, safeAltFallback),
    blurDataURL: getBlurDataUrl(source),
    placeholder: getBlurDataUrl(source)
      ? ('blur' as const)
      : ('empty' as const),
    sizes: imageConfig.sizes,
    quality: imageConfig.quality,
  }
}
