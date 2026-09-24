'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// --- TYPES ---
export interface ScrollXPConfig {
  maxXP: number // Total XP available (default: 10000)
  sceneThresholds: number[] // XP values where scenes unlock (e.g., [0, 2000, 4000, 6000, 8000])
  thresholds?: number[] // Alias for sceneThresholds for convenience
  onSceneUnlock?: (sceneIndex: number) => void
  onXPChange?: (xp: number, velocity: number) => void
}

export interface ScrollXPState {
  currentXP: number
  currentScene: number
  velocity: number // Scroll velocity (for watts-like effects)
  progress: number // 0-1 progress through entire experience
  sceneProgress: number // 0-1 progress within current scene
  isUnlocking: boolean // True briefly when a scene unlocks
}

const DEFAULT_CONFIG: ScrollXPConfig = {
  maxXP: 10000,
  sceneThresholds: [0, 2000, 4000, 6000, 8000],
}

/**
 * useScrollXP - Maps scroll progress to XP and scene unlocks
 *
 * XP = cumulative progress through the experience
 * Velocity = intensity/effort (for visual effects)
 */
export function useScrollXP(
  config: Partial<ScrollXPConfig> = {}
): ScrollXPState {
  // Support both sceneThresholds and thresholds alias
  const thresholdsToUse =
    config.thresholds ||
    config.sceneThresholds ||
    DEFAULT_CONFIG.sceneThresholds
  const mergedConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    sceneThresholds: thresholdsToUse,
  }
  const { maxXP, sceneThresholds, onSceneUnlock, onXPChange } = mergedConfig

  const [state, setState] = useState<ScrollXPState>({
    currentXP: 0,
    currentScene: 0,
    velocity: 0,
    progress: 0,
    sceneProgress: 0,
    isUnlocking: false,
  })

  const lastScrollY = useRef(0)
  const lastScrollTime = useRef<number | null>(null)
  const velocityDecayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScene = useRef(0)

  // Store config in refs to avoid dependency issues
  const maxXPRef = useRef(maxXP)
  const sceneThresholdsRef = useRef(sceneThresholds)
  const onSceneUnlockRef = useRef(onSceneUnlock)
  const onXPChangeRef = useRef(onXPChange)

  // Update refs when config changes
  useEffect(() => {
    maxXPRef.current = maxXP
    sceneThresholdsRef.current = sceneThresholds
    onSceneUnlockRef.current = onSceneUnlock
    onXPChangeRef.current = onXPChange
  }, [maxXP, sceneThresholds, onSceneUnlock, onXPChange])

  // Calculate which scene the user is in based on XP
  const getSceneFromXP = (xp: number): number => {
    for (let i = sceneThresholdsRef.current.length - 1; i >= 0; i--) {
      if (xp >= sceneThresholdsRef.current[i]) {
        return i
      }
    }
    return 0
  }

  // Calculate progress within current scene
  const getSceneProgress = (xp: number, sceneIndex: number): number => {
    const sceneStart = sceneThresholdsRef.current[sceneIndex]
    const sceneEnd =
      sceneThresholdsRef.current[sceneIndex + 1] || maxXPRef.current
    const sceneRange = sceneEnd - sceneStart
    return Math.min(1, Math.max(0, (xp - sceneStart) / sceneRange))
  }

  // Handle scroll events - stable reference, no dependencies
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const now = Date.now()

      // Prevent division by zero
      if (scrollHeight <= 0) return

      // Calculate scroll progress (0-1)
      const progress = Math.min(1, Math.max(0, scrollY / scrollHeight))

      // Calculate XP from progress
      const xp = Math.round(progress * maxXPRef.current)

      // Calculate velocity (pixels per second, capped at 500)
      const lastTime = lastScrollTime.current || now
      const timeDelta = now - lastTime
      const scrollDelta = Math.abs(scrollY - lastScrollY.current)
      const rawVelocity = timeDelta > 0 ? (scrollDelta / timeDelta) * 1000 : 0
      const velocity = Math.min(500, rawVelocity)

      // Determine current scene
      const sceneIndex = getSceneFromXP(xp)
      const sceneProgress = getSceneProgress(xp, sceneIndex)

      // Check for scene unlock
      const isNewScene = sceneIndex > lastScene.current
      if (isNewScene && onSceneUnlockRef.current) {
        onSceneUnlockRef.current(sceneIndex)
      }
      lastScene.current = sceneIndex

      // Update state
      setState({
        currentXP: xp,
        currentScene: sceneIndex,
        velocity,
        progress,
        sceneProgress,
        isUnlocking: isNewScene,
      })

      // Callback
      if (onXPChangeRef.current) {
        onXPChangeRef.current(xp, velocity)
      }

      // Track for next calculation
      lastScrollY.current = scrollY
      lastScrollTime.current = now

      // Decay velocity when scrolling stops
      if (velocityDecayRef.current) {
        clearTimeout(velocityDecayRef.current)
      }
      velocityDecayRef.current = setTimeout(() => {
        setState({
          currentXP: xp,
          currentScene: sceneIndex,
          velocity: 0,
          progress,
          sceneProgress,
          isUnlocking: false,
        })
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial calculation
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (velocityDecayRef.current) {
        clearTimeout(velocityDecayRef.current)
      }
    }
  }, []) // Empty deps - only run once on mount

  return state
}

/**
 * getVelocityIntensity - Convert velocity to 0-1 intensity for visual effects
 * Maps 0-500 velocity to 0-1 intensity with easing
 */
export function getVelocityIntensity(velocity: number): number {
  const normalized = Math.min(1, velocity / 500)
  // Ease-out curve for more responsive feel
  return 1 - Math.pow(1 - normalized, 2)
}

/**
 * Scene unlock thresholds preset
 */
export const UNLOCKED_THRESHOLDS = {
  SCENE_0_BASE: 0,
  SCENE_1_HARDWARE: 2000,
  SCENE_2_VIRTUAL_SHIFTING: 4000,
  SCENE_3_PREMIUM: 6000,
  SCENE_4_GLOBAL_SCALE: 8000,
  COMPLETE: 10000,
}
