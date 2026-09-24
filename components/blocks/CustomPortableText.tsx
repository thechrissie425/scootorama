'use client'

import {
  PortableText,
  PortableTextComponents,
  PortableTextBlock,
} from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import SvgIcon from '@/components/ui/SvgIcon'
import starIcon from '@/icons/system/star-filled.svg'
import infoIcon from '@/icons/system/info.svg'
import alertIcon from '@/icons/system/alert.svg'
import pinIcon from '@/icons/system/pin.svg'
import activityIcon from '@/icons/ui/data-graphs.svg'
import clockIcon from '@/icons/ui/clock.svg'
import { InlineIcon } from './InlineIcon'

// Helper to safely render localized content
const getLocalizedString = (
  content: string | { [key: string]: string } | null | undefined
): string => {
  if (!content) return ''
  if (typeof content === 'string') return content
  return content?.en || Object.values(content)[0] || ''
}

// --- TRANSLATION DICTIONARY ---
const translations = {
  'en-US': {
    proTip: 'Pro Tip',
    warning: 'Warning',
    note: 'Note',
    checkPrice: 'Check Price',
    everythingYouNeed: 'Everything you need to level up your ride.',
    noMapData: 'No Map Data',
    tryThisRoute: 'Try this route',
    dist: 'Dist',
    elev: 'Elev',
    viewActivity: 'View Activity',
    openScootoramaApp: 'Open the Scootorama app for analysis',
    rideActivity: 'Scootorama Ride',
  },
  'de-DE': {
    proTip: 'Profi-Tipp',
    warning: 'Warnung',
    note: 'Hinweis',
    checkPrice: 'Preis prüfen',
    everythingYouNeed: 'Alles was du brauchst, um deine Fahrt zu verbessern.',
    noMapData: 'Keine Kartendaten',
    tryThisRoute: 'Diese Route ausprobieren',
    dist: 'Dist',
    elev: 'Höhe',
    estTime: 'Geschätzte Zeit',
    viewActivity: 'Aktivität anzeigen',
    openScootoramaApp: 'Scootorama-App zur Analyse öffnen',
    rideActivity: 'Scootorama-Fahrt',
  },
  'fr-FR': {
    proTip: 'Conseil Pro',
    warning: 'Attention',
    note: 'Note',
    checkPrice: 'Vérifier le prix',
    everythingYouNeed:
      'Tout ce dont vous avez besoin pour améliorer votre conduite.',
    noMapData: 'Aucune donnée cartographique',
    tryThisRoute: 'Essayer cette route',
    dist: 'Dist',
    elev: 'Élév',
    estTime: 'Temps est',
    viewActivity: "Voir l'activité",
    openScootoramaApp: "Ouvrir l'app Scootorama pour l'analyse",
    rideActivity: 'Balade Scootorama',
  },
  'es-ES': {
    proTip: 'Consejo Pro',
    warning: 'Advertencia',
    note: 'Nota',
    checkPrice: 'Verificar precio',
    everythingYouNeed: 'Todo lo que necesitas para mejorar tu entrenamiento.',
    noMapData: 'Sin datos del mapa',
    tryThisRoute: 'Probar esta ruta',
    dist: 'Dist',
    elev: 'Elev',
    estTime: 'Tiempo est',
    viewActivity: 'Ver actividad',
    openScootoramaApp: 'Abrir la app de Scootorama para análisis',
    rideActivity: 'Paseo Scootorama',
  },
  'ja-JP': {
    proTip: 'プロのコツ',
    warning: '警告',
    note: '注記',
    checkPrice: '価格を確認',
    everythingYouNeed: 'ライドをレベルアップするために必要なすべて。',
    noMapData: 'マップデータなし',
    tryThisRoute: 'このルートを試す',
    dist: '距離',
    elev: '標高',
    estTime: '推定時間',
    viewActivity: 'アクティビティを見る',
    openScootoramaApp: 'Scootoramaアプリで分析を開く',
    rideActivity: 'Scootoramaライド',
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

// --- INTERFACES ---
interface ImageBlock {
  asset: {
    _ref?: string
    _type?: 'reference'
    _id?: string
    url?: string
  }
  alt?: string
  caption?: string
}

interface CalloutBlock {
  type: 'Pro Tip' | 'Warning' | 'Note'
  text: string
}

interface ProductBlock {
  customLabel?: string
  product?: {
    title: string
    slug: { current: string }
    prices?: { monthlyPrice: number }[]
    heroImage?: { asset: { _ref: string } }
  }
}

// 🟢 UPDATED INTERFACE to support both old 'route' and new 'expandedRoute'
interface RouteCardBlock {
  expandedRoute?: any // The new safe field
  route: {
    routeId: string
    name: string
    world: string
    sportType: 'KICK' | 'CRUISE'
    distance: number
    elevation: number
    difficulty: number
    description?: string
    highlights?: string
    heroImage?: { asset: { _ref: string } }
    mapImage?: { asset: { _ref: string } }
    deeplink?: string
    tags?: string[]
  }
  customDeeplink?: string
}

// Helper to format distance and elevation based on locale
const formatDistance = (
  km: number | null | undefined,
  locale: string
): string => {
  const val = km || 0 // 🟢 Safe default
  // US market uses miles
  if (locale === 'en-US') {
    const miles = val * 0.621371
    return `${miles.toFixed(1)} mi`
  }
  return `${val.toFixed(1)} km`
}

const formatElevation = (
  meters: number | null | undefined,
  locale: string
): string => {
  const val = meters || 0 // 🟢 Safe default
  // US market uses feet
  if (locale === 'en-US') {
    const feet = val * 3.28084
    return `${Math.round(feet)} ft`
  }
  return `${Math.round(val)} m`
}

// --- RENDERERS ---
const createComponents = (
  locale: string = 'en-US'
): PortableTextComponents => ({
  // 1. STANDARD TEXT STYLES
  block: {
    normal: ({ children }) => (
      <p className="font-body text-lg leading-relaxed text-lightGrey mb-6">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-4xl uppercase tracking-tight text-brandWhite mt-16 mb-6 leading-none">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading-bold text-2xl text-brandWhite mt-10 mb-4 uppercase">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-primary pl-6 my-10 italic text-xl text-grey font-body leading-relaxed">
        {children}
      </blockquote>
    ),
  },

  // 2. INLINE MARKS
  marks: {
    strong: ({ children }) => (
      <strong className="font-heading-bold text-brandWhite">{children}</strong>
    ),
    link: ({ value, children }) => {
      const target = (value?.href || '').startsWith('http')
        ? '_blank'
        : undefined
      return (
        <Link
          href={value?.href}
          target={target}
          className="text-brand-primary hover:text-brand-primary-light font-heading-bold underline decoration-2 underline-offset-4 transition-colors"
        >
          {children}
        </Link>
      )
    },
    inlineIcon: ({ value }) => <InlineIcon value={value} />,
  },

  // 3. POWER BLOCKS
  types: {
    // A. Inline Image
    image: ({ value }: { value: ImageBlock }) => {
      if (!value?.asset) {
        return null
      }
      let imageUrl: string
      try {
        imageUrl =
          value.asset.url || urlFor(value).width(1200).height(800).url()
      } catch {
        return null
      }
      return (
        <figure className="not-prose my-12">
          <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden bg-darkGrey border border-brandWhite/10 shadow-2xl">
            <Image
              src={imageUrl}
              alt={value.alt || value.caption || 'Blog content image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-grey mt-4 font-numeral tracking-wide">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    // B. Callout Box
    callout: ({ value }: { value: CalloutBlock }) => {
      const styles = {
        'Pro Tip': {
          border: 'border-brand-primary',
          bg: 'bg-brand-primary/10',
          text: 'text-brand-primary',
          icon: (
            <SvgIcon src={starIcon} className="w-6 h-6 text-brand-primary" />
          ),
          label: translate(locale, 'proTip'),
        },
        Warning: {
          border: 'border-red-500',
          bg: 'bg-red-500/10',
          text: 'text-red-500',
          icon: <SvgIcon src={alertIcon} className="w-6 h-6 text-red-500" />,
          label: translate(locale, 'warning'),
        },
        Note: {
          border: 'border-blue-500',
          bg: 'bg-blue-500/10',
          text: 'text-blue-500',
          icon: <SvgIcon src={infoIcon} className="w-6 h-6 text-blue-500" />,
          label: translate(locale, 'note'),
        },
      }
      const theme = styles[value.type] || styles['Note']
      return (
        <div
          className={`my-12 p-8 rounded-2xl border-l-4 ${theme.border} ${theme.bg} flex gap-6 items-start shadow-lg`}
        >
          <div className="flex-shrink-0 mt-1 bg-brand-ink/50 p-2 rounded-full">
            {theme.icon}
          </div>
          <div>
            <span
              className={`block font-display uppercase text-sm mb-3 tracking-widest ${theme.text}`}
            >
              {theme.label}
            </span>
            <div className="text-brandWhite font-body text-lg leading-relaxed">
              {value.text}
            </div>
          </div>
        </div>
      )
    },

    // C. Product Plug
    productPlug: ({ value }: { value: ProductBlock }) => {
      const product = value.product
      if (!product) return null
      return (
        <div className="my-14 p-8 bg-darkGrey rounded-3xl border border-brandWhite/10 flex flex-col md:flex-row items-center gap-8 group hover:border-brand-primary/50 transition-all duration-300 shadow-xl">
          {product.heroImage && (
            <div className="w-32 h-32 relative rounded-full overflow-hidden flex-shrink-0 border-4 border-brandWhite/5 bg-brand-ink">
              <Image
                src={urlFor(product.heroImage).width(300).url()}
                alt={getLocalizedString(product.title)}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          )}
          <div className="flex-1 text-center md:text-left space-y-2">
            <h4 className="font-display text-3xl text-brandWhite uppercase leading-none">
              {product.title}
            </h4>
            <p className="text-lightGrey font-body text-sm">
              {translate(locale, 'everythingYouNeed')}
            </p>
          </div>
          <Link
            href={`/pricing`}
            className="px-8 py-4 bg-brand-primary hover:bg-brand-primary-dark text-brandWhite rounded-full font-display uppercase text-sm transition-transform hover:scale-105 shadow-lg shadow-brand-primary-dark/20"
          >
            {value.customLabel || translate(locale, 'checkPrice')}
          </Link>
        </div>
      )
    },

    // D. Route Card
    routeCard: ({ value }: { value: RouteCardBlock }) => {
      // 1. Determine if we have the full data or just the reference link
      const data = value.expandedRoute || value.route || {}

      return (
        <div className="my-16 relative overflow-hidden rounded-[2rem] bg-[#222] border border-brandWhite/10 shadow-2xl max-w-2xl mx-auto group">
          <div className="bg-brand-ink p-6 flex justify-between items-center border-b border-brandWhite/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary-dark/40">
                <SvgIcon src={pinIcon} className="text-white w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display text-2xl text-brandWhite leading-none uppercase tracking-tight">
                  {data.name}
                </h4>
                <span className="text-grey font-numeral text-xs uppercase tracking-widest mt-1 block">
                  {data.world}
                </span>
              </div>
            </div>
            {/* Badge */}
            <div className="hidden sm:block px-4 py-1.5 rounded-full border border-brandWhite/10 bg-brandWhite/5 text-[10px] uppercase font-heading-bold text-lightGrey tracking-wider">
              {translate(locale, 'rideActivity')}
            </div>
          </div>

          {/* Body */}
          <div className="p-8 grid md:grid-cols-2 gap-8 items-center bg-gradient-to-b from-[#222] to-[#1a1a1a]">
            {/* Map Visual */}
            <div className="relative aspect-square bg-black/40 rounded-2xl border border-brandWhite/5 flex items-center justify-center p-6 shadow-inner">
              {data.mapImage ? (
                <Image
                  src={urlFor(data.mapImage).width(600).url()}
                  alt={data.name || 'Route Map'}
                  width={400}
                  height={300}
                  className="object-contain drop-shadow-[0_0_20px_rgba(242,99,34,0.6)] opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  sizes="400px"
                />
              ) : (
                <span className="text-grey font-numeral text-xs">
                  {translate(locale, 'noMapData')}
                </span>
              )}
            </div>

            {/* Stats Grid */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-brandWhite/5 rounded-2xl border border-brandWhite/5">
                  <div className="flex items-center gap-2 mb-2 text-grey">
                    <SvgIcon src={activityIcon} className="w-4 h-4" />
                    <span className="text-[10px] font-numeral uppercase tracking-widest">
                      {translate(locale, 'dist')}
                    </span>
                  </div>
                  <div className="text-2xl font-display text-brandWhite">
                    {/* 🟢 USE DATA VARIABLE */}
                    {formatDistance(data.distance, locale)}
                  </div>
                </div>
                <div className="p-5 bg-brandWhite/5 rounded-2xl border border-brandWhite/5">
                  <div className="flex items-center gap-2 mb-2 text-grey">
                    <SvgIcon src={clockIcon} className="w-4 h-4" />
                    <span className="text-[10px] font-numeral uppercase tracking-widest">
                      {translate(locale, 'elev')}
                    </span>
                  </div>
                  <div className="text-2xl font-display text-brandWhite">
                    {/* 🟢 USE DATA VARIABLE */}
                    {formatElevation(data.elevation, locale)}
                  </div>
                </div>
              </div>

              {/* CTA */}
              {value.customDeeplink || data.deeplink ? (
                <a
                  href={value.customDeeplink || data.deeplink}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-4 bg-brand-primary hover:bg-brand-primary-dark text-brandWhite text-center rounded-xl font-display uppercase text-sm transition-all hover:translate-y-[-2px] hover:shadow-lg shadow-brand-primary-dark/20"
                >
                  {translate(locale, 'viewActivity')}
                </a>
              ) : (
                <div className="text-center p-4 rounded-xl bg-brandWhite/5 border border-brandWhite/5">
                  <p className="text-[10px] text-grey font-numeral uppercase tracking-wider">
                    {translate(locale, 'openScootoramaApp')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
  },
})

export default function CustomPortableText({
  value,
  locale = 'en-US',
}: {
  value: PortableTextBlock[]
  locale?: string
}) {
  const components = createComponents(locale)
  return <PortableText value={value} components={components} />
}
