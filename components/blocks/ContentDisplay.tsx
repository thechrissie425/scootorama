'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getImageProps } from '../../lib/imageHelpers'
import { getCampaign } from '@/app/actions/getCampaign'
import { motion, AnimatePresence } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { TypedObject } from '@portabletext/types'
import CampaignContent, {
  type Campaign,
} from '@/components/blocks/CampaignContent'
import SvgIcon from '@/components/ui/SvgIcon'
import closeIcon from '@/icons/system/close.svg'
import shareIcon from '@/icons/system/share.svg'
import { ContentDisplayProps, getLocalizedText } from '@/types'
import { brand } from '@/lib/brand'

// Extended Campaign type with slug for this component
type CampaignWithSlug = Campaign & {
  slug?: { current: string }
}

// Use centralized helper functions
const getTitleString = (title: any): string =>
  getLocalizedText(title, 'en') || 'Untitled'
const getLocalizedString = getLocalizedText

// Helper to get any image field from content (supports all variations from schema audit)
function getContentImage(
  content:
    | {
        image?: SanityImageSource
        poster?: SanityImageSource
        thumbnail?: SanityImageSource
        avatar?: SanityImageSource
        heroImage?: SanityImageSource
        hero?: { image?: SanityImageSource }
      }
    | null
    | undefined
): SanityImageSource | null {
  if (!content) return null

  // Priority order based on schema audit:
  // 1. image (campaigns, features, products, authors)
  // 2. poster (campaigns)
  // 3. thumbnail (features, carousel items)
  // 4. avatar (social proof)
  // 5. heroImage (pricing tiers)
  // 6. hero.image (posts)
  return (
    content.image ||
    content.poster ||
    content.thumbnail ||
    content.avatar ||
    content.heroImage ||
    content.hero?.image ||
    null
  )
}

// Full campaign data interface for modal (using the Campaign type from CampaignContent with slug)
type FullCampaign = CampaignWithSlug

// Manual Grid Item
interface ManualGridItem {
  _type: 'manualItem'
  _key: string
  title: string
  subtitle?: string
  image: SanityImageSource
  size: 'square' | 'wide' | 'tall' | 'big'
  theme: 'light' | 'dark'
  link?: string
}

// Content Reference Grid Item
interface ContentReferenceGridItem {
  _type: 'contentReference'
  _key: string
  size: 'square' | 'wide' | 'tall' | 'big'
  theme: 'light' | 'dark'
  overrideTitle?: string
  overrideSubtitle?: string
  content: {
    _type: 'campaign' | 'feature' | 'product' | 'socialProof'
    title: string // All content types now use simple string (plugin handles i18n)
    slug?: { current: string }
    // Universal image fields
    image?: SanityImageSource // All content types now use image
    thumbnail?: SanityImageSource // Legacy fallback
    avatar?: SanityImageSource // Social proof authors
    // Video field
    video?: string // Video URL for features
    // Overlay content fields (for features)
    content?: TypedObject[] // PortableText content for modal
    overlayHeading?: string // Override heading for modal
    // Content fields
    quote?: string // Social proof
    hook?: string // Campaigns
    description?: string // Features, products
    // Meta fields
    status?: string // Campaigns
    type?: string // Social proof
  }
}

// Carousel Item (from original Carousel component)
interface CarouselItem {
  _key: string
  title: string
  thumbnail: SanityImageSource
  videoUrl?: string
  overlayHeading?: string
  content?: TypedObject[]
}

// Union types for different item types
type GridItem = ManualGridItem | ContentReferenceGridItem
type DisplayItem = GridItem | CarouselItem

// Normalized item for rendering (unified interface)
interface NormalizedItem {
  _key: string
  _id?: string // For carousel items
  title: string | { [key: string]: string }
  subtitle?: string | { [key: string]: string }
  image?: SanityImageSource
  size?: 'square' | 'wide' | 'tall' | 'big'
  theme?: 'light' | 'dark'
  link?: string
  videoUrl?: string // For carousel items
  overlayHeading?: string | { [key: string]: string } // For carousel items
  content?: TypedObject[] // For carousel items
  // Additional data for overlay
  contentData?: {
    _type: 'campaign' | 'feature' | 'product' | 'socialProof'
    title: string
    description?: string
    status?: string
    slug?: { current: string }
    type?: string // For social proof type
  }
}

// Component Props - using imported ContentDisplayProps from @/types
// Note: layout options are 'grid' | 'carousel' | 'expandingCarousel'

// --- SHARED MEDIA COMPONENT ---

interface MediaDisplayProps {
  item: NormalizedItem
  priority?: boolean
  forcePlay?: boolean
  layout: 'grid' | 'carousel' | 'expandingCarousel'
  onClick?: () => void
}

const MediaDisplay = ({
  item,
  priority = false,
  forcePlay = false,
  layout,
  onClick,
}: MediaDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const shouldPlay = forcePlay || isHovering
  const itemTitle = getTitleString(item.title)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !item.videoUrl) {
      return
    }

    if (shouldPlay) {
      // Reset to beginning and play for smooth hover experience
      video.currentTime = 0
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video playing successfully
          })
          .catch(_error => {
            // Video autoplay prevented
          })
      }
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [shouldPlay, itemTitle, item.videoUrl, forcePlay, isHovering])

  const imageSource = item.image
  const imageProps = imageSource
    ? getImageProps(
        imageSource,
        priority ? 'hero' : 'feature',
        getTitleString(item.title)
      )
    : null

  if (imageSource && !imageProps) {
    // Failed to generate image props
  }

  const textColor = item.theme === 'dark' ? 'text-black' : 'text-white'

  return (
    <motion.div
      className="relative w-full h-full bg-black overflow-hidden cursor-pointer"
      onMouseEnter={forcePlay ? undefined : () => setIsHovering(true)}
      onMouseLeave={forcePlay ? undefined : () => setIsHovering(false)}
      onClick={onClick}
    >
      {/* Background Image */}
      {imageProps?.src && (
        <motion.div
          className="absolute inset-0 z-10"
          whileHover={forcePlay ? {} : { scale: 1.05 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            {...imageProps}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            style={{ objectFit: 'cover' }}
            priority={priority}
            alt={getTitleString(item.title) || 'Content image'}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
        </motion.div>
      )}

      {/* Video Layer (for carousel items) */}
      {item.videoUrl && (
        <motion.div
          className="absolute inset-0 z-20"
          initial={{ opacity: 0 }}
          animate={{
            opacity: shouldPlay ? 1 : 0,
            transition: {
              duration: shouldPlay ? 0.3 : 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            },
          }}
          whileHover={forcePlay ? {} : { scale: 1.05 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <video
            ref={videoRef}
            src={item.videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
        </motion.div>
      )}

      {/* Video hover indicator */}
      {item.videoUrl && !forcePlay && (
        <motion.div
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovering ? 1 : 0.6,
            scale: isHovering ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"
            animate={isHovering ? { scale: [1, 1.2, 1] } : {}}
            transition={{
              duration: 0.6,
              repeat: isHovering ? Infinity : 0,
            }}
          />
        </motion.div>
      )}

      {/* Campaign Status Badge (for grid layout campaigns) */}
      {layout === 'grid' &&
        item.contentData?._type === 'campaign' &&
        item.contentData.status && (
          <div className="absolute top-4 left-4 z-30">
            <div className="px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/20 rounded-full">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.contentData.status === 'active'
                      ? 'bg-brand-lime animate-pulse shadow-lg shadow-brand-lime/50'
                      : item.contentData.status === 'completed'
                        ? 'bg-brand-primary shadow-lg shadow-brand-primary/50'
                        : 'bg-blue-400 shadow-lg shadow-blue-400/50'
                  }`}
                />
                <span className="text-xs font-heading-bold uppercase tracking-widest text-white">
                  {item.contentData.status === 'upcoming'
                    ? 'Coming Soon'
                    : item.contentData.status}
                </span>
              </div>
            </div>
          </div>
        )}

      {/* Text Content */}
      <div
        className={`relative z-30 h-full flex flex-col justify-end p-6 ${textColor} pointer-events-none`}
      >
        <h3 className="text-3xl font-heading font-display uppercase leading-none drop-shadow-md">
          {getTitleString(item.title)}
        </h3>
      </div>

      {/* Plus Icon (for interactive items) */}
      {onClick && !forcePlay && (
        <motion.div
          className="absolute right-6 bottom-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 z-40"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{
            opacity: isHovering ? 1 : 0,
            scale: isHovering ? 1.1 : 1,
            y: isHovering ? 0 : 10,
            transition: {
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </motion.svg>
        </motion.div>
      )}
    </motion.div>
  )
}

// --- NORMALIZATION HELPER ---

function normalizeItem(
  item: DisplayItem,
  generateUrl?: (path: string) => string
): NormalizedItem {
  // Handle Carousel Items (check for thumbnail property which is unique to CarouselItem)
  if ('thumbnail' in item) {
    const carouselItem = item as CarouselItem

    return {
      _key: carouselItem._key,
      title: carouselItem.title,
      image: carouselItem.thumbnail,
      videoUrl: carouselItem.videoUrl,
      overlayHeading: carouselItem.overlayHeading,
      content: carouselItem.content,
      // Don't set subtitle for carousel items - they don't have one
    }
  }

  // Handle Grid Items
  const gridItem = item as GridItem

  if (gridItem._type === 'manualItem') {
    return {
      _key: gridItem._key,
      title: gridItem.title,
      subtitle: gridItem.subtitle,
      image: gridItem.image,
      size: gridItem.size,
      theme: gridItem.theme,
      link: gridItem.link,
    }
  } else {
    // Content reference
    const { content } = gridItem as ContentReferenceGridItem

    let link: string | undefined
    if (content._type === 'campaign' && content.slug) {
      // Handle both string slugs and slug objects
      const rawSlugValue =
        typeof content.slug === 'string' ? content.slug : content.slug.current
      if (rawSlugValue) {
        const slugValue =
          typeof rawSlugValue === 'string' ? rawSlugValue : 'campaign'
        const campaignPath = `/campaigns/${slugValue}`
        link = generateUrl ? generateUrl(campaignPath) : campaignPath
      }
    }

    // Universal image fallback using comprehensive helper
    const image = getContentImage(content)

    // Simple title handling (plugin-based i18n handles language automatically)
    const contentTitle = getLocalizedString(content.title, 'Untitled')
    const title = gridItem.overrideTitle || contentTitle

    // Smart subtitle/description handling based on content type
    const getContentSubtitle = () => {
      switch (content._type) {
        case 'campaign':
          return getLocalizedString(content.status)
        case 'feature':
          return getLocalizedString(content.description)
        case 'product':
          return getLocalizedString(content.description)
        case 'socialProof':
          return getLocalizedString(content.type, 'Testimonial')
        default:
          return (
            getLocalizedString(content.description) ||
            getLocalizedString(content.status)
          )
      }
    }

    const subtitle = gridItem.overrideSubtitle || getContentSubtitle()

    return {
      _key: gridItem._key,
      title,
      subtitle,
      image: image || undefined,
      size: gridItem.size,
      theme: gridItem.theme,
      link,
      // Extract video URL from referenced content (for features)
      videoUrl: content.video || undefined,
      // Extract overlay content from referenced content (for features)
      content: content.content || undefined,
      overlayHeading: content.overlayHeading || undefined,
      contentData:
        content._type === 'campaign' ||
        content._type === 'feature' ||
        content._type === 'product' ||
        content._type === 'socialProof'
          ? {
              _type: content._type,
              title: contentTitle,
              description: content.description || content.quote || content.hook,
              status: content.status,
              slug: content.slug
                ? {
                    current:
                      typeof content.slug === 'string'
                        ? content.slug
                        : content.slug.current,
                  }
                : undefined,
              type: content.type, // For social proof
            }
          : undefined,
    }
  }
}

// --- GRID LAYOUT CLASSES ---

const GRID_SIZE_CLASSES = {
  square: 'md:col-span-1 md:row-span-1', // 1x1
  wide: 'md:col-span-2 md:row-span-1', // 2x1
  tall: 'md:col-span-1 md:row-span-2', // 1x2
  big: 'md:col-span-2 md:row-span-2', // 2x2
}

// --- MAIN COMPONENT ---

export default function ContentDisplay({
  layout,
  heading,
  items,
}: ContentDisplayProps) {
  const [selectedItem, setSelectedItem] = useState<NormalizedItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [campaignData, setCampaignData] = useState<FullCampaign | null>(null)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)
  const params = useParams()

  // Helper to generate proper URLs based on current market/language context
  const generateUrl = (path: string) => {
    const market = params?.market
    const lang = params?.lang

    // Validate and sanitize parameters to prevent object injection
    const safeMarket = typeof market === 'string' ? market.trim() : 'us'
    const safeLang = typeof lang === 'string' ? lang.trim() : 'en'

    // Default market/language (US English) - use root paths
    if (safeMarket === 'us' && safeLang === 'en') {
      return path
    }

    // Other markets/languages - include market/lang prefix
    if (safeMarket && safeLang) {
      return `/${safeMarket}/${safeLang}${path}`
    }

    // Fallback to root path if no market/lang context
    return path
  }

  // Effect for managing body scroll - moved before early return
  const isItemSelected = !!selectedItem
  useEffect(() => {
    if (isItemSelected) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isItemSelected])

  if (!items || items.length === 0) return null

  const normalizedItems = items.map(item => normalizeItem(item, generateUrl))

  const fetchCampaignData = async (slug: string) => {
    try {
      const campaign = await getCampaign(slug)
      setCampaignData(campaign)
    } catch {
      // Error fetching campaign data
    }
  }

  const handleItemClick = async (item: NormalizedItem) => {
    // Handle expanding carousel layout - toggle expanded state
    if (layout === 'expandingCarousel') {
      if (expandedCardId === item._key) {
        setExpandedCardId(null)
      } else {
        setExpandedCardId(item._key)
      }
      return
    }

    // If it's a manual item with a link, navigate directly
    if (
      !item.contentData &&
      !item.content &&
      item.link &&
      typeof item.link === 'string'
    ) {
      window.open(item.link, '_blank')
      return
    }

    // If it's a campaign, fetch full data BEFORE opening modal
    if (
      item.contentData?._type === 'campaign' &&
      item.contentData.slug?.current
    ) {
      setIsLoading(true)
      setSelectedItem(item)
      const slugString =
        typeof item.contentData.slug.current === 'string'
          ? item.contentData.slug.current
          : typeof item.contentData.slug === 'string'
            ? item.contentData.slug
            : 'campaign'
      await fetchCampaignData(slugString)
      setIsLoading(false)
    } else {
      setSelectedItem(item)
    }
  }

  const closeOverlay = () => {
    setSelectedItem(null)
    setCampaignData(null)
    setIsLoading(false)
  }

  return (
    <section
      className={`py-20 px-6 ${
        layout === 'grid'
          ? 'bg-black text-white'
          : layout === 'expandingCarousel'
            ? 'bg-lightGrey text-black'
            : 'bg-lightGrey overflow-hidden text-black'
      }`}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Heading */}
        {heading && (
          <h2
            className={`text-4xl md:text-6xl font-heading font-display tracking-tighter mb-10 text-center uppercase ${
              layout === 'grid' ? 'text-white' : 'text-black'
            }`}
          >
            {typeof heading === 'string' ? heading : heading?.en || ''}
          </h2>
        )}

        {/* Layout Rendering */}
        {layout === 'grid' ? (
          // Grid Layout
          <div className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[250px] gap-4">
            {normalizedItems.map((item, index) => {
              const sizeClass = GRID_SIZE_CLASSES[item.size || 'square']
              // Only prioritize first 2 items in grid for LCP optimization
              const shouldPrioritize = index < 2

              return (
                <div
                  key={item._key}
                  onClick={() => handleItemClick(item)}
                  className={`group relative overflow-hidden rounded-3xl bg-black border border-white/10 ${sizeClass} cursor-pointer hover:border-brand-primary/50 transition-all duration-300 hover:scale-[1.02] transform-gpu min-h-[300px] md:min-h-0`}
                >
                  <MediaDisplay
                    item={item}
                    layout="grid"
                    priority={shouldPrioritize}
                    onClick={() => handleItemClick(item)}
                  />
                </div>
              )
            })}
          </div>
        ) : layout === 'expandingCarousel' ? (
          // Expanding Carousel Layout
          <div className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing px-4 -mx-4">
            {normalizedItems.map((item, index) => {
              const isExpanded = expandedCardId === item._key
              const description =
                item.contentData?.description ||
                (typeof item.subtitle === 'string' ? item.subtitle : '')

              return (
                <motion.div
                  key={item._key}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    width: isExpanded ? 500 : 350,
                    height: isExpanded ? 550 : 400,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer snap-center bg-white shadow-lg hover:shadow-xl border border-gray-200 flex flex-col"
                >
                  {/* Image Container */}
                  <motion.div
                    className="relative w-full bg-black overflow-hidden"
                    animate={{
                      height: isExpanded ? '65%' : '75%',
                    }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <MediaDisplay
                      item={item}
                      priority={index === 0}
                      layout="carousel"
                      onClick={() => handleItemClick(item)}
                    />
                  </motion.div>

                  {/* Content Container */}
                  <motion.div
                    className="p-6 flex-1 flex flex-col justify-between"
                    animate={{
                      height: isExpanded ? '35%' : '25%',
                    }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {/* Title */}
                    <h3 className="text-lg font-heading-semibold text-black leading-tight mb-2 line-clamp-2">
                      {getTitleString(item.title)}
                    </h3>

                    {/* Expanded Description */}
                    <motion.div
                      className="overflow-hidden flex-1"
                      animate={{
                        opacity: isExpanded ? 1 : 0,
                        height: isExpanded ? 'auto' : 0,
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1],
                        delay: isExpanded ? 0.1 : 0,
                      }}
                    >
                      {description && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                          {description}
                        </p>
                      )}
                    </motion.div>

                    {/* Expand/Collapse Button */}
                    <motion.button
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors self-end mt-auto"
                      onClick={e => {
                        e.stopPropagation()
                        handleItemClick(item)
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={{ rotate: isExpanded ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          className="text-black"
                        >
                          <path
                            d="M6 1V11M1 6H11"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </motion.div>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          // Regular Carousel Layout with Enhanced Animations
          <div className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing px-4 -mx-4">
            {normalizedItems.map((item, index) => {
              return (
                <motion.div
                  key={item._key}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item)}
                  className="relative flex-shrink-0 w-[85vw] md:w-[400px] h-[500px] rounded-3xl overflow-hidden cursor-pointer snap-center bg-black group"
                >
                  <MediaDisplay
                    item={item}
                    priority={index === 0} // Only first item gets priority
                    layout="carousel"
                    onClick={() => handleItemClick(item)}
                  />
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Shared Modal/Overlay System */}
        <AnimatePresence>
          {selectedItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={closeOverlay}
              />

              {/* Campaign Modal (Full Page) */}
              {selectedItem.contentData?._type === 'campaign' &&
              campaignData &&
              !isLoading ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="relative w-full max-w-7xl max-h-[95vh] mx-4 bg-black rounded-3xl shadow-2xl flex flex-col"
                >
                  {/* Modal Controls */}
                  <div className="absolute top-6 right-6 z-50 flex gap-3">
                    {/* Open in New Tab Button */}
                    <button
                      onClick={() => {
                        if (campaignData?.slug?.current) {
                          const slugString =
                            typeof campaignData.slug.current === 'string'
                              ? campaignData.slug.current
                              : typeof campaignData.slug === 'string'
                                ? campaignData.slug
                                : 'campaign'
                          const campaignPath = `/campaigns/${slugString}`
                          const url = generateUrl(campaignPath)
                          window.open(url, '_blank')
                        }
                      }}
                      className="p-3 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-200 shadow-lg group"
                      title="Open in new tab"
                    >
                      <SvgIcon
                        src={shareIcon}
                        className="w-6 h-6 group-hover:scale-110 transition-transform"
                      />
                    </button>

                    {/* Close Button */}
                    <button
                      onClick={closeOverlay}
                      className="p-3 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-200 shadow-lg"
                    >
                      <SvgIcon src={closeIcon} className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Campaign Content */}
                  <div className="flex-1 overflow-y-auto rounded-3xl">
                    <CampaignContent campaign={campaignData} isModal={true} />
                  </div>
                </motion.div>
              ) : (
                /* Basic Modal for Carousel Items and Non-Campaign Items */
                <motion.div
                  initial={{
                    y: layout === 'carousel' ? '100%' : 0,
                    scale: layout === 'carousel' ? 1 : 0.9,
                    opacity: 0,
                  }}
                  animate={{
                    y: layout === 'carousel' ? '0%' : 0,
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    y: layout === 'carousel' ? '100%' : 0,
                    scale: layout === 'carousel' ? 1 : 0.9,
                    opacity: 0,
                  }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className={`relative w-full ${
                    layout === 'carousel'
                      ? 'max-w-6xl h-[90vh] bg-white rounded-t-3xl md:rounded-3xl flex flex-col md:flex-row'
                      : 'max-w-2xl mx-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl border border-white/20 max-h-[90vh] overflow-y-auto'
                  } shadow-2xl overflow-hidden`}
                >
                  {/* Close Button */}
                  <button
                    onClick={closeOverlay}
                    className={`absolute top-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
                      layout === 'carousel'
                        ? 'bg-white/80 hover:bg-white backdrop-blur-md border border-neutral-100 text-black'
                        : 'bg-black/50 border border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <SvgIcon src={closeIcon} className="w-6 h-6" />
                  </button>

                  {isLoading ? (
                    /* Loading State */
                    <div className="p-8 flex items-center justify-center min-h-[400px]">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin mx-auto" />
                        <p className="text-white/80 font-body text-lg">
                          Loading campaign...
                        </p>
                      </div>
                    </div>
                  ) : layout === 'carousel' ? (
                    /* Carousel Modal Layout */
                    <>
                      {/* Content Side */}
                      <div className="w-full md:w-5/12 h-full overflow-y-auto bg-white order-2 md:order-1 relative z-10">
                        <div className="p-8 md:p-12 pb-24">
                          <div className="flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                              Feature Spotlight
                            </span>
                          </div>

                          <h3 className="text-4xl md:text-5xl font-heading font-display uppercase text-black mb-8 leading-[0.9]">
                            {getLocalizedString(selectedItem.overlayHeading) ||
                              getLocalizedString(
                                selectedItem.title,
                                'Untitled'
                              )}
                          </h3>

                          <div className="prose prose-lg prose-neutral prose-headings:font-heading prose-headings:font-display prose-a:text-brand-primary-dark">
                            {(() => {
                              const content = selectedItem.content
                              if (!content)
                                return (
                                  <p className="text-neutral-500">
                                    No additional details available.
                                  </p>
                                )

                              // Handle localized content
                              if (
                                typeof content === 'object' &&
                                !Array.isArray(content) &&
                                content !== null
                              ) {
                                const localizedContent = content as {
                                  [key: string]: TypedObject[]
                                }
                                const contentValue =
                                  localizedContent.en ||
                                  Object.values(localizedContent)[0]
                                return contentValue ? (
                                  <PortableText value={contentValue} />
                                ) : (
                                  <p className="text-neutral-500">
                                    No additional details available.
                                  </p>
                                )
                              }

                              // Handle direct content array
                              return <PortableText value={content} />
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Media Side */}
                      <div className="w-full md:w-7/12 h-full order-1 md:order-2">
                        <MediaDisplay
                          item={selectedItem}
                          forcePlay={true}
                          priority={false}
                          layout="carousel"
                        />
                      </div>
                    </>
                  ) : (
                    /* Grid Modal Layout */
                    <>
                      {/* Header with Image */}
                      {selectedItem.image &&
                        (() => {
                          const imageProps = getImageProps(
                            selectedItem.image,
                            'feature',
                            getTitleString(selectedItem.title)
                          )

                          return imageProps?.src ? (
                            <div className="relative h-64 w-full">
                              <Image
                                {...imageProps}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover rounded-t-3xl"
                                alt={
                                  getTitleString(selectedItem.title) ||
                                  'Modal content image'
                                }
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 rounded-t-3xl" />
                            </div>
                          ) : null
                        })()}

                      {/* Content */}
                      <div className="p-8">
                        <div className="space-y-6">
                          {/* Title and Subtitle */}
                          <div className="space-y-2">
                            <h2 className="text-4xl font-display uppercase tracking-tight text-white">
                              {getLocalizedString(
                                selectedItem.title,
                                'Untitled'
                              )}
                            </h2>
                            {selectedItem.subtitle && (
                              <p className="text-lg text-brand-primary font-heading-bold uppercase tracking-wide">
                                {getLocalizedString(selectedItem.subtitle)}
                              </p>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-white/80 font-body leading-relaxed">
                            {getLocalizedString(
                              selectedItem.contentData?.description,
                              `Discover more about this feature and level up your ${brand.name} adventure`
                            )}
                          </p>

                          {selectedItem.link &&
                            typeof selectedItem.link === 'string' && (
                              <Link
                                href={selectedItem.link}
                                target="_blank"
                                className="group flex items-center gap-3 bg-gradient-to-r from-brand-primary to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary text-white font-display text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_30px_-8px_rgba(248,90,23,0.4)] transform-gpu"
                              >
                                <span className="uppercase tracking-wide">
                                  Open Full Page
                                </span>
                                <SvgIcon
                                  src={shareIcon}
                                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                                />
                              </Link>
                            )}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
