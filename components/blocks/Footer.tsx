'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { brand } from '@/lib/brand'
import { ChevronDownIcon } from '@sanity/icons'
import {
  SUPPORTED_MARKETS,
  getMarketByCode,
  getLanguageByCode,
  getAvailableLanguagesForMarket,
  DEFAULT_LANGUAGE,
  DEFAULT_MARKET,
} from '@/lib/i18n'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'
import { LocalizedString } from '@/types'

// --- 1. DATA TYPES (Updated to match Sanity Query) ---
interface SanityFooterColumn {
  _key: string
  heading: LocalizedString
  links?: Array<{
    _key: string
    label: LocalizedString
    url?: string
    targetPage?: {
      slug?: { current: string }
    }
  }>
}

interface DisplayNavSection {
  title: string
  items: Array<{
    _key?: string
    label: string
    url?: string
    targetPage?: { slug: string }
  }>
}

interface FooterProps {
  market?: string
  language?: string
  navItems?: SanityFooterColumn[]
  socialLinks?: Array<{
    platform: string
    url: string
  }>
  copyrightText?: LocalizedString
}

// --- HELPER: Localized String Resolver ---
const getLocalized = (
  content: LocalizedString | undefined,
  language: string = 'en'
): string => {
  if (!content) return ''
  if (typeof content === 'string') return content
  return content[language] || content.en || Object.values(content)[0] || ''
}

// --- HARDCODED FOOTER TRANSLATIONS ---
const FOOTER_TRANSLATIONS = {
  regionAndLanguage: {
    en: 'Region & Language',
    es: 'Región e Idioma',
    fr: 'Région et Langue',
    de: 'Region und Sprache',
    ja: '地域と言語',
  },
  privacyPolicy: {
    en: 'Privacy Policy',
    es: 'Política de Privacidad',
    fr: 'Politique de Confidentialité',
    de: 'Datenschutzrichtlinie',
    ja: 'プライバシーポリシー',
  },
  termsOfService: {
    en: 'Terms of Service',
    es: 'Términos de Servicio',
    fr: 'Conditions de Service',
    de: 'Nutzungsbedingungen',
    ja: 'サービス規約',
  },
  copyright: {
    en: 'All rights reserved.',
    es: 'Todos los derechos reservados.',
    fr: 'Tous droits réservés.',
    de: 'Alle Rechte vorbehalten.',
    ja: '無断転載禁止。',
  },
  brandDescription: {
    en: 'The wackiest indoor scooter adventure on Earth. Kick, glide and honk your way around the world.',
    es: 'La aventura en patinete más loca del planeta. Impulsa, deslízate y toca la bocina por todo el mundo.',
    fr: 'L’aventure en trottinette la plus loufoque de la planète. Poussez, glissez et klaxonnez autour du monde.',
    de: 'Das verrückteste Indoor-Roller-Abenteuer der Welt. Anschubsen, gleiten und hupen – einmal um die ganze Welt.',
    ja: '地球でいちばん愉快な室内スクーターアドベンチャー。キックして、滑って、ホーンを鳴らして世界をめぐろう。',
  },
  // Fallback navigation translations
  training: {
    en: 'Training',
    es: 'Entrenamiento',
    fr: 'Entraînement',
    de: 'Training',
    ja: 'トレーニング',
  },
  workouts: {
    en: 'Workouts',
    es: 'Entrenamientos',
    fr: 'Séances',
    de: 'Workouts',
    ja: 'ワークアウト',
  },
  trainingPlans: {
    en: 'Training Plans',
    es: 'Planes de Entrenamiento',
    fr: "Plans d'Entraînement",
    de: 'Trainingspläne',
    ja: 'トレーニングプラン',
  },
  events: {
    en: 'Events',
    es: 'Eventos',
    fr: 'Événements',
    de: 'Events',
    ja: 'イベント',
  },
  equipment: {
    en: 'Equipment',
    es: 'Equipamiento',
    fr: 'Équipement',
    de: 'Ausrüstung',
    ja: '機材',
  },
  shopEquipment: {
    en: 'Shop Equipment',
    es: 'Comprar Equipamiento',
    fr: 'Acheter Équipement',
    de: 'Equipment kaufen',
    ja: '機材を購入',
  },
  compatibleDevices: {
    en: 'Compatible Devices',
    es: 'Dispositivos Compatibles',
    fr: 'Appareils Compatibles',
    de: 'Kompatible Geräte',
    ja: '対応デバイス',
  },
}

const getTranslation = (
  key: keyof typeof FOOTER_TRANSLATIONS,
  language: string
): string => {
  return (
    FOOTER_TRANSLATIONS[key][
      language as keyof (typeof FOOTER_TRANSLATIONS)[keyof typeof FOOTER_TRANSLATIONS]
    ] || FOOTER_TRANSLATIONS[key].en
  )
}

// --- ICONS ---
const SOCIAL_ICONS = {
  instagram: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.451 2.535c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  strava: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M15.387 17.944l-2.089-4.116h-3.065l5.154 10.172 5.154-10.172h-3.066l-2.088 4.116zm-5.163-5.599l6.23-12.345 6.23 12.345h-3.86l-2.37-4.698-2.37 4.698h-3.86z" />
    </svg>
  ),
  youtube: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  facebook: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  ),
  twitter: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  ),
} as const

export default function Footer({
  market = 'us',
  language = 'en',
  navItems = [],
  socialLinks = [],
  copyrightText,
}: FooterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showMarketSelector, setShowMarketSelector] = useState(false)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)

  const currentMarketConfig = getMarketByCode(market) || DEFAULT_MARKET
  const currentLanguageConfig = getLanguageByCode(language) || DEFAULT_LANGUAGE
  const availableLanguages = getAvailableLanguagesForMarket(market)

  // --- LINK HELPER ---
  const getLink = (slugOrPath: string) => {
    if (!slugOrPath) return '#'
    if (slugOrPath.startsWith('http')) return slugOrPath
    const cleanPath = slugOrPath.startsWith('/') ? slugOrPath : `/${slugOrPath}`
    return `/${market}/${language}${cleanPath}`
  }

  // --- MARKET/LANG SWITCHERS ---
  const handleMarketChange = (newMarketCode: string) => {
    const newMarket = getMarketByCode(newMarketCode)
    if (!newMarket) return
    const defaultLang = newMarket.languages[0] || 'en'
    router.push(`/${newMarketCode}/${defaultLang}`)
    setShowMarketSelector(false)
  }

  const handleLanguageChange = (newLangCode: string) => {
    const newPath = pathname.replace(
      new RegExp(`^/${market}/[^/]+`),
      `/${market}/${newLangCode}`
    )
    router.push(newPath)
    setShowLanguageSelector(false)
  }

  // --- DATA NORMALIZATION ---
  let displayNav: DisplayNavSection[] = []

  if (navItems && navItems.length > 0) {
    displayNav = navItems.map(col => ({
      title: getLocalized(col.heading, language),
      items: (col.links || []).map(link => ({
        _key: link._key,
        label: getLocalized(link.label, language),
        url: link.url,
        targetPage: link.targetPage?.slug?.current
          ? { slug: link.targetPage.slug.current }
          : undefined,
      })),
    }))
  } else {
    // Fallback if no data
    displayNav = [
      {
        title: getTranslation('training', language),
        items: [
          {
            label: getTranslation('workouts', language),
            url: '/training/workouts',
          },
          {
            label: getTranslation('trainingPlans', language),
            url: '/training/plans',
          },
          { label: getTranslation('events', language), url: '/events' },
        ],
      },
      {
        title: getTranslation('equipment', language),
        items: [
          {
            label: getTranslation('shopEquipment', language),
            url: '/equipment',
          },
          {
            label: getTranslation('compatibleDevices', language),
            url: '/equipment/compatible',
          },
        ],
      },
    ]
  }

  return (
    <footer className="bg-brand-ink text-brandWhite border-t border-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* 1. BRAND */}
            <div className="md:col-span-1">
              <Image
                src={brand.logo.wordmark}
                alt={brand.name}
                width={185}
                height={38}
                className="h-8 w-auto mb-4"
                unoptimized
              />
              <p className="text-lightGrey text-sm leading-relaxed mb-4">
                {getTranslation('brandDescription', language)}
              </p>
            </div>

            {/* 2. NAVIGATION LINKS */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-2 gap-8">
                {displayNav.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="font-heading-semibold text-brandWhite mb-4">
                      {section.title}
                    </h3>
                    <nav className="space-y-3">
                      {section.items.map((link, linkIdx) => {
                        const href = link.targetPage?.slug
                          ? getLink(link.targetPage.slug)
                          : getLink(link.url || '#')

                        return (
                          <Link
                            key={link._key || linkIdx}
                            href={href}
                            className="block text-lightGrey hover:text-brandWhite text-sm transition-colors"
                          >
                            {link.label}
                          </Link>
                        )
                      })}
                    </nav>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. SELECTORS */}
            <div className="md:col-span-1">
              <h3 className="font-heading-semibold text-brandWhite mb-4">
                {getTranslation('regionAndLanguage', language)}
              </h3>
              <div className="space-y-3">
                {/* Market Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowMarketSelector(!showMarketSelector)
                      setShowLanguageSelector(false)
                    }}
                    className="w-full bg-darkGrey border border-grey rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-brand-primary transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {currentMarketConfig.flag}
                      </span>
                      <span className="text-sm text-brandWhite group-hover:text-brand-primary transition-colors">
                        {currentMarketConfig.name}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform ${showMarketSelector ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {showMarketSelector && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-darkGrey border border-grey rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {SUPPORTED_MARKETS.map(m => (
                        <button
                          key={m.code}
                          onClick={() => handleMarketChange(m.code)}
                          className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-grey transition-colors ${m.code === market ? 'bg-grey' : ''}`}
                        >
                          <span className="text-lg">{m.flag}</span>
                          <span className="text-sm text-brandWhite">
                            {m.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowLanguageSelector(!showLanguageSelector)
                      setShowMarketSelector(false)
                    }}
                    className="w-full bg-darkGrey border border-grey rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-brand-primary transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {currentLanguageConfig.flag}
                      </span>
                      <span className="text-sm text-brandWhite group-hover:text-brand-primary transition-colors">
                        {currentLanguageConfig.name}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform ${showLanguageSelector ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {showLanguageSelector && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-darkGrey border border-grey rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {availableLanguages.map(l => (
                        <button
                          key={l.code}
                          onClick={() => handleLanguageChange(l.code)}
                          className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-grey transition-colors ${l.code === language ? 'bg-grey' : ''}`}
                        >
                          <span className="text-lg">{l.flag}</span>
                          <span className="text-sm text-brandWhite">
                            {l.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. BOTTOM BAR */}
        <div className="border-t border-grey py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Links (FROM SETTINGS!) */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => {
                const icon =
                  SOCIAL_ICONS[
                    social.platform.toLowerCase() as keyof typeof SOCIAL_ICONS
                  ]
                if (!icon) return null

                return (
                  <a
                    key={index}
                    href={social.url}
                    className="text-lightGrey hover:text-brand-primary transition-colors"
                    aria-label={social.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {icon}
                  </a>
                )
              })}
            </div>

            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-lightGrey">
              <span>
                {copyrightText
                  ? getLocalized(copyrightText, language)
                  : `© ${new Date().getFullYear()} ${brand.name}. ${getTranslation('copyright', language)}`}
              </span>
              <div className="flex items-center gap-4">
                <Link
                  href={getLink('/privacy')}
                  className="hover:text-brandWhite transition-colors"
                >
                  {getTranslation('privacyPolicy', language)}
                </Link>
                <Link
                  href={getLink('/terms')}
                  className="hover:text-brandWhite transition-colors"
                >
                  {getTranslation('termsOfService', language)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click Outside Handler */}
      {(showMarketSelector || showLanguageSelector) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowMarketSelector(false)
            setShowLanguageSelector(false)
          }}
        />
      )}
    </footer>
  )
}
