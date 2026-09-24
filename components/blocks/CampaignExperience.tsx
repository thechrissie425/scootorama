'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useScrollXP } from '@/hooks/useScrollXP'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

export interface ExperienceScene {
  sceneId: string
  xpThreshold: number
  unlockMessage?: string
  headline: string
  subheadline?: string
  description?: string
  background?: {
    type: 'video' | 'image' | 'gradient'
    video?: { asset?: { url: string } }
    image?: { asset?: { url: string }; alt?: string }
    gradient?: string
    overlayOpacity?: number
  }
  features?: Array<{
    _id: string
    title: string
    description?: string
    image?: { asset?: { url: string }; alt?: string }
    video?: { asset?: { url: string } }
  }>
  benefits?: Array<{
    _id: string
    title: string
    description?: string
    icon?: string
  }>
  pricingTiers?: Array<{
    _id: string
    tierId: string
    name: string
    description?: string
    prices?: Array<{ region: string; amount: number; currency: string }>
  }>
  effects?: {
    confetti?: boolean
    confettiColors?: string[]
    glow?: boolean
    glowColor?: string
    velocityEffects?: 'none' | 'blur' | 'particles' | 'speed'
  }
  cta?: {
    label?: string
    url?: string
    variant?: string
  }
}

export interface CampaignExperienceData {
  title: string
  tagline?: string
  description?: string
  scenes: ExperienceScene[]
  heroLogo?: { asset?: { url: string }; alt?: string }
  themeColor?: string
  particleConfig?: {
    enabled?: boolean
    style?: 'orbs' | 'stars' | 'confetti' | 'geometric'
    colors?: string[]
    density?: number
  }
  xpConfig?: {
    maxXP?: number
    showXPCounter?: boolean
    showProgressBar?: boolean
    progressBarPosition?: 'top' | 'bottom' | 'left' | 'right'
    velocityMultiplier?: number
  }
  navigation?: {
    enabled?: boolean
    style?: 'dots' | 'names' | 'markers'
    position?: 'left' | 'right'
  }
}

interface CampaignExperienceProps {
  data: CampaignExperienceData
  language?: string
}

// ============================================================================
// XP TRACKER COMPONENT
// ============================================================================

function XPTracker({
  currentXP,
  maxXP,
  progress,
  velocity,
  themeColor = '#D6117A',
  showCounter = true,
  showProgressBar = true,
  progressBarPosition = 'right',
}: {
  currentXP: number
  maxXP: number
  progress: number
  velocity: number
  themeColor?: string
  showCounter?: boolean
  showProgressBar?: boolean
  progressBarPosition?: 'top' | 'bottom' | 'left' | 'right'
}) {
  const isVertical =
    progressBarPosition === 'left' || progressBarPosition === 'right'
  const velocityScale = Math.min(1 + velocity * 0.5, 2)

  // Position classes
  const positionClasses = {
    top: 'top-0 left-0 right-0 h-1',
    bottom: 'bottom-0 left-0 right-0 h-1',
    left: 'left-0 top-0 bottom-0 w-1',
    right: 'right-0 top-0 bottom-0 w-1',
  }

  return (
    <>
      {/* XP Counter */}
      {showCounter && (
        <motion.div
          className="fixed top-6 right-6 z-50 flex flex-col items-end gap-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="text-xs font-medium text-white/60 uppercase tracking-wider">
            XP Earned
          </div>
          <motion.div
            className="text-4xl font-bold tabular-nums"
            style={{ color: themeColor }}
            animate={{ scale: velocityScale }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {Math.floor(currentXP).toLocaleString()}
          </motion.div>
          <div className="text-xs text-white/40">
            / {maxXP.toLocaleString()} XP
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      {showProgressBar && (
        <div
          className={cn(
            'fixed z-40 bg-white/10',
            positionClasses[progressBarPosition]
          )}
        >
          <motion.div
            className="bg-gradient-to-r from-brand-primary to-brand-primary-light"
            style={{
              backgroundColor: themeColor,
              ...(isVertical
                ? { width: '100%', originY: 1 }
                : { height: '100%', originX: 0 }),
            }}
            initial={isVertical ? { scaleY: 0 } : { scaleX: 0 }}
            animate={isVertical ? { scaleY: progress } : { scaleX: progress }}
            transition={{ type: 'spring', stiffness: 100, damping: 30 }}
          />
        </div>
      )}
    </>
  )
}

// ============================================================================
// SCENE NAVIGATION COMPONENT
// ============================================================================

function SceneNavigation({
  scenes,
  currentSceneIndex,
  themeColor = '#D6117A',
  style = 'dots',
  position = 'right',
  onSceneClick,
}: {
  scenes: ExperienceScene[]
  currentSceneIndex: number
  themeColor?: string
  style?: 'dots' | 'names' | 'markers'
  position?: 'left' | 'right'
  onSceneClick?: (index: number) => void
}) {
  return (
    <motion.nav
      className={cn(
        'fixed top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3',
        position === 'right' ? 'right-6' : 'left-6'
      )}
      initial={{ opacity: 0, x: position === 'right' ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      {scenes.map((scene, index) => {
        const isActive = index === currentSceneIndex
        const isUnlocked = index <= currentSceneIndex

        return (
          <button
            key={scene.sceneId}
            onClick={() => onSceneClick?.(index)}
            className={cn(
              'flex items-center gap-2 transition-all duration-300',
              position === 'right' ? 'flex-row-reverse' : 'flex-row',
              isUnlocked ? 'opacity-100' : 'opacity-30'
            )}
            disabled={!isUnlocked}
          >
            {/* Dot */}
            <motion.div
              className={cn(
                'w-2.5 h-2.5 rounded-full border transition-colors',
                isActive ? 'border-transparent' : 'border-white/40'
              )}
              style={{
                backgroundColor: isActive ? themeColor : 'transparent',
              }}
              animate={{
                scale: isActive ? 1.3 : 1,
                boxShadow: isActive ? `0 0 12px ${themeColor}` : 'none',
              }}
            />

            {/* Label */}
            {style === 'names' && (
              <motion.span
                className="text-xs text-white/60 whitespace-nowrap"
                animate={{ opacity: isActive ? 1 : 0.4 }}
              >
                {scene.unlockMessage || scene.headline}
              </motion.span>
            )}

            {style === 'markers' && (
              <motion.span
                className="text-xs text-white/40 tabular-nums"
                animate={{ opacity: isActive ? 1 : 0.3 }}
              >
                {scene.xpThreshold.toLocaleString()} XP
              </motion.span>
            )}
          </button>
        )
      })}
    </motion.nav>
  )
}

// ============================================================================
// UNLOCK FLASH COMPONENT
// ============================================================================

function UnlockFlash({
  message,
  themeColor = '#D6117A',
  onComplete,
}: {
  message: string
  themeColor?: string
  onComplete?: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.5, times: [0, 0.2, 0.7, 1] }}
      onAnimationComplete={onComplete}
    >
      {/* Radial glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${themeColor}20 0%, transparent 70%)`,
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.5, opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.2 }}
      />

      {/* Text */}
      <motion.h2
        className="text-4xl md:text-6xl font-bold uppercase tracking-wider text-center"
        style={{
          color: themeColor,
          textShadow: `0 0 40px ${themeColor}`,
        }}
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: [0.8, 1.1, 1], y: [20, 0, 0] }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {message}
      </motion.h2>
    </motion.div>
  )
}

// ============================================================================
// SCENE CONTAINER COMPONENT
// ============================================================================

function SceneContainer({
  scene,
  isActive,
  sceneProgress: _sceneProgress,
  velocity,
  themeColor = '#D6117A',
}: {
  scene: ExperienceScene
  isActive: boolean
  sceneProgress: number
  velocity: number
  themeColor?: string
}) {
  const shouldReduceMotion = useReducedMotion()

  // Background rendering
  const renderBackground = () => {
    const { background } = scene
    if (!background) return null

    const overlayOpacity = (background.overlayOpacity ?? 40) / 100

    switch (background.type) {
      case 'video':
        return (
          <div className="absolute inset-0">
            {background.video?.asset?.url && (
              <video
                src={background.video.asset.url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          </div>
        )

      case 'image':
        return (
          <div className="absolute inset-0">
            {background.image?.asset?.url && (
              // Using standard img for background - Next/Image has issues with absolute positioning
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={background.image.asset.url}
                alt={background.image.alt || ''}
                className="w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          </div>
        )

      case 'gradient':
      default:
        return (
          <div
            className="absolute inset-0"
            style={{
              background:
                background.gradient ||
                'linear-gradient(135deg, #1E1E23 0%, #2C2C33 100%)',
            }}
          />
        )
    }
  }

  // Velocity-based blur effect
  const velocityBlur =
    scene.effects?.velocityEffects === 'blur' && !shouldReduceMotion
      ? Math.min(velocity * 2, 8)
      : 0

  return (
    <motion.section
      id={`scene-${scene.sceneId}`}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
      style={{
        scrollSnapAlign: 'start',
      }}
    >
      {/* Background */}
      {renderBackground()}

      {/* Glow effect */}
      {scene.effects?.glow && isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${scene.effects.glowColor || themeColor}15 0%, transparent 60%)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 py-24 text-center"
        style={{
          filter: velocityBlur > 0 ? `blur(${velocityBlur}px)` : 'none',
        }}
      >
        {/* Headline */}
        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 uppercase tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {scene.headline}
        </motion.h1>

        {/* Subheadline */}
        {scene.subheadline && (
          <motion.p
            className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {scene.subheadline}
          </motion.p>
        )}

        {/* Description */}
        {scene.description && (
          <motion.p
            className="text-lg text-white/60 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {scene.description}
          </motion.p>
        )}

        {/* Features Grid */}
        {scene.features && scene.features.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {scene.features.map((feature, index) => (
              <motion.div
                key={feature._id}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-left border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="text-sm text-white/60">{feature.description}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        {scene.cta?.label && scene.cta?.url && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <a
              href={scene.cta.url}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: themeColor,
                boxShadow: `0 0 30px ${themeColor}50`,
              }}
            >
              {scene.cta.label}
            </a>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  )
}

// ============================================================================
// MAIN CAMPAIGN EXPERIENCE COMPONENT
// ============================================================================

export function CampaignExperience({
  data,
  language: _language = 'en',
}: CampaignExperienceProps) {
  const { scenes, themeColor = '#D6117A', xpConfig, navigation } = data

  // Sort scenes by XP threshold
  const sortedScenes = [...scenes].sort((a, b) => a.xpThreshold - b.xpThreshold)

  // Extract thresholds from scenes
  const thresholds = sortedScenes.map(s => s.xpThreshold)

  // Use scroll XP hook
  const {
    currentXP,
    currentScene,
    velocity,
    progress,
    sceneProgress,
    isUnlocking,
  } = useScrollXP({
    maxXP: xpConfig?.maxXP || 10000,
    sceneThresholds: thresholds,
  })

  // Track shown unlock messages using refs to avoid cascade renders
  const shownUnlocksRef = useRef<Set<string>>(new Set())
  const [activeUnlock, setActiveUnlock] = useState<string | null>(null)
  const unlockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Handle unlock animations - use callback to defer state updates
  const handleUnlock = useCallback((scene: ExperienceScene) => {
    if (scene.unlockMessage && !shownUnlocksRef.current.has(scene.sceneId)) {
      shownUnlocksRef.current.add(scene.sceneId)
      // Defer the state update to avoid cascade render warning
      if (unlockTimeoutRef.current) {
        clearTimeout(unlockTimeoutRef.current)
      }
      unlockTimeoutRef.current = setTimeout(() => {
        setActiveUnlock(scene.unlockMessage || null)
      }, 0)
    }
  }, [])

  // Watch for scene changes
  useEffect(() => {
    if (isUnlocking && currentScene > 0) {
      const scene = sortedScenes[currentScene]
      if (scene) {
        handleUnlock(scene)
      }
    }
  }, [isUnlocking, currentScene, sortedScenes, handleUnlock])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (unlockTimeoutRef.current) {
        clearTimeout(unlockTimeoutRef.current)
      }
    }
  }, [])

  // Scroll to scene
  const scrollToScene = (index: number) => {
    const sceneEl = document.getElementById(
      `scene-${sortedScenes[index].sceneId}`
    )
    if (sceneEl) {
      sceneEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative bg-black min-h-screen">
      {/* XP Tracker */}
      <XPTracker
        currentXP={currentXP}
        maxXP={xpConfig?.maxXP || 10000}
        progress={progress}
        velocity={velocity}
        themeColor={themeColor}
        showCounter={xpConfig?.showXPCounter !== false}
        showProgressBar={xpConfig?.showProgressBar !== false}
        progressBarPosition={xpConfig?.progressBarPosition || 'right'}
      />

      {/* Scene Navigation */}
      {navigation?.enabled !== false && (
        <SceneNavigation
          scenes={sortedScenes}
          currentSceneIndex={currentScene}
          themeColor={themeColor}
          style={navigation?.style || 'dots'}
          position={navigation?.position || 'right'}
          onSceneClick={scrollToScene}
        />
      )}

      {/* Unlock Flash */}
      <AnimatePresence>
        {activeUnlock && (
          <UnlockFlash
            message={activeUnlock}
            themeColor={themeColor}
            onComplete={() => setActiveUnlock(null)}
          />
        )}
      </AnimatePresence>

      {/* Scenes */}
      <div className="snap-y snap-mandatory overflow-y-auto">
        {sortedScenes.map((scene, index) => (
          <SceneContainer
            key={scene.sceneId}
            scene={scene}
            isActive={index === currentScene}
            sceneProgress={index === currentScene ? sceneProgress : 0}
            velocity={velocity}
            themeColor={themeColor}
          />
        ))}
      </div>
    </div>
  )
}

export default CampaignExperience
