'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'
import SvgIcon from '@/components/ui/SvgIcon'
import closeIcon from '@/icons/system/close.svg'
import pinIcon from '@/icons/system/pin.svg'
import activityIcon from '@/icons/ui/data-graphs.svg'
import clockIcon from '@/icons/ui/clock.svg'
import starIcon from '@/icons/system/star-filled.svg'
import { RIDE_MODE_LABELS, type RideMode } from '@/lib/worlds'

interface Route {
  _id: string
  routeId: string
  name: string
  world: string
  sportType: RideMode
  distance: number
  elevation: number
  difficulty: number
  featured?: boolean
  tags?: string[]
  description?: string
  highlights?: string
  heroImage?: any
  mapImage?: any
  slug?: { current: string }
  imageUrl?: string
  profileImageUrl?: string
}

interface RouteIndexGridProps {
  routes: Route[]
  market?: string
  language?: string
}

const DIFFICULTY_CONFIG = {
  1: {
    label: 'Easy',
    color: 'bg-green-500',
    textColor: 'text-green-300',
    borderColor: 'border-green-500',
  },
  2: {
    label: 'Moderate',
    color: 'bg-blue-500',
    textColor: 'text-blue-300',
    borderColor: 'border-blue-500',
  },
  3: {
    label: 'Challenging',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-300',
    borderColor: 'border-yellow-500',
  },
  4: {
    label: 'Hard',
    color: 'bg-orange-500',
    textColor: 'text-orange-300',
    borderColor: 'border-orange-500',
  },
  5: {
    label: 'Epic',
    color: 'bg-red-500',
    textColor: 'text-red-300',
    borderColor: 'border-red-500',
  },
} as const

// Tag component matching Figma design system
const RouteTag = ({
  label,
  size = 'small',
}: {
  label: string
  size?: 'small' | 'medium' | 'large'
}) => {
  const sizeConfig = {
    small: {
      height: 'h-[20px]',
      fontSize: 'text-[12px]',
      leading: 'leading-[16px]',
      padding: 'px-3',
    },
    medium: {
      height: 'h-[22px]',
      fontSize: 'text-[14px]',
      leading: 'leading-[16px]',
      padding: 'px-4',
    },
    large: {
      height: 'h-[26px]',
      fontSize: 'text-[16px]',
      leading: 'leading-[18px]',
      padding: 'px-5',
    },
  }

  const config = sizeConfig[size]

  return (
    <div className="inline-flex items-center">
      {/* Parallelogram shape with skew */}
      <div
        className={`${config.height} bg-[#cbd0d8] flex items-center justify-center ${config.padding} skew-x-[-12deg] rounded-sm`}
      >
        <span
          className={`${config.fontSize} ${config.leading} font-body font-bold text-[#373f4d] uppercase whitespace-nowrap skew-x-[12deg]`}
        >
          {label}
        </span>
      </div>
    </div>
  )
}

export default function RouteIndexGrid({
  routes,
  market: _market = 'us',
  language: _language = 'en',
}: RouteIndexGridProps) {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)

  // While the route modal is open: Escape closes it and the page behind
  // doesn't scroll.
  useEffect(() => {
    if (!selectedRoute) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedRoute(null)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [selectedRoute])
  const [filterWorld, setFilterWorld] = useState<string>('all')
  const [filterSport, setFilterSport] = useState<string>('all')
  const { formatDistance, market: marketConfig } = useMarketFormatting()

  // Helper to format elevation based on market
  const formatElevation = (meters: number) => {
    // US market uses imperial (miles), others use metric (km)
    if (marketConfig?.measurements.distance === 'mi') {
      const feet = meters * 3.28084
      return `${Math.round(feet)} ft`
    }
    return `${Math.round(meters)} m`
  }

  // Get unique worlds
  const worlds = Array.from(new Set(routes.map(r => r.world))).sort()

  // Filter routes
  const filteredRoutes = routes.filter(route => {
    if (filterWorld !== 'all' && route.world !== filterWorld) return false
    if (filterSport !== 'all' && route.sportType !== filterSport) return false
    return true
  })

  const getDifficultyConfig = (difficulty: number) => {
    const clampedDifficulty = Math.min(5, Math.max(1, difficulty)) as
      | 1
      | 2
      | 3
      | 4
      | 5
    return DIFFICULTY_CONFIG[clampedDifficulty]
  }

  return (
    <>
      {/* Header Section */}
      <div className="bg-gradient-to-b from-brand-ink to-darkGrey border-b border-brandWhite/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-header pb-16">
          <div className="max-w-4xl">
            <h1 className="font-display text-5xl md:text-7xl uppercase text-brandWhite mb-6 leading-none">
              Scootorama Routes
            </h1>
            <p className="font-body text-xl text-lightGrey mb-8">
              Explore {routes.length} routes across {worlds.length} wacky
              worlds. From boardwalk cruises to cake-tower climbs.
            </p>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* World Filter */}
              <select
                value={filterWorld}
                onChange={e => setFilterWorld(e.target.value)}
                className="px-6 py-3 bg-darkGrey border border-brandWhite/10 rounded-full text-brandWhite font-heading-bold uppercase text-sm focus:outline-none focus:border-brand-primary transition-colors cursor-pointer"
              >
                <option value="all">All Worlds ({routes.length})</option>
                {worlds.map(world => (
                  <option key={world} value={world}>
                    {world} ({routes.filter(r => r.world === world).length})
                  </option>
                ))}
              </select>

              {/* Sport Filter */}
              <select
                value={filterSport}
                onChange={e => setFilterSport(e.target.value)}
                className="px-6 py-3 bg-darkGrey border border-brandWhite/10 rounded-full text-brandWhite font-heading-bold uppercase text-sm focus:outline-none focus:border-brand-primary transition-colors cursor-pointer"
              >
                <option value="all">All Modes</option>
                <option value="KICK">
                  Kick ({routes.filter(r => r.sportType === 'KICK').length})
                </option>
                <option value="CRUISE">
                  Cruise ({routes.filter(r => r.sportType === 'CRUISE').length})
                </option>
              </select>
            </div>

            {/* Results Count */}
            <p className="text-lightGrey-dark font-numeral text-sm mt-4">
              Showing {filteredRoutes.length} route
              {filteredRoutes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRoutes.map(route => {
            const diffConfig = getDifficultyConfig(route.difficulty)

            return (
              <motion.div
                key={route._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-darkGrey rounded-2xl overflow-hidden border border-brandWhite/10 hover:border-brand-primary/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-orange-900/20"
                onClick={() => setSelectedRoute(route)}
              >
                {/* Featured Badge */}
                {route.featured && (
                  <div className="absolute top-4 right-4 z-10 bg-brand-primary px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                    <SvgIcon src={starIcon} className="w-4 h-4 text-white" />
                    <span className="text-white font-display text-xs uppercase">
                      Featured
                    </span>
                  </div>
                )}

                {/* Hero Image */}
                <div className="relative h-48 bg-gradient-to-b from-black/40 to-black/80">
                  {route.imageUrl || route.heroImage ? (
                    <Image
                      src={
                        route.imageUrl ||
                        urlFor(route.heroImage).width(600).url()
                      }
                      alt={route.name}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <SvgIcon
                        src={pinIcon}
                        className="w-16 h-16 text-brandWhite/20"
                      />
                    </div>
                  )}
                  {/* Sport Badge */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white font-numeral text-[10px] uppercase tracking-widest">
                      {RIDE_MODE_LABELS[route.sportType]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="font-display text-xl text-brandWhite mb-1 leading-tight group-hover:text-brand-primary transition-colors">
                    {route.name}
                  </h3>
                  <p className="text-lightGrey-dark font-numeral text-xs uppercase tracking-wider mb-4">
                    {route.world}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-brandWhite/5 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <SvgIcon
                          src={activityIcon}
                          className="w-3 h-3 text-lightGrey-dark"
                        />
                        <span className="text-lightGrey-dark font-numeral text-[11px] uppercase tracking-widest">
                          Distance
                        </span>
                      </div>
                      <div className="text-brandWhite font-heading-bold text-lg">
                        {formatDistance(route.distance)}
                      </div>
                    </div>
                    <div className="bg-brandWhite/5 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <SvgIcon
                          src={clockIcon}
                          className="w-3 h-3 text-lightGrey-dark"
                        />
                        <span className="text-lightGrey-dark font-numeral text-[11px] uppercase tracking-widest">
                          Elevation
                        </span>
                      </div>
                      <div className="text-brandWhite font-heading-bold text-lg">
                        {formatElevation(route.elevation)}
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${diffConfig.borderColor} ${diffConfig.color}/20 mb-3`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${diffConfig.color}`}
                    />
                    <span
                      className={`${diffConfig.textColor} font-heading-bold text-xs uppercase`}
                    >
                      {diffConfig.label}
                    </span>
                  </div>

                  {/* Tags */}
                  {route.tags && route.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {route.tags.slice(0, 3).map(tag => (
                        <RouteTag key={tag} label={tag} size="small" />
                      ))}
                      {route.tags.length > 3 && (
                        <span className="text-lightGrey-dark text-xs font-numeral">
                          +{route.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lightGrey-dark font-body text-xl">
              No routes found with these filters.
            </p>
          </div>
        )}
      </div>

      {/* Expanded Route Modal */}
      <AnimatePresence>
        {selectedRoute && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoute(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />

            {/* Modal: centered by a flex wrapper, because framer-motion owns
                the element's transform (a translate-based center gets overwritten) */}
            <div
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none"
              role="dialog"
              aria-modal="true"
              aria-label={selectedRoute.name}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 24 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="pointer-events-auto relative w-full max-w-4xl max-h-[90vh] bg-darkGrey rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedRoute(null)}
                  aria-label="Close"
                  className="absolute top-6 right-6 z-10 p-3 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full transition-colors"
                >
                  <SvgIcon src={closeIcon} className="w-6 h-6 text-white" />
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1">
                  {/* Hero Section */}
                  <div className="relative h-56 md:h-80 bg-gradient-to-b from-black/60 to-black/90">
                    {selectedRoute.imageUrl || selectedRoute.heroImage ? (
                      <Image
                        src={
                          selectedRoute.imageUrl ||
                          urlFor(selectedRoute.heroImage).width(1200).url()
                        }
                        alt={selectedRoute.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1200px) 100vw, 1200px"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <SvgIcon
                          src={pinIcon}
                          className="w-32 h-32 text-brandWhite/10"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-darkGrey via-transparent to-transparent" />

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                      <div className="flex items-center gap-3 mb-3">
                        {selectedRoute.featured && (
                          <div className="bg-brand-primary px-3 py-1.5 rounded-full flex items-center gap-2">
                            <SvgIcon
                              src={starIcon}
                              className="w-4 h-4 text-white"
                            />
                            <span className="text-white font-display text-xs uppercase">
                              Featured
                            </span>
                          </div>
                        )}
                        <span className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-brandWhite font-numeral text-sm uppercase tracking-widest">
                          {RIDE_MODE_LABELS[selectedRoute.sportType]}
                        </span>
                      </div>
                      <h2 className="font-display text-3xl md:text-5xl text-brandWhite mb-2 leading-none">
                        {selectedRoute.name}
                      </h2>
                      <p className="text-lightGrey font-numeral text-lg uppercase tracking-wider">
                        {selectedRoute.world}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 md:p-8 space-y-6 md:space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      <div className="bg-brandWhite/5 rounded-2xl p-4 md:p-6 border border-brandWhite/10">
                        <div className="flex items-center gap-2 mb-2 text-lightGrey-dark">
                          <SvgIcon src={activityIcon} className="w-5 h-5" />
                          <span className="text-xs font-numeral uppercase tracking-widest">
                            Distance
                          </span>
                        </div>
                        <div className="text-2xl md:text-3xl font-display text-brandWhite">
                          {formatDistance(selectedRoute.distance)}
                        </div>
                      </div>
                      <div className="bg-brandWhite/5 rounded-2xl p-4 md:p-6 border border-brandWhite/10">
                        <div className="flex items-center gap-2 mb-2 text-lightGrey-dark">
                          <SvgIcon src={clockIcon} className="w-5 h-5" />
                          <span className="text-xs font-numeral uppercase tracking-widest">
                            Elevation
                          </span>
                        </div>
                        <div className="text-2xl md:text-3xl font-display text-brandWhite">
                          {formatElevation(selectedRoute.elevation)}
                        </div>
                      </div>
                      <div className="col-span-2 md:col-span-1 bg-brandWhite/5 rounded-2xl p-4 md:p-6 border border-brandWhite/10">
                        <div className="flex items-center gap-2 mb-2 text-lightGrey-dark">
                          <span className="text-xs font-numeral uppercase tracking-widest">
                            Difficulty
                          </span>
                        </div>
                        <div
                          className={`text-2xl md:text-3xl font-display ${getDifficultyConfig(selectedRoute.difficulty).textColor}`}
                        >
                          {getDifficultyConfig(selectedRoute.difficulty).label}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedRoute.description && (
                      <div>
                        <h3 className="font-heading-bold text-2xl text-brandWhite mb-4 uppercase">
                          About This Route
                        </h3>
                        <p className="font-body text-lg text-lightGrey leading-relaxed">
                          {selectedRoute.description}
                        </p>
                      </div>
                    )}

                    {/* Highlights */}
                    {selectedRoute.highlights && (
                      <div>
                        <h3 className="font-heading-bold text-2xl text-brandWhite mb-4 uppercase">
                          Route Highlights
                        </h3>
                        <p className="font-body text-lg text-lightGrey leading-relaxed">
                          {selectedRoute.highlights}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    {selectedRoute.tags && selectedRoute.tags.length > 0 && (
                      <div>
                        <h3 className="font-heading-bold text-xl text-brandWhite mb-4 uppercase">
                          Route Tags
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {selectedRoute.tags.map(tag => (
                            <RouteTag key={tag} label={tag} size="medium" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Map Image */}
                    {(selectedRoute.profileImageUrl ||
                      selectedRoute.mapImage) && (
                      <div className="bg-black/40 rounded-2xl p-8 border border-brandWhite/5">
                        <h3 className="font-heading-bold text-xl text-brandWhite mb-6 uppercase">
                          Route Map
                        </h3>
                        <div className="relative aspect-video">
                          <Image
                            src={
                              selectedRoute.profileImageUrl ||
                              urlFor(selectedRoute.mapImage).width(1000).url()
                            }
                            alt={`${selectedRoute.name} map`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1000px) 100vw, 1000px"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
