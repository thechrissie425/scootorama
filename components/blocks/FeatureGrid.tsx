'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getImageProps, getAnyImageField } from '../../lib/imageHelpers'
import { getCampaign } from '@/app/actions/getCampaign'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { PortableTextBlock } from '@portabletext/types'
import FAQAccordion from '@/app/[market]/[lang]/(site)/campaigns/[slug]/FAQAccordion'
import { BrandButton } from '@/components/ui/BrandButtons'
import { CalendarIcon } from '@sanity/icons'
import SvgIcon from '@/components/ui/SvgIcon'
import closeIcon from '@/icons/system/close.svg'
import shareIcon from '@/icons/system/share.svg'
import ErrorBoundary from '@/components/ErrorBoundary'
import { BaseBlockProps, LocalizedString, SanityImage } from '@/types'

// --- 0. HELPERS ---

// Helper to safely render localized content
const getLocalizedString = (
  content: LocalizedString | undefined,
  language: string = 'en'
): string => {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (typeof content === 'object' && content !== null) {
    const record = content as Record<string, string>
    return (
      record[language] ||
      record.en ||
      (Object.values(record).length > 0 ? Object.values(record)[0] : '') ||
      ''
    )
  }
  return ''
}

// --- 1. TYPES ---

interface FullCampaign {
  title: string
  status: 'upcoming' | 'active' | 'ending' | 'completed'
  dates: { start: string; end: string }
  image: SanityImageSource
  hook: string
  mechanics: string[]
  faqs: { question: string; answer: PortableTextBlock[] }[]
  unlocks: {
    name: string
    image: SanityImageSource
    description?: string
    requirement: string
  }[]
  cta: { label: string; url: string; style: string } | null
  // 👇 FIX: Removed '?' so TS knows this is always an array (empty or not)
  resources: { label: string; url: string; type: string }[]
}

interface ManualItem {
  _type: 'manualItem'
  _key: string
  title: LocalizedString
  subtitle?: LocalizedString
  image: SanityImage
  size: 'square' | 'wide' | 'tall' | 'big'
  theme: 'light' | 'dark'
  link?: string
}

interface ContentReference {
  _type: 'contentReference'
  _key: string
  size: 'square' | 'wide' | 'tall' | 'big'
  theme: 'light' | 'dark'
  overrideTitle?: LocalizedString
  overrideSubtitle?: LocalizedString
  content: {
    _type: 'campaign' | 'feature'
    title: LocalizedString
    slug?: { current: string }
    image?: SanityImage
    status?: string
    description?: LocalizedString
  }
}

type GridItem = ManualItem | ContentReference

interface NormalizedItem {
  _key: string
  title: LocalizedString
  subtitle?: LocalizedString
  image?: SanityImage
  size: 'square' | 'wide' | 'tall' | 'big'
  theme: 'light' | 'dark'
  link?: string
  contentData?: {
    _type: 'campaign' | 'feature'
    title: LocalizedString
    description?: LocalizedString
    status?: string
    slug?: { current: string }
  }
  fullCampaign?: FullCampaign
  [key: string]: unknown
}

export interface FeatureGridProps extends BaseBlockProps {
  heading?: LocalizedString
  items?: GridItem[]
}

// --- 2. GRID UTILS ---

function normalizeGridItem(item: GridItem): NormalizedItem {
  if (item._type === 'manualItem') {
    return {
      _key: item._key,
      title: item.title,
      subtitle: item.subtitle,
      image: item.image,
      size: item.size,
      theme: item.theme,
      link: item.link,
    }
  } else {
    const { content } = item
    let link: string | undefined

    if (content._type === 'campaign' && content.slug) {
      const slugString =
        typeof content.slug.current === 'string'
          ? content.slug.current
          : typeof content.slug === 'string'
            ? content.slug
            : 'campaign'
      link = `/campaigns/${slugString}`
    }

    const image = content.image
    const title = item.overrideTitle || content.title
    const subtitle =
      item.overrideSubtitle ||
      (content._type === 'campaign' ? content.status : content.description)

    return {
      _key: item._key,
      title,
      subtitle,
      image,
      size: item.size,
      theme: item.theme,
      link,
      contentData:
        content._type === 'campaign' || content._type === 'feature'
          ? {
              _type: content._type,
              title: content.title,
              description: content.description,
              status: content.status,
              slug: content.slug,
            }
          : undefined,
    }
  }
}

const SIZE_CLASSES = {
  square: 'md:col-span-1 md:row-span-1',
  wide: 'md:col-span-2 md:row-span-1',
  tall: 'md:col-span-1 md:row-span-2',
  big: 'md:col-span-2 md:row-span-2',
}

// --- 3. MAIN COMPONENT ---

export default function FeatureGrid({
  heading,
  items,
  market: _market = 'us',
  language = 'en',
}: FeatureGridProps) {
  const [selectedItem, setSelectedItem] = useState<NormalizedItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [campaignData, setCampaignData] = useState<FullCampaign | null>(null)

  const displayHeading = getLocalizedString(heading, language)

  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.message?.includes(
          'Objects are not valid as a React child'
        )
      ) {
        // Error detected
      }
    }
    window.addEventListener('unhandledrejection', handleRejection)
    return () =>
      window.removeEventListener('unhandledrejection', handleRejection)
  }, [])

  if (!items || items.length === 0) return null
  const normalizedItems = items.map(normalizeGridItem)

  const fetchCampaignData = async (slug: string) => {
    try {
      setIsLoading(true)
      const rawCampaign = await getCampaign(slug)

      if (rawCampaign) {
        const sanitizedCampaign: FullCampaign = {
          ...rawCampaign,
          title: getLocalizedString(rawCampaign.title, language),
          status: getLocalizedString(rawCampaign.status, language) as any,
          hook: getLocalizedString(rawCampaign.hook, language),
          mechanics:
            rawCampaign.mechanics?.map((m: any) =>
              getLocalizedString(m, language)
            ) || [],
          faqs:
            rawCampaign.faqs?.map((f: any) => ({
              ...f,
              question: getLocalizedString(f.question, language),
            })) || [],
          unlocks:
            rawCampaign.unlocks?.map((u: any) => ({
              ...u,
              name: getLocalizedString(u.name, language),
              description: getLocalizedString(u.description, language),
              requirement: getLocalizedString(u.requirement, language),
            })) || [],
          cta: rawCampaign.cta
            ? {
                ...rawCampaign.cta,
                label: getLocalizedString(rawCampaign.cta.label, language),
              }
            : null,
          resources:
            rawCampaign.resources?.map((r: any) => ({
              ...r,
              label: getLocalizedString(r.label, language),
              type: getLocalizedString(r.type, language),
            })) || [],
        }

        setCampaignData(sanitizedCampaign)
      }
    } catch {
      // Error loading campaign
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemClick = async (item: NormalizedItem) => {
    if (!item.contentData && item.link && typeof item.link === 'string') {
      window.open(item.link, '_blank')
      return
    }

    if (item.contentData?._type === 'campaign' && item.contentData.slug) {
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

  const formatDate = (date: string) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString(
      language === 'en' ? 'en-US' : language,
      {
        month: 'short',
        day: 'numeric',
      }
    )
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 bg-red-900 text-white rounded-lg">
          FeatureGrid Error
        </div>
      }
    >
      <section className="py-20 px-6 bg-brand-ink text-white">
        <div className="container mx-auto max-w-7xl">
          {displayHeading && (
            <h2 className="text-4xl md:text-6xl font-display mb-10 text-center uppercase">
              {displayHeading}
            </h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-4">
            {normalizedItems.map(item => {
              const imageSource = getAnyImageField(item)
              const itemTitle = getLocalizedString(item.title, language)
              const itemSubtitle = getLocalizedString(item.subtitle, language)

              const imageProps = imageSource
                ? getImageProps(imageSource, 'feature', itemTitle || 'Feature')
                : null

              const sizeClass = SIZE_CLASSES[item.size] || SIZE_CLASSES.square
              // Sticker label: solid panel so titles stay legible on any artwork
              // 'light' = light text on a dark label, 'dark' = dark text on a light label
              const labelClass =
                item.theme === 'light'
                  ? 'bg-brand-ink text-brandWhite'
                  : 'bg-brandWhite text-brand-ink'

              return (
                <div
                  key={item._key}
                  onClick={() => handleItemClick(item)}
                  className={`group relative overflow-hidden rounded-3xl bg-brand-ink border-[3px] border-brand-ink ${sizeClass} cursor-pointer hover:border-brand-primary/50 transition-all duration-300 hover:scale-[1.02] transform-gpu`}
                >
                  {imageProps?.src && (
                    <div className="absolute inset-0 w-full h-full z-0">
                      <Image
                        src={imageProps.src}
                        alt={itemTitle || 'Feature'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 100vw"
                      />
                    </div>
                  )}

                  <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-5">
                    <div
                      className={`max-w-[92%] self-start rounded-2xl border-[3px] border-brand-ink px-4 py-3 shadow-[5px_5px_0_0_#241E3A] -rotate-1 transition-transform duration-300 group-hover:rotate-0 ${labelClass}`}
                    >
                      <h3 className="font-display text-xl md:text-2xl uppercase leading-tight">
                        {itemTitle}
                      </h3>
                      {itemSubtitle && (
                        <p className="mt-1 font-heading-semibold text-sm leading-snug opacity-80">
                          {itemSubtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {selectedItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={closeOverlay}
              />

              {selectedItem.contentData?._type === 'campaign' &&
              campaignData &&
              !isLoading ? (
                <div className="relative w-full max-w-6xl mx-4 bg-black rounded-3xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <BrandButton
                    variant="ghost"
                    size="icon"
                    onClick={closeOverlay}
                    className="absolute top-6 right-6 z-50 rounded-full bg-black/80 border border-white/20 text-white hover:bg-white/10"
                  >
                    <SvgIcon src={closeIcon} className="w-6 h-6" />
                  </BrandButton>

                  <div className="min-h-screen bg-black text-white">
                    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-brand-primary/15 via-brand-primary/5 to-transparent blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-brand-secondary/10 via-brand-secondary/3 to-transparent blur-3xl" />
                    </div>

                    <section className="relative z-10 min-h-[60vh] flex items-center py-20">
                      <div className="max-w-7xl mx-auto px-6 w-full">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                          <div className="relative">
                            <div className="relative w-full max-w-lg mx-auto">
                              <div className="relative aspect-[3/4] w-full">
                                {campaignData.image &&
                                  (() => {
                                    const imgProps = getImageProps(
                                      campaignData.image,
                                      'feature',
                                      campaignData.title
                                    )
                                    return imgProps?.src ? (
                                      <Image
                                        {...imgProps}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover rounded-3xl shadow-2xl"
                                        alt={campaignData.title}
                                      />
                                    ) : null
                                  })()}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                                <div className="absolute top-8 left-8 px-6 py-3 bg-black/60 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center gap-3">
                                  <span
                                    className={`w-3 h-3 rounded-full ${campaignData.status === 'active' ? 'bg-brand-lime animate-pulse' : 'bg-brand-primary'}`}
                                  />
                                  <span className="font-heading-bold uppercase tracking-widest text-sm">
                                    {campaignData.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-10 text-center lg:text-left">
                            <div className="space-y-6">
                              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display uppercase tracking-tight leading-[0.85]">
                                <span className="bg-gradient-to-r from-brand-primary via-white to-brand-secondary bg-clip-text text-transparent">
                                  {campaignData.title}
                                </span>
                              </h1>
                              <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-body max-w-xl mx-auto lg:mx-0">
                                {campaignData.hook}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-lg">
                              <CalendarIcon className="w-8 h-8 text-brand-primary" />
                              <span className="text-2xl font-heading-bold tracking-wide text-brand-primary">
                                {formatDate(campaignData.dates?.start)} —{' '}
                                {formatDate(campaignData.dates?.end)}
                              </span>
                            </div>

                            {campaignData.cta && (
                              <div className="pt-8">
                                <a
                                  href={campaignData.cta.url}
                                  className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-brand-primary to-brand-primary-600 text-white font-display text-2xl px-16 py-8 rounded-3xl hover:scale-105 transition-all duration-500"
                                >
                                  <span className="uppercase tracking-wide">
                                    {campaignData.cta.label}
                                  </span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="relative z-10 bg-gradient-to-b from-transparent to-black/20">
                      <div className="max-w-6xl mx-auto px-6 pb-24">
                        {campaignData.unlocks.length > 0 && (
                          <div className="mb-32">
                            <h2 className="text-6xl font-display uppercase tracking-tight mb-20 text-center">
                              Exclusive Rewards
                            </h2>
                            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                              {campaignData.unlocks.map((item, index) => (
                                <div
                                  key={item.name || index}
                                  className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8"
                                >
                                  <div className="w-32 h-32 mx-auto mb-8 relative bg-black/40 rounded-3xl border border-white/20 overflow-hidden">
                                    {item.image &&
                                      (() => {
                                        const uImg = getImageProps(
                                          item.image,
                                          'feature',
                                          item.name
                                        )
                                        return uImg?.src ? (
                                          <Image
                                            {...uImg}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover"
                                            alt={item.name}
                                          />
                                        ) : null
                                      })()}
                                  </div>
                                  <div className="text-center space-y-4">
                                    <h3 className="font-display text-2xl uppercase">
                                      {item.name}
                                    </h3>
                                    <p className="text-white/80 font-body text-sm">
                                      {item.description}
                                    </p>
                                    <div className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/30 rounded-full inline-block">
                                      <p className="text-sm font-heading-bold text-brand-primary uppercase">
                                        {item.requirement}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {campaignData.mechanics.length > 0 && (
                          <div className="mb-32">
                            <h2 className="text-5xl font-display uppercase mb-16 text-center">
                              How It Works
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                              {campaignData.mechanics.map((step, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white/5 border border-white/10 rounded-2xl p-8 relative"
                                >
                                  <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center font-display text-2xl">
                                    {idx + 1}
                                  </div>
                                  <p className="text-lg text-white/80 leading-relaxed font-body pt-4">
                                    {step}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {campaignData.faqs.length > 0 && (
                          <FAQAccordion faqs={campaignData.faqs} />
                        )}

                        {campaignData.resources.length > 0 && (
                          <div className="mb-32 text-center">
                            <h2 className="text-5xl font-display uppercase mb-16">
                              Resources
                            </h2>
                            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
                              {campaignData.resources.map((res, idx) => (
                                <a
                                  key={idx}
                                  href={res.url}
                                  className="bg-white/5 border border-white/10 rounded-2xl p-8 flex items-center justify-between hover:bg-white/10"
                                >
                                  <div className="text-left">
                                    <h3 className="font-heading-bold text-xl">
                                      {res.label}
                                    </h3>
                                    <span className="text-sm font-heading-bold text-brand-primary uppercase">
                                      {res.type}
                                    </span>
                                  </div>
                                  <SvgIcon
                                    src={shareIcon}
                                    className="w-6 h-6 text-white"
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                  <button
                    onClick={closeOverlay}
                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/50 border border-white/20 text-white"
                  >
                    <SvgIcon src={closeIcon} className="w-6 h-6" />
                  </button>

                  {isLoading ? (
                    <div className="p-20 text-center">
                      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (
                    <>
                      {selectedItem.image &&
                        (() => {
                          const itemTitle = getLocalizedString(
                            selectedItem.title,
                            language
                          )
                          const mImg = getImageProps(
                            selectedItem.image,
                            'feature',
                            itemTitle
                          )
                          return mImg?.src ? (
                            <div className="relative h-64 w-full">
                              <Image
                                {...mImg}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                                alt={itemTitle}
                              />
                            </div>
                          ) : null
                        })()}

                      <div className="p-8 space-y-6">
                        <div>
                          <h2 className="text-4xl font-display uppercase tracking-tight text-white">
                            {getLocalizedString(selectedItem.title, language)}
                          </h2>
                          {selectedItem.subtitle && (
                            <p className="text-lg text-brand-primary font-heading-bold uppercase">
                              {getLocalizedString(
                                selectedItem.subtitle,
                                language
                              )}
                            </p>
                          )}
                        </div>

                        {selectedItem.contentData?.description && (
                          <div>
                            <h3 className="text-xl font-heading-bold text-white/90 uppercase mb-2">
                              About
                            </h3>
                            <p className="text-white/80 font-body text-lg">
                              {getLocalizedString(
                                selectedItem.contentData.description,
                                language
                              )}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-4 pt-4">
                          {selectedItem.link && (
                            <Link
                              href={selectedItem.link}
                              target="_blank"
                              className="px-8 py-3 bg-brand-primary text-white font-display uppercase rounded-2xl hover:bg-brand-primary-600"
                            >
                              {selectedItem.contentData?._type === 'campaign'
                                ? 'View Campaign'
                                : 'Learn More'}
                            </Link>
                          )}
                          <button
                            onClick={closeOverlay}
                            className="px-8 py-3 border border-white/20 text-white font-heading-bold uppercase rounded-2xl hover:bg-white/10"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </ErrorBoundary>
  )
}
