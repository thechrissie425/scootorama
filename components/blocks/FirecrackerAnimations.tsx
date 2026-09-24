'use client'

import React from 'react'

// --- ANIMATION TYPES ---
interface Particle {
  id: number
  left: number
  top: number
  delay: number
  duration: number
  size: number
  color: string
  shape: 'parallelogram' | 'diamond' | 'triangle'
  skew?: number
}

interface ConfettiLayerProps {
  palette: string[]
  density?: 'low' | 'medium' | 'high'
  particleStyle?: 'none' | 'stars' | 'snowflakes' | 'hearts'
}

// --- OPTIMIZED CONFETTI COMPONENT ---
export const ConfettiLayer = React.memo(
  ({
    palette,
    density = 'medium',
    particleStyle = 'none',
  }: ConfettiLayerProps) => {
    // Determine particle count based on density
    const particleCount = density === 'low' ? 5 : density === 'high' ? 12 : 8

    // Determine shapes based on particleStyle
    const getShape = React.useCallback(
      (index: number): 'parallelogram' | 'diamond' | 'triangle' => {
        if (particleStyle === 'stars') return 'diamond'
        if (particleStyle === 'snowflakes') return 'diamond'
        if (particleStyle === 'hearts') return 'diamond'
        return ['parallelogram', 'diamond'][index % 2] as
          | 'parallelogram'
          | 'diamond'
      },
      [particleStyle]
    )

    // Desktop particles (original massive confetti)
    const desktopParticles: Particle[] = React.useMemo(
      () =>
        Array.from({ length: particleCount }).map((_, i) => ({
          id: i,
          left: 10 + ((i * 61.8033988749895) % 80), // Original golden ratio distribution
          top: -50 - ((i * 15) % 100),
          delay: i * 0.8,
          duration: 6 + ((i * 1) % 4),
          size: 200 + ((i * 30) % 120), // Original massive sizes
          color: palette[i % palette.length] || 'rgb(252, 252, 252)',
          shape: getShape(i),
          skew: 15 + ((i * 8) % 25),
        })),
      [palette, particleCount, getShape]
    )

    // Mobile particles
    const mobileParticles: Particle[] = React.useMemo(
      () =>
        Array.from({ length: particleCount }).map((_, i) => ({
          id: i + 100, // Different IDs to avoid conflicts
          left: i * 12 + ((i * 7) % 8), // Better mobile distribution across more of the screen
          top: -30 - i * 20,
          delay: i * 1.5,
          duration: 7 + (i % 4),
          size: 80 + ((i * 25) % 80), // Larger for mobile: 80-160px
          color: palette[i % palette.length] || 'rgb(252, 252, 252)',
          shape: getShape(i),
          skew: 10 + ((i * 4) % 15), // Slightly more dramatic skew
        })),
      [palette, particleCount, getShape]
    )

    const keyframes = `
    @keyframes fall {
      0% { transform: translateY(0) rotate(0deg); opacity: 0; }
      10% { opacity: 0.8; }
      20% { opacity: 0.9; }
      80% { opacity: 0.9; }
      95% { opacity: 0.7; }
      100% { transform: translateY(150vh) rotate(180deg); opacity: 0; }
    }
  `

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <style dangerouslySetInnerHTML={{ __html: keyframes }} />

        {/* Helper to render particles */}
        {[desktopParticles, mobileParticles].map((particles, idx) => (
          <div
            key={idx}
            className={idx === 0 ? 'hidden lg:block' : 'block lg:hidden'}
          >
            {particles.map(p => {
              let clipPath = ''
              if (p.shape === 'parallelogram')
                clipPath = `polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)`
              else if (p.shape === 'diamond')
                clipPath = `polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)`
              else if (p.shape === 'triangle')
                clipPath = `polygon(50% 0%, 100% 100%, 0% 100%)`

              // Override clip path for specific particle styles
              if (particleStyle === 'hearts') {
                // Heart shape using path
                clipPath = `path('M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z')`
              } else if (particleStyle === 'stars') {
                // 5-pointed star
                clipPath = `polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)`
              } else if (particleStyle === 'snowflakes') {
                // 6-pointed snowflake approximation
                clipPath = `polygon(50% 0%, 55% 35%, 90% 20%, 65% 50%, 90% 80%, 55% 65%, 50% 100%, 45% 65%, 10% 80%, 35% 50%, 10% 20%, 45% 35%)`
              }

              return (
                <div
                  key={p.id}
                  className="absolute"
                  style={{
                    left: `${p.left}%`,
                    top: `${p.top}vh`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    clipPath: clipPath,
                    opacity: 0.7,
                    animation: `fall ${p.duration}s ease-out ${p.delay}s infinite`,
                    willChange: 'transform',
                    mixBlendMode: 'multiply',
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
    )
  }
)

ConfettiLayer.displayName = 'ConfettiLayer'

export default ConfettiLayer
