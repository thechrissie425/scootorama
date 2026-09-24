'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { StarIcon } from '@sanity/icons'
import { getImageProps } from '@/lib/imageHelpers'
// 👇 Import shared types
import { BaseBlockProps, LocalizedString, SanityImage } from '@/types'

// Helper to get string from localized field
function getLocalized(text?: LocalizedString, lang: string = 'en') {
  if (!text) return ''
  if (typeof text === 'string') return text
  return text[lang] || text.en || Object.values(text)[0] || ''
}

// --- Types ---
interface SocialProofItem {
  _id: string
  quote: LocalizedString
  type: 'community' | 'industry'
  author: LocalizedString
  role?: LocalizedString
  avatar?: SanityImage
  publicationColor?: string
  starRating?: number
}

// 👇 Extend BaseBlockProps to accept context from page.tsx
export interface SocialProofProps extends BaseBlockProps {
  heading?: LocalizedString
  items: SocialProofItem[]
  layout?: 'grid' | 'masonry'
}

export default function SocialProofSection({
  heading,
  items = [],
  layout = 'grid',
  // 👇 Destructure context props
  market = 'us',
  language = 'en',
}: SocialProofProps) {
  if (!items.length) return null

  const displayHeading = getLocalized(heading, language)

  return (
    <section className="py-24 bg-brandWhite text-black overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {displayHeading && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display text-center mb-16 uppercase tracking-tight"
          >
            {displayHeading}
          </motion.h2>
        )}

        <div
          className={`grid gap-8 ${
            layout === 'masonry'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {items.map((item, idx) => (
            <QuoteCard
              key={item._id}
              item={item}
              index={idx}
              language={language} // Pass language down!
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function QuoteCard({
  item,
  index,
  language,
}: {
  item: SocialProofItem
  index: number
  language: string
}) {
  const isIndustry = item.type === 'industry'

  // Localize text fields
  const quoteText = getLocalized(item.quote, language)
  const authorName = getLocalized(item.author, language)
  const roleText = getLocalized(item.role, language)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`relative p-8 rounded-3xl h-full flex flex-col justify-between
        ${
          isIndustry
            ? 'bg-lightGrey border-l-4'
            : 'bg-lightGrey-light border border-transparent'
        }
      `}
      style={{
        borderColor: isIndustry
          ? item.publicationColor || '#000'
          : 'transparent',
      }}
    >
      {/* 1. THE QUOTE */}
      <blockquote className="mb-8">
        <p
          className={`text-xl leading-relaxed text-darkGrey ${
            isIndustry ? 'font-body-italic' : 'font-body-medium'
          }`}
        >
          “{quoteText}”
        </p>
      </blockquote>

      {/* 2. THE FOOTER */}
      <div className="flex items-center gap-4 mt-auto">
        {/* A. COMMUNITY STYLE */}
        {!isIndustry && (
          <>
            <div className="relative w-12 h-12 flex-shrink-0">
              {item.avatar ? (
                (() => {
                  const avatarProps = getImageProps(
                    item.avatar,
                    'profile',
                    authorName
                  )
                  return avatarProps?.src ? (
                    <Image
                      {...avatarProps}
                      alt={authorName || 'User avatar'}
                      fill
                      sizes="48px"
                      className="rounded-full object-cover border-2 border-brandWhite shadow-sm"
                    />
                  ) : null
                })()
              ) : (
                <div className="w-full h-full bg-brand-primary rounded-full flex items-center justify-center text-white font-heading-bold text-lg">
                  {authorName.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="font-heading-bold text-base text-black leading-none">
                {authorName || 'Unknown'}
              </div>
              <div className="text-sm text-darkGrey mt-1 font-body-medium">
                {roleText}
              </div>
              {item.starRating && (
                <div className="flex gap-0.5 mt-1">
                  {[...Array(Math.floor(item.starRating))].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="w-3 h-3 text-brand-primary fill-current"
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* B. INDUSTRY STYLE */}
        {isIndustry && (
          <div className="flex flex-col">
            <span
              className="text-sm font-heading-bold uppercase tracking-widest"
              style={{ color: item.publicationColor || '#000' }}
            >
              {authorName}
            </span>
            {roleText && (
              <span className="text-xs text-darkGrey font-heading-semibold mt-0.5 uppercase tracking-wide">
                {roleText}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
