import { getImageUrl } from '@/lib/imageHelpers'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

interface ImagePreloadProps {
  images: Array<{
    source: SanityImageSource
    width?: number
    height?: number
    priority?: 'high' | 'low'
  }>
}

/**
 * Preload critical images to improve perceived performance
 * Use this for above-the-fold images like heroes, logos, etc.
 */
export default function ImagePreload({ images }: ImagePreloadProps) {
  return (
    <>
      {images.map((image, index) => {
        const src = getImageUrl(image.source, {
          width: image.width,
          height: image.height,
          quality: 85,
        })

        if (!src) return null

        return (
          <link
            key={index}
            rel="preload"
            as="image"
            href={src}
            fetchPriority={image.priority || 'high'}
          />
        )
      })}
    </>
  )
}
