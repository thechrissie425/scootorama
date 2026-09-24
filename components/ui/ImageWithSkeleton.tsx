'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { Skeleton } from '@/components/ui/Skeleton'

interface ImageWithSkeletonProps extends Omit<ImageProps, 'alt'> {
  containerClassName?: string
  alt: string
}

export default function ImageWithSkeleton({
  containerClassName,
  className,
  alt,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`relative overflow-hidden ${containerClassName || ''}`}>
      {/* Show Skeleton while loading */}
      {isLoading && (
        <Skeleton className="absolute inset-0 z-10 h-full w-full bg-gray-200" />
      )}

      {/* The Image */}
      <Image
        {...props}
        alt={alt}
        className={`transition-opacity duration-500 ease-in-out ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className || ''}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}
