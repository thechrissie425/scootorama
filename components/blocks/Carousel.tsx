'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { getVideoUrl } from '@/lib/fileHelpers'
import { motion, AnimatePresence } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { TypedObject } from '@portabletext/types'
import { BrandButton } from '@/components/ui/BrandButtons'
// 👇 Import shared types and localization helper
import { BaseBlockProps, LocalizedString, getLocalizedText } from '@/types'

// --- 1. TYPES ---

interface CarouselItem {
  _id: string
  title: LocalizedString
  thumbnail: {
    asset: {
      _ref: string
      _type: 'reference'
    }
    hotspot?: any
    crop?: any
    alt?: string
  }
  videoUrl?: { asset: { _ref?: string; url?: string } }
  overlayHeading?: LocalizedString
  content?: TypedObject[]
  description?: LocalizedString
}

// 👇 Extend BaseBlockProps to fix the "Property market does not exist" error
export interface CarouselProps extends BaseBlockProps {
  heading?: LocalizedString
  items?: CarouselItem[]
  layout?: 'carousel' | 'expandingCarousel'
  market?: string
  language?: string
}

// --- 2. SMART MEDIA COMPONENT ---

interface FeatureMediaProps {
  item: CarouselItem
  priority?: boolean
  forcePlay?: boolean // New prop to control autoplay vs hover behavior
  language: string
}

const FeatureMedia = ({
  item,
  priority = false,
  forcePlay = false,
  language,
}: FeatureMediaProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  // Logic: Play if forced (Modal) OR if hovering (Grid)
  const shouldPlay = forcePlay || isHovering

  // Get video URL using the helper
  const videoUrl = getVideoUrl(item.videoUrl?.asset)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (shouldPlay) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          /* Ignore autoplay errors */
        })
      }
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [shouldPlay])

  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 1. IMAGE LAYER (Background) */}
      {item.thumbnail?.asset && (
        <div className="absolute inset-0 z-10">
          <Image
            src={urlFor(item.thumbnail.asset)
              .width(priority ? 1200 : 600)
              .url()}
            alt={getLocalizedText(item.title, language)}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover w-full h-full"
            style={{ objectFit: 'cover' }}
            priority={priority}
          />
          {/* Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>
      )}

      {/* 2. VIDEO LAYER (On Top) */}
      {videoUrl && (
        <div
          className={`absolute inset-0 z-20 transition-opacity duration-500 ease-in-out ${
            shouldPlay ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
          />
          {/* Re-apply gradient on top of video */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>
      )}
    </div>
  )
}

// --- 3. MAIN COMPONENT ---

export default function Carousel({
  heading,
  items,
  layout = 'carousel',
  // 👇 Receive the props (prevents crash even if unused)
  market: _market = 'us',
  language = 'en',
}: CarouselProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  useEffect(() => {
    // Prevent scroll when modal is open (client-side only)
    if (typeof document !== 'undefined') {
      if (selectedId) document.body.style.overflow = 'hidden'
      else document.body.style.overflow = 'unset'
    }
  }, [selectedId])

  // Safe Find
  const selectedItem = items?.find(item => item && item._id === selectedId)

  // Localize Heading
  const displayHeading = getLocalizedText(heading, language)

  // Handle item click for expanding layout
  const handleItemClick = (id: string) => {
    if (layout === 'expandingCarousel') {
      setExpandedCardId(expandedCardId === id ? null : id)
    } else {
      setSelectedId(id)
    }
  }

  return (
    <section className="py-24 bg-lightGrey overflow-hidden">
      <div className="container mx-auto px-6">
        {displayHeading && (
          <h2 className="text-4xl md:text-5xl font-heading font-display uppercase tracking-tighter mb-12 text-black">
            {displayHeading}
          </h2>
        )}

        {/* --- CAROUSEL TRACK --- */}
        {layout === 'expandingCarousel' ? (
          // Expanding Grid Layout
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items && items.length > 0 ? (
                items.map((item, index) => {
                  const isExpanded = expandedCardId === item._id
                  const columnIndex = index % 3

                  return (
                    <div key={item._id} className="relative h-[400px]">
                      {/* Collapsed Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                          opacity: isExpanded ? 0 : 1,
                          scale: isExpanded ? 0.95 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        onClick={() => handleItemClick(item._id)}
                        className={`
                          absolute inset-0 rounded-3xl overflow-hidden cursor-pointer
                          bg-black shadow-sm hover:shadow-xl
                          ${isExpanded ? 'pointer-events-none' : ''}
                        `}
                      >
                        <FeatureMedia
                          item={item}
                          forcePlay={false}
                          priority={index === 0}
                          language={language}
                        />

                        <div className="absolute bottom-0 left-0 p-8 w-full z-30 pointer-events-none">
                          <h3 className="text-3xl font-heading font-display uppercase text-white leading-none drop-shadow-md">
                            {getLocalizedText(item.title, language)}
                          </h3>

                          <div className="absolute right-8 bottom-8 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 pointer-events-auto">
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div>
                        </div>
                      </motion.div>

                      {/* Expanded Card - Absolutely positioned overlay */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          onClick={() => handleItemClick(item._id)}
                          className="absolute top-0 rounded-3xl overflow-hidden cursor-pointer bg-black shadow-2xl h-[400px] z-50"
                          style={{
                            width:
                              columnIndex === 2
                                ? 'calc(200% + 1.5rem)'
                                : 'calc(200% + 1.5rem)',
                            left: columnIndex === 2 ? 'auto' : '0',
                            right: columnIndex === 2 ? '0' : 'auto',
                          }}
                        >
                          <div className="flex h-full">
                            {/* Image side */}
                            <motion.div
                              className="w-1/3 relative flex-shrink-0"
                              initial={{ width: '100%' }}
                              animate={{ width: '33.333%' }}
                              transition={{
                                duration: 0.5,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                            >
                              <FeatureMedia
                                item={item}
                                forcePlay={true}
                                priority={index === 0}
                                language={language}
                              />
                            </motion.div>

                            {/* Content side */}
                            <motion.div
                              className="flex-1 p-8 flex flex-col justify-center text-white"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.2 }}
                            >
                              <h3 className="text-3xl md:text-4xl font-display uppercase leading-none mb-4">
                                {getLocalizedText(item.title, language)}
                              </h3>

                              <div className="text-lg opacity-90 mb-6 leading-relaxed line-clamp-4">
                                {item.content && item.content.length > 0 ? (
                                  <PortableText value={item.content} />
                                ) : item.description ? (
                                  <p>
                                    {getLocalizedText(
                                      item.description,
                                      language
                                    )}
                                  </p>
                                ) : item.overlayHeading ? (
                                  <p>
                                    {getLocalizedText(
                                      item.overlayHeading,
                                      language
                                    )}
                                  </p>
                                ) : (
                                  <p>
                                    Experience the ultimate in{' '}
                                    {getLocalizedText(
                                      item.title,
                                      language
                                    ).toLowerCase()}{' '}
                                    technology with advanced features designed
                                    for peak performance.
                                  </p>
                                )}
                              </div>

                              <button className="bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-3 rounded-full font-heading-bold w-fit transition-colors">
                                Learn More
                              </button>

                              <button
                                onClick={e => {
                                  e.stopPropagation()
                                  setExpandedCardId(null)
                                }}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <p>No items to display</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Standard Carousel Layout
          <div className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing px-4 -mx-4">
            {items?.map((item, index) => (
              <div
                key={item._id}
                onClick={() => handleItemClick(item._id)}
                className="relative flex-shrink-0 w-[85vw] md:w-[400px] h-[500px] rounded-3xl overflow-hidden cursor-pointer snap-center group shadow-sm hover:shadow-xl transition-all duration-500 bg-black"
              >
                {/* GRID MODE: forcePlay={false} (Hover only), only first item gets priority */}
                <FeatureMedia
                  item={item}
                  forcePlay={false}
                  priority={index === 0}
                  language={language}
                />

                <div className="absolute bottom-0 left-0 p-8 w-full z-30 pointer-events-none">
                  <h3 className="text-3xl font-heading font-display uppercase text-white leading-none drop-shadow-md">
                    {getLocalizedText(item.title, language)}
                  </h3>
                  <div className="absolute right-8 bottom-8 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 border border-white/30">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL (Only for Standard Layout) --- */}
      {layout === 'carousel' && (
        <AnimatePresence>
          {selectedId && selectedItem && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
              />

              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-6xl h-[90vh] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row"
              >
                <BrandButton
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedId(null)}
                  className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-sm border border-neutral-100 text-gray-700"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </BrandButton>

                {/* LEFT: Content */}
                <div className="w-full md:w-5/12 h-full overflow-y-auto bg-white order-2 md:order-1 relative z-10">
                  <div className="p-8 md:p-12 pb-24">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                      <span className="text-xs font-heading-bold uppercase tracking-widest text-grey">
                        Feature Spotlight
                      </span>
                    </div>

                    <h3 className="text-4xl md:text-5xl font-heading font-display uppercase text-black mb-8 leading-[0.9]">
                      {getLocalizedText(
                        selectedItem.overlayHeading || selectedItem.title,
                        language
                      )}
                    </h3>

                    <div className="prose prose-lg prose-neutral prose-headings:font-heading prose-headings:font-display prose-a:text-brand-primary-dark">
                      {selectedItem.content ? (
                        <PortableText value={selectedItem.content} />
                      ) : (
                        <p className="text-grey">
                          No additional details available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT: Video/Image */}
                <div className="relative w-full md:w-7/12 h-64 md:h-full bg-black order-1 md:order-2">
                  {/* MODAL MODE: forcePlay={true} (Autoplays immediately) */}
                  <FeatureMedia
                    item={selectedItem}
                    priority={false}
                    forcePlay={true}
                    language={language}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      )}
    </section>
  )
}
