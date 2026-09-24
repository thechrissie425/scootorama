'use client'

import { useEffect } from 'react'
import { getImageUrl } from '@/lib/imageHelpers'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

interface ImagePreloaderProps {
  images: (SanityImageSource | null | undefined)[]
  maxPreload?: number
}

/**
 * Preloads critical images for faster perceived loading
 * Useful for product grids and carousels where images are below the fold
 */
export function ImagePreloader({
  images,
  maxPreload = 6,
}: ImagePreloaderProps) {
  useEffect(() => {
    if (!images.length) return

    // Preload the first few images for faster loading
    const imagesToPreload = images.slice(0, maxPreload).filter(Boolean)

    imagesToPreload.forEach(image => {
      if (!image) return

      const imageUrl = getImageUrl(image, {
        width: 400,
        height: 300,
        quality: 75,
        format: 'webp',
      })

      if (imageUrl) {
        // Create a new image element to trigger preload
        const img = new Image()
        img.src = imageUrl

        // Optional: add to browser cache with link preload
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = imageUrl
        link.type = 'image/webp'
        document.head.appendChild(link)

        // Clean up the link after a short delay
        setTimeout(() => {
          if (document.head.contains(link)) {
            document.head.removeChild(link)
          }
        }, 5000)
      }
    })
  }, [images, maxPreload])

  return null // This component doesn't render anything
}
