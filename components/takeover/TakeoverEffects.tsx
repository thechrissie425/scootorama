'use client'

import { useMemo } from 'react'
import type { TakeoverTheme } from '@/lib/takeoverManager'

interface TakeoverEffectsProps {
  theme: TakeoverTheme
}

const DENSITY = { low: 24, medium: 44, high: 72 } as const

/** Deterministic PRNG so server and client render identical positions */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Decorative campaign effects driven by the takeover theme: a one-time
 * confetti shower on page load and/or ambient particles (twinkling stars).
 * Purely visual: pointer-events are off and everything is hidden for users
 * who prefer reduced motion (see the takeover-* keyframes in globals.css).
 */
export default function TakeoverEffects({ theme }: TakeoverEffectsProps) {
  const effects = theme.effects
  const colors = useMemo(() => {
    const fromTheme = (theme.colors?.confetti || [])
      .map(c => c?.hex)
      .filter((c): c is string => Boolean(c))
    return fromTheme.length
      ? fromTheme
      : [theme.colors?.primary?.hex, theme.colors?.accent?.hex].filter(
          (c): c is string => Boolean(c)
        )
  }, [theme])

  const confetti = useMemo(() => {
    if (!effects?.confetti) return []
    const rand = mulberry32(7)
    const count = DENSITY[effects.confettiDensity || 'medium']
    return Array.from({ length: count }, (_, i) => ({
      left: rand() * 100,
      delay: rand() * 2.5,
      duration: 3.5 + rand() * 3,
      size: 6 + rand() * 8,
      rotate: rand() * 360,
      drift: (rand() - 0.5) * 120,
      color: colors[i % Math.max(colors.length, 1)] || '#FFD21F',
      round: rand() > 0.7,
    }))
  }, [effects, colors])

  const stars = useMemo(() => {
    if (effects?.particles !== 'stars') return []
    const rand = mulberry32(42)
    return Array.from({ length: 60 }, () => ({
      left: rand() * 100,
      top: rand() * 70,
      size: 2 + rand() * 3,
      delay: rand() * 4,
      duration: 2 + rand() * 3,
    }))
  }, [effects])

  if (!confetti.length && !stars.length) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45] overflow-hidden motion-reduce:hidden"
    >
      {stars.map((s, i) => (
        <span
          key={`s${i}`}
          className="absolute rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.6)]"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: 0,
            animation: `takeover-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      {confetti.map((c, i) => (
        <span
          key={`c${i}`}
          className={
            c.round ? 'absolute rounded-full' : 'absolute rounded-[2px]'
          }
          style={
            {
              left: `${c.left}%`,
              top: '-24px',
              width: c.size,
              height: c.round ? c.size : c.size * 0.45,
              background: c.color,
              transform: `rotate(${c.rotate}deg)`,
              '--takeover-drift': `${c.drift}px`,
              animation: `takeover-fall ${c.duration}s cubic-bezier(.25,.6,.4,1) ${c.delay}s 1 forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
