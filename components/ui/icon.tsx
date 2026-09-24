import { cn } from '@/lib/utils'
import { type SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Size in pixels or Tailwind class */
  size?: number | string
  /** Optional aria-label for accessibility */
  label?: string
}

/**
 * Icon wrapper component for consistent sizing and accessibility
 *
 * @example
 * import BadgeVerified from '@/icons/ui/badges/badge-verified.svg'
 *
 * <Icon as={BadgeVerified} size={24} label="Verified badge" className="text-blue-500" />
 */
export function Icon({
  as: Component,
  size = 24,
  label,
  className,
  ...props
}: IconProps & { as: React.ComponentType<SVGProps<SVGSVGElement>> }) {
  const sizeValue = typeof size === 'number' ? `${size}px` : size

  return (
    <Component
      aria-label={label}
      aria-hidden={!label}
      className={cn('inline-block shrink-0', className)}
      style={{
        width: sizeValue,
        height: sizeValue,
        ...props.style,
      }}
      {...props}
    />
  )
}
