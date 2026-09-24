// types/index.ts
import type { TakeoverTheme } from '@/lib/takeoverManager'

/**
 * GLOBAL CONTEXT
 * Passed from Page -> Block to ensure links and currency work correctly.
 */
export interface BlockContext {
  market?: string // e.g., 'us', 'de'
  language?: string // e.g., 'en', 'fr'
  takeoverTheme?: TakeoverTheme | null // Campaign theme override
}

/**
 * SANITY PRIMITIVES
 * Standard shapes returned by your GROQ queries.
 */

// Your robust Image type
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
    // Optional metadata often fetched in queries
    metadata?: {
      lqip?: string
      dimensions?: {
        aspectRatio: number
        width: number
        height: number
      }
    }
  }
  alt?: string | null
  hotspot?: { x: number; y: number } | null
  crop?: { top: number; bottom: number; left: number; right: number } | null
}

// Your standard CTA object from Sanity
export interface SanityCTA {
  label?: string
  linkType?: 'internal' | 'external'
  externalUrl?: string
  internalLink?: {
    _type: string
    slug?: string
    title?: string
  }
}

// Link Reference for Header component (supports legacy slug format)
export interface LinkReference extends SanityCTA {
  slug?: string | { current: string }
}

// Navigation Item for Header
export interface NavItem {
  _key: string
  label: string
  link?: {
    slug: string
  }
  type: 'simple' | 'mega' | 'link'
  subLinks?: SubLink[]
  featuredCard?: FeaturedCard
}

export interface SubLink {
  _key: string
  title: string
  description?: string
  icon?: string
  url?: string
  targetPage?: {
    slug: string
  }
}

export interface FeaturedCard {
  heading: string
  image: SanityImage
  link: {
    slug: string
  }
}

// Common Product interface
export interface Product {
  _id: string
  title: string
  slug: {
    current: string
  }
  image?: SanityImage
  marketData?: {
    price: number
    compareAtPrice?: number
    currency: string
    region: string
  }
  stickers?: Array<{
    label: string
    type: string
    color: string
  }>
}

// Helper for text that might be a string OR a localized object
export type LocalizedString = string | { [key: string]: string }

/**
 * UTILITY FUNCTIONS
 */

// Helper to extract localized text consistently
export const getLocalizedText = (
  text: LocalizedString | undefined,
  language = 'en'
): string => {
  if (typeof text === 'string') return text
  if (!text || typeof text !== 'object') return ''
  return text[language] || text.en || Object.values(text)[0] || ''
}

// Helper to safely extract string values from various formats
export const unwrapString = (str: any): string => {
  if (!str) return ''
  if (typeof str === 'string') return str
  return str.en || str.us || Object.values(str)[0] || ''
}

/**
 * BASE BLOCK PROPS
 * All your components should extend this.
 */
export interface BaseBlockProps extends BlockContext {
  _type?: string
  _key?: string
  // Common visual props
  theme?: 'light' | 'dark' | string
}

/**
 * COMPONENT-SPECIFIC INTERFACES
 */

// Hero Component Props
export interface HeroProps extends BaseBlockProps {
  heading: LocalizedString
  subheading?: LocalizedString
  cta?: SanityCTA
  backgroundImage?: SanityImage
  layout?: 'center' | 'left' | 'bottom-left'
  priority?: 'high' | 'normal' | 'low'
  ariaLabel?: string
}

// Header Component Props
export interface HeaderProps extends BaseBlockProps {
  navItems?: NavItem[]
  logo?: SanityImage
  ctaLabel?: string
  ctaLink?: string
}

// Content Display Props
export interface ContentDisplayProps extends BaseBlockProps {
  heading?: LocalizedString
  layout: 'grid' | 'carousel' | 'expandingCarousel'
  items?: any[] // Use any[] to allow flexibility for the complex union types in ContentDisplay
}

export interface ContentItem {
  _key: string
  _type: 'manualItem' | 'contentReference'
  title?: LocalizedString
  subtitle?: LocalizedString
  image?: SanityImage
  content?: Product | any // Can be extended for other content types
}

// Product Grid Props
export interface ProductGridProps extends BaseBlockProps {
  heading?: LocalizedString
  products?: Product[]
  columns?: 2 | 3 | 4
  showPricing?: boolean
  ctaText?: LocalizedString
}

// Additional Component Interfaces
export interface HeroProductProps extends BaseBlockProps {
  eyebrow?: LocalizedString
  title?: LocalizedString
  description?: LocalizedString
  backgroundImage?: SanityImage
  image?: SanityImage
  imageAlt?: string
  cta?: SanityCTA
  features?: Array<{
    _key: string
    title?: LocalizedString
    description?: LocalizedString
    icon?: string
  }>
}

export interface FirecrackerProps extends BaseBlockProps {
  layout?: 'banner' | 'takeover'
  heading?: string
  subheading?: string
  backgroundColor?: string
  textColor?: string
  buttonText?: string
  buttonUrl?: string
  // Add all other firecracker fields as needed
}

export interface RiverProps extends BaseBlockProps {
  heading?: LocalizedString
  subtitle?: LocalizedString
  items?: Array<{
    _key: string
    title?: LocalizedString
    description?: LocalizedString
    image?: SanityImage
  }>
}

export interface CarouselProps extends BaseBlockProps {
  heading?: LocalizedString
  layout?: 'carousel' | 'expandingCarousel'
  items?: Array<{
    _key: string
    title?: LocalizedString
    thumbnail?: SanityImage
    videoUrl?: string
    overlayHeading?: LocalizedString
    content?: any // PortableText content
  }>
}
