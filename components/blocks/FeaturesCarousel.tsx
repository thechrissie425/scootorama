'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SvgIcon from '@/components/ui/SvgIcon'
import arrowLeftIcon from '@/icons/system/arrow-left.svg'
import arrowRightIcon from '@/icons/system/arrow-right.svg'
import groupIcon from '@/icons/ui/markers/marker-group-leader.svg'
import wrenchIcon from '@/icons/system/settings-wrench.svg'
import powerIcon from '@/icons/ui/power.svg'
import Firecracker from './Firecracker'
import River from './River'
import { StatsGrid } from './StatsGrid'
import Carousel from './Carousel'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'
import { BaseBlockProps } from '@/types'

// --- TRANSLATION FALLBACKS ---
// We keep this dictionary for "Micro-Copy" (like "of", "perfect for")
// that hasn't been moved to Sanity Site Settings yet.
const translations = {
  en: {
    productInfo: 'Product Information',
    productInfoDesc: 'Everything you need to know about this product',
    keyFeatures: 'Key Features',
    techSpecs: 'Tech Specs',
    whoItsFor: "Who It's For",
    of: 'of',
    specificationCategory: 'specification category',
    specificationCategories: 'specification categories',
    perfectFor: 'Perfect for',
    typeOfRiders: 'type of riders',
    typesOfRiders: 'types of riders',
  },
  de: {
    productInfo: 'Produktinformationen',
    productInfoDesc: 'Alles, was Sie über dieses Produkt wissen müssen',
    keyFeatures: 'Hauptmerkmale',
    techSpecs: 'Technische Daten',
    whoItsFor: 'Für wen ist es',
    of: 'von',
    specificationCategory: 'Spezifikationskategorie',
    specificationCategories: 'Spezifikationskategorien',
    perfectFor: 'Perfekt für',
    typeOfRiders: 'Fahrertyp',
    typesOfRiders: 'Fahrertypen',
  },
  fr: {
    productInfo: 'Informations sur le produit',
    productInfoDesc: 'Tout ce que vous devez savoir sur ce produit',
    keyFeatures: 'Caractéristiques principales',
    techSpecs: 'Spécifications techniques',
    whoItsFor: 'Pour qui',
    of: 'sur',
    specificationCategory: 'catégorie de spécification',
    specificationCategories: 'catégories de spécifications',
    perfectFor: 'Parfait pour',
    typeOfRiders: 'type de rider',
    typesOfRiders: 'types de riders',
  },
  es: {
    productInfo: 'Información del producto',
    productInfoDesc: 'Todo lo que necesitas saber sobre este producto',
    keyFeatures: 'Características principales',
    techSpecs: 'Especificaciones técnicas',
    whoItsFor: 'Para quién es',
    of: 'de',
    specificationCategory: 'categoría de especificación',
    specificationCategories: 'categorías de especificaciones',
    perfectFor: 'Perfecto para',
    typeOfRiders: 'tipo de rider',
    typesOfRiders: 'tipos de riders',
  },
  ja: {
    productInfo: '製品情報',
    productInfoDesc: 'この製品について知っておくべきすべて',
    keyFeatures: '主な機能',
    techSpecs: '技術仕様',
    whoItsFor: '対象者',
    of: '/',
    specificationCategory: '仕様カテゴリ',
    specificationCategories: '仕様カテゴリ',
    perfectFor: '最適',
    typeOfRiders: 'タイプのライダー',
    typesOfRiders: 'タイプのライダー',
  },
} as const

type SupportedLanguage = keyof typeof translations

function getTranslation(
  language: string,
  key: keyof typeof translations.en
): string {
  const lang = language.split('-')[0] as SupportedLanguage
  return translations[lang]?.[key] || translations.en[key]
}

// --- SANITY HELPERS ---

// Helper for UI Labels (short codes: en, es, fr)
// Matches the structure from your fieldHelpers.ts
function getLabel(field: any, language: string): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  const lang = language.split('-')[0]
  return field[lang] || field.en || ''
}

// Helper to extract localized text from Sanity's Content fields
// (Handles legacy enUS long codes if present)
function getLocalizedText(field: any, language: string): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  const lang = language.split('-')[0] as SupportedLanguage

  const langMap: { [key: string]: string } = {
    en: 'enUS',
    de: 'deDE',
    fr: 'frFR',
    es: 'esES',
    ja: 'jaJP',
  }

  // Try short code first (new schema), then long code (legacy)
  return field[lang] || field[langMap[lang]] || field.en || field.enUS || ''
}

// --- TYPES ---

interface TechSpec {
  category: string | any
  specs: {
    label: string | any
    specType?: 'single' | 'range' | 'text'
    value?: number
    minValue?: number
    maxValue?: number
    unit: string
    description?: string | any
    textValue?: string | any
  }[]
}

interface WhoIsItFor {
  title: string
  subtitle: string
  icon: 'Users' | 'Wrench' | 'Zap'
  features: string[]
}

interface FeaturesCarouselProps extends BaseBlockProps {
  features: any[]
  techSpecs?: TechSpec[]
  whoIsItFor?: WhoIsItFor[]
  productType?: 'cruiser' | 'kickstand' | 'controller' | 'other'
  // 🆕 Added prop for Site Settings Labels
  uiLabels?: {
    productInfo?: any
    keyFeatures?: any
    techSpecs?: any
    whoItsFor?: any
  }
}

export default function FeaturesCarousel({
  features,
  techSpecs = [],
  whoIsItFor = [],
  uiLabels, // 👈 Destructure the new prop
  productType: _productType,
  market: _market = 'us',
  language = 'en',
}: FeaturesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  // Open on the first tab that has content
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'who'>(
    features?.length ? 'features' : techSpecs.length ? 'specs' : 'who'
  )
  const { formatWeight, formatNumber, measurements } = useMarketFormatting()

  const whoIsItForData = whoIsItFor

  // 🆕 DYNAMIC TRANSLATIONS
  // Prioritize Sanity data. Fallback to hardcoded dictionary if missing.
  const t = {
    productInfo:
      getLabel(uiLabels?.productInfo, language) ||
      getTranslation(language, 'productInfo'),
    keyFeatures:
      getLabel(uiLabels?.keyFeatures, language) ||
      getTranslation(language, 'keyFeatures'),
    techSpecs:
      getLabel(uiLabels?.techSpecs, language) ||
      getTranslation(language, 'techSpecs'),
    whoItsFor:
      getLabel(uiLabels?.whoItsFor, language) ||
      getTranslation(language, 'whoItsFor'),
  }

  const formatSpecValue = (spec: TechSpec['specs'][0]) => {
    const { specType, value, minValue, maxValue, unit, textValue } = spec

    if (textValue || specType === 'text') {
      return getLocalizedText(textValue, language)
    }

    if (
      specType === 'range' &&
      minValue !== undefined &&
      maxValue !== undefined
    ) {
      return formatRange(minValue, maxValue, unit)
    }

    if (specType === 'single' || (value !== undefined && value !== null)) {
      if (value !== undefined && value !== null) {
        return formatSingleValue(value, unit)
      }
    }

    return 'N/A'
  }

  const formatRange = (min: number, max: number, unit: string): string => {
    switch (unit) {
      case 'feet-inches':
        if (measurements.distance === 'mi') {
          const minFeet = Math.floor(min / 12)
          const minInchesRemainder = Math.round(min % 12)
          const maxFeet = Math.floor(max / 12)
          const maxInchesRemainder = Math.round(max % 12)
          const formatFeetInches = (feet: number, inches: number) =>
            inches === 0 ? `${feet}'` : `${feet}'${inches}"`
          return `${formatFeetInches(minFeet, minInchesRemainder)} – ${formatFeetInches(maxFeet, maxInchesRemainder)}`
        } else {
          const minCm = min * 2.54
          const maxCm = max * 2.54
          return `${formatNumber(minCm)} – ${formatNumber(maxCm)} cm`
        }
      case 'centimeters':
        if (measurements.distance === 'mi') {
          const minInches = min / 2.54
          const maxInches = max / 2.54
          return `${formatNumber(minInches, 1)} – ${formatNumber(maxInches, 1)} in`
        }
        return `${formatNumber(min)} – ${formatNumber(max)} cm`
      case 'inches':
        if (measurements.distance === 'km') {
          const minCm = min * 2.54
          const maxCm = max * 2.54
          return `${formatNumber(minCm, 1)} – ${formatNumber(maxCm, 1)} cm`
        }
        return `${formatNumber(min, 1)} – ${formatNumber(max, 1)} in`
      case 'kilograms':
        return `${formatWeight(min)} – ${formatWeight(max)}`
      case 'pounds':
        if (measurements.weight === 'kg') {
          return `${formatWeight(min * 0.453592)} – ${formatWeight(max * 0.453592)}`
        }
        return `${formatNumber(min)} – ${formatNumber(max)} lbs`
      case 'watts':
        return `${formatNumber(min)} – ${formatNumber(max)}W`
      case 'percent':
        return `${formatNumber(min)} – ${formatNumber(max)}%`
      default:
        return `${formatNumber(min)} – ${formatNumber(max)}`
    }
  }

  const formatSingleValue = (value: number, unit: string): string => {
    switch (unit) {
      case 'kilograms':
        return formatWeight(value)
      case 'pounds':
        return measurements.weight === 'kg'
          ? formatWeight(value * 0.453592)
          : `${formatNumber(value)} lbs`
      case 'centimeters':
        if (measurements.distance === 'mi') {
          const inches = value / 2.54
          return `${formatNumber(inches, 1)} in`
        }
        return `${formatNumber(value)} cm`
      case 'millimeters':
        if (measurements.distance === 'mi') {
          const inches = value / 25.4
          return `${formatNumber(inches, 1)} in`
        }
        return `${formatNumber(value)} mm`
      case 'inches':
        if (measurements.distance === 'km') {
          const cm = value * 2.54
          return `${formatNumber(cm, 1)} cm`
        }
        return `${formatNumber(value, 1)} in`
      case 'feet-inches':
        if (measurements.distance === 'mi') {
          const feet = Math.floor(value / 12)
          const inches = Math.round(value % 12)
          return inches === 0 ? `${feet}'` : `${feet}'${inches}"`
        } else {
          const cm = value * 2.54
          return `${formatNumber(cm)} cm`
        }
      case 'watts':
        return `${formatNumber(value)}W`
      case 'percent':
        return `${formatNumber(value)}%`
      default:
        return formatNumber(value)
    }
  }

  const nextFeature = () => {
    setCurrentIndex(prev => (prev + 1) % features.length)
  }

  const prevFeature = () => {
    setCurrentIndex(prev => (prev - 1 + features.length) % features.length)
  }

  const goToFeature = (index: number) => {
    setCurrentIndex(index)
  }

  const renderFeature = (feature: any) => {
    switch (feature._type) {
      case 'firecracker':
        return <Firecracker {...feature} />
      case 'river':
        return <River {...feature} />
      case 'statsGrid':
        return <StatsGrid theme="dark" stats={feature.stats} />
      case 'carousel':
        return <Carousel {...feature} />
      default:
        return null
    }
  }

  features = features || []
  if (!features.length && !techSpecs.length && !whoIsItFor.length) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-b from-black to-neutral-950 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {/* 🟢 UPDATED: Uses dynamic 't.productInfo' */}
          <h2 className="text-4xl md:text-6xl font-display uppercase text-white mb-4 tracking-tight">
            {t.productInfo}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {getTranslation(language, 'productInfoDesc')}
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center mt-8">
            <div className="bg-neutral-800/50 rounded-full p-1 inline-flex">
              {features.length > 0 && (
                <button
                  onClick={() => setActiveTab('features')}
                  className={`px-6 py-2 rounded-full font-heading-semibold transition-all duration-200 ${
                    activeTab === 'features'
                      ? 'bg-brand-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {/* 🟢 UPDATED */}
                  {t.keyFeatures}
                </button>
              )}
              {techSpecs.length > 0 && (
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-6 py-2 rounded-full font-heading-semibold transition-all duration-200 ${
                    activeTab === 'specs'
                      ? 'bg-brand-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {/* 🟢 UPDATED */}
                  {t.techSpecs}
                </button>
              )}
              {whoIsItForData.length > 0 && (
                <button
                  onClick={() => setActiveTab('who')}
                  className={`px-6 py-2 rounded-full font-heading-semibold transition-all duration-200 ${
                    activeTab === 'who'
                      ? 'bg-brand-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {/* 🟢 UPDATED */}
                  {t.whoItsFor}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {/* Features Tab */}
            {activeTab === 'features' && features.length > 0 && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative min-h-[400px] mb-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -300 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="w-full"
                    >
                      {renderFeature(features[currentIndex])}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Feature Navigation Controls */}
                {features.length > 1 && (
                  <>
                    <button
                      onClick={prevFeature}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
                      aria-label="Previous feature"
                    >
                      <SvgIcon src={arrowLeftIcon} className="w-6 h-6" />
                    </button>

                    <button
                      onClick={nextFeature}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
                      aria-label="Next feature"
                    >
                      <SvgIcon src={arrowRightIcon} className="w-6 h-6" />
                    </button>

                    <div className="flex justify-center space-x-2 mt-8">
                      {features.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToFeature(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex
                              ? 'w-8 bg-brand-primary'
                              : 'w-2 bg-gray-600 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to feature ${index + 1}`}
                        />
                      ))}
                    </div>

                    <div className="w-full bg-gray-800 rounded-full h-1 mt-4">
                      <motion.div
                        className="bg-gradient-to-r from-brand-primary to-brand-primary-dark h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${((currentIndex + 1) / features.length) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Tech Specs Tab */}
            {activeTab === 'specs' && techSpecs.length > 0 && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 max-w-4xl mx-auto"
              >
                {techSpecs.map((category, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="bg-neutral-800/30 rounded-2xl p-6 border border-neutral-700/50"
                  >
                    <h3 className="text-2xl font-display uppercase text-white mb-6 tracking-tight">
                      {getLocalizedText(category.category, language)}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.specs.map((spec, specIndex) => (
                        <div
                          key={specIndex}
                          className="flex justify-between items-start p-4 bg-neutral-900/50 rounded-xl"
                        >
                          <div className="flex-1">
                            <div className="text-white font-heading-semibold">
                              {getLocalizedText(spec.label, language)}
                            </div>
                            {spec.description && (
                              <div className="text-gray-400 text-sm mt-1">
                                {getLocalizedText(spec.description, language)}
                              </div>
                            )}
                          </div>
                          <div className="text-brand-primary font-heading-bold text-lg ml-4">
                            {formatSpecValue(spec)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Who Is It For Tab */}
            {activeTab === 'who' && whoIsItForData.length > 0 && (
              <motion.div
                key="who"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-8 max-w-4xl mx-auto"
              >
                {whoIsItForData.map((target, index) => {
                  const iconSrc =
                    target.icon === 'Users'
                      ? groupIcon
                      : target.icon === 'Wrench'
                        ? wrenchIcon
                        : powerIcon
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-neutral-800/50 to-neutral-900/50 rounded-2xl p-8 border border-neutral-700/50"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center">
                          <SvgIcon
                            src={iconSrc}
                            className="w-6 h-6 text-white"
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-display text-white">
                            {getLocalizedText(target.title, language)}
                          </h3>
                          <p className="text-gray-400 font-heading-semibold">
                            {getLocalizedText(target.subtitle, language)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {target.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center text-gray-300"
                          >
                            <div className="w-2 h-2 bg-brand-primary rounded-full mr-3 flex-shrink-0"></div>
                            <span className="font-heading-semibold">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab Counter */}
        <div className="text-center mt-8">
          {activeTab === 'features' && features.length > 1 && (
            <span className="text-gray-400 text-sm">
              {currentIndex + 1} {getTranslation(language, 'of')}{' '}
              {features.length}
            </span>
          )}
          {activeTab === 'specs' && techSpecs.length > 0 && (
            <span className="text-gray-400 text-sm">
              {techSpecs.length}{' '}
              {getTranslation(
                language,
                techSpecs.length === 1
                  ? 'specificationCategory'
                  : 'specificationCategories'
              )}
            </span>
          )}
          {activeTab === 'who' && whoIsItForData.length > 0 && (
            <span className="text-gray-400 text-sm">
              {getTranslation(language, 'perfectFor')} {whoIsItForData.length}{' '}
              {getTranslation(
                language,
                whoIsItForData.length === 1 ? 'typeOfRiders' : 'typesOfRiders'
              )}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
