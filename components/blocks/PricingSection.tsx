'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CheckmarkCircleIcon, RemoveIcon } from '@sanity/icons'
import { BrandCTAButton } from '@/components/ui/BrandButtons'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'
import { BaseBlockProps } from '@/types'

// --- HELPER: Extracts text from Sanity objects ---
const getLabel = (
  text: string | { [key: string]: string } | undefined | null,
  language: string = 'en',
  fallback = ''
): string => {
  if (!text) return fallback
  if (typeof text === 'string') return text
  const lang = language.split('-')[0]
  // Handles both short (en) and long (enUS) codes
  return (
    text[lang] || text.en || text.enUS || Object.values(text)[0] || fallback
  )
}

// --- TYPES ---
export interface PriceData {
  currency: string
  amount: number
  monthlyPrice?: number
  annualPrice?: number
  trialDays?: number
  savingsPercent?: number
}

export interface FeatureData {
  _id: string
  title: string | { [key: string]: string }
  pricingLabel?: string | { [key: string]: string }
  tooltipDescription?: string | { [key: string]: string }
}

export interface PricingTier {
  _id: string
  title: string | { [key: string]: string }
  tagline?: string | { [key: string]: string }
  badgeText?: string | { [key: string]: string }
  themeColor?: string
  heroImage?: string
  prices?: PriceData[]
  includedFeatures?: FeatureData[]
  ctaLabel?: string | { [key: string]: string }
}

export interface PricingData {
  title: string
  layoutVariant?: 'cards' | 'table'
  tiers: PricingTier[]
}

interface PricingSectionProps extends BaseBlockProps {
  data: PricingData
  uiLabels?: {
    pricingUI?: {
      monthlyLabel?: any
      annualLabel?: any
      discountLabel?: any
      saveUpTo?: any
      ctaFallback?: any
    }
  }
}

export default function PricingSection({
  data,
  uiLabels,
  // 🟢 FIX: Removed unused 'market' prop
  language = 'en',
}: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly'
  )
  const { market: currentMarket, formatCurrency } = useMarketFormatting()
  // Layout comes from the CMS (layoutVariant); the section always renders dark.
  const currentLayout = data?.layoutVariant || 'cards'
  const isDarkMode = true

  if (!data) return null
  const { title, tiers } = data

  // 🟢 DYNAMIC LABELS
  const t = {
    monthly: getLabel(uiLabels?.pricingUI?.monthlyLabel, language, 'Monthly'),
    annual: getLabel(uiLabels?.pricingUI?.annualLabel, language, 'Annual'),
    discount: getLabel(
      uiLabels?.pricingUI?.discountLabel,
      language,
      'SAVE 17%'
    ),
    savePrefix: getLabel(uiLabels?.pricingUI?.saveUpTo, language, 'Save'),
    ctaFallback: getLabel(
      uiLabels?.pricingUI?.ctaFallback,
      language,
      'Start Trial'
    ),
  }

  // 🟢 ROBUST PRICE CALCULATION LOGIC
  const getPrice = (tier: PricingTier): PriceData => {
    // 1. Determine target currency
    const currencyCode = currentMarket?.currency?.code || 'USD'

    // 2. Find price for current market OR fallback to first available price
    const prices = tier.prices?.find(
      (p: PriceData) => p.currency === currencyCode
    ) ||
      tier.prices?.[0] || {
        currency: currencyCode,
        monthlyPrice: 0,
        annualPrice: 0,
        amount: 0,
      }

    const monthlyPrice = prices.monthlyPrice || 0
    const annualPrice = prices.annualPrice || 0

    // 3. Determine amount based on billing cycle
    const currentAmount =
      billingCycle === 'monthly' ? monthlyPrice : annualPrice

    // 4. Return calculated price object
    return {
      currency: prices.currency || currencyCode,
      amount: currentAmount,
      monthlyPrice: prices.monthlyPrice,
      annualPrice: prices.annualPrice,
      savingsPercent:
        annualPrice && monthlyPrice && monthlyPrice > 0
          ? Math.round(
              ((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100
            )
          : 0,
    }
  }

  return (
    <section
      className={`py-24 transition-colors duration-300 ${isDarkMode ? 'bg-brand-ink text-brandWhite' : 'bg-brandWhite-dark text-black'}`}
    >
      <div className="max-w-7xl mx-auto px-6 overflow-visible">
        {/* HEADER */}
        <div
          className={`flex flex-col xl:flex-row justify-between items-end mb-12 border-b pb-8 gap-6 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}
        >
          <div className="w-full xl:w-auto">
            <h2 className="text-4xl font-display tracking-tight">{title}</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            {/* BILLING TOGGLE */}
            <div
              className={`p-1 rounded-lg border grid grid-cols-2 relative w-64 ${isDarkMode ? 'bg-darkGrey border-grey' : 'bg-gray-100 border-gray-200'}`}
            >
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`relative z-10 py-2 text-sm font-heading-bold transition-colors ${billingCycle === 'monthly' ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-300'}`}
              >
                {t.monthly}
              </button>

              <button
                onClick={() => setBillingCycle('annual')}
                className={`relative z-10 py-2 text-sm font-heading-bold transition-colors ${billingCycle === 'annual' ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-300'}`}
              >
                {t.annual}
                <span className="absolute -top-3 -right-2 bg-green text-black text-[9px] px-1.5 py-0.5 rounded-full font-display">
                  {t.discount}
                </span>
              </button>

              <div
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-md transition-transform duration-300 ${isDarkMode ? 'bg-grey' : 'bg-white shadow-sm'} ${billingCycle === 'annual' ? 'translate-x-full' : 'translate-x-0'}`}
              />
            </div>

            {/* MARKET DISPLAY (Read Only) */}
            <div
              className={`flex items-center gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-darkGrey border-grey' : 'bg-gray-100 border-gray-200'}`}
            >
              <span className="px-3 py-2 rounded-md text-sm font-heading-bold bg-brand-primary text-white shadow-lg">
                {currentMarket?.currency?.code || 'USD'}
              </span>
              <span
                className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
              >
                Market: {currentMarket?.name || 'United States'}
              </span>
            </div>
          </div>
        </div>

        {/* RENDERER */}
        {currentLayout === 'table' ? (
          <PricingTable
            tiers={tiers}
            getPrice={getPrice}
            formatCurrency={formatCurrency}
            billingCycle={billingCycle}
            isDarkMode={isDarkMode}
            language={language}
            t={t}
          />
        ) : (
          <PricingCards
            tiers={tiers}
            getPrice={getPrice}
            formatCurrency={formatCurrency}
            billingCycle={billingCycle}
            isDarkMode={isDarkMode}
            language={language}
            t={t}
          />
        )}
      </div>
    </section>
  )
}

// --- SUB-COMPONENTS ---

function PricingCards({
  tiers,
  getPrice,
  formatCurrency,
  billingCycle,
  isDarkMode,
  language,
  t,
}: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {tiers.map((tier: PricingTier) => {
        const { amount, savingsPercent } = getPrice(tier)
        const isFeatured = !!(
          tier.badgeText && getLabel(tier.badgeText, language)?.trim()
        )
        const themeColor = tier.themeColor?.trim() || '#D6117A'

        return (
          <div
            key={tier._id}
            className={`relative p-8 rounded-2xl flex flex-col h-full border transition-all duration-300 ${isDarkMode ? (isFeatured ? 'bg-darkGrey shadow-2xl' : 'bg-darkGrey/40 border-grey') : isFeatured ? 'bg-white shadow-2xl border-2' : 'bg-white border-gray-200'}`}
            style={{
              borderColor: isFeatured ? themeColor : undefined,
              boxShadow: isFeatured ? `0 0 0 1px ${themeColor}` : undefined,
            }}
          >
            {billingCycle === 'annual' && (savingsPercent || 0) > 0 && (
              <div
                className={`absolute top-4 right-4 text-xs font-heading-bold px-2 py-1 rounded ${isDarkMode ? 'text-green-light bg-green/10' : 'text-green-700 bg-green-50'}`}
              >
                {t.savePrefix} {savingsPercent}%
              </div>
            )}

            {tier.badgeText && getLabel(tier.badgeText, language)?.trim() && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-display px-3 py-1 rounded-full uppercase tracking-wider shadow-lg"
                style={{ backgroundColor: themeColor }}
              >
                {getLabel(tier.badgeText, language)}
              </div>
            )}

            {tier.heroImage && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={tier.heroImage}
                  alt=""
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            )}

            <div className="text-center">
              <h3
                className={`text-2xl font-display ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                {getLabel(tier.title, language)}
              </h3>
              <p
                className={`text-sm mt-2 min-h-[40px] ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
              >
                {getLabel(tier.tagline, language)}
              </p>
            </div>

            <div className="my-8 text-center">
              <span
                className={`text-5xl font-display tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                {formatCurrency(amount || 0)}
              </span>
              <span
                className={`font-heading-semibold ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
              >
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </span>
            </div>

            <BrandCTAButton className="py-4">
              {getLabel(tier.ctaLabel, language) || t.ctaFallback}
            </BrandCTAButton>

            <ul
              className={`mt-8 space-y-4 px-2 text-left border-t pt-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
            >
              {tier.includedFeatures?.map((f: FeatureData) => (
                <li
                  key={f._id}
                  className={`flex items-start text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  <CheckmarkCircleIcon
                    className="w-5 h-5 flex-shrink-0 mt-0.5 mr-3"
                    style={{ color: themeColor }}
                  />
                  <span>
                    {getLabel(f.pricingLabel, language) ||
                      getLabel(f.title, language)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function PricingTable({
  tiers,
  getPrice,
  formatCurrency,
  isDarkMode,
  language,
  t,
}: any) {
  const allFeatureMap = new Map()
  tiers.forEach((tier: PricingTier) => {
    tier.includedFeatures?.forEach((f: FeatureData) => {
      if (!allFeatureMap.has(f._id)) allFeatureMap.set(f._id, f)
    })
  })
  const allFeatures = Array.from(allFeatureMap.values())

  return (
    <div
      className={`rounded-3xl border shadow-2xl overflow-visible ${isDarkMode ? 'bg-black border-darkGrey' : 'bg-white border-gray-200'}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`${isDarkMode ? 'bg-darkGrey/50' : 'bg-gray-50'}`}>
              <th className="p-4 w-2/5"></th>
              {tiers.map((tier: PricingTier) => {
                const { amount } = getPrice(tier)
                return (
                  <th
                    key={tier._id}
                    className={`text-center p-4 border-b border-l w-1/5 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    style={{ height: '320px' }}
                  >
                    <div className="h-full flex flex-col justify-between">
                      <div className="flex-shrink-0">
                        {tier.heroImage && (
                          <Image
                            src={tier.heroImage}
                            alt=""
                            width={120}
                            height={80}
                            className="object-cover mx-auto"
                          />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div
                          className={`text-xl font-heading-bold mb-2 uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
                        >
                          {getLabel(tier.title, language)}
                        </div>
                        <div
                          className={`text-2xl font-display ${isDarkMode ? 'text-brandWhite' : 'text-black'}`}
                        >
                          {formatCurrency(amount || 0)}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <BrandCTAButton className="py-2 px-4 rounded-lg shadow-md hover:shadow-lg">
                          {getLabel(tier.ctaLabel, language) || t.ctaFallback}
                        </BrandCTAButton>
                      </div>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody
            className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-100'}`}
          >
            {allFeatures.map((feature: any) => (
              <tr
                key={feature._id}
                className={`transition-colors group ${isDarkMode ? 'hover:bg-darkGrey/30' : 'hover:bg-gray-50'}`}
              >
                <td
                  className={`p-4 pl-8 py-5 font-heading-semibold border-r ${isDarkMode ? 'text-gray-300 border-gray-800' : 'text-gray-700 border-gray-100'}`}
                >
                  {getLabel(feature.pricingLabel, language) ||
                    getLabel(feature.title, language)}
                </td>
                {tiers.map((tier: PricingTier) => {
                  const hasFeature = tier.includedFeatures?.some(
                    (f: FeatureData) => f._id === feature._id
                  )
                  return (
                    <td
                      key={`${tier._id}-${feature._id}`}
                      className={`p-4 text-center border-l ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}
                    >
                      {hasFeature ? (
                        <CheckmarkCircleIcon className="w-6 h-6 text-green inline-block" />
                      ) : (
                        <RemoveIcon
                          className={`w-4 h-4 inline-block ${isDarkMode ? 'text-gray-300' : 'text-gray-300'}`}
                        />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
