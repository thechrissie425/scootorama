'use client'

import React from 'react'
import Image from 'next/image'
import { CalendarIcon } from '@sanity/icons'
import dynamic from 'next/dynamic'
import type { PortableTextBlock } from '@portabletext/types'
import { getImageProps } from '../../lib/imageHelpers'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { Button } from '@/components/ui/button'
import type { TakeoverTheme } from '@/lib/takeoverManager'

// Helper to safely render localized content
const getLocalizedString = (
  content: string | { [key: string]: string }
): string => {
  if (typeof content === 'string') return content
  return content?.en || Object.values(content)[0] || ''
}

// --- TRANSLATION DICTIONARY ---
const translations = {
  'en-US': {
    exclusiveRewards: 'Exclusive Rewards',
    premiumUnlocks: 'Premium unlocks waiting for you to claim',
    mechanics: 'How It Works',
    requirements: 'Requirements',
    faq: 'Frequently Asked Questions',
    upcoming: 'upcoming',
    active: 'active',
    ending: 'ending',
    completed: 'completed',
  },
  'de-DE': {
    exclusiveRewards: 'Exklusive Belohnungen',
    premiumUnlocks:
      'Premium-Freischaltungen warten darauf, beansprucht zu werden',
    mechanics: 'Wie es funktioniert',
    requirements: 'Voraussetzungen',
    faq: 'Häufig gestellte Fragen',
    upcoming: 'bevorstehend',
    active: 'aktiv',
    ending: 'endend',
    completed: 'abgeschlossen',
  },
  'fr-FR': {
    exclusiveRewards: 'Récompenses exclusives',
    premiumUnlocks: 'Des déblocages premium vous attendent',
    mechanics: 'Comment ça marche',
    requirements: 'Exigences',
    faq: 'Questions fréquemment posées',
    upcoming: 'à venir',
    active: 'actif',
    ending: 'se terminant',
    completed: 'terminé',
  },
  'es-ES': {
    exclusiveRewards: 'Recompensas exclusivas',
    premiumUnlocks: 'Desbloqueos premium esperándote',
    mechanics: 'Cómo funciona',
    requirements: 'Requisitos',
    faq: 'Preguntas frecuentes',
    upcoming: 'próximo',
    active: 'activo',
    ending: 'terminando',
    completed: 'completado',
  },
  'ja-JP': {
    exclusiveRewards: '限定報酬',
    premiumUnlocks: 'プレミアムアンロックがあなたを待っています',
    mechanics: '仕組み',
    requirements: '要件',
    faq: 'よくある質問',
    upcoming: '開催予定',
    active: '開催中',
    ending: '終了間近',
    completed: '完了',
  },
} as const

type SupportedLocale = keyof typeof translations

// Helper function to get translation
const translate = (
  locale: string,
  key: keyof (typeof translations)['en-US']
): string => {
  const supportedLocale = locale as SupportedLocale
  return translations[supportedLocale]?.[key] || translations['en-US'][key]
}

// Dynamic import for client component
const FAQAccordion = dynamic(
  () => import('@/app/[market]/[lang]/(site)/campaigns/[slug]/FAQAccordion'),
  {
    ssr: false,
  }
)

// Campaign type definition
interface Campaign {
  title: string
  status: 'upcoming' | 'active' | 'ending' | 'completed'
  dates: { start: string; end: string }
  image: SanityImageSource // Changed from string to Sanity image object
  logo?: SanityImageSource // Custom campaign logo
  primaryColor?: { hex: string } // Primary brand color
  secondaryColor?: { hex: string } // Secondary brand color
  hook: string
  mechanics: string[]
  faqs: { question: string; answer: PortableTextBlock[] }[]
  unlocks: {
    _key?: string
    name: string
    image: SanityImageSource // Changed from string to Sanity image object
    description?: string
    requirement: string
  }[]
  cta: { label: string; url: string; style: string }
  resources?: { label: string; url: string; type: string }[]
}

interface CampaignContentProps {
  campaign: Campaign
  isModal?: boolean
  locale?: string
  takeoverTheme?: TakeoverTheme | null
}

export default function CampaignContent({
  campaign,
  isModal = false,
  locale = 'en-US',
  takeoverTheme = null,
}: CampaignContentProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  // Get theme colors or fall back to brand defaults
  const primaryColor =
    takeoverTheme?.colors?.primary?.hex ||
    campaign.primaryColor?.hex ||
    '#D6117A' // brand primary
  const secondaryColor =
    takeoverTheme?.colors?.secondary?.hex ||
    campaign.secondaryColor?.hex ||
    '#00858C' // brand secondary
  const hasCustomBranding = !!(
    campaign.logo ||
    campaign.primaryColor ||
    campaign.secondaryColor
  )

  return (
    <div
      className={`${isModal ? '' : 'min-h-screen main'} bg-black text-white`}
      style={
        {
          '--campaign-primary': primaryColor,
          '--campaign-secondary': secondaryColor,
        } as React.CSSProperties
      }
    >
      {/* Dramatic Background Effects - only for full page */}
      {!isModal && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[800px] h-[800px] blur-3xl opacity-15"
            style={{
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] blur-3xl opacity-10"
            style={{
              background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)`,
            }}
          />
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-gradient-to-br from-transparent via-white/[0.02] to-transparent" />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        className={`relative z-10 ${isModal ? 'min-h-[60vh]' : 'min-h-[90vh]'} flex items-center ${isModal ? 'py-20' : 'pt-header pb-20'}`}
      >
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative w-full max-w-lg mx-auto">
                <div className="relative aspect-[3/4] w-full">
                  {campaign.image && (
                    <Image
                      {...getImageProps(
                        campaign.image,
                        'feature',
                        getLocalizedString(campaign.title)
                      )!}
                      alt={
                        getLocalizedString(campaign.title) || 'Campaign image'
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-[92%_center] rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
                    />
                  )}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  <div className="absolute top-8 left-8">
                    <div className="px-6 py-3 bg-black/60 backdrop-blur-2xl border border-white/20 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full shadow-lg animate-pulse"
                          style={{
                            backgroundColor:
                              campaign.status === 'active'
                                ? '#10B981'
                                : primaryColor,
                            boxShadow: `0 0 20px ${campaign.status === 'active' ? 'rgba(16, 185, 129, 0.5)' : primaryColor + '80'}`,
                          }}
                        />
                        <span className="font-heading-bold uppercase tracking-widest text-sm">
                          {translate(
                            locale,
                            campaign.status as keyof (typeof translations)['en-US']
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10 text-center lg:text-left">
              {/* Custom Logo if available */}
              {campaign.logo &&
                typeof campaign.logo === 'object' &&
                'asset' in campaign.logo && (
                  <div className="flex justify-center lg:justify-start">
                    <div className="relative">
                      <Image
                        src={campaign.logo.asset?.url || ''}
                        alt={`${getLocalizedString(campaign.title)} logo`}
                        height={isModal ? 120 : 160}
                        width={600}
                        className={`object-contain ${isModal ? 'h-[120px]' : 'h-40'} w-auto max-w-2xl`}
                        style={{
                          filter: `drop-shadow(0 0 16px ${primaryColor}60)`,
                        }}
                      />
                    </div>
                  </div>
                )}

              {/* Only show title if no logo */}
              {!campaign.logo && (
                <div className="space-y-6">
                  <h1
                    className={`${isModal ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-6xl md:text-7xl lg:text-8xl'} font-display uppercase tracking-tight leading-[0.85]`}
                  >
                    <span
                      className={
                        hasCustomBranding
                          ? 'bg-gradient-to-r bg-clip-text text-transparent'
                          : 'bg-gradient-to-r from-brand-primary via-white to-brand-secondary bg-clip-text text-transparent'
                      }
                      style={
                        hasCustomBranding
                          ? {
                              backgroundImage: `linear-gradient(to right, ${primaryColor}, white, ${secondaryColor})`,
                            }
                          : undefined
                      }
                    >
                      {getLocalizedString(campaign.title)}
                    </span>
                  </h1>
                </div>
              )}

              <div className="space-y-6">
                <div className="max-w-xl mx-auto lg:mx-0">
                  <p
                    className={`${isModal ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'} text-white/80 leading-relaxed font-body`}
                  >
                    {getLocalizedString(campaign.hook)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-lg">
                <CalendarIcon
                  className="w-8 h-8"
                  style={{ color: primaryColor }}
                />
                <span
                  className={`${isModal ? 'text-xl' : 'text-2xl'} font-heading-bold tracking-wide`}
                  style={{ color: primaryColor }}
                >
                  {formatDate(campaign.dates?.start)} —{' '}
                  {formatDate(campaign.dates?.end)}
                </span>
              </div>

              {campaign.cta && (
                <div className="pt-8">
                  <Button
                    variant="playful"
                    size={isModal ? 'default' : 'lg'}
                    asChild
                    className="gap-4"
                    style={{
                      background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd)`,
                      boxShadow: `0 20px 40px -8px ${primaryColor}40`,
                      borderColor: primaryColor,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `linear-gradient(to right, ${primaryColor}dd, ${primaryColor})`
                      e.currentTarget.style.boxShadow = `0 25px 50px -8px ${primaryColor}60`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd)`
                      e.currentTarget.style.boxShadow = `0 20px 40px -8px ${primaryColor}40`
                    }}
                  >
                    <a href={campaign.cta.url}>
                      {getLocalizedString(campaign.cta.label)}
                      <svg
                        className="w-6 h-6 transition-all duration-300 group-hover:translate-x-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative z-10 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-6xl mx-auto px-6 pb-24">
          {/* Unlocks Section */}
          {campaign.unlocks && (
            <div className="mb-32">
              <div className="text-center mb-20">
                <h2
                  className={`${isModal ? 'text-4xl md:text-5xl' : 'text-6xl md:text-7xl'} font-display uppercase tracking-tight mb-6`}
                >
                  <span
                    className={
                      hasCustomBranding
                        ? 'bg-gradient-to-r bg-clip-text text-transparent'
                        : 'bg-gradient-to-r from-brand-primary via-white to-brand-secondary bg-clip-text text-transparent'
                    }
                    style={
                      hasCustomBranding
                        ? {
                            backgroundImage: `linear-gradient(to right, ${primaryColor}, white, ${secondaryColor})`,
                          }
                        : undefined
                    }
                  >
                    {translate(locale, 'exclusiveRewards')}
                  </span>
                </h2>
                <p
                  className={`${isModal ? 'text-lg' : 'text-xl'} text-white/60 font-body max-w-2xl mx-auto`}
                >
                  {translate(locale, 'premiumUnlocks')}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {campaign.unlocks.map((item, index) => (
                  <div
                    key={item._key || `unlock-${index}`}
                    className="group relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] transform-gpu"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = `${primaryColor}80`
                      e.currentTarget.style.boxShadow = `0 25px 50px -12px ${primaryColor}30`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor =
                        'rgba(255, 255, 255, 0.2)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div className="relative z-10">
                      <div className="w-32 h-32 mx-auto mb-8 relative">
                        <div className="relative w-full h-full group-hover:border-white/40 transition-all duration-500">
                          {item.image && (
                            <Image
                              {...getImageProps(
                                item.image,
                                'thumbnail',
                                getLocalizedString(item.name)
                              )!}
                              alt={
                                getLocalizedString(item.name) ||
                                'Campaign item image'
                              }
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover p-0 group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                          )}
                        </div>
                      </div>

                      <div className="text-center space-y-4">
                        <div className="px-4 py-2">
                          <p
                            className="text-sm font-heading-bold uppercase tracking-wide"
                            style={{ color: secondaryColor }}
                          >
                            {getLocalizedString(item.requirement)}
                          </p>
                        </div>
                        <h3
                          className="font-display text-2xl uppercase tracking-tight transition-colors duration-300"
                          onMouseEnter={e => {
                            e.currentTarget.style.color = primaryColor
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = 'white'
                          }}
                        >
                          {getLocalizedString(item.name)}
                        </h3>
                        {item.description && (
                          <p className="text-white/80 font-body text-sm leading-relaxed px-2">
                            {getLocalizedString(item.description)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How it Works */}
          {campaign.mechanics && campaign.mechanics.length > 0 && (
            <div className="mb-32">
              <h2
                className={`${isModal ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl'} font-display uppercase tracking-tight mb-16 text-center`}
              >
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  {translate(locale, 'mechanics')}
                </span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {campaign.mechanics.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div
                      className="absolute -top-6 -left-6 w-16 h-16 rounded-full text-white flex items-center justify-center font-display text-2xl shadow-lg transition-all duration-300 z-10"
                      style={{
                        background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd)`,
                        boxShadow: `0 0 20px ${primaryColor}30`,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = `0 0 30px ${primaryColor}50`
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = `0 0 20px ${primaryColor}30`
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 pt-12 h-full group-hover:border-white/20 transition-all duration-300">
                      <p className="text-lg text-white/80 leading-relaxed font-body">
                        {getLocalizedString(step)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs - Using Client Component for interactivity */}
          {campaign.faqs && campaign.faqs.length > 0 && (
            <FAQAccordion faqs={campaign.faqs} locale={locale} />
          )}

          {/* Resources */}
          {campaign.resources && (
            <div className="mb-32">
              <div className="text-center mb-16">
                <h2
                  className={`${isModal ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl'} font-display uppercase tracking-tight mb-4`}
                >
                  <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Resources
                  </span>
                </h2>
                <p className="text-lg text-white/60 font-body">
                  Essential downloads and links
                </p>
              </div>

              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
                {campaign.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] transform-gpu"
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = `${primaryColor}80`
                      e.currentTarget.style.boxShadow = `0 15px 35px -8px ${primaryColor}20`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor =
                        'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3
                          className="font-heading-bold text-xl transition-colors duration-300"
                          onMouseEnter={e => {
                            e.currentTarget.style.color = primaryColor
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = 'white'
                          }}
                        >
                          {getLocalizedString(res.label)}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-heading-bold px-3 py-1 rounded-full uppercase tracking-wide"
                            style={{
                              backgroundColor: `${primaryColor}10`,
                              borderColor: `${primaryColor}30`,
                              color: primaryColor,
                              border: '1px solid',
                            }}
                          >
                            {getLocalizedString(res.type)}
                          </span>
                        </div>
                      </div>
                      <svg
                        className="w-8 h-8 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: primaryColor }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Export the Campaign type for reuse
export type { Campaign }
