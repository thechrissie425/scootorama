'use client'

import Image from 'next/image'
import { forwardRef } from 'react'
import { getOptimizedImageProps } from '@/lib/imageHelpers'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

interface OptimizedImageProps {
  source: SanityImageSource | null | undefined
  alt: string
  width?: number
  height?: number
  quality?: number
  priority?: boolean
  sizes?: string
  fill?: boolean
  className?: string
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

/**
 * Enhanced Image component with automatic optimization and blur placeholders
 * Wraps Next.js Image with Sanity-specific optimizations
 */
const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  function OptimizedImage(
    {
      source,
      alt,
      width,
      height,
      quality = 85,
      priority = false,
      sizes,
      fill = false,
      className,
      style,
      onLoad,
      onError,
    },
    ref
  ) {
    const imageProps = getOptimizedImageProps(source, {
      width,
      height,
      quality,
      priority,
      sizes,
      alt,
    })

    if (!imageProps?.src) {
      return null
    }

    return (
      <Image
        ref={ref}
        {...imageProps}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={className}
        style={style}
        onLoad={onLoad}
        onError={onError}
      />
    )
  }
)

export default OptimizedImage
