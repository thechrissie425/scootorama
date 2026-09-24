'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ============================================================================
// DEMO DATA - Hardcoded scenes for visualization
// ============================================================================

const DEMO_SCENES = [
  {
    sceneId: 'base-pass',
    xpThreshold: 0,
    unlockMessage: null, // First scene doesn't unlock
    headline: 'Welcome to Scootorama',
    subheadline: 'The home of indoor scootering',
    description:
      'Kick your way through the wackiest wonders of the world with Scooters everywhere.',
    gradient: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
    features: [
      {
        title: 'Wacky Worlds',
        description: 'Bora Bora, Alamo-Rama, Dino Detour and more',
      },
      {
        title: 'Parades',
        description: 'Costumed group rides with a marching band',
      },
      {
        title: 'Kick Plans',
        description: 'From First Push to Cake Tower Champion',
      },
    ],
    ctaLabel: 'Start Your Journey',
    ctaUrl: '#',
  },
  {
    sceneId: 'hardware',
    xpThreshold: 2000,
    unlockMessage: '🛴 GEAR UNLOCKED',
    headline: 'Scootorama Gear',
    subheadline: 'Purpose-built for the ultimate indoor experience',
    description:
      'From the Kick-Stand trainer to the all-in-one Cruiser Deluxe.',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #2d132c 50%, #801336 100%)',
    features: [
      { title: 'Cruiser Deluxe', description: 'All-in-one smart scooter' },
      { title: 'Kick-Stand', description: 'Smart roller stand' },
      {
        title: 'Honk-Honk Buttons',
        description: 'Controllers with a real horn',
      },
    ],
    ctaLabel: 'Shop Gear',
    ctaUrl: '/products',
    confetti: true,
    confettiColors: ['#D6117A', '#FF4FA8', '#FFD21F'],
  },
  {
    sceneId: 'training',
    xpThreshold: 4000,
    unlockMessage: '💪 TRAINING UNLOCKED',
    headline: 'Train Smarter',
    subheadline: 'Structured workouts that adapt to you',
    description:
      'From your first push to Saucer Cup race prep, there is a plan for every goal.',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0d7377 50%, #14a085 100%)',
    features: [
      {
        title: 'Training Plans',
        description: 'Multi-week structured programs',
      },
      {
        title: 'Auto-Kick Mode',
        description: 'The deck sets the resistance for you',
      },
      { title: 'Power-Ups', description: 'Strategic race advantages' },
    ],
    ctaLabel: 'Explore Training',
    ctaUrl: '#',
    confetti: true,
    confettiColors: ['#14a085', '#0d7377', '#1e3a5f'],
    glow: true,
    glowColor: '#14a085',
  },
  {
    sceneId: 'community',
    xpThreshold: 6000,
    unlockMessage: '🌍 COMMUNITY UNLOCKED',
    headline: 'Global Community',
    subheadline: 'Race and ride with athletes worldwide',
    description:
      'From casual group rides to pro-level races, find your people.',
    gradient: 'linear-gradient(135deg, #2c003e 0%, #512b58 50%, #8174a0 100%)',
    features: [
      { title: 'Racing', description: 'Compete in daily events' },
      { title: 'Clubs', description: 'Join or create your own' },
      { title: 'Events', description: 'Thousands weekly' },
    ],
    ctaLabel: 'Find Events',
    ctaUrl: '#',
    confetti: true,
    confettiColors: ['#8174a0', '#512b58', '#2c003e'],
  },
  {
    sceneId: 'premium',
    xpThreshold: 8000,
    unlockMessage: '⭐ DELUXE PASS UNLOCKED',
    headline: 'Deluxe Pass',
    subheadline: 'The ultimate Scootorama experience',
    description:
      'Exclusive features for serious athletes. Family sharing included.',
    gradient: 'linear-gradient(135deg, #1a0a0a 0%, #4a1010 50%, #D6117A 100%)',
    features: [
      { title: 'Family Plan', description: 'Up to 5 members' },
      { title: 'Priority Support', description: '24/7 dedicated team' },
      { title: 'Exclusive Content', description: 'Pro workouts & events' },
    ],
    ctaLabel: 'Upgrade to Plus',
    ctaUrl: '/membership',
    confetti: true,
    confettiColors: ['#D6117A', '#FF4FA8', '#FFD700', '#ffffff'],
    glow: true,
    glowColor: '#D6117A',
  },
]

// ============================================================================
// CONFETTI COMPONENT
// ============================================================================

interface ConfettiPiece {
  id: number
  x: number
  delay: number
  duration: number
  color: string
  size: number
  rotation: number
  isCircle: boolean
}

// Generate pieces with deterministic positions based on index
function generateConfettiPieces(
  count: number,
  colors: string[],
  seed: number
): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => {
    // Use deterministic pseudo-random based on seed and index
    const hash = (seed * 9301 + i * 49297) % 233280
    const rand = hash / 233280
    const rand2 = ((hash * 9301 + 49297) % 233280) / 233280
    const rand3 = ((hash * 49297 + 9301) % 233280) / 233280
    const rand4 = ((hash + i * 12345) % 233280) / 233280

    return {
      id: i,
      x: rand * 100,
      delay: rand2 * 0.5,
      duration: 2 + rand3 * 2,
      color: colors[Math.floor(rand4 * colors.length)],
      size: 6 + rand * 8,
      rotation: rand2 * 360,
      isCircle: rand3 > 0.5,
    }
  })
}

function Confetti({
  active,
  colors = ['#D6117A', '#FF4FA8', '#FFD21F'],
  count = 50,
}: {
  active: boolean
  colors?: string[]
  count?: number
}) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const seedRef = useRef(1)

  useEffect(() => {
    if (active) {
      // Generate new pieces when becoming active using effect
      seedRef.current += 1
      const newPieces = generateConfettiPieces(count, colors, seedRef.current)
      // Defer state update to next tick to avoid cascade warning
      const frame = requestAnimationFrame(() => {
        setPieces(newPieces)
      })

      // Clear after animation
      const timeout = setTimeout(() => {
        setPieces([])
      }, 4000)

      return () => {
        cancelAnimationFrame(frame)
        clearTimeout(timeout)
      }
    }
  }, [active, colors, count])

  if (pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(piece => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: -20,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.isCircle ? '50%' : '2px',
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: 850,
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// XP TRACKER COMPONENT
// ============================================================================

function XPTracker({
  currentXP,
  maxXP,
  progress,
  velocity,
}: {
  currentXP: number
  maxXP: number
  progress: number
  velocity: number
}) {
  const velocityScale = Math.min(1 + velocity * 0.003, 1.5)
  const glowIntensity = Math.min(velocity * 0.1, 30)

  return (
    <>
      {/* XP Counter - Top Right */}
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
          className="text-4xl font-bold tabular-nums text-brand-primary"
          style={{
            textShadow:
              glowIntensity > 0 ? `0 0 ${glowIntensity}px #D6117A` : 'none',
          }}
          animate={{ scale: velocityScale }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {Math.floor(currentXP).toLocaleString()}
        </motion.div>
        <div className="text-xs text-white/40">
          / {maxXP.toLocaleString()} XP
        </div>
      </motion.div>

      {/* Progress Bar - Right Side */}
      <div className="fixed right-0 top-0 bottom-0 w-1 bg-white/10 z-40">
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-primary to-brand-primary-light"
          style={{ originY: 1 }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: progress }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        />
      </div>
    </>
  )
}

// ============================================================================
// SCENE NAVIGATION DOTS
// ============================================================================

function SceneNav({
  scenes,
  currentIndex,
  onSceneClick,
}: {
  scenes: typeof DEMO_SCENES
  currentIndex: number
  onSceneClick: (index: number) => void
}) {
  return (
    <motion.nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      {scenes.map((scene, index) => {
        const isActive = index === currentIndex
        const isUnlocked = index <= currentIndex

        return (
          <button
            key={scene.sceneId}
            onClick={() => isUnlocked && onSceneClick(index)}
            className={cn(
              'group flex items-center gap-3 transition-all duration-300',
              isUnlocked
                ? 'opacity-100 cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
            )}
            disabled={!isUnlocked}
          >
            {/* Dot */}
            <motion.div
              className={cn(
                'w-3 h-3 rounded-full border-2 transition-colors',
                isActive
                  ? 'border-brand-primary bg-brand-primary'
                  : 'border-white/40 bg-transparent'
              )}
              animate={{
                scale: isActive ? 1.3 : 1,
                boxShadow: isActive ? '0 0 12px #D6117A' : 'none',
              }}
            />

            {/* Label on hover */}
            <span
              className={cn(
                'text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap',
                isActive && 'opacity-100 text-brand-primary-light'
              )}
            >
              {scene.headline}
            </span>
          </button>
        )
      })}
    </motion.nav>
  )
}

// ============================================================================
// UNLOCK FLASH
// ============================================================================

function UnlockFlash({
  message,
  onComplete,
}: {
  message: string
  onComplete: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2, times: [0, 0.15, 0.7, 1] }}
      onAnimationComplete={onComplete}
    >
      {/* Radial glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(248, 90, 23, 0.3) 0%, transparent 70%)',
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 2, opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.5 }}
      />

      {/* Text */}
      <motion.h2
        className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider text-center text-brand-primary"
        style={{
          textShadow: '0 0 60px #D6117A, 0 0 120px #D6117A',
        }}
        initial={{ scale: 0.5, y: 30 }}
        animate={{ scale: [0.5, 1.2, 1], y: [30, 0, 0] }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {message}
      </motion.h2>
    </motion.div>
  )
}

// ============================================================================
// SCENE COMPONENT
// ============================================================================

function Scene({
  scene,
  isActive,
  velocity,
}: {
  scene: (typeof DEMO_SCENES)[0]
  isActive: boolean
  velocity: number
}) {
  const shouldReduceMotion = useReducedMotion()

  // Velocity-based effects
  const velocityBlur = !shouldReduceMotion ? Math.min(velocity * 0.01, 4) : 0

  // Pre-generate particle positions to avoid Math.random during render
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: (i * 5) % 100,
        top: (i * 7 + 10) % 100,
        duration: 3 + (i % 3),
        delay: (i * 0.15) % 3,
      })),
    []
  )

  return (
    <motion.section
      id={`scene-${scene.sceneId}`}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden snap-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.4 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: scene.gradient }}
      />

      {/* Glow effect */}
      {scene.glow && isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${scene.glowColor}20 0%, transparent 60%)`,
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Animated background particles */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 rounded-full bg-white/20"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 py-24 text-center max-w-5xl"
        style={{
          filter: velocityBlur > 0 ? `blur(${velocityBlur}px)` : 'none',
        }}
      >
        {/* Headline */}
        <motion.h1
          className="font-black text-5xl md:text-7xl lg:text-8xl text-white mb-6 uppercase tracking-tight"
          initial={{ opacity: 0, y: 60 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {scene.headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl text-white/80 mb-4 font-medium"
          initial={{ opacity: 0, y: 40 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {scene.subheadline}
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-lg text-white/60 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {scene.description}
        </motion.p>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {scene.features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-left border border-white/10 hover:border-brand-primary/50 transition-colors"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={
                isActive
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 30, scale: 0.95 }
              }
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <a
            href={scene.ctaUrl}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-brand-primary hover:bg-brand-primary-dark transition-all duration-300 hover:scale-105"
            style={{ boxShadow: '0 0 30px rgba(248, 90, 23, 0.5)' }}
          >
            {scene.ctaLabel}
            <span className="text-xl">→</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator on first scene */}
      {scene.sceneId === 'base-pass' && isActive && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-sm uppercase tracking-wider">
            Scroll to unlock
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↓
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  )
}

// ============================================================================
// MAIN DEMO COMPONENT
// ============================================================================

export default function CampaignExperienceDemo() {
  const [currentXP, setCurrentXP] = useState(0)
  const [currentScene, setCurrentScene] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeUnlock, setActiveUnlock] = useState<string | null>(null)
  const [activeConfetti, setActiveConfetti] = useState<string[] | null>(null)

  const maxXP = 10000
  const shownUnlocksRef = useRef<Set<string>>(new Set())
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef<number | null>(null)
  const velocityDecayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSceneRef = useRef(0)

  // Get scene from XP
  const getSceneFromXP = useCallback((xp: number) => {
    for (let i = DEMO_SCENES.length - 1; i >= 0; i--) {
      if (xp >= DEMO_SCENES[i].xpThreshold) {
        return i
      }
    }
    return 0
  }, [])

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const now = Date.now()

      if (scrollHeight <= 0) return

      const prog = Math.min(1, Math.max(0, scrollY / scrollHeight))
      const xp = Math.round(prog * maxXP)

      // Velocity
      const lastTime = lastScrollTime.current || now
      const timeDelta = now - lastTime
      const scrollDelta = Math.abs(scrollY - lastScrollY.current)
      const rawVelocity = timeDelta > 0 ? (scrollDelta / timeDelta) * 1000 : 0
      const vel = Math.min(500, rawVelocity)

      // Scene
      const sceneIndex = getSceneFromXP(xp)
      const isNewScene = sceneIndex > lastSceneRef.current

      // Trigger unlock effects
      if (isNewScene) {
        const scene = DEMO_SCENES[sceneIndex]
        if (
          scene.unlockMessage &&
          !shownUnlocksRef.current.has(scene.sceneId)
        ) {
          shownUnlocksRef.current.add(scene.sceneId)
          setActiveUnlock(scene.unlockMessage)
          if (scene.confetti) {
            setActiveConfetti(scene.confettiColors || ['#D6117A'])
          }
        }
      }

      lastSceneRef.current = sceneIndex
      lastScrollY.current = scrollY
      lastScrollTime.current = now

      setCurrentXP(xp)
      setCurrentScene(sceneIndex)
      setVelocity(vel)
      setProgress(prog)

      // Decay velocity
      if (velocityDecayRef.current) clearTimeout(velocityDecayRef.current)
      velocityDecayRef.current = setTimeout(() => setVelocity(0), 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (velocityDecayRef.current) clearTimeout(velocityDecayRef.current)
    }
  }, [getSceneFromXP])

  // Scroll to scene
  const scrollToScene = (index: number) => {
    const el = document.getElementById(`scene-${DEMO_SCENES[index].sceneId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="relative bg-black min-h-screen">
      {/* Title Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10 px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-brand-primary font-black text-xl">
              SCOOTORAMA
            </span>
            <span className="text-white/40">:</span>
            <span className="text-white font-bold uppercase tracking-wider">
              Unlocked
            </span>
          </div>
          <div className="text-sm text-white/60">Demo Experience</div>
        </div>
      </div>

      {/* XP Tracker */}
      <XPTracker
        currentXP={currentXP}
        maxXP={maxXP}
        progress={progress}
        velocity={velocity}
      />

      {/* Scene Navigation */}
      <SceneNav
        scenes={DEMO_SCENES}
        currentIndex={currentScene}
        onSceneClick={scrollToScene}
      />

      {/* Confetti */}
      <Confetti active={!!activeConfetti} colors={activeConfetti || []} />

      {/* Unlock Flash */}
      <AnimatePresence>
        {activeUnlock && (
          <UnlockFlash
            message={activeUnlock}
            onComplete={() => {
              setActiveUnlock(null)
              setActiveConfetti(null)
            }}
          />
        )}
      </AnimatePresence>

      {/* Scenes */}
      <div className="snap-y snap-mandatory">
        {DEMO_SCENES.map((scene, index) => (
          <Scene
            key={scene.sceneId}
            scene={scene}
            isActive={index === currentScene}
            velocity={velocity}
          />
        ))}
      </div>

      {/* Final CTA Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-brand-primary-dark snap-start">
        <div className="text-center px-6">
          <motion.h2
            className="text-4xl md:text-6xl font-black text-white mb-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Level Up?
          </motion.h2>
          <motion.p
            className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            You&apos;ve unlocked {currentXP.toLocaleString()} XP. Join
            Scootorama Plus and keep the momentum going.
          </motion.p>
          <motion.a
            href="/membership"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-xl text-black bg-brand-primary hover:bg-brand-primary-light transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 0.4 }}
            style={{ boxShadow: '0 0 60px rgba(248, 90, 23, 0.6)' }}
          >
            Get the Deluxe Pass
            <span className="text-2xl">→</span>
          </motion.a>
        </div>
      </section>
    </main>
  )
}
