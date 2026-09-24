'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Sunburst from '@/components/ui/Sunburst'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@sanity/icons'
import { BrandButton } from '@/components/ui/BrandButtons'
import { urlFor } from '@/sanity/lib/image'
import { LinkReference, SubLink, unwrapString, getLocalizedText } from '@/types'
import SvgIcon from '@/components/ui/SvgIcon'
import { brand } from '@/lib/brand'

// Icon imports
import scooterIcon from '@/icons/ui/sports/sport-scooter.svg'
import trainerIcon from '@/icons/ui/smart-trainer.svg'
import mapIcon from '@/icons/system/map.svg'
import chartIcon from '@/icons/ui/data-graphs.svg'
import heartIcon from '@/icons/system/favorite-filled.svg'
import sunIcon from '@/icons/ui/energy.svg'
import defaultIcon from '@/icons/system/arrow-right.svg'

// Solid nav surface when floating or a menu is open (brand cream)
const LIGHT_BACKGROUND = '#FFFBF0'

/** True when a hex color is dark enough to need light text on top of it */
function isDarkColor(hex?: string): boolean {
  if (!hex) return false
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.replace(/./g, c => c + c) : h
  const n = parseInt(full.slice(0, 6), 16)
  if (Number.isNaN(n)) return false
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  // Relative luminance below ~0.18 reads better with white text than ink
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.18
}

// --- TYPES ---
interface HeaderProps {
  navItems?: any[] // Matches the shape from SETTINGS_QUERY
  market?: string
  language?: string
  takeoverNavBar?: {
    backgroundColor?: { hex?: string }
    logo?: any
  }
  takeoverGlobalBanner?: {
    enabled?: boolean
    text?: Record<string, string>
    backgroundColor?: { hex?: string }
    ctaText?: Record<string, string>
    ctaUrl?: string
  }
}

// --- TRANSLATIONS ---
const translations = {
  en: {
    explore: 'Explore',
    getStarted: 'Get Started',
    shop: 'Shop',
    home: 'Home',
    about: 'About',
    games: 'Games',
    training: 'Training',
    community: 'Community',
    membership: 'Membership',
    products: 'Products',
    support: 'Support',
    news: 'News',
    features: 'Features',
    learnMore: 'Learn More',
    viewAll: 'View All',
    download: 'Download',
    signUp: 'Sign Up',
    logIn: 'Log In',
  },
  de: {
    explore: 'Entdecken',
    getStarted: 'Loslegen',
    shop: 'Kaufen',
    home: 'Startseite',
    about: 'Über uns',
    games: 'Spiele',
    training: 'Training',
    community: 'Community',
    membership: 'Mitgliedschaft',
    products: 'Produkte',
    support: 'Support',
    news: 'Neuigkeiten',
    features: 'Funktionen',
    learnMore: 'Mehr erfahren',
    viewAll: 'Alle anzeigen',
    download: 'Herunterladen',
    signUp: 'Registrieren',
    logIn: 'Anmelden',
  },
  fr: {
    explore: 'Explorer',
    getStarted: 'Commencer',
    shop: 'Acheter',
    home: 'Accueil',
    about: 'À propos',
    games: 'Jeux',
    training: 'Entraînement',
    community: 'Communauté',
    membership: 'Abonnement',
    products: 'Produits',
    support: 'Support',
    news: 'Actualités',
    features: 'Fonctionnalités',
    learnMore: 'En savoir plus',
    viewAll: 'Voir tout',
    download: 'Télécharger',
    signUp: "S'inscrire",
    logIn: 'Se connecter',
  },
  es: {
    explore: 'Explorar',
    getStarted: 'Empezar',
    shop: 'Tienda',
    home: 'Inicio',
    about: 'Acerca de',
    games: 'Juegos',
    training: 'Entrenamiento',
    community: 'Comunidad',
    membership: 'Membresía',
    products: 'Productos',
    support: 'Soporte',
    news: 'Noticias',
    features: 'Características',
    learnMore: 'Saber más',
    viewAll: 'Ver todo',
    download: 'Descargar',
    signUp: 'Registrarse',
    logIn: 'Iniciar sesión',
  },
  ja: {
    explore: '探索',
    getStarted: '始める',
    shop: 'ショップ',
    home: 'ホーム',
    about: 'について',
    games: 'ゲーム',
    training: 'トレーニング',
    community: 'コミュニティ',
    membership: 'メンバーシップ',
    products: '製品',
    support: 'サポート',
    news: 'ニュース',
    features: '機能',
    learnMore: '詳細を見る',
    viewAll: 'すべて見る',
    download: 'ダウンロード',
    signUp: '登録',
    logIn: 'ログイン',
  },
}

type SupportedLang = keyof typeof translations

const translate = (
  key: keyof (typeof translations)['en'],
  lang: string = 'en'
) => {
  const code = (
    Object.keys(translations).includes(lang) ? lang : 'en'
  ) as SupportedLang
  return translations[code]?.[key] || translations['en'][key]
}

export default function Header({
  navItems = [],
  market = 'us',
  language = 'en',
  takeoverNavBar,
  takeoverGlobalBanner,
}: HeaderProps) {
  const [isFloating, setIsFloating] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // Publish the in-flow header height (nav + any takeover banner) as
  // --site-header-offset so page content can clear it (see .pt-header).
  useEffect(() => {
    if (isFloating) return
    const el = headerRef.current
    if (!el) return
    const publish = () =>
      document.documentElement.style.setProperty(
        '--site-header-offset',
        `${el.offsetHeight}px`
      )
    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(el)
    return () => observer.disconnect()
  }, [isFloating])

  // --- SCROLL LOGIC ---
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 0) return

      if (currentScrollY < 200) {
        setIsFloating(false)
      } else {
        if (currentScrollY > lastScrollY.current) {
          setIsFloating(false) // Hide on scroll down
          setHoveredIndex(null)
        } else {
          setIsFloating(true) // Show on scroll up
        }
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // --- 🔗 LINK RESOLVER (Fixes 307 Redirects) ---
  const resolveLink = (
    ref?: LinkReference | string,
    manualUrl?: string
  ): string => {
    // 1. Manual URL takes precedence
    if (manualUrl) return manualUrl

    // 2. Default Home
    const homeLink =
      market === 'us' && language === 'en' ? '/' : `/${market}/${language}`
    if (!ref) return homeLink

    // 3. Extract Slug and Type safely
    let slug: string | undefined
    let docType: string | undefined

    if (typeof ref === 'string') {
      slug = ref
    } else if (typeof ref === 'object' && ref !== null) {
      // Handle Sanity Reference object
      if ('_type' in ref && typeof ref._type === 'string') {
        docType = ref._type
      }
      if ('slug' in ref) {
        if (typeof ref.slug === 'string') slug = ref.slug
        else if (
          ref.slug &&
          typeof ref.slug === 'object' &&
          'current' in ref.slug
        ) {
          slug = ref.slug.current
        }
      }
    }

    // 4. Ensure slug is a string before using
    if (!slug || typeof slug !== 'string') return homeLink

    // 5. Construct Path (Strip leading slash to avoid double //)
    let cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug

    // 6. Add /products/ prefix for productPage types
    if (docType === 'productPage') {
      cleanSlug = `products/${cleanSlug}`
      // Products always use market/lang prefix, even for US English
      return `/${market}/${language}/${cleanSlug}`
    }

    // 7. For US English, use root paths for non-product pages; for other markets use prefixed paths
    if (market === 'us' && language === 'en') {
      return `/${cleanSlug}`
    }
    return `/${market}/${language}/${cleanSlug}`
  }

  // --- STYLING ---
  const takeoverNavBackground = takeoverNavBar?.backgroundColor?.hex
  const isMenuOpen = hoveredIndex !== null
  // The header is transparent over the page hero until it floats or a menu
  // opens; then it gets a solid surface. Text color always contrasts with
  // whatever is behind it: light text on the hero or a dark takeover color,
  // ink text on the default cream surface.
  const isSolid = isFloating || isMenuOpen
  const solidBackground = takeoverNavBackground || LIGHT_BACKGROUND
  const useLightText = !isSolid || isDarkColor(solidBackground)
  const textColorClass = useLightText ? 'text-brandWhite' : 'text-brand-ink'
  const hoverOpacityClass = 'hover:opacity-75'

  const getLocalizedBannerText = (text?: Record<string, string>): string => {
    if (!text) return ''
    return text[language] || text.en || Object.values(text)[0] || ''
  }

  const bannerText = getLocalizedBannerText(takeoverGlobalBanner?.text)
  const bannerCtaText = getLocalizedBannerText(takeoverGlobalBanner?.ctaText)
  const takeoverLogoUrl = takeoverNavBar?.logo
    ? urlFor(takeoverNavBar.logo).width(220).height(56).url()
    : null

  return (
    <>
      <div
        ref={headerRef}
        className={`top-0 left-0 right-0 z-50 flex flex-col items-center transition-transform duration-500 ease-&lsqb;cubic-bezier(0.32,0.72,0,1)&rsqb; ${
          isFloating ? 'fixed translate-y-0' : 'absolute'
        }`}
      >
        {/* Takeover banner sits above the nav row so it never covers it */}
        {!isFloating && takeoverGlobalBanner?.enabled && bannerText && (
          <div
            className="w-full z-[60] relative text-white"
            style={{
              backgroundColor:
                takeoverGlobalBanner.backgroundColor?.hex || '#111827',
            }}
          >
            <div className="max-w-[1440px] mx-auto px-4 py-2.5 md:px-6 flex items-center justify-center gap-4 text-center">
              <span className="text-sm font-heading-semibold leading-tight">
                {bannerText}
              </span>
              {takeoverGlobalBanner.ctaUrl && bannerCtaText && (
                <Link
                  href={takeoverGlobalBanner.ctaUrl}
                  className="text-xs md:text-sm font-heading-bold uppercase tracking-wide underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  {bannerCtaText}
                </Link>
              )}
            </div>
          </div>
        )}
        <div className="w-full relative flex justify-center">
          <header
            className={`relative transition-all duration-500 ease-&lsqb;cubic-bezier(0.32,0.72,0,1)&rsqb; flex items-center justify-between px-6 z-50
            ${
              isFloating
                ? 'w-[95%] max-w-[1440px] h-[72px] shadow-2xl shadow-black/10 rounded-full mt-3 border border-black/5'
                : 'w-full h-20 rounded-none mt-0 border-transparent'
            }
          `}
            style={{
              backgroundColor: isSolid ? solidBackground : 'transparent',
              borderBottomLeftRadius:
                isMenuOpen && !isFloating ? '0px' : undefined,
              borderBottomRightRadius:
                isMenuOpen && !isFloating ? '0px' : undefined,
            }}
          >
            <div className="w-full h-full flex items-center justify-between">
              {/* LOGO */}
              <Link
                href={`/${market}/${language}`}
                className={`font-heading-bold text-3xl tracking-tighter relative z-[60] transition-colors duration-300 ${textColorClass} inline-flex items-center`}
              >
                {takeoverLogoUrl ? (
                  <Image
                    src={takeoverLogoUrl}
                    alt={`${brand.name} campaign logo`}
                    width={220}
                    height={56}
                    className="h-11 w-auto"
                  />
                ) : (
                  <Image
                    src={brand.logo.wordmark}
                    alt={brand.name}
                    width={185}
                    height={38}
                    className="h-8 w-auto"
                    unoptimized
                    priority
                  />
                )}
              </Link>

              {/* NAV ITEMS */}
              <nav
                className="hidden md:flex items-center h-full absolute left-1/2 -translate-x-1/2"
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {navItems.map((item, i) => (
                  <div
                    key={item._key}
                    className="h-full flex items-center px-5 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                  >
                    <Link
                      href={resolveLink(item.link)}
                      className={`font-heading-semibold text-[15px] flex items-center gap-1.5 transition-all duration-300 py-4 ${textColorClass} ${hoverOpacityClass}`}
                    >
                      {(() => {
                        // Try to get localized text first
                        let displayText
                        if (
                          item.labelLocal &&
                          typeof item.labelLocal === 'object' &&
                          item.labelLocal[language]
                        ) {
                          displayText = item.labelLocal[language]
                        } else if (item.label) {
                          displayText =
                            typeof item.label === 'string'
                              ? item.label
                              : unwrapString(item.label)
                        } else {
                          displayText = 'Navigation Item'
                        }

                        return displayText
                      })()}
                      {item.type === 'mega' && (
                        <ChevronDownIcon
                          className={`w-[18px] h-[18px] transition-transform duration-300 ${hoveredIndex === i ? 'rotate-180' : ''}`}
                        />
                      )}
                    </Link>
                  </div>
                ))}
              </nav>

              {/* RIGHT ACTIONS */}
              <div className="flex items-center gap-6 relative z-[60]">
                <Link
                  href={`/${market}/${language}/membership`}
                  className={`hidden lg:block font-heading-semibold text-[15px] transition-colors duration-300 ${textColorClass} ${hoverOpacityClass}`}
                >
                  {translate('getStarted', language)}
                </Link>
                <Link href={`/${market}/${language}/products`}>
                  <BrandButton>{translate('shop', language)}</BrandButton>
                </Link>
              </div>
            </div>
          </header>

          {/* MEGA MENU DROPDOWN */}
          <AnimatePresence>
            {isMenuOpen && navItems[hoveredIndex]?.type === 'mega' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute left-0 w-full z-40"
                style={{ top: isFloating ? '84px' : '80px' }}
              >
                <div
                  className={`bg-white shadow-2xl overflow-hidden border border-gray-100/50 mx-auto
                  ${
                    !isFloating
                      ? 'w-full rounded-b-[40px] border-t-0 -mt-[1px]'
                      : 'w-[95%] max-w-[1440px] rounded-[32px]'
                  } 
                `}
                  onMouseEnter={() => setHoveredIndex(hoveredIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center justify-center gap-12 px-12 py-8">
                    {/* LEFT VISUAL */}
                    <div className="w-[320px] flex-shrink-0">
                      {navItems[hoveredIndex].featuredCard?.image && (
                        <Link
                          href={resolveLink(
                            navItems[hoveredIndex].featuredCard?.link
                          )}
                          onClick={() => setHoveredIndex(null)}
                          className="block w-full aspect-[4/3] relative group/card overflow-hidden rounded-[24px]"
                        >
                          <Sunburst tone="dark" origin="50% 40%" />
                          <Image
                            src={urlFor(
                              navItems[hoveredIndex].featuredCard!.image
                            )
                              .width(800)
                              .fit('max')
                              .url()}
                            alt={
                              navItems[hoveredIndex].featuredCard!.heading ||
                              'Featured'
                            }
                            fill
                            sizes="400px"
                            className="object-contain object-top p-5 pb-24 drop-shadow-[0_16px_20px_rgba(0,0,0,0.4)] transition-transform duration-700 group-hover/card:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-transparent to-transparent" />
                          <div className="absolute inset-0 flex flex-col justify-end p-5">
                            <h3 className="text-white text-xl font-display leading-tight mb-2 drop-shadow-md">
                              {navItems[hoveredIndex].featuredCard!.heading}
                            </h3>
                            <span className="inline-flex items-center text-white/90 font-heading-bold text-sm tracking-wide uppercase group-hover/card:text-white transition-colors">
                              {translate('explore', language)}
                              <span className="ml-2 bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-[10px] group-hover/card:bg-brand-primary group-hover/card:text-white transition-all">
                                →
                              </span>
                            </span>
                          </div>
                        </Link>
                      )}
                    </div>
                    {/* RIGHT LINKS */}
                    <div className="flex-1 max-w-2xl">
                      <div
                        className={`${
                          navItems[hoveredIndex].subLinks?.length <= 3
                            ? 'grid grid-cols-1 gap-4'
                            : 'grid grid-cols-2 gap-x-12 gap-y-6'
                        }`}
                      >
                        {navItems[hoveredIndex].subLinks?.map(
                          (sub: SubLink) => {
                            // Allow links even if description is missing
                            if (!sub.targetPage && !sub.url) return null

                            return (
                              <Link
                                href={resolveLink(sub.targetPage, sub.url)}
                                key={sub._key}
                                onClick={() => setHoveredIndex(null)}
                                className="group/item flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                              >
                                <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/item:bg-brand-primary group-hover/item:border-brand-primary">
                                  <SvgIcon
                                    src={getIcon(sub.icon)}
                                    className="w-5 h-5 text-gray-700 transition-colors duration-300 group-hover/item:text-white"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-heading-bold text-brand-ink text-base leading-tight group-hover/item:text-brand-primary transition-colors duration-300">
                                    {getLocalizedText(sub.title, language)}
                                  </h4>
                                  {sub.description && (
                                    <p className="text-sm text-gray-500 mt-1 leading-snug">
                                      {getLocalizedText(
                                        sub.description,
                                        language
                                      )}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            )
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

function getIcon(iconName: string | undefined) {
  if (!iconName) return defaultIcon
  const iconMap: Record<string, any> = {
    bike: scooterIcon,
    trainer: trainerIcon,
    map: mapIcon,
    chart: chartIcon,
    heart: heartIcon,
    sun: sunIcon,
  }
  return iconMap[iconName] || defaultIcon
}
