import { cn } from '@/lib/utils'

interface SunburstProps {
  /** light: cream with brand-tinted rays (cards). dark: ink with glowing rays (heroes). */
  tone?: 'light' | 'dark'
  /** Number of ray pairs around the circle */
  rays?: number
  /** Where the rays radiate from, as a CSS position */
  origin?: string
  /** Slowly rotate the rays (disabled for reduced motion) */
  spin?: boolean
  className?: string
}

/**
 * Retro sunburst backdrop for transparent product imagery.
 *
 * Pure CSS (a repeating conic gradient plus a center glow) colored from the
 * themeable brand variables, so it follows campaign takeovers automatically:
 * hot pink by default, the campaign's primary color during a takeover.
 * Absolutely positioned: place it inside a relative container, behind content.
 */
export default function Sunburst({
  tone = 'light',
  rays = 16,
  origin = '50% 55%',
  spin = false,
  className,
}: SunburstProps) {
  const step = 360 / rays
  const half = step / 2
  const ray = (channelVar: string, alpha: number) =>
    `rgb(var(${channelVar}) / ${alpha})`

  const layers =
    tone === 'light'
      ? {
          base: '#FFFBF0',
          rays: `repeating-conic-gradient(from 0deg at ${origin}, ${ray('--color-brand-primary-light', 0.32)} 0deg ${half}deg, ${ray('--color-brand-primary-light', 0.12)} ${half}deg ${step}deg)`,
          glow: `radial-gradient(circle at ${origin}, rgb(255 251 240 / 0.95) 0%, rgb(255 251 240 / 0.55) 22%, transparent 60%)`,
        }
      : {
          base: ray('--color-brand-ink', 1),
          rays: `repeating-conic-gradient(from 0deg at ${origin}, ${ray('--color-brand-primary', 0.3)} 0deg ${half}deg, ${ray('--color-brand-primary', 0.08)} ${half}deg ${step}deg)`,
          glow: `radial-gradient(circle at ${origin}, ${ray('--color-brand-primary-light', 0.45)} 0%, ${ray('--color-brand-primary', 0.15)} 30%, transparent 65%)`,
        }

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{ backgroundColor: layers.base }}
    >
      {/* Oversized so the corners stay covered while the rays rotate */}
      <div
        className={cn(
          'absolute -inset-1/2',
          spin && 'motion-safe:animate-[sunburst-spin_120s_linear_infinite]'
        )}
        style={{ backgroundImage: layers.rays }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: layers.glow }}
      />
      {tone === 'dark' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse at ${origin}, transparent 40%, ${ray('--color-brand-ink', 0.85)} 100%)`,
          }}
        />
      )}
    </div>
  )
}
