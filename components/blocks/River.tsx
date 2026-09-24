'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { getVideoUrl } from '@/lib/fileHelpers'
import { BaseBlockProps, LocalizedString, SanityImage } from '@/types'

// --- TYPES ---
interface RiverItem {
  _key: string
  layout?: 'left' | 'right' | 'auto'

  // Data from reference path
  featureRef?: {
    title: LocalizedString
    description: LocalizedString
    image?: SanityImage
    videoUrl?: { asset: { _ref?: string; url?: string } }
  }

  // Data from manual path
  title?: LocalizedString
  description?: LocalizedString
  image?: SanityImage
  videoUrl?: { asset: { _ref?: string; url?: string } }
}

// 👇 Extend BaseBlockProps so this component can accept 'market' and 'language' without crashing
export interface RiverProps extends BaseBlockProps {
  heading?: LocalizedString
  subtitle?: LocalizedString
  items?: RiverItem[]
}

// Helper to safely get localized text
function getLocalized(text?: LocalizedString, lang: string = 'en') {
  if (!text) return ''
  if (typeof text === 'string') return text
  return text[lang] || text.en || Object.values(text)[0] || ''
}

export default function River({
  heading,
  subtitle,
  items = [],
  // 👇 Receive the props from page.tsx loop
  market = 'us',
  language = 'en',
}: RiverProps) {
  if (!items || items.length === 0) return null

  // Localized Section Headers
  const sectionHeading = getLocalized(heading, language)
  const sectionSubtitle = getLocalized(subtitle, language)

  // Helpers to extract data
  const getItemTitle = (item: RiverItem) => {
    return (
      getLocalized(item.featureRef?.title || item.title, language) || 'Untitled'
    )
  }

  const getItemDescription = (item: RiverItem) => {
    return (
      getLocalized(
        item.featureRef?.description || item.description,
        language
      ) || 'No description available.'
    )
  }

  const getItemImage = (item: RiverItem) => item.featureRef?.image || item.image
  const getItemVideo = (item: RiverItem) =>
    item.featureRef?.videoUrl || item.videoUrl

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* SECTION HEADER */}
        {(sectionHeading || sectionSubtitle) && (
          <div className="max-w-3xl mx-auto text-center mb-24">
            {sectionHeading && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-5xl md:text-6xl text-grey-dark uppercase mb-6"
              >
                {sectionHeading}
              </motion.h2>
            )}
            {sectionSubtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="font-body-medium text-xl text-gray-600 leading-relaxed"
              >
                {sectionSubtitle}
              </motion.p>
            )}
          </div>
        )}

        {/* RIVER FLOW */}
        <div className="space-y-32">
          {items.map((item, index) => {
            // Determine layout
            let isImageRight = false
            if (item.layout === 'left') isImageRight = false
            else if (item.layout === 'right') isImageRight = true
            else isImageRight = index % 2 === 0 // Auto zig-zag

            const itemImage = getItemImage(item)
            const itemVideo = getItemVideo(item)
            const title = getItemTitle(item)
            const desc = getItemDescription(item)

            return (
              <motion.div
                key={item._key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${
                  isImageRight ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* TEXT SIDE */}
                <div className="flex-1 text-center lg:text-left space-y-6">
                  <h3 className="font-heading-bold text-4xl text-grey-dark mb-4">
                    {title}
                  </h3>
                  <p className="font-body-medium text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                    {desc}
                  </p>
                </div>

                {/* MEDIA SIDE */}
                <div className="flex-1 w-full relative">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-lightGrey group">
                    {itemVideo?.asset && getVideoUrl(itemVideo.asset) ? (
                      <video
                        src={getVideoUrl(itemVideo.asset)}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="object-cover w-full h-full"
                      />
                    ) : itemImage?.asset ? (
                      <Image
                        src={urlFor(itemImage).width(1200).height(900).url()}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center">
                          <div className="text-2xl mb-2">📷</div>
                          <div className="text-sm">No Media Available</div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
