'use client'

import Link from 'next/link'
import { getImageUrl } from '@/lib/imageHelpers'
import { getVideoUrl } from '@/lib/fileHelpers'
import { BaseBlockProps, SanityImage } from '@/types'

interface InstagramVideoCard {
  _id: string
  _key: string
  title: string
  video: {
    asset: {
      _ref: string
      url?: string
    }
  }
  thumbnail?: SanityImage
  username: string
  instagramHandle: string
  instagramPostUrl: string
  caption?: string
}

interface InstagramVideoGridProps extends BaseBlockProps {
  heading?: string
  subheading?: string
  videos: InstagramVideoCard[]
  columns?: 2 | 3 | 4
  showCaptions?: boolean
}

export default function InstagramVideoGrid({
  heading,
  subheading,
  videos,
  columns = 3,
  showCaptions = true,
  market: _market,
  language: _language,
}: InstagramVideoGridProps) {
  console.log('InstagramVideoGrid render:', {
    heading,
    videosCount: videos?.length,
    videos: videos?.map(v => ({
      _id: v._id,
      title: v.title,
      username: v.username,
      hasVideo: !!v.video,
      videoAsset: v.video?.asset,
    })),
  })

  if (!videos || videos.length === 0) {
    console.log('No videos to display')
    return null
  }

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns]

  return (
    <section className="py-16 px-6  bg-white-base">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-4xl md:text-5xl font-heading-bold mb-4">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Video Grid */}
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {videos.map(video => (
            <InstagramVideoCard
              key={video._id || video._key}
              video={video}
              showCaption={showCaptions}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function InstagramVideoCard({
  video,
  showCaption,
}: {
  video: InstagramVideoCard
  showCaption?: boolean
}) {
  const videoUrl = getVideoUrl(video.video?.asset)

  const thumbnailUrl = video.thumbnail
    ? getImageUrl(video.thumbnail, { width: 600, height: 800, fit: 'crop' })
    : null

  return (
    <Link
      href={video.instagramPostUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative bg-black rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {/* Video Container - 9:16 aspect ratio (Instagram vertical) */}
        <div className="relative aspect-[9/16] bg-black">
          {videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              poster={thumbnailUrl || undefined}
            />
          ) : thumbnailUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
            />
          ) : null}

          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Instagram icon overlay */}
          <div className="absolute top-4 right-4">
            <svg
              className="w-8 h-8 text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>

          {/* User info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-white">
              <p className="font-bold text-sm mb-1">{video.username}</p>
              <p className="text-xs text-gray-300">{video.instagramHandle}</p>
            </div>
          </div>
        </div>

        {/* Optional Caption */}
        {showCaption && video.caption && (
          <div className="p-4 bg-white dark:bg-slate-900">
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {video.caption}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}
